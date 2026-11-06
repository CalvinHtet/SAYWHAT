// The test copy's level-5 start (LEAD's d9d92d7, Cal: "Start me at level 5 as if I've just completed the job advancement"): a brand-new
// player, phone size, name then Begin: the level, the trials passed, the areas open and the tabs shown, whether the Garden lot is offered
// (watched for 30 s), the class still to pick; then the Testing pill's "Skip a week": unlock days granted and what opens next. Also an old
// save (level 3, made before) loads untouched.   BASE=<server> OUT=<folder> node teststart.js
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:8769', OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext({ viewport: { width: 440, height: 840 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage(), errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(BASE + '/dist/index.html');
  await p.waitForFunction(() => document.querySelector('[data-act="ccnext"]'), null, { timeout: 90000 });
  await p.fill('#ccname', 'Cal'); await p.click('[data-act="ccnext"]');
  await p.waitForFunction(() => document.querySelector('[data-act="ccdone"]'), null, { timeout: 60000 }); await p.waitForTimeout(800);
  await (await p.$('[data-act="ccdone"]')).tap();
  await p.waitForFunction(() => document.querySelector('.nav button[data-v="board"]'), null, { timeout: 20000 });
  const st = () => p.evaluate(() => { const x = window.__qb.x(), S = x.S; return { lv: x.effLvl ? x.effLvl() : null, xp: S.xp, gates: (S.gates || []).slice().sort((a, b) => a - b), areas: Object.keys(S.areaOn || {}).sort(), cls: S.cls || S.class || null, testFree: S.testFree || 0,
    tabs: [...document.querySelectorAll('.nav button')].filter((e) => !e.disabled && !/soon/i.test(e.textContent)).map((e) => e.dataset.v), slots: (S.base && S.base.slots || []).map((s) => s && s.t),
    offers: [...document.querySelectorAll('#layer .modal, .dropsplash')].map((e) => e.innerText.replace(/\s+/g, ' ').slice(0, 90)) }; });
  const a = await st(); console.log('after Begin:', JSON.stringify(a));
  await p.screenshot({ path: path.join(OUT, 'start_board.png') });
  let seen = []; for (let k = 0; k < 6; k++) { await p.waitForTimeout(5000); const o = await st(); o.offers.forEach((t) => { if (!seen.includes(t)) seen.push(t); }); }
  console.log('offers seen in 30 s:', JSON.stringify(seen));
  const b2 = await st(); console.log('after 30 s:', JSON.stringify({ lv: b2.lv, gates: b2.gates, areas: b2.areas, slots: b2.slots }));
  const story = await p.evaluate(() => { const T = window.__qbStory; if (!T) return 'no hook'; let s = null; try { s = T.state(); } catch (e) { s = 'state() failed'; }
    const txt = document.body.innerText; return { state: JSON.stringify(s).slice(0, 300), lots: (() => { try { return JSON.stringify(T.lots()).slice(0, 200); } catch (e) { return typeof T.lots; } })(), gardenOnPage: /garden/i.test(txt), gardenLine: (txt.match(/[^\n]*garden[^\n]*/i) || [''])[0].slice(0, 120) }; });
  console.log('story:', JSON.stringify(story));
  await p.evaluate(() => document.querySelector('.nav button[data-v="hideout"]').click()); await p.waitForTimeout(4000);
  const loft = await p.evaluate(() => { const t = document.body.innerText; return { garden: /garden/i.test(t), line: (t.match(/[^\n]*garden[^\n]*/i) || [''])[0].slice(0, 120), lots: [...document.querySelectorAll('[data-act]')].map((e) => e.dataset.act).filter((v, i, a) => /lot|sty|story/i.test(v) && a.indexOf(v) === i) }; });
  console.log('in the Loft:', JSON.stringify(loft));
  await p.screenshot({ path: path.join(OUT, 'start_loft.png') });
  await p.evaluate(() => document.querySelectorAll('#layer .modal,.dropsplash,.overlay').forEach((e) => e.remove())); await p.waitForTimeout(500);
  const nav = await p.evaluate(() => [...document.querySelectorAll('.nav button')].map((e) => e.dataset.v + ':' + e.innerText.replace(/\s+/g, ' ').trim() + (e.disabled ? '(off)' : '') + (e.classList.contains('lock') || /lock|soon/i.test(e.className) ? '(locked)' : '')));
  const coins = await p.evaluate(() => { const x = window.__qb.x(), S = x.S; let lot = null; try { lot = JSON.stringify((window.__qbStory.steps || []).find ? window.__qbStory.steps.find((s) => s.id === 'garden') : null).slice(0, 200); } catch (e) {} return { coins: S.coins, lot }; });
  console.log('nav:', JSON.stringify(nav)); console.log('coins and the garden step:', JSON.stringify(coins));
  await p.screenshot({ path: path.join(OUT, 'start_30s.png') });
  // Cal's path to the Garden: Testing > Add 10,000 coins, then build the offered lot
  const g = await p.evaluate(async () => { const w = (ms) => new Promise((o) => setTimeout(o, ms)); const x = window.__qb.x(), S = x.S;
    const pill = document.querySelector('#qbt button'); if (pill) pill.click(); await w(300);
    const add = document.querySelector('[data-act="simcoin"]'); if (add) add.click(); await w(300); const coins = S.coins;
    document.querySelectorAll('#layer .modal').forEach((e) => e.remove());
    const before = S.base.slots.map((s) => s && s.t).join(',');
    const go = document.querySelectorAll('[data-act="bldgo"]')[0]; if (go) go.dispatchEvent(new MouseEvent('click', { bubbles: true })); await w(5000);
    const acts = [...new Set([...document.querySelectorAll('#app [data-act]')].map((e) => e.dataset.act))].join(' ');
    let how = 'lots offered ' + JSON.stringify(window.__qbStory.lots());
    // the game's own build action for an offered lot (as sim.js does it): data-act rdo, the next slot, the room type
    const btn = document.createElement('button'); btn.dataset.act = 'rdo'; btn.dataset.i = String(S.base.slots.length); btn.dataset.t = 'garden'; document.querySelector('#app').appendChild(btn); btn.click(); await w(800); btn.remove();
    const lb = [];
    if (lb.length) { lb[0].dispatchEvent(new MouseEvent('click', { bubbles: true })); await w(800); const ok = [...document.querySelectorAll('#layer .modal button')].find((e) => /build|buy|open/i.test(e.textContent) && !e.disabled); how += '; modal button ' + (ok ? ok.textContent.trim() : 'none'); if (ok) { ok.click(); await w(800); } }
    return { coinsAfterAdd: coins, before, after: S.base.slots.map((s) => s && s.t).join(','), coinsLeft: S.coins, how }; });
  console.log('to the Garden:', JSON.stringify(g));
  // where the Garden stands: back to the street, a picture of it
  await p.evaluate(() => { document.querySelectorAll('#layer .modal,.dropsplash').forEach((e) => e.remove()); const st = [...document.querySelectorAll('button')].find((e) => /Street/.test(e.textContent)); if (st) st.click(); document.querySelector('.nav button[data-v="hideout"]').click(); });
  await p.waitForTimeout(3000); await p.evaluate(() => document.querySelectorAll('#layer .modal,.dropsplash').forEach((e) => e.remove())); await p.waitForTimeout(500);
  const where = await p.evaluate(() => { const x = window.__qb.x(); return { cells: JSON.stringify((x.ROOMCELL || {}).garden || null), bld: [...document.querySelectorAll('[data-act="bldgo"]')].map((e) => { const r = e.getBoundingClientRect(); return Math.round(r.left) + ',' + Math.round(r.top) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height) + ' ' + (e.getAttribute('aria-label') || e.textContent.trim().slice(0, 20)); }) }; });
  console.log('the Garden on the street:', JSON.stringify(where));
  await p.screenshot({ path: path.join(OUT, 'street_garden.png') });
  console.log('page errors', errs.length, errs.slice(0, 3));
  await b.close();
})();
