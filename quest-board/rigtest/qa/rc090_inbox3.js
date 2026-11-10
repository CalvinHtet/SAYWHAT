// rc-0.90 inbox checks 1.3-1.6 (W38): the Shop header (pill, +, envelope; counts down after a buy), the clothing Checkout window
// (a pill beside the X), the Interface and Upgrades View windows (pill in the head; Checkout then counts the Shop pill down) and
// Challenge someone (Hall > Posts > Challenges: pill in the head). OUT: inbox4_*.png
//   CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/rc090_inbox3.js
const { browser } = require('./cdp.js');
const L = require('./rc090_inbox_lib.js');
const { OUT, sleep } = L;
const log = (s) => console.log(s);
(async () => {
  const br = await browser();
  const pg = await L.boot(br, { settle: 1500 });
  for (let k = 0; k < 10; k++) { await L.closeAll(pg); await sleep(400); }
  const headOf = (sel) => pg.ev(`(function(){var c=document.querySelector("${sel}");if(!c)return null;var h=c.querySelector(".rm-head"),p=h&&h.querySelector(".coinlive"),x=c.querySelector(".mx");var pr=p&&p.getBoundingClientRect(),xr=x&&x.getBoundingClientRect();
    return {pill:p?(p.querySelector("b")||p).textContent:"NO PILL",pillBox:pr?[Math.round(pr.left),Math.round(pr.top),Math.round(pr.right),Math.round(pr.bottom)].join(","):"",xBox:xr?[Math.round(xr.left),Math.round(xr.top),Math.round(xr.right),Math.round(xr.bottom)].join(","):"",gapToX:pr&&xr?Math.round(xr.left-pr.right):null,sameRowAsX:pr&&xr?Math.abs((pr.top+pr.bottom)/2-(xr.top+xr.bottom)/2)<16:null,overlapX:pr&&xr?!(pr.right<=xr.left||pr.left>=xr.right||pr.bottom<=xr.top||pr.top>=xr.bottom):null,title:(h&&h.firstElementChild?h.firstElementChild.textContent:"")}})()`);
  // ---- the Shop header
  await L.tapSel(pg, '.nav button[data-v="shop"]'); await sleep(2500); await L.closeAll(pg); await pg.ev('window.scrollTo(0,0);1'); await sleep(300);
  const sh = await pg.ev('(function(){var c=document.querySelector(".qs-cbar");if(!c)return null;var p=c.querySelector(".coinlive");return {pill:p?p.textContent.trim():"NO PILL",plus:!!c.querySelector(".kdbtn"),env:!!c.querySelector(".ibbtn"),stripHidden:getComputedStyle(document.querySelector(".strip")).display}})()');
  log('1.3 Shop header: ' + JSON.stringify(sh) + '; coins ' + (await L.coins(pg)));
  await pg.shot(OUT + '/inbox4_shop_header.png', await L.clipOf(pg, '.qs-top', 4));
  const pe = await L.tapSel(pg, '.qs-cbar .kdbtn'); await sleep(900);
  log('   Shop + tap hit=' + (pe && pe.hit) + ' -> ' + ((await L.modals(pg)).slice(0, 50) || 'nothing'));
  await L.closeAll(pg);
  // ---- clothing: try a piece on, Buy, the Checkout window, confirm; the Shop pill counts down
  const tr = await L.tapSel(pg, '[data-act=qstry]'); await sleep(1500);
  log('   tried on: ' + (tr ? tr.txt : 'NO TRY BUTTON') + ' hit=' + (tr && tr.hit));
  const bk = await L.tapSel(pg, '[data-act=qscheck]'); await sleep(1000);
  const ck = await headOf('#layer .qs-confirm');
  log('1.4 Checkout (Buy tap hit=' + (bk && bk.hit) + '): ' + JSON.stringify(ck) + '; coins ' + (await L.coins(pg)));
  await pg.shot(OUT + '/inbox4_checkout.png', await L.clipOf(pg, '#layer .qs-confirm', 0));
  let c0 = await L.coins(pg);
  const cf = await L.tapSel(pg, '#layer [data-act=qsconfirm]');
  let run = await L.pillRun(pg, '.qs-cbar .coinlive');
  let c1 = await L.coins(pg);
  log(`   confirm (hit=${cf && cf.hit}): coins ${c0} -> ${c1} (-${c0 - c1}); Shop pill ${run.map((r) => r[0] + 'ms:' + r[1]).join(' ')}; ${L.num(run[0][1]) === c0 && L.num(run[run.length - 1][1]) === c1 ? 'COUNTS DOWN TO THE RIGHT TOTAL' : 'MISMATCH'}`);
  await pg.ev('window.scrollTo(0,0);1'); await sleep(200);
  await pg.shot(OUT + '/inbox4_shop_after_clothes.png', await L.clipOf(pg, '.qs-top', 4));
  // ---- Interface and Upgrades: View, then Checkout
  for (const tab of ['interface', 'upgrades']) {
    await L.closeAll(pg);
    const tt = await L.tapSel(pg, `[data-act=stab][data-v="${tab}"]`); await sleep(1500);
    const vw = await pg.ev('(function(){var b=[].filter.call(document.querySelectorAll("[data-act=qsview]"),function(b){var it=b.closest(".item");return !(it&&it.classList.contains("cant"))})[0];if(!b)return null;b.scrollIntoView({block:"center"});var r=b.getBoundingClientRect();return {x:Math.round(r.left+r.width/2),y:Math.round(r.top+r.height/2),id:b.dataset.id,t:b.textContent.trim()}})()');
    if (!vw) { log(`1.5 ${tab}: tab tap ${tt ? 'ok' : 'NO TAB'}; NO VIEW BUTTON`); continue; }
    await sleep(300); await pg.tap(vw.x, vw.y); await sleep(1200);
    const vh = await headOf('#layer .qs-view');
    log(`1.5 ${tab}: View "${vw.id}" (${vw.t}): ${JSON.stringify(vh)}; coins ${await L.coins(pg)}`);
    await pg.shot(OUT + `/inbox4_view_${tab}.png`, await L.clipOf(pg, '#layer .qs-view', 0));
    c0 = await L.coins(pg);
    const vb = await L.tapSel(pg, '#layer [data-act=qsvbuy]');
    await pg.ev('window.scrollTo(0,0);1');
    run = await L.pillRun(pg, '.qs-cbar .coinlive');
    c1 = await L.coins(pg);
    log(`   Checkout (hit=${vb && vb.hit}): coins ${c0} -> ${c1} (-${c0 - c1}); Shop pill ${run.map((r) => r[0] + 'ms:' + r[1]).join(' ')}; ${L.num(run[run.length - 1][1]) === c1 ? 'right total' : 'WRONG TOTAL'}${L.num(run[0][1]) === c0 ? ', counted from the old total' : ''}`);
  }
  await L.closeAll(pg);
  // ---- Challenge someone
  await L.tapSel(pg, '.nav button[data-v="hall"]'); await sleep(2500); await L.closeAll(pg);
  log('   Hall tabs: ' + (await pg.ev('[].map.call(document.querySelectorAll(".htab button"),function(b){return b.innerText.trim()+(b.classList.contains("on")?"*":"")}).join(" | ")')));
  const nw = await L.tapSel(pg, '[data-dl=new]'); await sleep(1500);
  const dh = await headOf('#layer .dlm');
  log(`1.6 Challenge someone (tap hit=${nw && nw.hit}): ${JSON.stringify(dh)}; coins ${await L.coins(pg)}`);
  await pg.shot(OUT + '/inbox4_challenge.png', await L.clipOf(pg, '#layer .dlm', 0));
  // a stake choice redraws the window (dlPaint): the pill is still there and right
  await L.tapSel(pg, '#layer .dlm [data-dl=f][data-k=days]'); await sleep(600);
  log('   after a choice redraws it: ' + JSON.stringify(await headOf('#layer .dlm')));
  log('6. page errors ' + pg.errs.length + (pg.errs.length ? ': ' + pg.errs.slice(0, 5).join(' | ') : ''));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
