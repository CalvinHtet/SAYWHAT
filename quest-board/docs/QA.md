# QA

QA's notes: how its checks run, what each run found, and the longer write-ups behind the one-line findings in
`TASKS.md` (*QA findings*). QA owns this file and `rigtest/qa/`. It never changes game code, data or art.

## How QA runs

Every run tests a clean copy of a commit, never the shared working folder, so half-finished edits never show up as bugs.

1. `rigtest/qa/setup.sh [commit]` (default: the latest commit on `main`) adds a detached worktree of that commit in a temp
   folder outside the repo (`QA_TMP`, default `$TMPDIR/qb-qa`), builds it, points that copy's `rigtest/browser` scripts at
   port 8769, and serves it on 127.0.0.1:8769. It prints the folder.
2. The scripts need Playwright. This Mac has it in the npx cache:
   `export NODE_PATH=~/.npm/_npx/e41f203b7505f1fb/node_modules` (Playwright 1.63, its Chromium is in
   `~/Library/Caches/ms-playwright`).
3. Run from `rigtest/qa/` with `OUT=<folder>` for pictures (keep them out of the repo):

| Script | What it does |
|---|---|
| `upgrades.js [room,room]` | Every room starts empty (rooms that an upgrade opens do not exist yet, as in a real game). Presses the room window's first Buy button again and again until nothing is left. After each purchase: a picture of the room without people, how many pixels changed, the gaps, depth and stations audits, and the upgrade menu (heading, at most 5 cards, never "All upgrades installed" while something is unbought). Writes `<room>/t<NN>.png`, `<room>/sheet.png` and `upgrades.json`. About 4 minutes per room. |
| `closeups.js [room,room]` | After `upgrades.js`: for each upgrade, the part of the room that changed, before and after, zoomed, with its name and shop line. For judging whether it is obvious and whether it looks like its name. |
| `doors.js` | Every door between rooms against the building map: left and right, up and down, the arrow's corner, and furniture standing in front of a door. `QB=<built quest-board folder>`. |
| `doorcrops.js` | Close-ups of every door glow, everything bought. |
| `shop.js [m\|f]` | Buys every piece through the Shop's buttons on each body (skipping weeks so every brand is live once), checks coins, owned, worn, the mirror's list, Remove, and the Wardrobe tab, and draws each piece alone and each brand's outfit. |

The copies of `rigtest/browser/*.js` in the worktree also run against 8769: `savecheck.js` (`BASE=http://127.0.0.1:8769`),
`screens.js`, `perf.js`, `gaps.js`, `depth.js`, `stations.js` and the rest.

What the pictures cannot show: people (the room pictures leave them out, so the dogs and guests are checked separately),
motion, and a real phone.

## Run log (latest first)

### 2026-11-05, 62c311d

- `savecheck.js`, `screens.js` at 360 and 390: run on fd14fad (the latest commit when QA started): all passed, nothing wider
  than the screen, no page errors.
- `doors.js` and `doorcrops.js`: see Doors below.
- `upgrades.js`, every room: 397 upgrades bought one at a time through the room windows (the 11 unbuyable ones and the
  Auditorium's and Club's level 61 to 65 ones left over). Problems that show only at a middle tier, not when fully upgraded,
  are almost none: the Patio's lounge chair sorts under the outdoor rug for one tier, and one restaurant prep table overlaps
  the kitchen counter by 0.1 tile until the next upgrade. 19 page errors arrived between purchases and were not tied to
  any one of them; loading the page again shows none (likely image loads cut off as a window closed). The script now lists
  them. See Lessons below for everything visual.
- `menu.js` on 59eeaf7, levels 1 to 80: the upgrade menu passes (never more than 5 cards, "? ? ?" only 2+ levels up, one
  level up named with "Reach level", Buy always works, no early "All upgrades installed", 7,300 cards). 11 upgrades are
  never offered at any level (Game Room Couch & Console, Pool Table, Snack Bar; Restaurant Chef's Neon; Garden Scarecrow,
  Berry Patch, Beehive; Theater Cocktail Bar, Hire a Bartender, Liquor Wall, Brass Tap Bar), the same ones ROOMS found.
  The Auditorium's IMAX Screen (level 62) and Premium Power Recliners (level 65) need levels above 60.
- `shop.js` on 59eeaf7: male body 112 pieces, female body 115, every one bought through the Shop's buttons (brand by
  brand, weeks skipped so each brand is live), worn, listed in the mirror, taken off with Remove, and present in the
  Wardrobe; each brand's outfit worn at once. All pass. Two purchases paid less than the price because a badge reward
  (first purchase, fifth item) lands in the same step: not a bug. No clipping seen at mirror size (`shots/shop_m.png`,
  `shop_f.png`, `outfits_m.png`, `outfits_f.png`). Not checked: every pose (HANDOFF's rig sheets cover that), the room
  character, motion.
- Street view (51a9506, on 59eeaf7): see TASKS.md, QA findings. `savecheck.js` and `screens.js` pass on 59eeaf7.

## Doors between rooms (2026-11-05, 62c311d)

Cal: "make sure room traversal makes sense (if doorway is on the left side, the next room doorway should be on the right
side so it makes sense which way you are entering and exiting)". 15 pairs of doors (`portal()` in `27_rooms.js`, map in `ROOMCELL`,
`26_world.js`). The Garden and the Club have no doors (bought from the street).

Loosely, left and right hold everywhere: every door to a room on the left is on the left side of the room (left wall or
front-left edge) and the door back is on the other room's right side, and the other way round. Every way up is through a
back wall and every way down through a front edge.

