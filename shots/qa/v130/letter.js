// QA: the v1.30 patch letter as a player on v1.29 sees it, at phone size: inbox list, the open letter, coins paid once on opening.
const pw = require('playwright'); const base = process.env.BASE, OUT = process.env.OUT;
(async () => { const b = await pw.chromium.launch(); const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  await ctx.route('**/*', (r) => (r.request().url().startsWith(base) ? r.continue() : r.abort())); const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && QBLoft.data, null, { timeout: 90000 }); await p.waitForTimeout(800);
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(35); S.gates = Array.from({ length: 200 }, (_, i) => i); S.areaOn = { board: 1, shop: 1, hideout: 1 }; S.coins = 1000; S.pn = { from: 129 }; S.welcomed = 1; x.render(); });
  await p.waitForTimeout(1500); await p.evaluate(() => document.querySelectorAll('.dropsplash,.bsplash,#layer .modal').forEach((m) => m.remove()));
  await p.evaluate(() => { const bt = document.querySelector('[data-ib="list"]'); if (bt) bt.click(); }); await p.waitForTimeout(900);
  const rows = await p.evaluate(() => [...document.querySelectorAll('.ibrow')].map((r) => r.textContent.trim().slice(0, 60)));
  console.log('inbox rows:', JSON.stringify(rows)); await p.screenshot({ path: OUT + '_list.png' });
  const c0 = await p.evaluate(() => window.__qb.x().S.coins);
  await p.evaluate(() => { const r = document.querySelector('[data-ib="open"][data-id="pn130"]'); if (r) r.click(); }); await p.waitForTimeout(1200);
  const body = await p.evaluate(() => { const m = document.querySelector('.ibox'); return m ? m.innerText : ''; }); console.log('letter text:\n' + body);
  await p.screenshot({ path: OUT + '_letter.png' }); const c1 = await p.evaluate(() => window.__qb.x().S.coins);
  await p.evaluate(() => { const bk = document.querySelector('[data-ib="list"]'); if (bk) bk.click(); }); await p.waitForTimeout(600); await p.evaluate(() => { const r = document.querySelector('[data-ib="open"][data-id="pn130"]'); if (r) r.click(); }); await p.waitForTimeout(800);
  const c2 = await p.evaluate(() => window.__qb.x().S.coins); console.log('coins', c0, '->', c1, 'after opening, then', c2, 'after opening again');
  const ow = await p.evaluate(() => { const m = document.querySelector('.ibox'); return m ? [m.scrollWidth, m.clientWidth, document.documentElement.scrollWidth] : null; }); console.log('letter widths (scroll, client, page):', JSON.stringify(ow));
  console.log('page errors', errs.length, JSON.stringify(errs.slice(0, 2))); await b.close(); })();
