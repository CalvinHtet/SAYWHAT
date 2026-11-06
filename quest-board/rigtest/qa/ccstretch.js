// The creator's Stretch preview on Cal's phone size (440x840, the Claude app): a new player, the top picked, the Stretch button
// tapped, and the preview pictured as fast as it can for 4.5 s. Prints, per top, how many distinct pictures came out and their
// order (a blend between keys would show up as extra distinct pictures between the standing one and the yawn).
//   BASE=<server> OUT=<folder> node ccstretch.js [top,top]
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:8769', OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
const TOPS = (process.argv[2] || 'hoodie,bomber,tee').split(',');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  for (const top of TOPS) {
    const ctx = await b.newContext({ viewport: { width: 440, height: 840 }, isMobile: true, hasTouch: true });
    const p = await ctx.newPage(), errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => document.querySelector('[data-act="ccnext"]'), null, { timeout: 90000 });
    await p.fill('#ccname', 'Cal'); await p.click('[data-act="ccnext"]');
    await p.waitForFunction(() => document.querySelector('.cc-menu'), null, { timeout: 60000 }); await p.waitForTimeout(1200);
    const picked = await p.evaluate((top) => { const t = [...document.querySelectorAll('.cc-menu button')].find((x) => x.textContent.trim().toLowerCase() === top); if (t) t.click(); return !!t; }, top);
    await p.waitForTimeout(500);
    const st = await p.$('.cc-stage');
    for (const x of await p.$$('button')) { if ((await x.textContent()).trim() === 'Stretch') { await x.tap(); break; } }
    const hs = [], t0 = Date.now(); let k = 0;
    while (Date.now() - t0 < 4500) { const f = path.join(OUT, `${top}_${String(k++).padStart(3, '0')}.png`); await st.screenshot({ path: f }); hs.push(crypto.createHash('md5').update(fs.readFileSync(f)).digest('hex')); }
    const u = []; hs.forEach((h) => { if (!u.includes(h)) u.push(h); });
    console.log(`${top} (picked ${picked}): ${k} pictures, ${u.length} distinct, in order ${hs.map((h) => u.indexOf(h)).join(' ')}; page errors ${errs.length}`);
    await ctx.close();
  }
  await b.close();
})();
