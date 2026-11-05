// node zoom.js room out.png sprite [sprite] -> a 2.5x crop of the room view around those sprites
// node zoom.js room out.png name1 [name2]  -> crop of the room view around those items, at 2.5x
const { open } = require('./drv.js');
(async () => {
  const [room, out, ...names] = process.argv.slice(2);
  process.env.DSF = process.env.DSF || '2.5';
  const { b, p, errs } = await open({ width: 1400, height: 1400 });
  await p.evaluate(() => { document.querySelectorAll('.dropsplash,.modal,.overlay').forEach((e) => e.remove()); const t = [...document.querySelectorAll('button')].find((e) => /the loft/i.test(e.textContent)); if (t) t.click(); });
  await p.waitForTimeout(1200);
  const i = await p.evaluate((room) => window.__order.indexOf(room), room);
  await p.evaluate((i) => { document.querySelectorAll('.dropsplash,.modal,.overlay').forEach((e) => e.remove()); window.__qb.roomModal(i); }, i);
  await p.waitForTimeout(+(process.env.WAIT || 3500));
  const r = await p.evaluate((names) => {
    const w = document.querySelector('#rbigw'), gs = [...w.querySelectorAll('.lfitems > g')];
    let R = null;
    for (const n of names) for (const g of gs) {
      if (!g.innerHTML.includes(n)) continue;
      const q = g.getBoundingClientRect();
      R = R ? [Math.min(R[0], q.left), Math.min(R[1], q.top), Math.max(R[2], q.right), Math.max(R[3], q.bottom)] : [q.left, q.top, q.right, q.bottom];
    }
    const W = w.getBoundingClientRect();
    if (!R) return null;
    const m = 30;
    const x0 = Math.max(W.left, R[0] - m), y0 = Math.max(W.top, R[1] - m), x1 = Math.min(W.right, R[2] + m), y1 = Math.min(W.bottom, R[3] + m);
    return { x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
  }, names);
  if (!r) { console.log('not found', names); await b.close(); return; }
  await p.screenshot({ path: out, clip: r, timeout: 60000 });
  console.log(out, Math.round(r.width), Math.round(r.height));
  await b.close();
})();
