// QA: per pet frame: canvas size, lowest opaque row (ground), mass centre x, green spill px (g beats r and b by 25+, alpha>40), edge px touching canvas border.
const pw = require('playwright'), fs = require('fs'); const A = process.argv[2];
(async () => { const b = await pw.chromium.launch(); const p = await (await b.newContext()).newPage(); await p.goto('about:blank');
  const files = fs.readdirSync(A).filter((f) => /^(pgx_(wolf|wyvern|slime)_\d+|pbed_(wolf|wyvern|slime))\.webp$/.test(f)).sort((a, c) => a.localeCompare(c, undefined, { numeric: true }));
  for (const f of files) { const src = 'data:image/webp;base64,' + fs.readFileSync(A + '/' + f).toString('base64');
    const r = await p.evaluate(async (src) => { const im = await new Promise((o) => { const i = new Image(); i.onload = () => o(i); i.src = src; }); const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const g = c.getContext('2d'); g.drawImage(im, 0, 0); const d = g.getImageData(0, 0, c.width, c.height).data;
      let low = -1, top = 1e9, sx = 0, n = 0, green = 0, border = 0, semi = 0; for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) { const i = (y * c.width + x) * 4, a = d[i + 3]; if (a > 128) { low = Math.max(low, y); top = Math.min(top, y); sx += x; n++; if (x === 0 || y === 0 || x === c.width - 1) border++; } if (a > 40 && d[i + 1] - Math.max(d[i], d[i + 2]) > 25) green++; if (a > 10 && a < 200) semi++; }
      return { w: c.width, h: c.height, groundGap: c.height - 1 - low, top, cx: Math.round(sx / n), green, border, semi, n }; }, src);
    console.log(f.padEnd(22), `${r.w}x${r.h} groundGap ${r.groundGap} top ${r.top} cx ${r.cx} green ${r.green} border ${r.border} semi ${r.semi} solid ${r.n}`); } await b.close(); })();
