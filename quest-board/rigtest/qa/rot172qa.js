// QA, 621cd283 (29zz_v172.js, Cal 11-25: 3 brands at all times; drops Mon and Thu, the Vault on Wednesday, pets Tue and Fri). What
// rot172.js leaves out, on the SANDBOX web build (qbGM() is true there): the game master's "Next drop" tab the day before a drop (which
// brand, which day, its pieces) and the brand splash a player sees on the morning of a Monday and a Thursday drop.
//   BASE=<server of quest-board/> OUT=<dir> node rot172qa.js   (dist-web built with QB_SANDBOX=1 QB_TARGET=web)
const pw = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:8819', OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
const T = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1 };
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const errs = [];
  const at = async (iso) => { const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 }); await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort())); const p = await ctx.newPage(); p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
    await p.addInitScript((iso) => { window.__qbShiftTo = iso; }, iso);
    await p.goto(BASE + '/dist-web/index.html'); await p.waitForFunction(() => window.__qb && window.__qbDrops && window.__qbV172, null, { timeout: 120000 });
    await p.evaluate(() => { window.__qbShift = new Date(window.__qbShiftTo).getTime() - Date.now(); }); await p.waitForTimeout(500);
    await p.evaluate((T) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'GM', sex: 'm' }); S.xp = x.cum(20) + 10; S.gates = [5, 10, 20]; S.tutDone = 1; S.coins = 500; S.v67ref = 1; S.tours = T; S.floorSeen = { boutique: 'x', atelier: 'x' }; try { window.__qbRooms.open('closet', 1); } catch (e) {} /* a player who saw yesterday's brands */ S.brandSeen = {}; const sh = window.__qbShift; window.__qbShift = sh - 864e5; try { window.__qbDrops.state().live.forEach((q) => { S.brandSeen[q.id + '|' + q.start] = 1; }); } catch (e) {} window.__qbShift = sh; x.persist(); x.render(); }, T);
    return p; };
  const live = (p) => p.evaluate(() => { const st = window.__qbDrops.state(); return { ymd: window.__qbDrops.ymd(), live: st.live.map((q) => q.id), back: st.back ? st.back.id : null }; });
  /* the day before each of the first drops: the GM tab */
  for (const [eve, drop] of [['2026-11-29T12:00:00', '2026-11-30'], ['2026-12-02T12:00:00', '2026-12-03']]) { const p = await at(eve); const L = await live(p);
    await p.evaluate(() => { for (const m of document.querySelectorAll('#layer > *')) m.remove(); const n = document.querySelector('.nav button[data-v="shop"]'); if (n) n.click(); }); await p.waitForTimeout(900); await p.evaluate(() => { for (const m of document.querySelectorAll('#layer > *')) m.remove(); });
    const tab = await p.evaluate(() => { try { window.__qbV149.go('street'); } catch (e) {} return true; }); await p.waitForTimeout(700); await p.evaluate(() => { for (const m of document.querySelectorAll('#layer > *')) m.remove(); });
    const has = await p.evaluate(() => !!document.querySelector('[data-act="stab"][data-v="gmnext"]')); let gm = null; if (!has) console.log('     no GM tab; navs: ' + JSON.stringify(await p.evaluate(() => [...document.querySelectorAll('nav')].map((n) => n.className + '|' + (n.getAttribute('aria-label') || '')))) + ' gm=' + await p.evaluate(() => { try { return window.QB_WEB && (window.QB_WEB.sandbox ? 'sandbox' : 'web'); } catch (e) { return '?'; } }));
    if (has) { await p.evaluate(() => document.querySelector('[data-act="stab"][data-v="gmnext"]').click()); await p.waitForTimeout(700); gm = await p.evaluate(() => ({ lead: (document.querySelector('.qs-note.qs-lead') || {}).textContent || '', secs: [...document.querySelectorAll('.qs-sec h3')].map((h) => h.textContent), cards: document.querySelectorAll('.qs-sec .qs-card').length })); await p.screenshot({ path: OUT + '/gm_' + drop + '.png' }); }
    const newId = [];
    const want = { '2026-11-30': 'ALTITUDE', '2026-12-03': 'KODE PINK' }[drop]; /* the brands the Monday and Thursday mornings below open with (rot172: 11-30 alt, 12-03 kp) */
    ok(has && gm && gm.secs.length === 1 && gm.cards > 0 && gm.secs[0].toUpperCase().includes(want), eve + ': the GM sees a "Next drop" tab with the one brand that drops next (' + want + ') and its pieces ' + JSON.stringify({ live: L.live, gm }));
    await p.context().close(); }
  /* the morning of a Monday and a Thursday drop: the brand splash */
  for (const morning of ['2026-11-30T08:30:00', '2026-12-03T08:30:00']) { const p = await at(morning); await p.waitForTimeout(1500); await p.evaluate(() => { for (const m of document.querySelectorAll('#layer > *')) m.remove(); const n = document.querySelector('.nav button[data-v="shop"]'); if (n) n.click(); }); await p.waitForTimeout(3000); const L = await live(p);
    const sp = await p.evaluate(() => [...document.querySelectorAll('.bsplash,.dropsplash,#layer .modal')].map((e) => e.className + ': ' + e.innerText.replace(/\s+/g, ' ').slice(0, 90)));
    await p.screenshot({ path: OUT + '/splash_' + morning.slice(0, 10) + '.png' });
    const nm = await p.evaluate((id) => { const b = (window.__qbDrops.state().live || []).find((q) => q.id === id); return b ? b.name : id; }, L.live[L.live.length - 1]); ok(sp.some((s) => /NOW ON SALE/i.test(s) && s.toUpperCase().includes(String(nm).toUpperCase())) && L.live.length === 3, morning + ': a player who saw yesterday\'s brands gets the NEW brand\'s splash (' + nm + '); 3 brands live ' + JSON.stringify({ L, sp: sp.slice(0, 1) }));
    await p.context().close(); }
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
