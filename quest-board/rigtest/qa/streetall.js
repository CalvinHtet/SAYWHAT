// The street and every building's inside view with every room owned and fully bought, by day (13:00) and night (22:00), at
// desktop 1280x900 and phone 390x844: the assets as a player sees them between rooms.   BASE=<server> OUT=<folder> node streetall.js
const fs = require('fs'), path = require('path');
const { open } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
(async () => {
  for (const [vw, vh, tag, mob] of [[1280, 900, 'desk', false], [390, 844, 'phone', true]]) {
    for (const hr of [13, 22]) {
      const { b, p, errs } = await open({ width: vw, height: vh, owned: 'all', mobile: mob });
      await p.evaluate((h) => { const now = new Date(Date.now()), t = new Date(now); t.setHours(h, 0, 0, 0); window.__qbShift = (window.__qbShift || 0) + (t - now); window.__qb.x().S.areaOn = null; }, hr);
      const clear = () => p.evaluate(() => document.querySelectorAll('#layer .modal,.dropsplash,.overlay').forEach((e) => e.remove()));
      await clear(); await p.evaluate(() => document.querySelector('.nav button[data-v="hideout"]').click()); await p.waitForTimeout(3500); await clear(); await p.waitForTimeout(500);
      await p.screenshot({ path: path.join(OUT, `street_${tag}_${hr}.png`) });
      const n = await p.evaluate(() => document.querySelectorAll('[data-act="bldgo"]').length);
      for (let k = 0; k < n; k++) {
        await clear(); await p.evaluate((k) => { const g = document.querySelectorAll('[data-act="bldgo"]')[k]; if (g) g.dispatchEvent(new MouseEvent('click', { bubbles: true })); }, k); await p.waitForTimeout(4000); await clear();
        await p.screenshot({ path: path.join(OUT, `bld${k}_${tag}_${hr}.png`) });
        await p.evaluate(() => { const st = [...document.querySelectorAll('button')].find((e) => /Street/.test(e.textContent)); if (st) st.click(); }); await p.waitForTimeout(1500);
      }
      console.log(`${tag} ${hr}:00 street + ${n} buildings, page errors ${errs.length}`, errs.slice(0, 2)); await b.close();
    }
  }
})();
