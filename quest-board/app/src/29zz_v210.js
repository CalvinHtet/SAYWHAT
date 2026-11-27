/* ---------- Cal 2026-11-26: Dungeon Crawls, its own tab, with your team's lounge ----------
   Cal: "Make dungeon crawls its own tab on the bottom right. Add relics and team members found on expeditions here. Create sprite
   characters for them and they hang out in a lounge room in this tab. I want to see them move around and interact with each other as more
   and more people join your team ... Some may be sitting at the bar and drinking. They may be talking to one another. One may be reading
   the book, etc. when sending someone on an expedition, i want there to be a little running icon of that character next to the mission i
   sent them on. Right now, i am able to go on these missions myself. I want the missions to only be available once the first character
   joins your team. Remove the dungeon crawls from the main board. Make dungeon crawls available at level 7. Level 7 will be when the first
   character joins your team. Make up a little story for them and include this info in the lvl 7 level up splash screen".
   - Crawls is a tab of its own at the right end of the bottom bar, from level 7 (it needed the Hero's Lair before). The Board's Crawls
     tile is gone; the tab's tour points at the tab.
   - Level 7: Sable joins your team (29c_team.js). The level-up window tells her story and that the Crawls tab is open. A save already past
     level 7 without her gets her at once, with the same story in a window of its own. She no longer turns up on the first crawl.
   - A crawl is always someone's: tapping Crawl asks who goes (anyone on the team who is not already out; with one free, they just go).
     The running crawl shows that teammate running beside it, and they are back in the lounge when it is claimed.
   - The team: everyone who has joined (Sable, Mara, Rafe, Nova, Theo as the story brings them) and everyone rescued on crawls (Pip, Kit,
     Bram, Juno, Neo, Seraphine) hangs out in the lounge at the top of the tab: they walk between the bar (sitting, a drink in hand), the
     couch, the reading chair (with a book), the card table, the map wall, and the open floor, where two of them stop and talk. Whoever is
     out on a crawl is missing from the room. The room is ROOMS's painting (ui_lounge.webp) once it exists; until then a plain stand-in.
   - Under it: the crawls, then Your team (who they are and what each gives) and Relics found (the Regalia and the Amulet, piece by piece). */
var V210LV=7;
/* ---- the team: story teammates and rescued allies ---- */
function v210Team(){var out=[];try{(typeof teamList==="function"?teamList():[]).forEach(function(id){out.push("t:"+id)})}catch(e){}
  try{var D=dngInit();DNPC.forEach(function(n){if(D.npcs[n.id]&&ALLOOK[n.id])out.push("a:"+n.id)})}catch(e){}return out}
function v210Name(k){var p=k.split(":"),id=p[1];try{if(p[0]==="t")return TEAM[id].name.split(" ")[0];var L=ALLOOK[id];return L?L.n:id}catch(e){return id}}
function v210Col(k){var p=k.split(":");try{return p[0]==="t"?(TEAM[p[1]].ac||"#ffd27a"):(ALLOOK[p[1]].c||"#ffd27a")}catch(e){return "#ffd27a"}}
var V210LK={};
function v210Look(k){if(V210LK[k])return V210LK[k];var p=k.split(":"),id=p[1],L=null;
  try{if(p[0]==="t"){var T=TEAM[id].look||{},eq=[],D=QBLoft.data,sig=TMTOP[id]&&D.items[TMTOP[id]]?TMTOP[id]:null;Object.keys(T.equipped||{}).forEach(function(s){var e=T.equipped[s];if(e&&e.art&&!(sig&&s==="top"))eq.push(e.art)});if(sig)eq.push(sig);
      L=rsNpc(Object.assign({},RSK,{body:T.body||"m",hairStyle:T.hairStyle||"h1",hairColor:T.hairColor||"brown",eq:eq}))}
    else L=rsNpc(ALLOOK[id].spec)}catch(e){L=null}
  if(L)V210LK[k]=L;return L}
