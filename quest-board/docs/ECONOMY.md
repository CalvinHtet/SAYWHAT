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
| Businesses | each business has its own day (w-econ3, Cal: "some upgrades say +22% produce, but I dont see the number of coins you earn a day increasing"): fully upgraded at full speed it makes `ECON.bizDay[room]` a day (Garden 900, Restaurant 1,100, Lock and Key and the Rooftop 300, Boba and Dessert 250, the Mall 400, the Theater 650, the Auditorium 600, Arcade, Bowling and Karaoke 400, Rhythm and VR 350, the Nightclub 800), less with fewer upgrades: its coins an hour x its "+N%" upgrades x the hours it holds, x the town's efficiency today (0 to 150%), +1% a VIT point. So every earning upgrade raises that room's day, and the room window says it ("Earns about 1,240 coins a day (+22% from upgrades)"); each card says about what it adds a day. Above them all, the businesses together pay at most 60% of the day's quest coins (+VIT) x efficiency (W21, `payRoom`), and produce sold (7 coins each, was 4) counts in that too |
| Dungeon Crawls, 5 a day | a random haul by how deep the dungeon is, and now and then a rare find: see below |
| Wheel (level 6+) | one spin every 4 hours (Cal, 2026-11-10), the next one opens 4 hours after the last and nothing banks up while away (`ECON.wheelEvery`). Each prize is a third of what it was (100 to 1,650 coins, about 310 a spin on average; `ECON.wheelK`), and the streak freeze and the gold slivers are a quarter as likely a spin (`ECON.wheelOdds`), so a 4-spin day pays about 1.5x the old daily wheel and free clothes still come about every 12 days. A sliver is a piece of clothing the player does not own from any brand, dropped or not (350 coins once they own them all). `WHEEL` in `10_app_a.js`, the 4-hour rule in `29e_economy.js` |
| Trophies | 250 each |
| Weekly workout bonus | at least 250 XP and 3,000 coins (Cal) |
| Training | 300 coins a full session (a plan of your own done in full counts as full) |
| Kind words for Cal (the + by the coins) | 500, 1,000 or 1,500 when Cal approves the note; one note a game day, at most 1,500 a day (`KD` in `29v_kudos.js`). Only Cal's account can approve (firestore.rules) |
| Challenges (Town Hall, Posts) | none made: both players stake 100 to 2,500, the winner takes both, a tie or a cancelled, declined or unanswered challenge gives the stakes back (`29w_duel.js`). Coins only move between players |
| Friends' tips (W55, v0.92) | other players visit your businesses (0 to 3 visits a day, 0.9 on average; `ECON.pvis` in `29kv_visitors.js`). At most 2 of a day's visits tip, about 0.46 tips a day: 100 x the room's price phase (`ECON.phase`), so 130 in the Garden to 380 in the Nightclub, paid by the game, never by the friend. About 40 coins a day with only the Garden, about 120 with every business: under 1% of a day |

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

One rule for every room upgrade (`econPrice` in `29e_economy.js`), then Cal's price rules on top (`econRules`):

