// Cal 11-25 (29zz_v167.js): every brand in one row of tabs (no Street / Boutique tabs, no level lock), the Boutique about 2x the Street
// and its brand's picture over the whole page; the Board's Goals button (the profile has no NEXT line); the try-on card's character
// inside its frame with every hat on; the old Boutique price back once.
//   PORT=<build server> NODE_PATH=<playwright's parent> OUT=<dir> node rigtest/lead/shop167.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8838, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const errs = [];
  for (const W of [390, 320]) { const p = await (await b.newContext({ viewport: { width: W, height: 844 }, deviceScaleFactor: 2 })).newPage(); p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
    await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbV167 && window.__qbV149, null, { timeout: 90000 }); await p.waitForTimeout(800);
    await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' }); const V = (f, a) => p.evaluate(f, a);
    await V(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Calzone', sex: 'm' }); S.xp = x.cum(4) + 10; S.gates = []; S.calm = false; S.tutDone = 1; S.coins = 1297; S.v67ref = 1; S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1 };
      try { window.__qbRooms.open('closet', 1); } catch (e) {} S.brandSeen = {}; S.floorSeen = { boutique: 'x', atelier: 'x' }; try { window.__qbDrops.state().live.forEach((q) => { S.brandSeen[q.id + '|' + q.start] = 1; }); } catch (e) {} x.render(); });
    const clear = async () => { await p.waitForTimeout(1300); await V(() => document.querySelectorAll('#layer .modal,.bsplash,.dropsplash').forEach((m) => m.remove())); await p.waitForTimeout(400); };
    await clear();
    /* the Goals button */
    const gb = await V(() => { const b = document.querySelector('.strip [data-v67="goals"]'), a = document.querySelector('.strip .avbtn'); if (!b) return null; const r = b.getBoundingClientRect(), q = a.getBoundingClientRect(); return { l: r.left, r: r.right, t: r.top, b: r.bottom, al: q.right, ab: q.bottom, vw: innerWidth }; });
    ok(gb && gb.l >= gb.al && gb.r <= gb.vw && gb.b <= gb.ab + 4, W + ': the Board\'s header has Goals beside the card, inside the screen ' + JSON.stringify(gb));
    ok(await V(() => !document.querySelector('#app .zx-next')), W + ': no NEXT line on the Board');
    await V(() => document.querySelector('[data-v67="goals"]').click()); await p.waitForTimeout(500);
    const gm = await V(() => { const m = document.querySelector('#layer .v67modal'); return m ? [...m.querySelectorAll('.v67row')].map((r) => r.dataset.k) : null; });
    ok(gm && gm.indexOf('level') >= 0 && gm.indexOf('dq') >= 0 && gm.indexOf('wq') >= 0 && gm.some((k) => /^b\d/.test(k)), W + ': the Goals window lists the level, the Daily and Weekly Quests and the buildings\' goals ' + JSON.stringify(gm));
    await V(() => document.querySelector('#layer .v67modal .v67row[data-k^="b"]').click()); await p.waitForTimeout(500);
    ok(await V(() => !!document.querySelector('#layer .glmodal') && !document.querySelector('#layer .v67modal')), W + ': a building\'s row opens that building\'s Goals (where they are claimed)');
    await V(() => document.querySelectorAll('#layer .modal').forEach((m) => m.remove()));
    /* a ready goal counts on the button */
    const cnt = await V(() => { const x = window.__qb.x(); const before = window.__qbV167.goals().ready; const L = window.__qbGoals.list(0); return { before, n: L.length }; });
    await V(() => document.querySelector('.strip .avbtn').click()); await p.waitForTimeout(900);
    ok(await V(() => !document.querySelector('#layer .prof .zx-next') && !!document.querySelector('#layer .prof')), W + ': the profile has no NEXT line');
    await V(() => document.querySelectorAll('#layer .modal').forEach((m) => m.remove()));
    /* the Shop: one row of brands */
    await V(() => document.querySelector('.nav button[data-v="shop"]').click()); await clear(); await V(() => window.__qbV149.go('street')); await clear();
    const sh = await V(() => { const all = window.__qbV167.all(), tabs = [...document.querySelectorAll('nav.qs-tabs .qs-tab')].map((t) => t.dataset.v); return { floors: !!document.querySelector('.qs-floors'), tabs, all: all.map((q) => q.id + '/' + q.fl), prem: all.filter((q) => window.__qbV167.prem(q.id)).map((q) => q.id), dia: [...document.querySelectorAll('nav.qs-tabs .qs-tab.v67p')].map((t) => t.dataset.v) }; });
    ok(!sh.floors && sh.prem.length > 0 && sh.prem.every((id) => sh.tabs.indexOf(id) >= 0) && JSON.stringify(sh.dia) === JSON.stringify(sh.tabs.filter((id) => sh.prem.indexOf(id) >= 0)), W + ': at level 4 the Boutique\'s brands are in the one row with the Street\'s, marked by a diamond, no floor tabs ' + JSON.stringify(sh));
    const pr = await V(() => { const x = window.__qb.x(), mx = {}; x.SHOP.forEach((it) => { const m = it[6]; if (!m || !m.b || !/^a_/.test(it[1]) || m.cut || m.basic) return; const f = window.__qbV167.prem(m.b) ? 'b' : 's'; mx[f] = Math.max(mx[f] || 0, it[3]); }); return mx; });
    ok(pr.b <= 1200 && pr.s <= 600 && pr.b <= pr.s * 2.2, W + ': the dearest Boutique piece ' + pr.b + ' is about twice the dearest Street piece ' + pr.s);
    for (const id of sh.prem) { await V((id) => { document.querySelector('nav.qs-tabs .qs-tab[data-v="' + id + '"]').click(); window.scrollTo(0, 0); }, id); await p.waitForTimeout(600);
      const bg = await V(() => { const e = document.querySelector('.v67bg'); if (!e) return null; const r = e.getBoundingClientRect(), s = getComputedStyle(e); return { h: r.height, w: r.width, t: r.top, pos: s.position, img: /url\(/.test(s.backgroundImage), vh: innerHeight }; });
      await V(() => window.scrollTo(0, 2000)); await p.waitForTimeout(300); const bg2 = await V(() => { const e = document.querySelector('.v67bg'); const r = e.getBoundingClientRect(); return { t: r.top, b: r.bottom }; });
      ok(bg && bg.img && bg.pos === 'fixed' && bg.h >= bg.vh - 1 && bg.t === 0 && bg2.t === 0 && bg2.b >= bg.vh - 1, W + ': ' + id + '\'s picture covers the whole page, top to bottom, scrolled or not'); if (W === 390) await p.screenshot({ path: OUT + '/shop167_' + id + '_low.png' }); }
    const st = sh.tabs.find((id) => sh.prem.indexOf(id) < 0); await V((id) => { document.querySelector('nav.qs-tabs .qs-tab[data-v="' + id + '"]').click(); window.scrollTo(0, 0); }, st); await p.waitForTimeout(500);
    ok(await V(() => !document.querySelector('.v67bg')), W + ': a Street brand keeps its banner-and-colours page');
    /* the try-on card: every hat on sale, the character inside the frame */
    const hats = await V(() => [...document.querySelectorAll('nav.qs-tabs .qs-tab')].map((t) => t.dataset.v));
    const outs = []; let tried = 0;
    for (const id of hats) { await V((id) => { document.querySelector('nav.qs-tabs .qs-tab[data-v="' + id + '"]').click(); window.scrollTo(0, 0); }, id); await p.waitForTimeout(400);
      const ids = await V(() => [...document.querySelectorAll('[data-act="qstry"]')].map((e) => e.dataset.id).filter((i) => { const it = window.__qb.x().SHOP.find((q) => q[0] === i); return it && /^a_(hat|shoes|top)$/.test(it[1]); }));
      for (const it of ids) { await V((it) => { const b = document.querySelector('[data-act="qstry"][data-id="' + it + '"]'); b.click(); }, it); await p.waitForTimeout(900);
        const r = await V(() => { window.__qbV167.fit(); const gl = document.querySelector('.qs-mirror .qs-glass'), im = gl && gl.querySelector('img'); if (!im) return null; const bx = window.__qbV164.box(im); if (!bx) return { nobox: 1 }; const G = gl.getBoundingClientRect(), R = im.getBoundingClientRect();
          const d = { l: R.left + bx[0] * R.width, t: R.top + bx[1] * R.height, r: R.left + bx[2] * R.width, b: R.top + bx[3] * R.height }; return { in: d.l >= G.left + 1 && d.r <= G.right - 1 && d.t >= G.top + 1 && d.b <= G.bottom - 1, d: [d.l - G.left, d.t - G.top, G.right - d.r, G.bottom - d.b].map((v) => Math.round(v)) }; });
        tried++; if (!r || r.nobox || !r.in) outs.push(it + ':' + JSON.stringify(r));
        if (W === 390 && tried === 3) await p.screenshot({ path: OUT + '/shop167_try.png', clip: { x: 0, y: 0, width: W, height: 220 } });
        await V(() => { const c = document.querySelector('[data-act="qsclear"]'); if (c) c.click(); }); await p.waitForTimeout(150); } }
    ok(tried > 20 && outs.length === 0, W + ': the character stays inside the try-on frame with each of ' + tried + ' hats, tops and shoes on' + (outs.length ? ' OUT: ' + outs.slice(0, 6).join(', ') : ''));
    /* the refund */
    const rf = await V(() => { const x = window.__qb.x(), S = x.S; const it = x.SHOP.find((q) => q[6] && window.__qbV167.prem(q[6].b) && /^a_/.test(q[1]) && !q[6].cut); S.owned = {}; S.owned[it[0]] = 1; S.v67ref = 0; S.coins = 100; window.__qbV167.refund(); const a = S.coins; window.__qbV167.refund(); return { id: it[0], price: it[3], a, b: S.coins, flag: !!S.v67ref }; });
    ok(rf.a > 100 && rf.b === rf.a && rf.flag, W + ': owning ' + rf.id + ' (now ' + rf.price + ') pays the old price\'s difference once: +' + (rf.a - 100));
    await p.context().close(); }
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
