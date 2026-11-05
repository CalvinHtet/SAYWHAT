// Every station in every room: standing spots inside or touching furniture, and seats with no furniture under them.
const OUT = process.env.OUT || 'shots'; require('fs').mkdirSync(OUT, { recursive: true });
const { open } = require('./drv.js');
(async () => {
  const { b, p } = await open({ width: 1200, height: 900 });
  const out = await p.evaluate(() => {
    const S = window.__qb.x().S, q = window.__qbLoft(), res = [];
    S.base.slots.forEach((r, i) => {
      const C = q.roomCtx(r, 90 + i), obs = C.obsRaw || [];
      const dist = (x, y) => Math.min(99, ...obs.map((o) => Math.hypot(Math.max(0, o[0] - x, x - o[2]), Math.max(0, o[1] - y, y - o[3]))));
      const inside = (x, y) => obs.some((o) => x > o[0] + .02 && x < o[2] - .02 && y > o[1] + .02 && y < o[3] - .02);
      const bad = [];
      C.st.forEach((s) => {
        if (s.kind === 'door') return;
        const seat = !!s.lift || (s.kind === 'sit' && !s.cust) || s.kind === 'bed';
        const d = dist(s.x, s.y);
        if (!seat && inside(s.x, s.y)) bad.push(`STAND-IN ${s.kind}:${s.tag || ''} (${s.x.toFixed(2)},${s.y.toFixed(2)})`);
        else if (!seat && d < 0.18) bad.push(`stand-touch ${d.toFixed(2)} ${s.kind}:${s.tag || ''} (${s.x.toFixed(2)},${s.y.toFixed(2)})`);
        if (seat && s.kind !== 'bed' && d > 0.6) bad.push(`seat-on-air ${d.toFixed(2)} ${s.kind}:${s.tag || ''} (${s.x.toFixed(2)},${s.y.toFixed(2)})`);
        if (s.x < 0 || s.y < 0 || s.x > C.W || s.y > C.D) bad.push(`OUTSIDE ${s.kind}:${s.tag || ''} (${s.x.toFixed(2)},${s.y.toFixed(2)})`);
      });
      res.push([r.t, C.st.length, bad]);
    });
    return res;
  });
  out.forEach(([t, n, bad]) => { console.log(t, n, 'stations', bad.length ? '' : 'ok'); bad.slice(0, 12).forEach((x) => console.log('   ', x)); });
  await b.close();
})();