function v210Out(){var o={};try{dngInit().runs.forEach(function(r){if(r.who)o[r.who]=1})}catch(e){}return o}
function v210Free(){var o=v210Out();return v210Team().filter(function(k){return !o[k]})}
/* ---- the gate, the bottom bar, the Board ---- */
try{AREAS.forEach(function(a){if(a[0]==="away")a[2]=V210LV});delete NAVHIDE.away}catch(e){}
var v210Gate=areaGate;areaGate=function(id){if(id==="away"){var ok=effLvl()>=V210LV&&v210Team().length>0;
    /* open means revealed too (29h_unlocks.js reveals one area a day below level 10): the tab and a tap on it always agree */
    if(ok&&loaded&&S&&S.created)try{var o=areaOn();if(!o.away){o.away=1;persist()}}catch(e){}return !ok}return v210Gate.apply(this,arguments)};
var v210Nav=navHtml;navHtml=function(){var h=v210Nav.apply(this,arguments);
  try{var m=/<button[^>]*data-v="away"[\s\S]*?<\/button>/.exec(h);if(m){h=h.replace(m[0],"");var i=h.lastIndexOf("</div></nav>");if(i>=0)h=h.slice(0,i)+m[0]+h.slice(i)}}catch(e){}return h};
try{for(var i=ZXHUB.length-1;i>=0;i--)if(ZXHUB[i][0]==="away")ZXHUB.splice(i,1)}catch(e){}
try{TOURS.forEach(function(t){if(t.id!=="away")return;t.ready=function(){return view==="board"&&!!tourVis('.nav button[data-v="away"]')};
    t.steps=[{sel:'.nav button[data-v="away"]',t:"New: Dungeon Crawls",x:"Your team's lounge and their expeditions. Tap here, then send someone into a dungeon.",tap:1}]})}catch(e){}
/* ---- level 7: Sable joins ---- */
try{TEAM.sable.how="Maps the tunnels under the city. Heard about your streak and asked to join when you reached level 7."}catch(e){}
var V210STORY="Sable joined your team. She has mapped the tunnels under the city for years, and word of your streak reached her down there. She knocked on your door with a lantern and a hand-drawn map: “I know a way into the Mossy Cellar. Want to see what’s down there?”";
function v210Join(){try{if(effLvl()>=V210LV&&typeof teamHas==="function"&&!teamHas("sable")&&TEAM.sable){styState().team.sable=1;persist();return true}}catch(e){}return false}
var v210Un=v79Unlocks;v79Unlocks=function(from,lv){var out=v210Un.apply(this,arguments);
  try{if(from<V210LV&&lv>=V210LV){out.unshift("Dungeon Crawls is open: a new tab, bottom right");out.unshift(V210STORY)}}catch(e){}return out};
var v210Lv=levelUp;levelUp=function(lv,extra,from){try{if(lv>=V210LV&&v210Join()){var o=v204St();o.sable7=1;persist()}}catch(e){}return v210Lv.apply(this,arguments)};
/* an older save already past level 7: Sable now, and her story once (the unlock windows, 29zz_v204.js) */
try{V204.unshift({id:"sable7",test:function(){v210Join();return effLvl()>=V210LV&&typeof teamHas==="function"&&teamHas("sable")},t:"Sable joined your team",x:V210STORY+" Send her on Dungeon Crawls from the new tab at the bottom right.",go:"Open Crawls",
  act:function(){try{closeModals()}catch(e){}view="away";render();window.scrollTo(0,0)}})}catch(e){}
