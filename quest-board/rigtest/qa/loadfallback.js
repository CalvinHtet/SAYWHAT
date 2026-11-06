// The loading bar's fallback (LEAD's 4b72f95): every fetch() aborted, script tags still allowed; the game must start with plain tags
// and the bar must go.   WAIT=<ms> node loadfallback.js <server>
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  let aborted = 0; await p.route('**/*', (r) => { if (r.request().resourceType() === 'fetch') { aborted++; return r.abort(); } return r.continue(); });
  const t0 = Date.now(); await p.goto(process.argv[2] + '/dist/index.html');
  await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && document.querySelector('#app').children.length, null, { timeout: 120000 });
  await p.waitForTimeout(+(process.env.WAIT || 0)); const st = await p.evaluate(() => ({ bar: !!document.getElementById('qbload'), barText: (document.getElementById('qbloadtx') || {}).textContent || '', tags: [...document.scripts].filter((s) => s.src).length, art: !!window.QBART }));
  console.log('fetch aborted', aborted, 'ready', ((Date.now() - t0) / 1000).toFixed(1), 's', JSON.stringify(st), 'page errors', errs.length, errs.slice(0, 2));
  await b.close();
})();
