# Economy

What a player earns and what things cost. The aim: something worth buying every day or
two early on, bigger goals later, and about a year of play to reach the top.

## XP and levels

Cal, 2026-11-05 (`docs/PROGRESSION.md`): level L to L+1 costs `min(600, 50 + 6L + 0.2L²)` XP (`cum` in `30_app_b.js`).
At 200 XP a day (about a dozen ordinary tasks): level 10 on day 4, 20 on day 13, 30 on day 29, 50 on day 84, 100 in about
eight months; busy 450 XP days roughly halve that. No level ever takes more than about three normal days. Saves from the old
curve keep their level and their progress through it (`xpc2` in `merge`).

Quest XP stays on the 5 to 100 scale. Honor system on a 50+ XP task pays half, photo proof
on 25+ XP pays 2x (a live camera photo; Cal doubled it 2026-11-05 so proof is always worth taking), a streak adds up to 30%, and combos, bounties and crits stack on top
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

Room upgrades have no level locks (Cal, 2026-11-05): each room shows its next 4, the 4th a mystery, and coins pace them.
Rooms later in the story cost more (`ROOMSTEP` in `29_prices.js`: Garden x1 up to the Club x6), because passive income and
dungeons pay more by then. Only an upgrade that opens a new room keeps a level until the story scenes open rooms instead.
A kitchen runs at full speed only after 3 quests that day (20% with none), so chores still drive
everything. Set `fp:1` on an upgrade to keep its price exactly as written.

## Testing

The Shop's Testing row has Add 10,000 coins and Level up. Remove that row and the
`window.__qb` hook before release.
