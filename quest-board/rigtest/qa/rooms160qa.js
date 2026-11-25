// QA, 113fe730 (29zz_v160.js: brand rooms with the banner as the background, the brand's name and emblem as the title, the countdown
// by the coins, no "+"/mail in the Shop, the character card fixed at the top and faded in with the scroll). What LEAD's shop160.js
// leaves out, at 390 and 320: every live brand's and floor's header (title vs countdown and coins, inside the page); the fixed card
// over the brand tabs (a try-on at the top, and part way through the fade): which controls it covers and whether a tap still reaches
// them; the floating coin pill over the card; the Closet and the Pet Store with the card; the Vault's room on its day; 1100 px.
//   PORT=<plain build> OUT=<dir> node rooms160qa.js
const pw = require('playwright');
const PORT = process.env.PORT || 8819, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const errs = [];
  const open = async (W, when, H) => { const ctx = await b.newContext({ viewport: { width: W, height: H || 844 }, deviceScaleFactor: 2 }); await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
    const p = await ctx.newPage(); p.on('pageerror', (e) => errs.push(e.message.slice(0, 160))); if (when) await p.clock.install({ time: new Date(when) });
    await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV149 && window.__qbV150, null, { timeout: 120000 }); await p.waitForTimeout(800);
    await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' });
    await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Roomy', sex: 'f' }); S.xp = x.cum(35); S.gates = [5, 10, 20, 30]; S.calm = false; S.tutDone = 1; S.coins = 1234567; S.ref53 = 1;
      S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1, interface: 1, upgrades: 1, lounge: 1 }; try { window.__qbRooms.open('closet', 1); } catch (e) {}
      S.pet = { k: 'wolf', t: Date.now() }; const P = window.__qbV150.state(); P.own = { wolf: { n: 'Ash', xp: 10, evo: 0, form: 0, asked: 1, t: Date.now() } }; P.seen = 1; x.persist(); x.render(); document.querySelector('.nav button[data-v="shop"]').click(); });
    await p.waitForTimeout(1200); return p; };
  const clr = (p) => p.evaluate(() => { for (const m of document.querySelectorAll('#layer .modal,.bsplash,.dropsplash,.flsplash')) { const w = m.closest('#layer .modal') || m; if (w.parentNode) w.parentNode.removeChild(w); } });
  const go = async (p, k) => { await clr(p); await p.evaluate((k) => window.__qbV149.go(k), k); await p.waitForTimeout(900); await clr(p); await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(300); };
  const head = (p) => p.evaluate(() => { const r = (e) => { if (!e) return null; const q = e.getBoundingClientRect(); return [Math.round(q.left), Math.round(q.top), Math.round(q.right), Math.round(q.bottom)]; }; const h = document.querySelector('.qshop .qs-top h1'), cb = document.querySelector('.qshop .qs-cbar'), cd = document.querySelector('.qshop .qs-cd');
    const H = r(h), C = r(cb), ov = H && C && H[0] < C[2] && C[0] < H[2] && H[1] < C[3] && C[1] < H[3]; return { title: h ? h.innerText.replace(/\s+/g, ' ').trim() : '', h: H, cbar: C, cd: cd ? cd.innerText.trim() : '', overlap: !!ov, clipped: h ? h.scrollWidth > h.clientWidth + 1 : false, sw: document.documentElement.scrollWidth, vw: innerWidth, plus: !!document.querySelector('.qshop .kdbtn, .qshop .ibbtn, .qshop .qs-when') }; });
  /* the card over the controls: which controls lie under it, and does a tap at their centre reach them? */
  const under = (p) => p.evaluate(() => { const m = document.querySelector('.qs-mirror.v60m'); if (!m) return { none: 1 }; const cs = getComputedStyle(m), R = m.getBoundingClientRect(); const op = +cs.opacity; const hit = [];
    for (const e of document.querySelectorAll('.qshop [data-act="stab"], .qshop [data-qsfl], .qshop .shub-back, .qshop [data-act="qstry"], .qshop .qs-top h1, .nav button')) { if (m.contains(e)) continue; const q = e.getBoundingClientRect(); if (!q.width) continue; const cx = q.left + q.width / 2, cy = q.top + q.height / 2;
      if (cx > R.left && cx < R.right && cy > R.top && cy < R.bottom) { const t = document.elementFromPoint(cx, cy); hit.push((e.dataset.act || e.dataset.qsfl || e.className.split(' ')[0] || e.tagName) + (t && (t === e || e.contains(t)) ? ':reachable' : ':BLOCKED')); } }
    const coin = document.querySelector('.qs-cbar .coinpill, .coinpill'); const c = coin ? coin.getBoundingClientRect() : null; const coinOver = c && op > .05 && c.left < R.right && R.left < c.right && c.top < R.bottom && R.top < c.bottom;
    return { op: +op.toFixed(2), pe: cs.pointerEvents, pos: cs.position, box: [Math.round(R.left), Math.round(R.top), Math.round(R.right), Math.round(R.bottom)], under: hit, coinOver: !!coinOver }; });
  for (const W of [390, 320]) { const p = await open(W); await go(p, 'street'); const heads = [];
    const floors = await p.evaluate(() => [...document.querySelectorAll('.qshop [data-qsfl]')].map((e) => e.dataset.qsfl)); const tabs = [];
    for (const fl of floors) { await clr(p); await p.evaluate((fl) => { document.querySelector('.qshop [data-qsfl="' + fl + '"]').click(); window.scrollTo(0, 0); }, fl); await p.waitForTimeout(800); await clr(p);
      const st = await p.evaluate(() => [...document.querySelectorAll('.qshop [data-act="stab"]')].map((e) => e.dataset.v)); if (!st.length) st.push('');
      for (const v of st) { if (v) { await clr(p); await p.evaluate((v) => { document.querySelector('.qshop [data-act="stab"][data-v="' + v + '"]').click(); window.scrollTo(0, 0); }, v); await p.waitForTimeout(800); await clr(p); }
        const t = fl + '/' + (v || '-'); tabs.push([fl, v]); const h = await head(p); heads.push(t + ' "' + h.title + '" ' + (h.overlap ? 'OVERLAPS the countdown/coins ' : '') + (h.clipped ? 'CLIPPED ' : '') + (h.sw > h.vw ? 'WIDER ' : '') + '[cd "' + h.cd + '"' + (h.plus ? ', + or mail still there' : '') + ']');
        if (W === 320) await p.screenshot({ path: OUT + '/r160_320_' + fl + '_' + (v || 'x') + '.png', clip: { x: 0, y: 0, width: W, height: 300 } }); } }
    console.log('     ' + W + ' headers:\n       ' + heads.join('\n       ')); ok(heads.every((x) => !/OVERLAPS|CLIPPED|WIDER|still there/.test(x)), W + ': every brand and floor header fits, nothing over the countdown and coins');
    /* a brand: the card part way through the fade and with a try-on at the top */
    const tb = tabs.find((x) => x[1]); const tab = tb ? tb.join('/') : null; if (tb) { await p.evaluate(([fl, v]) => { document.querySelector('.qshop [data-qsfl="' + fl + '"]').click(); }, tb); await p.waitForTimeout(700); await clr(p); await p.evaluate(([fl, v]) => { document.querySelector('.qshop [data-act="stab"][data-v="' + v + '"]').click(); }, tb); await p.waitForTimeout(800); await clr(p);
      for (const y of [0, 120, 160, 400]) { await p.evaluate((y) => window.scrollTo(0, y), y); await p.waitForTimeout(500); const u = await under(p); console.log('     ' + W + ' ' + tab + ' scrolled ' + y + ': card ' + JSON.stringify(u)); if (y === 160 || y === 400) await p.screenshot({ path: OUT + '/r160_' + W + '_scroll' + y + '.png' }); }
      await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(300); await clr(p); await p.evaluate(() => { const t = document.querySelector('.qshop [data-act="qstry"]'); if (t) t.click(); }); await p.waitForTimeout(900); await clr(p);
      await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(500); const u = await under(p); console.log('     ' + W + ' try-on at the top: card ' + JSON.stringify(u)); await p.screenshot({ path: OUT + '/r160_' + W + '_tryon_top.png' });
      ok(!u.under.some((x) => /BLOCKED/.test(x)), W + ': with a try-on at the top the card leaves the brand tabs, floors and back button tappable (' + u.under.join(', ') + ')');
      await p.evaluate(() => { const t = document.querySelector('[data-act="qsclear"]'); if (t) t.click(); }); await p.waitForTimeout(400); }
    for (const k of ['closet', 'pets', 'stylist']) { await go(p, k); for (const y of [0, 500]) { await p.evaluate((y) => window.scrollTo(0, y), y); await p.waitForTimeout(500); const u = await under(p); console.log('     ' + W + ' ' + k + ' scrolled ' + y + ': card ' + JSON.stringify(u)); await p.screenshot({ path: OUT + '/r160_' + W + '_' + k + '_' + y + '.png' }); } }
    await p.context().close(); }
  /* the Vault's room on its day */
  for (const W of [390, 320]) { const p = await open(W, '2026-12-09T10:00:00'); await go(p, 'vault'); const hub = await p.evaluate(() => window.__qbV149.hub()); const h = await head(p); console.log('     ' + W + ' Vault room (hub ' + hub + '): ' + JSON.stringify(h)); await p.screenshot({ path: OUT + '/r160_' + W + '_vault.png' });
    ok(hub === 'vault' && !h.overlap && !h.clipped && h.sw <= h.vw, W + ': the Vault\'s room header fits'); await p.context().close(); }
  /* desktop */
  { const p = await open(1100, null, 900); await go(p, 'street'); await p.evaluate(() => { const e = document.querySelector('.qshop [data-act="stab"]'); if (e) e.click(); }); await p.waitForTimeout(800); await clr(p); const h = await head(p); const u = await under(p); console.log('     1100: ' + JSON.stringify(h) + ' card ' + JSON.stringify(u)); await p.screenshot({ path: OUT + '/r160_1100.png' }); ok(h.sw <= h.vw && !h.overlap, '1100: the header fits'); await p.context().close(); }
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
