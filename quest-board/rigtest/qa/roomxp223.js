// QA, 29zz_v223.js (Cal 11-27: every room upgrade adds a little XP). Plain build.
//  A. the 22 rooms: each one fully upgraded gives ECON.roomUpXp (1%), plus its old card XP where it had no buff (Lounge, Bar, Spa);
//     an empty room 0; no Loft room (Room Bonus) and no Studio/Gym/Library/Dojo in the list
//  B. three rooms full (restaurant, lair, lounge): one "Room upgrades" line in the buffs with their sum; crewPct rises by that sum, not
//     more (no double count with the room's own buff line), and stays capped at 50
//  C. a real quest: its XP with the three rooms full against none, through mults() and through completing it (S.xp delta)
//   PORT=<plain build> NODE_PATH=<playwright> node rigtest/qa/roomxp223.js
const pw = require('playwright'); const PORT = process.env.PORT || 8824; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); }; const note = (s) => console.log('     ' + s);
(async () => { const b = await pw.chromium.launch({ args: ['--mute-audio'] }); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV223, null, { timeout: 120000 }); await p.waitForTimeout(600);
  const R = await p.evaluate(() => { const x = window.__qb.x(), S = x.S, V = window.__qbV223, A = x.ADDONS, T = x.ROOMT;
    S.created = true; S.char = window.__qb.fixChar({ name: 'X', sex: 'm' }); S.xp = x.cum(30) + 10; S.gates = S.gates || []; let g, n = 0; while ((g = x.gated()) !== null && n++ < 30) S.gates.push(g); S.tutDone = 1; S.cls = 'vanguard';
    S.base = S.base || { slots: [] }; const keep = S.base.slots.slice();
    const full = (t) => { const a = {}; (A[t] || []).forEach((q) => { a[q[0]] = 1; }); return { t, a, st: 0, pend: 0 }; };
    const out = { rooms: V.rooms.slice(), per: {}, oldxp: {} };
    V.rooms.forEach((t) => { out.per[t] = V.pct(full(t)); out.oldxp[t] = Math.round((A[t] || []).reduce((s, q) => s + (((q[3] || {}).xp) || 0), 0) * 100) / 100; out.buff = out.buff || {}; out.buff[t] = !!(T[t] && T[t].buff); });
    out.empty = V.pct({ t: 'restaurant', a: {} });
    const rowsOf = () => V.buffs().filter((o) => o.who === 'Room upgrades');
    const q = { id: 'qa223', name: 'Wash the dishes', xp: 100, stat: 'discipline', cl: 'home', rep: 'once' };
    const emptyOf = (t) => ({ t, a: {}, st: 0, pend: 0 }); /* the baseline has the three rooms, built but not upgraded: a Lounge switches on the crew and unlock buffs by itself */
    S.base.slots = keep.filter((s) => !['restaurant', 'lair', 'lounge'].includes(s.t)).concat([emptyOf('restaurant'), emptyOf('lair'), emptyOf('lounge')]); x.render();
    out.none = { rows: rowsOf().map((o) => o.b.pct), crew: V.crew(q), m: x.mults(q, {}).m, tags: x.mults(q, {}).tags };
    S.base.slots = keep.filter((s) => !['restaurant', 'lair', 'lounge'].includes(s.t)).concat([full('restaurant'), full('lair'), full('lounge')]); x.render();
    out.three = { rows: rowsOf().map((o) => o.b.pct), crew: V.crew(q), m: x.mults(q, {}).m, tags: x.mults(q, {}).tags,
      allRows: V.buffs().filter((o) => /lounge|lair|restaurant|room/i.test(o.who)).map((o) => o.who + ' ' + JSON.stringify(o.b).slice(0, 80)) };
    /* the cap: every listed room full */ S.base.slots = keep.concat(V.rooms.map(full)); x.render(); out.all = { rows: rowsOf().map((o) => o.b.pct), crew: V.crew(q) };
    S.base.slots = keep; x.render(); return out; });
  note('rooms (' + R.rooms.length + '): ' + R.rooms.map((t) => t + ' ' + R.per[t] + (R.oldxp[t] ? ' (old card ' + R.oldxp[t] + (R.buff[t] ? ', own buff' : '') + ')' : '')).join(', '));
  ok(R.rooms.length === 22 && !R.rooms.some((t) => /^(studio|gym|library|dojo|bedroom|kitchen|living|patio|game|closet|bath|office)$/.test(t)), '22 rooms, none of the Loft, Studio, Gym, Library or Dojo rooms');
  const offOne = R.rooms.filter((t) => { const want = 1 + (R.buff[t] ? 0 : R.oldxp[t]); return Math.abs(R.per[t] - want) > 0.05; });
  ok(!offOne.length, 'each room fully upgraded gives 1% plus its old card XP where it had no buff of its own' + (offOne.length ? ' (off: ' + offOne.map((t) => t + ' ' + R.per[t]).join(', ') + ')' : ''));
  ok(R.empty === 0, 'an empty room gives 0 (' + R.empty + ')');
  const sum3 = Math.round((R.per.restaurant + R.per.lair + R.per.lounge) * 100) / 100;
  note('three rooms built, no upgrades: ' + JSON.stringify(R.none)); note('restaurant + lair + lounge full: ' + JSON.stringify(R.three).slice(0, 600)); note('all 22 full: ' + JSON.stringify(R.all));
  ok(R.none.rows.length === 0 && R.three.rows.length === 1 && Math.abs(R.three.rows[0] - sum3) < 0.02, 'one "Room upgrades" line, ' + R.three.rows[0] + ' = the three rooms\' sum ' + sum3 + ', none without them');
  ok(Math.abs((R.three.crew - R.none.crew) - sum3) < 0.05, 'crewPct rises by exactly that sum (' + R.none.crew + ' -> ' + R.three.crew + '), no double count');
  ok(R.all.crew <= 50, 'crewPct stays capped at 50 with every room full (' + R.all.crew + ', Room upgrades ' + R.all.rows[0] + ')');
  ok(Math.abs(R.three.m / R.none.m - (1 + R.three.crew / 100) / (1 + R.none.crew / 100)) < 0.002, 'mults() pays it: x' + (R.three.m / R.none.m).toFixed(4) + ' on the quest (' + R.none.tags.join(', ') + ' -> ' + R.three.tags.join(', ') + ')');
  /* C: complete the same quest twice from the same state, once without and once with the three rooms */
  const C = await p.evaluate(async () => { const x = window.__qb.x(), S = x.S, A = x.ADDONS; const full = (t) => { const a = {}; (A[t] || []).forEach((q) => { a[q[0]] = 1; }); return { t, a, st: 0, pend: 0 }; };
    const keep = JSON.parse(JSON.stringify(S.base.slots)); const emptyOf = (t) => ({ t, a: {}, st: 0, pend: 0 }); const run = async (withRooms) => { S.base.slots = JSON.parse(JSON.stringify(keep)).filter((s) => !['restaurant', 'lair', 'lounge'].includes(s.t)).concat(['restaurant', 'lair', 'lounge'].map((t) => (withRooms ? full(t) : emptyOf(t))));
        const id = 'qa223' + (withRooms ? 'w' : 'n'); S.quests = (S.quests || []).filter((q) => !/^qa223/.test(q.id)); S.quests.push({ id, name: 'Wash the dishes', xp: 100, stat: 'discipline', cl: 'home', rep: 'once' }); S.done = S.done || {}; delete S.done[id]; S.combo = null;
        x.render(); const x0 = S.xp; try { x.toggle(id); } catch (e) { return { err: String(e).slice(0, 80) }; } await new Promise((r) => setTimeout(r, 400)); document.querySelectorAll('#layer > *').forEach((m) => m.remove()); return { gain: S.xp - x0, done: S.done[id] }; };
    /* each completion from the same saved state (a second quest of the day earns a little more, so the order would skew it) */
    const snap = JSON.stringify(S); const restore = () => { const o = JSON.parse(snap); Object.keys(S).forEach((k) => { if (!(k in o)) delete S[k]; }); Object.assign(S, o); };
    const n = await run(false); restore(); const w = await run(true); restore(); S.base.slots = keep; return { n, w }; });
  note('completed quest, 100 XP listed: without the rooms +' + C.n.gain + ' XP (done ' + C.n.done + '), with them +' + C.w.gain + ' XP (done ' + C.w.done + ')');
  ok(C.n.gain > 0 && C.w.gain > C.n.gain && Math.abs(C.w.gain / C.n.gain - R.three.m / R.none.m) < 0.01, 'completing the quest pays the extra XP (' + (C.w.gain / C.n.gain).toFixed(3) + 'x, mults said ' + (R.three.m / R.none.m).toFixed(3) + 'x; whole XP points round)');
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
