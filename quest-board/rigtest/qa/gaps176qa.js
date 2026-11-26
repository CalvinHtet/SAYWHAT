// QA, 3f59b687 (Cal 11-25 "redundant language" sweep: 20 filler lines cut). Visits the screens those lines were on and lists any VISIBLE
// text element left empty (p, small, span.note, .qs-lead, .note) that still takes height (> 4 px): the gap a removed line can leave.
// Screens: Board (normal and Edit mode, empty Board), profile, Goals window, Training card, Shop home, Street, Interface/Effects,
// Stylist, Pet Store, banners tab, Town square. At 390.
//   PORT=<plain build> OUT=<dir> node gaps176qa.js
const pw = require('playwright');
const PORT = process.env.PORT || 8819, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
const T = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, loft: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1, away: 1 };
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const errs = [];
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 }); await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort())); const p = await ctx.newPage(); p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV167 && window.__qbV149, null, { timeout: 120000 }); await p.waitForTimeout(800); await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' });
  await p.evaluate((T) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Gap', sex: 'm' }); S.xp = x.cum(30); S.gates = Array.from({ length: 200 }, (_, i) => i); S.tutDone = 1; S.calm = false; S.v67ref = 1; S.tours = T; S.areaOn = { board: 1, hideout: 1, shop: 1, train: 1 }; S.coins = 3000;
    S.quests = [{ id: 'h1', name: 'Dishes', xp: 10, stat: 'productivity', cl: 'home', rep: 'daily', mins: 10 }]; S.done = {}; try { window.__qbRooms.open('closet', 1); } catch (e) {} S.brandSeen = {}; try { window.__qbDrops.state().live.forEach((q) => { S.brandSeen[q.id + '|' + q.start] = 1; }); } catch (e) {} x.persist(); x.render(); }, T);
  const clr = () => p.evaluate(() => { for (const m of document.querySelectorAll('#layer .bsplash,#layer .dropsplash,.flsplash,#layer .qb-held')) m.remove(); });
  const scan = (name) => p.evaluate((name) => { const out = []; for (const e of document.querySelectorAll('#app p, #app small, #app .note, #app .qs-lead, #layer p, #layer small, #layer .note, #layer .qs-lead')) { const r = e.getBoundingClientRect(), cs = getComputedStyle(e); if (r.height > 4 && cs.display !== 'none' && cs.visibility !== 'hidden' && !e.textContent.trim() && !e.querySelector('img,svg,button,input,canvas,i,b,a')) out.push(e.tagName.toLowerCase() + '.' + String(e.className).split(' ').join('.') + ' h' + Math.round(r.height)); } return { name, out }; }, name);
  const res = []; const go = async (name, f, wait) => { await p.evaluate(() => { for (const m of document.querySelectorAll('#layer > *')) m.remove(); }); await p.evaluate(f); await p.waitForTimeout(wait || 900); await clr(); res.push(await scan(name)); };
  await go('Board', () => document.querySelector('.nav button[data-v="board"]').click());
  await go('Board edit', () => { const e = [...document.querySelectorAll('#app button')].find((x) => /^edit$/i.test(x.textContent.trim())); if (e) e.click(); });
  await go('Board empty', () => { const x = window.__qb.x(); x.S.quests = []; x.render(); });
  await go('Goals', () => { const g = document.querySelector('[data-v67="goals"]'); if (g) g.click(); });
  await go('Profile', () => document.querySelector('.strip .avbtn').click(), 1500);
  await go('Training', () => document.querySelector('.nav button[data-v="train"]').click());
  await go('Shop home', () => document.querySelector('.nav button[data-v="shop"]').click());
  for (const fl of ['street', 'iface', 'stylist', 'pets']) { await p.evaluate((fl) => { try { window.__qbV149.go(fl); } catch (e) {} }, fl); await p.waitForTimeout(1000); await clr(); res.push(await scan('Shop ' + fl)); }
  for (const r of res) ok(!r.out.length, r.name + ': no empty text block left ' + JSON.stringify(r.out.slice(0, 5)));
  await p.screenshot({ path: OUT + '/gaps_last.png' });
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
