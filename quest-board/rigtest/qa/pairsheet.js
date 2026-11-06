// Before / after contact sheets: for each name, <A>/<name>.png beside <B>/<name>.png, scaled to W wide each, PER pairs per row,
// ROWS rows per sheet, labelled. Writes <OUT>/<tag>_<n>.png.
//   node pairsheet.js <A folder> <B folder> <OUT> <tag> name,name,... [W=420] [PER=3] [ROWS=2]
const fs = require('fs'), path = require('path'), { chromium } = require('playwright');
const [A, B, OUT, tag, names, W = 420, PER = 3, ROWS = 2] = process.argv.slice(2);
(async () => {
  const br = await chromium.launch(); const p = await br.newPage(); const list = names.split(','), per = +PER * +ROWS; let n = 0;
  for (let i = 0; i < list.length; i += per) {
    const chunk = list.slice(i, i + per).map((k) => [k, fs.readFileSync(path.join(A, k + '.png')).toString('base64'), fs.readFileSync(path.join(B, k + '.png')).toString('base64')]);
    const d = await p.evaluate(async ([chunk, W, PER]) => {
      const load = (d) => new Promise((o) => { const i = new Image(); i.onload = () => o(i); i.src = 'data:image/png;base64,' + d; });
      const ims = []; for (const [k, a, b] of chunk) ims.push([k, await load(a), await load(b)]);
      const h = Math.round(W * ims[0][1].height / ims[0][1].width), cw = W * 2 + 8, ch = h + 22, rows = Math.ceil(ims.length / PER);
      const c = document.createElement('canvas'); c.width = cw * PER + 12 * (PER - 1); c.height = ch * rows; const x = c.getContext('2d');
      x.fillStyle = '#111'; x.fillRect(0, 0, c.width, c.height); x.font = 'bold 16px sans-serif';
      ims.forEach(([k, a, b], j) => { const X = (j % PER) * (cw + 12), Y = Math.floor(j / PER) * ch;
        x.fillStyle = '#fff'; x.fillText(k + '  (before | after)', X + 4, Y + 16); x.drawImage(a, X, Y + 22, W, h); x.drawImage(b, X + W + 8, Y + 22, W, h); });
      return c.toDataURL('image/png').split(',')[1]; }, [chunk, +W, +PER]);
    fs.writeFileSync(path.join(OUT, `${tag}_${++n}.png`), Buffer.from(d, 'base64'));
  }
  console.log(n + ' sheets'); await br.close();
})();
