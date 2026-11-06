// The Restaurant in every Room style (LFDS.restaurant), fully bought and bare, at noon, as its window shows it (no people), plus
// the same window on a phone for the zoomed-in look Cal sees. Cal (2026-11-06): "The menu and the wall rack is placed weirdly. Have QA
// do a full quality check of the restaurant."   BASE=<server> OUT=<folder> [HOUR=13] node reststyles.js
const fs = require('fs'), path = require('path');
const { open, openRoom } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const { b, p, errs } = await open({ width: 1000, height: 900, owned: 'all' });
  await p.evaluate((h) => { const now = new Date(Date.now()), t = new Date(now); t.setHours(h, 0, 0, 0); window.__qbShift = (window.__qbShift || 0) + (t - now); }, +(process.env.HOUR || 13));
  const sets = await p.evaluate(() => (window.LFDS && window.LFDS.restaurant ? window.LFDS.restaurant : []).map((s) => s.id));
  const styles = sets.length ? sets : (process.env.STYLES || 'lino,bistro,brickbar,modern,trattoria,marble').split(','); /* LFDS is not on window: the ids as in 27_rooms.js */
  console.log('styles:', styles.join(' '));
  for (const full of [false, true]) for (const ds of (full ? styles : [styles[0]])) {
    const i = await p.evaluate(([ds, full]) => { const x = window.__qb.x(), S = x.S; const k = S.base.slots.findIndex((s) => s && s.t === 'restaurant'); const r = S.base.slots[k];
      r.a = {}; if (full) x.ADDONS.restaurant.forEach((u) => { if (u[3] && (u[3].retired || u[3].opens)) return; r.a[u[0]] = 1; });
      r.ds = ds; r.du = r.du || {}; r.du[ds] = 1; return k; }, [ds, full]);
    const res = await openRoom(p, i, 1000, 760);
    if (res && res.err) { console.log(ds, res.err); continue; }
    const name = `rest_${full ? 'full' : 'bare'}_${ds}.png`;
    await (await p.$('#qahost')).screenshot({ path: path.join(OUT, name) });
    console.log('saved', name);
  }
  console.log('page errors', errs.length, errs.slice(0, 3));
  await b.close();
})();
