// w-unlock (W52): the one-time reset on real saves. For each save: load it on the new build, let the reset run, then check
// - the backup (quest-board-backup-v91 on the device, data/users/<id>/backup_v91 online) holds the save as it was;
// - the refund against QA's own sum at today's prices: every owned upgrade, paint, decor, hires and the lot or build cost of
//   every room that was paid for (a room built from a lot with no opener upgrade owned, e.g. a Restaurant from before 11-05);
// - coins = before + refund; level, XP, clothes, relics, quests, Training, letters and the rest of the save untouched;
// - the letter: only when there was something to reset, with the same amount; a reload runs nothing again.
//   BASE=<new build> CASES=adv,oldrest,mid,bedonly,fresh CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/wunlock_reset.js
const fs = require('fs');
const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8817', OUT = process.env.OUT || 'C:/Users/clvh/qa-wt/out/wunlock/';
fs.mkdirSync(OUT, { recursive: true });
const CASES = (process.env.CASES || 'adv,oldrest,mid,bedonly,fresh').split(',');
const rd = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
// each case: the localStorage to start from (null = a fresh player) and what it is
const MUT = {
  adv: ['C:/Users/clvh/qa-wt/out/wsale/oldsave_adv.json', 'v0.90 save, level 60, every room and upgrade', null],
  mid: ['C:/Users/clvh/qa-wt/out/wsale/oldsave_mid.json', 'v0.90 save, level 18, early Garden, Restaurant, Boba', null],
  adv88: ['C:/Users/clvh/qa-wt/out/seed_adv2.json', 'v0.88 seed, level 60, every room', null],
  // a Restaurant built from its lot before 11-05 (16e72c3 added the Garden's "Knock Through" opener): no gd_rest on the Garden
  oldrest: ['C:/Users/clvh/qa-wt/out/wsale/oldsave_mid.json', 'mid save whose Restaurant came from the lot (pre-11-05 path, no gd_rest)', (s) => {
    s.base.slots.forEach((r) => { if (r && r.t === 'garden' && r.a) delete r.a.gd_rest; }); }],
  bedonly: ['C:/Users/clvh/qa-wt/out/wsale/oldsave_mid.json', 'v0.90 save with only a bare Bedroom (nothing bought)', (s) => {
    s.base.slots = s.base.slots.map((r, i) => (i === 0 ? { t: 'bedroom', a: {}, st: 0, pend: 0 } : null)); }],
  fresh: [null, 'a fresh player on the new build', null],
};
const KEEP_SKIP = new Set(['base', 'hired', 'coins', 'spent', 'reset91', 'r91p', 'sty', 'story', 'saved', 'ts', 'updated', 'appv', 'lastSeen', 'earnedC', 'dq', 'lastTick', 'tick']);
const STATE = `(function(){var x=window.__qb&&window.__qb.x&&window.__qb.x();if(!x||!x.S)return null;var S=x.S;
  return {S:JSON.parse(JSON.stringify(S)),backup:localStorage.getItem('quest-board-backup-v91'),
    online:Object.keys(localStorage).filter(function(k){return /backup_v91/.test(k)}).map(function(k){return k+':'+(localStorage.getItem(k)||'').length})}})()`;
