/* ---------- Cal's 2026-11-24 list, batch 1 (docs/specs/2026-11-24_SPEC_cal_list.md) ---------- */

/* ---- the ranks: Awakened, Hunter, Knight, Paragon, Sovereign, Monarch (Cal: "Change the ranks to Awakened, Hunter, Knight, (Something
   else), Sovereign, Monarch", then "Paragon and keep everything else"). They were Bass Hunter, Drop Knight, Headliner and Shadow Monarch:
   two were music words and one was another story's title. Classes and paths keep their names. ---- */
(function(){var n=["Awakened","Hunter","Knight","Paragon","Sovereign","Monarch"];RANKS.forEach(function(r,i){if(n[i])r.n=n[i]})})();

/* ---- one greeting: Wave (Cal: "Just have a wave button instead of the other buttons. They do the same thing"). Fist bump and High five
   leave the card; greetings already sent with them still read right (SQOLD, 29p_square.js sqKind). ---- */
(function(){["fist","five"].forEach(function(k){if(SQK[k]){SQOLD[k]=SQK[k];delete SQK[k]}})})();

/* ---- nothing waits without a spinner (Cal: "For anything that is loading such as the syncing text on the top right, make sure you add a
   spinning circle. There should never be anything that is waiting idly with no loading animation, otherwise people will think the app is
   frozen ... even after adding tasks and it is sorting through my tasks"). Every waiting line in the app ends in "…" or "..." and starts
   with one of the words below (syncing…, Loading…, Posting…, Reading your brain dump..., Looking for players…, Connecting…): each gets a
   small spinning ring in front of it, in its own colour, for as long as it shows. Found after every render and twice a second, so a line
   written later (a fetch that answers, a window that opens) gets one too. ---- */
var V44WAIT=/^(loading|posting|looking for|reading|opening|checking|connecting|syncing|saving|sending|sorting|uploading|verifying|adding|working|thinking)\b[^\n]{0,60}(…|\.\.\.)$/i;
htabCss("qb-spin-css",".qspin::before{content:\"\";display:inline-block;box-sizing:border-box;width:.78em;height:.78em;margin-right:.42em;border:2px solid currentColor;border-right-color:transparent;border-radius:50%;vertical-align:-.08em;animation:qspin .7s linear infinite}@keyframes qspin{to{transform:rotate(360deg)}}");
function v44Spin(){try{var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null),n,on=[];
    while((n=w.nextNode())){var t=n.nodeValue;if(t.length<5||t.length>80)continue;t=t.trim();if(!V44WAIT.test(t))continue;var p=n.parentNode;if(!p||!p.closest||p.closest("svg,script,style,textarea,option"))continue;on.push(p)}
    document.querySelectorAll(".qspin").forEach(function(e){if(on.indexOf(e)<0)e.classList.remove("qspin")});
    on.forEach(function(e){e.classList.add("qspin")})}catch(e){}}
var v44Render=render;render=function(){var r=v44Render.apply(this,arguments);v44Spin();return r};
setInterval(v44Spin,500);

/* ---- Momentum Surge, in place of Rested XP (Cal: "Yes on the comeback bonus. Have a little splash screen that says welcome back and some
   blurb about how you took a few days off from being a badass to rest up and now you're more ready than ever to continue your journey.
   And then activate some active skill that lasts for the first 5 tasks and grants double exp and 1.5x coins called momentum surge", and
   "only for the first 5 tasks after they are gone for 3 or more days and then the skill goes away").
   - Away = 3 or more full days with no active day (S.lastDone, the last day with 50+ XP; so last active Monday, back Friday).
   - S.surge = {n: tasks left, from: the last active day it was given for, ids: the tasks it was spent on, seen}. Given once per absence.
     A surged task that is unticked and ticked again keeps its surge and does not use another.
   - On top of the day's other bonuses: XP x2, coins x1.5 (cm, as the bounty does), for 5 tasks.
   - Rested XP (30_app_b.js restBank: a bank of double XP that grew with every day away) is gone: nothing banks and nothing is left to
     spend, so the two can never stack. ---- */
var SURGEN=5,SURGEX=2,SURGEC=1.5,SURGEAWAY=3;
restBank=function(){if(!S.rest||typeof S.rest!=="object")S.rest={x:0,from:""};S.rest.x=0;return S.rest};
function surgeState(){return S&&S.surge&&typeof S.surge==="object"?S.surge:null}
function surgeLeft(){var g=surgeState();return g&&g.n>0?g.n:0}
function surgeCheck(){if(!S||!S.created||typeof loaded==="undefined"||!loaded||!S.lastDone)return;var t=today();if(S.lastDone===t)return;
  var g=surgeState();if(g&&g.from===S.lastDone)return;
  if(dayDiff(S.lastDone,t)-1>=SURGEAWAY){S.surge={n:SURGEN,from:S.lastDone,ids:{},seen:0};persist()}}
