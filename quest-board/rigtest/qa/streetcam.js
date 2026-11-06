// The building view's camera on phones (LEAD's b316e05, Cal: "the room view background cuts off"): a new player with the Garden and
// Restaurant opened, the Loft tab zoomed all the way out and dragged up as far as it goes, on the street and inside a building, upright
// (390x844, 360x780) and on its side (844x390). Saves a picture of each and reports how far the lowest drawn ground sits above the nav.
//   BASE=<server> OUT=<folder> node streetcam.js
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:8769', OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  for (const [w, h] of [[390, 844], [360, 780], [844, 390]]) {
    const p = await (await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: true, hasTouch: true })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => document.querySelector('[data-act="ccnext"]'), null, { timeout: 90000 });
    await p.fill('#ccname', 'Cal'); await p.click('[data-act="ccnext"]'); await p.waitForFunction(() => document.querySelector('[data-act="ccdone"]'), null, { timeout: 60000 }); await p.waitForTimeout(600);
    await p.evaluate(() => document.querySelector('[data-act="ccdone"]').click()); await p.waitForTimeout(5000);
    await p.evaluate(() => { const S = window.__qb.x().S; S.fvDay = 'x'; ['garden', 'restaurant'].forEach((t) => window.__qbRooms.open(t, 1)); document.querySelectorAll('#layer .modal').forEach((e) => e.remove()); document.querySelector('.nav button[data-v="hideout"]').click(); });
    await p.waitForTimeout(3000); await p.evaluate(() => document.querySelectorAll('#layer .modal,.dropsplash').forEach((e) => e.remove()));
    for (const where of ['street', 'building']) {
      if (where === 'building') { const hs = await p.$$('[data-act="bldgo"]'); const nb = hs.length; if (hs.length) await (hs[1] || hs[0]).tap({ force: true }).catch((e) => console.log('  tap failed', e.message.slice(0, 80))); console.log('  buildings to tap:', nb); await p.waitForTimeout(5000); await p.evaluate(() => document.querySelectorAll('#layer .modal,.dropsplash').forEach((e) => e.remove())); }
      for (let i = 0; i < 10; i++) { await p.evaluate(() => { const z = document.querySelector('[data-act="lfz"][data-d="-1"]'); if (z) z.click(); }); await p.waitForTimeout(120); }
      await p.evaluate(() => { const L = window.__qbLoft(); if (L && L.V) { L.V.y -= 3000; L.clamp && L.clamp(); L.apply && L.apply(); } }); await p.waitForTimeout(700);
      const inside = await p.evaluate(() => [...document.querySelectorAll('button')].some((e) => /Street/.test(e.textContent)));
      const r = await p.evaluate(() => { const nav = document.querySelector('.nav').getBoundingClientRect(); const g = document.getElementById('lfw'); const gr = g ? g.getBoundingClientRect() : null; const wrap = document.getElementById('lfwrap').getBoundingClientRect();
        return { navTop: Math.round(nav.top), drawnBottom: gr ? Math.round(gr.bottom) : null, drawnTop: gr ? Math.round(gr.top) : null, wrapBottom: Math.round(wrap.bottom) }; });
      await p.screenshot({ path: path.join(OUT, `cam_${w}x${h}_${where}.png`) });
      console.log(`${w}x${h} ${where}${where === 'building' ? (inside ? ' (inside, Street button shown)' : ' (NOT inside)') : ''}: drawing ${r.drawnTop}..${r.drawnBottom}, nav top ${r.navTop}, view bottom ${r.wrapBottom}`);
    }
    if (errs.length) console.log('  page errors', errs.slice(0, 2));
    await p.context().close();
  }
  await b.close();
})();
