// Old v0.90 save (made on 8816, 9a9daf7) loaded on the w-sale build (8819, 50ffa58): every room and upgrade kept (after load, after
// 45 s of play and after a reload), and how many pop-ups arrive in the first 45 s (a player closing each one as it comes), next to
// the same save reopened on 8816. KIND=adv (level 60, every room, every upgrade) or KIND=mid (level 18, part of Kode Plaza).
//   KIND=adv CHROME_PORT=9373 bash tools/windows/node.sh rigtest/qa/wsale_oldsave.js
const fs = require('fs');
const { browser, sleep } = require('./cdp.js');
const KIND = process.env.KIND || 'adv', OLD = 'http://127.0.0.1:8816', NEW = 'http://127.0.0.1:8819', WATCH = +process.env.WATCH || 45000;
const OUT = 'C:/Users/clvh/qa-wt/out/wsale'; const LOG = OUT + `/oldsave_${KIND}.log`; fs.writeFileSync(LOG, '');
const log = (s) => { console.log(s); fs.appendFileSync(LOG, s + '\n'); };
const dumpLS = '(function(){var o={};for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);o[k]=localStorage.getItem(k)}return o})()';
const putLS = (d) => `(function(d){localStorage.clear();Object.keys(d).forEach(function(k){localStorage.setItem(k,d[k])});return 1})(${JSON.stringify(d)})`;
// every pop-up from the first paint: toasts (.pop), windows (.modal), brand and floor splashes
const WATCHER = `(function(){window.__popLog=[];var t0=Date.now();function go(){new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType!==1||!n.classList)return;
  var k=n.classList.contains("pop")?"toast":n.classList.contains("dropsplash")||n.classList.contains("bsplash")?"splash":n.classList.contains("modal")?"window":null;if(!k)return;
  setTimeout(function(){window.__popLog.push({t:Math.round((Date.now()-t0)/100)/10,k:k,txt:(n.innerText||"").replace(/\\s+/g," ").slice(0,140)})},50)})})}).observe(document.body,{childList:true,subtree:true})}
  if(document.body)go();else document.addEventListener("DOMContentLoaded",go)})()`;
// a player closing what comes: a story scene's yes, a splash's close, any other window's close
const CLOSE = `(function(){var n=0;document.querySelectorAll(".dropsplash .dsx,.bsplash .dsx").forEach(function(b){b.click();n++});
  var y=document.querySelector("#layer [data-act=styyes]");if(y){y.click();n++}
  document.querySelectorAll("#layer .modal").forEach(function(m){var b=m.querySelector("[data-act=mclose],.mx,[aria-label=Close]");if(b)b.click();if(m.parentNode)m.remove();n++});return n})()`;
const SUM = `(function(){var S=window.__qb.x().S,o={};S.base.slots.forEach(function(r){if(r)o[r.t]=Object.keys(r.a||{}).sort()});var st=S.story||{};
  return {lvl:window.__qb.x().effLvl(),coins:S.coins,rooms:o,done:Object.keys(st.done||{}).sort(),offer:Object.keys(st.offer||{}).sort()}})()`;
async function open(br, base, dump) {
  const pg = await br.page({ fresh: true });
  await pg.s('Page.addScriptToEvaluateOnNewDocument', { source: WATCHER });
  if (dump) { await pg.go(base + '/version.json'); await pg.ev(putLS(dump)); }
  await pg.go(base + '/'); await pg.wait('!!(window.__qb && window.__qb.x && window.__qbStory && document.querySelector("#app") && !document.querySelector("#app .boot"))', 120000);
  return pg;
}
async function watch(pg, ms) { const end = Date.now() + ms; let closed = 0; while (Date.now() < end) { await sleep(1500); closed += await pg.ev(CLOSE); } return closed; }
const cmpRooms = (A, B) => { const d = []; Object.keys(A).forEach((t) => { if (!B[t]) d.push('LOST ' + t); else { const miss = A[t].filter((k) => !B[t].includes(k)); if (miss.length) d.push(t + ' lost ' + miss.join(',')); } });
  Object.keys(B).forEach((t) => { if (!A[t]) d.push('NEW ' + t); }); return d; };
