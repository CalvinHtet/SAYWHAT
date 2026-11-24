/* ---------- Cal's 2026-11-24 list, batch 3b, phase 2 (docs/specs/2026-11-24_SPEC_cal_list.md items 15 and 16) ----------
   Cal: "you can have Pluto and Chopstick be a visitor along with me and Sydney. Basically 'Calvin and Sydney came to visit and they
   brought their dogs!'", and "The pet follows you around the loft and ventures even into the walk in closet, game room, hero's lair,
   and patio by itself", and through ROOMS: the pets must never phase through furniture.
   docs/specs/2026-11-24_shop_pet_map.md (second map) says how actors, paths and visits work. */

/* ---- Calvin and Sydney's visit, with the dogs ----
   Two story friends (29k_friends.js FRIENDS; their looks are LEAD's guess from what is in the game: SAYMORE on him, KODE PINK on her;
   Cal may want them changed) and one visit, "calsyd". The dogs walk in with them as visiting dogs: 20_loft.js lfVisitors dropped
   every "dog:" member because the dogs used to live in the Bedroom, which they no longer do. The two old dog-only visits needed the
   dogs adopted, so they no longer come up; this one needs only the Game Room to sit in (the
   Lounge the older visits fall back to is not a room of today's buildings, 26_world.js ROOMCELL; the Bedroom stays private). */
(function(){var add=function(k,o){if(FRIENDS[k])return;FRIENDS[k]=o;var L=null;Object.defineProperty(o,"look",{enumerable:true,get:function(){if(L)return L;var x=fvLook(o.spec);if(window.QBLoft&&QBLoft.data&&QBLoft.data.items)L=x;return x}})};
  add("calvin",{name:"Calvin",tag:"Built this place",spec:{body:"m",skin:"s2",hairStyle:"h1",hairColor:"black",eq:["sm_hoodie","sm_cargo","sm_hightop","sm_pendant"]}});
  add("sydney",{name:"Sydney",tag:"Keeps Calvin honest",spec:{body:"f",skin:"s2",hairStyle:"h1",hairColor:"black",eq:["kp_varsity","kp_skirt","kp_loafer"]}});
  if(!FVISITS.some(function(v){return v.id==="calsyd"}))FVISITS.push({id:"calsyd",who:["calvin","sydney","dog:pluto","dog:chopstick"],w:6,place:"gameroom",text:"Calvin and Sydney came to visit and they brought their dogs!",coin:120})})();
var V51DOGFREE={calsyd:1};
/* a card with four guests: the visit window's row squeezed the two rig figures to a third of their width (the dogs' painted pictures
   kept theirs). With four or more, every picture keeps its own shape, none shrinks, and the row wraps: the two people above, the dogs below. */
htabCss("qb-v51-css",".visit .vfig{flex-wrap:wrap;justify-content:center;row-gap:4px}.visit .vfig .fvpose:first-child:nth-last-child(n+4),.visit .vfig .fvpose:first-child:nth-last-child(n+4)~.fvpose{flex:none}"
  +".visit .vfig .fvpose:first-child:nth-last-child(n+4) img,.visit .vfig .fvpose:first-child:nth-last-child(n+4)~.fvpose img{height:92px!important;width:auto!important;max-width:none!important}"
  +".visit .vfig .fvpose:first-child:nth-last-child(n+4) img.calp,.visit .vfig .fvpose:first-child:nth-last-child(n+4)~.fvpose img.calp{height:132px!important}");
fvPick=function(force){var have=function(t){return typeof hasRoom==="function"&&hasRoom(t)},last=S.visit&&S.visit.id;
  var dogOk=function(v){return V51DOGFREE[v.id]||v.who.every(function(w){return w.indexOf("dog:")!==0||fvHasAddon(w==="dog:pluto"?"bd_pluto":"bd_chop")})};
  var pool=FVISITS.filter(function(v){return (!v.need||have(v.need))&&v.id!==last&&(have(v.place)||have("lounge"))&&dogOk(v)});if(force)pool=FVISITS.filter(function(v){return v.id===force});if(!pool.length)return null;
  var tot=pool.reduce(function(a,v){return a+v.w},0),r=Math.random()*tot;for(var i=0;i<pool.length;i++){r-=pool[i].w;if(r<=0)return pool[i]}return pool[0]};
fvNames=function(who){var n=who.map(function(w){return w.indexOf("dog:")===0?(w==="dog:pluto"?"Pluto":"Chopstick"):FRIENDS[w].name});return n.length>2?n.slice(0,-1).join(", ")+" and "+n[n.length-1]:n.join(" and ")};
var v51Vis=lfVisitors;lfVisitors=function(){var out=v51Vis.apply(this,arguments);
  try{var v=S.visit;if(v&&v.d===today()&&v.t&&V51DOGFREE[v.id]){var el=Date.now()-v.t,rm=lfVisitRoom(v.place);
      if(rm>=0)v.who.forEach(function(w,k){if(w.indexOf("dog:")!==0)return;var d=w.slice(4);out.push({id:"v:dog:"+d,room:rm,role:"dog",dname:d,bed:null,visitor:1,fresh:el<90000,leaveAt:0,k:k})})}}catch(e){}
  return out};

