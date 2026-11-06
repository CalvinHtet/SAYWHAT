// Open-air rooms (ROOMS's 73a426a): the Sky Patio and the Rooftop Bar, bare and fully bought, at noon and at night: pictures to
// look for a dark triangle over the sky, and the audit (outside, overlaps).
//   OUT=<folder> node openair.js
const fs = require('fs'), path = require('path');
const { open, openRoom, audit } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const { b, p, errs } = await open({ width: 1000, height: 900, owned: 'none' });
  for (const k of ['patio', 'rooftop']) for (const full of [false, true]) for (const hour of (process.env.HOURS || "13,22").split(",").map(Number)) {
    const i = await p.evaluate(({ k, full, hour }) => { const x = window.__qb.x(), S = x.S; const now = new Date(Date.now()), tt = new Date(now); tt.setHours(hour, 0, 0, 0); window.__qbShift = (window.__qbShift || 0) + (tt - now);
      if (!S.base.slots.some((s) => s.t === k)) S.base.slots.push({ t: k, a: {}, st: 0, pend: 0 }); const i = S.base.slots.findIndex((s) => s.t === k), r = S.base.slots[i];
      r.a = {}; if (full) x.ADDONS[k].forEach((u) => { if (!(u[3] && (u[3].retired || u[3].opens))) r.a[u[0]] = 1; }); return i; }, { k, full, hour });
    await openRoom(p, i, 1000, 760);
    const a = await audit(p, i);
    console.log(`  ${k} ${full ? 'full' : 'bare'} ${hour}:00: ${a.items.length} pieces` + (a.outside.length ? `, OUTSIDE ${a.outside.join(' ')}` : '') + (a.overlap.length ? `, overlaps ${a.overlap.map((o) => o.slice(0, 2).join('+')).join(' ')}` : ''));
    await (await p.$('#qahost')).screenshot({ path: path.join(OUT, `${k}_${full ? 'full' : 'bare'}_${hour}.png`) });
  }
  console.log('page errors', errs.length, errs.slice(0, 3));
  await b.close();
})();
