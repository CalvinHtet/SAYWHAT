// The Town Square (app/src/29p_square.js) with two players on the stand-in Firebase: each sees the other's character, a greeting reaches the
// other screen, pays once per pair per day, and does not disturb visit notes.
// QB_TARGET=web python3 tools/build.py; serve quest-board/ on PORT (default 8766); NODE_PATH=<playwright's parent> node rigtest/lead/squaretest.js [screenshot.png]
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const PORT = process.env.PORT || '8766', URL = 'http://127.0.0.1:' + PORT + '/dist-web/index.html', SHOT = process.argv[2];
const MOCK = fs.readFileSync(path.join(__dirname, 'mockfirebase.js'), 'utf8');
let fails = 0; const ok = (n, c, i) => { if (!c) fails++; console.log((c ? '  ok   ' : '  FAIL ') + n + (c ? '' : '  ' + JSON.stringify(i))); };
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  await ctx.route(/firebase-(app|auth|firestore)-compat\.js/, (r) => r.fulfill({ contentType: 'text/javascript', body: /app-compat/.test(r.request().url()) ? MOCK : '' }));
  await ctx.route(/\/__\/firebase\/init\.json/, (r) => r.fulfill({ status: 404, body: '' }));
  // both stand-in players are owners here, so the test can use Unlock everything to reach the Hall
  await ctx.route(/\/config\.js/, (r) => r.fulfill({ contentType: 'text/javascript', body: fs.readFileSync(path.join(__dirname, '../../dist-web/config.js'), 'utf8') + '\nwindow.QB_WEB.owners=["ana","ben"];' }));
  const open = async (uid, name) => {
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.addInitScript((u) => { window.__mockUid = u; window.__mockSignedIn = 1; }, uid);
    await p.goto(URL);
    await p.waitForFunction(() => document.querySelector('[data-act="ccnext"]'), null, { timeout: 90000 });
    await p.fill('#ccname', name); await p.click('[data-act="ccnext"]');
    await p.waitForFunction(() => document.querySelector('[data-act="ccdone"]'), null, { timeout: 60000 });
    await p.waitForTimeout(800); await p.click('[data-act="ccdone"]'); await p.waitForTimeout(3000);
    const clear = () => p.evaluate(() => document.querySelectorAll('#layer .modal').forEach((m) => m.remove()));
    await clear();
    await p.evaluate(() => document.querySelector('#qbt [data-q="t"]').click()); await p.waitForTimeout(300);
    await p.evaluate(() => document.querySelector('#qbt [data-q="all"]').click()); await p.waitForTimeout(6000);
    await clear();
    await p.evaluate(() => document.querySelector('.nav button[data-v="hall"]').click()); await p.waitForTimeout(2500);
    await clear();
    return { p, errs, clear };
  };
  const coins = (x) => x.p.evaluate(() => window.__qb.x().S.coins);
  const A = await open('ana', 'Ana'), B = await open('ben', 'Ben');
  await A.p.evaluate(() => document.querySelector('.nav button[data-v="hall"]').click());
  await A.p.waitForSelector('.sq-p[data-u="ben"]', { timeout: 30000 });
  await B.p.waitForSelector('.sq-p[data-u="ana"]', { timeout: 30000 });
  ok('each player sees the other in the square', true);
  await A.p.waitForTimeout(2500);
  const fig = await A.p.evaluate(() => { const i = document.querySelector('.sq-p[data-u="ben"] img.calp'); return { hy: !!(i && i.dataset.hy), src: i ? i.src.slice(0, 5) : '' , h: i ? i.getBoundingClientRect().height : 0 }; });
  ok('the other character is really drawn', fig.hy && /blob|data/.test(fig.src) && fig.h > 50, fig);
  const a0 = await coins(A), b0 = await coins(B);
  await A.clear();
  await A.p.click('.sq-p[data-u="ben"]'); await A.p.waitForSelector('.sq-card', { timeout: 5000 });
  ok('tapping opens their card with four greetings', (await A.p.$$('.sq-acts button')).length === 4);
  await A.p.click('[data-act="sqgo"][data-k="five"]');
  await B.p.waitForFunction((v) => window.__qb.x().S.coins === v + 5, b0, { timeout: 20000 }).catch(() => {});
  await A.p.waitForTimeout(1500);
  ok('the greeted player gets 5 coins', (await coins(B)) === b0 + 5, [b0, await coins(B)]);
  ok('the sender gets 5 coins', (await coins(A)) === a0 + 5, [a0, await coins(A)]);
  const feed = await B.p.evaluate(() => (document.querySelector('.sq-feed') || {}).innerText || '');
  ok('the feed on the other screen shows it', /Ana/.test(feed) && /Ben/.test(feed), feed);
  if (SHOT) { const h = await B.p.$('#sqbox'); if (h) await h.screenshot({ path: SHOT }); }
  await A.p.waitForTimeout(3000); await A.clear();
  await A.p.click('.sq-p[data-u="ben"]'); await A.p.waitForSelector('.sq-card', { timeout: 5000 });
  await A.p.click('[data-act="sqgo"][data-k="wave"]'); await A.p.waitForTimeout(5000);
  ok('a second greeting the same day pays nobody', (await coins(A)) === a0 + 5 && (await coins(B)) === b0 + 5, [await coins(A), await coins(B)]);
  const doc = await A.p.evaluate(() => { const r = localStorage.getItem('__mfb:pings/ana'); return r ? JSON.parse(JSON.parse(r).j) : null; });
  ok('the greeting is in the sender\'s own doc only', doc && doc.emo && doc.emo.ben && doc.emo.ben.k === 'wave', doc);
  await A.p.evaluate(() => document.querySelector('.sq-p[data-u="ana"]').click()); await A.p.waitForTimeout(400);
  ok('tapping yourself opens no card', !(await A.p.$('.sq-card')));
  ok('no page errors', A.errs.length + B.errs.length === 0, [A.errs.slice(0, 3), B.errs.slice(0, 3)]);
  await b.close(); console.log(fails ? 'FAILED ' + fails : 'ALL PASS'); process.exit(fails ? 1 : 0);
})().catch((e) => { console.log('crash', e.message); process.exit(2); });
