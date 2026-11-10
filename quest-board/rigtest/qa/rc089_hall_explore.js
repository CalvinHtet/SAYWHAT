const L = require('./rc089_hall_lib.js');
(async () => {
  const { br, pg } = await L.boot();
  L.say('now', await pg.ev('new Date().toString()'), 'S.created', await pg.ev('window.__qb.x().S.created'), 'hallOpen', await pg.ev('!!document.querySelector(".nav button[data-v=hall]")'));
  await L.hall(pg);
  await L.sleep(3000);
  L.say('tabs', await pg.ev('[].map.call(document.querySelectorAll(".htab button"),function(b){return b.innerText.trim()+"|"+b.dataset.t})'));
  L.say('worlds', await pg.ev('Object.keys(localStorage).filter(function(k){return k.indexOf("qbsbx:")==0})'));
  L.say('hallHook', await pg.ev('JSON.stringify(window.__qbHall.likes())'));
  await pg.shot(L.OUT + 'explore_posts.png');
  await L.hall(pg, 'style'); await L.sleep(2000);
  await pg.shot(L.OUT + 'explore_rank.png');
  L.say('rank', await pg.ev('JSON.stringify(window.__qbHall.style())'));
  await L.hall(pg, 'chat'); await L.sleep(2000);
  await pg.shot(L.OUT + 'explore_chat.png');
  L.say('chat', await pg.ev('JSON.stringify(window.__qbHall.chat())'));
  L.say('errs', pg.errs);
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
