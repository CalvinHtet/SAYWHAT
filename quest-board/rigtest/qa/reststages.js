// The Restaurant at each building stage, in the real room window at noon (no people): Hole in the Wall (the first 13 the window
// offers), Corner Diner (every piece that needs only r_x1), Neighborhood Bistro without Noir (everything but r_noir), and fully bought
// with Noir; the sizes and a picture of each.   BASE=<server> OUT=<folder> node reststages.js
const fs = require('fs'), path = require('path');
const { open } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const { b, p, errs } = await open({ width: 1100, height: 1000, owned: 'all' });
  await p.evaluate((h) => { const now = new Date(Date.now()), t = new Date(now); t.setHours(h, 0, 0, 0); window.__qbShift = (window.__qbShift || 0) + (t - now); }, 13);
  const first13 = ['r_sign', 'r_cf1', 'r_m1', 'r_k1', 'r_t1', 'r_d1', 'r_d2', 'r_k2', 'r_s1', 'r_till', 'r_l1', 'r_m2', 'r_k3'];
  const stages = [['hole', 'first13'], ['diner', 'x1'], ['bistro', 'nonoir'], ['noir', 'all']];
  for (const [name, mode] of stages) {
    const r = await p.evaluate(async ([mode, first13]) => { const w = (ms) => new Promise((o) => setTimeout(o, ms)); const x = window.__qb.x(), S = x.S;
      const k = S.base.slots.findIndex((s) => s && s.t === 'restaurant'); const r = S.base.slots[k]; r.a = {}; r.ds = 'lino';
      const live = x.ADDONS.restaurant.filter((u) => !(u[3] && (u[3].retired || u[3].opens)));
      if (mode === 'first13') first13.forEach((u) => { r.a[u] = 1; });
      else if (mode === 'x1') live.forEach((u) => { const e = u[3] || {}; if (u[0] === 'r_x2' || e.also === 'r_x2' || u[0] === 'r_noir' || (e.lv || 0) > 23) return; r.a[u[0]] = 1; });
      else live.forEach((u) => { if (mode === 'nonoir' && u[0] === 'r_noir') return; r.a[u[0]] = 1; });
      x.persist(); document.querySelectorAll('#layer .modal,.dropsplash').forEach((e) => e.remove()); window.__qb.roomModal(k); await w(2500);
      const head = (document.querySelector('.rmodal .note b') || {}).innerText || ''; return { n: Object.keys(r.a).length, head }; }, [mode, first13]);
    await (await p.$('.rmodal .rbig')).screenshot({ path: path.join(OUT, `stage_${name}.png`) });
    console.log(`${name}: ${r.n} upgrades owned, the window calls it "${r.head}"`);
  }
  console.log('page errors', errs.length, errs.slice(0, 2));
  await b.close();
})();
