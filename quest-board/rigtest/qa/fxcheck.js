// Screen FX (LEAD's 59d31a0; Cal: "I don't like the crt scan lines. And the red hue it too aggressive"): at levels 23, 24, 28, 34 and
// 45, which full-screen overlays are on the Board, that no scanline layer exists, Starlight from 24 sits behind the panels, the
// vignette and edge glow are soft (their box-shadow), and on The Loft, inside a building and in a room window no overlay shows.
// Pictures of the Board and The Loft at 45 at phone size.   BASE=<server> OUT=<folder> node fxcheck.js
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:8769', OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
const fails = []; const ok = (n, c, g) => { console.log((c ? '  ok   ' : '  FAIL ') + n + (g !== undefined ? '  ' + JSON.stringify(g).slice(0, 300) : '')); if (!c) fails.push(n); };
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft, null, { timeout: 90000 }); await p.waitForTimeout(1200);
  const tab = async (v) => { await p.evaluate((v) => { document.querySelectorAll('#layer .modal,.dropsplash').forEach((e) => e.remove()); const x = window.__qb.x(); const bt = document.querySelector('.nav button[data-v="' + v + '"]'); if (bt) bt.click(); }, v); await p.waitForTimeout(2200); };
  const fx = () => p.evaluate(() => [...document.querySelectorAll('.fxo')].map((e) => { const c = getComputedStyle(e); return { id: e.id, shown: c.display !== 'none' && +c.opacity > 0, z: c.zIndex, shadow: c.boxShadow.slice(0, 70), bg: /repeating-linear/.test(c.backgroundImage) ? 'LINES' : c.backgroundImage === 'none' ? '' : 'img' }; }));
  for (const lv of [23, 24, 28, 34, 45]) {
    await p.evaluate((lv) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = S.char && S.char.name ? S.char : window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(lv); S.gates = [5, 10, 20, 30, 40]; S.areaOn = null; x.persist(); x.render(); }, lv);
    await tab('board'); const f = await fx(); const on = f.filter((e) => e.shown).map((e) => e.id);
    console.log(`level ${lv} board: ${on.join(' ')}`);
    ok(`level ${lv}: no scanline layer`, !f.some((e) => e.id === 'fxo-scan' && e.shown) && !f.some((e) => e.bg === 'LINES'), f.filter((e) => e.id === 'fxo-scan' || e.bg === 'LINES'));
    ok(`level ${lv}: Starlight ${lv >= 24 ? 'on' : 'off'}`, on.includes('fxo-stars') === (lv >= 24), on);
    if (lv >= 28) ok(`level ${lv}: vignette soft`, /0\.32/.test((f.find((e) => e.id === 'fxo-vignette') || {}).shadow || ''), f.find((e) => e.id === 'fxo-vignette'));
    if (lv >= 34) ok(`level ${lv}: edge glow on, softened`, on.includes('fxo-edgeglow'), f.find((e) => e.id === 'fxo-edgeglow'));
    if (lv === 45) {
      await p.screenshot({ path: path.join(OUT, 'fx_board45.png') });
      const z = await p.evaluate(() => { const s = document.getElementById('fxo-stars'), m = document.querySelector('main, #app .card, .card'); return { stars: s && getComputedStyle(s).zIndex, card: m && getComputedStyle(m).zIndex, pos: m && getComputedStyle(m).position }; });
      ok('Starlight sits behind the panels (z-index -1)', z.stars === '-1', z);
      await tab('hideout'); ok('The Loft opened', await p.evaluate(() => document.body.classList.contains('loftmode') && document.querySelector('.nav button.on').dataset.v === 'hideout')); const fl = (await fx()).filter((e) => e.shown).map((e) => e.id); await p.screenshot({ path: path.join(OUT, 'fx_loft45.png') });
      ok('The Loft (street): no overlay', fl.length === 0, fl);
      await p.evaluate(() => { const g = document.querySelector('[data-act="bldgo"]'); if (g) g.dispatchEvent(new MouseEvent('click', { bubbles: true })); }); await p.waitForTimeout(2500);
      ok('inside a building: no overlay', (await fx()).filter((e) => e.shown).length === 0, (await fx()).filter((e) => e.shown));
      await p.evaluate(() => window.__qb.roomModal(0)); await p.waitForTimeout(1800); await p.screenshot({ path: path.join(OUT, 'fx_room45.png') });
      ok('a room window from The Loft: no overlay', (await fx()).filter((e) => e.shown).length === 0, (await fx()).filter((e) => e.shown));
      await tab('board'); await p.evaluate(() => window.__qb.roomModal(0)); await p.waitForTimeout(1800);
      const fr = (await fx()).filter((e) => e.shown).map((e) => e.id); await p.screenshot({ path: path.join(OUT, 'fx_room_from_board45.png') });
      console.log('  (note) a room window opened over the Board keeps: ' + (fr.join(' ') || 'nothing'));
      await tab('shop'); console.log('  shop: ' + (await fx()).filter((e) => e.shown).map((e) => e.id).join(' '));
    }
  }
  const names = await p.evaluate(() => document.body.innerHTML.match(/Starlight|CRT|scanline|Scanline/g));
  console.log('words on the page now:', JSON.stringify(names));
  ok('no page errors', errs.length === 0, errs.slice(0, 3));
  console.log(fails.length ? 'FAILED ' + fails.length : 'PASS'); await b.close();
})();
