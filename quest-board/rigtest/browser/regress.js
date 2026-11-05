// node regress.js -> for every top (and the creator's tee, hoodie and bomber): render all poses with the armpit rule
// on and off, and list cells whose pixels changed. Saves both sheets for anything that changed outside the stretch poses.
const { chromium } = require('playwright');
const fs = require('fs');
const OUT = process.env.OUT || 'shots'; fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const tops = (process.argv[2] || '').split(',').filter(Boolean);
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage();
  const shot = async (qs) => {
    await p.goto('http://127.0.0.1:8765/rigtest/matrix.html?' + qs);
    await p.waitForFunction(() => /^(ready|error)/.test(document.title), null, { timeout: 300000 });
    return p.evaluate(() => { const c = document.getElementById('out'), g = c.getContext('2d'); return { w: c.width, h: c.height, url: c.toDataURL('image/png'), px: Array.from(g.getImageData(0, 0, c.width, c.height).data) }; });
  };
  const cw = 130, ch = 150, cols = 22;
  const report = [];
  for (const t of tops) {
    const base = t.startsWith('base:') ? '&top=' + t.slice(5) + '&arts=' : '&arts=' + t;
    const q = `sheet=wear${base}&cols=${cols}&cw=${cw}&ch=${ch}&nolabel=1`;
    const on = await shot(q), off = await shot(q + '&armpit=off');
    const rows = Math.round(on.h / ch);
    const P = ['idle','idleIn','walk1','walk2','walk3','walk4','stretchUp','stretch','sitFront','sitFrontIn','sitBack','type1','type2','sleep','sleepIn','rearStand','rearStandIn','backwalk1','backwalk2','backwalk3','backwalk4','sleepHead'];
    const changed = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      let diff = 0;
      for (let y = r * ch; y < (r + 1) * ch; y++) for (let x = c * cw; x < (c + 1) * cw; x++) {
        const i = (y * on.w + x) * 4; const d = Math.abs(on.px[i] - off.px[i]) + Math.abs(on.px[i + 1] - off.px[i + 1]) + Math.abs(on.px[i + 2] - off.px[i + 2]);
        if (d > 60) diff++;
      }
      if (diff > 15) changed.push((rows === 2 ? (r ? 'f' : 'm') : '?') + ':' + P[c] + ':' + diff);
    }
    const odd = changed.filter((s) => !/stretch/.test(s));
    report.push(t + ' changed ' + changed.length + (odd.length ? ' OUTSIDE STRETCH: ' + odd.join(' ') : ''));
    if (odd.length) { fs.writeFileSync(`${OUT}/rg_${t.replace(':', '_')}_on.png`, Buffer.from(on.url.split(',')[1], 'base64')); fs.writeFileSync(`${OUT}/rg_${t.replace(':', '_')}_off.png`, Buffer.from(off.url.split(',')[1], 'base64')); }
    console.log(report[report.length - 1]);
  }
  await b.close();
})();
