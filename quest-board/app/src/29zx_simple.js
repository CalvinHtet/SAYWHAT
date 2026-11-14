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
/* Players opens after the Hall, never before it. QA's review (2026-11-14): level 2 opened The Loft, Town and Players at once (three tours
   in five minutes), so Players is its own unlock again, at level 3 (AREAS), one unlock a day below level 10 (29h_unlocks.js). Saves that
   have it keep it: the old rule wrote players into S.areaOn with the Hall. */
var plOnBase=areaOn;
areaOn=function(){var o=plOnBase.apply(this,arguments);try{if(o&&typeof o==="object"&&!o.hall)delete o.players}catch(e){}return o};
var plWaitBase=areaWaiting;
areaWaiting=function(id){if(id==="players"&&!areaOn().hall)return false;return plWaitBase(id)};
/* the Board: the Daily Quest card under the progress line, then one row of tiles for what left the tab bar (Cal, "Fewer tabs first"):
   Training, Dungeon Crawls and the Wheel, each once it is open. They use the tab bar's own "nav" tap (30_app_b.js), so a locked one says so. */
function zxOpen(k){try{var a=AREAS.filter(function(x){return x[0]===k})[0];return !!a&&effLvl()>=a[2]&&!areaGate(k)&&!!areaOn()[k]}catch(e){return false}}
var ZXHUB=[["train","Training","Workouts and plans"],["away","Dungeon Crawls","Send your team"]];
/* fewer things to check (Cal approved the overhaul, 2026-11-13): the Wheel has no tile; when a free spin is ready, a row under the Daily
   Quest says so. The 2-day bounty leaves the Board, so a day has the Daily Quest and one bounty. Rewards and their timing are unchanged. */
function zxSpin(){try{if(!zxOpen("wheel")||(typeof wheelLeft==="function"&&wheelLeft()>0))return "";return '<button type="button" class="zx-next zx-spin" data-act="nav" data-v="wheel"><span class="label">Wheel</span><span>Your free spin is ready.</span><b>Spin &rsaquo;</b></button>'}catch(e){return ""}}
/* the move to a midnight day (QA on v0.97): a play between midnight and 5 am under the old rule was stored as the day before, so the next
   play would look like a missed day and cost a rest day, a freeze or the streak. There is no time of the last quest, only of the last save,
   and a save at 01:00 can come from an evening player who only opened the app. So nothing moves at load (QA on d03aa26: that cost the evening
   player a day). Once, on the first load of this version: if the last save was between 00:00 and 05:00 and lastDone is that save's old-rule
   day, it is remembered (S.mid1). At the first streak credit after that, a gap of 2 days from that lastDone counts as 1. Any other gap, or a
   later credit, is as before. A wrong guess only forgives one day, once. */
/* the save's own time, caught as it loads (the boot saves again before the first draw, which would overwrite savedAt) */
var ZXSA0=0,zxMergeBase=merge;merge=function(d){try{ZXSA0=d&&+d.savedAt||0}catch(e){}return zxMergeBase.apply(this,arguments)};
function zxMidnightOnce(){try{if(!loaded||!S||!S.created||S.mid0)return;S.mid0=1;var sa=ZXSA0;if(sa){var d=new Date(sa);
  if(d.getHours()<5&&S.lastDone===dstr(new Date(sa-5*36e5)))S.mid1={d:S.lastDone}}persist()}catch(e){}}
var zxMidRender=render;render=function(){zxMidnightOnce();return zxMidRender.apply(this,arguments)};
var zxMidCredit=creditStreak;creditStreak=function(){var m=S.mid1,t=today();
  if(m&&S.lastDone!==t){delete S.mid1;try{if(S.lastDone===m.d&&dayDiff(m.d,t)===2){var y=t.split("-");S.lastDone=dstr(new Date(+y[0],+y[1]-1,+y[2]-1))}}catch(e){}}
  return zxMidCredit.apply(this,arguments)};
/* The Loft lag (Cal's phone, v0.97 speed log: The Loft at 22 fps, 3 fps with the Bedroom open, 4,700 and 7,700 elements). The Patio's
   skyline (patioSky, ROOMS's 27_rooms.js) is ~1,900 live SVG shapes, one per lit window, drawn in the Patio, the Rooftop and through
   the Bedroom's door, under animated pieces, so the phone repaints them on every frame. It is the same picture until the light
   changes, so it is drawn once into a bitmap and shown as one <image>. The first draw stays live until the bitmap is ready (a frame
   or two), then swaps in place. If the bitmap cannot be made, the picture stays live, as before. */
var ZXSKY={},ZXSKYK=[];
function zxHash(s){var h=5381,i=s.length;while(i)h=(h*33)^s.charCodeAt(--i);return (h>>>0).toString(36)}
function zxSkyImg(c){return '<image class="zxsky" href="'+c.u+'" x="'+c.x+'" y="'+c.y+'" width="'+c.w+'" height="'+c.h+'" preserveAspectRatio="none" pointer-events="none"/>'}
function zxSkyMake(k,bg,x,y,w,h){var c=ZXSKY[k]={x:x,y:y,w:w,h:h,u:""};ZXSKYK.push(k);
  while(ZXSKYK.length>8){var o=ZXSKY[ZXSKYK.shift()];if(o&&o.u&&o.b)try{URL.revokeObjectURL(o.u)}catch(e){}}
  var sc=Math.min(2.5,2400/Math.max(w,h)),W=Math.max(1,Math.round(w*sc)),H=Math.max(1,Math.round(h*sc)),im=new Image();
  var svg='<svg xmlns="http://www.w3.org/2000/svg" width="'+W+'" height="'+H+'" viewBox="'+x+' '+y+' '+w+' '+h+'" preserveAspectRatio="none">'+bg+'</svg>';
  var swap=function(){document.querySelectorAll('g[data-zxsky="'+k+'"]').forEach(function(g){try{g.innerHTML=zxSkyImg(c);g.removeAttribute("data-zxsky")}catch(e){}})};
  im.onload=function(){try{var cv=document.createElement("canvas");cv.width=W;cv.height=H;cv.getContext("2d").drawImage(im,0,0,W,H);
    cv.toBlob(function(b){if(!b)return;c.u=URL.createObjectURL(b);c.b=1;swap()},"image/png")}catch(e){}};
  im.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svg)}
