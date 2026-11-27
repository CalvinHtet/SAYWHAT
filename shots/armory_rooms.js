// ROOMS: the Armory bare (first relic only) and fully stocked (every relic, every set). BASE=<server> OUT=<dir> node shots/armory_rooms.js
const path = require('path'), fs = require('fs');
const { open, openRoom, audit } = require('../quest-board/rigtest/qa/lib.js');
const OUT = process.env.OUT || '.'; fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const { b, p, errs } = await open({ width: 1000, height: 900, owned: 'none' });
  const i = await p.evaluate(() => { const S = window.__qb.x().S; if (!S.base.slots.some((s) => s.t === 'trophy')) S.base.slots.push({ t: 'trophy', a: {}, st: 0, pend: 0 }); return S.base.slots.findIndex((s) => s.t === 'trophy'); });
  if (process.env.PATCH) await p.evaluate((src) => { (0, eval)(src); }, require('fs').readFileSync(process.env.PATCH, 'utf8')); // ROOMS: try V216 placements without a rebuild
  for (const mode of (process.env.MODES || 'first,full').split(',')) {
    await p.evaluate((mode) => { const x = window.__qb.x(), S = x.S, T = window.__qb.x().TSETS || window.TSETS; const all = {}; const now = Date.now();
      const sets = window.__qbDungeon.SETS; Object.keys(sets).forEach((k) => { all[k] = {}; sets[k].pieces.forEach((pc) => { all[k][pc.id] = now; }); });
      S.trophy = mode === 'full' ? all : { goblin: { helm: now } }; }, mode);
    await openRoom(p, i, 1000, 760);
    const sp = await p.evaluate(() => [...document.querySelectorAll('#qahost image')].map((e) => ((e.getAttribute('href') || '').match(/(trx|trw|tpw)_[a-z0-9_]+/) || [''])[0]).filter(Boolean));
    const a = await audit(p, i);
    console.log(mode + ': sprites ' + sp.join(' '));
    console.log('   audit: ' + a.items.length + ' pieces' + (a.outside.length ? ', OUTSIDE ' + a.outside.join(' ') : '') + (a.overlap.length ? ', overlaps ' + a.overlap.map((o) => o.slice(0, 2).join('+')).join(' ') : ''));
    await (await p.$('#qahost')).screenshot({ path: path.join(OUT, 'armory_' + mode + '.png') });
  }
  console.log('page errors', errs.length, errs.slice(0, 3)); await b.close();
})();
