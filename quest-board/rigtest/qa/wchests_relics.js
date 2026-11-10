// QA w-chests check 4: the Relics tab. Not owned, some of each tier owned, all owned; borders, tier labels, wings; the drawn
// placeholders when ui_relic2_<id>.webp is missing, and what a listed picture that fails to load looks like.
const { open, log, closeModals, shotEl, nav, sleep } = require('./wchests_lib.js');
const fs = require('fs');
const OUT = 'C:/Users/clvh/qa-wt/out/wchests/';
const L = log('relics');
(async () => {
  const { br, pg } = await open({ lv: 30 });
  const E = (s) => pg.ev(`(function(){var x=window.__qb.x(),S=x.S,F=window.__qbFree;${s}})()`);
  L('list', await E(`var by={};F.relics.forEach(function(r){(by[r.tier]=by[r.tier]||[]).push(r.name+(r.lv?' (lv '+r.lv+')':''))});return by`));
  L('art keys', await E(`var k=Object.keys(window.QBART||{});return {all:k.length,relic2:k.filter(function(n){return /^ui_relic2_/.test(n)})}`));
  const look = () => pg.ev(`(function(){var o={};[].forEach.call(document.querySelectorAll('.r2-grid .r2'),function(c){var t=(c.className.match(/r2-(low|mid|high|legendary)/)||[])[1],cs=getComputedStyle(c);
      var k=o[t]=o[t]||{cards:0,owned:0,border:cs.borderTopColor+' '+cs.borderTopWidth,labels:{},wings:0,img:0,svg:0,locked:0,texts:[]};k.cards++;if(!c.classList.contains('lock'))k.owned++;else k.locked++;
      var l=c.querySelector('.r2-t');k.labels[l?l.innerText:'none']=1;k.wings+=c.querySelectorAll('.r2-wing').length;k.img+=c.querySelectorAll('img.r2-img').length;k.svg+=c.querySelectorAll('svg.r2-img').length;
      if(k.texts.length<2)k.texts.push(c.innerText.replace(/\\s+/g,' ').slice(0,110))});
    o.heads=[].map.call(document.querySelectorAll('.r2-h'),function(h){return h.innerText});o.title=(document.querySelector('.r2-grid')||{closest:function(){return null}}).closest('section')?document.querySelector('.r2-grid').closest('section').querySelector('h3').innerText:null;
    o.oldRelics=[].map.call(document.querySelectorAll('section h3.label'),function(h){return h.innerText}).filter(function(t){return /relics|milestones/i.test(t)});return o})()`);
  const shots = async (tag) => {
    for (const t of ['low', 'mid', 'high', 'legendary']) {
      await pg.ev(`(function(){var h=document.querySelector('.r2-h-${t}');if(!h)return 0;var g=h.nextElementSibling;g.id='qa_${t}';return 1})()`);
      await shotEl(pg, '#qa_' + t, `relics_${tag}_${t}.png`, 18, true);
    }
  };
  await nav(pg, 'trophy'); await sleep(900);
  L('none owned', await look());
  await shots('none');
  // some of each tier
  await E(`S.relics2={};['r2_keyring','r2_teacup','r2_peg','r2_lunchtin','r2_lantern','r2_hilt','r2_hourglass','r2_phoenix','r2_familiar','r2_crown','r2_worldseed'].forEach(function(id){S.relics2[id]=Date.now()});x.persist();x.render();return 1`);
  await sleep(700);
  L('some owned', await look());
  await shots('some');
  // all owned
  await E(`S.relics2={};F.relics.forEach(function(r){S.relics2[r.id]=Date.now()});x.persist();x.render();return 1`); await sleep(700);
  L('all owned', await look());
  await shots('all');
  // a listed picture that fails to load (the key exists, the file does not)
  await E(`window.QBART=window.QBART||{};QBART['ui_relic2_r2_keyring.webp']='/art/app/ui_relic2_r2_keyring_MISSING.webp';x.render();return 1`); await sleep(1200);
  L('broken picture', await pg.ev(`(function(){var i=document.querySelector('.r2-low img.r2-img');if(!i)return null;var b=i.getBoundingClientRect();return {complete:i.complete,natural:i.naturalWidth,w:b.width,h:b.height,onerror:!!i.getAttribute('onerror')}})()`));
  await pg.ev(`(function(){var h=document.querySelector('.r2-h-low');h.nextElementSibling.id='qa_low2';return 1})()`);
  await shotEl(pg, '#qa_low2 .r2', 'relics_brokenart_card.png', 10, true);
  await E(`delete QBART['ui_relic2_r2_keyring.webp'];x.render();return 1`);
  // a high and a legendary card in the chest's big style (chest3Html is internal: the hidden chest with a high relic forced)
  await E(`S.relics2={};S.done={};window.__qbEcon.xp();S.dq.tx=300;S.dq.tier=2;var R=Math.random,n=0;Math.random=function(){n++;return n===1?0.99:R()};window.__qaR=R;window.__qbEcon.check();Math.random=R;return 1`);
  await sleep(600);
  L('forced high chest', await pg.ev(`(function(){var m=document.querySelector('#layer .dqc');return m?m.innerText.replace(/\\s+/g,' ').slice(0,300):null})()`));
  await shotEl(pg, '#layer .dqc .r2-big', 'relics_chest_high.png', 12);
  L('page errors', pg.errs.length, pg.errs.slice(0, 5));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
