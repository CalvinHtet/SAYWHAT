// New-thing alerts (LEAD's 3bba5f1; Cal: "make sure it's obvious by adding an exclamation point on that tab, also allow the + icon for
// the room in the building view"): a fresh player walks the real path at phone size. (1) An old save with everything open shows no "!" at
// all. (2) The Garden lot opens (level 14, ROOMT.garden.lv; none before): "!" on The Loft tab and over the street lot; opening The Loft clears the tab's "!". (3) With the Garden
// built and Mara's step open, the Restaurant opener: "!" over the building on the street, "+" inside on its spot, tapping "+" opens the
// Garden window with "Knock Through to a Restaurant" first; building it removes the "+". (4) Tabs that unlock as the level rises get a
// "!" until opened. (5) A brand not yet seen gets a "!" on the Shop until it is opened. Reloads between steps keep what was seen.
//   BASE=<server> OUT=<folder> node alerts.js
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:8769', OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
const fails = []; const ok = (n, c, g) => { console.log((c ? '  ok   ' : '  FAIL ') + n + (g !== undefined ? '  ' + JSON.stringify(g).slice(0, 260) : '')); if (!c) fails.push(n); };
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }); const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  const ready = async () => { await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && window.__qbAlerts, null, { timeout: 90000 }); await p.waitForTimeout(1500); };
  const bangs = () => p.evaluate(() => [...document.querySelectorAll('.nav button[data-v] .nbang')].map((e) => e.closest('button').dataset.v));
  const tab = async (v) => { await p.evaluate((v) => { document.querySelectorAll('#layer .modal,.dropsplash').forEach((e) => e.remove()); const bt = document.querySelector('.nav button[data-v="' + v + '"]'); if (bt) bt.click(); }, v); await p.waitForTimeout(2500); };
  const svg = (sel) => p.evaluate((sel) => document.querySelectorAll(sel).length, sel);
  // (1) an old save with everything open
  await p.goto(BASE + '/dist/index.html'); await ready();
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Old', sex: 'm' }); S.xp = x.cum(45); S.gates = [5, 10, 20, 30, 40]; delete S.alSeen; x.persist(); }); await p.reload(); await ready(); await tab('board');
  ok('an old save lights no tab at first', (await bangs()).length === 0, await bangs());
  await p.evaluate(() => { localStorage.clear(); }); await ctx.clearCookies();
  // (2) fresh player at level 5: the Garden lot
  await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => document.querySelector('[data-act="ccnext"]'), null, { timeout: 90000 });
  await p.fill('#ccname', 'Cal'); await p.click('[data-act="ccnext"]'); await p.waitForFunction(() => document.querySelector('[data-act="ccdone"]'), null, { timeout: 60000 }); await p.waitForTimeout(600);
  await p.evaluate(() => document.querySelector('[data-act="ccdone"]').click()); await p.waitForTimeout(6000); await tab('board');
  ok('a new player (who starts at level 5) has the Garden lot offered at once', await p.evaluate(() => window.__qb.x().effLvl() >= 5 && window.__qbAlerts.rooms().some((x) => x.room === 'garden')), await p.evaluate(() => window.__qb.x().effLvl()));
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.xp = x.cum(4); x.persist(); x.render(); }); await tab('board');
  ok('at level 4 no Garden "!" yet (the lot shows its padlock)', !(await p.evaluate(() => window.__qbAlerts.rooms().some((x) => x.room === 'garden'))));
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.xp = x.cum(5); S.gates = [5]; x.persist(); x.render(); }); await tab('board');
  const r2 = await p.evaluate(() => ({ lvl: window.__qb.x().effLvl(), rooms: window.__qbAlerts.rooms().map((x) => x.room + (x.lot ? '(lot)' : '')), offer: window.__qbStory.state().offer }));
  ok('at level 5 the Garden lot is among the new rooms', r2.rooms.some((x) => /garden/.test(x)), r2);
  ok('...and The Loft shows a "!"', (await bangs()).includes('hideout'), { bangs: await bangs(), tabs: await p.evaluate(() => window.__qbAlerts.tabs()), seen: await p.evaluate(() => window.__qbAlerts.seen().room), nav: await p.evaluate(() => (document.querySelector('.nav button[data-v="hideout"]') || {}).className) });
  await tab('hideout'); await p.screenshot({ path: path.join(OUT, 'al_street_garden.png') });
  ok('the street shows a "!" for the lot', (await svg('#lfw .albang')) >= 1, await svg('#lfw .albang'));
  await tab('board'); ok('opening The Loft cleared its "!"', !(await bangs()).includes('hideout'), await bangs());
  await p.reload(); await ready(); await tab('board'); ok('...and it stays cleared after a reload', !(await bangs()).includes('hideout'), await bangs());
  // (3) build the Garden, open Mara's step, the Restaurant opener
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.coins += 50000; window.__qbRooms.open('garden', 1); const o = window.__qbStory.state(); o.sold = 50; o.done = o.done || {}; o.offer = o.offer || {}; o.offer.chef = 1; o.done.garden = 1; S.xp = Math.max(S.xp, x.cum(12)); x.persist(); try { window.__qbStory.check && window.__qbStory.check(); } catch (e) {} x.render(); });
  await p.waitForTimeout(1500);
  const op = await p.evaluate(() => window.__qbAlerts.openers().map((x) => x.room + ':' + x.id));
  console.log('  openers now:', JSON.stringify(op));
  await tab('board'); ok('the Restaurant opener puts a "!" on The Loft', (await bangs()).includes('hideout'), { bangs: await bangs(), op });
  await tab('hideout'); await p.screenshot({ path: path.join(OUT, 'al_street_rest.png') });
  ok('a "!" over the building on the street', (await svg('#lfw .albang')) >= 1, await svg('#lfw .albang'));
  const bi = await p.evaluate(() => { const r = window.__qbAlerts.openers()[0]; return r ? ROOMCELL[r.room][0] : null; }).catch(() => null);
  await p.evaluate(() => { const all = document.querySelectorAll('[data-act="bldgo"]'); (all[1] || all[0]).dispatchEvent(new MouseEvent('click', { bubbles: true })); }); await p.waitForTimeout(5000);
  await p.screenshot({ path: path.join(OUT, 'al_inside.png') });
  const plus = await svg('#lfw .alplus'); ok('inside the building, a "+" on the new room\'s spot', plus >= 1, plus);
  const at = await p.evaluate(() => { const g = document.querySelector('#lfw .alplus .lfplus'); if (!g) return null; const r = g.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
  if (at) { await p.touchscreen.tap(at[0], at[1]); await p.waitForTimeout(2000); }
  const first = await p.evaluate(() => { const m = document.querySelector('.rmodal'); if (!m) return { win: null }; const c = m.querySelector('[data-act="raddon"]'); const card = c && (c.closest('.addon, .rup, li, .row') || c.parentElement);
    return { win: (m.querySelector('h2, h3, .rm-title') || {}).innerText, first: card ? card.innerText.replace(/\s+/g, ' ').slice(0, 80) : null }; });
  await p.screenshot({ path: path.join(OUT, 'al_window.png') });
  ok('tapping "+" opens the room that sells it, with the opener first', first && /knock|restaurant/i.test(String(first.first)), first);
  await p.evaluate(() => { document.querySelectorAll('#layer .modal').forEach((e) => e.remove()); window.__qbRooms.open('restaurant', 1); window.__qb.x().render(); }); await p.waitForTimeout(2500);
  ok('building the room removes its "+"', (await svg('#lfw .alplus')) === 0, await svg('#lfw .alplus'));
  // (4) tabs that unlock get a "!" until opened: by level (Hall, Wheel, Relics) and by a room (Shop needs the Closet, Dungeons the Lair)
  const locked = () => p.evaluate(() => [...document.querySelectorAll('.nav button[data-v].lk')].map((e) => e.dataset.v));
  const lk0 = await locked(), before4 = await bangs();
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.xp = x.cum(45); S.gates = [5, 10, 20, 30, 40]; S.areaOn = null; x.persist(); x.render(); }); await tab('board');
  const lk1 = await locked(), after4 = await bangs(); const byLvl = lk0.filter((v) => !lk1.includes(v) && !['shop', 'away'].includes(v));
  ok(`tabs unlocked by level (${byLvl.join(',')}) show a "!"`, byLvl.length > 0 && byLvl.every((v) => after4.includes(v)), { lk0, lk1, before4, after4 });
  await p.evaluate(() => { window.__qbRooms.open('closet', 1); window.__qbRooms.open('lair', 1); window.__qb.x().render(); }); await tab('board');
  const after4b = await bangs(); ok('building the Closet and the Lair puts a "!" on Shop and Dungeons', after4b.includes('shop') && after4b.includes('away'), { locked: await locked(), bangs: after4b });
  await tab('away'); await tab('board'); ok('opening Dungeons clears its "!" (the Shop keeps its)', !(await bangs()).includes('away') && (await bangs()).includes('shop'), await bangs());
  await p.reload(); await ready(); await tab('board'); ok('...and a reload keeps that', !(await bangs()).includes('away'), await bangs());
  // (5) a live brand not yet seen in the Shop
  await tab('shop'); await tab('board');
  const v5 = await p.evaluate(() => { const S = window.__qb.x().S; const live = (window.__qbDrops && window.__qbDrops.state().live) || []; if (!live.length) return null; S.alSeen.brand[live[0].id] = 0; window.__qb.x().render(); return live[0].id; });
  await tab('board'); ok(`a brand not yet seen (${v5}) puts a "!" on the Shop`, (await bangs()).includes('shop'), await bangs());
  await tab('shop'); await tab('board'); ok('opening the Shop clears it', !(await bangs()).includes('shop'), await bangs());
  ok('no page errors', errs.length === 0, errs.slice(0, 3));
  console.log(fails.length ? 'FAILED ' + fails.length : 'PASS'); await b.close();
})();
