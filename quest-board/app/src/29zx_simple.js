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
viewHtml=function(v){if(v==="players")return playersHtml();return plViewBase.apply(this,arguments)};
function playersHtml(){try{htabOpen()}catch(e){}var b;try{b=fshHtml()}catch(e){b='<section class="card panel"><p class="note">Players could not load right now.</p></section>'}return b}
var plIconBase=areaIcon;
areaIcon=function(k){if(k==="players")return '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.6"/><path d="M15.5 14.2c3 .2 5.5 2.6 5.5 5.8"/></svg>';return plIconBase.apply(this,arguments)};
/* Players opens exactly when the Hall does, never as a separate unlock */
var plOnBase=areaOn;
areaOn=function(){var o=plOnBase.apply(this,arguments);try{if(o&&typeof o==="object"){if(o.hall)o.players=1;else delete o.players}}catch(e){}return o};
var plWaitBase=areaWaiting;
areaWaiting=function(id){return plWaitBase(id==="players"?"hall":id)};
/* the Board: the Daily Quest card under the progress line, then the Wheel's card once the Wheel is open */
function zxWheelCard(){try{var a=AREAS.filter(function(x){return x[0]==="wheel"})[0];if(!a||effLvl()<a[2]||areaGate("wheel")||!areaOn().wheel)return ""}catch(e){return ""}
  return '<section class="card panel zx-wheel"><div class="row" style="justify-content:space-between;align-items:center"><div><h3 class="label">Wheel</h3><p class="note">A free spin every few hours.</p></div><button class="btn" data-act="nav" data-v="wheel">Open</button></div></section>'}
var zxLineBase=boardLine;
boardLine=function(){var h=zxLineBase.apply(this,arguments);if(view!=="board")return h;var c="";try{c=typeof dqHtml==="function"?dqHtml():""}catch(e){c=""}return h+c+zxWheelCard()};
/* the profile: the class's skills (from the old Class Hall) above the Stats */
function zxSkills(){try{var h=townHallBase(),a=h.indexOf('<h3 class="label">Your skills</h3>');if(a<0)return "";a=h.lastIndexOf("<section",a);var b=h.indexOf("</section>",a);return a<0||b<0?"":h.slice(a,b+10)}catch(e){return ""}}
var zxProfBase=profileHtml;
profileHtml=function(){var h=zxProfBase.apply(this,arguments),k=zxSkills();if(!k)return h;var i=h.indexOf('<section class="card panel"><h3 class="label">Stats</h3>');return i<0?h+k:h.slice(0,i)+k+h.slice(i)};
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
    +".zx-wheel .note{margin:2px 0 0}"
    +".bty .chip.done{color:var(--done,#5ee08a);border-color:currentColor}";
  (document.head||document.documentElement).appendChild(st)})();