var zxPatioSky=patioSky;patioSky=function(C){zxPatioSky(C);try{var bg=C.bg,m=/^<clipPath id="ptClip"><rect x="(-?[\d.]+)" y="(-?[\d.]+)" width="([\d.]+)" height="([\d.]+)"/.exec(bg||"");
  if(!m||typeof document==="undefined"||!document.createElement("canvas").toBlob)return;var k=bg.length.toString(36)+zxHash(bg),c=ZXSKY[k];
  if(c&&c.u){C.bg=zxSkyImg(c);return}
  C.bg='<g data-zxsky="'+k+'">'+bg+'</g>';if(!c)zxSkyMake(k,bg,+m[1],+m[2],+m[3],+m[4])}catch(e){}};
/* QA (v0.96 note): a spin that comes ready while the Board sits open shows at once, not on the next redraw */
setInterval(function(){try{if(!loaded||!S||!S.created||view!=="board"||document.hidden||document.querySelector("#layer .modal"))return;var a=document.activeElement;if(a&&/^(INPUT|TEXTAREA)$/.test(a.tagName))return;if(zxSpin()&&!document.querySelector(".zx-spin"))render()}catch(e){}},30000);
var zxBtyCard=btyCard;btyCard=function(k){return k===2?"":zxBtyCard.apply(this,arguments)};
function zxHub(){var t=ZXHUB.filter(function(x){return zxOpen(x[0])});if(!t.length)return "";
  return '<section class="card panel zx-hub"><div class="zx-tiles">'+t.map(function(x){return '<button class="zx-tile" data-act="nav" data-v="'+x[0]+'">'+areaIcon(x[0])+'<b>'+x[1]+'</b><small>'+x[2]+'</small></button>'}).join("")+'</div></section>'}
var zxLineBase=boardLine;
/* the one "what next" line (Cal approved the overhaul, 2026-11-13: one clear thing to do, so nobody has to work out the screen): the trial if it
   waits, tasks if there are none, an upgrade they can afford, what is left of the Daily Quest, else the quests left */
/* an upgrade a room window really offers with a Buy button and that the coins cover, the cheapest first (QA: from the windows' own list,
   roomAvail in 30_app_b.js, never the cheapest unbought piece anywhere) */
function zxAfford(){var best=null;try{S.base.slots.forEach(function(r,i){if(!r)return;var T=ROOMT[r.t],list=ADDONS[r.t]||[];if(!T)return;var A=roomAvail(i,r,T,list);
  A.avail.forEach(function(h){if(h.indexOf('data-act="raddon"')<0||/data-act="raddon"[^>]*disabled/.test(h))return;var m=/data-aid="([^"]+)"/.exec(h),a=m&&list.filter(function(x){return x[0]===m[1]})[0];
    if(a&&a[2]>0&&a[2]<=S.coins&&(!best||a[2]<best.p))best={i:i,p:a[2],room:(T.name||rmName(r.t))}})})}catch(e){}return best}
function zxNext(){var tx="",act="";try{var open=(S.quests||[]).filter(function(q){return q&&!S.done[q.id]}),g=gated(),af=zxOpen("hideout")?zxAfford():null,dqOn=!(typeof calmOn==="function"&&calmOn()&&calmDay()<2),x=dqOn&&typeof dqXp==="function"?dqXp():0,gl=dqOn&&typeof dqGoal==="function"?dqGoal():0;
  if(g!==null)tx="Your level trial is waiting below. Pass it to keep levelling.";
  else if(!open.length)tx="Add today's tasks in the box below. Every one pays XP and coins.";
  else if(af){tx="You can afford an upgrade in the "+af.room+".";act="room:"+af.i}
  else if(gl&&x<gl)tx=(gl-x)+" XP of tasks to go on today's Daily Quest.";
  else tx=open.length+" quest"+(open.length===1?"":"s")+" left on your list today."}catch(e){return ""}
  return act?'<button type="button" class="zx-next" data-act="zxroom" data-i="'+act.slice(5)+'"><span class="label">Next</span><span>'+esc(tx)+'</span><b>Open &rsaquo;</b></button>':'<div class="zx-next"><span class="label">Next</span><span>'+esc(tx)+'</span></div>'}
boardLine=function(){var h=zxLineBase.apply(this,arguments);if(view!=="board")return h;var c="";try{c=typeof dqHtml==="function"?dqHtml():""}catch(e){c=""}return h+zxNext()+c+zxSpin()+zxHub()};
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
/* ---------- swap an exercise in a gym plan (Cal, 2026-11-13: "an option to swap out any of the personal training day workouts to something
   of our choice. For example if we wanted to switch squats in the leg day to hip thrusts, allow us to edit the existing workout and make sure
   it saves and persists going forward") ----------
   Every exercise card in a gym plan has Swap: another exercise from the library (same muscles first), or one you type ("Hip Thrust"), which
   takes the replaced one's sets, reps and weight step. The choice is kept per plan in S.wkSwap {plan: {library id: new id}} and applied each
   time the plan is built (buildPlan), and to today's workout at once. Typed exercises live in S.exOwn {u_<name>: {n, m, sets, r, step}}
   and join EX like the library's (their card shows a dumbbell, as there is no demo art for them). Your own activities (c_ plans) are not
   gym plans and keep their own editing. */
function zxExSync(){if(!S.exOwn||typeof S.exOwn!=="object")S.exOwn={};Object.keys(S.exOwn).forEach(function(id){var c=S.exOwn[id];if(c&&c.n)EX[id]=[c.n,c.m||"legs",+c.sets||3,c.r||"8-12",+c.step||5]})}
function zxSwapIn(P,from,to){if(!P||!Array.isArray(P.list))return;var i=P.list.indexOf(from);if(i<0||P.list.indexOf(to)>=0)return;P.list[i]=to;
  ["roles","notes","setsN"].forEach(function(k){if(P[k]&&Object.prototype.hasOwnProperty.call(P[k],from)){P[k][to]=P[k][from];delete P[k][from]}})}
var zxBuildBase=buildPlan;
buildPlan=function(id){zxExSync();var P=zxBuildBase.apply(this,arguments);try{var m=!/^c_/.test(String(id))&&S.wkSwap&&S.wkSwap[id];
  if(m&&P){Object.keys(m).forEach(function(f){if(EX[m[f]])zxSwapIn(P,f,m[f])});P.min=estMin(P.list,P.roles,P.setsN)}}catch(e){}return P};
var zxCardBase=exCard;
exCard=function(id){zxExSync();var h=zxCardBase.apply(this,arguments);if(!S.wk||/^c_/.test(String(S.wk.plan||""))||(EX[id]&&EX[id][5]))return h;
  return h.replace('<span class="chip xp">','<button type="button" class="exswap" data-act="wkswap" data-ex="'+id+'">Swap</button><span class="chip xp">')};
