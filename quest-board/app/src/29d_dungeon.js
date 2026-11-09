/* ---------- Dungeon Crawl finds, trophy sets and relics (Cal, 2026-11-05; the finds, 2026-11-09) ----------
   Cal, 2026-11-09: a dungeon crawl brings "loot, a new cosmetic, a new ally, or a relic piece, or something for the trophy room. But
   these items are rare, with success gauranteed by the 4th crawl". Every crawl brings coins (dngClaim in 10_app_a.js); crawlFind
   decides the rare find: ECON.crawlRare a crawl (more with the trophy perks, STR and every Hero's Lair upgrade), and always on the
   ECON.crawlPity-th crawl in a row without one. A find is one of what that dungeon still hides (DGLOOT, DNPC): a piece of The Goblin
   King's Regalia for the Trophy Room, a shard of The Hollow Amulet (a relic), the ally trapped there, or the Rift Mask at the bottom
   of the Spire; or a piece to wear you do not own yet (a brand that has left the Shop first, else the basics and the brands on sale,
   like a level crate). With nothing rare left in a dungeon and nothing left to wear, the find is a strongbox of coins. A find is
   kept the moment the crawl is collected (dgGive), so a closed app loses nothing; "Open it" only shows it.
   Pieces carry small buffs; a finished set carries a large one. The Trophies tab (a sub-tab of Relics) opens with the first piece.
   Relics are one-time milestones in tiers, hidden until earned. The old trophies (badges) carry over as Milestones.
   Art from ROOMS, all optional: ui_gift.webp, ui_tr_<set>_<piece>.webp, ui_tr_<set>_set.webp. */
var TSETS={
  goblin:{name:"The Goblin King's Regalia",art:"goblin",
    lore:"Something under the city has been crowning itself with whatever the trains leave behind.",
    bonus:{text:"Dungeon crawls bring home 20% more coins and rare finds more often",mission:.20,gift:.05},
    pieces:[
      {id:"helm",name:"Iron Crown-Helm",d:"Hammered from stolen rail iron. The crown points are filed sharp.",buff:{text:"Dungeon crawls bring home 5% more coins",mc:.05}},
      {id:"chest",name:"Scrap-Plate Cuirass",d:"Salvaged signage, riveted and laced with copper wire. Heavier than it looks.",buff:{text:"Dungeon crawls bring home 5% more coins",mc:.05}},
      {id:"greaves",name:"Tunnel-Runner Greaves",d:"Worn smooth from years of service tunnels.",buff:{text:"Dungeon crawls come back 10% sooner",mt:.10}},
      {id:"boots",name:"Hushstep Boots",d:"Soles wrapped in felt. His patrols never heard him coming.",buff:{text:"Rare finds come home a little more often",gift:.03}},
      {id:"sword",name:"Signal-Iron Blade",d:"Forged from a track switch lever. It still hums near live rails.",buff:{text:"Every quest earns 3% more XP",xp:3}}
    ]},
  amulet:{name:"The Hollow Amulet",art:"amulet",
    lore:"Five shards of one amulet, scattered on purpose by someone who did not want it whole.",
    bonus:{text:"Every quest earns 8% more XP, and businesses earn 5% more",xp:8,biz:5},
    pieces:[
      {id:"dusk",name:"Shard of Dusk",d:"Violet glass, cool to the touch. It darkens at sunset.",buff:{text:"Quests pay 2% more coins",coin:2}},
      {id:"ember",name:"Shard of Embers",d:"Warm in the hand, even in winter.",buff:{text:"Quests pay 2% more coins",coin:2}},
      {id:"tide",name:"Shard of Tides",d:"Hold it to your ear and you hear water that isn't there.",buff:{text:"Quests pay 2% more coins",coin:2}},
      {id:"thorn",name:"Shard of Thorns",d:"Dark red, with edges sharp enough to draw blood.",buff:{text:"Quests pay 2% more coins",coin:2}},
      {id:"silence",name:"Shard of Silence",d:"Rooms go quiet when it is unwrapped.",buff:{text:"Quests pay 2% more coins",coin:2}}
    ]}
};
/* which dungeon hides which pieces ([set, pieces]): the Regalia in the shallow ones, the Amulet deeper down, the last shard at the Spire */
var DGLOOT={cellar:[["goblin",["greaves","boots"]]],metro:[["goblin",["helm","chest"]]],sewer:[["goblin",["sword"]],["amulet",["dusk"]]],
  tower:[["amulet",["dusk","ember"]]],mines:[["amulet",["ember","tide"]]],arcade:[["goblin",["sword"]],["amulet",["thorn"]]],spire:[["amulet",["tide","thorn","silence"]]]};
