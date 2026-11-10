// rc-0.90 inbox check 3, cleanly: the welcome letter pops by itself for a save from before the inbox (once the class window is
// gone), is closed with a finger tap on the X without claiming (badge must stay 1), opened again from the envelope and the list
// and closed with Back and X (badge still 1), then claimed (exactly +3,000, badge gone). OUT: inbox1b_*.png
//   CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/rc090_inbox1b.js
const { browser } = require('./cdp.js');
const L = require('./rc090_inbox_lib.js');
const { OUT, sleep } = L;
const badge = (pg) => pg.ev('[].map.call(document.querySelectorAll(".ibbtn"),function(b){var r=b.getBoundingClientRect();return (r.width?"":"hidden:")+((b.querySelector("i")||{}).textContent||"0")+" ["+b.getAttribute("aria-label")+"]"}).join(" , ")');
(async () => {
  const br = await browser();
  const pg = await L.boot(br, { settle: 1500 });
  const log = (s) => console.log(s);
  log('first windows: ' + (await L.modals(pg)) + '; badge ' + (await badge(pg)));
  // the seed's own windows (Class Awakening, a brand drop, story beats) come first: welcomeOnce waits for each to close
  const gone = [];
  let w = false; for (let k = 0; k < 40 && !w; k++) { await sleep(500); w = await pg.ev('!!document.querySelector("#layer .ibmodal [data-ib=claim]")');
    if (!w) { const m = await L.modals(pg); if (m) { gone.push(m.slice(0, 40)); await L.closeAll(pg); } } }
  log('closed first: ' + gone.join(' / '));
  log('welcome letter popped by itself after the other window closed: ' + w + ' -> ' + (await L.modals(pg)).slice(0, 100));
  await pg.shot(OUT + '/inbox1b_welcome_popped.png');
  const c0 = await L.coins(pg);
  let t = await L.tapSel(pg, '#layer .ibmodal .mx'); await sleep(800);
  log('tap X (hit ' + (t && t.hit) + '): windows ' + ((await L.modals(pg)) || 'none') + '; badge ' + (await badge(pg)) + '; coins ' + (await L.coins(pg)) + ' (was ' + c0 + '); letters ' + JSON.stringify(await L.S(pg, 'S.letters')));
  await pg.shot(OUT + '/inbox1b_closed_unclaimed.png');
  await L.closeAll(pg);
  // again: envelope -> list -> letter -> back to the list -> X
  t = await L.tapSel(pg, '.strip .ibbtn'); await sleep(700);
  log('tap envelope (hit ' + (t && t.hit) + '): ' + (await L.modals(pg)).slice(0, 100) + '; row unread class: ' + (await pg.ev('(document.querySelector("#layer .ibrow[data-id=welcome]")||{}).className||"none"')));
  await pg.shot(OUT + '/inbox1b_list.png');
  t = await L.tapSel(pg, '#layer .ibrow[data-id=welcome]'); await sleep(700);
  log('tap row (hit ' + (t && t.hit) + '): claim button ' + (await pg.ev('!!document.querySelector("#layer [data-ib=claim]")')) + '; badge ' + (await badge(pg)));
  t = await L.tapSel(pg, '#layer .ibback'); await sleep(700);
  log('tap Back (hit ' + (t && t.hit) + '): ' + (await L.modals(pg)).slice(0, 80) + '; badge ' + (await badge(pg)));
  t = await L.tapSel(pg, '#layer .ibmodal .mx'); await sleep(700);
  log('tap X: windows ' + ((await L.modals(pg)) || 'none') + '; badge ' + (await badge(pg)));
  await pg.shot(OUT + '/inbox1b_badge_still1.png', await L.clipOf(pg, '.strip', 6));
  // reload: still 1, and no second pop
  await pg.go(L.BASE + '/'); await pg.wait('!!(window.__qb && document.querySelector(".ibbtn"))', 120000); await sleep(1500); const g2 = []; for (let k = 0; k < 12; k++) { const m = await L.modals(pg); if (m) g2.push(m.slice(0, 40)); await L.closeAll(pg); await sleep(500); } log("after reload closed: " + (g2.join(" / ") || "nothing"));
  log('after reload (+5 s): windows ' + ((await L.modals(pg)) || 'none') + '; badge ' + (await badge(pg)));
  // claim
  await L.closeAll(pg); t = await L.tapSel(pg, '.strip .ibbtn'); await sleep(600); t = await L.tapSel(pg, '#layer .ibrow[data-id=welcome]'); await sleep(600);
  const c1 = await L.coins(pg);
  t = await L.tapSel(pg, '#layer [data-ib=claim]'); await sleep(1500);
  const c2 = await L.coins(pg);
  log('tap Claim (hit ' + (t && t.hit) + '): coins ' + c1 + ' -> ' + c2 + ' (+' + (c2 - c1) + '); header pill ' + (await pg.ev('(document.querySelector(".strip .coinpill")||{}).textContent')) + '; badge ' + (await badge(pg)));
  await pg.shot(OUT + '/inbox1b_claimed.png');
  await L.closeAll(pg); await sleep(300);
  await pg.shot(OUT + '/inbox1b_badge_cleared.png', await L.clipOf(pg, '.strip', 6));
  log('page errors ' + pg.errs.length + (pg.errs.length ? ': ' + pg.errs.slice(0, 5).join(' | ') : ''));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
