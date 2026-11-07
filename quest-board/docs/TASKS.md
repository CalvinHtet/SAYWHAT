# Task board

The one list both chats share (see `TEAMWORK.md` at the top of the repo). LEAD keeps it tidy. Re-read it right
before editing; edit only your own section, except to add a request for another chat.
Details for every item are in `docs/HANDOFF.md`.

CHROME: ROOMS (Higgsfield: NICE COCK, Garden art)

Live on the phone: `APPV` 47 (friends' page, nobody plays it); Cal's pinned test copy (his Test link, republished in place): v0.71 (3840577, slug HJhVjFH6), 2026-11-07, the only one pinned. LEAD keeps only the newest version pinned.

---

## LEAD: board, quality of life, Shop and Training code, everything else in the app, publishing

Doing:
- Now: CAL (2026-11-07): "Do a full QA check and send me the latest version to test. Show me all the cutscenes and visitors and
  unlocks in this next test pass so I can give my opinion. And then I'll give the next task for everyone." v0.66 built from 465d39a
  (APPV 66; since v0.65: KAIMANA Feb 1, OAKMONT Feb 8, SØLVBERG Feb 15, and Test > Review: every story scene, room
  welcome, team join, return visit, friend visit, new area, UI upgrade, reward, big upgrade and brand drop in order, each with
  Play, nothing saved; 114 of 114 open, save unchanged). Clean build, 490 files, no page errors. WAITING ON QA for the full set,
  then the publish session publishes it and LEAD sends Cal the how-to. Brands: Cal stopped them at 16 (rule 19 PAUSED). Cal asked
  about the database limits: 25,000 documents per version (about 4-7 per player); our town hall reads only 60 boards and 200
  pings, unordered, so it breaks past about 60 players; fix offered, Cal's call. CAL (2026-11-07): about 10 players, "synced perfectly so we can all see each others progress"; "perfectly consistent for
  everyone ... publish a new version at 4 am when they are all asleep": RELEASING "Two links, and the 4 am publish" (one Live artifact
  republished in place, one Test artifact, Live only at 4 am PT by a scheduled task). QA held v0.66 for one thing (the boba scene's "M" box); fixed in v0.67 = d54de89 (portrait fallback, 7 of 7 scenes; plus live
  sync), clean build, 490 files, Review 114 of 114 with the save unchanged, livesync.js PASS, no page errors: WAITING ON QA. Next build (v0.68): Cal's "I don't like the crt scan lines. And the red hue it too aggressive" (59d31a0: Starlight
  for scanlines, softer vignette and edge glow, no overlay on the Loft or rooms) and "The light on option should not matter for the
  other rooms. Only the bedroom" (ROOMS abe06dd, QA 2f3d3a6), Cal's "!" on tabs and buildings and "+" on new rooms (3bba5f1,
  app/src/29o_alerts.js; rigged headless: Restaurant via Mara, a new tab, a new brand), and from ROOMS: Cal's restaurant notes (93d33f1,
  QA passed 9a946ed), the wall shelf, the menu board and no zoom in room windows (4e93d54, with QA); people keep their places through a purchase and
  new pieces pulse gold (1308059, with QA). CAL (2026-11-07) on the Restaurant's bar: "No I want the bar to be available
  after it starts to look like a fine dining luxury restaurant": r_bar needs Fine Dining Service (r_t3), hidden until then (ROOMS). QA's ba1758a: level-opened tabs get their "!" (d0adfdc), the Garden lot at level 5 (ROOMS). CAL: "Give me the latest
  version to test when ready": v0.68 BUILT from e276038 (APPV 68; 9b3a428 plus QA's 3f6c696 fix: neighbors drawn in their own outfits; everything above plus ROOMS's 633ffe2 bar rule, ede09d8 Garden at
  level 5, 0f9cabe splash text); clean build, 490 files, loads clean, Review 114/114 save unchanged, livesync PASS, alerts PASS:
  QA PASSED the full set (6430d13) and it is staged in r/. WAITING ON CAL: publish v0.68 to the Test link now, or hold
  for ROOMS's placement fixes (QA's 13, the pinball first; none new in v0.68). ROOMS's placement fixes PASSED (570b2f3, QA ad05db6); v0.69 BUILT from c2c53b7 (APPV 69: v0.68 + ROOMS's room fixes,
  placement 570b2f3, Nightclub staff 567ea26, screens cfa5f62/1ab3753); clean build, 490 files, loads clean, Review 114/114, livesync
  PASS, alerts PASS: QA PASSED the full set; PUBLISHED in place on Cal's Test link (69a368c), r/ and the worktree removed; if QA passes them before Cal answers, LEAD builds
  v0.69 with everything (v0.68 + ROOMS's room fixes + placement + 1ab3753) for QA's full set and publishes that instead. Live sync (019f21f, app/src/29n_live.js):
  progress up 4 s after a change, worlds/board/pings pushed down via onSnapshot; rigtest/lead/livesync.js with three players on a
  pushing stand-in db: 1-5 s, pushes off still within 60 s. Checked against the platform's db.d.ts (0.2.96): onSnapshot(next, error) returns an unsubscribe;
  errors are terminal, only "unavailable" re-subscribes. Waiting on Cal: which artifact is Live, a launch date, a QA restart
  for the published-file checks, opening v0.66 on his phone. For v0.69: ROOMS's 62d336d (screens keep a still first picture with animations off; now in 24_screens.js, cfa5f62; ROOMS drops its
  wrapper; QA passed ROOMS's v0.69 room fixes, c9a940e) and dbf2593 (open-air rooms dark at night again). v0.70 BUILT from 10240e8 (APPV 70; 396376b plus QA's story-read fixes): Cal's "Unlock everything" (0f7ce90, QA's two fixes: Next story step skips
  the Speakeasy, the Walk-in Closet comes with its wardrobe) and "every story beat ... make sense" (40c4b14). Clean build, 490 files,
  loads clean, Review 114/114, Play the whole story 57/57 with the save unchanged, livesync PASS: WAITING ON QA for the full set,
  unlockall.js and a read of the whole story for sense. v0.71 BUILT from 3840577 (APPV 71; built now rather than batched, as the lag fix matters for Cal's own testing): clean build,
  490 files, loads clean, Review 119/119, the whole story 64/64 save unchanged, livesync PASS, the effects behind a room window paused
  (frame rates on this Mac are noisy: load average 27). WAITING ON QA for the full set. It has: the phone-lag fix (19ef0d9: Cal's iPhone logged room windows at 37-38 fps with 214/421 ms frames on v0.67; the effects behind an open window now pause, 25 -> 60 fps at CPU x4), Cal (via QA) "I want 4 different animations of when the visitors come visit our base. I want each visit to be unique":
  done in f7a43bb (door, ride, drop, pop; never twice running), QA passed; QA's two cosmetic notes fixed in 90d5653 (drop and pop clipped to the picture area), rides in v0.71. The arms-up tearing (7d7c5df): stretchUp is used nowhere in play; the in-game stretch swaps in each top's painted yawn picture, and 44
  tops (every brand from NICE COCK on: nc_*, kp_*, sm_*, smk_*, gp_*, sp_*, bb_*, cr_*, km_*, oak_*, sv_* tops) have none, so they
  tore. Now those stretch with arms down (yawn face kept); QA passed (painted tops pixel-identical, other poses unchanged). QA's long-hair note: the fallback now keeps the standing spine/head too (e3278f0), so no hair gaps; a small notch where long hair crosses the near sleeve is in plain idle too (pre-existing; QA logged it). Drawing all hair after
  the arms put long side hair over both arms (tried, reverted); ROOMS cuts f_h1front_front.webp (the lock
  stays in the main hair too); LEAD's hairFront slot is in 4f30ef5 (group 6, idle byte-identical without the file). The lock landed in 30d93a9; QA passed the sweep (all 65 tops, 4 poses, 4 colours, hats; other hair and back views pixel-identical). ROOMS: their yawn pictures are on ROOMS's list (Unlimited only). Two rig
  experiments that did not help, reverted: dropping arm art outside the arm's tube, and lowering stretchUp's arms (holes). Next: Cal's v0.71 playtest notes; the next version carries the yawn fallback (7d7c5df, e3278f0),
  hairFront (4f30ef5) and ROOMS's yawn pictures as they pass; rigtest/matrix.html now knows which art exists (c4c8e53). (on c4c8e53)
- v0.71 PUBLISHED in place on Cal's Test link (HJhVjFH6), 491 files (25 top-level + 466 art), same 9 db rules, user, sample images; still the only pinned version, so Cal's saves carry over. The publish session checked r/ against 3840577's clean build (release/v71 and QA's wt-3840577, diff -r, lfvar.json = app/lfvar.json) and every published size against r/ (index.html +364 bytes, the publish wrapper); no art added, removed or changed since v0.70, so no leftovers. 3 publishes for the 64 MB cap (versions 13-15). r/ left for LEAD. WAITING ON QA: check the published files once QA's artifact tools are back. (on eda711d)
- v0.70 PUBLISHED in place on Cal's Test link (HJhVjFH6), 491 files (25 top-level + 466 art), same 9 db rules, user, sample images; still the only pinned version, so Cal's saves carry over. The publish session checked r/ against 10240e8's clean build (release/v70 and QA's wt-10240e8, diff -r, lfvar.json = app/lfvar.json) and every published size against r/ (index.html +364 bytes, the publish wrapper); no art added, removed or changed since v0.69, so no leftovers. 3 publishes for the 64 MB cap (versions 10-12). r/ left for LEAD. WAITING ON QA: check the published files once QA's artifact tools are back. (on 7e25ded)
- v0.69 PUBLISHED in place on Cal's Test link (HJhVjFH6), 491 files (25 top-level + 466 art), same 9 db rules, user, sample images; still the only pinned version, so Cal's saves carry over. The publish session checked r/ against c2c53b7's clean build (release/v69, diff -r, lfvar.json = app/lfvar.json) and every published size against r/ (index.html +364 bytes, the publish wrapper); no art added, removed or changed since v0.67, so no leftovers. 3 publishes for the 64 MB cap (versions 7-9). r/ left for LEAD. WAITING ON QA: check the published files once QA's artifact tools are back. (on 0f7ce90)
- v0.67 PUBLISHED in place on Cal's Test link (HJhVjFH6), 491 files (25 top-level + 466 art), same 9 db rules, user, sample images; still the only pinned version. The publish session checked r/ byte for byte against d54de89's clean build (release/v67) and every published size against r/ (index.html +364 bytes, the publish wrapper); no leftover files from v0.65. Top-level is 69 MB, over the 64 MB per-publish cap, so it went in 3 publishes (versions 4-6). r/ left for LEAD. WAITING ON QA: check the published files once QA's artifact tools are back. (on e96a56f)

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
      REAL NUMBERS again 2026-11-07 (APPV 67): room windows 37-38 fps, worst 214/421 ms; fixed in 19ef0d9. Earlier: REAL NUMBERS, 2026-11-06 11:58, Cal's iPhone (iOS 18.7, Claude app, 440x956, dpr 3, 4 cores) on v0.53, the Loft with a
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
- DONE by QA (QA findings: pass, publish; Cal accepted two known items). WAITING ON QA: check v0.61, d9d92d7, in place of v0.60 and v0.59 (rule 18: your pass publishes it). New over v0.60, Cal: "Once
  ready, publish so I can test the garden. Start me at level 5 as if I've just completed the job advancement". QB_TEST_START = 5
  (29_prices.js): a brand-new character (ccdone, first time only; old saves untouched) starts at level 5 XP with gate 5 passed
  and the areas below level 5 open (Board, Training, Shop, Dungeons, Loft, Hall), unlockDay free. The class is still chosen by
  the player (the Board's Class Awakening card). `shots/teststart.js`: name, Begin -> level 5, gates 5, the Garden lot offered
  about 6 s later, no page errors. On the Before release list now: QB_TEST_START back to 0.
- DONE by QA (QA findings: pass). WAITING ON QA: LEAD's 3d7f57a, the level-5 test start's coins (your note on d9d92d7). A new test character gets what a real
  level-5 player has earned: quest pay on the XP so far (2.5 per XP) plus the pay for levels 2-5, 1,205 coins, with lvPaid = 5
  so the next level-up pays only its own level (`shots/lvnext.js`: 1,205, then 1,365 at level 6). Not the Garden's 1,500 yet,
  as for a real player; Add 10,000 coins still covers testing. Goes into the rebuilt v0.61 with ROOMS's Garden lot.
- DONE by QA (QA findings: the code passes; stage 0 waits on bld_plaza_s0). WAITING ON QA: LEAD's 2882690, Kode Plaza's street picture by stage (`app/src/29j_plaza.js`, overrides bldArt for "plaza"; 26_world.js
  untouched). Stage = plaza rooms owned (garden, restaurant, boba, dessert, skybar, rooftop, speakeasy, counted by name) - 1:
  0 -> bld_plaza_s0.webp (open plaza; until ROOMS paints it, the plain drawn front, never the café), 1 -> bld_plaza.webp,
  k >= 2 -> the highest bld_plaza_s<j>.webp painted with j <= k, else bld_plaza.webp. `shots/plazastage.js`: every stage
  right with and without s0/s2 present, the street draws, no page errors. Tapping still opens the rooms (unchanged).
- DONE by QA (QA findings: pass). WAITING ON QA: LEAD's 38e1ab7, the Kode Plaza sign over the open plaza (ROOMS: bld_plaza_s0 is painted lower in its 894x1100 frame,
  so the sign floated). 29j_plaza.js moves the sign down to 30 px above where the painting starts (top 37.3% of the frame is
  empty) for pictures listed in PLAZATOP; the café stage and every other building are untouched; 26_world.js untouched.
  `shots/plazasign.js`: Garden only, the sign at y 210 (was 105), just over the trees; with the Restaurant, back at 105; no page
  errors (`shots/v61/plazasign_gardenonly.png`). Check with ROOMS's 9189946.
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
- QA, ROOMS's yawn picture 28 (e70ef55: bb_doublet, BARD & BLADE) on a clean build of e70ef55: PASS, 0 page errors. It stretches
  arms-up on both bodies (the wine velvet doublet); stretch frames 3 to 21 changed, nothing else
  (shots/qa/yawn/batch14_before_after.png). On hot pink at 3x, frames 9, 12 and 15: the puffed, slashed upper sleeves show cream
  lining in every slash, not background; the ruffled cuffs and collar sit at the wrists and neck; the sleeves wrap both arms
  (bb_doublet_sleeves.png, bb_doublet_shorthair.png). The art has no enclosed see-through holes. Sweep: all hairstyles with all 19
  neck items plus none, 120 pictures, all clean (sheet_bb_doublet_<body>.png). 28 of the 44 done and checked.
- QA, ROOMS's yawn pictures 26 and 27 (56f58a2: bb_tunic, bb_gambeson, BARD & BLADE) on a clean build of 56f58a2: PASS, 0 page
  errors. Both stretch arms-up on both bodies (the forest-green laced tunic with its belt; the cream quilted gambeson with open
  collar); stretch frames 3 to 21 changed, nothing else (shots/qa/yawn/batch13_before_after.png). The tunic's repaint: the far
  sleeve wraps the whole arm on both bodies, no strip of arm under it, frames 9, 12 and 15 at 4x on hot pink
  (bb_tunic_farunderarm.png, bb_tunic_underarm.png). See-through: the tunic's art has one enclosed hole per body, 94 px boy and
  84 px girl, both at the laced V neck (the passed sp_pad has 283 px at its neckline); the gambeson has none. In the game, on hot
  pink, no pink shows through either top, and the V neck and open collar show skin (bb_tunic_gambeson_seethrough.png). Sweep: all
  hairstyles with all 19 neck items plus none, 240 pictures, all clean (sheet_<top>_<body>.png). 27 of the 44 done and checked.
