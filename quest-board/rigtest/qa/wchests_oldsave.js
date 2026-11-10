// QA w-chests check 6: the v0.88 advanced save (seed_adv2.json) loads with level, coins, rooms and owned items unchanged; what
// happens to its old relics (S.relics) and its Daily Quest state.
const fs = require('fs');
const { open, log, closeModals, shotEl, nav, sleep } = require('./wchests_lib.js');
const L = log('oldsave');
const SEED = 'C:/Users/clvh/qa-wt/out/seed_adv2.json';
(async () => {
  const raw = JSON.parse(fs.readFileSync(SEED, 'utf8'));
  const s = JSON.parse(raw['quest-board']);
  const sum = (S) => ({ epoch: S.epoch, xp: S.xp, coins: S.coins, earnedC: S.earnedC, owned: Object.keys(S.owned || {}).filter((k) => S.owned[k]).length,
    rooms: (S.base && S.base.slots || []).filter(Boolean).map((r) => r.t + ':' + Object.keys(r.a || {}).length).join(' '), gates: (S.gates || []).length,
    relics: Object.keys(S.relics || {}).sort().join(','), relics2: S.relics2 ? Object.keys(S.relics2).length : 'none', dq: JSON.stringify(S.dq), trophy: JSON.stringify(S.trophy || {}), freezes: S.freezes, sp: JSON.stringify(S.sp) });
  L('seed', sum(s), 'keys', Object.keys(raw));
  const { br, pg } = await open({ seed: SEED });
  await sleep(1500);
  const live = await pg.ev(`(function(){var x=window.__qb.x(),S=x.S;return {S:JSON.parse(JSON.stringify(S)),lvl:x.effLvl()}})()`);
  L('loaded (t+3 s)', sum(live.S), 'effLvl', live.lvl);
  await sleep(9000); // dgRelicCheck runs at 6 s, dqCheck every 4 s
  const live2 = await pg.ev(`(function(){var x=window.__qb.x(),S=x.S;return {S:JSON.parse(JSON.stringify(S)),lvl:x.effLvl(),modals:[].map.call(document.querySelectorAll('#layer .modal'),function(m){return m.innerText.replace(/\\s+/g,' ').slice(0,160)}),dqXp:window.__qbEcon.xp()}})()`);
  L('loaded (t+12 s)', sum(live2.S), 'effLvl', live2.lvl, 'dqXp', live2.dqXp, 'modals', live2.modals);
  const saved = await pg.ev(`(function(){window.__qb.x().persist();var r=localStorage.getItem('quest-board');return r?JSON.parse(r):null})()`);
  L('persisted', saved ? sum(saved) : null);
  await closeModals(pg); await nav(pg, 'trophy'); await sleep(900);
  L('relics tab', await pg.ev(`(function(){return [].map.call(document.querySelectorAll('#app section.card'),function(c){return c.innerText.replace(/\\s+/g,' ').slice(0,200)}).slice(0,4)})()`));
  await pg.ev(`(function(){var c=[].filter.call(document.querySelectorAll('#app section.card'),function(c){return /found/i.test(c.querySelector('h3')?c.querySelector('h3').innerText:'')})[0];if(c)c.id='qa_old';return !!c})()`);
  await shotEl(pg, '#qa_old', 'oldsave_relics_old.png', 8, true);
  await pg.ev(`(function(){var g=document.querySelector('.r2-grid');if(g)g.closest('section').id='qa_new';return 1})()`);
  await pg.ev(`window.scrollTo(0,0)`); await sleep(300);
  await pg.shot('C:/Users/clvh/qa-wt/out/wchests/oldsave_relics_top.png');
  await nav(pg, 'board'); await sleep(800);
  await pg.shot('C:/Users/clvh/qa-wt/out/wchests/oldsave_board.png');
  L('page errors', pg.errs.length, pg.errs.slice(0, 5));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
