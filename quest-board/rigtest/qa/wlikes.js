// bd23390 (Cal: 2 likes a day in TOTAL): like Sydney and Jordan once each -> a like to Alex says "That's your 2 likes for today";
// taking one back frees one (Alex can then be liked); the note reads "You have 2 likes to give each day". Four neighbours as in
// rc089_hall_b.js (sandbox world docs), real taps on the Rank tab's rows and the card's buttons.
//   BASE=<build> OUT=<dir/> CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/wlikes.js
const L = require('./rc089_hall_lib.js'), { say, sleep } = L;
(async () => {
  const { br, pg } = await L.boot();
  const cardState = () => pg.ev(`(function(){var m=document.querySelector("#layer .modal.fsh-modal");if(!m)return null;var lb=m.querySelector("[data-act=fshlike]");
    return {u:m.getAttribute("data-u"),like:lb?{t:lb.innerText.replace(/\\s+/g," "),dis:lb.disabled}:null,back:!!m.querySelector("[data-act=fshunlike]"),note:((m.querySelector(".fsh-likebox .note")||{}).innerText||"")}})()`);
  const card = async (uid) => { await L.closeModals(pg); await L.tapSel(pg, `#fshbox .fsh-row[data-u="${uid}"]`); await sleep(700); return cardState(); };
  const tapLike = async () => { await pg.ev('(function(){var b=document.querySelector(".fsh-modal [data-act=fshlike]");if(b&&b.disabled){b.disabled=false;b.click();return "was disabled, clicked anyway"}b&&b.click();return 1})()'); await sleep(800); return cardState(); };
  const tapBack = async () => { await L.tapSel(pg, '.fsh-modal [data-act=fshunlike]'); await sleep(800); return cardState(); };
  const pops = () => pg.ev('window.__qaPops.splice(0)');
  await L.hall(pg, 'style'); await sleep(2500);
  const looks = await pg.ev('(function(){var o=[];for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k.indexOf("qbsbx:worlds/sb_")==0)o.push(JSON.parse(localStorage.getItem(k)).look)}return o})()');
  const P = [['u_syd', 'Sydney'], ['u_jor', 'Jordan'], ['u_alx', 'Alex'], ['u_mor', 'Morgan']];
  for (const [i, [id, name]] of P.entries()) await L.put(pg, 'worlds/' + id, { name, look: looks[i % looks.length], lv: 20 + i, streak: 3, rooms: [], earnedC: 1000 * (i + 1), t: Date.now() });
  await pg.wait('!!document.querySelector(\'#fshbox .fsh-row[data-u="u_syd"]\')', 20000);
  say('Sydney card', await card('u_syd')); say('like Sydney', await tapLike(), await pops());
  say('Jordan card', await card('u_jor')); say('like Jordan', await tapLike(), await pops());
  say('Alex card (2 used)', await card('u_alx')); say('like Alex (3rd)', await tapLike(), await pops());
  say('likes doc', await L.get(pg, 'likes/sandbox'));
  say('Jordan card', await card('u_jor')); say('take back Jordan', await tapBack(), await pops());
  say('Alex card', await card('u_alx')); say('like Alex now', await tapLike(), await pops());
  say('Morgan card (2 used again)', await card('u_mor'));
  say('likes doc', await L.get(pg, 'likes/sandbox'));
  say('page errors', pg.errs.length, pg.errs.slice(0, 2));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
