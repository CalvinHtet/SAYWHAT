// w-rafe (v0.92, W35): Rafe's legendary hunts at 27/52/77/93, photo only (sandbox stand-in check: any photo that isn't nearly black
// passes). R1: level 20, nothing due. R2: level 27 without Rafe: he introduces himself "at your door"; yes -> he joins, his Lock and Key
// introduction is marked done; no honor button. R3: no spoilers (later hunts and the other legendary relics unnamed before they come).
// R4: a dark photo fails; a good one -> the montage (4 pictures, about 4.6 s) -> the legendary relic card -> Rafe leaves; the relic
// is kept once and its +2% XP applies. R5: one hunt at a time on a level-80 save: hunt 2 only the day after hunt 1, hunt 3 the day
// after that, hunt 4 never below 93; with Rafe already met the offer is the "found the way in" one, "at your door" until the player has
// Lock and Key, then at Lock and Key (rc-v0.92c). R6: Skip ends the montage; a
// reload in the middle of a montage keeps the relic once. R7: the Relics tab shows the legendaries.
//   BASE=<sandbox build> CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/wrafe.js
const { browser, sleep, boot, E } = require('./wfocus_lib.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8816';
const P = []; const ok = (c, s) => { console.log((c ? 'ok   ' : 'BAD  ') + s); if (!c) P.push(s); };
const at = (y, mo, d, h, mi) => `(function(){var real=Date.now()-(window.__qbShift||0);window.__qbShift=new Date(${y},${mo - 1},${d},${h},${mi}).getTime()-real;window.__qb.x().render();return 1})()`;
const clear = '(function(){document.querySelectorAll("#layer .modal,.dropsplash,.bsplash").forEach(function(m){m.remove()});return 1})()';
const due = (pg) => pg.ev('[1,2,3,4].map(function(k){return window.__qbSide.hunt.due(k)})');
// the offer for hunt k: its text and buttons; yes = click "Show him"
const offer = (k, yes) => `(async function(){var w=function(ms){return new Promise(function(r){setTimeout(r,ms)})};document.querySelectorAll('#layer .modal').forEach(function(m){m.remove()});var o=window.__qbSide.offer('hunt${k}');await w(300);
  var m=document.querySelector('#layer .modal');var all=m?m.textContent.replace(/\\s+/g,' '):'';var btns=m?[].map.call(m.querySelectorAll('button'),function(b){return b.innerText.trim()}):[];
  ${yes ? "var y=document.querySelector('#layer [data-act=sdqyes][data-v=\"hunt" + k + "\"]');if(y){y.click();await w(300)}" : ''}
  var S=window.__qb.x().S;return {offer:o,text:all.slice(0,400),btns:btns,on:!!window.__qbSide.state().on['hunt${k}'],team:!!(S.story&&S.story.team&&S.story.team.rafe),introDone:!!(window.__qbStory.state().done||{}).rafe}})()`;
// send a photo for hunt k; then watch the montage, the relic card and the goodbye (skip = tap Skip after 1 s)
const hunt = (k, o = {}) => `(async function(){var w=function(ms){return new Promise(function(r){setTimeout(r,ms)})};document.querySelectorAll('#layer .modal').forEach(function(m){m.remove()});
  window.__qbSide.ask('hunt${k}');await w(300);var win=document.querySelector('#layer .sdq-ask');var out={ask:win?win.innerText.replace(/\\s+/g,' ').slice(0,200):null,honor:win?/honou?r|i did it/i.test(win.innerText):null};
  var c=document.createElement('canvas');c.width=c.height=64;var g=c.getContext('2d');var q=Math.floor(Math.random()*1e6);g.fillStyle=${o.dark ? "'rgb(2,2,2)'" : "'rgb('+(90+q%150)+','+(60+(q>>3)%150)+','+(40+(q>>6)%150)+')'"};g.fillRect(0,0,64,64);g.fillStyle='rgba(255,255,255,.5)';g.fillRect(q%40,q%23,12,12);
  var b=await new Promise(function(r){c.toBlob(r,'image/jpeg',.9)});await window.__qbSide.file(new File([b],'h'+q+'.jpg',{type:'image/jpeg'}));
  var t0=0,frames=0,texts=[],seen={};for(var i=0;i<160;i++){var f=document.querySelector('#layer .rfm');if(f&&!t0){t0=performance.now();frames=f.querySelectorAll('.rfm-f').length;${o.skip ? "setTimeout(function(){var s=document.querySelector('.rfm-skip');if(s)s.click()},1000);" : ''}${o.reload ? 'return {montage:true,frames:f.querySelectorAll(".rfm-f").length};' : ''}}
    if(f){var on=f.querySelector('.rfm-f.on');if(on&&!seen[on.innerText]){seen[on.innerText]=1;texts.push(on.innerText.trim())}}
    if(t0&&!f){out.montageS=+((performance.now()-t0)/1000).toFixed(1);break}var v=[].filter.call(document.querySelectorAll('#layer .modal'),function(m){return /photo check/i.test(m.innerText)})[0];if(v&&!t0){out.verdict=v.innerText.replace(/\\s+/g,' ').slice(0,200);break}await w(100)}
  out.frames=frames;out.frameText=texts;await w(400);var rc=document.querySelector('#layer .rf-relic');out.relicCard=rc?rc.textContent.replace(/\\s+/g,' ').slice(0,200):null;out.wings=rc?!!rc.querySelector('[class*=wing],[class*=legend]'):null;
  if(rc){var cb=rc.querySelector('[data-act=rfleave]');if(cb)cb.click();await w(500)}var lv=[].filter.call(document.querySelectorAll('#layer .modal'),function(m){return m.querySelector('.sty-who')})[0];out.leave=lv?lv.textContent.replace(/\\s+/g,' ').slice(0,260):null;
  var st=window.__qbSide.state();out.done=st.done['hunt${k}']||null;out.relics=Object.keys(window.__qb.x().S.relics2||{}).filter(function(r){return /crown|wyrm|veil|worldseed/.test(r)});return out})()`;
(async () => {
  const br = await browser(); let pg = await boot(br, { base: BASE }); await E(pg, 'W.closeAll()'); await pg.ev('(function(){window.__qbSide.wait(300);return 1})()');
  await pg.ev(at(2026, 11, 16, 12, 0));
  await E(pg, 'W.lvl(20)'); ok(JSON.stringify(await due(pg)) === '[false,false,false,false]', `R1. level 20: no hunt due ${JSON.stringify(await due(pg))}`);
  // R3 before: no legendary named anywhere a player can look (Relics tab, Board)
  const names = ['Aldrath', 'Wyrmheart', 'Thousand Doors', 'Worldseed', 'drowned temple', 'Ashfall', 'glacier'];
  const look = async () => { await pg.ev(clear); const t = []; for (const v of ['board', 'trophy']) { await pg.ev(`(function(){var b=document.querySelector(".nav button[data-v=${v}]");b&&b.click();return 1})()`); await sleep(1500); t.push(await pg.ev('document.querySelector("#app").innerText')); } await pg.ev(clear); return t.join(' '); };
  await E(pg, 'W.lvl(27)'); await pg.ev(clear);
  let seen = await look(); ok(!names.some((n) => seen.includes(n)), `R3. level 27 before the hunt: no legendary or hunt names on the Board or Relics (${names.filter((n) => seen.includes(n)).join(', ') || 'none'})`);
  ok(JSON.stringify(await due(pg)) === '[true,false,false,false]', `R2. level 27: hunt 1 due ${JSON.stringify(await due(pg))}`);
  const m0 = await pg.ev(`(function(){var x=window.__qb.x(),S=x.S;S.quests.push({id:'qa_q',name:'Laundry',xp:50,stat:'discipline',cl:'home',rep:'daily'});x.persist();return x.mults(S.quests[S.quests.length-1],{}).m})()`);
  let r = await pg.ev(offer(1, true));
  ok(r.offer && /your door/i.test(r.text) && /Rafe Calloway/.test(r.text) && /I hear you finish what you start/.test(r.text) && r.btns.includes('Show him') && r.btns.includes('Not now') && r.on && r.team && r.introDone,
    `R2. not met: "at your door", he introduces himself; "Show him" -> on the Board, he joins the team, his Lock and Key intro marked done ${JSON.stringify({ btns: r.btns, on: r.on, team: r.team, introDone: r.introDone })}`);
  r = await pg.ev(hunt(1, { dark: 1 })); ok(!r.done && /Verification failed/.test(r.verdict || '') && !r.honor, `R4. a dark photo fails, no honor button: ${JSON.stringify({ ask: r.ask, verdict: r.verdict && r.verdict.slice(0, 90) })}`);
  r = await pg.ev(hunt(1)); const m1 = await pg.ev(`window.__qb.x().mults(window.__qb.x().S.quests.filter(function(q){return q.id==='qa_q'})[0],{}).m`);
  ok(r.done && r.frames === 4 && r.montageS >= 4 && r.montageS <= 5.5 && /Sunken Crown of Aldrath/.test(r.relicCard || '') && /I'll send word/.test(r.leave || '') && r.relics.join() === 'r2_crown',
    `R4. a good photo: montage ${r.frames} pictures in ${r.montageS} s ${JSON.stringify(r.frameText)}; relic card "${(r.relicCard || '').slice(0, 120)}" (wings/legendary class: ${r.wings}); goodbye "${(r.leave || '').slice(0, 140)}"; relics ${r.relics}`);
  ok(Math.abs(m1 / m0 - 1.02) < 0.002, `R4. the crown's +2% XP applies: a quest's multiplier ${m0} -> ${m1} (x${(m1 / m0).toFixed(4)})`);
  ok(JSON.stringify(await due(pg)) === '[false,false,false,false]', `R5. level 27 after hunt 1: nothing due ${JSON.stringify(await due(pg))}`);
  seen = await look(); ok(!['Wyrmheart', 'Thousand Doors', 'Worldseed', 'Ashfall', 'glacier'].some((n) => seen.includes(n)) && seen.includes('Aldrath'), `R3. after hunt 1: the crown shows, the later ones stay unnamed (${['Wyrmheart', 'Thousand Doors', 'Worldseed', 'Ashfall', 'glacier'].filter((n) => seen.includes(n)).join(', ') || 'none'})`);
  // R5: a level-80 save, Rafe already met
  await pg.close(); pg = await boot(br, { base: BASE }); await E(pg, 'W.closeAll()'); await pg.ev('(function(){window.__qbSide.wait(300);return 1})()'); await pg.ev(at(2026, 11, 16, 12, 0)); await E(pg, 'W.lvl(80)');
  await pg.ev(`(function(){var S=window.__qb.x().S;S.story=S.story||{};S.story.team=Object.assign(S.story.team||{},{rafe:1});window.__qb.x().persist();return 1})()`); await pg.ev(clear);
  ok(JSON.stringify(await due(pg)) === '[true,false,false,false]', `R5. level 80: only hunt 1 due ${JSON.stringify(await due(pg))}`);
  // rc-v0.92c: until the player has Lock and Key (the skybar), his hunts happen "at your door" so the bar isn't named early
  r = await pg.ev(offer(1, true)); ok(/found the way in/.test(r.text) && !/I hear you finish what you start/.test(r.text) && /your door/i.test(r.text) && !/Lock and Key/i.test(r.text), `R5. Rafe already met, no Lock and Key yet: the "found the way in" offer "at your door", no introduction, the bar not named`);
  r = await pg.ev(hunt(1, { skip: 1 })); ok(r.done && r.montageS < 2 && /Sunken Crown/.test(r.relicCard || ''), `R6. Skip ends the montage (${r.montageS} s) and the relic card still comes`);
  ok(JSON.stringify(await due(pg)) === '[false,false,false,false]', `R5. the same day: hunt 2 not due yet ${JSON.stringify(await due(pg))}`);
  await pg.ev(at(2026, 11, 17, 12, 0)); ok(JSON.stringify(await due(pg)) === '[false,true,false,false]', `R5. the next day: hunt 2 only ${JSON.stringify(await due(pg))}`);
  await pg.ev('(function(){window.__qbRooms.open("skybar",1);window.__qb.x().render();document.querySelectorAll("#layer .modal,.dropsplash,.bsplash").forEach(function(m){m.remove()});return 1})()');
  r = await pg.ev(offer(2, true)); ok(/Lock and Key/i.test(r.text) && /Ashfall/i.test(r.text), `R5. with Lock and Key built, hunt 2's offer is at Lock and Key: "${r.text.slice(0, 90)}"`);
  r = await pg.ev(hunt(2, { reload: 1 })); ok(r.montage && r.frames === 4, `R6. hunt 2 accepted, montage running (${r.frames} pictures): reload now`);
  await pg.go(BASE + '/'); await pg.wait('!!(window.__qbSide && document.querySelector("#app") && !document.querySelector("#app .boot"))', 120000); await sleep(3000);
  await pg.ev(at(2026, 11, 17, 13, 0));
  const rl = await pg.ev(`(function(){var S=window.__qb.x().S,st=window.__qbSide.state();return {done:st.done.hunt2||null,on:!!st.on.hunt2,relics:Object.keys(S.relics2||{}).filter(function(r){return /crown|wyrm|veil|worldseed/.test(r)})}})()`);
  ok(rl.done && rl.relics.join() === 'r2_crown,r2_wyrmheart', `R6. after the reload: hunt 2 done, the Wyrmheart kept once ${JSON.stringify(rl)}`);
  ok(JSON.stringify(await due(pg)) === '[false,false,false,false]', `R5. after hunt 2 the same day: nothing ${JSON.stringify(await due(pg))}`);
  await pg.ev(at(2026, 11, 18, 12, 0)); ok(JSON.stringify(await due(pg)) === '[false,false,true,false]', `R5. the day after: hunt 3 only; hunt 4 never below level 93 ${JSON.stringify(await due(pg))}`);
  // R7: the Relics tab
  await pg.ev(clear); await pg.ev('(function(){var b=document.querySelector(".nav button[data-v=trophy]");b&&b.click();return 1})()'); await sleep(1500);
  const rt = await pg.ev(`(function(){var a=document.querySelector('#app');var t=a.innerText;return {crown:/Sunken Crown of Aldrath/.test(t),wyrm:/Wyrmheart Ember/.test(t),veil:/Veil of the Thousand Doors/.test(t),seed:/Worldseed/.test(t),count:(t.match(/\\d+ of \\d+/)||[''])[0],legendary:a.querySelectorAll('[class*=legend]').length}})()`);
  ok(rt.crown && rt.wyrm && !rt.veil && !rt.seed, `R7. Relics tab: the 2 legendaries found show, the 2 not found stay unnamed ${JSON.stringify(rt)}`);
  ok(!pg.errs.length, `page errors: ${pg.errs.length} ${pg.errs.slice(0, 2).join(' | ')}`);
  console.log(P.length ? `W-RAFE: ${P.length} problem(s)` : 'W-RAFE: PASS');
  await br.close(); process.exit(P.length ? 1 : 0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(2); });
