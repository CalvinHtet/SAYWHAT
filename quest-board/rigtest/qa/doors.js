// Doors between rooms (Cal, 2026-11-05: "if doorway is on the left side, the next room doorway should be on the right side
// so it makes sense which way you are entering and exiting"). Reads every door (portal() in the built app.js) and the
// building map (ROOMCELL), then checks, for each pair of rooms:
//  - both directions exist;
//  - left and right: a door on a room's left side (left wall or front-left edge) leads to a room to its left in the
//    building, and the door back is on that room's right side, and the other way round; a room above is reached through
//    a back wall and left through a front edge;
//  - the floating arrow's corner (top-left for up, bottom-left for left, bottom-right for right and down) is on the same
//    side of the frame as the glowing door;
//  - furniture in front of a door, with nothing bought and with everything bought.
// Then a picture of each room window with every door, every upgrade owned.
//   OUT=<folder> QB=<built quest-board folder> node doors.js
const fs = require('fs');
const path = require('path');
const { open, ORDER } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out';
const QB = process.env.QB || path.join(__dirname, '..', '..');
fs.mkdirSync(OUT, { recursive: true });
const src = fs.readFileSync(path.join(QB, 'dist', 'app.js'), 'utf8');
const doors = [...src.matchAll(/portal\("(\w+)","(\w+)","(\w+)",([\d.]+)/g)].map((m) => ({ from: m[1], to: m[2], wall: m[3], pos: +m[4] }));
const cell = {};
for (const m of src.match(/var ROOMCELL=\{([^}]*)\}/)[1].matchAll(/(\w+):\[(\d+),(\d+),(\d+)\]/g)) cell[m[1]] = [+m[2], +m[3], +m[4]];
// screen side of each wall: BL = left wall (x=0, top left), BR = back wall (y=0, top right), FL = front-left edge (y=D),
// FR = front-right edge (x=W)
const SIDE = { BL: 'left', FL: 'left', BR: 'right', FR: 'right' }, TOP = { BL: 1, BR: 1, FL: 0, FR: 0 };
// Cal's rule (TASKS.md, ROOMS, 2026-11-05): "a door on one room's back-left wall comes out of the next room's front-right
// edge, back-right to front-left, and the other way round, at matching positions"
const PAIR = { BL: 'FR', FR: 'BL', BR: 'FL', FL: 'BR' };
const NAME = { BL: 'left wall (top left)', BR: 'back wall (top right)', FL: 'front-left edge', FR: 'front-right edge' };
const lines = [];
const rel = (a, b) => { const A = cell[a], B = cell[b]; if (!A || !B) return '?'; if (A[0] !== B[0]) return 'other building'; return B[2] > A[2] ? 'up' : B[2] < A[2] ? 'down' : B[1] < A[1] ? 'left' : 'right'; };
for (const d of doors) {
  const back = doors.find((e) => e.from === d.to && e.to === d.from), dir = rel(d.from, d.to), bad = [];
  if (!back) bad.push('no door back');
  if (back && back.wall !== PAIR[d.wall]) bad.push("Cal's rule: a door on the " + NAME[d.wall] + ' should come out of ' + d.to + "'s " + NAME[PAIR[d.wall]] + ', not its ' + NAME[back.wall]);
  if (dir === 'left' && SIDE[d.wall] !== 'left') bad.push(d.to + ' is to the left but the door is on the ' + SIDE[d.wall]);
  if (dir === 'right' && SIDE[d.wall] !== 'right') bad.push(d.to + ' is to the right but the door is on the ' + SIDE[d.wall]);
  if (dir === 'up' && !TOP[d.wall]) bad.push(d.to + ' is above but the door is on a front edge');
  if (dir === 'down' && TOP[d.wall]) bad.push(d.to + ' is below but the door is on a back wall');
  if (back && (dir === 'left' || dir === 'right') && SIDE[back.wall] === SIDE[d.wall]) bad.push('both doors on the ' + SIDE[d.wall] + ' side');
  const A = cell[d.from], B = cell[d.to];
  if (A && B && A[0] === B[0] && Math.abs(A[1] - B[1]) + Math.abs(A[2] - B[2]) > 1) bad.push('not next to each other in the building (' + d.from + ' ' + A.slice(1) + ', ' + d.to + ' ' + B.slice(1) + ')');
  // the arrow: rmArrows puts up in the top-left corner, left in the bottom-left, right and down in the bottom-right
  const corner = dir === 'up' ? 'top-left' : dir === 'left' ? 'bottom-left' : 'bottom-right';
  const doorCorner = (TOP[d.wall] ? 'top-' : 'bottom-') + SIDE[d.wall];
  if (corner !== doorCorner) bad.push('arrow in the ' + corner + ' corner, door on the ' + NAME[d.wall] + ' (' + doorCorner + ')');
  d.dir = dir; d.bad = bad;
  lines.push(`${d.from} -> ${d.to} (${dir}): door on the ${NAME[d.wall]} at ${d.pos}${back ? ', back door on ' + d.to + "'s " + NAME[back.wall] : ''}${bad.length ? '\n    ' + bad.join('\n    ') : '  ok'}`);
}
const rooms = Object.keys(cell);
rooms.filter((r) => !doors.some((d) => d.from === r || d.to === r)).forEach((r) => lines.push(r + ': no doors (bought from the street)'));

