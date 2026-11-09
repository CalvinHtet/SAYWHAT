// The drop window on short screens: is the top of the card (NOW ON SALE, the close button) reachable, and the bottom button? iPhone Safari with its
// bars shows about 390x664; a small Android 360x640.   OUT=<folder> node dropfit.js
const path = require('path'); const { open } = require('./lib.js'); const OUT = process.env.OUT || 'qa-out';
(async () => { for (const [w, h] of [[390, 844], [390, 664], [375, 553], [360, 640]]) {
  const { b, p, errs } = await open({ width: w, height: h, owned: 'none', mobile: true });
  await p.evaluate(() => { document.querySelectorAll('#layer .modal,.dropsplash').forEach((e) => e.remove()); window.__qbRooms.play('brand', 'hanga'); }); await p.waitForTimeout(900);
  const r = await p.evaluate(() => { const m = document.querySelector('#layer .modal'), c = m.querySelector('.bsplash'), cs = getComputedStyle(m), x = c.querySelector('[data-act="mclose"], .close, .x'); const rc = (e) => { const q = e.getBoundingClientRect(); return [Math.round(q.top), Math.round(q.bottom)]; };
    const atTop0 = rc(c); m.scrollTop = 0; const atTop = rc(c); m.scrollTop = 1e6; const atEnd = rc(c); const end = m.scrollTop; m.scrollTop = 0; const cc = c.scrollHeight - c.clientHeight;
    return { overflow: cs.overflowY, align: cs.alignItems, justify: cs.justifyContent, modal: [m.scrollHeight, m.clientHeight], card0: atTop0, cardAtScrollTop: atTop, cardAtScrollEnd: atEnd, maxScroll: end, cardMaxH: getComputedStyle(c).maxHeight, cardInnerScroll: cc }; });
  console.log(`${w}x${h}`, JSON.stringify(r)); await p.screenshot({ path: path.join(OUT, `dropfit_${w}x${h}.png`) }); await b.close(); } })();
