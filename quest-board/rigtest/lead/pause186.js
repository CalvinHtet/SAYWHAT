// Cal 11-26 (29zz_v186.js): looping effects hold while out of view and run when in view.
//   PORT=<build server> NODE_PATH=<playwright's parent> node rigtest/lead/pause186.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8838; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 600 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV186 && window.__qbV177, null, { timeout: 90000 });
  const r = await p.evaluate(async () => { document.body.style.minHeight = '4000px'; const mk = (top) => { const d = document.createElement('div'); d.className = 'v77fx'; d.style.cssText = 'position:absolute;left:0;top:' + top + 'px;width:100px;height:100px'; d.innerHTML = '<span class="v77 v77stars"><i style="left:10%;top:10%"></i></span>'; document.body.appendChild(d); return d; };
    const a = mk(50), z = mk(3000); window.scrollTo(0, 0); await new Promise((o) => setTimeout(o, 600)); const st = (d) => getComputedStyle(d.querySelector('i')).animationPlayState;
    const s1 = { near: st(a), far: st(z) }; window.scrollTo(0, 2800); await new Promise((o) => setTimeout(o, 600)); const s2 = { near: st(a), far: st(z) }; return { s1, s2 }; });
  ok(r.s1.near === 'running' && r.s1.far === 'paused', 'in view runs, out of view holds ' + JSON.stringify(r.s1));
  ok(r.s2.near === 'paused' && r.s2.far === 'running', 'scrolling swaps them ' + JSON.stringify(r.s2));
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs)); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
