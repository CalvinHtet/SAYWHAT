// A room window left to run, entered the way a player does since the street view: The Loft tab, tap the building, open
// the room. Prints who is where at each shot (role:mode:act@spot) and saves the window.
//   OUT=<folder> node watchroom.js <room> [shots] [seconds between]
const fs = require('fs');
const { open } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
const [room, n, gap] = [process.argv[2] || 'bedroom', +(process.argv[3] || 8), +(process.argv[4] || 20)];
(async () => {
  const { b, p, errs } = await open({ width: 1200, height: 1100, owned: 'all' });
  await p.evaluate(() => { const bt = document.querySelector('.nav button[data-v="hideout"]'); if (bt) bt.click(); });
  await p.waitForTimeout(2500);
  const bld = { bedroom: 0, closet: 0, lair: 0, patio: 0, gameroom: 0, mall: 2, theater: 2, auditorium: 2, arcade: 2, bowling: 2, karaoke: 2 }[room];
  await p.evaluate((k) => { document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); const g = document.querySelectorAll('[data-act="bldgo"]')[k || 0]; if (g) g.dispatchEvent(new MouseEvent('click', { bubbles: true })); }, bld);
  await p.waitForTimeout(4000);
  const i = await p.evaluate((room) => window.__qb.x().S.base.slots.findIndex((s) => s && s.t === room), room);
  await p.evaluate((i) => { document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); window.__qb.roomModal(i); }, i);
  for (let k = 0; k < n; k++) {
    await p.waitForTimeout(gap * 1000);
    const st = await p.evaluate((i) => { const q = window.__qbLoft(); return Object.values(q.A).filter((a) => a.pv && a.pvslot === i && a.alpha > .5).map((a) => a.role + ':' + a.mode + ':' + (a.act || '') + (a.st ? '@' + (a.st.lbl || a.st.tag || a.st.kind) : '') + '(' + (+a.x).toFixed(1) + ',' + (+a.y).toFixed(1) + ')').join(' '); }, i);
    const el = await p.$('#rbigw'); if (el) await el.screenshot({ path: `${OUT}/wr_${room}_${k}.png` }).catch(() => {});
    console.log(k, st || '(nobody)');
  }
  console.log('errs', errs.slice(0, 4));
  await b.close();
})();
