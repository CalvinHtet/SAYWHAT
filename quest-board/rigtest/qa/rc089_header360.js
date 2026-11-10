// rc-0.89: the header at 360 px wide (BUILDER, w-inbox: coins, +, envelope and the rank pill on one line), advanced and new player.
//   BASE=http://127.0.0.1:8811 SEED=<file> bash tools/windows/node.sh rigtest/qa/rc089_header360.js
const fs = require('fs');
const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8811', OUT = 'C:/Users/clvh/qa-wt/out/rc089/smoke';
const SEED = process.env.SEED ? JSON.parse(fs.readFileSync(process.env.SEED, 'utf8')) : null;
(async () => {
  const br = await browser();
  for (const w of [360, 390]) {
    const pg = await br.page({ fresh: true, width: w, height: 780 });
    if (SEED) { await pg.go(BASE + '/version.json'); await pg.ev(`(function(d){Object.keys(d).forEach(function(k){localStorage.setItem(k,d[k])});return 1})(${JSON.stringify(SEED)})`); }
    await pg.go(BASE + '/'); await pg.wait('!!document.querySelector(".nav button[data-v=board]")', 120000); await sleep(3000);
    await pg.ev('(function(){document.querySelectorAll("#layer .modal,.dropsplash").forEach(function(e){e.remove()});return 1})()'); await sleep(500);
    const r = await pg.ev(`(function(){var q=function(s){var e=document.querySelector(s);if(!e)return null;var b=e.getBoundingClientRect();return {l:Math.round(b.left),r:Math.round(b.right),t:Math.round(b.top),b:Math.round(b.bottom)}};
      var coin=document.querySelector('.ibbtn')&&document.querySelector('.ibbtn').previousElementSibling;
      return JSON.stringify({env:q('.ibbtn'),plus:coin?(function(){var b=coin.getBoundingClientRect();return {l:Math.round(b.left),r:Math.round(b.right),t:Math.round(b.top)}})():null,
        overflowX:document.documentElement.scrollWidth>innerWidth, sw:document.documentElement.scrollWidth})})()`);
    await pg.shot(`${OUT}/header_${w}.png`, { x: 0, y: 0, width: w, height: 260 });
    console.log(w + ' px: ' + r);
    await pg.close();
  }
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
