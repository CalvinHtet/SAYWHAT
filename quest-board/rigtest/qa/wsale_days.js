// w-sale: 21 game days (the clock moved with __qbShift to noon Pacific each drop day): one brand a day, from the open floors only,
// never the same two days running, 2 pieces at 25% or 50% off with the price on the item, yesterday's back to full. Then a level-29
// player over 70 days (never a Boutique brand), a level-30 player over 30 days, and a player who reaches 30 overnight.
//   CHROME_PORT=9373 bash tools/windows/node.sh rigtest/qa/wsale_days.js
const fs = require('fs');
const { browser, sleep, boot, E } = require('./wfocus_lib.js');
const OUT = process.env.OUT || require('os').tmpdir() + '/qa-out/wsale'; fs.mkdirSync(OUT, { recursive: true }); const LOG = OUT + '/days.log'; fs.writeFileSync(LOG, '');
const log = (s) => { console.log(s); fs.appendFileSync(LOG, s + '\n'); };
let fails = 0; const bad = (s) => { fails++; log('  BAD ' + s); };
const ymdAdd = (ymd, k) => new Date(Date.parse(ymd + 'T00:00:00Z') + k * 864e5).toISOString().slice(0, 10);
// move the game clock to noon Pacific (4 h after the 8 am drop) on drop day ymd, and read the day's sale
const DAY = (ymd) => `(function(){var t=window.__qbDrops.start("${ymd}")+4*36e5;window.__qbShift=(window.__qbShift||0)+(t-Date.now());
  var x=window.__qb.x(),s=window.__qbSale.apply(),d=window.__qbDrops.state(),live=d.live.map(function(b){return b.id+":"+(b.fl||"?")+(b.back?":back":"")});
  var it=(s&&s.ids||[]).map(function(p){var i=x.SHOP.filter(function(q){return q[0]===p[0]})[0];return {id:p[0],pct:p[1],price:i&&i[3],p0:i&&i._p0,b:i&&i[6]&&i[6].b,slot:i&&i[1]}});
  var onSale=x.SHOP.filter(function(q){return q._p0!=null}).map(function(q){return q[0]});
  return {now:window.__qbDrops.ymd(),sale:s&&{d:s.d,b:s.b},items:it,onSale:onSale,live:live,floors:d.open,brands:window.__qbSale.brands(s&&s.d)}})()`;
