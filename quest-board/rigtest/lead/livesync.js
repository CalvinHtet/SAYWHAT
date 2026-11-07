// Live sync with three players on one stand-in database that pushes changes (LEAD, Cal 2026-11-07: "I need this to work with 10
// ppl and have everything synced perfectly so we can all see each others progress"). Ana, Ben and Cy are open at once, Ana and Cy
// NOT in the Hall. Ben levels up, buys a room upgrade, posts and says hi to Ana; each must reach Ana's and Cy's pages on its own,
// and the time it took is printed. Then pushes are switched off (NOPUSH=1) to show the old polling still covers it.
//   BASE=<server> QB=<quest-board folder> node rigtest/lead/livesync.js
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:65410', QB = process.env.QB || '.';
const CAPS = JSON.parse(fs.readFileSync(path.join(QB, 'app/dbcaps.json'), 'utf8')).capabilities.db.rules;
const MOCK = require('./mockdb.js');
const fails = []; const ok = (n, c, g) => { console.log((c ? '  ok   ' : '  FAIL ') + n + (g !== undefined ? '  ' + JSON.stringify(g) : '')); if (!c) fails.push(n); };
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  const errs = [];
  const open = async (uid, owner, name, hall) => {
    const p = await ctx.newPage(); p.on('pageerror', (e) => errs.push(name + ': ' + e.message));
    await p.addInitScript(MOCK, { uid, owner, rules: CAPS });
    if (process.env.NOPUSH) await p.addInitScript(() => { window.__noPush = 1; });
    await p.goto(BASE + '/dist/index.html');
    await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && window.__qbLive, null, { timeout: 60000 }); await p.waitForTimeout(800);
    await p.evaluate((name) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name, sex: 'm' }); S.xp = x.cum(10); delete S.areaOn; x.persist(); x.render(); }, name);
    await p.evaluate(() => document.querySelectorAll('.modal').forEach((e) => e.remove()));
    if (hall) { await p.evaluate(() => document.querySelector('.nav button[data-v="hall"]').click()); }
    return p;
  };
  const ana = await open('u_ana', true, 'Ana', 0), ben = await open('u_ben', false, 'Ben', 1), cy = await open('u_cy', false, 'Cy', 0);
  await ana.waitForTimeout(9000);
  const live = await ana.evaluate(() => window.__qbLive.state());
  ok('Ana subscribed (' + (process.env.NOPUSH ? 'pushes off' : 'pushes on') + ')', process.env.NOPUSH ? true : live.on === 1 && live.subs === 3, live);
  const soc = (p) => p.evaluate(() => window.__qbLive.soc());
  const wait = async (label, test, ms) => { const t0 = Date.now(); let r;
    while (Date.now() - t0 < ms) { r = await Promise.all([soc(ana), soc(cy)]); if (test(r[0]) && test(r[1])) { ok(label + ': Ana and Cy see it after ' + ((Date.now() - t0) / 1000).toFixed(1) + ' s', true); return; } await ana.waitForTimeout(250); }
    ok(label + ': not seen within ' + ms / 1000 + ' s', false, r); };
  const LIM = process.env.NOPUSH ? 150000 : 15000;
  const ben0 = (w) => (w.worlds.filter((x) => x.id === 'u_ben')[0] || {});
  // 1. Ben's streak goes up (a day of quests)
  const st = await ben.evaluate(() => { const x = window.__qb.x(); x.S.streak = 7; x.persist(); return 7; });
  await wait('Ben\'s 7-day streak', (w) => ben0(w).streak === st, LIM);
  // 2. Ben buys an upgrade in his Bedroom (any room he owns)
  const ups = await ben.evaluate(() => { const x = window.__qb.x(), S = x.S, r = S.base.slots.filter(Boolean)[0], k = (x.ADDONS[r.t] || [])[0]; r.a = r.a || {}; r.a[k[0]] = 1; x.persist(); return S.base.slots.reduce((a, r) => a + (r ? Object.keys(r.a || {}).length : 0), 0); });
  await wait('Ben has ' + ups + ' upgrades', (w) => ben0(w).ups === ups, LIM);
  // 3. Ben posts on the town board (he is in the Hall)
  await ben.evaluate(() => { document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); const t = document.getElementById('sntext'); t.value = 'hello from ben'; t.dispatchEvent(new Event('input', { bubbles: true })); document.querySelector('[data-act="snpost"]').click(); });
  await wait('Ben\'s post', (w) => w.posts.indexOf('hello from ben') >= 0, LIM);
  // 4. Ben says hi to Ana from her Loft
  await ben.evaluate(() => { document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); document.querySelector('[data-act="snvisit"][data-u="u_ana"]').click(); }); await ben.waitForTimeout(500);
  await ben.evaluate(() => { document.getElementById('snmsg').value = 'nice loft'; document.querySelector('[data-act="snhi"]').click(); });
  const t0 = Date.now(); let got = false; while (Date.now() - t0 < LIM) { const v = (await soc(ana)).vis; if (v.indexOf('Ben') >= 0) { got = true; break; } await ana.waitForTimeout(250); }
  ok('Ben\'s hi reaches Ana' + (got ? ' after ' + ((Date.now() - t0) / 1000).toFixed(1) + ' s' : ''), got);
  ok('no page errors', errs.length === 0, errs.slice(0, 3));
  console.log(fails.length ? 'FAILED ' + fails.length : 'PASS'); await b.close(); process.exit(fails.length ? 1 : 0); })();
