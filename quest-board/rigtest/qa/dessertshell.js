// ROOMS's painted Dessert Parlor (f0c6dbb): the shell (dsw_t1) bare and fully bought, the audit (outside, overlaps, depth); what stands
// on the "Hidden Door" (the painted bookcase); "Downstairs" to the Boba shop and back up, and the Hidden Door to the speakeasy and
// back, with the corner each arrow sits in. Pictures of each.
//   OUT=<folder> node dessertshell.js
const fs = require('fs'), path = require('path');
const { open, openRoom, audit } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const { b, p, errs } = await open({ width: 1000, height: 900, owned: 'none' });
  const fails = [], oks = [], t = (c, m) => (c ? oks : fails).push(m);
  const i = await p.evaluate(() => { const S = window.__qb.x().S; ['boba', 'dessert', 'speakeasy'].forEach((k) => { if (!S.base.slots.some((s) => s.t === k)) S.base.slots.push({ t: k, a: {}, st: 0, pend: 0 }); }); return S.base.slots.findIndex((s) => s.t === 'dessert'); });
  for (const full of [false, true]) {
    const names = await p.evaluate(({ i, full }) => { const x = window.__qb.x(), r = x.S.base.slots[i]; r.a = {}; if (full) x.ADDONS.dessert.forEach((u) => { if (u[3] && (u[3].retired || u[3].opens)) return; r.a[u[0]] = 1; }); return Object.keys(r.a).length; }, { i, full });
    await openRoom(p, i, 1000, 760);
    const shell = await p.evaluate(() => [...new Set([...document.querySelectorAll('#qahost image')].map((e) => ((e.getAttribute('href') || '').match(/dsw_[a-z0-9]+/) || [])[0]).filter(Boolean))].join(','));
    const a = await audit(p, i);
    // the doors' glow spots, and what stands over each
    const doors = await p.evaluate(() => { const host = document.querySelector('#qahost'); const g = [...host.querySelectorAll('[data-portal], .lfportal, [class*=portal]')]; return g.map((e) => { const r = e.getBoundingClientRect(); return (e.getAttribute('data-portal') || e.getAttribute('class')) + '@' + Math.round(r.left) + ',' + Math.round(r.top) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height); }); });
    const sign = await p.evaluate(() => { const im = [...document.querySelectorAll('#qahost image')].filter((e) => /dsx_(book|shelf|soft|mac)/.test(e.getAttribute('href') || '')); return im.map((e) => { const r = e.getBoundingClientRect(); return (e.getAttribute('href').match(/dsx_[a-z0-9]+/) || [''])[0] + '@' + Math.round(r.left) + ',' + Math.round(r.top) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height); }); });
    t(shell === 'dsw_t1', `${full ? 'fully bought' : 'bare'} (${names} upgrades): shell ${shell || 'NONE'}, ${a.items.length} pieces` + (a.outside.length ? `, OUTSIDE ${a.outside.join(' ')}` : '') + (a.overlap.length ? `, overlaps ${a.overlap.map((o) => o.slice(0, 2).join('+')).join(' ')}` : '') + (a.depth.length ? `, depth ${a.depth.slice(0, 3).join('; ')}` : '') + (a.stations.length ? `, spots ${[...new Set(a.stations)].slice(0, 3).join('; ')}` : ''));
    console.log(`  ${full ? 'full' : 'bare'}: door glows ${JSON.stringify(doors)}; sign ${JSON.stringify(sign)}`);
    await (await p.$('#qahost')).screenshot({ path: path.join(OUT, `dessert_${full ? 'full' : 'bare'}.png`) });
  }
  // walk Dessert -> Downstairs -> Boba -> Upstairs -> Dessert -> Hidden Door -> speakeasy -> back
  const w = await p.evaluate(async (i) => { const wt = (ms) => new Promise((o) => setTimeout(o, ms));
    const title = () => (document.querySelector('.rmodal .rm-title') || {}).textContent || '';
    const arr = () => [...document.querySelectorAll('.rmodal .prtb-b')];
    const list = () => arr().map((e) => e.textContent.trim() + ' (' + e.parentElement.className + ')').join(', ');
    const go = async (re) => { const e = arr().find((x) => re.test(x.textContent)); if (e) e.click(); await wt(450); return !!e; };
    document.querySelectorAll('#layer .modal,.dropsplash').forEach((e) => e.remove()); window.__qb.roomModal(i); await wt(300);
    const out = [[title(), list()]];
    for (const re of [/Downstairs/, /Upstairs/, /Hidden/, /Dessert/]) { const ok = await go(re); out.push([title(), list(), ok]); }
    return out; }, i);
  console.log('  walk: ' + w.map((x) => '"' + x[0] + '" [' + x[1] + ']').join(' -> '));
  t(/Dessert/.test(w[0][0]) && /Boba/.test(w[1][0]) && /Dessert/.test(w[2][0]) && /speak|Lock|Key|bar/i.test(w[3][0]) && /Dessert/.test(w[4][0]), 'Downstairs, Upstairs, Hidden Door and back all land where they should');
  oks.forEach((m) => console.log('  ok   ' + m)); fails.forEach((m) => console.log('  FAIL ' + m));
  console.log('page errors', errs.length, errs.slice(0, 3));
  await b.close();
})();
