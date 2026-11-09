# Windows work-laptop session, 2026-11-09: handoff

Read this first if you are picking up from the Windows chats. Branch `qa-local` is the release line (the Live cut
`dea24a4` plus everything below). Nothing here is on GitHub yet: `git push` is blocked on the work laptop, so changes
travel as a git bundle zip that Cal emails to his Mac (see "Shipping" below).

## Done and tested on qa-local (sandbox, headless Chrome at 390x844)
- v0.82: simpler Board (tasks first, one progress line, one-row Add tasks box, Bounties last); the avatar opens the profile
  (level, Daily Quest, Weekly Warrior, class, rewards, stats); Shop/Dungeons locks name the Closet/Lair.
- v0.83: no example quests; friend visits only after the welcome note and The Loft, about once a week, never in the
  Bedroom; vague friend texts; Edit / Done toggle for deleting quests; sandbox-only stand-in photo checker; Town Hall in
  three tabs (Posts | Chat with Room 1 / Room 2 / Room 3 | Style); QA fixes (profile width, class pick has no X, save on
  pagehide, comma lists split, "opens tomorrow").
- v0.84: no 2x button; tapping a quest that suits a photo opens "Quest done? Double it" (canProve in 30_app_b.js);
  Garden after 4 Loft rooms with a "new hobby" scene; Game Room upgrade only after the Walk-in Closet.
- ed545a3 (after the v0.84 zip, not in any zip yet): plain quest list until tasks span two categories; one Completed list
  at the very bottom; no highlighted "first" quest.
- QA reports: docs/qa-2026-11-09/QA_REPORT.md (full pass and fixes) and QA_SWEEP.md (classes, rooms, saving).

## Unfinished: pick these up
1. **Price and income rebalance** (branch `wip-prices`, commit 789eabb, part 1 only). Cal: "pull down on the shop prices,
   and slightly lift the apartment and building prices, but big room expansions should still feel like an achievement ...
   I want them to feel a need to save up some money, but still have lots to spend it on". Measured on Cal's own day (wash
   dishes, make bed, gym with photo, transfer money, Venmo, rent, clean living room, clean studio, fold + wash laundry):
   2,000-5,000 coins a day, about 23,500 in week 1 plus Weekly Warrior 3,000; level 15 after 7 days.
   Plan (agreed direction, numbers are the proposal):
   - Income: coinMomentum (10_app_a.js) max +50% instead of x2; Weekly Warrior coins (weekBonus, 30_app_b.js) x6, at
     least 1,500 (was x12, at least 3,000).
   - Daily Quest (Cal: "After completing my daily quest, changing it lower, grants you more chests. ... 150 for normal day,
     then every 50 above that opens the next tier chest up to 300 which grants a lot of money"): remove the goal buttons
     (dqHtml, the dqgoal click listener in 29e_economy.js), dqGoal() fixed 150, pay ECON.dqTiers once per tier per day
     (150: 250, 200: 250, 250: 400, 300: 800 coins, x (1 + INT bonus)) in dqCheck; show the tiers in the profile and the
     next tier on the Board line (boardLine in 30_app_b.js).
   - Prices: ECON.price decor 150 / furniture 300 / equipment 600 / big 1,200 (done); anything with `opens` priced at
     ECON.price.opener 2,000 (still to wire into the formula in 29e_economy.js); clothes x0.4 (done) clamped to
     ECON.clothesMin/Max 150-800 (the clamp still says 200-1000); story lots Garden 1,000, Restaurant 2,500, Boba 3,000,
     Theater 5,000, Mall 6,000, Club 8,000 (29_prices.js has an interim 600 / 1,500 / 2,000 / 3,500 / 4,000 / 5,000).
   - Then rerun Cal's week in the sandbox and check: the Garden (4 Loft rooms, about 6,600 coins) lands around day 3,
     nothing feels free, the whole catalogue (about 330,000 coins) is months of play.
2. **Shop** (branch `shop-ui`, commit 0344b46, WIP from a stopped helper, untested; based on v0.84, so rebase onto qa-local).
   Cal: (a) "There should only be one new clothing drop every 3 days ... only show Hangang splash screen as soon as we
   unlock the walk in closet" (decided: per player; HANGANG first when the Closet is built, then one brand every 3 days
   from that day, same order for everyone); (b) Upgrades and Interface move out of the Shop into "The System", a toggle
   next to "The Shop" title that appears once the Hero's Lair is built; (c) no Wardrobe tab: a Wardrobe button next to the
   character on the clothing tabs. Files: 15_shop.js, 29l_drops.js, 27_rooms.js, index.html.
3. **Training** (not started). Cal: "I would like the option to edit the workouts to whatever we want. And get rid of
   seargent brick." Edit any plan (remove/add/reorder exercises, sets and reps), make a custom named workout with free-text
   exercises, reset to default; remove COACHES id "brick" (30_app_b.js, ~line 431) with saves on "brick" falling back to
   another coach. Keep econTrainXp / econTrained rewards working.

## Open questions for Cal
- Weekly Warrior counts only photo-proven workouts. Keep?
- The other eight coaches: keep, trim, or drop the coach feature?

## Known open problems (from the QA reports)
- About 17 MB before the first draw (blobs.js holds 675 room sprites, 14 MB); slow first open on phones.
- Two tabs or devices overwrite each other's save (last save wins).
- Smaller: dungeon card coin range vs efficiency, selling produce turns off the Restaurant bonus silently, Loft "/hr"
  ignores the daily cap, header coins stale after a level-up.

## Build and test on this laptop (no Python or Node installed)
- Build: `bash quest-board/tools/windows/build_web.sh quest-board sandbox` (a bash port of tools/build.py; writes
  quest-board/dist-web; drop `sandbox` for a Live-like build).
- Serve: `powershell -NoProfile -File quest-board/tools/windows/serve.ps1 -Root quest-board/dist-web -Port 8765`
  (or `perl quest-board/tools/windows/serve.pl quest-board/dist-web 8765`), then open http://localhost:8765/.
- Headless checks: `node.sh` runs VS Code's Electron as Node. Start Chrome with `--headless=new
  --remote-debugging-port=9350 --window-size=390,844`, run `bash node.sh hold.js` (iPhone emulation), then
  `bash node.sh q.js init|go <url>|ev "<js>"|shot <name>|text|acts|tap x y|errs`; `bash node.sh syn.js
  quest-board/dist-web/app.js` checks the build compiles. Do not use the browser-panel tools: they froze these chats.

## Shipping (push is blocked here)
`git bundle create saywhat.bundle main qa-local --not origin/main origin/release/live-7fd8c97` (after `git fetch origin`),
plus `git format-patch` copies, zipped with a README for the Mac. On the Mac: fetch the bundle into branches, deploy
firestore.rules once (Town Hall chat and likes), then `git push origin qa-local:refs/heads/live` (the "Live at 4 am"
Action publishes; needs the FIREBASE_SERVICE_ACCOUNT secret). Bump APPV for every release.
