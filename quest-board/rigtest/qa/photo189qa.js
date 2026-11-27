// QA, b7b51b31 (29zz_v189.js: photos are shrunk in a worker). LEAD measured 0 ms of long tasks both ways unthrottled. Here: CPU 4x
// throttled (CDP), a 12 MP camera-size JPEG, phImages (what posting runs) through the worker and then the old page path (__qbV189.off),
// the long tasks while each runs, and how long each takes. Plain build.
//   PORT=<plain build> NODE_PATH=<playwright> node rigtest/qa/photo189qa.js
const pw = require('playwright'); const PORT = process.env.PORT || 8819;
(async () => { const b = await pw.chromium.launch(); const ctx = await b.newContext({ viewport: { width: 390, height: 844 } }); await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
  const p = await ctx.newPage(); await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV189, null, { timeout: 120000 }); await p.waitForTimeout(1500);
  const cdp = await ctx.newCDPSession(p); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  const r = await p.evaluate(async () => { const c = document.createElement('canvas'); c.width = 4032; c.height = 3024; const g = c.getContext('2d'); const im = g.createImageData(4032, 3024); for (let i = 0; i < im.data.length; i += 4) { const v = (i * 2654435761) >>> 24; im.data[i] = v; im.data[i + 1] = (v + 80) & 255; im.data[i + 2] = 255 - v; im.data[i + 3] = 255; } g.putImageData(im, 0, 0);
    const blob = await new Promise((o) => c.toBlob(o, 'image/jpeg', 0.9)); const lt = []; new PerformanceObserver((l) => { for (const e of l.getEntries()) lt.push([Math.round(e.startTime), Math.round(e.duration)]); }).observe({ type: 'longtask' }); await new Promise((o) => setTimeout(o, 300));
    const run = async (off) => { window.__qbV189.off(off); const f = new File([blob], off ? 'b.jpg' : 'a.jpg', { type: 'image/jpeg' }); const n0 = lt.length, t0 = performance.now(); const out = await window.__qbV189.imgs(f, false); const t = Math.round(performance.now() - t0); await new Promise((o) => setTimeout(o, 300)); const L = lt.slice(n0);
      return { ms: t, worker: !off && window.__qbV189.can(), long: L.length, longMs: L.reduce((a, x) => a + x[1], 0), maxLong: Math.max(0, ...L.map((x) => x[1])), out: [out.w, out.h, Math.round(out.full.size / 1024) + ' KB'] }; };
    return { size: Math.round(blob.size / 1024) + ' KB', worker: await run(false), page: await run(true) }; });
  console.log(JSON.stringify(r)); await b.close(); })();
