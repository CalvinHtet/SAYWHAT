// First steps (Cal, 2026-11-14) on the plain build: a new player goes through every step (+50 each, +100 at the end, the card gone);
// "Show me" rings the step's target; a long-time player with everything done sees no card and gets no coins; a long-time player with
// one step left sees only that one and is paid for it.   BASE=<server of quest-board/> NODE_PATH=<playwright's parent> node rigtest/lead/firststeps.js [shot dir]
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:8766', OUT = process.argv[2] || '';
let fails = 0; const ok = (n, c, i) => { if (!c) fails++; console.log((c ? '  ok   ' : '  FAIL ') + n + (c ? '' : '  ' + JSON.stringify(i))); };
(async () => { const b = await chromium.launch({ args: ['--mute-audio'] });
  const page = async () => { const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 150)));
    await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft, null, { timeout: 90000 }); await p.waitForTimeout(1000); return { p, errs }; };
  const clear = (p) => p.evaluate(() => { document.querySelectorAll('#layer .modal,.bsplash,.dropsplash').forEach((m) => m.remove()); const t = document.getElementById('qbtour'); if (t && !window.__keepTour) t.remove(); });
  const card = (p) => p.evaluate(() => { const c = document.querySelector('.zx-fs'); if (!c) return null; return { head: c.querySelector('.zx-fs-h span').textContent, items: [...c.querySelectorAll('li')].map((l) => (l.classList.contains('ok') ? '+' : l.classList.contains('nx') ? '>' : '-') + l.querySelector('b').textContent), show: !!c.querySelector('[data-act=zxfsshow]') }; });
  const S = (p) => p.evaluate(() => { const S = window.__qb.x().S; return { coins: (S.fsd && S.fsd.coins) || 0, fsd: S.fsd, fsall: S.fsall }; });
  const wait = (p, ms = 3600) => p.waitForTimeout(ms);
  // ---- a new player
  { const { p, errs } = await page();
    await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Newbie', sex: 'f' }); delete S.calm; delete S.tours; delete S.fsd; delete S.fsall; S.coins = 0; S.tours = { welcome: 1 }; x.render(); });
    for (let k = 0; k < 5; k++) { await wait(p, 700); await clear(p); }
    await p.evaluate(() => { window.__qb.x().S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1 }; window.__qb.x().render(); });
    const c0 = await card(p), s0 = await S(p);
    ok('new player: the card shows the two open steps, the first with Show me', c0 && c0.head.startsWith('0 of 2') && c0.items.join('|') === ">Add today's tasks|-Finish one and tick it" && c0.show, { c0, s0 });
    if (OUT) await p.screenshot({ path: OUT + '/fs_new.png' });
    await p.evaluate(() => { window.__keepTour = 1; document.querySelector('[data-act=zxfsshow]').click(); }); await p.waitForTimeout(600);
    const ring = await p.evaluate(() => { const r = document.getElementById('qbtour'); return r && r.style.visibility !== 'hidden' ? r.querySelector('.tour-t').textContent : null; });
    ok('"Show me" rings the task box', ring === "Add today's tasks", ring);
    if (OUT) await p.screenshot({ path: OUT + '/fs_show.png' });
    await p.evaluate(() => { const t = document.querySelector('#qbtour [data-tour="skip"]'); if (t) t.click(); window.__keepTour = 0; });
    await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.quests.push({ id: 'qfs1', name: 'Laundry', xp: 30, stat: 'productivity', cl: 'home', rep: 'once' }); x.render(); }); await wait(p, 1200);
    const s1 = await S(p); ok('adding a task ticks step 1 and pays 50', s1.fsd.add === 1 && s1.coins === s0.coins + 50, { s0, s1 });
    await p.evaluate(() => window.__qb.x().toggle('qfs1')); await wait(p); await clear(p);
    const s2 = await S(p); ok('ticking it ticks step 2 and pays 50', s2.fsd.tick === 1 && s2.coins === s1.coins + 50, { s1: s1.coins, s2: s2.coins });
    ok('nothing else open: the card is gone for now', !(await card(p)), await card(p));
    await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.xp = Math.max(S.xp, x.cum(3)); S.areaOn = Object.assign({}, S.areaOn, { hideout: 1 }); x.render(); }); await wait(p, 1500); await clear(p);
    const c3 = await card(p); ok('level 3: Open The Loft, the first upgrade and Visit Town join the card', c3 && c3.items.join('|') === "+Add today's tasks|+Finish one and tick it|>Open The Loft|-Buy your first upgrade|-Visit Town", c3);
    const s3 = await S(p);
    await p.evaluate(() => document.querySelector('.nav button[data-v="hideout"]').click()); await wait(p, 2000); await clear(p);
    /* QA (b3f7e4d): the Loft's own bookkeeping keys in a room (__m35) are not a purchase */
    await p.evaluate(() => { const x = window.__qb.x(), S = x.S; const r = S.base.slots.find((q) => q && q.t === 'bedroom'); r.a = Object.assign({}, r.a, { __m35: 1 }); x.persist(); }); await wait(p); await clear(p);
    const s3b = await S(p); ok('a bookkeeping key in the Bedroom does not tick "Buy your first upgrade"', !s3b.fsd.buy && s3b.coins === s3.coins + 50, { s3: s3.coins, s3b });
    await p.evaluate(() => { const x = window.__qb.x(), S = x.S; const r = S.base.slots.find((q) => q && q.t === 'bedroom'); r.a = Object.assign({}, r.a, { bd_rug: 1 }); x.persist(); }); await wait(p); await clear(p);
    const s4 = await S(p); ok('opening The Loft and buying a real upgrade pay 50 each', s4.fsd.loft === 1 && s4.fsd.buy === 1 && s4.coins === s3.coins + 100, { s3: s3.coins, s4 });
    await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.xp = Math.max(S.xp, x.cum(12)); S.areaOn = Object.assign({}, S.areaOn, { hall: 1, shop: 1 }); window.__qbRooms.open('closet', 1); document.querySelector('.nav button[data-v="board"]').click(); }); await wait(p, 1500); await clear(p);
    const c5 = await card(p); ok('the Closet built opens the Shop: its step joins', c5 && /Visit Town/.test(c5.items.join('|')) && /Buy something to wear/.test(c5.items.join('|')), c5);
    const s5 = await S(p);
    await p.evaluate(() => document.querySelector('.nav button[data-v="hall"]').click()); await wait(p, 2000); await clear(p);
    await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.owned = Object.assign({}, S.owned, { gx_o_tee: 1 }); x.persist(); document.querySelector('.nav button[data-v="board"]').click(); }); await wait(p); await clear(p);
    const s6 = await S(p); ok('Town and a purchase pay 50 each, and finishing pays 100', s6.fsall === 1 && s6.coins === s5.coins + 200, { s5: s5.coins, s6 });
    ok('all done: the card is gone for good', !(await card(p)));
    ok('no page errors (new player)', errs.length === 0, errs.slice(0, 3)); }
  // ---- a long-time player with everything done
  { const { p, errs } = await page();
    await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.total = 300; S.xp = x.cum(25); S.coins = 5000; S.areaOn = { board: 1, train: 1, hideout: 1, hall: 1, shop: 1, players: 1 }; S.owned = { gx_o_tee: 1 }; const r = S.base.slots[0]; r.a = { bd_rug: 1 }; delete S.calm; delete S.fsd; delete S.fsall; x.render(); });
    for (let k = 0; k < 5; k++) { await wait(p, 700); await clear(p); }
    const s = await S(p); ok('long-time player, all done: no card, no coins, done for good', !(await card(p)) && s.coins === 0 && s.fsall === 1, s);
    ok('no page errors (long-time player)', errs.length === 0, errs.slice(0, 3)); }
  // ---- QA's review: a long-time save at level 15 or more is past first steps, whatever it has done
  { const { p, errs } = await page();
    await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Vet', sex: 'm' }); S.total = 120; S.xp = x.cum(20); let g, n = 0; S.gates = S.gates || []; while ((g = x.gated()) !== null && n++ < 80) S.gates.push(g); S.coins = 0; S.areaOn = { board: 1, hideout: 1, hall: 1, shop: 1 }; S.owned = {}; delete S.calm; delete S.fsd; delete S.fsall; x.render(); });
    for (let k = 0; k < 5; k++) { await wait(p, 700); await clear(p); }
    const s = await S(p); ok('a long-time save at level 15+: no card, no coins, done for good', !(await card(p)) && s.coins === 0 && s.fsall === 1, s);
    ok('no page errors (level 15+)', errs.length === 0, errs.slice(0, 3)); }
  // ---- a long-time player who never bought clothes
  { const { p, errs } = await page();
    await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Gf', sex: 'f' }); S.total = 80; S.xp = x.cum(14); S.coins = 900; S.areaOn = { board: 1, hideout: 1, hall: 1, shop: 1 }; S.owned = {}; const r = S.base.slots[0]; r.a = { bd_rug: 1 }; window.__qbRooms.open('closet', 1); delete S.calm; delete S.fsd; delete S.fsall; x.render(); });
    for (let k = 0; k < 5; k++) { await wait(p, 700); await clear(p); }
    const c = await card(p), s0 = await S(p);
    ok('long-time player missing the Shop: card says 5 of 6 and lists only the Shop (what they did before is not listed), no coins yet', c && c.head.startsWith('5 of 6') && c.items.join() === '>Buy something to wear' && s0.coins === 0, { c, s0 });
    if (OUT) await p.screenshot({ path: OUT + '/fs_gf.png' });
    await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.owned = { gx_o_tee: 1 }; x.persist(); }); await wait(p); await clear(p);
    const s1 = await S(p); ok('buying something pays 50 + 100 and ends the card', s1.coins === 150 && s1.fsall === 1 && !(await card(p)), s1);
    ok('no page errors (one step left)', errs.length === 0, errs.slice(0, 3)); }
  await b.close(); console.log(fails ? 'FAILED ' + fails : 'ALL PASS'); })().catch((e) => { console.log('crash', e.message); process.exit(2); });
