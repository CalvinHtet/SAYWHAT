// rc-0.89 smoke: a new player and an advanced player (seed) on every screen at 390x844: a picture of each, page errors, and any
// window that opens by itself. OUT pictures: smoke_<who>_<screen>.png
//   BASE=http://127.0.0.1:8811 SEED=<file> bash tools/windows/node.sh rigtest/qa/rc089_smoke.js
const fs = require('fs');
const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8811', OUT = process.env.OUT || 'C:/Users/clvh/qa-wt/out/rc089/smoke'; fs.mkdirSync(OUT, { recursive: true });
const SEED = process.env.SEED ? JSON.parse(fs.readFileSync(process.env.SEED, 'utf8')) : null;
const TABS = ['board', 'train', 'hideout', 'shop', 'hall', 'hall:chat', 'hall:rank', 'trophy', 'wheel', 'away', 'inbox'];
(async () => {
  const br = await browser();
  for (const who of ['new', 'advanced']) {
    const pg = await br.page({ fresh: true });
    if (who === 'advanced' && SEED) { await pg.go(BASE + '/version.json'); await pg.ev(`(function(d){localStorage.clear();Object.keys(d).forEach(function(k){localStorage.setItem(k,d[k])});return 1})(${JSON.stringify(SEED)})`); }
    await pg.go(BASE + '/'); await pg.wait('!!(window.__qb && document.querySelector("#app") && !document.querySelector("#app .boot"))', 120000); await sleep(2500);
    if (who === 'new') {
      await pg.shot(OUT + '/smoke_new_creator.png');
      // the creator's own result, then whatever the game opens for a first-day player
      await pg.ev(`(function(){var x=window.__qb.x(),S=x.S;S.created=true;S.char=window.__qb.fixChar({name:'Newbie',sex:'f'});x.persist();x.render();return 1})()`);
      await sleep(2500);
    }
    const log = [];
    const modals = async () => pg.ev('[].map.call(document.querySelectorAll("#layer .modal"),function(m){return m.innerText.slice(0,90).replace(/\\s+/g," ")}).join(" | ")');
    log.push('opened with: ' + ((await modals()) || 'no window'));
    await pg.shot(OUT + `/smoke_${who}_first.png`);
    for (let k = 0; k < 6 && (await pg.ev('document.querySelectorAll("#layer .modal").length')); k++) { // close what opened by itself, noting each
      await pg.ev('(function(){var m=document.querySelector("#layer .modal");var b=m&&m.querySelector("[data-act=mclose],.mclose,button");if(b)b.click();else if(m)m.remove();return 1})()'); await sleep(900);
      const t = await modals(); if (t) log.push('then: ' + t);
    }
    for (const t of TABS) {
      await pg.ev('(function(){document.querySelectorAll("#layer .modal").forEach(function(e){e.remove()});return 1})()');
      const [v, sub] = t.split(':');
      let r;
      if (v === 'inbox') r = await pg.ev('(function(){var b=document.querySelector(".ibbtn");if(!b)return "no envelope";b.click();return "opened, unread badge "+((b.querySelector("i")||{}).textContent||0)})()');
      else r = await pg.ev(`(function(){var b=document.querySelector('.nav button[data-v="${v}"]');if(!b)return 'no button';b.click();return (b.classList.contains('lk')?'locked: ':'')+(b.getAttribute('aria-label')||'')})()`);
      await sleep(1600);
      if (sub) { r += ' / ' + await pg.ev(`(function(){var b=document.querySelector('.htab button[data-t="${sub === 'rank' ? 'style' : sub}"]')||[].filter.call(document.querySelectorAll('#app button'),function(e){return (e.innerText||'').trim().toLowerCase().indexOf('${sub}')===0})[0];if(!b)return 'no ${sub} tab';b.click();return 'tab '+b.innerText.trim()})()`); await sleep(1600); }
      const env = await pg.ev('(function(){var b=document.querySelector(".ibbtn");return b?"envelope "+((b.querySelector("i")||{}).textContent||"0"):"NO ENVELOPE"})()');
      const pops = await modals();
      await pg.shot(OUT + `/smoke_${who}_${t.replace(':', '_')}.png`);
      log.push(`${t}: ${r}; ${env}${pops ? '; window: ' + pops : ''}`);
    }
    const tabsTxt = await pg.ev('(function(){var b=document.querySelector(".nav button[data-v=hall]");if(b)b.click();return 1})()').then(() => sleep(1200)).then(() => pg.ev('[].map.call(document.querySelectorAll(".htab button"),function(b){return b.innerText.trim()}).join(" | ")'));
    console.log(`== ${who}: Hall tabs: ${tabsTxt}`); log.forEach((l) => console.log('   ' + l));
    console.log('   page errors ' + pg.errs.length + (pg.errs.length ? ': ' + pg.errs.slice(0, 4).join(' | ') : ''));
    await pg.close();
  }
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
