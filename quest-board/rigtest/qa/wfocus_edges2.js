// w-focus (SPEC8) edges, part 2: Lock and Key without Noir, the Boba / Lock and Key order, the Mall and Theater edges on a fresh game
// day, the one-story-step-a-day cap (is there still a day wait?), and the 3-room Garden lot.
//   CHROME_PORT=9373 bash tools/windows/node.sh rigtest/qa/wfocus_edges2.js
const fs = require('fs');
const { browser, sleep, boot, E } = require('./wfocus_lib.js');
const OUT = 'C:/Users/clvh/qa-wt/out/wfocus'; const LOG = OUT + '/edges2.log'; fs.writeFileSync(LOG, '');
const log = (s) => { console.log(s); fs.appendFileSync(LOG, s + '\n'); };
let fails = 0;
const expect = (name, got, want) => { const ok = got === want; if (!ok) fails++; log(`  ${ok ? 'ok  ' : 'BAD '} ${name}: ${got}${ok ? '' : ' (want ' + want + ')'}`); };
const ONLY = process.env.ONLY ? process.env.ONLY.split(',') : null;
const run = (k) => !ONLY || ONLY.includes(k);
// the restaurant at n upgrades with or without Noir
const REST = (n, noir) => `(function(){var x=W.X(),r=x.S.base.slots[W.slot("restaurant")],L=W.live("restaurant").filter(function(k){return k!=="r_noir"}),keep={};
  Object.keys(r.a||{}).forEach(function(k){if(L.indexOf(k)<0&&k!=="r_noir")keep[k]=1});r.a=keep;var pick=${noir ? '["r_noir"].concat(L)' : 'L'};pick.slice(0,${n}).forEach(function(k){r.a[k]=1});x.persist();return window.__qbGoals.fill("restaurant").n})()`;