var zxDemoBase=exDemo;
exDemo=function(id,cls){if(/^u_/.test(String(id))){var E=EX[id]||["Your exercise"];return '<div class="xd xd-own'+(cls?" "+cls:"")+'" role="img" aria-label="'+esc(E[0])+'">'+areaIcon("train")+'</div>'}return zxDemoBase.apply(this,arguments)};
function zxSwapOrig(x){var m=S.wkSwap&&S.wk&&S.wkSwap[S.wk.plan];if(!m)return x;var o=Object.keys(m).filter(function(k){return m[k]===x})[0];return o||x}
function zxSwapModal(from){var E=EX[from];if(!E||!S.wk)return;var inList=S.wk.list||[],o=zxSwapOrig(from),pl=planOf(S.wk.plan);
  var ids=Object.keys(EX).filter(function(k){return k!==from&&!EX[k][5]&&inList.indexOf(k)<0});
  ids.sort(function(a,b){var sa=EX[a][1]===E[1]?0:1,sb=EX[b][1]===E[1]?0:1;return sa-sb||EX[a][0].localeCompare(EX[b][0])});
  modal('<div class="card box2 zx-swap"><span class="label">Swap</span><h2>'+esc(E[0])+'</h2><p class="note">Pick what to do instead. It stays in your '+esc(pl?pl[1]:"")+' plan from now on.</p>'
    +'<div class="zx-own"><input id="zxown" type="text" maxlength="40" autocomplete="off" placeholder="Your own, like Hip Thrust" aria-label="Your own exercise"><button type="button" class="btn" data-act="wkswapown" data-ex="'+from+'">Use it</button></div>'
    +(o!==from&&EX[o]&&inList.indexOf(o)<0?'<button type="button" class="btn ghost zx-orig" data-act="wkswapto" data-ex="'+from+'" data-to="'+o+'">Back to '+esc(EX[o][0])+'</button>':'')
    +'<div class="zx-list">'+ids.map(function(k){return '<button type="button" class="zx-pick" data-act="wkswapto" data-ex="'+from+'" data-to="'+k+'"><b>'+esc(EX[k][0])+'</b><small>'+esc(EX[k][1])+'</small></button>'}).join("")+'</div>'
    +'<div class="row"><button type="button" class="btn ghost" data-act="mclose">Cancel</button></div></div>')}
function zxSwapDo(from,to){if(!S.wk||!EX[to]||from===to)return;if((S.wk.list||[]).indexOf(to)>=0){pop(EX[to][0]+" is already in this plan");return}if(!S.wkSwap||typeof S.wkSwap!=="object")S.wkSwap={};var p=S.wk.plan,m=S.wkSwap[p]||(S.wkSwap[p]={}),o=zxSwapOrig(from);
  if(o===to)delete m[o];else m[o]=to;zxSwapIn(S.wk,from,to);try{S.wk.min=estMin(S.wk.list,S.wk.roles,S.wk.setsN)}catch(e){}
  closeModals();persist();render();pop(EX[to][0]+" is in your plan now")}
function zxOwnAdd(from,name){name=String(name||"").trim().slice(0,40);var slug="u_"+name.toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"").slice(0,24);if(!name||slug==="u_")return;
  if(!S.exOwn||typeof S.exOwn!=="object")S.exOwn={};var E=EX[from]||[];if(!S.exOwn[slug])S.exOwn[slug]={n:name,m:E[1]||"legs",sets:E[2]||3,r:E[3]||"8-12",step:E[4]||5};
  zxExSync();if(S.wk&&(S.wk.list||[]).indexOf(slug)>=0){pop(name+" is already in this plan");return}zxSwapDo(from,slug)}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=wkswap],[data-act=wkswapto],[data-act=wkswapown]");if(!b)return;var a=b.dataset.act;
  if(a==="wkswap")zxSwapModal(b.dataset.ex);else if(a==="wkswapto")zxSwapDo(b.dataset.ex,b.dataset.to);else{var i=document.getElementById("zxown");zxOwnAdd(b.dataset.ex,i&&i.value)}});
document.addEventListener("keydown",function(e){if(e.key==="Enter"&&e.target&&e.target.id==="zxown"){e.preventDefault();var b=document.querySelector("[data-act=wkswapown]");if(b)b.click()}});
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=zxroom]");if(!b)return;roomModal(+b.dataset.i)});
/* the coins stay in view at the top right once the page scrolls past the header (Cal: "have the coins always show on top right even when
   scrolling down"); room and upgrade windows already keep theirs in their own head */
(function(){var el=null;function up(){try{if(!loaded||!S||!S.created){if(el)el.hidden=true;return}
    if(!el){el=document.createElement("div");el.id="zxcoins";el.className="coinpill zx-coins";el.setAttribute("aria-hidden","true");document.body.appendChild(el)}
    var show=window.scrollY>140&&!document.querySelector("#layer .modal");el.hidden=!show;if(show)el.innerHTML='<i class="coin"></i>'+Math.floor(S.coins||0).toLocaleString()}catch(e){}}
  window.addEventListener("scroll",up,{passive:true});setInterval(up,1500)})();