(async () => {
  const blocked = [];
  if (process.env.LOGIC) { console.log(lines.join('\n')); return; }
  for (const owned of ['none', 'all']) {
    const { b, p } = await open({ width: 1200, height: 1000, owned });
    // every room exists, so every door shows
    const res = await p.evaluate(({ doors, order }) => {
      const x = window.__qb.x(), S = x.S, q = window.__qbLoft();
      order.forEach((t) => { if (!S.base.slots.some((s) => s.t === t)) S.base.slots.push({ t, a: {}, st: 0, pend: 0 }); });
      const out = [];
      doors.forEach((d) => {
        const i = S.base.slots.findIndex((s) => s.t === d.from); if (i < 0) return;
        const C = q.roomCtx(S.base.slots[i], 90 + i), W = C.W, D = C.D, p = Math.min(d.pos, (d.wall === 'BR' || d.wall === 'FL' ? W : D) - 1);
        // the floor in front of the door: 1.5 wide, 1.2 deep into the room
        const z = d.wall === 'BR' ? [p - .75, 0, p + .75, 1.2] : d.wall === 'BL' ? [0, p - .75, 1.2, p + .75] : d.wall === 'FL' ? [p - .75, D - 1.2, p + .75, D] : [W - 1.2, p - .75, W, p + .75];
        const hit = (C.obsRaw || []).filter((o) => Math.min(o[2], z[2]) - Math.max(o[0], z[0]) > .1 && Math.min(o[3], z[3]) - Math.max(o[1], z[1]) > .1);
        if (hit.length) {
          const gs = [...new DOMParser().parseFromString('<svg xmlns="http://www.w3.org/2000/svg">' + q.roomSvg(S.base.slots[i], 90 + i, C, { uid: 90 + i }) + '</svg>', 'image/svg+xml').querySelectorAll('.lfitems > g[data-b]')];
          const names = hit.map((o) => { const g = gs.find((g) => { const bb = g.getAttribute('data-b').split(',').map(Number); return Math.abs(bb[0] - o[0]) < .05 && Math.abs(bb[1] - o[1]) < .05; }); return g ? ((g.innerHTML.match(/([a-z0-9]+x?_[a-z0-9_]+)\.webp/) || [, 'piece'])[1]) : 'piece'; });
          out.push(d.from + ' door to ' + d.to + ': ' + [...new Set(names)].join(', ') + ' in front of it');
        }
      });
      return out;
    }, { doors, order: ORDER });
    res.forEach((l) => blocked.push((owned === 'all' ? 'everything bought: ' : 'nothing bought: ') + l));
    if (owned === 'all') {
      // the room window of every room with a door, as Cal sees it, at phone width
      const pg = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
      await pg.goto(p.url()); await pg.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft, null, { timeout: 60000 });
      await pg.evaluate(({ order }) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.gates = Array.from({ length: 200 }, (_, i) => i); S.xp = x.cum(60); S.coins = 999999; S.base.slots = order.map((t) => ({ t, a: Object.fromEntries((x.ADDONS[t] || []).map((u) => [u[0], 1])), st: 0, pend: 0 })); x.render(); }, { order: ORDER });
      for (const r of [...new Set(doors.map((d) => d.from))]) {
        await pg.evaluate((r) => { document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); window.__qb.roomModal(window.__qb.x().S.base.slots.findIndex((s) => s.t === r)); }, r);
        await pg.waitForTimeout(2500);
        const el = await pg.$('#rbigw'); if (el) await el.screenshot({ path: path.join(OUT, 'door_' + r + '.png') });
      }
      await pg.close();
    }
    await b.close();
  }
  console.log(lines.join('\n'));
  console.log('\nFurniture in front of a door:');
  blocked.forEach((l) => console.log('  ' + l));
  fs.writeFileSync(path.join(OUT, 'doors.json'), JSON.stringify({ doors, cell, blocked }, null, 1));
})();
