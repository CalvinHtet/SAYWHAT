// Where a change darkened or lightened a room (ROOMS's 9593432 shadows): for each name, the after picture, greyed, with red where it
// got darker than before (new shadow) and blue where it got lighter (an old hard box gone), side by side with the plain after
// picture. Writes <OUT>/<name>_map.png.   node shadowmap.js <before folder> <after folder> <OUT> name,name,...
const fs = require('fs'), path = require('path'), { chromium } = require('playwright');
const [A, B, OUT, names] = process.argv.slice(2);
(async () => {
  const br = await chromium.launch(); const p = await br.newPage();
  for (const k of names.split(',')) {
    const d = await p.evaluate(async ([a, b]) => {
      const load = (d) => new Promise((o) => { const i = new Image(); i.onload = () => o(i); i.src = 'data:image/png;base64,' + d; });
      const [ia, ib] = [await load(a), await load(b)], w = ib.width, h = ib.height;
      const get = (im) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); x.drawImage(im, 0, 0); return x.getImageData(0, 0, w, h); };
      const da = get(ia).data, Db = get(ib), db = Db.data;
      const c = document.createElement('canvas'); c.width = w * 2 + 10; c.height = h; const x = c.getContext('2d'); x.fillStyle = '#000'; x.fillRect(0, 0, c.width, c.height);
      x.putImageData(Db, 0, 0);
      const m = x.createImageData(w, h); let dark = 0, light = 0;
      for (let i = 0; i < da.length; i += 4) { const la = (da[i] + da[i + 1] + da[i + 2]) / 3, lb = (db[i] + db[i + 1] + db[i + 2]) / 3, g = lb * 0.5;
        let r = g, gg = g, bb = g; const dd = lb - la;
        if (dd < -10) { r = Math.min(255, 120 + -dd * 4); gg = g * 0.4; bb = g * 0.4; dark++; } else if (dd > 10) { bb = Math.min(255, 120 + dd * 4); r = g * 0.4; gg = g * 0.6; light++; }
        m.data[i] = r; m.data[i + 1] = gg; m.data[i + 2] = bb; m.data[i + 3] = 255; }
      x.putImageData(m, w + 10, 0);
      return [c.toDataURL('image/png').split(',')[1], dark, light, w * h]; }, [fs.readFileSync(path.join(A, k + '.png')).toString('base64'), fs.readFileSync(path.join(B, k + '.png')).toString('base64')]);
    fs.writeFileSync(path.join(OUT, k + '_map.png'), Buffer.from(d[0], 'base64'));
    console.log(`${k}: darker ${(100 * d[1] / d[3]).toFixed(1)}%, lighter ${(100 * d[2] / d[3]).toFixed(1)}%`);
  }
  await br.close();
})();