(function(){if(document.getElementById("qb-zx-css"))return;var st=document.createElement("style");st.id="qb-zx-css";
  st.textContent=".vline{font-size:11px;line-height:1.2;opacity:.72;text-align:left;padding:2px 2px 6px;letter-spacing:.02em}"
    /* The Loft lag: the door glow on the floor (.prtG, 26_world.js) pulsed its opacity, and any change inside a room's picture makes
       Safari repaint the whole picture. In the Bedroom window (WebKit on a Mac) that was 19 fps; still, 55. It glows steadily now,
       at the middle of its old pulse. */
    +".prtG{animation:none!important;opacity:.6}"
    /* the same for the room screens' moving parts (24_screens.js: the TV game's hills, coins, jump and stars, scrolling text, the
       equaliser): they ticked 6-7 times a second each, every tick a repaint of the room. They stand still as with reduced motion;
       the screens still change page every 4 seconds (.scrS). Bedroom window in WebKit: 50 to 60 fps. */
    +".scrT,.scrU,.scrL,.scrL2,.scrJ,.scrE,.scrB{animation:none!important}.scrB{opacity:.6}"
    /* Cal ("Yes, keep it smooth"): the Club's light beams (.cbb, 27b_skins.js) pulsed the same way, the Club's whole cost (WebKit 37 to
       60 fps); they shine steadily at their drawn strength */
    +".cbb{animation:none!important;opacity:.16}"
    /* the window's head (title, coins) stays at the top of the window while its list scrolls */
    +"#layer .modal .rm-head{position:sticky;top:0;z-index:8;background:var(--surface,#1b1411);padding-top:6px;padding-bottom:6px;margin-top:-6px}"
    +".zx-coins{position:fixed;top:calc(env(safe-area-inset-top,0px) + 8px);right:10px;z-index:60;box-shadow:0 6px 16px -6px rgba(0,0,0,.7)}.zx-coins[hidden]{display:none}"
    +".exswap{margin-left:auto;margin-right:6px;padding:4px 10px;border-radius:999px;border:1px solid var(--line);background:transparent;color:var(--muted);font:700 11px/1 var(--font-body,system-ui);cursor:pointer}.zx-own{display:flex;gap:8px;margin:10px 0}.zx-own input{flex:1;min-width:0;border-radius:10px;border:1px solid var(--line);background:var(--surface2);color:var(--fg);font:inherit;padding:10px}.zx-orig{margin:0 0 10px}.zx-list{display:grid;grid-template-columns:1fr 1fr;gap:6px;max-height:46vh;overflow:auto;margin-bottom:10px}.zx-pick{display:flex;flex-direction:column;align-items:flex-start;gap:2px;padding:10px;border-radius:10px;border:1px solid var(--line);background:var(--surface2,transparent);color:var(--fg);text-align:left;cursor:pointer}.zx-pick small{opacity:.65;text-transform:capitalize}.xd-own{display:grid;place-items:center;color:var(--accent)}.xd-own svg{width:46%;height:46%}"
    +".zx-next{display:flex;align-items:center;gap:10px;width:100%;box-sizing:border-box;margin:8px 0 12px;padding:10px 14px;border-radius:12px;border:1px solid var(--line);background:var(--surface);color:var(--fg);font:inherit;text-align:left}.zx-next .label{flex:none}.zx-next span:nth-child(2){flex:1;font-size:14px;line-height:1.3}.zx-next b{flex:none;color:var(--accent);font-size:13px}button.zx-next{cursor:pointer}"
    +".sq-stage.has-art{background-position:center top}"
    +"html.qb-switch #app{visibility:hidden}html.qb-sync body *{pointer-events:none!important}"
    +".zx-tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(96px,1fr));gap:8px}.zx-tile{display:flex;flex-direction:column;align-items:center;gap:4px;padding:12px 6px;border-radius:12px;border:1px solid var(--line);background:var(--surface2,transparent);color:var(--fg);cursor:pointer;text-align:center}.zx-tile{position:relative}.zx-tile svg{width:28px;height:28px;flex:none}.zx-me .btn,.avbtn{position:relative}.zx-tile b{font-size:13px}.zx-tile small{font-size:11px;opacity:.7;line-height:1.2}"
    +".zx-back{display:inline-flex;align-items:center;gap:4px;margin:4px 0 10px;padding:8px 14px;border-radius:999px;border:1px solid var(--line);background:var(--surface);color:var(--fg);font:700 13px/1 var(--font-body,system-ui);cursor:pointer}.zx-me{display:flex;gap:8px;margin:0 0 12px}"
    +".bty .chip.done{color:var(--done,#5ee08a);border-color:currentColor}";
  (document.head||document.documentElement).appendChild(st)})();
/* Town's first open took 2.8 s on Cal's phone (v0.97 speed log), the Players tab 1.7 s, later opens about 0.1 s; a Mac never shows it.
   The owner's speed log now says how long building a tab's page took when it was over 150 ms, so the next log tells the page's code
   apart from the drawing and the art after it ("tap" is the whole wait, "build" this part). */
var ZXVB={},zxViewHtml=viewHtml;viewHtml=function(v){var t0=performance.now(),h=zxViewHtml.apply(this,arguments),ms=performance.now()-t0;
  var n=ZXVB[v]=(ZXVB[v]||0)+1;/* the first three builds of each tab, so a slow Loft cannot push the rest out of the 40-line log */
  if(ms>150&&n<=3)try{if(!db||!ownerView||window.__qbGuest)return h;QBPL.push({why:"build",v:v,n:n,ms:Math.round(ms),t:Date.now()});qbPerfSave()}catch(e){}return h};
/* The Loft on Cal's phone after v0.98: the building view still near 25 fps (2,900 elements, people walking), while a Mac holds 60 with
   everything on. Two suspects the Mac cannot tell apart: pan/zoom rewrites the whole picture's transform on every drag frame, and the
   people redraw 15 times a second over the rooms. The owner's speed log counts both in each 5 s sample (29_prices.js), so the next
   log says which one to fix. Nothing on screen changes. */
var zxApplyNow=lfApplyNow;lfApplyNow=function(){QBPX.pan++;return zxApplyNow.apply(this,arguments)};
var zxLoop=lfLoop;lfLoop=function(ts){var t0=performance.now();try{return zxLoop.apply(this,arguments)}finally{QBPX.js+=performance.now()-t0;QBPX.runs++}};
/* Cal (2026-11-14): "the room view with all the different rooms is the laggiest. Can we just make that room not zoomable? Just position
   the screen so the rooms fill the whole screen all together. The characters move around in the multiple room view just fine."
   Inside a building the view is fixed: it is fitted once (lfInitView, every room in sight, as it always opened) and stays there; a drag,
   a pinch, the wheel or the zoom buttons change nothing, and the picture is not rewritten while a finger moves (every pan/zoom frame
   repainted the whole building on a phone). It refits when the screen changes size. The street view still pans and zooms. */
var ZXFIT=null,ZXFITTING=0,ZXAPK="",ZXAPE=null;
/* "so the rooms fill the whole screen all together": the fit is the box around this building's built rooms (and its open lots), not
   the whole building plot (1,800 wide, which left the rooms small at the bottom), scaled into the space between the top buttons and the
   tab bar. Rooms draw a little past their cells, mostly to the right, so the box has a margin. */
