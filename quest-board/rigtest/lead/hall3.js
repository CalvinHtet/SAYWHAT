// Cal 11-23: the Town Hall's tabs are Posts, Chat, Players; Players ranks by level and a player's card has Wave, Fist bump, High five;
// no Players tab in the bottom bar; Chat has Room 3.
//   PORT=<plain build> NODE_PATH=<playwright's parent> OUT=<dir> node rigtest/lead/hall3.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8779, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbV135, null, { timeout: 90000 }); await p.waitForTimeout(800);
  const clear = () => p.evaluate(() => document.querySelectorAll('#layer .modal,#layer .qb-held').forEach((m) => m.remove()));
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(12); S.gates = [5, 10]; S.calm = false; S.tours = { welcome: 1, hideout: 1, hall: 1, players: 1, train: 1, dq: 1, bty: 1, away: 1, banner: 1 }; S.unl = Object.assign({ console: 1, pets: 1, acc2: 1, sable7: 1 }, S.unl || {}); S.areaOn = { board: 1, hideout: 1, hall: 1, players: 1, train: 1 };
    S.letters = { read: { welcome: 1, live135: 1 }, paid: {}, at: {}, popped: 1 }; window.__qbV135.setWorlds([{ id: 'a', name: 'Ann', lv: 20, look: null }, { id: 'b', name: 'Bo', lv: 3, look: null }]); x.render(); }); await clear();
  const nav = await p.evaluate(() => [...document.querySelectorAll('.nav button[data-v]')].map((b) => b.dataset.v)); ok(!nav.includes('players') && nav.includes('hall'), 'bottom bar without Players: ' + nav.join(','));
  await p.evaluate(() => document.querySelector('.nav button[data-v="hall"]').click()); await p.waitForTimeout(900); await clear();
  const tabs = await p.evaluate(() => [...document.querySelectorAll('.htab button')].map((b) => b.textContent.trim())); ok(tabs.join() === 'Posts,Chat,Players', 'Town Hall tabs: ' + tabs.join(', '));
  await p.evaluate(() => document.querySelector('.htab [data-t="chat"]').click()); await p.waitForTimeout(800); await clear();
  const rooms = await p.evaluate(() => window.__qbHall.chat().msgs.length); ok(rooms === 3, 'Chat has 3 rooms (' + rooms + '; their buttons draw only online)');
  await p.evaluate(() => document.querySelector('.htab [data-t="style"]').click()); await p.waitForTimeout(900); await clear();
  const pl = await p.evaluate(() => ({ mode: [...document.querySelectorAll('.fsh-tg button')].map((b) => b.textContent + (b.classList.contains('on') ? '*' : '')), rows: [...document.querySelectorAll('.fsh-row .fsh-rn')].map((e) => e.textContent.replace(/\s+/g, ' ').trim()) }));
  /* Cal 11-23: Players is one level leaderboard, no Highest level / Most rich buttons (29zz_v139.js) */ ok(!pl.mode.some((m) => /rich/i.test(m)) && /Ann/.test(pl.rows[0] || ''), 'Players ranks by level, no other ranking: ' + JSON.stringify(pl));
  await p.screenshot({ path: OUT + '/hall3_players.png' });
  await p.evaluate(() => { const r = [...document.querySelectorAll('[data-act="fshview"]')].find((e) => /Ann/.test(e.textContent)); if (r) r.click(); }); await p.waitForTimeout(700);
  const card = await p.evaluate(() => { const m = document.querySelector('#layer .modal'); return m ? [...m.querySelectorAll('.sq-acts button')].map((b) => b.textContent.trim()) : null; });
  ok(card && /Wave/.test(card.join()) && !/Fist bump|High five/.test(card.join()), 'a player\'s card: ' + JSON.stringify(card));
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
