// w-sale: the strip and its countdown in the Shop, a real Checkout buy of a sale piece (strip tap > try on > Buy > Checkout > confirm),
// the next day's price (app left open, and after a reload), and the rest of the 29 -> 30 overnight check (start days 9 to 13).
//   CHROME_PORT=9373 bash tools/windows/node.sh rigtest/qa/wsale_buy.js
const fs = require('fs');
const { browser, sleep, boot, E, dumpLS } = require('./wfocus_lib.js');
const OUT = 'C:/Users/clvh/qa-wt/out/wsale'; const LOG = OUT + '/buy.log'; fs.writeFileSync(LOG, '');
const log = (s) => { console.log(s); fs.appendFileSync(LOG, s + '\n'); };
let fails = 0; const chk = (name, ok, d) => { if (!ok) fails++; log(`  ${ok ? 'ok  ' : 'BAD '} ${name}${d ? ': ' + d : ''}`); };
const ymdAdd = (ymd, k) => new Date(Date.parse(ymd + 'T00:00:00Z') + k * 864e5).toISOString().slice(0, 10);
const TO = (ymd, h) => `(function(){var t=window.__qbDrops.start("${ymd}")+${h}*36e5;window.__qbShift=(window.__qbShift||0)+(t-Date.now());window.__qb.x().persist();return window.__qbDrops.ymd()})()`;
const clean = async (pg) => { for (let k = 0; k < 6; k++) { await pg.ev('(function(){document.querySelectorAll(".dropsplash .dsx,.bsplash .dsx").forEach(function(b){b.click()});document.querySelectorAll(".dropsplash,.bsplash").forEach(function(e){e.remove()});document.querySelectorAll("#layer .modal").forEach(function(m){m.remove()});return 1})()'); await sleep(300); } };
const tapSel = async (pg, sel) => { const r = await pg.ev(`(function(){var e=document.querySelector(${JSON.stringify(sel)});if(!e)return null;e.scrollIntoView({block:"center"});var b=e.getBoundingClientRect();return {x:b.x+b.width/2,y:b.y+b.height/2}})()`); if (!r) return false; await sleep(250); await pg.tap(r.x, r.y); return true; };
const item = (pg, id) => pg.ev(`(function(){var i=window.__qb.x().SHOP.filter(function(q){return q[0]==="${id}"})[0];return i&&{id:i[0],name:i[2],price:i[3],p0:i._p0==null?null:i._p0,pc:i._pc||null,owned:!!window.__qb.x().S.owned[i[0]]}})()`);
(async () => {
  const br = await browser();
  const D = '2026-11-13';
  let pg = await boot(br); await E(pg, '(W.lvl(12),W.add("bedroom"),W.add("closet"),W.X().S.coins=5000,W.X().persist(),1)');
  log('clock ' + await pg.ev(TO(D, 4))); await sleep(500);
  // reload on that day, so the Shop's prices are fresh from the load
  let ls = await pg.ev(dumpLS); await pg.close(); pg = await boot(br, { seed: ls }); await clean(pg);
  log('after reload clock ' + await pg.ev('window.__qbDrops.ymd()+" "+new Date().toString().slice(0,24)'));
  await tapSel(pg, '.nav button[data-v="shop"]'); await sleep(2500); await clean(pg);
  const strip = await pg.ev('(function(){var s=document.querySelector(".qs-sale");return s?s.innerText.replace(/\\s+/g," "):null})()');
  log('strip: ' + strip); const sale = await pg.ev('window.__qb.x().S.sale'); log('S.sale ' + JSON.stringify(sale));
  chk('strip shows with a countdown', !!strip && /next sale in/i.test(strip), strip);
  const cd = /next sale in ([^·|]+?)(?: -|\s[A-Z]|$)/i.exec(strip || ''); log('  countdown text: ' + (cd ? cd[1] : '?') + ' (expected about 20 h: noon Pacific to 8 am)');
  await pg.ev('(function(){var s=document.querySelector(".qs-sale");if(s)s.scrollIntoView({block:"start"});return 1})()'); await sleep(400);
  await pg.shot(OUT + '/strip_' + D + '.png');
  const [id1, pct1] = sale.ids[0], [id2] = sale.ids[1];
  const before = await item(pg, id1); log('piece 1 ' + JSON.stringify(before) + ', piece 2 ' + JSON.stringify(await item(pg, id2)));
  // tap the strip piece, then its card's try-on, Buy, Checkout, confirm
  chk('strip piece tap', await tapSel(pg, `[data-qssale="${id1}"]`)); await sleep(1500); await clean(pg);
  const card = await pg.ev(`(function(){var c=document.querySelector('[data-card="${id1}"]');return c?c.className+" | "+c.innerText.replace(/\\s+/g," ").slice(0,160):null})()`); log('card: ' + card);
  chk('card has the sale badge and the struck price', !!card && /qs-onsale/.test(card) && card.includes('-' + pct1 + '%'), card);
  await pg.shot(OUT + '/card_' + id1 + '.png');
  chk('try on', await tapSel(pg, `[data-card="${id1}"] [data-act=qstry]`)); await sleep(1500);
  const bar = await pg.ev('(function(){var b=document.querySelector("[data-act=qscheck]");return b?b.innerText.replace(/\\s+/g," ").trim():null})()'); log('buy bar: ' + bar);
  const c0 = await pg.ev('window.__qb.x().S.coins');
  chk('Buy', await tapSel(pg, '[data-act=qscheck]')); await sleep(1200);
  const ck = await pg.ev('(function(){var c=document.querySelector("#layer .qs-confirm");return c?c.innerText.replace(/\\s+/g," ").slice(0,240):null})()'); log('checkout: ' + ck);
  await pg.shot(OUT + '/checkout_' + id1 + '.png');
  chk('confirm', await tapSel(pg, '#layer [data-act=qsconfirm]')); await sleep(1800);
  const c1 = await pg.ev('window.__qb.x().S.coins'); const after = await item(pg, id1);
  log(`coins ${c0} -> ${c1}: paid ${c0 - c1}; sale price ${before.price}, full ${before.p0}; owned ${after.owned}`);
  chk('Checkout charges the sale price', c0 - c1 === before.price && after.owned, `paid ${c0 - c1}, sale ${before.price}, full ${before.p0}`);
  // next day, app left open
  log('clock ' + await pg.ev(TO(ymdAdd(D, 1), 4)));
  await tapSel(pg, '.nav button[data-v="board"]'); await sleep(800); await tapSel(pg, '.nav button[data-v="shop"]'); await sleep(2000); await clean(pg);
  const n1 = await item(pg, id1), n2 = await item(pg, id2); const s2 = await pg.ev('window.__qb.x().S.sale');
  log(`next day (open): ${JSON.stringify(n1)} ${JSON.stringify(n2)}; sale now ${s2.b} ${JSON.stringify(s2.ids)}; strip ${await pg.ev('(function(){var s=document.querySelector(".qs-sale");return s?s.innerText.replace(/\\s+/g," "):null})()')}`);
  chk('next day full price (app left open)', n1.price === before.p0 && n2.p0 === null && n2.price !== null && n1.p0 === null, `${id1} ${n1.price} (full ${before.p0}), ${id2} ${n2.price}`);
  ls = await pg.ev(dumpLS); log('errs ' + JSON.stringify(pg.errs)); fails += pg.errs.length; await pg.close();
  pg = await boot(br, { seed: ls }); await clean(pg); await tapSel(pg, '.nav button[data-v="shop"]'); await sleep(2000); await clean(pg);
  const r2 = await item(pg, id2); log(`next day (reload): ${JSON.stringify(r2)}`); chk('next day full price (after reload)', r2.p0 === null, JSON.stringify(r2));
  // the stale price when the same piece is on sale two days running (the one-brand days): day 11-10 then 11-11, app left open
  log('== same piece two days running, app open'); await pg.ev(TO('2026-11-10', 4)); await pg.ev('(window.__qb.x().S.sale=null,1)');
  await tapSel(pg, '.nav button[data-v="board"]'); await sleep(500); await tapSel(pg, '.nav button[data-v="shop"]'); await sleep(1500); await clean(pg);
  log('  11-10 ' + JSON.stringify(await pg.ev('window.__qb.x().S.sale')) + ' ' + JSON.stringify(await item(pg, 'gx_h_cardi')));
  await pg.ev(TO('2026-11-11', 4)); await tapSel(pg, '.nav button[data-v="board"]'); await sleep(500); await tapSel(pg, '.nav button[data-v="shop"]'); await sleep(1500); await clean(pg);
  const cardi = await item(pg, 'gx_h_cardi'); log('  11-11 ' + JSON.stringify(await pg.ev('window.__qb.x().S.sale')) + ' ' + JSON.stringify(cardi));
  log('  strip 11-11: ' + await pg.ev('(function(){var s=document.querySelector(".qs-sale");return s?s.innerText.replace(/\\s+/g," "):null})()'));
  await pg.ev('(function(){var s=document.querySelector(".qs-sale");if(s)s.scrollIntoView({block:"start"});return 1})()'); await sleep(300); await pg.shot(OUT + '/strip_2026-11-11_stale.png');
  log('errs ' + JSON.stringify(pg.errs)); fails += pg.errs.length; await pg.close();
  // the rest of the overnight 29 -> 30 check
  log('== level 29 -> 30 overnight, start days 9 to 13'); const T0 = '2026-11-10';
  for (let k = 9; k < 14; k++) { const p = await boot(br, { settle: 1500 }); await E(p, '(W.lvl(29),W.add("bedroom"),W.add("closet"),W.X().persist(),1)');
    await p.ev(TO(ymdAdd(T0, k), 4)); const a = (await p.ev('window.__qbSale.apply()')).b; await E(p, 'W.lvl(30)'); await p.ev(TO(ymdAdd(T0, k + 1), 4)); const b = (await p.ev('window.__qbSale.apply()')).b;
    log(`  ${ymdAdd(T0, k)} (29) ${a} -> ${ymdAdd(T0, k + 1)} (30) ${b}${a === b ? '  SAME BRAND TWO DAYS RUNNING' : ''}`); fails += p.errs.length; await p.close(); }
  log(fails ? 'FAILS ' + fails : 'ALL AS EXPECTED'); await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
