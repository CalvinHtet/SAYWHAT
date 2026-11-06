// The city behind the buildings (ROOMS's 0b23996, Cal: "too many lights"): the lit windows in each window pattern (of 16 cells),
// their opacity, and pictures of the street at noon and at 10 pm.
//   OUT=<folder> BASE=<server> node citylights.js
const fs = require('fs'), path = require('path');
const { open } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const { b, p, errs } = await open({ width: 1000, height: 900, owned: 'all' });
  for (const hour of [13, 22]) {
    const r = await p.evaluate(async (hour) => { const x = window.__qb.x(), S = x.S, w = (ms) => new Promise((o) => setTimeout(o, ms));
      const now = new Date(Date.now()); const t = new Date(now); t.setHours(hour, 0, 0, 0); window.__qbShift = (window.__qbShift || 0) + (t - now);
      S.areaOn = null; S.gates = [5, 10, 20, 30]; S.xp = Math.max(S.xp, x.cum(30)); document.querySelectorAll('#layer .modal,.dropsplash').forEach((e) => e.remove()); x.render();
      document.querySelector('.nav button[data-v="hideout"]').click(); await w(2500);
      const pats = [1, 2, 3].map((k) => { const pt = document.getElementById('lfw' + k); if (!pt) return null; const rs = [...pt.querySelectorAll('rect')]; return { lit: rs.length, op: rs.map((e) => +e.getAttribute('opacity')).reduce((a, b) => a + b, 0) / (rs.length || 1) }; });
      return { pats }; }, hour);
    console.log(`${hour}:00 window patterns (lit of 16, mean opacity): ` + r.pats.map((x, i) => x ? `tower ${i + 1}: ${x.lit}, ${x.op.toFixed(2)}` : `tower ${i + 1}: none`).join('; '));
    await p.screenshot({ path: path.join(OUT, `city_${hour}.png`) });
  }
  console.log('page errors', errs.length, errs.slice(0, 3));
  await b.close();
})();
