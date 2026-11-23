// Cal 11-23 after the reboot (29zz_v136.js): the coins step rings the coin count on screen (scrolled down too); two level-ups show 2 then
// 3; the cleared box keeps only its title; the task box asks for commas; Training: - Set / + Set on every exercise (remembered), a pencil
// to swap a plan's exercise for one you name (an emoji instead of the demonstration), and back.
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
  let t = await p.evaluate(() => { const S = window.__qb.x().S, L = (S.wk && S.wk.list) || []; return { list: L.slice(), bars: document.querySelectorAll('.v36ex').length, pencils: document.querySelectorAll('[data-act="v36sw"]').length }; });
  ok(t.list.length > 0 && t.bars >= t.list.length && t.pencils > 0, 'a session: every exercise has - Set / + Set, plan exercises a pencil ' + JSON.stringify(t));
  const first = t.list[0];
  const n0 = await p.evaluate((id) => (window.__qb.x().S.wk.setsN || {})[id] || window.__qbV136.ex(id)[2], first);
  await p.evaluate((id) => document.querySelector('[data-act="v36set"][data-d="1"][data-ex="' + id + '"]').click(), first); await p.waitForTimeout(300);
  const n1 = await p.evaluate((id) => ({ n: window.__qb.x().S.wk.setsN[id], kept: (window.__qb.x().S.exSets || {})[id], boxes: document.querySelector('[data-act="v36set"][data-ex="' + id + '"]').closest('.ex').querySelectorAll('.sb').length }), first);
  ok(n1.n === n0 + 1 && n1.kept === n0 + 1 && n1.boxes === n0 + 1, '+ Set adds a set and remembers it ' + JSON.stringify([n0, n1]));
  await p.evaluate((id) => document.querySelector('[data-act="v36set"][data-d="-1"][data-ex="' + id + '"]').click(), first); await p.waitForTimeout(300);
  const n2 = await p.evaluate((id) => window.__qb.x().S.wk.setsN[id], first); ok(n2 === n0, '- Set takes it away (' + n2 + ')');
  await p.evaluate((id) => document.querySelector('[data-act="v36sw"][data-ex="' + id + '"]').click(), first); await p.waitForTimeout(300);
  await p.fill('#v36swin', 'Hip thrusts'); await p.evaluate(() => document.querySelector('[data-act="v36swok"]').click()); await p.waitForTimeout(500);
  const sw = await p.evaluate((id) => { const S = window.__qb.x().S; return { list: S.wk.list.slice(), swap: S.swap[id], ex: window.__qbV136.ex('sw_' + id), tile: !!document.querySelector('.xcust'), name: [...document.querySelectorAll('.exhead b')].map((e) => e.textContent).includes('Hip thrusts') }; }, first);
  ok(sw.list[0] === 'sw_' + first && sw.swap && sw.swap.n === 'Hip thrusts' && sw.ex && sw.tile && sw.name, 'swapped: the card says Hip thrusts with an emoji tile ' + JSON.stringify({ l: sw.list[0], swap: sw.swap, ic: sw.ex && sw.ex[6] }));
  await p.screenshot({ path: OUT + '/v136_swap.png', fullPage: false });
  await p.evaluate(() => document.querySelector('[data-act="v36sw"][data-ex^="sw_"]').click()); await p.waitForTimeout(300);
  await p.evaluate(() => document.querySelector('[data-act="v36swback"]').click()); await p.waitForTimeout(500);
  const back = await p.evaluate((id) => { const S = window.__qb.x().S; return { l: S.wk.list[0], swap: S.swap[id] || null }; }, first);
  ok(back.l === first && !back.swap, 'swapped back ' + JSON.stringify(back));
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
