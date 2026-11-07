// Neighbors drawn with their Shop outfits (QA 3f6c696): Ben wears a SAVE POINT outfit; Ana's Hall list, his visit header and his
// board post must show the rig picture, outfit included, not the starter drawing.
const fs = require('fs'), path = require('path'); const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:65410', QB = process.env.QB || '.';
const CAPS = JSON.parse(fs.readFileSync(path.join(QB, 'app/dbcaps.json'), 'utf8')).capabilities.db.rules; const MOCK = require('./mockdb.js');
(async () => { const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 }); const errs = [];
  const open = async (uid, owner, name, eq) => { const p = await ctx.newPage(); p.on('pageerror', (e) => errs.push(name + ': ' + e.message)); await p.addInitScript(MOCK, { uid, owner, rules: CAPS });
    await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && window.__qbLive, null, { timeout: 60000 }); await p.waitForTimeout(800);
    await p.evaluate(([name, eq]) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name, sex: 'm' }); S.xp = x.cum(10); delete S.areaOn; if (eq) { S.owned = S.owned || {}; S.eq = S.eq || {}; Object.keys(eq).forEach((sl) => { S.owned[eq[sl]] = 1; S.eq[sl] = eq[sl]; }); } x.persist(); x.render(); }, [name, eq]);
    await p.evaluate(() => document.querySelectorAll('.modal').forEach((e) => e.remove())); return p; };
  const ana = await open('u_ana', true, 'Ana', null), ben = await open('u_ben', false, 'Ben', { a_top: 'gx_sp_varsity', a_hat: 'gx_sp_headset', a_pants: 'gx_sp_camo' });
  await ben.evaluate(() => { document.querySelector('.nav button[data-v="hall"]').click(); }); await ben.waitForTimeout(800);
  await ben.evaluate(() => { const t = document.getElementById('sntext'); t.value = 'new fit'; t.dispatchEvent(new Event('input', { bubbles: true })); document.querySelector('[data-act="snpost"]').click(); });
  await ana.bringToFront(); await ana.evaluate(() => document.querySelector('.nav button[data-v="hall"]').click()); await ana.waitForTimeout(9000);
  const r = await ana.evaluate(() => { const imgs = [...document.querySelectorAll('#socnb img.calp')]; return imgs.map((i) => ({ eq: Object.keys((JSON.parse(i.dataset.look).rig || {}).equipped || {}).join(','), drawn: i.src.startsWith('data:image/gif') ? 'blank' : 'yes' })); });
  await ana.screenshot({ path: '/private/tmp/claude-501/-Users-calibur--claude-spares-spare-MOWpiM/afafcbf6-9cc0-455e-8015-335dca1e8917/scratchpad/rv/nbav_hall.png' });
  await ana.evaluate(() => document.querySelector('[data-act="snvisit"][data-u="u_ben"]').click()); await ana.waitForTimeout(3000);
  const v = await ana.evaluate(() => { const i = document.querySelector('.snvisit img.calp'); return i ? (i.src.startsWith('data:image/gif') ? 'blank' : 'drawn') : 'none'; });
  await ana.screenshot({ path: '/private/tmp/claude-501/-Users-calibur--claude-spares-spare-MOWpiM/afafcbf6-9cc0-455e-8015-335dca1e8917/scratchpad/rv/nbav_visit.png' });
  console.log(JSON.stringify({ hall: r, visit: v }), 'errors', errs.slice(0, 3)); await b.close(); })();
