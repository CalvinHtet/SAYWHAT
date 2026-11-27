// Cal 11-24 (29zz_v143.js): the Walk-in Closet can be bought from level 3, first in the Bedroom's list, without the Figurine Cabinet,
// and the Cabinet stays on sale after it; the Loft button gets a "!" (once more for a save that had seen the card); the Board's "!"
// for the old Players tab is gone (it lights Town, and opening the Hall clears it).
//   PORT=<plain build> NODE_PATH=<playwright's parent> OUT=<dir> node rigtest/lead/closet143.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8779, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbV143, null, { timeout: 90000 }); await p.waitForTimeout(800);
  await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' });
  const V = (f, a) => p.evaluate(f, a);
  const setup = (lv) => V((lv) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(lv); S.calm = false; S.coins = 0;
    S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, away: 1, banner: 1 }; S.unl = Object.assign({ console: 1, pets: 1, acc2: 1, sable7: 1 }, S.unl || {}); S.tutDone = 1; S.areaOn = { board: 1, hideout: 1, hall: 1, players: 1 }; x.render(); return x.effLvl(); }, lv);
  const bed = () => V(() => { const x = window.__qb.x(), S = x.S; document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); const i = S.base.slots.findIndex((r) => r && r.t === 'bedroom'); window.__qb.roomModal(i);
    const cards = [...document.querySelectorAll('.rmodal .addon')].filter((c) => !c.classList.contains('got')); const r = { first: cards[0] ? cards[0].innerText.replace(/\s+/g, ' ').slice(0, 90) : '', firstId: cards[0] && cards[0].dataset.aid,
      buy: !!document.querySelector('.rmodal button[data-act="raddon"][data-id="bd_ward2"]'), mystery: [...document.querySelectorAll('.rmodal .addon.mystery')].map((c) => c.innerText.replace(/\s+/g, ' ')).join(' | '),
      cab: !!document.querySelector('.rmodal button[data-act="raddon"][data-id="bd_ward1"]'), needs: /Needs Figurine/.test(document.querySelector('.rmodal').innerText) }; document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); return r; });
  const bang = (v) => V((v) => { window.__qbV143.paint(); const b = document.querySelector('.nav button[data-v="' + v + '"]'); return !!(b && b.querySelector('.nbang')); }, v);
  /* level 2: not yet, and the card says the level */
  ok(await setup(2) === 2, 'a level 2 save');
  let r = await bed(); const l2 = await V(() => window.__qbV143.line('closet')); ok(!r.buy && l2[1] === false && l2[2] === 'Level 2 of 3', 'level 2: no Closet to buy, its line says "' + l2[2] + '"');
  ok(!(await bang('hideout')), 'level 2: no "!" on the Loft');
  /* level 3: first in the list, no Cabinet needed, "!" on the Loft */
  await setup(3); r = await bed(); ok(r.buy && r.firstId === 'bd_ward2' && !r.needs, 'level 3: the Walk-in Closet is first and can be bought: ' + r.first);
  ok(await V(() => window.__qbV143.line('closet')[1] === true), 'its unlock is met at level 3');
  await V(() => document.querySelector('.nav button[data-v="board"]').click()); await p.waitForTimeout(400);
  ok(await bang('hideout'), 'level 3: "!" on the Loft button'); await p.screenshot({ path: OUT + '/closet143_bang.png' });
  /* opening the Loft clears it, and it stays cleared */
  await V(() => document.querySelector('.nav button[data-v="hideout"]').click()); await p.waitForTimeout(900); await V(() => document.querySelector('.nav button[data-v="board"]').click()); await p.waitForTimeout(400);
  ok(!(await bang('hideout')), 'opening the Loft clears the "!", and it does not come back');
  /* a save that saw the card before this version: once more */
  await V(() => { const S = window.__qb.x().S; delete S.cl143; const o = window.__qbV143.seen(); o.room.closet = 1; });
  ok(await bang('hideout'), 'a level 3+ save that had seen the card gets the "!" once more');
  await V(() => document.querySelector('.nav button[data-v="hideout"]').click()); await p.waitForTimeout(900); await V(() => document.querySelector('.nav button[data-v="board"]').click()); await p.waitForTimeout(400);
  ok(!(await bang('hideout')) && await V(() => window.__qb.x().S.cl143 === 1), 'and only once');
  /* buying it: 600 coins, the room opens, the Cabinet is still on sale */
  const price = await V(() => { const x = window.__qb.x(), S = x.S; S.coins = 5000; const i = S.base.slots.findIndex((r) => r && r.t === 'bedroom'); window.__qb.roomModal(i); const bt = document.querySelector('.rmodal button[data-act="raddon"][data-id="bd_ward2"]'); const c0 = S.spent || 0; bt.click(); return (S.spent || 0) - c0; });
  await p.waitForTimeout(1500); await V(() => document.querySelectorAll('#layer .modal,.overlay').forEach((m) => m.remove()));
  ok(price === 600 && await V(() => window.__qb.x().S.base.slots.some((r) => r && r.t === 'closet')), 'bought for ' + price + ' coins with no Cabinet, and the Closet is a room');
  /* a save with the Closet never gets the extra "!" */
  await V(() => { const S = window.__qb.x().S; delete S.cl143; window.__qbV143.bang(); }); ok(await V(() => window.__qb.x().S.cl143 === 1) && !(await bang('hideout')), 'a save that has the Closet: no "!"');
  /* the window shows the next few only: with every other Bedroom piece owned, the Cabinet is what is left to buy */
  await V(() => { const x = window.__qb.x(), S = x.S, r = S.base.slots.find((q) => q && q.t === 'bedroom'); (x.ADDONS.bedroom || []).forEach((a) => { const e = a[3] || {}; if (a[0] !== 'bd_ward1' && !e.opens && !e.retired && !e.trophy) r.a[a[0]] = 1; }); });
  r = await bed(); ok(r.cab, 'the Figurine Cabinet can still be bought after the Closet');
  /* the Board's "!" for the old Players tab */
  await V(() => { const o = window.__qbV143.seen(); delete o.tab.players; o.tab.hall = 1; document.querySelector('.nav button[data-v="hideout"]').click(); }); await p.waitForTimeout(700);
  const t = await V(() => window.__qbV143.tabs()); ok(!t.players && t.hall === 1, 'Players new: it lights Town, not the Board ' + JSON.stringify(t));
  ok(!(await bang('board')) && await bang('hall'), 'no "!" on the Board tab, "!" on Town');
  await V(() => document.querySelector('.nav button[data-v="hall"]').click()); await p.waitForTimeout(900); await V(() => document.querySelector('.nav button[data-v="hideout"]').click()); await p.waitForTimeout(600);
  ok(!(await bang('hall')) && !(await bang('board')) && await V(() => window.__qbV143.seen().tab.players === 1), 'opening the Hall clears it for good');
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
