// Goals (SPEC8 part 3) on the v0.91 build, LEAD 16:08 (from a level-18 v0.90 save after the reset): a mid player's Loft goals (half/full rows for owned rooms, story-trigger rows),
// the building view's Goals button with the ready count and the "Next goal" line, each goal paying once on Claim (again: nothing;
// after a reload: nothing), no goal naming a room the player doesn't have, and after the one-time reset the goals already claimed
// stay claimed when the rooms are bought again.
//   BASE=http://127.0.0.1:8817 CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/wunlock_goals.js
const fs = require('fs');
const SEEDS = require('path').join(__dirname, 'seeds') + '/'; // saves in rigtest/qa/seeds (v0.88, v0.89, v0.90; test names only)
const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8817', OUT = process.env.OUT || require('os').tmpdir() + '/qa-out/wunlock/goals/';
fs.mkdirSync(OUT, { recursive: true });
const LIB = `var x=window.__qb.x(),S=x.S,A=x.ADDONS,T=x.ROOMT,G=window.__qbGoals;
  function find(t){return S.base.slots.filter(function(r){return r&&r.t===t})[0]}
  function slot(t){var r=find(t);if(r)return r;r={t:t,a:{},st:0,pend:0};var i=S.base.slots.indexOf(null);if(i<0)S.base.slots.push(r);else S.base.slots[i]=r;return r}
  function cnt(t){return (A[t]||[]).filter(function(a){var e=a[3]||{};return !e.retired&&!e.opens&&!e.trophy})}
  function setN(t,n){var r=slot(t),k={};Object.keys(r.a||{}).forEach(function(id){if((A[t]||[]).some(function(a){return a[0]===id&&(a[3]||{}).opens}))k[id]=1});cnt(t).slice(0,n).forEach(function(a){k[a[0]]=1});r.a=k}
  function opener(t){var o=null;Object.keys(A).forEach(function(k){(A[k]||[]).forEach(function(a){if((a[3]||{}).opens===t)o=[k,a[0]]})});if(o)slot(o[0]).a[o[1]]=1;slot(t)}
  function rows(bi){return G.list(bi).map(function(g){return (g.got?'claimed':g.met?'READY':'-')+' '+g.id+' "'+g.txt+'"'+(g.prog?' ('+g.prog+')':'')+' +'+g.c+'c +'+g.xp+'xp'})}
  function notOwned(){var have=S.base.slots.filter(Boolean).map(function(r){return r.t});return Object.keys(T).filter(function(k){return have.indexOf(k)<0}).map(function(k){return T[k].name})}`;
