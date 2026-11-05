// For every fully upgraded room: pairs of furniture whose footprints say A is behind B,
// whose drawn images overlap on screen, but which are drawn in the wrong order.
const { open } = require('./drv.js');
(async () => {
  const { b, p, errs } = await open({ width: 1400, height: 1400 });
  const out = await p.evaluate(() => {
    const x = window.__qb.x(), S = x.S, q = window.__qbLoft(), res = {};
    const host = document.createElement('div');
    host.style.cssText = 'position:absolute;left:0;top:0;width:2000px;height:2000px;visibility:hidden';
    document.body.appendChild(host);
    S.base.slots.forEach((r, i) => {
      let C;
      try { C = q.roomCtx(r, 90 + i); } catch (e) { res[r.t] = 'ERR ' + e.message; return; }
      const svg = q.roomSvg(r, 90 + i, C, { uid: 900 + i });
      host.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="2000" height="2000">' + svg + '</svg>';
      const gs = [...host.querySelectorAll('.lfitems > g[data-b]')];
      const it = gs.map((g, n) => { const bb = g.getBBox(); return { n, b: g.getAttribute('data-b').split(',').map(Number), k: +g.getAttribute('data-k'), r: [bb.x, bb.y, bb.x + bb.width, bb.y + bb.height], name: (g.innerHTML.match(/href="[^"]*?([a-z0-9]+_[a-z0-9_]+)\.webp/) || g.innerHTML.match(/art\/([a-z0-9_]+)/) || [, '?'])[1] }; });
      const bad = [];
      const e = 0.02;
      for (const A of it) for (const B of it) {
        if (A.n >= B.n) continue; // A drawn first
        // B is behind A if B is separated toward -x or -y and not ahead on the other axis
        const bx = B.b[2] <= A.b[0] + e, by = B.b[3] <= A.b[1] + e, ax = A.b[2] <= B.b[0] + e, ay = A.b[3] <= B.b[1] + e;
        const bBehind = (bx && !(A.b[3] <= B.b[1] + e)) || (by && !(A.b[2] <= B.b[0] + e));
        if (!bBehind) continue;
        const ov = Math.min(A.r[2], B.r[2]) - Math.max(A.r[0], B.r[0]), oh = Math.min(A.r[3], B.r[3]) - Math.max(A.r[1], B.r[1]);
        if (ov > 2 && oh > 2) bad.push(`${B.name}[${B.b.map((v) => v.toFixed(1))}] drawn over ${A.name}[${A.b.map((v) => v.toFixed(1))}] ov ${ov.toFixed(0)}x${oh.toFixed(0)}`);
      }
      res[r.t] = { items: it.length, bad };
    });
    host.remove();
    return res;
  });
  for (const [k, v] of Object.entries(out)) { console.log(k, typeof v === 'string' ? v : v.items + ' items, ' + v.bad.length + ' bad'); if (v.bad) v.bad.slice(0, 12).forEach((l) => console.log('   ', l)); }
  console.log('errs', errs.slice(0, 3));
  await b.close();
})();
