# Task board

The one list both chats share (see `TEAMWORK.md` at the top of the repo). LEAD keeps it tidy. Re-read it right
before editing; edit only your own section, except to add a request for another chat.
Details for every item are in `docs/HANDOFF.md`.

CHROME: ROOMS (since 11:05 am)

Live on the phone: `APPV` 47 (friends' page); Cal's pinned test copy: v48 (c6a11c9) (page version 21), 2026-11-05.

---

## LEAD: board, quality of life, Shop and Training code, everything else in the app, publishing

Doing:
- Now: WAITING ON Cal's phone test of v0.48 (pinned, c6a11c9; QA passed it). Cal, 2026-11-05: "nobody plays until we
  have a working version. this is still technically v0.48": no friends' release, the old live page is not touched, the town's
  database rules and the 15-player test wait for a working version. Versions read v0.<APPV> in the game (6b50e0a).  LEAD checked ROOMS's Trophy Room against the dungeon code (headless): the Lair's stairs stay a mystery until the first
  piece, then sell and open the `trophy` room the Relics tab reads. (on 241794c)

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
- [x] `dropbox-leftovers` reviewed (nothing worth bringing over) and deleted with Cal's OK.
- [x] Yawn pilot, code (rig.js flat painted layers, `rigtest/template.html`). Without painted art the stretch renders
      byte for byte as before. Self-check feeding a top's own render back in: about 0.7% of pixels differ on the man (edges),
      2 to 5% on the woman (her long hair over the sleeves: a flat picture sits over or under all of it). Waiting on ROOMS.
- [x] Stretch pose: the gentler yawn (Cal's pick), 0959719. Dark long sleeves still look torn at the elbow, as before.
- [x] `lfvar.json`: a copy is in git at `app/lfvar.json` (0959719). `build.py` does not use it.
- [ ] Town database rules, apply with the v48 publish (live page has none: any Contributor can overwrite any shared row).
      Saves are already private (`data/users/<id>/state`). Declare with the page's db capability:
      `{path:"worlds",read:"view",write:"owner"},{path:"worlds/{self}",read:"view",write:"interact"}` (ids are the player's
      `user.id()`). Board posts and visit pings use `<uid>_<time>` ids, which `{self}` cannot match: move them to
      `board/<uid>/posts/<time>` and `pings/<uid>/sent/<id>` first, then the same two rules for each. Test with two accounts
      (one Contributor, one Viewer) before inviting anyone: QA's 15-player test.
- [ ] Later (Cal, 2026-11-05, "for a much later build"): the level 90 to 100 artifact (ten stone pieces, one a level) and the
      portal to a prestige world (level 1 with a star, a new Loft, currency, characters and story). Full plan in
      `docs/PRESTIGE.md`. Not before the first world feels right.
- [ ] Before release: remove the Test panel, the Shop's Testing row, each room window's Testing undo link, and the
      `window.__qb` / `window.__qbLoft` hooks. Also the phone log (`qbFrame` in `26_world.js`) and the `diag/frame` doc,
      sooner if the Loft height is sorted first.

Ready to publish (ROOMS adds lines here: `READY TO PUBLISH: <what>, look at: <what to check on the phone>`):
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

Art and room code requests (LEAD asks, ROOMS does):
- PART DONE by ROOMS in 4fc1542, waiting on Cal's look (approval 13): the five join banners `ui_team_sable`, `_mara`, `_rafe`,
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
  3. In the building view: draw each team member who has joined (`window.__qbTeam.list()`, ids above) in their own room
     (Mara the restaurant, Rafe at the end of Lock and Key's bar with a crowd round him, Nova filming in the mall, Theo the
     theater, Sable the Lair) with their signature look
     from `TEAM[id].look` and something that makes them stand out from the guests (a name tag, a glow ring, a signature prop).
     Better still, a signature cosmetic each, painted as items (Mara's chef whites exist already as `npc_chef`).
  4. The theater's basics as their own upgrades: a ticket stand and a popcorn and soda machine. Tell LEAD their ids, and Theo's
     scene will wait for exactly those (he is the employee).
- PART DONE by ROOMS in 625d9e3, waiting on Cal's look (approval 12): the story portraits `ui_story_chef`, `_lockkey`, `_mall`,
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
- PART DONE by ROOMS in d48ed81, waiting on Cal's look (approval 15): (1) the six Goblin King icons, (2) `ui_gift`, (5) the six
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
  4. One dungeon-only wearable: the Rift Mask, a mask from another dimension (one sheet, every angle, both bodies, item id
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
- Writing pass (Cal, 2026-11-05: "professional and not corny or too obvious that it is AI"). Read `docs/VOICE.md`, then
  rewrite the room and upgrade lines in your files (`27_rooms.js`, `27b_skins.js`, `data/loft.json`, `data/items.json`,
  room `help` text) to it. Worst offenders to look for: quips at the end ("It probably works.", "Do not touch."), "Obviously",
  exclamation marks, "sleek" more than once a screen. LEAD did `10_app_a.js`'s upgrade lines in cf7b36a as examples.
- DONE by ROOMS in 45930bc, waiting on Cal's look (approval 11): `art/app/bld_loft.webp`, `bld_plaza.webp`, `bld_mall.webp`
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
- DONE by ROOMS in 8caf214, waiting on Cal's look (approval 8): all seven files at these names and sizes are in `art/app`;
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
- DONE in b92a6dd (doorway in the left wall, wardrobe gone; figurine cabinet art next). Bedroom (Cal, 2026-11-05): the wardrobe stands where the Closet entrance belongs; Cal asked ROOMS to make it the figurine
  shelf (on ROOMS's list). Owner: ROOMS.
- Bedroom (Cal): Anime Poster is not obvious: three small random pictures, too close to the right end of the wall. He wants
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
- Now: the Restaurant's art (Cal, 2026-11-05: "start with the base wall piece and keep going from there"), then the Rift
  Mask, Lock and Key, the theater basics and the team in their rooms. Chrome claimed. The Game Room guests wait
  on Cal (his friends' looks). The Loft is ready for QA's full sweep when Cal says go. WAITING ON CAL, all committed and
  NOT ready to publish until he says yes: approvals 6 (bd895a7), 8 (8caf214, LEAD wired it), 9 (a4e2a4a),
  10 (9c30788), 11 (45930bc), 12 (625d9e3), 13 (4fc1542), 14 (6b7b9c8), 15 (dungeon icons, d48ed81), 17 (Restaurant
  base walls, 1eb8040). 15-minute loop running (rule 16). (on 1eb8040)
- WAITING ON QA: check 9be3f51, the Trophy Room: the Lair shows a mystery card before any piece and "Stairs to the Trophy
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
- Now: nothing running. Next: whatever is WAITING ON QA; Cal's phone notes on v0.48 when they come. (on 8938b09)
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
