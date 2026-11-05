// Close-ups for the upgrade sweep (run upgrades.js first): for every upgrade, the part of the room that changed, before and
// after, zoomed, with the upgrade's name and shop line, so a person can judge: is it obvious, is it what the name says (an
// anime poster shows anime art, not scribbles), is it placed well (not crammed against a wall's end, not floating).
//   OUT=<the upgrades.js folder> node closeups.js [room,room]   -> <OUT>/<room>/closeups.png
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const OUT = process.env.OUT || 'qa-out';
const ONLY = (process.argv[2] || '').split(',').filter(Boolean);
const { BASE, open, diff, ORDER } = require('./lib.js');
(async () => {
  // what each tier bought: from upgrades.json, else each room's tiers.json, else replay the same purchases (same order as
  // upgrades.js: rooms in building order, the window's first Buy button each time) and measure the change from the pictures
  let data = {};
  if (fs.existsSync(path.join(OUT, 'upgrades.json'))) data = JSON.parse(fs.readFileSync(path.join(OUT, 'upgrades.json'), 'utf8'));
  else {
    const done = ORDER.filter((r) => fs.existsSync(path.join(OUT, r, 't00.png')));
    const { b: b0, p: p0 } = await open({ width: 1000, height: 1000, owned: 'none' });
    const order = await p0.evaluate((rooms) => {
      const x = window.__qb.x(), S = x.S, out = {};
      for (const t of rooms) {
        const i = S.base.slots.findIndex((s) => s.t === t); if (i < 0) continue;
        out[t] = [];
        for (let g = 0; g < 80; g++) {
          try { window.lfPvStop(); } catch (e) {} document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove());
          window.__qb.roomModal(i);
          const bt = [...document.querySelectorAll('.rmodal button[data-act="raddon"]')].find((e) => !e.disabled);
          if (!bt) break; out[t].push(bt.dataset.id); bt.click();
        }
      }
      return out;
    }, done);
    for (const [room, ids] of Object.entries(order)) {
      if (fs.existsSync(path.join(OUT, room, 'tiers.json'))) { data[room] = JSON.parse(fs.readFileSync(path.join(OUT, room, 'tiers.json'), 'utf8')); continue; }
      const tiers = [{ k: 0 }];
      for (let k = 1; k <= ids.length; k++) {
        const f = (n) => path.join(OUT, room, 't' + String(n).padStart(2, '0') + '.png');
        if (!fs.existsSync(f(k))) break;
        tiers.push({ k, bought: ids[k - 1], change: await diff(p0, fs.readFileSync(f(k - 1)).toString('base64'), fs.readFileSync(f(k)).toString('base64')) });
      }
      data[room] = tiers;
    }
    await b0.close();
  }
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1500, height: 900 } });
  await p.goto(BASE + '/dist/index.html');
  await p.waitForFunction(() => window.__qb && window.__qb.x, null, { timeout: 60000 });
  const ADD = await p.evaluate(() => { const o = {}; Object.values(window.__qb.x().ADDONS).forEach((l) => l.forEach((u) => { o[u[0]] = [u[1], u[2], u[4]]; })); return o; });
  for (const [room, tiers] of Object.entries(data)) {
    if (ONLY.length && !ONLY.includes(room)) continue;
    const cells = [];
    tiers.forEach((t) => {
      if (!t.k || !t.bought) return;
      const a = ADD[t.bought] || [t.bought, '?', ''];
      const f = (k) => 'data:image/png;base64,' + fs.readFileSync(path.join(OUT, room, 't' + String(k).padStart(2, '0') + '.png')).toString('base64');
      cells.push({ id: t.bought, name: a[0], cost: a[1], line: a[2], px: t.change ? t.change.px : 0, box: t.change && t.change.box, before: f(t.k - 1), after: f(t.k), k: t.k });
    });
    const html = await p.evaluate(async (cells) => {
      const load = (s) => new Promise((ok) => { const im = new Image(); im.onload = () => ok(im); im.src = s; });
      const out = [];
      for (const c of cells) {
        const A = await load(c.before), B = await load(c.after);
        let [x0, y0, x1, y1] = c.box || [0, 0, A.width - 1, A.height - 1];
        const m = 26; x0 -= m; y0 -= m; x1 += m; y1 += m;
        let w = x1 - x0, h = y1 - y0; if (w < 200) { x0 -= (200 - w) / 2; w = 200; } if (h < 150) { y0 -= (150 - h) / 2; h = 150; }
        if (w / h > 4 / 3) { const nh = w * 3 / 4; y0 -= (nh - h) / 2; h = nh; } else { const nw = h * 4 / 3; x0 -= (nw - w) / 2; w = nw; }
        const cv = (im) => { const c2 = document.createElement('canvas'); c2.width = 320; c2.height = 240; const g = c2.getContext('2d'); g.fillStyle = '#1b1530'; g.fillRect(0, 0, 320, 240); g.imageSmoothingQuality = 'high'; g.drawImage(im, x0, y0, w, h, 0, 0, 320, 240); return c2.toDataURL('image/png'); };
        out.push(`<figure><div><img src="${cv(A)}"><img src="${cv(B)}"></div><figcaption${c.px < 2500 ? ' class=warn' : ''}><b>T${c.k} ${c.name}</b> (${c.cost}) · ${c.px} px changed · zoom ${(320 / w).toFixed(1)}x<br><i>${c.line}</i></figcaption></figure>`);
      }
      return out.join('');
    }, cells);
    await p.setContent(`<style>body{margin:0;background:#120e20;color:#eee;font:12px system-ui}h1{font-size:18px;margin:10px}section{display:grid;grid-template-columns:repeat(2,656px);gap:12px;padding:8px}figure{margin:0}figure div{display:flex;gap:6px}img{width:320px;height:240px;border:1px solid #333}figcaption{padding:3px 2px;line-height:1.35}.warn b{color:#ff6b6b}</style><h1>${room}: each upgrade, before (left) and after (right), zoomed on what changed</h1><section>${html}</section>`);
    await p.screenshot({ path: path.join(OUT, room, 'closeups.png'), fullPage: true });
    console.log(room, cells.length);
  }
  await b.close();
})();
