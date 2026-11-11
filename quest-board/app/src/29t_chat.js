/* ---------- Town Hall chat: three public rooms, live (Cal, 2026-11-09) ----------
   Cal: "Chat (3 public live rooms, people count per room)". docs/TOWNHALL.md has the details.
   - Each player writes only their own docs (firestore.rules), so each player's messages live in chat/<id> =
     {name, msgs:{"1":[{x,t}],"2":[...],"3":[...]}, t}, the last 10 per room. Every phone listens to the chat collection and merges
     everyone's messages by time, per room. It is all public: anyone signed in reads every room.
   - Who is in a room: chatnow/<id> = {name, ch, t}, written when the Chat tab opens, every 45 s while it stays open and on screen,
     and cleared (ch 0) when the player leaves the tab or the app. A room counts the players seen in it within the last 2 minutes.
     Presence has its own small doc, so a heartbeat is tiny and only phones with the Chat tab open listen to it.
   - Times are real time (the game clock minus a Test "Skip a week" shift), so a shifted test phone never sorts or counts wrong.
   - Limits: 280 characters; one message a second and 10 a minute from one phone; control and text-direction characters removed.
   - Everything read from other players is treated as hostile: shapes checked, counts and lengths capped, every string escaped.
   - Only you can delete your own messages (Cal, 2026-11-10): an × on your own lines takes that line out of your own chat doc.
     Nobody, the owner included, can hide or clear anyone else's; the owner's old hide and clear marks (mod) are ignored, and the
     rules let only the player write their chat and chatnow docs. */
/* the rooms are plain "Room 1", "Room 2", "Room 3" for now (Cal, 2026-11-09); names are only shown, never stored */
var TCHROOMS=[[1,"Room 1"],[2,"Room 2"],[3,"Room 3"]],TCHMAX=280,TCHKEEP=10,TCHHERE=120000,TCHBEAT=45000;
/* control, zero-width, line-separator, text-direction and byte-order characters (built from char codes, so this file holds no
   invisible characters) */
var TCHBAD=new RegExp("["+[[0,31],[127,159],[8203,8207],[8232,8238],[8288,8303],[65279,65279]].map(function(r){return String.fromCharCode(r[0])+"-"+String.fromCharCode(r[1])}).join("")+"]","g");
var TCH={room:1,docs:{},now:{},me:null,ready:0,on:0,unsub:null,poll:0,polled:0,err:"",denyAt:0,nowUnsub:null,nowTick:0,nowOk:0,nowErr:"",
  draft:"",sent:[],q:null,lastT:0,joined:0,beatT:0,seen:null,logH:"",roomsH:"",whoH:"",stick:0,armed:""};
(function(){try{var r=+sessionStorage.getItem("qbChatRoom");if(r===1||r===2||r===3)TCH.room=r}catch(e){}})();
htabCss("qb-chat-css",
  ".tch{gap:10px}"
  +".tch-rooms{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}"
  +".tch-r{position:relative;display:flex;align-items:center;justify-content:center;gap:6px;min-height:40px;padding:0 6px;border-radius:10px;border:1px solid var(--line);background:rgba(255,255,255,.03);color:var(--fg);font:600 13px/1.1 var(--font-body,system-ui);cursor:pointer}"
  +".tch-r.on{border-color:var(--accent);background:var(--surface2);box-shadow:inset 0 0 0 1px var(--accent)}"
  +".tch-r small{min-width:20px;padding:2px 6px;border-radius:999px;background:rgba(255,255,255,.08);color:var(--muted);font:700 11px/1.2 var(--font-mono,monospace);text-align:center}"
  +".tch-r.on small{background:var(--accent);color:#fff}"
  +".tch-rdot{position:absolute;top:5px;right:6px;width:8px;height:8px;border-radius:50%;background:#ff4d5e}"
  +".tch-who{display:flex;align-items:center;justify-content:space-between;gap:8px;min-height:18px}"
  +".tch-who small{min-width:0;color:var(--muted);font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}"
  +".tch-logw{position:relative}"
  +".tch-log{height:calc(100vh - 440px);height:calc(100dvh - 440px);min-height:230px;max-height:640px;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;display:flex;flex-direction:column;gap:2px;padding:8px;border-radius:12px;background:rgba(0,0,0,.18);border:1px solid var(--line)}"
  +".tch-empty{margin:auto;text-align:center;max-width:260px}"
  +".tch-h{display:flex;align-items:baseline;gap:8px;min-width:0}"
  +".tch-h b{font-size:13px;color:var(--fg);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}"
  +".tch-h small{flex:none;font-size:11px;color:var(--muted)}"
  +".tch-x{margin-left:6px;padding:0 4px;border:0;background:none;color:#ff9d7a;font-size:15px;line-height:1;cursor:pointer;vertical-align:middle}"
  +".tch-new{position:absolute;left:50%;bottom:10px;transform:translateX(-50%);padding:7px 12px;border-radius:999px;border:0;background:var(--accent);color:#fff;font:700 12px/1 var(--font-body,system-ui);box-shadow:0 6px 16px rgba(0,0,0,.4);cursor:pointer}"
  +".tch-new[hidden]{display:none}"
  +".tch-in{display:flex;gap:8px}"
  +".tch-in input{flex:1;min-width:0;min-height:44px;padding:0 12px;border-radius:10px;border:1px solid var(--line);background:var(--surface2);color:var(--fg);font:inherit;font-size:16px}"
  +".tch-in .btn{flex:none}"
  +".tch-foot{display:flex;justify-content:space-between;gap:8px}.tch-foot small{font-size:11px}#tchcount{flex:none;color:var(--gold)}"
  +".tch-ndot{position:absolute;top:4px;left:18%;width:9px;height:9px;border-radius:50%;background:#ff4d5e;box-shadow:0 0 0 2px var(--surface);pointer-events:none}"
  +"body.tch-typing .nav{display:none}");
