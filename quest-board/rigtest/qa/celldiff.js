// Cell-by-cell pixel diff of two matrix sheet PNGs (before and after a rig change), in headless Chromium: which cells changed.
//   node celldiff.js a.png b.png <cols> <cell width> <cell height>
const fs = require('fs'), { chromium } = require('playwright');
const [a, b, cols, cw, ch] = process.argv.slice(2);
(async () => {
  const br = await chromium.launch(); const p = await br.newPage();
  const r = await p.evaluate(async ([A, B, cols, cw, ch]) => {
    const load = (d) => new Promise((o) => { const i = new Image(); i.onload = () => o(i); i.src = 'data:image/png;base64,' + d; });
    const [ia, ib] = [await load(A), await load(B)]; const w = ia.width, h = ia.height;
    const g = (im) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); x.drawImage(im, 0, 0); return x.getImageData(0, 0, w, h).data; };
    const da = g(ia), db = g(ib), rows = Math.ceil(h / ch), out = [];
    for (let rr = 0; rr < rows; rr++) for (let cc = 0; cc < cols; cc++) { let n = 0;
      for (let y = rr * ch; y < Math.min(h, (rr + 1) * ch); y++) for (let x = cc * cw; x < Math.min(w, (cc + 1) * cw); x++) { const k = (y * w + x) * 4; if (Math.abs(da[k] - db[k]) + Math.abs(da[k + 1] - db[k + 1]) + Math.abs(da[k + 2] - db[k + 2]) > 30) n++; }
      if (n) out.push([rr, cc, n]); }
    return { w, h, rows, out };
  }, [fs.readFileSync(a).toString('base64'), fs.readFileSync(b).toString('base64'), +cols, +cw, +ch]);
  console.log(JSON.stringify(r)); await br.close();
})();
