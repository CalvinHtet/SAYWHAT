// w-nospoil2: the milestone-relic pop says "Something found" while the Relics tab is closed (below level 8) and "Relic found" once
// it is open. A fresh player at level 2 buys Bedroom upgrades; later the same save at level 8+ earns the next tier.
const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8813';
(async () => {
  const br = await browser(); const pg = await br.page({ fresh: true });
  await pg.s('Page.addScriptToEvaluateOnNewDocument', { source: `(function(){var P=window.__qaPops=[];var go=function(){if(!document.body){setTimeout(go,20);return}new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType===1&&(n.classList.contains('pop')||n.querySelector&&n.querySelector('.pop')))P.push(Math.round(performance.now())+' '+(n.innerText||'').replace(/\s+/g,' ').slice(0,120))})})}).observe(document.body,{childList:true,subtree:true})};go()})();` });
  await pg.go(BASE + '/'); await pg.wait('!!(window.__qb && window.__qb.x && document.querySelector("#app"))', 120000); await sleep(1500);
  const step = async (label, js, wait) => { await pg.ev(js); await sleep(wait); const r = await pg.ev('(function(){var x=window.__qb.x();return {lvl:x.effLvl(),relicsTab:!!document.querySelector(".nav button[data-v=trophy]:not(.lk)"),relics:Object.keys(x.S.relics||{}),pops:window.__qaPops.splice(0)}})()'); console.log(label + ': ' + JSON.stringify(r)); };
  await step('level 2, the Bedroom fully upgraded (Finishing Touch I)', `(function(){var x=window.__qb.x(),S=x.S;S.created=true;S.char=window.__qb.fixChar({name:'Pop',sex:'m'});S.welcomed=1;S.xp=x.cum(2)+5;S.coins=5000;
    x.persist();x.render();window.__qbRooms.all('bedroom',1);return 1})()`, 27000);
  await step('level 9 (Relics open), Closet and Patio fully upgraded (Finishing Touch II)', `(function(){var x=window.__qb.x(),S=x.S;S.xp=x.cum(9)+5;var g,n=0;while((g=x.gated())!==null&&n++<20)S.gates.push(g);S.areaOn=S.areaOn||{};S.areaOn.trophy=1;
    window.__qbRooms.all('closet',1);window.__qbRooms.all('patio',1);document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});x.persist();x.render();return 1})()`, 27000);
  console.log('page errors', pg.errs.length); await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
