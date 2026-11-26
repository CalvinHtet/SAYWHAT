// Cal 11-25 (29zzz_econ.js): tasks pay more (TASKK 1.45, was 1.2) and their coins grow 1% a level again, up to +50% at level 51.
//   PORT=<build server> NODE_PATH=<playwright's parent> node rigtest/lead/econ179.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8838; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch(); const p = await (await b.newContext()).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x, null, { timeout: 90000 });
  const r = await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.cdone = {}; S.gates = Array.from({ length: 200 }, (_, i) => i); const o = {}; [1, 12, 30, 51, 80].forEach((L) => { S.xp = x.cum(L); o[L] = x.coinsFor(25); }); return o; });
  console.log('     a 25 XP task, first of the day: ' + JSON.stringify(r));
  ok(r[1] === 168 && r[12] === 186 && r[30] === 216 && r[51] === 251 && r[80] === 251, 'pays 168 at level 1, rising 1% a level to +50% from level 51 (was a flat 139)');
  ok(!errs.length, 'no page errors'); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
