// After a price fix: open every room's window (roomModal) and the main screens on an advanced save, and look for "NaN" or "undefined"
// in what the player reads.   BASE=<build> bash tools/windows/node.sh rigtest/qa/nanscan.js
const fs = require('fs');
const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8824';
const SEED = JSON.parse(fs.readFileSync('C:/Users/clvh/qa-wt/out/seed_adv2.json', 'utf8'));
(async () => {
  const br = await browser(); const pg = await br.page({ fresh: true });
  // a player with every room built and nothing bought in them (the Test pill's Unlock everything), so every window lists prices
  await pg.go(BASE + "/"); await pg.wait("!!(window.__qb && window.__qbRooms && document.querySelector('#app'))", 120000); await sleep(1500);
  await pg.ev("(function(){var x=window.__qb.x(),S=x.S;S.created=true;S.char=window.__qb.fixChar({name:'Scan',sex:'m'});S.xp=10;S.welcomed=1;x.persist();x.render();window.__qbRooms.unlockAll();return 1})()"); await sleep(2500);
  const r = await pg.ev(`(async function(){var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})},x=window.__qb.x(),S=x.S,out=[],bad=/NaN|undefined/;
    var clear=function(){document.querySelectorAll('.dropsplash .dsx').forEach(function(b){b.click()});document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()})};
    for(var v of ['board','train','shop','hall','hideout','trophy','wheel','away']){clear();var b=document.querySelector('.nav button[data-v="'+v+'"]');if(b)b.click();await w(900);var t=document.getElementById('app').innerText;var m=t.match(/.{0,30}(NaN|undefined).{0,20}/g);out.push(v+': '+(m?m.slice(0,3).join(' | '):'clean'))}
    var rooms=0,dirty=[];for(var i=0;i<S.base.slots.length;i++){clear();try{window.__qb.roomModal(i)}catch(e){dirty.push(S.base.slots[i].t+' threw '+e.message);continue}await w(450);var m=document.querySelector('#layer .modal');rooms++;
      if(m&&bad.test(m.innerText)){dirty.push(S.base.slots[i].t+': '+(m.innerText.match(/.{0,30}(NaN|undefined).{0,20}/)||[''])[0])}}
    clear();return {screens:out,rooms:rooms,dirtyRooms:dirty}})()`, 180000);
  console.log(JSON.stringify(r, null, 1)); console.log('page errors', pg.errs.length, pg.errs.slice(0, 3));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
