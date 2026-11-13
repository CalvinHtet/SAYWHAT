// The Town square in its new place (1feee32: the Players tab, was Hall -> Rank): it draws, has no side-quest in it, and tapping a player opens the greetings.
//   BASE=<sandbox> CHROME_PORT=9375 node b1square.js
const { browser, sleep } = require('./cdp.js'); const BASE = process.env.BASE || 'http://127.0.0.1:8817';
(async () => { const br = await browser(); const pg = await br.page({ fresh: true }); const E = (js) => pg.ev(js);
  await pg.go(BASE + '/'); await pg.wait('!!(window.__qb && document.querySelector("#app") && !document.querySelector("#app .boot"))', 120000); await sleep(2500);
  await E(`(function(){var x=window.__qb.x(),S=x.S;S.created=true;S.welcomed=1;S.char=window.__qb.fixChar({name:'Qa',sex:'m'});S.xp=x.cum(12);S.areaOn=null;S.gates=Array.from({length:200},function(_,i){return i});x.persist();var o=window.__qbUnlock.on();o.hall=1;x.persist();x.render();return 1})()`); await sleep(1500);
  await E('(function(){document.querySelectorAll("#layer .modal,.dropsplash").forEach(function(m){m.remove()});var b=document.querySelector(".nav button[data-v=players]");b&&b.click();return 1})()'); await sleep(2500);
  const sq = await E(`(async function(){var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})};[].forEach.call(document.querySelectorAll('[data-act=fshfold]'),function(b){if(b.getAttribute('aria-expanded')!=='true')b.click()});await w(1500);
    document.querySelectorAll('.dropsplash,.bsplash,#layer .modal').forEach(function(m){m.remove()});var box=document.querySelector('#sqbox');var who=box?[].filter.call(box.querySelectorAll('button,[data-u],[data-uid]'),function(b){return !/(you)/.test(b.innerText)})[0]:null;if(who)who.click();await w(900);var m=document.querySelector('#layer .modal');
    return {square:box?box.innerText.replace(/\\s+/g,' ').slice(0,140):null,side:box?/Side-quest|Send a photo/i.test(box.innerText):null,tapped:who?who.innerText.trim().slice(0,30):null,card:m?m.innerText.replace(/\\s+/g,' ').slice(0,100):null}})()`);
  const good = sq.square && /Town square/i.test(sq.square) && !sq.side && /wave/i.test(sq.card || '');
  console.log((good ? 'ok   ' : 'BAD  ') + 'Players tab: the Town square draws and tapping a player opens the greetings ' + JSON.stringify(sq)); console.log('page errors', JSON.stringify(pg.errs || [])); process.exit(0); })();
