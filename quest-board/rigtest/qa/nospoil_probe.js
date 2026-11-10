// SPEC9 QA probe: fresh player state, room names, openers (read only)
const fs = require('fs');
const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8815', OUT = 'C:/Users/clvh/qa-wt/out/nospoil';
(async () => {
  const br = await browser();
  const pg = await br.page({ fresh: true });
  await pg.go(BASE + '/');
  await pg.wait('!!(window.__qb && document.querySelector("#app") && !document.querySelector("#app .boot"))', 120000); await sleep(2000);
  await pg.ev(`(function(){var x=window.__qb.x(),S=x.S;S.created=true;S.char=window.__qb.fixChar({name:'Nova',sex:'f'});x.persist();x.render();return 1})()`);
  await sleep(2500);
  const r = await pg.ev(`(function(){var x=window.__qb.x(),S=x.S,o={};
    o.slots=S.base.slots.map(function(r){return r&&r.t});o.lvl=x.effLvl();o.xp=S.xp;o.coins=S.coins;o.QB_WEB=JSON.stringify(window.QB_WEB||null);
    o.rooms=Object.keys(x.ROOMT).map(function(t){return t+'='+x.ROOMT[t].name});
    o.openers=[];Object.keys(x.ADDONS).forEach(function(t){(x.ADDONS[t]||[]).forEach(function(a){if(a[3]&&a[3].opens)o.openers.push(t+':'+a[0]+'>'+a[3].opens+' "'+a[1]+'" lv'+(a[3].lv||'')+' $'+a[2]+(a[3].secret?' secret':'')+(a[3].retired?' retired':''))})});
    o.nav=[].map.call(document.querySelectorAll('.nav button'),function(b){return b.dataset.v+'|'+b.innerText.replace(/\s+/g,' ')+'|'+b.getAttribute('aria-label')});
    o.modals=[].map.call(document.querySelectorAll('#layer .modal'),function(m){return m.innerText.slice(0,200).replace(/\s+/g,' ')});
    o.view=document.querySelector('.nav button.on')&&document.querySelector('.nav button.on').dataset.v;
    o.splash=!!document.querySelector('.dropsplash');
    return o})()`);
  console.log(JSON.stringify(r, null, 1));
  console.log('errors', pg.errs.length, pg.errs.slice(0, 3));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
