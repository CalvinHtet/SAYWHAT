/* ---------- the rollback for v1.31 (APPV 134): v1.30's game with v1.31's level curve, so a save whose XP v1.31 moved (xpc6) keeps its
   level here too (on curve 5 it would jump up). Copied from 29zzz_econ.js. ---------- */
(function(){var E=ECON;E.lvFirst=20;E.lvRamp=6;E.lvFlat=170;E.lvK=.65;E.lvP=2;E.lvTop=.35;E.lvTopFrom=40})();
/* ---- curve 6 for saves made on curve 5 (v1.30 and before): the same level and the same share of the way to the next, as curves 3 to 5
   moved over (30_app_b.js merge, xpc4/xpc5). XP is the only number moved, with the Weekly Warrior's start (wkg.x0) by the same amount;
   level pay, gates and the level a player has reached stay as they were. Saves made new from here are on curve 6 already. ---- */
var CUMT5=[0,0];(function(){for(var L=1;L<=MAXL+50;L++)CUMT5.push(CUMT5[L]+Math.round(L<6?20+115*(L-1)/5:135+.315*Math.pow(L-6,2)+(L>40?.2*Math.pow(L-40,2):0)))})();
function cum5(L){return L<=1?0:L<CUMT5.length?CUMT5[L]:CUMT5[CUMT5.length-1]+(L-CUMT5.length+1)*(CUMT5[CUMT5.length-1]-CUMT5[CUMT5.length-2])}
var c6Fresh=fresh;fresh=function(){var f=c6Fresh.apply(this,arguments);f.xpc6=1;return f};
var c6Merge=merge;merge=function(d){var move=!!(d&&d.epoch===QB_EPOCH&&!d.xpc6&&d.xpc5);var r=c6Merge.apply(this,arguments);
  if(move&&S){var x=S.xp||0,L=1;while(L<MAXL+49&&x>=cum5(L+1))L++;var fr=(x-cum5(L))/Math.max(1,cum5(L+1)-cum5(L)),nx=Math.round(cum(L)+fr*(cum(L+1)-cum(L)));
    if(S.wkg&&typeof S.wkg.x0==="number")S.wkg.x0+=nx-x;S.xp=nx}
  if(S&&d&&d.epoch===QB_EPOCH)S.xpc6=1;return r};
