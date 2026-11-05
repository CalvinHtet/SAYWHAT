// Put one guest on each table seat of the Restaurant and report whether it is drawn before (behind) or after its table.
const { open } = require('./drv.js');
(async () => {
  const { b, p } = await open({ width: 1400, height: 1400 });
  await p.evaluate(() => { document.querySelectorAll('.dropsplash,.modal,.overlay').forEach((e) => e.remove()); const t = [...document.querySelectorAll('button')].find((e) => /the loft/i.test(e.textContent)); if (t) t.click(); });
  await p.waitForTimeout(1500);
  const i = await p.evaluate(() => window.__order.indexOf('restaurant'));
  await p.evaluate((i) => { document.querySelectorAll('.modal').forEach((e) => e.remove()); window.__qb.roomModal(i); }, i);
  await p.waitForTimeout(3000);
  const res = await p.evaluate((i) => {
    const q = window.__qbLoft(), a = Object.values(q.A).find((x) => x.pv && x.pvslot === i && x.role === 'guest');
    const C = q.C(a), out = [];
    const g = document.getElementById('lfa-' + a.id.replace(/[^a-z0-9_-]/gi, '_'));
    C.st.filter((s) => s.cust && s.tb).forEach((s) => {
      a.alpha = 1; a.wp = []; a.x = s.x; a.y = s.y; s.by = a.id; q.arrive(a, s); a.sat = 1; a.act = 'sit'; a.t = 1e6; a._dk = -99; q.draw(a, true);
      const items = [...g.parentNode.children];
      const tb = items.find((c) => { const bb = c.getAttribute('data-b'); if (!bb) return false; const v = bb.split(',').map(Number); return s.tb[0] > v[0] && s.tb[0] < v[2] && s.tb[1] > v[1] && s.tb[1] < v[3]; });
      const before = tb ? items.indexOf(g) < items.indexOf(tb) : null;
      const behind = s.y < s.tb[1];
      out.push([s.lbl, +s.x.toFixed(2), +s.y.toFixed(2), s.fx, s.facewall ? 'back' : 'front', s.dk || 0, behind ? 'far side' : 'near side', tb ? (before ? 'drawn BEHIND table' : 'drawn OVER table') : 'no table found']);
    });
    return out;
  }, i);
  res.forEach((r) => console.log(r.join(' | ')));
  await b.close();
})();
