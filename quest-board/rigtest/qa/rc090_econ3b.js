// rc-0.90 econ QA, part 3b: the Restaurant's trigger card when the Garden has fewer than 4 other upgrades left to buy, and the
// day trigger with the Garden's opening recorded the way real play records it (story state first, then the Garden built).
//   CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/rc090_econ3b.js
const { browser, sleep } = require('./cdp.js');
const NEW = process.env.BASE || 'http://127.0.0.1:8816', OUT = process.env.OUT || 'C:/Users/clvh/qa-wt/out/rc090/econ/';
(async () => {
  const br = await browser();
  const pg = await br.page({ fresh: true });
  await pg.go(NEW + '/');
  await pg.wait('!!(window.__qb && window.__qb.x && window.__qbStory && document.querySelector("#app"))', 120000); await sleep(1500);
  const s0 = await pg.ev(`(function(){var x=window.__qb.x(),S=x.S;S.created=true;S.char=window.__qb.fixChar({name:'QA',sex:'m'});S.welcomed=1;S.xp=x.cum(2);
    ['bedroom','closet','patio','gameroom'].forEach(function(t){window.__qbRooms.open(t,1)});document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});
    window.__qbStory.check();var o=window.__qbStory.state(),a=JSON.stringify(o.open);document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});
    window.__qbRooms.open('garden',1);o.sold=12;S.earnedC=(S.earnedC||0);window.__qbStory.check();document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});
    var L=(x.ADDONS.garden||[]).filter(function(a){return !(a[3]&&a[3].retired)});
    return {openBefore:a,openAfter:JSON.stringify(o.open),gardenUps:L.length}})()`);
  console.log('setup ' + JSON.stringify(s0));
  const win = async (n, file) => {
    const t = await pg.ev(`(function(n){var x=window.__qb.x(),S=x.S,r=S.base.slots.filter(function(r){return r&&r.t==='garden'})[0];r.a={};
      var L=(x.ADDONS.garden||[]).filter(function(a){return !(a[3]&&a[3].retired)&&!(a[3]&&a[3].opens)});L.slice(0,n).forEach(function(a){r.a[a[0]]=1});
      document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});var i=S.base.slots.indexOf(r);window.__qb.roomModal(i);
      var c=[].slice.call(document.querySelectorAll('.rmodal .addon.next')).map(function(e){return e.innerText.replace(/\\s+/g,' ').slice(0,200)});
      var m=[].filter.call(document.querySelectorAll('.rmodal .addon.mystery'),function(e){return /since/.test(e.innerText)})[0];if(m)m.scrollIntoView({block:'center'});
      return {owned:n,of:L.length,shown:c}})(${n})`);
    await sleep(1200); if (file) await pg.shot(OUT + file);
    console.log(JSON.stringify(t));
  };
  await pg.ev(`(function(){var S=window.__qb.x().S;S.earnedC=(window.__qbStory.state().open.garden||{c:0}).c+1240;return 1})()`);
  for (const n of [0, 20]) await win(n);
  await win(1000, 'story_restaurant_triggers_card.png');
  // day trigger, real recording: level 3 and 2,000 coins since the Garden, same game day -> no scene; next game day -> scene
  const t = (tag) => pg.ev(`(function(){var x=window.__qb.x(),S=x.S,o=window.__qbStory.state();delete o.stepDay;delete o.seen;o.later={};document.querySelectorAll('#layer .modal,.modal').forEach(function(e){e.remove()});
    window.__qbStory.check();var sc=!!document.querySelector('#layer [data-act=styyes][data-v=chef]');document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});
    return {tag:'${tag}',lvl:x.effLvl(),since:S.earnedC-o.open.garden.c,gardenDay:o.open.garden.d,chefScene:sc}})()`);
  await pg.ev(`(function(){var x=window.__qb.x(),S=x.S;S.xp=x.cum(3);S.earnedC=window.__qbStory.state().open.garden.c+2000;return 1})()`);
  console.log(JSON.stringify(await t('same game day, level and coins met')));
  // 04:59 next morning (still the same game day), then 05:01
  const toHour = (h, m) => pg.ev(`(function(){var R=Date.now(),cur=new Date(R);var tgt=new Date(cur.getFullYear(),cur.getMonth(),cur.getDate()+1,${h},${m},0).getTime();window.__qbShift=(window.__qbShift||0)+(tgt-R);return new Date().toString().slice(0,24)})()`);
  console.log('clock ' + await toHour(4, 59)); console.log(JSON.stringify(await t('next day 04:59 (same game day)')));
  const back = await pg.ev(`(function(){var R=Date.now();var c=new Date(R);var tgt=new Date(c.getFullYear(),c.getMonth(),c.getDate(),5,1,0).getTime();window.__qbShift=(window.__qbShift||0)+(tgt-R);return new Date().toString().slice(0,24)})()`);
  console.log('clock ' + back); console.log(JSON.stringify(await t('05:01 (new game day)')));
  // the screen after the trigger: the triggers card with a tick on each
  console.log('page errors', pg.errs.length, JSON.stringify(pg.errs.slice(0, 4)));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
