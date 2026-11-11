// w-floors QA (W42): the Shop's floors in the real UI. A fresh save below 30 builds the Closet (Street only), goes to 30 (the
// Boutique's window once, then its brands' splashes), the floor switch and each floor's header, a reload (no repeats), level 70
// (no Atelier), and a Wednesday. Every splash and window is logged in order; screenshots in OUT.
//   BASE=http://127.0.0.1:8819 OUT=<dir/> CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/wfloors_ui.js
const fs = require('fs');
const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8819', OUT = process.env.OUT || 'C:/Users/clvh/qa-wt/out/wfloors/', TAG = process.env.TAG || 'wf';
fs.mkdirSync(OUT, { recursive: true });
const out = []; const log = (s) => { out.push(s); console.log(s); };
const SPOIL = /Boutique|Atelier|VENOM ROSE|NICE COCK|SAYM[ØO]RE|CHROME RAIN|\bfloors?\b/gi;
const LVL = `function(L){var x=window.__qb.x(),s=x.S;s.xp=x.cum(L);s.gates=[];var g,n=0;while((g=x.gated())!==null&&n++<80)s.gates.push(g);x.persist();x.render();return x.effLvl()}`;
const OBS = String.raw`(function(){if(window.__wf)return 1;var W=window.__wf={ev:[],t0:Date.now()};
  var kind=function(n){if(n.classList.contains("dropsplash"))return "dropsplash";if(n.querySelector(".flsplash"))return "FLOOR";if(n.querySelector(".bsplash"))return "brand";if(n.querySelector(".rsplash"))return "room";return "modal"};
  new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType!==1)return;
    if(n.classList.contains("dropsplash")||(n.classList.contains("modal")&&n.closest("#layer"))){var k=kind(n);
      W.ev.push({t:Date.now()-W.t0,k:k,txt:(n.innerText||"").replace(/\s+/g," ").trim().slice(0,160),open:document.querySelectorAll(".bsplash,.flsplash,.dropsplash").length})}})})}).observe(document.body,{childList:true,subtree:true});return 1})()`;