Wrong:
1. **12 of the 15 pairs break Cal's stricter rule** (ROOMS's "Doors that make sense" task: a door on the back-left wall
   comes out of the next room's front-right edge, back-right to front-left, and the other way round). Only Closet and
   Lair, Theater and Auditorium, and Mall and Karaoke follow it. In the other 12 both doors sit on the front edges, or one
   on the back-right wall and the other on the front-right edge:

   | Pair | Door in the first room | Door back | Rule wants the door back on |
   |---|---|---|---|
   | Bedroom, Closet | front-left edge | Closet front-right edge | back-right wall (or, Cal's plan, the Bedroom door moves to the left wall and the Closet keeps front-right) |
   | Bedroom, Patio | back-right wall | Patio front-right edge | front-left edge |
   | Bedroom, Game Room | front-right edge | Game Room front-left edge | left wall |
   | Restaurant, Upstairs Bar | back-right wall | Bar front-right edge | front-left edge |
   | Upstairs Bar, Roof | back-right wall | Roof front-right edge | front-left edge |
   | Boba, Dessert | back-right wall | Dessert front-right edge | front-left edge |
   | Dessert, Speakeasy | back-right wall | Speakeasy front-right edge | front-left edge |
   | Theater, Mall | front-right edge | Mall front-left edge | left wall |
   | Mall, Arcade | front-right edge | Arcade front-left edge | left wall |
   | Mall, Bowling | back-right wall | Bowling front-right edge | front-left edge |
   | Arcade, Rhythm | back-right wall | Rhythm front-right edge | front-left edge |
   | Arcade, VR | front-right edge | VR front-left edge | left wall |

   `LOGIC=1 QB=<built quest-board> node rigtest/qa/doors.js` rechecks it in a second, once ROOMS moves them.
2. **The floating arrow is in the other corner from the door, 7 times.** `rmArrows` puts every "up" arrow in the top-left
   corner, but 7 of the 9 doors up are on the back wall, top right: Bedroom to Patio, Restaurant to Upstairs Bar, Upstairs
   Bar to Roof, Boba to Dessert, Dessert to Speakeasy, Mall to Bowling, Arcade to Rhythm. The Closet's "Hidden Door" arrow
   is bottom left while its door is on the left wall, top left (same side, smaller). Fix in `rmArrows`, `26_world.js`: put
   the arrow on the corner nearest its own door.
3. **Furniture stands on 8 doors**, everything bought (`doorcrops.js`, footprints checked 1.5 tiles wide and 1.2 deep in
   front of each door, then looked at): Bedroom to Closet (wardrobe and dog bed; Cal has asked ROOMS to swap the wardrobe
   for the figurine shelf for this reason), Restaurant to Upstairs Bar (the plant divider and a table, the glow does not
   show), Boba to Dessert (tea urns and the fryer, glow hidden), Dessert to Boba (cupcake stand), Dessert to Speakeasy
   (macaron tower, glow hidden), Arcade to Rhythm (claw machines and the basketball game), Rhythm to Arcade (speaker
   tower), VR to Arcade (racing pod). The Mall's escalator over the Bowling door is on purpose (it climbs to Bowling).
4. **The Mall opens straight into the Karaoke room two floors up**, with Bowling between them in the building view (mall
   floor 0, bowling floor 1, karaoke floor 2). Small, but going "up" from the Mall lands you over the Bowling alley.
5. Every door is only a faint glow on the floor, easy to miss once a room is full (most of the close-ups above). Not a bug.

## Lessons for the next art pass (2026-11-05, for ROOMS)

Cal, 2026-11-05: most room art will change. Every room's walls get swapped so the rooms look cohesive, and all furniture
from now on must be "highly detailed, carefully placed, and have cohesiveness between the entire room". So this is not a
list of fixes for today's sprites: it is what the upgrade sweep (every upgrade bought one at a time, 62c311d) and a study
of isometric game-art rooms of each kind taught, so the next generation pass comes out right. References were looked at
for study only, with DuckDuckGo image search in the built-in browser ("isometric <room> interior game art"); nothing is
to be copied.

### Rules for every room

1. **One painted shell per room, lit like its furniture.** In the references, walls carry the room's identity: trim,
   wainscot, panelling, windows with curtains, built-in shelves, sconces, a skirting line, and the floor has a material
   and a rug that zone it. Today most walls are flat code-drawn colour behind painted sprites, so the furniture looks
   pasted on. Paint the shell and the furniture in one palette, one light direction, one line weight.
2. **Fill each wall at three heights.** Reference rooms put big pieces against the walls (floor), counters and shelves at
   waist height, and art, shelves, lights and signs up high. Ours stop at the floor: the top half of nearly every wall is
   bare, and the middle of the floor is empty. Dress the walls first, keep the middle as the walkway.
3. **A hero piece that owns the room, at the right size.** Theater: the screen. Bowling: the lanes. Karaoke: the screen
   flanked by speakers. Boba: the wall of tea jars behind the counter. Closet: the built-ins. Game Room: the TV wall.
   Speakeasy: the lit back bar. In ours the hero is often small (the Game Room's Big TV is about the size of a poster).
4. **Furniture in groups that face something.** Sofa, rug and low table facing the TV; dining tables each under a pendant
   light; seats facing the lanes, the stage, the screen. Ours are mostly single pieces spread out on their own.
5. **Wall art you can read on a phone.** One large piece centred over the furniture it belongs to beats three small frames.
   It must show what its name says (an anime poster shows an anime character, a menu shows drinks, a movie poster shows a
   movie scene), and it sits at least a tile from the wall's end, a window or a door (Cal on the Bedroom's Anime Poster:
   "not obvious... 3 random pictures... too close to the right side of the wall").
6. **Built-ins, not standalone sprites,** for wardrobes, shelves, back bars, display walls: painted into the shell so they
   sit flush, with no gap, no floating and no seam.
7. **Every door is a painted doorway** (frame, threshold, a light) in the shell, on the side Cal's rule says (a back-left
   door comes out of the next room's front-right edge, back-right to front-left), with 1.5 tiles kept clear in front. Today
   doors are faint floor glows and 8 have furniture on them (Doors, above).
8. **Light you can see.** Lamps, pendants, neon and screens cast pools of light on the floor and walls in the references;
   ours are mostly flat. A glow-only upgrade must still read by day (the Arcade's Neon Trim shows nothing by day).
9. **One scale.** Size everything to the 74 px chibi: a microphone is hand height, a tower of macarons is waist height, a
   TV is wider than a person. Today scales jump (the Speakeasy microphone is tiny next to life-size musicians).
10. **Plan the final size first.** Rooms that grow with an expansion (Garden, Auditorium) zoom the view out, so everything
    bought later looks smaller: the Garden's Glass Conservatory (4000 coins) ends up a speck in a corner. Lay a room out
    at its final size and let early tiers leave parts empty, or let an expansion reveal more instead of shrinking it.
11. **Every upgrade a change you notice in one glance.** A better version of a piece (bed, chair, counter) needs a new
    silhouette or colour, not a texture tweak. Small decor (clock, sundial, sprinklers, garland, microphone) either grows
    or comes as a set. 9 upgrades draw nothing at all and 33 are weak (ROOMS's own measure, TASKS.md), and the sweep agrees.
12. **Screens and signs carry their picture in the art,** not only in code: a menu screen, TV or LED wall that is a plain
    black slab whenever its animation is paused reads as broken.

### Room by room (current build against the references)

Each line: what the references do, what ours does, the lesson. Sheets of every tier: `rigtest/qa/upgrades.js`.

- **Bedroom.** References: the bed's headboard on a wall with a nightstand and lamp each side and a rug under it, a desk
  zone with shelves stacked above it, big posters centred over the bed or desk, warm lamp light. Ours: the middle of the
  floor is empty, the wall art is three small frames near the wall's end, the wardrobe stands where the Closet door
  belongs, Canvas Art and the Figurine Shelf are hidden by the glass wall. Lesson: zone it (sleep, desk, dress), keep the
  Closet door's wall free, one big readable anime poster (or a set of three large ones) centred over the desk.
- **Closet.** References: continuous built-ins on every wall, floor to ceiling, an island with a rug, a mirror, soft
  strip light. Ours (the painted stages) already follow this and read well. The Jewelry Tower is a cyan glass sprite in
  a different style from the painting (already on ROOMS's list). The way to the Lair is only a blue floor glow; Cal's
  sliding cabinet (approval 3) is the right fix.
- **Game Room.** References: a TV media wall (TV with shelves of collectibles around it), a sofa facing it on a rug,
  light panels clustered beside the TV, posters, dense corners. Ours: most of the floor is empty, the "Big TV" is about
  poster size, the LED panels are in a different corner from the TV, every piece stands alone. Lesson: build the TV wall
  as one hero piece and group the seats on a rug in front of it; Cal's gaming desks back to back and cream sectional
  (HANDOFF, Open asks) fit this.
- **Patio.** References: string lights strung overhead between posts across the space, seats grouped around a rug or a
  fire table, planters along the rail, and the building's wall with its glass door visible. Ours: String Lights is one
  tall post in a corner, the seats are spread out one by one, and the Patio floats with a glass rail on every side and no
  wall or door back into the Bedroom. Lesson: paint the building wall and the sliding door on the Bedroom side.
- **Boba.** References: the hero is a wall of tea jars and canisters on open shelves behind the counter, a menu board
  with pictures of drinks above it, a window bar with stools, string lights. Ours: the Tea Jar Wall is a small shelf,
  the menu screen is a black slab at rest, the Neon Cup Sign is squeezed into the far end of the left wall, the middle is
  empty. Lesson: counter plus jar wall plus menu board as one back wall.
- **Dessert.** References: glass pastry cases are the counter, shelves of cakes and jars and chalk menus fill the walls,
  a few cafe tables by a window. Ours: the cases are good; the Macaron Tower and Cake Stand stand on the door to Boba, the
  Blossom Garland is a thin line high on the wall, the Teacup Shelf is tiny in a corner.
- **Speakeasy.** References: the hero is a back bar of tall lit bottle shelves behind the counter, a small stage with a
  spotlight and a mic stand, candlelit round tables, booths along the walls, art deco panelling. Ours: the bar and stage
  are there, but the front half of the floor is empty, the microphone is tiny next to life-size musicians, the velvet
  curtain is a small piece in one corner. Lesson: spotlight and curtain framing the stage, tables between stage and bar.
- **Upstairs Bar.** Ours: the right half is crowded (high tops, piano, the Jazz Corner stage on top of the entry mat by the
  door, the Champagne Trolley hidden behind the piano) while the left half holds one sofa. Lesson: balance the room,
  lounge on one side, music on the other, the door kept clear.
- **Rooftop.** Works best of all the rooms: a clear pool as the hero, zones round it. The DJ Booth reads as a black grill,
  the Stone Shower stands on the door, the Towel Station is small.
- **Restaurant.** Dark and moody as Cal asked, tables in a clear grid under pendant lights, a strong kitchen wing. Weak
  spots: the patio deck runs straight into the dining room with no rail, step or planter between them, so the curved
  booth, the fire bowl, the sofa and the umbrella pile up at the seam; a white drinks cooler stands in a fine-dining aisle;
  a black slab hangs on the back wall beside the painting.
- **Garden.** References: beds in a regular grid with paths between, a fence, one building (shed or greenhouse) as the
  focus in a corner. Ours: the beds start in rows but later pieces are dotted around, and each land expansion zooms the
  view out so the last and most expensive pieces (Stone Fountain 1500, Glass Conservatory 4000) are specks. Root Cellar
  shows nothing at all; Sprinklers and Drip Irrigation change under 800 pixels.
- **Theater lobby.** References: one long concession counter against a wall with lit menu boards above it, poster frames
  with lights along the walls, a ticket booth at the entrance, patterned carpet. Ours: the popcorn cart, soda fountain,
  concession stand, candy case, hot dog roller and nacho station stand in a row of separate red boxes in the middle of
  the floor; the trailer screen is a black slab at rest. Lesson: one concession counter, built along a wall, that grows.
  The wall upgrades (Painted Walls, Velvet Walls, Gold Trim, Marble Lobby) are the best tier changes in the game.
- **Auditorium.** References: the screen fills a wall and glows, stepped stadium rows climb toward a projection booth high
  in the back wall with a beam across the room. Ours: the projector stands on a tripod on the floor behind the seats,
  the rows sit on a flat floor, and the Leather Recliners turn the seats from red to near-black on a dark room, so the
  room gets darker and flatter as it is upgraded. Bigger Screen and IMAX grow the room and the view shrinks to fit.
- **Mall.** References: storefronts fill the bays along the walls (sign, awning, lit window, shop visible inside), the
  atrium holds the fountain, planters and benches, kiosks line the aisle, escalators connect floors. Ours: each store is a
  separate facade sprite stood in front of the walls rather than filling a bay, so they overlap the pillars and leave
  shuttered bays empty even when everything is bought; the directory screen is a black slab. Lesson: paint each store
  into a bay of the shell, so buying a store opens that bay.
- **Bowling.** References: the lanes are the room: they run the full length from the seating to a pin deck flush against
  the far wall, with masking panels and score screens above the pins, ball returns between lanes, seats behind the foul
  line. Ours: two short lanes float in the middle of the carpet with the pins in open floor, the score screens hang on
  another wall, the snack bar stands in the aisle between the lanes and the seats, and Ball Return and Ball Rack change
  about 1,300 pixels each. Lesson: lanes wall to wall, everything else around them.
- **Karaoke.** References: a big screen on the main wall flanked by speaker towers, a sofa curving round a low table
  facing the screen, a small stage between them, coloured spotlights on the floor. Ours: the screen and stage are right,
  but the Purple Couch and the Private Booth sit side-on to the screen, the lyric screen only says "la la la", and the
  Neon Microphone, Tambourine Stand and Stage Lights change about 1,500 pixels each. Lesson: seats face the screen, the
  screen shows a lyric scene.
- **Arcade.** References: cabinets shoulder to shoulder along every wall facing into the room, neon signs and posters
  covering the walls, one feature in the middle (air hockey, a dance machine), a dark carpet that stays calm. Ours: the
  walls are bare except three neon stripes, the cabinets bunch in the back corner, the middle is open, and the loud
  confetti carpet (the Bowling carpet too) is busier than the furniture, so pieces are hard to pick out. Neon Trim shows
  nothing in the picture. Lesson: line the walls with machines, keep the floor pattern quieter than the furniture.
- **Rhythm.** One of the best: the walls have their own treatment (foam panels, neon mirror strips), the machines stand
  against the walls facing into the room, one palette. Weak spots: the bench faces away from the dance machine, the
  trophy case stands alone in the open floor, and the speaker tower stands on the door back to the Arcade.
- **VR.** Dense and of one style (white and blue sci-fi), which is the right level of detail. But the rigs fill the
  middle with no walkway and face every which way (two racing seats face lower left, the pods lower right), and the
  walls hold only one screen and a hologram board. Lesson: rigs in rows facing the same way, a clear aisle to the door.
- **Club.** The dance floor, DJ booth and speakers in front of it are right (the references agree). But the DJ booth and
  the neon bar are both squeezed onto the right half of the back wall, the left half of the room and every wall are
  near black with thin lines, and the Velvet Rope, Smoke Machine, Glow Cocktail Cart and Laser Rig each change under
  1,100 pixels. Lesson: a bar wall of its own with backlit bottles (Cal's idea), LED or truss lighting on the walls.
- **Lair.** The model for the next pass, with the Closet: one painted room, upgrades painted as layers in the same style
  (server racks, command console, armory, suit cases), so every tier looks finished and of a piece. The weak part is the
  floor: the Drone Dock, Energy Canisters and Gadget Workbench are small separate sprites, flatter than the painted walls,
  dotted around a big empty floor. Lesson: paint floor pieces at the walls' level of detail, grouped round the war table.

### Does each upgrade look like its name? (close-ups, `closeups.js`)

For 12 rooms so far, each upgrade was cut out before and after, zoomed on what changed, with its name and shop line.
Most pieces match their names and are well drawn: the Game Room's sprites, the Boba Tea Prints (cups) and Neon Cup Sign,
the Bedroom beds, chairs and windows. Where they do not:
- **Bedroom Anime Poster:** three small frames with plain line drawings, no anime art, in the narrow strip of wall between
  the glass and the corner (Cal's finding, confirmed). **Gallery Prints** are the same three small frames, so two upgrades
  look alike. **Neon Sign** swaps one frame for a lightning bolt; it does not read as a neon sign or glow.
- **Promises in the shop line that the picture does not keep:** Game Room RGB Floor Lamp "Sets the whole room purple" (a
  thin lamp, no purple light), Boba Window Bench "under the window" (the room has no window), Boba Tea Jar Wall "every jar a
  different leaf" (a small bookcase, not a wall), Boba Menu Screen "cycles through today's drinks" (a black slab whenever
  its animation is paused).
- **Expansions are only a floor glow:** Walk-in Closet, Knock Into the Game Room, Open the Dessert Parlor, the Closet's
  door to the Lair. The doorway itself should be painted (rule 7).
- **Staff and pets draw nothing in the room picture** (Hire a Barista, Hire an Usher, Adopt Pluto): they show as people
  and dogs, which these pictures leave out. Not a bug.
Lesson for the next pass: write the shop line from the finished art, or paint to the line, and make every "sign", "neon",
"lights" or "screen" upgrade visibly light the room.

## Town hall, weekly competition, AI photo proof, 15 players (2026-11-05, 12a46ba)

Cal asked: a town hall board or chat room where everyone sees each other's characters, outfits, levels and achievements,
a weekly prize cosmetic for the most coins or XP, picture proof checked by AI so it stays fair, and whether 15 people
playing at once could break the game.

**Most of the town hall is already written and switched off.** `30_app_b.js` (the `/*SOCIAL*/` block) has Neighbors and a
Town board: each player publishes `worlds/<id>` (name, look, level, streak, rooms, crew, dishes served) at most every 90
seconds; you can visit anyone's Loft room by room, say hi with a note (they get +5% XP for the day, you +2%, and your
character walks around their Loft for half an hour), read their guest book, and post on a town board (280 characters, the
latest 30 shown). `socialHtml()` is never called, so none of it shows; only the visitors walking in still work. Wiring it
into a tab is small. Missing for Cal's idea: outfits are in `look` already; achievements, coins and XP this week are not
published; there is no chat (the board loads when opened, it is not live) and no leaderboard.

**15 players will not overload it.** Each player's game runs on their own phone; nobody's lag affects anyone else. What is
shared is small: each save is one private document (`data/users/<id>/state`, written at most every 350 ms while playing),
`worlds/<id>` every 90 s at most, a check for visits every 2 minutes, and the board when opened. For 15 people that is a
few writes a minute in all.

What can actually go wrong with 15 people, worst first:
1. **Access level.** The game tells players to share the page "as an Editor". Editors are admins on the platform: an
   Editor can publish a different page or change the database rules. Friends only need to write data, which the
   Contributor level allows. Share as Contributor, and keep Editor for LEAD's account. (Owner: LEAD, to confirm the levels
   in the share dialog.)
2. **No database rules are declared,** so any player can overwrite or delete anyone's `worlds/` doc, visit notes and
   board posts (the page only offers delete on your own, but the database would accept it). The platform supports "all
   read, each writes own" rules (`{path:"worlds",read:"view",write:"owner"},{path:"worlds/{self}",write:"interact"}`), the
   same for `pings` and `board`. Must be in place before a prize depends on it. (Owner: LEAD.)
3. **Publishing mid-day.** A tab left open on an older version stops saving once a newer one has saved, and says "A newer
   version saved your progress. Reload to continue." With 15 people, every publish will catch someone mid-session. Their
   progress is protected, but anything they did after that message is lost until they reload. Publish at night, or reload
   by itself when a newer version is seen.
4. **AI checks run on each player's own Claude account.** Photo checks (`sample`, already used for the gym trials and
   Prove it) go through the viewer's own Claude allowance, so 15 players do not share one limit; but a friend on a plan
   without image support gets no check (`limits().images` false), and anyone can hit a rate limit. Whether a free account
   can use it is still not verified (HANDOFF, Not yet verified).

**A fair weekly prize is possible, but not cheat-proof.** There is no server of our own: every number (coins, XP, the
AI's verdict) is computed in the player's own browser and saved by the player. Someone who opens the browser's developer
tools can give themselves coins or skip the photo check, and nothing in the page can stop that. For 15 friends that is
usually fine; to make it fair enough:
- Rank by **verified XP this week** (tasks proven with a live photo, plus the weekly workout), not coins: coins come mostly
  from passive income and missions, which need no real-world effort (see the simulation below).
- Keep a **proof receipt** for each verified task: the AI's verdict and a small copy of the photo in a shared `proofs`
  collection, readable by everyone or only by Cal (`read:"admin"`). Friends checking each other's photos is the real
  anti-cheat; Cal can void a bad one.
- Pick the winner at the week's end from everyone's published numbers and let **Cal confirm it** before the cosmetic is
  granted (an owner-only button), so a faked number never wins on its own.
- Some tasks cannot be photographed honestly (brush teeth, meditate). Count them at honor value or leave them off the
  ranking.
- Photo privacy: proof photos show people's homes. Ask before sharing them with everyone; owner-only is the safe default.

**Chat:** the platform has a `room` capability for whoever has the page open right now (live presence), and the database
can push changes as they happen (`onSnapshot`). A live town chat and an "online now" list are possible; moderation
(delete, mute) should stay with Cal.

## Economy and play simulation (2026-11-05, 12a46ba, `rigtest/qa/sim.js`)

A new player plays the real game through its own buttons while the game's clock moves forward: tasks (with photo proof
where the player type uses it), the weekly workout, the wheel, missions, room income collected at each visit, Garden
produce sold, every story scene accepted, every lot built, and coins spent on the cheapest room upgrade on offer until
nothing affordable is left. Level trials (the gym photo) are cleared the day after they appear. Not modelled: clothes,
classes and their bonuses, training sessions (15 XP at most), delves, crew, neighbours. `python3 simsum.py <out>` prints
the tables. Players: casual 6 tasks (95 XP on paper) 5 days a week, no proof; regular 12 tasks (200 XP on paper), proof on
two, 4 workouts a week; grinder 20 tasks (450 XP), proof on every 25+ task.

| | Casual | Regular | Grinder |
|---|---|---|---|
| Day 1 | (rests: starts on a weekend day) | level 4, 1,900 coins, 9 Bedroom upgrades | level 4 (trial waiting), 4,400 coins, 14 upgrades, Garden |
| Week 1 | level 9, Bedroom only, 24 upgrades | level 19, 4 rooms, 62 upgrades | level 36, 7 rooms, 130 upgrades |
| Month 1 | level 25, 5 rooms, 79 upgrades | level 79, 19 rooms, 344 upgrades | level 100 (cap) on day 21, all 20 rooms and 370 upgrades on day 21 |
| Month 2 | level 49, 11 rooms, 230 upgrades | everything bought by day 33, level 100 by day 40, 970,000 coins unspent on day 60 | 1.6 million coins unspent, nothing to buy since day 21 |

What it shows:
1. **The game runs out.** A player who does a dozen tasks a day owns every room and every upgrade in about five weeks; a
   busy one in three. After that there are no levels and nothing to buy, so the loop "chores, coins, build" stops.
2. **Room income runs away.** For the regular player, coins in month 2 come about 70% from room income (about 21,000 a day
   by day 45), 20% from missions (8,000) and 10% from tasks (4,000). The kitchens' "3 quests a day" rule is the only link
   between chores and room income, and it is easy to meet. Prices go up to x6 by the Club, income far more.
3. **Missions pay more XP than real tasks.** By day 60 the regular player has 64,000 XP from missions against 41,000 from
   tasks (the grinder 79,000 against 118,000). Mission pay grows 2% per level, so at level 60 it is 2.2x. Sending a mission
   is a tap; a task is real effort.
4. **Levels come about twice as fast as `docs/PROGRESSION.md` planned** even before missions: photo proof, streak, combos,
   crits and bounties turn the regular player's 200 XP on paper into about 420 (level 19 on day 7, plan: level 20 on day 13).
5. **Level trials need a gym photo** at levels 5, 10, 20, 30... ("Doesn't look like a workout spot"). A friend who never
   works out stops at level 4, permanently. In the runs a trial blocked 10 to 13 days' end, cleared the next day.
6. The casual player is paced about right for two months, until the Lair opens missions on day 45: level 31 to 49 in 15 days.
7. No page errors in any run.

For LEAD (economy, owner): tie room income to the day's tasks (for example: rooms earn only on days with N tasks done, or
income scaled by the day's task XP), give missions coins but little or no XP and no per-level growth, tune the curve to
what players really earn (about 2x the paper XP), and add things worth buying after the last room. For Cal: whether level
trials should accept other proof than a gym photo.

## Proposal: an effort-first economy (2026-11-05, for Cal's go, then LEAD)

Cal: "the goal of this game is to promote doing chores and tasks. If completing missions and getting passive income is way
faster and easier than training or completing tasks, we need to rethink this entire money system... so that doing chores and
training will always reward you more than having a virtual restaurant give you money or sending people out on missions."

**The rule everything follows: real life is the engine, the town is a multiplier on it.** Nothing in the game makes coins
or XP on its own; every coin traces back to a task or a workout you did today.

1. **XP comes only from real life.** Tasks, workouts, training sessions, trials, the Daily Quest and bounties give XP.
   Missions, story scenes and room income give none. Levels then mean "how much you actually did".
2. **The Daily Quest (Solo Leveling).** Each player sets a daily goal in XP (100, 150, 200 or 300; tasks of their own
   choosing count toward it). Today's progress p sets the town's efficiency:
   - no task done today: the town is closed, earns nothing, no missions can leave;
   - first task: 25%, rising with progress to 100% when the Daily Quest is complete (a "Daily Quest complete" card and a
     small chest);
   - past 100%: Overtime, up to 150% at twice the goal;
   - **200%: a hidden quest completes** (never shown until someone first reaches it): a secret reward (a rare furniture
     piece, a cosmetic shard toward a set, a streak freeze or a stat point) and a buff for tomorrow (+10% XP, town at 110%).
3. **Rooms earn from your effort, never past it.** Rooms keep their hourly takings and their upgrades, but each day they can
   pay out at most a share of what your own tasks earned today: 20% with a bare town, rising to 50% fully upgraded, times
   the Daily Quest efficiency. A finished town makes you about 1.5x richer for the same work; it never replaces the work.
4. **Missions run on energy, and energy comes from tasks.** Every task gives energy equal to its XP; a mission costs energy
   (a quick one 25, the Spire 250). Missions pay coins, loot and story, and no XP. Sending your team out is how you spend a
   productive day, not how you skip one.
5. **Training pays the most per minute.** A logged gym session is worth a 50 XP task (100 with its photo), plus a stat point
   (STR, AGI, VIT, INT) that buffs the town: VIT raises the town's cap, AGI shortens missions, STR improves loot, INT raises
   the Daily Quest's chest. The weekly four-workout bonus stays.
6. **Prices ramp with what a thing is** (Cal: a poster is not the price of a popcorn machine or an IMAX screen), times the
   room's story step as now: decor 200, furniture 500, equipment that does a job 1,200, a big piece 3,000, a moment
   (expansion, IMAX, a new room) three times its current price. A poster stays 200 in every room; the IMAX becomes about
   42,000 at the Auditorium's step. Total for everything: about 1.2 million coins (now 440,000).
7. **Trials are active only** (Cal: "Sung Jin Woo didnt rank up by cleaning his room"): a gym session, an outdoor walk or
   run, a sport, a hike. The photo check asks for an active setting outdoors or a workout space, and a walk can also be
   proven by location (start and end points 1 km or more apart).

Modelled with `rigtest/qa/effort_model.py` (prices from the live game, task pay from the `sim.js` runs):

| | Casual | Regular (12 tasks) | Grinder (20 tasks) |
|---|---|---|---|
| Day 7 | | 42 of 381 upgrades | 71 |
| Day 30 | 83 | 182 | 271 |
| Day 90 | 212 | 337 | everything (day 74) |
| Everything bought | more than a year | about day 155 | about day 74 |
| Share of coins from tasks | 70 to 76% | 61 to 83% | 53 to 77% |

Tasks stay the biggest source of coins for every player at every point, XP is 100% real life, the cheapest thing on offer
stays within a day's pay, and the biggest moments take about a week. The grinder still finishes first, which is the point:
more real work, faster town. After the last upgrade: renovation themes, cosmetic sets and seasonal items (the next art pass).
Not modelled: the story gates' timing, clothes, classes. To check after it is built: rerun `sim.js` on the real code.

## Cal's six requests (2026-11-05), written for LEAD and ROOMS

1. Town hall on: post a picture of your character in your current outfit with a short message for everyone.
2. Rooms earn only if you completed a task today; 100% at the daily task limit; 200% of it grants a hidden reward and more
   town buffs and efficiency (Solo Leveling's daily quest). In the proposal above, rules 2 and 3.
3. Prices ramp with what a thing is; later things easier to buy because passive income keeps coming. Rule 6.
4. A weekly town meter: everyone's progress fills it; everyone sees each player's coins and XP gained, never their task
   list or task descriptions.
5. A rotating daily bounty and a 3-day bounty; AI-suggested tasks for the chores everyone puts off ("throw away one thing you
   have not used for more than 6 months").
6. Trials for everyone, but active: a walk, a gym session, something physical. Rule 7.

### v48 economy run (0426a46: room payout limit, mission pay, doubled curve, dungeon gifts)

| | Casual | Regular | Grinder |
|---|---|---|---|
| Day 7 | level 6, 19 upgrades | level 14, 3 rooms, 51 | level 25, 6 rooms, 111 |
| Day 30 | level 17, 5 rooms, 80 | level 39, 11 rooms, 233 | level 70, everything bought |
| Day 60 | level 26, 8 rooms, 159 | level 68, everything bought | (day 55) level 100 |
| Month 2 coins | tasks 35%, rooms 32%, produce 20% | missions 34%, rooms 25%, tasks 23% | tasks 38%, rooms 31%, missions 20% |

Missions now give little XP. The Mall gate (60,000 earned by businesses) stalls a daily player 9 days with nothing to buy.
Dungeon sets (`dropodds.py`): Goblin King 18 days median (90% by 27, worst 51), Amulet 16 (90% by 23, worst 39).

### Effort-first run 1 (LEAD's 29ae247, on 3a6fdd5)

`sim.js` now sets each player's Daily Quest goal (casual 100, regular 150, grinder 300) and logs a training session on
workout days. 60 days each.

| | Casual | Regular | Grinder |
|---|---|---|---|
| Day 7 | level 6, 9 upgrades | level 15, 4 rooms, 31 | level 26, 4 rooms, 66 |
| Day 30 | level 18, 4 rooms, 41 | level 39, 7 rooms, 130 | level 70, 10 rooms, 218 |
| Day 60 | level 26, 5 rooms, 79 | level 64, 11 rooms, 230 | level 100, 19 rooms, 359 |
| Tasks' share of coins, month 2 | 47% | 35% (missions 22%, rooms 14%) | 49% (rooms 18%, missions 17%) |
| Days with nothing to buy | 2 | 4 | 2 |
| Real XP a day (week 3) vs goal | 242 vs 100 | 752 vs 150 | 2,323 vs 300 |

XP comes only from tasks, training and the weekly bonus. The Daily Quest goal is reached two to eight times over every
day, so its hidden quest is not hidden. No page errors.

### Effort-first run 2: Cal's target (d7ae577)

Cal: a serious player reaches level 100 and owns the whole town in about 50 days. Regular (12 tasks) 60 days, grinder (20) 70.

| | Regular | Grinder |
|---|---|---|
| Level 100 | day 60 | day 26 |
| Everything bought | not yet (270 of about 380, 14 rooms, on day 60) | day 58 |
| Days with nothing to buy | 0 | only after buying everything |
| Coins from day 31 | missions 32%, tasks 30%, rooms 13% | tasks 46%, missions 25%, rooms 18% |

Missions twice a day doubled mission coins. Suggested: mission energy doubled, `xpK` 0.85, `price.moment` 2.5.

## Writing pass review against `docs/VOICE.md` (2026-11-05, on 90d88d1, `rigtest/qa/voice.js`)

1,369 player-facing lines (upgrade names and lines, Shop items, story scenes, return visits, team, trophy sets) checked for
the hard rules: only 3 real breaks (an exclamation mark, a banned word, a line VOICE.md itself lists to cut). LEAD's pass
worked on the hard rules. Read by hand, these still end on a punchline or wink at the player ("No punchline on the end",
"Talking to the item or the player in a wink"). Suggested rewrites, all physical detail, no tag:

| Where | Now | Suggested |
|---|---|---|
| `27_rooms.js:127` Teleport Pad | It probably works. | A ring of floor lights wired into the reactor. (VOICE.md's own example) |
| `27b_skins.js:118` Taiko | Don! Ka! | Two barrel drums and a pair of sticks on a cord. |
| `10_app_a.js:1515` Squat Rack (old gym) | The real boss fight. | A steel rack with safety bars and plates on the pegs. |
| `27b_skins.js:61` Carpet & Wall Panels | ... Goodbye, bare concrete. | Plush dark carpet and panelled walls. |
| `27b_skins.js:62` Hex Acoustic Panels | ... Sounds better, looks better. | A wall of hexagon felt panels behind the TV. |
| `27b_skins.js:63` LED Lighting Rig | ... The room comes alive. | Cove lights, light bars and glowing hex panels. |
| `27b_skins.js:66` Round Rug | Pulls the room together. | A round rug with a teal pattern under the couch. |
| `27b_skins.js:69` Ping Pong Table | The noise is part of it. | A blue table, two paddles and a net clamp. |
| `27b_skins.js:70` Green Arcade Cabinet | Your initials, forever. | A green upright with a joystick and two buttons. |
| `27b_skins.js:71` Foosball | Spinning is cheating. | Wooden table, eleven rods, a cork ball. |
| `27b_skins.js:72` Soda Machine | Free, because it is your house. | A red vending machine, lit from inside. |
| `27b_skins.js:73` LED Wall Panels | It glows. | A cluster of hexagon lights in blue and violet. |
| `27b_skins.js:74` Dartboard | Mind the wall. | A cork board in a wooden cabinet, three darts. |
| `27b_skins.js:78` Beanbags | Nobody ever gets up. | Two beanbags, blue and orange, by the old TV. |
| `27b_skins.js:79` Mini Fridge | Never walk to the kitchen again. | A glass-front fridge stacked with cans. |
| `27b_skins.js:128` Shoe Counter, Score Console | Size? Fine. / Type your name. Regret it. | Rental shoes in cubbies by size. / A screen over the lanes with each bowler's frames. |
| `27b_skins.js:167` Wall Booths | ... Everyone wants one. | Two more booths along the wall, velvet and brass. |
| `27_rooms.js:166` Patio lines | A real upgrade. / Look straight into someone else's patio. / no walking required | Wicker, deep cushions. / A brass telescope on a tripod by the rail. / A rattan cart with two shelves of bottles. |
| `27_rooms.js:174` Jazz Corner | One microphone. Nobody leaves. | A round stage, one microphone on a stand. |
| `21_restaurant.js:13` Flat-Top Grill | ... Burgers for days. | A long griddle and a proper hood. |
| `21_restaurant.js:18` Grand French Range | ... The dream. | Navy enamel, brass rails, copper pots. |
| `21_restaurant.js:64` Star Plaque | The critics came. You won. | A framed review and a star by the door. (VOICE: nobody tells the player they are amazing) |
| `26_world.js:341` Brass Chandeliers | ... Everything looks more expensive. | Sculptural brass over the room. |
| `26_world.js:352` Noir | ... Everything changes. | Charcoal walls, dark walnut floor, low light. |
| `23_theater.js:32` Claw Machine | Nobody has ever won. Everyone keeps trying. | A glass box of plush toys and a three-prong claw. |

Fine as they are (dry and specific): "A chihuahua dachshund mix. Very fast, very long.", "Spare cells for the reactor. Blue,
humming, do not shake.", "Chopstick's own.", "Petals never stop." (one light line a screen is allowed).

## Design reviews (Cal, 2026-11-05: "send any rooms to QA for further notes and analysis before coming back to me")

How QA reviews a room before Cal sees it: fully bought, at noon (open-air rooms also at night), from the room picture as a player
sees it. Five questions: does it read as one planned space; does every piece face where it is used; is anything doubled, random,
floating or oddly sized; are the walkways and sight lines clear; what to change. Blunt, with the fix.

### Rooftop Bar (ea2dffc, on 3cdf263; `shots/review_rooftop.png`, `review_rooftop_tub.png`, `review_rooftop_bar.png`)

Much better than before: there is a plan now (bar and DJ on the back walls, pool as the middle, lounge left, sun front). Not done:

1. **The hot tub blocks the pool's step.** The pool's stone step faces front-right, and the hot tub sits right on it, so the one
   way into the pool leads into the tub. Move the tub to the front-left corner (near the loungers) or beside the cabana; the step
   should open onto clear deck.
2. **The loungers float in the walkway.** The pair stands in open floor between the stairwell and the hot tub, aimed at the
   pool's corner, a tile or two away from it. That is the path from the stairs to everything. Line them along the pool's long
   front edge, facing the water, side by side with the little table between.
3. **The stairwell has no landing.** The parasol table's chairs are about one tile from the top of the stairs: you come up into
   a dining set. Give the stairwell a clear tile: move the parasol table up beside the fire lounge, or drop it (the fire lounge,
   the bar stools, the cabana and the loungers already seat everyone; four seating zones is a lot for one roof).
4. **The bar still reads as two pieces.** The back bar sits behind only the right half of the counter, against the wall, with
   almost no aisle for a bartender. Centre the back bar behind the counter and leave a one-tile aisle, or slide the counter a
   step forward.
5. **The pool floats.** It is not along the back wall; it sits mid-deck with an empty strip behind it and in front of the DJ.
   Either push it back so the DJ looks over it from a step away, or keep it central and put the loungers on its front edge (2)
   so the strip in front reads as the pool deck.
6. **Scale.** The flamingo float covers about a third of the pool; half the size reads as a float in a pool. The hot tub is almost
   as wide as the pool; a little smaller.

Faces where used: the DJ faces the pool (good), the stools face the bar (good), the cabana opens to the pool (good), the shower is
by the cabana and the rail (fine). Sight lines from the stairs: the parasol table and the loungers are in the way (3, 2).

### Lock and Key (707cac1 and after, on 3cdf263; `shots/review_lockkey.png`)

Reads as one planned room: bar along the back with its back bar right behind it, lounge left, music front, standing tables right.
Pieces face their use (stools to the bar, sofa toward the band, the piano by the stage). Notes:

1. **A door mat with no door.** The mat on the front-right edge is a front-door mat, but nobody enters there: this room is
   reached by Downstairs (front-left) and left by the stairs to the roof (back-right). It is the one random piece left. Remove it,
   or put it at the Downstairs edge where people actually arrive.
2. **The humidor floats.** The glass humidor stands alone against the right wall between two high-tops. Put it with the bar (at
   the back bar's end) or in the lounge corner by the sofa, where people sit and smoke.
3. **The roof stairs are crowded.** The nearest high-top stands right beside the stair door; move it a tile toward the room so
   the doorway has a clear tile.
4. **Fine as is:** the empty floor in front of the bar works as the walkway and a little dance floor; three stools on a long bar
   is fine; the oyster and champagne cart by the bar's end belongs there.

### Review fixes, round 2 (ROOMS's d95d880, on 2df050f; `shots/review_rooftop2.png`, `review_lockkey2.png`)

Lock and Key: all three notes fixed (no door mat; the humidor on the lounge wall by the sofa; the high-top a tile off the roof
stairs). Reads as one room; ready for Cal.

Rooftop: five of six fixed. The pool sits back toward the DJ, the loungers face the water from its left end, the hot tub stands
beside the cabana with a clear gap from the pool step, the stairs arrive on clear deck (Parasol Table retired, id kept), the
fire-table lounge holds the front, the flamingo and tub are smaller, and the shower between the pool step and the tub reads as
"rinse first". Still open: **the bar** (note 4): the back bar is unchanged, behind only the right half of the counter with no
aisle. Centre it behind the counter, or slide the counter a step forward. Everything else is ready for Cal.
