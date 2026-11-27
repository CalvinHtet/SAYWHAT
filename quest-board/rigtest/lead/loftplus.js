// Cal 11-23: with the Walk-in Closet on offer, the view inside The Loft includes its "+" (and zooms out a little); once the Closet is
// built both rooms are in view. The Loft tour: the tab, then "This is The Loft" on the building, then "Your rooms".
//   PORT=<plain build> NODE_PATH=<playwright's parent> OUT=<dir> node rigtest/lead/loftplus.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8779, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbLoft, null, { timeout: 90000 }); await p.waitForTimeout(800);
  const clear = () => p.evaluate(() => document.querySelectorAll('#layer .modal,#layer .qb-held,.bsplash').forEach((m) => m.remove()));
  const setup = (own) => p.evaluate((own) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(6); S.gates = [5]; S.calm = false; S.tours = { welcome: 1, hideout: 1, hall: 1, players: 1, train: 1, dq: 1, bty: 1, away: 1, banner: 1 }; S.unl = Object.assign({ console: 1, pets: 1, acc2: 1, sable7: 1 }, S.unl || {}); S.areaOn = { board: 1, hideout: 1, hall: 1, players: 1, train: 1 };
    const r = S.base.slots.find((q) => q && q.t === 'bedroom'); r.a = {}; own.forEach((k) => r.a[k] = 1); S.letters = { read: { welcome: 1, live135: 1 }, paid: {}, at: {}, popped: 1 }; x.render(); }, own);
  const enter = async () => { await p.evaluate(() => document.querySelector('.nav button[data-v="hideout"]').click()); await p.waitForTimeout(1500); await clear();
    await p.evaluate(() => { const g = document.querySelector('[data-act="bldgo"][data-v="0"]'); if (g) g.dispatchEvent(new MouseEvent('click', { bubbles: true })); }); await p.waitForTimeout(2500); await clear(); };
  const look = () => p.evaluate(() => { const w = document.getElementById('lfwrap').getBoundingClientRect(), pl = [...document.querySelectorAll('.alplus')].map((e) => { const r = e.getBoundingClientRect(); return { inView: r.left >= w.left - 2 && r.right <= w.right + 2 && r.top >= w.top - 2 && r.bottom <= w.bottom + 2, r: [r.x, r.y, r.width, r.height].map(Math.round) }; });
    return { s: window.__qbLoft().V.s, plus: pl }; });
  await setup(['bd_rug']); await enter(); const v0 = await look(); await p.screenshot({ path: OUT + '/loft_0_nothing.png' });
  await setup(['bd_rug', 'bd_plant', 'bd_art2', 'bd_art3', 'bd_clock', 'bd_lights', 'bd_ward1']); await p.evaluate(() => { window.__qbLoft().V.init = 0; }); await enter(); const v1 = await look(); await p.screenshot({ path: OUT + '/loft_1_closet_offered.png' });
  ok(v1.plus.length >= 1 && v1.plus.every((q) => q.inView), 'with the Closet on offer its "+" is in view ' + JSON.stringify(v1));
  ok(v1.s < v0.s || !v0.s, 'and the view zoomed out a little (' + v0.s.toFixed(3) + ' -> ' + v1.s.toFixed(3) + ')');
  await setup(['bd_rug', 'bd_plant', 'bd_art2', 'bd_art3', 'bd_clock', 'bd_lights', 'bd_ward1', 'bd_ward2']); await p.evaluate(() => { window.__qbRooms.open('closet', 1); window.__qbLoft().V.init = 0; }); await enter(); const v2 = await look(); await p.screenshot({ path: OUT + '/loft_2_closet_built.png' });
  ok(v2.s < v0.s, 'with the Closet built both rooms are in view, the view wider than the Bedroom alone (' + v0.s.toFixed(3) + ' -> ' + v2.s.toFixed(3) + '; on offer ' + v1.s.toFixed(3) + ')');
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
