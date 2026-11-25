/* ---------- Cal 2026-11-25: three brands at all times, one rotation ----------
   Cal: "Wait why is there 5 brands in the shop right now? There should only be 3 at all times. One on Monday, the vault on Wednesday,
   and another drop on Thursday. The pet shop cycles through on Tuesday and Friday." (v1.61 put every floor's brands in one row of tabs,
   but each floor still kept its own live brands: the Street's 3 and the Boutique's 2.)
   - Now (until the first Monday of the one rotation): the Street's 3, as its calendar has them; the Boutique and Atelier show none.
     Their old calendars still feed the Wednesday vault's history, so today's vault pick does not move.
   - From Mon 11-30 8 am (V72.day): one rotation of every brand, 3 live. A new brand drops every Monday and Thursday at 8 am and the
     oldest of the 3 leaves. Every third drop is a pricier (Boutique or Atelier) brand, so at most one is in the Shop at a time; the others
     are Street brands. Each pool goes round in fixed-seed shuffles (the same on every phone), a brand never drops while it is live or
     within 3 drops of leaving, and held brands (DROPS.hold) wait.
   - The Wednesday vault stays as it is: one brand that has left, for the day, on top of the 3.
   - Pet clothes: Tuesdays and Fridays from 11-28 (29zz_v150.js). */
var V72={day:"2026-11-30",days:[1,4],live:3,every:3,cool:3,seed:"v172-one-rotation-5c1"};
var V72BASE=dropFloor;
function v72Prem(id){return brandFloor(id)!=="street"}
function v72Days(k){var out=[],x=ymdN(V72.day);while(out.length<=k){if(V72.days.indexOf(ymdWd(x))>=0)out.push(ymdOfN(x));x++}return out}
var V72C=null;
function v72Key(){return BRANDS.map(function(b){return b.id+":"+brandFloor(b.id)}).join(",")+"|"+JSON.stringify(DROPS.hold||[])+"|"+JSON.stringify(V72)}
/* the rotation's state after slot k: snap[k] = {live:[{id,start}] oldest first, left:{id:day}} */
function v72Run(k){var key=v72Key();if(!V72C||V72C.key!==key){
    var F=flGet("street")||{id:"street",live:3},d0=V72BASE(dropStart(V72.day)-60000,F),left={};
    (d0.vault||[]).forEach(function(b){if(b.left&&(!left[b.id]||b.left>left[b.id]))left[b.id]=b.left});
    V72C={key:key,live0:(d0.live||[]).map(function(b){return {id:b.id,start:b.start}}).slice(-V72.live),left0:left,snap:[],days:[],bag:{s:[],p:[]},r:{s:0,p:0},vault0:d0.vault||[]}}
  var C=V72C;if(!C.since0){C.since0={};Object.keys(C.left0).forEach(function(id){if(ymdN(V72.day)-ymdN(C.left0[id])<=7)C.since0[id]=-1})}if(C.days.length<=k+4)C.days=v72Days(k+40);
  while(C.snap.length<=k){var at=C.snap.length,day=C.days[at],prev=at?C.snap[at-1]:{live:C.live0,left:C.left0,since:C.since0},
      live=prev.live.slice(),left=Object.assign({},prev.left),since=Object.assign({},prev.since),isLive={};live.forEach(function(b){isLive[b.id]=1});
    var want=at%V72.every===V72.every-1?"p":"s",pick=null;
    var pool=function(w){return BRANDS.map(function(b){return b.id}).filter(function(id){return (w==="p")===v72Prem(id)&&!zxHeld(id,day)})};
    var ok=function(id){return !isLive[id]&&!(since[id]!=null&&at-since[id]<V72.cool)};
    var take=function(w){var fr=pool(w);if(!fr.length)return null;var bag=C.bag[w],el=bag.filter(function(id){return fr.indexOf(id)>=0&&ok(id)});
      if(!el.length){C.bag[w]=bag=bag.concat(dropShuffle(fr.filter(function(id){return bag.indexOf(id)<0}),V72.seed+"|"+w+"|"+(C.r[w]++)));el=bag.filter(function(id){return fr.indexOf(id)>=0&&ok(id)})}
      if(!el.length)el=fr.filter(ok);if(!el.length)return null;var id=el[0],i=bag.indexOf(id);if(i>=0)bag.splice(i,1);return id};
    pick=take(want)||take(want==="p"?"s":"p");
    if(pick){live.push({id:pick,start:day});while(live.length>V72.live){var o=live.shift();left[o.id]=day;since[o.id]=at}}
    C.snap.push({live:live,left:left,since:since,pick:pick,day:day})}
  return C.snap[k]}
/* the slot in force at time n: -1 before the first */
function v72Slot(n){var t=dropYmd(n);if(t<V72.day)return -1;var x=ymdN(V72.day),T=ymdN(t),k=-1;for(;x<=T;x++)if(V72.days.indexOf(ymdWd(x))>=0)k++;return k}
dropFloor=function(n,F){
  if(!F||F.id!=="street"){var d=V72BASE.apply(this,arguments);if(dropYmd(n)>=V72.day)return {live:[],vault:[],soon:[],next:null};return Object.assign({},d,{live:[],next:null})}
  var k=v72Slot(n);if(k<0)return V72BASE.apply(this,arguments);
  var byId={};BRANDS.forEach(function(b){byId[b.id]=b});var mk=function(id,o){return Object.assign({},byId[id],o,{fl:"street"})};
  var s=v72Run(k+3),now=V72C.snap[k],live=now.live.map(function(b){return mk(b.id,{start:b.start})}),seen={};live.forEach(function(b){seen[b.id]=1});
  var vault=[];Object.keys(now.left).forEach(function(id){if(seen[id]||!byId[id])return;var st=null;V72C.snap.slice(0,k+1).forEach(function(q){q.live.forEach(function(b){if(b.id===id&&b.start<=now.left[id])st=b.start})});
    if(!st)(V72C.vault0||[]).forEach(function(b){if(b.id===id)st=b.start});vault.push(mk(id,{start:st||now.left[id],left:now.left[id]}))});
  var soon=[k+1,k+2,k+3].map(function(j){var q=V72C.snap[j];return q&&q.pick?{id:q.pick,start:q.day,fl:"street"}:null}).filter(Boolean);
  return {live:live,vault:vault,soon:soon,next:soon[0]?mk(soon[0].id,{start:soon[0].start}):null}};
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV172={pet:function(){return pzSlotNow()},cfg:V72,run:function(k){return v72Run(k)},slot:v72Slot,days:v72Days};
