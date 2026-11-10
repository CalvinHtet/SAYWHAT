// rc-0.90 W7 + W38 (BUILDER's inbox and coin pills): shared helpers for rc090_inbox*.js.
// boot(br,{width,seed}) loads QA's advanced seed into a fresh profile and opens the app; vis(sel) finds the visible copy of an
// element (its centre, and what a finger at that centre would hit); tapSel(sel) taps that centre like a finger.
const fs = require('fs');
const { sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8818';
const OUT = process.env.OUT || 'C:/Users/clvh/qa-wt/out/rc090/inbox'; fs.mkdirSync(OUT, { recursive: true });
const SEEDF = process.env.SEED || 'C:/Users/clvh/qa-wt/out/seed_adv2.json';

async function boot(br, o = {}) {
  const pg = await br.page({ fresh: true, width: o.width || 390, height: o.height || 844 });
  if (o.seed !== false) {
    const seed = JSON.parse(fs.readFileSync(SEEDF, 'utf8'));
    await pg.go(BASE + '/version.json');
    await pg.ev(`(function(d){localStorage.clear();Object.keys(d).forEach(function(k){localStorage.setItem(k,d[k])});return 1})(${JSON.stringify(seed)})`);
  }
  await pg.go(BASE + '/');
  await pg.wait('!!(window.__qb && document.querySelector("#app") && !document.querySelector("#app .boot"))', 120000);
  await sleep(o.settle || 2500);
  return pg;
}
const modals = (pg) => pg.ev('[].map.call(document.querySelectorAll("#layer .modal"),function(m){return (m.className+": "+m.innerText.slice(0,80)).replace(/\\s+/g," ")}).join(" | ")');
const closeAll = (pg) => pg.ev('(function(){document.querySelectorAll("#layer .modal").forEach(function(e){e.remove()});return 1})()');
// the visible copy of sel (inside root if given): its centre, size, and whether a tap at the centre lands on it
async function vis(pg, sel, root) {
  return pg.ev(`(function(){var R=${root ? `document.querySelector(${JSON.stringify(root)})` : 'document'};if(!R)return null;
    var L=[].filter.call(R.querySelectorAll(${JSON.stringify(sel)}),function(e){var r=e.getBoundingClientRect();return r.width>0&&r.height>0&&getComputedStyle(e).visibility!=="hidden"});
    if(!L.length)return null;var e=L[0];e.scrollIntoView({block:"center",inline:"nearest"});var r=e.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2,h=document.elementFromPoint(x,y);
    return {n:L.length,x:Math.round(x),y:Math.round(y),w:Math.round(r.width),h:Math.round(r.height),top:Math.round(r.top),hit:!!(h&&(h===e||e.contains(h))),hitWhat:h?(h.tagName+"."+String(h.className&&h.className.baseVal!=null?h.className.baseVal:h.className).slice(0,40)):"none",txt:(e.innerText||"").trim().slice(0,40),aria:e.getAttribute("aria-label")||""}})()`);
}
async function tapSel(pg, sel, root) { const v = await vis(pg, sel, root); if (!v) return null; await pg.tap(v.x, v.y); return v; }
const S = (pg, expr) => pg.ev(`(function(){var x=window.__qb.x(),S=x.S;return (${expr})})()`);
const coins = (pg) => S(pg, 'Math.floor(S.coins)');
// the pill's number over time (after a purchase): [ms, text] pairs
async function pillRun(pg, sel, ms = [0, 120, 300, 500, 800, 1200]) {
  const out = []; const t0 = Date.now();
  for (const t of ms) { const w = t - (Date.now() - t0); if (w > 0) await sleep(w); out.push([t, await pg.ev(`(function(){var e=document.querySelector(${JSON.stringify(sel)});return e?(e.querySelector("b")||e).textContent.trim():"NONE"})()`)]); }
  return out;
}
const num = (t) => +String(t).replace(/[^0-9-]/g, '');
// a clip around an element (padded), for a readable screenshot
async function clipOf(pg, sel, pad = 8) {
  return pg.ev(`(function(){var e=document.querySelector(${JSON.stringify(sel)});if(!e)return null;var r=e.getBoundingClientRect();return {x:Math.max(0,r.left-${pad}),y:Math.max(0,r.top-${pad}),width:Math.min(innerWidth,r.width+${2 * pad}),height:r.height+${2 * pad}}})()`);
}
module.exports = { BASE, OUT, boot, modals, closeAll, vis, tapSel, S, coins, pillRun, num, clipOf, sleep };
