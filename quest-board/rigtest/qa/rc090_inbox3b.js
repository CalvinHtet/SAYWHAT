// rc-0.90 inbox: follow-up on rc090_inbox3.js. (a) Challenge someone first, on a fresh load. (b) The Upgrades tab's Checkout: the
// Shop pill stayed on the old total for 1.2 s; watch it for 4 s, list every .coinlive and window, and look again after a redraw.
// OUT: inbox5_*.png
//   CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/rc090_inbox3b.js
const { browser } = require('./cdp.js');
const L = require('./rc090_inbox_lib.js');
const { OUT, sleep } = L;
const log = (s) => console.log(s);
const pills = (pg) => pg.ev('[].map.call(document.querySelectorAll(".coinlive"),function(e){var r=e.getBoundingClientRect();return (e.parentElement.className||"?")+":"+(e.querySelector("b")||e).textContent+" c="+e.dataset.c+(e._run?" run":"")+(r.width?"":" hidden")}).join(" ; ")');
(async () => {
  const br = await browser();
  const pg = await L.boot(br, { settle: 1500 });
  for (let k = 0; k < 10; k++) { await L.closeAll(pg); await sleep(400); }
  // (a) Challenge someone
  const hv = await L.tapSel(pg, '.nav button[data-v="hall"]'); await sleep(2500); await L.closeAll(pg);
  log('hall nav tap hit=' + (hv && hv.hit) + '; Hall tabs: ' + (await pg.ev('[].map.call(document.querySelectorAll(".htab button"),function(b){return b.innerText.trim()+(b.classList.contains("on")?"*":"")}).join(" | ")')) + '; challenges card: ' + (await pg.ev('!!document.getElementById("dlcard")')));
  const nw = await L.tapSel(pg, '[data-dl=new]'); await sleep(1500);
  const dh = await pg.ev('(function(){var c=document.querySelector("#layer .dlm");if(!c)return null;var h=c.querySelector(".rm-head"),p=h&&h.querySelector(".coinlive"),x=c.querySelector(".mx"),pr=p.getBoundingClientRect(),xr=x.getBoundingClientRect(),tr=h.firstElementChild.getBoundingClientRect();return {pill:(p.querySelector("b")||p).textContent,pill_lt:[Math.round(pr.left),Math.round(pr.top)],title:h.firstElementChild.textContent,title_top:Math.round(tr.top),x_lt:[Math.round(xr.left),Math.round(xr.top)]}})()');
  log(`1.6 Challenge someone (tap hit=${nw && nw.hit}): ${JSON.stringify(dh)}; coins ${await L.coins(pg)}`);
  await pg.shot(OUT + '/inbox5_challenge.png', await L.clipOf(pg, '#layer .dlm', 0));
  await L.closeAll(pg);
  // (b) the Upgrades Checkout
  await L.tapSel(pg, '.nav button[data-v="shop"]'); await sleep(2500); await L.closeAll(pg);
  await L.tapSel(pg, '[data-act=stab][data-v="upgrades"]'); await sleep(1500);
  const vw = await pg.ev('(function(){var b=[].filter.call(document.querySelectorAll("[data-act=qsview]"),function(b){var it=b.closest(".item");return !(it&&it.classList.contains("cant"))})[0];if(!b)return null;b.scrollIntoView({block:"center"});var r=b.getBoundingClientRect();return {x:Math.round(r.left+r.width/2),y:Math.round(r.top+r.height/2),id:b.dataset.id}})()');
  await sleep(300); await pg.tap(vw.x, vw.y); await sleep(1200);
  log('View ' + vw.id + ': ' + (await L.modals(pg)).slice(0, 60) + '; pills: ' + (await pills(pg)));
  const c0 = await L.coins(pg);
  const vb = await L.tapSel(pg, '#layer [data-act=qsvbuy]');
  const run = await L.pillRun(pg, '.qs-cbar .coinlive', [0, 200, 400, 700, 1000, 1500, 2500, 4000]);
  const c1 = await L.coins(pg);
  log(`Upgrade Checkout (hit=${vb && vb.hit}): coins ${c0} -> ${c1}; Shop pill ${run.map((r) => r[0] + 'ms:' + r[1]).join(' ')}`);
  log('   windows: ' + ((await L.modals(pg)) || 'none') + '; pills: ' + (await pills(pg)) + '; view tab on: ' + (await pg.ev('(document.querySelector(".qs-tab.on")||{}).textContent')) + '; S.view=' + (await pg.ev('(document.querySelector(".nav button.on")||{}).dataset&&document.querySelector(".nav button.on").dataset.v')));
  await pg.ev('window.scrollTo(0,0);1'); await sleep(200);
  await pg.shot(OUT + '/inbox5_upgrade_after.png');
  // the second Upgrade, the same way
  await L.closeAll(pg);
  const vw2 = await pg.ev('(function(){var b=[].filter.call(document.querySelectorAll("[data-act=qsview]"),function(b){var it=b.closest(".item");return !(it&&it.classList.contains("cant"))})[0];if(!b)return null;b.scrollIntoView({block:"center"});var r=b.getBoundingClientRect();return {x:Math.round(r.left+r.width/2),y:Math.round(r.top+r.height/2),id:b.dataset.id}})()');
  if (vw2) {
    await sleep(300); await pg.tap(vw2.x, vw2.y); await sleep(1200);
    const d0 = await L.coins(pg); await L.tapSel(pg, '#layer [data-act=qsvbuy]');
    const run2 = await L.pillRun(pg, '.qs-cbar .coinlive', [0, 200, 400, 700, 1000, 1500, 2500]);
    log(`second Upgrade ${vw2.id}: coins ${d0} -> ${await L.coins(pg)}; Shop pill ${run2.map((r) => r[0] + 'ms:' + r[1]).join(' ')}; pills: ${await pills(pg)}`);
  }
  // an Interface piece again, for comparison
  await L.tapSel(pg, '[data-act=stab][data-v="interface"]'); await sleep(1500);
  const vw3 = await pg.ev('(function(){var b=[].filter.call(document.querySelectorAll("[data-act=qsview]"),function(b){var it=b.closest(".item");return !(it&&it.classList.contains("cant"))})[0];if(!b)return null;b.scrollIntoView({block:"center"});var r=b.getBoundingClientRect();return {x:Math.round(r.left+r.width/2),y:Math.round(r.top+r.height/2),id:b.dataset.id}})()');
  if (vw3) {
    await sleep(300); await pg.tap(vw3.x, vw3.y); await sleep(1200);
    const d0 = await L.coins(pg); await L.tapSel(pg, '#layer [data-act=qsvbuy]');
    const run3 = await L.pillRun(pg, '.qs-cbar .coinlive', [0, 200, 400, 700, 1000, 1500, 2500]);
    log(`Interface ${vw3.id}: coins ${d0} -> ${await L.coins(pg)}; Shop pill ${run3.map((r) => r[0] + 'ms:' + r[1]).join(' ')}; pills: ${await pills(pg)}`);
  }
  log('6. page errors ' + pg.errs.length + (pg.errs.length ? ': ' + pg.errs.slice(0, 5).join(' | ') : ''));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
