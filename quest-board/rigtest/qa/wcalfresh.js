// Cal's own fresh start (rc-v0.91 ef77fd9, 29bv_calfresh.js). The sandbox stands in for his account: window.__qbCfUid is set before the
// app starts (what QB_WEB.owners[0] is on Live), so his old v0.90 save is due at load, as it will be on his phone.
// 1. a v0.90 save with Training history: backup first (quest-board-backup-calfresh91 = the old save), then a brand-new player (the
//    creator), keeping gymlog, sessions, wk, cex/cexN; no Loft refund (the Loft reset never runs on it); S.calfresh91, joinedAt, reset91.
// 2. a reload runs nothing again. 3. the flag and joinedAt removed but the device backup there: only the flag comes back (no wipe).
// 4. after making a character: Training shows his lifts (the bench box at his last weight). 5. a save without the stand-in: the normal
//    v0.91 Loft reset and nothing else.
//   BASE=<build> CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/wcalfresh.js
const fs = require('fs');
const SEEDS = require('path').join(__dirname, 'seeds') + '/';
const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8816';
const log = (...a) => console.log(a.map((v) => (typeof v === 'string' ? v : JSON.stringify(v))).join(' '));
const SUM = `(function(){var x=window.__qb&&window.__qb.x&&window.__qb.x();if(!x||!x.S)return null;var S=x.S;return {created:!!S.created,name:S.char&&S.char.name,lvl:x.lvlOf(S.xp||0),coins:Math.floor(S.coins||0),
  rooms:(S.base&&S.base.slots||[]).filter(Boolean).map(function(r){return r.t}).join(','),owned:Object.keys(S.owned||{}).length,gym:Object.keys(S.gymlog||{}).length,sessions:(S.sessions||[]).length,cex:Object.keys(S.cex||{}).length,
  calfresh91:S.calfresh91||null,joinedAt:!!S.joinedAt,reset91:S.reset91||null,backup:(localStorage.getItem('quest-board-backup-calfresh91')||'').length,creator:!!document.querySelector('.creator,#creator,[data-act=crdone],.cr-screen')||/A new hunter awakens|NAME/.test(document.body.innerText.slice(0,400))}})()`;
(async () => {
  const br = await browser();
  const seed = JSON.parse(fs.readFileSync(SEEDS + 'v90_mid.json', 'utf8'));
  // his Training: a bench history, sessions, an own workout
  for (const k of ['quest-board', 'qbsbx:data/users/sandbox/state']) { const s = JSON.parse(seed[k]); s.gymlog = { bench: [{ d: '2026-11-08', w: 135, ws: [135, 135, 140], r: 8, u: 'lb' }, { d: '2026-11-09', w: 145, ws: [140, 145, 145], r: 8, u: 'lb' }] };
    s.sessions = [{ d: '2026-11-08', p: 'push', xp: 40 }, { d: '2026-11-09', p: 'push', xp: 45 }]; s.cex = { cx_1: { n: 'Easy Run', p: 'Cardio', u: 'mi', sets: 3, t: '', step: 0.5, ic: 'R', st: 'vit' } }; s.cexN = 1; seed[k] = JSON.stringify(s); }
  const pg = await br.page({ fresh: true });
  await pg.s('Page.addScriptToEvaluateOnNewDocument', { source: 'window.__qbCfUid="sandbox";' });
  await pg.go(BASE + '/version.json'); await pg.ev(`(function(d){localStorage.clear();Object.keys(d).forEach(function(k){localStorage.setItem(k,d[k])});return 1})(${JSON.stringify(seed)})`);
  const old = JSON.parse(seed['quest-board']);
  log('the old save: level', 18, '| coins', Math.floor(old.coins), '| rooms', old.base.slots.filter(Boolean).map((r) => r.t).join(','), '| owned', Object.keys(old.owned || {}).length);
  await pg.go(BASE + '/'); await sleep(9000);
  const a = await pg.ev(SUM); log('1. after load:', a);
  const bk = await pg.ev(`(function(){var b=JSON.parse(localStorage.getItem('quest-board-backup-calfresh91')||'null');return b?{coins:Math.floor(b.coins),rooms:(b.base.slots||[]).filter(Boolean).length,owned:Object.keys(b.owned||{}).length,gym:Object.keys(b.gymlog||{}).length,reset91:!!b.reset91}:null})()`);
  log('   device backup:', bk, '| keep list', await pg.ev('window.__qbCalFresh&&window.__qbCalFresh.keep'));
  await pg.go(BASE + '/'); await sleep(7000); log('2. after a reload:', await pg.ev(SUM));
  await pg.ev('(function(){var x=window.__qb.x(),S=x.S;delete S.calfresh91;delete S.joinedAt;x.persist();return 1})()'); await sleep(500);
  await pg.go(BASE + '/'); await sleep(7000); log('3. flag + joinedAt removed, device backup kept, reload:', await pg.ev(SUM));
  // 4: make a character, then Training
  await pg.ev(`(function(){var x=window.__qb.x(),S=x.S;S.created=true;S.char=window.__qb.fixChar({name:'Cal',sex:'m'});S.welcomed=1;x.persist();x.render();return 1})()`); await sleep(1500);
  const t = await pg.ev(`(async function(){var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})};document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});var nb=document.querySelector('.nav button[data-v=train]');nb&&nb.click();await w(1000);
    var p=document.querySelector('button.plan[data-act=wkplan][data-v="push"]');p&&p.click();await w(1500);var x=document.querySelector('[data-ca="x"]');x&&x.click();await w(600);
    var i=document.querySelector('.exlist input.kg[data-ex="bench"]');var e=i&&i.closest('.ex');var recent=[].map.call(document.querySelectorAll('button.wkrow[data-act=wkinfo]'),function(b){return b.innerText.replace(/\\s+/g,' ').slice(0,50)});
    return {benchBox:i?i.value:null,sets:e?[].map.call(e.querySelectorAll('.setb button.sb'),function(b){return b.innerText.replace(/\\s+/g,' ')}):[],own:!!document.querySelector('button.plan[data-v^="c_"]')}})()`);
  log('4. Training after making a character:', t);
  log('   page errors', pg.errs.length, pg.errs.slice(0, 2)); await pg.close();
  // 5: the same save without the stand-in
  const p2 = await br.page({ fresh: true });
  await p2.go(BASE + '/version.json'); await p2.ev(`(function(d){localStorage.clear();Object.keys(d).forEach(function(k){localStorage.setItem(k,d[k])});return 1})(${JSON.stringify(seed)})`);
  await p2.go(BASE + '/'); await sleep(9000); log('5. not Cal (no stand-in):', await p2.ev(SUM), '| due', await p2.ev('window.__qbCalFresh&&window.__qbCalFresh.due()'));
  log('   page errors', p2.errs.length, p2.errs.slice(0, 2));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
