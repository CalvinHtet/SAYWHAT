/* ---------- Cal 2026-11-25: the header's avatar is the player card ----------
   Cal: "I want the player card and banner to be visible on the top player card. Make sure that clicking the player icon on any screen
   will open up the player banner. On the main board, this may mean moving all the text at the top slightly to the right to make room for
   the full customized player banner without it being cut off."
   - The avatar box in the header (every screen that has the header) is now a small player card: the chosen backdrop whole (3:4, as it
     is painted), the character standing on its floor, the companion beside them. The name, coins and rank sit to its right as before.
   - Tapping it opens the player card on every screen. The small card button beside it is gone (the avatar does its job). The profile
     is one tap further: a Profile button on the card, and the Board's level bar opens it as it always did.
   - The two tours that pointed at the avatar for the profile (Relics, streak freezes) point at the level bar. */
function v55Av(){var p=pcMe(),c=p.card||{},bg=pcBy(c.bg)&&pcHas(c.bg)?c.bg:"studio",u=bg==="studio"?null:pcArt(bg),H=window.innerWidth<350?78:88,W=Math.round(H*1.23),pet="";
  try{if(p.pet)pet=pzPedPic(p.pet,H)}catch(e){}
  /* the frame keeps 11% of its height under the feet (fshChar); idle, so the header's character still breathes */
  var fig=calImg(p.look,"idle",H,"").replace("<img ",'<img style="margin-bottom:-'+Math.round(H*0.11)+'px" ');
  return '<button class="avbtn pcav pc-'+bg+'" data-act="pcard" aria-label="Your player card" style="width:'+W+'px'+(u?';background-image:url(&quot;'+esc(u)+'&quot;)':'')+'"><span class="pc-stage"><span class="fsh-fig pc-fig">'+fig+pet+'</span></span></button>'}
var v55Strip=stripHtml;stripHtml=function(){var h=v55Strip.apply(this,arguments);
  try{var d=document.createElement("div");d.innerHTML=h;var av=d.querySelector(".avbtn"),pb=d.querySelector(".pcbtn");
    if(av){av.outerHTML=v55Av();if(pb&&pb.parentNode)pb.parentNode.removeChild(pb);h=d.innerHTML}}catch(e){}
  return h};
/* the card: Profile first (the avatar used to open it) */
var v55Open=pcOpen;pcOpen=function(){var r=v55Open.apply(this,arguments);
  try{var row=document.querySelector("#layer .pcm .pc-row");if(row&&!row.querySelector("[data-act=char]")){row.insertAdjacentHTML("afterbegin",'<button type="button" class="btn ghost" data-act="char">Profile</button>');
      var t=typeof alTabs==="function"?alTabs():{};if(t.trophy&&typeof alMark==="function")alMark(row.querySelector("[data-act=char]"),true)}}catch(e){}
  return r};
try{TOURS.forEach(function(t){
    if(t.id==="trophy"){t.ready=function(){return tourAreaOpen("trophy")&&view==="board"&&tourVis(".bline")};t.steps=[{sel:".bline",t:"New: Relics",x:"Your profile now holds your Relics, with your class and skills. Tap your level bar to open it.",tap:1}]}
    if(t.id==="freeze"){var old=t.steps[0];t.ready=function(){return view==="board"&&(S.freezes||0)>0&&!!tourVis(".bline")};
      t.steps=[{sel:".bline",t:old.t,get x(){return String(old.x).replace("Tap your character to see","Tap your level bar to see")}}]}})}catch(e){}
/* Cal 11-25: "for the player card, my character looks blurry compared to the banner". A still with data-hi is swapped for a frame
   rendered that many times larger (QBLoft.frameHi) once it is made; the Loft-size frame shows until then. The larger frame is
   re-asserted a few times, since the plain loop (calHyd) may set the small one after it. */
var v55Hyd=calHyd;calHyd=function(img){var fresh=!img.dataset.hy&&!!window.QBLoft,r=v55Hyd.apply(this,arguments);
  try{var hi=+img.dataset.hi||0;if(fresh&&hi>1&&img.dataset.pose==="still"&&QBLoft.frameHi){var ch=JSON.parse(img.dataset.look).rig,n=0,after=0;if(!ch)return r;
      var go=function(){if(!img.isConnected)return;var u=QBLoft.frameHi(ch,"idle",0,hi);if(u){if(img.getAttribute("src")!==u)img.src=u;if(++after>6)return}if(++n<160)setTimeout(go,250)};go()}}catch(e){}
  return r};
/* QA fd5c2713: "the Stylist's try-on mirror draws the character about 100 CSS px tall, so a face mark is a few pixels and can't be
   judged before buying". While a tattoo or scar is tried on, the mirror shows the head close up, drawn sharp (the head is 84 of the
   frame's 208 standing px, 42 px down from the frame's top, centred). */
