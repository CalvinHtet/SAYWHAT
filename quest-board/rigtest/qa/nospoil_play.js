// SPEC9 (no spoilers) QA playthrough: a fresh save stepped through the story to the Mall (and a little past it, for the Theater,
// Auditorium and Arcade texts), capturing every tab, room window, help, splash, scene, team card, relic and Crawls list at each
// stage, then flagging any name of something the player does not have yet. Read only on the game.
//   CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/nospoil_play.js        (FROM=<stage> SEED=<file> to resume)
const fs = require('fs');
const { browser, sleep } = require('./cdp.js');
const { srcNames, spoilerHits, PAGE } = require('./nospoil_lib.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8815', OUT = process.env.OUT || 'C:/Users/clvh/qa-wt/out/nospoil';
fs.mkdirSync(OUT, { recursive: true });
const NAMES = srcNames();
const LOG = OUT + '/play.log', JL = OUT + '/stages.jsonl';
const log = (s) => { console.log(s); fs.appendFileSync(LOG, s + '\n'); };
const TABS = ['board', 'train', 'hideout', 'shop', 'hall', 'trophy', 'wheel', 'away'];

(async () => {
  const br = await browser();
  const pg = await br.page({ fresh: true });
  const E = (f) => pg.ev(`(function(){var N=window.__ns;return (${f})})()`, 60000);
  const seed = process.env.SEED ? JSON.parse(fs.readFileSync(process.env.SEED, 'utf8')) : null;
  if (seed) { await pg.go(BASE + '/version.json'); await pg.ev(`(function(d){localStorage.clear();Object.keys(d).forEach(function(k){localStorage.setItem(k,d[k])});return 1})(${JSON.stringify(seed)})`); }
  await pg.go(BASE + '/');
  await pg.wait('!!(window.__qb && window.__qbStory && document.querySelector("#app") && !document.querySelector("#app .boot"))', 120000); await sleep(2500);
  await pg.ev(PAGE);
  if (!seed) await pg.ev(`(function(){var x=window.__qb.x(),S=x.S;S.created=true;S.char=window.__qb.fixChar({name:'Pat',sex:'f'});x.persist();x.render();return 1})()`);
  await sleep(2000);

  const allHits = [];
  async function scan(stage, where, text) {
    if (!text) return;
    const st = await E('N.state()');
    const h = spoilerHits(text, st, NAMES, stage + ' / ' + where);
    h.forEach((x) => { allHits.push(x); fs.appendFileSync(OUT + '/hits.jsonl', JSON.stringify(x) + String.fromCharCode(10)); });
    return h.length;
  }
  async function autoModals(stage, why) {
    const m = await E('N.modals()'); const c = await E('N.closeAll()');
    const all = [].concat(c, m).filter(Boolean);
    for (const t of all) { log(`  [${stage}] window (${why}): ${t.replace(/\s+/g, ' ').slice(0, 600)}`); await scan(stage, 'window ' + why, t); }
    return all;
  }
  async function pops(stage) { const p = await E('N.pops.splice(0)'); for (const t of p) { log(`  [${stage}] pop: ${t}`); await scan(stage, 'pop', t); } }

  async function capture(stage, opt = {}) {
    log(`== ${stage}: ` + JSON.stringify(await E('(function(){var s=N.state();return {lvl:s.lvl,rooms:s.rooms,team:s.team,coins:s.coins,earned:s.earned,brands:s.brandsLive,relics2:s.relics2}})()')));
    const rec = { stage, nav: null, tabs: {}, rooms: {}, helps: {} };
    await autoModals(stage, 'before capture'); await pops(stage);
    await E('N.nav("board")'); await sleep(1200); await autoModals(stage, 'board nav');
    rec.nav = await E('N.navInfo()'); log('  nav: ' + rec.nav.join(' || '));
    await scan(stage, 'nav', rec.nav.join('\n'));
    await pg.shot(`${OUT}/${stage}_tabbar.png`, { x: 0, y: 700, width: 390, height: 144 });
    for (const t of TABS) {
      const r = await E(`N.nav("${t}")`); await sleep(t === 'hideout' ? 2500 : 1400);
      await autoModals(stage, 'after ' + t + ' tab'); await pops(stage);
      if (r === 'absent' || /^locked/.test(r)) { rec.tabs[t] = r; continue; }
      let text = await E('N.txt(document.getElementById("app"),1)');
      if (t === 'shop') { const sub = await E(`(function(){var o=[];[].forEach.call(document.querySelectorAll(".qs-tab"),function(b){b.click();o.push("[shop tab "+b.innerText+"] "+N.txt(document.getElementById("app"),1).slice(0,3000))});return o.join("\\n")})()`); text += '\n' + sub; await sleep(500); await autoModals(stage, 'shop tabs'); }
      if (t === 'hall') { const sub = await E(`(function(){var o=[];[].forEach.call(document.querySelectorAll(".htab button"),function(b){b.click();o.push("[hall tab "+b.innerText+"] "+N.txt(document.getElementById("app"),1).slice(0,4000))});return o.join("\\n")})()`); text += '\n' + sub; await sleep(500); await autoModals(stage, 'hall tabs'); }
      if (t === 'trophy') { const sub = await E(`(function(){var o=[];[].forEach.call(document.querySelectorAll(".dg-tab"),function(b){b.click();o.push("[relics tab "+b.innerText+"] "+N.txt(document.getElementById("app"),1))});var r=document.querySelector('.dg-tab[data-v=relics]');if(r)r.click();return o.join("\\n")})()`); text += '\n' + sub; }
      rec.tabs[t] = text;
      await scan(stage, 'tab ' + t, text);
      if (opt.shots && opt.shots.includes(t)) await pg.shot(`${OUT}/${stage}_tab_${t}.png`);
    }
    // inbox
    const ib = await E('(function(){var b=document.querySelector(".ibbtn");if(!b)return null;b.click();return 1})()');
    if (ib) { await sleep(900); const m = await E('N.modals()'); rec.tabs.inbox = m.join('\n'); await scan(stage, 'inbox', rec.tabs.inbox); await E('N.closeAll()'); }
    await E('N.nav("board")'); await sleep(600); await autoModals(stage, 'back to board');
    // every owned room's window and its help
    const rooms = (await E('N.state()')).rooms;
    for (const t of rooms) {
      await E(`N.room("${t}")`); await sleep(1300);
      const m = await E('N.modals()'); rec.rooms[t] = m.join('\n');
      await scan(stage, 'room ' + t, rec.rooms[t]);
      if (opt.roomShot && opt.roomShot.includes(t)) await pg.shot(`${OUT}/${stage}_room_${t}.png`);
      const hp = await E('N.help()'); await sleep(400);
      if (hp) { rec.helps[t] = hp; await scan(stage, 'help ' + t, hp); }
      await E('N.closeAll()'); await pops(stage);
    }
    fs.appendFileSync(JL, JSON.stringify(rec) + '\n');
    const ls = await pg.ev('(function(){var o={};for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);o[k]=localStorage.getItem(k)}return o})()');
    fs.writeFileSync(`${OUT}/seed_${stage}.json`, JSON.stringify(ls));
    log(`  (${stage}) hits so far: ${allHits.length}; page errors: ${pg.errs.length}`);
  }
  // one story step through the game's own check: returns the windows it opened (scene text), then says yes
  async function story(stage, label) {
    await E('N.nav("board")'); await sleep(500); await E('N.nextDay()');
    const m = await E('N.check()'); await sleep(900);
    const all = [].concat(m, await E('N.modals()'));
    const uniq = [...new Set(all)];
    uniq.forEach((t) => log(`  [${stage}] ${label} window: ${t.replace(/\s+/g, ' ').slice(0, 700)}`));
    for (const t of uniq) await scan(stage, label + ' scene', t);
    const y = await E('N.yes()'); log(`  [${stage}] ${label}: yes -> ${y}`); await sleep(1500);
    await autoModals(stage, label + ' after yes'); await pops(stage);
    return uniq;
  }

  const FROM = process.env.FROM || 'a';
  const ST = [
    ['a', 'a_lv1', async () => {}],
    ['b', 'b_lv2', async () => { await E('N.lvl(2)'); }],
    ['c', 'c_closet', async () => { await E('N.earn(3000)'); const r = await E('(function(){window.__qbRooms.open("closet",1);window.__qb.x().persist();window.__qb.x().render();return 1})()'); }],
    ['d', 'd_lair', async () => { await E('N.earn(12000)'); let got = '';
      for (let k = 0; k < 9 && !/^bought/.test(got); k++) { got = await E('N.buy("closet","cl_lair")'); if (!/^bought/.test(got)) { const b = await E('N.buyFirst("closet")'); log('  closet buy: ' + b); await sleep(700); await autoModals('d_lair', 'closet upgrade'); } }
      log('  buy ???: ' + got); if (!/^bought/.test(got)) await E('(function(){window.__qbRooms.open("lair",1);window.__qb.x().persist();window.__qb.x().render();return 1})()');
      await sleep(1500); await autoModals('d_lair', 'lair bought'); await pops('d_lair'); }],
    ['e', 'e_garden', async () => {
      await E('(function(){window.__qbRooms.open("patio",1);window.__qbRooms.open("gameroom",1);window.__qb.x().persist();window.__qb.x().render();return 1})()');
      await story('e_garden', 'garden step'); await E('(function(){window.__qbRooms.open("garden",1);window.__qb.x().persist();window.__qb.x().render();return 1})()'); await sleep(800); }],
    ['f', 'f_restaurant', async () => {
      await E('N.lvl(3)'); await E('(function(){window.__qbStory.state().sold=12;return 1})()'); await E('N.earn(2500)');
      await story('f_restaurant', 'chef step'); await E('N.earn(6000)'); log('  buy gd_rest: ' + await E('N.buy("garden","gd_rest")')); await sleep(1500);
      await autoModals('f_restaurant', 'restaurant bought'); await pops('f_restaurant'); }],
    ['g', 'g_boba', async () => {
      await E('N.lvl(9)'); await E('(function(){window.__qb.x().S.base.served=90;return 1})()'); await E('N.earn(6500)');
      await story('g_boba', 'boba step'); await E('(function(){window.__qbRooms.open("boba",1);window.__qb.x().persist();window.__qb.x().render();return 1})()');
      // the foxbell relic while the player has the Boba Shop but not the Dessert Parlor
      await E('(function(){var s=window.__qb.x().S;s.relics2=s.relics2||{};s.relics2.r2_foxbell=Date.now();s.relics2.r2_shell=Date.now();window.__qb.x().persist();return 1})()'); }],
    ['h', 'h_dessert', async () => {
      await E('N.lvl(11)'); await E('N.earn(30000)'); for (let k = 0; k < 4; k++) { log('  boba buy: ' + await E('N.buyFirst("boba")')); await sleep(900); await autoModals('h_dessert', 'boba upgrade'); }
      await E('N.earn(8500)'); await story('h_dessert', 'dessert step'); await E('N.earn(10000)');
      log('  buy bo_dess: ' + await E('N.buy("boba","bo_dess")')); await sleep(1500); await autoModals('h_dessert', 'dessert bought'); await pops('h_dessert');
      // the r_x2 splash, as the game shows it (Review > Play: nothing saved)
      await E('(function(){window.__qbRooms.play("up","restaurant|r_x2");return 1})()'); await sleep(700); await autoModals('h_dessert', 'r_x2 splash'); }],
    ['j', 'j_lockkey', async () => {
      await E('N.lvl(14)'); await E('N.setUps("restaurant",6,["r_noir"])'); await E('N.earn(12500)');
      await story('j_lockkey', 'lockkey step'); await sleep(1000); await autoModals('j_lockkey', 'after lock and key'); }],
    ['k', 'k_rafe', async () => {
      await E('N.lvl(15)'); await E('N.earn(40000)'); for (let k = 0; k < 3; k++) { log('  skybar buy: ' + await E('N.buyFirst("skybar")')); await sleep(900); await autoModals('k_rafe', 'skybar upgrade'); }
      await story('k_rafe', 'rafe step'); await sleep(1200); await autoModals('k_rafe', 'rafe joined'); }],
    ['l', 'l_rooftop', async () => {
      await E('N.lvl(17)'); await E('N.earn(40000)'); for (let k = 0; k < 3; k++) { log('  skybar buy: ' + await E('N.buyFirst("skybar")')); await sleep(900); await autoModals('l_rooftop', 'skybar upgrade'); }
      await E('N.nav("board")'); await E('N.nextDay()'); const m = await E('N.check()'); m.forEach((t) => log('  [l_rooftop] check window: ' + t.replace(/\s+/g, ' ').slice(0, 500))); await sleep(800); await autoModals('l_rooftop', 'rooftop check'); await pops('l_rooftop');
      await E('N.nextDay()'); await E('N.check()'); await sleep(800); await autoModals('l_rooftop', 'rooftop check 2'); await pops('l_rooftop');
      await E('N.earn(15000)'); log('  buy sb_roof: ' + await E('N.buy("skybar","sb_roof")')); await sleep(1500); await autoModals('l_rooftop', 'rooftop bought'); await pops('l_rooftop');
      // the Live build holds the Mall: its "Coming next" card in Lock and Key, with QB_WEB.noTest on for a moment
      await E('(function(){window.QB_WEB.noTest=true;return 1})()'); await E('N.room("skybar")'); await sleep(1200);
      const held = await E('N.modals()'); log('  [l_rooftop] Lock and Key window with the Mall held (Live): ' + held.join(' ').replace(/\s+/g, ' ').slice(0, 900)); await scan('l_rooftop', 'room skybar (Live, Mall held)', held.join('\n'));
      await pg.shot(`${OUT}/l_rooftop_live_mallheld.png`);
      await E('N.closeAll()'); await E('(function(){window.QB_WEB.noTest=false;return 1})()'); }],
    ['m', 'm_mall', async () => {
      await E('N.lvl(20)'); await E('N.earn(25000)'); await story('m_mall', 'mall step');
      await E('(function(){window.__qbRooms.open("mall",1);window.__qb.x().persist();window.__qb.x().render();return 1})()'); await sleep(800); }],
    ['n', 'n_nova', async () => {
      await E('N.lvl(21)'); await E('N.earn(60000)'); await E('N.setUps("mall",3,["ml_shop1"])'); await story('n_nova', 'nova step'); await sleep(1200); await autoModals('n_nova', 'nova joined'); }],
    ['o', 'o_theater', async () => {
      await E('N.lvl(23)'); await E('N.earn(30000)'); await E('N.setUps("mall",4)');
      await E('N.nav("board")'); await E('N.nextDay()'); await E('N.check()'); await sleep(800); await autoModals('o_theater', 'theater check'); await pops('o_theater');
      await E('(function(){window.__qbRooms.open("theater",1);window.__qb.x().persist();window.__qb.x().render();return 1})()'); await sleep(800);
      // the lobby's two door buttons, as a player taps them
      await E('N.room("theater")'); await sleep(1500);
      log('  [o_theater] door buttons: ' + await E(`(function(){var o=[];["thdoorlock","gotoaud"].forEach(function(a){var b=document.querySelector("#layer [data-act="+a+"]");o.push(a+":"+(b?"found":"absent"));if(b)b.click()});return o.join(", ")})()`));
      await sleep(500); await pops('o_theater'); await E('N.closeAll()'); }],
    ['p', 'p_arcade', async () => {
      await E('N.earn(60000)'); await E('N.setUps("theater",0,["t_booth1","t_pop","t_soda"])'); await E('N.lvl(25)');
      await story('p_arcade', 'auditorium step'); await sleep(1500); await autoModals('p_arcade', 'auditorium opened');
      await E('N.lvl(28)'); await E('N.setUps("auditorium",3)'); await E('N.nav("board")'); await E('N.nextDay()'); await E('N.check()'); await sleep(800); await autoModals('p_arcade', 'arcade check'); await pops('p_arcade');
      await E('N.earn(30000)'); log('  buy ml_arc: ' + await E('N.buy("mall","ml_arc")')); await sleep(1500); await autoModals('p_arcade', 'arcade bought'); await pops('p_arcade'); }],
  ];
  let go = false;
  for (const [k, stage, fn] of ST) {
    if (k === FROM) go = true; if (!go) continue; if (process.env.STOP && k > process.env.STOP) break;
    log(`-- stage ${stage}`);
    try { await fn(); } catch (e) { log(`  STEP ERROR ${stage}: ${e.message}`); }
    await sleep(800); await pops(stage);
    const shots = ['a_lv1', 'd_lair', 'f_restaurant', 'g_boba', 'm_mall'].includes(stage) ? ['away', 'trophy', 'shop', 'hideout'] : [];
    const roomShot = { b_lv2: ['bedroom'], c_closet: ['closet'], d_lair: ['lair'], e_garden: ['garden'], f_restaurant: ['restaurant'], g_boba: ['boba', 'restaurant'], h_dessert: ['dessert'], j_lockkey: ['skybar'], k_rafe: ['skybar'], l_rooftop: ['rooftop'], m_mall: ['mall', 'skybar'], n_nova: ['mall'], o_theater: ['theater'], p_arcade: ['arcade'] }[stage] || [];
    try { await capture(stage, { shots, roomShot }); } catch (e) { log(`  CAPTURE ERROR ${stage}: ${e.message}`); }
  }
  fs.writeFileSync(OUT + '/hits.json', JSON.stringify(allHits, null, 1));
  log(`DONE hits ${allHits.length}; page errors ${pg.errs.length}: ${pg.errs.slice(0, 6).join(' | ')}`);
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); try { fs.appendFileSync(LOG, 'FAIL ' + e.stack + '\n'); } catch (x) {} process.exit(1); });
