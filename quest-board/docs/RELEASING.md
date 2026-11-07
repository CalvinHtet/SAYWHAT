# Publishing an update safely

Everyone uses the same link, so publishing changes the game for everyone. Saves are separate from the code: each
player's save is at `data/users/<id>/state`, and publishing does not touch it.

Before publishing:

1. Never bump `QB_EPOCH` in `app/src/00_clock.js`. It wipes every player's save.
2. Bump `APPV` in `app/src/30_app_b.js` on every release. A page still open from an older version stops saving once a
   newer version has saved, so it cannot overwrite that progress.
3. Never rename or delete an item or upgrade id. Saves store those ids, so players would lose what they bought. Retire
   something by hiding it from the shop. New fields are safe, because `merge()` fills in defaults.
4. Changing how saved data is shaped needs a migration in `merge()` or `worldMigrate()`.
5. Send new art files in the same publish as the code that uses them. Files left out of a publish stay online, so
   old pages keep working. A half-finished upload is live straight away.
6. Test with a save from the old version: load it, reload, buy something, reload again.

The first load on a new `APPV` copies the save to `data/users/<id>/backup`. That copy is private to the player, so only
their own page can read it. Restore backup is in the Test panel, which only the owner sees. If a release goes wrong, publish the
previous version again; saves are not affected.

An artifact version holds at most 511 files; `dist` was at 505 with CHROME RAIN, 491 once brand badges moved into `art_ui.js` (2026-11-06). Room art is most of the rest. Before adding many more sprites, bundle another group
into a pack in `tools/build.py` (`ex_` is the next candidate; it would also need its image paths routed through `QBART`).

## Testing upgrade tiers

In the page, buy each upgrade one at a time in unlock order and rebuild the room with `window.__qbLoft().roomCtx` and `roomSvg` after each
purchase, reading the footprints from `.lfitems > g[data-b]`. Overlaps at mid tiers do not show up when a room is only checked fully upgraded.

## Two links, and the 4 am publish (Cal, 2026-11-07)

Cal: "There's only going to be about 10 people playing. I need this to work with 10 ppl and have everything synced perfectly so we
can all see each others progress." And: "I want this to be perfectly consistent for everyone. So they can open it and if there is
an update it will have synced. We can publish a new version at 4 am when they are all asleep so it never messes up their current
progress and it is basically invisible and non intrusive."

- **Live**: one permanent artifact everyone opens. Never a new artifact for it: every release republishes the same slug with its
  `base_version`, so its database (every save, the town board, reactions, visit notes) stays. A new artifact would start an empty
  world and everyone would lose their progress.
- **Test**: one permanent artifact for Cal, also republished in place, so his test save carries from version to version. A version
  goes here first, any time of day.
- **The 4 am publish**: once QA passes a version (rule 18) and it has been on Test, the same files are republished to Live at
  4:00 am Pacific (the game's own day boundary is Pacific too), by a scheduled task that starts a fresh LEAD session. A page left
  open overnight from the older version stops saving as soon as the new one saves (qbWatchSave) and asks for a reload, so it can
  never overwrite newer progress; the platform also moves open pages to the new version at a quiet moment.
- Only additive changes in a release (see the list at the top): saves are never wiped or reshaped without a migration.

## The publish, step by step (LEAD; any LEAD session can do it)

The passed build is staged in `SAYWHAT/r/` (git-ignored through `.git/info/exclude`): `dist/` of the passed commit plus
`app/lfvar.json`. To stage one: `git worktree add --detach <tmp>/vNN <hash>`, `python3 tools/build.py` there, then
`rm -rf r && cp -R <tmp>/vNN/quest-board/dist r && cp <tmp>/vNN/quest-board/app/lfvar.json r/`.

1. `publish_files` (new artifact, title "Quest Board v0.NN", icon "game"): every top-level file in `r/` (index.html, app.js,
   creator.js, look.js, rig.js, qbdata.js, loft_bridge.js, lfvar.json, art_*.js, blobs_*.js), each `as` its own name.
2. The art, `r/art/*` served `as` `art/<name>`, in republishes of at most 256 files each (`slug` and the `base_version` the
   last publish returned).
3. `declare_capabilities` with `user: {}`, `sample: {images: true}` and these db rules: worlds, board and pings read view,
   write owner; worlds/{self}, board/{self} and pings/{self} read view, write interact; diag read admin, write owner;
   player and inbox read owner, write owner.
4. Unpin the old version's artifact, pin the new one (keep only the newest pinned). Never paste the URL in chat.
5. Remove the worktree and `r/`, then ask QA to check the published files against the build (rule 18).

If the artifact tools answer "not available to this session" or "The files could not be attached", the session lost them:
Cal restarts Claude Code or opens a new LEAD session, and the publish goes ahead from `r/`.
