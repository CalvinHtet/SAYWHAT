// QA: the carried level-30 save (it opened v1.31). STEP=pay on v1.31: gain XP to v1.31's level 16 (a level it already had) and see
// whether level pay or a level-up window comes; STEP=back on the rollback build (v1.30 code, APPV 132): level, XP, coins, errors.
const pw = require('playwright'); const base = process.env.BASE, DIR = process.env.DIR, STEP = process.env.STEP;
(async () => { const ctx = await pw.chromium.launchPersistentContext(DIR, { viewport: { width: 390, height: 844 } }); await ctx.route('**/*', (r) => (r.request().url().startsWith(base) ? r.continue() : r.abort()));
  const p = ctx.pages()[0] || await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && QBLoft.data, null, { timeout: 90000 }); await p.waitForTimeout(2500);
  const st = (l) => p.evaluate((l) => { const x = window.__qb.x(), S = x.S; return l + ' ' + JSON.stringify({ xp: S.xp, lvl: x.effLvl(), coins: S.coins, lvPaid: S.lvPaid, mile: S.mile || null, windows: [...document.querySelectorAll('#layer .modal')].map((m) => m.innerText.replace(/\s+/g, ' ').slice(0, 60)) }); }, l);
  console.log(await st('loaded'));
  if (STEP === 'pay') { await p.evaluate(() => document.querySelectorAll('#layer .modal').forEach((m) => m.remove()));
    // a real quest tick: add a quest worth enough XP to cross into level 16 on this curve, then tick it
    const r = await p.evaluate(() => { const x = window.__qb.x(), S = x.S; const want = x.cum(16) - S.xp + 5; S.xp += want; x.persist(); x.render(); return want; });
    await p.waitForTimeout(2500); console.log('added', r, 'XP'); console.log(await st('after reaching 16')); }
  console.log('page errors', errs.length, JSON.stringify(errs.slice(0, 2))); await ctx.close(); })();
