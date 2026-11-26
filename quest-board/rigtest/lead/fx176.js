// Cal 11-25 (29zz_v176.js, 29zz_v177.js): the Keeper's Ring and the Silent Storm on the player card; every banner's 8 second loop.
// Checks: each prize draws its own layers (ring: a silhouette mask and three moving layers; storm: bolts and a rim), they stop under reduced
// motion; every banner on the big card has its loop layer, every animation in it is exactly 8 s long (so the cycle has no seam); the
// Shop's small-banner grid has none. With REC=<dir> it also records an 11 s clip of each.
//   PORT=<build server> NODE_PATH=<playwright's parent> [REC=<dir>] node rigtest/lead/fx176.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8838, REC = process.env.REC; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const errs = [];
  const open = async (fx, bg, rm) => { const ctx = await b.newContext(Object.assign({ viewport: { width: 390, height: 560 }, deviceScaleFactor: 2, reducedMotion: rm ? 'reduce' : 'no-preference' }, REC && !rm ? { recordVideo: { dir: REC, size: { width: 390, height: 560 } } } : {})); const p = await ctx.newPage(); p.on('pageerror', (e) => errs.push(e.message.slice(0, 200)));
    await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV177 && window.__qbV176, null, { timeout: 90000 }); await p.waitForTimeout(400);
    await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' });
    await p.evaluate(([fx, bg]) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(25); S.gates = [5, 10, 15, 20]; S.tutDone = 1; S.v67ref = 1; S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1 };
      S.owned = Object.assign(S.owned || {}, { px_halo: true, px_ring: true, px_storm: true }); S.chfx = fx || null; S.pc = { bg, own: {} }; S.pc.own[bg] = 1; x.render(); }, [fx, bg]);
    await p.waitForTimeout(700); await p.evaluate(() => document.querySelectorAll('#layer .modal').forEach((m) => m.remove()));
    await p.evaluate(() => document.querySelector('.strip .avbtn').click()); await p.waitForTimeout(1800); await p.evaluate(() => { const v = document.querySelector('#layer .v61ban'); if (v) v.click(); }); await p.waitForTimeout(2500); return { ctx, p }; };
  const look = (p) => p.evaluate(() => { const c = document.querySelector('#layer .pcm .pcard'); if (!c) return null; const an = c.getAnimations({ subtree: true }).map((a) => a.effect && a.effect.getTiming().duration);
    const fxAn = [...c.querySelectorAll('.v77fx *')].flatMap((e) => e.getAnimations()).map((a) => a.effect.getTiming().duration);
    return { loop: !!c.querySelector('.v77fx .v77'), fxAn: [...new Set(fxAn)], mask: [...c.querySelectorAll('.v76ring i')].filter((i) => /url\(/.test(i.style.maskImage || i.style.webkitMaskImage || '')).length, ringAn: [...c.querySelectorAll('.v76ring i')].flatMap((e) => e.getAnimations()).map((a) => a.effect.getTiming().duration),
      bolts: c.querySelectorAll('.v76storm .v76bolt').length, boltAn: [...new Set([...c.querySelectorAll('.v76bolt')].flatMap((e) => e.getAnimations()).map((a) => a.effect.getTiming().duration))], halo: !!c.querySelector('.v74halo') }; });
  for (const [fx, bg] of [['px_ring', 'moon'], ['px_storm', 'glass_midnight'], ['px_halo', 'ink_peaks'], ['', 'ink_snow'], ['', 'hoard_ink'], ['', 'maple'], ['', 'fire']]) {
    const { ctx, p } = await open(fx, bg); const r = await look(p);
    if (fx === 'px_ring') ok(r && r.mask === 3 && r.ringAn.length === 3 && r.ringAn.every((d) => d === 8000), 'Keeper\'s Ring: three layers seen through the figure\'s silhouette, each an 8 s loop ' + JSON.stringify(r && { mask: r.mask, ringAn: r.ringAn }));
    if (fx === 'px_storm') ok(r && r.bolts === 9 && r.boltAn.length === 1 && r.boltAn[0] === 8000, 'Silent Storm: nine bolts, all on one 8 s cycle ' + JSON.stringify(r && { bolts: r.bolts, an: r.boltAn }));
    if (fx === 'px_halo') ok(r && r.halo, 'the Timekeeper\'s Halo still draws');
    ok(r && r.loop && r.fxAn.length && r.fxAn.every((d) => d === 8000), bg + ': the banner\'s loop layer is there and every motion in it lasts exactly 8 s ' + JSON.stringify(r && r.fxAn));
    if (REC) await p.waitForTimeout(11000); const v = REC ? p.video() : null; await ctx.close(); if (v) require('fs').renameSync(await v.path(), REC + '/clip_' + (fx || bg) + '.webm'); }
  const { ctx, p } = await open('px_ring', 'moon', true); const rm = await p.evaluate(() => { const c = document.querySelector('#layer .pcm .pcard'); return { fx: c.querySelector('.v77fx') ? getComputedStyle(c.querySelector('.v77fx')).display : 'none', ring: [...c.querySelectorAll('.v76ring i')].flatMap((e) => e.getAnimations()).length }; });
  ok(rm.fx === 'none' && rm.ring === 0, 'reduced motion: no banner loop, the aura holds still ' + JSON.stringify(rm)); await ctx.close();
  const { ctx: c2, p: p2 } = await open('', 'moon'); const grid = await p2.evaluate(async () => { document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); document.querySelector('.nav button[data-v="shop"]') && document.querySelector('.nav button[data-v="shop"]').click(); return 0; });
  await c2.close();
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
