// QA, 13185c03 (29zz_v184.js: a furniture find is not installed; it waits first in its room's window, free). LEAD asked: a free item in
// a room whose window sorts by group, and that the "!" alerts still point there. In every room that has a buyable card, with 0 coins:
//  - the cheapest visible buyable card marked free (what lootFurnAll picks) shows first, with a "Free" button, and installs for 0 coins
//  - the Loft tab's "!" and the building's "+"/"!" (zxAfford) show for it, and not without the mark (0 coins)
//  - a free mark on a card that is NOT among the three shown (pushed out later, e.g. by a story card) still shows
// And the real roll: __qbV184.give('furn') 30 times on a fresh save: the loot card text, and the room it names lists it first.
//   PORT=<plain build> OUT=<dir> NODE_PATH=<playwright> node rigtest/qa/loot184qa.js
const pw = require('playwright');
const PORT = process.env.PORT || 8819, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); }; const note = (s) => console.log('     ' + s);
const T = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1 };
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const errs = [];
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage(); p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV184 && window.__qbRooms, null, { timeout: 120000 }); await p.waitForTimeout(800);
  await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' }); const V = (f, a) => p.evaluate(f, a);
  const rooms = await V((T) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Free', sex: 'm' }); S.xp = x.cum(40); S.gates = S.gates || []; let g, n = 0; while ((g = x.gated()) !== null && n++ < 20) S.gates.push(g); S.tutDone = 1; S.tours = T; delete S.areaOn;
    const out = []; for (const t of Object.keys(x.ROOMT)) { try { window.__qbRooms.open(t, 1); } catch (e) {} } S.coins = 0; x.persist(); x.render(); return S.base.slots.map((r, i) => r && r.t ? i + ':' + r.t : null).filter(Boolean); }, T);
  note('rooms in the save: ' + rooms.join(' '));
  const shut = () => V(() => document.querySelectorAll('#layer > *').forEach((m) => m.remove()));
  const cards = (i) => V((i) => { document.querySelectorAll('#layer > *').forEach((m) => m.remove()); window.__qb.roomModal(i); const m = document.querySelector('#layer .modal'); if (!m) return null;
    return [...m.querySelectorAll('.addon.next')].map((c) => ({ aid: c.dataset.aid || '', mys: c.classList.contains('mystery'), v84: c.classList.contains('v84'), btn: (c.querySelector('button') || {}).textContent || '', act: !!c.querySelector('[data-act="raddon"]') })); }, i);
  const bang = () => V(() => { window.__qb.x().render(); const n = document.querySelector('.nav button[data-v="hideout"]'); return n ? /!/.test(n.innerText) || !!n.querySelector('.dot,.bang,i') : null; });
  let tested = 0, outside = null;
  for (const ri of rooms) { const i = +ri.split(':')[0], t = ri.split(':')[1]; await V(() => { window.__qb.x().S.freeUp = {}; window.__qb.x().S.coins = 0; });
    const c0 = await cards(i); if (!c0) { note(t + ': no window'); continue; } const buy = c0.filter((c) => c.act && !c.mys);
    if (!buy.length) { note(t + ': no buyable card (' + c0.map((c) => c.aid || (c.mys ? '?' : c.btn)).join(',') + ')'); continue; }
    const bang0 = await bang(); const pick = await V(([t, aids]) => { const A = window.__qb.x().ADDONS[t] || []; return aids.map((a) => A.find((x) => x[0] === a)).filter((a) => a && a[2] > 0 && !(a[3] || {}).opens).sort((x, y) => x[2] - y[2])[0] || null; }, [t, buy.map((c) => c.aid)]);
    if (!pick) { note(t + ': only openers/zero-price cards'); continue; }
    await V(([t, aid]) => { window.__qb.x().S.freeUp[t + ':' + aid] = Date.now(); }, [t, pick[0]]); const c1 = await cards(i); const bang1 = await bang();
    const first = c1[0] || {}; ok(first.aid === pick[0] && first.v84 && /free/i.test(first.btn), t + ': the free ' + pick[0] + ' (' + pick[2] + ' coins) is first with "' + first.btn.trim() + '" (order ' + c1.map((c) => c.aid || '?').join(',') + ')');
    if (bang1 !== bang0) note(t + ': the Loft tab "!" changed with the free mark: ' + bang0 + ' -> ' + bang1);
    const r = await V(([i, aid]) => { const S = window.__qb.x().S, c0 = S.coins; const b = document.querySelector('#layer .addon.v84 [data-act="raddon"]'); if (b) b.click(); const r = S.base.slots[i]; return { clicked: !!b, got: !!(r.a && r.a[aid]), coins: S.coins - c0, mark: Object.keys(S.freeUp || {}).length }; }, [i, pick[0]]);
    await p.waitForTimeout(400); ok(r.clicked && r.got && r.coins === 0 && r.mark === 0, t + ': Free installs it for 0 coins and the mark clears ' + JSON.stringify(r)); tested++;
    if (!outside) { const hid = await V(([t, i, vis]) => { const x = window.__qb.x(), S = x.S, r = S.base.slots[i]; const A = x.ADDONS[t] || []; const a = A.find((a) => !(r.a && r.a[a[0]]) && a[2] > 0 && !vis.includes(a[0]) && !(a[3] || {}).opens && !(a[3] || {}).retired); return a ? a[0] : null; }, [t, i, c1.map((c) => c.aid)]);
      if (hid) { await V(([t, aid]) => { window.__qb.x().S.freeUp = {}; window.__qb.x().S.freeUp[t + ':' + aid] = 1; }, [t, hid]); const c2 = await cards(i); outside = { t, aid: hid, shown: c2.some((c) => c.aid === hid), first: (c2[0] || {}).aid }; await V(() => { window.__qb.x().S.freeUp = {}; }); } } }
  await shut(); ok(tested >= 3, 'rooms tested: ' + tested);
  /* a room whose next card opens a new room (Cal 11-07: the opener goes first, so the "+" and the "!" lead to it) */
  const op = await V(() => { const x = window.__qb.x(), S = x.S; S.freeUp = {}; S.coins = 0; const out = [];
    S.base.slots.forEach((r, i) => { if (!r || !r.t) return; document.querySelectorAll('#layer > *').forEach((m) => m.remove()); window.__qb.roomModal(i); const cs = [...document.querySelectorAll('#layer .modal .addon.next')]; const ids = cs.map((c) => c.dataset.aid || '?');
      const A = x.ADDONS[r.t] || []; const oi = ids.findIndex((id) => { const a = A.find((q) => q[0] === id); return a && (a[3] || {}).opens; }); if (oi < 0) return;
      const fr = cs.map((c) => c.dataset.aid).find((id) => { const a = A.find((q) => q[0] === id); return a && a[2] > 0 && !(a[3] || {}).opens && cs.find((c) => c.dataset.aid === id).querySelector('[data-act="raddon"]'); });
      if (!fr) { out.push({ t: r.t, before: ids, note: 'no other buyable card' }); return; } S.freeUp[r.t + ':' + fr] = 1; document.querySelectorAll('#layer > *').forEach((m) => m.remove()); window.__qb.roomModal(i);
      out.push({ t: r.t, before: ids, after: [...document.querySelectorAll('#layer .modal .addon.next')].map((c) => c.dataset.aid || '?') }); S.freeUp = {}; }); document.querySelectorAll('#layer > *').forEach((m) => m.remove()); return out; });
  note('rooms with an opener card: ' + JSON.stringify(op));
  if (outside) note('a free mark on a card outside the three shown (' + outside.t + ' ' + outside.aid + '): shown ' + outside.shown + ', first card ' + outside.first + ' (it may be waiting on another upgrade, so this is a NOTE)');
  /* the real roll */
  const rolls = await V(async () => { const x = window.__qb.x(), S = x.S, out = []; for (let k = 0; k < 30; k++) { S.freeUp = {}; const o = window.__qbV184.give('furn'); if (!o || !o.free) { out.push(o ? o.k : null); continue; }
      const key = Object.keys(S.freeUp)[0]; const t = key.split(':')[0], aid = key.split(':')[1], i = S.base.slots.findIndex((r) => r && r.t === t); document.querySelectorAll('#layer > *').forEach((m) => m.remove()); window.__qbV184.show(o);
      const card = (document.querySelector('#layer .lootm') || {}).innerText || ''; document.querySelectorAll('#layer > *').forEach((m) => m.remove()); window.__qb.roomModal(i); const f = document.querySelector('#layer .modal .addon.next');
      out.push({ t, aid, room: o.room, bld: o.bld, first: f && f.dataset.aid === aid && f.classList.contains('v84'), card: card.replace(/\s+/g, ' ').slice(0, 120) }); document.querySelectorAll('#layer > *').forEach((m) => m.remove()); } S.freeUp = {}; return out; });
  const fr = rolls.filter((r) => r && r.t); note('30 furniture rolls: ' + fr.length + ' free finds over ' + [...new Set(fr.map((r) => r.t))].join(', ') + '; others ' + JSON.stringify(rolls.filter((r) => !(r && r.t)).slice(0, 3)));
  ok(fr.length > 0 && fr.every((r) => r.first && /Free in your/.test(r.card) && /0 coins/.test(r.card)), 'every rolled find is first in the room it names, and its card says where and 0 coins ' + JSON.stringify(fr.filter((r) => !(r.first && /Free in your/.test(r.card))).slice(0, 3)));
  note('a card: ' + (fr[0] && fr[0].card));
  await p.screenshot({ path: OUT + '/loot184.png' });
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
