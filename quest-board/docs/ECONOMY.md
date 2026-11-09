# Economy

What a player earns and what things cost. The aim: something worth buying every day or
two early on, bigger goals later, and about a year of play to reach the top.

## XP and levels

Cal, 2026-11-09: levels must never feel slower and slower, and "if they used it for daily tasks and chores everyday, they could
lvl up 1-2 times ... pair that with working out, using the trainer, and other things, you could level up 3-4 times". Level L to
L+1 costs `20 + 115(L-1)/5` XP below level 6 (level 1 to 2 is one or two quests), then `135 x (1 + 0.0015(L-6))`: 135 at 6, 144 at
50, 154 at 100; level 100 is 13,905 XP (`lvNeed` in `30_app_b.js`, `ECON.lvFirst`, `lvRamp`, `lvFlat`, `lvGrow`). Chores only
(about 180 XP a day): 1.2 to 1.3 levels a day at every stage, level 100 around day 77. Chores plus a photo workout, a Training
session and a bounty (about 500 a day): 3.2 to 3.7 a day, level 100 around day 28, then Renown ranks past 100 (one every 154 XP).
Saves keep their exact level and progress (`xpc3` in `merge`).
Businesses pay out each day at most 200 coins plus 1.5 times the coins the day's quests earned (`29e_economy.js`); the rest
waits in the room. Missions pay coins growing 1% a level and 30% of their listed XP, flat (`msPay`, `28_missions.js`).
Trials pass with a fresh activity photo at once, or on honor after 2 active days of 50+ XP (`ECON.trialDays`).
Catch-up: Daily Quest goal 50, rested XP (a quarter level per day away, up to one level, quests pay double until it is used), the
Weekly Quest (active on 4 days pays a level), streak repair (one missed day a week free, freezes cover each missed day, a break
halves the streak), and +25% XP while 8+ levels under the friends' median.

Quest XP stays on the 5 to 100 scale. Without a photo a quest pays its listed XP; a live camera photo that
passes the check pays at least double the XP and the coins on any quest (Cal, 2026-11-09: photos are a pure bonus), a streak adds up to 30%, and combos, bounties and crits stack on top
as you rank up. Undoing a task takes back its XP, coins, combo step and, if the day falls
under 50 XP, that day's streak credit and any chest it opened.

## Coins

| Source | Amount |
| --- | --- |
| Quests | XP x 6, plus 1% per level, times the day's momentum: full rate for the first 3 tasks, +12.5% a task after, double from the 11th (Cal, 2026-11-08) |
| Level up | 100 + 10 x level, paid once per level |
| Wheel (level 6+) | about 230 a day |
| Dungeons, 3 a day | 40 to 70 each at the start, 280 to 380 at the top. Scaled down by quest effort |
| Trophies | 250 each |
| Streak chests | chest XP x 5 |
| Weekly workout bonus | at least 250 XP and 3,000 coins, growing with the level cost |
| Restaurant | 15 an hour at the start, about 240 an hour fully upgraded |

All 514 room upgrades cost 381,500 coins. A 12-task, 200 XP day at level 20 now earns about 2,100 from tasks before rooms and extras (was about 600), a busy 450 XP day several thousand.

## Prices

Cal's rule: a task pays about 50 coins, a good day about 1,000, and each upgrade should fit inside
one day unless it is a huge moment. `app/src/29_prices.js` sets them:

| What | Coins |
| --- | --- |
| Small things, decor, menus | 200, all the same |
| Normal equipment and furniture | 400, all the same |
| Big single pieces | 800, all the same |
| Moments that change a room (expansions, new rooms) | 1,000 to 4,000 |
| Brand clothes | 600 to 1,700 |
| Interface items and buffs | 1,000 to 2,500 at most |

Room upgrades have no level locks (Cal, 2026-11-05): each room shows its next 4, the 4th a mystery, and coins pace them.
Rooms later in the story cost more (`ROOMSTEP` in `29_prices.js`: Garden x1 up to the Club x6), because passive income and
dungeons pay more by then. Only an upgrade that opens a new room keeps a level until the story scenes open rooms instead.
A kitchen runs at full speed only after 3 quests that day (20% with none), so chores still drive
everything. Set `fp:1` on an upgrade to keep its price exactly as written.

## Testing

The Shop's Testing row has Add 10,000 coins and Level up. Remove that row and the
`window.__qb` hook before release.