async function runDays(pg, lbl, start, n, opts = {}) {
  let prev = null, seen = {}, full = {};
  const base = await pg.ev('(function(){var o={};window.__qb.x().SHOP.forEach(function(q){o[q[0]]=q._p0!=null?q._p0:q[3]});return o})()');
  for (let k = 0; k < n; k++) {
    const ymd = ymdAdd(start, k);
    if (opts.lvlOn && opts.lvlOn[k] != null) await E(pg, `W.lvl(${opts.lvlOn[k]})`);
    const r = await pg.ev(DAY(ymd));
    const b = r.sale && r.sale.b; seen[b] = (seen[b] || 0) + 1;
    const line = `${lbl} ${r.now} [floors ${r.floors.join('/')}] sale ${b}: ${r.items.map((i) => `${i.id} ${i.slot} -${i.pct}% ${i.p0}->${i.price}`).join(', ')} | shop live ${r.live.join(' ')}`;
    if (!opts.quiet) log('  ' + line);
    if (r.now !== ymd) bad(`clock on ${r.now}, wanted ${ymd}`);
    if (!b) { bad('no sale brand ' + line); prev = b; continue; }
    if (!r.live.some((x) => x.split(':')[0] === b)) bad(`brand ${b} not in the Shop's open floors: ${line}`);
    if (b === prev) bad(`same brand two days running: ${prev} -> ${b} (${line})`);
    if (r.items.length !== 2) bad(`${r.items.length} pieces: ${line}`);
    r.items.forEach((i) => { if (![25, 50].includes(i.pct)) bad('pct ' + i.pct); if (i.b !== b) bad('piece of another brand ' + i.id);
      const want = Math.max(10, Math.round(i.p0 * (1 - i.pct / 100) / 10) * 10); if (i.price !== want || i.p0 !== base[i.id]) bad(`price ${i.id}: ${i.p0}->${i.price}, want ${base[i.id]}->${want}`); });
    // nothing else is marked down, and every other piece is at its full price
    const others = await pg.ev(`(function(){var on=${JSON.stringify(r.items.map((i) => i.id))},base=${JSON.stringify(base)},o=[];window.__qb.x().SHOP.forEach(function(q){if(on.indexOf(q[0])<0&&base[q[0]]!==q[3])o.push(q[0]+" "+base[q[0]]+"->"+q[3])});return o})()`);
    if (others.length) bad('other prices changed: ' + others.slice(0, 5).join(', '));
    if (r.onSale.length !== r.items.length) bad('marked items ' + r.onSale.join(','));
    if (opts.noFloor && r.live.some((x) => x.split(':')[0] === b && x.split(':')[1] === opts.noFloor)) bad(`a ${opts.noFloor} brand on sale: ${b}`);
    if (opts.noFloor && r.floors.includes(opts.noFloor)) bad(`${opts.noFloor} open at this level`);
    prev = b;
  }
  log(`  ${lbl}: brands on sale over ${n} days: ${JSON.stringify(seen)}`);
  return seen;
}
(async () => {
  const br = await browser();
  const today = new Date(Date.now() - 15 * 36e5).toISOString().slice(0, 10); // a safe "today" in Pacific terms
  // a level-12 player with the Closet (the Shop)
  { const pg = await boot(br); await E(pg, '(W.lvl(12),W.add("bedroom"),W.add("closet"),W.X().persist(),1)'); await sleep(500);
    log('== level 12, 21 days from ' + today); await runDays(pg, 'L12', today, 21);
    log('  errs ' + JSON.stringify(pg.errs)); fails += pg.errs.length; await pg.close(); }
  { const pg = await boot(br); await E(pg, '(W.lvl(29),W.add("bedroom"),W.add("closet"),W.X().persist(),1)'); await sleep(500);
    log('== level 29, 70 days'); log('  boutique brands: ' + JSON.stringify(await pg.ev('window.__qbDrops.floor("boutique").live.map(function(b){return b.id})')));
    const seen = await runDays(pg, 'L29', today, 70, { quiet: true, noFloor: 'boutique' });
    ['rose', 'nc', 'sm', 'cr'].forEach((b) => { if (seen[b]) bad('boutique brand ' + b + ' on sale for a level-29 player'); });
    log('  errs ' + JSON.stringify(pg.errs)); fails += pg.errs.length; await pg.close(); }
  { const pg = await boot(br); await E(pg, '(W.lvl(30),W.add("bedroom"),W.add("closet"),W.X().persist(),1)'); await sleep(500);
    log('== level 30, 30 days'); await runDays(pg, 'L30', today, 30, { quiet: true });
    log('  errs ' + JSON.stringify(pg.errs)); fails += pg.errs.length; await pg.close(); }
  // reaching 30 overnight: day k at 29, day k+1 at 30 (fresh player each time): the same brand twice?
  { log('== level 29 -> 30 overnight, 14 start days'); let rep = 0;
    for (let k = 0; k < 14; k++) { const pg = await boot(br, { settle: 1500 }); await E(pg, '(W.lvl(29),W.add("bedroom"),W.add("closet"),W.X().persist(),1)');
      const a = await pg.ev(DAY(ymdAdd(today, k))); await E(pg, 'W.lvl(30)'); const b = await pg.ev(DAY(ymdAdd(today, k + 1)));
      const same = a.sale.b === b.sale.b; if (same) rep++;
      log(`  ${a.now} (29) ${a.sale.b} -> ${b.now} (30) ${b.sale.b}${same ? '  SAME BRAND TWO DAYS RUNNING' : ''}`); await pg.close(); }
    if (rep) bad(rep + ' repeats when the Boutique opens overnight'); }
  log(fails ? 'FAILS ' + fails : 'ALL AS EXPECTED'); await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
