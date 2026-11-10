// QA w-chests checks 2 and 3 (the 300 chest): 1,000 rolls with S.relics2 reset each time (and the accessory given back), then
// rolls with nothing reset until every relic of the three chest tiers and every accessory is owned, then coins. Also the bar's
// drawn widths at 250 XP (check 1).
const { open, log, closeModals, nav, sleep } = require('./wchests_lib.js');
const L = log('roll');
(async () => {
  const { br, pg } = await open({ lv: 30 });
  // check 1 extra: the drawn widths of both bars at 250 XP
  L('bars at 250', await pg.ev(`(function(){var x=window.__qb.x(),S=x.S;S.done={};window.__qbEcon.xp();S.dq.tx=250;S.dq.tier=3;x.render();
    var b=document.querySelector('.bl-bar'),bb=b.getBoundingClientRect(),is=[].map.call(b.querySelectorAll('i'),function(i){var r=i.getBoundingClientRect();return {cls:i.className,w:Math.round(r.width),bg:getComputedStyle(i).backgroundImage.slice(0,60)+' '+getComputedStyle(i).backgroundColor}});
    document.querySelector('.bline').click();var d=document.querySelector('.dq-bar'),db=d.getBoundingClientRect(),ds=[].map.call(d.querySelectorAll('i'),function(i){var r=i.getBoundingClientRect();return {cls:i.className,w:Math.round(r.width),bg:getComputedStyle(i).backgroundColor}});
    return {boardBar:Math.round(bb.width),board:is,cardBar:Math.round(db.width),card:ds,accent:getComputedStyle(document.body).getPropertyValue('--accent'),gold:getComputedStyle(document.body).getPropertyValue('--gold')}})()`));
  await closeModals(pg); await nav(pg, 'board');
  // 1,000 rolls, each from an empty relic collection and with the accessory handed back
  const r1 = await pg.ev(`(function(){var x=window.__qb.x(),S=x.S,F=window.__qbFree,c0=S.coins,e0=S.earnedC,o0=JSON.stringify(S.owned),cnt={low:0,mid:0,high:0,legendary:0,acc:0,coins:0},bad=[];
    var accPool=F.pool({slots:/^a_acc$/,brands:'all'}).length;
    for(var i=0;i<1000;i++){S.relics2={};var g=F.roll();
      if(g.kind==='relic')cnt[g.r.tier]++;else if(g.kind==='wear'){cnt.acc++;if(g.it[1]!=='a_acc')bad.push(g.it[0]);delete S.owned[g.it[0]]}else cnt.coins++}
    var dc=S.coins-c0;S.coins=c0;S.earnedC=e0;S.relics2={};var same=JSON.stringify(S.owned)===o0;x.persist();
    return {cnt:cnt,coinsPaidInLoop:dc,notAcc:bad,accPool:accPool,ownedRestored:same}})()`, 120000);
  L('1000 rolls (reset each time)', r1);
  // a second 1,000 for a steadier picture
  const r1b = await pg.ev(`(function(){var x=window.__qb.x(),S=x.S,F=window.__qbFree,c0=S.coins,cnt={low:0,mid:0,high:0,legendary:0,acc:0,coins:0};
    for(var i=0;i<1000;i++){S.relics2={};var g=F.roll();if(g.kind==='relic')cnt[g.r.tier]++;else if(g.kind==='wear'){cnt.acc++;delete S.owned[g.it[0]]}else cnt.coins++}
    S.coins=c0;S.relics2={};x.persist();return cnt})()`, 120000);
  L('second 1000 rolls', r1b);
  // until empty: nothing reset
  const r2 = await pg.ev(`(function(){var x=window.__qb.x(),S=x.S,F=window.__qbFree,seenR={},seenW={},dupR=[],dupW=[],ownedBefore=[],firstCoins={},log=[],n=0,c0=S.coins;
    var accPool=F.pool({slots:/^a_acc$/,brands:'all'}).length,relTot={low:12,mid:8,high:6};
    S.relics2={};
    for(n=0;n<6000;n++){var cb=S.coins,g=F.roll(),paid=S.coins-cb;
      if(g.kind==='relic'){if(seenR[g.r.id])dupR.push(g.r.id);seenR[g.r.id]=1;if(paid)log.push('relic+coins '+paid)}
      else if(g.kind==='wear'){if(seenW[g.it[0]])dupW.push(g.it[0]);seenW[g.it[0]]=1}
      else{var k=g.why;if(!firstCoins[k])firstCoins[k]={n:g.n,paid:paid,atRoll:n};}
      var left=F.pool({slots:/^a_acc$/,brands:'all'}).length,rl=F.relics.filter(function(r){return r.tier!=='legendary'&&!S.relics2[r.id]}).length;
      if(!left&&!rl&&Object.keys(firstCoins).length>=4)break}
    var byTier={};Object.keys(seenR).forEach(function(id){var t=F.relics.filter(function(r){return r.id===id})[0].tier;byTier[t]=(byTier[t]||0)+1});
    var res={rolls:n+1,accPoolAtStart:accPool,accGiven:Object.keys(seenW).length,relicsByTier:byTier,legendaryFromChest:byTier.legendary||0,dupRelics:dupR,dupWear:dupW,coinsAfterEmpty:firstCoins,
      accLeft:F.pool({slots:/^a_acc$/,brands:'all'}).length,coinsTotal:S.coins-c0};
    // ten more rolls, all coins now
    var tail=[];for(var j=0;j<10;j++){var cb2=S.coins,g2=F.roll();tail.push(g2.kind+':'+(S.coins-cb2))}res.tail=tail;return res})()`, 240000);
  L('until empty', r2);
  L('page errors', pg.errs.length, pg.errs.slice(0, 5));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
