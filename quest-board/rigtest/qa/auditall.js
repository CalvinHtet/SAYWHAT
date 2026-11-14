// Cal's room-placement sweep (2026-11-14): every room in ORDER fully bought (no retired pieces, none that open another room), drawn in
// the QA host, with lib.audit: pieces outside the floor, footprint overlaps, stacks (footprints over half shared), depth order errors,
// and guest spots standing in or on furniture.   BASE=<plain build> [ROOMS=a,b] node auditall.js
const { open, openRoom, audit, ORDER } = require('./lib.js');
(async () => { const { b, p, errs } = await open({ width: 1000, height: 900, owned: 'none' });
  for (const R of (process.env.ROOMS || ORDER.join(',')).split(',')) {
    const i = await p.evaluate((R) => { const S = window.__qb.x().S; if (!window.__qb.x().ADDONS[R]) return -1; if (!S.base.slots.some((s) => s && s.t === R)) S.base.slots.push({ t: R, a: {}, st: 0, pend: 0 }); return S.base.slots.findIndex((s) => s && s.t === R); }, R);
    if (i < 0) { console.log(R + ': no such room'); continue; }
    await p.evaluate(({ i, R }) => { const x = window.__qb.x(), r = x.S.base.slots[i]; r.a = {}; x.ADDONS[R].forEach((u) => { if (!(u[3] && (u[3].retired || u[3].opens))) r.a[u[0]] = 1; }); }, { i, R });
    await openRoom(p, i, 1000, 760); const a = await audit(p, i);
    console.log(`${R} (${a.size}, ${a.items.length} pieces, ${a.spots} spots)` + (a.outside.length ? `\n   OUTSIDE ${a.outside.join(' ')}` : '') + (a.stack.length ? `\n   STACK ${a.stack.map((o) => o.join('+')).join('  ')}` : '') + (a.overlap.length ? `\n   overlap ${a.overlap.map((o) => o.slice(0, 2).join('+') + ' ' + o[2]).join('  ')}` : '') + (a.depth.length ? `\n   DEPTH ${a.depth.join('  ')}` : '') + (a.stations.length ? `\n   spots ${a.stations.join('  ')}` : ''));
  }
  console.log('page errors', errs.length, errs.slice(0, 3)); await b.close(); })();
