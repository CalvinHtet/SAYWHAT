// w-visitors (v0.92, W55): other players visit your businesses. V1: the day's roll (pvRoll through __qbVisit.roll, 3,000 seeds): at most
// 3 visits, each room and each friend once, at most 2 tips of 100-400 coins (the room's own tip), arrivals 9 am-11 pm, stays 45-120
// min, the average near 0.92. V2: no business -> no roll. V3: a real roll with the sandbox's stand-in neighbors: the tips are paid once,
// a reload keeps the day's visits and pays nothing again. V4: the note at the top of the room window ("... left a 250-coin tip.",
// "... admired the ..."); never a letter. V5: the visitor drawn in the building view with their name under them; gone after the stay.
// V6: a friend inactive for 4 days and one with no outfit are never picked; one with a played day yesterday is. V7: the next game day.
//   BASE=<sandbox build> CHROME_PORT=9374 OUT=<dir/> bash tools/windows/node.sh rigtest/qa/wvisit.js
const fs = require('fs');
const { browser, sleep, boot, E } = require('./wfocus_lib.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8817', OUT = process.env.OUT || require('os').tmpdir() + '/qa-out/wvisit/';
fs.mkdirSync(OUT, { recursive: true });
const P = []; const ok = (c, s) => { console.log((c ? 'ok   ' : 'BAD  ') + s); if (!c) P.push(s); };
const at = (y, mo, d, h, mi) => `(function(){var real=Date.now()-(window.__qbShift||0);window.__qbShift=new Date(${y},${mo - 1},${d},${h},${mi}).getTime()-real;window.__qb.x().render();return 1})()`;
const clear = '(function(){document.querySelectorAll("#layer .modal,.dropsplash,.bsplash").forEach(function(m){m.remove()});return 1})()';
(async () => {
  const br = await browser(); let pg = await boot(br, { base: BASE }); await E(pg, 'W.closeAll()');
  // V1. the roll itself
  const R = await pg.ev(`(function(){var V=window.__qbVisit,rooms=['garden','restaurant','boba','theater','skybar','club'],fr=[];for(var i=0;i<8;i++)fr.push({u:'f'+i,n:'F'+i});
    var bad=[],hist=[0,0,0,0,0],tips=0,tipV={},hours=[99,0],stay=[999,0],t0=null;var sd=function(){return 1+Math.floor(Math.random()*2147483000)};for(var s=1;s<=3000;s++){var v=V.roll(rooms,fr,sd());hist[v.length]++;
      var ru={},fu={},tp=0;v.forEach(function(x){if(ru[x.t])bad.push('room twice '+s);if(fu[x.u])bad.push('friend twice '+s);ru[x.t]=1;fu[x.u]=1;if(x.tip){tp++;tipV[x.t]=x.tip;if(x.tip!==V.tip(x.t)||x.tip<100||x.tip>400)bad.push('tip '+x.tip+' '+x.t)}
        var d=new Date(x.at),h=d.getHours()+d.getMinutes()/60;hours[0]=Math.min(hours[0],h);hours[1]=Math.max(hours[1],h);var m=(x.end-x.at)/60000;stay[0]=Math.min(stay[0],m);stay[1]=Math.max(stay[1],m)});
      if(tp>2)bad.push('tips '+tp+' '+s);tips+=tp}
    var one=0;for(var s2=1;s2<=500;s2++){if(V.roll(['restaurant'],fr,sd()).length>1)one++}var nof=0;for(var s3=1;s3<=200;s3++){nof+=V.roll(rooms,[],sd()).length}
    return {hist:hist,mean:+((hist[1]+2*hist[2]+3*hist[3])/3000).toFixed(2),tipsPerDay:+(tips/3000).toFixed(2),bad:bad.slice(0,5),nBad:bad.length,tipByRoom:tipV,hours:hours.map(function(h){return +h.toFixed(2)}),stay:stay.map(Math.round),oneRoomOver1:one,noFriends:nof}})()`);
  ok(!R.nBad && R.hist[4] === 0 && R.mean > 0.8 && R.mean < 1.05 && R.tipsPerDay <= 0.6 && R.hours[0] >= 9 && R.hours[1] <= 23 && R.stay[0] >= 45 && R.stay[1] <= 120 && !R.oneRoomOver1 && !R.noFriends,
    `V1. 3,000 rolls: visits per day ${JSON.stringify(R.hist.slice(0, 4))} (mean ${R.mean}), tips/day ${R.tipsPerDay}, problems ${R.nBad} ${R.bad.join(';')}, arrivals ${R.hours[0]}-${R.hours[1]} h, stays ${R.stay[0]}-${R.stay[1]} min, one room -> never more than 1, no friends -> 0; tips by room ${JSON.stringify(R.tipByRoom)}`);
  // V2. no business
  await pg.ev(at(2026, 11, 16, 12, 0));
  const v2 = await pg.ev(`(function(){window.__qbVisit.check();return {rooms:window.__qbVisit.rooms(),d:window.__qbVisit.state().d,v:window.__qbVisit.state().v.length}})()`);
  ok(!v2.rooms.length && !v2.d && !v2.v, `V2. a save with no business: no roll ${JSON.stringify(v2)}`);
  // V3. a real roll
  await E(pg, 'W.lvl(30)');
  await pg.ev(`(function(){var x=window.__qb.x();['garden','restaurant','boba','theater'].forEach(function(t){window.__qbRooms.open(t,1)});x.S.coins=1000;x.persist();x.render();return 1})()`); await pg.ev(clear);
  await sleep(2500);
  // the roll at 5:30 am, before any arrival (9 am at the earliest), so no tip is paid inside the roll before c0 (BUILDER 09:27)
  await pg.ev(at(2026, 11, 16, 5, 30));
  const fr0 = await pg.ev('window.__qbVisit.friends()'); console.log('   stand-in neighbors:', JSON.stringify(fr0));
  const v3 = await pg.ev(`(async function(){var w=function(ms){return new Promise(function(r){setTimeout(r,ms)})},V=window.__qbVisit,S=window.__qb.x().S,tries=0;
    do{S.pvis={d:'',v:[]};V.check();tries++}while(V.state().v.length<2&&tries<40);var st=JSON.parse(JSON.stringify(V.state()));return {tries:tries,state:st}})()`);
  console.log('   rolled:', JSON.stringify(v3.state.v.map((v) => ({ u: v.u, t: v.t, at: new Date(v.at).toTimeString().slice(0, 5), stay: Math.round((v.end - v.at) / 60000), tip: v.tip, pc: v.pc, paid: v.paid }))));
  const c0 = await pg.ev('window.__qb.x().S.coins');
  await pg.ev(at(2026, 11, 16, 23, 30)); const v3b = await pg.ev('(function(){window.__qbVisit.check();var S=window.__qb.x().S;return {coins:S.coins,paid:S.pvis.v.map(function(v){return v.paid}),tips:S.pvis.v.reduce(function(a,v){return a+(+v.tip||0)},0)}})()');
  ok(v3b.coins - c0 === v3b.tips && v3b.paid.every((p) => p === 1), `V3. by 11:30 pm every visit happened: paid +${v3b.coins - c0} = the day's tips ${v3b.tips} ${JSON.stringify(v3b.paid)}`);
  const before = await pg.ev('JSON.stringify(window.__qb.x().S.pvis)');
  await pg.go(BASE + '/'); await pg.wait('!!(window.__qbVisit && document.querySelector("#app") && !document.querySelector("#app .boot"))', 120000); await sleep(3000); await pg.ev(clear);
  await pg.ev(at(2026, 11, 16, 23, 40)); await pg.ev('(function(){window.__qbVisit.check();return 1})()'); await sleep(500);
  const after = await pg.ev('({p:JSON.stringify(window.__qb.x().S.pvis),coins:window.__qb.x().S.coins})');
  ok(after.p === before && after.coins === v3b.coins, `V3. after a reload: the same visits, nothing paid again (coins ${v3b.coins} -> ${after.coins})`);
  // V4. the note in the room window, a forced visit with a tip and one without
  await pg.ev(at(2026, 11, 17, 14, 0)); await pg.ev('(function(){window.__qbVisit.check();return 1})()');
  const fr = await pg.ev('window.__qbVisit.friends()');
  const f1 = await pg.ev(`(function(){var S=window.__qb.x().S,c=S.coins;var v=window.__qbVisit.force('restaurant','${fr[0].u}',250,90);return {v:v,paid:S.coins-c}})()`);
  const f1b = await pg.ev(`(function(){var S=window.__qb.x().S,c=S.coins;window.__qbVisit.check();window.__qbVisit.check();return S.coins-c})()`);
  ok(f1.v && f1.paid === 250 && f1b === 0, `V4. a forced restaurant visit with a 250 tip: paid ${f1.paid}, then nothing more on two checks (${f1b})`);
  const f2 = await pg.ev(`window.__qbVisit.force('boba','${fr[1].u}',0,90)`);
  const note = async (t) => pg.ev(`(async function(){document.querySelectorAll('#layer .modal').forEach(function(m){m.remove()});var S=window.__qb.x().S,i=-1;S.base.slots.forEach(function(r,j){if(i<0&&r&&r.t==='${t}')i=j});window.__qb.roomModal(i);await new Promise(function(r){setTimeout(r,800)});
    var sc=document.querySelector('.rmodal .rm-scroll');var first=sc&&sc.firstElementChild;return {first:first&&first.classList.contains('pv-note')?first.innerText:null,notes:sc?[].map.call(sc.querySelectorAll('.pv-note'),function(n){return n.innerText}):[]}})()`);
  const n1 = await note('restaurant'), n2 = await note('boba'), n3 = await note('garden');
  ok(n1.first === `${fr[0].n} came in for dinner and left a 250-coin tip.`, `V4. the Restaurant's window, first line: "${n1.first}"`);
  ok(n2.first && n2.first.startsWith(fr[1].n) && !/tip/.test(n2.first), `V4. the Boba window: "${n2.first}"`);
  const g = await pg.ev('window.__qb.x().S.pvis.v.filter(function(v){return v.t==="garden"&&v.at<=Date.now()}).length');
  ok(g ? n3.notes.length === g : !n3.notes.length, `V4. the Garden window: ${n3.notes.length ? JSON.stringify(n3.notes) : 'no note'} (visits there so far today: ${g})`);
  const inbox = await pg.ev('(function(){var L=window.__qb.x().S.letters;return JSON.stringify(L||[]).match(/tip|came in for|admired/g)||[]})()');
  ok(!inbox.length, `V4. no letter about visits (${inbox.length})`);
  // V5. drawn in the building view, the name under them, gone after the stay
  await pg.ev(clear);
  const here = await pg.ev('window.__qbVisit.here().map(function(h){return h.pvn+"@"+h.room})'); console.log('   in the rooms now:', JSON.stringify(here));
  await pg.ev('(function(){var b=document.querySelector(".nav button[data-v=hideout]");b&&b.click();return 1})()'); await sleep(2500); await pg.ev(clear);
  const bi = await pg.ev(`(function(){var b=[].map.call(document.querySelectorAll('[data-act=bldgo]'),function(e){return e.dataset.v});return b})()`);
  // rc-v0.92c (LEAD/BUILDER 09:06): in the building view the visitors are drawn WITHOUT their name tag (too small to read there); the
  // tag shows in the room window, at least 10 px
  let tags = [], who = [];
  for (const b of bi) { await pg.ev(`(function(){var o=document.querySelector('[data-act=bldout]');if(o)o.dispatchEvent(new MouseEvent('click',{bubbles:true}));return 1})()`); await sleep(800);
    await pg.ev(`(function(){var e=document.querySelector('[data-act=bldgo][data-v="${b}"]');if(e)e.dispatchEvent(new MouseEvent('click',{bubbles:true}));return 1})()`); await sleep(7000); await pg.ev(clear); await sleep(1500);
    const a = await pg.ev('[].map.call(document.querySelectorAll("[id^=\\"lfa-pfv_\\"]"),function(g){return g.id})');
    const t = await pg.ev('[].map.call(document.querySelectorAll(".pv-tag"),function(t){var r=t.getBoundingClientRect(),cs=getComputedStyle(t);return {n:t.textContent,op:t.style.opacity,shown:cs.display!=="none"&&cs.visibility!=="hidden"&&+(t.style.opacity||1)>0&&r.width>0,w:+r.width.toFixed(1),h:+r.height.toFixed(1)}})');
    if (a.length) { who = a; tags = t; await pg.shot(OUT + 'building.png'); break; } }
  ok(who.length >= 2 && !tags.some((t) => t.shown), `V5. the building view draws the visitors (${JSON.stringify(who)}) with no name tag showing ${JSON.stringify(tags)}`);
  const rw = await pg.ev(`(async function(){var S=window.__qb.x().S,i=-1;S.base.slots.forEach(function(r,j){if(i<0&&r&&r.t==='restaurant')i=j});window.__qb.roomModal(i);await new Promise(function(r){setTimeout(r,6000)});
    var m=document.querySelector('#layer .rmodal');var tg=m?m.querySelector('.pv-tag'):null;var r=tg?tg.getBoundingClientRect():null;var tx=tg?tg.querySelector('text'):null,tr=tx?tx.getBoundingClientRect():null;
    return {actors:m?m.querySelectorAll('[id^=lfa-]').length:-1,tag:r?{n:tg.textContent,x:Math.round(r.x),y:Math.round(r.y),w:+r.width.toFixed(1),h:+r.height.toFixed(1),textH:tr?+tr.height.toFixed(1):null,op:tg.style.opacity}:null,note:(m&&m.querySelector('.pv-note')||{}).innerText||null}})()`);
  if (rw.tag) await pg.shot(OUT + 'roomwin_tag.png', { x: Math.max(0, rw.tag.x - 80), y: Math.max(0, rw.tag.y - 110), width: 170, height: 140 });
  ok(rw.tag && rw.tag.n === fr[0].n && rw.tag.op === '1' && rw.tag.w > 10, `V5. the Restaurant's window: ${fr[0].n} drawn with the name under them ${JSON.stringify(rw)} (crop: ${OUT}roomwin_tag.png)`);
  // LEAD 08:36 (rc-v0.92c): the name readable in the room window, its letters at least 10 CSS px tall
  ok(rw.tag && rw.tag.textH >= 10, `V5. the name tag readable in the room window: text ${rw.tag && rw.tag.textH} px tall, pill ${rw.tag && rw.tag.h} px (want >= 10)`);
  await pg.ev(clear);
  await pg.ev(`(function(){window.__qbShift+=125*60000;window.__qb.x().render();return 1})()`); await sleep(5000);
  const gone = await pg.ev('({here:window.__qbVisit.here().length,tags:document.querySelectorAll(".pv-tag").length})');
  ok(!gone.here, `V5. after the stay (+125 min): nobody in the rooms (here ${gone.here}, tags left ${gone.tags})`);
  // V6. who can visit: inactive 4 days, no outfit, a played day yesterday
  const look = await pg.ev(`(function(){var k=Object.keys(localStorage).filter(function(k){return /^qbsbx:worlds\\/sb_/.test(k)})[0];return k?JSON.parse(localStorage.getItem(k)).look:null})()`);
  await pg.ev(`(function(L){var now=Date.now(),y=new Date(now-864e5).toLocaleDateString('en-CA');localStorage.setItem('qbsbx:worlds/u_old',JSON.stringify({name:'Old Pal',look:L,t:now-4*864e5,pd:[new Date(now-5*864e5).toLocaleDateString('en-CA')]}));
    localStorage.setItem('qbsbx:worlds/u_blank',JSON.stringify({name:'Blank',t:now}));localStorage.setItem('qbsbx:worlds/u_pd',JSON.stringify({name:'Pd Pal',look:L,t:0,pd:[y]}));return 1})(${JSON.stringify(look)})`);
  await pg.go(BASE + '/'); await pg.wait('!!(window.__qbVisit && document.querySelector("#app") && !document.querySelector("#app .boot"))', 120000); await sleep(4000);
  const fr2 = await pg.ev('window.__qbVisit.friends().map(function(f){return f.u})');
  ok(!fr2.includes('u_old') && !fr2.includes('u_blank') && fr2.includes('u_pd'), `V6. who can visit: ${JSON.stringify(fr2)} (Old Pal, 4 days inactive, and Blank, no outfit, are out; Pd Pal, played yesterday, is in)`);
  // V7. the next game day
  await pg.ev(at(2026, 11, 18, 6, 0)); const n7 = await note('restaurant'); const s7 = await pg.ev('({d:window.__qb.x().S.pvis.d,early:window.__qb.x().S.pvis.v.filter(function(v){return v.at<=Date.now()}).length})');
  ok(!n7.notes.length && s7.early === 0, `V7. the next game day at 6 am: yesterday's note gone, a new roll for ${s7.d}, no visit before 9 am (${s7.early})`);
  ok(!pg.errs.length, `page errors: ${pg.errs.length} ${pg.errs.slice(0, 2).join(' | ')}`);
  console.log(P.length ? `W-VISIT: ${P.length} problem(s)` : 'W-VISIT: PASS');
  await br.close(); process.exit(P.length ? 1 : 0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(2); });
