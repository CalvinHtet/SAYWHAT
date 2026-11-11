// w-nospoil3 (BUILDER 17:12), the targeted checks next to nospoil3_play.js:
// A. the Garden window with 0, most and all of its upgrades, both greenhouse splashes and its help, with no Restaurant, then with one:
//    no Restaurant words before it opens (menu, dish, dinner, soup, salad, tart, pie, kitchen, chef, cook, Mara, Restaurant)
// B. a fresh level-1 save: the welcome letter names no Town Hall, challenge or dungeon; the roadmap letter ends "If you have an idea, tell me."
// C. a rainy day (the simulated weather: open-meteo is blocked so the game falls back to it): the weather chip says nothing about a Garden
//    the player doesn't have, and "Garden +30%" once it exists
// D. a Wheel sliver won before the Closet says "(saved for later)", and the piece is there once the Closet is built
//   BASE=<build> CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/wnospoil3_check.js
const fs = require('fs');
const { browser, sleep, boot, E, PAGE } = require('./wfocus_lib.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8819', OUT = process.env.OUT || require('os').tmpdir() + '/qa-out/wnospoil3/';
fs.mkdirSync(OUT, { recursive: true });
const RW = /\b(menus?|dish(es)?|dinners?|soups?|salads?|tarts?|pies?|kitchens?|chefs?|cook(s|ing)?|Mara|Restaurants?|diners?)\b/gi;
const words = (t) => [...new Set((t.match(RW) || []).map((w) => w.toLowerCase()))];
const ctx = (t) => { const o = []; let m; const g = new RegExp(RW.source, 'gi'); while ((m = g.exec(t)) && o.length < 6) o.push(t.slice(Math.max(0, m.index - 50), m.index + 40).replace(/\s+/g, ' ')); return o; };
const log = (...a) => console.log(a.map((v) => (typeof v === 'string' ? v : JSON.stringify(v))).join(' '));
(async () => {
  const br = await browser();
  // B first, on a brand-new character
  let pg = await boot(br, { base: BASE });
  const L = await pg.ev(`(async function(){var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})};document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});
    var b=document.querySelector('.ibbtn');if(!b)return {err:'no envelope'};b.click();await w(700);var ids=[].map.call(document.querySelectorAll('#layer .ibrow'),function(r){return r.dataset.id}),o={};
    for(var i=0;i<ids.length;i++){var r=document.querySelector('#layer .ibrow[data-id="'+ids[i]+'"]');if(!r)continue;r.click();await w(600);var m=document.querySelector('#layer .modal');o[ids[i]]=m?m.innerText.replace(/\\s+/g,' '):'';
      var bk=document.querySelector('#layer [data-ib=list]');bk&&bk.click();await w(300)}document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});return o})()`, 60000);
  for (const [id, t] of Object.entries(L)) { const bad = (t.match(/Town Hall|Hall\b|challeng\w*|dungeons?|Crawls?|Lair|Relics?/gi) || []);
    log(`B. letter ${id}: ${bad.length ? 'NAMES ' + JSON.stringify([...new Set(bad)]) : 'names none of Town Hall / challenge / dungeon'}${/roadmap|coming/i.test(id) ? ' | ends "' + t.replace(/\s*CLOSE\s*$/i, '').slice(-45) + '"' : ''}`); }
  // D: level 6, no Closet, a sliver (stub the wheel's random draw onto segment 1, a sliver)
  await E(pg, 'W.lvl(6)'); await sleep(500);
  const D = await pg.ev(`(async function(){var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})},x=window.__qb.x(),S=x.S;document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});
    var nb=document.querySelector('.nav button[data-v=wheel]');if(!nb)return {err:'no wheel tab'};nb.click();await w(800);document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});
    var r0=Math.random,n=0;Math.random=function(){n++;return n===1?0.205:r0()};var sb=document.querySelector('[data-act=spin]');if(!sb||sb.disabled){Math.random=r0;return {err:'spin button '+(sb?'disabled':'absent')}}
    var own0=Object.keys(S.owned||{}).length;sb.click();await w(9000);Math.random=r0;document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});
    return {closet:S.base.slots.some(function(r){return r&&r.t==='closet'}),res:S.wheelRes,owned:Object.keys(S.owned||{}).length-own0,shown:(document.getElementById('app').innerText.match(/Last result:[^\\n]*/)||[''])[0]}})()`, 60000);
  log('D. Wheel sliver before the Closet:', D);
  if (!D.err) {
    await E(pg, 'W.add("closet")'); await sleep(800);
    const D2 = await pg.ev(`(function(){var x=window.__qb.x(),S=x.S,res=S.wheelRes||'',name=res.split(' from ')[0],it=(x.SHOP||[]).filter(function(s){return s[2]===name})[0];return {piece:name,id:it&&it[0],owned:!!(it&&S.owned&&S.owned[it[0]])}})()`);
    log('   after the Closet is built:', D2); }
  log('   page errors', pg.errs.length, pg.errs.slice(0, 2)); await pg.close();
  // A: the Garden with no Restaurant (a level-12 player with the Loft rooms), then with one
  pg = await boot(br, { base: BASE }); await E(pg, 'W.lvl(12)'); for (const t of ['closet', 'patio', 'gameroom', 'garden']) await E(pg, `W.add("${t}")`); await E(pg, 'W.closeAll()');
  const garden = async (tag) => { const r = await pg.ev(`(async function(){var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})},x=window.__qb.x(),S=x.S,i=S.base.slots.findIndex(function(q){return q&&q.t==='garden'});
      document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});window.__qb.roomModal(i);await w(800);var m=document.querySelector('#layer .modal');var t=m?m.innerText:'';
      var hb=document.querySelector('#layer .rmodal [data-act=rhelp]');var h='';if(hb){hb.click();await w(500);var ms=document.querySelectorAll('#layer .modal');h=ms.length?ms[ms.length-1].innerText:''}
      document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});return {t:t,h:h}})()`, 30000);
    const all = r.t + '\n' + r.h; log(`A. Garden window ${tag}: words ${JSON.stringify(words(r.t))}, help ${JSON.stringify(words(r.h))}`, words(all).length ? ctx(all) : ''); return r; };
  await garden('with 0 upgrades');
  await E(pg, 'W.fill("garden",12)'); await garden('with 12 upgrades');
  // both greenhouses bought through their cards: their splashes
  const spl = await pg.ev(`(async function(){var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})},x=window.__qb.x(),S=x.S,i=S.base.slots.findIndex(function(q){return q&&q.t==='garden'}),out=[];S.coins=900000;
    for(var id of ['g_green1','g_green2']){document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});window.__qb.roomModal(i);await w(600);var b=document.querySelector('#layer [data-act=raddon][data-id="'+id+'"]');
      if(!b){S.base.slots[i].a[id]=1;out.push(id+': no button (set by hook)');continue}b.click();await w(1500);out.push(id+': '+[].map.call(document.querySelectorAll('#layer .modal,.dropsplash,.pop'),function(m){return m.innerText.replace(/\\s+/g,' ')}).join(' || ').slice(0,300))}
    document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});return out})()`, 60000);
  spl.forEach((s) => log('A. greenhouse: ' + s + (words(s).length ? '  <-- ' + JSON.stringify(words(s)) : '')));
  await E(pg, 'W.fill("garden",99)'); await garden('fully upgraded');
  // C: a rainy day, the Garden owned; then the same chip on a save without a Garden
  await pg.s('Fetch.enable', { patterns: [{ urlPattern: '*open-meteo*' }] });
  pg.on('Fetch.requestPaused', (e) => { pg.s('Fetch.failRequest', { requestId: e.requestId, errorReason: 'Failed' }).catch(() => {}); });
  const rain = async (tag) => { await pg.ev(`(function(){var real=Date.now()-(window.__qbShift||0);window.__qbShift=Date.parse("2026-12-05T20:00:00Z")-real;window.__qb.x().persist();return 1})()`);
    await pg.go(BASE + '/'); await pg.wait('!!(window.__qb && document.querySelector(".nav button[data-v=board]"))', 120000); await sleep(2500); await pg.ev(PAGE); await E(pg, 'W.closeAll()');
    await pg.ev('(function(){var b=document.querySelector(".nav button[data-v=hideout]");b&&b.click();return 1})()'); await sleep(3000); await E(pg, 'W.closeAll()');
    const chip = await pg.ev('(function(){var t=document.getElementById("app").innerText;var m=t.match(/[^\\n]*in LA[^\\n]*/);return m?m[0]:"(no weather chip)"})()');
    log(`C. ${tag}: weather chip "${chip}"`); await pg.shot(OUT + `rain_${tag.replace(/\W+/g, '_')}.png`); };
  await rain('rainy day, Garden owned');
  await pg.ev('(function(){var x=window.__qb.x(),S=x.S;S.base.slots=S.base.slots.map(function(r){return r&&r.t==="garden"?null:r});var o=window.__qbStory.state();delete o.done.garden;delete o.offer.garden;x.persist();return 1})()');
  await rain('rainy day, no Garden');
  // A again, with a Restaurant: the menu words may come back
  await pg.ev('(function(){window.__qbRooms.open("garden",1);window.__qbRooms.open("restaurant",1);var x=window.__qb.x();x.persist();x.render();return 1})()'); await E(pg, 'W.fill("garden",12)');
  await garden('with a Restaurant (allowed now)');
  log('page errors', pg.errs.length, pg.errs.slice(0, 2));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
