// Cal 11-25 (29zz_v155.js): the header's avatar is a small player card (backdrop whole, character, companion); tapping it opens the
// player card on every screen that has the header; the card has a Profile button; the old small card button is gone; nothing in the
// header is cut or overlaps at 320, 360, 390 and 430 px.
//   PORT=<plain build> NODE_PATH=<playwright's parent> OUT=<dir> node rigtest/lead/header155.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8779, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const errs = [];
  for (const W of [390, 320, 360, 430]) { const p = await (await b.newContext({ viewport: { width: W, height: 844 }, deviceScaleFactor: 2 })).newPage(); p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
    await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbV152 && window.__qbV150, null, { timeout: 90000 }); await p.waitForTimeout(800);
    await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' });
    const V = (f, a) => p.evaluate(f, a);
    await V(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Calzone Longname', sex: 'm' }); S.xp = x.cum(26); S.gates = [5, 10, 20]; S.calm = false; S.tutDone = 1; S.coins = 123456; S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1 }; S.areaOn = { board: 1, hideout: 1, hall: 1, shop: 1 };
      try { window.__qbRooms.open('closet', 1); } catch (e) {} S.brandSeen = S.brandSeen || {}; try { window.__qbDrops.state().live.forEach((q) => { S.brandSeen[q.id + '|' + q.start] = 1; }); } catch (e) {} const H = window.__qbV150.state(); H.own.wolf = { n: 'Fenrir', xp: 0, evo: 0, form: 0, t: Date.now() }; H.seen = 1; S.pet = { k: 'wolf', t: Date.now() }; S.dogref = { at: 1 }; delete S.pc; x.render(); document.querySelector('.nav button[data-v="board"]').click(); });
    await p.waitForTimeout(700); const clear = () => V(() => document.querySelectorAll('#layer .modal,.bsplash,.dropsplash').forEach((m) => m.remove())); await clear();
    const geo = () => V(() => { const av = document.querySelector('.strip .avbtn'), r = (e) => { const q = e.getBoundingClientRect(); return { l: Math.round(q.left), r: Math.round(q.right), t: Math.round(q.top), b: Math.round(q.bottom), w: Math.round(q.width), h: Math.round(q.height) }; }; if (!av) return null; const a = r(av), col = document.querySelector('.strip .v9col'), kids = col ? [...col.querySelectorAll('.brand,.coinpill,.rankpill,.ibbtn,.right>*')].map(r) : [], fig = av.querySelector('.pc-fig img.calp'), pet = av.querySelector('.fsh-pet');
      return { a, cls: av.className, act: av.dataset.act, bg: getComputedStyle(av).backgroundImage.slice(0, 40), ratio: +(a.w / a.h).toFixed(3), pcbtn: !!document.querySelector('.pcbtn'), fig: fig ? r(fig) : null, pet: pet ? r(pet) : null, minL: kids.length ? Math.min(...kids.map((k) => k.l)) : null, maxR: kids.length ? Math.max(...kids.map((k) => k.r)) : null, vw: window.innerWidth, sw: document.documentElement.scrollWidth }; });
    /* Studio first */
    let g = await geo(); ok(g && /pcav/.test(g.cls) && /pc-studio/.test(g.cls) && g.act === 'pcard' && !g.pcbtn, W + ': the avatar is a card (Studio) that opens the player card; the small card button is gone');
    ok(g && Math.abs(g.ratio - 0.75) < 0.02, W + ': the card is 3:4, so a backdrop shows whole (' + (g && g.a.w + 'x' + g.a.h) + ')');
    ok(g && g.minL !== null && g.minL >= g.a.r + 8 && g.maxR <= g.vw && g.sw <= g.vw, W + ': the name, coins and rank sit right of the card and inside the page (card right ' + (g && g.a.r) + ', text ' + (g && g.minL) + ' to ' + (g && g.maxR) + ', page ' + (g && g.vw) + ')');
    ok(g && g.fig && g.fig.h > 60 && g.fig.t >= g.a.t - 1 && g.pet && g.pet.w > 8 && g.pet.l >= g.a.l && g.pet.r <= g.a.r, W + ': the character stands inside the card with the companion beside them ' + JSON.stringify(g && { fig: g.fig, pet: g.pet }));
    await p.screenshot({ path: OUT + '/header155_' + W + '_studio.png', clip: { x: 0, y: 0, width: W, height: 260 } });
    /* every painted backdrop */
    const ids = await V(() => window.__qbV152.list.filter((q) => q[0] !== 'studio' && window.__qbV152.has(q[0])).map((q) => q[0]));
    for (const id of (W === 390 ? ids : ids.slice(0, 2))) { await V((id) => { const o = window.__qbV152.st(); o.own[id] = 1; o.bg = id; window.__qb.x().render(); }, id); await p.waitForTimeout(500); g = await geo();
      ok(g && new RegExp('pc-' + id).test(g.cls) && /^url\(/.test(g.bg), W + ': backdrop ' + id + ' is on the header card'); await p.screenshot({ path: OUT + '/header155_' + W + '_' + id + '.png', clip: { x: 0, y: 0, width: W, height: 260 } }); }
    /* tapping it opens the card on every screen with the header */
    const views = await V(() => [...document.querySelectorAll('.nav button[data-v]')].map((q) => q.dataset.v)); const seen = [];
    for (const v of views) { await clear(); await V((v) => document.querySelector('.nav button[data-v="' + v + '"]').click(), v); await p.waitForTimeout(700); await clear();
      const has = await V(() => { const a = document.querySelector('.strip .avbtn'); if (!a) return 0; const r = a.getBoundingClientRect(); if (!(r.width > 0 && r.height > 0)) return 0; window.scrollTo(0, 0); const q = a.getBoundingClientRect(), e = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2); return e && a.contains(e) ? 1 : 0; /* the Loft's room covers the header */ }); if (!has) { seen.push(v + ':no header shown'); continue; }
      await p.click('.strip .avbtn'); await p.waitForTimeout(500); const m = await V(() => { const m = document.querySelector('#layer .pcm'); return m ? [...m.querySelectorAll('button')].map((q) => q.dataset.act).join() : null; });
      ok(m && /char/.test(m) && /pcbgs/.test(m), W + ': on "' + v + '" the avatar opens the player card (' + m + ')'); seen.push(v); if (W === 390 && v === 'board') await p.screenshot({ path: OUT + '/header155_card.png' }); }
    console.log('     screens: ' + seen.join(', '));
    /* Profile from the card; the level bar still opens the profile */
    await clear(); await V(() => document.querySelector('.nav button[data-v="board"]').click()); await p.waitForTimeout(500); await clear(); await p.click('.strip .avbtn'); await p.waitForTimeout(400);
    await p.click('#layer .pcm [data-act="char"]'); await p.waitForTimeout(500); ok(await V(() => !!document.querySelector('#layer .prof') && !document.querySelector('#layer .pcm')), W + ': Profile on the card opens the profile');
    await clear(); await p.click('.bline'); await p.waitForTimeout(400); ok(await V(() => !!document.querySelector('#layer .prof')), W + ': the level bar opens the profile'); await clear();
    if (W === 390) { const t = await V(() => { return window.__qbV155.tours().map((q) => q.id + ':' + q.sel + ':' + q.x); }); ok(t.length === 2 && t.every((q) => /:\.bline:/.test(q) && /level bar/.test(q) && !/Tap your character/.test(q)), 'the Relics and freeze tours point at the level bar: ' + t.map((q) => q.slice(0, 60)).join(' | ')); }
    await p.context().close(); }
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
