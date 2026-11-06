// The Mall for a design review (ROOMS's 322760a): the painted shell (mlw_*) bare and fully bought, the audit; every arrow walked to
// its room and back (Theater, Arcade, Bowling, Karaoke owned); the Directory Screen sampled live every half second for 8 seconds
// (its visible text, and a picture at its fullest).
//   OUT=<folder> node mallreview.js
const fs = require('fs'), path = require('path');
const { open, openRoom, audit } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const { b, p, errs } = await open({ width: 1000, height: 900, owned: 'none' });
  const fails = [], oks = [], t = (c, m) => (c ? oks : fails).push(m);
  const i = await p.evaluate(() => { const S = window.__qb.x().S; ['mall', 'theater', 'arcade', 'bowling', 'karaoke'].forEach((k) => { if (!S.base.slots.some((s) => s.t === k)) S.base.slots.push({ t: k, a: {}, st: 0, pend: 0 }); }); return S.base.slots.findIndex((s) => s.t === 'mall'); });
  for (const full of [false, true]) {
    const n = await p.evaluate(({ i, full }) => { const x = window.__qb.x(), r = x.S.base.slots[i]; r.a = {}; if (full) x.ADDONS.mall.forEach((u) => { if (!(u[3] && (u[3].retired || u[3].opens))) r.a[u[0]] = 1; }); return Object.keys(r.a).length; }, { i, full });
    await openRoom(p, i, 1000, 760);
    const shell = await p.evaluate(() => [...new Set([...document.querySelectorAll('#qahost image')].map((e) => ((e.getAttribute('href') || '').match(/mlw_[a-z0-9]+/) || [])[0]).filter(Boolean))].join(','));
    const a = await audit(p, i);
    t(!!shell, `${full ? 'fully bought' : 'bare'} (${n} upgrades): shell ${shell || 'NONE'}, ${a.items.length} pieces` + (a.outside.length ? `, OUTSIDE ${a.outside.join(' ')}` : '') + (a.overlap.length ? `, overlaps ${a.overlap.map((o) => o.slice(0, 2).join('+')).join(' ')}` : '') + (a.depth.length ? `, depth ${a.depth.slice(0, 3).join('; ')}` : ''));
    await (await p.$('#qahost')).screenshot({ path: path.join(OUT, `mall_${full ? 'full' : 'bare'}.png`) });
  }
  // the arrows, each to its room and back
  const walk = await p.evaluate(async (i) => { const wt = (ms) => new Promise((o) => setTimeout(o, ms)), out = [];
    const title = () => (document.querySelector('.rmodal .rm-title') || {}).textContent || '';
    const arr = () => [...document.querySelectorAll('.rmodal .prtb-b')];
    const openMall = async () => { document.querySelectorAll('#layer .modal,.dropsplash').forEach((e) => e.remove()); window.__qb.roomModal(i); await wt(350); };
    await openMall(); const names = arr().map((e) => e.textContent.trim() + ' (' + e.parentElement.className.replace('prtb ', '') + ')');
    for (const nm of arr().map((e) => e.textContent.trim())) { await openMall(); const e = arr().find((x) => x.textContent.trim() === nm); e.click(); await wt(450); const there = title();
      const back = arr().find((x) => /Mall/.test(x.textContent)); const bc = back ? back.parentElement.className.replace('prtb ', '') : ''; if (back) back.click(); await wt(450); out.push([nm, there, bc, title()]); }
    return { names, out }; }, i);
  console.log('  Mall arrows: ' + walk.names.join(', '));
  walk.out.forEach((w) => t(/Mall/i.test(w[3]) && w[1] && !/Mall/.test(w[1]), `"${w[0]}" -> "${w[1]}" -> back by "Mall" (${w[2]}) -> "${w[3]}"`));
  // the Directory Screen, live
  await p.evaluate(async (i) => { const x = window.__qb.x(), r = x.S.base.slots[i]; r.a = {}; x.ADDONS.mall.forEach((u) => { if (!(u[3] && (u[3].retired || u[3].opens))) r.a[u[0]] = 1; }); document.querySelectorAll('#layer .modal').forEach((e) => e.remove()); window.__qb.roomModal(i); }, i);
  let best = null; const counts = [];
  for (let k = 0; k < 16; k++) { await p.waitForTimeout(500);
    const s = await p.evaluate(() => [...document.querySelectorAll('.rmodal svg text')].map((e) => e.textContent.trim()).filter(Boolean));
    counts.push(s.length); if (!best || s.length > best.length) { best = s; await (await p.$('.rmodal')).screenshot({ path: path.join(OUT, 'mall_directory_live.png') }); } }
  console.log('  directory text pieces each half second: ' + counts.join(' '));
  console.log('  most at once: ' + JSON.stringify(best.slice(0, 30)));
  const odd = best.filter((s) => /[^\x20-\x7e·•—–’'é]/.test(s) || /undefined|NaN|\[object/.test(s));
  t(!odd.length, 'directory text has no odd characters or broken values' + (odd.length ? ': ' + odd.slice(0, 6).join(' | ') : ''));
  oks.forEach((m) => console.log('  ok   ' + m)); fails.forEach((m) => console.log('  FAIL ' + m));
  console.log('page errors', errs.length, errs.slice(0, 3));
  await b.close();
})();
