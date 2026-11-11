// w-trainw (BUILDER 17:44): the Training weight box keeps the weight just saved. Last session logged 100 lb on every set of the first
// weighted exercise; today: type 140, save set 1 -> the box shows 140 (not last week's 100); type 145, save set 2 -> 145; a reload
// mid-session keeps 145; finish, and the next session starts at 145. Each set box keeps its "last N" hint. Real taps and typing.
//   BASE=http://127.0.0.1:8813 CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/wtrainw.js
const fs = require('fs');
const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8813', OUT = process.env.OUT || require('os').tmpdir() + '/qa-out/wtrainw/', PLAN = process.env.PLAN || 'push';
const W1 = process.env.W1 || '140', W2 = process.env.W2 || '145', LAST = +(process.env.LAST || 100), EXID = process.env.EXID || ''; // EXID=pushdown (push's Superset A); CEX=1 adds an own workout in miles (PLAN=c_cardio EXID=cx_1 W1=3.5 W2=4 LAST=2)
fs.mkdirSync(OUT, { recursive: true });
const log = (...a) => console.log(a.map((v) => (typeof v === 'string' ? v : JSON.stringify(v))).join(' '));
(async () => {
  const br = await browser(); const pg = await br.page({ fresh: true });
  const ready = async () => { await pg.wait('!!(window.__qb && window.__qb.x && window.__qb.x().S && document.querySelector(".nav button[data-v=board]"))', 120000); await sleep(1500);
    for (let k = 0; k < 4; k++) { await pg.ev('(function(){document.querySelectorAll(".dropsplash .dsx").forEach(function(b){b.click()});document.querySelectorAll("#layer .modal").forEach(function(e){e.remove()});return 1})()'); await sleep(250); } };
  const tap = async (sel, i = 0) => { const r = await pg.ev(`(function(){var e=document.querySelectorAll('${sel}')[${i}];if(!e)return null;e.scrollIntoView({block:'center'});var b=e.getBoundingClientRect();return [b.left+b.width/2,b.top+b.height/2]})()`);
    if (!r) return false; await sleep(150); for (const type of ['mousePressed', 'mouseReleased']) await pg.s('Input.dispatchMouseEvent', { type, x: r[0], y: r[1], button: 'left', clickCount: 1 }); return true; };
  const type = async (id, v) => { await tap(`.exlist input.kg[data-ex="${id}"]`); await pg.ev(`(function(){var i=document.querySelector('.exlist input.kg[data-ex="${id}"]');i.focus();i.select();return 1})()`);
    await pg.s('Input.insertText', { text: String(v) }); await sleep(200); };
  const box = (id) => pg.ev(`(function(){var i=document.querySelector('.exlist input.kg[data-ex="${id}"]');var e=i&&i.closest('.ex');return {box:i?i.value:null,
    sets:e?[].map.call(e.querySelectorAll('.setb button.sb'),function(b){return b.innerText.replace(/\\s+/g,' ').trim()}):[],saved:JSON.stringify((window.__qb.x().S.wk.sets||{})['${id}']||[])}})()`);
  await pg.go(BASE + '/'); await pg.wait('!!(window.__qb && document.querySelector("#app") && !document.querySelector("#app .boot"))', 120000); await sleep(2500);
  await pg.ev(`(function(){var x=window.__qb.x(),S=x.S;S.created=true;S.welcomed=1;S.char=window.__qb.fixChar({name:'Lift',sex:'m'});x.persist();x.render();return 1})()`); await ready();
  // the plan, then the first weighted exercise of the session (the plan button tapped; clicked if the tap didn't take)
  const openPlan = async () => {
    await pg.ev('(function(){var b=document.querySelector(".nav button[data-v=train]");b&&b.click();return 1})()'); await sleep(1200);
    for (let k = 0; k < 6; k++) {
      if (await pg.ev('!!document.querySelector(".exlist input.kg")')) break;
      if (k === 0) await tap(`button.plan[data-act=wkplan][data-v="${PLAN}"]`); else await pg.ev(`(function(){var b=document.querySelector('button.plan[data-act=wkplan][data-v="${PLAN}"]');b&&b.click();return 1})()`);
      await sleep(1500); await pg.ev('(function(){var x=document.querySelector(\'[data-ca="x"]\');if(x)x.click();return 1})()'); await sleep(600); } };
  if (process.env.CEX) { // an own workout in miles (S.cex, as the Training "add your own" box makes it), then a reload so the game loads it
    await pg.ev('(function(){var x=window.__qb.x(),S=x.S;S.cex={cx_1:{n:"Easy Run",p:"Cardio",u:"mi",sets:3,t:"",step:.5,ic:"R",st:"vit"}};S.cexN=1;x.persist();return 1})()'); await sleep(1500);
    await pg.go(BASE + '/'); await ready(); }
  await openPlan();
  const id = EXID || await pg.ev('(function(){var i=document.querySelector(".exlist input.kg");return i?i.dataset.ex:null})()');
  if (!id) { log('no weighted exercise in the plan'); await br.close(); process.exit(1); }
  // last session: 100 on every set (yesterday), so the old rule would put set 2 back to 100
  await pg.ev(`(function(){var x=window.__qb.x(),S=x.S,d=new Date(Date.now()-864e5).toISOString().slice(0,10);S.gymlog=S.gymlog||{};S.gymlog['${id}']=[{d:d,w:${LAST},ws:[${LAST},${LAST},${LAST},${LAST}],r:8}];x.persist();x.render();return 1})()`); await sleep(800);
  log('exercise', id, '| unit', await pg.ev(`(function(){var l=document.querySelector('.exlist input.kg[data-ex="${id}"]').closest('label');return l.innerText.trim()})()`), '| start', await box(id));
  await type(id, W1); await pg.ev(`(function(){var b=document.querySelectorAll('.exlist .setb button.sb[data-ex="${id}"]')[0];b.click();return 1})()`); await sleep(600);
  const b1 = await box(id); log('1. typed ' + W1 + ', saved set 1 ->', b1, b1.box === W1 ? 'OK' : 'FAIL (want ' + W1 + ')');
  await type(id, W2); await pg.ev(`(function(){var b=document.querySelectorAll('.exlist .setb button.sb[data-ex="${id}"]')[1];b.click();return 1})()`); await sleep(600);
  const b2 = await box(id); log('2. typed ' + W2 + ', saved set 2 ->', b2, b2.box === W2 ? 'OK' : 'FAIL (want ' + W2 + ')');
  await pg.shot(OUT + 'session_sets12.png');
  await sleep(2500); await pg.go(BASE + '/'); await ready(); await pg.ev('(function(){var b=document.querySelector(".nav button[data-v=train]");b&&b.click();return 1})()'); await sleep(1500);
  await pg.ev('(function(){var x=document.querySelector(\'[data-ca="x"]\');if(x)x.click();return 1})()'); await sleep(500);
  const b3 = await box(id); log('3. after a reload mid-session ->', b3, b3.box === W2 ? 'OK' : 'FAIL (want ' + W2 + ')');
  // finish the workout, then the next session the next day
  await tap('button[data-act=wkdone]'); await sleep(1500); await pg.ev('(function(){var b=document.querySelector("#wksok");if(b)b.click();document.querySelectorAll("#layer .modal").forEach(function(e){e.remove()});return 1})()'); await sleep(800);
  log('   last log for the exercise:', await pg.ev(`JSON.stringify((window.__qb.x().S.gymlog['${id}']||[]).slice(-1))`));
  await pg.ev('(function(){var real=Date.now()-(window.__qbShift||0);window.__qbShift=(window.__qbShift||0)+864e5;window.__qb.x().persist();return 1})()');
  await pg.go(BASE + '/'); await ready(); await openPlan();
  const b4 = await box(id); log('4. the next session (a day later) ->', b4, b4.box === W2 ? 'OK' : 'FAIL (want ' + W2 + ')');
  await pg.shot(OUT + 'next_session.png');
  log('page errors', pg.errs.length, pg.errs.slice(0, 3));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
