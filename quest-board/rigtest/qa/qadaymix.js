// Quick admin counts in full toward the day (LEAD b148138, Cal: "Yes, count in full"), a mixed day: QA's own check on top of LEAD's
// quickadmin.js. Fresh day (streak 5, last done yesterday). Tick 3 quick admin + 1 home task (under 50 counted), then a 4th admin
// (over 50: the streak and the Weekly Quest count once). Untick the home task (under 50: both undone), tick it again (counted once
// more, not twice). Then reload the page and untick one admin task: S.qaDay survives the reload, so its full XP comes off.
//   BASE=<plain build server> NODE_PATH=<playwright's parent> node rigtest/qa/qadaymix.js
const { chromium } = require('playwright');
let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch({ args: ['--mute-audio'] }); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 150)));
  const ready = async () => { await p.waitForFunction(() => window.__qb && window.__qb.x, null, { timeout: 90000 }); await p.waitForTimeout(800); await p.evaluate(() => setInterval(() => document.querySelectorAll('#layer .modal,.dropsplash,.bsplash').forEach((m) => m.remove()), 300)); };
  await p.goto(process.env.BASE + '/dist/index.html'); await ready();
  const a = await p.evaluate(async () => { const x = window.__qb.x(), S = x.S, w = (ms) => new Promise((o) => setTimeout(o, ms)), y = new Date(Date.now() - 864e5), ys = y.getFullYear() + '-' + String(y.getMonth() + 1).padStart(2, '0') + '-' + String(y.getDate()).padStart(2, '0');
    S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(30); S.gates = Array.from({ length: 200 }, (_, i) => i); S.calm = false; S.combo = null;
    S.streak = 5; S.lastDone = ys; S.dayXp = { d: '', x: 0 }; S.qaDay = null; S.wq = null;
    const mk = (id, cl, xp) => { S.quests.push({ id, name: id, cl, xp, stat: 'productivity', rep: 'once' }); return id; };
    const A = [mk('ma0', 'admin', 10), mk('ma1', 'admin', 10), mk('ma2', 'admin', 10), mk('ma3', 'admin', 10)], H = mk('mh0', 'home', 10), B = mk('mb0', 'admin', 25);
    const wq = () => (S.wq && S.wq.n) || 0, st = () => ({ day: S.dayXp.x, streak: S.streak, wq: wq(), qa: Object.keys(S.qaDay || {}).filter((k) => k !== 'd').length });
    const log = {}; const t = async (id, k) => { S.combo = null; x.toggle(id); await w(60); log[k] = st(); };
    await t(A[0], 'a0'); await t(A[1], 'a1'); await t(A[2], 'a2'); await t(H, 'h'); await t(A[3], 'a3'); await t(H, 'h_off'); await t(H, 'h_on'); await t(B, 'b25');
    x.persist && x.persist(); return { log, ys }; });
  const L = a.log;
  ok(L.h.day < 50 && L.h.streak === 5 && L.h.wq === 0, `3 quick admin + 1 home: ${L.h.day} counted, under 50, nothing credited ` + JSON.stringify(L.h));
  ok(L.a3.day >= 50 && L.a3.streak === 6 && L.a3.wq === 1, `a 4th quick admin takes it over 50: streak 6, Weekly Quest day 1 ` + JSON.stringify(L.a3));
  ok(L.h_off.day < 50 && L.h_off.streak === 5 && L.h_off.wq === 0, `untick the home task: under 50, streak and Weekly Quest day undone ` + JSON.stringify(L.h_off));
  ok(L.h_on.streak === 6 && L.h_on.wq === 1, `tick it again: counted once more, not twice ` + JSON.stringify(L.h_on));
  ok(L.b25.qa === 4 && L.b25.streak === 6 && L.b25.wq === 1, `a 25 XP admin task adds no add-back (4 entries) and changes no count ` + JSON.stringify(L.b25));
  await p.reload(); await ready();
  const r = await p.evaluate(async () => { const x = window.__qb.x(), S = x.S, w = (ms) => new Promise((o) => setTimeout(o, ms)); const before = S.dayXp.x, qa = S.qaDay && S.qaDay.ma0; x.toggle('ma0'); await w(80);
    return { before, qa, after: S.dayXp.x, left: S.qaDay && S.qaDay.ma0, streak: S.streak }; });
  ok(r.qa > 0 && r.left === undefined, `after a reload the add-back is still known (${r.qa}) and unticking clears it`);
  ok(r.before - r.after >= 10, `unticking one admin task after the reload takes its full XP off the day: ${r.before} -> ${r.after}, streak ${r.streak}`);
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3)));
  await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
