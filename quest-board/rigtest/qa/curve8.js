// QA, v1.45 (ea0657be, 29zzz_econ.js xpc8): a save made on curve 7 opens on curve 8 at the same level and the same share of the way
// to the next. Saves at levels 30, 40, 41, 45, 60, 80 and 99, each 37% of the way into its level on curve 7 (written with curve 7's
// own table, which must match v1.43's: cum(60) 28,640, cum(80) 65,178, cum(100) 129,313), no xpc8, then a reload; then a second reload
// (nothing may move twice). Also: a new save carries xpc8 from the start; the weekly goal's start (S.wkg.x0) moves with the XP.
//   BASE=<plain build> node curve8.js
const pw = require('playwright');
const BASE = process.env.BASE; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await pw.chromium.launch(); const ctx = await b.newContext({ viewport: { width: 390, height: 844 } }); await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 200)));
  const boot = async () => { await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbC8, null, { timeout: 120000 }); await p.waitForTimeout(1200); };
  await p.goto(BASE + '/dist/index.html'); await boot();
  const t7 = await p.evaluate(() => [60, 80, 100].map((l) => window.__qbC8.cum7(l))); ok(t7.join() === '28640,65178,129313', 'curve 7 as frozen here matches v1.43 (cum 60/80/100: ' + t7.join(', ') + ')');
  ok(await p.evaluate(() => { const x = window.__qb.x(); for (let l = 1; l <= 40; l++) if (x.cum(l) !== window.__qbC8.cum7(l)) return false; return true; }), 'levels 1-40: curve 7 and curve 8 are the same numbers');
  ok(await p.evaluate(() => window.__qb.x().S.xpc8 === 1), 'a new save carries xpc8 from the start');
  for (const L of [30, 40, 41, 45, 60, 80, 99]) {
    const set = await p.evaluate((L) => { const x = window.__qb.x(), S = x.S, c7 = window.__qbC8.cum7; S.created = true; S.char = window.__qb.fixChar({ name: 'C', sex: 'm' }); S.cls = 'vanguard'; S.tutDone = 1; S.calm = false;
      S.xp = Math.round(c7(L) + 0.37 * (c7(L + 1) - c7(L))); S.wkg = { x0: S.xp - 500 }; delete S.xpc8; S.gates = [5, 10, 20, 30, 40, 50, 60, 70, 80].filter((g) => g <= L); x.persist(); return { xp: S.xp, x0: S.wkg.x0 }; }, L);
    await p.waitForTimeout(900); await p.reload(); await boot();
    const a = await p.evaluate(() => { const x = window.__qb.x(), S = x.S, L = x.lvlOf(S.xp); return { xp: S.xp, L, fr: +((S.xp - x.cum(L)) / (x.cum(L + 1) - x.cum(L))).toFixed(3), c8: S.xpc8, x0: S.wkg && S.wkg.x0 }; });
    await p.waitForTimeout(900); await p.reload(); await boot(); const a2 = await p.evaluate(() => window.__qb.x().S.xp);
    ok(a.L === L && Math.abs(a.fr - 0.37) < 0.01 && a.c8 === 1 && a2 === a.xp && (L <= 40 ? a.xp === set.xp : true) && a.xp - a.x0 === 500,
      'level ' + L + ': XP ' + set.xp + ' -> ' + a.xp + ' (level ' + a.L + ', ' + Math.round(a.fr * 100) + '% in, xpc8 ' + a.c8 + '), a second reload keeps ' + a2 + ', weekly start moved with it (' + (a.xp - a.x0) + ' behind)'); }
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
