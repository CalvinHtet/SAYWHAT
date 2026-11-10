// The level effects' look on two builds side by side (Aurora band and embers on the Board): 3 frames 1.5 s apart each.
const fs = require('fs');
const { browser, sleep } = require('./cdp.js');
const SEED = JSON.parse(fs.readFileSync(process.env.SEED || 'C:/Users/clvh/qa-wt/out/seed_adv2.json', 'utf8'));
const OUT = process.env.OUT || 'C:/Users/clvh/qa-wt/out/rc090/fxlook'; fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const br = await browser();
  for (const [tag, base] of [['old', 'http://127.0.0.1:8810'], ['new', 'http://127.0.0.1:8819']]) {
    const pg = await br.page({ fresh: true });
    await pg.go(base + '/version.json'); await pg.ev(`(function(d){Object.keys(d).forEach(function(k){localStorage.setItem(k,d[k])});return 1})(${JSON.stringify(SEED)})`);
    await pg.go(base + '/'); await pg.wait('!!document.querySelector(".nav button[data-v=board]")', 120000); await sleep(3000);
    for (let k = 0; k < 6; k++) { await pg.ev(`(function(){document.querySelectorAll(".dropsplash .dsx").forEach(function(b){b.click()});document.querySelectorAll("#layer .modal").forEach(function(e){e.remove()});return 1})()`); await sleep(400); }
    const info = await pg.ev('(function(){var cv=[].filter.call(document.querySelectorAll("canvas"),function(c){return c.style.position==="fixed"})[0];return {body:document.body.className,embersCanvas:!!cv,aur:getComputedStyle(document.querySelector(".wrap"),"::before").animationName+" / "+getComputedStyle(document.querySelector(".wrap"),"::after").animationName}})()');
    console.log(tag + ': ' + JSON.stringify(info));
    for (let i = 0; i < 3; i++) { await pg.shot(`${OUT}/${tag}_${i}.png`, { x: 0, y: 0, width: 390, height: 520 }); await sleep(1500); }
    await pg.close();
  }
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
