/* ---------- free items and relic tiers (Cal, 2026-11-10) ----------
   Never the same item twice (Cal: "For items gained from quests or chests, make sure no item is gained twice"): every free piece
   of clothing comes through freeItem, which picks only what the player does not own and can wear (their body, a piece the rig
   draws, no dungeon pieces, no basics unless asked). Used by the Daily Quest's 300 chest, level crates, the Wheel's slivers,
   crawl finds and the Weekly Warrior prize. When nothing is left it returns null and the caller pays coins instead.
   Relic tiers (Cal: "create multiple tiers of relics or low, mid, high, and legendary relics ... a clear indication of the rank
   tier based off of a bronze, silver, gold border. And for legendary relics, it should be a white and purple color with wings on
   the borders." "household heirlooms ... only for the low tier. the mid and high and legendary should be fantasy, dungeon, anime,
   and otherworld artifacts"): RELICS2 is the list (placeholder names and buffs until Cal picks the real ones; buffs in
   ECON.relicBuff), S.relics2 = {id: time found}, the collection sits in the Relics tab by tier. The pictures are drawn in code
   until ui_relic2_<id>.webp exists (docs/RELIC_ART.md is the list for the Mac). A relic is never given twice: another one of the
   same tier, else coins (ECON.relicDup). Legendary relics do not come from chests (Rafe's treasure hunts, later). */
/* opts: slots (a RegExp on the item's slot), brands ("all" or a list of brand ids), basics (true: the basics count too), lv (the
   highest item level allowed) */
function freePool(o){o=o||{};var all=BRANDS.map(function(b){return b.id}),bs=o.brands==="all"||!o.brands?all:o.brands,re=o.slots||CRAWLWEAR;
  return SHOP.filter(function(it){var e=it[6]||{};
    return re.test(it[1])&&!e.dungeon&&(bs.indexOf(e.b)>=0||(o.basics&&e.b==="basics"))&&!S.owned[it[0]]&&(typeof isRigItem!=="function"||isRigItem(it))&&itemFits(it)&&!(o.lv!=null&&it[4]>o.lv)})}
function freeItem(o){var p=freePool(o);return p.length?p[Math.floor(Math.random()*p.length)]:null}
function freeBrand(it){var b=BRANDS.filter(function(x){return x.id===(it&&it[6]&&it[6].b)})[0];return b?b.name:""}
/* ---- relic tiers ---- */
var R2TIERS=[["low","Low","Bronze"],["mid","Mid","Silver"],["high","High","Gold"],["legendary","Legendary","Legendary"]];
/* Cal's list (approved 2026-11-10, SPEC6): 12 low heirlooms, 8 mid and 6 high artifacts, 4 legendary from Rafe's hunts (lv: the
   hunt's level). The buffs are in ECON.relicBuff. */
