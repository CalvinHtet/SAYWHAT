# Handoff

State as of 2026-11-05. Work top to bottom. Commit and push often. Update this file as items
finish, so the next session never has to guess.

## How the code is laid out

`app/src/*.js` are joined in filename order into one closure, so a later file can reassign an
earlier function. Rooms: `20_loft.js` (world, agents, Bedroom and old rooms), `21_restaurant.js`,
`22_garden.js`, `23_theater.js`. `24_screens.js` has animated screens, `25_splash.js` has room
and brand splashes, `15_shop.js` the shop, `16_interface.js` interface items. Economy formulas
are in `30_app_b.js` (`cum`, `levelPay`) and `10_app_a.js` (`coinsFor`, `simulate`).
Testing helper: `window.__qb.x()` returns state and internals.

Browser checks (not shipped): `rigtest/browser/` drives the real app headless; its README lists each script.
Test pages (not shipped): `rigtest/matrix.html` renders contact sheets straight from the rig. `?sheet=wear&arts=o_tee`
puts one item (or a comma list, a whole outfit) on both bodies in all 22 key poses; `?sheet=grid&arts=a,b&poses=idle,sitBack`
is one row per item; `?sheet=onepose&pose=stretchUp&arts=a,b%2Bc` lines items up in one pose (`%2B` combines). The older
`hats`, `hatface`, `neck`, `waist` and `legs` sheets check every pairing. Add `&scale=2` to zoom, `&nolabel=1` to drop labels.
`tools/strip_mannequin.py` removes a template body that got baked into an item layer (see Clothes below).

## Status of Cal's request below

Done: flat prices, three buildings, shop and dungeon gates, 5 missions a day, dogs with poop and clean up,
garden with fountain plaza, auditorium above the theater, six-scene movie, seats from behind.

Building view (`lfWorld` in `26_world.js`): every room is scaled to fill its own square, no arrows or text
there, a block only exists where a room does, empty lots are just a small marker on the ground, and the city
behind (`lfSkyline`) follows the real sun. The patio skyline only draws inside the room view.

Doors (`rmPortals`): a soft glow on the floor, and an arrow outside the room that only appears in the room view.
The arrow points where that room really is in the building. `ROOMCELL` is the map.

Room view: at the widest zoom the room reaches both sides of the frame, drag up and down if it does not all fit.

Restaurant (`LFROOM.restaurant` in `26_world.js`): `RSSIZE` is the dining room. The kitchen is a wing off its top right corner, sized by
`RSKIT`, outside the dining room's square. With no patio the floor is an L (`C.notch`, `rsNotchShell`); the patio fills the corner below the
wing. Booths on the left wall (two bench sprites and a table, so a guest sits inside), tables with four chairs, curved booth, pass with stools on the dining side of the wall.
Bar, Rooftop with pool and glass rail, marble strip Mall with empty storefronts: hand-placed in `27_rooms.js`.
Game Room, Boba, Dessert, Speakeasy, Arcade, Rhythm, VR, Bowling, Karaoke, Nightclub: hand-placed in
`27b_skins.js`, each with its own floor and wall painted in code (`roomSkin`).

Rules for placing things: flip 0 stands along the left wall facing lower right, flip 1 along the back wall facing
lower left. New art keeps its natural proportions, never pass a height. Do not reuse a sprite in two rooms. A couch
that faces a TV needs a rear-view sprite.

Room sizes: `d.layout=[W0,D0,pivotX,pivotY]` in a room def means its plan was drawn for W0 x D0 and is spread to the real
size by `roomSpread` in `26_world.js`. Anything before the pivot stays put, such as a bar and its stools.
Spacing audit, all upgrades owned (floor coverage): Rooftop 37%, Game Room 29%, Club 28%, Speakeasy 27%, Bar 22%, Bowling 22%,
all others under 20%. Nothing sits outside its room.
Gap audit on 2026-11-05 (every footprint pair in every room, all upgrades owned): no two pieces overlap except on purpose
(booth benches against their table, the pass on the kitchen partition, the band on its stage, the curved booth round its
table, grow lamps beside their beds). The Garden Estate was re-spaced: its tightest pairs are now the tool column at .3 to .4
of a tile. The Bedroom's dog beds were moved apart. The Theater lobby measured fine (tightest .2, the arcade beside the
claw machine, both against the wall).

