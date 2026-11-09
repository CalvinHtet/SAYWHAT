// Tiny CLI for a long-running headless Chrome (port 9350): each call connects, does one thing, disconnects.
//   q.js go <url> | ev "<expr>" | shot <name> | text | acts | errs | init
const fs = require("fs"), path = require("path");
const PORT = 9350, OUT = path.join(__dirname, "out");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function attach() {
  const list = await (await fetch("http://127.0.0.1:" + PORT + "/json/list")).json();
  let pg = list.find((t) => t.type === "page" && /^(about:blank|http)/.test(t.url));
  if (!pg) pg = await (await fetch("http://127.0.0.1:" + PORT + "/json/new?about:blank", { method: "PUT" })).json();
  const ws = new WebSocket(pg.webSocketDebuggerUrl);
  await new Promise((ok, no) => { ws.onopen = ok; ws.onerror = () => no(new Error("ws")); });
  let id = 0; const pend = new Map();
  ws.onmessage = (ev) => { const m = JSON.parse(ev.data); if (m.id && pend.has(m.id)) { const p = pend.get(m.id); pend.delete(m.id); m.error ? p.no(new Error(m.error.message)) : p.ok(m.result); } };
  const send = (method, params = {}) => new Promise((ok, no) => { const i = ++id; pend.set(i, { ok, no }); ws.send(JSON.stringify({ id: i, method, params })); });
  return { send, close: () => ws.close() };
}
async function ev(c, expr) {
  const r = await c.send("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true, userGesture: true });
  if (r.exceptionDetails) return "EVAL ERROR: " + ((r.exceptionDetails.exception && r.exceptionDetails.exception.description) || r.exceptionDetails.text);
  return r.result.value;
}
const ERRHOOK = `(function(){function add(s){try{var a=JSON.parse(sessionStorage.getItem('__qaErr')||'[]');a.push(new Date().toISOString().slice(11,19)+' '+String(s).slice(0,400));sessionStorage.setItem('__qaErr',JSON.stringify(a.slice(-80)))}catch(e){}}
window.addEventListener('error',function(e){add('ERR '+e.message+' @'+(e.filename||'').split('/').pop()+':'+e.lineno)});
window.addEventListener('unhandledrejection',function(e){add('REJ '+(e.reason&&(e.reason.stack||e.reason.message)||e.reason))});
var ce=console.error;console.error=function(){add('CONSOLE '+[].map.call(arguments,function(a){return a&&a.stack||String(a)}).join(' '));return ce.apply(console,arguments)};})();`;
(async () => {
  const [cmd, arg, arg2] = process.argv.slice(2);
  const c = await attach();
  try {
    if (cmd === "init") { await c.send("Page.enable"); await c.send("Page.addScriptToEvaluateOnNewDocument", { source: ERRHOOK }); console.log("ok"); }
    else if (cmd === "go") { await c.send("Page.enable"); await c.send("Page.navigate", { url: arg }); console.log("navigated"); }
    else if (cmd === "ev") console.log(JSON.stringify(await ev(c, arg), null, 1));
    else if (cmd === "wait") { const end = Date.now() + (+arg2 || 30000); let v; while (Date.now() < end) { v = await ev(c, arg); if (v && !String(v).startsWith("EVAL ERROR")) break; await sleep(300); } console.log(JSON.stringify(v)); }
    else if (cmd === "shot") {
      const full = arg2 === "full";
      const sy = await ev(c, "scrollY"); let p = { format: "png", clip: { x: 0, y: +sy || 0, width: 390, height: 844, scale: 1 } };
      if (full) { const m = await c.send("Page.getLayoutMetrics"); p = { format: "png", captureBeyondViewport: true, clip: { x: 0, y: 0, width: 390, height: Math.min(m.cssContentSize.height, 5000), scale: 1 } }; }
      const r = await c.send("Page.captureScreenshot", p);
      fs.writeFileSync(path.join(OUT, arg + ".png"), Buffer.from(r.data, "base64")); console.log("saved " + arg + ".png");
    }
    else if (cmd === "text") console.log(await ev(c, "(function(){var NL=String.fromCharCode(10);var m=[].slice.call(document.querySelectorAll('#layer .modal'));return (m.length?'[MODAL] '+m.map(function(x){return x.innerText}).join(NL+'---'+NL)+NL+'[/MODAL]'+NL:'')+document.getElementById('app').innerText})()"));
    else if (cmd === "acts") console.log(await ev(c, "[].map.call(document.querySelectorAll('[data-act],[data-v],button'),function(e){var r=e.getBoundingClientRect();return (e.dataset.act?'act='+e.dataset.act:'')+(e.dataset.v?' v='+e.dataset.v:'')+(e.dataset.id?' id='+e.dataset.id:'')+' ['+(e.innerText||e.getAttribute('aria-label')||'').split(String.fromCharCode(10)).join(' ').trim().slice(0,40)+']'+(r.width?'':' (hidden)')}).join(String.fromCharCode(10))"));
    else if (cmd === "tap") {
      const x = +arg, y = +arg2;
      for (const type of ["mouseMoved", "mousePressed", "mouseReleased"]) await c.send("Input.dispatchMouseEvent", { type, x, y, button: "left", clickCount: 1, pointerType: "mouse" });
      console.log("tapped " + x + "," + y);
    }
    else if (cmd === "errs") console.log(await ev(c, "sessionStorage.getItem('__qaErr')||'[]'"));
    else console.log("unknown cmd");
  } finally { c.close(); }
  process.exit(0);
})().catch((e) => { console.log("FAIL " + e.message); process.exit(1); });