function zxFitB(c){try{var L=window.LFLAY;if(!c||!L||!L.b||!L.b[LFBSEL])return false;var x0=1e9,y0=1e9,x1=-1e9,y1=-1e9,n=0,add=function(t){var q=cellRect(t,L);n++;
    x0=Math.min(x0,q.x);y0=Math.min(y0,q.y);x1=Math.max(x1,q.x+LFCELLW);y1=Math.max(y1,q.y+LFFP)};
  S.base.slots.forEach(function(r){if(r&&ROOMCELL[r.t]&&ROOMCELL[r.t][0]===LFBSEL)add(r.t)});
  /* an open lot is drawn on the street under its cell (26_world.js: a 140 box at the street line), not in the cell */
  try{var gb=LFROOF+L.rows*LFFP;lotsOpen().forEach(function(k){if(!ROOMCELL[k]||ROOMCELL[k][0]!==LFBSEL)return;var p=cellXY(k,L);n++;
    x0=Math.min(x0,p.x-70);x1=Math.max(x1,p.x+70);y0=Math.min(y0,gb-104);y1=Math.max(y1,gb+36)})}catch(e){}
  if(!n)return false;var wr=c.getBoundingClientRect(),cw=c.clientWidth,top=0,bot=c.clientHeight;
  c.querySelectorAll(".lfhud,.lfbtop,.glnext,.lfwxb").forEach(function(e){var r=e.getBoundingClientRect();if(r.height&&r.top-wr.top<c.clientHeight*.5)top=Math.max(top,r.bottom-wr.top)});
  var nv=document.querySelector(".nav");if(nv){var nr=nv.getBoundingClientRect();if(nr.height&&nr.top>wr.top+c.clientHeight*.5)bot=Math.min(bot,nr.top-wr.top)}
  var hn=c.querySelector(".lfhint");if(hn){var hr=hn.getBoundingClientRect();if(hr.height&&hr.top>wr.top+c.clientHeight*.5)bot=Math.min(bot,hr.top-wr.top)}
  top+=10;bot-=6;var w=x1-x0,h=y1-y0;x0-=w*.03;x1+=w*.08;y0-=h*.04;y1+=h*.02;
  var sc=Math.min(1.4,(cw-16)/(x1-x0),(bot-top)/(y1-y0));if(!(sc>0))return false;
  LFV.s=LFV.s0=sc;LFV.x=cw/2-(x0+x1)/2*sc;LFV.y=(top+bot)/2-(y0+y1)/2*sc;LFV.init=1;return true}catch(e){return false}}
var zxInitView=lfInitView;lfInitView=function(c){ZXFITTING=1;try{var r=zxInitView.apply(this,arguments);if(LFBSEL!=null&&zxFitB(c))lfApplyNow();return r}finally{ZXFITTING=0;
  if(LFBSEL!=null&&c)ZXFIT={b:LFBSEL,x:LFV.x,y:LFV.y,s:LFV.s,w:c.clientWidth,h:c.clientHeight}}};
var zxApplyLock=lfApplyNow;lfApplyNow=function(){var c=document.getElementById("lfwrap"),inB=LFBSEL!=null;
  if(c&&c.hasAttribute("data-zxlock")!==inB){if(inB)c.setAttribute("data-zxlock","1");else c.removeAttribute("data-zxlock")}
  if(inB&&c&&!ZXFITTING){if(!ZXFIT||ZXFIT.b!==LFBSEL||ZXFIT.w!==c.clientWidth||Math.abs(ZXFIT.h-c.clientHeight)>=60){LFV.init=0;lfInitView(c);return}
    LFV.x=ZXFIT.x;LFV.y=ZXFIT.y;LFV.s=ZXFIT.s}
  /* skip only when nothing changed on the same picture: a redraw makes a new #lfw, which must get the view (QA on bf09ce0: Kode Plaza
     redrawn after its fit kept the new picture's default framing, a close-up nowhere near its rooms) */
  var we=document.getElementById("lfw"),k=LFBSEL+":"+LFV.x.toFixed(1)+","+LFV.y.toFixed(1)+","+LFV.s.toFixed(3);if(inB&&k===ZXAPK&&we===ZXAPE&&!ZXFITTING)return;ZXAPK=k;ZXAPE=we;
  return zxApplyLock.apply(this,arguments)};
(function(){var st=document.createElement("style");st.textContent="#lfwrap[data-zxlock] .lfctl [data-act=lfz]{display:none}#lfwrap[data-zxlock]{cursor:default}#lfwrap[data-zxlock] .lfhint{font-size:0}#lfwrap[data-zxlock] .lfhint::after{content:\"Tap a room\";font-size:10px}";(document.head||document.documentElement).appendChild(st)})();
/* Cal (via ROOMS, 2026-11-14): "randomize the brand drops so it is not sequential. I want to be surprised by what brands are coming on
   what day." Each Shop floor's calendar (29l_drops.js) took its brands in BRANDS order. The calendar is the same for every player and
   has run since DROPS.cal0, so the drops before DROPS.shuf0 stay as they were (they already happened, and players saw them). From
   shuf0 on, each floor takes the brands it has not dropped yet this round in a shuffled order, then every later round in a new
   shuffled order: one fixed seed in the code, so every phone gets the same surprise and a reload never reshuffles. A brand never
   drops again while it is still live (the rule dropPlan used). The Shop never names the next brand ("New brand in ..."). */
DROPS.shuf0="2026-11-16";
/* Brands held back from the drops while their art is redone (Cal approved ROOMS's streetwear audit, 2026-11-14: GACHA POP, SAVE POINT,
   BARD & BLADE, KAIMANA and OAKMONT get new names and pieces; ALTITUDE, SOLVBERG and NICE COCK lose most of theirs). Each hold has a
   start and, once the new art is in, an end date: a slot dated inside it skips those brands, so lifting a hold never changes a drop
   that already happened. */
DROPS.hold=[{from:"2026-11-16",until:"",ids:["gp","sp","bb","km","oak","alt","sv","nc"]},
  /* KODE PINK's repaint (Night drive) waits on Cal's approval; the repo still has the old art (ROOMS, 2026-11-14) */
  {from:"2026-11-16",until:"",ids:["kp"]}];
/* Pieces cut in the audit (Cal approved, with his keeps): off sale everywhere (the Shop, brand pages and splashes, sales, chest and crawl
   rolls), while anyone who owns one keeps wearing it. Every place that offers a piece asks itemFits, and so does the wardrobe for owned
   ones, so a cut piece "fits" only its owner. The rest of the cut list follows as ROOMS sends it. */
