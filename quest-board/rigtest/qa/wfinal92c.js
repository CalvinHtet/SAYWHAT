// rc-v0.92c w-final behaviour (LEAD 07:24 / 07:38): B the Town Boss 5-player rule only before the first boss ever (this save's
// S.boss.first, or a neighbor's doc bf); after it a boss every week, HP 800 x max(2, active). G greetings pay the GIVER 3 coins, once
// per person every 2 hours, flat at any level; the person greeted gets none. S streak text "Streak: N days" / "Streak: 1 day".
//   BASE=<sandbox build> CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/wfinal92c.js
const { browser, sleep, boot, E } = require('./wfocus_lib.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8822';
const P = []; const ok = (c, s) => { console.log((c ? 'ok   ' : 'BAD  ') + s); if (!c) P.push(s); };
const PT = (ymd, h = 12) => Date.parse(ymd + 'T00:00:00Z') + (h + 8) * 36e5;   // November 2026: Pacific = UTC-8
const at = (ymd, h) => `(function(){var real=Date.now()-(window.__qbShift||0);window.__qbShift=${PT(ymd, h)}-real;window.__qb.x().render();return 1})()`;
const LASTWK = ['2026-11-10', '2026-11-11', '2026-11-12'];
const fake = (p, L) => p.ev(`(function(){var f=window.__qbBoss.fake(${JSON.stringify(L)});return f?{hp:f.hp,act:f.act,wk:f.wk}:null})()`);
const others = (n, bf) => ['a', 'b', 'c', 'd', 'e'].slice(0, n).map((id, i) => Object.assign({ id: 'u_' + id, name: 'P' + i, pd: LASTWK, bw: '', bd: 0 }, bf && i === 0 ? { bf } : {}));
(async () => {
  const br = await browser();
  // B. the boss gate
  let pg = await boot(br, { base: BASE }); await E(pg, 'W.closeAll()'); await E(pg, 'W.lvl(10)');
  await pg.ev(at('2026-11-16', 12)); await pg.ev(`(function(){var B=window.__qbBoss.state();B.pd=${JSON.stringify(LASTWK)};delete B.first;window.__qb.x().persist();return 1})()`);
  let b = await fake(pg, others(3)); ok(b === null, `B1. no boss yet ever, 3 others + me active (4 < 5): none ${JSON.stringify(b)}`);
  b = await fake(pg, others(3, '2026-11-23')); ok(b === null, `B2. a neighbor's first boss is in a later week (bf 11-23): still none ${JSON.stringify(b)}`);
  b = await fake(pg, others(3, '2026-11-09')); ok(b && b.hp === 800 * 4 && b.act === 4, `B3. a neighbor already had a first boss (bf 11-09): a boss with 4 active, HP ${b && b.hp} (800 x 4)`);
  b = await fake(pg, others(4)); await pg.ev('(function(){window.__qbBoss.keep();return 1})()');
  const first = await pg.ev('window.__qbBoss.state().first||null');
  ok(b && b.hp === 4000 && first === '2026-11-16', `B4. 5 active, no first yet: a boss (HP ${b && b.hp}); keeping it marks this save's first boss: ${first}`);
  await pg.ev(at('2026-11-23', 12)); await pg.ev(`(function(){var B=window.__qbBoss.state();B.pd=['2026-11-17','2026-11-18','2026-11-19'];window.__qb.x().persist();return 1})()`);
  b = await fake(pg, []); ok(b && b.hp === 1600 && b.act === 1, `B5. the next week, only me active: still a boss, HP ${b && b.hp} (800 x 2 at the least)`);
  b = await fake(pg, others(2).map((o) => Object.assign(o, { pd: ['2026-11-17', '2026-11-18', '2026-11-19'] }))); ok(b && b.hp === 2400, `B5. 2 others + me: HP ${b && b.hp} (800 x 3)`);
  const doc = await pg.ev(`(function(){var k=Object.keys(localStorage).filter(function(k){return /^qbsbx:worlds\\//.test(k)&&!/sb_|u_/.test(k)})[0];if(!k)return null;var d=JSON.parse(localStorage.getItem(k));if(d.j)d=JSON.parse(d.j);return d.bf})()`);
  console.log('   my world doc bf:', JSON.stringify(doc), '(published on the next world write)');
  await pg.close();
  // G. greetings: the giver gets 3, once per person every 2 hours; the greeted none; flat at any level
  pg = await boot(br, { base: BASE }); await E(pg, 'W.closeAll()'); await E(pg, 'W.lvl(80)');
  await pg.ev('(function(){if(window.__qbVisit)window.__qbVisit.check();return 1})()'); await sleep(3000);
  const greet = async (uid, k) => pg.ev(`(async function(){var w=function(ms){return new Promise(function(r){setTimeout(r,ms)})};var S=window.__qb.x().S,c=S.coins;document.querySelectorAll('#layer .modal').forEach(function(m){m.remove()});
    var b=document.querySelector('.nav button[data-v=hall]');b&&b.click();await w(1000);var t=document.querySelector('[data-act=htab][data-t="style"]');if(t)t.click();await w(900);[].forEach.call(document.querySelectorAll('[data-act=fshfold]'),function(b){if(b.getAttribute('aria-expanded')!=='true')b.click()});await w(900);
    var who=[].filter.call(document.querySelectorAll('#sqbox button,#sqbox [data-u]'),function(e){return (e.dataset.u||'')==='${uid}'||new RegExp('${uid.replace('sb_', '')}','i').test(e.innerText)})[0];if(!who)return {nobody:true};who.click();await w(700);
    var card=document.querySelector('#layer .sq-card');var note=card?(card.querySelector('p.note')||{}).innerText:null,mono=card?(card.querySelector('small.mono')||{}).innerText:null;
    var g=card&&[].filter.call(card.querySelectorAll('button'),function(x){return /${k}/i.test(x.innerText)})[0];if(!g)return {note:note,nobutton:true};g.click();await w(1500);
    return {note:note,mono:mono,got:S.coins-c,pop:[].map.call(document.querySelectorAll('#layer .pop'),function(p){return p.innerText}).slice(-1)[0]}})()`);
  await pg.ev(at('2026-11-16', 10));
  const g1 = await greet('sb_justin', 'wave');
  ok(g1.got === 3 && /Greeting someone pays you 3 coins, once every 2 hours for each person\./.test(g1.note || '') && /\+3 coins/.test(g1.pop || ''), `G1. level 80, wave at Justin: +${g1.got} "${g1.pop}" | card: "${g1.note}"`);
  await sleep(2700); const g2 = await greet('sb_justin', 'poke');
  ok(g2.got === 0 && /You earned 3 coins for greeting Justin at .*pays again from/.test(g2.note || ''), `G2. Justin again within 2 h: +${g2.got} | card: "${g2.note}"`);
  await sleep(2700); const g3 = await greet('sb_vega', 'five'); ok(g3.got === 3, `G3. Vega (someone else) at once: +${g3.got}`);
  await pg.ev(at('2026-11-16', 12)); await sleep(2700); const g4 = await greet('sb_justin', 'wave'); ok(g4.got === 3, `G4. Justin 2 hours later: +${g4.got}`);
  // greeted by Justin: his pings doc names me
  const me = await pg.ev('(window.__qbSide&&window.__qbSide.me())||"sandbox"');
  const c0 = await pg.ev('window.__qb.x().S.coins');
  await pg.ev(`(function(){var t=Date.now();localStorage.setItem('qbsbx:pings/sb_justin',JSON.stringify({emo:{'${me}':{k:'spank',t:t}},t:t}));return 1})()`);
  await pg.go(BASE + '/'); await pg.wait('!!(window.__qb && document.querySelector("#app") && !document.querySelector("#app .boot"))', 120000); await sleep(3000);
  await pg.ev(at('2026-11-16', 12)); await pg.ev('(function(){var b=document.querySelector(".nav button[data-v=hall]");b&&b.click();return 1})()'); await sleep(4000);
  const g5 = await pg.ev(`({coins:window.__qb.x().S.coins,pops:[].map.call(document.querySelectorAll('#layer .pop'),function(p){return p.innerText}),feed:(document.querySelector('#sqbox')||{innerText:''}).innerText.replace(/\\s+/g,' ').slice(0,200)})`);
  ok(g5.coins === c0 && !g5.pops.some((p) => /\+\d+ coins/.test(p) && /Justin/.test(p)), `G5. Justin spanks me: no coins for me (${c0} -> ${g5.coins}) ${JSON.stringify(g5.pops)}`);
  // S. streak text in the Rank list and a player's card
  const st = await pg.ev(`(async function(){var w=function(ms){return new Promise(function(r){setTimeout(r,ms)})};document.querySelectorAll('#layer .modal').forEach(function(m){m.remove()});var t=document.querySelector('[data-act=htab][data-t="style"]');if(t)t.click();await w(1200);
    var sk=[].map.call(document.querySelectorAll('.pl-sk'),function(e){return e.innerText});var old=/\\d+d streak|-day streak/.test(document.querySelector('#app').innerText);return {sk:sk.slice(0,6),old:old}})()`);
  ok(st.sk.length && st.sk.every((s) => /^Streak: \d+ days?$/.test(s)) && st.sk.every((s) => !/^Streak: 1 days$/.test(s)) && !st.old, `S. Rank rows: ${JSON.stringify(st.sk)}; no old "Nd streak" / "-day streak" text`);
  ok(/Streak: \d+ days?/.test(g1.mono || ''), `S. a player's card: "${g1.mono}"`);
  ok(!pg.errs.length, `page errors: ${pg.errs.length} ${pg.errs.slice(0, 2).join(' | ')}`);
  console.log(P.length ? `W-FINAL92C: ${P.length} problem(s)` : 'W-FINAL92C: PASS');
  await br.close(); process.exit(P.length ? 1 : 0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(2); });
