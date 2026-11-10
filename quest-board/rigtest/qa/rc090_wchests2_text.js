// b543c04 re-check of the w-chests text fixes: no "300" on the Relics tab, the new hidden-chest line, "Milestone relics", buff lines
// with a capital, and the Perks figure with decimals.
const { open, log, nav, sleep } = require('./wchests_lib.js');
const L = log('text');
const PROBE = function () {
  var t = document.getElementById('app').innerText, lines = t.split(String.fromCharCode(10));
  var has = function (re) { return lines.filter(function (l) { return re.test(l); }); };
  return { has300: has(/(^|[^0-9,])300([^0-9]|$)/).slice(0, 6), hidden: has(/hidden chest/i), milestone: has(/Milestone relics|Relics /),
    lowerStart: lines.filter(function (l) { var s = l.trim(); return s.length > 12 && s[0] >= 'a' && s[0] <= 'z'; }).slice(0, 8) };
};
(async () => {
  const { br, pg } = await open({ lv: 30 });
  await nav(pg, 'trophy'); await sleep(1200);
  L(await pg.ev('(' + PROBE.toString() + ')()'));
  await pg.shot(require('path').join(process.env.OUT || '.', 'relics_tab_top.png'));
  await nav(pg, 'board'); await sleep(900);
  L(await pg.ev('(function(){return document.body.innerText.match(/Perks.{0,30}/g)})()'));
  L('page errors', pg.errs.length, pg.errs.slice(0, 5));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
