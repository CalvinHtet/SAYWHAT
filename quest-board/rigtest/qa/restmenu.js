// Cal's Restaurant notes (04bb241, 0edb26c): each kitchen-gear upgrade adds its dishes to the menu (the room window's
// "Menu:" line); the Grand Menu Board lists the dishes (its text in the room picture) and how many fit; pictures of the
// Bistro and Noir fully bought, for the back wall, the crescent booth and the kitchen half-wall.
//   OUT=<folder> node restmenu.js
const fs = require('fs'), path = require('path');
const { open, openRoom, audit } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
const GEAR = { r_cf2: 'Espresso Bar', r_k4: 'Flat-Top Grill', r_k5: 'Fryer', r_k6: 'Bakery Rack', r_k7: 'Wood-Fired Oven', r_k8: 'Grand French Range', r_p6: 'Charcoal Grill' };
(async () => {
  const { b, p, errs } = await open({ width: 1000, height: 900, owned: 'all' });
  const i = await p.evaluate(() => window.__qb.x().S.base.slots.findIndex((s) => s.t === 'restaurant'));
  const menu = () => p.evaluate((i) => { document.querySelectorAll('#layer .modal').forEach((e) => e.remove()); window.__qb.roomModal(i); const n = [...document.querySelectorAll('.rmodal p.note')].map((e) => e.textContent).find((t) => /^Menu:/.test(t)) || ''; return n.replace(/^Menu:\s*/, '').split('.')[0].split(/,\s*/).filter(Boolean); }, i);
  const full = await menu();
  const lines = [], t = (c, m) => lines.push((c ? '  ok   ' : '  FAIL ') + m);
  const ids = await p.evaluate(() => window.__qb.x().ADDONS.restaurant.map((u) => u[0]));
  for (const [id, name] of Object.entries(GEAR)) {
    if (!ids.includes(id)) { t(false, `${name}: no upgrade ${id} in the Restaurant`); continue; }
    await p.evaluate(({ i, id }) => { delete window.__qb.x().S.base.slots[i].a[id]; }, { i, id });
    const without = await menu();
    await p.evaluate(({ i, id }) => { window.__qb.x().S.base.slots[i].a[id] = 1; }, { i, id });
    const added = full.filter((d) => !without.includes(d));
    t(added.length > 0, `${name} (${id}) adds: ${added.join(', ') || 'nothing'}`);
  }
  console.log('menu with everything bought (' + full.length + '):', full.join(', '));
  // the Grand Menu Board's text in the picture, Bistro and Noir
  for (const noir of [false, true]) {
    await p.evaluate(({ i, noir }) => { const r = window.__qb.x().S.base.slots[i]; if (noir) r.a.r_noir = 1; else delete r.a.r_noir; }, { i, noir });
    await openRoom(p, i, 1300, 1000);
    const txt = await p.evaluate(() => [...document.querySelectorAll('#qahost text')].map((e) => e.textContent.trim()).filter(Boolean));
    const onBoard = full.filter((d) => txt.some((x) => x.includes(d)));
    t(onBoard.length === full.length, `${noir ? 'Noir' : 'Bistro'} Grand Menu Board shows ${onBoard.length} of ${full.length} dishes` + (onBoard.length < full.length ? ' (missing: ' + full.filter((d) => !onBoard.includes(d)).join(', ') + ')' : ''));
    const a = await audit(p, i);
    t(!a.outside.length, `${noir ? 'Noir' : 'Bistro'}: nothing outside the room ${a.outside.join(' ')}`);
    const cres = a.overlap.filter((o) => /curve|crescent/.test(o[0] + o[1]));
    t(!cres.length, `${noir ? 'Noir' : 'Bistro'}: the crescent booth overlaps nothing ${cres.map((o) => o.slice(0, 2).join('+')).join(' ')}`);
    await (await p.$('#qahost')).screenshot({ path: path.join(OUT, noir ? 'rest_noir.png' : 'rest_bistro.png') });
    // the board, close up
    const bb = await p.evaluate(() => { const ts = [...document.querySelectorAll('#qahost text')].filter((e) => /MENU|CARTE/.test(e.textContent)); if (!ts.length) return null; const g = ts[0].closest('g') || ts[0]; const r = g.getBoundingClientRect(); return [r.left, r.top, r.width, r.height]; });
    if (bb) await p.screenshot({ path: path.join(OUT, noir ? 'board_noir.png' : 'board_bistro.png'), clip: { x: Math.max(0, bb[0] - 20), y: Math.max(0, bb[1] - 20), width: Math.min(600, bb[2] + 40), height: Math.min(400, bb[3] + 120) } });
  }
  lines.forEach((l) => console.log(l));
  console.log('page errors', errs.length, errs.slice(0, 3));
  await b.close();
})();
