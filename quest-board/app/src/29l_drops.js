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
   The Shop still opens with HANGANG alone the day the Walk-in Closet is built (S.shopDay). The next brand in the shared order drops
   on each Monday and Friday at 8 am Pacific (DROPHOUR, the same moment for everyone), the first one at least DROPWAIT days after the
   Closet. Only the DROPS.live (2) newest are for sale. On Wednesday, 8 am to Thursday 8 am Pacific, one retired brand is back: the one
   out of the Shop longest, so every retired brand returns in turn (dropPick). So 1 brand at first, 2 most days, 3 on a Wednesday.
   Once all the brands have dropped the order starts over (DROPS.rerun); a rerun brand is for sale again without a second splash. */
DROPS.live=2;
var DROPDAYS=[1,5],DROPHOUR=8,DROPWAIT=3;
function ymdN(ymd){var a=String(ymd).split("-").map(Number);return Math.floor(Date.UTC(a[0],a[1]-1,a[2])/864e5)}
function ymdOfN(k){return new Date(k*864e5).toISOString().slice(0,10)}
function ymdWd(k){return (k+4)%7} /* 0 Sunday: day 0, 1970-01-01, was a Thursday */
/* the drop day a moment falls in (it turns at 8 am Pacific), and the moment a drop day starts */
function dropYmd(n){return ptYmd(n-DROPHOUR*36e5).ymd}
function dropStart(ymd){return ptMidnight(ymd)+DROPHOUR*36e5}
/* drop days counted from the Shop's first day: Mondays and Fridays at least DROPWAIT days after it, up to and including to */
function dropCount(from,to){var a=ymdN(from)+DROPWAIT-1,b=ymdN(to),c=0;if(!(b>a))return 0;DROPDAYS.forEach(function(w){c+=Math.floor((b+4-w)/7)-Math.floor((a+4-w)/7)});return c}
/* the dates of the drops 0..k: 0 is the day the Shop opened, then each drop day after the wait */
function dropSlotDays(day,k){var out=[day],x=ymdN(day)+DROPWAIT-1;while(out.length<=k){x++;if(DROPDAYS.indexOf(ymdWd(x))>=0)out.push(ymdOfN(x))}return out}
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
function dropMine(n){var byId={};BRANDS.forEach(function(b){byId[b.id]=b});
  var today=dropYmd(n),day=S.shopDay||today,keep=(S.shopKeep||[]).filter(function(id){return byId[id]}),nb=BRANDS.length;
  var m=dropCount(day,today),seq=[],days=dropSlotDays(day,m+1);
  for(var j=0;seq.length<m+2;j++){var id=dropOrderAt(j);if(id==null)break;if(j===0||j>=nb||keep.indexOf(id)<0)seq.push(id)}
  var rel=keep.map(function(id){return {id:id,start:day}}).concat(seq.slice(0,m+1).map(function(id,k){return {id:id,start:days[k]}}));
  /* on day one a carried-over save keeps every brand it had, even past the cap */
  var cap=m===0?Math.max(DROPS.live,rel.length):DROPS.live,seen={},live=[],vault=[];
  for(var i=rel.length-1;i>=0;i--){var e=rel[i];if(seen[e.id])continue;seen[e.id]=1;(live.length<cap?live:vault).unshift(Object.assign({},byId[e.id],{start:e.start}))}
  var nx=seq[m+1];
  return {live:live,vault:vault,next:nx?Object.assign({},byId[nx],{start:days[m+1]}):null}}
/* the brand back on Wednesday wd: of this player's retired brands, the one out of the Shop longest (since its last day for sale or
   its last Wednesday back). Worked out Wednesday by Wednesday from the Shop's first, so every phone with the same Shop days agrees. */
dropPick=function(wd){var k=wd+"|"+DROPS.on+"|"+DROPS.rerun+"|"+BRANDS.length+"|"+DROPS.live+"|"+(S.shopDay||"")+"|"+(S.shopKeep||[]).join(",");if(k in DROPWED)return DROPWED[k];
  var x0=ymdN(S.shopDay||wd),x1=ymdN(wd),back={},out=null;x0+=(3-ymdWd(x0)+7)%7;
  for(var x=x0;x<=x1;x+=7){var w=ymdOfN(x),m=dropMine(dropStart(w)),best=null,bs="";
    m.vault.forEach(function(b){var since=back[b.id]||b.start;if(!best||since<bs){best=b;bs=since}});
    if(best)back[best.id]=w;if(x===x1)out=best}
  return DROPWED[k]=out};
/* Wednesday only: the vault brand, from 8 am Wednesday to 8 am Thursday Pacific */
dropBack=function(n){var t=dropYmd(n);if(ymdWd(ymdN(t))!==3)return null;var b=dropPick(t);return b?Object.assign({},b,{back:1,backFrom:t,backUntil:ymdAdd(t,1)}):null};
dropState=function(){var n=dropNow();dropStamp();var d=dropMine(n),bk=dropBack(n);
  if(bk&&!d.live.some(function(x){return x.id===bk.id}))d.live=[bk].concat(d.live);
  return {n:n,live:d.live,vault:[],next:d.next,back:bk}};
/* The splash used to wait for the next app start or tab change: now it comes as soon as the Closet is built or a brand drops,
   once nothing else is on screen and nobody is typing. brandCheck (25_splash.js) shows each brand once. */
setInterval(function(){try{if(!loaded||!S.created||document.hidden||areaGate("shop"))return;var a=document.activeElement;
  if(a&&/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName))return;if(document.querySelector("#layer .modal,.bsplash,.dropsplash,.modal.qbsv"))return;
  var seen=S.brandSeen||{};if(dropState().live.some(function(b){return !seen[b.id]}))brandCheck()}catch(e){}},2500);
/* test hook, removed at release with window.__qb */
window.__qbDrops={count:dropCount,days:dropSlotDays,ymd:function(t){return dropYmd(t==null?dropNow():t)},start:dropStart,back:dropBack,wedOf:dropWedOf,at:dropAt,cfg:DROPS,plan:dropPlan,state:function(){return dropState()},slotDate:dropSlotDate,mine:function(t){return dropMine(t==null?dropNow():t)},order:dropOrderAt};
