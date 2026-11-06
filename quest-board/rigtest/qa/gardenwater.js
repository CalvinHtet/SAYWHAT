// The Garden's dry look and watering animation (ROOMS's 4bcda62) and the upright beds (b9bcbbf): the Garden window on a phone (390x844,
// touch) at 1 pm, every upgrade but the Sprinklers. Dry: which beds use their painted _dry twin. Then Water from the window: pictures at
// 0.3 to 3.2 s with the cans and the fading dry layer counted, and every bed's box compared dry vs after (a bed that moves = a jump).
// Then the Sprinklers bought and the clock run past a day: the Garden must never read dry.   BASE=<server> OUT=<folder> node gardenwater.js
const fs = require('fs'), path = require('path');
const { open } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const { b, p, errs } = await open({ width: 390, height: 844, owned: 'all', mobile: true });
  await p.evaluate((h) => { const now = new Date(Date.now()), t = new Date(now); t.setHours(h, 0, 0, 0); window.__qbShift = (window.__qbShift || 0) + (t - now); }, 13);
  const i = await p.evaluate(() => { const x = window.__qb.x(), S = x.S; const k = S.base.slots.findIndex((s) => s && s.t === 'garden'); const r = S.base.slots[k]; r.a = {};
    x.ADDONS.garden.forEach((u) => { if (u[3] && (u[3].retired || u[3].opens)) return; if (u[0] === 'g_spr' || u[0] === 'g_x2') return; r.a[u[0]] = 1; });
    S.base.gwater = Date.now() - 1000; return k; });
  const openWin = async () => { await p.evaluate((i) => { document.querySelectorAll('#layer .modal,.dropsplash').forEach((e) => e.remove()); window.__qb.roomModal(i); }, i); await p.waitForTimeout(2500); };
  const read = () => p.evaluate(() => { const s = document.querySelector('.rmodal .rbig svg'); const ims = [...s.querySelectorAll('image')];
    const beds = ims.filter((im) => /gdx_|gd_bed|gd_berry/.test(im.getAttribute('href') || '') && !im.classList.contains('gddryfade'));
    return { kinds: [...new Set(beds.map((im) => (im.getAttribute('href') || '').replace(/^.*\/|\?.*$/g, '').replace(/^blob:.*/, 'blob')))].join(' '), dry: beds.filter((im) => /_dry/.test(im.getAttribute('href'))).length, beds: beds.length, boxes: beds.map((im) => { const r = im.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)].join(',') + ' ' + (im.getAttribute('href') || '').replace(/^.*\/|\?.*$/g, '').replace('_dry', ''); }),
      cans: [...s.querySelectorAll('.gdcan')].map((g) => +getComputedStyle(g).opacity).filter((o) => o > 0.05).length, canAll: s.querySelectorAll('.gdcan').length, fade: [...s.querySelectorAll('.gddryfade')].map((g) => +(+getComputedStyle(g).opacity).toFixed(2)) }; });
  await openWin();
  const d0 = await read(); console.log(`dry: ${d0.dry} of ${d0.beds} bed pictures use a painted dry twin, watered = ${await p.evaluate(() => gdWatered())}; pictures: ${d0.kinds}`);
  await (await p.$('.rmodal .rbig')).screenshot({ path: path.join(OUT, 'gw_dry.png') });
  const btn = await p.evaluate(() => { const b = [...document.querySelectorAll('.rmodal [data-act="gdwater"]')].find((e) => e.offsetParent); if (!b) return null; b.dispatchEvent(new MouseEvent('click', { bubbles: true })); return b.innerText.slice(0, 30); });
  console.log('water button:', btn);
  const t0 = Date.now(); const seq = [];
  for (const at of [300, 800, 1300, 1800, 2300, 2800, 3300]) { await p.waitForTimeout(Math.max(0, at - (Date.now() - t0))); const r = await read(); seq.push(`${((Date.now() - t0) / 1000).toFixed(1)}s cans ${r.cans}/${r.canAll} dry-fade ${r.fade.length ? Math.min(...r.fade) + '-' + Math.max(...r.fade) : 'none'}`);
    if (at === 1300 || at === 2300) await (await p.$('.rmodal .rbig')).screenshot({ path: path.join(OUT, `gw_pour_${at}.png`) }); }
  seq.forEach((s) => console.log('  ' + s));
  const d1 = await read(); await (await p.$('.rmodal .rbig')).screenshot({ path: path.join(OUT, 'gw_wet.png') });
  const B1 = new Set(d1.boxes); const moved = d0.boxes.filter((bx) => !B1.has(bx)).length; /* as sets: the dry list holds the fading copies too */
  console.log(`after: ${d1.dry} dry of ${d1.beds}; beds whose box changed dry -> wet: ${moved}` + (moved ? '  dry: ' + d0.boxes.filter((bx) => !B1.has(bx)).slice(0, 4).join(' | ') + '  wet, same pictures: ' + d1.boxes.filter((bx) => d0.boxes.filter((q) => !B1.has(q)).some((q) => q.split(' ')[1] === bx.split(' ')[1])).join(' | ') : ''));
  // Sprinklers: never dry
  const spr = await p.evaluate(async (i) => { const w = (ms) => new Promise((o) => setTimeout(o, ms)); const x = window.__qb.x(), S = x.S; S.base.slots[i].a.g_spr = 1; S.base.gwater = Date.now() - 5 * 864e5; const out = [];
    for (const h of [0, 30, 60]) { window.__qbShift += h * 36e5; out.push(gdWatered()); } return out; }, i);
  await openWin(); const d2 = await read();
  console.log(`with Sprinklers, watering 5 days old, +0/+30/+90 h: watered ${spr.join('/')}; window shows ${d2.dry} dry beds`);
  console.log('page errors', errs.length, errs.slice(0, 3));
  await b.close();
})();
