// w-focus (SPEC8) edges: each story trigger just under and just at, with the focus rule (every room already open in the building at
// half) and the level floor, on a fresh save moved through the test hooks. styCheck is called directly (it runs every 15 s in the game).
//   CHROME_PORT=9373 bash tools/windows/node.sh rigtest/qa/wfocus_edges.js
const fs = require('fs');
const { browser, sleep, boot, E } = require('./wfocus_lib.js');
const OUT = 'C:/Users/clvh/qa-wt/out/wfocus'; const LOG = OUT + '/edges.log'; fs.writeFileSync(LOG, '');
const log = (s) => { console.log(s); fs.appendFileSync(LOG, s + '\n'); };
let fails = 0;
const expect = (name, got, want) => { const ok = got === want; if (!ok) fails++; log(`  ${ok ? 'ok  ' : 'BAD '} ${name}: ${got}${ok ? '' : ' (want ' + want + ')'}`); };
const ONLY = process.env.ONLY ? process.env.ONLY.split(',') : null;
const run = (k) => !ONLY || ONLY.includes(k);
(async () => {
  const br = await browser();
  const ck = async (pg, id) => { const r = await E(pg, 'W.check()'); const s = await E(pg, `W.step("${id}")`); return { r, s }; };
  const show = (lbl, c) => log(`  ${lbl}: scene=${c.r.scene} offer=[${c.r.offer}] | ${c.s.id} gate=${c.s.gate} focus=${c.s.focus} lv=${c.s.lv} | ${c.s.tr.join(' / ')}`);
  const opened = (c, id) => c.r.scene === id || c.r.offer.split(',').includes(id);

  // ---- A: the Garden at 50% of the Loft (bedroom 2 openers + closet's Lair opener counted), Lair at half for the focus rule
  if (run('A')) { const pg = await boot(br); log('== A Garden');
    await E(pg, 'W.lvl(3)'); await E(pg, '(W.add("bedroom"),W.add("closet"),W.add("patio"),W.add("lair"),1)');
    await E(pg, '(W.fill("closet",3),W.fill("patio",7),W.fill("lair",5),W.fill("bedroom",24),1)');
    log('  loft rooms ' + await E(pg, 'W.X().S.base.slots.filter(Boolean).map(function(r){return r.t+":"+Object.keys(r.a||{}).length}).join(" ")'));
    let c = await ck(pg, 'garden'); show('bedroom 24', c); expect('A1 Garden just under', opened(c, 'garden'), false);
    await E(pg, '(W.fill("bedroom",25),W.fill("lair",4),1)'); c = await ck(pg, 'garden'); show('bedroom 25, Lair 4 (half 5)', c); expect('A2 Garden at the trigger with the Lair under half', opened(c, 'garden'), false);
    await E(pg, '(W.setLvl(1),W.fill("lair",5),1)'); c = await ck(pg, 'garden'); show('Lair half, level 1', c); expect('A3 Garden at level 1 (floor 2)', opened(c, 'garden'), false);
    await E(pg, '(W.setLvl(2),1)'); c = await ck(pg, 'garden'); show('Lair half, level 2', c); expect('A4 Garden opens on the last condition', opened(c, 'garden'), true);
    log('  pops ' + JSON.stringify(await E(pg, 'W.pops.splice(0)')) + ' errs ' + JSON.stringify(pg.errs)); fails += pg.errs.length; await pg.close(); }

  // ---- A5: 3 Loft rooms (no Game Room, no Lair) at 50%: the old 4-room rule in styCheck
  if (run('A5')) { const pg = await boot(br); log('== A5 Garden with 3 Loft rooms');
    await E(pg, 'W.lvl(3)'); await E(pg, '(W.add("bedroom"),W.add("closet"),W.add("patio"),W.fill("closet",6),W.fill("patio",13),W.fill("bedroom",18),1)');
    log('  loft rooms ' + await E(pg, 'W.X().S.base.slots.filter(Boolean).map(function(r){return r.t+":"+Object.keys(r.a||{}).length}).join(" ")'));
    let c = await ck(pg, 'garden'); show('3 rooms', c);
    const y = await E(pg, 'W.yes()'); await sleep(300);
    const lots1 = await E(pg, 'window.__qbStory.lots().join(",")'); const off1 = await E(pg, 'JSON.stringify(W.st().offer)');
    c = await ck(pg, 'garden'); const lots2 = await E(pg, 'window.__qbStory.lots().join(",")');
    log(`  yes=${y}; after yes lots [${lots1}] offer ${off1}; after the next styCheck lots [${lots2}] offer [${c.r.offer}]`);
    expect('A5 Garden lot stays after the next check', lots2.includes('garden'), true);
    log('  errs ' + JSON.stringify(pg.errs)); await pg.close(); }

  // ---- B: the Restaurant (chef): 12 produce sold + Garden half (41 live: 21)
  if (run('B')) { const pg = await boot(br); log('== B Restaurant (chef)');
    await E(pg, 'W.lvl(3)'); await E(pg, '(["bedroom","closet","patio","gameroom"].forEach(function(t){W.add(t);W.half(t)}),W.add("garden"),1)');
    await E(pg, '(W.st().sold=11,W.fill("garden",21),1)'); let c = await ck(pg, 'chef'); show('sold 11, garden 21', c); expect('B1 chef at 11 sold', opened(c, 'chef'), false);
    await E(pg, '(W.st().sold=12,W.fill("garden",20),1)'); c = await ck(pg, 'chef'); show('sold 12, garden 20', c); expect('B2 chef with Garden under half', opened(c, 'chef'), false);
    await E(pg, '(W.fill("garden",21),1)'); c = await ck(pg, 'chef'); show('sold 12, garden 21', c); expect('B3 chef opens', opened(c, 'chef'), true);
    log('  errs ' + JSON.stringify(pg.errs)); await pg.close(); }

  // ---- C: Lock and Key on Noir (no Boba, no Dessert), Garden and Restaurant at half, level 9
  if (run('C')) { const pg = await boot(br); log('== C Lock and Key');
    await E(pg, 'W.lvl(8)'); await E(pg, '(["bedroom","closet","patio","gameroom","garden","restaurant"].forEach(function(t){W.add(t);W.half(t)}),1)');
    let c = await ck(pg, 'lockkey'); show('no Noir, level 8', c); expect('C1 no Noir', opened(c, 'lockkey'), false);
    await E(pg, '(W.fill("restaurant",30,["r_noir"]),1)'); c = await ck(pg, 'lockkey'); show('Noir, level 8', c); expect('C2 Noir at level 8 (floor 9)', opened(c, 'lockkey'), false);
    await E(pg, '(W.lvl(9),W.fill("restaurant",29,["r_noir"]),1)'); c = await ck(pg, 'lockkey'); show('Noir, level 9, restaurant 29 (half 30)', c); expect('C3 Restaurant under half', opened(c, 'lockkey'), false);
    await E(pg, '(W.fill("restaurant",30,["r_noir"]),1)'); c = await ck(pg, 'lockkey'); show('Noir, level 9, restaurant 30', c); expect('C4 Lock and Key opens without Boba or Dessert', opened(c, 'lockkey'), true);
    log('  rooms ' + await E(pg, 'W.X().S.base.slots.filter(Boolean).map(function(r){return r.t}).join(",")') + ' errs ' + JSON.stringify(pg.errs));
    await pg.close(); }

  // ---- D: Boba on 20,000 collected in the Restaurant, after Lock and Key (at half: 13 live, 7)
  if (run('D')) { const pg = await boot(br); log('== D Boba');
    await E(pg, 'W.lvl(11)'); await E(pg, '(["bedroom","closet","patio","gameroom","garden","restaurant","skybar"].forEach(function(t){W.add(t);W.half(t)}),W.fill("restaurant",30,["r_noir"]),1)');
    const rs = 'W.X().S.base.slots[W.slot("restaurant")]';
    await E(pg, `(${rs}.earn=19999,1)`); let c = await ck(pg, 'boba'); show('earn 19,999', c); expect('D1 Boba at 19,999', opened(c, 'boba'), false);
    await E(pg, `(${rs}.earn=20000,W.fill("skybar",6),1)`); c = await ck(pg, 'boba'); show('earn 20,000, L&K 6 (half 7)', c); expect('D2 Boba with Lock and Key under half', opened(c, 'boba'), false);
    await E(pg, '(W.setLvl(10),W.fill("skybar",7),1)'); c = await ck(pg, 'boba'); show('earn 20,000, L&K 7, level 10', c); expect('D3 Boba at level 10 (floor 11)', opened(c, 'boba'), false);
    await E(pg, '(W.lvl(11),1)'); c = await ck(pg, 'boba'); show('earn 20,000, L&K 7, level 11', c); expect('D4 Boba opens', opened(c, 'boba'), true);
    log('  errs ' + JSON.stringify(pg.errs)); await pg.close(); }

  // ---- D5: the order: the Restaurant earns 20,000 before going Noir (no Lock and Key yet); and both at once
  if (run('D5')) for (const noir of [false, true]) { const pg = await boot(br); log('== D5 order, Noir ' + noir);
    await E(pg, 'W.lvl(14)'); await E(pg, `(["bedroom","closet","patio","gameroom","garden","restaurant"].forEach(function(t){W.add(t);W.half(t)}),W.fill("restaurant",30,${noir ? '["r_noir"]' : '[]'}),W.X().S.base.slots[W.slot("restaurant")].earn=20000,1)`);
    const c = await ck(pg, 'boba'); show('earn 20,000, Noir ' + noir, c); log('  lockkey step: ' + JSON.stringify(await E(pg, 'W.step("lockkey")')));
    expect(`D5 with Noir ${noir}: Boba not before Lock and Key`, opened(c, 'boba'), false);
    await pg.close(); }

  // ---- E: the Mall: every Plaza room built and at half, level 20
  if (run('E')) { const pg = await boot(br); log('== E Mall');
    await E(pg, 'W.lvl(20)'); await E(pg, '(["bedroom","closet","patio","gameroom","garden","restaurant","skybar","boba"].forEach(function(t){W.add(t);W.half(t)}),W.fill("restaurant",30,["r_noir"]),1)');
    let c = await ck(pg, 'mall'); show('no Dessert, no Rooftop, all others half', c); expect('E1 Mall without Dessert and Rooftop', opened(c, 'mall'), false);
    await E(pg, '(W.closeAll(),window.__qb.roomModal(W.slot("restaurant")),1)'); await sleep(1500);
    log('  restaurant window "Coming next" cards: ' + JSON.stringify(await pg.ev('[].map.call(document.querySelectorAll("#layer .stynext"),function(e){return e.innerText.replace(/\\s+/g," ")})')));
    await pg.ev('(function(){var e=document.querySelector("#layer .stynext");if(e)e.scrollIntoView({block:"center"});return 1})()'); await sleep(500);
    await pg.shot(OUT + '/E1_restaurant_mallcard.png');
    await E(pg, '(W.closeAll(),["dessert","rooftop"].forEach(function(t){W.add(t);W.half(t)}),W.fill("boba",7),1)');
    c = await ck(pg, 'mall'); show('all built, Boba 7 (half 8)', c); expect('E2 Mall with Boba under half', opened(c, 'mall'), false);
    await E(pg, '(W.setLvl(19),W.half("boba"),1)'); c = await ck(pg, 'mall'); show('all half, level 19', c); expect('E3 Mall at level 19', opened(c, 'mall'), false);
    await E(pg, '(W.lvl(20),1)'); c = await ck(pg, 'mall'); show('all half, level 20', c); expect('E4 Mall opens', opened(c, 'mall'), true);
    log('  errs ' + JSON.stringify(pg.errs)); await pg.close(); }

  // ---- G: the Theater: Mall 4 upgrades (its trigger) and the Mall at half (focus inside the Mall building)
  if (run('G')) { const pg = await boot(br); log('== G Theater');
    await E(pg, 'W.lvl(23)'); await E(pg, '(["bedroom","closet","patio","gameroom","garden","restaurant","skybar","rooftop","boba","dessert","mall"].forEach(function(t){W.add(t);W.half(t)}),W.fill("restaurant",30,["r_noir"]),W.fill("mall",4),1)');
    let c = await ck(pg, 'theater'); show('mall 4', c); expect('G1 Theater with the Mall at 4 (half 5)', opened(c, 'theater'), false);
    await E(pg, '(W.fill("mall",5),1)'); c = await ck(pg, 'theater'); show('mall 5', c); expect('G2 Theater opens', opened(c, 'theater'), true);
    log('  errs ' + JSON.stringify(pg.errs)); await pg.close(); }

  log(fails ? 'FAILS ' + fails : 'ALL AS EXPECTED'); await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
