# Task board

The one list both chats share (see `TEAMWORK.md` at the top of the repo). LEAD keeps it tidy. Re-read it right
before editing; edit only your own section, except to add a request for another chat.
Details for every item are in `docs/HANDOFF.md`.

CHROME: ROOMS (since 11:05 am)

Live on the phone: `APPV` 45 (page version 19), 2026-11-05.

---

## LEAD: board, quality of life, Shop and Training code, everything else in the app, publishing

Doing:
- Waiting on Cal's phone check of v45; then the real phone numbers in `diag/perf` and `diag/frame` for the lag.

To do:
- [x] Shop text in Bebas Neue Light (titles stay), the Shop banner a real rectangle on a phone, next drop as its own line
      (47f3af4). Goes live in the next publish.
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
- [ ] Yawn pilot, code: when a character is at the peak of the stretch, swap in a top's painted yawn layers
      (`m_<id>_yawn.webp`, `f_<id>_yawn.webp`, and `m_base_yawn` / `f_base_yawn` for bare arms) if they exist, and keep
      today's yawn for every top that has none. In `src/rig.js`. Write it while ROOMS paints; QA tests it.
- [x] Stretch pose: the gentler yawn (Cal's pick), 0959719. Dark long sleeves still look torn at the elbow, as before.
- [x] `lfvar.json`: a copy is in git at `app/lfvar.json` (0959719). `build.py` does not use it.
- [ ] Before release: remove the Test panel, the Shop's Testing row, each room window's Testing undo link, and the
      `window.__qb` / `window.__qbLoft` hooks. Also the phone log (`qbFrame` in `26_world.js`) and the `diag/frame` doc,
      sooner if the Loft height is sorted first.

Ready to publish (ROOMS adds lines here: `READY TO PUBLISH: <what>, look at: <what to check on the phone>`):
- PUBLISHED in v45. READY TO PUBLISH: the five painted brand banners (Cal approved the art 2026-11-05), `art/app/ui_banner_*.webp`, bundled
  into `art_ui.js` by the build. Look at: the Shop, each brand's banner on a phone.
- READY TO PUBLISH: Bedroom patio door and view (17ab80d). Once the Patio room exists the Bedroom has a sliding glass door
  onto it (the last pane of the glass wall, or a door of its own in the back wall without the glass upgrade), and through
  the glass you see the Patio room as it is furnished, with its skyline. Look at: the Bedroom on a phone, with Floor-to-
  Ceiling Glass, the Patio's furniture behind the glass; buy something for the Patio and check it shows from the Bedroom.
  Checked headless: four cases (glass and patio with Cal's furniture, glass and every patio item, plain wall and patio,
  glass without a patio), plus the building view, no errors. Not checked: on a phone; with the plain wall the bookshelf
  stands partly in front of the door.

Art and room code requests (LEAD asks, ROOMS does):
- Yawn pilot, 3 tops (Cal, 2026-11-05: paint the yawn instead of bending flat art). One sheet per cosmetic, both bodies,
  holding the peak of the yawn (`stretch` in `data/poses.json`: arms out wide a little below the shoulders, forearms curled
  up, head tipped back). Render the pose as your template with `rigtest/matrix.html?sheet=base&pose=stretch`. Pilot:
  the bare body (arms), `y_vjkt` (zip jacket, tears worst today), `o_puffer` (bulky) and `h_hoodie` (soft sleeves). Save the
  layers on the same canvas and registration as each item's `_front` layer, named `<m|f>_<id>_yawn.webp` and
  `<m|f>_base_yawn.webp`. Show Cal the pilot side by side before anything goes in; QA checks every outfit combination after.
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
  Split (Cal: LEAD codes, ROOMS paints, LEAD wires it in): ROOMS paints the three exteriors (each with room for its name)
  and one inside background per building, Cal approves them side by side. LEAD writes the street view and the
  load-one-building-at-a-time code. That code lives in `lfWorld`, `26_world.js` (ROOMS's file): ROOMS, write under
  Requests for LEAD whether LEAD may change it, or whether you would rather do that part.
- Lag: dragging the building or room view sets the transform on every pointermove (`lfApply`, `26_world.js`). Apply it at
  most once per frame (requestAnimationFrame). Measured by ROOMS headless; real phone numbers come with the next publish.

QA findings (QA adds one line each: what, where, how to see it, screenshot, owner; LEAD moves them into the right list):

Requests for LEAD (from ROOMS):
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
- Closet stages: the jewelry section is painted (`art/raw/walls/closet/room_jewel.png`); stripping it back into the other
  stages, then one sheet for Cal.

To do:
- [ ] Bedroom walls (Cal approved the four tiers, 2026-11-05: "this is great!"). Before they go in, from his answer: (1) keep
      the wall colour options, the Loft should be the most customizable: a painted version of each tier per colour scheme;
      (2) the patio: buying it must put a patio door in the Bedroom, and the view through the glass must show the patio
      furniture he owns in the Patio room (the old Bedroom patio view looked great): DONE in 17ab80d. Tiers are in
      `art/raw/walls/bedroom/`; the preview loader is `scratchpad`-only for now, the real one goes in `26_world.js`.
- [ ] (LEAD's request) Yawn pilot: bare body, `y_vjkt`, `o_puffer`, `h_hoodie`, both bodies. Next after the Closet sheet.
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
- [ ] Every upgrade in every room clearly visible, even a poster or a clock (Cal, on v43). Buy each one at a time in
      every room, measure what actually changed on screen, then fix the weak ones or list the art they need.
- [ ] Game Room art: back-to-back gaming rigs at the front with the racing chairs facing them, a cream three-piece
      sectional with a futon piece, then an 80 inch TV and a floating modern media console as later upgrades.
- [ ] Club (optional): back-view booth art if Cal wants booths along the bottom edge too.
- [ ] Speakeasy: `depth.js` flags the piano drawn over the stage; look at it.

---

## QA: tests, pilots, quality checks

Doing:

To do:
- [ ] Set up: a clean worktree of the latest commit in a temp folder, build it, serve it on 8769. Learn the scripts in
      `rigtest/browser/` (README) and write your own in `rigtest/qa/`. Start `docs/QA.md` with a run log.
- [ ] Upgrade sweep, every room: buy each upgrade one at a time in unlock order (the method in `docs/RELEASING.md`, Testing
      upgrade tiers), screenshot each step, and flag anything stacking, overlapping, floating, facing the wrong way or not
      visibly changing the room (Cal: "every upgrade clearly visible, even a poster or a clock"). Run `gaps.js`, `depth.js` and
      `stations.js` at every tier, not only fully upgraded.
- [ ] Shop sweep: buy and equip every item on both bodies, check the mirror, the wardrobe and the room character, and flag
      anything stacking unnaturally or clipping.
- [ ] Speed sweep at phone size (390 x 844, 4x CPU slowdown): time every tab, the building view and every room (`perf.js` as a
      start: frame rate, long tasks, load time). List the slowest ten with what makes them slow. LEAD has the real phone's
      numbers in `diag/perf` after Cal plays v45; compare against them when LEAD posts them.
- [ ] After every commit by anyone: `savecheck.js`, `screens.js` and a quick look at what that commit touched. After every
      publish: the same against the published build. Post only what fails.
- [ ] References: for each room, look up isometric game art of that kind of room (built-in browser, never Chrome) and
      compare layout, detail, lighting and how alive it feels. Write art ideas for ROOMS with the link and what to learn.
      Study only, never copy.
- [ ] (from LEAD) Room upgrade menu, new in the commit after v45: only the next 5 unbought upgrades show, and anything two or
      more levels above the player is a "? ? ?" card. Check every room at a few levels (just below, at and above each
      unlock), that buying from the menu still works, and that no room says "All upgrades installed" too early.
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
