// Frame rate in every room window (after LEAD's 19ef0d9 lag fix; Cal's iPhone saw 37-38 fps and 214/421 ms frames): every room
// fully bought, 390x844 at x3 with the CPU 4x slower, each window open 3 s then measured 4 s: fps, worst frame, frames over 50 ms.
//   BASE=<server> node roomfps.js
const { chromium } = require('playwright');
const { ORDER } = require('./lib.js');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true }); const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 140)));
  await p.goto(process.env.BASE + '/dist/index.html'); await p.waitForFunction(() => document.querySelector('[data-act="ccnext"]'), null, { timeout: 90000 });
  await p.fill('#ccname', 'Cal'); await p.click('[data-act="ccnext"]'); await p.waitForFunction(() => document.querySelector('[data-act="ccdone"]'), null, { timeout: 60000 }); await p.waitForTimeout(600);
  await p.evaluate(() => document.querySelector('[data-act="ccdone"]').click()); await p.waitForTimeout(3000);
  await p.evaluate((order) => { window.__qbRooms.unlockAll(); const S = window.__qb.x().S; order.forEach((t) => { try { window.__qbRooms.all(t, 1); } catch (e) {} }); document.querySelectorAll('#layer .modal,.dropsplash').forEach((m) => m.remove()); document.querySelector('.nav button[data-v="board"]').click(); }, ORDER);
  await p.waitForTimeout(1500); const cdp = await ctx.newCDPSession(p); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  const rows = [];
  const LIST = (process.env.ROOMS || ORDER.join(',')).split(','), LIVE = !!process.env.LIVE;
  if (LIVE) await p.evaluate(() => { const now = new Date(Date.now()), t = new Date(now); t.setHours(21, 0, 0, 0); window.__qbShift = (window.__qbShift || 0) + (t - now); });
  for (const t of LIST) {
    const i = await p.evaluate((t) => { document.querySelectorAll('#layer .modal,.dropsplash').forEach((m) => m.remove()); const S = window.__qb.x().S; const i = S.base.slots.findIndex((s) => s && s.t === t); if (i >= 0) window.__qb.roomModal(i); return i; }, t);
    if (i < 0) { rows.push([t, 'not built']); continue; }
    if (LIVE) { await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 }); let ppl = 0;
      await p.evaluate(() => { document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); document.querySelector('.nav button[data-v="hideout"]').click(); }); await p.waitForTimeout(2500);
      for (let bi = 0; bi < 3 && !ppl; bi++) { await p.evaluate(() => { document.querySelectorAll('#layer .modal,.dropsplash').forEach((e) => e.remove()); const st = [...document.querySelectorAll('button')].find((e) => /Street/.test(e.textContent)); if (st) st.click(); }); await p.waitForTimeout(800);
        await p.evaluate((bi) => { const g = document.querySelectorAll('[data-act="bldgo"]')[bi]; if (g) g.dispatchEvent(new MouseEvent('click', { bubbles: true })); }, bi); await p.waitForTimeout(2000);
        await p.evaluate((i) => { document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); window.__qb.roomModal(i); }, i); await p.waitForTimeout(9000);
        ppl = await p.evaluate((i) => Object.values(window.__qbLoft().A).filter((a) => a.pv && a.pvslot === i).length, i); }
      console.log(`  (${t}: ${ppl} people in the window)`); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 }); }
    await p.waitForTimeout(3000);
    const r = await p.evaluate(async () => { let n = 0, worst = 0, over = 0, last = performance.now(); await new Promise((res) => { const t0 = performance.now(); const f = (ts) => { const d = ts - last; last = ts; if (n > 2) { if (d > worst) worst = d; if (d > 50) over++; } n++; if (ts - t0 < 4000) requestAnimationFrame(f); else res(); }; requestAnimationFrame(f); }); return { fps: +(n / 4).toFixed(1), worst: Math.round(worst), over }; });
    rows.push([t, r]); console.log(`  ${t.padEnd(11)} ${r.fps} fps, worst ${r.worst} ms, over 50 ms ${r.over}`);
  }
  const slow = rows.filter((r) => typeof r[1] === 'object' && (r[1].fps < 50 || r[1].worst > 100));
  console.log(slow.length ? 'SLOW: ' + slow.map((r) => r[0] + ' ' + r[1].fps + 'fps/' + r[1].worst + 'ms').join(', ') : 'every room window at least 50 fps, worst frame under 100 ms');
  console.log('page errors', errs.length, errs.slice(0, 2)); await b.close();
})();
