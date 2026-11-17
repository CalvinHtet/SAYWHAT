// v1.04 (LEAD c7051f3), the parts leanqa.js does not cover: a real finger tap on each (i) scrolled into view (the sheet opens, nothing
// under it reacts, Got it closes it), the Daily Quest card with XP today, the Wheel with a spin ready and on its cooldown, the Hall
// banner, and NICE COCK: its Shop rows (cut or on sale), what the Boutique rack shows, and an owner keeping a cut piece.
//   BASE=<server of quest-board/> OUT=<dir> NODE_PATH=<playwright's parent> node rigtest/qa/leantap.js
const pw = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:8819', OUT = process.env.OUT || '';
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }); const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft, null, { timeout: 120000 }); await p.waitForTimeout(800);
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' });
    S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, loft: 1, town: 1, shop: 1, players: 1, hall: 1, wheel: 1, away: 1 }; S.calm = false; S.welcomed = 1;
    S.areaOn = { board: 1, train: 1, hideout: 1, shop: 1, hall: 1, players: 1, trophy: 1, wheel: 1, away: 1 }; S.xp = x.cum(12); S.trialN = 1; S.wheelAt = 0; x.render(); });
  await p.waitForTimeout(1000);
  const clear = () => p.evaluate(() => document.querySelectorAll('#layer .modal,.dropsplash,.bsplash,.coachscr,#qbtour').forEach((m) => m.remove()));
  const nav = (v) => p.evaluate((v) => { let el = document.querySelector('.nav button[data-v="' + v + '"]');
    if (!el) { const bt = document.querySelector('.nav button[data-v="board"]'); if (bt) bt.click(); el = document.querySelector('[data-act="nav"][data-v="' + v + '"],.zx-tile[data-v="' + v + '"]'); } if (el) el.click(); return !!el; }, v);
  const tapAll = async (where) => { const keys = await p.evaluate(() => [...document.querySelectorAll('.qbi')].map((q) => q.dataset.k));
    for (const k of keys) { await clear(); const view0 = await p.evaluate(() => document.body.className + '|' + (document.querySelector('main') || document.body).innerText.length);
      const box = await p.evaluate((k) => { const q = document.querySelector('.qbi[data-k="' + k + '"]'); q.scrollIntoView({ block: 'center' }); const r = q.getBoundingClientRect(); const t = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); return { x: r.x + r.width / 2, y: r.y + r.height / 2, top: t === q || q.contains(t), what: t ? t.tagName + '.' + t.className : 'none' }; }, k);
      await p.touchscreen.tap(box.x, box.y); await p.waitForTimeout(500);
      const m = await p.evaluate(() => { const m = document.querySelector('#layer .modal'); return m ? (m.querySelector('h2') || {}).textContent : null; });
      await p.evaluate(() => { const g = [...document.querySelectorAll('#layer .modal button')].find((e) => /Got it/i.test(e.textContent)); if (g) g.click(); }); await p.waitForTimeout(400);
      const after = await p.evaluate(() => ({ open: !!document.querySelector('#layer .modal'), v: document.body.className + '|' + (document.querySelector('main') || document.body).innerText.length }));
      console.log('  tap (i) ' + where + ' ' + k + ': ' + (box.top ? 'on top' : 'COVERED by ' + box.what) + ', sheet "' + m + '", Got it closes ' + !after.open + (after.v.split('|')[0] === view0.split('|')[0] ? '' : ', SCREEN CHANGED')); } };
  // the Board: the Daily Quest card with XP today, then every (i) there
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.dq = { d: S.dq ? S.dq.d : '', tx: 0 }; x.render(); }); await p.waitForTimeout(300);
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S; if (S.dq) S.dq.tx = 60; x.render(); }); await p.waitForTimeout(500); await clear();
  console.log('DQ card, 60 XP today: ' + await p.evaluate(() => { const c = document.querySelector('.card.dq'); return c ? c.innerText.replace(/\s+/g, ' ') : 'none'; }));
  if (OUT) await p.screenshot({ path: OUT + '/board_dq_60xp.png' });
  await tapAll('board');
  // from here a level-60 player (the trial passed), so the Wheel, Crawls and the Shop are open
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.gates = Array.from({ length: 200 }, (_, i) => i); S.xp = x.cum(60); S.coins = 999999; S.wheelAt = 0; x.render(); }); await p.waitForTimeout(600); await clear();
  // the Wheel, ready then on its cooldown
  console.log('wheel button on the Board: ' + await p.evaluate(() => !!document.querySelector('.zx-spin')) + ', opened ' + await nav('wheel')); await p.waitForTimeout(900); await clear();
  console.log('Wheel ready: ' + await p.evaluate(() => { const c = document.querySelector('#wheel'); const s = c && c.closest('section'); return s ? s.innerText.replace(/\s+/g, ' ').slice(0, 200) : 'none'; }));
  await tapAll('wheel');
  await p.evaluate(() => { const x = window.__qb.x(); x.S.wheelAt = Date.now() - 3600e3; x.render(); }); await p.waitForTimeout(500);
  console.log('Wheel after a spin 1 h ago: ' + await p.evaluate(() => { const c = document.querySelector('#wheel'); const s = c && c.closest('section'); return s ? s.innerText.replace(/\s+/g, ' ').slice(0, 200) : 'none'; }));
  if (OUT) await p.screenshot({ path: OUT + '/wheel_cooldown.png' });
  for (const v of ['train', 'away', 'players']) { await clear(); await nav('board'); await p.waitForTimeout(500); await nav(v); await p.waitForTimeout(1000); await tapAll(v); }
  await clear(); await nav('hall'); await p.waitForTimeout(1200); await clear();
  console.log('Hall banner: ' + await p.evaluate(() => { const c = document.querySelector('.tw-hall'); return c ? JSON.stringify(c.innerText.replace(/\s+/g, ' ')) + ' ' + Math.round(c.getBoundingClientRect().height) + ' px' : 'none'; }));
  if (OUT) await p.screenshot({ path: OUT + '/hall.png' });
  // NICE COCK
  const nc = await p.evaluate(() => { const x = window.__qb.x(), S = x.S; const rows = x.SHOP.filter((q) => q[6] && q[6].b === 'nc');
    return { rows: rows.map((q) => q[0] + (q[6].cut ? ' CUT' : '') + ' ' + q[2]), fitsNow: rows.filter((q) => itemFitsProbe(q)).length }; function itemFitsProbe() { return true; } });
  console.log('NICE COCK rows: ' + nc.rows.length + '\n    ' + nc.rows.join('\n    '));
  await clear(); await nav('shop'); await p.waitForTimeout(1200); await clear();
  const tabs = await p.evaluate(() => [...document.querySelectorAll('.qs-floors .qs-tab,[data-qsfl]')].map((t) => t.dataset.qsfl + ':' + t.textContent.trim()).concat(['|'], [...document.querySelectorAll('.qs-tabs:not(.qs-floors) .qs-tab')].map((t) => t.dataset.v + ':' + t.textContent.trim())));
  console.log('Shop floors | tabs: ' + tabs.join(' '));
  for (const fl of await p.evaluate(() => [...document.querySelectorAll('[data-qsfl]')].map((t) => t.dataset.qsfl))) {
    await p.evaluate((fl) => document.querySelector('[data-qsfl="' + fl + '"]').click(), fl); await p.waitForTimeout(700); await clear();
    const t = await p.evaluate(() => { const nc = document.querySelector('.qs-tab[data-v="nc"]'); if (nc) nc.click(); return !!nc; }); await p.waitForTimeout(700); await clear();
    if (!t) { console.log('  floor ' + fl + ': no NICE COCK tab'); continue; }
    const rack = await p.evaluate(() => [...document.querySelectorAll('.qs-rack [data-id],.qs-rack .qs-card,.qs-rack .qcard')].map((e) => (e.dataset.id || '') + ' ' + ((e.querySelector('b,h4,.qs-name') || {}).textContent || '').trim()).filter((s) => s.trim()));
    console.log('  floor ' + fl + ': NICE COCK rack ' + rack.length + ' cards: ' + rack.join(', '));
    if (OUT) await p.screenshot({ path: OUT + '/nc_' + fl + '.png', fullPage: true }); }
  const own = await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.owned = S.owned || {}; S.owned.gx_nc_hoodie = true; x.render(); const q = x.SHOP.find((r) => r[0] === 'gx_nc_hoodie'); return q ? 'cut ' + !!q[6].cut : 'no row'; });
  await clear(); await p.evaluate(() => { const t = document.querySelector('[data-act=stab][data-v=wardrobe]'); if (t) t.click(); }); await p.waitForTimeout(900); await clear();
  console.log('owner of gx_nc_hoodie (' + own + '): in the Wardrobe ' + await p.evaluate(() => !!document.querySelector('.qs-rack [data-id="gx_nc_hoodie"]') || /hoodie/i.test((document.querySelector('.qs-rack') || {}).innerText || '')));
  console.log('errors ' + errs.length + ' ' + JSON.stringify(errs.slice(0, 3))); await b.close(); })().catch((e) => { console.log('crash', e.message); process.exit(2); });