**price = what it is x when you reach it (the room's phase) x how far down the room's list it is (up to +50%) x the late factor**,
rounded to 50. The late factor (Cal, 2026-11-10: "upgrades later on cost more money. IMAX project and a bigger theater is
definitely worth more than a painting") is `1 + ECON.lateK x (phase - 1)` with lateK 1 (w-econ3; was 1.25, then .8): the Loft 1x, the
Garden 1.3x, the Restaurant 1.8x, the Mall 2.8x, the Theater and Auditorium 3x, the Nightclub 3.8x.

| What it is | Early price (phase 1) |
| --- | --- |
| Decor (earns nothing) | 150 |
| Furniture, small pieces | 245 |
| Equipment | 375 |
| Big single pieces | 560 |
| Big moments (`PRICE_HUGE` in `29_prices.js`: expansions, the IMAX screen) | their listed weight x 0.45 |
| An upgrade that opens a new room | 1,050 x the new room's phase |
| A lot on the street | 1,500 x its phase (the Garden 750) |

w-econ3 round 2 took every room price x0.75 and the late factor back up to 1, so the last rooms keep their weight (econsim before: 16%
of the upgrades bought at level 30 against 33%, 96% at level 90).

**Cal's price rules** (2026-11-10: "For small upgrades that are looks only, they should be cheaper in every room. For items that increase
the passive income, those can be priced higher. The order of upgrades need to make sense too. if a table is 800, but plants are 1800,
there is a problem"), room by room after the rule above:
1. Looks only (in a business: no "+N%"; elsewhere: decor with no effect) costs the room's decor price, flat (no list ramp), and never
   more than the room's cheapest other upgrade. That holds for a looks-only big moment too (the Stone Fountain).
2. In a business, the earning upgrades share what the room's earners and looks cost before, by their "+N%" as written (what the piece
   does, not its old price), so each pays itself back in the same number of days and its card says about what it adds a day.
3. Moments keep their price: openers, expansions, `PRICE_HUGE` pieces, the big moments, `fixed:1`.
4. Each list is in price order, cheapest first, and a piece that needs another comes right after it (`econSort`). The room window
   shows the next three and a mystery card; an upgrade that opens a room goes first. Nothing in the building tab waits for a level or a
   day (Cal: "make everything locked around money and unlocking it sequentially rather than locked by a day or level"): money, this
   order and the room triggers pace it. One exception, by Cal (18:23): Noir (it opens the bar) waits for 180 dishes served (`ECON.noirServed`, about 2 an hour, so about 4 days) and its card is listed first with "Dishes served: N" and a bar; the bar follows the moment Noir is bought.
5. No invisible upgrades: the Back Office Safe and the Root Cellar drew nothing and only held more hours, so they left the shop
   (`ECON.retire`). Owners keep them and what they do; the ids stay.

Phases (`ECON.phase`): the Loft 1 (Game Room 1.2, Lair and Trophy Room 1.3), Garden 1.3, Restaurant 1.8, Lock and Key 2.2, Rooftop 2.3,
Boba 2.5, Dessert 2.7, Mall 2.8, Theater and Auditorium 3, Arcade 3.2, Rhythm and VR 3.3, Bowling 3.4, Karaoke 3.5, Nightclub 3.8.
Examples: the first Bedroom pieces 150 to 250, the IMAX Laser Projector 9,250, the IMAX Screen 14,250, the five lots 57,050 in all.
`ECON.kindOf` settles an item the rule reads wrong. `fixed:1` keeps a price exactly as written. All 379 room upgrades on sale cost about
1,030,550.

**Bigger upgrades earn more** (Cal: "bigger upgrades should give bigger passive buffs. Such as the imax screen should definitely
start generating more income"): in a room that earns, each earning upgrade's share of the room's income follows its price
(`econEarn`), so a pricier piece never earns less than a cheaper one in the same room, and the room's total stays what it was.
Late prices scale a whole room alike, so the order is the same before them. Auditorium: IMAX Screen +59% (v0.88 +54%), IMAX Laser
Projector +30%, Back Row +26%, Bigger Screen and Leather Recliners +22%, Digital Projector +18%. Nightclub: the VIP Booth +10.5%,
the Velvet Rope +3.9%. Garden: the Glass Conservatory +42%, the Sprinklers +23.5% (their price is set in `29i_garden.js`, which
runs `econEarn("garden")` again). A room that doesn't earn coins (the Pond) keeps its shares in price order. What each piece is
(`ECONKIND`, for its price) is read before the re-pricing.

**Rooms growing by 15** (Cal, 2026-11-17: "Add 15 more upgrades to everything else"; Lock and Key first, 13 to 28, v1.13). Two rules so a bigger room never costs a player anything they had:
- A gate that counted a share of a room's upgrades is pinned to the count it asked before (`n` in `ECON.unlock`): the Rooftop at 7 of Lock and Key's upgrades, Boba at 10, the Mall at 79 of Kode Plaza's. Otherwise 15 more upgrades would push the next room back (Rooftop 14, Boba 21, Mall 88).
- The room's `bizDay` goes up so a room holding only its old upgrades still earns what it did: Lock and Key 250 to 360 (the old 13 earn 256 a day, was 250; an empty room 133, was 136; all 28, 360). Each new upgrade's price falls in the room's existing tiers.
Boba (15 to 30, v1.15): Dessert pinned at 9 of Boba's upgrades (18 without it); `bizDay` 250 to 360 (the old 15 earn 258, was 250; empty 162, was 166; old pieces' prices 5-9% lower as the price ramp spans more). Payback of a whole room: Lock and Key 197 days (was 152), Boba 208 (was 152).
The economy pass after all the +15s resets these on purpose. Check any grown room: `ROOM=<id> rigtest/lead/roomplus.js` against the last release's build (Lock and Key's own: `skybar15.js`).

