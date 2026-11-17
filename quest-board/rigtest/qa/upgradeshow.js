// How much each upgrade shows (Cal, 2026-11-17: "Restaurant can go down to 40 (keep the most visually appealing upgrades but can
// remove the small unnoticeable ones), Garden can go down to 35"). Each room fully bought (no retired pieces, none that open another
// room) is drawn in the QA host, then once without each upgrade; the share of the picture that changes ranks the upgrades from most
// to least visible; "alone" adds each to a room with only its expansions, so a lower tier a later one covers still shows. 0 in
// both = nothing on screen (a menu, staff, a cap). Pictures of the full room and of
// the box each upgrade changes go to OUT.   ROOMS=restaurant,garden BASE=<plain build> OUT=<folder> node upgradeshow.js
const fs = require('fs');
const { open, openRoom, diff } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out/upgradeshow'; fs.mkdirSync(OUT, { recursive: true });
(async () => { const { b, p, errs } = await open({ width: 1000, height: 900, owned: 'all' });
  const W = 1000, H = 760;
  const shot = async () => (await p.locator('#qahost').screenshot()).toString('base64');
  for (const R of (process.env.ROOMS || 'restaurant,garden').split(',')) {
    const i = await p.evaluate((R) => window.__qb.x().S.base.slots.findIndex((s) => s && s.t === R), R);
    const L = await p.evaluate(({ i, R }) => { const x = window.__qb.x(), r = x.S.base.slots[i]; const live = x.ADDONS[R].filter((u) => !(u[3] && (u[3].retired || u[3].opens)));
      r.a = {}; live.forEach((u) => { r.a[u[0]] = 1; }); return live.map((u) => ({ id: u[0], name: u[1], price: u[2], g: (u[3] || {}).g || '-', lv: (u[3] || {}).lv || 0, p: (u[3] || {}).p || 0 })); }, { i, R });
    await openRoom(p, i, W, H); const full = await shot(); fs.writeFileSync(`${OUT}/${R}_full.png`, Buffer.from(full, 'base64'));
    const rows = [];
    for (const u of L) {
      await p.evaluate(({ i, id }) => { window.__qb.x().S.base.slots[i].a[id] = 0; }, { i, id: u.id });
      await openRoom(p, i, W, H); const d = await diff(p, full, await shot());
      await p.evaluate(({ i, id }) => { window.__qb.x().S.base.slots[i].a[id] = 1; }, { i, id: u.id });
      rows.push(Object.assign(u, { share: d.share, box: d.box }));
    }
    // alone: from a room with only its expansions (and the patio) bought, add just this upgrade. A lower tier hidden by a later one
    // at full build still shows here; 0 here and 0 above = nothing drawn at all (a menu, staff, a cap)
    const base = L.filter((u) => u.g === 'Expansion' || /patio$/.test(u.id)).map((u) => u.id);
    await p.evaluate(({ i, base }) => { const r = window.__qb.x().S.base.slots[i]; r.a = {}; base.forEach((id) => { r.a[id] = 1; }); }, { i, base });
    await openRoom(p, i, W, H); const empty = await shot();
    for (const u of rows) { if (base.indexOf(u.id) >= 0) { u.alone = u.share; continue; }
      await p.evaluate(({ i, id }) => { window.__qb.x().S.base.slots[i].a[id] = 1; }, { i, id: u.id });
      await openRoom(p, i, W, H); u.alone = (await diff(p, empty, await shot())).share;
      await p.evaluate(({ i, id }) => { window.__qb.x().S.base.slots[i].a[id] = 0; }, { i, id: u.id }); }
    rows.sort((a, b) => b.share - a.share);
    console.log(`== ${R}: ${rows.length} upgrades, most to least visible (share of the ${W}x${H} picture that changes without it)`);
    rows.forEach((r, k) => console.log(`${String(k + 1).padStart(2)} ${(r.share * 100).toFixed(2).padStart(6)}% alone ${(r.alone * 100).toFixed(2).padStart(6)}%  ${r.id.padEnd(10)} ${r.name.padEnd(26)} ${r.g.padEnd(9)} lv ${String(r.lv).padStart(2)} ${String(r.price).padStart(5)} +${(r.p * 100).toFixed(1)}%${r.box ? '  box ' + r.box.join(',') : ''}`));
    fs.writeFileSync(`${OUT}/${R}_rank.json`, JSON.stringify(rows, null, 1));
  }
  console.log('page errors', errs.length, JSON.stringify(errs.slice(0, 3))); await b.close(); })();
