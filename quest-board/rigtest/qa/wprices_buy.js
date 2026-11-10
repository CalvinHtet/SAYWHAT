// w-prices 717acf2: the real buy path charges the new price. Shop > try a piece on > Buy > Checkout > confirm, with the card's price,
// the Checkout total and the coins before and after; then with too few coins, what the Buy and Checkout say ("need X more").
//   BASE=http://127.0.0.1:8821 bash tools/windows/node.sh rigtest/qa/wprices_buy.js
const { browser } = require('./cdp.js');
process.env.BASE = process.env.BASE || 'http://127.0.0.1:8821';
process.env.OUT = process.env.OUT || 'C:/Users/clvh/qa-wt/out/rc090/prices';
const L = require('./rc090_inbox_lib.js');
const { OUT, sleep } = L;
(async () => {
  const br = await browser();
  for (const coins of [999999, 50]) {
    const pg = await L.boot(br, { settle: 1500 });
    for (let k = 0; k < 8; k++) { await pg.ev('(function(){document.querySelectorAll(".dropsplash .dsx").forEach(function(b){b.click()});return 1})()'); await L.closeAll(pg); await sleep(350); }
    await pg.ev(`(function(){var x=window.__qb.x();x.S.coins=${coins};x.persist();x.render();return 1})()`); await sleep(500);
    await L.tapSel(pg, '.nav button[data-v="shop"]'); await sleep(2500);
    for (let k = 0; k < 4; k++) { await pg.ev('(function(){document.querySelectorAll(".dropsplash .dsx").forEach(function(b){b.click()});return 1})()'); await L.closeAll(pg); await sleep(300); }
    const tried = await pg.ev(`(function(){var b=[].filter.call(document.querySelectorAll('[data-act=qstry]'),function(b){var r=b.getBoundingClientRect();return r.width>0})[0];if(!b)return null;var card=b.closest('[data-card]');var id=card&&card.dataset.card;
      var it=window.__qb.x().SHOP.filter(function(s){return s[0]===id})[0];b.scrollIntoView({block:'center'});b.click();return {id:id,name:it&&it[2],price:it&&it[3],card:card?card.innerText.replace(/\\s+/g,' ').slice(0,90):''}})()`);
    await sleep(1500);
    const bar = await pg.ev('(function(){var b=document.querySelector("[data-act=qscheck]");return b?b.innerText.replace(/\\s+/g," ").trim():"no Buy button"})()');
    const c0 = await L.coins(pg);
    const bk = await L.tapSel(pg, '[data-act=qscheck]'); await sleep(1200);
    const ck = await pg.ev('(function(){var c=document.querySelector("#layer .qs-confirm");return c?c.innerText.replace(/\\s+/g," ").slice(0,220):null})()');
    await pg.shot(`${OUT}/checkout_${coins}.png`);
    const cf = await L.tapSel(pg, '#layer [data-act=qsconfirm]'); await sleep(1800);
    const c1 = await L.coins(pg); const owned = await pg.ev(`!!window.__qb.x().S.owned[${JSON.stringify(tried && tried.id)}]`);
    console.log(`coins ${coins}: tried ${JSON.stringify(tried)}; buy bar "${bar}"; checkout "${ck}"; confirm ${cf ? 'tapped' : 'no button'}; coins ${c0} -> ${c1} (paid ${c0 - c1}); owned ${owned}`);
    console.log('  page errors ' + pg.errs.length);
    await pg.close();
  }
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