var RELICS2=[
  {id:"r2_keyring",tier:"low",name:"Brass Key Ring",d:"Seven keys on a brass ring. Nobody knows what the smallest one opens."},
  {id:"r2_compass",tier:"low",name:"Worn Trail Compass",d:"The glass is scratched and the needle sticks a little at north."},
  {id:"r2_pen",tier:"low",name:"Ink-Stained Pen",d:"A fountain pen with a dented cap and blue ink worked into the grip."},
  {id:"r2_teacup",tier:"low",name:"Chipped Tea Cup",d:"Bone china with a blue rim and one chip by the handle."},
  {id:"r2_leash",tier:"low",name:"Braided Leash Charm",d:"A short braid of red leash cord with a brass clip on the end."},
  {id:"r2_whetstone",tier:"low",name:"Pocket Whetstone",d:"A grey stone worn into a shallow dip from years of edges."},
  {id:"r2_thimble",tier:"low",name:"Grandmother's Thimble",d:"Silver, worn smooth on one side from forty years of mending."},
  {id:"r2_libcard",tier:"low",name:"Old Library Card",d:"Paper, stamped with due dates going back to 1987."},
  {id:"r2_recipe",tier:"low",name:"Paper Recipe Card",d:"A soup recipe in pencil, with a grease spot on the corner."},
  {id:"r2_peg",tier:"low",name:"Wooden Laundry Peg",d:"A spring peg gone grey from the sun, still with a good grip."},
  {id:"r2_doorbell",tier:"low",name:"Brass Doorbell",d:"An old ringer from a front door, the button worn shiny."},
  {id:"r2_lunchtin",tier:"low",name:"Dented Lunch Tin",d:"A blue tin box with a dent in the lid and a name scratched inside."},
  {id:"r2_lantern",tier:"mid",name:"Moth-Wing Lantern",d:"Paper panels thin as moth wings. It glows brighter near treasure."},
  {id:"r2_shell",tier:"mid",name:"Tidecaller's Shell",d:"A pale spiral shell that sounds like rain when held to the ear."},
  {id:"r2_hilt",tier:"mid",name:"Ronin's Broken Hilt",d:"A sword hilt wrapped in faded cord. The blade snapped clean off."},
  {id:"r2_inkwell",tier:"mid",name:"Inkwell of Quiet Hours",d:"Black glass. The room goes a little quieter when it is open."},
  {id:"r2_foxbell",tier:"mid",name:"Fox Spirit Bell",d:"A small bronze bell on a red cord. It rings when no one touches it."},
  {id:"r2_monocle",tier:"mid",name:"Wraithglass Monocle",d:"Smoky glass in a silver rim. Faces look kinder through it."},
  {id:"r2_emberfox",tier:"mid",name:"Ember Fox Charm",d:"A carved fox with a coal-red eye that stays warm in the hand."},
  {id:"r2_hourglass",tier:"mid",name:"Tidebound Hourglass",d:"Sea-green sand that slows down when you need more time."},
  {id:"r2_starcompass",tier:"high",name:"Starforged Compass",d:"A gold compass that points at the nearest way out."},
  {id:"r2_phoenix",tier:"high",name:"Phoenix Ash Vial",d:"A stoppered vial of grey ash that is still faintly warm."},
  {id:"r2_mirror",tier:"high",name:"Mirror of the Second Self",d:"A hand mirror whose reflection always moves first."},
  {id:"r2_familiar",tier:"high",name:"Clockwork Familiar",d:"A brass owl the size of a fist that ticks when it blinks."},
  {id:"r2_gauntlet",tier:"high",name:"Oathbound Gauntlet",d:"One plated glove with a vow engraved along the knuckles."},
  {id:"r2_codex",tier:"high",name:"Codex of Ashen Stars",d:"A grey book whose star charts rearrange between readings."},
  {id:"r2_crown",tier:"legendary",lv:27,name:"Sunken Crown of Aldrath",d:"A sea-green crown pulled from a drowned throne room."},
  {id:"r2_wyrmheart",tier:"legendary",lv:52,name:"Wyrmheart Ember",d:"A coal from a dragon's chest that has never gone out."},
  {id:"r2_veil",tier:"legendary",lv:77,name:"Veil of the Thousand Doors",d:"A sheet of shimmering cloth. Every fold opens somewhere else."},
  {id:"r2_worldseed",tier:"legendary",lv:93,name:"The Worldseed",d:"A seed the size of a fist with a forest asleep inside it."}
];
function r2State(){if(!S.relics2||typeof S.relics2!=="object")S.relics2={};return S.relics2}
function r2Of(id){return RELICS2.filter(function(r){return r.id===id})[0]||null}
function r2Tier(t){return R2TIERS.filter(function(x){return x[0]===t})[0]||R2TIERS[0]}
/* a relic of tier t the player does not own yet, or null */
function r2Pick(t){var own=r2State(),pool=RELICS2.filter(function(r){return r.tier===t&&!own[r.id]});return pool.length?pool[Math.floor(Math.random()*pool.length)]:null}
function r2Give(r){if(!r)return null;r2State()[r.id]=Date.now();persist();return r}
/* what owned relics add (ECON.relicBuff): all (% XP on every quest), cl and xp (% XP on one quest group or a list of them), stat
   and xp (% XP on quests of a stat), first3 (% XP on the first 3 quests of the day), train (% Training XP), gift and mt (crawls:
   rare-find chance and time, fractions), rooms and inc (% income or produce in those rooms), biz (% income in every business),
   chest (% Daily Quest chest coins), freeze (a free streak freeze each month), crawl (crawls a day), rb (Room Bonus times this).
   Owning every relic of a tier adds ECON.relicSet % XP on every quest. */
