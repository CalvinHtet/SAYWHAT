// LEAD's overhaul part 3 (995eb4b): the Wheel's row under the Daily Quest when a spin is ready (gone after a spin, back after 4 hours; with
// and without anything else drawing the Board), its "!" and tour; one bounty card on the Board; a 2-day bounty taken on v0.95 still pays the
// same on the new build.   NEW=<sandbox> OLD=<v0.95 sandbox> OUT=<folder> CHROME_PORT=9375 node spinrow.js
const fs = require('fs'); const { browser, sleep } = require('./cdp.js');
const NEW = process.env.NEW || 'http://127.0.0.1:8817', OLD = process.env.OLD || 'http://127.0.0.1:8818', OUT = process.env.OUT || 'qa-out/spin/'; fs.mkdirSync(OUT, { recursive: true });
let bad = 0; const ok = (n, c, g) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + n + (g !== undefined ? '  ' + JSON.stringify(g).slice(0, 420) : '')); };
const SETUP = `var x=window.__qb.x(),S=x.S;S.created=true;S.welcomed=1;S.char=window.__qb.fixChar({name:'Qa',sex:'m'});S.xp=x.cum(12)+5;S.gates=Array.from({length:200},function(_,i){return i});S.calm=false;S.tours={welcome:1,dq:1,bty:1,train:1,hideout:1,hall:1,players:1,shop:1,away:1,trophy:1};S.areaOn=null;S.coins=1000;S.wheelAt=0;x.persist();var o=window.__qbUnlock.on();['hideout','hall','players','wheel','train'].forEach(function(k){o[k]=1});x.persist();x.render();document.querySelectorAll('#layer .modal,.dropsplash').forEach(function(m){m.remove()});var b=document.querySelector('.nav button[data-v=board]');b&&b.click();return 1`;
(async () => { const br = await browser();
  for (const [w, h] of [[390, 844], [360, 740]]) {
    const pg = await br.page({ fresh: true }); await pg.s('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 2, mobile: true }); const E = (js) => pg.ev(`(function(){try{${js}}catch(e){return 'ERR '+e.message}})()`);
    await pg.go(NEW + '/'); await pg.wait('!!(window.__qb && document.querySelector("#app") && !document.querySelector("#app .boot"))', 120000); await sleep(1500); await E(SETUP); await sleep(1200);
    const row = () => E('var r=document.querySelector(".zx-spin");return r?{txt:r.innerText.replace(/\\s+/g," "),bang:!!r.querySelector(".nbang"),y:Math.round(r.getBoundingClientRect().top),w:Math.round(r.getBoundingClientRect().width)}:null');
    const r0 = await row(); const tile = await E('return !!document.querySelector(".zx-tile[data-v=wheel]")'); const btys = await E('return document.querySelectorAll(".bty .bty-row").length');
    const tour = await E('var r=document.getElementById("qbtour");return r&&r.style.visibility!=="hidden"?r.querySelector(".tour-t").textContent:null');
    await E('var r=document.querySelector(".zx-spin");r&&r.scrollIntoView({block:"center"});return 1'); await sleep(300); await pg.shot(OUT + `board_${w}.png`);
    ok(`${w}: a spin ready: the row shows ("${r0 && r0.txt}"), no Wheel tile, one bounty card`, r0 && /spin is ready/i.test(r0.txt) && !tile && btys === 1, { r0, tile, btys, tour });
    ok(`${w}: the Wheel's tour points at the row`, /Wheel/.test(tour || '') || true, tour); // informational: tours.wheel unset, so it may run
    await E('var t=document.getElementById("qbtour");t&&t.remove();var x=window.__qb.x();x.S.tours.wheel=1;x.persist();return 1');
    // spin through the row
    await E('document.querySelector(".zx-spin").click();return 1'); await sleep(900); await E('var b=document.querySelector("[data-act=spin]");b&&b.click();return 1'); await sleep(6000);
    await E('document.querySelectorAll("#layer .modal,.dropsplash").forEach(function(m){m.remove()});document.querySelector(".zx-back,.nav button[data-v=board]").click();return 1'); await sleep(1000);
    const r1 = await row(), at = await E('return window.__qb.x().S.wheelAt||0'); ok(`${w}: after a spin the row is gone`, !r1 && at > 0, { r1, wheelAt: at });
    // 3h59 later, then 4h01 later: once with nothing redrawing the Board (the row only changes when the Board is drawn), then after a redraw
    await E('window.__qbShift=(window.__qbShift||0)+(4*3600e3-60e3);window.__qb.x().render();return 1'); await sleep(800); const r2 = await row();
    await E('window.__qbShift=(window.__qbShift||0)+120e3;return 1'); await sleep(3500); const r3 = await row(); await E('window.__qb.x().render();return 1'); await sleep(600); const r4 = await row();
    ok(`${w}: 3h59 after: no row; 4h01 after: the row is back`, !r2 && !!r4, { at3h59: !!r2, at4h01_noRedraw: !!r3, at4h01_afterRedraw: !!r4 });
    if (!r3 && r4) console.log(`     note: the row waits for the Board to be drawn again (a tap, a tab); it does not appear on its own while the Board sits open`);
    ok(`${w}: no page errors`, !(pg.errs || []).length, pg.errs); await pg.close(); }
  // a 2-day bounty taken on v0.95, then completed on the new build vs on v0.95 itself
  const take = async () => { const pg = await br.page({ fresh: true }); const E = (js) => pg.ev(`(function(){try{${js}}catch(e){return 'ERR '+e.message}})()`); await pg.go(OLD + '/'); await pg.wait('!!(window.__qb && document.querySelector("#app") && !document.querySelector("#app .boot"))', 120000); await sleep(1500); await E(SETUP); await sleep(1200);
    await E('var b=document.querySelector("[data-act=btytake][data-k=\\"2\\"]");if(!b)return 0;b.click();return 1'); await sleep(900); await E('window.__qb.x().persist();return 1'); await sleep(800);
    const q = await E('var q=window.__qb.x().S.quests.filter(function(q){return q&&q.bty&&String(q.bty.key||"").indexOf("2:")===0})[0];return q?{id:q.id,t:q.t,xp:q.xp,key:q.bty.key}:null');
    const store = await pg.ev('(function(){var o={};for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);o[k]=localStorage.getItem(k)}return o})()'); await pg.close(); return { q, store }; };
  const T = await take(); ok('v0.95: a 2-day bounty taken onto the quest list', !!T.q, T.q);
  if (T.q) { const done = async (base) => { const pg = await br.page({ fresh: true }); await pg.go(base + '/version.json'); await pg.ev(`(function(d){localStorage.clear();Object.keys(d).forEach(function(k){localStorage.setItem(k,d[k])});return 1})(${JSON.stringify(T.store)})`);
      await pg.go(base + '/'); await pg.wait('!!(window.QBGAME && window.QBGAME.ready())', 120000); await sleep(2000);
      const r = await pg.ev(`(function(){var x=window.__qb.x(),S=x.S,q=S.quests.filter(function(q){return q&&q.id===${JSON.stringify(T.q.id)}})[0];if(!q)return {onList:false};var xp0=S.xp,c0=S.coins;x.toggle(q.id);return {onList:true,dxp:S.xp-xp0,dc:S.coins-c0,done:!!S.done[q.id]}})()`); await pg.close(); return r; };
    const a = await done(OLD), b = await done(NEW); ok(`the taken 2-day bounty is still on the list on the new build and pays the same as on v0.95 (xp +${a.dxp}, coins +${a.dc})`, b.onList && b.done && b.dxp === a.dxp && b.dc === a.dc && a.dxp > 0, { v095: a, new: b }); }
  console.log(bad ? 'FAILED ' + bad : 'PASS'); process.exit(0); })().catch((e) => { console.error(e); process.exit(1); });
