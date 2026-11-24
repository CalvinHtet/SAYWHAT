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
/* QA 11-24 (FIX): the first rule (any short line that starts with a waiting word and ends in "...") also ringed a player's own words, for
   good: quests named "Sorting laundry..." or "Reading chapter 3...", chat lines, posts. Now only the game's own status lines, matched
   whole, and never inside anything a player wrote (a quest's name, the chat log, a post's caption or comments, a text box). */
var V44WAIT=/^(syncing|loading|loading photos|posting|sending|saving|uploading|verifying|checking|connecting|working|looking for neighbors|looking for players|checking who is here|reading the image|reading the photo|reading your brain dump|opening the room)(\u2026|\.\.\.)$/i,
    V44USER=".name,.quest,.qrow,.bty-card,.tch-log,.tch-logw,.tch-in,.ph-cap,.ph-cm,.ph-cms,.ph-card,.tw-row,.pname,[contenteditable],svg,script,style,textarea,input,option";
htabCss("qb-spin-css",".qspin::before{content:\"\";display:inline-block;box-sizing:border-box;width:.78em;height:.78em;margin-right:.42em;border:2px solid currentColor;border-right-color:transparent;border-radius:50%;vertical-align:-.08em;animation:qspin .7s linear infinite}@keyframes qspin{to{transform:rotate(360deg)}}");
function v44Spin(){try{var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null),n,on=[];
    while((n=w.nextNode())){var t=n.nodeValue;if(t.length<5||t.length>80)continue;t=t.trim();if(!V44WAIT.test(t))continue;var p=n.parentNode;if(!p||!p.closest||p.closest(V44USER))continue;on.push(p)}
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

/* ---- surprise loot (Cal: "I like the idea of surprise loot. Keep it low chance ... I think the chance of random loot should be 1/15
   chance", "The common prizes should be a treasure chest with more coins or a soul stone with more exp", "If the loot is furniture, make
   sure it is usually the cheapest furniture upgrade available in a random room. Do NOT allow new room purchases such as emptying out the
   back lot or expanding the restaurant or purchasing the mall ... it should be an upgrade that is under 1000 ... a cosmetic item or
   clothing, but not from the really high tier shop. Can occasionally drop something from the boutique. No pet store loots and no pets
   ... a random small drop but nothing game breaking").
   - One roll per finished task, 1 in 15, once per task a day (unticking and ticking again does not roll again). No daily cap (Cal: two
     on a heavy day is fine). Tutorial tasks never roll.
   - What: chest 45, soul stone 35, clothing 12, furniture 6, Boutique 2 (of 100). Clothing: a Street piece the player does not own,
     never the luxury tier, never the Atelier. Boutique: only once the Boutique is open to the player. Furniture: the cheapest upgrade the
     room's window offers to buy now, under 1,000 coins, in a random room that has one; never one that opens a room, a lot or an
     expansion, never a trophy piece. With nothing to give in a kind, it is a chest.
   - A chest pays 350 coins x the game's reward scale (econScaled: about 270 at level 4), +/- 20%: two or three tasks' worth. A soul stone pays 15% of the level, between
     40 and 400 XP. Pets and Pet Store pieces are never in it (freePool has clothes only). ---- */
var LOOTP=1/15,LOOTW=[["chest",45],["stone",35],["cloth",12],["furn",6],["bout",2]],LOOTCHEST=350,LOOTSTONE=.15,LOOTFURN=1000;
function lootState(){var t=today();if(!S.loot||typeof S.loot!=="object"||S.loot.d!==t)S.loot={d:t,ids:{},n:0,all:(S.loot&&S.loot.all)||0};return S.loot}
function lootKind(r){var tot=LOOTW.reduce(function(a,w){return a+w[1]},0),x=r*tot;for(var i=0;i<LOOTW.length;i++){x-=LOOTW[i][1];if(x<0)return LOOTW[i][0]}return "chest"}
function lootCloth(floor){try{var F=shopFloors().filter(function(f){return f.id===floor})[0];if(!F)return null;
    var p=freePool({brands:flBrands(F),basics:floor==="street",lv:effLvl()+5}).filter(function(it){return clothTier(it[0])!=="luxury"&&brandFloor((it[6]||{}).b)!=="atelier"});
    return p.length?p[Math.floor(Math.random()*p.length)]:null}catch(e){return null}}
/* [slot index, addon] of what each room's window would sell now for under LOOTFURN, the cheapest per room */
function lootFurnAll(){var out=[];try{S.base.slots.forEach(function(r,i){if(!r||!ROOMT[r.t])return;var RA=roomAvail(i,r,ROOMT[r.t],ADDONS[r.t]||[]),best=null;
      (RA.avail||[]).forEach(function(h){var m=/data-act="raddon"[^>]*data-id="([^"]+)"/.exec(h);if(!m)return;var a=(ADDONS[r.t]||[]).filter(function(x){return x[0]===m[1]})[0],e=a&&a[3]||{};
        if(!a||!(a[2]>0)||a[2]>=LOOTFURN||e.opens||e.trophy||e.splash||e.fixed||e.g==="Expansion"||(r.a&&r.a[a[0]]))return;if(!best||a[2]<best[2])best=a});
      if(best)out.push([i,best])})}catch(e){}return out}
