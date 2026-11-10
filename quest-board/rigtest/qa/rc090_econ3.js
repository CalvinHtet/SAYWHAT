// rc-0.90 economy QA, part 3: story rooms open on several triggers (W25). The Restaurant's locked card in the Garden window, each
// trigger as the last one met (day, coins, level), where else the triggers show (Boba lot, Dessert card), and old saves (v0.88)
// keeping rooms they already opened. Fresh profiles; v0.88 saves are made on 8810 and moved into the rc-0.90 sandbox.
//   CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/rc090_econ3.js
const fs = require('fs');
const { browser, sleep } = require('./cdp.js');
const NEW = process.env.BASE || 'http://127.0.0.1:8816', OLD = 'http://127.0.0.1:8810', OUT = process.env.OUT || 'C:/Users/clvh/qa-wt/out/rc090/econ/';
const PART = process.env.PART || 'gate,old';
(async () => {
  const br = await browser();
  const ready = (pg) => pg.wait('!!(window.__qb && window.__qb.x && window.__qbStory && document.querySelector("#app"))', 120000);
  const clear = (pg) => pg.ev(`(function(){document.querySelectorAll('#layer .modal,.modal,.dropsplash').forEach(function(e){e.remove()});return 1})()`);
  if (PART.includes('gate')) {
    const pg = await br.page({ fresh: true });
    await pg.go(NEW + '/'); await ready(pg); await sleep(1500);
    await pg.ev(`(function(){var x=window.__qb.x(),S=x.S;S.created=true;S.char=window.__qb.fixChar({name:'QA',sex:'m'});S.welcomed=1;S.xp=x.cum(2);
      ['bedroom','closet','patio','gameroom'].forEach(function(t){window.__qbRooms.open(t,1)});window.__qbRooms.open('garden',1);var o=window.__qbStory.state();o.sold=12;
      document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});x.persist();x.render();return 1})()`);
    await sleep(500); await clear(pg);
    // the Garden window's locked Restaurant card
    const card = async (file) => {
      await clear(pg);
      const t = await pg.ev(`(function(){window.__qbStory.check();document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});var x=window.__qb.x(),S=x.S,i=S.base.slots.findIndex(function(r){return r&&r.t==='garden'});window.__qb.roomModal(i);
        var m=[].slice.call(document.querySelectorAll('.rmodal .addon.mystery')).map(function(e){return e.innerText.replace(/\\s+/g,' ')});var c=document.querySelector('.rmodal .addon.mystery');if(c)c.scrollIntoView({block:'center'});
        return {lvl:x.effLvl(),earned:S.earnedC,open:JSON.stringify(window.__qbStory.state().open),today:new Date(Date.now()-5*36e5).toISOString().slice(0,10),cards:m}})()`);
      await sleep(1200); await pg.shot(OUT + file); console.log(file + ' ' + JSON.stringify(t)); return t;
    };
    await card('story_restaurant_locked_0.png');
    await pg.ev(`(function(){var S=window.__qb.x().S;S.earnedC=(S.earnedC||0)+1240;return 1})()`);
    await card('story_restaurant_locked_1240.png');
    // each trigger as the last one met. "opened" = the chef's scene (Mara) comes up on a story check
    const tryOpen = (tag, setup) => pg.ev(`(function(){var x=window.__qb.x(),S=x.S,o=window.__qbStory.state();delete o.seen;delete o.stepDay;o.later={};delete o.offer.chef;delete o.done.chef;
      document.querySelectorAll('#layer .modal,.modal').forEach(function(e){e.remove()});(${setup})(x,S,o);
      window.__qbStory.check();var sc=!!document.querySelector('#layer [data-act=styyes][data-v=chef]');document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});
      var P=o.open.garden;return {tag:'${tag}',lvl:x.effLvl(),since:S.earnedC-P.c,gardenDay:P.d,today:(function(){var d=new Date(Date.now()-5*36e5);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')})(),chefScene:sc}})()`);
    const R = [];
    // A: day last
    R.push(await tryOpen('A day missing (lvl 3, 2000 since, same day)', `function(x,S,o){S.xp=x.cum(3);S.earnedC=o.open.garden.c+2000}`));
    await pg.ev(`(function(){window.__qbShift=(window.__qbShift||0)+864e5;return 1})()`);
    R.push(await tryOpen('A next game day', `function(x,S,o){}`));
    // B: coins last (a day has passed now)
    R.push(await tryOpen('B coins 1999', `function(x,S,o){S.xp=x.cum(3);S.earnedC=o.open.garden.c+1999}`));
    R.push(await tryOpen('B coins 2000', `function(x,S,o){S.earnedC=o.open.garden.c+2000}`));
    // C: level last
    R.push(await tryOpen('C level 2', `function(x,S,o){S.xp=x.cum(2);S.earnedC=o.open.garden.c+5000}`));
    R.push(await tryOpen('C level 3', `function(x,S,o){S.xp=x.cum(3)}`));
    // D: game day starts at 5 am: garden opened yesterday 23:00 game time -> 05:00 today ok? (garden day = yesterday string)
    R.push(await tryOpen('D all met but garden opened today (moved)', `function(x,S,o){S.xp=x.cum(3);var d=new Date(Date.now()-5*36e5);o.open.garden.d=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}`));
    R.forEach((r) => console.log(JSON.stringify(r)));
    // where do the later rooms' triggers show? restaurant built, boba gate met (served 80), triggers not met
    const later = await pg.ev(`(function(){var x=window.__qb.x(),S=x.S,o=window.__qbStory.state();o.done.chef=1;o.offer.chef=1;window.__qbRooms.open('restaurant',1);S.base.served=100;S.xp=x.cum(8);
      document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});window.__qbStory.check();var sc=document.querySelector('#layer [data-act=styyes]');var scv=sc?sc.dataset.v:null;document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});
      x.render();var txt=document.body.innerText,hit=/coins earned since the Restaurant opened/.test(txt);
      var ri=S.base.slots.findIndex(function(r){return r&&r.t==='restaurant'});window.__qb.roomModal(ri);var rt=document.querySelector('.rmodal')?document.querySelector('.rmodal').innerText:'';var hitR=/since the Restaurant opened|Level 9 of 9|Level 8 of 9/.test(rt);
      document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});
      var nb=document.createElement('button');nb.dataset.act='nav';nb.dataset.v='hideout';document.body.appendChild(nb);nb.click();nb.remove();
      return {bobaGate:window.__qbRooms.gate('boba'),scene:scv,lots:window.__qbStory.lots(),boardText:hit,restaurantWindow:hitR,open:o.open}})()`);
    await sleep(2500);
    const lt = await pg.ev(`(function(){var t=document.body.innerText;return {loftView:document.querySelector('.nav .on')?document.querySelector('.nav .on').dataset.v:'',mentionsBoba:/Boba/i.test(t),triggers:/coins earned since|Opens tomorrow|Level \\d+ of \\d+/.test(t)}})()`);
    await pg.shot(OUT + 'story_loft_boba_locked.png');
    console.log('later rooms: ' + JSON.stringify(later) + ' loft ' + JSON.stringify(lt));
    console.log('gate page errors', pg.errs.length, JSON.stringify(pg.errs.slice(0, 4)));
    await pg.close();
  }
  if (PART.includes('old')) {
    // (1) the full v0.88 level-60 seed; (2) a v0.88 save made now with only the Garden, Restaurant and Boba open, little earned
    const seed = JSON.parse(fs.readFileSync('C:/Users/clvh/qa-wt/out/seed_adv2.json', 'utf8'));
    const p0 = await br.page({ fresh: true });
    await p0.go(OLD + '/'); await ready(p0); await sleep(1500);
    await p0.ev(`(function(){var x=window.__qb.x(),S=x.S;S.created=true;S.char=window.__qb.fixChar({name:'Old',sex:'f'});S.welcomed=1;S.xp=x.cum(6);
      ['bedroom','closet','patio','gameroom'].forEach(function(t){window.__qbRooms.open(t,1)});window.__qbRooms.open('boba',1);S.earnedC=900;
      document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});x.persist();return 1})()`);
    await sleep(2500);
    const partial = await p0.ev(`(function(){var x=window.__qb.x();x.persist();var o={};for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);o[k]=localStorage.getItem(k)}return o})()`);
    const pinfo = JSON.parse(partial['quest-board'] || '{}');
    console.log('v0.88 partial save: rooms ' + (pinfo.base ? pinfo.base.slots.filter(Boolean).map((r) => r.t).join(',') : '?') + ' story.open ' + JSON.stringify((pinfo.story || {}).open) + ' appv-keys ' + Object.keys(partial).join(','));
    await p0.close();
    for (const [tag, dump] of [['seed_adv2', seed], ['v088_partial', partial]]) {
      const pg = await br.page({ fresh: true });
      const before = JSON.parse(dump['quest-board'] || '{}');
      await pg.go(NEW + '/version.json');
      await pg.ev(`(function(d){localStorage.clear();Object.keys(d).forEach(function(k){localStorage.setItem(k,d[k])});return 1})(${JSON.stringify(dump)})`);
      await pg.go(NEW + '/'); await ready(pg); await sleep(5000);
      const r = await pg.ev(`(function(){var x=window.__qb.x(),S=x.S;window.__qbStory.check();var o=window.__qbStory.state();
        var dc=[];S.base.slots.forEach(function(r,i){if(!r)return;window.__qb.roomModal(i);[].forEach.call(document.querySelectorAll('.rmodal .addon.mystery'),function(e){var t=e.innerText.replace(/\\s+/g,' ');if(/since/.test(t))dc.push(r.t+': '+t)});document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()})});
        return {lvl:x.effLvl(),rooms:S.base.slots.filter(Boolean).map(function(r){return r.t}),ups:S.base.slots.reduce(function(a,r){return a+(r?Object.keys(r.a||{}).length:0)},0),coins:S.coins,earned:S.earnedC,open:o.open,done:Object.keys(o.done),mystery:dc,lots:window.__qbStory.lots()}})()`);
      const bRooms = before.base ? before.base.slots.filter(Boolean).map((x) => x.t) : [];
      const lost = bRooms.filter((t) => !r.rooms.includes(t));
      console.log(tag + ': before rooms ' + bRooms.length + ' ups ' + (before.base ? before.base.slots.reduce((a, x) => a + (x ? Object.keys(x.a || {}).length : 0), 0) : '?') + ' -> after ' + r.rooms.length + ' ups ' + r.ups + '; lost ' + JSON.stringify(lost) + '; lvl ' + r.lvl + ' coins ' + r.coins + ' earned ' + r.earned);
      console.log('  story.open ' + JSON.stringify(r.open) + ' lots ' + JSON.stringify(r.lots));
      console.log('  trigger cards ' + JSON.stringify(r.mystery));
      if (tag === 'v088_partial') {
        // Boba's window: the Dessert card's triggers for a save whose Boba opened before the update
        await pg.ev(`(function(){var x=window.__qb.x(),S=x.S,i=S.base.slots.findIndex(function(r){return r&&r.t==='boba'});window.__qb.roomModal(i);var c=document.querySelector('.rmodal .addon.mystery');if(c)c.scrollIntoView({block:'center'});return 1})()`);
        await sleep(1200); await pg.shot(OUT + 'story_old_boba_dessert_card.png');
      }
      console.log('  page errors', pg.errs.length, JSON.stringify(pg.errs.slice(0, 4)));
      await pg.close();
    }
  }
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
