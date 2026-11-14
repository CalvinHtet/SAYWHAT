// LEAD's speed log (3e40ab6, 29_prices.js) and the spin row refresh: as a guest (window.__qbGuest), switching tabs and sitting 35 s in The
// Loft writes nothing to localStorage qb-perf; as the owner it keeps samples (tap and stay), at most 40. Then a spin coming ready while the
// Board sits open shows within 30 s, but not while a window is open.   BASE=<sandbox> CHROME_PORT=9375 node perflog.js
const { browser, sleep } = require('./cdp.js'); const BASE = process.env.BASE || 'http://127.0.0.1:8817';
let bad = 0; const ok = (n, c, g) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + n + (g !== undefined ? '  ' + JSON.stringify(g).slice(0, 400) : '')); };
(async () => { const br = await browser();
  for (const who of ['guest', 'owner']) { const pg = await br.page({ fresh: true }); const E = (js) => pg.ev(`(function(){try{${js}}catch(e){return 'ERR '+e.message}})()`);
    await pg.go(BASE + '/'); await pg.wait('!!(window.__qb && document.querySelector("#app") && !document.querySelector("#app .boot"))', 120000); await sleep(1200);
    await E(`${who === 'guest' ? 'window.__qbGuest=1;' : ''}localStorage.removeItem('qb-perf');var x=window.__qb.x(),S=x.S;S.created=true;S.welcomed=1;S.char=window.__qb.fixChar({name:'Qa',sex:'m'});S.xp=x.cum(12);S.gates=Array.from({length:200},function(_,i){return i});S.calm=false;S.tours={welcome:1,dq:1,bty:1,train:1,hideout:1,hall:1,players:1,shop:1,away:1,trophy:1,wheel:1};S.areaOn=null;x.persist();var o=window.__qbUnlock.on();['hideout','hall','players'].forEach(function(k){o[k]=1});x.render();return 1`); await sleep(800);
    for (const v of ['hideout', 'hall', 'players', 'board', 'hideout']) { await E(`document.querySelectorAll('#layer .modal,.dropsplash').forEach(function(m){m.remove()});var b=document.querySelector('.nav button[data-v="${v}"]');b&&b.click();return 1`); await sleep(1500); }
    await sleep(36000); const n = await E('var a=JSON.parse(localStorage.getItem("qb-perf")||"[]");return {n:a.length,why:a.map(function(s){return s.why}).join(",")}');
    if (who === 'guest') ok('a guest writes nothing to qb-perf', n.n === 0, n); else ok('the owner keeps samples (tap, change, stay), at most 40', n.n > 0 && n.n <= 40 && /tap/.test(n.why) && /stay/.test(n.why), n);
    if (who === 'owner') { // the spin row: ready while the Board sits open, no redraw
      await E(`var x=window.__qb.x(),S=x.S;S.tours.wheel=1;var o=window.__qbUnlock.on();o.wheel=1;S.wheelAt=Date.now()-(4*3600e3-20e3);x.persist();document.querySelectorAll('#layer .modal').forEach(function(m){m.remove()});document.querySelector('.nav button[data-v=board]').click();return 1`); await sleep(1500);
      const r0 = await E('return !!document.querySelector(".zx-spin")'); await sleep(52000); const r1 = await E('return !!document.querySelector(".zx-spin")');
      ok('a spin coming ready while the Board sits open shows within about 30 s, with no tap', !r0 && r1, { before: r0, after52s: r1 });
      await E(`var x=window.__qb.x(),S=x.S;S.wheelAt=Date.now()-(4*3600e3-20e3);x.render();window.__qb.roomModal(0);return 1`); await sleep(52000); const r2 = await E('return {row:!!document.querySelector(".zx-spin"),win:!!document.querySelector("#layer .modal")}');
      ok('...but not while a window is open', !r2.row && r2.win, r2); }
    ok(`${who}: no page errors`, !(pg.errs || []).length, pg.errs); await pg.close(); }
  console.log(bad ? 'FAILED ' + bad : 'PASS'); process.exit(0); })().catch((e) => { console.error(e); process.exit(1); });
