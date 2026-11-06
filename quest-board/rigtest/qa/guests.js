// Guests in a room window, live (ROOM=<type>): every upgrade bought, the real room window left open; every few seconds, who is
// there and what they are doing (role:mode:act@spot), and a picture. For the Theater lobby: the ticket line and snack trips.
//   ROOM=theater OUT=<folder> node guests.js [shots] [seconds]
const fs = require('fs');
const { open } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
const ROOM = process.env.ROOM || 'theater', N = +(process.argv[2] || 8), GAP = +(process.argv[3] || 5);
(async () => {
  const { b, p, errs } = await open({ width: 1100, height: 1000, owned: 'none' });
  const i = await p.evaluate((k) => { const x = window.__qb.x(), S = x.S; if (!S.base.slots.some((s) => s.t === k)) S.base.slots.push({ t: k, a: {}, st: 0, pend: 0 }); const i = S.base.slots.findIndex((s) => s.t === k), r = S.base.slots[i];
    x.ADDONS[k].forEach((u) => { if (!(u[3] && (u[3].retired || u[3].opens))) r.a[u[0]] = 1; }); S.areaOn = null; S.gates = [5, 10, 20, 30, 40]; S.xp = Math.max(S.xp, x.cum(45)); x.render(); return i; }, ROOM);
  // enter the way a player does: The Loft tab, the building, the room (agents walk only in a room opened from its building)
  await p.evaluate(() => { document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); document.querySelector('.nav button[data-v="hideout"]').click(); });
  await p.waitForTimeout(2500);
  const blds = await p.evaluate(() => document.querySelectorAll('[data-act="bldgo"]').length);
  for (let bi = 0; bi < blds; bi++) { const found = await p.evaluate(async ({ bi, k }) => { const w = (ms) => new Promise((o) => setTimeout(o, ms)); document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); const g = document.querySelectorAll('[data-act="bldgo"]')[bi]; if (!g) return false; g.dispatchEvent(new MouseEvent('click', { bubbles: true })); await w(2500); return !!document.querySelector('#lfwrap [data-room="' + k + '"]'); }, { bi, k: ROOM }); console.log('building ' + bi + ': ' + (found ? 'has ' + ROOM : '-')); if (found) break; await p.evaluate(() => { const st = [...document.querySelectorAll('button')].find((e) => /Street/.test(e.textContent)); if (st) st.click(); }); await p.waitForTimeout(1500); }
  await p.evaluate((i) => { document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); window.__qb.roomModal(i); }, i);
  const seen = new Set();
  for (let k = 0; k < N; k++) {
    await p.waitForTimeout(GAP * 1000);
    const st = await p.evaluate((i) => { const q = window.__qbLoft(); return Object.values(q.A).filter((a) => a.pv && a.pvslot === i && a.alpha > .5).map((a) => a.role + ':' + a.mode + ':' + (a.act || '') + (a.st ? '@' + (a.st.lbl || a.st.tag || a.st.kind) : '')); }, i);
    st.forEach((s) => seen.add(s.split(':').slice(1).join(':')));
    const el = await p.$('#rbigw') || await p.$('.rmodal'); if (el) await el.screenshot({ path: `${OUT}/guests_${ROOM}_${k}.png` }).catch(() => {});
    console.log(k, st.join('  ') || '(nobody)');
  }
  console.log('modes and spots seen: ' + [...seen].sort().join(', '));
  console.log('page errors', errs.length, errs.slice(0, 3));
  await b.close();
})();
