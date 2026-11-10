// rc-0.89 Hall QA part D: W24 heart timing (does the heart show the moment you open Rank?), heart on a list row (not top 3),
// dots on the Rank tab and the Hall button with clean screenshots, and W18's letter on a cold open after the cutoff.
const L = require('./rc089_hall_lib.js'), { say, sleep, OUT } = L;
const PST = (y, mo, d, h, mi = 0, s = 0) => Date.UTC(y, mo - 1, d, h + 8, mi, s);
(async () => {
  const { br, pg } = await L.boot();
  const SS = (e) => pg.ev(`(function(){var S=window.__qb.x().S;return ${e}})()`);
  const shiftTo = (T) => pg.ev(`(function(){window.__qbShift=0;window.__qbShift=${T}-Date.now();return new Date().toString()})()`);
  const dots = () => pg.ev('(function(){var t=document.querySelector(".htab .fsh-dot"),n=document.querySelector(\'.nav button[data-v="hall"] .fsh-ndot\');return {tab:window.__qbHall.tab(),tabDot:t?!t.hidden:"no tab bar",navDot:!!n,heart:[].map.call(document.querySelectorAll("#fshbox .fsh-heart"),function(h){return (h.closest(".fsh-row")?"row:":"ped:")+h.textContent}),seen:window.__qb.x().S.fsh.seen}})()');
  const tabTo = async (t) => { await pg.ev(`document.querySelector('[data-act=htab][data-t="${t}"]').click()`); };
  await L.hall(pg, 'style'); await sleep(2500);
  const looks = await pg.ev('(function(){var o=[];for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k.indexOf("qbsbx:worlds/sb_")==0)o.push(JSON.parse(localStorage.getItem(k)).look)}return o})()');
  const P = [['u_syd', 'Sydney'], ['u_jor', 'Jordan'], ['u_alx', 'Alex'], ['u_mor', 'Morgan']];
  for (const [i, [id, name]] of P.entries()) await L.put(pg, 'worlds/' + id, { name, look: looks[i], lv: 20 + i, streak: 3, rooms: [], earnedC: 1000 * (i + 1), t: Date.now() });
  await pg.wait('!!document.querySelector(\'#fshbox .fsh-row[data-u="u_syd"]\')', 20000);
  const W = (await pg.ev('window.__qbHall.week()')).key, D = await pg.ev('(function(){var d=new Date(Date.now()-5*36e5);return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")})()');
  // ---- case 1: Cal on the pedestal. On Posts for a while (the board fresh), a like comes in, then the Board, then back.
  await tabTo('posts'); await sleep(4000);
  await L.put(pg, 'likes/u_jor', { wk: W, c: { sandbox: 2 }, d: D, td: { sandbox: 2 }, prev: null, t: Date.now() });
  await sleep(1500); await L.closeModals(pg);
  say('W24 Posts tab after a like', await dots());
  await pg.ev('window.scrollTo(0,0)'); await sleep(300);
  await pg.shot(OUT + 'd_w24_tab_dot.png', { x: 0, y: 0, width: 390, height: 260 });
  await pg.ev('document.querySelector(".nav button[data-v=board]").click()'); await sleep(1500); await L.closeModals(pg);
  say('W24 Board', await dots());
  await pg.shot(OUT + 'd_w24_nav_dot.png', { x: 0, y: 700, width: 390, height: 144 });
  await pg.ev('document.querySelector(".nav button[data-v=hall]").click()'); await sleep(1500); await L.closeModals(pg);
  say('W24 Hall (Posts)', await dots());
  const t0 = Date.now(); await tabTo('style');
  const samples = [];
  for (const at of [300, 1000, 2000, 4000, 7000, 12000, 20000, 35000, 65000]) {
    await sleep(Math.max(0, at - (Date.now() - t0)));
    const d = await dots(); samples.push((Date.now() - t0) + 'ms ' + JSON.stringify(d.heart) + ' tabDot ' + d.tabDot);
    if (at === 1000) { await L.closeModals(pg); await pg.ev('window.scrollTo(0,0)'); await pg.shot(OUT + 'd_w24_heart_1s.png'); }
    if (d.heart.length) { await L.closeModals(pg); await pg.ev('window.scrollTo(0,0)'); await pg.shot(OUT + 'd_w24_heart_first_seen.png'); break; }
  }
  say('W24 heart after opening Rank (pedestal case)', samples);
  // ---- case 2: Cal 4th, so the heart goes on the list row; this time force nothing either
  await tabTo('posts'); await sleep(3000);
  await L.put(pg, 'likes/u_alx', { wk: W, c: { u_syd: 5, u_jor: 5, u_mor: 5 }, d: D, td: {}, prev: null, t: Date.now() });
  await sleep(1500);
  await L.put(pg, 'likes/u_mor', { wk: W, c: { sandbox: 1 }, d: D, td: { sandbox: 1 }, prev: null, t: Date.now() });
  await sleep(1500);
  say('W24 case 2 Posts', await dots(), await pg.ev('window.__qbHall.style("fashion").slice(0,5).map(function(p){return p.name+":"+p.v+"#"+p.place}).join(" ")'));
  const t1 = Date.now(); await tabTo('style'); const s2 = [];
  for (const at of [300, 1000, 2000, 4000, 7000, 12000, 20000, 35000, 65000]) {
    await sleep(Math.max(0, at - (Date.now() - t1)));
    const d = await dots(); s2.push((Date.now() - t1) + 'ms ' + JSON.stringify(d.heart) + ' tabDot ' + d.tabDot);
    if (d.heart.length) break;
  }
  say('W24 heart after opening Rank (list-row case)', s2);
  await L.closeModals(pg);
  const row = await pg.ev('(function(){var r=document.querySelector(\'#fshbox .fsh-row[data-u="sandbox"]\');if(!r)return null;r.scrollIntoView({block:"center"});var b=r.getBoundingClientRect();return {y:b.top+scrollY,h:b.height,text:r.innerText.replace(/\\s+/g," ")}})()');
  await sleep(400);
  say('W24 own row', row);
  if (row) await pg.shot(OUT + 'd_w24_heart_row.png', { x: 0, y: row.y - 60, width: 390, height: row.h + 120 });
  // ---- case 3: W18 cold open. Likes for W47, the app closed over Sunday 7 pm, opened Monday 8 am.
  await shiftTo(PST(2026, 11, 18, 12, 0));
  const W47 = (await pg.ev('window.__qbHall.week()')).key;
  await L.put(pg, 'likes/u_jor', { wk: W47, c: { u_syd: 4, sandbox: 3, u_mor: 1 }, d: '2026-11-18', td: {}, prev: null, t: Date.now() });
  await L.put(pg, 'likes/u_alx', { wk: W47, c: { u_mor: 5, u_syd: 2 }, d: '2026-11-18', td: {}, prev: null, t: Date.now() });
  await L.put(pg, 'likes/u_mor', { wk: W47, to: ['sandbox', 'u_syd'], prev: { wk: W, c: { sandbox: 1 } }, t: Date.now() }); // old format this week
  await sleep(1000);
  say('W47 standings (expect Sydney 7, Morgan 6, Cal 4)', await pg.ev('window.__qbHall.style("fashion").slice(0,4).map(function(p){return p.name+":"+p.v+"#"+p.place}).join(" ")'));
  say('fsh before', await SS('JSON.stringify({last:S.fsh.last,won:S.fsh.won})'));
  await shiftTo(PST(2026, 11, 23, 8, 0));
  await pg.ev('(function(){window.__qb.x().persist();return 1})()'); await sleep(2500);
  say('saved tshift h', await pg.ev('JSON.parse(localStorage.getItem("quest-board")).tshift/36e5'));
  await pg.go(L.BASE + '/');
  await pg.wait('!!(document.querySelector(".nav button[data-v=board]") && window.__qb && window.__qbHall)', 120000);
  const tb = Date.now();
  say('cold open clock', await pg.ev('new Date().toString()'));
  // record each modal as it comes; do not remove anything for 20 s (as a player who has not tapped yet)
  await pg.ev(`(function(){window.__qaM=[];var t0=Date.now();[].forEach.call(document.querySelectorAll("#layer .modal"),function(n){window.__qaM.push("0ms(at install) "+(n.className)+" "+(n.innerText||"").slice(0,70).replace(/\\s+/g," "))});
    new MutationObserver(function(ms){ms.forEach(function(r){r.addedNodes.forEach(function(n){if(n.classList&&n.classList.contains("modal"))window.__qaM.push((Date.now()-t0)+"ms "+n.className+" "+(n.innerText||"").slice(0,70).replace(/\\s+/g," "))})})}).observe(document.getElementById("layer"),{childList:true});return 1})()`);
  await sleep(20000);
  say('cold open: modals in the first 20 s', await pg.ev('window.__qaM'), 'fsh.last', await SS('S.fsh.last'), 'news W47', await SS('JSON.stringify((S.fsh.news||{})["2026-W47"]||null)'));
  // now the player taps every other window away, one each 2 s
  let opened = null;
  for (let i = 0; i < 45 && !opened; i++) {
    opened = await pg.ev('(function(){var m=document.querySelector("#layer .modal.ibmodal");return m&&/Fashion week/.test(m.innerText)?m.innerText.replace(/\\s+/g," "):null})()');
    if (!opened) await pg.ev('(function(){[].forEach.call(document.querySelectorAll("#layer .modal"),function(m){if(!m.classList.contains("ibmodal")||!/Fashion week/.test(m.innerText))m.remove()});return 1})()');
    await sleep(2000);
  }
  say('cold open: letter opened ' + Math.round((Date.now() - tb) / 1000) + ' s after boot:', opened);
  say('modals log', await pg.ev('window.__qaM'));
  say('fsh after', await SS('JSON.stringify({last:S.fsh.last,won:S.fsh.won,news:S.fsh.news})'));
  if (opened) { await sleep(1500); await pg.shot(OUT + 'd_w47_letter_coldopen.png'); }
  await pg.ev('(function(){document.querySelectorAll("#layer .modal").forEach(function(e){e.remove()});document.querySelector(".ibbtn").click();return 1})()'); await sleep(800);
  say('inbox rows', await pg.ev('[].map.call(document.querySelectorAll(".ibrow"),function(r){return r.innerText.replace(/\\s+/g," ")+(r.classList.contains("un")?" (unread)":"")})'));
  say('page errors', pg.errs);
  L.save('d_log.txt');
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); L.save('d_log.txt'); process.exit(1); });
