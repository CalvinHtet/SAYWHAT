/* ---------- Guided tours and a calm first week (Cal, 2026-11-13) ----------
   Cal: "When they unlock something, they should get a guided tutorial that walks them through the platform and what they need. Such as
   'congrats! You hit level 2 and unlocked the loft!' Then an arrow pointing to the loft icon and 'click here to continue' then actually
   a walk through of how each mechanic in the app works." And: "The whole system needs a simplification overhaul so people are not
   overwhelmed. However, a proper tutorial that walks players through what to press and what to do at each new feature unlock could
   mitigate this a bit." His girlfriend: "too complicated"; friends: "too cluttered ... people need a tutorial".
   - A tour runs once per feature, when that feature is open and nothing else is on screen: the page dims except a ring around the thing
     that matters, and a card says what it is. A "tap" step waits for the player to tap the ringed thing (the tab, the tile); a "Next"
     step explains. Skip ends it. The profile has "Replay tutorial".
   - The calm first week, for characters made on this version only (S.calm): day 1 is tasks, level and coins; the Daily Quest card comes on
     day 2, bounties on day 3, Training on day 4, each with its tour. Stats stay hidden until level 10. Areas keep opening one a day
     (29h_unlocks.js), each with its tour. Saves from before keep their Board as it was; their open features count as toured, so only
     what they open from now on gets a tour.
   - S.tours {id: 1} and S.calm {days: [play days]} are new save fields; merge() keeps unknown fields. */
var TOUR={id:null,i:0,miss:0,t:0};
function tourSeen(){if(!S.tours||typeof S.tours!=="object")S.tours={};return S.tours}
/* the n-th day this character has been played (1 on the day it was made); 99 for saves from before */
function calmDay(){var c=S.calm;if(!c||typeof c!=="object")return 99;if(!Array.isArray(c.days))c.days=[];var t=today();if(loaded&&c.days.indexOf(t)<0){c.days.push(t);if(c.days.length>14)c.days=c.days.slice(-14);persist()}return Math.max(1,c.days.length)}
function calmOn(){return !!(S.calm&&typeof S.calm==="object")}
/* once per save: a new character gets the calm week; a save with progress gets its open features marked as toured */
function tourInit(){if(!loaded||!S.created||S.calm!==undefined)return;
  var fresh=!(+S.total>0)&&(+S.xp||0)<50&&!(S.areaOn&&S.areaOn.hideout);
  if(fresh){S.calm={days:[today()]};S.tours={};setTimeout(function(){try{render()}catch(e){}},0)}
  else{S.calm=false;var o=tourSeen(),on=areaOn();["welcome","dq","bty","train"].forEach(function(k){o[k]=1});Object.keys(on).forEach(function(k){if(on[k])o[k]=1})}
  persist()}
function tourAreaOpen(k){try{var a=AREAS.filter(function(x){return x[0]===k})[0];return !!a&&effLvl()>=a[2]&&!areaGate(k)&&!!areaOn()[k]}catch(e){return false}}
/* the player's own first quest still to do (not the weekly Workout, not a bounty) */
function tourOwnQ(){return (S.quests||[]).filter(function(q){return q&&q.rep!=="weekly4"&&!q.bty&&!(S.done&&S.done[q.id])})[0]||null}
/* QA's review: level 2 brought the Loft tour and the Town tour within minutes. A tour that waits for another one runs only on a later day
   than that one ran (S.tourOn {id: day}; a save from before has no day, so it is long ago) */
