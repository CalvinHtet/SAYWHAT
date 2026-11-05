// node fxcheck.js -> club lights (soft floor glow, then a full-room flash) and a test friend visiting the Game Room; the Closet must stay empty
// Club lights: fire the strobe effect several times and screenshot each; Game Room: add a test friend and see them arrive.
const OUT = process.env.OUT || 'shots'; require('fs').mkdirSync(OUT, { recursive: true });
const { open } = require('./drv.js');
(async () => {
  const { b, p, errs } = await open({ width: 1200, height: 1200 });
  await p.evaluate(() => { document.querySelectorAll('.dropsplash,.modal,.overlay').forEach((e) => e.remove()); document.querySelector('.nav button[data-v="hideout"]').click(); });
  await p.waitForTimeout(1500);
  const ci = await p.evaluate(() => window.__order.indexOf('club'));
  await p.evaluate((i) => { document.querySelectorAll('.modal').forEach((e) => e.remove()); window.__qb.roomModal(i); }, ci);
  await p.waitForTimeout(3500);
  for (let n = 0; n < 6; n++) {
    const kind = await p.evaluate(() => { const it = document.querySelector('#rbigw .lfitems'); const k = it.getAttribute('data-i'); const m = window.LFMETA[k]; const r0 = Math.random; if (window.__forceFull != null) Math.random = () => (window.__forceFull ? 0.01 : 0.99); try { window.__qbLoft && 0; } finally {} return k; });
    await p.evaluate((n) => { const it = document.querySelector('#rbigw .lfitems'), k = it.getAttribute('data-i'), C = window.LFMETA[k].C; const r0 = Math.random; let first = true; Math.random = () => { if (first) { first = false; return n === 5 ? 0.01 : 0.9; } return r0(); }; try { window.__qbLoft().fx.strobe(C, k); } finally { Math.random = r0; } }, n).catch((e) => console.log('fx err', e.message.slice(0, 80)));
    await p.waitForTimeout(n === 5 ? 120 : 520);
    const el = await p.$('#rbigw'); const bb = await el.boundingBox();
    await p.screenshot({ path: `${OUT}/club_fx_${n}.png`, clip: bb });
    await p.waitForTimeout(2200);
  }
  // Game Room: a test friend in the visitors list
  const gi = await p.evaluate(() => window.__order.indexOf('gameroom'));
  const r = await p.evaluate((i) => {
    document.querySelectorAll('.modal').forEach((e) => e.remove());
    window.__qbLoft().defs.gameroom.visitors.push({ id: 'test', name: 'Test Friend', look: { body: 'm', skin: 's3', hairStyle: 'h1', hairColor: 'black', top: 'hoodie', topColor: 'white', bottom: 'jeans', bottomColor: 'black', shoe: 'sneakers', shoeColor: 'white', eq: ['al_bucket'] } });
    window.__qb.x().render(); window.__qb.roomModal(i); return true;
  }, gi);
  await p.waitForTimeout(45000);
  const g = await p.evaluate((i) => Object.values(window.__qbLoft().A).filter((a) => a.room === i || a.pvslot === i).map((a) => [a.id, a.role, a.vis || '', a.alpha, a.mode, a.look && a.look.rig && a.look.rig.hairStyle]), gi);
  console.log('gameroom agents', JSON.stringify(g));
  const el2 = await p.$('#rbigw'); const bb2 = await el2.boundingBox();
  await p.screenshot({ path: `${OUT}/game_visit.png`, clip: bb2 });
  const cl = await p.evaluate(() => { const i = window.__order.indexOf('closet'); return Object.values(window.__qbLoft().A).filter((a) => (a.room === i || a.pvslot === i) && a.role !== 'me').length; });
  console.log('closet agents (not you)', cl);
  console.log('errs', errs.filter((e) => !/TUNNEL/.test(e)).slice(0, 4));
  await b.close();
})();
