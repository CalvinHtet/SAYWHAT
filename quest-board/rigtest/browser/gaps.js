// Smallest floor gap between furniture footprints in every room (all upgrades), and items outside the room.
const OUT = process.env.OUT || 'shots'; require('fs').mkdirSync(OUT, { recursive: true });
const { open } = require('./drv.js');
(async () => {
  const { b, p } = await open({ width: 1200, height: 900 });
  const out = await p.evaluate(() => {
    const S = window.__qb.x().S, q = window.__qbLoft(), res = [];
    S.base.slots.forEach((r, i) => {
      const C = q.roomCtx(r, 90 + i), host = document.createElement('div');
      host.innerHTML = '<svg>' + q.roomSvg(r, 90 + i, C, { uid: 900 + i }) + '</svg>';
      const it = [...host.querySelectorAll('.lfitems > g[data-b]')].map((g) => ({ b: g.getAttribute('data-b').split(',').map(Number), n: (g.innerHTML.match(/([a-z0-9]+x?_[a-z0-9_]+)\.webp/) || [, 'box'])[1] }));
      const pairs = [];
      for (let a = 0; a < it.length; a++) for (let c = a + 1; c < it.length; c++) {
        const A = it[a].b, B = it[c].b;
        const dx = Math.max(0, B[0] - A[2], A[0] - B[2]), dy = Math.max(0, B[1] - A[3], A[1] - B[3]);
        const g = Math.hypot(dx, dy);
        if (g < 0.45) pairs.push([+g.toFixed(2), it[a].n, it[c].n]);
      }
      pairs.sort((x, y) => x[0] - y[0]);
      const out = it.filter((x) => x.b[0] < -0.05 || x.b[1] < -0.05 || x.b[2] > C.W + 0.05 || x.b[3] > C.D + 0.05).map((x) => x.n + '[' + x.b.map((v) => v.toFixed(1)) + ']');
      res.push([r.t, C.W + 'x' + C.D, it.length, pairs.slice(0, 14), out]);
    });
    return res;
  });
  for (const [t, wd, n, pairs, outside] of out) {
    console.log(`${t} ${wd} ${n} items` + (outside.length ? ' OUTSIDE: ' + outside.join(' ') : ''));
    pairs.forEach((x) => console.log('    ' + x.join(' ')));
  }
  await b.close();
})();
