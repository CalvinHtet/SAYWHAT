const pw = require('playwright'); const base = process.env.BASE, DIR = process.env.DIR;
(async () => { const ctx = await pw.chromium.launchPersistentContext(DIR, { viewport: { width: 390, height: 844 } }); await ctx.route('**/*', (r) => (r.request().url().startsWith(base) ? r.continue() : r.abort()));
  const p = ctx.pages()[0] || await ctx.newPage(); await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x, null, { timeout: 90000 }); await p.waitForTimeout(2500);
  const st = () => p.evaluate(() => { const x = window.__qb.x(), S = x.S; return { raw: x.lvlOf(S.xp), lvPaid: S.lvPaid, coins: S.coins }; }); console.log('before', JSON.stringify(await st()));
  // a real quest worth enough XP to cross into the next level, ticked through the game's toggle
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S; document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); const need = x.cum(x.lvlOf(S.xp) + 1) - S.xp + 5; S.quests.unshift({ id: 'qa1', name: 'QA big task', xp: need, stat: 'discipline', cl: 'admin', rep: 'once' }); x.render(); x.toggle('qa1'); });
  await p.waitForTimeout(2500); const w = await p.evaluate(() => [...document.querySelectorAll('#layer .modal')].map((m) => m.innerText.replace(/\s+/g, ' ').slice(0, 160)));
  console.log('windows', JSON.stringify(w)); console.log('after', JSON.stringify(await st())); await ctx.close(); })();
