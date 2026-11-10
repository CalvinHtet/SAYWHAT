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

An artifact version holds at most 511 files (2026-11-07: 510 after the six new friends' portraits, 473 once friend_*.webp moved into `art_ui.js`); `dist` was at 505 with CHROME RAIN, 491 once brand badges moved into `art_ui.js` (2026-11-06). Room art is most of the rest. Before adding many more sprites, bundle another group
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

## The web version (off Claude, Cal 2026-11-07; docs/WEBAPP.md)

Cal's Firebase project is `saywhat-b7ae8`. The CLI runs on Cal's Mac with his login (`npx -y firebase-tools@15.35.0 ...` from
`quest-board/`). Two links, as on Claude:

- **Test** (Cal only): the Hosting channel `test` (30-day expiry; each deploy renews it). After QA passes a build:
  `QB_TARGET=web python3 tools/build.py && npx -y firebase-tools@15.35.0 hosting:channel:deploy test --expires 30d --project saywhat-b7ae8`.
  Cal reloads and has it. Never paste the channel URL in chat; it is in the deploy commit message.
- **Live** (the friends): `saywhat-b7ae8.web.app`, published only by `.github/workflows/live-4am.yml` at 12:00 UTC (4 am PST,
  5 am PDT) from the `live` branch. To release: after QA's pass and Cal's test, LEAD moves `live` forward to that commit
  (`git push origin <commit>:refs/heads/live`, fast-forward only). The job skips when the site's `version.txt` already names it.
  The job needs the repo secret `FIREBASE_SERVICE_ACCOUNT`, which Cal makes himself (Firebase console > Project settings >
  Service accounts > Generate new private key, then GitHub > SAYWHAT > Settings > Secrets and variables > Actions > New secret).
  The key never goes in the chat or the repo.
- **Google sign-in on a new address**: Google blocks sign-in ("Access blocked: invalid request", a redirect_uri_mismatch) from
  any page address its OAuth client does not list, and web.js signs in on the page's own address (iPhone needs that). Firebase
  lists only firebaseapp.com by itself. For each new address (a new channel, a custom domain), Cal adds in Google Cloud console >
  APIs & Services > Credentials > "Web client (auto created by Google Service)": the origin `https://<address>` and the redirect
  URI `https://<address>/__/auth/handler`. Cal was given the Test channel and `saywhat-b7ae8.web.app` on 2026-11-07. Keep the
  channel name `test` so its address never changes.
- **Real players now (2026-11-08):** Live and the Test channel both run the same Live cut (`release/live-<main hash>`: main plus
  `noTest: true` in `web/config.js` and `QB_TEST_START` 0) at QB_EPOCH 6 (Cal's second reset, v0.86, 2026-11-09: "start over from
  scratch ... initalize everyone's save file"; 5 was the reset for him and his girlfriend). Both links share one
  database and one save per player, so always deploy the same build to both, and never a different QB_EPOCH to either: an older number
  treats the new saves as empty and overwrites them. **Cal plays on the Test channel link: it is a real link, never make it anything
  else.** Do not bump QB_EPOCH again unless Cal asks; a bump also needs `board`, `pings` and `worlds` cleared, and for a clean Town
  Hall `chat`, `chatnow` and `likes` (`firestore:delete <name> --recursive --force`). A save from before a reset goes to
  `data/users/<id>/backup_e<epoch>`. A rollback build must carry the same QB_EPOCH as the saves it should keep (rollback-v0.80 does).
- **Sandbox (Cal, 2026-11-08: "test all the upgrades without it overwriting my personal save"):** the Hosting channel `sandbox`, built
  from main with `QB_TARGET=web QB_SANDBOX=1 python3 tools/build.py`, then `hosting:channel:deploy sandbox --expires 30d`. Its database
  lives in the browser (`sandboxHost` in `web/web.js`) and it returns before Firebase starts, so it has no way to reach a real save and
  needs no Google sign-in. It starts at level 1 with the Test tools on (Unlock everything, 500,000 coins), and the story's friends stand
  in as neighbors and greet back. Saves are per device. The link lasts 30 days from each deploy.
- **Rules and the AI function** change rarely and are deployed by hand when they do:
  `npx -y firebase-tools@15.35.0 deploy --only firestore:rules,functions --project saywhat-b7ae8`. A function change goes through
  QA like any other (functions/test.js first).
- Before Live goes to friends: `QB_TEST_START` 0 and Cal's uid in `firestore.rules` and `web/config.js` as the owner. The test tools
  go by themselves on any cut with `noTest` (Cal, 2026-11-08): `app/src/31_release.js` deletes the `window.__qb*` test hooks at startup,
  and the Test pill and Testing rows are never made. Main and the sandbox keep them. A new test hook goes on that file's list; a hook the
  game itself reads (like `__qbTeam`) must not. `rigtest/lead/striptest.js` checks a Live cut. Restore backup lives in the Test pill, so
  on Live a player's backup can only be restored by LEAD.
