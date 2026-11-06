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
var DROPS={on:false,launch:"2026-12-07",seed:"quest-board drops 1",fixed:{hanga:0,nicecock:4},live:4,rerun:null};
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
    if(r===0)Object.keys(fx).forEach(function(id){if(ids.indexOf(id)>=0&&fx[id]<n)row[fx[id]]=id});
    for(var k=0;k<n;k++)if(!row[k])row[k]=rest.shift();
    row.forEach(function(id,k){out.push({id:id,slot:r*n+k,start:dropSlotDate(r*n+k)})})}
  return out}
function dropCadence(){return DROPS.on?"Mondays and Thursdays":"Mondays"}
/* with the schedule on, the Shop reads its drops from the plan; brands are found by id, so a rerun is the same brand again */
var dropStateWeekly=dropState;
dropState=function(){if(!DROPS.on)return dropStateWeekly();
  var n=dropNow(),plan=dropPlan(DROPS.rerun?12:1),byId={};BRANDS.forEach(function(b){byId[b.id]=b});
  var rel=plan.filter(function(e){return ptMidnight(e.start)<=n}),nxE=plan.filter(function(e){return ptMidnight(e.start)>n})[0]||null;
  var seen={},live=[];for(var i=rel.length-1;i>=0&&live.length<DROPS.live;i--){var id=rel[i].id;if(!seen[id]){seen[id]=1;live.unshift(Object.assign({},byId[id],{start:rel[i].start}))}}
  var vault=[];for(var j=rel.length-1;j>=0;j--){var vid=rel[j].id;if(!seen[vid]){seen[vid]=1;vault.unshift(Object.assign({},byId[vid],{start:rel[j].start}))}}
  return {n:n,live:live,vault:vault,next:nxE?Object.assign({},byId[nxE.id],{start:nxE.start}):null}};
/* test hook, removed at release with window.__qb */
window.__qbDrops={cfg:DROPS,plan:dropPlan,state:function(){return dropState()},slotDate:dropSlotDate};