/* real time, whatever the Test tools did to the game clock */
function tchNow(){return Date.now()-qbShift()}
/* one line of plain text: no control, zero-width or text-direction characters, spaces squeezed, at most n characters */
function tchClean(s,n){s=(typeof s==="string"?s:"").slice(0,2000).replace(TCHBAD," ").replace(/\s+/g," ").trim();
  return s.slice(0,n||TCHMAX).replace(/[\ud800-\udbff]$/,"")}
function tchName(x){return tchClean(x,24)||"Player"}
function tchRoomName(r){var x=TCHROOMS.filter(function(q){return q[0]===r})[0];return x?x[1]:"Room "+r}
function tchEmpty(){return {msgs:{1:[],2:[],3:[]}}}
/* a player's chat doc as read: anything malformed is dropped, never thrown (an old mod field is not read) */
function tchParse(id,d){if(!d||typeof d!=="object"||Array.isArray(d))return null;var o={id:id,name:tchName(d.name),msgs:{1:[],2:[],3:[]},t:+d.t||0},m=d.msgs;
  if(m&&typeof m==="object")TCHROOMS.forEach(function(r){var a=m[r[0]];if(!Array.isArray(a))return;
    a.slice(-TCHKEEP).forEach(function(x){if(!x||typeof x!=="object")return;var t=+x.t,s=tchClean(x.x),im=tchImg(x.p,id);if((s||im)&&isFinite(t)&&t>0){var q={x:s,t:t};if(im)q.p=im;o.msgs[r[0]].push(q)}})});
  return o}
/* #130 (Cal: pictures in chat, the part the photo feed didn't cover): a line may carry a picture, p = {f: full URL, th: thumbnail
   URL, sp: its two files' path in Storage without ".jpg", w, h}, uploaded with the photo feed's own code (29ph_photos.js phImages and
   the "photos" host: Firebase Storage, photos/<uid>/chat_<ms>.jpg and _t.jpg; a data URL in the sandbox). Not a proof: no check, no
   stamp, no coins. A picture line may have no text. Read like the rest of a hostile doc: the URLs pass phUrl (https, a JPEG data URL,
   or the local emulator), the path must be the sender's own folder, sizes are capped. */
function tchImg(p,id){if(!p||typeof p!=="object"||Array.isArray(p)||typeof phUrl!=="function")return null;var f=phUrl(p.f),th=phUrl(p.th)||f;if(!f)return null;
  var sp=typeof p.sp==="string"&&p.sp.indexOf("photos/"+id+"/chat_")===0&&p.sp.length<200&&/^[\w\/~.-]+$/.test(p.sp)?p.sp:"";
  return {f:f,th:th,sp:sp,w:Math.max(0,Math.min(4096,Math.floor(+p.w)||0)),h:Math.max(0,Math.min(4096,Math.floor(+p.h)||0))}}
function tchCopy(p){var o=tchEmpty();TCHROOMS.forEach(function(r){o.msgs[r[0]]=(p.msgs[r[0]]||[]).map(function(x){var q={x:x.x,t:x.t};if(x.p)q.p=Object.assign({},x.p);return q})});return o}
/* this player's own doc, as this phone last wrote it */
function tchMine(){var me=TCH.me||tchEmpty();return {id:MYUID,name:tchName((S.char&&S.char.name)||""),msgs:me.msgs,t:TCH.lastT}}
/* one room: everyone's messages, oldest first, the newest 60 */
function tchRoomMsgs(r){var now=tchNow(),out=[];
  Object.keys(TCH.docs).forEach(function(id){var d=TCH.docs[id];(d.msgs[r]||[]).forEach(function(m){
    if(m.t>now+600000)return;   /* dated in the future: a wrong clock, or someone pinning theirs to the bottom */
    out.push({id:id,name:d.name,x:m.x,t:m.t,k:id+"|"+m.t,p:m.p||null})})});
  out.sort(function(a,b){return a.t-b.t||(a.id<b.id?-1:a.id>b.id?1:0)});
  return out.slice(-60)}
