/* ---------- Cal 2026-11-27: every room upgrade adds a little XP ----------
   Cal: "every room upgrade that we buy should increase the experience gain by a little bit. Otherwise, it wouldn't be beneficial to
   spend money on upgrading a server rack when buying a lamp in the bedroom gives you extra experience."
   Rooms whose upgrades gave no XP (the businesses, the Hero's Lair, the Pond, ...) now give up to ECON.roomUpXp % XP on every quest
   when fully upgraded, split across the upgrades by price (like the Loft rooms' Room Bonus, 29e_economy.js), so a pricier upgrade
   adds more and a 37-upgrade room tops out where a 7-upgrade one does. The Loft rooms (Room Bonus, up to 3%) and the rooms whose
   upgrades already raise their own buff (Studio, Gym, Library, Dojo) are unchanged. A room with upgrade XP but no buff of its own
   (the Lounge, a bar, the Spa) now counts it too. Each upgrade card shows its "+x% XP". */
ECON.roomUpXp=1;
var V223ROOMS=[];
(function(){Object.keys(ADDONS).forEach(function(t){if(ECON.roomBonusRooms[t])return;var T=ROOMT[t];if(!T)return;var L=rbList(t);if(!L.length)return;
  var has=L.some(function(a){return a[3]&&a[3].xp>0});if(T.buff&&has)return;
  var tot=L.reduce(function(s,a){return s+(+a[2])},0);if(!(tot>0))return;V223ROOMS.push(t);
  L.forEach(function(a){var e=a[3]=a[3]||{};e.rx=Math.round(((T.buff?0:(e.xp||0))+ECON.roomUpXp*a[2]/tot)*100)/100})})})();
function v223Pct(r){return Math.round(addonsOf(r).reduce(function(s,a){return s+((a[3]&&a[3].rx)||0)},0)*100)/100}
/* one line in the buffs: every room's upgrades together */
var v223Base=baseBuffs;baseBuffs=function(){var o=v223Base.apply(this,arguments);
  try{var p=0;S.base.slots.forEach(function(r){if(r&&V223ROOMS.indexOf(r.t)>=0)p+=v223Pct(r)});p=Math.round(p*100)/100;
    if(p>0)o.push({who:"Room upgrades",b:{special:"all",pct:p,text:"All quests +"+p+"% XP"}})}catch(e){}return o};
/* the room's stats line says what its upgrades add */
var v223Stats=rmStats;rmStats=function(r,i){var h=v223Stats.apply(this,arguments);
  try{if(r&&V223ROOMS.indexOf(r.t)>=0){var add="Upgrades +"+v223Pct(r)+"% XP on every quest (up to +"+ECON.roomUpXp+"%)";h=h?h+". "+add:add}}catch(e){}return h};
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV223={rooms:V223ROOMS,buffs:function(){return baseBuffs()},crew:function(q){return crewPct(q||{})},pct:v223Pct};
