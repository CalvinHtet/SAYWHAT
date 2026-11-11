// Cal's dead end (LEAD 16:45) and the story order (LEAD 16:47): level 14, the Restaurant looking Noir, and the Restaurant window's last card "? ? ? / Level 14 of 14 /
// Something else opens first / Not yet". A level-14 sandbox save with the Loft, the Garden and the Restaurant; the Restaurant window's
// mystery cards and which room each opens, ECON.stepLv, every story step's gate and triggers (__qbGoals.steps), and whether the
// Lock and Key scene fires after r_noir: same game day as the last story step, and the next day.
//   BASE=http://127.0.0.1:8817 CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/deadend14.js
const fs = require('fs');
const SEEDS = require('path').join(__dirname, 'seeds') + '/';
const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8817', OUT = process.env.OUT || require('os').tmpdir() + '/qa-out/deadend14/';
fs.mkdirSync(OUT, { recursive: true });
const log = (...a) => console.log(a.map((v) => (typeof v === 'string' ? v : JSON.stringify(v))).join(' '));
(async () => {
  const br = await browser(); const pg = await br.page({ fresh: true });
  // the level-18 v0.90 save, reset by v0.91 to a bare Bedroom, then rebuilt through the story to the Restaurant at level 14
  const seed = JSON.parse(fs.readFileSync(SEEDS + 'v90_mid.json', 'utf8'));
  await pg.go(BASE + '/version.json'); await pg.ev(`(function(d){localStorage.clear();Object.keys(d).forEach(function(k){localStorage.setItem(k,d[k])});return 1})(${JSON.stringify(seed)})`);
  await pg.go(BASE + '/'); await pg.wait('!!(window.__qb && window.__qb.x().S.reset91 && window.__qbGoals && document.querySelector(".nav button[data-v=board]"))', 120000); await sleep(2500);
  const clear = () => pg.ev('(function(){document.querySelectorAll(".dropsplash .dsx").forEach(function(b){b.click()});document.querySelectorAll("#layer .modal").forEach(function(e){e.remove()});return 1})()');
  for (let k = 0; k < 5; k++) { await clear(); await sleep(300); }
  log('ECON.stepLv', await pg.ev('JSON.stringify(window.__qbEcon.ECON.stepLv)'), '| slotFree', await pg.ev('JSON.stringify(window.__qbEcon.ECON.slotFree)'), '| oneSlotBelow', await pg.ev('window.__qbEcon.ECON.oneSlotBelow'));
  // level 14 (xp and gates), the Loft rooms, the Garden, the Restaurant through the story, the Restaurant's upgrades up to r_x2
  const setup = await pg.ev(`(function(){var x=window.__qb.x(),S=x.S;S.xp=x.cum(14);S.gates=S.gates||[];for(var g=0;g<40&&x.gated()!=null;g++)S.gates.push(x.gated());
    ['closet','patio','gameroom','garden','restaurant'].forEach(function(t){window.__qbRooms.open(t,1)});
    var r=S.base.slots.filter(function(q){return q&&q.t==='restaurant'})[0],A=x.ADDONS.restaurant||[],n=0;
    A.forEach(function(a){var e=a[3]||{};if(e.opens||e.retired||a[0]==='r_noir')return;if((e.lv||0)<=14){r.a[a[0]]=1;n++}});
    S.coins=33880;var o=window.__qbStory.state();o.stepDay=x.S.reset91.d;x.persist();x.render();
    return {lvl:x.effLvl(),rooms:S.base.slots.filter(Boolean).map(function(q){return q.t+'('+Object.keys(q.a||{}).length+')'}),restUps:n,x2:!!r.a.r_x2,noir:!!r.a.r_noir,story:{done:Object.keys(o.done),offer:Object.keys(o.offer),stepDay:o.stepDay}}})()`);
  log('setup:', setup);
  const cards = async (tag) => {
    await clear();
    const r = await pg.ev(`(function(){var x=window.__qb.x(),S=x.S,i=S.base.slots.findIndex(function(q){return q&&q.t==='restaurant'});window.__qb.roomModal(i);
      var m=document.querySelector('#layer .modal');var all=[].map.call(m.querySelectorAll('.addon'),function(e){return e.innerText.replace(/\\s+/g,' ')});
      return {mystery:all.filter(function(t){return /\\? \\? \\?/.test(t)}),last:all.slice(-3)}})()`);
    await pg.shot(OUT + `restaurant_${tag}.png`);
    log(`[${tag}] Restaurant window, mystery cards:`, r.mystery); log(`[${tag}] its last 3 cards:`, r.last);
    // which room each opener card in the Restaurant opens, and the story steps
    const s = await pg.ev(`(function(){var x=window.__qb.x(),A=x.ADDONS.restaurant||[],r=x.S.base.slots.filter(function(q){return q&&q.t==='restaurant'})[0];
      var op=A.filter(function(a){return (a[3]||{}).opens}).map(function(a){return a[0]+' opens '+a[3].opens+(r.a[a[0]]?' (bought)':'')+' allows '+window.__qbStory.allows(a[3].opens)});
      var st=window.__qbGoals.steps().filter(function(q){return !q.open}).map(function(q){return q.id+'->'+q.room+' gate '+q.gate+' lv '+q.lv+' ['+q.tr.join(' / ')+']'});
      return {openers:op,steps:st,next:window.__qbStory.state().stepDay}})()`);
    log(`[${tag}] Restaurant openers:`, s.openers); log(`[${tag}] closed story steps:`, s.steps); log(`[${tag}] stepDay`, s.next);
  };
  await cards('A no Noir');
  // B: buy Noir through its card (needs r_x2 and, since w-unlock 22963df, ECON.noirServed dishes served: S.base.served)
  await clear();
  log('B. Noir card before the dishes:', await pg.ev(`(function(){var x=window.__qb.x(),S=x.S,i=S.base.slots.findIndex(function(q){return q&&q.t==='restaurant'});window.__qb.roomModal(i);
    var c=[].filter.call(document.querySelectorAll('#layer .addon'),function(e){return /Noir/.test(e.innerText)||e.querySelector('[data-id="r_noir"]')})[0];var t=c?c.innerText.replace(/\\s+/g,' '):'(no Noir card)';document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});return t})()`));
  await pg.ev('(function(){var x=window.__qb.x(),S=x.S;S.base.served=Math.max(S.base.served||0,(window.__qbEcon.ECON.noirServed||0));x.persist();x.render();return 1})()');
  const b = await pg.ev(`(function(){var x=window.__qb.x(),S=x.S,i=S.base.slots.findIndex(function(q){return q&&q.t==='restaurant'});S.coins=33880;window.__qb.roomModal(i);
    var btn=document.querySelector('#layer [data-act=raddon][data-id="r_noir"]');if(!btn)return 'no r_noir button (served '+S.base.served+')';btn.click();return 'clicked; r_noir now '+!!S.base.slots[i].a.r_noir})()`);
  log('B. buy Noir:', b); await sleep(1500);
  log('B. windows right after Noir:', await pg.ev('[].map.call(document.querySelectorAll("#layer .modal"),function(m){return m.innerText.replace(/\\s+/g," ").slice(0,120)})'));
  await clear();
  await cards('B Noir bought, same day as the last story step');
  await clear(); // the story only plays when no window is open
  await pg.ev('window.__qbStory.check()'); await sleep(1200);
  log('B. story check, same day (no window open):', await pg.ev('(function(){var m=document.querySelector("#layer .modal");return m?m.innerText.replace(/\\s+/g," ").slice(0,200):"no window"})()'));
  await clear();
  await pg.ev('(function(){var o=window.__qbStory.state();o.stepDay="2000-01-01";o.later={};o.lastScene=0;window.__qb.x().persist();return 1})()');
  await pg.ev('window.__qbStory.check()'); await sleep(1200);
  log('C. story check, next game day:', await pg.ev('(function(){var m=document.querySelector("#layer .modal");return m?m.innerText.replace(/\\s+/g," ").slice(0,240):"no window"})()'));
  await pg.shot(OUT + 'lockkey_scene.png'); await clear();
  // D: an old-order save (Boba and Dessert open, Noir bought, no bar): the bar's scene comes at once (the bar is taken out after the
  // test hook opens Boba and Dessert, which opens the story rooms before them too)
  const d = await pg.ev(`(async function(){var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})},x=window.__qb.x(),S=x.S,o=window.__qbStory.state();
    ['boba','dessert'].forEach(function(t){window.__qbRooms.open(t,1)});
    S.base.slots=S.base.slots.map(function(r){return r&&(r.t==='skybar'||r.t==='rooftop')?null:r});['lockkey','rafe','rooftop'].forEach(function(k){delete o.done[k];delete o.offer[k]});if(o.open){delete o.open.skybar;delete o.open.rooftop}
    var r=S.base.slots.filter(function(q){return q&&q.t==='restaurant'})[0];r.a.r_noir=1;delete r.a.r_bar;o.stepDay='';o.later={};o.lastScene=0;x.persist();x.render();
    document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});window.__qbStory.check();await w(1200);var m=document.querySelector('#layer .modal');
    return {rooms:S.base.slots.filter(Boolean).map(function(q){return q.t}).join(','),window:m?m.innerText.replace(/\\s+/g,' ').slice(0,160):'no window'}})()`);
  log('D. Boba + Dessert open, Noir bought, no bar:', d);
  log('page errors', pg.errs.length, pg.errs.slice(0, 3));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
