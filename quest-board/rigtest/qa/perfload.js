// W1 load timing (Cal, 2026-11-10: "Run a stress test on the performance of this platform. Is there anywhere we can improve
// runtime or load time?"). Opens the build at phone size with the CPU slowed (4x by default) and a DevTools network profile, cold
// (a fresh profile: empty cache, no service worker) and warm (the same profile reloaded once the service worker holds the files),
// RUNS times each, and prints every run plus the median as JSON lines.
//   NET=fast4g|slow4g|none MODE=cold|warm|both RUNS=3 CPU=4 SEED=<localStorage json> TRACE=<file> BASE=http://127.0.0.1:8810
//   bash tools/windows/node.sh rigtest/qa/perfload.js
// Per run: requests and bytes over the wire (and how many came from the service worker), first paint, first contentful paint,
// the loading bar gone (__qbLoad.ready), the first draw of the Board (the Board's nav button on) or of the character creator,
// "responds" (the end of the last long task before 5 s with none, the TTI idea without the network rule), long tasks
// (count, total, worst, total blocking time after first contentful paint), JS heap and DOM nodes at the end.
// TRACE=<file> also records a Chrome trace of the first cold run and sums script compile, parse and run per file.
const fs = require('fs'), path = require('path');
const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8810', NET = process.env.NET || 'fast4g', MODE = process.env.MODE || 'both';
const RUNS = +process.env.RUNS || 3, CPU = +(process.env.CPU || 4), SEED = process.env.SEED ? JSON.parse(fs.readFileSync(process.env.SEED, 'utf8')) : null;
const TRACE = process.env.TRACE || '', QUIET = 5000, MAXWAIT = +process.env.MAXWAIT || 240000;
// Chrome DevTools presets (throughput in bytes per second, latency in ms)
const NETS = { none: null,
  fast4g: { offline: false, latency: 165, downloadThroughput: 9e6 / 8 * 0.9, uploadThroughput: 1.5e6 / 8 * 0.9 },
  slow4g: { offline: false, latency: 562.5, downloadThroughput: 1.6e6 / 8 * 0.9, uploadThroughput: 750e3 / 8 * 0.9 } };
const HOOK = `(function(){var P=window.__qaP={lt:[],paint:{},marks:{},lcp:0};
try{new PerformanceObserver(function(l){l.getEntries().forEach(function(e){P.lt.push([Math.round(e.startTime),Math.round(e.duration)])})}).observe({type:'longtask',buffered:true})}catch(e){}
try{new PerformanceObserver(function(l){l.getEntries().forEach(function(e){P.paint[e.name]=Math.round(e.startTime)})}).observe({type:'paint',buffered:true})}catch(e){}
try{new PerformanceObserver(function(l){var es=l.getEntries();P.lcp=Math.round(es[es.length-1].startTime)}).observe({type:'largest-contentful-paint',buffered:true})}catch(e){}
var mark=function(k){if(P.marks[k])return;P.marks[k]=Math.round(performance.now());requestAnimationFrame(function(){setTimeout(function(){P.marks[k+'Paint']=Math.round(performance.now())},0)})};
var chk=function(){if(document.querySelector('.nav button[data-v="board"].on'))mark('board');if(document.querySelector('#app .nav'))mark('nav');
  var a=document.getElementById('app');if(a&&!P.marks.creator&&!document.querySelector('#app .nav')&&a.querySelector('canvas,input,button')&&!a.querySelector('.boot'))mark('creator');
  if(P.marks.board&&P.marks.nav)mo.disconnect()};
var mo=new MutationObserver(chk);mo.observe(document,{childList:true,subtree:true});})();`;
const med = (a) => { const b = a.filter((x) => x != null && !isNaN(x)).sort((x, y) => x - y); return b.length ? b[Math.floor((b.length - 1) / 2)] : null; };

