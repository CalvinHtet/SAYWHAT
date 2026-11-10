// rc-0.90 inbox check 3 (welcome letter: close without claiming keeps the badge, claim pays exactly 3,000 and clears it),
// check 2 (an envelope on every main screen, and a finger tap on it opens the inbox) and check 1.7 (the Loft HUD's + and envelope
// take real taps). OUT: inbox1_*.png
//   CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/rc090_inbox1.js
const { browser } = require('./cdp.js');
const L = require('./rc090_inbox_lib.js');
const { OUT, sleep } = L;
const badge = (pg) => L.S(pg, '[].map.call(document.querySelectorAll(".ibbtn"),function(b){var r=b.getBoundingClientRect();return (r.width?"vis":"hid")+":"+((b.querySelector("i")||{}).textContent||"0")+" ["+b.getAttribute("aria-label")+"]"}).join(" , ")');
(async () => {
  const br = await browser();
  const pg = await L.boot(br, { settle: 1000 });
  const log = (s) => console.log(s);
  // ---- check 3: the welcome letter opens by itself for a save from before the inbox
  let w = null; for (let k = 0; k < 16 && !w; k++) { await sleep(500); w = await pg.ev('!!document.querySelector("#layer .ibmodal")'); }
  log('3. welcome popped by itself: ' + w + '; windows: ' + (await L.modals(pg)));
  log('   letters state: ' + JSON.stringify(await L.S(pg, 'S.letters')));
  const c0 = await L.coins(pg);
  await pg.shot(OUT + '/inbox1_welcome_open.png');
  log('   claim button: ' + JSON.stringify(await L.vis(pg, '[data-ib=claim]')) + '; badge: ' + (await badge(pg)));
  const x = await L.tapSel(pg, '#layer .ibmodal .mx'); await sleep(800);
  log('   tapped X ' + JSON.stringify(x) + ' -> windows: ' + ((await L.modals(pg)) || 'none') + '; badge: ' + (await badge(pg)) + '; coins ' + (await L.coins(pg)) + ' (before ' + c0 + ')');
  await pg.shot(OUT + '/inbox1_welcome_closed_badge.png', await L.clipOf(pg, '.strip', 6));
  // reload: the badge still counts the unpaid letter after a fresh load, and the letter does not pop again
  await pg.go(L.BASE + '/'); await pg.wait('!!(window.__qb && document.querySelector(".ibbtn"))', 120000); await sleep(4000);
  log('   after reload: windows: ' + ((await L.modals(pg)) || 'none') + '; badge: ' + (await badge(pg)));
  await L.closeAll(pg);
  // open the inbox with a finger, then the letter, then Claim
  let t = await L.tapSel(pg, '.strip .ibbtn'); await sleep(700);
  log('   tap envelope ' + JSON.stringify(t) + ' -> ' + (await L.modals(pg)));
  await pg.shot(OUT + '/inbox1_list_unclaimed.png');
  t = await L.tapSel(pg, '#layer .ibrow[data-id=welcome]'); await sleep(700);
  log('   tap welcome row (hit ' + (t && t.hit) + ') -> ' + (await L.modals(pg)).slice(0, 120));
  const c1 = await L.coins(pg);
  t = await L.tapSel(pg, '#layer [data-ib=claim]'); await sleep(1200);
  const c2 = await L.coins(pg);
  log('   tap Claim (hit ' + (t && t.hit) + '): coins ' + c1 + ' -> ' + c2 + ' = +' + (c2 - c1) + '; badge: ' + (await badge(pg)) + '; letters ' + JSON.stringify(await L.S(pg, 'S.letters')));
  log('   letter now says: ' + (await pg.ev('(document.querySelector("#layer .ibmodal .ibgot")||{}).textContent||"no claimed note"')) + '; claim button left: ' + (await pg.ev('!!document.querySelector("#layer [data-ib=claim]")')));
  await pg.shot(OUT + '/inbox1_claimed.png');
  // a second claim through the same click path pays nothing
  await pg.ev('(function(){var b=document.createElement("button");b.dataset.ib="claim";b.dataset.id="welcome";document.body.appendChild(b);b.click();b.remove();return 1})()'); await sleep(500);
  log('   forced second claim: coins ' + (await L.coins(pg)) + ' (was ' + c2 + ')');
  await L.closeAll(pg); await sleep(300);
  log('   badge after closing: ' + (await badge(pg)));
  await pg.shot(OUT + '/inbox1_claimed_badge.png', await L.clipOf(pg, '.strip', 6));

  // ---- check 2: every main screen, a finger tap on the envelope
  for (const v of ['board', 'train', 'hideout', 'shop', 'hall', 'trophy', 'wheel', 'away']) {
    await L.closeAll(pg);
    const nav = await L.tapSel(pg, `.nav button[data-v="${v}"]`); await sleep(1800);
    await L.closeAll(pg); await pg.ev('window.scrollTo(0,0);1'); await sleep(400);
    const all = await pg.ev('[].map.call(document.querySelectorAll(".ibbtn"),function(b){var r=b.getBoundingClientRect();var p=b.parentElement;return (p.className||p.tagName)+"@"+Math.round(r.left)+","+Math.round(r.top)+(r.width?"":" hidden")}).join(" ; ")');
    const sel = v === 'shop' ? '.qs-cbar .ibbtn' : v === 'hideout' ? '.strip .ibbtn' : '.ibbtn';
    const e = await L.vis(pg, sel);
    await pg.shot(OUT + `/inbox2_${v}_env.png`);
    let opened = false, tv = null;
    if (e) { tv = await L.tapSel(pg, sel); await sleep(800); opened = await pg.ev('!!document.querySelector("#layer .ibmodal")'); }
    await pg.shot(OUT + `/inbox2_${v}_tap.png`);
    log(`2. ${v}: nav ${nav ? 'ok' : 'NO NAV'}; envelopes [${all}]; tapped ${sel} at ${tv ? tv.x + ',' + tv.y + ' hit=' + tv.hit + ' (' + tv.hitWhat + ')' : 'NOT FOUND'} -> inbox ${opened ? 'OPEN' : 'NOT OPEN'}`);
    if (v === 'hideout') { // check 1.7: the Loft HUD's own + and envelope
      await L.closeAll(pg); await sleep(300);
      const hud = await pg.ev('(function(){var h=document.querySelector(".lfhud");return h?h.innerHTML.replace(/<svg[\\s\\S]*?<\\/svg>/g,"<svg/>").slice(0,400):"NO HUD"})()');
      log('   Loft HUD: ' + hud);
      await pg.shot(OUT + '/inbox1_loft_hud.png', await L.clipOf(pg, '.lfhud', 10));
      const he = await L.vis(pg, '.lfhud .ibbtn');
      if (he) { await pg.tap(he.x, he.y); await sleep(800); }
      const ho = await pg.ev('!!document.querySelector("#layer .ibmodal")');
      await pg.shot(OUT + '/inbox1_loft_hud_env_tap.png');
      log(`   1.7 Loft HUD envelope: ${he ? he.x + ',' + he.y + ' ' + he.w + 'x' + he.h + ' hit=' + he.hit + ' (' + he.hitWhat + ')' : 'NOT FOUND'} -> inbox ${ho ? 'OPEN' : 'NOT OPEN'}`);
      await L.closeAll(pg); await sleep(300);
      const hp = await L.vis(pg, '.lfhud .kdbtn');
      if (hp) { await pg.tap(hp.x, hp.y); await sleep(1200); }
      const po = await L.modals(pg);
      await pg.shot(OUT + '/inbox1_loft_hud_plus_tap.png');
      log(`   1.7 Loft HUD +: ${hp ? hp.x + ',' + hp.y + ' hit=' + hp.hit + ' (' + hp.hitWhat + ') aria="' + hp.aria + '"' : 'NOT FOUND (kdOn() false?)'} -> ${po || 'no window'}`);
      const sp = await L.vis(pg, '.strip .kdbtn');
      log('   header + in the strip: ' + (sp ? 'present' : 'absent') + '; socOn=' + (await pg.ev('typeof window.__qbFriends') ) );
    }
  }
  log('6. page errors ' + pg.errs.length + (pg.errs.length ? ': ' + pg.errs.slice(0, 5).join(' | ') : ''));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
