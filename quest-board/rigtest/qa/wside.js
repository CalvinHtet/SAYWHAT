// w-side (v0.92, W36): story side-quests, photo only, in the sandbox (the photo check is the stand-in: any photo that isn't nearly
// black passes; the hooks are __qbSide.*). A: nobody met -> no card, no offer; spoilers: Mara met but no Restaurant -> no offer. B: an
// offer has "Not now" and a yes, no honor button anywhere (offer, card, photo window, verdicts). C: refused photos (a PNG, a dark
// one, the same image twice). D: Mara -> the Restaurant's day x1.10. Nova -> the piece is owed (no SHOP entry yet). E: Walkies, 5
// different days (not in a row), the same day refused. F: Night watch on the phone's clock: 11:30 pm counts (the stamp on the photo),
// the same night again, 12:10 am, 7:40 pm, 11:59 pm and 12:00 am, a skipped night resets, 3 in a row -> The Night Stair on the Crawls
// list; a crawl in it pays. G: Theo: no friends, a friend who hasn't sent, a friend who named someone else, a friend's photo from
// yesterday, then the real match -> premiere the next game day: the theater x2 and the business limit grows. H: a reload keeps it all.
//   BASE=<sandbox build> CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/wside.js
const { browser, sleep, boot, E } = require('./wfocus_lib.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8815';
const P = []; const ok = (c, s) => { console.log((c ? 'ok   ' : 'BAD  ') + s); if (!c) P.push(s); };
// move the phone's clock to a local date and time (00_clock.js shifts Date)
const at = (y, mo, d, h, mi) => `(function(){var real=Date.now()-(window.__qbShift||0);window.__qbShift=new Date(${y},${mo - 1},${d},${h},${mi}).getTime()-real;window.__qb.x().render();return new Date().toString().slice(0,21)})()`;
// send a photo for a side-quest through the real window and file path; returns the verdict window's text
const snap = (id, o = {}) => `(async function(){var w=function(ms){return new Promise(function(r){setTimeout(r,ms)})};document.querySelectorAll('#layer .modal').forEach(function(m){m.remove()});
  window.__qbSide.ask('${id}');await w(300);var win=document.querySelector('#layer .sdq-ask');var info={ask:win?win.innerText.replace(/\\s+/g,' ').slice(0,420):null,camera:!!(win&&win.querySelector('#sdqf1')),friends:win?[].map.call(win.querySelectorAll('#sdqfr option'),function(o){return o.value}):[]};
  ${o.friend ? `var sel=document.getElementById('sdqfr');if(sel)sel.value='${o.friend}';` : ''}
  if(!info.camera){var st0=window.__qbSide.state();info.dbg={on:st0.on['${id}'],done:st0.done['${id}'],modals:[].map.call(document.querySelectorAll('#layer .modal'),function(m){return m.className+': '+m.innerText.replace(/\\s+/g,' ').slice(0,80)})};return info}
  var c=document.createElement('canvas');c.width=c.height=64;var g=c.getContext('2d');var k=${o.col || 'Math.floor(Math.random()*1e6)'};g.fillStyle=${o.dark ? "'rgb(2,2,2)'" : "'rgb('+(90+k%150)+','+(60+(k>>3)%150)+','+(40+(k>>6)%150)+')'"};g.fillRect(0,0,64,64);g.fillStyle='rgba(255,255,255,.5)';g.fillRect(k%40,k%23,12,12);
  var b=await new Promise(function(r){c.toBlob(r,'${o.png ? 'image/png' : 'image/jpeg'}',.9)});var f=new File([b],'p'+k+'${o.png ? '.png' : '.jpg'}',{type:'${o.png ? 'image/png' : 'image/jpeg'}'});window.__lastFile=f;
  ${o.same ? 'f=window.__prevFile||f;' : ''}window.__prevFile=f;
  await window.__qbSide.file(f);await w(600);var msg=document.getElementById('sdqmsg');info.early=msg?msg.innerText.replace(/\\s+/g,' ').slice(0,140):null;
  for(var i=0;i<30;i++){var ms=[].filter.call(document.querySelectorAll('#layer .modal'),function(m){return !m.querySelector('.sdq-ask')});var v=ms.filter(function(m){return /photo check/i.test(m.innerText)})[0]||ms.filter(function(m){var w=m.querySelector('.sty-who');return w&&w.textContent.indexOf(window.__qbSide.list.filter(function(q){return q.id==='${id}'})[0].who||'@@')>=0})[0]||(('${id}'==='dogs')&&ms.filter(function(m){return m.querySelector('.sty-who')})[0]);if(v)break;await w(200)}
  info.verdict=v?(v.querySelector('.sty-who')?'[the reward scene] '+v.textContent:v.innerText).replace(/\\s+/g,' ').slice(0,300):null;info.stamp=v&&v.querySelector('.sdq-stamp')?v.querySelector('.sdq-stamp').innerText:null;
  info.honor=[].some.call(document.querySelectorAll('#layer .modal button,#app .sdq button'),function(b){return /honou?r|i did it|done without|skip the photo/i.test(b.innerText)});
  var st=window.__qbSide.state();info.done=!!st.done['${id}'];info.nights=window.__qbSide.nights();info.walks=st.walk.length;return info})()`;
const short = (r) => JSON.stringify({ early: r.early || undefined, verdict: r.verdict && r.verdict.slice(0, 150), stamp: r.stamp || undefined, done: r.done, nights: r.nights, walks: r.walks });
(async () => {
  const br = await browser(); const pg = await boot(br, { base: BASE }); await E(pg, 'W.closeAll()'); await E(pg, 'W.lvl(20)');   // under Rafe's first hunt (27) for A
  await pg.ev('(function(){window.__qbSide.wait(300);return 1})()');
  await pg.ev(at(2026, 11, 16, 12, 0));
  // A. nobody met
  let r = await pg.ev(`(function(){var o=window.__qbSide.offer();var m=document.querySelector('#layer [data-act=sdqyes]');return {offer:o,modal:!!m,card:!!document.querySelector('#app .sdq')}})()`);
  ok(!r.offer && !r.modal && !r.card, `A. nobody met: no offer, no Side-quests card ${JSON.stringify(r)}`);
  r = await pg.ev(`(function(){var S=window.__qb.x().S;S.story=S.story||{};S.story.team={mara:1};window.__qb.x().persist();var o=window.__qbSide.offer('mara');return {offer:o,modal:!!document.querySelector('#layer [data-act=sdqyes]')}})()`);
  ok(!r.offer && !r.modal, `A. Mara met but no Restaurant: no offer (no spoiler) ${JSON.stringify(r)}`);
  // set up: level 30, every room, the team, a dog
  await E(pg, 'W.lvl(30)');
  await pg.ev(`(function(){var x=window.__qb.x(),S=x.S;window.__qbRooms.unlockAll();S.story=S.story||{};S.story.team=Object.assign(S.story.team||{},{mara:1,nova:1,theo:1,sable:1});
    var bed=S.base.slots.filter(function(r){return r&&r.t==="bedroom"})[0];if(bed){bed.a=bed.a||{};bed.a.bd_pluto=1}S.coins=1e6;x.persist();x.render();document.querySelectorAll('#layer .modal,.dropsplash,.bsplash').forEach(function(m){m.remove()});return 1})()`);
  await sleep(800); await E(pg, 'W.closeAll()');
  // B. the offers
  for (const id of ['mara', 'nova', 'theo', 'dogs', 'sable']) {
    r = await pg.ev(`(async function(){var w=function(ms){return new Promise(function(r){setTimeout(r,ms)})};document.querySelectorAll('#layer .modal').forEach(function(m){m.remove()});var o=window.__qbSide.offer('${id}');await w(300);var m=document.querySelector('#layer .modal');
      var t=m?m.innerText.replace(/\\s+/g,' '):'',btns=m?[].map.call(m.querySelectorAll('button'),function(b){return b.innerText.trim()}):[];
      ${id === 'mara' ? `var no=m&&m.querySelector('[data-act=sdqno]');if(no){no.click();await w(200)}var later=window.__qbSide.state().later['mara'];var again0=window.__qbSide.offer('mara');window.__qbSide.state().later['mara']=Date.now()-1;var again=window.__qbSide.offer('mara');await w(300);m=document.querySelector('#layer .modal');` : 'var later=null,again=null;'}
      var y=document.querySelector('#layer [data-act=sdqyes][data-v="${id}"]');if(y){y.click();await w(300)}var c=document.querySelector('#app .sdq');
      return {offer:o,text:t.slice(0,150),btns:btns,laterH:later?Math.round((later-Date.now())/36e5):null,again0:typeof again0==='undefined'?null:again0,again:again,on:!!window.__qbSide.state().on['${id}'],card:c?c.innerText.replace(/\\s+/g,' ').slice(0,200):null,
        snapBtn:!!document.querySelector('#app .sdq [data-act=sdqsnap][data-v="${id}"]'),honor:[].some.call(document.querySelectorAll('#app .sdq button,#layer button'),function(b){return /honou?r|i did it/i.test(b.innerText)})}})()`);
    ok(r.offer && r.on && r.snapBtn && !r.honor && r.btns.includes('Not now') && (id !== 'mara' || (r.laterH === 20 && r.again0 === false && r.again)), `B. ${id}: offer "${r.text.slice(0, 90)}" [${r.btns.join(' | ')}] -> on the Board with "Send a photo", no honor button${id === 'mara' ? `; "Not now": asks again in ${r.laterH} h (not offered at once: ${r.again0 === false}), then offered again` : ''}`);
  }
  const card = await pg.ev(`(function(){var c=document.querySelector('#app .sdq');var h=document.querySelector('#app').innerHTML;return {order:h.indexOf('panel sdq')<h.indexOf('panel bty')||h.indexOf('panel bty')<0,text:c?c.innerText.replace(/\\s+/g,' ').slice(0,300):null}})()`);
  ok(card.order, `B. the Side-quests card sits above the bounties: ${card.text}`);
  // C. refused photos
  r = await pg.ev(snap('mara', { png: 1 })); ok(!r.done && /screenshot or a saved image/.test(r.early || ''), `C. a PNG: ${short(r)}`);
  r = await pg.ev(snap('mara', { dark: 1 })); ok(!r.done && /Verification failed/.test(r.verdict || '') && /Nothing was counted/.test(r.verdict || ''), `C. a dark photo: ${short(r)}`);
  // D. Mara: the Restaurant's day
  const ri = await pg.ev('window.__qb.x().S.base.slots.map(function(r,i){return r&&r.t==="restaurant"?i:-1}).filter(function(i){return i>=0})[0]');
  const b0 = await pg.ev(`window.__qbSide.biz(${ri})`);
  r = await pg.ev(snap('mara', { col: 777 })); const b1 = await pg.ev(`window.__qbSide.biz(${ri})`);
  ok(r.done && /the reward scene.*Restaurant earns 10% more/.test(r.verdict || '') && Math.abs(b1 / b0 - 1.1) < 0.01, `D. Mara done: the Restaurant's day ${b0} -> ${b1} (x${(b1 / b0).toFixed(3)}) ${short(r)}`);
  r = await pg.ev(snap('nova', { col: 777, same: 1 })); ok(!r.done && /already used/.test(r.early || ''), `C. the same image again (for Nova): ${short(r)}`);
  r = await pg.ev(snap('nova', { col: 913 })); const owed = await pg.ev('({owned:!!window.__qb.x().S.owned.gx_sq_closet,inShop:window.__qb.x().SHOP.some(function(i){return i[0]==="gx_sq_closet"})})');
  ok(r.done && !owed.owned && !owed.inShop && /lands in your wardrobe when it's finished/.test(r.verdict || ''), `D. Nova done, the piece owed (no SHOP entry yet: ${JSON.stringify(owed)}) ${short(r)}`);
  // E. Walkies: days 16, 16 again, 17, 19, 22, 23
  const walks = [];
  for (const [d, again] of [[16], [16, 1], [17], [19], [22], [23]]) { await pg.ev(at(2026, 11, d, 14, 0)); r = await pg.ev(snap('dogs')); walks.push(`${d}${again ? ' again' : ''}: ${r.done ? 'DONE' : r.walks + ' walks'}${/already logged/.test(r.verdict || '') ? ' (refused: already logged)' : ''}`); }
  ok(/16 again: 1 walks \(refused/.test(walks.join('; ')) && /23: DONE/.test(walks.join('; ')), `E. Walkies: ${walks.join('; ')}`);
  // F. Night watch on the phone's clock
  const nw = [];
  const night = async (d, h, mi, label) => { await pg.ev(at(2026, 11, d, h, mi)); const x = await pg.ev(snap('sable')); nw.push(`${label}: ${x.done ? 'DONE' : 'nights ' + x.nights}${x.stamp ? ' [' + x.stamp + ']' : ''} ${/Verification failed/.test(x.verdict || '') ? 'FAILED "' + (x.verdict.match(/Stamped [^.]*\.[^.]*\.|Tonight is already logged\.|Night watch counts[^.]*\./) || [''])[0] + '"' : ''}`); return x; };
  let x1 = await night(24, 23, 30, '11-24 11:30 pm');
  ok(x1.nights === 1 && /11:30 PM/.test(x1.stamp || ''), `F. 11:30 pm counts, the stamp on the photo: ${short(x1)}`);
  await night(24, 23, 45, '11-24 11:45 pm again'); await night(25, 0, 10, '11-25 12:10 am'); await night(25, 19, 40, '11-25 7:40 pm');
  await night(25, 0, 0, '11-25 12:00 am'); await night(25, 23, 59, '11-25 11:59 pm');
  await night(27, 21, 0, '11-27 9:00 pm (skipped the 26th)'); await night(28, 20, 0, '11-28 8:00 pm');
  const last = await night(29, 22, 5, '11-29 10:05 pm');
  console.log('   ' + nw.join('\n   '));
  const nwText = nw.join(' | ');
  ok(/11:45 pm again: nights 1 .*Tonight is already logged/.test(nwText) && /12:10 am: nights 1 .*after midnight/.test(nwText) && /7:40 pm: nights 1 .*8 pm to midnight/.test(nwText)
    && /12:00 am: nights 1 .*after midnight/.test(nwText) && /11:59 pm: nights 2/.test(nwText) && /skipped the 26th\): nights 1/.test(nwText) && /11-28 8:00 pm: nights 2/.test(nwText) && last.done,
    'F. the same night refused; 12:10 am, 12:00 am and 7:40 pm refused; 11:59 pm counts; a skipped night resets; 3 in a row -> done');
  await pg.ev('(function(){document.querySelectorAll("#layer .modal").forEach(function(m){m.remove()});var b=document.querySelector(".nav button[data-v=away]");b&&b.click();return 1})()'); await sleep(2000);
  const dg = await pg.ev(`(function(){var a=document.querySelector('#app');var i=a.innerHTML.indexOf('The Night Stair');var first=a.querySelector('.dng b');var D=window.__qbSide.dng;return {listed:i>=0,first:first?first.innerText:null,band:D.c,crawl:!!a.querySelector('[data-act=dgo][data-id=sq_night]')}})()`);
  ok(dg.listed && /Night Stair/.test(dg.first || '') && dg.crawl, `F. The Night Stair at the top of the Crawls list, with a Crawl button ${JSON.stringify(dg)}`);
  const cr = await pg.ev(`(async function(){var w=function(ms){return new Promise(function(r){setTimeout(r,ms)})},S=window.__qb.x().S;var b=document.querySelector('[data-act=dgo][data-id=sq_night]');if(!b)return null;b.click();await w(800);document.querySelectorAll('#layer .modal').forEach(function(m){m.remove()});
    var run=(S.dng.runs||[]).filter(function(r){return r.id==='sq_night'})[0];if(!run)return {run:null};window.__qbShift+=run.end-Date.now()+60000;window.__qb.x().render();await w(800);var c0=S.coins;var cl=document.querySelector('[data-act=dclaim]');if(cl)cl.click();await w(1200);
    var m=document.querySelector('#layer .modal');return {run:{c:run.c,mins:Math.round((run.end-run.start)/60000)},claimed:!!cl,paid:S.coins-c0,win:m?m.innerText.replace(/\\s+/g,' ').slice(0,120):null}})()`);
  ok(cr && cr.run && cr.paid > 0, `F. a crawl in The Night Stair pays: ${JSON.stringify(cr)}`);
  await pg.ev('(function(){document.querySelectorAll("#layer .modal").forEach(function(m){m.remove()});var b=document.querySelector(".nav button[data-v=board]");b&&b.click();return 1})()');
  // G. Theo's movie night
  await pg.ev(at(2026, 11, 30, 20, 0));
  const me = await pg.ev('window.__qbSide.me()');
  await pg.ev('(function(){window.__qbSide.fake([]);return 1})()'); r = await pg.ev(snap('theo'));
  ok(!r.camera && /needs a friend who plays/.test(r.ask || ''), `G. no friends: no camera, "${(r.ask || '').match(/Movie night needs[^.]*\./)}"`);
  await pg.ev(`(function(){window.__qbSide.fake([{id:'u_sam',name:'Sam'},{id:'u_kim',name:'Kim',sqm:{d:'2026-11-29',w:'${me}'}}]);return 1})()`);
  r = await pg.ev(snap('theo', { friend: 'u_sam' })); ok(!r.done && /Waiting on|needs Sam|Sam's tonight/.test(r.verdict || ''), `G. sent, Sam hasn't: ${short(r)}`);
  const pub = await pg.ev(`(function(){var k=Object.keys(localStorage).filter(function(k){return /^qbsbx:worlds\\//.test(k)});return k.map(function(k){var v=JSON.parse(localStorage.getItem(k));return k+' sqm='+JSON.stringify(v&&v.sqm)})})()`);
  console.log('   my world doc:', JSON.stringify(pub));
  await pg.ev(`(function(){window.__qbSide.fake([{id:'u_sam',name:'Sam',sqm:{d:'2026-11-30',w:'u_other'}}]);window.__qbSide.theo();return 1})()`); await sleep(300);
  ok(!(await pg.ev('!!window.__qbSide.state().done.theo')), 'G. Sam named someone else: not done');
  await pg.ev(`(function(){window.__qbSide.fake([{id:'u_sam',name:'Sam',sqm:{d:'2026-11-29',w:'${me}'}}]);window.__qbSide.theo();return 1})()`); await sleep(300);
  ok(!(await pg.ev('!!window.__qbSide.state().done.theo')), 'G. Sam\'s photo from yesterday: not done');
  const ti = await pg.ev('window.__qb.x().S.base.slots.map(function(r,i){return r&&r.t==="theater"?i:-1}).filter(function(i){return i>=0})[0]');
  const t0 = await pg.ev(`({biz:window.__qbSide.biz(${ti}),pay:window.__qbSide.pay()})`);
  await pg.ev(`(function(){window.__qbSide.fake([{id:'u_sam',name:'Sam',sqm:{d:'2026-11-30',w:'${me}'}}]);window.__qbSide.theo();return 1})()`); await sleep(500);
  const st = await pg.ev('(function(){var s=window.__qbSide.state();return {done:!!s.done.theo,prem:s.prem}})()');
  const sameDay = await pg.ev(`({biz:window.__qbSide.biz(${ti})})`);
  await pg.ev(at(2026, 12, 1, 12, 0)); const t1 = await pg.ev(`({biz:window.__qbSide.biz(${ti}),pay:window.__qbSide.pay(),card:(document.querySelector('#app .sdq-prem')||{}).innerText||null})`);
  await pg.ev(at(2026, 12, 2, 12, 0)); const t2 = await pg.ev(`({biz:window.__qbSide.biz(${ti})})`);
  ok(st.done && st.prem === '2026-12-01' && sameDay.biz === t0.biz && t1.biz === 2 * t0.biz && t1.pay > t0.pay && t2.biz === t0.biz && /Premiere day/.test(t1.card || ''),
    `G. Sam named me today: done, premiere ${st.prem}: the theater ${t0.biz} -> ${t1.biz} that day (${sameDay.biz} the same night, ${t2.biz} after), the limit ${t0.pay} -> ${t1.pay}, "${t1.card}"`);
  // the Town square (29p_square.js sqHtml/sqCard, which ea6eaa9's side-quest code overwrote): the Players tab since 1feee32 (was Hall -> Rank), then the folds
  await pg.ev('(function(){document.querySelectorAll("#layer .modal,.dropsplash").forEach(function(m){m.remove()});var b=document.querySelector(".nav button[data-v=players]");if(b){b.click();return 1}b=document.querySelector(".nav button[data-v=hall]");b&&b.click();return 0})()'); await sleep(1500);
  await pg.ev(`(function(){var b=document.querySelector('[data-act=htab][data-t="style"]');if(b)b.click();return 1})()`); await sleep(1200);
  const sq = await pg.ev(`(async function(){var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})};[].forEach.call(document.querySelectorAll('[data-act=fshfold]'),function(b){if(b.getAttribute('aria-expanded')!=='true')b.click()});await w(1200);
    document.querySelectorAll('.dropsplash,.bsplash,#layer .modal').forEach(function(m){m.remove()});var box=document.querySelector('#sqbox');var who=box?[].filter.call(box.querySelectorAll('button,[data-u],[data-uid]'),function(b){return !/(you)/.test(b.innerText)})[0]:null;var t0=document.querySelectorAll('#layer .modal').length;if(who)who.click();await w(800);var m=document.querySelector('#layer .modal');
    return {square:box?box.innerText.replace(/\\s+/g,' ').slice(0,140):null,sideInSquare:box?/Side-quest|Send a photo/i.test(box.innerText):null,tapped:who?who.innerText.trim().slice(0,30):null,card:m?m.innerText.replace(/\\s+/g,' ').slice(0,100):null,pops:[].map.call(document.querySelectorAll('#layer .pop'),function(p){return p.innerText}).slice(-1)}})()`);
  ok(sq.square && /Town square/i.test(sq.square) && !sq.sideInSquare && /wave/i.test(sq.card || ''), `the Players tab's (or the Hall's Rank tab's) Town square draws, and tapping a player opens the greetings: ${JSON.stringify(sq)}`);
  await pg.ev('(function(){document.querySelectorAll("#layer .modal").forEach(function(m){m.remove()});var b=document.querySelector(".nav button[data-v=board]");b&&b.click();return 1})()'); await sleep(800);
  // H. a reload keeps it all
  await pg.go(BASE + '/'); await pg.wait('!!(window.__qbSide && document.querySelector("#app") && !document.querySelector("#app .boot"))', 120000); await sleep(3000);
  const h = await pg.ev('(function(){var s=window.__qbSide.state();return {done:Object.keys(s.done).sort().join(","),walks:s.walk.length,nights:s.nw.n,stair:window.__qbSide.dng&&!!window.__qb}})()');
  ok(h.done === 'dogs,mara,nova,sable,theo' && h.walks === 5, `H. after a reload: ${JSON.stringify(h)}`);
  ok(!pg.errs.length, `page errors: ${pg.errs.length} ${pg.errs.slice(0, 2).join(' | ')}`);
  console.log(P.length ? `W-SIDE: ${P.length} problem(s)` : 'W-SIDE: PASS');
  await br.close(); process.exit(P.length ? 1 : 0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(2); });
