// v0.90 re-test (BUILDER 13:43): w-polish round 2 79bde31 and the w-update amendment 1b20e92.
//   POLISH=<build, APPV 89> LETTERS=<the same commit built with APPV 90> bash tools/windows/node.sh rigtest/qa/wupdate2.js
// 1. every upgrade's line says "Earns +N% here." at most once; 2. the embers rest after about 4 s on a still screen and wake on a touch;
// 3. letters: v0.90 "Ten updates in one letter" and the roadmap "What's coming" read exactly as Cal approved; a letter every 10 versions,
//    500 coins once on opening, only the newest 2 missed letters pay.
const fs = require('fs');
const { browser, sleep } = require('./cdp.js');
const POLISH = process.env.POLISH || 'http://127.0.0.1:8825', LETTERS = process.env.LETTERS || 'http://127.0.0.1:8826';
const SEED = JSON.parse(fs.readFileSync('C:/Users/clvh/qa-wt/out/seed_adv2.json', 'utf8'));
const V90 = ['Level scaling and economy rebalanced', 'Daily quest goals and payouts rebalanced', 'Introduced relic tiers (low, med, high, legendary)',
  'Town Hall: posts, chat, a weekly ranking and coin challenges', 'Training: your own workouts and progress graphs', 'New brand drops twice a week, with clothes priced by quality'];
const ROAD = ['More friends dropping by, with their own stories', 'More ways to compete', 'A new building in town, with rooms to upgrade and explore',
  'More brand drops, cosmetics and accessories', 'Pets, with outfits of their own', 'New ways to earn coins, and new upgrades to unlock', 'Faster and smoother'];
