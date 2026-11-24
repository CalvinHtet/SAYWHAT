// QA, v1.45 (lead/v145src ea0657be, 29zz_v144.js "the tabs work while the save syncs"; Cal 11-24: "do not disable to option to click on
// other tabs while things are syncing"). The real fast start, not the class added by hand: the sandbox web build (QB_SANDBOX=1, test
// tools on) with its online save read slowed to SLOW ms (web.js is served with the sandbox's state get delayed; nothing else changes).
// First visit makes a save; then the online copy is made newer than the device copy (another device played: more coins, a later
// savedAt), and the page is reloaded slow. While "syncing…" shows: the save pill spins and glows; every bottom tab and the Town's tabs
// open with real taps; a quest tap does nothing (ticking waits, by design). Then, with the Loft open, the online save lands: the class
// goes, the newer coins show, the screen stays sane, taps work again, no page errors. Pictures at each step.
//   WEB=<server of quest-board/ with a sandbox dist-web> SLOW=15000 OUT=<dir> node sync145.js
const pw = require('playwright'), fs = require('fs');
const WEB = process.env.WEB, SLOW = +(process.env.SLOW || 15000), OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.route('**/*', async (r) => { const u = r.request().url(); if (!u.startsWith('http://127.0.0.1:')) return r.abort();
    if (/\/dist-web\/web\.js/.test(u)) { const res = await r.fetch(); let body = await res.text(); const a = 'get: function () { return Promise.resolve(snapD(p)); },';
      if (body.indexOf(a) < 0) console.log('BAD  could not find the sandbox get in web.js');
      body = body.replace(a, 'get: function () { var ms = /\\/state$/.test(p) ? +(localStorage.getItem("qa-slow") || 0) : 0; return ms ? new Promise(function (ok) { setTimeout(function () { ok(snapD(p)); }, ms); }) : Promise.resolve(snapD(p)); },');
      return r.fulfill({ response: res, body }); }
    return r.continue(); });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 200)));
  const V = (f, a) => p.evaluate(f, a);
  const shut = () => V(() => { document.querySelectorAll('#layer .modal,.overlay,.dropsplash').forEach((m) => m.remove()); try { if (window.TOUR) TOUR.id = null; } catch (e) {} });
  await p.goto(WEB + '/dist-web/index.html'); await p.waitForFunction(() => document.querySelector('[data-act="ccnext"]'), null, { timeout: 180000 });
  await p.fill('#ccname', 'Sync'); await p.click('[data-act="ccnext"]'); await p.waitForFunction(() => document.querySelector('[data-act="ccdone"]'), null, { timeout: 120000 }); await p.waitForTimeout(800); await p.click('[data-act="ccdone"]');
  await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qb.x().S.created, null, { timeout: 120000 }); await p.waitForTimeout(2000); await shut();
  await V(() => { const x = window.__qb.x(), S = x.S; S.xp = x.cum(20) + 5; S.gates = [5, 10, 20]; S.cls = 'vanguard'; S.spec = 'berserker'; S.ms = { 5: 1, 10: 1, 15: 1, 20: 1 }; S.calm = false; S.coins = 1000; S.tutDone = 1;
    S.tours = { welcome: 1, hideout: 1, train: 1, dq: 1, bty: 1, hall: 1, shop: 1, players: 1, wheel: 1 }; S.areaOn = { board: 1, train: 1, hideout: 1, shop: 1, hall: 1, players: 1, away: 1, wheel: 1, trophy: 1, sys: 1 };
    S.base.slots = [{ t: 'bedroom', a: { bd_ward2: 1 }, st: 0, pend: 0 }, { t: 'closet', a: {}, st: 0, pend: 0 }]; x.persist(); x.render(); });
  await p.waitForTimeout(3000);
  const keys = await V(() => ({ uid: localStorage.getItem('qb-lastuid'), dev: !!localStorage.getItem('quest-board'), cloud: Object.keys(localStorage).filter((k) => /qbsbx:data\/users\/.*\/state$/.test(k)) }));
  console.log('     saves: ' + JSON.stringify(keys)); ok(keys.uid && keys.dev && keys.cloud.length === 1, 'a device copy and an online copy exist');
  /* another device played: the online copy has 7,777 coins and a later savedAt */
  await V((k) => { const d = JSON.parse(localStorage.getItem(k)); d.coins = 7777; d.savedAt = Date.now() + 60000; localStorage.setItem(k, JSON.stringify(d)); localStorage.setItem('qa-slow', String(window.__qaSlow)); }, keys.cloud[0]).catch(() => {});
  await V((ms) => localStorage.setItem('qa-slow', String(ms)), SLOW);
  const t0 = Date.now(); await p.reload(); await p.waitForFunction(() => document.querySelector('.nav button'), null, { timeout: 60000 }); await p.waitForTimeout(800);
  const s0 = await V(() => { const sv = document.getElementById('savest'), cs = sv ? getComputedStyle(sv) : null; return { sync: document.documentElement.classList.contains('qb-sync'), pill: sv ? sv.textContent.trim() : null, ring: sv ? sv.classList.contains('qspin') || !!sv.closest('.qspin') : false, anim: cs ? cs.animationName : '', coins: (document.querySelector('.coinpill b') || {}).textContent || '' }; });
  console.log('     ' + ((Date.now() - t0) / 1000).toFixed(1) + ' s after reload: ' + JSON.stringify(s0)); await p.screenshot({ path: OUT + '/sync_0_board.png' });
  ok(s0.sync, 'the fast start is on (html.qb-sync), the device copy drawn');
  ok(/sync/i.test(s0.pill || '') && s0.ring && /qbsyncglow/.test(s0.anim), 'the save pill says "' + s0.pill + '", has its ring and glows (' + s0.anim + ')');
  const md = await V(() => { const m = document.querySelector('#layer .modal'); if (!m) return null; const c = m.querySelector('[data-act="mclose"], .mx, button'); if (!c) return { title: m.innerText.slice(0, 40) }; const r = c.getBoundingClientRect(); return { title: m.innerText.replace(/\s+/g, ' ').slice(0, 50), x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
  if (md && md.x) { await p.mouse.click(md.x, md.y); await p.waitForTimeout(500); const still = await V(() => !!document.querySelector('#layer .modal')); console.log('     a window open during the sync ("' + md.title + '"): tapping its close ' + (still ? 'does nothing until the save lands' : 'closes it')); }
  else console.log('     no window open during the sync');
  await shut();
  /* real taps on every bottom tab, the Town's tabs, then a quest */
  const views = []; const navs = await V(() => [...document.querySelectorAll('.nav button[data-v]')].map((b) => b.dataset.v));
  for (const v of navs.concat(['board'])) { await p.click('.nav button[data-v="' + v + '"]', { timeout: 4000 }).catch((e) => views.push(v + ':click failed')); await p.waitForTimeout(700);
    const st = await V(() => ({ cur: (document.querySelector('.nav button[aria-current="page"], .nav button.on') || {}).dataset ? (document.querySelector('.nav button[aria-current="page"], .nav button.on') || { dataset: {} }).dataset.v : '?', sync: document.documentElement.classList.contains('qb-sync') }));
    views.push(v + '->' + st.cur + (st.sync ? '' : '(landed)')); if (v === 'hall') { const ht = await V(() => [...document.querySelectorAll('[data-act="htab"]')].map((e) => e.dataset.t)); for (const t of ht) { await p.click('[data-act="htab"][data-t="' + t + '"]', { timeout: 4000 }).catch(() => views.push('htab ' + t + ' failed')); await p.waitForTimeout(500); const on = await V(() => (document.querySelector('[data-act="htab"].on') || { dataset: {} }).dataset.t); views.push('  hall tab ' + t + '->' + on); } await p.screenshot({ path: OUT + '/sync_1_hall.png' }); } }
  console.log('     taps while syncing: ' + views.join(', '));
  ok(navs.every((v) => views.indexOf(v + '->' + v) >= 0), 'every bottom tab opened by a real tap while syncing (' + navs.join(', ') + ')');
  ok(!views.some((v) => /failed/.test(v)) && views.filter((v) => /hall tab/.test(v)).every((v) => { const m = v.match(/hall tab (\w+)->(\w+)/); return m && m[1] === m[2]; }), 'the Town\'s tabs switch too');
  const q = await V(() => { const e = document.querySelector('.quest [data-act="toggle"], [data-act="toggle"]'); if (!e) return 'no quest'; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, id: e.dataset.id || '' }; });
  const xpA = await V(() => window.__qb.x().S.xp); if (q.x) { await p.mouse.click(q.x, q.y); await p.waitForTimeout(600); } const xpB = await V(() => window.__qb.x().S.xp);
  ok(xpA === xpB, 'ticking a quest still waits while syncing (XP ' + xpA + ' -> ' + xpB + ')');
  /* land it with the Loft open */
  await p.click('.nav button[data-v="hideout"]').catch(() => {}); await p.waitForTimeout(500); const still = await V(() => document.documentElement.classList.contains('qb-sync'));
  console.log('     on the Loft, still syncing: ' + still + ' (' + ((Date.now() - t0) / 1000).toFixed(1) + ' s)'); await p.screenshot({ path: OUT + '/sync_2_loft_before.png' });
  await p.waitForFunction(() => !document.documentElement.classList.contains('qb-sync'), null, { timeout: SLOW + 20000 }); await p.waitForTimeout(2500);
  const s1 = await V(() => ({ coins: window.__qb.x().S.coins, shown: (document.querySelector('.coinpill b') || {}).textContent || '', cur: (document.querySelector('.nav button[aria-current="page"], .nav button.on') || { dataset: {} }).dataset.v, pill: (document.getElementById('savest') || {}).textContent || '', modal: [...document.querySelectorAll('#layer .modal')].map((m) => m.className).join(','), body: document.body.innerText.length }));
  console.log('     landed after ' + ((Date.now() - t0) / 1000).toFixed(1) + ' s: ' + JSON.stringify(s1)); await p.screenshot({ path: OUT + '/sync_3_landed.png' });
  ok(still, 'the save had not landed when the Loft was opened (the slow read is real)');
  ok(s1.coins >= 7777 && s1.coins <= 7777 + 100, 'the newer online save took over: ' + s1.coins + ' coins (7,777 online, the device copy had 1,000; +50 First steps)');
  ok(s1.body > 200 && !/sync/i.test(s1.pill), 'the screen is drawn and the pill no longer says syncing ("' + s1.pill + '", on ' + s1.cur + ')');
  /* taps work again: close whatever window is up with a real tap, then open another tab with a real tap */
  const m0 = await V(() => document.querySelectorAll('#layer .modal').length); const tgt = await V(() => { const ms = [...document.querySelectorAll('#layer .modal')]; for (const m of ms.reverse()) { const c = m.querySelector('.btn, [data-act="mclose"]'); if (!c) continue; const r = c.getBoundingClientRect(); const x = r.left + r.width / 2, y = r.top + r.height / 2; const hit = document.elementFromPoint(x, y); if (hit && (hit === c || c.contains(hit))) return { x, y, t: c.textContent.trim().slice(0, 20) }; } return null; });
  const btn = !!tgt; if (tgt) { await p.mouse.click(tgt.x, tgt.y); await p.waitForTimeout(700); console.log('     tapped "' + tgt.t + '" on the top window'); } const m1 = await V(() => document.querySelectorAll('#layer .modal').length);
  await shut(); await p.click('.nav button[data-v="train"]', { timeout: 5000 }); await p.waitForTimeout(700); const cur = await V(() => (document.querySelector('.nav button[aria-current="page"], .nav button.on') || { dataset: {} }).dataset.v);
  ok((!btn || m1 < m0) && cur === 'train', 'after it lands taps work again: a window closed by its button (' + m0 + ' -> ' + m1 + '), Training opened (' + cur + ')');
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
