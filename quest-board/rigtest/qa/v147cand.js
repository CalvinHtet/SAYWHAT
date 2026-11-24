// QA's candidate check for v1.47 (release/v1.47 b2b7a2e3; rollback-v1.45 0d4a9f8e = v1.45 at APPV 148). Made from v145cand.js. Plain builds, phone size,
// every request off this machine refused. One save moved between builds the way a phone would (the same JSON, put in before the page starts):
//   UP    level-30 and level-60 saves made on v1.45 code (rooms, coins, clothes, banked Rested XP, the Wheel spun today) opened on v1.47:
//         nothing lost, the level kept (60 moves to curve 8 at its level), appv 147, no errors, the Board, Loft and card draw
//   DOWN  a v1.47 save mid-play (a 1-day bounty taken and on the Board, a 2-day bounty finished, a 3-day one taken, the Shop on its
//         home screen) opened on the rollback: nothing lost, no errors, the Board (with the bounty quests) and the Shop draw; ticking a
//         carried bounty quest there pays without an error
//   WEB   dist-web with LEAD's stand-in Firebase: boots past the creator, no page errors, no test hooks (__qb, __qbLoft, __qbV143,
//         __qbV144, __qbV146, __qbV147, __qbV149, __qbC8, __qbAlerts, __qbVisit), noTest on, and the Shop has no Testing row
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
  for (const L of [30, 60]) { console.log('-- UP: a level-' + L + ' save made on v1.45 opened on v1.47');
    let { ctx, p } = await open(OLD); ok(await V(p, () => typeof window.__qbV147 === 'undefined'), 'the old build has no v1.47 code'); await make(p, L);
    const t = await V(p, () => { const d = new Date(Date.now() - 5 * 3600e3); return d.toISOString().slice(0, 10); });
    await V(p, (t) => { const S = window.__qb.x().S; S.wheel = t; S.wheelAt = Date.now() - 3600e3; S.rest = { x: 900, from: '2026-11-20' }; window.__qb.x().persist(); }, t);
    const before = await sum(p); let raw = await saved(p), tries = 0;
    while (JSON.parse(raw || '{}').xp !== before.xp && tries < 10) { tries++; await V(p, () => window.__qb.x().persist()); await p.waitForTimeout(1000); raw = await V(p, () => localStorage.getItem('quest-board')); }
    if (tries) console.log('     (the old build stored the test save only after ' + tries + ' more persist call' + (tries > 1 ? 's' : '') + ': test set-up timing on the old build)');
    const j = JSON.parse(raw); j.appv = 145; await ctx.close(); console.log('     on v1.45: ' + JSON.stringify(before));
    ok(j.created && j.xp === before.xp, 'the stored v1.45 save holds what was played (XP ' + j.xp + '; a save written before the game has loaded is skipped by persist: QA\'s first run hit that on a cold start)');
    ({ ctx, p } = await open(NEW, JSON.stringify(j))); await shut(p); const after = await sum(p); console.log('     on v1.47: ' + JSON.stringify(after));
    ok(after.raw === before.raw && after.coins === before.coins && after.rooms === before.rooms && after.ups === before.ups && after.owned === before.owned && after.xp === before.xp, 'nothing lost, level ' + before.raw + ' -> ' + after.raw + ', XP ' + before.xp + ' -> ' + after.xp);
    ok(after.appv === 147 && after.xpc8 === 1, 'the save now says appv 147, xpc8 1');
    const draws = [await nav(p, 'board'), await nav(p, 'hideout'), await nav(p, 'wheel').catch(() => 0), await nav(p, 'shop'), await nav(p, 'hall')]; ok(draws.every((n) => n > 150), 'Board, Loft, Shop, Town draw (' + draws.join(', ') + ' chars)');
    const bq = await V(p, () => ({ cards: document.querySelectorAll('.bty-card.bq').length || (window.__qb.x().render(), document.querySelectorAll('.bty-card.bq').length), shopHome: (window.__qbV149 && window.__qbV149.hub()) })); console.log('     on v1.47: bounty cards ' + bq.cards + ', Shop screen ' + bq.shopHome);
    ok(!p.errs.length, 'UP ' + L + ': no page errors ' + JSON.stringify(p.errs.slice(0, 3))); await ctx.close(); }

  /* ---------- DOWN ---------- */
  for (const L of [30, 60]) { console.log('-- DOWN: a level-' + L + ' v1.47 save with bounties on the rollback');
    let { ctx, p } = await open(NEW); await make(p, L); await shut(p);
    await V(p, () => { const x = window.__qb.x(), S = x.S; S.quests = [0, 1, 2, 3, 4].map((k) => ({ id: 'd' + k, name: 'Task ' + k, xp: 25, stat: 'discipline', cl: 'home', rep: 'daily' })); S.done = {}; S.cdone = {};
      ['d0', 'd1', 'd2'].forEach((id) => x.toggle(id)); const H = window.__qbV147; const A1 = H.take(1); const A2 = H.take(2); x.toggle(A2.qid); H.take(3); });
    await p.waitForTimeout(1200); await shut(p);
    const before = await sum(p); const st = await V(p, () => { const b = window.__qbV147.state(); return { act: Object.keys(b.act).map((k) => k + ':' + (b.act[k].done ? 'done' : 'on') + ':' + b.act[k].n.slice(0, 20)).join(' | '), bq: window.__qb.x().S.quests.filter((q) => q.bty).map((q) => q.name.slice(0, 18) + '(' + q.bty.k + ',' + q.bty.end + (window.__qb.x().S.done[q.id] ? ',done' : '') + ')').join(' ') }; }); console.log('     on v1.47: ' + JSON.stringify(before) + '\n     bounties ' + JSON.stringify(st));
    const j = await saved(p); await ctx.close(); ok(JSON.parse(j).xp === before.xp, 'the stored v1.47 save holds what was played');
    ({ ctx, p } = await open(OLD, j)); await shut(p); const after = await sum(p); console.log('     on the rollback: ' + JSON.stringify(after));
    ok(after.coins === before.coins && after.rooms === before.rooms && after.ups === before.ups && after.owned === before.owned && after.xp === before.xp, 'nothing lost on the rollback (coins, rooms, upgrades, ' + after.owned + ' pieces, XP)');
    if (L <= 40) ok(after.raw === before.raw, 'level ' + before.raw + ' reads the same on the rollback');
    else console.log('     a level-' + before.raw + ' save on curve 8 reads level ' + after.raw + ' on the rollback\'s curve 7 (' + (after.raw - before.raw >= 0 ? '+' : '') + (after.raw - before.raw) + ')');
    const draws = [await nav(p, 'board'), await nav(p, 'hideout'), await nav(p, 'wheel').catch(() => 0), await nav(p, 'shop')]; ok(draws.every((n) => n > 150), 'Board, Loft, Wheel, Shop draw on the rollback (' + draws.join(', ') + ' chars)');
    const rb = await V(p, () => { const x = window.__qb.x(), S = x.S; const qs = S.quests.filter((q) => q.bty && !S.done[q.id]); const r = { carried: S.quests.filter((q) => q.bty).length, open: qs.length, tags: qs[0] ? x.mults(qs[0]).tags.join(',') : '' }; if (qs[0]) { const c0 = S.coins; x.toggle(qs[0].id); r.paid = S.coins - c0; } return r; });
    console.log('     on the rollback: ' + rb.carried + ' bounty quests carried, ' + rb.open + ' open, ticking one: ' + rb.tags + ', +' + rb.paid + ' coins');
    ok(rb.carried >= 2 && rb.paid > 0, 'the bounty quests ride along on the rollback\'s Board and a carried one ticks and pays (no bounty bonus coins there)');
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
    await p.evaluate(() => { document.querySelectorAll('#layer .modal,.dropsplash').forEach((m) => m.remove()); const e = document.querySelector('.nav button[data-v="shop"]'); if (e) e.dispatchEvent(new MouseEvent('click', { bubbles: true })); }); await p.waitForTimeout(1200);
    const tr = await p.evaluate(() => ({ dev: !!document.querySelector('.qs-dev'), testing: /Testing:|Skip ahead one week|Add 10,000 coins/.test(document.body.innerText), pill: !!document.getElementById('qbt'), shop: document.documentElement.getAttribute('data-view') }));
    console.log('     web Shop: ' + JSON.stringify(tr)); ok(!tr.dev && !tr.testing && !tr.pill, 'the web build\'s Shop has no Testing row and no Test pill');
    ok(!errs.length, 'WEB: no page errors ' + JSON.stringify(errs.slice(0, 3))); await ctx.close(); }
  await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
