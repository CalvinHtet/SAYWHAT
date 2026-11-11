// rc-v0.92d (Cal's last v0.92 add, 29wp_duelpub.js): every accepted coin challenge and Gym Pact shows on the Hall's Posts tab for
// everyone: a start post with a live line, a result post once both final counts are in (or 36 h after the end), reactions. Seeded duel
// docs (qbsbx:duel/<uid>) for the stand-in neighbors and this player, then the game's own load. Checks: the right posts and texts (pact
// both / one / neither, duel win / tie, live dots and bars, "waiting for the final counts", the 36 h result); never a post for asked,
// cancelled, declined, unanswered, an accept forged in the sender's own doc, an offer only the receiver's doc mentions, an odd stake or
// goal, a start in the future or older than 14 days; a hostile name escaped; a pact count capped at its days; at most 12 posts; a
// reaction saved in my own board doc; my own challenge's post can't be reacted to by me; reactions on these posts pay nobody; the page
// writes nothing into anyone else's duel doc.
//   BASE=<sandbox build> CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/wduelpub.js
const { browser, sleep, boot, E } = require('./wfocus_lib.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8817';
const P = []; const ok = (c, s) => { console.log((c ? 'ok   ' : 'BAD  ') + s); if (!c) P.push(s); };
(async () => {
  const br = await browser(); const pg = await boot(br, { base: BASE }); await E(pg, 'W.closeAll()'); await E(pg, 'W.lvl(20)');
  await pg.ev('(function(){if(window.__qbVisit)window.__qbVisit.check();return 1})()'); await sleep(3000);
  const me = await pg.ev('(window.__qbSide&&window.__qbSide.me())||"sandbox"');
  // the docs
  await pg.ev(`(function(me){var now=Date.now(),H=36e5,D=864e5,docs={};var doc=function(u,n){return docs[u]=docs[u]||{name:n,out:{},ans:{},sc:{},pout:{},pans:{},psc:{},t:now}};
    var N={sb_justin:'Justin',sb_vega:'Vega',sb_logan:'Logan',sb_kenan:'Kenan',sb_jina:'Jina',sb_cynthia:'<img src=x onerror=alert(1)>Cyn'};Object.keys(N).forEach(function(u){doc(u,N[u])});doc(me,'Fey');
    var J=docs.sb_justin,V=docs.sb_vega,L=docs.sb_logan,K=docs.sb_kenan,I=docs.sb_jina,C=docs.sb_cynthia,M=docs[me];
    /* live pact */ J.pout.pLive={to:'sb_vega',toName:'Vega',stake:500,goal:4,days:7,t:now-2*D-H};V.pans.pLive={acc:true,t:now-2*D};J.psc.pLive={n:2,fin:false,t:now-H};V.psc.pLive={n:1,fin:false,t:now-H};
    /* ended pacts, final: one / both / neither */ I.pout.pOne={to:'sb_cynthia',stake:1000,goal:4,days:7,t:now-9*D-H};C.pans.pOne={acc:true,t:now-9*D};I.psc.pOne={n:4,fin:true,t:now-2*D};C.psc.pOne={n:2,fin:true,t:now-2*D};
    K.pout.pBoth={to:'sb_logan',stake:250,goal:3,days:7,t:now-8*D};L.pans.pBoth={acc:true,t:now-8*D};K.psc.pBoth={n:3,fin:true,t:now-D};L.psc.pBoth={n:50,fin:true,t:now-D};
    V.pout.pNone={to:'sb_kenan',stake:100,goal:5,days:7,t:now-8*D-H};K.pans.pNone={acc:true,t:now-8*D};V.psc.pNone={n:2,fin:true,t:now-D};K.psc.pNone={n:4,fin:true,t:now-D};
    /* ended duels, final: a win / a tie */ L.out.dWin={to:'sb_kenan',kind:'q',stake:250,days:3,t:now-4*D-H};K.ans.dWin={acc:true,t:now-4*D};L.sc.dWin={n:520,fin:true,t:now-D+H};K.sc.dWin={n:410,fin:true,t:now-D+H};
    J.out.dTie={to:'sb_jina',kind:'w',stake:100,days:1,t:now-3*D};I.ans.dTie={acc:true,t:now-3*D+H};J.sc.dTie={n:300,fin:true,t:now-D};I.sc.dTie={n:300,fin:true,t:now-D};
    /* ended, not final, inside the 36 h */ V.out.dWait={to:'sb_jina',kind:'w',stake:100,days:1,t:now-D-2*H};I.ans.dWait={acc:true,t:now-D-H};V.sc.dWait={n:300,fin:false,t:now-2*H};
    /* ended 37 h+ ago, not final: the result on the last numbers */ C.out.dLate={to:'sb_logan',kind:'q',stake:500,days:1,t:now-3*D};L.ans.dLate={acc:true,t:now-3*D+H};C.sc.dLate={n:90,fin:false,t:now-2*D};L.sc.dLate={n:40,fin:false,t:now-2*D};
    /* my own live pact with Justin */ M.pout.pMine={to:'sb_justin',toName:'Justin',stake:250,goal:3,days:7,t:now-D};J.pans.pMine={acc:true,t:now-D+H};
    /* never posted */ V.out.nDecl={to:'sb_logan',kind:'q',stake:100,days:1,t:now-5*H};L.ans.nDecl={acc:false,t:now-4*H};
    K.pout.nCanc={to:'sb_jina',stake:250,goal:3,days:7,t:now-3*H,cancel:true};I.pans.nCanc={acc:true,t:now-2*H};
    C.out.nForge={to:'sb_justin',kind:'w',stake:100,days:1,t:now-2*H};C.ans.nForge={acc:true,t:now-H};
    J.out.nAsk={to:'sb_kenan',kind:'q',stake:100,days:1,t:now-H};
    K.pans.nNoOffer={acc:true,t:now-H};
    L.out.nStake={to:'sb_vega',kind:'q',stake:999999,days:3,t:now-H};V.ans.nStake={acc:true,t:now-H};
    J.pout.nGoal={to:'sb_logan',stake:100,goal:6,days:7,t:now-H};L.pans.nGoal={acc:true,t:now-H};
    I.out.nFuture={to:'sb_vega',kind:'q',stake:100,days:1,t:now};V.ans.nFuture={acc:true,t:now+5*D};
    K.out.nOld={to:'sb_justin',kind:'q',stake:100,days:3,t:now-30*D};J.ans.nOld={acc:true,t:now-30*D};
    Object.keys(docs).forEach(function(u){localStorage.setItem('qbsbx:duel/'+u,JSON.stringify(docs[u]))});return 1})(${JSON.stringify(me)})`);
  const before = await pg.ev(`(function(){var o={};Object.keys(localStorage).filter(function(k){return /^qbsbx:duel\\//.test(k)&&k!=='qbsbx:duel/${me}'}).forEach(function(k){o[k]=localStorage.getItem(k)});return o})()`);
  await pg.ev('(async function(){window.__qbDuel.st.busy=0;await window.__qbDuel.load();return 1})()'); await sleep(800);
  const posts = await pg.ev('window.__qbDuel.pub.posts().map(function(x){return (x.res?"R:":"S:")+x.p.cid})');
  console.log('   posts:', JSON.stringify(posts));
  const want = ['S:pLive', 'S:pOne', 'R:pOne', 'S:pBoth', 'R:pBoth', 'S:pNone', 'R:pNone', 'S:dWin', 'R:dWin', 'S:dTie', 'R:dTie', 'S:dWait', 'S:dLate', 'R:dLate', 'S:pMine'];
  const never = ['nDecl', 'nCanc', 'nForge', 'nAsk', 'nNoOffer', 'nStake', 'nGoal', 'nFuture', 'nOld'];
  const allIds = await pg.ev('window.__qbDuel.pub.all().map(function(p){return p.cid})');
  ok(never.every((n) => !allIds.includes(n)), `never posted: declined, cancelled (even with an accept), an accept forged in the sender's own doc, only asked, an accept with no offer, stake 999,999, goal 6, a start in the future, 30 days old (${never.filter((n) => allIds.includes(n)).join(', ') || 'none of them'})`);
  ok(posts.length <= 12, `at most 12 posts: ${posts.length} (of ${want.length} possible)`);
  const shown = posts.map((p) => p);
  ok(shown.every((p) => want.includes(p)) && !shown.includes('R:dWait') && !shown.includes('R:pLive') && !shown.includes('R:pMine'), `no result post before a challenge is settled (live, mine, waiting): ${JSON.stringify(shown.filter((p) => !want.includes(p) || /R:(dWait|pLive|pMine)/.test(p)))}`);
  // the Posts tab
  await pg.ev(`(async function(){var w=function(ms){return new Promise(function(r){setTimeout(r,ms)})};document.querySelectorAll('#layer .modal,.dropsplash').forEach(function(m){m.remove()});var b=document.querySelector('.nav button[data-v=hall]');b&&b.click();await w(1200);
    var t=document.querySelector('[data-act=htab][data-t="posts"]');if(t)t.click();await w(1000);return 1})()`);
  const tab = await pg.ev(`(function(){var s=document.getElementById('dlpub');if(!s)return null;return {afterMine:!!(s.previousElementSibling&&s.previousElementSibling.id==='dlcard'),img:!!s.querySelector('img'),title:(s.querySelector('h3')||{}).innerText,
    items:[].map.call(s.querySelectorAll('.dlpi'),function(d){return {t:d.querySelector('p').innerText.replace(/\\s+/g,' '),live:[].map.call(d.querySelectorAll('.dlvs'),function(v){return v.innerText.replace(/\\s+/g,' ')}).join(''),dots:[].map.call(d.querySelectorAll('.gpdots'),function(g){return g.querySelectorAll('i.on').length+'/'+g.querySelectorAll('i').length}),note:(d.querySelector('small.note')||{}).innerText,rx:d.querySelectorAll('.snrxb').length,rxOff:d.querySelectorAll('.snrxb[disabled]').length}})}})()`);
  ok(tab && tab.afterMine && /Challenges in town/i.test(tab.title || ''), `the "Challenges in town" section sits under my own Challenges card: ${JSON.stringify(tab && { afterMine: tab.afterMine, title: tab.title })}`);
  const find = (re) => (tab ? tab.items.find((i) => re.test(i.t)) : null);
  let i = find(/Justin and Vega started a Gym Pact: 4 workout days in 7, 500 coins each/);
  ok(i && JSON.stringify(i.dots) === '["2/4","1/4"]' && /left/.test(i.note || ''), `live pact: "${i && i.t}" | dots ${JSON.stringify(i && i.dots)} | "${i && i.note}"`);
  i = find(/Gym Pact done: .*Jina.* made it with 4 days/); ok(i && /takes both stakes/.test(i.t), `pact, one made it: "${i && i.t}"`);
  i = find(/Kenan and Logan both made it, 3 and 7 days/); ok(i && /1\.5 times the stake/.test(i.t), `pact, both (Logan published 50 days for a 7-day pact, capped at 7): "${i && i.t}"`);
  i = find(/neither Vega nor Kenan made it/); ok(i && /\(2 and 4 days\)/.test(i.t) && /Both stakes are gone/.test(i.t), `pact, neither (goal 5): "${i && i.t}"`);
  i = find(/Logan beat Kenan at quest XP, 520 to 410, and takes the pot of 500/); ok(!!i, `duel won: "${i && i.t}"`);
  i = find(/A tie between Justin and Jina at 300 Training XP\. Both stakes back/); ok(!!i, `duel tie: "${i && i.t}"`);
  i = tab && tab.items.find((x) => /Vega challenged Jina/.test(x.t)); ok(i && /waiting for the final counts/i.test(i.note || ''), `ended, not final, inside 36 h: "${i && i.t}" | "${i && i.note}"`);
  i = find(/beat Logan at quest XP, 90 to 40/); ok(!!i, `ended 2 days ago, never final: the result on the last numbers: "${i && i.t}"`);
  ok(tab && !tab.img && tab.items.some((x) => /<img src=x onerror=alert/.test(x.t)), `a hostile name is shown as text (cut to 24 characters), no <img> in the section`);
  i = find(/Fey and Justin started a Gym Pact/); ok(i && i.rx === i.rxOff, `my own pact's post: no reaction I can give (${i && i.rx} buttons, ${i && i.rxOff} of them disabled; an own post shows only others' counts)`);
  // a reaction on someone else's challenge post, saved in my own board doc; reactions on mine pay nobody
  const rx = await pg.ev(`(async function(){var w=function(ms){return new Promise(function(r){setTimeout(r,ms)})};var s=document.getElementById('dlpub');var b=[].filter.call(s.querySelectorAll('.dlpi'),function(d){return /Justin and Vega started/.test(d.innerText)})[0].querySelector('[data-act=snrx]');var pid=b.dataset.p;b.click();await w(1500);
    var d=JSON.parse(localStorage.getItem('qbsbx:board/${me}')||'null');var on=document.querySelector('#dlpub .snrxb.on');return {pid:pid,saved:!!(d&&d.rx&&d.rx[pid]),on:!!on,count:on?on.innerText.trim():null}})()`);
  ok(rx.saved && rx.on, `a reaction on Justin and Vega's post: lit at once, saved in my own board doc ${JSON.stringify(rx)}`);
  const minePid = await pg.ev(`(function(){var p=window.__qbDuel.pub.posts().filter(function(x){return x.p.cid==='pMine'})[0];return p&&p.id})()`);
  const c0 = await pg.ev('window.__qb.x().S.coins');
  await pg.ev(`(function(){localStorage.setItem('qbsbx:board/sb_vega',JSON.stringify({rx:{${JSON.stringify(minePid)}:'🔥'},posts:[],t:Date.now()}));return 1})()`);
  await pg.go(BASE + '/'); await pg.wait('!!(window.__qb && document.querySelector("#app") && !document.querySelector("#app .boot"))', 120000); await sleep(6000);
  await pg.ev('(async function(){if(window.__qbDuel){window.__qbDuel.st.busy=0;await window.__qbDuel.load()}return 1})()'); await sleep(1500);
  const c1 = await pg.ev('window.__qb.x().S.coins');
  ok(c1 === c0, `Vega reacts to my pact's post: no coins for me (${c0} -> ${c1}; reactions pay only on board posts)`);
  const after = await pg.ev(`(function(){var o={};Object.keys(localStorage).filter(function(k){return /^qbsbx:duel\\//.test(k)&&k!=='qbsbx:duel/${me}'}).forEach(function(k){o[k]=localStorage.getItem(k)});return o})()`);
  const changed = Object.keys(before).filter((k) => before[k] !== after[k]);
  ok(!changed.length, `nobody else's duel doc was written by my game: ${changed.length ? changed.join(', ') : 'all unchanged'}`);
  ok(!pg.errs.length, `page errors: ${pg.errs.length} ${pg.errs.slice(0, 2).join(' | ')}`);
  console.log(P.length ? `W-DUELPUB: ${P.length} problem(s)` : 'W-DUELPUB: PASS');
  await br.close(); process.exit(P.length ? 1 : 0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(2); });
