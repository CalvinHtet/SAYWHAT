/* ---------- Cal 2026-11-26 (evening list): Checkout, posts that never change, a delete check, relics found slowly, the Armory ----------
   Cal: "change the buy button next to the character to a checkout button where it lists everything you've selected on your person as a
   shopping list. The left side will have the item in a small square box and on the right, the item name, and to the right of that, the
   price. Then on the bottom, it tallies it up and then there's a final confirm purchase button";
   "The feet is slightly cut off in the profile card. Also when I changed my banner, it changed the previous post's banner as well. Make
   sure that the current banner i post is untouched by future changes"; "When deleting a post, have a confirmation splash screen";
   "For the relics that can be found, don't show the possible unlocks in the dungeon tab. Don't even have the text box there yet until we
   come back with the first relic ... Once we unlock the armory room, these pieces will automatically appear there. We also need more
   items that go in the armory room so create more mannequins ... Not everything needs to be a 5 piece. Some can be a cool sword that can
   go up on the walls. Or maybe you slayed a dragon and used his head to make a mantle ... The armory room doesn't need to have any
   additional room upgrades other than unlocking the room. Collecting relics will just start to populate that room automatically".
   - Checkout: the try-on's Buy button reads Checkout; its window lists each piece (icon in a square, name, price), the total, Confirm purchase.
   - Posts: a card post keeps the banner it was posted with. Snapshots began 11-25; an older post of yours gets today's card written into it
     once (from then on it never changes), and another player's older post keeps the card this phone first saw. Tapping your own post shows
     that post's card, not today's. The figure sits a little higher so the soles are not clipped.
   - Delete: a window asks first.
   - Crawls tab: no relic box until the first one comes home; then only what was found, never the "? ? ?" of what is left.
   - The Trophy Room is now the Armory (same room, same stairs from the Hero's Lair, no upgrades of its own). New relics: three more
     mannequin sets (3, 4 and 5 pieces) and seven single pieces for the walls (a greatsword, a shield, a dragon's head over the mantel ...).
     Each new relic can only be found once ROOMS's art for it exists (its icon ui_tr_<set>_<id>.webp); in the room each one appears by
     itself once found (trx_<set>_mq stands with trx_<set>_<id> layers; trw_<id> on the walls), skipped while its art is missing. */
/* ---- Checkout ---- */
var v216Mir=qsMirror;qsMirror=function(){var h=v216Mir.apply(this,arguments);
  try{var n=qsTryList().length;if(n)h=h.replace(/(<button[^>]*data-act="qscheck"[^>]*>)[\s\S]*?(<\/button>)/,'$1Checkout ('+n+')$2')}catch(e){}return h};
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest('[data-act="qscheck"]');if(!b)return;e.preventDefault();e.stopPropagation();
  var tl=qsTryList();if(!tl.length)return;var cost=tl.reduce(function(x,it){return x+it[3]},0),short=Math.max(0,cost-S.coins);
  modal('<div class="card box2 qs-confirm v216co"><div class="rm-head"><span class="label">Checkout</span>'+coinPillHtml()+'</div><ul class="v216ls">'
    +tl.map(function(it){return '<li>'+qsThumb(it)+'<span class="v216nm">'+esc(it[2])+'</span><b class="v216pr"><i class="coin"></i>'+it[3].toLocaleString()+'</b></li>'}).join("")
    +'</ul><div class="v216tot"><span>Total</span><b><i class="coin"></i>'+cost.toLocaleString()+'</b></div>'
    +(short?'<p class="note">You need '+short.toLocaleString()+' more coins.</p>':'')
    +'<div class="btns"><button class="btn" data-act="qsconfirm"'+(short?' disabled':'')+'>Confirm purchase</button><button class="btn ghost" data-act="mclose">Keep looking</button></div></div>')},true);
