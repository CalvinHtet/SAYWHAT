// QA's candidate check for v1.43 (release/v1.43 0270ae4d; rollback-v1.41 3d34c2ba). Plain builds, phone size, every request off this
// machine refused. Each step moves one save between builds the way a player's phone would (the same save JSON, read out of one build's
// localStorage and put into the other's before the page starts):
//   UP    a level-12 save made on v1.41 code (no Closet, Cabinet owned, the Closet's card already looked at) opened on v1.43:
//         nothing lost (level, coins, rooms, upgrades, clothes), the Loft's "!" once, the Closet first in the Bedroom
//   DOWN  a v1.43 save that bought the Closet first (no Cabinet) opened on the rollback: nothing lost, no page errors, the Closet
//         still a room, the Shop still open, the Bedroom window opens
//   WEB   the web build (dist-web, signed in through LEAD's stand-in Firebase): boots to the creator with no page errors, and the
//         test hooks (__qb, __qbLoft, __qbV143, __qbAlerts) are absent
//   NEW=<v1.43 server> OLD=<rollback server> WEB=<server of the v1.43 quest-board/> MOCK=<rigtest/lead/mockfirebase.js> node v143cand.js
const pw = require('playwright'), fs = require('fs');
const NEW = process.env.NEW, OLD = process.env.OLD; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const open = async (base, save) => { const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 }); await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
    if (save) await ctx.addInitScript((s) => { try { if (!sessionStorage.getItem('qa-put')) { sessionStorage.setItem('qa-put', '1'); localStorage.setItem('quest-board', s); } } catch (e) {} }, save);
    const p = await ctx.newPage(); p.errs = []; p.on('pageerror', (e) => p.errs.push(e.message.slice(0, 200)));
    await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && QBLoft.data, null, { timeout: 120000 }); await p.waitForTimeout(2500); return { ctx, p }; };
  const V = (p, f, a) => p.evaluate(f, a);
  const shut = (p) => V(p, () => { document.querySelectorAll('#layer .modal,.overlay,.dropsplash').forEach((m) => m.remove()); try { if (window.TOUR) TOUR.id = null; } catch (e) {} });
  const nav = async (p, v) => { await shut(p); await V(p, (v) => { const e = document.querySelector('.nav button[data-v="' + v + '"]'); if (e) e.dispatchEvent(new MouseEvent('click', { bubbles: true })); }, v); await p.waitForTimeout(900); await shut(p); };
  const bang = (p, v) => V(p, (v) => { const e = document.querySelector('.nav button[data-v="' + v + '"]'); return e ? (e.querySelector('.nbang') ? 'bang' : 'none') : 'no button'; }, v);
  const sum = (p) => V(p, () => { const x = window.__qb.x(), S = x.S; return { lv: x.effLvl(), xp: S.xp, coins: S.coins, rooms: S.base.slots.map((r) => r && r.t).join(','), ups: S.base.slots.map((r) => Object.keys((r && r.a) || {}).sort().join('+')).join('|'), owned: Object.keys(S.owned || {}).length, appv: S.appv }; });
  const saved = async (p) => { await p.waitForTimeout(3000); return V(p, () => localStorage.getItem('quest-board')); };
  const shopFloors = async (p) => { await nav(p, 'shop'); const n = await V(p, () => document.querySelectorAll('[data-act="stab"]').length); await nav(p, 'board'); return n; };

  /* ---------- UP: v1.41 -> v1.43 ---------- */
  { console.log('-- UP: a v1.41 save opened on v1.43');
    let { ctx, p } = await open(OLD); ok(await V(p, () => typeof window.__qbV143 === 'undefined'), 'the old build has no v1.43 code');
    await V(p, () => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Old', sex: 'f' }); S.cls = 'vanguard'; S.xp = x.cum(12) + 40; S.gates = [5, 10]; S.calm = false; S.coins = 4321;
      S.tours = { welcome: 1, hideout: 1, train: 1, dq: 1, bty: 1, hall: 1, shop: 1, players: 1 }; S.tutDone = 1;
      S.areaOn = { board: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, away: 1, wheel: 1, trophy: 1, sys: 1 }; /* a real level-12 save has its areas open (QA's first run left the Loft waiting) */
      const r = S.base.slots.find((q) => q && q.t === 'bedroom'); r.a = Object.assign(r.a || {}, { bd_bed1: 1, bd_chair0: 1, bd_rug: 1, bd_nstand: 1, bd_ward1: 1 });
      x.SHOP.filter((it) => /^a_/.test(it[1])).slice(0, 12).forEach((it) => { S.owned[it[0]] = true; }); x.persist(); x.render(); });
    await nav(p, 'hideout'); await nav(p, 'board'); /* the Loft looked at on v1.41, so the Closet's card counts as seen there */
    const before = await sum(p); const s1 = await saved(p); const seen = await V(p, () => JSON.stringify((window.__qb.x().S.alSeen || {}).room || {}));
    console.log('     on v1.41:', JSON.stringify(before), '| rooms seen', seen); await ctx.close();
    const j = JSON.parse(s1); j.appv = 141; /* the rollback build stamps 144; a real v1.41 phone stamps 141 */
    ({ ctx, p } = await open(NEW, JSON.stringify(j))); await shut(p); const after = await sum(p);
    ok(after.lv === before.lv && after.xp === before.xp && after.coins === before.coins && after.rooms === before.rooms && after.ups === before.ups && after.owned === before.owned, 'nothing lost: ' + JSON.stringify(after));
    ok(after.appv === 143, 'the save now says appv ' + after.appv);
    await nav(p, 'board'); ok((await bang(p, 'hideout')) === 'bang', 'the Loft\'s "!" comes once on v1.43');
    const first = await V(p, () => { const S = window.__qb.x().S; const i = S.base.slots.findIndex((r) => r && r.t === 'bedroom'); window.__qb.roomModal(i); const c = document.querySelector('.rmodal .addon:not(.got)'); const r = c ? c.dataset.aid + ' ' + c.innerText.replace(/\s+/g, ' ').slice(0, 40) : ''; document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); return r; });
    ok(/^bd_ward2/.test(first), 'the Closet is first in the Bedroom: ' + first);
    await nav(p, 'hideout'); await nav(p, 'board'); ok((await bang(p, 'hideout')) === 'none', 'cleared by opening the Loft');
    ok(!p.errs.length, 'UP: no page errors ' + JSON.stringify(p.errs.slice(0, 3))); await ctx.close(); }

  /* ---------- DOWN: a v1.43 save with the Closet bought first, on the rollback ---------- */
  { console.log('-- DOWN: a v1.43 save (Closet without Cabinet) on rollback-v1.41');
    let { ctx, p } = await open(NEW);
    await V(p, () => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'New', sex: 'm' }); S.cls = 'vanguard'; S.xp = x.cum(3) + 5; S.calm = false; S.coins = 2000;
      S.tours = { welcome: 1, hideout: 1, train: 1, dq: 1, bty: 1, hall: 1 }; S.tutDone = 1; x.persist(); x.render(); });
    await shut(p); const price = await V(p, () => { const S = window.__qb.x().S; const i = S.base.slots.findIndex((r) => r && r.t === 'bedroom'); window.__qb.roomModal(i); const bt = document.querySelector('.rmodal button[data-act="raddon"][data-id="bd_ward2"]'); if (!bt) return -1; const c0 = S.spent || 0; bt.click(); return (S.spent || 0) - c0; }); /* spent, not coins: the buy also ticks a First steps card worth +50 */
    await p.waitForTimeout(2000); await shut(p); ok(price === 600, 'v1.43: the Closet bought first for ' + price);
    const before = await sum(p); const s2 = await saved(p); console.log('     on v1.43:', JSON.stringify(before), '| Shop floors', await shopFloors(p)); await ctx.close();
    ({ ctx, p } = await open(OLD, s2)); await shut(p); const after = await sum(p);
    ok(after.lv === before.lv && after.coins === before.coins && after.rooms === before.rooms && after.ups === before.ups, 'nothing lost on the rollback: ' + JSON.stringify(after));
    ok((await shopFloors(p)) > 0, 'the Shop is still open on the rollback');
    const w = await V(p, () => { const S = window.__qb.x().S; const i = S.base.slots.findIndex((r) => r && r.t === 'bedroom'); window.__qb.roomModal(i); const M = document.querySelector('.rmodal'); const t = M ? M.textContent.replace(/\s+/g, ' ') : ''; document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); return { opened: !!M, cab: /Figurine Cabinet/.test(t), closet: /Walk-in Closet/.test(t) }; });
    ok(w.opened, 'the Bedroom window opens');
    console.log('     on the rollback: Closet ' + (w.closet ? 'listed' : 'not listed (v1.41 lists only what it would sell or what is installed beside the Cabinet)') + ', Figurine Cabinet ' + (w.cab ? 'listed' : 'not listed (v1.41 hides it once the Closet is owned: no buying it until v1.43 is back)'));
    await nav(p, 'hideout'); await V(p, () => { const g = document.querySelectorAll('[data-act="bldgo"]')[0]; if (g) g.dispatchEvent(new MouseEvent('click', { bubbles: true })); }); await p.waitForTimeout(3000); await shut(p);
    ok(!p.errs.length, 'DOWN: no page errors ' + JSON.stringify(p.errs.slice(0, 3))); await ctx.close(); }

  /* ---------- GATE: level 3 while the Loft still waits for its one-a-day reveal ---------- */
  { console.log('-- GATE: level 3, the Loft not revealed yet');
    const { ctx, p } = await open(NEW);
    await V(p, () => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Gate', sex: 'f' }); S.cls = 'vanguard'; S.xp = x.cum(3) + 5; S.calm = false; S.tutDone = 1;
      S.tours = { welcome: 1, train: 1, dq: 1, bty: 1 }; S.areaOn = { board: 1, train: 1, shop: 1, away: 1, sys: 1 }; S.unlockDay = new Date().toISOString().slice(0, 10); S.areaDay = S.unlockDay; x.persist(); x.render(); });
    await p.waitForTimeout(1500); await shut(p);
    const g = await V(p, () => ({ waiting: window.__qbUnlock.waiting('hideout'), loftOn: !!window.__qbUnlock.on().hideout, tabs: window.__qbV143.tabs() }));
    await nav(p, 'board'); const lb = await bang(p, 'hideout'); await V(p, () => { const e = document.querySelector('.nav button[data-v="hideout"]'); if (e) e.dispatchEvent(new MouseEvent('click', { bubbles: true })); }); await p.waitForTimeout(400);
    const pop = await V(p, () => [...document.querySelectorAll('#layer > *')].map((m) => m.textContent.replace(/\s+/g, ' ').trim()).filter(Boolean).join(' | ').slice(0, 160));
    console.log('     Loft waiting ' + g.waiting + ', open ' + g.loftOn + ', alert tabs ' + JSON.stringify(g.tabs) + ', Loft button ' + lb + ', tapping it says: ' + pop);
    await p.screenshot({ path: (process.env.OUT || '.') + '/v143_gate.png' });
    ok(!p.errs.length, 'GATE: no page errors ' + JSON.stringify(p.errs.slice(0, 3))); await ctx.close(); }

  /* ---------- WEB: the build players load ---------- */
  if (process.env.WEB) { console.log('-- WEB: dist-web with the stand-in Firebase');
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 }); await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
    const MOCK = fs.readFileSync(process.env.MOCK, 'utf8'); await ctx.route(/firebase-(app|auth|firestore)-compat\.js/, (r) => r.fulfill({ contentType: 'text/javascript', body: /app-compat/.test(r.request().url()) ? MOCK : '' })); await ctx.route(/\/__\/firebase\/init\.json/, (r) => r.fulfill({ status: 404, body: '' }));
    await ctx.addInitScript(() => { window.__mockUid = 'qa143'; window.__mockSignedIn = 1; });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 200)));
    await p.goto(process.env.WEB + '/dist-web/index.html'); await p.waitForFunction(() => document.querySelector('[data-act="ccnext"]'), null, { timeout: 180000 });
    await p.fill('#ccname', 'Web'); await p.click('[data-act="ccnext"]'); await p.waitForFunction(() => document.querySelector('[data-act="ccdone"]'), null, { timeout: 120000 }); await p.waitForTimeout(800); await p.click('[data-act="ccdone"]'); await p.waitForTimeout(5000);
    const h = await p.evaluate(() => ({ qb: typeof window.__qb, loft: typeof window.__qbLoft, v143: typeof window.__qbV143, alerts: typeof window.__qbAlerts, nav: document.querySelectorAll('.nav button').length, live: !!(window.QB_WEB && QB_WEB.noTest) }));
    ok(h.live && h.nav > 0, 'the web build boots past the creator (noTest on, ' + h.nav + ' tabs)');
    ok(h.qb === 'undefined' && h.loft === 'undefined' && h.v143 === 'undefined' && h.alerts === 'undefined', 'no test hooks on the web build ' + JSON.stringify(h));
    ok(!errs.length, 'WEB: no page errors ' + JSON.stringify(errs.slice(0, 3))); await ctx.close(); }
  await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
