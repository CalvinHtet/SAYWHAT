// QA: every pet piece with its Shop name and line (from 29zz_pets.js PCNAME) beside all its cells, one sheet per line, for ticking
// each named detail and colour against the art. SRC=<29zz_pets.js> ART=<art dir> CL=<pet_clothes.json> OUT=<dir>
const pw = require('playwright'), fs = require('fs'); const SRC = fs.readFileSync(process.env.SRC, 'utf8'), ART = process.env.ART, OUT = process.env.OUT;
const i0 = SRC.indexOf('var PCNAME='), j0 = SRC.indexOf('\n', i0); let txt = SRC.slice(i0 + 11, j0).trim(); if (txt.endsWith(';')) txt = txt.slice(0, -1);
const PC = JSON.parse(txt), CL = JSON.parse(fs.readFileSync(process.env.CL, 'utf8'));
(async () => { const b = await pw.chromium.launch(); const p = await (await b.newContext()).newPage(); await p.goto('about:blank');
  for (const line of ['wolf', 'wyvern', 'slime', 'dogs']) { const ids = Object.keys(CL).filter((k) => CL[k].pet === line).sort();
    const items = ids.map((id) => ({ id, name: (PC[id] || ['NO NAME'])[0], line: (PC[id] || ['', 'NO LINE'])[1], cells: CL[id].cells.map((c) => 'data:image/webp;base64,' + fs.readFileSync(ART + '/ppc_' + id + '_' + c.cell + '.webp').toString('base64')) }));
    const png = await p.evaluate(async (items) => { const ld = (u) => new Promise((o) => { const i = new Image(); i.onload = () => o(i); i.src = u; }); const RH = 190, W = 1800; const cv = document.createElement('canvas'); cv.width = W; cv.height = items.length * RH; const g = cv.getContext('2d');
      for (let r = 0; r < items.length; r++) { const it = items[r], Y = r * RH; g.fillStyle = r % 2 ? '#d8d4cc' : '#cfcac0'; g.fillRect(0, Y, W, RH); g.fillStyle = '#111'; g.font = 'bold 17px sans-serif'; g.fillText(it.id + '  ' + it.name, 8, Y + 22); g.font = '15px sans-serif';
        const words = it.line.split(' '); let ln = '', yy = Y + 44; for (const w of words) { if (g.measureText(ln + w).width > 560) { g.fillText(ln, 8, yy); yy += 19; ln = ''; } ln += w + ' '; } g.fillText(ln, 8, yy);
        let X = 600; for (const u of it.cells) { const im = await ld(u); const s = Math.min(170 / im.height, 260 / im.width, 1.4); g.drawImage(im, X, Y + 10, im.width * s, im.height * s); X += im.width * s + 14; if (X > W - 100) break; } }
      return cv.toDataURL('image/png'); }, items);
    fs.writeFileSync(OUT + '/lines_' + line + '.png', Buffer.from(png.split(',')[1], 'base64')); console.log(line, items.length, items.filter((i) => i.name === 'NO NAME').map((i) => i.id).join(',')); }
  await b.close(); })();
