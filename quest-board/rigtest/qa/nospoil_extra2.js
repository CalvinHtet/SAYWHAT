// SPEC9 QA, two more targeted checks: the level-up window (a quest done without a photo), and the Mall's Karaoke card with every
// other Mall upgrade in. Read only on the game.
const fs = require('fs');
const { browser, sleep } = require('./cdp.js');
const { PAGE } = require('./nospoil_lib.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8815', OUT = process.env.OUT || 'C:/Users/clvh/qa-wt/out/nospoil';
const log = (s) => { console.log(s); fs.appendFileSync(OUT + '/extra.log', s + '\n'); };
let errs = 0;
(async () => {
  const br = await browser();
  async function open(stage) {
    const pg = await br.page({ fresh: true });
    const seed = JSON.parse(fs.readFileSync(`${OUT}/seed_${stage}.json`, 'utf8'));
    await pg.go(BASE + '/version.json'); await pg.ev(`(function(d){localStorage.clear();Object.keys(d).forEach(function(k){localStorage.setItem(k,d[k])});return 1})(${JSON.stringify(seed)})`);
    await pg.go(BASE + '/'); await pg.wait('!!(window.__qb && window.__qbStory && document.querySelector("#app") && !document.querySelector("#app .boot"))', 120000); await sleep(2000);
    await pg.ev(PAGE); await pg.ev('window.__ns.closeAll();1');
    pg.E = (f) => pg.ev(`(function(){var N=window.__ns;return (${f})})()`, 60000);
    return pg;
  }
  const done = async (pg) => { errs += pg.errs.length; if (pg.errs.length) log('  page errors: ' + pg.errs.join(' | ')); await pg.close(); };
  for (const [st, L] of [['g_boba', 10], ['e_garden', 6]]) {
    const pg = await open(st);
    await pg.E(`(function(){var x=N.X(),s=x.S;s.xp=x.cum(${L})-1;x.persist();x.render();return 1})()`);
    await pg.E('N.nav("board")'); await sleep(800);
    const r = await pg.ev(`(function(){var b=[].filter.call(document.querySelectorAll('[data-act="toggle"]'),function(e){return !e.closest(".done")})[0];if(!b)return "no quest";b.click();return "tapped "+b.dataset.id})()`);
    await sleep(800);
    const r2 = await pg.ev(`(function(){var b=[].filter.call(document.querySelectorAll("#layer button"),function(e){return /without a photo/i.test(e.innerText)})[0];if(!b)return "no proof window";b.click();return "done without a photo"})()`);
    await sleep(2500);
    log(`== level-up to ${L} from ${st} (${r}, ${r2}, level now ${await pg.E('N.X().effLvl()')}): ` + (await pg.E('N.modals()')).join(' ### ').replace(/\s+/g, ' ').slice(0, 1800));
    log('  pops: ' + (await pg.E('N.pops.splice(0)')).join(' | '));
    await pg.shot(`${OUT}/x_levelup_${L}.png`);
    await done(pg);
  }
  {
    const pg = await open('m_mall');
    log('== mall upgrades set: ' + await pg.E('N.setUps("mall",999)'));
    await pg.E('N.room("mall")'); await sleep(1500);
    log('  Mall cards: ' + await pg.E(`[].map.call(document.querySelectorAll("#layer .addon.next"),function(e){return e.innerText.replace(/\s+/g," ")}).join(" || ")`));
    await done(pg);
  }
  log('DONE2 page errors ' + errs);
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
