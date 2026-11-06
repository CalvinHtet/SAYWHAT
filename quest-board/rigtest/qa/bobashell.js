// ROOMS's painted Boba shop (c223d89): the shell (bbw_t1) bare and fully bought, the audit (outside, overlaps, depth); what stands
// on the "Upstairs" door's spot; the side door to the Garden: the Boba shop's "Garden" arrow and the Garden's "Boba Shop" arrow walk
// both ways (and which corner each sits in); the Neon Cup Sign's place. Pictures of each.
//   OUT=<folder> node bobashell.js
const fs = require('fs'), path = require('path');
const { open, openRoom, audit } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const { b, p, errs } = await open({ width: 1000, height: 900, owned: 'none' });
  const fails = [], oks = [], t = (c, m) => (c ? oks : fails).push(m);
  const i = await p.evaluate(() => { const S = window.__qb.x().S; ['boba', 'garden', 'dessert'].forEach((k) => { if (!S.base.slots.some((s) => s.t === k)) S.base.slots.push({ t: k, a: {}, st: 0, pend: 0 }); }); return S.base.slots.findIndex((s) => s.t === 'boba'); });
  for (const full of [false, true]) {
    const names = await p.evaluate(({ i, full }) => { const x = window.__qb.x(), r = x.S.base.slots[i]; r.a = {}; if (full) x.ADDONS.boba.forEach((u) => { if (u[3] && (u[3].retired || u[3].opens)) return; r.a[u[0]] = 1; }); return Object.keys(r.a).length; }, { i, full });
    await openRoom(p, i, 1000, 760);
    const shell = await p.evaluate(() => [...new Set([...document.querySelectorAll('#qahost image')].map((e) => ((e.getAttribute('href') || '').match(/bbw_[a-z0-9]+/) || [])[0]).filter(Boolean))].join(','));
    const a = await audit(p, i);
    // the doors' glow spots, and what stands over each
    const doors = await p.evaluate(() => { const host = document.querySelector('#qahost'); const g = [...host.querySelectorAll('[data-portal], .lfportal, [class*=portal]')]; return g.map((e) => { const r = e.getBoundingClientRect(); return (e.getAttribute('data-portal') || e.getAttribute('class')) + '@' + Math.round(r.left) + ',' + Math.round(r.top) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height); }); });
    const sign = await p.evaluate(() => { const im = [...document.querySelectorAll('#qahost image')].filter((e) => /bbx_(neon|sign|cup)/.test(e.getAttribute('href') || '')); return im.map((e) => { const r = e.getBoundingClientRect(); return (e.getAttribute('href').match(/bbx_[a-z0-9]+/) || [''])[0] + '@' + Math.round(r.left) + ',' + Math.round(r.top) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height); }); });
    t(shell === 'bbw_t1', `${full ? 'fully bought' : 'bare'} (${names} upgrades): shell ${shell || 'NONE'}, ${a.items.length} pieces` + (a.outside.length ? `, OUTSIDE ${a.outside.join(' ')}` : '') + (a.overlap.length ? `, overlaps ${a.overlap.map((o) => o.slice(0, 2).join('+')).join(' ')}` : '') + (a.depth.length ? `, depth ${a.depth.slice(0, 3).join('; ')}` : '') + (a.stations.length ? `, spots ${[...new Set(a.stations)].slice(0, 3).join('; ')}` : ''));
    console.log(`  ${full ? 'full' : 'bare'}: door glows ${JSON.stringify(doors)}; sign ${JSON.stringify(sign)}`);
    await (await p.$('#qahost')).screenshot({ path: path.join(OUT, `boba_${full ? 'full' : 'bare'}.png`) });
  }
  // walk Boba -> Garden -> Boba by the arrows, and Boba -> Upstairs
  const w = await p.evaluate(async (i) => { const S = window.__qb.x().S, wt = (ms) => new Promise((o) => setTimeout(o, ms));
    const title = () => (document.querySelector('.rmodal .rm-title') || {}).textContent || '';
    const arr = () => [...document.querySelectorAll('.rmodal .prtb-b')];
    document.querySelectorAll('#layer .modal,.dropsplash').forEach((e) => e.remove()); window.__qb.roomModal(i); await wt(300);
    const a0 = title(), list0 = arr().map((e) => e.textContent.trim() + ' (' + e.parentElement.className + ')');
    const g = arr().find((e) => /Garden/.test(e.textContent)); if (g) g.click(); await wt(450); const a1 = title(), list1 = arr().map((e) => e.textContent.trim() + ' (' + e.parentElement.className + ')');
    const bb = arr().find((e) => /Boba/.test(e.textContent)); if (bb) bb.click(); await wt(450); const a2 = title();
    const up = arr().find((e) => /Upstairs/.test(e.textContent)); if (up) up.click(); await wt(450); const a3 = title();
    return { a0, list0, a1, list1, a2, a3 }; }, i);
  t(/Garden/.test(w.a1) && w.a2 === w.a0, `Boba "${w.a0}" [${w.list0.join(', ')}] -> "${w.a1}" [${w.list1.join(', ')}] -> "${w.a2}"`);
  t(/Dessert/i.test(w.a3), `Boba -> Upstairs -> "${w.a3}"`);
  oks.forEach((m) => console.log('  ok   ' + m)); fails.forEach((m) => console.log('  FAIL ' + m));
  console.log('page errors', errs.length, errs.slice(0, 3));
  await b.close();
})();
