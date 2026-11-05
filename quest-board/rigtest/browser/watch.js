// node watch.js room shots gap_s -> $OUT/w_<room>_<k>.png : the room left to run on its own, as a player sees it
const OUT = process.env.OUT || 'shots'; require('fs').mkdirSync(OUT, { recursive: true });
const { open } = require('./drv.js');
(async () => {
  const [room, n, gap] = [process.argv[2], +(process.argv[3] || 8), +(process.argv[4] || 25)];
  const { b, p, errs } = await open({ width: 1400, height: 1400 });
  await p.evaluate(() => { document.querySelectorAll('.dropsplash,.modal,.overlay').forEach((e) => e.remove()); const t = [...document.querySelectorAll('button')].find((e) => /the loft/i.test(e.textContent)); if (t) t.click(); });
  await p.waitForTimeout(1500);
  const i = await p.evaluate((room) => window.__order.indexOf(room), room);
  await p.evaluate((i) => { document.querySelectorAll('.dropsplash,.modal,.overlay').forEach((e) => e.remove()); window.__qb.roomModal(i); }, i);
  for (let k = 0; k < n; k++) {
    await p.waitForTimeout(gap * 1000);
    const st = await p.evaluate((i) => { const q = window.__qbLoft(); return Object.values(q.A).filter((a) => a.pv && a.pvslot === i && a.alpha > .5).map((a) => (a.role[0]) + ':' + a.mode + ':' + (a.act || '') + (a.st ? '@' + (a.st.lbl || a.st.tag || a.st.kind) : '')).join(' '); }, i);
    const el = await p.$('#rbigw'); const bb = await el.boundingBox();
    await p.screenshot({ path: `${OUT}/w_${room}_${k}.png`, clip: bb, timeout: 60000 }).catch((e) => console.log('shot fail', e.message.slice(0, 60)));
    console.log(k, st);
  }
  console.log('errs', errs.filter((e) => !/TUNNEL/.test(e)).slice(0, 4));
  await b.close();
})();
