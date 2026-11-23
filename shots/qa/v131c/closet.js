// QA: the Walk-in Closet's price on a fresh save and on a level-30 save (Cal 11-23: 600 coins).
const pw = require('playwright'); const base = process.env.BASE;
(async () => { const b = await pw.chromium.launch(); const ctx = await b.newContext(); await ctx.route('**/*', (r) => (r.request().url().startsWith(base) ? r.continue() : r.abort())); const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x, null, { timeout: 90000 }); await p.waitForTimeout(800);
  for (const L of [1, 30]) console.log('level', L, await p.evaluate((L) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(L); x.render(); const a = x.ADDONS.bedroom.find((u) => u[0] === 'bd_ward2'); const i = x.ADDONS.bedroom.findIndex((u) => u[0] === 'bd_ward2'); return JSON.stringify({ name: a[1], price: a[2], fixed: (a[3] || {}).fixed, index: i, after: (x.ADDONS.bedroom[i - 1] || [])[0] }); }, L));
  console.log('errors', errs.length); await b.close(); })();
