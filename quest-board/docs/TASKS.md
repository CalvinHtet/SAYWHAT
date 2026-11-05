# Task board

The one list both chats share (see `TEAMWORK.md` at the top of the repo). ROOMS keeps it tidy. Re-read it right
before editing; edit only your own section, except to add a request for another chat.
Details for every item are in `docs/HANDOFF.md`.

CHROME: free

Live on the phone: `APPV` 41 (page version 12), 2026-11-05.

---

## ROOMS as lead: board, quality of life, publishing

Doing:

To do:
- [ ] Review the `dropbox-leftovers` branch: uncommitted edits found in the old Dropbox folder, 2 lines each in
      `app/src/27_rooms.js` and `app/src/27b_skins.js`, made against a copy 22 commits behind `main`. Show Cal what
      they did, bring over anything still wanted by hand (don't merge the branch), then delete the branch.
- [ ] Ask Cal for his phone-test feedback list, sort it onto this board by owner.
- [ ] Confirm on Cal's phone that the Loft fills the screen inside the Claude app, with the bottom nav showing.
- [ ] Confirm the phone shows the newest version (the header `v` number) after a publish.
- [ ] Stretch pose: Cal to choose (a) gentler "yawn" stretch (recommended, `data/poses.json`; SHOP owns that file),
      (b) keep it, or (c) painted arms-up art for every top.
- [ ] UI pictures redrawn in the game's style (`ui_*`: classes, coaches, crew, ranks, rewards), with a Chrome turn.
- [ ] Before release: remove the Test panel, the Shop's Testing row, each room window's Testing undo link, and the
      `window.__qb` / `window.__qbLoft` hooks.

Ready to publish (SHOP adds lines here):

Requests for the lead:

---

## SHOP: shop, clothes, outfits, their art

Doing:

To do:
- [ ] Brand banner art, one per brand, intricate and colourful scenes, no text or logo: `ui_banner_hanga`, `_y2k`,
      `_over`, `_rose`, `_alt` (1200 x 480; prompts in HANDOFF, Art).
- [ ] Regenerate `o_lock`, `al_carab`, `v_shade`, `v_corset` cleanly (their baked-in mannequin was cut out by hand).
- [ ] New outfits as Cal asks: one sheet per cosmetic, every angle; test every combination and pose before calling
      it ready.

Requests for SHOP:

---

## ROOMS: building, rooms, upgrades, their art

Doing:

To do:
- [ ] Painted wall shells for every room, in upgrade tiers (Cal's theater example: bare lit panelling up to a
      poster wall). Each room ends on its own look, and built-ins (like the Club's glowing hanging liquor cabinet) are
      part of the wall picture. Match each room's size (list in HANDOFF). Cal approves every tier before it goes in.
      Start with the room Cal picks.
- [ ] Generic stage loader for wall shells (like `clPaint` in `27_rooms.js`), fitted to each room, green removed.
- [ ] Closet: make the jewelry part of the painting (lit glass trays on the island) instead of the `clx_jewel` sprite.
- [ ] Game Room art: back-to-back gaming rigs at the front with the racing chairs facing them, a cream three-piece
      sectional with a futon piece, then an 80 inch TV and a floating modern media console as later upgrades.
- [ ] Club (optional): back-view booth art if Cal wants booths along the bottom edge too.
- [ ] Speakeasy: `depth.js` flags the piano drawn over the stage; look at it.

Requests for ROOMS:

---

## Done (latest first, keep about ten)

- 2026-11-05 Club: every booth on the left wall, bar on the back wall, neon sign the right way (v41).
- 2026-11-05 File fingerprints so phones fetch new versions; Loft height fix; header shows `APPV` (v40, v41).
- 2026-11-05 Prove it: camera only, pays double. Shop brand banners, procedural stand-in (v40).
- 2026-11-05 Closet grows in stages of one room (v40).
- 2026-11-05 Lair: one war table in the middle, floor pieces spread out (v40).
- 2026-11-05 Game Room laid out by what each piece faces (v39).
