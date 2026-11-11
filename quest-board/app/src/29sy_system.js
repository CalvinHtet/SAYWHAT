/* ---------- the System (W48; Cal, 2026-11-10: "The Upgrades and Interface should only appear after we unlock the big screen in the
   lair. I want there to be a button in the lair on the giant screen that leads to another shop that has upgrades and interface
   upgrades. This page is just a shortcut to the tab within The Shop tab that contains the upgrades and interface upgrades.") ----------
   The big screen is the Command Console (lr_console, the lair_u_desk layer: a curved desk under a wall-wide map screen). Until it
   is bought the Shop has no Upgrades or Interface tab and nothing anywhere talks about them; permanent upgrades and interface items
   already owned keep working. Once it is, its screen in the Lair's window is a button that opens the Shop on Upgrades. */
function sysHas(){return !!(S&&S.base&&S.base.slots.some(function(r){return r&&r.t==="lair"&&r.a&&r.a.lr_console}))}
function sysOpen(tab){try{closeModals()}catch(e){}window._qsSeen=1;view="shop";shopTab=tab||"upgrades";render();window.scrollTo(0,0)}
/* the screen, in the console layer's own pixels (821 x 645): the map screen's four corners */
var SYSSCR="150,178 294,117 294,205 150,262";
var sysLairBase=LFROOM.lair;
LFROOM.lair=function(C){sysLairBase(C);
  /* only in the Lair's own window (its preview is drawn with key 90 and up), not in the building view, where a tap opens the room */
  try{if(!(C.key>=90)||!sysHas())return;var A=LFLR,img=artRoom(C,"lair_u_desk",A.T,A.a,A.b,0,A.d),m=img&&/transform="(matrix\([^)]*\))"/.exec(img);if(!m)return;
    C.decals.push('<g class="lrsys" data-sys="open" transform="'+m[1]+'" role="button" aria-label="Open Upgrades and Interface"><polygon points="'+SYSSCR+'"/>'
      +'<text x="222" y="196" transform="rotate(-23 222 196)">UPGRADES</text></g>')}catch(e){}};
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-sys]");if(!b)return;e.stopPropagation();sysOpen(b.dataset.sys==="ui"?"interface":"upgrades")});
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbSystem={has:sysHas,open:sysOpen};
/* ---- the permanent upgrades' cascade (Cal, 2026-11-10: "I want the upgrades to already be there but in tiers. like tier 1 merchant seal.
   Then merchant seal 2 unlocks. but at first, there should only be 3 upgrades. And once upgraded, the next tier of upgrade shows up below
   it.") ----
   A tiered line (Merchant Seal I-III, Focus Rune I-III: each tier's req is the one before) shows what is owned and the next tier right
   under it. The single upgrades (SYSSINGLE, cheapest first) work the same way as one line, so the tab opens on three cards: Merchant
   Seal I, Focus Rune I and the Frost Charm. No level shows or gates them; the price pass in 29e_economy.js prices each by payback at its
   own level, so each tier costs clearly more than the one before. Owned ones stay listed (a save that owns a tier keeps it). */
var SYSSINGLE=["bf_freeze","bf_streak","bf_away"];
function sysBuffs(items){var own=function(x){return !!(S.owned&&S.owned[x[0]])},by={},out=[];items.forEach(function(x){by[x[0]]=x});
  var heads=items.filter(function(x){return (x[6]||{}).req==null&&SYSSINGLE.indexOf(x[0])<0});
  heads.forEach(function(h){var x=h,n=0;while(x&&n++<6){out.push(x);if(!own(x))break;x=items.filter(function(y){return (y[6]||{}).req===x[0]})[0]}});
  for(var i=0;i<SYSSINGLE.length;i++){var s=by[SYSSINGLE[i]];if(!s)continue;out.push(s);if(!own(s))break}
  return out}
/* a real-life reward that names a room the player does not have yet waits off the level-up card (QA: the level-15 "Contraband
   Sweets" names a dessert before the Dessert Parlor) */
var SYSRWROOM={15:"dessert",70:"restaurant"};
function sysRwHeld(r){var t=SYSRWROOM[r[0]];return !!t&&!(S.base&&S.base.slots.some(function(x){return x&&x.t===t}))}