/* ---- posts keep their card ---- */
function v216Freeze(){try{return JSON.parse(localStorage.getItem("qb_pcfreeze")||"{}")||{}}catch(e){return {}}}
var V216FZ=v216Freeze(),V216FILL=0;
var v216Of=pcOfPost;pcOfPost=function(p){var q=v216Of.apply(this,arguments);
  try{if(!p.snap&&q){var id=p.id||(p.from+"|"+p.t),f=V216FZ[id];
      if(f){q.card=pcSafe(f)||q.card}else if(q.card&&q.card.bg){V216FZ[id]={bg:q.card.bg,r:q.card.r,c:q.card.c,pose:q.card.pose};try{localStorage.setItem("qb_pcfreeze",JSON.stringify(V216FZ))}catch(x){}}
      /* my own older card posts: write today's card into them once, so they stay put everywhere */
      if(p.from===MYUID&&!V216FILL&&typeof socMine==="function"){V216FILL=1;var sn=pcSnap();
        socMine("board",function(d){(Array.isArray(d.posts)?d.posts:[]).forEach(function(x){if(x&&x.text===PCTXT&&!x.snap)x.snap=sn})}).then(function(){(SOC.posts||[]).forEach(function(x){if(x.from===MYUID&&x.text===PCTXT&&!x.snap)x.snap=sn})}).catch(function(){})}}}catch(e){}
  return q};
/* my own post opens as posted */
document.addEventListener("click",function(e){var el=e.target.closest&&e.target.closest('.pc-post[data-act="pcard"]');if(!el)return;e.preventDefault();e.stopPropagation();
  try{var all=[].slice.call(document.querySelectorAll(".pc-post")),i=all.indexOf(el),ps=(SOC.posts||[]).filter(function(p){return p.text===PCTXT}),p=ps[i];if(!p||p.from!==MYUID){pcOpen();return}
    modal('<div class="card box2 v216pv"><span class="label">Posted '+esc(socAgo(p.t||0))+'</span><div class="v216pvc">'+pcHtml(pcOfPost(p),260)+'</div><div class="btns"><button class="btn ghost" data-act="mclose">Close</button></div></div>')}catch(x){try{pcOpen()}catch(y){}}},true);
/* the figure a little higher on every card, so the soles show */
var v216Char=pcChar;pcChar=function(look,H){var h=v216Char.apply(this,arguments);return h.replace(/margin-bottom:-(\d+)px/,function(m,n){return "margin-bottom:-"+Math.round(n*.45)+"px"})};
/* ---- deleting a post asks first ---- */
var V216DEL=0,v216Soc=socialAct;socialAct=function(a,b,e){if(a==="sndel"&&!V216DEL){var pid=b&&b.dataset?b.dataset.p:"";
    modal('<div class="card box2 v216del"><span class="label">Delete post</span><h2 style="font-size:24px">Delete this post?</h2><p class="note">It comes off the Town board for everyone. This cannot be undone.</p>'
      +'<div class="btns"><button class="btn danger" data-v216del="'+esc(pid)+'">Delete</button><button class="btn ghost" data-act="mclose">Keep it</button></div></div>');return true}
  return v216Soc.apply(this,arguments)};
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-v216del]");if(!b)return;e.preventDefault();e.stopPropagation();var pid=b.getAttribute("data-v216del");
  try{closeModals()}catch(x){}V216DEL=1;try{socialAct("sndel",{dataset:{p:pid}},e)}finally{V216DEL=0}pop("Post deleted")},true);
/* ---- the relics box: only once something came home, only what came home ---- */
v210Relics=function(){try{var t=dgState(),rows=Object.keys(TSETS).map(function(k){var T=TSETS[k],got=T.pieces.filter(function(p){return t[k]&&t[k][p.id]});if(!got.length)return "";
      return '<div class="v210rs"><b>'+esc(T.name)+'</b><div class="v210rp">'+got.map(function(p){return '<span class="chip on">'+esc(p.name)+'</span>'}).join("")+'</div></div>'}).join("");
    if(!rows)return "";return '<section class="card panel"><h3 class="label">Relics found</h3><p class="note">What your allies brought home. '+(dgRoomBuilt()?'Each one is on show in the Armory.':'Open the Armory above the Hero\'s Lair to show them off.')+'</p>'+rows+'</section>'}catch(e){return ""}};
