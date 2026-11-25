// QA, ec599538 (29zz_v156.js, the scratch card rubbed for real, its button by the mailbox). What LEAD's scratch156.js leaves out:
//   A  the header at 320 and 360 with big coins, mail and the card button: inside the page, nothing overlapping, the card avatar clear
//   B  a three-mascot card (c.out preset) rubbed clear: the pay, the pop and the burst through the rub path
//   C  two fingers on two fresh panels at once (CDP touch): no more than 3 picks, and both panels can still be rubbed clear after
//   D  the alerts' "!" on .scbtn when the area is new
//   E  the foil, enlarged (its glyph), and the live card at 320
//   PORT=<plain build> OUT=<dir> node scratch156qa.js
const pw = require('playwright');
const PORT = process.env.PORT || 8819, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const errs = [];
  const open = async (W, touch, extra) => { const ctx = await b.newContext({ viewport: { width: W, height: 844 }, deviceScaleFactor: 2, hasTouch: !!touch }); await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
    const p = await ctx.newPage(); p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
    await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV146 && window.__qbV156, null, { timeout: 120000 }); await p.waitForTimeout(800);
    await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' });
    await p.evaluate((extra) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Calzone Longname', sex: 'm' }); S.xp = x.cum(12); S.gates = [5, 10]; S.calm = false; S.tutDone = 1; S.coins = 1234567;
      S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1 }; S.areaOn = { board: 1, hideout: 1, hall: 1, wheel: 1 }; S.cdone = { a: 1, b: 1, c: 1 }; delete S.sc;
      if (extra && extra.bang) { S.alSeen = { init: 1, room: {}, bld: {}, tab: { board: 1, train: 1, hideout: 1, hall: 1 }, brand: {} }; }
      const c = window.__qbV146.state(); if (extra && extra.out) c.out = extra.out; x.persist(); x.render(); document.querySelector('.nav button[data-v="board"]').click(); }, extra || {});
    await p.waitForTimeout(800); await p.evaluate(() => document.querySelectorAll('#layer .modal,.bsplash,.dropsplash').forEach((m) => m.remove())); return p; };
  const R = (e) => { const q = e.getBoundingClientRect(); return [Math.round(q.left), Math.round(q.top), Math.round(q.right), Math.round(q.bottom)]; };
  /* A */
  for (const W of [320, 360]) { const p = await open(W); const g = await p.evaluate(() => { const r = (e) => { const q = e.getBoundingClientRect(); return [Math.round(q.left), Math.round(q.top), Math.round(q.right), Math.round(q.bottom)]; };
      const items = [...document.querySelectorAll('.strip .avbtn, .strip .brand, .strip .coinpill, .strip .kdbtn, .strip .ibbtn, .strip .scbtn, .strip .rankpill')].filter((e) => e.getBoundingClientRect().width).map((e) => ({ k: e.className.split(' ')[0], b: r(e) }));
      let over = []; for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++) { const a = items[i].b, c = items[j].b; if (a[0] < c[2] - 1 && c[0] < a[2] - 1 && a[1] < c[3] - 1 && c[1] < a[3] - 1) over.push(items[i].k + '/' + items[j].k); }
      return { items, over, vw: innerWidth, sw: document.documentElement.scrollWidth, maxR: Math.max(...items.map((q) => q.b[2])) }; });
    ok(g.over.length === 0 && g.maxR <= g.vw && g.sw <= g.vw, 'A ' + W + ': header items inside the page and not overlapping ' + JSON.stringify({ over: g.over, maxR: g.maxR, vw: g.vw, items: g.items.map((q) => q.k + ':' + q.b.join(',')).join(' ') }));
    await p.screenshot({ path: OUT + '/qa156_A_' + W + '.png', clip: { x: 0, y: 0, width: W, height: 240 } }); await p.context().close(); }
  /* B */
  { const p = await open(390, 0, { out: ['m', 'm', 'm'] }); await p.click('.strip .scbtn'); await p.waitForTimeout(600); const c0 = await p.evaluate(() => window.__qb.x().S.coins);
    for (const i of [0, 4, 8]) { const r = await p.evaluate((i) => { const q = document.querySelectorAll('.sc-cell')[i].getBoundingClientRect(); return { x: q.left, y: q.top, w: q.width, h: q.height }; }, i);
      await p.mouse.move(r.x + r.w * .1, r.y + r.h * .1); await p.mouse.down(); for (let k = 0; k < 7; k++) { const y = r.y + r.h * (.1 + .8 * k / 6); await p.mouse.move(r.x + r.w * .1, y, { steps: 3 }); await p.mouse.move(r.x + r.w * .9, y, { steps: 6 }); } await p.mouse.up(); await p.waitForTimeout(500);
      if (i === 0) { const fr = await p.evaluate(() => { const q = document.querySelectorAll('.sc-cell')[1].getBoundingClientRect(); return { x: q.left, y: q.top, width: q.width, height: q.height }; }); await p.screenshot({ path: OUT + '/qa156_E_foil.png', clip: fr }); } }
    await p.waitForTimeout(400); const pops = []; for (let k = 0; k < 12; k++) { const t = await p.evaluate(() => [...document.querySelectorAll('.pop')].map((e) => e.textContent).join(' | ')); if (t && !pops.includes(t)) pops.push(t); await p.waitForTimeout(150); }
    const s = await p.evaluate(() => { const c = window.__qbV146.state(); return { done: !!c.done, res: c.res, coins: window.__qb.x().S.coins, burst: document.querySelectorAll('.burst, .confetti, canvas.burst, .bst').length }; });
    ok(s.done && s.coins - c0 >= 1500 && /scratch card/i.test(pops.join(' ')), 'B three mascots rubbed clear: paid ' + (s.coins - c0) + ', result "' + s.res + '", pops ' + JSON.stringify(pops) + ', burst elements ' + s.burst);
    await p.screenshot({ path: OUT + '/qa156_B_win.png' }); await p.context().close(); }
  /* C */
  { const p = await open(390, 1); await p.click('.strip .scbtn'); await p.waitForTimeout(600); const cdp = await p.context().newCDPSession(p);
    const ctr = (i) => p.evaluate((i) => { const q = document.querySelectorAll('.sc-cell')[i].getBoundingClientRect(); return { x: q.left + q.width * .2, y: q.top + q.height * .3, w: q.width }; }, i);
    const a = await ctr(3), c = await ctr(5); const T = (type, pts) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts.map((q, k) => ({ x: q[0], y: q[1], id: k + 1 })) });
    await T('touchStart', [[a.x, a.y], [c.x, c.y]]); for (let k = 1; k <= 12; k++) { await T('touchMove', [[a.x + a.w * .05 * k, a.y + (k % 2) * 6], [c.x + c.w * .05 * k, c.y + (k % 2) * 6]]); await p.waitForTimeout(30); } await T('touchEnd', []); await p.waitForTimeout(500);
    const s1 = await p.evaluate(() => { const c = window.__qbV146.state(); return { pick: c.pick.slice(), clr: (c.clr || []).slice(), cv: window.__qbV156.cv(), faces: [...document.querySelectorAll('.sc-cell')].map((e, i) => e.querySelector('.sc-face') ? i : -1).filter((i) => i >= 0), y: scrollY }; });
    console.log('     two fingers on panels 3 and 5 at once: ' + JSON.stringify(s1));
    /* each begun panel can still be rubbed clear with one finger */
    for (const i of s1.pick) { const r = await p.evaluate((i) => { const q = document.querySelectorAll('.sc-cell')[i].getBoundingClientRect(); return { x: q.left, y: q.top, w: q.width, h: q.height }; }, i);
      await T('touchStart', [[r.x + r.w * .1, r.y + r.h * .1]]); for (let k = 0; k < 7; k++) { const y = r.y + r.h * (.1 + .8 * k / 6); for (let s = 0; s <= 6; s++) { await T('touchMove', [[r.x + r.w * (.1 + .8 * s / 6), y]]); } } await T('touchEnd', []); await p.waitForTimeout(500); }
    const s2 = await p.evaluate(() => { const c = window.__qbV146.state(); return { pick: c.pick.slice(), clr: (c.clr || []).slice(), cv: window.__qbV156.cv() }; });
    ok(s1.pick.length <= 2 && s2.pick.every((i) => s2.clr.includes(i)) && s1.y === 0, 'C two fingers at once: ' + s1.pick.length + ' pick(s) made, each then rubbed clear (' + JSON.stringify(s2) + '), no scroll');
    await p.screenshot({ path: OUT + '/qa156_C_two.png' }); await p.context().close(); }
  /* D */
  { const p = await open(390, 0, { bang: 1 }); await p.evaluate(() => window.__qb.x().render()); await p.waitForTimeout(600); const d = await p.evaluate(() => { const e = document.querySelector('.strip .scbtn'); const n = e && e.querySelector('.nbang'); return { cls: e && e.className, bang: !!n, dot: !!(e && e.querySelector('i:not(.nbang)')), nb: n ? [Math.round(n.getBoundingClientRect().left), Math.round(n.getBoundingClientRect().top), Math.round(n.getBoundingClientRect().right)] : null, vw: innerWidth }; });
    console.log('     D the button with the area new: ' + JSON.stringify(d)); const r = await p.evaluate(() => { const q = document.querySelector('.strip .scbtn').getBoundingClientRect(); return { x: q.left - 30, y: q.top - 20, width: 80, height: 70 }; }); await p.screenshot({ path: OUT + '/qa156_D_bang.png', clip: r }); await p.context().close(); }
  /* E at 320: the live card */
  { const p = await open(320); await p.click('.strip .scbtn'); await p.waitForTimeout(800); const g = await p.evaluate(() => { const c = document.querySelector('.sc-card'); return c ? { card: [Math.round(c.getBoundingClientRect().left), Math.round(c.getBoundingClientRect().right)], vw: innerWidth, sw: document.documentElement.scrollWidth } : null; });
    ok(g && g.card[0] >= 0 && g.card[1] <= g.vw && g.sw <= g.vw, 'E 320: the live card fits ' + JSON.stringify(g)); await p.screenshot({ path: OUT + '/qa156_E_320.png' }); await p.context().close(); }
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
