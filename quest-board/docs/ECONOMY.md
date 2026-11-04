# Economy

What a player earns and what things cost. The aim: something worth buying every day or
two early on, bigger goals later, and about a year of play to reach the top.

## XP and levels

`cum(L)` in `app/src/30_app_b.js` is the XP needed to reach a level. Early levels cost
100 XP each. By level 50 a level costs about 575 XP, and by level 100 about 1,950 XP.

At 200 XP a day, which is roughly a dozen ordinary tasks:

| Level | Day reached | Coins earned so far |
| --- | --- | --- |
| 5 | 2 | 1,800 |
| 8 (Restaurant) | 3 | 3,000 |
| 10 | 4 | 4,400 |
| 20 | 11 | 14,700 |
| 30 | 21 | 31,000 |
| 50 | 60 | 104,000 |
| 80 | 192 | 394,000 |
| 100 | 352 | 760,000 |

Quest XP stays on the 5 to 100 scale. Honor system on a 50+ XP task pays half, photo proof
on 25+ XP pays 1.2x, a streak adds up to 30%, and combos, bounties and crits stack on top
as you rank up. Undoing a task takes back its XP, coins, combo step and, if the day falls
under 50 XP, that day's streak credit and any chest it opened.

## Coins

| Source | Amount |
| --- | --- |
| Quests | XP x 2.5, plus 1% per level, so level 100 pays twice as much per XP |
| Level up | 100 + 10 x level, paid once per level |
| Wheel (level 6+) | about 230 a day |
| Dungeons, 3 a day | 40 to 70 each at the start, 280 to 380 at the top. Scaled down by quest effort |
| Trophies | 250 each |
| Streak chests | chest XP x 5 |
| Weekly workout bonus | at least 250 XP and 625 coins, growing with the level cost |
| Restaurant | 15 an hour at the start, about 240 an hour fully upgraded |

A day comes to about 800 coins at level 5, 1,500 at level 20 and 2,300 at level 100.

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

Nothing should ever cost more than a few days of play. Level gates do the pacing, not prices.
A kitchen runs at full speed only after 3 quests that day (20% with none), so chores still drive
everything. Set `fp:1` on an upgrade to keep its price exactly as written.

## Testing

The Shop's Testing row has Add 10,000 coins and Level up. Remove that row and the
`window.__qb` hook before release.