(async () => {
  const br = await browser();
  // the old save on 8816
  let pg = await open(br, OLD);
  await pg.ev(`(function(){var x=window.__qb.x(),S=x.S;S.created=true;S.char=window.__qb.fixChar({name:'Old',sex:'f'});S.welcomed=1;x.persist();x.render();return 1})()`); await sleep(800);
  if (KIND === 'adv') await pg.ev(`(function(){window.__qbRooms.unlockAll();var x=window.__qb.x(),S=x.S;Object.keys(x.ADDONS).forEach(function(t){if(S.base.slots.some(function(r){return r&&r.t===t}))window.__qbRooms.all(t,1)});
    S.xp=x.cum(60);var g,n=0;while((g=x.gated())!==null&&n++<80)S.gates.push(g);S.coins=99999;S.areaOn=S.areaOn||{};["hideout","hall","wheel","trophy"].forEach(function(a){S.areaOn[a]=1});x.persist();x.render();return 1})()`);
  else await pg.ev(`(function(){var x=window.__qb.x(),S=x.S;S.xp=x.cum(18);var g,n=0;while((g=x.gated())!==null&&n++<80)S.gates.push(g);S.areaOn=S.areaOn||{};["hideout","hall","wheel","trophy"].forEach(function(a){S.areaOn[a]=1});
    ["closet","patio","gameroom","boba"].forEach(function(t){window.__qbRooms.open(t,1)});
    var up=function(t,k){var r=S.base.slots.filter(function(s){return s&&s.t===t})[0];if(!r)return;r.a=r.a||{};(x.ADDONS[t]||[]).filter(function(a){var e=a[3]||{};return !e.opens&&!e.retired&&!e.trophy&&!r.a[a[0]]}).slice(0,k).forEach(function(a){r.a[a[0]]=1})};
    up("bedroom",20);up("closet",3);up("patio",6);up("gameroom",8);up("garden",18);up("restaurant",22);up("boba",3);var r=S.base.slots.filter(function(s){return s&&s.t==="restaurant"})[0];if(r)r.earn=undefined;
    S.story.sold=40;S.coins=6400;x.persist();x.render();return 1})()`);
  const c0 = await watch(pg, 20000); // the player sees what v0.90 has to show before the update
  await pg.ev('(window.__qb.x().persist(),1)'); await sleep(1200);
  const before = await pg.ev(SUM); const dump = await pg.ev(dumpLS);
  fs.writeFileSync(`${OUT}/oldsave_${KIND}.json`, JSON.stringify(dump));
  log(`== ${KIND}: v0.90 save, level ${before.lvl}, ${Object.keys(before.rooms).length} rooms, ${Object.values(before.rooms).reduce((a, x) => a + x.length, 0)} upgrades; story done ${before.done.join(',')}; offer ${before.offer.join(',')}; closed ${c0} on 8816 while making it; errs ${pg.errs.length}`);
  await pg.close();
  // the same save reopened on 8816 (baseline) and on 8819
  for (const [lbl, base] of [['8816 (v0.90 again)', OLD], ['8819 (w-sale)', NEW]]) {
    pg = await open(br, base, dump);
    const s1 = await pg.ev(SUM); const closed = await watch(pg, WATCH); const s2 = await pg.ev(SUM);
    const pops = await pg.ev('window.__popLog');
    const by = pops.reduce((o, p) => { o[p.k] = (o[p.k] || 0) + 1; return o; }, {});
    log(`-- on ${lbl}: ${pops.length} pop-ups in ${WATCH / 1000} s ${JSON.stringify(by)}`);
    pops.forEach((p) => log(`     ${p.t}s ${p.k}: ${p.txt}`));
    const d1 = cmpRooms(before.rooms, s1.rooms), d2 = cmpRooms(before.rooms, s2.rooms);
    log(`   rooms at load: ${d1.length ? d1.join('; ') : 'all ' + Object.keys(s1.rooms).length + ' rooms and their upgrades kept'}; after ${WATCH / 1000} s: ${d2.length ? d2.join('; ') : 'same'}; level ${s1.lvl}; story offer now ${s2.offer.join(',')}`);
    if (base === NEW) { await pg.ev('(window.__qb.x().persist(),1)'); await sleep(1000); const d3 = await pg.ev(dumpLS); await pg.shot(`${OUT}/oldsave_${KIND}_8819.png`); log('   errs ' + JSON.stringify(pg.errs)); await pg.close();
      pg = await open(br, NEW, d3); await sleep(6000); await pg.ev(CLOSE); const s3 = await pg.ev(SUM); const d4 = cmpRooms(before.rooms, s3.rooms);
      const p3 = await pg.ev('window.__popLog'); log(`   reload on 8819: ${d4.length ? d4.join('; ') : 'rooms and upgrades same'}; pop-ups in 6 s after the reload ${p3.length}: ${p3.map((p) => p.k + ' ' + p.txt.slice(0, 60)).join(' | ')}`); }
    log('   errs ' + JSON.stringify(pg.errs)); await pg.close();
  }
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
