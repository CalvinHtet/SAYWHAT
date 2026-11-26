/* ---------- Cal 2026-11-26: rarer free cosmetics; a furniture find waits in its room for free ----------
   Cal: "I am now getting a lot of free cosmetic items when completing quests. I think we should make these a bit more rare rather than just
   giving it right away. One other thing, i also unlocked a new furniture piece randomly from a random task loot. I would like this to not be
   automatically installed. Instead, in the loft or whatever building the upgrade is for, make that upgrade available next and instead of a
   price, make it free. When the splash card comes up that we unlocked a free room upgrade, add a notice that the upgrade is available in the
   loft for free."
   - Surprise loot (29zz_v144.js): a Street piece 12 -> 4 in 100 rolls, a Boutique piece 2 -> 1; chests and soul stones take the rest.
     The Daily Quest's hidden chest (ECON.chest3): an accessory 33% -> 12%, the rest to the low and mid relics.
   - A furniture find is no longer installed: S.freeUp["<room>:<upgrade>"] marks it free. That room's window lists it first, with "Free" on
     its button, and installing it costs nothing; the mark goes once it is in. The loot card says where it waits: "Free in your Bedroom, in
     The Loft. Install it there for 0 coins." */
LOOTW=[["chest",50],["stone",39],["cloth",4],["furn",6],["bout",1]];
try{ECON.chest3=[["low",64],["acc",12],["mid",20],["high",4]]}catch(e){}
function v84Free(){if(!S.freeUp||typeof S.freeUp!=="object")S.freeUp={};return S.freeUp}
var v84Give=lootGive;lootGive=function(kind){if(kind!=="furn")return v84Give.apply(this,arguments);
  var fs=lootFurnAll(),f=fs.length?fs[Math.floor(Math.random()*fs.length)]:null;if(!f)return v84Give.call(this,"chest");
  var r=S.base.slots[f[0]],L=lootState(),F=v84Free(),o={k:"furn",ad:f[1],free:1,room:rmName(r.t)||(ROOMT[r.t]||{}).name||"your room",bld:""};
  try{var q=ROOMCELL[r.t];o.bld=q&&BLD[q[0]]?BLD[q[0]].name:"The Loft"}catch(e){o.bld="The Loft"}
  F[r.t+":"+f[1][0]]=Date.now();L.n++;L.all=(L.all||0)+1;render();persist();return o};
var v84Show=lootShow;lootShow=function(o){var m=v84Show.apply(this,arguments);
  try{if(o&&o.free){var c=document.querySelector("#layer .lootm .reward");if(c)c.innerHTML='Free in your '+esc(o.room)+', in '+esc(o.bld)+'.';
      var h=document.querySelector("#layer .lootm h2");if(h)h.insertAdjacentHTML("afterend",'<p class="note v84note">Install it there for 0 coins.</p>')}}catch(e){}return m};
/* the room's window: the free one first, its button "Free" */
var v84Avail=roomAvail;roomAvail=function(i,r,T,list){var R=v84Avail.apply(this,arguments);
  try{var F=v84Free(),keys=Object.keys(F).filter(function(k){return k.indexOf(r.t+":")===0});if(!keys.length||!R||!R.avail)return R;
    keys.forEach(function(k){var aid=k.slice(r.t.length+1);if(r.a&&r.a[aid]){delete F[k];return}
      var j=-1;R.avail.forEach(function(h,n){if(j<0&&h.indexOf('data-aid="'+aid+'"')>=0)j=n});if(j<0)return;
      var h=R.avail[j].replace(/<button class="btn[^"]*" data-act="raddon"([^>]*)>[\s\S]*?<\/button>/,'<button class="btn v84free" data-act="raddon"$1>Free</button>').replace('class="addon next"','class="addon next v84"');
      R.avail.splice(j,1);R.avail.unshift(h)})}catch(e){}
  return R};
/* installing it costs nothing */
var v84Act=baseAct;baseAct=function(a,b,e){
  if(a==="raddon"&&b&&b.dataset){try{var i=+b.dataset.i,r=bslot(i),id=b.dataset.id,F=v84Free(),k=r&&(r.t+":"+id);
      if(k&&F[k]){var ad=(ADDONS[r.t]||[]).filter(function(x){return x[0]===id})[0];if(ad){var p=ad[2];ad[2]=0;var out;try{out=v84Act.apply(this,arguments)}finally{ad[2]=p}if(r.a&&r.a[id]){delete F[k];persist()}return out}}}catch(x){}}
  return v84Act.apply(this,arguments)};
htabCss("qb-v184-css",".addon.v84{border-color:#4de8b0!important;box-shadow:0 0 0 1px rgba(77,232,176,.35)}.btn.v84free{background:#4de8b0!important;color:#0b1a14!important}.v84note{margin:4px 0 0;text-align:center}");
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV184={free:v84Free,give:function(k){return lootGive(k)},show:function(o){return lootShow(o)},w:function(){return LOOTW},chest3:function(){return ECON.chest3}};
