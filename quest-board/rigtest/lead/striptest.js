// A Live build (web/config.js noTest) with the test hooks stripped (app/src/31_release.js), on the stand-in Firebase. A player with a full save
// keeps it, the hooks and Test tools are gone, the game still works, and a new player still starts at level 1.
// QB_TARGET=web python3 tools/build.py on a Live cut; serve quest-board/ on PORT (default 8766); NODE_PATH=<playwright's parent> node rigtest/lead/striptest.js
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const PORT = process.env.PORT || '8766', URL = 'http://127.0.0.1:' + PORT + '/dist-web/index.html';
const MOCK = fs.readFileSync(path.join(__dirname, 'mockfirebase.js'), 'utf8'), CFG = fs.readFileSync(path.join(__dirname, '../../dist-web/config.js'), 'utf8');
const GONE = ['__qb', '__qbLoft', '__qbRooms', '__qbStory', '__qbFriends', '__qbDrops', '__qbDungeon', '__qbEcon', '__qbBounty', '__qbTown', '__qbUnlock', '__qbPlaza', '__qbLive', '__qbFreedReq'];
let fails = 0; const ok = (n, c, i) => { if (!c) fails++; console.log((c ? '  ok   ' : '  FAIL ') + n + (c ? '' : '  ' + JSON.stringify(i))); };
let hooks = true; // on for setting up the save, off is the real Live config
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const fresh = async (uid) => {
    // no service worker: it would serve the first config.js again after the switch
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
    await ctx.route(/firebase-(app|auth|firestore)-compat\.js/, (r) => r.fulfill({ contentType: 'text/javascript', body: /app-compat/.test(r.request().url()) ? MOCK : '' }));
    await ctx.route(/\/__\/firebase\/init\.json/, (r) => r.fulfill({ status: 404, body: '' }));
    await ctx.route(/\/config\.js/, (r) => r.fulfill({ contentType: 'text/javascript', body: CFG + '\nwindow.QB_WEB.owners=["cal"];' + (hooks ? '\nwindow.QB_WEB.noTest=false;' : '') }));
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.addInitScript((u) => { window.__mockUid = u; window.__mockSignedIn = 1; }, uid);
    return { ctx, p, errs };
  };
  const clear = (p) => p.evaluate(() => document.querySelectorAll('#layer .modal').forEach((m) => m.remove()));
  const create = async (p) => {
    await p.goto(URL); await p.waitForFunction(() => document.querySelector('[data-act="ccnext"]'), null, { timeout: 90000 });
    await p.fill('#ccname', 'Tester'); await p.click('[data-act="ccnext"]');
    await p.waitForFunction(() => document.querySelector('[data-act="ccdone"]'), null, { timeout: 60000 });
    await p.waitForTimeout(800); await p.click('[data-act="ccdone"]'); await p.waitForTimeout(4000); await clear(p);
  };
  const stripped = (p) => p.evaluate((g) => ({ left: g.filter((k) => typeof window[k] !== 'undefined'), team: typeof window.__qbTeam, pill: !!document.getElementById('qbt') }), GONE);

  // a full save, made with the tools on
  const A = await fresh('cal'); await create(A.p);
  await A.p.evaluate(() => document.querySelector('#qbt [data-q="t"]').click()); await A.p.waitForTimeout(300);
  await A.p.evaluate(() => document.querySelector('#qbt [data-q="all"]').click()); await A.p.waitForTimeout(6000); await clear(A.p);
  const before = await A.p.evaluate(() => window.__qb.x().S.coins);
  ok('setup: the save has the coins to open everything', before >= 500000, before);
  await A.p.waitForTimeout(5000);

  // the same player on the real Live config
  hooks = false; A.errs.length = 0;
  await A.p.reload(); await A.p.waitForFunction(() => window.QBGAME && window.QBGAME.ready(), null, { timeout: 90000 }); await A.p.waitForTimeout(3500); await clear(A.p);
  const s = await stripped(A.p);
  ok('every test hook is gone', s.left.length === 0, s.left);
  ok('the team hook the game needs is still there', s.team === 'object', s.team);
  ok('no Test button at all, for the owner either', !s.pill);
  const coins = await A.p.evaluate(() => +(document.querySelector('.coinpill').innerText.replace(/\D/g, '')));
  ok('the save came through', coins >= before - 1000, [before, coins]);
  await A.p.evaluate(() => document.querySelector('.nav button[data-v="shop"]').click()); await A.p.waitForTimeout(2500); await clear(A.p);
  const shop = await A.p.evaluate(() => ({ dev: !!document.querySelector('.qs-dev'), len: document.body.innerText.length, lock: document.querySelector('.nav button[data-v="shop"]').className }));
  ok('the Shop opens with no Testing row', !shop.dev && !/lk/.test(shop.lock) && shop.len > 200, shop);
  await A.p.evaluate(() => document.querySelector('.nav button[data-v="hall"]').click()); await A.p.waitForTimeout(2500); await clear(A.p);
  ok('the Hall and Town Square still work', await A.p.isVisible('#sqbox'));
  await A.p.evaluate(() => document.querySelector('.nav button[data-v="hideout"]').click()); await A.p.waitForTimeout(3000); await clear(A.p);
  ok('The Loft still opens', await A.p.evaluate(() => !!document.querySelector('#lfwrap')));
  ok('no page errors on the Live config', A.errs.length === 0, A.errs.slice(0, 4));
  await A.ctx.close();

  // a brand-new player on the real Live config
  const B = await fresh('newbie'); await create(B.p);
  const n = await stripped(B.p), head = await B.p.evaluate(() => (document.body.innerText.match(/LEVEL\s*(\d+)/) || [])[1]);
  ok('a new player starts at level 1 with no hooks', head === '1' && n.left.length === 0 && !n.pill, { head, n });
  ok('no page errors for the new player', B.errs.length === 0, B.errs.slice(0, 4));
  await b.close(); console.log(fails ? 'FAILED ' + fails : 'ALL PASS'); process.exit(fails ? 1 : 0);
})().catch((e) => { console.log('crash', e.message); process.exit(2); });
