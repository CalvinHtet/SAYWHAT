// v0.91 candidate follow-ups to wv91_extra.js (real flows): D2. the permanent upgrades' cascade bought through the Shop (View >
// Checkout): after Merchant Seal I, Merchant Seal II shows right under it and costs more; owning a tier is kept after a reload.
// A2. each business: buy cards in list order until a "+N% income" card is bought; the room's "Earns about N coins a day" before/after.
// A3. Collect in the building view with far more than a day waiting: it pays the day, then says the business has paid all it can.
//   BASE=<candidate sandbox> CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/wv91_extra2.js
const { browser, sleep, boot, E, PAGE } = require('./wfocus_lib.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8814';
const log = (...a) => console.log(a.map((v) => (typeof v === 'string' ? v : JSON.stringify(v))).join(' '));
const clr = '(function(){document.querySelectorAll(".dropsplash .dsx").forEach(function(b){b.click()});document.querySelectorAll("#layer .modal").forEach(function(e){e.remove()});return 1})()';
(async () => {
  const br = await browser(); let pg = await boot(br, { base: BASE }); await pg.ev(clr);
  // D2
  await E(pg, 'W.lvl(12)'); await pg.ev(`(function(){var x=window.__qb.x(),S=x.S;S.coins=5e6;['closet','lair'].forEach(function(t){window.__qbRooms.open(t,1)});var r=S.base.slots.filter(function(q){return q&&q.t==='lair'})[0];r.a.lr_console=1;x.persist();x.render();return 1})()`);
  const shop = () => pg.ev(`(async function(){var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})};document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});var b=document.querySelector('.nav button[data-v=shop]');b&&b.click();await w(700);
    var t=[].filter.call(document.querySelectorAll('.qs-tabs .qs-tab'),function(x){return /Upgrades/.test(x.innerText)})[0];if(t)t.click();await w(700);document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});
    return [].map.call(document.querySelectorAll('#app [data-act=qsview]'),function(v){var c=v.closest('.item,.qs-card')||v;return v.dataset.id+' '+c.innerText.replace(/\\s+/g,' ').slice(0,60)})})()`);
  log('D2. Upgrades tab:', await shop());
  for (const id of ['bf_coin1', 'bf_coin2']) {
    const r = await pg.ev(`(async function(){var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})},S=window.__qb.x().S,c0=S.coins;var v=document.querySelector('#app [data-act=qsview][data-id="${id}"]');if(!v)return 'no View for ${id}';v.click();await w(600);
      var b=document.querySelector('#layer [data-act=qsvbuy][data-id="${id}"]');if(!b){var m=document.querySelector('#layer .modal');return 'no Checkout: '+(m?m.innerText.replace(/\\s+/g,' ').slice(0,120):'')}b.click();await w(900);
      var cf=[].filter.call(document.querySelectorAll('#layer button'),function(x){return /confirm|buy/i.test(x.innerText)})[0];if(cf){cf.click();await w(900)}document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});return 'bought ${id}: owned '+!!(S.owned&&S.owned['${id}'])+', paid '+(c0-S.coins)})()`, 30000);
    log('   ' + r); log('   tab now:', await shop()); }
  await pg.go(BASE + '/'); await pg.wait('!!(window.__qb && document.querySelector(".nav button[data-v=board]"))', 120000); await sleep(2500); await pg.ev(PAGE); await pg.ev(clr);
  log('   after a reload: owned', await pg.ev('JSON.stringify(Object.keys(window.__qb.x().S.owned||{}).filter(function(k){return /^bf_/.test(k)}))'), '| tab', await shop());
  log('   page errors', pg.errs.length, pg.errs.slice(0, 2)); await pg.close();
  // A2 + A3
  pg = await boot(br, { base: BASE }); await pg.ev(clr); await E(pg, 'W.lvl(20)');
  await pg.ev(`(function(){var x=window.__qb.x(),S=x.S;S.coins=5e6;['closet','patio','gameroom','garden','restaurant','skybar','rooftop','boba','dessert','mall','arcade'].forEach(function(t){window.__qbRooms.open(t,1)});x.persist();x.render();return 1})()`); await pg.ev(clr);
  for (const t of ['restaurant', 'boba', 'mall', 'arcade']) {
    const r = await pg.ev(`(async function(){var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})},S=window.__qb.x().S,i=S.base.slots.findIndex(function(q){return q&&q.t==='${t}'}),out={buys:0};
      var day=function(){var m=document.querySelector('#layer .modal');var s=(m&&m.innerText.match(/Earns about ([\\d,]+) coins a day[^.]*/))||null;return s?s[0]:null};
      for(var k=0;k<30;k++){document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});window.__qb.roomModal(i);await w(450);var b=[].filter.call(document.querySelectorAll('#layer [data-act=raddon]'),function(x){return !x.classList.contains('ghost')&&!x.disabled})[0];if(!b)break;
        var card=b.closest('.addon').innerText.replace(/\\s+/g,' ');if(/\\+\\d+% income/.test(card)){out.before=day();out.card=(card.match(/Earns \\+\\d+% here[^.]*\\./)||[card.slice(0,80)])[0];b.click();await w(700);document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});window.__qb.roomModal(i);await w(450);out.after=day();break}
        b.click();await w(400);out.buys++}document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});return out})()`, 90000);
    log(`A2. ${t}: ${r.buys} cheaper cards first; "${r.before}" -> bought "${r.card}" -> "${r.after}"`);
  }
  // A3: the Restaurant in its building view, far more than a day waiting
  const c = await pg.ev(`(async function(){var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})},x=window.__qb.x(),S=x.S,i=S.base.slots.findIndex(function(q){return q&&q.t==='restaurant'}),pops=[];
    var ob=new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.classList&&n.classList.contains('pop'))pops.push(n.textContent)})})});ob.observe(document.getElementById('layer'),{childList:true});
    document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});var nb=document.querySelector('.nav button[data-v=hideout]');nb&&nb.click();await w(2500);document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});
    var bg=document.querySelector('[data-act=bldgo][data-v="1"]');if(bg){bg.dispatchEvent(new MouseEvent('click',{bubbles:true}));await w(2500)}document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});
    var got=[];for(var k=0;k<3;k++){S.base.slots[i].pend=99999;x.render();await w(1200);var b=document.querySelector('[data-act=rcollect][data-i="'+i+'"]');if(!b){got.push('no bubble');continue}var c0=S.coins;b.dispatchEvent(new MouseEvent('click',{bubbles:true}));await w(900);got.push(Math.round(S.coins-c0))}
    ob.disconnect();return {got:got,pops:pops.slice(0,6)}})()`, 60000);
  log('A3. Restaurant Collect bubble with 99,999 waiting, 3 taps: coins', c.got, '| pops', c.pops);
  log('page errors', pg.errs.length, pg.errs.slice(0, 2));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
