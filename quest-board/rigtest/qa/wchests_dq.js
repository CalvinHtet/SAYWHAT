// QA w-chests check 1: the Daily Quest bar and the Board line at 0, 100, 150, 200, 250, 300, 400 XP, each chest's modal and pay,
// and a text scan for the hidden 300 anywhere on screen.
const { open, log, closeModals, shotEl, nav, sleep } = require('./wchests_lib.js');
const L = log('dq');
(async () => {
  const { br, pg } = await open({ lv: 30 });
  const S = (e) => pg.ev(`(function(){var x=window.__qb.x(),S=x.S;return (${e})})()`);
  L('start', await S(`{lvl:x.effLvl(),coins:S.coins,freezes:S.freezes,sp:JSON.stringify(S.sp),done:Object.keys(S.done||{}).length,dq:JSON.stringify(S.dq),xp:window.__qbEcon.xp()}`));
  // no quest XP today: only the Daily Quest's own counter
  await S(`(S.done={},S.cdone={},S.dq=null,window.__qbEcon.xp(),S.relics2={},x.persist(),x.render(),1)`);
  const state = async (tag) => {
    await closeModals(pg); await nav(pg, 'board'); await S('(x.render(),1)'); await sleep(500);
    const r = await pg.ev(`(function(){var b=document.querySelector('.bline');if(!b)return null;var is=b.querySelectorAll('.bl-bar i');
      return {line:b.innerText.replace(/\\s+/g,' '),fill:[].map.call(is,function(i){return i.className+':'+i.style.width})}})()`);
    await shotEl(pg, '.bline', `dq_${tag}_boardline.png`);
    // the profile's Daily Quest card
    await pg.ev(`(function(){var b=document.querySelector('.bline');if(b)b.click();return 1})()`); await sleep(700);
    const c = await pg.ev(`(function(){var d=document.querySelector('section.dq');if(!d)return null;return {txt:d.innerText.replace(/\\s+/g,' ').slice(0,400),fill:[].map.call(d.querySelectorAll('.dq-bar i'),function(i){return i.className+':'+i.style.width})}})()`);
    await shotEl(pg, 'section.dq', `dq_${tag}_card.png`);
    const scan = await pg.ev(`(function(){var t=document.body.innerText;var m=t.match(/.{0,50}\\b(300|400)\\b.{0,50}/g)||[];return m.map(function(s){return s.replace(/\\s+/g,' ')})})()`);
    L(tag, { board: r, card: c, mentions300or400: scan });
    await closeModals(pg); await nav(pg, 'board');
  };
  const step = async (tx, tag, expectChest) => {
    const before = await S(`{coins:S.coins,freezes:S.freezes,int:(S.sp||{}).int,rel:Object.keys(S.relics2||{}),owned:Object.keys(S.owned).length}`);
    await S(`(window.__qbEcon.xp(),S.dq.tx=${tx},x.persist(),1)`);
    let modal = null;
    try { await pg.wait('!!document.querySelector("#layer .dqc")', expectChest ? 9000 : 9000); } catch (e) {}
    modal = await pg.ev(`(function(){var m=document.querySelector('#layer .dqc');return m?m.innerText.replace(/\\s+/g,' '):null})()`);
    if (modal) await shotEl(pg, '#layer .dqc', `dq_${tag}_chest.png`);
    const after = await S(`{coins:S.coins,freezes:S.freezes,int:(S.sp||{}).int,rel:Object.keys(S.relics2||{}),owned:Object.keys(S.owned).length,dq:JSON.stringify(S.dq),eff:window.__qbEcon.eff()}`);
    L(tag + ' chest', { tx, modal, coinsDelta: after.coins - before.coins, freezes: [before.freezes, after.freezes], int: [before.int, after.int], newRelics: after.rel.filter((r) => before.rel.indexOf(r) < 0), ownedDelta: after.owned - before.owned, dq: after.dq });
    await state(tag);
  };
  await state('0');
  await step(100, '100', true);
  await step(150, '150', false);
  await step(200, '200', true);
  await step(250, '250', false);
  await step(300, '300', true);
  await step(400, '400', false);
  await step(1000, '1000', false);
  // tomorrow: the hidden chest's +10%
  const hidFor = await S('S.dq.hidFor');
  await pg.ev('(function(){window.__qbShift=(window.__qbShift||0)+864e5;return 1})()'); await sleep(500);
  L('tomorrow', await S(`{hidFor:${JSON.stringify(hidFor)},dq:JSON.stringify(window.__qbEcon.xp()!==null&&S.dq),eff0:window.__qbEcon.eff()}`));
  await S(`(window.__qbEcon.xp(),S.dq.tx=150,1)`);
  L('tomorrow at 150 XP: eff (expect 1.1)', await S('window.__qbEcon.eff()'));
  // XP preview on a quest today (the +10% should be in the perks)
  L('quest mults tomorrow', await S(`(function(){var q=S.quests.filter(function(q){return q.xp>=20})[0];var m=x.mults(Object.assign({},q,{xp:1000}),{});return {q:q.name,cl:q.cl,xp:m.xp,tags:m.tags}})()`));
  // the Relics tab's text
  await closeModals(pg); await nav(pg, 'trophy'); await sleep(800);
  L('relics tab mentions', await pg.ev(`(function(){var t=document.body.innerText;return (t.match(/.{0,60}\\b(300|400)\\b.{0,40}/g)||[]).map(function(s){return s.replace(/\\s+/g,' ')})})()`));
  await shotEl(pg, '.r2-grid', 'dq_relicsnote.png');
  await pg.ev(`(function(){var n=[].filter.call(document.querySelectorAll('p.note'),function(p){return /Daily Quest chest/.test(p.innerText)})[0];if(n)n.setAttribute('id','qa300');return !!n})()`);
  await shotEl(pg, '#qa300', 'dq_relics_300note.png', 40);
  L('page errors', pg.errs.length, pg.errs.slice(0, 5));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
