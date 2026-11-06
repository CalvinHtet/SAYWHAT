// Guests and staff live in a room the way a player sees them: The Loft tab, into the room's building (characters exist only inside a
// building view; going back to the street clears them), then the room window. Every 5 s: who is in the room and what they do; pictures.
// The theater lobby is in building 2 (the Mall); change ROOM and the building index for others.
//   BASE=<server> node livebuilding.js
const { open } = require('./lib.js');
(async () => {
  const { b, p, errs } = await open({ width: 1100, height: 1000, owned: 'all' });
  const i = await p.evaluate(() => window.__qb.x().S.base.slots.findIndex((s) => s && s.t === 'theater'));
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.areaOn = null; S.gates = [5, 10, 20, 30, 40]; S.xp = Math.max(S.xp, x.cum(45)); x.render(); document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); document.querySelector('.nav button[data-v="hideout"]').click(); });
  await p.waitForTimeout(3500);
  await p.evaluate(() => { document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); document.querySelectorAll('[data-act="bldgo"]')[2].dispatchEvent(new MouseEvent('click', { bubbles: true })); });
  await p.waitForTimeout(6000);
  await p.evaluate((i) => { document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); window.__qb.roomModal(i); }, i);
  const seen = {};
  for (let k = 0; k < 12; k++) { await p.waitForTimeout(5000);
    const r = await p.evaluate((i) => { const A = Object.values(window.__qbLoft().A || {}); const here = A.filter((a) => (a.pv && a.pvslot === i) || a.slot === i || a.ri === i);
      return { all: A.length, here: here.map((a) => a.role + ':' + a.mode + ':' + (a.act || '') + (a.st ? '@' + (a.st.lbl || a.st.tag || a.st.kind) : '')) }; }, i);
    r.here.forEach((h) => (seen[h.split(':').slice(1).join(':')] = (seen[h.split(':').slice(1).join(':')] || 0) + 1));
    console.log(k, 'agents ' + r.all + ', in the lobby: ' + (r.here.join('  ') || '(nobody)'));
    if (k === 5 || k === 11) { const el = await p.$('#rbigw') || await p.$('.rmodal'); if (el) await el.screenshot({ path: (process.env.OUT || 'qa-out') + '/lobby_live_' + k + '.png' }); }
  }
  console.log('seen:', JSON.stringify(seen)); console.log('page errors', errs.length, errs.slice(0, 2));
  await b.close();
})();
