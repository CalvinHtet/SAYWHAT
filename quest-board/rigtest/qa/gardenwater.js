// Watering the Garden as the player sees it (ROOMS's 82cc1f9 with LEAD's a2e234e): at each stage, the beds dry (parched) and
// after a real mouse tap on the watering can (damp): the can is a button, a tap waters for 24 hours, the window says so, and
// the beds' look changes. With Sprinklers the beds are damp without watering. Pictures before and after.
//   OUT=<folder> node gardenwater.js
const fs = require('fs'), path = require('path');
const { open } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
const STAGES = [['Back Plot', {}], ['Kitchen Garden', { g_x1: 1 }], ['Estate', { g_x1: 1, g_x2: 1 }]];
(async () => {
  const { b, p, errs } = await open({ width: 1000, height: 900, owned: 'none' });
  const fails = [], oks = [], t = (c, m) => (c ? oks : fails).push(m);
  const look = () => p.evaluate(() => { const fl = [...document.querySelectorAll('.rmodal svg [filter], .rmodal svg [style*="filter"]')].map((e) => e.getAttribute('filter') || e.style.filter).filter(Boolean);
    const can = document.querySelector('.rmodal svg g[data-act="gdwater"]'); let c = null; if (can) { const r = can.getBoundingClientRect(), pic = can.closest('svg').getBoundingClientRect(); c = { x: r.left + r.width / 2, y: (r.top + Math.min(r.bottom, pic.bottom)) / 2, cut: Math.max(0, r.bottom - pic.bottom) }; }
    const note = (document.querySelector('.rmodal .gd-water') || {}).innerText || '';
    return { wet: window.gdWatered(), parched: fl.filter((f) => /sepia|saturate\(\.4/.test(f)).length, damp: fl.filter((f) => /saturate\(1\.1/.test(f)).length, can: c, note: note.replace(/\s+/g, ' ').slice(0, 90) }; });
  for (const [name, a] of STAGES) {
    await p.evaluate(async (a) => { const S = window.__qb.x().S, w = (ms) => new Promise((o) => setTimeout(o, ms));
      S.base.slots = S.base.slots.filter((s) => s.t !== 'garden'); S.base.slots.push({ t: 'garden', a: Object.assign({ g_bed2: 1, g_bed3: 1 }, a), st: 0, pend: 0 });
      S.base.gwater = Date.now() - 1000; document.querySelectorAll('#layer .modal,.dropsplash').forEach((e) => e.remove()); window.__qb.roomModal(S.base.slots.length - 1); await w(900); }, a);
    const dry = await look();
    await (await p.$('.rmodal')).screenshot({ path: path.join(OUT, `water_${name.replace(/ /g, '')}_dry.png`) });
    t(!dry.wet && dry.parched > 0, `${name} dry: gdWatered ${dry.wet}, parched beds ${dry.parched}, damp ${dry.damp}; window: "${dry.note}"`);
    t(!!dry.can, `${name}: the watering can is a button` + (dry.can && dry.can.cut ? ` (${Math.round(dry.can.cut)} px below the picture)` : ''));
    if (dry.can) { await p.mouse.click(dry.can.x, dry.can.y); await p.waitForTimeout(900); }
    const wet = await look();
    await (await p.$('.rmodal')).screenshot({ path: path.join(OUT, `water_${name.replace(/ /g, '')}_wet.png`) });
    const left = await p.evaluate(() => Math.round((window.__qb.x().S.base.gwater - Date.now()) / 36e5));
    t(wet.wet && wet.damp > 0 && wet.parched === 0, `${name} after one tap on the can: gdWatered ${wet.wet}, ${left} hours left, damp beds ${wet.damp}, parched ${wet.parched}; window: "${wet.note}"`);
  }
  // Sprinklers: damp without watering
  const spr = await p.evaluate(async () => { const S = window.__qb.x().S, w = (ms) => new Promise((o) => setTimeout(o, ms)); const r = S.base.slots.find((s) => s.t === 'garden'); r.a.g_spr = 1; S.base.gwater = Date.now() - 1000;
    document.querySelectorAll('#layer .modal').forEach((e) => e.remove()); window.__qb.roomModal(S.base.slots.indexOf(r)); await w(900); return { wet: window.gdWatered(), note: ((document.querySelector('.rmodal .gd-water') || {}).innerText || '').trim() }; });
  t(spr.wet && /Sprinklers/.test(spr.note), `Sprinklers, never watered: gdWatered ${spr.wet}; window: "${spr.note}"`);
  oks.forEach((m) => console.log('  ok   ' + m)); fails.forEach((m) => console.log('  FAIL ' + m));
  console.log('page errors', errs.length, errs.slice(0, 3));
  await b.close();
})();
