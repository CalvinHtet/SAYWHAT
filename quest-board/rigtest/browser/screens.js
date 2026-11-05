// W=360 node screens.js -> $OUT/s_<tab>_<W>.png for every bottom-nav tab, and anything wider than the screen
const OUT = process.env.OUT || 'shots'; require('fs').mkdirSync(OUT, { recursive: true });
const { open } = require('./drv.js');
(async () => {
  const W = +(process.env.W || 360);
  const { b, p, errs } = await open({ width: W, height: 760, mobile: true });
  const tabs = await p.evaluate(() => [...document.querySelectorAll('.nav button')].map((x) => x.getAttribute('data-v')));
  const extra = ['room'];
  for (const t of tabs.concat(extra)) {
    await p.evaluate((t) => {
      document.querySelectorAll('.dropsplash,.modal,.overlay').forEach((e) => e.remove());
      if (t === 'room') { const x = window.__qb.x(); x.render(); window.__qb.roomModal(0); return; }
      const bt = document.querySelector('.nav button[data-v="' + t + '"]'); if (bt) bt.click();
    }, t);
    await p.waitForTimeout(2500);
    const r = await p.evaluate((W) => {
      const wide = [];
      document.querySelectorAll('body *').forEach((e) => {
        const q = e.getBoundingClientRect(); if (!q.width || !q.height) return;
        const cs = getComputedStyle(e); if (cs.visibility === 'hidden' || cs.display === 'none') return;
        if (q.right > W + 1 || q.left < -1) {
          let anc = e.parentElement, clipped = false;
          while (anc) { const a = getComputedStyle(anc); if (/(auto|scroll|hidden)/.test(a.overflowX)) { const ar = anc.getBoundingClientRect(); if (ar.right <= W + 1 && ar.left >= -1) { clipped = true; break; } } anc = anc.parentElement; }
          if (!clipped) wide.push((e.className && e.className.baseVal === undefined ? e.className : e.tagName).toString().slice(0, 40) + ' ' + Math.round(q.left) + '..' + Math.round(q.right));
        }
      });
      return { sw: document.documentElement.scrollWidth, wide: [...new Set(wide)].slice(0, 8) };
    }, W);
    await p.screenshot({ path: `${OUT}/s_${t}_${W}.png` });
    console.log(t, 'pageWidth', r.sw, r.wide.length ? 'WIDER: ' + r.wide.join(' | ') : 'ok');
  }
  console.log('errs', errs.filter((e) => !/TUNNEL/.test(e)).slice(0, 4));
  await b.close();
})();
