// QA: the take-three curve's pace: need(L) at key levels and the XP a day implied by LEAD's day-30 figures (daily 44, heavy 66).
const pw = require('playwright'); const base = process.env.BASE;
(async () => { const b = await pw.chromium.launch(); const ctx = await b.newContext(); await ctx.route('**/*', (r) => (r.request().url().startsWith(base) ? r.continue() : r.abort())); const p = await ctx.newPage();
  await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x, null, { timeout: 90000 });
  const r = await p.evaluate(() => { const x = window.__qb.x(); const n = {}; [1, 5, 7, 10, 14, 20, 30, 40, 44, 50, 60, 66, 70, 80, 90, 99].forEach((L) => n[L] = x.need(L)); return { need: n, cum7: x.cum(7), cum14: x.cum(14), cum44: x.cum(44), cum66: x.cum(66) }; });
  console.log('need', JSON.stringify(r.need)); const daily = r.cum44 / 30, heavy = r.cum66 / 30;
  console.log('cum(7)', r.cum7, 'cum(14)', r.cum14, '| daily ~', Math.round(daily), 'XP/day (cum44/30), heavy ~', Math.round(heavy), 'XP/day (cum66/30)');
  for (const L of [60, 70, 80, 90, 99]) console.log('  level', L, 'needs', r.need[L], '=', (r.need[L] / heavy).toFixed(1), 'heavy days,', (r.need[L] / daily).toFixed(1), 'daily days');
  await b.close(); })();