function tourAfter(id){var o=S.tourOn||{};return !!tourSeen()[id]&&o[id]!==today()}
function tourVis(sel){var e=document.querySelector(sel);if(!e)return null;var r=e.getBoundingClientRect();return r.width>0&&r.height>0?e:null}
/* the tours, in the order they may run. ready(): may it start now. A step: sel (what to ring), t (title), x (text), tap (wait for a tap on it) */
var TOURS=[
  {id:"welcome",ready:function(){return view==="board"&&tourVis("#cap")},steps:[
    {sel:"#cap",t:"Welcome to SAYWHAT",x:"Every real thing you need to do is a quest. Type today's tasks here, as many as you like, then tap Add."},
    /* QA's review (2026-11-14): this step rang the only quest on a new Board, the hour-long Workout with photo proof. It rings the
       player's own first task, or, before they have added one, the Add button. */
    {get sel(){var q=tourOwnQ();return q?'.qmain[data-id="'+q.id+'"]':"#capgo"},get t(){return tourOwnQ()?"Do it, then tick it":"Add one first"},
     get x(){return tourOwnQ()?"Done it in real life? Tap it. You earn XP and coins for every one.":"Type something you need to do today, then tap Add. When it's done in real life, tick it here."}},
    {sel:".bline",t:"Your level",x:"XP fills this bar. Each new level pays coins, and now and then opens something new. We'll show you each one."},
    {sel:".coinpill",t:"Your coins",x:"Coins build your home and buy clothes, once those open. For now, finish a few tasks."}]},
  {id:"dq",ready:function(){return view==="board"&&tourVis(".card.dq")},steps:[
    {sel:".card.dq",t:"New: the Daily Quest",x:"A goal for today. Fill the bar with your tasks and a chest opens with a reward. It starts fresh every morning."},
    /* Cal, 2026-11-16 (cut the fat): the rules left the screens for an (i) on each card; the first tour that has one shows it */
    {sel:".card.dq .qbi",t:"How it works",x:"Tap the i on any card to read its rules. The screens keep just your numbers."}]},
  {id:"bty",ready:function(){return view==="board"&&tourVis(".bty")},steps:[
    {sel:".bty",t:"New: Bounties",x:"A fresh real-life challenge every day. Take it and it joins your quests, for extra XP."}]},
  {id:"train",ready:function(){return view==="board"&&tourVis('.zx-tile[data-v="train"]')},steps:[
    {sel:'.zx-tile[data-v="train"]',t:"New: Training",x:"Workout plans that guide you set by set. Tap here.",tap:1},
    {sel:'[data-act="wkplan"]',t:"Pick a plan",x:"Choose what you're training today. It builds the session around it, and you can swap any exercise."}]},
  {id:"hideout",ready:function(){return tourAreaOpen("hideout")&&view==="board"&&tourVis('.nav button[data-v="hideout"]')},steps:[
    {sel:'.nav button[data-v="hideout"]',t:"You unlocked The Loft!",x:"Your own place to build up. Tap here.",tap:1},
    {sel:"#lfwrap",t:"Your Loft",x:"Tap a room to open it. Each upgrade you buy with coins makes it nicer, and new rooms open as you go."}]},
  {id:"hall",ready:function(){return tourAreaOpen("hall")&&tourAfter("hideout")&&tourVis('.nav button[data-v="hall"]')&&(view==="board"||view==="hideout")},steps:[
    {sel:'.nav button[data-v="hall"]',t:"You unlocked Town!",x:"See what everyone playing is up to. Tap here.",tap:1},
    {sel:".htab",t:"Posts and Chat",x:"Posts from everyone in town, and a chat to talk. Be nice, it's your friends."}]},
  {id:"players",ready:function(){return tourAreaOpen("players")&&tourAfter("hall")&&tourVis('.nav button[data-v="players"]')&&view!=="players"},steps:[
    {sel:'.nav button[data-v="players"]',t:"Meet the players",x:"Everyone in town, in their outfits. Tap here.",tap:1},
    {sel:"#fshbox",t:"Say hi",x:"Tap someone to wave or high-five. It shows up live on their screen."}]},
  {id:"shop",ready:function(){return tourAreaOpen("shop")&&tourVis('.nav button[data-v="shop"]')},steps:[
    {sel:'.nav button[data-v="shop"]',t:"You unlocked the Shop!",x:"Clothes for your character. Tap here.",tap:1},
    {sel:"#app",t:"The Shop",x:"New brands drop every Monday and Thursday. Buy a piece and put it on in your Wardrobe."}]},
  {id:"away",ready:function(){return view==="board"&&tourVis('.zx-tile[data-v="away"]')},steps:[
    {sel:'.zx-tile[data-v="away"]',t:"New: Dungeon Crawls",x:"Send your team down for coins and, now and then, something rare. Tap here.",tap:1},
    {sel:"#app",t:"Dungeon Crawls",x:"Pick a dungeon and send a crawl. It comes back on its own while you get on with your day."}]},
  {id:"wheel",ready:function(){return view==="board"&&tourVis(".zx-spin")},steps:[
    {sel:".zx-spin",t:"New: the Wheel",x:"A free spin every few hours. When one is ready, it shows up here. Tap to spin.",tap:1}]},
  {id:"trophy",ready:function(){return tourAreaOpen("trophy")&&view==="board"&&tourVis(".avbtn")},steps:[
    {sel:".avbtn",t:"New: Relics",x:"Your profile now holds your Relics, with your class and skills. Tap your character to open it.",tap:1}]}
];
/* ---- the overlay ---- */
function tourEl(){var r=document.getElementById("qbtour");if(r)return r;r=document.createElement("div");r.id="qbtour";r.setAttribute("aria-live","polite");
  r.innerHTML='<div class="tour-ring"></div><div class="tour-bub" role="dialog" aria-modal="false"><i class="tour-arw"></i><b class="tour-t"></b><p class="tour-x"></p><div class="tour-btns"><button type="button" class="btn ghost sm" data-tour="skip">Skip</button><span class="tour-n mono"></span><button type="button" class="btn sm" data-tour="next">Next</button></div></div>';
  document.body.appendChild(r);return r}
