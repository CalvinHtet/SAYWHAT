// rc-0.90 inbox check 1.2: an empty lot (the Club taken off its building), entered with finger taps (the building, then the lot),
// the Build window's head (pill, +, envelope), and buying the room back: the Loft HUD pill counts down. OUT: inbox3b_*.png
//   CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/rc090_inbox2b.js
const { browser } = require('./cdp.js');
const L = require('./rc090_inbox_lib.js');
const { OUT, sleep } = L;
const log = (s) => console.log(s);
(async () => {
  const br = await browser();
  const pg = await L.boot(br, { settle: 1500 });
  for (let k = 0; k < 10; k++) { await L.closeAll(pg); await sleep(400); }
  await L.tapSel(pg, '.nav button[data-v="hideout"]'); await sleep(2000); await L.closeAll(pg);
  const ci = await L.S(pg, 'S.base.slots.findIndex(function(r){return r&&r.t==="club"})');
  const bi = await pg.ev('(function(){var o=window.__qbRooms.list();for(var b in o)if(o[b].indexOf("club")>=0)return +b;return -1})()');
  await L.S(pg, `(S.base.slots[${ci}]=null, x.persist(), x.render(), 1)`); await sleep(1500); await L.closeAll(pg);
  log('club slot ' + ci + ' emptied; its building ' + bi + '; lots open ' + JSON.stringify(await pg.ev('window.__qbStory.lots()')));
  const bg = await pg.ev(`(function(){var g=document.querySelector('[data-act=bldgo][data-v="${bi}"] rect');if(!g)return null;var r=g.getBoundingClientRect();return {x:Math.round(Math.min(Math.max(r.left+r.width/2,20),innerWidth-20)),y:Math.round(Math.min(r.top+r.height*.75,innerHeight-160)),l:Math.round(r.left),r:Math.round(r.right)}})()`);
  log('building target ' + JSON.stringify(bg));
  let how = '';
  if (bg && bg.l < 370 && bg.r > 20) { const x = Math.max(bg.l + 10, Math.min(bg.r - 10, bg.x)); await pg.tap(x, bg.y); how = 'finger tap on the building at ' + x + ',' + bg.y; await sleep(1800); }
  if (!(await pg.ev('!!document.querySelector(".lfbtop")'))) { how += ' (did not enter; clicked its data-act)'; await pg.ev(`(function(){var b=document.createElement("button");b.dataset.act="bldgo";b.dataset.v="${bi}";document.body.appendChild(b);b.click();b.remove();return 1})()`); await sleep(1800); }
  await L.closeAll(pg);
  log('in building: ' + (await pg.ev('(document.querySelector(".lfbtop")||{}).textContent||"NO"')) + ' via ' + how);
  const lots = await pg.ev('[].map.call(document.querySelectorAll("[data-lf^=build]"),function(g){var r=g.getBoundingClientRect();return {lf:g.getAttribute("data-lf"),x:Math.round(r.left+r.width/2),y:Math.round(r.top+r.height/2)}})');
  log('lots on screen: ' + JSON.stringify(lots));
  await pg.shot(OUT + '/inbox3b_building_lot.png');
  let lt = 'none';
  if (lots.length) {
    const p = lots[0];
    const on = p.x > 0 && p.x < 390 && p.y > 0 && p.y < 760;
    if (on) { const hit = await pg.ev(`(function(){var h=document.elementFromPoint(${p.x},${p.y});var g=h&&h.closest&&h.closest("[data-lf]");return (h?h.tagName:"none")+(g?" in "+g.getAttribute("data-lf"):"")})()`); await pg.tap(p.x, p.y); lt = `finger tap at ${p.x},${p.y} (lands on ${hit})`; await sleep(1500); }
    if (!(await pg.ev('!!document.querySelector("#layer [data-act=rdo]")'))) { lt += '; window did not open, pointer events on the lot instead'; await pg.ev('(function(){var g=document.querySelector("[data-lf^=build] rect")||document.querySelector("[data-lf^=build]");var r=g.getBoundingClientRect(),o={bubbles:true,pointerId:7,clientX:r.left+r.width/2,clientY:r.top+r.height/2,isPrimary:true};g.dispatchEvent(new PointerEvent("pointerdown",o));g.dispatchEvent(new PointerEvent("pointerup",o));return 1})()'); await sleep(1500); }
  }
  const bw = await pg.ev('(function(){var c=[].filter.call(document.querySelectorAll("#layer .modal .card"),function(c){return /Build a room/.test(c.innerText)})[0];if(!c)return null;var h=c.querySelector(".rm-head"),p=h&&h.querySelector(".coinlive");return {pill:p?p.textContent.trim():"NO PILL",plus:!!(h&&h.querySelector(".kdbtn")),env:!!(h&&h.querySelector(".ibbtn")),tops:[].map.call(h.children,function(k){return Math.round(k.getBoundingClientRect().top)}).join("/"),rooms:[].map.call(c.querySelectorAll("[data-act=rdo]"),function(b){return b.dataset.t+" "+b.textContent.trim()}).join(", ")}})()');
  log(`1.2 Build window (${lt}): ${JSON.stringify(bw)}; coins ${await L.coins(pg)}`);
  await pg.shot(OUT + '/inbox3b_build_window.png', await L.clipOf(pg, '#layer .modal .card', 0));
  if (bw) {
    const ev = await L.tapSel(pg, '#layer .modal .rm-head .ibbtn'); await sleep(700);
    log('   Build window envelope tap hit=' + (ev && ev.hit) + ' -> ' + (await L.modals(pg)).slice(0, 50));
    await L.closeAll(pg);
    // reopen and buy it back
    await pg.ev('(function(){var g=document.querySelector("[data-lf^=build] rect")||document.querySelector("[data-lf^=build]");var r=g.getBoundingClientRect(),o={bubbles:true,pointerId:8,clientX:r.left+r.width/2,clientY:r.top+r.height/2,isPrimary:true};g.dispatchEvent(new PointerEvent("pointerdown",o));g.dispatchEvent(new PointerEvent("pointerup",o));return 1})()'); await sleep(1200);
    const c0 = await L.coins(pg);
    const tb = await L.tapSel(pg, '#layer [data-act=rdo]'); await sleep(150);
    const left = await L.modals(pg);
    await L.closeAll(pg);
    const r2 = await L.pillRun(pg, '.lfhud .coinlive', [0, 150, 350, 600, 900, 1300]);
    const c1 = await L.coins(pg);
    log(`   bought (tap hit=${tb && tb.hit}): coins ${c0} -> ${c1} (-${c0 - c1}); window after: ${left.slice(0, 60) || 'none'}; Loft HUD pill ${r2.map((r) => r[0] + 'ms:' + r[1]).join(' ')}; final ${L.num(r2[r2.length - 1][1]) === c1 ? 'RIGHT' : 'WRONG'}`);
    await pg.shot(OUT + '/inbox3b_after_build_hud.png', await L.clipOf(pg, '.lfhud', 10));
  }
  log('6. page errors ' + pg.errs.length + (pg.errs.length ? ': ' + pg.errs.slice(0, 5).join(' | ') : ''));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
