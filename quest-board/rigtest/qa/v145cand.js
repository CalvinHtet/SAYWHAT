// QA's candidate check for v1.45 (release/v1.45 d38479aa; rollback-v1.43 b8909e0e = v1.43 at APPV 146). Plain builds, phone size,
// every request off this machine refused. One save moved between builds the way a phone would (the same JSON, put in before the page starts):
//   UP    level-30 and level-60 saves made on v1.43 code (rooms, coins, clothes, banked Rested XP, the Wheel spun today) opened on v1.45:
//         nothing lost, the level kept (60 moves to curve 8 at its level), appv 145, xpc8 set, no errors, the Board, Loft and card draw
//   DOWN  a v1.45 save mid-play (scratch card done today, a Momentum Surge running, surprise-loot state, gold pieces owned) opened on
//         the rollback: nothing lost, no errors, the Board and the Wheel screen draw; a level-60 save moved to curve 8 reads how high there
//   WEB   dist-web with LEAD's stand-in Firebase: boots past the creator, no page errors, no test hooks (__qb, __qbLoft, __qbV143,
//         __qbV144, __qbV146, __qbC8, __qbAlerts, __qbVisit), noTest on
//   NEW=<v1.45 server> OLD=<rollback server> WEB=<server of the release's quest-board/> MOCK=<mockfirebase.js> node v145cand.js
const pw = require('playwright'), fs = require('fs');
const NEW = process.env.NEW, OLD = process.env.OLD; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const open = async (base, save) => { const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 }); await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
    if (save) await ctx.addInitScript((s) => { try { if (!sessionStorage.getItem('qa-put')) { sessionStorage.setItem('qa-put', '1'); localStorage.setItem('quest-board', s); } } catch (e) {} }, save);
    const p = await ctx.newPage(); p.errs = []; p.on('pageerror', (e) => p.errs.push(e.message.slice(0, 200)));
    await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && QBLoft.data && document.querySelector('.nav button, #ccname'), null, { timeout: 120000 }); await p.waitForTimeout(4000); return { ctx, p }; };
  const V = (p, f, a) => p.evaluate(f, a);
  const shut = (p) => V(p, () => { document.querySelectorAll('#layer .modal,.overlay,.dropsplash').forEach((m) => m.remove()); try { if (window.TOUR) TOUR.id = null; } catch (e) {} });
  const nav = async (p, v) => { await shut(p); await V(p, (v) => { const e = document.querySelector('.nav button[data-v="' + v + '"]'); if (e) e.dispatchEvent(new MouseEvent('click', { bubbles: true })); }, v); await p.waitForTimeout(1000); await shut(p); return V(p, () => document.body.innerText.length); };
  const sum = (p) => V(p, () => { const x = window.__qb.x(), S = x.S; return { lv: x.effLvl(), raw: x.lvlOf(S.xp), xp: S.xp, coins: S.coins, rooms: S.base.slots.map((r) => r && r.t).join(','), ups: S.base.slots.map((r) => Object.keys((r && r.a) || {}).sort().join('+')).join('|'), owned: Object.keys(S.owned || {}).length, appv: S.appv, xpc8: S.xpc8 }; });
  const saved = async (p) => { await p.waitForTimeout(3000); return V(p, () => localStorage.getItem('quest-board')); };
  const make = (p, L) => V(p, (L) => { const x = window.__qb.x(), S = x.S, A = x.ADDONS; S.created = true; S.char = window.__qb.fixChar({ name: 'Up' + L, sex: 'f' }); S.cls = 'vanguard'; S.spec = 'berserker'; S.xp = Math.round(x.cum(L) + 0.37 * (x.cum(L + 1) - x.cum(L))); S.gates = [5, 10, 20, 30, 40, 50, 60].filter((g) => g <= L); S.calm = false; S.coins = 4321; S.tutDone = 1;
    S.tours = { welcome: 1, hideout: 1, train: 1, dq: 1, bty: 1, hall: 1, shop: 1, players: 1, wheel: 1 }; S.areaOn = { board: 1, train: 1, hideout: 1, shop: 1, hall: 1, players: 1, away: 1, wheel: 1, trophy: 1, sys: 1 };
    const some = (t) => Object.fromEntries((A[t] || []).filter((u) => !(u[3] && u[3].retired)).slice(0, 8).map((u) => [u[0], 1]));
    S.base.slots = [{ t: 'bedroom', a: Object.assign(some('bedroom'), { bd_ward2: 1 }), st: 0, pend: 0 }, { t: 'closet', a: {}, st: 0, pend: 0 }, { t: 'garden', a: some('garden'), st: 0, pend: 0 }];
    x.SHOP.filter((it) => /^a_/.test(it[1])).slice(0, 15).forEach((it) => { S.owned[it[0]] = true; }); x.persist(); x.render(); }, L);

  /* a first, cold load of each build before anything is measured (QA's first run wrote its save on v1.43 before the game had loaded) */
  for (const base of [OLD, NEW]) { const w = await open(base); await w.p.waitForTimeout(4000); await w.ctx.close(); }
  /* ---------- UP ---------- */
  for (const L of [30, 60]) { console.log('-- UP: a level-' + L + ' save made on v1.43 opened on v1.45');
    let { ctx, p } = await open(OLD); ok(await V(p, () => typeof window.__qbV144 === 'undefined'), 'the old build has no v1.45 code'); await make(p, L);
    const t = await V(p, () => { const d = new Date(Date.now() - 5 * 3600e3); return d.toISOString().slice(0, 10); });
    await V(p, (t) => { const S = window.__qb.x().S; S.wheel = t; S.wheelAt = Date.now() - 3600e3; S.rest = { x: 900, from: '2026-11-20' }; window.__qb.x().persist(); }, t);
    const before = await sum(p); let raw = await saved(p), tries = 0;
    while (JSON.parse(raw || '{}').xp !== before.xp && tries < 10) { tries++; await V(p, () => window.__qb.x().persist()); await p.waitForTimeout(1000); raw = await V(p, () => localStorage.getItem('quest-board')); }
    if (tries) console.log('     (v1.43 stored the test save only after ' + tries + ' more persist call' + (tries > 1 ? 's' : '') + ': test set-up timing on the old build)');
    const j = JSON.parse(raw); j.appv = 143; await ctx.close(); console.log('     on v1.43: ' + JSON.stringify(before));
    ok(j.created && j.xp === before.xp, 'the stored v1.43 save holds what was played (XP ' + j.xp + '; a save written before the game has loaded is skipped by persist: QA\'s first run hit that on a cold start)');
    ({ ctx, p } = await open(NEW, JSON.stringify(j))); await shut(p); const after = await sum(p); console.log('     on v1.45: ' + JSON.stringify(after));
    ok(after.raw === before.raw && after.coins === before.coins && after.rooms === before.rooms && after.ups === before.ups && after.owned === before.owned && (L <= 40 ? after.xp === before.xp : after.xp >= before.xp), 'nothing lost, level ' + before.raw + ' -> ' + after.raw + (L > 40 ? ' (XP ' + before.xp + ' -> ' + after.xp + ', moved to curve 8)' : ''));
    ok(after.appv === 145 && after.xpc8 === 1, 'the save now says appv 145, xpc8 1');
    const draws = [await nav(p, 'board'), await nav(p, 'hideout'), await nav(p, 'wheel').catch(() => 0), await nav(p, 'shop'), await nav(p, 'hall')]; ok(draws.every((n) => n > 150), 'Board, Loft, Shop, Town draw (' + draws.join(', ') + ' chars)');
    const card = await V(p, () => { const c = window.__qbV146.state(); return { ready: window.__qbV146.ready(), tasks: window.__qbV146.tasks(), d: c.d }; }); console.log('     the card on the update day: ' + JSON.stringify(card) + ' (the Wheel was spun today on v1.43)');
    ok(!p.errs.length, 'UP ' + L + ': no page errors ' + JSON.stringify(p.errs.slice(0, 3))); await ctx.close(); }

  /* ---------- DOWN ---------- */
  for (const L of [30, 60]) { console.log('-- DOWN: a level-' + L + ' v1.45 save mid-play on the rollback');
    let { ctx, p } = await open(NEW); await make(p, L); await shut(p);
    await V(p, () => { const x = window.__qb.x(), S = x.S; S.quests = [0, 1, 2, 3, 4].map((k) => ({ id: 'd' + k, name: 'Task ' + k, xp: 25, stat: 'discipline', cl: 'home', rep: 'daily' })); S.done = {}; S.cdone = {};
      S.surge = { n: 5, from: '2026-11-19', ids: {}, seen: 1 }; ['d0', 'd1', 'd2'].forEach((id) => x.toggle(id)); window.__qbV144.loot.give('cloth'); window.__qbV146.rnd(() => 0.0287); });
    await shut(p); await V(p, () => { for (const i of [0, 4, 8]) window.__qbV146.scratch(i); }); await p.waitForTimeout(1500); await shut(p);
    const before = await sum(p); const st = await V(p, () => ({ sc: window.__qbV146.state().res, surge: window.__qbV144.left(), loot: JSON.stringify(window.__qb.x().S.loot) })); console.log('     on v1.45: ' + JSON.stringify(before) + ' ' + JSON.stringify(st));
    const j = await saved(p); await ctx.close(); ok(JSON.parse(j).xp === before.xp, 'the stored v1.45 save holds what was played');
    ({ ctx, p } = await open(OLD, j)); await shut(p); const after = await sum(p); console.log('     on the rollback: ' + JSON.stringify(after));
    ok(after.coins === before.coins && after.rooms === before.rooms && after.ups === before.ups && after.owned === before.owned && after.xp === before.xp, 'nothing lost on the rollback (coins, rooms, upgrades, ' + after.owned + ' pieces, XP)');
    if (L <= 40) ok(after.raw === before.raw, 'level ' + before.raw + ' reads the same on the rollback');
    else console.log('     a level-' + before.raw + ' save on curve 8 reads level ' + after.raw + ' on the rollback\'s curve 7 (' + (after.raw - before.raw >= 0 ? '+' : '') + (after.raw - before.raw) + ')');
    const draws = [await nav(p, 'board'), await nav(p, 'hideout'), await nav(p, 'wheel').catch(() => 0), await nav(p, 'shop')]; ok(draws.every((n) => n > 150), 'Board, Loft, Wheel, Shop draw on the rollback (' + draws.join(', ') + ' chars)');
    ok(!p.errs.length, 'DOWN ' + L + ': no page errors ' + JSON.stringify(p.errs.slice(0, 3))); await ctx.close(); }

  /* ---------- WEB ---------- */
  if (process.env.WEB) { console.log('-- WEB: dist-web with the stand-in Firebase');
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 }); await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
    const MOCK = fs.readFileSync(process.env.MOCK, 'utf8'); await ctx.route(/firebase-(app|auth|firestore)-compat\.js/, (r) => r.fulfill({ contentType: 'text/javascript', body: /app-compat/.test(r.request().url()) ? MOCK : '' })); await ctx.route(/\/__\/firebase\/init\.json/, (r) => r.fulfill({ status: 404, body: '' }));
    await ctx.addInitScript(() => { window.__mockUid = 'qa145'; window.__mockSignedIn = 1; });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 200)));
    await p.goto(process.env.WEB + '/dist-web/index.html'); await p.waitForFunction(() => document.querySelector('[data-act="ccnext"]'), null, { timeout: 180000 });
    await p.fill('#ccname', 'Web'); await p.click('[data-act="ccnext"]'); await p.waitForFunction(() => document.querySelector('[data-act="ccdone"]'), null, { timeout: 120000 }); await p.waitForTimeout(800); await p.click('[data-act="ccdone"]'); await p.waitForTimeout(6000);
    const h = await p.evaluate(() => ({ hooks: Object.keys(window).filter((k) => /^__qb/.test(k)), nav: document.querySelectorAll('.nav button').length, live: !!(window.QB_WEB && QB_WEB.noTest), appv: (document.body.innerText.match(/v1\.\d+/) || [''])[0] }));
    console.log('     ' + JSON.stringify(h));
    ok(h.live && h.nav > 0, 'the web build boots past the creator (noTest on, ' + h.nav + ' tabs, ' + h.appv + ')');
    ok(h.hooks.every((k) => ['__qbLoad', '__qbWeb', '__qbGuest'].indexOf(k) >= 0), 'no test hooks on the web build, only the platform flags: ' + h.hooks.join(', ') + ' (__qbGuest: signed in as a non-owner)');
    ok(!errs.length, 'WEB: no page errors ' + JSON.stringify(errs.slice(0, 3))); await ctx.close(); }
  await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
