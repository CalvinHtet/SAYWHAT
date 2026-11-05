// node me.js room[,room] -> $OUT/m_<room>_<k>.png : your character on each station of a home room, one at a time
const OUT = process.env.OUT || 'shots'; require('fs').mkdirSync(OUT, { recursive: true });
const { open } = require('./drv.js');
(async () => {
  const rooms = process.argv[2].split(',');
  const { b, p, errs } = await open({ width: 1400, height: 1400 });
  await p.evaluate(() => { document.querySelectorAll('.dropsplash,.modal,.overlay').forEach((e) => e.remove()); const t = [...document.querySelectorAll('button')].find((e) => /the loft/i.test(e.textContent)); if (t) t.click(); });
  await p.waitForTimeout(1500);
  for (const room of rooms) {
    const i = await p.evaluate((room) => window.__order.indexOf(room), room);
    await p.evaluate((i) => { document.querySelectorAll('.dropsplash,.modal,.overlay').forEach((e) => e.remove()); window.__qb.roomModal(i); }, i);
    await p.waitForTimeout(3000);
    const sts = await p.evaluate((i) => {
      const q = window.__qbLoft(), me = Object.values(q.A).find((a) => a.pv && a.pvslot === i && a.role === 'me');
      if (!me) return null;
      const C = q.C(me); window.__me = me.id;
      return C.st.map((s, k) => [k, s.kind, s.tag || '', +s.x.toFixed(2), +s.y.toFixed(2)]).filter((s) => s[1] !== 'door' && s[1] !== 'wander');
    }, i);
    console.log(room, JSON.stringify(sts));
    if (!sts) continue;
    for (const [k, kind, tag] of sts) {
      await p.evaluate((k) => { const q = window.__qbLoft(), a = q.A[window.__me], C = q.C(a), s = C.st[k]; a.emo = null; a.emot = 0; s.by = null; a.wp = []; a.x = s.x; a.y = s.y; q.arrive(a, s); a.t = 1e6; q.draw(a, true); }, k);
      let ok = 0;
      for (let w = 0; w < 40 && !ok; w++) { await p.waitForTimeout(1000); ok = await p.evaluate(() => { const q = window.__qbLoft(), a = q.A[window.__me]; a.t = 1e6; q.draw(a, true); return !!a._k; }); }
      const el = await p.$('#rbigw'); const bb = await el.boundingBox();
      await p.screenshot({ path: `${OUT}/m_${room}_${k}_${tag || kind}.png`, clip: bb, timeout: 60000 }).catch((e) => console.log('shot fail', e.message.slice(0, 60)));
    }
    console.log(room, 'done', sts.length);
  }
  console.log('errs', errs.filter((e) => !/TUNNEL/.test(e)).slice(0, 4));
  await b.close();
})();
