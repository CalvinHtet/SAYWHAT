// Ten different players on one town (Cal, 2026-11-07: "see how this platform would function with 10 saves files from different
// players"). Ten pages share LEAD's stand-in database (rigtest/lead/mockdb.js, pushes like the real one); each page keeps its own
// device save (the "quest-board" key is per player here, as on ten phones). The ten saves differ the way real ones will: a new
// player, a casual one, both bodies, levels 5 to 80, few to all rooms, outfits picked from the Shop, a lapsed player and an old
// save that owns a retired item. Checks: every page boots and draws each tab with no errors; every page sees the other nine with
// the right name, level, streak and rooms; the Hall lists nine neighbours with an avatar each; one player visits all nine (their
// Loft drawn, no broken image); "Say hi" reaches the other player; three posts at once reach everyone; after reloading all ten,
// each save is still its own; database writes in a quiet minute; the size of each shared doc. Pictures of the Hall and each visit.
//   BASE=<server> QB=<quest-board folder> OUT=<folder> node players10.js
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:8769', QB = process.env.QB || '.', OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
const CAPS = JSON.parse(fs.readFileSync(path.join(QB, 'app/dbcaps.json'), 'utf8')).capabilities.db.rules;
const MOCK = require(path.resolve(QB, 'rigtest/lead/mockdb.js'));
const ORDER = require('./lib.js').ORDER;
const fails = []; const ok = (n, c, g) => { console.log((c ? '  ok   ' : '  FAIL ') + n + (g !== undefined ? '  ' + JSON.stringify(g).slice(0, 320) : '')); if (!c) fails.push(n); };
// name, body, level, streak, rooms (count from ORDER), share of each room's upgrades, outfit pieces, extra
const P = [
  ['Cal', 'm', 45, 30, 12, 1, 5, ''], ['Mia', 'f', 38, 21, 10, .8, 5, ''], ['Newbie', 'f', 5, 0, 1, 0, 0, 'new'],
  ['Jo', 'm', 8, 3, 2, .5, 1, ''], ['Sam', 'f', 15, 9, 6, .6, 3, ''], ['Ari', 'f', 22, 14, 8, .4, 5, ''],
  ['Kai', 'm', 60, 45, 21, 1, 5, ''], ['Max', 'f', 80, 120, 21, 1, 5, 'all'], ['Lapsed', 'm', 12, 0, 4, .3, 2, 'lapsed'], ['Oldie', 'm', 25, 6, 9, .7, 3, 'old']];
