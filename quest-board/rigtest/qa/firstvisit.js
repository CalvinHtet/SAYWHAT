// A player's very first visit to the web build (QA, Cal 11-23 platform check): a brand-new browser profile (no cache, no service worker),
// phone size, CPU x4, network like ordinary 4G (12 Mbps down, 70 ms), signed in through LEAD's stand-in Firebase, every request off this
// machine refused. Times the first paint and the character creator ready to use, and counts requests and bytes by kind until then and in the
// 15 s after (what keeps loading in the background).
//   BASE=<server of quest-board/ with dist-web> MOCK=<rigtest/lead/mockfirebase.js> node firstvisit.js
const pw = require('playwright'), fs = require('fs');
const BASE = process.env.BASE, MOCK = fs.readFileSync(process.env.MOCK, 'utf8');
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 }); await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
  await ctx.route(/firebase-(app|auth|firestore)-compat\.js/, (r) => r.fulfill({ contentType: 'text/javascript', body: /app-compat/.test(r.request().url()) ? MOCK : '' })); await ctx.route(/\/__\/firebase\/init\.json/, (r) => r.fulfill({ status: 404, body: '' }));
  await ctx.addInitScript(() => { window.__mockUid = 'new1'; window.__mockSignedIn = 1; });
  const p = await ctx.newPage(); p.setDefaultNavigationTimeout(300000); const cdp = await ctx.newCDPSession(p);
  await cdp.send('Network.enable'); await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 70, downloadThroughput: 12e6 / 8, uploadThroughput: 3e6 / 8 }); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  const reqs = [], byId = {}; let phase = 'to creator';
  cdp.on('Network.responseReceived', (e) => { byId[e.requestId] = { url: e.response.url, type: e.type, phase, sw: e.response.fromServiceWorker }; });
  cdp.on('Network.loadingFinished', (e) => { const r = byId[e.requestId]; if (r) { r.bytes = e.encodedDataLength; reqs.push(r); } });
  const t0 = Date.now(); await p.goto(BASE + '/dist-web/index.html', { waitUntil: 'commit' });
  await p.waitForFunction(() => document.querySelector('[data-act="ccnext"]'), null, { timeout: 300000 }); const tCreator = Date.now() - t0;
  const fp = await p.evaluate(() => { const e = performance.getEntriesByName('first-contentful-paint')[0]; return e ? Math.round(e.startTime) : null; });
  phase = 'after'; await p.waitForTimeout(15000);
  const sum = (ph) => { const o = {}; let tot = 0; reqs.filter((r) => r.phase === ph).forEach((r) => { const k = r.type; o[k] = o[k] || [0, 0]; o[k][0]++; o[k][1] += r.bytes || 0; tot += r.bytes || 0; }); const out = Object.fromEntries(Object.entries(o).map(([k, v]) => [k, v[0] + ' req, ' + (v[1] / 1048576).toFixed(2) + ' MB'])); out.total = (tot / 1048576).toFixed(2) + ' MB'; return out; };
  const big = reqs.filter((r) => r.phase === 'to creator').sort((a, c) => (c.bytes || 0) - (a.bytes || 0)).slice(0, 8).map((r) => (r.bytes / 1048576).toFixed(2) + ' MB ' + r.url.split('/').slice(-1)[0].split('?')[0]);
  console.log('first paint', fp, 'ms | creator ready', tCreator, 'ms (new profile, CPU x4, 12 Mbps, 70 ms)');
  console.log('to the creator:', JSON.stringify(sum('to creator')));
  console.log('biggest:', JSON.stringify(big));
  console.log('the 15 s after:', JSON.stringify(sum('after')));
  await b.close(); })();
