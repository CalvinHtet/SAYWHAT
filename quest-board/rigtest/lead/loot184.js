// Cal 11-26 (29zz_v184.js): rarer free cosmetics; a furniture find waits in its room, first in the list, for free, and the card says where.
//   PORT=<build server> NODE_PATH=<playwright's parent> OUT=<dir> node rigtest/lead/loot184.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8838, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const errs = [];
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage(); p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV184, null, { timeout: 90000 }); await p.waitForTimeout(400);
  await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' }); const V = (f, a) => p.evaluate(f, a);
  const w = await V(() => ({ w: window.__qbV184.w(), c3: window.__qbV184.chest3() }));
  const wt = (k) => (w.w.find((x) => x[0] === k) || [0, 0])[1], tot = w.w.reduce((a, x) => a + x[1], 0), acc = (w.c3.find((x) => x[0] === 'acc') || [0, 0])[1];
  ok(wt('cloth') === 4 && wt('bout') === 1 && tot === 100 && acc === 12, 'free clothes are rarer: loot 4 + 1 in 100 (were 12 + 2), the Daily Quest chest\'s accessory 12% (was 33%) ' + JSON.stringify(w));
  const g = await V(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'C', sex: 'm' }); S.xp = x.cum(8); S.tutDone = 1; S.coins = 0; S.base.slots = [{ t: 'bedroom', a: {}, st: 0, pend: 0 }]; S.freeUp = {}; x.render(); document.querySelectorAll('#layer .modal').forEach((m) => m.remove());
    const o = window.__qbV184.give('furn'); return { o: { k: o.k, free: o.free, ad: o.ad && o.ad[0], name: o.ad && o.ad[1], room: o.room, bld: o.bld }, inst: !!(S.base.slots[0].a[o.ad && o.ad[0]]), freeUp: Object.keys(S.freeUp) }; });
  ok(g.o.k === 'furn' && g.o.free === 1 && !g.inst && g.freeUp[0] === 'bedroom:' + g.o.ad, 'a furniture find is not installed; it is marked free for its room ' + JSON.stringify(g));
  const card = await V(() => { document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); const S = window.__qb.x().S, k = Object.keys(S.freeUp)[0], aid = k.split(':')[1]; const ad = window.__qb.x().ADDONS.bedroom.find((a) => a[0] === aid);
    window.__qbV184.show({ k: 'furn', ad, free: 1, room: 'Bedroom', bld: 'The Loft' }); const m = document.querySelector('#layer .lootm'); return m ? m.innerText.replace(/\s+/g, ' ') : ''; });
  ok(/Free in your Bedroom, in The Loft/.test(card) && /0 coins/.test(card) && !/Installed/.test(card), 'the loot card says where it waits, for free: ' + card);
  await p.screenshot({ path: OUT + '/loot184_card.png' });
  const room = await V(async () => { document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); window.__qb.roomModal(0); await new Promise((o) => setTimeout(o, 900)); const first = document.querySelector('#layer .rmodal .addon.next'), btn = first && first.querySelector('[data-act="raddon"]');
    return { first: first ? first.className : '', aid: first && first.getAttribute('data-aid'), btn: btn ? btn.innerText.trim() : '', dis: btn ? btn.disabled : null }; });
  const aid = g.o.ad; ok(room.aid === aid && /v84/.test(room.first) && /^free$/i.test(room.btn) && !room.dis, 'its room lists it first with a Free button, even with 0 coins ' + JSON.stringify(room));
  await p.screenshot({ path: OUT + '/loot184_room.png' });
  const buy = await V(async (aid) => { const S = window.__qb.x().S, c0 = S.coins; document.querySelector('#layer .rmodal [data-act="raddon"][data-id="' + aid + '"]').click(); await new Promise((o) => setTimeout(o, 600)); return { inst: !!S.base.slots[0].a[aid], dc: S.coins - c0, left: Object.keys(S.freeUp).length, price: window.__qb.x().ADDONS.bedroom.find((a) => a[0] === aid)[2] }; }, aid);
  ok(buy.inst && buy.dc >= 0 /* a First steps reward may pay */ && buy.left === 0 && buy.price > 0, 'installing it costs nothing and clears the mark; the upgrade keeps its normal price for everyone else ' + JSON.stringify(buy));
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