function dgState(){if(!S.trophy||typeof S.trophy!=="object")S.trophy={};if(!S.relics||typeof S.relics!=="object")S.relics={};return S.trophy}
function dgHas(set,id){var t=dgState();return !!(t[set]&&t[set][id])}
function dgPieces(){var t=dgState(),n=0;Object.keys(TSETS).forEach(function(k){n+=Object.keys(t[k]||{}).length});return n}
function dgDone(set){return TSETS[set].pieces.every(function(p){return dgHas(set,p.id)})}
/* where the trophies stand: ROOMS's Trophy Room above the Lair (room id "trophy"), or the old Lair Trophy Wall in saves that have it */
function dgRoomBuilt(){return S.base&&S.base.slots.some(function(r){return r&&(r.t==="trophy"||(r.t==="lair"&&r.a&&r.a.lr_trophy))})}
/* for ROOMS (Cal: the Trophy Room opens "only after a team member brings back the first trophy"): pieces brought home so far */
window.qbRaidTrophies=function(){try{return dgPieces()}catch(e){return 0}};
/* the Lair's Trophy Wall stays a mystery until the first piece comes home */
(ADDONS.lair||[]).forEach(function(a){if(a[0]==="lr_trophy"){a[3]=Object.assign({},a[3]||{},{trophy:1})}});
/* every buff from pieces owned and sets finished, summed by kind */
function dgBuff(k){var v=0;Object.keys(TSETS).forEach(function(s){var T=TSETS[s];T.pieces.forEach(function(p){if(dgHas(s,p.id))v+=p.buff[k]||0});if(dgDone(s))v+=T.bonus[k]||0});return v}
/* quest XP and coins join the game's buff list */
var dgSocialBase=socialBuffs;
socialBuffs=function(){var o=dgSocialBase(),x=dgBuff("xp"),c=dgBuff("coin");if(x)o.push({who:"Trophies",b:{special:"all",pct:x,text:"Every quest earns "+x+"% more XP"}});if(c)o.push({who:"Trophies",b:{special:"coin",pct:c,text:"Quests pay "+c+"% more coins"}});return o};
var dgRoomMultBase=roomMult;
roomMult=function(i){var m=dgRoomMultBase(i),b=dgBuff("biz"),r=bslot(i);return b&&r&&ROOMT[r.t]&&ROOMT[r.t].coin?m*(1+b/100):m};

/* the Rift Mask (ROOMS's art, Cal approved): a wearable found only at the bottom of the Obsidian Spire, never sold. It comes home
   as a rare find once the Spire's own shards are found; then it waits in the Wardrobe like any other piece. */
var DGWEAR={id:"gx_dg_riftmask",from:["spire"]};
SHOP.push([DGWEAR.id,"a_acc","Rift Mask",0,1,"Black, with a violet crack of light across it. Found at the bottom of the Obsidian Spire.",{gar:"dg_riftmask",b:"dungeon",dungeon:1}]);
/* something to wear you do not own yet, clothes only (no eye colors or dyes): from a brand that has left the Shop first, then the
   brands on sale, then the basics */
var CRAWLWEAR=/^a_(top|pants|shoes|acc|hat|back|mask)$/;
function crawlWear(){var st={};try{st=dropState()||{}}catch(e){}var ids=function(L){return (L||[]).map(function(b){return b.id})},tiers=[ids(st.vault),ids(st.live),["basics"]];
  var ok=function(it,bs){var e=it[6]||{};return CRAWLWEAR.test(it[1])&&!e.dungeon&&bs.indexOf(e.b)>=0&&!S.owned[it[0]]&&(typeof isRigItem!=="function"||isRigItem(it))&&itemFits(it)};
  for(var t=0;t<tiers.length;t++){var pool=SHOP.filter(function(it){return ok(it,tiers[t])});if(pool.length)return pool[Math.floor(Math.random()*pool.length)]}
  return null}
