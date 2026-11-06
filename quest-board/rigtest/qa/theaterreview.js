// The Theater lobby for a design review (ROOMS's 4a7c0ff): bare and fully bought, the sprites drawn, the audit (outside, overlaps,
// depth, guest spots inside furniture), and the guest spots by tag (queue, ticket, snack) with what stands on each.
//   OUT=<folder> node theaterreview.js
const fs = require('fs'), path = require('path');
const { open, openRoom, audit } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const { b, p, errs } = await open({ width: 1000, height: 900, owned: 'none' });
  const i = await p.evaluate(() => { const S = window.__qb.x().S; if (!S.base.slots.some((s) => s.t === 'theater')) S.base.slots.push({ t: 'theater', a: {}, st: 0, pend: 0 }); return S.base.slots.findIndex((s) => s.t === 'theater'); });
  const ids = await p.evaluate(() => window.__qb.x().ADDONS.theater.map((u) => u[0] + ':' + u[1] + (u[3] && u[3].retired ? '(retired)' : '') + (u[3] && u[3].opens ? '(opens ' + u[3].opens + ')' : '')));
  console.log('upgrades: ' + ids.join(', '));
  for (const full of [false, true]) {
    await p.evaluate(({ i, full }) => { const x = window.__qb.x(), r = x.S.base.slots[i]; r.a = {}; if (full) x.ADDONS.theater.forEach((u) => { if (!(u[3] && (u[3].retired || u[3].opens))) r.a[u[0]] = 1; }); }, { i, full });
    await openRoom(p, i, 1000, 760);
    const sp = await p.evaluate(() => [...document.querySelectorAll('#qahost image')].map((e) => ((e.getAttribute('href') || '').match(/[a-z]+x?_[a-z0-9_]+/) || [''])[0]).filter((k) => k && !/^(lfw|w_)/.test(k)));
    const a = await audit(p, i);
    console.log(`${full ? 'full' : 'bare'}: sprites ${sp.join(' ')}`);
    console.log(`   audit: ${a.items.length} pieces` + (a.outside.length ? `, OUTSIDE ${a.outside.join(' ')}` : '') + (a.overlap.length ? `, overlaps ${a.overlap.map((o) => o.slice(0, 2).join('+')).join(' ')}` : '') + (a.depth.length ? `, depth ${a.depth.slice(0, 4).join('; ')}` : '') + (a.stations.length ? `, spots ${[...new Set(a.stations)].join('; ')}` : ''));
    await (await p.$('#qahost')).screenshot({ path: path.join(OUT, `theater_${full ? 'full' : 'bare'}.png`) });
  }
  const spots = await p.evaluate((i) => { const q = window.__qbLoft(); const C = q.roomCtx ? q.roomCtx(i) : null; if (!C || !C.st) return 'no roomCtx'; return C.st.map((s) => (s.tag || s.kind || s.lbl || '?') + '@' + (+s.x).toFixed(1) + ',' + (+s.y).toFixed(1)).join(' '); }, i);
  console.log('guest spots: ' + spots);
  console.log('page errors', errs.length, errs.slice(0, 3));
  await b.close();
})();
