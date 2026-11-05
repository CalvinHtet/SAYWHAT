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
- `upgrades.js`, every room: running.

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