/* what a dungeon still hides: its trophy pieces and shards, the ally trapped there, and the Rift Mask in the Spire */
function crawlHidden(d){var D=dngInit(),out=[];
  (DGLOOT[d.id]||[]).forEach(function(L){L[1].forEach(function(id){if(!dgHas(L[0],id))out.push({kind:"piece",set:L[0],id:id})})});
  DNPC.forEach(function(n){if(n.d===d.id&&!D.npcs[n.id])out.push({kind:"ally",id:n.id})});
  /* the mask is the Spire's last prize: only once its shards are all found (QA: it was dropping before them) */
  if(DGWEAR.from.indexOf(d.id)>=0&&!S.owned[DGWEAR.id]&&!out.some(function(g){return g.kind==="piece"}))out.push({kind:"wear",id:DGWEAR.id});
  return out}
function crawlLeft(d){return crawlHidden(d).length}
/* the chance a crawl brings a rare find: ECON.crawlRare, the trophy perks and STR (dgBuff("gift")), and every Hero's Lair upgrade */
function crawlChance(){var lair=S.base&&S.base.slots.filter(function(r){return r&&r.t==="lair"})[0];return ECON.crawlRare+dgBuff("gift")+(lair?addonsOf(lair).length*ECON.crawlLair:0)}
function crawlFind(d,r){var D=dngInit(),sure=(D.dry||0)>=ECON.crawlPity-1,g;
  /* a crawl from before the merge that had already spotted the trapped ally brings them home */
  var old=r&&r.npc&&DNPC.filter(function(n){return n.id===r.npc&&!D.npcs[n.id]})[0];
  if(old)g={kind:"ally",id:old.id};
  else{if(!sure&&Math.random()>=crawlChance()){D.dry=(D.dry||0)+1;persist();return null}
    /* what the dungeon still hides, or something to wear; once it hides nothing, half the finds are a strongbox of coins */
    var pool=crawlHidden(d),w=crawlWear(),box={kind:"coins",n:Math.round(d.c[1]/10)*10};
    if(w)pool.push({kind:"wear",id:w[0],shop:1});
    g=!pool.length||(!crawlHidden(d).length&&Math.random()<.5)?box:pool[Math.floor(Math.random()*pool.length)]}
  D.dry=0;return dgGive(g)}
/* keep a find (once) */
function dgGive(g){if(!g||g.given)return g;g.given=1;
  if(g.kind==="piece"){g.first=!dgPieces();dgState()[g.set]=dgState()[g.set]||{};dgState()[g.set][g.id]=Date.now()}
  else if(g.kind==="ally")dngInit().npcs[g.id]=1;
  else if(g.kind==="wear")S.owned[g.id]=true;
  else if(g.kind==="coins"){S.coins+=g.n;S.earnedC+=g.n}
  persist();return g}
function dgIcon(set,id,big){var u=window.QBART&&QBART["ui_tr_"+TSETS[set].art+"_"+id+".webp"];
  return u?'<img class="dg-ic'+(big?' big':'')+'" src="'+u+'" alt="">':'<span class="dg-ic dg-ic0'+(big?' big':'')+'" aria-hidden="true">'+(set==="goblin"?"&#9813;":"&#9670;")+'</span>'}
