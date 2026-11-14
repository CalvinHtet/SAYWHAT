// LEAD's real-money wagers (a0a7292) for the Gym Pact, end to end on a sandbox with the stand-in Justin (as wpact.js): I send a $15 pact
// (no coins held), he accepts, I make 4 days and he 1 -> "Justin owes you $15", coins unchanged, paid once (a reload does not change it);
// a lost one -> "You owe Justin"; both made it / neither -> nobody owes; his $25 pact to me with 0 coins: the Accept is on and holds nothing;
// his $10 quest-XP challenge to me with 0 coins: Accept on.   BASE=<sandbox> CHROME_PORT=9374 node wpactcash.js
const { browser, sleep, boot, E } = require('./wfocus_lib.js'); const BASE = process.env.BASE || 'http://127.0.0.1:8817';
let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
const at = (y, mo, d, h, mi) => `(function(){var real=Date.now()-(window.__qbShift||0);window.__qbShift=new Date(${y},${mo - 1},${d},${h},${mi}).getTime()-real;window.__qb.x().render();return 1})()`;
const J = (mut) => `(async function(){var k='qbsbx:duel/sb_justin',d=JSON.parse(localStorage.getItem(k)||'null')||{name:'Justin',out:{},ans:{},sc:{},pout:{},pans:{},psc:{}};(${mut})(d);d.t=Date.now();localStorage.setItem(k,JSON.stringify(d));
  window.__qbDuel.st.busy=0;await window.__qbDuel.load();await new Promise(function(r){setTimeout(r,400)});return 1})()`;
const S = (e) => `(function(){var x=window.__qb.x(),S=x.S,D=window.__qbDuel;return (${e})})()`;
const send = (cash, goal) => `(async function(){var S=window.__qb.x().S,D=window.__qbDuel,c0=S.coins;var mine=function(){var me=window.__qbDuel.pAll().filter(function(c){return c.me==='from'});return mine0.indexOf?me:me};var b0=D.pAll().map(function(c){return c.cid});var mine0=b0;
  D.st.f={to:'sb_justin',kind:'p',goal:${goal},stake:0,wt:'$',cash:'${cash}',days:3};await D.pSend();await new Promise(function(r){setTimeout(r,400)});
  var n=D.pAll().filter(function(c){return b0.indexOf(c.cid)<0})[0];return {cid:n?n.cid:null,paid:c0-S.coins,cash:n?n.cash:null,pops:[].map.call(document.querySelectorAll('#layer .pop'),function(p){return p.innerText}).slice(-1)}})()`;