/* ---- the Armory's new relics ---- */
var V216SETS={
  drowned:{name:"The Drowned Captain's Kit",art:"drowned",lore:"A captain who would not leave the flooded arcade, and the gear he left on the last cabinet.",
    bonus:{text:"Dungeon crawls bring home 10% more coins",mission:.10},
    pieces:[{id:"helm",name:"Barnacle Helm",d:"Brass, green with age, a crab still living in the crest.",buff:{text:"Dungeon crawls bring home 3% more coins",mc:.03}},
      {id:"coat",name:"Storm Captain's Coat",d:"Salt-stiff wool with tarnished gold braid.",buff:{text:"Dungeon crawls bring home 3% more coins",mc:.03}},
      {id:"cutlass",name:"Tide-Etched Cutlass",d:"The blade shows the tide coming in when you tilt it.",buff:{text:"Dungeon crawls come back 5% sooner",mt:.05}}]},
  clock:{name:"The Clockwork Sentinel",art:"clock",lore:"It guarded the vault for a hundred years, one tick at a time, until it stopped.",
    bonus:{text:"Dungeon crawls come back 10% sooner",mt:.10},
    pieces:[{id:"mask",name:"Sentinel Faceplate",d:"A blank brass face with one glass eye that still turns.",buff:{text:"Dungeon crawls bring home 3% more coins",mc:.03}},
      {id:"gauntlets",name:"Geared Gauntlets",d:"Each knuckle is a little gear.",buff:{text:"Dungeon crawls come back 5% sooner",mt:.05}},
      {id:"chest",name:"Mainspring Breastplate",d:"You can hear it wind itself.",buff:{text:"Dungeon crawls bring home 3% more coins",mc:.03}},
      {id:"halberd",name:"Pendulum Halberd",d:"The axe head swings back to center on its own.",buff:{text:"Dungeon crawls come back 5% sooner",mt:.05}}]},
  warden:{name:"The Obsidian Warden",art:"warden",lore:"Whoever held the last floor of the Spire wore this, and never came down.",
    bonus:{text:"Dungeon crawls bring home 20% more coins and come back 10% sooner",mission:.20,mt:.10},
    pieces:[{id:"crown",name:"Spire Crown",d:"Black glass points that catch light that is not there.",buff:{text:"Dungeon crawls bring home 4% more coins",mc:.04}},
      {id:"mantle",name:"Warden's Mantle",d:"A heavy cloak that falls like smoke.",buff:{text:"Dungeon crawls come back 5% sooner",mt:.05}},
      {id:"plate",name:"Obsidian Plate",d:"Cut, not forged. Cold to the touch even in summer.",buff:{text:"Dungeon crawls bring home 4% more coins",mc:.04}},
      {id:"greaves",name:"Glass-Step Greaves",d:"Quiet on any floor.",buff:{text:"Dungeon crawls come back 5% sooner",mt:.05}},
      {id:"blade",name:"Last Floor Blade",d:"Always one inch longer than you remember.",buff:{text:"Dungeon crawls bring home 4% more coins",mc:.04}}]},
  wall:{name:"The Armory Wall",art:"wall",lore:"Single prizes, each from a fight worth remembering.",
    bonus:{text:"Dungeon crawls bring home 10% more coins",mission:.10},
    pieces:[{id:"banner",name:"Tattered War Banner",d:"Pulled from a cellar wall, still smelling of smoke.",buff:{text:"Dungeon crawls bring home 2% more coins",mc:.02}},
      {id:"lantern",name:"Ghost Train Lantern",d:"It lights up whenever a train passes, anywhere.",buff:{text:"Dungeon crawls come back 3% sooner",mt:.03}},
      {id:"shield",name:"Rat King's Shield",d:"A manhole cover with handles, and a crown painted on in a hurry.",buff:{text:"Dungeon crawls bring home 2% more coins",mc:.02}},
      {id:"bow",name:"Crystal Longbow",d:"The string hums the same note as the mine walls.",buff:{text:"Dungeon crawls come back 3% sooner",mt:.03}},
      {id:"greatsword",name:"Ember Greatsword",d:"Still warm. Mounted high, for everyone's safety.",buff:{text:"Dungeon crawls bring home 3% more coins",mc:.03}},
      {id:"beak",name:"Kraken's Beak",d:"From the thing under the arcade floor. Polished, finally harmless.",buff:{text:"Dungeon crawls come back 3% sooner",mt:.03}},
      {id:"dragon",name:"Dragon's Head Mantel",d:"The Spire's dragon, over the fireplace. Its eyes follow you.",buff:{text:"Dungeon crawls bring home 5% more coins",mc:.05}}]}};
var V216WHERE={cellar:[["wall",["banner"]]],metro:[["wall",["lantern"]]],sewer:[["wall",["shield"]],["drowned",["helm"]]],tower:[["clock",["mask","gauntlets"]]],
  mines:[["clock",["chest","halberd"]],["wall",["bow","greatsword"]]],arcade:[["drowned",["coat","cutlass"]],["wall",["beak"]]],spire:[["warden",["crown","mantle","plate","greaves","blade"]],["wall",["dragon"]]]};
