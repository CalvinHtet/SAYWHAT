/* ---------- unlocks one at a time (Cal, 2026-11-05: "I want there to be unlocks along the way, not multiple unlocks from 1
   level") ----------
   A trial releases stored XP, so several levels can arrive at once (QA: the first trial took a player from 4 to 9 and
   showed the Wheel and Relics together). A new area (Hall, Wheel, Relics, ...) is now revealed one per level-up: the lowest
   one waiting. Any others wait for the next level-up, or for the next day if no level-up comes. Saves keep every area they
   already reached. The Shop and the Dungeons still open with their rooms (areaGate in 27_rooms.js). */
/* Never made before the save has loaded: a record made at level 1 during boot would lock a high-level save's areas (LEAD
   found it on v0.50's check). Until then every area counts as seen. */
var AREAALL={};
function areaOn(){if(!loaded){AREAS.forEach(function(a){AREAALL[a[0]]=1});return AREAALL}
  if(!S.areaOn||typeof S.areaOn!=="object"){S.areaOn={};var lv=effLvl();AREAS.forEach(function(a){if(a[2]<=lv)S.areaOn[a[0]]=1})}return S.areaOn}
function areaWaiting(id){var on=areaOn(),a=AREAS.filter(function(x){return x[0]===id})[0];return !!(a&&a[2]>1&&effLvl()>=a[2]&&!on[id])}
/* Cal: several unlocks together is fine "but not all the time and not this early": below level 10 areas and story steps
   share one slot a day (QA's rerun: days 1, 3 and 4 still brought an area and a story step together) */
/* QA (886b385): keyed on each unlock's own level, not the player's, so a player who leaps past 10 still gets the early
   unlocks one a day; and a waiting story step goes first, so the Garden is not pushed back by the Wheel and Relics */
function unlockSlotFree(L){return (L||0)>=ECON.oneSlotBelow||S.unlockDay!==today()}
function unlockTake(){S.unlockDay=today()}
function areaReveal(){var w=AREAS.filter(function(a){return areaWaiting(a[0])}).sort(function(x,y){return x[2]-y[2]})[0];
  if(!w||!unlockSlotFree(w[2]))return null;
  var sl=w[2]<ECON.oneSlotBelow&&typeof styReadyLow==="function"?styReadyLow():0;if(sl&&sl<=w[2])return null;/* a story step from the same or a lower level goes first */areaOn()[w[0]]=1;S.areaDay=today();unlockTake();persist();return w}
function areaLowestWaiting(){var w=AREAS.filter(function(a){return areaWaiting(a[0])}).map(function(a){return a[2]});return w.length?Math.min.apply(null,w):0}
var unlAreaGateBase=areaGate;
areaGate=function(id){return unlAreaGateBase(id)||areaWaiting(id)};
/* a day with no level-up still brings the next waiting area */
setInterval(function(){if(!loaded||!S.created||S.areaDay===today()||document.querySelector("#layer .modal"))return;var w=areaReveal();if(w){render();pop(w[1]+" is open")}},20000);
window.__qbUnlock={on:areaOn,waiting:areaWaiting,reveal:areaReveal};