async function oneRun(br, pg, kind, label, traceFile) {
  const reqs = new Map(); let bytes = 0, fromSW = 0, fromCache = 0, n = 0;
  const offs = [];
  const add = (m, f) => offs.push(pg.on(m, f));
  add('Network.requestWillBeSent', (p) => { reqs.set(p.requestId, { url: p.request.url, t0: p.timestamp }); n++; });
  add('Network.responseReceived', (p) => { const r = reqs.get(p.requestId); if (!r) return; r.sw = p.response.fromServiceWorker; r.dc = p.response.fromDiskCache; r.status = p.response.status; if (r.sw) fromSW++; if (r.dc) fromCache++; });
  add('Network.loadingFinished', (p) => { const r = reqs.get(p.requestId); if (!r) return; r.bytes = p.encodedDataLength; r.t1 = p.timestamp; bytes += p.encodedDataLength; });
  let traceDone = null, traceChunks = [];
  if (traceFile) {
    add('Tracing.dataCollected', (p) => { traceChunks.push(...p.value); });
    traceDone = new Promise((ok) => add('Tracing.tracingComplete', ok));
    await pg.s('Tracing.start', { transferMode: 'ReportEvents', traceConfig: { recordMode: 'recordContinuously',
      includedCategories: ['devtools.timeline', 'v8', 'v8.execute', 'disabled-by-default-devtools.timeline', 'disabled-by-default-v8.compile', 'blink.user_timing', 'loading', 'toplevel'] } });
  }
  const t0 = Date.now();
  await pg.go(BASE + '/', false);
  // wait for the first draw, then for QUIET ms with no long task (MAXWAIT at most)
  let res = null;
  for (;;) {
    await sleep(500);
    let st; try { st = await pg.ev('JSON.stringify({m:window.__qaP&&__qaP.marks,lt:window.__qaP&&__qaP.lt,now:performance.now(),ld:window.__qbLoad||null})'); } catch (e) { continue; }
    st = JSON.parse(st); if (!st.m) continue;
    const first = st.m.board || st.m.creator;
    if (first) { const lastLt = st.lt.length ? Math.max(...st.lt.map((x) => x[0] + x[1])) : first; if (st.now - Math.max(first, lastLt) > QUIET) break; }
    if (Date.now() - t0 > MAXWAIT) { res = { timeout: true }; break; }
  }
  const P = JSON.parse(await pg.ev(`JSON.stringify({P:__qaP,ld:window.__qbLoad||null,nav:performance.getEntriesByType('navigation').map(function(e){return {dcl:Math.round(e.domContentLoadedEventEnd),load:Math.round(e.loadEventEnd),ttfb:Math.round(e.responseStart)}})[0],
    heap:performance.memory?Math.round(performance.memory.usedJSHeapSize/1048576):null,nodes:document.getElementsByTagName('*').length,sw:!!(navigator.serviceWorker&&navigator.serviceWorker.controller)})`));
  if (traceFile) { await pg.s('Tracing.end'); await traceDone; fs.writeFileSync(traceFile, JSON.stringify({ traceEvents: traceChunks })); }
  offs.forEach((off) => off());
  const m = P.P.marks, first = m.board || m.creator, fcp = P.P.paint['first-contentful-paint'];
  const lt = P.P.lt; const lastBefore = (() => { let end = first; for (const [s, d] of lt.sort((a, b) => a[0] - b[0])) { if (s > end + QUIET) break; end = Math.max(end, s + d); } return end; })();
  const tbt = lt.filter(([s]) => s >= (fcp || 0) && s <= lastBefore).reduce((a, [, d]) => a + Math.max(0, d - 50), 0);
  const list = [...reqs.values()];
  const big = list.filter((r) => r.bytes > 100000).sort((a, b) => b.bytes - a.bytes).slice(0, 6).map((r) => r.url.replace(BASE, '').replace(/\?h=.*/, '') + ' ' + (r.bytes / 1048576).toFixed(2) + 'MB' + (r.sw ? ' sw' : '') + (r.dc ? ' cache' : ''));
  return Object.assign({ kind, net: NET, cpu: CPU, label, timeout: !!(res && res.timeout),
    requests: list.length, wireMB: +(bytes / 1048576).toFixed(2), fromSW, fromCache,
    ttfb: P.nav && P.nav.ttfb, fp: P.P.paint['first-paint'], fcp, lcp: P.P.lcp, dcl: P.nav && P.nav.dcl, load: P.nav && P.nav.load,
    scriptsReady: P.ld && P.ld.ready ? Math.round(P.ld.ready) : null, board: m.board || null, boardPaint: m.boardPaint || null, creator: m.creator || null,
    responds: lastBefore, longTasks: lt.length, longTotal: lt.reduce((a, [, d]) => a + d, 0), longWorst: lt.reduce((a, [, d]) => Math.max(a, d), 0), tbt,
    heapMB: P.heap, nodes: P.nodes, swControls: P.sw, big });
}

