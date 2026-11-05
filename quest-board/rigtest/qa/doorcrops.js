// Close-ups of every door glow in every room, everything bought: is anything standing on it, can you see it.
//   OUT=<folder> node doorcrops.js   -> <OUT>/doorcrops.png
const fs = require('fs'), path = require('path');
const { open, openRoom, ORDER } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const { b, p } = await open({ width: 1400, height: 1200, owned: 'all' });
  const cells = [];
  for (const room of ORDER) {
    const i = await p.evaluate((t) => window.__qb.x().S.base.slots.findIndex((s) => s.t === t), room);
    await openRoom(p, i, 1300, 1000);
    const boxes = await p.evaluate(() => [...document.querySelectorAll('#qahost polygon.prtG')].map((e) => { const r = e.getBoundingClientRect(); return [r.left, r.top, r.width, r.height, e.getAttribute('fill')]; }));
    const targets = await p.evaluate(() => [...document.querySelectorAll('.rmodal .prtb-b')].map((e) => e.textContent.trim()));
    for (let k = 0; k < boxes.length; k++) {
      const [x, y, w, h, col] = boxes[k], m = 110;
      const clip = { x: Math.max(0, x - m), y: Math.max(0, y - m * 1.6), width: Math.min(1300, w + 2 * m), height: h + m * 2.2 };
      const f = path.join(OUT, `dc_${room}_${k}.png`);
      await p.screenshot({ path: f, clip });
      cells.push({ f, lab: room + ' door ' + (k + 1) + ' of ' + boxes.length + ' (glow ' + col + ')' + (k === 0 ? ' · arrows: ' + targets.join(', ') : '') });
    }
  }
  const html = cells.map((c) => `<figure><img src="data:image/png;base64,${fs.readFileSync(c.f).toString('base64')}"><figcaption>${c.lab}</figcaption></figure>`).join('');
  const sp = await b.newPage({ viewport: { width: 1500, height: 800 } });
  await sp.setContent(`<style>body{margin:0;background:#111;color:#eee;font:12px system-ui}div{display:grid;grid-template-columns:repeat(5,290px);gap:6px;padding:6px}img{width:290px;height:220px;object-fit:contain;background:#000}figure{margin:0}</style><div>${html}</div>`);
  await sp.screenshot({ path: path.join(OUT, 'doorcrops.png'), fullPage: true });
  await b.close();
})();
