// LEAD's batch 1 (1feee32, Cal's 2026-11-13 list) on a sandbox build with Test tools on: the weight box, a finished bounty after "Clear completed",
// the day turning over with the app open, the Hall (banner on top, Posts and Chat only), the Players tab, the Board's Daily Quest and Wheel cards,
// the profile, the photo window's Cancel, a level-up with no "???", the crawl text, the floating coins, and the nav at 360.
//   BASE=<sandbox> OUT=<folder> CHROME_PORT=9375 node b1items.js
const fs = require('fs'), path = require('path');
const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8817', OUT = process.env.OUT || require('os').tmpdir() + '/qa-out/b1/'; fs.mkdirSync(OUT, { recursive: true });
const fails = []; const ok = (n, c, g) => { console.log((c ? 'ok   ' : 'BAD  ') + n + (g !== undefined ? '  ' + JSON.stringify(g).slice(0, 420) : '')); if (!c) fails.push(n); };
(async () => {
  const br = await browser(); const pg = await br.page({ fresh: true });
  const E = (js) => pg.ev(`(function(){try{${js}}catch(e){return 'ERR '+e.message}})()`);
  const clear = () => E('document.querySelectorAll(".dropsplash .dsx").forEach(function(b){b.click()});document.querySelectorAll("#layer .modal,.dropsplash").forEach(function(e){e.remove()});return 1');
  const nav = async (v) => { await clear(); await E(`var b=document.querySelector('.nav button[data-v="${v}"]');if(!b)return 0;b.click();return 1`); await sleep(900); };
  const tap = async (sel, i = 0) => { const r = await E(`var e=document.querySelectorAll('${sel}')[${i}];if(!e)return null;e.scrollIntoView({block:'center'});var b=e.getBoundingClientRect();return [b.left+b.width/2,b.top+b.height/2]`);
    if (!r || typeof r === 'string') return false; await sleep(150); for (const type of ['mousePressed', 'mouseReleased']) await pg.s('Input.dispatchMouseEvent', { type, x: r[0], y: r[1], button: 'left', clickCount: 1 }); await sleep(400); return true; };
  await pg.go(BASE + '/'); await pg.wait('!!(window.__qb && document.querySelector("#app") && !document.querySelector("#app .boot"))', 120000); await sleep(2500);
  await E(`var x=window.__qb.x(),S=x.S;S.created=true;S.welcomed=1;S.char=window.__qb.fixChar({name:'Qa',sex:'m'});S.xp=x.cum(12)+5;S.coins=50000;S.areaOn=null;S.gates=Array.from({length:200},function(_,i){return i});S.cls="vanguard";if(!S.base.slots.some(function(r){return r&&r.t==='lair'}))S.base.slots.push({t:'lair',a:{},st:0,pend:0});x.persist();var o=window.__qbUnlock.on();['hideout','hall','players','trophy','wheel','away'].forEach(function(k){o[k]=1});x.persist();x.render();return 1`); await sleep(1500); await clear();
  // nav
  const navs = await E('return [].map.call(document.querySelectorAll(".nav button"),function(b){return b.dataset.v+(b.disabled?"(off)":"")}).join(" ")');
  ok('nav has Players and no Wheel tab', /players/.test(navs) && !/wheel/.test(navs), navs);
  // Board: Daily Quest under the progress line, Wheel card (level 12 >= 6)
  await nav('board');
  const bd = await E(`var app=document.querySelector('#app'),t=app.innerText,dq=[].slice.call(app.querySelectorAll('section')).findIndex(function(s){return /Daily Quest/i.test(s.innerText)}),wh=app.querySelector('.zx-wheel');
    return {dq:dq,wheel:!!wh,wheelOn:JSON.stringify(window.__qbUnlock.on().wheel||0),first:[].slice.call(app.querySelectorAll('section,.vline,.strip')).slice(0,5).map(function(s){return (s.className||'')+':'+s.innerText.replace(/\\s+/g,' ').slice(0,50)}),rewards:/reward/i.test(t)}`);
  ok('Board: Daily Quest card near the top', bd.dq >= 0 && bd.dq <= 3, bd);
  ok('Board: a Wheel card once the Wheel is open', bd.wheel, bd.wheelOn);
  ok('Board: no real-life rewards', !bd.rewards);
  await pg.shot(OUT + 'board_390.png');
  if (bd.wheel) { await tap('.zx-wheel button'); const v = await E('return (document.querySelector(".nav button.on")||{}).dataset? document.querySelector("#app").innerText.slice(0,80):""'); ok('Wheel card opens the Wheel', /spin|wheel/i.test(v), v); }
  // version line top left
  const vl = await E('var v=document.querySelector(".vline");if(!v)return null;var b=v.getBoundingClientRect();return {t:v.innerText,x:Math.round(b.left),y:Math.round(b.top)}');
  ok('version and save line at the top left', vl && /v0\.\d+/.test(vl.t) && vl.x < 40 && vl.y < 80, vl);
  // weight box
  await nav('train'); await sleep(600);
  for (let k = 0; k < 6; k++) { if (await E('return !!document.querySelector(".exlist input.kg")')) break; await E('var b=document.querySelector("button.plan[data-act=wkplan]");b&&b.click();return 1'); await sleep(1500); await E('var x=document.querySelector(\'[data-ca="x"]\');if(x)x.click();return 1'); await sleep(500); }
  const wb = async (v) => { await tap('.exlist input.kg'); await E('var i=document.querySelector(".exlist input.kg");i.focus();i.select();return 1'); await pg.s('Input.insertText', { text: v }); await sleep(400);
    return E('var i=document.querySelector(".exlist input.kg");var id=i.dataset.ex;return {type:i.type,mode:i.inputMode,val:i.value,fits:i.scrollWidth<=i.clientWidth+1,w:i.clientWidth,sw:i.scrollWidth,saved:window.__qb.x().S.wk.w[id]}'); };
  if (await E('return !!document.querySelector(".exlist input.kg")')) {
    const a = await wb('135'); ok('weight box: 135 typed, all of it shows, saved 135', a.type === 'text' && a.mode === 'decimal' && a.val === '135' && a.fits && a.saved === 135, a);
    const c = await wb('12,5'); ok('weight box: "12,5" saved as 12.5', c.saved === 12.5, c);
    const d = await wb('102.5'); ok('weight box: 102.5 fits', d.fits && d.saved === 102.5, d);
    await pg.shot(OUT + 'weight_390.png');
  } else ok('weight box found', false);
  // bounty: take, finish, Clear completed
  await nav('board'); await sleep(500);
  const took = await tap('[data-act="btytake"]');
  const qid = await E('var q=window.__qb.x().S.quests.filter(function(q){return q&&q.bty})[0];return q?q.id:null');
  if (took && qid) { await E(`window.__qb.x().toggle(${JSON.stringify(qid)});return 1`); await sleep(800); await clear(); await nav('board');
    const b1 = await E('return [].map.call(document.querySelectorAll(".bty .bty-row"),function(r){return r.innerText.replace(/\\s+/g," ")}).join(" | ")');
    await tap('[data-act="qclear"]'); await sleep(600); await clear(); await nav('board');
    const b2 = await E('return {cards:[].map.call(document.querySelectorAll(".bty .bty-row"),function(r){return r.innerText.replace(/\\s+/g," ")}).join(" | "),still:window.__qb.x().S.quests.some(function(q){return q&&q.bty})}');
    ok('bounty: Completed once finished', /Completed/.test(b1), b1); ok('bounty: still Completed after Clear completed (quest gone from the board)', /Completed/.test(b2.cards) && !b2.still, b2);
  } else ok('bounty taken', false, { took, qid });
  // day turnover with the app open: XP on the Daily Quest, then the clock moved a day, no reload
  await nav('board');
  const dq0 = await E('var s=[].slice.call(document.querySelectorAll("#app section")).filter(function(s){return /Daily Quest/i.test(s.innerText)})[0];return s?s.innerText.replace(/\\s+/g," ").slice(0,160):null');
  await E('window.__qbShift=(window.__qbShift||0)+24*3600e3;return 1');
  await E('document.dispatchEvent(new Event("visibilitychange"));return 1'); await sleep(1500);
  const dq1 = await E('var s=[].slice.call(document.querySelectorAll("#app section")).filter(function(s){return /Daily Quest/i.test(s.innerText)})[0];var S=window.__qb.x().S;return {card:s?s.innerText.replace(/\\s+/g," ").slice(0,160):null,done:Object.keys(S.done||{}).length,dq:S.dq&&S.dq.d,run:S.runDate}');
  console.log('     daily quest before:', dq0); ok('day turns over with the app open: done list empty, meter on the new day', dq1.done === 0 && dq1.dq === dq1.run, dq1);
  // a level-up: no "???" and no rewards
  await clear(); await E('var x=window.__qb.x(),S=x.S;S.xp=x.cum(13)-2;x.persist();x.render();S.quests.push({id:"qa_lv",t:"QA level",xp:40,c:5,cl:"chores",rep:"once"});x.persist();x.render();x.toggle("qa_lv");return 1'); await sleep(1500);
  const lv = await E('var m=document.querySelector("#lvok");m=m&&m.closest(".card");return m?m.innerText.replace(/\\s+/g," "):null');
  ok('level-up card shows, no "???" and no reward', lv && !/\?\?\?/.test(lv) && !/reward/i.test(lv), lv); await pg.shot(OUT + 'levelup_390.png'); await clear();
  // profile
  await clear(); await E('var b=document.querySelector("[data-act=char]");b&&b.click();return 1'); await sleep(1200);
  const pf = await E('var t=[].map.call(document.querySelectorAll("#layer .modal"),function(m){return m.innerText}).join(" ");return {skills:/Your skills/.test(t),rewards:/reward/i.test(t),ladder:/advancement|chapter/i.test(t),dq:/Daily Quest/i.test(t),len:t.length}');
  ok('profile: skills shown, no rewards', pf.skills && !pf.rewards, pf); await pg.shot(OUT + 'profile_390.png'); await clear();
  // Hall and Players
  await nav('hall'); await sleep(1200);
  const hl = await E('var app=document.querySelector("#app"),b=app.querySelector(".tw-hall"),t=app.querySelector(".htab");return {bannerFirst:!!b&&(!t||b.compareDocumentPosition(t)&4)>0,tabs:t?[].map.call(t.querySelectorAll("button"),function(x){return x.innerText.trim()}).join(","):null,top:b?Math.round(b.getBoundingClientRect().top):null}');
  ok('Hall: banner on top, then Posts and Chat only', hl.bannerFirst && hl.tabs === 'Posts,Chat', hl); await pg.shot(OUT + 'hall_390.png');
  // photo window Cancel
  const ph = await tap('[data-act="phnew"]'); await sleep(800);
  const pc = await E('var m=document.querySelector("#layer .modal");if(!m)return null;var c=[].slice.call(m.querySelectorAll("button")).filter(function(b){return /Cancel/.test(b.innerText)})[0];return {cancel:!!c,btns:[].map.call(m.querySelectorAll("button"),function(b){return b.innerText.trim()}).join("|")}');
  if (pc && pc.cancel) { await pg.shot(OUT + 'photo_390.png'); await E('var m=document.querySelector("#layer .modal");[].slice.call(m.querySelectorAll("button")).filter(function(b){return /Cancel/.test(b.innerText)})[0].click();return 1'); await sleep(600); }
  const pc2 = await E('return document.querySelectorAll("#layer .modal").length');
  ok('photo window has Cancel and it closes the window', ph && pc && pc.cancel && pc2 === 0, { ph, pc, open: pc2 });
  await nav('players'); await sleep(2000);
  const pl = await E('var app=document.querySelector("#app"),t=app.innerText;return {box:!!document.getElementById("fshbox"),likes:/like/i.test(t),board:/Most rich|Highest level|leaderboard/i.test(t),square:/Town square/i.test(t),nb:/Neighbors/i.test(t),head:t.replace(/\\s+/g," ").slice(0,200)}');
  ok('Players: characters, likes, leaderboard, Town square, Neighbors', pl.box && pl.likes && pl.board && pl.square && pl.nb, pl); await pg.shot(OUT + 'players_390.png');
  // crawl text
  await nav('away'); const cw = await E('return document.querySelector("#app").innerText.replace(/\\s+/g," ")'); ok('crawl card promises no sure find', !/always finds|fourth/i.test(cw) && /Now and then/.test(cw), (cw.match(/Dungeon Crawls.{0,240}/) || [''])[0]);
  const pity = await E('return window.__qbEcon ? JSON.stringify((window.__qbEcon.ECON||window.__qbEcon).crawlPity) : "no hook"'); console.log('     crawlPity:', pity);
  // floating coins
  await nav('board'); await E('window.scrollTo(0,0);return 1'); await sleep(1700); const c0 = await E('var e=document.getElementById("zxcoins");return e?!e.hidden:false');
  await E('window.scrollTo(0,600);window.dispatchEvent(new Event("scroll"));return 1'); await sleep(600);
  const c1 = await E('var e=document.getElementById("zxcoins");if(!e)return null;var b=e.getBoundingClientRect(),hit=[];[].forEach.call(document.querySelectorAll("body *"),function(o){if(o===e||e.contains(o)||o.contains(e))return;var s=getComputedStyle(o);if(s.position!=="fixed"||s.display==="none"||s.visibility==="hidden"||o.offsetWidth===0)return;var r=o.getBoundingClientRect();if(r.right>b.left&&r.left<b.right&&r.bottom>b.top&&r.top<b.bottom)hit.push((o.id||o.className||o.tagName).toString().slice(0,40))});return {shown:!e.hidden,text:e.innerText,box:[b.left,b.top,b.right,b.bottom].map(Math.round),under:hit}');
  ok('floating coins: hidden at the top, shown with the real total once scrolled', !c0 && c1 && c1.shown && /\d/.test(c1.text), { c0, c1 }); await pg.shot(OUT + 'coins_scrolled_390.png');
  await E('window.__qb.roomModal(0);return 1'); await sleep(1700); const c2 = await E('var e=document.getElementById("zxcoins");return e?!e.hidden:false'); ok('floating coins hide while a window is open', !c2); await clear();
  // nav at 360
  await pg.s('Emulation.setDeviceMetricsOverride', { width: 360, height: 740, deviceScaleFactor: 3, mobile: true }); await sleep(800); await nav('board');
  const n360 = await E('var n=document.querySelector(".nav");return {sw:document.documentElement.scrollWidth,nav:[n.scrollWidth,n.clientWidth],btn:[].map.call(n.querySelectorAll("button"),function(b){var r=b.getBoundingClientRect();return Math.round(r.right)}).pop()}');
  ok('360: no sideways scroll, nav fits', n360.sw <= 360 && n360.nav[0] <= n360.nav[1] + 1 && n360.btn <= 360, n360); await pg.shot(OUT + 'board_360.png');
  console.log('page errors', JSON.stringify((pg.errs || []).slice(0, 4)));
  console.log(fails.length ? 'FAILED ' + fails.length : 'PASS'); process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
