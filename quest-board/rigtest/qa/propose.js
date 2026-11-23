// ROOMS 2026-11-23: try new positions for room pieces before LEAD changes the room code. Patches the art positions of upgrades
// in the page (x.ADDONS[room] -> upgrade[3].art), renders the room fully bought before and after, and runs lib.js audit on both.
//   BASE=<server> OUT=<folder> PATCH='{"speakeasy":{"sp_juke":[[10.4,6.8,1,0.8]]}}' node propose.js
// Each upgrade id maps to a list of [x, y, w, d], one per art entry, in order (most pieces have one).
const fs = require('fs'), path = require('path');
const { open, openRoom, audit } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out/propose'; fs.mkdirSync(OUT, { recursive: true });
const PATCH = JSON.parse(process.env.PATCH || '{}');
(async () => {
  const { b, p, errs } = await open({ width: 1500, height: 1200, owned: 'all' });
  await p.evaluate(() => { const now = new Date(Date.now()), t = new Date(now); t.setHours(13, 0, 0, 0); window.__qbShift = (window.__qbShift || 0) + (t - now); });
  for (const [t, ups] of Object.entries(PATCH)) {
    const i = await p.evaluate((t) => window.__qb.x().S.base.slots.findIndex((s) => s && s.t === t), t);
    if (i < 0) { console.log(t, 'no slot'); continue; }
    for (const when of ['before', 'after']) {
      if (when === 'after') {
        const log = await p.evaluate(({ t, ups }) => { const x = window.__qb.x(), out = [];
          for (const [id, pos] of Object.entries(ups)) { const u = (x.ADDONS[t] || []).find((q) => q[0] === id); if (!u) { out.push(id + ' not found'); continue; }
            const e = u[3]; const arts = Array.isArray(e.art && e.art[0]) ? e.art : [e.art];
            pos.forEach((q, k) => { const a = arts[k]; if (!a) return; out.push(`${id}#${k} ${a.slice(1, 5).join(',')} -> ${q.join(',')}`); a[1] = q[0]; a[2] = q[1]; a[3] = q[2]; a[4] = q[3]; }); }
          return out; }, { t, ups });
        log.forEach((l) => console.log('  ' + l));
      }
      const res = await openRoom(p, i, 1400, 1100); if (res && res.err) { console.log(t, when, res.err); continue; }
      const a = await audit(p, i);
      const host = await p.$('#qahost'); if (host) await host.screenshot({ path: path.join(OUT, `${t}_${when}.png`) });
      console.log(`${t} ${when}: overlaps ${JSON.stringify(a.overlap)} drawnOver ${JSON.stringify(a.depth)} outside ${JSON.stringify(a.outside)}`);
    }
  }
  console.log('page errors', errs.length, errs.slice(0, 3)); await b.close();
})();
