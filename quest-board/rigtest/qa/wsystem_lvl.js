// w-system (v0.91, LEAD 16:16): interface items and permanent upgrades stay hidden until the Lair's big screen. A fresh save walks
// level-ups 2 to 100 (qbDbg.levelUp, the real level-up window) with no Lair, and every window's text is searched for "New in the Shop",
// "UI upgrade:", interface item and upgrade names, and the Shop's "more items / restocks at level / shelf / Sealed" lines; the Shop tab
// is read at levels 5, 30, 60 and 100. Then the built app.js is searched for the same phrases (with where each hit sits).
//   BASE=<build> DIST=<its dist-web folder> CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/wsystem_lvl.js
const fs = require('fs');
const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8817', DIST = process.env.DIST || '';
const PHRASES = ['New in the Shop', 'UI upgrade', 'interface item', 'more items', 'Restocks at level', 'shelf', 'Sealed']; // matched ignoring case (labels are upper-cased by CSS)
const has = (t, ph) => t.toLowerCase().includes(ph.toLowerCase());
(async () => {
  const br = await browser(); const pg = await br.page({ fresh: true });
  await pg.go(BASE + '/'); await pg.wait('!!(window.__qb && document.querySelector("#app") && !document.querySelector("#app .boot"))', 120000); await sleep(2500);
  await pg.ev(`(function(){var x=window.__qb.x(),S=x.S;S.created=true;S.welcomed=1;S.char=window.__qb.fixChar({name:'Sys',sex:'m'});x.persist();x.render();return 1})()`);
  await pg.wait('!!(window.qbDbg && document.querySelector(".nav button[data-v=board]"))', 60000); await sleep(1500);
  // what counts as an interface item or upgrade: every Shop entry that isn't clothing, hair, dye or eyes
  const kinds = await pg.ev(`(function(){var o={};(window.__qb.x().SHOP||[]).forEach(function(s){o[s[1]]=(o[s[1]]||0)+1});return o})()`);
  console.log('Shop entry types:', JSON.stringify(kinds));
  const NAMES = await pg.ev(`(function(){return (window.__qb.x().SHOP||[]).filter(function(s){return !/^(a_|hair|dye|eye|skin|brow)/.test(s[1])&&!(s[6]&&s[6].b)}).map(function(s){return [s[0],s[1],s[2]]})})()`);
  console.log('interface items and upgrades:', NAMES.length, NAMES.slice(0, 8).map((n) => n.join(' ')).join(' | '));
  const nameRe = NAMES.filter((n) => n[2] && n[2].length > 3).map((n) => n[2]);
  const hits = [];
  for (let L = 2; L <= 100; L++) {
    const t = await pg.ev(`(function(L){var x=window.__qb.x(),S=x.S;document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});S.xp=x.cum(L);S.gates=S.gates||[];for(var g=0;g<40&&x.gated()!=null;g++)S.gates.push(x.gated());
      try{window.qbDbg.levelUp(L,null,L-1)}catch(e){return 'ERR '+e.message}var m=[].map.call(document.querySelectorAll('#layer .modal'),function(e){return e.innerText.replace(/\\s+/g,' ')}).join(' || ');
      if(L===10)window.__qbLvSample=m;document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});return m})(${L})`);
    const p = PHRASES.filter((ph) => has(t, ph)); const n = nameRe.filter((nm) => t.includes(nm));
    if (p.length || n.length || /^ERR/.test(t)) hits.push(`L${L}: ${p.join(', ')}${n.length ? ' names ' + n.slice(0, 5).join(', ') : ''}${/^ERR/.test(t) ? ' ' + t : ''} :: ${t.slice(0, 160)}`);
  }
  console.log('sample, level 10:', (await pg.ev('window.__qbLvSample||""')).slice(0, 300));
  console.log(`level-ups 2-100: ${hits.length} with a hit`); hits.slice(0, 30).forEach((h) => console.log('  ' + h));
  // the Shop tab at a few levels (no Lair)
  for (const L of [5, 30, 60, 100]) {
    const r = await pg.ev(`(async function(L){var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})},x=window.__qb.x(),S=x.S;S.xp=x.cum(L);S.gates=S.gates||[];for(var g=0;g<40&&x.gated()!=null;g++)S.gates.push(x.gated());S.lvPaid=L;
      if(!S.base.slots.some(function(r){return r&&r.t==='closet'})){var i=S.base.slots.indexOf(null);S.base.slots[i<0?S.base.slots.length:i]={t:'closet',a:{},st:0,pend:0}}
      x.persist();x.render();document.querySelectorAll('#layer .modal,.dropsplash').forEach(function(e){e.remove()});var b=document.querySelector('.nav button[data-v=shop]');b&&b.click();await w(900);
      document.querySelectorAll('#layer .modal,.dropsplash').forEach(function(e){e.remove()});var v=document.querySelector('#app');var tabs=[].map.call(document.querySelectorAll('.qs-tabs button,.qs-tabs a,[data-qtab],.shoptabs button'),function(e){return e.innerText.trim()}).filter(Boolean);
      return {lvl:x.effLvl(),tabs:tabs,text:v?v.innerText.replace(/\\s+/g,' '):''}})(${L})`, 30000);
    const p = PHRASES.filter((ph) => has(r.text, ph)); const n = nameRe.filter((nm) => r.text.includes(nm));
    console.log(`Shop at level ${r.lvl}: tabs ${JSON.stringify(r.tabs)}; phrases ${p.length ? p.join(', ') : 'none'}; interface/upgrade names ${n.length ? n.slice(0, 6).join(', ') + (n.length > 6 ? ' +' + (n.length - 6) : '') : 'none'}`);
  }
  console.log('page errors', pg.errs.length, pg.errs.slice(0, 3));
  await br.close();
  if (DIST) { const js = fs.readFileSync(DIST + '/app.js', 'utf8');
    for (const ph of PHRASES) { let i = -1, n = 0; const where = []; while ((i = js.indexOf(ph, i + 1)) >= 0) { n++; if (where.length < 4) where.push(js.slice(Math.max(0, i - 60), i + 40).replace(/\s+/g, ' ')); }
      console.log(`app.js "${ph}": ${n}${n ? '  e.g. ' + where.map((w) => '[' + w + ']').join(' ') : ''}`); } }
  process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
