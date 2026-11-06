// What a brand-new player sees (ROOMS: "new saves now land on a locked Loft tab"): an empty browser profile opens the game;
// which screen shows, which tab is active and which tabs are locked; then, after the character is made (the game's own
// fixChar and created flag, then a reload), the same again. Screenshots of both.
//   OUT=<folder> BASE=<server> node freshstart.js
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
const BASE = process.env.BASE || 'http://127.0.0.1:8769';
(async () => {
  for (const mobile of [false, true]) {
    const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
    const p = await b.newPage({ viewport: mobile ? { width: 390, height: 844 } : { width: 1000, height: 900 } });
    const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
    await p.goto(BASE + '/dist/index.html'); await p.waitForTimeout(5000);
    const state = () => p.evaluate(() => { const nav = [...document.querySelectorAll('.nav button')];
      return { active: (nav.find((b) => b.classList.contains('on') || b.classList.contains('active') || b.getAttribute('aria-current')) || {}).dataset?.v || null,
        tabs: nav.map((b) => b.dataset.v + (b.disabled || /lock|soon/i.test(b.className + ' ' + b.innerText) ? '[' + (/soon/i.test(b.className + b.innerText) ? 'soon' : 'locked') + ']' : '')).join(' '),
        heading: ((document.querySelector('main h1, main h2, .view h1, .view h2, h1, h2') || {}).innerText || '').trim().slice(0, 60),
        text: (document.querySelector('main') || document.body).innerText.replace(/\s+/g, ' ').slice(0, 220),
        created: window.__qb && window.__qb.x ? !!window.__qb.x().S.created : null, view: window.__qb && window.__qb.x ? (window.__qb.x().S.view || null) : null }; });
    const s0 = await state(); await p.screenshot({ path: path.join(OUT, `fresh_${mobile ? 'phone' : 'desktop'}_0.png`) });
    console.log((mobile ? 'phone' : 'desktop') + ' first open: ' + JSON.stringify(s0));
    // make the character the way the game does and come back
    await p.evaluate(() => { const x = window.__qb.x(), S = x.S; if (!S.created) { S.created = true; S.char = window.__qb.fixChar({ name: 'New', sex: 'f' }); } x.persist(); });
    await p.waitForTimeout(500); await p.reload(); await p.waitForTimeout(5000);
    const s1 = await state(); await p.screenshot({ path: path.join(OUT, `fresh_${mobile ? 'phone' : 'desktop'}_1.png`) });
    console.log((mobile ? 'phone' : 'desktop') + ' after the character, reloaded: ' + JSON.stringify(s1));
    console.log('page errors', errs.length, errs.slice(0, 3));
    await b.close();
  }
})();
