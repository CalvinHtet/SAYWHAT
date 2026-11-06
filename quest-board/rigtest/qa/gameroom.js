// The Game Room fixes (ROOMS's d30bb93, Cal's phone notes): the Retro TV Corner faces the beanbags, and Gaming Desks is one long
// desk for two (gmx_rig2) with a chair at each. Pictures: the Retro TV with the beanbags, and the room fully bought; the audit.
//   OUT=<folder> node gameroom.js
const fs = require('fs'), path = require('path');
const { open, openRoom, audit } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const { b, p, errs } = await open({ width: 1000, height: 900, owned: 'none' });
  const k = await p.evaluate(() => Object.keys(window.__qb.x().ADDONS).find((t) => window.__qb.x().ADDONS[t].some((u) => u[0] === 'gm_rig')));
  const i = await p.evaluate((k) => { const S = window.__qb.x().S; if (!S.base.slots.some((s) => s.t === k)) S.base.slots.push({ t: k, a: {}, st: 0, pend: 0 }); return S.base.slots.findIndex((s) => s.t === k); }, k);
  for (const [name, ids] of [['crt', ['gm_crt', 'gm_bean']], ['full', null]]) {
    await p.evaluate(({ i, k, ids }) => { const x = window.__qb.x(), r = x.S.base.slots[i]; r.a = {}; (ids || x.ADDONS[k].filter((u) => !(u[3] && (u[3].retired || u[3].opens))).map((u) => u[0])).forEach((id) => (r.a[id] = 1)); }, { i, k, ids });
    await openRoom(p, i, 1100, 850);
    const a = await audit(p, i);
    const imgs = await p.evaluate(() => [...document.querySelectorAll('#qahost image')].map((e) => ((e.getAttribute('href') || '').match(/gmx_[a-z0-9]+/) || [])[0]).filter(Boolean));
    console.log(`${name}: rig2 ${imgs.includes('gmx_rig2')}, old rig ${imgs.includes('gmx_rig')}, crt ${imgs.includes('gmx_crt')}` + (a.outside.length ? ', OUTSIDE ' + a.outside.join(' ') : '') + (a.overlap.length ? ', overlaps ' + a.overlap.map((o) => o.slice(0, 2).join('+')).join(' ') : '') + (a.stations.length ? ', spots ' + [...new Set(a.stations)].join('; ') : ''));
    await (await p.$('#qahost')).screenshot({ path: path.join(OUT, `gameroom_${name}.png`) });
  }
  console.log('page errors', errs.length, errs.slice(0, 3));
  await b.close();
})();
