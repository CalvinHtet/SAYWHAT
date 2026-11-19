// QA: olive/yellow-green spill (the key's leftover) per slime frame: alpha>40, g > b+35, r > b+15, g >= r-25 (yellowish-green, not amber), plus where.
const pw = require('playwright'), fs = require('fs'); const A = process.argv[2];
(async () => { const b = await pw.chromium.launch(); const p = await (await b.newContext()).newPage(); await p.goto('about:blank');
  for (const f of fs.readdirSync(A).filter((f) => /^(pgx_slime_\d+|pbed_slime|pgx_wolf_\d+|pbed_wolf)\.webp$/.test(f)).sort((a, c) => a.localeCompare(c, undefined, { numeric: true }))) {
    const r = await p.evaluate(async (src) => { const im = await new Promise((o) => { const i = new Image(); i.onload = () => o(i); i.src = src; }); const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const g = c.getContext('2d'); g.drawImage(im, 0, 0); const d = g.getImageData(0, 0, c.width, c.height).data;
      let n = 0, x0 = 1e9, x1 = -1, y0 = 1e9, y1 = -1; for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) { const i = (y * c.width + x) * 4; if (d[i + 3] > 40 && d[i + 1] > d[i + 2] + 35 && d[i] > d[i + 2] + 15 && d[i + 1] >= d[i] - 25) { n++; x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); } }
      return n ? `${n} px in x ${x0}-${x1} y ${y0}-${y1}` : '0'; }, 'data:image/webp;base64,' + fs.readFileSync(A + '/' + f).toString('base64'));
    console.log(f.padEnd(20), r); } await b.close(); })();
