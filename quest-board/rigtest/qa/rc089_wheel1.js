// rc-0.89 QA, Wheel check 1 + facts: a new player, the Wheel tab, its screenshot and what is drawn; the sliver pool's make-up.
const L = require('./rc089_wheel_lib.js');
(async () => {
  const { br, pg } = await L.open();
  console.log('player', JSON.stringify(await L.newPlayer(pg)));
  await L.sleep(1000); await L.closeModals(pg);
  console.log('nav', await L.nav(pg, 'wheel')); await L.sleep(1200); await L.closeModals(pg);
  await pg.ev('window.scrollTo(0,0)');
  const info = await pg.ev(`(function(){var w=document.getElementById('wheel');if(!w)return null;var r=w.getBoundingClientRect(),p=document.querySelector('.wheelwrap .pointer').getBoundingClientRect();
    return {bg:w.style.background||w.getAttribute('style'),labels:[].map.call(w.querySelectorAll('span'),function(s){return [s.textContent,s.style.transform]}),
      rect:[r.left,r.top,r.width,r.height],pointer:[p.left,p.top,p.width,p.height],btn:(document.querySelector('[data-act=spin]')||{}).outerHTML,note:(document.querySelector('.wheelwrap').parentNode.querySelector('.note')||{}).textContent}})()`);
  console.log(JSON.stringify(info, null, 1));
  // scroll the wheel into view and shoot it
  await pg.ev(`document.getElementById('wheel').scrollIntoView({block:'center'})`); await L.sleep(500);
  await pg.shot(L.OUTW + '/w1_wheel_tab.png');
  const r = await pg.ev(`(function(){var r=document.querySelector('.wheelwrap').getBoundingClientRect();return [r.left,r.top,r.width,r.height]})()`);
  await pg.shot(L.OUTW + '/w1_wheel_close.png', { x: r[0] - 20, y: r[1] - 20, width: r[2] + 40, height: r[3] + 40 });
  // facts for the sliver pool: SHOP items per brand and slot, flags, gar duplicates
  const facts = await pg.ev(`(function(){var x=window.__qb.x(),SHOP=x.SHOP,S=x.S;var re=/^a_(top|pants|shoes|acc|hat|back|mask)$/;
    var brandIds=${JSON.stringify(['hanga','y2k','over','rose','nc','alt','kp','sm','smk','gp','sp','bb','cr','km','oak','sv'])};
    var per={},flags={},gar={},dupGar=[],bOther={};SHOP.forEach(function(it){var e=it[6]||{};if(!e.b)return;
      if(brandIds.indexOf(e.b)<0){bOther[e.b]=(bOther[e.b]||0)+1;return}
      per[e.b]=per[e.b]||{n:0,slots:{},fo:0,mo:0,dungeon:0,g:0,nonrig:0};var p=per[e.b];p.n++;p.slots[it[1]]=(p.slots[it[1]]||0)+1;if(e.fo)p.fo++;if(e.mo)p.mo++;if(e.dungeon)p.dungeon++;if(e.g)p.g++;if(!(e.gar||e.basic))p.nonrig++;
      if(e.gar){if(gar[e.gar])dupGar.push([gar[e.gar],it[0]]);else gar[e.gar]=it[0]}});
    var dungeonAll=SHOP.filter(function(it){return it[6]&&it[6].dungeon}).map(function(it){return [it[0],it[1],it[6].b]});
    return {per:per,otherB:bOther,dupGar:dupGar,dungeon:dungeonAll.slice(0,40),nDungeon:dungeonAll.length,ownedNow:Object.keys(S.owned).filter(function(k){return S.owned[k]}),freezes:S.freezes,sex:S.char.sex}})()`);
  console.log(JSON.stringify(facts));
  console.log('errors', pg.errs.length, pg.errs.slice(0, 5));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