(async () => {
  const br = await browser(); const out = [];
  const log = (...a) => { const s = a.map((x) => (typeof x === 'string' ? x : JSON.stringify(x))).join(' '); console.log(s); out.push(s); };
  for (const c of CASES) {
    const [file, what, mut] = MUT[c]; log(`== ${c}: ${what}`);
    const pg = await br.page({ fresh: true });
    await pg.go(BASE + '/version.json');
    if (file) { const d = rd(file); for (const k of ['quest-board', 'qbsbx:data/users/sandbox/state']) if (d[k] && mut) { const s = JSON.parse(d[k]); mut(s); d[k] = JSON.stringify(s); }
      await pg.ev(`(function(d){localStorage.clear();Object.keys(d).forEach(function(k){localStorage.setItem(k,d[k])});return 1})(${JSON.stringify(d)})`); }
    const seedS = file ? JSON.parse(rd(file)['quest-board']) : null; if (seedS && mut) mut(seedS);
    await pg.go(BASE + '/'); await pg.wait('!!(window.__qb && window.__qb.x && window.__qb.x().S && document.querySelector(".nav button[data-v=board]"))', 120000);
    // the reset runs on a 1 s timer after the load; the letter opens 1.5 s later
    let st = null; for (let k = 0; k < 16; k++) { await sleep(500); st = await pg.ev(STATE); if (st && st.S.reset91) break; }
    await sleep(2500); st = await pg.ev(STATE);
    const S = st.S, R = S.reset91 || null;
    const win = await pg.ev('(function(){var m=document.querySelector("#layer .modal");return m?m.innerText.replace(/\\s+/g," ").slice(0,400):""})()');
    await pg.shot(OUT + `reset_${c}.png`);
    log('  reset91:', R, '| r91p left:', !!S.r91p, '| backup on device:', st.backup ? st.backup.length + ' chars' : 'NONE', '| online:', st.online);
    log('  window after load:', win || '(none)');
    if (seedS) {
      const B = st.backup ? JSON.parse(st.backup) : seedS;
      // QA's own refund at today's prices
      const mine = await pg.ev(`(function(B){var x=window.__qb.x(),A=x.ADDONS,T=x.ROOMT,V=window.__qbReset&&window.__qbReset.value,rows=[],sumV=0,miss=0;
        var opened={};Object.keys(A).forEach(function(k){(A[k]||[]).forEach(function(a){var m=a[3]||{};if(m.opens)opened[m.opens]=(opened[m.opens]||[]).concat([k+'.'+a[0]])})});
        var owned=function(id){var o=false;(B.base.slots||[]).forEach(function(r){if(r&&r.a&&r.a[id.split('.')[1]]&&r.t===id.split('.')[0])o=true});return o};
        (B.base.slots||[]).forEach(function(r){if(!r)return;var ups=0,n=0;(A[r.t]||[]).forEach(function(a){if(r.a&&r.a[a[0]]&&+a[2]>0){ups+=+a[2];n++}});
          var v=V?V(r):null;sumV+=v||0;var lot=0,why='';
          if(r.t!=='bedroom'&&(T[r.t]||{}).cost>0){var op=opened[r.t]||[];if(!op.some(owned)){lot=T[r.t].cost;why=op.length?'opener '+op.join('/')+' not owned':'built from its lot'}}
          var counted=v!=null&&lot>0&&v>=ups+150*(r.st||0)+lot;if(lot&&!counted)miss+=lot;
          rows.push(r.t+': '+n+' ups '+ups+(r.st?' paint '+150*r.st:'')+(lot?' lot '+lot+' ('+why+')'+(counted?' counted':' NOT COUNTED'):'')+' | game value '+v)});
        return {rows:rows,sumV:sumV,miss:miss,hired:B.hired||null}})(${JSON.stringify(B)})`);
      mine.rows.forEach((r) => log('   ' + r));
      log(`  refund ${R ? R.refund : '-'} | sum of the game's own room values ${mine.sumV} | paid for but not refunded ${mine.miss} | hires in the save ${JSON.stringify(mine.hired)}`);
      log(`  coins: before ${B.coins} -> after ${S.coins} (diff ${S.coins - B.coins}, refund ${R ? R.refund : 0}); spent ${B.spent} -> ${S.spent}`);
      log(`  rooms after: ${(S.base.slots || []).filter(Boolean).map((r) => r.t + '(' + Object.keys(r.a || {}).length + ')').join(' ')}`);
      const changed = Object.keys(Object.assign({}, B, S)).filter((k) => !KEEP_SKIP.has(k) && JSON.stringify(B[k]) !== JSON.stringify(S[k]));
      log('  other save fields changed by the load:', changed.length ? changed.map((k) => k + (typeof B[k] === 'number' ? ` ${B[k]}->${S[k]}` : '')).join(', ') : 'none');
      log('  backup equals the save as loaded (minus timestamps):', st.backup ? Object.keys(seedS).filter((k) => !/^(ts|saved|updated|lastSeen|appv|lastTick)$/.test(k) && JSON.stringify(seedS[k]) !== JSON.stringify(B[k])).join(', ') || 'yes' : 'no backup');
    } else log('  coins', S.coins, 'rooms', (S.base.slots || []).filter(Boolean).map((r) => r.t).join(' '));
    // the letter in the inbox
    const L = await pg.ev(`(async function(){var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})};document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});
      var b=document.querySelector('.ibbtn');if(!b)return {err:'no envelope'};b.click();await w(700);var rows=[].map.call(document.querySelectorAll('#layer .ibrow'),function(r){return r.dataset.id});
      var r=document.querySelector('#layer .ibrow[data-id="reset91"]'),body='';if(r){r.click();await w(700);var m=document.querySelector('#layer .modal');body=m?m.innerText.replace(/\\s+/g,' '):''}
      document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});return {rows:rows,body:body}})()`, 30000);
    log('  inbox rows:', L.rows, L.err || '');
    if (L.body) log('  letter:', L.body.slice(0, 600));
    // reload: nothing runs twice
    const c1 = (await pg.ev('window.__qb.x().S.coins')); await pg.go(BASE + '/'); await pg.wait('!!(window.__qb && window.__qb.x && window.__qb.x().S && document.querySelector(".nav button[data-v=board]"))', 120000); await sleep(5000);
    const st2 = await pg.ev(STATE);
    log(`  after a reload: reset91.at same ${JSON.stringify((st2.S.reset91 || {}).at) === JSON.stringify((R || {}).at)}, r91p ${!!st2.S.r91p}, coins ${c1} -> ${st2.S.coins}, rooms ${(st2.S.base.slots || []).filter(Boolean).length}`);
    log('  page errors', pg.errs.length, pg.errs.slice(0, 3));
    await pg.close();
  }
  fs.writeFileSync(OUT + 'reset.log', out.join('\n') + '\n');
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
