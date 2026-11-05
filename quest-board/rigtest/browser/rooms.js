const { open } = require('./drv.js');
const OUT = process.env.OUT || 'shots'; require('fs').mkdirSync(OUT, { recursive: true });
const only = process.argv[2] ? process.argv[2].split(',') : null;
const tag = process.argv[3] || 'r';
(async () => {
  const { b, p, errs } = await open({ width: +(process.env.W || 1400), height: +(process.env.H || 2000) });
  await p.evaluate(() => { document.querySelectorAll('.dropsplash,.modal,.overlay').forEach((e) => e.remove()); const t = [...document.querySelectorAll('button')].find((e) => /the loft/i.test(e.textContent)); if (t) t.click(); });
  await p.waitForTimeout(1500);
  const order = await p.evaluate(() => window.__order);
  for (let i = 0; i < order.length; i++) {
    if (only && !only.includes(order[i])) continue;
    await p.evaluate((i) => { document.querySelectorAll('.dropsplash,.modal,.overlay').forEach((e) => e.remove()); window.__qb.roomModal(i); }, i);
    await p.waitForTimeout(+(process.env.WAIT || 4000));
    const el = await p.$('#rbigw');
    if (!el) { console.log(order[i], 'no room view'); continue; }
    const bb = await el.boundingBox(); await p.screenshot({ path: `${OUT}/${tag}_${String(i).padStart(2, '0')}_${order[i]}.png`, clip: bb, timeout: 60000 }).catch((e) => console.log('shot fail', order[i], e.message.slice(0, 80)));
    const info = await p.evaluate(() => { const w = document.querySelector('#rbigw'); const r = w.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; });
    console.log(order[i], info.join('x'));
  }
  console.log('errs', errs.slice(0, 5));
  await b.close();
})();