setInterval(function(){try{if(loaded&&S&&S.created)v210Join()}catch(e){}},5000);
/* ---- who goes ---- */
var V210WHO=null;
var v210Start=dngStart;dngStart=function(id){var free=v210Free();
  if(!free.length){pop(v210Team().length?"Everyone is out on a crawl. Wait for someone to come back.":"Crawls open when someone joins your team.");return}
  var who=V210WHO&&free.indexOf(V210WHO)>=0?V210WHO:(free.length===1?free[0]:null);V210WHO=null;
  if(!who){v210Pick(id,free);return}
  var D=dngInit(),n0=D.runs.length;v210Start.apply(this,arguments);if(D.runs.length>n0){D.runs[D.runs.length-1].who=who;persist();render();pop(v210Name(who)+" heads into the dungeon.")}};
function v210Pick(id,free){try{closeModals()}catch(e){}var d=DNG.filter(function(q){return q.id===id})[0];
  modal('<div class="card box2 v210pick"><span class="label">Who goes?</span><h2 style="font-size:24px">'+esc(d?d.name:"The dungeon")+'</h2><div class="v210pk">'
    +free.map(function(k){var L=v210Look(k);return '<button type="button" class="v210who" data-v210go="'+esc(id)+'" data-who="'+esc(k)+'" style="--c:'+v210Col(k)+'">'+(L?calImg(L,"still",72,""):'')+'<b>'+esc(v210Name(k))+'</b></button>'}).join("")
    +'</div><div class="btns"><button class="btn ghost" data-act="mclose">Cancel</button></div></div>')}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-v210go]");if(!b)return;e.preventDefault();e.stopPropagation();V210WHO=b.getAttribute("data-who");try{closeModals()}catch(x){}dngStart(b.getAttribute("data-v210go"))},true);
/* ---- the screen ---- */
function v210Relics(){try{var t=dgState(),rows=Object.keys(TSETS).map(function(k){var T=TSETS[k],got=T.pieces.filter(function(p){return t[k]&&t[k][p.id]});
      return '<div class="v210rs"><b>'+esc(T.name)+'</b> <small class="note">'+got.length+' of '+T.pieces.length+'</small><div class="v210rp">'+T.pieces.map(function(p){var h=t[k]&&t[k][p.id];return '<span class="chip'+(h?' on':'')+'">'+(h?esc(p.name):'? ? ?')+'</span>'}).join("")+'</div></div>'}).join("");
    return '<section class="card panel"><h3 class="label">Relics found</h3><p class="note">Pieces your team brought home from the dungeons.</p>'+rows+'</section>'}catch(e){return ""}}
var v210Html=dngHtml;dngHtml=function(){var h=v210Html.apply(this,arguments);
  try{var D=dngInit(),k=0;
    /* the running teammate beside each crawl */
    h=h.replace(/<div class="dng run"><b>/g,function(m){var r=D.runs[k++],who=r&&r.who,L=who?v210Look(who):null;return who?'<div class="dng run v210run"><span class="v210rn" data-who="'+esc(who)+'" title="'+esc(v210Name(who))+'">'+(L?'<img class="v210rimg" alt="" data-rk="'+esc(who)+'"'+(r&&Date.now()>=r.end?' data-done="1"':'')+'>':'')+'</span><b>':m});
    /* the team's own window replaces the old grid at the top; relics go under the rescued allies */
    var team=typeof teamHtml==="function"?teamHtml():"";if(team&&h.indexOf(team)===0)h=h.slice(team.length);
    h=v210LoungeHtml()+h+(team||"")+v210Relics()}catch(e){}
  return h};
/* ---- the lounge ---- */
/* spots, in % of the room (ROOMS's brief): act sit (bar, couch, card table, reading chair), talk (stand facing a partner), look (the map
   wall, back turned), idle (wander) */
/* ROOMS's painting (ui_lounge.webp, measured 11-26): x,y is where the feet go, fy the floor line that sets the size (seated people sit
   above their floor) */
