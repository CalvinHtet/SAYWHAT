/* ---------- Cal 2026-11-26: seasonal brands ----------
   Cal: "Let's make seasonal brands that only show up during their respective season. Solvberg matches since it is the winter".
   A seasonal brand drops (and appears in the Sunday Vault) only in its season; outside it, it waits like a held brand (DROPS.hold), and it
   comes back when its season starts again. The brands' seasons, by month: winter November to February (Cal counts late November as
   winter), spring March to May, summer June to August, fall September and October.
   - SØLVBERG (après-ski) is winter; KAIMANA (surf club, still held) is summer.
   - Cal 11-26 (APPROVALS): "Use OAKMONT as the spring brand. Altitude as Fall brand."
   The rule starts with the one rotation (Mon 11-30, 29zz_v172.js), so no drop that has happened moves. */
var V211={from:"2026-11-30",brands:{sv:"winter",km:"summer",oak:"spring",alt:"fall"}};
function v211SeasonOf(ymd){var m=+String(ymd).slice(5,7);return m>=11||m<=2?"winter":m<=5?"spring":m<=8?"summer":"fall"}
function v211Out(id,ymd){var s=V211.brands[id];return !!s&&!!ymd&&ymd>=V211.from&&v211SeasonOf(ymd)!==s}
var v211Held=zxHeld;zxHeld=function(id,ymd){return v211Held.apply(this,arguments)||v211Out(id,ymd)};
/* the rotation's cache knows about the seasons */
try{var v211Key=v72Key;v72Key=function(){return v211Key.apply(this,arguments)+"|"+JSON.stringify(V211)};V72C=null}catch(e){}
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV211={cfg:V211,season:v211SeasonOf,out:v211Out};
