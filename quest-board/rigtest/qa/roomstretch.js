// The stretch (yawn) in a room as a player sees it (LEAD's a384feb): into the building, the room window open, then every character
// in the room is made to stretch at once (mode "do", act "up", held in place at 13:00), and the room picture is taken every 150 ms through the yawn.
// The clip's frame count and speed are printed so the pictures can be read as frames. A crop around each character comes out too.
//   ROOM=<type> BLD=<building index> OUT=<folder> BASE=<server> node roomstretch.js
const fs = require('fs'), path = require('path');
const { open } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const { b, p, errs } = await open({ width: 1100, height: 1000, owned: 'all' });
  await p.evaluate((h) => { const now = new Date(Date.now()), t = new Date(now); t.setHours(h, 0, 0, 0); window.__qbShift = (window.__qbShift || 0) + (t - now); }, +(process.env.HOUR || 13)); // HOUR (default 13): daytime, so nobody goes to bed
  await p.evaluate((v) => { window.BLDI = v[0]; window.ROOMN = v[1]; }, [+(process.env.BLD || 0), process.env.ROOM || 'bedroom']);
  const i = await p.evaluate(() => window.__qb.x().S.base.slots.findIndex((s) => s && s.t === window.ROOMN));
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.areaOn = null; S.gates = [5, 10, 20, 30, 40]; S.xp = Math.max(S.xp, x.cum(45)); x.render(); document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); document.querySelector('.nav button[data-v="hideout"]').click(); });
  await p.waitForTimeout(3500);
  await p.evaluate(() => { document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); document.querySelectorAll('[data-act="bldgo"]')[BLDI].dispatchEvent(new MouseEvent('click', { bubbles: true })); });
  await p.waitForTimeout(6000);
  await p.evaluate((i) => { document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); window.__qb.roomModal(i); }, i);
  await p.waitForTimeout(5000);
  const info = await p.evaluate((i) => { const c = window.QBLoft.clips.stretch, A = Object.values(window.__qbLoft().A || {}).filter((a) => a.room === i || a.pvslot === i);
    A.forEach((a) => { a.mode = 'do'; a.act = 'up'; a.t = 30; a.at = 0; a._st0 = 0; a.wp = []; a.x0 = a.x; a.y0 = a.y; });
    window.__hold = setInterval(() => A.forEach((a) => { a.mode = 'do'; a.act = 'up'; a.t = 30; a.wp = []; a.x = a.x0; a.y = a.y0; }), 30); // held in place for the run
    window.__again = setInterval(() => A.forEach((a) => { a._st0 = 0; }), 2400); // and the yawn starts again every 2.4 s
    return { frames: c.frames, fps: c.fps, who: A.map((a) => a.role + (a.pv ? '(pv)' : '')) }; }, i);
  console.log(`stretch clip: ${info.frames} frames at ${info.fps} fps (${(info.frames / info.fps).toFixed(2)} s); characters made to stretch: ${info.who.join(', ')}`);
  const el = await p.$('#rbigw') || await p.$('.rmodal'), shots = [];
  for (let k = 0; k < 20; k++) { const f = path.join(OUT, `${process.env.ROOM || 'bedroom'}_stretch_${String(k).padStart(2, '0')}.png`); await el.screenshot({ path: f }); shots.push(f); await p.waitForTimeout(150); }
  // then fast: only the box around the first character, every ~60 ms for 5 s (two yawns), to catch the switch frames
  const box = await p.evaluate((i) => { const host = document.querySelector('#rbigw') || document.querySelector('.rmodal'); const r = host.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; }, i);
  const CB = process.env.CROP ? process.env.CROP.split(',').map(Number) : null; // CROP=x,y,w,h inside the room picture
  if (CB) { const t0 = Date.now(); let k = 0; while (Date.now() - t0 < 5000) { await p.screenshot({ path: path.join(OUT, `fast_${String(k++).padStart(3, '0')}.png`), clip: { x: box.x + CB[0], y: box.y + CB[1], width: CB[2], height: CB[3] } }); } console.log('fast pictures: ' + k); }
  const after = await p.evaluate((i) => Object.values(window.__qbLoft().A || {}).filter((a) => a.room === i || a.pvslot === i).map((a) => a.role + ':' + a.mode + ':' + a.act), i);
  console.log('after: ' + after.join(', ')); console.log('pictures: ' + shots.length); console.log('page errors', errs.length, errs.slice(0, 2));
  await b.close();
})();
