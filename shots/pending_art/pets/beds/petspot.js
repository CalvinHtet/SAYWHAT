// Stand-in third pet bed (hmx_dogbed footprint) at candidate spots, Bedroom and Patio fully furnished.
// SPOTS='bd:0.15,6.2;pt:6.3,2.6' node petspot.js
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:8767', OUT = process.env.OUT || '.';
const SPOTS = (process.env.SPOTS || 'bd:0.15,6.2;pt:6.3,2.6').split(';').map((s) => { const [r, v] = s.split(':'); const [x, y] = v.split(',').map(Number); return { r, x, y }; });
(async () => { const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] });
  const p = await (await b.newContext({ viewport: { width: 1300, height: 1000 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 200)));
  await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft, null, { timeout: 90000 });
  console.log('lfSpr global:', await p.evaluate(() => typeof window.lfSpr));
  await p.evaluate((SPOTS) => { const o = window.lfSpr; if (typeof o !== 'function') return; let n = 0;
    window.lfSpr = function (C, k, x, y, w, d, opt) { const r = o.apply(this, arguments);
      if (k === 'hmx_dogbed' && !C.__pet) { C.__pet = 1; const isPt = y > 3 && y < 4.5; SPOTS.filter((s) => s.r === (isPt ? 'pt' : 'bd')).forEach((s) => o.call(this, C, 'hmx_dogbed', s.x, s.y, isPt ? 1.1 : 1.2, isPt ? .9 : 1.0, Object.assign({}, opt || {}, { dk: .2 }))); }
      return r; }; }, SPOTS);
  const info = await p.evaluate(() => { const A = window.__qb.x().ADDONS || {}; return { bd: (A.bedroom || []).map((a) => a[0]), pt: (A.patio || []).map((a) => a[0]) }; });
  await p.evaluate((info) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.areaOn = null; S.xp = x.cum(40); S.gates = Array.from({ length: 200 }, (_, i) => i);
    S.base.slots = [{ t: 'bedroom', a: Object.fromEntries(info.bd.filter((k) => k !== 'bd_game').map((k) => [k, 1])), st: 0, pend: 0 }, { t: 'patio', a: Object.fromEntries(info.pt.concat(['pt_pbed']).map((k) => [k, 1])), st: 0, pend: 0 }]; x.render(); }, info);
  await p.evaluate(() => { const t = [...document.querySelectorAll('.nav button[data-v="hideout"]')][0]; if (t) t.click(); }); await p.waitForTimeout(1800);
  for (const [ix, nm] of [[0, 'bedroom'], [1, 'patio']]) {
    await p.evaluate((ix) => { document.querySelectorAll('.dropsplash,.overlay,.modal').forEach((e) => e.remove()); window.__qb.roomModal(ix); }, ix); await p.waitForTimeout(3500);
    const el = await p.$('#rbigw'); await (el || p).screenshot({ path: `${OUT}/spot_${nm}.png` }); }
  console.log('errors', errs.slice(0, 3)); await b.close(); })().catch((e) => { console.error(e); process.exit(1); });
