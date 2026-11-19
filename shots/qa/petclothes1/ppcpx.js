// QA: per ppc file: size, green spill (g beats r,b by 25+), magenta key spill (r,b > 150, g < 110, r-g > 80, b-g > 80), pale-pink fringe on edges
// (alpha 20-200 with r>200,b>170,g<170), opaque px touching the image border (cut off), solid px.
const pw = require('playwright'), fs = require('fs'); const A = process.argv[2];
(async () => { const b = await pw.chromium.launch(); const p = await (await b.newContext()).newPage(); await p.goto('about:blank');
  for (const f of fs.readdirSync(A).filter((f) => /^ppc_/.test(f)).sort()) {
    const r = await p.evaluate(async (src) => { const im = await new Promise((o) => { const i = new Image(); i.onload = () => o(i); i.src = src; }); const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const g = c.getContext('2d'); g.drawImage(im, 0, 0); const d = g.getImageData(0, 0, c.width, c.height).data;
      let green = 0, mag = 0, fringe = 0, border = 0, solid = 0; for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) { const i = (y * c.width + x) * 4, R = d[i], G = d[i + 1], B = d[i + 2], a = d[i + 3];
        if (a > 128) { solid++; if (x === 0 || y === 0 || x === c.width - 1 || y === c.height - 1) border++; } if (a > 40 && G - Math.max(R, B) > 25) green++; if (a > 40 && R > 150 && B > 150 && G < 110 && R - G > 80 && B - G > 80) mag++; if (a > 20 && a < 200 && R > 200 && B > 170 && G < 170) fringe++; }
      return `${c.width}x${c.height} solid ${solid} green ${green} magenta ${mag} pinkFringe ${fringe} border ${border}`; }, 'data:image/webp;base64,' + fs.readFileSync(A + '/' + f).toString('base64'));
    console.log(f.padEnd(22), r); } await b.close(); })();
