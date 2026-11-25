// QA, 22749d21 (29zz_v161.js: the level's effects owned and switchable in Interface; Cal 11-25: "Make sure we can toggle these
// interface items on and off and that they play nice with each other"). A level-50 save (all nineteen effects). On the Board:
//   A  every effect alone (the others off), then all on, then all off
//   B  all effects on with each interface item equipped in turn (every theme, frame and other Interface row), then with none
// For each state: body classes, a contrast scan of the Board's text against solid backgrounds, a tap test (the centre of every visible
// button must reach that button, so no effect layer catches taps), page width, and a picture. After "all off": no fx- class and no
// effect-made element left. The Interface > Effects tab by real taps: two switched off, All off, All on.
//   PORT=<plain build> OUT=<dir> node fx161qa.js
const pw = require('playwright'), fs = require('fs');
const PORT = process.env.PORT || 8819, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const errs = [];
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 }); await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
  const p = await ctx.newPage(); p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV161 && window.__qbV149, null, { timeout: 120000 }); await p.waitForTimeout(800);
  await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' });
  const items = await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Effects Tester', sex: 'f' }); S.xp = x.cum(50); S.gates = [5, 10, 20, 30, 40, 50]; S.calm = false; S.tutDone = 1; S.coins = 99999; S.ref53 = 1;
    S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1, interface: 1, upgrades: 1, lounge: 1 }; S.areaOn = { board: 1, train: 1, hideout: 1, hall: 1, shop: 1, wheel: 1, trophy: 1 };
    try { window.__qbRooms.open('closet', 1); window.__qbRooms.open('lair', 1); const r = S.base.slots.find((r) => r && r.t === 'lair'); r.a = r.a || {}; r.a.lr_console = 1; } catch (e) {}
    S.quests = [1, 2, 3, 4].map((k) => ({ id: 'fq' + k, name: 'A task with a long enough name ' + k, xp: 25, stat: 'productivity', cl: 'home', rep: 'once', mins: 20 })); S.done = {}; S.fxOff = {}; x.persist(); x.render();
    const sl = {}; x.SHOP.forEach((it) => { if (/^(theme|frame|bg|hud|title|sound|scene|burst|pet)$/.test(it[1])) { (sl[it[1]] = sl[it[1]] || []).push(it[0]); } }); return sl; });
  console.log('     Interface items by slot: ' + Object.entries(items).map(([k, v]) => k + ' ' + v.length).join(', '));
  const clr = () => p.evaluate(() => { for (const m of document.querySelectorAll('#layer .modal,#layer .qb-held,.bsplash,.dropsplash,.flsplash')) m.parentNode && m.parentNode.removeChild(m); });
  const board = async () => { await clr(); await p.evaluate(() => { document.querySelector('.nav button[data-v="board"]').click(); window.scrollTo(0, 0); }); await p.waitForTimeout(900); await clr(); };
  const fxSet = (on) => p.evaluate((on) => { const x = window.__qb.x(), S = x.S; S.fxOff = {}; window.__qbV161.fx().forEach((f) => { if (on !== 'all' && !(on || []).includes(f[1])) S.fxOff[f[1]] = 1; }); x.persist(); x.render(); }, on);
  const equip = (id) => p.evaluate((id) => { const x = window.__qb.x(), S = x.S; ['theme', 'frame', 'bg', 'hud', 'title', 'scene', 'burst', 'sound'].forEach((s) => { delete S.eq[s]; }); if (id) { const it = x.SHOP.find((q) => q[0] === id); S.owned[id] = true; S.eq[it[1]] = id; } x.persist(); x.render(); }, id);
  const look = async (name, file) => { await clr(); await p.waitForTimeout(150); await clr(); return p.evaluate(() => { const lum = (c) => { const m = /(\d+(?:\.\d+)?)[, ]+(\d+(?:\.\d+)?)[, ]+(\d+(?:\.\d+)?)/.exec(c || ''); if (!m) return -1; const f = (v) => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(+m[1]) + .7152 * f(+m[2]) + .0722 * f(+m[3]); };
      const alpha = (c) => { const m = /rgba?\(([^)]+)\)/.exec(c || ''); if (!m) return 1; const a = m[1].split(/[, /]+/).filter(Boolean); return a.length > 3 ? +a[3] : 1; };
      const low = []; let n = 0; for (const el of document.querySelectorAll('#app *')) { const own = [...el.childNodes].filter((t) => t.nodeType === 3 && t.textContent.trim()).map((t) => t.textContent.trim()).join(' '); if (!own) continue; const cs = getComputedStyle(el), r = el.getBoundingClientRect(); if (!r.width || r.bottom < 0 || r.top > innerHeight * 3 || cs.visibility === 'hidden' || +cs.opacity === 0) continue;
        if (cs.webkitTextFillColor && /rgba\(0, 0, 0, 0\)|transparent/.test(cs.webkitTextFillColor)) continue; n++; let bg = null, over = false; for (let e = el; e && e !== document.documentElement; e = e.parentElement) { const s = getComputedStyle(e); if (s.backgroundImage && s.backgroundImage !== 'none') over = true; if (alpha(s.backgroundColor) > .6) { bg = s.backgroundColor; break; } } if (!bg || over) continue;
        const L1 = lum(cs.color), L2 = lum(bg); if (L1 < 0 || L2 < 0) continue; const ratio = (Math.max(L1, L2) + .05) / (Math.min(L1, L2) + .05), big = parseFloat(cs.fontSize) >= 18 || (parseFloat(cs.fontSize) >= 14 && +cs.fontWeight >= 700); if (ratio < (big ? 3 : 4.5) && !el.closest('.ibbtn')) low.push(own.slice(0, 22) + ' ' + ratio.toFixed(1)); }
      const blocked = []; for (const e of document.querySelectorAll('#app button, .nav button')) { const r = e.getBoundingClientRect(); if (!r.width || r.top < 0 || r.bottom > innerHeight) continue; const t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); if (t && !(t === e || e.contains(t))) blocked.push((e.dataset.act || e.dataset.v || e.textContent.trim().slice(0, 12)) + '->' + (t.id || String(t.className).split(' ')[0] || t.tagName)); }
      const fxEls = document.querySelectorAll('[class*="fx-"]:not(body), .orb, .ember, .fxl, [class*="particle"], [class*="aurora"], [class*="star"]').length;
      return { body: document.body.className, n, low: [...new Set(low)], blocked: [...new Set(blocked)], fxEls, sw: document.documentElement.scrollWidth, vw: innerWidth }; }).then(async (r) => { if (file) await p.screenshot({ path: OUT + '/' + file + '.png' }); r.name = name; return r; }); };
  const fx = (await p.evaluate(() => window.__qbV161.fx())).map((f) => f[1]); console.log('     effects (' + fx.length + '): ' + fx.join(','));
  await board(); await equip(null); const res = [];
  await fxSet([]); await p.waitForTimeout(400); const base = await look('none', 'fx_none'); res.push(base); console.log('     all off: body "' + base.body + '", ' + base.fxEls + ' effect elements');
  for (const f of fx) { await fxSet([f]); await p.waitForTimeout(500); const r = await look('only ' + f, 'fx_only_' + f); res.push(r); }
  await fxSet('all'); await p.waitForTimeout(700); res.push(await look('all on', 'fx_all'));
  for (const [sl, ids] of Object.entries(items)) for (const id of ids) { await equip(id); await p.waitForTimeout(500); res.push(await look('all on + ' + sl + ' ' + id, 'fx_all_' + id)); }
  await equip(null); await fxSet([]); await p.waitForTimeout(700); const after = await look('all off again', 'fx_off_again'); res.push(after);
  for (const r of res) console.log('     ' + r.name + ': body fx ' + (r.body.match(/fx-[a-z]+/g) || []).length + (r.low.length ? ' | low ' + JSON.stringify(r.low.slice(0, 4)) : '') + (r.blocked.length ? ' | taps caught ' + JSON.stringify(r.blocked.slice(0, 4)) : ''));
  if (0) for (const r of res) if (r.low.length || r.blocked.length || r.sw > r.vw) console.log('     ' + r.name + ': ' + (r.low.length ? 'low contrast ' + JSON.stringify(r.low.slice(0, 5)) + ' ' : '') + (r.blocked.length ? 'taps caught ' + JSON.stringify(r.blocked.slice(0, 5)) + ' ' : '') + (r.sw > r.vw ? 'WIDER ' + r.sw : ''));
  ok(res.every((r) => !r.blocked.length), 'no effect, theme or frame catches taps meant for a visible button (' + res.length + ' states)');
  ok(res.every((r) => r.sw <= r.vw), 'nothing wider than the page in any state');
  const lowStates = res.filter((r) => r.low.length).map((r) => r.name); ok(lowStates.length === 0, 'no text below contrast on a solid colour in any state (' + lowStates.length + ' states with some: ' + lowStates.slice(0, 8).join('; ') + ')');
  ok(!/\bfx-/.test(after.body) && after.fxEls <= base.fxEls, 'after all off again: body "' + after.body + '", effect elements ' + after.fxEls + ' (at the start ' + base.fxEls + ')');
  /* the Effects tab by real taps */
  await clr(); await p.evaluate(() => document.querySelector('.nav button[data-v="shop"]').click()); await p.waitForTimeout(800); await clr(); await p.evaluate(() => window.__qbV149.go('iface')); await p.waitForTimeout(800); await clr();
  const tabs = await p.evaluate(() => [...document.querySelectorAll('.qshop [data-act="iftab"]')].map((e) => e.dataset.v + '=' + e.textContent.trim())); console.log('     Interface tabs: ' + tabs.join(', '));
  await p.evaluate(() => { const e = [...document.querySelectorAll('.qshop [data-act="iftab"]')].find((x) => /effect/i.test(x.textContent)); if (e) e.click(); }); await p.waitForTimeout(700); await clr(); await p.screenshot({ path: OUT + '/fx_tab.png', fullPage: false });
  const cards = await p.evaluate(() => [...document.querySelectorAll('.v61fx')].map((e) => e.dataset.fx + (e.classList.contains('lock') ? '(lock)' : e.classList.contains('on') ? '(on)' : '(off)'))); console.log('     Effects tab: ' + cards.length + ' cards ' + cards.join(','));
  const tapOff = async (id) => { await clr(); const el = await p.$('.v61fx[data-fx="' + id + '"] [data-act="fxtog"]'); await el.scrollIntoViewIfNeeded(); await el.click(); await p.waitForTimeout(500); };
  await tapOff('orbs'); await tapOff('embers'); const b1 = await p.evaluate(() => document.body.className); ok(!/fx-orbs|fx-embers/.test(b1) && /fx-grid/.test(b1), 'two switched off by real taps leave the body without them: ' + b1);
  await clr(); await p.evaluate(() => document.querySelector('[data-act="fxall"][data-id="off"]').click()); await p.waitForTimeout(500); const b2 = await p.evaluate(() => document.body.className); ok(!/\bfx-/.test(b2), 'All off: "' + b2 + '"');
  await clr(); await p.evaluate(() => document.querySelector('[data-act="fxall"][data-id="on"]').click()); await p.waitForTimeout(500); const b3 = await p.evaluate(() => (document.body.className.match(/fx-/g) || []).length); ok(b3 === fx.length, 'All on: ' + b3 + ' of ' + fx.length);
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
