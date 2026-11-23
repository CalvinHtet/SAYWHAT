// Curve 6 take two (Cal 11-23: "Slightly slower curve. Just slightly"): a save made on v1.30 (curve 5) opens at the same level and the same
// share of the way to the next, its XP moved once (xpc6); the Weekly Warrior start moves with it; a save that opened v1.31's first ship
// (milestones since 15 at a real level 30) gets since 30 and no stale offers; a new save is on curve 6 with nothing moved; reload keeps it.
//   PORT=<plain build> NODE_PATH=<playwright's parent> node rigtest/lead/curve6.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8779; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
const n5 = (L) => Math.round(L < 6 ? 20 + 115 * (L - 1) / 5 : 135 + .315 * Math.pow(L - 6, 2) + (L > 40 ? .2 * Math.pow(L - 40, 2) : 0)); const c5 = (L) => { let s = 0; for (let i = 1; i < L; i++) s += n5(i); return s; };
(async () => { const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 390, height: 844 } }); const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  const U = 'http://127.0.0.1:' + PORT + '/dist/index.html';
  await p.goto(U); await p.waitForFunction(() => window.__qb && window.__qb.x, null, { timeout: 90000 }); await p.waitForTimeout(800);
  const fresh = await p.evaluate(() => ({ xpc6: window.__qb.x().S.xpc6, c30: window.__qb.x().cum(30), c31: window.__qb.x().cum(31) }));
  ok(fresh.xpc6 === 1, 'a new save is on curve 6 (xpc6 ' + fresh.xpc6 + '); level 30 at ' + fresh.c30 + ' XP (curve 5: ' + c5(30) + ')');
  for (const [L, frac] of [[30, .4], [8, .9], [55, .1], [1, .5]]) {
    const xp5 = Math.round(c5(L) + frac * (c5(L + 1) - c5(L)));
    await p.evaluate(([xp5, L]) => { const x = window.__qb.x(), S = JSON.parse(JSON.stringify(x.S)); S.created = true; S.char = window.__qb.fixChar({ name: 'Old', sex: 'm' }); S.xp = xp5; delete S.xpc6; S.gates = [5, 10, 20, 30, 40, 50]; S.lvPaid = L; S.wkg = { x0: xp5 - 100, w: 'x' };
      S.mile = { since: 15, o15: ['a', 'b', 'c'] }; S.coins = 1234; localStorage.setItem('quest-board', JSON.stringify(S)); }, [xp5, L]);
    await p.reload(); await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qb.x().S.created, null, { timeout: 90000 }); await p.waitForTimeout(2500);
    const r = await p.evaluate(() => { const x = window.__qb.x(), S = x.S, lv = x.lvlOf ? x.lvlOf(S.xp) : x.effLvl(); x.render(); return { lv, eff: x.effLvl(), xp: S.xp, xpc6: S.xpc6, wk: S.wkg && S.wkg.x0, mile: S.mile, coins: S.coins, frac: (S.xp - x.cum(lv)) / (x.cum(lv + 1) - x.cum(lv)) }; });
    ok(r.lv === L && Math.abs(r.frac - frac) < .05 && r.xpc6 === 1, 'v1.30 save at level ' + L + ' (' + xp5 + ' XP): opens at level ' + r.lv + ', ' + Math.round(r.frac * 100) + '% to the next, ' + r.xp + ' XP');
    ok(r.wk === r.xp - 100, '  the Weekly Warrior start moved with it (' + r.wk + ')');
    ok(r.coins === 1234, '  coins untouched');
    const base = Math.floor(L / 5) * 5; ok(L < 15 ? r.mile.since === 15 || r.mile.since === base : (r.mile.since === base && !r.mile.o15), '  milestones from level ' + r.mile.since + ', stale offer gone ' + JSON.stringify(r.mile));
    await p.reload(); await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qb.x().S.created, null, { timeout: 90000 }); await p.waitForTimeout(1500);
    const r2 = await p.evaluate(() => window.__qb.x().S.xp); ok(r2 === r.xp, '  a second load moves nothing (' + r2 + ')');
  }
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