/* unread: per room, the newest message this phone has shown (kept on the device, not in the save) */
function tchSeenKey(){return "qbChatSeen:"+(MYUID||"")}
function tchSeenSave(){try{localStorage.setItem(tchSeenKey(),JSON.stringify(TCH.seen))}catch(e){}}
function tchNewest(r,any){var ms=tchRoomMsgs(r);for(var i=ms.length-1;i>=0;i--)if(any||ms[i].id!==MYUID)return ms[i].t;return 0}
/* the first time on this phone everything already there counts as read, so the dot only means new messages */
function tchSeenInit(){var s=null;try{s=JSON.parse(localStorage.getItem(tchSeenKey())||"null")}catch(e){}
  if(!s||typeof s!=="object"||Array.isArray(s)){s={};TCH.seen=s;TCHROOMS.forEach(function(r){s[r[0]]=tchNewest(r[0],1)});tchSeenSave()}
  TCH.seen=s}
function tchUnread(r){return !!TCH.seen&&tchNewest(r,0)>(+TCH.seen[r]||0)}
function tchMarkSeen(){if(!TCH.seen)return;var r=TCH.room,n=tchNewest(r,1);if(n>(+TCH.seen[r]||0)){TCH.seen[r]=n;tchSeenSave()}}
/* the chat collection changed */
function tchOnSnap(q){var docs={};
  ((q&&q.docs)||[]).slice(0,300).forEach(function(s){try{var id=String(s.id||"");if(!id||id.length>128)return;var p=tchParse(id,s.data());if(p)docs[id]=p}catch(e){}});
  var mine=docs[MYUID],first=!TCH.ready;
  /* this player's own doc: what this phone wrote, unless their other phone changed or deleted it since */
  if(first){TCH.me=mine?tchCopy(mine):tchEmpty();TCH.lastT=mine?mine.t:0;TCH.ready=1}
  else if(!mine){if(TCH.lastT){TCH.me=tchEmpty();TCH.lastT=0}}
  else if(mine.t!==TCH.lastT){TCH.me=tchCopy(mine);TCH.lastT=mine.t}
  if(MYUID)docs[MYUID]=tchMine();
  TCH.docs=docs;TCH.err="";
  if(first)tchSeenInit();
  tchUpdate()}
/* the listener: from boot once the Hall is open (for the unread dot); polling only where the database cannot push */
function tchStart(force){if(TCH.on||!socOn()||!loaded||!S||!S.created)return;
  if(TCH.err==="permission-denied"&&(!force||Date.now()-TCH.denyAt<60000))return;
  TCH.on=1;
  try{var ref=db.collection("chat");
    if(ref&&typeof ref.onSnapshot==="function"){var u=ref.onSnapshot(function(q){tchOnSnap(q)},function(e){tchFail(e)});if(typeof u==="function")TCH.unsub=u}
    else tchPollStart()}catch(e){tchFail(e)}}
function tchFail(e){TCH.err=(e&&e.code)||"error";TCH.unsub=null;
  if(TCH.err==="unavailable"){TCH.on=0;setTimeout(function(){tchStart()},5000)}
  else if(TCH.err==="permission-denied"){TCH.on=0;TCH.denyAt=Date.now()}
  else tchPollStart();
  tchUpdate()}
function tchPollStart(){if(TCH.poll)return;
  var go=function(){if(document.hidden||!socOn())return;if(!htabShown("chat")&&Date.now()-TCH.polled<60000)return;TCH.polled=Date.now();
    db.collection("chat").limit(200).get().then(function(q){tchOnSnap(q)},function(e){TCH.err=(e&&e.code)||"error";
      if(TCH.err==="permission-denied"){clearInterval(TCH.poll);TCH.poll=0;TCH.on=0;TCH.denyAt=Date.now()}tchUpdate()})};
  TCH.poll=setInterval(go,8000);go()}
/* writes to this player's own chat doc, one at a time, always the whole doc as this phone holds it. The doc stays under 36,000
   characters (firestore.rules: 40,000; a picture line adds about 500); a sandbox picture's data URL counts as one character, since
   only the stand-in database ever holds one. */
function tchDocLen(doc){return JSON.stringify(doc).replace(/data:image\/jpeg;base64,[A-Za-z0-9+\/=]+/g,"d").length}
function tchFit(doc){var n=0;
  while(tchDocLen(doc)>36000&&n++<60){var old=null;TCHROOMS.forEach(function(r){var a=doc.msgs[r[0]];if(a.length&&(!old||a[0].t<old[0].t))old=a});if(!old)break;old.shift()}}
/* the Storage paths of the pictures in this player's own lines */
function tchPics(me){var o={};if(me&&me.msgs)TCHROOMS.forEach(function(r){(me.msgs[r[0]]||[]).forEach(function(x){if(x.p&&x.p.sp)o[x.p.sp]=1})});return o}
/* a picture whose line left this player's doc (deleted, or pushed out by the newest 10 or the size cap) goes from Storage too, once
   the doc is saved */