function r2Owned(){var own=r2State();return RELICS2.filter(function(r){return own[r.id]})}
function r2Sum(k){var v=0;r2Owned().forEach(function(r){var b=(ECON.relicBuff||{})[r.id];if(b&&b[k])v+=b[k]});return v}
function r2Sets(){var own=r2State(),v=0;Object.keys(ECON.relicSet||{}).forEach(function(t){var L=RELICS2.filter(function(r){return r.tier===t});if(L.length&&L.every(function(r){return own[r.id]}))v+=ECON.relicSet[t]});return v}
function r2All(){return r2Sum("all")+r2Sets()}
function r2Buff(k){return r2Sum(k)}
function r2Rb(){var m=1;r2Owned().forEach(function(r){var b=(ECON.relicBuff||{})[r.id];if(b&&b.rb)m*=b.rb});return m}
function r2RoomInc(t){var v=0;r2Owned().forEach(function(r){var b=(ECON.relicBuff||{})[r.id];if(b&&b.rooms&&b.rooms.indexOf(t)>=0)v+=b.inc||0});return v}
var R2CLN={home:"Home sweep",out:"Outside run",admin:"Admin and day job",reset:"Reset",body:"Body",create:"Creative block",social:"People",boss:"Boss"};
function r2BuffTxt(id){var b=(ECON.relicBuff||{})[id]||{},o=[];
  if(b.all)o.push("+"+b.all+"% XP on every quest");
  if(b.cl)o.push("+"+b.xp+"% XP on "+[].concat(b.cl).map(function(c){return R2CLN[c]||c}).join(" and ")+" quests");
  if(b.stat)o.push("+"+b.xp+"% XP on "+b.stat+" quests");
  if(b.first3)o.push("+"+b.first3+"% XP on the first 3 quests each day");if(b.train)o.push("+"+b.train+"% Training XP");
  if(b.gift)o.push("+"+Math.round(b.gift*100)+"% rare finds on crawls");if(b.mt)o.push("crawls come home "+Math.round(b.mt*100)+"% sooner");
  if(b.rooms)o.push("+"+b.inc+"% "+(b.rooms[0]==="garden"?"Garden produce":b.rooms.map(function(t){return (ROOMT[t]||{}).name||t}).join(" and ")+" income"));
  if(b.biz)o.push("+"+b.biz+"% business income");if(b.chest)o.push("+"+b.chest+"% coins from Daily Quest chests");
  if(b.freeze)o.push("a free streak freeze every month");if(b.crawl)o.push("+"+b.crawl+" crawl a day");if(b.rb)o.push("every Room Bonus x"+b.rb);
  var s=o.join(", ");return s.charAt(0).toUpperCase()+s.slice(1)}
