// How many character frames the game encodes on an idle screen (QA, Cal 11-23 platform check). loft_bridge.js renders a frame on the rig,
// encodes it (canvas.toBlob, WebP) and keeps the URL in an LRU of D.loft.urlCache entries; a screen that keeps encoding while nothing new
// is shown is re-making frames it already had. Counts toBlob calls a second on each screen after it settles, with the cache's limit.
//   BASE=<plain build> SECS=15 node encodes.js
const pw = require('playwright');
const BASE = process.env.BASE, SECS = +(process.env.SECS || 15);
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 }); await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
  await ctx.addInitScript(() => { window.__enc = 0; const tb = HTMLCanvasElement.prototype.toBlob; HTMLCanvasElement.prototype.toBlob = function () { window.__enc++; return tb.apply(this, arguments); }; });
  const p = await ctx.newPage(); await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && QBLoft.data, null, { timeout: 120000 }); await p.waitForTimeout(1500);
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S, A = x.ADDONS; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.cls = 'vanguard'; S.spec = 'berserker'; S.xp = x.cum(60); S.gates = [5, 10, 20, 30, 40, 50];
    S.coins = 500000; S.calm = false; S.tours = { welcome: 1, hideout: 1, train: 1, dq: 1, bty: 1, hall: 1, shop: 1 }; S.areaOn = { board: 1, train: 1, hideout: 1, shop: 1, hall: 1, players: 1, trophy: 1, wheel: 1, away: 1 }; /* a fresh save records its open areas at level 1; without this the Loft and Hall stay locked */
    S.base.slots = Object.keys(A).filter((t) => x.ROOMT[t]).map((t) => ({ t, a: Object.fromEntries((A[t] || []).filter((u) => !(u[3] && u[3].retired)).map((u) => [u[0], 1])), st: 0, pend: 0 })); x.persist(); x.render(); });
  console.log('urlCache limit', await p.evaluate(() => (window.QBLoft && QBLoft.data && QBLoft.data.loft && QBLoft.data.loft.urlCache) || (window.QBDATA && QBDATA.loft && QBDATA.loft.urlCache)));
  const shut = () => p.evaluate(() => { document.querySelectorAll('#layer .modal,.overlay,.dropsplash').forEach((m) => m.remove()); try { if (window.TOUR) TOUR.id = null; } catch (e) {} });
  const measure = async (label) => { if (!/window$/.test(label)) await p.waitForTimeout(6000); await shut(); const a = await p.evaluate(() => window.__enc); await p.waitForTimeout(SECS * 1000); const c = await p.evaluate(() => window.__enc);
    console.log(label.padEnd(28), ((c - a) / SECS).toFixed(1), 'encodes/s', '| view', await p.evaluate(() => document.querySelector('#lfwrap') ? 'inside a building' : (document.querySelector('.nav button[aria-current="page"], .nav button.on') || {}).dataset ? (document.querySelector('.nav button[aria-current="page"], .nav button.on') || {}).dataset.v : '?')); };
  await shut(); await measure('Board'); if (process.env.BOARDONLY) { await measure('Board, 2nd window'); await measure('Board, 3rd window'); await b.close(); return; }
  await p.evaluate(() => document.querySelector('.nav button[data-v="hideout"]').dispatchEvent(new MouseEvent('click', { bubbles: true }))); await measure('Loft street');
  await p.evaluate(() => { const g = document.querySelectorAll('[data-act="bldgo"]')[0]; if (g) g.dispatchEvent(new MouseEvent('click', { bubbles: true })); }); await measure('inside The Loft');
  await p.evaluate(() => { try { window.__qb.roomModal(5); } catch (e) {} }); await measure('Restaurant window');
  await shut(); await p.evaluate(() => document.querySelector('.nav button[data-v="hall"]').dispatchEvent(new MouseEvent('click', { bubbles: true }))); await measure('Town Hall');
  await b.close(); })();
