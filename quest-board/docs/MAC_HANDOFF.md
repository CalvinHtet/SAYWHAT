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
| v0.91 | (fill in) | the priority release: see section 2 |

Rollback: branch rollback-v0.80 (v0.80 code, QB_EPOCH 6). Its APPV must stay ABOVE the newest release: 92 for v0.91 (378c509).
A rollback shows levels on the old curve until the release is deployed again, which restores them exactly.

## 2. v0.91 (priority release, Cal's cut)

- W51 rooms open at a % of the room before (ECON.unlock); W52 one-time reset of everything in the building tab, refunded at today's
  prices, save backed up as backup_v91, letter "The Loft has been reset" only to players who bought there; upgrade totals hidden.
- W45/W46 economy: scaling with level, big-moment pieces about a day's income, permanent upgrades priced by payback, balance rule
  (% bought tracks level/90; nobody at level 100 with upgrades left); everything bought around level 90.
- W48 Upgrades and Interface hidden until the Lair's big screen; a button on that screen opens them.
- Rides along (QA passed): W42 shop floors (Street / Boutique 30 / Atelier 70, hidden until opened), W40 daily sale, W44 no spoilers.
- (fill in: commits, QA results, known issues)

## 3. Open queue, in order (TASKS.md)

v0.92 (no art): W47 Shop header + Wednesday vault rule (after 6 brands have dropped), W49 Discord-style chat, W53 greetings (wave, high
five, poke, spank; Visit Loft removed), W50 + W14 screen colours (Hall first), W41 wardrobe filters, W57 online dot + streak, W58 Board
shortest task first, lfSkyline duplicate cleanup. v0.93+: W56 purchase sounds, W54 Town Boss (art), W55 friends visit businesses,
W35 Rafe's legendary hunts, W36 side-quests, W8/W9 photo feed, W28 Gym Pact, W1b w-perf2 (load room art per room, the 10 MB blobs.js).

## 4. Art for the Mac (Higgsfield, Unlimited only, Cal approves first)

TASKS.md "For Cal's Mac Claude" sections: visitor story beats + pictures (W12), pets and pet outfits (level 45), face cosmetics (40),
level 90 items, 30 relic icons, Rafe montages (first-person, no player character), 8 mid + 12 luxury brands for the floors, Town Boss
(6 pictures per boss), thin-room upgrades. The game fails softly until each exists.

## 5. Specs

ARCHITECT's specs with Cal's words are in docs/specs/ (SPEC .. SPEC10, LATER_ROADMAP.md). The long-term list is also in
docs/HANDOFF.md "Later".

## 6. Rules and lessons the laptop learned (its memory does not travel)

- Shipping: push is blocked on the work laptop; each release is a zip (git bundle + diffs + README) Cal moves to the Mac. Live deploy
  is manual (firebase-tools hosting + the "test" channel; rules when they change). Zips are built with forward-slash entries.
- After ANY price or ECON change, run rigtest/qa/pricesweep.js on the whole game (a duplicate ECON key once made 482 room prices NaN).
  Build regexes as literals, not from strings. Grep ECON for a key before adding one.
- Never bump QB_EPOCH (it wipes every save). Saves are migrated in code (e.g. the curve-4 save move, the v0.91 reset).
- Timing tests: at most 2 headless Chromes, always --mute-audio; one machine load skews numbers, so use A/B in one page.
- Text: docs/VOICE.md, including "No spoilers" (never name what the player doesn't have yet) and "letters say what changed, not how".
  Patch-notes letters every 10 versions (500 coins); the next is v1.00.
- Before a public release: the Live build strips the Testing row and window.__qb / __qbLoft (noTest in config.js; check
  grep -c "noTest: true" = 1).

## 7. Open questions for Cal

(fill in at release: Town Boss defaults, first-week unlock spread, Board time estimates, Crown/Halo/Wings at Street prices, the Plaza
wait, the Garden earnings number for the Restaurant)
