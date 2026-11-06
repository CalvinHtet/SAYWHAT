// Building backdrops (LEAD's 9b28444, Cal's approval 11): inside each building at noon and 22:00, whether a bld_bg_* image is drawn
// behind the rooms, and a picture of each.
//   OUT=<folder> BASE=<server> node backdrops.js
const fs = require('fs'), path = require('path');
const { open } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const { b, p, errs } = await open({ width: 1200, height: 1000, owned: 'all' });
  for (const hour of [13, 22]) for (let bi = 0; bi < 3; bi++) {
    await p.evaluate(({ hour }) => { const now = new Date(Date.now()), t = new Date(now); t.setHours(hour, 0, 0, 0); window.__qbShift = (window.__qbShift || 0) + (t - now); const x = window.__qb.x(), S = x.S; S.areaOn = null; S.gates = [5, 10, 20, 30, 40]; S.xp = Math.max(S.xp, x.cum(45)); x.render();
      document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); document.querySelector('.nav button[data-v="board"]').click(); document.querySelector('.nav button[data-v="hideout"]').click(); }, { hour });
    await p.waitForTimeout(2500);
    await p.evaluate(() => { const st = [...document.querySelectorAll('button')].find((e) => /Street/.test(e.textContent)); if (st) st.click(); }); await p.waitForTimeout(1500);
    await p.evaluate((bi) => { document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); const g = document.querySelectorAll('[data-act="bldgo"]')[bi]; if (g) g.dispatchEvent(new MouseEvent('click', { bubbles: true })); }, bi);
    await p.waitForTimeout(4000);
    const r = await p.evaluate(() => { const g = document.querySelector('.lfbgart image'); return { bg: g ? (g.getAttribute('href') || '').replace(/^.*\//, '').slice(0, 40) : null, title: [...document.querySelectorAll('div,span')].map((e) => e.childElementCount === 0 ? e.textContent.trim() : '').find((t) => /^(The Loft|Kode Plaza|Calibur Mall)$/.test(t)) || '?' }; });
    console.log(`${hour}:00 building ${bi} (${r.title}): backdrop ${r.bg || 'NONE'}`);
    await p.screenshot({ path: path.join(OUT, `bld_${bi}_${hour}.png`) });
  }
  console.log('page errors', errs.length, errs.slice(0, 3));
  await b.close();
})();
