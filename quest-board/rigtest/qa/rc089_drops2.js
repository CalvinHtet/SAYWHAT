// rc-0.89 QA, drops checks 7 and 9: the Shop header and countdown (now, and on a Wednesday with a brand back); an old v0.88 save
// (seed_adv2.json, with brand pieces added to its owned list as a v0.88 player could have bought them) opens the Shop and keeps them.
const L = require('./rc089_wheel_lib.js');
const setT = (pg, Y, M, D, h, m = 0, s = 0) => pg.ev(`(function(){var real=Date.now()-(window.__qbShift||0);window.__qbShift=${Date.UTC(Y, M - 1, D, h + 8, m, s)}-real;return new Date().toString().slice(0,24)})()`);
const splashes = (pg) => pg.ev(`(function(){var o=[];document.querySelectorAll('#layer .modal').forEach(function(m){var b=m.querySelector('.bsplash');o.push(b?'SPLASH '+(b.querySelector('.blg b')||{}).textContent:(m.textContent||'').replace(/\\s+/g,' ').slice(0,80));m.remove()});return o})()`);
const header = (pg) => pg.ev(`(function(){var h=document.querySelector('.qs-top');var tabs=[].map.call(document.querySelectorAll('.qs-tab'),function(t){return t.textContent+(t.classList.contains('on')?'*':'')});
  var lead=document.querySelector('.qs-lead');return {top:h&&h.innerText.replace(/\\n+/g,' / '),tabs:tabs,lead:lead&&lead.textContent,
  expect:(function(){var m=__qbDrops.mine(),n=m.next;if(!n)return null;var ms=__qbDrops.start(n.start)-Date.now(),mm=Math.floor(ms/6e4),d=Math.floor(mm/1440),hh=Math.floor(mm%1440/60);return n.name+' drops in '+(d?d+'d '+hh+'h':hh+'h '+mm%60+'m')})()}})()`);
async function shopShot(pg, file) {
  await L.nav(pg, 'shop'); await L.sleep(1200); console.log('  modals', JSON.stringify(await splashes(pg)));
  await pg.ev('window.scrollTo(0,0)'); await L.sleep(400);
  const h = await header(pg); console.log('  header', JSON.stringify(h));
  await pg.shot(L.OUTD + '/' + file); return h;
}
(async () => {
  const res = {};
  { // check 7
    const { br, pg } = await L.open();
    await L.newPlayer(pg); await L.sleep(2500); await L.closeModals(pg);
    await pg.ev(`(function(){window.__qbRooms.open('closet',1);var x=window.__qb.x();x.persist();x.render();return 1})()`); await L.sleep(3500);
    console.log('now', await pg.ev('new Date().toString().slice(0,24)'));
    res.now = await shopShot(pg, 'd2_shop_header_now.png');
    console.log('Wed 11-18 09:00', await setT(pg, 2026, 11, 18, 9)); await L.sleep(3000); await splashes(pg); await pg.ev('window.__qb.x().render();1');
    res.wed = await shopShot(pg, 'd2_shop_header_wed1118.png');
    // the back brand's tab
    await pg.ev(`(function(){var b=document.querySelector('.qs-tab[data-v=hanga]');if(b)b.click();return !!b})()`); await L.sleep(800); await splashes(pg);
    res.wedTab = await header(pg); console.log('  wed hanga tab', JSON.stringify(res.wedTab));
    await pg.shot(L.OUTD + '/d2_shop_wed1118_hanga_tab.png');
    console.log('Thu 11-19 08:01', await setT(pg, 2026, 11, 19, 8, 1)); await L.sleep(3000); await splashes(pg); await pg.ev('window.__qb.x().render();1');
    res.thu = await shopShot(pg, 'd2_shop_header_thu1119.png');
    console.log('Sun 11-15 23:00', await setT(pg, 2026, 11, 15, 23)); await L.sleep(3000); await splashes(pg); await pg.ev('window.__qb.x().render();1');
    res.sun = await header(pg); console.log('  sun header', JSON.stringify(res.sun));
    console.log('check7 errors', pg.errs.length, pg.errs.slice(0, 5));
    await br.close();
  }
  { // check 9
    const seed = JSON.parse(L.fs.readFileSync('C:/Users/clvh/qa-wt/out/seed_adv2.json', 'utf8'));
    const add = ['gx_h_hoodie', 'gx_h_cargo', 'gx_y_vjkt', 'gx_y_flare', 'gx_o_tee', 'gx_nc_tee', 'gx_sv_' /* placeholder, filtered below */].filter((x) => !/_$/.test(x));
    for (const k of Object.keys(seed)) { try { const s = JSON.parse(seed[k]); if (s && s.owned) { add.forEach((id) => (s.owned[id] = true)); s.eq = s.eq || {}; s.eq.a_top = 'gx_y_vjkt'; s.eq.a_pants = 'gx_h_cargo'; seed[k] = JSON.stringify(s); } } catch (e) {} }
    const { br, pg } = await L.open({ seed });
    const st = async (lab) => { const v = await pg.ev(`(function(a){var S=window.__qb.x().S;return {appv:S.v||null,owned:a.filter(function(id){return S.owned[id]}),eq:[S.eq.a_top,S.eq.a_pants],shopDay:S.shopDay,coins:S.coins,lvl:window.__qb.x().effLvl(),closet:S.base.slots.some(function(r){return r&&r.t==='closet'})}})(${JSON.stringify(add)})`); console.log(lab, JSON.stringify(v)); return v; };
    res.oldLoad = await st('old save loaded');
    await L.sleep(4000);
    res.old = await shopShot(pg, 'd2_oldsave_shop.png');
    await pg.ev(`(function(){var b=document.querySelector('.qs-tab[data-v=wardrobe]');if(b)b.click();return !!b})()`); await L.sleep(1200); console.log('  modals', JSON.stringify(await splashes(pg)));
    res.wardrobe = await pg.ev(`(function(){return [].map.call(document.querySelectorAll('.qs-rack [data-id], .qs-rack .qs-item, .qs-rack .item'),function(e){return e.dataset.id||e.textContent.slice(0,30)}).slice(0,40)})()`);
    console.log('  wardrobe rack', JSON.stringify(res.wardrobe));
    await pg.shot(L.OUTD + '/d2_oldsave_wardrobe.png');
    res.oldAfter = await st('after the Shop');
    await pg.ev('window.__qb.x().persist();1'); await L.sleep(800);
    await pg.go(L.BASE + '/'); await pg.wait('!!(window.__qb && window.__qb.x && document.querySelector("#app"))', 120000); await L.sleep(2500);
    res.oldReload = await st('after a reload');
    console.log('check9 errors', pg.errs.length, pg.errs.slice(0, 5));
    await br.close();
  }
  L.fs.writeFileSync(L.OUTD + '/d2.json', JSON.stringify(res, null, 1));
  process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
