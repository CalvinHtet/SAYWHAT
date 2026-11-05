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

An artifact version holds at most 511 files and `dist` is at about 500. Before adding many more sprites, bundle another group
into a pack in `tools/build.py` (`ex_` is the next candidate; it would also need its image paths routed through `QBART`).

## Testing upgrade tiers

In the page, buy each upgrade one at a time in unlock order and rebuild the room with `window.__qbLoft().roomCtx` and `roomSvg` after each
purchase, reading the footprints from `.lfitems > g[data-b]`. Overlaps at mid tiers do not show up when a room is only checked fully upgraded.
