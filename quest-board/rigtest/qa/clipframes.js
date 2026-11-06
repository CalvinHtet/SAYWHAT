// Every frame of a clip, sorted (LEAD's a384feb: a span touching a painted pose shows one key or the other, never a blend).
// For each row of a matrix `sheet=clip` picture (one item on one body), every frame is compared with every other: frames that
// are pixel-identical form a group; a frame that is alone (matches no other frame) is a blend between keys, which is where tears
// come from. Prints the groups per row and every lone frame.
//   node clipframes.js <sheet.png> <frames per row> <cell width> <cell height> [labels.json]
const fs = require('fs'), { chromium } = require('playwright');
const [png, n, cw, ch] = process.argv.slice(2);
(async () => {
  const br = await chromium.launch(); const p = await br.newPage();
  const rows = await p.evaluate(async ([d, n, cw, ch]) => {
    const im = await new Promise((o) => { const i = new Image(); i.onload = () => o(i); i.src = 'data:image/png;base64,' + d; });
    const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const x = c.getContext('2d'); x.drawImage(im, 0, 0);
    const data = x.getImageData(0, 0, im.width, im.height).data, W = im.width, R = Math.floor(im.height / ch), LBL = 12, out = [];
    const cell = (r, f) => { const a = []; for (let y = r * ch + LBL; y < (r + 1) * ch; y++) for (let xx = f * cw; xx < (f + 1) * cw; xx++) { const k = (y * W + xx) * 4; a.push(data[k], data[k + 1], data[k + 2]); } return a; };
    const same = (a, b) => { let n = 0; for (let i = 0; i < a.length; i++) if (Math.abs(a[i] - b[i]) > 24) n++; return n < 12; };
    for (let r = 0; r < R; r++) {
      const cells = []; for (let f = 0; f < n; f++) cells.push(cell(r, f));
      const blank = cells[0].every((v, i) => v === cells[0][i % 3]);
      const grp = new Array(n).fill(-1); let g = 0;
      for (let f = 0; f < n; f++) { if (grp[f] >= 0) continue; grp[f] = g; for (let h = f + 1; h < n; h++) if (grp[h] < 0 && same(cells[f], cells[h])) grp[h] = g; g++; }
      const size = {}; grp.forEach((q) => (size[q] = (size[q] || 0) + 1));
      out.push({ r, groups: g, grp, lone: grp.map((q, f) => (size[q] === 1 ? f : -1)).filter((f) => f >= 0) });
    }
    return out;
  }, [fs.readFileSync(png).toString('base64'), +n, +cw, +ch]);
  const labels = process.argv[6] ? JSON.parse(fs.readFileSync(process.argv[6], 'utf8')) : null;
  let bad = 0;
  rows.forEach((x) => { const name = labels ? labels[x.r] : 'row ' + x.r; if (x.lone.length) bad++;
    console.log(`${name}: ${x.groups} distinct pictures, frames by group ${x.grp.join('')}` + (x.lone.length ? `  LONE (blended?) frames ${x.lone.join(',')}` : '')); });
  console.log(`${rows.length} rows, ${bad} with a lone frame`);
  await br.close();
})();
