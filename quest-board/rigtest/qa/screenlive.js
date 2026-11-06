// A wall screen live (the Mall's Directory, 322760a): waits until its text is showing, then a close picture of it and its text box.
//   OUT=<folder> BASE=<server> node screenlive.js
const { open } = require('./lib.js');
(async () => {
  const { b, p } = await open({ width: 1000, height: 900, owned: 'none' });
  await p.evaluate(async () => { const x = window.__qb.x(), S = x.S; S.base.slots = S.base.slots.filter((s) => s.t !== 'mall'); S.base.slots.push({ t: 'mall', a: {}, st: 0, pend: 0 }); const rr = S.base.slots[S.base.slots.length - 1];
    x.ADDONS.mall.forEach((u) => { if (!(u[3] && (u[3].retired || u[3].opens))) rr.a[u[0]] = 1; }); document.querySelectorAll('#layer .modal').forEach((e) => e.remove()); window.__qb.roomModal(S.base.slots.length - 1); });
  for (let k = 0; k < 30; k++) { await p.waitForTimeout(500); const op = await p.evaluate(() => { const e = document.querySelector('.rmodal svg text'); let op = 1, n = e; while (n && n.tagName !== 'svg') { op *= +getComputedStyle(n).opacity; n = n.parentElement; } return op; }); if (op > 0.9) break; }
  // scroll the picture so the screen is in view and zoom on it
  await p.evaluate(() => { const e = document.querySelector('.rmodal svg text'); e.scrollIntoView({ block: 'center' }); });
  await p.waitForTimeout(300);
  const bb = await p.evaluate(() => { const ts = [...document.querySelectorAll('.rmodal svg text')]; const rs = ts.map((e) => e.getBoundingClientRect()); const x0 = Math.min(...rs.map((r) => r.left)), y0 = Math.min(...rs.map((r) => r.top)), x1 = Math.max(...rs.map((r) => r.right)), y1 = Math.max(...rs.map((r) => r.bottom)); return [x0, y0, x1 - x0, y1 - y0]; });
  console.log('text box', bb.map(Math.round));
  await p.screenshot({ path: (process.env.OUT || 'qa-out') + '/directory_zoom.png', clip: { x: Math.max(0, bb[0] - 30), y: Math.max(0, bb[1] - 30), width: bb[2] + 60, height: bb[3] + 60 } });
  await b.close();
})();
