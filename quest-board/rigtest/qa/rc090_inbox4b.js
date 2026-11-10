// rc-0.90 inbox check 4, the new player's half again: rc090_inbox4.js's tap on the locked Wheel landed on the welcome letter's
// Claim button (the letter opened between the clean-up and the tap). Wait for the letter, close it, then tap the Wheel. OUT: inbox7b_*.png
//   CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/rc090_inbox4b.js
const { browser } = require('./cdp.js');
const L = require('./rc090_inbox_lib.js');
const { OUT, sleep } = L;
(async () => {
  const br = await browser();
  const p2 = await L.boot(br, { seed: false, settle: 2000 });
  await p2.ev(`(function(){var x=window.__qb.x(),S=x.S;S.created=true;S.char=window.__qb.fixChar({name:'Newbie',sex:'f'});x.persist();x.render();return 1})()`);
  let w = false; const seen = [];
  for (let k = 0; k < 30 && !w; k++) { await sleep(500); const m = await L.modals(p2); if (m) seen.push(m.slice(0, 40)); w = await p2.ev('!!document.querySelector("#layer .ibmodal")'); if (m && !w) await L.closeAll(p2); }
  console.log('windows seen: ' + seen.join(' / ') + '; welcome letter: ' + w);
  await L.tapSel(p2, '#layer .ibmodal .mx'); await sleep(2500); await L.closeAll(p2);
  const wl = await L.vis(p2, '.nav button[data-v="wheel"]');
  await p2.tap(wl.x, wl.y); await sleep(400);
  console.log(`4. new player (Lv ${await L.S(p2, 'x.effLvl()')}, coins ${await L.coins(p2)}): Wheel nav aria "${wl.aria}", label "${wl.txt.replace(/\s+/g, ' ')}", tap hit=${wl.hit}; it says: ${await p2.ev('[].map.call(document.querySelectorAll(".pop"),function(p){return p.textContent}).join(" / ")||"nothing"')}`);
  await p2.shot(OUT + '/inbox7b_newplayer_wheel_locked.png');
  console.log('6. page errors ' + p2.errs.length + (p2.errs.length ? ': ' + p2.errs.slice(0, 5).join(' | ') : ''));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
