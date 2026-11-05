// W=390 node perf.js [tab ...] -> per tab: frame rate over 6s at 4x CPU slowdown, long tasks, DOM size; screenshot of The Loft
const OUT = process.env.OUT || 'shots'; require('fs').mkdirSync(OUT, { recursive: true });
const { open } = require('./drv.js');
(async () => {
  const W = +(process.env.W || 390), H = +(process.env.H || 844), slow = +(process.env.SLOW || 4);
  const { b, p, errs } = await open({ width: W, height: H, mobile: true });
  const cdp = await p.context().newCDPSession(p);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: slow });
  const tabs = process.argv.slice(2).length ? process.argv.slice(2) : ['board', 'hideout', 'shop', 'train', 'hall', 'trophy', 'wheel', 'away'];
  for (const t of tabs) {
    await p.evaluate((t) => { document.querySelectorAll('.dropsplash,.modal,.overlay').forEach((e) => e.remove()); if (t.startsWith('room:')) { const bt = document.querySelector('.nav button[data-v="hideout"]'); if (bt) bt.click(); setTimeout(() => window.__qb.roomModal(window.__order.indexOf(t.slice(5))), 1500); return; } const bt = document.querySelector('.nav button[data-v="' + t + '"]'); if (bt) bt.click(); }, t);
    await p.waitForTimeout(4000);
    if (!t.startsWith('room:')) await p.evaluate(() => document.querySelectorAll('.dropsplash,.modal,.overlay').forEach((e) => e.remove()));
    const r = await p.evaluate(() => new Promise((ok) => {
      const ts = []; let long = 0, longMs = 0;
      const po = new PerformanceObserver((l) => l.getEntries().forEach((e) => { long++; longMs += e.duration; })); try { po.observe({ entryTypes: ['longtask'] }); } catch (e) {}
      const t0 = performance.now();
      const f = (t) => { ts.push(t); if (t - t0 < 6000) requestAnimationFrame(f); else { po.disconnect(); const d = ts.slice(1).map((v, i) => v - ts[i]); d.sort((a, b) => a - b);
        ok({ fps: +(ts.length / 6).toFixed(1), p50: +d[Math.floor(d.length * .5)].toFixed(0), p95: +d[Math.floor(d.length * .95)].toFixed(0), long, longMs: Math.round(longMs), nodes: document.getElementsByTagName('*').length, svgImgs: document.querySelectorAll('svg image').length }); } };
      requestAnimationFrame(f);
    }));
    console.log(t, JSON.stringify(r));
    if (t === 'hideout') await p.screenshot({ path: `${OUT}/loft_${W}.png` });
  }
  console.log('errs', errs.filter((e) => !/TUNNEL/.test(e)).slice(0, 4));
  await b.close();
})();
