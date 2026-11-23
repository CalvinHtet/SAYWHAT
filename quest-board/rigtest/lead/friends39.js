// Cal 11-23: Players is one level leaderboard; a player's card has the friendship level and the greetings; a greeting pays both 5 + 5 x
// level, counts toward friendship once per person per day, and a player can greet 2 different people a day; the card opens from chat.
//   QB_TARGET=web python3 tools/build.py; serve quest-board/ on PORT; NODE_PATH=<playwright's parent> node rigtest/lead/friends39.js
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const PORT = process.env.PORT || '8766', URL = 'http://127.0.0.1:' + PORT + '/dist-web/index.html'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
const MOCK = fs.readFileSync(path.join(__dirname, 'mockfirebase.js'), 'utf8'), CFG = fs.readFileSync(path.join(__dirname, '../../dist-web/config.js'), 'utf8');
(async () => { const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
  await ctx.route(/firebase-(app|auth|firestore)-compat\.js/, (r) => r.fulfill({ contentType: 'text/javascript', body: /app-compat/.test(r.request().url()) ? MOCK : '' }));
  await ctx.route(/\/__\/firebase\/init\.json/, (r) => r.fulfill({ status: 404, body: '' })); await ctx.route(/\/config\.js/, (r) => r.fulfill({ contentType: 'text/javascript', body: CFG + '\nwindow.QB_WEB.noTest=false;' }));
  const errs = []; const P = {};
  const open = async (uid, name) => { const p = await ctx.newPage(); p.on('pageerror', (e) => errs.push(uid + ': ' + e.message.slice(0, 160))); await p.addInitScript((u) => { window.__mockUid = u; window.__mockSignedIn = 1; }, uid); await p.goto(URL);
    await p.waitForFunction(() => document.querySelector('[data-act="ccnext"]'), null, { timeout: 90000 }); await p.fill('#ccname', name); await p.click('[data-act="ccnext"]');
    await p.waitForFunction(() => document.querySelector('[data-act="ccdone"]'), null, { timeout: 60000 }); await p.waitForTimeout(700); await p.click('[data-act="ccdone"]'); await p.waitForTimeout(3000);
    await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' });
    await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.xp = x.cum(4); S.areaOn = Object.assign(S.areaOn || {}, { hideout: 1, hall: 1 }); S.tours = { welcome: 1, hideout: 1, hall: 1, train: 1, players: 1, dq: 1, bty: 1, shop: 1, away: 1, wheel: 1, trophy: 1, sys: 1 }; window.__qbV136.tour.id = null; S.coins = 100; x.persist(); x.render(); });
    P[uid] = p; return p; };
  const hall = async (p) => { await p.evaluate(() => { document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); document.querySelector('.nav button[data-v="hall"]').click(); }); await p.waitForTimeout(2500); };
  const a = await open('ann', 'Ann'), bo = await open('bo', 'Bo'), cy = await open('cy', 'Cy'), di = await open('di', 'Di');
  for (const p of [bo, cy, di, a]) { await hall(p); }
  await a.evaluate(() => document.querySelector('.htab [data-t="style"]').click()); await a.waitForTimeout(2500);
  const lb = await a.evaluate(() => ({ tabs: document.querySelectorAll('.fsh-tg button').length, rows: [...document.querySelectorAll('.fsh-row .fsh-rn')].map((e) => e.textContent.trim()), head: (document.querySelector('#fshbox .note') || {}).textContent }));
  ok(lb.tabs === 0 && lb.rows.length >= 4, 'Players: one leaderboard, no tabs ' + JSON.stringify(lb));
  const card = async (p, name) => { await p.evaluate((n) => { const r = [...document.querySelectorAll('[data-act="fshview"]')].find((e) => e.textContent.includes(n)); if (r) r.click(); }, name); await p.waitForTimeout(900);
    return p.evaluate(() => { const m = document.querySelector('#layer .fsh-modal'); return m ? { fr: (m.querySelector('.v39fr') || {}).innerText || '', btns: [...m.querySelectorAll('[data-act="sqgo"]')].map((x) => x.textContent.trim() + (x.disabled ? '(off)' : '')) } : null; }); };
  let c = await card(a, 'Bo'); ok(c && /Friendship level 0/.test(c.fr) && c.btns.length === 3 && /pays you both 5 coins/.test(c.fr), 'Bo\'s card: friendship 0, three greetings, 5 coins ' + JSON.stringify(c));
  const coins = (p) => p.evaluate(() => window.__qb.x().S.coins);
  const bBefore = await coins(bo); const a0 = await coins(a); await a.evaluate(() => document.querySelector('[data-act="sqgo"][data-k="wave"]').click()); await a.waitForTimeout(2500);
  ok(await coins(a) === a0 + 5, 'Ann waves at Bo: +5 (' + a0 + ' -> ' + await coins(a) + ')'); console.log('day', JSON.stringify(await a.evaluate(() => [window.__qbV139.day(), window.__qbV139.box({ id: 'bo', name: 'Bo' }).replace(/<[^>]+>/g, ' ').slice(0, 120), document.querySelectorAll('#layer .modal').length])));
  c = await card(a, 'Bo'); console.log('modals', await a.evaluate(() => [...document.querySelectorAll('#layer .modal')].map((m) => m.className + ':' + m.innerText.slice(0, 60).replace(/\s+/g, ' ')))); ok(c && c.btns.every((x) => /\(off\)/.test(x)) && /greeted Bo today/.test(c.fr), 'once a day per person: the buttons are off ' + JSON.stringify(c));
  await a.evaluate(() => { document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); }); c = await card(a, 'Cy'); await a.evaluate(() => document.querySelector('[data-act="sqgo"][data-k="fist"]').click()); await a.waitForTimeout(2500);
  await a.evaluate(() => { document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); }); c = await card(a, 'Di');
  ok(c && c.btns.every((x) => /\(off\)/.test(x)) && /greeted 2 people today/.test(c.fr), 'two people a day: Di\'s card is off ' + JSON.stringify(c));
  const b0 = bBefore; await bo.evaluate(() => window.__qbV139 && 0); await bo.evaluate(async () => { await sqScanHook(); }).catch(() => {});
  await bo.reload(); await bo.waitForFunction(() => window.__qb && window.__qb.x && window.__qb.x().S.created, null, { timeout: 90000 }); await bo.waitForTimeout(6000);
  await hall(bo); await bo.evaluate(() => document.querySelector('.htab [data-t="style"]').click()); await bo.waitForTimeout(2000); c = await card(bo, 'Ann'); await bo.waitForTimeout(2500);
  const b1 = await coins(bo); ok(b1 === b0 + 5, 'Bo is paid 5 when his game reads the greetings (' + b0 + ' -> ' + b1 + ')');
  c = await card(bo, 'Ann'); ok(c && /Friendship level 1/.test(c.fr), 'and Bo sees friendship level 1 with Ann ' + JSON.stringify(c && c.fr));
  const lv = await a.evaluate(() => [0, 1, 2, 3, 5, 9, 15, 54, 55, 99].map((n) => window.__qbV139.lv(n)).join(',')); ok(lv === '0,1,1,2,2,3,5,9,10,10', 'level thresholds: ' + lv);
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
