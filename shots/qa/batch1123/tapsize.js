// QA: tap target sizes of the bottom bar (7 buttons) and the Upgrades section tabs at 360 and 390 wide, on a level-35 save with every area open.
const pw = require('playwright'); const base = process.env.BASE;
(async () => { const b = await pw.chromium.launch();
  for (const W of [360, 390]) { const ctx = await b.newContext({ viewport: { width: W, height: 800 } }); await ctx.route('**/*', (r) => (r.request().url().startsWith(base) ? r.continue() : r.abort())); const p = await ctx.newPage();
    await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && QBLoft.data, null, { timeout: 90000 }); await p.waitForTimeout(1200);
    await p.evaluate(() => { const x = window.__qb.x(), S = x.S, A = x.ADDONS || {}; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(35); S.gates = Array.from({ length: 200 }, (_, i) => i); S.calm = false; S.fsall = 1; S.areaOn = null; S.base.slots = Object.keys(A).filter((t) => x.ROOMT[t]).map((t) => ({ t, a: Object.fromEntries((A[t] || []).map((u) => [u[0], 1])), st: 0, pend: 0 })); x.persist(); x.render(); });
    await p.waitForTimeout(1200); await p.evaluate(() => document.querySelectorAll('#layer .modal,.overlay,[class*=splash]').forEach((m) => m.remove()));
    const nav = await p.evaluate(() => [...document.querySelectorAll('.nav button')].filter((b) => b.offsetParent).map((b) => { const r = b.getBoundingClientRect(); return (b.dataset.v || '?') + ' ' + Math.round(r.width) + 'x' + Math.round(r.height); }));
    console.log(W, 'bar', nav.length, JSON.stringify(nav));
    await p.evaluate(() => { const s = document.querySelector('.nav button[data-v="sys"]'); if (s) s.click(); }); await p.waitForTimeout(1200); await p.evaluate(() => document.querySelectorAll('#layer .modal,.overlay').forEach((m) => m.remove()));
    const tabs = await p.evaluate(() => [...document.querySelectorAll('.sxv .qs-tab')].filter((b) => b.offsetParent).map((b) => { const r = b.getBoundingClientRect(); return b.textContent.trim().slice(0, 12) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height); }));
    console.log(W, 'upgrade tabs', JSON.stringify(tabs), 'icon', await p.evaluate(() => { const s = document.querySelector('.nav button[data-v="sys"] svg'); return s ? s.querySelectorAll('circle').length + ' circles' : 'none'; }));
    await ctx.close(); } await b.close(); })();