function tchDropPics(before){var now=tchPics(TCH.me),h=typeof PH!=="undefined"&&PH.host;if(!h)return;
  Object.keys(before).forEach(function(sp){if(now[sp])return;[sp+".jpg",sp+"_t.jpg"].forEach(function(f){try{h.del(f).catch(function(){})}catch(e){}})})}
function tchWrite(mut){
  var run=function(){if(!socOn()||!TCH.me)return Promise.reject({code:"offline"});
    var undo=JSON.stringify(TCH.me),pics=tchPics(TCH.me);mut(TCH.me);
    var t=Math.max(tchNow(),TCH.lastT+1),doc={name:tchName((S.char&&S.char.name)||""),msgs:TCH.me.msgs,t:t};tchFit(doc);
    TCH.lastT=t;TCH.docs[MYUID]=tchMine();tchUpdate();
    return db.doc("chat/"+MYUID).set(JSON.parse(JSON.stringify(doc))).then(function(){tchDropPics(pics)},function(er){
      try{TCH.me=JSON.parse(undo)}catch(e){}TCH.docs[MYUID]=tchMine();tchUpdate();throw er})};
  var p=(TCH.q||Promise.resolve()).then(run);TCH.q=p.catch(function(){});return p}
function tchSend(){var inp=document.getElementById("tchin"),x=tchClean(inp?inp.value:TCH.draft);if(!x)return;
  if(!socOn()){pop("Chat needs the cloud save");return}
  if(!TCH.ready){pop(TCH.err==="permission-denied"?"Chat is not switched on yet":"Chat is still loading");return}
  var now=tchNow(),r=TCH.room;TCH.sent=TCH.sent.filter(function(t){return now-t<60000});
  if(TCH.sent.length&&now-TCH.sent[TCH.sent.length-1]<1000){pop("Slow down a little");return}
  if(TCH.sent.length>=10){pop("That's 10 messages this minute. Give it a few seconds.");return}
  TCH.sent.push(now);TCH.draft="";if(inp)inp.value="";tchCount();TCH.stick=1;
  tchWrite(function(me){var a=me.msgs[r]||(me.msgs[r]=[]),last=a.length?a[a.length-1].t:0;a.push({x:x,t:Math.max(tchNow(),last+1)});if(a.length>TCHKEEP)a.splice(0,a.length-TCHKEEP)})
    .catch(function(er){var i2=document.getElementById("tchin");if(!TCH.draft){TCH.draft=x;if(i2&&!i2.value)i2.value=x;tchCount()}pop("Could not send: "+((er&&er.code)||"error"))})}
/* a picture (camera or library): made small and uploaded like a feed photo, then sent as a line, with whatever is typed in the box
   as its words. One at a time, and the same limits as any line (1 a second, 10 a minute). If the line can't be saved, its two
   files are taken back out of Storage. */