var v55Mirror=qsMirror;qsMirror=function(){var h=v55Mirror.apply(this,arguments);
  try{if(!(QS_TRY.a_tattoo||QS_TRY.a_scar))return h;var tl=qsTryList(),ovr={};tl.forEach(function(it){ovr[it[1]]=it[0]});if(!ovr.a_tattoo&&!ovr.a_scar)return h;
    var H=250,k=H/QBLoft.data.loft.standPx,hi=Math.max(1,Math.min(3,Math.round(H*(window.devicePixelRatio||1)/QBLoft.data.loft.standPx*2)/2));
    var img=calImg(lookOf(ovr),"still",H,"").replace("<img ",'<img data-hi="'+hi+'" style="position:absolute;left:50%;top:50%;max-width:none;margin-left:-'+(QBLoft.data.loft.frame[0]/2*k).toFixed(1)+'px;margin-top:-'+(88*k).toFixed(1)+'px" ');
    h=h.replace(/<div class="qs-glass">[\s\S]*?<\/div>/,'<div class="qs-glass qs-face">'+img+'</div>')}catch(e){}
  return h};
/* Profile on the card: the card closes first (charModal stacks on whatever is open) */
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("#layer .pcm [data-act=char]");if(!b)return;e.preventDefault();e.stopPropagation();closeModals();charModal()},true);
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV155={texts:function(){/* every line of standing copy, for the stale-wording sweep (rigtest/lead/wording155.js) */var o=[],put=function(w,t){if(t!=null&&t!=="")o.push(w+": "+String(t).replace(/<[^>]+>/g," "))};
    try{AREAS.forEach(function(a){put("area "+a[0],a[1]);put("area line "+a[0],AREALINE[a[0]]);put("area short "+a[0],typeof NAVSHORT!=="undefined"?NAVSHORT[a[0]]:"")})}catch(e){put("ERR areas",e.message)}
    try{Object.keys(QBINFO).forEach(function(k){var q=QBINFO[k],l=typeof q[1]==="function"?q[1]():q[1];put("info "+k,q[0]);[].concat(l||[]).forEach(function(x){put("info "+k,x)})})}catch(e){put("ERR info",e.message)}
    try{TOURS.forEach(function(t){t.steps.forEach(function(s){put("tour "+t.id,s.t);put("tour "+t.id,s.x)})})}catch(e){put("ERR tours",e.message)}
    try{RANKS.forEach(function(r){put("rank "+r.l,r.n);(r.f||[]).forEach(function(x){put("rank feature "+r.l,x)})})}catch(e){put("ERR ranks",e.message)}
    try{Object.keys(CLASSES).forEach(function(k){var c=CLASSES[k];put("class "+k,[c.name].concat(c.tiers||[]).join(" / "))})}catch(e){}
    return o},
  icon:function(k){return areaIcon(k)},cardHtml:function(k){var a=AREAS.filter(function(x){return x[0]===k})[0];return a?areaCard(a,0):""},card:function(k){return this.cardHtml(k).replace(/<svg[\s\S]*?<\/svg>/g," ").replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim()},
  areas:function(){return AREAS.map(function(a){return a[0]})},go:function(v){view=v;render();window.scrollTo(0,0)},infoKeys:function(){return Object.keys(QBINFO)},
  info:function(k){closeModals();qbInfo(k);var m=document.querySelector("#layer .modal");return m?m.innerText:""},feed:function(){/* the Town board with a card post and a text post, drawn as if signed in (the plain build has no cloud save) */var d0=db,u0=MYUID;db=db||{};MYUID=MYUID||"me";try{SOC.posts=[{id:MYUID+"|1",from:MYUID,name:(S.char&&S.char.name)||"Me",text:PCTXT,t:Date.now(),look:lookOf()},{id:"x|2",from:"x",name:"Ann",text:"hello there",t:Date.now()-5000,look:lookOf()}];return socInner()}finally{db=d0;MYUID=u0}},tours:function(){return TOURS.filter(function(t){return t.id==="trophy"||t.id==="freeze"}).map(function(t){return {id:t.id,sel:t.steps[0].sel,x:String(t.steps[0].x),ready:!!t.ready()}})}};
htabCss("qb-v155-css",".avbtn.pcav{position:relative;display:block;flex:none;aspect-ratio:3/4;height:auto;padding:0;border-radius:14px;overflow:hidden;background:#141826 center/cover no-repeat;border:1px solid var(--accent);box-shadow:0 0 14px -4px var(--accent);cursor:pointer}"
  +".avbtn.pcav.pc-studio{background:radial-gradient(120% 70% at 50% 18%,#3a4470 0%,#1a1f38 55%,#0c0e1a 100%)}.avbtn.pcav.pc-studio::before{content:\"\";position:absolute;left:0;right:0;bottom:0;height:34%;background:linear-gradient(180deg,rgba(255,255,255,.07),rgba(255,255,255,.02));border-top:1px solid rgba(255,255,255,.12)}"
  +".avbtn.pcav .pc-stage{bottom:8%}.avbtn.pcav .pc-fig{width:auto;cursor:pointer}.avbtn.pcav .nbang{z-index:2;top:4px;right:6px}/* QA 68bfead9: the card clips, so the mark sits inside it; and the Profile button holds its own mark */.pcm .pc-row [data-act=char]{position:relative}"
  +".strip .who{gap:14px}.qs-glass.qs-face{position:relative;overflow:hidden}");
