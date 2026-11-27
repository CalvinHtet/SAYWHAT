// Cal 11-26 (29zz_v199.js): the Players board gives one place each (a tie on level goes to the longer streak, then to more coins
// earned) and every row has the player's head.
//   PORT=<build server> NODE_PATH=<playwright's parent> OUT=<dir> node rigtest/lead/rank199.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8838, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV199 && window.__qbV135, null, { timeout: 90000 }); await p.waitForTimeout(300);
  await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' }); const V = (f, a) => p.evaluate(f, a);
  const r = await V(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Calzone', sex: 'm' }); S.xp = x.cum(17); S.tutDone = 1; S.streak = 3; S.earnedC = 9000;
    const look = S.char ? window.__qb.lookOf() : null, W = (id, name, lv, streak, earnedC) => ({ id, name, lv, streak, earnedC, look, t: Date.now(), rooms: [] });
    window.__qbV135.setMe('me1');
    window.__qbV135.setWorlds([W('j', 'Jet', 4, 1, 500), W('l', 'Logan', 4, 1, 900), W('m', 'Myintie', 4, 2, 100), W('s', 'Sonny D', 4, 1, 300), W('a', 'Anthony', 2, 0, 50), W('h', 'Hsi', 2, 0, 80), W('q', 'Squid', 2, 0, 80)]);
    return window.__qbV199.rank('level'); });
  const names = r.map((x) => x.name), places = r.map((x) => x.place);
  ok(JSON.stringify(names) === JSON.stringify(['Calzone', 'Myintie', 'Logan', 'Jet', 'Sonny D', 'Hsi', 'Squid', 'Anthony']) && JSON.stringify(places) === JSON.stringify([1, 2, 3, 4, 5, 6, 7, 8]),
    'one place each: level, then streak (Myintie 2 days), then coins earned (Logan 900, Jet 500, Sonny D 300), names last for a full tie (Hsi and Squid) ' + JSON.stringify(r.map((x) => [x.place, x.name, x.v, x.sk, x.ec])));
  const rows = await V(() => { const html = window.__qbV199.list(window.__qbV199.full('level'), 'level'); const d = document.createElement('div'); d.innerHTML = html; const rs = [...d.querySelectorAll('.fsh-row')]; return { n: rs.length, withAv: rs.filter((x) => x.querySelector('.fsh-av')).length, ranks: rs.map((x) => x.querySelector('.fsh-rk').textContent).join(',') }; });
  ok(rows.n === 8 && rows.withAv === 8 && rows.ranks === '1,2,3,4,5,6,7,8', 'every row has a head and its own number ' + JSON.stringify(rows));
  await V(async () => { document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); const S0 = window.__qb.x().S; S0.areaOn = null; if (window.__qbV192 && window.__qbV192.due()) window.__qbV192.claim(); window.__qb.x().render(); const t = document.querySelector('.nav button[data-v="hall"]'); if (t) t.click(); await new Promise((r) => setTimeout(r, 700)); const pl = [...document.querySelectorAll('.htab button, .htab [role=tab]')].find((b) => /Pla/.test(b.textContent)); if (pl) pl.click(); await new Promise((r) => setTimeout(r, 2500)); });
  const ui = await V(() => ({ rows: [...document.querySelectorAll('.fsh-row')].map((r) => r.querySelector('.fsh-rk').textContent + (r.querySelector('.fsh-av') ? '+' : '-')).join(' '), ped: [...document.querySelectorAll('.fsh-ped .fsh-blk span')].map((x) => x.textContent).join(',') }));
  ok(!ui.rows || (/^1\+ 2\+ 3\+/.test(ui.rows) && ui.ped === '2,1,3'), 'on the Players tab: rows 1, 2, 3 have heads; the podium reads 2, 1, 3 ' + JSON.stringify(ui));
  await p.screenshot({ path: OUT + '/rank199.png' });
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
