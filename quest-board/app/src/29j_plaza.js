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
/* The open plaza (bld_plaza_s0) is painted in the same frame as the café but with empty sky above it, so the "Kode Plaza"
   sign, placed by the building's height, floated high over it (ROOMS). For a picture listed here, the sign moves down to sit
   just above the painting: top = where the painting starts, as a share of the picture's height; ratio = height / width. */
var PLAZATOP={"bld_plaza_s0.webp":{top:.373,ratio:1100/894}};
var plazaStreetBase=bldStreet;
bldStreet=function(){var s=plazaStreetBase.apply(this,arguments);try{
    var k=plazaStage(),name=k===0?"bld_plaza_s0.webp":null,m=name&&PLAZATOP[name],url=m&&plazaArt(name);if(!m||!url)return s;
    var at=s.indexOf('<image href="'+url+'"');if(at<0)return s;
    var tag=s.slice(at,s.indexOf("/>",at)),num=function(a){var q=tag.match(new RegExp(" "+a+'="(-?[\\d.]+)"'));return q?+q[1]:NaN};
    var Y=num("y"),W=num("width"),H=num("height");if(isNaN(Y+W+H))return s;
    var dh=H/W>m.ratio?W*m.ratio:H,imgTop=Y+H-dh,paint=imgTop+m.top*dh;
    var g=s.indexOf('<g class="lfbsign"',at);if(g<0)return s;var ge=s.indexOf("</g>",g)+4,sign=s.slice(g,ge);
    var ry=sign.match(/<rect[^>]* y="(-?[\d.]+)"[^>]* height="([\d.]+)"/);if(!ry)return s;
    var dy=Math.round(paint-30-(+ry[1]+ +ry[2]));if(dy<=0)return s;
    var moved=sign.replace(/ y="(-?[\d.]+)"/g,function(_,v){return ' y="'+(+v+dy)+'"'});
    return s.slice(0,g)+moved+s.slice(ge)}catch(e){return s}};