function tchSendPic(file){if(!file)return;if(file.type&&!/^image\//.test(file.type)){pop("That is not a photo");return}
  if(!socOn()||typeof phOn!=="function"||!phOn()){pop("Photos can't be sent right now");return}
  if(!TCH.ready){pop(TCH.err==="permission-denied"?"Chat is not switched on yet":"Chat is still loading");return}
  if(TCH.picBusy){pop("One photo at a time");return}
  var now=tchNow(),r=TCH.room;TCH.sent=TCH.sent.filter(function(t){return now-t<60000});
  if(TCH.sent.length&&now-TCH.sent[TCH.sent.length-1]<1000){pop("Slow down a little");return}
  if(TCH.sent.length>=10){pop("That's 10 messages this minute. Give it a few seconds.");return}
  var inp=document.getElementById("tchin"),x=tchClean(inp?inp.value:TCH.draft),h=PH.host,ms=Date.now(),sp="photos/"+MYUID+"/chat_"+ms,up=[];
  TCH.picBusy=1;tchPicBtn();pop("Sending the photo");
  phImages(file,"",!!h.local).then(function(im){
    return h.put(sp+".jpg",im.full).then(function(fu){up.push(sp+".jpg");return h.put(sp+"_t.jpg",im.thumb).then(function(th){up.push(sp+"_t.jpg");return {f:fu,th:th,sp:sp,w:im.w,h:im.h}})})})
  .then(function(p){TCH.sent.push(tchNow());if(x){TCH.draft="";var i2=document.getElementById("tchin");if(i2&&tchClean(i2.value)===x)i2.value="";tchCount()}TCH.stick=1;
    return tchWrite(function(me){var a=me.msgs[r]||(me.msgs[r]=[]),last=a.length?a[a.length-1].t:0;a.push({x:x,t:Math.max(tchNow(),last+1),p:p});if(a.length>TCHKEEP)a.splice(0,a.length-TCHKEEP)})
      .catch(function(er){if(x&&!TCH.draft){TCH.draft=x;var i3=document.getElementById("tchin");if(i3&&!i3.value)i3.value=x;tchCount()}throw er})})
  .then(function(){TCH.picBusy=0;tchPicBtn()},function(er){TCH.picBusy=0;tchPicBtn();up.forEach(function(f){try{h.del(f).catch(function(){})}catch(e){}});
    pop(er&&er.message==="image"?"That photo could not be read. Try another one.":"Could not send the photo: "+((er&&(er.code||er.name))||"error"))})}
function tchPicBtn(){var b=document.getElementById("tchpicb");if(b){b.classList.toggle("busy",!!TCH.picBusy);b.setAttribute("aria-busy",TCH.picBusy?"true":"false")}}
/* a picture full size, over the chat */
function tchPicOpen(id,r,t){var m=tchRoomMsgs(r).filter(function(q){return q.id===id&&q.t===t&&q.p})[0];if(!m)return;
  var nm=id===MYUID?"You":m.name,mm=modal('<div class="card box2 tch-pv"><div class="tch-h"><b>'+esc(nm)+'</b><small>'+esc(tchTime(m.t))+'</small></div>'
    +'<div class="tch-pvimg" style="background-image:url(\''+esc(m.p.th)+'\')"><img src="'+esc(m.p.f)+'" alt="Photo from '+esc(nm)+'"></div>'+(m.x?'<p class="tch-pvx">'+esc(m.x)+'</p>':'')+'</div>');
  mm.classList.add("tch-pvm")}
/* presence */
function tchHere(ch){if(!socOn())return;try{db.doc("chatnow/"+MYUID).set({name:tchName((S.char&&S.char.name)||""),ch:ch,t:tchNow()}).then(function(){TCH.nowErr=""},function(er){TCH.nowErr=(er&&er.code)||"error"})}catch(e){}}
function tchJoin(){if(TCH.joined===TCH.room)return;TCH.joined=TCH.room;tchHere(TCH.room);clearInterval(TCH.beatT);
  TCH.beatT=setInterval(function(){if(!document.hidden&&TCH.joined)tchHere(TCH.joined)},TCHBEAT);tchNowStart();tchPaintRooms()}
function tchLeave(){if(!TCH.joined)return;TCH.joined=0;clearInterval(TCH.beatT);TCH.beatT=0;tchHere(0);tchNowStop()}
/* in the room only while the Chat tab is on screen */
function tchSync(){if(htabShown("chat")&&!document.hidden&&socOn()){if(!TCH.on)tchStart(1);tchJoin()}else tchLeave()}
document.addEventListener("visibilitychange",function(){try{tchSync();tchUpdate()}catch(e){}});
window.addEventListener("pagehide",function(){if(TCH.joined){TCH.joined=0;tchHere(0)}});
function tchNowStart(){if(TCH.nowUnsub||!socOn())return;TCH.nowOk=0;
  try{var ref=db.collection("chatnow");
    if(ref&&typeof ref.onSnapshot==="function"){var u=ref.onSnapshot(function(q){tchNowSnap(q)},function(e){TCH.nowErr=(e&&e.code)||"error";TCH.nowUnsub=null;TCH.nowOk=0;tchPaintRooms()});if(typeof u==="function")TCH.nowUnsub=u}
    else{var go=function(){if(TCH.joined&&!document.hidden)db.collection("chatnow").limit(300).get().then(tchNowSnap,function(){})};go();TCH.nowUnsub=(function(id){return function(){clearInterval(id)}})(setInterval(go,15000))}}catch(e){TCH.nowErr=String((e&&e.code)||e)}
  clearInterval(TCH.nowTick);TCH.nowTick=setInterval(tchPaintRooms,15000)}
function tchNowStop(){if(TCH.nowUnsub){try{TCH.nowUnsub()}catch(e){}TCH.nowUnsub=null}clearInterval(TCH.nowTick);TCH.nowTick=0}
function tchNowSnap(q){var o={};
  ((q&&q.docs)||[]).slice(0,300).forEach(function(s){try{var id=String(s.id||""),d=s.data();if(!id||id.length>128||!d||typeof d!=="object")return;
    var ch=+d.ch,t=+d.t;if((ch===1||ch===2||ch===3)&&isFinite(t))o[id]={ch:ch,t:t,name:tchName(d.name)}}catch(e){}});
  TCH.now=o;TCH.nowOk=1;TCH.nowErr="";tchPaintRooms()}
/* who is in room r now: this player first if they are in it, then everyone seen in it within 2 minutes */
function tchWho(r){var now=tchNow(),out=[];
  Object.keys(TCH.now).forEach(function(id){if(id===MYUID)return;var p=TCH.now[id];if(p.ch===r&&now-p.t<TCHHERE&&p.t<now+60000)out.push(p.name)});
  out.sort();if(TCH.joined===r)out.unshift("You");return out}
/* drawing */
function tchHue(id){var h=0;for(var i=0;i<id.length;i++)h=(h*31+id.charCodeAt(i))>>>0;return h%360}
function tchTime(t){try{var d=new Date(t),n=new Date(tchNow()),hm=d.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});
  if(d.toDateString()===n.toDateString())return hm;if(tchNow()-t<6*864e5)return d.toLocaleDateString([],{weekday:"short"})+" "+hm;
  return d.toLocaleDateString([],{month:"short",day:"numeric"})}catch(e){return ""}}
