// rc-0.89 save check (LEAD 10:28): a save written by an older build (v0.87 40910d9, v0.88 213ea0f) opens on the release candidate
// with level, XP, coins, items, rooms, upgrades and relics unchanged (QB_EPOCH stays 6), no "Two saves" window, no page errors.
//   SRC=http://127.0.0.1:8812,http://127.0.0.1:8810 DST=http://127.0.0.1:8811 bash tools/windows/node.sh rigtest/qa/rc089_savecheck.js
const fs = require('fs');
const { browser, sleep } = require('./cdp.js');
const SRC = (process.env.SRC || 'http://127.0.0.1:8812,http://127.0.0.1:8810').split(','), DST = process.env.DST || 'http://127.0.0.1:8811';
const OUT = process.env.OUT || 'C:/Users/clvh/qa-wt/out/rc089/save'; fs.mkdirSync(OUT, { recursive: true });
const SUM = `(function(){var x=window.__qb.x(),S=x.S,ks=function(o){return Object.keys(o||{}).sort()};
  return JSON.stringify({epoch:S.epoch,appv:S.appv,name:S.char&&S.char.name,sex:S.char&&S.char.sex,xp:S.xp,lvl:x.effLvl(),coins:S.coins,gates:(S.gates||[]).length,
    rooms:(S.base&&S.base.slots||[]).map(function(r){return r&&r.t}).join(','),ups:(S.base&&S.base.slots||[]).reduce(function(a,r){return a+ks(r&&r.a).length},0),
    owned:ks(S.owned).length,ownedIds:ks(S.owned).join(','),eq:JSON.stringify(S.eq||{}),relics:ks(S.relics).join(','),quests:(S.quests||[]).length,areaOn:ks(S.areaOn).join(','),
    streak:S.streak,total:S.total,earnedC:S.earnedC})})()`;
(async () => {
  const br = await browser(); let fails = 0;
  for (const src of SRC) {
    // 1. a player on the old build: Unlock everything, every upgrade, 20 Shop pieces owned and some worn, a few quests, relics as the game gives them
    const a = await br.page({ fresh: true });
    await a.go(src + '/'); await a.wait('!!(window.__qb && window.__qb.x && window.__qbRooms && document.querySelector("#app"))', 120000); await sleep(1500);
    await a.ev(`(function(){var x=window.__qb.x(),S=x.S;S.created=true;S.char=window.__qb.fixChar({name:'Saver',sex:'f'});S.xp=Math.max(S.xp||0,10);S.welcomed=1;x.persist();x.render();return 1})()`);
    await sleep(800);
    const made = await a.ev(`(function(){window.__qbRooms.unlockAll();var x=window.__qb.x(),S=x.S;
      Object.keys(x.ADDONS).forEach(function(t){if(S.base.slots.some(function(r){return r&&r.t===t}))window.__qbRooms.all(t,1)});
      S.xp=x.cum(42)+123;var g,n=0;S.coins=123456;S.owned=S.owned||{};var ids=(x.SHOP||[]).map(function(s){return s&&(s.id||s[0])}).filter(function(i){return typeof i==='string'}).slice(0,20);
      ids.forEach(function(i){S.owned[i]=true});S.quests=S.quests||[];for(var i=0;i<5;i++)S.quests.push({id:'q'+(900+i),name:'Save check '+i,xp:10,stat:'fitness',cl:'body',why:'',rep:'daily'});S.next=Math.max(S.next||1,905);
      document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});x.persist();x.render();return ids.length})()`);
    await sleep(9000); // the relic check runs 6 s after start, then every 20 s
    await a.ev('(function(){window.__qb.x().persist();return 1})()'); await sleep(1500);
    const before = JSON.parse(await a.ev(SUM));
    const dump = await a.ev('(function(){var o={};for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);o[k]=localStorage.getItem(k)}return o})()');
    const srcErrs = a.errs.slice(); await a.close();
    fs.writeFileSync(OUT + '/seed_from_' + before.appv + '.json', JSON.stringify(dump));
    // 2. the same storage on the release candidate
    const b = await br.page({ fresh: true });
    await b.go(DST + '/version.json');
    await b.ev(`(function(d){localStorage.clear();Object.keys(d).forEach(function(k){localStorage.setItem(k,d[k])});return 1})(${JSON.stringify(dump)})`);
    await b.go(DST + '/'); await b.wait('!!document.querySelector(".nav button[data-v=board]") || /Two saves/i.test(document.body.innerText)', 120000); await sleep(4000);
    const modalTxt = await b.ev('[].map.call(document.querySelectorAll("#layer .modal"),function(m){return m.innerText.slice(0,120).replace(/\\s+/g," ")}).join(" | ")');
    const after = JSON.parse(await b.ev(SUM));
    await b.shot(OUT + '/rc_from_appv' + before.appv + '.png');
    // reload once more: still the same, and the save is now written by APPV 89
    await b.ev('(function(){window.__qb.x().persist();return 1})()'); await sleep(1500);
    await b.go(DST + '/'); await b.wait('!!document.querySelector(".nav button[data-v=board]")', 120000); await sleep(3000);
    const again = JSON.parse(await b.ev(SUM));
    const keys = await b.ev('Object.keys(localStorage).filter(function(k){return /backup|state/.test(k)}).join(", ")');
    const diff = (A, B) => Object.keys(A).filter((k) => !['appv'].includes(k) && JSON.stringify(A[k]) !== JSON.stringify(B[k])).map((k) => k + ': ' + JSON.stringify(A[k]).slice(0, 80) + ' -> ' + JSON.stringify(B[k]).slice(0, 80));
    const d1 = diff(before, after), d2 = diff(after, again);
    console.log(`== save from ${src} (appv ${before.appv}, epoch ${before.epoch}): ${made} Shop pieces owned, ${before.rooms.split(',').length} rooms, ${before.ups} upgrades, lvl ${before.lvl}, xp ${before.xp}, coins ${before.coins}, relics [${before.relics}]`);
    console.log('   on rc: ' + (d1.length ? 'CHANGED ' + d1.join('; ') : 'everything the same') + ` (appv ${before.appv} -> ${after.appv})`);
    console.log('   after a save and reload on rc: ' + (d2.length ? 'CHANGED ' + d2.join('; ') : 'the same') + ` (appv ${again.appv})`);
    console.log('   windows open on load: ' + (modalTxt || 'none') + '; storage keys: ' + keys);
    console.log('   page errors: old build ' + srcErrs.length + ', rc ' + b.errs.length + (b.errs.length ? ' ' + b.errs.slice(0, 3).join(' | ') : ''));
    if (d1.length || d2.length || b.errs.length || /two saves/i.test(modalTxt)) fails++;
    await b.close();
  }
  console.log(fails ? 'FAIL' : 'PASS'); await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
