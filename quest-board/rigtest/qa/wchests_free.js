// QA w-chests check 3: no duplicate from any free source until its pool is empty, then the fallback. Sources: crawl finds
// (__qbDungeon.find), the Wheel's slivers (the real Spin button, the first random number pinned to a sliver), the Weekly Warrior
// prize (a verified weekly4 quest with the week at 3 of 4), the level crate (renown crates past level 100, through toggle).
const { open, log, closeModals, nav, sleep } = require('./wchests_lib.js');
const L = log('free');
const PH = process.env.PH || 'crawl,wheel,weekly,crate';
(async () => {
  const { br, pg } = await open({ lv: 100 });
  const E = (s, t) => pg.ev(`(function(){var x=window.__qb.x(),S=x.S,F=window.__qbFree;${s}})()`, t);
  L('start', await E(`return {lvl:x.effLvl(),coins:S.coins,owned:Object.keys(S.owned).length,live:window.__qbDrops.state().live.map(function(b){return b.id}),vault:(window.__qbDrops.state().vault||[]).map(function(b){return b.id})}`));
  await E(`window.__qaOwned=JSON.stringify(S.owned);return 1`);
  const restore = () => E(`S.owned=JSON.parse(window.__qaOwned);x.persist();return Object.keys(S.owned).length`);

  if (PH.includes('crawl')) {
    // every dungeon, a sure find each time (dry at the pity mark), until nothing is left to find; then 40 more per dungeon
    const r = await E(`var DG=[["cellar",[30,80]],["metro",[40,110]],["sewer",[65,155]],["tower",[85,205]],["mines",[110,265]],["arcade",[140,335]],["spire",[180,420]]];
      var D=S.dng||(S.dng={});var seen={},dup=[],kinds={},wasOwned=[],n=0,after={},pool0=window.__qbDungeon.wear()?1:0;
      var crawlWearPool=function(){var st=window.__qbDrops.state(),ids=function(L){return (L||[]).map(function(b){return b.id})};var re=/^a_(top|pants|shoes|acc|hat|back|mask)$/;
        return F.pool({slots:re,brands:ids(st.vault)}).length+F.pool({slots:re,brands:ids(st.live)}).length+F.pool({slots:re,brands:[],basics:true}).length};
      var wp0=crawlWearPool();
      for(var k=0;k<4000;k++){var d=DG[k%DG.length],dd={id:d[0],c:d[1],name:d[0]};S.dng.dry=9;
        var c0=S.coins,g=window.__qbDungeon.find(dd,null);n++;if(!g)continue;var key=g.kind+':'+(g.set||'')+':'+(g.id||'');kinds[g.kind]=(kinds[g.kind]||0)+1;
        if(g.kind==='wear'||g.kind==='piece'||g.kind==='ally'){if(seen[key])dup.push(key);seen[key]=1}
        if(g.kind==='coins'&&S.coins-c0!==g.n)dup.push('coins mismatch '+g.n+' vs '+(S.coins-c0));
        var left=DG.every(function(d){return window.__qbDungeon.hidden({id:d[0],c:d[1]}).length===0})&&!window.__qbDungeon.wear();if(left&&!after.at)after.at=n;if(after.at&&n>after.at+280)break}
      var tail={};for(var j=0;j<70;j++){var d2=DG[j%DG.length];S.dng.dry=9;var g2=window.__qbDungeon.find({id:d2[0],c:d2[1],name:d2[0]},null);tail[g2.kind]=(tail[g2.kind]||0)+1}
      return {crawls:n,wearPoolAtStart:wp0,kinds:kinds,distinctGiven:Object.keys(seen).length,dups:dup,emptyAtCrawl:after.at,tail70:tail,wearLeft:crawlWearPool()}`, 240000);
    L('crawl', r);
    L('restore owned', await restore());
  }

  if (PH.includes('wheel')) {
    const WP = `F.pool({slots:/^a_(top|pants|shoes|acc|hat|back|mask)$/,brands:'all'})`;
    L('wheel pool', await E(`var p=${WP};window.__qaKeep=p.slice(0,4).map(function(it){return it[0]});p.slice(4).forEach(function(it){S.owned[it[0]]=true});x.persist();return {pool:p.length,leftForTest:${WP}.map(function(it){return it[0]})}`));
    await nav(pg, 'wheel'); await sleep(800);
    for (let i = 0; i < 6; i++) {
      const r = await E(`S.wheel=null;x.render();var b=document.querySelector('[data-act=spin]');if(!b||b.disabled)return {err:'no spin button',dis:b&&b.disabled};
        var own0=JSON.stringify(S.owned),c0=S.coins,R=Math.random,first=true;Math.random=function(){if(first){first=false;return 0.205}return R()};
        try{b.click()}finally{Math.random=R}var o1=S.owned,o0=JSON.parse(own0),nw=Object.keys(o1).filter(function(k){return o1[k]&&!o0[k]});
        return {res:S.wheelRes,newItems:nw,coins:S.coins-c0,left:${WP}.length}`);
      L('spin ' + (i + 1), r);
      await sleep(4000);
    }
    await pg.shot('C:/Users/clvh/qa-wt/out/wchests/free_wheel_after.png');
    // the helper itself over the whole wheel pool (no pre-owning): never an owned piece, never twice
    await restore();
    L('wheel pool drained by freeItem', await E(`var seen={},dup=0,wasOwned=0,n=0,it;while((it=F.item({slots:/^a_(top|pants|shoes|acc|hat|back|mask)$/,brands:'all'}))&&n<3000){n++;if(seen[it[0]])dup++;if(S.owned[it[0]])wasOwned++;seen[it[0]]=1;S.owned[it[0]]=true}
      return {given:n,dup:dup,wasOwned:wasOwned,thenNull:F.item({slots:/^a_(top|pants|shoes|acc|hat|back|mask)$/,brands:'all'})===null}`));
    L('restore owned', await restore());
  }

  // a normal daily quest (for crates) and the weekly4 one (for Weekly Warrior)
  await E(`if(!S.quests.some(function(q){return q.rep!=='weekly4'}))S.quests.push({id:'qaq1',name:'QA chore',xp:20,stat:'productivity',cl:'home',why:'qa',rep:'daily'});x.persist();x.render();return 1`);
  const qs = await E(`var w=S.quests.filter(function(q){return q.rep==='weekly4'})[0],d=S.quests.filter(function(q){return q.rep!=='weekly4'&&!S.done[q.id]})[0];return {w:w&&w.id,wn:w&&w.name,d:d&&d.id,dn:d&&d.name}`);
  L('quests', qs);
  const LP = `F.pool({slots:/^a_/,brands:window.__qbDrops.state().live.map(function(b){return b.id}),basics:true})`;

  if (PH.includes('weekly') && qs.w) {
    await closeModals(pg); await nav(pg, 'board');
    L('weekly pool', await E(`var p=${LP};p.slice(3).forEach(function(it){S.owned[it[0]]=true});S.renown=1e9;S.weekPaid={};x.persist();return {pool:p.length,left:${LP}.map(function(it){return it[0]})}`));
    // prime: find this week's key
    await E(`if(S.done['${qs.w}'])x.toggle('${qs.w}');S.wcount={};x.toggle('${qs.w}',null,'v');return 1`); await sleep(2600); await closeModals(pg);
    const wk = await E(`var k=Object.keys(S.wcount||{});x.toggle('${qs.w}');return k`);
    L('week key', wk);
    for (let i = 0; i < 4; i++) {
      await closeModals(pg);
      const pre = await E(`if(S.done['${qs.w}'])x.toggle('${qs.w}');S.weekPaid={};S.wcount=S.wcount||{};S.wcount['${wk[0]}']=3;window.__qaO=JSON.stringify(S.owned);window.__qaC=S.coins;x.toggle('${qs.w}',null,'v');return {wcount:S.wcount['${wk[0]}']}`);
      let m = null; try { await pg.wait('!!document.querySelector("#wwok")', 6000); m = await pg.ev(`document.querySelector('#wwok').closest('.box2').innerText.replace(/\\s+/g,' ')`); } catch (e) {}
      if (i === 0 || i === 3) await pg.shot(`C:/Users/clvh/qa-wt/out/wchests/free_weekly_${i + 1}.png`);
      const post = await E(`var o0=JSON.parse(window.__qaO),nw=Object.keys(S.owned).filter(function(k){return S.owned[k]&&!o0[k]});var b=document.querySelector('#wwok');var c1=S.coins;if(b)b.click();return {newItems:nw,coinsBeforeClaim:c1-window.__qaC,coinsAfterClaim:S.coins-window.__qaC,left:${LP}.length}`);
      L('weekly ' + (i + 1), pre, { modal: m }, post);
      await sleep(600);
    }
    L('restore owned', await restore());
  }

  if (PH.includes('crate') && qs.d) {
    await closeModals(pg); await nav(pg, 'board');
    L('crate pool', await E(`var p=${LP};p.slice(4).forEach(function(it){S.owned[it[0]]=true});S.xp=x.cum(100)+500000;x.persist();return {pool:p.length,left:${LP}.map(function(it){return it[0]})}`));
    for (let i = 0; i < 6; i++) {
      const r = await E(`if(S.done['${qs.d}'])x.toggle('${qs.d}');S.renown=0;S.crates={};var o0=JSON.stringify(S.owned),sp0=JSON.stringify(S.sp),c0=S.coins;
        var n0=document.querySelectorAll('.pop,.toast').length;x.toggle('${qs.d}');var o=JSON.parse(o0),nw=Object.keys(S.owned).filter(function(k){return S.owned[k]&&!o[k]});
        return {renown:S.renown,crates:Object.keys(S.crates),newItems:nw,sp:[sp0,JSON.stringify(S.sp)],left:${LP}.length}`);
      await sleep(300);
      const pop = await pg.ev(`(function(){var t=document.body.innerText.match(/Renown[^\\n]{0,120}/g);return t?t.slice(-1)[0]:null})()`);
      L('crate ' + (i + 1), r, { pop });
      await closeModals(pg);
    }
    await pg.shot('C:/Users/clvh/qa-wt/out/wchests/free_crate_last.png');
    L('restore owned', await restore());
  }
  L('page errors', pg.errs.length, pg.errs.slice(0, 5));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
