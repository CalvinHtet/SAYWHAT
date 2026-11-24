/* ---------- W55: friends visit your businesses (SPEC10 part 2) ----------
   Cal, 2026-11-10: "I like the idea of our characters all being a part of our towns. Make them sparse and not too often, but they
   could visit our place and establishments and leave a little tip for us. These messages should not be letters in our inbox, but could
   be a little one liner when we click inside the room that tells us who visited and what they did and then if they left a tip or just
   admired our place. In the room view, I would like our character names to show up underneath the character that is visiting. Keep it
   balanced though because I wouldn't want 8 people from the game in one room or have 10 people leaving a tip in the restaurant in one
   day." TASKS v0.92: "tips 100-400 by room, 2 a day, sparse".
   - Visitors are real players: other accounts from the worlds collection (SOC.worlds), in the outfit their doc shows now, chosen among
     those active in the last 3 days (their doc written in that time, or a played day in their pd list).
   - Rolled once a game day, the first time this player has a business and someone to visit it: 0 to 3 visits (ECON.pvis.w), each in a
     different business this player owns (a room whose ROOMT has coin), each by a different friend. So: at most 1 player-visitor in a
     room at a time, 3 a day across all rooms, 1 a day per room, a given friend once a day.
   - Each visit has an arrival time in the game day (9 am to 11 pm) and stays 45 to 120 minutes. While they are there they walk around
     the room with their name under them (the building view and the room window). A roll late in the day can give visits that already
     happened: the note shows, nobody is in the room.
   - At most 2 tips a day (ECON.pvis.tips), 100 x the room's price phase (ECON.phase: 100 in the Garden to 380 in the Nightclub), paid
     by the game when the visit happens, never from the friend's coins. The rest "admired" a piece the room has.
   - The note: one line at the top of that room's window, for today only. No letter, no toast.
   - The story friends' visits (29k_friends.js) are separate and stay as they are.
   Save: S.pvis = {d: the game day, v: [{u: their id, n: their name, t: room type, at, end: ms, tip: coins or 0, pc: a piece's id or "",
   paid: 0/1}]}. New and additive: an old save has none and rolls on its next day. */
ECON.pvis={w:[.4,.35,.18,.07],day:3,tips:2,tipP:.5,tip:100,tipMin:100,tipMax:400,from:4,to:18,stayMin:45,stayMax:120,active:3};
/* what someone does in each kind of business (VOICE.md: plain, no wink); the rest "stopped by the <room>" */
var PVDID={restaurant:"came in for dinner",boba:"stopped by for boba",dessert:"came in for dessert",skybar:"stopped in for a drink",
  rooftop:"came up for a drink on the roof",bar:"came up for a drink on the roof",sky:"stopped in for a drink",speakeasy:"stopped in for a drink",
  garden:"picked up fresh produce from the Garden",mall:"spent an hour at the Mall",theater:"caught a movie",auditorium:"caught a movie in the Auditorium",
  arcade:"played a few rounds in the Arcade",rhythm:"played a few songs in the Rhythm Room",vr:"tried the VR Arena",bowling:"bowled a few frames",
  karaoke:"sang a couple of songs",club:"danced at the Nightclub",spa:"booked a massage"};
function pvState(){var P=S.pvis;if(!P||typeof P!=="object"||Array.isArray(P))P=S.pvis={d:"",v:[]};if(!Array.isArray(P.v))P.v=[];return P}
function pvDayStart(){var a=today().split("-");return new Date(+a[0],+a[1]-1,+a[2],typeof DAYSTART==="number"?DAYSTART:5).getTime()}
/* the businesses this player has, by type, once each */
function pvRooms(){var seen={},o=[];(S.base&&S.base.slots||[]).forEach(function(r){if(r&&ROOMT[r.t]&&ROOMT[r.t].coin&&!seen[r.t]){seen[r.t]=1;o.push(r.t)}});return o}
/* other players active in the last ECON.pvis.active days, with a look the rig can draw (their docs are hostile: fshSafe/fshLook) */
function pvActive(w){var now=Date.now(),t=+(w&&w.t)||0,cut=ymdOfN(ymdN(today())-(ECON.pvis.active-1));
  if(t>0&&now-t<ECON.pvis.active*864e5&&t-now<864e5)return true;return Array.isArray(w&&w.pd)&&w.pd.some(function(d){return typeof d==="string"&&d>=cut})}
function pvFriends(){if(typeof SOC==="undefined"||!SOC.worlds)return [];var o=[],seen={};
  SOC.worlds.forEach(function(w){try{if(!w||typeof w.id!=="string"||w.id===MYUID||seen[w.id]||!pvActive(w))return;var s=fshSafe(w);if(!s.look)return;seen[w.id]=1;o.push({u:s.id,n:s.name})}catch(e){}});return o}
