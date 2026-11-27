// Cal 11-26 (29zz_v185.js): the header's character shows at once at launch (the last drawn picture, kept on the phone), then the live one.
//   PORT=<build server> NODE_PATH=<playwright's parent> node rigtest/lead/hdr185.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8838; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const errs = [];
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 }); const p = await ctx.newPage(); p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV185, null, { timeout: 90000 });
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'C', sex: 'm' }); S.xp = x.cum(8); S.tutDone = 1; S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1, away: 1, banner: 1 }; S.unl = Object.assign({ console: 1, pets: 1, acc2: 1, sable7: 1 }, S.unl || {}); window.__qbV185.clear(); x.persist(); x.render(); });
  for (let i = 0; i < 40; i++) { if (await p.evaluate(() => !!window.__qbV185.get())) break; await p.waitForTimeout(500); }
  const kept = await p.evaluate(() => { const c = window.__qbV185.get(); return c ? { k: !!c.k, len: c.d.length, webp: /^data:image\/webp/.test(c.d) } : null; });
  ok(kept && kept.k && kept.len > 1000 && kept.len < 400000, 'the header\'s drawn picture is kept on the phone ' + JSON.stringify(kept));
  /* a fresh launch with the same save: the header has the kept picture before the rig draws */
  await p.reload(); const t0 = Date.now(); let first = null;
  for (let i = 0; i < 60 && !first; i++) { first = await p.evaluate(() => { const im = document.querySelector('.strip .avbtn img.calp'); return im ? { kept: im.getAttribute('data-v85') === '1', live: !!im.dataset.hy, src: (im.currentSrc || im.src).slice(0, 15) } : null; }); if (!first) await p.waitForTimeout(50); }
  const tFirst = Date.now() - t0;
  ok(first && first.kept && /^data:image/.test(first.src), 'on the next launch the header shows it as soon as the header exists (' + tFirst + ' ms after reload) ' + JSON.stringify(first));
  await p.waitForTimeout(5000);
  const live = await p.evaluate(() => { const im = document.querySelector('.strip .avbtn img.calp'); return im ? { hy: !!im.dataset.hy, src: (im.currentSrc || im.src).slice(0, 5) } : null; });
  ok(live && live.hy && live.src === 'blob:', 'then the live figure takes over ' + JSON.stringify(live));
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