var V210SP=[
  {x:18.5,y:57,fy:60,a:"bar"},{x:26,y:57,fy:60,a:"bar"},{x:34.5,y:57,fy:60,a:"bar"},
  {x:52.5,y:53,fy:55,a:"couch"},{x:64,y:50,fy:55,a:"couch"}/* QA v1.79 LOW: back on the couch, not on the coffee table */,{x:75.5,y:53,fy:55,a:"couch"},
  {x:14,y:66,fy:70,a:"read",fx:1},
  {x:43,y:65,fy:67,a:"cards",fx:1},{x:58,y:65,fy:67,a:"cards",fx:-1},
  {x:38,y:80,a:"talk",fx:1,pair:10},{x:48,y:80,a:"talk",fx:-1,pair:9},{x:56,y:91,a:"talk",fx:1,pair:12},{x:66,y:91,a:"talk",fx:-1,pair:11},
  {x:82,y:60,a:"look"},{x:91,y:70,a:"look"},{x:30,y:74,a:"idle"},{x:70,y:76,a:"idle"},{x:24,y:92,a:"idle"},{x:84,y:88,a:"idle"}];
var V210A={},V210T=0,V210LAST=0;
function v210LoungeHtml(){var u=window.QBART&&QBART["ui_lounge.webp"],ks=v210Free();
  return '<section class="card v210lounge" aria-label="Your team\'s lounge"><div class="v210room'+(u?'':' v210plain')+'"'+(u?' style="background-image:url(&quot;'+esc(u)+'&quot;)"':'')+'>'
    +(u?'':'<span class="v210bar"></span><span class="v210couch"></span><span class="v210map"></span><span class="v210chair"></span><span class="v210table"></span>')
    +'<div class="v210ppl"></div><div class="v210tags"></div>'+(ks.length?'':'<p class="v210empty">'+(v210Team().length?"Everyone is out on a crawl.":"Your team will hang out here.")+'</p>')+'</div>'
    +'<div class="v210cap"><b>Your team</b><small class="note">'+v210Team().length+' member'+(v210Team().length===1?'':'s')+(Object.keys(v210Out()).length?' &middot; '+Object.keys(v210Out()).length+' out on a crawl':'')+'</small></div></section>'}
function v210Spot(a,ks){var taken={};Object.keys(V210A).forEach(function(k){var b=V210A[k];if(b!==a&&b.si!=null)taken[b.si]=1});
  var pick=[];V210SP.forEach(function(s,i){if(taken[i]||i===a.si)return;var w=s.a==="talk"?(V210SP[s.pair]&&taken[s.pair]?6:2):s.a==="idle"?1:3;for(var j=0;j<w;j++)pick.push(i)});
  return pick.length?pick[Math.floor(Math.random()*pick.length)]:a.si}
