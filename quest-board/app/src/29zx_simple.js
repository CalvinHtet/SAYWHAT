/* ---------- Simpler screens (Cal, 2026-11-13, after he, his girlfriend and friends played v0.92) ----------
   "In the town hall, there should only be town hall related stuff and ways to interact with each other." "I want there to be another
   tab that shows all the players. Instead of it being nested within the rank tab." "I don't think the wheel should get its own tab."
   "Place the daily quest meter on the board menu at the top. Place it underneath the exp bar." "When purchasing any upgrades, have
   the coins always show on top right even when scrolling down."
   - Players is a tab of its own (the Hall's old Rank tab, 29u_style.js): everyone's characters, likes, the leaderboard, the Town
     square and the Neighbors. It opens with the Hall. The Hall keeps Posts and Chat (29s_hall.js).
   - The Wheel has no tab: a card on the Board opens it (its view and save are unchanged).
   - The Daily Quest card sits on the Board right under the progress line (it was in the profile, 29e_economy.js).
   - The profile keeps the class and its skills, which left the Town Hall; the advancement ladder and story chapters are not shown.
   - Room and upgrade windows keep their title and coins in view while they scroll. */
var plViewBase=viewHtml;
viewHtml=function(v){if(v==="players")return playersHtml();var h=plViewBase.apply(this,arguments);
  /* a screen that left the tab bar has its way back */if(typeof NAVHIDE!=="undefined"&&NAVHIDE[v])h='<button type="button" class="zx-back" data-act="nav" data-v="board">&lsaquo; Board</button>'+h;return h};
function playersHtml(){try{htabOpen()}catch(e){}var b;try{b=fshHtml()}catch(e){b='<section class="card panel"><p class="note">Players could not load right now.</p></section>'}return b}
var plIconBase=areaIcon;
areaIcon=function(k){if(k==="players")return '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.6"/><path d="M15.5 14.2c3 .2 5.5 2.6 5.5 5.8"/></svg>';return plIconBase.apply(this,arguments)};
/* Players opens exactly when the Hall does, never as a separate unlock */
var plOnBase=areaOn;
areaOn=function(){var o=plOnBase.apply(this,arguments);try{if(o&&typeof o==="object"){if(o.hall)o.players=1;else delete o.players}}catch(e){}return o};
var plWaitBase=areaWaiting;
areaWaiting=function(id){return plWaitBase(id==="players"?"hall":id)};
/* the Board: the Daily Quest card under the progress line, then one row of tiles for what left the tab bar (Cal, "Fewer tabs first"):
   Training, Dungeon Crawls and the Wheel, each once it is open. They use the tab bar's own "nav" tap (30_app_b.js), so a locked one says so. */
function zxOpen(k){try{var a=AREAS.filter(function(x){return x[0]===k})[0];return !!a&&effLvl()>=a[2]&&!areaGate(k)&&!!areaOn()[k]}catch(e){return false}}
var ZXHUB=[["train","Training","Workouts and plans"],["away","Dungeon Crawls","Send your team"],["wheel","Wheel","A free spin every few hours"]];
function zxHub(){var t=ZXHUB.filter(function(x){return zxOpen(x[0])});if(!t.length)return "";
  return '<section class="card panel zx-hub"><div class="zx-tiles">'+t.map(function(x){return '<button class="zx-tile" data-act="nav" data-v="'+x[0]+'">'+areaIcon(x[0])+'<b>'+x[1]+'</b><small>'+x[2]+'</small></button>'}).join("")+'</div></section>'}
var zxLineBase=boardLine;
boardLine=function(){var h=zxLineBase.apply(this,arguments);if(view!=="board")return h;var c="";try{c=typeof dqHtml==="function"?dqHtml():""}catch(e){c=""}return h+c+zxHub()};
/* the profile: the class's skills (from the old Class Hall) above the Stats */
function zxSkills(){try{var h=townHallBase(),a=h.indexOf('<h3 class="label">Your skills</h3>');if(a<0)return "";a=h.lastIndexOf("<section",a);var b=h.indexOf("</section>",a);return a<0||b<0?"":h.slice(a,b+10)}catch(e){return ""}}
var zxProfBase=profileHtml;
profileHtml=function(){var h=zxProfBase.apply(this,arguments),k=zxSkills();
  /* Relics left the tab bar: it opens from here */if(zxOpen("trophy"))h='<div class="zx-me"><button type="button" class="btn ghost" data-act="nav" data-v="trophy">Relics</button></div>'+h;if(!k)return h;var i=h.indexOf('<section class="card panel"><h3 class="label">Stats</h3>');return i<0?h+k:h.slice(0,i)+k+h.slice(i)};
