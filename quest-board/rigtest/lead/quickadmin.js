// Quick admin pays a little less (Cal, 2026-11-17: "small tasks like sending emails or repetitive admin work gets a little bit less XP"),
// on the plain build: a desk task (cluster admin) of 5 or 10 XP pays 75% of the XP a same-sized home task pays, with a "Quick admin"
// tag; an admin task of 25 XP, home, social and fitness tasks pay as before; coins are the same either way; the day's bounty is not cut;
// and through the Board, "Send the emails" (scored admin 10 offline) earns 75% of "Wash the dishes" (home 10). v1.17: it still counts
// in full toward the day's 50 XP that makes the streak and the Weekly Quest count, and unticking takes that back off.
//   PORT=<plain build server> NODE_PATH=<playwright's parent> node rigtest/lead/quickadmin.js
const { chromium } = require('playwright');
let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
const base = 'http://127.0.0.1:' + (process.env.PORT || 8779);
(async () => { const b = await chromium.launch({ args: ['--mute-audio'] }); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 150)));
  await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x, null, { timeout: 90000 }); await p.waitForTimeout(1000);
  await p.evaluate(() => setInterval(() => document.querySelectorAll('#layer .modal,.dropsplash,.bsplash').forEach((m) => m.remove()), 300));
  const r = await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(30); S.gates = Array.from({ length: 200 }, (_, i) => i); S.calm = false; S.streak = 10; S.lastDone = ''; S.combo = null; x.render();
    const q = (id, cl, xp, stat) => ({ id, name: id, cl, xp, stat: stat || 'productivity', rep: 'once' }), m = (qq) => { const o = x.mults(qq, {}); return { xp: o.hx, cx: o.cx, tags: o.tags.join(' ') }; };
    return { a10: m(q('a10', 'admin', 10)), h10: m(q('h10', 'home', 10)), a5: m(q('a5', 'admin', 5)), h5: m(q('h5', 'home', 5)), a25: m(q('a25', 'admin', 25)), h25: m(q('h25', 'home', 25)),
      s10: m(q('s10', 'social', 10, 'social')), f10: m(q('f10', 'out', 10, 'fitness')), bty: (() => { const qq = Object.assign(q('b10', 'admin', 10), { bty: { k: 1 } }); return m(qq); })() }; });
  const near = (a, b) => Math.abs(a - b) <= 1;
  ok(near(r.a10.xp, Math.round(r.h10.xp * .75)) && /Quick admin/.test(r.a10.tags), `admin 10 pays 75% of home 10: ${r.a10.xp} vs ${r.h10.xp} (${r.a10.tags})`);
  ok(near(r.a5.xp, Math.round(r.h5.xp * .75)), `admin 5 pays 75% of home 5: ${r.a5.xp} vs ${r.h5.xp}`);
  ok(r.a25.xp === r.h25.xp && !/Quick admin/.test(r.a25.tags), `admin 25 unchanged: ${r.a25.xp} = ${r.h25.xp}`);
  ok(r.s10.xp >= r.h10.xp - 1 && !/Quick admin/.test(r.s10.tags + r.f10.tags), `social and fitness 10 unchanged: ${r.s10.xp}, ${r.f10.xp}`);
  ok(r.a10.cx === r.h10.cx && r.a5.cx === r.h5.cx, `coins the same: admin ${r.a10.cx}/${r.a5.cx}, home ${r.h10.cx}/${r.h5.cx}`);
  ok(!/Quick admin/.test(r.bty.tags), 'a bounty is not cut ' + r.bty.tags);
  // through the Board
  const board = await p.evaluate(async () => { const x = window.__qb.x(), S = x.S, out = {};
    for (const t of ['Send the emails', 'Wash the dishes']) { const cap = document.getElementById('cap'); cap.value = t; cap.dispatchEvent(new Event('input', { bubbles: true })); document.getElementById('capgo').click(); await new Promise((o) => setTimeout(o, 900));
      const q = S.quests.filter((q) => q.name === t)[0]; if (!q) { out[t] = null; continue; } S.combo = null; const x0 = S.xp; x.toggle(q.id); await new Promise((o) => setTimeout(o, 400)); out[t] = { cl: q.cl, xp: q.xp, got: S.xp - x0 }; }
    return out; });
  const e = board['Send the emails'], d = board['Wash the dishes'];
  ok(e && d && e.cl === 'admin' && e.xp === 10 && d.xp === 10 && near(e.got, Math.round(d.got * .75)), 'on the Board: emails earn 75% of the dishes ' + JSON.stringify(board));
  // v1.17 (Cal: "Yes, count in full"): the XP paid stays 75%, but the day's active count (50 XP: streak, Weekly Quest) gets the full XP;
  // unticking takes it off again
  const day = await p.evaluate(async () => { const x = window.__qb.x(), S = x.S, y = new Date(Date.now() - 864e5), ys = y.getFullYear() + '-' + String(y.getMonth() + 1).padStart(2, '0') + '-' + String(y.getDate()).padStart(2, '0');
    S.streak = 5; S.lastDone = ys; S.dayXp = { d: '', x: 0 }; S.qaDay = null; S.combo = null; const full = x.mults({ id: 'hz', name: 'hz', cl: 'home', xp: 10, stat: 'productivity', rep: 'once' }, {}).hx;
    const ids = []; for (let i = 0; i < 7; i++) { const id = 'qa' + i; S.quests.push({ id, name: 'Reply to ticket ' + i, cl: 'admin', xp: 10, stat: 'productivity', rep: 'once' }); ids.push(id); }
    const log = []; for (const id of ids) { S.combo = null; const x0 = S.xp; x.toggle(id); log.push({ paid: S.xp - x0, day: S.dayXp.x, streak: S.streak }); await new Promise((o) => setTimeout(o, 50)); }
    const before = { day: S.dayXp.x, streak: S.streak }; for (const id of ids.slice(2)) x.toggle(id); const after = { day: S.dayXp.x, streak: S.streak, lastDone: S.lastDone === ys ? 'yesterday' : S.lastDone };
    return { full, log, before, after }; });
  const need = Math.ceil(50 / day.full), credAt = day.log.findIndex((l) => l.streak === 6) + 1;
  ok(day.log.every((l) => l.paid < day.full) && day.log.every((l, i) => Math.abs(l.day - (i + 1) * day.full) <= i + 1), `quick admin still pays less (${day.log[0].paid} vs ${day.full}) but counts in full toward the day: ` + JSON.stringify(day.log.map((l) => l.day)));
  ok(credAt === need, `the streak counts the day at the ${need}th quick task (full XP ${day.full} each), not later: credited at ${credAt}`);
  ok(day.after.day === day.before.day - 5 * day.full || Math.abs(day.after.day - 2 * day.full) <= 2, `unticking 5 takes their full XP off the day: ${day.before.day} -> ${day.after.day}`);
  ok(day.after.streak === 5 && day.after.lastDone === 'yesterday', 'and the day no longer counts: streak back to 5 ' + JSON.stringify(day.after));
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3)));
  await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
