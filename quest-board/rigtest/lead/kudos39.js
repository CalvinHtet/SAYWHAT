// Cal 11-23: a kind note to Cal is private; Cal chooses +500, +500 and post, post only, or no; a posted note shows on the town board for
// 48 hours, then goes; the writer is paid 500 only when Cal chose the coins.
//   QB_TARGET=web python3 tools/build.py; serve quest-board/ on PORT; NODE_PATH=<playwright's parent> node rigtest/lead/kudos39.js
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const PORT = process.env.PORT || '8766', URL = 'http://127.0.0.1:' + PORT + '/dist-web/index.html'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
const MOCK = fs.readFileSync(path.join(__dirname, 'mockfirebase.js'), 'utf8'), CFG = fs.readFileSync(path.join(__dirname, '../../dist-web/config.js'), 'utf8');
(async () => { const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
  await ctx.route(/firebase-(app|auth|firestore)-compat\.js/, (r) => r.fulfill({ contentType: 'text/javascript', body: /app-compat/.test(r.request().url()) ? MOCK : '' }));
  await ctx.route(/\/__\/firebase\/init\.json/, (r) => r.fulfill({ status: 404, body: '' })); await ctx.route(/\/config\.js/, (r) => r.fulfill({ contentType: 'text/javascript', body: CFG + '\nwindow.QB_WEB.owners=["cal"];window.QB_WEB.noTest=false;' }));
  const errs = [];
  const open = async (uid, name) => { const p = await ctx.newPage(); p.on('pageerror', (e) => errs.push(uid + ': ' + e.message.slice(0, 160))); await p.addInitScript((u) => { window.__mockUid = u; window.__mockSignedIn = 1; }, uid); await p.goto(URL);
    await p.waitForFunction(() => document.querySelector('[data-act="ccnext"]'), null, { timeout: 90000 }); await p.fill('#ccname', name); await p.click('[data-act="ccnext"]');
    await p.waitForFunction(() => document.querySelector('[data-act="ccdone"]'), null, { timeout: 60000 }); await p.waitForTimeout(700); await p.click('[data-act="ccdone"]'); await p.waitForTimeout(3000);
    await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.xp = x.cum(4); S.areaOn = Object.assign(S.areaOn || {}, { hideout: 1, hall: 1 }); S.tours = { welcome: 1, hideout: 1, hall: 1, train: 1, players: 1, dq: 1, bty: 1 }; window.__qbV136.tour.id = null; x.persist(); x.render(); }); return p; };
  const w = await open('ann', 'Ann');
  await w.evaluate(async () => { await window.__qbKudos.load(); await window.__qbKudos.send('Cal, you made a game that got me to do my laundry. Legend.'); });
  const cal = await open('cal', 'Cal'); await cal.evaluate(async () => { await window.__qbKudos.load(); }); await cal.waitForTimeout(500);
  await cal.evaluate(() => window.__qbKudos.open()); await cal.waitForTimeout(1500);
  const q = await cal.evaluate(() => [...document.querySelectorAll('#layer .kd [data-kd="v39"]')].map((b) => b.textContent)); ok(q.join() === '+500,+500 and post,Post only,No', 'Cal\'s choices: ' + q.join(', '));
  await cal.evaluate(() => document.querySelector('[data-kd="v39"][data-c="500"][data-p="1"]').click()); await cal.waitForTimeout(2500);
  await cal.evaluate(() => { document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); document.querySelector('.nav button[data-v="hall"]').click(); }); await cal.waitForTimeout(2500);
  const post = await cal.evaluate(() => [...document.querySelectorAll('.snp p')].map((p) => p.textContent).filter((t) => /A note from Ann/.test(t))); ok(post.length === 1, 'the note is on the town board: ' + JSON.stringify(post));
  const c0 = await w.evaluate(() => window.__qb.x().S.coins); await w.evaluate(async () => { await window.__qbKudos.load(); }); await w.waitForTimeout(800); const c1 = await w.evaluate(() => window.__qb.x().S.coins);
  ok(c1 === c0 + 500, 'Ann is paid 500 (' + c0 + ' -> ' + c1 + ')');
  /* 48 hours on: the post is gone */
  await cal.evaluate(() => { const k = Object.keys(localStorage).find((k) => /__mfb:board\/cal$/.test(k)); const raw = JSON.parse(localStorage.getItem(k)), d = JSON.parse(raw.j); d.posts.forEach((p) => { if (p.kd) p.until = Date.now() - 1000; }); raw.j = JSON.stringify(d); localStorage.setItem(k, JSON.stringify(raw)); });
  await cal.evaluate(() => { document.querySelector('[data-act="snref"]') ? document.querySelector('[data-act="snref"]').click() : 0; }); await cal.reload(); await cal.waitForFunction(() => window.__qb && window.__qb.x && window.__qb.x().S.created, null, { timeout: 90000 }); await cal.waitForTimeout(3000);
  await cal.evaluate(() => { document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); document.querySelector('.nav button[data-v="hall"]').click(); }); await cal.waitForTimeout(3000);
  const gone = await cal.evaluate(() => [...document.querySelectorAll('.snp p')].map((p) => p.textContent).filter((t) => /A note from Ann/.test(t)).length); ok(gone === 0, 'after 48 hours it is gone');
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
