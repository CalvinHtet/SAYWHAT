// rc-0.89 Hall QA part C: W16 greetings in the Town square: 3 coins each side, once per person per rolling 2 hours.
const L = require('./rc089_hall_lib.js'), { say, sleep, OUT } = L;
(async () => {
  const { br, pg } = await L.boot();
  const SS = (e) => pg.ev(`(function(){var S=window.__qb.x().S;return ${e}})()`);
  const shiftBy = (ms) => pg.ev(`(function(){window.__qbShift=(window.__qbShift||0)+${ms};return new Date().toString()})()`);
  await L.hall(pg, 'style'); await sleep(2500);
  const looks = await pg.ev('(function(){var o=[];for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k.indexOf("qbsbx:worlds/sb_")==0)o.push(JSON.parse(localStorage.getItem(k)).look)}return o})()');
  await L.put(pg, 'worlds/u_g1', { name: 'Sydney', look: looks[0], lv: 22, streak: 2, rooms: [], earnedC: 5000, t: Date.now() });
  await L.put(pg, 'worlds/u_g2', { name: 'Jordan', look: looks[1], lv: 18, streak: 1, rooms: [], earnedC: 3000, t: Date.now() });
  await sleep(2000);
  // open the Town square fold
  if (!(await pg.ev('!!document.getElementById("sqbox")'))) await L.tapSel(pg, '[data-act=fshfold][data-k=square]');
  await pg.wait('!!document.querySelector(\'#sqbox .sq-p[data-u="u_g1"]\')', 20000);
  await sleep(1500);
  const sqTop = await pg.ev('(function(){var b=document.getElementById("sqbox").getBoundingClientRect();return {x:0,y:b.top+scrollY,width:390,height:Math.min(700,b.height)}})()');
  await pg.shot(OUT + 'c_w16_square.png', sqTop);
  // greet: tap the person in the square, then Hug on their card; coins read just before the tap and 1.8 s after
  const greet = async (uid, k = 'hug') => {
    await L.closeModals(pg); await sleep(2600); // the game allows one greeting each 2.5 s
    await L.tapSel(pg, `#sqbox .sq-p[data-u="${uid}"]`); await sleep(600);
    const note = await pg.ev('(function(){var m=document.querySelector("#layer .sq-card .note");return m?m.innerText:null})()');
    const c0 = await SS('[S.coins,S.earnedC]');
    await pg.ev('window.__qaPops.length=0');
    await L.tapSel(pg, `#layer .sq-card [data-act=sqgo][data-k=${k}]`); await sleep(1800);
    const c1 = await SS('[S.coins,S.earnedC]');
    return { uid, clock: await pg.ev('new Date().toLocaleTimeString()'), cardNote: note, dCoins: c1[0] - c0[0], dEarned: c1[1] - c0[1], pops: await pg.ev('window.__qaPops.slice()'), sent: await SS('JSON.stringify(S.social.sqt&&S.social.sqt.sent)') };
  };
  say('W16 greet Sydney 1st', await greet('u_g1'));
  say('W16 greet Jordan right after', await greet('u_g2'));
  say('W16 greet Sydney again at once', await greet('u_g1'));
  say('W16 my pings doc', await L.get(pg, 'pings/sandbox'));
  const T0 = await pg.ev('Date.now()');
  say('shift +1h56m', await shiftBy(116 * 60000));
  say('W16 Sydney at ~1h58m after the paid one', await greet('u_g1'));
  say('shift +3m', await shiftBy(3 * 60000));
  say('W16 Sydney at ~2h01m after the paid one', await greet('u_g1'));
  // the other side: Sydney greets Cal (her phone writes her pings doc); Cal's phone pays itself 3
  const rx = async (from, name, k, t) => {
    const c0 = await SS('[S.coins,S.earnedC]'); await pg.ev('window.__qaPops.length=0');
    await L.put(pg, 'pings/' + from, { name, fromName: name, emo: { sandbox: { k, t } }, t });
    await sleep(4000);
    const c1 = await SS('[S.coins,S.earnedC]');
    return { from, dCoins: c1[0] - c0[0], dEarned: c1[1] - c0[1], pops: await pg.ev('window.__qaPops.slice()'), got: await SS('JSON.stringify(S.social.sqt.got)') };
  };
  let now = await pg.ev('Date.now()');
  say('W16 Sydney greets Cal', await rx('u_g1', 'Sydney', 'wave', now));
  say('W16 Jordan greets Cal', await rx('u_g2', 'Jordan', 'five', now + 1000));
  say('shift +1h', await shiftBy(60 * 60000)); now = await pg.ev('Date.now()');
  say('W16 Sydney greets Cal again 1h later', await rx('u_g1', 'Sydney', 'cheer', now));
  say('shift +61m', await shiftBy(61 * 60000)); now = await pg.ev('Date.now()');
  say('W16 Sydney greets Cal 2h01m after the paid one', await rx('u_g1', 'Sydney', 'hug', now));
  // from the Rank card too (the same greeting buttons)
  say('shift +2h05m', await shiftBy(125 * 60000));
  await L.closeModals(pg); await sleep(2600);
  await L.tapSel(pg, '#fshbox .fsh-row[data-u="u_g2"]'); await sleep(700);
  const c0 = await SS('S.coins'); await pg.ev('window.__qaPops.length=0');
  await L.tapSel(pg, '#layer .fsh-modal [data-act=sqgo][data-k=wave]'); await sleep(1800);
  say('W16 wave Jordan from the Rank card', { dCoins: (await SS('S.coins')) - c0, pops: await pg.ev('window.__qaPops.slice()') });
  await pg.ev('window.scrollTo(0,0)');
  say('page errors', pg.errs, 'killed pop-ups', await pg.ev('window.__qaKilled'));
  L.save('c_log.txt');
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); L.save('c_log.txt'); process.exit(1); });
