// The card glow (fx-pulse) at every rank skin (LEAD's b46bc16, the lag fix): the Board on Cal's phone size (440x840), with the glow
// frozen at its peak (every animation paused 2 s in, half of its 4 s), for the default skin and data-rank D, C, B, A, S.
// One picture per skin; run it on the old and the new build to compare.   BASE=<server> OUT=<folder> TAG=<name> node glowranks.js
const fs = require('fs'), path = require('path');
const { open } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out', TAG = process.env.TAG || 'glow'; fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const { b, p, errs } = await open({ width: 440, height: 840, owned: 'all' });
  for (const rk of ['', 'D', 'C', 'B', 'A', 'S']) {
    await p.evaluate((rk) => { const x = window.__qb.x(); document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove());
      document.querySelector('.nav button[data-v="board"]').click(); document.body.classList.add('fx-pulse');
      if (rk) document.documentElement.setAttribute('data-rank', rk); else document.documentElement.removeAttribute('data-rank');
      let st = document.getElementById('qaglow'); if (!st) { st = document.createElement('style'); st.id = 'qaglow'; document.head.appendChild(st); }
      st.textContent = '*,*::before,*::after{animation-delay:-2s!important;animation-play-state:paused!important}'; }, rk);
    await p.waitForTimeout(700);
    await p.evaluate(() => { document.querySelectorAll('.dropsplash,.overlay,#layer .modal,.toast').forEach((e) => e.remove());
      // the sale pop-up: whatever fixed layer holds "NOW ON SALE"
      [...document.querySelectorAll('body *')].filter((e) => /NOW ON SALE/i.test(e.textContent || '') && getComputedStyle(e).position === 'fixed').forEach((e) => e.remove()); });
    await p.waitForTimeout(200); // pop-ups that open late
    const n = await p.evaluate(() => document.querySelectorAll('.card').length);
    await p.screenshot({ path: path.join(OUT, `${TAG}_${rk || 'E'}.png`) });
    console.log(`rank ${rk || 'default'}: ${n} cards`);
  }
  console.log('page errors', errs.length, errs.slice(0, 2));
  await b.close();
})();
