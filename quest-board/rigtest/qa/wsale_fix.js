// w-sale fixes 258f92d, through the hooks: (1) a piece that stays on sale with a new discount is priced again with the app open
// (50% then 25% then off sale); (2) salePick never returns the brand passed as yesterday's (60 days, levels 29 and 30).
//   BASE=http://127.0.0.1:8818 CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/wsale_fix.js
const fs = require('fs');
const SEEDS = require('path').join(__dirname, 'seeds') + '/'; // saves in rigtest/qa/seeds (v0.88, v0.89, v0.90; test names only)
const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8818';
const SEED = JSON.parse(fs.readFileSync(SEEDS + 'v88_adv.json', 'utf8'));
(async () => {
  const br = await browser(); const pg = await br.page({ fresh: true });
  await pg.go(BASE + '/version.json'); await pg.ev(`(function(d){Object.keys(d).forEach(function(k){localStorage.setItem(k,d[k])});return 1})(${JSON.stringify(SEED)})`);
  await pg.go(BASE + '/'); await pg.wait('!!(window.__qb && window.__qbSale && document.querySelector(".nav button[data-v=board]"))', 120000); await sleep(3000);
  const r = await pg.ev(`(function(){var x=window.__qb.x(),S=x.S,Q=window.__qbSale,s=Q.apply(),out={today:s};
    var it=x.SHOP.filter(function(i){return i[6]&&i[6].b&&/^a_/.test(i[1])&&+i[3]>0})[0],full=it[3],id=it[0],pr=function(){return [it[3],it._p0,it._pc]};
    S.sale={d:s.d,b:it[6].b,ids:[[id,50]]};Q.apply();out.p50=pr();S.sale.ids=[[id,25]];Q.apply();out.p25=pr();S.sale.ids=[];Q.apply();out.off=pr();
    out.full=full;out.want=[Math.max(10,Math.round(full*.5/10)*10),Math.max(10,Math.round(full*.75/10)*10)];
    var bad=[],n=0,none=0,ymdOf=function(t){var d=new Date(t);return d.toISOString().slice(0,10)};
    for(var k=0;k<60;k++){var ymd=ymdOf(Date.UTC(2026,10,10+k,20));var b=Q.brandOn(ymd);var p=Q.pick(ymd,b);n++;if(!p.b)none++;else if(p.b===b)bad.push(ymd+' '+b);
      var p0=Q.pick(ymd,null);if(p0.b!==b)bad.push(ymd+' pick(no yesterday) '+p0.b+' vs brandOn '+b)}
    out.pick={days:n,noSaleWhenYesterdayWasTheOnlyBrand:none,bad:bad};return out})()`);
  console.log(JSON.stringify(r, null, 1)); console.log('page errors', pg.errs.length, pg.errs.slice(0, 2));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
