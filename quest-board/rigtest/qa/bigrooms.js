// Every room fully bought, drawn large (about 1800 px wide) at 13:00 with nobody in it, for checking each piece by eye: which side
// is its use side and whether a person can stand there (Cal's accessibility check).   BASE=<server> OUT=<folder> [ROOMS=a,b] node bigrooms.js
const fs = require('fs'), path = require('path');
const { open, ORDER } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const { b, p, errs } = await open({ width: 2000, height: 1700, owned: 'all' });
  await p.evaluate(() => { const now = new Date(Date.now()), t = new Date(now); t.setHours(13, 0, 0, 0); window.__qbShift = (window.__qbShift || 0) + (t - now); });
  await p.addStyleTag({ content: '.rmodal .card,.rmodal .box2,.rmodal{max-width:none!important;width:1900px!important}.rmodal .rbig{width:1860px!important;max-height:none!important}' });
  for (const t of (process.env.ROOMS || ORDER.join(',')).split(',')) {
    const ok = await p.evaluate(async (t) => { const w = (ms) => new Promise((o) => setTimeout(o, ms)); const S = window.__qb.x().S; const k = S.base.slots.findIndex((s) => s && s.t === t); if (k < 0) return false;
      document.querySelectorAll('#layer .modal').forEach((e) => e.remove()); window.__qb.roomModal(k); await w(2500); const L = window.__qbLoft(); Object.keys(L.A).forEach((id) => { if (L.A[id].pv) L.A[id].alpha = 0; }); document.querySelectorAll('.rmodal .lfag, .rmodal [data-ag]').forEach((e) => e.style.display = 'none'); return true; }, t);
    if (!ok) { console.log(t, 'missing'); continue; }
    const el = await p.$('.rmodal .rbig'); const bb = await el.boundingBox(); await el.screenshot({ path: path.join(OUT, `big_${t}.png`) }); console.log(t, Math.round(bb.width) + 'x' + Math.round(bb.height));
  }
  console.log('page errors', errs.length); await b.close();
})();
