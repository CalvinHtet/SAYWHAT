// QA, da3f5804 (29zz_v159.js: the dark Shop, four square doors, one Interface shop, no Upgrades tab). What LEAD's shop159.js leaves
// out: every Shop screen against the dark theme. A level-35 save with the Lair's console, a companion (the Pet Store) and coins: the
// home, every floor and every brand tab of the Street Shop, the Stylist, the Closet, the Pet Store and its tabs, Interface's three tabs.
// On each: a contrast scan of every visible text (its colour against the first solid background behind it; text over a picture or a
// gradient is listed apart), page width, and a picture. Then in Interface, by real taps: buy one upgrade and one interface piece
// through their own confirm, and View on an interface piece. Last, the home and a brand at 1280 px.
//   PORT=<plain build> OUT=<dir> node shop159qa.js
const pw = require('playwright');
const PORT = process.env.PORT || 8819, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const errs = [];
  const open = async (W, H) => { const ctx = await b.newContext({ viewport: { width: W, height: H || 844 }, deviceScaleFactor: 2 }); await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
    const p = await ctx.newPage(); p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
    await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV149 && window.__qbV159 && window.__qbV150, null, { timeout: 120000 }); await p.waitForTimeout(800);
    await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' });
    await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Shopper', sex: 'f' }); S.xp = x.cum(35); S.gates = [5, 10, 20, 30]; S.calm = false; S.tutDone = 1; S.coins = 99999; S.ref53 = 1;
      S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1, interface: 1, upgrades: 1, lounge: 1 };
      try { window.__qbRooms.open('closet', 1); window.__qbRooms.open('lair', 1); const r = S.base.slots.find((r) => r && r.t === 'lair'); r.a = r.a || {}; r.a.lr_console = 1; } catch (e) {}
      S.pet = { k: 'wolf', t: Date.now() }; const P = window.__qbV150.state(); P.own = { wolf: { n: 'Ash', xp: 10, evo: 0, form: 0, asked: 1, t: Date.now() } }; P.seen = 1;
      S.brandSeen = {}; try { window.__qbDrops.state().live.forEach((q) => { S.brandSeen[q.id + '|' + q.start] = 1; }); } catch (e) {} x.persist(); x.render(); document.querySelector('.nav button[data-v="shop"]').click(); });
    await p.waitForTimeout(1200); return p; };
  const clr = (p) => p.evaluate(() => { for (const m of document.querySelectorAll('#layer .modal,.bsplash,.dropsplash,.flsplash')) { const w = m.closest('#layer .modal') || m; if (w.parentNode) w.parentNode.removeChild(w); } });
  const scan = (p) => p.evaluate(() => { const lum = (c) => { const m = /(\d+(?:\.\d+)?)[, ]+(\d+(?:\.\d+)?)[, ]+(\d+(?:\.\d+)?)/.exec(c || ''); if (!m) return -1; const f = (v) => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(+m[1]) + .7152 * f(+m[2]) + .0722 * f(+m[3]); };
    const alpha = (c) => { const m = /rgba?\(([^)]+)\)/.exec(c || ''); if (!m) return 1; const a = m[1].split(/[, /]+/).filter(Boolean); return a.length > 3 ? +a[3] : 1; };
    const root = document.querySelector('.qshop') || document.querySelector('#app'); const low = [], img = []; let n = 0;
    for (const el of root.querySelectorAll('*')) { const own = [...el.childNodes].filter((t) => t.nodeType === 3 && t.textContent.trim()).map((t) => t.textContent.trim()).join(' '); if (!own) continue; const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
      if (!r.width || !r.height || cs.visibility === 'hidden' || +cs.opacity === 0 || r.bottom < 0) continue; n++; let bg = null, over = null;
      for (let e = el; e && e !== document.documentElement; e = e.parentElement) { const s = getComputedStyle(e); if (s.backgroundImage && s.backgroundImage !== 'none' && !over) over = e.className || e.tagName; if (alpha(s.backgroundColor) > .6) { bg = s.backgroundColor; break; } }
      if (!bg) bg = getComputedStyle(document.body).backgroundColor; const L1 = lum(cs.color), L2 = lum(bg); if (L1 < 0 || L2 < 0) continue; const ratio = (Math.max(L1, L2) + .05) / (Math.min(L1, L2) + .05); const big = parseFloat(cs.fontSize) >= 18 || (parseFloat(cs.fontSize) >= 14 && +cs.fontWeight >= 700);
      const rec = own.slice(0, 26) + ' [' + ratio.toFixed(1) + ' ' + cs.color.replace(/\s/g, '') + ' on ' + bg.replace(/\s/g, '') + ']'; if (ratio < (big ? 3 : 4.5)) (over ? img : low).push(rec + (over ? ' over ' + String(over).slice(0, 20) : '')); }
    return { n, low: [...new Set(low)], img: [...new Set(img)], sw: document.documentElement.scrollWidth, vw: innerWidth }; });
  const report = async (p, name, file) => { await clr(p); await p.waitForTimeout(300); await clr(p); const s = await scan(p); await p.screenshot({ path: OUT + '/' + file + '.png' });
    console.log('     ' + name + ': ' + s.n + ' texts; below contrast on a solid colour: ' + s.low.length + (s.low.length ? ' ' + JSON.stringify(s.low.slice(0, 6)) : '') + '; over a picture or gradient (not judged): ' + s.img.length + (s.img.length ? ' ' + JSON.stringify(s.img.slice(0, 3)) : '') + (s.sw > s.vw ? ' | PAGE WIDER ' + s.sw : ''));
    return s; };
  const p = await open(390); const all = []; const go = async (k) => { await clr(p); await p.evaluate((k) => window.__qbV149.go(k), k); await p.waitForTimeout(900); };
  await go('home'); all.push(await report(p, 'home', 'sh_home'));
  await go('street'); all.push(await report(p, 'Street, first screen', 'sh_street'));
  const tabs = await p.evaluate(() => [...document.querySelectorAll('.qshop [data-qsfl]')].map((e) => 'fl:' + e.dataset.qsfl).concat([...document.querySelectorAll('.qshop [data-act="stab"]')].map((e) => 'tab:' + e.dataset.v)));
  console.log('     Street floors and brand tabs: ' + tabs.join(', '));
  for (const t of tabs) { const [k, v] = t.split(':'); await clr(p); await p.evaluate(([k, v]) => { const e = document.querySelector(k === 'fl' ? '.qshop [data-qsfl="' + v + '"]' : '.qshop [data-act="stab"][data-v="' + v + '"]'); if (e) e.dispatchEvent(new MouseEvent('click', { bubbles: true })); }, [k, v]); await p.waitForTimeout(700);
    all.push(await report(p, 'Street ' + t, 'sh_' + k + '_' + v)); if (k === 'tab') { await p.evaluate(() => window.scrollTo(0, 700)); await p.waitForTimeout(300); await p.screenshot({ path: OUT + '/sh_' + k + '_' + v + '_rack.png' }); await p.evaluate(() => window.scrollTo(0, 0)); } }
  for (const k of ['stylist', 'closet', 'pets', 'vault']) { await go(k); const h = await p.evaluate(() => window.__qbV149.hub()); if (h !== k && !(k === 'closet' && h === 'closet')) { console.log('     (' + k + ': not open here, hub ' + h + ')'); continue; } all.push(await report(p, k, 'sh_' + k));
    if (k === 'pets') { const pt = await p.evaluate(() => [...document.querySelectorAll('.qshop [data-act^="p2"], .qshop [data-p2tab]')].filter((e) => /tab/i.test(e.dataset.act || '') || e.dataset.p2tab).length); for (let i = 0; i < Math.min(pt, 5); i++) { await clr(p); await p.evaluate((i) => { const e = [...document.querySelectorAll('.qshop [data-act^="p2"], .qshop [data-p2tab]')].filter((x) => /tab/i.test(x.dataset.act || '') || x.dataset.p2tab)[i]; if (e) e.dispatchEvent(new MouseEvent('click', { bubbles: true })); }, i); await p.waitForTimeout(700); all.push(await report(p, 'Pet Store tab ' + i, 'sh_pets_' + i)); } } }
  await go('iface'); for (const t of ['ban', 'upg', 'ifc']) { await clr(p); await p.evaluate((t) => { const e = document.querySelector('.qshop [data-act="iftab"][data-v="' + t + '"]'); if (e) e.dispatchEvent(new MouseEvent('click', { bubbles: true })); }, t); await p.waitForTimeout(700); all.push(await report(p, 'Interface ' + t, 'sh_iface_' + t)); }
  ok(all.every((s) => s.sw <= s.vw), 'no Shop screen is wider than the page at 390');
  const lows = all.reduce((a, s) => a + s.low.length, 0); ok(lows === 0, 'no text below contrast on a solid colour across ' + all.length + ' screens (' + lows + ' found)');
  /* Interface, real taps: an upgrade and an interface piece */
  const buyIn = async (t) => { await go('iface'); await clr(p); await p.evaluate((t) => { const e = document.querySelector('.qshop [data-act="iftab"][data-v="' + t + '"]'); if (e) e.dispatchEvent(new MouseEvent('click', { bubbles: true })); }, t); await p.waitForTimeout(700); await clr(p);
    const btns = await p.evaluate(() => [...document.querySelectorAll('.qshop button, .qshop [data-act]')].filter((e) => e.getBoundingClientRect().width && !/iftab|^$/.test(e.dataset.act || '') && !e.closest('.nav')).map((e, i) => { e.setAttribute('data-qa-b', String(i)); return i + ':' + (e.dataset.act || '') + '=' + e.textContent.replace(/\s+/g, ' ').trim().slice(0, 30); }));
    const c0 = await p.evaluate(() => window.__qb.x().S.coins); const pick = btns.find((x) => /buy|unlock|\d{2,}/i.test(x.split('=')[1] || '') && !/view|preview|equipped|owned/i.test(x)); if (!pick) return { t, btns: btns.slice(0, 12), none: 1 };
    const el = await p.$('[data-qa-b="' + pick.split(':')[0] + '"]'); await el.scrollIntoViewIfNeeded(); await el.click(); await p.waitForTimeout(700); const c1 = await p.evaluate(() => window.__qb.x().S.coins);
    const m = await p.evaluate(() => { const m = [...document.querySelectorAll('#layer .modal')].pop(); if (!m) return null; const b = [...m.querySelectorAll('button')].find((e) => /buy|confirm|unlock|yes|place|install/i.test(e.textContent) && !/not now|cancel|keep/i.test(e.textContent)); if (b) b.setAttribute('data-qa-ok', '1'); return m.innerText.replace(/\s+/g, ' ').slice(0, 120); });
    if (m && await p.$('[data-qa-ok]')) { await p.click('[data-qa-ok]'); await p.waitForTimeout(1000); } const c2 = await p.evaluate(() => window.__qb.x().S.coins); return { t, pick, oneTap: c1 !== c0, confirm: m, paid: c0 - c2 }; };
  const u = await buyIn('upg'), f = await buyIn('ifc'); console.log('     Interface buys: ' + JSON.stringify(u) + '\n     ' + JSON.stringify(f));
  ok(!u.none && !u.oneTap && u.paid > 0, 'Interface > Upgrades: one bought through its confirm, nothing on the first tap (paid ' + u.paid + ')');
  ok(!f.none && !f.oneTap && f.paid > 0, 'Interface > Interface: one piece bought through its confirm, nothing on the first tap (paid ' + f.paid + ')');
  const vw = await p.evaluate(() => { const e = [...document.querySelectorAll('.qshop button, .qshop [data-act]')].find((x) => /^view$|preview/i.test(x.textContent.trim()) && x.getBoundingClientRect().width); if (!e) return null; e.setAttribute('data-qa-view', '1'); return e.dataset.act + '=' + e.textContent.trim(); });
  if (vw) { const c0 = await p.evaluate(() => window.__qb.x().S.coins); await p.click('[data-qa-view]'); await p.waitForTimeout(1200); const s = await p.evaluate(() => ({ modal: [...document.querySelectorAll('#layer .modal')].map((m) => m.innerText.replace(/\s+/g, ' ').slice(0, 60)).join(' / '), view: window.__qb.x().S && document.body.className.slice(0, 60) })); const c1 = await p.evaluate(() => window.__qb.x().S.coins); await p.screenshot({ path: OUT + '/sh_view.png' });
    ok(c1 === c0, 'View on an interface piece (' + vw + ') spends nothing: ' + JSON.stringify(s)); } else console.log('     (no View button found in Interface > Interface)');
  /* old Upgrades links */
  const old = await p.evaluate(() => ({ nav: [...document.querySelectorAll('.nav button[data-v]')].map((q) => q.dataset.v).join(), sys: (() => { try { window.__qbV159.sysOpen('upgrades'); return window.__qbV159.hub(); } catch (e) { return 'err ' + e.message; } })() })); await p.waitForTimeout(700);
  ok(!/sys|upgrades/.test(old.nav) && old.sys === 'iface', 'no Upgrades tab on the bar, and the old way in lands in Interface ' + JSON.stringify(old));
  await p.context().close();
  /* desktop width */
  const d = await open(1280, 900); await d.evaluate(() => window.__qbV149.go('home')); await d.waitForTimeout(900); const dh = await report(d, 'home at 1280', 'sh_desk_home'); await d.evaluate(() => window.__qbV149.go('street')); await d.waitForTimeout(900); const ds = await report(d, 'Street at 1280', 'sh_desk_street');
  await d.evaluate(() => window.__qbV149.go('iface')); await d.waitForTimeout(900); const di = await report(d, 'Interface at 1280', 'sh_desk_iface'); ok([dh, ds, di].every((s) => s.sw <= s.vw), 'nothing wider than the page at 1280'); await d.context().close();
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
