// rc-0.90 QA fixes re-check (copy of rc089_wheel_lib.js, outputs under rc090/fixes): shared helpers. Test-only; touches nothing in the game.
const fs = require('fs'), path = require('path');
const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8816';
const OUTW = process.env.OUTW || 'C:/Users/clvh/qa-wt/out/rc090/fixes/wheel', OUTD = process.env.OUTD || 'C:/Users/clvh/qa-wt/out/rc090/fixes/drops';
fs.mkdirSync(OUTW, { recursive: true }); fs.mkdirSync(OUTD, { recursive: true });

// before the app runs: record every pop's text and every brand splash that opens; optionally stretch the wheel's 3600 ms result timer
const HOOK = `(function(){window.__qaPops=[];window.__qaSplash=[];window.__qaSpinDelay=null;
var st=window.setTimeout;window.setTimeout=function(f,ms){if(ms===3600&&window.__qaSpinDelay!=null){var a=[].slice.call(arguments);a[1]=window.__qaSpinDelay;return st.apply(this,a)}return st.apply(this,arguments)};
document.addEventListener('DOMContentLoaded',function(){var L=document.getElementById('layer')||document.body;new MutationObserver(function(ms){ms.forEach(function(m){[].forEach.call(m.addedNodes,function(n){if(!n.classList)return;
 if(n.classList.contains('pop'))window.__qaPops.push({t:Date.now(),txt:n.textContent});
 var b=n.querySelector&&n.querySelector('.bsplash');if(b){var nm=(b.querySelector('.blg b')||{}).textContent;window.__qaSplash.push({t:Date.now(),name:nm,b:(b.querySelector('[data-act=bsgo]')||{dataset:{}}).dataset.b})}})})}).observe(L,{childList:true,subtree:true})});})();`;

async function open(o = {}) {
  const br = await browser();
  const pg = await br.page({ fresh: true });
  await pg.s('Emulation.setTimezoneOverride', { timezoneId: 'America/Los_Angeles' });
  await pg.s('Page.addScriptToEvaluateOnNewDocument', { source: HOOK });
  if (o.seed) {
    await pg.go(BASE + '/version.json');
    await pg.ev(`(function(d){localStorage.clear();Object.keys(d).forEach(function(k){localStorage.setItem(k,d[k])});return 1})(${JSON.stringify(o.seed)})`);
  }
  await pg.go(BASE + '/');
  await pg.wait('!!(window.__qb && window.__qb.x && window.QBLoft && document.querySelector("#app"))', 120000);
  await sleep(1500);
  return { br, pg };
}
// a new character through the hooks (as mkseed.js), level LV with its trials passed, every area seen
async function newPlayer(pg, o = {}) {
  return pg.ev(`(function(){var x=window.__qb.x(),S=x.S;S.created=true;S.char=window.__qb.fixChar({name:'QA',sex:'${o.sex || 'm'}'});S.welcomed=1;
    S.xp=Math.max(S.xp||0,x.cum(${o.lv || 8}));var g,n=0;while((g=x.gated())!==null&&n++<60)S.gates.push(g);S.lvPaid=${o.lv || 8};
    S.areaOn={};['board','train','hideout','shop','hall','trophy','wheel','away'].forEach(function(a){S.areaOn[a]=1});
    document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});x.persist();x.render();return {lvl:x.effLvl(),coins:S.coins,owned:Object.keys(S.owned).length}})()`);
}
const closeModals = (pg) => pg.ev('(function(){var n=0;document.querySelectorAll("#layer .modal").forEach(function(e){e.remove();n++});return n})()');
const nav = (pg, v) => pg.ev(`(function(){var b=document.querySelector('.nav button[data-v="${v}"]');if(!b)return 'no button';b.click();return b.className})()`);
const out = (file, o) => fs.appendFileSync(file, JSON.stringify(o) + '\n');
// ms to shift the game clock so that it reads the given Pacific wall time (Y,M,D,h,m in PST, UTC-8)
const shiftTo = (Y, M, D, h, m = 0) => Date.UTC(Y, M - 1, D, h + 8, m) - Date.now();
module.exports = { browser, sleep, BASE, OUTW, OUTD, open, newPlayer, closeModals, nav, out, shiftTo, fs, path };