function tourEnd(done){if(TOUR.id){tourSeen()[TOUR.id]=1;if(!S.tourOn||typeof S.tourOn!=="object")S.tourOn={};S.tourOn[TOUR.id]=today()}TOUR.id=null;TOUR.i=0;var r=document.getElementById("qbtour");if(r)r.remove();persist()}
function tourStep(){var T=TOURS.filter(function(x){return x.id===TOUR.id})[0];return T?T.steps[TOUR.i]:null}
function tourNext(){var T=TOURS.filter(function(x){return x.id===TOUR.id})[0];if(!T)return tourEnd();TOUR.i++;TOUR.miss=0;TOUR.t=Date.now();if(TOUR.i>=T.steps.length)return tourEnd(1);tourDraw(1)}
function tourDraw(scroll){var st=tourStep();if(!st)return;var e=tourVis(st.sel);
  if(!e){/* not on screen (yet): a tap step's next screen is still drawing; give it a few seconds, then go on without it */if(++TOUR.miss>8)return tourNext();var r0=document.getElementById("qbtour");if(r0)r0.style.visibility="hidden";return}
  TOUR.miss=0;if(scroll){try{e.scrollIntoView({block:"center",behavior:"instant"})}catch(x){e.scrollIntoView()}}
  var r=tourEl(),T=TOURS.filter(function(x){return x.id===TOUR.id})[0];r.style.visibility="visible";
  var b=e.getBoundingClientRect(),pad=6,ring=r.querySelector(".tour-ring"),bub=r.querySelector(".tour-bub"),vw=innerWidth,vh=innerHeight;
  /* below the phone's notch (QA: it kept 4-8 px from the very top) */var sat=parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--qbsat"))||0;
  var big=b.height>vh*.6;/* a whole screen: ring its top part only */var top=Math.max(4+sat,b.top-pad),h=big?Math.min(vh*.35,b.height):b.height+pad*2;
  ring.style.left=Math.max(4,b.left-pad)+"px";ring.style.top=top+"px";ring.style.width=Math.min(vw-8,b.width+pad*2)+"px";ring.style.height=h+"px";
  r.querySelector(".tour-t").textContent=st.t;r.querySelector(".tour-x").textContent=st.x;
  r.querySelector(".tour-n").textContent=T.steps.length>1?(TOUR.i+1)+" / "+T.steps.length:"";
  var nb=r.querySelector('[data-tour="next"]');nb.style.display=st.tap?"none":"";nb.textContent=TOUR.i===T.steps.length-1?"Got it":"Next";
  var bw=Math.min(320,vw-24);bub.style.width=bw+"px";var cx=Math.min(vw-bw/2-12,Math.max(bw/2+12,b.left+b.width/2));bub.style.left=(cx-bw/2)+"px";
  var bh=bub.offsetHeight||120,below=top+h+14+bh<vh-8||top<bh+30;bub.style.top=(below?top+h+14:Math.max(8+sat,top-14-bh))+"px";
  bub.classList.toggle("up",!below);var arw=bub.querySelector(".tour-arw");arw.style.left=Math.max(14,Math.min(bw-28,b.left+b.width/2-(cx-bw/2)-8))+"px"}
function tourTick(){try{tourInit();if(!loaded||!S||!S.created||ccEdit)return;
    if(TOUR.id){var st=tourStep();if(!st)return tourEnd();if(document.querySelector("#layer .modal")&&!st.modal){var r0=document.getElementById("qbtour");if(r0)r0.style.visibility="hidden";return}tourDraw(0);return}
    if(document.querySelector("#layer .modal")||document.querySelector(".coachscr")||document.querySelector("#qbsignin[style*=flex]"))return;
    var seen=tourSeen();for(var i=0;i<TOURS.length;i++){var T=TOURS[i];if(seen[T.id])continue;var ok=false;try{ok=!!T.ready()}catch(e){}if(ok){TOUR.id=T.id;TOUR.i=0;TOUR.miss=0;TOUR.t=Date.now();tourDraw(1);return}}
  }catch(e){}}
