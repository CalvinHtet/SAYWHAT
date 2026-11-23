// QA: real saves through the v1.31 cut (9b2c2206), one browser profile per save on one origin. STEP=make on v1.30: a level-30 save
// 40% of the way to 31 with a Town week started (wkg.x0) and 2,500 coins. STEP=look on any build: level, share, XP, coins, flags, the
// Town week's XP, milestones, open windows, errors. Run look twice on v1.31 to see that a second load does not move again.
const pw = require('playwright'); const base = process.env.BASE, DIR = process.env.DIR, STEP = process.env.STEP, L = +(process.env.LVL || 30);
(async () => { const ctx = await pw.chromium.launchPersistentContext(DIR, { viewport: { width: 390, height: 844 } }); await ctx.route('**/*', (r) => (r.request().url().startsWith(base) ? r.continue() : r.abort()));
  const p = ctx.pages()[0] || await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && QBLoft.data, null, { timeout: 90000 }); await p.waitForTimeout(2500);
  if (STEP === 'make') await p.evaluate((L) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'OldCal', sex: 'm' }); S.cls = ''; S.xp = Math.round(x.cum(L) + .4 * (x.cum(L + 1) - x.cum(L))); S.gates = [5, 10, 20, 30, 40, 50].filter((g) => g <= L);
    S.coins = 2500; S.lvPaid = L; S.wkg = { w: 'w1', c0: 0, x0: S.xp - 300 }; S.calm = false; x.persist(); }, L);
  await p.waitForTimeout(1500);
  const r = await p.evaluate(() => { const x = window.__qb.x(), S = x.S, lv = x.effLvl(); return { appv: (document.body.innerText.match(/v1\.\d+/) || [''])[0], xp: S.xp, lvl: lv, share: +((S.xp - x.cum(lv)) / (x.cum(lv + 1) - x.cum(lv))).toFixed(3), coins: S.coins, lvPaid: S.lvPaid,
    xpc5: S.xpc5, xpc6: S.xpc6, townWeekXp: S.wkg ? S.xp - S.wkg.x0 : null, mile: S.mile || null, windows: [...document.querySelectorAll('#layer .modal')].map((m) => m.innerText.replace(/\s+/g, ' ').slice(0, 50)) }; });
  console.log(STEP, JSON.stringify(r)); console.log('page errors', errs.length, JSON.stringify(errs.slice(0, 2))); await ctx.close(); })();
