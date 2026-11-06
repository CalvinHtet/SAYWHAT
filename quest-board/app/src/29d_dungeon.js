/* ---------- dungeon gifts, trophy sets and relics (Cal, 2026-11-05) ----------
   A mission sometimes comes home with a gift: coins, XP, or a piece of a trophy set. Each mission has its own loot, so a set
   takes several runs from the right places. Pieces carry small buffs; a finished set carries a large one. The Trophies tab
   (a sub-tab of Relics) opens with the first piece and shows the sets once the Lair's Trophy Wall is built.
   Relics are one-time milestones in tiers, hidden until earned. The old trophies (badges) carry over as Milestones.
   Art from ROOMS, all optional: ui_gift.webp, ui_tr_<set>_<piece>.webp, ui_tr_<set>_set.webp. */
var TSETS={
  goblin:{name:"The Goblin King's Regalia",art:"goblin",
    lore:"Something under the city has been crowning itself with whatever the trains leave behind.",
    bonus:{text:"Missions pay 20% more coins and bring home gifts more often",mission:.20,gift:.10},
    pieces:[
      {id:"helm",name:"Iron Crown-Helm",d:"Hammered from stolen rail iron. The crown points are filed sharp.",buff:{text:"Missions pay 5% more coins",mc:.05}},
      {id:"chest",name:"Scrap-Plate Cuirass",d:"Salvaged signage, riveted and laced with copper wire. Heavier than it looks.",buff:{text:"Missions pay 5% more coins",mc:.05}},
      {id:"greaves",name:"Tunnel-Runner Greaves",d:"Worn smooth from years of service tunnels.",buff:{text:"Missions come back 10% sooner",mt:.10}},
      {id:"boots",name:"Hushstep Boots",d:"Soles wrapped in felt. His patrols never heard him coming.",buff:{text:"Gifts come home a little more often",gift:.05}},
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
/* where each piece can be found, and how often a mission brings anything home */
var DGLOOT={m1:{set:"goblin",p:["helm","boots"],gift:.30},m2:{set:"goblin",p:["greaves","chest"],gift:.30},
  m3:{set:"amulet",p:["dusk","ember"],gift:.40},m4:{set:"goblin",p:["sword","chest"],gift:.40},m5:{set:"amulet",p:["tide","thorn","silence"],gift:.55}};
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
var dgPayBase=msPay;
msPay=function(q){var p=dgPayBase(q);return {c:Math.round(p.c*(1+dgBuff("mc")+dgBuff("mission"))),x:Math.round(p.x*(1+dgBuff("mxp")+dgBuff("mission")))}};
msMins=function(q){return Math.max(5,Math.round(q.mins*(1-dgBuff("mt"))))};

/* the gift: decided when a mission is collected, opened by the player */
function dgRoll(mid){var L=DGLOOT[mid];if(!L)return null;var chance=L.gift+dgBuff("gift");if(Math.random()>=chance)return null;
  var t=dgState(),miss=L.p.filter(function(id){return !dgHas(L.set,id)}),pity=(S.trophy._dry||0)>=5;
  var r=Math.random();
  if(miss.length&&(pity||r<.32)){S.trophy._dry=0;return {kind:"piece",set:L.set,id:miss[Math.floor(Math.random()*miss.length)]}}
  S.trophy._dry=(S.trophy._dry||0)+1;var q=MS_LIST.filter(function(x){return x.id===mid})[0]||{c:150,x:30};
  return {kind:"coins",n:Math.round(q.c*(.6+Math.random()*.6)/10)*10}}
function dgIcon(set,id,big){var u=window.QBART&&QBART["ui_tr_"+TSETS[set].art+"_"+id+".webp"];
  return u?'<img class="dg-ic'+(big?' big':'')+'" src="'+u+'" alt="">':'<span class="dg-ic dg-ic0'+(big?' big':'')+'" aria-hidden="true">'+(set==="goblin"?"&#9813;":"&#9670;")+'</span>'}
/* plug and play: ui_tr_<set>_set.webp is the set's emblem, ui_relic_<id>.webp a relic's icon; a drawn stand-in until they exist */
function dgSetIcon(set){var u=window.QBART&&QBART["ui_tr_"+TSETS[set].art+"_set.webp"];return u?'<img class="dg-ic dg-set-ic" src="'+u+'" alt="">':''}
function dgRelicIcon(id){var u=window.QBART&&QBART["ui_relic_"+id+".webp"];return u?'<img class="dg-ic" src="'+u+'" alt="">':'<span class="dg-ic dg-ic0">&#10022;</span>'}
function dgGiftArt(){var u=window.QBART&&QBART["ui_gift.webp"];return u?'<img class="dg-gift" src="'+u+'" alt="">':'<div class="dg-gift dg-gift0">'+isoCrate()+'</div>'}
var DGPEND=null;
function dgShow(hero,mission,g){DGPEND={hero:hero,g:g};
  modal('<div class="card box2 dgg"><span class="label">'+esc(mission)+'</span><h3>'+esc(hero)+' brought something back</h3>'+dgGiftArt()+'<div class="row"><button class="btn" data-act="dgopen">Open it</button></div></div>')}
function dgReveal(){var P=DGPEND;if(!P)return;DGPEND=null;var g=P.g,h;
  if(g.kind==="piece"){var T=TSETS[g.set],p=T.pieces.filter(function(x){return x.id===g.id})[0],first=!dgPieces();
    dgState()[g.set]=dgState()[g.set]||{};dgState()[g.set][g.id]=Date.now();
    h='<span class="label">'+esc(T.name)+'</span>'+dgIcon(g.set,g.id,1)+'<h3>'+esc(p.name)+'</h3><p class="note">'+esc(p.d)+'</p><p class="dg-buff">'+esc(p.buff.text)+'</p>'
      +(dgDone(g.set)?dgSetIcon(g.set)+'<p class="dg-buff">Set complete. '+esc(T.bonus.text)+'.</p>':'<p class="note">'+T.pieces.filter(function(x){return dgHas(g.set,x.id)}).length+' of '+T.pieces.length+' pieces</p>')
      +(first?'<p class="note">The first trophy is home. A Trophy Room can now be built above the Hero\'s Lair.</p>':'')}
  else if(g.kind==="coins"){S.coins+=g.n;S.earnedC+=g.n;h='<h3>'+g.n.toLocaleString()+' coins</h3><p class="note">From a strongbox nobody had opened in years.</p>'}
  else{S.xp+=g.n;h='<h3>+'+g.n+' XP</h3><p class="note">Nothing else came back this time.</p>'}
  persist();render();modal('<div class="card box2 dgg">'+h+'<div class="row"><button class="btn" data-act="mclose">Done</button></div></div>');try{burst(innerWidth/2,innerHeight/3,24)}catch(e){}}
/* before 28_missions pays the mission, remember who went and where; after it, roll the gift */
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=msclaim]");if(!b)return;var m=msState(),run=m.run[b.dataset.id];if(!run)return;
  var q=MS_LIST.filter(function(x){return x.id===b.dataset.id})[0],hero=run.party[0]||"Your team";
  if(typeof teamHas==="function"&&!teamHas("sable"))return;/* the very first mission brings Sable home instead */
  var g=dgRoll(b.dataset.id);if(!g){persist();return}setTimeout(function(){dgShow(hero,q?q.n:"A mission",g)},700)},true);
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=dgopen]");if(!b)return;var m=b.closest(".modal");if(m)m.remove();dgReveal()});