/* plug and play: ui_tr_<set>_set.webp is the set's emblem, ui_relic_<id>.webp a relic's icon; a drawn stand-in until they exist */
function dgSetIcon(set){var u=window.QBART&&QBART["ui_tr_"+TSETS[set].art+"_set.webp"];return u?'<img class="dg-ic dg-set-ic" src="'+u+'" alt="">':''}
function dgRelicIcon(id){var u=window.QBART&&QBART["ui_relic_"+id+".webp"];return u?'<img class="dg-ic" src="'+u+'" alt="">':'<span class="dg-ic dg-ic0">&#10022;</span>'}
function dgGiftArt(){var u=window.QBART&&QBART["ui_gift.webp"];return u?'<img class="dg-gift" src="'+u+'" alt="">':'<div class="dg-gift dg-gift0">'+isoCrate()+'</div>'}
var DGPEND=null;
/* show a find (DGPEND = {g}); dgGive keeps it if that has not happened yet */
function dgReveal(){var P=DGPEND;if(!P)return;DGPEND=null;var g=dgGive(P.g),h;
  if(g.kind==="piece"){var T=TSETS[g.set],p=T.pieces.filter(function(x){return x.id===g.id})[0];
    h='<span class="label">'+(g.set==="amulet"?'A relic shard':'For the Trophy Room')+'</span>'+dgIcon(g.set,g.id,1)+'<h3>'+esc(p.name)+'</h3><p class="note">'+esc(T.name)+'. '+esc(p.d)+'</p><p class="dg-buff">'+esc(p.buff.text)+'</p>'
      +(dgDone(g.set)?dgSetIcon(g.set)+'<p class="dg-buff">Set complete. '+esc(T.bonus.text)+'.</p>':'<p class="note">'+T.pieces.filter(function(x){return dgHas(g.set,x.id)}).length+' of '+T.pieces.length+' pieces</p>')
      +(g.first?'<p class="note">The first trophy is home. A Trophy Room can now be built above the Hero\'s Lair.</p>':'')}
  else if(g.kind==="ally"){var n=DNPC.filter(function(x){return x.id===g.id})[0]||{name:"Someone",line:"",buff:{text:""}};
    h='<span class="label">A new ally</span><h3>'+esc(n.name)+'</h3><p class="note">'+esc(n.line)+' They followed you home and moved into your Loft.</p><p class="dg-buff">'+esc(n.buff.text)+'</p>'}
  else if(g.kind==="wear"){var it=shopItem(g.id);h='<span class="label">Something to wear</span><img class="dg-ic big" src="'+itemArt(it)+'" alt=""><h3>'+esc(it[2])+'</h3><p class="note">'+esc(it[5])+'</p><p class="dg-buff">'+(g.shop?'It is in your Wardrobe.':'It is in your Wardrobe. Nobody can buy one.')+'</p>'}
  else h='<span class="label">A strongbox</span><h3>'+(+g.n||0).toLocaleString()+' coins</h3><p class="note">Nothing rare was left down there, but nobody had opened this in years.</p>';
  render();modal('<div class="card box2 dgg">'+h+'<div class="row"><button class="btn" data-act="mclose">Done</button></div></div>');try{burst(innerWidth/2,innerHeight/3,24)}catch(e){}}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=dgopen]");if(!b)return;var m=b.closest(".modal");if(m)m.remove();dgReveal()});

/* ---------- relics: tiered milestones, hidden until earned ---------- */
function dgFullRooms(){return (S.base?S.base.slots:[]).filter(function(r){if(!r||!ADDONS[r.t])return false;var L=ADDONS[r.t].filter(function(a){return !(a[3]&&(a[3].retired||a[3].opens))});return L.length&&L.every(function(a){return r.a&&r.a[a[0]]})}).length}
var DGRELICS=[
  {id:"streak",name:"Unbroken",tiers:[7,14,30],d:function(n){return "Kept a streak going for "+n+" days."},v:function(){return S.best||0}},
  {id:"team",name:"Good Company",tiers:[1,3,5],d:function(n){return n===1?"Your first teammate.":n+" people on your team."},v:function(){return typeof teamList==="function"?teamList().length:0}},
  {id:"build",name:"Finishing Touch",tiers:[1,3,6],d:function(n){return n===1?"A room upgraded all the way.":n+" rooms upgraded all the way."},v:dgFullRooms},
  {id:"exped",name:"Expedition Ledger",tiers:[10,50,150],d:function(n){return n+" dungeon crawls brought home."},v:function(){return (S.story&&S.story.missions)||0}},
  {id:"quests",name:"Tally",tiers:[50,250,1000],d:function(n){return n+" quests completed."},v:function(){return S.total||0}},
  {id:"collect",name:"Curator",tiers:[1,5,10],d:function(n){return n===1?"Your first trophy.":n+" trophy pieces."},v:dgPieces}
];
function dgRelicCheck(){if(!loaded||!S.created)return;dgState();var got=[];
  DGRELICS.forEach(function(R){var v=0;try{v=R.v()}catch(e){}R.tiers.forEach(function(n,i){var k=R.id+(i+1);if(v>=n&&!S.relics[k]){S.relics[k]=Date.now();var c=150*(i+1);S.coins+=c;S.earnedC+=c;got.push(R.name+" "+["I","II","III"][i]+": +"+c+" coins")}})});
  if(got.length){persist();got.forEach(function(t,k){setTimeout(function(){pop("Relic found. "+t)},k*2200)})}}
