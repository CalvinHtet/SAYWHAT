// Cal's dead end can't come back (LEAD 18:23): from the Restaurant to the Mall, at every step, read every locked card in every room
// window (the "? ? ?" mystery cards, "Coming next" cards and "Not yet" buttons). Each must say something the player can act on;
// none may say "Something else opens first". Noir's card must show the dish progress (0, 90, 179, 180 served); Desmond comes the
// moment Noir is bought. Also Cal's exact case: level 14, a dark Restaurant (r_x2 and its decor), about 34,000 coins.
//   BASE=<build> CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/wdeadend_walk.js
const fs = require('fs');
const SEEDS = require('path').join(__dirname, 'seeds') + '/';
const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8813';
const log = (...a) => console.log(a.map((v) => (typeof v === 'string' ? v : JSON.stringify(v))).join(' '));
(async () => {
  const br = await browser(); const pg = await br.page({ fresh: true });
  const seed = JSON.parse(fs.readFileSync(SEEDS + 'v90_mid.json', 'utf8'));
  await pg.go(BASE + '/version.json'); await pg.ev(`(function(d){localStorage.clear();Object.keys(d).forEach(function(k){localStorage.setItem(k,d[k])});return 1})(${JSON.stringify(seed)})`);
  await pg.go(BASE + '/'); await pg.wait('!!(window.__qb && window.__qb.x().S.reset91 && document.querySelector(".nav button[data-v=board]"))', 120000); await sleep(2500);
  const clr = () => pg.ev('(function(){document.querySelectorAll(".dropsplash .dsx").forEach(function(b){b.click()});document.querySelectorAll("#layer .modal").forEach(function(e){e.remove()});return 1})()');
  for (let k = 0; k < 4; k++) { await clr(); await sleep(300); }
  // level 14, the Loft rooms, the Garden and the Restaurant through the story; ~34k coins
  await pg.ev(`(function(){var x=window.__qb.x(),S=x.S;S.xp=x.cum(14);S.gates=S.gates||[];for(var g=0;g<40&&x.gated()!=null;g++)S.gates.push(x.gated());
    ['closet','patio','gameroom','garden','restaurant'].forEach(function(t){window.__qbRooms.open(t,1)});S.coins=34000;S.base.served=0;x.persist();x.render();return 1})()`); await clr();
  let bad = 0;
  const locked = async (stage) => {
    const r = await pg.ev(`(async function(){var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})},S=window.__qb.x().S,out=[];
      for(var i=0;i<S.base.slots.length;i++){var r=S.base.slots[i];if(!r)continue;document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});window.__qb.roomModal(i);await w(450);var m=document.querySelector('#layer .modal');if(!m)continue;
        [].forEach.call(m.querySelectorAll('.addon'),function(e){var t=e.innerText.replace(/\\s+/g,' ').trim();var lockedCard=e.classList.contains('mystery')||e.classList.contains('stynext')||/Not yet/.test(t)||!!e.querySelector('button[disabled]');if(lockedCard&&t)out.push(r.t+': '+t.slice(0,140))})}
      document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});return out})()`, 60000);
    log(`== ${stage}`);
    r.forEach((c) => { const dead = /Something else opens first/i.test(c) || /\? \? \? (Not yet)?$/.test(c); if (dead) bad++; log(`   ${dead ? 'DEAD ' : ''}${c}`); });
  };
  const noir = async (tag) => { const t = await pg.ev(`(async function(){var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})},S=window.__qb.x().S,i=S.base.slots.findIndex(function(q){return q&&q.t==='restaurant'});
      document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});window.__qb.roomModal(i);await w(500);var c=[].filter.call(document.querySelectorAll('#layer .addon'),function(e){return /Noir/.test(e.innerText)})[0];
      var cards=[].map.call(document.querySelectorAll('#layer .addon'),function(e){return e.innerText.replace(/\\s+/g,' ').slice(0,50)}).filter(Boolean);var b=document.querySelector('#layer [data-act=raddon][data-id="r_noir"]');
      document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});return {noirCard:c?c.innerText.replace(/\\s+/g,' ').slice(0,160):'(none)',buyable:!!(b&&!b.disabled),place:cards.findIndex(function(x){return /Noir/.test(x)})+1+' of '+cards.length}})()`);
    log(`   Noir card (${tag}):`, t); return t; };
  // Cal's case: the Restaurant with r_x2 and its decor (the dark look), level 14, 34k coins, no Noir
  await pg.ev(`(function(){var x=window.__qb.x(),S=x.S,r=S.base.slots.filter(function(q){return q&&q.t==='restaurant'})[0];(x.ADDONS.restaurant||[]).forEach(function(a){var e=a[3]||{};if(e.opens||e.retired||a[0]==='r_noir')return;if(+a[2]<=1300||a[0]==='r_x1'||a[0]==='r_x2')r.a[a[0]]=1});x.persist();x.render();return Object.keys(r.a).length})()`);
  await locked("Cal's case: level 14, the Restaurant (r_x2, its cheaper pieces), 34k coins, 0 dishes");
  for (const n of [0, 90, 179]) { await pg.ev(`(function(){window.__qb.x().S.base.served=${n};return 1})()`); await noir(n + ' served'); }
  await pg.ev(`(function(){window.__qb.x().S.base.served=180;return 1})()`); const n180 = await noir('180 served');
  if (n180.buyable) {
    await pg.ev(`(async function(){var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})},S=window.__qb.x().S,i=S.base.slots.findIndex(function(q){return q&&q.t==='restaurant'});S.coins=Math.max(S.coins,10000);
      window.__qb.roomModal(i);await w(500);var b=document.querySelector('#layer [data-act=raddon][data-id="r_noir"]');b&&b.click();await w(800);return 1})()`); await sleep(1200); await clr();
    await pg.ev('window.__qbStory.check()'); await sleep(1200);
    log('   right after Noir:', await pg.ev('(function(){var m=document.querySelector("#layer .modal");return m?m.innerText.replace(/\\s+/g," ").slice(0,120):"no window"})()'));
    await pg.ev('(function(){var b=document.querySelector("#layer [data-act=styyes]");b&&b.click();return 1})()'); await sleep(1500); await clr();
  }
  // step by step to the Mall (each room opened as the story would, then its source room upgraded to its share)
  const step = async (label, js) => { await pg.ev(`(function(){var x=window.__qb.x(),S=x.S;${js};x.persist();x.render();return 1})()`); await sleep(600); await clr(); await locked(label); };
  const fill = (t, pct) => `var r=S.base.slots.filter(function(q){return q&&q.t==='${t}'})[0];if(r){var L=(x.ADDONS['${t}']||[]).filter(function(a){var e=a[3]||{};return !e.retired&&!e.opens&&!e.trophy});L.slice(0,Math.ceil(L.length*${pct})).forEach(function(a){r.a[a[0]]=1})}`;
  await step('Lock and Key open (0 upgrades)', "window.__qbRooms.open('skybar',1)");
  await step('Lock and Key at 50%', fill('skybar', 0.5));
  await step('the Rooftop open, Lock and Key at 75%', "window.__qbRooms.open('rooftop',1);" + fill('skybar', 0.75));
  await step('Boba open', "window.__qbRooms.open('boba',1)");
  await step('Boba at 60%', fill('boba', 0.6));
  await step('the Dessert Parlor open (every Plaza room built)', "window.__qbRooms.open('dessert',1)");
  await step('Kode Plaza at 40%', ['garden', 'restaurant', 'skybar', 'rooftop', 'boba', 'dessert'].map((t) => fill(t, 0.4)).join(';'));
  await step('Kode Plaza at 60% (the Mall can open)', ['garden', 'restaurant', 'skybar', 'rooftop', 'boba', 'dessert'].map((t) => fill(t, 0.62)).join(';'));
  await step('the Mall open', "window.__qbRooms.open('mall',1)");
  log(`dead-end cards: ${bad}; page errors ${pg.errs.length} ${pg.errs.slice(0, 2).join(' | ')}`);
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
