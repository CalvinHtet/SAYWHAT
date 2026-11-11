// The Weekly Warrior prize text (rc-v0.92c, LEAD 11-11): before the player has the Closet (the Shop) the prize says "(saved for later)",
// after it "(in your Wardrobe)", like the Wheel's; either way the piece is owned at once, and once the Closet is built it is in the
// Wardrobe. A level-10 player, the 4th proven workout of a week done through the game's own toggle (mode "v").
//   BASE=<sandbox build> CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/wwprize.js
const { browser, sleep, boot, E } = require('./wfocus_lib.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8817';
const P = []; const ok = (c, s) => { console.log((c ? 'ok   ' : 'BAD  ') + s); if (!c) P.push(s); };
const week = (pg, q, day) => pg.ev(`(async function(){var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})},real=Date.now()-(window.__qbShift||0);window.__qbShift=${Date.parse(day + 'T20:00:00Z')}-real;var x=window.__qb.x(),S=x.S;S.done={};
  var g=new Date(),t=new Date(g.getFullYear(),g.getMonth(),g.getDate());t.setDate(t.getDate()-((t.getDay()+6)%7));var p=function(n){return (n<10?'0':'')+n},key=t.getFullYear()+'-'+p(t.getMonth()+1)+'-'+p(t.getDate());
  S.wcount=S.wcount||{};S.wcount[key]=3;x.persist();x.render();document.querySelectorAll('#layer .modal,.dropsplash').forEach(function(e){e.remove()});var own0=Object.keys(S.owned||{});
  x.toggle('${q}',null,'v');await w(3200);var m=[].filter.call(document.querySelectorAll('#layer .modal'),function(e){return /Weekly Warrior/.test(e.innerText)})[0];var txt=m?m.innerText.replace(/\\s+/g,' '):null;
  var c=m&&[].filter.call(m.querySelectorAll('button'),function(b){return /claim/i.test(b.innerText)})[0];if(c){c.click();await w(1500)}var got=Object.keys(S.owned||{}).filter(function(k){return own0.indexOf(k)<0});
  document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});return {txt:txt,got:got,closet:S.base.slots.some(function(r){return r&&r.t==='closet'})}})()`);
(async () => {
  const br = await browser(); const pg = await boot(br, { base: BASE }); await E(pg, 'W.closeAll()'); await E(pg, 'W.lvl(10)');
  const q = await pg.ev(`(function(){var S=window.__qb.x().S,w=S.quests.filter(function(q){return q.rep==="weekly4"})[0];if(!w){w={id:"qa_ww",name:"Workout",xp:30,stat:"fitness",cl:"body",rep:"weekly4"};S.quests.push(w)}window.__qb.x().persist();return w.id})()`);
  const a = await week(pg, q, '2026-11-16');
  ok(!a.closet && /Prize: .+ \(saved for later\)/.test(a.txt || '') && a.got.length === 1, `before the Closet: "${(a.txt || '').match(/Prize: [^)]*\)/)}", owned at once: ${JSON.stringify(a.got)}`);
  await pg.ev('(function(){window.__qbRooms.open("closet",1);window.__qb.x().render();document.querySelectorAll("#layer .modal,.dropsplash,.bsplash").forEach(function(m){m.remove()});return 1})()'); await sleep(800);
  const b = await week(pg, q, '2026-11-23');
  ok(b.closet && /Prize: .+ \(in your Wardrobe\)/.test(b.txt || '') && b.got.length === 1, `with the Closet: "${(b.txt || '').match(/Prize: [^)]*\)/)}", owned: ${JSON.stringify(b.got)}`);
  // the saved piece is in the Wardrobe now
  const wd = await pg.ev(`(async function(){var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})};document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});var b=document.querySelector('.nav button[data-v=board]');b&&b.click();var sh=document.querySelector('.nav button[data-v=shop]');sh&&sh.click();await w(2000);document.querySelectorAll('#layer .modal,.dropsplash').forEach(function(e){e.remove()});var wb=document.querySelector('.qs-wdb');wb&&wb.click();await w(1500);
    var ids=[].map.call(document.querySelectorAll('.qs-rack [data-card]'),function(e){return e.dataset.card});return {n:ids.length,has:${JSON.stringify(a.got)}.every(function(k){return ids.indexOf(k)>=0})}})()`);
  ok(wd.has, `the piece saved before the Closet shows in the Wardrobe now (${wd.n} entries): ${JSON.stringify(a.got)}`);
  ok(!pg.errs.length, `page errors: ${pg.errs.length} ${pg.errs.slice(0, 2).join(' | ')}`);
  console.log(P.length ? `W-WWPRIZE: ${P.length} problem(s)` : 'W-WWPRIZE: PASS');
  await br.close(); process.exit(P.length ? 1 : 0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(2); });
