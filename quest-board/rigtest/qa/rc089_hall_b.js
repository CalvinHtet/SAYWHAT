// rc-0.89 Hall QA part B: likes 2 a day (W2), who liked (W17), likes notify (W24), the Sunday 7 pm contest and its letter (W18).
const L = require('./rc089_hall_lib.js'), { say, sleep, OUT } = L;
const PST = (y, mo, d, h, mi = 0, s = 0) => Date.UTC(y, mo - 1, d, h + 8, mi, s); // November 2026 is standard time (UTC-8)
(async () => {
  const { br, pg } = await L.boot();
  const SS = (e) => pg.ev(`(function(){var S=window.__qb.x().S;return ${e}})()`);
  const shiftTo = (T) => pg.ev(`(function(){window.__qbShift=0;window.__qbShift=${T}-Date.now();return new Date().toString()})()`);
  const rerender = () => pg.ev('(function(){window.__qb.x().render();return 1})()');
  const likeDoc = () => L.get(pg, 'likes/sandbox');
  const rank = () => pg.ev('window.__qbHall.style("fashion").map(function(p){return p.name+":"+p.v+"#"+p.place}).join(" ")');
  const cardState = () => pg.ev(`(function(){var m=document.querySelector("#layer .modal.fsh-modal");if(!m)return null;var lb=m.querySelector("[data-act=fshlike]"),wb=m.querySelector("[data-act=fshwho]");
    return {u:m.getAttribute("data-u"),stats:m.querySelector(".fsh-stats").innerText.replace(/\\s+/g," "),arrow:wb?{exp:wb.getAttribute("aria-expanded"),i:wb.querySelector("i").textContent}:null,who:m.querySelector(".fsh-wholist").innerText.replace(/\\s+/g," "),
      like:lb?{t:lb.innerText.replace(/\\s+/g," "),dis:lb.disabled}:null,back:!!m.querySelector("[data-act=fshunlike]"),note:((m.querySelector(".fsh-likebox .note")||{}).innerText||"")}})()`);
  const card = async (uid) => { await L.closeModals(pg); await L.tapSel(pg, `#fshbox .fsh-row[data-u="${uid}"]`); await sleep(700); return cardState(); };
  const tapLike = async () => { await L.tapSel(pg, '.fsh-modal [data-act=fshlike]'); await sleep(700); return cardState(); };
  const tapBack = async () => { await L.tapSel(pg, '.fsh-modal [data-act=fshunlike]'); await sleep(700); return cardState(); };
  const pops = async () => { const p = await pg.ev('window.__qaPops.splice(0)'); return p; };
  const head = () => pg.ev('(function(){var p=document.querySelector("#fshbox>p.note");return p?p.innerText:null})()');
  const dots = () => pg.ev('(function(){var t=document.querySelector(".htab .fsh-dot"),n=document.querySelector(\'.nav button[data-v="hall"] .fsh-ndot\');return {view:window.__qbHall.tab(),tabDot:t?!t.hidden:"no tab bar",navDot:!!n,heart:[].map.call(document.querySelectorAll("#fshbox .fsh-heart"),function(h){return h.textContent}),seen:window.__qb.x().S.fsh.seen}})()');

  // ---- neighbours: four players with looks (copied from the sandbox friends)
  await L.hall(pg, 'style'); await sleep(2500);
  const looks = await pg.ev('(function(){var o=[];for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k.indexOf("qbsbx:worlds/sb_")==0)o.push(JSON.parse(localStorage.getItem(k)).look)}return o})()');
  const P = [['u_syd', 'Sydney'], ['u_jor', 'Jordan'], ['u_alx', 'Alex'], ['u_mor', 'Morgan']];
  for (const [i, [id, name]] of P.entries()) await L.put(pg, 'worlds/' + id, { name, look: looks[i], lv: 20 + i, streak: 3, rooms: [], earnedC: 1000 * (i + 1), t: Date.now() });
  await pg.wait('!!document.querySelector(\'#fshbox .fsh-row[data-u="u_syd"]\')', 20000);
  const wk0 = await pg.ev('window.__qbHall.week()');
  say('now', await pg.ev('new Date().toString()'), 'week', wk0, 'today', await SS('S.runDate'));
  // ---- W18: the Rank tab's end line, now
  say('W18 head now', await head());
  const left = 7 * 1440 - wk0.mins; say('W18 expected', Math.floor(left / 1440) + 'd ' + Math.floor((left % 1440) / 60) + 'h');
  // ---- W2: like Sydney up to 2 times today
  say('W2 Sydney card', await card('u_syd'));
  say('W2 like 1', await tapLike(), await pops());
  say('W2 like 2', await tapLike(), await pops());
  await pg.shot(OUT + 'b_w2_card_2of2.png');
  say('W2 like 3 (button disabled)', await tapLike(), await pops());
  say('W2 doc', await likeDoc());
  say('W2 take back 1', await tapBack(), await pops(), 'doc c', (await likeDoc()).c, 'td', (await likeDoc()).td);
  say('W2 like again', await tapLike(), await pops(), 'doc c', (await likeDoc()).c);
  say('W2 Jordan card (per look)', await card('u_jor'));
  say('W2 like Jordan', await tapLike(), await pops());
  say('W2 own card', await card('sandbox'));
  await L.closeModals(pg);
  say('W2 doc after day 1', await likeDoc());
  // ---- W24 set-up: leave the Rank tab (Posts), then go to the Board, then others like Cal
  await L.hall(pg, 'posts'); await sleep(800);
  await pg.ev('document.querySelector(".nav button[data-v=board]").click()'); await sleep(1200);
  const W = wk0.key, D1 = await SS('S.runDate');
  await L.put(pg, 'likes/u_jor', { wk: W, c: { u_syd: 3, sandbox: 2 }, d: D1, td: { u_syd: 2, sandbox: 2 }, prev: null, t: Date.now() });
  await L.put(pg, 'likes/u_alx', { wk: W, to: ['u_syd', 'sandbox', 'u_mor'], prev: { wk: '', to: [] }, t: Date.now() }); // old format
  await L.put(pg, 'likes/u_mor', { wk: W, c: { u_jor: 5, u_mor: 3 }, d: D1, td: { u_jor: 2 }, prev: null, t: Date.now() }); // u_mor:3 is a self-like
  await sleep(1500);
  say('W24 on Board', await dots());
  await pg.shot(OUT + 'b_w24_nav_dot.png');
  await pg.ev('document.querySelector(".nav button[data-v=hall]").click()'); await sleep(1500);
  say('W24 in Hall, Posts tab', await dots());
  await pg.ev('window.scrollTo(0,0)'); await sleep(300);
  await pg.shot(OUT + 'b_w24_tab_dot.png');
  await pg.ev('document.querySelector(\'[data-act=htab][data-t="style"]\').click()'); await sleep(1500);
  say('W24 on Rank tab', await dots());
  await pg.ev('window.scrollTo(0,0)'); await sleep(300);
  await pg.shot(OUT + 'b_w24_heart.png');
  // ranking and week totals
  say('W2 ranking (expect Jordan 6, Sydney 6, Cal 3, Morgan 1, Alex 0)', await rank());
  say('W2 list rows', await pg.ev('[].map.call(document.querySelectorAll("#fshbox .fsh-row"),function(r){return r.innerText.replace(/\\s+/g," ")})'));
  say('W2 pedestal', await pg.ev('[].map.call(document.querySelectorAll("#fshbox .fsh-ped .fsh-st"),function(r){return r.innerText.replace(/\\s+/g," ")})'));
  // heart clears: leave the tab and come back
  await pg.ev('document.querySelector(\'[data-act=htab][data-t="posts"]\').click()'); await sleep(800);
  await pg.ev('document.querySelector(\'[data-act=htab][data-t="style"]\').click()'); await sleep(1200);
  say('W24 back on Rank (expect no heart, no dots)', await dots());
  // a like while the tab is open
  await L.put(pg, 'likes/u_mor', { wk: W, c: { u_jor: 5, u_mor: 3, sandbox: 1 }, d: D1, td: { u_jor: 2, sandbox: 1 }, prev: null, t: Date.now() });
  await sleep(1500);
  say('W24 like while on Rank (expect heart 1, no dots)', await dots());
  // own card marks seen: a like arrives while on Posts, then the own card from the list... (Rank tab marks it anyway), so use the Board then the card
  // ---- W17: who liked
  let c = await card('u_syd'); say('W17 Sydney card folded', c);
  await L.tapSel(pg, '.fsh-modal [data-act=fshwho]'); await sleep(500); c = await cardState(); say('W17 opened', c);
  await pg.shot(OUT + 'b_w17_who_open.png');
  await L.tapSel(pg, '.fsh-modal [data-act=fshwho]'); await sleep(500); say('W17 folded again', await cardState());
  c = await card('u_jor'); await L.tapSel(pg, '.fsh-modal [data-act=fshwho]'); await sleep(500); say('W17 Jordan opened', await cardState());
  c = await card('sandbox'); await L.tapSel(pg, '.fsh-modal [data-act=fshwho]'); await sleep(500); say('W17 own card opened', await cardState());
  await pg.shot(OUT + 'b_w17_own_card.png');
  c = await card('u_alx'); say('W17 Alex (0 likes) card', c);
  await L.closeModals(pg);
  // ---- W2: a new game day (5 am)
  say('shift', await shiftTo(PST(2026, 11, 11, 4, 59, 0)));
  say('W2 Wed 04:59 day', await pg.ev('window.__qb.x().S.runDate'), 'Sydney card', await card('u_syd'));
  say('shift', await shiftTo(PST(2026, 11, 11, 5, 0, 30)));
  await sleep(1500); await rerender(); await sleep(800);
  say('W2 Wed 05:00 Sydney card', await card('u_syd'));
  say('W2 take back yesterday? button present:', (await cardState()).back);
  say('W2 like 1', await tapLike(), await pops());
  say('W2 like 2', await tapLike(), await pops());
  say('W2 like 3', await tapLike(), await pops());
  say('W2 doc day 2', await likeDoc());
  say('W2 back 1', await tapBack(), await pops());
  say('W2 back 2', await tapBack(), await pops());
  say('W2 after 2 backs (expect no take-back, c=2)', await cardState(), (await likeDoc()).c);
  say('W2 relike x2', await tapLike(), await tapLike(), await pops());
  say('W2 Jordan card day 2', await card('u_jor'));
  await L.closeModals(pg);
  say('W2 ranking day 2 (expect Sydney 8, Jordan 6, Cal 4, Morgan 1)', await rank());
  // ---- W18 end line and week keys
  say('shift', await shiftTo(PST(2026, 11, 13, 14, 30)));
  await rerender(); await sleep(800);
  say('W18 head Fri 14:30', await head());
  await pg.ev('window.scrollTo(0,0)'); await sleep(300); await pg.shot(OUT + 'b_w18_head_2d4h.png');
  const ks = {};
  for (const [lbl, t] of [['Sun 11-08 18:59', PST(2026, 11, 8, 18, 59)], ['Sun 11-08 19:00', PST(2026, 11, 8, 19, 0)], ['Mon 11-09 00:00', PST(2026, 11, 9, 0, 0)], ['Sun 11-15 18:59:59', PST(2026, 11, 15, 18, 59, 59)], ['Sun 11-15 19:00', PST(2026, 11, 15, 19, 0)],
    ['Sun 11-22 18:59', PST(2026, 11, 22, 18, 59)], ['Sun 11-22 19:00', PST(2026, 11, 22, 19, 0)]]) ks[lbl] = (await pg.ev(`window.__qbHall.week(${t})`)).key;
  say('W18 week keys', ks, 'wkEnd W47', await pg.ev('window.__qbHall.wkEnd("2026-W47")'));
  say('shift', await shiftTo(PST(2026, 11, 15, 18, 0)));
  await rerender(); await sleep(800); say('W18 head Sun 18:00', await head());
  say('shift', await shiftTo(PST(2026, 11, 15, 18, 59, 30)));
  await rerender(); await sleep(800); say('W18 head Sun 18:59:30', await head());
  // ---- W46 settles at Sun Nov 15 19:05 (old window: the old results window, no letter)
  await pg.ev('document.querySelector(".nav button[data-v=board]").click()'); await sleep(800);
  const before46 = await SS('JSON.stringify({coins:S.coins,last:S.fsh.last,won:S.fsh.won,news:S.fsh.news||null})');
  say('W46 before', before46);
  await pg.ev('window.__qaModals.length=0');
  say('shift', await shiftTo(PST(2026, 11, 15, 19, 5, 30)));
  await pg.wait('window.__qb.x().S.fsh.last==="2026-W46"', 75000).catch((e) => say('W46 settle wait: ' + e.message));
  await sleep(2500);
  say('W46 after', await SS('JSON.stringify({coins:S.coins,last:S.fsh.last,won:S.fsh.won,news:S.fsh.news||null,letters:S.letters})'));
  say('W46 modals seen', await pg.ev('window.__qaModals'));
  await pg.shot(OUT + 'b_w46_settle.png');
  await L.closeModals(pg);
  await pg.ev('document.querySelector(".ibbtn").click()'); await sleep(700);
  say('W46 inbox rows', await pg.ev('[].map.call(document.querySelectorAll(".ibrow"),function(r){return r.innerText.replace(/\\s+/g," ")})'));
  await L.closeModals(pg);
  // ---- W47: likes in the new week
  say('shift', await shiftTo(PST(2026, 11, 18, 12, 0)));
  await pg.ev('document.querySelector(".nav button[data-v=hall]").click()'); await sleep(1500);
  const W47 = (await pg.ev('window.__qbHall.week()')).key, D3 = await SS('S.runDate');
  say('W47 key', W47, 'day', D3, 'head', await head());
  const jorPrev = (await L.get(pg, 'likes/u_jor'));
  await L.put(pg, 'likes/u_jor', { wk: W47, c: { u_syd: 4, sandbox: 3, u_mor: 1 }, d: D3, td: { u_syd: 2, sandbox: 2, u_mor: 1 }, prev: { wk: jorPrev.wk, c: jorPrev.c }, t: Date.now() });
  await L.put(pg, 'likes/u_alx', { wk: W47, c: { u_mor: 5, u_syd: 2 }, d: D3, td: {}, prev: { wk: W, to: ['u_syd', 'sandbox', 'u_mor'] }, t: Date.now() });
  await L.put(pg, 'likes/u_mor', { wk: W47, c: { sandbox: 2 }, d: D3, td: { sandbox: 2 }, prev: { wk: W, c: { u_jor: 5, sandbox: 1 } }, t: Date.now() });
  await sleep(1000);
  await card('u_syd'); await tapLike(); await tapLike(); await L.closeModals(pg);
  say('W47 my doc (expect prev = W46 counts)', await likeDoc());
  await rerender(); await sleep(800);
  say('W47 ranking (expect Sydney 8, Morgan 6, Cal 5)', await rank(), 'head', await head());
  say('shift', await shiftTo(PST(2026, 11, 20, 14, 30)));
  await rerender(); await sleep(800); say('W18 head Fri Nov 20 14:30', await head());
  // ---- W47 settles at Sun Nov 22 19:05: the first "Fashion week" letter, while the app is open on the Board
  await pg.ev('document.querySelector(".nav button[data-v=board]").click()'); await sleep(800);
  await pg.ev('window.__qaModals.length=0');
  say('W47 before', await SS('JSON.stringify({coins:S.coins,last:S.fsh.last,won:S.fsh.won})'));
  say('shift', await shiftTo(PST(2026, 11, 22, 19, 5, 30)));
  await pg.wait('window.__qb.x().S.fsh.last==="2026-W47"', 75000).catch((e) => say('W47 settle wait: ' + e.message));
  await pg.wait('!!document.querySelector("#layer .modal.ibmodal")', 30000).catch((e) => say('letter wait: ' + e.message));
  await sleep(2500);
  say('W47 after', await SS('JSON.stringify({coins:S.coins,last:S.fsh.last,won:S.fsh.won,news:S.fsh.news})'));
  say('W47 modals seen', await pg.ev('window.__qaModals'));
  const letter = await pg.ev(`(function(){var m=document.querySelector("#layer .modal.ibmodal");if(!m)return null;return {text:m.innerText.replace(/\\s+/g," "),figs:m.querySelectorAll(".fsh-ped-sm .fsh-fig img").length,ghosts:m.querySelectorAll(".fsh-ped-sm .fsh-ghost").length,
    rows:[].map.call(m.querySelectorAll(".fsh-nl li"),function(l){return l.innerText.replace(/\\s+/g," ")}),w:Math.round(m.querySelector(".card").getBoundingClientRect().width),docW:document.documentElement.scrollWidth}})()`);
  say('W47 letter', letter);
  await pg.wait('[].every.call(document.querySelectorAll("#layer .ibmodal img"),function(i){return i.complete&&i.naturalWidth>0})', 15000).catch(() => {});
  await sleep(1000);
  await pg.shot(OUT + 'b_w47_letter.png');
  await pg.ev('(function(){var m=document.querySelector("#layer .ibmodal .card");if(m)m.parentElement.scrollTop=1e5;return 1})()'); await sleep(400);
  await pg.shot(OUT + 'b_w47_letter_bottom.png');
  await L.closeModals(pg);
  await pg.ev('document.querySelector(".ibbtn").click()'); await sleep(700);
  say('W47 inbox rows', await pg.ev('[].map.call(document.querySelectorAll(".ibrow"),function(r){return r.innerText.replace(/\\s+/g," ")})'));
  await L.closeModals(pg);
  // ---- W48, settled on a cold open (the app closed over the cutoff): names in the letter must still be right
  say('shift', await shiftTo(PST(2026, 11, 25, 12, 0)));
  const W48 = (await pg.ev('window.__qbHall.week()')).key, D4 = await SS('S.runDate');
  await L.put(pg, 'likes/u_jor', { wk: W48, c: { u_alx: 3, sandbox: 1 }, d: D4, td: {}, prev: null, t: Date.now() });
  await L.put(pg, 'likes/u_mor', { wk: W48, c: { u_alx: 2, u_jor: 2 }, d: D4, td: {}, prev: null, t: Date.now() });
  await L.put(pg, 'likes/u_alx', { wk: W48, c: { u_jor: 2 }, d: D4, td: {}, prev: null, t: Date.now() });
  await sleep(800);
  say('shift (persisted for the reload)', await shiftTo(PST(2026, 11, 29, 19, 20)));
  await pg.ev('(function(){window.__qb.x().persist();return 1})()'); await sleep(2500);
  say('saved tshift h', await pg.ev('JSON.parse(localStorage.getItem("quest-board")).tshift/36e5'));
  const errsBefore = pg.errs.length;
  await pg.go(L.BASE + '/');
  await pg.wait('!!(document.querySelector(".nav button[data-v=board]") && window.__qb && window.__qbHall)', 120000);
  await pg.ev(`(function(){window.__qaKilled=[];window.__qaPops=[];window.__qaModals=[];var keep=/fsh-modal|ibmodal|sq-card|fsh-card|Fashion week/;
    new MutationObserver(function(ms){ms.forEach(function(r){r.addedNodes.forEach(function(n){if(!n.classList)return;if(n.classList.contains("pop")){window.__qaPops.push(n.textContent);return}
      if(n.classList.contains("modal")){var s=n.className+" "+n.innerHTML.slice(0,4000);window.__qaModals.push((n.innerText||"").slice(0,120));if(!keep.test(s)){window.__qaKilled.push((n.innerText||"").slice(0,60));n.remove()}}})})}).observe(document.getElementById("layer"),{childList:true});return 1})()`);
  say('cold open clock', await pg.ev('new Date().toString()'));
  await pg.wait('window.__qb.x().S.fsh.last==="2026-W48"', 60000).catch((e) => say('W48 settle wait: ' + e.message));
  await pg.wait('!!document.querySelector("#layer .modal.ibmodal")', 60000).catch((e) => say('W48 letter wait: ' + e.message));
  await sleep(2000);
  say('W48 news', await SS('JSON.stringify(S.fsh.news["2026-W48"]||null)'));
  say('W48 letter', await pg.ev('(function(){var m=document.querySelector("#layer .modal.ibmodal");return m?m.innerText.replace(/\\s+/g," "):null})()'));
  await pg.shot(OUT + 'b_w48_letter_coldopen.png');
  say('page errors', pg.errs, 'killed pop-ups', await pg.ev('window.__qaKilled.length'));
  L.save('b_log.txt');
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); L.save('b_log.txt'); process.exit(1); });
