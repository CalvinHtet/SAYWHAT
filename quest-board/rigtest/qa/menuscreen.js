// The Boba Menu Screen live (ROOMS: "scrMenu pages fade in and out"): opens the real Boba window with the screen bought and samples
// what text the screen shows every half second for 8 seconds; a picture at the moment it shows the most text.
//   OUT=<folder> node menuscreen.js
const fs = require('fs'), path = require('path');
const { open } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const { b, p, errs } = await open({ width: 1000, height: 900, owned: 'none' });
  await p.evaluate(async () => { const x = window.__qb.x(), S = x.S; S.base.slots = S.base.slots.filter((s) => s.t !== 'boba'); S.base.slots.push({ t: 'boba', a: {}, st: 0, pend: 0 });
    const r = S.base.slots[S.base.slots.length - 1]; x.ADDONS.boba.forEach((u) => { if (!(u[3] && (u[3].retired || u[3].opens))) r.a[u[0]] = 1; });
    document.querySelectorAll('#layer .modal,.dropsplash').forEach((e) => e.remove()); window.__qb.roomModal(S.base.slots.length - 1); });
  const samples = []; let best = null;
  for (let k = 0; k < 16; k++) {
    await p.waitForTimeout(500);
    const s = await p.evaluate(() => { const ts = [...document.querySelectorAll('.rmodal svg text')].map((e) => { const o = getComputedStyle(e).opacity * (+(e.closest('[opacity]') || { getAttribute: () => 1 }).getAttribute('opacity') || 1); return { t: e.textContent.trim(), o }; }).filter((x) => x.t);
      return { n: ts.length, visible: ts.filter((x) => x.o > 0.3).map((x) => x.t) }; });
    samples.push(s.visible.length); if (!best || s.visible.length > best.visible.length) { best = s; await (await p.$('.rmodal')).screenshot({ path: path.join(OUT, 'boba_menuscreen.png') }); }
  }
  console.log('visible text pieces each half second:', samples.join(' '));
  console.log('most at once:', JSON.stringify(best.visible.slice(0, 14)));
  console.log('page errors', errs.length, errs.slice(0, 3));
  await b.close();
})();
