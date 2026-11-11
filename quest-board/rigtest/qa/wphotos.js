// w-photos (v0.92, W8/W9): the photo feed on the town board, in the sandbox (Storage is a data-URL stand-in, the database localStorage;
// firestore.rules and storage.rules are NOT applied here, so who-may-delete is checked in the screens only). F1 the feed (the stand-in
// neighbors' posts: thumbnail, name, caption, counts). F2 "Post a photo" with a caption: sizes (1080 px, 360 px thumb) and the time
// stamp burnt into the picture. F3 a passed quest proof: "Post to the town board" in its verdict; a passed side-quest offered in the
// composer as "Proof: ...". F4 open a post, like / unlike, a double tap never counts twice. F5 comment, "Slow down", delete your own.
// F6 who may delete (not the owner): someone else's comment no, your own yes, any comment on your post yes, your post (its comments go
// too); the owner may delete anything. F7 hostile docs (javascript: URLs, long strings). F8 the 30 newest only. F9 no photo host -> no
// feed, the old board still there.
//   BASE=<sandbox build> CHROME_PORT=9374 OUT=<dir/> bash tools/windows/node.sh rigtest/qa/wphotos.js
const fs = require('fs');
const { browser, sleep, boot, E } = require('./wfocus_lib.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8817', OUT = process.env.OUT || require('os').tmpdir() + '/qa-out/wphotos/';
fs.mkdirSync(OUT, { recursive: true });
const P = []; const ok = (c, s) => { console.log((c ? 'ok   ' : 'BAD  ') + s); if (!c) P.push(s); };
const at = (y, mo, d, h, mi) => `(function(){var real=Date.now()-(window.__qbShift||0);window.__qbShift=new Date(${y},${mo - 1},${d},${h},${mi}).getTime()-real;window.__qb.x().render();return 1})()`;
const clear = '(function(){document.querySelectorAll("#layer .modal,.dropsplash,.bsplash").forEach(function(m){m.remove()});return 1})()';
const posts = '(async function(){document.querySelectorAll("#layer .modal,.dropsplash,.bsplash").forEach(function(m){m.remove()});var b=document.querySelector(".nav button[data-v=hall]");b&&b.click();await new Promise(function(r){setTimeout(r,1200)});var t=document.querySelector(\'[data-act=htab][data-t="posts"]\');if(t)t.click();await new Promise(function(r){setTimeout(r,800)});await window.__qbPhotos.load(true);await new Promise(function(r){setTimeout(r,800)});return 1})()';
const feed = `[].map.call(document.querySelectorAll('#app .ph-card'),function(c){var i=c.querySelector('img');return {p:c.dataset.p,text:c.innerText.replace(/\\s+/g,' ').slice(0,90),img:i?i.getAttribute('src').slice(0,30):null}})`;
const view = (pid) => `(async function(){document.querySelectorAll('#layer .modal').forEach(function(m){m.remove()});window.__qbPhotos.open('${pid}');await new Promise(function(r){setTimeout(r,900)});var v=document.querySelector('#layer .ph-view');if(!v)return null;
  return {text:v.innerText.replace(/\\s+/g,' ').slice(0,300),like:((v.querySelector('#phlike .note')||{}).innerText||'')+' / '+((v.querySelector('#phlike .ph-likers')||{}).innerText||''),delPost:!!v.querySelector('[data-act=phdelask]'),cms:[].map.call(v.querySelectorAll('.ph-cm'),function(c){var d=c.querySelector('[data-act=phcmdel]');return {t:c.innerText.replace(/\\s+/g,' ').slice(0,60),del:!!d,c:d?d.dataset.c:null}})}})()`;
const LS = (pre) => `Object.keys(localStorage).filter(function(k){return k.indexOf('${pre}')===0})`;
(async () => {
  const br = await browser(); const pg = await boot(br, { base: BASE }); await E(pg, 'W.closeAll()'); await E(pg, 'W.lvl(20)');
  await pg.ev(at(2026, 11, 16, 12, 0)); await pg.ev('(function(){if(window.__qbVisit)window.__qbVisit.check();return 1})()'); await sleep(3000);
  const me = await pg.ev('(window.__qbSide&&window.__qbSide.me())||"sandbox"');
  // F1. the stand-ins' posts
  const pj = await pg.ev(`window.__qbPhotos.fake('sb_justin','Justin','Leg day done','#c0392b',[['sb_vega','Vega','Strong!']],['sb_vega','sb_logan'])`);
  const pv = await pg.ev(`window.__qbPhotos.fake('sb_vega','Vega','Sunday clean-up','#16a085',[],[])`);
  await pg.ev(posts); let F = await pg.ev(feed);
  ok(F.length >= 2 && F.some((c) => c.p === pj && /Justin/.test(c.text) && /Leg day done/.test(c.text) && /2/.test(c.text)) && F.every((c) => c.img), `F1. the feed: ${JSON.stringify(F.map((c) => c.text))}`);
  const dims = await pg.ev(`(async function(){var d=JSON.parse(localStorage.getItem('qbsbx:photos/${pj}'));var ld=function(u){return new Promise(function(r){var i=new Image();i.onload=function(){r([i.naturalWidth,i.naturalHeight,Math.round(u.length*3/4/1024)])};i.onerror=function(){r(null)};i.src=u})};return {full:await ld(d.full),thumb:await ld(d.thumb)}})()`);
  ok(dims.full && Math.max(dims.full[0], dims.full[1]) <= 1080 && dims.thumb && Math.max(dims.thumb[0], dims.thumb[1]) <= 360, `F1. sizes: full ${JSON.stringify(dims.full)}, thumb ${JSON.stringify(dims.thumb)} [w, h, KB]`);
  // F2. "Post a photo"
  const f2 = await pg.ev(`(async function(){var w=function(ms){return new Promise(function(r){setTimeout(r,ms)})};var b=document.querySelector('[data-act=phnew]');if(!b)return {nb:true};b.click();await w(600);var inp=document.getElementById('phfile');if(!inp)return {noinput:true};
    var f=await window.__qbPhotos.file('Run','#2d6cdf',1600,1200);var dt=new DataTransfer();dt.items.add(f);inp.files=dt.files;inp.dispatchEvent(new Event('change',{bubbles:true}));await w(600);
    var c=document.getElementById('phcap');if(c)c.value='Morning run';var s=document.querySelector('[data-act=phsend]');if(!s)return {nosend:true};s.click();for(var i=0;i<30&&document.querySelector('#layer .ph-new');i++)await w(200);await w(800);
    var k=Object.keys(localStorage).filter(function(k){return k.indexOf('qbsbx:photos/${me}~')===0&&k.indexOf('/cm/')<0})[0];if(!k)return {nodoc:true};var d=JSON.parse(localStorage.getItem(k));
    var img=await new Promise(function(r){var i=new Image();i.onload=function(){r(i)};i.src=d.full});var cv=document.createElement('canvas');cv.width=img.naturalWidth;cv.height=img.naturalHeight;var g=cv.getContext('2d');g.drawImage(img,0,0);
    var x0=Math.round(cv.width*.55),y0=Math.round(cv.height*.85),px=g.getImageData(x0,y0,cv.width-x0,cv.height-y0).data,or=0,cy=0;for(var j=0;j<px.length;j+=4){if(px[j]>200&&px[j+1]>70&&px[j+1]<170&&px[j+2]<90)or++;if(px[j]<90&&px[j+1]>170&&px[j+2]>180)cy++}
    return {pid:k.slice('qbsbx:photos/'.length),cap:d.cap,kind:d.kind,w:img.naturalWidth,h:img.naturalHeight,orange:or,cyan:cy}})()`);
  ok(f2.pid && f2.cap === 'Morning run' && f2.kind === 'photo' && Math.max(f2.w, f2.h) === 720, `F2. "Post a photo" with a caption: ${JSON.stringify(f2)} (720 px: the sandbox's small size; 1080 with real Storage. A plain photo has no stamp: only checked photos carry one)`);
  const postedAt = Date.now();
  await pg.ev(posts); F = await pg.ev(feed); ok(F[0] && F[0].p === f2.pid && /Morning run/.test(F[0].text), `F2. my post is first in the feed: ${F[0] && F[0].text}`);
  // F3. a quest proof -> "Post to the town board" in its verdict (posts are 15 s apart at least: "Slow down a little")
  await sleep(Math.max(0, 15500 - (Date.now() - postedAt)));
  const f3 = await pg.ev(`(async function(){var w=function(ms){return new Promise(function(r){setTimeout(r,ms)})},x=window.__qb.x(),S=x.S;document.querySelectorAll('#layer .modal').forEach(function(m){m.remove()});
    var id='qa_run';S.quests.push({id:id,name:'Go for a 20-minute run',xp:25,stat:'fitness',cl:'body',rep:'once'});x.persist();x.render();
    var b=document.createElement('button');b.setAttribute('data-act','prove');b.setAttribute('data-id',id);document.querySelector('#app').appendChild(b);b.click();b.remove();await w(500);
    var inp=document.getElementById('pf1');if(!inp)return {noinput:true};var f=await window.__qbPhotos.file('Run','#8e44ad',1200,1600);var dt=new DataTransfer();dt.items.add(f);inp.files=dt.files;inp.dispatchEvent(new Event('change',{bubbles:true}));
    var sh=null;for(var i=0;i<80&&!sh;i++){await w(250);sh=document.querySelector('#layer .ph-share')}if(!sh)return {share:null,done:!!S.done[id],modal:(document.querySelector('#layer .modal')||{}).innerText};
    var ci=sh.querySelector('.ph-capin');if(ci)ci.value='Done before work';sh.querySelector('[data-act=phshare]').click();for(var j=0;j<30&&!sh.querySelector('.ph-done');j++)await w(200);
    var k=Object.keys(localStorage).filter(function(k){var v=k.indexOf('qbsbx:photos/${me}~')===0&&k.indexOf('/cm/')<0&&k.indexOf('${f2.pid}')<0;return v})[0];var d=k?JSON.parse(localStorage.getItem(k)):null;
    var or=0;if(d){var img=await new Promise(function(r){var i=new Image();i.onload=function(){r(i)};i.onerror=function(){r(null)};i.src=d.full});if(img){var cv=document.createElement('canvas');cv.width=img.naturalWidth;cv.height=img.naturalHeight;var g=cv.getContext('2d');g.drawImage(img,0,0);
      var x0=Math.round(cv.width*.5),y0=Math.round(cv.height*.85),px=g.getImageData(x0,y0,cv.width-x0,cv.height-y0).data;for(var q=0;q<px.length;q+=4){if(px[q]>200&&px[q+1]>70&&px[q+1]<170&&px[q+2]<90)or++}}}
    return {share:sh.innerText.replace(/\\s+/g,' ').slice(0,80),done:!!S.vdone[id],post:d&&{kind:d.kind,what:d.what,cap:d.cap},stampPixels:or,pid:k?k.slice('qbsbx:photos/'.length):null}})()`);
  ok(f3.post && f3.post.kind === 'quest' && f3.post.what === 'Go for a 20-minute run' && f3.post.cap === 'Done before work' && /Posted to the town board/.test(f3.share || '') && f3.stampPixels > 30, `F3. a passed quest proof, shared from its verdict, the time stamp on the posted picture: ${JSON.stringify(f3)}`);
  // a side-quest photo shows in the composer as "Proof: ..."
  const f3b = await pg.ev(`(async function(){var w=function(ms){return new Promise(function(r){setTimeout(r,ms)})},x=window.__qb.x(),S=x.S;if(!window.__qbSide)return null;window.__qbSide.wait(300);S.story=S.story||{};S.story.team=Object.assign(S.story.team||{},{nova:1});x.persist();
    document.querySelectorAll('#layer .modal').forEach(function(m){m.remove()});window.__qbSide.offer('nova');await w(300);var y=document.querySelector('#layer [data-act=sdqyes][data-v=nova]');if(y)y.click();await w(300);document.querySelectorAll('#layer .modal').forEach(function(m){m.remove()});
    window.__qbSide.ask('nova');await w(300);var f=await window.__qbPhotos.file('Bag','#d35400',1200,1200);await window.__qbSide.file(f);await w(2500);document.querySelectorAll('#layer .modal').forEach(function(m){m.remove()});
    window.__qbPhotos.neu();await w(600);var m=document.querySelector('#layer .ph-new');return {done:!!window.__qbSide.state().done.nova,picks:m?[].map.call(m.querySelectorAll('[data-act=phpick]'),function(b){return b.getAttribute('aria-label')}):null}})()`);
  ok(f3b && f3b.done && (f3b.picks || []).includes('Clear out your closet'), `F3. a passed side-quest offered in the composer ("Photos that passed a check today"): ${JSON.stringify(f3b)}`);
  await pg.ev(clear);
  // F4. open, like, unlike, a double tap
  let v = await pg.ev(view(pj)); ok(v && /Leg day done/.test(v.text) && /2/.test(v.like || '') && /Vega/.test(v.text) && /Strong!/.test(v.text), `F4. Justin's post opened: like "${v && v.like}", ${JSON.stringify(v && v.cms)}`);
  const like = async (n) => pg.ev(`(async function(){var w=function(ms){return new Promise(function(r){setTimeout(r,ms)})};for(var i=0;i<${n};i++){var b=document.querySelector('#layer [data-act=phlike]');if(b)b.click();await w(30)}await w(1500);
    var d=JSON.parse(localStorage.getItem('qbsbx:photolk/${me}')||'null');return {btn:((document.querySelector('#layer [data-act=phlike]')||{}).innerText||'').replace(/\\s+/g,' '),n:(document.querySelector('#layer #phlike .note')||{}).innerText,who:(document.querySelector('#layer #phlike .ph-likers')||{}).innerText||'',mine:!!(d&&d.j?JSON.parse(d.j).p['${pj}']:d&&d.p&&d.p['${pj}'])}})()`);
  const l1 = await like(1), l2 = await like(1), l3 = await like(2);
  ok(l1.n === '3 likes' && /you/i.test(l1.who) && l1.mine && l2.n === '2 likes' && !l2.mine && ['2 likes', '3 likes'].includes(l3.n), `F4. like -> ${JSON.stringify(l1)}, unlike -> ${JSON.stringify(l2)}, a double tap -> ${JSON.stringify(l3)} (never 4)`);
  // F5. comment
  const cm = await pg.ev(`(async function(){var w=function(ms){return new Promise(function(r){setTimeout(r,ms)})};var i=document.getElementById('phcmin');i.value='Nice one';document.querySelector('#layer [data-act=phcm]').click();await w(600);
    i=document.getElementById('phcmin');if(i)i.value='Again';var b=document.querySelector('#layer [data-act=phcm]');if(b)b.click();await w(400);var pops=[].map.call(document.querySelectorAll('#layer .pop'),function(p){return p.innerText}).slice(-1);
    return {cms:[].map.call(document.querySelectorAll('#layer .ph-cm'),function(c){return c.innerText.replace(/\\s+/g,' ').slice(0,40)}),pops:pops}})()`);
  ok(cm.cms.some((t) => /Nice one/.test(t)) && !cm.cms.some((t) => /Again/.test(t)) && /Slow down/.test(cm.pops[0] || ''), `F5. a comment, then a second within 3 s: ${JSON.stringify(cm)}`);
  // F6. who may delete, as a player (not the owner)
  await pg.ev('(function(){window.__qbPhotos.owner(false);return 1})()');
  v = await pg.ev(view(pj));
  const vegaC = v.cms.find((c) => /Strong!/.test(c.t)), myC = v.cms.find((c) => /Nice one/.test(c.t));
  ok(!v.delPost && vegaC && !vegaC.del && myC && myC.del, `F6. as a player, on Justin's post: no "Delete post", Vega's comment no delete, mine yes ${JSON.stringify(v.cms)}`);
  const d1 = await pg.ev(`(async function(){var b=document.querySelector('#layer [data-act=phcmdel][data-c="${myC.c}"]');b.click();await new Promise(function(r){setTimeout(r,900)});return {left:[].map.call(document.querySelectorAll('#layer .ph-cm'),function(c){return c.innerText.replace(/\\s+/g,' ').slice(0,30)}),key:!!localStorage.getItem('qbsbx:photos/${pj}/cm/${myC.c}')}})()`);
  ok(!d1.key && !d1.left.some((t) => /Nice one/.test(t)), `F6. my comment deleted: ${JSON.stringify(d1)}`);
  await pg.ev(`(function(){var t=Date.now();localStorage.setItem('qbsbx:photos/${f2.pid}/cm/sb_justin~'+t,JSON.stringify({x:'Nice pace',name:'Justin',t:t}));return 1})()`);
  v = await pg.ev(view(f2.pid)); const jc = v.cms.find((c) => /Nice pace/.test(c.t));
  ok(v.delPost && jc && jc.del, `F6. on my own post: "Delete post" there, Justin's comment deletable (post author) ${JSON.stringify(v.cms)}`);
  const d2 = await pg.ev(`(async function(){var w=function(ms){return new Promise(function(r){setTimeout(r,ms)})};document.querySelector('#layer [data-act=phdelask]').click();await w(300);var row=document.getElementById('phdelrow');var txt=row?row.innerText:'';
    document.querySelector('#layer [data-act=phdel]').click();await w(1500);return {confirm:txt.replace(/\\s+/g,' '),post:!!localStorage.getItem('qbsbx:photos/${f2.pid}'),cms:${LS(`qbsbx:photos/${f2.pid}/cm/`)}.length}})()`);
  ok(/Delete this post and its photo\? The comments go with it\./.test(d2.confirm) && !d2.post && !d2.cms, `F6. my post deleted after the confirm: ${JSON.stringify(d2)}`);
  await pg.ev('(function(){window.__qbPhotos.owner(true);return 1})()');
  v = await pg.ev(view(pj)); ok(v.delPost && v.cms.every((c) => c.del), `F6. as the owner (Cal): "Delete post" and every comment deletable on Justin's post`);
  await pg.ev(clear);
  // F7. hostile docs
  await pg.ev(`(function(){var t=Date.now()-1000;localStorage.setItem('qbsbx:photos/sb_logan~'+t,JSON.stringify({u:'sb_logan',name:'L'.repeat(300),cap:'C'.repeat(3000),kind:'photo',full:'javascript:alert(1)',thumb:'javascript:alert(2)',t:t}));
    localStorage.setItem('qbsbx:photos/sb_kenan~'+(t-5),JSON.stringify({u:'sb_kenan',name:'Kenan',cap:'<img src=x onerror=alert(3)>',kind:'photo',full:'data:image/png;base64,AAAA',thumb:'https://evil.example/x.jpg',t:t-5}));return 1})()`);
  await pg.ev(posts); const html = await pg.ev('document.querySelector("#app").innerHTML'); F = await pg.ev(feed);
  ok(!/javascript:/.test(html) && !/evil.example/.test(html) && !/onerror=alert/.test(html.replace(/&lt;img src=x onerror=alert\(3\)&gt;/g, '')) && !F.some((c) => /LLLLLLLLLLLLLLLLLLLLLLLLL/.test(c.text)), `F7. hostile posts: no javascript: URL, no picture from a non-bucket https host (evil.example; LEAD 08:36), no live markup, long strings capped (feed: ${JSON.stringify(F.slice(0, 4).map((c) => c.text.slice(0, 40)))})`);
  // F8. the 30 newest
  await pg.ev(`(async function(){for(var i=0;i<30;i++)await window.__qbPhotos.fake(i%2?'sb_jina':'sb_cynthia',i%2?'Jina':'Cynthia','Post '+i,'#'+(100000+i*7919).toString(16).slice(-6),[],[]);return 1})()`);
  await pg.ev(posts); F = await pg.ev(feed); const nAll = await pg.ev(`${LS('qbsbx:photos/')}.filter(function(k){return k.indexOf('/cm/')<0}).length`);
  // the 30 newest docs, minus those the feed drops as unsafe (my hostile Logan post has javascript: URLs)
  const want = await pg.ev(`(function(){var d=${LS('qbsbx:photos/')}.filter(function(k){return k.indexOf('/cm/')<0}).map(function(k){return JSON.parse(localStorage.getItem(k))}).sort(function(a,b){return b.t-a.t}).slice(0,30);var okU=function(u){return /^data:image\\/jpeg/.test(u||'')||/^https:\\/\\/firebasestorage\\.googleapis\\.com\\/v0\\/b\\/[^\\/]+\\/o\\/photos%2F/.test(u||'')};return d.filter(function(x){return okU(x.full)||okU(x.thumb)}).length})()`);
  const used = await pg.ev('(function(){var n=0;for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);n+=k.length+localStorage.getItem(k).length}return Math.round(n*2/1024)})()');
  ok(F.length === want && nAll > 30, `F8. ${nAll} posts stored, the feed shows ${F.length} = the 30 newest minus the unsafe ones (${want}) (localStorage now ~${used} KB of the browser's ~5 MB)`);
  ok(!pg.errs.length, `page errors: ${pg.errs.length} ${pg.errs.slice(0, 2).join(' | ')}`);
  await pg.shot(OUT + 'feed.png');
  await pg.close();
  // F9. no photo host: the game asks for "photos" and gets null
  const p2 = await br.page({ fresh: true });
  await p2.s('Page.addScriptToEvaluateOnNewDocument', { source: `(function(){var c;Object.defineProperty(window,'claude',{configurable:true,get:function(){return c},set:function(v){c={use:function(w){return w==='photos'?Promise.resolve(null):v.use(w)}}}})})();` });
  await p2.go(BASE + '/'); await p2.wait('!!(window.__qb && document.querySelector("#app") && !document.querySelector("#app .boot"))', 120000); await sleep(2500);
  await p2.ev(`(function(){var x=window.__qb.x(),S=x.S;S.created=true;S.char=window.__qb.fixChar({name:'Fey',sex:'f'});S.welcomed=1;x.persist();x.render();return 1})()`); await sleep(6000);
  await p2.ev(posts.replace('await window.__qbPhotos.load(true);', 'try{await window.__qbPhotos.load(true)}catch(e){}'));
  const f9 = await p2.ev(`({cards:document.querySelectorAll('#app .ph-card').length,newBtn:!!document.querySelector('#app [data-act=phnew]'),posts:(document.querySelector('#app')||{innerText:''}).innerText.replace(/\\s+/g,' ').slice(0,160)})`);
  ok(!f9.cards && !f9.newBtn && f9.posts.length > 20, `F9. no photo host: no feed and no "Post a photo"; the Posts tab still draws: "${f9.posts}"`);
  ok(!p2.errs.length, `F9. page errors: ${p2.errs.length} ${p2.errs.slice(0, 2).join(' | ')}`);
  console.log(P.length ? `W-PHOTOS: ${P.length} problem(s)` : 'W-PHOTOS: PASS');
  await br.close(); process.exit(P.length ? 1 : 0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(2); });
