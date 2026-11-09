# Economy

What a player earns and what things cost. Cal, 2026-11-09: "i want everyone to feel like buying stuff is worth it and not too
expensive, but also not too easy. Once the garden and other income generating stuff gets unlocked, certain upgrades should be
more expensive. But when you are first starting off with no passive income, it is hard to get 2000 ... if we are passively
collecting a LOT of money, then it makes sense for the imax projector to be 2500 or something like that." Every number below is
in `ECON` in `app/src/29e_economy.js` unless it says otherwise.

## XP and levels

Cal, 2026-11-09: levels must never feel slower and slower, and "if they used it for daily tasks and chores everyday, they could
lvl up 1-2 times ... pair that with working out, using the trainer, and other things, you could level up 3-4 times". Level L to
L+1 costs `20 + 115(L-1)/5` XP below level 6 (level 1 to 2 is one or two quests), then `135 x (1 + 0.0015(L-6))`: 135 at 6, 144 at
50, 154 at 100; level 100 is 13,905 XP (`lvNeed` in `30_app_b.js`, `ECON.lvFirst`, `lvRamp`, `lvFlat`, `lvGrow`). Saves keep their
exact level and progress (`xpc3` in `merge`). Trials pass with a fresh activity photo at once, or on honor after 2 active days of
50+ XP (`ECON.trialDays`). Catch-up: rested XP (a quarter level per day away, up to one level, quests pay double until it is used),
the Weekly Quest (active on 4 days pays a level), streak repair (one missed day a week free, freezes cover each missed day, a break
halves the streak), and +25% XP while 8+ levels under the friends' median.

Quest XP stays on the 5 to 100 scale. Without a photo a quest pays its listed XP; a live camera photo that passes the check pays
at least double the XP and the coins on any quest (Cal, 2026-11-09: photos are a pure bonus), a streak adds up to 30%, and combos,
bounties and crits stack on top as you rank up. Undoing a task takes back its XP, coins, combo step and, if the day falls under 50
XP, that day's streak credit and any chest it opened.

Measured (QA, 2026-11-09, `tools/windows/econsim.js`): those bonuses make a day's real XP 2 to 3.5 times its listed XP. Cal's
routine (10 chores, the gym with a photo and a Training session on weekdays) reaches level 100 around day 20, a casual player
(6 tasks, 5 days a week, 2 workouts) around day 55. That is faster than the targets above; left as it is for Cal to decide.

## Coins

| Source | Amount |
| --- | --- |
| Quests | 6 coins an XP of the quest's **listed** XP (x2 with a photo, x2 for the daily bounty, x1.5 or x2 for a Bounties card), +0.5% a level (`ECON.coinLv`), times the day's momentum: full rate for the first 3 tasks, +12.5% a task after, double from the 11th (Cal, 2026-11-08). Streak, combo, crit and rank bonuses are XP only (`payXp` in `30_app_b.js`: `cx`) |
| Daily Quest chests | 150 XP finishes the Daily Quest; a chest opens at 150, 200, 250 and 300 XP of the day: 150, 150, 200 and 300 coins (`ECON.dqTiers`), x (1 + 5% a point of INT, at most +25%) |
| Hidden quest (300 XP) | a streak freeze, or +1 INT, or 300 coins once INT is full |
| Level up | 50 + 5 x level, paid once per level (`ECON.lvPay`) |
| Businesses | each day at most a share of the day's quest coins: 20% with a bare town, up to 50% with every upgrade of every room a player can open, +1% a VIT point (10% at most), times the town's efficiency (0 to 150%). The rest waits in the room |
| Dungeon Crawls, 5 a day | a random haul by how deep the dungeon is, and now and then a rare find: see below |
| Wheel (level 6+) | about 230 a day |
| Trophies | 250 each |
| Weekly workout bonus | at least 250 XP and 3,000 coins (Cal) |
| Training | 300 coins a full session |

**What a day earns** (measured, `econsim.js`, coins a day without level-ups and one-off trophies): the regular player (12 tasks,
200 listed XP) about 3,000 to 4,500 in the first days, 6,000 when the Garden opens, 9,000 to 10,000 at the Restaurant, then 11,000
to 15,000 from Boba on, where it levels off. Before this pass it ran to 30,000 a day by day 25 and 600,000 coins sat unspent.

### Dungeon Crawls (`DNG` and `dngClaim` in `10_app_a.js`, the finds in `29d_dungeon.js`)

Cal, 2026-11-09: "Merge dungeons and missions. dont need two separate ones. Dungeon Crawls will be the new name. A dungeon crawl and
bring loot, a new cosmetic, a new ally, or a relic piece, or something for the trophy room. But these items are rare, with success
gauranteed by the 4th crawl." One tab (the nav says Crawls), open once the Hero's Lair is built. No energy any more.

- **5 crawls a day** (`ECON.dngPerDay`), one at a time (two with the Scout Map), 30 to 60 minutes each (AGI and the Tunnel-Runner
  Greaves bring them back sooner). Only 5 dungeons are listed: the deepest one open, the two below it, the two locked ones above.
  The Mossy Cellar is open from level 1, so the first crawl never waits for a level.