var ZXCUT=["gx_o_beanie","gx_o_camp","gx_o_slides","gx_smk_vest","gx_smk_cloak"];
SHOP.forEach(function(it){if(it&&it[6]&&ZXCUT.indexOf(it[0])>=0)it[6].cut=1});
var zxFits=itemFits;itemFits=function(it){if(it&&it[6]&&it[6].cut&&!(S&&S.owned&&S.owned[it[0]]))return false;return zxFits.apply(this,arguments)};
/* the brand racks pick by brand only (15_shop.js qsGroups), so they get the same rule */
var zxQsGroups=qsGroups;qsGroups=function(pick){return zxQsGroups.call(this,function(x){if(x&&x[6]&&x[6].cut&&!(S&&S.owned&&S.owned[x[0]]))return false;return pick(x)})};
function zxHeld(id,ymd){return (DROPS.hold||[]).some(function(h){return h.ids.indexOf(id)>=0&&ymd>=h.from&&(!h.until||ymd<h.until)})}
var ZXSH={};
function zxShufJ0(F){var x0=ymdN(DROPS.cal0),t=ymdN(DROPS.shuf0),j=1;for(var x=x0+1;x<t;x++)if(flIsDrop(F,x,x0))j++;return Math.max(1,j)}
/* the floor's drop days: slot 0 is cal0, then each of its drop days (as dropFloor counts them) */
function zxSlotDays(F,n){var x0=ymdN(DROPS.cal0),out=[DROPS.cal0];for(var x=x0+1;out.length<=n&&x<x0+4000;x++)if(flIsDrop(F,x,x0))out.push(ymdOfN(x));return out}
/* slot by slot from shuf0: the brand gone longest without dropping, never one still live or held that day; brands never dropped first,
   in a fixed-seed order (the same on every phone, never reshuffled), so it stays a surprise and every brand gets its turn */
function zxShufOrd(F,ids,upto){var lv=F.live||DROPS.live,k=F.id+"|"+ids.join(",")+"|"+lv+"|"+DROPS.shuf0+"|"+DROPS.seed+"|"+JSON.stringify(DROPS.hold||[]),c=ZXSH[k];
  if(!c){var j0=zxShufJ0(F),ord=[];for(var j=0;j<j0;j++)ord.push(ids[j%ids.length]);c=ZXSH[k]={ord:ord,days:[]}}
  var ord=c.ord;if(c.days.length<=upto+1)c.days=zxSlotDays(F,upto+40);
  var key=function(id){return dropHash(DROPS.seed+"|shuf|"+F.id+"|"+id)};
  while(ord.length<=upto){var at=ord.length,day=c.days[at]||"9999",last={};ord.forEach(function(id,i){last[id]=i});
    var free=ids.filter(function(id){return !zxHeld(id,day)}),ok=free.filter(function(id){return last[id]==null||at-last[id]>lv});
    if(!ok.length)ok=free.length?free:ids;
    ok.sort(function(x,y){var lx=last[x]==null?-1:last[x],ly=last[y]==null?-1:last[y];return lx-ly||key(x)-key(y)});ord.push(ok[0])}
  return ord[upto]}
var zxFlOrder=flOrderAt;flOrderAt=function(F,ids,j){try{if(!ids||!ids.length||(F.id==="street"&&DROPS.on)||ids.length<2)return zxFlOrder.apply(this,arguments);
  if(j<zxShufJ0(F))return zxFlOrder.apply(this,arguments);if(!DROPS.rerun&&j>=ids.length)return null;return zxShufOrd(F,ids,j)}catch(e){return zxFlOrder.apply(this,arguments)}};
/* Cal (via ROOMS, 2026-11-14): "generate additional animations for all the visiting characters in the game. I want every visitor to
   have 6 different animations." Six two-key clips in data/poses.json (bone rotations, no new art): wave, laugh, dance, chat, cheer
   and clap ("phone" would need a phone painted; clap stands in). Visitors (role visitor: friends, player visits, social visits; and
   crew with a team tag: team members tm: and rescued allies al:) play the next of their six (3.2 s) when they stand still, at most one every 9 s, starting at a point set by their id, so over a visit they go through all six. Business staff and guests, your character and the dogs are unchanged. Zoomed out, lfRigState still shows a
   single frame of it (one picture per outfit and animation, as it does for breathing). */
var ZXEMO=["wave","laugh","dance","chat","cheer","clap"];
function zxAgH(a){return dropHash(String(a.id||""))}
var zxRS0=lfRigState0;lfRigState0=function(a){var r=zxRS0.apply(this,arguments);
  try{if(!r||r.clip!=="idle"||!(a.role==="visitor"||(a.role==="crew"&&a.tm))||a.leaving||a.alpha<1||!QBLoft.clips||!QBLoft.clips.wave)return r;
    var now=performance.now(),st=a._zxe||(a._zxe={t:now-zxAgH(a)%9000,n:zxAgH(a)%ZXEMO.length});
    if(now-st.t>=9000){st.t=now;st.n=(st.n+1)%ZXEMO.length}else if(now-st.t>3200)return r;
    var em=ZXEMO[st.n];return {ch:r.ch,clip:em,f:QBLoft.clipFrame(em,now)}}catch(e){return r}};
/* ---------- First steps (Cal, 2026-11-14: "Add a first-steps list") ----------
   His girlfriend found the game "too complicated"; the tours explain each feature once, but nothing said what to do next. A short card on
   the Board, above the task box: the first things to do, each ticked off by itself when it is done, +50 coins each, and a "Show me" on
   the next one that rings where to tap (the tour ring). Only steps whose feature is open show; a step for something still locked shows
   up once it opens. When every step is done the card is gone for good, with a last +100.
   A save from before this (S.fsd unset): what it has already done counts as done, without coins, so a long-time player sees only what
   is new to them, or no card at all. S.fsd {id:1} and S.fsall are new save fields; merge() keeps unknown fields. */
