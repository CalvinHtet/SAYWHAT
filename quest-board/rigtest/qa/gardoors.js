// The Garden next to the Restaurant (ROOMS's 28a51ee): with both built, at every Garden size (Back Plot, Kitchen Garden,
// Estate) and every Restaurant size (Hole in the Wall, Corner Diner, Bistro, Noir), the Restaurant's "Garden" arrow and the
// Garden's "Restaurant" arrow walk both ways; which corner each arrow sits in; the building map puts the Garden right of the
// Restaurant. Pictures of both rooms at the biggest and smallest sizes.
//   OUT=<folder> QB=<built quest-board> node gardoors.js
const fs = require('fs'), path = require('path');
const { open, openRoom } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
const QB = process.env.QB;
const GS = [['Back Plot', {}], ['Kitchen Garden', { g_x1: 1 }], ['Estate', { g_x1: 1, g_x2: 1 }]];
const RS = [['Hole in the Wall', {}], ['Corner Diner', { r_x1: 1 }], ['Bistro', { r_x1: 1, r_x2: 1 }], ['Noir', { r_x1: 1, r_x2: 1, r_noir: 1 }]];
(async () => {
  if (QB) { const src = fs.readFileSync(path.join(QB, 'dist', 'app.js'), 'utf8'); const m = src.match(/var ROOMCELL=\{([^}]*)\}/); if (m) { const c = {}; for (const x of m[1].matchAll(/(\w+):\[([\d,-]+)\]/g)) c[x[1]] = x[2]; console.log('building cells: restaurant [' + c.restaurant + '], garden [' + c.garden + '], boba [' + c.boba + ']'); } }
  const { b, p, errs } = await open({ width: 1000, height: 900, owned: 'none' });
  const fails = [], oks = [], t = (c, m) => (c ? oks : fails).push(m);
  await p.evaluate(() => { const S = window.__qb.x().S; ['restaurant', 'garden'].forEach((k) => { if (!S.base.slots.some((s) => s.t === k)) S.base.slots.push({ t: k, a: {}, st: 0, pend: 0 }); }); });
  for (const [gn, ga] of GS) for (const [rn, ra] of RS) {
    const w = await p.evaluate(async ({ ga, ra }) => { const S = window.__qb.x().S, wt = (ms) => new Promise((o) => setTimeout(o, ms));
      const R = S.base.slots.find((s) => s.t === 'restaurant'), G = S.base.slots.find((s) => s.t === 'garden'); R.a = Object.assign({}, ra); G.a = Object.assign({}, ga, { gd_rest: 1 });
      const title = () => (document.querySelector('.rmodal .rm-title') || {}).textContent || '';
      document.querySelectorAll('#layer .modal,.dropsplash').forEach((e) => e.remove()); window.__qb.roomModal(S.base.slots.indexOf(R)); await wt(250);
      const arrows = (re) => [...document.querySelectorAll('.rmodal .prtb-b')].find((e) => re.test(e.textContent));
      const a0 = title(); const g = arrows(/Garden/); const gc = g ? g.parentElement.className : ''; const all0 = [...document.querySelectorAll('.rmodal .prtb-b')].map((e) => e.textContent.trim());
      if (g) g.click(); await wt(450); const a1 = title(); const r = arrows(/Restaurant|Diner|Bistro|Noir|Hole/); const rc = r ? r.parentElement.className : ''; const all1 = [...document.querySelectorAll('.rmodal .prtb-b')].map((e) => e.textContent.trim());
      if (r) r.click(); await wt(450); const a2 = title();
      return { a0, g: g ? g.textContent.trim() : null, gc, a1, r: r ? r.textContent.trim() : null, rc, a2, all0, all1 }; }, { ga, ra });
    t(w.g && /Garden|Plot|Estate/i.test(w.a1) && w.r && w.a2 === w.a0, `${rn} + ${gn}: "${w.a0}" -> [${w.g}] (${w.gc}) -> "${w.a1}" -> [${w.r}] (${w.rc}) -> "${w.a2}"` + (w.g && w.r ? '' : `; arrows here: ${JSON.stringify(w.all0)} / ${JSON.stringify(w.all1)}`));
  }
  // pictures: smallest and biggest of each, with both built
  const cells = [];
  for (const [lab, ga, ra] of [['small', {}, {}], ['big', { g_x1: 1, g_x2: 1 }, { r_x1: 1, r_x2: 1 }]]) {
    for (const k of ['restaurant', 'garden']) {
      const i = await p.evaluate(({ k, ga, ra }) => { const S = window.__qb.x().S; const R = S.base.slots.find((s) => s.t === 'restaurant'), G = S.base.slots.find((s) => s.t === 'garden'); R.a = Object.assign({}, ra); G.a = Object.assign({}, ga, { gd_rest: 1 }); return S.base.slots.findIndex((s) => s.t === k); }, { k, ga, ra });
      await openRoom(p, i, 900, 700); const f = path.join(OUT, `gardoor_${k}_${lab}.png`); await (await p.$('#qahost')).screenshot({ path: f }); cells.push(f);
    }
  }
  oks.forEach((m) => console.log('  ok   ' + m)); fails.forEach((m) => console.log('  FAIL ' + m));
  console.log('page errors', errs.length, errs.slice(0, 3));
  await b.close();
})();
