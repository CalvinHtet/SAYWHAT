/* ---------- unlocks one at a time (Cal, 2026-11-05: "I want there to be unlocks along the way, not multiple unlocks from 1
   level") ----------
   A trial releases stored XP, so several levels can arrive at once (QA: the first trial took a player from 4 to 9 and
   showed the Wheel and Relics together). A new area (Hall, Wheel, Relics, ...) is now revealed one per level-up: the lowest
   one waiting. Any others wait for the next level-up, or for the next day if no level-up comes. Saves keep every area they
   already reached. The Shop and the Dungeons still open with their rooms (areaGate in 27_rooms.js). */
function areaOn(){if(!S.areaOn||typeof S.areaOn!=="object"){S.areaOn={};var lv=effLvl();AREAS.forEach(function(a){if(a[2]<=lv)S.areaOn[a[0]]=1})}return S.areaOn}
function areaWaiting(id){var a=AREAS.filter(function(x){return x[0]===id})[0];return !!(a&&a[2]>1&&effLvl()>=a[2]&&!areaOn()[id])}
function areaReveal(){var w=AREAS.filter(function(a){return areaWaiting(a[0])}).sort(function(x,y){return x[2]-y[2]})[0];
  if(!w)return null;areaOn()[w[0]]=1;S.areaDay=today();persist();return w}
var unlAreaGateBase=areaGate;
areaGate=function(id){return unlAreaGateBase(id)||areaWaiting(id)};
/* a day with no level-up still brings the next waiting area */
setInterval(function(){if(!loaded||!S.created||S.areaDay===today()||document.querySelector("#layer .modal"))return;var w=areaReveal();if(w){render();pop(w[1]+" is open")}},20000);
window.__qbUnlock={on:areaOn,waiting:areaWaiting,reveal:areaReveal};
