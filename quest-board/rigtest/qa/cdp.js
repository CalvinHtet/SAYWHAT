// QA's small CDP library for a headless Chrome on QA's own port (9370 by default, CHROME_PORT to change). Nothing installed:
// runs under node.sh (VS Code's Electron as Node 24, which has fetch and WebSocket).
//   const { browser } = require('./cdp.js'); const br = await browser(); const pg = await br.page({ fresh: true }); ...
// Each page can live in its own browser context (fresh: true) so cache, storage and service workers start empty.
const fs = require('fs'), path = require('path'), { spawn } = require('child_process');
const PORT = +process.env.CHROME_PORT || 9370;
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Start a headless Chrome on PORT if none answers there (left running for the next script).
async function ensureChrome() {
  try { await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json(); return; } catch (e) {}
  const dir = path.join(process.env.TEMP || 'C:/Temp', 'qa-chrome-' + PORT);
  const ch = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${dir}`, '--no-first-run', '--no-default-browser-check',
    '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--window-size=390,844', 'about:blank'], { detached: true, stdio: 'ignore' });
  ch.unref();
  for (let i = 0; i < 60; i++) { await sleep(250); try { await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json(); return; } catch (e) {} }
  throw new Error('chrome did not start on ' + PORT);
}

async function browser() {
  await ensureChrome();
  const v = await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json();
  const ws = new WebSocket(v.webSocketDebuggerUrl);
  await new Promise((ok, no) => { ws.onopen = ok; ws.onerror = () => no(new Error('ws')); });
  let id = 0; const pend = new Map(), handlers = [];
  ws.onmessage = (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pend.has(m.id)) { const p = pend.get(m.id); pend.delete(m.id); m.error ? p.no(new Error(p.method + ': ' + m.error.message)) : p.ok(m.result); return; }
    if (m.method) handlers.forEach((h) => h(m));
  };
  const send = (method, params = {}, sessionId) => new Promise((ok, no) => { const i = ++id; pend.set(i, { ok, no, method }); ws.send(JSON.stringify(sessionId ? { id: i, method, params, sessionId } : { id: i, method, params })); });
  const opened = [];
  async function page(o = {}) {
    let browserContextId = o.ctx, ownCtx = false;
    if (o.fresh && !o.ctx) { browserContextId = (await send('Target.createBrowserContext', { disposeOnDetach: true })).browserContextId; ownCtx = true; }
    const { targetId } = await send('Target.createTarget', { url: 'about:blank', browserContextId });
    const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
    const s = (method, params) => send(method, params, sessionId);
    const listeners = {};
    handlers.push((m) => { if (m.sessionId === sessionId && listeners[m.method]) listeners[m.method].forEach((f) => f(m.params)); });
    const on = (method, f) => { (listeners[method] = listeners[method] || []).push(f); return () => { const l = listeners[method], i = l.indexOf(f); if (i >= 0) l.splice(i, 1); }; };
    const errs = [];
    on('Runtime.exceptionThrown', (p) => errs.push(((p.exceptionDetails.exception && p.exceptionDetails.exception.description) || p.exceptionDetails.text || '').slice(0, 300)));
    on('Runtime.consoleAPICalled', (p) => { if (p.type === 'error') errs.push('console.error ' + p.args.map((a) => a.value || a.description || '').join(' ').slice(0, 300)); });
    await s('Page.enable'); await s('Runtime.enable');
    if (o.phone !== false) {
      await s('Emulation.setDeviceMetricsOverride', { width: o.width || 390, height: o.height || 844, deviceScaleFactor: o.dpr || 3, mobile: true });
      await s('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
      await s('Emulation.setUserAgentOverride', { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1' });
    } else if (o.width) {
      await s('Emulation.setDeviceMetricsOverride', { width: o.width, height: o.height, deviceScaleFactor: o.dpr || 1, mobile: false });
    }
    const ev = async (expr, timeout) => {
      const r = await s('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true, userGesture: true, timeout });
      if (r.exceptionDetails) throw new Error('eval: ' + ((r.exceptionDetails.exception && r.exceptionDetails.exception.description) || r.exceptionDetails.text).slice(0, 400));
      return r.result.value;
    };
    const wait = async (expr, ms = 60000, every = 250) => { const end = Date.now() + ms; while (Date.now() < end) { try { const v = await ev(expr); if (v) return v; } catch (e) {} await sleep(every); } throw new Error('timeout waiting for ' + expr.slice(0, 80)); };
    const go = async (url, waitLoad = true) => {
      const loaded = new Promise((ok) => on('Page.loadEventFired', ok));
      await s('Page.navigate', { url });
      if (waitLoad) await Promise.race([loaded, sleep(120000)]);
    };
    const shot = async (file, clip) => { const r = await s('Page.captureScreenshot', Object.assign({ format: 'png' }, clip ? { clip: Object.assign({ scale: 1 }, clip) } : {})); fs.writeFileSync(file, Buffer.from(r.data, 'base64')); return file; };
    const tap = async (x, y) => { for (const type of ['mousePressed', 'mouseReleased']) await s('Input.dispatchMouseEvent', { type, x, y, button: 'left', clickCount: 1 }); };
    const close = async () => { try { await send('Target.closeTarget', { targetId }); } catch (e) {} if (browserContextId && ownCtx && !pg.keepCtx) { try { await send('Target.disposeBrowserContext', { browserContextId }); } catch (e) {} } };
    const pg = { s, on, ev, wait, go, shot, tap, close, errs, targetId, sessionId, browserContextId };
    opened.push(pg); return pg;
  }
  return { send, page, close: async () => { for (const p of opened) await p.close(); ws.close(); } };
}
module.exports = { browser, sleep, PORT };
