// Every screen on Cal's v1.09 cleanup list (2026-11-17), signed in with a neighbour, on the stand-in Firebase: Board, Training, Hall
// Posts and Chat, Players (with Town square open), Shop (a brand, Wardrobe, Upgrades), a side quest on the Board. Full-page pictures to
// OUT, the visible text of each to OUT/text.json, page errors listed. For before/after: run on two builds.
//   QB_TARGET=web python3 tools/build.py; serve quest-board/ on PORT; NODE_PATH=<playwright's parent> OUT=<dir> node rigtest/lead/cloudshots.js
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const PORT = process.env.PORT || '8838', URL = 'http://127.0.0.1:' + PORT + '/dist-web/index.html', OUT = process.env.OUT || '/tmp/cloudshots';
const MOCK = fs.readFileSync(path.join(__dirname, 'mockfirebase.js'), 'utf8');
fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  await ctx.route(/firebase-(app|auth|firestore|storage)-compat\.js/, (r) => r.fulfill({ contentType: 'text/javascript', body: /app-compat/.test(r.request().url()) ? MOCK : '' }));
  await ctx.route(/\/__\/firebase\/init\.json/, (r) => r.fulfill({ status: 404, body: '' }));
  const cfg = path.join(__dirname, '../../dist-web/config.js');
  await ctx.route(/\/config\.js/, (r) => r.fulfill({ contentType: 'text/javascript', body: fs.readFileSync(cfg, 'utf8') + '\nwindow.QB_WEB.owners=["ana","ben"];window.QB_WEB.noTest=false;' }));
  const errs = [];
  const open = async (uid, name) => {
    const p = await ctx.newPage(); p.on('pageerror', (e) => errs.push(uid + ': ' + e.message.slice(0, 160)));
    await p.addInitScript((u) => { window.__mockUid = u; window.__mockSignedIn = 1; }, uid);
    await p.goto(URL);
    await p.waitForFunction(() => document.querySelector('[data-act="ccnext"]'), null, { timeout: 90000 }); await p.waitForTimeout(6000);
    await p.fill('#ccname', name); await p.click('[data-act="ccnext"]');
    await p.waitForFunction(() => document.querySelector('[data-act="ccdone"]'), null, { timeout: 60000 });
    await p.waitForTimeout(800); await p.click('[data-act="ccdone"]'); await p.waitForTimeout(4000);
    console.log(name, 'created', await p.evaluate(() => window.__qb.x().S.created));
    await p.evaluate((name) => { const x = window.__qb.x(), S = x.S;
      S.xp = x.cum(35); S.gates = Array.from({ length: 200 }, (_, i) => i); S.coins = 20000; S.calm = false; S.cls = Object.keys(window.__qbCls || {})[0] || S.cls || 'vanguard';
      S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, loft: 1, town: 1, shop: 1, players: 1, hall: 1, away: 1, banner: 1 }; S.unl = Object.assign({ console: 1, pets: 1, acc2: 1, sable7: 1 }, S.unl || {});
      S.areaOn = { board: 1, train: 1, hideout: 1, shop: 1, hall: 1, players: 1, trophy: 1, wheel: 1, away: 1 };
      const order = ['bedroom', 'closet', 'lair', 'patio', 'gameroom', 'restaurant'];
      S.base.slots = order.map((t) => ({ t, a: Object.fromEntries((x.ADDONS[t] || []).map((u) => [u[0], 1])), st: 0, pend: 0 }));
      try { x.persist && x.persist(); } catch (e) {} x.render(); }, name);
    await p.waitForTimeout(4000);
    await p.evaluate(() => document.querySelectorAll('#layer .modal').forEach((m) => m.remove()));
    return p;
  };
  const A = await open('ben', 'Ben');
  // a neighbour, written straight to the stand-in cloud (one page per context works; a second page in it does not start)
  await A.evaluate(() => { const L = window.__qb.lookOf(); firebase.firestore().doc('worlds/ana').set({ name: 'Ana', look: L, lv: 22, streak: 4, cls: '', rooms: ['bedroom', 'closet'], crew: 1, served: 10, t: Date.now(), appv: 108 }); });
  await A.waitForTimeout(2500);
  const clear = () => A.evaluate(() => { document.querySelectorAll('#layer .modal,.dropsplash,.bsplash,.coachscr,.qbtour,.tour').forEach((m) => m.remove()); const S = window.__qb.x().S; S.tours = Object.assign(S.tours || {}, { welcome: 1, dq: 1, bty: 1, train: 1, loft: 1, town: 1, shop: 1, players: 1, hall: 1 }); });
  const text = {};
  const shot = async (k) => { await A.waitForTimeout(900); await clear(); await A.waitForTimeout(300);
    await A.screenshot({ path: OUT + '/' + k + '.png', fullPage: true });
    text[k] = await A.evaluate(() => (document.getElementById('app').innerText || '').split('\n').map((s) => s.trim()).filter(Boolean)); };
  const nav = async (v) => { await clear(); await A.evaluate((v) => { const el = document.querySelector('.nav button[data-v="' + v + '"]') || document.querySelector('[data-act="nav"][data-v="' + v + '"]'); if (el) el.click(); }, v); await A.waitForTimeout(1500); };
  // a side quest taken 2 days ago, so its card is on the Board
  await A.evaluate(() => { const S = window.__qb.x().S; S.side = S.side || {}; S.side.on = S.side.on || {}; const d = new Date(Date.now() - 2 * 864e5); S.side.on.mara = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); });
  await nav('board'); await shot('board');
  await nav('train'); await shot('train');
  await nav('hall'); await A.waitForTimeout(2500); await shot('hall_posts');
  await A.evaluate(() => { const t = [...document.querySelectorAll('button')].find((x) => /^Chat$/.test(x.innerText.trim())); if (t) t.click(); }); await A.waitForTimeout(1200); await shot('hall_chat');
  await nav('players'); await A.waitForTimeout(1500);
  await A.evaluate(() => { const f = document.querySelector('[data-act="fshfold"][data-k="square"]'); if (f && !f.classList.contains('open')) f.click(); }); await A.waitForTimeout(2000); await shot('players');
  await nav('shop'); await shot('shop');
  await A.evaluate(() => { const t = document.querySelector('[data-v="upgrades"],[data-act="qsupg"]'); if (t) t.click(); }); await A.waitForTimeout(1000); await shot('shop_upgrades');
  fs.writeFileSync(OUT + '/text.json', JSON.stringify(text, null, 1));
  console.log('shots in ' + OUT + '; page errors: ' + errs.length + (errs.length ? '\n' + errs.slice(0, 5).join('\n') : ''));
  await b.close();
})().catch((e) => { console.log('crash', e.message); process.exit(2); });
