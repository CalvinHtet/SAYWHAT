// w-sound (v0.92, W56): every purchase and coin sound, counted in a muted headless Chrome (audhook.js records each oscillator or noise
// source the page starts). A: nothing on load (an advanced save with business coins waiting, a level-up and a Daily Quest chest due,
// a sound pack on), before any tap. B: the profile's "Sound: on/off" (beside Wardrobe at 390 px, a long name too, the toast, S.sndOff,
// a reload). C: one sound each for a Shop buy (a real Shop button), a refused buy (none), a room upgrade (build), an opener (big), a lot
// (big), Collect and Collect all (coins), a Daily Quest chest (chest), a paint job (buy); each 0.6 s or less; two buys within 120 ms make
// one sound. D: a hidden page and Sound off make none (a pack too; "Play it" says sound is off). E: a pack (so_arcade) replaces them
// with its own notes; level-up sounds only with a pack. Sounds by their notes: build has a 150 Hz thud, big a 120 Hz thud and 1319/1568/
// 2093, buy 1568 + 2093, coins 6 pings 2200-3500, chest 9 pings.
//   BASE=<sandbox build> CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/wsound.js
const fs = require('fs');
const SEEDS = require('path').join(__dirname, 'seeds') + '/';
const { browser, sleep } = require('./cdp.js');
const { AUDHOOK, bursts } = require('./audhook.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8813';
const P = []; const ok = (c, s) => { console.log((c ? 'ok   ' : 'BAD  ') + s); if (!c) P.push(s); };
const ymd = () => new Date(Date.now() - 5 * 36e5).toLocaleDateString('en-CA');
// evaluate WITHOUT a user gesture (cdp.js's ev always passes one)
const evNG = async (pg, expr) => { const r = await pg.s('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true, userGesture: false }); if (r.exceptionDetails) throw new Error('eval: ' + JSON.stringify(r.exceptionDetails).slice(0, 300)); return r.result.value; };
const AUD = (pg) => pg.ev('JSON.parse(JSON.stringify(window.__aud))');
// do something in the page, wait, and return the sounds it made
const act = async (pg, expr, wait = 900) => { const t = await pg.ev('Math.round(performance.now()-window.__aud.t0)'); const r = await pg.ev(expr); await sleep(wait); return { r, b: bursts(await AUD(pg), t) }; };
// a falling thud reads as 440 Hz (frequency.value before its automation), so the dings tell the sounds apart
const sig = (b) => { const h = b.hz || [], has = (...z) => z.every((v) => h.includes(v)); return b.n >= 17 ? 'chest' : b.n >= 10 && !has(1568) ? 'coins' : has(1319, 1568, 2093) ? 'big' : has(1760) ? 'build' : has(1568, 2093) ? 'buy' : has(1568) ? 'on' : 'pack:' + b.waves + ':' + h.join('/'); };
const say = (x) => x.b.map((b) => `${sig(b)} (${b.n} sources: ${b.kinds}, ${b.span} s)`).join(', ') || 'silent';
const click = (sel) => `(function(){var b=document.querySelector('${sel}');if(!b)return null;b.click();return 1})()`;
const btn = (attrs) => `(function(){var b=document.createElement('button');${Object.entries(attrs).map(([k, v]) => `b.setAttribute('${k}','${v}');`).join('')}b.style.display='none';document.querySelector('#app').appendChild(b);b.click();b.remove();return 1})()`;
(async () => {
  const br = await browser();
  // A. load: an advanced save, business coins waiting, XP for a level-up, a Daily Quest chest due, so_arcade equipped; no tap at all
  const seed = JSON.parse(fs.readFileSync(SEEDS + 'v90_adv.json', 'utf8'));
  for (const k of ['quest-board', 'qbsbx:data/users/sandbox/state']) if (seed[k]) { const s = JSON.parse(seed[k]);
    s.dq = { d: ymd(), tx: 150, spent: 0, paid: 0, done: 0, hid: 0, buff: 0 }; s.owned = s.owned || {}; s.owned.so_arcade = true; s.eq = s.eq || {}; s.eq.sound = 'so_arcade';
    (s.base && s.base.slots || []).forEach((r) => { if (r) r.pend = 400; }); s.xp = (s.xp || 0) + 40000; seed[k] = JSON.stringify(s); }
  let pg = await br.page({ fresh: true }); await pg.s('Page.addScriptToEvaluateOnNewDocument', { source: AUDHOOK });
  await pg.go(BASE + '/version.json'); await evNG(pg, `(function(d){localStorage.clear();Object.keys(d).forEach(function(k){localStorage.setItem(k,d[k])});return 1})(${JSON.stringify(seed)})`);
  await pg.go(BASE + '/'); await sleep(14000);
  const a0 = await evNG(pg, 'JSON.stringify({aud:window.__aud,lv:window.__qb&&window.__qb.x().effLvl(),dq:window.__qb&&window.__qb.x().S.dq,modals:[].map.call(document.querySelectorAll("#layer .modal"),function(m){return m.innerText.replace(/\\s+/g," ").slice(0,50)})})');
  const A0 = JSON.parse(a0);
  console.log('A. after 14 s, no tap:', JSON.stringify({ ctx: A0.aud.ctx, starts: A0.aud.starts.length, firstStarts: A0.aud.starts.slice(0, 3), dq: A0.dq && { tier: A0.dq.tier, done: A0.dq.done }, modals: A0.modals }));
  ok(A0.aud.starts.length === 0, `A. nothing plays on load without a tap (sources started: ${A0.aud.starts.length}, audio contexts: ${A0.aud.ctx})`);
  ok(!pg.errs.length, `A. page errors on load: ${pg.errs.length} ${pg.errs.slice(0, 1)}`);
  await pg.close();

  // B-E on a fresh level-30 player with rooms
  pg = await br.page({ fresh: true }); await pg.s('Page.addScriptToEvaluateOnNewDocument', { source: AUDHOOK });
  await pg.go(BASE + '/'); await pg.wait('!!(window.__qb && window.__qbStory && document.querySelector("#app") && !document.querySelector("#app .boot"))', 120000); await sleep(2500);
  await pg.ev(`(function(){var x=window.__qb.x(),S=x.S;S.created=true;S.char=window.__qb.fixChar({name:'Fey',sex:'f'});S.welcomed=1;S.xp=x.cum(30);var g,n=0;S.gates=S.gates||[];while((g=x.gated())!==null&&n++<80)S.gates.push(g);
    S.coins=5e6;['closet','patio','garden','restaurant'].forEach(function(t){window.__qbRooms.open(t,1)});x.persist();x.render();document.querySelectorAll('#layer .modal,.dropsplash,.bsplash').forEach(function(m){m.remove()});return x.effLvl()})()`);
  await sleep(1500); await pg.ev('(function(){document.querySelectorAll("#layer .modal,.dropsplash,.bsplash").forEach(function(m){m.remove()});return 1})()');
  // B. the profile switch
  const prof = async () => { await pg.ev('(function(){document.querySelectorAll("#layer .modal").forEach(function(m){m.remove()});return 1})()'); await pg.ev(click('[data-act=char]')); await sleep(900);
    return pg.ev(`(function(){var m=document.querySelector('#layer .prof'),w=m&&m.querySelector('[data-act=wardrobe]'),s=m&&m.querySelector('.sndtog');if(!s)return {sound:null};var R=function(e){var r=e.getBoundingClientRect();return {t:Math.round(r.top),b:Math.round(r.bottom),l:Math.round(r.left),r:Math.round(r.right)}};
      return {sound:s.innerText,pressed:s.getAttribute('aria-pressed'),wardrobe:w&&R(w),btn:R(s),box:R(m),vw:innerWidth}})()`); };
  let p1 = await prof(); console.log('B. profile:', JSON.stringify(p1));
  ok(p1.sound === 'Sound: on' && p1.pressed === 'true', `B. "Sound: on" in the profile (${p1.sound})`);
  const inBox = (p) => p.btn && p.btn.r <= p.box.r && p.btn.l >= p.box.l && p.btn.r <= p.vw;
  ok(p1.wardrobe && Math.abs(p1.btn.t - p1.wardrobe.t) < 6 && inBox(p1), `B. beside Wardrobe, inside the window at 390 px`);
  let x = await act(pg, `(function(){var b=document.querySelector('#layer .sndtog');b.click();var S=window.__qb.x().S;return {off:S.sndOff,btn:(document.querySelector('#layer .sndtog')||{}).innerText,pops:[].map.call(document.querySelectorAll('#layer .pop'),function(p){return p.innerText})}})()`);
  ok(x.r.off === 1 && x.r.btn === 'Sound: off' && x.r.pops.some((t) => /Sound off/.test(t)) && !x.b.length, `B. tap: S.sndOff=1, "Sound: off", toast "Sound off", silent: ${JSON.stringify(x.r)} ${say(x)}`);
  const persisted = await pg.ev(`(function(){var k=['quest-board','qbsbx:data/users/sandbox/state'].filter(function(k){return localStorage.getItem(k)});return k.map(function(k){return JSON.parse(localStorage.getItem(k)).sndOff})})()`);
  ok(persisted.length && persisted.every((v) => v === 1), `B. saved: sndOff ${JSON.stringify(persisted)}`);
  x = await act(pg, `(function(){var b=document.querySelector('#layer .sndtog');b.click();return {off:window.__qb.x().S.sndOff,btn:(document.querySelector('#layer .sndtog')||{}).innerText}})()`);
  ok(!x.r.off && x.r.btn === 'Sound: on' && x.b.length === 1, `B. tap again: on, and one small sound: ${JSON.stringify(x.r)} ${say(x)}`);
  await pg.ev(`(function(){var x=window.__qb.x();x.S.char.name='Bartholomew Fitzgerald-Smythe';x.persist();return 1})()`);
  const p2 = await prof(); ok(inBox(p2) && p2.wardrobe && p2.btn.b <= p2.box.b, `B. a long name: the switch stays inside the window ${JSON.stringify({ btn: p2.btn, wardrobe: p2.wardrobe, box: p2.box })}`);
  await pg.ev('(function(){var x=window.__qb.x();x.S.char.name="Fey";x.persist();document.querySelectorAll("#layer .modal").forEach(function(m){m.remove()});return 1})()');
  // C. the sounds
  const S = (e) => pg.ev(`(function(){var x=window.__qb.x(),S=x.S;return (${e})})()`);
  // a real Shop button
  await pg.ev(click('.nav button[data-v=shop]')); await sleep(2500); await pg.ev('(function(){document.querySelectorAll("#layer .modal,.dropsplash").forEach(function(m){m.remove()});return 1})()');
  x = await act(pg, `(async function(){var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})};var t=[].slice.call(document.querySelectorAll('#app [data-act=qstry]')),ids=[],seen={};
    for(var i=0;i<t.length&&ids.length<2;i++){var id=t[i].dataset.id,it=window.__qb.x().SHOP.filter(function(x){return x[0]===id})[0];if(!it||seen[it[1]])continue;seen[it[1]]=1;var b=document.querySelector('#app [data-act=qstry][data-id="'+id+'"]');if(b){b.click();ids.push(id);await w(300)}}
    var c=document.querySelector('[data-act=qscheck]');if(!c)return {ids:ids,check:null};c.click();await w(500);var k=document.querySelector('#layer [data-act=qsconfirm]');if(!k)return {ids:ids,confirm:null};k.click();await w(200);var S=window.__qb.x().S;return {ids:ids,owned:ids.map(function(id){return !!S.owned[id]})}})()`, 1200);
  ok(x.r && x.r.owned && x.r.owned.length === 2 && x.r.owned.every(Boolean) && x.b.length === 1 && sig(x.b[0]) === 'buy' && x.b[0].span <= 0.6, `C. the Shop's real checkout of 2 tried-on pieces (${JSON.stringify(x.r)}): one sound, ${say(x)}`);
  const unowned = await S(`x.SHOP.filter(function(it){return !S.owned[it[0]]&&it[3]>0&&it[1]!=="sound"&&it[1]!=="buff"}).map(function(it){return it[0]})`);
  await sleep(200);
  x = await act(pg, `(function(){var S=window.__qb.x().S,c=S.coins;S.coins=0;${btn({ 'data-act': 'buy', 'data-id': unowned[0] })};var r={owned:!!S.owned['${unowned[0]}'],pops:[].map.call(document.querySelectorAll('#layer .pop'),function(p){return p.innerText}).slice(-1)};S.coins=c;return r})()`);
  ok(!x.r.owned && !x.b.length, `C. a refused buy (no coins) is silent: ${JSON.stringify(x.r)} ${say(x)}`);
  x = await act(pg, `(function(){${btn({ 'data-act': 'buy', 'data-id': unowned[1] })};${btn({ 'data-act': 'buy', 'data-id': unowned[2] })};var S=window.__qb.x().S;return [S.owned['${unowned[1]}'],S.owned['${unowned[2]}']]})()`);
  ok(x.r[0] && x.r[1] && x.b.length === 1, `C. two buys within 120 ms: one sound (${say(x)})`);
  // room upgrades: one plain, one that opens a room or has a splash
  const ups = await S(`(function(){var o={plain:[],big:[]};S.base.slots.forEach(function(r,i){if(!r)return;(x.ADDONS[r.t]||[]).forEach(function(a){var e=a[3]||{};if(r.a[a[0]]||e.retired||e.trophy||e.req)return;(e.opens||e.splash?o.big:o.plain).push([i,a[0],a[1]])})});return o})()`);
  const tryUp = async (list, want) => { for (const [i, id, name] of list.slice(0, 12)) {
    await sleep(200); const y = await act(pg, `(function(){${btn({ 'data-act': 'raddon', 'data-i': i, 'data-id': id })};var r=window.__qb.x().S.base.slots[${i}];document.querySelectorAll("#layer .modal,.bsplash,.dropsplash").forEach(function(m){m.remove()});return !!(r&&r.a['${id}'])})()`);
    if (y.r) return { name, y }; } return null; };
  let u = await tryUp(ups.plain); ok(u && u.y.b.length === 1 && sig(u.y.b[0]) === 'build' && u.y.b[0].span <= 0.6, `C. a room upgrade (${u && u.name}): ${u ? say(u.y) : 'none bought'}`);
  u = await tryUp(ups.big); ok(u && u.y.b.length === 1 && sig(u.y.b[0]) === 'big' && u.y.b[0].span <= 0.6, `C. an opener / splash upgrade (${u && u.name}): ${u ? say(u.y) : 'none bought'}`);
  const lot = await S(`Object.keys(x.ROOMT).filter(function(t){var T=x.ROOMT[t];return !T.bundled&&!T.needCls&&!S.base.slots.some(function(r){return r&&r.t===t})})[0]`);
  const nsl = await S('S.base.slots.length'); await sleep(200);
  x = await act(pg, `(function(){${btn({ 'data-act': 'rdo', 'data-i': nsl, 'data-t': lot })};document.querySelectorAll("#layer .modal,.bsplash,.dropsplash").forEach(function(m){m.remove()});return window.__qb.x().S.base.slots.some(function(r){return r&&r.t==='${lot}'})})()`);
  ok(x.r && x.b.length === 1 && sig(x.b[0]) === 'big', `C. a room on a new lot (${lot}): ${say(x)}`);
  x = await act(pg, `(function(){var S=window.__qb.x().S,c=S.coins;S.dq=null;window.__qbEcon.xp();S.dq.tx=150;window.__qbEcon.check();var m=document.querySelector('#layer .dqc');return {coins:S.coins-c,win:m?m.innerText.replace(/\s+/g,' ').slice(0,40):null}})()`, 1200);
  ok(x.r.win && x.b.length === 1 && sig(x.b[0]) === 'chest' && x.b[0].span <= 0.6, `C. a Daily Quest chest (${JSON.stringify(x.r)}): ${say(x)}`);
  await pg.ev('(function(){document.querySelectorAll("#layer .modal").forEach(function(m){m.remove()});return 1})()');
  const biz = await S(`S.base.slots.map(function(r,i){return r?i:-1}).filter(function(i){return i>=0})`);
  await sleep(200); x = await act(pg, `(function(){var S=window.__qb.x().S;S.base.slots.forEach(function(r){if(r)r.pend=300});S.cdone={qa:20000};S.dq&&(S.dq.paid=0);var c=S.coins;${btn({ 'data-act': 'rcollect', 'data-i': biz[1] })};return S.coins-c})()`);
  ok(x.r > 0 && x.b.length === 1 && sig(x.b[0]) === 'coins', `C. Collect (+${x.r} coins): ${say(x)}`);
  await sleep(200); x = await act(pg, `(function(){var S=window.__qb.x().S;S.base.slots.forEach(function(r){if(r)r.pend=300});S.cdone={qa:20000};S.dq&&(S.dq.paid=0);var c=S.coins;${btn({ 'data-act': 'rall', 'data-i': 0 })};return S.coins-c})()`);
  ok(x.r > 0 && x.b.length === 1 && sig(x.b[0]) === 'coins', `C. Collect all (+${x.r} coins): ${say(x)}`);
  await pg.ev('(function(){document.querySelectorAll("#layer .modal").forEach(function(m){m.remove()});return 1})()');
  await sleep(200); x = await act(pg, `(function(){var S=window.__qb.x().S,c=S.coins;${btn({ 'data-act': 'rpaint', 'data-i': biz[0] })};document.querySelectorAll("#layer .modal").forEach(function(m){m.remove()});return c-S.coins})()`);
  ok(x.r === 150 && x.b.length === 1 && sig(x.b[0]) === 'buy', `C. a paint job (-${x.r} coins): ${say(x)}`);
  // D. a hidden page, Sound off
  const one = async () => { await sleep(200); const list = await S(`(function(){var o=[];S.base.slots.forEach(function(r,i){if(!r)return;(x.ADDONS[r.t]||[]).forEach(function(a){var e=a[3]||{};if(!r.a[a[0]]&&!e.retired&&!e.trophy&&!e.req&&!e.opens&&!e.splash)o.push([i,a[0],a[1]])})});return o})()`);
    return tryUp(list); };
  await pg.ev(`(function(){Object.defineProperty(document,'hidden',{configurable:true,get:function(){return true}});document.dispatchEvent(new Event('visibilitychange'));return 1})()`);
  u = await one(); ok(u && !u.y.b.length, `D. a hidden page: an upgrade (${u && u.name}) is silent: ${u ? say(u.y) : '-'}`);
  await pg.ev(`(function(){delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));return document.hidden})()`);
  u = await one(); ok(u && u.y.b.length === 1, `D. visible again: an upgrade sounds (${u ? say(u.y) : '-'})`);
  await pg.ev(`(function(){var S=window.__qb.x().S;S.sndOff=1;window.__qb.x().persist();return 1})()`);
  u = await one(); x = await act(pg, `(function(){${btn({ 'data-act': 'buy', 'data-id': unowned[3] })};var S=window.__qb.x().S;S.base.slots.forEach(function(r){if(r)r.pend=300});S.cdone={qa:20000};S.dq&&(S.dq.paid=0);${btn({ 'data-act': 'rall', 'data-i': 0 })};return 1})()`);
  ok(u && !u.y.b.length && !x.b.length, `D. Sound off: upgrade, buy, Collect all all silent (${u ? say(u.y) : '-'}; ${say(x)})`);
  await pg.ev(`(function(){var S=window.__qb.x().S;S.owned.so_arcade=true;S.eq.sound='so_arcade';window.__qb.x().persist();return 1})()`);
  u = await one(); ok(u && !u.y.b.length, `D. Sound off + so_arcade equipped: silent (${u ? say(u.y) : '-'})`);
  x = await act(pg, `(function(){${btn({ 'data-act': 'iftry', 'data-id': 'so_temple' })};return [].map.call(document.querySelectorAll('#layer .pop'),function(p){return p.innerText}).slice(-1)})()`);
  ok(!x.b.length && x.r.some((t) => /Sound is off\. Turn it on in your profile\./.test(t)), `D. "Play it" on a pack with Sound off: ${JSON.stringify(x.r)} ${say(x)}`);
  // E. a pack replaces the sounds; level-up
  await pg.ev(`(function(){var S=window.__qb.x().S;S.sndOff=0;window.__qb.x().persist();return 1})()`);
  u = await one(); ok(u && u.y.b.length === 1 && /square/.test(u.y.b[0].waves) && (u.y.b[0].hz || []).join() === '880,1175', `E. so_arcade: an upgrade plays the pack's buy notes (${u ? say(u.y) + ' ' + JSON.stringify(u.y.b[0]) : '-'})`);
  const lvq = async () => act(pg, `(function(){var x=window.__qb.x(),S=x.S;S.quests.push({id:'qlv'+Date.now(),name:'Big job',xp:500,stat:'discipline',cl:'home',rep:'once'});x.persist();x.render();S.xp=x.cum(x.effLvl()+1)-200;var q=S.quests[S.quests.length-1];var d=S.dq;d.tier=window.__qbEcon.ECON.dqTiers.length;d.done=1;x.toggle(q.id);return x.effLvl()})()`, 1500);
  x = await lvq(); ok(x.b.length >= 1 && x.b.some((b) => /square/.test(b.waves)), `E. a level-up with a pack: its sounds (level ${x.r}; ${say(x)})`);
  await pg.ev(`(function(){var S=window.__qb.x().S;delete S.eq.sound;window.__qb.x().persist();document.querySelectorAll("#layer .modal").forEach(function(m){m.remove()});return 1})()`);
  x = await lvq(); ok(!x.b.length, `E. a level-up without a pack: silent, as designed (level ${x.r}; ${say(x)})`);
  // the reload keeps Sound off
  await pg.ev(`(function(){var S=window.__qb.x().S;S.sndOff=1;window.__qb.x().persist();return 1})()`);
  await pg.go(BASE + '/'); await pg.wait('!!(window.__qb && document.querySelector("#app") && !document.querySelector("#app .boot"))', 120000); await sleep(3000);
  const p3 = await prof(); ok(p3.sound === 'Sound: off', `B. after a reload: ${p3.sound}`);
  ok(!pg.errs.length, `page errors: ${pg.errs.length} ${pg.errs.slice(0, 2).join(' | ')}`);
  console.log(P.length ? `W-SOUND: ${P.length} problem(s)` : 'W-SOUND: PASS');
  await br.close(); process.exit(P.length ? 1 : 0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(2); });