setInterval(tourTick,1200);window.addEventListener("resize",function(){if(TOUR.id)tourDraw(0)});window.addEventListener("scroll",function(){if(TOUR.id)tourDraw(0)},{passive:true});
document.addEventListener("click",function(e){var tb=e.target.closest&&e.target.closest("[data-tour]");
  if(tb){e.preventDefault();e.stopPropagation();if(tb.dataset.tour==="skip")tourEnd();else tourNext();return}
  if(e.target.closest&&e.target.closest("[data-act=tourreplay]")){S.tours={};if(calmOn())S.tours={};persist();closeModals();pop("The tutorial starts again as you go");return}
  if(!TOUR.id)return;var st=tourStep();if(!st||!st.tap)return;var t=tourVis(st.sel);/* move on from the step that was tapped, unless something already moved the tour on (the first-steps tours skip a step the player is past) */
  if(t&&(t===e.target||t.contains(e.target))){var at=TOUR.i,id=TOUR.id;setTimeout(function(){if(TOUR.id===id&&TOUR.i===at)tourNext()},500)}},true);
var tourRenderBase=render;
render=function(){var r=tourRenderBase.apply(this,arguments);if(TOUR.id)setTimeout(function(){tourDraw(0)},60);return r};
/* ---- the calm first week ---- */
var calmBtyBase=btyHtml;
btyHtml=function(){if(calmOn()&&calmDay()<3)return "";return calmBtyBase.apply(this,arguments)};
var calmHubBase=zxHub;
zxHub=function(){var h=calmHubBase.apply(this,arguments);if(calmOn()&&calmDay()<4)h=h.replace(/<button class="zx-tile" data-act="nav" data-v="train">[\s\S]*?<\/button>/,"").replace('<section class="card panel zx-hub"><div class="zx-tiles"></div></section>',"");return h};
var calmDqBase=dqHtml;
dqHtml=function(){if(calmOn()&&calmDay()<2)return "";return calmDqBase.apply(this,arguments)};
/* the stats (STR, AGI, VIT, INT) stay out of sight until level 10, for everyone (Cal approved: hide the numbers until they matter) */
var calmRenderBase=render;
render=function(){var r=calmRenderBase.apply(this,arguments);try{document.documentElement.classList.toggle("qb-calm-stats",effLvl()<10)}catch(e){}return r};
/* the profile: Replay tutorial */
var tourProfBase=profileHtml;
profileHtml=function(){var h=tourProfBase.apply(this,arguments);var b='<button type="button" class="btn ghost" data-act="tourreplay">Replay tutorial</button>';
  return h.indexOf('<div class="zx-me">')>=0?h.replace('<div class="zx-me">','<div class="zx-me">'+b):'<div class="zx-me">'+b+'</div>'+h};
(function(){if(document.getElementById("qb-tour-css"))return;var st=document.createElement("style");st.id="qb-tour-css";
  st.textContent=":root{--qbsat:env(safe-area-inset-top,0px)}#qbtour{position:fixed;inset:0;z-index:99990;pointer-events:none}"
    +"#qbtour .tour-ring{position:fixed;border-radius:14px;border:2px solid var(--accent,#ffc857);box-shadow:0 0 0 200vmax rgba(8,6,16,.62);transition:all .25s ease;animation:tourpulse 1.6s ease-in-out infinite}"
    +"@keyframes tourpulse{0%,100%{outline:0 solid transparent}50%{outline:6px solid color-mix(in srgb,var(--accent,#ffc857) 35%,transparent)}}"
    +"#qbtour .tour-bub{position:fixed;pointer-events:auto;background:var(--surface,#1b1411);color:var(--fg,#fff);border:1px solid var(--accent,#ffc857);border-radius:14px;padding:14px 14px 10px;box-shadow:0 14px 34px -10px rgba(0,0,0,.8);transition:top .25s ease,left .25s ease}"
    +"#qbtour .tour-t{display:block;font-size:16px;margin-bottom:6px}#qbtour .tour-x{margin:0 0 10px;font-size:14px;line-height:1.4;opacity:.92}"
    +"#qbtour .tour-btns{display:flex;align-items:center;justify-content:space-between;gap:8px}#qbtour .tour-n{font-size:11px;opacity:.6}"
    +"#qbtour .tour-arw{position:absolute;top:-8px;width:16px;height:16px;background:inherit;border-left:1px solid var(--accent,#ffc857);border-top:1px solid var(--accent,#ffc857);transform:rotate(45deg)}"
    +"#qbtour .tour-bub.up .tour-arw{top:auto;bottom:-8px;transform:rotate(225deg)}"
    +"html.qb-calm-stats .dq .dq-st{display:none}html.qb-calm-stats .dq .dq-row:has(.dq-st){display:none}"
    +"@media (prefers-reduced-motion:reduce){#qbtour .tour-ring{animation:none;transition:none}}";
  (document.head||document.documentElement).appendChild(st)})();