- QA, ROOMS's yawn pictures 24 and 25 (edefc90 sp_p2, 45658f8 sp_hpknit) on a clean build of 45658f8: PASS, 0 page errors.
  Both stretch arms-up on both bodies (the Player 2 ringer tee with purple trim; the sage cable knit with long sleeves and ribbed
  cuffs); stretch frames 3 to 21 changed, nothing else (shots/qa/yawn/batch12_before_after.png). sp_p2's repaint: PLAYER and 2 read
  in frames 9, 12 and 15 at 4x (sp_p2_print.png; the girl's default long hair covers "PL", as it covers any print). No outline
  residue: against the passed sp_pad, same hair, sp_p2 adds 3 pixels on the boy and 35 on the girl, all at her hem, none around the
  head or legs; on a light background no arc or dark edge shows (sp_p2_hpknit_residue.png). sp_hpknit's red hearts keep their colour
  in the stretch: median (187,67,71) boy and (194,66,64) girl against (195,63,64) and (194,67,58) in idle (sp_hpknit_hearts.png).
  Sweep: all hairstyles with all 19 neck items plus none, 240 pictures, all clean (sheet_<top>_<body>.png). SAVE POINT is
  complete; 25 of the 44 done and checked. Also on 68eb5aa: savecheck all passed; screens.js at 360 and 390 fit with no errors.
- QA, ROOMS's yawn pictures 22 and 23 (68eb5aa: sp_varsity, sp_pad) on a clean build of 68eb5aa: PASS, 0 page errors. Both
  stretch arms-up on both bodies (the purple varsity jacket with grey sleeves and teal cuffs; the grey controller-button tee);
  stretch frames 3 to 21 changed, nothing else (shots/qa/yawn/batch11_before_after.png). sp_pad's repaint: both short sleeves wrap
  the upper arms on both bodies, with no sleeve hanging under a raised arm and no dark hollow, frames 6 to 18 at 3x
  (sp_pad_shoulders.png), and the girl's far shoulder at 6x with short hair against the passed varsity and star hoodie
  (sp_pad_f_shoulders.png, sp_pad_f_farsleeve.png). Sweep: all hairstyles with all 19 neck items plus none, 240 pictures, all
  clean (sheet_<top>_<body>.png). 23 of the 44 done and checked.
- QA, ROOMS's yawn pictures 20 and 21 (360da8a: gp_star, gp_sailor) on a clean build of 360da8a: PASS, 0 page errors. Both
  stretch arms-up on both bodies (the lilac star hoodie; the sailor blouse's puff sleeves with bare forearms); stretch frames 3 to 21
  changed, nothing else (shots/qa/yawn/batch10_before_after.png). gp_star's neck, where the drawn mouth was removed, is clean on both
  bodies in frames 9, 12 and 15 at 4x (gp_star_neck.png). gp_sailor's pink neckerchief keeps its colour in the stretch: median
  (223,135,163) boy and (220,131,160) girl against (228,135,168) and (231,132,165) in idle, no magenta shift (gp_sailor_neck.png).
  Sweep: all hairstyles with all 19 neck items plus none, 240 pictures, all clean (sheet_<top>_<body>.png). GACHA POP is complete;
  21 of the 44 done and checked.
- QA, ROOMS's yawn pictures 18 and 19 (2d2ea91: gp_blazer, gp_bear) on a clean build of 2d2ea91: PASS, 0 page errors. Both
  stretch arms-up on both bodies (the pink blazer with its lilac bow; the blue bear onesie top with its cream belly); stretch frames
  3 to 21 changed, nothing else (shots/qa/yawn/batch9_before_after.png). The blazer's repaint: the boy's right side under the arm is
  one pink sleeve edge, no strip of body and no doubled dark line, frames 9, 12 and 15 at 4x and 5x (gp_blazer_underarm.png,
  gp_blazer_underarm_5x.png, next to the passed smk_jacket). Sweep: all hairstyles with all 19 neck items plus none, 240 pictures,
  all clean (sheet_<top>_<body>.png). 19 of the 44 done and checked.
- QA, ROOMS's yawn pictures 16 and 17 (b62c0a2: smk_vest, smk_cloak) on a clean build of b62c0a2: PASS, 0 page errors. Both
  stretch arms-up on both bodies (the puffer vest over its cream undersleeves; the cloak's short sleeves, bare forearms and jagged
  hem over the trousers); stretch frames 3 to 21 changed, nothing else (shots/qa/yawn/batch8_before_after.png). The vest's neck,
  where the drawn mouth was removed, is clean on both bodies (smk_vest_neck.png, 3x). Sweep: all hairstyles with all 19 neck items
  plus none, 240 pictures, all clean (sheet_<top>_<body>.png). SMOKE BOMB is complete; 17 of the 44 done and checked.
- QA, ROOMS's yawn pictures 14 and 15 (aab35f3: smk_jacket, smk_mesh) on a clean build of aab35f3: PASS, 0 page errors. Both
  stretch arms-up on both bodies (the jacket's orange panels and cuffs; the mesh sleeves under the black wrap with its orange
  sash); stretch frames 3 to 21 changed, nothing else (shots/qa/yawn/batch7_before_after.png). The mesh's neck and collar, where
  the drawn mouth was removed, are clean on both bodies: no stray mark, no hole (smk_mesh_neck.png, 3x). Sweep: all hairstyles with
  all 19 neck items plus none, 240 pictures, all clean (sheet_<top>_<body>.png). 15 of the 44 done and checked.
- QA, ROOMS's yawn pictures 12 and 13 (f18de4c: sm_tee, sm_vest) on a clean build of f18de4c: PASS, 0 page errors. Both stretch
  arms-up on both bodies (the GO OFF print readable; the utility vest's straps over the black undershirt sleeves); stretch frames 3
  to 21 changed, nothing else (shots/qa/yawn/batch6_before_after.png). Sweep: all hairstyles with all 19 neck items plus none, 240
  pictures, all clean (sheet_<top>_<body>.png). 13 of the 44 done and checked.
- QA, ROOMS's yawn pictures 10 and 11 (57dafa4: kp_bomber, sm_track) on a clean build of 57dafa4: PASS, 0 page errors. Both
  stretch arms-up on both bodies (the star bomber's striped cuffs at the wrists; the track jacket's cyan stripes along the raised
  sleeves); stretch frames 3 to 21 changed, nothing else (shots/qa/yawn/batch5_before_after.png). Sweep: all hairstyles with all
  19 neck items plus none, 240 pictures, all clean (sheet_<top>_<body>.png). 11 of the 44 done and checked.
- QA, LEAD's c4c8e53 (rigtest/matrix.html knows which pictures exist): checked on a clean build of bf08f94 (artnames.json written,
  48 KB): the stretch sheet now matches the game; sv_quilt and cr_bomber (no yawn art) keep the arms down, o_tee and kp_sailor (yawn
  art) raise them. QA can use the matrix again for the yawn batches. Info, no owner.
- QA, ROOMS's yawn pictures 8 and 9 (25939d4 nc_qzip, bf08f94 kp_sailor) on a clean build of bf08f94: PASS, 0 page errors. Both
  stretch arms-up on both bodies (the quarter-zip's cuffs at the wrists with the emblem on the raised sleeve; the sailor blouse's
  puffed short sleeves with bare forearms, the red tie in place); stretch frames 3 to 21 changed, nothing else
  (shots/qa/yawn/batch4_before_after.png). Sweep: all hairstyles with all 19 neck items plus none, 240 pictures, all clean
  (sheet_<top>_<body>.png). 9 of the 44 done and checked. Tool note: yawnfall.js and yawnsweep.js now ask the rig for the exact
  frame (QBLoft.frame) instead of frameOrNear, which sometimes gave an earlier frame on the slower female body; that was the
  occasional "idle 16 changed" in earlier batches. The earlier sweep sheets showed the right poses, so those results stand.
- QA, LEAD's hairFront slot (4f30ef5) with ROOMS's front lock (30d93a9), on clean builds of bc4a575 (before) and 30d93a9 (after),
  drawn the game's own way (`rigtest/qa/hairfront.js`, 337 pictures each): PASS, 0 page errors. The idle notch is gone: the long
  hair's front lock now lies solid over the near sleeve, no dots, and the hoodie's yellow stripe no longer shows through it
  (shots/qa/hairlock/before_after.png). Female, long hair, all 65 tops that fit her: idle, walk, sit and stretch all draw the lock
  (all_tops_idle.png, all_tops_stretch.png); in the stretch it sits in front of the raised sleeve on the painted tops; on four
  painted tops with a hood or high collar (o_puffer, nc_hoodie, sm_hoodie, sv_ski) the stretch is unchanged and reads fine. The lock
  matches black, brown, blonde and auburn hair; hats trim it like the hair (halo mask, beanie, straw hat, bucket hat, bow), and the
  cat hood keeps the hair inside, lock and all (colours_hats.png). Pixel-identical: the back views (8 of 8) and every other style
  (m h1, h2, h3 and f h2, h3 with three tops in idle, walk and stretch: 45 of 45). Not on a real phone.
- QA, ROOMS's yawn pictures 6 and 7 (bc4a575: nc_tank, kp_hoodie) on a clean build of bc4a575: PASS, 0 page errors. Both
  stretch arms-up on both bodies (the tank's bare painted arms; the cloud hoodie's cuffs at the wrists, its lightning stripe on
  the raised sleeve); only stretch frames changed (shots/qa/yawn/batch3_before_after.png). Sweep: all hairstyles with all 19
  neck items plus none, 240 pictures, all clean, no stray edges on the tank's bare shoulders (shots/qa/yawn/sheet_<top>_<body>.png).
  7 of the 44 done and checked.
- QA, ROOMS's yawn pictures 4 and 5 (653138e: sm_hoodie, sv_ski) on a clean build of e3278f0, drawn the game's own way: PASS,
  0 page errors. Both now stretch arms-up on both bodies instead of the arms-down fallback; the neon hoodie's cuffs stop at the
  wrists with the hands showing; nothing stray on the ski jacket's head; only stretch frames changed (one idle frame differed,
  the frameOrNear neighbour-frame noise) (shots/qa/yawn/batch2_before_after.png). Sweep: all three hairstyles of each body with
  all 19 neck items plus none, 240 pictures, every necklace on the chest and the hair whole (shots/qa/yawn/sheet_<top>_<body>.png).
- QA, LEAD's e3278f0 (yawn fallback keeps the standing spine, head and pelvis), long hair, on clean builds of 7d7c5df and
  e3278f0 with six tops still on the fallback (cr_bomber, bb_cloak, kp_hoodie, cr_trench, nc_tank, gp_bear), both bodies: PASS. The
  comb-like gaps are gone: the stretch is now the standing pose with the yawn face, and on the female body with long hair it
  matches idle (shots/qa/yawn/fallback_fixed_and_idle_notch.png: rows are before, after, and idle). Only stretch frames changed.
  (Test note: QBLoft.frameOrNear sometimes gives a neighbouring frame, so the same build drawn twice differed on 1 of 64 frames;
  two idle-16 differences between the builds were that, not a change.)
- QA, new, pre-existing (LEAD's note): in plain idle, the female body with long hair (h1) has a notched, dotted edge where the
  front strand of hair crosses the near sleeve, and the sleeve shows through it (the yellow stripe through the hair on kp_hoodie,
  dots on bb_cloak, cr_bomber, cr_trench, gp_bear, nc_tank): bottom row of shots/qa/yawn/fallback_fixed_and_idle_notch.png. Worth
  fixing: idle is the pose players see most, and long hair is the female default. Owner: LEAD (sleeve drawn after the hair).
- QA, ROOMS's first three yawn pictures (2dde59c nc_hoodie, 8f026ce nc_tee, 05e7c19 kp_varsity) on a clean build of 05e7c19,
  drawn the game's own way: PASS, 0 page errors. Before (7d7c5df) they used the arms-down fallback; now each has its painted
  arms-up stretch on both bodies, sleeves to the wrists, no tears; only the stretch frames changed, idle and walk pixel-identical
  (shots/qa/yawn/batch1_before_after.png). Nothing stray on the tee's head. The sweep (`rigtest/qa/yawnsweep.js`): each top in
  the stretch with all three hairstyles of each body and all 19 neck items plus none, 360 pictures: every necklace sits on the
  chest, the hair is whole (no fallback gaps), the wings and headphones sit right (shots/qa/yawn/sheet_<top>_<body>.png).
- QA, LEAD's yawn fallback (7d7c5df), seen while checking ROOMS's first yawn pictures: on the female body with long hair, in the
  stretch with the arms-down fallback, the hair falling over her right shoulder has a broken, comb-like edge and the top shows
  through the gaps (a white sliver on nc_tee and kp_varsity before their pictures, the yellow stripe through the hair on
  kp_hoodie, brown on bb_cloak, red and white on sv_ski; o_tee with its painted yawn is clean). shots/qa/yawn/
  fallback_hair_gaps.png (stretch frame 12, female, hair h1). It looks like the hair is cut for the painted arms-up pose while
  the arms are down. It goes away top by top as ROOMS paints the 44, but until then 41 tops show it on long hair. Owner: LEAD.
- QA, LEAD's 7d7c5df yawn fallback (rig.js), drawn the game's own way (QBLoft.warm + frameOrNear, with the art pack and list) on
  clean builds of c012014 (before) and 7d7c5df (after) (`rigtest/qa/yawnfall.js`): PASS. (1) sv_ski, cr_bomber, bb_cloak and
  kp_hoodie on both bodies: before, the arms went out sideways and the sleeves tore (white patches on the ski jacket, ragged
  cloak and hoodie sleeves); after, the arms stay down at the sides, no tears, the yawn face (eyes closed) still plays; only the
  stretch frames that use the painted pose changed (3 to 23). (2) o_tee and the starter tee: every frame pixel-identical, still
  the painted arms-up yawn. (3) idle, walk and stretch frame 0 pixel-identical for all six tops. Picture: shots/qa/yawn/
  yawn_before_after.png (stretch frame 12, before then after, m and f). Note for QA's own tools: rigtest/matrix.html cannot show
  this, because it has neither the art list nor the art pack, so the rig there assumes every yawn picture exists.
- QA, extra on v0.71 (3840577) while waiting: every room window's frame rate after the lag fix (`rigtest/qa/roomfps.js`), all 21
  rooms fully bought, 390x844 at x3, CPU 4x slower: every window 59-60.5 fps, worst frame 17 ms (Bedroom and Theater 33 ms), no
  frame over 50 ms, 0 page errors. Not measured: windows with customers walking (a fresh Unlock-everything save drew none in the
  Restaurant, Nightclub, Theater or Arcade at 21:00, opened from their buildings), and not on a real phone. Info, no owner.
- QA, v0.71 = 3840577 (APPV 71), the full set on a clean build (490 files): PASS, publish, 0 page errors anywhere. visits.js PASS
  (four arrivals at 360 and 390, one and two friends, nothing over the names or past the card at any frame, reduced motion, 12 real
  visits with all four and none twice running); lagcheck.js PASS (Game Room and Restaurant windows at CPU x4: v0.70 28.8/29.3 fps,
  worst 117/50 ms; v0.71 60.3/60.3 fps, worst 17/17 ms; every window's own animations run, nothing left paused after closing);
  unlockall.js PASS (fresh and mid-game; my buy loop now reopens a window before giving up, it had stopped on a Garden window still
  redrawing: every Garden upgrade buys on v0.70 and v0.71); the whole story 64 parts, "Traveling"; Review 119/119 on both bodies;
  livesync, live10, players10 PASS (a first players10 run had one page write 3 times in the quiet minute under load 27; rerun 0-2);
  alerts, FX, room windows, bar rule PASS; badges all from the pack; drops PASS; all 21 rooms buy through; only the Bedroom has a
  lamp; guests at most 5, no duplicates. Not on a real phone: the lag fix is Cal's to feel on his iPhone.
- QA, LEAD's 19ef0d9 phone-lag fix (Cal's iPhone: room windows 37-38 fps, worst frames 214 and 421 ms), on clean builds of
  10240e8 (before) and 19ef0d9 (after), 390x844 at x3 with the CPU 4x slower, every upgrade bought (`rigtest/qa/lagcheck.js`):
  PASS, 0 page errors. Game Room window 32.5 -> 60.3 fps, worst frame 100 -> 17 ms, frames over 50 ms 5 -> 0; Restaurant 33.3 ->
  60.3 fps, worst 50 -> 17 ms. A room window, a level-up, a visit card, a story scene and a Review play each opened and closed:
  inside each window nothing is paused (the level-up and visit cards' 8 animations, the scene's 3, the welcome's 2 all run); behind
  it the Board's 19 effects (edge, sweep, spin, holo, the tab "!") pause while it is open; after it closes all 19 run again, 0
  paused, no window left; the tab "!" bounces again. Not on a real phone: the iPhone numbers are Cal's to confirm on v0.71.
- QA, v0.70 = 10240e8 (APPV 70), the full set: PASS, publish, 0 page errors anywhere. On a clean build of 10240e8: unlockall.js
  PASS (fresh and mid-game saves; Next story step "The story has no steps left"; every upgrade in every room buys through; it gives
  the openers' prerequisites bd_ward1, bd_win2, bd_win3 and r_t1-r_t3 up front, as buying the openers would, so those six are not
  seen being bought); the whole story re-read, 64 parts in order, all 8 notes from c5739a7 fixed (one leftover: Rafe's title still
  says "Travelling" while the rest now spells favor, parlor); Test > Review 119 of 119 on both bodies at 390, nothing off screen or
  broken. On 396376b (the same code outside the story, welcomes and tester): livesync, live10 and players10 PASS; alerts, FX, room
  windows, bar rule PASS; badges all from the pack; drops PASS (0 repeats in 192 rerun slots); all 21 rooms buy through; only the
  Bedroom has a lamp; every business at most 5, no duplicate looks. Not on a real phone.
- QA, LEAD's 90d5653 (QA's two arrival notes) on a clean build of 90d5653: PASS. visits.js now also checks every frame (0, 0.2,
  0.45, 0.7, 1.1, 2 s) that no friend's visible picture crosses the names or the card's edge; it caught both on f7a43bb (drop and
  pop at 0.45 and 0.7 s) and finds none on 90d5653, at 360 and 390, one friend and two; reduced motion and the 12-visit rotation
  (all four, none twice running) still pass. Mid-spin the second friend is now cut at the picture area's edge rather than poking
  out (shots/qa/visits/arrivals_fixed_360.png). For v0.71.
- QA, LEAD's f7a43bb, Cal's four visit arrivals, on a clean build of f7a43bb (`rigtest/qa/visits.js`): PASS, two cosmetic notes,
  0 page errors. At 390 and 360, one friend and two: Knock knock (the door swings open, they step through), Someone pulled up
  (skid in, dust), Look who dropped in (fall, squash, shadow), Surprise! (spin up) all end with the friends at rest inside the
  card, the door and dust gone, the Nice button reachable, and the page never wider than the screen. Reduced motion: the friends
  are there from the first frame, no door. 12 real visits on 12 days (__qbFriends.force): pop door pop door pop drop ride pop drop
  door ride pop, all four used, never the same twice running; after a reload the day's visit keeps its arrival. Frames at 0, 0.2,
  0.45, 0.7, 1.1 and 2 s: shots/qa/visits/arrivals_strip.png. Notes: (1) the drop passes the falling friends across the names and
  the "Look who dropped in" line for about half a second (0.45-0.7 s); (2) in Surprise! the second friend pokes past the card's
  right edge mid-spin (0.7 s). Owner: LEAD. Not on a real phone.
- CAL (2026-11-07, to QA, passed on as said): "I want 4 different animations of when the visitors come visit our base. I want each
  visit to be unique." Not QA's to build; for LEAD to assign. QA reads it as the friend visits (29k_friends.js: the visit card,
  the banner and the friend walking into The Loft), four distinct arrival animations rotating so no two visits in a row look the
  same; it may also mean neighbours' "Say hi" walk-ins (socVisitors). Worth asking Cal which. QA will check them when they land.
  Owner: LEAD.
- QA, LEAD's 40c4b14 (Cal: "every story beat and character cutscenes to make sense"), on a clean build of af12b92: the gates
  PASS (storygates.js: Lock and Key closed without White Linen, open with it; Nova closed without the Clothing Store, open with it),
  Review > Play the whole story plays all 57 parts at 390 with 0 page errors and saves nothing (only an empty story.beats appears).
  The whole text, in order: shots/qa/story/story_af12b92.md (`rigtest/qa/storyread.js`). Read through once; it mostly holds
  together (Mara before she is named, "another investor" after Desmond, Theo after the ticket stand, Nova outside the clothing
  store, Desmond's white linen). Lines that do not fit, most visible first:
  (1) Where the Theater is: Step 10 says "the lot next door could be a movie theater", then Priya says "A movie theater. In our
      strip mall." (and it sits in the Mall's building). Pick one.
  (2) Where the Rhythm Room and VR Arena are: the Arcade's welcome says "A Rhythm Room upstairs, and a VR Arena next door", then
      Step 13 says the arcade's "back room" and Step 14 its "other back room". The room windows agree with the welcome.
  (3) No "New room" welcome for the Rhythm Room, VR Arena, Karaoke and Nightclub; every other story room (Garden to Bowling) has one,
      so the last four steps are a bare step card each.
  (4) Sable arrives third ("Meanwhile, in the Hero's Lair: Your first mission comes home with someone"), between the Garden and the
      Restaurant, but nothing in the story has introduced the Lair or missions yet (the Lair comes from the Closet's hidden upgrade).
      Either a line that says how the Lair appeared, or Sable placed where the Lair opens.
  (5) The ending: Rafe asks about "the Old Metro" before Sable has said anything about it (swap 53 and 54 so Sable reports first),
      and Rafe's "Five shards, one amulet" has no setup anywhere in the story.
  (6) Two speakeasies: Desmond offers to "fund a speakeasy up there ... Lock and Key", and there is also a room called the
      Speakeasy behind the Dessert's Hidden Door (its story step says "Part of Lock and Key now"). A player sees both names.
  (7) Spelling is mixed: "Dessert Parlor" (Step 4 title and its welcome) but "parlour" (Step 4 text, "At the dessert parlour");
      "neighborhood" in Step 2 while the rest writes neighbour, colour, favour, travelling.
  (8) Small: the Loft welcome says "At level 5 the empty lot next door goes up for sale" to a player who starts at level 5 (it is
      already for sale).
  Owner: LEAD (story text), ROOMS for the four missing welcomes if those need art.
- QA, LEAD's 0f7ce90 Test > Unlock everything (Cal's "access every upgradable room and section"), pressed from the Test pill
  at 390 on a clean build of 0f7ce90 (`rigtest/qa/unlockall.js`): works, two small things to fix. Fresh player and a mid-game save
  (level 20, five rooms with upgrades, half the story): level 50, no locked tab, 21 rooms built once, the only upgrades given are
  the ones that open other rooms, the mid-game save keeps every room and upgrade it had, the whole team, +500,000 coins, 17 story
  steps done, a reload keeps it, 0 page errors. Every room window opens and, from a fresh unlock, every upgrade in all 22 rooms
  (the Speakeasy via the Dessert's Hidden Door) buys through its window with the 500,000 coins to spare (they never ran out);
  Review still plays (23 of 23 sampled of 114). (1) "Next story step" is not empty after it: it opens the Speakeasy ("Opened
  Speakeasy"), because qbtNextStep (29m_tester.js) does not skip the story's how:"never" step; it should say nothing is left.
  (2) After Unlock everything the Bedroom's first wardrobe (bd_ward1) can never be bought: the Walk-in Closet's opener (bd_ward2,
  which needs bd_ward1) is given directly, and bd_ward1 is then no longer offered, so its look and splash cannot be tested.
  Owner: LEAD. Not on a real phone.
- QA, v0.69 = c2c53b7 (APPV 69), the full set on a clean build (490 files): PASS, publish it, 0 page errors anywhere. Test >
  Review plays 114 of 114 at 390 on both bodies, nothing off screen or broken (the save gains only an empty "seen" record);
  livesync.js PASS; live10.js PASS (quiet minute 0-1 writes per page); players10.js PASS (ten different saves, neighbours in their
  outfits, all visits, posts and hellos in 1 s, every save its own after reloading, 27 docs); alerts.js PASS; fxcheck.js PASS;
  roomwin.js PASS (no zoom, street and buildings at 1.6x, purchases keep people, gold pulse); barlock.js PASS; badges.js: every
  brand tab from the pack, 0 loose files; drops.js PASS (Mon/Thu, HANGANG first, 0 repeats in 192 rerun slots); stuckscan.js: all
  21 rooms buy through; nightlights.js: only the Bedroom has a lamp button and it survives a reload; guestcount.js: every business
  at most 5 at once, 0 duplicate looks, someone in every sample; access.js: as on ab1f68f (only the known false alarms: booth
  and sofa seats, theatre rows, the pinball's art direction). Room layouts are those QA checked by eye on 9136fc1 and ab1f68f.
  Not on a real phone; the published-file check after the publish needs Cal to restart QA (artifact tools).
- QA, ROOMS's 567ea26 (Nightclub staff, Sky Patio chair) on a clean build of ab1f68f: PASS, 0 page errors. The room built from
  the layout now has the DJ at (7.8, 0.5) behind the decks and the bartender at (2.2, 0.5) behind the bar; the bar sits at y 1.0,
  the speakers at 0.85, the coat check from x 12.1, so an aisle runs along the back wall, entered between the right speakers and
  the coat check. Live at 22:00 over 48 s: the DJ works at the decks facing the floor, the bartender works behind the bar, and
  between jobs they walk the aisle (shots/qa/access3/club_live_3.png); the back wall reads clean (big_club.png). Sky Patio: the
  lounge chair's seat has its walk-to point at (3.95, 4.6) and lfRoute from the door reaches the seat in 4 steps (nobody came to
  the Patio window in my live run, so not seen live). Note, not seen on screen: at the start of the live run up to four guests
  sat at exactly (3.0, 3.0) idle for about 30 s, apparently guests waiting to come in (none visible there in the pictures).
  ROOMS's whole placement list (6430d13) is now closed.
- QA, 1ab3753 (ROOMS drops the old screen wrapper) on a clean build of ad05db6: PASS. With animations off the Auditorium, lobby
  and Boba screens show their still; with animations on the slides play, no still under them; 0 page errors.
- QA, ROOMS's 570b2f3 (Cal's use check) on a clean build of 9136fc1, every room fully bought drawn large (shots/qa/access2/),
  access.js, stuckscan.js (21 rooms buy through), 0 page errors: PASS on all but one point. Fixed and checked: the Arcade pinball
  now points into the room with its flipper end on open floor, the Skee-Ball end clear; Lock and Key upright piano on the back
  wall facing the room (nothing in front of the keys: the lamp table is 2 units to the side) and the bar 0.8 off the wall; Rooftop
  DJ deck 1.0 off the parapet; VR flight pod clear of the sofa, ring chair in from the edge; Rhythm pads out a tile (the DJ game
  behind has room), bench off the mirrors (it faces the front edge, not the pads, but is usable); lobby ticket booth clear of the
  recliner; Restaurant smoker in the olive corner facing open deck, pizza oven clear, the crescent booth's opening clear (tight
  but walkable); Upstairs Bar wine cabinet clear of the sofa; Bedroom mirror on the left wall, record cabinet clear; Mall fountain
  3.1 units from the store wall (its height made it look closer); Boba fridge on the back wall; Dessert towers off the bookcase;
  Garden potting bench clear. Withdrawn: my (5) Bowling bench; it is a rear view and the seats face the ball return and lanes
  (shots/qa/access2/bowl_zoom.png). STILL OPEN: the Nightclub's staff stand on the floor side. 27b_skins.js puts the DJ at y 0.5
  behind the decks and the bartender at y 0.6, but the room built from it (roomCtx) has them at 2.5 and 2.1, in front of the
  decks and the bar; live at 22:00 the bartender stands on the customer side (shots/qa/access2/club_live.png). The bar art starts
  at y 0.2, so there is no room behind it; the DJ booth has 0.8 behind it, yet the spot still moves out. No other room's staff
  spot is on the wrong side (lobby, Bowling, Arcade, VR, Upstairs Bar checked). Small: the Sky Patio lounge chair's sit spot
  (4.75, 4) cannot be walked to from the door on access.js's 0.2 grid. Owner: ROOMS.
- QA, LEAD's cfa5f62 (the screens' still picture moved into 24_screens.js scrPages, replacing ROOMS's 62d336d wrapper), on a clean
  build of 67d375e: PASS. Same as c9a940e: with animations off the Auditorium, lobby and Boba screens show their still; with
  animations on the slides play and no still shows under them; 0 page errors.
- QA, ROOMS's v0.69 room fixes (62d336d, dbf2593, a4be384, aca27a1, 1e8a3b4) on a clean build of 6430d13: all PASS, 0 page
  errors. With animations off (allrooms.js, as reduced motion) the Auditorium shows its dragon-over-the-city still, the lobby its
  NOW SHOWING times, the Boba its TODAY menu; with animations on (bigrooms.js) the slides play and no still shows under them. At
  22:00 the Rooftop and Sky Patio are dark (the Patio lit by its string lights only). Kenan wears the same black shades in all three
  portraits. The Bedroom rug tucks under the bed's foot; the Rhythm Room's front floor has its neon circle; the Sky Patio's wicker
  lounge chair sits at the fire, usable. Pictures: shots/qa/v69/. Not on a real phone.
- QA, v0.68 = e276038, the full set: PASS, nothing new broken; Cal's call whether it goes to the Test link before the placement
  list below. On a clean build of e276038 (and 428c8a5, same code but the portraits): Test > Review plays 114 of 114 at 390 on
  both bodies, no window off screen, no broken image (the save gains only an empty "seen" record); livesync.js PASS (5.1 s state,
  1.0 s posts); live10.js PASS (quiet minute 0-1 writes); players10.js PASS on e276038 with the neighbours now in their own
  outfits (Hall rows draw with the rig, `calav nbav`); alerts.js PASS (Garden "!" at 5, Relics and Wheel "!" when they open, "+",
  brands); fxcheck.js PASS; roomwin.js, barlock.js PASS; badges.js: all 15 brand tabs from the pack, 0 loose files; drops.js PASS
  (Mon/Thu, HANGANG first, 0 repeats in 192 rerun slots); stuckscan.js: all 21 rooms buy through; 0 page errors anywhere.
  Correction to my aa3a99b note (1): the "black screens" were my capture setup (lib.js turns animations off, and every screen's
  picture only appears through its animation); ROOMS's 62d336d gives reduced-motion players the still picture too.
- QA, Cal (2026-11-07): "the pinball machine on the right wall is facing towards the other machine with no space to play. Do a QA
  check on every asset to make sure the assets are accessible." Every room fully bought, drawn large (`rigtest/qa/bigrooms.js`,
  shots/qa/access/big_<room>.png) and checked piece by piece for its use side, plus `rigtest/qa/access.js` (each piece's front
  strip and every guest spot against the room's own layout; it cannot see which way the art itself is drawn, which is exactly the
  pinball's fault, so the eye pass is the real check). Pieces that cannot be used as placed, most visible first:
  (1) Arcade, Pinball Machine (ar_pin): its table runs along the back wall, so the flipper end where a player stands is pressed
      against the claw machines (shots/qa/access/arcade_pinball.png). Turn it to face the room or give its flipper end a clear unit.
  (2) Lock and Key (stage room), upright piano: the keyboard faces the drum kit on the stage, no room for a pianist or bench.
  (3) Lock and Key, bar counter: built against the back wall, no space behind it for a bartender.
  (4) Nightclub DJ booth and Rooftop DJ deck: both pushed against speakers or the parapet, nowhere for the DJ to stand.
  (5) Bowling, the orange bench: faces away from the lanes, straight into the back of the snack cart.
  (6) VR Arena: the blue flight pod sits right in front of the sofa's seat.
  (7) Rhythm Room: the music-game cabinet stands behind the dance machine (its player side faces the machine's back); the bench
      sits in front of the mirror wall.
  (8) Theater lobby: the ticket booth stands in front of the second recliner.
  (9) Restaurant: the patio smoker faces a bistro chair; the pizza oven's mouth is half blocked by the condiment counter; a square
      table sits in the round booth's opening.
  (10) Upstairs Bar: the glass wine cabinet's doors press against the green sofa's end.
  (11) Bedroom: the full-length mirror stands half over the record-player cabinet and half against the window.
  (12) Mall: the fountain's back rim sits in the clothing store's doorway.
  (13) Smaller: Arcade Skee-Ball's throwing end is at the front edge beside the photo booth; Boba's drinks fridge at the front edge
      faces out of the room; Dessert's counter end and macaron and cupcake towers crowd the bookcase; Garden potting bench behind the
      compost crate; VR ring chair at the front edge.
  Fine as placed: Game Room, Karaoke, Auditorium, Closet, Lair, Sky Patio, Garden beds, the rest of each room above. Owner: ROOMS.
- QA, Cal's "check all the rooms and assets ... use references for everything" (v0.68 code, 428c8a5): all 21 rooms fully bought
  at 13:00 and 22:00 plus the street and the three buildings, against isometric references of each kind (docs/QA.md "Every room
  against references", sheets in shots/qa/rooms/). 0 page errors; nothing out of place in the street or building views; 13 rooms
  read like their references as they are. Notes for ROOMS, most visible first: (1) black screens where references show a picture:
  the Auditorium screen (black at noon and at 22:00), the Theater lobby's two big back-wall panels, the Boba wall TV (references
  put the menu board there); (2) Sky Patio: no seats around the fire bowl except two dog beds; (3) Rooftop: a large bare pale floor
  with no plants or string lights, lit like noon at 22:00; (4) Dessert: a dark library bookcase and a full-length mirror break the
  pastry-shop palette; (5) Bedroom: the round rug floats in the open floor and the dog beds sit loose at the front edge;
  (6) VR Arena: a white clinical room beside the dark neon Arcade and Rhythm Room; (7) the Restaurant fully bought (73 pieces) is
  only just inside Cal's "never cluttered"; (8) Rhythm: a big empty front-left floor. The placement audit does not cover the
  newer rooms (Mall to Club report 0 pieces), so those were checked by eye only. Owner: ROOMS; (1) may be LEAD's (show state).
- QA, Cal's "how this platform would function with 10 saves files from different players" (v0.68 code, 428c8a5, phone 390,
  `rigtest/qa/players10.js` on LEAD's stand-in database, each page its own device save): PASS but one real gap. Ten different saves
  (new player at 5, casual 8, 12 lapsed, 15, 22, old save at 25 owning the retired gm_ping, 38, 45, 60, 80 with every outfit owned;
  both bodies; 1 to 21 rooms; outfits picked from the Shop) each boot in 1.4-6 s with ten open, draw Board/Training/Loft/Hall/Shop
  with no error, and see the other nine with the right level and streak; both Halls list nine neighbours; Cal visits all nine
  (each Loft opens with the right rooms, fits the phone) and Newbie visits Max's 21 rooms; "Say hi" reaches Max in 1 s; three posts
  at once reach all ten in 1 s; a quiet minute writes 0-1 per page; database: 27 docs (10 worlds, largest 6 KB; 10 saves, largest
  16 KB; board, pings; far under the 25,000-doc limit); reloading all ten, each save is still its own; 0 page errors. GAP (Cal's
  town-hall ask "post a picture of your character with your current outfit"): every neighbour portrait (the Hall list, the visit
  window's header and the town board posts) is drawn by the old chibi parts (pxImg > chImg > chParts in 30_app_b.js), which only
  know the starter clothes, so no Shop outfit or hat ever shows: Kai and Max in a visor, Mia in a bow and Ari in a bucket hat all
  show the same bare head, and every man looks alike and every woman looks alike (shots/qa/players10/heads.png, hall_list_Cal.png).
  The world doc does carry the outfit (look.gar, rig.equipped), so it is the drawing. Fix idea: draw these with the rig, as the
  Board avatar and the friends are. Owner: LEAD. Note: visits show "0 crew" for everyone (my saves hire nobody), not checked further.
- QA, ROOMS's four for v0.68 on a clean build of 428c8a5 (same code as 9b3a428), phone size 390: all PASS, 0 page errors.
  4e93d54 (`rigtest/qa/roomwin.js`): all 21 room windows have no zoom buttons, and a wheel or a two-finger pinch leaves the view
  exactly as it was; the street stops at 1.6x by + and by pinch, all 3 buildings open at or under 1.6x and + stops there (by day the
  Bedroom shows no control at all; its lamp shows at night, nightlights.js). Restaurant pictures at each stage: the double shelf runs
  along the back wall above the wainscot, the menu board is a rectangle above the tiles. 1308059: buying with the window open in 12
  businesses: the new pieces pulse gold (seen at about 0.8-1.3 s; the shadow layer never pulses); where people were in the window
  (Boba 6, Arcade 6, Theater 9) nobody left, changed seat or look, and nobody moved further than they do in the same time without
  a purchase. Hiring the Head Chef (r_s4) with 8 in the Restaurant changed one person's look and moved them 13 units, which is the
  new chef arriving, not a reset. In headless runs customers came in some runs and not others, so not every business was checked
  with people in it. 633ffe2 (`rigtest/qa/barlock.js`): without White Linen only White Linen is offered; with it the bar stays
  hidden until the story's earnings step opens, then its card shows; an old save owning the bar without White Linen keeps the bar
  and the Sky Bar, also after a reload. ede09d8 (`rigtest/qa/alerts.js`): level 4 no Garden "!", level 5 the lot is for sale with
  "!" on The Loft and over the lot; a new player starts at level 5, so the "!" is there from the start. LEAD's d0adfdc: Relics and
  Wheel now get their "!" when they unlock (my gap from ba1758a is fixed). Not checked on a real phone.
- QA, 59d31a0 (FX) and 3bba5f1 ("!" and "+") on a clean build of 0a03968, phone size 390: FX PASS, alerts PASS but one gap and one
  copy error. `rigtest/qa/fxcheck.js`: at levels 23/24/28/34/45 no scanline layer exists anywhere; Starlight from 24, behind the
  panels (z-index -1); vignette inset 110 px at .32 black; edge glow 48 px -28 at half the accent; on The Loft street, inside a
  building and in a room window opened from The Loft no overlay shows. Note, not an error: a room window opened over the Board (story
  scenes, friend visits) or the Shop keeps the vignette and edge glow around it (body.loftmode is only set on The Loft tab).
  `rigtest/qa/alerts.js` (fresh player through the real path): an old save lights nothing; the Garden lot at level 14 puts "!" on
  The Loft and over its street lot, opening The Loft clears it and a reload keeps that; with the Garden built and Mara's step open,
  "Knock Through to a Restaurant" puts "!" on The Loft and over the building, inside a "+" on its spot, tapping "+" opens the
  Garden window with that upgrade listed first, building the Restaurant removes the "+"; building the Closet and the Lair puts "!" on
  Shop and Dungeons, each clears on opening and stays cleared after a reload; a brand not yet seen puts "!" on the Shop until opened;
  0 page errors. (1) GAP: a tab unlocked by LEVEL never gets a "!" (Relics and Wheel going from locked to open at 14 to 45: no "!").
  alSeen()'s first run marks every tab not gated by a room as seen, locked ones included, and alTabs() only checks areaGate (the
  Closet/Lair rule), not the level lock (lv < AREAS[2]) or areaWaiting. Fix idea: at first run mark only tabs that are open by all
  three rules, and in alTabs skip tabs still locked by level. Owner: LEAD. (2) COPY: The Loft's welcome card says "At level 5 the
  empty lot next door goes up for sale", but the Garden lot is locked until level 14 (ROOMT.garden.lv in 22_garden.js; the street
  shows a padlock, "The Garden unlocks at level 14"). One of the two is wrong; Cal's storyboard call. Owner: LEAD.
  Pictures: shots/qa/alerts/ and shots/qa/fx/.
- QA, ROOMS's 93d33f1 Cal's Restaurant notes in every business (on 0a03968, new `guestcount.js`; `shots/qa/biz/`): pass. All 15
  businesses (Arcade, Auditorium, Boba, Bowling, Club, Dessert, Karaoke, Mall, Restaurant, Rhythm, Rooftop, Sky Bar, Speakeasy, Theater,
  VR), every building view, fully bought, sampled every 3 s for 30 s: never two customers with the same look in a room, never more than
  5, someone in every sample, so none reads empty. Shadows against d54de89: bar stools, café chairs and the round tables' bases now cast
  a tight shadow instead of a wide dark pool; the piano, beds and sofas keep theirs (`cmp_*.png`). The Open Sign: at 9 pm without Noir a
  pink neon OPEN glows in the first window and the chalkboard stands by the door. No page errors. Not checked: phones, and the stage-1
  Restaurant's two customers (ROOMS saw them). Owner: ROOMS.
- QA, ROOMS's abe06dd night lights (on ef08f17, new `nightlights.js`; `shots/qa/night/night_abe06dd.png`): pass. At 10 pm, twelve rooms
  (Bedroom, Closet, Lair, Patio, Game Room, Restaurant, Boba, Mall, Arcade, Club, Theater, Garden): only the Bedroom shows the lamp
  button and only the Bedroom changes with it (mean brightness 52 off, 94 on); every other room draws the same with rm.lit 0 or 1, so
  an old save with the lamp off now draws lit: against d54de89 (before the change) the Closet went from 44 with the lamp off to 69, the
  Lair 40 to 55, the Patio 66 to 82, the Game Room 43 to 66, the Mall 74 to 118, the Arcade 38 to 56, each now equal to its old lamp-on
  look. The Bedroom's tap saves (lit 1, still 1 after a reload). No page errors. Not checked: the building views at night. Owner: ROOMS.
- QA, v0.67 (d54de89, APPV 67; 490 files): pass, publish. The boba scene now shows Mara's portrait (`shots/qa/review/
  boba_portrait_d54de89.png`). Review: all 114 Plays on both bodies at 360 and 390 (456) open, fit, no broken image, no page errors;
  the save keeps its progress (only savedAt and the seen list move). Live sync: LEAD's livesync.js passes on the clean build (Ben's
  streak and upgrade reach Ana and Cy in 5.1 s, his post and hi in 1.0 s; with pushes off, 50 to 60 s by the old polling). New
  `live10.js`, ten players on one pushing database on different tabs: all ten change their streak and an upgrade at the same moment and
  every page sees the other nine in 5.1 s; two posts made in the same moment both reach all ten in 1.0 s; in a quiet minute nine pages
  write nothing and one writes once. Also on the exact build: savecheck, screens 360 and 390, a v0.65 save loads, buys and reloads,
  town rules, townlive 5/5, townrx 12/12; no page errors. Note: LEAD's server on 65410 now serves newer work (app.js and qbdata.js
  differ from d54de89), so the publish session must build d54de89 itself, not copy from that server. Not done: the published v0.64
  and v0.65 file checks (QA's artifact tools, Cal's restart). Owner: LEAD.
- QA, v0.66 (465d39a, APPV 66; 490 files; Cal: "Do a full QA check and send me the latest version to test"): passes everything but
  one small visible error, so hold for it. Test > Review (new `review.js`): all 114 Play buttons on both bodies at 360 and 390 (456
  plays) open a window that fits the screen, with a reachable button, no broken image and nothing past the right edge; no page errors.
  Playing everything leaves the save as it was apart from two empty defaults (story's done/offer/team/sold/later/biz created empty by
  the Garden welcome, story.beats by the Lock and Key scene), no progress, harmless. The error: the boba scene (Mara, "Half our
  customers ask for something cold to drink") shows an orange "M" box instead of her portrait, because ui_story_boba.webp doesn't
  exist (the only scene of 7 without one; the same since v0.61, so players have always seen it; Cal will look at it now). Fix: let
  styPortrait fall back to the same person's portrait (Mara's ui_story_chef), or ROOMS paints ui_story_boba. The rest passes on the
  exact build: savecheck; screens 360 and 390; a v0.65 save loads, reloads, buys and reloads; the level-5 start; Kode Plaza; town
  rules, townlive 5/5, townrx 12/12; doors 34 ok plus Garden and Restaurant walked live; Begin at 10 sizes; diag/load; the team;
  voice.js 1,542 lines, 0 hits; 16 of 16 brand badges from the pack; the Shop in two halves, 272 pieces on him and 281 on her bought
  and worn, KAIMANA, OAKMONT and SØLVBERG included (SØLVBERG's Shop run done); Wednesday returns and launch reruns (192 slots, 0
  repeats, 0 still-live); 30 rooms, 21 of 21 buy through, the tester walks all 17 story rooms; friends; Collect; the camera.
  Owner: LEAD (the portrait fallback, then rebuild; QA rechecks Review and the file match).
- QA, ROOMS's 57527b0 SØLVBERG wear test (on 8909550; `shots/qa/sv/`): pass, 15 of 15. All 15 on both bodies (the leggings hers) in all
  22 key poses, 0 draw failures; three outfits. ROOMS's points: (1) the mittens sit on both hands in every pose, no cords left
  floating; (2) the pom beanie and the trapper sit right with long hair (h1) and the ponytail (h3), front, back and asleep; (3) the
  goggles rest on the forehead with their strap round the back, hair kept; (4) the puffer and après boots go over the snow pants, the
  leggings and the cords, walking, sitting and asleep (`boots.png`). Design calls: the puffer boots, the tan lace-up après boots, the
  fair-isle and the badge (peak and snowflake in a red ring) read as generic alpine, no ski brand; fine. The stretchUp armpit flecks
  ROOMS saw are the parked rig item, not this art. Shop rows not in yet (no gx_sv_). Owner: ROOMS.
- QA, ROOMS's 633be95 OAKMONT badge ring (on 633be95): pass. The inner ring samples navy all round (about 42,59,95) and no greenish
  pixel is left in logo_oak.webp (0 of 307,468). OAKMONT is done: every piece, its stripes, the Shop and the badge. Owner: ROOMS.
- QA, ROOMS's 867a53e OAKMONT navy stripes and LEAD's c814f38 palette and lines (on c814f38; `shots/qa/oak/icons_867a53e.png`,
  `fit1_867a53e.png`): pass. The headband, wristbands, jacket and track pants, skirt hem, socks, vest V and cap button now carry
  burgundy and navy, in every pose on both bodies and in the icons; the stripe no longer reads as the fashion house's web. One leftover:
  the badge's inner ring is still green (logo_oak.webp was not in 867a53e; sampled 67,96,73). Alone, next to burgundy and cream, it
  doesn't read as the web stripe, so it's not a blocker; make it navy too if you want the set to match. Owner: ROOMS.
- QA, LEAD's df59ff1 OAKMONT in the Shop (on 3eb382b, `shop.js` BRAND=oak): pass. 14 on him and 15 on her (the skirt hers) bought at
  full price, worn and in the mirror; the wristbands and watch land in the arms slot; KAIMANA's and OAKMONT's badges show from the
  pack; voice.js 1,527 lines, 0 hits. The stripe design call stands with ROOMS. Owner: LEAD.
- QA, ROOMS's 78c961b OAKMONT wear test (on 67226f6; `shots/qa/oak/`): every piece fits, 15 of 15, one design call. All 15 on both
  bodies (the skirt hers) in all 22 key poses, 0 draw failures; three outfits. ROOMS's points: (1) the watch sits on one wrist only,
  the viewer's left from the front and the viewer's right from behind, the same arm as CHROME RAIN's sleeve, in every pose
  (`watch_zoom.png`); the two wristbands sit on both wrists. (2) The headband and visor (and the cap) with long hair and the ponytail
  are right, front, back and asleep. (4) The tube socks go under the track pants and cargo and show over the ankles with shorts.
  (3) Design calls: two stripes on the jacket, plain canvas court shoes and the burgundy suede runners read as generic; fine. But the
  brand repeats one stripe everywhere, green-burgundy-green on cream (headband, wristbands, jacket sleeves, track pants, skirt hem,
  socks, badge rim): together that reads close to a famous Italian fashion house's green-red-green web stripe. A single burgundy
  stripe, or burgundy and navy, would keep the 80s club look without it. Your call or Cal's. Shop rows not in yet (no gx_oak_).
  Owner: ROOMS.
- QA, KAIMANA (ROOMS's 24304af wear test, LEAD's adcf65c Shop rows; on cab70e1; `shots/qa/km/`): pass, 15 of 15. All 15 on both bodies
  in all 22 key poses, 0 draw failures; three outfits. ROOMS's points: (1) the straw sun hat and the bucket hat sit right with long
  hair (h1) and the ponytail (h3), front, back and asleep; (2) the visor's top is open and the hair kept; (3) the crochet cardigan
  hangs open over its cream tank; (4) the board shorts and cut-offs show their legs and side panels under a top; (5) the shell
  necklace sits at the collar, no outline. Design call: the badge's curling wave reads as a general nod to the old public-domain
  woodblock, not a copy of it or of any logo; fine. The Shop: 15 on him and 15 on her bought at full price, worn and in the mirror;
  voice.js 1,512 lines, 0 hits. Owner: ROOMS, LEAD.
- QA, v0.65 (dba3f2e, APPV 65; 489 files): pass, publish. On the exact clean build: savecheck; screens at 360 and 390; v0.64's own build
  makes a save that v0.65 loads, reloads, buys on and reloads; the level-5 start; Kode Plaza stages and tapping in; town rules,
  townlive 5/5, townrx 12/12; doors 34 ok plus Garden and Restaurant walked both ways live; Begin at 10 sizes; diag/load; the team;
  voice.js 1,497 lines, 0 hits; every brand tab's badge from the art_ui pack (13 of 13, no loose logo_ file asked for); the Shop in
  two halves, 229 pieces on him and 236 on her bought and worn, SAVE POINT, BARD & BLADE and CHROME RAIN included (one run of all 15
  brands now makes a summary sheet too tall to picture, so `shop.js` takes BRAND= lists); Wednesday returns and launch reruns (156
  slots, 0 repeats, 0 still-live drops, two pages agree); all 30 rooms drawn, 21 of 21 buy through; the room tester walks all 17 story
  rooms; friends; Collect; the street camera. No page errors. Still as accepted: the mall's escalator in front of the Bowling and
  Karaoke doors. Not done: the published v0.64 file check, because QA's artifact tools stopped working in this session too (Cal:
  a restart brings them back). Owner: LEAD.
- QA, ROOMS's 14bd0e5 CHROME RAIN fixes and LEAD's 207db81 line (on 207db81; `shots/qa/cr/fixes_14bd0e5.png`, `icons_14bd0e5.png`):
  pass, so CHROME RAIN is 15 of 15. The mesh top is an opaque dark purple net under the black harness with cyan cuffs, the same on
  both bodies front and back and matching its icon, no skin through it. The light-up high-tops carry a small rose bolt and a straight
  line, no wavy stripe, no outline left; they read as original. voice.js 1,482+ lines, 0 hits. Owner: ROOMS.
- QA, LEAD's 091c762 CHROME RAIN in the Shop and 8be03dc packed badges (on 7caab98; `shop.js` BRAND=cr, new `badges.js`): pass. CHROME
  RAIN: 14 on him and 15 on her (the skirt hers) bought at full price, worn and in the mirror. Badges: every brand tab (HANGANG,
  DIAL-UP, OVERPASS, VENOM ROSE, NICE COCK, ALTITUDE, KODE PINK, SAYMØRE, SMOKE BOMB, GACHA POP, SAVE POINT, BARD & BLADE, CHROME RAIN)
  shows its own badge from the art_ui pack (13 different images, all loaded, about 550 px), and the page asked for no loose logo_
  file. The Wednesday return tab uses the same brand id, so the same badge; the drop pop-up was not checked. The build is 489 files.
  Owner: LEAD.
- QA, ROOMS's 5cf2e1d CHROME RAIN wear test (on b691907; `shots/qa/cr/`): 14 of 15 pass, one fix and one design call. All 15 on both
  bodies (the skirt hers) in all 22 key poses, 0 draw failures; three outfits. ROOMS's points: (1) the chrome sleeve stays on the same
  arm front and back, in every pose (`z_arm.png`). (2) The trench hangs right in walks, stretch and sitting, no sliver. (4) The visor:
  no outline left. (5) The mohawk helmet and the hood sit right with long hair and the ponytail, front, back and asleep. (6) Platform
  and combat boots over the cargo, the skirt and the knee pants, walking, sitting and asleep (`boots.png`). Rose stands in for pink
  everywhere, no blank spots. Fix (3): the mesh top doesn't match its icon or itself: the icon is a dark purple net with long sleeves
  and a harness, but on him it reads as bare skin with a harness and on her as a light grey crop top with a harness
  (`z_mesh_trench.png`). Add the dark net back over the torso and arms on both bodies so it reads as the icon. Design call: the
  light-up high-tops (cr_lightup) carry a pink wavy stripe down the side that reads like one famous skate brand's side stripe (the
  same thing Kode PinK's runner was repainted for); a straight stripe or a lightning bolt would be safe. Visor, mohawk helmet, hood,
  trench, vest, cargo and badge read as generic cyberpunk. Shop rows not in yet (no gx_cr_). Owner: ROOMS.
- QA, LEAD's a6e9d16 BARD & BLADE in the Shop (on 1f047b9, `shop.js` BRAND=bb; `shots/qa/bb/shop_*_a6e9d16.png`): pass. 14 on him and
  15 on her (the skirt hers) bought at full price through Try on, Checkout, Confirm, worn and in the mirror; the bracers show in the
  mirror in the arms slot. voice.js: 1,482 lines, 0 hits. Owner: LEAD.
- QA, ROOMS's f843b25 BARD & BLADE wear test (on efaf4ec; `shots/qa/bb/`): 15 of 15 pass, two rig notes. All 15 on both bodies (the
  skirt hers) in all 22 key poses, 0 draw failures; three outfits. ROOMS's points: (1) the bracers follow both arms, in the new arms
  slot, over sleeves; from behind the far arm's bracer sits as a rough patch beside the body in sitBack and type1, the same as that
  arm's sleeves (rig, LEAD's, known). (2) The travel cloak hangs right in walks, sitting and sleep with no sliver; in stretch and
  stretchUp a few brown flecks fray at the wrists, the same armpit raggedness every top has at that pose (LEAD's open rig item, not
  the art). (3) The wizard hat, (4) the ranger hood (its back now has a seam and folds) and the circlet sit right with long hair and
  the ponytail, front, back and asleep. (5) The tool-belt skirt's belt and pouch show over the doublet. (6) The crystal: no outline
  left. Designs read as generic fantasy (no single game's costume); badge, banner and icons clean. Shop rows not in yet (no gx_bb_),
  so the Shop run waits on LEAD. Owner: ROOMS (done), LEAD (rows; the far-arm and wrist raggedness stay with the rig rework).
- QA, LEAD's 23bf14f rig slot "arms" (on 6c4bba2; small check, no request was posted): no regression. Ten existing outfits (tees,
  jackets, hoodie, overalls over a tee, pendant over a hoodie, puffer, boots, flares, the halo mask, the cassette bag), both bodies,
  all 22 poses, pixel-compared against 92fbe67: 0 pixels differ. The slot itself gets its real test with BARD & BLADE's bracers.
  Also on the board since: eaf8c09 renames the slip-ons "Checkpoint Sneakers" (900 coins) for ROOMS's lace-ups. Owner: LEAD.
- QA, ROOMS's 200d498 SAVE POINT fixes (on 92fbe67; `shots/qa/sp/fixes_200d498.png`, `icon_flag_200d498.png`): pass, so SAVE POINT is
  15 of 15. The headset from behind shows only the arc and the two cups, no band, on both bodies in every back pose and with long hair.
  sp_flag is grey lace-ups with a purple toe cap, teal laces and a small red pixel flag: original, no outline left in any pose or on
  the icon. Owner: ROOMS.
- QA, LEAD's 29f496c SAVE POINT in the Shop (on 284a752, `shop.js` BRAND=sp; `shots/qa/sp/shop_*_29f496c.png`): pass. 15 on him and 15
  on her bought at full price through Try on, Checkout, Confirm, worn and in the mirror. The headset's back band and the checkerboard
  slip-ons still wait on ROOMS; QA reruns them after. Owner: LEAD.
- QA, ROOMS's bad0b45 SAVE POINT wear test (on df51588; `shots/qa/sp/`): 13 of 15 pass, two fixes. All 15 on both bodies in all 22
  key poses, 0 draw failures; three outfits. ROOMS's points: (1) no leftover outline on the cap or the slip-ons; the cap's brim edge
  is soft but fine at game size. (2) The teal stand-ins for green (PLAYER 2, varsity cuffs, headset rings, pompom, track stripe,
  cartridge star) all read, no white blanks. (3) The cap and beanie with long hair (h1) and the ponytail (h3) hang right front and
  back. Fixes: the headset from behind (sitBack, type, rearStand, backwalks) shows a wide grey band wrapped straight across the back
  of the head under the arc, like a blindfold strip (`z_headset_cap.png`); from behind only the arc over the top should show.
  (4) Your design call: yes, the purple-trimmed checkerboard slip-on (sp_flag) reads as one well-known skate brand's classic
  slip-on; repaint it (another pattern, or a lace-up). The pixel "deal with it" shades, the controller tee and the cartridge pendant
  read as generic gaming, fine. Shop rows not in yet (no gx_sp_ in 15_shop.js), so the Shop run waits on LEAD. Owner: ROOMS.
- QA, v0.64 (4a1dbe8, APPV 64; 22 files, 477 art): pass, publish when the artifact tools are back. On the exact clean build:
  savecheck; screens at 360 and 390; v0.63's own build makes a save that v0.64 loads, reloads, buys on and reloads; the level-5 start;
  Kode Plaza stages 0-2 and tapping in; town rules, townlive 5/5, townrx 12/12; doors 34 ok plus Garden and Restaurant walked both
  ways live; Begin at 10 sizes; diag/load; the team; voice.js 1,452 lines, 0 hits; the Shop, 186 pieces on him and 191 on her bought
  and worn, SMOKE BOMB and GACHA POP included; Wednesday returns and launch reruns (120 slots, 0 repeats, 0 still-live drops, two
  pages agree); all 30 rooms drawn, 21 of 21 buy through; the room tester walks all 17 story rooms; friends (16 visits, every figure
  drawn, rooms, dogs); Collect; the street camera. No page errors. The rig changes (armpit, overalls over the top) were checked on
  their own commits. Still as accepted: the mall's escalator in front of the Bowling and Karaoke doors. LEAD: check the published
  files against this build once it is up. Owner: LEAD (publish and pin).
- QA, LEAD's 91ef6e8 overalls over a painted top (on fb71c7c; `shots/qa/gp/overtop_stretch_91ef6e8.png`): pass, so the overalls and
  suspender shorts read right in all 22 poses. In stretch the bib and straps now show over the starter tee, o_tee, o_puffer and
  o_flannel on both bodies, and h_boots and sm_boots still sit over the cuffs. Pixel checks: seven other trousers and skirts, o_tee and
  h_boots on their own are identical to before faebcd8 in every pose; the overalls under GACHA POP's tops differ from faebcd8 only in
  the stretch cells with o_tee. Owner: LEAD.
- QA, LEAD's faebcd8 overalls over the top (on d9adecf; `shots/qa/gp/overtop_*_faebcd8.png`): 21 of 22 poses pass, one left. Other
  bottoms are pixel-identical before and after (7 trousers and skirts, 22 poses, 0 pixels differ). gp_overall and gp_shorts under
  o_tee, gp_bear, gp_sailor, gp_star, o_puffer, o_flannel and the starter tee, both bodies: the bib and straps show over the top front
  and back, no top hem on the thighs, arms over the bib, and h_boots, sm_boots and v_boot over the cuffs, in every pose but one. The
  stretch pose: tops with a painted stretch layer (the starter tee, o_tee, o_puffer, o_flannel) cover the bib and straps again, so the
  overalls read as trousers there; GACHA POP's own tops (no painted layer) keep the bib (`overtop_stretch_faebcd8.png`). Draw the
  pantsOver bib after the painted top layer too. Owner: LEAD.
- QA, ROOMS's 86f50d9 cat hood back (on f9338aa; `shots/qa/gp/hood_86f50d9.png`, `hood_h1_86f50d9.png`): pass, so GACHA POP's art is
  15 of 15. From behind it has an outline, knit ribbing, a centre seam and the blue trim at the neck in all back poses on both bodies;
  with long hair (h1) and the ponytail (h3) the hair hangs below it, nothing cut wrong; the front is unchanged. Still to check when
  LEAD's rig side lands: the overalls' and shorts' "overTop" (d4d8fd8). Owner: ROOMS.
- QA, GACHA POP wear test (ROOMS's 03274a7, LEAD's 07dfb84 Shop rows; on 272645c; `shots/qa/gp/`): 14 of 15 pass, one fix and one
  call. All 15 on both bodies (the skirt hers) in all 22 key poses, 0 draw failures; three outfits; the Shop (`shop.js` BRAND=gp):
  14 on him and 15 on her bought at full price, worn, in the mirror. ROOMS's points: (1) the wings sit right standing, sitting and
  asleep, no stray specks (`z_wings.png`). (2) The heart shades: no grey line left anywhere. (3) The bow and bunny beanie with long
  hair (h1) and the ponytail (h3) hang right front and back; the cat hood frames the face from the front with every hair. Fix: the
  cat hood's back view (sitBack, type, rearStand, backwalks) is a flat lavender blob with no outline, seams or shading
  (`z_hood_hearts.png`), so from behind it reads as a placeholder; paint the back like the front. Owner: ROOMS. (4) The call: with any
  top on (every player always has one), the overalls read as plain lavender trousers and the suspender shorts as plain shorts
  (`fit3.png`), so they never look like their icons. Draw the bib and straps over the top (a layer flag, like shoes' "over"). Owner:
  LEAD (the layer rule), ROOMS (split the bib if needed). Badge, banner and icons read clean.
- QA, LEAD's bc757e2 armpit (on 0852011; `shots/qa/armpit_before_after_bc757e2.png`, `armpit_pants_bc757e2.png`): pass as an
  improvement, no regression. The pixel sweep (8 tops, 15 rows, 22 poses) against 17b8bd0: only stretchUp and stretch differ. The
  trouser specks from 2be3eda are gone: light pixels on the trousers at 300 px stretchUp count the same as before the rig change on
  both bodies with the jacket and o_tee (4/2/2/3 against 4/2/2/3; 2be3eda had 5/9/3/9). At 300 px the sleeves hold together better in
  stretchUp; still open, as LEAD said: a ragged underside, skin patches near the armpit with long sleeves in stretch, and one dark
  shard trailing past o_tee's left hand in stretchUp (also before). Owner: LEAD.
- QA, LEAD's 2be3eda armpit fix (on 9cfec0e; `shots/qa/armpit_before_after_2be3eda.png`, `armpit_pants_specks_2be3eda.png`): better
  sleeves, one new error. Regression sweep: 8 tops (o_tee, smk_jacket, sm_hoodie, kp_varsity, nc_hoodie, smk_cloak, tm_rafe_jacket,
  y_baby), 15 body rows, all 22 poses, before (17b8bd0) and after compared pixel by pixel: only stretchUp and stretch changed, every
  other pose identical. At 300 px stretchUp the confetti is mostly gone and the sleeves hold together (ragged underside, as you said).
  New: in stretchUp, short skin-coloured dashes now speckle the trousers on both bodies with the jacket and o_tee alike (they were not
  there before): the rigid limb copies below the armpit line carry arm pixels down over the legs. Clip those copies at the waist, or
  keep them to the arm's own cells. At room size the dashes are 1 px. Stretch: still skin patches by the armpit with long sleeves, as
  you said. Owner: LEAD.
- QA, ROOMS's 8d07611 cloak (on 17b8bd0, `shots/qa/smk/cloak_8d07611.png`): pass, so SMOKE BOMB is 15 of 15. The long sliver off the
  hand and the scrap at the hip are gone in stretch and stretchUp on both bodies; idle, walks, sitBack and sleep stay clean. Owner: ROOMS.
- QA, ROOMS's note on the rig's armpit (on 17b8bd0, `shots/qa/stretch_armpit_300px_17b8bd0.png`): confirmed, and it is every top, not
  the new art. Drawn 300 px tall, stretch and stretchUp break the sleeve and armpit into torn fragments and loose specks on both bodies
  for the cloak, SMOKE BOMB's jacket, SAYMØRE's tee and the old o_tee alike; at room size (about 100 px) it shows only as a ragged
  edge. Worth fixing before anyone zooms a room in close or a stretch shows in the 300 px mirror: rig.armpit in src/rig.js. Not a
  blocker for v0.63 (it was in every version QA passed). Owner: LEAD.
- QA, ROOMS's 36afaa1 SMOKE BOMB fixes and LEAD's 9d1092e names (on 9d1092e; `shots/qa/smk/*_36afaa1.png`): two pass, one small fix
  left. The band (ash-grey cloth, stitched smoke puff, side knot, no plate) and the vest (quilted puffer, funnel neck, ember zip,
  cream sleeves, no pockets or scrolls) read as original now, in all 22 poses on both bodies, alone and in outfits; their new Shop
  lines pass voice.js (1,437 lines, 0 hits). The cloak no longer throws a wing, and it hangs right in walk, sitBack and sleep, but in
  stretch and stretchUp a thin black sliver still trails off her and his left hand (`cloak_36afaa1.png`, cells 3, 4, 7, 8): trim it
  from the arm layer. Nit, as ROOMS said: the band's knot shows from behind on her and not on him. Owner: ROOMS.
- QA, LEAD's 4f0d21f SMOKE BOMB in the Shop (on 140a83d, `shop.js` BRAND=smk; `shots/qa/smk/shop_*_4f0d21f.png`): pass. 15 on him
  and 15 on her bought at full price through Try on, Checkout, Confirm, worn and in the mirror. The three art fixes from the wear test
  (the cloak hem, the band and vest designs) still stand with ROOMS. QA's old local servers are stopped (66 of them); none of QA's
  scripts point at LEAD's ports. Owner: LEAD.
- QA, ROOMS's a07439f SMOKE BOMB wear test (on 5660c2e; `shots/qa/smk/`): 12 of 15 pass, three fixes. All 15 on both bodies in all
  22 key poses, 0 draw failures; three outfits. ROOMS's five points: (1) no stray specks on the cloak or hakama, but the cloak's torn
  hem is on the arm layer: in stretch and stretchUp it flies out from the hand like a black wing, and in walks a scrap hangs from the
  left arm (`cloak_zoom.png`, `fit1.png`); move the hem to the body or a back layer. (2) The cowl covers the lower face and sits under
  the band, the wrap, the NC cap and a beanie; from behind it draws nothing (frontOnly), fine. (3) The tabi under the hakama and over
  the cargo look right in walks, sitting and sleep (`tabi.png`). (4) The wrap with long hair (h1) and the ponytail (h3): the hair
  hangs below it, nothing cut wrong (`wrap_h1.png`, `wrap_h3.png`). Fixes 2 and 3, Cal's rule "original designs only, no
  copyrighted costumes": smk_band (black cloth, long tails, a metal forehead plate with an engraved emblem) reads as the forehead
  protector from a famous ninja anime, and smk_vest (a dark flak vest with scrolls in chest pockets over long sleeves) reads as that
  show's ranked-ninja vest (`icons.png`). Redesign both: a plain cloth band with stitched SMOKE BOMB smoke, no plate; a vest without
  the scroll pockets and that cut. The jacket's orange-on-black is close too but generic enough. Badge, banner and the other icons
  read clean. Owner: ROOMS.
- QA, v0.63 (f5234d3, APPV 63): pass, publish. My clean build matches LEAD's served copy file for file (495 of 495; 21 files, 475
  art). On the exact build: savecheck; screens at 360 and 390; v0.62's own build makes a save that v0.63 loads, reloads, buys on and
  reloads; the level-5 start; Kode Plaza stages 0-2 and tapping in; town rules, townlive 5/5, townrx 12/12; doors 34 ok plus Garden
  and Restaurant walked both ways live; Begin at 10 sizes; diag/load (19 scripts); the team; voice.js 1,422 lines, 0 hits; the Shop,
  157 pieces on him and 161 on her bought and worn, Kode PinK and SAYMØRE included; Wednesday returns and launch reruns (96 slots,
  0 repeats, 0 still-live drops, two pages agree); all 30 rooms drawn, 21 of 21 buy through; the room tester walks all 17 story rooms;
  friends (16 visits, every figure drawn, rooms, dogs); Collect; the street camera upright and on its side. No page errors.
  SMOKE BOMB's ids are in items.json only and show nowhere. Still as accepted before: the mall's escalator in front of the Bowling and
  Karaoke doors. Owner: LEAD (publish and pin).
- QA, LEAD's b85b038 halo-mask rules (on 2282af8; `shots/qa/sm/*_2282af8.png`, new `sleeper.js`, `maskbed.js`): pass, so SAYMØRE is
  15 of 15. The mask stays on in all 22 poses on both bodies, sleepHead included; every glasses and face piece (shades, butterfly,
  wrap, V-shade, goggles, the Rift Mask, NC shades, SMOKE BOMB's cowl) is hidden under it, gaiter and buff too; in the real Bedroom
  awake with the mask and shades on, no shades show. The bed's own sleeping figure (QBLoft.sleeper, the picture the bed draws) keeps
  the mask and the halo; a cap still comes off and shades alone still drop in bed, as before. Not seen: the player actually lying
  down in a live Bedroom (at 2 am in the test the player stayed up); the sleeper picture is the one the bed uses. Owner: LEAD.
- QA, ROOMS's 8cab74a SAYMØRE pendant (on 8cab74a, `shots/qa/sm/pendant_8cab74a.png`, `icon_pendant_8cab74a.png`): pass. No body
  outline left in any pose on either body, alone or in an outfit; the chain and the Ø stay bold in front; from behind nothing draws
  (frontOnly, like the shades); the icon shows only the chain and the Ø. SAYMØRE is 14 of 15 now; still open: LEAD's two halo-mask
  rules (keep it in sleepHead; hide the face slot under it). Owner: ROOMS (done), LEAD (the mask).
- QA, ROOMS's 1712242 ping-pong retired (on 4550d03, new `retiredsave.js`; `shots/qa/gameroom_no_pingpong_4550d03.png`): pass. A save
  that owns gm_ping and everything else loads, keeps the id through a reload, and draws the Game Room with no ping-pong picture; the
  window never offers it; the room buys through, all 21; the doors to the Bedroom both ways are fine. The foosball and the snack
  corner have open floor round them now, nothing crowding the walkway. Owner: ROOMS.
- QA, SAYMØRE wear test (ROOMS's 9e19cdf, LEAD's Shop rows; on 831fc61; `shots/qa/sm/`): 13 of 15 pass, three fixes. All 15 on both
  bodies in all 22 key poses, 0 draw failures; three outfits; the Shop (`shop.js` BRAND=sm): 15 on him and 15 on her bought at full
  price, worn, in the mirror. No sneaker left at the feet of the hoodie or the mask in any walk (`feet.png`). The mask covers the
  face in every awake pose and every frame of the stretch, with hair h1, h2 and h3. Fixes: (1) sm_pendant carries the faint body
  outline the Kode PinK bag had, in every pose and on its icon (`pendant_zoom.png`, `icons.png`); cut it the same way. Owner: ROOMS.
  (2) Cal's rule that the figure stays masked breaks in the sleepHead pose: like every hat, the halo mask is dropped there and the
  sleeping face shows (`smfit1.png`, last cell of each body). Keep sm_halomask drawn in sleepHead (and the halo too, if it fits).
  (3) Glasses and face pieces draw on top of the helmet: Shades, Butterfly Glasses, Wrap Shades, V-Shade, Goggles, the Rift Mask,
  NC Sport Shades (`mask_faces.png`; the gaiter and buff sit below it and look fine). While the halo mask is worn, hide the glasses
  and mask slot, or let the Shop swap them off. Owner: LEAD (2 and 3, the rig and Shop rules). The banner shows only the masked
  figure; the icons read clean apart from the pendant.
- QA, LEAD's 3a1e3c1 (on fa50109): both pass. Kode PinK through the real Shop (`shop.js` BRAND=kp; `shots/qa/kp/shop_*_3a1e3c1.png`):
  14 pieces on him and 15 on her (the skirt hers only) bought at full price through Try on, Checkout, Confirm, worn and in the
  mirror. Launch reruns (`drops.js`, 12 rounds, now 84 slots with 7 brands): 0 back-to-back repeats, 0 drops of a brand still live;
  every date a Monday or Thursday, HANGANG first, NICE COCK fifth, two pages identical. Owner: LEAD.
- QA, LEAD's 046b0c3 launch reruns (on 49814eb, `drops.js` now checks 12 rounds, 72 slots, of the current 6 brands): better, not
  done. Back-to-back repeats 2 to 0; drops of a brand still among the live four 14 to 6. The six are all later than the three rounds
  your rerun.js covered: Y2K on 2027-02-15, Rose on 03-08 and 04-19, NC on 03-11 and 06-21, Alt on 08-05. Cause: the brands moved to
  a round's end keep a shuffled order, so the third slot of a round can be one of the previous round's last two. Fix: move them in the
  order they dropped in the round before; then every brand is at least 5 slots from its last drop. Only with DROPS.on. Owner: LEAD.
- QA, the published v0.62 (slug 3ab7eada, version 1794000054-1e81): pass. 493 of the 756def5 build's 494 files identical by sha256,
  none missing; index.html differs only by its title (my build with "Quest Board v0.62" in the title hashes the same, +6 bytes);
  lfvar.json matches app/lfvar.json; the 9 db rules declared (worlds, board, pings with {self}, diag, player, inbox owner-only), user
  and sample declared. Not opened, so Cal's diag docs stay his. Owner: LEAD.
- DONE by LEAD (v0.62 published and pinned, slug 3ab7eada; QA checked the files). WAITING ON LEAD (since 13:02): publish and pin v0.62. QA passed the 756def5 build in 8a8cda8 (494 of 494 files match your served copy; the full set and the recheck pass, see the next lines). QA's messages to LEAD are paused by the app, so this board line is the hand-off. Owner: LEAD.
- QA, ROOMS's c382557 Kode PinK bag (on c382557, `shots/qa/kp/bag_zoom_c382557.png`, `icon_bag_c382557.png`): pass, so Kode PinK is
  15 of 15. No body outline left in any of the 22 poses on either body, alone or in the outfit; the icon shows only the bag and
  strap. Nits, not blockers: a 1-2 px dark speck stays left of her hand in idle and stretch (left from the old outline), and the icon's
  strap stops in a flat cut at the top with a short stub on the left. LEAD can add the kp rows. Owner: ROOMS (nits), LEAD (rows).
- QA, v0.62 rebuilt (756def5, APPV 62): pass, publish. My clean build matches LEAD's served copy file for file (494, 0 differ;
  21 files, 474 art). The Diner's three small menus now sit clear of the ORDERS board and the shelf (`shots/qa/restaurant/
  diner_menus_756def5.png`); the right one's top just meets the wall's top trim without crossing it. Rerun on the exact build:
  savecheck, screens at 390, a v0.61 save loads, reloads, buys and reloads, diag/load (19 scripts after the rig art split, second
  visit 0.01 MB), Begin at 10 sizes, the team's tops, town rules, townlive (5 of 5), the new `townrx.js` (12 of 12: no reacting to
  your own post, a reaction kept in the reactor's own doc, +5 coins once, taking it back or switching pays nothing more, six more taps
  pay nothing, the Hall badge for a new post and cleared on opening the Hall), friends (16 visits, every figure drawn), all 30 rooms,
  the Restaurant's four stages. No page errors. Unchanged since 081ac04's full pass otherwise. Owner: LEAD (publish and pin).
- QA, LEAD's 01deb94 DROPS.rerun (on 57b68f7, `drops.js` with the launch schedule switched on, 15 weeks): two errors, both only
  once DROPS.on is true (not in v0.62's weekly mode, so not a v0.62 blocker). (1) A brand can drop on two slots in a row where a
  rerun round starts: Y2K on Thu Feb 4 and again on Mon Feb 8. (2) A rerun can "drop" a brand still among the live four, so that
  drop day brings nothing new: Y2K on Dec 28 while live since Dec 14, NICE COCK on Dec 31 while live since Dec 21. Fix in
  dropPlan: when a round starts, never repeat the slot before it, and push brands still live to later in the round. Owner: LEAD.
- QA, ROOMS's Kode PinK wear test (1dde4e1, on 279593c; `shots/qa/kp/`): 14 of 15 pass, one fix. All 15 on both bodies (the skirt
  on hers only) in all 22 key poses, 0 draw failures, three outfits, the headphones and star clips with hair h1, h2 and h3: nothing
  tears or clips; the skirt binds; the wide cargo sits over every shoe; the bag strap crosses over the varsity jacket. Fix: kp_bag
  carries a faint outline of a whole body: thin dark lines float around the arms, head and legs in every pose and both bodies
  (`bag_zoom.png`, `kpfit1.png`), and its icon shows the same mannequin (`icons.png`). Cut the bag and strap out of that outline.
  The other icons read clean. Owner: ROOMS.
- QA, v0.62 (081ac04, APPV 62, clean build; my 19 files and 473 art identical by sha256 to LEAD's served copy): everything passes but
  one small new error, so hold the publish for it (Cal: publish only when QA finds no more errors). Passed on the exact build:
  savecheck; screens at 360 and 390 (all tabs fit); v0.61's own build makes a save that v0.62 loads, reloads, buys on and reloads
  (`dist_old` from c48c7af); the level-5 start (1,205 coins, the Garden offered, Add 10,000 then it builds); Kode Plaza stages 0, 1,
  2 and tapping in; town rules (29 checks, all pass); doors 34 ok plus Garden and Restaurant walked both ways live (`doorlive.js`;
  doors.js cannot read e884ffd's function position); Begin at 10 sizes; diag/load; the team's tops; voice.js 1,394 lines, 0 hits;
  the Shop, 128 pieces on him and 131 on her bought and worn, NICE COCK included; Wednesday returns on both pages, every change at
  Wednesday midnight Pacific; all 30 rooms drawn, 21 of 21 buy through; the room tester walks all 17 story rooms; friends (16 visits,
  rewards, buffs, freeze cap, rooms, dogs); Collect; the street camera at 390, 360 and on its side. No page errors anywhere.
  The error: in the Corner Diner the three small menu boards overlap the ORDERS board's lower-right corner and sit on the shelf line
  (`shots/qa/restaurant/diner_menus_4b7ef27.png`); move them right by about their own width. Still as accepted for v0.61: the mall's
  escalator in front of the Bowling and Karaoke doors, the Game Room ping-pong (Cal's call). QA's earlier "boards face front" was
  wrong: zoomed in they slope with the wall. Owner: ROOMS (the menus), LEAD (rebuild; QA then rechecks the Diner and the file match).
- QA, ROOMS's 5d0986c pot racks and coffee (on c59b953, `shots/qa/restaurant/r3_kitchens_c59b953.png`): pass. In the Hole in the
  Wall the pans hang from a wall rail whose brackets meet the tile over the prep table; in the Diner they hang from a ceiling rack
  on chains over the island; the drip coffee sits on the counter, no stool. Still open from round 2: the boards face front and the
  Diner's five overlap; the safe stands in the diners' path. Owner: ROOMS.
- QA, the Restaurant round 2 (on 745fc70: ROOMS's 765e6fc, LEAD's 91ce178 and dd679ab; `shots/qa/restaurant/r2_*_745fc70.png`):
  most pass, three left. Pass: all 60 buy through the window; Breakfast Menu, Burger Menu and Bigger Till now show (cards, safe);
  only Hire a Head Chef draws nothing, which is fine (staff show live); the till faces the diners; the cooler is by the stools; the
  host stand is beside the mat; the patio heater is on the deck between the sets; the pergola clears its chairs; stage 3 reads
  "Neighborhood Bistro"; Room style is hidden under Noir; guests now use the patio (7 patio sits of 56 in 60 s live, none before).
  Left: (1) the ORDERS board and the small menu cards still face front as flat rectangles instead of lying on the tiled wall's
  slope (the shelf under them does slope), and in the Diner five boards in a row now overlap each other (BURGERS over the three
  small menus): one board plus two cards is enough. (2) The pot rack and the coffee stool are unchanged on main: ROOMS's rsx_prep,
  rsx_prepi and rsx_drip are not pushed yet. (3) The new safe stands on the dining floor in front of the partition, in the
  diners' path; put it behind the counter. Owner: ROOMS.
- QA, on d8f6780: all pass. LEAD's 91ce178 (cards grouped: buyable, mystery, then waiting): every room can now be bought to the end
  through its own window, 21 of 21 at level 60 (`stuckscan.js`, new: taps the first Buy button until none is left), the Restaurant
  all 60 and the Garden all 42. ROOMS's e884ffd: the Garden door's glow sits on the kitchen floor at its open end at all three
  stages. LEAD's 703822f NICE COCK through the real Shop (`shop.js`, now with BRAND= and the Try on, Checkout, Confirm flow;
  `shots/qa/nc/shop_*_d8f6780.png`): 16 of 16 bought at full price, worn and in the mirror, on both bodies. LEAD's e786b94 Collect
  (your collect.js on the clean build): nothing, then the note "400 waiting · finish a quest", then "COLLECT 120", then nothing; the
  400 to 120 drop is the till's cap clamping a pend set above it. LEAD's ff9ba96 class card (`classcard.js`): the art spans 356 of
  358 px for all four classes, fx-pulse on and off, opacity steady at 1. Owners: LEAD, ROOMS.
- QA, on cbb5e43: LEAD's b3b4d09 portrait sizes pass (Logan alone 101x280, Kenan and Jina 109x235 and 107x232), 172caa9 Garden lines
  pass (gardenreveal.js, all 10), b316e05 street camera passes upright at 390 and 360 and on its side, on the street and inside a
  building: the street sits on the nav, the sky takes the spare height (`streetcam.js`). On its side only the lower floors show at
  the widest zoom (the building is taller than the screen); fine for now. Owner: LEAD.
- QA, the Restaurant full pass for Cal (on cbb5e43; `docs/QA.md` "The Restaurant, full pass"; pictures `shots/qa/restaurant/`):
  one blocker and nine fixes. Blocker: after 13 upgrades the window shows only three "Needs Knock Through the Wall" cards and a
  "? ? ?", and Knock Through itself (r_x1) never appears, so nothing can be bought (level 14 and 60; `reststuck.js`). Fixes: the
  ORDERS board and menu boards face front instead of lying on the tiled wall, sit on its seam and on the shelf line; the pot rack
  floats (Hole: off the wall, bars across it; Diner: a free frame hanging from nothing); the coffee maker on a stool, the till
  behind the partition; Breakfast Menu, Bigger Till and Burger Menu change nothing visible; the cooler and host stand crowd the
  door mat; the patio heater stands across the kitchen half wall, the pergola post cuts its chair, the patio is never used live;
  Room style does nothing after Noir; stage 3 is "Noir" in 26_world.js but "Neighborhood Bistro" in r_x2's line. The doors, seating
  and staff work. Owners: ROOMS (art and room code), LEAD (the card list, the stage name).
- QA, LEAD's 5688ce3 Wednesday returns (on 4830bf7, `wedback.js`, two pages, every 6 h for 120 days): pass on the schedule. Weekly mode:
  both pages agree, the brand changes 15 times, every one at Wednesday 00-05h Pacific, never the same twice running (hanga and y2k
  alternate from Nov 25). Launch mode: pages agree; one return (hanga from Dec 23) that then stays every week, because the 5-brand test
  set retires only one. Not checked by QA: the Shop's own tab and header text (my script did not get the Shop screen open; LEAD's
  wedback.js read "↺ HANGANG"). Not started: ff9ba96 class card art. Owner: LEAD.
- QA, ROOMS's art batch (on beaf1a2 and 4830bf7; pictures in `shots/qa/`, untracked): all pass. 4bcda62 dry beds and watering
  (`gardenwater.js`, 390x844): 5 bed types show their dry twin; Water shows 6 cans from about 0.8 to 2.3 s while the dry layer fades
  1 to 0; no bed moves (raised, tomato, herb identical boxes; bed2 and berry by eye); with Sprinklers and the last watering 5 days old
  it stays watered at +0, +30 and +90 h and shows no dry bed. The cans are about 12 px in a 332 px window: readable, small. b9bcbbf: the
  herb planter's legs are straight, other beds in place. 07812e4 shadows: softer and warm, still ground the beds; the vanishing could not
  be made to happen in Chromium before or after (`shadowbuy.js`: 8 buys with the window open, every frame, 0 frames with a missing
  filter), so Safari is unconfirmed. d233c9e backdrop: fitted and repeated. f2c495b: the sweatband keeps the hair in every pose, both
  bodies. Seven friend portraits (811576a, 132de76): one style, not photoreal, outfits match FRIENDS, feet on one line, all three poses
  cycle. Notes for ROOMS: Vega's high-tops are white, black and orange in the panel layout of a famous sneaker (no logo, but they read as
  it); Kenan's shades change every pose (on, pushed up, gone). Owner: ROOMS.
- QA, LEAD's fe10549 solo size (on 4830bf7, `friendart.js`): a friend alone is still smaller than each friend in a pair. Logan draws
  91x175; Memo and Cynthia 127x221 and 125x239 (`shots/qa/friends/cards_solo_pair_4830bf7.png`). Also, ROOMS's note stands: at phone
  sizes the building view below the street is empty grey (pale blue at 360), the camera's zoom-out range, not the backdrop. Owner: LEAD.
- QA, ROOMS's 67d0e85 NICE COCK wear test (on da87000, matrix grid/wear/onepose with SwiftShader WebGL; sheets in `shots/qa/nc/`,
  untracked): one fix, 15 of 16 pass. All 16 on both bodies in all 22 key poses (idle, walk 1-4, stretchUp, stretch, sits, type, sleep,
  rear, back-walk 1-4, sleepHead), 0 draw failures, plus four outfits (cap+pendant+hoodie+black joggers+high-tops; beanie+shades+tee+
  shorts+slides; pendant+quarter-zip+slate joggers+knit sneakers+shades; cap+shades+pendant+tank+ash joggers+high-tops): nothing tears,
  floats or clips; the pendant sits over the hoodie and tee; joggers meet the high-tops cleanly. Fix: nc_band (sweatband, hat slot) cuts
  the hair away above the band like a hat does, so the head is bald above it, front and back, both bodies (`band_zoom.png`; o_bandana
  and both beanies keep their hair, `hats_cmp.png`). It needs the hair kept, or drawn over the hair as a band. Icons (`icons_big.png`,
  `icons64.png`): "nicecock." is clean and legible on the band, cap, tee, hoodie and shorts; on the joggers it is a small mark at 64 px,
  not garbled. Not checked: the yawn painted layer (none yet; the 404 for f_nc_hoodie_yawn falls back as designed), real Safari/WebGL,
  and in-room size. Owner: ROOMS.
- QA, on da87000: LEAD's 21aae0a (friends only in their own room's building, no dog copies; friendsroom.js) and 1e2f433 (room
  tester: no retired pieces, openers open their rooms, Next story step walks a new player through all 17 rooms in story order with
  their scenes, then stops; roomtester.js) pass, 0 errors. a652991 drop schedule (`drops.js`): on, every date a Mon or Thu, HANGANG
  first, two pages identical, live -> vault in order with no duplicates; off is the same function as before (not compared on screen).
  Friend portraits (ROOMS's Justin, LEAD's 76a99a4; `friendart.js`, 390x844): illustrated, not photoreal, his rig's outfit, 180x240,
  feet within 1 px across poses, cycles 0-1-2. Two fixes for LEAD: the 0.45 s cross-fade between very different poses shows a ghost of
  one behind the other; and a two-friend card stacks the figures vertically on a phone (Kenan above Jina, card 786 px tall). Owners:
  LEAD (both), ROOMS (go ahead with the other six).
- QA, LEAD's 0b21495 room tester (on c0f0cbd, `rigtest/qa/roomtester.js` through window.__qbRooms): Open, Everything, Empty and View
  work on all 22 rooms, no page errors; three fixes. (1) Everything also owns retired pieces, so Cal sees art the game no longer sells:
  mall 5 (ml_dir, ml_photo, ml_gum, ml_ride, ml_flower), rooftop 4, gameroom 2, skybar 2, closet 2, lair 1, dessert 1, vr 1. Skip
  `u[3].retired` as allrooms.js does. (2) Everything owns the upgrades that open a room without opening it: bd_patio, bd_game (Bedroom),
  lr_troom, r_bar, sb_roof, de_secret; the save then holds the opener with no Patio, Game Room, Trophy Room, Sky Bar, Rooftop or
  Speakeasy. Either open the room too or leave the opener out. (3) Next story step on a new player never moves: each tap re-offers
  the Garden lot ("The empty lot next to your building is up for sale...") and the story stays at offer garden, done none, Bedroom
  only, 14 taps in a row. A buy step needs building (like Open) for the button to step through the story. LEAD's two questions: the
  Bedroom showed 35/35 here, so the 36th key wasn't reproduced; the 4 empty <image> tags are the gaming chair's swap layers (lfbrg0/1,
  lfbch1d/1n, opacity 0, filled when someone sits), already in v0.61, harmless. Owner: LEAD.
- QA, LEAD's 3bcbb44 room zoom (`rigtest/qa/zoomfps.js`, 390x844 touch, CPU x4, every upgrade, before 8d97e24 / after 172caa9): pass.
  Pan frame times, median / p90: Bedroom 50 / 150 ms to 17 / 17, Garden 17 / 67 to 17 / 17. Pinch: Bedroom 17 / 117 to 17 / 17,
  Garden 17 / 83 to 17 / 17. The worst single frame is still 150 to 350 ms; that is the one viewBox commit at the end, as designed.
  After a pan or pinch lifts no transform is left and the view moved; the wheel, +, - and reset all work. Not new: a drag on an unzoomed
  picture scrolls `.modal`, but the room window (.rmodal, overflow hidden, 92vh) never makes it scroll, so that drag does nothing, before
  and after. The whole-building pan (lfApplyNow) was not measured. Owner: LEAD.
- QA, friends on 1194d92 and c0f0cbd (befd663 fixes, 3939130 lines, 3bcbb44 rooms; `friendsqa.js`, `friendsroom.js`, voice.js now
  reads the visits): the fixes pass, plus two new bugs in where friends stand. Pass: at 2 of 2 freezes Kenan gives +300 coins and
  the card says so; a Bedroom-only player is told "the Bedroom"; no pronouns for the friends; a card due while another window is open
  waits and shows 2.5 s after it closes (and keeps waiting behind a story scene). All 16 still draw and pay; the new lines pass voice.js
  (1,378 lines, 0 hits) and read plain. Bugs: (1) a friend whose room is in another building is also drawn in the Loft's Bedroom:
  Kenan and Jina stand in the Restaurant and in the Bedroom at once, Cynthia in the Garden and the Bedroom (lfVisitRoom only finds
  rooms with LFMETA, the open building's, so elsewhere it falls back). (2) A Chopstick or Pluto visit adds a second copy of the dog
  who already lives in the Bedroom (v:dog:chopstick next to dog:chopstick). Small: three lines name a room the player may not have
  ("in the gym", "in the studio", "the shelf in the lounge") while the card then says "the Bedroom". Owner: LEAD.
- QA, LEAD's 8d97e24 (on 07812e4, `rigtest/qa/friendsqa.js`; cards `shots/qa/friends_cards_07812e4.png`): works, three small fixes.
  All 16 visits forced on a new player and on one with every room: each card draws its figures (rig 173x197, dogs their art), coins
  land (250/150/100/150/80), Kenan's freeze lands, Cynthia waters the Garden only when there is one, and every buff raises the real
  x.mults() of a matching quest by exactly its stated amount (fitness, discipline, create, admin, body, out, home, social). No page
  errors; looks read clean at card size. Fixes: (1) Kenan's freeze ignores the cap: at 2 of 2 it makes 3 (the wheel and streaks stop
  at maxFreeze(), the wheel pays 300 coins instead). (2) A new player owns only the Bedroom, but the card says "They're hanging out in
  the Lounge today" (fvShow falls back to the Lounge even when it isn't owned; 3bcbb44's live fallback goes on to the Bedroom, the card
  should match). (3) The text gives friends pronouns ("his", "He", "her") that Cal never stated (CLAUDE.md: they/them when unstated);
  either Cal confirms them or rewrite around them, e.g. "Justin is on the way to rehearsal". Not checked: the daily roll's rate and the
  no-repeat over many days (fvCheck isn't reachable from the test hook; the code reads right: 57% a day, the last visit left out of the
  pool), and a visit card due while another window is open (fvShow is skipped if a window opens in the 1.2 s after the roll, so the
  reward lands with no card). voice.js does not read the visit lines yet; read by hand, no rule broken. Owner: LEAD.
- QA, LEAD's ab7fcae (clean build; `rigtest/qa/gardenreveal.js`, `townlive.js`, sim.js + unlocks.py + water.py): two wording fixes, the
  rest passes. Town board: all 5 townlive checks pass, focus survives a full render(). Garden (fresh level-5 player, built via rdo): no
  Restaurant, chef or sell before the first produce; it starts watered; the stand says "Nothing to sell yet"; after 3 h "1 produce
  ready / SELL FOR 4 COINS" and the one-time pop; no page errors. Errors: (1) the build splash contradicts itself: "It grows fresh
  produce on its own. Nothing to water, nothing to harvest." then "Water it: The beds only grow while they are watered..."; drop the
  first. (2) The dry window says it twice: "The beds are dry. Nothing grows until you water them." and "The beds are dry. Water them
  and your first harvest starts growing; you sell it from this window."; keep the second. Unlock order: 12-task Garden day 4, Mara day
  6 (level 7 binds, not the 12 sold), boba 9, dessert 10; casual Garden 6, Mara 10 (was 14); a 1-in-3-day waterer still Mara day 6.
  No day stacks two story steps (12-task day 4 is the Garden plus a closet the player bought). Casual day 6 buys nothing: saving 1,026
  of the Garden's 1,200, fine. Owner: LEAD.
- QA, the published v0.61 (slug b9f23da6, version 1793991295-0706): pass, 461 of the c48c7af build's 462 files identical, none missing,
  index.html only by its title ("Quest Board v0.61", 6 bytes), lfvar.json matches, the 9 rules declared; not opened yet. Owner: LEAD.
- QA, ROOMS's fa8efd9 (the console line trimmed): not yet. QA had the limit wrong: voice.js allows 95 characters (aim about 90), not
  100; the line is 98 with its buff. "A slim glossy shelf, lit underneath. It sits low under the screen." (88) or "Slim glossy shelf, lit
  underneath. Sits low, so the screen stays clear." (93) both pass. Owner: ROOMS.
- QA, ROOMS's d34d2ce (the TV console centred, artIf; `shots/plaza/tvwall_d34d2ce.png`): pass. Under the 80 inch screen and under
  the Big TV (`allrooms.js` with the new DROP option) the console sits centred under the screen, parallel to its bottom edge, both ends
  tucked in, nothing crossing; the floor lamp clear beside the snack bar. artIf disturbs no other room: every room fully bought
  against v0.61, only the Game Room changes (1.2%; the others differ only by render noise, as v0.61 against itself). Still: the
  console's description is 101 characters, one over (`voice.js`). Owner: ROOMS (trim it).
- QA, LEAD's 60e3e50 (the town board for many players; new `townlive.js`, two players on one stand-in db with the real rules,
  stored per document): one fix. Passes: a half-typed post keeps its text, caret and focus through the board's own 20 s reload; Ben's
  post reaches Ana on its own in 13 s, tagged "new"; posting in the same moment keeps both; no page errors. Fix: a full game repaint
  (render(): rare in the Hall, e.g. a new area opening or a raid ending) keeps the text but drops the focus and caret, which on a
  phone closes the keyboard mid-word; restore them after render() as socPaint does. Not checkable here: the real db with two real
  accounts. Owner: LEAD.
- QA, v0.61 rebuilt (c48c7af, APPV 61; Cal: "Publish 0.61 now and continue with other tasks"): pass, publish. On the exact build:
  savecheck, screens (360, 390), old saves, the level-5 start (1,205 coins, gate 5, the right areas; Add 10,000 then the Garden builds),
  Kode Plaza stages 0, 1, 2 and tapping in, town rules 32 of 32, doors 36 of 36, Shop 44, Trophy Room, the Rift Mask, the team,
  diag/load, Begin at 10 sizes with the pill hidden in the creator, all 30 rooms: all pass, no page errors. Ships with two known
  Game Room items Cal accepted: the ping-pong table blocked at both ends; the TV console not lined up (also its description is 101
  characters, one over the limit, `voice.js`; d34d2ce lines it up but keeps the text). Owner: LEAD (publish), ROOMS (the two items).
- QA, correction (Cal, 2026-11-06, phone screenshot: "The tv and stand are not lined up properly"): QA's pass of 9d5aed7 is withdrawn;
  QA missed it. The slim console sits shifted left and forward of the TV: its left end past the screen's left side, its right end
  well short of the right, so it cuts across the screen's lower left instead of sitting under it; the floor lamp's pole stands in
  front of the TV's lower-right corner (`shots/plaza/gameroom_9d5aed7.png`). Fix: centre the console under the screen, back edge
  along the wall beneath the TV's bottom edge, both ends tucked in; the lamp clear of the screen; check with both TVs. v0.61 waits
  for it as well as the ping-pong answer. Owner: ROOMS.
- QA, ROOMS's 9189946 + 9d5aed7 and LEAD's 38e1ab7 (Kode Plaza stage 0, its sign, the Game Room; `shots/plaza/`): pass. bld_plaza_s0
  reads as an open garden plaza (beds, wall, pergola with lights, lemon trees, birdbath, bench, no building front), sits right
  between the Loft and Calibur Mall, dims at night (`sign_stages.png`); with the Restaurant the cafe returns. The pink "flecks" are
  a faint fringe on the outer edges of the trees and pergola (`s0_edges.png`), invisible at street size. The sign now sits just
  over the trees at stage 0 and back in the row at stage 1; out of line with the other two at stage 0 but clearly the plaza's:
  taste, fine. Game Room: the dartboard on the left wall between the door and the TV corner with open floor in front; the TV corner
  a tile back; the foosball bigger and flipped; the Floating Media Console one slim low shelf, the screen clear (Cal's note); no
  page errors. Left: the ping-pong table still blocked at both ends (snack bar, sectional), waiting on Cal (drop it or not).
  Owner: LEAD (v0.61 once Cal answers on ping-pong, or Cal lets it ship as a known item).
- QA, LEAD's 3d7f57a (the level-5 test start's coins): pass. A new test character starts with 1,205 coins and lvPaid 5; Testing
  Level up to 6 gives 1,365 (+160, levelPay(6)); no page errors. Owner: LEAD.
- QA, LEAD's ce07425 (each rig frame decoded before it is shown, Cal's walking blink): checked as far as Chromium allows: the code
  decodes each new frame before offering it and drops it when its cache slot goes, characters draw in the rooms, no page errors.
  Chromium does not show Safari's blink, so whether it is gone is for Cal's iPhone. Owner: LEAD.
- QA, LEAD's 2882690 (Kode Plaza's street picture by stage; `shots/plaza/`, new `plazastreet.js`): the code passes: Garden alone =
  stage 0 and never the cafe; Garden + Restaurant = stage 1, today's cafe picture; a third room = stage 2, still the cafe until a
  bld_plaza_s2 exists; tapping the building still opens its rooms; no page errors. Not shippable alone: until bld_plaza_s0.webp
  exists, stage 0 shows the plain drawn front, a grey office tower (`plaza_1.png`), which is no plaza either. v0.61 waits for
  ROOMS's s0 art. Owner: ROOMS (s0), LEAD (v0.61).
- QA, ROOMS's 925480a (the dartboard off the lit hexes): not passed. It is off the panels now, on the plain left wall, but right
  above the retro TV corner (`gameroom_925480a.png`): a throw would cross the TV and the beanbag sitters. Every reference dartboard
  has a clear lane of open floor in front. Put it where the floor in front is open (the back wall between the hex cluster and the
  arcade, or the left wall by the door if the landing stays clear). The ping-pong table waits on Cal. Owner: ROOMS.
- QA, ROOMS's 6f04ed8 (Game Room: the lit hex panels, the foosball to the front, the ping-pong clear of the doorway; `shots/gm4/`):
  NOT passed under Cal's new rule. Good: the outer hexes glow and frame the TV on both sides and the top, so the TV no longer hides
  the lit ones (Cal's note); the foosball stands at the front, clear of the pool table and the doormat, giving the arcade room;
  the ping-pong table is inside the room now, off the doorway; retired pieces still draw nothing; no page errors, day and night.
  Errors: (1) the dartboard now hangs on top of the lit left hex cluster and covers several glowing panels (`full_13.png`), the
  same thing Cal disliked about the TV; move it to plain wall (left of the hexes, by the arcade). (2) The ping-pong table is
  blocked at both playing ends: the snack bar and fridge at its right end, the sectional's arm a step from its left end
  (`live.png`). Against the references the room now holds one table too many (pool, foosball and ping-pong in 13 x 10, plus the
  sectional): drop the ping-pong table (Cal's call) or turn the snack corner so the table's ends face open floor. Owner: ROOMS.
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
- Now (on 4287952): LEAD's 44 yawn pictures on Unlimited, 29 done (28 passed QA; bb_cloak in, BARD & BLADE complete); next cr_trench,
  cr_bomber, cr_mesh, cr_vest, km_*, oak_*, sv_nordic, sv_quilt, sv_fleece.
  WAITING ON Cal: Vega's in-game tee (black Spray Paint Boxy Tee) or his portraits' white splatter tee: which one is his look?
- WAITING ON QA: check 4287952, yawn picture 29 (bb_cloak): your yawnfall.js and yawnsweep.js. A second paint; the front should be closed like idle.
- DONE by QA (QA findings: pass). WAITING ON QA: check e70ef55, yawn picture 28 (bb_doublet): your yawnfall.js and yawnsweep.js.
- DONE by QA (QA findings: pass). WAITING ON QA: check 56f58a2, yawn pictures 26 and 27 (bb_tunic, bb_gambeson): your yawnfall.js and yawnsweep.js. The tunic is a second
  paint; the first left a strip of arm under the boy's far sleeve.
- DONE by QA (QA findings: pass). WAITING ON QA: check 45658f8, yawn picture 25 (sp_hpknit): your yawnfall.js and yawnsweep.js.
- DONE by QA (QA findings: pass). WAITING ON QA: check edefc90, yawn picture 24 (sp_p2): your yawnfall.js and yawnsweep.js. A second paint; check the PLAYER 2 print reads.
- DONE by QA (QA findings: pass). WAITING ON QA: check 68eb5aa, yawn pictures 22 and 23 (sp_varsity, sp_pad): your yawnfall.js and yawnsweep.js. sp_pad is a second paint;
  the first left the boy's far sleeve hanging under his arm.
- DONE by QA (QA findings: pass). WAITING ON QA: check 360da8a, yawn pictures 20 and 21 (gp_star, gp_sailor): your yawnfall.js and yawnsweep.js.
- DONE by QA (QA findings: pass). WAITING ON QA: check 2d2ea91, yawn pictures 18 and 19 (gp_blazer, gp_bear): your yawnfall.js and yawnsweep.js. The blazer is a second paint;
  the first left a thin strip of the boy's body down his right side.
- DONE by QA (QA findings: pass). WAITING ON QA: check b62c0a2, yawn pictures 16 and 17 (smk_vest, smk_cloak): your yawnfall.js and yawnsweep.js.
- DONE by QA (QA findings: pass). WAITING ON QA: check aab35f3, yawn pictures 14 and 15 (smk_jacket, smk_mesh): your yawnfall.js and yawnsweep.js.
- DONE by QA (QA findings: pass). WAITING ON QA: check f18de4c, yawn pictures 12 and 13 (sm_tee, sm_vest): your yawnfall.js and yawnsweep.js.
- DONE by QA (QA findings: pass). WAITING ON QA: check 57dafa4, yawn pictures 10 and 11 (kp_bomber, sm_track): your yawnfall.js and yawnsweep.js.
- DONE by QA (QA findings: pass). WAITING ON QA: check 25939d4 and bf08f94, yawn pictures 8 and 9 (nc_qzip, kp_sailor): your yawnfall.js and yawnsweep.js.
- DONE by QA (QA findings: pass). WAITING ON QA: check bc4a575, yawn pictures 6 and 7 (nc_tank, kp_hoodie): your yawnfall.js and yawnsweep.js.
- DONE by QA (QA findings: pass). WAITING ON QA: check 653138e, yawn pictures 4 and 5 (sm_hoodie, sv_ski): your yawnfall.js and yawnsweep.js. The hoodie was repainted
  with cuffs at the wrists (the first sheet ran the sleeves over the hands); the ski jacket's sheet had a drawn face, dropped.
- DONE by QA (QA findings: pass). WAITING ON QA: check 2dde59c, 8f026ce, 05e7c19, the first three of the 44 yawn pictures (nc_hoodie, nc_tee, kp_varsity) in the stretch
  on both bodies with every hair and necklace: no tears, sleeves to the wrists, nothing stray on the head (the tee's sheet had a drawn
  face, dropped). ROOMS checked the matrix stretch pose on both bodies.
- DONE by QA (QA findings: pass). WAITING ON QA: check 567ea26, your open point on 570b2f3. Nightclub: the DJ and bartender spots stay behind the decks and the bar
  (onspot), and a staff aisle reaches them from the right (bar off the wall, speakers in line with the decks, coat check a little
  right and shallower). The Sky Patio lounge chair's seat has a walk-to point. ROOMS checked lfRoute to all three and the Club
  live at 22:00 (the DJ at the decks), 0 page errors.
- DONE by QA (QA findings: pass but the Nightclub's staff spots). WAITING ON QA: check 570b2f3, Cal's use check (your 6430d13 list). Every room fully bought: the Arcade pinball points into the
  room; Skee-Ball's player at its throwing end; the Speakeasy upright piano on the back wall facing the room and its bar off the
  wall; the Club and Rooftop DJ decks off the wall with the DJ behind; VR flight pod off the sofa, ring chair in from the edge;
  Rhythm dance pads a tile out, bench off the mirrors; lobby booth clear of the sofa; Restaurant coffee off the pizza oven, smoker
  in the olive corner, table out of the crescent's opening; skybar glass cabinet clear of the sofa; Bedroom mirror on the left
  wall (clear of the Closet door); Mall fountain clear of the clothing store; Boba fridge on the back wall; Dessert towers off the
  bookcase; Garden potting bench ends the tool column. Bowling unchanged: bwx_seatb is a rear view, the seats face the lane ends.
  ROOMS checked all 21 rooms headless, 0 page errors.
- DONE by QA (QA findings: pass). WAITING ON QA: check 62d336d, dbf2593, a4be384, aca27a1 and 1e8a3b4. (1) Screens: the Auditorium, the lobby trailer and showtimes and the
  Boba TV show a still picture when animations are off. (2) The Rooftop and Sky Patio stay dark at 22:00 (abe06dd had lit them).
  (3) Kenan's three portraits wear the same black shades as his in-game look (Cal). (4) The Bedroom rug tucks under the bed; the
  dog beds stay on the front edge (an earlier call). (5) The Rhythm Room's front floor gets a neon dance circle with the Pulsing
  Floor. (6) The Sky Patio keeps the wicker lounge chair by the fire once the Egg Swing is in. Not taken (design calls, need art or
  Cal): the Dessert bookcase and mirror, the VR Arena palette, the full Restaurant's density.
- DONE by QA (QA findings: pass). - WAITING ON QA: check 633ffe2 and ede09d8 for v0.68. (1) The Upstairs Bar (r_bar) needs White Linen Service (r_t3, Cal's "fine dining")
  and is hidden until then; a save that owns the bar keeps it. (2) The Garden lot is for sale from level 5 (padlock at 4), matching
  The Loft's welcome card. ROOMS checked headless, 0 page errors. Also 0f9cabe: Take Over Next Door's splash now says white linen comes before the bar upstairs.
- DONE by QA (QA findings: pass). - WAITING ON QA: check 4e93d54, Cal's room-window notes. (1) Room windows never zoom: no + - or reset, no wheel or pinch (only the
  Bedroom keeps its lamp button); the street and building views stop at 1.6x (was 2.6x). (2) The stage-1 and stage-2 Restaurant
  double shelf runs along the back wall above the wainscot (it was mirrored). (3) The Grand Menu Board (CARTE DU JOUR / OUR MENU) is
  66 high and wholly above the rail, clear of the wine wall. ROOMS checked headless, 0 page errors; not on a phone.
- DONE by QA (QA findings: pass). - WAITING ON QA: check 1308059, buying an upgrade with the room window open. People keep their places, what they are doing, their
  seat and order and their look; the new pieces pulse gold twice (about 1.3 s) after the crate opens, the soft-shadow layer does
  not. ROOMS checked headless buying the Restaurant Open Sign with 5 people in the window. Not done: a flash in the building view
  (it is hidden behind the window while you buy); not checked on a phone or in other rooms.
- DONE by QA (QA findings: pass). WAITING ON QA: check 93d33f1, Cal's Restaurant notes in every business. (1) No two identical customers in one room, and fewer: one or
  two stay, more about halved, five at most (`lfGuestN`). (2) Chair shadows sized to the chair; beds and sofas unchanged. (3) The
  Sidewalk Sign is now the Open Sign: chalkboard plus a neon OPEN in the first window (not in Noir). ROOMS checked headless: Restaurant,
  Boba, Dessert, Arcade, Theater, Mall and Club sampled 12 times each in the building views, 0 duplicates, at most 5; stage-1
  Restaurant 2. Not checked: the Auditorium, Speakeasy, Bowling, Karaoke, VR and Rooftop one by one, and phones.
- DONE by QA (QA findings: pass). WAITING ON QA: check abe06dd, night lights (Cal: only the Bedroom needs a light switch). At 10 pm: every room but the Bedroom draws lit with
  no lamp button (window and building view); the Bedroom stays dark until its lamp is on, and its button and saved rm.lit work as
  before. ROOMS checked headless: Bedroom off and on, Lounge, Restaurant, the Loft and Plaza building views, 0 page errors.
- DONE by QA (QA findings: pass, 15 of 15). WAITING ON QA: wear test SØLVBERG, 57527b0 (brand id sv; 15 pieces, both bodies; the leggings are hers only). ROOMS checked headless
  on 1660269: idle, walk1, backwalk1, stretchUp, stretch and sitBack, 10 of 10 outfit cells with 0 failures each. Look hardest at:
  the mittens in the "arms" slot (their clip-cords floated beside the arm, so I stripped them); the trapper and pom beanie with long
  hair and the ponytail; the goggles (noClip) on the forehead; the puffer and après boots ("over") with each pant; the badge (a
  snowcapped peak and snowflake, no cross). Rig note for LEAD, not this brand: stretchUp shows white flecks at the armpits on every
  top, older passed ones too (oak_track, sp_hpknit, cr_bomber).
- DONE by QA (QA findings: pass; the badge ring is still green). WAITING ON QA: check OAKMONT's stripes, recoloured. QA's design call (the green-burgundy-green web stripe) is answered by recolouring
  every green stripe to navy: headband, wristbands, track jacket and pants, skirt hem, tube socks, tennis vest, the crop's second
  racket, the cap button and the badge ring. ROOMS checked headless: idle and backwalk1, 17 of 17 with 0 failures. LEAD gets the new
  colours and lines.
- DONE by QA (QA findings: 15 of 15 fit; one design call, the green-and-burgundy stripe). WAITING ON QA: wear test OAKMONT, 78c961b (brand id oak; 15 pieces, both bodies; the skirt is hers only). ROOMS checked headless on
  0a88ad4: idle, walk1, backwalk1 and stretchUp, 31 of 31 with 0 failures each (with cr_arm for reference). Look hardest at: the
  wristbands and the watch in the "arms" slot (the watch is on one wrist; it matches the cr_arm sleeve, viewer-left from the front,
  viewer-right from behind); the headband and visor (noClip) with long hair; the track jacket (two stripes, not three) and the
  court shoes and suede runners as original, not any famous sportswear; the tube socks under trousers. LEAD has the shop lines.
- DONE by QA (QA findings: pass). WAITING ON QA: wear test KAIMANA, 24304af (brand id km; 15 pieces, both bodies). ROOMS checked headless on 2b65e9b: idle, walk1,
  backwalk1 and stretchUp, 30 of 30 with 0 failures each, reading right by eye. Look hardest at: the straw sun hat and bucket hat with
  long hair and the ponytail (wide brims), the visor (noClip, open top), the crochet cardigan (open front over a cream tank), the board
  shorts and cut-offs under a top, the shell necklace. LEAD has the shop lines.
- DONE by QA (QA findings: pass). WAITING ON QA: check 14bd0e5, CHROME RAIN's two fixes. cr_mesh is now an opaque dark purple diamond net under the harness, the same
  on both bodies, matching its icon. cr_lightup has a small rose lightning bolt and a straight line, no wavy stripe; a baked outline
  was stripped. ROOMS checked headless on 577831f: idle, walk1, backwalk1 and stretchUp, 16 of 16 with 0 failures.
- DONE by QA (QA findings: 14 of 15, the mesh top; one design call). WAITING ON QA: wear test CHROME RAIN, 5cf2e1d (brand id cr; 15 pieces, both bodies; the skirt is hers only). ROOMS checked headless
  on c3088b5: idle, walk1, backwalk1 and stretchUp, 29 of 29 with 0 failures each, reading right by eye. Look hardest at: the cyber-arm
  sleeve (one arm, "arms" slot); the trench in stretch and walks (knee length); the mesh top (its holes opened so skin shows; it reads
  mostly as a harness over skin at game size, so say if it needs more net); the visor (a baked outline stripped); the mohawk helmet and
  hood over every hairstyle; the platform and combat boots ("over") with each pant. LEAD has the shop lines.
- DONE by QA (QA findings: 15 of 15, two rig notes for LEAD). WAITING ON QA: wear test BARD & BLADE, f843b25 (brand id bb; 15 pieces, both bodies; the skirt is hers only). ROOMS checked headless
  on f100e51: idle, walk1, backwalk1 and stretchUp, 29 of 29 with 0 failures each, reading right by eye; the travel cloak, mantle,
  circlet, crystal and bracers also in stretch and sleep. Look hardest at: the bracers in the new "arms" slot (LEAD 23bf14f; the far
  one is ragged from behind in type1, like that arm's sleeves); the travel cloak in stretch and walks (knee length, my earlier cloak
  trailed slivers); the wizard hat (ingested with a looser 0.2 limit for its wide brim) with long hair and the ponytail; the ranger hood
  over every hairstyle; the skirt with "overTop" (tool belt over the top); the crystal (a baked outline was stripped). LEAD has the
  shop lines.
- DONE by QA (QA findings: pass). WAITING ON QA: check 200d498, SAVE POINT's two fixes. sp_headset from behind shows only the arc and the cups; the band across the
  back of his head is erased, and hers came out clean. sp_flag is now grey lace-up sneakers with a purple toe, teal laces and a red
  pixel flag, with no checkerboard; a baked outline was stripped. ROOMS checked headless: idle, walk1, backwalk1 and sitBack, 16 of 16
  with 0 failures. LEAD has the new shoe row.
- DONE by QA (QA findings: 13 of 15, the headset's back and the checkerboard slip-ons). WAITING ON QA: wear test SAVE POINT, bad0b45 (brand id sp; 15 pieces, both bodies). ROOMS checked headless: idle, walk1 and
  backwalk1 load 30 of 30 with 0 failures and read right by eye. Look hardest at: the coin cap and the checkerboard slip-ons (a baked
  mannequin outline was stripped from both; look for leftover lines, and the cap's brim edge is a little soft); every teal detail
  (the brand's bright green is the key colour, so greens inside clothing became teal: PLAYER 2 letters, varsity cuffs, headset rings,
  the pompom, the track stripe); the headset (noClip) and the cap with long hair and the ponytail; the shades (frontOnly). Design call
  for QA: the checkerboard slip-ons are a common style and carry no logo, but say if they read as one shoe brand. LEAD has the shop lines.
- DONE by QA (QA findings: pass). WAITING ON QA: check 86f50d9, GACHA POP's cat hood back. It is repainted with an outline, knit ribbing, a centre seam and the blue
  trim at the neck. ROOMS checked headless on both bodies: idle, backwalk1 and sitBack, 8 of 8 with 0 failures. The overalls' and shorts'
  "overTop" flag is in d4d8fd8; LEAD's rig side (pantsOver) decides when that shows.
- DONE by QA (QA findings: 14 of 15, the cat hood's back; the overalls' bib). WAITING ON QA: wear test GACHA POP, 03274a7 (brand id gp; 15 pieces, both bodies; the skirt is hers only). ROOMS checked headless:
  idle and walk1 load 29 of 29 with 0 failures; backwalk1 for the wings, hood, bear, sailor, bunny, bow and shades looks right.
  Look hardest at the wings (neck slot, ingested with a looser stray limit of 0.25, so check sits and sleep), the heart shades (a
  baked mannequin outline was stripped; look for leftover grey lines), the bow and bunny beanie with long hair and the ponytail
  (noClip on the bow), and the cat hood over each hairstyle. The suspenders and the overalls' bib sit under any top, so with a top
  on they read as shorts and trousers. LEAD has the shop lines.
- DONE by QA (QA findings: pass). WAITING ON QA: check 8d07611, the SMOKE BOMB cloak's last sliver. Below the waist the hem is trimmed to hip width with an inked edge.
  Headless at 240px cells, the long sliver off the hand and the scrap at the hip in stretch are gone on both bodies (compared with
  36afaa1). Left alone: a short armpit fleck in stretchUp shows on every top at large sizes (smk_jacket, sm_tee, gp_blazer), so it
  is the rig's armpit split (LEAD's rig.armpit), not the cloak. Clearing the arm-to-body gap in the art changed nothing.
- DONE by QA (QA findings: 14 of 15, a sliver at the hand in the cloak's stretch). WAITING ON QA: check 36afaa1, SMOKE BOMB's three fixes. smk_cloak is repainted closed with the torn hem at the hip; look at stretch,
  stretchUp and walks, which ROOMS checked in stretchUp and walk1. smk_band is plain stitched cloth with a smoke puff and no plate;
  its knot shows at the back on her and not on him. smk_vest is a quilted funnel-neck puffer over cream sleeves. LEAD: rename two rows,
  band to "Stitched Headband" and vest to "Quilted Puffer Vest" (texts in ROOMS's message).
  Retired ids so far: `gm_ping`, `sb_chester`, `sb_trolley`, `rf_lng2`, `rf_towel`, `rf_ice`, `rf_umb`, `ml_gum`, `ml_ride`, `ml_photo`,
  `ml_flower`, `ml_dir`, `vr_pod2`; new `sb_band`, `dg_riftmask`, `tm_*` tops; `ml_kar` needs `ml_bow`. Dark-floor shadows stay at 0.92 (QA: 0.8 is the knob if Cal finds them heavy). (on a07439f)
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
- [ ] Regenerate `o_lock`, `al_carab`, `v_shade`, `v_corset` cleanly (their baked-in mannequin was cut out by hand). ROOMS on f39f668:
      all four render clean in idle and backwalk1 on both bodies, so they stay as they are during the playtest (no new art).
- [ ] New outfits as Cal asks: one sheet per cosmetic, every angle; test every combination and pose before calling
      it ready.
- [ ] UI pictures redrawn in the game's style (`ui_*`: classes, coaches, crew, ranks, rewards). List in HANDOFF, Art.
- [x] Black Tulle Skirt (`v_tulle`) (DONE: skirt flag be8e92c, QA's wear test 51977b7): HANDOFF used to say it was held back, but it has all its files and is on sale. Nobody
      has looked at how it renders. Wear-test it on the body it fits, in every pose.
- [x] (DONE: ROOMS uses `~/.venvs/questboard`, set `QB_PY` to it) This clone's Python has no `PIL`, `numpy` or `scipy`, and the art tools need them (`rs_art.py`, `pack.py` and so on).
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
- [x] Speakeasy: `depth.js` flags the piano drawn over the stage; look at it. DONE in b19a578 and 707cac1 (the piano stands by the band stage).

---

## QA: tests, pilots, quality checks

Doing:
- Now: on e289702. Done: ROOMS's yawn pictures 1-28 (pass, each with every hair and necklace; SMOKE BOMB, GACHA POP and
  SAVE POINT complete, BARD & BLADE tunic, gambeson and doublet); savecheck and screens (360, 390) on 68eb5aa pass; the hair lock (pass). Next: ROOMS's next yawn batches. BLOCKED: the published-file checks (v0.64 to v0.71) until
  Cal restarts QA (artifact tools; still down at 2ec4878). Next: bb_cloak (repainting) when ROOMS sends it. (on e289702)
- FYI LEAD and ROOMS: TEAMWORK rule 14 (Cal): every Doing line ends `(on <commit>)`; nobody starts until all three name the
  latest commit and nothing they touch is uncommitted elsewhere; LEAD checks it all before every publish and wrap-up.

To do:
- [x] (from LEAD; done: QA findings, PASS, publish) WAITING ON QA: the full set on v0.71, 3840577 (APPV 71). New since v0.70 (10240e8): the phone-lag fix 19ef0d9 (yours
      passed), the four visit arrivals f7a43bb with 90d5653 (yours passed), Rafe "Traveling" b3dfe9b. LEAD: clean build, 490 files, loads
      clean, Review 119/119, the whole story 64/64, livesync PASS, effects behind a window paused (7 paused, 0 running). Frame rates on
      this Mac are noisy under load (load average 27), so please measure lag with your lagcheck.js when the machine is quieter.
- [x] (from LEAD; done: QA findings, pass) WAITING ON QA, small check: 19ef0d9, phone lag. Cal's iPhone (diag/perf, APPV 67): Game Room window 38 fps, worst 421 ms;
      Restaurant window 38 fps, worst 214 ms; the Loft alone 57 fps. Cause: the UI effects behind the window kept animating. Fix: while
      any #layer .modal is open, #app, .nav and .fxo animations are paused (index.html). LEAD at CPU x4, 440x840 dpr 3: Game Room 25 ->
      60 fps, Restaurant 31 -> 60, worst 17 ms; they resume on close; the window's own animations run (rigtest/lead/roomperf.js).
      Please check nothing behind a window looks frozen when it closes, and the level-up and visit cards still animate. For v0.71.
- [x] (from LEAD, Cal's ask through you; done: QA findings, pass, two cosmetic notes) WAITING ON QA, small check: f7a43bb, four visit arrivals in 29k_friends fvShow: va-door (a door
      swings open, they step through), va-ride (skid in from the right, dust), va-drop (fall in, squash, shadow), va-pop (spin up,
      confetti); never the same as the last visit (S.visitArr), a visit keeps its arrival if shown again (S.visit.arr); Review cycles
      them. The friend's inline animation-delay used to override every delay, so the stagger is now --d and the idle bob .fvbob.
      LEAD: 12 visits used all four with 0 repeats; rigtest/lead/visitarrivals.js measures each one's path; shots/lead/visits/.
      Please check one and two friends at 360 and 390, and reduced motion. For v0.71.
- [x] (from LEAD; done: QA findings, PASS on 10240e8, publish) WAITING ON QA: the full set on v0.70, now 10240e8 (APPV 70; 396376b plus your story-read fixes: Theater in the mall's end unit, Rhythm upstairs and VR next door, four new welcomes, Sable before Rafe on the Old Metro, the amulet line, parlor/favor/favorite, Loft welcome "Soon", Lair and Closet before Sable in Play the whole story, Speakeasy out of the tester), Cal's next test copy. New since v0.69 (c2c53b7): Test > Unlock
      everything (0f7ce90) with your two fixes (Next story step skips the Speakeasy; the tester owns an opener's prerequisites, so
      bd_ward1 comes with bd_ward2), the story in order (40c4b14: Desmond after White Linen, Nova after the Clothing Store, Review >
      Play the whole story). Please rerun unlockall.js and read the whole story through for sense.
- [x] (from LEAD; done: QA findings, PASS, publish) WAITING ON QA: the full set on v0.69, c2c53b7 (APPV 69), Cal's next test copy and the one to publish (no v0.68
      separately). Since v0.68 (e276038): ROOMS's room-review fixes (62d336d, dbf2593, a4be384, aca27a1, 1e8a3b4), every piece usable
      (570b2f3), the Nightclub staff and patio chair (567ea26, your check), LEAD's screens (cfa5f62, 1ab3753). LEAD: clean build, 490
      files, loads clean, Review 114/114 save unchanged, livesync PASS, alerts PASS.
- [x] (from LEAD, Cal: "Give me the latest version to test when ready"; done: QA findings, PASS on e276038, the placement list is Cal's call) WAITING ON QA: the full set on v0.68, now e276038 (APPV 68; 9b3a428 plus your 3f6c696 fix: nbAv draws neighbors with the rig, outfit included, in the Hall list, visit header and board posts; rigtest/lead/nbav.js). New
      since v0.67 (d54de89): LEAD's alerts (3bba5f1, d0adfdc) and FX (59d31a0, d0adfdc); ROOMS's lamp (abe06dd), Restaurant notes
      (93d33f1), room windows without zoom, shelf and menu board (4e93d54), people kept and new pieces pulsing (1308059), the bar after
      White Linen (633ffe2), the Garden at level 5 (ede09d8), the splash text (0f9cabe). Note for your level-up runs: with the Garden
      at 5, its story step goes first, so the Wheel and Relics show "Soon" until revealed; their "!" comes once they open.
- [ ] (from LEAD; TAKEN by QA, BLOCKED until Cal restarts QA: artifact tools) WAITING ON QA: once your artifact tools are back, check the published v0.71 on Cal's Test link (pinned, slug HJhVjFH6, republished in place, versions 13-15) against 3840577's build: 491 files (25 top-level + 466 art/), sizes and the 9 db rules; index.html is 364 bytes larger from the publish wrapper. Replaces the v0.70 check below.
- [ ] (from LEAD; TAKEN by QA, BLOCKED until Cal restarts QA: artifact tools) WAITING ON QA: once your artifact tools are back, check the published v0.70 on Cal's Test link (pinned, slug HJhVjFH6, republished in place, versions 10-12) against 10240e8's build: 491 files (25 top-level + 466 art/), sizes and the 9 db rules; index.html is 364 bytes larger from the publish wrapper. Replaces the v0.69 and v0.67 checks below.
- [ ] (from LEAD) WAITING ON QA: once your artifact tools are back, check the published v0.69 on Cal's Test link (pinned, slug HJhVjFH6, republished in place, versions 7-9) against c2c53b7's build: 491 files (25 top-level + 466 art/), sizes and the 9 db rules; index.html is 364 bytes larger from the publish wrapper. Replaces the v0.67 check below.
- [ ] (from LEAD) WAITING ON QA: once your artifact tools are back, check the published v0.67 on Cal's Test link (pinned, slug HJhVjFH6, republished in place) against d54de89's build: 491 files (25 top-level incl. art_rig_8 + 466 art/), sizes and the 9 db rules; index.html is 364 bytes larger from the publish wrapper.
- [x] (from LEAD; done: QA findings, FX pass; alerts pass with one gap, level-unlocked tabs, and one copy error) WAITING ON QA, small check: 59d31a0 (Cal: "I don't like the crt scan lines. And the red hue it too aggressive":
      level-24 scanlines are Starlight, softer vignette and edge glow, no overlay over the Loft or rooms) and 3bba5f1 (Cal's "!" and
      "+": a bouncing ! on the tab for a new room, a newly unlocked tab or a new brand, until opened; ! over street buildings with a new
      room; + on the new room's spot inside, tapping opens the room that sells it with that upgrade first). LEAD's shots in
      `shots/lead/alerts/` and `shots/lead/fx_*_after.png`. Both go into v0.68 with ROOMS's fixes.
- [x] (from LEAD; done: QA findings, pass) WAITING ON QA: v0.67, d54de89 (APPV 67) = v0.66 + your boba fix (styPortrait falls back to the same person's portrait:
      boba shows Mara's chef portrait; LEAD: 7 of 7 scenes with a portrait) + live sync (app/src/29n_live.js, 019f21f; Cal: "synced
      perfectly so we can all see each others progress"). Please recheck Review and the file match, and the town with live sync:
      townlive, townrx, and `rigtest/lead/livesync.js` (three players on a stand-in db that pushes; NOPUSH=1 for the polling path).
- [x] (from LEAD, Cal's ask; done: QA findings, one error: the boba scene portrait) WAITING ON QA: the full set on v0.66, 465d39a (APPV 66), Cal's test copy. New since v0.65 (dba3f2e):
      KAIMANA, OAKMONT and SØLVBERG in the Shop (SØLVBERG's Shop run included), and Test > Review: Cal plays every cutscene, visitor
      and unlock from it, so check each Play shows the right window on both bodies and screen sizes and changes nothing in the save
      (LEAD: 114 of 114 open, save unchanged, `shots/lead/review/`).
- [x] (from LEAD; done: QA findings, pass, in the v0.66 full set) WAITING ON QA: the SØLVBERG Shop run, e513dae (brand sv, Feb 15, 15 rows as ROOMS wrote them, the leggings hers only,
      the mittens in the "arms" slot). LEAD checked the tab 15 weeks ahead: banner, badge, tagline, 15 pieces, no broken images, no
      page errors; the ski jacket and mittens equip (`shots/lead/sv_shop.png`); the mittens follow the hands in idle and stretchUp.
- [x] (from LEAD; done: QA findings, pass) WAITING ON QA: the OAKMONT Shop run, df59ff1 (brand oak, Feb 8, 15 rows as ROOMS wrote them, the skirt hers only,
      the wristbands and the watch both in the "arms" slot, so only one at a time like any accessory). LEAD checked the tab 14 weeks
      ahead: banner, badge from the pack, tagline, 15 pieces, no broken images, no page errors; the polo and the watch equip
      (`shots/lead/oak_shop.png`). Build at 491 files.
- [ ] (from LEAD; TAKEN by QA, BLOCKED until Cal restarts QA: artifact tools) WAITING ON QA: once your artifact tools are back, check the published v0.65 (pinned, slug HJhVjFH6) against dba3f2e's build: 490 files (24 top-level + 466 art/, no loose logo_ files now that the badges are in art_ui), sizes and the 9 db rules; index.html is 364 bytes larger from the publish wrapper.
- [x] (from LEAD; done: QA findings, pass) WAITING ON QA: the KAIMANA Shop run, adcf65c (brand km, Feb 1, 15 rows as ROOMS wrote them, none for one body only).
      LEAD checked the tab 13 weeks ahead: banner with art, badge from the pack, tagline, 15 pieces, no broken images, no page
      errors; the camp shirt and shell necklace equip (`shots/lead/km_shop.png`). The necklace barely shows under the collar there.
- [x] (from LEAD; done: QA findings, pass) WAITING ON QA: the full set on v0.65, dba3f2e (APPV 65). New since v0.64 (4a1dbe8): SAVE POINT (Jan 11), BARD &
      BLADE (Jan 18) and CHROME RAIN (Jan 25) in the Shop, the rig's "arms" slot (bracers, the arm sleeve), brand badges from the
      art_ui pack. LEAD built it clean in a worktree: 489 files, loads with no page errors, v0.65 in the header.
- [ ] (from LEAD; BLOCKED: QA's artifact tools stopped working, Cal restarts QA) WAITING ON QA: check the published v0.64 (pinned, slug NSmu55hk) against 4a1dbe8's build: 499 files (22 top-level + 477 art/), sizes and the 9 db rules; index.html is ~364 bytes larger from the publish wrapper. Its title reads "Quest Board", not "Quest Board v0.64".
- [x] (from LEAD; done: QA findings, pass; the drop pop-up not checked) WAITING ON QA: the CHROME RAIN Shop run, 091c762 (brand cr, Jan 25, 15 rows as ROOMS wrote them, the skirt hers
      only, the arm sleeve in the "arms" slot). LEAD checked the tab 12 weeks ahead: banner with art, tagline, 15 pieces, no broken
      images, no page errors; the sleeve with the bomber lands in equipped.arms (`shots/lead/cr_shop.png`).
      Also 8be03dc: brand badges (logo_<id>.webp) now come from the art_ui pack, not loose files; check the badge on each brand tab,
      the Wednesday return tab and the drop pop-up.
- [x] (from LEAD; done: QA findings, pass) WAITING ON QA: the BARD & BLADE Shop run, a6e9d16 (brand bb, Jan 18, 15 rows as ROOMS wrote them, the skirt hers
      only, the bracers the first piece in the rig's "arms" slot). LEAD checked the tab 11 weeks ahead: banner with art, tagline,
      15 pieces, no broken images, no page errors; wearing the bracers with the doublet puts them in equipped.arms
      (`shots/lead/bb_shop.png`). Please check the bracers in every pose with the wear test.
- [x] (from LEAD; done: QA findings, pass) WAITING ON QA: the SAVE POINT Shop run, 29f496c (brand sp, Jan 11, 15 rows as ROOMS wrote them, none for one body
      only). LEAD checked the tab at 10 weeks ahead: banner with art, tagline, 15 pieces, no broken images, no page errors
      (`shots/lead/sp_shop.png`). Rerun the slip-ons and headset rows after ROOMS's fixes.
- [x] (from LEAD; done: QA findings, pass) WAITING ON QA: the full set on v0.64, 4a1dbe8 (APPV 64). New since v0.63 (f5234d3): SMOKE BOMB (Dec 28) and GACHA
      POP (Jan 4) in the Shop, the armpit rule (2be3eda, bc757e2), overalls over the top (faebcd8, 91ef6e8). LEAD built it clean in a
      worktree and it loads with no page errors (creator to Loft, v0.64 in the header). Publishing waits on the restart either way.
- [x] (from LEAD; done: QA findings, pass) WAITING ON QA: the overalls in the stretch pose, 91ef6e8 (your 0246a11 finding). With a painted top (the starter tee,
      o_tee, o_puffer, o_flannel) the bib and straps, the legs and any tall boots now draw right after the painted picture. LEAD checked
      stretch and idle with the starter tee, o_tee+h_boots, o_puffer, o_flannel+v_boot, gp_star and gp_bear on both bodies
      (`shots/lead/gp_overtop_stretch.png`). Only stretch has a painted top; other poses take the same path as faebcd8.
- [x] (from LEAD; done: QA findings, one pose left) WAITING ON QA: the overalls over the top, faebcd8 (LEAD's rig side of ROOMS's d4d8fd8 "overTop"). gp_overall and
      gp_shorts under tops (o_tee, gp_bear, gp_sailor, gp_star, o_puffer, o_flannel, the starter tee), both bodies, every key pose: bib and
      straps over the top front and back, no top hem on the thighs, arms still over the bib, tall boots (h_boots, sm_boots, v_boot) over
      the cuffs. LEAD checked idle, walk3, sitFront, stretchUp, type1, rearStand and sleep in rigtest/matrix.html (`shots/lead/gp_overtop_idle.png`);
      the ragged sleeves in type1 and the boot specks in walk3 look the same without the flag. Other bottoms are untouched (no pantsOver slot).
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
