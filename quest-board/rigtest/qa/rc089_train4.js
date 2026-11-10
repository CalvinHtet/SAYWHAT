// rc089 QA, Training W5 part 4: long numbers in the weight box and the set boxes at 390 px (4 sets on one row): 137.5 lbs on the
// Back Squat (4 sets), 1005 lbs on the Leg Press, 7.5 and 4 on single digits. Measures the gap between the digits and the unit
// (canvas text width in the input's own font) and whether a done set box's text fits (scrollWidth > clientWidth).
const L = require('./rc089_train_lib.js');
const { sleep } = L;
const D = L.OUT + '/train/long_';
const log = (...a) => console.log(...a);
(async () => {
  const { br, pg } = await L.openGame(L.seed('seed_adv2'));
  log('windows on load (closed)', (await L.settle(pg, null, 20)).seen.length);
  await L.nav(pg, 'train'); await sleep(1000); await L.closeAll(pg);
  await L.tapEl(pg, 'button.plan[data-act=wkplan][data-v="legs"]'); await sleep(1500);
  await pg.ev(`(function(){var x=document.querySelector('[data-ca="x"]');if(x)x.click();return 1})()`); await sleep(600); await L.closeAll(pg);
  const box = (id) => pg.ev(`(function(){var i=document.querySelector('.exlist input.kg[data-ex="${id}"]');var sp=i.closest('label').querySelector('span');var cs=getComputedStyle(i);var c=document.createElement('canvas').getContext('2d');c.font=cs.fontWeight+' '+cs.fontSize+' '+cs.fontFamily;
    var ir=i.getBoundingClientRect(),sr=sp.getBoundingClientRect(),tw=c.measureText(i.value).width,textEnd=ir.left+parseFloat(cs.paddingLeft)+parseFloat(cs.borderLeftWidth)+tw;
    return {val:i.value,inputW:Math.round(ir.width),textW:Math.round(tw),visibleGap:Math.round(sr.left-textEnd),unit:sp.textContent,align:cs.textAlign,labelW:Math.round(i.closest('label').getBoundingClientRect().width)}})()`);
  const typeW = async (id, v) => { await L.tapEl(pg, '.exlist input.kg[data-ex="' + id + '"]'); await pg.ev(`(function(){var i=document.querySelector('.exlist input.kg[data-ex="${id}"]');i.focus();i.select();return 1})()`); await pg.s('Input.insertText', { text: String(v) }); await sleep(200); };
  for (const [id, vals] of [['squat', ['4', '20', '135', '137.5']], ['legpress', ['1005']], ['rdl', ['7.5']]]) {
    for (const v of vals) { await typeW(id, v); log('weight box', id, JSON.stringify(await box(id))); }
    if (id === 'squat') await L.shotEl(pg, '.exlist label.kgw', D + '01_box_137.5.png', 0, 30);
    const n = await pg.ev(`document.querySelectorAll('.exlist .setb button.sb[data-ex="${id}"]').length`);
    for (let k = 0; k < n; k++) { await L.tapEl(pg, '.exlist .setb button.sb[data-ex="' + id + '"]', k); await sleep(250); await L.closeAll(pg); }
    const fit = await pg.ev(`[].map.call(document.querySelectorAll('.exlist .setb button.sb[data-ex="${id}"]'),function(b){var r=b.getBoundingClientRect();return b.innerText.replace(/\\s+/g,' ')+' top='+Math.round(r.top)+' w='+b.clientWidth+' sw='+b.scrollWidth+(b.scrollWidth>b.clientWidth?' OVERFLOW':'')})`);
    log('done boxes', id, JSON.stringify(fit));
    const ei = await pg.ev(`[].findIndex.call(document.querySelectorAll('.exlist .ex'),function(e){return !!e.querySelector('[data-ex="${id}"]')})`);
    await L.shotEl(pg, '.exlist .ex', D + '02_' + id + '_done.png', ei);
  }
  // the guided session view of the same: weight box and boxes on one row
  await L.tapEl(pg, 'button[data-act=wkcoach]'); await sleep(1200);
  log('coach row', JSON.stringify(await pg.ev(`(function(){var c=document.querySelector('.cinner');return [].map.call(c.querySelectorAll('.exrow > *'),function(e){var r=e.getBoundingClientRect();return e.className+'@'+Math.round(r.top)+':'+Math.round(r.left)+'-'+Math.round(r.right)})})()`)));
  await pg.shot(D + '03_coach_squat_done.png');
  await pg.ev(`(function(){var x=document.querySelector('[data-ca="x"]');if(x)x.click();return 1})()`); await sleep(600);
  await L.tapEl(pg, 'button[data-act=wkcancel]'); await sleep(400);
  log('page errors', pg.errs.length, JSON.stringify(pg.errs.slice(0, 6)));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
