// W1: makes a saved game for the load and runtime tests and writes this origin's whole localStorage to a JSON file, so another
// script can put it into a fresh profile before the app's first load (perfload.js SEED=<file>).
//   KIND=adv|heavy OUT=<file> BASE=http://127.0.0.1:8810 bash tools/windows/node.sh rigtest/qa/mkseed.js
// adv: an advanced player as rigtest/qa/lib.js makes one (every area open, level 60, every room and upgrade bought, coins).
// heavy: adv plus HEAVY.js's extras (hundreds of quests, a long Training history, a full Hall).
const fs = require('fs'), path = require('path');
const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8810', KIND = process.env.KIND || 'adv', OUT = process.env.OUT || 'C:/Users/clvh/qa-wt/out/seed_' + KIND + '.json';
const ORDER = ['bedroom', 'closet', 'lair', 'patio', 'gameroom', 'restaurant', 'skybar', 'rooftop', 'boba', 'dessert', 'speakeasy', 'garden', 'theater', 'auditorium', 'mall', 'bowling', 'karaoke', 'arcade', 'rhythm', 'vr', 'club'];
(async () => {
  const br = await browser();
  const pg = await br.page({ fresh: true });
  await pg.go(BASE + '/');
  await pg.wait('!!(window.__qb && window.__qb.x && window.QBLoft && document.querySelector("#app"))', 120000);
  await sleep(1500);
  // a character first (the creator's result), then the Test pill's "Unlock everything" and every room with every upgrade
  await pg.ev(`(function(){const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = Math.max(S.xp || 0, 10);
    S.welcomed = 1; x.persist(); x.render(); return 1 })()`);
  await sleep(800);
  console.log('unlock: ' + JSON.stringify(await pg.ev(`(function(){window.__qbRooms.unlockAll(); const x = window.__qb.x(), S = x.S;
    Object.keys(x.ADDONS).forEach(function(t){ if (S.base.slots.some(function(r){return r&&r.t===t})) window.__qbRooms.all(t, 1) });
    S.xp = x.cum(60); let g, n = 0; while ((g = (window.gated ? gated() : null)) !== null && n++ < 60) S.gates.push(g); S.coins = 999999;
    document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()}); x.persist(); x.render();
    return { lvl: x.effLvl(), rooms: S.base.slots.length, ups: S.base.slots.reduce(function(a,r){return a+Object.keys(r.a||{}).length},0), areaOn: Object.keys(S.areaOn||{}).length } })()`)));
  if (KIND === 'heavy') {
    const src = await (await fetch(BASE + '/app.js')).text(), exb = src.slice(src.indexOf('var EX={'), src.indexOf('var EX={') + 20000);
    const exk = [...exb.slice(0, exb.indexOf('};')).matchAll(/([a-z0-9_]+):\[/g)].map((m) => m[1]);
    await pg.ev('window.__EXK=' + JSON.stringify(exk) + ';1');
    const extra = fs.readFileSync(path.join(__dirname, 'heavy.js'), 'utf8');
    console.log('heavy: ' + JSON.stringify(await pg.ev(extra, 120000)));
  }
  await sleep(2500);
  await pg.ev('(function(){var x=window.__qb.x();x.persist();return 1})()');
  await sleep(1500);
  const dump = await pg.ev('(function(){var o={};for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);o[k]=localStorage.getItem(k)}return o})()');
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(dump));
  const sizes = Object.keys(dump).map((k) => k + ' ' + dump[k].length).sort();
  console.log('wrote ' + OUT + ': ' + Object.keys(dump).length + ' keys, ' + Math.round(JSON.stringify(dump).length / 1024) + ' KB');
  console.log('  ' + sizes.slice(0, 40).join('\n  '));
  console.log('page errors', pg.errs.length, pg.errs.slice(0, 3));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.message); process.exit(1); });
