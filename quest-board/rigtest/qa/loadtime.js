// First-load time as a phone sees it: a fresh browser (no cache), the network and CPU throttled through the DevTools protocol,
// the page opened, and the time measured until the game is ready (the app started and drew its first screen: for a new player
// that is the character screen). Reports the bytes each
// script brought, DOMContentLoaded, when the loading bar (#qbload, v0.53 on) first shows, ready, the JS heap at ready and its peak
// while loading (sampled every 250 ms), and with SECOND=1 a second visit with the browser cache on. Runs RUNS times, prints the median.
//   BASE=<server> MBPS=9 RTT=85 CPU=4 RUNS=3 SECOND=1 NEWTAB=1 node loadtime.js        (MBPS=0: no network throttle)
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:8769', MBPS = +(process.env.MBPS || 9), RTT = +(process.env.RTT || 85), CPU = +(process.env.CPU || 4), RUNS = +(process.env.RUNS || 3), SECOND = process.env.SECOND === '1';
const med = (a) => a.slice().sort((x, y) => x - y)[Math.floor(a.length / 2)];
(async () => {
  const res = [];
  for (let r = 0; r < RUNS; r++) {
    const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const p = await ctx.newPage(), cdp = await ctx.newCDPSession(p);
    await cdp.send('Network.enable'); await cdp.send('Network.setCacheDisabled', { cacheDisabled: !SECOND });
    if (MBPS) await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: RTT, downloadThroughput: MBPS * 1e6 / 8, uploadThroughput: 1.5e6 / 8 });
    if (CPU > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU });
    const bytes = {}; cdp.on('Network.loadingFinished', (e) => { bytes[e.requestId] = e.encodedDataLength; });
    const urls = {}; cdp.on('Network.responseReceived', (e) => { urls[e.requestId] = e.response.url; });
    let peak = 0, barAt = null, sampling = true; const t0 = Date.now();
    const samp = (async () => { while (sampling) { try { const h = await cdp.send('Runtime.getHeapUsage'); peak = Math.max(peak, h.usedSize); if (barAt === null && await p.$('#qbload')) barAt = Date.now() - t0; } catch (e) {} await new Promise((o) => setTimeout(o, 250)); } })();
    await p.goto(BASE + '/dist/index.html', { waitUntil: 'domcontentloaded', timeout: 600000 });
    const dcl = Date.now() - t0;
    await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && document.querySelector('#app') && document.querySelector('#app').children.length, null, { timeout: 600000, polling: 100 });
    const ready = Date.now() - t0; sampling = false; await samp;
    await p.waitForTimeout(1500); await cdp.send('HeapProfiler.collectGarbage'); const heap = Math.round((await cdp.send('Runtime.getHeapUsage')).usedSize / 1e6); // after a forced GC
    const scriptText = await p.evaluate(() => Math.round([...document.scripts].reduce((a, s) => a + (s.src ? 0 : s.text.length), 0) / 1e6)); // inline script text still in the page (MB of characters)
    let second = null, secondBytes = null; if (SECOND) { const firstIds = new Set(Object.keys(bytes)); const t1 = Date.now(); let q = p; if (process.env.NEWTAB === '1') { await p.close(); q = await ctx.newPage(); const c2 = await ctx.newCDPSession(q); await c2.send('Network.enable'); if (MBPS) await c2.send('Network.emulateNetworkConditions', { offline: false, latency: RTT, downloadThroughput: MBPS * 1e6 / 8, uploadThroughput: 1.5e6 / 8 }); if (CPU > 1) await c2.send('Emulation.setCPUThrottlingRate', { rate: CPU }); c2.on('Network.loadingFinished', (e) => { bytes['2_' + e.requestId] = e.encodedDataLength; }); c2.on('Network.responseReceived', (e) => { urls['2_' + e.requestId] = e.response.url; }); await q.goto(BASE + '/dist/index.html', { waitUntil: 'domcontentloaded', timeout: 600000 }); } else await p.reload({ waitUntil: 'domcontentloaded', timeout: 600000 }); await q.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && document.querySelector('#app') && document.querySelector('#app').children.length, null, { timeout: 600000, polling: 100 }); second = Date.now() - t1; await q.waitForTimeout(500); secondBytes = {}; Object.keys(bytes).filter((k) => !firstIds.has(k)).forEach((k) => { const u = (urls[k] || '').split('/').pop().split('?')[0] || '?'; secondBytes[u] = (secondBytes[u] || 0) + bytes[k]; }); Object.keys(bytes).filter((k) => !firstIds.has(k)).forEach((k) => delete bytes[k]); }
    const per = {}; let total = 0;
    Object.keys(bytes).forEach((k) => { const u = (urls[k] || '').split('/').pop().split('?')[0] || '?'; per[u] = (per[u] || 0) + bytes[k]; total += bytes[k]; });
    res.push({ dcl, ready, heap, total, per, peak: Math.round(peak / 1e6), barAt, second, scriptText, secondBytes });
    await b.close();
  }
  const r0 = res[0], top = Object.entries(r0.per).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([k, v]) => k + ' ' + (v / 1e6).toFixed(1) + ' MB').join(', ');
  console.log(`${BASE} network ${MBPS ? MBPS + ' Mbps, ' + RTT + ' ms' : 'unthrottled'}, CPU x${CPU}, ${RUNS} runs: DOMContentLoaded median ${(med(res.map((x) => x.dcl)) / 1000).toFixed(1)} s, ready median ${(med(res.map((x) => x.ready)) / 1000).toFixed(1)} s (runs ${res.map((x) => (x.ready / 1000).toFixed(1)).join(', ')}), ${(r0.total / 1e6).toFixed(1)} MB in all, heap after GC ${r0.heap} MB, inline script text left in the page ${r0.scriptText} M characters (peak heap while loading ${med(res.map((x) => x.peak))} MB); loading bar shown at ${r0.barAt === null ? 'never' : (med(res.map((x) => x.barAt)) / 1000).toFixed(1) + ' s'}${SECOND ? ', second visit ready ' + (med(res.map((x) => x.second)) / 1000).toFixed(1) + ' s, downloading again ' + Object.entries(r0.secondBytes).filter(([k, v]) => v > 1e5).map(([k, v]) => k + ' ' + (v / 1e6).toFixed(1) + ' MB').join(', ') : ''}; largest: ${top}`);
})();