function pvShuffle(a,rnd){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(rnd()*(i+1)),x=a[i];a[i]=a[j];a[j]=x}return a}
function pvTip(t){var E=ECON.pvis;return Math.max(E.tipMin,Math.min(E.tipMax,Math.round(E.tip*econPhase(t)/10)*10))}
/* a piece the room has that a visitor can admire: no openers, walls, dogs or staff, nothing retired */
function pvPiece(t,rnd){var r=null;(S.base.slots||[]).forEach(function(x){if(!r&&x&&x.t===t)r=x});if(!r||!r.a)return "";
  var L=(ADDONS[t]||[]).filter(function(a){var e=a[3]||{};return r.a[a[0]]&&!e.opens&&!e.retired&&!/^(Expansion|Walls|Dogs|Staff|Crew)$/.test(e.g||"")&&!/^(Knock|Take|Adopt|Hire|Open|Expand|Build|Unlock|Add|Buy)\b/.test(a[1]||"")});
  return L.length?L[Math.floor(rnd()*L.length)][0]:""}
/* the day's visits, from the rooms and friends available now. Pure apart from rnd, so the limits can be tested (window.__qbVisit.roll) */
function pvRoll(rooms,friends,rnd,t0){var E=ECON.pvis,x=rnd(),n=0,acc=0;for(var k=0;k<E.w.length;k++){acc+=E.w[k];if(x<acc){n=k;break}n=k}
  n=Math.min(n,E.day,rooms.length,friends.length);var R=pvShuffle(rooms,rnd),F=pvShuffle(friends,rnd),v=[],tips=0;
  for(var i=0;i<n;i++){var at=t0+Math.round((E.from+rnd()*(E.to-E.from))*36e5),stay=Math.round((E.stayMin+rnd()*(E.stayMax-E.stayMin))*60000),
      tip=tips<E.tips&&rnd()<E.tipP?pvTip(R[i]):0;if(tip)tips++;
    v.push({u:F[i].u,n:F[i].n,t:R[i],at:at,end:at+stay,tip:tip,pc:"",paid:0})}
  v.sort(function(a,b){return a.at-b.at});return v}
function pvCheck(){if(!loaded||!S||!S.created||typeof socOn!=="function"||!socOn())return;var P=pvState(),d=today();
  if(P.d!==d){/* the sandbox has nobody else: the Town Square's stand-ins (29p_square.js) are the neighbors there too */
    if(typeof sqSandboxOn==="function"&&sqSandboxOn()&&typeof sqSeed==="function")try{sqSeed()}catch(e){}
    if(typeof SOC==="undefined"||!SOC.loaded)return;
    var rooms=pvRooms(),fr=pvFriends();if(!rooms.length||!fr.length)return;
    P.d=d;P.v=pvRoll(rooms,fr,Math.random,pvDayStart());P.v.forEach(function(v){if(!v.tip)v.pc=pvPiece(v.t,Math.random)});persist()}
  pvPay()}
/* a visit pays its tip when it happens (once, saved before anything is drawn) */
function pvPay(){var P=pvState();if(P.d!==today())return;var now=Date.now(),ch=0;
  P.v.forEach(function(v){if(v.paid||now<v.at)return;v.paid=1;ch=1;var c=Math.max(0,Math.min(ECON.pvis.tipMax,Math.floor(+v.tip||0)));if(c){S.coins+=c;S.earnedC=(S.earnedC||0)+c}});
  if(ch)persist()}
function pvToday(){var P=pvState();return P.d===today()?P.v:[]}
/* the note for a room: "Sydney stopped by for boba and left a 120-coin tip." / "Marcus admired the Neon Sign." */
function pvLine(v){var did=PVDID[v.t]||("stopped by the "+((ROOMT[v.t]&&ROOMT[v.t].name)||"place")),nm=String(v.n||"A friend"),r=null;
  if(v.tip)return nm+" "+did+" and left a "+(+v.tip).toLocaleString()+"-coin tip.";
  (S.base.slots||[]).forEach(function(x){if(!r&&x&&x.t===v.t)r=x});
  if(v.pc&&r&&r.a&&r.a[v.pc])return nm+" admired the "+addonName(r,v.pc)+".";
  return nm+" "+did+"."}
function pvNoteHtml(t){var now=Date.now(),L=pvToday().filter(function(v){return v.t===t&&now>=v.at});
  return L.map(function(v){return '<p class="note pv-note">'+esc(pvLine(v))+'</p>'}).join("")}