/* the tip jar (Cal, 2026-11-13: "a small tip jar that fills up if people are happy"; ROOMS's art rsx_tip0/1/2, f9ecb1a): guests served
   quickly tip more (lfTipFor in 20_loft.js), so today's tips against the room's daily cap are its happiness. Empty with no tips today,
   half up to 60% of the cap, full past that. ROOMS draws it on each counter (Restaurant, Upstairs Bar, Boba, Dessert parlor). i: the
   room's slot index in S.base.slots. */
function tipJarArt(i){try{var r=S.base.slots[i];if(!r)return "rsx_tip0";var T=S.base.tipd,n=T&&T.d===today()?(+T.n[i]||0):0;if(n<=0)return "rsx_tip0";
  var cap=lfTipCap(r,lfSvcMods(r))||1;return n/cap<.6?"rsx_tip1":"rsx_tip2"}catch(e){return "rsx_tip0"}}
/* the coins stay in view at the top right once the page scrolls past the header (Cal: "have the coins always show on top right even when
   scrolling down"); room and upgrade windows already keep theirs in their own head */
(function(){var el=null;function up(){try{if(!loaded||!S||!S.created){if(el)el.hidden=true;return}
    if(!el){el=document.createElement("div");el.id="zxcoins";el.className="coinpill zx-coins";el.setAttribute("aria-hidden","true");document.body.appendChild(el)}
    var show=window.scrollY>140&&!document.querySelector("#layer .modal");el.hidden=!show;if(show)el.innerHTML='<i class="coin"></i>'+Math.floor(S.coins||0).toLocaleString()}catch(e){}}
  window.addEventListener("scroll",up,{passive:true});setInterval(up,1500)})();
(function(){if(document.getElementById("qb-zx-css"))return;var st=document.createElement("style");st.id="qb-zx-css";
  st.textContent=".vline{font-size:11px;line-height:1.2;opacity:.72;text-align:left;padding:2px 2px 6px;letter-spacing:.02em}"
    /* the window's head (title, coins) stays at the top of the window while its list scrolls */
    +"#layer .modal .rm-head{position:sticky;top:0;z-index:8;background:var(--surface,#1b1411);padding-top:6px;padding-bottom:6px;margin-top:-6px}"
    +".zx-coins{position:fixed;top:calc(env(safe-area-inset-top,0px) + 8px);right:10px;z-index:60;box-shadow:0 6px 16px -6px rgba(0,0,0,.7)}.zx-coins[hidden]{display:none}"
    +".sq-stage.has-art{background-position:center top}"
    +"html.qb-switch #app{visibility:hidden}html.qb-sync body *{pointer-events:none!important}"
    +".zx-tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(96px,1fr));gap:8px}.zx-tile{display:flex;flex-direction:column;align-items:center;gap:4px;padding:12px 6px;border-radius:12px;border:1px solid var(--line);background:var(--surface2,transparent);color:var(--fg);cursor:pointer;text-align:center}.zx-tile b{font-size:13px}.zx-tile small{font-size:11px;opacity:.7;line-height:1.2}"
    +".zx-back{display:inline-flex;align-items:center;gap:4px;margin:4px 0 10px;padding:8px 14px;border-radius:999px;border:1px solid var(--line);background:var(--surface);color:var(--fg);font:700 13px/1 var(--font-body,system-ui);cursor:pointer}.zx-me{display:flex;gap:8px;margin:0 0 12px}"
    +".bty .chip.done{color:var(--done,#5ee08a);border-color:currentColor}";
  (document.head||document.documentElement).appendChild(st)})();