// move the game clock to just after the next 5 am (local), the game day's start
const NEXT5 = `(function(){var now=Date.now(),d=new Date(now);var t=new Date(d.getFullYear(),d.getMonth(),d.getDate(),5,1,0).getTime();if(t<=now)t+=864e5;window.__qbShift=(window.__qbShift||0)+(t-now);return new Date(Date.now()).toString().slice(0,24)})()`;
(async () => {
  const br = await browser();
  const ck = async (pg, id) => { const r = await E(pg, 'W.check()'); const s = await E(pg, `W.step("${id}")`); return { r, s }; };
  const show = (lbl, c) => log(`  ${lbl}: scene=${c.r.scene} offer=[${c.r.offer}] stepDay=${c.r.sd || ''} | ${c.s.id} gate=${c.s.gate} focus=${c.s.focus} lv=${c.s.lv} | ${c.s.tr.join(' / ')}`);
  const opened = (c, id) => c.r.scene === id || c.r.offer.split(',').includes(id);
  const base = (pg, rooms) => E(pg, `(${JSON.stringify(rooms)}.forEach(function(t){W.add(t);W.half(t)}),1)`);

  if (run('C')) { const pg = await boot(br); log('== C Lock and Key without Noir, then Noir');
    await E(pg, 'W.lvl(9)'); await base(pg, ['bedroom', 'closet', 'patio', 'gameroom', 'garden', 'restaurant']); await E(pg, REST(40, false));
    let c = await ck(pg, 'lockkey'); show('restaurant 40, no Noir, level 9', c); expect('C1 no Noir', opened(c, 'lockkey'), false);
    await E(pg, REST(30, true)); c = await ck(pg, 'lockkey'); show('restaurant 30 with Noir', c); expect('C2 Noir opens Lock and Key (no Boba, no Dessert)', opened(c, 'lockkey'), true);
    log('  errs ' + JSON.stringify(pg.errs)); await pg.close(); }

  if (run('D5')) { const pg = await boot(br); log('== D5 the Restaurant earns 20,000 before going Noir');
    await E(pg, 'W.lvl(14)'); await base(pg, ['bedroom', 'closet', 'patio', 'gameroom', 'garden', 'restaurant']); await E(pg, REST(30, false));
    await E(pg, '(W.X().S.base.slots[W.slot("restaurant")].earn=20000,1)');
    const c = await ck(pg, 'boba'); show('earn 20,000, no Noir, level 14', c); log('  lockkey: ' + JSON.stringify(await E(pg, 'W.step("lockkey")')));
    expect('D5a Boba stays shut until Lock and Key', opened(c, 'boba'), false);
    await pg.close(); }

  if (run('D6')) { const pg = await boot(br); log('== D6 both met the same moment (Noir and 20,000)');
    await E(pg, 'W.lvl(14)'); await base(pg, ['bedroom', 'closet', 'patio', 'gameroom', 'garden', 'restaurant']); await E(pg, REST(30, true));
    await E(pg, '(W.X().S.base.slots[W.slot("restaurant")].earn=20000,1)');
    const c = await ck(pg, 'boba'); show('earn 20,000, Noir, level 14', c); expect('D6 first scene is Lock and Key', c.r.scene, 'lockkey');
    await pg.close(); }

  if (run('E')) { const pg = await boot(br); log('== E Mall edges, each check on a fresh game day');
    await E(pg, 'W.lvl(20)'); await base(pg, ['bedroom', 'closet', 'patio', 'gameroom', 'garden', 'restaurant', 'skybar', 'boba', 'dessert', 'rooftop']); await E(pg, REST(30, true));
    await E(pg, '(W.fill("boba",7),W.st().done.rafe=1,W.st().offer.rafe=1,W.nextDay(),1)');
    let c = await ck(pg, 'mall'); show('all built, Boba 7 (half 8)', c); expect('E2 Mall with Boba under half', opened(c, 'mall'), false);
    await E(pg, '(W.setLvl(19),W.half("boba"),W.nextDay(),1)'); c = await ck(pg, 'mall'); show('all half, level 19', c); expect('E3 Mall at level 19', opened(c, 'mall'), false);
    await E(pg, '(W.lvl(20),W.nextDay(),1)'); c = await ck(pg, 'mall'); show('all half, level 20', c); expect('E4 Mall opens', opened(c, 'mall'), true);
    log('  errs ' + JSON.stringify(pg.errs)); await pg.close(); }

  if (run('G')) { const pg = await boot(br); log('== G Theater, a fresh game day, Rafe and Nova met');
    await E(pg, 'W.lvl(23)'); await base(pg, ['bedroom', 'closet', 'patio', 'gameroom', 'garden', 'restaurant', 'skybar', 'rooftop', 'boba', 'dessert', 'mall']); await E(pg, REST(30, true));
    await E(pg, '(function(){var o=W.st();["rafe","nova"].forEach(function(k){o.done[k]=1;o.offer[k]=1});W.fill("mall",4);W.nextDay();return 1})()');
    let c = await ck(pg, 'theater'); show('mall 4', c); expect('G1 Theater with the Mall at 4 (half 5)', opened(c, 'theater'), false);
    await E(pg, '(W.fill("mall",5),1)'); c = await ck(pg, 'theater'); show('mall 5', c); expect('G2 Theater opens', opened(c, 'theater'), true);
    log('  errs ' + JSON.stringify(pg.errs)); await pg.close(); }

  // the day wait: one step opens, the next one's every condition is met the same game day; then the clock goes to 5 am
  if (run('W')) { const pg = await boot(br); log('== W day wait: Garden opened today, the Restaurant trigger met the same day');
    await E(pg, 'W.lvl(3)'); await base(pg, ['bedroom', 'closet', 'patio', 'gameroom']);
    let c = await ck(pg, 'garden'); show('Loft at half', c); log('  yes ' + await E(pg, 'W.yes()')); await sleep(400);
    await E(pg, '(W.add("garden"),W.half("garden"),W.st().sold=12,1)');
    log('  clock ' + await pg.ev('new Date().toString().slice(0,24)') + ', stepDay ' + await E(pg, 'W.st().stepDay'));
    c = await ck(pg, 'chef'); show('same day, chef all met', c); expect('W1 chef opens the same day', opened(c, 'chef'), true);
    log('  clock -> ' + await pg.ev(NEXT5)); c = await ck(pg, 'chef'); show('after 5 am', c); expect('W2 chef after the 5 am rollover', opened(c, 'chef'), true);
    log('  errs ' + JSON.stringify(pg.errs)); await pg.close(); }

  if (run('A5')) { const pg = await boot(br); log('== A5 Garden with 3 Loft rooms: the lot, then the next day');
    await E(pg, 'W.lvl(3)'); await E(pg, '(W.add("bedroom"),W.add("closet"),W.add("patio"),W.fill("closet",6),W.fill("patio",13),W.fill("bedroom",18),1)');
    let c = await ck(pg, 'garden'); show('day 1', c); log('  yes ' + await E(pg, 'W.yes()')); await sleep(500);
    log('  after yes: lots [' + await E(pg, 'window.__qbStory.lots().join(",")') + '] offer ' + await E(pg, 'JSON.stringify(W.st().offer)') + ' pops ' + JSON.stringify(await E(pg, 'W.pops.splice(0)')));
    await E(pg, '(W.closeAll(),document.querySelector(".nav button[data-v=hideout]").click(),1)'); await sleep(2500);
    await pg.shot(OUT + '/A5_street_after_yes.png');
    log('  clock -> ' + await pg.ev(NEXT5)); c = await ck(pg, 'garden'); show('day 2', c); expect('A5 the hobby scene does not come back', c.r.scene, null);
    log('  errs ' + JSON.stringify(pg.errs)); await pg.close(); }

  log(fails ? 'FAILS ' + fails : 'ALL AS EXPECTED'); await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
