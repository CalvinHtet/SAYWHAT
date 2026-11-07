// Night lights (ROOMS's abe06dd; Cal: "The light on option should not matter for the other rooms. Only the bedroom where you can't see
// anything at night"): at 10 pm, every room's window with the lamp state off and on (rm.lit 0/1, as an old save may hold): its mean
// brightness, whether the lamp button shows, and that only the Bedroom changes with it. Then the Bedroom's button is tapped and the
// save is read back after a reload.   BASE=<server> OUT=<folder> [ROOMS=a,b] node nightlights.js
const fs = require('fs'), path = require('path');
const { open } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const { b, p, errs } = await open({ width: 900, height: 900, owned: 'all' });
  await p.evaluate(() => { const now = new Date(Date.now()), t = new Date(now); t.setHours(22, 0, 0, 0); window.__qbShift = (window.__qbShift || 0) + (t - now); });
  const rooms = (process.env.ROOMS || 'bedroom,closet,lair,patio,gameroom,restaurant,boba,mall,arcade,club,theater,garden').split(',');
  const mean = async () => { const buf = await (await p.$('.rmodal .rbig')).screenshot(); const PNG = require('zlib'); return buf; };
  const out = [];
  for (const t of rooms) {
    const r = {};
    for (const lit of [0, 1]) {
      const i = await p.evaluate(async ([t, lit]) => { const w = (ms) => new Promise((o) => setTimeout(o, ms)); const S = window.__qb.x().S; const k = S.base.slots.findIndex((s) => s && s.t === t); if (k < 0) return -1;
        S.base.slots[k].lit = lit; document.querySelectorAll('#layer .modal').forEach((e) => e.remove()); window.__qb.roomModal(k); await w(1800); return k; }, [t, lit]);
      if (i < 0) { r.missing = true; break; }
      const name = `${t}_lit${lit}.png`; await (await p.$('.rmodal .rbig')).screenshot({ path: path.join(OUT, name) });
      r['b' + lit] = await p.evaluate(async () => { const s = document.querySelector('.rmodal .rbig svg'); return !!document.querySelector('.rmodal [data-act="lflight"]'); });
      r['f' + lit] = path.join(OUT, name);
    }
    out.push([t, r]);
  }
  // brightness in Python is easier; print file pairs
  fs.writeFileSync(path.join(OUT, 'pairs.json'), JSON.stringify(out));
  out.forEach(([t, r]) => console.log(`${t.padEnd(11)} lamp button ${r.missing ? 'room missing' : (r.b0 || r.b1 ? 'SHOWN' : 'none')}`));
  // the Bedroom's toggle saves
  const tog = await p.evaluate(async () => { const w = (ms) => new Promise((o) => setTimeout(o, ms)); const S = window.__qb.x().S; const k = S.base.slots.findIndex((s) => s && s.t === 'bedroom'); S.base.slots[k].lit = 0; window.__qb.x().persist();
    document.querySelectorAll('#layer .modal').forEach((e) => e.remove()); window.__qb.roomModal(k); await w(1500); const bt = document.querySelector('.rmodal [data-act="lflight"]'); if (bt) bt.click(); await w(800); return { k, lit: S.base.slots[k].lit }; });
  await p.reload(); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft, null, { timeout: 60000 }); await p.waitForTimeout(1200);
  const after = await p.evaluate((k) => window.__qb.x().S.base.slots[k].lit, tog.k);
  console.log(`Bedroom lamp tapped: lit ${tog.lit}; after a reload: ${after}`);
  console.log('page errors', errs.length, errs.slice(0, 2));
  await b.close();
})();
