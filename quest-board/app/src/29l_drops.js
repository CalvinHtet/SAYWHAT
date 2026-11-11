/* ---------- the launch drop schedule (Cal, 2026-11-06) ----------
   "When this launches, I want 2 brands a week. Something that drops on Monday and something that drops on Thursday. And I want it
   to be random so that I'm surprised. But I want everybody's shop to remain synced." And earlier: "every person who plays this to
   have the same shop. So if I play in 5 weeks and my gf plays this week, I'll have the same shop as her but miss the first 3".
   How: one fixed seed ships in the code, so every phone shuffles the brands into the same order and dates them the same way: slot
   0 on the launch Monday, slot 1 that Thursday, slot 2 the next Monday, and so on, at midnight Pacific. HANGANG and NICE COCK keep
   the slots Cal gave them (1st and 5th drop). Only brands whose art is in the build (the BRANDS list) take part, and everyone runs
   the same published version, so everyone gets the same Shop. The 4 newest drops are for sale; older ones are in the vault.
   When the pool runs out, DROPS.rerun (Cal's call, asked 2026-11-06) either reshuffles the vault with the next seed, still
   synced, or leaves it gone for good. Off until launch (DROPS.on): today's one-a-week dates stay as they are. */
var DROPS={on:false,launch:"2026-12-07",seed:"quest-board drops 1",fixed:{hanga:0,nc:4},live:4,rerun:true};
function dropHash(s){var h=2166136261;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function dropRand(seed){var a=dropHash(seed);return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296}}
function dropShuffle(list,seed){var a=list.slice(),r=dropRand(seed);for(var i=a.length-1;i>0;i--){var j=Math.floor(r()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
/* slot k: week floor(k/2) after launch, Monday for even k, Thursday for odd */
function dropSlotDate(k){var p=DROPS.launch.split("-").map(Number),d=new Date(Date.UTC(p[0],p[1]-1,p[2]+Math.floor(k/2)*7+(k%2?3:0)));
  return d.toISOString().slice(0,10)}
/* the whole order, round by round: round 0 is every brand once; later rounds rerun them in a new order (if DROPS.rerun) */
function dropPlan(rounds){var ids=BRANDS.map(function(b){return b.id}),fx=DROPS.fixed,n=ids.length,out=[];
  for(var r=0;r<(rounds||1);r++){
    var rest=dropShuffle(ids.filter(function(id){return r>0||fx[id]==null}),DROPS.seed+"|"+r),row=new Array(n);
    /* QA: a rerun round must not repeat the slot before it or "drop" a brand still among the live ones: the brands from the
       previous round's last DROPS.live slots go to the end of this round, everything else keeps its shuffled order */
    /* QA (12 rounds): pushing only the last round's tail back still let still-live reruns through. Each slot now takes the first
       brand in this round's shuffle whose last drop is more than DROPS.live slots back (else the one dropped longest ago) */
    if(r>0){var last={};out.forEach(function(e){last[e.id]=e.slot});var pick=[],pool=rest.slice();
      for(var q=0;q<n;q++){var at=r*n+q,ok=pool.filter(function(id){return at-last[id]>DROPS.live})[0];
        if(!ok)ok=pool.slice().sort(function(x,y){return last[x]-last[y]})[0];pool.splice(pool.indexOf(ok),1);pick.push(ok);last[ok]=at}
      rest=pick}
    if(r===0)Object.keys(fx).forEach(function(id){if(ids.indexOf(id)>=0&&fx[id]<n)row[fx[id]]=id});
    for(var k=0;k<n;k++)if(!row[k])row[k]=rest.shift();
    row.forEach(function(id,k){out.push({id:id,slot:r*n+k,start:dropSlotDate(r*n+k)})})}
  return out}
/* one brand every DROPS.every days per player (dropMine below), so the cadence reads in days */
function dropCadence(){return "Mondays and Fridays at 8 am Pacific"}
/* the Shop at any moment n, for both modes: live (newest first-dropped last), the retired ones, and the next drop */
function dropAt(n){var byId={};BRANDS.forEach(function(b){byId[b.id]=b});
  if(!DROPS.on){var rel=BRANDS.filter(function(b){return ptMidnight(b.start)<=n});return {live:rel.slice(-3),vault:rel.slice(0,Math.max(0,rel.length-3)),next:BRANDS.filter(function(b){return ptMidnight(b.start)>n})[0]||null}}
  var plan=dropPlan(DROPS.rerun?12:1),rl=plan.filter(function(e){return ptMidnight(e.start)<=n}),nxE=plan.filter(function(e){return ptMidnight(e.start)>n})[0]||null;
  var seen={},live=[];for(var i=rl.length-1;i>=0&&live.length<DROPS.live;i--){var id=rl[i].id;if(!seen[id]){seen[id]=1;live.unshift(Object.assign({},byId[id],{start:rl[i].start}))}}
  var vault=[];for(var j=rl.length-1;j>=0;j--){var vid=rl[j].id;if(!seen[vid]){seen[vid]=1;vault.unshift(Object.assign({},byId[vid],{start:rl[j].start}))}}
  return {live:live,vault:vault,next:nxE?Object.assign({},byId[nxE.id],{start:nxE.start}):null}}
/* Cal, 2026-11-06: "Remove the vault and have it be random drops in the week that are different than the Monday and Thursday
   drops. Maybe Wednesday can be a vault." Every Wednesday at midnight Pacific one retired brand comes back for the week, picked
   from that Wednesday's date and the fixed seed, so every player gets the same one. There is no Vault list any more. */
function ptYmd(t){var f=new Intl.DateTimeFormat("en-CA",{timeZone:"America/Los_Angeles",year:"numeric",month:"2-digit",day:"2-digit",weekday:"short"}).formatToParts(new Date(t)),g=function(k){return (f.filter(function(q){return q.type===k})[0]||{}).value};
  return {ymd:g("year")+"-"+g("month")+"-"+g("day"),wd:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].indexOf(g("weekday"))}}
function dropWedOf(n){var p=ptYmd(n),back=(p.wd-3+7)%7,a=p.ymd.split("-").map(Number),d=new Date(Date.UTC(a[0],a[1]-1,a[2]-back));return d.toISOString().slice(0,10)}
function dropRaw(wd){var pool=dropAt(ptMidnight(wd)).vault;return pool.length?{pool:pool,i:dropHash(DROPS.seed+"|wed|"+wd)%pool.length}:null}
/* the brand back on Wednesday wd, never the same one two Wednesdays running (each week's real pick, remembered) */
var DROPWED={};
function dropPick(wd){var k=wd+"|"+DROPS.on+"|"+DROPS.rerun+"|"+BRANDS.length;if(k in DROPWED)return DROPWED[k];var r=dropRaw(wd),out=null;
  if(r){var pa=wd.split("-").map(Number),pw=new Date(Date.UTC(pa[0],pa[1]-1,pa[2]-7)).toISOString().slice(0,10),last=dropPick(pw),i=r.i;
    if(r.pool.length>1&&last&&r.pool[i].id===last.id)i=(i+1)%r.pool.length;out=r.pool[i]}
  return DROPWED[k]=out}
function dropBack(n){var wd=dropWedOf(n),b=dropPick(wd);if(!b)return null;
  var a=wd.split("-").map(Number),nx=new Date(Date.UTC(a[0],a[1]-1,a[2]+7)).toISOString().slice(0,10);
  return Object.assign({},b,{back:1,backFrom:wd,backUntil:nx})}
dropState=function(){var n=dropNow(),d=dropAt(n),bk=dropBack(n);
  if(bk&&!d.live.some(function(x){return x.id===bk.id}))d.live=[bk].concat(d.live);
  return {n:n,live:d.live,vault:[],next:d.next,back:bk}};
/* ---------- one Shop per player, one new brand every 3 days (Cal, 2026-11-09) ----------
   "There should only be one new clothing drop every 3 days. So this should only show Hangang splash screen as soon as we
   unlock the walk in closet." A player's Shop opens with their Walk-in Closet: S.shopDay is the Pacific date it first existed.
   That day it holds HANGANG only; then one more brand every DROPS.every days at midnight Pacific, in the same order for every
   player (the BRANDS order; the launch plan's order once DROPS.on). The DROPS.live newest are for sale, and once some have
   retired one of this player's own comes back on Wednesdays, as before. A save that had the Closet before this starts its
   schedule the day this first runs, and keeps the brands it already bought from (S.shopKeep) in its Shop: they count as out
   on day one, so the schedule skips them. dropAt above stays the shared calendar (the tester's review list). */
DROPS.every=3; /* no longer read: the cadence is DROPDAYS below (W20) */
/* ---------- Monday and Friday drops, a Wednesday vault (Cal, 2026-11-10: "change that to every Monday and Friday for the new drops.
   Wednesday is the wednesday vault where an old brand comes back to town. This only applies after some brands cycle out of rotation
   ... only 2 active brands at a time ... the wednesday vault would make it 3 active brands. And then other days of the week, the
   vault dissapears.") ----------
   Cal, later the same day: "Keep the shop drops the same for every character so that it is consistent. If I open the shop for the
   first time at week 4, there should be 2 drops already in the shop." So there is ONE calendar for everyone: HANGANG on DROPS.cal0
   (the release this ships in), alone until the next drop day, then the next brand in the shared order every Monday and Friday at
   8 am Pacific (DROPHOUR, the same moment for everyone). The DROPS.live (2) newest are for sale. On Wednesday, 8 am to Thursday
   8 am Pacific, one retired brand is back for everyone: the one out of the Shop longest, so every retired brand returns in turn
   (dropPick). A player whose Shop opens later sees what is live that day, and every live brand they have not seen gets its splash,
   oldest first, then the Wednesday one (brandCheck, 25_splash.js). Once all the brands have dropped the order starts over
   (DROPS.rerun). S.shopDay and S.shopKeep are still written by older code but no longer move the calendar; owned items stay owned.
   */
DROPS.live=2;
/* HANGANG's day: set it to the day the release with this calendar goes out, so HANGANG is alone at first for everyone */
DROPS.cal0="2026-11-10";
var DROPDAYS=[1,5],DROPHOUR=8;
/* W47, the vault rule (Cal, 2026-11-10: "The vault should appear after there are 6 shops total in rotation. With the 6th shop being the
   vault on wednesday", option (a) confirmed): no Wednesday vault until this many brands have dropped on the Street's calendar (HANGANG on
   cal0 is the first), the same day for every player. From then on the vault brand is in the Shop every Wednesday 8 am to Thursday 8 am */
DROPS.vaultAfter=6;
function ymdN(ymd){var a=String(ymd).split("-").map(Number);return Math.floor(Date.UTC(a[0],a[1]-1,a[2])/864e5)}
function ymdOfN(k){return new Date(k*864e5).toISOString().slice(0,10)}
function ymdWd(k){return (k+4)%7} /* 0 Sunday: day 0, 1970-01-01, was a Thursday */
/* the drop day a moment falls in (it turns at 8 am Pacific), and the moment a drop day starts */
function dropYmd(n){return ptYmd(n-DROPHOUR*36e5).ymd}
function dropStart(ymd){return ptMidnight(ymd)+DROPHOUR*36e5}
/* drop days (Mondays and Fridays) after from, up to and including to */
function dropCount(from,to){var a=ymdN(from),b=ymdN(to),c=0;if(!(b>a))return 0;DROPDAYS.forEach(function(w){c+=Math.floor((b+4-w)/7)-Math.floor((a+4-w)/7)});return c}
/* the dates of the drops 0..k: 0 is HANGANG's day, then each drop day after it */
function dropSlotDays(day,k){var out=[day],x=ymdN(day);while(out.length<=k){x++;if(DROPDAYS.indexOf(ymdWd(x))>=0)out.push(ymdOfN(x))}return out}
function ymdAdd(ymd,k){var a=ymd.split("-").map(Number);return new Date(Date.UTC(a[0],a[1]-1,a[2]+k)).toISOString().slice(0,10)}
function ymdDiff(a,b){var p=a.split("-").map(Number),q=b.split("-").map(Number);return Math.round((Date.UTC(q[0],q[1]-1,q[2])-Date.UTC(p[0],p[1]-1,p[2]))/864e5)}
/* the brand in place j of the order every player shares (null when the brands run out and DROPS.rerun is off) */
var DROPORD=null;
function dropOrderAt(j){var n=BRANDS.length;
  if(DROPS.on){var k=DROPS.seed+"|"+n+"|"+DROPS.rerun;if(!DROPORD||DROPORD.k!==k)DROPORD={k:k,p:dropPlan(DROPS.rerun?12:1)};var e=DROPORD.p[j];return e?e.id:null}
  return j<n||DROPS.rerun?BRANDS[j%n].id:null}
/* the day this player's Shop opened, written once, the first time the Closet is there */
function dropStamp(){try{if(S.shopDay||!loaded||!S.created||!hasRoom("closet"))return}catch(e){return}
  var ids=BRANDS.map(function(b){return b.id}),first=dropOrderAt(0),keep=[];
  SHOP.forEach(function(x){var b=x[6]&&x[6].b;if(b&&b!==first&&S.owned&&S.owned[x[0]]&&ids.indexOf(b)>=0&&keep.indexOf(b)<0)keep.push(b)});
  keep.sort(function(a,b){return ids.indexOf(a)-ids.indexOf(b)});
  S.shopDay=dropYmd(dropNow());if(keep.length)S.shopKeep=keep;
  /* a brand seen before this Shop opened, and not in it now, gets its splash and its "!" again when it drops here */
  var inShop={};keep.forEach(function(id){inShop[id]=1}); /* HANGANG too, so its splash shows when the Shop opens (Cal, 2026-11-10) */
  [S.brandSeen,S.alSeen&&S.alSeen.brand].forEach(function(o){if(o&&typeof o==="object")Object.keys(o).forEach(function(id){if(!inShop[id])delete o[id]})});
  persist()}
/* this player's Shop at moment n: live (oldest first), retired (vault, oldest first) and the next drop */
/* the Shop at moment n, the same for every player: live (oldest first), retired (vault, oldest first) and the next drop. Before
   cal0 (a test clock) HANGANG is already there. */
/* W42, the Shop's floors (ECON.floors): each floor has a calendar of its own, the same for every player. Slot 0 is cal0, then
   each of the floor's drop days; its brands (fl in BRANDS) drop in BRANDS order and start over when they run out. Every entry
   carries fl, its floor. */
function flGet(id){return (ECON.floors||[]).filter(function(F){return F.id===id})[0]||null}
function flBrands(F){return BRANDS.filter(function(b){return brandFloor(b.id)===F.id}).map(function(b){return b.id})}
function flIsDrop(F,x,x0){return (F.days||DROPDAYS).indexOf(ymdWd(x))>=0&&(!(F.every>1)||Math.floor((x-x0)/7)%F.every===0)}
function flOrderAt(F,ids,j){if(F.id==="street"&&DROPS.on)return dropOrderAt(j);return j<ids.length||DROPS.rerun?ids[j%ids.length]:null}
/* the floors this player has: one with brands, at or past its level (the Street with the Closet, as the Shop itself) */
/* named shopFloors: 10_app_a.js has its own floorsOpen() (the Loft's floors), and two declarations of one name in the joined closure means the later one replaces the other */
function shopFloors(){var L=0;try{L=effLvl()}catch(e){}return (ECON.floors||[]).filter(function(F){return flBrands(F).length&&(!(F.lv>0)||L>=F.lv)})}
function dropFloor(n,F){var byId={},ids=flBrands(F),lv=F.live||DROPS.live;BRANDS.forEach(function(b){byId[b.id]=b});
  if(!ids.length)return {live:[],vault:[],soon:[],next:null};
  var day=DROPS.cal0,x0=ymdN(day),t=ymdN(dropYmd(n)),days=[day],m=0,seq=[];
  for(var x=x0+1;days.length<m+4;x++)if(flIsDrop(F,x,x0)){days.push(ymdOfN(x));if(x<=t)m++}
  for(var j=0;j<days.length;j++){var id=flOrderAt(F,ids,j);if(id==null)break;seq.push(id)}
  var seen={},live=[],vault=[];
  /* a retired brand's left: the day its latest stint ended (the drop live slots after its own) */
  for(var i=Math.min(m,seq.length-1);i>=0;i--){var id2=seq[i];if(seen[id2])continue;seen[id2]=1;
    if(live.length<lv)live.unshift(Object.assign({},byId[id2],{start:days[i],fl:F.id}));else vault.unshift(Object.assign({},byId[id2],{start:days[i],left:days[i+lv],fl:F.id}))}
  var nx=seq[m+1],soon=[m+1,m+2,m+3].filter(function(k){return seq[k]&&days[k]}).map(function(k){return {id:seq[k],start:days[k],fl:F.id}});
  return {live:live,vault:vault,soon:soon,next:nx?Object.assign({},byId[nx],{start:days[m+1],fl:F.id}):null}}
/* the Street's calendar, under its old name */
function dropMine(n){return dropFloor(n,flGet("street")||{id:"street",days:DROPDAYS,live:DROPS.live})}
/* W47: how many brands the Street's calendar has dropped by drop day ymd, HANGANG's day counting as the first */
function dropsSoFar(ymd){var F=flGet("street")||{days:DROPDAYS},x0=ymdN(DROPS.cal0),t=ymdN(ymd),c=1;for(var x=x0+1;x<=t;x++)if(flIsDrop(F,x,x0))c++;return c}
/* QA's w-floors finding (the Boutique's 4 brands never came back): the vault picks only from floors with enough brands. A brand has to
   be gone 14 days and not drop again within 5 (dropPick below), so a floor takes part only when its brands are out of the Shop at least
   26 days between stints: (brands - live) x the days between its drops. The Street (12 brands, 2 live, 2 drops a week) is out 35 days;
   the Boutique today (4 brands, 2 live, weekly) only 14, so it joins once it has 6 brands. A floor that does not take part still has
   its own drops; the vault brand comes from the floors that do */
function flVaultOk(F){var n=flBrands(F).length,lv=F.live||DROPS.live,per=7*(F.every>1?F.every:1)/((F.days||DROPDAYS).length||1);return (n-lv)*per>=26}
/* the brand back on Wednesday wd: of the retired brands, the one out of the Shop longest, counted from the latest time it left (its
   latest stint ended, or its last Wednesday back). Only a brand gone at least 14 days; with none, no vault that Wednesday (QA,
   v0.89: "fewest returns first" brought HANGANG back after 2 days). Never a brand that drops again within 5 days. Of those, the
   one whose last Wednesday back is oldest (never back counts as oldest), then the one gone longest, so every brand gets its turn
   (QA, v0.90: "gone longest" alone kept picking the brand about to drop again, and 4 brands never came back).
   Worked out Wednesday by Wednesday from cal0, so every phone agrees (QA, rc-0.89: only 8 of 16 came back, OVERPASS 5 days after
   leaving, SAYMORE back on a Wednesday and dropping that Friday). One brand for the whole Shop, from the floors this player has
   (W42) that take part (flVaultOk), and only on Wednesdays after DROPS.vaultAfter brands have dropped (W47). */
dropPick=function(wd){var FO=shopFloors().filter(flVaultOk),k=wd+"|"+DROPS.vaultAfter+"|"+DROPS.on+"|"+DROPS.rerun+"|"+BRANDS.length+"|"+DROPS.live+"|"+DROPS.cal0+"|"+FO.map(function(F){return F.id}).join(",");if(k in DROPWED)return DROPWED[k];
  var x0=ymdN(DROPS.cal0),x1=ymdN(wd),back={},out=null;x0+=(3-ymdWd(x0)+7)%7;
  for(var x=x0;x<=x1;x+=7){var w=ymdOfN(x),m={vault:[],soon:[]},best=null,bs="",bl="",due={};if(dropsSoFar(w)<DROPS.vaultAfter)continue;
    FO.forEach(function(F){var d=dropFloor(dropStart(w),F);m.vault=m.vault.concat(d.vault);m.soon=m.soon.concat(d.soon||[])});
    (m.soon||[]).forEach(function(q){if(ymdN(q.start)-x<=5)due[q.id]=1});
    m.vault.forEach(function(b){if(due[b.id])return;var lr=back[b.id]||"",bk=lr?ymdAdd(lr,1):"",since=bk>(b.left||b.start)?bk:(b.left||b.start);
      if(x-ymdN(since)<14)return;if(!best||lr<bl||(lr===bl&&since<bs)){best=b;bs=since;bl=lr}});
    if(best)back[best.id]=w;if(x===x1)out=best}
  return DROPWED[k]=out};
/* Wednesday only: the vault brand, from 8 am Wednesday to 8 am Thursday Pacific */
dropBack=function(n){var t=dropYmd(n);if(ymdWd(ymdN(t))!==3)return null;var b=dropPick(t);return b?Object.assign({},b,{back:1,backFrom:t,backUntil:ymdAdd(t,1)}):null};
/* the Shop now: live is every open floor's brands (and the Wednesday one); floors holds each open floor's own live, soon and next */
dropState=function(){var n=dropNow();dropStamp();var FO=shopFloors(),fl={},live=[],bk=dropBack(n);
  FO.forEach(function(F){var d=dropFloor(n,F);fl[F.id]=d;live=live.concat(d.live)});
  if(bk&&!live.some(function(x){return x.id===bk.id})){live=[bk].concat(live);if(fl[bk.fl])fl[bk.fl].live=[bk].concat(fl[bk.fl].live)}
  return {n:n,live:live,vault:[],next:fl.street?fl.street.next:null,back:bk,floors:fl,open:FO.map(function(F){return F.id})}};
/* a floor opening (the Boutique at 30): one window, once, then its brands' splashes one at a time (brandCheck). A player already
   past its level gets it on their next load. S.floorSeen[id] is the day they saw it */
function floorFresh(){var o=S.floorSeen||{};return shopFloors().filter(function(F){return F.lv>0&&!o[F.id]})[0]||null}
function floorSplash(F){if(!S.floorSeen||typeof S.floorSeen!=="object")S.floorSeen={};S.floorSeen[F.id]=dropYmd(dropNow());persist();
  modal('<div class="card box2 flsplash"><span class="label">The Shop</span><h2>The '+esc(F.name)+' is open</h2><p class="note">A new floor in the Shop, with brands of its own. '+esc(F.line)+'.</p><div class="btns"><button class="btn" data-flgo="'+esc(F.id)+'">Have a look</button></div></div>')}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-flgo]");if(!b)return;closeModals();QSFLOOR=b.dataset.flgo;window._qsSeen=0;
  var nb=document.querySelector('.nav [data-v="shop"]');if(nb)nb.click();else{try{render()}catch(x){}}});
