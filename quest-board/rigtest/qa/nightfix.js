// LEAD's night-owl fix (d03aa26, zxMidnightOnce) against v0.96: saves written by the 5 am rule, loaded with the clock set, then one quest
// ticked: (1) a night owl: quest at 01:00 on 11-20 (lastDone 11-19, saved 01:00), next at 03:00 on 11-21; (2) an evening player: quest at 23:00
// on 11-19, the app saved again at 01:00 on 11-20 with no quest, next quest at 10:00 on 11-20; (3) a 21:00 save, next at 10:00 on 11-20;
// (4) another device's newer save (21:00 on 11-20, lastDone 11-20) beside this phone's night copy, next at 03:00 on 11-21. A second load
// changes nothing (mid0).   NEW= OLD= CHROME_PORT=9375 node nightfix.js
const fs = require('fs'), path = require('path'); const { browser, sleep } = require('./cdp.js');
const NEW = process.env.NEW || 'http://127.0.0.1:8817', OLD = process.env.OLD || 'http://127.0.0.1:8818';
const BASE0 = JSON.parse(JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds/v90_mid.json'), 'utf8'))['quest-board']);
const T = (d, h) => new Date(2026, 10, d, h, 0).getTime();
const mk = (lastDone, savedAt, now, extra) => Object.assign(JSON.parse(JSON.stringify(BASE0)), { uid: 'sandbox', streak: 10, best: 10, lastDone, runDate: lastDone, done: {}, freezes: 0, freeWk: '', savedAt, tshift: now - Date.now(), calm: false, tours: { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1 } }, extra || {});
let bad = 0; const ok = (n, c, g) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + n + (g !== undefined ? '  ' + JSON.stringify(g).slice(0, 460) : '')); };
const run = async (br, base, local, cloud) => { const pg = await br.page({ fresh: true }); await pg.go(base + '/version.json');
  await pg.ev(`(function(a,b){localStorage.clear();localStorage.setItem('quest-board',a);localStorage.setItem('qbsbx:data/users/sandbox/state',b);return 1})(${JSON.stringify(JSON.stringify(local))},${JSON.stringify(JSON.stringify(cloud))})`);
  await pg.go(base + '/'); await pg.wait('!!(window.QBGAME && window.QBGAME.ready())', 120000); await sleep(2500); await pg.ev('(function(){document.querySelectorAll(".qbsv [data-pick=cloud]").forEach(function(b){b.click()});return 1})()'); await sleep(1500);
  const a = await pg.ev('(function(){var x=window.__qb.x(),S=x.S;return {now:S.runDate,last:S.lastDone,mid0:S.mid0||0,streak:S.streak}})()');
  const b = await pg.ev(`(function(){var x=window.__qb.x(),S=x.S,fw0=S.freeWk;S.quests.push({id:'qn',t:'Gym',xp:60,c:5,cl:'fitness',rep:'once'});x.toggle('qn');return {streak:S.streak,last:S.lastDone,restDayUsed:S.freeWk!==fw0}})()`);
  await pg.ev('(function(){window.__qb.x().persist();return 1})()'); await sleep(1200);
  // a second load of the same browser: nothing moves again
  await pg.go(base + '/'); await pg.wait('!!(window.QBGAME && window.QBGAME.ready())', 120000); await sleep(2000); const c = await pg.ev('(function(){var S=window.__qb.x().S;return {last:S.lastDone,streak:S.streak,mid0:S.mid0||0}})()');
  const errs = pg.errs || []; await pg.close(); return { load: a, quest: b, reload: c, errs }; };
(async () => { const br = await browser();
  const cases = [
    ['1 night owl, next night 03:00', mk('2026-11-19', T(20, 1), T(21, 3))],
    ['2 evening quest, app saved 01:00, next 10:00', mk('2026-11-19', T(20, 1), T(20, 10))],
    ['3 21:00 save, next 10:00', mk('2026-11-19', T(19, 21), T(20, 10))],
  ];
  for (const [lab, s] of cases) { const n = await run(br, NEW, s, s), o = await run(br, OLD, s, s);
    console.log(`${lab}\n   v0.97: load last ${n.load.last} (mid0 ${n.load.mid0}) -> quest: streak ${n.quest.streak}, rest day used ${n.quest.restDayUsed}; reload: last ${n.reload.last}, streak ${n.reload.streak}\n   v0.96: load last ${o.load.last} -> quest: streak ${o.quest.streak}, rest day used ${o.quest.restDayUsed}`);
    if (/^1/.test(lab)) ok('1: the night owl keeps the streak without using the rest day, as on v0.96', n.load.last === '2026-11-20' && n.quest.streak === 11 && !n.quest.restDayUsed && o.quest.streak === 11, { n, o });
    if (/^2/.test(lab)) ok('2: the evening player still gets +1 for the 11-20 quest, as on v0.96', n.quest.streak === o.quest.streak, { v097: n.quest, v096: o.quest, load: n.load });
    if (/^3/.test(lab)) ok('3: a 21:00 save is left as it was', n.load.last === '2026-11-19' && n.quest.streak === o.quest.streak, { n: n.load, q: n.quest });
    ok(`${lab}: a second load moves nothing and keeps the streak`, n.reload.last === n.quest.last && n.reload.streak === n.quest.streak && n.reload.mid0 === 1, n.reload);
    ok(`${lab}: no page errors`, !n.errs.length && !o.errs.length, [n.errs, o.errs]); }
  // 4: this phone's night copy vs another device's newer save
  const local = mk('2026-11-19', T(20, 1), T(21, 3)), cloud = mk('2026-11-20', T(20, 21), T(21, 3), { xp: BASE0.xp + 300, total: (BASE0.total || 0) + 3 });
  const n4 = await run(br, NEW, local, cloud); console.log(`4 another device's newer save\n   v0.97: load last ${n4.load.last} (mid0 ${n4.load.mid0}) -> quest: streak ${n4.quest.streak}, rest day used ${n4.quest.restDayUsed}`);
  ok('4: the newer save from another device wins and its lastDone is not touched', n4.load.last === '2026-11-20' && n4.quest.streak === 11 && !n4.quest.restDayUsed, n4);
  console.log(bad ? 'FAILED ' + bad : 'PASS'); process.exit(0); })().catch((e) => { console.error(e); process.exit(1); });
