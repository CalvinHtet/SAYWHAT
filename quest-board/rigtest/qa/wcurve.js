// The level curve change in rc-v0.92c (w-final item 5: level 100 near day 85-90, Cal: "without moving anyone's level"). A save made on
// the old build at level L and a fraction of the way to L+1 is loaded on the new build: the same level and about the same fraction,
// still the same after a second reload (moved once), and XP keeps adding up the same way after it. Levels 5, 20, 39, 41, 42, 60, 77,
// 95, 99, 100, a fresh player, and the seeds' real saves.
//   OLD=<old sandbox> NEW=<new sandbox> CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/wcurve.js
const fs = require('fs');
const { browser, sleep } = require('./cdp.js');
const OLD = process.env.OLD || 'http://127.0.0.1:8817', NEW = process.env.NEW || 'http://127.0.0.1:8822';
const P = []; const ok = (c, s) => { console.log((c ? 'ok   ' : 'BAD  ') + s); if (!c) P.push(s); };
const dump = '(function(){var o={};for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);o[k]=localStorage.getItem(k)}return o})()';
const put = (d) => `(function(d){localStorage.clear();Object.keys(d).forEach(function(k){localStorage.setItem(k,d[k])});return 1})(${JSON.stringify(d)})`;
const ready = (pg) => pg.wait('!!(window.__qb && document.querySelector("#app") && !document.querySelector("#app .boot"))', 120000);
// level, fraction to the next, raw xp, appv as the game shows them
const LV = '(function(){var x=window.__qb.x(),S=x.S,L=x.effLvl(),a=x.cum(L),b=x.cum(L+1);return {lv:L,frac:b>a?+((S.xp-a)/(b-a)).toFixed(3):null,xp:S.xp,appv:S.appv,curve:S.curve||S.lvCurve||null}})()';
(async () => {
  const br = await browser(); const rows = [];
  const cases = [5, 20, 39, 41, 42, 60, 77, 95, 99, 100].map((L) => ({ L, f: 0.3 }));
  for (const c of cases) {
    const po = await br.page({ fresh: true }); await po.go(OLD + '/'); await ready(po); await sleep(2000);
    const made = await po.ev(`(function(){var x=window.__qb.x(),S=x.S;S.created=true;S.char=window.__qb.fixChar({name:'Fey',sex:'f'});S.welcomed=1;var a=x.cum(${c.L}),b=x.cum(${c.L}+1);S.xp=Math.round(a+${c.f}*(b-a));var g,n=0;S.gates=[];while((g=x.gated())!==null&&n++<120)S.gates.push(g);S.reset91={refund:0,fresh:1,at:Date.now()};x.persist();return ${LV}})()`);
    await sleep(800); const d = await po.ev(dump); await po.close();
    const pn = await br.page({ fresh: true }); await pn.go(NEW + '/version.json'); await pn.ev(put(d)); await pn.go(NEW + '/'); await ready(pn); await sleep(2500);
    const a1 = await pn.ev(LV); await pn.go(NEW + '/'); await ready(pn); await sleep(2500); const a2 = await pn.ev(LV);
    const add = await pn.ev('(function(){var x=window.__qb.x(),S=x.S,l0=x.effLvl();S.quests.push({id:"qa_c",name:"Big job",xp:50,stat:"discipline",cl:"home",rep:"once"});x.persist();var xp0=S.xp;x.toggle("qa_c");return {gain:S.xp-xp0,lv:x.effLvl(),l0:l0}})()');
    rows.push({ L: c.L, old: made, first: a1, second: a2, add, errs: pn.errs.length }); await pn.close();
    ok(a1.lv === made.lv && Math.abs((a1.frac || 0) - (made.frac || 0)) < 0.02 && a2.lv === a1.lv && a2.xp === a1.xp && add.gain > 0,
      `level ${c.L}: old build ${made.lv} (${made.frac}, xp ${made.xp}) -> new ${a1.lv} (${a1.frac}, xp ${a1.xp}) -> after a reload ${a2.lv} (${a2.frac}, xp ${a2.xp}); a 50-XP quest then adds ${add.gain}`);
  }
  ok(!rows.some((r) => r.errs), `page errors: ${rows.map((r) => r.errs).join(',')}`);
  console.log(P.length ? `W-CURVE: ${P.length} problem(s)` : 'W-CURVE: PASS');
  await br.close(); process.exit(P.length ? 1 : 0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(2); });
