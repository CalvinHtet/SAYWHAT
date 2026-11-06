// The character creator's Begin on phones (LEAD's a384feb, from Cal's phone screenshot): a new player at many screen sizes, past the
// name step, then Begin checked on screen and tappable at the start, with the menu scrolled to its end, the page scrolled to its
// end and back to the top; how tall the character preview stays; then a real tap on Begin must start the game (the Board).
// Sizes: LEAD's four plus an iPhone SE, Safari with its bars, Cal's iPhone in the Claude app (440x840, from diag/frame) and a phone
// on its side (844x390, 740x360, 932x430). The Testing pill must cover no creator button.   BASE=<server> OUT=<folder> node ccbegin.js
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:8769', OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
const SIZES = [[320, 568], [360, 600], [375, 548], [390, 664], [430, 800], [440, 840], [740, 360], [844, 390], [932, 430], [1280, 800]];
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  let fails = 0;
  for (const [w, h] of SIZES) {
    const phone = Math.min(w, h) < 700;
    const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: phone, hasTouch: phone });
    const p = await ctx.newPage(), errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto(BASE + '/dist/index.html');
    await p.waitForFunction(() => document.querySelector('[data-act="ccnext"]'), null, { timeout: 90000 });
    await p.fill('#ccname', 'Cal'); await p.click('[data-act="ccnext"]');
    await p.waitForFunction(() => document.querySelector('.cc-menu') && document.querySelector('[data-act="ccdone"]'), null, { timeout: 60000 });
    await p.waitForTimeout(1500);
    const vis = () => p.evaluate(() => { const r = document.querySelector('[data-act="ccdone"]').getBoundingClientRect(), el = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
      return r.top >= 0 && r.bottom <= innerHeight && !!(el && el.closest('[data-act="ccdone"]')); });
    const st = {}; st.start = await vis();
    const stage = await p.evaluate(() => { const s = document.querySelector('.cc-stage'); return s ? Math.round(s.getBoundingClientRect().height) : 0; });
    await p.screenshot({ path: path.join(OUT, `cc_${w}x${h}.png`) });
    await p.evaluate(() => { const m = document.querySelector('.cc-menu'); m.scrollTop = m.scrollHeight; }); await p.waitForTimeout(300); st.menuEnd = await vis();
    await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await p.waitForTimeout(300); st.pageEnd = await vis();
    await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(300); st.pageTop = await vis();
    // the Testing pill (#qbt) must cover no creator button
    const pill = await p.evaluate(() => { const t = document.querySelector('#qbt'); if (!t) return 'none'; const r = t.getBoundingClientRect(); if (!r.width) return 'hidden';
      const hit = [...document.querySelectorAll('.cc-menu button, [data-act="ccdone"], [data-act="ccback"], .cc-stage button')].filter((x) => { const q = x.getBoundingClientRect(); return q.width && !(q.right <= r.left || q.left >= r.right || q.bottom <= r.top || q.top >= r.bottom); });
      return hit.length ? 'covers ' + hit.map((x) => x.textContent.trim()).join('/') : 'clear'; });
    st.pill = pill;
    // a real tap (or click) on Begin starts the game
    const btn = await p.$('[data-act="ccdone"]'); if (phone) await btn.tap(); else await btn.click();
    let board = false; try { await p.waitForFunction(() => !document.querySelector('.cc-menu') && document.querySelector('.nav button[data-v="board"]'), null, { timeout: 15000 }); board = true; } catch (e) {}
    // after Begin, the Testing pill is back on the Board (hidden only while the creator is open, LEAD's 859d941)
    st.pillAfter = await p.evaluate(() => { const t = document.querySelector('#qbt'); if (!t) return 'none'; const r = t.getBoundingClientRect(); return r.width && getComputedStyle(t).display !== 'none' ? 'shown' : 'hidden'; });
    const ok = st.start && st.menuEnd && st.pageEnd && st.pageTop && board && !errs.length && !/^covers/.test(pill);
    if (!ok) fails++;
    console.log(`${ok ? 'ok  ' : 'FAIL'} ${w}x${h}: Begin on screen and tappable at start ${st.start}, menu at end ${st.menuEnd}, page at end ${st.pageEnd}, page top ${st.pageTop}; preview ${stage} px tall; tap starts the game ${board}; Testing pill ${st.pill}, on the Board after ${st.pillAfter}; page errors ${errs.length}`);
    await ctx.close();
  }
  console.log(fails ? `${fails} sizes failed` : 'all sizes pass');
  await b.close();
})();
