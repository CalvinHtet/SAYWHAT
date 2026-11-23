// Cal 11-23 after the reboot (29zz_v136.js): the coins step rings the coin count on screen (scrolled down too); two level-ups show 2 then
// 3; the cleared box keeps only its title; the task box asks for commas; Training: one Edit per exercise (sets, reps, name, photo; an emoji
// for a renamed exercise, the photo once given), and back to the original.
//   PORT=<plain build> NODE_PATH=<playwright's parent> OUT=<dir> node rigtest/lead/v136.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8779, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 700 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbV136, null, { timeout: 90000 }); await p.waitForTimeout(800);
  const clear = () => p.evaluate(() => document.querySelectorAll('#layer .modal,#layer .qb-held').forEach((m) => m.remove()));
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.calm = { days: [] }; S.tours = { welcome: 1, train: 1, hideout: 1, hall: 1, players: 1, dq: 1, bty: 1 }; S.letters = { read: { welcome: 1, live135: 1 }, paid: {}, at: {}, popped: 1 }; S.quests = S.quests.filter((q) => q.rep === 'weekly4'); x.render(); }); await clear();
  const bd = await p.evaluate(() => ({ ph: (document.getElementById('cap') || {}).placeholder, box: (document.querySelector('.allclear') || {}).innerText || '' }));
  ok(bd.ph === 'Add tasks here (Separate by commas)', 'task box: ' + bd.ph);
  ok(/Every quest cleared|No quests yet/.test(bd.box) && !/fresh run|New run/i.test(bd.box), 'cleared box: ' + bd.box.replace(/\s+/g, ' '));
  /* coins: scrolled to the bottom, the coins step */
  await p.evaluate(() => { document.body.style.minHeight = '3000px'; window.scrollTo(0, 2000); const T = window.__qbV136.tour; T.id = 'welcome'; T.i = 3; window.__qb.x().S.tours = {}; }); await p.waitForTimeout(2600);
  const c = await p.evaluate(() => { const r = document.querySelector('.tour-ring'); if (!r) return null; const R = r.getBoundingClientRect(); const pills = [...document.querySelectorAll('.coinpill')].map((e) => { const b = e.getBoundingClientRect(), cs = getComputedStyle(e); return { b: [b.x, b.y, b.width, b.height].map(Math.round), vis: cs.visibility !== 'hidden' && +cs.opacity > .2 && b.width > 0 }; });
    const hit = pills.filter((q) => q.vis && R.x <= q.b[0] + 2 && R.y <= q.b[1] + 2 && R.right >= q.b[0] + q.b[2] - 2 && R.bottom >= q.b[1] + q.b[3] - 2); return { ring: [R.x, R.y, R.width, R.height].map(Math.round), pills, hit: hit.length }; });
  ok(c && c.hit >= 1, 'the coins ring is around a coin count you can see ' + JSON.stringify(c));
  await p.screenshot({ path: OUT + '/v136_coins.png' });
  await p.evaluate(() => { window.__qbV136.tour.id = null; window.__qb.x().S.tours = { welcome: 1, train: 1, hideout: 1, hall: 1, players: 1, dq: 1, bty: 1, shop: 1 }; document.body.style.minHeight = ''; window.scrollTo(0, 0); document.querySelectorAll('#qbtour').forEach((e) => e.style.display = 'none'); }); await clear();
  /* two level-ups */
  await p.evaluate(() => { const x = window.__qb.x(); x.S.xp = x.cum(3); window.__qbV136.lv(2, null, 1); window.__qbV136.lv(3, null, 2); });
  const l1 = await p.evaluate(() => [...document.querySelectorAll('#layer .modal h2')].map((h) => h.textContent));
  await p.evaluate(() => document.getElementById('lvok').click()); await p.waitForTimeout(900);
  const l2 = await p.evaluate(() => [...document.querySelectorAll('#layer .modal h2')].map((h) => h.textContent));
  ok(l1.join() === 'Level 2' && l2.join() === 'Level 3', 'level-ups in order: ' + JSON.stringify([l1, l2])); await clear();
  /* Training: a plan session */
  await p.evaluate(() => { const S = window.__qb.x().S; S.areaOn = Object.assign(S.areaOn || {}, { train: 1 }); document.querySelector('.nav button[data-v="train"]').click(); }); await p.waitForTimeout(700); await clear();
  await p.evaluate(() => { const b = document.querySelector('[data-act="wkplan"]'); if (b) b.click(); }); await p.waitForTimeout(900);
  await p.evaluate(() => { const go = [...document.querySelectorAll('#layer .modal button')].find((b) => /start|begin|go/i.test(b.textContent)); if (go) go.click(); }); await p.waitForTimeout(900); await clear();
  let t = await p.evaluate(() => { const S = window.__qb.x().S, L = (S.wk && S.wk.list) || []; return { list: L.slice(), edits: document.querySelectorAll('.v36ex [data-act="v36ed"]').length, old: document.querySelectorAll('[data-act="v36set"],[data-act="v36sw"]').length }; });
  ok(t.list.length > 0 && t.edits >= t.list.length && t.old === 0, 'a session: one Edit button per exercise, no separate set/swap buttons ' + JSON.stringify(t));
  const first = t.list[0];
  const n0 = await p.evaluate((id) => (window.__qb.x().S.wk.setsN || {})[id] || window.__qbV136.ex(id)[2], first);
  const ed = async (id) => { await p.evaluate((id) => document.querySelector('[data-act="v36ed"][data-ex="' + id + '"]').click(), id); await p.waitForTimeout(400); };
  await ed(first);
  const win = await p.evaluate(() => { const m = document.querySelector('#layer .v36edm'); return m ? { name: document.getElementById('v36n').value, reps: document.getElementById('v36r').value, sets: document.getElementById('v36sv').textContent, pic: (m.querySelector('.v36pic') || {}).innerHTML || '' } : null; });
  ok(win && win.name && win.reps && +win.sets === n0, 'the Edit window shows name, reps, sets ' + JSON.stringify(win && { name: win.name, reps: win.reps, sets: win.sets }));
  await p.evaluate(() => { document.querySelector('[data-act="v36s"][data-d="1"]').click(); document.getElementById('v36r').value = '10-12'; document.querySelector('[data-act="v36save"]').click(); }); await p.waitForTimeout(500);
  let r = await p.evaluate((id) => { const S = window.__qb.x().S; return { n: S.wk.setsN[id], kept: (S.exSets || {})[id], reps: window.__qbV136.ex(id)[3], list0: S.wk.list[0], boxes: document.querySelector('[data-act="v36ed"][data-ex="' + id + '"]').closest('.ex').querySelectorAll('.sb').length }; }, first);
  ok(r.n === n0 + 1 && r.kept === n0 + 1 && r.reps === '10-12' && r.list0 === first && r.boxes === n0 + 1, 'sets +1 and reps 10-12 saved, the name kept so the demo stays ' + JSON.stringify(r));
  await ed(first); await p.evaluate(() => { document.getElementById('v36n').value = 'Hip thrusts'; document.querySelector('[data-act="v36save"]').click(); }); await p.waitForTimeout(500);
  r = await p.evaluate((id) => { const S = window.__qb.x().S; return { l: S.wk.list[0], swap: S.swap[id], tile: !!document.querySelector('.xcust'), name: [...document.querySelectorAll('.exhead b')].map((e) => e.textContent).includes('Hip thrusts'), reps: (window.__qbV136.ex('sw_' + id) || [])[3] }; }, first);
  ok(r.l === 'sw_' + first && r.swap && r.swap.n === 'Hip thrusts' && r.tile && r.name && r.reps === '10-12', 'renamed: Hip thrusts with an emoji, reps kept ' + JSON.stringify(r));
  await ed('sw_' + first);
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAFklEQVR4nGP8z8DAwMDAxMDAwMDAAAANHQEDasKb6QAAAABJRU5ErkJggg==', 'base64');
  await p.setInputFiles('#v36p', { name: 'x.png', mimeType: 'image/png', buffer: png }); await p.waitForTimeout(800);
  const pv = await p.evaluate(() => !!document.querySelector('#layer .v36edm .v36pic img')); ok(pv, 'the photo previews in the window');
  await p.evaluate(() => document.querySelector('[data-act="v36save"]').click()); await p.waitForTimeout(500);
  r = await p.evaluate((id) => ({ img: !!((window.__qb.x().S.swap[id] || {}).img), tile: !!document.querySelector('.xd.xphoto img') }), first);
  ok(r.img && r.tile, 'saved: the card shows the photo ' + JSON.stringify(r));
  await p.screenshot({ path: OUT + '/v136_edit.png' });
  await ed('sw_' + first); await p.evaluate(() => document.querySelector('[data-act="v36orig"]').click()); await p.waitForTimeout(500);
  const back = await p.evaluate((id) => { const S = window.__qb.x().S; return { l: S.wk.list[0], swap: S.swap[id] || null, reps: window.__qbV136.ex(id)[3] }; }, first);
  ok(back.l === first && !back.swap && back.reps !== '10-12', 'back to the original (name, demo and reps) ' + JSON.stringify(back));
  /* the guided session screen has the same Edit and shows the change at once */
  await p.evaluate(() => { const b = document.querySelector('[data-act="wkopen"]'); if (b) b.click(); }); await p.waitForTimeout(800);
  const g0 = await p.evaluate(() => !!document.querySelector('.cinner [data-act="v36ed"]')); ok(g0, 'the guided screen has Edit');
  await p.evaluate(() => document.querySelector('.cinner [data-act="v36ed"]').click()); await p.waitForTimeout(400);
  await p.evaluate(() => { document.getElementById('v36n').value = 'Hip thrusts'; document.querySelector('[data-act="v36save"]').click(); }); await p.waitForTimeout(600);
  const g1 = await p.evaluate(() => { const c = document.querySelector('.cinner'); return c ? { name: /Hip thrusts/.test(c.innerText), tile: !!c.querySelector('.xcust') } : null; });
  ok(g1 && g1.name && g1.tile, 'and after saving it shows Hip thrusts with an emoji ' + JSON.stringify(g1));
  await p.screenshot({ path: OUT + '/v136_guided.png' });
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
