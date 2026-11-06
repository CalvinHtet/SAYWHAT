// The Auditorium's story gate (LEAD's 7ebf618, Cal): at level 25+, the Theo scene and the free Auditorium come only once the lobby
// owns the Ticket Booth, Popcorn Cart and Soda Fountain (t_booth1, t_pop, t_soda), not with any two upgrades; saying yes opens the
// room and marks the Theater's "Open the Auditorium" (t_aud) as owned, so it is never on sale for coins afterwards.
//   node audgate.js
const { open } = require('./lib.js');
(async () => {
  const { b, p, errs } = await open({ width: 1000, height: 900, owned: 'none' });
  const fails = [], oks = [], t = (c, m) => (c ? oks : fails).push(m);
  const run = (own) => p.evaluate(async (own) => { const x = window.__qb.x(), S = x.S, ST = window.__qbStory, w = (ms) => new Promise((o) => setTimeout(o, ms));
    S.base.slots = S.base.slots.filter((s) => !['theater', 'auditorium'].includes(s.t)); S.base.slots.push({ t: 'theater', a: {}, st: 0, pend: 0 }); const th = S.base.slots[S.base.slots.length - 1];
    own.forEach((k) => (th.a[k] = 1)); S.areaOn = null; S.gates = [5, 10, 20, 30]; S.xp = Math.max(S.xp, x.cum(30)); delete S.unlockDay;
    const o = ST.state(); ['garden', 'chef', 'boba', 'dessert', 'lockkey', 'rafe', 'rooftop', 'mall', 'nova', 'theater'].forEach((k) => (o.done[k] = 1)); delete o.done.auditorium; delete o.offer.auditorium; o.stepDay = null; o.later = {};
    document.querySelectorAll('#layer .modal,.dropsplash').forEach((e) => e.remove()); ST.check(); await w(300);
    const yes = document.querySelector('[data-act="styyes"]'); const scene = yes ? yes.dataset.v : null; if (yes) { yes.click(); await w(400); }
    const has = S.base.slots.some((s) => s.t === 'auditorium');
    document.querySelectorAll('#layer .modal,.dropsplash').forEach((e) => e.remove()); window.__qb.roomModal(S.base.slots.indexOf(th)); await w(300);
    const audForSale = !!document.querySelector('.rmodal [data-act="raddon"][data-id="t_aud"]');
    return { scene, has, tAud: !!th.a.t_aud, audForSale, lv: x.effLvl() }; }, own);
  const r0 = await run(['t_booth1', 't_pop']); t(!r0.scene && !r0.has, `booth and popcorn only (level ${r0.lv}): no scene, no Auditorium (scene ${r0.scene}, room ${r0.has})`);
  const r1 = await run(['t_bins', 't_fl1', 't_wl1']); t(!r1.scene && !r1.has, `three other upgrades: no scene, no Auditorium (scene ${r1.scene}, room ${r1.has})`);
  const r2 = await run(['t_booth1', 't_pop', 't_soda']); t(r2.has, `booth, popcorn and soda: scene "${r2.scene}", Auditorium opened ${r2.has}`);
  t(r2.tAud && !r2.audForSale, `after it opens, "Open the Auditorium" is owned (${r2.tAud}) and not for sale (${r2.audForSale})`);
  oks.forEach((m) => console.log('  ok   ' + m)); fails.forEach((m) => console.log('  FAIL ' + m));
  console.log('page errors', errs.length, errs.slice(0, 3));
  await b.close();
})();
