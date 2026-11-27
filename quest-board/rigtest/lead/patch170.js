// Update 1.70's letter (29zz_v180.js, ships on v1.61; the same rules as Update 1.50).
//  - a player from before 11-25 has it, unread, from Cal; Claim pays 500 coins once (Cal 11-17: every 10th-version letter carries 500)
//  - its text names no companion, creature, brand, weekday or date
//  - a player who joined 11-26 does not get it
//   PORT=<plain build server> NODE_PATH=<playwright's parent> OUT=<dir> node rigtest/lead/patch170.js
const { chromium } = require('playwright');
let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
const base = 'http://127.0.0.1:' + (process.env.PORT || 8838), OUT = process.env.OUT || '/tmp';
(async () => { const b = await chromium.launch({ args: ['--mute-audio'] });
  const page = async () => { const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage(); p.errs = []; p.on('pageerror', (e) => p.errs.push(e.message.slice(0, 150)));
    await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && document.querySelector('.nav button, #ccname'), null, { timeout: 90000 }); await p.waitForTimeout(800); return p; };
  const setup = (p, join) => p.evaluate(async (join) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(12); S.gates = [5, 10]; S.cls = 'vanguard'; S.tutDone = 1;
    S.tours = { welcome: 1, hideout: 1, train: 1, dq: 1, bty: 1, hall: 1, shop: 1, players: 1, wheel: 1, away: 1, banner: 1 }; S.unl = Object.assign({ console: 1, pets: 1, acc2: 1, sable7: 1 }, S.unl || {}); S.areaOn = { board: 1, shop: 1, hideout: 1 };
    S.letters = { read: { welcome: 1, roadmap: 1 }, paid: { welcome: 3000 }, at: { welcome: join, roadmap: join } }; x.persist(); x.render(); await new Promise((o) => setTimeout(o, 500)); document.querySelectorAll('#layer .modal,.dropsplash,.bsplash').forEach((m) => m.remove()); }, join);
  let p = await page(); await setup(p, '2026-11-10'); await p.click('.ibbtn'); await p.waitForTimeout(400);
  const row = await p.evaluate(() => { const r = document.querySelector('.ibrow[data-id="patch170"]'); return r ? { un: r.classList.contains('un'), t: r.innerText.replace(/\s+/g, ' ') } : null; });
  ok(row && row.un && /Update 1\.70/.test(row.t) && /Cal/.test(row.t), 'a player from 11-10 has "Update 1.70" from Cal, unread ' + JSON.stringify(row));
  await p.click('.ibrow[data-id="patch170"]'); await p.waitForTimeout(400);
  const r = await p.evaluate(() => { const e = document.querySelector('.ibox'); return { t: e ? e.innerText : '', claim: !!document.querySelector('[data-ib="claim"][data-id="patch170"]'), wide: document.documentElement.scrollWidth > innerWidth + 1 }; });
  ok(/three brands/.test(r.t) && /workout/i.test(r.t) && /level-up/i.test(r.t) && /seasons/.test(r.t) && r.claim && /Claim 700 coins/i.test(r.t) && !r.wide, 'the letter has its notes, a Claim 700 coins button (Cal 11-26), and fits a 390 px phone');
  const pay = await p.evaluate(async () => { const S = window.__qb.x().S, c0 = S.coins; document.querySelector('[data-ib="claim"][data-id="patch170"]').click(); await new Promise((q) => setTimeout(q, 400)); const c1 = S.coins;
    const b = document.createElement('button'); b.dataset.ib = 'claim'; b.dataset.id = 'patch170'; document.body.appendChild(b); b.click(); b.remove(); await new Promise((q) => setTimeout(q, 300)); return { d1: c1 - c0, d2: S.coins - c1 }; });
  ok(pay.d1 === 700 && pay.d2 === 0, 'Claim pays 700 coins once (Cal 11-26) (' + pay.d1 + ', then ' + pay.d2 + ')');
  ok(!/\bpets?\b|companion|wolf|wyvern|slime|dragon|evol|transform|Pet Store|treat|milk|soul stone|loot|HANGANG|DIAL-UP|OVERPASS|ALTITUDE|SAYMORE|KODE|Atelier|Boutique|Vault|Monday|Tuesday|Wednesday|Thursday|Friday|8 am|level 25|\b20\d\d\b/i.test(r.t), 'no spoilers: no companion, creature, brand, floor, weekday or date in it');
  await p.screenshot({ path: OUT + '/patch170_letter.png' }); ok(!p.errs.length, 'no page errors ' + JSON.stringify(p.errs.slice(0, 2)));
  p = await page(); await setup(p, '2026-11-26'); await p.click('.ibbtn'); await p.waitForTimeout(400);
  ok(!(await p.evaluate(() => !!document.querySelector('.ibrow[data-id="patch170"]'))), 'a player who joined 11-26 does not get it');
  await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