Clothes: all 33 unfinished items are unlocked. `v_tulle` (Black Tulle Skirt) no longer has `soon:1` in `15_shop.js`, so it is on sale, and it has its raw sheet, layers, game files and icon. Nobody has looked at how it renders since (on ROOMS's list). Generating, the Chrome tab freezes while idle, so the page loop only moves while something keeps calling into the tab.

Four items had the whole template body baked into their layers, so whoever wore them got a purple cape, ghost legs and
an outline: Padlock Chain (`o_lock`), Carabiner Lanyard (`al_carab`), Tiny Oval Shades (`v_shade`) and Lace Corset Top
(`v_corset`). `tools/strip_mannequin.py` cut the mannequin out of their runtime `.webp` files (`--lens` for glasses,
`--garment` for the corset) and their shop icons were rebuilt from the cleaned layers. The source layers in Cal's Dropbox
still have the mannequin: if `pack.py` is ever rerun on them, run `strip_mannequin.py` again on those ten files, or better,
regenerate those four sheets. The Lace Headband (`v_lace`) trimmed the hair like a hat and left the head bald from
behind; it is now `noClip` in `data/items.json`, which `tools/items.py` respects.

Published 2026-11-05 as `APPV` 45 (page version 19) by LEAD, from a clean worktree of the commit: online saves work again
(the database returns frozen objects; `merge()` now copies), "Two saves found" when a device's save and the online one
disagree, the Shop's new lettering, taglines, countdown and painted banners, the yawn stretch, and the paused animations
behind room windows. Old-save test and `rigtest/browser/savecheck.js` passed on that build. Only `app.js`, `art_ui.js`,
`index.html` and `qbdata.js` changed; every live file was checked against the build by hash.

`APPV` 46 (page version 20): only the next 5 room upgrades show, 2+ levels away as mystery cards; ROOMS's Bedroom patio door.
`APPV` 47 (page version 21): the street of three buildings (The Loft, Kode Plaza, Calibur Mall) with placeholder fronts, only
the building you are in draws; the rig's painted-pose support (no painted art yet). Old-save test and savecheck passed on each.

## What was checked on 2026-11-05, and what was not

1. Clothes, both bodies, every pose: done in the rig, not in a room. All 48 `gx_o_*`, `gx_v_*` and `gx_al_*` items (tulle
   excluded) were rendered alone on each body they fit in all 22 key poses (`rigtest/matrix.html?sheet=wear`), plus six whole
   outfits in all 22 poses (two per brand, so each brand was seen on both bodies; seven outfit and body pairs), every hat with all three hair styles on both bodies front and
   back, every hat with every glasses and mask, every new neck piece over seven collared and hooded tops front and back, and
   every top over every bottom and every bottom over every shoe (front and back, at thumbnail size). Found and fixed: the
   four baked-in mannequins and the headband above. Also found: with an arm raised (`stretchUp`, `stretch`) most
   long-sleeve and boxy tops showed dark streaks fanning from the armpit to the hip, because one mesh cell stretched between
   the arm and the torso. Fixed later the same day (see Still to do, item 2). Not checked: every pose of a full outfit for every
   combination (the pairing sheets cover pairs, not triples), and anything in motion at full speed.
2. Guests in every room with people (16 rooms; the Closet, Lair, Patio and Game Room never have anyone in them, and the
   Bedroom has only you and the dogs):
   with every upgrade owned, guests were put on every guest spot and staff on every staff spot, pass after pass until
   every spot had been used, and each pass was screenshotted (headless Chromium, software WebGL). The Restaurant was
   also left to run on its own for four minutes. A station audit checked every spot in every room against the furniture
   footprints. Found and fixed:
   - Restaurant: guests on the far side of the two tables nearest the kitchen were drawn over the tablecloth (the low
     kitchen counter was one long box that sorted after them; it is now built in one-tile pieces). Guests in the curved
     corner booth were hidden behind its back, only their order bubble showing. A patio diner at the umbrella table was
     drawn over the pergola roof (patio diners now sort with their own table, not over everything).
   - Auditorium: seated guests were drawn over every seat, perched on top of their own seat backs. From behind they
     now show head and shoulders over the seat back, row by row.
   - Karaoke stage and the Club dance floor: guests stood inside them with only a head showing. Upgrades can now be
     platforms (`plat: height` on the upgrade): walkable, and anyone on them is lifted and drawn on top.
   - Rooftop: two pool spots were behind the raised pool wall, hiding the guest below the shoulders; they are at the
     pool's open sides now.
   - Spots inside furniture: Upstairs Bar lounge (in the side table), Boba second table (in its table), Bowling snack
     bar (in the counter), Karaoke couch (in the drinks table), Arcade prize counter (behind it, like a clerk).
   - Rooms drawn on a small plan and spread to fit (`d.layout`) spread their furniture by its centre but their spots
     as bare points, so a spot could land inside the piece it belongs to. Spots now move with their nearest piece.
   Looked at and fine: Upstairs Bar, Boba, Dessert, Speakeasy, Garden, Theater lobby, Mall, Bowling, Arcade, Rhythm,
   VR, Club. Small things left alone: guests at the Speakeasy bar stand among its baked-in stools; the DJ-game player in
   Rhythm is half hidden by the dance machine in front of them (correct depth, but you see less of them).
   Bedroom: your character was put on every spot (standing, bed, mirror, desk chair) and the dogs left to sleep. Fixed:
   both dogs were drawn underneath their beds and could not be seen (beds are now low platforms); the full-length
   mirror stood behind the PC tower, which hid it (it now stands between the bookshelf and the desk).
   Not checked: guests while walking between spots (only standing and seated poses were frozen and looked at, apart
   from the Restaurant's free run), and every room at every upgrade level (all rooms were checked fully upgraded only).
3. Facing and spacing, room by room: every one of the 21 rooms was screenshotted with every upgrade owned and looked at, and
   a depth audit compared draw order against footprints for every overlapping pair. Fixed: Upstairs Bar stools were drawn
   behind the counter (its footrail ran across their legs); the Restaurant kitchen partition cut the corner off the range;
   the Speakeasy piano stood side-on to the wall; the Dessert garland, Boba neon sign and Club neon sculpture were wall
   pieces standing on the floor (the garland also had a green halo, cleaned with `rs_fix.py art`); the Speakeasy microphone
   was the size of the singer; the Closet's Featured Rail was a dark slab 5 tiles wide on a 7 tile wall, hanging off the room
   over the wardrobes (it is now a lit shelf in the cornice, sized to the wall); the Mall escalator stood in the open front
   corner climbing into the pretzel kiosk (it now rises against the back wall toward the Bowling door, and the kiosk has the
   open floor); the Auditorium's rear surround stood in the open front corner aimed at the camera (it now stands on the back
   deck against the side wall); the Patio string lights stood outside the glass rail. The Patio table in the back corner and
   the fire bowl in the middle look right. Found and not fixed, needs art: the Bowling lane seats and the Game Room gaming
   chairs face away from what they are for (the lanes, the TV), because their pins and screen sit against a back wall and
   there is only front-view art. Each needs a rear-view sprite, like `gmx_couchb`. Listed under Art below.
4. Phone (2026-11-05, second pass after Cal saw lag and could not see other rooms): measured at 390x844 with the CPU
   slowed 4x (`rigtest/browser/perf.js`, `prof.js`, `trace.js`). Character frames were WebP-encoded on the main thread
   (81% of CPU on an idle Board); they are now blob URLs, stale requests are dropped, a look warms only the clips it shows,
   and breathing clips use every other frame. The building view hides rooms off screen and does not draw their people,
   redraws at 15 fps (26 in a room view on a wide screen), and when zoomed out people hold still. It opens on the whole
   Home building and zooms out until the whole street fits. Shop went from 6 to 47 fps, Hall 8 to 36. The building view
   and a busy room view still spend about half the main thread on image decodes under 4x slowdown with software
   rendering; a real phone with a GPU should do far better, but that has not been seen.
   Phone width: fixed. The nav needed 467px for eight names, so on a phone it scrolled with Wheel and Dungeons out of sight
   and Trophies cut in half. Under 541px each tab shows its icon and only the open tab keeps its name. Measured with no
   overflow at 320, 360, 430, 540 and 600px. The Collect button no longer wraps. Later the same day every tab (Board,
   Training, The Loft, Shop, Hall, Trophies, Wheel, Dungeons) and a room view were opened at 360px (`rigtest/browser/screens.js`):
   nothing wider than the screen, all readable. The owner-only Test button sits over the bottom-left of the content on a
   phone; it goes at release anyway. Not checked: a real phone.

Recheck after the 57 new upgrades (2026-11-05, every room fully upgraded, `rigtest/browser` audits): new guest spots inside
furniture (Mall photo booth in the flower kiosk, Bowling trophies in the lane seats, Game Room beanbags in the mini fridge)
were moved into the open; spots past a spread room's edge (Upstairs Bar Chesterfield, VR racing pod) now stay .3 inside;
spots more than 1.5 tiles from any piece spread with the room, not with a piece. Draw order fixed: Upstairs Bar end stool
over the champagne trolley, Garden conservatory over the apple tree and a bed over the farm stand (both from the
re-space), Club coat check under the dance floor, patio A-frame under the umbrella table, Rooftop pool over a lounger.
The kitchen wing was looked at closely and draws right. The Game Room and Closet have guest spots but no guests yet.
Guests were then put on every spot again in the rooms the new upgrades changed (Bowling, Mall, Upstairs Bar, VR,
Speakeasy, Club): nobody inside furniture, and the new rear-view lane seats face the lanes. The Speakeasy front corner
(armchairs, jukebox, barrels) reads crowded with four guests in it, though no two pieces are closer than .45 of a tile.
Club lights (`strobe` in `LFFX`, `20_loft.js`), per Cal: mostly a soft pulse of pink, blue or violet over the dance floor,
and about one time in six a soft-edged white flash over the whole room. Without the dance floor it is always the room flash.
Visitors, per Cal: the Game Room is visited only by game versions of his friends, listed in `GMR.visitors` in
`27b_skins.js` (empty for now, so nobody comes in; the comment there shows the line to add). The Closet has no visitors.
Phone speed and The Loft on a phone: see "Phone" under What was checked.

Club rebuilt (2026-11-05, Cal: the DJ faced away from the floor, one booth facing the wall, one table, a tiny floor, the
bar sideways). Club art is drawn running along the back wall facing into the room; flipped, it runs along the left wall
facing right. The old plan had the DJ booth, the bar and the coat check the wrong way round for where they stood. Now:
- the DJ booth in the middle of the back wall facing the floor, a speaker stack each side (`cb_spk` draws two), the neon
  sculpture above it, the smoke machine and laser rig beside it;
- the dance floor right in front of it, 6 x 5 tiles in four panels (8 x 8 lights, about twice the old floor). The floor art is
  drawn at 30 degrees and rooms at 2:1, so `lfSprFit` (`20_loft.js`, `LFFIT`) maps each panel's top face onto its tiles
  exactly; a plain scale left gaps. The strobe covers all four panels;
- the bar along the left wall with its bottle shelf against the wall, three spots facing it;
- the VIP booth in the back right corner and a new upgrade, Wall Booths (`cb_booths`, 400, two more down the left wall),
  all opening onto the floor, with seats people sit in (`sit` with `{over:1}` sorts them over their booth, not behind it);
- three high tables (`cb_hi` draws three, now table height, not taller than a person) along the front of the floor;
- the velvet rope by the door, the coat check below it facing the room, the dance podium in the front left corner.
Dancers face the DJ with their backs to you (`cust` spots can take `{fxwall:1}`). Checked with guests on all 30 spots
(three passes), six timed shots of the room running by itself, `gaps.js`, `depth.js` (0 bad), `stations.js` (all fine), and
the old-save test with a Club owning every old upgrade, then buying Wall Booths. Seen once and not reproduced: a guest
standing on the door mat with the cocktail cart drawn over their head. `rigtest/browser/sortwatch.js` watched the room for
84 seconds over four runs and found nobody drawn under anything in front of them. Not done: there is no dance animation, so
dancers stand and breathe.

Game Room rebuilt (2026-11-05, Cal: light panels wrong on the wall, sofa floating mid-room, TV hanging off the side,
gaming chairs facing the side of a table, soda machine facing the right wall). Same cause as the Club: the TV, dartboard,
game shelf and soda machine were flipped against the wall they hung on, the light panels were back-wall art on the left
wall, and the couch and chairs faced walls with nothing on them. Now:
- a TV wall on the back wall: the TV mounted over the console shelf, the round rug in front, the couch and gaming chairs in
  a row facing it (seats for two each, seen from behind), the mini fridge at the end of the row;
- an arcade corner at the back left: cabinet, dartboard on the wall, foosball, the light panels flat on the left wall;
- a retro corner on the left wall: the old TV facing into the room, beanbags in front of it (two seats);
- the snack wall at the back right: lamp, snack bar, soda machine, all facing into the room;
- the pool and ping pong tables across the front, both turned to match their art (their footprints ran crosswise
  before), with players at the sides and ends; the band in front of the couch row is the walkway to the door.
Checked with 17 stand-in guests on all 17 spots (`VIS=1 node guests.js gameroom`: it swaps the visitors-only rule for
ordinary guests), `gaps.js`, `depth.js` (one flag: the rug under the shelf, correct), `stations.js` (all fine) and the old-save
test. `guests.js` had been setting guest counts on `window.ROOMDEF`, which does not exist, so earlier runs used each room's
real guest count; it now uses `__qbLoft().defs`. Published as `APPV` 39.

Lair (2026-11-05, Cal: floor pieces strange, the canister rack crowding the chair, two hologram tables). The room is one
painting with painted upgrade layers; the war table's layer is now drawn moved onto the floor emblem in the middle of the
room and sorted with people (`27_rooms.js`, Lair `draw`). The second holo table (`lr_map`, id kept) is now a Gadget
Workbench (`hmx_bench`) with its pegboard against the armory wall. Reactor core and its spare canisters stand by the server
racks, the drone dock on the right edge, the teleport pad in front of the war table with a spot to stand on. Checked: depth
0 bad, stations fine. The painted suit cases and trophy layers were not changed.

Closet (2026-11-05, Cal: it started full and upgrades changed nothing; the recent-orders shelf looked out of place; every
stage should be the glass closet room, less finished, not a different room). Every stage is the glass closet painting
(`clx_room`) with less in it, cut by `tools/closet_stages.py` into `clx_st0` (closed walnut doors over every pane and the
shoe wall, bare herringbone floor), `clx_st1` (shoe and bag wall open) and `clx_st2` (island and rug back). Stages: start
(st0, lights down) > Wardrobe Lights (`cl_glow`) > Shoe & Bag Wall (`cl_shoe`, st1) > Jewelry Tower (`cl_jewel`, sprite) >
Center Island (`cl_isl`, st2) > Glass Closet (`cl_mirror`, the painting) > Super Sleek Modern (`cl_disp`, LED strips along
the plinths and over the doors). Each needs the one before. The old ids were renamed into these stages, so saves keep what
they paid for; the Velvet Ottoman and Shoe Bench are retired (`retired:1`, hidden from the shop and drawn nowhere); the
Featured Rail is gone. Every room window has an owner-only Testing link, "Undo this room's upgrades", that refunds them so
stages can be bought again; it goes at release with the Shop's Testing row. Checked: every stage screenshotted, the old-save
test with a Closet owning old ids. Not done: Cal asked for sliding doors as the first step; no art shows an open closet, so
the start already has closed doors and the first upgrade is the lights. Super Sleek Modern is a light treatment, not a new
room: both need painting (see Art).

Prove it (2026-11-05, Cal: screenshots defeat the point; the bonus was too small to bother). The Screenshot button is gone,
the picker takes a camera JPEG only, and anything else is refused before review. A verified quest pays 2x XP and coins
(2.1x with the verify perk), up from 1.2x. Checked: the window shows only Open camera; a 40 XP quest shows +108 verified
against +54 honor. Shop: the brand hero is now a framed banner in the brand's colours with its logo as a watermark
(`qsBanner` in `15_shop.js`); all five brands were screenshotted. The header showed a fixed "v0.06"; it now shows `APPV`.

Asset quality pass (2026-11-05, every room fully upgraded, after the streak fix): every room sprite was looked at alone and
in its room. Fixed:
- Two sprites were whole generator sheets with a grid line through them: the Bowling towel warmer (`bwx_towel`) and the
  Rhythm trophy (`rhx_trophy`). Each is now one cell cut out, and `data/rsart.json` has their new sizes.
- A thin green-screen line round the outside of about 250 sprites. `tools/rs_fix.py edge-all` cleans only the outer 3 px band
  (plus pure lime anywhere), so plants and green art inside a sprite keep their colour. `rs_fix.py edge <name>` does one.
- Green spill inside the Lair hologram map, drone and paint cans (`hmx_map`, `hmx_drone`, `hmx_cans`), and the Dessert lantern.
- The Karaoke tambourine stand stood in the walkway; it is beside the stage now.
Looked at and left: the Patio telescope overlaps the fire bowl on screen but not on the floor (it is behind it). The
Speakeasy front corner reads crowded (see above). The depth audit flags rugs under furniture, which is correct.

Published 2026-11-05 as `APPV` 37 (version 8 of the page), then `APPV` 38 with the new Club (version 9) and `APPV` 39 with the new Game Room (version 10), pinned in Cal's sidebar for phone testing. The page holds 501
files: `dist` plus `lfvar.json`, which lives only on the page and must be kept. Character layers and icons are bundled into
`art_rig.js` and `art_icon.js`, and redrawn UI pictures into `art_ui.js` (empty until Cal makes them, so the old ones show).
The sprites went up in two batches with the old page, then the code; each batch was safe to run with the other side's
version. Old save test before publishing: load, reload, buy, reload, all kept. Publishing rules are in `docs/RELEASING.md`. The save wipe (`QB_EPOCH`) has been used once and must not be bumped again.
`APPV` 42 (2026-11-05, page version 14, because `app.js` and `index.html` went up as two publishes): the same game as 41, only the number and `app.js`'s fingerprint changed, so Cal can check his phone picks up a new version. Done with `edit_version`, so no other file on the page changed and SHOP's work in progress stayed out. Old save test passed; at 390x844 headless the header read v42 with no page errors or failed requests. The page's files match the tested copy by checksum, and the live `index.html` is 364 bytes larger, the same gap v41 had, from a wrapper at the top of the page. The live page itself was not opened: the Browser pane is not signed in to claude.ai. Not yet seen on a real phone.

Open asks from Cal (2026-11-05, latest first):
- Game Room, new art needed (Cal's Chrome), then wire it into `GMR` in `27b_skins.js`:
  - `gmx_rig`: two gaming desks back to back, each with a monitor or triple screen, RGB glow, original design, drawn
    with the long side lower left to upper right like the other room sprites. Place it near the front of the room (about
    x 6 to 9, y 7 to 8.5, where the ping pong table is now; move ping pong to the right front), with the two red racing
    chairs (`gmx_chair` front view, `gmx_chairb` rear view) one on each side facing their screens. That replaces the
    chairs' current spot beside the couch.
  - `gmx_sect`: a three-piece cream modular sectional with a deep chaise / futon piece, low and plush, seen from behind
    (it faces the TV on the back wall like `gmx_couchb`), and a front view for later. No brand names in prompts.
  - `gmx_tv80`: a giant 80 inch wall TV, the same angle as `gmx_tv`, and `gmx_tvstand`: a futuristic modern media
    console (floating, glossy, LED underglow) under it. Both as a later upgrade: the current TV and shelf stay as the
    first step, then "80 inch Screen" and "Floating Media Console" replace them (use `sup` so the old pieces hide).
- Painted wall environments for every room, upgraded in stages like the Closet: Cal sent a theater example (four images,
  same angle, green background: bare lit wood panelling growing into a poster wall with gold trim and sconces). Each room
  gets a wall shell painted per stage (walls and floor only), with the existing furniture sprites placed on top. Needs:
  the shells generated in Cal's Chrome (final stage first, then image edits stripping it back), and a generic loader like
  `clPaint` in `27_rooms.js` that draws the highest owned stage over the room (fitted to its size, green removed with
  `tools/rs_fix.py`). Ideas from Cal: the Club bar wall with a hanging wall of drinks; the theater with posters.
- Jewelry tower in the Closet looks out of style: make jewelry part of the painting (e.g. the island's glass trays lit as
  the jewelry stage) instead of the `clx_jewel` sprite.
- Brand banners need real art, intricate and colourful scenes, not the procedural treatment (prompts under Art).
- The Loft on Cal's phone (inside the Claude app) filled only half the screen with no bottom nav. `.lfwrap` was fixed at
  `100dvh`; v41 stretched it with top and bottom 0, and Cal still saw it cut off on v42. Likely cause: on the Loft tab
  everything is fixed-position, so the page measured only its header (`body` 331px on an 844px phone, 4900px on the
  Board). A test frame sized to its content, capped at the screen (my own model, not the real Claude app), showed the
  same thing: 844px on the Board, 331px on the Loft. v43 gives `html` and `body` `height:100%` while `#lfwrap` exists (the
  platform's own advice for a one-screen app) and refits the view when the frame's height changes by 120px or more. In that
  test frame the Loft now stays 844px with the nav at the bottom. Also passed: refit up and down, a room window, every tab
  at 360 and 430 wide, the old save test. Not yet seen on his phone. v43 also writes what the owner's phone measures to the
  shared doc `diag/frame` (`qbFrame` in `26_world.js`, read it with `db_get`; `data/users/` is private even from the owner).
  Remove the log and that doc once this is sorted.
- Scripts and images are now asked for with a content fingerprint (`?h=`, `tools/build.py`), because Cal's phone kept an
  old `app.js` (it still said v0.06 after v40 was live). If the page still shows an old version, close and reopen it.

Still to do, in order:
1. Regenerate `o_lock`, `al_carab`, `v_shade` and `v_corset` cleanly when Cal is next generating, so the Dropbox sources match.
2. Stretch-pose sleeve streaks: fixed 2026-11-05 (Cal: "they look weird"). Poses marked `"armsUp": true` in
   `data/poses.json` (`stretchUp`, `stretch`, and any blend with them) bind clothes with `rig.armpit` in `data/rig.json`: below a
   line 80 canvas px above the shoulder joints, a cell of trunk art follows the trunk only, a cell of sleeve follows its arm
   only, and a top's piece stretched past 2 cells there is dropped. The base body gets only the trunk part (its arms keep
   their usual binding). Every other pose keeps the old binding, so it renders exactly as before: `rigtest/browser/regress.js`
   renders every top on both bodies in all 22 poses with the rule on and off and lists any cell outside the stretch poses
   that changed. `&armpit=off` on `rigtest/matrix.html` draws without it.
   Waiting on Cal: the long streaks are gone, but the stretch frames still show small ragged bits at the shoulders,
   because one flat picture cannot bend to arms straight overhead. Offered: (a) a gentler wide "yawn" stretch, arms to
   about 60 to 70 degrees, a `data/poses.json` change only (recommended); (b) keep it as is; (c) a painted arms-up picture
   for every top on both bodies and the base body, about 60 generations in Cal's Chrome, plus one per future top. Art
   cannot be generated in a cloud session.
3. Before sharing widely: test on a real phone. The Test panel and Shop Testing row only show for the owner; remove them and the `window.__qb` and `window.__qbLoft` hooks before release.

## Not yet verified

A real phone (only a narrow headless window). Motion as judged by a person. The cloud save path after publishing. Whether a friend on a
free Claude account can use the AI features.

## Cal's later notes, in his words

> check all the assets in all the rooms and make sure they are positioned correctly and have proper spacing inside all the rooms. things should not be too close together so people have room to walk. some rooms should be bigger and some appropriately sized to fit all the upgrades that we have planned
>
> The game room and walk in closet are way bigger than the bedroom... I want it to look like an actual walk in closet with lit up wardrobes.
> i also want each room to fit snuggly into each square in the building view instead of bleeding into each other. Also remove the arrows and any text on the building view... When the rooms dont exist yet, i want there to be empty space and no building. The background of the building view could also have a better background city skyline that reacts with the time of day
> this restaurant is not very cohesive. the seats are very cheap and the table is super tiny... that is technically not a booth.
> Every room and every upgrade should have a meaningful purpose
> When i click into a room, the minimum zoom size should have the room fill up to the left and right sides of the screen... don't reuse assets. make everything unique
> The mall is build with wooden floors... Make it an empty strip mall with marble floors and some cutouts for the doors as the base starting build. Then some upgrades would be the karaoke room, arcade which has a rhythm game upgrade and VR game upgrade, and a bowling alley. these are all their own separate room upgrades
> Once done with the clothes and test, i need you to do an extensive test on every asset in this game to make sure nothing is clipping, and every item is placed and positioned correctly in the room relative to its direction (a sofa should not be facing the wall or a desk should not be positioned sideways unless intentionally). Every room should feel unique
> a majority of the kitchen appliances like that brick stove belongs in the kitchen. Create an extension on the top right that leads to the kitchen, but don't need to create a separate room in the building view for it. Just create a partition

## Cal's request, in his words

> when the customers are sitting in the restaurant, they are unnaturally clipping through the furniture and seats. I also think the restaurant is too cramped and has too much stuff. I like all the upgrades, but the final fancy upgrade color is white green and gold. It is quite ugly. I want it to start off basic and small with 2 tables, and then eventually get bigger and sleeker and darker and moodier like a fine dining michellin star restaurant. restaurant could be a bit bigger too during the upgrade. I would like an upstairs section to this restaurant where the cocktail bar and some high top standing tables could be. Think high luxury, sleek, moody, fine dining. I dont want the upstairs to overlap the bottom floor because that would make it even more cluttered. There could be a set of stairs that leads up to the bar and this 2nd floor could be a bit off to the side so that we can see both floors in clear full view.
>
> "Digital menu screen installed" stayed persistent after purchasing the upgrade. Every text for each upgrade stays persistent on the screen instead of fading away.
>
> Garden upgrades are not appearing at all after purchasing.
>
> When purchasing upgrades, it is causing the upgrade menu to scroll all the way back to the top rather than keeping the room view on screen. I would like a separate scroller box that does not keep jumping back to the top each time I add an upgrade.
>
> people's heads are clipping through the garden assets. Double check every character with every asset in this platform to make sure no one is clipping through anything.
>
> i cant see any of the garden upgrades but it seems like it might also be too cramped. Can you make sure there is ample space for everyone to walk around and to see each asset clearly? Do this for every building so nothing feels cramped.
>
> Reference speaker towers in the auditorium end up making the other speakers disappear. They also seem to be facing the wrong way?
>
> When I upgrade the screen to a larger size, I would like the wall that it is on to actually grow taller or maybe even wider so that the upgrade feels more dramatic.
>
> I want all the big upgrades in every single room to feel very important and impactful. Like if we are adding a stone fountain in the garden, there could be an animation for the fountain and water spouting out and people who visit, stop to admire it, and the ground changes and there could be a walkway leading up to the fountain. Youll have to keep in mind how some of these upgrades change the environment and affect the other upgrades that were initially there.
>
> The VIP velvet seating did not look as good as the previous reclining seats. No imax theater would have these.
>
> The gold speaker tower is also right in front of the screen and is blocking the movie. I would also like a more exciting movie animation that loops through 6 different scenes. The people who are in the movie theater are also sitting facing the bottom left side of the screen instead of watching the movie on the left upper side of the building.
>
> Instead of the auditorium being placed above the garden in the building view, can we make the auditorium part of the movie theater and extend to the right of the theater? In the building view, once this happens, it can expand the building out to the right.
>
> Actually, I am now envisioning a different layout for the buildings. Instead of one building, we can have multiple buildings that each have their own purpose. One building for home which could have the bedroom, patio, game room, and hero's lair. One building for business which can have the restaurant, asian dessert parlor, boba shop, rooftop bar, speakeasy with an option for a live jazz band. One building for entertainment that has a mall, a movie theater, arcade, nightclub, bowling alley, karaoke, VR gaming place.
>
> Each building will naturally upgrade their spaces until it adds a new unit. Such as how the bedroom naturally upgrades the space and expands into a closet. I now want the shop to unlock only after the closet unlocks. After that, once we unlock the hero's lair, we gain access to the dungeon tab and we can send our visitors to missions. 5 missions per day but some missions require 2 or 3 people to tackle and they grant increasingly larger rewards. Since I have a separate room for the closet and the hero's lair and the patio now, i want you to make these rooms bigger and self contained. i want the bedroom to be its own entity and once the closet unlocks, i want there to be a doorway with a glowing and pulsating entranceway that is clickable. i want a floating arrow that is outside of the perimeter of the current room that is pointing from the edge of the doorway out into the direction of the next room. Clicking this area will allow you to teleport to that new room and have new upgrade and installation options. The closet now needs more upgrades and customizations. Perhaps it could somehow link to the shop and react to the items we purchase in the shops, but if this is too expensive and difficult, do this for a future quality of life update. The hero's lair is now its own room that opens from the closet from a secret sliding door that has a glowing pulsating deep blue glow from the entranceway with the same floating arrow that allows us to transfer to that room. This room now needs some more upgrades as well.
>
> Back in the bedroom, when opening the patio, I want the patio door to be in the same position, but it opens up a new room above the bedroom in the building view. i want it to be a medium sized patio that is on the 30th floor of a highrise. The background of this should be the patio overlooking a beautiful golden hour sunset overlooking the LA skyline in the same artstyle as everything else. More upgrades needed here such as artificial grass flooring, a simple chair that upgrades eventually to a premium egg swing seat, perhaps some string lights, a dog bed out there. Also one of the upgrades for the bedroom should be a dog bed, and a dog. One is Pluto who is a toy poodle, and Chopstick, who is a chihuahua dachsund mix. Two dog beds eventually, and two upgrades for the dogs. The dog's animations should be occasionally jumping up and sleeping on the bed, or pooping on the floor which leaves a little poop asset on the floor. Cleaning this up by clicking a clean button would give a certain number of coins and experience. The dogs should not be clipping over each other or clipping over the furniture so make sure they are intelligent assets with object awareness.
>
> As for the other buildings, once the upstairs bar is open from the restaurant, it leads up the stairs which opens up a new room in the building view that is directly above the restaurant. To the right of the restaurant in the same building could be a boba shop. Right above this is the asian dessert parlor.
>
> In the entertainment building is the movie theater. The room above is the auditorium. The movie theater does not start making any money or receiving business until the auditorium is open so it requires some upgrades before fully functional. To the right of the theater leads to the mall which has multiple shops and kiosk upgrades and fountains and stuff you can add to attract more people and gain more money. Then connecting from the mall, it could be an arcade, which eventually has a small side expansion for rhythm games and another side expansion room for VR games. Then from the mall room, it can expand to a bowling alley, and then again from the mall room it can expand to a karaoke room.
>
> Make all those changes and also 2 more clothing brand additions (30 more clothes).
>
> Rebalance the money it takes to make these upgrades. Some of these upgrades seem like they are going to take weeks to make enough money to upgrade. Each upgrade should feel very achievable within one day. Except the huge upgrades. If it is upgrading a painting or something small, they should all relatively be the same price rather than every item ramping up in price. Nothing should cost 20000 coins if we are only able to make 50 coins per task completed. That is not achievable.

Note that two passages conflict: he first asks for the auditorium to the right of the theater, then later says the room above the theater is the auditorium. The later one wins unless he says otherwise.

## Also on the list, from earlier

- Town bulletin board with friend interactions (Cal liked it; not started): messages, ingredient requests, movie invites that play a short visit animation, friendship points, friends' characters as guests. Uses the page's shared database. Cap rewards per day.
- Bedroom furniture edit mode, decor first.
- Before sharing with friends: phone test, remove the Testing row. Every save now uses a private per-person path.

## Art still to generate (Cal's Chrome, Unlimited toggle, Nano Banana Pro, never credits)

- **Closet stages, as image edits of `art/app/clx_room.webp` (same room, same camera, same size; Cal wants every stage
  to be this room, less finished).** Save each over the stand-in of the same name; no code change. `clx_st0`: every glass
  door replaced by plain closed walnut sliding doors, the open shoe and bag shelves closed in the same way, no island, no
  rug, bare herringbone floor. `clx_st1`: as st0 but the shoe and bag wall open and lit. `clx_st2`: as st1 with the marble
  island and the round rug. `clx_modern`: the finished room taken further for Super Sleek Modern (handleless gloss fronts,
  cool white LED lines, a statement light over the island); add it to `data/rsart.json` with its size and the Closet uses it
  for Super Sleek Modern in place of the LED overlay.
  For sliding doors as a real first step, also an `clx_open`: the same room with no doors at all, open wardrobes.
- **Shop brand banners, 1200x480, one per brand, no text and no logo (the game puts those on top), dark enough at the
  centre for white text:** `ui_banner_hanga` (the Han river at night under a lit bridge, Seoul streetwear mood),
  `ui_banner_y2k` (chrome, pink and butterflies, 2000s glam), `ui_banner_over` (concrete overpass, spray paint, skate
  shop), `ui_banner_rose` (black velvet, roses and thorns), `ui_banner_alt` (snowy peaks at dawn, outdoor gear). Save as
  `art/app/ui_banner_<id>.webp`; the build bundles them into `art_ui.js` and the banner uses them automatically.
  State 2026-11-05: all five painted, not yet approved by Cal, not in the game. Paintings (3168x1344), game files and the
  labeled sheet are in `art/raw/banners/` (git-ignored). Made with Nano Banana Pro, 21:9, 2K, Unlimited on, one image at a
  time. Encode: `cwebp -resize 1280 0 -q 80 -m 6` (1280x544, about 100 KB each; the full height shows, because a phone
  shows the whole painting). Prompt base: "Wide panoramic banner illustration, fully stylized painted game art, cosy anime
  game style, clean dark ink outlines, soft painted cel shading, rich saturated colour, intricate fine detail in every corner,
  glowing rim light. Not a photograph, not realistic, not a 3D render." Then the scene and palette, then "The middle of the
  picture is darker in value but still finely detailed, so white title text can sit on it later. No people, no characters.
  No text, no letters, no numbers, no writing on signs, no logos, no watermark, no border. Original design." Lessons: name
  shops "unbranded, blank signboard" or a real-looking logo appears (a first HANGANG got a "7" on its shop, rejected); add
  "full bleed, no frame, no white margin" (a first OVERPASS came framed, rejected). Check the Generate button reads
  UNLIMITED before each click: the toggle was off when the page opened, showing a cost of 2 credits.
- **Pictures in the game's own style (Cal asked 2026-11-05).** The class pictures, coaches, crew, rank badges, level-up
  splash and reward scenes are semi-realistic anime or glossy fantasy art; the game itself is chibi characters with clean
  dark outlines and soft painted shading, and painted isometric rooms. Redraw each one in that style and save it as
  `art/app/ui_<name>.webp`: the build bundles it into `art_ui.js` and it replaces the built-in picture of that name with
  no code change. Keep each picture's size and layout. Names, in order of how often they are seen:
  - Classes, 360x480 portrait, the player's own chibi in the class gear, full body, dramatic but soft background:
    `class_tamer` (beast tamer with a small poodle and a chihuahua-dachshund at heel), `class_swiftblade` (light armour,
    twin short blades, mid-dash), `class_runeweaver` (robe, floating glowing runes), `class_vanguard` (heavy shield, steady stance).
  - Rank badges, 256x256, a flat emblem with one letter, chunky outline, same palette per rank as now: `rank_E`, `rank_D`,
    `rank_C`, `rank_B`, `rank_A`, `rank_S`. Then `levelup` (720x360 banner) and `chest` (256x256).
  - Coaches, 300x400 card, chibi, one per name: `coach_brick`, `coach_tam`, `coach_oru`, `coach_lio`, `coach_blaze`,
    `coach_pixie`, `coach_vanta`, `coach_mags`, `coach_ryo`, `coach_hikari`, `coach_quill`, `coach_dot`.
  - Crew, 240x320 card, chibi: `crew_mochi`, `crew_juno`, `crew_rook`, `crew_nova`, `crew_bleep`, `crew_vex`, `crew_ko`,
    `crew_echo`, `crew_brisa`, `crew_dax`, `crew_luna`.
  - Rewards, 240x240 scene, painted chibi props: `rew_5`, `rew_10` ... `rew_100` (13 of them), and the class-event
    banners `cl_home`, `cl_body`, `cl_boss`, `cl_social`, `cl_create`, `cl_admin`, `cl_reset`, `cl_out` (720x250).
  - Ask Cal first: `friend_cynthia`, `friend_memo`, `friend_vega`, `friend_justin`, `friend_logan` (his real friends) and
    `dog_pluto`, `dog_chopstick`. The `room_*` thumbnails belong to rooms the game no longer shows and can be skipped.
  Prompt base: chibi game character art, big head small body, clean dark outlines, soft painted cel shading, warm
  rim light, plain soft gradient background, no text, no logos, original design. One picture per sheet, or a 2x2 sheet
  cut with `tools/rs_art.py`.

Furniture sheets go through `tools/rs_art.py <sheet> <names in reading order>`; `tools/rs_fix.py art <name>` for anything glowing. Base prompt for each: isometric game furniture sprites on flat pure green, three-quarter camera, clean dark outlines, soft painted shading, nine separate objects in a 3 by 3 grid, long sides lower left to upper right, fronts facing lower right, no text, no floor, no shadow.

- Garden 1: `gdx_seed` dirt bed with seedlings, `gdx_raised` timber bed with lettuce, `gdx_tomato` bed with staked tomatoes, `gdx_herb` herb trough, `gdx_can` watering can and coiled hose, `gdx_comp` compost bin, `gdx_wheel` wheelbarrow of soil, `gdx_barrel` rain barrel, `gdx_bench` potting bench.
- Garden 2: `gdx_shed` tool shed, `gdx_hive` two beehives on a stand, `gdx_tree` young apple tree, `gdx_grape` grape trellis, `gdx_coop` chicken coop with hens, `gdx_logs` mushroom logs, `gdx_stand` farm stand with crates, `gdx_pump` solar water pump, `gdx_seat` wooden garden bench.
- Garden 3: `gdx_ghouse` small glass greenhouse, `gdx_conserv` large Victorian conservatory, `gdx_arch` rose archway, `gdx_gate` iron garden gate, `gdx_fount` tiered stone fountain, `gdx_lantern` lantern post, then sundial, topiary, bird bath.
- Theater: `thx_booth0` plain plywood ticket booth, `thx_rope` velvet rope section, `thx_arcade` arcade cabinet, `thx_claw` claw machine, `thx_standee` cardboard rocket standee, `thx_liquor` backlit liquor wall, `thx_proj1` digital projector, `thx_proj2` large laser projector, a simple lobby bench.
- Rear views, same prompt but backs facing the camera (fronts facing upper left): `bwx_seatb` the orange bowling lane seats
  from behind, `gmx_chairb` the two red and black gaming chairs from behind. Then place them in `27b_skins.js` (`bw_seat`,
  `gm_chair`) so they face the lanes and the TV.
- Logos, one row of three on green, no letters: `logo_hanga` river and bridge roundel, `logo_y2k` chrome and pink butterfly, `logo_over` spray-paint overpass arch with drips.
- OVERPASS shoes via `art/sil/all_2x2.png`: `o_hoop`, `o_slides`, `o_rigg`. Then `tools/ingest_items.py`, `tools/pack.py art/layers art/app`, `tools/items.py art/layers art/app data/items.json`.