/* The splash used to wait for the next app start or tab change: now it comes as soon as the Closet is built or a brand drops,
   once nothing else is on screen and nobody is typing. brandCheck (25_splash.js) shows each brand once. */
setInterval(function(){try{if(!loaded||!S.created||document.hidden||areaGate("shop"))return;var a=document.activeElement;
  if(a&&/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName))return;if(document.querySelector("#layer .modal,.bsplash,.dropsplash,.modal.qbsv"))return;
  if(brandFresh().length||floorFresh())brandCheck()}catch(e){}},2500);
/* brandCheck is called from more than this timer: the floor's window always goes first, then its brands */
var flBrandBase=brandCheck;brandCheck=function(){var F=floorFresh();if(F){if(!document.querySelector("#layer .modal,.bsplash"))floorSplash(F);return}return flBrandBase.apply(this,arguments)};
/* test hook, removed at release with window.__qb */
window.__qbDrops={floor:function(id,t){return dropFloor(t==null?dropNow():t,flGet(id))},floors:shopFloors,count:dropCount,days:dropSlotDays,ymd:function(t){return dropYmd(t==null?dropNow():t)},start:dropStart,back:dropBack,wedOf:dropWedOf,at:dropAt,cfg:DROPS,plan:dropPlan,state:function(){return dropState()},slotDate:dropSlotDate,mine:function(t){return dropMine(t==null?dropNow():t)},order:dropOrderAt};
