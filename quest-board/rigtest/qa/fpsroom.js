// Frames per second in a room window on a full save, at a phone's speed (LEAD's 0dfa204, from Cal's v0.58 phone log: the fully
// bought Bedroom at 18 fps): every upgrade owned, the room's building opened, its window opened, the CPU slowed through DevTools,
// then requestAnimationFrame counted for 5 s, three times: fps, the worst frame, frames over 50 ms, and elements in the window.
//   ROOM=bedroom BLD=0 CPU=4 BASE=<server> node fpsroom.js
const { open } = require('./lib.js');
(async () => {
  const { b, p, errs } = await open({ width: 440, height: 840, owned: 'all' });
  await p.evaluate((v) => { window.BLDI = v[0]; window.ROOMN = v[1]; }, [+(process.env.BLD || 0), process.env.ROOM || 'bedroom']);
  const i = await p.evaluate(() => { const x = window.__qb.x(), S = x.S; const k = S.base.slots.findIndex((s) => s && s.t === window.ROOMN); const r = S.base.slots[k];
    x.ADDONS[window.ROOMN].forEach((u) => { if (u[3] && (u[3].retired || u[3].opens)) return; r.a[u[0]] = 1; }); return k; });
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.areaOn = null; S.gates = [5, 10, 20, 30, 40]; S.xp = Math.max(S.xp, x.cum(45)); x.render(); document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); document.querySelector('.nav button[data-v="hideout"]').click(); });
  await p.waitForTimeout(3500);
  await p.evaluate(() => { document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); document.querySelectorAll('[data-act="bldgo"]')[BLDI].dispatchEvent(new MouseEvent('click', { bubbles: true })); });
  await p.waitForTimeout(6000);
  await p.evaluate((i) => { document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); window.__qb.roomModal(i); }, i);
  await p.waitForTimeout(4000);
  const cdp = await p.context().newCDPSession(p); await cdp.send('Emulation.setCPUThrottlingRate', { rate: +(process.env.CPU || 4) });
  await p.waitForTimeout(2000);
  const runs = [];
  for (let k = 0; k < 3; k++) runs.push(await p.evaluate(() => new Promise((ok) => { let n = 0, worst = 0, slow = 0, last = performance.now(); const t0 = last;
    const f = (t) => { n++; const d = t - last; last = t; if (d > worst) worst = d; if (d > 50) slow++; if (t - t0 < 5000) requestAnimationFrame(f); else ok({ fps: +(n / ((t - t0) / 1000)).toFixed(1), worst: Math.round(worst), slow, nodes: (document.querySelector('#layer .rmodal') || document).getElementsByTagName('*').length }); };
    requestAnimationFrame(f); })));
  console.log(`${process.env.ROOM || 'bedroom'} window, CPU x${process.env.CPU || 4}: ` + runs.map((r) => `${r.fps} fps (worst ${r.worst} ms, ${r.slow} over 50 ms)`).join('; ') + `; ${runs[0].nodes} elements in the window; page errors ${errs.length}`);
  await b.close();
})();
