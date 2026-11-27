// QA's speed sweep 11-26 (29zz_v190.js): the sound is warmed before a purchase; the milestone icons survive a redraw; a Shop page's
// hidden categories load their icons; "look only" taps go at once while syncing.
//   PORT=<build server> NODE_PATH=<playwright's parent> OUT=<dir> node rigtest/lead/speed190.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8838; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] }); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV190, null, { timeout: 90000 }); await p.waitForTimeout(300);
  await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' }); const V = (f, a) => p.evaluate(f, a);
  const a0 = await V(() => window.__qbV190.ac()); await p.mouse.click(5, 300); await p.waitForTimeout(2500);
  const a1 = await V(() => ({ ac: window.__qbV190.ac(), nz: window.__qbV190.nz() }));
  ok(a0 === null && a1.ac && a1.nz, 'the sound system is made after the first tap, while idle, not at a purchase ' + JSON.stringify({ a0, a1 }));
  await V(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'C', sex: 'm' }); S.xp = x.cum(6); S.tutDone = 1; S.coins = 50000; S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1, away: 1, banner: 1 }; S.unl = Object.assign({ console: 1, pets: 1, acc2: 1, sable7: 1 }, S.unl || {});
    S.base.slots = [{ t: 'bedroom', a: { bd_ward1: 1, bd_ward2: 1 }, st: 0, pend: 0 }, { t: 'closet', a: {}, st: 0, pend: 0 }]; S.quests = [{ id: 't1', name: 'Stretch', cl: 'health', xp: 10, stat: 'vitality', rep: 'daily' }]; S.done = {}; x.render(); });
  await p.waitForTimeout(1500);
  const ms = await V(async () => { let o = document.querySelector('.ms-opt img'); if (!o) { document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); if (window.msOpen) window.msOpen(5); } o = document.querySelector('.ms-opt img'); if (!o) return { none: 1 };
    await new Promise((r) => setTimeout(r, 900)); o = document.querySelector('.ms-opt img'); o.__mark = 1; window.__qb.x().render(); await new Promise((r) => setTimeout(r, 50)); const n = document.querySelector('.ms-opt img'); return { same: !!(n && n.__mark), complete: !!(n && n.complete && n.naturalWidth) }; });
  ok(ms.none || (ms.same && ms.complete), 'the milestone icons are kept through a redraw, already drawn ' + JSON.stringify(ms));
  await V(() => document.querySelectorAll('#layer .modal').forEach((m) => m.remove()));
  await V(() => document.querySelector('.nav button[data-v="shop"]').click()); await p.waitForTimeout(1500); await V(() => document.querySelectorAll('#layer .modal').forEach((m) => m.remove()));
  await V(() => { const d = document.querySelector('[data-shub]'); if (d) d.click(); }); await p.waitForTimeout(1500);
  const rk = await V(() => ({ lazy: document.querySelectorAll('.qshop img[loading="lazy"]').length, all: document.querySelectorAll('.qshop img').length, hidden: document.querySelectorAll('.qshop .v81off img').length }));
  ok(rk.all > 0 && rk.lazy === 0, 'a Shop page loads its whole rack, the hidden categories too ' + JSON.stringify(rk));
  await V(() => document.querySelector('.nav button[data-v="board"]').click()); await p.waitForTimeout(600);
  await V(() => document.documentElement.classList.add('qb-sync'));
  const lk = await V(() => { const t = document.querySelector('[data-v67]'); if (!t) return { none: 1 }; t.click(); return { q: window.__qbV188.q().length, open: !!document.querySelector('#layer .modal') }; });
  ok(lk.none || (lk.q === 0 && lk.open), 'GOALS opens at once while syncing, not queued ' + JSON.stringify(lk));
  await V(() => document.documentElement.classList.remove('qb-sync'));
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
