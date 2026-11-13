// LEAD's fast start (9821a64, Cal: "5 seconds to load after reopening"): the web build on LEAD's stand-in Firebase (rigtest/lead/mockfirebase.js)
// with the save read slowed to GETMS (3000 ms), seeded from rigtest/qa/seeds/v90_adv.json. Each case in its own browser context:
//  A returning player: the Board draws before the online save, "Syncing" shows and taps wait, then taps work; 3 reopens leave the save unchanged.
//  B a second account on the same browser: never sees the first player's Board or name.  C a new player: sign-in and the creator, no Syncing.
//  D a newer save from another device wins, and nothing of this device's older copy stays.  E "Two saves found" (a copy without savedAt): can it be tapped?
//   URL=<dist-web/index.html> OUT=<folder> NODE_PATH=<playwright> node faststart.js
const fs = require('fs'), path = require('path'); const { chromium } = require('playwright');
const URL = process.env.URL || 'http://127.0.0.1:8819/', OUT = process.env.OUT || 'qa-out/fast/', GETMS = +(process.env.GETMS || 3000); fs.mkdirSync(OUT, { recursive: true });
const MOCK = fs.readFileSync(path.join(__dirname, '../lead/mockfirebase.js'), 'utf8').replace('get: function () { window.__mfbReads++; return Promise.resolve(dsnap(p, read())); }',
  'get: function () { window.__mfbReads++; var v = read(); var ms = /\\/state$/.test(p) ? (window.__mockGetDelay || 0) : 0; return new Promise(function (ok) { setTimeout(function () { ok(dsnap(p, v === undefined ? read() : read())); }, ms); }); }');
