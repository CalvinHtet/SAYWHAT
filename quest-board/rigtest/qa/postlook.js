// Lock and Key's posted staff in play (QA, ROOMS fff49a2): the room window open 1400x1500 at 21:00 on a full new-player save (or OWN=id,...
// for a partial buy), 25 s sampled every 0.25 s: each post's holder and how far off it they get, anyone else within 0.6 of a post,
// the staff's places, and screenshots at 5 s and 20 s (OUT/lk_<TAG>_20.png and _80.png).
//   BASE=<server> OUT=<folder> [OWN=sb_bar,...] [TAG=name] node rigtest/qa/postlook.js
const { open } = require('./lib.js');
(async () => {
  const { b, p, errs } = await open({ width: 1400, height: 1500, owned: 'all' });
  await p.evaluate(() => { const now = new Date(Date.now()), t = new Date(now); t.setHours(21, 0, 0, 0); window.__qbShift = (window.__qbShift || 0) + (t - now); });
  await p.evaluate(() => { const x = window.__qb.x(); x.S.base.slots.forEach((r) => { if (!r) return; (x.ADDONS[r.t] || []).forEach((u) => { if (u[3] && u[3].retired) delete r.a[u[0]]; }); }); });
  if (process.env.OWN) await p.evaluate((L) => { const x = window.__qb.x(), r = x.S.base.slots.find((s) => s && s.t === 'skybar'); r.a = {}; L.forEach((id) => { r.a[id] = 1; }); }, process.env.OWN.split(','));

  const i = await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.areaOn = null; S.xp = Math.max(S.xp, x.cum(45)); x.render(); document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); document.querySelector('.nav button[data-v="hideout"]').click(); return S.base.slots.findIndex((s) => s && s.t === 'skybar'); });
  await p.waitForTimeout(3500);
  await p.evaluate(() => { document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); document.querySelectorAll('[data-act="bldgo"]')[1].dispatchEvent(new MouseEvent('click', { bubbles: true })); });
  await p.waitForTimeout(6000);
  await p.evaluate((i) => { document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); window.__qb.roomModal(i); }, i);
  await p.waitForTimeout(5000);
  const cdp = await p.context().newCDPSession(p); await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1400, height: 1500, deviceScaleFactor: 1, mobile: false }); await p.waitForTimeout(2500);
  const ids = await p.evaluate(() => Object.keys(window.__qbLoft().A).filter((k) => /^pv:/.test(k)));
  console.log('people', ids.join(' '));
  const L = []; let shot = 0;
  for (let t = 0; t < 100; t++) { L.push(await p.evaluate(() => { const A = window.__qbLoft().A, o = {}; Object.keys(A).filter((k) => /^pv:/.test(k)).forEach((k) => { const a = A[k]; o[k] = [a.x, a.y, a.mode, a.act || '', a.post || '', a.wand ? 1 : 0, a.z || a.lift || 0]; }); return o; }));
    if (t === 20 || t === 80) { await p.screenshot({ path: process.env.OUT + '/lk_' + (process.env.TAG || 'tall') + '_' + t + '.png', fullPage: false }); }
    await p.waitForTimeout(250); }
  const posts = { mic: [12.15, 7.83], bench: [8.17, 7.5] };
  ['mic', 'bench'].forEach((tg) => { const pid = ids.find((k) => L[0][k] && L[0][k][4] === tg); if (!pid) { console.log(tg, 'no posted person'); return; }
    const d = L.map((s) => s[pid] ? Math.hypot(s[pid][0] - posts[tg][0], s[pid][1] - posts[tg][1]) : 99), modes = [...new Set(L.map((s) => s[pid] && s[pid][2] + ':' + s[pid][3]))];
    let near = 0, minO = 99, who = {}; L.forEach((s) => { Object.keys(s).forEach((k) => { if (k === pid) return; const dd = Math.hypot(s[k][0] - posts[tg][0], s[k][1] - posts[tg][1]); if (dd < minO) minO = dd; if (dd < 0.6) { near++; who[k] = 1; } }); });
    console.log(`${tg}: ${pid} off the post max ${Math.max(...d).toFixed(2)}, modes ${modes.join(',')}; others within 0.6 of the post in ${near} person-samples (min ${minO.toFixed(2)}) ${Object.keys(who).join(' ')}`); });
  ids.filter((k) => /st:skybar/.test(k)).forEach((k) => console.log('  ', k, 'wand', L[0][k] && L[0][k][5], 'post', L[0][k] && L[0][k][4], 'places', new Set(L.map((s) => s[k] && Math.round(s[k][0] * 2) / 2 + ',' + Math.round(s[k][1] * 2) / 2)).size, 'modes', [...new Set(L.map((s) => s[k] && s[k][2]))].join('/')));
  const w = ids.find((k) => L[0][k] && L[0][k][5]); if (w) console.log('server', w, 'places', new Set(L.map((s) => s[w] && Math.round(s[w][0] * 2) / 2 + ',' + Math.round(s[w][1] * 2) / 2)).size);
  console.log('page errors', errs.length, JSON.stringify(errs.slice(0, 2)));
  await b.close();
})();
