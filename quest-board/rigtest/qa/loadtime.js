// First-load time as a phone sees it: a fresh browser (no cache), the network and CPU throttled through the DevTools protocol,
// the page opened, and the time measured until the game is ready (the app started and drew its first screen: for a new player
// that is the character screen). Reports the bytes each
// script brought, DOMContentLoaded, ready, and the JS heap. Runs RUNS times and prints the median.
//   BASE=<server> MBPS=9 RTT=85 CPU=4 RUNS=3 node loadtime.js        (MBPS=0: no network throttle)
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:8769', MBPS = +(process.env.MBPS || 9), RTT = +(process.env.RTT || 85), CPU = +(process.env.CPU || 4), RUNS = +(process.env.RUNS || 3);
const med = (a) => a.slice().sort((x, y) => x - y)[Math.floor(a.length / 2)];
(async () => {
  const res = [];
  for (let r = 0; r < RUNS; r++) {
    const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const p = await ctx.newPage(), cdp = await ctx.newCDPSession(p);
    await cdp.send('Network.enable'); await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
    if (MBPS) await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: RTT, downloadThroughput: MBPS * 1e6 / 8, uploadThroughput: 1.5e6 / 8 });
    if (CPU > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU });
    const bytes = {}; cdp.on('Network.loadingFinished', (e) => { bytes[e.requestId] = e.encodedDataLength; });
    const urls = {}; cdp.on('Network.responseReceived', (e) => { urls[e.requestId] = e.response.url; });
    const t0 = Date.now();
    await p.goto(BASE + '/dist/index.html', { waitUntil: 'domcontentloaded', timeout: 600000 });
    const dcl = Date.now() - t0;
    await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && document.querySelector('#app') && document.querySelector('#app').children.length, null, { timeout: 600000, polling: 100 });
    const ready = Date.now() - t0;
    const heap = await p.evaluate(() => (performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1e6) : null));
    const per = {}; let total = 0;
    Object.keys(bytes).forEach((k) => { const u = (urls[k] || '').split('/').pop().split('?')[0] || '?'; per[u] = (per[u] || 0) + bytes[k]; total += bytes[k]; });
    res.push({ dcl, ready, heap, total, per });
    await b.close();
  }
  const r0 = res[0], top = Object.entries(r0.per).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([k, v]) => k + ' ' + (v / 1e6).toFixed(1) + ' MB').join(', ');
  console.log(`${BASE} network ${MBPS ? MBPS + ' Mbps, ' + RTT + ' ms' : 'unthrottled'}, CPU x${CPU}, ${RUNS} runs: DOMContentLoaded median ${(med(res.map((x) => x.dcl)) / 1000).toFixed(1)} s, ready median ${(med(res.map((x) => x.ready)) / 1000).toFixed(1)} s (runs ${res.map((x) => (x.ready / 1000).toFixed(1)).join(', ')}), ${(r0.total / 1e6).toFixed(1)} MB in all, heap ${r0.heap} MB; largest: ${top}`);
})();
