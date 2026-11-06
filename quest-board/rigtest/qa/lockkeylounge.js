// Cal's Lock and Key lounge redo (ROOMS's 707cac1): the Chesterfield (sb_chester) and the Champagne Trolley (sb_trolley) are retired:
// a new player gets no card for them; an owner keeps both ids but neither is drawn; fully bought, nothing outside or overlapping.
//   OUT=<folder> node lockkeylounge.js
const fs = require('fs'), path = require('path');
const { open, openRoom, audit } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const { b, p, errs } = await open({ width: 1000, height: 900, owned: 'none' });
  const fails = [], oks = [], t = (c, m) => (c ? oks : fails).push(m);
  const i = await p.evaluate(() => { const S = window.__qb.x().S; if (!S.base.slots.some((s) => s.t === 'skybar')) S.base.slots.push({ t: 'skybar', a: {}, st: 0, pend: 0 }); return S.base.slots.findIndex((s) => s.t === 'skybar'); });
  const r = await p.evaluate(async (i) => { const x = window.__qb.x(), S = x.S, r = S.base.slots[i], w = (ms) => new Promise((o) => setTimeout(o, ms)); S.coins = 9e6;
    const ret = x.ADDONS.skybar.filter((u) => u[3] && u[3].retired).map((u) => u[0]);
    r.a = {}; x.ADDONS.skybar.forEach((u) => { if (!(u[3] && (u[3].retired || u[3].opens))) r.a[u[0]] = 1; });
    document.querySelectorAll('#layer .modal').forEach((e) => e.remove()); window.__qb.roomModal(i); await w(400);
    const forSale = [...document.querySelectorAll('.rmodal [data-act="raddon"]')].map((e) => e.dataset.id).filter((id) => ['sb_chester', 'sb_trolley'].includes(id));
    const shown = [...document.querySelectorAll('.rmodal .addon')].map((e) => e.innerText).filter((t) => /Chesterfield|Champagne Trolley/.test(t)).length;
    return { ret, forSale, shown }; }, i);
  t(['sb_chester', 'sb_trolley'].every((k) => r.ret.includes(k)), `retired: ${r.ret.join(', ')}`);
  t(!r.forSale.length && !r.shown, `a new player with everything else bought: no card for them (for sale ${r.forSale.length}, shown ${r.shown})`);
  for (const [lab, extra] of [['new', []], ['owner', ['sb_chester', 'sb_trolley']]]) {
    await p.evaluate(({ i, extra }) => { const x = window.__qb.x(), r = x.S.base.slots[i]; r.a = {}; x.ADDONS.skybar.forEach((u) => { if (!(u[3] && (u[3].retired || u[3].opens))) r.a[u[0]] = 1; }); extra.forEach((k) => (r.a[k] = 1)); x.persist(); x.render(); }, { i, extra });
    await openRoom(p, i, 1000, 760);
    const keys = await p.evaluate(() => [...document.querySelectorAll('#qahost image')].map((e) => ((e.getAttribute('href') || '').match(/sbx_[a-z0-9]+/) || [])[0]).filter(Boolean));
    const kept = await p.evaluate(({ i, extra }) => extra.filter((k) => window.__qb.x().S.base.slots[i].a[k]).length, { i, extra });
    const a = await audit(p, i);
    t(!keys.some((k) => /chester|trolley|champ/.test(k)) && kept === extra.length, `${lab}: ids kept ${kept}/${extra.length}, drawn: ${[...new Set(keys)].join(' ')}`);
    t(!a.outside.length && !a.overlap.length, `${lab}: nothing outside or overlapping` + (a.outside.length ? ' OUTSIDE ' + a.outside.join(' ') : '') + (a.overlap.length ? ' overlaps ' + a.overlap.map((o) => o.slice(0, 2).join('+')).join(' ') : '') + (a.depth.length ? ', depth ' + a.depth.slice(0, 3).join('; ') : ''));
    await (await p.$('#qahost')).screenshot({ path: path.join(OUT, `lockkey_lounge_${lab}.png`) });
  }
  oks.forEach((m) => console.log('  ok   ' + m)); fails.forEach((m) => console.log('  FAIL ' + m));
  console.log('page errors', errs.length, errs.slice(0, 3));
  await b.close();
})();
