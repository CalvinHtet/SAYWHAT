// The web build (dist-web, docs/WEBAPP.md) on a stand-in Firebase (mockfirebase.js): sign-in screen, boot, save and reload,
// art loaded on demand, two players seeing each other, and the AI call going to /api/sample.
// QB_TARGET=web python3 tools/build.py; serve quest-board/ on PORT (default 65410); NODE_PATH=<playwright> node rigtest/lead/webtest.js
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const PORT = process.env.PORT || '65410', URL = 'http://127.0.0.1:' + PORT + '/dist-web/index.html';
const MOCK = fs.readFileSync(path.join(__dirname, 'mockfirebase.js'), 'utf8');
let fails = 0; const ok = (name, cond, info) => { if (!cond) fails++; console.log((cond ? '  ok   ' : '  FAIL ') + name + (cond ? '' : '  ' + JSON.stringify(info))); };
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  const art = []; let apiBody = null;
  await ctx.route(/firebase-(app|auth|firestore)-compat\.js/, (r) => r.fulfill({ contentType: 'text/javascript', body: /app-compat/.test(r.request().url()) ? MOCK : '' }));
  await ctx.route(/\/__\/firebase\/init\.json/, (r) => r.fulfill({ status: 404, body: '' }));
  await ctx.route(/\/api\/sample/, (r) => { apiBody = JSON.parse(r.request().postData() || '{}'); r.fulfill({ contentType: 'application/json', body: JSON.stringify({ result: { matches: true, what: 'a clean sink' } }) }); });
  ctx.on('request', (q) => { if (/\/art\/[^/]+\.webp/.test(q.url())) art.push(q.url().split('/art/')[1].split('?')[0]); });
  const open = async (uid, signed) => { const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.addInitScript(([u, s]) => { window.__mockUid = u; if (s) window.__mockSignedIn = 1; }, [uid, signed]); await p.goto(URL); return { p, errs }; };

  // 1. a new player sees the sign-in screen, signs in, and reaches the character creator
  const A = await open('ana', 0);
  await A.p.waitForSelector('#qbsigninbtn', { timeout: 60000 });
  ok('a new player sees the sign-in screen first', await A.p.isVisible('#qbsigninbtn'));
  ok('nothing of the game boots behind it', await A.p.evaluate(() => !window.__qb || !window.__qb.x().S.created));
  await A.p.click('#qbsigninbtn');
  await A.p.waitForFunction(() => document.querySelector('[data-act="ccnext"]'), null, { timeout: 60000 });
  ok('signing in hides the screen and opens the creator', !(await A.p.isVisible('#qbsignin')));
  await A.p.fill('#ccname', 'Ana'); await A.p.click('[data-act="ccnext"]'); await A.p.waitForFunction(() => document.querySelector('[data-act="ccdone"]'), null, { timeout: 60000 });
  await A.p.waitForTimeout(800); await A.p.click('[data-act="ccdone"]'); await A.p.waitForTimeout(3000);
  await A.p.evaluate(() => document.querySelectorAll('#layer .modal').forEach((m) => m.remove()));
  const boot = await A.p.evaluate(() => ({ err: window.__qbBootErr || '', name: window.__qb.x().S.char && window.__qb.x().S.char.name }));
  ok('the game boots on the web database (no boot error)', !boot.err && boot.name === 'Ana', boot);

  // 2. the save is in Firestore as one JSON string under data/users/<uid>/state, and comes back after a reload
  await A.p.evaluate(() => { const S = window.__qb.x().S; S.coins = 4321; }); await A.p.evaluate(() => window.__qb.x().persist && window.__qb.x().persist());
  await A.p.evaluate(() => { const S = window.__qb.x().S; S.coins = 4321; window.dispatchEvent(new Event('qbtestsave')); });
  await A.p.click('.nav button[data-v="hideout"]').catch(() => {}); await A.p.waitForTimeout(2500);
  const stored = await A.p.evaluate(() => { const v = localStorage.getItem('__mfb:data/users/ana/state'); return v ? JSON.parse(v) : null; });
  ok('the save is written as {j, t}', !!(stored && typeof stored.j === 'string' && stored.t), stored && Object.keys(stored));
  const inSave = stored && JSON.parse(stored.j);
  ok('the stored save is the player (name Ana)', !!(inSave && inSave.char && inSave.char.name === 'Ana'), inSave && inSave.char);
  await A.p.evaluate(() => localStorage.removeItem('quest-board')); // only the database can bring it back
  await A.p.reload(); await A.p.waitForFunction(() => window.__qb && window.__qb.x().S.created, null, { timeout: 60000 }); await A.p.waitForTimeout(1500);
  const back = await A.p.evaluate(() => ({ name: window.__qb.x().S.char.name, coins: window.__qb.x().S.coins, signin: !!document.querySelector('#qbsignin') && getComputedStyle(document.querySelector('#qbsignin')).display !== 'none' }));
  ok('after a reload the player comes back from the database, signed in, no sign-in screen', back.name === 'Ana' && !back.signin, back);

  // 3. art loads on demand, as loose files
  ok('no packed character art in the page (art_rig scripts absent)', await A.p.evaluate(() => ![...document.scripts].some((s) => /art_rig|art_icon|art_ui|art_ex/.test(s.src))));
  ok('character art arrives as files when drawn', art.some((n) => /^[mf]_/.test(n)), art.slice(0, 5));
  const q = await A.p.evaluate(() => ({ url: window.QBART['m_base_front.webp'], has: 'm_base_front.webp' in window.QBART, none: window.QBART['nope.webp'] }));
  ok('QBART answers any picture with its file URL', /^art\/m_base_front\.webp\?h=/.test(q.url || '') && q.has && q.none === undefined, q);
  const broken = await A.p.evaluate(() => [...document.images].filter((i) => i.complete && i.src && !i.naturalWidth).map((i) => i.src.split('/').pop()).slice(0, 5));
  ok('no broken pictures on screen', !broken.length, broken);

  // 4. a second player sees the first in the Hall, live
  const B = await open('ben', 1);
  await B.p.waitForFunction(() => document.querySelector('[data-act="ccnext"]'), null, { timeout: 60000 });
  await B.p.fill('#ccname', 'Ben'); await B.p.click('[data-act="ccnext"]'); await B.p.waitForFunction(() => document.querySelector('[data-act="ccdone"]'), null, { timeout: 60000 });
  await B.p.waitForTimeout(800); await B.p.click('[data-act="ccdone"]'); await B.p.waitForTimeout(3000);
  await A.p.evaluate(() => window.__qbLive && window.__qbLive.publish()); await B.p.evaluate(() => window.__qbLive && window.__qbLive.publish());
  let seen = null; const t0 = Date.now();
  while (Date.now() - t0 < 30000) { seen = await B.p.evaluate(() => window.__qbLive.soc().worlds.map((w) => w.id)); if (seen.includes('ana')) break; await B.p.waitForTimeout(1000); }
  ok(`Ben sees Ana in the neighborhood (${((Date.now() - t0) / 1000).toFixed(1)} s)`, seen.includes('ana'), seen);
  const st = await B.p.evaluate(() => window.__qbLive.state());
  ok('live sync is on, with listeners on worlds, board and pings', st.on && st.subs === 3, st);
  const g0 = await B.p.evaluate(() => window.__mfbColGets.length); await B.p.evaluate(() => window.__qbLive.kick()); await B.p.waitForTimeout(2500);
  const g1 = await B.p.evaluate(() => window.__mfbColGets.slice(0));
  ok('re-reading the neighborhood asks the database for no collection while listening', g1.length - g0 === 0, { gets: g1.slice(g0) });

  // 5. the AI goes to /api/sample with the player's token
  const ai = await A.p.evaluate(async () => { const s = await window.claude.use('sample'); const lim = await s.limits(); const r = await s.json('Return ONLY JSON {"matches":true}', { modelTier: 'quick' }); return { lim, r }; });
  ok('sample.json goes to /api/sample and hands back the result', ai.lim.images && ai.r && ai.r.matches === true && apiBody && apiBody.prompt && apiBody.tier === 'quick', { ai, apiBody });

  ok('no page errors', !A.errs.length && !B.errs.length, A.errs.concat(B.errs).slice(0, 4));
  console.log(fails ? 'FAIL ' + fails : 'PASS'); await b.close(); process.exit(fails ? 1 : 0);
})();