function v210Tick(){var room=document.querySelector(".v210room");if(!room||!room.isConnected){V210T&&clearInterval(V210T);V210T=0;return}if(document.hidden)return;
  var ppl=room.querySelector(".v210ppl"),W=room.clientWidth,H=room.clientHeight;if(!W||!H||typeof QBLoft==="undefined"||!QBLoft.frameOrNear)return;
  var now=performance.now(),dt=Math.min(.25,(now-(V210LAST||now))/1000);V210LAST=now;var ks=v210Free(),live={};ks.forEach(function(k){live[k]=1});
  Object.keys(V210A).forEach(function(k){if(!live[k]){var e=V210A[k].el,t=V210A[k].tag;if(e&&e.parentNode)e.parentNode.removeChild(e);if(t&&t.parentNode)t.parentNode.removeChild(t);delete V210A[k]}});
  ks.forEach(function(k,n){var a=V210A[k];if(!a){var L=v210Look(k);if(!L||!L.rig)return;var s0=V210SP[(n*5)%V210SP.length];a=V210A[k]={k:k,ch:L.rig,x:s0.x+(Math.random()*6-3),y:Math.max(62,s0.y),mode:"idle",until:now+500+n*400,si:null,face:1,ph:Math.random()*4};
      a.el=document.createElement("div");a.el.className="v210p";a.el.innerHTML='<img alt=""><i class="v210prop"></i><em class="v210say"></em>';ppl.appendChild(a.el);
      /* QA v1.79 LOW 1: the name tags are a layer above every figure, so one in front never cuts a name behind it */
      a.tag=document.createElement("small");a.tag.className="v210tag";a.tag.style.setProperty("--c",v210Col(k));a.tag.textContent=v210Name(k)}
    if(a.el.parentNode!==ppl)ppl.appendChild(a.el);var tg=room.querySelector(".v210tags");if(tg&&a.tag.parentNode!==tg)tg.appendChild(a.tag);
    /* the brain */
    if(a.mode!=="walk"&&now>a.until){var si=v210Spot(a,ks);if(si!=null&&si!==a.si){a.si=si;var s=V210SP[si];a.tx=s.x;a.ty=s.y;a.mode="walk"}else{a.until=now+3000}}
    if(a.mode==="walk"){var dx=a.tx-a.x,dy=(a.ty-a.y)*(H/W),d=Math.sqrt(dx*dx+dy*dy),sp=9*dt;a.ph+=dt*4.6;
      if(d<=sp){a.x=a.tx;a.y=a.ty;var s2=V210SP[a.si];a.mode="do";a.act=s2.a;a.until=now+(s2.a==="talk"?9000:s2.a==="idle"?4000:s2.a==="look"?6000:12000)+Math.random()*9000;a.face=s2.fx||(a.x<50?1:-1);a.t0=now}
      else{a.x+=dx/d*sp;a.y+=dy/d*sp*(W/H);a.face=dx>=0?1:-1;a.back=dy<-Math.abs(dx)*.6}}
    /* the frame */
    var clip,f;if(a.mode==="walk"){clip=a.back?"walkBack":"walk";f=QBLoft.walkFrame(a.ph,clip)}
    else if(/^(bar|couch|read|cards)$/.test(a.act)){clip="sit";f=QBLoft.clipFrame("sit",now)}
    else if(a.act==="look"){clip="back";f=QBLoft.clipFrame("back",now)}
    else if(a.act==="talk"){var s3=V210SP[a.si],mate=null;Object.keys(V210A).forEach(function(q){var b=V210A[q];if(b!==a&&b.mode==="do"&&b.si===(s3&&s3.pair))mate=b});
      clip=mate?"chat":"idle";if(mate)a.face=mate.x>a.x?1:-1;f=QBLoft.clipFrame(clip,now)}
    else{var cyc=["idle","idle","wave","idle","laugh","idle","stretch"],c2=cyc[Math.floor(((a.t0||0)/1000+a.k.length)%cyc.length)];clip=QBLoft.clips&&QBLoft.clips[c2]?c2:"idle";f=QBLoft.clipFrame(clip,now)}
    /* a seated person holds one frame and a talker every 4th: a steady request is drawn at once, a frame that changes every tick never catches up (QBLoft renders the newest request first) */
    if(clip==="sit"||clip==="back")f=0;else if(clip==="chat")f-=f%4;else f-=f%2;var u=QBLoft.frameOrNear(a.ch,clip,f);
    /* depth: smaller at the back */
    var sp=a.mode==='do'&&a.si!=null?V210SP[a.si]:null,fl=sp&&sp.fy?sp.fy:a.y,hgt=H*Math.max(.12,.0068*(fl-35)),G=QBLoft.geometry(hgt),px=a.x/100*W,py=a.y/100*H,img=a.el.firstChild;
    if(u&&img.getAttribute("src")!==u)img.setAttribute("src",u);
    img.style.width=G.w.toFixed(1)+"px";img.style.height=G.h.toFixed(1)+"px";img.style.left=G.x.toFixed(1)+"px";img.style.top=G.y.toFixed(1)+"px";
    var sit=/^(bar|couch|read|cards)$/.test(a.act||"")&&a.mode==="do";
    a.el.style.transform="translate("+px.toFixed(1)+"px,"+py.toFixed(1)+"px)";a.el.style.zIndex=String(Math.round(a.y*10));
    img.style.transform=a.face<0?"scaleX(-1)":"";
    var pr=a.el.querySelector(".v210prop"),say=a.el.querySelector(".v210say");pr.className="v210prop"+(a.mode==="do"&&a.act==="bar"?" mug":a.mode==="do"&&a.act==="read"?" book":a.mode==="do"&&a.act==="cards"?" cards":"");
    /* QA v1.79 LOW 2: props sized to the figure */var pw=a.act==="read"?.17:a.act==="cards"?.08:.06,ph=a.act==="read"?.11:a.act==="cards"?.11:.08;pr.style.width=(hgt*pw).toFixed(1)+"px";pr.style.height=(hgt*ph).toFixed(1)+"px";pr.style.left=(-hgt*pw/2+(a.act==="bar"?hgt*.1*(a.face<0?-1:1):0)).toFixed(1)+"px";pr.style.top=(-hgt*.40).toFixed(1)+"px";
    a.tag.style.transform="translate("+px.toFixed(1)+"px,"+(py+3).toFixed(1)+"px) translateX(-50%)";say.className="v210say"+(clip==="chat"?" on":"");say.style.top=(-hgt*1.05).toFixed(1)+"px";
  });
  /* the running teammates beside the crawls */
  [].forEach.call(document.querySelectorAll(".v210rimg"),function(im){var k=im.getAttribute("data-rk"),L=v210Look(k);if(!L||!L.rig)return;/* Cal 11-26: back from the crawl, they wave */var wv=im.getAttribute("data-done")&&QBLoft.clips&&QBLoft.clips.wave,f=wv?QBLoft.clipFrame("wave",now):QBLoft.walkFrame(now/1000*5,"walk"),u=QBLoft.frameOrNear(L.rig,wv?"wave":"walk",wv?f:f-f%2);
    if(u&&im.getAttribute("src")!==u)im.setAttribute("src",u);if(!im.style.width){var G=QBLoft.geometry(40);im.style.width=G.w+"px";im.style.height=G.h+"px";im.style.marginLeft=G.x+"px";im.style.marginTop=G.y+"px"}})}