var ZXFS=[
  {id:"add",t:"Add today's tasks",x:"Type what you need to do, messy is fine, then tap Add.",open:function(){return true},
    done:function(){return (+S.total||0)>0||(S.quests||[]).some(function(q){return q&&q.rep!=="weekly4"&&!q.bty})},show:[{sel:"#cap",t:"Add today's tasks",x:"Type what you need to do today, messy is fine, then tap Add."}]},
  {id:"tick",t:"Finish one and tick it",x:"Did it in real life? Tap it. XP and coins.",open:function(){return true},
    done:function(){return (+S.total||0)>0},show:[{sel:".q .qmain",t:"Tick it off",x:"Done it for real? Tap the quest to tick it. That pays XP and coins."}]},
  {id:"loft",t:"Open The Loft",x:"Your own place, built with your coins.",open:function(){return tourAreaOpen("hideout")},
    done:function(){return !!(S.fsd&&S.fsd.loftSeen)},show:[{sel:'.nav button[data-v="hideout"]',t:"Open The Loft",x:"Tap here.",tap:1}]},
  {id:"buy",t:"Buy your first upgrade",x:"Tap the Bedroom and pick one you can afford.",open:function(){return tourAreaOpen("hideout")},
    /* only a real upgrade of that room counts (QA on b3f7e4d: the Loft writes bookkeeping keys like __m35 into every Bedroom) */
    done:function(){return (S.base&&S.base.slots||[]).some(function(r){if(!r||!r.a)return false;var ids={};(ADDONS[r.t]||[]).forEach(function(u){ids[u[0]]=1});
      return Object.keys(r.a).some(function(k){return r.a[k]&&k.indexOf("__")!==0&&ids[k]})})},
    /* QA (21f7188): the Loft tab can open on the street, where no Bedroom is: the steps follow the player, each skipped once they
       are past it (the tab, then their home building, then the Bedroom, then a Buy their coins cover, in the room's window) */
    show:function(){var H=(ROOMCELL.bedroom||[0])[0],bi=-1;(S.base&&S.base.slots||[]).forEach(function(r,k){if(r&&r.t==="bedroom"&&bi<0)bi=k});
      var win=function(){return !!document.querySelector("#layer .rmodal")};
      return [{sel:'.nav button[data-v="hideout"]',t:"Your first upgrade",x:"Open The Loft: tap here.",tap:1,skip:function(){return view==="hideout"||win()}},
        {sel:'[data-act="bldgo"][data-v="'+H+'"]',t:"Tap your home",x:"Your rooms are inside. Tap the building.",tap:1,skip:function(){return (view==="hideout"&&LFBSEL===H)||win()}},
        {sel:'#lfsvg .lfroom[data-i="'+bi+'"] .lfitems',t:"Tap the Bedroom",x:"Tap your Bedroom to see its upgrades.",tap:1,skip:win},
        {sel:'#layer .rmodal [data-act="raddon"]:not([disabled])',t:"Buy one",x:"Tap Buy on an upgrade your coins cover. Each makes the room nicer.",modal:1,tap:1}]}},
  {id:"town",t:"Visit Town",x:"See what everyone playing is up to.",open:function(){return tourAreaOpen("hall")},
    done:function(){return !!(S.fsd&&S.fsd.townSeen)},show:[{sel:'.nav button[data-v="hall"]',t:"Visit Town",x:"Tap here.",tap:1}]},
  {id:"shop",t:"Buy something to wear",x:"New brands drop every Monday and Friday.",open:function(){return tourAreaOpen("shop")},
    /* QA's review: a new character owns the creator's basics, which ticked this at once; only a brand's piece counts */
    done:function(){return !!S.owned&&SHOP.some(function(it){var b=it&&it[6]&&it[6].b;return b&&b!=="basics"&&S.owned[it[0]]})},show:[{sel:'.nav button[data-v="shop"]',t:"The Shop",x:"Tap here, then buy a piece you like.",tap:1}]}
];
function zxFsCheck(){try{if(!loaded||!S||!S.created||S.fsall)return;try{tourInit()}catch(e){}if(S.calm===undefined)return;
    /* fresh: a character made on the calm-week version (S.calm is an object), whose every step pays; else a save from before */
    var fresh=typeof S.calm==="object"&&!!S.calm,first=!S.fsd||typeof S.fsd!=="object";if(first)S.fsd={};var d=S.fsd,got=0,ch=first,pay=fresh||!first;
    /* a save from before has been to the areas it has open (tourInit counts them as toured too) */
    if(first&&!fresh){if(tourAreaOpen("hideout"))d.loftSeen=1;if(tourAreaOpen("hall"))d.townSeen=1}
    /* QA's review: level-18 and level-60 saves got a beginners' card; a save from before at level 15 or more is past first steps */
    if(first&&!fresh&&effLvl()>=15){S.fsall=1;persist();return}
    if(view==="hideout"&&!d.loftSeen){d.loftSeen=1;ch=1}if(view==="hall"&&!d.townSeen){d.townSeen=1;ch=1}
    ZXFS.forEach(function(st){if(d[st.id])return;var ok=false;try{ok=st.done()}catch(e){}if(!ok)return;d[st.id]=1;ch=1;if(pay)got+=50});
    /* what a save from before had already done is not listed again (it still counts): no wall of ticked lines for a long-time player */
    if(first&&!fresh){d.pre={};ZXFS.forEach(function(st){if(d[st.id])d.pre[st.id]=1})}
    var all=ZXFS.every(function(st){return d[st.id]});if(all&&!S.fsall){S.fsall=1;if(pay)got+=100;ch=1}
    if(got){S.coins+=got;S.earnedC=(S.earnedC||0)+got;d.coins=(d.coins||0)+got;setTimeout(function(){try{pop(all?"First steps done! +"+got+" coins":"First step done: +"+got+" coins")}catch(e){}},900)}
    if(ch)persist()}catch(e){}}
function zxFsHtml(){try{if(!S||!S.created||S.fsall||!S.fsd)return "";var d=S.fsd,list=ZXFS.filter(function(st){return d[st.id]||st.open()}),todo=list.filter(function(st){return !d[st.id]});
    if(!todo.length)return "";var nx=todo[0],n=list.length-todo.length,pre=d.pre||{},shown=list.filter(function(st){return !pre[st.id]});
    return '<section class="card zx-fs"><div class="zx-fs-h"><b>First steps</b><span class="mono">'+n+' of '+list.length+' &middot; +50 coins each</span></div><ol>'
      +shown.map(function(st){var ok=!!d[st.id];return '<li class="'+(ok?"ok":st===nx?"nx":"")+'"><i aria-hidden="true">'+(ok?"&#10003;":"")+'</i><span><b>'+esc(st.t)+'</b>'+(st===nx?'<small>'+esc(st.x)+'</small>':'')+'</span>'
        +(st===nx?'<button type="button" class="btn sm" data-act="zxfsshow" data-k="'+st.id+'">Show me</button>':'')+'</li>'}).join("")+'</ol></section>'}catch(e){return ""}}