/* W49 (Cal, 2026-11-10: "show a small circular picture of their character face to the left of the name. consecutive messages should
   not create another name and time stamp, but it should just be appended in a new line right under that same initial message. Like
   Discord messages."): lines from one player, each within TCHRUN of the first line of their run, share one header (face, name, time);
   each of your own lines keeps its ×. The face is cut from the look in the player's worlds/<id> doc, read through fshSafe (hostile);
   until that doc is in, a circle in their colour with their initial. A green dot on the face while they are online (W57). */
var TCHRUN=5*60000,TCHAV=34;
function tchWho1(id){if(id===MYUID)return {look:fshLook(lookOf())};
  var w=(SOC.worlds||[]).filter(function(x){return x&&x.id===id})[0];if(!w)return null;try{return fshSafe(w)}catch(e){return null}}
function tchAv(m,w){var ini=Array.from(m.name||"?")[0]||"?";
  return '<span class="tch-av" aria-hidden="true">'+(w&&w.look?nbAv(w.look,TCHAV):'<span class="tch-ini">'+esc(ini.toUpperCase())+'</span>')
    +(m.id!==MYUID&&w&&plOnline(w)?'<i class="tch-on"></i>':'')+'</span>'}
function tchLine(m,r){var me=m.id===MYUID,p=m.p,pic="";
  if(p){var w=p.w&&p.h?Math.round(Math.min(200,160*p.w/p.h)):160;pic='<button type="button" class="tch-img" data-act="tchpic" data-u="'+esc(m.id)+'" data-r="'+r+'" data-t="'+m.t+'" style="width:'+w+'px'+(p.w&&p.h?';aspect-ratio:'+p.w+'/'+p.h:'')+'" aria-label="Open the photo from '+esc(me?"you":m.name)+'"><img src="'+esc(p.th)+'" alt="" loading="lazy" decoding="async"></button>'}
  return '<p title="'+esc(tchTime(m.t))+'"'+(p?' class="tch-pl"':'')+'>'+pic+(m.x?esc(m.x):'')+(me?'<button type="button" class="tch-x" data-act="tchdel" data-r="'+r+'" data-t="'+m.t+'" aria-label="Delete your message">&times;</button>':'')+'</p>'}
function tchLogHtml(r){var ms=tchRoomMsgs(r),runs=[],h="";
  if(!ms.length)return '<p class="note tch-empty">No messages in '+esc(tchRoomName(r))+' yet. Say hi.</p>';
  ms.forEach(function(m){var g=runs[runs.length-1];if(g&&g.id===m.id&&m.t-g.t<TCHRUN)g.ms.push(m);else runs.push({id:m.id,t:m.t,ms:[m]})});
  runs.forEach(function(g){var m=g.ms[0],me=m.id===MYUID,w=tchWho1(m.id);
    h+='<div class="tch-g'+(me?' me':'')+'" style="--h:'+tchHue(m.id)+'">'+tchAv(m,w)
      +'<div class="tch-b"><div class="tch-h"><b>'+esc(me?"You":m.name)+'</b><small>'+esc(tchTime(m.t))+'</small></div>'
      +g.ms.map(function(x){return tchLine(x,r)}).join("")+'</div></div>'});
  return h}
function tchLogBody(){if(TCH.err==="permission-denied")return '<p class="note tch-empty">Chat is not switched on yet. It needs a database update from Cal.</p>';
  if(!TCH.ready)return '<p class="note tch-empty">'+(TCH.err?'Chat can\'t connect right now ('+esc(TCH.err)+').':'Opening the room…')+'</p>';
  return tchLogHtml(TCH.room)}
function tchRoomsHtml(){return TCHROOMS.map(function(r){var on=r[0]===TCH.room,n=TCH.nowOk?tchWho(r[0]).length:-1,un=!on&&tchUnread(r[0]);
  return '<button type="button" role="tab" aria-selected="'+on+'" class="tch-r'+(on?' on':'')+'" data-act="tchroom" data-r="'+r[0]+'" aria-label="'+esc(r[1])+(n>=0?', '+n+' here':'')+(un?', new messages':'')+'">'
    +'<span>'+esc(r[1])+'</span>'+(n>=0?'<small>'+n+'</small>':'')+(un?'<i class="tch-rdot"></i>':'')+'</button>'}).join("")}
function tchWhoHtml(){if(!TCH.nowOk)return TCH.joined?'Checking who is here…':'';var w=tchWho(TCH.room);
  return w.length?'Here now: '+w.slice(0,6).map(esc).join(", ")+(w.length>6?' +'+(w.length-6):''):'Nobody here right now.'}
