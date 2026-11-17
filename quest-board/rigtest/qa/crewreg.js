// Crew regression (QA, for LEAD's crew posts ff44edc): a fully bought room's window open for 30 s on a full save, sampled every
// 0.5 s. Per crew member: samples present, share busy at a spot (mode "do"), places visited (0.5 grid), the longest time standing
// still while not at a spot (stuck), and whether the room shows "No crew here". Run on the build before and after, compare.
// Only the open window's people (ids pv:...) move; the building view is a still picture.
//   ROOM=restaurant BLD=1 BASE=<server> node rigtest/qa/crewreg.js
const { open } = require('./lib.js');
(async () => {
  const { b, p, errs } = await open({ width: 440, height: 840, owned: 'all' });
  await p.evaluate((v) => { window.BLDI = v[0]; window.ROOMN = v[1]; }, [+(process.env.BLD || 1), process.env.ROOM || 'restaurant']);
  const i = await p.evaluate(() => { const x = window.__qb.x(), S = x.S; const k = S.base.slots.findIndex((s) => s && s.t === window.ROOMN); const r = S.base.slots[k];
    x.ADDONS[window.ROOMN].forEach((u) => { if (u[3] && (u[3].retired || u[3].opens)) return; r.a[u[0]] = 1; }); return k; });
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.areaOn = null; S.gates = [5, 10, 20, 30, 40]; S.xp = Math.max(S.xp, x.cum(45)); x.render(); document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); document.querySelector('.nav button[data-v="hideout"]').click(); });
  await p.waitForTimeout(3500);
  await p.evaluate(() => { document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); document.querySelectorAll('[data-act="bldgo"]')[BLDI].dispatchEvent(new MouseEvent('click', { bubbles: true })); });
  await p.waitForTimeout(6000);
  await p.evaluate((i) => { document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); window.__qb.roomModal(i); }, i);
  await p.waitForTimeout(4000);
  const log = {}; let noCrew = 0;
  for (let t = 0; t < 60; t++) {
    const s = await p.evaluate((i) => { const A = window.__qbLoft().A, o = {}; Object.keys(A).forEach((k) => { const a = A[k]; if (a.role === 'crew' && /^pv:/.test(k)) o[k] = [a.x, a.y, a.mode, a.act || '']; });
      return { o, nc: /No crew here/.test((document.querySelector('#layer .rmodal') || document.body).innerText) }; }, i);
    if (s.nc) noCrew++;
    Object.keys(s.o).forEach((k) => { (log[k] = log[k] || []).push(s.o[k]); });
    await p.waitForTimeout(500); }
  const rows = Object.keys(log).sort().map((k) => { const L = log[k]; let still = 0, worst = 0;
    for (let j = 1; j < L.length; j++) { if (Math.hypot(L[j][0] - L[j - 1][0], L[j][1] - L[j - 1][1]) < 0.01 && L[j][2] !== 'do') { still++; worst = Math.max(worst, still); } else still = 0; }
    const places = new Set(L.map((q) => Math.round(q[0] * 2) / 2 + ',' + Math.round(q[1] * 2) / 2)).size, busy = L.filter((q) => q[2] === 'do').length / L.length;
    return `${k.replace(/^pv:/, '')}: ${L.length}/60, busy ${Math.round(busy * 100)}%, ${places} places, stuck max ${(worst / 2).toFixed(1)} s, acts ${[...new Set(L.map((q) => q[3]).filter(Boolean))].slice(0, 5).join('/')}`; });
  console.log(`${process.env.ROOM || 'restaurant'}: ${rows.length} crew; "No crew here" in ${noCrew}/60 samples; page errors ${errs.length}`);
  rows.forEach((r) => console.log('   ' + r));
  await b.close();
})();
