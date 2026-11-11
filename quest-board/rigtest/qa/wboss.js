// w-boss (W54, v0.92): the weekly Town Boss (29sb_boss.js) through its hook and the Hall's Posts tab, on game days set with __qbShift.
// 1. under 5 active players (3+ days in the week before): no boss card and no "boss" word in the Hall; 2. 5 active: HP 800 x 5, the
// card, "N fighting", my damage; 3. my damage = today's quest XP, capped 600; 4. the phases 75/50/25 as the others hit; 5. a win: Slain,
// the chest letter for a player who hit it (coins + a find on claim, 2 finds in the top 3, nothing on a second claim), no letter for one
// who didn't; 6. a Sunday loss: "got away", fire, no coins lost; the next Monday without a boss: "The town is still smoking"; a later
// win clears it; 7. the world doc carries pd/bw/bd.
//   BASE=<build> CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/wboss.js
const { browser, sleep, boot, E, PAGE } = require('./wfocus_lib.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8817';
const log = (...a) => console.log(a.map((v) => (typeof v === 'string' ? v : JSON.stringify(v))).join(' '));
const PT = (ymd, h = 12) => Date.parse(ymd + 'T00:00:00Z') + (h + 8) * 36e5;   // November 2026: Pacific = UTC-8
const LASTWK = ['2026-11-10', '2026-11-11', '2026-11-12'];
(async () => {
  const br = await browser();
  const setup = async (p, ymd, h) => p.ev(`(function(){var real=Date.now()-(window.__qbShift||0);window.__qbShift=${PT(ymd, h)}-real;return new Date().toString().slice(0,24)})()`);
  const hall = async (p) => { await p.ev('(function(){document.querySelectorAll("#layer .modal,.dropsplash").forEach(function(e){e.remove()});var b=document.querySelector(".nav button[data-v=board]");b&&b.click();var h=document.querySelector(".nav button[data-v=hall]");h&&h.click();return 1})()'); await sleep(900);
    await p.ev('(function(){var t=[].filter.call(document.querySelectorAll(".htab button"),function(b){return /Posts/i.test(b.innerText)})[0];t&&t.click();document.querySelectorAll("#layer .modal,.dropsplash").forEach(function(e){e.remove()});return 1})()'); await sleep(700);
    return p.ev('(function(){var b=document.querySelector(".bs-box");var app=document.getElementById("app").innerText;return {card:b?b.className.replace("bs-box ","")+" | "+b.innerText.replace(/\\s+/g," "):null,bossWords:(app.match(/\\bboss\\b/gi)||[]).length,coins:Math.floor(window.__qb.x().S.coins)}})()'); };
  const fake = (p, L) => p.ev(`(function(){var f=window.__qbBoss.fake(${JSON.stringify(L)});return f?{hp:f.hp,dmg:f.dmg,left:f.left,won:f.won,dow:f.dow,act:f.act,fighters:f.fighters,mine:f.mine,top:f.top}:null})()`);
  const four = (bd) => ['a', 'b', 'c', 'd'].map((id, i) => ({ id: 'u_' + id, name: ['Ana', 'Bo', 'Cy', 'Di'][i], pd: LASTWK, bw: '2026-11-16', bd: bd[i] || 0 }));
  const me = (p, pd, xp) => p.ev(`(function(){var x=window.__qb.x(),S=x.S,B=window.__qbBoss.state();B.pd=${JSON.stringify(pd)};S.done=${xp ? `{qa_boss:${xp}}` : '{}'};window.__qbBoss.tick();window.__qbBoss.keep();x.persist();x.render();return {pd:B.pd.slice(-5),w:B.w,d:B.d}})()`);
  // ---- 1-5 on one player (Monday 11-16 to Saturday 11-21)
  let pg = await boot(br, { base: BASE }); await E(pg, 'W.closeAll()'); await E(pg, 'W.lvl(10)');
  log('clock', await setup(pg, '2026-11-16'), '| week', await pg.ev('window.__qbBoss.week()'), 'dow', await pg.ev('window.__qbBoss.dow()'));
  log('me', await me(pg, LASTWK, 0));
  log('1. 3 others active + me (4):', await fake(pg, four([]).slice(0, 3)), await hall(pg));
  log('2. 4 others active + me (5):', await fake(pg, four([])), await hall(pg));
  log('3. my quest XP today 900 (cap 600):', await me(pg, LASTWK, 900), await fake(pg, four([])), await hall(pg));
  for (const [tag, bd] of [['p75', [800]], ['p50', [800, 800]], ['p25', [800, 800, 1000]]]) log(`4. others hit ${bd.join('+')}:`, await fake(pg, four(bd)), await hall(pg));
  const c0 = await pg.ev('Math.floor(window.__qb.x().S.coins)');
  log('5. win (Ana 2000, Bo 1000, Cy 300, Di 100; me 600 = 3rd):', await fake(pg, four([2000, 1000, 300, 100])), await hall(pg));
  await pg.ev('(function(){window.__qbBoss.keep();window.__qb.x().render();return 1})()'); await sleep(600);
  const L = await pg.ev(`(async function(){var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})},S=window.__qb.x().S,pops=[];var ob=new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.classList&&n.classList.contains('pop'))pops.push(n.textContent)})})});ob.observe(document.getElementById('layer'),{childList:true});
    document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});var b=document.querySelector('.ibbtn');b&&b.click();await w(700);var rows=[].map.call(document.querySelectorAll('#layer .ibrow'),function(r){return r.dataset.id+' "'+r.innerText.replace(/\\s+/g,' ').slice(0,50)+'"'});
    var r=[].filter.call(document.querySelectorAll('#layer .ibrow'),function(x){return /^boss-/.test(x.dataset.id)})[0];if(!r){ob.disconnect();return {rows:rows,err:'no boss letter'}}r.click();await w(700);var m=document.querySelector('#layer .modal');var body=m?m.innerText.replace(/\\s+/g,' ').slice(0,260):'';
    var c0=S.coins,cl=document.querySelector('#layer [data-ib=claim]');cl&&cl.click();await w(1500);var paid=S.coins-c0;var c1=S.coins;var cl2=document.querySelector('#layer [data-ib=claim]');cl2&&cl2.click();await w(1200);
    ob.disconnect();document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});return {rows:rows,body:body,paid:Math.round(paid),again:Math.round(S.coins-c1),pops:pops,got:JSON.stringify(window.__qbBoss.state().got||{})}})()`, 60000);
  log('   the letter:', L);
  log('   world doc:', await pg.ev('(function(){var d=JSON.parse(localStorage.getItem("qbsbx:worlds/sandbox")||"null");return d?{pd:(d.pd||[]).slice(-4),bw:d.bw,bd:d.bd}:null})()'));
  log('   page errors', pg.errs.length, pg.errs.slice(0, 2)); await pg.close();
  // ---- 5b. a player who didn't hit it: no letter
  pg = await boot(br, { base: BASE }); await E(pg, 'W.closeAll()'); await E(pg, 'W.lvl(10)'); await setup(pg, '2026-11-18'); await me(pg, LASTWK, 0);
  log('5b. no damage of my own, the others win:', await fake(pg, four([2000, 1000, 600, 500])), await hall(pg));
  await pg.ev('(function(){window.__qbBoss.keep();return 1})()');
  log('    letters:', await pg.ev('(async function(){var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})};var b=document.querySelector(".ibbtn");b&&b.click();await w(700);var r=[].map.call(document.querySelectorAll("#layer .ibrow"),function(x){return x.dataset.id});document.querySelectorAll("#layer .modal").forEach(function(e){e.remove()});return r})()'));
  await pg.close();
  // ---- 6. a Sunday loss, the next Monday without a boss, then a later win
  pg = await boot(br, { base: BASE }); await E(pg, 'W.closeAll()'); await E(pg, 'W.lvl(10)'); await setup(pg, '2026-11-20'); await me(pg, LASTWK, 300);
  await fake(pg, four([500, 500])); const coinsBefore = await pg.ev('Math.floor(window.__qb.x().S.coins)');
  await setup(pg, '2026-11-22'); await pg.ev('(function(){window.__qbBoss.tick();window.__qbBoss.keep();return 1})()');
  log('6. Sunday 11-22, HP left:', await fake(pg, four([500, 500])), await hall(pg), '| lost', await pg.ev('window.__qbBoss.state().lost'), '| coins before', coinsBefore);
  await setup(pg, '2026-11-23'); await pg.ev('(function(){window.__qbBoss.tick();window.__qbBoss.keep();return 1})()');
  log('   Monday 11-23, nobody else active:', await fake(pg, []), await hall(pg));
  const NEXT = ['2026-11-24', '2026-11-25', '2026-11-26'];
  await setup(pg, '2026-11-30'); await me(pg, ['2026-11-23', '2026-11-24', '2026-11-25'], 400);
  const five = ['a', 'b', 'c', 'd'].map((id, i) => ({ id: 'u_' + id, name: 'P' + i, pd: NEXT, bw: '2026-11-30', bd: [2000, 1000, 600, 400][i] }));
  log('   Monday 11-30, a new boss beaten:', await fake(pg, five), await hall(pg));
  await pg.ev('(function(){window.__qbBoss.keep();return 1})()'); log('   lost now:', await pg.ev('window.__qbBoss.state().lost'), '| won', await pg.ev('window.__qbBoss.state().won'));
  log('page errors', pg.errs.length, pg.errs.slice(0, 2));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
