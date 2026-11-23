// QA: the milestone's saved state (S.ms) against the old Missions cleanup (28_missions.js:6 deletes S.ms every 5 s). A level-4 player
// (trial 5 passed) reaches level 6: the Level 5 milestone should open; tap "Later"; 7 s later change screen: it should open again with
// the same three pieces (fccf7c9: "a milestone stays waiting ... until one is chosen").
const pw = require('playwright'); const base = process.env.BASE, OUT = process.env.OUT;
(async () => { const b = await pw.chromium.launch(); const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 }); await ctx.route('**/*', (r) => (r.request().url().startsWith(base) ? r.continue() : r.abort())); const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && QBLoft.data, null, { timeout: 90000 }); await p.waitForTimeout(1500);
  const st = (lbl) => p.evaluate((lbl) => { const x = window.__qb.x(), m = document.querySelector('#layer .modal .ms-pick'); return lbl + ' ' + JSON.stringify({ eff: x.effLvl(), ms: x.S.ms, open: !!m, opts: m ? [...m.querySelectorAll('.ms-opt')].map((o) => o.dataset.id) : null }); }, lbl);
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.gates = [5]; S.xp = x.cum(4) + 5; S.areaOn = null; x.persist(); x.render(); document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); });
  await p.waitForTimeout(1200); console.log(await st('level 4, settled'));
  await p.evaluate(() => { const x = window.__qb.x(); x.S.xp = x.cum(6) + 5; x.persist(); x.render(); }); await p.waitForTimeout(1200);
  console.log(await st('level 6, +1.2 s')); await p.screenshot({ path: OUT + '_open.png' });
  await p.evaluate(() => { const c = document.querySelector('#layer .modal .ms-pick [data-act=mclose]'); if (c) c.click(); }); await p.waitForTimeout(300); console.log(await st('after Later'));
  for (const s of [3, 6, 9]) { await p.waitForTimeout(3000); console.log(await st(`+${s} s after Later`)); }
  await p.evaluate(() => { const n = [...document.querySelectorAll('.nav button')].find((b) => b.dataset.v && b.dataset.v !== 'board'); if (n) n.click(); }); await p.waitForTimeout(1500);
  console.log(await st('after changing screen')); await p.screenshot({ path: OUT + '_after.png' });
  console.log('page errors', errs.length, JSON.stringify(errs.slice(0, 2))); await b.close(); })();
