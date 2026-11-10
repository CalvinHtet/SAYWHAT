// w-focus (SPEC8) no spoilers: at each story stage, the Goals panels, the Next goal lines and the locked cards ("Coming next ? ? ?" and
// the openers' mystery cards) are checked for the name of any room the player does not have and has not been offered, and for people
// not met yet. Read only on the game.
//   CHROME_PORT=9373 bash tools/windows/node.sh rigtest/qa/wfocus_spoil.js
const fs = require('fs');
const { browser, sleep, boot, E } = require('./wfocus_lib.js');
const { ROOMW } = require('./nospoil_lib.js');
const OUT = 'C:/Users/clvh/qa-wt/out/wfocus'; const LOG = OUT + '/spoil.log'; fs.writeFileSync(LOG, '');
const log = (s) => { console.log(s); fs.appendFileSync(LOG, s + '\n'); };
const PEOPLE = { Desmond: 'skybar', Priya: 'mall', Mara: 'restaurant', Rafe: 'rafe', Nova: 'nova', Theo: 'auditorium' };
const STAGES = [
  ['s1_loft', 2, '(W.add("bedroom"),W.add("closet"),W.fill("bedroom",10),W.fill("closet",2),1)'],
  ['s2_garden', 3, '(["bedroom","closet","patio","gameroom"].forEach(function(t){W.add(t);W.half(t)}),W.add("garden"),W.fill("garden",5),W.st().sold=3,1)'],
  ['s3_restaurant', 8, '(W.half("garden"),W.add("restaurant"),W.fill("restaurant",10),1)'],
  ['s4_nonoir', 12, `(function(){var r=W.X().S.base.slots[W.slot("restaurant")],L=W.live("restaurant").filter(function(k){return k!=="r_noir"});r.a={};L.slice(0,30).forEach(function(k){r.a[k]=1});r.earn=5000;W.X().persist();return 1})()`],
  ['s5_lockkey', 12, '(W.fill("restaurant",30,["r_noir"]),W.add("skybar"),W.fill("skybar",3),W.X().S.base.slots[W.slot("restaurant")].earn=12400,1)'],
  ['s6_boba', 14, '(W.half("skybar"),W.add("boba"),W.fill("boba",3),1)'],
  ['s7_plaza', 18, '(W.half("boba"),W.add("dessert"),W.fill("dessert",3),1)'],
  ['s8_plazaall', 20, '(W.half("dessert"),W.add("rooftop"),W.half("rooftop"),W.st().done.rafe=1,W.st().offer.rafe=1,W.st().team.rafe=1,1)'],
  ['s9_mall', 23, '(W.add("mall"),W.fill("mall",3),1)'],
  ['s10_theater', 26, '(W.half("mall"),W.add("theater"),W.fill("theater",4),W.st().done.nova=1,W.st().offer.nova=1,W.st().team.nova=1,1)'],
];
async function enterBld(pg, bi) {
  await pg.ev(`(function(){document.querySelectorAll("#layer .modal").forEach(function(m){m.remove()});var b=document.querySelector('.nav button[data-v="hideout"]');if(b)b.click();return 1})()`); await sleep(2000);
  await pg.ev(`(function(){document.querySelectorAll("#layer .modal").forEach(function(m){m.remove()});var b=document.querySelector('[data-act=bldout]');if(b)b.click();return 1})()`); await sleep(900);
  const ok = await pg.ev(`(function(){var g=document.querySelector('[data-act=bldgo][data-v="${bi}"]');if(!g)return 0;window.__lfpd=null;g.dispatchEvent(new MouseEvent("click",{bubbles:true}));return 1})()`); await sleep(1800);
  await pg.ev('(function(){document.querySelectorAll("#layer .modal").forEach(function(m){m.remove()});return 1})()');
  return ok;
}
(async () => {
  const br = await browser(); const pg = await boot(br); let hits = 0, texts = 0;
  for (const [stage, lv, setup] of STAGES) {
    await E(pg, `W.lvl(${lv})`); await E(pg, setup); await E(pg, '(W.X().persist(),W.X().render(),1)');
    const st = await E(pg, `(function(){var o=W.st(),rooms=W.X().S.base.slots.filter(Boolean).map(function(r){return r.t}),al={};window.__qbStory.steps.forEach(function(s){if(s.room)al[s.room]=!!(o.offer[s.id]||o.done[s.id])});
      return {rooms:rooms,allows:al,team:Object.keys(o.team||{}),met:Object.keys(o.done).concat(Object.keys(o.offer))}})()`);
    const owned = (r) => st.rooms.includes(r) || st.allows[r];
    const scan = (where, text) => { texts++; for (const [room, res] of Object.entries(ROOMW)) { if (owned(room)) continue; res.forEach((re) => { const m = re.exec(text); if (m) { hits++; log(`  SPOILER [${stage}] ${where}: "${m[0]}" (${room} not had) in: ${text.slice(Math.max(0, m.index - 80), m.index + 60).replace(/\s+/g, ' ')}`); } }); }
      for (const [p, k] of Object.entries(PEOPLE)) { if (owned(k) || st.met.includes(k)) continue; const m = new RegExp('\\b' + p + '\\b').exec(text); if (m) { hits++; log(`  SPOILER [${stage}] ${where}: person ${p}: ${text.slice(Math.max(0, m.index - 80), m.index + 60)}`); } } };
    log(`== ${stage} (level ${lv}): rooms ${st.rooms.join(',')}`);
    const blds = [...new Set(await E(pg, 'W.X().S.base.slots.filter(Boolean).map(function(r){return (window.__qbGoals&&1)?(r.t):0})'))];
    const bis = await pg.ev(`(function(){var C={lair:0,trophy:0,closet:0,bedroom:0,patio:0,gameroom:0,restaurant:1,skybar:1,rooftop:1,garden:1,boba:1,dessert:1,theater:2,auditorium:2,mall:2};var o={};window.__qb.x().S.base.slots.forEach(function(r){if(r&&C[r.t]!=null)o[C[r.t]]=1});return Object.keys(o).map(Number)})()`);
    for (const bi of bis) {
      if (!(await enterBld(pg, bi))) { log('  building ' + bi + ' not on the street'); continue; }
      const nx = await pg.ev('(function(){var n=document.querySelector(".glnext");return n?n.innerText:null})()');
      log(`  building ${bi} next goal: ${nx}`); if (nx) scan('next goal b' + bi, nx);
      const b = await pg.ev('(function(){var b=document.querySelector(".glbtn");if(!b)return 0;b.click();return 1})()'); await sleep(700);
      const panel = await pg.ev('(function(){var m=document.querySelector("#layer .glmodal");return m?m.innerText.replace(/\\n+/g," | "):null})()');
      if (panel) { scan('goals b' + bi, panel); fs.appendFileSync(OUT + '/spoil_texts.txt', `[${stage}] goals b${bi}: ${panel}\n`); } else log('  no goals panel b' + bi + ' (button ' + b + ')');
      if (stage === 's5_lockkey' && bi === 1) { await pg.shot(OUT + '/spoil_s5_goals_plaza.png'); }
    }
    for (const t of st.rooms) {
      await E(pg, `(W.closeAll(),window.__qb.roomModal(W.slot("${t}")),1)`); await sleep(900);
      const cards = await pg.ev('[].map.call(document.querySelectorAll("#layer .rmodal .stynext,#layer .rmodal .addon.mystery"),function(e){return e.innerText.replace(/\\s+/g," ")})');
      for (const c of cards) { scan('locked card in ' + t, c); fs.appendFileSync(OUT + '/spoil_texts.txt', `[${stage}] card in ${t}: ${c}\n`); }
      if (cards.length) log(`  ${t}: ${cards.length} locked card(s): ${cards.map((c) => '"' + c + '"').join(' ; ')}`);
      if ((stage === 's5_lockkey' && t === 'restaurant') || (stage === 's6_boba' && t === 'boba')) { await pg.ev('(function(){var e=document.querySelector("#layer .rmodal .stynext");if(e)e.scrollIntoView({block:"center"});return 1})()'); await sleep(400); await pg.shot(`${OUT}/spoil_${stage}_${t}_card.png`); }
    }
    await E(pg, 'W.closeAll()');
  }
  log(`texts scanned ${texts}, spoiler hits ${hits}; page errors ${JSON.stringify(pg.errs)}`);
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
