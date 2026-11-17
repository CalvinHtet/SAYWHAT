// NICE COCK owners after the repaint (LEAD f16dbc2 on ROOMS bcd8f73): a player who bought the 10 pieces under their old art (same ids)
// and wears 4 of them. Reads the NICE COCK rack, the wardrobe, what the avatar wears (and the cap's hair clip), and the same after a reload.
// OWN unset: a non-owner (the rack only).
//   BASE=<server of quest-board/> OUT=<folder> OWN=1 NODE_PATH=<playwright's parent> node rigtest/qa/ncowner.js
const pw = require('playwright');
const K = ['band', 'pendant', 'shades', 'hoodie', 'tee', 'tank', 'qzip', 'court', 'knit', 'slide'];
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] });
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  const ready = () => p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft, null, { timeout: 120000 });
  const clear = () => p.evaluate(() => document.querySelectorAll('#layer .modal,.dropsplash,.bsplash,.coachscr,#qbtour').forEach((m) => m.remove()));
  const worn = () => p.evaluate(() => { const e = window.__qb.lookOf().rig.equipped || {}; return Object.keys(e).map((s) => s + ':' + e[s].art + (e[s].clip ? '(clip)' : '')).join(' '); });
  await p.goto(process.env.BASE + '/dist/index.html'); await ready(); await p.waitForTimeout(800);
  await p.evaluate(([own, K]) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, loft: 1, town: 1, shop: 1, players: 1, hall: 1 }; S.calm = false; S.welcomed = 1;
    S.areaOn = { board: 1, train: 1, hideout: 1, shop: 1, hall: 1, players: 1, trophy: 1, wheel: 1, away: 1 }; S.gates = Array.from({ length: 200 }, (_, i) => i); S.xp = x.cum(60); S.coins = 999999; S.owned = S.owned || {};
    if (own) { K.forEach((k) => { S.owned['gx_nc_' + k] = true; }); S.owned.gx_nc_jog_slate = true; S.eq = { a_hat: 'gx_nc_band', a_top: 'gx_nc_tee', a_shoes: 'gx_nc_slide', a_acc: 'gx_nc_pendant', a_pants: 'gx_nc_jog_slate' }; }
    S.base.slots = ['bedroom', 'closet', 'lair', 'patio'].map((t) => ({ t, a: Object.fromEntries((x.ADDONS[t] || []).map((u) => [u[0], 1])), st: 0, pend: 0 })); x.render(); x.persist && x.persist(); }, [!!process.env.OWN, K]);
  await p.waitForTimeout(800); await clear();
  if (process.env.OWN) console.log('worn:', await worn());
  await p.evaluate(() => document.querySelector('.nav button[data-v=shop]').click()); await p.waitForTimeout(1500); await clear();
  await p.evaluate(() => { const f = document.querySelector('[data-qsfl="boutique"]'); if (f) f.click(); }); await p.waitForTimeout(800); await clear();
  const has = await p.evaluate(() => { const t = document.querySelector('[data-act=stab][data-v="nc"]'); if (t) t.click(); return !!t; }); await p.waitForTimeout(800); await clear();
  console.log('NICE COCK rack:', has ? await p.evaluate(() => { const r = document.querySelector('.qs-rack'); return r ? r.innerText.replace(/\s+/g, ' ').slice(0, 1400) : 'no rack'; }) : 'no nc tab');
  await p.screenshot({ path: process.env.OUT + '/nc_rack' + (process.env.OWN ? '_owner' : '') + '.png', fullPage: true });
  if (process.env.OWN) {
    await p.evaluate(() => { const t = document.querySelector('[data-act=stab][data-v=wardrobe]'); if (t) t.click(); }); await p.waitForTimeout(900); await clear();
    const w = await p.evaluate(() => { const r = document.querySelector('.qs-rack'); return r ? r.innerText.replace(/\s+/g, ' ') : 'no wardrobe'; });
    console.log('wardrobe new names:', ['Fleece Dad Cap', 'Cashmere Scarf', 'Rimless Aviators', 'Embossed Crest Hoodie', 'Layered Lounge Tee', 'Waffle Lounge Zip', 'Sherpa Fleece Zip', 'Silver Court High-Top', 'Suede Runner', 'Shearling Clogs & Socks'].map((n) => n + (w.indexOf(n) >= 0 ? ' yes' : ' NO')).join('; '));
    console.log('wardrobe old names left:', ['Sweatband', 'Rooster Pendant', 'Sport Shades', 'Heavyweight Hoodie', 'Boxy Tee', 'Seamless Gym Tank', 'Performance Quarter-Zip', 'Court High-Top', 'Knit Trainer', 'Pool Slide'].filter((n) => new RegExp('(^|[^r] )' + n.replace(/[-&]/g, '.')).test(' ' + w)).join(', ') || 'none');
    await p.screenshot({ path: process.env.OUT + '/nc_wardrobe_owner.png', fullPage: true });
    await p.reload(); await ready(); await p.waitForTimeout(1500);
    console.log('after reload: eq', await p.evaluate(() => JSON.stringify(window.__qb.x().S.eq)), '| worn', await worn(), '| owned', await p.evaluate((K) => K.filter((k) => window.__qb.x().S.owned['gx_nc_' + k]).length, K));
  }
  console.log('errors', errs.length, JSON.stringify(errs.slice(0, 2))); await b.close(); })();
