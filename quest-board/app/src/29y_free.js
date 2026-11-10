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
var RELICS2=[
  {id:"r2_compass",tier:"low",name:"Grandfather's Compass",d:"A brass pocket compass, the lid engraved with initials nobody remembers."},
  {id:"r2_thimble",tier:"low",name:"Silver Thimble",d:"Worn smooth on one side from forty years of mending."},
  {id:"r2_teacup",tier:"low",name:"Chipped Teacup",d:"Bone china with a blue rim and one chip by the handle."},
  {id:"r2_lantern",tier:"mid",name:"Delver's Lantern",d:"Green flame behind smoked glass. It burns brighter near treasure."},
  {id:"r2_foxmask",tier:"mid",name:"Fox Mask Charm",d:"A small porcelain fox mask on a red cord, warm to the touch."},
  {id:"r2_gauntlet",tier:"mid",name:"Scorched Gauntlet",d:"One plated glove, the knuckles still black from a fire long out."},
  {id:"r2_starmap",tier:"high",name:"Starfall Map",d:"A chart of constellations that shift when you look away."},
  {id:"r2_moonshard",tier:"high",name:"Moonsteel Shard",d:"A sliver of a broken sword that hums at night."},
  {id:"r2_ember",tier:"legendary",name:"Phoenix Ember",d:"A coal that has not cooled since the day it fell from the sky."},
  {id:"r2_aegis",tier:"legendary",name:"Aegis of the Hollow Gate",d:"A shield face with a door carved in it. The door is warm."}
];
function r2State(){if(!S.relics2||typeof S.relics2!=="object")S.relics2={};return S.relics2}
function r2Of(id){return RELICS2.filter(function(r){return r.id===id})[0]||null}
function r2Tier(t){return R2TIERS.filter(function(x){return x[0]===t})[0]||R2TIERS[0]}
/* a relic of tier t the player does not own yet, or null */
function r2Pick(t){var own=r2State(),pool=RELICS2.filter(function(r){return r.tier===t&&!own[r.id]});return pool.length?pool[Math.floor(Math.random()*pool.length)]:null}
function r2Give(r){if(!r)return null;r2State()[r.id]=Date.now();persist();return r}
/* what owned relics add, by kind: xp and coin are percents on quests, biz a percent on business income, gift and mt fractions on
   crawls (rare finds, time) */
function r2Buff(k){var own=r2State(),v=0;Object.keys(own).forEach(function(id){var b=(ECON.relicBuff||{})[id];if(b&&b[k])v+=b[k]});return v}
function r2BuffTxt(id){var b=(ECON.relicBuff||{})[id]||{},o=[];if(b.xp)o.push("+"+b.xp+"% quest XP");if(b.coin)o.push("+"+b.coin+"% quest coins");if(b.biz)o.push("+"+b.biz+"% business income");
  if(b.gift)o.push("+"+Math.round(b.gift*100)+"% rare finds on crawls");if(b.mt)o.push("crawls back "+Math.round(b.mt*100)+"% sooner");return o.join(", ")}
var r2GiftBase=dgBuff;dgBuff=function(k){return r2GiftBase(k)+(k==="gift"||k==="mt"||k==="biz"?r2Buff(k):0)};
var r2SocialBase=socialBuffs;
socialBuffs=function(){var o=r2SocialBase(),x=r2Buff("xp"),c=r2Buff("coin");if(x)o.push({who:"Relics",b:{special:"all",pct:x,text:"Every quest earns "+x+"% more XP"}});if(c)o.push({who:"Relics",b:{special:"coin",pct:c,text:"Quests pay "+c+"% more coins"}});return o};
/* the picture: ui_relic2_<id>.webp when the Mac has painted it, else a gem drawn in the tier's colour; legendary cards get wings */
var R2COL={low:["#e0a46a","#8a5426"],mid:["#eef3fa","#8d9bb0"],high:["#ffe07a","#c08a1e"],legendary:["#f6f0ff","#8b5cf6"]};
function r2Icon(r,lock){var u=!lock&&window.QBART&&QBART["ui_relic2_"+r.id+".webp"],c=R2COL[r.tier]||R2COL.low;
  if(u)return '<img class="r2-img" src="'+u+'" alt="">';
  return '<svg class="r2-img" viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="r2g'+r.tier+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+c[0]+'"/><stop offset="1" stop-color="'+c[1]+'"/></linearGradient></defs>'
    +(lock?'<text x="24" y="31" text-anchor="middle" font-size="20" font-weight="800" fill="'+c[1]+'">?</text>':'<path d="M24 5 L39 18 L24 43 L9 18 Z" fill="url(#r2g'+r.tier+')" stroke="'+c[1]+'" stroke-width="1.5"/><path d="M9 18 H39 M24 5 L18 18 L24 43 L30 18 Z" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1"/>')+'</svg>'}
function r2Wings(){var w='<svg viewBox="0 0 30 40" aria-hidden="true"><path d="M28 20 C20 4 8 2 2 6 C8 9 10 12 9 15 C4 15 1 18 1 21 C6 20 9 22 9 25 C5 27 4 31 5 34 C12 30 20 28 28 20 Z" fill="#f4eeff" stroke="#8b5cf6" stroke-width="1.4"/></svg>';
  return '<i class="r2-wing l">'+w+'</i><i class="r2-wing r">'+w+'</i>'}
function r2Card(r){var own=!!r2State()[r.id],T=r2Tier(r.tier);
  return '<div class="r2 r2-'+r.tier+(own?'':' lock')+'">'+(r.tier==="legendary"?r2Wings():'')+'<div class="r2-frame">'+r2Icon(r,!own)+'</div><small class="r2-t">'+T[2]+'</small><b>'+(own?esc(r.name):'Not found yet')+'</b>'
    +(own?'<small>'+esc(r.d)+'</small><small class="r2-b">'+esc(r2BuffTxt(r.id))+'</small>':(r.tier==="legendary"?'<small>Found on treasure hunts.</small>':''))+'</div>'}
function r2Html(){var own=r2State(),n=Object.keys(own).filter(function(id){return r2Of(id)}).length;
  return '<section class="card panel"><h3 class="label">Relic collection &middot; '+n+' of '+RELICS2.length+'</h3><p class="note">Low relics are heirlooms, the rest are artifacts. The 300 XP Daily Quest chest can hold one.</p>'
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
