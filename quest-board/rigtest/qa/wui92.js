// w-ui92 (v0.92): W58 the Board shortest first with "~N min"; W59 the quest toast at the top (under the coins and envelope, never over
// them; 3 s then a 1 s fade; a second one replaces the first; taps go through); W60 the "+" / lot window: ready = name, line, price and Buy
// at the room card's price (coins drop by exactly that, the room appears, the building view stays); not ready = "? ? ?" and the progress
// lines only, no room name. A fresh level-10 player.
//   BASE=<build> CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/wui92.js
const { browser, sleep, boot, E, PAGE } = require('./wfocus_lib.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8814';
const log = (...a) => console.log(a.map((v) => (typeof v === 'string' ? v : JSON.stringify(v))).join(' '));
(async () => {
  const br = await browser(); const pg = await boot(br, { base: BASE }); await E(pg, 'W.closeAll()'); await E(pg, 'W.lvl(10)');
  // W58: quests of different sizes, no mins (as from an older save), in one category, then a reload
  await pg.ev(`(function(){var x=window.__qb.x(),S=x.S;S.quests=S.quests.filter(function(q){return q.cl!=="home"});
    [["qa_m","Move apartment boxes",75],["qa_d","Deep clean the kitchen",50],["qa_l","Do the laundry",25],["qa_e","Reply to email from Sam",5],["qa_g","Gym session",25],["qa_v","Vacuum 20 min",10]].forEach(function(a){S.quests.push({id:a[0],name:a[1],xp:a[2],stat:"discipline",cl:"home",rep:"daily"})});x.persist();return 1})()`);
  await pg.go(BASE + '/'); await pg.wait('!!(window.__qb && document.querySelector(".nav button[data-v=board]"))', 120000); await sleep(2500); await pg.ev(PAGE); await E(pg, 'W.closeAll()');
  const order = await pg.ev(`(function(){var S=window.__qb.x().S;var ids=["qa_m","qa_d","qa_l","qa_e","qa_g","qa_v"];var cards=[].map.call(document.querySelectorAll('#app [data-id]'),function(c){return c.dataset.id}).filter(function(id){return ids.indexOf(id)>=0});
    return {order:cards.map(function(id){var q=S.quests.filter(function(q){return q.id===id})[0];var el=document.querySelector('#app [data-id="'+id+'"] .qmin');return q.name+' '+(el?el.innerText:'(no ~min)')+' ['+q.mins+']'}),kept:ids.every(function(id){return S.quests.filter(function(q){return q.id===id})[0].mins>0})}})()`);
  log('W58 home quests on the Board, top to bottom:', order.order, '| mins kept on the quests:', order.kept);
  // W59: tap two quests, 1 s apart
  const T = await pg.ev(`(async function(){var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})},out={};var tap=function(id){var b=document.querySelector('#app [data-id="'+id+'"] .box')||document.querySelector('#app [data-id="'+id+'"]');var r=b.getBoundingClientRect();b.click()};
    var hdr=function(){return [].map.call(document.querySelectorAll('#app .coinlive,#app .ibbtn'),function(e){var r=e.getBoundingClientRect();return {t:Math.round(r.top),b:Math.round(r.bottom),l:Math.round(r.left),r:Math.round(r.right)}})};
    window.__qb.x().toggle('qa_e');await w(500);var t=document.querySelectorAll('#layer .qtoast');var el=t[0];var r=el?el.getBoundingClientRect():null;
    out.first={n:t.length,text:el?el.innerText.replace(/\\s+/g,' '):null,top:r&&Math.round(r.top),bottom:r&&Math.round(r.bottom),pe:el?getComputedStyle(el).pointerEvents:null,header:hdr()};
    await w(1000);window.__qb.x().toggle('qa_v');await w(400);t=document.querySelectorAll('#layer .qtoast');out.second={n:t.length,text:t[0]?t[0].innerText.replace(/\\s+/g,' '):null};
    await w(2800);out.at3s={out:!!(document.querySelector('#layer .qtoast')||{classList:{contains:function(){return false}}}).classList.contains('out')};await w(1100);out.at4s={left:document.querySelectorAll('#layer .qtoast').length};
    var pops=[].map.call(document.querySelectorAll('#layer .pop'),function(p){return p.innerText});out.otherPops=pops.slice(0,3);return out})()`, 30000);
  log('W59 toast:', T);
  const over = (T.first.header || []).some((h) => T.first.top < h.b && T.first.bottom > h.t);
  log('   toast overlaps the coins/envelope:', over);
  // W60: the building view's "+" and lot markers
  await E(pg, 'W.closeAll()');
  const setup = await pg.ev(`(function(){var x=window.__qb.x(),S=x.S;S.coins=5e6;['closet','patio'].forEach(function(t){window.__qbRooms.open(t,1)});var b=S.base.slots[0];(x.ADDONS.bedroom||[]).forEach(function(a){if(!(a[3]||{}).retired&&!(a[3]||{}).opens)b.a[a[0]]=1});x.persist();x.render();return S.base.slots.filter(Boolean).map(function(r){return r.t})})()`);
  await pg.ev('(function(){var b=document.querySelector(".nav button[data-v=hideout]");b&&b.click();return 1})()'); await sleep(3000); await E(pg, 'W.closeAll()');
  await pg.ev('(function(){var b=document.querySelector("[data-act=bldgo][data-v=\\"0\\"]");if(b)b.dispatchEvent(new MouseEvent("click",{bubbles:true}));return 1})()'); await sleep(2500); await E(pg, 'W.closeAll()');
  const marks = await pg.ev('[].map.call(document.querySelectorAll("[data-lf^=\\"open:\\"],[data-lf^=\\"lot:\\"]"),function(e){return e.getAttribute("data-lf")})');
  log('W60 rooms', setup, '| markers in the building view:', marks);
  const tapLf = (lf) => pg.ev(`(async function(){var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})},g=document.querySelector('[data-lf="${lf}"]');if(!g)return null;var r=g.getBoundingClientRect();
    ['pointerdown','pointerup','click'].forEach(function(t){g.dispatchEvent(new MouseEvent(t,{bubbles:true,clientX:r.left+r.width/2,clientY:r.top+r.height/2}))});await w(900);var m=document.querySelector('#layer .modal');
    return m?{text:m.innerText.replace(/\\s+/g,' ').slice(0,200),buy:(m.querySelector('[data-act=nxbuy]')||{innerText:''}).innerText.replace(/\\s+/g,' '),see:!!m.querySelector('[data-act=nxsee]')}:null})()`);
  for (const lf of marks) {
    const w = await tapLf(lf); log(`   ${lf}:`, w);
    if (w && w.buy && /Buy/i.test(w.buy)) {
      const q = lf.split(':'); const want = await pg.ev(`(function(){var x=window.__qb.x(),S=x.S,r=S.base.slots[${+q[1]}];var a=(x.ADDONS[r.t]||[]).filter(function(a){return a[0]==="${q[2]}"})[0];return a?a[2]:null})()`);
      const b = await pg.ev(`(async function(){var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})},S=window.__qb.x().S,c0=S.coins,n0=S.base.slots.filter(Boolean).length;var b=document.querySelector('#layer [data-act=nxbuy]');b.click();await w(1500);
        return {paid:c0-S.coins,rooms:S.base.slots.filter(Boolean).map(function(r){return r.t}),windows:[].map.call(document.querySelectorAll('#layer .modal'),function(m){return m.innerText.replace(/\\s+/g,' ').slice(0,60)}),building:!!document.querySelector('[data-act=bldout]')}})()`);
      log(`   bought from the window: paid ${b.paid} (the room card's price ${want}) | rooms ${b.rooms.join(',')} | windows ${JSON.stringify(b.windows)} | still in the building view ${b.building}`);
      break;
    }
  }
  log('page errors', pg.errs.length, pg.errs.slice(0, 2));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
