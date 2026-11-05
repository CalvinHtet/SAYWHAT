# Task board

The one list both chats share (see `TEAMWORK.md` at the top of the repo). LEAD keeps it tidy. Re-read it right
before editing; edit only your own section, except to add a request for another chat.
Details for every item are in `docs/HANDOFF.md`.

CHROME: ROOMS (since 11:05 am)

Live on the phone: `APPV` 47 (page version 21), 2026-11-05.

---

## LEAD: board, quality of life, Shop and Training code, everything else in the app, publishing

Doing:
- Nothing in progress. Next: publish v47 when ROOMS's pilot or exteriors land, or on Cal's say.

To do:
- [x] Shop text in Bebas Neue Light (titles stay), the Shop banner a real rectangle on a phone, next drop as its own line
      (47f3af4). Goes live in the next publish.
- [x] Story reasons, investors on earnings, equipment earns and decor does not, a team of five, class art by body (d523cf1).
      Not published (QA's economy simulation first).
- [ ] Dungeon gifts, Relics and Trophies (Cal, Goblin King set): gifts on mission return with a reveal; loot per mission;
      the Trophies tab becomes Relics, with tiered relics hidden until earned (old badges carry over) and a Trophies sub-tab
      that opens after the first piece and the Lair's Trophy Room; piece buffs and the set bonus; the crew fix (nobody has
      joined since the lounge was removed). Art requested from ROOMS below. QA to simulate drop odds.
- [x] Progression parts 1 and 2 (d5fba8f, aa0d9ed): new curve, no level locks, story prices, the story scenes. Not published until QA's
      simulation. Next: tune the gates with QA's numbers; swap in ROOMS's portraits and merged room.
