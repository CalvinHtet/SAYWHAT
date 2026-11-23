// Cal's 11-23 list part 2 (29zz_v132.js), plain build (PORT) against the build before it (REF): every drop before DROPS.shuf2 is as in
// REF on all three floors, and from it the order changes; the game master (sandbox flag here) sees a "Next drop" tab in the Shop a day
// before a drop, listing the incoming brands' pieces, and a player who is not does not; the Town's Posts tab shows the official notice
// and pays 500 once; the profile's Reset progress asks first, then starts a new character.
//   PORT=<plain build> REF=<build before> NODE_PATH=<playwright's parent> node rigtest/lead/v132.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8779, REF = process.env.REF || 8840; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
const open = async (b, port, gm) => { const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); p.errs = []; p.on('pageerror', (e) => p.errs.push(e.message.slice(0, 80) + ' @ ' + String(e.stack || '').split('\n').slice(1, 3).join(' | ').slice(0, 200)));
  if (gm) await p.addInitScript(() => { window.QB_WEB = { sandbox: true }; });
  await p.goto('http://127.0.0.1:' + port + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbDrops, null, { timeout: 90000 }); await p.waitForTimeout(800); return p; };
const floors = (p, d0, n) => p.evaluate(([d0, n]) => { const o = []; for (let d = 0; d < n; d++) { const t = new Date(2026, 10, d0 + d, 10, 0).getTime(), r = {}; for (const fl of ['street', 'boutique', 'atelier']) { const f = window.__qbDrops.floor(fl, t); r[fl] = ((f && f.live) || []).map((q) => q.id).sort().join(','); } o.push(r); } return o; }, [d0, n]);
const gone = (p) => p.evaluate(() => document.querySelectorAll('#layer .modal,.dropsplash,.bsplash').forEach((m) => m.remove()));
const setup = (p, day, hr) => p.evaluate(([day, hr]) => { const x = window.__qb.x(), S = x.S; const real = Date.now() - (window.__qbShift || 0); window.__qbShift = new Date(2026, 10, day, hr, 0).getTime() - real;
  S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(35); S.gates = Array.from({ length: 200 }, (_, i) => i); S.areaOn = { board: 1, shop: 1, hideout: 1, hall: 1, players: 1 }; S.calm = false; S.fsall = 1; S.coins = 1000; window.__qbRooms.open('closet', 1); x.render(); }, [day, hr]);
(async () => { const b = await chromium.launch();
  const P = await open(b, PORT, true), R = await open(b, REF, false);
  const a = await floors(P, 10, 100), r = await floors(R, 10, 100), first = a.findIndex((o, i) => JSON.stringify(o) !== JSON.stringify(r[i]));
  ok(first >= 20, 'every floor as before until ' + new Date(2026, 10, 10 + first).toDateString() + ' (shuf2 Mon 11-30)');
  ok(first >= 0, 'and a new order from then on');
  /* Wed 11-25 10 am: Thursday's drop is under a day away */
  await setup(P, 25, 10); await P.evaluate(() => document.querySelector('.nav button[data-v="shop"]').click()); for (let i = 0; i < 3; i++) { await P.waitForTimeout(700); await gone(P); }
  let has = await P.evaluate(() => !!document.querySelector('[data-act="stab"][data-v="gmnext"]')); ok(has, 'the game master sees a Next drop tab the day before');
  await P.evaluate(() => document.querySelector('[data-act="stab"][data-v="gmnext"]').click()); await P.waitForTimeout(900); await gone(P);
  const pv = await P.evaluate(() => ({ secs: [...document.querySelectorAll('.qs-sec h3')].map((h) => h.textContent), cards: document.querySelectorAll('.qs-grid [data-card]').length, buy: document.querySelectorAll('.qs-grid [data-act="buy"]').length }));
  ok(pv.secs.length >= 1 && pv.cards >= 10 && pv.buy === 0, 'it lists the incoming brands and their pieces, with no buy buttons ' + JSON.stringify(pv));
  /* a player who is not the game master */
  const Q = await open(b, PORT, false); await setup(Q, 25, 10); await Q.evaluate(() => document.querySelector('.nav button[data-v="shop"]').click()); await Q.waitForTimeout(1500); await gone(Q);
  has = await Q.evaluate(() => !!document.querySelector('[data-act="stab"][data-v="gmnext"]')); ok(!has, 'another player does not');
  /* the notice */
  await Q.evaluate(() => document.querySelector('.nav button[data-v="hall"]').click()); await Q.waitForTimeout(1500); await gone(Q);
  await Q.evaluate(() => { const t = [...document.querySelectorAll('[data-act="htab"],button')].find((x) => /^posts$/i.test((x.dataset && x.dataset.v) || '') || /^Posts$/i.test(x.textContent.trim())); if (t) t.click(); }); await Q.waitForTimeout(1000); await gone(Q);
  let n = await Q.evaluate(() => ({ t: (document.querySelector('.ntc h3') || {}).textContent, c0: window.__qb.x().S.coins }));
  ok(!n.t, 'no official notice on the Town board (the reboot, 29zz_v135.js: the launch letter pays the 500)');
  await Q.screenshot({ path: (process.env.OUT || '.') + '/v132_notice.png' });
  /* reset progress */
  await Q.evaluate(() => { const x = window.__qb.x(); x.render(); const btn = [...document.querySelectorAll('button,[data-act]')].find((e) => e.dataset && e.dataset.act === 'prof'); });
  const html = await Q.evaluate(() => window.__qb.x().profileHtml ? window.__qb.x().profileHtml() : null);
  ok(!html || /data-act="rspask"/.test(html), 'the profile has Reset progress');
  await Q.evaluate(() => { const d = document.createElement('div'); d.innerHTML = '<button data-act="rspask">x</button>'; document.body.appendChild(d); d.firstChild.click(); }); await Q.waitForTimeout(500);
  const asked = await Q.evaluate(() => !!document.querySelector('[data-act="rspok"]')); ok(asked, 'it asks first');
  await Q.evaluate(() => document.querySelector('[data-act="rspok"]').click()); await Q.waitForTimeout(1000);
  const st = await Q.evaluate(() => { const S = window.__qb.x().S; return { created: !!S.created, xp: S.xp, coins: S.coins }; }); ok(!st.created && !st.xp, 'then starts over ' + JSON.stringify(st));
  console.log('P', JSON.stringify(P.errs.slice(0,2)), 'Q', JSON.stringify(Q.errs.slice(0,2)), 'R', JSON.stringify(R.errs.slice(0,2))); const errs = P.errs.concat(Q.errs, R.errs); ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
