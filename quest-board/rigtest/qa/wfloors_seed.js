// w-floors QA (W42), check 7: an old save (seed_adv2.json, a whole localStorage at level 60, appv 88) on this build. Some Street and
// Boutique pieces are marked owned in the save before the first load (the seed owns none), so "owned stays owned" means something.
// Logs every splash in order, the floors, the owned pieces after load and after a reload.
//   BASE=http://127.0.0.1:8819 OUT=<dir/> [LV=20] CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/wfloors_seed.js
const fs = require('fs');
const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8819', OUT = process.env.OUT || 'C:/Users/clvh/qa-wt/out/wfloors/', LV = +(process.env.LV || 0);
const TAG = process.env.TAG || ('seed' + (LV || ''));
const out = []; const log = (s) => { out.push(s); console.log(s); };
const OWN = ['gx_h_varsity', 'gx_h_sneak', 'gx_y_track', 'gx_v_corset', 'gx_v_cap', 'gx_nc_tee', 'gx_sm_tee', 'gx_cr_trench'];
const OBS = String.raw`(function(){if(window.__wf)return 1;var W=window.__wf={ev:[],t0:Date.now()};
  new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType!==1)return;
    if(n.classList.contains("dropsplash")||(n.classList.contains("modal")&&n.closest("#layer"))){var k=n.classList.contains("dropsplash")?"dropsplash":n.querySelector(".flsplash")?"FLOOR":n.querySelector(".bsplash")?"brand":"modal";
      W.ev.push({t:Date.now()-W.t0,k:k,txt:(n.innerText||"").replace(/\s+/g," ").trim().slice(0,90)})}})})}).observe(document.body,{childList:true,subtree:true});return 1})()`;
