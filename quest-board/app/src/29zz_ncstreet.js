/* ---------- NICE COCK on the Street this Friday, then every drop random (Cal, 2026-11-17) ----------
   Cal: "Right now, the shop is overpass. I want NICE COCK to drop on Friday. And then randomize all the other drops afterwards." He is
   under level 30, so he only has the Street floor; NICE COCK was a Boutique brand (level 30). So NICE COCK moves to the Street (BRANDS
   in 10_app_a.js: fl "street", which also prices its pieces on the Street's scale) and is the Street's drop on Fri 11-20 (DROPS.pin).
   From that day (DROPS.shuf1) every floor's drops are random: each round is a fresh fixed-seed shuffle of the floor's brands (the same
   on every phone, never reshuffled by a reload), a brand never drops again while it is still live, and held brands wait their turn.
   Every drop before shuf1 stays exactly as it was: those slots are worked out with the old floors (D2OLDFL) and the old order. */
/* v1.22 (Cal, 2026-11-18): drops move to Monday and Thursday from 11-19, so there is no Friday drop: NICE COCK's drop and the shuffle start
   move to Thu 11-19 */
DROPS.shuf1="2026-11-19";
DROPS.pin=[{fl:"street",day:"2026-11-19",id:"nc"}];
var D2OLDFL={nc:"boutique"};
function d2OldIds(F){return BRANDS.filter(function(b){return (D2OLDFL[b.id]||brandFloor(b.id))===F.id}).map(function(b){return b.id})}
var D2J={},D2={};
/* the first slot of floor F dated shuf1 or later */
function d2J1(F){if(D2J[F.id]!=null)return D2J[F.id];var d=zxSlotDays(F,400),j=0;while(j<d.length&&d[j]<DROPS.shuf1)j++;return D2J[F.id]=j}
var d2Fl=flOrderAt;
function d2Ord(F,ids,upto){var lv=F.live||DROPS.live,k=F.id+"|"+ids.join(",")+"|"+lv+"|"+DROPS.shuf1+"|"+DROPS.seed+"|"+JSON.stringify(DROPS.hold||[])+"|"+JSON.stringify(DROPS.pin||[]),c=D2[k];
  if(!c){var j1=d2J1(F),old=d2OldIds(F),ord=[];for(var j=0;j<j1;j++)ord.push(old.length?d2Fl(F,old,j):null);c=D2[k]={ord:ord,days:[],bag:[],r:0}}
  if(c.days.length<=upto+1)c.days=zxSlotDays(F,upto+40);
  var ord=c.ord;
  while(ord.length<=upto){var at=ord.length,day=c.days[at]||"9999",last={};ord.forEach(function(id,i){if(id!=null)last[id]=i});
    var pin=(DROPS.pin||[]).filter(function(p){return p.fl===F.id&&p.day===day&&ids.indexOf(p.id)>=0})[0];
    /* a brand is live for lv drops, then rests: at least 2 drops (Street: a week), more when the floor has more brands, so it cannot
       leave on Monday and come back on Friday (with 3 live, Cal 2026-11-17, the old gap of max(lv, half) did exactly that) */
    var fr=ids.filter(function(id){return !zxHeld(id,day)}),gap=lv+Math.max(1,Math.floor((fr.length-lv)/2)),pick,
      cool=function(g){return function(id){return last[id]==null||at-last[id]>g}};
    if(pin)pick=pin.id;
    else{var el=c.bag.filter(function(id){return fr.indexOf(id)>=0&&cool(gap)(id)});
      /* nothing in this round can drop today: the next round, shuffled with the next seed, goes after what is left of this one */
      if(!el.length){c.bag=c.bag.concat(dropShuffle(fr.filter(function(id){return c.bag.indexOf(id)<0}),DROPS.seed+"|shuf1|"+F.id+"|"+(c.r++)));
        el=c.bag.filter(function(id){return fr.indexOf(id)>=0&&cool(gap)(id)})}
      if(!el.length)el=fr.filter(cool(gap));if(!el.length)el=fr.filter(cool(lv));if(!el.length)el=fr.length?fr:ids;
      pick=el[0]}
    var bi=c.bag.indexOf(pick);if(bi>=0)c.bag.splice(bi,1);ord.push(pick)}
  return ord[upto]}
flOrderAt=function(F,ids,j){try{if(!ids||!ids.length||(F.id==="street"&&DROPS.on))return d2Fl.apply(this,arguments);
  if(j<d2J1(F)){var old=d2OldIds(F);return old.length?d2Fl.call(this,F,old,j):null}
  if(!DROPS.rerun&&j>=ids.length)return null;return d2Ord(F,ids,j)}catch(e){return d2Fl.apply(this,arguments)}};
/* from shuf1 a floor shows only its own brands: NICE COCK leaves the Boutique the day it drops on the Street */
var d2Floor=dropFloor;dropFloor=function(n,F){var d=d2Floor.apply(this,arguments);
  try{if(d&&F&&dropYmd(n)>=DROPS.shuf1){var mine=function(b){return b&&brandFloor(b.id)===F.id};d.live=(d.live||[]).filter(mine);d.vault=(d.vault||[]).filter(mine);if(d.soon)d.soon=d.soon.filter(mine);if(d.next&&!mine(d.next))d.next=null}}catch(e){}
  return d};
