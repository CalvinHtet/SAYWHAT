/* ---------- v1.09: Cal's cleanup (2026-11-17) ----------
   Cal: "I agree with cutting the coaches in the workout tab. Remove the town boss for now because not that many people are playing so it
   is just clutter. Change the chat from 3 rooms to 2. ... Townsquare and neighbors list is redundant in the players tab. The town hall
   banner should also be a part of the background and overlayed behind the character border on the top ... No need to have a banner
   just to show a picture of a town. Upgrades and Interface in the shop can be its own tab called "Upgrades" ... The on sale today banner
   can go away. Just show the sale icon when they are browsing through each brand. Only show the version number on the first tab. ...
   on the first tab, move the version number to top right ... We can move the coins and messages and class name into the space [to the
   right of the character frame] in a neat fashion. Same for Town hall and Players tab. Change "Outside Run" to "Outside". For side
   quests, have a time limit of 1 week. Nest the description of the challenge inside the challenge button. Nest the photo description
   inside the post a photo button. ... Same for the Town meter. Anything that requires a large body of text to explain, can easily be
   nested in a small info icon button near that item."
   Nothing is taken from a save: a coach's XP, a boss week, chat room 3's old lines and the Neighbors' data stay where they are, unread. */

/* Coaches: gone from Training and the Loft, and their small XP bonuses with them */
coachesOn=function(){return false};
coachBuffs=function(){return []};

/* the Town Boss: off for now (its card in the Town Hall and its chest letter) */
hallHtml=bossHallBase;
INBOXGEN=INBOXGEN.filter(function(f){return String(f).indexOf("bossState")<0});

/* chat: Room 1 and Room 2 */
TCHROOMS.length=2;if(TCH.room>2)TCH.room=1;

/* Players: the Town square stays (it is where people greet each other); the Neighbors list under it went, as everyone is already on the
   Players board above it */
fshFolds=function(){var sq=!!FSH.fold.square;
  return '<button type="button" class="fsh-fold'+(sq?' open':'')+'" data-act="fshfold" data-k="square" aria-expanded="'+sq+'"><b>Town square</b><small>Wave, high five, poke or spank</small></button>'+(sq?sqHtml():'')};
/* the Hall's own Neighbors note (shown without the cloud) goes too: the panel keeps the meter and the Town board */
var v9SocInner=socInner;socInner=function(){var h=v9SocInner.apply(this,arguments);return /<h3 class="label">Neighbors<\/h3>/.test(h)&&h.indexOf("Town board")<0?"":h};

/* the Town Hall's picture is the page's background now, under the header, fading into the page; no banner card */
hallBanner=function(){return ""};

/* the header: the version only on the Board, in its top right corner; coins, letters and class to the right of the character frame */
var v9Strip=stripHtml;
stripHtml=function(){var h=v9Strip.apply(this,arguments);
  try{var d=document.createElement("div");d.innerHTML=h;var vl=d.querySelector(".vline"),st=d.querySelector(".strip"),who=st&&st.querySelector(".who"),col=who&&who.children[1],rt=st&&st.querySelector(".right");
    if(col&&rt){col.classList.add("v9col");col.appendChild(rt)}
    /* QA (v1.09): absolute, it ran into a long name at 360 wide; it is its own small line now, right-aligned. A save problem always
       shows, on every tab, in full (QA: a faint 10 px "NOT SAVING" on one tab is easy to miss) */
    var err=false;try{err=!!SAVEERR}catch(x){}
    if(vl){if(err)vl.classList.add("v9ver","v9err");else if(view==="board")vl.classList.add("v9ver");else vl.parentNode.removeChild(vl)}
    h=d.innerHTML}catch(e){}
  /* the Town Hall's picture, behind the header and fading into the page (an element of the page: the body's classes are rewritten on
     every draw, applyFx) */
  try{var bd=window.QBART&&QBART["ui_town_board.webp"];if(view==="hall"&&bd)h='<i class="v9hallbg" aria-hidden="true" style="background-image:linear-gradient(180deg,color-mix(in srgb,var(--bg) 25%,transparent) 0%,color-mix(in srgb,var(--bg) 60%,transparent) 50%,var(--bg) 100%),url('+bd+')"></i>'+h}catch(e){}
  return h};

/* the Shop: Upgrades and Interface are one "Upgrades" tab beside the Wardrobe, out of the brands' row; no "On sale today" strip (a piece
   on sale still wears its badge and its struck-through price, 29z_sale.js) */
saleHtml=function(){return ""};
var v9Shop=shopHtml;
shopHtml=function(){if(shopTab==="interface")shopTab="upgrades";var h=v9Shop.apply(this,arguments);
  try{h=h.replace(/<button class="qs-tab[^"]*" data-act="stab" data-v="(upgrades|interface)">[^<]*<\/button>/g,"");
    if(typeof sysHas!=="function"||sysHas()){
      h=h.replace(/(data-v="wardrobe">Wardrobe<\/button>)/,'$1<button class="qs-tab qs-wdb qs-upb'+(shopTab==="upgrades"?" on":"")+'" data-act="stab" data-v="upgrades">Upgrades</button>');
      if(shopTab==="upgrades"){var ui='<h3 class="label qs-uplab">Interface</h3><div class="qs-fit qs-fitif">'+ifPreview()+'<div class="qs-rack">'+qsLegacy(["theme","frame","bg","pet","title","burst","hud","sound","scene"])+'</div></div>',
        i=h.indexOf('<p class="qs-dev"');h=i>0?h.slice(0,i)+ui+h.slice(i):h+ui}}}catch(e){}
  return h};