const N = P.length, uid = (i) => 'u_' + P[i][0].toLowerCase();
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }); const errs = []; const pages = []; const boot = [];
  const ready = (p) => p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && window.__qbLive, null, { timeout: 120000 });
  const clear = (p) => p.evaluate(() => document.querySelectorAll('#layer .modal,.dropsplash,.overlay').forEach((e) => e.remove()));
  const tab = async (p, v) => { await clear(p); await p.evaluate((v) => { const bt = document.querySelector('.nav button[data-v="' + v + '"]'); if (bt) bt.click(); }, v); await p.waitForTimeout(1500); };
  for (let i = 0; i < N; i++) {
    const p = await ctx.newPage(); p.on('pageerror', (e) => errs.push(P[i][0] + ': ' + e.message.slice(0, 140)));
    await p.addInitScript(MOCK, { uid: uid(i), owner: i === 0, rules: CAPS });
    await p.addInitScript((me) => { const g = localStorage.getItem.bind(localStorage), s = localStorage.setItem.bind(localStorage); window.__writes = 0;
      localStorage.getItem = (k) => g(k === 'quest-board' ? 'quest-board:' + me : k); localStorage.setItem = (k, v) => { if (k.startsWith('__mdb:')) window.__writes++; return s(k === 'quest-board' ? 'quest-board:' + me : k, v); }; }, uid(i));
    const t0 = Date.now(); await p.goto(BASE + '/dist/index.html'); await ready(p); boot.push(Date.now() - t0); await p.waitForTimeout(500);
    const set = await p.evaluate(([pr, order]) => { const [name, sex, lv, streak, nRooms, share, pieces, extra] = pr; const x = window.__qb.x(), S = x.S;
      let seed = name.length * 7919; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
      S.created = true; S.char = window.__qb.fixChar({ name, sex }); S.xp = x.cum(lv); S.gates = [5, 10, 20, 30, 40, 50, 65, 80].filter((g) => g <= lv); S.streak = streak; delete S.areaOn;
      S.coins = Math.round(lv * lv * 40); S.base.served = lv * 300;
      if (extra !== 'new') S.base.slots = order.slice(0, nRooms).map((t) => ({ t, a: Object.fromEntries((x.ADDONS[t] || []).filter((u) => !(u[3] && u[3].retired) && rnd() < share).map((u) => [u[0], 1])), st: 0, pend: 0 }));
      S.owned = S.owned || {}; S.eq = S.eq || {};
      const fits = x.SHOP.filter((it) => it[6] && it[6].gar && !(it[6].fo && sex !== 'f') && !(it[6].mo && sex !== 'm') && !(it[6] && it[6].retired));
      if (extra === 'all') fits.forEach((it) => { S.owned[it[0]] = true; });
      const slots = ['a_top', 'a_pants', 'a_shoes', 'a_hat', 'a_acc'].slice(0, pieces);
      slots.forEach((sl) => { const c = fits.filter((it) => it[1] === sl); if (!c.length) return; const it = c[Math.floor(rnd() * c.length)]; S.owned[it[0]] = true; S.eq[sl] = it[0]; });
      if (extra === 'old') { S.owned.gm_ping = true; delete S.alSeen; delete S.brandSeen; }
      if (extra === 'lapsed') { S.lastDay = '2026-10-01'; }
      x.persist(); x.render(); return { eq: Object.values(S.eq), rooms: S.base.slots.length }; }, [P[i], ORDER]);
    pages.push(p); console.log(`  ${P[i][0].padEnd(7)} level ${P[i][2]}, ${set.rooms} rooms, wearing ${set.eq.join(' ') || 'the starter clothes'}  (ready in ${(boot[i] / 1000).toFixed(1)} s)`);
  }
  await pages[0].waitForTimeout(6000);
  // every tab on every page
  const tabErr0 = errs.length;
  for (const p of pages) for (const v of ['board', 'train', 'hideout', 'hall', 'shop', 'board']) await tab(p, v);
  ok('every page drew Board, Training, The Loft, Hall and Shop with no error', errs.length === tabErr0, errs.slice(tabErr0, tabErr0 + 3));
  // each page sees the other nine, right
  const t0 = Date.now(); let bad = [];
  while (Date.now() - t0 < 40000) {
    bad = [];
    for (let i = 0; i < N; i++) { const w = await pages[i].evaluate(() => window.__qbLive.soc().worlds);
      for (let j = 0; j < N; j++) { if (j === i) continue; const d = w.find((x) => x.id === uid(j)); const lvOk = d && d.lv >= Math.min(P[j][2], 80) - 1 && d.lv <= P[j][2];
        if (!d || !lvOk || d.streak !== P[j][3]) bad.push(`${P[i][0]} sees ${P[j][0]}: ${d ? 'lv ' + d.lv + ' streak ' + d.streak : 'missing'}`); } }
    if (!bad.length) break; await pages[0].waitForTimeout(1000);
  }
  ok(`every page sees the other nine with the right level and streak (${((Date.now() - t0) / 1000).toFixed(1)} s)`, !bad.length, bad.slice(0, 6));
  const names = await pages[0].evaluate(() => (window.__qb.x().S && true) && [...document.querySelectorAll('.snw b')].map((e) => e.textContent));
  // the Hall on two pages
  for (const i of [0, 2]) { await tab(pages[i], 'hall'); await pages[i].waitForTimeout(2500);
    const h = await pages[i].evaluate(() => { const rows = [...document.querySelectorAll('.snw')]; return { rows: rows.length, names: rows.map((r) => (r.querySelector('b') || {}).textContent), emptyAv: rows.filter((r) => { const a = r.querySelector('.snav img, .snav .pxa, .snav canvas'); return !a || (a.tagName === 'IMG' && (!a.complete || !a.naturalWidth)); }).length, kinds: [...new Set(rows.map((r) => { const a = r.querySelector('.snav > *'); return a ? a.tagName + '.' + a.className : 'none'; }))] }; });
    const list = await pages[i].$('.snw'); if (list) { await list.evaluate((e) => e.scrollIntoView({ block: 'start' })); await pages[i].waitForTimeout(800); await pages[i].screenshot({ path: path.join(OUT, `hall_list_${P[i][0]}.png`) }); }
    await pages[i].screenshot({ path: path.join(OUT, `hall_${P[i][0]}.png`), fullPage: false });
    ok(`${P[i][0]}'s Hall lists nine neighbours, each with an avatar`, h.rows >= 9 && !h.emptyAv && P.filter((_, j) => j !== i).every((q) => h.names.includes(q[0])), h); }
  // Cal visits everyone; Newbie visits Max (the biggest Loft)
  const visit = async (i, j) => { await clear(pages[i]); const r = await pages[i].evaluate(async (u) => { const w = (ms) => new Promise((o) => setTimeout(o, ms)); const bt = document.querySelector('[data-act="snvisit"][data-u="' + u + '"]'); if (!bt) return { none: 1 }; bt.click(); await w(2500);
      const m = document.querySelector('.snvisit'); if (!m) return { nomodal: 1 }; const imgs = [...m.querySelectorAll('img, image')]; const bad = imgs.filter((e) => e.tagName === 'IMG' ? (!e.complete || !e.naturalWidth) : !(e.getAttribute('href') || e.getAttribute('xlink:href'))); const broken = bad.filter((e) => e.tagName === 'IMG').length, emptyImage = bad.length - broken, where = bad.slice(0, 2).map((e) => e.tagName + ' in ' + (e.closest('[class]') || {}).className);
      const r = m.getBoundingClientRect(); return { title: (m.querySelector('h2') || {}).textContent, rooms: m.querySelectorAll('.snroom').length, broken, emptyImage, where, w: Math.round(r.width), over: r.right > innerWidth + 1 }; }, uid(j));
    await pages[i].screenshot({ path: path.join(OUT, `visit_${P[i][0]}_to_${P[j][0]}.png`) }); const hd = await pages[i].$('.snvisit .row'); if (hd) await hd.screenshot({ path: path.join(OUT, `visithead_${P[j][0]}.png`) }).catch(() => {}); return r; };
  await tab(pages[0], 'hall'); await pages[0].waitForTimeout(1500); const vbad = [];
  for (let j = 1; j < N; j++) { const r = await visit(0, j); const want = P[j][7] === 'new' ? 1 : P[j][4]; if (r.none || r.nomodal || r.broken || r.over || r.rooms !== want || r.title !== P[j][0] + '’s Loft') vbad.push([P[j][0], r]); await tab(pages[0], 'hall'); }
  ok('Cal visits all nine: each Loft opens with its rooms, no broken image, fits the phone', !vbad.length, vbad);
  await tab(pages[2], 'hall'); await pages[2].waitForTimeout(1500); const nv = await visit(2, 7); ok('Newbie visits Max (all 21 rooms)', nv.rooms === 21 && !nv.broken, nv);
  // Newbie says hi to Max
  await pages[2].evaluate(() => { const i = document.getElementById('snmsg'); if (i) i.value = 'hi from Newbie'; const bt = document.querySelector('[data-act="snhi"]'); if (bt) bt.click(); });
  const t1 = Date.now(); let got = null; while (Date.now() - t1 < 20000) { got = await pages[7].evaluate(() => (window.__qbLive.soc().vis || []).includes('Newbie') || JSON.stringify(window.__qbLive.soc().notes || '').includes('hi from Newbie')); if (got) break; await pages[7].waitForTimeout(1000); }
  ok(`Newbie's "Say hi" reaches Max (${((Date.now() - t1) / 1000).toFixed(1)} s)`, !!got);
  // three posts at once
  await Promise.all([1, 4, 8].map(async (i) => { await tab(pages[i], 'hall'); }));
  await Promise.all([1, 4, 8].map((i) => pages[i].evaluate((n) => { const t = document.getElementById('sntext'); if (!t) return; t.value = 'post from ' + n; t.dispatchEvent(new Event('input', { bubbles: true })); document.querySelector('[data-act="snpost"]').click(); }, P[i][0])));
  const t2 = Date.now(); let posts = []; while (Date.now() - t2 < 30000) { posts = await Promise.all(pages.map((p) => p.evaluate(() => window.__qbLive.soc().posts))); if (posts.every((q) => ['Mia', 'Sam', 'Lapsed'].every((n) => q.includes('post from ' + n)))) break; await pages[0].waitForTimeout(1000); }
  ok(`three posts made at once reach all ten (${((Date.now() - t2) / 1000).toFixed(1)} s)`, posts.every((q) => ['Mia', 'Sam', 'Lapsed'].every((n) => q.includes('post from ' + n))), posts.map((q) => q.length));
  // a quiet minute
  const w0 = await Promise.all(pages.map((p) => p.evaluate(() => window.__writes))); await pages[0].waitForTimeout(60000); const w1 = await Promise.all(pages.map((p) => p.evaluate(() => window.__writes)));
  const quiet = w1.map((v, i) => v - w0[i]); ok('a quiet minute writes at most 2 per page', quiet.every((v) => v <= 2), quiet);
  // the shared docs
  const docs = await pages[0].evaluate(() => { const o = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k.startsWith('__mdb:')) o[k.slice(6)] = localStorage.getItem(k).length; } return o; });
  const keys = Object.keys(docs); const by = (re) => keys.filter((k) => re.test(k));
  console.log(`  database: ${keys.length} docs; worlds ${by(/^worlds\//).length} (largest ${Math.max(...by(/^worlds\//).map((k) => docs[k]))} bytes), saves ${by(/^data\/users\/.*\/state$/).length} (largest ${Math.max(0, ...by(/\/state$/).map((k) => docs[k]))} bytes), board ${by(/^board\//).length}, pings ${by(/^pings\//).length}, other ${keys.filter((k) => !/^(worlds|data\/users|board|pings)\//.test(k)).join(' ')}`);
  ok('every shared world doc under 100 KB and every save under 1 MB', by(/^worlds\//).every((k) => docs[k] < 1e5) && by(/\/state$/).every((k) => docs[k] < 1e6), Object.fromEntries(keys.filter((k) => docs[k] > 5e4).map((k) => [k, docs[k]])));
  // reload all ten: each save is still its own
  const sbad = [];
  for (let i = 0; i < N; i++) { const p = pages[i]; await p.reload(); await ready(p); await p.waitForTimeout(2000);
    const s = await p.evaluate(() => { const S = window.__qb.x().S; return { name: S.char && S.char.name, lv: window.__qb.x().effLvl(), streak: S.streak, rooms: S.base.slots.filter(Boolean).length, eq: Object.values(S.eq || {}).length }; });
    if (s.name !== P[i][0] || s.streak !== P[i][3] || (P[i][7] !== 'new' && s.rooms !== P[i][4])) sbad.push([P[i][0], s]); }
  ok('after reloading all ten, each save is still its own', !sbad.length, sbad);
  ok('no page errors', errs.length === 0, errs.slice(0, 4));
  console.log('ready times (s):', boot.map((t) => (t / 1000).toFixed(1)).join(' '));
  console.log(fails.length ? 'FAILED ' + fails.length : 'PASS'); await b.close();
})();
