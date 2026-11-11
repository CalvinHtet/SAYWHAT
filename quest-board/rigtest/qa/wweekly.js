// w-econ4: Cal's Weekly Warrior streak (coins x1 -> x2 -> x3 -> x4 cap for consecutive weeks, a missed week back to x1; XP unchanged).
// A level-10 player: each week the 4th proven workout is done through the game's own toggle (mode "v", as a verified photo does), the
// Weekly Warrior window's coins and XP are read and its button pays; weeks 1-5 in a row, a week skipped, then week 7. The Board's strip
// and the Training card show the multiplier line.
//   BASE=<build> CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/wweekly.js
const { browser, sleep, boot, E } = require('./wfocus_lib.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8819';
const log = (...a) => console.log(a.map((v) => (typeof v === 'string' ? v : JSON.stringify(v))).join(' '));
const MON = ['2026-11-16', '2026-11-23', '2026-11-30', '2026-12-07', '2026-12-14', '2026-12-21', '2026-12-28'];
(async () => {
  const br = await browser(); const pg = await boot(br, { base: BASE }); await E(pg, 'W.closeAll()'); await E(pg, 'W.lvl(10)');
  const q = await pg.ev(`(function(){var S=window.__qb.x().S,w=S.quests.filter(function(q){return q.rep==="weekly4"})[0];if(!w){w={id:"qa_ww",name:"Workout",xp:30,stat:"fitness",cl:"body",rep:"weekly4"};S.quests.push(w)}window.__qb.x().persist();return w.id})()`);
  log('weekly4 quest:', q, '| ECON.wwMax', await pg.ev('window.__qbEcon.ECON.wwMax'));
  for (let i = 0; i < MON.length; i++) {
    const day = MON[i], skip = i === 5;
    await pg.ev(`(function(){var real=Date.now()-(window.__qbShift||0);window.__qbShift=${Date.parse(day + 'T20:00:00Z')}-real;var x=window.__qb.x();x.S.xp=x.cum(10);x.S.done={};x.persist();x.render();return 1})()`); await sleep(1500);
    await E(pg, 'W.closeAll()');
    const strip = await pg.ev('(function(){var b=document.querySelector(".nav button[data-v=board]");b&&b.click();var s=document.querySelector(".wstrip");return s?s.innerText.replace(/\\s+/g," "):null})()');
    if (skip) { log(`week ${i + 1} (${day}): SKIPPED (no workouts) | strip: ${strip}`); continue; }
    const r = await pg.ev(`(async function(){var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})},x=window.__qb.x(),S=x.S,wk=Object.keys(S.wcount||{});
      var k=(function(){var d=new Date(Date.now());return null})();S.wcount=S.wcount||{};
      var key=(function(){var g=new Date();var t=new Date(g.getFullYear(),g.getMonth(),g.getDate());t.setDate(t.getDate()-((t.getDay()+6)%7));var p=function(n){return (n<10?'0':'')+n};return t.getFullYear()+'-'+p(t.getMonth()+1)+'-'+p(t.getDate())})();
      S.wcount[key]=3;delete (S.done||{})['${q}'];x.persist();document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});
      x.toggle('${q}',null,'v');await w(3200);var m=[].filter.call(document.querySelectorAll('#layer .modal'),function(e){return /Weekly Warrior/.test(e.innerText)})[0];
      if(!m)return {key:key,err:'no Weekly Warrior window',paid:JSON.stringify(S.weekPaid)};var t=m.innerText.replace(/\\s+/g,' ');var c0=S.coins,x0=S.xp;var ok=m.querySelector('#wwok');ok&&ok.click();await w(900);
      document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});return {key:key,window:t.slice(0,170),coins:Math.round(S.coins-c0),xp:Math.round(S.xp-x0)}})()`, 30000);
    log(`week ${i + 1} (${day}): ${r.err || ''} window "${r.window}" | paid ${r.coins} coins, ${r.xp} XP`);
    log(`   strip before: ${strip}`);
  }
  await pg.ev('(function(){var b=document.querySelector(".nav button[data-v=train]");b&&b.click();return 1})()'); await sleep(1200);
  log('Training card line:', await pg.ev('(function(){var t=document.getElementById("app").innerText.match(/Hit 4 in a week[^\\n]*/);return t?t[0]:null})()'));
  log('page errors', pg.errs.length, pg.errs.slice(0, 2));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
