// Test > Review (LEAD's 797249f; Cal: "Show me all the cutscenes and visitors and unlocks in this next test pass"): on a phone (W=360 or
// 390) and each body, open Review, press every Play button in turn, and for each window it opens: a picture, whether it is on screen
// (fits the width, a close button reachable), whether a character or portrait image actually drew (no broken image, no empty <img>),
// any text cut off at the right edge, and that the save is byte-for-byte the same afterwards. Writes one picture per Play and a sheet.
//   W=390 BODY=m BASE=<server> OUT=<folder> node review.js
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:8769', OUT = process.env.OUT || 'qa-out', W = +(process.env.W || 390), BODY = process.env.BODY || 'm';
fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await (await b.newContext({ viewport: { width: W, height: 844 }, isMobile: true, hasTouch: true })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 200)));
  await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft, null, { timeout: 90000 }); await p.waitForTimeout(1200);
  await p.evaluate((sex) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex }); S.xp = x.cum(12); S.gates = [5, 10]; x.persist(); x.render(); document.querySelectorAll('#layer .modal,.dropsplash').forEach((e) => e.remove()); }, BODY);
  await p.waitForTimeout(1500);
  const snap = () => p.evaluate(() => { const S = window.__qb.x().S; const c = JSON.parse(JSON.stringify(S)); delete c.lastSave; delete c.saved; delete c.t; return JSON.stringify(c); });
  const btns = await p.evaluate(() => { window.__qbRooms.review(); return [...document.querySelectorAll('#layer .modal [data-rv]')].map((e) => ({ k: e.dataset.rv, v: e.dataset.v, row: (e.closest('.qbtr-room') || {}).innerText ? e.closest('.qbtr-room').innerText.split('\n')[0].slice(0, 50) : '' })); });
  console.log(`${btns.length} Play buttons at ${W} px, body ${BODY}`);
  const before = await snap(); const bad = []; const cells = [];
  for (let i = 0; i < btns.length; i++) {
    const bt = btns[i];
    const r = await p.evaluate(async (bt) => { const w = (ms) => new Promise((o) => setTimeout(o, ms));
      document.querySelectorAll('#layer .modal,.dropsplash').forEach((e) => e.remove()); window.__qbRooms.play(bt.k, bt.v); await w(1600);
      const ms = [...document.querySelectorAll('#layer .modal, .dropsplash')]; const m = ms[ms.length - 1]; if (!m) return { none: true };
      const card = m.querySelector('.card, .box2, .sty') || m; const rc = card.getBoundingClientRect();
      const imgs = [...m.querySelectorAll('img')]; const broken = imgs.filter((im) => !im.complete || im.naturalWidth === 0).map((im) => (im.getAttribute('src') || '').slice(0, 40));
      const svgImgs = [...m.querySelectorAll('image')].filter((e) => !(e.getAttribute('href') || e.getAttribute('xlink:href'))).length;
      const close = [...m.querySelectorAll('button, [data-act="mclose"]')].filter((e) => { const q = e.getBoundingClientRect(); return q.width > 0 && q.left >= 0 && q.right <= innerWidth + 1; }).length;
      const overflow = [...card.querySelectorAll('*')].filter((e) => { const q = e.getBoundingClientRect(); return q.width > 0 && q.right > innerWidth + 2 && getComputedStyle(e).position !== 'fixed'; }).map((e) => e.tagName + '.' + (e.className || '').toString().slice(0, 20)).slice(0, 3);
      return { left: Math.round(rc.left), right: Math.round(rc.right), w: Math.round(rc.width), h: Math.round(rc.height), imgs: imgs.length, broken, svgEmpty: svgImgs, close, overflow, text: card.innerText.replace(/\s+/g, ' ').slice(0, 60) }; }, bt);
    const name = `${String(i).padStart(3, '0')}_${bt.k}_${String(bt.v).replace(/[^a-z0-9_]/gi, '').slice(0, 24)}.png`;
    if (!r.none) { const el = await p.$('#layer .modal:last-of-type .card, #layer .modal:last-of-type .box2, .dropsplash'); try { await (el || p).screenshot({ path: path.join(OUT, name) }); cells.push(name); } catch (e) { await p.screenshot({ path: path.join(OUT, name) }); cells.push(name); } }
    const probs = [];
    if (r.none) probs.push('no window opened');
    else { if (r.left < -1 || r.right > W + 1) probs.push(`card off screen ${r.left}..${r.right}`); if (r.broken.length) probs.push('broken image ' + r.broken.join(',')); if (!r.close) probs.push('no reachable button'); if (r.overflow.length) probs.push('past the right edge: ' + r.overflow.join(',')); }
    if (probs.length) bad.push(`${bt.k} ${bt.v} (${bt.row}): ${probs.join('; ')}`);
  }
  await p.evaluate(() => document.querySelectorAll('#layer .modal,.dropsplash').forEach((e) => e.remove()));
  const after = await snap();
  console.log(`played ${btns.length}; problems ${bad.length}`); bad.forEach((x) => console.log('  ' + x));
  console.log('save unchanged after every Play:', before === after);
  if (before !== after) { const a = JSON.parse(before), c = JSON.parse(after); console.log('  keys that changed:', Object.keys(c).filter((k) => JSON.stringify(a[k]) !== JSON.stringify(c[k])).slice(0, 10).join(' ')); }
  console.log('page errors', errs.length, errs.slice(0, 3));
  fs.writeFileSync(path.join(OUT, 'cells.json'), JSON.stringify(cells));
  await b.close();
})();