/* who is in a room right now: the friend's current look from their doc, drawn by the rig like the story friends (npc), name under them */
function pvLook(L){var D=window.QBLoft&&QBLoft.data;if(!L||!L.rig||!D||!D.items)return null;var rig=Object.assign({},L.rig);
  if(rig.equipped&&typeof rig.equipped==="object"){var eq={};Object.keys(rig.equipped).forEach(function(s){var e=rig.equipped[s];if(e&&typeof e.art==="string"&&D.items[e.art])eq[s]=e});rig.equipped=eq}
  return {rig:rig,sex:L.sex==="f"?"f":"m",npc:1}}
var PVLOOK={};
function pvHere(){var now=Date.now(),o=[];pvToday().forEach(function(v){if(now<v.at||now>=v.end)return;
    var w=(typeof SOC!=="undefined"&&SOC.worlds||[]).filter(function(x){return x&&x.id===v.u})[0];if(!w)return;
    var k=JSON.stringify(w.look||null),c=PVLOOK[v.u];if(!c||c.k!==k){var s=null;try{s=fshLook(w.look)}catch(e){}c=PVLOOK[v.u]={k:k,L:s?pvLook(s):null}}if(!c.L)return;
    var i=-1;S.base.slots.forEach(function(r,j){if(i<0&&r&&r.t===v.t)i=j});if(i<0||!window.LFMETA||!LFMETA[i])return;
    o.push({id:"pfv:"+v.u,room:i,role:"visitor",look:c.L,visitor:1,fresh:now-v.at<90000,leaveAt:v.end,k:9,idle:1,wand:1,pvn:String(v.n||"").slice(0,24)})});
  return o}
var pvDesiredBase=lfDesired;
lfDesired=function(){var out=pvDesiredBase.apply(this,arguments);try{pvHere().forEach(function(v){out.push(v)})}catch(e){}return out};
/* a visiting player is a customer: they take a free customer seat or look around, never the staff's spots (the first headless run had
   one standing in the Restaurant's kitchen). Nobody serves them (service looks for role "guest"), and leaving is the usual visitor's. */
var pvNextBase=lfNext;
lfNext=function(a){if(!a||!a.pvn||a.leaving||(a.leaveAt&&Date.now()>a.leaveAt))return pvNextBase.apply(this,arguments);
  var C=lfC(a);if(!C||!C.st)return pvNextBase.apply(this,arguments);lfRelease(C,a);a.carry=0;a.tag=null;a.act=null;a.emo=null;
  var cand=lfFree(C,a,function(s){return !s.plot&&s.kind!=="door"&&s.kind!=="work"&&(s.cust||s.kind==="look"||s.kind==="wander")}),seats=cand.filter(function(o){return o.s.cust});
  if(seats.length&&a.last!=="seat"&&Math.random()<.65)cand=seats;
  var c2=cand.filter(function(o){return o.i!==a.last});if(c2.length)cand=c2;
  if(!cand.length)return pvNextBase.apply(this,arguments);
  var o=lfPick(cand);a.si=o.i;o.s.by=a.id;a.last=o.s.cust?"seat":o.i;a.speed=1;a.stretch=0;lfGo(a,o.s.x,o.s.y,o.s)};
/* Cal 2026-11-24: "put their username under their character in white text just like in Maplestory": the tag sits under the feet again
   (translate(0,3) and the pill drawn from y 0 down, so however much it is scaled up to stay readable it grows away from the feet). It is still drawn on top of the furniture, so a table
   in front no longer hides it, which was why it went above the head on 11-13. */
/* the name tag above their head (Cal, 2026-11-13: "I want their name to be shown above their head when they are walking around and
   roaming"; was under the feet), at the height ROOMS uses for the team and allies (26_world.js, -170 x LFSC). Drawn on top of the room's furniture (the last child of the room's .lfitems), not inside the character's
   own group, which the depth sort puts behind tables and chairs: there a tag under the feet was mostly hidden. It follows the
   character every frame (lfDraw) and goes with them (lfDrop, and a sweep for anything left over). */
function pvTagId(a){return "pvt-"+String(a.id).replace(/[^a-z0-9_-]/gi,"_")}
/* QA/LEAD 2026-11-11: the tag read about 5 px in the room window and 2 px in the building view. Its size is now set from how big one
   unit of the room drawing is on screen (getScreenCTM, so zooming in or out keeps it the same), for PVTAGPX px text; where that
   would make the tag bigger than PVTAGMAX units (the building view, zoomed out) it is hidden, since it could not be read there. */
/* QA 11-24: on a phone (390 wide) one unit of the room window is 0.31 px, so 11 px text needs 35 units and the cap of 28 hid every
   tag; the building view needs 69. 48 shows the name in the room window down to a 320 px phone and still hides it in the building view,
   where a readable tag would dwarf the 15 px characters. */