/* ---- the companion keeps close, and looks into the Game Room by itself ----
   - Close: in the room the player's character is in, 45% of its choices are "go and sit by them" (lfDogNext gave that about 8%).
   - Roaming: time is cut into 7 minute spells; in about two of five the companion is in another room it may go to (P3ROOMS), the same
     one for the whole spell, picked from the spell's number so the building view and a room's window agree. There it is an ordinary
     dog actor with no bed: it wanders the room's own spots and sits. The Patio it already visits from the Bedroom (lfDogNext's patio
     branch walks it through the door).
   - Furniture: a dog is routed around every recorded footprint (lfGo, A*). Two holes are closed for the companion: it starts each walk
     from a free cell (a start inside a footprint let the route cross it), and it only roams rooms whose furniture is recorded.
     The Closet and the Lair are painted rooms with almost no footprints of their own, so their floor pieces come from P3BOX. ---- */
/* ROOMS 11-24 (b909831c, proof pictures shots/navboxes_1124/): the floor pieces of the two painted rooms, in each room's own cells,
   [the upgrade that brings it, x, y, w, d]. The Closet's wardrobes and shoe wall and the Lair's armory, suits and trophies stand behind
   the floor line; only these reach onto the floor. With them recorded the companion may go into both rooms. */
var P3SPELL=7*60000,P3ROOMS={gameroom:1,closet:1,lair:1},
    P3BOX={closet:[["cl_jewel",0,2.2,.9,3.0],["cl_jewel",0,1.0,1.4,1.4],["cl_jewel",0,5.05,1.45,1.45],["cl_isl",3.4,2.5,1.5,3.2]],
           lair:[["lr_console",0,1.0,.6,6.6],["lr_console",.6,4.2,.45,1.4],["lr_suit",5.2,0,6.1,.4],["lr_rack",0,8.6,.5,2.9],["lr_rack",0,0,.5,1.2]]};
function p3Hash(s){var h=2166136261;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function p3Room(){try{if(!petMine())return -1;var n=Math.floor(Date.now()/P3SPELL),h=p3Hash("pet|"+(MYUID||"")+"|"+n);if(h%100<60)return -1;
    var opts=[];S.base.slots.forEach(function(r,i){if(r&&P3ROOMS[r.t]&&typeof LFMETA!=="undefined"&&LFMETA[i])opts.push(i)});return opts.length?opts[(h>>>8)%opts.length]:-1}catch(e){return -1}}
var v51Des=lfDesired;lfDesired=function(){var o=v51Des.apply(this,arguments);
  try{var i=p3Room();if(i>=0)o.forEach(function(e){if(e&&e.id==="dog:pet"){e.room=i;e.bed=null}})}catch(e){}return o};
var v51Dog=lfDogNext;lfDogNext=function(a,C){
  try{if(a&&a.dname==="pet"&&!a.visitor){
      if(C&&C.nav&&typeof lfBlockedAt==="function"&&lfBlockedAt(C,a.x,a.y)){var f=lfFreeNear(C,a.x,a.y,2.4);if(f){a.x=f[0];a.y=f[1]}}
      var me=LFA[a.pv?"pv:me":"me"];if(me&&me.room===a.room&&a.last!=="near"&&Math.random()<.45){a.last="near";a.speed=1.4;lfGo(a,me.x+lfRand(-.7,.7),me.y+lfRand(.3,.9),{kind:"dognear"});return}}}catch(e){}
  return v51Dog.apply(this,arguments)};
/* furniture boxes for a painted room: added to the room's grid when it is built, for the upgrades the room has; then any standing
   spot that ends up inside one is moved to the nearest free cell, as lfRoomCtx does for recorded furniture (the Closet's middle
   wander spot sat on the island, so people walked into it: ROOMS) */
var v51Ctx=lfRoomCtx;lfRoomCtx=function(r){var C=v51Ctx.apply(this,arguments);
  try{var B=r&&P3BOX[r.t];if(B&&C&&C.nav&&!C._p3){C._p3=1;var N=C.nav,n=0;B.forEach(function(q){if(!(r.a&&r.a[q[0]]))return;n++;
        var x0=Math.max(0,Math.floor((q[1]-LFPAD)/LFNC)),x1=Math.min(N.nx-1,Math.floor((q[1]+q[3]+LFPAD)/LFNC)),y0=Math.max(0,Math.floor((q[2]-LFPAD)/LFNC)),y1=Math.min(N.ny-1,Math.floor((q[2]+q[4]+LFPAD)/LFNC));
        for(var y=y0;y<=y1;y++)for(var x=x0;x<=x1;x++)N.cnt[y*N.nx+x]++});
      if(n)(C.st||[]).forEach(function(sp){if(sp.kind==="door"||(typeof lfSeatish==="function"&&lfSeatish(sp))||sp.lift||sp.onspot||!lfBlockedAt(C,sp.x,sp.y))return;var f=lfFreeNear(C,sp.x,sp.y,3);if(f){sp.x=f[0];sp.y=f[1]}})}}catch(e){}
  return C};
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV151={room:p3Room,rooms:P3ROOMS,box:P3BOX,spell:function(ms){if(ms)P3SPELL=ms;return P3SPELL},pick:function(f){return fvPick(f)},names:function(w){return fvNames(w)},vis:function(){return lfVisitors()}};
