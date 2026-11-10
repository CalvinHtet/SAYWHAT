# Economy

What a player earns and what things cost. Cal, 2026-11-09: "i want everyone to feel like buying stuff is worth it and not too
expensive, but also not too easy. Once the garden and other income generating stuff gets unlocked, certain upgrades should be
more expensive. But when you are first starting off with no passive income, it is hard to get 2000 ... if we are passively
collecting a LOT of money, then it makes sense for the imax projector to be 2500 or something like that." Every number below is
in `ECON` in `app/src/29e_economy.js` unless it says otherwise.

## XP and levels

Cal, 2026-11-10: "I am aiming for 3 months to reach lvl 100 and unlock everything", "about 2 weeks of proper play to get to lvl
40", and "The leveling should definitely ramp up more ... The last few levels ... should take a day or 2 or even 3 to level up."
Curve 4 (`lvNeed` in `30_app_b.js`; `ECON.lvFirst`, `lvRamp`, `lvFlat`, `lvK`, `lvP`): level L to L+1 costs `20 + 115(L-1)/5` XP
below level 6, then `135 + 0.315 x (L-6)^2`: 140 at 10, 197 at 20, 499 at 40, 1,054 at 60, 1,860 at 80, 2,859 at 99;
98,850 XP to level 100 (was 13,905). The spec's first fit (`135 + 4.04 x (L-6)^1.25`) put Cal's level 100 at day 65 in econsim, so
the top is steeper. Saves keep their exact level and their progress through it (`xpc4` in `merge`, from the frozen curve 3).
Renown past 100 is every `lvNeed(100)` XP. Weekly Warrior's XP follows the curve; its coins stay 3,000 (`ECON.wwCoins`).
Trials pass with a fresh activity photo at once, or on honor after 2 active days of 50+ XP (`ECON.trialDays`). Catch-up: rested XP
(a quarter level per day away, up to one level, quests pay double until it is used), the Weekly Quest (active on 4 days pays a
level), streak repair (one missed day a week free, freezes cover each missed day, a break halves the streak), and +25% XP while 8+
levels under the friends' median.

Quest XP stays on the 5 to 100 scale. Without a photo a quest pays its listed XP; a live camera photo that passes the check pays
at least double the XP and the coins on any quest (Cal, 2026-11-09: photos are a pure bonus), a streak adds up to 30%, and combos,
bounties and crits stack on top as you rank up. Undoing a task takes back its XP, coins, combo step and, if the day falls under 50
XP, that day's streak credit and any chest it opened.

