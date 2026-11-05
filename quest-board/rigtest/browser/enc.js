// Count WebP encodes over time on one tab (phone size), to see whether rendering ever settles.
const { open } = require('./drv.js');
(async () => {
  const t = process.argv[2] || 'board';
  const { b, p } = await open({ width: 390, height: 844, mobile: true });
  await p.evaluate(() => { window.__enc = 0; const o = HTMLCanvasElement.prototype.toDataURL; HTMLCanvasElement.prototype.toDataURL = function (...a) { window.__enc++; return o.apply(this, a); }; });
  await p.evaluate((t) => { document.querySelectorAll('.dropsplash,.modal,.overlay').forEach((e) => e.remove()); const bt = document.querySelector('.nav button[data-v="' + t + '"]'); if (bt) bt.click(); }, t);
  let last = 0;
  for (let s = 10; s <= 90; s += 10) { await p.waitForTimeout(10000); const n = await p.evaluate(() => window.__enc); console.log(t, s + 's', 'encodes so far', n, '(+' + (n - last) + ')'); last = n; }
  await b.close();
})();
