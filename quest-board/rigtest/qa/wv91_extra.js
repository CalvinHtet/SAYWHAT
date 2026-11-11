// v0.91 candidate, the parts run_rc.sh doesn't cover (BUILDER's 18:18 READY note, items 4, 5, 7, 8, 9):
// A. businesses: the room says "Earns about N coins a day (+X% from upgrades)"; buying a "+N% income" card raises N at once by about
//    the card's "about +M coins a day"; collecting stops at the room's day ("This business has paid all it can today")
// B. price rules per room: looks-only pieces at one flat price and never above the cheapest earner; each list cheapest first (a piece
//    that needs another right after it); the Back Office Safe (r_safe) and the Root Cellar (g_cellar) out of sale
// C. the Wheel every 4 hours: one spin, then "Next spin in 3h 59m" and no second spin; after 4 h it spins again; the prize labels
// D. the System: the Lair's Command Console screen says UPGRADES and opens the Shop on Upgrades; the cascade starts with 3 cards and
//    the next tier appears under the one bought, each tier dearer; no level text
// E. the level-up window 2-30: no stat bars, no counts, no "UI upgrade"; "Contraband Sweets" (15) only once the Dessert Parlor exists
//   BASE=<candidate sandbox> CHROME_PORT=9376 bash tools/windows/node.sh rigtest/qa/wv91_extra.js
const fs = require('fs');
const SEEDS = require('path').join(__dirname, 'seeds') + '/';
const { browser, sleep, boot, E } = require('./wfocus_lib.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8814', OUT = process.env.OUT || require('os').tmpdir() + '/qa-out/wv91/';
fs.mkdirSync(OUT, { recursive: true });
const log = (...a) => console.log(a.map((v) => (typeof v === 'string' ? v : JSON.stringify(v))).join(' '));
const clr = '(function(){document.querySelectorAll(".dropsplash .dsx").forEach(function(b){b.click()});document.querySelectorAll("#layer .modal").forEach(function(e){e.remove()});return 1})()';
(async () => {
  const br = await browser();
  let pg = await boot(br, { base: BASE }); await pg.ev(clr);
  await E(pg, 'W.lvl(20)'); await pg.ev(`(function(){var x=window.__qb.x(),S=x.S;S.coins=5e6;['closet','patio','gameroom','lair','garden','restaurant','skybar','rooftop','boba','dessert','mall','theater','auditorium','arcade'].forEach(function(t){window.__qbRooms.open(t,1)});x.persist();x.render();return 1})()`);
  await sleep(800); await pg.ev(clr);
  // A
  const roomWin = (t) => pg.ev(`(async function(){var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})},S=window.__qb.x().S,i=S.base.slots.findIndex(function(r){return r&&r.t==='${t}'});
    document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});window.__qb.roomModal(i);await w(600);var m=document.querySelector('#layer .modal');var t=m?m.innerText:'';var day=(t.match(/Earns about ([\\d,]+) coins a day( \\(\\+\\d+% from upgrades\\))?/)||[]);
      var card=[].filter.call(m.querySelectorAll('.addon'),function(e){return /Earns \\+\\d+% here, about \\+[\\d,]+ coins a day/.test(e.innerText)&&e.querySelector('[data-act=raddon]')})[0];
      return {day:day[0]||null,n:day[1]?+day[1].replace(/,/g,''):null,card:card?{id:card.querySelector('[data-act=raddon]').dataset.id,t:(card.innerText.match(/Earns \\+\\d+% here, about \\+([\\d,]+) coins a day/)||[])[0],m:+(card.innerText.match(/about \\+([\\d,]+) coins a day/)||[0,'0'])[1].replace(/,/g,'')}:null}})()`);
  for (const t of ['garden', 'restaurant', 'boba', 'arcade']) {
    const a = await roomWin(t);
    if (!a.card) { log(`A. ${t}: "${a.day}" | no "+N% income" card shown`); continue; }
    await pg.ev(`(function(){var b=document.querySelector('#layer [data-act=raddon][data-id="${a.card.id}"]');b&&b.click();return 1})()`); await sleep(900); await pg.ev(clr);
    const b = await roomWin(t);
    log(`A. ${t}: "${a.day}" -> bought ${a.card.id} ("${a.card.t}") -> "${b.day}" | rose by ${b.n - a.n} (card said +${a.card.m})${b.n > a.n ? '' : '  <-- DID NOT RISE'}`);
  }
  // the day's cap: the Restaurant holds far more than a day; Collect until it says it has paid all it can
  const cap = await pg.ev(`(async function(){var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})},x=window.__qb.x(),S=x.S,i=S.base.slots.findIndex(function(r){return r&&r.t==='restaurant'}),pops=[];
    var ob=new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.classList&&n.classList.contains('pop'))pops.push(n.textContent)})})});ob.observe(document.getElementById('layer'),{childList:true});
    var c0=S.coins,got=[];for(var k=0;k<4;k++){S.base.slots[i].pend=99999;document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});window.__qb.roomModal(i);await w(500);var b=document.querySelector('#layer [data-act=rcollect]');if(!b){got.push('no Collect button');break}var c=S.coins;b.click();await w(700);got.push(Math.round(S.coins-c))}
    ob.disconnect();document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});return {got:got,pops:pops.slice(0,6)}})()`);
  log('A. Restaurant Collect with far more than a day waiting, 4 taps: coins', cap.got, '| pops', cap.pops);
  // B
  const B = await pg.ev(`(function(){var x=window.__qb.x(),A=x.ADDONS,T=x.ROOMT,o=[];Object.keys(A).forEach(function(k){var L=(A[k]||[]).filter(function(a){return !(a[3]&&a[3].retired)&&+a[2]>0}),t=T[k]||{},biz=!!(t.coin||t.food);if(!L.length||!biz)return;
      var earn=L.filter(function(a){var e=a[3]||{};return +e.p>0&&!e.opens}),looks=L.filter(function(a){var e=a[3]||{};return !(+e.p>0)&&!e.xp&&!e.opens&&!e.fixed&&e.g!=='Expansion'&&!e.cap&&!e.shelf&&!e.fresh&&!e.dish});
      var minE=earn.reduce(function(m,a){return Math.min(m,+a[2])},Infinity),lp={};looks.forEach(function(a){lp[a[2]]=(lp[a[2]]||0)+1});var over=looks.filter(function(a){return +a[2]>minE}).map(function(a){return a[0]+' '+a[2]});
      var inv=[];for(var i=1;i<L.length;i++){var p=L[i-1],q=L[i];if(+q[2]<+p[2]){var req=window.__qb.x().ADDONS&&q;inv.push(p[0]+' '+p[2]+' > '+q[0]+' '+q[2])}}
      var noEarnLine=earn.filter(function(a){return !/Earns \\+\\d+% here/.test(a[4]||'')}).map(function(a){return a[0]});
      o.push({room:k,looks:looks.length,looksPrices:Object.keys(lp).join('/'),cheapestEarner:minE,looksAboveIt:over,orderInversions:inv,earnersWithoutLine:noEarnLine})});
    var ret=[];Object.keys(A).forEach(function(k){(A[k]||[]).forEach(function(a){if(a[0]==='r_safe'||a[0]==='g_cellar')ret.push(k+'.'+a[0]+' retired '+!!(a[3]&&a[3].retired))})});return {rooms:o,retired:ret}})()`);
  B.rooms.forEach((r) => log(`B. ${r.room}: ${r.looks} looks-only at ${r.looksPrices || '-'}, cheapest earner ${r.cheapestEarner}${r.looksAboveIt.length ? ' | ABOVE IT: ' + r.looksAboveIt.join(', ') : ''}${r.orderInversions.length ? ' | order: ' + r.orderInversions.slice(0, 4).join('; ') + (r.orderInversions.length > 4 ? ' +' + (r.orderInversions.length - 4) : '') : ' | cheapest first'}${r.earnersWithoutLine.length ? ' | no Earns line: ' + r.earnersWithoutLine.join(',') : ''}`));
  log('B.', B.retired.join(' | '));
  await pg.close();
  // C: the Wheel (level 8, a fresh page)
  pg = await boot(br, { base: BASE }); await pg.ev(clr); await E(pg, 'W.lvl(8)'); await sleep(500); await pg.ev(clr);
  const spinOnce = () => pg.ev(`(async function(){var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})},S=window.__qb.x().S;document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});
    var nb=document.querySelector('.nav button[data-v=wheel]');nb&&nb.click();await w(700);document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});var sb=document.querySelector('[data-act=spin]');
    var before={btn:sb?sb.innerText.trim():null,disabled:sb?sb.disabled:null,coins:S.coins,res:S.wheelRes};if(sb&&!sb.disabled){sb.click();await w(9000)}document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});
    var sb2=document.querySelector('[data-act=spin]');return {before:before,after:{btn:sb2?sb2.innerText.trim():null,disabled:sb2?sb2.disabled:null,res:S.wheelRes,paid:S.coins-before.coins},line:((document.getElementById('app').innerText.match(/One free spin[^.]*\\./)||[''])[0]),
      labels:[].map.call(document.querySelectorAll('svg text'),function(t){return t.textContent}).filter(function(s){return /\\d/.test(s)}).slice(0,10)}})()`, 60000);
  const s1 = await spinOnce(); log('C. first spin:', s1);
  const s2 = await spinOnce(); log('C. right after, again:', s2.before, '-> paid', s2.after.paid);
  await pg.ev('(function(){window.__qbShift=(window.__qbShift||0)+4*36e5+60000;window.__qb.x().persist();window.__qb.x().render();return 1})()');
  const s3 = await spinOnce(); log('C. 4 hours later:', s3.before, '->', s3.after);
  await pg.close();
  // D: the System (the Lair with its Command Console)
  pg = await boot(br, { base: BASE }); await pg.ev(clr); await E(pg, 'W.lvl(12)');
  const D0 = await pg.ev(`(function(){var x=window.__qb.x(),S=x.S;S.coins=5e6;['closet','lair'].forEach(function(t){window.__qbRooms.open(t,1)});x.persist();x.render();
    return {tabsBefore:'(Shop read below)',console:(x.ADDONS.lair||[]).filter(function(a){return a[0]==='lr_console'}).map(function(a){return a[1]+' '+a[2]})}})()`);
  await pg.ev('(function(){var b=document.querySelector(".nav button[data-v=shop]");b&&b.click();return 1})()'); await sleep(1000); await pg.ev(clr);
  const tabs0 = await pg.ev('[].map.call(document.querySelectorAll(".qs-tabs .qs-tab"),function(b){return b.innerText.trim()})');
  const buyC = await pg.ev(`(async function(){var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})},S=window.__qb.x().S,i=S.base.slots.findIndex(function(r){return r&&r.t==='lair'});
    for(var k=0;k<12;k++){document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});window.__qb.roomModal(i);await w(500);var b=document.querySelector('#layer [data-act=raddon][data-id="lr_console"]');if(b){b.click();await w(1200);return 'bought lr_console after '+k+' other Lair pieces'}
      var f=[].filter.call(document.querySelectorAll('#layer [data-act=raddon]'),function(x){return !x.classList.contains('ghost')})[0];if(!f)return 'no buyable card';f.click();await w(700)}return 'lr_console card not reached'})()`, 90000);
  await pg.ev(clr);
  const scr = await pg.ev(`(async function(){var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})},S=window.__qb.x().S,i=S.base.slots.findIndex(function(r){return r&&r.t==='lair'});window.__qb.roomModal(i);await w(1200);
    var g=document.querySelector('#layer .lrsys[data-sys=open]');var t=g?g.textContent:null;if(g)g.dispatchEvent(new MouseEvent('click',{bubbles:true}));await w(1000);
    var tabs=[].map.call(document.querySelectorAll('.qs-tabs .qs-tab'),function(b){return b.innerText.trim()+(b.classList.contains('on')?' (on)':'')});
    var cards=[].map.call(document.querySelectorAll('#app .shopgrid .item, #app .qs-card'),function(c){return c.innerText.replace(/\\s+/g,' ').slice(0,60)});return {screen:t,tabs:tabs,cards:cards}})()`);
  await pg.shot(OUT + 'system_upgrades.png');
  log('D. Lair console', D0.console, '|', buyC, '| Shop tabs before it:', tabs0);
  log('D. the Lair screen:', scr.screen, '| tabs after the tap:', scr.tabs); scr.cards.forEach((c) => log('   card: ' + c));
  const tier = await pg.ev(`(async function(){var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})},b=[].filter.call(document.querySelectorAll('#app [data-act=buy],#app [data-act=sbuy],#app button'),function(x){return /Merchant Seal I\\b|Merchant Seal$/.test((x.closest('.item,.qs-card')||{innerText:''}).innerText)&&/buy|\\d/i.test(x.innerText)})[0];
    if(!b)return 'no Merchant Seal I buy button';b.click();await w(1200);var c=document.querySelector('#layer [data-act=qsconfirm],#layer .btn');if(c&&/confirm|buy/i.test(c.innerText))c.click();await w(1200);document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});
    return [].map.call(document.querySelectorAll('#app .shopgrid .item, #app .qs-card'),function(c){return c.innerText.replace(/\\s+/g,' ').slice(0,60)})})()`);
  log('D. after buying Merchant Seal I:', tier);
  log('   page errors', pg.errs.length, pg.errs.slice(0, 2)); await pg.close();
  // E: level-up windows 2-30 without the Dessert Parlor, then level 15 with it
  pg = await boot(br, { base: BASE }); await pg.ev(clr);
  const lv = await pg.ev(`(function(){var x=window.__qb.x(),S=x.S,out=[];for(var L=2;L<=30;L++){S.xp=x.cum(L);S.gates=S.gates||[];for(var g=0;g<40&&x.gated()!=null;g++)S.gates.push(x.gated());document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});
      try{window.qbDbg.levelUp(L,null,L-1)}catch(e){out.push(L+': ERR '+e.message);continue}var t=[].map.call(document.querySelectorAll('#layer .modal'),function(m){return m.innerText.replace(/\\s+/g,' ')}).join(' || ');
      var bad=(t.match(/Creativity|Discipline|Fitness|Productivity|Social|UI upgrade|New in the Shop|Contraband Sweets|\\d+ new |\\d+ (items|upgrades)/gi)||[]);if(bad.length||L===15||L===10)out.push(L+': '+(bad.length?'FLAG '+JSON.stringify(bad)+' ':'')+t.slice(0,170))}
    document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});return out})()`);
  lv.forEach((l) => log('E. level ' + l));
  const l15 = await pg.ev(`(function(){var x=window.__qb.x();['garden','restaurant','skybar','boba','dessert'].forEach(function(t){window.__qbRooms.open(t,1)});document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});window.qbDbg.levelUp(15,null,14);
    var t=[].map.call(document.querySelectorAll('#layer .modal'),function(m){return m.innerText.replace(/\\s+/g,' ')}).join(' || ');document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});return t.slice(0,200)})()`);
  log('E. level 15 with the Dessert Parlor:', l15);
  log('page errors', pg.errs.length, pg.errs.slice(0, 2));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
