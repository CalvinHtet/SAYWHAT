// Cal 11-26 (29zz_v200.js): the five starter banners open at level 5; level 5's level-up says so; a short tour shows how to equip a
// banner and where it shows.
//   PORT=<build server> NODE_PATH=<playwright's parent> OUT=<dir> node rigtest/lead/ban200.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8838, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV200, null, { timeout: 90000 }); await p.waitForTimeout(300);
  const V = (f, a) => p.evaluate(f, a); const clear = () => V(() => document.querySelectorAll('#layer .modal,.dropsplash,.bsplash').forEach((m) => m.remove()));
  const g = await V(() => ['neon', 'maple', 'fire', 'lantern', 'moon', 'studio'].map((id) => window.__qbV200.lv(id)));
  ok(JSON.stringify(g) === '[5,5,5,5,5,0]', 'the five starter banners open at level 5 (Studio stays free) ' + JSON.stringify(g));
  const u = await V(() => ({ at5: window.__qbV200.unlocks(4, 5), at6: window.__qbV200.unlocks(5, 6) }));
  ok(u.at5.some((t) => /^You unlocked 5 banners for your player card/.test(t)) && !u.at6.some((t) => /banner/.test(t)), 'level 5\'s level-up says "You unlocked 5 banners for your player card" ' + JSON.stringify(u));
  /* a level-5 player with the Shop open: the tour */
  await V(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'C', sex: 'm' }); S.xp = x.cum(5); S.gates = [5]; S.tutDone = 1; S.coins = 5000;
    S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1 }; S.base.slots = [{ t: 'bedroom', a: { bd_ward1: 1, bd_ward2: 1 }, st: 0, pend: 0 }, { t: 'closet', a: {}, st: 0, pend: 0 }]; S.areaOn = null;
    if (window.__qbV192 && window.__qbV192.due()) window.__qbV192.claim(); x.render(); });
  await clear();
  let t1 = null; for (let i = 0; i < 10 && !t1; i++) { await p.waitForTimeout(1300); await clear(); t1 = await V(() => { const b = document.querySelector('#qbtour .tour-bub'), q = document.getElementById('qbtour'); const r = b && b.getBoundingClientRect(); return b && r.width > 0 && getComputedStyle(q).visibility !== 'hidden' && /New: banners/.test(b.textContent) ? b.textContent.replace(/\s+/g, ' ').slice(0, 120) : null; }); }
  ok(!!t1, 'the banner tour starts on the Board: ' + t1); await p.screenshot({ path: OUT + '/ban200_1.png' });
  await p.click('.strip .avbtn'); await p.waitForTimeout(1800);
  const t2 = await V(() => { const b = document.querySelector('#qbtour .tour-bub'); return b ? b.textContent.replace(/\s+/g, ' ').slice(0, 100) : null; });
  ok(/Change banner/.test(t2 || ''), 'step 2 points at Change banner in the profile: ' + t2); await p.screenshot({ path: OUT + '/ban200_2.png' });
  await p.click('#layer [data-act="pcbgs"]'); await p.waitForTimeout(2200); await V(() => document.querySelectorAll('.dropsplash,.bsplash').forEach((m) => m.remove()));
  const t3 = await V(() => { const b = document.querySelector('#qbtour .tour-bub'); return { txt: b ? b.textContent.replace(/\s+/g, ' ').slice(0, 120) : null, cards: document.querySelectorAll('.qshop .pc-bgc:not(.lock)').length }; });
  ok(/Pick one/.test(t3.txt || '') && t3.cards >= 6, 'step 3 in the banners: preview, buy, Use; the five are open ' + JSON.stringify(t3)); await p.screenshot({ path: OUT + '/ban200_3.png' });
    await clear(); await p.waitForTimeout(1500); await p.click('#qbtour [data-tour="next"]'); await p.waitForTimeout(900);
  const t4 = await V(() => { const b = document.querySelector('#qbtour .tour-bub'); return b ? b.textContent.replace(/\s+/g, ' ').slice(0, 160) : null; });
  ok(/top left/.test(t4 || '') && /Town board/.test(t4 || ''), 'step 4 says where it shows and where to change it: ' + t4); await p.screenshot({ path: OUT + '/ban200_4.png' });
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
