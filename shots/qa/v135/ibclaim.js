// QA: collect the two letters through the real inbox buttons, twice each; coins before and after.
const pw = require('playwright'); const base = process.env.BASE, DIR = process.env.DIR, OUT = process.env.OUT;
(async () => { const ctx = await pw.chromium.launchPersistentContext(DIR, { viewport: { width: 390, height: 844 } }); await ctx.route('**/*', (r) => (r.request().url().startsWith(base) ? r.continue() : r.abort()));
  const p = ctx.pages()[0] || await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && QBLoft.data, null, { timeout: 90000 }); await p.waitForTimeout(2500);
  const c = () => p.evaluate(() => window.__qb.x().S.coins); console.log('start coins', await c());
  for (const id of ['welcome', 'live135', 'welcome', 'live135']) { const r = await p.evaluate(async (id) => { const w = (ms) => new Promise((r) => setTimeout(r, ms)); document.querySelectorAll('#layer .modal').forEach((m) => m.remove());
      const b = document.querySelector('.ibbtn'); if (!b) return 'no inbox button'; b.click(); await w(600); const row = document.querySelector(`[data-ib="open"][data-id="${id}"]`); if (!row) return 'no row'; row.click(); await w(600);
      const cl = document.querySelector(`[data-ib="claim"][data-id="${id}"]`); const t = cl ? cl.textContent : ((document.querySelector('.ibgot') || {}).textContent || 'no claim button'); if (cl) cl.click(); await w(600); return t; }, id);
    console.log(id, '|', r, '| coins', await c()); }
  await p.screenshot({ path: OUT }); console.log('page errors', errs.length, JSON.stringify(errs.slice(0, 2))); await ctx.close(); })();
