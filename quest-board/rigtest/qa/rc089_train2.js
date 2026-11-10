// rc089 QA, Training W5 part 2: a workout logged through the UI on the old heavy save. The weight box, set boxes, Last lines,
// the summary and its graph; the save's sizes (S.gymlog, S.sessions, the whole save) before and after; a reload.
//   PLAN=push (default) or a plan of your own (c_cardio ...); SORT=1 as in rc089_train1.js; TAG names the outputs
const fs = require('fs');
const L = require('./rc089_train_lib.js');
const { sleep } = L;
const PLAN = process.env.PLAN || 'push', TAG = process.env.TAG || ('log_' + PLAN + (process.env.SORT ? '_sorted' : ''));
const D = L.OUT + '/train/';
const log = (...a) => console.log(...a);
const sizes = (pg) => L.S(pg, `(function(){var g=S.gymlog||{},ks=Object.keys(g);var save=localStorage.getItem('quest-board')||'';
  return {saveKB:Math.round(save.length/102.4)/10,gymlogKB:Math.round(JSON.stringify(g).length/102.4)/10,gymEntries:ks.reduce(function(a,k){return a+g[k].length},0),sessions:(S.sessions||[]).length,sessionsKB:Math.round(JSON.stringify(S.sessions||[]).length/102.4)/10,
    perEx:ks.filter(function(k){return /^(bench|incline|ohp|lateral|pushdown|facepull|plank|squat|cx_1|cx_2|cx_5)$/.test(k)}).map(function(k){return k+':'+g[k].length+'('+(g[k][0]||{}).d+'..'+(g[k][g[k].length-1]||{}).d+')'}).join(' '),
    sessSpan:(S.sessions||[]).length?S.sessions[0].d+'..'+S.sessions[S.sessions.length-1].d:'',sessFull:(S.sessions||[]).filter(function(x){return 'top' in x}).length}})()`);
