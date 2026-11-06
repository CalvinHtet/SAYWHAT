/* ---------- Kode Plaza grows on the street (Cal, 2026-11-06, to QA) ----------
   "I want Kode plaza to start off like a plaza. And then this current picture of the plaza is when the restaurant gets
   added. And then when more rooms get added, this building's picture on the building view screen should change and add
   more shops, but clicking on it would still go into the room view."
   The street picture follows the plaza's stage, k = plaza rooms owned - 1:
     k = 0 (the Garden alone)      art/app/bld_plaza_s0.webp, an open plaza (ROOMS)
     k = 1 (Garden + Restaurant)   art/app/bld_plaza.webp, today's picture
     k >= 2                        art/app/bld_plaza_s<k>.webp, more shopfronts (ROOMS paints as many as it likes)
   It uses the highest stage painted at or below the player's. Stage 0 never falls back to the café picture: until
   bld_plaza_s0 exists the plain drawn front stands in. Tapping still opens the rooms (bldStreet, 26_world.js). */
function plazaArt(name){var D=QBLoft.data;return (window.QBART&&QBART[name])||(D.arthash&&D.arthash[name]?D.loft.artBase+name+"?h="+D.arthash[name]:null)}
/* the plaza's rooms by name, so the count holds whatever the building map does */
var PLAZAROOMS={garden:1,restaurant:1,boba:1,dessert:1,skybar:1,rooftop:1,speakeasy:1};
function plazaStage(){var n=0;(S.base&&S.base.slots||[]).forEach(function(r){if(r&&PLAZAROOMS[r.t])n++});return Math.max(0,n-1)}
var plazaBldArtBase=bldArt;
bldArt=function(id){if(id!=="plaza")return plazaBldArtBase(id);var k=plazaStage();
  if(k===0)return plazaArt("bld_plaza_s0.webp");
  for(var j=k;j>=2;j--){var a=plazaArt("bld_plaza_s"+j+".webp");if(a)return a}
  return plazaBldArtBase(id)};
window.__qbPlaza={stage:plazaStage,art:function(){return bldArt("plaza")}};
