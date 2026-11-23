// ROOMS 2026-11-23 (Cal via LEAD: "make sure everything placed correctly in the assets" in the later rooms, at each stage).
// Every room from the Restaurant on, at every stage it grows through: the Restaurant (r_x1, r_x2, each with Noir r_noir off and on)
// and the Garden (g_x1, g_x2) grow; the rooms built by autoRoom have one size. Each variant owns every other upgrade (the most
// crowded the room can be at that size). Per variant: lib.js audit (outside the room, overlapping footprints, drawn over), one picture.
//   BASE=<server> OUT=<folder> [ROOMS=a,b] node stagesweep.js
const fs = require('fs'), path = require('path');
const { open, openRoom, audit, ORDER } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out/stagesweep'; fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const rooms = process.env.ROOMS ? process.env.ROOMS.split(',') : ORDER.slice(ORDER.indexOf('restaurant'));
  const { b, p, errs } = await open({ width: 1500, height: 1200, owned: 'all' });
  await p.evaluate(() => { const now = new Date(Date.now()), t = new Date(now); t.setHours(13, 0, 0, 0); window.__qbShift = (window.__qbShift || 0) + (t - now); });
  const rows = [];
  for (const t of rooms) {
    const info = await p.evaluate((t) => { const x = window.__qb.x(), S = x.S; const i = S.base.slots.findIndex((s) => s && s.t === t);
      const d = (typeof ROOMDEF !== 'undefined' && ROOMDEF[t]) || null; const all = (x.ADDONS[t] || []).filter((u) => !(u[3] && (u[3].retired || u[3].opens))).map((u) => u[0]);
      return { i, stages: d && d.stages ? d.stages : [], all, sizes: d && d.size ? d.size : null }; }, t);
    if (info.i < 0) { console.log(t, 'no slot'); continue; }
    const V = { restaurant: [['st0', ['r_x1', 'r_x2', 'r_noir']], ['st0_noir', ['r_x1', 'r_x2']], ['st1', ['r_x2', 'r_noir']], ['st1_noir', ['r_x2']], ['st2', ['r_noir']], ['st2_noir', []]],
      garden: [['st0', ['g_x1', 'g_x2']], ['st1', ['g_x2']], ['st2', []]] }[t] || [['full', []]];
    for (const [s, drop] of V) {
      // a player can own only what its requirements allow (ADDREQ and the upgrade's "also"), so drop anything that needs a dropped piece
      const own = await p.evaluate(({ t, all, drop }) => { const x = window.__qb.x(), by = Object.fromEntries((x.ADDONS[t] || []).map((u) => [u[0], u]));
        const R = (typeof ADDREQ !== 'undefined') ? ADDREQ : {}; let set = new Set(all.filter((id) => !drop.includes(id))), changed = true;
        while (changed) { changed = false; for (const id of [...set]) { const e = (by[id] && by[id][3]) || {}; const need = [R[id], e.also].filter(Boolean);
          if (need.some((q) => by[q] && !set.has(q))) { set.delete(id); changed = true; } } }
        return [...set]; }, { t, all: info.all, drop });
      await p.evaluate(({ i, own }) => { const r = window.__qb.x().S.base.slots[i]; r.a = Object.fromEntries(own.map((id) => [id, 1])); }, { i: info.i, own });
      const res = await openRoom(p, info.i, 1400, 1100);
      if (res && res.err) { console.log(t, s, res.err); continue; }
      const a = await audit(p, info.i);
      const host = await p.$('#qahost'); if (host) await host.screenshot({ path: path.join(OUT, `${t}_${s}.png`) });
      const dim = await p.evaluate((i) => { const q = window.__qbLoft(), C = q.roomCtx(window.__qb.x().S.base.slots[i], 90 + i); return [C.W, C.D]; }, info.i);
      const row = { t, variant: s, size: dim, pieces: a.items.length, outside: a.outside, overlap: a.overlap, depth: a.depth, spots: a.spots || a.bad || undefined };
      rows.push(row);
      console.log(`${t} ${s} ${dim.map((v) => (+v).toFixed(1)).join('x')} pieces ${a.items.length} outside ${a.outside.length} overlaps ${a.overlap.length} drawnOver ${a.depth.length}`);
    }
  }
  fs.writeFileSync(path.join(OUT, 'stagesweep.json'), JSON.stringify(rows, null, 1));
  console.log('page errors', errs.length, errs.slice(0, 3)); await b.close();
})();