(async () => {
  const sd = L.seed('seed_heavy');
  if (process.env.SORT) { const s = JSON.parse(sd['quest-board']); Object.keys(s.gymlog).forEach((k) => s.gymlog[k].sort((a, b) => (a.d < b.d ? -1 : 1))); s.sessions.sort((a, b) => (a.d < b.d ? -1 : 1)); sd['quest-board'] = sd['qbsbx:data/users/sandbox/state'] = JSON.stringify(s); }
  const { br, pg } = await L.openGame(sd);
  log('windows on load (closed)', (await L.settle(pg, null, 20)).seen.length);
  await sleep(1500);
  const before = await sizes(pg); log('BEFORE', JSON.stringify(before));
  await L.nav(pg, 'train'); await sleep(1200); await L.closeAll(pg);
  // pick the plan with a real tap; the guided session opens by itself
  await L.tapEl(pg, 'button.plan[data-act=wkplan][data-v="' + PLAN + '"]'); await sleep(1500);
  const coach = await pg.ev(`(function(){var c=document.querySelector('.cinner');if(!c)return null;var lab=c.querySelector('label.kgw');var inp=lab&&lab.querySelector('input'),sp=lab&&lab.querySelector('span');
    return {text:c.innerText.replace(/\\s+/g,' ').slice(0,400),unit:sp?sp.textContent:'',gap:lab?Math.round(sp.getBoundingClientRect().left-inp.getBoundingClientRect().right):null,inputW:inp?Math.round(inp.getBoundingClientRect().width):null,val:inp?inp.value:null,
      boxes:[].map.call(c.querySelectorAll('.setb button.sb'),function(b){var r=b.getBoundingClientRect();return Math.round(r.top)+'/'+Math.round(r.left)+'-'+Math.round(r.right)+':'+b.innerText.replace(/\\s+/g,' ')}).join(' | ')}})()`);
  log('COACH screen', JSON.stringify(coach));
  await pg.shot(D + TAG + '_01_coach.png');
  await pg.ev(`(function(){var x=document.querySelector('[data-ca="x"]');if(x)x.click();return 1})()`); await sleep(800);
  await L.closeAll(pg);
  const ids = await pg.ev(`[].map.call(document.querySelectorAll('.exlist input.kg'),function(i){return i.dataset.ex})`);
  const cards = await pg.ev(`[].map.call(document.querySelectorAll('.exlist .ex'),function(e){var lab=e.querySelector('label.kgw');var inp=lab&&lab.querySelector('input'),sp=lab&&lab.querySelector('span');var bx=[].map.call(e.querySelectorAll('.setb button.sb'),function(b){return b.getBoundingClientRect()});
    return {name:e.querySelector('.exhead b').textContent,last:[].map.call(e.querySelectorAll('.exbody > .note'),function(n){return n.textContent}).join(' / '),unit:sp?sp.textContent:'-',val:inp?inp.value:'-',gap:lab?Math.round(sp.getBoundingClientRect().left-inp.getBoundingClientRect().right):null,
      boxes:bx.length,rows:new Set(bx.map(function(r){return Math.round(r.top)})).size,boxW:bx.length?Math.round(bx[0].width):0,setText:[].map.call(e.querySelectorAll('.setb button.sb'),function(b){return b.innerText.replace(/\\s+/g,' ')}).join('|'),cardRight:Math.round(e.getBoundingClientRect().right),lastBoxRight:bx.length?Math.round(bx[bx.length-1].right):0}})`);
  cards.forEach((c) => log('CARD', JSON.stringify(c)));
  await L.shotEl(pg, '.exlist .ex', D + TAG + '_02_card0_before.png', 0);
  // log: the first two weighted exercises, every set, with a typed weight; the rest one set each at the shown weight
  const typeW = async (id, v) => { await L.tapEl(pg, '.exlist input.kg[data-ex="' + id + '"]'); await pg.ev(`(function(){var i=document.querySelector('.exlist input.kg[data-ex="${id}"]');i.focus();i.select();return 1})()`); await pg.s('Input.insertText', { text: String(v) }); await sleep(200); };
  const W = PLAN === 'push' ? [135, 52.5] : [3.5, 12];
  for (let j = 0; j < ids.length; j++) {
    const id = ids[j];
    if (j < 2) { await typeW(id, W[j]); const wbox = await pg.ev(`(function(){var lab=document.querySelector('.exlist input.kg[data-ex="${id}"]').closest('label');var inp=lab.querySelector('input'),sp=lab.querySelector('span');return {val:inp.value,w:Math.round(inp.getBoundingClientRect().width),gap:Math.round(sp.getBoundingClientRect().left-inp.getBoundingClientRect().right),unit:sp.textContent}})()`); log('typed', id, JSON.stringify(wbox)); }
    if (j === 0) await L.shotEl(pg, '.exlist label.kgw', D + TAG + '_03_weightbox_typed.png', 0, 40);
    const n = await pg.ev(`document.querySelectorAll('.exlist .setb button.sb[data-ex="${id}"]').length`);
    for (let k = 0; k < (j < 2 ? n : 1); k++) { await L.tapEl(pg, '.exlist .setb button.sb[data-ex="' + id + '"]', k); await sleep(250); await L.closeAll(pg); }
  }
  // bodyweight work (no weight box): one set
  const bw = await pg.ev(`[].map.call(document.querySelectorAll('.exlist .ex'),function(e){return e.querySelector('input.kg')?null:(e.querySelector('.setb button.sb')||{dataset:{}}).dataset.ex}).filter(Boolean)`);
  for (const id of bw) { await L.tapEl(pg, '.exlist .setb button.sb[data-ex="' + id + '"]', 0); await sleep(250); }
  const done = await pg.ev(`[].map.call(document.querySelectorAll('.exlist .ex'),function(e){var bx=[].map.call(e.querySelectorAll('.setb button.sb'),function(b){return b.getBoundingClientRect()});return e.querySelector('.exhead b').textContent+': '+[].map.call(e.querySelectorAll('.setb button.sb'),function(b){return b.innerText.replace(/\\s+/g,' ')}).join('|')+' rows='+new Set(bx.map(function(r){return Math.round(r.top)})).size+' overflow='+(bx.length&&Math.round(bx[bx.length-1].right)>Math.round(e.getBoundingClientRect().right))})`);
  done.forEach((x) => log('DONE SETS', x));
  await L.shotEl(pg, '.exlist .ex', D + TAG + '_04_card0_done.png', 0);
  await L.shotEl(pg, '.exlist .ex', D + TAG + '_05_card1_done.png', 1);
  // Finish workout, a real tap
  await L.closeAll(pg);
  await L.tapEl(pg, 'button[data-act=wkdone]'); await sleep(1500);
  const sum = await pg.ev(`(function(){var m=document.querySelector('#layer .modal .wksum');if(!m)return [].map.call(document.querySelectorAll('#layer .modal'),function(x){return x.innerText.slice(0,120)});var g=m.querySelector('svg.wkchart');
    return {text:m.innerText.replace(/\\s+/g,' ').slice(0,700),ranges:[].map.call(m.querySelectorAll('[data-wkrg]'),function(b){return b.textContent+(b.classList.contains('on')?'*':'')}).join('|'),pts:g?g.querySelectorAll('circle.wkdot').length:0,ringed:g?[].map.call(g.querySelectorAll('circle.wkdot.on'),function(c){return c.parentNode.querySelector('title').textContent}):[],x:g?[].map.call(g.querySelectorAll('text'),function(t){return t.textContent}).join(' '):''}})()`);
  log('SUMMARY', JSON.stringify(sum));
  await pg.shot(D + TAG + '_06_summary.png');
  await sleep(1200);
  const after = await sizes(pg); log('AFTER', JSON.stringify(after));
  await pg.ev(`(function(){var b=document.querySelector('#wksok');if(b)b.click();return 1})()`); await sleep(1500);
  log('after Done:', JSON.stringify(await L.modalInfo(pg)));
  await L.closeAll(pg); await L.nav(pg, 'train'); await sleep(1000);
  const rec = await pg.ev(`[].map.call(document.querySelectorAll('button.wkrow[data-act=wkinfo]'),function(b){return b.innerText.replace(/\\s+/g,' ')})`);
  log('RECENT after logging', JSON.stringify(rec));
  const pbs = await pg.ev(`[].map.call(document.querySelectorAll('button.wkbest'),function(b){return b.innerText.replace(/\\s+/g,' ')})`);
  log('PBs after logging (' + pbs.length + ')', JSON.stringify(pbs.slice(0, 40)));
  await pg.ev(`(function(){var b=document.querySelector('button.wkrow[data-act=wkinfo]');if(b)b.closest('section').id='qa_recent';return 1})()`);
  await L.shotEl(pg, '#qa_recent', D + TAG + '_07_recent_after.png');
  // reload: the history stays
  await pg.go(L.BASE + '/'); await pg.wait('!!(window.__qb && window.__qb.x && document.querySelector(".nav"))', 120000);
  await L.settle(pg, null, 6);
  log('AFTER RELOAD', JSON.stringify(await sizes(pg)));
  await L.nav(pg, 'train'); await sleep(1200); await L.closeAll(pg);
  log('RECENT after reload', JSON.stringify(await pg.ev(`[].map.call(document.querySelectorAll('button.wkrow[data-act=wkinfo]'),function(b){return b.innerText.replace(/\\s+/g,' ')})`)));
  log('page errors', pg.errs.length, JSON.stringify(pg.errs.slice(0, 6)));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