var zxFsBoardLine=boardLine;boardLine=function(){var h=zxFsBoardLine.apply(this,arguments);return h+zxFsHtml()};
var zxFsRender=render;render=function(){zxFsCheck();return zxFsRender.apply(this,arguments)};
/* a tick or a purchase does not always redraw the Board at once: check every few seconds too (cheap: a few field reads) */
setInterval(function(){try{if(!S||S.fsall)return;var before=JSON.stringify(S.fsd||{});zxFsCheck();if(view==="board"&&JSON.stringify(S.fsd||{})!==before)render()}catch(e){}},3000);
/* "Show me": the tour ring, as a one-off tour of the step's targets (it ends on its own; the step stays until it is really done) */
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=zxfsshow]");if(!b)return;e.preventDefault();
  /* a tour already running (a feature's own) gives way: the player asked for this one */
  var st=ZXFS.filter(function(x){return x.id===b.dataset.k})[0];if(!st)return;if(TOUR.id)tourEnd();var id="fs_"+st.id+"_"+Date.now();
  var steps=(typeof st.show==="function"?st.show():st.show).map(function(s){return Object.assign({},s)});
  TOURS.push({id:id,ready:function(){return false},steps:steps});TOUR.id=id;TOUR.i=0;TOUR.miss=0;TOUR.t=Date.now();zxFsSkip();tourDraw(1)});
/* a first-steps tour moves past any step the player is already beyond (skip()), without waiting on the tour's own timeout */
function zxFsSkip(){try{for(var n=0;n<6&&TOUR.id&&String(TOUR.id).indexOf("fs_")===0;n++){var s=tourStep();if(!(s&&s.skip&&s.skip()))break;tourNext()}
  /* and its ring comes back as soon as a window in the way closes (the Loft's own first-visit window), not on the tours' 1.2 s tick */
  if(TOUR.id&&String(TOUR.id).indexOf("fs_")===0){var st=tourStep(),r=document.getElementById("qbtour");if(st&&(st.modal||!document.querySelector("#layer .modal"))&&(!r||r.style.visibility==="hidden"))tourDraw(0)}}catch(e){}}
setInterval(zxFsSkip,400);
(function(){var st=document.createElement("style");st.textContent=".zx-fs{padding:12px 14px}.zx-fs-h{display:flex;justify-content:space-between;align-items:baseline;gap:8px;margin-bottom:6px}.zx-fs-h span{font-size:11px;opacity:.7}"
  +".zx-fs ol{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}.zx-fs li{display:flex;align-items:center;gap:10px;min-height:30px}"
  +".zx-fs li i{flex:none;width:20px;height:20px;border-radius:50%;border:2px solid var(--line);display:grid;place-items:center;font-style:normal;font-size:12px}"
  +".zx-fs li.ok i{background:var(--done,#5ee08a);border-color:var(--done,#5ee08a);color:#10241a}.zx-fs li.ok b{opacity:.55;text-decoration:line-through}"
  +".zx-fs li span{flex:1;display:flex;flex-direction:column;min-width:0}.zx-fs li small{opacity:.75;font-size:12px;line-height:1.3}.zx-fs li.nx b{color:var(--accent,inherit)}.zx-fs .btn.sm{flex:none}";
  (document.head||document.documentElement).appendChild(st)})();
/* ---------- the Daily Quest counts effort (Cal, 2026-11-14) ----------
   Cal: "I am filling my daily quest meter really fast because I post a LOT on my to do list. Such as washing dishes, sending an email,
   helping someone at work, even trivial things like taking out the trash or making the bed or eating breakfast. I am consistently hitting
   the secret hidden daily quest goal. Maybe there needs to be rebalancing for this?" His 100 / 200 / 300 marks stay. What fills the bar
   changes: each task's own XP (its effort score, 5 for under five minutes up to 100 for a day), not the XP after bonuses (rested, combos,
   crits, class, relics still pay in full toward your level and coins), and quick tasks count part of it (ECON.dqW: 5 XP counts 60%,
   10 XP 80%, 25 and up in full; training as before). A heavy day of 30 small tasks lands near the 200 chest; the hidden chest takes
   real effort (a workout, a big task). The town's efficiency reads the same number. */
ECON.dqW={5:.6,10:.8};
function zxDqW(b){/* QA's review: a new player's 3 ordinary tasks made 45 of 100; in the first week (the calm week) every task counts in full */
  try{if(calmOn()&&calmDay()<=7)return 1}catch(e){}var W=ECON.dqW||{},k=Object.keys(W).map(Number).sort(function(a,c){return a-c});for(var i=0;i<k.length;i++)if(b<=k[i])return W[k[i]];return 1}
/* XP toward the Daily Quest for each quest done today: [counted, as paid] */
/* QA (v1.01): "Clear completed" takes finished one-offs off the list while they stay in S.done, and the bar then counted them as paid
   (bonuses in). What each finished quest counts is remembered for the day (S.dq.cnt) while it is on the list, and used once it is gone. */
function zxDqParts(){var Q={},raw=0,cnt=0,d=dqState();if(!d.cnt||typeof d.cnt!=="object")d.cnt={};(S.quests||[]).forEach(function(q){if(q)Q[q.id]=q});
  Object.keys(S.done||{}).forEach(function(k){var v=+S.done[k]||0;if(!v)return;var q=Q[k],c;raw+=v;
    if(q){var b=+q.xp>0?Math.min(v,+q.xp):v;c=b*zxDqW(b);d.cnt[k]=c}else c=d.cnt[k]!=null?+d.cnt[k]:v*zxDqW(v);cnt+=c});
  Object.keys(d.cnt).forEach(function(k){if(!(S.done||{})[k])delete d.cnt[k]});return [cnt,raw]}
dqXp=function(){return Math.round(zxDqParts()[0])+(dqState().tx||0)};
try{if(window.__qbEcon)window.__qbEcon.xp=dqXp}catch(e){}/* QA: the test hook still read the old count */
var zxDqHtml=dqHtml;dqHtml=function(){var h=zxDqHtml.apply(this,arguments);try{var p=zxDqParts();if(h&&p[1]>p[0]+.5)h=h.replace('<div class="dq-row">','<p class="note dq-eff">Quick tasks and bonus XP count a little less here; bigger tasks and workouts fill it fastest.</p><div class="dq-row">')}catch(e){}return h};
/* QA's review (2026-11-14): after "Claim 3,000 coins" the letter stayed open on "3,000 coins claimed" and the player had to find the X;
   it closes itself a moment after the coins land. And the reward toasts sat on the tab bar: they show above it. */
var zxIbClaim=ibClaim;ibClaim=function(){var r=zxIbClaim.apply(this,arguments);setTimeout(function(){try{if(document.querySelector("#layer .modal .ibgot"))closeModals()}catch(e){}},1500);return r};
(function(){var st=document.createElement("style");st.textContent=".pop{bottom:calc(98px + env(safe-area-inset-bottom,0px))}";(document.head||document.documentElement).appendChild(st)})();
