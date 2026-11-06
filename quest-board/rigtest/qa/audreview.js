// The Auditorium for a design review (ROOMS, step 11): bare, with the Bigger Screen only, and fully bought (IMAX); the audit for
// each and a picture. Prints the upgrades so the screen ids are visible.
//   OUT=<folder> node audreview.js
const fs = require('fs'), path = require('path');
const { open, openRoom, audit } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const { b, p, errs } = await open({ width: 1000, height: 900, owned: 'none' });
  const i = await p.evaluate(() => { const S = window.__qb.x().S; ['theater', 'auditorium'].forEach((k) => { if (!S.base.slots.some((s) => s.t === k)) S.base.slots.push({ t: k, a: {}, st: 0, pend: 0 }); }); return S.base.slots.findIndex((s) => s.t === 'auditorium'); });
  const ups = await p.evaluate(() => window.__qb.x().ADDONS.auditorium.map((u) => [u[0], u[1], !!(u[3] && u[3].retired), !!(u[3] && u[3].opens)]));
  console.log('upgrades: ' + ups.map((u) => u[0] + ':' + u[1] + (u[2] ? '(retired)' : '')).join(', '));
  const big = ups.filter((u) => /Bigger Screen/i.test(u[1])).map((u) => u[0]);
  for (const [lab, own] of [['bare', []], ['bigger', big], ['full', ups.filter((u) => !u[2] && !u[3]).map((u) => u[0])]]) {
    await p.evaluate(({ i, own }) => { const r = window.__qb.x().S.base.slots[i]; r.a = {}; own.forEach((k) => (r.a[k] = 1)); }, { i, own });
    await openRoom(p, i, 1000, 760);
    const a = await audit(p, i);
    console.log(`${lab} (${own.length}): ${a.items.length} pieces` + (a.outside.length ? `, OUTSIDE ${a.outside.join(' ')}` : '') + (a.overlap.length ? `, overlaps ${a.overlap.map((o) => o.slice(0, 2).join('+')).join(' ')}` : '') + (a.depth.length ? `, depth ${a.depth.slice(0, 4).join('; ')}` : '') + (a.stations.length ? `, spots ${[...new Set(a.stations)].slice(0, 4).join('; ')}` : ''));
    await (await p.$('#qahost')).screenshot({ path: path.join(OUT, `aud_${lab}.png`) });
  }
  console.log('page errors', errs.length, errs.slice(0, 3));
  await b.close();
})();
