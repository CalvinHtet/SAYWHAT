// w-focus probe: what the build has (hooks, ECON, each room's live upgrades and half mark, the Loft share)
const { browser, sleep, boot, E } = require('./wfocus_lib.js');
(async () => {
  const br = await browser(); const pg = await boot(br);
  console.log(JSON.stringify(await pg.ev(`(function(){var x=window.__qb.x(),E=window.__qbEcon.ECON;return {hooks:Object.keys(window).filter(function(k){return /^__qb/.test(k)}),
    glob:{glList:typeof window.glList,focusLack:typeof window.focusLack,roomFill:typeof window.roomFill,loftShare:typeof window.loftShare,styCheck:typeof window.styCheck},
    econ:{focusMin:E.focusMin,gardenLoft:E.gardenLoft,loftCore:E.loftCore,bobaEarn:E.bobaEarn,plazaAll:E.plazaAll,goal:E.goal,stepLv:E.stepLv,slotFree:E.slotFree,phase:E.phase},
    rooms:Object.keys(x.ADDONS).map(function(t){var A=x.ADDONS[t]||[];return t+": all "+A.length+", live "+window.__wf.live(t).length+", openers "+A.filter(function(a){return a[3]&&a[3].opens}).map(function(a){return a[0]+">"+a[3].opens}).join("/")+", retired "+A.filter(function(a){return a[3]&&a[3].retired}).length}),
    story:window.__qbStory.steps.map(function(s){return s.id+"/"+s.room+"/"+s.how}).join(" "),testFree:x.S.testFree,lv:x.effLvl()}})()`), null, 1));
  console.log('errs', pg.errs);
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