- **Coins every crawl**, never shown on the cards (a loot word instead: Pocket change to Legendary): a roll inside the dungeon's
  band, leaning low, 6% of the time a big haul of 1.5 to 2.5 times its top; times the town's efficiency today (50% to 150%) and
  the crawl perks (trophy pieces, the Regalia set, Sable). Bands: Cellar 30-80, Metro 40-110, Sewers 65-155, Clocktower 85-205,
  Mines 110-265, Sunken Arcade 140-335, Spire 180-420. Below a dungeon's safe level a crawl can be a setback (a smaller haul).
- **Rare finds**: 12% a crawl (`ECON.crawlRare`), plus the Hushstep Boots (3%), the full Regalia (5%), STR (up to 5%) and 0.5%
  for every Hero's Lair upgrade (`ECON.crawlLair`; the Lair's reason now that it sends no missions). Three crawls running
  with no find and the **fourth always has one** (`ECON.crawlPity`). A find is one of what that dungeon still hides (each card
  says how many): a piece of The Goblin King's Regalia (for the Trophy Room), a shard of The Hollow Amulet (a relic piece), the
  ally trapped there (each with a perk for good), the Rift Mask at the bottom of the Spire, or a piece of clothing you do not own
  (a brand that has left the Shop first, then the brands on sale, then the basics). A dungeon with nothing left: half its finds
  are clothes, half a strongbox (the band's top in coins). A find is kept the moment the crawl comes home.
- **The first crawl** brings Sable home (your first teammate) instead of a find.
- Every crawl counts toward the Expedition Ledger relic and the return visits that used to count missions.
- A save with a mission still out from before the merge gets that mission's coins once (`28_missions.js`).

## Prices

One rule for every room upgrade (`econPrice` in `29e_economy.js`):

**price = what it is x when you reach it (the room's phase) x how far down the room's list it is (up to +50%)**, rounded to 50.

| What it is | Early price (phase 1) |
| --- | --- |
| Decor (earns nothing) | 200 |
| Furniture, small pieces | 325 |
| Equipment | 500 |
| Big single pieces | 750 |
| Big moments (`PRICE_HUGE` in `29_prices.js`: expansions, the IMAX screen) | their listed weight x 0.5 |
| An upgrade that opens a new room | 1,400 x the new room's phase |
| A lot on the street | 2,000 x its phase (the Garden 1,000) |

Phases (`ECON.phase`) follow what a player earns by the time a room opens, a little under it: the Loft 1 (Game Room 1.2, Lair and
Trophy Room 1.3), Garden 1.3, Restaurant 1.8, Boba 2.2, Dessert 2.3, Lock and Key 2.5, Rooftop 2.7, Mall 2.8, Theater and
Auditorium 3, Arcade 3.2, Rhythm and VR 3.3, Bowling 3.4, Karaoke 3.5, Nightclub 3.8. Examples: the first bedroom pieces 250 to 350,
the Walk-in Closet 1,400, the Restaurant 2,500, the IMAX Laser Projector 3,000 (Cal said about 2,500: the Auditorium opens when a
regular player makes about 13,000 a day), the IMAX Screen 6,000, the Nightclub lot 7,600. `ECON.kindOf` settles an item the rule
reads wrong (the plain Digital Projector is equipment, so the IMAX one is the clear step up). `fixed:1` on an upgrade keeps its
price exactly as written. All 381 room upgrades cost 474,250 and the lots 24,600.

**How long it lasts** (measured, buying like a player: save for the next new room, else the cheapest upgrade; no clothes):

| Player | Garden | Restaurant | Mall | Nightclub | Every room upgrade |
| --- | --- | --- | --- | --- | --- |
| Cal's routine | day 5 | day 6 | day 22 | day 32 | day 43 |
| Regular (12 tasks a day) | day 4 | day 5 | day 22 | day 31 | day 41 |
| Casual (6 tasks, 5 days a week) | day 11 | day 13 | day 62 | day 89 | about day 115 |

Before this pass Cal's routine had bought every room upgrade by day 20.

### The Shop

| What | Price |
| --- | --- |
| Brand clothes | each brand's own spread x 0.4, between 150 and 700 (`shopK`, `clothesMin`, `clothesMax`); 349 pieces, about 130,000 in all |
| Basics | x 0.4 |
| Interface items (themes, frames, backdrops, companions, titles, tap effects, HUD, sounds, scenes) | 200 + 25 x the level they open at: 300 at level 3, 700 at 20, 1,450 at 50 |
| Permanent upgrades | priced by what they return, about a week or two of quests to pay back: Merchant Seal I, II, III 1,500, 3,000, 5,000; Focus Rune I, II, III 800, 1,500, 2,500; Frost Charm 1,000; Anchor Sigil 1,500; Scout Map 2,000 (`ECON.buff`) |

Room upgrades have no level locks (Cal, 2026-11-05): each room shows its next 4, the 4th a mystery, and coins pace them.

## Checking it

`tools/windows/econsim.js <casual|regular|cal|grinder> <days>` plays a new save through the real game with the clock moved
forward and prints each day's coins by source, purchases and new rooms (needs the sandbox build on 8765 and headless Chrome on
9350, see `docs/WINDOWS_HANDOFF_2026-11-09.md`). Run it after any change to `ECON`.

## Testing

The Test pill has Get 10,000 coins and Level up. Remove it and the `window.__qb` hooks before release (a Live build with
`QB_WEB.noTest` strips them, `31_release.js`).
