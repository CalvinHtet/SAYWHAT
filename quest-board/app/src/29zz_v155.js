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
/* Profile on the card: the card closes first (charModal stacks on whatever is open) */
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("#layer .pcm [data-act=char]");if(!b)return;e.preventDefault();e.stopPropagation();closeModals();charModal()},true);
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV155={tours:function(){return TOURS.filter(function(t){return t.id==="trophy"||t.id==="freeze"}).map(function(t){return {id:t.id,sel:t.steps[0].sel,x:String(t.steps[0].x),ready:!!t.ready()}})}};
htabCss("qb-v155-css",".avbtn.pcav{position:relative;display:block;flex:none;aspect-ratio:3/4;height:auto;padding:0;border-radius:14px;overflow:hidden;background:#141826 center/cover no-repeat;border:1px solid var(--accent);box-shadow:0 0 14px -4px var(--accent);cursor:pointer}"
  +".avbtn.pcav.pc-studio{background:radial-gradient(120% 70% at 50% 18%,#3a4470 0%,#1a1f38 55%,#0c0e1a 100%)}.avbtn.pcav.pc-studio::before{content:\"\";position:absolute;left:0;right:0;bottom:0;height:34%;background:linear-gradient(180deg,rgba(255,255,255,.07),rgba(255,255,255,.02));border-top:1px solid rgba(255,255,255,.12)}"
  +".avbtn.pcav .pc-stage{bottom:8%}.avbtn.pcav .pc-fig{width:auto;cursor:pointer}.avbtn.pcav .nbang{z-index:2}"
  +".strip .who{gap:14px}");
