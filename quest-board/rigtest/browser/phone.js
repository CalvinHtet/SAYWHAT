const { open } = require('./drv.js');
const OUT = process.env.OUT || 'shots'; require('fs').mkdirSync(OUT, { recursive: true });
(async () => {
  const W = +(process.env.W || 360), tag = process.env.TAG || 'p';
  const { b, p, errs } = await open({ width: W, height: 740, mobile: true });
  await p.evaluate(() => { document.querySelectorAll('.dropsplash,.modal,.overlay').forEach((e) => e.remove()); });
  await p.waitForTimeout(500);
  await p.screenshot({ path: `${OUT}/${tag}_board_${W}.png` });
  const nav = await p.evaluate(() => { const bar = document.querySelector('.nav .bar'); const bs = [...bar.querySelectorAll('button')].map((x) => { const r = x.getBoundingClientRect(); return [x.textContent.trim(), Math.round(r.left), Math.round(r.right)]; }); return { sw: bar.scrollWidth, cw: bar.clientWidth, bs }; });
  console.log(JSON.stringify(nav));
  // The Loft tab: room collect bubbles
  await p.evaluate(() => { const t = [...document.querySelectorAll('.nav button')].find((e) => /loft/i.test(e.textContent)); t.click(); });
  await p.waitForTimeout(1500);
  await p.evaluate(() => { const S = window.__qb.x().S; S.base.slots.forEach((r) => (r.pend = 123)); window.__qb.x().render(); });
  await p.waitForTimeout(1500);
  await p.evaluate(() => document.querySelectorAll('.modal,.overlay').forEach((e) => e.remove()));
  await p.waitForTimeout(300);
  await p.screenshot({ path: `${OUT}/${tag}_loft_${W}.png`, fullPage: false });
  const col = await p.evaluate(() => [...document.querySelectorAll('button')].filter((x) => /collect/i.test(x.textContent) || /collect/i.test(x.getAttribute('aria-label') || '')).slice(0, 6).map((x) => { const r = x.getBoundingClientRect(); return [x.className, x.textContent.trim().slice(0, 30), Math.round(r.width), Math.round(r.height)]; }));
  console.log(JSON.stringify(col));
  console.log('errs', errs.slice(0, 3));
  await b.close();
})();
