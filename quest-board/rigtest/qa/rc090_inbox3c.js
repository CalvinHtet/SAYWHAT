// rc-0.90 inbox: why rc090_inbox3.js's third Shop buy (an Upgrade after a clothing piece and an Interface piece) leaves the Shop pill
// part-way down and the Hall nav dead. Same sequence, then watch the page for 8 s: the pill, rAF, round-trip time, overlays.
// OUT: inbox6_*.png
//   CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/rc090_inbox3c.js
const { browser } = require('./cdp.js');
const L = require('./rc090_inbox_lib.js');
const { OUT, sleep } = L;
const log = (s) => console.log(s);
const viewBtn = (pg) => pg.ev('(function(){var b=[].filter.call(document.querySelectorAll("[data-act=qsview]"),function(b){var it=b.closest(".item");return !(it&&it.classList.contains("cant"))})[0];if(!b)return null;b.scrollIntoView({block:"center"});var r=b.getBoundingClientRect();return {x:Math.round(r.left+r.width/2),y:Math.round(r.top+r.height/2),id:b.dataset.id}})()');
const state = (pg) => pg.ev(`(function(){var t0=performance.now();return new Promise(function(ok){var done=0;requestAnimationFrame(function(){if(!done){done=1;ok(r(Math.round(performance.now()-t0)))}});setTimeout(function(){if(!done){done=1;ok(r("NO rAF in 1s"))}},1000)});
  function r(raf){var e=document.querySelector(".qs-cbar .coinlive");var top=document.elementFromPoint(innerWidth/2,innerHeight-40);
    return {raf:raf,vis:document.visibilityState,pill:e?(e.querySelector("b")||e).textContent+" c="+e.dataset.c+" run="+(e._run||0):"NONE",coins:Math.floor(window.__qb.x().S.coins),
      modals:document.querySelectorAll("#layer .modal").length,layerKids:[].map.call(document.getElementById("layer").children,function(k){return k.className}).join(","),navHit:top?top.tagName+"."+String(top.className).slice(0,30):"none",
      bodyKids:[].filter.call(document.body.children,function(k){var s=getComputedStyle(k);return s.position==="fixed"&&s.display!=="none"&&k.id!=="layer"}).map(function(k){return (k.id||k.className||k.tagName).toString().slice(0,30)}).join(",")}}})()`);
(async () => {
  const br = await browser();
  const pg = await L.boot(br, { settle: 1500 });
  for (let k = 0; k < 10; k++) { await L.closeAll(pg); await sleep(400); }
  await L.tapSel(pg, '.nav button[data-v="shop"]'); await sleep(2500); await L.closeAll(pg);
  await L.tapSel(pg, '[data-act=qstry]'); await sleep(1500); await L.tapSel(pg, '[data-act=qscheck]'); await sleep(1000); await L.tapSel(pg, '#layer [data-act=qsconfirm]'); await sleep(2000);
  log('after clothes: ' + JSON.stringify(await state(pg)));
  await L.closeAll(pg);
  await L.tapSel(pg, '[data-act=stab][data-v="interface"]'); await sleep(1500);
  let v = await viewBtn(pg); await sleep(300); await pg.tap(v.x, v.y); await sleep(1200); await L.tapSel(pg, '#layer [data-act=qsvbuy]'); await sleep(2000);
  log('after interface ' + v.id + ': ' + JSON.stringify(await state(pg)));
  await L.closeAll(pg);
  await L.tapSel(pg, '[data-act=stab][data-v="upgrades"]'); await sleep(1500);
  v = await viewBtn(pg); await sleep(300); await pg.tap(v.x, v.y); await sleep(1200);
  log('upgrade view ' + v.id + ': ' + JSON.stringify(await state(pg)));
  const t0 = Date.now();
  await L.tapSel(pg, '#layer [data-act=qsvbuy]');
  for (let k = 0; k < 8; k++) { await sleep(700); const a = Date.now(); const s = await state(pg); log(`  +${Date.now() - t0}ms (eval ${Date.now() - a}ms): ${JSON.stringify(s)}`); }
  await pg.shot(OUT + '/inbox6_after_upgrade.png');
  const nb = await L.vis(pg, '.nav button[data-v="hall"]');
  log('hall nav: ' + JSON.stringify(nb));
  await pg.tap(nb.x, nb.y); await sleep(3000);
  log('after hall tap: view ' + (await pg.ev('(document.querySelector(".nav button.on")||{dataset:{}}).dataset.v')) + '; htab ' + (await pg.ev('document.querySelectorAll(".htab button").length')) + '; ' + JSON.stringify(await state(pg)));
  await pg.shot(OUT + '/inbox6_after_hall_tap.png');
  log('page errors ' + pg.errs.length + (pg.errs.length ? ': ' + pg.errs.slice(0, 5).join(' | ') : ''));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
