// Every room fully bought, as its window shows it (no people): every room type the game has (ROOMT with upgrades), each with
// every live upgrade (not retired, not the ones that open another room), one picture each. HOUR picks the time of day.
//   HOUR=13 OUT=<folder> BASE=<server> node allrooms.js [room,room]
const fs = require('fs'), path = require('path');
const { open, openRoom } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const { b, p, errs } = await open({ width: 1000, height: 900, owned: 'none' });
  await p.evaluate((h) => { const now = new Date(Date.now()), t = new Date(now); t.setHours(h, 0, 0, 0); window.__qbShift = (window.__qbShift || 0) + (t - now); }, +(process.env.HOUR || 13));
  const only = process.argv[2] ? process.argv[2].split(',') : null;
  const rooms = await p.evaluate((only) => { const x = window.__qb.x(); return Object.keys(x.ADDONS).filter((t) => x.ROOMT[t] && (x.ADDONS[t] || []).length && (!only || only.includes(t))); }, only);
  const done = [];
  for (const t of rooms) {
    const i = await p.evaluate((t) => { const x = window.__qb.x(), S = x.S; let k = S.base.slots.findIndex((s) => s && s.t === t);
      if (k < 0) { S.base.slots.push({ t, a: {}, st: 0, pend: 0 }); k = S.base.slots.length - 1; }
      const r = S.base.slots[k]; r.a = {}; x.ADDONS[t].forEach((u) => { if (u[3] && (u[3].retired || u[3].opens)) return; r.a[u[0]] = 1; }); return k; }, t);
    const res = await openRoom(p, i, 1000, 760);
    if (res && res.err) { console.log(t, res.err); continue; }
    await (await p.$('#qahost')).screenshot({ path: path.join(OUT, `${t}.png`) });
    done.push(t);
  }
  console.log(`${done.length} rooms at ${process.env.HOUR || 13}:00: ${done.join(' ')}`);
  console.log('page errors', errs.length, errs.slice(0, 3));
  await b.close();
})();
