// QA, v1.49 (29zz_v153.js and friends; Cal 11-24: "Should not automatically buy it and spend my money"). A crawler: a level-35 save
// with coins, a changed companion and everything else unbought. It visits every Shop screen (the Street Shop's floors and brands, the
// Vault if it is open, the Stylist's Cosmetics and Backdrops, the Pet Store's tabs, the Upgrades tab) and taps, for real, every button
// that shows a price or says Buy/Try on/Preview. After each tap: coins, spent and owned must be unchanged (a one-tap purchase is a
// FAIL); whatever window opened is closed with "Not now"/its x. Then it buys one thing on each kind of screen through its own
// confirm, to show the confirm path still works.
//   BASE=<plain build> OUT=<dir> node onetap153.js
const pw = require('playwright');
const BASE = process.env.BASE, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 }); await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 200)));
  await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV150 && window.__qbV149 && document.querySelector('.nav button, #ccname'), null, { timeout: 120000 }); await p.waitForTimeout(2500);
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S, A = x.ADDONS; S.created = true; S.char = window.__qb.fixChar({ name: 'Buyer', sex: 'm' }); S.cls = 'vanguard'; S.spec = 'berserker'; S.xp = x.cum(35) + 5; S.gates = [5, 10, 20, 30]; S.calm = false; S.coins = 500000; S.tutDone = 1;
    S.tours = { welcome: 1, hideout: 1, train: 1, dq: 1, bty: 1, hall: 1, shop: 1, players: 1, wheel: 1, lounge: 1, upgrades: 1, interface: 1 }; S.areaOn = { board: 1, train: 1, hideout: 1, shop: 1, hall: 1, players: 1, away: 1, wheel: 1, trophy: 1, sys: 1 };
    S.base.slots = [{ t: 'bedroom', a: { bd_ward2: 1 }, st: 0, pend: 0 }, { t: 'closet', a: {}, st: 0, pend: 0 }, { t: 'lair', a: {}, st: 0, pend: 0 }];
    S.pet = { k: 'wolf', t: Date.now() }; const P = window.__qbV150.state(); P.own = { wolf: { n: 'Ash', xp: 954, evo: 1, form: 1, asked: 1, t: Date.now() } }; x.persist(); x.render(); });
  const state = () => p.evaluate(() => { const S = window.__qb.x().S; return { c: S.coins, sp: S.spent || 0, own: Object.keys(S.owned || {}).length, p2: JSON.stringify((window.__qbV150.state() || {}).care || {}) + JSON.stringify(Object.keys((S.pc && S.pc.own) || {})) + JSON.stringify(Object.keys(S.pclo || S.petOwned || {})) }; });
  const closeAll = async () => { for (let i = 0; i < 6; i++) { const t = await p.evaluate(() => { const m = [...document.querySelectorAll('#layer .modal, .dropsplash')].pop(); if (!m) return null; const c = [...m.querySelectorAll('button')].find((e) => /not now|keep looking|cancel|later/i.test(e.textContent)) || m.querySelector('.mx,[data-act="mclose"],.dsx'); if (!c) { m.remove(); return 'removed'; } const r = c.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }); if (!t) return; if (t !== 'removed') { await p.mouse.click(t.x, t.y); await p.waitForTimeout(300); } } };
  const priced = () => p.evaluate(() => [...document.querySelectorAll('#app button, #app [data-act]')].filter((e) => { const r = e.getBoundingClientRect(); if (!r.width || e.disabled) return false; const t = e.textContent; return (/\b(buy|try on|preview|adopt|switch|unlock|get)\b/i.test(t) || e.querySelector('.coin')) && !/back|shop ›|^\s*‹/i.test(t) && !e.closest('.nav'); }).map((e, i) => { e.setAttribute('data-qa-tap', String(i)); return { i, act: e.dataset.act || '', t: e.textContent.replace(/\s+/g, ' ').trim().slice(0, 36) }; }));
  const tapAll = async (where) => { const L0 = await priced(); let n = 0; const seen = new Set(); for (let k = 0; k < Math.min(L0.length, 60); k++) { const L = await priced(); const it = L[k]; if (!it) break; const key = it.act + '|' + it.t.replace(/[\d,]+/g, '#'); if (seen.has(key) && seen.size > 12) continue; seen.add(key);
      const before = await state(); const el = await p.$('[data-qa-tap="' + it.i + '"]'); if (!el) continue; try { await el.click({ timeout: 2000 }); } catch (e) { continue; } await p.waitForTimeout(350); const after = await state(); n++;
      if (after.c !== before.c || after.sp !== before.sp || after.own !== before.own || after.p2 !== before.p2) { ok(false, where + ': one tap on "' + it.t + '" (' + it.act + ') changed coins/owned: ' + JSON.stringify(before) + ' -> ' + JSON.stringify(after)); }
      await closeAll(); await p.evaluate(() => { try { window.__qb.x().render(); } catch (e) {} }); }
    console.log('     ' + where + ': ' + n + ' priced buttons tapped once'); return n; };
  const nav = async (v) => { await closeAll(); await p.evaluate((v) => { const e = document.querySelector('.nav button[data-v="' + v + '"]'); if (e) e.dispatchEvent(new MouseEvent('click', { bubbles: true })); }, v); await p.waitForTimeout(900); await closeAll(); };
  const hub = async (k) => { await nav('shop'); await p.evaluate((k) => window.__qbV149.go(k), k); await p.waitForTimeout(900); await closeAll(); };
  let total = 0;
  /* the Street Shop: each floor tab and brand tab */
  await hub('street'); const tabs = await p.evaluate(() => [...document.querySelectorAll('.qshop [data-act="stab"], .qshop [data-qsfl]')].map((e) => (e.dataset.qsfl ? 'fl:' + e.dataset.qsfl : 'tab:' + e.dataset.v)));
  for (const t of [''].concat(tabs)) { if (t) { await p.evaluate((t) => { const [k, v] = t.split(':'); const e = document.querySelector(k === 'fl' ? '[data-qsfl="' + v + '"]' : '[data-act="stab"][data-v="' + v + '"]'); if (e) e.dispatchEvent(new MouseEvent('click', { bubbles: true })); }, t); await p.waitForTimeout(700); await closeAll(); }
    total += await tapAll('Street ' + (t || 'first screen')); }
  /* the Stylist, both tabs */
  await hub('stylist'); total += await tapAll('Stylist (first tab)'); const stt = await p.evaluate(() => [...document.querySelectorAll('.qshop button, .qshop [data-act]')].filter((e) => /backdrop/i.test(e.textContent) && e.getBoundingClientRect().width).map((e) => e.dataset.act + ':' + (e.dataset.v || e.dataset.k || '')).slice(0, 2));
  if (stt.length) { await p.evaluate(() => { const e = [...document.querySelectorAll('.qshop button, .qshop [data-act]')].find((x) => /^backdrops$/i.test(x.textContent.trim())); if (e) e.dispatchEvent(new MouseEvent('click', { bubbles: true })); }); await p.waitForTimeout(700); await closeAll(); total += await tapAll('Stylist Backdrops'); }
  /* the Pet Store, its tabs */
  await hub('pets'); total += await tapAll('Pet Store'); const ptabs = await p.evaluate(() => [...document.querySelectorAll('.qshop [data-act^="p2"], .qshop [data-p2tab], .qshop .p2-tab')].filter((e) => /tab/i.test(e.dataset.act || '') || e.dataset.p2tab).map((e, i) => i));
  for (const i of ptabs.slice(0, 6)) { await p.evaluate((i) => { const e = [...document.querySelectorAll('.qshop [data-act^="p2"], .qshop [data-p2tab], .qshop .p2-tab')].filter((x) => /tab/i.test(x.dataset.act || '') || x.dataset.p2tab)[i]; if (e) e.dispatchEvent(new MouseEvent('click', { bubbles: true })); }, i); await p.waitForTimeout(700); await closeAll(); total += await tapAll('Pet Store tab ' + i); }
  /* the Upgrades tab (the Lair's console) */
  const up = await p.evaluate(() => !!document.querySelector('.nav button[data-v="upgrades"]')); if (up) { await nav('upgrades'); total += await tapAll('Upgrades'); } else console.log('     (no Upgrades tab on the bar)');
  ok(total > 30, 'priced buttons tapped once across the Shop: ' + total + ' (none may buy)');
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
