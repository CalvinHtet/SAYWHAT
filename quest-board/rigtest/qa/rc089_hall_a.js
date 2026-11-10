// rc-0.89 Hall QA part A: W3 tab names, W4 chat (own x only, two taps, no Clear room, old owner marks ignored), W13 board layout.
const L = require('./rc089_hall_lib.js'), { say, sleep, OUT } = L;
const OWNER = 'RwoCZ8hu7GNFof5SjKzZFtlqqRH3';
(async () => {
  const now = Date.now(), m = 60000;
  const tHid = now - 9 * m, tJo = now - 8 * m, tMine = now - 6 * m;
  const extra = {
    'qbsbx:chat/u_syd': JSON.stringify({ name: 'Sydney', msgs: { 1: [{ x: 'hey all', t: now - 10 * m }, { x: 'hidden by the old owner mark', t: tHid }], 2: [{ x: 'room two before old clear', t: now - 10 * m }], 3: [] }, t: tHid }),
    'qbsbx:chat/u_jo': JSON.stringify({ name: 'Jordan', msgs: { 1: [{ x: 'before the old clear mark', t: tJo }] }, t: tJo }),
    ['qbsbx:chat/' + OWNER]: JSON.stringify({ name: 'Cal owner', msgs: { 1: [{ x: 'owner line', t: now - 7 * m }] }, mod: { clr: { 1: now - 5 * m, 2: now }, hid: ['u_syd|' + tHid, 'u_jo|' + tJo] }, t: now - 7 * m }),
    'qbsbx:chat/sandbox': JSON.stringify({ name: 'Cal', msgs: { 1: [{ x: 'my old line', t: tMine }], 2: [], 3: [] }, mod: { clr: { 1: now - 5 * m, 2: now }, hid: ['u_syd|' + tHid] }, t: tMine }),
  };
  const { br, pg } = await L.boot({ extra });
  // ---- W3
  await L.hall(pg, 'posts'); await L.closeModals(pg);
  say('W3 tabs', await pg.ev('[].map.call(document.querySelectorAll(".htab button"),function(b){return b.innerText.trim()})'));
  say('W3 any "Style" text in tab bar', await pg.ev('/Style/.test(document.querySelector(".htab").innerText)'));
  await pg.ev('window.scrollTo(0,0)'); await sleep(300);
  const tb = await pg.ev('(function(){var b=document.querySelector(".htab").getBoundingClientRect();return {x:0,y:b.top+scrollY-10,width:390,height:b.height+20}})()');
  await pg.shot(OUT + 'a_w3_tabs.png', tb);
  // ---- W4 chat
  await L.hall(pg, 'chat'); await sleep(2500); await L.closeModals(pg);
  const lines = () => pg.ev(`[].map.call(document.querySelectorAll("#tchlog .tch-m"),function(e){return {me:e.classList.contains("me"),x:(e.querySelector("p").firstChild||{}).textContent,del:e.querySelectorAll(".tch-x").length}})`);
  say('W4 room1 lines (old owner clr room1 at now-5min, hid u_syd|' + tHid + ' and u_jo|' + tJo + ')', await lines());
  say('W4 Clear room button?', await pg.ev('!!document.querySelector(".tch-clr")||/Clear room/i.test(document.body.innerText)'));
  await pg.shot(OUT + 'a_w4_chat_room1.png');
  // send one line by typing and the Send button
  await pg.ev('(function(){var i=document.getElementById("tchin");i.focus();i.value="new line from me";i.dispatchEvent(new Event("input",{bubbles:true}));return 1})()');
  await L.tapSel(pg, '[data-act=tchsend]'); await sleep(1500);
  say('W4 after send', await lines());
  const own1 = await L.get(pg, 'chat/sandbox');
  say('W4 own doc', own1.msgs['1'].map((x) => x.x), 'old mod still in own doc?', !!own1.mod);
  say('W4 x total', await pg.ev('document.querySelectorAll("#tchlog .tch-x").length'), 'on others lines', await pg.ev('[].filter.call(document.querySelectorAll("#tchlog .tch-x"),function(x){return !x.closest(".tch-m.me")}).length'));
  await pg.ev('document.activeElement&&document.activeElement.blur()'); await sleep(300);
  // first tap arms; 4.5 s later it is back to x and nothing is deleted
  await L.tapSel(pg, '#tchlog .tch-m.me .tch-x');
  say('W4 after 1 tap', await pg.ev('(function(){var b=document.querySelector("#tchlog .tch-m.me .tch-x");return {txt:b.textContent,on:b.classList.contains("on")}})()'));
  await pg.shot(OUT + 'a_w4_armed.png');
  await sleep(4500);
  say('W4 4.5 s later', await pg.ev('(function(){var b=document.querySelector("#tchlog .tch-m.me .tch-x");return {txt:b.textContent,on:b.classList.contains("on")}})()'), 'doc', (await L.get(pg, 'chat/sandbox')).msgs['1'].map((x) => x.x));
  // two taps: deleted
  await L.tapSel(pg, '#tchlog .tch-m.me .tch-x'); await sleep(300);
  say('W4 tap 1 of 2', await pg.ev('(function(){var b=document.querySelector("#tchlog .tch-x.on");return b?b.textContent:null})()'));
  await L.tapSel(pg, '#tchlog .tch-m.me .tch-x'); await sleep(1500);
  say('W4 after 2 taps: doc', (await L.get(pg, 'chat/sandbox')).msgs['1'].map((x) => x.x), 'lines', await lines(), 'pops', await pg.ev('window.__qaPops'));
  await pg.shot(OUT + 'a_w4_after_delete.png');
  // room 2: the old clear mark at "now" would have emptied it
  await L.tapSel(pg, '[data-act=tchroom][data-r="2"]'); await sleep(1000);
  say('W4 room2 lines', await lines());
  say('W4 others docs untouched (lines)', (await L.get(pg, 'chat/u_syd')).msgs['1'].length, (await L.get(pg, 'chat/u_jo')).msgs['1'].length);
  await L.tapSel(pg, '[data-act=tchroom][data-r="1"]'); await sleep(800);
  // ---- W13 board: from a clean board, so every new post gets its "new" tag
  await L.hall(pg, 'posts'); await sleep(2500); await L.closeModals(pg);
  const looks = await pg.ev('(function(){var o=[];for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k.indexOf("qbsbx:worlds/sb_")==0)o.push(JSON.parse(localStorage.getItem(k)).look)}return o})()');
  say('W13 boardT before', await pg.ev('window.__qb.x().S.social.boardT'), 'looks', looks.length);
  const T = Date.now();
  const long280 = 'Finished the whole apartment today: laundry folded, dishes done, floors mopped, plants watered, and I even sorted the junk drawer. Who wants to grab tacos tonight? I earned it. Also, the new Loft upgrade looks amazing, thank you all for the likes this week, see you in the town square!! Bye now ok';
  const t280 = long280.slice(0, 280);
  const word280 = 'HIIIIIIIIII' + 'I'.repeat(262) + 'FWENDS!';
  say('W13 lengths', t280.length, word280.length);
  const posts = [['p_syd', 'Sydney', 'HI', 21, 0], ['p_jor', 'Jordan', t280, 22, 0], ['p_alx', 'Alex', word280, 23, 0], ['p_mor', 'Morgan', 'HI', 24, 4], ['p_ril', 'Riley', t280, 25, 4], ['p_qui', 'Quinn', word280, 26, 4]];
  const RX = ['\u{1F525}', '\u{1F44F}', '\u{1F602}', '❤️'];
  const pid = (p) => p[0] + '|' + (T - p[3] * m);
  for (let i = 0; i < 4; i++) { const rx = {}; posts.filter((p) => p[4]).forEach((p) => (rx[pid(p)] = RX[i])); rx['sandbox|' + (T - 20 * m)] = RX[i]; await L.put(pg, 'board/rx' + i, { name: 'Reactor ' + i, posts: [], rx, t: T }); }
  for (const [i, p] of posts.entries()) await L.put(pg, 'board/' + p[0], { name: p[1], posts: [{ t: T - p[3] * m, text: p[2], look: looks[i % looks.length] }], rx: {}, t: T });
  await L.put(pg, 'board/sandbox', { name: 'Cal', posts: [{ t: T - 20 * m, text: 'HI FWENDS', look: looks[0] }], rx: {}, t: T });
  await sleep(4000); await pg.wait("[].every.call(document.querySelectorAll(\".snp-fig img\"),function(i){return i.complete&&i.naturalWidth>0})", 20000).catch(function(){}); await sleep(1500);
  const meas = await pg.ev(`(function(){var out=[],W=document.documentElement.clientWidth;[].forEach.call(document.querySelectorAll(".snposts .snp"),function(s){var r=s.getBoundingClientRect(),p=s.querySelector(":scope>p"),pr=p.getBoundingClientRect(),hd=s.querySelector(":scope>div:not(.snp-fig):not(.snrx)"),hr=hd.getBoundingClientRect(),b=hd.querySelector("b"),nw=hd.querySelector(".tw-new"),sm=hd.querySelector("small"),rx=s.querySelector(".snrx"),rxr=rx&&rx.getBoundingClientRect(),fig=s.querySelector(".snp-fig");
    var over=[].filter.call(s.querySelectorAll("*"),function(e){var q=e.getBoundingClientRect();return q.width&&(q.right>r.right+1||q.left<r.left-1)}).map(function(e){var q=e.getBoundingClientRect(),c=e.parentElement.getBoundingClientRect();return e.tagName+"."+e.className+" ["+Math.round(q.left)+","+Math.round(q.right)+"] parent ["+Math.round(c.left)+","+Math.round(c.right)+"] parentOverflow "+getComputedStyle(e.parentElement).overflow+"/"+getComputedStyle(e.parentElement.parentElement).overflow});
    var btns=rx?[].map.call(rx.querySelectorAll("button"),function(x){var q=x.getBoundingClientRect();return Math.round(q.width)+"x"+Math.round(q.height)+"/"+getComputedStyle(x).fontSize}):[];
    var bb=b.getBoundingClientRect(),sr=sm&&sm.getBoundingClientRect(),nr=nw&&nw.getBoundingClientRect();
    out.push({name:b.textContent,head:hd.innerText.replace(/\\s+/g," "),order:[].map.call(hd.children,function(c){return c.tagName+(c.className?"."+c.className:"")}).join(","),
      headOneLine:sr?Math.abs(bb.bottom-sr.bottom)<8&&(!nr||Math.abs(nr.top-bb.top)<8):null,headAboveText:hr.bottom<=pr.top+1,figTop:fig?Math.round(fig.getBoundingClientRect().top-r.top):null,
      post:[Math.round(r.left),Math.round(r.right)],text:[Math.round(pr.left),Math.round(pr.right)],textFull:Math.abs(pr.left-r.left)<2&&Math.abs(pr.right-r.right)<2,textLines:Math.round(pr.height/parseFloat(getComputedStyle(p).lineHeight)),
      textOverflow:p.scrollWidth>p.clientWidth+1,rxBelowText:rx?rxr.top>=pr.bottom-1:null,rx:btns,overflowEls:over,y:Math.round(r.top+scrollY),h:Math.round(r.height)})});
    return {W:W,docW:document.documentElement.scrollWidth,posts:out}})()`);
  say('W13 doc width', meas.W, meas.docW);
  meas.posts.forEach((p) => say('W13 post', p));
  for (const [i, p] of meas.posts.entries()) {
    await pg.ev(`window.scrollTo(0,${Math.max(0, p.y - 200)})`); await sleep(250);
    await pg.shot(OUT + `a_w13_post${i + 1}_${p.name}.png`, { x: 0, y: p.y - 6, width: 390, height: p.h + 12 });
  }
  await pg.ev(`window.scrollTo(0,${Math.max(0, meas.posts[0].y - 120)})`); await sleep(300);
  await L.closeModals(pg);
  await pg.shot(OUT + 'a_w13_board_view.png');
  say('W13 pops', await pg.ev('window.__qaPops.slice(-6)'));
  say('page errors', pg.errs);
  L.save('a_log.txt');
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); L.save('a_log.txt'); process.exit(1); });