var r2GiftBase=dgBuff;dgBuff=function(k){return r2GiftBase(k)+(k==="gift"||k==="mt"||k==="biz"?r2Buff(k):0)};
var r2SocialBase=socialBuffs;
socialBuffs=function(){var o=r2SocialBase(),a=r2All(),cl={},st={};
  if(r2Sum("first3")&&Object.keys(S.done||{}).length<3)a+=r2Sum("first3");
  if(a)o.push({who:"Relics",b:{special:"all",pct:a,text:"Every quest earns "+a+"% more XP"}});
  r2Owned().forEach(function(r){var b=(ECON.relicBuff||{})[r.id];if(!b||!b.xp)return;if(b.cl)[].concat(b.cl).forEach(function(c){cl[c]=(cl[c]||0)+b.xp});if(b.stat)st[b.stat]=(st[b.stat]||0)+b.xp});
  Object.keys(cl).forEach(function(c){o.push({who:"Relics",b:{cl:c,pct:cl[c],text:(R2CLN[c]||c)+" quests +"+cl[c]+"% XP"}})});
  Object.keys(st).forEach(function(k){o.push({who:"Relics",b:{stat:k,pct:st[k],text:k+" quests +"+st[k]+"% XP"}})});
  return o};
/* the rest of the rule-benders */
var r2RoomBase=roomMult;roomMult=function(i){var m=r2RoomBase(i),r=bslot(i),v=r?r2RoomInc(r.t):0;return v?m*(1+v/100):m};
var r2TrainBase=econTrainXp;econTrainXp=function(d,f){var x=r2TrainBase(d,f),t=r2Sum("train");return t?Math.round(x*(1+t/100)):x};
var r2ChestBase=dqChest;dqChest=function(c){var v=r2ChestBase(c),t=r2Sum("chest");return t?Math.round(v*(1+t/100)):v};
var r2CrawlBase=dngPerDay;dngPerDay=function(){return r2CrawlBase()+r2Sum("crawl")};
/* Phoenix Ash Vial: a free streak freeze each calendar month, when a slot is free */
setInterval(function(){try{if(!loaded||!S.created||!r2Sum("freeze"))return;var m=today().slice(0,7);if(S.r2frz===m||S.freezes>=maxFreeze())return;
  S.r2frz=m;S.freezes++;persist();pop("Phoenix Ash Vial: +1 streak freeze this month")}catch(e){}},30000);
/* the picture: ui_relic2_<id>.webp when the Mac has painted it, else a gem drawn in the tier's colour; legendary cards get wings */
var R2COL={low:["#e0a46a","#8a5426"],mid:["#eef3fa","#8d9bb0"],high:["#ffe07a","#c08a1e"],legendary:["#f6f0ff","#8b5cf6"]};
function r2Icon(r,lock,noart){var u=!lock&&!noart&&window.QBART&&QBART["ui_relic2_"+r.id+".webp"],c=R2COL[r.tier]||R2COL.low;
  if(u)return '<img class="r2-img" src="'+u+'" alt="" data-r2="'+esc(r.id)+'">';
  return '<svg class="r2-img" viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="r2g'+r.tier+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+c[0]+'"/><stop offset="1" stop-color="'+c[1]+'"/></linearGradient></defs>'
    +(lock?'<text x="24" y="31" text-anchor="middle" font-size="20" font-weight="800" fill="'+c[1]+'">?</text>':'<path d="M24 5 L39 18 L24 43 L9 18 Z" fill="url(#r2g'+r.tier+')" stroke="'+c[1]+'" stroke-width="1.5"/><path d="M9 18 H39 M24 5 L18 18 L24 43 L30 18 Z" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1"/>')+'</svg>'}
/* a relic picture that fails to load becomes the drawn gem, not the broken-image icon */
document.addEventListener("error",function(e){var t=e.target,r;if(!t||t.tagName!=="IMG"||!t.dataset||!t.dataset.r2||!(r=r2Of(t.dataset.r2)))return;
  var d=document.createElement("div");d.innerHTML=r2Icon(r,false,true);if(d.firstChild)t.replaceWith(d.firstChild)},true);
function r2Wings(){var w='<svg viewBox="0 0 30 40" aria-hidden="true"><path d="M28 20 C20 4 8 2 2 6 C8 9 10 12 9 15 C4 15 1 18 1 21 C6 20 9 22 9 25 C5 27 4 31 5 34 C12 30 20 28 28 20 Z" fill="#f4eeff" stroke="#8b5cf6" stroke-width="1.4"/></svg>';
  return '<i class="r2-wing l">'+w+'</i><i class="r2-wing r">'+w+'</i>'}