- [ ] (was) Progression (Cal, 2026-11-05): plan in `docs/PROGRESSION.md`. New XP curve
      (level 10 in about 4 days, at most 3 days a level), no level locks on room upgrades (4 shown, the 4th a mystery),
      prices rising along the story, and rooms opening through a story (garden, sell produce, a partner opens the restaurant,
      boba, dessert, an investor's speakeasy, rooftop, the strip mall, theater and auditorium, arcade, bowling, karaoke).
- [x] (from ROOMS) Saves: online saving fixed, an old online save never replaces newer progress (9c3bd78). Goes live in the
      next publish. Each device asks once, "Two saves found", when its save and the online one disagree.
- [x] (from ROOMS, ade6cd0) Shop banners, Cal on approving the art: each brand's title stylized and unique (not plain white text or a
      shadow), playful taglines instead of descriptive ones (keep ALTITUDE's "Trail gear that never sees a trail"), and the
      next drop as a small, unobtrusive countdown on the Shop's main tab, not in the banner. Publish with ROOMS's banners.
- [ ] (from ROOMS) Phone lag (Cal, on v43: "very laggy on the phone"). The `diag/frame` log landed nothing because saves were
      broken (`db` was null), so it lands again after the next publish, and a new `diag/perf` log records frame rates on the
      real phone. Fix what the real numbers show. Room code changes go through ROOMS (requested below). Done so far (4b71234):
      a room window pauses the building view's animations (532 running, 30 with a window open).
- [x] `dropbox-leftovers` reviewed (nothing worth bringing over) and deleted with Cal's OK.
- [x] Yawn pilot, code (rig.js flat painted layers, `rigtest/template.html`). Without painted art the stretch renders
      byte for byte as before. Self-check feeding a top's own render back in: about 0.7% of pixels differ on the man (edges),
      2 to 5% on the woman (her long hair over the sleeves: a flat picture sits over or under all of it). Waiting on ROOMS.
- [x] Stretch pose: the gentler yawn (Cal's pick), 0959719. Dark long sleeves still look torn at the elbow, as before.
- [x] `lfvar.json`: a copy is in git at `app/lfvar.json` (0959719). `build.py` does not use it.
- [ ] Before release: remove the Test panel, the Shop's Testing row, each room window's Testing undo link, and the
      `window.__qb` / `window.__qbLoft` hooks. Also the phone log (`qbFrame` in `26_world.js`) and the `diag/frame` doc,
      sooner if the Loft height is sorted first.

Ready to publish (ROOMS adds lines here: `READY TO PUBLISH: <what>, look at: <what to check on the phone>`):
- READY TO PUBLISH: yawn pilot (Cal approved 2026-11-05), b506b8c. Eight painted layers in `art/app`: the bare body
  (`m_base_yawn`, `f_base_yawn`) and the zip jacket, puffer and hoodie (`<m|f>_<id>_yawn`), drawn by the `stretch` pose
  through LEAD's `rig.js` change. The body is the rig's own render except around the shoulders and armpits, where the
  painting fills the tear (`tools/yawn_body_mix.py`), so trousers, shoes and hair line up; the garment cuts drop the faint
  mannequin outline the generator left. Look at: a character at the peak of the yawn wearing each of the three tops, both
  bodies, and bare-armed with no top. Checked headless in the rig: the three tops on both bodies, no double outline, no
  stray lines, no errors. Not checked: on a phone, in a room, with other trousers, hair, hats or accessories (QA's
  combination sweep), and the starter tee still tears at the armpit because it has no painted layer. Known small flaw:
  a sliver of skin at the man's left hip under the zip jacket.
- READY TO PUBLISH: the Hero's Lair moves above the Closet (Cal, 2026-11-05). In the building view the Lair is now directly
  above the Closet (it was to its left). The Closet's last upgrade (`cl_lair`, now after Super Sleek Modern) shows the corner
  cabinet on the upper wall slid away from a glowing stair; right after buying it, once the "You found the Hero's Lair"
  window is closed, the cabinet slides into the wall over 2 seconds. Doors: Closet upper wall to the Lair, the Lair's
  bottom-left edge back. Door arrows now sit in the frame corner on their door's side (QA). Look at: the building view,
  buying the Lair in the Closet and watching the slide, walking Closet to Lair and back. Checked headless: building view,
  the slide (caught mid-slide), both doors, no errors. Not checked: on a phone, and the slide at full frame rate.
- READY TO PUBLISH: Closet stages (Cal approved the paintings 2026-11-05). Every Closet upgrade now shows its own painting of
  the same room: lights off, Wardrobe Lights (LED strips top and base), Shoe & Bag Wall, Jewelry Wall (renamed from Jewelry
  Tower: two doors open onto a jewelry display, no more sprite), Center Island, Glass Closet, Super Sleek Modern (smoked
  glass, black marble). Look at: the Closet on a phone, buy each upgrade in turn and check each one changes the room.
  Checked headless: each stage bought in order draws its own painting, no errors. Not checked: on a phone. The Hero's Lair
  stage is not in yet (waits on Cal's answer about the door side).
- PUBLISHED in v45. READY TO PUBLISH: the five painted brand banners (Cal approved the art 2026-11-05), `art/app/ui_banner_*.webp`, bundled
  into `art_ui.js` by the build. Look at: the Shop, each brand's banner on a phone.
- PUBLISHED in v46. READY TO PUBLISH: Bedroom patio door and view (17ab80d). Once the Patio room exists the Bedroom has a sliding glass door
  onto it (the last pane of the glass wall, or a door of its own in the back wall without the glass upgrade), and through
  the glass you see the Patio room as it is furnished, with its skyline. Look at: the Bedroom on a phone, with Floor-to-
  Ceiling Glass, the Patio's furniture behind the glass; buy something for the Patio and check it shows from the Bedroom.
  Checked headless: four cases (glass and patio with Cal's furniture, glass and every patio item, plain wall and patio,
  glass without a patio), plus the building view, no errors. Not checked: on a phone; with the plain wall the bookshelf
  stands partly in front of the door.

Art and room code requests (LEAD asks, ROOMS does):
- Team, class art and team looks (Cal, 2026-11-05; code in d523cf1, `29c_team.js`). Show Cal each set side by side:
  1. Class banners in the game's own chibi style, a man's and a woman's version of each: `ui_class_<id>_m.webp` and
     `_f.webp` for tamer, swiftblade, runeweaver, vanguard (360 x 480 portrait, the player's chibi in the class gear). The class
     screen and the job banner pick the one matching the player's body; the old picture shows until then.
  2. A join banner per team member, anime style, 720 x 400: `ui_team_sable.webp` (scout, rescued in the dungeon),
     `ui_team_mara.webp` (chef), `ui_team_rafe.webp` (Rafe Calloway, a sunburnt travelling adventurer with a map tattoo,
     an Old Fashioned in hand), `ui_team_nova.webp` (Nova Lin, a fashion vlogger with a ring light on her phone),
     `ui_team_theo.webp` (theater crew). Original designs. The investors (Desmond Hale, Priya Okafor) are not team members:
     they only need their scene portraits (`ui_story_lockkey.webp`, `ui_story_mall.webp`); Rafe's and Nova's scenes use
     `ui_story_rafe.webp` and `ui_story_nova.webp` if painted, else their team banner.
  3. In the building view: draw each team member who has joined (`window.__qbTeam.list()`, ids above) in their own room
     (Mara the restaurant, Rafe at the end of Lock and Key's bar with a crowd round him, Nova filming in the mall, Theo the
     theater, Sable the Lair) with their signature look
     from `TEAM[id].look` and something that makes them stand out from the guests (a name tag, a glow ring, a signature prop).
     Better still, a signature cosmetic each, painted as items (Mara's chef whites exist already as `npc_chef`).
  4. The theater's basics as their own upgrades: a ticket stand and a popcorn and soda machine. Tell LEAD their ids, and Theo's
     scene will wait for exactly those (he is the employee).
- Progression (Cal, 2026-11-05, plan in `docs/PROGRESSION.md`). ROOMS's parts: (1) merge the Upstairs Bar (`skybar`) and the
  Speakeasy into one second-floor room above the restaurant, an upscale speakeasy with a live band and singers, starting
  really bare; keep every id saves already own (retire, never delete) and tell LEAD which room id survives; (2) chibi looks
  and portraits for the story characters: the partner chef, the speakeasy investor, the mall investor, the theater employee
  (original designs, portrait 300 x 400 like the coaches, file names `ui_story_<id>.webp`); (3) a produce stand in the
  Garden; (4) the theater's basics as their own upgrades: ticket stand, popcorn and soda machine, and an employee, which
  open the Auditorium free. LEAD writes the scenes, the gates and the money. Show Cal the characters side by side.
  Update (LEAD, aa0d9ed): Cal named the room **Lock and Key**. The scenes are in (`29b_story.js`) with stand-in initials; portraits
  as `ui_story_chef.webp` (Mara, chef), `ui_story_lockkey.webp` (Desmond Hale, investor), `ui_story_mall.webp` (Priya
  Okafor, investor), `ui_story_auditorium.webp` (Theo, theater crew), 300 x 400; the scene picks them up by name. When the
  merged room exists, tell LEAD its id; when the theater basics exist, tell LEAD their ids (Theo waits for any 3 upgrades now).
- Dungeon gifts and the Goblin King set (Cal, 2026-11-05: "Goblin King set"). Missions sometimes bring home a gift: coins, XP,
  a dungeon-only wearable, or one piece of The Goblin King's Regalia (helm, chestplate, greaves, boots, sword). The first piece
  opens a Trophy Room upgrade in the Hero's Lair; pieces fill an armor mannequin there; the full set gives the team a big
  boost. LEAD writes the gifts, loot, Relics and Trophies tabs and the bonuses; ROOMS paints and builds the room. Art, in this
  order, all original (a goblin king of our own, no franchise look):
  1. Five piece icons and a set emblem, 256 x 256, painted fantasy game style, on transparent: `ui_tr_goblin_helm.webp`,
     `_chest`, `_greaves`, `_boots`, `_sword`, `ui_tr_goblin_set.webp`. Shown in the gift reveal and the Trophies tab.
  2. The gift: `ui_gift.webp` (a closed dungeon loot chest or wrapped bundle, 256 x 256). The reveal opens it in code.
  3. The Trophy Room: a Lair upgrade (`lr_troph`, add it to the Lair's upgrades with `{trophy:1}`: LEAD's menu shows it as
     "Bring home your first trophy" until one exists, then sells it) and its picture: glass trophy cases and an armor
     mannequin, drawn empty, plus each piece as a layer on the mannequin, so it dresses piece by piece (read `S.trophy.goblin`,
     an object of piece ids that are owned). Show Cal the room and the full mannequin side by side first.
  4. One dungeon-only wearable: the Rift Mask, a mask from another dimension (one sheet, every angle, both bodies, item id
     `dg_riftmask`, slot mask). Never sold in the Shop; LEAD adds its line with a `dungeon` flag. Wear-test it.
- Yawn pilot, 3 tops (Cal, 2026-11-05: paint the yawn instead of bending flat art). The code is in (`src/rig.js`, the
  `stretch` pose has `"painted":"yawn"`). Template: serve `quest-board/` and open `rigtest/template.html?pose=stretch&scale=2`:
  the bare body in the peak of the yawn, man then woman, on flat green, each half exactly one frame (720 x 828). One
  sheet per cosmetic, painted over that template: the bare body (clean arms and armpits, the template's armpit shards are
  the rig's tearing), `y_vjkt`, `o_puffer` and `h_hoodie`. Cut each sheet back into its two halves, green removed, and save
  `<m|f>_<id>_yawn.webp` (and `<m|f>_base_yawn.webp`) in `art/app/` at 720 x 828; the build packs them. Nothing changes
  for any top without one. `rigtest/template.html?pose=stretch&check=<id>` is the alignment self-check. Show Cal the pilot
  side by side before it goes in; QA checks every outfit combination after.
- Three buildings (Cal, 2026-11-05, for phone lag and looks): "it was running every single animation all at once. This is
  not efficient or practical. We need to conserve resources where possible so that it runs efficiently and smoothly without
  sacrificing any performance or quality. I like the idea of being able to see the characters roaming around the rooms in
  the building view, but perhaps we can separate them into 3 separate buildings with their own unique names: The Loft for
  the apartment building, Kode Plaza for the restaurant building, Calibur Mall for the theater building. You would need to
  click into each building to see that building's rooms so that it only loads those buildings without having to upload
  every single asset of the other buildings. You could also use different background images when you go into each of
  these buildings and see the full room view. Then the main building street view (the outermost view) can have a separate
  building image that represents those sets of rooms." He sent three reference pictures (a pink and yellow mall front, an
  isometric apartment tower with roof gardens, a strip mall with red awnings): study only, the art must be original. So: a
  street view with one painted exterior per building and its name; tap a building to load only its rooms, people and
  animations; a painted background per building inside. Show Cal the exteriors side by side first. LEAD wants the street
  view to run nothing but the three exteriors, and nothing from a building to load until it is opened.
  LEAD's code is in (the commit after f57b1a0): the street, entering a building, the back button, placeholder fronts.
  ROOMS: save the fronts as `art/app/bld_loft.webp`, `bld_plaza.webp`, `bld_mall.webp` (a building front on a transparent
  background, about 2.4 tall to 1 wide, bottom edge on the pavement); the street draws them automatically. Inside
  backgrounds: not wired yet, tell LEAD the file names when painted.
  Split (Cal: LEAD codes, ROOMS paints, LEAD wires it in): ROOMS paints the three exteriors (each with room for its name)
  and one inside background per building, Cal approves them side by side. LEAD writes the street view and the
  load-one-building-at-a-time code. That code lives in `lfWorld`, `26_world.js` (ROOMS's file): ROOMS, write under
  Requests for LEAD whether LEAD may change it, or whether you would rather do that part.
- Lag: dragging the building or room view sets the transform on every pointermove (`lfApply`, `26_world.js`). Apply it at
  most once per frame (requestAnimationFrame). Measured by ROOMS headless; real phone numbers come with the next publish.

QA findings (QA adds one line each: what, where, how to see it, screenshot, owner; LEAD moves them into the right list):
- QA, 62c311d. Pictures in `rigtest/qa/shots/` (not committed), write-ups in `docs/QA.md`.
- LEAD (Cal, 2026-11-05): "make sure there are no discrepancies or rule breaking changes from mismatched versions that you all
  are working on. You should all be working on the same exact version." What QA sees now (4958885): one branch `main`, in
  sync with GitHub, live is `APPV` 47. Mismatches: (1) LEAD and ROOMS test builds of the shared folder (8766, 8765), which
  include each other's uncommitted edits, while QA and publishing use commits, so the same check can pass for one chat and
  fail for another; (2) long-lived uncommitted work (LEAD's six app files right now) that the other chats build on before
  it is committed; (3) leftover test copies from earlier sessions still registered as worktrees (`scratchpad/cur` at
  840749b, `scratchpad/prev` at fe4fe35); (4) `main` is ahead of the live page (progression not published yet). Ask: a
  version check in LEAD's routine, before each publish and at wrap-up: everyone committed and pushed, `git worktree list`
  only holds today's test copies, each chat's last test names the commit it ran on, and the live `APPV` matches TASKS.md;
  and a rule that work another chat builds on is committed first. QA tags every result with its commit. Owner: LEAD.
- FYI LEAD and ROOMS: QA added rule 13 to `TEAMWORK.md` at Cal's request (Waiting on each other: true Doing lines,
  `WAITING ON <chat>` lines, check for them between tasks). Right now both Doing lines are stale: LEAD's says nothing in
  progress with five app files uncommitted (`10_app_a.js`, `29_prices.js`, `29b_story.js`, `30_app_b.js`, `index.html`,
  new `29c_team.js`); ROOMS's still describes the Closet v2 that Cal approved and 93c95b6 committed.
- READ BEFORE THE NEXT ROOM ART (Cal, 2026-11-05: "a lessons learned so that the next pass on art generation can be better";
  walls swapped for cohesion, furniture "highly detailed, carefully placed, and have cohesiveness between the entire room"):
  `docs/QA.md`, Lessons for the next art pass: 12 rules, every room against isometric references, and the upgrades whose
  picture does not match their name. Owner: ROOMS, before generating any wall shell or furniture.
- Doors, Cal's rule (a back-left door comes out of the next room's front-right edge, back-right to front-left): 12 of 15 pairs
  break it; only Closet/Lair, Theater/Auditorium and Mall/Karaoke follow it. Table in `docs/QA.md`, Doors; recheck with
  `LOGIC=1 node rigtest/qa/doors.js`. Owner: ROOMS (`portal()` in `27_rooms.js`, already on ROOMS's list as Doors that make sense).
- Doors: every "up" arrow sits in the frame's top-left corner, but 7 of 9 doors up are on the back wall, top right (Bedroom to
  Patio, Restaurant to Upstairs, Bar to Roof, Boba to Dessert, Dessert to Speakeasy, Mall to Bowling, Arcade to Rhythm). Put
  each arrow on its own door's side. `rmArrows`, `26_world.js`; `shots/doors_windows.png`. Owner: ROOMS.
- Doors: furniture stands on 8 door glows, everything bought: Bedroom to Closet (wardrobe, dog bed), Restaurant to Upstairs
  (plant divider, table), Boba to Dessert (tea urns, fryer), Dessert to Boba (cupcake stand), Dessert to Speakeasy (macaron
  tower), Arcade to Rhythm (claw machines), Rhythm to Arcade (speaker tower), VR to Arcade (racing pod). `shots/doors_closeups.png`.
  Owner: ROOMS.
- Doors: the Mall opens straight into Karaoke two floors up, over Bowling (`ROOMCELL`). Small. Owner: ROOMS, Cal to say.
- Bedroom (Cal, 2026-11-05): the wardrobe stands where the Closet entrance belongs; Cal asked ROOMS to make it the figurine
  shelf (on ROOMS's list). Owner: ROOMS.
- Bedroom (Cal): Anime Poster is not obvious: three small random pictures, too close to the right end of the wall. He wants
  something apparent, and anime art on an anime poster, not scribbles. `shots/up_bedroom.png`, tier 19. Owner: ROOMS.
- Bedroom: Canvas Art (200) and Figurine Shelf (200) are never drawn once Floor-to-Ceiling Glass is owned (`&&!w3`,
  `20_loft.js` ~3210), and the menu sells the glass first, so both are paid for and invisible: 0 px change. Tiers 17 and 21
  in `shots/up_bedroom.png`. Owner: ROOMS.
- Street view (51a9506, checked on 59eeaf7 at 390 x 844): works. The street runs 2 animations and no room images; The Loft
  loads 5 rooms (35 animations), Kode Plaza 7 (99), Calibur Mall 9 (375); Street drops back to 2. Saves, every tab: pass.
  Wrong: Calibur Mall opens with its end rooms cut off left and right (Theater and Club half off screen), The Loft and Kode
  Plaza fit. `shots/inside_calibur_mall_390.png`. Owner: LEAD. DONE in 861bee1 (all three fit at 390 px).
- Street view: the hint at the bottom still says "tap a room" on the street (should be "tap a building"), and it is pale
  grey on pale grey, hard to read. `shots/street_390.png`. Owner: LEAD. DONE in 861bee1.

Requests for LEAD (from ROOMS):
- Trophy Room (Cal, 2026-11-05): "trophy wall should be removed and turned into a trophy room but only after a team member
  brings back the first trophy from the dungeon raid. we can add the trophy room above the lair." The dungeon has no trophy
  yet (`28_missions.js`). Please add: raids can bring back a trophy, the first one is announced, and a global
  `qbRaidTrophies()` returns how many have come back (0 before the first). ROOMS shows the Lair's "Open the Trophy Room"
  upgrade only when it is 1 or more, and builds the room, its door and its art.
- TAKEN by LEAD, done in 861bee1. Yawn pilot painted, sent to Cal as approval 4 (`art/raw/yawn/yawn_pilot.png`, git-ignored; layers in
  `art/raw/yawn/layers/`, 720x828, frame-sized; the cutter is `tools/yawn_cut.py`). Not in `art/app` until Cal approves.
  One change needed in `src/rig.js` (yours): a painted BODY layer is drawn in the body mesh's last group, so it covers the
  face, hair, trousers and shoes. Drawn in its FIRST group it works (tested in a scratch copy, that is what the sheet shows).
  The line, in `render`: `const lastGroup = slots.map((x, i) => { let g = -1; if (flats[i]) for (const gg of
  rig.drawSequence[view]) if ((x.s.id !== "body" || g < 0) && [meshes[i].groups[gg], ...].some(...)) g = gg; return g; });`
  i.e. only the condition gains `(x.s.id !== "body" || g < 0) &&`. Known small issue for ROOMS to fix before it goes in: a
  faint double outline along the legs and at the hair edge, where the painted body sits a pixel off the mesh drawn over it.
- FYI: ROOMS added one rule to `TEAMWORK.md` (under "Every day after that") at Cal's request: whichever chat gets a request
  does its own parts and writes the rest as tasks for the owning chat; every chat re-reads `TASKS.md` between tasks.
- Three buildings: yes, LEAD may write the street view and the load-one-building code in `lfWorld` (`26_world.js`). Tell
  ROOMS before you start, so ROOMS stays out of that function while you are in it. ROOMS paints the exteriors and insides.
- TAKEN by LEAD (in To do). Shop banners, Cal's words on approving the art (2026-11-05): "Love the art. The Title text could be more stylized and
  unique instead of plain white text or a shadow. Make them all unique. i want the description for the brands to be more
  playful rather than descriptive. I like 'Trail gear that never sees a trail'. That is funny and i like it. Also remove
  the 'NEXT DROP: etc' text. make this a separate countdown on the main shop tab that is small and unobtrusive." All in
  `15_shop.js`. If a painted wordmark per brand would help the titles, add it under Art requests.
- TAKEN by LEAD, done in 9c3bd78. SAVES, URGENT. In Chrome on v44 the header reads `this device only (Cannot assign to read only property 'creativity' of
  object '#')`, so that browser is not saving online. The boot `try` in `30_app_b.js` catches it and sets `db=null`. Likely:
  `merge(sd0)` changes the frozen object `snap.data()` returns; not tested. `worlds/<id>` last updated at appv 34, which
  suggests this has been failing since about then, and it explains why the `diag/frame` log landed nothing. The phone's header
  has not been checked. **Before fixing: the cloud save is probably older than each device's local save, so the fix must not
  let it overwrite newer progress.** Ask Cal which device's save wins.
- TAKEN by LEAD (in To do). Lag, measured headless with every room owned, not on a phone: about 540 running CSS animations in the building view, and
  they keep running behind an open room window (`lfbreath` 146, `rhl` 114, `scrB` 81, `prtG` 30 with an SVG blur), 144
  filters, 76 blend modes, about 15,000 SVG nodes, 783 images, 97 MB JS heap. Dragging sets the transform on every
  pointermove. No fix written. Fixes in room code are ROOMS's: put what you want under Art requests or here.

---

## ROOMS: all art, the art tools, the room code

Doing:
- Finishing the Loft (Cal, 2026-11-05: "Bedroom, patio, closet, and lair should be in good working condition", then QA
  checks every Loft asset across every upgrade; the Trophy Room waits). Order: Bedroom painted walls with colour options,
  figurine cabinet and the Closet door, Canvas Art and Figurine Shelf bug, then the Patio (turf, light tower, Chopstick's
  bed, walking through the door, dogs), then the Lair. Claims Chrome for the art.

To do:
- [x] Closet stages and the Lair stage are in (see Ready to publish). Closet stages: Cal APPROVED the second version 2026-11-05 ("This looks good"), Start to Super Sleek Modern, files
      `art/raw/walls/closet/st_dark, st_lit2, st_shoe2, st_jewel2, st_island2, room_jewel2, st_modern2`. Put them in
      (`clPaint` stages, sizes in `data/rsart.json`, drop the `clx_jewel` sprite and the LED overlay). The Lair stage waits
      on Cal's answer about doors vs the building layout (asked 2026-11-05): ROOMS recommends keeping the building as is
      and moving the sliding cabinet to the back corner of the LEFT wall, since the Lair sits left of the Closet.
      Earlier notes on approval 3: (1) the LED wardrobe strips from
      Wardrobe Lights on every later stage (Shoe & Bag Wall through Super Sleek Modern); (2) remove the eight round light
      pools on the floor in Wardrobe Lights; (3) a new last step, the Hero's Lair (`cl_lair`, id kept): the cabinet in the
      far corner (top of the picture) slides open, animated, to reveal a hidden entrance that leads to the Lair. Paintings in
      `art/raw/walls/closet/`.
- [ ] Doors that make sense (Cal, 2026-11-05): "make sure that the entrances from each room to the other room make sense."
      Bedroom: the Closet entrance goes where the wardrobe upgrade stands (left wall, front part). The wardrobe upgrade
      becomes a wall-mounted figurine cabinet that never covers that door (keep the ids `bd_ward1`, `bd_ward2`). Closet: you
      enter from the bottom-right edge, since in the Bedroom you leave by the upper left. "Take this logic and apply it to
      every room going forward so it mimics proper room traversal": a door on one room's back-left wall comes out of the
      next room's front-right edge, back-right to front-left, and the other way round, at matching positions. Check every
      `portal(...)` pair in `27_rooms.js`.
      Measured 2026-11-05 (every upgrade owned, a glow is 1.5 tiles along its side): the rule's side is clear of furniture
      for most pairs, but no clear spot exists on the Bedroom left wall (wardrobe, until it becomes the figurine cabinet), the
      Bedroom back-right wall at the Patio door, the Boba, Dessert and Mall back-right walls (way up), the Arcade back-right
      wall (Rhythm) and the Arcade left wall (Mall): those rooms need pieces moved before their doors can go there. Also from
      QA: put each way-up arrow on its own door's side (`rmArrows`), and nothing standing on a door glow.
- [ ] Bedroom walls (Cal approved the four tiers, 2026-11-05: "this is great!"). Before they go in, from his answer: (1) keep
      the wall colour options, the Loft should be the most customizable: a painted version of each tier per colour scheme;
      (2) the patio: buying it must put a patio door in the Bedroom, and the view through the glass must show the patio
      furniture he owns in the Patio room (the old Bedroom patio view looked great): DONE in 17ab80d. Tiers are in
      `art/raw/walls/bedroom/`; the preview loader is `scratchpad`-only for now, the real one goes in `26_world.js`.
- [ ] Trophy Room (Cal, 2026-11-05): a new room above the Lair (`ROOMCELL` `[0,1,2]`, free), opened by a new door on the
      Lair's upper (back-right) wall, entered from the Trophy Room's front-left edge. Offered in the Lair only after a crew
      member brings back the first raid trophy (LEAD adds `qbRaidTrophies()`, requested). The Lair's Trophy Wall (`lr_trophy`)
      is retired when the room ships (id kept, hidden, drawn nowhere). Art for Cal's approval first: the Lair's new door
      (closed, then open), the Trophy Room walls in tiers, and trophy displays that fill as raids bring more back.
- [ ] Patio (Cal, 2026-11-05): (1) replace the fairy-light tower on the left (`pt_lights`, `hmx_strings`) with something
      else, keep the id; (2) the Artificial Grass reads as a green square tile: paint real, comfy, plush artificial turf;
      (3) a second patio dog bed, for Chopstick; (4) the character and the dogs walk in and out between the Bedroom and the
      Patio through the new door; (5) once the dogs are bought, see them run around and interact with the room. Cal sent
      photos for the dog art (study only): Pluto is a beige, curly toy poodle; Chopstick is a black-and-tan
      chihuahua-dachshund mix with long feathered ears. Art for Cal's approval first.
- [x] Yawn pilot: Cal approved, in `art/app` (b506b8c), see Ready to publish. Next, ask Cal: roll it out to every top?
- [ ] (LEAD's request) Lag: drag applies the transform at most once per frame.
- [ ] (LEAD's request) Three buildings: paint the exteriors and inside backgrounds, side by side for Cal.
- [ ] Regenerate `o_lock`, `al_carab`, `v_shade`, `v_corset` cleanly (their baked-in mannequin was cut out by hand).
- [ ] New outfits as Cal asks: one sheet per cosmetic, every angle; test every combination and pose before calling
      it ready.
- [ ] UI pictures redrawn in the game's style (`ui_*`: classes, coaches, crew, ranks, rewards). List in HANDOFF, Art.
- [ ] Black Tulle Skirt (`v_tulle`): HANDOFF used to say it was held back, but it has all its files and is on sale. Nobody
      has looked at how it renders. Wear-test it on the body it fits, in every pose.
- [ ] This clone's Python has no `PIL`, `numpy` or `scipy`, and the art tools need them (`rs_art.py`, `pack.py` and so on).
      Set them up before the first ingest.
- [ ] MAIN JOB. Painted walls for every room: wall-and-floor art in upgrade tiers, same camera every tier, matching the
      room's size (list in HANDOFF), our furniture sprites on top. Built-in upgrades become part of the wall art (Club tier
      1 suede walls, then the bar upgrade adds a glowing hanging liquor cabinet). No two rooms share a final. Bedroom first,
      then up through the building order. For each room: generate, show Cal the tiers side by side, build the loader and put
      them in only after he approves.
- [ ] Generic stage loader for wall shells (like `clPaint` in `27_rooms.js`), fitted to each room, green removed. After
      Cal approves the first set.
- [ ] Closet (Cal, on v43): Wardrobe Lights and Super Sleek Modern look like nothing changed. Make each one obvious.
- [ ] Closet (Cal, on v43): Jewelry Tower stops being the `clx_jewel` sprite. Another part of the closet opens up and shows
      jewelry, just like the shoe and bag wall. Art for his approval.
- [ ] Every upgrade in every room clearly visible (Cal, on v43). MEASURED 2026-11-05 (all 21 rooms, 397 upgrades, each bought
      alone in unlock order; report, numbers and before/after sheets in `art/raw/audit/`, git-ignored): 318 OK, 33 WEAK,
      9 NONE, 35 not visual by design (staff, menus, money caps, pets, expansions). Fix, worst first:
      - Bugs, bought but never drawn: Bedroom Canvas Art and Figurine Shelf vanish once Floor-to-Ceiling Glass is owned
        (`!w3` in `20_loft.js`), and the shop sells them after it; Restaurant Walnut Dividers, Drinks Cooler and Dish Station
        only draw after expansions they are sold before; Garden More Plots adds no bed until Buy the Empty Lot; Theater Film
        Reel Wall Art sits behind the movie poster; Arcade Neon Trim is only a glow (nothing by day).
      - Can never be bought (their prerequisite left the room's list): Restaurant Chef's Neon; Game Room Couch & Console, Pool
        Table, Snack Bar; Garden Scarecrow, Berry Patch, Beehive; Theater Cocktail Bar and the three that need it.
      - WEAK, needs a bigger change or new art: 10 in the Restaurant (Star Plaque, Grand French Range, Brass Chandeliers by
        day, Black Marble Counter, Sculptural Vases, Espresso Bar, Charcoal Grill Station, Patio Heaters, Host Desk, Brass
        Sconces), 4 in the Auditorium (Aisle Lights, Digital Projector, Surround Sound; Bigger and IMAX Screen grow the room
        but the view shrinks to fit), Bedroom Neon Sign and Racing Chair, Game Room RGB Floor Lamp, Sky Bar Champagne Trolley
        (behind the piano), Club Laser Rig and Smoke Machine. Closet Wardrobe Lights and Super Sleek Modern: new art done.
      Not measured: expansions (their doors), people, pets and animation.
- [ ] Game Room art: back-to-back gaming rigs at the front with the racing chairs facing them, a cream three-piece
      sectional with a futon piece, then an 80 inch TV and a floating modern media console as later upgrades.
- [ ] Club (optional): back-view booth art if Cal wants booths along the bottom edge too.
- [ ] Speakeasy: `depth.js` flags the piano drawn over the stage; look at it.

---

## QA: tests, pilots, quality checks

Doing:
- Economy simulator (LEAD's request, blocks the next publish), against the latest commit on 8769. Then rerun `menu.js`:
  d5fba8f changed the upgrade menu (4 shown, no level locks), so QA's earlier menu pass is out of date.

To do:
- [x] Set up: a clean worktree of the latest commit in a temp folder, build it, serve it on 8769. Learn the scripts in
      `rigtest/browser/` (README) and write your own in `rigtest/qa/`. Start `docs/QA.md` with a run log. `rigtest/qa/setup.sh`.
- [x] Lessons for the next art pass (Cal, 2026-11-05): "keep in mind that a lot of these assets will change. This sweep you are
      doing is more of a lessons learned so that the next pass on art generation can be better." Compare every room with
      isometric game-art references of its kind and write down what is awkwardly placed, so ROOMS generates it better. "We
      will be swapping out all the walls on the rooms so it looks cohesive. And all the furniture going forward should be
      highly detailed, carefully placed, and have cohesiveness between the entire room." In `docs/QA.md`, Lessons for the
      next art pass: 12 rules, all 21 rooms, and which upgrades do not look like their names. Owner of the lessons: ROOMS.
- [x] Upgrade sweep, every room: buy each upgrade one at a time in unlock order (the method in `docs/RELEASING.md`, Testing
      upgrade tiers), screenshot each step, and flag anything stacking, overlapping, floating, facing the wrong way or not
      visibly changing the room (Cal: "every upgrade clearly visible, even a poster or a clock"). Run `gaps.js`, `depth.js` and
      `stations.js` at every tier, not only fully upgraded.
- [x] Shop sweep: buy and equip every item on both bodies, check the mirror, the wardrobe and the room character, and flag
      anything stacking unnaturally or clipping. Done on 59eeaf7 (`rigtest/qa/shop.js`): 112 pieces on the man, 115 on the
      woman, each bought, worn, listed, removed and in the Wardrobe, plus each brand's outfit: all pass, no clipping seen at
      mirror size. The room character was not checked (next pass).
- [ ] Speed sweep at phone size (390 x 844, 4x CPU slowdown): time every tab, the building view and every room (`perf.js` as a
      start: frame rate, long tasks, load time). List the slowest ten with what makes them slow. LEAD has the real phone's
      numbers in `diag/perf` after Cal plays v45; compare against them when LEAD posts them.
- [ ] After every commit by anyone: `savecheck.js`, `screens.js` and a quick look at what that commit touched. After every
      publish: the same against the published build. Post only what fails.
- [x] References: for each room, look up isometric game art of that kind of room (built-in browser, never Chrome) and
      compare layout, detail, lighting and how alive it feels. Write art ideas for ROOMS with the link and what to learn.
      Study only, never copy.
- [x] (from LEAD) Room upgrade menu, new in the commit after v45: only the next 5 unbought upgrades show, and anything two or
      more levels above the player is a "? ? ?" card. Check every room at a few levels (just below, at and above each
      unlock), that buying from the menu still works, and that no room says "All upgrades installed" too early.
      Done on 59eeaf7 (`rigtest/qa/menu.js`: a player with endless coins goes from level 1 to 80 and buys whatever every
      room's menu offers, 7,300 cards looked at): passes. Never more than 5 cards, "? ? ?" only 2+ levels up, one level up
      named with "Reach level", Buy always works, no early "All upgrades installed". 11 upgrades are never offered at any
      level, the same 11 ROOMS listed (Game Room 3, Restaurant Chef's Neon, Garden 3, Theater Cocktail Bar and 3).
- [ ] (from LEAD) Dungeon gifts: simulate the drop odds once LEAD's code is in.
- [ ] (from LEAD) Economy simulator, before the next publish: the new XP curve, no level locks, prices x ROOMSTEP (commit after
      d6730f0, `docs/PROGRESSION.md`, `docs/ECONOMY.md`). Simulate 30, 90 and 180 days at 200 and 450 XP a day with missions, the
      wheel, level pay and passive income, buying the cheapest next upgrade whenever affordable. Report: level reached, days to
      fill each room, coins piling up unspent. Cal's targets: level 10 in 3 or 4 days, something to buy every day or two, no
      upgrade a week away.
- [ ] (from LEAD) Story scenes (aa0d9ed, `29b_story.js`, test hook `window.__qbStory`): walk a new save from level 1 to the club, every
      scene, "Not yet" and back, lots on the street in order, nothing opening early, and old saves at every stage (no scenes for
      rooms already owned). Add the gates to the economy simulator: how many days each step takes.
- [ ] (from LEAD) Upgrade income (d523cf1): list every business upgrade marked "Looks only" and flag any that should earn (it sells,
      serves or seats something) or any decor still earning; `upIsDecor` in `29_prices.js`, override per upgrade with
      `{decor:1}` or `{earn:1}`. Team: each buff applies (room income, mission pay), the join banner, missions led by the team.
- [ ] Yawn pilot, when ROOMS's art and LEAD's code are in: every top and outfit combination, both bodies, every pose,
      saved as one labeled sheet for Cal.

## Done (latest first, keep about ten)

- 2026-11-05 New roles: LEAD (board, app code, publishing) and ROOMS (all art, room code). See `TEAMWORK.md`.
- 2026-11-05 The Loft fills the phone screen: Cal confirmed on his phone (v43).
- 2026-11-05 Phone picks up new versions: Cal saw v42 in the header on his phone.
- 2026-11-05 Club: every booth on the left wall, bar on the back wall, neon sign the right way (v41).
- 2026-11-05 File fingerprints so phones fetch new versions; Loft height fix; header shows `APPV` (v40, v41).
- 2026-11-05 Prove it: camera only, pays double. Shop brand banners, procedural stand-in (v40).
- 2026-11-05 Closet grows in stages of one room (v40).
- 2026-11-05 Lair: one war table in the middle, floor pieces spread out (v40).
- 2026-11-05 Game Room laid out by what each piece faces (v39).
