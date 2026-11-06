// Retired upgrades in any room (ROOM=<type>): a new player with everything else bought sees no card for them; a save that owns them
// keeps every id, none of them is drawn, and the room (with or without them) has nothing outside or overlapping. Pictures of both.
//   ROOM=rooftop OUT=<folder> node retired.js
const fs = require('fs'), path = require('path');
const { open, openRoom, audit } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
const ROOM = process.env.ROOM || 'rooftop';
(async () => {
  const { b, p, errs } = await open({ width: 1000, height: 900, owned: 'none' });
  const fails = [], oks = [], t = (c, m) => (c ? oks : fails).push(m);
  const i = await p.evaluate((k) => { const S = window.__qb.x().S; if (!S.base.slots.some((s) => s.t === k)) S.base.slots.push({ t: k, a: {}, st: 0, pend: 0 }); return S.base.slots.findIndex((s) => s.t === k); }, ROOM);
  const ret = await p.evaluate((k) => window.__qb.x().ADDONS[k].filter((u) => u[3] && u[3].retired).map((u) => [u[0], u[1], (u[3].art && (Array.isArray(u[3].art[0]) ? u[3].art.map((a) => a[0]) : [u[3].art[0]])) || [u[2 + 1] || ''].concat(typeof u[3] === 'object' ? [] : [])]), ROOM);
  console.log('retired in ' + ROOM + ': ' + ret.map((r) => r[0] + ' ' + r[1]).join(', '));
  const r = await p.evaluate(async ({ i, k }) => { const x = window.__qb.x(), S = x.S, r = S.base.slots[i], w = (ms) => new Promise((o) => setTimeout(o, ms)); S.coins = 9e6;
    r.a = {}; x.ADDONS[k].forEach((u) => { if (!(u[3] && (u[3].retired || u[3].opens))) r.a[u[0]] = 1; });
    document.querySelectorAll('#layer .modal').forEach((e) => e.remove()); window.__qb.roomModal(i); await w(400);
    const ids = x.ADDONS[k].filter((u) => u[3] && u[3].retired).map((u) => u[0]), names = x.ADDONS[k].filter((u) => u[3] && u[3].retired).map((u) => u[1]);
    return { forSale: [...document.querySelectorAll('.rmodal [data-act="raddon"]')].map((e) => e.dataset.id).filter((id) => ids.includes(id)).length,
      shown: [...document.querySelectorAll('.rmodal .addon')].filter((e) => names.some((n) => e.innerText.includes(n))).length }; }, { i, k: ROOM });
  t(!r.forSale && !r.shown, `new player, everything else bought: no card for the retired pieces (for sale ${r.forSale}, shown ${r.shown})`);
  const drawn = {};
  for (const [lab, own] of [['new', false], ['owner', true]]) {
    const kept = await p.evaluate(({ i, k, own }) => { const x = window.__qb.x(), r = x.S.base.slots[i]; r.a = {}; x.ADDONS[k].forEach((u) => { if (u[3] && u[3].opens) return; if (u[3] && u[3].retired && !own) return; r.a[u[0]] = 1; }); x.persist(); x.render();
      return x.ADDONS[k].filter((u) => u[3] && u[3].retired).filter((u) => r.a[u[0]]).length; }, { i, k: ROOM, own });
    await openRoom(p, i, 1000, 760);
    drawn[lab] = await p.evaluate(() => [...new Set([...document.querySelectorAll('#qahost image')].map((e) => ((e.getAttribute('href') || '').match(/[a-z]+x_[a-z0-9_]+/) || [])[0]).filter(Boolean))].sort());
    const a = await audit(p, i);
    t(true, `${lab}: retired ids kept ${kept}/${own ? ret.length : 0}; ${drawn[lab].length} sprites drawn` + (a.outside.length ? `, OUTSIDE ${a.outside.join(' ')}` : '') + (a.overlap.length ? `, overlaps ${a.overlap.map((o) => o.slice(0, 2).join('+')).join(' ')}` : ''));
    if (own) t(kept === ret.length, `owner keeps all ${ret.length} retired ids`);
    await (await p.$('#qahost')).screenshot({ path: path.join(OUT, `${ROOM}_retired_${lab}.png`) });
  }
  const extra = drawn.owner.filter((k) => !drawn.new.includes(k));
  t(!extra.length, `owning the retired pieces draws nothing more` + (extra.length ? ` (extra: ${extra.join(' ')})` : ''));
  oks.forEach((m) => console.log('  ok   ' + m)); fails.forEach((m) => console.log('  FAIL ' + m));
  console.log('page errors', errs.length, errs.slice(0, 3));
  await b.close();
})();
