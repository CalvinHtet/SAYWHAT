// Boba in play (QA recheck of c5bc0c7): the room window at 1400x1500, 21:00, a full new-player Boba; 70 s sampled every 0.5 s.
// Logs which guests use the tea bar's two standing spots and the second table's moved spot, and screenshots when the bar and the
// table spot are in use. Also the posted barista.   BASE=<server> OUT=<folder> node bobapeople.js (run from rigtest/qa, needs lib.js)
const { open } = require('./lib.js');
(async () => {
  const { b, p, errs } = await open({ width: 1400, height: 1500, owned: 'all' });
  await p.evaluate(() => { const now = new Date(Date.now()), t = new Date(now); t.setHours(21, 0, 0, 0); window.__qbShift = (window.__qbShift || 0) + (t - now); });
  await p.evaluate(() => { const x = window.__qb.x(); x.S.base.slots.forEach((r) => { if (!r) return; (x.ADDONS[r.t] || []).forEach((u) => { if (u[3] && u[3].retired) delete r.a[u[0]]; }); }); });
  const i = await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.areaOn = null; S.xp = Math.max(S.xp, x.cum(45)); x.render(); document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); document.querySelector('.nav button[data-v="hideout"]').click(); return S.base.slots.findIndex((s) => s && s.t === 'boba'); });
  await p.waitForTimeout(3500);
  await p.evaluate(() => { document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); document.querySelectorAll('[data-act="bldgo"]')[1].dispatchEvent(new MouseEvent('click', { bubbles: true })); });
  await p.waitForTimeout(6000);
  await p.evaluate((i) => { document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); window.__qb.roomModal(i); }, i);
  await p.waitForTimeout(3000);
  const spots = await p.evaluate(() => { const A = window.__qbLoft().A, k = Object.keys(A).find((k) => /^pv:st:boba0/.test(k)), C = window.__qbLoft().C(A[k]);
    return C.st.filter((s) => s.cust && s.x > 7.5 && s.y > 4).map((s) => [+s.x.toFixed(2), +s.y.toFixed(2), s.fx, s.facewall ? 'fw' : '', s.act]); });
  console.log('front-right guest spots (room units):', JSON.stringify(spots));
  const use = {}; let shots = 0, seal = 0, sealOff = 0;
  for (let t = 0; t < 140; t++) {
    const s = await p.evaluate(() => { const A = window.__qbLoft().A, o = {}; Object.keys(A).filter((k) => /^pv:/.test(k)).forEach((k) => { const a = A[k]; o[k] = [a.x, a.y, a.mode, a.act || '', a.post || '']; }); return o; });
    let atBar = 0, atTbl = 0;
    Object.keys(s).forEach((k) => { if (!/g:/.test(k)) return; const q = s[k]; spots.forEach((sp) => { if (Math.hypot(q[0] - sp[0], q[1] - sp[1]) < 0.2 && q[2] === 'do') { const key = sp[0] + ',' + sp[1]; use[key] = (use[key] || 0) + 1; if (sp[1] > 7) atBar++; else atTbl++; } }); });
    Object.keys(s).forEach((k) => { if (s[k][4] === 'seal') { seal++; if (Math.hypot(s[k][0] - 6.15, s[k][1] - 1.05) > 0.05) sealOff++; } });
    if (shots < 3 && (atBar || atTbl) && t % 10 === 0) { await p.screenshot({ path: process.env.OUT + '/boba_people_' + t + '.png' }); shots++; }
    await p.waitForTimeout(500); }
  console.log('guest samples at each spot (0.5 s each):', JSON.stringify(use), '| screenshots', shots, '| seal barista samples', seal, 'off post', sealOff);
  console.log('page errors', errs.length, JSON.stringify(errs.slice(0, 2)));
  await b.close();
})();
