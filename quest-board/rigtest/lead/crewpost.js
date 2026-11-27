// Crew posts (LEAD for ROOMS's Lock and Key staff, 2026-11-17) on the plain build. A full Lock and Key gets two stand-in staff: one posted
// to a spot tagged "tpost" (act "sit", post:1) and one walker ({wand:1}). Over 40 seconds the posted one starts on the spot, stays within
// 0.3 of it, sits there (mode "do", act "sit"), and nobody else ever holds it; the walker walks (more than one place); the bartender
// still serves (no "No crew here" note in the room panel); no page errors.
//   PORT=<plain build server> NODE_PATH=<playwright's parent> [SHOTS=<dir>] node rigtest/lead/crewpost.js
const { chromium } = require('playwright');
let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
const base = 'http://127.0.0.1:' + (process.env.PORT || 8779);
(async () => { const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] });
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 150)));
  await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbLoft && window.QBLoft, null, { timeout: 120000 }); await p.waitForTimeout(1000);
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S, L = window.__qbLoft(); S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(40); S.calm = false;
    S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, loft: 1, away: 1, banner: 1 }; S.unl = Object.assign({ console: 1, pets: 1, acc2: 1, sable7: 1 }, S.unl || {}); S.areaOn = { board: 1, hideout: 1 };
    S.base.slots = ['bedroom', 'skybar'].map((t) => ({ t, a: Object.fromEntries((x.ADDONS[t] || []).map((u) => [u[0], 1])), st: 0, pend: 0 }));
    const d = L.defs.skybar; window.__stf0 = d.staff.length; const look = d.staff[0][1];
    d.staff.push([null, look, { post: 'tpost' }], [null, look, { wand: 1 }]);
    /* the spot comes from the room's own draw, so every rebuild of the room keeps it (open floor at 7,5) */
    const dr = d.draw; d.draw = function (C) { const r = dr.apply(this, arguments); window.__sp = C.s('work', 7, 5, 1, 'sit', [4, 6], { tag: 'tpost', onspot: 1, post: 1 }); return r; }; x.render(); });
  await p.evaluate(() => document.querySelector('.nav button[data-v="hideout"]').click()); await p.waitForTimeout(3000);
  /* Lock and Key is in the second building on the street */
  await p.evaluate(() => { const e = document.querySelector('[data-act="bldgo"][data-v="1"]'); if (e) e.dispatchEvent(new MouseEvent('click', { bubbles: true })); }); await p.waitForTimeout(3000);
  for (let k = 0; k < 4; k++) { await p.evaluate(() => document.querySelectorAll('#layer .modal').forEach((m) => m.remove())); await p.waitForTimeout(300); }
  /* people only move inside an open room window (the building view is a still picture) */
  await p.evaluate(() => { document.querySelectorAll('#layer .modal,.dropsplash,.bsplash').forEach((m) => m.remove()); window.__qb.roomModal(1); }); await p.waitForTimeout(4000);
  const set = await p.evaluate(() => { const A = window.__qbLoft().A, ids = Object.keys(A).filter((k) => /^pv:st:skybar/.test(k)), n0 = window.__stf0;
    return ids.length ? { ids, pid: 'pv:st:skybar' + n0, wid: 'pv:st:skybar' + (n0 + 1), spot: window.__sp && [window.__sp.x, window.__sp.y] } : { none: ids }; });
  ok(!set.none, 'Lock and Key\'s staff are in the room ' + JSON.stringify(set));
  const back = await p.evaluate((pid) => { const a = window.__qbLoft().A[pid], sp = window.__sp; return a && sp ? Math.hypot(a.x - sp.x, a.y - sp.y) : 99; }, set.pid);
  ok(back <= 0.3, 'they are on their spot once the window opens, off by ' + back.toFixed(2));
  const log = []; for (let t = 0; t < 120; t++) { log.push(await p.evaluate(([pid, wid]) => { const A = window.__qbLoft().A, a = A[pid], w = A[wid], sp = window.__sp;
      return { has: !!a, d: a ? Math.hypot(a.x - sp.x, a.y - sp.y) : 99, mode: a && a.mode, act: a && a.act, by: sp.by, wx: w ? Math.round(w.x * 2) / 2 : null, wy: w ? Math.round(w.y * 2) / 2 : null, wm: w && w.mode, tm: a ? Math.round(a.t * 10) : null, ww: a && w ? Math.hypot(a.x - w.x, a.y - w.y) : 99, wr: w ? [w.x.toFixed(2), w.y.toFixed(2), w.tx && w.tx.toFixed(2), w.ty && w.ty.toFixed(2), w.alpha, w.leaving] : null }; }, [set.pid, set.wid])); await p.waitForTimeout(500); }
  const posted = log.filter((q) => q.has);
  ok(posted.length === 120, `the posted person is there (${posted.length}/120 samples over 60 s)`);
  ok(posted.every((q) => q.d <= 0.3), 'they stay on their spot the whole time (max ' + Math.max(...posted.map((q) => q.d)).toFixed(2) + ')');
  ok(posted.filter((q) => q.mode === 'do' && q.act === 'sit').length >= posted.length * 0.9, 'they sit there ' + JSON.stringify(posted.slice(0, 3)));
  ok(log.every((q) => q.by == null || q.by === set.pid), 'nobody else holds the spot ' + JSON.stringify([...new Set(log.map((q) => q.by))]));
  const places = new Set(log.filter((q) => q.wx != null).map((q) => q.wx + ',' + q.wy)); ok(places.size >= 3 && log.some((q) => q.wm === 'walk'), `the walker walks (${places.size} places)` + (places.size < 3 ? JSON.stringify(log.filter((q, i) => i % 5 === 0).map((q) => q.wr)) : ''));
  /* QA (ff44edc): a wander spot sat under the post and the walker stopped on the seated person. Now no one stops within 0.6 of them;
     walking past can come closer for a moment, as anyone passing anyone does, but never on top (0.3) */
  const stop = log.filter((q) => q.ww < 0.6 && q.wm !== 'walk'), close = Math.min(...log.map((q) => q.ww));
  ok(!stop.length && close >= 0.3, `the walker never stops on or beside the seated person (${stop.length} stopped inside 0.6; closest pass ${close.toFixed(2)})`);
  ok(new Set(log.map((q) => q.tm)).size > 3, 'the room is running (the clock of the posted person\'s sit goes down and restarts)');
  const panel = await p.evaluate(() => { const r = window.__qbLoft(); const t = document.querySelector('[data-act="lfroom"],[data-room]'); return document.body.innerText; });
  ok(!/No crew here/.test(panel), 'no "No crew here" note');
  if (process.env.SHOTS) await p.screenshot({ path: process.env.SHOTS + '/crewpost.png' });
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3)));
  await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
