// The Garden reveals nothing early (LEAD's ab7fcae; Cal: "Everything should unlock sequentially and never revealed outright",
// "Selling should happen once we have our first plot that is growing produce"): a brand-new test player (level 5), Add 10,000 coins,
// build the offered Garden lot, then at each step every word on screen is read: the build splash, the Garden window dry, after watering,
// and after the first produce (time moved on); the Board's story card. Fails on "Restaurant", a chef, or a sell row before the first
// produce; and wants the sell row and its pop once produce exists.   BASE=<server> OUT=<folder> node gardenreveal.js
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:8769', OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
const fails = []; const ok = (n, c, g) => { console.log((c ? '  ok   ' : '  FAIL ') + n + (g !== undefined ? '  ' + JSON.stringify(g).slice(0, 400) : '')); if (!c) fails.push(n); };
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext({ viewport: { width: 440, height: 840 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage(), errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(BASE + '/dist/index.html');
  await p.waitForFunction(() => document.querySelector('[data-act="ccnext"]'), null, { timeout: 90000 });
  await p.fill('#ccname', 'Cal'); await p.click('[data-act="ccnext"]');
  await p.waitForFunction(() => document.querySelector('[data-act="ccdone"]'), null, { timeout: 60000 }); await p.waitForTimeout(600);
  await (await p.$('[data-act="ccdone"]')).tap();
  await p.waitForFunction(() => document.querySelector('.nav button[data-v="board"]'), null, { timeout: 20000 }); await p.waitForTimeout(8000);
  const early = (t) => (t.match(/[^.\n]*\b(restaurant|chef|mara|kitchen|diner|sell|sold|produce ready)\b[^.\n]*/gi) || []).map((x) => x.trim().slice(0, 120));
  // the Board's story card for the Garden, and anything said about later steps
  const board = await p.evaluate(() => { document.querySelectorAll('#layer .modal,.dropsplash').forEach((e) => e.remove()); document.querySelector('.nav button[data-v="board"]').click(); return document.querySelector('#app').innerText; });
  ok('the Board before the Garden mentions no later step', !early(board).some((x) => /restaurant|chef|mara/i.test(x)), early(board));
  // build the Garden
  const built = await p.evaluate(async () => { const w = (ms) => new Promise((o) => setTimeout(o, ms)); const x = window.__qb.x(), S = x.S;
    S.coins += 10000; const btn = document.createElement('button'); btn.dataset.act = 'rdo'; btn.dataset.i = String(S.base.slots.length); btn.dataset.t = 'garden'; document.querySelector('#app').appendChild(btn); btn.click(); await w(1200); btn.remove();
    const splash = [...document.querySelectorAll('#layer .modal,.dropsplash')].map((e) => e.innerText).join(' | ');
    return { slots: S.base.slots.map((s) => s && s.t), splash, i: S.base.slots.findIndex((s) => s && s.t === 'garden') }; });
  ok('the Garden is built', built.slots.includes('garden'), built.slots);
  ok('its splash mentions no Restaurant or chef', !/restaurant|chef|mara|kitchen/i.test(built.splash), built.splash.replace(/\s+/g, ' ').slice(0, 400));
  const win = async (tag) => { const t = await p.evaluate(async (i) => { const w = (ms) => new Promise((o) => setTimeout(o, ms)); document.querySelectorAll('#layer .modal,.dropsplash').forEach((e) => e.remove()); window.__qb.roomModal(i); await w(900);
      const m = document.querySelector('.rmodal'); const sb = [...document.querySelectorAll('.rmodal [data-act="stysell"]')].filter((e) => e.offsetParent !== null); window.__sellhtml = sb.map((e) => e.outerHTML.slice(0, 300) + ' rect ' + JSON.stringify(e.getBoundingClientRect())).join(' || '); return { text: m ? m.innerText : '', sell: sb.length > 0, sellhtml: window.__sellhtml, acts: [...new Set([...document.querySelectorAll('.rmodal [data-act]')].map((e) => e.dataset.act))].join(' ') }; }, built.i);
    await (await p.$('.rmodal')).screenshot({ path: path.join(OUT, `garden_${tag}.png`) }); return t; };
  const startWet = await p.evaluate(() => window.gdWatered ? window.gdWatered() : null);
  console.log('  a new Garden starts watered:', startWet);
  await p.evaluate(() => { const S = window.__qb.x().S; S.base.gwater = Date.now() - 1000; });
  const dry = await win('dry');
  console.log('  (debug) dry sell element:', dry.sellhtml); console.log('  (debug) dry window:', JSON.stringify(dry.text.replace(/\s+/g, ' ').slice(0, 500)), 'acts:', dry.acts);
  const dryLine = (dry.text.match(/[^\n]*dry[^\n]*/i) || [''])[0];
  ok('dry: no "produce ready" or sell price, no Restaurant (the stand is drawn and says "Nothing to sell yet")', !/produce ready|sell for|restaurant|chef/i.test(dry.text), early(dry.text));
  ok('dry: it says how selling starts', /water/i.test(dryLine) && /sell/i.test(dry.text), dryLine);
  // the stand before any produce: what a tap says
  const standTap = await p.evaluate(async () => { const w = (ms) => new Promise((o) => setTimeout(o, ms)); const g = document.querySelector('.rmodal [data-act="stysell"]'); const before = document.body.innerText; if (g) g.dispatchEvent(new MouseEvent('click', { bubbles: true })); await w(600); const after = document.body.innerText; return after.split('\n').filter((l) => !before.includes(l)).slice(0, 3); });
  console.log('  tapping the produce stand before any produce shows:', JSON.stringify(standTap));
  // water
  const watered = await p.evaluate(async (i) => { const w = (ms) => new Promise((o) => setTimeout(o, ms)); const c = document.querySelector('.rmodal [data-act="gdwater"]'); if (c) c.dispatchEvent(new MouseEvent('click', { bubbles: true })); await w(800); return window.gdWatered ? window.gdWatered() : null; }, built.i);
  const wet = await win('watered');
  ok('watered: the beds are wet, still no produce ready or Restaurant', watered && !/produce ready|sell for|restaurant|chef/i.test(wet.text), { watered, line: (wet.text.match(/[^\n]*grow[^\n]*/i) || [''])[0] });
  // time passes: the first produce
  await p.evaluate(() => { window.__qbShift = (window.__qbShift || 0) + 3 * 36e5; const x = window.__qb.x(); try { x.rollover && x.rollover(); } catch (e) {} x.render(); });
  await p.waitForTimeout(1500);
  const pops = await p.evaluate(() => [...document.querySelectorAll('#layer .modal,.dropsplash,.pop,[class*="toast"]')].map((e) => e.innerText.replace(/\s+/g, ' ').slice(0, 160)));
  const ripe = await win('ripe');
  await p.waitForTimeout(700);
  const firstPop = await p.evaluate(() => /Your first produce is ready/.test(document.body.innerText));
  ok('the one-time pop at the first produce', firstPop);
  ok('after 3 h: a sell row with produce ready', ripe.sell && /produce ready|sell for/i.test(ripe.text), (ripe.text.match(/[^\n]*(produce|sell)[^\n]*/gi) || []).slice(0, 3));
  ok('still no Restaurant or chef in the window', !/restaurant|chef|mara/i.test(ripe.text), early(ripe.text));
  console.log('  pops seen at the first produce:', JSON.stringify(pops));
  const board2 = await p.evaluate(() => { document.querySelectorAll('#layer .modal,.dropsplash').forEach((e) => e.remove()); document.querySelector('.nav button[data-v="board"]').click(); return document.querySelector('#app').innerText; });
  console.log('  the Board now says:', JSON.stringify(early(board2)));
  ok('no page errors', errs.length === 0, errs.slice(0, 2));
  console.log(fails.length ? 'FAILED ' + fails.length : 'all passed');
  await b.close();
})();
