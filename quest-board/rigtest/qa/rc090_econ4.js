// rc-0.90 economy QA, part 4: page errors on Board, Shop, Loft, room windows, Relics, Hall (v0.88 level-60 seed and a new player),
// and a passive-share spot check: the seed cut down to a level-40 player with typical rooms (the Loft, Garden, Restaurant, Boba,
// Dessert, each about half upgraded) playing one of Cal's days (10 chores, one photo, the weekly workout), then 14 hours of
// business production collected. Wheel and crawls are not played (the doc's averages are added and labelled).
//   CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/rc090_econ4.js
const fs = require('fs');
const { browser, sleep } = require('./cdp.js');
const NEW = 'http://127.0.0.1:8816', OUT = 'C:/Users/clvh/qa-wt/out/rc090/econ/';
const PART = process.env.PART || 'errs,passive';
(async () => {
  const br = await browser();
  const seed = JSON.parse(fs.readFileSync('C:/Users/clvh/qa-wt/out/seed_adv2.json', 'utf8'));
  const ready = (pg) => pg.wait('!!(window.__qb && window.__qb.x && window.__qbStory && document.querySelector(".nav button[data-v=board]"))', 120000);
  const clear = (pg) => pg.ev(`(function(){document.querySelectorAll('#layer .modal,.modal,.dropsplash').forEach(function(e){e.remove()});return 1})()`);
  const load = async (dump) => {
    const pg = await br.page({ fresh: true });
    if (dump) { await pg.go(NEW + '/version.json'); await pg.ev(`(function(d){localStorage.clear();Object.keys(d).forEach(function(k){localStorage.setItem(k,d[k])});return 1})(${JSON.stringify(dump)})`); }
    await pg.go(NEW + '/');
    if (!dump) {
      await pg.wait('!!(window.__qb && window.__qb.x && document.querySelector("#app"))', 120000); await sleep(1500);
      await pg.ev(`(function(){var x=window.__qb.x(),S=x.S;S.created=true;S.char=window.__qb.fixChar({name:'New',sex:'f'});S.welcomed=1;x.persist();x.render();return 1})()`);
    }
    await ready(pg); await sleep(4000); return pg;
  };
  if (PART.includes('errs')) {
    for (const [tag, dump] of [['seed lv60', seed], ['new player', null]]) {
      const pg = await load(dump);
      const log = [];
      const step = async (name, js, shot) => {
        const n0 = pg.errs.length; await clear(pg);
        let r = null; try { r = await pg.ev(js); } catch (e) { r = 'EVAL ' + e.message.slice(0, 120); }
        await sleep(2500); if (shot) await pg.shot(OUT + shot);
        log.push(name + ': ' + (pg.errs.length - n0) + ' errors' + (r && r !== 1 ? ' (' + JSON.stringify(r).slice(0, 80) + ')' : ''));
      };
      const nav = (v) => `(function(){var b=document.createElement('button');b.dataset.act='nav';b.dataset.v='${v}';document.body.appendChild(b);b.click();b.remove();return document.querySelector('.nav .on')?document.querySelector('.nav .on').dataset.v:'none'})()`;
      await step('Board', nav('board'));
      await step('Shop', nav('shop'));
      await step('Shop wardrobe', `(function(){var b=document.querySelector('[data-act=stab][data-v=wardrobe]');if(b)b.click();return !!b})()`);
      await step('Loft', nav('hideout'), tag === 'seed lv60' ? 'errs_loft_seed.png' : null);
      await step('Room window restaurant', `(function(){var S=window.__qb.x().S,i=S.base.slots.findIndex(function(r){return r&&r.t==='restaurant'});if(i<0)i=S.base.slots.findIndex(function(r){return !!r});window.__qb.roomModal(i);return S.base.slots[i].t})()`);
      await step('Room window auditorium/bedroom', `(function(){var S=window.__qb.x().S,i=S.base.slots.findIndex(function(r){return r&&r.t==='auditorium'});if(i<0)i=S.base.slots.findIndex(function(r){return r&&r.t==='bedroom'});window.__qb.roomModal(i);return S.base.slots[i].t})()`);
      await step('Relics', nav('trophy'));
      await step('Relics tab', `(function(){var b=document.querySelector('[data-act=dgtab][data-v=relics]');if(b)b.click();return !!b})()`, tag === 'seed lv60' ? 'errs_relics_seed.png' : null);
      await step('Hall', nav('hall'));
      await step('Board again', nav('board'));
      console.log(tag + ' | ' + log.join(' | '));
      console.log('  all errors ' + pg.errs.length + ' ' + JSON.stringify(pg.errs.slice(0, 5)));
      await pg.close();
    }
  }
  if (PART.includes('passive')) {
    const pg = await load(seed);
    const setup = await pg.ev(`(function(){var x=window.__qb.x(),S=x.S,keep=['bedroom','closet','lair','trophy','patio','gameroom','garden','restaurant','boba','dessert'];
      S.xp=x.cum(40)+50;S.gates=[];var g,n=0;while((g=x.gated())!==null&&n++<20)S.gates.push(g);
      S.base.slots=S.base.slots.map(function(r){return r&&keep.indexOf(r.t)>=0?r:null});
      S.base.slots.forEach(function(r){if(!r)return;var L=(x.ADDONS[r.t]||[]).filter(function(a){return !(a[3]&&a[3].retired)}),a={};
        L.forEach(function(u,k){var e=u[3]||{};if(k<Math.ceil(L.length/2)&&!e.opens)a[u[0]]=1;if(e.opens&&keep.indexOf(e.opens)>=0)a[u[0]]=1});r.a=a;r.pend=0});
      var st=window.__qbStory.state();var rel=S.r2?Object.keys(S.r2.own||S.r2||{}).length:0;
      x.persist();x.render();return {lvl:x.effLvl(),gates:S.gates.length,rooms:S.base.slots.filter(Boolean).map(function(r){return r.t+':'+Object.keys(r.a).length+'/'+(x.ADDONS[r.t]||[]).filter(function(a){return !(a[3]&&a[3].retired)}).length}),sp:window.__qbEcon.stats(),share:window.__qbEcon.share(),relicKeys:Object.keys(S).filter(function(k){return /r2|relic/i.test(k)}),streak:S.streak}})()`);
    console.log('setup ' + JSON.stringify(setup));
    // next game day, 09:00: a new day's Daily Quest; Cal's 10 chores, one with a photo, the weekly workout with a photo
    const day = await pg.ev(`(function(){var x=window.__qb.x(),S=x.S,R=Date.now(),c=new Date(R),t=new Date(c.getFullYear(),c.getMonth(),c.getDate()+1,9,0,0).getTime();window.__qbShift=(window.__qbShift||0)+(t-R);
      x.simulate();x.rollover();document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});S.base.slots.forEach(function(r){if(r)r.pend=0});S.rest={x:0,from:''};
      var wk=S.quests.filter(function(q){return q.rep==='weekly4'})[0];S.quests=[10,10,10,15,15,15,25,25,25,25].map(function(xp,k){return {id:'cal'+k,name:'Chore '+k,xp:xp,stat:['discipline','fitness','productivity','creativity'][k%4],cl:'home',rep:'daily'}});if(wk)S.quests.push(wk);
      var c0=S.coins,x0=S.xp,led={};S.quests.forEach(function(q,k){if(q.rep==='weekly4'&&S.done[q.id])return;var v=(k===6||q.rep==='weekly4');x.toggle(q.id,null,v?'v':undefined);document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()})});
      led.questCoins=Object.keys(S.cdone).reduce(function(a,k){return a+S.cdone[k]},0);led.questXp=S.xp-x0;led.weekly=!!wk;
      window.__qbEcon.trained(50,'push');led.training=300;
      var c1=S.coins;for(var k=0;k<6;k++){window.__qbEcon.check();document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()})}led.chests=S.coins-c1;
      led.dqXp=window.__qbEcon.xp();led.eff=Math.round(window.__qbEcon.eff()*100)/100;led.share=Math.round(window.__qbEcon.share()*1000)/1000;led.cap=window.__qbRooms.pay().room;led.totalCoinsDelta=S.coins-c0;
      return led})()`);
    console.log('day ' + JSON.stringify(day));
    // business rates now (after the quests), from each coin room's window
    const rates = await pg.ev(`(function(){var x=window.__qb.x(),S=x.S,o=[];S.base.slots.forEach(function(r,i){if(!r)return;var T=x.ROOMT[r.t];if(!(T.coin||T.food))return;window.__qb.roomModal(i);var c=document.querySelector('.rmodal .chip.xp');o.push(r.t+': '+(c?c.textContent:''));document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()})});return o})()`);
    console.log('rates ' + JSON.stringify(rates));
    await pg.shot(OUT + 'passive_lv40.png');
    // 14 hours of production (to 23:00, same game day), then Collect all and sell produce
    const eve = await pg.ev(`(function(){var x=window.__qb.x(),S=x.S;x.simulate();window.__qbShift+=14*36e5;x.simulate();var pend=S.base.slots.reduce(function(a,r){return a+(r?Math.floor(r.pend||0):0)},0);
      var c0=S.coins,b=document.createElement('button');b.dataset.act='rall';document.body.appendChild(b);b.click();b.remove();var biz=S.coins-c0;document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});
      var veg=Math.floor((S.base.food&&S.base.food.veg)||0),c1=S.coins;var s=document.createElement('button');s.dataset.act='stysell';document.body.appendChild(s);s.click();s.remove();
      return {pendingAfter14h:pend,collected:biz,capLeft:window.__qbRooms.pay().room,produceSold:S.coins-c1,veg:veg}})()`);
    console.log('evening ' + JSON.stringify(eve));
    const wheel = 835, crawls = 5 * 170 * Math.min(1.5, Math.max(0.5, day.eff));
    const active = day.questCoins + day.chests + day.training, passive = eve.collected + eve.produceSold;
    console.log('share: passive ' + passive + ' / (active ' + active + ' + passive) = ' + (100 * passive / (active + passive)).toFixed(1) + '%; with wheel ~' + wheel + ' and crawls ~' + Math.round(crawls) + ' (doc averages, not run): ' + (100 * passive / (active + passive + wheel + crawls)).toFixed(1) + '%');
    console.log('passive page errors', pg.errs.length, JSON.stringify(pg.errs.slice(0, 4)));
    await pg.close();
  }
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
