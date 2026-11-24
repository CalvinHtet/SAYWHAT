/* ---------- Cal's 2026-11-24 list, part 1: the Walk-in Closet at level 3 ----------
   Cal: "please allow the walk in closet to be purchasable once you hit level 3. For all the players that have already hit level 3, move
   the walk in closet upgrade to the top of their purchase list (DO THIS TASK FIRST BEFORE ANYTHING ELSE) and give them an exclamation
   point icon on the loft button to show them that there is something to be purchased now."
   - The Closet's upgrade (bd_ward2) can be bought from level 3. Its old gate (15% of the Bedroom's upgrades, 29zz_v133.js) still opens it
     too, so nobody who had it on offer loses it. Before either, its mystery card says "Level 2 of 3".
   - It no longer needs the Figurine Cabinet (bd_ward1), and the Cabinet stays in the list after the Closet is bought (it was hidden as
     superseded, 30_app_b.js roomAvail TSUP), so no upgrade is lost by buying the Closet first.
   - Top of the list: roomAvail already puts an upgrade that opens a room first once it can be bought.
   - The "!": 29o_alerts.js lights the Loft button for a room on offer the player has not looked at. A save at level 3 or more with no
     Closet gets it once more (S.cl143), even if it saw the Closet's card before. Opening the Loft clears it, as always. */
var CLOSETLV=3;
delete ADDREQ.bd_ward2;
window.RSSUP=window.RSSUP||{};window.RSSUP.bd_ward1=[];
var v43Line=unlockLine;unlockLine=function(t,d){var l=v43Line.apply(this,arguments);if(t!=="closet"||(l&&l[1]))return l;
  var lv=effLvl();if(lv>=CLOSETLV)return ["lv",true,"Level "+CLOSETLV];
  return ["lv",false,"Level "+lv+" of "+CLOSETLV,Math.min(1,lv/CLOSETLV),"Reach level "+CLOSETLV,"Level "+lv]};
function v43Bang(){if(!S||!S.created||typeof loaded==="undefined"||!loaded||S.cl143)return;
  if(hasRoom("closet")){S.cl143=1;return}
  if(effLvl()<CLOSETLV)return;/* below level 3 the Closet is not on offer yet: the "!" comes by itself when it is */
  var o=alSeen();if(!o.init)return;if(o.room)delete o.room.closet;if(o.bld)delete o.bld.closet;S.cl143=1;persist()}
var v43Paint=alPaint;alPaint=function(){try{v43Bang()}catch(e){}return v43Paint.apply(this,arguments)};

/* ---- the Board's "!" that could not be cleared (Cal 11-24: "i get an exclamation point showing on the board tab but theres nothing
   there for me to click"). The Players tab left the bar for the Town Hall (29zz_v137.js NAVHIDE.players), so the Board lit for it
   (alPaint: any hidden tab that is new), but nothing on the Board leads there and its view is never "players" (viewHtml sends it to the
   Hall), so it was never marked seen. Players now counts as seen when the Hall is opened, and lights the Town tab, not the Board. ---- */
var v43Tabs=alTabs;alTabs=function(){var t=v43Tabs.apply(this,arguments);if(t.players){delete t.players;t.hall=1}return t};
var v43Visit=alVisit;alVisit=function(){var r=v43Visit.apply(this,arguments);
  try{if(view==="hall"&&S&&S.created&&loaded){var o=alSeen();if(o.init&&!o.tab.players){o.tab.players=1;persist()}}}catch(e){}return r};

if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV143={line:function(t){return unlockLine(t)},tabs:function(){return alTabs()},seen:function(){return alSeen()},bang:v43Bang,paint:function(){return alPaint()}};