function v210Run(){if(typeof view==="undefined"||view!=="away"){if(V210T){clearInterval(V210T);V210T=0}return}if(!V210T){V210LAST=0;V210T=setInterval(v210Tick,80)}try{QBLoft.warm&&v210Free().forEach(function(k){var L=v210Look(k);if(L&&L.rig)QBLoft.warm(L.rig)})}catch(e){}}
/* a redraw rebuilds the room: the people are put back where they were, and the room runs only while the tab is on screen */
var v210R=render;render=function(){var r=v210R.apply(this,arguments);try{var ppl=document.querySelector(".v210room .v210ppl");if(ppl)Object.keys(V210A).forEach(function(k){var e=V210A[k].el;if(e&&e.parentNode!==ppl)ppl.appendChild(e)});v210Run()}catch(e){}return r};
htabCss("qb-v210-css",".v210lounge{padding:0;overflow:hidden}.v210room{position:relative;width:100%;aspect-ratio:4/3;background-size:cover;background-position:center;border-radius:14px 14px 0 0;overflow:hidden}"
  +".v210plain{background:linear-gradient(180deg,#3b2a3f 0,#2b1f33 50%,#5b3a2a 50.5%,#3e281d 100%)}"
  +".v210plain .v210bar{position:absolute;left:4%;top:47%;width:36%;height:12%;background:linear-gradient(#7a4a2c,#4a2b19);border-radius:6px 6px 2px 2px;box-shadow:0 -40px 0 -10px rgba(255,200,120,.08)}"
  +".v210plain .v210couch{position:absolute;left:60%;top:53%;width:31%;height:12%;background:linear-gradient(#5a3e7a,#3b2856);border-radius:12px 12px 6px 6px}"
  +".v210plain .v210map{position:absolute;left:45%;top:8%;width:22%;height:26%;background:#c9b48a;border:4px solid #5a3b22;border-radius:4px}"
  +".v210plain .v210chair{position:absolute;left:3%;top:76%;width:11%;height:12%;background:#6b2f2f;border-radius:10px}"
  +".v210plain .v210table{position:absolute;left:45%;top:67%;width:10%;height:7%;background:#2e5a3a;border-radius:50%}"
  +".v210ppl{position:absolute;inset:0}.v210p{position:absolute;left:0;top:0;width:0;height:0;will-change:transform}.v210p img{position:absolute;display:block;max-width:none;pointer-events:none;image-rendering:auto}"
  +".v210tags{position:absolute;inset:0;pointer-events:none;z-index:2000}.v210tag{position:absolute;left:0;top:0;font-size:9px;font-weight:800;white-space:nowrap;color:#fff;text-shadow:0 1px 3px #000;border-bottom:2px solid var(--c);padding:0 3px;opacity:.9;will-change:transform}"
  +".v210prop{position:absolute;display:none;z-index:2}.v210prop.mug{display:block;background:linear-gradient(#fff6 0 18%,#e7b14a 18%,#b9772b);border-radius:1px 1px 3px 3px}"
  +".v210prop.book{display:block;background:linear-gradient(90deg,#8a2b2b 0 46%,#f4ead2 46% 54%,#8a2b2b 54%);border-radius:2px}"
  +".v210prop.cards{display:block;background:radial-gradient(circle at 50% 50%,#d62828 0 22%,transparent 23%),#fffdf6;border:1px solid #3a3030;border-radius:2px;transform:rotate(-12deg)}.v210prop.cards::after{content:'';position:absolute;left:30%;top:-12%;width:100%;height:100%;background:radial-gradient(circle at 50% 50%,#222 0 20%,transparent 21%),#fffdf6;border:1px solid #3a3030;border-radius:2px;transform:rotate(18deg);z-index:-1}"
  +".v210say{position:absolute;left:-2px;display:none;font-style:normal;font-size:11px;font-weight:900;color:#1a1420;background:#fff;border-radius:9px;padding:0 5px;line-height:15px}.v210say.on{display:block;animation:v210dots 1.2s steps(3) infinite}.v210say.on::after{content:'\\2026'}"
  +"@keyframes v210dots{0%{opacity:.5}50%{opacity:1}100%{opacity:.5}}"
  +".v210empty{position:absolute;left:0;right:0;bottom:8%;text-align:center;color:#fff;opacity:.8;font-size:13px;margin:0}"
  +".v210cap{display:flex;align-items:baseline;justify-content:space-between;padding:8px 14px}"
  +".v210run{position:relative;padding-left:54px!important}.v210rn{position:absolute;left:8px;top:50%;width:40px;height:44px;margin-top:-22px;overflow:visible}.v210rn img{position:absolute;left:20px;top:44px;max-width:none}"
  +".v210pk{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:10px 0}.v210who{display:flex;flex-direction:column;align-items:center;gap:4px;width:92px;padding:8px 4px;border-radius:14px;border:2px solid var(--c);background:rgba(255,255,255,.04);color:inherit;font:inherit;cursor:pointer}"
  +".v210rs{margin:8px 0}.v210rp{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}.v210rp .chip{opacity:.55}.v210rp .chip.on{opacity:1}");
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV210={team:v210Team,free:v210Free,out:v210Out,join:v210Join,agents:function(){return Object.keys(V210A).map(function(k){var a=V210A[k];return {k:k,x:Math.round(a.x),y:Math.round(a.y),mode:a.mode,act:a.act||""}})},look:v210Look};
