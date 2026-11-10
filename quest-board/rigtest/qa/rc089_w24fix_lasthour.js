// w-rank 38b3196 fix check: in the last hour of the Fashion week the Rank text reads minutes ("in 45 min"), not "in 0h".
const L = require('./rc089_hall_lib.js'), { sleep } = L;
const PST = (y, mo, d, h, mi = 0) => Date.UTC(y, mo - 1, d, h + 8, mi);
(async () => {
  const { br, pg } = await L.boot();
  for (const [label, t] of [['Sun 11-15 18:15 PT', PST(2026, 11, 15, 18, 15)], ['Sun 11-15 18:59 PT', PST(2026, 11, 15, 18, 59)], ['Fri 11-13 14:30 PT', PST(2026, 11, 13, 14, 30)]]) {
    await L.shift(pg, t - Date.now()); await pg.ev('(function(){var x=window.__qb.x();x.render();return 1})()'); await sleep(600);
    await L.hall(pg, 'style'); await sleep(800);
    const txt = await pg.ev('(function(){var m=(document.body.innerText.match(/Ends Sunday[^.]*/)||[""])[0];return m})()');
    console.log(label + ': ' + txt);
  }
  console.log('page errors ' + pg.errs.length); await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
