// QA: does an idle Board re-render on its own? Counts DOM child-list bursts under the app over 21 s on an idle level-6 save.
const pw = require('playwright'); const base = process.env.BASE;
(async () => { const b = await pw.chromium.launch(); const ctx = await b.newContext({ viewport: { width: 390, height: 844 } }); await ctx.route('**/*', (r) => (r.request().url().startsWith(base) ? r.continue() : r.abort())); const p = await ctx.newPage();
  await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && QBLoft.data, null, { timeout: 90000 }); await p.waitForTimeout(1500);
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.gates = [5]; S.xp = x.cum(6) + 5; S.ms = { since: 5 }; S.areaOn = null; x.persist(); x.render(); });
  await p.waitForTimeout(2500); await p.evaluate(() => document.querySelectorAll('#layer .modal').forEach((m) => m.remove()));
  const r = await p.evaluate(() => new Promise((res) => { const root = document.getElementById('app') || document.body; const hits = []; let last = 0; const t0 = performance.now();
    const mo = new MutationObserver((ms) => { const big = ms.filter((m) => m.type === 'childList' && m.addedNodes.length > 3).length; if (big) { const t = performance.now(); if (t - last > 500) hits.push(Math.round((t - t0) / 100) / 10); last = t; } });
    mo.observe(root, { childList: true, subtree: true }); setTimeout(() => { mo.disconnect(); res(hits); }, 21000); }));
  console.log('re-render bursts (s):', JSON.stringify(r)); await b.close(); })();