/* the photo button left of the box, only where pictures can be stored (the feed's host); until the host is known, none, and the tab
   is drawn again once it is */
function tchPicIn(){if(typeof phOn!=="function")return "";
  if(!phOn()){if(typeof phHostGet==="function")phHostGet().then(function(h){if(h&&htabShown("chat")&&!document.getElementById("tchpicb"))render()});return ""}
  return '<label class="btn ghost tch-pic'+(TCH.picBusy?' busy':'')+'" id="tchpicb" for="tchfile" role="button" aria-label="Send a photo" aria-busy="'+(TCH.picBusy?'true':'false')+'">'
    +'<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2.2l1.4-2h5.8l1.4 2h2.2A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="12" cy="13" r="3.3" fill="none" stroke="currentColor" stroke-width="1.7"/></svg></label>'
    +'<input class="vh" type="file" id="tchfile" accept="image/*" tabindex="-1" aria-hidden="true">'}
function tchHtml(){
  if(!socOn())return '<section class="card panel"><h3 class="label">Chat</h3><p class="note">Chat needs the cloud save. Open the game signed in.</p></section>';
  var r=TCH.room,nm=esc(tchRoomName(r));TCH.logH=tchLogBody();TCH.roomsH=tchRoomsHtml();TCH.whoH=tchWhoHtml();
  return '<section class="card panel tch" id="tchbox"><div class="tch-rooms" id="tchrooms" role="tablist" aria-label="Chat rooms">'+TCH.roomsH+'</div>'
    +'<div class="tch-who"><small id="tchwho">'+TCH.whoH+'</small></div>'
    +'<div class="tch-logw"><div class="tch-log" id="tchlog" role="log" aria-live="polite" aria-label="'+nm+' messages">'+TCH.logH+'</div>'
    +'<button type="button" class="tch-new" id="tchnew" data-act="tchdown" hidden>New messages ↓</button></div>'
    +'<div class="tch-in">'+tchPicIn()+'<input id="tchin" type="text" maxlength="'+TCHMAX+'" autocomplete="off" autocapitalize="sentences" enterkeyhint="send" aria-label="Message '+nm+'" placeholder="Message '+nm+'" value="'+esc(TCH.draft)+'"><button type="button" class="btn" data-act="tchsend">Send</button></div>'
    +'<div class="tch-foot"><small class="note">Everyone in town can read every room.</small><small id="tchcount" class="mono"></small></div></section>'}
/* after a full draw of the Chat tab: back to where the player was reading (or the bottom), focus and caret kept. Coming into
   the tab, the page scrolls the tab bar to the top (it sticks there) and the room fills the screen down to the input. */
function tchMounted(k){var lg=document.getElementById("tchlog"),fresh=!TCH.shown;TCH.shown=1;tchSize();
  if(lg){if(TCH.stick||k.top===undefined||k.bot)lg.scrollTop=lg.scrollHeight;else lg.scrollTop=k.top;TCH.stick=0}
  if(k.f){var i=document.getElementById("tchin");if(i){try{i.focus({preventScroll:true});i.setSelectionRange(k.s0,k.s1)}catch(e){}}}
  if(fresh)setTimeout(function(){var tb=document.querySelector(".htab");if(tb&&htabShown("chat"))window.scrollTo(0,Math.max(0,tb.getBoundingClientRect().top+window.scrollY-2));tchSize()},0);
  tchCount();if(!document.hidden)tchMarkSeen()}
/* the room's height: the screen below the stuck tab bar, minus the input, the note and the nav bar */
function tchSize(){var lg=document.getElementById("tchlog"),tb=document.querySelector(".htab"),inp=document.querySelector(".tch-in"),ft=document.querySelector(".tch-foot");if(!lg||!tb||!inp)return;
  var bar=document.querySelector(".nav .bar"),navH=bar&&!document.body.classList.contains("tch-typing")?Math.max(0,window.innerHeight-bar.getBoundingClientRect().top)+6:8,
    off=lg.getBoundingClientRect().top-tb.getBoundingClientRect().top,h=window.innerHeight-off-inp.offsetHeight-(ft?ft.offsetHeight:0)-40-navH;
  lg.style.height=Math.round(Math.max(200,Math.min(640,h)))+"px"}
window.addEventListener("resize",function(){if(htabShown("chat"))tchSize()});
/* live updates touch only the parts that changed, so typing, the keyboard and the scroll are never disturbed */
function tchPaintLog(){var el=document.getElementById("tchlog");if(!el)return;var h=tchLogBody();if(h===TCH.logH)return;
  var bot=el.scrollHeight-el.scrollTop-el.clientHeight<40;el.innerHTML=h;TCH.logH=h;
  if(bot||TCH.stick){el.scrollTop=el.scrollHeight;TCH.stick=0;tchNewPill(0)}else tchNewPill(1)}
