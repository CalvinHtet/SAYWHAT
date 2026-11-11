// w-chatpic (v0.92, #130): pictures in the Town Hall chat, in the sandbox (Storage is the data-URL stand-in; the 40,000 chat rule and
// storage.rules are NOT applied here). C1 the camera button left of the box (the sandbox has a photo host). C2 a photo with typed words:
// one line with a thumbnail and the words, the box empties, my chat doc carries p {f, th, sp in my own folder, w, h}. C3 tap: the full
// picture. C4 another player's picture line: shown, no delete; a hostile one (javascript: URL, someone else's folder) dropped or cleaned.
// C5 a second photo at once: "One photo at a time" / "Slow down a little". C6 delete my picture line (two taps): gone, and its two
// Storage files are deleted (the host's del is watched). C7 pushed out by 10 newer lines: its files deleted too. C8 the doc stays under
// 36,000 characters (the rule allows 40,000). 0 page errors.
//   BASE=<sandbox build> CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/wchatpic.js
const { browser, sleep, boot, E } = require('./wfocus_lib.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8821';
const P = []; const ok = (c, s) => { console.log((c ? 'ok   ' : 'BAD  ') + s); if (!c) P.push(s); };
const chat = '(async function(){var w=function(ms){return new Promise(function(r){setTimeout(r,ms)})};document.querySelectorAll("#layer .modal,.dropsplash").forEach(function(m){m.remove()});var b=document.querySelector(".nav button[data-v=hall]");b&&b.click();await w(1200);var t=document.querySelector(\'[data-act=htab][data-t="chat"]\');if(t)t.click();await w(1500);return 1})()';
const pic = (words, col) => `(async function(){var w=function(ms){return new Promise(function(r){setTimeout(r,ms)})};var i=document.getElementById('tchin');if(i)i.value=${JSON.stringify(words)};
  var f=await window.__qbPhotos.file('Chat','${col}',1200,900);var inp=document.getElementById('tchfile');if(!inp)return {noinput:true};var dt=new DataTransfer();dt.items.add(f);inp.files=dt.files;inp.dispatchEvent(new Event('change',{bubbles:true}));return {sent:true,pops:[].map.call(document.querySelectorAll('#layer .pop'),function(p){return p.innerText}).slice(-2)}})()`;
const mine = (me) => `(function(){var d=JSON.parse(localStorage.getItem('qbsbx:chat/${me}')||'null');if(!d)return null;if(d.j)d=JSON.parse(d.j);var o=[];Object.keys(d.msgs||{}).forEach(function(r){(d.msgs[r]||[]).forEach(function(x){o.push({r:r,x:x.x,p:x.p?{f:String(x.p.f).slice(0,22),sp:x.p.sp,w:x.p.w,h:x.p.h}:null})})});return {lines:o,len:window.__qbChat.docLen(d)}})()`;
const lines = '[].map.call(document.querySelectorAll("#app .tch-pl, #app .tch p"),function(p){var im=p.querySelector(".tch-img img");return {t:p.innerText.replace(/\\s+/g," ").slice(0,50),img:im?im.getAttribute("src").slice(0,22):null,x:!!p.querySelector(".tch-x")}})';
(async () => {
  const br = await browser(); const pg = await boot(br, { base: BASE }); await E(pg, 'W.closeAll()'); await E(pg, 'W.lvl(20)');
  await pg.ev('(function(){if(window.__qbVisit)window.__qbVisit.check();return 1})()'); await sleep(3000);
  const me = await pg.ev('(window.__qbSide&&window.__qbSide.me())||"sandbox"');
  // watch the photo host's deletes
  await pg.ev('(async function(){var h=await window.__qbPhotos.host();window.__dels=[];var d=h.del;h.del=function(p){window.__dels.push(p);return d.apply(this,arguments)};return !!h})()');
  await pg.ev(chat);
  const c1 = await pg.ev('({btn:!!document.getElementById("tchpicb"),aria:(document.getElementById("tchpicb")||{getAttribute:function(){return null}}).getAttribute("aria-label"),input:!!document.getElementById("tchin")})');
  ok(c1.btn && c1.aria === 'Send a photo' && c1.input, `C1. the camera button beside the chat box: ${JSON.stringify(c1)}`);
  let r = await pg.ev(pic('Look at this view', '#2d6cdf')); await sleep(2500);
  let m = await pg.ev(mine(me)); let L = await pg.ev(lines);
  const p1 = m && m.lines.find((x) => x.p);
  ok(p1 && p1.x === 'Look at this view' && p1.p.sp && p1.p.sp.indexOf(`photos/${me}/chat_`) === 0 && p1.p.w > 0 && L.some((l) => l.img && /Look at this view/.test(l.t) && l.x) && (await pg.ev('(document.getElementById("tchin")||{}).value')) === '',
    `C2. a photo with words: one line, thumbnail + words + my delete, the box empty; my doc ${JSON.stringify(p1)}`);
  const view = await pg.ev(`(async function(){var b=document.querySelector('#app .tch-img');if(!b)return null;b.click();await new Promise(function(r){setTimeout(r,700)});var v=document.querySelector('#layer .tch-pv');var r=v?{who:(v.querySelector('.tch-h b')||{}).innerText,img:!!v.querySelector('img'),words:(v.querySelector('.tch-pvx')||{}).innerText}:null;document.querySelectorAll('#layer .modal').forEach(function(m){m.remove()});return r})()`);
  ok(view && view.who === 'You' && view.img && view.words === 'Look at this view', `C3. tap: the full picture ${JSON.stringify(view)}`);
  // C5. two photos at once
  const twice = await pg.ev(`(async function(){var f=await window.__qbPhotos.file('A','#16a085',800,600),g=await window.__qbPhotos.file('B','#c0392b',800,600);window.__qbChat.sendPic(f);window.__qbChat.sendPic(g);await new Promise(function(r){setTimeout(r,400)});return [].map.call(document.querySelectorAll('#layer .pop'),function(p){return p.innerText}).slice(-3)})()`);
  await sleep(3000);
  ok(twice.some((t) => /One photo at a time|Slow down a little/.test(t)), `C5. a second photo at once: ${JSON.stringify(twice)}`);
  // C4. another player's picture line, and hostile ones
  const now = Date.now();
  const thumb = await pg.ev("(async function(){var f=await window.__qbPhotos.file('J','#8e44ad',300,200);return await new Promise(function(r){var fr=new FileReader();fr.onload=function(){r(fr.result)};fr.readAsDataURL(f)})})()");
  await pg.ev(`(async function(){await window.__qbChat.put('sb_justin',{name:'Justin',t:${now},msgs:{1:[{x:'Morning!',t:${now - 3000},p:{f:${JSON.stringify(thumb)},th:${JSON.stringify(thumb)},sp:'photos/sb_justin/chat_${now}',w:300,h:200}},{x:'evil',t:${now - 2000},p:{f:'javascript:alert(1)',th:'javascript:alert(2)',sp:'photos/sb_justin/chat_1'}},{x:'stolen path',t:${now - 1000},p:{f:${JSON.stringify(thumb)},th:${JSON.stringify(thumb)},sp:'photos/${me}/chat_123'}},{x:'tracker',t:${now - 500},p:{f:'https://evil.example/x.jpg',th:'https://evil.example/t.jpg',sp:'photos/sb_justin/chat_9'}}]}});return 1})()`);
  await pg.ev(chat); await sleep(1500);
  const others = await pg.ev(`(function(){var html=document.querySelector('#app').innerHTML;var o=[].map.call(document.querySelectorAll('#app .tch p'),function(p){return {t:p.innerText.replace(/\\s+/g,' ').slice(0,30),img:!!p.querySelector('.tch-img'),x:!!p.querySelector('.tch-x')}}).filter(function(p){return /Morning|evil|stolen|tracker/.test(p.t)});var st=window.__qbChat.state();var j=null;try{(st.docs||st.others||[]).forEach(function(){})}catch(e){}return {lines:o,js:/javascript:/.test(html),ext:/evil.example/.test(html)}})()`);
  const parsed = await pg.ev(`(function(){var d=JSON.parse(localStorage.getItem('qbsbx:chat/sb_justin'));if(d.j)d=JSON.parse(d.j);var o=window.__qbChat.parse('sb_justin',d);return o.msgs[1].map(function(q){return {x:q.x,sp:q.p?q.p.sp:null,pic:!!q.p}})})()`);
  ok(others.lines.some((l) => /Morning/.test(l.t) && l.img && !l.x) && !others.js && !others.ext && parsed.find((q) => q.x === 'evil') && !parsed.find((q) => q.x === 'evil').pic && parsed.find((q) => q.x === 'stolen path').sp === '',
    `C4. Justin's picture line: shown, no delete; the javascript: one and a non-bucket https one (LEAD 08:36) show no picture; a path in my folder is dropped: ${JSON.stringify({ lines: others.lines, parsed })}`);
  // C6. delete my picture line (two taps) -> its two files go
  await pg.ev('(function(){window.__dels.length=0;return 1})()');
  const del = await pg.ev(`(async function(){var w=function(ms){return new Promise(function(r){setTimeout(r,ms)})};var p=[].filter.call(document.querySelectorAll('#app .tch-pl'),function(p){return /Look at this view/.test(p.innerText)&&p.querySelector('.tch-x')})[0];if(!p)return null;var x=p.querySelector('.tch-x');x.click();await w(300);var armed=x.textContent;x.click();await w(1500);
    return {armed:armed,left:[].some.call(document.querySelectorAll('#app .tch p'),function(q){return /Look at this view/.test(q.innerText)}),dels:window.__dels.slice()}})()`);
  ok(del && del.armed === 'Delete' && !del.left && del.dels.length === 2 && del.dels.every((d) => d.indexOf(p1.p.sp) === 0), `C6. my picture line deleted (first tap arms "Delete"): gone, Storage deletes ${JSON.stringify(del && del.dels)}`);
  // C7. a picture line pushed out by 10 newer lines
  await sleep(1500); await pg.ev(pic('', '#d35400')); await sleep(3000);
  m = await pg.ev(mine(me)); const p2 = m.lines.filter((x) => x.p).slice(-1)[0];
  ok(p2 && p2.x === '', `C7. a picture with no words is a line too: ${JSON.stringify(p2)}`);
  await pg.ev('(function(){window.__dels.length=0;return 1})()');
  const push = await pg.ev(`(async function(){var w=function(ms){return new Promise(function(r){setTimeout(r,ms)})},sent=0;var pops=[];for(var i=0;i<12;i++){var inp=document.getElementById('tchin');if(!inp)break;inp.value='line '+i;var b=document.querySelector('[data-act=tchsend]');if(b){b.click();sent++}await w(1150);var pp=[].map.call(document.querySelectorAll('#layer .pop'),function(p){return p.innerText}).slice(-1)[0];if(pp&&pops.indexOf(pp)<0)pops.push(pp);if(i===6)await w(61000)}await w(1500);return {sent:sent,pops:pops,dels:window.__dels.slice()}})()`);
  m = await pg.ev(mine(me));
  console.log('   after the 12 lines:', JSON.stringify(push.pops), JSON.stringify(m.lines.map((x) => x.x + (x.p ? '[' + x.p.sp.slice(-6) + ']' : ''))));
  ok(!/10 messages/.test(push.pops.join()) && push.dels.filter((d) => d.indexOf(p2.p.sp) === 0).length === 2 && !m.lines.some((x) => x.p && x.p.sp === p2.p.sp), `C7. pushed out by 12 newer lines (a minute's pause, under the 10-a-minute limit) (${push.sent} sent): its files deleted ${JSON.stringify(push.dels)}`);
  ok(m.len < 36000, `C8. my chat doc ${m.len} characters (kept under 36,000; the rule allows 40,000)`);
  ok(!pg.errs.length, `page errors: ${pg.errs.length} ${pg.errs.slice(0, 2).join(' | ')}`);
  console.log(P.length ? `W-CHATPIC: ${P.length} problem(s)` : 'W-CHATPIC: PASS');
  await br.close(); process.exit(P.length ? 1 : 0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(2); });
