# Mac handoff (from the Windows laptop team, 2026-11-10)

FINAL (LEAD, 2026-11-10, after v0.92): the Windows team stops here; Cal continues on the Mac. Read this, then CLAUDE.md, docs/HANDOFF.md, docs/TASKS.md
(section "Windows team", rows W1-W60, and the "v0.92 PLAN"), docs/ECONOMY.md and docs/VOICE.md.

Cal: "After all these changes are done, this is ready to go full live. I would like a hand off document and everything saved so I can
provide it to my claude on mac to pick up from there."

## 1. What is live, what is built

First run `git fetch origin` and `git log --oneline -3 origin/qa-local`: Cal may have pushed v0.91 or v0.92 since. The GitHub
states below are as of the v0.91 zip.

| Version | zipped qa-local tip (live branch) | State |
|---|---|---|
| v0.88 | 213ea0f | the last one on GitHub's qa-local (2026-11-10 morning) |
| v0.89 | a246406 | zipped; its qa-local push did NOT reach GitHub (the rollback push did) |
| v0.90 | 2a97a02 (release/live-2a97a02) | zipped (carries v0.89): economy v1, chests, relics, update window, letters |
| v0.91 | eea5382 = merge 8d09598 of rc-v0.91 8693de1 + docs (release/live-eea5382) | zipped 2026-11-10 evening, QA PASS 19:25: see section 2 |
| v0.92 | merge d395ae7 of rc-v0.92 24df171 + this handoff (the zip README names the exact tip and live branch) | zipped 2026-11-10 night, the last Windows release: see section 2b |

Rollback: branch rollback-v0.80 (v0.80 code, QB_EPOCH 6). Its APPV must stay ABOVE the newest release: 93 for v0.92 (1ea314e). Bump it with every release (v0.93 -> 94).
A rollback shows levels on the old curve until the release is deployed again, which restores them exactly.

## 2. v0.91 (priority release, Cal's cut)

- W51 rooms open at a % of the room before (ECON.unlock); W52 one-time reset of everything in the building tab, refunded at today's
  prices, save backed up as backup_v91, letter "The Loft has been reset" only to players who bought there; upgrade totals hidden.
- W45/W46 economy: scaling with level, big-moment pieces about a day's income, permanent upgrades priced by payback, balance rule
  (% bought tracks level/90; nobody at level 100 with upgrades left); everything bought around level 90.
- W48 Upgrades and Interface hidden until the Lair's big screen; a button on that screen opens them.
- W47 Shop header (The Shop, the drop line, coins and inbox top right), the Wednesday vault after 6 brands, no locked Shop tab, locked
  tabs show "?". Building Goals log with totals hidden (29bg_goals.js). Passive-income steps (Garden ~10%, Restaurant ~15%, Mall ~20%,
  endgame 25-30%), with the Restaurant trigger raised.
- Rides along (QA passed): W42 shop floors (Street / Boutique 30 / Atelier 70, hidden until opened), W40 daily sale, W44 no spoilers.
- Also: no level or day gates in the building tab (money, list order and the % / coin triggers pace it); Noir after 180 dishes,
  its card first with progress, Desmond the same day; story order Garden -> Restaurant -> Lock and Key -> Boba -> Dessert -> Mall;
  the Wheel every 4 hours; tiered permanent upgrades I-III (3-card cascade); level-up cards with no counts or spoilers; likes 2 a
  day in total; the Training weight box keeps the last weight; Cal's own one-time fresh start (29bv_calfresh.js, his uid only,
  Training kept, runs only before 2026-11-14 UTC). If Cal publishes after Fri 2026-11-14, it never runs: move
  CFUNTIL (29bv_calfresh.js line 14, Date.UTC(2026,10,14)) to a later date first.
- QA (19:25, rigtest/qa/run_rc.sh): Live checks, full pricesweep, reset on 8 saves + two devices, unlock order, Goals, no gates,
  story order, w-system, Wheel, Shop header + vault, spoiler playthrough, Training, sale, likes, fresh start. 0 page errors.
  Not tested: visuals of wall pieces, the Collect day cap on screen, a real Firestore account, phones.
- Sims (110 days): Lock and Key 5 days after the Restaurant; level 100 on day 73 (regular) and 80 (cal), short of Cal's ~85;
  Garden-stage businesses 7-8% (target 10); single late days up to 33-34% passive (cap 30, average under). v0.92 candidates.

## 2b. v0.92 (the last Windows release)

