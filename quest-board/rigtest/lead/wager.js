// Challenge wagers (Cal, 2026-11-14): a typed coin stake (any whole number you have), and "Real money": a dollar amount the app only
// records (no coins move; the end says who owes whom). On the sandbox build with QA's stand-in neighbour Justin (qbsbx:duel/sb_justin),
// as rigtest/qa/wpact.js does.   BASE=<sandbox dist-web server> CHROME_PORT=9374 node rigtest/lead/wager.js
const { browser, sleep, boot, E } = require('../qa/wfocus_lib.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8817';
let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
const at = (y, mo, d, h, mi) => `(function(){var real=Date.now()-(window.__qbShift||0);window.__qbShift=new Date(${y},${mo - 1},${d},${h},${mi}).getTime()-real;window.__qb.x().render();return 1})()`;
const clear = '(function(){document.querySelectorAll("#layer .modal,.dropsplash,.bsplash").forEach(function(m){m.remove()});return 1})()';
const J = (mut) => `(async function(){var k='qbsbx:duel/sb_justin',d=JSON.parse(localStorage.getItem(k)||'null')||{name:'Justin',out:{},ans:{},sc:{},pout:{},pans:{},psc:{}};(${mut})(d);d.t=Date.now();localStorage.setItem(k,JSON.stringify(d));
  window.__qbDuel.st.busy=0;await window.__qbDuel.load();await new Promise(function(r){setTimeout(r,400)});return 1})()`;
const load = '(async function(){window.__qbDuel.st.busy=0;await window.__qbDuel.load();await new Promise(function(r){setTimeout(r,500)});return 1})()';
const S = (e) => `(function(){var x=window.__qb.x(),S=x.S,D=window.__qbDuel;return (${e})})()`;
const pops = '[].map.call(document.querySelectorAll("#layer .pop, .pop"),function(p){return p.innerText}).slice(-3)';
const send = (f) => `(async function(){var S=window.__qb.x().S,D=window.__qbDuel,c0=S.coins,mine=function(){var me=Object.keys(D.st.docs).filter(function(k){return !/^sb_/.test(k)})[0];return (D.st.docs[me]||{}).out||{}};var before=Object.keys(mine());
  D.st.f=Object.assign({to:'sb_justin',kind:'q',days:1,goal:4},${JSON.stringify(f)});await D.send();await new Promise(function(r){setTimeout(r,400)});
  var out=mine(),cid=Object.keys(out).filter(function(k){return before.indexOf(k)<0})[0]||null;return {cid:cid,paid:c0-S.coins,doc:cid?out[cid]:null,held:cid?(S.duel.held[cid]||0):null,pops:${pops}}})()`;
(async () => {
  const br = await browser(); const pg = await boot(br, { base: BASE }); await E(pg, 'W.closeAll()'); await E(pg, 'W.lvl(20)');
  await pg.ev(at(2026, 11, 16, 10, 0)); await pg.ev(S('(S.coins=1000,x.persist(),1)'));
  await pg.ev('(function(){if(window.__qbVisit)window.__qbVisit.check();return 1})()'); await sleep(3000); await pg.ev(load);
  // the form: Coins / Real money, a typed amount
  await pg.ev(clear); await pg.ev(S("(D.st.f.kind='q',D.st.f.wt='c',D.st.f.to='sb_justin',D.newOpen(),1)")); await sleep(600);
  const f1 = await pg.ev(`(function(){var m=document.querySelector('#layer .dlm');if(!m)return null;var i=document.getElementById('dlstake');i.value='333';i.dispatchEvent(new Event('input',{bubbles:true}));
    return {wt:[].map.call(m.querySelectorAll('[data-k=wt]'),function(b){return b.innerText}),input:!!i,stake:window.__qbDuel.st.f.stake,send:!m.querySelector('[data-dl=send]').disabled,old:m.querySelectorAll('[data-k=stake]').length}})()`);
  ok(f1 && f1.wt.join() === 'Coins,Real money' && f1.input && f1.stake === 333 && f1.send && f1.old === 0, `the form: Coins / Real money, typed 333 coins, Send on, no fixed buttons ${JSON.stringify(f1)}`);
  const f2 = await pg.ev(`(function(){var i=document.getElementById('dlstake');i.value='5000';i.dispatchEvent(new Event('input',{bubbles:true}));return !document.querySelector('#layer .dlm [data-dl=send]').disabled})()`);
  ok(f2 === false, 'more coins than you have: Send is off');
  const f3 = await pg.ev(`(function(){document.querySelector('#layer .dlm [data-k=wt][data-v="$"]').click();var i=document.getElementById('dlcash');if(!i)return null;i.value='20';i.dispatchEvent(new Event('input',{bubbles:true}));
    var m=document.querySelector('#layer .dlm');return {note:/never moves money/.test(m.innerText),send:!m.querySelector('[data-dl=send]').disabled,cash:window.__qbDuel.st.f.cash}})()`);
  ok(f3 && f3.note && f3.send && f3.cash === '20', `Real money: a dollar field, "never moves money", Send on ${JSON.stringify(f3)}`);
  await pg.ev(clear);
  // a typed coin stake: held, and in the doc
  const s1 = await pg.ev(send({ wt: 'c', stake: 333, cash: '' }));
  ok(s1.cid && s1.paid === 333 && s1.held === 333 && s1.doc.stake === 333 && !s1.doc.cash, `333 coins: held 333, the doc says stake 333 ${JSON.stringify(s1)}`);
  await pg.ev(S(`(D.cancel('${s1.cid}'),1)`)); await sleep(800); await pg.ev(load);
  const back = await pg.ev(S('S.coins')); ok(back === 1000, `cancelled: the 333 are back (${back})`);
  // a real-money one: no coins move, the doc carries cash
  const s2 = await pg.ev(send({ wt: '$', stake: 0, cash: '20' }));
  ok(s2.cid && s2.paid === 0 && !s2.held && s2.doc.stake === 0 && s2.doc.cash === 20, `$20: no coins held, the doc says cash 20 ${JSON.stringify(s2)}`);
  await pg.ev(J(`function(d){d.ans['${s2.cid}']={acc:true,t:Date.now()}}`)); await pg.ev(load);
  const hall = `(async function(){var b=document.querySelector('.nav button[data-v="hall"]');if(b)b.click();await new Promise(function(r){setTimeout(r,1200)});document.querySelectorAll("#layer .modal,.dropsplash,.bsplash").forEach(function(m){m.remove()});var t=document.querySelector('.htab [data-t="posts"],[data-act=htab][data-t="posts"]');if(t)t.click();await new Promise(function(r){setTimeout(r,800)});return 1})()`;
  await pg.ev(hall);
  const live = await pg.ev(`(function(){var c=document.getElementById('dlcard');return c?c.innerText.replace(/\\s+/g,' '):''})()`);
  const pub = await pg.ev(`(function(){var t=document.getElementById('app').innerText.replace(/\\s+/g,' '),i=t.indexOf('challenged');return i<0?'':t.slice(i-20,i+160)})()`);
  // my score: a quest during the day; Justin's final 0
  await pg.ev(S("(function(){var id='qw'+Math.random().toString(36).slice(2,6);S.quests.push({id:id,name:'Report',xp:25,stat:'productivity',cl:'admin',rep:'once'});x.persist();x.toggle(id);return 1})()")); await sleep(500);
  await pg.ev(at(2026, 11, 17, 12, 0)); await pg.ev(J(`function(d){d.sc['${s2.cid}']={n:0,fin:true,t:Date.now()}}`)); await pg.ev(load); await sleep(800);
  const r2 = await pg.ev(S(`(function(){var r=S.duel.done['${s2.cid}'];return {r:r,coins:S.coins,pops:${pops}}})()`));
  await pg.ev(hall);
  const fin = await pg.ev(`(function(){var c=document.getElementById('dlcard');if(!c)return '';var d=c.querySelector('details');if(d)d.open=true;return c.innerText.replace(/\\s+/g,' ')})()`);
  ok(r2.r && r2.r.r === 'won' && r2.r.cash === 20 && r2.r.c === 0 && /Justin owes you \$20/.test(fin), `won: no coins from the bet, the card says "Justin owes you $20" ${JSON.stringify(r2.r)} | ${fin.slice(0, 200)}`);
  console.log('     live card: ' + live.slice(0, 160)); console.log('     Town post: ' + pub);
  ok(/\$20 on it/.test(live), 'the live card says "$20 on it" to the two players');
  ok(/side bet between them/.test(pub) && !/\$/.test(pub), 'the Town post says "a side bet between them", no amount');
  console.log('     errors', JSON.stringify(pg.errs || [])); console.log(bad ? 'FAILED ' + bad : 'PASS'); process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
