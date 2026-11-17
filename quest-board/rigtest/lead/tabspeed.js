// Tab switch speed in WebKit (Cal's phone is an iPhone), late save, 390x844 at 3x: the time from a tab tap to the second painted frame,
// first open and after, for every tab; then the same with the app's idle warm-up given time to run first (WARM=1 waits 8 s on the Board).
// Cal, 2026-11-16: "check the lag time and speed when changing tabs. It is a little slow here and there."
//   BASE=<server of quest-board/> NODE_PATH=<playwright's parent> [WARM=8000] node rigtest/lead/tabspeed.js
const { webkit } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:8779', WARM = +(process.env.WARM || 1500);
const VIEWS = (process.env.VIEWS || 'hideout,hall,players,shop,board,hideout,hall,players,shop,board,hideout,hall').split(',');
const ORDER = ['bedroom', 'closet', 'lair', 'patio', 'gameroom', 'restaurant', 'skybar', 'rooftop', 'boba', 'dessert', 'speakeasy', 'garden', 'theater', 'auditorium', 'mall', 'bowling', 'karaoke', 'arcade', 'rhythm', 'vr', 'club'];
(async () => {
  const b = await webkit.launch();
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true })).newPage();
  const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft, null, { timeout: 120000 }); await p.waitForTimeout(500);
  await p.evaluate(({ order }) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' });
    S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, loft: 1, town: 1, shop: 1, players: 1, hall: 1, hideout: 1 }; S.calm = false;
    S.gates = Array.from({ length: 200 }, (_, i) => i); S.xp = x.cum(60); S.coins = 999999; S.base.served = 1e6;
    S.areaOn = { board: 1, train: 1, hideout: 1, shop: 1, hall: 1, players: 1, trophy: 1, wheel: 1, away: 1 };
    S.base.slots = order.map((t) => ({ t, a: Object.fromEntries((x.ADDONS[t] || []).map((u) => [u[0], 1])), st: 0, pend: 0 })); x.render(); }, { order: ORDER });
  await p.waitForTimeout(WARM);
  const seen = {}, out = [];
  for (const v of VIEWS) {
    await p.evaluate(() => document.querySelectorAll('#layer .modal,.dropsplash,.bsplash,#qbtour,.coachscr').forEach((m) => m.remove()));
    const ms = await p.evaluate((v) => new Promise((done) => { const el = document.querySelector('.nav button[data-v="' + v + '"]'); if (!el) return done(-1);
      const t0 = performance.now(); el.click(); requestAnimationFrame(() => requestAnimationFrame(() => done(Math.round(performance.now() - t0)))); }), v);
    out.push(v + (seen[v] ? '' : '(1st)') + ' ' + ms); seen[v] = 1; await p.waitForTimeout(1800);
  }
  console.log('WebKit, warm-up wait ' + WARM + ' ms: ' + out.join('  '));
  console.log('errors', errs.length, errs.slice(0, 3)); await b.close();
})().catch((e) => { console.log('crash', e.message); process.exit(2); });
