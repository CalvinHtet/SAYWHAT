// QA: an existing save carried from v1.30 into v1.31 (no reset, Cal 11-23). STEP=old on v1.30: a level-30 player (trials 5-30 passed,
// Boutique/Pet Shop floors open, 3,000 coins). STEP=new on v1.31, same origin and profile: level, bar, coins, open tabs, windows that pop.
const pw = require('playwright'); const base = process.env.BASE, DIR = process.env.DIR, STEP = process.env.STEP, OUT = process.env.OUT;
(async () => { const ctx = await pw.chromium.launchPersistentContext(DIR, { viewport: { width: 390, height: 844 } }); await ctx.route('**/*', (r) => (r.request().url().startsWith(base) ? r.continue() : r.abort()));
  const p = ctx.pages()[0] || await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && QBLoft.data, null, { timeout: 90000 }); await p.waitForTimeout(2500);
  const st = () => p.evaluate(() => { const x = window.__qb.x(), S = x.S; return { epoch: S.epoch, xp: S.xp, raw: x.lvlOf(S.xp), eff: x.effLvl(), gates: S.gates, coins: S.coins, nav: [...document.querySelectorAll('.nav button')].filter((b) => b.offsetParent).map((b) => b.dataset.v), mile: S.mile || null,
    windows: [...document.querySelectorAll('#layer .modal')].map((m) => m.innerText.replace(/\s+/g, ' ').slice(0, 90)), bar: ((document.querySelector('.lvbar,.xpbar,[class*=lvl]') || {}).innerText || '').replace(/\s+/g, ' ').slice(0, 60) }; });
  if (STEP === 'old') { await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'OldCal', sex: 'm' }); S.xp = x.cum(30) + 100; S.gates = [5, 10, 20, 30]; S.coins = 3000; S.calm = false; S.areaOn = null; x.persist(); x.render(); });
    await p.waitForTimeout(2000); await p.evaluate(() => document.querySelectorAll('#layer .modal').forEach((m) => m.remove())); await p.waitForTimeout(500); console.log('v1.30', JSON.stringify(await st())); }
  else { for (const t of [1, 8]) { await p.waitForTimeout(t === 1 ? 500 : 7000); console.log('v1.31 +' + t + 's', JSON.stringify(await st())); }
    await p.screenshot({ path: OUT }); }
  console.log('page errors', errs.length, JSON.stringify(errs.slice(0, 2))); await ctx.close(); })();
