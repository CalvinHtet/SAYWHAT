// Zooming in a room window (LEAD's 3bcbb44, Cal: "zooming in on any room drastically reduces frame rate"): the fully bought room's
// window at phone size with touch, the CPU slowed, then: zoomed in with + three times, a one-finger pan (40 moves, 16 ms apart) and a
// two-finger pinch (30 steps), each with every frame's time counted (median, p90, worst). Then the behaviour: after the fingers lift
// no CSS transform is left and the viewBox moved; the wheel zooms; - and the reset button go back to the widest view; a drag when not
// zoomed scrolls the window instead of moving the room. Run on the commit before and after.   ROOM=garden BLD=1 CPU=4 node zoomfps.js
const { open } = require('./lib.js');
(async () => {
  const { b, p, errs } = await open({ width: 390, height: 844, owned: 'all', mobile: true });
  const ROOM = process.env.ROOM || 'bedroom', BLD = +(process.env.BLD || 0);
  await p.evaluate((h) => { const now = new Date(Date.now()), t = new Date(now); t.setHours(h, 0, 0, 0); window.__qbShift = (window.__qbShift || 0) + (t - now); }, 13);
  const i = await p.evaluate((R) => { const x = window.__qb.x(), S = x.S; const k = S.base.slots.findIndex((s) => s && s.t === R); const r = S.base.slots[k];
    x.ADDONS[R].forEach((u) => { if (u[3] && (u[3].retired || u[3].opens)) return; r.a[u[0]] = 1; }); S.areaOn = null; S.gates = [5, 10, 20, 30, 40]; S.xp = Math.max(S.xp, x.cum(45)); x.render();
    document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); document.querySelector('.nav button[data-v="hideout"]').click(); return k; }, ROOM);
  await p.waitForTimeout(3500);
  await p.evaluate((B) => { document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); document.querySelectorAll('[data-act="bldgo"]')[B].dispatchEvent(new MouseEvent('click', { bubbles: true })); }, BLD);
  await p.waitForTimeout(6000);
  await p.evaluate((i) => { document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); window.__qb.roomModal(i); }, i);
  await p.waitForTimeout(4000);
  const cdp = await p.context().newCDPSession(p);
  const st = () => p.evaluate(() => { const s = document.querySelector('.rmodal .rbig svg'); const m = document.querySelector('#layer .modal'); return s ? { vb: s.getAttribute('viewBox'), tf: s.style.transform || '', scroll: m ? m.scrollTop : null } : null; });
  const box = await p.evaluate(() => { const r = document.querySelector('.rmodal .rbig svg').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height }; });
  const wide = await st();
  for (let k = 0; k < 3; k++) await p.evaluate(() => document.querySelector('.rmodal .lfpzc button').click());
  await p.waitForTimeout(500);
  const zin = await st();
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: +(process.env.CPU || 4) }); await p.waitForTimeout(1500);
  const rec = () => p.evaluate(() => { window.__fr = []; let last = performance.now(); window.__frOn = 1; const f = (t) => { window.__fr.push(t - last); last = t; if (window.__frOn) requestAnimationFrame(f); }; requestAnimationFrame(f); });
  const stats = async () => { const a = await p.evaluate(() => { window.__frOn = 0; return window.__fr.slice(1); }); a.sort((x, y) => x - y); const q = (f) => Math.round(a[Math.min(a.length - 1, Math.floor(a.length * f))] || 0); return `${a.length} frames, median ${q(.5)} ms, p90 ${q(.9)}, worst ${Math.round(a[a.length - 1] || 0)}`; };
  const touch = (type, pts) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts.map((q, id) => ({ x: q[0], y: q[1], id })) });
  // pan
  await rec(); await touch('touchStart', [[box.x, box.y]]);
  for (let k = 1; k <= 40; k++) { await touch('touchMove', [[box.x + Math.sin(k / 6) * 60, box.y + Math.cos(k / 6) * 40]]); await p.waitForTimeout(16); }
  const midPan = await st(); await touch('touchEnd', []); const pan = await stats(); await p.waitForTimeout(400); const afterPan = await st();
  // pinch
  await rec(); let d = 40; await touch('touchStart', [[box.x - d, box.y], [box.x + d, box.y]]);
  for (let k = 1; k <= 30; k++) { d = 40 + (k <= 15 ? k : 30 - k) * 4; await touch('touchMove', [[box.x - d, box.y], [box.x + d, box.y]]); await p.waitForTimeout(16); }
  await touch('touchEnd', []); const pinch = await stats(); await p.waitForTimeout(400); const afterPinch = await st();
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  console.log(`${ROOM}, CPU x${process.env.CPU || 4}, 390x844 touch`);
  console.log(`  pan:   ${pan}   (transform mid-pan: ${midPan.tf ? 'yes' : 'none'})`);
  console.log(`  pinch: ${pinch}`);
  const ok = (n, c, g) => console.log((c ? '  ok   ' : '  FAIL ') + n + (g ? '  ' + g : ''));
  ok('+ three times zooms in', zin.vb !== wide.vb, `${wide.vb} -> ${zin.vb}`);
  ok('after the pan lifts: no transform left, the view moved', !afterPan.tf && afterPan.vb !== zin.vb, `${afterPan.vb} tf "${afterPan.tf}"`);
  ok('after the pinch lifts: no transform left', !afterPinch.tf, `${afterPinch.vb} tf "${afterPinch.tf}"`);
  await p.mouse.move(box.x, box.y); await p.mouse.wheel(0, -300); await p.waitForTimeout(300); const wh = await st();
  ok('the wheel zooms (no transform)', wh.vb !== afterPinch.vb && !wh.tf, wh.vb);
  await p.evaluate(() => document.querySelectorAll('.rmodal .lfpzc button')[2].click()); await p.waitForTimeout(300); const rs = await st();
  ok('reset goes back to the widest view', rs.vb === wide.vb, rs.vb);
  await p.evaluate(() => document.querySelectorAll('.rmodal .lfpzc button')[0].click()); await p.evaluate(() => document.querySelectorAll('.rmodal .lfpzc button')[1].click()); await p.waitForTimeout(300); const pm = await st();
  ok('+ then - comes back to the widest view', pm.vb === wide.vb, pm.vb);
  // not zoomed: a drag scrolls the window
  await p.evaluate(() => { const m = document.querySelector('#layer .modal'); const c = m && m.querySelector('.rmodal'); if (c && !c.querySelector('.qa-tall')) { const t = document.createElement('div'); t.className = 'qa-tall'; t.style.height = '1600px'; c.appendChild(t); } if (m) m.scrollTop = 120; }); // a spacer so the window can scroll
  const s0 = await st(); await touch('touchStart', [[box.x, box.y]]); for (let k = 1; k <= 10; k++) { await touch('touchMove', [[box.x, box.y + k * 8]]); await p.waitForTimeout(16); } await touch('touchEnd', []); await p.waitForTimeout(300); const s1 = await st();
  ok('not zoomed, a drag scrolls the window and leaves the room', s1.scroll !== s0.scroll && s1.vb === wide.vb, `scrollTop ${s0.scroll} -> ${s1.scroll}, viewBox ${s1.vb === wide.vb ? 'same' : s1.vb}`);
  console.log('  page errors', errs.length, errs.slice(0, 2));
  await b.close();
})();
