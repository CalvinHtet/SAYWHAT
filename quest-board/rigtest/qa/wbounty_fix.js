// w-bounty findings (QA 2026-11-10 21:15): (1) the old daily "x2" quest (30_app_b.js bountyId) must not stack on a taken bounty: a
// fresh level-10 player takes both bounties every day for 20 days; each taken bounty's tags must hold ONE "Bounty" tag, with no "x2"
// chip on its card. (2) The 2-day card's "N days left" across its window (day 1 06:00/12:00/23:00, day 2 03:00/12:00/23:00, Pacific):
// 2 on day 1, the last day on day 2 (game days start at 5 am).
//   BASE=<build> CHROME_PORT=9375 bash tools/windows/node.sh rigtest/qa/wbounty_fix.js
const { browser, boot, E } = require('./wfocus_lib.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8814';
const PT = (ymd, h = 12) => Date.parse(ymd + 'T00:00:00Z') + (h + 8) * 36e5;
const at = (t) => `var real=Date.now()-(window.__qbShift||0);window.__qbShift=${t}-real;window.__qb.x().render();`;
(async () => {
  const br = await browser(); const pg = await boot(br, { base: BASE }); await E(pg, 'W.closeAll()'); await E(pg, 'W.lvl(10)');
  let stacked = 0;
  for (let i = 0; i < 20; i++) {
    const d = new Date(Date.parse('2026-11-16T12:00:00Z') + i * 864e5).toISOString().slice(0, 10);
    const r = await pg.ev(`(async function(){var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})},x=window.__qb.x(),S=x.S;${at(PT(d))}await w(200);
      for(var k of [1,2]){var b=document.querySelector('[data-act=btytake][data-k="'+k+'"]');if(b){b.click();await w(300)}}
      return S.quests.filter(function(q){return q.bty&&typeof q.bty==="object"&&!S.done[q.id]}).map(function(q){var m=x.mults(q,{}),el=document.querySelector('#app [data-id="'+q.id+'"] .chip.mult');
        return {k:q.bty.k,xp:q.xp,tags:m.tags.filter(function(t){return /Bounty/.test(t)}).join('|'),m:+m.m.toFixed(2),cm:m.cm,chip:el?el.innerText:null}})})()`);
    const bad = r.filter((q) => q.tags.split('|').length !== 1 || q.chip); if (bad.length) stacked++;
    console.log(`${bad.length ? 'BAD' : 'ok '} ${d}`, JSON.stringify(r));
  }
  console.log(`(1) days with two bounty bonuses on one quest: ${stacked} of 20`);
  for (const [d, h] of [['2026-11-17', 6], ['2026-11-17', 12], ['2026-11-17', 23], ['2026-11-18', 3], ['2026-11-18', 12], ['2026-11-18', 23], ['2026-11-19', 6]]) {
    const c = await pg.ev(`(function(){${at(PT(d, h))}return {end:window.__qbBounty.end(2),card:[].map.call(document.querySelectorAll('.bty-card .label'),function(l){return l.innerText})[1]}})()`);
    console.log(`(2) ${d} ${String(h).padStart(2, '0')}:00 Pacific: 2-day ends ${c.end} | "${c.card}"`);
  }
  console.log('page errors', pg.errs.length, pg.errs.slice(0, 2)); await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
