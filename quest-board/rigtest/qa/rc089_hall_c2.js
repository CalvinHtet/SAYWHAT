// rc-0.89 Hall QA part C2: W16 sender side at exactly 1h59m30s and 2h00m30s after the paid greeting.
const L = require('./rc089_hall_lib.js'), { say, sleep, OUT } = L;
(async () => {
  const { br, pg } = await L.boot();
  const SS = (e) => pg.ev(`(function(){var S=window.__qb.x().S;return ${e}})()`);
  const shiftTo = (T) => pg.ev(`(function(){window.__qbShift=0;window.__qbShift=${T}-Date.now();return new Date().toString()})()`);
  await L.hall(pg, 'style'); await sleep(2500);
  const looks = await pg.ev('(function(){var o=[];for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k.indexOf("qbsbx:worlds/sb_")==0)o.push(JSON.parse(localStorage.getItem(k)).look)}return o})()');
  await L.put(pg, 'worlds/u_g1', { name: 'Sydney', look: looks[0], lv: 22, streak: 2, rooms: [], earnedC: 5000, t: Date.now() });
  await sleep(2000);
  await L.closeModals(pg);
  if (!(await pg.ev('!!document.getElementById("sqbox")'))) await L.tapSel(pg, '[data-act=fshfold][data-k=square]');
  await pg.wait('!!document.querySelector(\'#sqbox .sq-p[data-u="u_g1"]\')', 20000);
  // greet from the card; the time of the greeting is read from the save (S.social.sqt.sent) or the pings doc
  const greet = async () => {
    await L.closeModals(pg); await sleep(2600);
    await L.tapSel(pg, '#sqbox .sq-p[data-u="u_g1"]'); await sleep(500);
    const c0 = await SS('S.coins'); await pg.ev('window.__qaPops.length=0');
    await L.tapSel(pg, '#layer .sq-card [data-act=sqgo][data-k=hug]'); await sleep(1500);
    const sentT = (await L.get(pg, 'pings/sandbox')).emo.u_g1.t;
    return { dCoins: (await SS('S.coins')) - c0, pops: await pg.ev('window.__qaPops.slice()'), at: new Date(sentT).toISOString(), paidAt: await SS('S.social.sqt.sent.u_g1||null') };
  };
  const g1 = await greet(); say('W16 first', g1);
  const paid = g1.paidAt;
  await shiftTo(paid + 2 * 36e5 - 40000); // the tap lands about 3-4 s later: 1h59m24s or so
  let g = await greet(); say('W16 at ' + ((Date.parse(g.at) - paid) / 60000).toFixed(2) + ' min after the paid one', g);
  await shiftTo(paid + 2 * 36e5 + 20000);
  g = await greet(); say('W16 at ' + ((Date.parse(g.at) - paid) / 60000).toFixed(2) + ' min after the paid one', g);
  say('page errors', pg.errs);
  L.save('c2_log.txt');
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); L.save('c2_log.txt'); process.exit(1); });
