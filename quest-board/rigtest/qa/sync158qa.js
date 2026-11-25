// QA, a18e4a08 (29zz_v158.js: while html.qb-sync is on, the looking-around controls take taps). What must still wait: everything that
// changes the save inside the screens that now open. With qb-sync forced on, real taps: the Stylist (try on, then Buy and its confirm),
// the Closet (a filter, then Equip), a letter (open it, Claim, the back button), the scratch card (rub a live panel), the Board's bounty
// (Take it, Reroll), the profile's Sound and Reset progress. After each: coins, owned, worn, bounties, letters paid and the scratch
// card's picks must be unchanged. Then the class off: the same Buy works.
//   PORT=<plain build> OUT=<dir> node sync158qa.js
const pw = require('playwright');
const PORT = process.env.PORT || 8819; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort())); const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 200)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV146 && window.__qbV147 && window.__qbV149, null, { timeout: 120000 }); await p.waitForTimeout(800);
  await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' });
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Syncy', sex: 'm' }); S.xp = x.cum(35); S.gates = [5, 10, 20, 30]; S.tutDone = 1; S.coins = 9000; S.calm = false; S.ref53 = 1;
    S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1, interface: 1, upgrades: 1, lounge: 1 }; S.areaOn = { board: 1, hideout: 1, hall: 1, shop: 1, wheel: 1 }; try { window.__qbRooms.open('closet', 1); } catch (e) {}
    S.cdone = { a: 1, b: 1, c: 1 }; delete S.sc; window.__qbV146.state(); x.persist(); x.render(); });
  await p.waitForTimeout(1500);
  const clr = () => p.evaluate(() => { for (const m of document.querySelectorAll('.bsplash,.dropsplash,.flsplash')) { const w = m.closest('.modal') || m; if (w.parentNode) w.parentNode.removeChild(w); } });
  const closeAll = () => p.evaluate(() => { for (const m of document.querySelectorAll('#layer .modal')) m.parentNode.removeChild(m); });
  const snap = () => p.evaluate(() => { const x = window.__qb.x(), S = x.S, bq = window.__qbV147.state(), sc = window.__qbV146.state(); return JSON.stringify({ c: S.coins, own: Object.keys(S.owned || {}).filter((k) => /mark/.test(k) && S.owned[k]).sort().join(','), pc: JSON.stringify((S.pc || {}).own || {}), eq: S.eq, bq: Object.keys(bq.act || {}), rr: bq.rr, ib: S.ib || S.inbox || null, pick: sc.pick, snd: S.snd, sound: S.sound }); });
  const sync = (on) => p.evaluate((on) => document.documentElement.classList.toggle('qb-sync', on), on);
  const tapIf = async (sel, label) => { await clr(); const el = await p.$(sel); if (!el) { console.log('     (no ' + label + ' to tap: ' + sel + ')'); return false; } try { await el.scrollIntoViewIfNeeded(); const r = await el.boundingBox(); await p.mouse.click(r.x + r.width / 2, r.y + r.height / 2); } catch (e) { console.log('     tap failed ' + label + ': ' + e.message.slice(0, 80)); return false; } await p.waitForTimeout(700); return true; };
  const s0 = await snap(); await sync(true); const steps = [];
  /* the Stylist: try on, Buy, confirm */
  await p.evaluate(() => document.querySelector('.nav button[data-v="shop"]').click()); await p.waitForTimeout(800); await clr(); await closeAll(); await tapIf('[data-shub="stylist"]', 'Stylist door'); await closeAll(); await p.waitForTimeout(400);
  console.log('     at the Stylist: ' + await p.evaluate(() => { const e = document.querySelector('[data-card="bs_mark_t1"] [data-act="qstry"]'); if (!e) return 'no t1 card; hub ' + (window.__qbV149 && window.__qbV149.hub()) + '; modals ' + document.querySelectorAll('#layer .modal').length; e.scrollIntoView({ block: 'center' }); const r = e.getBoundingClientRect(), h = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return 'button at ' + Math.round(r.top) + ', hit ' + (h ? h.tagName + '.' + h.className + ' ' + (h.dataset.act || '') : 'none') + ', pointer-events ' + getComputedStyle(e).pointerEvents; }));
  const st1 = await tapIf('[data-card="bs_mark_t1"] [data-act="qstry"]', 'Try on'); const tried = await p.evaluate(() => !!document.querySelector('[data-act="qscheck"]')); steps.push('try on ' + (st1 && tried ? 'took' : 'did not take'));
  await tapIf('[data-act="qscheck"]', 'Buy'); await tapIf('#layer [data-act="qsconfirm"]', 'Confirm purchase'); { const s1 = await snap(); steps.push('after Buy+confirm ' + (s1 === s0 ? 'unchanged' : 'CHANGED')); if (s1 !== s0) console.log('     before ' + s0 + '\n     after  ' + s1); }
  /* the Closet: open from the Shop's door, a filter, Equip */
  await closeAll(); await p.evaluate(() => document.querySelector('.nav button[data-v="board"]').click()); await p.waitForTimeout(600); await clr(); await tapIf('.strip .avbtn', 'avatar'); await tapIf('#layer .pcm [data-act="char"]', 'Profile'); await tapIf('#layer [data-act="wardrobe"]', 'Closet'); await clr(); const f1 = await tapIf('[data-wdf]:not([data-wdf="reset"])', 'Closet filter'); await tapIf('[data-act="equip"]', 'Equip'); steps.push('Closet filter ' + (f1 ? 'took' : '-') + ', Equip ' + ((await snap()) === s0 ? 'unchanged' : 'CHANGED'));
  /* a letter */
  await closeAll(); await p.evaluate(() => document.querySelector('.nav button[data-v="board"]').click()); await p.waitForTimeout(700); await clr(); await closeAll();
  await tapIf('.strip .ibbtn', 'mailbox'); const rows = await p.evaluate(() => document.querySelectorAll('#layer .ibrow').length); await tapIf('#layer .ibrow', 'a letter'); const opened = await p.evaluate(() => !!document.querySelector('#layer .ibback'));
  await tapIf('#layer [data-ib="claim"]', 'Claim'); const back = await tapIf('#layer .ibback', 'back'); const backed = await p.evaluate(() => !!document.querySelector('#layer .iblist'));
  steps.push('letters ' + rows + ', opened ' + opened + ', after Claim ' + ((await snap()) === s0 ? 'unchanged' : 'CHANGED') + ', back to the list ' + backed);
  /* the scratch card */
  await closeAll(); await tapIf('.strip .scbtn', 'scratch button'); const r = await p.evaluate(() => { const c = document.querySelectorAll('.sc-cell')[4]; if (!c) return null; const q = c.getBoundingClientRect(); return { x: q.left, y: q.top, w: q.width, h: q.height }; });
  if (r) { await p.mouse.move(r.x + r.w * .1, r.y + r.h * .3); await p.mouse.down(); for (let k = 0; k < 6; k++) await p.mouse.move(r.x + r.w * (.1 + .15 * k), r.y + r.h * .5, { steps: 3 }); await p.mouse.up(); await p.waitForTimeout(500); }
  steps.push('scratch rub ' + ((await snap()) === s0 ? 'unchanged' : 'CHANGED'));
  /* a bounty */
  await p.evaluate(() => document.querySelector('.nav button[data-v="board"]').click()); await p.waitForTimeout(700); await clr(); await closeAll(); await tapIf('[data-act="bqtake"]', 'Take it'); await tapIf('[data-act="bqroll"]', 'Reroll'); steps.push('bounty Take/Reroll ' + ((await snap()) === s0 ? 'unchanged' : 'CHANGED'));
  /* the profile */
  await closeAll(); await tapIf('.strip .avbtn', 'avatar'); await tapIf('#layer .pcm [data-act="char"]', 'Profile'); const prof = await p.evaluate(() => !!document.querySelector('#layer .prof'));
  const pb = await p.evaluate(() => { const out = []; for (const b of document.querySelectorAll('#layer .prof button')) { const t = b.textContent.trim(); out.push(t); if (/sound|reset/i.test(t)) b.setAttribute('data-qa-pb', t.slice(0, 6)); } return out.join('|'); });
  for (const el of await p.$$('[data-qa-pb]')) { const r2 = await el.boundingBox(); if (r2) { await p.mouse.click(r2.x + r2.width / 2, r2.y + r2.height / 2); await p.waitForTimeout(500); } }
  const wins = await p.evaluate(() => [...document.querySelectorAll('#layer .modal')].map((m) => m.innerText.slice(0, 40).replace(/\s+/g, ' ')).join(' / '));
  steps.push('profile (' + prof + ') Sound/Reset ' + ((await snap()) === s0 ? 'unchanged' : 'CHANGED') + ' [' + pb + '] windows: ' + wins);
  for (const s of steps) console.log('     ' + s);
  ok(steps.every((s) => !/CHANGED/.test(s)), 'while syncing nothing changes the save (final state the same: ' + ((await snap()) === s0) + ')');
  console.log('     the letter\'s back button while syncing: ' + (back && backed ? 'works' : 'does nothing'));
  /* synced: Buy works */
  await sync(false); await closeAll(); await p.evaluate(() => document.querySelector('.nav button[data-v="shop"]').click()); await p.waitForTimeout(800); await clr(); await closeAll(); await tapIf('[data-shub="stylist"]', 'Stylist door'); await closeAll(); await p.waitForTimeout(400); if (!(await p.$('[data-act="qscheck"]'))) await tapIf('[data-card="bs_mark_t1"] [data-act="qstry"]', 'Try on'); await tapIf('[data-act="qscheck"]', 'Buy'); await tapIf('#layer [data-act="qsconfirm"]', 'Confirm');
  const own = await p.evaluate(() => !!window.__qb.x().S.owned.bs_mark_t1); ok(own, 'synced: the same Buy works');
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
