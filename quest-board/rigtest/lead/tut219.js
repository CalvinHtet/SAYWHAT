// Cal 11-26 (29zz_v219.js): a first-time window for the Crawls tab and the Vault; the Garden's and the Restaurant's teach today's
// mechanics (watering, selling, takings); no player-facing line spoils a later room or upgrade.
//   PORT=<build server> NODE_PATH=<playwright's parent> OUT=<dir> node rigtest/lead/tut219.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8838, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV219, null, { timeout: 90000 }); await p.waitForTimeout(300);
  await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' }); const V = (f, a) => p.evaluate(f, a); const w = (ms) => p.waitForTimeout(ms);
  /* no spoilers anywhere in the help, the room words, the upgrades, the tours, the (i) sheets */
  const sp = await V(() => { const x = window.__qb.x(), bad = [], rx = /sprinkler[s]? (do|will)|later|once those open|secret door|Pet Shop creature|what comes next|on the menu|next month's dinner|never have to|IMAX|Behind the doors|Mara will have|first business|For now it is|Shop opens with it|new room next door|once it opens|for looks|snacks and more as it grows/i;
    const look = (where, s) => { if (typeof s === 'string' && rx.test(s)) bad.push(where + ': ' + s.slice(0, 90)); };
    const H = window.__qbV219.help; Object.keys(H).forEach((k) => { look('help.' + k, H[k].sub); (H[k].pts || []).forEach((q) => { look('help.' + k, q[0]); look('help.' + k, q[1]); }); });
    Object.keys(x.ADDONS).forEach((r) => (x.ADDONS[r] || []).forEach((a) => { if (r === 'garden' || r === 'restaurant' || r === 'closet' || r === 'patio') a.forEach((s) => look('addon.' + r, s)); }));
    Object.keys(x.ROOMT).forEach((k) => look('room.' + k, x.ROOMT[k] && x.ROOMT[k].desc)); Object.keys(x.ADDONS).forEach((r) => (x.ADDONS[r] || []).forEach((a) => a.forEach((s) => { if (/Shop opens with it/.test(s)) look('addon.' + r, s); }))); return bad; });
  ok(sp.length === 0, 'no lines that spoil later rooms or upgrades ' + JSON.stringify(sp.slice(0, 6)));
  const g = await V(() => { const H = window.__qbV219.help.garden; return H.pts.map((q) => q[0] + ': ' + q[1]).join(' | '); });
  ok(/Water/.test(g) && /Sell/.test(g) && /on its own/.test(g) && !/[Ss]prinkler/.test(g), 'the Garden teaches watering, selling and earning on its own ' + g);
  /* the Crawls tab's first-time window */
  await V(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'C', sex: 'm' }); S.xp = x.cum(12); S.gates = [5, 10]; S.tutDone = 1; S.seen = {}; S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1, banner: 1, away: 1 };
    S.unl = { console: 1, pets: 1, acc2: 1, sable7: 1 }; S.mile = { since: 999, fx1: 1 }; S.story = S.story || {}; S.story.team = { sable: 1 }; S.dng = { runs: [], cd: { d: '', n: 0 }, npcs: {}, log: [] };
    S.base.slots = [{ t: 'bedroom', a: { bd_ward1: 1, bd_ward2: 1 }, st: 0, pend: 0 }, { t: 'closet', a: {}, st: 0, pend: 0 }]; S.areaOn = { board: 1, train: 1, hideout: 1, hall: 1, shop: 1, away: 1 };
    if (window.__qbV192 && window.__qbV192.due()) window.__qbV192.claim(); x.render(); document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); document.querySelector('.nav button[data-v="away"]').click(); });
  await w(2800); const cw = await V(() => { const m = document.querySelector('#layer .rsplash'); return m ? m.innerText.replace(/\s+/g, ' ') : null; });
  ok(cw && /Dungeon Crawls/.test(cw) && /Claim/.test(cw) && /twice a day/.test(cw), 'the Crawls tab opens with its how-to window ' + (cw || '').slice(0, 160));
  await p.screenshot({ path: OUT + '/tut219_crawls.png' });
  await V(() => document.querySelectorAll('#layer .modal').forEach((m) => m.remove())); await w(2500);
  const again = await V(() => !!document.querySelector('#layer .rsplash'));
  ok(!again, 'it shows once');
  /* the Vault's */
  await V(() => document.querySelector('.nav button[data-v="shop"]').click()); await w(800); await V(() => document.querySelectorAll('#layer .modal,.dropsplash,.bsplash').forEach((m) => m.remove()));
  await V(() => document.querySelector('[data-shub="vault"]').click()); await w(2800); const vw = await V(() => { const m = document.querySelector('#layer .rsplash'); return m ? m.innerText.replace(/\s+/g, ' ') : null; });
  ok(vw && /The Vault/.test(vw) && /Sunday/.test(vw), 'the Vault opens with its window ' + (vw || '').slice(0, 120));
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