var v44Mults=mults;mults=function(q,o){var r=v44Mults.apply(this,arguments);
  try{var g=surgeState();if(g&&q&&!q.tut&&(g.n>0||(g.ids&&g.ids[q.id]))){r.m*=SURGEX;r.cm=(r.cm||1)*SURGEC;r.tags.push("Momentum Surge x"+SURGEX);payXp(q,r);
      if(o&&o.commit&&!(g.ids&&g.ids[q.id])){g.ids=g.ids||{};g.ids[q.id]=1;g.n=Math.max(0,g.n-1)}}}catch(e){}
  return r};
function surgeSplash(){var g=surgeState();if(!g||g.seen||g.n<=0||view!=="board"||document.querySelector("#layer .modal,#layer .qb-held"))return;
  g.seen=1;persist();var nm=(S.char&&S.char.name)?", "+esc(S.char.name):"";
  modal('<div class="card box2 surge"><span class="label">Welcome back</span><h2>Welcome back'+nm+'.</h2>'
    +'<p class="note">You took a few days off from being a badass to rest up. Good. Now you are more ready than ever to continue your journey.</p>'
    +'<div class="surgechip"><b>Momentum Surge</b><span>Your next '+g.n+' tasks pay <b>double XP</b> and <b>1.5x coins</b>.</span></div>'
    +'<div class="row"><button type="button" class="btn" data-act="mclose">Let&rsquo;s go</button></div></div>')}
htabCss("qb-surge-css",".surgechip{margin:12px 0;padding:12px 14px;border:1px solid var(--gold,#ffc857);border-radius:12px;background:rgba(255,200,87,.08);display:grid;gap:4px}.surgechip>b{color:var(--gold,#ffc857);letter-spacing:.04em;text-transform:uppercase;font-size:.82em}"
  +".surgebar{display:flex;justify-content:space-between;align-items:center;gap:10px;margin:0 0 10px;padding:9px 13px;border:1px solid var(--gold,#ffc857);border-radius:12px;background:rgba(255,200,87,.08);font-size:.9em}.surgebar b{color:var(--gold,#ffc857)}.surgebar .mono{white-space:nowrap}");
/* the Board says so while it lasts */
var v44Board=boardHtml;boardHtml=function(){var h=v44Board.apply(this,arguments),n=surgeLeft();
  return n?'<div class="surgebar"><span><b>Momentum Surge</b> &middot; x'+SURGEX+' XP, x'+SURGEC+' coins</span><span class="mono">'+n+' task'+(n===1?'':'s')+' left</span></div>'+h:h};
var v44Render2=render;render=function(){try{surgeCheck()}catch(e){}var r=v44Render2.apply(this,arguments);try{surgeSplash()}catch(e){}return r};

/* ---- the (i) sheets that no longer said what the game does (Cal: "The info icon for daily quest needs to be reworked. Also investigate
   any info that is outdated our makes no sense"): the Weekly Quest paid "half a level", Rested XP is gone, the Weekly Warrior's coins
   have gone x1.25 a week to x2 since v1.40, and a logged session pays XP and coins once a day. ---- */
QBINFO.dq=["Daily Quest",function(){var w=(ECON&&ECON.wqDays)||4,x=0;try{x=wqXp()}catch(e){}return [
  "Tick tasks to fill the bar. Every chest you pass opens, and one more is hidden past the last.",
  "Big tasks and workouts fill it fastest. Quick 5 and 10 XP tasks count a little less here.",
  "The fuller the bar, the more your rooms earn today. Finding the hidden chest adds 10% tomorrow.",
  "Weekly Quest: be active (50+ XP) on "+w+" days, Monday to Sunday, for +"+x.toLocaleString()+" XP and coins.",
  "Back after "+SURGEAWAY+" or more days away? Momentum Surge: your first "+SURGEN+" tasks pay double XP and 1.5x coins."]}];
QBINFO.train=["Training",function(){var wb={xp:"",coins:""};try{wb=weekBonus()}catch(e){}return [
  "Each Workout quest you prove with a live photo counts once a day.",
  "4 in a week (Monday to Sunday) pays +"+Number(wb.xp).toLocaleString()+" XP and +"+Number(wb.coins).toLocaleString()+" coins plus a random prize.",
  "Every week you do it adds x0.25 to the coins, up to x2. A week you miss takes x0.25 off."]}];
QBINFO.wk=["Logging a workout",["Set the weight, then tap the set you just did: it keeps that weight, and next time it shows what you lifted.",
  "Finishing a session pays XP and coins once a day and saves your weights. The big reward is the Workout quest: prove it with a live photo."]];

/* ---- QA 11-24: no "!" on the Loft button while the Loft itself is still locked (tapping it said "Locked. Keep playing.") ---- */
var v44Tabs=alTabs;alTabs=function(){var t=v44Tabs.apply(this,arguments);try{var a=AREAS.filter(function(x){return x[0]==="hideout"})[0];if(t.hideout&&a&&!alOpenTab(a))delete t.hideout}catch(e){}return t};

if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV144={spin:v44Spin,ranks:function(){return RANKS.map(function(r){return r.n})},sqk:function(){return Object.keys(SQK)},surge:function(){return surgeState()},check:surgeCheck,left:surgeLeft,info:function(k){var e=QBINFO[k];return typeof e[1]==="function"?e[1]():e[1]}};
