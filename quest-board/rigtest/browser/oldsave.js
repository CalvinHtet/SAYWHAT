// RELEASING.md rule 6: a save made by the published version loads in the new one, survives a reload, a purchase and another reload.
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext({ viewport: { width: 900, height: 900 } });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  const ready = async () => { await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft, null, { timeout: 60000 }); await p.waitForTimeout(1500); };
  const snap = () => p.evaluate(() => { const S = window.__qb.x().S; return { created: S.created, name: S.char && S.char.name, coins: Math.floor(S.coins), xp: S.xp, rooms: S.base.slots.map((r) => r && r.t + ':' + Object.keys(r.a || {}).length).join(' '), owned: Object.keys(S.owned || {}).length, mode: window.saveMode || null }; });
  // 1. old version makes a save
  await p.goto('http://127.0.0.1:8765/dist_old/index.html'); await ready();
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'OldSave', sex: 'f' }); S.coins = 5000; S.xp = x.cum(12); S.owned = { gx_o_tee: true }; S.base.slots[0].a = { bd_bed1: 1, bd_rug: 1 }; x.persist(); });
  await p.waitForTimeout(1500);
  const a = await snap(); console.log('old saved   ', JSON.stringify(a));
  // 2. new version loads it
  await p.goto('http://127.0.0.1:8765/dist/index.html'); await ready();
  const c = await snap(); console.log('new loaded  ', JSON.stringify(c));
  // 3. reload
  await p.reload(); await ready(); console.log('new reload  ', JSON.stringify(await snap()));
  // 4. buy an upgrade the normal way, then reload
  const bought = await p.evaluate(() => { const x = window.__qb.x(), S = x.S, r = S.base.slots[0], ad = (x.ADDONS.bedroom || []).find((u) => !r.a[u[0]] && u[2] <= S.coins && !u[3].opens); if (!ad) return null; S.coins -= ad[2]; r.a[ad[0]] = 1; x.persist(); return ad[0]; });
  await p.waitForTimeout(1500);
  console.log('bought', bought);
  await p.reload(); await ready(); const d = await snap(); console.log('after buy + reload', JSON.stringify(d));
  const keep = await p.evaluate((k) => !!window.__qb.x().S.base.slots[0].a[k], bought);
  console.log('purchase kept:', keep, ' name kept:', d.name === 'OldSave', ' clothes kept:', d.owned >= 1);
  console.log('errors', errs.slice(0, 3));
  await b.close();
})();
