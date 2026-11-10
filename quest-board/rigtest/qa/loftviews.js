// The Loft's street and building views on several builds side by side (after the floorsOpen name clash, w-floors 2622938):
// for each BASE, an advanced save: the street, then each building (bldgo 0..2), one picture each, plus a quick pixel hash.
//   BASES=http://127.0.0.1:8816,http://127.0.0.1:8819,http://127.0.0.1:8815 bash tools/windows/node.sh rigtest/qa/loftviews.js
const fs = require('fs'), crypto = require('crypto');
const { browser, sleep } = require('./cdp.js');
const BASES = (process.env.BASES || 'http://127.0.0.1:8816,http://127.0.0.1:8815').split(',');
const OUT = process.env.OUT || 'C:/Users/clvh/qa-wt/out/loftviews'; fs.mkdirSync(OUT, { recursive: true });
const SEED = JSON.parse(fs.readFileSync('C:/Users/clvh/qa-wt/out/seed_adv2.json', 'utf8'));
(async () => {
  const br = await browser();
  for (const base of BASES) {
    const tag = base.split(':').pop();
    const pg = await br.page({ fresh: true });
    await pg.go(base + '/version.json'); await pg.ev(`(function(d){Object.keys(d).forEach(function(k){localStorage.setItem(k,d[k])});return 1})(${JSON.stringify(SEED)})`);
    await pg.go(base + '/'); await pg.wait('!!document.querySelector(".nav button[data-v=board]")', 120000); await sleep(2500);
    const clear = () => pg.ev('(function(){document.querySelectorAll(".dropsplash .dsx").forEach(function(b){b.click()});document.querySelectorAll("#layer .modal").forEach(function(e){e.remove()});return 1})()');
    for (let k = 0; k < 6; k++) { await clear(); await sleep(300); }
    await pg.ev('(function(){var b=document.querySelector(".nav button[data-v=hideout]");b&&b.click();return 1})()'); await sleep(3500); await clear();
    const views = [['street', null], ['bldg0', 0], ['bldg1', 1], ['bldg2', 2]];
    const info = [];
    for (const [name, v] of views) {
      if (v !== null) { await pg.ev(`(function(){var b=document.querySelector('[data-act=bldout]');if(b)b.dispatchEvent(new MouseEvent('click',{bubbles:true}));return 1})()`); await sleep(1200);
        const ok = await pg.ev(`(function(){var b=document.querySelector('[data-act=bldgo][data-v="${v}"]');if(!b)return false;b.dispatchEvent(new MouseEvent('click',{bubbles:true}));return true})()`); if (!ok) { info.push(name + ': no button'); continue; } await sleep(3000); await clear(); }
      for (let k = 0; k < 3; k++) { await clear(); await sleep(400); }
      const file = `${OUT}/${tag}_${name}.png`; await pg.shot(file);
      const d = await pg.ev('(function(){var s=document.getElementById("lfsvg");var b=s&&s.getBBox?s.getBBox():null;return {rooms:document.querySelectorAll("#lfsvg [data-slot],#lfsvg .lfroom").length,svgH:b?Math.round(b.height):0,svgW:b?Math.round(b.width):0}})()');
      info.push(name + ' ' + JSON.stringify(d) + ' hash ' + crypto.createHash('md5').update(fs.readFileSync(file)).digest('hex').slice(0, 8));
    }
    console.log(tag + ': ' + info.join(' | ') + ' | page errors ' + pg.errs.length + (pg.errs.length ? ' ' + pg.errs.slice(0, 2).join(' / ') : ''));
    await pg.close();
  }
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