**Room Bonus** (Cal: "a new bed would increase your productivity by 0.2% exp gain ... each room should have some stats on the
screen"): each Loft room (Bedroom "Rested", Walk-in Closet, Game Room, Patio) gives at most +3% XP on every quest when fully
upgraded (`ECON.roomBonus`), split across its upgrades by price; each card shows its share ("+0.2% XP") and the room window shows
"Rested +1.8% XP on every quest (14 of 35 upgrades, up to +3%)". It replaces the Patio's and Game Room's old per-upgrade XP. Crew
still add 1% each. Business rooms show the town's efficiency, the payout share and the upgrades owned.

**Relics** (`29y_free.js`, Cal's list): 12 low, 8 mid, 6 high, 4 legendary, each with a small buff in `ECON.relicBuff` (quest
group XP, business income, crawl odds and time, Training XP, chest coins, a monthly freeze); owning a whole tier adds 1 / 1.5 / 2% XP.
They come from the hidden Daily Quest chest (legendary ones from Rafe's hunts, later). econsim includes them.

**Measured** (`tools/windows/econsim.js`, 110 days, each player once; "before" is the build with the new chests, wheel and welcome
coins and the old curve and prices):

| Player | Level 40 | Level 100 | Every room upgrade | Passive share of a day's coins |
| --- | --- | --- | --- | --- |
| Cal's routine | day 9 -> 15 | day 21 -> 82 | day 38 -> 94 | at most 28% -> 24% |
| Regular (12 tasks a day) | day 10 -> 14 | day 20 -> 76 | day 36 -> 88 | at most 25% -> 23% |
| Casual (6 tasks, 5 days a week) | day 24 -> 38 | day 53 -> not by 110 (level 60 day 72) | not by 100 -> not by 110 (14 of 21 rooms) | at most 19% -> 14% |
| Grinder | day 5 -> 7 | day 10 -> 38 | day 22 -> 50 | at most 31% -> 28% |

Cal's routine was measured on the final curve; the other three on the run before it (lvK 0.30), so their level 100 lands about
3 days later on the final curve.

## Coins

| Source | Amount |
| --- | --- |
| Quests | 6 coins an XP of the quest's **listed** XP (x2 with a photo, x2 for the daily bounty, x1.5 or x2 for a Bounties card), +0.5% a level (`ECON.coinLv`), times the day's momentum: full rate for the first 3 tasks, +12.5% a task after, double from the 11th (Cal, 2026-11-08). Streak, combo, crit and rank bonuses are XP only (`payXp` in `30_app_b.js`: `cx`) |
| Daily Quest chests | 100 XP finishes the Daily Quest (Cal, 2026-11-10): 200 coins. The bar then reads x / 200 with no message: 400 coins. Past 200 it fills on in gold with no number toward a hidden chest at 300 that is never named in the game: 600 coins, the `ECON.chest3` roll (a low relic 50%, an accessory the player does not own from any brand 33%, a mid relic 13%, a high relic 4%; never something owned, coins instead), the old hidden quest's reward (a streak freeze, else +1 INT, else 300 coins) and tomorrow +10% XP and the town 10% faster. Coins x (1 + 5% a point of INT, at most +25%) (`ECON.dqTiers`, `dqShown`). The town's efficiency keeps its own 150 XP mark (`ECON.effGoal`) |
| Level up | 50 + 5 x level, paid once per level (`ECON.lvPay`) |
| Businesses | each day at most a share of the day's quest coins: 20% with a bare town, up to 50% with every upgrade of every room a player can open, +1% a VIT point (10% at most), times the town's efficiency (0 to 150%). The rest waits in the room |
| Dungeon Crawls, 5 a day | a random haul by how deep the dungeon is, and now and then a rare find: see below |
| Wheel (level 6+) | one spin a day: 300 to 5,000 coins, about 835 on average (was about 230), a streak freeze, or 2 times in 25 a piece of clothing the player does not own from any brand, dropped or not (1,000 coins once they own them all). `WHEEL` in `10_app_a.js` (Cal, 2026-11-10) |
| Trophies | 250 each |
| Weekly workout bonus | at least 250 XP and 3,000 coins (Cal) |
| Training | 300 coins a full session (a plan of your own done in full counts as full) |
| Kind words for Cal (the + by the coins) | 500, 1,000 or 1,500 when Cal approves the note; one note a game day, at most 1,500 a day (`KD` in `29v_kudos.js`). Only Cal's account can approve (firestore.rules) |
| Challenges (Town Hall, Posts) | none made: both players stake 100 to 2,500, the winner takes both, a tie or a cancelled, declined or unanswered challenge gives the stakes back (`29w_duel.js`). Coins only move between players |

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

**price = what it is x when you reach it (the room's phase) x how far down the room's list it is (up to +50%) x the late factor**,
rounded to 50. The late factor (Cal, 2026-11-10: "upgrades later on cost more money. IMAX project and a bigger theater is
definitely worth more than a painting") is `1 + ECON.lateK x (phase - 1)` with lateK 1.25: the Loft 1x, the Garden 1.4x, the
Restaurant 2x, the Mall 3.25x, the Theater and Auditorium 3.5x, the Nightclub 4.5x. It is what makes every upgrade last about
three months of Cal's routine.

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
the Walk-in Closet 1,400, the Restaurant 5,050, the IMAX Laser Projector 10,500, the IMAX Screen 21,000, the Nightclub lot 34,200.
`ECON.kindOf` settles an item the rule reads wrong (the plain Digital Projector is equipment, so the IMAX one is the clear step up).
`fixed:1` on an upgrade keeps its price exactly as written. All 381 room upgrades cost 1,393,400 (was 474,250) and the lots 85,400
(was 24,600).

**Bigger upgrades earn more** (Cal: "bigger upgrades should give bigger passive buffs. Such as the imax screen should definitely
start generating more income"): in a room that earns, each earning upgrade's share of the room's income follows its price
(`econEarn`), so a pricier piece never earns less than a cheaper one in the same room, and the room's total stays what it was.
Late prices scale a whole room alike, so the order is the same before them. Auditorium: IMAX Screen +59% (v0.88 +54%), IMAX Laser
Projector +30%, Back Row +26%, Bigger Screen and Leather Recliners +22%, Digital Projector +18%. Nightclub: the VIP Booth +10.5%,
the Velvet Rope +3.9%. Garden: the Glass Conservatory +42%, the Sprinklers +23.5% (their price is set in `29i_garden.js`, which
runs `econEarn("garden")` again). A room that doesn't earn coins (the Pond) keeps its shares in price order. What each piece is
(`ECONKIND`, for its price) is read before the re-pricing.

**Story rooms open a day apart** (Cal: "Rooms should open a day apart ... only the ones that have questlines tagged to them such
as the restaurant, boba shop, bar, dessert parlor, strip mall. There has to be multiple triggers"): the Restaurant, Boba, Dessert,
Lock and Key and the Mall each open only when their story gate, their level (`ECON.stepLv`), the coins earned since the story room
before them opened (`ECON.storyCoins`: 2,000 / 6,000 / 8,000 / 12,000 / 20,000) and a new game day since that room opened are all
true. The game day (5 am) is the day, so a room opened late at night lets the next one open in the morning. What a locked story room waits
for shows at the top of the room it grows from, one trigger per line with a tick on each one met ("Level 9 of 12", "1,240 of
6,000 coins earned since the Restaurant opened", "Opens tomorrow at the earliest"): the Restaurant in the Garden, Boba in the
Restaurant, Dessert in Boba, Lock and Key in the Restaurant (its bar upgrade), the Mall in Lock and Key. Other rooms open as before. Opening times live in `S.story.open`; rooms a save already has count as
opened long ago.

**Level gates** (Cal: "Once you get to lvl 20, you can wear a second accessory. At lvl 40, the option to wear face cosmetics"): a
second accessory from level 20 (`ECON.accLv`; any owned accessory that sits on a different part of the body from the first: "Wear
as second" in the Wardrobe), face cosmetics in the Shop from level 40 (`ECON.faceLv`; none on sale yet, anyone wearing one keeps it).
Pets at 30 and the level 90 set come with their art (the Mac).

**How long it lasts** (measured, buying like a player: save for the next new room, else the cheapest upgrade; no clothes). Before is
the 2026-11-09 pass; after is curve 4 and the late prices (2026-11-10), 110 days:

| Player | Every room upgrade, 2026-11-09 | Every room upgrade, now |
| --- | --- | --- |
| Cal's routine | day 43 | day 94 |
| Regular (12 tasks a day) | day 41 | day 88 |
| Casual (6 tasks, 5 days a week) | about day 115 | not by day 110 (14 of 21 rooms) |
| Grinder | | day 50 |

Before the 2026-11-09 pass Cal's routine had bought every room upgrade by day 20.

### The Shop

| What | Price |
| --- | --- |
| Clothes | by quality (SPEC3 part 5, below): thrift 110 to 210, standard 280 to 460, premium 790 to 1,160, luxury 1,560 to 2,110; 316 graded pieces, 122,700 in all (was 121,220). A piece nobody graded keeps its brand's own spread x 0.4, between 150 and 700 (`shopK`, `clothesMin`, `clothesMax`) |
| Basics (hair, dye, eye colour) | x 0.4; the Basics brand's tops, bottoms and shoes are clothes, graded thrift |
| Interface items (themes, frames, backdrops, companions, titles, tap effects, HUD, sounds, scenes) | 200 + 25 x the level they open at: 300 at level 3, 700 at 20, 1,450 at 50 |
| Permanent upgrades | priced by what they return, about a week or two of quests to pay back: Merchant Seal I, II, III 1,500, 3,000, 5,000; Focus Rune I, II, III 800, 1,500, 2,500; Frost Charm 1,000; Anchor Sigil 1,500; Scout Map 2,000 (`ECON.buff`) |

Room upgrades have no level locks (Cal, 2026-11-05): each room shows its next 4, the 4th a mystery, and coins pace them.

**Clothes by quality** (Cal: "A white shirt with a flower on it, should not be the same price as a sexy dress with diamond encrusted
lacings ... higher shops with better quality clothes should be more expensive"): QA graded every Shop clothing piece from its
icon, its line and its brand (`docs/qa-2026-11-10/CLOTHING_TIERS.md`; the table is `clothTier` in `29e_tiers.js`). Each tier has
a band (`ECON.cloth`): thrift 100 to 250, standard 250 to 500, premium 600 to 1,200, luxury 1,300 to 2,200, and designer 2,400
to 3,000 held for a designer brand (no pieces or art yet). Inside its band a piece sits by its slot (`ECON.clothSlot`: a back
piece highest, then a top, a bottom or shoes, a hat or accessory lowest), its brand (`ECON.clothBrand`: VENOM ROSE +0.25, CHROME
RAIN +0.2, NICE COCK +0.15 ... KAIMANA -0.15, Basics -0.25) and its old price against its brand's other pieces (`ECON.clothNudge`,
at most 0.2 of the band either way). The eye styles (`et_*`) are face options and keep the old rule.

| Tier | Pieces | Now | Before |
| --- | --- | --- | --- |
| thrift | 102 | 110 to 210, average 144 | 60 to 520, average 256 |
| standard | 173 | 280 to 460, average 363 | 200 to 680, average 417 |
| premium | 36 | 790 to 1,160, average 998 | 280 to 700, average 566 |
| luxury | 5 | 1,560 to 2,110, average 1,836 | 320 to 700, average 508 |

Examples: VENOM ROSE's Lace Corset Top 560 -> 2,070, CHROME RAIN's Holo Trench 700 -> 2,110, the Crown 600 -> 1,710, HANGANG's
varsity 640 -> 1,020, SØLVBERG's knit scarf 200 -> 130, a Basics tee 80 -> 140. Brand averages: VENOM ROSE 473 -> 932, CHROME
RAIN 477 -> 787, NICE COCK 455 -> 616, KAIMANA 301 -> 214, DIAL-UP 402 -> 251. Every graded piece together costs 122,700 (was
121,220), so total Shop spend barely moves; the money moves from plain pieces to special ones. Econsim buys no clothes, so its
runs do not change. A new piece: grade it with QA's rules in the doc and add its id to `clothTier`; an ungraded piece keeps the
old rule.

**Shop floors** (W42; Cal: "Go on the shop floor plans"): one Shop with three floors (`ECON.floors`; a brand's floor is `fl` in
BRANDS, one field per brand, none meaning the Street).

| Floor | Opens | Brands now | New brand | Live | Prices |
| --- | --- | --- | --- | --- | --- |
| Street | with the Closet | the 12 street brands | Mondays and Fridays, 8 am | 2 | 120 to 450 |
| Boutique | level 30 | VENOM ROSE, SAYMØRE, CHROME RAIN, NICE COCK (12 later) | every Friday, 8 am | 2 (about two weeks each) | 620 to 1,190 |
| Atelier | level 70 | none yet, so it stays hidden | every other Friday, 8 am | 1 | 1,300 to 3,000 |

Each floor's calendar starts at `DROPS.cal0` and is the same for everyone. A player sees only the floors they have opened: the Shop's
floor switch, splashes, the Shop "!", alerts and the gifts from chests, the Wheel and crawls. The Wednesday vault is one brand for the
whole Shop, from the floors the player has opened (the Boutique's 4 brands never qualify yet: each is live two weeks and drops again
two weeks later, so none is gone 14 days without dropping within 5). Prices follow the floor (`ECON.clothFloor`), and QA's grade
orders each piece inside its floor. Opening a floor shows "The Boutique is open" once (`S.floorSeen`), then its brands' splashes.
Level 30 check (econsim, the cal run): a day then earns 7,000 to 10,000, of it 1,000 to 1,400 from rooms and produce and about 1,400
from crawls, and spends 7,000 to 11,000 on room upgrades. Two Boutique pieces cost about 1,800: passive income plus crawls covers them,
but not them plus the day's room upgrades.

## Checking it

`tools/windows/econsim.js <casual|regular|cal|grinder> <days>` plays a new save through the real game with the clock moved
forward and prints each day's coins by source, purchases and new rooms (needs the sandbox build on 8765 and headless Chrome on
9350, see `docs/WINDOWS_HANDOFF_2026-11-09.md`). Run it after any change to `ECON`.

## Testing

The Test pill has Get 10,000 coins and Level up. Remove it and the `window.__qb` hooks before release (a Live build with
`QB_WEB.noTest` strips them, `31_release.js`).
