// QA: v1.31's xpc6 move (29zzz_econ.js) against v1.30's real curve. (1) CUMT5 (the move's copy of curve 5) vs v1.30's own cum(L) for every
// level. (2) For every level 1..MAXL and shares 0, .01, .5, .99 of the way, a v1.30 save's XP moved as the code does keeps its level on
// v1.31's cum (read from the v1.31 page). Exhaustive by numbers; the page runs are in carry3.js.
const pw = require('playwright');
(async () => { const b = await pw.chromium.launch(); const get = async (base) => { const ctx = await b.newContext(); await ctx.route('**/*', (r) => (r.request().url().startsWith(base) ? r.continue() : r.abort())); const p = await ctx.newPage();
    await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x, null, { timeout: 90000 }); await p.waitForTimeout(500);
    const r = await p.evaluate(() => { const x = window.__qb.x(); const c = []; for (let L = 0; L <= 160; L++) c.push(x.cum(L)); let M = 1; while (x.lvlOf(1e9) > M) M++; return { cum: c, maxl: x.lvlOf(1e9) }; }); await ctx.close(); return r; };
  const A = await get(process.env.A), B = await get(process.env.B);
  console.log('MAXL v1.30', A.maxl, 'v1.31', B.maxl);
  // the move's own curve-5 table, copied from 29zzz_econ.js
  const MAXL = B.maxl; const CUMT5 = [0, 0]; for (let L = 1; L <= MAXL + 50; L++) CUMT5.push(CUMT5[L] + Math.round(L < 6 ? 20 + 115 * (L - 1) / 5 : 135 + .315 * Math.pow(L - 6, 2) + (L > 40 ? .2 * Math.pow(L - 40, 2) : 0)));
  const cum5 = (L) => L <= 1 ? 0 : L < CUMT5.length ? CUMT5[L] : CUMT5[CUMT5.length - 1] + (L - CUMT5.length + 1) * (CUMT5[CUMT5.length - 1] - CUMT5[CUMT5.length - 2]);
  const mism = []; for (let L = 1; L <= Math.min(A.maxl + 1, 160); L++) if (cum5(L) !== A.cum[L]) mism.push([L, cum5(L), A.cum[L]]);
  console.log('cum5 vs v1.30 cum, levels 1..' + (A.maxl + 1) + ':', mism.length ? 'MISMATCH ' + JSON.stringify(mism.slice(0, 8)) : 'identical');
  const cumB = (L) => B.cum[Math.min(L, 160)]; const lvB = (x) => { let L = 1; while (L < 160 && x >= cumB(L + 1)) L++; return L; }; const lvA = (x) => { let L = 1; while (L < 160 && x >= A.cum[L + 1]) L++; return L; };
  let bad = [], n = 0; for (let L = 1; L < A.maxl; L++) for (const s of [0, .01, .5, .99]) { const x = Math.round(A.cum[L] + s * (A.cum[L + 1] - A.cum[L])); const l0 = lvA(x);
    let LL = 1; while (LL < MAXL + 49 && x >= cum5(LL + 1)) LL++; const fr = (x - cum5(LL)) / Math.max(1, cum5(LL + 1) - cum5(LL)); const nx = Math.round(cumB(LL) + fr * (cumB(LL + 1) - cumB(LL))); n++;
    if (lvB(nx) !== l0) bad.push([x, l0, nx, lvB(nx)]); }
  console.log('moved saves checked', n, 'level changed:', bad.length ? JSON.stringify(bad.slice(0, 8)) : 'none');
  console.log('cum v1.30 -> v1.31: L10', A.cum[10], B.cum[10], 'L30', A.cum[30], B.cum[30], 'L50', A.cum[50], B.cum[50], 'L60', A.cum[60], B.cum[60]);
  await b.close(); })();