function lootGive(kind){var L=lootState(),o={k:kind};
  if(kind==="bout"){var b=lootCloth("boutique");if(b){S.owned[b[0]]=true;o.it=b}else kind="cloth"}
  if(kind==="cloth"){var c=lootCloth("street");if(c){S.owned[c[0]]=true;o.it=c}else kind="chest"}
  if(kind==="furn"){var fs=lootFurnAll(),f=fs.length?fs[Math.floor(Math.random()*fs.length)]:null;
    if(f){try{simulate()}catch(e){}var r=S.base.slots[f[0]];r.a=r.a||{};r.a[f[1][0]]=1;o.ad=f[1];o.room=(ROOMT[r.t]||{}).name||"your Loft";try{DROP={i:f[0],id:f[1][0],name:f[1][1]}}catch(e){}}else kind="chest"}
  if(kind==="stone"){var x=Math.round(Math.max(40,Math.min(400,need(Math.min(effLvl(),MAXL-1))*LOOTSTONE)));o.xp=x}
  if(kind==="chest"){var cn=econScaled(LOOTCHEST*(.8+.4*Math.random()),10);o.coins=cn}
  o.k=kind;L.n++;L.all=(L.all||0)+1;
  if(o.xp||o.coins)grantXp(o.xp||0,o.coins||0);else{render();persist()}
  return o}
function lootIcon(o){var gem='<svg viewBox="0 0 64 64" width="88" height="88" aria-hidden="true"><defs><linearGradient id="lg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9af4ff"/><stop offset=".55" stop-color="#6b7cff"/><stop offset="1" stop-color="#b56bff"/></linearGradient></defs><path d="M32 4 52 22 32 60 12 22Z" fill="url(#lg1)" stroke="#e8f6ff" stroke-width="1.5" stroke-linejoin="round"/><path d="M12 22h40M32 4 24 22l8 38 8-38-8-18" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1.2" stroke-linejoin="round"/></svg>';
  if(o.k==="stone")return ART.soulstone?'<img src="'+ART.soulstone+'" alt="">':gem;
  if(o.it){try{return '<img src="'+itemArt(o.it)+'" alt="" onerror="this.remove()">'}catch(e){}}
  if(o.ad){try{var sp=window.LFSPR&&LFSPR[o.ad[0]];if(sp&&sp.u)return '<img src="'+sp.u+'" alt="" style="max-height:120px">'}catch(e){}}
  return ART.chest?'<img src="'+ART.chest+'" alt="">':gem}
function lootShow(o){var head=o.k==="stone"?"Soul stone":o.k==="chest"?"Treasure chest":o.ad?esc(o.ad[1]):esc(o.it[2]),
    line=o.k==="stone"?"+"+o.xp.toLocaleString()+" XP":o.k==="chest"?"+"+o.coins.toLocaleString()+" coins":o.ad?"Installed in "+esc(o.room)+", on the house.":(function(){var b="";try{b=freeBrand(o.it)}catch(e){}return (b?esc(b)+" &middot; ":"")+(hasRoom("closet")?"in your Closet":"saved for later")})();
  modal('<div class="card box2 adv lootm"><span class="label">Surprise loot</span><div class="lootimg">'+lootIcon(o)+'</div><h2>'+head+'</h2><div class="reward reveal">'+line+'</div>'
    +'<div class="row" style="justify-content:center"><button type="button" class="btn" data-act="mclose">Nice</button></div></div>');
  try{qbSnd("big")}catch(e){}try{burst(innerWidth/2,innerHeight/3,26)}catch(e){}}
