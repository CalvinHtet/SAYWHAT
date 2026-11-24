// QA check of LEAD's dd7327f6 (Cal 11-24: the Walk-in Closet from level 3, first in the Bedroom's list, a "!" on the Loft).
// Each case is its own fresh browser (empty storage), phone size, plain build, every request off this machine refused:
//   A  a new save made in the creator, levelled 1 -> 2 -> 3 by completing quests on the Board (not by writing a level in)
//   B  an old level-12 save without the Closet that had already looked at the Closet's card (S.alSeen.room.closet) before v1.43
//   C  an old save that owns the Closet and the Cabinet (the Cabinet must show as Installed, not vanish)
//   D  buying the Closet first at level 3 with no Cabinet: the Closet room, the Shop opening, the Bedroom drawing, then the Cabinet after
//   E  the Board's stuck "!" for the old Players tab
// Every "!" case is checked across a reload too (it must not come back once cleared).
//   BASE=<plain build server> OUT=<dir> node closet143.js
const pw = require('playwright'), fs = require('fs');
const BASE = process.env.BASE, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const fresh = async () => { const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 }); await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
    const p = await ctx.newPage(); p.errs = []; p.on('pageerror', (e) => p.errs.push(e.message.slice(0, 200)));
    await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbV143 && window.QBLoft && QBLoft.data, null, { timeout: 120000 }); await p.waitForTimeout(1200); return { ctx, p }; };
  const reload = async (p) => { await p.waitForTimeout(3000); /* the game saves a moment after a change (a reload sooner loses it) */ await p.reload(); await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbV143, null, { timeout: 120000 }); await p.waitForTimeout(2500); };
  const V = (p, f, a) => p.evaluate(f, a);
  const shut = (p) => V(p, () => { document.querySelectorAll('#layer .modal,.overlay,.dropsplash').forEach((m) => m.remove()); try { if (window.TOUR) TOUR.id = null; } catch (e) {} });
  const nav = async (p, v) => { await shut(p); await V(p, (v) => { const e = document.querySelector('.nav button[data-v="' + v + '"]'); if (e) e.dispatchEvent(new MouseEvent('click', { bubbles: true })); }, v); await p.waitForTimeout(900); await shut(p); };
  const bang = (p, v) => V(p, (v) => { try { window.__qbV143.paint(); } catch (e) {} const e = document.querySelector('.nav button[data-v="' + v + '"]'); return e ? (e.querySelector('.nbang') ? 'bang' : 'none') : 'no button'; }, v);
  /* the Bedroom's room window, as a player sees it: the cards in order, what each says, and which can be bought */
  const bed = (p) => V(p, () => { document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); const S = window.__qb.x().S; const i = S.base.slots.findIndex((r) => r && r.t === 'bedroom'); if (i < 0) return null; window.__qb.roomModal(i);
    const M = document.querySelector('.rmodal'); const cards = [...M.querySelectorAll('.addon')].map((c) => ({ id: c.dataset.aid || '', got: c.classList.contains('got'), mys: c.classList.contains('mystery'), buy: !!c.querySelector('button[data-act="raddon"]'), t: (c.innerText || c.textContent).replace(/\s+/g, ' ').trim().slice(0, 80) })); /* a shut Installed list has no innerText: its textContent still names each piece */
    const r = { cards, closetBuy: !!M.querySelector('button[data-act="raddon"][data-id="bd_ward2"]'), cabBuy: !!M.querySelector('button[data-act="raddon"][data-id="bd_ward1"]'), text: M.innerText.replace(/\s+/g, ' ') }; return r; });
  const shopOpen = async (p) => { await nav(p, 'shop'); const n = await V(p, () => document.querySelectorAll('[data-act="stab"]').length + document.querySelectorAll('[data-act="buy"]').length + document.querySelectorAll('.shub-tile').length); await nav(p, 'board'); return n > 0; }; /* from v1.47 the Shop opens on its home screen (.shub-tile) */
  const lvl = (p) => V(p, () => window.__qb.x().effLvl());
  /* complete Board quests until the level changes (the real way up: toggle is what a tap on a quest does) */
  const levelTo = async (p, L) => { for (let n = 0; n < 80 && (await lvl(p)) < L; n++) { await V(p, (L) => { const x = window.__qb.x(), S = x.S; if (x.effLvl() < L) S.xp = Math.max(S.xp || 0, x.cum(L) - 3); const q = document.querySelector('[data-act="toggle"]:not(.done), .quest:not(.done) [data-act="toggle"]'); if (q) q.dispatchEvent(new MouseEvent('click', { bubbles: true })); }, L); await p.waitForTimeout(500); await shut(p); } return lvl(p); };

  /* ---------- A: a new save from the creator, levelled by quests ---------- */
  { const { ctx, p } = await fresh(); console.log('-- A: new save from the creator');
    await p.waitForFunction(() => document.querySelector('#ccname'), null, { timeout: 60000 }); await p.fill('#ccname', 'Qa'); await p.click('[data-act="ccnext"]');
    await p.waitForFunction(() => document.querySelector('[data-act="ccdone"]'), null, { timeout: 60000 }); await p.waitForTimeout(600); await p.click('[data-act="ccdone"]'); await p.waitForTimeout(3000); await shut(p);
    ok(await V(p, () => window.__qb.x().S.created === true), 'the creator made a save (level ' + (await lvl(p)) + ')');
    const toggles = await V(p, () => document.querySelectorAll('[data-act="toggle"]').length); console.log('     quests on the Board:', toggles);
    const l2 = await levelTo(p, 2); ok(l2 === 2, 'level 2 by quests (got ' + l2 + ')');
    const line2 = await V(p, () => window.__qbV143.line('closet')); ok(line2 && line2[1] === false && line2[2] === 'Level 2 of 3', 'level 2: the Closet line is ' + JSON.stringify(line2 && line2.slice(0, 3)));
    let r = await bed(p); ok(r && !r.closetBuy, 'level 2: the Closet cannot be bought; its card: ' + (r ? (r.cards.find((c) => /Closet|Level 2 of 3/.test(c.t)) || {}).t : 'no Bedroom'));
    await shut(p); console.log('     level 2: Loft button', await bang(p, 'hideout'), '| areaOn', JSON.stringify(await V(p, () => window.__qb.x().S.areaOn)));
    const l3 = await levelTo(p, 3); ok(l3 === 3, 'level 3 by quests (got ' + l3 + ')');
    await nav(p, 'board'); const lb = await bang(p, 'hideout'); const loftOpen = await V(p, () => !!window.__qbUnlock.on().hideout);
    console.log('     level 3: Loft open', loftOpen, '| Loft button', lb, '| cl143', await V(p, () => window.__qb.x().S.cl143));
    if (!loftOpen) { /* the Loft is one-a-day below level 10: let the next day's reveal open it, as a player's next day would */
      await V(p, () => { const S = window.__qb.x().S; S.unlockDay = ''; S.areaDay = ''; try { window.__qbUnlock.reveal(); } catch (e) {} window.__qb.x().render(); }); await p.waitForTimeout(800); await shut(p);
      console.log('     after the next day\'s reveal: Loft open', await V(p, () => !!window.__qbUnlock.on().hideout)); }
    ok((await bang(p, 'hideout')) === 'bang', 'level 3: "!" on the Loft button');
    await p.screenshot({ path: OUT + '/c143_A_bang.png' });
    r = await bed(p); const first = r.cards.filter((c) => !c.got)[0] || {}; ok(r.closetBuy && first.id === 'bd_ward2' && !/Needs Figurine/.test(r.text), 'level 3: the Walk-in Closet is first and can be bought: ' + first.t);
    await p.screenshot({ path: OUT + '/c143_A_bedroom.png' }); await shut(p);
    await nav(p, 'hideout'); await nav(p, 'board'); ok((await bang(p, 'hideout')) === 'none', 'opening the Loft clears the "!"');
    await reload(p); await shut(p); ok((await bang(p, 'hideout')) === 'none', 'and it stays cleared after a reload');
    ok(!p.errs.length, 'A: no page errors ' + JSON.stringify(p.errs.slice(0, 3))); await ctx.close(); }

  /* an old save written straight in (as it would be on a phone before v1.43) */
  const old = (p, lv, own) => V(p, ([lv, own]) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Old', sex: 'f' }); S.cls = 'vanguard'; S.xp = x.cum(lv); S.gates = [5, 10].filter((g) => g <= lv); S.calm = false; S.coins = 3000;
    S.tours = { welcome: 1, hideout: 1, train: 1, dq: 1, bty: 1, hall: 1, shop: 1, players: 1 }; S.tutDone = 1; S.areaOn = { board: 1, train: 1, hideout: 1, shop: 1, hall: 1, players: 1, away: 1, wheel: 1, trophy: 1 };
    const r = S.base.slots.find((q) => q && q.t === 'bedroom'); r.a = r.a || {}; ['bd_bed1', 'bd_chair0', 'bd_rug', 'bd_nstand'].forEach((k) => { r.a[k] = 1; }); own.forEach((k) => { r.a[k] = 1; });
    if (own.indexOf('bd_ward2') >= 0 && !S.base.slots.some((q) => q && q.t === 'closet')) S.base.slots.push({ t: 'closet', a: {}, st: 0, pend: 0 });
    delete S.cl143; S.alSeen = { init: 1, room: { closet: 1 }, bld: { closet: 1 }, tab: { board: 1, train: 1, hideout: 1, shop: 1, hall: 1, players: 1, away: 1, wheel: 1, trophy: 1 }, brand: {} };
    x.persist(); x.render(); }, [lv, own]);

  /* ---------- B: an old level-12 save with no Closet that had seen its card ---------- */
  { const { ctx, p } = await fresh(); console.log('-- B: old level-12 save, no Closet, had seen its card');
    await old(p, 12, ['bd_ward1']); await reload(p); await shut(p); await nav(p, 'board');
    ok((await bang(p, 'hideout')) === 'bang', 'B: the "!" comes back once on the Loft button (cl143 ' + (await V(p, () => window.__qb.x().S.cl143)) + ')');
    const r = await bed(p); const first = r.cards.filter((c) => !c.got)[0] || {}; ok(r.closetBuy && first.id === 'bd_ward2', 'B: the Closet is first in the Bedroom: ' + first.t); await shut(p);
    await nav(p, 'hideout'); await nav(p, 'train'); ok((await bang(p, 'hideout')) === 'none', 'B: opening the Loft clears it');
    await reload(p); await shut(p); ok((await bang(p, 'hideout')) === 'none', 'B: still cleared after a reload (only once)');
    ok(!p.errs.length, 'B: no page errors ' + JSON.stringify(p.errs.slice(0, 3))); await ctx.close(); }

  /* ---------- C: an old save that owns the Closet and the Cabinet ---------- */
  { const { ctx, p } = await fresh(); console.log('-- C: old save owning Closet and Cabinet');
    await old(p, 12, ['bd_ward1', 'bd_ward2']); await reload(p); await shut(p); await nav(p, 'board');
    ok((await bang(p, 'hideout')) === 'none' && (await V(p, () => window.__qb.x().S.cl143)) === 1, 'C: no "!" for a save that has the Closet');
    const r = await bed(p); const cab = r.cards.find((c) => /^Figurine Cabinet/.test(c.t)), clo = r.cards.find((c) => /^Walk-in Closet/.test(c.t));
    ok(cab && cab.got, 'C: the Figurine Cabinet shows as Installed: ' + (cab ? cab.t : 'not listed'));
    ok(clo && clo.got, 'C: the Walk-in Closet shows as Installed: ' + (clo ? clo.t : 'not listed'));
    console.log('     cards:', r.cards.map((c) => (c.id || c.t.split(' ').slice(0, 2).join(' ')) + (c.got ? '*' : '')).join(', ')); await p.screenshot({ path: OUT + '/c143_C_window.png' }); await shut(p);
    ok(!p.errs.length, 'C: no page errors ' + JSON.stringify(p.errs.slice(0, 3))); await ctx.close(); }

  /* ---------- D: the Closet bought first at level 3, no Cabinet ---------- */
  { const { ctx, p } = await fresh(); console.log('-- D: buy the Closet first at level 3');
    await old(p, 3, []); await V(p, () => { const S = window.__qb.x().S; S.alSeen = { init: 0 }; S.areaOn = { board: 1, train: 1, hideout: 1, hall: 1, away: 1 }; S.tours = { welcome: 1, hideout: 1, train: 1, dq: 1, bty: 1, hall: 1 }; window.__qb.x().persist(); });
    await reload(p); await shut(p);
    ok(!(await shopOpen(p)), 'D: before the Closet the Shop is shut (no floors draw)');
    const price = await V(p, () => { const x = window.__qb.x(), S = x.S; const i = S.base.slots.findIndex((r) => r && r.t === 'bedroom'); window.__qb.roomModal(i); const bt = document.querySelector('.rmodal button[data-act="raddon"][data-id="bd_ward2"]'); if (!bt) return -1; const c0 = S.coins; bt.click(); return c0 - S.coins; });
    await p.waitForTimeout(2500); await p.screenshot({ path: OUT + '/c143_D_after_buy.png' }); await shut(p);
    ok(price === 600, 'D: bought for ' + price + ' coins with no Cabinet');
    ok(await V(p, () => window.__qb.x().S.base.slots.some((r) => r && r.t === 'closet')), 'D: the Closet is a room');
    await nav(p, 'board'); const sb = await bang(p, 'shop'); ok(sb === 'bang', 'D: the Shop button gets its "!" when the Closet opens it (' + sb + ')');
    ok(await shopOpen(p), 'D: the Shop is open'); ok((await bang(p, 'shop')) === 'none', 'D: opening the Shop clears its "!"');
    await nav(p, 'shop'); const shop = await V(p, () => ({ floors: document.querySelectorAll('[data-act="stab"]').length, items: document.querySelectorAll('.shop [data-act="buy"], [data-act="buy"]').length, txt: (document.querySelector('main, #app') || document.body).innerText.replace(/\s+/g, ' ').slice(0, 120) }));
    ok(shop.floors > 0 || shop.items > 0 || /Street Shop/.test(shop.txt), 'D: the Shop opens with ' + shop.floors + ' floors, ' + shop.items + ' buy buttons: ' + shop.txt); await p.screenshot({ path: OUT + '/c143_D_shop.png' });
    /* the Bedroom drawn: inside the Loft, the Bedroom's view (door to the Closet, no Cabinet yet) */
    await nav(p, 'hideout'); await V(p, () => { const g = document.querySelectorAll('[data-act="bldgo"]')[0]; if (g) g.dispatchEvent(new MouseEvent('click', { bubbles: true })); }); await p.waitForTimeout(3500); await shut(p);
    await p.screenshot({ path: OUT + '/c143_D_loft_closet_only.png' });
    const bi = await V(p, () => window.__qb.x().S.base.slots.findIndex((r) => r && r.t === 'bedroom')); await V(p, (i) => window.__qb.roomModal(i), bi); await p.waitForTimeout(3500); await p.screenshot({ path: OUT + '/c143_D_bedroom_closet_only.png' });
    /* the window lists the next few by price; where is the Cabinet in the Bedroom's list now, and does it come up as the rest is bought */
    let r = await bed(p); console.log('     after the Closet, the window shows:', r.cards.filter((c) => !c.got).map((c) => c.id || c.t.slice(0, 20)).join(', '), '| Cabinet price', await V(p, () => (window.__qb.x().ADDONS.bedroom.find((a) => a[0] === 'bd_ward1') || [])[2])); await shut(p);
    let steps = 0; for (; steps < 60 && !(r = await bed(p)).cabBuy; steps++) { const nx = r.cards.filter((c) => c.buy && c.id && c.id !== 'bd_ward1')[0]; await shut(p); if (!nx) break;
      await V(p, (id) => { const S = window.__qb.x().S; S.coins = 99999; const i = S.base.slots.findIndex((q) => q && q.t === 'bedroom'); window.__qb.roomModal(i); const bt = document.querySelector('.rmodal button[data-act="raddon"][data-id="' + id + '"]'); if (bt) bt.click(); }, nx.id); await p.waitForTimeout(700); await shut(p); }
    ok(r.cabBuy, 'D: the Figurine Cabinet comes up for sale after the Closet (after buying ' + steps + ' other Bedroom pieces the way the window offers them)'); await shut(p);
    const p2 = await V(p, () => { const S = window.__qb.x().S; S.coins = 3000; const i = S.base.slots.findIndex((r) => r && r.t === 'bedroom'); window.__qb.roomModal(i); const bt = document.querySelector('.rmodal button[data-act="raddon"][data-id="bd_ward1"]'); if (!bt) return -1; const c0 = S.coins; bt.click(); return c0 - S.coins; });
    await p.waitForTimeout(2500); await shut(p); ok(p2 > 0, 'D: the Cabinet bought afterwards for ' + p2);
    await V(p, (i) => window.__qb.roomModal(i), bi); await p.waitForTimeout(3500); await p.screenshot({ path: OUT + '/c143_D_bedroom_both.png' }); await shut(p);
    r = await bed(p); ok(r.cards.find((c) => /^Figurine Cabinet/.test(c.t) && c.got) && r.cards.find((c) => /^Walk-in Closet/.test(c.t) && c.got), 'D: both show as Installed'); await shut(p);
    await reload(p); await shut(p); ok((await V(p, () => window.__qb.x().S.base.slots.some((r) => r && r.t === 'closet'))) && (await shopOpen(p)), 'D: after a reload the Closet and the Shop are still there');
    ok(!p.errs.length, 'D: no page errors ' + JSON.stringify(p.errs.slice(0, 3))); await ctx.close(); }

  /* ---------- E: the Board's stuck "!" for the old Players tab ---------- */
  { const { ctx, p } = await fresh(); console.log('-- E: the Board\'s "!" for Players');
    await old(p, 12, ['bd_ward1', 'bd_ward2']); await V(p, () => { const S = window.__qb.x().S; delete S.alSeen.tab.players; window.__qb.x().persist(); }); await reload(p); await shut(p);
    await nav(p, 'hideout'); const bb = await bang(p, 'board'), bh = await bang(p, 'hall'); ok(bb === 'none' && bh === 'bang', 'E: Players new lights Town, not the Board (Board ' + bb + ', Town ' + bh + ')');
    await nav(p, 'hall'); await nav(p, 'hideout'); ok((await bang(p, 'hall')) === 'none' && (await bang(p, 'board')) === 'none', 'E: opening Town clears it');
    await reload(p); await shut(p); await nav(p, 'hideout'); ok((await bang(p, 'hall')) === 'none' && (await bang(p, 'board')) === 'none', 'E: still clear after a reload');
    ok(!p.errs.length, 'E: no page errors ' + JSON.stringify(p.errs.slice(0, 3))); await ctx.close(); }
  await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
