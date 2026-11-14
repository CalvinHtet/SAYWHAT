// The midnight day start (3e40ab6) and a night owl: a save last played at 01:00 on 11-20 under the 5 am rule (stored as 11-19, streak 10), next
// quest at 03:00 on 11-21 and at 09:00 on 11-20, on v0.97 and v0.96; with the weekly rest day free, and with it used and no freezes. Each case in
// its own page, the quest ticked through the game's own tap (onTap).   NEW= OLD= CHROME_PORT=9375 node nightowl.js
const { browser, sleep } = require('./cdp.js'); const NEW = process.env.NEW || 'http://127.0.0.1:8817', OLD = process.env.OLD || 'http://127.0.0.1:8818';
const at = (y, mo, d, h, mi) => `window.__qbShift=(window.__qbShift||0)+(new Date(${y},${mo - 1},${d},${h},${mi}).getTime()-Date.now());`;
(async () => { const br = await browser(); const rows = [];
  for (const [when, args] of [['next night 03:00 (11-21)', [2026, 11, 21, 3, 0]], ['next morning 09:00 (11-20)', [2026, 11, 20, 9, 0]]]) for (const rest of ['rest day free', 'no rest day, no freeze']) for (const [lab, base] of [['v0.97', NEW], ['v0.96', OLD]]) {
    const pg = await br.page({ fresh: true }); const E = (js) => pg.ev(`(function(){try{${js}}catch(e){return 'ERR '+e.message}})()`);
    await pg.go(base + '/'); await pg.wait('!!(window.__qb && document.querySelector("#app") && !document.querySelector("#app .boot"))', 120000); await sleep(1200);
    // first, the day the save was made (01:00 on 11-20) on the 5 am rule: stored as 11-19
    const r = await E(at(...args) + `var x=window.__qb.x(),S=x.S;S.created=true;S.welcomed=1;S.char=window.__qb.fixChar({name:'Qa',sex:'m'});S.xp=x.cum(12);S.gates=Array.from({length:200},function(_,i){return i});S.calm=false;S.tours={};
      S.streak=10;S.best=10;S.lastDone='2026-11-19';S.runDate='2026-11-19';S.done={};S.freezes=${rest === 'rest day free' ? 0 : 0};S.freeWk=${rest === 'rest day free' ? '""' : '"__USED__"'};x.rollover();
      ${rest === 'rest day free' ? '' : "S.freeWk=(function(){var u=null;return u})();"}
      S.quests=[{id:'qz',t:'Gym',xp:60,c:5,cl:'fitness',rep:'once'}];x.persist();return 1`);
    if (rest !== 'rest day free') await E(`var x=window.__qb.x(),S=x.S;var t0=S.streak,l0=S.lastDone;S.lastDone='2026-11-01';S.streak=1;x.onTap('qz');var wk=S.freeWk;x.toggle('qz');S.done={};S.streak=t0;S.lastDone=l0;S.skUndo=null;S.freeWk=wk;S.freezes=0;x.persist();return wk`);
    await E(`var x=window.__qb.x();x.onTap('qz');return 1`); await sleep(400);
    const s = await E('var S=window.__qb.x().S,p=[].map.call(document.querySelectorAll(".pop,#layer .pop,.toast"),function(e){return e.innerText}).join(" | ");return {streak:S.streak,last:S.lastDone,today:S.runDate,freeWk:S.freeWk,freezes:S.freezes,pop:p.slice(0,120)}');
    rows.push(`${when.padEnd(26)} ${rest.padEnd(22)} ${lab}: streak 10 -> ${s.streak}  (day ${s.today}, last ${s.last}, ${s.pop || ''})`); await pg.close(); }
  rows.forEach((r) => console.log(r)); process.exit(0); })().catch((e) => { console.error(e); process.exit(1); });
