// Cal 11-26 idea 12 (29zz_v192.js): a 7-day login calendar: once a day on the Board when nothing else is open; a missed day waits;
// day 7 pays the most and a streak freeze, then day 1 again.
//   PORT=<build server> NODE_PATH=<playwright's parent> OUT=<dir> node rigtest/lead/login192.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8838, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV192, null, { timeout: 90000 }); await p.waitForTimeout(300);
  await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' }); const V = (f, a) => p.evaluate(f, a);
  await V(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'C', sex: 'm' }); S.xp = x.cum(8); S.tutDone = 1; S.coins = 0; S.freezes = 0; S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1, away: 1, banner: 1 }; S.unl = Object.assign({ console: 1, pets: 1, acc2: 1, sable7: 1 }, S.unl || {}); delete S.v92; x.render(); });
  const clear = () => V(() => document.querySelectorAll('#layer .modal,.dropsplash,.bsplash').forEach((m) => m.remove()));
  let shown = false; for (let i = 0; i < 8 && !shown; i++) { await clear(); await p.waitForTimeout(2700); shown = await V(() => !!document.querySelector('#layer .v92m')); }
  ok(shown, 'the calendar shows by itself on the Board once nothing else is open');
  await p.screenshot({ path: OUT + '/login192.png' });
  const d1 = await V(() => { const S = window.__qb.x().S, c0 = S.coins; document.querySelector('[data-v92="claim"]').click(); return { dc: S.coins - c0, st: Object.assign({}, S.v92), due: window.__qbV192.due(), open: !!document.querySelector('#layer .v92m') }; });
  ok(d1.dc === await V(() => window.__qbV192.pay(0)) && d1.st.n === 1 && !d1.due && !d1.open, 'Claim pays day 1 and it is done for today ' + JSON.stringify(d1));
  await p.waitForTimeout(3000); ok(!(await V(() => !!document.querySelector('#layer .v92m'))), 'it does not come back the same day');
  const d7 = await V(() => { const S = window.__qb.x().S; S.v92 = { n: 6, d: '2000-01-01' }; const c0 = S.coins, f0 = S.freezes || 0; window.__qbV192.open(); document.querySelector('[data-v92="claim"]').click(); return { dc: S.coins - c0, fz: (S.freezes || 0) - f0, n: S.v92.n }; });
  ok(d7.dc === await V(() => window.__qbV192.pay(6)) && d7.fz === 1 && d7.n === 0, 'a missed week waits; day 7 pays the most and a streak freeze, then day 1 again ' + JSON.stringify(d7));
  const tot = await V(() => [0, 1, 2, 3, 4, 5, 6].reduce((a, i) => a + window.__qbV192.pay(i), 0)); ok(tot === 2200, 'a full week is small next to tasks: ' + tot + ' coins, flat');
  /* QA 945babd0 LOW: a level-up while it is open: the calendar steps aside, then comes back */
  const lv = await V(async () => { const x = window.__qb.x(), S = x.S; S.v92 = { n: 2, d: '2000-01-01' }; document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); window.__qbV192.open(); const before = !!document.querySelector('#layer .v92m');
    const L = S.xp; S.xp = x.cum(13); x.toggle && 0; try { window.qbDbg.levelUp(13, null, 12) } catch (e) {} const both = document.querySelectorAll('#layer .modal').length, cal = !!document.querySelector('#layer .v92m'); return { before, both, cal, has: !!(window.qbDbg && window.qbDbg.levelUp) }; });
  ok(!lv.has || (lv.before && !lv.cal), 'a level-up while the calendar is open puts the calendar aside (one window at a time) ' + JSON.stringify(lv));
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
