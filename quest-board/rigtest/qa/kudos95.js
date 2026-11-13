// LEAD's coin requests (6426b2e): a player (not the owner) reads only kudosok/<own id>, gets paid what Cal approved exactly once (also after a
// reload), never sees another player's approval, and nothing is pinned in the Town Hall's Posts.   BASE=<sandbox> CHROME_PORT=9375 node kudos95.js
const { browser, sleep } = require('./cdp.js'); const BASE = process.env.BASE || 'http://127.0.0.1:8817';
let bad = 0; const ok = (n, c, g) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + n + (g !== undefined ? '  ' + JSON.stringify(g).slice(0, 400) : '')); };
(async () => { const br = await browser(); const pg = await br.page({ fresh: true }); const E = (js) => pg.ev(`(async function(){try{${js}}catch(e){return 'ERR '+e.message}})()`);
  await pg.go(BASE + '/'); await pg.wait('!!(window.__qb && document.querySelector("#app") && !document.querySelector("#app .boot"))', 120000); await sleep(2500);
  await E(`var x=window.__qb.x(),S=x.S;S.created=true;S.welcomed=1;S.char=window.__qb.fixChar({name:'Qa',sex:'m'});S.xp=x.cum(12);S.gates=Array.from({length:200},function(_,i){return i});S.areaOn=null;S.coins=1000;x.persist();window.__qbUnlock.on().hall=1;x.persist();x.render();return 1`); await sleep(1500);
  const d = await E(`var t=Date.now(),day=window.__qb.x().S.runDate;localStorage.setItem('qbsbx:kudosok/sandbox',JSON.stringify({name:'Qa',items:{n1:{ok:true,c:500,text:'QA-APPROVED-NOTE',name:'Qa',d:day,t:t}}}));
    localStorage.setItem('qbsbx:kudosok/other',JSON.stringify({name:'Other',items:{n9:{ok:true,c:1500,text:'OTHER-PLAYER-NOTE',name:'Other',d:day,t:t}}}));return day`);
  await E('window.__qbKudos.guest(1);await window.__qbKudos.load();return 1'); await sleep(1500);
  const a = await E('var K=window.__qbKudos.st,S=window.__qb.x().S;return {coins:S.coins,paid:S.kudos&&S.kudos.paid,okKeys:Object.keys(K.ok||{}),err:K.err}');
  ok('a player is paid the approved 500 once, and reads only their own approvals', a.coins === 1500 && a.okKeys.join() === 'sandbox', a);
  await E('await window.__qbKudos.load();return 1'); await sleep(800); const a2 = await E('return window.__qb.x().S.coins'); ok('loading again pays nothing more', a2 === 1500, a2);
  await E('window.__qb.x().persist();return 1'); await sleep(800); await pg.go(BASE + '/'); await pg.wait('!!(window.QBGAME && window.QBGAME.ready())', 120000); await sleep(1500);
  await E('window.__qbKudos.guest(1);await window.__qbKudos.load();return 1'); await sleep(1200); const a3 = await E('return window.__qb.x().S.coins'); ok('after a reload: still paid once', a3 === 1500, a3);
  await E('document.querySelectorAll("#layer .modal,.dropsplash").forEach(function(e){e.remove()});document.querySelector(".nav button[data-v=hall]").click();return 1'); await sleep(2500);
  const t = await E('return document.querySelector("#app").innerText'); ok('Town Hall Posts: no pinned note, neither own nor another player\'s', !/QA-APPROVED-NOTE|OTHER-PLAYER-NOTE|Pinned/i.test(t), (t.match(/.{0,40}(Pinned|NOTE).{0,40}/i) || ['none'])[0]);
  // the owner path still reads every answer (Cal's queue)
  await E('window.__qbKudos.guest(0);await window.__qbKudos.load();return 1'); await sleep(1000); const o = await E('var K=window.__qbKudos.st;return {okKeys:Object.keys(K.ok||{}).sort(),coins:window.__qb.x().S.coins}');
  ok('the owner still reads every answer (his queue), and is not paid other players\' coins', o.okKeys.join() === 'other,sandbox' && o.coins === 1500, o);
  console.log('page errors', JSON.stringify(pg.errs || [])); console.log(bad ? 'FAILED ' + bad : 'PASS'); process.exit(0); })().catch((e) => { console.error(e); process.exit(1); });