(async () => {
  const br = await browser(); const pg = await br.page({ fresh: true });
  const E = (s, t) => pg.ev(s, t);
  let shotN = 0; const shot = async (name) => { const f = `${TAG}_${String(++shotN).padStart(2, '0')}_${name}.png`; await pg.shot(OUT + f); return f; };
  const boot = async () => { await pg.wait('!!(window.__qbDrops && window.__qb && window.__qb.x && document.querySelector("#app"))', 120000); await sleep(1200); await E(OBS); };
  // the splashes as they come, in order: a FLOOR window (optionally "Have a look"), brand windows and the old full-screen NEW DROP
  const seenShots = {};
  const settle = async (label, maxMs = 30000, quietMs = 7000, o = {}) => {
    const t0 = Date.now(); let lastAct = Date.now(); const got = [];
    while (Date.now() - t0 < maxMs && Date.now() - lastAct < quietMs) {
      await sleep(700);
      const cur = await E(`(function(){var d=document.querySelector(".dropsplash"),m=document.querySelector("#layer .modal");var n=d||m;if(!n)return null;
        return {k:d?"dropsplash":m.querySelector(".flsplash")?"FLOOR":m.querySelector(".bsplash")?"brand":m.querySelector(".rsplash")?"room":"modal",txt:(n.innerText||"").replace(/\\s+/g," ").trim().slice(0,140),
          n:document.querySelectorAll(".bsplash,.flsplash,.dropsplash").length}})()`);
      if (!cur) continue;
      lastAct = Date.now(); got.push(cur.k + ': ' + cur.txt);
      const key = cur.k + cur.txt.slice(0, 40);
      if (!seenShots[key] && (cur.k !== 'modal' || o.shotModals)) { seenShots[key] = 1; const f = await shot(label + '_' + cur.k); log(`   [${label}] ${cur.k} (${cur.n} splash elements on screen) ${f}: ${cur.txt}`); }
      else log(`   [${label}] ${cur.k}: ${cur.txt.slice(0, 100)}`);
      if (cur.k === 'FLOOR' && o.look) { await E('(function(){var b=document.querySelector("[data-flgo]");if(b)b.click();return 1})()'); await sleep(1500);
        const f = await shot(label + '_after_have_a_look'); log(`   [${label}] tapped "Have a look": ${f}; view ${await E('(function(){return document.body.classList.contains("shopmode")})()')}, floor on ${await E('(function(){var b=document.querySelector(".qs-floors .qs-tab.on");return b&&b.innerText})()')}`); continue; }
      await E(`(function(){var d=document.querySelector(".dropsplash");if(d){var x=d.querySelector(".dsx");if(x)x.click();else d.remove();return 1}
        document.querySelectorAll("#layer .modal").forEach(function(m){m.remove()});return 1})()`);
    }
    return got;
  };
  const shopInfo = async () => E(`(function(){var q=document.querySelector(".qshop");if(!q)return null;
    return {floors:[].map.call(document.querySelectorAll(".qs-floors .qs-tab"),function(b){return b.innerText+(b.classList.contains("on")?"*":"")}),
      head:[].map.call(q.querySelectorAll(".qs-top small"),function(s){return s.innerText}),
      tabs:[].map.call(document.querySelectorAll(".qs-tabs:not(.qs-floors) .qs-tab"),function(b){return b.innerText+(b.classList.contains("on")?"*":"")}),
      sale:(document.querySelector(".qs-sale")||{}).innerText||""}})()`);
  const nav = async (v) => E(`(function(){var b=document.querySelector('.nav button[data-v="${v}"]');if(!b)return "absent";b.click();return "ok"})()`);
  const scanAll = async (label) => {
    const tabs = await E(`[].map.call(document.querySelectorAll(".nav button[data-v]"),function(b){return b.dataset.v})`);
    const hits = [];
    for (const v of tabs) { await nav(v); await sleep(900);
      const t = await E(`(function(){var t=document.body.innerText;document.querySelectorAll("[aria-label],[title],img[alt]").forEach(function(e){["aria-label","title","alt"].forEach(function(a){var x=e.getAttribute(a);if(x)t+=" | "+x})});return t})()`);
      let m; SPOIL.lastIndex = 0; while ((m = SPOIL.exec(t))) hits.push(v + ': "' + m[0] + '" in "' + t.slice(Math.max(0, m.index - 50), m.index + 50).replace(/\s+/g, ' ') + '"'); }
    log(`   [${label}] text scan of tabs ${tabs.join(',')}: ${hits.length} hits ${JSON.stringify(hits.slice(0, 12))}`);
    return hits;
  };
  const setClock = async (utcMs) => E(`(function(){var real=Date.now()-(window.__qbShift||0);window.__qbShift=${utcMs}-real;var x=window.__qb.x();x.persist();x.render();return new Date().toISOString()})()`);
  const st = async () => E(`(function(){var S=window.__qb.x().S;return {lvl:window.__qb.x().effLvl(),floorSeen:S.floorSeen||null,brandSeen:Object.keys(S.brandSeen||{}),seenDr:Object.keys(S.seenDr||{}),
    alBrand:Object.keys((S.alSeen&&S.alSeen.brand)||{}),shopBang:!!document.querySelector('.nav button[data-v="shop"] .nbang'),open:__qbDrops.state().open,live:__qbDrops.state().live.map(function(b){return b.id+(b.back?"(back)":"")})}})()`);

  await pg.go(BASE + '/'); await boot();
  await E(`(function(){var x=window.__qb.x(),S=x.S;S.created=true;S.char=window.__qb.fixChar({name:'Fae',sex:'f'});S.welcomed=1;x.persist();x.render();return 1})()`);
  log('clock -> ' + await setClock(Date.UTC(2026, 10, 14, 20)) + ' (Sat 2026-11-14 12:00 PT)');
  log('\n== A. level 29, no Closet yet ==');
  log('   level ' + await E(`(${LVL})(29)`));
  await settle('A29', 25000, 5000);
  log('\n== B. build the Closet at 29 ==');
  await E(`(function(){var S=window.__qb.x().S;S.coins+=5000;window.__qbRooms.open("closet",1);window.__qb.x().persist();window.__qb.x().render();return 1})()`);
  const gotB = await settle('B29', 45000, 8000);
  log('   splashes at 29: ' + JSON.stringify(gotB.filter((g) => !/^modal/.test(g)).map((g) => g.slice(0, 60))));
  log('   state ' + JSON.stringify(await st()));
  await scanAll('B29');
  await nav('shop'); await sleep(1200);
  log('   Shop at 29: ' + JSON.stringify(await shopInfo()) + ' ' + await shot('29_shop'));
  log('   state after Shop visit ' + JSON.stringify(await st()));
  await nav('board'); await sleep(500);

  log('\n== C. level 30 ==');
  log('   level ' + await E(`(${LVL})(30)`) + '; Shop "!" right after: ' + JSON.stringify((await st()).shopBang));
  await sleep(300); log('   Shop "!" after a render: ' + await E('!!document.querySelector(\'.nav button[data-v="shop"] .nbang\')'));
  const gotC = await settle('C30', 60000, 9000, { look: true });
  log('   order at 30: ' + JSON.stringify(gotC.filter((g) => !/^modal/.test(g)).map((g) => g.slice(0, 70))));
  log('   state ' + JSON.stringify(await st()));
  await nav('shop'); await sleep(1000);
  for (const f of ['street', 'boutique']) {
    await E(`(function(){var b=document.querySelector('.qs-floors [data-qsfl="${f}"]');if(b)b.click();return !!b})()`); await sleep(900);
    log(`   Shop floor ${f}: ` + JSON.stringify(await shopInfo()) + ' ' + await shot('30_shop_' + f));
  }
  log('   Shop text has Atelier: ' + await E('/Atelier/i.test(document.body.innerText)'));
  await nav('board'); await sleep(500);

  log('\n== D. reload at 30 ==');
  await pg.go(BASE + '/'); await boot();
  const gotD = await settle('D30', 20000, 12000);
  log('   after reload: ' + JSON.stringify(gotD) + '; observer events ' + JSON.stringify(await E('window.__wf.ev')));
  log('   state ' + JSON.stringify(await st()));

  log('\n== E. level 70 ==');
  log('   level ' + await E(`(${LVL})(70)`));
  const gotE = await settle('E70', 20000, 9000);
  log('   splashes at 70: ' + JSON.stringify(gotE));
  await nav('shop'); await sleep(1000);
  log('   Shop at 70: ' + JSON.stringify(await shopInfo()) + ' ' + await shot('70_shop'));
  await scanAll('E70').then((h) => log('   Atelier hits at 70: ' + h.filter((x) => /Atelier/i.test(x)).length));

  log('\n== F. Wednesday 2026-12-02 10:00 PT at 70 ==');
  await nav('board'); log('clock -> ' + await setClock(Date.UTC(2026, 11, 2, 18)));
  const gotF = await settle('F_wed', 60000, 9000);
  log('   splashes: ' + JSON.stringify(gotF.filter((g) => !/^modal/.test(g)).map((g) => g.slice(0, 70))));
  log('   state ' + JSON.stringify(await st()));
  await nav('shop'); await sleep(1000);
  for (const f of ['street', 'boutique']) {
    await E(`(function(){var b=document.querySelector('.qs-floors [data-qsfl="${f}"]');if(b)b.click();return !!b})()`); await sleep(900);
    log(`   Wednesday Shop floor ${f}: ` + JSON.stringify(await shopInfo()) + ' ' + await shot('wed_shop_' + f));
  }
  log('\nobserver events (all): ' + JSON.stringify(await E('window.__wf.ev.map(function(e){return e.k+"@"+e.t+"("+e.open+") "+e.txt.slice(0,50)})')));
  log('page errors ' + pg.errs.length + ' ' + JSON.stringify(pg.errs.slice(0, 6)));
  fs.writeFileSync(OUT + TAG + '_ui.txt', out.join('\n') + '\n');
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); fs.writeFileSync(OUT + TAG + '_ui.txt', out.join('\n') + '\nFAIL ' + e.stack + '\n'); process.exit(1); });
