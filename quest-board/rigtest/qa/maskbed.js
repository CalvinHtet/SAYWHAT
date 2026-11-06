// The player asleep in the real Bedroom wearing a hat item (LEAD's b85b038: sm_halomask keepAsleep, faceCover): 2 am, the Loft's building
// view, the Bedroom window; waits for "me" to lie down, then a picture of the bed and what the sleeper's look holds.
//   HAT=gx_sm_halomask FACE=gx_h_shades BASE=<server> OUT=<folder> node maskbed.js
const fs = require('fs'), path = require('path');
const { open } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const { b, p, errs } = await open({ width: 1000, height: 900, owned: 'all' });
  const HAT = process.env.HAT || 'gx_sm_halomask', FACE = process.env.FACE || '';
  await p.evaluate((h) => { const now = new Date(Date.now()), t = new Date(now); t.setHours(h, 0, 0, 0); window.__qbShift = (window.__qbShift || 0) + (t - now); }, 2);
  const eq = await p.evaluate(([HAT, FACE]) => { const x = window.__qb.x(), S = x.S; const it = (id) => x.SHOP.find((q) => q[0] === id); S.owned = S.owned || {}; S.eq = S.eq || {};
    [HAT, FACE].filter(Boolean).forEach((id) => { const q = it(id); if (q) { S.owned[id] = true; S.eq[q[1]] = id; } }); S.areaOn = null; x.persist(); x.render();
    document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); document.querySelector('.nav button[data-v="hideout"]').click(); return JSON.stringify(S.eq); }, [HAT, FACE]);
  console.log('worn:', eq);
  await p.waitForTimeout(3000);
  await p.evaluate(() => { document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); document.querySelectorAll('[data-act="bldgo"]')[0].dispatchEvent(new MouseEvent('click', { bubbles: true })); });
  await p.waitForTimeout(5000);
  let st = null;
  for (let k = 0; k < 20; k++) { st = await p.evaluate(() => { const A = window.__qbLoft().A; const me = Object.values(A).find((a) => a && a.id === 'me'); return me ? { mode: me.mode, act: me.act || me.doing || '', pose: me.pose || me.clip || '' } : null; }); if (st && /sleep|bed/i.test(JSON.stringify(st))) break; await p.waitForTimeout(1500); }
  console.log('me:', JSON.stringify(st));
  await p.evaluate(() => { const S = window.__qb.x().S; const k = S.base.slots.findIndex((s) => s && s.t === 'bedroom'); document.querySelectorAll('#layer .modal').forEach((e) => e.remove()); window.__qb.roomModal(k); });
  await p.waitForTimeout(3000);
  await (await p.$('.rmodal .rbig')).screenshot({ path: path.join(OUT, `bed_${HAT}${FACE ? '_' + FACE : ''}.png`) });
  const me = await p.evaluate(() => { const g = document.querySelector('.rmodal [id^="lfa-me"]') || document.getElementById('lfa-me'); if (!g) return null; const r = g.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]; });
  console.log('sleeper box in the window:', JSON.stringify(me));
  console.log('page errors', errs.length, errs.slice(0, 2));
  await b.close();
})();
