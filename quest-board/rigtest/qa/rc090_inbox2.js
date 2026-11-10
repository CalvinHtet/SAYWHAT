// rc-0.90 inbox check 1.1 and 1.2 (W38): the coin pill with + and envelope on the room window's head and the Build window's
// head, and after each purchase the pill counts down to the new total. Room upgrade (Bedroom), Room style (decor), the Garden's
// Farm Stand and its produce stand (Sell), a repaint (150; no button for it exists, so a button with its data-act is clicked), and
// a room bought from an empty lot. OUT: inbox3_*.png
//   CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/rc090_inbox2.js
const { browser } = require('./cdp.js');
const L = require('./rc090_inbox_lib.js');
const { OUT, sleep } = L;
const log = (s) => console.log(s);
(async () => {
  const br = await browser();
  const pg = await L.boot(br, { settle: 1500 });
  for (let k = 0; k < 10; k++) { await L.closeAll(pg); await sleep(400); }
  await L.tapSel(pg, '.nav button[data-v="hideout"]'); await sleep(2000); await L.closeAll(pg);
  const slot = (t) => L.S(pg, `S.base.slots.findIndex(function(r){return r&&r.t==="${t}"})`);
  const head = async (name) => { await pg.ev('(function(){var m=document.querySelector("#layer .modal");if(m)m.scrollTop=0;return 1})()'); await sleep(150); return pg.shot(OUT + '/' + name, await L.clipOf(pg, '#layer .modal .card', 0)); };
  const headInfo = (root) => pg.ev(`(function(){var h=document.querySelector("${root} .rm-head");if(!h)return "NO HEAD";var p=h.querySelector(".coinlive");return {pill:p?(p.querySelector("b")||p).textContent:"NO PILL",plus:!!h.querySelector(".kdbtn"),env:!!h.querySelector(".ibbtn"),oneLine:(function(){var ks=[].map.call(h.children,function(c){return Math.round(c.getBoundingClientRect().top)});return ks.join("/")})()}})()`);
  // one purchase: tap (finger) or click the button, then read the pill over time against S.coins
  async function buyAndWatch(label, root, btnSel, how, shotName) {
    const c0 = await L.coins(pg);
    let tv = null;
    if (how === 'tap') { tv = await L.tapSel(pg, btnSel, root); if (!tv) { log(`1. ${label}: BUTTON NOT FOUND (${btnSel})`); return; } }
    else await pg.ev(how);
    const run = await L.pillRun(pg, `#layer ${root} .coinlive`);
    const c1 = await L.coins(pg);
    const info = await headInfo(root);
    await head(shotName);
    const fin = L.num(run[run.length - 1][1]);
    const counted = L.num(run[0][1]) === c0 && fin === c1;
    log(`1. ${label}: ${tv ? 'tapped "' + tv.txt + '" hit=' + tv.hit : 'clicked'}; coins ${c0} -> ${c1} (-${c0 - c1}); pill ${run.map((r) => r[0] + 'ms:' + r[1]).join(' ')}; ${counted ? 'COUNTS DOWN TO THE RIGHT TOTAL' : 'MISMATCH'}; head ${JSON.stringify(info)}`);
  }

  // ---- Bedroom: no upgrades, then buy the first upgrade on offer
  await L.S(pg, 'window.__qbRooms.all("bedroom",0),1'); await sleep(500); await L.closeAll(pg);
  const bi = await slot('bedroom');
  await L.S(pg, `window.__qb.roomModal(${bi}),1`); await sleep(1500);
  log('room window head: ' + JSON.stringify(await headInfo('.rmodal')) + '; coins ' + (await L.coins(pg)));
  await head('inbox3_room_before.png');
  const firstUp = await pg.ev('(function(){var b=[].filter.call(document.querySelectorAll("#layer .rmodal [data-act=raddon]"),function(b){return !b.classList.contains("ghost")})[0];return b?b.dataset.id+" "+b.textContent.trim():"none"})()');
  log('   first upgrade on offer: ' + firstUp);
  await buyAndWatch('1.1 room upgrade (Bedroom ' + firstUp + ')', '.rmodal', '[data-act=raddon]:not(.ghost)', 'tap', 'inbox3_room_upgrade_after.png');
  await sleep(600); for (const m of (await L.modals(pg)).split(' | ')) if (m && !/rmodal/.test(m)) log('   another window: ' + m.slice(0, 80));
  await pg.ev('(function(){[].forEach.call(document.querySelectorAll("#layer .modal"),function(m){if(!m.querySelector(".rmodal"))m.remove()});return 1})()');
  // ---- Room style (decor)
  await L.S(pg, `window.__qb.roomModal(${bi}),1`); await sleep(1200);
  await pg.ev('(function(){var d=document.querySelector("#layer .rmodal details[data-k=st]");if(d)d.open=true;return 1})()'); await sleep(300);
  log('   room styles: ' + (await pg.ev('[].map.call(document.querySelectorAll("#layer .rmodal .dst"),function(d){return d.innerText.replace(/\\s+/g," ").trim()}).join(" | ")')));
  await buyAndWatch('1.1 decor (Bedroom room style)', '.rmodal', '[data-act=decbuy]', 'tap', 'inbox3_room_decor_after.png');
  // ---- repaint: the handler is there (150), the button is not; click a button carrying its data-act inside the room window
  log('   a Repaint button in the room window: ' + (await pg.ev('!!document.querySelector("[data-act=rpaint]")')));
  await buyAndWatch('1.1 repaint (150, injected button)', '.rmodal', null, `(function(){var c=document.querySelector("#layer .rmodal");var b=document.createElement("button");b.dataset.act="rpaint";b.dataset.i="${bi}";c.appendChild(b);b.click();return 1})()`, 'inbox3_room_repaint_after.png');
  // ---- the room window's envelope with a finger
  const re = await L.tapSel(pg, '.rmodal .rm-head .ibbtn'); await sleep(800);
  log('   room window envelope tap ' + JSON.stringify(re) + ' -> ' + (await L.modals(pg)).slice(0, 60));
  await L.closeAll(pg);
  // ---- Garden: Farm Stand (2,500) and selling produce at the stand
  const gi = await slot('garden');
  log('   garden had Farm Stand: ' + (await L.S(pg, `!!S.base.slots[${gi}].a.g_stand`)));
  await L.S(pg, `(delete S.base.slots[${gi}].a.g_stand, S.base.food.veg=12, x.persist(), x.render(), 1)`); await sleep(500);
  await L.S(pg, `window.__qb.roomModal(${gi}),1`); await sleep(1500);
  await pg.ev('(function(){var d=document.querySelector("#layer .rmodal details[data-k=av]");if(d)d.open=true;return 1})()');
  await head('inbox3_garden_before.png');
  await buyAndWatch('1.1 Garden Farm Stand', '.rmodal', '[data-act=raddon][data-id=g_stand]', 'tap', 'inbox3_garden_stand_after.png');
  await pg.ev('(function(){[].forEach.call(document.querySelectorAll("#layer .modal"),function(m){if(!m.querySelector(".rmodal"))m.remove()});return 1})()');
  const c0 = await L.coins(pg);
  const sv = await L.tapSel(pg, '[data-act=stysell]', '#layer .rmodal');
  const run = await L.pillRun(pg, '#layer .rmodal .coinlive');
  log(`1. 1.1 Garden produce stand Sell (${sv ? sv.txt + ' hit=' + sv.hit : 'NOT FOUND'}): coins ${c0} -> ${await L.coins(pg)}; pill ${run.map((r) => r[0] + 'ms:' + r[1]).join(' ')}`);
  await head('inbox3_garden_sell_after.png');
  await L.closeAll(pg);
  // ---- an empty lot: take the Club off the street, tap its lot, read the Build window, buy it back
  const ci = await slot('club');
  await L.S(pg, `(S.base.slots[${ci}]=null, x.persist(), x.render(), 1)`); await sleep(1500); await L.closeAll(pg);
  log('   lots open: ' + JSON.stringify(await pg.ev('window.__qbStory.lots()')) + '; build targets: ' + (await pg.ev('[].map.call(document.querySelectorAll("[data-lf^=build]"),function(g){var r=g.getBoundingClientRect();return g.getAttribute("data-lf")+"@"+Math.round(r.left+r.width/2)+","+Math.round(r.top+r.height/2)}).join(" ")')));
  let lot = await pg.ev('(function(){var g=document.querySelector("[data-lf^=build]");if(!g)return null;var r=g.getBoundingClientRect();return {x:Math.round(r.left+r.width/2),y:Math.round(r.top+r.height/2),on:r.left+r.width/2>0&&r.left+r.width/2<innerWidth&&r.top>0&&r.bottom<innerHeight}})()');
  if (lot && !lot.on) { // bring it on screen: the view's pan
    await pg.ev('(function(){var g=document.querySelector("[data-lf^=build]");g.scrollIntoView&&g.scrollIntoView({block:"center",inline:"center"});return 1})()'); await sleep(400);
    lot = await pg.ev('(function(){var g=document.querySelector("[data-lf^=build]");var r=g.getBoundingClientRect();return {x:Math.round(r.left+r.width/2),y:Math.round(r.top+r.height/2),on:r.left+r.width/2>0&&r.left+r.width/2<innerWidth&&r.top>0&&r.bottom<innerHeight}})()');
  }
  await pg.shot(OUT + '/inbox3_lot.png');
  let how = 'none';
  if (lot && lot.on) { const hit = await pg.ev(`(function(){var h=document.elementFromPoint(${lot.x},${lot.y});return h?h.tagName+(h.closest("[data-lf]")?" in "+h.closest("[data-lf]").getAttribute("data-lf"):""):"none"})()`); how = 'finger tap at ' + lot.x + ',' + lot.y + ' (lands on ' + hit + ')'; await pg.tap(lot.x, lot.y); await sleep(1200); }
  if (!(await pg.ev('!!document.querySelector("#layer [data-act=rdo]")')) && lot) { how += '; then pointer events on the lot'; await pg.ev('(function(){var g=document.querySelector("[data-lf^=build] rect");var r=g.getBoundingClientRect(),o={bubbles:true,pointerId:7,clientX:r.left+r.width/2,clientY:r.top+r.height/2,isPrimary:true};g.dispatchEvent(new PointerEvent("pointerdown",o));g.dispatchEvent(new PointerEvent("pointerup",o));return 1})()'); await sleep(1200); }
  const bw = await pg.ev('(function(){var c=[].filter.call(document.querySelectorAll("#layer .modal .card"),function(c){return /Build a room/.test(c.innerText)})[0];if(!c)return null;var h=c.querySelector(".rm-head"),p=h&&h.querySelector(".coinlive");return {pill:p?p.textContent.trim():"NO PILL",plus:!!(h&&h.querySelector(".kdbtn")),env:!!(h&&h.querySelector(".ibbtn")),rooms:[].map.call(c.querySelectorAll("[data-act=rdo]"),function(b){return b.dataset.t+" "+b.textContent.trim()}).join(", ")}})()');
  log(`1. 1.2 Build window via ${how}: ${JSON.stringify(bw)}; coins ${await L.coins(pg)}`);
  await head('inbox3_build_window.png');
  if (bw) {
    const c0b = await L.coins(pg);
    const tb = await L.tapSel(pg, '#layer [data-act=rdo]'); await sleep(200);
    await pg.ev('(function(){[].forEach.call(document.querySelectorAll("#layer .modal"),function(m){m.remove()});return 1})()');
    const r2 = await L.pillRun(pg, '.lfhud .coinlive', [0, 150, 350, 600, 900, 1300]);
    log(`   bought from the lot (tap hit=${tb && tb.hit}): coins ${c0b} -> ${await L.coins(pg)}; Loft HUD pill ${r2.map((r) => r[0] + 'ms:' + r[1]).join(' ')}`);
    await pg.shot(OUT + '/inbox3_build_after_hud.png', await L.clipOf(pg, '.lfhud', 10));
  }
  log('6. page errors ' + pg.errs.length + (pg.errs.length ? ': ' + pg.errs.slice(0, 5).join(' | ') : ''));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