function tchPaintRooms(){var el=document.getElementById("tchrooms");if(el){var h=tchRoomsHtml();if(h!==TCH.roomsH){TCH.roomsH=h;el.innerHTML=h}}
  var w=document.getElementById("tchwho");if(w){var t=tchWhoHtml();if(t!==TCH.whoH){TCH.whoH=t;w.innerHTML=t}}}
function tchNewPill(on){var b=document.getElementById("tchnew");if(b)b.hidden=!on}
function tchCount(){var c=document.getElementById("tchcount"),i=document.getElementById("tchin");if(!c||!i)return;var n=TCHMAX-i.value.length;c.textContent=n<=40?n+" left":""}
function tchUpdate(){if(htabShown("chat")){tchPaintLog();tchPaintRooms();if(!document.hidden)tchMarkSeen()}tchDot()}
/* the red dot: on the Hall button when a message came in while the player was elsewhere, on the Chat tab inside the Hall, and on
   each other room's button */
function tchDot(){var inChat=htabShown("chat")&&!document.hidden,any=false;
  TCHROOMS.forEach(function(r){if(inChat&&r[0]===TCH.room)return;if(tchUnread(r[0]))any=true});
  var nb=document.querySelector('.nav button[data-v="hall"]');
  if(nb){var d=nb.querySelector(".tch-ndot"),show=any&&view!=="hall";if(show&&!d){d=document.createElement("i");d.className="tch-ndot";d.setAttribute("aria-label","New chat messages");nb.appendChild(d)}else if(!show&&d)d.remove()}
  var td=document.querySelector(".htab .tch-dot");if(td)td.hidden=!(any&&!inChat)}
document.addEventListener("input",function(e){if(e.target&&e.target.id==="tchin"){TCH.draft=e.target.value;tchCount()}});
document.addEventListener("change",function(e){var t=e.target;if(!t||t.id!=="tchfile")return;var f=t.files&&t.files[0];t.value="";if(f)tchSendPic(f)});
document.addEventListener("keydown",function(e){if(e.target&&e.target.id==="tchin"&&e.key==="Enter"&&!e.shiftKey&&!e.isComposing){e.preventDefault();tchSend()}});
/* the nav bar steps aside while the keyboard is up */
document.addEventListener("focusin",function(e){if(e.target&&e.target.id==="tchin")document.body.classList.add("tch-typing")});
document.addEventListener("focusout",function(e){if(e.target&&e.target.id==="tchin")document.body.classList.remove("tch-typing")});
document.addEventListener("scroll",function(e){var el=e.target;if(el&&el.id==="tchlog"&&el.scrollHeight-el.scrollTop-el.clientHeight<40)tchNewPill(0)},true);
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act]");if(!b)return;var a=b.dataset.act;
  if(a==="tchsend"){tchSend();var i=document.getElementById("tchin");if(i)try{i.focus({preventScroll:true})}catch(er){}return}
  if(a==="tchroom"){var r=+b.dataset.r;if(r!==TCH.room&&(r===1||r===2||r===3)){TCH.room=r;TCH.stick=1;TCH.armed="";try{sessionStorage.setItem("qbChatRoom",String(r))}catch(er){}render()}return}
  if(a==="tchdown"){var lg=document.getElementById("tchlog");if(lg)lg.scrollTop=lg.scrollHeight;tchNewPill(0);return}
  if(a==="tchpic"){tchPicOpen(String(b.dataset.u||""),+b.dataset.r,+b.dataset.t);return}
  /* your own line: the first tap turns the × into "Delete", the second (within 4 seconds) takes it out of your chat doc */
  if(a==="tchdel"){var rr=+b.dataset.r,mt=+b.dataset.t,k=rr+"|"+mt;if(!(rr===1||rr===2||rr===3)||!(mt>0))return;
    if(TCH.armed!==k){TCH.armed=k;b.classList.add("on");b.textContent="Delete";
      setTimeout(function(){if(TCH.armed===k)TCH.armed="";if(b.isConnected){b.classList.remove("on");b.innerHTML="&times;"}},4000);return}
    TCH.armed="";
    tchWrite(function(me){me.msgs[rr]=(me.msgs[rr]||[]).filter(function(x){return x.t!==mt})}).then(function(){pop("Message deleted")},function(er){pop("Could not delete: "+((er&&er.code)||"error"))});return}});
/* the faces come from the neighbors' docs: when those arrive or change, the log is drawn again (only if it changed) */
var tchSocPaintBase=socPaint;
socPaint=function(){var r=tchSocPaintBase.apply(this,arguments);try{if(htabShown("chat"))tchPaintLog()}catch(e){}return r};
/* test hook, removed at release with window.__qb (31_release.js) */
window.__qbChat={state:function(){return TCH},parse:tchParse,img:tchImg,sendPic:tchSendPic,open:tchPicOpen,write:tchWrite,docLen:tchDocLen,
  put:function(id,doc){return db.doc("chat/"+id).set(doc)}};
