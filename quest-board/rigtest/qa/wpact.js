// w-pact (v0.92, W28): the Gym Pact, a third kind of challenge. The sandbox has one player, so the other side (the stand-in neighbor
// "Justin", sb_justin) is written by hand into qbsbx:duel/sb_justin: his answer, his published days, his own pact offers.
// P1 send (stake held, one pact at a time, can't afford). P2 his accept -> live. P3 the days: an honor tap no, a verified fitness quest
// yes, a second in a day once, a verified non-fitness quest no, a full Training session yes, a short one no, an undo takes it back,
// 11:30 pm counts for its own day (the day starts at midnight since v0.97; the old 4:30 am case is gone). P4 the outcomes, each paid once (and not again after a reload): both 1.5x, one 2x,
// lost 0, neither 0. P5 declined, cancelled, unanswered: stake back. P6 his pact to me: the notice, accept holds my stake. P7 a normal
// quest-XP challenge still settles. The rules text and the card's dots.
//   BASE=<sandbox build> CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/wpact.js
const { browser, sleep, boot, E } = require('./wfocus_lib.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8817';
const P = []; const ok = (c, s) => { console.log((c ? 'ok   ' : 'BAD  ') + s); if (!c) P.push(s); };
const at = (y, mo, d, h, mi) => `(function(){var real=Date.now()-(window.__qbShift||0);window.__qbShift=new Date(${y},${mo - 1},${d},${h},${mi}).getTime()-real;window.__qb.x().render();return 1})()`;
const clear = '(function(){document.querySelectorAll("#layer .modal,.dropsplash,.bsplash").forEach(function(m){m.remove()});return 1})()';
// Justin's doc: merge into it, then the game reads every duel doc again and settles
const J = (mut) => `(async function(){var k='qbsbx:duel/sb_justin',d=JSON.parse(localStorage.getItem(k)||'null')||{name:'Justin',out:{},ans:{},sc:{},pout:{},pans:{},psc:{}};(${mut})(d);d.t=Date.now();localStorage.setItem(k,JSON.stringify(d));
  window.__qbDuel.st.busy=0;await window.__qbDuel.load();await new Promise(function(r){setTimeout(r,400)});return 1})()`;
const load = '(async function(){window.__qbDuel.st.busy=0;await window.__qbDuel.load();await new Promise(function(r){setTimeout(r,500)});return 1})()';
const S = (e) => `(function(){var x=window.__qb.x(),S=x.S,D=window.__qbDuel;return (${e})})()`;
const send = (stake, goal) => `(async function(){var S=window.__qb.x().S,D=window.__qbDuel,c0=S.coins,before=Object.keys(S.duel&&S.duel.held||{});D.st.f={to:'sb_justin',kind:'p',goal:${goal},stake:${stake},days:3};await D.pSend();await new Promise(function(r){setTimeout(r,300)});
  var cid=Object.keys(S.duel.held).filter(function(k){return before.indexOf(k)<0})[0]||null;return {cid:cid,paid:c0-S.coins,pops:[].map.call(document.querySelectorAll('#layer .pop'),function(p){return p.innerText}).slice(-1)}})()`;
const accept = (cid) => J(`function(d){d.pans['${cid}']={acc:true,t:Date.now()}}`);
const pact = (cid) => S(`D.pAll().filter(function(c){return c.cid==='${cid}'})[0]||null`);
const days = (cid) => `(async function(){await new Promise(function(r){setTimeout(r,700)});return ` + S(`(function(){var c=D.pAll().filter(function(c){return c.cid==='${cid}'})[0];return c?D.pCount(c.start,Math.min(Date.now(),c.end)):null})()`) + '})()';
// a quest finished: v = verified (the photo path's toggle mode), else an honor tap
const quest = (stat, v) => S(`(function(){var id='qa'+Math.random().toString(36).slice(2,7);S.quests.push({id:id,name:'Run '+id,xp:25,stat:'${stat}',cl:'body',rep:'once'});x.persist();x.toggle(id,null,${v ? "'v'" : 'undefined'});return id})()`);
const undo = (id) => S(`(function(){x.toggle('${id}');return !S.done['${id}']})()`);
(async () => {
  const br = await browser(); const pg = await boot(br, { base: BASE }); await E(pg, 'W.closeAll()'); await E(pg, 'W.lvl(20)');
  await pg.ev(at(2026, 11, 16, 10, 0)); await pg.ev(S('(S.coins=20000,S.calm=false,S.tours=Object.assign(S.tours||{},{welcome:1,dq:1,bty:1,train:1,hall:1,players:1,hideout:1}),x.persist(),1)')); /* the calm week (v0.95) hides Training until day 4: off here */
  await pg.ev('(function(){if(window.__qbVisit)window.__qbVisit.check();return 1})()'); await sleep(3000); await pg.ev(load);
  const me = await pg.ev(S('Object.keys(D.st.docs).filter(function(k){return !/^sb_/.test(k)})[0]||(window.__qbSide&&window.__qbSide.me())'));
  // the form
  await pg.ev(clear); await pg.ev(S("(D.st.f.kind='p',D.newOpen(),1)")); await sleep(600);
  const form = await pg.ev(`(function(){var m=document.querySelector('#layer .dlm');return m?{kinds:[].map.call(m.querySelectorAll('[data-k=kind]'),function(b){return b.innerText.replace(/\\s+/g,' ')}),goals:[].map.call(m.querySelectorAll('[data-k=goal]'),function(b){return b.innerText}),rules:(m.querySelector('p.note')||{}).innerText,justin:!!m.querySelector('[data-k=to][data-v=sb_justin]')}:null})()`);
  ok(form && form.kinds.some((k) => /Gym Pact/.test(k)) && form.goals.join() === '3 days,4 days,5 days' && /1\.5 times the stake/.test(form.rules) && form.justin, `the form: ${JSON.stringify(form)}`);
  await pg.ev(clear);
  // P1. send
  let s1 = await pg.ev(send(250, 4)); ok(s1.cid && s1.paid === 250, `P1. sent a 250 pact, goal 4: held ${s1.paid} ${JSON.stringify(s1.pops)}`);
  const s1b = await pg.ev(send(250, 4)); ok(!s1b.cid && !s1b.paid && /still waiting/.test(s1b.pops[0] || ''), `P1. a second while it waits: refused ${JSON.stringify(s1b.pops)}`);
  const myDoc = await pg.ev(`JSON.parse(localStorage.getItem('qbsbx:duel/${me}')||'{}').pout`); ok(myDoc && myDoc[s1.cid] && myDoc[s1.cid].goal === 4, `P1. my duel doc carries it (pout): ${JSON.stringify(myDoc && myDoc[s1.cid])}`);
  // P2. he accepts
  await pg.ev(at(2026, 11, 16, 10, 5)); await pg.ev(accept(s1.cid)); let c = await pg.ev(pact(s1.cid));
  ok(c && c.st === 'live', `P2. Justin accepted: ${c && c.st}, ends ${c && new Date(c.end).toString().slice(0, 21)}`);
  // P3. the days
  const d = [];
  let id = await pg.ev(quest('fitness', 0)); d.push(['honor fitness 11-16', await pg.ev(days(s1.cid))]);
  id = await pg.ev(quest('fitness', 1)); d.push(['verified fitness 11-16', await pg.ev(days(s1.cid))]);
  id = await pg.ev(quest('fitness', 1)); d.push(['a second verified 11-16', await pg.ev(days(s1.cid))]);
  await pg.ev(at(2026, 11, 17, 9, 0)); id = await pg.ev(quest('discipline', 1)); d.push(['verified non-fitness 11-17', await pg.ev(days(s1.cid))]);
  // a full Training session (3 exercises), then a short one the next day
  const train = async (n) => { await pg.ev(clear); await pg.ev('(function(){var g=document.querySelector(".nav button[data-v=board]");g&&g.click();var b=document.querySelector(".nav button[data-v=train]")||document.querySelector(".zx-tile[data-v=train]");b&&b.click();return 1})()'); await sleep(1200); await pg.ev('(function(){var t=document.querySelector("#qbtour [data-tour=skip]");t&&t.click();return 1})()'); await sleep(600);
    for (let k = 0; k < 8 && !(await pg.ev('!!document.querySelector(".exlist .setb button.sb")')); k++) { if (k === 7) console.log('     (Training screen: ' + (await pg.ev('document.querySelector("#app").innerText.replace(/\\s+/g," ").slice(0,300)')) + ')'); await pg.ev('(function(){var t=document.querySelector("#qbtour [data-tour=skip]");t&&t.click();document.querySelectorAll("#layer .modal").forEach(function(m){m.remove()});var b=document.querySelector("button.plan[data-act=wkplan]");b&&b.click();var x=document.querySelector(\'[data-ca="x"]\');if(x)x.click();return 1})()'); await sleep(1200); }
    const r = await pg.ev(`(async function(){var w=function(ms){return new Promise(function(r){setTimeout(r,ms)})},ex=[];[].forEach.call(document.querySelectorAll('.exlist .setb button.sb'),function(b){if(ex.indexOf(b.dataset.ex)<0)ex.push(b.dataset.ex)});ex=ex.slice(0,${n});
      for(var i=0;i<ex.length;i++){var bs=document.querySelectorAll('.exlist .setb button.sb[data-ex="'+ex[i]+'"]');for(var j=0;j<bs.length;j++){bs[j].click();await w(120)}}
      var x0=window.__qb.x().S.xp;var b=document.querySelector('button[data-act=wkdone]');if(b)b.click();await w(1200);var ok=document.querySelector('#wksok');if(ok)ok.click();await w(600);document.querySelectorAll('#layer .modal').forEach(function(m){m.remove()});return {ex:ex.length,xp:window.__qb.x().S.xp-x0}})()`);
    await pg.ev('(function(){var b=document.querySelector(".nav button[data-v=board]");b&&b.click();return 1})()'); return r; };
  const t1 = await train(3); d.push([`full Training 11-17 (${t1.ex} exercises, +${t1.xp} XP)`, await pg.ev(days(s1.cid))]);
  await pg.ev(at(2026, 11, 18, 9, 0)); const t2 = await train(1); d.push([`short Training 11-18 (${t2.ex} exercise, +${t2.xp} XP)`, await pg.ev(days(s1.cid))]);
  id = await pg.ev(quest('fitness', 1)); const u1 = await pg.ev(days(s1.cid)); await pg.ev(undo(id)); d.push([`verified fitness 11-18 (${u1}) then undone`, await pg.ev(days(s1.cid))]);
  await pg.ev(at(2026, 11, 18, 23, 30)); id = await pg.ev(quest('fitness', 1)); d.push(['verified fitness 11-18 11:30 pm (the day starts at midnight since v0.97)', await pg.ev(days(s1.cid))]);
  await pg.ev(at(2026, 11, 19, 12, 0)); id = await pg.ev(quest('fitness', 1)); d.push(['verified fitness 11-19 noon', await pg.ev(days(s1.cid))]);
  console.log('   ' + d.map((x) => `${x[0]}: ${x[1]}`).join('\n   '));
  const want = [0, 1, 1, 1, 2, 2, 2, 3, 4];
  ok(JSON.stringify(d.map((x) => x[1])) === JSON.stringify(want), `P3. the days counted ${JSON.stringify(d.map((x) => x[1]))} (want ${JSON.stringify(want)})`);
  await pg.ev(clear); await pg.ev('(function(){var b=document.querySelector(".nav button[data-v=hall]");b&&b.click();return 1})()'); await sleep(1500);
  await pg.ev(`(function(){var b=document.querySelector('[data-act=htab][data-t="posts"]');if(b)b.click();return 1})()`); await sleep(1200);
  const card = await pg.ev(`(function(){var g=document.querySelector('#dlcard .gpi');return g?{text:g.innerText.replace(/\\s+/g,' ').slice(0,200),dots:[].map.call(g.querySelectorAll('.gpdots'),function(x){return x.querySelectorAll('i.on').length+'/'+x.querySelectorAll('i').length})}:null})()`);
  ok(card && card.dots[0] === '4/4' && /You/.test(card.text), `the card in the Hall's Posts: ${JSON.stringify(card)}`);
  await pg.ev('(function(){var b=document.querySelector(".nav button[data-v=board]");b&&b.click();return 1})()');
  // P4. both made it: settle once, and not again after a reload
  const settle = async (cid, his, when) => { await pg.ev(when); const c0 = await pg.ev(S('S.coins')); await pg.ev(J(`function(d){d.psc['${cid}']={n:${his},fin:true,t:Date.now()}}`)); await sleep(300);
    const r = await pg.ev(S(`({r:(S.duel.done['${cid}']||{}).r||null,coins:S.coins})`)); return { r: r.r, got: r.coins - c0 }; };
  let o = await settle(s1.cid, 4, at(2026, 11, 23, 11, 0)); ok(o.r === 'both' && o.got === 375, `P4. both made it (me 4, him 4): ${o.r}, +${o.got} (1.5 x 250)`);
  const cc = await pg.ev(S('S.coins')); await pg.go(BASE + '/'); await pg.wait('!!(window.__qbDuel && document.querySelector("#app") && !document.querySelector("#app .boot"))', 120000); await sleep(3000);
  await pg.ev(at(2026, 11, 23, 11, 30)); await pg.ev(load); await pg.ev(load);
  ok((await pg.ev(S('S.coins'))) === cc, `P4. after a reload and two more reads: paid nothing again (${cc} -> ${await pg.ev(S('S.coins'))})`);
  // more outcomes: set my days straight into the log
  const myDays = (cid, n) => S(`(function(){var c=D.pAll().filter(function(c){return c.cid==='${cid}'})[0],g=S.dlog;for(var i=0;i<${n};i++)g.a.push([c.start+i*864e5+36e5,'qa']);x.persist();return D.pCount(c.start,c.end)})()`);
  const run = async (stake, goal, mine, his, label, wantR, wantGot, day) => {
    await pg.ev(at(2026, 11, day, 10, 0)); const s = await pg.ev(send(stake, goal)); await pg.ev(accept(s.cid)); const n = await pg.ev(myDays(s.cid, mine));
    const r = await settle(s.cid, his, at(2026, 11, day + 8, 12, 0)); ok(r.r === wantR && r.got === wantGot, `P4. ${label} (me ${n}, him ${his}, stake ${stake}, goal ${goal}): ${r.r}, +${r.got}`); return s.cid; };
  await run(100, 3, 3, 1, 'only I made it', 'won', 200, 24);
  await run(100, 3, 1, 3, 'only he made it', 'lost', 0, 40);
  await run(500, 5, 2, 1, 'neither', 'miss', 0, 56);
  const msgs = await pg.ev(`[].map.call(document.querySelectorAll('#layer .pop'),function(p){return p.innerText}).slice(-4)`); console.log('   messages:', JSON.stringify(msgs));
  // P5. declined, cancelled, unanswered
  await pg.ev(at(2026, 12, 20, 10, 0));
  let s = await pg.ev(send(250, 4)); let c0 = await pg.ev(S('S.coins')); await pg.ev(J(`function(d){d.pans['${s.cid}']={acc:false,t:Date.now()}}`));
  let rr = await pg.ev(S(`({r:S.duel.done['${s.cid}'],coins:S.coins})`)); ok(rr.r && rr.r.r === 'back' && rr.r.why === 'declined' && rr.coins - c0 === 250, `P5. declined: ${JSON.stringify(rr.r)} +${rr.coins - c0}`);
  s = await pg.ev(send(250, 4)); c0 = await pg.ev(S('S.coins')); await pg.ev(S(`(D.pCancel('${s.cid}'),1)`)); await sleep(800);
  rr = await pg.ev(S(`({r:S.duel.done['${s.cid}'],coins:S.coins})`)); ok(rr.r && rr.r.why === 'cancel' && rr.coins - c0 === 250, `P5. cancelled: ${JSON.stringify(rr.r)} +${rr.coins - c0}`);
  s = await pg.ev(send(250, 4)); c0 = await pg.ev(S('S.coins')); await pg.ev(at(2026, 12, 21, 11, 0)); await pg.ev(load);
  rr = await pg.ev(S(`({r:S.duel.done['${s.cid}'],coins:S.coins})`)); ok(rr.r && rr.r.why === 'expired' && rr.coins - c0 === 250, `P5. not answered in a day: ${JSON.stringify(rr.r)} +${rr.coins - c0}`);
  // P8. can't afford
  await pg.ev(S('(S.coins=50,x.persist(),1)')); s = await pg.ev(send(100, 3)); ok(!s.cid && /(You need 100 coins|Enter a stake of 1 to 50 coins)/.test(s.pops[0] || ''), `P8. 50 coins, a 100 stake: refused ${JSON.stringify(s.pops)}`);
  await pg.ev(S('(S.coins=20000,x.persist(),1)'));
  // P6. his pact to me
  await pg.ev(at(2026, 12, 22, 10, 0));
  await pg.ev(J(`function(d){d.pout['jp1']={to:'${me}',toName:'Fey',stake:500,goal:3,days:7,t:Date.now()}}`)); await sleep(500);
  const pops6 = await pg.ev(`[].map.call(document.querySelectorAll('#layer .pop'),function(p){return p.innerText}).filter(function(t){return /Gym Pact/.test(t)})`);
  c0 = await pg.ev(S('S.coins')); await pg.ev(S("(D.pAccept('jp1'),1)")); await sleep(800);
  const acc = await pg.ev(S(`({held:S.duel.held['jp1'],coins:S.coins,mine:(JSON.parse(localStorage.getItem('qbsbx:duel/${me}')||'{}').pans||{})['jp1']||null,st:(D.pAll().filter(function(c){return c.cid==='jp1'})[0]||{}).st})`));
  ok(pops6.some((t) => /Justin asked you to a Gym Pact: 3 workout days in 7, 500 coins each/.test(t)) && acc.held === 500 && c0 - acc.coins === 500 && acc.mine && acc.mine.acc && acc.st === 'live', `P6. his pact: notice ${JSON.stringify(pops6)}; accepted: held ${acc.held}, my doc ${JSON.stringify(acc.mine)}, ${acc.st}`);
  // P7. a quest-XP challenge still settles
  await pg.ev(at(2026, 12, 23, 10, 0));
  const q7 = await pg.ev(`(async function(){var S=window.__qb.x().S,D=window.__qbDuel,b=Object.keys(S.duel.held);D.st.f={to:'sb_justin',kind:'q',goal:4,stake:100,days:1};await D.send();await new Promise(function(r){setTimeout(r,300)});return Object.keys(S.duel.held).filter(function(k){return b.indexOf(k)<0})[0]||null})()`);
  await pg.ev(J(`function(d){d.ans['${q7}']={acc:true,t:Date.now()}}`)); await pg.ev(quest('discipline', 0));
  await pg.ev(at(2026, 12, 24, 12, 0)); c0 = await pg.ev(S('S.coins')); await pg.ev(J(`function(d){d.sc['${q7}']={n:5,fin:true,t:Date.now()}}`));
  rr = await pg.ev(S(`({r:S.duel.done['${q7}'],coins:S.coins})`)); ok(rr.r && rr.r.r === 'won' && rr.coins - c0 === 200, `P7. a quest-XP challenge (my 25+ XP vs his 5): ${JSON.stringify(rr.r && { r: rr.r.r, my: rr.r.my, on: rr.r.on })} +${rr.coins - c0}`);
  ok(!pg.errs.length, `page errors: ${pg.errs.length} ${pg.errs.slice(0, 2).join(' | ')}`);
  console.log(P.length ? `W-PACT: ${P.length} problem(s)` : 'W-PACT: PASS');
  await br.close(); process.exit(P.length ? 1 : 0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(2); });