**How rooms open** (w-unlock, Cal's table, 2026-11-10; replaces SPEC8's focus rule): each story room opens at a share of the upgrades
of the room before it (`ECON.unlock`; retired pieces, openers and Trophy Room finds don't count), and there is no level on any story
room (Rafe and Nova, the two team steps, keep theirs). A room whose trigger is met opens at once, not a day later.

| Room | Opens when |
| --- | --- |
| Closet / Patio / Game Room | 30% / 50% / 70% of the Bedroom (10 / 16 / 23 of 32) |
| Garden | 60% of the Loft's core rooms, built or not (46 of 76) |
| Restaurant | the Garden has made 3,000 coins (produce sold and coins collected; about 3 to 4 days) |
| Lock and Key (the bar) | the Restaurant's Noir is bought (Noir waits for 180 dishes served, about 4 days); it comes before Boba and Dessert |
| Rooftop / Boba | 50% / 75% of Lock and Key (7 / 10 of 13) |
| Dessert | 60% of Boba (9 of 15) |
| Mall | every Kode Plaza room built, then 60% of their upgrades (94 of 156) |
| Theater | 30% of the Mall (3 of 10) |
| Auditorium, Arcade, Rhythm, VR, Bowling, Karaoke, Nightclub | 40% of the room before |

No totals anywhere (Cal: "don't show the number of total upgrades. so it remains a mystery"): a locked card and its goal say
"Bedroom upgrades: 9 bought" with a bar that has no numbers; the bar's card says "Keep upgrading the Restaurant until Noir". A card
waiting on a room the player doesn't have shows that room's own next step instead, never its name.

**The one-time reset** (v0.91, Cal: "initialize the loft and refund all the money they have spent so far"): every save that has
never been reset (no `S.reset91`) is backed up (`data/users/<id>/backup_v91` and `quest-board-backup-v91` on the device), then every
room and building purchase goes (Lair and Trophy Room too) and is refunded at today's prices: upgrades, decor styles, paint, lots,
and a room built from its lot before 11-05. Level, XP, clothes, everything from the Shop, relics, trophies and dungeon progress stay.
The letter "The Loft has been reset" says the amount (only when it is above 0). A character made on v0.91 is marked at once.

**Goals** (SPEC8; Cal: "there should be a goal or quest log in the building view such as fully upgraded the bedroom which gives you a
little bit of experience and some coins as a reward"): the building view has a Goals button (with the number ready to claim) and a
"Next goal" line. Each room has a half-upgraded goal (400 coins x its phase + 25 XP) and a fully-upgraded goal (1,200 x phase + 75
XP), and each story trigger is a goal once the room it happens in is yours (300 x phase + 25 XP; `ECON.goal`). A goal that is met
waits for a tap and pays once (`S.goals`); an old save claims the ones it has already met, one tap each.

Econsim (`tools/windows/econsim.js`, 110 days, v0.91 candidate: w-unlock + w-econ3 + w-system; a player who saves for the next room (and for
the Restaurant before buying Shop extras), buys in each room's list order, and buys Upgrades and Interface only once the Lair's console
is built):

| Player | Level 30: day, bought | Level 60 | Level 90 | Level 100 | Everything bought | Businesses: Garden / Restaurant / Mall / end |
| --- | --- | --- | --- | --- | --- | --- |
| regular | day 8, 32% | day 26, 57% | day 59, 99% | day 74 | day 62, level 93 | 7% / 16% / 22% / 23% |
| cal | day 10, 33% | day 27, 54% | day 62, 99% | day 80 | day 65, level 91 | 7% / 18% / 23% / 24% |
| casual | day 23, 32% | day 67, 49% | not reached | not reached | not by day 110 (81%) | 9% / 12% / 11% / - |
| grinder | day 5, 36% | day 12, 46% | day 28, 92% | day 37 | day 35, level 99 | 5% / 10% / 18% / 25% |

The day each room opens: regular 3, 6, 23, 26, 24, 25, 26, 28, 30, 34, 35, 37, 38, 39, 41; cal 3, 6, 25, 26, 26, 28, 29, 30, 31, 36, 38, 38, 40, 41, 44; casual 9, 19, 66, 68, 69, 73, 75, 79, 81, 96, 100, 103, 107, 110, -; grinder 2, 4, 13, 16, 14, 15, 16, 17, 17, 19, 20, 21, 22, 23, 24 (Garden, Restaurant, Lock and Key, Rooftop, Boba, Dessert, Mall, Theater, Auditorium, Arcade, Rhythm, VR, Bowling, Karaoke, Nightclub).
Businesses are their share of a day's coins (rooms collected + produce sold) while the Garden, the Restaurant, the Mall or the Nightclub is the newest; Cal's steps are about 10 / 15 / 20 / 25-30%, never above 30%. Single days run higher (up to about 34% at the end, on days with few quests).

**Level gates** (Cal: "Once you get to lvl 20, you can wear a second accessory. At lvl 40, the option to wear face cosmetics"): a
second accessory from level 20 (`ECON.accLv`; any owned accessory that sits on a different part of the body from the first: "Wear
as second" in the Wardrobe), face cosmetics in the Shop from level 40 (`ECON.faceLv`; none on sale yet, anyone wearing one keeps it).
Pets at 30 and the level 90 set come with their art (the Mac).

**How long it lasts** (older passes; the v0.91 numbers are the econsim table above) (measured, buying like a player: save for the next new room, else the cheapest upgrade; no clothes). Before is
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
| Interface items (themes, frames, backdrops, companions, titles, tap effects, HUD, sounds, scenes) | 12% of a regular player's day at the level they open (`ECON.uiDay` x `ECON.dayInc`): 850 at level 3, 1,300 at level 20, 2,150 at level 50. They sit in the System tabs (Upgrades and Interface), which open with the Lair's Command Console (w-system) |
| Permanent upgrades | priced by payback (Cal: "These upgrades should be much more expensive because they are permanent"): a +% coins upgrade pays for itself in 15 days of a regular player's quest coins at its level, a +% XP one in 15 days of the day's income (a point of XP counts like a coin), the others at a share of a day (`econBuffPrice`, `ECON.payDays`, `ECON.utilDay`): Focus Rune I 2,900, Merchant Seal I 5,500, Frost Charm 4,100, Focus Rune II 4,500, Merchant Seal II 7,350, Anchor Sigil 6,100, Scout Map 6,150, Focus Rune III 6,650, Merchant Seal III 12,400. In the Upgrades tab they come in a cascade: tier I of each line and the first single, then each next one right under the one bought |

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
floor switch, splashes, the Shop "!" (cleared per floor: a floor's new brand counts as seen once that floor is open on screen), alerts
and the gifts from chests, the Wheel and crawls. The Wednesday vault (W47, Cal) starts once `DROPS.vaultAfter` (6) brands have
dropped on the Street's calendar (the first is Wednesday 2026-12-02 with cal0 2026-11-10); from then on one retired brand is in the
Shop every Wednesday 8 am to Thursday 8 am, and its splash says "The vault is open" once per Wednesday. It is one brand for the whole
Shop, from the open floors with enough brands to take part (`flVaultOk`: (brands - live) x days between drops >= 26, so a brand can
be gone 14 days without dropping again within 5). The Street takes part; the Boutique's 4 brands do not, until it has 6. Prices follow
the floor (`ECON.clothFloor`, the Street capped at 450), and QA's grade
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