const CLOSE = 'And more after that. If you have an idea, tell me in the Town Hall.';
const log = (...a) => console.log(a.map((x) => (typeof x === 'string' ? x : JSON.stringify(x))).join(' '));
async function open(br, base, hook) {
  const pg = await br.page({ fresh: true });
  if (hook) await pg.s('Page.addScriptToEvaluateOnNewDocument', { source: hook });
  await pg.go(base + '/version.json'); await pg.ev(`(function(d){Object.keys(d).forEach(function(k){localStorage.setItem(k,d[k])});return 1})(${JSON.stringify(SEED)})`);
  await pg.go(base + '/'); await pg.wait('!!(window.__qb && document.querySelector(".nav button[data-v=board]"))', 120000); await sleep(3000);
  for (let k = 0; k < 8; k++) { await pg.ev('(function(){document.querySelectorAll(".dropsplash .dsx").forEach(function(b){b.click()});document.querySelectorAll("#layer .modal").forEach(function(e){e.remove()});return 1})()'); await sleep(300); }
  return pg;
}
(async () => {
  const br = await browser();
  // 1 + 2 on the polish build
  const HOOK = `(function(){var C=window.__qaE={n:0};var ra=window.requestAnimationFrame;window.requestAnimationFrame=function(f){if(f&&f.name==='loop'&&/--accent/.test(String(f)))C.n++;return ra.apply(this,arguments)}})();`;
  const pg = await open(br, POLISH, HOOK);
  const earns = await pg.ev(`(function(){var A=window.__qb.x().ADDONS,twice=[],with1=0,total=0;Object.keys(A).forEach(function(k){(A[k]||[]).forEach(function(a){total++;var m=String(a[4]||'').match(/Earns \\+[0-9.]+% here\\./g)||[];if(m.length===1)with1++;if(m.length>1)twice.push(k+'.'+a[0]+' x'+m.length)})});return {total:total,withOne:with1,twice:twice}})()`);
  log('1. "Earns +N% here." per upgrade:', earns);
  const rate = async (ms) => { const a = await pg.ev('__qaE.n'); await sleep(ms); return ((await pg.ev('__qaE.n')) - a) / (ms / 1000); };
  await pg.ev('(function(){var b=document.querySelector(".nav button[data-v=board]");b&&b.click();return 1})()');
  const r0 = await rate(1000); await sleep(4000); const r1 = await rate(3000);
  await pg.s('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 200, y: 600 }] }); await pg.s('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  const r2 = await rate(1500); await sleep(5000); const r3 = await rate(2000);
  await pg.s('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 120, y: 300 }); await pg.s('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 120, y: 300, deltaX: 0, deltaY: 120 });
  const r4 = await rate(1500);
  log('2. embers frames/s: just after a tab tap', r0, '| after 4 s still', r1, '| after a touch', r2, '| still again 5 s later', r3, '| after a scroll', r4);
  log('   embers canvas present:', await pg.ev('[].some.call(document.querySelectorAll("canvas"),function(c){return c.style.position==="fixed"})'), 'page errors', pg.errs.length);
  await pg.close();
  // 3 on the APPV 90 build
  const p2 = await open(br, LETTERS);
  const L = await p2.ev(`(async function(){var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})},x=window.__qb.x(),S=x.S;
    var b=document.querySelector('.ibbtn');var badge=b&&b.querySelector('i')?b.querySelector('i').textContent:'0';b&&b.click();await w(700);
    var rows=[].map.call(document.querySelectorAll('#layer .ibrow'),function(r){return {id:r.dataset.id,t:r.innerText.replace(/\\s+/g,' ')}});
    var read=async function(id){var r=document.querySelector('#layer .ibrow[data-id="'+id+'"]');if(!r)return null;var c=S.coins;r.click();await w(700);var m=document.querySelector('#layer .modal');
      var o={subj:(m.querySelector('h2')||{}).textContent,from:(m.querySelector('.label')||{}).textContent,items:[].map.call(m.querySelectorAll('.ibbody li'),function(li){return li.textContent}),body:(m.querySelector('.ibbody')||{}).innerText,paid:S.coins-c};
      var bk=m.querySelector('[data-ib=list]');bk&&bk.click();await w(500);return o};
    var v90=null,road=null;rows.forEach(function(r){if(/Ten updates/.test(r.t))v90=r.id;if(/coming/i.test(r.t))road=r.id});
    var a=v90?await read(v90):null,again=v90?await read(v90):null,rd=road?await read(road):null;return {badge:badge,rows:rows,v90:a,v90again:again?again.paid:null,road:rd}})()`, 60000);
  log('3. inbox rows:', L.rows.map((r) => r.id + ' "' + r.t + '"'), 'badge', L.badge);
  const v = L.v90 || {}; const okV = JSON.stringify(v.items) === JSON.stringify(V90);
  log('   v0.90 letter:', v.subj, '| from', v.from, '| lines verbatim', okV, okV ? '' : JSON.stringify(v.items), '| paid on opening', v.paid, '| second open', L.v90again);
  const rd = L.road || {}; const okR = JSON.stringify(rd.items) === JSON.stringify(ROAD) && String(rd.body || '').includes(CLOSE);
  log('   roadmap:', rd.subj, '| lines + closing verbatim', okR, okR ? '' : JSON.stringify(rd.items) + ' / ' + String(rd.body || '').slice(-120), '| paid', rd.paid);
  // every 10 versions, 500 for the newest 2: inject older letters, a save that last ran v0.65
  const T = await p2.ev(`(async function(){var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})},U=window.__qbUpd,x=window.__qb.x(),S=x.S;
    var vs=U.notes.map(function(p){return p.v});[70,80,85].forEach(function(v){U.notes.push({v:v,lines:['Test line for v0.'+v,'Another line','A third line']})});
    S.pn={from:65};['pn70','pn80','pn85','pn90'].forEach(function(id){if(S.letters&&S.letters.paid)delete S.letters.paid[id];if(S.letters&&S.letters.read)delete S.letters.read[id]});
    document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});x.render();var b=document.querySelector('.ibbtn');b&&b.click();await w(700);
    var ids=[].map.call(document.querySelectorAll('#layer .ibrow'),function(r){return r.dataset.id}),pays={};
    for(var id of ['pn90','pn85','pn80','pn70']){var r=document.querySelector('#layer .ibrow[data-id="'+id+'"]');if(!r){pays[id]='hidden';continue}var c=S.coins;r.click();await w(600);pays[id]=S.coins-c;var bk=document.querySelector('#layer [data-ib=list]');bk&&bk.click();await w(400)}
    return {shipped:vs,ids:ids,pays:pays}})()`, 60000);
  log('   every 10 versions (save last ran v0.65; test letters 70, 80, 85 added):', T);
  log('   page errors', p2.errs.length, p2.errs.slice(0, 3));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
