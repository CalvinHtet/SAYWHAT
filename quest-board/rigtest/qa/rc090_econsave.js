// rc-0.90 economy save move (LEAD 11:36 + 11:37): a save from v0.87 (40910d9) and v0.88 (213ea0f) opens on rc-0.90 at the same level and
// the same fraction of that level on the new curve (curve 4, xpc4), with coins, items, rooms, upgrades and relics unchanged, and the
// move runs once. Then the rollback round trip: that rc-0.90 save opened on rollback-v0.80 (1f2e1da, APPV 91): what level it shows
// there, that it loads and saves; then back on rc-0.90: the same level, fraction, coins, items and rooms, and no second move.
//   SRC=8812,8810 DST=8816 RB=8817 bash tools/windows/node.sh rigtest/qa/rc090_econsave.js
const fs = require('fs');
const { browser, sleep } = require('./cdp.js');
const H = (p) => 'http://127.0.0.1:' + p;
const SRC = (process.env.SRC || '8812,8810').split(',').map(H), DST = H(process.env.DST || '8816'), RB = H(process.env.RB || '8817');
const OUT = process.env.OUT || 'C:/Users/clvh/qa-wt/out/rc090/save'; fs.mkdirSync(OUT, { recursive: true });
const LEVELS = (process.env.LEVELS || '7,23,42,77').split(',').map(Number);
const SUM = `(function(){var x=window.__qb.x(),S=x.S,ks=function(o){return Object.keys(o||{}).sort()};var L=x.lvlOf?x.lvlOf(S.xp):x.effLvl();
  var a=x.cum(L),b=x.cum(L+1);return JSON.stringify({appv:S.appv,xpc:[S.xpc2,S.xpc3,S.xpc4].join(''),xp:S.xp,lvl:L,eff:x.effLvl(),frac:+((S.xp-a)/Math.max(1,b-a)).toFixed(4),coins:S.coins,
    rooms:(S.base&&S.base.slots||[]).map(function(r){return r&&r.t}).join(','),ups:(S.base&&S.base.slots||[]).reduce(function(c,r){return c+ks(r&&r.a).length},0),
    owned:ks(S.owned).length,eq:JSON.stringify(S.eq||{}),relics:ks(S.relics).join(','),gates:(S.gates||[]).length})})()`;
const dumpLS = '(function(){var o={};for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);o[k]=localStorage.getItem(k)}return o})()';
const putLS = (d) => `(function(d){localStorage.clear();Object.keys(d).forEach(function(k){localStorage.setItem(k,d[k])});return 1})(${JSON.stringify(d)})`;
async function openWith(br, base, dump) {
  const p = await br.page({ fresh: true });
  if (dump) { await p.go(base + '/version.json'); await p.ev(putLS(dump)); }
  await p.go(base + '/'); await p.wait('!!(window.__qb && window.__qb.x && document.querySelector(".nav button[data-v=board]"))', 120000); await sleep(3500);
  return p;
}
const cmp = (A, B, keys) => keys.filter((k) => JSON.stringify(A[k]) !== JSON.stringify(B[k])).map((k) => k + ' ' + JSON.stringify(A[k]) + '->' + JSON.stringify(B[k]));
(async () => {
  const br = await browser(); let bad = 0;
  for (const src of SRC) for (const lv of LEVELS) {
    // a player on the old build at level lv and 37% into it, with rooms, items and coins
    const a = await br.page({ fresh: true });
    await a.go(src + '/'); await a.wait('!!(window.__qb && window.__qb.x && window.__qbRooms && document.querySelector("#app"))', 120000); await sleep(1200);
    await a.ev(`(function(){var x=window.__qb.x(),S=x.S;S.created=true;S.char=window.__qb.fixChar({name:'Mover',sex:'m'});S.xp=10;S.welcomed=1;x.persist();x.render();return 1})()`); await sleep(600);
    await a.ev(`(function(){window.__qbRooms.unlockAll();var x=window.__qb.x(),S=x.S;Object.keys(x.ADDONS).forEach(function(t){if(S.base.slots.some(function(r){return r&&r.t===t}))window.__qbRooms.all(t,1)});
      S.xp=Math.round(x.cum(${lv})+0.37*(x.cum(${lv}+1)-x.cum(${lv})));S.coins=54321;S.owned=S.owned||{};(x.SHOP||[]).slice(40,52).forEach(function(s){if(typeof s[0]==='string')S.owned[s[0]]=true});
      document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});x.persist();return 1})()`);
    await sleep(9000); /* the relic check runs 6 s after start: let it pay before the save is taken */ await a.ev('(function(){window.__qb.x().persist();return 1})()'); await sleep(1500);
    const before = JSON.parse(await a.ev(SUM)); const d0 = await a.ev(dumpLS); await a.close();
    // on rc-0.90
    const b = await openWith(br, DST, d0); const after = JSON.parse(await b.ev(SUM));
    await b.ev('(function(){window.__qb.x().persist();return 1})()'); await sleep(1200); const d1 = await b.ev(dumpLS); const errB = b.errs.length; await b.close();
    const b2 = await openWith(br, DST, d1); const again = JSON.parse(await b2.ev(SUM)); await b2.close();
    // rollback round trip: rc-0.90's save on rollback-v0.80, a save there, then rc-0.90 again
    const r = await openWith(br, RB, d1); const onRb = JSON.parse(await r.ev(SUM)); await r.ev('(function(){window.__qb.x().persist();return 1})()'); await sleep(1200);
    const d2 = await r.ev(dumpLS); const errR = r.errs.length; await r.close();
    const c = await openWith(br, DST, d2); const back = JSON.parse(await c.ev(SUM)); const errC = c.errs.length; await c.close();
    const keep = ['coins', 'rooms', 'ups', 'owned', 'eq', 'relics'];
    const lvOk = after.lvl === before.lvl && Math.abs(after.frac - before.frac) < 0.01;
    const d01 = cmp(before, after, keep), dAgain = cmp(after, again, ['xp', 'lvl', 'frac', ...keep]), dBack = cmp(after, back, ['lvl', 'frac', ...keep]);
    const ok = lvOk && !d01.length && !dAgain.length && !dBack.length && !errB && !errC;
    if (!ok) bad++;
    console.log(`== appv ${before.appv} save at level ${before.lvl} (${(before.frac * 100).toFixed(1)}% in, xp ${before.xp}) -> rc-0.90: level ${after.lvl} ${(after.frac * 100).toFixed(1)}% (xp ${after.xp}, flags ${after.xpc}) ${lvOk ? 'SAME LEVEL+FRACTION' : 'LEVEL MOVED'}`
      + (d01.length ? '; CHANGED ' + d01.join('; ') : '; coins/items/rooms/relics same') + (dAgain.length ? '; RELOAD CHANGED ' + dAgain.join('; ') : '; reload same'));
    console.log(`   rollback 1f2e1da shows level ${onRb.lvl} (${(onRb.frac * 100).toFixed(1)}% in, its own curve; xp ${onRb.xp}, appv ${onRb.appv}), errors ${errR}; back on rc-0.90: level ${back.lvl} ${(back.frac * 100).toFixed(1)}%, xp ${back.xp}, flags ${back.xpc}`
      + (dBack.length ? ' CHANGED ' + dBack.join('; ') : ' same as before the rollback') + `; page errors rc ${errB + errC}`);
  }
  console.log(bad ? 'FAIL (' + bad + ')' : 'PASS'); await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
