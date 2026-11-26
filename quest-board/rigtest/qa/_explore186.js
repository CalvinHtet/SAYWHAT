const pw = require('playwright'), fs = require('fs');
const BASE = 'http://127.0.0.1:8824/dist-web/index.html', OUT = process.env.OUT;
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 }); await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 200)));
  await p.goto(BASE); await p.waitForFunction(() => document.querySelector('[data-act="ccnext"]'), null, { timeout: 180000 });
  await p.fill('#ccname', 'Speedy'); await p.click('[data-act="ccnext"]'); await p.waitForFunction(() => document.querySelector('[data-act="ccdone"]'), null, { timeout: 120000 }); await p.waitForTimeout(800); await p.click('[data-act="ccdone"]');
  await p.waitForFunction(() => document.querySelector('.strip .avbtn'), null, { timeout: 120000 }); await p.waitForTimeout(4000);
  const T = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1 };
  await p.evaluate((T) => { const x = window.__qb.x(), S = x.S; S.xp = x.cum(30) + 10; S.gates = S.gates || []; let g, n = 0; while ((g = x.gated()) !== null && n++ < 20) S.gates.push(g); S.tutDone = 1; S.coins = 500000; S.tours = T; S.v67ref = 1; delete S.areaOn; try { window.__qbRooms.open('closet', 1); } catch (e) {} x.persist(); x.render(); }, T);
  await p.waitForTimeout(1500); await p.evaluate(() => document.querySelectorAll('#layer > *,.bsplash,.dropsplash,#qbtour,.tour-ring,.tour-bub').forEach((m) => m.remove()));
  const dump = () => p.evaluate(() => ({ nav: [...document.querySelectorAll('.nav button')].map((b) => (b.dataset.v || '') + ':' + b.innerText.trim().replace(/\s+/g, ' ')), acts: [...new Set([...document.querySelectorAll('body [data-act]')].map((e) => e.dataset.act + (e.dataset.v ? '=' + e.dataset.v : '') + (e.dataset.id ? '#' + e.dataset.id.slice(0, 14) : '')))].slice(0, 70), text: (document.querySelector('main') || document.body).innerText.replace(/\s+/g, ' ').slice(0, 300) }));
  await p.reload(); await p.waitForFunction(() => window.__qb && document.querySelector('.strip .avbtn'), null, { timeout: 120000 }); await p.waitForTimeout(4000); await p.evaluate(() => document.querySelectorAll('#layer > *,.bsplash,.dropsplash,#qbtour,.tour-ring,.tour-bub').forEach((m) => m.remove()));
  const out = { home: await dump() };
  for (const v of out.home.nav.map((s) => s.split(':')[0]).filter(Boolean)) { await p.evaluate((v) => { document.querySelectorAll('#layer > *').forEach((m) => m.remove()); const n = document.querySelector('.nav button[data-v="' + v + '"]'); if (n) n.click(); }, v); await p.waitForTimeout(2500); await p.evaluate(() => document.querySelectorAll('#layer > *,.bsplash,.dropsplash').forEach((m) => m.remove())); out[v] = await dump(); await p.screenshot({ path: OUT + '/ex_' + v + '.png' }); }
  out.hooks = await p.evaluate(() => Object.keys(window).filter((k) => /^(__qb|QB)/.test(k)));
  fs.writeFileSync(OUT + '/explore.json', JSON.stringify(out, null, 1)); console.log(JSON.stringify(out, null, 0).slice(0, 6000)); console.log('errs', JSON.stringify(errs.slice(0, 3)));
  await ctx.storageState({ path: OUT + '/state.json' }); await b.close(); })();
