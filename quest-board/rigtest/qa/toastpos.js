// v1.02 toasts above the tab bar (LEAD's 83feea0): a fresh character on a sandbox at phone sizes; a real toast from finishing the first
// step ("First step done") and a probe .pop: their box against the tab bar's, and the exit animation still runs.   BASE=<sandbox> node toastpos.js
const { chromium } = require('playwright'); const BASE = process.env.BASE || 'http://127.0.0.1:8817';
let bad = 0; const ok = (n, c, g) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + n + '  ' + JSON.stringify(g)); };
(async () => { const b = await chromium.launch();
  for (const [w, h] of [[375, 812], [360, 740], [390, 844]]) { const c = await b.newContext({ viewport: { width: w, height: h }, isMobile: true, hasTouch: true }); const p = await c.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto(BASE + '/'); await p.waitForFunction(() => window.__qb && window.__qb.x && document.querySelector('#app'), null, { timeout: 120000 }); await p.waitForTimeout(1500);
    await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.welcomed = 1; S.char = window.__qb.fixChar({ name: 'Qa', sex: 'f' }); S.quests = [{ id: 'q1', name: 'Dishes', xp: 10, c: 5, cl: 'home', rep: 'once' }]; x.persist(); x.render(); });
    await p.waitForTimeout(2500); await p.evaluate(() => { document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); const s = document.querySelector('#qbtour [data-tour=skip]'); s && s.click(); });
    await p.evaluate(() => window.__qb.x().toggle('q1'));
    let real = null; for (let k = 0; k < 20 && !real; k++) { await p.waitForTimeout(150); real = await p.evaluate(() => { const e = [...document.querySelectorAll('#layer .pop')][0]; if (!e) return null; const r = e.getBoundingClientRect(); return { txt: e.textContent.slice(0, 30), top: Math.round(r.top), bottom: Math.round(r.bottom) }; }); }
    const nav = await p.evaluate(() => { const r = document.querySelector('.nav').getBoundingClientRect(); return { top: Math.round(r.top), bottom: Math.round(r.bottom) }; });
    const probe = await p.evaluate(async () => { const el = document.createElement('div'); el.className = 'pop mono'; el.textContent = 'probe'; document.getElementById('layer').appendChild(el); const r = el.getBoundingClientRect(); el.classList.add('out'); await new Promise((o) => setTimeout(o, 500)); const op = getComputedStyle(el).opacity; el.remove(); return { top: Math.round(r.top), bottom: Math.round(r.bottom), outOpacity: op }; });
    ok(`${w}x${h}: a toast sits above the tab bar`, (!real || real.bottom <= nav.top) && probe.bottom <= nav.top && probe.top > h / 2, { real, probe, nav });
    ok(`${w}x${h}: the exit fade still runs, no page errors`, +probe.outOpacity < 0.5 && !errs.length, { op: probe.outOpacity, errs });
    await c.close(); }
  console.log(bad ? 'FAILED ' + bad : 'PASS'); await b.close(); })();
