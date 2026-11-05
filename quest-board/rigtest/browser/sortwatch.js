// node sortwatch.js room [seconds] : let a room run and list every moment someone is drawn under a piece they stand in front of
const { open } = require('./drv.js');
(async () => {
  const room = process.argv[2], secs = +(process.argv[3] || 40);
  const { b, p } = await open({ width: 1200, height: 1000 });
  await p.evaluate(() => { document.querySelectorAll('.dropsplash,.modal,.overlay').forEach((e) => e.remove()); const t = [...document.querySelectorAll('button')].find((e) => /the loft/i.test(e.textContent)); if (t) t.click(); });
  await p.waitForTimeout(1500);
  const i = await p.evaluate((room) => window.__order.indexOf(room), room);
  await p.evaluate((i) => { document.querySelectorAll('.dropsplash,.modal,.overlay').forEach((e) => e.remove()); window.__qb.roomModal(i); }, i);
  await p.waitForTimeout(+(process.env.START || 3000));
  const seen = {};
  for (let t = 0; t < secs * 2; t++) {
    const bad = await p.evaluate((i) => {
      const q = window.__qbLoft(), out = [];
      Object.values(q.A).filter((a) => a.pv && a.pvslot === i && a.role !== 'me').forEach((a) => {
        const g = document.getElementById('lfa-' + a.id.replace(/[^a-z0-9_-]/gi, '_')); if (!g || !g.parentNode) return;
        let n = g.nextSibling;
        while (n) { const fb = n.getAttribute && n.getAttribute('data-b'); if (fb) { const f = fb.split(',').map(Number); if ((a.x >= f[2] + .05 && a.y >= f[1]) || (a.y >= f[3] + .05 && a.x >= f[0])) out.push([a.id, a.mode, a.st && a.st.kind, +a.x.toFixed(2), +a.y.toFixed(2), (n.innerHTML.match(/art\/(\w+)|\/(\w+)\.webp/) || [])[0] || fb, a.st && a.st.dk ? 'dk' : '']); } n = n.nextSibling; }
      });
      return out;
    }, i);
    bad.forEach((r) => { const k = r[0] + ' ' + r[5]; if (!seen[k]) { seen[k] = 1; console.log(t, JSON.stringify(r)); } });
    await p.waitForTimeout(+(process.env.STEP || 500));
  }
  console.log('done', Object.keys(seen).length);
  await b.close();
})();
