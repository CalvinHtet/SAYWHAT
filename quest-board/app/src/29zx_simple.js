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