(async () => {
  const seed = JSON.parse(fs.readFileSync('C:/Users/clvh/qa-wt/out/seed_adv2.json', 'utf8'));
  // both copies of the save (the local one and the sandbox store's mirror, which the load prefers)
  ['quest-board', 'qbsbx:data/users/sandbox/state'].forEach((k) => { if (!seed[k]) return; const S0 = JSON.parse(seed[k]); S0.owned = S0.owned || {};
    OWN.forEach((id) => (S0.owned[id] = true)); if (LV) S0.xp = 0; /* the level is set after load through cum(LV) */ seed[k] = JSON.stringify(S0); });
  const br = await browser(); const pg = await br.page({ fresh: true }); const E = (s, t) => pg.ev(s, t);
  let shotN = 0; const shot = async (name) => { const f = `${TAG}_${String(++shotN).padStart(2, '0')}_${name}.png`; await pg.shot(OUT + f); return f; };
  await pg.go(BASE + '/version.json');
  await E(`(function(o){localStorage.clear();Object.keys(o).forEach(function(k){localStorage.setItem(k,o[k])});return localStorage.length})(${JSON.stringify(seed)})`);
  if (LV) { // a save below 30: put the level into the save itself with this build's own curve, from a throwaway page first
    log('LV mode: level ' + LV);
  }
  const boot = async () => { await pg.wait('!!(window.__qbDrops && window.__qb && window.__qb.x && document.querySelector("#app"))', 120000); await E(OBS); await sleep(800); };
  await pg.go(BASE + '/'); await boot();
  if (LV) { log('   level -> ' + await E(`(function(L){var x=window.__qb.x(),s=x.S;s.xp=x.cum(L);s.gates=[];var g,n=0;while((g=x.gated())!==null&&n++<80)s.gates.push(g);x.persist();return x.effLvl()})(${LV})`)); await sleep(1500); await pg.go(BASE + '/'); await boot(); }
  const st = async () => E(`(function(){var x=window.__qb.x(),S=x.S;return {lvl:x.effLvl(),appv:S.appv,floorSeen:S.floorSeen||null,brandSeen:S.brandSeen,open:__qbDrops.state().open,
    live:__qbDrops.state().live.map(function(b){return b.id}),owned:${JSON.stringify(OWN)}.filter(function(k){return S.owned[k]}),nOwned:Object.keys(S.owned).filter(function(k){return S.owned[k]}).length,
    hasCloset:!!S.base.slots.filter(function(r){return r&&r.t==="closet"}).length}})()`);
  log('after load: ' + JSON.stringify(await st()));
  const got = [];
  const t0 = Date.now(); let last = Date.now();
  while (Date.now() - t0 < 70000 && Date.now() - last < 10000) {
    await sleep(700);
    const cur = await E(`(function(){var d=document.querySelector(".dropsplash"),m=document.querySelector("#layer .modal");var n=d||m;if(!n)return null;
      return {k:d?"dropsplash":m.querySelector(".flsplash")?"FLOOR":m.querySelector(".bsplash")?"brand":"modal",txt:(n.innerText||"").replace(/\\s+/g," ").trim().slice(0,110),n:document.querySelectorAll(".bsplash,.flsplash,.dropsplash").length}})()`);
    if (!cur) continue; last = Date.now(); got.push(cur.k + ': ' + cur.txt.slice(0, 70));
    if (cur.k !== 'modal') log(`   ${cur.k} (${cur.n} on screen) ${await shot(cur.k)}: ${cur.txt}`); else log('   modal: ' + cur.txt.slice(0, 90));
    await E(`(function(){var d=document.querySelector(".dropsplash");if(d){var x=d.querySelector(".dsx");if(x)x.click();else d.remove();return 1}document.querySelectorAll("#layer .modal").forEach(function(m){m.remove()});return 1})()`);
  }
  log('order: ' + JSON.stringify(got.filter((g) => !/^modal/.test(g))));
  log('state: ' + JSON.stringify(await st()));
  await E(`(function(){var b=document.querySelector('.nav button[data-v="shop"]');if(b)b.click();return 1})()`); await sleep(1200);
  const shop = await E(`(function(){return {floors:[].map.call(document.querySelectorAll(".qs-floors .qs-tab"),function(b){return b.innerText}),head:[].map.call(document.querySelectorAll(".qs-top small"),function(s){return s.innerText}),
    tabs:[].map.call(document.querySelectorAll(".qs-tabs:not(.qs-floors) .qs-tab"),function(b){return b.innerText})}})()`);
  log('Shop: ' + JSON.stringify(shop) + ' ' + await shot('shop'));
  // the Wardrobe tab of the Shop: owned pieces listed, and any Boutique word in it
  const wd = await E(`(function(){var b=document.querySelector('.qs-tabs [data-v="wardrobe"]');if(!b)return "no wardrobe tab";b.click();return 1})()`); await sleep(1000);
  const wt = await E('(function(){var q=document.querySelector(".qshop");return q?q.innerText:""})()');
  const hits = (wt.match(/Boutique|Atelier|VENOM ROSE|NICE COCK|SAYM[ØO]RE|CHROME RAIN/gi) || []);
  log('Wardrobe ' + wd + ': owned names shown ' + JSON.stringify(['Oversized Varsity','Lace Corset','Boxy Tee','GO OFF','Holo Trench'].filter((n) => wt.indexOf(n) >= 0)) + ', Boutique words ' + JSON.stringify(hits) + ' ' + await shot('wardrobe'));
  await E(`(function(){var b=document.querySelector('.nav button[data-v="board"]');if(b)b.click();return 1})()`);
  log('\nreload');
  await pg.go(BASE + '/'); await boot();
  const g2 = []; const t1 = Date.now(); let l2 = Date.now();
  while (Date.now() - t1 < 30000 && Date.now() - l2 < 12000) { await sleep(700);
    const cur = await E(`(function(){var d=document.querySelector(".dropsplash"),m=document.querySelector("#layer .modal");var n=d||m;if(!n)return null;return (d?"dropsplash":m.querySelector(".flsplash")?"FLOOR":m.querySelector(".bsplash")?"brand":"modal")+": "+(n.innerText||"").replace(/\\s+/g," ").trim().slice(0,70)})()`);
    if (!cur) continue; l2 = Date.now(); g2.push(cur);
    await E(`(function(){var d=document.querySelector(".dropsplash");if(d){var x=d.querySelector(".dsx");if(x)x.click();else d.remove();return 1}document.querySelectorAll("#layer .modal").forEach(function(m){m.remove()});return 1})()`); }
  log('after reload: ' + JSON.stringify(g2));
  log('state: ' + JSON.stringify(await st()));
  log('page errors ' + pg.errs.length + ' ' + JSON.stringify(pg.errs.slice(0, 6)));
  fs.writeFileSync(OUT + TAG + '.txt', out.join('\n') + '\n');
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); fs.writeFileSync(OUT + TAG + '.txt', out.join('\n') + '\nFAIL ' + e.stack + '\n'); process.exit(1); });
