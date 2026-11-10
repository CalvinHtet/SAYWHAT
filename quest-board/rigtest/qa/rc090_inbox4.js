// rc-0.90 inbox check 5 (the header's coin row fits on one line at 360 px, with big totals too) and check 4 (the Wheel's unlock
// line, on the level-up "New area" card and the Wheel's own description, mentions the clothing slivers; and what a locked Wheel
// says to a new player). OUT: inbox7_*.png
//   CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/rc090_inbox4.js
const { browser } = require('./cdp.js');
const L = require('./rc090_inbox_lib.js');
const { OUT, sleep } = L;
const log = (s) => console.log(s);
const rowOf = (pg, sel) => pg.ev(`(function(){var r=document.querySelector("${sel}");if(!r)return null;var ks=[].filter.call(r.children,function(k){return k.getBoundingClientRect().width>0});
  var tops=ks.map(function(k){return Math.round(k.getBoundingClientRect().top)}),bots=ks.map(function(k){return Math.round(k.getBoundingClientRect().bottom)}),rr=r.getBoundingClientRect();
  return {items:ks.map(function(k){return (k.className||k.tagName).toString().split(" ")[0]+"="+(k.innerText||"").trim().replace(/\\s+/g," ").slice(0,14)}).join(" | "),tops:tops.join("/"),oneLine:Math.max.apply(0,tops)<Math.min.apply(0,bots),right:Math.round(rr.right),docW:document.documentElement.scrollWidth,vw:innerWidth}})()`);
(async () => {
  const br = await browser();
  // ---- check 5 at 360 px
  const pg = await L.boot(br, { width: 360, height: 780, settle: 1500 });
  for (let k = 0; k < 10; k++) { await L.closeAll(pg); await sleep(400); }
  for (const [c, name] of [[null, 'seed'], [9999999, '7digits'], [123456789, '9digits']]) {
    if (c) { await L.S(pg, `(S.coins=${c}, x.persist(), x.render(), 1)`); await sleep(800); await L.closeAll(pg); }
    await pg.ev('window.scrollTo(0,0);1');
    const r = await rowOf(pg, '.strip .right');
    log(`5. Board header at 360, coins ${await L.coins(pg)}: ${JSON.stringify(r)}`);
    await pg.shot(OUT + `/inbox7_header360_${name}.png`, await L.clipOf(pg, '.strip', 4));
  }
  // the same header on the other screens, and the Shop's own header line
  for (const v of ['train', 'hall', 'trophy', 'wheel', 'away', 'shop', 'hideout']) {
    await L.tapSel(pg, `.nav button[data-v="${v}"]`); await sleep(1800); await L.closeAll(pg); await pg.ev('window.scrollTo(0,0);1');
    const r = v === 'shop' ? await rowOf(pg, '.qs-cbar') : v === 'hideout' ? await rowOf(pg, '.lfhud') : await rowOf(pg, '.strip .right');
    const shopTop = v === 'shop' ? await pg.ev('(function(){var c=document.querySelector(".qs-cbar"),h=document.querySelector(".qs-top");var a=c.getBoundingClientRect(),b=h.getBoundingClientRect();return "cbar "+Math.round(a.left)+"-"+Math.round(a.right)+" in header "+Math.round(b.left)+"-"+Math.round(b.right)})()') : '';
    log(`5. ${v} at 360 (coins ${await L.coins(pg)}): ${JSON.stringify(r)} ${shopTop}`);
    if (v === 'shop') await pg.shot(OUT + '/inbox7_shop360.png', await L.clipOf(pg, '.qs-top', 4));
    if (v === 'hideout') await pg.shot(OUT + '/inbox7_loft360.png', await L.clipOf(pg, '.lfhud', 10));
  }
  log('6. page errors (360) ' + pg.errs.length + (pg.errs.length ? ': ' + pg.errs.slice(0, 5).join(' | ') : ''));
  // ---- check 4: the Wheel's own description, then the level-up card that opens it
  await L.tapSel(pg, '.nav button[data-v="wheel"]'); await sleep(1800); await L.closeAll(pg);
  log('4. Wheel page description: ' + (await pg.ev('(function(){var p=[].filter.call(document.querySelectorAll("#app .note"),function(n){return /spin/i.test(n.textContent)})[0];return p?p.textContent:"none"})()')));
  await L.tapSel(pg, '.nav button[data-v="board"]'); await sleep(1500); await L.closeAll(pg);
  await L.S(pg, '(delete S.areaOn.wheel, S.unlockDay="", S.areaDay=S.letters.at.welcome, x.persist(), x.render(), 1)');
  log('   wheel waiting: ' + (await pg.ev('window.__qbUnlock.waiting("wheel")')) + '; S.areaDay ' + (await L.S(pg, 'S.areaDay')));
  await pg.ev('(function(){var b=document.createElement("button");b.dataset.act="simlvl";document.body.appendChild(b);b.click();b.remove();return 1})()'); await sleep(3500);
  const card = await pg.ev('[].map.call(document.querySelectorAll("#layer .unl"),function(u){return u.innerText.replace(/\\s+/g," ").trim()}).join(" || ")');
  log('4. level-up cards: ' + (card || 'NONE; windows: ' + (await L.modals(pg))));
  await pg.shot(OUT + '/inbox7_wheel_unlock_card.png');
  await pg.close();
  // ---- a new player: what the locked Wheel says
  const p2 = await L.boot(br, { seed: false, settle: 2000 });
  await p2.ev(`(function(){var x=window.__qb.x(),S=x.S;S.created=true;S.char=window.__qb.fixChar({name:'Newbie',sex:'f'});x.persist();x.render();return 1})()`); await sleep(2000);
  for (let k = 0; k < 6; k++) { await L.closeAll(p2); await sleep(400); }
  const wl = await L.vis(p2, '.nav button[data-v="wheel"]');
  await p2.tap(wl.x, wl.y); await sleep(500);
  log(`4. new player (Lv ${await L.S(p2, 'x.effLvl()')}): Wheel nav aria "${wl.aria}" text "${wl.txt.replace(/\s+/g, ' ')}"; tap says: ${await p2.ev('[].map.call(document.querySelectorAll(".pop"),function(p){return p.textContent}).join(" / ")||"nothing"')}`);
  await p2.shot(OUT + '/inbox7_newplayer_wheel_locked.png');
  log('6. page errors (new player) ' + p2.errs.length + (p2.errs.length ? ': ' + p2.errs.slice(0, 5).join(' | ') : '') + '; (seed 360 page) ' + pg.errs.length);
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
