// Room-window zoom (LEAD's cc71c5e; Cal: "bring zoom back, but if there is too much lag, then keep it off"): the fully bought ROOM
// (default the Restaurant, the heaviest) in its window at phone size, CPU x4 in Chromium. Frame times while dragging across the picture
// for 2.5 s, unzoomed and zoomed in (two + taps, about 2.6x), taken in turns (A B A B ...) so the machine's load hits both alike; also
// the frame right after a + tap (the redraw). Prints fps and the worst frame for each, and the median of the turns.
//   B=chromium|webkit ROOM=restaurant REPS=3 BASE=<server> node zoomlag.js
const pw = require('playwright');
const ENG = process.env.B || 'chromium', BASE = process.env.BASE || 'http://127.0.0.1:8769', ROOM = process.env.ROOM || 'restaurant', REPS = +(process.env.REPS || 3);
(async () => {
  const b = await pw[ENG].launch(ENG === 'chromium' ? { args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] } : {});
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 }); const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.QBLoft, null, { timeout: 120000 }); await p.waitForTimeout(800);
  await p.evaluate((t) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.gates = Array.from({ length: 200 }, (_, i) => i); S.xp = x.cum(60); S.base.served = 1e6;
    let k = S.base.slots.findIndex((s) => s && s.t === t); if (k < 0) { S.base.slots.push({ t, a: {}, st: 0, pend: 0 }); k = S.base.slots.length - 1; }
    S.base.slots[k].a = Object.fromEntries(x.ADDONS[t].filter((u) => !(u[3] && (u[3].retired || u[3].opens))).map((u) => [u[0], 1])); x.render();
    document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); window.__qb.roomModal(k); }, ROOM);
  await p.waitForTimeout(2500);
  const hasZoom = await p.evaluate(() => !!document.querySelector('.rmodal .lfzin'));
  let cdp = null; if (ENG === 'chromium') { cdp = await ctx.newCDPSession(p); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 }); }
  const box = await (await p.$('#rbigw')).boundingBox();
  const startRec = () => p.evaluate(() => { window.__fr = []; let last = performance.now(); window.__rec = true; const t = () => { const n = performance.now(); window.__fr.push(n - last); last = n; if (window.__rec) requestAnimationFrame(t); }; requestAnimationFrame(t); });
  const stopRec = () => p.evaluate(() => { window.__rec = false; const f = window.__fr.slice(2); const tot = f.reduce((a, c) => a + c, 0); return { fps: +(f.length / (tot / 1000)).toFixed(1), worst: Math.round(Math.max(...f)) }; });
  const drag = async () => { const cx = box.x + box.width / 2, cy = box.y + box.height / 2; await p.mouse.move(cx - 60, cy - 20); await p.mouse.down(); const t0 = Date.now(); let k = 0;
    while (Date.now() - t0 < 2500) { k++; const a = k / 6; await p.mouse.move(cx + Math.cos(a) * 70, cy + Math.sin(a) * 35); } await p.mouse.up(); };
  const zoomTo = async (n) => { await p.evaluate((n) => { const o = document.querySelector('.rmodal .lfzout'); for (let i = 0; i < 6; i++) o && o.click(); const z = document.querySelector('.rmodal .lfzin'); for (let i = 0; i < n; i++) z && z.click(); }, n); await p.waitForTimeout(800); };
  const res = { off: [], on: [], tap: [] };
  for (let r = 0; r < REPS; r++) {
    await zoomTo(0); await startRec(); await drag(); res.off.push(await stopRec());
    if (hasZoom) {
      await zoomTo(0); await startRec(); await p.evaluate(() => { const z = document.querySelector('.rmodal .lfzin'); z.click(); }); await p.waitForTimeout(700); res.tap.push(await stopRec());
      await zoomTo(2); await startRec(); await drag(); res.on.push(await stopRec());
    }
  }
  const med = (a, k) => { const v = a.map((x) => x[k]).sort((x, y) => x - y); return v.length ? v[Math.floor(v.length / 2)] : null; };
  console.log(`${ENG}${cdp ? ' CPU x4' : ''}, ${ROOM} fully bought, 390x844 x3, zoom buttons: ${hasZoom}`);
  console.log('  unzoomed drag:', JSON.stringify(res.off), '-> median', med(res.off, 'fps'), 'fps, worst', med(res.off, 'worst'), 'ms');
  if (hasZoom) { console.log('  zoomed (2.6x) drag:', JSON.stringify(res.on), '-> median', med(res.on, 'fps'), 'fps, worst', med(res.on, 'worst'), 'ms');
    console.log('  a + tap (0.7 s after):', JSON.stringify(res.tap), '-> worst frame median', med(res.tap, 'worst'), 'ms'); }
  console.log('page errors', errs.length, errs.slice(0, 2)); await b.close();
})();
