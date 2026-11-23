// QA: a fresh level-1 character opens the Town: the official notice is pinned on Posts and pays 500 once.
const pw = require('playwright'); const base = process.env.BASE;
(async () => { const b = await pw.chromium.launch(); const ctx = await b.newContext({ viewport: { width: 390, height: 844 } }); await ctx.route('**/*', (r) => (r.request().url().startsWith(base) ? r.continue() : r.abort())); const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && QBLoft.data, null, { timeout: 90000 }); await p.waitForTimeout(1500);
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'NewCal', sex: 'm' }); S.xp = x.cum(3); S.areaOn = null; x.persist(); x.render(); });
  await p.waitForTimeout(800); await p.evaluate(() => { document.querySelectorAll('.modal,.overlay,[class*=splash]').forEach((m) => m.remove()); document.querySelector('.nav button[data-v="hall"]').click(); }); await p.waitForTimeout(1500);
  await p.evaluate(() => document.querySelectorAll('.modal,.overlay,[class*=splash]').forEach((m) => m.remove()));
  const st = () => p.evaluate(() => ({ coins: window.__qb.x().S.coins, ntc: document.querySelectorAll('.ntc').length, btn: document.querySelectorAll('[data-act="ntget"]').length, note: ((document.querySelector('.ntc') || {}).innerText || '').slice(-40), paid: window.__qb.x().S.notices }));
  console.log('before', JSON.stringify(await st())); await p.screenshot({ path: process.env.OUT });
  for (let i = 0; i < 2; i++) { await p.evaluate(() => { const bt = document.querySelector('[data-act="ntget"]'); if (bt) bt.click(); }); await p.waitForTimeout(900); await p.evaluate(() => document.querySelectorAll('.modal,.overlay,[class*=splash]').forEach((m) => m.remove())); console.log('after collect ' + (i + 1), JSON.stringify(await st())); }
  console.log('page errors', errs.length, JSON.stringify(errs.slice(0, 2))); await b.close(); })();
