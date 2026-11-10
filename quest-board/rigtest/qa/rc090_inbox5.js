// rc-0.90 inbox: the Shop's + and envelope are added by a regex on the Shop header (29x_inbox.js: <b>(\d+)</b>). Probe totals that
// regex does not take (a fraction, a negative) to see whether the Shop then loses its envelope. No OUT pictures.
//   CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/rc090_inbox5.js
const { browser } = require('./cdp.js');
const L = require('./rc090_inbox_lib.js');
const { sleep } = L;
(async () => {
  const br = await browser();
  const pg = await L.boot(br, { settle: 1500 });
  for (let k = 0; k < 8; k++) { await L.closeAll(pg); await sleep(400); }
  await L.tapSel(pg, '.nav button[data-v="shop"]'); await sleep(2000); await L.closeAll(pg);
  for (const c of [1000, 1000.5, -5, 0]) {
    await L.S(pg, `(S.coins=${c}, x.render(), 1)`); await sleep(700);
    console.log(`coins ${c}: ` + JSON.stringify(await pg.ev('(function(){var c=document.querySelector(".qs-cbar");var h=document.querySelector(".qs-top .qs-coin");return {cbar:!!c,envelope:!!(c&&c.querySelector(".ibbtn")),plus:!!(c&&c.querySelector(".kdbtn")),pill:h?h.textContent:"none",anyVisibleEnvelope:[].some.call(document.querySelectorAll(".ibbtn"),function(b){return b.getBoundingClientRect().width>0})}})()')));
  }
  console.log('page errors ' + pg.errs.length + (pg.errs.length ? ': ' + pg.errs.slice(0, 3).join(' | ') : ''));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