- W49 Discord-style chat (round faces or initials, grouped messages), W53 greetings (wave, high five, poke, spank; Hug, Cheer and
  Visit Loft gone; old cheers still pay), W57 green online dot + streak in the Hall.
- W50 + W14 screen colours: the Hall from its picture, every screen slightly different (QA: no screen reads worse than v0.91).
- W41 Wardrobe categories and brand filters.
- W58 Board shortest first (each quest has an estimated minutes value, "~5 min"), W59 the quest toast at the top (3 s + fade,
  replaces), W60 the building-view "+" opens its own buy window ("? ? ?" and the unlock lines when not ready), lfSkyline cleanup,
  and the last debug hooks (qbDbg, __qbTeam, __qbAlerts, __qbShift) gone on Live.
- w-econ4: the Weekly Quest pays half a level of XP (ECON.wqLvl .5); Garden business day 1,500, produce 8; Restaurant day 700;
  Weekly Warrior coins x the weeks in a row, up to x4 (ECON.wwMax), a missed week resets. Sims: level 100 day 79 (regular) and 84
  (cal); everything bought at level 87-88; Garden stage 9-10%.
- w-bounty: 300 handwritten bounties (BTY1 200 one-day, BTY2 100 two-day), a per-player shuffle, "Another" takes the next one (no
  Claude call any more), the 2-day bounty pays 2x.
- W54 Town Boss with a drawn stand-in (29sb_boss.js): a week has a boss only with 5+ players active on 3+ days; HP 800 x active;
  damage = the day's quest + Training XP, 600 a day; win letter about a day of quest coins + a find (top 3 two); a loss is visual
  only (fire, "still smoking" until a win). BOSSART is empty until the Mac paints the 6 pictures.
- QA (21:15 on 2081eef, re-check 21:25 on 24df171, rigtest/qa/run_rc.sh now with the v0.92 scripts): Live, pricesweep (0 changes),
  41 old-save loads (0 bad; an old bounty state hung LOADING on d6a2ce3 and was fixed), the whole v0.91 suite, ui92, bounties (no AI
  or network calls, no x2 stacking), the Town Boss, chat, wardrobe, Weekly Warrior x1-x4, contrast (18 below AA vs 21 in v0.91).
  Not tested: the "? ? ?" not-ready lot window (code only), real phones, Safari's notch, a real Firestore account, two real phones on
  the Town Boss, a real week's turnover on Live.

## 3. Open queue, in order (TASKS.md)

v0.93+ (the Mac): the Town Boss art (6 pictures per boss + the burned Town Hall and cracked frames; the code is in),
W56 purchase sounds, W55 friends visit businesses, W35 Rafe's legendary hunts, W36 side-quests, W8/W9 photo feed, W28 Gym Pact, W1b
w-perf2 (load room art per room; the 10 MB blobs.js), the server clock for Night watch photos (SPEC6; the phone's time stamp shipped).
The photo feed (W8/W9) is built (branch w-photos, 29ph_photos.js) and needs Firebase STORAGE: enable it once in the console,
then deploy storage.rules and the firestore.rules changes (`deploy --only firestore:rules,storage`, RELEASING.md). Comment deletes
(by the comment author, the post author or Cal) are in firestore.rules.

## 4. Art for the Mac (Higgsfield, Unlimited only, Cal approves first)

TASKS.md "For Cal's Mac Claude" and HANDOFF.md list each item: visitor story beats + pictures (W12), pets and pet outfits (level 45),
face cosmetics (40), level 90 items, Rafe montages (first-person, no player character), 8 mid + 12 luxury brands for
the floors with their banners and logos, Town Boss (6 pictures per boss), the burned Town Hall picture and cracked frame pieces (a lost
boss week), the 30 relic icons by the approved names in docs/specs (SPEC6), the Shop brand banners (5 painted, never approved, in
Dropbox art/raw/banners), the Auditorium projector back-view sprites, the Closet stage images, thin-room upgrades, and later the Mystic Shop and the
designer brand. The game fails softly until each exists.

## 5. Specs

ARCHITECT's specs with Cal's words are in docs/specs/ (SPEC .. SPEC10, LATER_ROADMAP.md). Read docs/specs/README.md first: it lists
the parts that were SUPERSEDED, so they don't get built by mistake. The long-term list is also in docs/HANDOFF.md "Later".

## 6. Rules and lessons the laptop learned (its memory does not travel)

- Shipping: push is blocked on the work laptop. Each release is a zip (git bundle + diffs + README) that Cal moves to the Mac. Live
  deploy is manual (firebase-tools hosting + the "test" channel; rules when they change). Zips are built with forward-slash entries.
- Cal's Mac zsh: no # comments in command lines. Give Mac commands one per line.
- After ANY price or ECON change, run rigtest/qa/pricesweep.js on the whole game (a duplicate ECON key once made 482 room prices NaN).
  Build regexes as literals, not from strings. Grep ECON for a key before adding one.
- Never bump QB_EPOCH (it wipes every save). Migrate saves in code instead (e.g. the curve-4 save move, the v0.91 reset). The rollback
  branch's APPV must stay above the newest release.
- syn.js is not enough: load the page after every build (a blank screen reached QA on 2026-11-10 because ECON was read before
  29e_economy.js ran). QA's run_rc.sh does both. Also load real OLD saves in the middle of a feature (a v0.92 candidate hung on LOADING
  for anyone who had seen the Board that day: an old bounty state crashed the new bounty code). Wrap optional panels in try/catch.
