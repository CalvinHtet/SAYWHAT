// Live sync with ten players (LEAD's 019f21f; Cal: "about 10 people playing ... synced perfectly so we can all see each others
// progress"): ten pages on one stand-in database that pushes (LEAD's mockdb.js), on random tabs. All ten change something at once
// (each its own streak and an upgrade; each page must see the other nine), then two post on the board in the same moment: every page must see all ten streaks, the
// upgrades and both posts; nobody's change may be lost. Then 60 s with nothing happening: count database writes (a quiet session
// should write next to nothing). Prints the slowest page's time for each step.   BASE=<server> QB=<quest-board folder> node live10.js
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:8769', QB = process.env.QB || '.', N = +(process.env.N || 10);
const CAPS = JSON.parse(fs.readFileSync(path.join(QB, 'app/dbcaps.json'), 'utf8')).capabilities.db.rules;
const MOCK = require(path.resolve(QB, 'rigtest/lead/mockdb.js'));
const fails = []; const ok = (n, c, g) => { console.log((c ? '  ok   ' : '  FAIL ') + n + (g !== undefined ? '  ' + JSON.stringify(g).slice(0, 300) : '')); if (!c) fails.push(n); };
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } }); const errs = []; const pages = [];
  const tabs = ['board', 'hall', 'shop', 'hideout', 'board', 'hall', 'train', 'board', 'hall', 'shop'];
  for (let i = 0; i < N; i++) {
    const p = await ctx.newPage(); p.on('pageerror', (e) => errs.push('p' + i + ': ' + e.message.slice(0, 120)));
    await p.addInitScript(MOCK, { uid: 'u_p' + i, owner: i === 0, rules: CAPS });
    await p.addInitScript(() => { const s = localStorage.setItem.bind(localStorage); window.__writes = 0; localStorage.setItem = (k, v) => { if (k.startsWith('__mdb:')) window.__writes++; return s(k, v); }; });
    await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && window.__qbLive, null, { timeout: 90000 }); await p.waitForTimeout(600);
    await p.evaluate(([name, tab]) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name, sex: name.length % 2 ? 'm' : 'f' }); S.xp = x.cum(10); delete S.areaOn; x.persist(); x.render(); document.querySelectorAll('.modal').forEach((e) => e.remove()); const bt = document.querySelector('.nav button[data-v="' + tab + '"]'); if (bt) bt.click(); }, ['P' + i, tabs[i % tabs.length]]);
    pages.push(p);
  }
  await pages[0].waitForTimeout(12000);
  const seenAll = async (test) => (await Promise.all(pages.map((p, i) => p.evaluate(() => window.__qbLive.soc()).then((w) => test(w, 'u_p' + i)))));
  const waitAll = async (label, test, ms) => { const t0 = Date.now(); let r = [];
    while (Date.now() - t0 < ms) { r = await seenAll(test); if (r.every(Boolean)) { ok(`${label}: all ${N} pages after ${((Date.now() - t0) / 1000).toFixed(1)} s`, true); return; } await pages[0].waitForTimeout(500); }
    ok(`${label}: ${r.filter(Boolean).length} of ${N} pages within ${ms / 1000} s`, false); };
  const others = (w, self) => w.worlds.filter((x) => x.id !== self);
  ok('every page subscribed', (await Promise.all(pages.map((p) => p.evaluate(() => window.__qbLive.state().on)))).every((v) => v === 1));
  // everyone at once: streak = 10 + i, one upgrade
  await Promise.all(pages.map((p, i) => p.evaluate((i) => { const x = window.__qb.x(), S = x.S; S.streak = 10 + i; const r = S.base.slots.filter(Boolean)[0], k = (x.ADDONS[r.t] || [])[i % 5]; r.a = r.a || {}; r.a[k[0]] = 1; x.persist(); }, i)));
  await waitAll('ten streaks at once', (w, me) => Array.from({ length: N }, (_, i) => i).filter((i) => 'u_p' + i !== me).every((i) => { const d = w.worlds.find((x) => x.id === 'u_p' + i); return d ? d.streak === 10 + i : false; }), 30000);
  await waitAll('ten upgrades at once', (w, me) => Array.from({ length: N }, (_, i) => i).filter((i) => 'u_p' + i !== me).every((i) => { const d = w.worlds.find((x) => x.id === 'u_p' + i); return d && d.ups >= 1; }), 30000);
  // two post at the same moment from the Hall
  await Promise.all([1, 5].map((i) => pages[i].evaluate((i) => { const t = document.getElementById('sntext'); if (!t) return; t.value = 'post from P' + i; t.dispatchEvent(new Event('input', { bubbles: true })); document.querySelector('[data-act="snpost"]').click(); }, i)));
  await waitAll('two posts made at once', (w) => w.posts.indexOf('post from P1') >= 0 && w.posts.indexOf('post from P5') >= 0, 30000);
  // quiet minute
  const w0 = await Promise.all(pages.map((p) => p.evaluate(() => window.__writes)));
  await pages[0].waitForTimeout(60000);
  const w1 = await Promise.all(pages.map((p) => p.evaluate(() => window.__writes)));
  const quiet = w1.map((v, i) => v - w0[i]);
  console.log('  database writes per page in a quiet minute:', quiet.join(' '));
  ok('a quiet minute writes little (at most 2 per page, the heartbeat)', quiet.every((v) => v <= 2), quiet);
  ok('no page errors', errs.length === 0, errs.slice(0, 3));
  console.log(fails.length ? 'FAILED ' + fails.length : 'PASS'); await b.close();
})();
