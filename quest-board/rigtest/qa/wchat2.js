// w-chat2 (v0.92): W49 chat runs, W53 greetings, W57 online dot + streak, on the advanced save with the sandbox db.
// Neighbors: Sydney (online, 7-day streak, a look), Jordan (last seen 10 min ago), Alex (online, no look yet).
// Chat room 1: Sydney t0, t0+1m, t0+3m (one run), Jordan t0+3.5m (breaks it), Sydney t0+4m (a new run), Sydney t0+12m (new run, > 5 min),
// then two lines of mine through the box: one run, an x on each. Faces: a picture for a look, the initial without one, a green dot for
// online. Greetings: the card's buttons are exactly Wave / High five / Poke / Spank; a spank to a sandbox friend comes back; an old
// cheer from Jordan's phone shows and pays 3; "Visit their Loft" appears nowhere (Hall tabs, cards, Neighbors). Rank list: dots + streaks.
//   BASE=<build> OUT=<dir/> CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/wchat2.js
const L = require('./rc089_hall_lib.js'), { say, sleep } = L;
(async () => {
  const { br, pg } = await L.boot();
  const now = await pg.ev('Date.now()-(window.__qbShift||0)');
  const looks = await pg.ev('(function(){var o=[];for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k.indexOf("qbsbx:worlds/sb_")==0)o.push(JSON.parse(localStorage.getItem(k)).look)}return o})()');
  await L.put(pg, 'worlds/u_syd', { name: 'Sydney', look: looks[0], lv: 22, streak: 7, rooms: [], earnedC: 3000, t: now });
  await L.put(pg, 'worlds/u_jor', { name: 'Jordan', look: looks[1 % looks.length], lv: 18, streak: 0, rooms: [], earnedC: 2000, t: now - 10 * 60000 });
  await L.put(pg, 'worlds/u_alx', { name: 'Alex', lv: 5, streak: 2, rooms: [], earnedC: 100, t: now });
  const t0 = now - 20 * 60000, M = (x, t) => ({ x, t });
  await L.put(pg, 'chat/u_syd', { name: 'Sydney', msgs: { 1: [M('hi all', t0), M('anyone up?', t0 + 60000), M('ok', t0 + 180000), M('back', t0 + 240000), M('later', t0 + 720000)], 2: [], 3: [] }, t: now });
  await L.put(pg, 'chat/u_jor', { name: 'Jordan', msgs: { 1: [M('hey Syd', t0 + 210000)], 2: [], 3: [] }, t: now });
  await L.put(pg, 'chat/u_alx', { name: 'Alex', msgs: { 1: [M('new here', t0 + 900000)], 2: [], 3: [] }, t: now });
  await L.hall(pg, 'chat'); await sleep(2500);
  await pg.ev('(function(){var r=document.querySelector("[data-act=tchroom][data-r=\\"1\\"]");r&&r.click();return 1})()'); await sleep(800);
  for (const x of ['my first line', 'my second line']) { await pg.ev(`(function(){var i=document.getElementById('tchin');if(!i)return 0;i.focus();i.value=${JSON.stringify(x)};i.dispatchEvent(new Event('input',{bubbles:true}));var b=document.querySelector('[data-act=tchsend]');b&&b.click();return 1})()`); await sleep(1300); }
  const runs = await pg.ev(`[].map.call(document.querySelectorAll('.tch-g'),function(g){var av=g.querySelector('.tch-av');return {who:(g.querySelector('.tch-h b')||{}).innerText,time:(g.querySelector('.tch-h small')||{}).innerText,lines:[].map.call(g.querySelectorAll('.tch-b > p'),function(p){return p.firstChild?p.firstChild.textContent:''}),
    face:av?(av.querySelector('img,svg,canvas')?'picture':av.querySelector('.tch-ini')?'initial '+av.querySelector('.tch-ini').innerText:'?'):'none',dot:!!(av&&av.querySelector('.tch-on')),x:g.querySelectorAll('[data-act=tchdel]').length}})`);
  say('W49 chat runs:'); runs.forEach((r) => say('   ' + JSON.stringify(r)));
  await pg.shot(L.OUT + 'chat2_runs.png');
  // W57 + W53 in the Rank tab: list rows, a card, the Town square, the Neighbors
  await L.hall(pg, 'style'); await sleep(2500);
  const rank = await pg.ev(`[].map.call(document.querySelectorAll('#fshbox .fsh-row'),function(r){return r.innerText.replace(/\\s+/g,' ').slice(0,60)+(r.querySelector('.pl-on')?' [dot]':'')})`);
  say('W57 Rank rows:', rank);
  await L.tapSel(pg, '#fshbox .fsh-row[data-u="u_syd"]'); await sleep(700);
  say('W57 Sydney card:', await pg.ev('(function(){var m=document.querySelector("#layer .modal");return m?m.innerText.replace(/\\s+/g," ").slice(0,160)+(m.querySelector(".pl-on")?" [dot]":""):null})()')); await L.closeModals(pg);
  const opened = await pg.ev(`(async function(){var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})},o={};[].forEach.call(document.querySelectorAll('[data-act=fshfold]'),function(b){if(b.getAttribute('aria-expanded')!=='true')b.click()});await w(1200);
    o.square=(document.querySelector('#sqbox')||{innerText:''}).innerText.replace(/\\s+/g,' ').slice(0,200);o.nbButtons=[].map.call(document.querySelectorAll('.fsh-nb button, #fshnb button, .snw button'),function(b){return b.innerText.trim()}).slice(0,8);return o})()`);
  say('W53 Town square / Neighbors:', opened);
  const sb = await pg.ev('(function(){var p=[].filter.call(document.querySelectorAll("#sqbox .sq-p"),function(x){return /^sb_/.test(x.dataset.u)})[0];return p?p.dataset.u:null})()');
  if (sb) { await pg.ev(`(function(){var p=document.querySelector('#sqbox .sq-p[data-u="${sb}"]');p&&p.click();return 1})()`); await sleep(800);
    const card = await pg.ev('(function(){var m=document.querySelector("#layer .modal");return m?{buttons:[].map.call(m.querySelectorAll("[data-act=sqgo]"),function(b){return b.innerText.replace(/\\s+/g," ").trim()}),visit:/Visit/i.test(m.innerText)}:null})()');
    say('W53 greeting card (' + sb + '):', card);
    const c0 = await pg.ev('Math.floor(window.__qb.x().S.coins)'); await pg.ev('window.__qaPops.splice(0)');
    await pg.ev(`(function(){var b=document.querySelector('#layer [data-act=sqgo][data-k="spank"]');b&&b.click();return 1})()`); await sleep(5500);
    say('W53 spank sent:', await pg.ev('JSON.stringify((JSON.parse(localStorage.getItem("qbsbx:pings/sandbox")||"{}").emo)||{})'), '| pops', await pg.ev('window.__qaPops.splice(0)'), '| coins', c0, '->', await pg.ev('Math.floor(window.__qb.x().S.coins)')); }
  const c1 = await pg.ev('Math.floor(window.__qb.x().S.coins)');
  await L.put(pg, 'pings/u_jor', { name: 'Jordan', fromName: 'Jordan', emo: { sandbox: { k: 'cheer', t: now + 1000 } }, t: now + 1000 }); await sleep(6000);
  say('W53 old cheer from Jordan:', await pg.ev('window.__qaPops.splice(0)'), '| coins', c1, '->', await pg.ev('Math.floor(window.__qb.x().S.coins)'), '| feed', await pg.ev('(document.querySelector("#sqbox .sq-feed")||{innerText:""}).innerText.replace(/\\s+/g," ").slice(0,160)'));
  // "Visit their Loft" nowhere: every Hall tab, every neighbor's card
  let visits = 0;
  for (const t of ['posts', 'chat', 'style']) { await L.hall(pg, t); await sleep(1200); visits += await pg.ev('(document.getElementById("app").innerText.match(/Visit (their|th)/gi)||[]).length'); }
  for (const u of ['u_syd', 'u_jor', 'u_alx']) { await L.closeModals(pg); await L.tapSel(pg, `#fshbox .fsh-row[data-u="${u}"]`); await sleep(600); visits += await pg.ev('(function(){var m=document.querySelector("#layer .modal");return m?(m.innerText.match(/Visit/gi)||[]).length:0})()'); }
  say('"Visit" in the Hall tabs and the cards:', visits);
  say('page errors', pg.errs.length, pg.errs.slice(0, 2));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