setInterval(dgRelicCheck,20000);setTimeout(dgRelicCheck,6000);

var DGTAB="relics";
trophyHtml=function(){dgState();var h='',tabs='<nav class="dg-tabs" aria-label="Relics sections"><button class="dg-tab'+(DGTAB==="relics"?" on":"")+'" data-act="dgtab" data-v="relics">Relics</button>'+(dgPieces()?'<button class="dg-tab'+(DGTAB==="trophies"?" on":"")+'" data-act="dgtab" data-v="trophies">Trophies</button>':'')+'</nav>';
  if(DGTAB==="trophies"&&dgPieces()){
    if(!dgRoomBuilt())return tabs+'<section class="card panel"><h3 class="label">Trophies</h3><p class="note">You have '+dgPieces()+' piece'+(dgPieces()>1?'s':'')+' in storage. Build the Trophy Room above the Hero\'s Lair to put them on display.</p></section>';
    Object.keys(TSETS).forEach(function(s){var T=TSETS[s],n=T.pieces.filter(function(p){return dgHas(s,p.id)}).length;if(!n)return;
      h+='<section class="card panel dg-set">'+(dgSetIcon(s)?'<div class="dg-sethead">'+dgSetIcon(s)+'</div>':'')+'<h3 class="label">'+esc(T.name)+' &middot; '+n+'/'+T.pieces.length+'</h3><p class="note">'+esc(T.lore)+'</p><div class="dg-grid">'
        +T.pieces.map(function(p){var g=dgHas(s,p.id);return '<div class="dg-pc'+(g?'':' lock')+'">'+(g?dgIcon(s,p.id):'<span class="dg-ic dg-ic0">?</span>')+'<b>'+(g?esc(p.name):'Not found yet')+'</b><small>'+(g?esc(p.buff.text):'')+'</small></div>'}).join("")
        +'</div><p class="dg-buff'+(dgDone(s)?'':' lock')+'">Full set: '+esc(T.bonus.text)+'</p></section>'});
    return tabs+h}
  var earned=[];DGRELICS.forEach(function(R){R.tiers.forEach(function(n,i){var k=R.id+(i+1);if(S.relics[k])earned.push({id:R.id,name:R.name+" "+["I","II","III"][i],d:R.d(n),t:S.relics[k]})})});
  var total=DGRELICS.reduce(function(a,R){return a+R.tiers.length},0),bad=BADGES.filter(function(b){return S.badges&&S.badges[b[0]]});
  h+='<section class="card panel"><h3 class="label">Relics &middot; '+earned.length+' found</h3>'+(earned.length?'<div class="dg-grid">'+earned.map(function(r){return '<div class="dg-pc">'+dgRelicIcon(r.id)+'<b>'+esc(r.name)+'</b><small>'+esc(r.d)+'</small></div>'}).join("")+'</div>':'<p class="note">Nothing yet. Relics appear as you earn them.</p>')
    +(total>earned.length?'<p class="note">'+(total-earned.length)+' more to discover.</p>':'')+'</section>';
  if(bad.length)h+='<section class="card panel"><h3 class="label">Milestones</h3><div class="titles">'+bad.map(function(b){return '<span class="chip" title="'+esc(b[2])+'">'+esc(b[1])+'</span>'}).join("")+'</div></section>';
  return tabs+h};
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=dgtab]");if(!b)return;DGTAB=b.dataset.v;render()});
window.__qbDungeon={find:crawlFind,hidden:crawlHidden,chance:crawlChance,wear:crawlWear,give:dgGive,reveal:dgReveal,state:dgState,pieces:dgPieces,buff:dgBuff,relics:dgRelicCheck,SETS:TSETS};