if (!/__mockGetDelay/.test(MOCK)) throw new Error('mock patch did not apply');
const SEED = JSON.parse(JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds/v90_adv.json'), 'utf8'))['quest-board']);
SEED.cls = 'vanguard'; // the seed has 6 gates and no class: Class Awakening would open on load and take the taps (LEAD, 0699c97)
let fails = 0; const ok = (n, c, g) => { if (!c) fails++; console.log((c ? 'ok   ' : 'BAD  ') + n + (g !== undefined ? '  ' + JSON.stringify(g).slice(0, 500) : '')); };
const save = (uid, over) => Object.assign(JSON.parse(JSON.stringify(SEED)), { uid }, over || {});
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] });
  const ctxNew = async () => { const c = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await c.route(/firebase-(app|auth|firestore)-compat\.js/, (r) => r.fulfill({ contentType: 'text/javascript', body: /app-compat/.test(r.request().url()) ? MOCK : '' }));
    await c.route(/\/__\/firebase\/init\.json/, (r) => r.fulfill({ status: 404, body: '' })); await c.route(/\/api\//, (r) => r.fulfill({ status: 404, body: '' })); return c; };
  // seed this context's storage (one page, then closed)
  const seed = async (c, kv) => { const p = await c.newPage(); await p.goto(URL + 'manifest.webmanifest'); await p.evaluate((kv) => { localStorage.clear(); Object.entries(kv).forEach(([k, v]) => localStorage.setItem(k, v)); }, kv); await p.close(); };
  const cloud = (d) => JSON.stringify({ j: JSON.stringify(d), t: Date.now() });
  // open as uid, watching every 50 ms: the name on screen, Syncing, loaded
  const open = async (c, uid, watchMs = 9000, extra) => { const p = await c.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
    await p.addInitScript(([u, d]) => { window.__mockUid = u; window.__mockSignedIn = 1; window.__mockGetDelay = d; window.__qaLog = []; const t0 = performance.now();
      const tick = () => { try { const a = document.querySelector('#app'); const strip = a && a.querySelector('.strip .brand'); const vis = !!a && getComputedStyle(a).visibility !== 'hidden' && getComputedStyle(a).display !== 'none'; window.__qaLog.push({ t: Math.round(performance.now() - t0), name: strip && vis ? strip.innerText.trim() : '', hiddenName: strip && !vis ? strip.innerText.trim() : '', sync: document.documentElement.classList.contains('qb-sync'), ready: !!(window.QBGAME && window.QBGAME.ready()), signin: !!(document.querySelector('#qbsignin') && getComputedStyle(document.querySelector('#qbsignin')).display !== 'none'), creator: !!document.querySelector('[data-act="ccnext"],#ccname'), picker: !!document.querySelector('.qbsv') }); } catch (e) {} if (performance.now() - t0 < 12000) setTimeout(tick, 50); };
      document.addEventListener('DOMContentLoaded', tick); }, [uid, GETMS]);
    await p.goto(URL); await p.waitForTimeout(watchMs); if (extra) await extra(p); return { p, errs, log: await p.evaluate(() => window.__qaLog) }; };
  const first = (log, f) => { const e = log.find(f); return e ? e.t : null; };

  // a save as the current build writes it (the seed's one-time v0.91 refund and migrations already done), used by every case
  { const c = await ctxNew(); const A0 = save('ana', { char: Object.assign({}, SEED.char, { name: 'AnaQA' }) }); await seed(c, { 'quest-board': JSON.stringify(A0), 'qb-lastuid': 'ana', '__mfb:data/users/ana/state': cloud(A0), '__mfbAuth:ana': '1' });
    const p = await c.newPage(); await p.addInitScript(() => { window.__mockUid = 'ana'; window.__mockSignedIn = 1; }); await p.goto(URL); await p.waitForFunction(() => window.QBGAME && window.QBGAME.ready(), null, { timeout: 30000 }); await p.waitForTimeout(9000);
    const cur = await p.evaluate(() => JSON.parse(JSON.parse(localStorage.getItem('__mfb:data/users/ana/state')).j)); Object.keys(SEED).forEach((k) => delete SEED[k]); Object.assign(SEED, cur); console.log('     baseline save: coins', SEED.coins, 'xp', SEED.xp, 'appv', SEED.appv); await c.close(); }
  // A: returning player, same save online and on the device
  { const c = await ctxNew(); const A0 = save('ana', { char: Object.assign({}, SEED.char, { name: 'AnaQA' }) }); await seed(c, { 'quest-board': JSON.stringify(A0), 'qb-lastuid': 'ana', '__mfb:data/users/ana/state': cloud(A0), '__mfbAuth:ana': '1' });
    const p = await c.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
    await p.addInitScript((d) => { window.__mockUid = 'ana'; window.__mockSignedIn = 1; window.__mockGetDelay = d; }, GETMS); const t0 = Date.now(); await p.goto(URL);
    await p.waitForFunction(() => { const a = document.querySelector('#app'), s = a && a.querySelector('.strip .brand'); return s && /anaqa/i.test(s.innerText) && getComputedStyle(a).visibility !== 'hidden'; }, null, { timeout: 30000 }); const tBoard = Date.now() - t0; const w0 = await p.evaluate(() => window.__mfbWrites || 0);
    const st1 = await p.evaluate(() => ({ sync: document.documentElement.classList.contains('qb-sync'), ready: window.QBGAME.ready(), view: (document.querySelector('.nav button.on') || {}).dataset }));
    await p.screenshot({ path: OUT + 'A_syncing.png' });
    // a real tap on the Training tab while syncing
    const bt = await p.$('.nav button[data-v="train"]'); const bb = bt && await bt.boundingBox(); if (bb) await p.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2); await p.waitForTimeout(400);
    const afterTap = await p.evaluate(() => (document.querySelector('.nav button.on') || { dataset: {} }).dataset.v);
    const wPre = await p.evaluate(() => window.__mfbWrites || 0); await p.waitForFunction(() => window.QBGAME.ready(), null, { timeout: 30000 }); const tReady = Date.now() - t0; await p.waitForTimeout(500); await p.evaluate(() => document.querySelectorAll('#layer .modal,.dropsplash').forEach((m) => m.remove()));
    const st2 = await p.evaluate(() => ({ sync: document.documentElement.classList.contains('qb-sync') }));
    if (bb) await p.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2); await p.waitForTimeout(800); const afterTap2 = await p.evaluate(() => (document.querySelector('.nav button.on') || { dataset: {} }).dataset.v);
    ok('A: the Board draws from the device before the online save arrives', tBoard < tReady - 1500 && st1.sync && !st1.ready, { boardMs: tBoard, readyMs: tReady, st1 });
    ok('A: a tap while Syncing does nothing; after it, taps work', afterTap === 'board' && !st2.sync && afterTap2 === 'train', { afterTap, st2, afterTap2 });
    const keyOf = (s) => ({ xp: s.xp, coins: s.coins, total: s.total, earnedC: s.earnedC, spent: s.spent, quests: (s.quests || []).length, rooms: ((s.base && s.base.slots) || []).filter(Boolean).length, ups: JSON.stringify((s.base && s.base.slots || []).map((r) => r && Object.keys(r.a || {}).length)), name: s.char && s.char.name, owned: Object.keys(s.owned || {}).length, gates: (s.gates || []).length });
    const k0 = keyOf(A0); const reads = [];
    for (let k = 0; k < 3; k++) { await p.reload(); await p.waitForFunction(() => window.QBGAME && window.QBGAME.ready(), null, { timeout: 30000 }); await p.waitForTimeout(1500);
      reads.push(await p.evaluate(() => { const loc = JSON.parse(localStorage.getItem('quest-board')); const cl = JSON.parse(JSON.parse(localStorage.getItem('__mfb:data/users/ana/state')).j); return { loc, cl, live: window.__qb.x().S }; })); }
    const same = reads.every((r) => JSON.stringify(keyOf(r.loc)) === JSON.stringify(k0) && JSON.stringify(keyOf(r.cl)) === JSON.stringify(k0) && JSON.stringify(keyOf(r.live)) === JSON.stringify(k0));
    ok('A: the save is unchanged after 3 reopens (device, online and in play)', same, same ? k0 : { want: k0, got: reads.map((r) => [keyOf(r.loc), keyOf(r.cl)]) });
    ok('A: nothing written to the database while Syncing', w0 === 0 && wPre === 0, { atBoard: w0, beforeReady: wPre });
    ok('A: no page errors', errs.length === 0, errs); await c.close(); }

  // B: a second account (ben) on the same browser, ana last played here
  { const c = await ctxNew(); const A0 = save('ana', { char: Object.assign({}, SEED.char, { name: 'AnaQA' }) }); await seed(c, { 'quest-board': JSON.stringify(A0), 'qb-lastuid': 'ana', '__mfb:data/users/ana/state': cloud(A0), '__mfbAuth:ana': '1' });
    const r = await open(c, 'ben', 9000); await r.p.screenshot({ path: OUT + 'B_ben.png' });
    const saw = r.log.filter((e) => /anaqa/i.test(e.name)); const end = r.log[r.log.length - 1];
    const benCloud = await r.p.evaluate(() => localStorage.getItem('__mfb:data/users/ben/state'));
    const hid = r.log.filter((e) => /anaqa/i.test(e.hiddenName)); ok('B: ben never sees AnaQA\'s Board (sampled every 50 ms, #app visible)', saw.length === 0, { shownFor: saw.length ? [saw[0].t, saw[saw.length - 1].t] : 0, inPageButHidden: hid.length ? [hid[0].t, hid[hid.length - 1].t] : 0, end });
    ok('B: ben ends on his own start (creator), nothing of ana written to ben', end.creator && (!benCloud || !/anaqa/i.test(benCloud)), { end, benCloud: benCloud && benCloud.slice(0, 80) });
    ok('B: no page errors', r.errs.length === 0, r.errs); await c.close(); }

  // C: a brand-new player on a fresh browser
  { const c = await ctxNew(); await seed(c, {}); const p = await c.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
    await p.addInitScript((d) => { window.__mockUid = 'cat'; window.__mockGetDelay = d; }, GETMS); await p.goto(URL);
    await p.waitForSelector('#qbsigninbtn', { timeout: 60000 }); const sync0 = await p.evaluate(() => document.documentElement.classList.contains('qb-sync')); await p.click('#qbsigninbtn');
    await p.waitForFunction(() => document.querySelector('[data-act="ccnext"]'), null, { timeout: 60000 }); const sync1 = await p.evaluate(() => document.documentElement.classList.contains('qb-sync'));
    ok('C: a new player gets sign-in then the creator, never Syncing', !sync0 && !sync1, { sync0, sync1 }); ok('C: no page errors', errs.length === 0, errs); await c.close(); }

  // D: a newer save from another device online; this device has an older copy with a key the newer one lacks
  { const c = await ctxNew(); const now = Date.now(); const L = save('ana', { coins: 1111, savedAt: now - 3600e3, qaOnlyOnDevice: 1, char: Object.assign({}, SEED.char, { name: 'AnaQA' }) }); const C2 = save('ana', { coins: 9999, xp: SEED.xp + 500, savedAt: now - 60e3, char: Object.assign({}, SEED.char, { name: 'AnaQA' }) });
    await seed(c, { 'quest-board': JSON.stringify(L), 'qb-lastuid': 'ana', '__mfb:data/users/ana/state': cloud(C2), '__mfbAuth:ana': '1' });
    const r = await open(c, 'ana', 9000); const S = await r.p.evaluate(() => { const s = window.__qb.x().S; return { coins: s.coins, xp: s.xp, only: s.qaOnlyOnDevice, ready: window.QBGAME.ready(), sync: document.documentElement.classList.contains('qb-sync') }; });
    await r.p.waitForTimeout(1200); const loc = await r.p.evaluate(() => { const s = JSON.parse(localStorage.getItem('quest-board') || 'null'); return s && { coins: s.coins, only: s.qaOnlyOnDevice }; });
    ok('D: the newer online save wins (coins 9999), nothing of the device copy left', S.ready && !S.sync && S.coins === 9999 && S.xp === SEED.xp + 500 && S.only === undefined, { S, loc });
    ok('D: no page errors', r.errs.length === 0, r.errs); await c.close(); }

  // E: "Two saves found": the device copy has no savedAt and differs from the online one
  { const c = await ctxNew(); const L = save('ana', { coins: 2222, char: Object.assign({}, SEED.char, { name: 'AnaQA' }) }); delete L.savedAt; const C2 = save('ana', { coins: 3333, char: Object.assign({}, SEED.char, { name: 'AnaQA' }) }); delete C2.savedAt;
    await seed(c, { 'quest-board': JSON.stringify(L), 'qb-lastuid': 'ana', '__mfb:data/users/ana/state': cloud(C2), '__mfbAuth:ana': '1' });
    // saveOnDevice needs created/xp: fine. FAST needs created: the seed has it.
    const r = await open(c, 'ana', 7000); const pk = await r.p.$('.qbsv [data-pick="cloud"]');
    const before = await r.p.evaluate(() => ({ picker: !!document.querySelector('.qbsv'), sync: document.documentElement.classList.contains('qb-sync'), pe: document.querySelector('.qbsv [data-pick]') ? getComputedStyle(document.querySelector('.qbsv [data-pick]')).pointerEvents : null }));
    await r.p.screenshot({ path: OUT + 'E_picker.png' });
    if (pk) { const bb = await pk.boundingBox(); await r.p.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2); await r.p.waitForTimeout(1500); }
    const after = await r.p.evaluate(() => ({ picker: !!document.querySelector('.qbsv'), ready: window.QBGAME.ready(), sync: document.documentElement.classList.contains('qb-sync'), coins: window.__qb.x().S.coins }));
    ok('E: "Two saves found" can be answered with a tap', !before.picker || (!after.picker && after.ready && after.coins === 3333), { before, after }); await c.close(); }
  console.log(fails ? 'FAILED ' + fails : 'PASS'); await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
