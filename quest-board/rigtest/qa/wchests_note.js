// QA w-chests: a clean picture of the Relics tab's note that names the hidden 300 XP chest (29y_free.js:114).
const { open, log, nav, shotEl, sleep } = require('./wchests_lib.js');
const L = log('note');
(async () => {
  const { br, pg } = await open({ lv: 30 });
  await nav(pg, 'trophy'); await sleep(900);
  L(await pg.ev(`(function(){var n=[].filter.call(document.querySelectorAll('p.note'),function(p){return /Daily Quest chest/.test(p.innerText)})[0];if(!n)return null;n.closest('section').id='qa300';return n.innerText})()`));
  await shotEl(pg, '#qa300 h3', 'relics_300note_clean.png', 60, true);
  L('page errors', pg.errs.length, pg.errs.slice(0, 5));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
