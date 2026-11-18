// Quick admin pays a little less (Cal, 2026-11-17: "small tasks like sending emails or repetitive admin work gets a little bit less XP"),
// on the plain build: a desk task (cluster admin) of 5 or 10 XP pays 75% of the XP a same-sized home task pays, with a "Quick admin"
// tag; an admin task of 25 XP, home, social and fitness tasks pay as before; coins are the same either way; the day's bounty is not cut;
// and through the Board, "Send the emails" (scored admin 10 offline) earns 75% of "Wash the dishes" (home 10).
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
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3)));
  await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
