// rc089 QA, Training W5 part 4b: do 4 done sets stay on one row in the workout list at 390 px? Back Squat (4 sets) with common weights.
const L = require('./rc089_train_lib.js');
const { sleep } = L;
const log = (...a) => console.log(...a);
(async () => {
  const { br, pg } = await L.openGame(L.seed('seed_adv2'));
  await L.settle(pg, null, 20);
  await L.nav(pg, 'train'); await sleep(1000); await L.closeAll(pg);
  await L.tapEl(pg, 'button.plan[data-act=wkplan][data-v="legs"]'); await sleep(1500);
  await pg.ev(`(function(){var x=document.querySelector('[data-ca="x"]');if(x)x.click();return 1})()`); await sleep(600); await L.closeAll(pg);
  const typeW = async (id, v) => { await L.tapEl(pg, '.exlist input.kg[data-ex="' + id + '"]'); await pg.ev(`(function(){var i=document.querySelector('.exlist input.kg[data-ex="${id}"]');i.focus();i.select();return 1})()`); await pg.s('Input.insertText', { text: String(v) }); await sleep(150); };
  const rows = (where) => pg.ev(`(function(){var e=document.querySelector('${where} .setb button.sb[data-ex="squat"]').closest('.setb');var bx=[].map.call(e.querySelectorAll('button.sb'),function(b){return b.getBoundingClientRect()});return {rows:new Set(bx.map(function(r){return Math.round(r.top)})).size,setbW:Math.round(e.getBoundingClientRect().width),boxW:bx.map(function(r){return Math.round(r.width)}).join(',')}})()`);
  for (const v of ['95', '135', '185', '225', '315', '405', '102.5', '137.5']) {
    await typeW('squat', v);
    for (let k = 0; k < 4; k++) { await L.tapEl(pg, '.exlist .setb button.sb[data-ex="squat"]', k); await sleep(150); await L.closeAll(pg); }
    const r = await rows('.exlist');
    const txt = await pg.ev(`[].map.call(document.querySelectorAll('.exlist .setb button.sb[data-ex="squat"]'),function(b){return b.innerText.replace(/\\s+/g,' ')}).join('|')`);
    log('list view', v, JSON.stringify(r), txt);
    if (v === '225') await L.shotEl(pg, '.exlist .ex', L.OUT + '/train/long_04_squat_4x225.png', 0);
    for (let k = 3; k >= 0; k--) { await L.tapEl(pg, '.exlist .setb button.sb[data-ex="squat"]', k); await sleep(120); } // undo
  }
  await L.tapEl(pg, 'button[data-act=wkcancel]'); await sleep(400);
  log('page errors', pg.errs.length, JSON.stringify(pg.errs.slice(0, 6)));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
