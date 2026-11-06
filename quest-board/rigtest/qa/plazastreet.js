// Kode Plaza's street picture by stage (LEAD's 2882690, Cal: "start off like a plaza... this current picture... when the restaurant
// gets added... add more shops" as rooms open): the street (The Loft tab, zoomed out) with the plaza holding the Garden alone, then the
// Garden and Restaurant, then three rooms; the stage, the picture used, and a picture of the street each time. Tapping the building
// must still open its rooms.   BASE=<server> OUT=<folder> node plazastreet.js
const fs = require('fs'), path = require('path');
const { open } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const { b, p, errs } = await open({ width: 440, height: 840, owned: 'none' });
  for (const rooms of [['garden'], ['garden', 'restaurant'], ['garden', 'restaurant', 'boba']]) {
    const r = await p.evaluate(async (rooms) => { const w = (ms) => new Promise((o) => setTimeout(o, ms)); const x = window.__qb.x(), S = x.S;
      S.areaOn = null; S.gates = [5, 10, 20, 30, 40]; S.xp = Math.max(S.xp, x.cum(30));
      S.base.slots = S.base.slots.filter((s) => s && !['garden', 'restaurant', 'boba', 'dessert', 'skybar', 'rooftop', 'speakeasy'].includes(s.t));
      rooms.forEach((t) => S.base.slots.push({ t, a: {}, st: 0, pend: 0 }));
      document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); x.render();
      const st = [...document.querySelectorAll('button')].find((e) => /Street/.test(e.textContent)); if (st) st.click();
      document.querySelector('.nav button[data-v="hideout"]').click(); await w(2500); document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove());
      const P = window.__qbPlaza; const art = P ? String(P.art() || 'none (drawn front)') : 'no hook';
      const blds = [...document.querySelectorAll('[data-act="bldgo"]')].length;
      return { stage: P ? P.stage() : null, art: art.replace(/^data:[^,]{0,40},.*/, 'data URL').slice(0, 90), buildings: blds }; }, rooms);
    console.log(`${rooms.join('+')}: stage ${r.stage}, picture ${r.art}, ${r.buildings} buildings on the street`);
    await p.screenshot({ path: path.join(OUT, `plaza_${rooms.length}.png`) });
  }
  // tapping the plaza still opens its rooms
  const tap = await p.evaluate(async () => { const w = (ms) => new Promise((o) => setTimeout(o, ms)); const g = document.querySelectorAll('[data-act="bldgo"]')[1]; if (!g) return 'no plaza building'; g.dispatchEvent(new MouseEvent('click', { bubbles: true })); await w(5000);
    return (document.querySelector('.bldname, [class*="bldtitle"], h2') || {}).textContent || [...document.querySelectorAll('button')].some((e) => /Street/.test(e.textContent)) ? 'building view open' : 'nothing opened'; });
  console.log('tapping Kode Plaza:', tap);
  console.log('page errors', errs.length, errs.slice(0, 2));
  await b.close();
})();
