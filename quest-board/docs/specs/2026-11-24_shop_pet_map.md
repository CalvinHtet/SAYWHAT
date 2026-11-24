# Map of the Shop and the pets as they are (2026-11-24, LEAD's subagent; read before batch 3)

## The Shop (view "shop")
- Chain, last override first: 29zz_v132.js:45 gmShop (GM "Next drop" tab) > 29zz_v131.js:36 v31Shop (strips Upgrades/Interface, puts
  Stylist beside Wardrobe) > 29zz_v109.js:54 v9Shop > 29zz_pets.js:131 pzShopBase (Pets tab) > 29z_sale.js:43 > 29x_inbox.js:76 (coin
  bar) > BASE 15_shop.js:461. The bases at 10_app_a.js:861 and :1560 are dead.
- Screen, top to bottom: header.qs-head ("The Shop", coins, QS_WHEN line) > div.qs-bar (Wardrobe button qs-wdb, Stylist, countdown
  qs-cd) > nav.qs-floors when 2+ floors open (data-qsfl, 15_shop:477) > nav.qs-tabs (GM, Pets on the Boutique only, the live brands
  newest first, Wednesday's brand prefixed "↺ ") > the content for shopTab > p.qs-dev testing links.
- State: shopTab (10_app_a:768), floor QSFLOOR (15_shop:454). Click data-act="stab" sets shopTab (30_app_b.js:1947); [data-qsfl] sets
  the floor (15_shop:460). Floors: ECON.floors (29e_economy.js:155: street 0, boutique 30, atelier 70), shopFloors() 29l_drops.js:137.
- shopTab values: a brand id (qsBanner :509, qsMirror :437, qsGroups :411); "basics" = Stylist (15_shop:485-489); "wardrobe"
  (15_shop:490-494, wdBar/wdRack/wdReset in 29zw_wardrobe.js); "pets" (pzTab, 29zz_pets.js:121, only when QSFLOOR is boutique).
- The Vault has no tab: Wednesday's dropBack() brand is a normal brand tab; its splash says "THE VAULT IS OPEN" (25_splash:33).
- Shop gate: areaGate("shop") = no Closet (27_rooms.js:306).
- Upgrades/Interface: the bottom tab "sys" (29zz_v131.js:13-30): AREAS ["sys","Upgrades",1], gate !sysHas() (29sy_system.js:7, the
  Lair owns lr_console), sxHtml() with SXTAB upgrades/interface. Not reachable from the Shop any more. Already as Cal wants.
- Wardrobe: wardrobeModal (15_shop.js:504) = view shop, shopTab "wardrobe"; callers 20_loft.js:1698 (closet tap), data-act="wardrobe"
  (30_app_b.js:1946). The word "Wardrobe" to rename to Closet: 15_shop:476 and :467; 10_app_a:1447, :1452, :522; 30_app_b:366, :1514;
  29d_dungeon:109 (x2); 29y_free:134; 29zy_tour:69; 29zz_v117:25; 29zz_v133:53. Leave the furniture names (Wardrobe Lights, Sleek
  Wardrobe).
- Stylist: 15_shop.js:485-489; STYLIST={a_hair,a_hairc,a_eyes} (29zz_v122.js:12) + a_hairhi (v133:106); items built 15_shop:376-384
  (bs_hair_<m|f>_<id> 500, bs_dye_<id> 400, bs_eye_<id> 400, from QBDATA.creator) and bs_hi_<color>; owned S.owned, worn S.eq[slot].
  No eye shapes, tattoos or scars yet.
- Splashes: brandFresh/brandCheck (25_splash:41-42), floorSplash (29l_drops:186), final gate 29zz_v135.js:47 (only when view is shop).

## Pets (29zz_pets.js)
- Data: PETS wolf/wyvern/slime (:13), PET_PRICE 3000, PZ_K 40/300 (:16), PC_PRICE head 350, neck 300, base 300, body 500, aura 600
  (:18); prices x priceK in 29zzz_econ.js:20.
- Save: S.pet={k,t} (one creature, petMine :23); S.petw[kind][slot] and S.dogw[dog][slot] worn (slots head/neck/body/aura; "base" maps
  to neck, pzSlot :26); S.owned["pc_"+id]; S.pbref (Patio dog bed refund). No pet names in the save.
- Clothes drops: PZ_DAY0 2026-11-16, pzSlotNow (:31) counts Mon/Thu 8 am; pzLine (:36) 12 ids a line; pzDrop (:39) 2 per line per drop.
- UI: pzCard (:105) adopt pzbuy / give up pzadopt; pzClCard (:111) pzclbuy/pzwear; pzTab (:121); pzBuyModal (:141, "only one pet");
  pzAdoptModal (:147, crying loop frames 7-10). Gate: only the Boutique floor at level 30.
- Drawing: pzFrameInfo (:44), pzPlace (:49), pzSprite (:62), pzLoftSpr (:98), pzLoftFrame (:83; frames 0-1 idle, 2-3 move, 4 sit,
  5 sleep, 6 fun, 7-10 cry). Town pedestal: pzMyPet, socWorldDoc pet:{k,w} (:194-208).
- Dogs: Bedroom addons 27_rooms.js:45-48 (bd_pluto 400, bd_chop 400, bd_dbed1 200, bd_dbed2 200; ADDREQ chain :49); drawn 27_rooms:85-89
  (beds hmx_dogbed, C.dogs); sprites lfDogSpr 20_loft.js:1546. Side quest "Walkies" 29zs_side.js:9-63. Dog visits 29k_friends.js:61-62.
- In the Loft: pzBed(C,room) (:175) draws pbed_<k> at pet_art.spots[room] (bedroom [8.9,2.6], patio [1.7,2.6]) with a 1.2 x 1.0
  footprint; 27_rooms:89 adds the pet as a "dog" actor; behaviour lfDogNext (20_loft.js:1446-1460): bed, sit, wander, sometimes near the
  player; it does not follow. Pathing lfGo/lfRoute on C.nav (:1412) avoids furniture; Patio lfPaPath (:3175).
- data/pet_art.json: spots, pets.<id> {frames(11), w, h, cx, bed{id,w,h,sleepOff}, fit{body,cells,headHide}, anchors[11] of
  {head,neck,body,aura}=[x,y,deg]}; ids wolf, wyvern, slime, k4, k5, k6 (the k's have anchors null and are not in PETS); dogs, dogFit.
  Loaded by tools/build.py:99 into QBDATA.pet_art (pzData, pets:21).
- data/pet_clothes.json: 48 pieces (pw_, pv_, ps_, pd_), 12 a line, 3 per slot; art ppc_<id>_<cell>.
- No Calvin/Sydney visitor exists yet (29kv_visitors.js is other players; 29k_friends.js is the story friends).

## Loft actors and friend visits (second map, 2026-11-24)
- window.LFNOCHAR=true (20_loft.js:2): lfDesired (20_loft.js:1334) always takes its first branch. "me" is ONE actor, always in the first
  Bedroom; no actor ever changes room (lfSync 1374 deletes and recreates one whose desired room changed). Dogs: any room whose C.dogs
  has entries gets {id:"dog:"+d.id, room, role:"dog", dname, bed}; only the Bedroom fills C.dogs.
- Room window: lfPvStart (20_loft.js:1741) clones each lfDesired entry of that room as "pv:<id>" in LFMETA[uid]; the Patio window also
  clones the Bedroom's me and dogs (1755-1761). In the building view the Patio slot has no actors; the Bedroom's walk onto its patio zone.
- lfDogNext (1446-1461): patio branch; bed 28% (and after every run); sit to 45%; run to a "wander" spot to 72%; else "dognear" (a
  point .3-.9 in front of "me", only in the same room). 28_missions.js:12 wraps it (6% poop).
- Pathing: footprints recorded while a room draws (lfSpr/lfBox -> lfRecBox, 935) build C.nav (cells .25); lfGo (1412) moves a target
  to lfFreeNear and routes with A* (lfRoute 1078). A dog can cross furniture when (a) its start or goal is inside a footprint (softened,
  4x cost), (b) A* fails (straight line), (c) the room is a painted one with no footprints, (d) dogs never re-check while walking (only
  "me" does, 1499-1504).
- Footprints by room: Bedroom and Game Room (27b_skins.js:65-111) have real sprites; the Patio's four pieces too; the Closet
  (27_rooms.js:112-134) records NONE (its island is walkable, the base wander spot 3.5,3.5 sits on it); the Lair (27_rooms.js:136-141)
  only lr_holo (6.1,5.6, 1.8 x 1.8). Every autoRoom has three base wander spots (26_world.js:225) and a door spot.
- Test hook: window.__qbLoft() -> {A:LFA, C, go, route, blocked, roomCtx}; actors "me", "dog:pet", "pv:..." with x, y, room, mode.
- Visits (29k_friends.js): FRIENDS key:{name, tag, spec:{body, skin, hairStyle, hairColor, top/topColor, bottom/bottomColor,
  shoe/shoeColor, eq:[item ids]}} (look via fvLook, :10); FVISITS {id, who:[keys or "dog:<name>"], w, place, need?, text, buff?, coin?}
  (:33-63); fvPick (:78-83) needs the dogs adopted (fvHasAddon bd_pluto/bd_chop: gone since v150, so the two dog visits never roll);
  fvCheck (:122) once a day, 3+ days apart, 35%; S.visit={d,t,who,id,place}; fvShow (:111) the card; fvNames hardcodes the dogs' names.
  lfVisitors (20_loft.js:1365) places each human in lfVisitRoom(place) and DROPS "dog:" members. No Calvin or Sydney data exists.