/* "Outside run" is "Outside" */
CLUSTERS.forEach(function(c){if(c[0]==="out")c[1]="Outside"});try{R2CLN.out="Outside"}catch(e){}

/* side quests last a week from the day they were taken; then they lapse (their progress with them) and can be offered again a week
   later. The Board card says how many days are left. */
var SDQDAYS=7;
/* QA (v1.09): a quest taken before this update gets its week from the day the update first ran (S.side.wk0), not from when it was
   taken, so nobody's walks or nights vanish on the first load */
function sdqLeft(id){var o=sdqState(),a=o.on[id];if(!a||o.done[id])return null;if(!o.wk0){o.wk0=today();persist()}if(o.wk0>a)a=o.wk0;return SDQDAYS-(ymdN(today())-ymdN(a))}
function sdqExpire(){var o=sdqState(),ch=0;Object.keys(o.on).forEach(function(id){if(o.done[id])return;var l=sdqLeft(id);if(l==null||l>0)return;
    delete o.on[id];o.later[id]=Date.now()+7*864e5;if(id==="dogs")o.walk=[];if(id==="sable")o.nw={};if(id==="theo")delete o.mv;ch=1});
  if(ch)persist();return ch}
var v9SdqOn=sdqOn;sdqOn=function(id){try{sdqExpire()}catch(e){}return v9SdqOn.apply(this,arguments)};
var v9SdqProg=sdqProg;sdqProg=function(q){var p=v9SdqProg.apply(this,arguments),l=null;try{l=sdqLeft(q.id)}catch(e){}
  /* the card shows the progress, or what to photograph while there is none: keep that line, the days left after it */
  return l==null?p:(p||esc(q.snap))+' &middot; '+(l<=1?'last day':l+' days left')};
setInterval(function(){try{if(loaded&&S&&S.created&&sdqExpire())render()}catch(e){}},60000);

/* long explanations live behind an (i): Challenges and the Town meter (the photo feed's empty line is short now) */
QBINFO.duel=["Challenges",["Bet coins, or real money you settle yourselves, on who earns more quest XP or Training XP in 1, 3 or 7 days. You both put in the same stake. The winner takes the pot.",
  "A Gym Pact bets on workout days instead: you both aim for 3 to 5 in a week."]];
QBINFO.meter=["Town meter",["Everyone fills it together, every week. Only XP and coins are shared, never your tasks."]];
var v9Dl=dlCard;dlCard=function(){var h=v9Dl.apply(this,arguments);
  return h.replace('<h3 class="label">Challenges</h3>','<h3 class="label lbi">Challenges'+qbI("duel")+'</h3>').replace(/<p class="note">Bet coins, or real money[^<]*<\/p>/,'')};
var v9Meter=townMeter;townMeter=function(){var h=v9Meter.apply(this,arguments);
  return h.replace('<h3 class="label">Town meter &middot; this week</h3>','<h3 class="label lbi">Town meter &middot; this week'+qbI("meter")+'</h3>').replace('<p class="note">Everyone fills it together. Only XP and coins are shared, never your tasks.</p>','')};
var v9Ph=phInner;phInner=function(){return v9Ph.apply(this,arguments).replace('No photos yet. Post one after a photo check, or any photo you take.','No photos yet.')};

(function(){var st=document.createElement("style");
  st.textContent=
    /* the header: frame left; name, then coins and letters, then the class, in the column beside it */
    ".strip{flex-wrap:nowrap;align-items:center}.strip .who{flex:1;align-items:center;min-width:0}"
    +".v9col{display:flex;flex-direction:column;align-items:flex-start;gap:8px;min-width:0;flex:1}"
    +".v9col .right{display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:flex-start}"
    +".v9col .rankpill{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}"
    /* the version: a small line in the Board's top right corner, not a row of its own */
    +".vline.v9ver{padding:0;margin:0 0 -8px;font-size:10px;line-height:12px;opacity:.6;text-align:right;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}"
    +".vline.v9err{opacity:1;font-size:12px;line-height:14px;margin:0 0 -4px;color:var(--bad,#ff6b6b)}"
    /* the Town Hall: its picture behind the top of the page, fading into the background */
    +".v9hallbg{position:absolute;top:-24px;left:50%;width:100vw;max-width:900px;transform:translateX(-50%);height:480px;z-index:-1;pointer-events:none;background-size:100% 100%,cover;background-position:center top;background-repeat:no-repeat;-webkit-mask-image:linear-gradient(90deg,transparent,#000 14%,#000 86%,transparent);mask-image:linear-gradient(90deg,transparent,#000 14%,#000 86%,transparent)}"
    /* the Wheel row's "new" mark sat in the page's top right corner (its row was not its anchor) */
    +".zx-next{position:relative}"
    +".qs-uplab{margin:18px 0 8px}";
  (document.head||document.documentElement).appendChild(st)})();
