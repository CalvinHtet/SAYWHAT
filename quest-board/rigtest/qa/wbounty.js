// w-bounty (v0.92): the pools (200 one-day, 100 two-day), no duplicates; each player's own order (two ids give different orders, both
// whole permutations; the game's order for this player matches the same algorithm); "Another" 3 times makes no call to Claude (network
// and window.claude watched); the 2-day window and its "N days left"; 1.5x / 2x pay; an old 3-day bounty quest from a v0.91 save stays
// until its end, pays 2x, then leaves; the old S.bty fields don't break anything.
//   BASE=<build> CHROME_PORT=9375 bash tools/windows/node.sh rigtest/qa/wbounty.js
const { browser, sleep, boot, E, PAGE } = require('./wfocus_lib.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8814';
const log = (...a) => console.log(a.map((v) => (typeof v === 'string' ? v : JSON.stringify(v))).join(' '));
const PT = (ymd, h = 12) => Date.parse(ymd + 'T00:00:00Z') + (h + 8) * 36e5;
(async () => {
  const br = await browser(); const pg = await boot(br, { base: BASE }); await E(pg, 'W.closeAll()'); await E(pg, 'W.lvl(10)');
  const net = []; await pg.s('Network.enable', {}); pg.on('Network.requestWillBeSent', (e) => net.push(e.request.url));
  await pg.ev('(function(){window.__qaAI=0;try{var c=window.claude;if(c){["complete","ai","call","use"].forEach(function(k){if(typeof c[k]==="function"){var f=c[k];c[k]=function(){if(k!=="use"||/ai|claude|complete/i.test(String(arguments[0])))window.__qaAI++;return f.apply(this,arguments)}}})}}catch(e){}return 1})()');
  // pools
  const P = await pg.ev(`(function(){var B=window.__qbBounty,n1=B.BTY1.map(function(x){return x[0]}),n2=B.BTY2.map(function(x){return x[0]}),dup=function(a){var s={},d=[];a.forEach(function(x){var k=x.toLowerCase().trim();if(s[k])d.push(x);s[k]=1});return d};
    var both=n1.filter(function(x){return n2.map(function(y){return y.toLowerCase()}).indexOf(x.toLowerCase())>=0});
    var bad=B.BTY1.concat(B.BTY2).filter(function(x){return !(x[0]&&x[1]&&x[2]>0&&x[3]&&x[4])}).map(function(x){return x[0]});
    return {n1:n1.length,n2:n2.length,dup1:dup(n1),dup2:dup(n2),inBoth:both,badRows:bad,same3:B.BTY3===B.BTY2,xp1:[Math.min.apply(null,B.BTY1.map(function(x){return x[2]})),Math.max.apply(null,B.BTY1.map(function(x){return x[2]}))],xp2:[Math.min.apply(null,B.BTY2.map(function(x){return x[2]})),Math.max.apply(null,B.BTY2.map(function(x){return x[2]}))]}})()`);
  log('pools:', P);
  // per-player order: the game's perm for this player vs the same algorithm (29f_bounty.js btySeed/btyPerm) for two other ids
  const O = await pg.ev(`(function(){var B=window.__qbBounty;var seed=function(s){var h=2166136261;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0};
    var perm=function(k,sd){var P=k===2?B.BTY2:B.BTY1,a=P.map(function(x,i){return i}),s=sd^(k*2654435761),r=function(){s=(s+0x6D2B79F5)|0;var t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296};
      for(var i=a.length-1;i>0;i--){var j=Math.floor(r()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a};
    var mine=B.perm(1),again=perm(1,seed('sandbox')),a=perm(1,seed('alice')),b=perm(1,seed('bob')),a2=perm(2,seed('alice')),b2=perm(2,seed('bob'));
    var whole=function(p,n){var s={};p.forEach(function(x){s[x]=1});return Object.keys(s).length===n&&p.length===n};
    var same=0;for(var i=0;i<a.length;i++)if(a[i]===b[i])same++;
    return {gameMatchesAlgo:JSON.stringify(mine)===JSON.stringify(again),aliceFirst5:a.slice(0,5),bobFirst5:b.slice(0,5),samePlaces:same,whole1:whole(a,B.BTY1.length)&&whole(b,B.BTY1.length),whole2:whole(a2,B.BTY2.length)&&whole(b2,B.BTY2.length),differ2:JSON.stringify(a2)!==JSON.stringify(b2)}})()`);
  log('orders:', O);
  // the 2-day window across a week, and the cards
  for (const d of ['2026-11-16', '2026-11-17', '2026-11-18', '2026-11-19', '2026-11-20']) {
    await pg.ev(`(function(){var real=Date.now()-(window.__qbShift||0);window.__qbShift=${PT(d)}-real;window.__qb.x().render();return 1})()`); await sleep(400);
    const c = await pg.ev(`(function(){var B=window.__qbBounty,cards=[].map.call(document.querySelectorAll('.bty-card'),function(x){return x.innerText.replace(/\\s+/g,' ').slice(0,70)});return {end2:B.end(2),pick1:B.pick(1).n,pick2:B.pick(2).n,cards:cards}})()`);
    log(`  ${d}: 2-day ends ${c.end2} | today "${c.pick1}" | 2-day "${c.pick2}" | ${JSON.stringify(c.cards)}`);
  }
  // Another x3 (and a 4th), with the network watched
  net.length = 0;
  const an = await pg.ev(`(async function(){var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})},out=[];for(var i=0;i<4;i++){var b=document.querySelector('[data-act=btynew][data-k="1"]');out.push(b?window.__qbBounty.pick(1).n:'(no Another button)');if(b){b.click();await w(500)}}
    return {seen:out,after:window.__qbBounty.pick(1).n,rr:window.__qbBounty.state().rr,ai:window.__qaAI}})()`);
  await sleep(1500);
  log('Another x4:', an, '| requests during it:', net.filter((u) => !/\.(png|webp|jpg|js|css|json)(\?|$)/.test(u)).slice(0, 6), '| any claude/anthropic/function URL:', net.some((u) => /claude|anthropic|function|\/api\//i.test(u)));
  // take both, the pay
  const pay = await pg.ev(`(async function(){var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})},x=window.__qb.x(),S=x.S,o={};
    for(var k of [1,2]){var b=document.querySelector('[data-act=btytake][data-k="'+k+'"]');if(!b){o[k]='no Take it';continue}b.click();await w(500);var q=S.quests.filter(function(q){return q.bty&&q.bty.k===k}).slice(-1)[0];var m=x.mults(q,{});o[k]={name:q.name,end:q.bty.end,xp:q.xp,tags:m.tags.join('|'),mins:q.mins}}return o})()`);
  log('taken:', pay);
  // the 2-day quest leaves after its window
  const left = await pg.ev(`(function(){var S=window.__qb.x().S,q=S.quests.filter(function(q){return q.bty&&q.bty.k===2}).slice(-1)[0];if(!q)return null;var end=q.bty.end;var real=Date.now()-(window.__qbShift||0);
    window.__qbShift=Date.parse(end+'T20:00:00Z')-real;window.__qb.x().render();var still=S.quests.some(function(x){return x===q});window.__qbShift=Date.parse(end+'T20:00:00Z')+2*864e5-real;window.__qb.x().render();
    return {end:end,onLastDay:still,twoDaysLater:window.__qb.x().S.quests.some(function(x){return x.id===q.id})}})()`);
  log('2-day quest window:', left);
  log('page errors', pg.errs.length, pg.errs.slice(0, 2)); await pg.close();
  // an old v0.91 save: a 3-day bounty quest still running, the old S.bty fields
  const p2 = await boot(br, { base: BASE }); await E(p2, 'W.closeAll()'); await E(p2, 'W.lvl(10)');
  await p2.ev(`(function(){var x=window.__qb.x(),S=x.S,real=Date.now()-(window.__qbShift||0);window.__qbShift=${PT('2026-11-16')}-real;
    S.quests.push({id:'q_old3',name:'Clear out the garage',xp:50,stat:'discipline',cl:'home',rep:'once',bty:{k:3,end:'2026-11-17',key:'3:2026-11-17'}});
    S.bty={d:'2026-11-15',rr:1,o1:2,e3:'2026-11-17',o3:1,ai1:{n:'Old AI bounty',why:'x',xp:25},ai3:null};x.persist();return 1})()`);
  await p2.go(BASE + '/'); await p2.wait('!!(window.__qb && document.querySelector(".nav button[data-v=board]"))', 120000); await sleep(2500); await p2.ev(PAGE);
  await p2.ev(`(function(){var real=Date.now()-(window.__qbShift||0);window.__qbShift=${PT('2026-11-16')}-real;window.__qb.x().render();return 1})()`);
  const old = await p2.ev(`(function(){var x=window.__qb.x(),S=x.S,q=S.quests.filter(function(q){return q.id==='q_old3'})[0];var m=q?x.mults(q,{}):null;var c0=S.coins;if(q)x.toggle('q_old3');
    return {kept:!!q,tags:m&&m.tags.join('|'),paid:Math.round(S.coins-c0),bty:JSON.stringify(S.bty),cards:[].map.call(document.querySelectorAll('.bty-card .label'),function(l){return l.innerText})}})()`);
  log('old 3-day bounty (v0.91 save):', old);
  await p2.ev(`(function(){var real=Date.now()-(window.__qbShift||0);window.__qbShift=${PT('2026-11-19')}-real;window.__qb.x().render();return 1})()`);
  log('   after its end (11-19): still on the board', await p2.ev('window.__qb.x().S.quests.some(function(q){return q.id==="q_old3"&&!window.__qb.x().S.done["q_old3"]})'));
  log('page errors', p2.errs.length, p2.errs.slice(0, 2));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
