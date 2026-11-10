// rc089 QA, Training W5 part 3: empty ranges and edge cases, on the old adv2 save with a short history put in through the hooks:
// Legs sessions 20 and 40 days ago and Pull 3 days ago; Back Squat logged 20 and 40 days ago; Deadlift once 50 days ago and
// once 100 days ago (nothing in the last month); a custom run (mi) 2 days ago and today.
const L = require('./rc089_train_lib.js');
const { sleep } = L;
const D = L.OUT + '/train/edge_';
const log = (...a) => console.log(...a);
(async () => {
  const { br, pg } = await L.openGame(L.seed('seed_adv2'));
  log('windows on load (closed)', (await L.settle(pg, null, 20)).seen.length);
  log('inject', JSON.stringify(await L.S(pg, `(function(){var ds=function(k){var d=new Date(Date.now()-5*36e5-k*864e5);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
    S.cex=S.cex||{};S.cex.cx_901={n:'Morning run',p:'Cardio',u:'mi',sets:1,t:'3 mi',step:.5,ic:'\u{1F3C3}',st:'agi'};
    S.sessions=[{d:ds(40),plan:'legs',n:5,load:3000,u:'lb',top:{squat:185}},{d:ds(20),plan:'legs',n:5,load:3400,u:'lb',top:{squat:205}},{d:ds(3),plan:'pull',n:6,load:2500,u:'lb',top:{row:115}},
      {d:ds(2),plan:'c_cardio',n:1,load:3.5,u:'mi',top:{cx_901:3.5}},{d:ds(0),plan:'c_cardio',n:1,load:4,u:'mi',top:{cx_901:4}}];
    S.gymlog={squat:[{d:ds(40),w:185,ws:[185,185,185,185],n:4,hit:true,u:'lb'},{d:ds(20),w:205,ws:[205,205,205,205],n:4,hit:false,u:'lb'}],
      deadlift:[{d:ds(100),w:225,ws:[225,225,225],n:3,hit:true,u:'lb'},{d:ds(50),w:245,ws:[245,245,245],n:3,hit:true,u:'lb'}],
      row:[{d:ds(3),w:115,ws:[115,115,115,115],n:4,hit:true,u:'lb'}],cx_901:[{d:ds(2),w:3.5,ws:[3.5],n:1,hit:false,u:'mi'},{d:ds(0),w:4,ws:[4],n:1,hit:false,u:'mi'}]};
    x.persist();x.render();return {today:ds(0),s:S.sessions.map(function(s){return s.d+' '+s.plan})}})()`)));
  await L.nav(pg, 'train'); await sleep(1200); await L.closeAll(pg);
  const rows = await pg.ev(`[].map.call(document.querySelectorAll('button.wkrow'),function(b){return (b.dataset.s||b.dataset.ex)+': '+b.innerText.replace(/\\s+/g,' ')})`);
  log('ROWS', JSON.stringify(rows));
  await pg.ev(`(function(){var b=document.querySelector('button.wkrow[data-act=wkinfo]');b.closest('section').id='qa_recent';var p=document.querySelector('button.wkbest');p.closest('section').id='qa_pb';return 1})()`);
  await L.shotEl(pg, '#qa_recent', D + '01_recent.png'); await L.shotEl(pg, '#qa_pb', D + '02_pbs.png');
  const gi = () => pg.ev(`(function(){var m=document.querySelector('#layer .modal');if(!m)return null;var g=m.querySelector('svg.wkchart');return {label:(m.querySelector('.label')||{}).textContent,ranges:[].map.call(m.querySelectorAll('[data-wkrg]'),function(b){return b.textContent+(b.classList.contains('on')?'*':'')}).join('|'),pts:g?g.querySelectorAll('circle.wkdot').length:0,ringed:g?[].map.call(g.querySelectorAll('circle.wkdot.on'),function(c){return c.parentNode.querySelector('title').textContent}):[],empty:(m.querySelector('.wkempty')||{}).textContent||'',text:m.innerText.replace(/\\s+/g,' ').slice(0,260)}})()`);
  const gtap = async (sel, i, dx) => { for (let k = 0; k < 4; k++) { await L.closeAll(pg); await L.tapEl(pg, sel, i, dx || 0.5, 0.5); await sleep(700); const m = await L.modalInfo(pg); if (m.length === 1 && /wksum/.test(m[0].card)) return; } throw new Error('graph did not open ' + sel); };
  const rg = async (k) => { await L.tapEl(pg, '#layer .modal [data-wkrg="' + k + '"]'); await sleep(400); return gi(); };
  const idx = async (re) => pg.ev(`[].findIndex.call(document.querySelectorAll('button.wkrow[data-act=wkinfo]'),function(b){return ${re}.test(b.innerText)})`);
  // the Legs day 40 days ago (outside 1 month), tapped
  let i = await idx('/Legs/'); const legsRows = await pg.ev(`[].map.call(document.querySelectorAll('button.wkrow[data-act=wkinfo]'),function(b,i){return i+':'+b.innerText.replace(/\\s+/g,' ')}).filter(function(t){return /Legs/.test(t)})`);
  log('legs rows', JSON.stringify(legsRows));
  const oldLegs = +legsRows[legsRows.length - 1].split(':')[0];
  await gtap('button.wkrow[data-act=wkinfo]', oldLegs, 0.3);
  log('OLD LEGS (40 days ago) default:', JSON.stringify(await gi())); await pg.shot(D + '03_oldlegs_1m.png');
  log('  7 days:', JSON.stringify(await rg('7d'))); await pg.shot(D + '04_oldlegs_7d.png');
  log('  3 months:', JSON.stringify(await rg('3m'))); await pg.shot(D + '05_oldlegs_3m.png');
  await rg('1m');
  // Pull: one session only (no graph by design)
  i = await idx('/Pull/'); await gtap('button.wkrow[data-act=wkinfo]', i, 0.3);
  log('PULL (one session):', JSON.stringify(await gi()));
  // the custom Cardio: 2 sessions in miles
  i = await idx('/Cardio/'); await gtap('button.wkrow[data-act=wkinfo] .wki', i);
  log('CARDIO (custom, mi):', JSON.stringify(await gi())); await pg.shot(D + '06_cardio_1m.png');
  log('  7 days:', JSON.stringify(await rg('7d')));
  await rg('1m');
  // PBs: Deadlift has nothing in the last month
  const pbi = await pg.ev(`[].findIndex.call(document.querySelectorAll('button.wkbest'),function(b){return /Deadlift/.test(b.innerText)})`);
  await gtap('button.wkbest', pbi, 0.3);
  log('DEADLIFT PB default (1 month, nothing inside):', JSON.stringify(await gi())); await pg.shot(D + '07_deadlift_1m.png');
  log('  7 days:', JSON.stringify(await rg('7d'))); await pg.shot(D + '08_deadlift_7d.png');
  log('  3 months:', JSON.stringify(await rg('3m')));
  log('  6 months:', JSON.stringify(await rg('6m'))); await pg.shot(D + '09_deadlift_6m.png');
  await rg('1m');
  const cxi = await pg.ev(`[].findIndex.call(document.querySelectorAll('button.wkbest'),function(b){return /Morning run/.test(b.innerText)})`);
  if (cxi >= 0) { await gtap('button.wkbest .wki', cxi); log('MORNING RUN PB (custom mi):', JSON.stringify(await gi())); await pg.shot(D + '10_run_pb.png'); }
  else log('MORNING RUN not in Personal bests');
  // the custom plan's workout card: its unit box
  await L.closeAll(pg);
  await L.tapEl(pg, 'button.plan[data-act=wkplan][data-v="c_cardio"]'); await sleep(1500);
  log('custom coach:', JSON.stringify(await pg.ev(`(function(){var c=document.querySelector('.cinner');return c?c.innerText.replace(/\\s+/g,' ').slice(0,300):null})()`)));
  await pg.shot(D + '11_cardio_coach.png');
  await pg.ev(`(function(){var x=document.querySelector('[data-ca="x"]');if(x)x.click();return 1})()`); await sleep(600);
  log('custom card:', JSON.stringify(await pg.ev(`[].map.call(document.querySelectorAll('.exlist .ex'),function(e){return e.innerText.replace(/\\s+/g,' ').slice(0,200)})`)));
  await L.tapEl(pg, 'button[data-act=wkcancel]'); await sleep(500);
  log('page errors', pg.errs.length, JSON.stringify(pg.errs.slice(0, 6)));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