var PVTAGPX=11,PVTAGMAX=48;
function pvTagDraw(a){var g=document.getElementById("lfa-"+String(a.id).replace(/[^a-z0-9_-]/gi,"_"));if(!g||!g.parentNode)return;
  var host=g.closest(".lfitems")||g.parentNode,t=document.getElementById(pvTagId(a));
  /* QA 11-24: a 24-letter name covered half the Garden window on a phone: the tag shows 14 letters at most */
  if(!t){var pvn=a.pvn.length>14?a.pvn.slice(0,13)+"\u2026":a.pvn,nm=esc(pvn),w=Math.max(30,Math.round(pvn.length*5.4+14)),tmp=document.createElementNS("http://www.w3.org/2000/svg","g");
    tmp.innerHTML='<g class="pv-tag" id="'+pvTagId(a)+'" data-a="'+g.id+'" style="pointer-events:none"><g transform="translate(0,3)"><g class="pv-tag-s"><rect x="'+(-w/2)+'" y="0" width="'+w+'" height="12" rx="6" fill="rgba(10,10,20,.8)" stroke="rgba(255,255,255,.4)" stroke-width=".8"/><text x="0" y="8.6" font-size="8" font-weight="700" fill="#fff" text-anchor="middle" font-family="sans-serif">'+nm+'</text></g></g></g>';
    t=tmp.firstChild}
  if(t.parentNode!==host||host.lastChild!==t)host.appendChild(t);
  var tf=g.getAttribute("transform")||"";if(t._tf!==tf){t._tf=tf;t.setAttribute("transform",tf)}
  /* the drawn size: 8-unit text at k screen px per unit; scale the pill so the text is PVTAGPX px, never below its old size */
  var m=null;try{m=t.getScreenCTM()}catch(e){}var k=m?Math.sqrt(m.a*m.a+m.b*m.b):0,f=k>0?Math.max(1,PVTAGPX/(8*k)):1,hide=k>0&&8*f>PVTAGMAX;
  if(!hide&&(!t._f||Math.abs(f-t._f)/f>.05)){t._f=f;var s=t.querySelector(".pv-tag-s");if(s)s.setAttribute("transform","scale("+f.toFixed(3)+")")}
  var op=hide?0:g.parentNode===host?(a.alpha==null?1:a.alpha):0;if(t._op!==op){t._op=op;t.style.opacity=op}}
var pvDrawBase=lfDraw;
lfDraw=function(a){var r=pvDrawBase.apply(this,arguments);if(a&&a.pvn)try{pvTagDraw(a)}catch(e){}return r};
var pvDropBase=lfDrop;
lfDrop=function(id){var r=pvDropBase.apply(this,arguments);try{var t=document.getElementById(pvTagId({id:id}));if(t)t.remove()}catch(e){}return r};
setInterval(function(){try{[].forEach.call(document.querySelectorAll(".pv-tag"),function(t){if(!document.getElementById(t.dataset.a))t.remove()})}catch(e){}},3000);
/* the room window: today's note at the top */
var pvRoomModalBase=roomModal;
roomModal=function(i){var r=pvRoomModalBase.apply(this,arguments);try{pvCheck();var R=bslot(i),h=R?pvNoteHtml(R.t):"",sc=h&&document.querySelector(".rmodal .rm-scroll");
    if(sc&&!sc.querySelector(".pv-note")){var d=document.createElement("div");d.innerHTML=h;while(d.lastChild)sc.insertBefore(d.lastChild,sc.firstChild)}}catch(e){}return r};
if(window.__qb)window.__qb.roomModal=roomModal;
setInterval(function(){try{pvCheck()}catch(e){}},20000);setTimeout(function(){try{pvCheck()}catch(e){}},9000);
/* test hook, removed at release with window.__qb (31_release.js) */
window.__qbVisit={state:pvState,check:pvCheck,active:pvActive,rooms:pvRooms,friends:pvFriends,here:pvHere,line:pvLine,note:pvNoteHtml,tip:pvTip,
  roll:function(rooms,friends,seed){var s=seed||1;var rnd=function(){s=(s*16807)%2147483647;return (s-1)/2147483646};return pvRoll(rooms,friends,rnd,pvDayStart())},
  /* a visit now (tests and Cal's review): the room type, a friend's id (else the first active one), tip coins or 0 */
  force:function(t,u,tip,mins){var f=pvFriends().filter(function(x){return !u||x.u===u})[0];if(!f||pvRooms().indexOf(t)<0)return null;var P=pvState(),now=Date.now();
    if(P.d!==today()){P.d=today();P.v=[]}P.v=P.v.filter(function(v){return v.t!==t&&v.u!==f.u});
    var v={u:f.u,n:f.n,t:t,at:now,end:now+(mins||60)*60000,tip:tip||0,pc:tip?"":pvPiece(t,Math.random),paid:0};P.v.push(v);persist();pvPay();try{if(typeof lfSync==="function")lfSync()}catch(e){}return v}};
