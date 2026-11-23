// QA: an existing save's level on v1.30 vs v1.31 (no reset of everyone, Cal 11-23): the same XP, both builds. Prints cum() per level
// and, for XP totals a player could have, the level each build shows. Also a played v1.30 save carried into v1.31 on one origin.
const pw = require('playwright');
(async () => { const b = await pw.chromium.launch(); const out = {};
  for (const [name, base] of [['v130', process.env.A], ['v131', process.env.B]]) { const ctx = await b.newContext(); await ctx.route('**/*', (r) => (r.request().url().startsWith(base) ? r.continue() : r.abort())); const p = await ctx.newPage();
    await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x, null, { timeout: 90000 }); await p.waitForTimeout(800);
    out[name] = await p.evaluate(() => { const x = window.__qb.x(); const cum = {}; [2, 5, 10, 15, 20, 25, 30, 40, 50].forEach((L) => cum[L] = x.cum(L));
      const lv = {}; [500, 1000, 2500, 5000, 10000, 20000, 40000, 80000].forEach((xp) => lv[xp] = x.lvlOf(xp)); return { cum, lv }; });
    await ctx.close(); }
  console.log('cum (XP to reach level)'); for (const L of Object.keys(out.v130.cum)) console.log('  L' + L, out.v130.cum[L], '->', out.v131.cum[L]);
  console.log('level at XP'); for (const xp of Object.keys(out.v130.lv)) console.log('  ' + xp + ' XP', 'L' + out.v130.lv[xp], '->', 'L' + out.v131.lv[xp]);
  await b.close(); })();
