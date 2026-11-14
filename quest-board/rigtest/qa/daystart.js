// LEAD's midnight day start (3e40ab6, DAYSTART 5 -> 0) against v0.96 (5 am): (A) at 23:59 and 00:01 the day, the Daily Quest and done quests
// turn over at midnight on the new build (5 am on the old); (B) streaks across the change: a save last played at 01:00 under the 5 am rule
// (so stored as the day before), played again the next night at 03:00, and the next morning at 09:00.   NEW= OLD= CHROME_PORT=9375 node daystart.js
const { browser, sleep } = require('./cdp.js'); const NEW = process.env.NEW || 'http://127.0.0.1:8817', OLD = process.env.OLD || 'http://127.0.0.1:8818';
let bad = 0; const ok = (n, c, g) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + n + (g !== undefined ? '  ' + JSON.stringify(g).slice(0, 460) : '')); };
const at = (y, mo, d, h, mi) => `window.__qbShift=(window.__qbShift||0)+(new Date(${y},${mo - 1},${d},${h},${mi}).getTime()-Date.now());`;
(async () => { const br = await browser(); const res = {};
  for (const [lab, base] of [['new', NEW], ['old', OLD]]) { const pg = await br.page({ fresh: true }); const E = (js) => pg.ev(`(function(){try{${js}}catch(e){return 'ERR '+e.message}})()`);
    await pg.go(base + '/'); await pg.wait('!!(window.__qb && document.querySelector("#app") && !document.querySelector("#app .boot"))', 120000); await sleep(1500);
    await E(`var x=window.__qb.x(),S=x.S;S.created=true;S.welcomed=1;S.char=window.__qb.fixChar({name:'Qa',sex:'m'});S.xp=x.cum(12);S.gates=Array.from({length:200},function(_,i){return i});S.calm=false;S.tours={};x.persist();return 1`);
    const st = () => E('var x=window.__qb.x(),S=x.S;return {run:S.runDate,done:Object.keys(S.done||{}).length,dq:S.dq&&S.dq.d,streak:S.streak,last:S.lastDone}');
    // A: the turn of the day
    await E(at(2026, 11, 20, 23, 59) + `var x=window.__qb.x(),S=x.S;x.rollover();S.quests=[{id:'qa1',t:'Dishes',xp:20,c:5,cl:'chores',rep:'daily'}];x.toggle('qa1');x.persist();return 1`); await sleep(500); const a1 = await st();
    await E(at(2026, 11, 21, 0, 1) + 'var x=window.__qb.x();x.rollover();x.render();return 1'); await sleep(500); const a2 = await st();
    await E(at(2026, 11, 21, 5, 1) + 'var x=window.__qb.x();x.rollover();x.render();return 1'); await sleep(500); const a3 = await st();
    res[lab] = { a1, a2, a3 };
    // B: the night owl. Stored as the 5 am rule stores a 01:00 play on 11-20: lastDone and runDate 11-19, streak 10
    const streakCase = async (y, mo, d, h) => { await E(`var x=window.__qb.x(),S=x.S;S.streak=10;S.lastDone='2026-11-19';S.runDate='2026-11-19';S.done={};S.dq=null;x.persist();return 1`);
      await E(at(y, mo, d, h, 0) + `var x=window.__qb.x(),S=x.S;x.rollover();S.quests=[{id:'qb${d}${h}',t:'Gym',xp:20,c:5,cl:'fitness',rep:'once'}];x.toggle('qb${d}${h}');return 1`); await sleep(400); return st(); };
    res[lab].b1 = await streakCase(2026, 11, 21, 3); res[lab].b2 = await streakCase(2026, 11, 20, 9);
    res[lab].errs = pg.errs || []; await pg.close(); }
  const N = res.new, O = res.old; console.log('new', JSON.stringify(N)); console.log('old', JSON.stringify(O));
  ok('new: at 00:01 the day has turned (runDate 11-21, done quests cleared, Daily Quest on the new day)', N.a1.run === '2026-11-20' && N.a2.run === '2026-11-21' && N.a2.done === 0 && N.a2.dq !== '2026-11-20', { a1: N.a1, a2: N.a2 });
  ok('old (5 am rule, for reference): at 00:01 still 11-20, at 05:01 11-21', O.a2.run === '2026-11-20' && O.a3.run === '2026-11-21', { a2: O.a2, a3: O.a3 });
  ok('streak: played 01:00 on 11-20 under the 5 am rule, next at 09:00 on 11-20: kept (11) on the new build', N.b2.streak === 11, { new: N.b2, old: O.b2 });
  ok('streak: played 01:00 on 11-20 under the 5 am rule, next at 03:00 on 11-21 (every night, after midnight): kept on the new build as on the old', N.b1.streak === O.b1.streak, { new: N.b1, old: O.b1 });
  ok('no page errors', !N.errs.length && !O.errs.length, [N.errs, O.errs]);
  console.log(bad ? 'FAILED ' + bad : 'PASS'); process.exit(0); })().catch((e) => { console.error(e); process.exit(1); });
