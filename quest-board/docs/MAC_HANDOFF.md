# Mac handoff (from the Windows laptop team, 2026-11-10)

DRAFT: LEAD finishes this when the priority release (v0.91) is zipped. Read this, then CLAUDE.md, docs/HANDOFF.md, docs/TASKS.md
(section "Windows team", rows W1-W58), docs/ECONOMY.md and docs/VOICE.md.

Cal: "After all these changes are done, this is ready to go full live. I would like a hand off document and everything saved so I can
provide it to my claude on mac to pick up from there."

## 1. What is live, what is built

| Version | qa-local commit | State |
|---|---|---|
| v0.88 | 213ea0f | the last one on GitHub's qa-local (2026-11-10 morning) |
| v0.89 | a246406 | zipped; its qa-local push did NOT reach GitHub (the rollback push did) |
| v0.90 | 2a97a02 | zipped (carries v0.89): economy v1, chests, relics, update window, letters |
| v0.91 | 8d09598 (merge of rc-v0.91 8693de1) | zipped 2026-11-10 evening, QA PASS 19:25: see section 2 |

Rollback: branch rollback-v0.80 (v0.80 code, QB_EPOCH 6). Its APPV must stay ABOVE the newest release: 92 for v0.91 (378c509).
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
  Training kept, runs only before 2026-11-14 UTC).
- QA (19:25, rigtest/qa/run_rc.sh): Live checks, full pricesweep, reset on 8 saves + two devices, unlock order, Goals, no gates,
  story order, w-system, Wheel, Shop header + vault, spoiler playthrough, Training, sale, likes, fresh start. 0 page errors.
  Not tested: visuals of wall pieces, the Collect day cap on screen, a real Firestore account, phones.
- Sims (110 days): Lock and Key 5 days after the Restaurant; level 100 on day 73 (regular) and 80 (cal), short of Cal's ~85;
  Garden-stage businesses 7-8% (target 10); single late days up to 33-34% passive (cap 30, average under). v0.92 candidates.

## 3. Open queue, in order (TASKS.md)

v0.92 (no art, the last Windows release): W49 Discord-style chat, W53 greetings (wave, high five, poke, spank; Visit Loft removed),
W50 + W14 screen colours (Hall first), W41 wardrobe categories and brand filters, W57 online dot + streak, W58 Board shortest task first, W59 quest-complete toast at the top,
lfSkyline duplicate cleanup. (fill in at the final: what made it into v0.92 and what did not)

v0.93+ (the Mac): W54 Town Boss (SPEC10 + Cal's final decisions: no coin penalty, the first boss after 5 active players; needs art),
W56 purchase sounds, W55 friends visit businesses, W35 Rafe's legendary hunts, W36 side-quests, W8/W9 photo feed, W28 Gym Pact, W1b
w-perf2 (load room art per room; the 10 MB blobs.js), the server clock for Night watch photos (SPEC6; the phone's time stamp shipped).

## 4. Art for the Mac (Higgsfield, Unlimited only, Cal approves first)

TASKS.md "For Cal's Mac Claude" and HANDOFF.md list each item: visitor story beats + pictures (W12), pets and pet outfits (level 45),
face cosmetics (40), level 90 items, 30 relic icons, Rafe montages (first-person, no player character), 8 mid + 12 luxury brands for
the floors with their banners and logos, Town Boss (6 pictures per boss), the burned Town Hall picture and cracked frame pieces (a lost
boss week), the Auditorium projector back-view sprites, the Closet stage images, thin-room upgrades, and later the Mystic Shop and the
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
- Board time estimates.
- The roadmap letter text: (fill in: shipped as approved, or still pending)
- (fill in at the final: anything new)

Decided, so no longer open: Town Boss numbers (SPEC10), the first-week unlock spread (W51 %; sims open one room every 1-2 days), the
Garden earnings target for the Restaurant (set by the v0.91 passive-income steps).

## 8. Known issues

- Live still sets window.qbDbg, __qbTeam, __qbAlerts and __qbShift (QA LOW; __qb and __qbLoft are stripped as CLAUDE.md asks).

- Room Bonus under about 0.5% changes nothing on a 100-XP quest, because quest XP is a whole number (QA 16:20; the perk total
  itself is exact since b543c04). The bonuses count on bigger quests and add up as rooms fill. Cal decides whether it matters.
- Late Dungeon Crawls pay 3-7k a day with no cap (outside the 30% passive cap).
- Two devices on one account overwrite each other's save.
- Duel and boss scores are self-reported. Fine among friends, not cheat-proof.
- The Hall reads at most 60 players (friend groups break before about 25).
- First load is about 10-14 MB (W1b w-perf2).
