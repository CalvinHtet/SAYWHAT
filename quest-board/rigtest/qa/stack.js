// Stack sheet PNGs into one picture, top to bottom, in headless Chromium.
//   node stack.js out.png a.png b.png ...
const fs = require('fs'), { chromium } = require('playwright');
const [out, ...ins] = process.argv.slice(2);
(async () => {
  const br = await chromium.launch(); const p = await br.newPage();
  const data = await p.evaluate(async (L) => {
    const ims = await Promise.all(L.map((d) => new Promise((o) => { const i = new Image(); i.onload = () => o(i); i.src = 'data:image/png;base64,' + d; })));
    const c = document.createElement('canvas'); c.width = Math.max(...ims.map((i) => i.width)); c.height = ims.reduce((a, i) => a + i.height, 0);
    const x = c.getContext('2d'); let y = 0; ims.forEach((i) => { x.drawImage(i, 0, y); y += i.height; }); return c.toDataURL('image/png').split(',')[1];
  }, ins.map((f) => fs.readFileSync(f).toString('base64')));
  fs.writeFileSync(out, Buffer.from(data, 'base64')); await br.close();
})();
