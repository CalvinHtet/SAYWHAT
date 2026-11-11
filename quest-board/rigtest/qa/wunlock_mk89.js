// Saves written by the shipped v0.89 (a246406, APPV 89) for the reset test: the v0.88 level-60 seed, and the same seed cut down to a
// mid-game Loft (Bedroom, Closet, Patio, Game Room, Garden, Restaurant), each opened on v0.89 so v0.89 writes them. Out: seeds/v89_<name>.json (already in the repo; rerun only to remake them)
//   BASE89=http://127.0.0.1:8819 CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/wunlock_mk89.js
const fs = require('fs');
const SEEDS = require('path').join(__dirname, 'seeds') + '/'; // saves in rigtest/qa/seeds (v0.88, v0.89, v0.90; test names only)
const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE89 || 'http://127.0.0.1:8819', OUT = process.env.OUT || SEEDS;
const SEED = JSON.parse(fs.readFileSync(SEEDS + 'v88_adv.json', 'utf8'));
const KEEP = ['bedroom', 'closet', 'patio', 'gameroom', 'garden', 'restaurant'];
(async () => {
  const br = await browser();
  for (const name of ['adv', 'mid']) {
    const d = JSON.parse(JSON.stringify(SEED));
    if (name === 'mid') for (const k of ['quest-board', 'qbsbx:data/users/sandbox/state']) { const s = JSON.parse(d[k]); s.base.slots = s.base.slots.map((r) => (r && KEEP.includes(r.t) ? r : null)); s.coins = 12345; d[k] = JSON.stringify(s); }
    const pg = await br.page({ fresh: true });
    await pg.go(BASE + '/version.json'); await pg.ev(`(function(d){localStorage.clear();Object.keys(d).forEach(function(k){localStorage.setItem(k,d[k])});return 1})(${JSON.stringify(d)})`);
    await pg.go(BASE + '/'); await pg.wait('!!(window.__qb && document.querySelector(".nav button[data-v=board]"))', 120000); await sleep(6000);
    await pg.ev('(function(){window.__qb.x().persist();return 1})()'); await sleep(1500);
    const ls = await pg.ev('(function(){var o={};Object.keys(localStorage).forEach(function(k){o[k]=localStorage.getItem(k)});return o})()');
    const s = JSON.parse(ls['quest-board']); fs.writeFileSync(OUT + `v89_${name}.json`, JSON.stringify(ls));
    console.log(name, 'appv', s.appv, 'rooms', s.base.slots.filter(Boolean).map((r) => r.t + '(' + Object.keys(r.a || {}).length + ')').join(' '), 'coins', s.coins, 'errors', pg.errs.length);
    await pg.close();
  }
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
