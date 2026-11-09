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
1. **Price and income rebalance: DONE on qa-local (economy pass, later on 2026-11-09), replacing branch `wip-prices`** (do not
   merge that branch). Cal: "i want everyone to feel like buying stuff is worth it and not too expensive, but also not too easy
   ... it makes sense for the imax projector to be 2500 or something like that". Measured with `tools/windows/econsim.js` (a
   CDP port of rigtest/qa/sim.js) before and after; everything is written up in `docs/ECONOMY.md`. In short:
   - Found: quest coins rode every XP bonus (combo, streak, crit, rank) and ran to 10x by level 100; businesses pay a share of
     those; the INT chest bonus had no cap; the payout share counted the old unreachable rooms; level-up pay 60,000 in all. Cal's
     routine bought every room upgrade by day 20 and sat on 600,000 coins.
   - Income: quest coins on listed XP (photo and bounties still double), +0.5% a level; level pay 50 + 5 x level; INT at most
     +25%; Daily Quest chests at 150/200/250/300 XP (no goal buttons; Cal's request); missions cheaper in energy (25 to 160) and
     paying more per energy for bigger jobs; dungeons 5 a day, random haul by depth, no coin numbers on the cards, only 5 listed
     (Cal); businesses share counts only rooms a player can open.
   - Prices: one rule, tier x room phase x position in the room's list (`econPrice`); lots and openers by the new room's phase;
     clothes 150-700, interface items by level, permanent upgrades by payback. IMAX Laser Projector 3,000, IMAX Screen 6,000.
   - Result: Cal's routine Garden day 5, Mall day 22, every room upgrade day 43; casual player about day 115.
   - Also: the Calibur Mall (and everything inside it) is held closed in a Live build until Cal reviews its layout
     (`MALLHOLD` in 29b_story.js; the sandbox keeps it open); the Auditorium projector uses a back-view sprite once ROOMS makes
     it (request in TASKS.md).
   Not checked: a real phone; two real players; the Shop screen after these prices beyond the sandbox screenshots.
   Open for Cal: levelling runs faster than his targets (Cal's routine level 100 around day 20; see ECONOMY.md).
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
- Smaller: (dungeon card coin range: gone, the cards show no coins now), selling produce turns off the Restaurant bonus silently, Loft "/hr"
  ignores the daily cap, header coins stale after a level-up.

## Build and test on this laptop (no Python or Node installed)
- Build: `bash quest-board/tools/windows/build_web.sh quest-board sandbox` (a bash port of tools/build.py; writes
  quest-board/dist-web; drop `sandbox` for a Live-like build).
- Serve: `powershell -NoProfile -File quest-board/tools/windows/serve.ps1 -Root quest-board/dist-web -Port 8765`
  (or `perl quest-board/tools/windows/serve.pl quest-board/dist-web 8765`), then open http://localhost:8765/. Seen on
  2026-11-09: serve.ps1 served a stale, cut-off app.js after a rebuild, and serve.pl died when several headless tabs loaded at
  once (a broken pipe): run serve.pl as `perl -e '$SIG{PIPE}="IGNORE"; do "./serve.pl"' ../../dist-web 8765` in a restart loop.
- Headless checks: `node.sh` runs VS Code's Electron as Node. Start Chrome with `--headless=new
  --remote-debugging-port=9350 --window-size=390,844`, run `bash node.sh hold.js` (iPhone emulation), then
  `bash node.sh q.js init|go <url>|ev "<js>"|shot <name>|text|acts|tap x y|errs`; `bash node.sh syn.js
  quest-board/dist-web/app.js` checks the build compiles. Do not use the browser-panel tools: they froze these chats.
- Economy: `bash node.sh econsim.js <casual|regular|cal|grinder> <days>` plays a new save in its own browser context and writes
  out/econ_<type>.json. q.js attaches to the first open page, so never run q.js while a sim runs (it will drive the sim's tab).

## Shipping (push is blocked here)
`git bundle create saywhat.bundle main qa-local --not origin/main origin/release/live-7fd8c97` (after `git fetch origin`),
plus `git format-patch` copies, zipped with a README for the Mac. On the Mac: fetch the bundle into branches, deploy
firestore.rules once (Town Hall chat and likes), then `git push origin qa-local:refs/heads/live` (the "Live at 4 am"
Action publishes; needs the FIREBASE_SERVICE_ACCOUNT secret). Bump APPV for every release.