/* ---------- relics: tiered milestones, hidden until earned ---------- */
function dgFullRooms(){return (S.base?S.base.slots:[]).filter(function(r){if(!r||!ADDONS[r.t])return false;var L=ADDONS[r.t].filter(function(a){return !(a[3]&&(a[3].retired||a[3].opens))});return L.length&&L.every(function(a){return r.a&&r.a[a[0]]})}).length}
var DGRELICS=[
  {id:"streak",name:"Unbroken",tiers:[7,14,30],d:function(n){return "Kept a streak going for "+n+" days."},v:function(){return S.best||0}},
  {id:"team",name:"Good Company",tiers:[1,3,5],d:function(n){return n===1?"Your first teammate.":n+" people on your team."},v:function(){return typeof teamList==="function"?teamList().length:0}},
  {id:"build",name:"Finishing Touch",tiers:[1,3,6],d:function(n){return n===1?"A room upgraded all the way.":n+" rooms upgraded all the way."},v:dgFullRooms},
  {id:"exped",name:"Expedition Ledger",tiers:[10,50,150],d:function(n){return n+" missions brought home."},v:function(){return (S.story&&S.story.missions)||0}},
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
window.__qbDungeon={roll:dgRoll,show:dgShow,reveal:dgReveal,state:dgState,pieces:dgPieces,buff:dgBuff,relics:dgRelicCheck,SETS:TSETS};
