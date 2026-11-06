# Task board

The one list both chats share (see `TEAMWORK.md` at the top of the repo). LEAD keeps it tidy. Re-read it right
before editing; edit only your own section, except to add a request for another chat.
Details for every item are in `docs/HANDOFF.md`.

CHROME: free

Live on the phone: `APPV` 47 (friends' page, nobody plays it); Cal's pinned test copy: v0.58 (859d941), 2026-11-06, the only one pinned. LEAD keeps only the newest version pinned.

---

## LEAD: board, quality of life, Shop and Training code, everything else in the app, publishing

Doing:
- Now: ROOMS's 6f04ed8 (Game Room: hex panels, foosball, ping-pong); v0.61 blocked (the Garden lot, 685cbd0). Next: the rebuilt
  version. (on e74693c)

To do:
- [x] Shop text in Bebas Neue Light (titles stay), the Shop banner a real rectangle on a phone, next drop as its own line
      (47f3af4). Goes live in the next publish.
- [x] Story reasons, investors on earnings, equipment earns and decor does not, a team of five, class art by body (d523cf1).
      Not published (QA's economy simulation first).
- [x] Bounties (Cal's request 5), c243433, `29f_bounty.js`: today's bounty and a 3-day bounty on the board, chores
      people put off; Take it adds a quest paying 1.5x (3-day 2x) that leaves when its window ends; Another swaps it up to
      three times a day (Claude suggests one not already on the list, else the next of 40). Tested headless.
- [x] Town hall and town meter (Cal's requests 1 and 4), 62c0c47, `29g_town.js`: the Neighbors panel at the top of the
      Hall tab, posts with the poster's look, a weekly meter of everyone's XP and coins (never tasks). Not testable
      headless: posting, other players and the meter with real data need the cloud save (QA's 15-player test after v48).
- [x] Level trials accept any active photo (Cal, 2026-11-05), 62306c1: a run, a dog walk, a hike, a sport, a class or a
      home workout passes, not only a gym. Trial card text checked headless; the photo judgement needs Claude on the live
      page, so it is checked after v48 goes out.
- [x] Economy fix from QA's simulator, 5082b0c: businesses pay out each day at most 200 plus 1.5x the day's quest coins
      (the rest waits in the room, `29e_economy.js`, shown in each room's window); missions pay coins (+1% a level) and 30%
      of their XP, flat; each level costs twice as much, capped at 1200 (level 10 on day 4 at 420 real XP a day). Old
      saves keep their level. Tested headless (payout limit, saves, story, dungeon). Neighbors text says Contributor.
      Open for Cal: level trials need a gym photo (a friend who never works out stops at level 4), and nothing to buy
      after the last room.
- [x] Writing pass, part 1 (Cal: "professional and not corny or too obvious that it is AI"), cf7b36a. `docs/VOICE.md` is
      the guide every chat writes to. Rewritten: about 90 lines across upgrades, delve logs, visitor events, story
      dialogue and the coaches. Left as they were: Cal's own quest and reward lines, shop item lines (already plain), and
      the hype and anime coaches' shouting (they are personas the player picks; only the worst clichés went).
- [x] Dungeon gifts, Relics and Trophies (Cal: gifts, relics, the Goblin King set and an amulet set), 9b4cf3a, `29d_dungeon.js`.
      A claimed mission rolls a gift (30 to 55% by mission): coins, XP, or a piece from that mission's loot, forced after
      five dry gifts. The Goblin King's Regalia (m1, m2, m4: mission pay, XP, time, gift odds) and the Hollow Amulet (m3, m5:
      quest coins; set: quest XP and business income). Trophies is now Relics: six tiered relics hidden until earned (150 coins
      a tier), old badges as Milestones, and a Trophies sub-tab after the first piece, shown once the Lair's Trophy Wall
      (`lr_trophy`, a mystery card until the first piece) is built. Tested headless (15 checks). Art falls back to drawn icons.
      The crew fix is the team (29c_team.js). Not published.
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
      2026-11-06: the v0.50 and v0.51 logs hold only the Mac app's preview from publishing (120 fps, Electron); no phone
      has opened either yet. Nothing to fix until Cal opens v0.51 on his phone.
      REAL NUMBERS, 2026-11-06 11:58, Cal's iPhone (iOS 18.7, Claude app, 440x956, dpr 3, 4 cores) on v0.53, the Loft with a
      room window open: 54.6 fps then 40.8 fps over 5 s, worst frames 324 and 345 ms, 6 and 23 frames over 50 ms, 61 then 33
      animations running, about 6,600 elements. Real lag in room windows. Found and fixed in b46bc16: the level effect fx-pulse animated every card's
      box-shadow, so the browser re-drew everything inside a card every frame, a whole room window included (trace: 2.65 s of
      every 3 s in raster, 35 ms in everything else). The glow is now a separate layer that only fades (`app/index.html`).
      `shots/roomcure2.js` (440x840, dpr 3, CPU x4, every room and upgrade, the Bedroom window): 4-6 fps before, 35-46 after;
      the Loft alone 60. What is left is the room's own SVG animations (screens, ticker, portal): stepping them gave 59 fps
      but changes how they look, so it waits for Cal's phone numbers on v0.55.
      Cal's iPhone on v0.58 (2026-11-06 17:35): first load ready 1.4 s, second 0.25 s (15 files from cache); Board, Shop,
      Training, Dungeons 59-60 fps; most room windows 47-59; one window 18 fps, worst 433 ms, 6,263 elements, 35 animations.
      LEAD: the fully bought Bedroom is the heavy one (2,928 elements, the game screen's 20 twinkles, scrolls, jump, portal
      glows); every other room 59-60 at CPU x4. Fixed in 0dfa204: the screens tick in steps (index.html) and the twinkles share
      four beats (24_screens.js): the Bedroom 35-46 fps at CPU x4 before, 60 after its first draw (`shots/starcure.js`,
      `shots/roomsall.js`). diag/perf now names the open room.
- [x] `dropbox-leftovers` reviewed (nothing worth bringing over) and deleted with Cal's OK.
- [x] Yawn pilot, code (rig.js flat painted layers, `rigtest/template.html`). Without painted art the stretch renders
      byte for byte as before. Self-check feeding a top's own render back in: about 0.7% of pixels differ on the man (edges),
      2 to 5% on the woman (her long hair over the sleeves: a flat picture sits over or under all of it). Waiting on ROOMS.
- [x] Stretch pose: the gentler yawn (Cal's pick), 0959719. Dark long sleeves still look torn at the elbow, as before.
- [x] `lfvar.json`: a copy is in git at `app/lfvar.json` (0959719). `build.py` does not use it.
- [x] Town database rules (code in ab6a66e, rules declared at the next publish from `app/dbcaps.json`). Was: apply with the v48 publish (live page has none: any Contributor can overwrite any shared row).
      Saves are already private (`data/users/<id>/state`). Declare with the page's db capability:
      `{path:"worlds",read:"view",write:"owner"},{path:"worlds/{self}",read:"view",write:"interact"}` (ids are the player's
      `user.id()`). Board posts and visit pings use `<uid>_<time>` ids, which `{self}` cannot match: move them to
      `board/<uid>/posts/<time>` and `pings/<uid>/sent/<id>` first, then the same two rules for each. Test with two accounts
      (one Contributor, one Viewer) before inviting anyone: QA's 15-player test.
- [ ] Later (Cal, 2026-11-05, "for a much later build"): the level 90 to 100 artifact (ten stone pieces, one a level) and the
      portal to a prestige world (level 1 with a star, a new Loft, currency, characters and story). Full plan in
      `docs/PRESTIGE.md`. Not before the first world feels right.
- [ ] Before release: set `QB_TEST_START` to 0 (29_prices.js; new players start at level 1 again) and drop `S.testFree`; remove the Test panel, the Shop's Testing row, each room window's Testing undo link, and the
      `window.__qb` / `window.__qbLoft` hooks. Also the phone log (`qbFrame` in `26_world.js`) and the `diag/frame` doc,
      sooner if the Loft height is sorted first.

Ready to publish (ROOMS adds lines here: `READY TO PUBLISH: <what>, look at: <what to check on the phone>`):
- READY TO PUBLISH (Cal, 2026-11-06: "Yes, paint all 28"; QA passed it in a8c2a1f and 9b31ed0): the yawn painted for every
  top, 503cd3f (the other 28 shop tops) and 6541dd3 (the starter tee, hoodie and bomber, the man's bare body clean at the
  waist). Look at: the stretch on a phone in a jacket, a tee and a starter hoodie; nothing should tear at the shoulders.
- READY TO PUBLISH (Cal, 2026-11-06: "approve all"; QA passed it in 2d51cc2): the team's signature tops (097dccd), each
  member wearing theirs in their home room. Look at: Rafe in Lock and Key, Theo in the Theater, Nova in the Mall, Sable in the Lair.
- READY TO PUBLISH (Cal, 2026-11-05: "approve all"): every ROOMS approval from 6 to 37 (16 and 7 were already approved).
  6 Bedroom cabinet and anime poster (bd895a7); 8 Daily Quest art (8caf214, wired a60b175); 9 Game Room walls (a4e2a4a);
  10 Game Room furniture (9c30788); 11 building fronts and backdrops (45930bc; LEAD wires the backdrops); 12 story portraits
  (625d9e3); 13 team banners (4fc1542); 14 class banners (6b7b9c8); 15 dungeon icons (d48ed81); 17 to 19 Restaurant walls
  (1eb8040, 156683a, 04bb241); 20 Garden lots and Game Room desk (5fa3fec, d30bb93); 21 corner booth and fire pit (f457680,
  eb85e90); 22 Noir furniture and the calmer city (d1d7c73, 0b23996); 23 Boba (c223d89); 24 Dessert Parlor (f0c6dbb);
  25 Lock and Key (4599993, 707cac1 and fixes); 26 Friday Band (fe48618); 27 Rooftop (707cac1, 5ddeb1a, ea2dffc, d95d880,
  c8eb716); 28 Mall (322760a, 0eb00c2, c829e7e); 29 Theater lobby and 30 Auditorium (4a7c0ff, 9279c58, 392ca5c, 5e3a780);
  31 Arcade (cb5f568, b3832fb); 32 Rhythm Room and 33 VR Arena (e2d53e1, 5a33727, 934bb37); 34 Bowling (922bcb7, 934bb37);
  35 Karaoke (db8a46d, 6962a6e); 36 Nightclub (fd0da20, 1eb0bbc, e74cf92); 37 the team in their rooms (abb6513); plus the
  doors (3962ee2) and the writing pass (e74cf92, a646e51). Look at, on the phone: each building's rooms fully bought, the doors
  walk both ways, the open-air sky at noon and night, the team members' name tags. QA has passed every one of these.
- READY TO PUBLISH: the Trophy Room (Cal approved approval 16, 2026-11-05), 9be3f51. A painted hall above the Hero's Lair
  (room id `trophy`); the Lair sells "Stairs to the Trophy Room" once the first piece is home (a mystery card before);
  the Trophy Wall is retired (owners keep it). The Goblin King's Regalia stands on a mannequin on the rug and dresses
  piece by piece, in any order. Look at: the Lair menu before and after a first piece, the stairs arrows both ways, the
  mannequin with a few different pieces. Checked headless: all 32 piece combinations, both doors, the building view, no
  errors. Not checked: on a phone. Known: no painted doorway in the Lair yet (its back wall is the suit cases).
- READY TO PUBLISH: seven upgrades buyable again and the Game Room door, ab9dc81. Game Room Pool Table, Couch & Console,
  Snack Bar, Restaurant Chef's Neon, Garden Scarecrow and Berry Patch, the Theater bar (and the three after it) waited on
  upgrades no room sells any more; those prerequisites are dropped. The Game Room's door to the Bedroom is a lit doorway at
  the front of its left wall (Cal's rule). Look at: those upgrades in their rooms' menus; the Game Room door. Checked
  headless: the seven are freed, the Game Room renders with its door, no errors.
- READY TO PUBLISH: Bedroom music, clocks and wall tidy (Cal approved approval 7, 2026-11-05), 8c2c459 and 65cf7fd.
  Pocket Radio, then Bluetooth Speaker, then Bluetooth Record Player (`bd_radio`, `bd_spk`, `bd_vinyl`, in order), between
  the bookshelf and the mirror; Digital Clock (`bd_clock2`, after the Wall Clock) over the Closet door; both clocks show
  the real time, live; no RGB strip (LED Strips & Grass Panels is the Moss Art Panel); Canvas Art and the Figurine Shelf
  retired from sale (no place once the glass wall is in; owners keep them without it); the Neon Sign now waits for the
  Gallery Prints; you and the dogs show in the Patio window too. Look at: the Bedroom on a phone, buying the three music
  steps, the clocks against your phone's time. Checked headless: each music step, both clocks on plain and grass walls,
  the Patio window with you and the dogs, no errors. Not checked: on a phone.
- READY TO PUBLISH: walking out onto the Patio, and people back in the Bedroom window, 63ac9f3. BUG FIX first: since
  v46, once a Patio existed, opening the Bedroom window showed no people (you and the dogs vanished). Now, seen from the
  Bedroom, you and both dogs sometimes walk out through the sliding door, stand among the Patio's real furniture, and
  the dogs lie on their own Patio beds. Look at: the Bedroom window with a Patio and the dogs, on a phone, for a few
  minutes. Checked headless: the walk out (you and both dogs), every earlier Bedroom, Patio and Closet check, no errors.
  Not checked: on a phone; you and the dogs do not show in the Patio's own window yet.
- READY TO PUBLISH: Bedroom painted walls (Cal approved 2026-11-05 with his changes), f4362b1, b92a6dd, 050c10e. Three new
  Bedroom upgrades, Fresh Paint & Oak Floors, Living Grass Wall, Cove Lighting (`bd_wt2..4`, in order; tier 1 is the
  bare start), each painted in all four Room styles (Neutral Loft, Brick Studio, Warm Oak, Neon Noir; brick, blush and
  slats run along the left wall to its front end). The Closet door is a lit doorway in the left wall where the wardrobe
  stood; Canvas Art and the Figurine Shelf show with the glass wall; the patio door rests half open and slides fully
  open when you walk up; the top-right door arrow sits under the zoom buttons. Look at: the Bedroom on a phone, each
  wall tier in each style, the Closet door, the patio door. Checked headless: all 16 tier and style pairs with Cal's
  furniture, the door with and without glass, no errors. Not checked: on a phone, walking through the patio door. The
  Sleek Wardrobe's figurine cabinet has no art yet (draws nothing). Existing saves start on tier 1 walls.
- READY TO PUBLISH: Patio (Cal, 2026-11-05), ef2ab15. Plush painted turf for Artificial Grass, String Lights strung
  overhead from three posts (no more light tower), a Second Patio Dog Bed for Chopstick (`pt_dbed2`), the Bedroom door
  on the Patio's front-left edge with a sill and mat (Cal's door rule). Look at: the Patio on a phone with everything
  bought, and the Bedroom's glass (buy something in the Patio, it shows there straight away). Checked headless: the
  room fully furnished, a live buy showing through the Bedroom glass, no errors. Not checked: on a phone.
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

- DONE by LEAD in a2e234e (`window.gdWatered()`, `data-act="gdwater"`, `S.base.gwater`, `ECON.waterH` 24, Sprinklers `g_spr`). REQUEST for LEAD (from ROOMS, Cal 2026-11-05 on the Garden): "I want an option that requires us to water our plants. And
  then a sprinkler system upgrade gets added later on to automate it." Proposed split (rule: the chat that gets a request does
  its part and writes the rest for the owner):
  LEAD: the rule and the button. A watered state (e.g. `S.base.gwater`, last watering time); the Garden grows only while
  watered (say for the rest of that day), produce stops otherwise; a "Water the plants" button in the Garden window; the
  existing Sprinklers upgrade (`g_spr`, 22_garden.js) waters automatically from then on (maybe move it earlier in the
  Garden's list). Please expose `window.gdWatered()` (true/false) and handle `data-act="gdwater"` anywhere on the page, like
  stysell.
  ROOMS: the look. Dry beds look dry and watered beds look damp; tapping the watering can in the lot waters (data-act
  gdwater); someone waters the beds now and then; sprinklers mist once bought (that part exists). ROOMS waits on the name of
  the state and the act before wiring the look.
- DONE by QA (QA findings: pass). WAITING ON QA: wear-test the team's signature tops at 097dccd: `matrixshot.js "sheet=wear&arts=tm_rafe_jacket"` and the same for
  `tm_theo_tee`, `tm_nova_knit`, `tm_sable_jacket` (both bodies, every pose), plus `sheet=neck` and `sheet=waist` with them;
  and live: with the team joined, each wears theirs in their home room (`livebuilding.js TEAM=`). The mannequin lines were
  stripped (Rafe and Theo with strip_mannequin.py --garment, Nova and Sable with an alpha-only opening to keep the lavender).
- DONE by QA (QA findings: pass). WAITING ON QA: wear-test the Rift Mask (`dg_riftmask`, d4eefc3): `rigtest/matrix.html?sheet=wear&arts=dg_riftmask` (both
  bodies, every pose) and `sheet=hatface` (with every hat and glasses). It is front only like `h_mask`; the back views have no
  layer on purpose. ROOMS could not get the matrix to draw characters headless, so this is unchecked on bodies.
- DONE by QA in 97e9810. WAITING ON QA: check the published v0.49 (LEAD, rule 18): the pinned artifact "Quest Board v0.49 (test, fresh
  start)" (slug 7336ed4a-741d-4af2-b0fe-7492666e5a32, 439 files from 8fabe1a). QA: 437 of 438 build files match by sha256,
  index.html differs only by its title, lfvar.json as in v0.48, nothing missing. (LEAD's original line was lost in an edit.)
- DONE by QA (QA findings: pass). WAITING ON QA: check the published v0.50 (rule 18): the pinned artifact "Quest Board v0.50 (test, fresh start)" (slug
  cda54e71-0271-4a8d-a7a6-7fe0699d43ba, 454 files from f3c970c, db + user + sample with images). Check the page matches the build.
- DONE by QA (QA findings: pass). WAITING ON QA: check v0.51, ac8d2f0 (rule 18), before LEAD publishes it as Cal's fresh pinned copy: the Rift Mask as the Spire's last
  prize (now only after its three amulet pieces; rerun riftodds.py for the new days), the team's tops, and the usual
  pre-release set (savecheck, screens, a new save through the early story, doors, voice.js).
- DONE by QA (QA findings: pass). WAITING ON QA: check the published v0.51 (rule 18): the pinned artifact "Quest Board v0.51 (test, fresh start)" (slug
  936a4ed4-352b-4086-bf94-70d28d1b22a3, 454 files from ac8d2f0, db + user + sample with images). Check the page matches the build.
- DONE by QA (QA findings: one gap, `inbox`). WAITING ON QA: check ab6a66e, the town database rules. The town board and visit notes move to one doc per player
  (`board/<id>` holds their last 10 posts, `pings/<id>` their newest note to each Loft, 14 days), so the rules in
  `app/dbcaps.json` can let each player write only their own doc (`worlds`, `board`, `pings`: everyone reads, `{self}`
  writes, the owner tidies; `diag` owner only). LEAD's two-player test on a stand-in database that refuses other players'
  docs: 16 of 16 pass (posts, delete, visit note, one note per visitor, the visit buff, no refused writes, no page errors),
  script in `shots/townrules_lead.js` (port 8766). Not checkable headless: the real rules on a real page with two accounts,
  which is QA's 15-player test after the next publish. LEAD declares `app/dbcaps.json` at that publish.
- DONE by QA (QA findings: pass). WAITING ON QA: check 414a730, necklaces in the yawn (your finding (1)). `src/rig.js`: when a top is painted for the pose, the
  neck layer's parts up to the top's last group move to right after the painted top; nothing else changes order, and poses
  without a painted top draw exactly as before. LEAD's sheet: all 7 neck items on the first three painted tops, both bodies,
  42 of 42 drawn, every necklace shows (`shots/yawn/neck_fix_lead.png`, `onepose&pose=stretch`). Not checked: all 31 tops,
  and the sit and sleep poses (no painted art there, so unchanged by construction).
- DONE by QA (QA findings: pass; load time noted). WAITING ON QA: check v0.52, db67326 (rule 18 step 2), the next copy for Cal after v0.51. New since ac8d2f0: the yawn painted
  for every top, the 3 starter tops included (503cd3f, 6541dd3), necklaces drawn over painted tops (414a730), the town
  posts and visit notes one doc per player (ab6a66e), and `app/dbcaps.json` with the inbox rule (742a39e), which LEAD
  declares at publish. The usual set please: savecheck, screens, a new save through the early story, doors, voice.js.
  Also look at load time: `art_rig.js` is now 14.1 MB (all the yawn layers), 455 files in all.
- DONE by QA (QA findings: pass, one small fix). WAITING ON QA: check 4b72f95, the loading bar (for v0.53; v0.52 stays db67326). `app/loader.html`, written into the page by
  `build.py` in place of the script tags: it fetches the same 11 files with a progress bar ("12 of 38 MB"), runs them in the
  same order, then removes itself. If fetch is missing or fails it adds plain script tags; if the host blocks scripts added
  as text (no `window.QBART` after art_rig.js) it loads every file as a tag. LEAD's `shots/loadbar_lead.js` (port 8766):
  unthrottled, ready at 1.2 s; 9 Mbps and 4x CPU, the bar shows at 0.4 s and climbs to the game at 36.0 s (QA had v0.52 at
  35.9 s, so the total does not change); fetch blocked: tags, ready 1.2 s; a strict script policy (hashes only): tags,
  ready 1.2 s. No page errors in any. Not checked: the real host (its own policy), a second visit from the cache, and
  savecheck/screens on this build.
- DONE by QA (QA findings: pass). WAITING ON QA: check fb7ca53, the loading bar redone after your c5766ed (for v0.53; v0.52 stays db67326). Your same-tab
  reload finding (2.1 s became 27.7 s, fetch() skips the tab's memory) meant the fetch loader had to go: `app/loader.html`
  now adds ordinary script tags in order (async=false) and fills the bar as each file lands (resource timing, then onload),
  so no text copies and no fetch fallback are needed. `build.py` cuts any pack over 4.5 MB into pieces (`art_rig_1..4.js`,
  `blobs_1..4.js`, `art_ex_1..2.js`; blobs append to `window.__B` in order, all 675 identical), clears old scripts from
  dist first: 461 files. The bar shimmers and says "Loading 38 MB" until the first file lands; "faster next time" is
  gone. LEAD's runs on 8766: your loadtime.js ready 35.7 s, bar at 0.4 s, no inline text left, peak heap 42 MB;
  tabmemory.js 291 MB; `shots/revisit.js` (cache on, 9 Mbps, x4): first 35.7 s, reload 0.8 s, a new tab 0.4 s, 0 MB
  fetched again; strict hash-only script policy: starts. No page errors. Not checked: savecheck/screens on this build, and
  the real host's cache headers.
- DONE by QA (QA findings: pass). WAITING ON QA: check the published v0.52 (rule 18): the pinned artifact "Quest Board v0.52 (test, fresh start)" (slug
  fdd651f3-324f-46ad-a2b3-9632ac8e8fb0, 454 files from db67326, db with the 9 rules of `app/dbcaps.json` + user + sample
  with images, version 1793965410-ff73). Check the page matches the build and the rules are live (`db_rules_get` shows 9).
- DONE by QA (QA findings: pass). WAITING ON QA: check the published v0.53: the pinned artifact "Quest Board v0.53 (test, fresh start)" (slug
  6561fd34-3689-4451-b03c-2740c2fc7061, 461 files from 743c30c: 20 core, 441 art; the 9 db rules + user + sample with
  images; version 1793965993-4ce3). Check the page matches the build, and if you can, the host's cache headers on the pieces.
- DONE by QA (QA findings: pass, publish). WAITING ON QA: check v0.54, a384feb (rule 18: your pass publishes it). Three changes:
  (1) The stretch no longer tears (Cal on v0.52, "Still tearing"; ROOMS found the clip went through `stretchUp`, which has no
  painting). `data/poses.json` clip `stretch` is now idle, stretch x5, idle (24 frames), and `src/rig.js` never blends a span
  with a painted pose on one end: it shows one key or the other. LEAD's sheet, every frame, starter hoodie/tee/bomber, both
  bodies: frames 0-1 and 22-23 idle, 2-21 the painted yawn, no in-between frame (`shots/v54/stretch_clip_starters.png`;
  new `rigtest/matrix.html?sheet=clip&clip=stretch&arts=...` draws any clip frame by frame). Please check every frame of the
  clip in the creator and in a room, shop tops too. The yawn now snaps up and down (no stretchUp beat).
  (2) The creator's Begin button (Cal, phone screenshot: "I can't see the begin button" after scrolling the menu). On screens
  up to 720 px the preview and menu split the space left (`app/index.html`), Back/Begin stick to the bottom, the menu's scroll
  hands on to the page. `shots/ccbegin.js`: 390x664, 360x600, 430x800, 1280x800, Begin on screen and tappable at the start,
  with the menu at its end, the page at its end and back at the top; no page errors (`shots/v54/creator_390.png`).
  (3) diag/load (your idea): each visit's scripts with transfer size, body size and time, how many came from the cache (0
  bytes) or were only checked (a few hundred bytes), and when the bar showed and the game was ready; last 6 visits, owner's
  device only. `shots/diagload.js` on a stand-in db: first visit 18 files 39.4 MB, reload 18 checked, 5.4 KB.
  Not checked by LEAD: savecheck/screens on this build, rooms playing the stretch.
- DONE by QA (QA findings: pass). WAITING ON QA: check the published v0.54: "Quest Board v0.54 (test, fresh start)" (slug 278e76fb-a812-42a8-90b0-b456091a8b1e,
  461 files from a384feb, the 9 db rules + user + sample with images, version 1793967962-0e38). Check the page matches the build.
- DONE by QA (QA findings: pass, publish). WAITING ON QA: check v0.55, 17d4b44 (rule 18: your pass publishes it). (1) Skirts: 1bbe47f (rig option) and be8e92c (the flag
  on v_tulle and h_pleat): one piece mid-stride (`shots/v55/skirt_before.png`, `skirt_after.png`). (2) Room-window lag from
  Cal's phone (b46bc16): the fx-pulse glow is an ::after layer that only fades; .hero and .now keep the old glow (their ::after
  belongs to fx-sweep and fx-holo). Please eyeball the glow at every rank skin. (3) Your v0.54 notes: the creator on a phone
  held sideways (max-height 500 and wider than 720: two columns fitted to the height, Back/Begin pinned) and the Testing pill
  top right while the creator is open. `shots/ccbegin.js`: 390x664, 844x390, 740x360, 1280x800, Begin on screen and tappable
  in all four scroll states, the pill over no creator button; no page errors. Not checked by LEAD: savecheck/screens on this
  build. ROOMS's shadows (9593432) are in it too.
- DONE by QA (QA findings: pass). WAITING ON QA: check the published v0.55: "Quest Board v0.55 (test, fresh start)" (slug 6ad04c53-fdb5-4cd9-b39b-44eb276d38ed,
  462 files from 17d4b44: 20 core, 442 art with the new gmx_beanb; the 9 db rules + user + sample with images; version
  1793969778-98a7). Check the page matches the build.
- DONE by QA (QA findings: pass, publish). WAITING ON QA: check v0.56, a3335e1 (rule 18: your pass publishes it). Over v0.55 it adds only ROOMS's work you passed:
  c6ba889 and 1dc4211 (the upgrade audit fixes), a96c4f7 (dark-floor shadows, Auditorium, Boba shelf, Game Room, bed name)
  and add039a (pool table, club fog). LEAD's part is the version number. Local boot: no page errors.
- DONE by QA (QA findings: pass). WAITING ON QA: check the published v0.56: "Quest Board v0.56 (test, fresh start)" (slug ed76b8e9-85d7-4a95-90cb-7951e0764e9b,
  462 files from a3335e1, the 9 db rules + user + sample with images, version 1793971454-cd01). Check the page matches the build.
- DONE by QA (QA findings: pass, publish). WAITING ON QA: check v0.57, b279091 (rule 18: your pass publishes it). Over v0.56 it adds only ROOMS's f7efaf6, which you passed
  (the audit tool, sprinklers on every bed, the Star Plaque a step bigger). LEAD's part is the version number. Local boot: no page errors.
- DONE by QA (QA findings: pass). WAITING ON QA: check the published v0.57: "Quest Board v0.57 (test, fresh start)" (slug 34b73668-15d2-4030-bdcd-8bbee04ad845,
  462 files from b279091, the 9 db rules + user + sample with images, version 1793972414-d808). Check the page matches the build.
- DONE by QA (QA findings: pass, publish). WAITING ON QA: check v0.58, 859d941 (rule 18: your pass publishes it). One change over v0.57: the Testing pill is hidden while the
  creator is open (`app/index.html`), since it covered a creator button wherever it sat (your note, last at 375x548). It is
  back on the Board after Begin. `shots/ccbegin.js` at 375x548, 390x664, 844x390, 1280x800: Begin on screen and tappable, no
  page errors.
- DONE by QA (QA findings: pass). WAITING ON QA: check the published v0.58: "Quest Board v0.58 (test, fresh start)" (slug 974301b9-f250-4650-90af-04fa3d61600e,
  462 files from 859d941, the 9 db rules + user + sample with images, version 1793973604-fe09). Check the page matches the build.
- SUPERSEDED by v0.61 (QA). WAITING ON QA: check v0.59, 0dfa204 (rule 18: your pass publishes it). Over v0.58: ROOMS's 3c27004 (passed), and LEAD's Bedroom
  lag fix from Cal's v0.58 phone log, which has one room window at 18 fps (worst 433 ms, 6,263 elements; the other samples
  56-60). The fully bought Bedroom is the heavy one: its game screen's 20 twinkles, two scrolls, the jump and three portal
  glows changed something nearly every frame, and each change re-draws the whole room. Now `.scrB/.scrL/.scrL2/.scrJ/.prtG`
  run in steps (index.html) and the twinkles share four beats (24_screens.js). `shots/roomsall.js` (every room, CPU x4): the
  Bedroom was the only one under 59; `shots/starcure.js`: 60 fps after the first draw (35-46 before). diag/perf now carries
  `room` (the open window's title). Please eyeball the stepped screens (Bedroom game screen, any portal) for looking choppy.
- SUPERSEDED by v0.61 (QA). WAITING ON QA: check v0.60, c7aa1df (rule 18: your pass publishes it; it contains v0.59, 0dfa204, so check this one instead). New
  over v0.59, Cal via ROOMS: "For the test version, let skip a week actually change days, and level up actually skip past the
  level trials because I can't actually provide gym picture every time for a job advancement while testing" (he could not
  get the Garden at level 5). (1) Testing Level up now also passes the trial it reaches (30_app_b.js simlvl). (2) Skip a week
  leaves S.testFree = 7 unlock days: unlockSlotFree, the story stepDay check and the daily area reveal let through up to 7
  unlocks, one at a time as before, each spending one (29h_unlocks.js, 29b_story.js, 29_prices.js qbWeek). Testing only:
  nothing sets testFree but Skip a week. `shots/gardentest.js`: a fresh save, Level up x4 -> level 5 with gate 5 passed; the
  first Skip opens the Hall and offers the Garden lot (testFree 5 left); no page errors. Not checked: savecheck/screens.
- BLOCKED by QA (QA findings). WAITING ON QA: check v0.61, d9d92d7, in place of v0.60 and v0.59 (rule 18: your pass publishes it). New over v0.60, Cal: "Once
  ready, publish so I can test the garden. Start me at level 5 as if I've just completed the job advancement". QB_TEST_START = 5
  (29_prices.js): a brand-new character (ccdone, first time only; old saves untouched) starts at level 5 XP with gate 5 passed
  and the areas below level 5 open (Board, Training, Shop, Dungeons, Loft, Hall), unlockDay free. The class is still chosen by
  the player (the Board's Class Awakening card). `shots/teststart.js`: name, Begin -> level 5, gates 5, the Garden lot offered
  about 6 s later, no page errors. On the Before release list now: QB_TEST_START back to 0.
Art and room code requests (LEAD asks, ROOMS does):
- DONE by LEAD in be8e92c (ROOMS: "please add it yourself"). WAITING ON ROOMS (LEAD asks): add `"skirt": true` to `v_tulle` and `h_pleat` in `data/items.json` (or say LEAD may). The rig
  side is in 1bbe47f: a pants item with `skirt` binds every point to both thighs evenly and draws with the hips, so mid-stride the
  hem swings as one piece instead of splitting like culottes (QA's b58bf48). `src/look.js` reads the flag from QBDATA.items,
  so no equip code needs a new field. Tried with the flag added to a local build only: walk1, walk3, backwalk1, backwalk3
  and sitFront, both skirts, no split (`shots/v55/skirt_before.png`, `skirt_after.png`). Without the flag nothing changes.
- DONE by ROOMS in 28a51ee: (1) ROOMCELL garden [1,1,0], right of the Restaurant; boba [1,2,0], dessert [1,2,1], speakeasy
  [1,2,2] (LEAD: please keep the street and lots in step); (2) gd_rest is a lit doorway in the Garden's back-left wall into
  the Restaurant's kitchen, whose end wall has the gap; arrows both ways; (3) the Garden's three painted lots (approval 20).
  The Garden and the Restaurant, Cal's decisions (2026-11-05), LEAD's code in 16e72c3: the Garden stays its own lot (the empty lot
  next to your building) and opens at level 5 (b1088f8, was: after the closet and patio); "the next upgrade should be a restaurant that
  expands from it": the Garden's first upgrade, `gd_rest` Knock Through to a Restaurant, opens the Restaurant after Mara's yes.
  ROOMS: (1) put the Restaurant next to the Garden in Kode Plaza (`ROOMCELL`; today Restaurant [1,0,0], Garden [1,2,0]) with
  a door between them, (2) what `gd_rest` looks like in the Garden (the wall opening onto the kitchen), (3) the Garden's art
  per the storyboard. Tell LEAD the ROOMCELL change; LEAD keeps the street and lots in step.
- WORK ORDER (Cal, 2026-11-05): "From here on out, I want to reference LEAD's story board and work on things sequentially. The
  garden comes before the restaurant so we should have done that first." The storyboard is `docs/STORYBOARD.md`: build from
  the top down. **Step 1, the Garden, is next for everyone.** LEAD's call on ROOMS's Restaurant polish: finish and commit the
  corner booth and the fire pit you already have in hand today (Cal's own notes), then stop the Restaurant there; the
  fine-dining furniture waits until its step comes round again. Then the Garden.
- (was: NEXT after the Restaurant) (Cal, 2026-11-05, via QA): "Once the restaurant is done, I want to start work on the garden since
  that is still part of the apartment loft." ROOMS: the Garden's painted shell and furniture to the same standard as the
  Restaurant (QA's lessons for the next art pass), its stages as it is upgraded, and the produce stand (the story sells
  produce there: `stySellHtml`, 4 coins a vegetable). LEAD: the Garden's text and story hooks, and whatever code its new
  art needs. Open question for Cal: the game puts the Garden in Kode Plaza next to the Restaurant (`ROOMCELL`, building 1),
  and the story calls it "a plot of land in Kode Plaza"; he calls it part of the apartment Loft. Move it into The Loft
  building, or keep it in Kode Plaza? QA checks the Restaurant fixes, then the Garden.
- Art slots still empty (LEAD, ca1068d, Cal: "plug and play"): see `docs/ART_SLOTS.md` (rerun `tools/art_slots.py`). Missing
  12: the five portrait brand banners (already asked, 720 x 1080), six relic icons `ui_relic_<streak|team|build|exped|quests|
  collect>.webp` (128 x 128, one per relic, painted game style: a streak flame, a handshake, a hammer, a ledger, a tally,
  a curator's lens), and Sable's portrait `ui_story_sable.webp` (300 x 400). Each shows a stand-in until it exists.
- PART DONE by ROOMS in 4fc1542, Cal approved (approval 13, 2026-11-05): the five join banners `ui_team_sable`, `_mara`, `_rafe`,
  `_nova`, `_theo` (720 x 400) are in `art/app`; class banners (1) DONE in 6b7b9c8 (approval 14, `ui_class_<id>_m/_f`); the
  team in their rooms (3) is still to do. Team, class art and team looks (Cal, 2026-11-05; code in d523cf1, `29c_team.js`). Show Cal each set side by side:
  1. Class banners in the game's own chibi style, a man's and a woman's version of each: `ui_class_<id>_m.webp` and
     `_f.webp` for tamer, swiftblade, runeweaver, vanguard (360 x 480 portrait, the player's chibi in the class gear). The class
     screen and the job banner pick the one matching the player's body; the old picture shows until then.
  2. A join banner per team member, anime style, 720 x 400: `ui_team_sable.webp` (scout, rescued in the dungeon),
     `ui_team_mara.webp` (chef), `ui_team_rafe.webp` (Rafe Calloway, a sunburnt travelling adventurer with a map tattoo,
     an Old Fashioned in hand), `ui_team_nova.webp` (Nova Lin, a fashion vlogger with a ring light on her phone),
     `ui_team_theo.webp` (theater crew). Original designs. The investors (Desmond Hale, Priya Okafor) are not team members:
     they only need their scene portraits (`ui_story_lockkey.webp`, `ui_story_mall.webp`); Rafe's and Nova's scenes use
     `ui_story_rafe.webp` and `ui_story_nova.webp` if painted, else their team banner.
  3. DONE by ROOMS in abb6513 (signature cosmetics still to do): In the building view: draw each team member who has joined (`window.__qbTeam.list()`, ids above) in their own room
     (Mara the restaurant, Rafe at the end of Lock and Key's bar with a crowd round him, Nova filming in the mall, Theo the
     theater, Sable the Lair) with their signature look
     from `TEAM[id].look` and something that makes them stand out from the guests (a name tag, a glow ring, a signature prop).
     Better still, a signature cosmetic each, painted as items (Mara's chef whites exist already as `npc_chef`).
  4. The theater's basics as their own upgrades: a ticket stand and a popcorn and soda machine. Tell LEAD their ids, and Theo's
     scene will wait for exactly those (he is the employee).
     DONE by ROOMS (ids for LEAD): the basics already exist as their own upgrades in `TH_UPS` (`23_theater.js`): the ticket
     stand is `t_booth1` (Classic Ticket Booth), the popcorn is `t_pop` (Popcorn Cart) and the soda `t_soda` (Soda Fountain).
     Gate Theo's scene on those three. Today they unlock at levels 26, 24 and 25 against the Theater opening at 23 (step 10);
     LEAD's call whether to pull them to 23. The Theater lobby is ROOMS's next redesign (shell, zones, QA review).
- PART DONE by ROOMS in 625d9e3, Cal approved (approval 12, 2026-11-05): the story portraits `ui_story_chef`, `_lockkey`, `_mall`,
  `_auditorium`, `_rafe`, `_nova` (300 x 400) are in `art/app`; the rest of this request is still to do. Progression (Cal, 2026-11-05, plan in `docs/PROGRESSION.md`). ROOMS's parts: (1) merge the Upstairs Bar (`skybar`) and the
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
- PART DONE by ROOMS in d48ed81, Cal approved (approval 15, 2026-11-05): (1) the six Goblin King icons, (2) `ui_gift`, (5) the six
  Hollow Amulet icons are in `art/app` at the names below. (3) DONE by ROOMS in 9be3f51, Cal approved (approval 16), READY TO PUBLISH:
  the Trophy Room, room id `trophy` above the Lair (ROOMCELL 0,1,2). The Lair sells "Stairs to the Trophy Room" (`lr_troom`,
  1800, your `trophy:1` keeps it a mystery until the first piece); `lr_trophy` is retired (owners keep it, `dgRoomBuilt`
  still counts it). The mannequin wears exactly the pieces in `S.trophy.goblin`, any order. The amulet case is parked (Cal:
  finish the goblin set first). LEAD: your Trophies tab text can drop "Trophy Wall". (4) The Rift Mask is still to do. Dungeon gifts and the Goblin King set (Cal, 2026-11-05: "Goblin King set"). Missions sometimes bring home a gift: coins, XP,
  a dungeon-only wearable, or one piece of The Goblin King's Regalia (helm, chestplate, greaves, boots, sword). The first piece
  opens a Trophy Room upgrade in the Hero's Lair; pieces fill an armor mannequin there; the full set gives the team a big
  boost. LEAD writes the gifts, loot, Relics and Trophies tabs and the bonuses; ROOMS paints and builds the room. Art, in this
  order, all original (a goblin king of our own, no franchise look):
  1. Five piece icons and a set emblem, 256 x 256, painted fantasy game style, on transparent: `ui_tr_goblin_helm.webp`,
     `_chest`, `_greaves`, `_boots`, `_sword`, `ui_tr_goblin_set.webp`. Shown in the gift reveal and the Trophies tab.
  2. The gift: `ui_gift.webp` (a closed dungeon loot chest or wrapped bundle, 256 x 256). The reveal opens it in code.
  3. The trophy display: no new upgrade needed. LEAD's code (9b4cf3a) uses the Lair's existing Trophy Wall (`lr_trophy`),
     a mystery card until the first piece. Its painted layer could show an armor mannequin that dresses piece by piece (read
     `S.trophy.goblin`, owned piece ids) and an amulet case filling shard by shard (`S.trophy.amulet`). Show Cal side by side first.
  4. DONE by ROOMS in d4eefc3 (QA wear-tests it; LEAD adds its line with the dungeon flag). One dungeon-only wearable: the Rift Mask, a mask from another dimension (one sheet, every angle, both bodies, item id
     `dg_riftmask`, slot mask). Never sold in the Shop; LEAD adds its line with a `dungeon` flag. Wear-test it.
  5. The Hollow Amulet (LEAD, 9b4cf3a): five shards of one broken amulet, each its own colour and mood, 256 x 256 on
     transparent, same style as the goblin icons: `ui_tr_amulet_dusk.webp` (violet glass), `_ember` (warm amber), `_tide`
     (sea green), `_thorn` (dark red, sharp), `_silence` (pale grey-white), and `ui_tr_amulet_set.webp` (the amulet whole).
     All original. Until they exist the game draws a plain diamond.
- Yawn pilot, 3 tops (Cal, 2026-11-05: paint the yawn instead of bending flat art). The code is in (`src/rig.js`, the
  `stretch` pose has `"painted":"yawn"`). Template: serve `quest-board/` and open `rigtest/template.html?pose=stretch&scale=2`:
  the bare body in the peak of the yawn, man then woman, on flat green, each half exactly one frame (720 x 828). One
  sheet per cosmetic, painted over that template: the bare body (clean arms and armpits, the template's armpit shards are
  the rig's tearing), `y_vjkt`, `o_puffer` and `h_hoodie`. Cut each sheet back into its two halves, green removed, and save
  `<m|f>_<id>_yawn.webp` (and `<m|f>_base_yawn.webp`) in `art/app/` at 720 x 828; the build packs them. Nothing changes
  for any top without one. `rigtest/template.html?pose=stretch&check=<id>` is the alignment self-check. Show Cal the pilot
  side by side before it goes in; QA checks every outfit combination after.
- DONE by ROOMS in e74cf92 (QA's list plus the same tells in the Arcade, Rhythm, VR, Bowling, Karaoke and Nightclub lines, and
  no "!" in room help titles; `10_app_a.js:1515` Squat Rack stays LEAD's). Writing pass (Cal, 2026-11-05: "professional and not corny or too obvious that it is AI"). Read `docs/VOICE.md`, then
  rewrite the room and upgrade lines in your files (`27_rooms.js`, `27b_skins.js`, `data/loft.json`, `data/items.json`,
  room `help` text) to it. Worst offenders to look for: quips at the end ("It probably works.", "Do not touch."), "Obviously",
  exclamation marks, "sleek" more than once a screen. LEAD did `10_app_a.js`'s upgrade lines in cf7b36a as examples.
- DONE by ROOMS in 45930bc, Cal approved (approval 11, 2026-11-05); LEAD: wire the backdrops now: `art/app/bld_loft.webp`, `bld_plaza.webp`, `bld_mall.webp`
  (the street draws them already) and inside backdrops `bld_bg_loft.webp`, `bld_bg_plaza.webp`, `bld_bg_mall.webp` (1600 x 900,
  soft, nothing important in the middle): LEAD, wire the backdrops when Cal approves. Three buildings (Cal, 2026-11-05, for phone lag and looks): "it was running every single animation all at once. This is
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
- DONE by ROOMS in 47d2ffd (once a frame, drag checked headless). Lag: dragging the building or room view sets the transform on every pointermove (`lfApply`, `26_world.js`). Apply it at
  most once per frame (requestAnimationFrame). Measured by ROOMS headless; real phone numbers come with the next publish.

QA findings (QA adds one line each: what, where, how to see it, screenshot, owner; LEAD moves them into the right list):
- QA, Cal 2026-11-06 (to QA): "Going forward, only publish for me to test when you can't find any more errors." From now on a QA pass
  means no known error left in the exact build; no "pass, fix in the next version" for anything visible. Owner: everyone.
- QA, v0.61 (d9d92d7, covering v0.59 and v0.60): BLOCKED, do not publish. Works: the level-5 start (new `teststart.js`, 440x840): level 5,
  gate 5 passed, Board, Training, Shop, Dungeons, Loft and Hall open, the class still to pick, no page errors; the Garden is offered
  (story offer.garden, lots ["garden"]); Testing > Add 10,000 coins, then the lot builds a Garden (1,500); old saves untouched.
  v0.59's stepped screens: not choppy by the numbers (scrolls 7 a second, the jump 27 a second while it moves, the portal glow 0.1 a
  step, twinkles 3 levels); the full Bedroom window (new `fpsroom.js`) 22-35 to 33-39 fps at CPU x4, 41-52 to 51-56 at full speed in
  QA's software-drawn browser. Correction to QA's v0.58 phone read: the log keeps 16 samples and the 18 fps room sample LEAD saw had
  rolled off before QA read it; LEAD was right; suggest diag/perf also keeps its slowest sample. Blockers: (1) Cal: "The garden should
  be the next lot to the right." Built, the lot right of the Loft is Kode Plaza, a cafe with diners in its window, the Garden inside
  it before any restaurant exists (`shots/v61/street_garden.png`); Cal wants the Garden itself there. (2) 685cbd0 is in the build:
  the ping-pong table off the Game Room's right edge and over its doorway (ROOMS's own finding; 6f04ed8 fixes it, in review). Small:
  the test start gives 0 coins. Owner: LEAD and ROOMS (the Garden lot), LEAD (rebuild).
- QA, ROOMS's 3c27004 (Cal on v0.58: the Game Room TV, the racing chairs, the double gaming rig; `shots/gm3/`): pass with one note.
  The retro TV now faces the beanbags (`tvcmp.png`: v0.58 left, its screen pointed at the door wall; now right, at the
  beanbags, which face it). Gaming Chairs and Gaming Desks retired (`retired.js`): a new player gets no card; a save that owns
  them keeps both ids and draws nothing more. The mini fridge stands on the back wall between the snack bar and the soda
  machine. No page errors, day and night. Note, against the references (each big table has its own open floor): with the desks
  gone the ping-pong table is back at the front and tight at both playing ends: its left end is a hand from the pool table's
  front corner, its right end runs up to the doormat (`front.png`). Fix: give it its own clear patch, or drop it and let the
  pool table be the room's one big table (Cal's call if it goes). Owner: ROOMS.
- QA, Cal's iPhone on v0.58 (diag on the published page, iOS 18.7, the Claude app, 440x840, dpr 3): first visit bar 0.38 s,
  ready 1.43 s (34.5 MB sent); second visit ready 0.25 s, 15 files from the cache and 3 checked, 900 bytes; the Loft 56-60 fps
  with a room window open (worst frame 51-84 ms; v0.53 was 41-55 fps with 300+ ms stalls), Training and the Shop about 60 fps.
  So the loader, the cut packs, the cache and the glow fix all hold on his phone; nothing to fix. Owner: LEAD (for the record).
- QA, the published v0.58 (slug 974301b9, version 1793973604-fe09): pass, 460 of the 859d941 build's 461 files identical, none missing,
  index.html only by its title, lfvar.json matches, the 9 rules declared; not opened yet. Owner: LEAD.
- QA, v0.58 (859d941, APPV 58, built clean; rule 18: pass, publish it). Over v0.57 only the pill rule and APPV. `ccbegin.js` (now also
  checks the pill after Begin): at all 10 sizes the Testing pill is hidden in the creator, comes back on the Board after Begin,
  and Begin is on screen and tappable; the old 375x548 overlap is gone. It uses CSS `:has()` (Safari 15.4 and up; Cal's iOS 18 is
  fine). The full set: savecheck, screens, old saves, "NEW v0.58", doors 36 of 36, voice 0, Shop 44, Trophy Room, town rules 32 of
  32, the Rift Mask, the team, diag/load, all 30 rooms: all pass; one team run had the old intermittent blob ERR_ABORTED, two reruns
  clean. Nothing open from QA. Owner: LEAD (publish).
- QA, the published v0.57 (slug 34b73668, version 1793972414-d808): pass, 460 of the b279091 build's 461 files identical, none missing,
  index.html only by its title, lfvar.json matches, the 9 rules declared; not opened yet. Owner: LEAD.
- QA, v0.57 (b279091, APPV 57, built clean; rule 18: pass, publish it). Over f7efaf6 (passed) it changes only APPV. On the exact
  build: savecheck, screens (360, 390), old saves, "NEW v0.57" desktop and phone, doors 36 of 36, voice 0, Shop 44, Trophy Room,
  town rules 32 of 32, the Rift Mask, the team, diag/load, all 30 rooms fully bought, Begin at all 10 sizes: all pass, no page
  errors; still the Testing pill over the Black colour button at 375x548 (goes at release). Owner: LEAD (publish).
- QA, the published v0.56 (slug ed76b8e9, version 1793971454-cd01): pass, 460 of the a3335e1 build's 461 files identical, none
  missing, index.html only by its title, lfvar.json matches, the 9 rules declared; not opened yet. Owner: LEAD.
- QA, ROOMS's f7efaf6 (the audit tool forces an upgrade's needed expansion first; sprinklers on every bed; the Star Plaque bigger):
  pass. Re-audit of the restaurant and garden: the tool now buys r_x1 and r_x2 before the pieces that need them, so they are
  measured in their own room: Walnut Dividers 1.46% (OK), Drinks Cooler 0.34% (seen; the Backlit Wine Wall replaces it later at
  1.06%, by design), Dish Station 0.37%; Star Plaque 0.13 -> 0.21%, Sprinklers 0.10 -> 0.31%, all visible. Aisle Lights can stay
  thin. Owner: LEAD (v0.57 with it).
- QA, v0.56 (a3335e1, APPV 56, built clean; rule 18: pass, publish it). Over add039a it changes only APPV, so it holds exactly the
  work QA passed (c6ba889, 1dc4211, a96c4f7, add039a). On the exact build: savecheck, screens (360, 390), old saves, "NEW v0.56"
  desktop and phone, doors 36 of 36, voice 0 of 1,354, Shop 44, Trophy Room, town rules 32 of 32, the Rift Mask, the team, diag/load
  (owner only), all 30 rooms fully bought render, Begin at all 10 sizes: all pass, no page errors. Still open, small: the Testing
  pill covers the Black colour button at 375x548 (it goes at release). Owner: LEAD (publish).
- QA, ROOMS's audit fixes c6ba889 + 1dc4211 and add039a (tools/upgrade_audit re-run on the nine rooms they touch, 1dc4211 on
  8775, then club and Game Room on add039a; `shots/reaudit/`): pass. In those rooms OK 140 -> 147, WEAK 57 -> 53, NONE 26 -> 23.
  Now clear: Neon Trim 0 -> 2.9%, More Plots 0.03 -> 1.9% (a bed is added), Smoke Machine 0.14 -> 2.65% (add039a's stronger
  fog), Laser Rig 0.05 -> 0.95%, Pool Table 2.4%. Bigger but still under 0.6%: Film Reel 0 -> 0.40, Lobby Chandeliers 0 -> 0.25,
  Neon Marquee, Clapboard, Ball Return, Ball Rack, Blossom Garland, RGB Floor Lamp, Cocktail Cart, Patio Heaters, Drip (0.26 to
  0.47); still faint: Sprinklers 0.10, Star Plaque 0.13, Aisle Lights 0.15. The restaurant's Walnut Dividers, Drinks Cooler and
  Dish Station still score 0 only because the audit tool buys them before the expansions they now need (it ignores the new
  gate); in the fully bought restaurant the dividers (between the booths) and the dish station show, about 1.2% of the room
  (`restaurant_three.png`); the Drinks Cooler shows nowhere there: fine if a later upgrade replaces it, else it still draws
  nothing. The pool table now has clear floor from the beanbag and the sofa arm (`pooltable.png`). The laser reads well, not
  busy. Tool: the audit should respect `needs` like the shop does. Owner: ROOMS (the cooler question; the tool), LEAD (v0.56).
- QA, ROOMS's v0.55 fixes (a96c4f7, on 18df296; `shots/a96/`): pass. Dark floors (Lock and Key, Speakeasy, Arcade, Rhythm,
  Karaoke, Club, Lair, Auditorium): the shadows now show, 4 to 6% of each room by day and 2 to 5% at night (v0.55: under 1%);
  Lock and Key and the Speakeasy read grounded under every piece (`four.png`). Taste: the black at 0.92 is strong; under the
  Speakeasy's upright piano it spills a near-black patch onto the floor in front (`sp_cmp.png`); fine, but if Cal finds the dark
  rooms heavy, 0.8 is the knob. Auditorium: seat rows, speakers and projector all cast one now. Boba: the Plant Shelf hangs on
  the wall above the bench, no floor shadow. Game Room against the references: much closer, one table, the ping-pong gone,
  clear floor in front of the pool table; still tight at its back edge, where the orange beanbag meets its back-left corner and
  the sofa's left arm nearly meets its back-right rail, so a cue at either end would hit them; a quarter tile more each way would
  do it. Names: Velvet Tufted Bed reads right; the Game Room pairs replace each other, fine. No page errors. Owner: ROOMS (the
  Game Room nudge, optional).
- QA, the published v0.55 (slug 6ad04c53, version 1793969778-98a7): pass, 460 of the 17d4b44 build's 461 files identical (the new
  gmx_beanb included), none missing, index.html only by its title, lfvar.json matches, the 9 rules declared; not opened yet (the
  database is empty). Owner: LEAD.
- QA, v0.55 (17d4b44, APPV 55, built clean, with ROOMS's shadows 9593432 and phone-note fixes 60ab997 in it; `shots/v55/`): pass,
  publish it; the fixes below go in the next version. Skirts: v_tulle and h_pleat hang as one piece in every walk and backwalk
  frame (v0.54 split both, the pleat badly; `skirts.png`). Glow: at its peak the new faded layer looks the same as the old
  box-shadow at every rank (default, D, C, B, A, S; new `glowranks.js`, `glow_cmp.png`). Begin (`ccbegin.js`, now 10 sizes, the
  pill checked before the tap): on screen and tappable at every size including sideways 740x360, 844x390 and 932x430; the
  Testing pill clears every creator button except at 375x548 (Safari with bars), where it covers the Black colour button (small,
  it goes at release). The usual set all pass ("NEW v0.55", savecheck, screens, old saves, doors 36 of 36, voice 0, Shop 44,
  town rules 32 of 32, the Rift Mask, the team, diag/load), no page errors. Shadows (new `allrooms.js`, `shadowmap.js` red =
  darker, blue = lighter, `pairsheet.js`; every room fully bought, v0.54 against v0.55, 13:00 and 22:00): good in the light and
  mid rooms (Boba, Dessert, Theater lobby, Bedroom, Lounge, Studio, Gym, Library, Dojo...), soft and even, not too dark at
  night on light floors, nothing on walls or doors. Fixes, ROOMS: (1) the Speakeasy gets no shadow at all (chairs, barrels,
  jukebox, sofa, cart); (2) on dark floors they are invisible: Lock and Key (0.7% of the room changed by day, 0.0 at night) and
  the Lair (0.5%), Club, Karaoke, Arcade; raise the strength on dark floors or use a light-edged contact shadow; (3) the
  Auditorium's three tall floor speakers and the projector stand have none, and the hard box under the seats went, so the seat
  rows have none either; (4) Boba: a floor shadow under the small pink plant shelf by the window bench; if it hangs on the
  wall, drop it. 60ab997, against references (isometric game rooms: "colored 3D isometric game club", "low poly cutaway",
  "immersive 3D game room"): Bedroom good: the poster now a poster-width clear of the Closet door, prints and moss panel over
  the bed as rooms usually hang art. Game Room: the beanbags face the retro TV now, but that corner is crowded: the orange
  beanbag sits on the pool table's end and the ping-pong table touches the pool table's front corner; in every reference the
  pool table stands alone with room for the cue; move the ping-pong table off it (or drop it) and keep a clear ring round the
  pool table. Names: all read right; "Premium LED Bed" shows no LED in the picture; "Big TV"/"80 inch Screen" and "Couch &
  Console"/"Cream Sectional"/"Floating Media Console" are fine only if each replaces the one before. Owner: LEAD (publish),
  ROOMS (shadows, the Game Room corner, the bed name).
- QA, the published v0.54 (slug 278e76fb, version 1793967962-0e38): pass, 459 of the a384feb build's 460 files identical, none
  missing, index.html only by its title, lfvar.json matches, the 9 rules declared. Its diag/load gives the real host's numbers:
  it compresses (34.5 MB sent for 39.4 MB of scripts; app.js 0.41 of 1.13 MB) and the Mac was ready in 3.3 s. Owner: LEAD.
- QA, the upgrade visibility audit (ROOMS's tools/upgrade_audit, run on the v0.53 build 743c30c, so before the shadows and
  60ab997; `shots/upaudit/`: report.md, sheets/, qa_list.txt ranked worst first): 503 upgrades in 30 rooms, OK 363, WEAK 98,
  NONE 42, GROWS 7, retired 16. Of the 140 WEAK or NONE, 54 show nothing by design (people, menus, money caps, room openers, pets).
  Left: 12 NONE. Pieces that draw nothing: Walnut Dividers (r_d3), Drinks Cooler (r_cool), Dish Station (r_k9), Irrigation
  (f_pump), Lobby Chandeliers (t_chand), Neon Trim (ar_neon), Film Reel Wall Art (t_reel). Services with no picture: Mixology
  Course (b_mixo), Bottle Service (k_bottle), Concession Staff (t_st2), Head Gardener (g_gard2), More Plots (g_p2). And 74
  WEAK, mostly small wall pieces and neons under 0.4% of the room (Laser Rig, Aisle Lights, RGB Floor Lamp, Smoke Machine, Wall
  Clock, Neon Sign, Ball Return, Ball Rack). Owner: ROOMS.
- QA, v0.54 (a384feb, APPV 54, built clean; rule 18: pass, publish it; `shots/v54/`). (1) The stretch: every frame of the clip
  (`sheet=clip`) for the 3 starter tops in white, grey and black and all 31 shop tops, both bodies, 70 rows, each frame sorted
  by which picture it is (new `clipframes.js`): every row is idle on frames 0-1 and 22-23 and the painted yawn on 2-21, no
  frame in between, so nothing can tear. In the creator (440x840, new `ccstretch.js`): the Stretch preview shows only the
  standing picture and the yawn (hoodie, bomber, tee). In a room (the Bedroom, new `roomstretch.js`): the clip is 24 frames at
  12 fps and a room stretch lasts 1.6 to 2.6 s, so it ends on a key and cuts, never blends; a live picture shows the clean
  yawn and the others clean standing; the exact moment of the switch was not caught live (the headless renderer is too slow
  to film it). (2) Begin (new `ccbegin.js`, 8 sizes, a real tap at the end): fixed on every phone held upright, 320x568,
  360x600, 375x548 (Safari with bars), 390x664, 430x800 and Cal's 440x840: on screen and tappable at the start, with the menu
  and the page scrolled, and the tap starts the game; v0.53 failed all of these. Still off: a phone on its side (844x390),
  where Begin shows only after scrolling the page to its end, because the new layout keys on width up to 720 px; key it on
  height (or the shorter side) too. Small: the Testing pill covers the first hair style button on a phone (it goes at
  release anyway). (3) diag/load (new `diagload.js`, stand-in db): the owner's visits write 18 scripts each, bar and ready
  times; the first visit 39.4 MB downloaded, the reload all 18 from the cache; a friend writes nothing. When reading Cal's
  numbers: a transfer of 0 can also mean the browser does not report it, so check each file's ms too. The usual set: all
  pass (savecheck, screens, old saves, "NEW v0.54", doors 36 of 36, voice 0, Shop 44, town rules 32 of 32, art identical,
  the Rift Mask, the team), no page errors. Owner: LEAD (publish; the sideways Begin and the pill for later).
- DONE by LEAD in a384feb (diag/load logs each script's transfer size and the load times). QA, the published v0.53 (slug 6561fd34, version 1793965993-4ce3): pass, the page matches the 743c30c build. By sha256, 459 of the
  build's 460 files are identical and none are missing (all 18 scripts, the cut pieces included); index.html differs only by its
  title (26 bytes longer); lfvar.json matches. The 9 db rules are declared, and as a Contributor diag reads as missing. Cal's
  iPhone has opened it (diag/frame: iOS 18.7 in the Claude app, APPV 53, the Board, 11:54); diag/perf is from the Mac. No save
  yet. Not checked: the host's cache headers. Opening the page from QA's browser would overwrite Cal's phone diag/frame, so QA
  did not. Better: let the phone log say it. In the diag log, add each script's `transferSize` from
  `performance.getEntriesByType('resource')` (0 means it came from the cache) and the time to the first screen. Then Cal's
  second visit shows whether the pieces are cached on his phone. Owner: LEAD.
- DONE by LEAD in 1bbe47f (rig side; the item flag is ROOMS's, below). QA, the Black Tulle Skirt's wear test (`v_tulle`, female only; on 7387646; `shots/tulle/`): fine standing, sitting, typing,
  sleeping and in the yawn, short and long hair (22 poses, 0 fails; long hair falls over it right). One fix: mid-stride the long
  skirt splits at the middle like culottes (a notch at the front in walk3, two lobes from behind in backwalk1, `zz.png`), because
  the rig binds a pants-slot item to each leg; the short plaid skirt hides it (`yy.png`). Fix: a rig option for skirts (bind the
  hem to the hips, or to both thighs evenly) with a flag on `v_tulle` (and `h_pleat`, also long). Old, not the tulle: small
  shoe fragments below the hem in walk3 and walk4 show on every skirt. Owner: LEAD (rig option), ROOMS (the item flag). Not a
  blocker: ship as is, fix in the next version.
- QA, v0.53's build (743c30c, APPV 53; rule 18 as Cal changed it: QA's pass is the green light): pass, publish it. It differs from
  fb7ca53 (passed in 88164ce) only by APPV. On the exact build: savecheck all pass; a fresh player sees "NEW v0.53", desktop and
  phone, no page errors; the art and blobs identical to v0.52 (`packsame.js`: 796 entries, 675 blobs, same SHA-256); older saves
  keep their areas. The page check follows once it is pinned. Owner: LEAD (publish).
- QA, the published v0.52 (rule 18, slug fdd651f3, version 1793965410-ff73): pass, the page matches the db67326 build. By sha256,
  452 of the build's 453 files are identical and none are missing; index.html differs only by its title (26 bytes longer);
  lfvar.json matches `app/lfvar.json`. It declares db, user and sample (images), owner only, and the db rules are exactly the
  9 in `app/dbcaps.json` (inbox owner-only included). The live rules hold for reads: as a Contributor (`asLevel interact`)
  diag/frame reads as missing; as an Editor it shows. The database holds only diag/frame from the first open at 11:43 (APPV
  52), no save: a fresh start. Not done: write checks with real friend accounts (needs Cal and a friend signed in; QA does not
  create accounts). Owner: LEAD (Cal's phone test is next).
- DONE (passed; goes out as v0.53 after Cal's report on v0.52). QA, the rebuilt loader (LEAD's fb7ca53, on 47ef877; `shots/v53/loadtime.txt`): pass, and a real gain. The pieces add up: the
  game ends with the same 796 art entries (70 yawn layers) and 675 blobs as v0.52, identical by SHA-256 (new `packsame.js`);
  no piece is over 4.5 MB; 460 files in dist. On a 9 Mbps, 85 ms phone with a 4x slower CPU: the bar at 0.4 s, the game at
  35.7 s (v0.52 35.9 s, blank); reopened in a new tab 0.3 s with nothing downloaded again (v0.52 27.3 s, art_rig.js and
  blobs.js again, 29.6 MB); a same-tab reload 0.7 s (v0.52 0.8 s). No inline text left; peak JS memory while loading 42 MB
  (v0.52 40); the whole tab 288 MB (v0.52 292 to 295). savecheck, screens (360, 390), old saves, a fresh player, doors 36 of
  36, voice 0, Shop 44, town rules 32 of 32, the Rift Mask roll, the yawn with necklaces, the team in their rooms: all pass.
  One run of the team check had the old intermittent `blob: ERR_ABORTED` (seen on earlier builds too; the rerun was clean).
  Not checked: the real host's cache headers (after publishing). Owner: LEAD (ready for v0.53).
- DONE by LEAD in fb7ca53 (the loader rebuilt on plain script tags, the big packs cut under 5 MB; see WAITING ON QA). QA, the loading bar (LEAD's 4b72f95, on 5728d83): pass, one small fix. Works: on a 9 Mbps, 85 ms phone with a 4x slower CPU the
  bar shows at 0.4 s and the game starts at 36.0 s (v0.52: a blank page until 35.9 s); all 11 files, same hashes as v0.52; no
  script reads document.currentScript; savecheck, screens (360, 390), old saves, a fresh player, doors 36 of 36, the team in
  their rooms, town rules 32 of 32: all pass, no page errors. Fallback (new `loadfallback.js`, every fetch aborted): plain tags,
  the game starts, the bar goes within a second. Fix: the 11 inline scripts keep their text in the page after they run (39
  million characters), so the whole tab holds up to about 40 MB more (299 to 329 MB against v0.52's 290 to 293 MB, new
  `tabmemory.js`). One line fixes it, tried in a scratch copy: `try{document.body.appendChild(s);s.textContent=""}catch(e){}`
  leaves 0 characters, the tab at 271 to 292 MB, and a fresh player still starts. Notes: (1) peak JS memory while loading is
  84 MB against 40 MB, since every file is held as text until the ones before it have run; fine on a Mac, worth knowing for a
  phone. (2) A second visit: reopening the game in a new tab, v0.52 and the loader both download `art_rig.js` and `blobs.js`
  (14.8 MB each) again, because this browser's cache does not keep files that big, so "(faster next time)" holds for about
  10 of the 40 MB. Only a reload of the same tab differs (v0.52 2.1 s from the tab's memory, the loader 27.7 s at 9 Mbps);
  `cache:"force-cache"` does not change it. If the wait matters: keep the two big files in Cache Storage from the loader, or
  split them under 5 MB. Real phones' caches differ: Cal's phone log will tell. `loadtime.js` now also reports the bar time,
  peak and after-GC memory, inline text left, and a second visit (SECOND=1, NEWTAB=1). Owner: LEAD.
- QA, v0.52's pre-release check (rule 18 step 2, db67326, APPV 52; `shots/v52/`): pass, ready to publish. savecheck passes;
  screens at 360 and 390 px fit; older saves keep their areas (level 30: all 8; level 3: the Hall waits); a brand-new player
  sees "NEW v0.52" and the character screen, desktop and phone; doors 36 of 36 on Cal's rule; voice.js 0 of 1,354; Shop 44
  checks; Trophy Room passes; the team in their rooms in their tops. New saves: 12-task to day 12 (level 33; Garden day 4,
  Restaurant offered day 6, Boba day 9, Dessert offered day 10), casual to day 14 (level 18); no played day without something
  to buy; day 5's second unlock is the closet the player buys, as in v0.50 and v0.51. Town rules with v0.52's own dbcaps.json
  (`townrules.js`): 32 of 32. The Rift Mask roll (`riftlive.js`): never while a Spire piece is missing, 6.7% with all three.
  The yawn with necklaces on this build: right. No page errors. Load time (new `loadtime.js`: a fresh browser, no cache,
  network and CPU throttled through DevTools; the local server sends files uncompressed): the page loads 39.6 MB before the
  game starts (every script blocks, art_rig.js first). On a 9 Mbps, 85 ms phone with a 4x slower CPU: v0.51 34.5 s, v0.52
  35.9 s, so the yawn adds about 1.4 s (art_rig.js 13.4 to 14.8 MB). With no network limit the CPU cost is small (0.3 to 0.6 s).
  If the host compresses, the big scripts are 28.1 MB gzipped (v0.51 27.1 MB). Not a blocker for v0.52, but the first load
  is long on a phone: Cal's phone log will say what he really sees. Ideas for later: start the game before the big art
  arrives (load art_rig.js, blobs.js and art_ex.js after the first screen), or load the yawn layers only when someone yawns.
  Not checked: what the host compresses, and a second visit (cache). Owner: LEAD (publish when Cal says; load time later).
- QA, ROOMS's two yawn fixes (6541dd3, on 9bb0f16; `shots/yawn/fixes/`): pass, the yawn is done. (2) The starter tops (tee,
  hoodie, bomber) in white, grey and black, both bodies, each with all 7 necklaces: 126 cells, 0 fails, no tears, every
  necklace shows (`starters.png`); the yawn's white, grey and black match the same top standing. Their all-pose sheets differ
  from before only in the two yawn cells (`celldiff.js`). (3) The man's hips: every shop top in the yawn before and after, 52
  cells: only male cells changed (25 of 26; the puffer already covered the hips), no female cell changed, and the skin
  slivers at the waist are gone (`hips_cmp.png`, before above, after below). For the colour sheets QA added a `tc=` (top
  colour) option to a scratch copy of `rigtest/matrix.html` only; worth adding for real if ROOMS wants it. New `stack.js`
  joins sheets into one picture. Owner: LEAD (ready for the next version).
- QA, necklaces in the yawn (LEAD's 414a730, on 198c87b; `shots/yawn/neckfix/`): pass. Every shop top (31) with every
  necklace (7) in the yawn, both bodies: 434 cells, 0 fails, every necklace shows (the two chokers small at the tilted neck,
  as in other poses). Each top with other trousers, a hat and a necklace, short and long hair: 62 cells each, necklaces show,
  long hair falls beside them. Nothing else moved: the whole neck sheet (952 cells, standing) is byte-identical before and
  after, and two all-pose sheets (varsity with the chain, the fox tee with the star) differ only in their two yawn cells (new
  `rigtest/qa/celldiff.js`, a cell-by-cell pixel diff). ROOMS's two fixes (the starter tops' yawn, m_base_yawn's hips) are
  still to come. Owner: LEAD (ready for the next version).
- QA, the yawn for the other 28 tops (ROOMS's 503cd3f, rule 17, on 2aecc59; `shots/yawn/`): the tops pass, 3 fixes needed.
  Pass: every shop top (31) in the yawn, both bodies, short and long hair, 46 cells, 0 fails: no tears at the shoulder,
  armpit or elbow; before and after (v0.51 against now) the blazer, Sable's and the coach jacket tore at the shoulder and
  now do not. Every top with other trousers (all 19, skirts too), a hat (all 14) and long hair: 62 cells each, 0 fails, all
  sit right. Fixes:
  (1) DONE by LEAD in 414a730 (neck items drawn right after a painted top). Necklaces vanish in the yawn on every top: a painted top is drawn in its mesh's last group, after the neck layer
  (`src/rig.js`, f57b1a0). It was already so for the pilot's three in the published v0.51 and is now every top. See
  `neck_old.png` (v0.51: chain, star, lock show), `neck_new.png` (gone). Owner: LEAD (draw neck items after a painted top).
  (2) The 3 starter tops every new player wears (`tee`, `hoodie`, `bomber`, from creator.json, not items.json) have no
  yawn, so they still stretch, with skin at the shoulders (`zb_hoodie.png`). Owner: ROOMS (3 more sheets, Chrome).
  (3) Male body only: a thin skin sliver at both sides of the waist, past every top, in the yawn. It comes from the pilot's
  `m_base_yawn.webp` (leftover marks at both hips, `m_base_yawn.png`), so it is on the pilot's tops in v0.51 too; the female
  body is clean. Owner: ROOMS (clean the hips of m_base_yawn).
  Not checked: in a room, on a phone. Known: `stretchUp` still tears dark sleeves (no painted layers).
- DONE by LEAD in 742a39e (the inbox rule added to `app/dbcaps.json`). QA, the town database rules (ab6a66e, `app/dbcaps.json`; new `rigtest/qa/townrules.js`, LEAD's two-player test on a stand-in
  database that applies the dbcaps.json rules themselves, with friends as Contributors): one gap. Not covered by any rule:
  `inbox/owner`, the list the owner's page turns into quests on Cal's Board (checkInbox). A path with no rule keeps the db
  default (every signed-in person reads, every Contributor writes), so any friend can read it and write quests into Cal's
  game; the test wrote "Planted quest" there. Fix: add `{"path":"inbox","read":"owner","write":"owner"}`; with it all 32
  checks pass, and Claude's db_write (as owner) still works. The rest pass: LEAD's 16 checks; a third player sees everyone;
  each board doc keeps the newest 10 posts; a note older than 14 days is dropped when the sender writes a new one (13 days
  stays); a friend is refused on another player's worlds, board and pings, on `player/state`, `diag` and another player's
  `data/users/` save; diag refusals are silent (`.catch`); no page errors. Notes: visit notes are readable by any signed-in
  player through the database (the page shows them only to the Loft's owner), so they are not private. Old-layout docs
  (`board/<id>_<time>`, `pings/<a>_<b>_<day>`) are hidden, not removed; a fresh page has none. Old notes are pruned only when
  that sender writes again. Still to do: the real rules on a real page with real accounts (QA's 15-player test after the
  next publish). Owner: LEAD (add the inbox rule before declaring).
- DONE (v0.51 pinned for Cal's phone test). QA, the published v0.51 (rule 18, slug 936a4ed4, version 1793960417-4a96): pass, the page matches the ac8d2f0 build. By sha256
  (`list_files` against a clean build), 452 of the build's 453 files are identical and none are missing. index.html differs only
  by its title, "Quest Board v0.51 (test, fresh start)" (the same 1,326 lines, exactly 26 bytes longer). lfvar.json is the page-only
  file and matches `app/lfvar.json` byte for byte. It declares db, user and sample (images), contract 0.2.96, owner only. The
  database holds only the 2 diagnostics docs from the first open at 10:20 (APPV 51, Board tab, 120 fps). There is no save, so it
  is a fresh start. Owner: LEAD (Cal's phone test is next).
- DONE by LEAD (published as v0.51, 936a4ed4). QA, v0.51's pre-release check (rule 18 step 2, ac8d2f0, APPV 51; `shots/v51/`): pass, ready to publish. The Rift Mask as the
  Spire's last prize (6682998): the real roll (new `riftlive.js`, 6,000 `__qbDungeon.roll('m5')` each) never gives it while a Spire
  piece is missing (0 with none, 0 with silence missing); with tide, thorn and silence found it comes on 6.4% of rolls (about 6.9%
  expected); never once owned; not for sale in the Shop. New days (`riftodds.py`, 20,000 players): at 2 Spire runs a day the pieces
  are all in by day 6 (median) and the mask follows about 4 days later, median day 11, 71% by day 14, 90% by 20, 98% by 30; at 1 run
  a day, median day 23, 90% by 40. The team's tops: each member in their home room in their own top, Mara in chef whites. The
  usual set: savecheck passes; screens at 360 and 390 px fit; older saves keep their areas (level 30: all 8; level 3: the Hall
  waits); a brand-new player lands on the Board in v0.51, desktop and phone; doors 36 of 36 on Cal's rule; voice.js 0 of 1,354;
  Shop 44 checks; Trophy Room passes; building backdrops at 13:00 and 22:00. New saves: 12-task to day 12 (level 33; Garden day 4,
  Restaurant offered day 6, Boba day 9, Dessert offered day 10), casual to day 14 (level 18, Garden and Restaurant); watered, never
  dry; no played day without something to buy. Day 5 of the 12-task run counts 2 unlocks, but the second is the closet, a Loft
  upgrade the player buys (v0.50's run had it on day 4 beside the Garden), so it is not new. No page errors. Owner: LEAD (publish).
- DONE by LEAD in ac8d2f0 (the Rift Mask rolls only once the Spire's pieces are all owned). QA, the Rift Mask's drop odds (e389afa, new `rigtest/qa/riftodds.py`, a copy of dgRoll, 20,000 players, days counted from the
  first Spire run): the mask is Obsidian Spire only, 1 in 8 on a gift that is not a set piece, until owned. At 2 Spire runs a day
  the median is day 7 (half by day 7, 85% by 14, 90% by 17, 99% by 30, unluckiest 71). At 1 run a day the median is day 14 (87% by
  30, unluckiest 141); about 14 Spire runs either way. Gift buffs (Hushstep Boots, goblin set) move it about a day. Note: it is
  not "after the set pieces"; the mask can win whenever a Spire gift misses its piece roll, so 41% find it before their three
  Spire amulet pieces. Fine as a rare surprise; if LEAD wants it after the pieces, roll it only when `miss` is empty. Owner: LEAD.
- DONE (v0.50 pinned; v0.51 followed). QA, the published v0.50 (rule 18, slug cda54e71, version 1793953238-4af6): pass, the page matches the f3c970c build. By
  sha256 (`list_files` against a clean build), 452 of the build's 453 files are identical and none are missing. index.html differs
  only by its title, "Quest Board v0.50 (test, fresh start)" (the same 1,326 lines, exactly 26 bytes longer). lfvar.json is the
  page-only file and matches `app/lfvar.json` in git byte for byte. It declares db, user and sample (images), contract 0.2.96,
  owner only. The database holds just 2 diagnostics docs (diag/frame, diag/perf) from the first open at 08:22: APPV 50, Board
  tab, 120 fps. There is no save and no world doc, so it is still a fresh start. Owner: LEAD (Cal's phone test is next).
- DONE by LEAD (published in v0.51). QA, the team's signature tops (097dccd, checked on b7369bc; `rigtest/qa/shots/tops/`): pass, ready to publish. matrixshot.js
  sheet=wear for tm_rafe_jacket, tm_theo_tee, tm_nova_knit and tm_sable_jacket: 44 of 44 poses each, both bodies, 0 fails; no
  mannequin lines left, Nova's lavender trim intact, Theo's lanyard on every front pose. sheet=neck: 952 cells, 0 fails, every
  necklace sits over each top. sheet=waist: 986 cells, 0 fails, each top over all 19 trousers front and back, no gap. Live
  (teamrooms.js, which now checks the top too): Rafe in Lock and Key in the brown jacket, Theo in the Theater in the black tee,
  Nova in the Mall in the cream knit, Sable in the Lair in the olive jacket, Mara in the Restaurant in chef whites (npc_chef); with only Mara joined, only
  Mara shows; no page errors. Old, not caused by these tops: in stretchUp and stretch the dark jackets' sleeves look torn at the
  shoulder (Rafe, Sable; the Shop's v_blazer does the same, the known torn-sleeve note in Done); the long hairstyle h1 leaves a
  few dark specks on light tops (Nova's knit; the Shop's h_hoodie too). Owner: LEAD (publish in v0.51); the sleeves are ROOMS's
  if Cal wants them fixed.
- DONE by LEAD (published as v0.50, cda54e71). QA, v0.50's pre-release check (rule 18 step 2, f3c970c, APPV 50; `shots/v50/`): pass, ready to publish. savecheck.js: every case passes.
  screens.js at 360 and 390 px: every tab and a room window fit, no errors. Older saves without the areas-seen record (new
  `areasload.js`, written with the flags that keep an old save's numbers): a level-30 save loads at 30 with all 8 areas, none Soon;
  a level-3 save keeps the Hall waiting. A brand-new player: character screen, then the Board, v0.50, desktop and phone. New saves
  to day 12 and 14 (`sim.js`, `unlocks.py`): 12-task Garden day 4, Restaurant, Boba, Dessert offered by day 10, level 33 on day 12;
  casual Garden and Restaurant by day 14, level 18; watered, never dry; no played day without something to buy. Building backdrops
  (`backdrops.js`): the Loft, Kode Plaza and Calibur Mall each draw their own (bld_bg_loft, _plaza, _mall), dimmed at 22:00. Doors:
  36 of 36 on Cal's rule. voice.js: 0 of 1,353. Shop: 44 checks. Trophy Room passes. No page errors anywhere. Owner: LEAD (publish).
- DONE by QA (QA findings: pass, ready to publish). WAITING ON QA (LEAD's message, rule 18 step 2): the pre-release check of v0.50 (f3c970c, APPV 50), with 9b28444 folded in.
- DONE by ROOMS (by design, nothing to change): the sleepHead note below. `data/poses.json`'s `sleepHead` swaps `hat`,
  `glasses` and `mask` to none on purpose: the head lies on the arm and those layers would clip into it. `sleep` and
  `sleepIn` keep masks. Owner: none.
- QA, wear-test of the Rift Mask (dg_riftmask, d4eefc3, on 0507161; new `rigtest/qa/matrixshot.js` draws `matrix.html` headless with
  WebGL2 SwiftShader; `shots/riftmask_wear.png`, `riftmask_hatface.png`, `hmask_wear.png`): pass. sheet=wear: 44 cells, both bodies, every
  key pose, 0 failures: the mask sits on the lower face in every front pose (standing, walking, stretching, sitting, lying), nothing
  on the back views (front only, as meant); it sits exactly where the black mask (h_mask) does. sheet=hatface: 540 cells, 0
  failures; its 60 Rift Mask cells (15 hats x both bodies x two hairstyles) show every hat over it, ear flaps and straps crossing it
  cleanly, no gaps. Note (old, not the Rift Mask): in the sleepHead pose the face shows but no mask is drawn, the same for h_mask; a
  sleepHead layer, or treating sleepHead as front for masks, would fix every mask. The 404s in the run are the yawn pose's art,
  not drawn yet for any outfit. Owner: ROOMS (the sleepHead note).
- DONE by LEAD in f3c970c (v0.50 built, with QA). CAL'S DECISION (2026-11-05, to QA, on LEAD's question "test v0.49, or skip to v0.50"): "Skip to v0.50". WAITING ON LEAD: build
  v0.50, then WAITING ON QA for its pre-release check (rule 18), then publish it as Cal's fresh pinned copy. Owner: LEAD.
- QA, the door recheck after ROOMS's 3962ee2 (on fcdd160, port 8769; `doors.js` in full, new `doorwalk.js`; `shots/doors_full_fcdd160.txt`):
  pass. All 36 pairs follow Cal's rule (the Mall–Karaoke shortcut by design); with everything bought the only piece in front of a
  door is the Mall escalator, the way up to Bowling. Walked both ways in the real windows: Bedroom–Game Room, Garden–Boba,
  Dessert–Speakeasy, Mall–Arcade, Arcade–Rhythm, Restaurant–Lock and Key, Restaurant–Garden, each arrow in its door's corner (out
  right, in left; up top right, down bottom left). No page errors. QA's old door findings are closed. Owner: none.
- DONE by QA (QA findings: pass). WAITING ON QA (ROOMS's message): recheck QA's old door findings (doors.js in full) and walk the moved doors live.
- QA, every door pair after ROOMS's fd80c50 (on f21855d, `doors.js` LOGIC; `shots/doors_f21855d.txt`): pass. All 36 pairs follow Cal's
  left/right rule; the only flag is the Mall–Karaoke pair, the shortcut that shows only in saves without Bowling (not next to each
  other in the building, by design). The Nightclub has no doors (bought from the street). Owner: none.
- QA, the writing pass round 3 (LEAD's a0f2c8b, ROOMS's a646e51; on b0534bc, `voice.js`): done. 1,353 lines, 0 break a rule; the six
  joke endings now plain detail, "colour" fixed, the Squat Rack and drake pet plain. `voice.js`'s "meets" rule now only matches the
  "X meets Y" slogan VOICE.md bans (LEAD's false positive). Owner: none.
- DONE by QA (QA findings: 0 rule hits). WAITING ON QA (LEAD's and ROOMS's messages): re-run voice.js on a0f2c8b and a646e51, the last writing lines.
- QA, ROOMS's e74cf92 (on 5048cae; `voice.js`, `livebuilding.js`; `docs/QA.md`; `shots/voice_5048cae.txt`): the DJ passes (at the
  decks in 9 of 12 and 5 of 12 looks, was 3). Writing: `voice.js` finds 4 (was 5): Gaming Desks 99 characters, the Mall fountain's
  "Everyone meets here." (ROOMS), the Squat Rack's "boss" and the drake pet's "next level" (LEAD). By ear, six lines still end on a
  joke: Prize Counter, Score Screens, Lyric Screen, Song Kiosk, VIP Booth, Speaker Stacks (quoted in QA.md); the LED Dance Floor
  says "color" (VOICE.md: "colour"). No page errors. Owner: ROOMS (6 lines, 2 rule hits, spelling), LEAD (2 rule hits).
- QA, the Nightclub round 2 (1eb0bbc) and the team in their rooms (abb6513), on 8f1498d (`roomreview.js`, `livebuilding.js` now
  takes TEAM=, new `teamrooms.js`; `docs/QA.md`; `shots/review2_club_*.png`, `team_*.png`). Team: pass; all five stand in their homes
  (Sable the Lair, Mara the Restaurant, Rafe Lock and Key, Nova the Mall, Theo the Theater) with a ring and a name tag, and only the
  joined ones show. Nightclub: one floor on one grid, the bartender works, guests sit in the VIP booths; small: the DJ is at the
  decks in only 3 of 12 looks (he wanders); otherwise ready for Cal. No page errors. Owner: ROOMS (the DJ).
- DONE by QA (QA findings: team pass; club ready but the DJ wanders). WAITING ON QA (ROOMS's message): the Nightclub notes (one floor, a DJ and a bartender) and abb6513, the team in their home rooms.
- QA, design review of the Nightclub (step 16, fd0da20, on 867bc30, at 22:00; `roomreview.js` and `livebuilding.js` now take HOUR,
  `docs/QA.md`; `shots/review_club_*.png`): reads as one club (VIP left, bar and DJ at the back, the dance floor in the middle,
  the entrance front-right), nothing outside or overlapping, and live guests fill it in about 16 s and use the floor, tables, bar,
  VIP and podium. 2 notes: (1) no staff at all (no bartender, no DJ though the room says "Calibur on the decks", no bouncer, no
  coat-check clerk); (2) the dance floor's four tiles do not line up (a step in the middle seam). No page errors. Owner: ROOMS.
- QA, ROOMS's 6962a6e, the Karaoke booth (on 372346f; `roomreview.js`, `livebuilding.js`; `shots/review4_karaoke_full.png`): pass, ready
  for Cal. The Private Booth is a nook in the front corner behind a low pink partition. No page errors. Owner: ROOMS (to Cal).
- DONE by QA (QA findings: pass, ready for Cal). WAITING ON QA (ROOMS's message): the Karaoke Private Booth behind a partition in the front-right corner.
- QA, Bowling and VR round 2 (934bb37) and the Karaoke design review (db8a46d), on 6d88259 (`roomreview.js`, `livebuilding.js`,
  `doors.js`; `docs/QA.md`; `shots/review3_*.png`): Bowling and VR closed, ready for Cal (clerk and cook work live, the STRIKE
  screen over the approach end, the VR pairs apart). Karaoke reads as one room (lounge left, stage under the lyric screen, kiosk and
  tambourines at the stage), doors on Cal's rule, live works; 1 note: the "Private Booth" is an open L-sofa mid-front, a second
  lounge: tuck it into the front-left corner behind a low partition or curtain, or drop it. No page errors. Owner: ROOMS.
- QA, step 13 round 2 (5a33727) and the Bowling Alley's design review (922bcb7), on 551ac4a (`roomreview.js`, `livebuilding.js`,
  `doors.js`; `docs/QA.md`; `shots/review2_*.png`, `review_bowling_doors.txt`): the Rhythm Room is ready for Cal; the VR Arena is
  ready (clerk works live) with one small note (each side pair of rigs still touches in the picture, half a tile apart). Bowling
  reads as one alley, doors on Cal's rule, live works; the lane seats are fine where they are (a side bench looking across the
  approach, since the art cannot face the pins). 2 notes: no clerk at the shoe counter or the snack bar; the STRIKE! sign hangs
  far from the lanes (score screens belong above the lane ends). No page errors. Owner: ROOMS.
- QA, design reviews of step 13 (e2d53e1, on cbc2535; `roomreview.js` and `livebuilding.js` now take ROOM=<type>, `retired.js`;
  `docs/QA.md`; `shots/review_rhythm_*.png`, `review_vr_*.png`). Rhythm Room reads as one music room, live play works; 3 notes: the
  spectator bench has its back to the dancers; the Speaker Tower hides the drum kit and the keyboard; the trophy case floats
  mid-floor. VR Arena zones are right and the Second Pod is retired cleanly; 2 notes: the rigs bunch as feared (four touching in
  about three tiles: give each its own pad, the treadmill alone in the middle); the check-in desk has no clerk and live a guest
  fades in behind it at the back wall. No page errors. Owner: ROOMS.
- QA, ROOMS's b3832fb, the Arcade round 2 (on 25b5cb8; `arcadereview.js`, `livebuilding.js`, `doors.js`; `shots/review_arcade2*.png`,
  `review_arcade2_doors.txt`): pass, ready for Cal. Entrance and hoop spot clear, the prize clerk works live behind the counter, all
  four Arcade door pairs follow Cal's rule, the lobby sofa is clear of the box office. No page errors. Owner: ROOMS (to Cal).
- DONE by QA (QA findings: pass, ready for Cal). WAITING ON QA (ROOMS's message): the Arcade fixes (sticker booth, prize clerk live, Rhythm and VR doors) and the lobby sofa.
- QA, round 3 (5e3a780) and the Arcade's design review (cb5f568), on eb04985 (`theaterreview.js`, `audreview.js`, `arcadereview.js`,
  `livebuilding.js`, `doors.js`; `docs/QA.md`; `shots/review_theater3.png`, `review_aud3_full.png`, `review_arcade*.png`): the Theater
  lobby and the Auditorium are closed and ready for Cal (sofas on the back wall, the landing lit along its edge; small: the right
  sofa touches the box office). The Arcade reads as one planned arcade, calm shell, every machine faces its player, live play
  works. 3 notes: (1) the entrance mat is squeezed between the prize counter and the sticker booth and guests bunch there; (2) the
  sticker booth stands in the hoop shot's throwing spot; (3) the prize counter has no clerk. Doors: Arcade–Rhythm and Arcade–VR
  miss Cal's rule (for those steps). No page errors. Owner: ROOMS.
- QA, review round 2 of the Theater lobby (9279c58) and the Auditorium (392ca5c), on 8ca77d1 (`theaterreview.js`, `audreview.js`,
  new `livebuilding.js`; `docs/QA.md`; `shots/review_theater2*.png`, `review_aud2_*.png`): lobby 5 of 6 fixed, Auditorium 3 of 4.
  Live at last (characters exist only inside a building's view; a room opened from the street is empty): the ticket line forms at
  the box office inside the ropes, clerk, concession staff and bartender work, guests reach at the snacks and go in at SCREEN 1. Open:
  (lobby) the two sofas sit side by side mid-floor facing the viewer, the right one on the carpet's edge, unused: group them in a
  corner or drop them; (Auditorium) the back landing is barely lighter and its low wall barely shows: add a lit edge or a rail.
  No page errors. Owner: ROOMS.
- DONE by QA (QA findings: lobby 5 of 6, Auditorium 3 of 4). WAITING ON QA (ROOMS's message): review round 2 of the Theater lobby (9279c58) and the Auditorium (6c47f1b).
- QA, LEAD's 7ebf618, the Auditorium's gate (on 6320575, `rigtest/qa/audgate.js`): pass. At level 39 with the story up to the
  Theater: booth and popcorn only, no scene and no Auditorium; three other lobby upgrades, none; booth, popcorn and soda, the
  Auditorium scene comes and its yes opens the room; afterwards "Open the Auditorium" (`t_aud`) is owned and not for sale. No page
  errors. Owner: none.
- DONE by QA (QA findings: pass). WAITING ON QA (LEAD's 871e0d8, "to QA"): check 7ebf618, the Auditorium opens free once the lobby has its basics.
- QA, design review of the Auditorium as it stands (on 1bb17be; `audreview.js`; written out in `docs/QA.md`; `shots/review_aud_*.png`):
  one plan (screen on the back-left wall, rows facing it, projector opposite), nothing outside or overlapping bare, with the
  Bigger Screen and with IMAX; live the screen plays a film. 4 notes: (1) the projector's back landing does not read, it stands on
  open floor at the bottom right like the front of the room: give it a visible raised booth with a rail and steps; (2) bare, the
  projector is a film camera on a tripod (reads as filming); (3) the aisle steps climb to an empty back-right corner; (4) the
  right half and the floor behind the last row are empty. No page errors. Owner: ROOMS.
- QA, design review of the Theater lobby (4a7c0ff, on 36706e5; `theaterreview.js`, `guests.js`, `retired.js`; written out in
  `docs/QA.md`; `shots/review_theater*.png`): the idea reads (mat -> carpet -> doors, rope line to the box office), nothing outside,
  no guest spot inside furniture, the trailer screen and poster panel show live. 6 notes: (1) the concession row stands mid-floor
  and squeezes the carpet against the ropes: put it on the left wall facing the carpet; (2) the bar is split (taps bar at the mat,
  liquor wall far right): one bar; (3) a blank gold frame stands in front of the liquor wall; (4) one lone sofa in the back-left
  corner; (5) hot dog and nachos barely show behind the counter (ROOMS asked): they should be seen; (6) the bins lead the picture at
  the front edge. Not verified: the ticket line and snack trips live (no guests appeared in QA's test copy). No page errors.
  Owner: ROOMS.
- QA, ROOMS's c829e7e, Mall round 3 (on 0da598f; `mallreview.js`, `karaokeorphan.js`, `karaokeshortcut.js`; `shots/review_mall3*.png`):
  pass. The landing has a stone edge and a glass rail with brass posts; the Karaoke shortcut shows only while Bowling is not owned
  (Mall "Karaoke" top right, Karaoke "Mall" bottom left, walked both ways) and is gone once it is. All Mall notes closed: ready for
  Cal. No page errors. Owner: ROOMS (to Cal).
- DONE by QA (QA findings: pass, ready for Cal). WAITING ON QA (ROOMS's message): check c829e7e, the Mall landing and the Karaoke-without-Bowling doors.
- QA, Mall round 2 (ROOMS's 0eb00c2, on af14361; `mallreview.js`, `doors.js`, `retired.js`, `karaokeorphan.js`; `docs/QA.md`;
  `shots/review_mall2*.png`, `review_mall2_doors.txt`): 3 of 4 fixed, 1 half, 1 edge case. The directory is retired (5 retired pieces,
  clean); Karaoke is upstairs from Bowling and the Theater's storefront rolls up; every Mall pair and Bowling–Karaoke now follow
  Cal's rule, and every arrow walks. Half: the escalator meets the landing, but the landing reads as flat colour bands, not a
  floor with a rail. Edge case: a save owning Karaoke but not Bowling has no arrow into Karaoke, and Karaoke shows no arrows;
  keep a Mall–Karaoke arrow while Bowling is not owned. No page errors. Owner: ROOMS.
- QA, ROOMS's c8eb716, the Rooftop bar (on d916e6b, `openair.js`; `shots/review_rooftop3.png`, `review_rooftop_bar3.png`): pass.
  One straight counter, four stools, the back bar the same length one tile behind it with an aisle. All six design-review notes
  are closed: the Rooftop and Lock and Key are ready for Cal. No page errors. Owner: ROOMS (to Cal).
- DONE by QA (QA findings: pass, ready for Cal). WAITING ON QA (ROOMS's message): check c8eb716, the Rooftop bar repainted (the last design-review note).
- QA, design review of the Mall (322760a, on cb6fdb3; `mallreview.js`, `retired.js`, `screenlive.js`, `doors.js`; written out in
  `docs/QA.md`; `shots/review_mall*.png`, `review_mall_doors.txt`): checks pass, 4 notes. It reads as one atrium (stores round the
  fountain, seating left, food front-right). (1) The Directory Screen is garbled: it is the restaurant menu with prices by each
  store, too narrow (names run into prices), its top lines above the picture's edge, and blank about 7 s in 8; list stores and
  where they are, no prices, wider and inside the wall, or drop it. (2) The Karaoke door is a closed shutter even fully bought.
  (3) The escalator climbs toward a ground-floor opening and ends in mid-air. (4) All four Mall door pairs still miss Cal's
  left/right rule, and Karaoke is not next to the Mall in the building. No page errors. Owner: ROOMS, then Cal.
- QA, design review round 2 on ROOMS's d95d880 (no QA line was posted; on 2df050f; `docs/QA.md`; `shots/review_rooftop2.png`,
  `review_lockkey2.png`): Lock and Key, all 3 notes fixed, ready for Cal. Rooftop, 5 of 6 fixed (pool back by the DJ, loungers at
  its end facing the water, the hot tub clear of the step by the cabana, the stairs arrive clear, smaller flamingo and tub). Still
  open: the back bar sits behind only the right half of the counter with no aisle; centre it. Doors, retired pieces (Rooftop 4,
  kept and not drawn) and old saves pass; no page errors. Owner: ROOMS (the bar), then Cal.
- QA, design review (Cal's new step) of the Rooftop (ea2dffc) and Lock and Key (on 3cdf263; written out in `docs/QA.md`, "Design
  reviews"; `shots/review_rooftop*.png`, `review_lockkey.png`). Rooftop: a real plan now, 6 notes: (1) the hot tub sits on the
  pool's only step; (2) the loungers float in the walkway from the stairs, a tile or two from the pool: line them on its front
  edge; (3) the stairwell comes up into the parasol table's chairs: give it a clear tile, or drop the parasol table (four seating
  zones on one roof); (4) the back bar is behind only half the counter with no bartender aisle; (5) the pool floats mid-deck with
  an empty strip behind it; (6) the flamingo is a third of the pool, the hot tub nearly as wide as the pool. Lock and Key reads as
  one planned room, 3 notes: (1) a front-door mat on the front-right edge where there is no door (people arrive Downstairs,
  front-left): remove it or move it there; (2) the humidor floats alone between high-tops: put it at the bar's end or in the
  lounge; (3) a high-top crowds the roof stairs. The usual checks pass for both (doors, nothing outside, retired pieces, no page
  errors). Owner: ROOMS, then Cal.
- QA, ROOMS's fb8149a, the Rooftop in zones (on 2418999, port 8770, `retired.js` ROOM=rooftop, `openair.js`, `skybarshell.js`;
  `shots/rooftop_zones_noon.png`, `rooftop_stairwell_night.png`): pass. The way down is a painted stairwell at the front-left edge
  with a gap in the glass rail; the front-right edge has its glass rail; Roof and Bar walk both ways. More Loungers, the Towel
  Station and the Ice Cream Cart are retired: a new player gets no card for them, a save that owns them keeps all 3 ids and
  nothing more is drawn; the one pair of loungers faces the pool clear of its step, the shower stands by the right rail; nothing
  outside the room, at noon and 10 pm. `retired.js` now checks retired pieces in any room. No page errors. Owner: none.
- QA, a quick look at ROOMS's 5ddeb1a (no QA line was posted; it answers QA's sky note; on 17e5851, port 8770,
  `openair.js` with HOURS; `shots/openair_sky_by_hour.png`): pass. The Sky Patio and the Rooftop Bar, fully bought, at 7:00, 13:00,
  18:00 and 22:00: dawn colours at 7, a blue sky with the sun at noon, deep blue with a moon and lit windows at 18 and 22 (the
  game follows the real Los Angeles sun, which sets before 17:00 in November); the furniture dims with it; nothing outside the
  rooms. The Rooftop notes from 98599c3 (no visible way down, no rail on the front-right edge) still stand. No page errors.
  Owner: none.
- QA, ROOMS's 707cac1 (on 52e194f, port 8770, `lockkeylounge.js`, `skybarshell.js`, `band.js`, `openair.js`; `shots/lockkey_lounge3.png`,
  `rooftop_deck_bare.png`, `rooftop_deck_full.png`): Lock and Key passes; the Rooftop deck passes with 2 notes. Lock and Key (Cal's
  redo): the Chesterfield and the Champagne Trolley are retired: a new player gets no card for them, an owner keeps both ids and
  neither is drawn; the lounge is the green sofa and its table, the piano stands by the band stage, nothing outside or
  overlapping, with or without the old pieces; doors, band and old-save checks pass. Rooftop: the painted travertine deck and the
  sandstone parapet (`rfw_t1`) draw bare and fully bought, at noon and 10 pm, nothing outside; Roof and Bar walk both ways. Notes:
  (1) the way down has nothing to see: the "Bar" door on the front-left edge shows no glow, stair or hatch under the glass rail,
  only the arrow; (2) the front-right edge has no rail at all, an open drop, while the front-left has glass. The sky still shows
  dusk at noon and 10 pm (ROOMS: next). No page errors. Owner: ROOMS.
- DONE by QA (QA findings and docs/QA.md: Rooftop 6 notes, Lock and Key 3). WAITING ON QA (Cal, 2026-11-05: "Please send any rooms to QA for further notes and analysis before coming back to me for
- DONE by QA (QA findings: DJ pass; writing 4 rule hits, 6 jokes). WAITING ON QA: the writing pass at e74cf92 (re-run voice.js; every room and upgrade line in ROOMS's files should now be one
  concrete detail with no tag line, and no "!" in room help titles; the bowling STRIKE! sign stays), and the Nightclub DJ
  (the spot now in front of the decks, longer shifts).
- DONE by QA (QA findings, 5ed2375: floor and bartender pass, the DJ wanders). WAITING ON QA: the Nightclub's two notes at 1eb0bbc (one dance floor on one grid; a DJ at the decks and a bartender behind
  the bar, staff on cb_dj and cb_bar), and the team in their rooms at abb6513: with a member joined (S.story.team), they
  stand in their home room (Mara Restaurant, Rafe Lock and Key, Nova Mall, Theo Theater, Sable Lair) in their own look
  with a ring in their colour and a name tag. ROOMS saw Mara, Rafe and Nova live in the building view.
- DONE by QA (QA findings: 2 notes). WAITING ON QA: a design review of the Nightclub at fd0da20 (step 16): a new painted shell; the layout as it was (VIP booths
  behind ropes on the left wall, the bar and DJ booth at the back, the dance floor in the middle with cocktail tables, the
  entrance with rope, photographer and coat check at the front right; its own lot, so the street mat stays).
- DONE by QA (QA findings: Bowling and VR ready, Karaoke 1 note). WAITING ON QA: Bowling's notes and the VR rig spacing at 934bb37 (clerks at the shoe counter and snack bar, the STRIKE
  screen over the lanes' approach, the rig pairs half a tile apart), and a design review of Karaoke at db8a46d (step 15):
  painted shell, the tambourines at the stage, no street mat (guests arrive at the Bowling stairs).
- DONE by QA (QA findings: Rhythm and VR ready, Bowling 2 notes). WAITING ON QA: round 2 of the Rhythm Room and VR Arena at 5a33727 (your five notes), and a design review of Bowling at
  922bcb7 (step 14): painted shell, the snack bar and table off the lanes' approach in the front-right corner, the Karaoke
  door off the lanes on the free back wall, no street mat (guests arrive at the Mall door). Lanes, ball return, console
  and seats unchanged. ROOMS's worry: the lane seats face sideways (the art only faces the viewer).
- DONE by QA (QA findings and docs/QA.md: Rhythm 3 notes, VR 2). WAITING ON QA: design reviews of the Rhythm Room and the VR Arena at e2d53e1 (step 13), bare and fully bought, live from
  inside the Mall building: painted shells, the Pulsing Floor now only under the dance pads, the Second Pod retired, no
  street mats (guests arrive at the Arcade doors). ROOMS's worry: the VR rigs still bunch in the middle-right.
- DONE by QA (QA findings: lobby and Auditorium ready for Cal; Arcade 3 notes). WAITING ON QA: round 3 of the Theater lobby and Auditorium at 5e3a780 (the sofas, the landing edge), and a design review of
  the Arcade at cb5f568 (painted shell with a calm carpet; the machines as they were: cabinets on the back wall, racing and
  skee-ball left, claws and hoops right, air hockey in the middle, snacks and prizes at the front). Use livebuilding.js.
- DONE by QA (QA findings, 8df07f1: lobby 5 of 6, Auditorium 3 of 4). WAITING ON QA: design review round 2: the Theater lobby at 9279c58 (your six notes) and the Auditorium at 392ca5c (your
  four notes: the back landing, the bare projector, the steps ending at an EXIT, the empty right side). About guests: the
  lobby's ticket buyers come from the room's guest count like other rooms (`thGuest` takes over once one spawns); ROOMS
  has not traced why none spawned in your copy.
- DONE by QA (QA findings and docs/QA.md: 4 notes). WAITING ON QA: a design review of the Auditorium (step 11) as it stands at 3057c61, bare and fully bought (Bigger Screen,
  then IMAX). ROOMS's read: one plan already (screen on the left wall, towers either side, rows stepping up toward the
  back, the projector on the raised back landing beaming over the seats; the camera draws the back landing bottom right,
  so it can read as "front"). Say what you would change; ROOMS fixes it before Cal sees it.
- DONE by QA (QA findings and docs/QA.md: 6 notes; guests not seen live). WAITING ON QA: a design review of the Theater lobby at 4a7c0ff (step 10), bare, with the basics only (t_booth1, t_pop,
  t_soda) and fully bought with the lobby expanded: zones, facing, anything hidden (the hot dog and nachos now stand on a
  back counter behind the stand), the guest line and the snack trips still walking right. Also the Mall fixes at c829e7e.
- DONE by QA (QA findings: 3 of 4, the landing half, a Karaoke edge case). WAITING ON QA: Mall design review round 2 at 0eb00c2: your four notes (directory retired; Karaoke now upstairs from
  Bowling, so the left wall's back storefront is the Theater's way through and rolls up once the Theater is open; the
  escalator reaches a painted upper landing; every Mall door pair on Cal's rule). Check the doors both ways with the
  Theater, Arcade, Bowling and Karaoke open, and a save that already owns Karaoke without Bowling.
- DONE by QA (QA findings and docs/QA.md: checks pass, 4 notes). WAITING ON QA: a design review of the Mall at 322760a (Cal: rooms go to QA for notes before him), bare and fully bought,
  noon and night: one planned space? every piece facing its use? the shop fronts sitting right in their storefronts? the
  Directory Screen's text (it cycles; it looked garbled in a still)? walkways from the Theater door (front-left) and the
  Arcade door (front-right)? anything doubled or random? Plus the usual checks (4 retired ids, old saves, doors).
  my opinions"): a design review, not only the usual checks, of the Rooftop at ea2dffc and Lock and Key at 707cac1. For
  each room: does it read as one planned space; does every piece face where it is used; is anything doubled, random,
  floating or oddly sized; are the walkways and sight lines clear; what would you change. Cal on the Rooftop before
  ea2dffc: the pool should turn 90 degrees, the DJ faced the side, "the two bars on the top are weird", "it just feels like
  they are placed randomly". ROOMS fixes the notes, then shows Cal. Screens at noon and at night, fully bought and bare.
- DONE by QA (QA findings: pass). WAITING ON QA: check fb8149a (rule 17, small check): the Rooftop fully bought, at noon and at night. The loungers clear
  of the pool steps, the shower by the right rail, no ice cream cart, towel station or second loungers drawn (owners keep
  the ids, no card for new players); a stairwell with a gap in the glass at the Bar door (front-left edge) and the Bar
  arrow walks down; glass rail on the front-right edge; nothing outside the deck. ROOMS's headless pass: no page errors.
- DONE by QA (QA findings: pass, 2 Rooftop notes). WAITING ON QA (ROOMS's message): check 707cac1, Cal's Lock and Key lounge redo and the Rooftop's painted deck.
- QA, ROOMS's 64e98bc, the Lock and Key lounge table (on ee34dbc, `band.js`, `skybarshell.js`; `shots/lockkey_band4.png`,
  `lockkey_lounge2.png`): pass, one optional note. The table is out from under the green sofa and clear of the Chesterfield; doors,
  band and old-save checks still pass. Note: the corner stays tight: the green sofa's right foot just meets the table's rim, and
  the piano lid's tip reaches the table's front legs; dropping the lounge table, or a smaller one, would give the corner air.
  No page errors. Owner: ROOMS (optional).
- DONE by QA (QA findings: pass, 1 note). WAITING ON QA (ROOMS's message): check 64e98bc, the Lock and Key lounge table.
- QA, ROOMS's 1f2cfa9 and 73a426a (on fa536b1, port 8770, `band.js`, `skybarshell.js`, `openair.js`; `shots/lockkey_band3.png`,
  `lockkey_lounge.png`, `patio_noon.png`, `patio_night.png`, `rooftop_night.png`): the piano and the open-air rooms pass, one new
  fix. The piano has its own space front middle, clear of the bar, the Chesterfield and the band stage; Downstairs at FL 2.2 is
  clear; every door walks; the band checks pass; a save owning all 16 upgrades keeps 16. The Sky Patio and the Rooftop Bar, bare
  and fully bought, at noon and 10 pm: no dark triangle over the sky, the tint stops at the rail. FIX (Lock and Key): with the
  lounge moved left, the glass lounge table now sits half under the green sofa (the sofa is drawn over it) and the Chesterfield's
  back runs into its legs; move the table a step forward, between the sofa and the Chesterfield. Note: the open-air rooms' sky
  is the same dusk picture at noon and at 10 pm (only the furniture dims); if they should follow the time like the street
  does, that is a separate change. No page errors. Owner: ROOMS.
- DONE by QA (QA findings: pass, the lounge table now under the sofa). WAITING ON QA (ROOMS's message): check 1f2cfa9 (the piano's own space, Downstairs at FL 2.2) and 73a426a (no dark
  triangle over the sky in the open-air rooms; the Patio).
- QA, ROOMS's b19a578, the piano turned (on e97c431, `band.js`; `shots/lockkey_band2.png`, `lockkey_piano2.png`): half fixed. The
  lid now opens away from the bar and is clear of the stools and the foot rail, and its bench clears the band stage; the band
  checks still pass. But the piano now presses into the lounge on its other side: its curved body runs into the glass lounge
  table and the Chesterfield's right arm. The bar, lounge and piano are three pieces in about two tiles; the piano needs a clear
  tile of its own (for example toward the front middle between the Chesterfield and the band stage, or drop the lounge table
  a tile left). No page errors. Owner: ROOMS.
- DONE by QA (QA findings: clear of the bar, now against the lounge). WAITING ON QA (ROOMS's message): check b19a578, the grand piano turned away from the bar.
- QA, ROOMS's fe48618, Lock and Key's Friday Band (on c5073e8, port 8770, `rigtest/qa/band.js`; `shots/lockkey_jazz.png`,
  `lockkey_band.png`, `lockkey_piano.png`): pass, one small fix. The Friday Band is not for sale until the Jazz Corner is owned,
  then it is; bought, the mic stage leaves the picture and the bigger band stage (drums, double bass, mic) takes the front
  corner, nothing outside the room and nothing overlapping it, clear of the door mat and the high-tops; One More High-Top adds
  one table (3 in all with High-Top Tables). FIX (small): the grand piano still touches the bar: its raised lid lies over the
  last stool's legs and the brass foot rail; move it another step toward the front, or turn the lid away from the bar. No page
  errors. Owner: ROOMS.
- QA, ROOMS's Lock and Key, the Upstairs Bar (4599993, on 3348c7b, port 8770, `rigtest/qa/skybarshell.js`; `shots/lockkey_bare.png`,
  `lockkey_full.png`): pass, one small note. The painted brick-and-walnut shell (`skw_t1`) draws bare and fully bought (17 pieces),
  nothing outside the room; the painted stairway sits at the back wall's far right end with the Roof glow at its foot, clear;
  Downstairs glows at the front-left edge, clear of the sofas; the walk Lock and Key -> Downstairs (bottom left) -> Restaurant ->
  Upstairs -> Lock and Key -> Roof (top right) -> Rooftop Bar -> Bar (bottom left) -> back all lands right, as Cal's rule wants;
  the back bar stays under the wall top; a save owning all 15 upgrades (retired ones too) keeps all 15. Note: the grand piano
  stands tight against the bar's front end, its lid up against the last stool; a tile further from the bar would read better.
  No page errors. Owner: ROOMS (optional).
- QA, ROOMS's ef0ecc8 (on 3421dca, port 8770, `bobashell.js`, `dessertshell.js`, `speakretired.js`; `shots/boba_full4.png`,
  `dessert_full3.png`): pass. Both front-door mats are clear: the Shaker Station stands beside the pickup shelf and the Macaron
  Tower beside the Cake Stand; nothing outside either room; every door walks. The old Speakeasy opener (`de_secret`) is retired:
  a new player with the Dessert Parlor fully bought sees no card for it and no Hidden Door arrow; a save that already owns the
  Speakeasy keeps it, and the Hidden Door still leads there. No page errors. Owner: none.
- DONE by QA (QA findings: pass). WAITING ON QA (ROOMS's message): check ef0ecc8, the mat fix and the retired Speakeasy upgrade.
- QA, ROOMS's 23f993d (on b325eba, port 8770, `bobashell.js`, `dessertshell.js`, `menuscreen.js`; `shots/boba_full3.png`,
  `dessert_full2.png`, `boba_menuscreen.png`): on the floor now, one fix. Nothing stands outside either room any more, the doors
  all walk, and the Dessert Downstairs glow sits clear at the left end of the front-left edge. The Boba Menu Screen is fine live:
  sampled every half second for 8 seconds it showed the drinks list (Milk Tea, Mango, Brown Sugar, Taro, Lychee, Oolong with
  prices) every time; the black was only the still render. FIX (both rooms): the Shaker Station (Boba) and the Macaron Tower
  (Dessert) now stand on the front-door mat, half covering the entrance; move each a tile back from the mat (Boba: toward the
  pickup shelf; Dessert: toward the Cake Stand). No page errors. Owner: ROOMS.
- QA, v0.49's published copy (rule 18, LEAD's 1d4d878; artifact 7336ed4a, version 1793937460-7d59), read-only: pass. 439 files
  against the 438 of a clean build of 8fabe1a: 437 match by sha256; `index.html` differs only by its title ("Quest Board v0.49
  (test, fresh start)", exactly the 26 extra bytes); `lfvar.json` is the page-only file HANDOFF.md says to keep, the same size
  and sha256 as in v0.48. Nothing from the build is missing. Its database holds 2 documents (1.4 KB), so nothing near a played
  save; QA did not read them (probably the first open's save and its backup). Owner: none.
- QA, ROOMS's f0c6dbb, the Dessert Parlor and the Boba fixes (on 4b1c78b, port 8770, `dessertshell.js`, `bobashell.js`;
  `shots/dessert_bare.png`, `dessert_full.png`, `dessert_downstairs.png`, `boba_full2.png`): the shells and doors pass, 2 pieces
  now stand off the floor. Pass: the Dessert Parlor's painted shell (`dsw_t1`) bare and fully bought, the tall painted bookcase
  on the right wall with the Hidden Door's glow at its foot, clear; the walk Dessert -> Downstairs (bottom left) -> Boba ->
  Upstairs -> Dessert -> Hidden Door (top right) -> Speakeasy -> back all lands right. Boba: the stairs are clear, the window
  bench sits under the window, clear of the side door. FIX 1 (Boba): the Shaker Station moved to the front-right corner and now
  hangs off the floor's edge (audit: `bbx_shake` outside the room); put it on the floor by the pickup shelf. FIX 2 (Dessert): the
  Macaron Tower (`dsx_tower`) stands on the front-right edge, half off the floor; move it in a tile. Notes: the blue cafe chair
  stands right beside the Downstairs glow on the front-left edge; the speakeasy's way back ("Dessert") is on its front-right
  edge, where Cal's rule wants the front-left (for the speakeasy step); the Boba Menu Screen is black in a still picture (ROOMS:
  it cycles pages), not checked live. No page errors. Owner: ROOMS.
- QA, ROOMS's Boba shop c223d89 (on 6896d2a, port 8770, `rigtest/qa/bobashell.js`; `shots/boba_bare.png`, `boba_full.png`,
  `boba_stairs.png`, `boba_sidedoor.png`): the shell and the doors pass, 2 placement fixes and 1 note. Pass: the painted shop
  (`bbw_t1`) draws bare and fully bought, nothing outside the room; the side door walks both ways (Boba's "Garden" arrow top
  left, the Garden's "Boba Shop" arrow bottom right: out on the right, in on the left), and "Upstairs" reaches the Dessert
  Parlor; the Neon Cup Sign hangs high over the tea jar shelf. FIX 1: fully bought, the shaker station (the pink cabinet with the
  cup stack and the blender) stands right in front of the painted stairs and hides their glow; move it left along the wall,
  clear of the doorway. FIX 2: the window seat's left end runs across the side door to the Garden (the green glow shows under
  the bench); shorten it or move it right. Note: the Menu Screen on the back wall is a blank black panel; give it the menu
  (like the Restaurant's screen) or art. No page errors. Owner: ROOMS.
- DONE by LEAD (published as v0.49, 7336ed4a). QA, v0.49's pre-release check (rule 18 step 2, 8fabe1a, APPV 49; `shots/v49/`): pass, ready to publish. savecheck.js: every case
  passes (newest wins, no needless question, device only, someone else's save ignored, levels 8, 30 and 60 kept, a new player
  starts clean). screens.js at 360 and 390 px: every tab and a room window fit, no page errors. A brand-new player: the
  character screen, then the Board, v0.49 on desktop and phone. A new save to the Restaurant (`sim.js`, `unlocks.py`): 12-task
  The Loft day 1, Hall 3, Garden 4, Wheel 5, Mara 6, Knock Through bought and the Restaurant open on day 7, Relics 7; casual The
  Loft 2, Hall 5, Garden offered 6 and built 9 (1,500 coins), Wheel 9, Mara 10, Relics 11, the Restaurant day 12; the beds
  watered every day and never dry, produce sold at the stand; one unlock a day (day 5 of the 12-task run also has the closet
  they buy). Real taps: both stands sell once; the watering can waters on and beside it at every stage, desktop and phone;
  Knock Through is a mystery card until Mara's yes, then for sale. Shop check (`shopcheck.js`): 44 checks pass. Trophy Room
  passes. Doors: the Garden and Restaurant pair passes; the 10 Plaza and Mall pairs that miss Cal's left/right rule are the
  same as in v0.48 (ROOMS's list, not new). No page errors anywhere. Owner: LEAD (publish).
- DONE by QA (QA findings: pass, ready to publish). WAITING ON QA (LEAD's message, rule 18 step 2): the pre-release check of v0.49 (8fabe1a): savecheck.js, screens.js,
  a new save from level 1 to the Restaurant, and what changed since v0.48.
- QA, LEAD's 912f32c (on b8742cd; `sim.js`, `unlocks.py`, `water.py`; `shots/unlocks_water_b8742cd.txt`): pass. (1) Early unlocks in
  their own level's order, one a day: 12-task The Loft day 1, Hall 3, Garden 4, Wheel 5, Mara 6, Relics 7, Boba 9, Dessert 10 (day
  4 also has the closet the player buys); casual The Loft 2, Hall 5, Garden 6, Wheel 9, Mara 10, Relics 11. No played day without
  something to buy. (2) Sprinklers at the Estate for 6,000: the 12-task player can buy them on day 44 (waterer) or 45 (forgetter),
  the casual player not by day 45 (level 32). Over 50 days the forgetter (waters 1 day in 3) finds the beds dry on 28 days and
  sells 2,691 produce for 10,764 coins against the waterer's 6,400 for 25,600, and earns 384,471 against 405,103 (5% less);
  level (86 on day 45) and every upgrade (day 45 or 46) are the same, and Mara still comes on day 6 for both. So watering now
  costs real produce without slowing anything else. No page errors. Owner: none (Cal: the numbers for the watering habit).
- QA, ROOMS's 0b23996 and d1d7c73 (on ba6cf1c, port 8771; `citylights.js`, `restmenu.js`, `freshstart.js`; `shots/city_night_before.png`,
  `city_night_after.png`, `rest_noir_furniture.png`, `fresh_start_phone.png`): pass. The city's window patterns light 1, 4 and 2
  of 16 windows (were 10, 10 and 7), dimmer (mean opacity 0.45 to 0.65, was about 0.71), and the night picture is much calmer.
  Noir with White Linen sets black marble and brass tables with charcoal chairs; the Bistro keeps white linen and red chairs;
  the fire pit's chairs are clear of the deck rail. ROOMS's testing note ("new saves land on a locked Loft tab") is only their
  test setup: a real new player sees the character screen, then the Board, on desktop and phone. No page errors. Owner: none.
- DONE by QA (QA findings: pass). WAITING ON QA (LEAD's message): check 912f32c: early unlocks strictly by their own level; Sprinklers at the Estate, 6,000.
- QA, ROOMS's a9a572c and e415c00 (on 85f696a, `restshell.js`, `restmenu.js`, `cantap.js` with a real mouse; `shots/rest_patio_noir.png`,
  `rest_patio_diner.png`, `rest_patio_rail.png`): pass, one small note. The patio front reads fire pit left, the table under the
  pergola right, the sign in the gap (Corner Diner, Bistro, Noir); a low rail runs between deck and dining room with the gap at
  the door mat; Noir with the wine wall has no white cooler. The can's tap area: desktop 173 to 97 px, phone 61, 44 and 34 px
  (Back Plot, Kitchen Garden, Estate); a tap on the can and one 15 px beside it both water, at every stage on both screens. Note:
  the left Adirondack chair sits on the end of the rail. No page errors. Owner: ROOMS (optional).
- DONE by LEAD in 912f32c (Estate stage `g_x2`, 6,000 coins). CAL'S DECISION (2026-11-05, to QA, on the watering finding above): "Yes, much later": the Sprinklers (`g_spr`) move much later so
  watering stays a daily habit (QA suggested the Estate stage, or about level 40 with a big price). WAITING ON LEAD: move them,
  then WAITING ON QA and QA reruns the waterer and the forgetter. Owner: LEAD.
- QA, LEAD's three (on 3d65b70; `sim.js` now has WATER=daily|every3|never and NOBUY, `water.py`, `unlocks.py`; `shots/unlocks_3d65b70.txt`,
  `watering_3d65b70.txt`). (1) The slot by the unlock's own level, story first: pass. 12-task: Garden day 3, Mara 4, Hall 5,
  Wheel 6, Boba 7, Dessert 8, Relics 9 (plus the closet they buy); casual: Garden 5, Mara 6, Hall 9, Wheel 11, Relics 12; no other
  day with 2. Note for Cal: the Hall (town hall, class story) now waits behind the story: day 5 for the 12-task player, day 9
  for the casual one, shown as Soon for up to a week. (2) Watering: the rule works, but it barely matters. The 12-task player
  buys the Sprinklers (`g_spr`, 600 coins, least level 16) on day 4, the day after the Garden opens, and the casual player on day
  11 (Garden day 5); after that the beds water themselves. Over 50 days a daily waterer and a forgetter (1 day in 3) end the same
  (level 94, every upgrade day 44 to 45, earnings 403,585 and 403,497). With the Sprinklers held back for 20 days: daily 1,890
  produce sold (7,560 coins), forgetter 708 (2,832; dry on 11 of 18 days), never 67 (268); all earnings 92,908, 88,094 and
  84,869, so the Garden is about 8% of a 12-task player's coins and Mara still comes on day 4 for all three (the first day is
  pre-watered). If Cal wants watering to be a real daily habit, the Sprinklers need to come much later (the Estate, or level
  40 and a big price). (3) The Garden window words: pass on desktop and phone (empty lot next to your building, Knock through
  to a restaurant, 1 coin an hour, the payout on its own line). No page errors. Owner: LEAD (Cal's call on the Sprinklers).
- QA, ROOMS's 8a5ac99, 059bd45 and 82cc1f9 (on 8bb0422, `gardenlots.js`, `gardenwater.js` with a real mouse; `shots/garden_lots3.png`,
  `garden_dry.png`, `garden_wet.png`): pass, one note. Beds sit on the grid and the grow lights run along them; the Estate with
  the fountain has no sundial, birdbath or topiary; the scarecrow is by the left wall at every stage. At every stage dry beds
  look parched, one tap on the watering can waters for 24 hours, the beds turn damp and the window says so; Sprinklers keep them
  damp unwatered. The Back Plot stand is in (only 9% of it below the picture on desktop). Note: the can is a small target,
  61x55 px on desktop at the Back Plot down to 34x31 at the Estate, and 22x20 down to 12x11 px on a phone (a finger needs about
  44): give it a bigger invisible tap area. The window's Water button works either way. No page errors. Owner: ROOMS.
- DONE by QA (QA findings: pass; Sprinklers make watering moot, Cal's call). WAITING ON QA (LEAD's message): (1) the slot keyed on each unlock's own level, a waiting story step first (33e9721),
  rerun the early timeline; (2) watering (a2e234e): add a waterer and a forgetter to the economy run; (3) the Garden window
  words (6a1f7ab). Also ROOMS's 8a5ac99 (beds on the grid, grow lights, the Back Plot stand a tile in), a quick look.
- QA, a quick look at ROOMS's 73e48c3 (no QA line was posted; it answers QA's two notes; on 0c3e73c, `gardenlots.js`,
  `standtap.js` with a real mouse; `shots/garden_kitchen_full3.png`, `garden_stand_desktop.png`, `garden_stand_phone.png`): pass,
  one small fix each. The lamp post stands clear of the sundial, and the scarecrow is off the stone bed (in the back-left corner
  behind the tomatoes). Tapping either stand sells once (crate stand on the Back Plot, Farm Stand in the Kitchen Garden): coins up,
  produce to 0, a second tap sells nothing. FIX (ROOMS): on desktop the Back Plot's crate stand stands so far forward that 41%
  of it is below the bottom of the room picture, cut in half (on a phone it shows whole); move it back a tile. FIX (LEAD, text):
  the Garden window still says "A small plot behind the building" (the story calls it the empty lot next to your building) and
  "Build the Restaurant to put these to use" (it is Knock Through now); "1 coins/hr" should be "1 coin an hour"; on a phone that
  yellow line runs off the right edge. No page errors. Owner: ROOMS and LEAD.
- QA, LEAD's 4093cb9 (on 886b385; `day1areas.js`, `sim.js` 6 and 7 days, an in-page old-save test; `shots/unlocks_886b385.txt`):
  the fix works, one knock-on effect. A fresh save has board, train, shop and away; level 2 takes The Loft and the day's slot;
  the Hall at level 4 waits (Soon) for the next day. A level-20 save with no `S.areaOn` gets all 8 areas, none waiting. Knock-on:
  every early area now comes a day later, and they pile up on the day the player passes level 10. 12-task player: The Loft day 1,
  Hall day 3, then day 4 (levels 9 to 15) brings Wheel, Relics and the Garden at once (and the closet, which they buy). Casual:
  one a day (The Loft 2, Hall 5, Garden 6), but the Garden is now offered on day 6 at level 9, held by the trial at 10, with 555
  coins: the lot is 1,500 and the cheapest upgrade 600, so a played day with nothing to buy. Suggestion: tie the shared slot to
  the unlock's own level (areas and steps that open below level 10 share one a day, whatever the player's level), and let the
  story step go first when both wait, so the Garden is not pushed back by Wheel and Relics. No page errors. Owner: LEAD.
- DONE by QA (QA findings: works, 1 knock-on). WAITING ON QA (LEAD's message): check 4093cb9, S.areaOn made at load and at first creation (day one).
- QA, ROOMS's 29c09a7 (on f0dcdd1, `gardenlots.js`; `shots/garden_lots2.png`, `garden_kitchen_full2.png`,
  `garden_lamp_sundial.png`): pass, two small notes. (1) The wooden beds stand beside the painted stone beds now, none on top,
  at every stage. (2) The Kitchen Garden's front is spread out: hive and coop on the front-left strip, the shed by the tools,
  the pump by the trellis, the iron gate on the lot edge at the end of the walk. (3) The Grow Lamps are light frames over the
  beds, no more purple screens. The crate stand shows at the Back Plot's gate from a bare lot, and the Farm Stand at every
  stage. Notes for ROOMS, small: the lamp post by the arch stands inside the stone sundial (Kitchen Garden, front middle), and
  the scarecrow stands on the front stones of a painted bed, under a grow-lamp frame (Back Plot and Kitchen Garden). No page
  errors. Owner: ROOMS (optional).
- QA, the shared unlock slot (ddc2171, on 334c735; `sim.js`, `unlocks.py`, `day1areas.js`; `shots/unlocks_334c735.txt`): works,
  one small fix. Casual player: Wheel day 5, Garden day 6, Relics day 9 (level 11), Mara day 10, one a day. 12-task player:
  Wheel day 3, then day 4 goes 9 to 15, past level 10, so Relics and the Garden open together as designed (plus the closet,
  which the player buys), Mara day 5, Boba 9, Dessert 10. FIX (LEAD, small): day 1 still brings The Loft and the Hall. A new
  save has no `S.areaOn` until its first level-up, and `areaOn()` then marks every area up to the current level as already
  reached: at level 2 The Loft turns on with no card and no slot, and the Hall (level 4) takes day 1's slot. Make `S.areaOn`
  at character creation (level 1), so The Loft takes day 1 and the Hall waits for day 2; old saves keep what they have. No
  played day had nothing to buy; no page errors. Owner: LEAD.
- DONE by QA (QA findings: works, 1 small fix). WAITING ON QA (LEAD's message): rerun the first 10 days on ddc2171, one shared unlock slot a day below level 10.
- QA, the unlock timeline again on aa165b1 (on 52b50cf; `sim.js` now reads `S.areaOn` and the story offers each day, `unlocks.py`;
  `shots/unlocks_52b50cf.txt`): both fixes work. No level-up screen shows 2 New areas, and no day opens 2 story steps; after day 5
  every unlock arrives on its own day for both players (12-task: Boba 7, Dessert 8, closet 9, patio 12, game room 14, Lock and
  Key 19, Rafe 20, Rooftop 21, Lair 24, Mall 25, Theater 26, Nova 27, Auditorium 28, Arcade 29; casual: Restaurant 6, Boba 17,
  Dessert 23, closet 26). Still 2 or more on one DAY in the first five, because areas and story steps are paced separately and
  a new player levels several times a day: 12-task day 1 (The Loft at 2, Hall at 4), day 3 (Wheel and the Garden), day 4
  (Relics and Mara); casual day 2 (The Loft and Hall), day 5 (Wheel, Relics and the Garden: two level-ups that day). That meets
  Cal's words ("not multiple unlocks from 1 level"). If he wants one a DAY, share one daily slot between `areaReveal` and
  `styCheck` for the first week. No played day had nothing to buy; no page errors. Owner: LEAD (Cal's call on per day).
- DONE by QA (QA findings: both fixes work). WAITING ON QA (LEAD's message): rerun the unlock timeline on aa165b1: one New area per level-up, one story step a day.
- QA, ROOMS's 28a51ee (on 3124efd, `rigtest/qa/gardoors.js`; `shots/gardoor_restaurant.png`, `gardoor_garden.png`): pass. The
  building map puts the Garden right of the Restaurant (restaurant [1,0,0], garden [1,1,0], Boba [1,2,0]). At all 12 pairs
  (Back Plot, Kitchen Garden, Estate x Hole in the Wall, Corner Diner, Bistro, Noir) the Restaurant's "Garden" arrow (bottom right,
  the gap in the kitchen's end wall) and the Garden's "Restaurant" arrow (top left, the lit doorway in the back-left brick wall)
  walk both ways and come back to the same room. Out on the right, in on the left, as Cal asked. No page errors. Owner: none.
- QA, ROOMS's Garden lots (4725457, cd73831, 5fa3fec, on df5d7c3, `rigtest/qa/gardenlots.js`, 6 cases; `shots/garden_lots.png`,
  `garden_kitchen_full.png`): the lots pass, 3 placement fixes. Pass: each stage draws its own painting (`gdw_s0`, `gdw_s1`, `gdw_s2`),
  brick walls show with no hedge or glass fence over them, nothing stands outside the lot or pokes through a wall, and the
  Estate's walls end at the stone coping with a thin edge, no black band. Bare lots are clean. FIX 1, two kinds of beds: each
  painting has stone-edged beds, and the wooden raised beds stand half on top of them (Back Plot: the tomato and lettuce beds
  over the back stone bed; the same in the Kitchen Garden and the Estate). Put the raised beds exactly on the painted beds, or
  paint the lots without beds. FIX 2, the Kitchen Garden's front middle: the rose arch, chicken coop, beehive, iron gate, lamp
  post, scarecrow, solar panel and water pump all stand within about two tiles and overlap (audit: lantern on the logs, the
  topiary on the logs and the coop, a tomato bed drawn over a lantern); the gate stands alone on the lawn, not in any fence
  line. Spread them out and put the gate on the edge with the path. FIX 3, Grow Lamps (`g_lamp`, "Purple light, fast growth")
  are flat purple panels on poles standing on open lawn away from every bed, so they read as TV screens: hang them over the
  raised beds, or give them art. No page errors. Owner: ROOMS.
- QA, the unlock timeline and the economy for Cal's new early game (b1088f8 `ECON.stepLv`, on 2d26053; `rigtest/qa/sim.js` now
  keeps every level-up card and the story steps by name, `unlocks.py`; full map in `shots/unlocks_2d26053.txt`). One unlock = a New
  area, a story step with the lot or room it opens counted once, or a room opened by an upgrade; UI upgrades and Shop restocks are
  listed, not counted. No single level-up screen in the runs had 2 unlocks, and no played day had nothing to buy. Days with 2:
  12-task player: day 7 (Boba, level 23, and the walk-in closet bought the same day), day 19 (Dessert and Lock and Key, levels
  42 to 44), day 25 (Rooftop and Mall, 49 to 53), day 26 (Nova and Theater, 53 to 54). Casual player: day 5 (Relics and the Garden,
  levels 4 to 9); then one at a time (Restaurant day 13, Boba 19, closet 25; level 26 on day 30). FIX 1 (LEAD), the first trial:
  stored XP releases 4 to 9 at once, and `levelUp(afterLv,...,beforeLv)` shows the cards of levels 6 to 9 on one screen, so
  clearing it gives the class pick, then Wheel (6) and Relics (8) together, and the Garden scene (least level 5) right after:
  4 new things in one moment, the "multiple unlocks from 1 level" Cal saw. (The sim clears trials without that screen, so this
  is from the code: `clearGate` -> `advModal` -> `levelUp`.) Same for gate 10 (9 to 15): levels 10 and 11 are never shown. Fix:
  put the three New areas a trial apart (Hall 4, Wheel after gate 5, Relics after gate 10), or let a trial-clear screen show one
  unlock and hold the rest for the next level-ups. FIX 2 (LEAD, for the 2-unlock days): `stepLv` almost never decides anything.
  The 12-task player is far past each least level when the step's own gate opens (Dessert, least 11, opened at 44; Mall, least
  20, at 53), and the casual player too (Restaurant, least 7, at 17). Only the Garden's 5 binds, and it is held by the trial at
  level 5 anyway. To space them: let `styCheck` open at most one story step a day (simplest, matches "one at a time"), or raise
  `stepLv` toward the levels players really reach. Gd_rest (`gdrest.js`) works: a mystery card at 0 and at 60 sold, for sale
  right after Mara's yes. Economy to level 80 (the Garden later changes almost nothing): 12-task player owns every upgrade on day
  44 at level 82, level 100 on day 55 (sim9: day 45, level 79); grinder every upgrade on day 21 at level 93, level 100 on day 25.
  No page errors. Owner: LEAD.
- QA, LEAD's 4f15346 (on 2d26053, `audit49.js`, the static check now reads `dist/app.js`): pass. 108 level-up screens 1 to 100,
  no NEW BLUEPRINT and no LOFT EXPANDED card, no crew, vault or bad text; the New areas are Hall 4, Wheel 6, Relics 8. Owner: none.
- QA, ROOMS's f457680 and eb85e90 (on 9ae8634, `restmenu.js` and `restshell.js`; `shots/rest_booth_firepit.png`,
  `rest_booth_firepit_noir.png`): pass. The crescent booth (`rdx_curve2`) sits in the back-left corner and opens straight at the
  room, with its round table inside it (the only overlap the audit finds, which is meant); the Fire Pit Lounge is a stone bowl with a
  fire, Adirondack chairs and a stone pad, in the Bistro and Noir. Board still 26 of 26. No page errors. Owner: none.
- DONE by QA (QA findings: 2 fixes for LEAD). WAITING ON QA (LEAD's message, Cal: "not multiple unlocks from 1 level ... not this early"): on 16e72c3, map every
  unlock by day and level over the first 30 days for the 12-task and casual players, flag any day or level with 2 or more, and
  rerun the economy to level 80 with the Garden later.
- DONE by QA (QA findings: pass). WAITING ON QA: check 4f15346 (rule 17): level-ups no longer show room blueprints or new Loft floors (bpCard and floorCard
  calls removed from levelUp). LEAD checked levels 2 to 31 headless.
- DONE by LEAD in 4f15346. QA, LEAD's text and story audit (ca1068d, on c1f1aa5, `rigtest/qa/audit49.js`; every level-up screen 1 to 100 in
  `shots/levelups_c1f1aa5.txt`): mostly pass, 1 fix for LEAD. Pass: `unlocksFor` returns null, so no level-up shows the old crew,
  the vault or a relic, and none of the 108 screens has "[object Object]", "undefined" or NaN; the New area cards read the new
  Shop, Hall, Relics and Wheel lines; Sable's visit (Trophy Room) and Rafe's (Lock and Key) are not due on a new save or with a
  set half done, and are due once the goblin set and the amulet are finished (Sable uses her team banner, Rafe his own picture);
  the Dungeons and Relics screens have no bad text, the relics show the star stand-in and set emblems draw nothing until the art
  exists; `tools/art_slots.py` rerun gives the same 55 of 67 as `docs/ART_SLOTS.md`. FIX (LEAD), the level-up screens still
  announce the old blueprints and floors, against the storyboard: level 8 "NEW BLUEPRINT Restaurant ... Build it in your
  Hideout", level 14 "NEW BLUEPRINT Garden: A small plot behind the building", 16 Boba Shop, 24 Movie Theater, 30 Mall, 50
  Nightclub, and "THE LOFT EXPANDED Floor N is open. Two new slots to build on" at 8, 12, 16, 22, 26, 32 and 38. A save at
  level 15 with no story progress has no lots and `__qbStory.allows` is false for all of them, so the cards promise rooms the game
  does not open, the Restaurant before the Garden (Cal's order is Garden at level 3, then Mara), and "Hideout" is the old name.
  Where: `levelUp` in 30_app_b.js (`bpCard` from `ROOMSOPEN`/`ROOMT[k].lv`, `floorCard` from `FLOORLV`). Drop both cards, or
  word them as story hints. Owner: LEAD.
- QA, ROOMS's d30bb93 and 642b791 (on c1f1aa5, `rigtest/qa/gameroom.js` and `restmenu.js`; `shots/gameroom_fixed.png`,
  `gameroom_crt.png`, `rest_board_all.png`, `rest_board_cornerdiner2.png`): pass. The Retro TV's screen faces into the room on
  the beanbags' side; Gaming Desks draws one long desk (`gmx_rig2`, the old `gmx_rig` not drawn) with two screens and a chair at
  each, clear of the ping pong table; the board lists 26 of 26 in the Bistro and Noir, no name runs into its price, and in the
  Corner Diner it hangs clear of the painting and the wine wall. The text is small at room size, which Cal says is fine. No page
  errors. Owner: none.
- DONE by QA (QA findings: pass, 1 fix for LEAD, the level-up blueprint cards). WAITING ON QA (LEAD's message): check ca1068d (rule 17), Cal's text and story audit: level-ups without the old crew or
  vault relics, the new Shop, Hall and Dungeons lines, two return visits after a finished dungeon set, the set emblems, `docs/ART_SLOTS.md`.
  Also ROOMS's d30bb93 (Game Room: the Retro TV faces the beanbags, `gmx_rig2`), a cheap look.
- QA, Cal's Restaurant notes (04bb241, 0edb26c, on 54a4074, `rigtest/qa/restmenu.js` and `restshell.js`; `shots/rest_notes_bistro.png`,
  `rest_notes_noir.png`, `rest_board_bistro.png`, `rest_board_cornerdiner.png`): 3 of 5 pass, 2 need a fix. Pass: (1) Bistro and Noir back wall:
  the tables near it stand on the floor in front of it; (3) all seven gear upgrades add their dishes to the Menu line (Espresso Bar:
  Espresso, Cappuccino; Flat-Top Grill: Smash Burger, Grilled Cheese; Fryer: Fish & Chips; Bakery Rack: Croissant, Sourdough; Wood-Fired
  Oven: Roast Chicken; Grand French Range: Steak Frites, Duck Confit; Charcoal Grill: BBQ Ribs); (4) the crescent booth sits in the
  back-left corner, open to the room, and the window booths and dividers no longer overlap it (the only overlap the audit finds is its
  own round table, which is meant); (5) the half-wall is forest green in the Bistro and black in Noir. NOTE 1 (Cal, 2026-11-05: "The menu doesn't need to physically list every
  item. It just needs to list some so the restaurant feels alive. But if you can fit them all, then sure why not?"): the board shows
  14 of 26 (`items.slice(-rows*2)`), which is fine; fitting all of them is optional. Still fix: "Roast Chicken" runs into its price
  (shorten long names or move the price over). FIX 2, in the Corner Diner
  the abstract painting hangs over the left end of the board and hides the first letters of every left-column dish ("& Chips"); in
  the Bistro and Noir they are apart. Move the painting or the board in the Corner Diner. Owner: ROOMS.
- QA, the Restaurant's painted shells (ROOMS's 1eb8040, 156683a, 64e4735, on 7f4d885, `rigtest/qa/restshell.js`, 16 cases:
  each size bare and fully bought, with and without the patio; `shots/restaurant_shells.png`): pass. Each size draws its own
  painting (Hole in the Wall `rsw_s0`, Corner Diner `rsw_s1`, Bistro `rsw_s2`, Noir `rsw_s2n`), the walls and floors read
  as one room, the front mat shows, nothing stands outside the room in any case a player can reach (the patio needs Knock
  Through the Wall, so no patio at Hole in the Wall size), no page errors. Placement lessons for the fine-dining pass
  (`shots/restaurant_bistro_zoom.png`): (1) the kitchen half-wall keeps the diner's teal in the Bistro, against its cream, green
  and wood; give it each shell's colours; (2) the booths' tall backs and planter screens cover the bottom third of the
  Bistro's arched windows: lower booths, or seat them clear of the windows; (3) the patio's fire pit, curved sofa, umbrella
  table and pergola bunch in the front corner, the pergola over the umbrella, with no rail or step between deck and dining
  room; (4) the white drinks cooler still stands in a dining aisle. Old notes still true: one diner seat has nothing under it
  (`seat-on-air cust:diner`), the counter sorts over the kitchen box. Owner: ROOMS.
- QA, the arrow fix (LEAD's 06cd203, on db59276): pass. Buying each Loft expansion from the Bedroom window (Knock Into the
  Game Room, Walk-in Closet, Patio Door): the new room's arrow shows 0.3 s after the purchase, stays through the splash, and
  matches what a reopened window shows. No page errors. Cal's finding (1) is fixed; (2) and (3) stay with ROOMS. Owner: LEAD.
- DONE by QA (QA findings). WAITING ON QA: check 06cd203 (rule 17): the door arrows now show right after buying an expansion (lfInstallFx redrew the room
  picture without them). Buy each room's expansion and look for the new arrow without reopening.
- LEAD's part (the arrows) DONE in 06cd203; ROOMS's two findings stay ROOMS's. **Cal tested v0.48 on his phone (2026-11-05): "Phone looks pretty good."** Then: "Have the other chats continue on with the
  restaurant." LEAD and ROOMS: carry on with the Restaurant next. His three findings, for the next version
  (`shots/cal_phone_v048_gameroom.png`, his screenshot):
  (1) "I can't see the arrows to go to the other rooms when I purchase the expansions. I have to close and re enter in order
  to see it." QA reproduced it on 10e26fa: buying Knock Into the Game Room adds the room and opens its splash, but the
  Bedroom window behind it has no arrow; reopening the window shows "Game Room". The window should come back with its new
  arrow after an "opens" upgrade (the `raddon` flow and `roomSplash`, `30_app_b.js`). Owner: LEAD.
  (2) "The game room also has a small tv facing the wrong way": the Retro TV Corner's old TV, by the beanbags. Owner: ROOMS.
  (3) "the double gaming rig doesn't make sense because there are two desks but 4 monitors": with QA's earlier finding (both
  chairs on one side, a guest spot inside it), the Gaming Desks need one screen setup per desk, a chair facing each. ROOMS.
- QA, the Trophy Room (ROOMS's 9be3f51, on 10e26fa, `rigtest/qa/trophyroom.js`): pass. No piece yet: the Lair shows "? ? ?"
  and the stairs are not for sale; one piece home: "Stairs to the Trophy Room" for sale, bought for 1,800, the room opens;
  the arrows walk Lair -> Trophy Room (arrow top right, by its back-wall door) -> Hero's Lair (bottom left) and back; the
  mannequin wears exactly the owned pieces in five combinations (none, helm, helm chest sword, boots greaves, all five;
  `shots/trophyroom_mannequin.png`); The Loft's building view draws the hall above the Lair above the Closet
  (`shots/trophyroom_building.png`). The door pair follows Cal's rule (back wall to front-left). Notes: the hall reads dark
  overall, the spotlight carries it; no painted doorway (known). No page errors. Owner: ROOMS, nothing to fix.
- QA, v48 pinned test copy (c6a11c9, slug 95ef49a7...): pass. `savecheck.js` all cases, `screens.js` at 360 and 390 nothing
  wider than the screen, no page errors. Training: 9 plans, 65 exercises, 130 pictures, all load from `art_ex.js` (128 files in
  it). Game Room: all 21 image files load, nothing dark. The published page holds every one of the 417 build files with the same
  checksum (`list_files`); only `index.html` differs (the page's wrapper) and `lfvar.json` is extra (it lives only there): so the
  black rooms and dark squares Cal saw were the upload still running, nothing missing now. Not checked: a real phone, the
  page's own database (QA cannot sign in). Owner: LEAD, nothing to fix.
- QA, dungeon art (ROOMS's d48ed81, on 56ec295): pass. All 13 names the code asks for (`ui_tr_<set>_<piece>`, the two
  `_set` emblems, `ui_gift`) ship in `art_ui.js`; on the Trophies tab every owned piece (all five Goblin King, two shards) shows
  its painting, unowned shards show the placeholder. No page errors. Owner: ROOMS, nothing to fix.
- QA, class banners (ROOMS's 6b7b9c8, on a78cb01, 390 x 844): pass. All eight ship in `art_ui.js`; with each of the four
  classes the Board's class banner draws its painting behind the emblem (`--clsart`), the man's or woman's version by body
  (`clsArt`). The Hall tab shows the emblem only, as built. No page errors. Owner: ROOMS, nothing to fix.
- QA, writing pass review against `docs/VOICE.md` (LEAD's request, on 90d88d1, `rigtest/qa/voice.js`): 1,369 player-facing lines
  checked; the hard rules hold except 3 (Teleport Pad "It probably works.", VOICE.md's own example to cut; Taiko "Don! Ka!";
  the old gym's "The real boss fight."). By hand, about 25 upgrade lines still end on a punchline or a wink, most of them the
  Game Room's (`27b_skins.js:61` to `79`: "Spinning is cheating.", "Nobody ever gets up.", "The room comes alive."), plus
  "The critics came. You won." (`21_restaurant.js:64`, praise for the player). Each with file, line and a rewrite in
  `docs/QA.md`, Writing pass review. Owner: ROOMS (room and upgrade lines, VOICE.md), LEAD (`10_app_a.js:1515`).
- QA, team join banners (ROOMS's 4fc1542, on e272f80, 390 x 844): pass. All five ship in `art_ui.js` and each join window
  shows its painting (720 x 400) above the name, role, stats and buff; text fits the phone (`shots/team_banner_rafe.png`).
  No page errors. Owner: ROOMS, nothing to fix.
- QA, story portraits (ROOMS's 625d9e3, on 860d2c8): pass. Each of the seven scenes (Mara twice, Desmond Hale, Rafe, Priya,
  Nova, Theo) shows its painted portrait (300 px wide) instead of initials. The building backdrops `bld_bg_loft`, `_plaza`,
  `_mall` ship in `dist/art` but no code reads them yet: LEAD wires them after approval 11. Owner: LEAD (backdrops).
- QA, after-commit look at ef2f2e6 (390 x 844): the drag fix (ROOMS's 47d2ffd) works: 120 finger moves made 14 transform
  writes over 40 frames, at most one a frame. The street draws the three painted fronts (`bld_loft`, `bld_plaza`, `bld_mall`)
  with their names, and the hint says "tap a building" (`shots/street_fronts_390.png`). On a phone the buildings are small in
  the top half with an empty road band filling about 40% of the screen below them: worth framing them larger. Not checked:
  the inside backdrops (`bld_bg_*`). `screens.js` at 390: nothing wider than the screen, no page errors. Owner: LEAD (framing).
- QA to Cal and LEAD: Cal's pinned level-1 test copy was taken "publishing now" at 15:39 and is not out at 16:03; LEAD's chat
  shows "waiting", which usually means a prompt is waiting for Cal in LEAD's window.
- QA, Game Room furniture (ROOMS's 9c30788, on 7501ea3, all 24 upgrades bought one at a time): the 80 inch Screen (a racing
  game on it), the Floating Media Console under it and the Cream Sectional facing the TV across the rug look right
  (`shots/gameroom_sectional.png`). The Gaming Desks do not match Cal's spec ("the two red racing chairs (...) one on each side
  facing their screens"): both chairs sit on the near side, the far desk has none; a guest spot is inside the desks
  (`cust` at 10.35, 5.10 in `gmx_rig` 9.8 to 12.8, 4.9 to 6.4; `stations.js` flags it); the Mini Fridge is wedged against the
  desks and the ping pong table touches the chairs (`shots/gameroom_desks.png`). Owner: ROOMS.
- QA, after-commit checks on e544fae: `savecheck.js` all 11 cases pass, `screens.js` at 360 and 390 nothing wider than the
  screen, no page errors. Game Room painted walls (ROOMS's a4e2a4a, all 20 upgrades bought one at a time,
  `shots/up_gameroom_walls.png`): each wall tier changes the room (Carpet & Wall Panels the whole room, LED Lighting Rig light
  strips and glowing hexes round the TV); Hex Acoustic Panels is subtle (grey hexes on a grey wall, about 9,000 pixels); with
  the separate LED Wall Panels upgrade the room has two hexagon features. Still small: Dartboard, Mini Fridge, RGB Floor Lamp
  (under 2,300 pixels each). The couch faces the TV, nothing overlaps. Owner: ROOMS (for the next pass, no fix needed now).
- DONE by QA (QA findings, 4694552). WAITING ON QA: check v48, c6a11c9 (rule 17 and 18): Cal's pinned test copy, published 2026-11-05 as a NEW artifact
  ("Quest Board v48 (test, fresh start)", slug 95ef49a7-02ac-46d1-907d-61a15d84c959, 418 files, db + user + sample with
  images, its own empty database). Run `savecheck.js` and `screens.js` on the c6a11c9 build. New in c6a11c9: exercise
  pictures travel in `art_ex.js` (an artifact holds at most 512 files; the build had 535), so look at Training's pictures.
  Note: the first upload went up in batches and Cal opened it mid-upload (black rooms, Game Room squares); it is complete now.
- DONE by LEAD in c6a11c9 (pinned). WAITING ON LEAD, URGENT (Cal, 2026-11-05): "For now, give me a version to test on my phone and pin it to the side. Every
  version you pin for me should be an initialized version of the game from lvl 1 so I can test everything from the ground up."
  Publish the current build (v48: QA cleared the economy in 470cbf7 and ROOMS's freed upgrades and door) as a NEW artifact, so
  its database is empty and Cal starts at level 1, and pin it in his left-hand panel; don't wait on his open approvals for
  this test copy. Include `lfvar.json` (`app/lfvar.json`) and declare the same capabilities as the live page (db, user,
  sample), so saving, Neighbors and photo checks work there. The friends' live page stays as it is. Then tell QA the commit:
  QA runs `savecheck.js` and `screens.js` on that build. New TEAMWORK rule 18 (Cal) is the pipeline from now on. Owner: LEAD.
- QA, economy at the level-80 prices (e64f93f, run on 961b632, `sim.js`): **Cal's targets met.** The 12-task player owns every
  upgrade on day 45 at level 79 (level 80 on day 46, 90 on day 50); the grinder on day 21. Coins (12-task, all 55 days): tasks
  36%, rooms 16%, missions 15%, level pay 13%, produce 7%, Daily Quest 4%; grinder: tasks 47%, missions 17%. No day with
  nothing to buy before the town is bought out. Rooms open every couple of days (12-task player: Garden 3, Restaurant 4, Boba 6,
  Closet 9, Patio 12, Game Room 13, Dessert and Lock and Key 18, Lair 23, Rooftop 24, Mall 25, Theater and Auditorium 26,
  Arcade 30, Bowling 36, Karaoke 38, Club 39, Rhythm 41, VR 43; Boba to Dessert is 12 days, was 31). The 377,100 total is
  fine as it is, no change needed. After the buy-out coins pile up (140,000 by day 55, the grinder 346,000 by day 35) with
  nothing to spend them on until the artifact and prestige (`docs/PRESTIGE.md`) give levels 80 to 100 a use. No page errors.
  Owner: LEAD (ready for v48 as far as the economy goes).
- QA, freed upgrades and the Game Room door (ROOMS's ab9dc81, on 961b632, `menu.js` to level 70, `doors.js`): pass. Every
  upgrade in every room is now offered and bought, including all 11 that never were (Game Room 17 of 17, Restaurant 59 of 59,
  Garden 41 of 41, Theater 34 of 34); only the Trophy Wall waits for its first trophy, as designed. The Game Room's door is in
  its left wall, matching the Bedroom's front-right edge (Cal's rule). Every arrow is on its own door's side. Door pairs that
  follow Cal's rule: 5 of 15 (all the Loft's, Theater and Auditorium); the 10 in Kode Plaza and the Mall still do not (table
  in `docs/QA.md`, Doors), and the Mall still opens straight into Karaoke two floors up. Owner: ROOMS (the remaining doors).
- QA, economy rerun on bc1368e (`sim.js`, 12-task player 60 days, grinder 45; on d0c9ea4, which holds bc1368e but not your
  uncommitted level-80 prices). Met: missions 15% of the 12-task player's coins in the second half (21% for the grinder),
  real tasks the biggest source (38%, grinder 48%), no day with nothing to buy for either, no page errors. Levels: the 12-task
  player at 80 on day 46 and 100 on day 58, the grinder at 80 on day 20 and 100 on day 25. Not met yet: every upgrade around
  level 80 (the 12-task player owns 268 of about 380 on day 60) and the long Boba-to-Dessert wait (day 6 to 37): both are the
  prices, which your level-80 set fixes. Next: commit the level-80 prices, then WAITING ON QA, and QA runs both players to
  level 80. Optional: `xpK` 0.75 puts the 12-task player's level 100 near day 51. Nothing here blocks v48. Owner: LEAD.
- QA, the team (the rest of LEAD's upgrade-income request, 29c_team.js, on d0c9ea4, `rigtest/qa/team.js`): pass. Each buff
  applies to the rooms it names and no others (Mara x1.15 Restaurant, Rafe x1.15 Lock and Key and Rooftop, Nova x1.10 Mall
  and Club, Theo x1.2 Theater and Auditorium; Garden, Mall, Theater untouched by the wrong member), the Tamer's Bond makes
  15% into 22.5%, Sable adds 10% to mission pay, the join banner shows name, role, stats and buff, Sable joins with her banner
  on the first mission home, and the team leads the missions. The room window rounds coins/hr to whole numbers, so on a
  small room (Boba 4/hr) a 15% buff can show no change. No page errors. Owner: LEAD, nothing to fix.
- QA, story scenes (LEAD's aa0d9ed request, on c7151e1, `rigtest/qa/story.js`): pass. A new save walked from the Garden to the
  Auditorium, each gate held one short and then met: nothing opens early, each opens on its gate (Garden at level 3, Mara at 60
  produce sold, Boba at 80 served, Dessert at 4 Boba upgrades, Lock and Key at 25,000 earned, Rooftop at 6 Lock and Key
  upgrades, Mall at 80,000, Theater at 4 Mall upgrades, Auditorium at 2 Theater upgrades); "Not yet" keeps Mara away, she
  returns after 30 minutes; lots reach the street in order; an old save owning every room gets no room scene and no lot (only
  Rafe's team scene, which is not a room). Days each room opened (d7ae577, prices as built), 12-task player: Garden 3,
  Restaurant 4, Boba 6, Closet 13, Patio 22, Game Room 24, Lair 36, Dessert 39, Lock and Key 39, Rooftop 50, Mall 51,
  Theater 52, Auditorium 53; grinder: everything by day 54. The 33 days from Boba to Dessert come from prices (the player buys
  cheaper Loft pieces first); the level-80 prices will shorten it, and QA reports these days again on that rerun. Owner: LEAD.
- DONE by LEAD in e64f93f ((1) to (3)); Cal, 2026-11-05: the Mall Fountain and the Projection Wall earn (they draw a crowd), 3a6ff08, which also makes every "Earns +N% here" line show the real share. QA, upgrade income (LEAD's d523cf1 request, on 37b053a, all 357 business upgrades read from the live game: 66 looks only,
  291 earn). Fix: (1) three looks-only upgrades still tell the player "Earns +6% here": Banker's Lamp Table (speakeasy
  `sp_lamp`), Trophy Case (rhythm `rh_trophy`), Stage Lights (karaoke `ka_light`); (2) the Theater's Arcade Cabinet (`t_arc`)
  is a coin machine people play, but looks only: `{earn:1}`; (3) decor that earns: Tea Prints (`bo_art`, "two small prints"),
  Sakura Tree (`de_sakura`), Equalizer Wall (`rh_eq`): `{decor:1}`. Cal to say: the Mall Fountain (+24%) and the VR Projection
  Wall (+24%) are decor that draw a crowd. Looked at and fine: plots, trees and grow lamps in the Garden (they grow produce),
  Soda Fountain, Liquor Wall, Tea Jar Wall (stock), the expansions. Not done yet: the team buffs part (each buff applies,
  the join banner, missions led by the team). Owner: LEAD.
- DONE by QA (QA findings). WAITING ON QA: check the economy, e64f93f (rule 17): your level-80 prices are in as written (`ECON.price`, `stepK` 0.25,
  `stepMax` 2, `xpK` 1, mission energy doubled). Everything totals 377,100 in the live list (your estimate was about 300,000:
  say if the step or a category should come down further). Run the 12-task player and the grinder to level 80, report coins
  by source (missions under 20%), days with nothing to buy, and the days each room opens.
- DONE by LEAD in e64f93f. WAITING ON LEAD, prices for Cal's level-80 target ("all upgrades can be purchased around lvl 80 ish"; worked from QA's d7ae577
  runs and the live upgrade list, `effort_model.py` method): a serious player earns about 250,000 to 290,000 coins by level 80
  (12-task player: level 80 on day 47; grinder: day 21; with mission pay cut as suggested below). Everything costs about
  1,205,000 now, so prices must come down to about a quarter. Set `ECON.price` to decor 150, furniture 300, equipment 600,
  big 1,200, moment 1 (x the old base instead of x3), and soften the room step to `min(2, 1 + (ROOMSTEP-1) x 0.25)` instead of
  x ROOMSTEP (Garden x1, Lock and Key x1.25, Mall x1.5, the Club x2). Total about 300,000: bought out just after level 80, with
  the ramp kept (Anime Poster 150, Popcorn Cart 1,000, Grand Piano 1,500, Rooftop Pool 1,650, IMAX Screen 6,500). Keep the
  mission cut from QA's last line (`mcost` doubled) and leave `xpK` at 1 (level 100 stays near day 50 to 60 for the artifact).
  Then `WAITING ON QA: check the economy, <commit>` and QA runs the 12-task player and the grinder to level 80. Owner: LEAD.
- DONE by QA (QA findings). WAITING ON QA: rerun the economy on bc1368e (rule 17): your three `ECON` suggestions are in (mission energy doubled, `xpK`
  0.85, `price.moment` 2.5). Targets, both from Cal: the serious (12-task) player at level 100 near day 50, and every upgrade
  buyable around level 80; missions under 20% of coins; no day with nothing to buy. Say what to change next.
- DONE by LEAD in bc1368e (and story scenes no longer open over the Shop). QA, economy against Cal's target (d7ae577, `sim.js`, regular 60 days and grinder 70; `docs/QA.md`, Effort-first run 2).
  Level 100: the 12-task player on day 60, the 20-task grinder on day 26 (the curve's 46,738 XP at 830 and 2,300 XP a day).
  Everything bought: the grinder on day 58; the 12-task player owns 270 of about 380 upgrades and 14 rooms on day 60.
  Days with nothing to buy: zero for the 12-task player (target met; Lock and Key and Mall gates on every coin earned never
  stalled anyone), the grinder only after buying everything. **Wrong: missions twice a day doubled their coins**: from day 31
  missions are 32% of the 12-task player's coins and real tasks 30%, against Cal's rule. Suggested `ECON`: (1) missions:
  double `mcost` (m1 50, m2 80, m3 200, m4 300, m5 500) so a normal day's energy pays for about one round, target missions
  under 20%; (2) curve: `xpK` 0.85 puts the 12-task player at level 100 near day 51 (the grinder near 22: 20 proven tasks a
  day is more than "serious"); (3) prices: after the mission cut, lower `price.moment` from 3 to 2.5 so the grinder still
  buys out near day 50. QA reruns once these are in. Owner: LEAD.
- QA, missions twice a day (f629518, on d7ae577): pass. The card shows cost, pay and "Run 1 of 2 today", then "Back out in
  2 h 55 min" (the 3 hours count from sending), then "Done for today"; energy is spent per run; a third run is refused.
- QA, the Shop (e012535, 3a6fdd5, on d7ae577, `rigtest/qa/shopcheck.js`, 1280 and 390 wide): pass. The mirror stays in view
  after scrolling 1,600 px; Try on charges nothing, the mirror and basket show both pieces, the Checkout window lists them,
  Buy all pays the total and wears them; each tab's text reads at 6.6:1 or better on its colour; View then Checkout works
  (an upgrade then reads Active, an interface item Equipped · Remove); the drop window shows its painted banner; no screen
  scrolls sideways; no page errors. Seen in passing: story scenes can open over the Shop mid-purchase. Owner: LEAD.
- QA, the Patio (ROOMS's ef2ab15, on 331bd7f): pass. Turf, string lights strung overhead between posts, both dog beds, the
  egg swing; its door back to the Bedroom is on the front-left edge (Cal's rule: Bedroom back-right to Patio front-left); a
  Patio buy shows through the Bedroom glass at once (the telescope changes 2,148 pixels of the Bedroom). `shots/patio_full.png`.
  Owner: ROOMS, nothing to fix.
- ROOMS answer (33408e9): (1) the dark Patio inside the building was the room art loading after the Bedroom drew; fixed in
  bd895a7 (turf and fire bowl show behind the glass in the building view now); (2) dogs on the Patio now mostly go to their own
  beds (3 minutes headless: every lie-down in a bed, none on the deck). Their size is the Bedroom dogs' size, seen further off.
- QA, walking onto the Patio (ROOMS's 63ac9f3, `rigtest/qa/watchroom.js`, 10 shots over 3 minutes): you walk out through the
  glass, stand among the Patio furniture (`look@deck`, nobody inside furniture), come back to the bed and mirror; both dogs go
  out too. Not right: (1) inside The Loft building the Patio behind the glass is dark (no turf, no sky), while the same window
  opened from the street shows turf and skyline (`shots/patio_walk.png`, left); (2) on the Patio the dogs lie on the deck by
  the fire bowl, not on their Patio beds, and look tiny through the glass. Also, opened from the street view (without going
  into the building) a room window has nobody in it: if any button opens a room window from the street, the room is empty.
  Owner: ROOMS (1, 2), LEAD (the street).
- QA, economy check DONE (LEAD's 29ae247, run on 3a6fdd5, `sim.js` adapted: Daily Quest goal 100/150/300, training logged on
  workout days; numbers in `docs/QA.md`, Effort-first run 1). It works: XP is 100% real life (no mission XP), real tasks are
  the biggest coin source for every player at every stage (35 to 59%; with the Daily Quest chest, training, the weekly bonus,
  level pay and trophies, 58 to 80% of coins come from effort), and nobody runs out: day 60 the 12-task player owns 230 of
  about 380 upgrades and 11 rooms, never holds more than 13,000 coins, and had 4 days with nothing to buy (the grinder 2).
  Tighten (Cal: "step by step"): (1) **the Daily Quest goals are far below what players really earn**: with proof, streak
  and combos a player makes 240 XP a day (casual), 750 (regular), 2,300 (grinder) against goals of 100, 150 and 300, so the
  "hidden" quest fires every day for everyone and the town is always at 150%. Count the goal in base task XP (before
  bonuses) or offer goals about 3x higher; (2) missions reach 22% of the regular player's coins in month 2 (energy covers all
  five every day): raise `mcost` or drop `mcoinLv`; (3) the casual player opens only 5 rooms in 60 days and buys 1 to 2
  things a playing day: fine for "something every day or two", watch it. Owner: LEAD.
- QA, Bedroom wall tiers (ROOMS's f4362b1, on 3a6fdd5, `rigtest/qa/loft.js`, `shots/loft_walls.png`): each tier changes the
  walls in all four styles (Neutral Loft, Brick Studio, Warm Oak, Neon Noir; 28,000 to 171,000 pixels a step), brick and slats
  run the whole left wall. Fails "nothing hangs on the grass": the LED strip from "LED Strips & Grass Panels" (`bd_lights`)
  still runs diagonally across the Living Grass Wall with a see-through rectangle under it, in every style; the floating book
  shelf overlaps the grass's right edge a little. Owner: ROOMS.
- QA, Relics and trophies (001e749, `rigtest/qa/relics.js`): pass. A new player has the Relics tab and no Trophies sub-tab;
  the Trophy Wall is "? ? ?" ("Bring home your first trophy") and becomes buyable with the first piece, when the Trophies
  sub-tab appears; each relic tier pays once (600 coins, then nothing on two more checks); the full Goblin King set counts
  each buff once (quests +3% XP, missions +20%, gifts +15%). Not seen: where the trophy buffs are listed (not on the Board).
  No page errors. Owner: LEAD, nothing to fix.
- QA, upgrade menu recheck (001e749, `menu.js` updated to the current rules): passes. Never more than 4 cards, the 4th always
  "? ? ?", no level lock shown anywhere, Buy always works, no early "All upgrades installed", 1,421 cards. Still never offered:
  the same 11 upgrades whose prerequisite left the room (Game Room 3, Chef's Neon, Garden 3, Theater 4), on ROOMS's list.
  The Trophy Wall waits for the first trophy, as designed. Owner: ROOMS (the 11).
- DONE by QA (QA findings). WAITING ON QA, a second target from Cal (2026-11-05), for the economy check you have TAKEN: "all upgrades can be purchased
  around lvl 80 ish" (level 80 is day 37 for the serious player). Levels 90 to 100 are kept for the artifact
  (`docs/PRESTIGE.md`, later). Tune prices until a serious player can own every upgrade around level 80, not day 50.
- DONE by QA (QA findings). WAITING ON QA, the target for the economy check (Cal, 2026-11-05): "a serious player can get to lvl 100 in 50 ish days ...
  that 50 could easily be 100 days if you play every other day." The whole game (level 100 and the town bought out) takes a
  serious daily player about 50 days. LEAD set the curve back to `min(600, 50+6L+0.2L²)` (46,738 XP, day 49 at 950 a day;
  `ECON.xpK`, `xpCap`). Tune prices so everything is bought around day 50 for the grinder, and say what `ECON` should change.
- DONE by QA (QA findings). WAITING ON QA: check missions and the story gates, f629518 (rule 17): each mission twice a day, 3 hours apart (the card
  shows the wait and "Run n of 2"), pity stays 5; Lock and Key and the Mall now wait on every coin earned (`ECON.gateLockKey`
  25,000, `gateMall` 80,000, my guesses). In the economy run: days with nothing to buy (target zero), and tune those two.
- DONE by LEAD in f629518. WAITING ON LEAD, Cal's decisions on QA's v48 findings (2026-11-05):
  (a) Missions: "a piece after 5 is fine but allow them to do each mission twice a day with a 3 hr timer in between each
  mission. if this still feels unfair, then bring it to 4." QA ran it (`dropodds.py 2 5`): twice a day halves the wait, Goblin
  King 9 days median (90% by 14, unluckiest 27), Amulet 8 (90% by 12, unluckiest 22). A pity of 4 changes almost nothing
  (unluckiest 27 and 20): the tail comes from the 30% gift chance, not the pity. So: twice a day, 3 hours apart, pity stays
  at 5. Under the approved effort-first economy each run still costs energy from tasks, so twice a day stays earned.
  (b) The Mall gate: "make it so that every coin earned overall counts towards the goal... it should never feel like you
  are at a standstill." Count all coins earned (`S.earnedC`), not only business takings, keep a healthy number. His design
  intent: "it makes sense to upgrade the other rooms at the same time so you progress in a more balanced way"; fully
  upgrading the Loft should take a while, so there is always something to buy while a gate fills. QA's economy check will
  count days with nothing to buy; the target is zero. Owner: LEAD.
- QA, v48 economy (0426a46, `sim.js`, 3 players, 60 days; `docs/QA.md`, v48 run). Better than before: missions give little
  XP now (regular: 6,600 of 55,800), levels 39 on day 30 and 68 on day 60 (were 79 and 100), the casual player buys 3 to 4
  things every day for two months. Still wrong: (1) month 2 coins for the 12-task player: missions 34%, rooms 25%, tasks
  only 23%; for the casual player Garden produce sales are 20%; (2) the Mall gate (businesses earned 60,000, `29b_story.js`)
  leaves 9 days with nothing to buy (regular days 28 to 36, grinder 17 to 23) while coins pile up to 107,000; count total
  coins earned or lower it; (3) everything is bought by day 60 (regular) and day 30 (grinder). The approved effort-first
  build replaces most of this; keep these as checks for it. No page errors. Owner: LEAD.
- QA, dungeon gift odds (9b4cf3a `dgRoll`, `rigtest/qa/dropodds.py`, 20,000 players at 5 missions a day, gift buffs 0):
  Goblin King set finished in 18 days median, 90% within 27, unluckiest 51 (87 missions median); Amulet set 16 days median,
  90% within 23, unluckiest 39. The pity never fired twice running. Fine for a set; the unluckiest month-plus may sting, a
  pity at 4 dry gifts would cut the tail. Relics tab checks not done yet. Owner: LEAD.
- FYI ROOMS and QA (Cal, 2026-11-05): loops every 12 minutes now, not 15. Rule 16 has the new `/loop 12m` line: delete your
  15-minute loop and start it.
- DONE by QA (QA findings). WAITING ON QA: check the Shop, e012535 and 3a6fdd5 (rule 17). Look at: the character stays in view while scrolling (desktop and
  phone); Try on for clothes, the basket and its confirm window; each tab's colour (brands, Basics and Vault cream, Wardrobe
  champagne, Upgrades and Interface navy) and that text stays readable; View then Checkout on upgrades and interface, then
  Equip or Equipped · Remove; the drop window with banner art. The body is now `overflow-x:clip`: check no screen scrolls
  sideways.
- DONE by QA (QA findings). WAITING ON QA: check the economy, 29ae247 (rule 17). QA's effort-first proposal as written; every number in `ECON`
  (`29e_economy.js`), hook `window.__qbEcon`. Look at: the Daily Quest card on the board (goal, efficiency, chest, hidden
  quest at 2x), room payouts against today's task coins, mission energy on the Dungeons tab, no XP from missions, delves,
  gifts or story visits, training (50 XP and a stat point for 3+ exercises), new prices. Rerun `sim.js` for the three
  players, 60 days (Cal: "step by step until it feels right ... it could be tightened more"). Not done yet: the hidden quest's
  rare furniture and cosmetic shards (it gives a streak freeze or INT until ROOMS's art exists), stat icons.
- DONE by LEAD in 29ae247. WAITING ON LEAD: build QA's effort-first economy. **Cal approved it, 2026-11-05: "approve and send... we are still simulating
  what it would feel like for a long term play of this game. So we should take it step by step until it feels right. Your
  coin estimations and pricing feels good, but it could be tightened more."** Build it as written in `docs/QA.md` (Proposal:
  an effort-first economy; Cal's requests 2 and 3 are now approved too), keep the numbers in one place so they are easy to
  tighten, then write `WAITING ON QA: check the economy, <commit>` (new rule 17) and QA simulates it. Owner: LEAD.
- QA, 62c311d. Pictures in `rigtest/qa/shots/` (not committed), write-ups in `docs/QA.md`.
- TAKEN by LEAD, done in 347ff65 (`tools/version_check.py`, LEAD's routine in TEAMWORK). LEAD (Cal, 2026-11-05): "make sure there are no discrepancies or rule breaking changes from mismatched versions that you all
  are working on. You should all be working on the same exact version." What QA sees now (4958885): one branch `main`, in
  sync with GitHub, live is `APPV` 47. Mismatches: (1) LEAD and ROOMS test builds of the shared folder (8766, 8765), which
  include each other's uncommitted edits, while QA and publishing use commits, so the same check can pass for one chat and
  fail for another; (2) long-lived uncommitted work (LEAD's six app files right now) that the other chats build on before
  it is committed; (3) leftover test copies from earlier sessions still registered as worktrees (`scratchpad/cur` at
  840749b, `scratchpad/prev` at fe4fe35); (4) `main` is ahead of the live page (progression not published yet). Ask: a
  version check in LEAD's routine, before each publish and at wrap-up: everyone committed and pushed, `git worktree list`
  only holds today's test copies, each chat's last test names the commit it ran on, and the live `APPV` matches TASKS.md;
  and a rule that work another chat builds on is committed first. QA tags every result with its commit. Owner: LEAD.
- TAKEN by LEAD (text done in 4a2a143; database rules and the two-friend test with v48). LEAD (Cal asked whether friends must be Editors): no. On the platform an Editor is an admin who can republish the page and
  change database rules; a Contributor can write data, which is all a player needs. The Neighbors text in `30_app_b.js` says
  "Share this page with a friend as an Editor": make it Contributor, add database rules so each player writes only their own
  `worlds/`, `pings/` and `board/` rows, and test one friend as Contributor (online save, Neighbors, a photo check) and one as
  Viewer (expected: plays, saves on that device only) before inviting 15. `docs/QA.md`, Town hall. Owner: LEAD.
- TAKEN by LEAD (stopgap 5082b0c; trials 62306c1; the real fix is QA's proposal, waiting on Cal's go). LEAD, economy simulator done (your request; 12a46ba, `rigtest/qa/sim.js`, numbers in `docs/QA.md`, Economy and play
  simulation): do not publish the progression as is. A 12-task-a-day player owns every room and all 370 upgrades by day 33
  and level 100 by day 40, then nothing to buy (970,000 coins unspent by day 60); a 20-task player by day 21. Causes: room
  income (70% of coins in month 2, about 21,000 a day), missions (more XP than real tasks by day 60, pay +2% per level), and
  XP bonuses doubling the curve's 200 a day. Level trials need a gym photo, so a friend who never works out stops at
  level 4. Owner: LEAD (Cal to decide the trials).
- TAKEN by LEAD: (6) done in 62306c1; (5) bounties now; (4) town meter and (1) town hall next; (2) and (3) wait on Cal's go. LEAD, Cal's six requests (2026-11-05), his words and QA's notes in `docs/QA.md` ("Cal's six requests" and "Proposal: an
  effort-first economy"). Decided by Cal, ready to build: (1) "turn on the town hall and allow you to post a picture of your
  character with your current outfit and a short message for everyone to read" (`socialHtml` exists, never shown; Contributor
  access and database rules first); (4) a weekly town meter everyone fills, showing each player's coins and XP gained, "but it
  should keep the amount of tasks and the descriptions of tasks private"; (5) "a rotating daily bounty or a 3 day bounty",
  and AI-suggested tasks "such as 'throw away one thing you have not used for more than 6 months'"; (6) trials "for everyone...
  a walk, or a gym session... it needs to be something active related. Sung jin woo didnt rank up by cleaning his room."
  Waiting on Cal's go on QA's numbers: (2) rooms earn only after a task today, 100% at the daily limit, 200% grants a hidden
  reward and more town buffs; (3) prices ramp by what a thing is; and the rule behind both, "doing chores and training will
  always reward you more than having a virtual restaurant give you money or sending people out on missions": XP only from
  real life, room pay capped at 20 to 50% of the day's task coins, missions run on energy from tasks and give no XP, training
  the best XP per minute. Modelled: tasks stay 53 to 83% of all coins, a 12-task player fills the town in about 5 months.
  Owner: LEAD (code), Cal (the go). QA reruns `sim.js` on the code once it is in.
- Portrait brand banners (Cal, 2026-11-05: the drop window "to have the banner art but in a portrait style, whereas the shop
  shows the banner for the brand"). One per brand, the same scene and logo as its landscape banner, 720 x 1080:
  `ui_banner_<id>_p.webp` for hanga, y2k, over, rose, alt. LEAD's code (e012535) uses it when present, the landscape
  banner cropped until then. Show Cal side by side first.
- LEAD wired all seven in (a60b175): the Daily Quest chest, stat chips, hidden quest picture, town hall backdrop. v48 waits for
  Cal's approval 8; if he turns one down, delete its file and the stand-in comes back.
- DONE by ROOMS in 8caf214, Cal approved (approval 8, 2026-11-05): all seven files at these names and sizes are in `art/app`;
  LEAD, the game does not read them yet (no `ui_dq_chest` etc. in the code), so wire them when Cal approves. TAKEN by ROOMS, right after the Loft goes to QA (today). LEAD's code is in (29ae247). Names and sizes, all optional (the game draws its own until they exist): `ui_dq_chest.webp`
  (the Daily Quest chest, closed, 256 x 256), `ui_stat_str.webp`, `_agi`, `_vit`, `_int` (64 x 64 icons), `ui_hidden_quest.webp`
  (the hidden quest's reveal, 512 x 300), `ui_town_board.webp` (town hall backdrop, 720 x 300). Tell LEAD when READY.
- ROOMS, art for the same (Cal 2026-11-05, after LEAD's code exists): a town hall board backdrop for the posts; the Daily Quest
  complete card and its small chest; the hidden 200% reward's look (rare furniture pieces and cosmetic shards, original
  designs); four stat icons (STR, AGI, VIT, INT); an active-trial badge. Sizes and names from LEAD when the code is in.
  Owner: ROOMS.
- FYI LEAD and ROOMS: QA added rule 13 to `TEAMWORK.md` at Cal's request (Waiting on each other: true Doing lines,
  `WAITING ON <chat>` lines, check for them between tasks). Right now both Doing lines are stale: LEAD's says nothing in
  progress with five app files uncommitted (`10_app_a.js`, `29_prices.js`, `29b_story.js`, `30_app_b.js`, `index.html`,
  new `29c_team.js`); ROOMS's still describes the Closet v2 that Cal approved and 93c95b6 committed.
- READ BEFORE THE NEXT ROOM ART (Cal, 2026-11-05: "a lessons learned so that the next pass on art generation can be better";
  walls swapped for cohesion, furniture "highly detailed, carefully placed, and have cohesiveness between the entire room"):
  `docs/QA.md`, Lessons for the next art pass: 12 rules, every room against isometric references, and the upgrades whose
  picture does not match their name. Owner: ROOMS, before generating any wall shell or furniture.
- DONE by ROOMS in fd80c50 and 3962ee2 (doors.js: every pair passes). Doors, Cal's rule (a back-left door comes out of the next room's front-right edge, back-right to front-left): 12 of 15 pairs
  break it; only Closet/Lair, Theater/Auditorium and Mall/Karaoke follow it. Table in `docs/QA.md`, Doors; recheck with
  `LOGIC=1 node rigtest/qa/doors.js`. Owner: ROOMS (`portal()` in `27_rooms.js`, already on ROOMS's list as Doors that make sense).
- DONE (rmArrows puts each arrow at its own door's corner; doors.js passes on 3962ee2). Doors: every "up" arrow sits in the frame's top-left corner, but 7 of 9 doors up are on the back wall, top right (Bedroom to
  Patio, Restaurant to Upstairs, Bar to Roof, Boba to Dessert, Dessert to Speakeasy, Mall to Bowling, Arcade to Rhythm). Put
  each arrow on its own door's side. `rmArrows`, `26_world.js`; `shots/doors_windows.png`. Owner: ROOMS.
- DONE by ROOMS in 3962ee2 (doors.js: none, but the Mall escalator, which is the way up). Doors: furniture stands on 8 door glows, everything bought: Bedroom to Closet (wardrobe, dog bed), Restaurant to Upstairs
  (plant divider, table), Boba to Dessert (tea urns, fryer), Dessert to Boba (cupcake stand), Dessert to Speakeasy (macaron
  tower), Arcade to Rhythm (claw machines), Rhythm to Arcade (speaker tower), VR to Arcade (racing pod). `shots/doors_closeups.png`.
  Owner: ROOMS.
- DONE by ROOMS in 0eb00c2 and c829e7e (Karaoke is upstairs from Bowling; a stand-in Mall door only for a save with Karaoke and no Bowling). Doors: the Mall opens straight into Karaoke two floors up, over Bowling (`ROOMCELL`). Small. Owner: ROOMS, Cal to say.
- DONE in b92a6dd (doorway in the left wall, wardrobe gone; figurine cabinet art next). Bedroom (Cal, 2026-11-05): the wardrobe stands where the Closet entrance belongs; Cal asked ROOMS to make it the figurine
  shelf (on ROOMS's list). Owner: ROOMS.
- DONE by ROOMS in bd895a7 (one big original anime poster, approval 6). Bedroom (Cal): Anime Poster is not obvious: three small random pictures, too close to the right end of the wall. He wants
  something apparent, and anime art on an anime poster, not scribbles. `shots/up_bedroom.png`, tier 19. Owner: ROOMS.
- DONE in b92a6dd (canvas on the left wall, shelf in the back corner). Bedroom: Canvas Art (200) and Figurine Shelf (200) are never drawn once Floor-to-Ceiling Glass is owned (`&&!w3`,
  `20_loft.js` ~3210), and the menu sells the glass first, so both are paid for and invisible: 0 px change. Tiers 17 and 21
  in `shots/up_bedroom.png`. Owner: ROOMS.
- Street view (51a9506, checked on 59eeaf7 at 390 x 844): works. The street runs 2 animations and no room images; The Loft
  loads 5 rooms (35 animations), Kode Plaza 7 (99), Calibur Mall 9 (375); Street drops back to 2. Saves, every tab: pass.
  Wrong: Calibur Mall opens with its end rooms cut off left and right (Theater and Club half off screen), The Loft and Kode
  Plaza fit. `shots/inside_calibur_mall_390.png`. Owner: LEAD. DONE in 861bee1 (all three fit at 390 px).
- Street view: the hint at the bottom still says "tap a room" on the street (should be "tap a building"), and it is pale
  grey on pale grey, hard to read. `shots/street_390.png`. Owner: LEAD. DONE in 861bee1.

Requests for LEAD (from ROOMS):
- DONE by LEAD in 68fcc56: `window.qbRaidTrophies()` returns trophy pieces brought home (0 before the first); the first is
  announced ("The first trophy is home. A Trophy Room can now be built above the Hero's Lair."). Please give the room the id
  `trophy`: the Relics tab shows the pieces once a `trophy` room exists (or the old `lr_trophy` in saves that own it). Trophy Room (Cal, 2026-11-05): "trophy wall should be removed and turned into a trophy room but only after a team member
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
- Now: WAITING ON QA (rule 17 + design review): 6f04ed8, the Game Room (Cal): outer hex panels lit so the TV no longer
  hides them (gmw_t4 repainted), foosball to the front, ping pong clear of the doorway (685cbd0's spot ran off the 13x10
  room). WAITING ON CAL (since 10:35 am): five new clothing brands (TIDEPOOL, COURTSIDE, NIGHT SHIFT, DUST & SPUR, ESTATE),
  about 75 pieces; proposal sent to him (docs/BRANDS_PROPOSAL.md, not committed). On his yes, one brand at a time through
  QA; LEAD adds BRANDS and GITEMS rows. Chrome free.
  Retired ids so far: `sb_chester`, `sb_trolley`, `rf_lng2`, `rf_towel`, `rf_ice`, `rf_umb`, `ml_gum`, `ml_ride`, `ml_photo`,
  `ml_flower`, `ml_dir`, `vr_pod2`; new `sb_band`, `dg_riftmask`, `tm_*` tops; `ml_kar` needs `ml_bow`. Chrome free. Dark-floor shadows stay at 0.92 (QA: 0.8 is the knob if Cal finds them heavy). (on 7698efc)
- DONE by QA (QA findings: pass, the piano still touches the bar). WAITING ON QA: check fe48618 (rule 17, small check): Lock and Key's Friday Band (`sb_band`). No card until the Jazz Corner
  is owned; once bought the mic stage leaves the picture and the band stage stands in its corner, clear of the door mat
  and the high-tops; More High-Tops shows one table; the piano no longer touches the bar (QA's note). ROOMS's headless
  pass: no page errors, card gating right in all three saves (bare, all but the band, all).
- DONE by QA (QA findings: pass, 1 note). WAITING ON QA: check 4599993 (rule 17, small check): Lock and Key (the Upstairs Bar, id `skybar`) shows the painted
  brick shell bare and fully bought; the Downstairs door (front-left edge) and the Roof door (the painted stairway, back wall
  far right) both walk and nothing stands on them; nothing outside the room; the back bar stays under the wall top; an old
  save that owns the Upstairs Bar keeps every piece. ROOMS's headless pass: no page errors, both arrows, shell drawn.
- DONE by QA (QA findings: pass). WAITING ON QA: check 0b23996 and d1d7c73 (rule 17): the city behind every building has far fewer, softer lit windows (day
  and night); Noir with White Linen Service sets black marble and brass tables with charcoal velvet chairs (other looks
  unchanged); the patio fire pit clear of the deck rail.
  12-minute loop running (rule 16). (on 23f993d)
- DONE by QA (QA findings: on the floor, both on the door mat). WAITING ON QA: check 23f993d (rule 17), your d4f4577 fixes: the Boba Shaker Station on the floor below the pickup shelf, the
  Dessert Macaron Tower on the floor below the Cake Stand (both rooms spread a 10x8 plan to 12x9; the pieces were in room
  units by mistake), the Dessert Downstairs glow at 1.3, clear of the cafe chairs. The speakeasy's Dessert door goes to its
  front-left edge with step 5.
- DONE by QA (QA findings: doors pass, 2 pieces off the floor). WAITING ON QA: check f0c6dbb (rule 17): the Dessert Parlor's painted shell bare and fully bought; "Hidden Door" at the
  painted bookcase (nothing on its glow), "Downstairs" on the front-left edge; the Boba shop fixes from your 84e97f6 (shaker
  station off the stairs, window bench clear of the side door). The Boba Menu Screen cycles pages (drinks show in my renders);
  a blank frame may be the page change.
- DONE by QA (QA findings: doors pass, 2 placement fixes). WAITING ON QA: check c223d89 (rule 17), the Boba shop: its painted shell bare and fully bought; "Upstairs" at the stairs
  painted at the back wall's far end (nothing standing on its glow); the new side door: Boba "Garden" arrow (top left) and
  the Garden's "Boba Shop" arrow (bottom right) walk both ways; the Neon Cup Sign high over the tea jars.
- DONE by QA (QA findings: pass, 1 note). WAITING ON QA: check a9a572c and e415c00 (rule 17): the Restaurant patio (Corner Diner and Bistro with everything): the fire
  pit left and the table (under the pergola once bought) right, with the sign in the gap; a low rail between deck and
  dining room, open at the front door; no white drinks cooler in Noir with the wine wall. The watering can's tap area on
  a phone (about 44 px).
- DONE by QA (QA findings: pass, 1 note). WAITING ON QA: check 8a5ac99, 059bd45 and 82cc1f9 (rule 17), Cal's Garden notes: (1) every bed lines up with the room's grid
  (fitted top faces), grow lights drawn along the beds; (2) the Estate with the fountain has no sundial, birdbath or
  topiaries, no lantern in the fountain plaza, the scarecrow by the left wall at every stage; (3) watering: with the beds dry
  they look parched, tapping the watering can in the back corner waters them (24 h) and they look damp; Sprinklers keep
  them damp. The Back Plot's stand is a tile further in.
- DONE by QA (QA findings: pass, 2 small notes). WAITING ON QA: check 29c09a7 (rule 17), your Garden placement fixes and the stand: beds no longer on top of each other (all
  stages); the Kitchen Garden's front spread out (hive and coop front left, shed by the tools, pump by the trellis, gate at
  the walk's end); Grow Lamps are frames over the beds; a crate stand at the Back Plot's gate, the Farm Stand replacing it
  at any stage.
- DONE by QA (QA findings: pass). WAITING ON QA: check 28a51ee (rule 17): the Garden is right of the Restaurant in Kode Plaza (building view, Boba's stack one
  along); with both built, the Restaurant's "Garden" arrow (front right, the kitchen end wall has a gap) and the Garden's
  "Restaurant" arrow (top left, a lit doorway in the back-left wall) walk both ways, at every Garden and Restaurant size.
- DONE by QA (QA findings: lots pass, 3 placement fixes for ROOMS). WAITING ON QA: check 4725457, cd73831 and 5fa3fec (rule 17), the Garden's painted lots: Back Plot, Kitchen Garden and
  Estate, each bare and fully bought. Look for: brick walls showing (no hedge or glass fence over them), beds and tools
  standing on the lawn, nothing poking through a wall, the Estate's walls cut at the stone coping with no black band.
- DONE by QA (QA findings: pass). WAITING ON QA: check f457680 and eb85e90 (rule 17), Cal's last two Restaurant notes: the red crescent booth in the back-left
  corner now opens straight toward the room (new `rdx_curve2`), its table and two seats inside it; the patio's Fire Pit
  Lounge is a real fire pit (new `rsx_firepit2`: stone bowl, three Adirondack chairs, logs). Bistro and Noir.
- DONE by QA (QA findings: pass). WAITING ON QA: check d30bb93 and 642b791 (rule 17). Game Room (Cal's phone notes): the Retro TV now faces the beanbags; Gaming
  Desks is one long desk with one curved screen and keyboard per seat, a chair facing each, the ping pong table clear of
  the chairs. Restaurant, your two menu-board fixes: every dish fits (22 Corner Diner, 26 Noir, the rows grow and long
  names shrink, none runs into its price) and the Corner Diner board clears the painting and the wine wall.
- DONE by QA (QA findings: 3 pass, 2 fixes for ROOMS). WAITING ON QA: check 04bb241 and 0edb26c (rule 17), Cal's Restaurant notes: (1) Bistro and Noir repainted so the back wall
  line is where the room's wall is: tables near the back wall stand in front of it, not on it; (2) Grand Menu Board
  (`r_bigmenu`, Corner Diner and up, after the Digital Menu Screen) lists every dish, two columns, readable; (3) seven gear
  upgrades add dishes to the menu (Espresso Bar, Flat-Top Grill, Fryer, Bakery Rack, Wood-Fired Oven, Grand French Range,
  Charcoal Grill); (4) the red crescent booth (Full Dining Floor) in the back-left corner, open to the room, the window
  booths and their dividers moved down, nothing overlapping; (5) the kitchen half-wall in each look's colours. Your lessons
  2 to 4 (booths over the windows, the patio corner, the cooler) go into the fine-dining furniture pass.
- DONE by QA (QA findings). WAITING ON QA: check 64e4735 (and 1eb8040, 156683a), the Restaurant's painted shells: each size bare and fully bought
  (Hole in the Wall, Corner Diner, Bistro, Noir), with and without the Sidewalk Patio. Look for furniture against the
  painted walls that floats or overlaps a window, the kitchen divider lining up with the kitchen tile, the front door mat.
  Furniture is the old set; Cal wants sleek fine-dining pieces next, so note placement lessons, not sprite tickets.
- DONE by QA (QA findings). WAITING ON QA: check 9be3f51, the Trophy Room: the Lair shows a mystery card before any piece and "Stairs to the Trophy
  Room" after one; buy it, walk up and down by the arrows; the mannequin wears exactly the owned pieces (try two or three
  sets); the building view shows the hall above the Lair. Known: no painted doorway in the Lair (its back wall is the suit
  cases), only the floor glow and the arrow.
- DONE by QA (QA findings). WAITING ON QA: check ab9dc81: the seven freed upgrades show in their menus and can be bought; the Game Room door.
- DONE by QA (QA findings). WAITING ON QA: check the Bedroom wall tiers, f4362b1: buy Fresh Paint, Living Grass Wall and Cove Lighting in turn in
  each of the four Room styles; each changes the walls, brick and slats run the whole left wall, nothing hangs on the grass.
- DONE by QA (QA findings). WAITING ON QA: check walking onto the Patio, 63ac9f3: Bedroom window with a Patio and both dogs, for a few minutes; you
  and the dogs should show in it, walk out through the sliding door (it opens), stand among the Patio furniture, the dogs
  lie on their Patio beds; nobody stands inside furniture.
- DONE by QA (QA findings). WAITING ON QA: check the Patio, ef2ab15: turf, string lights, both dog beds, the door on the front-left edge, and a
  Patio buy showing through the Bedroom glass straight away.

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
- Now: v0.61 (d9d92d7, covering v0.59 and v0.60; Cal waiting to test the Garden), clean copy on 8784. Next: ROOMS's 6f04ed8
  (Game Room). (on 8b35bbc)
- FYI LEAD and ROOMS: TEAMWORK rule 14 (Cal): every Doing line ends `(on <commit>)`; nobody starts until all three name the
  latest commit and nothing they touch is uncommitted elsewhere; LEAD checks it all before every publish and wrap-up.

To do:
- [x] (from LEAD, version check; done: reruns on 3a6fdd5, d7ae577, d0c9ea4 and 961b632, old test copies removed) The economy simulator ran on 1a7b690; game files changed since: 1900b94 (Rafe and Nova
      replace the investors on the team, so different room buffs) and 98210a2 (eleven return visits at +15 XP each). Rebuild on
      the latest commit and rerun. Your test copy `scratchpad/qa/wt-1a7b690` is stale: remove it when done.
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
- [ ] (only when Cal asks, rule 17) Speed sweep at phone size (390 x 844, 4x CPU slowdown): time every tab, the building view and every room (`perf.js` as a
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
- [x] (from LEAD, done: QA findings, drop odds and Relics) Dungeon gifts, now in (9b4cf3a, `29d_dungeon.js`, hook `window.__qbDungeon`): simulate the drop odds
      (`DGLOOT`, `dgRoll`): how many missions, and days at 5 missions a day, to finish each set; does the pity ever fire
      twice running. Then the Relics tab: each relic tier once and never twice, the Trophies sub-tab hidden before the first
      piece, the Trophy Wall a mystery card until then, the buffs applied once (mission pay, quest XP and coins, room income).
- [x] (from LEAD) Economy simulator, before the next publish: the new XP curve, no level locks, prices x ROOMSTEP (commit after
      d6730f0, `docs/PROGRESSION.md`, `docs/ECONOMY.md`). Simulate 30, 90 and 180 days at 200 and 450 XP a day with missions, the
      wheel, level pay and passive income, buying the cheapest next upgrade whenever affordable. Report: level reached, days to
      fill each room, coins piling up unspent. Cal's targets: level 10 in 3 or 4 days, something to buy every day or two, no
      upgrade a week away.
- [x] (from LEAD, done: QA findings) Story scenes (aa0d9ed, `29b_story.js`, test hook `window.__qbStory`): walk a new save from level 1 to the club, every
      scene, "Not yet" and back, lots on the street in order, nothing opening early, and old saves at every stage (no scenes for
      rooms already owned). Add the gates to the economy simulator: how many days each step takes.
- [x] (from LEAD, done: QA findings, income and team) Upgrade income (d523cf1): list every business upgrade marked "Looks only" and flag any that should earn (it sells,
      serves or seats something) or any decor still earning; `upIsDecor` in `29_prices.js`, override per upgrade with
      `{decor:1}` or `{earn:1}`. Team: each buff applies (room income, mission pay), the join banner, missions led by the team.
- [x] (from LEAD) Your effort-first redesign (Cal approved, `WAITING ON LEAD` line under QA findings): LEAD saw `effort_model.py` and is holding all economy work for it. When the
      proposal is in `docs/QA.md`, put a `WAITING ON LEAD` line here and LEAD builds it. Already in, which you can keep or
      undo: room payout tied to quest coins (`29e_economy.js`, `PAYK`, `PAYBASE`), mission pay (`msPay`), the doubled curve.
      Cal decided level trials accept any active photo (62306c1), so the level-4 wall for non-gym players is gone.
- [x] (from LEAD, done: QA findings) Economy simulator rerun on 4a2a143 (5082b0c: room payout limit, mission pay, doubled curve; 9b4cf3a:
      dungeon gifts and set buffs, `window.__qbDungeon`; `window.__qbPay` shows today's payout room). Same three players,
      60 days. Report the same table, plus coins by source in month 2, and the day each set is finished. Blocks v48.
- [x] (from LEAD, done: QA findings and `docs/QA.md`) Writing pass review: read every screen against `docs/VOICE.md` (LEAD's cf7b36a, ROOMS's when done) and
      list lines that still read as corny or written by AI, file and line, with a suggested rewrite. Do not edit them.
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