(async () => {
  const br = await browser(); const pg = await br.page({ fresh: true });
  const log = (...a) => console.log(a.map((v) => (typeof v === 'string' ? v : JSON.stringify(v))).join(' '));
  // a level-18 v0.90 player (every tab open) after the one-time reset: the Bedroom is all that's left, S.goals empty
  const SEED = JSON.parse(fs.readFileSync(process.env.SEED || SEEDS + 'v90_mid.json', 'utf8'));
  await pg.go(BASE + '/version.json'); await pg.ev(`(function(d){localStorage.clear();Object.keys(d).forEach(function(k){localStorage.setItem(k,d[k])});return 1})(${JSON.stringify(SEED)})`);
  await pg.go(BASE + '/'); await pg.wait('!!(window.__qbGoals && window.__qb.x().S.reset91 && document.querySelector(".nav button[data-v=board]"))', 120000); await sleep(3000);
  for (let k = 0; k < 6; k++) { await pg.ev('(function(){document.querySelectorAll(".dropsplash .dsx").forEach(function(b){b.click()});document.querySelectorAll("#layer .modal").forEach(function(e){e.remove()});return 1})()'); await sleep(300); }
  log('level', await pg.ev('window.__qb.x().effLvl()'), '| reset', await pg.ev('JSON.stringify(window.__qb.x().S.reset91)'), '| S.goals', await pg.ev('JSON.stringify(window.__qb.x().S.goals||null)'));
  // 1. a mid player: Bedroom 60% (Closet and Patio open), Closet half, Patio 1
  const m = await pg.ev(`(function(){${LIB}document.querySelectorAll("#layer .modal").forEach(function(e){e.remove()});
    opener('closet');opener('patio');setN('bedroom',Math.ceil(cnt('bedroom').length*.6));setN('closet',Math.ceil(cnt('closet').length*.5));setN('patio',1);
    S.coins=1000;x.persist();x.render();var txt=G.list(0).map(function(g){return g.txt+' '+g.prog}).join(' | '),nm=notOwned().filter(function(n){return n&&new RegExp('\\\\b'+n+'\\\\b').test(txt)});
    return {rows:rows(0),ready:G.ready(0),spoil:nm,other:[1,2].map(function(b){return G.list(b).length})}})()`);
  log('1. mid player, Loft goals:'); m.rows.forEach((r) => log('   ' + r)); log('   ready', m.ready, '| names of rooms not owned in the goals:', m.spoil.length ? m.spoil : 'none', '| goals in buildings 1 and 2:', m.other);
  // 2. the building view: Goals button with the ready count, Next goal line
  await pg.ev('(function(){var b=document.querySelector(".nav button[data-v=hideout]");b&&b.click();return 1})()'); await sleep(3500);
  await pg.ev('(function(){document.querySelectorAll(".dropsplash .dsx").forEach(function(b){b.click()});document.querySelectorAll("#layer .modal").forEach(function(e){e.remove()});return 1})()'); await sleep(500);
  let v = await pg.ev('(function(){var b=document.querySelector(".glbtn"),n=document.querySelector(".glnext");return {btn:b?b.innerText.replace(/\\s+/g," "):null,next:n?n.innerText:null}})()');
  if (!v.btn) { // the Goals button is in a building's view (30_app_b.js:20), not on the street
    await pg.ev(`(function(){var b=document.querySelector('[data-act=bldgo][data-v="0"]');if(b)b.dispatchEvent(new MouseEvent('click',{bubbles:true}));return 1})()`); await sleep(3000);
    v = await pg.ev('(function(){var b=document.querySelector(".glbtn"),n=document.querySelector(".glnext");return {btn:b?b.innerText.replace(/\\s+/g," "):null,next:n?n.innerText:null,where:"building 0"}})()'); }
  log('2. building view: Goals button', JSON.stringify(v.btn), '(ready', m.ready + ') | next line', JSON.stringify(v.next), v.where || 'street');
  await pg.shot(OUT + 'building_goals.png');
  // 3. claim each ready goal through the window, then once more by hook, then reload
  const c = await pg.ev(`(async function(){${LIB}var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})},out=[];
    var b=document.querySelector(".glbtn");if(!b)return {err:"no Goals button"};b.click();await w(600);
    for(var k=0;k<12;k++){var cb=document.querySelector('#layer [data-gl=claim]');if(!cb)break;var id=cb.dataset.id,g=G.list(0).filter(function(q){return q.id===id})[0],c0=S.coins,x0=S.xp;cb.click();await w(500);
      out.push({id:id,want:[g.c,g.xp],got:[S.coins-c0,Math.round((S.xp-x0)*100)/100]})}
    var again=[];Object.keys(S.goals||{}).forEach(function(id){var c0=S.coins;G.claim(id,0);again.push(S.coins-c0)});
    await w(300);x.persist();return {claims:out,againPaid:again,goals:Object.keys(S.goals||{})}})()`, 60000);
  log('3. claims:', c.err || ''); (c.claims || []).forEach((q) => log(`   ${q.id}: paid ${q.got[0]} coins / ${q.got[1]} XP, goal says ${q.want[0]} / ${q.want[1]}${q.got[0] === q.want[0] ? '' : '  <-- coins differ'}`));
  log('   claimed again by hook, coins paid:', c.againPaid, '| S.goals', c.goals);
  await pg.go(BASE + '/'); await pg.wait('!!(window.__qbGoals && document.querySelector(".nav button[data-v=board]"))', 120000); await sleep(3000);
  const r2 = await pg.ev(`(function(){${LIB}var c0=S.coins;Object.keys(S.goals||{}).forEach(function(id){G.claim(id,0)});document.querySelectorAll("#layer .modal").forEach(function(e){e.remove()});return {ready:G.ready(0),paid:S.coins-c0,rows:rows(0)}})()`);
  log('   after a reload: ready', r2.ready, '| claiming the claimed ones paid', r2.paid);
  // 4. the one-time reset with goals already claimed: Bedroom full and claimed, reset, Bedroom bought again
  const z = await pg.ev(`(async function(){${LIB}var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})};
    setN('bedroom',cnt('bedroom').length);x.persist();var pre=G.list(0).filter(function(g){return /bedroom/.test(g.id)}).map(function(g){return g.id+(g.got?' claimed':g.met?' ready':'')});
    G.list(0).forEach(function(g){if(g.met&&!g.got)G.claim(g.id,0)});document.querySelectorAll("#layer .modal").forEach(function(e){e.remove()});var claimed=Object.keys(S.goals).slice();
    window.__qbReset.mark();var R=window.__qbReset.run();await w(2200);document.querySelectorAll("#layer .modal").forEach(function(e){e.remove()});
    var after=S.base.slots.filter(Boolean).map(function(r){return r.t+'('+Object.keys(r.a||{}).length+')'});
    var rowsAfterReset=rows(0);opener('closet');opener('patio');setN('bedroom',cnt('bedroom').length);setN('closet',cnt('closet').length);x.persist();
    var c0=S.coins,x0=S.xp,L=G.list(0);L.forEach(function(g){if(g.met)G.claim(g.id,0)});document.querySelectorAll("#layer .modal").forEach(function(e){e.remove()});
    return {pre:pre,claimed:claimed,reset:R,after:after,rowsAfterReset:rowsAfterReset,rebuilt:rows(0),paidOnRebuild:S.coins-c0,newlyPaid:L.filter(function(g){return g.met&&!g.got}).map(function(g){return g.id+' +'+g.c})}})()`, 60000);
  log('4. before the reset, Bedroom rows:', z.pre); log('   claimed:', z.claimed); log('   reset:', z.reset, '| rooms after', z.after);
  log('   rows right after the reset:'); z.rowsAfterReset.forEach((r) => log('     ' + r));
  log('   Bedroom and Closet bought again to full:'); z.rebuilt.forEach((r) => log('     ' + r));
  log('   coins paid when claiming everything met after the rebuild:', z.paidOnRebuild, '| goals that paid (should be only ones never claimed before):', z.newlyPaid);
  log('page errors', pg.errs.length, pg.errs.slice(0, 3));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