- AI cost: functions/index.js PER_DAY = 80 Claude calls per player per day (photo checks and brain dumps; the Board's time estimate rides on the brain-dump parse, no extra call).
  Bounties no longer call Claude (v0.92). Each call is paid on Cal's Anthropic key.
- QA on the Mac: docs/QA.md "Release checks" (Node 22+, Chrome, muted; the release scripts and their env; seed saves in
  rigtest/qa/seeds/). Run the full set on every release candidate.
- Timing tests: at most 2 headless Chromes, always --mute-audio. Load on the machine skews the numbers, so compare A/B in one page.
- Text: docs/VOICE.md, including "No spoilers" (never name what the player doesn't have yet) and "letters say what changed, not how".
  Patch-notes letters come every 10 versions (500 coins). The next is v1.00.
- Timed photos: the photo carries the phone's time stamp (shipped). Night watch should use the server clock (v0.93, SPEC6).
- Before a public release: the Live build strips the Testing row and window.__qb / __qbLoft (noTest in config.js; check
  grep -c "noTest: true" = 1).

## 7. Open questions for Cal

- Going "full live": the Calibur Mall is still held closed in Live (MALLHOLD = true, 29b_story.js) until Cal reviews it. His call.
- Crown, Halo and Wings at Street prices, or signature pricing?
- The Plaza wait length.
- The roadmap letter shipped as approved (only "tell me in the Town Hall" became "tell me").
- The Town Boss: a boss only in weeks with 5+ active players (v0.92 does this every week, not only before the first boss). OK?
- Receiving a greeting pays +4 coins (from before v0.92). Keep it?
- The regular player (12 tasks a day) reaches level 100 on day 79; pushing it to 85 would put Cal near 90. OK?
- Cal's fresh start runs only before 2026-11-14 UTC (see section 2).
- Single late days can pass 30% passive (the average stays under); a per-day total cap is possible.
- Whether Board time estimates need Cal's own numbers (today: Claude's parse or keywords).

Decided by Cal, still to build (full text in docs/specs):
- Gym Pact: both miss -> both lose; any active session counts; photo-only.
- Rafe's legendary hunts at levels 27/52/77/93, photo-only; the first hunt is how you meet Rafe.
- Side-quests: photo-only.
- Sable's "Night watch": an in-bed photo with the server clock; 3 nights open a hidden dungeon.

Decided, so no longer open: Town Boss numbers (SPEC10), the first-week unlock spread (W51 %; sims open one room every 1-2 days), the
Garden earnings target for the Restaurant (set by the v0.91 passive-income steps).

## 8. Known issues

- Room Bonus under about 0.5% changes nothing on a 100-XP quest, because quest XP is a whole number (QA 16:20; the perk total
  itself is exact since b543c04). The bonuses count on bigger quests and add up as rooms fill. Cal decides whether it matters.
- Late Dungeon Crawls pay 3-7k a day with no cap (outside the 30% passive cap).
- Two devices on one account overwrite each other's save.
- Duel and boss scores are self-reported. Fine among friends, not cheat-proof.
- The Hall reads at most 60 players (friend groups break before about 25).
- First load is about 10-14 MB (W1b w-perf2).
- Not visually checked: wall pieces in every room (the Restaurant's floating sign was moved onto the kitchen wall in v0.91 and
  QA checked the menu boards in code, not by eye). Real phones, Safari's notch area (the top toast), a real Firestore account.
