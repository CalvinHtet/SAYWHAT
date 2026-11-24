// Cold start (QA, Cal 11-23 platform check): a fresh browser (no cache), phone size, CPU x4, network like ordinary 4G (12 Mbps down, 70 ms),
// every request off this machine refused. Times the first paint, the Board drawn (a created save is put in place before the first visit),
// and counts requests and bytes by kind up to then, and in the 10 s after (what keeps loading in the background).
//   BASE=<plain build> node coldload.js    or   WEB=1 BASE=<server of quest-board/ with dist-web> MOCK=<rigtest/lead/mockfirebase.js> node coldload.js
//   (the web build players get, signed in through LEAD's stand-in Firebase; the save is made in the creator on the first visit)
const pw = require('playwright'), fs = require('fs'); const WEB = !!process.env.WEB;
const BASE = process.env.BASE;
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 }); await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
  /* a created level-20 save in place before the page starts (the plain build keeps it in localStorage) */
  await ctx.addInitScript(() => { try { if (!localStorage.getItem('qa-seeded')) { localStorage.setItem('qa-seeded', '1'); window.__qaSeed = 1; } } catch (e) {} });
  if (WEB) { const MOCK = fs.readFileSync(process.env.MOCK, 'utf8'); await ctx.route(/firebase-(app|auth|firestore)-compat\.js/, (r) => r.fulfill({ contentType: 'text/javascript', body: /app-compat/.test(r.request().url()) ? MOCK : '' })); await ctx.route(/\/__\/firebase\/init\.json/, (r) => r.fulfill({ status: 404, body: '' }));
    await ctx.addInitScript(() => { window.__mockUid = 'cal1'; window.__mockSignedIn = 1; }); }
  const p = await ctx.newPage(); p.setDefaultNavigationTimeout(300000); const cdp = await ctx.newCDPSession(p);
  await cdp.send('Network.enable'); await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 70, downloadThroughput: 12e6 / 8, uploadThroughput: 3e6 / 8 }); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  const reqs = []; const byId = {}; let phase = 'start';
  cdp.on('Network.responseReceived', (e) => { byId[e.requestId] = { url: e.response.url, type: e.type, phase }; });
  cdp.on('Network.loadingFinished', (e) => { const r = byId[e.requestId]; if (r) { r.bytes = e.encodedDataLength; reqs.push(r); } });
  /* first visit makes the save; the measured visit is a reload with an empty cache */
  if (WEB) { await p.goto(BASE + '/dist-web/index.html'); await p.waitForFunction(() => document.querySelector('[data-act="ccnext"]'), null, { timeout: 300000 }); await p.fill('#ccname', 'Cal'); await p.click('[data-act="ccnext"]');
    await p.waitForFunction(() => document.querySelector('[data-act="ccdone"]'), null, { timeout: 120000 }); await p.waitForTimeout(800); await p.click('[data-act="ccdone"]'); await p.waitForTimeout(6000); }
  else { await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x, null, { timeout: 300000 });
    await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.cls = 'vanguard'; S.xp = x.cum(20); S.gates = [5, 10, 20]; S.tours = { welcome: 1, hideout: 1, train: 1, dq: 1, bty: 1 }; S.calm = false; x.persist(); }); }
  await cdp.send('Network.clearBrowserCache'); reqs.length = 0; phase = 'to board';
  const t0 = Date.now(); await p.reload(); let fp = null;
  await p.waitForFunction(() => document.querySelector('.nav button[data-v="board"]') && document.body.innerText.length > 200, null, { timeout: 300000 }); const tBoard = Date.now() - t0;
  try { fp = await p.evaluate(() => { const e = performance.getEntriesByName('first-contentful-paint')[0]; return e ? Math.round(e.startTime) : null; }); } catch (e) {}
  phase = 'after'; await p.waitForTimeout(10000);
  const sum = (ph) => { const o = {}; reqs.filter((r) => r.phase === ph).forEach((r) => { const k = r.type; o[k] = o[k] || [0, 0]; o[k][0]++; o[k][1] += r.bytes || 0; }); return Object.fromEntries(Object.entries(o).map(([k, v]) => [k, v[0] + ' req, ' + (v[1] / 1048576).toFixed(2) + ' MB'])); };
  const big = reqs.filter((r) => r.phase === 'to board').sort((a, c) => (c.bytes || 0) - (a.bytes || 0)).slice(0, 8).map((r) => (r.bytes / 1048576).toFixed(2) + ' MB ' + r.url.split('/').slice(-1)[0].split('?')[0]);
  console.log('first contentful paint', fp, 'ms | Board drawn', tBoard, 'ms (CPU x4, 12 Mbps, 70 ms)');
  console.log('to the Board:', JSON.stringify(sum('to board')));
  console.log('biggest before the Board:', JSON.stringify(big));
  console.log('the 10 s after:', JSON.stringify(sum('after')));
  await b.close(); })();
