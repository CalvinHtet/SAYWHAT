/* ---------- v1.22: the Shop's floors and days, and the Stylist (Cal, 2026-11-18) ----------
   Cal: "Lets change the clothing drops to be Monday and thursday. The vault can still come in on Wednesday" (every floor, from Thu 11-19:
   ECON.floors days/days0 in 29e_economy.js and flIsDrop in 29l_drops.js; NICE COCK's Street drop moves from Friday to that Thursday),
   and "Lets remove the Basics from the street. Replace it with something else for new hairstyles, eye shapes, mouth, like a stylist
   department" with "Off sale, owners keep" for the plain clothes. The Basics tab is the Stylist: haircuts, dyes and eye colours (new
   hairstyles, eye shapes and mouths come with ROOMS's art). The plain tees, hoodies, bombers, joggers, jeans, shorts and shoes are cut:
   off sale everywhere (itemFits, 29zx_simple.js), an owner keeps wearing them, and character creation still offers them.
   Then, looking at every brand: "I like altitude and solvberg. Redo everything else." (SØLVBERG's hold ends, the other five stay held,
   DROPS.hold in 29zx_simple.js), "Not a fan of chrome rain. Create a different brand" (CHROME RAIN held from 11-19, it never dropped; Cal
   had first asked for it on the Street, so it stays on the Boutique, held), and "For overpass, swap out the metal chain and the skate
   tool. Keep the dog tags. Redo those two accessories with something else." (the two cut below; ROOMS paints their replacements) */
var STYLIST={a_hair:1,a_hairc:1,a_eyes:1};
SHOP.forEach(function(it){if(it&&it[6]&&it[6].b==="basics"&&!STYLIST[it[1]])it[6].cut=1});
/* a player's own creator clothes are still theirs: qsGrantOriginals (15_shop.js) gave them only when itemFits, which a cut piece fails for
   anyone not owning it yet, so a new player would lose their starting outfit from the Wardrobe. For a Stylist-cut basic it asks the rule
   from before the cut (zxFits, 29zx_simple.js) */
qsGrantOriginals=function(){if(!S.created||!S.char)return;SHOP.forEach(function(it){var e=it[6];if(!e||!e.basic||!qsOriginal(it))return;
  if(e.cut&&e.b==="basics"&&!STYLIST[it[1]]?zxFits(it):itemFits(it))S.owned[it[0]]=true})};
/* OVERPASS's Padlock Chain and Skate Tool Lanyard: off sale (cut, as ZXCUT in 29zx_simple.js), an owner keeps wearing theirs (V22CUT below) */
/* VENOM ROSE (Cal, 2026-11-18): "remove the leather dad cap, leather pants, black skirt, the sunglasses, the rose print tee, the sheer mesh
   top and the leather jacket. Replace this with lingerie, a sexy crop top, skin tight top, seductive and revealing clothing". Those seven
   off sale (cut), owners keep wearing theirs; ROOMS paints the replacements */
/* SAYMØRE (Cal, 2026-11-18): "remove the plain white GO OFF t shirt. going forward, never create something this plain and simple" */
var V22CUT=["gx_o_lock","gx_o_tool","gx_v_cap","gx_v_leather","gx_v_tulle","gx_v_shade","gx_v_rose","gx_v_mesh","gx_v_biker","gx_sm_tee"];
SHOP.forEach(function(it){if(it&&it[6]&&V22CUT.indexOf(it[0])>=0)it[6].cut=1});