htabCss("qb-loot-css",".lootm{text-align:center}.lootimg{display:flex;justify-content:center;align-items:center;min-height:110px;margin:6px 0 2px;animation:lootpop .5s cubic-bezier(.2,1.4,.4,1)}.lootimg img{max-width:150px;max-height:130px;filter:drop-shadow(0 6px 18px rgba(255,200,87,.35))}@keyframes lootpop{from{transform:scale(.4);opacity:0}to{transform:none;opacity:1}}");
var LOOTRND=Math.random;
var v44Toggle=toggle;toggle=function(id){var was=!!(S.done&&S.done[id]),r=v44Toggle.apply(this,arguments);
  try{if(!was&&S.done&&S.done[id]){var q=(S.quests||[]).filter(function(x){return x&&x.id===id})[0],L=lootState();
      if(q&&!q.tut&&!L.ids[id]){L.ids[id]=1;if(LOOTRND()<LOOTP){var o=lootGive(lootKind(LOOTRND()));setTimeout(function(){try{lootShow(o)}catch(e){}},1200)}}}}catch(e){}
  return r};

/* ---- every free piece is one the player can use (Cal 11-24: "Make sure that clothing item rewards don't include items that cannot be
   used. For example, Im a male and my rewards for the random loot or the scratch cards or anywhere in the game should not be female
   clothing or cosmetics or hairstyles ... if I dont have a pet, pets and their respective items should [not] be available as a prize or
   loot. Banners for the player cards should also not be available for a prize, or upgrades and interface upgrades"). Every prize in the
   game comes out of freePool (29y_free.js: loot, the scratch card, chests, the weekly prize, milestones, crawls). It already kept to
   pieces that fit the body (itemFits: the fo/mo marks and g); this makes the rest of the rule hold whatever a caller asks for: only
   things worn on the character (slot a_...), never a pet's piece, a backdrop, a buff or an interface piece. ---- */
var v44Pool=freePool;freePool=function(o){return v44Pool.apply(this,arguments).filter(function(it){var e=it[6]||{};return /^a_/.test(it[1])&&itemFits(it)&&!e.pet&&!e.bg&&!e.card})};

/* ---- the tabs work while the save syncs (Cal 11-24: "When the save is syncing on the top right, i cant go into my different tabs. Make
   sure you add a pulsating glowing syncing... text or spinning circle on the top right so we know it is syncing, and also do not
   disable to option to click on other tabs while things are syncing. it should be able to be run in the background").
   The fast start draws the copy on this device and turns every tap off until the online save has answered (29zx_simple.js:
   html.qb-sync body *{pointer-events:none}), because nothing done before then is saved (persist waits for it) and the online save
   replaces the screen when it lands. Looking around is safe, so the bottom bar, anything that only changes the screen (data-act="nav",
   the Hall's tabs) and the (i) sheets take taps again; ticking, buying and typing still wait. "syncing…" gets its ring (v44Spin) and a
   slow glow so it reads as working, not stuck. ---- */
htabCss("qb-syncnav-css","html.qb-sync body .nav,html.qb-sync body .nav *,html.qb-sync body [data-act=\"nav\"],html.qb-sync body [data-act=\"nav\"] *,html.qb-sync body .htab,html.qb-sync body .htab *{pointer-events:auto!important}"
  +"html.qb-sync #savest{color:var(--accent,#7cf0ff);font-weight:700;animation:qbsyncglow 1.3s ease-in-out infinite}@keyframes qbsyncglow{0%,100%{opacity:.55;text-shadow:none}50%{opacity:1;text-shadow:0 0 10px currentColor}}");

if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV144={spin:v44Spin,ranks:function(){return RANKS.map(function(r){return r.n})},sqk:function(){return Object.keys(SQK)},surge:function(){return surgeState()},check:surgeCheck,left:surgeLeft,loot:{give:function(k){var o=lootGive(k);lootShow(o);return {k:o.k,xp:o.xp,coins:o.coins,it:o.it&&o.it[0],ad:o.ad&&o.ad[0],price:o.ad&&o.ad[2]}},kind:lootKind,furn:function(){return lootFurnAll().map(function(f){return [S.base.slots[f[0]].t,f[1][0],f[1][2]]})},state:lootState,rnd:function(f){LOOTRND=f||Math.random},p:LOOTP,w:LOOTW,pool:function(o){return freePool(o||{slots:/^a_/,brands:"all",basics:true}).map(function(it){return [it[0],it[1],!!(it[6]||{}).fo,!!(it[6]||{}).mo,(it[6]||{}).g||""]})}},info:function(k){var e=QBINFO[k];return typeof e[1]==="function"?e[1]():e[1]}};
