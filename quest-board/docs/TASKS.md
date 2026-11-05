# Task board

The one list both chats share (see `TEAMWORK.md` at the top of the repo). LEAD keeps it tidy. Re-read it right
before editing; edit only your own section, except to add a request for another chat.
Details for every item are in `docs/HANDOFF.md`.

CHROME: ROOMS (since 11:05 am)

Live on the phone: `APPV` 44, 2026-11-05.

---

## LEAD: board, quality of life, Shop and Training code, everything else in the app, publishing

Doing:
- Phone lag: room windows pause the building view's animations, and an owner-only speed log (`diag/perf`). Then publish.

To do:
- [x] Shop text in Bebas Neue Light (titles stay), the Shop banner a real rectangle on a phone, next drop as its own line
      (47f3af4). Goes live in the next publish.
- [x] (from ROOMS) Saves: online saving fixed, an old online save never replaces newer progress (9c3bd78). Goes live in the
      next publish. Each device asks once, "Two saves found", when its save and the online one disagree.
- [ ] (from ROOMS) Shop banners, Cal on approving the art: each brand's title stylized and unique (not plain white text or a
      shadow), playful taglines instead of descriptive ones (keep ALTITUDE's "Trail gear that never sees a trail"), and the
      next drop as a small, unobtrusive countdown on the Shop's main tab, not in the banner. Publish with ROOMS's banners.
- [ ] (from ROOMS) Phone lag (Cal, on v43: "very laggy on the phone"). The `diag/frame` log landed nothing because saves were
      broken (`db` was null), so it lands again after the next publish, and a new `diag/perf` log records frame rates on the
      real phone. Fix what the real numbers show. Room code changes go through ROOMS (requested below).
- [ ] Review the `dropbox-leftovers` branch: uncommitted edits found in the old Dropbox folder, 2 lines each in
      `app/src/27_rooms.js` and `app/src/27b_skins.js`, made against a copy 22 commits behind `main`. Show Cal what
      they did, bring over anything still wanted by hand (don't merge the branch), then delete the branch.
- [ ] Stretch pose: Cal to choose (a) gentler "yawn" stretch (recommended, `data/poses.json`, LEAD's file),
      (b) keep it, or (c) painted arms-up art for every top (that one would be an Art request).
- [ ] `lfvar.json`: the published page needs it, it is not in git and `build.py` does not make it. The only other copy is in
      the old Dropbox folder's `dist`. Keep a safe copy before anyone clears that folder.
- [ ] Before release: remove the Test panel, the Shop's Testing row, each room window's Testing undo link, and the
      `window.__qb` / `window.__qbLoft` hooks. Also the phone log (`qbFrame` in `26_world.js`) and the `diag/frame` doc,
      sooner if the Loft height is sorted first.

Ready to publish (ROOMS adds lines here: `READY TO PUBLISH: <what>, look at: <what to check on the phone>`):
- READY TO PUBLISH: the five painted brand banners (Cal approved the art 2026-11-05), `art/app/ui_banner_*.webp`, bundled
  into `art_ui.js` by the build. Look at: the Shop, each brand's banner on a phone.

Art and room code requests (LEAD asks, ROOMS does):
- Lag: dragging the building or room view sets the transform on every pointermove (`lfApply`, `26_world.js`). Apply it at
  most once per frame (requestAnimationFrame). Measured by ROOMS headless; real phone numbers come with the next publish.

Requests for LEAD (from ROOMS):
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
- Bedroom painted walls: generating the tiers for Cal's approval. Brand banners posted to Cal for approval.

To do:
- [ ] Brand banners: painted, **not yet approved by Cal**. The five paintings, the `.webp` files ready for the game and the
      labeled sheet are in `art/raw/banners/` (`banners_for_approval.png`). Show Cal the sheet and redo only what he
      flags. On approval copy `ui_banner_<id>.webp` to `art/app/`: the build bundles them, and the Shop's shade and phone
      layout are LEAD's and already done. Two things to point out to him: HANGANG has a tiny dark vendor figure in its right
      tent, and DIAL-UP reads more violet than pink. Settings and prompt base are in HANDOFF, Art.
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
