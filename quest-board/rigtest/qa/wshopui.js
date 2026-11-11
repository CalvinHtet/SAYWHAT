// w-shopui (W47, BUILDER 16:41): 1. a fresh level-1 save: "?" nav tabs ("Lv N" when a level opens them), no Shop tab, no Crawls; a "?"
// tap and the profile's Wardrobe button say "Locked. Keep playing." and name nothing. 2. The Closet built through its card: the Shop
// tab, its header at 390 px ("The Shop", the drop-days line, coins/+/envelope), the Wardrobe button on top, no "old favorite" text.
// 3. The vault: no vault on the Wednesdays before 6 brands have dropped; Wed 12-02 09:00 "THE VAULT IS OPEN" once and a "↺" tab;
// no second splash after a reload; gone Thu 08:01; back with a new splash on 12-09. 4. Level 35: the Boutique "!" survives a Street
// visit and a reload and clears only on the Boutique floor. Pictures in OUT.
//   BASE=http://127.0.0.1:8818 CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/wshopui.js
const fs = require('fs');
const { browser, sleep, boot, E, PAGE } = require('./wfocus_lib.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8818', OUT = process.env.OUT || require('os').tmpdir() + '/qa-out/wshopui/';
fs.mkdirSync(OUT, { recursive: true });
const log = (...a) => console.log(a.map((v) => (typeof v === 'string' ? v : JSON.stringify(v))).join(' '));
const NAV = '(function(){return [].map.call(document.querySelectorAll(".nav button"),function(b){return (b.classList.contains("lk")?"[locked] ":"")+b.dataset.v+" \\""+b.innerText.replace(/\\s+/g," ").trim()+"\\" aria=\\""+b.getAttribute("aria-label")+"\\""})})()';
const POPS = '(function(){var p=window.__wf.pops.splice(0);return p})()';
(async () => {
  const br = await browser();
  let pg = await boot(br, { base: BASE }); await E(pg, 'W.closeAll()');
  // 1
  log('1. fresh level', await pg.ev('window.__qb.x().effLvl()'), 'nav:'); (await pg.ev(NAV)).forEach((n) => log('   ' + n));
  const taps = [];
  for (const v of await pg.ev('[].map.call(document.querySelectorAll(".nav button.lk"),function(b){return b.dataset.v})')) {
    await pg.ev(`(function(){var b=document.querySelector('.nav button[data-v="${v}"]');b&&b.click();return 1})()`); await sleep(400); taps.push(v + ': ' + JSON.stringify(await pg.ev(POPS))); }
  log('   taps on "?":', taps);
  const wd = await pg.ev(`(async function(){var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})};var c=document.querySelector('[data-act=char]');c&&c.click();await w(700);
    var b=document.querySelector('#layer [data-act=wardrobe]');var t=b?b.innerText:null;b&&b.click();await w(400);var p=window.__wf.pops.splice(0);document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});return {button:t,pops:p,view:document.querySelector('.nav button.on')?document.querySelector('.nav button.on').dataset.v:null}})()`);
  log('   profile Wardrobe button:', wd);
  await pg.shot(OUT + '1_fresh_nav.png');
  // 2: the Closet through its card (Bedroom at 30%)
  await E(pg, 'W.lvl(4)'); await E(pg, 'W.fill("bedroom",10)'); await pg.ev('(function(){window.__qb.x().S.coins=20000;window.__qb.x().persist();return 1})()');
  // the Walk-in Closet card needs the Figurine Cabinet first (ADDREQ bd_ward2 <- bd_ward1); a player buys the card the window lists first
  const bought = await pg.ev(`(async function(){var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})},x=window.__qb.x(),S=x.S,i=S.base.slots.findIndex(function(r){return r&&r.t==='bedroom'}),path=[];
    for(var k=0;k<3;k++){document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});window.__qb.roomModal(i);await w(500);var b=document.querySelector('#layer [data-act=raddon][data-id="bd_ward2"]');
      if(b){b.click();await w(1500);path.push('bd_ward2');break}var f=document.querySelector('#layer [data-act=raddon][data-id="bd_ward1"]');if(!f)return 'no bd_ward2 or bd_ward1 button';f.click();await w(900);path.push('bd_ward1')}
    return 'bought '+path.join(' then ')+'; closet '+S.base.slots.some(function(r){return r&&r.t==='closet'})})()`);
  log('2. build the Closet:', bought); await sleep(1500); await E(pg, 'W.closeAll()'); log('   pops', await pg.ev(POPS));
  log('   nav:'); (await pg.ev(NAV)).forEach((n) => log('   ' + n));
  await pg.ev('(function(){var b=document.querySelector(".nav button[data-v=shop]");b&&b.click();return 1})()'); await sleep(1500); await E(pg, 'W.closeAll()');
  const head = await pg.ev(`(function(){var h=document.querySelector('.qs-head'),g=function(s){var e=document.querySelector(s);if(!e)return null;var r=e.getBoundingClientRect();return {t:e.innerText.replace(/\\s+/g,' ').trim().slice(0,60),x:Math.round(r.left),y:Math.round(r.top),w:Math.round(r.width)}};
    var app=document.getElementById('app').innerText;return {head:g('.qs-head'),title:g('.qs-head h1'),when:g('.qs-when'),coin:g('.qs-coin'),plus:g('.qs-head ~ * [data-act=coinplus], [data-act=coinplus]'),env:g('.ibbtn'),wardrobe:g('.qs-wdb'),cd:g('.qs-cd'),
      oldfav:/old favou?rite/i.test(app),wed:/Wednesday/i.test(app),overflow:document.documentElement.scrollWidth>innerWidth}})()`);
  log('   Shop header:', head); await pg.shot(OUT + '2_shop_header.png');
  const wdb = await pg.ev(`(async function(){var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})};var b=document.querySelector('.qs-wdb');b&&b.click();await w(600);return {on:(document.querySelector('.qs-tab.on')||{}).innerText||null,text:document.getElementById('app').innerText.replace(/\\s+/g,' ').slice(0,120)}})()`);
  log('   Wardrobe button lands on:', wdb);
  // 3: the vault on Wednesdays (clock moved with __qbShift; drop days are 8 am Pacific = 16:00 UTC). Every brand window is recorded from
  // the moment the page starts (also across a reload), and a player closes each one with its X, then taps the Shop tab again.
  const OBS = `(function(){var go=function(){new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType!==1)return;var b=n.classList&&n.classList.contains('bsplash')?n:(n.querySelector&&n.querySelector('.bsplash'));
    if(b){var a=JSON.parse(localStorage.getItem('qa_spl')||'[]');a.push(b.innerText.replace(/\\s+/g,' ').replace(/^✕ /,'').slice(0,60));localStorage.setItem('qa_spl',JSON.stringify(a))}})})}).observe(document.documentElement,{childList:true,subtree:true})};
    if(document.documentElement)go();else document.addEventListener('DOMContentLoaded',go)})();`;
  await pg.s('Page.addScriptToEvaluateOnNewDocument', { source: OBS }); await pg.ev(OBS);
  const setClock = (iso) => pg.ev(`(function(){var real=Date.now()-(window.__qbShift||0);window.__qbShift=Date.parse("${iso}")-real;var x=window.__qb.x();x.persist();x.render();return new Date().toISOString()})()`);
  const play = async (label, secs) => {
    for (let t = 0; t < secs; t += 2) {
      const open = await pg.ev('(function(){var b=document.querySelector(".bsplash");if(b){var x=b.closest(".modal")&&b.closest(".modal").querySelector(".dsx,[data-act=mclose],.x,button[aria-label=Close]");if(x)x.click();else b.closest(".modal")&&b.closest(".modal").remove();return 1}document.querySelectorAll("#layer .modal").forEach(function(m){m.remove()});return 0})()');
      if (!open && t % 6 === 0) await pg.ev('(function(){var b=document.querySelector(".nav button[data-v=board]");b&&b.click();var s=document.querySelector(".nav button[data-v=shop]");s&&s.click();return 1})()');
      await sleep(2000); }
    const spl = await pg.ev('(function(){var a=JSON.parse(localStorage.getItem("qa_spl")||"[]");localStorage.setItem("qa_spl","[]");return a})()');
    const tabs = await pg.ev('[].map.call(document.querySelectorAll(".qs-tabs .qs-tab"),function(b){return b.innerText.replace(/\\s+/g," ").trim()})');
    const seen = await pg.ev('Object.keys(window.__qb.x().S.brandSeen||{}).filter(function(k){return /\\|2026-12/.test(k)})');
    log(`   ${label}: windows ${JSON.stringify(spl)} | tabs ${JSON.stringify(tabs.filter((t) => !/^(Basics|Upgrades|Interface)$/.test(t)))} | seen Dec stints ${JSON.stringify(seen)}`); };
  log('3. the vault:');
  await play('before (today, the Closet just built)', 8);
  for (const d of ['2026-11-11', '2026-11-18', '2026-11-25']) { await setClock(d + 'T17:00:00Z'); await play('Wed ' + d + ' 09:00 PT', 14); }
  await setClock('2026-12-02T17:00:00Z'); await play('Wed 12-02 09:00 PT', 20); await pg.shot(OUT + '3_vault_1202.png');
  await pg.go(BASE + '/'); await pg.wait('!!(window.__qb && document.querySelector(".nav button[data-v=board]"))', 120000); await pg.ev(PAGE);
  await play('Wed 12-02 after a reload', 14);
  await setClock('2026-12-03T16:01:00Z'); await play('Thu 12-03 08:01 PT', 8);
  await setClock('2026-12-09T17:00:00Z'); await play('Wed 12-09 09:00 PT', 20);
  log('   page errors', pg.errs.length, pg.errs.slice(0, 2)); await pg.close();
  // 4: level 35, the Boutique "!" (a fresh page, the clock on a Friday the Boutique drops)
  pg = await boot(br, { base: BASE }); await E(pg, 'W.closeAll()'); await E(pg, 'W.lvl(35)'); await E(pg, 'W.add("closet")'); await sleep(1000);
  const bang = () => pg.ev('[].map.call(document.querySelectorAll(".qs-floors .qs-tab"),function(b){return b.innerText.replace(/\\s+/g," ").trim()+(b.querySelector(".qs-flnew")?" [!]":"")+(b.classList.contains("on")?" (on)":"")})');
  const toShop = async () => { await E(pg, 'W.closeAll()'); await pg.ev('(function(){var b=document.querySelector(".nav button[data-v=board]");b&&b.click();var s=document.querySelector(".nav button[data-v=shop]");s&&s.click();return 1})()'); await sleep(1500); await E(pg, 'W.closeAll()'); };
  await toShop(); log('4. level 35, Shop floors:', await bang());
  await pg.ev('(function(){var b=document.querySelector(".nav button[data-v=board]");b&&b.click();return 1})()'); await sleep(600); await toShop(); log('   after leaving and coming back (Street):', await bang());
  await pg.go(BASE + '/'); await pg.wait('!!(window.__qb && document.querySelector(".nav button[data-v=board]"))', 120000); await sleep(2500); await pg.ev(PAGE);
  await toShop(); log('   after a reload:', await bang());
  await pg.ev('(function(){var b=document.querySelector(".qs-floors [data-qsfl=boutique]");b&&b.click();return 1})()'); await sleep(1000); await E(pg, 'W.closeAll()'); log('   on the Boutique floor:', await bang());
  await pg.ev('(function(){var b=document.querySelector(".qs-floors [data-qsfl=street]");b&&b.click();return 1})()'); await sleep(800); log('   back on the Street:', await bang());
  await pg.shot(OUT + '4_floors.png');
  log('   page errors', pg.errs.length, pg.errs.slice(0, 2));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