async function throttle(pg) { if (CPU > 1) await pg.s("Emulation.setCPUThrottlingRate", { rate: CPU }); if (NETS[NET]) await pg.s("Network.emulateNetworkConditions", NETS[NET]); }
async function setup(br, fresh, slow = true, ctx) {
  const pg = await br.page({ fresh, ctx });
  await pg.s('Network.enable', { maxTotalBufferSize: 200e6 });
  await pg.s('Page.addScriptToEvaluateOnNewDocument', { source: HOOK });
  if (process.env.STUBBLOBS) { // what-if: blobs.js answered at once with an empty picture list, as if it were off the critical path
    pg.on('Fetch.requestPaused', (p) => pg.s('Fetch.fulfillRequest', { requestId: p.requestId, responseCode: 200, responseHeaders: [{ name: 'Content-Type', value: 'text/javascript' }], body: Buffer.from('window.__B=[];').toString('base64') }).catch(() => {}));
    await pg.s('Fetch.enable', { patterns: [{ urlPattern: '*blobs.js*' }] });
  }
  if (SEED && !ctx) { // a saved game in this profile before the app's first load (the tiny version.json page sets the origin)
    await pg.go(BASE + '/version.json');
    await pg.ev(`(function(d){localStorage.clear();Object.keys(d).forEach(function(k){localStorage.setItem(k,d[k])});return localStorage.length})(${JSON.stringify(SEED)})`);
  }
  if (slow) await throttle(pg);
  return pg;
}
// the service worker fetches for the page once it controls it; throttle its network too
async function throttleWorkers(br, ctxId) {
  const { targetInfos } = await br.send('Target.getTargets');
  for (const t of targetInfos) if (t.type === 'service_worker' && (!ctxId || t.browserContextId === ctxId)) {
    try { const { sessionId } = await br.send('Target.attachToTarget', { targetId: t.targetId, flatten: true });
      await br.send('Network.enable', {}, sessionId); if (NETS[NET]) await br.send('Network.emulateNetworkConditions', NETS[NET], sessionId); } catch (e) {}
  }
}

(async () => {
  const br = await browser(); const out = [];
  const print = (r) => { out.push(r); console.log(JSON.stringify(r)); };
  if (MODE === 'cold' || MODE === 'both') {
    for (let i = 0; i < RUNS; i++) {
      const pg = await setup(br, true);
      print(await oneRun(br, pg, 'cold', SEED ? 'seeded' : 'new', i === 0 && TRACE ? TRACE : ''));
      if (pg.errs.length) console.log('  page errors: ' + pg.errs.slice(0, 3).join(' | '));
      await pg.close();
    }
  }
  if (MODE === 'warm' || MODE === 'both') {
    for (let i = 0; i < RUNS; i++) {
      const pg = await setup(br, true, false);
      await oneRun(br, pg, "prime", "", ""); // first visit installs the service worker and fills its copy
      if (process.env.SW !== "0") { // the sandbox build never registers sw.js (web.js returns before it), so do what a Live build does
        await pg.ev("navigator.serviceWorker.register('sw.js').then(function(){return navigator.serviceWorker.ready}).then(function(){return 1})");
        await sleep(1500); await oneRun(br, pg, "prime", "", ""); // under the worker: it copies every file it serves
      }
      // the app opened again later: a new tab in the same profile (disk cache, worker and save kept, the tab's memory cache gone)
      await sleep(3000); const ctx = pg.browserContextId; pg.keepCtx = true; await pg.close();
      const p2 = await setup(br, false, true, ctx); await throttleWorkers(br, ctx);
      print(await oneRun(br, p2, 'warm', (SEED ? 'seeded' : 'new') + (process.env.SW !== '0' ? '+sw' : ''), i === 0 && process.env.TRACE_WARM ? process.env.TRACE_WARM : ''));
      if (p2.errs.length) console.log('  page errors: ' + p2.errs.slice(0, 3).join(' | '));
      await p2.close(); try { await br.send('Target.disposeBrowserContext', { browserContextId: ctx }); } catch (e) {}
    }
  }
  for (const kind of ['cold', 'warm']) {
    const rs = out.filter((r) => r.kind === kind); if (!rs.length) continue;
    const keys = ['requests', 'wireMB', 'fromSW', 'ttfb', 'fp', 'fcp', 'lcp', 'dcl', 'load', 'scriptsReady', 'board', 'boardPaint', 'creator', 'responds', 'longTasks', 'longTotal', 'longWorst', 'tbt', 'heapMB', 'nodes'];
    const m = { kind: kind + '-median', net: NET, cpu: CPU, runs: rs.length }; keys.forEach((k) => (m[k] = med(rs.map((r) => r[k])))); print(m);
  }
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