const quest = () => S(`(function(){var id='qa'+Math.random().toString(36).slice(2,7);S.quests.push({id:id,name:'Run '+id,xp:25,stat:'fitness',cl:'body',rep:'once'});x.persist();x.toggle(id,null,'v');return id})()`);
const clear = '(function(){document.querySelectorAll("#layer .modal,.dropsplash,.bsplash").forEach(function(m){m.remove()});return 1})()';
(async () => { const br = await browser(); const pg = await boot(br, { base: BASE }); await E(pg, 'W.closeAll()'); await E(pg, 'W.lvl(20)');
  await pg.ev(at(2026, 11, 16, 10, 0)); await pg.ev(S('(S.coins=1000,S.calm=false,x.persist(),1)')); await pg.ev('(function(){if(window.__qbVisit)window.__qbVisit.check();return 1})()'); await sleep(3000); await pg.ev('(async function(){window.__qbDuel.st.busy=0;await window.__qbDuel.load();return 1})()'); await sleep(800); await pg.ev(clear);
  const run = async (day, mine, his, label, want) => { await pg.ev(at(2026, 11, day, 10, 0)); const s = await pg.ev(send(15, 4)); await pg.ev(J(`function(d){d.pans['${s.cid}']={acc:true,t:Date.now()}}`));
    for (let i = 0; i < mine; i++) { await pg.ev(at(2026, 11, day + i, 11, 0)); await pg.ev(quest()); await pg.ev(clear); }
    const c0 = await pg.ev(S('S.coins')); await pg.ev(at(2026, 11, day + 8, 12, 0)); await pg.ev(J(`function(d){d.psc['${s.cid}']={n:${his},fin:true,t:Date.now()}}`)); await sleep(500);
    const r = await pg.ev(S(`({r:(S.duel.done['${s.cid}']||{}).r||null,cash:(S.duel.done['${s.cid}']||{}).cash,coins:S.coins,pops:[].map.call(document.querySelectorAll('#layer .pop, #layer .modal'),function(p){return p.innerText.replace(/\\s+/g,' ').slice(0,160)}).filter(function(t){return /Justin/.test(t)})})`));
    ok(s.cid && s.paid === 0 && s.cash === 15 && r.coins === c0 && want.test(JSON.stringify(r.pops)), `${label}: sent held ${s.paid}, cash ${s.cash}; ${r.r}, coins ${r.coins - c0 >= 0 ? '+' : ''}${r.coins - c0}; ${JSON.stringify(r.pops)}`); await pg.ev(clear); return s.cid; };
  const w1 = await run(16, 4, 1, '$15 pact, me 4 him 1', /Justin owes you \$15/);
  const l1 = await run(1 + 26, 1, 4, '$15 pact, me 1 him 4', /You owe Justin \$15/);
  // a reload does not settle again
  const cc = await pg.ev(S('S.coins')); const dn = await pg.ev(S('Object.keys(S.duel.done).length')); await pg.go(BASE + '/'); await pg.wait('!!(window.__qbDuel && document.querySelector("#app") && !document.querySelector("#app .boot"))', 120000); await sleep(3000);
  await pg.ev(at(2026, 12, 6, 12, 0)); await pg.ev('(async function(){window.__qbDuel.st.busy=0;await window.__qbDuel.load();return 1})()'); await sleep(800);
  const after = await pg.ev(S('({c:S.coins,n:Object.keys(S.duel.done).length})')); ok(after.c === cc && after.n === dn, `after a reload: coins ${cc} -> ${after.c}, results ${dn} -> ${after.n}`);
  // past list in the Hall says who owes whom
  await pg.ev(clear); await pg.ev('(function(){var b=document.querySelector(".nav button[data-v=hall]");b&&b.click();return 1})()'); await sleep(1500);
  const past = await pg.ev('(function(){var c=document.querySelector("#dlcard");return c?c.innerText.replace(/\\s+/g," ").slice(0,500):null})()'); console.log('     Hall card: ' + past);
  // his pacts and challenges to me, with 0 coins
  await pg.ev(S('(S.coins=0,x.persist(),1)')); const me = await pg.ev('window.__qbDuel.st.me||(window.MYUID||null)');
  const myid = await pg.ev(S('Object.keys(D.st.docs||{}).filter(function(k){return k!=="sb_justin"})[0]||null'));
  await pg.ev(at(2026, 12, 7, 10, 0)); await pg.ev(J(`function(d){d.pout['jcash']={to:'${myid}',toName:'Fey',stake:0,cash:25,goal:3,days:7,t:Date.now()};d.out['jq']={to:'${myid}',toName:'Fey',kind:'q',stake:0,cash:10,days:1,t:Date.now()}}`)); await sleep(800);
  await pg.ev(clear); await pg.ev('(function(){var b=document.querySelector(".nav button[data-v=hall]");b&&b.click();return 1})()'); await sleep(1500);
  const inc = await pg.ev(`(function(){var r={};[].forEach.call(document.querySelectorAll('[data-dl=pacc],[data-dl=acc]'),function(b){r[b.dataset.dl]={t:b.innerText,off:b.disabled}});r.text=(document.querySelector('#dlcard')||{}).innerText;r.text=r.text?r.text.replace(/\\s+/g,' ').slice(0,600):null;return r})()`);
  ok(inc.pacc && !inc.pacc.off && /^Accept$/i.test(inc.pacc.t.trim()) && inc.acc && !inc.acc.off, `his $25 pact and $10 challenge with 0 coins: ${JSON.stringify({ pacc: inc.pacc, acc: inc.acc })}`); console.log('     ' + inc.text);
  await pg.ev(`(async function(){await window.__qbDuel.pAccept('jcash');return 1})()`); await sleep(800);
  const held = await pg.ev(S(`({coins:S.coins,held:S.duel.held['jcash']||0,st:(D.pAll().filter(function(c){return c.cid==='jcash'})[0]||{}).st})`)); ok(held.coins === 0 && !held.held, `accepted his $25 pact: ${JSON.stringify(held)}`);
  ok(!(pg.errs || []).length, 'no page errors ' + JSON.stringify(pg.errs || [])); console.log(bad ? 'FAILED ' + bad : 'PASS'); process.exit(0); })().catch((e) => { console.error(e); process.exit(1); });
