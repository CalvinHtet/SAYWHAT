// Cal's 2026-11-23 code changes (29zz_v131.js), on the plain build (PORT): before the Lair's console there is no Upgrades tab at the
// bottom; with it there is, between Shop and Town, and it shows the permanent upgrades and, on its second tab, the interface pieces;
// the Shop has neither any more and its Stylist button sits beside the Wardrobe's; the console's screen opens the tab; the Flip Phone
// Lanyard, Retro Ringer Tee and Butterfly Baby Tee are off sale for a player who does not own them, still worn by one who does.
//   PORT=<plain build> NODE_PATH=<playwright's parent> node rigtest/lead/v131.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8779; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x, null, { timeout: 90000 }); await p.waitForTimeout(800);
  const setup = (lair) => p.evaluate((lair) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'f' }); S.xp = x.cum(20); S.gates = Array.from({ length: 200 }, (_, i) => i); S.areaOn = { board: 1, shop: 1, hideout: 1, hall: 1, players: 1 }; S.calm = false; S.fsall = 1; S.coins = 5000; S.owned = {};
    window.__qbRooms.open('closet', 1); if (lair) { window.__qbRooms.open('lair', 1); const r = S.base.slots.filter((q) => q && q.t === 'lair')[0]; r.a = Object.assign(r.a || {}, { lr_console: 1 }); } x.render(); }, lair);
  const gone = () => p.evaluate(() => document.querySelectorAll('#layer .modal,.dropsplash,.bsplash').forEach((m) => m.remove()));
  const nav = () => p.evaluate(() => [...document.querySelectorAll('.nav button[data-v]')].map((b) => b.dataset.v));
  await setup(false); let n = await nav(); ok(!n.includes('sys'), 'no Upgrades tab before the console: ' + n.join(','));
  await p.evaluate(() => document.querySelector('.nav button[data-v="shop"]').click()); await p.waitForTimeout(900); await gone();
  let s = await p.evaluate(() => ({ tabs: [...document.querySelectorAll('[data-act="stab"]')].map((t) => t.dataset.v), bar: [...document.querySelectorAll('.qs-bar [data-act="stab"]')].map((t) => t.dataset.v) }));
  ok(s.bar.join() === 'wardrobe,basics' && !s.tabs.includes('upgrades') && !s.tabs.includes('interface'), 'Shop: the Stylist beside the Wardrobe, no Upgrades or Interface ' + JSON.stringify(s));
  await setup(true); n = await nav(); ok(n.indexOf('sys') === n.indexOf('shop') + 1, 'with the console the Upgrades tab is there, after Shop: ' + n.join(','));
  await p.evaluate(() => document.querySelector('.nav button[data-v="shop"]').click()); await p.waitForTimeout(900); await gone();
  s = await p.evaluate(() => ({ tabs: [...document.querySelectorAll('[data-act="stab"]')].map((t) => t.dataset.v), uplab: !!document.querySelector('.qs-uplab') }));
  ok(!s.tabs.includes('upgrades') && !s.tabs.includes('interface') && !s.uplab, 'the Shop has no Upgrades with the console either ' + JSON.stringify(s));
  await p.evaluate(() => document.querySelector('.nav button[data-v="sys"]').click()); await p.waitForTimeout(900); await gone();
  s = await p.evaluate(() => ({ h: (document.querySelector('.sxv h1') || {}).textContent, cards: document.querySelectorAll('.sxv button').length - 2, on: (document.querySelector('.nav button.on') || {}).dataset }));
  ok(s.h === 'Upgrades' && s.cards > 0, 'the tab shows the permanent upgrades (' + s.cards + ' cards)');
  await p.screenshot({ path: (process.env.OUT || '.') + '/v131_upgrades.png' });
  await p.evaluate(() => document.querySelector('[data-act="sxtab"][data-v="interface"]').click()); await p.waitForTimeout(700);
  s = await p.evaluate(() => ({ pv: !!document.querySelector('.sxv .qs-fitif'), cards: document.querySelectorAll('.sxv .qs-rack > *').length }));
  ok(s.pv && s.cards > 0, 'and the interface pieces on its second tab (' + s.cards + ')'); await p.screenshot({ path: (process.env.OUT || '.') + '/v131_interface.png' });
  await p.evaluate(() => { const x = window.__qb.x(); window.__qb.x().render(); }); 
  const cut = await p.evaluate(() => { const x = window.__qb.x(), S = x.S; const f = (id) => { const it = x.SHOP.find((q) => q[0] === id); return { fits: x.itemFits ? x.itemFits(it) : null, cut: !!(it && it[6].cut) }; };
    const r = ['gx_y_phone', 'gx_y_ring', 'gx_y_baby'].map(f); S.owned.gx_y_ring = true; const own = x.itemFits ? x.itemFits(x.SHOP.find((q) => q[0] === 'gx_y_ring')) : null; return { r, own }; });
  ok(cut.r.every((q) => q.cut), 'the three pieces are cut ' + JSON.stringify(cut));
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
