// SPEC9 QA, targeted checks from the playthrough's saved stages (seed_<stage>.json): the Restaurant's Upstairs Bar card before and
// after the Dessert Parlor, a tab waiting for its day, the Theater's door buttons, an early Trophy Room, the level-up window, and
// relic pops before the Relics tab. Read only on the game.
//   CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/nospoil_extra.js
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
  const card = (pg) => pg.E(`(function(){var c=[].filter.call(document.querySelectorAll("#layer .addon"),function(e){return / stynext| mystery/.test(" "+e.className)||/Upstairs Bar/.test(e.innerText)});return c.map(function(e){return e.className+": "+e.innerText.replace(/\\s+/g," ")}).join(" || ")})()`);

  // 1. the Upstairs Bar card (r_bar opens Lock and Key) with every other Restaurant upgrade in: before the Dessert Parlor, then after
  for (const st of ['g_boba', 'h_dessert']) {
    const pg = await open(st);
    log(`== ${st}: restaurant upgrades set: ` + await pg.E('N.setUps("restaurant",999)'));
    await pg.E('N.room("restaurant")'); await sleep(1500);
    log(`  [${st}] Restaurant cards: ` + await card(pg));
    if (st === 'g_boba') await pg.shot(`${OUT}/x_rbar_before_dessert.png`);
    await done(pg);
  }
  // 2. a tab whose level is reached but waits for its day (the Wheel at 6, from a level 3 save)
  {
    const pg = await open('f_restaurant');
    await pg.E('(function(){var x=N.X(),s=x.S;s.xp=x.cum(6);var g,n=0;while((g=x.gated())!==null&&n++<80)s.gates.push(g);delete s.areaOn.wheel;s.unlockDay=x.S.unlockDay;x.persist();x.render();return x.effLvl()})()');
    await pg.ev('(function(){var x=window.__qb.x();x.S.unlockDay=new Date().toISOString().slice(0,10);return 1})()');
    await pg.E('N.nav("board")'); await sleep(800);
    log('== waiting tab (level ' + await pg.E('N.X().effLvl()') + ', waiting: ' + await pg.ev('window.__qbUnlock.waiting("wheel")') + '): ' + (await pg.E('N.navInfo()')).join(' || '));
    log('  tap: ' + await pg.E('N.nav("wheel")')); await sleep(300); log('  pops: ' + (await pg.E('N.pops.splice(0)')).join(' | '));
    await pg.shot(`${OUT}/x_waiting_tab.png`, { x: 0, y: 700, width: 390, height: 144 });
    await done(pg);
  }
  // 3. the Theater lobby's door before the Auditorium: tap it as a player does
  {
    const pg = await open('o_theater');
    await pg.E('N.room("theater")'); await sleep(1800);
    const r = await pg.E(`(function(){var o=[];["thdoorlock","gotoaud"].forEach(function(a){var b=document.querySelector("#layer [data-act="+a+"]");o.push(a+": "+(b?b.tagName:"absent"));if(b)b.dispatchEvent(new MouseEvent("click",{bubbles:true}))});return o.join(", ")})()`);
    await sleep(300); log('== theater doors: ' + r + '; pops: ' + (await pg.E('N.pops.splice(0)')).join(' | '));
    await pg.shot(`${OUT}/x_theater_lobby.png`);
    await done(pg);
  }
  // 4. an early Trophy Room: the first piece (a Regalia piece from the Mossy Cellar) at level 2, the room built, its help; then the
  //    same with an Amulet shard as the first piece
  for (const first of ['goblin:greaves', 'amulet:dusk']) {
    const pg = await open('d_lair');
    const [set, id] = first.split(':');
    await pg.E(`(function(){var s=N.X().S;s.trophy={};s.trophy["${set}"]={"${id}":Date.now()};N.X().persist();N.X().render();return 1})()`);
    await pg.E('N.room("lair")'); await sleep(1500);
    log(`== first piece ${first}, level ${await pg.E('N.X().effLvl()')}: Lair cards: ` + (await pg.E('N.modals()')).join(' ').replace(/\s+/g, ' ').replace(/.*NEXT UPGRADES/, 'NEXT UPGRADES').slice(0, 500));
    await pg.E('(function(){window.__qbRooms.open("trophy",1);N.X().persist();N.X().render();return 1})()');
    await pg.E('N.room("trophy")'); await sleep(1500);
    log('  Trophy Room window: ' + (await pg.E('N.modals()')).join(' ').replace(/\s+/g, ' ').slice(0, 700));
    log('  Trophy Room help: ' + String(await pg.E('N.help()')).replace(/\s+/g, ' '));
    log('  nav: ' + (await pg.E('N.navInfo()')).filter((x) => /Relics|level 8/.test(x)).join(' || '));
    await done(pg);
  }
  // 5. the level-up window: a level 9 save one XP short of 10, then a quest done
  {
    const pg = await open('g_boba');
    const q = await pg.E('(function(){var x=N.X(),s=x.S;s.xp=x.cum(10)-1;x.persist();x.render();var q=s.quests.filter(function(q){return !s.done[q.id]})[0];return q?q.id:null})()');
    await pg.E('N.nav("board")'); await sleep(800);
    const r = await pg.ev(`(function(){var b=document.querySelector('[data-act="toggle"][data-id="${q}"]');if(!b)return "no toggle for ${q}";b.click();return "done ${q}"})()`);
    await sleep(2500); log('== level-up (' + r + ', level now ' + await pg.E('N.X().effLvl()') + '): ' + (await pg.E('N.modals()')).join(' ### ').replace(/\s+/g, ' ').slice(0, 1500));
    log('  pops: ' + (await pg.E('N.pops.splice(0)')).join(' | '));
    await pg.shot(`${OUT}/x_levelup.png`);
    await done(pg);
  }
  log('DONE page errors ' + errs);
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
