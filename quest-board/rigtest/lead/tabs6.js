// Training back in the tab bar (Cal, 2026-11-17: "I want the training tab to still be on the bottom as a new tab"), on the plain build, at
// 360, 390 and 430 wide: the bar is Board, Training, The Loft, Shop, Town, Players, every tab and its label inside the screen and not
// cut; the Training tab opens Training, lights itself and has no "< Board" link; the Board has no Training tile but keeps Dungeon
// Crawls'; a new player in the calm week's first three days has no Training tab, and on day 4 has it, with its tour ringing the tab.
//   PORT=<plain build server> NODE_PATH=<playwright's parent> [SHOTS=<dir>] node rigtest/lead/tabs6.js
const { chromium } = require('playwright');
let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
const base = 'http://127.0.0.1:' + (process.env.PORT || 8779), SHOTS = process.env.SHOTS || '';
(async () => { const b = await chromium.launch({ args: ['--mute-audio'] });
  const page = async (w) => { const p = await (await b.newContext({ viewport: { width: w, height: 844 } })).newPage(); p.errs = []; p.on('pageerror', (e) => p.errs.push(e.message.slice(0, 150)));
    await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x, null, { timeout: 90000 }); await p.waitForTimeout(1000);
    await p.evaluate(() => setInterval(() => document.querySelectorAll('#layer .modal,.dropsplash,.bsplash').forEach((m) => m.remove()), 300)); return p; };
  const setup = (p, calmDays) => p.evaluate((calmDays) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Christopher', sex: 'm' }); S.xp = x.cum(calmDays ? 3 : 30);
    S.gates = Array.from({ length: 200 }, (_, i) => i); S.calm = calmDays ? { days: Array.from({ length: calmDays }, (_, i) => '2026-11-' + String(10 + i).padStart(2, '0')).concat([]) } : false;
    S.tours = calmDays ? { welcome: 1, dq: 1, bty: 1 } : { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, away: 1, wheel: 1, trophy: 1, freeze: 1 };
    S.areaOn = { board: 1, train: 1, hideout: 1, shop: 1, hall: 1, players: 1, trophy: 1, wheel: 1, away: 1 };
    S.base.slots = ['bedroom', 'closet', 'lair'].map((t) => ({ t, a: {}, st: 0, pend: 0 })); x.render(); }, calmDays);
  const state = (p) => p.evaluate(() => { const bs = [...document.querySelectorAll('.nav button')]; return { nav: bs.map((n) => n.dataset.v), on: (document.querySelector('.nav button.on') || { dataset: {} }).dataset.v,
    fit: bs.every((n) => { const r = n.getBoundingClientRect(), s = n.querySelector('span'); return r.left >= 0 && r.right <= innerWidth + 0.5 && (!s || s.scrollWidth <= s.clientWidth + 1); }),
    back: !!document.querySelector('.zx-back'), tiles: [...document.querySelectorAll('.zx-tile')].map((t) => t.dataset.v), sw: document.documentElement.scrollWidth }; });
  for (const w of [360, 390, 430]) { const p = await page(w); await setup(p, 0); await p.waitForTimeout(800);
    let s = await state(p);
    ok(s.nav.join() === 'board,train,hideout,shop,hall,players' && s.fit && s.sw <= w, `${w}: the bar is Board, Training, The Loft, Shop, Town, Players, all inside and uncut ` + JSON.stringify(s));
    ok(s.tiles.indexOf('train') < 0 && s.tiles.indexOf('away') >= 0, `${w}: the Board has no Training tile, keeps Dungeon Crawls' ` + JSON.stringify(s.tiles));
    if (SHOTS) await p.screenshot({ path: `${SHOTS}/tabs6_${w}.png`, clip: { x: 0, y: 844 - 110, width: w, height: 110 } });
    await p.evaluate(() => document.querySelector('.nav button[data-v="train"]').click()); await p.waitForTimeout(900); s = await state(p);
    const tr = await p.evaluate(() => !!document.querySelector('.trhead') || /Training/.test(document.getElementById('app').innerText));
    ok(tr && s.on === 'train' && !s.back, `${w}: the tab opens Training, lights itself, no "< Board" link ` + JSON.stringify({ tr, on: s.on, back: s.back }));
    ok(!p.errs.length, `${w}: no page errors ` + JSON.stringify(p.errs.slice(0, 3))); await p.context().close(); }
  // the calm week: day 2 no tab, day 4 the tab and its tour
  let p = await page(390); await setup(p, 2); await p.waitForTimeout(1500);
  let s = await state(p); ok(s.nav.indexOf('train') < 0, 'a new player on day 2: no Training tab yet ' + JSON.stringify(s.nav)); await p.context().close();
  p = await page(390); await setup(p, 4); await p.waitForTimeout(4000); s = await state(p);
  const tour = await p.evaluate(() => { const t = document.getElementById('qbtour'); const r = t && t.querySelector('.tour-ring'), n = document.querySelector('.nav button[data-v="train"]'); if (!t || !r || !n) return { none: 1, txt: t && t.innerText };
    const a = r.getBoundingClientRect(), c = n.getBoundingClientRect(); return { txt: t.innerText.split('\n')[0], rings: a.left <= c.left + 2 && a.right >= c.right - 2 && a.top <= c.top + 2 && a.bottom >= c.bottom - 2 }; });
  ok(s.nav.indexOf('train') >= 0 && /Training/.test(tour.txt || '') && tour.rings, 'day 4: the Training tab, and its tour rings the tab ' + JSON.stringify({ nav: s.nav, tour }));
  ok(!p.errs.length, 'no page errors ' + JSON.stringify(p.errs.slice(0, 3))); await p.context().close();
  await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
