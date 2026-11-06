// The class card on the Board (LEAD's ff9ba96, Cal: "This banner does not cover the whole width"): for every class, a player with it,
// the Board at phone size with the fx-pulse glow on and off; the art layer's width against the card's, and whether its opacity moves
// over 3 s (it must hold steady). Pictures of each.   BASE=<server> OUT=<folder> node classcard.js
const fs = require('fs'), path = require('path');
const { open } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const { b, p, errs } = await open({ width: 390, height: 844, owned: 'none', mobile: true });
  const classes = await p.evaluate(() => { const x = window.__qb.x(); return Object.keys(window.CLASSES || x.CLASSES || {}); });
  const list = classes.length ? classes : (process.env.CLASSES || '').split(',').filter(Boolean);
  console.log('classes:', list.join(' ') || '(none found on window; set CLASSES=)');
  for (const cls of list) for (const fx of [false, true]) {
    const r = await p.evaluate(async ([cls, fx]) => { const w = (ms) => new Promise((o) => setTimeout(o, ms)); const x = window.__qb.x(), S = x.S; S.cls = cls; document.body.classList.toggle('fx-pulse', fx);
      document.querySelectorAll('#layer .modal,.dropsplash').forEach((e) => e.remove()); x.render(); document.querySelector('.nav button[data-v="board"]').click(); await w(800);
      const bg = document.querySelector('.clsbg'); const card = bg && bg.closest('.card, .banner'); if (!bg) return { none: true };
      const o = []; for (let k = 0; k < 6; k++) { o.push(+getComputedStyle(bg).opacity); await w(500); }
      const rb = bg.getBoundingClientRect(), rc = card.getBoundingClientRect(); bg.scrollIntoView({ block: 'center' }); await w(200);
      return { bgW: Math.round(rb.width), cardW: Math.round(rc.width), left: Math.round(rb.left - rc.left), opMin: Math.min(...o), opMax: Math.max(...o), img: getComputedStyle(bg).backgroundImage.slice(0, 40) }; }, [cls, fx]);
    if (r.none) { console.log(`${cls} fx-pulse ${fx ? 'on ' : 'off'}: no class art layer`); continue; }
    const card = await p.$('.clsbg'); if (card) await (await card.evaluateHandle((e) => e.closest('.card, .banner'))).asElement().screenshot({ path: path.join(OUT, `class_${cls}_${fx ? 'fx' : 'plain'}.png`) });
    console.log(`${cls} fx-pulse ${fx ? 'on ' : 'off'}: art ${r.bgW} of ${r.cardW} px (from ${r.left}), opacity ${r.opMin}-${r.opMax}`);
  }
  console.log('page errors', errs.length, errs.slice(0, 2));
  await b.close();
})();
