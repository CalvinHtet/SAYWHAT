// w-focus (SPEC8) Goals: the building view's Goals button, Next goal line and panel; a real tap claims a goal once (coins and XP as
// shown), a second tap and a reload never pay it again. Screenshots in out/wfocus.
//   CHROME_PORT=9373 bash tools/windows/node.sh rigtest/qa/wfocus_goals.js
const fs = require('fs');
const { browser, sleep, boot, E, dumpLS } = require('./wfocus_lib.js');
const OUT = 'C:/Users/clvh/qa-wt/out/wfocus'; const LOG = OUT + '/goals.log'; fs.writeFileSync(LOG, '');
const log = (s) => { console.log(s); fs.appendFileSync(LOG, s + '\n'); };
let fails = 0;
const expect = (name, ok, detail) => { if (!ok) fails++; log(`  ${ok ? 'ok  ' : 'BAD '} ${name}${detail ? ': ' + detail : ''}`); };
const rect = (pg, sel) => pg.ev(`(function(){var e=document.querySelector(${JSON.stringify(sel)});if(!e)return null;e.scrollIntoView({block:"center"});var r=e.getBoundingClientRect();return r.width?{x:r.x+r.width/2,y:r.y+r.height/2,t:e.innerText}:null})()`);
const money = (pg) => pg.ev('(function(){var S=window.__qb.x().S;return {coins:S.coins,xp:S.xp,goals:JSON.stringify(S.goals||{})}})()');
async function enterBld(pg, bi) {
  await pg.ev(`(function(){document.querySelectorAll("#layer .modal").forEach(function(m){m.remove()});var b=document.querySelector('.nav button[data-v="hideout"]');if(b)b.click();return 1})()`); await sleep(2500);
  await pg.ev(`(function(){document.querySelectorAll("#layer .modal").forEach(function(m){m.remove()});var b=document.querySelector('[data-act=bldout]');if(b)b.click();return 1})()`); await sleep(1200);
  const ok = await pg.ev(`(function(){var g=document.querySelector('[data-act=bldgo][data-v="${bi}"]');if(!g)return "no building ${bi}";window.__lfpd=null;g.dispatchEvent(new MouseEvent("click",{bubbles:true}));return 1})()`); await sleep(2500);
  await pg.ev('(function(){document.querySelectorAll("#layer .modal").forEach(function(m){m.remove()});return 1})()');
  return ok;
}
(async () => {
  const br = await browser(); let pg = await boot(br);
  await E(pg, 'W.lvl(12)');
  await E(pg, `(function(){["bedroom","closet","patio","gameroom","lair","garden","restaurant","skybar"].forEach(function(t){W.add(t)});
    W.fill("bedroom",32);W.half("closet");W.fill("patio",5);W.half("gameroom");W.half("lair");W.half("garden");W.fill("restaurant",30,["r_noir"]);W.fill("skybar",4);
    W.st().sold=20;W.X().S.base.slots[W.slot("restaurant")].earn=8400;W.X().S.coins=500;W.X().persist();W.X().render();return 1})()`);
  // the lists as the game has them
  for (const bi of [0, 1]) { const L = await pg.ev(`window.__qbGoals.list(${bi})`); log(`== building ${bi}: ${L.length} goals, ${L.filter((g) => g.met && !g.got).length} ready`); L.forEach((g) => log(`   ${g.met ? '[met]' : '[   ]'} ${g.id}: "${g.txt}" ${g.prog} +${g.c} coins +${g.xp} XP`)); }
  for (const bi of [0, 1]) {
    log('enter building ' + bi + ': ' + await enterBld(pg, bi));
    const top = await pg.ev('(function(){var t=document.querySelector(".lfbtop"),n=document.querySelector(".glnext"),b=document.querySelector(".glbtn");return {top:t&&t.innerText.replace(/\\s+/g," "),next:n&&n.innerText,nextFull:n&&n.scrollWidth>n.clientWidth?"TRUNCATED "+n.scrollWidth+">"+n.clientWidth:"fits",btn:b&&b.getAttribute("aria-label")}})()');
    log('  building view: ' + JSON.stringify(top)); expect(`B${bi} Goals button`, !!(top.btn && /Goals/.test(top.btn))); expect(`B${bi} Next goal line`, !!(top.next && /^Next goal: /.test(top.next)), top.next);
    await pg.shot(`${OUT}/goals_b${bi}_view.png`);
  }
  // the panel, Loft: real taps
  await enterBld(pg, 0);
  let r = await rect(pg, '.glbtn'); await pg.tap(r.x, r.y); await sleep(1200);
  const panel = await pg.ev('(function(){var m=document.querySelector("#layer .glmodal");return m?m.innerText.replace(/\\n+/g," | "):null})()');
  log('  panel: ' + (panel || '').slice(0, 900)); expect('panel opens from the Goals button', !!panel);
  await pg.shot(`${OUT}/goals_panel_loft.png`);
  const goal = await pg.ev('(function(){var b=document.querySelector("#layer .glmodal [data-gl=claim]");return b?b.dataset.id:null})()');
  const g = (await pg.ev('window.__qbGoals.list(0)')).filter((x) => x.id === goal)[0];
  const m0 = await money(pg); r = await rect(pg, `#layer .glmodal [data-gl=claim][data-id="${goal}"]`); await pg.tap(r.x, r.y); await sleep(900);
  const m1 = await money(pg);
  log(`  claim ${goal} (shows +${g.c} coins +${g.xp} XP): coins ${m0.coins} -> ${m1.coins} (+${m1.coins - m0.coins}), xp ${m0.xp} -> ${m1.xp} (+${m1.xp - m0.xp})`);
  expect('first tap pays exactly what it shows', m1.coins - m0.coins === g.c && m1.xp - m0.xp === g.xp);
  await pg.shot(`${OUT}/goals_panel_after_claim.png`);
  const row = await pg.ev(`(function(){var rows=[].filter.call(document.querySelectorAll("#layer .glmodal .glrow"),function(e){return e.innerText.indexOf(${JSON.stringify(g.txt)})>=0});return rows.map(function(e){return e.className+" | "+e.innerText.replace(/\\s+/g," ")})})()`);
  log('  its row now: ' + JSON.stringify(row));
  // second tap at the same spot, a double tap, and the hook
  await pg.tap(r.x, r.y); await sleep(500); await pg.tap(r.x, r.y); await pg.tap(r.x, r.y); await sleep(700);
  await pg.ev(`(window.__qbGoals.claim(${JSON.stringify(goal)},0),1)`); await sleep(400);
  const m2 = await money(pg); log(`  after 3 more taps on the spot and a direct claim call: coins ${m2.coins}, xp ${m2.xp}`);
  // the taps may have claimed whatever slid under the finger: count only this goal
  const extra = m2.coins - m1.coins; const claimedNow = Object.keys(JSON.parse(m2.goals)); log('  claimed ids: ' + claimedNow.join(', '));
  const others = (await pg.ev('window.__qbGoals.list(0)')).filter((x) => x.got && x.id !== goal).reduce((a, x) => a + x.c, 0);
  expect('second tap does not pay it again', extra === others, `extra coins ${extra}, other goals claimed by the taps ${others}`);
  // a quick double tap on a fresh claim button
  const goal2 = await pg.ev('(function(){var b=document.querySelector("#layer .glmodal [data-gl=claim]");return b?b.dataset.id:null})()');
  if (goal2) { const g2 = (await pg.ev('window.__qbGoals.list(0)')).filter((x) => x.id === goal2)[0]; const a0 = await money(pg);
    await pg.ev(`(function(){var b=document.querySelector('#layer .glmodal [data-gl=claim][data-id="${goal2}"]');b.click();b.click();return 1})()`); await sleep(600); const a1 = await money(pg);
    log(`  double click on ${goal2} (+${g2.c}): +${a1.coins - a0.coins} coins, +${a1.xp - a0.xp} XP`); expect('a double click pays once', a1.coins - a0.coins === g2.c); }
  const gl0 = (await money(pg)).goals; const c0 = (await money(pg)).coins;
  await E(pg, '(W.X().persist(),1)'); await sleep(1200);
  const ls = await pg.ev(dumpLS); await pg.close();
  log('page errors (first page): ' + JSON.stringify(pg.errs)); fails += pg.errs.length;
  // reload: same save in a fresh page
  pg = await boot(br, { seed: ls }); await sleep(1500);
  const mR = await money(pg); log(`  after reload: coins ${mR.coins} (before ${c0}), goals ${mR.goals === gl0 ? 'same' : 'CHANGED ' + mR.goals}`);
  const L0 = await pg.ev('window.__qbGoals.list(0)'); expect('reload keeps claimed goals claimed', L0.filter((x) => x.id === goal)[0].got, 'got=' + L0.filter((x) => x.id === goal)[0].got);
  await pg.ev(`(window.__qbGoals.claim(${JSON.stringify(goal)},0),1)`); await sleep(400); const mR2 = await money(pg);
  expect('a claim after reload does not repay', mR2.coins === mR.coins, `${mR.coins} -> ${mR2.coins}`);
  await enterBld(pg, 0); r = await rect(pg, '.glbtn'); log('  Goals button after reload: ' + JSON.stringify(r && r.t)); await pg.tap(r.x, r.y); await sleep(1200);
  await pg.shot(`${OUT}/goals_panel_after_reload.png`);
  const rowR = await pg.ev(`(function(){return [].map.call(document.querySelectorAll("#layer .glmodal .glrow.got"),function(e){return e.innerText.replace(/\\s+/g," ")})})()`); log('  claimed rows after reload: ' + JSON.stringify(rowR));
  // part 4: the room window's half and full marks
  await E(pg, '(W.closeAll(),window.__qb.roomModal(W.slot("patio")),1)'); await sleep(1200);
  log('  patio window stats: ' + await pg.ev('(function(){var m=document.querySelector("#layer .rmodal");if(!m)return null;var t=m.innerText,i=t.search(/Half/);return i<0?"no Half mark: "+t.slice(0,300).replace(/\\s+/g," "):t.slice(Math.max(0,i-80),i+60).replace(/\\s+/g," ")})()'));
  log('page errors (reload page): ' + JSON.stringify(pg.errs)); fails += pg.errs.length;
  log(fails ? 'FAILS ' + fails : 'ALL AS EXPECTED'); await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
