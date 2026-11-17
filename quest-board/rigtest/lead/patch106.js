// Update 1.06's letter (Cal, 2026-11-17: "send a short update summary of the patch changes in the mailbox. And give everyone 500 coins")
// and QA's v1.06 note (the Shop's brand tabs ran off a phone). On the plain build:
//  - a player from before 11-17 has the letter, unread, from Cal; Claim pays 500 once; a second Claim pays nothing
//  - a player who joined 11-18 does not get it
//  - at 375, 390 and 430 wide, on 11-19 (3 brands) and 12-23 (3 + the vault brand), every Shop section tab is fully on screen
//   PORT=<plain build server> NODE_PATH=<playwright's parent> node rigtest/lead/patch106.js   (pictures to SHOTS, default /tmp)
const { chromium } = require('playwright');
let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
const base = 'http://127.0.0.1:' + (process.env.PORT || 8779), SHOTS = process.env.SHOTS || '/tmp';
(async () => { const b = await chromium.launch({ args: ['--mute-audio'] });
  const page = async (w) => { const p = await (await b.newContext({ viewport: { width: w, height: 844 } })).newPage(); p.errs = []; p.on('pageerror', (e) => p.errs.push(e.message.slice(0, 150)));
    await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbDrops, null, { timeout: 90000 }); await p.waitForTimeout(800); return p; };
  const setup = (p, day, mon, join) => p.evaluate(async ([day, mon, join]) => { const x = window.__qb.x(), S = x.S; const real = Date.now() - (window.__qbShift || 0); window.__qbShift = new Date(mon === 0 ? 2027 : 2026, mon, day, 10, 0).getTime() - real;
    S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(12); S.gates = [5, 10]; S.brandSeen = {}; ['hanga', 'y2k', 'over', 'nc', 'alt', 'smk', 'kp', 'sp', 'gp', 'bb', 'km', 'oak', 'sv'].forEach((id) => { S.brandSeen[id] = 1; });
    S.cls = Object.keys(window.__qbCls || {})[0] || S.cls || 'vanguard'; S.calm = false; S.fsall = 1; S.areaOn = { board: 1, shop: 1, hideout: 1 }; S.owned = {}; S.coins = 1000;
    S.letters = { read: { welcome: 1, roadmap: 1 }, paid: { welcome: 3000 }, at: { welcome: join, roadmap: join } }; window.__qbRooms.open('closet', 1); x.render(); await new Promise((o) => setTimeout(o, 400)); }, [day, mon, join]);
  const clear = (p) => p.evaluate(() => { document.querySelectorAll('#layer .modal,.dropsplash,.bsplash').forEach((m) => m.remove()); });
  // the letter
  let p = await page(390); await setup(p, 19, 10, '2026-11-10'); await clear(p);
  await p.click('.ibbtn'); await p.waitForTimeout(400);
  const row = await p.evaluate(() => { const r = document.querySelector('.ibrow[data-id="patch106"]'); return r ? { un: r.classList.contains('un'), t: r.innerText } : null; });
  ok(row && row.un && /Update 1\.06/.test(row.t) && /Cal/.test(row.t), 'a player from 11-10 has "Update 1.06" from Cal, unread ' + JSON.stringify(row));
  await p.click('.ibrow[data-id="patch106"]'); await p.waitForTimeout(400);
  const body = await p.evaluate(() => (document.querySelector('.ibox') || {}).innerText || '');
  ok(/3 brands/.test(body) && !/HANGANG|DIAL-UP|OVERPASS|NICE COCK|ALTITUDE|SMOKE|Friday|Monday|Wednesday|Vault|8 am/i.test(body) && /Claim 500 coins/i.test(body), 'the letter has the notes, no spoilers (no brand, day or Vault), and a Claim 500 coins button');
  await p.screenshot({ path: SHOTS + '/patch106_letter.png' });
  const c0 = await p.evaluate(() => window.__qb.x().S.coins); await p.click('[data-ib="claim"][data-id="patch106"]'); await p.waitForTimeout(400);
  const c1 = await p.evaluate(() => window.__qb.x().S.coins);
  await p.evaluate(() => { const b = document.createElement('button'); b.dataset.ib = 'claim'; b.dataset.id = 'patch106'; document.body.appendChild(b); b.click(); b.remove(); }); await p.waitForTimeout(300);
  const c2 = await p.evaluate(() => window.__qb.x().S.coins);
  ok(c1 - c0 === 500 && c2 === c1, `Claim pays 500 once (${c0} -> ${c1} -> ${c2})`);
  ok(!p.errs.length, 'no page errors ' + JSON.stringify(p.errs.slice(0, 3))); await p.context().close();
  p = await page(390); await setup(p, 19, 10, '2026-11-18'); for (let i = 0; i < 4; i++) { await p.waitForTimeout(700); await clear(p); } await p.evaluate(() => document.querySelector('.ibbtn').click()); await p.waitForTimeout(400);
  ok(!!(await p.$('.iblist')), '  (its inbox opened)');
  ok(!(await p.$('.ibrow[data-id="patch106"]')), 'a player who joined 11-18 does not get it'); await p.context().close();
  // the tabs
  for (const w of [375, 390, 430]) for (const [d, m, n] of [[19, 10, 3], [23, 11, 4]]) {
    p = await page(w); await setup(p, d, m, '2026-11-10'); await p.click('.nav button[data-v="shop"]');
    for (let i = 0; i < 6; i++) { await p.waitForTimeout(700); await clear(p); } await p.evaluate(() => window.__qb.x().render()); await p.waitForTimeout(600);
    const t = await p.evaluate(() => [...document.querySelectorAll('.qshop .qs-tabs:not(.qs-floors) .qs-tab')].map((e) => { const r = e.getBoundingClientRect(); return { t: e.innerText, l: Math.round(r.left), r: Math.round(r.right), vis: r.left >= 0 && r.right <= innerWidth + 0.5 && r.width > 0 }; }));
    const brands = t.filter((x) => !/^(basics|upgrades|interface)$/i.test(x.t)).length;
    ok(brands === n && t.every((x) => x.vis), `${w} wide, ${m === 10 ? 'Nov' : 'Dec'} ${d}: ${brands} brand tabs, all ${t.length} fully on screen ${t.map((x) => x.t + (x.vis ? '' : ' CUT')).join(' / ')}`);
    await p.screenshot({ path: `${SHOTS}/patch106_tabs_${w}_${m + 1}${d}.png` });
    ok(!p.errs.length, '  no page errors ' + JSON.stringify(p.errs.slice(0, 3))); await p.context().close(); }
  await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
