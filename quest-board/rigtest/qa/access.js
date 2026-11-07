// Can every piece be used? (Cal, 2026-11-07: "the pinball machine on the right wall is facing towards the other machine with no
// space to play. Do a QA check on every asset to make sure the assets are accessible"). Every room fully bought, from its own room
// layout (the window's roomCtx): each piece's footprint, which way it faces (unmirrored: along the left wall facing lower right,
// +x; mirrored: along the back wall facing lower left, +y), and every spot a person uses. Checks:
//  (1) FRONT: the strip in front of each piece (0.8 deep, its width) is inside the room and not more than 35% covered by another
//      piece; pieces with nothing in front are listed with what blocks them.
//  (2) SPOTS: every spot people stand or sit on is inside the room, not inside another piece (a seat may be inside its own), and
//      can be walked to from the door on a 0.2 grid around the pieces.
// Rugs, floor decals and stages people stand on are not obstacles. Writes access.json and prints the problems per room.
//   BASE=<server> OUT=<folder> [ROOMS=a,b] node access.js
const fs = require('fs'), path = require('path');
const { open, ORDER } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const { b, p, errs } = await open({ width: 900, height: 700, owned: 'all' });
  const rooms = (process.env.ROOMS || ORDER.join(',')).split(',');
  const res = await p.evaluate((rooms) => {
    const S = window.__qb.x().S, q = window.__qbLoft(), SPR = window.LFSPR || {}, inv = {}; Object.keys(SPR).forEach((k) => { if (SPR[k] && SPR[k].u) inv[SPR[k].u] = k; });
    const nameOf = (s) => { const m = s.match(/href="([^"]+)"/); if (!m) return null; const u = m[1]; if (inv[u]) return inv[u]; const a = u.match(/art\/([a-z0-9_]+)\.webp/); return a ? a[1] : null; };
    const soft = /rug|mat\b|_mat|decal|carpet|floor|shadow|turf|lane|_led|neon|light|lamp|sconce|plant|pplant|tree|fern|palm|poster|art$|_art|frame|sign|clock|banner|curtain|string|lantern|pendant|chand/i;
    const out = {};
    for (const t of rooms) {
      const i = S.base.slots.findIndex((s) => s && s.t === t); if (i < 0) { out[t] = { missing: 1 }; continue; }
      const C = q.roomCtx(S.base.slots[i], 90 + i), W = C.W, D = C.D;
      const plats = (C.plat || []).map((r) => [r.x0, r.y0, r.x1, r.y1]);
      const items = (C.items || []).map((it, n) => ({ n, name: nameOf(it.s || '') || ('piece' + n), b: it.b, flip: /scale\(-1,1\)/.test(it.s || '') })).filter((it) => Array.isArray(it.b) && it.b.length >= 4 && it.b[2] - it.b[0] > .05 && it.b[3] - it.b[1] > .05);
      const obs = items.filter((it) => !soft.test(it.name) && !plats.some((r) => Math.abs(r[0] - it.b[0]) < .05 && Math.abs(r[1] - it.b[1]) < .05));
      const ov = (A, B) => Math.max(0, Math.min(A[2], B[2]) - Math.max(A[0], B[0])) * Math.max(0, Math.min(A[3], B[3]) - Math.max(A[1], B[1]));
      const front = [];
      obs.forEach((it) => { const [x0, y0, x1, y1] = it.b; const z = it.flip ? [x0, y1, x1, y1 + .8] : [x1, y0, x1 + .8, y1]; const za = (z[2] - z[0]) * (z[3] - z[1]);
        const outside = it.flip ? Math.max(0, z[3] - D) / .8 : Math.max(0, z[2] - W) / .8;
        const by = obs.filter((o) => o !== it).map((o) => [o.name, ov(z, o.b) / za]).filter((x) => x[1] > .05).sort((a, c) => c[1] - a[1]);
        const cover = Math.min(1, by.reduce((s, x) => s + x[1], 0) + outside);
        if (cover > .35) front.push({ piece: it.name, faces: it.flip ? 'lower left (+y)' : 'lower right (+x)', at: it.b.map((v) => +v.toFixed(2)), covered: +cover.toFixed(2), by: by.slice(0, 3).map((x) => x[0] + ' ' + Math.round(x[1] * 100) + '%').concat(outside > .05 ? ['the room edge ' + Math.round(outside * 100) + '%'] : []) }); });
      // walk grid
      const G = .2, nx = Math.ceil(W / G), ny = Math.ceil(D / G), free = (x, y) => x > .1 && y > .1 && x < W - .05 && y < D - .05 && !obs.some((o) => x > o.b[0] + .02 && x < o.b[2] - .02 && y > o.b[1] + .02 && y < o.b[3] - .02);
      const cell = []; for (let gx = 0; gx < nx; gx++) { cell[gx] = []; for (let gy = 0; gy < ny; gy++) cell[gx][gy] = free((gx + .5) * G, (gy + .5) * G); }
      const door = C.door || { x: W - .5, y: D - .5 }; const seen = new Set(), Q = []; const k = (a, c) => a * 1000 + c;
      let sx = Math.min(nx - 1, Math.max(0, Math.floor(door.x / G))), sy = Math.min(ny - 1, Math.max(0, Math.floor(door.y / G)));
      // start from the free cell nearest the door
      let best = null, bd = 1e9; for (let gx = 0; gx < nx; gx++) for (let gy = 0; gy < ny; gy++) if (cell[gx][gy]) { const d = Math.hypot(gx - sx, gy - sy); if (d < bd) { bd = d; best = [gx, gy]; } }
      if (best) { Q.push(best); seen.add(k(best[0], best[1])); }
      while (Q.length) { const [a, c] = Q.shift(); [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => { const u = a + dx, v = c + dy; if (u < 0 || v < 0 || u >= nx || v >= ny || !cell[u][v] || seen.has(k(u, v))) return; seen.add(k(u, v)); Q.push([u, v]); }); }
      const reach = (x, y) => { for (let r = 0; r <= 2; r++) for (let dx = -r; dx <= r; dx++) for (let dy = -r; dy <= r; dy++) { const u = Math.floor(x / G) + dx, v = Math.floor(y / G) + dy; if (seen.has(k(u, v))) return true; } return false; };
      const spots = [];
      (C.st || []).forEach((s, n) => { if (!s || s.kind === 'door' || s.kind === 'wander') return; const x = s.x, y = s.y; const inside = obs.filter((o) => x > o.b[0] + .05 && x < o.b[2] - .05 && y > o.b[1] + .05 && y < o.b[3] - .05).map((o) => o.name);
        const seat = /sit|seat|bed|lie|sofa/.test(s.kind + (s.act || '') + (s.tag || ''));
        const near = obs.slice().sort((a, c) => Math.hypot(Math.max(0, a.b[0] - x, x - a.b[2]), Math.max(0, a.b[1] - y, y - a.b[3])) - Math.hypot(Math.max(0, c.b[0] - x, x - c.b[2]), Math.max(0, c.b[1] - y, y - c.b[3])))[0];
        const probs = []; if (x < 0 || y < 0 || x > W || y > D) probs.push('outside the room');
        if (inside.length && !(seat && inside.length === 1)) probs.push('inside ' + inside.join('+'));
        if (!reach(x, y)) probs.push('cannot be walked to from the door');
        if (probs.length) spots.push({ spot: (s.lbl || s.tag || s.kind) + (s.act ? ':' + s.act : ''), at: [+x.toFixed(2), +y.toFixed(2)], by: near ? near.name : '-', probs }); });
      out[t] = { W: +W.toFixed(1), D: +D.toFixed(1), pieces: items.length, obstacles: obs.length, spotsN: (C.st || []).length, front, spots };
    }
    return out; }, rooms);
  fs.writeFileSync(path.join(OUT, 'access.json'), JSON.stringify(res, null, 1));
  for (const [t, r] of Object.entries(res)) {
    if (r.missing) { console.log(`${t}: not in this save`); continue; }
    console.log(`${(r.front.length || r.spots.length ? 'CHECK' : 'ok   ')} ${t.padEnd(11)} ${r.W}x${r.D}, ${r.pieces} pieces (${r.obstacles} solid), ${r.spotsN} spots; front blocked ${r.front.length}, spot problems ${r.spots.length}`);
    r.front.forEach((f) => console.log(`        front: ${f.piece} faces ${f.faces}, ${Math.round(f.covered * 100)}% covered by ${f.by.join(', ')}`));
    r.spots.forEach((s) => console.log(`        spot: ${s.spot} at ${s.at} (by ${s.by}): ${s.probs.join('; ')}`));
  }
  console.log('page errors', errs.length, errs.slice(0, 2)); await b.close();
})();
