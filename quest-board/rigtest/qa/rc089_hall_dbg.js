const L = require('./rc089_hall_lib.js'), { say, sleep, OUT } = L;
(async () => {
  const { br, pg } = await L.boot();
  await L.hall(pg, 'style'); await sleep(2500);
  const looks = await pg.ev('(function(){var o=[];for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k.indexOf("qbsbx:worlds/sb_")==0)o.push(JSON.parse(localStorage.getItem(k)).look)}return o})()');
  await L.put(pg, 'worlds/u_g1', { name: 'Sydney', look: looks[0], lv: 22, streak: 2, rooms: [], earnedC: 5000, t: Date.now() });
  await sleep(2000);
  say('sqbox?', await pg.ev('!!document.getElementById("sqbox")'), 'folds', await pg.ev('[].map.call(document.querySelectorAll(".fsh-fold"),function(b){return b.dataset.k+":"+b.className})'));
  await L.tapSel(pg, '[data-act=fshfold][data-k=square]'); await sleep(1500);
  say('sqbox after tap?', await pg.ev('!!document.getElementById("sqbox")'), await pg.ev('[].map.call(document.querySelectorAll("#sqbox .sq-p"),function(b){return b.dataset.u})'));
  say('live', await pg.ev('JSON.stringify(window.__qbLive.soc().worlds.map(function(w){return w.id}))'));
  say('errs', pg.errs);
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