function v216Art(set,id){try{return !!(window.QBART&&QBART["ui_tr_"+set+"_"+id+".webp"])}catch(e){return false}}
try{Object.keys(V216SETS).forEach(function(k){if(!TSETS[k])TSETS[k]=V216SETS[k]});
  /* only what has its art can be found; the rest waits for ROOMS */
  Object.keys(V216WHERE).forEach(function(d){V216WHERE[d].forEach(function(L){var ok=L[1].filter(function(id){return v216Art(L[0],id)});if(ok.length)(DGLOOT[d]=DGLOOT[d]||[]).push([L[0],ok])})})}catch(e){}
/* the room: the Armory */
try{var RD=ROOMDEF.trophy;RD.name="Armory";if(RD.help){RD.help.k="Armory";RD.help.t="The Armory is open";RD.help.sub="Every relic your allies bring home goes on show here, by itself.";
    RD.help.pts=[["On their own","Sets go onto their stands piece by piece; single prizes go up on the walls."],["Buffs","Every relic has its own small buff, and a full set a big one."]]}
  if(typeof ROOMT!=="undefined"&&ROOMT.trophy){if(typeof ROOMT.trophy==="string")ROOMT.trophy="Armory";else if(ROOMT.trophy.name)ROOMT.trophy.name="Armory"}
  (ADDONS.lair||[]).forEach(function(a){if(a[0]==="lr_troom"){a[1]="Stairs to the Armory";a[8]="A hall upstairs where every relic your allies bring home goes on show."}})}catch(e){}
/* where each new stand and wall piece goes (ROOMS fits these to the painted hall as the art lands) */
var V216MQ={drowned:[1.5,3.1],clock:[4.9,3.1],warden:[6.5,3.1]};
var V216WALL={banner:[.6,.3,1.0],lantern:[1.9,.3,1.0],shield:[2.9,.3,1.0],greatsword:[4.1,.3,1.2],bow:[5.4,.3,1.0],beak:[6.5,.3,1.0],dragon:[3.4,.3,1.6]};
try{var v216Draw=ROOMDEF.trophy.draw;ROOMDEF.trophy.draw=function(C){var r=v216Draw?v216Draw.apply(this,arguments):undefined;
  try{["drowned","clock","warden"].forEach(function(k){var T=TSETS[k];if(!T.pieces.some(function(p){return trHas(k,p.id)}))return;var P=V216MQ[k];
      if(lfSpr(C,"trx_"+k+"_mq",P[0],P[1],1.3,1.3,{H:136,ctr:1,h:60}))T.pieces.forEach(function(p,i){if(trHas(k,p.id))lfSpr(C,"trx_"+k+"_"+p.id,P[0],P[1],1.3,1.3,{H:136,ctr:1,nosh:1,nob:1,dk:-.001*(i+1)})})});
    TSETS.wall.pieces.forEach(function(p){if(!trHas("wall",p.id))return;var P=V216WALL[p.id];if(P)lfSpr(C,"trw_"+p.id,P[0],P[1],P[2],.3,{H:90,ctr:1,nosh:1})})}catch(e){}
  return r}}catch(e){}
htabCss("qb-v216-css",".v216ls{list-style:none;margin:10px 0;padding:0;display:flex;flex-direction:column;gap:8px}.v216ls li{display:flex;align-items:center;gap:10px}"
  +".v216ls .qs-img{width:52px;height:52px;flex:0 0 52px;border-radius:10px;overflow:hidden;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);padding:4px;box-sizing:border-box}.v216ls .qs-img img{width:100%;height:100%;object-fit:contain}.v216ls .qs-mark{display:none}"
  +".v216nm{flex:1;min-width:0;font-size:14px;line-height:1.25}.v216pr{white-space:nowrap}.v216tot{display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(255,255,255,.12);padding-top:10px;margin-top:4px;font-size:16px}"
  +".v216pvc{display:flex;justify-content:center;margin:10px 0}.btn.danger{background:#c8453a;color:#fff}");
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV216={sets:V216SETS,where:V216WHERE,art:v216Art,freeze:function(){return V216FZ}};
try{PORTALS.forEach(function(p){if(p[1]==="trophy"&&p[5]==="Trophy Room")p[5]="Armory"})}catch(e){}
