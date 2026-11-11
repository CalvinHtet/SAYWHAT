// w-focus (SPEC8) / w-sale QA helpers: boot a page on the sandbox, make a character, and in-page helpers (read only on the game code;
// the save is moved through the test hooks the way the story would).
const fs = require('fs');
const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8819';
const dumpLS = '(function(){var o={};for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);o[k]=localStorage.getItem(k)}return o})()';
const putLS = (d) => `(function(d){localStorage.clear();Object.keys(d).forEach(function(k){localStorage.setItem(k,d[k])});return 1})(${JSON.stringify(d)})`;
const PAGE = String.raw`window.__wf=(function(){
  var X=function(){return window.__qb.x()};
  var pops=[],mods=[];new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType!==1||!n.classList)return;
    if(n.classList.contains("pop"))pops.push(n.textContent);if(n.classList.contains("modal")||n.classList.contains("dropsplash")||n.classList.contains("bsplash"))mods.push((n.className+" | "+(n.innerText||"")).replace(/\s+/g," ").slice(0,200))})})}).observe(document.body,{childList:true,subtree:true});
  function slot(t){var sl=X().S.base.slots;for(var i=0;i<sl.length;i++)if(sl[i]&&sl[i].t===t)return i;return -1}
  function closeAll(){var ds=document.querySelectorAll(".dropsplash,.bsplash");ds.forEach(function(d){var x=d.querySelector(".dsx");if(x)x.click();if(d.parentNode)d.remove()});document.querySelectorAll("#layer .modal").forEach(function(m){m.remove()});return 1}
  function lvl(L){var x=X(),s=x.S;s.xp=Math.max(s.xp||0,x.cum(L));var g,n=0;s.gates=s.gates||[];while((g=x.gated())!==null&&n++<80)s.gates.push(g);
    s.areaOn=s.areaOn||{};var lv=x.effLvl();[["hideout",2],["hall",2],["wheel",6],["trophy",8]].forEach(function(a){if(a[1]<=lv)s.areaOn[a[0]]=1});x.persist();return lv}
  function setLvl(L){var x=X(),s=x.S;s.xp=x.cum(L);var g,n=0;s.gates=s.gates||[];while((g=x.gated())!==null&&n++<80)s.gates.push(g);x.persist();return x.effLvl()}
  function st(){return window.__qbStory.state()}
  function stepOf(room){return window.__qbStory.steps.filter(function(s){return s.room===room})[0]}
  /* add a room as the story would have (done + offer for its step, its opener marked bought) */
  function add(t){var x=X(),S=x.S;if(slot(t)>=0)return slot(t);var s=stepOf(t),o=st();if(s){o.done[s.id]=1;o.offer[s.id]=1}
    S.base.slots.push({t:t,a:{},st:0,pend:0});S.base.slots.forEach(function(r){if(!r)return;(x.ADDONS[r.t]||[]).forEach(function(a){if(a[3]&&a[3].opens===t){r.a=r.a||{};r.a[a[0]]=1}})});x.persist();return slot(t)}
  function live(t){return (X().ADDONS[t]||[]).filter(function(a){var e=a[3]||{};return !e.retired&&!e.opens&&!e.trophy}).map(function(a){return a[0]})}
  /* exactly n of the room's live upgrades (openers it already has stay) */
  function fill(t,n,first){var x=X(),i=slot(t);if(i<0)return -1;var r=x.S.base.slots[i],L=live(t),keep={};(x.ADDONS[t]||[]).forEach(function(a){var e=a[3]||{};if((e.opens||e.trophy||e.retired)&&r.a&&r.a[a[0]])keep[a[0]]=1});
    var pick=(first||[]).concat(L.filter(function(k){return (first||[]).indexOf(k)<0}));r.a=keep;pick.slice(0,n).forEach(function(k){r.a[k]=1});x.persist();return window.__qbGoals.fill(t)}
  function half(t){var f=window.__qbGoals.fill(t);return fill(t,f.half)}
  function nextDay(){var o=st(),s=X().S;o.stepDay="";o.later={};o.lastScene=0;s.unlockDay="";s.areaDay="";X().persist();return 1}
  function scene(){var b=document.querySelector("#layer [data-act=styyes]");return b?b.dataset.v:null}
  function check(){closeAll();var o=st(),before=JSON.stringify([Object.keys(o.offer).sort(),Object.keys(o.done).sort()]);window.__qbStory.check();
    var sc=scene();var o2=st();return {scene:sc,offer:Object.keys(o2.offer).sort().join(","),changed:before!==JSON.stringify([Object.keys(o2.offer).sort(),Object.keys(o2.done).sort()])}}
  function yes(){var b=document.querySelector("#layer [data-act=styyes]");if(!b)return null;var v=b.dataset.v;b.click();return v}
  function steps(){return window.__qbGoals.steps()}
  function step(id){return steps().filter(function(s){return s.id===id})[0]}
  return {X:X,pops:pops,mods:mods,slot:slot,closeAll:closeAll,lvl:lvl,setLvl:setLvl,st:st,add:add,live:live,fill:fill,half:half,nextDay:nextDay,scene:scene,check:check,yes:yes,steps:steps,step:step}})();1`;
async function boot(br, o = {}) {
  const base = o.base || BASE;
  const pg = await br.page({ fresh: true });
  if (o.seed) { await pg.go(base + '/version.json'); await pg.ev(putLS(o.seed)); }
  await pg.go(base + '/');
  await pg.wait('!!(window.__qb && window.__qbStory && document.querySelector("#app") && !document.querySelector("#app .boot"))', 120000); await sleep(o.settle || 2500);
  await pg.ev(PAGE);
  if (!o.seed && o.char !== false) await pg.ev(`(function(){var x=window.__qb.x(),S=x.S;S.created=true;S.char=window.__qb.fixChar({name:'Fey',sex:'f'});S.welcomed=1;x.persist();x.render();return 1})()`);
  await sleep(800);
  return pg;
}
const E = (pg, f) => pg.ev(`(function(){var W=window.__wf;return (${f})})()`, 60000);
module.exports = { browser, sleep, boot, E, dumpLS, putLS, BASE, PAGE };