function r2Card(r){var own=!!r2State()[r.id],T=r2Tier(r.tier);
  return '<div class="r2 r2-'+r.tier+(own?'':' lock')+'">'+(r.tier==="legendary"?r2Wings():'')+'<div class="r2-frame">'+r2Icon(r,!own)+'</div><small class="r2-t">'+T[2]+'</small><b>'+(own?esc(r.name):'Not found yet')+'</b>'
    +(own?'<small>'+esc(r.d)+'</small><small class="r2-b">'+esc(r2BuffTxt(r.id))+'</small>':(r.tier==="legendary"?'<small>Found on treasure hunts.</small>':''))+'</div>'}
function r2Html(){var own=r2State(),n=Object.keys(own).filter(function(id){return r2Of(id)}).length;
  return '<section class="card panel"><h3 class="label">Relic collection &middot; '+n+' of '+RELICS2.length+'</h3><p class="note">Low relics are heirlooms, the rest are artifacts. Keep filling the Daily Quest bar: a hidden chest can hold one.</p>'
    +R2TIERS.map(function(T){var L=RELICS2.filter(function(r){return r.tier===T[0]});if(!L.length)return "";var k=L.filter(function(r){return own[r.id]}).length;
      return '<h4 class="r2-h r2-h-'+T[0]+'">'+T[1]+' &middot; '+k+'/'+L.length+'</h4><div class="r2-grid">'+L.map(r2Card).join("")+'</div>'}).join("")+'</section>'}
var r2TrophyBase=trophyHtml;
trophyHtml=function(){var h=r2TrophyBase();if(typeof DGTAB!=="undefined"&&DGTAB!=="relics")return h;return h+r2Html()};
/* ---- the 300 XP chest's roll (ECON.chest3): a relic of a tier, or an accessory from any brand, never one already owned ---- */
function chest3Roll(){var T=ECON.chest3,tot=T.reduce(function(a,x){return a+x[1]},0),r=Math.random()*tot,k=T[T.length-1][0];
  for(var i=0;i<T.length;i++){if(r<T[i][1]){k=T[i][0];break}r-=T[i][1]}
  if(k==="acc"){var it=freeItem({slots:/^a_acc$/,brands:"all"});if(it){S.owned[it[0]]=true;persist();return {kind:"wear",it:it}}
    var c0=ECON.chestNone;S.coins+=c0;S.earnedC+=c0;persist();return {kind:"coins",n:c0,why:"every accessory"}}
  var rel=r2Pick(k);if(rel){r2Give(rel);return {kind:"relic",r:rel}}
  var c=ECON.relicDup[k]||0;S.coins+=c;S.earnedC+=c;persist();return {kind:"coins",n:c,why:"every "+r2Tier(k)[1].toLowerCase()+" relic"}}
function chest3Html(g){if(!g)return "";
  if(g.kind==="relic")return '<div class="r2 r2-'+g.r.tier+' r2-big">'+(g.r.tier==="legendary"?r2Wings():'')+'<div class="r2-frame">'+r2Icon(g.r)+'</div><small class="r2-t">'+r2Tier(g.r.tier)[2]+' relic</small><b>'+esc(g.r.name)+'</b><small>'+esc(g.r.d)+'</small><small class="r2-b">'+esc(r2BuffTxt(g.r.id))+'</small></div>';
  if(g.kind==="wear")return '<p class="dg-buff">'+esc(g.it[2])+(freeBrand(g.it)?' from '+esc(freeBrand(g.it)):'')+'. It is in your Wardrobe.</p>';
  return '<p class="dg-buff">+'+g.n.toLocaleString()+' coins. You already have '+esc(g.why)+'.</p>'}
/* test hook (sandbox and main only) */
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbFree={pool:freePool,item:freeItem,roll:chest3Roll,relics:RELICS2,state:r2State,buff:r2Buff};
