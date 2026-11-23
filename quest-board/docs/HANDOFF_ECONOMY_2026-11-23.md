# Handoff to LEAD: tightening the economy (from a cloud chat, 2026-11-23)

Read `CLAUDE.md`, `TEAMWORK.md`, `docs/TASKS.md` and `docs/HANDOFF.md` first, as usual. This note covers one job: the
economy work on branch `claude/wizardly-hopper-sp10lg`. **That work is not on main and not live.** Part 1 is done and
simulated. Part 2 is Cal's target, which still needs building.

## Cal's words

- 2026-11-22: "the money scaling is too fast ... There is too many things that give coins, so I am basically able to buy
  the entire shop right now. Can you make things a tiny more expensive? Maybe 10-15%."
- 2026-11-23: "cap momentum to 1.5x and 15% increase. I don't want them to be able to have nothing to purchase by day 25.
  I want each upgrade to feel earned."
- 2026-11-23: "Photo proof 2x to 1.5x, and 1% bonus per level. **1000 coins is a moderate day. You should still be able to
  purchase most things after a full day of activities. And there should still be expensive things that take a few days so
  even heavy players like myself have something to save for.**"

## Cal's targets (the yardstick for every change)

1. **Nothing to buy: never before day 25**, for any player type, including heavy players like Cal.
2. **A moderate day earns about 1,000 coins.**
3. **A full day of activities buys most things.** The median price is now 800 and 90% cost 1,700 or less, so a full day
   should land around 2,000 to 2,500.
4. **Expensive goals take a heavy player a few days.** If a heavy day is about 4,000 to 5,000, that means about 12,000 to
   20,000 each.

## Part 1: done (branch `claude/wizardly-hopper-sp10lg`, commits on top of main f545e3b)

| Commit | Change | Where |
| --- | --- | --- |
| 85b97b9 | Every coin price x1.15 | new `app/src/29z_pricek.js` (`PRICEK=1.15`) |
| d45b19f | Quest-coin momentum stops at 1.5x, reached on the 7th task (was 2x from the 11th) | `10_app_a.js`, `MOMENTUM_MAX=.5` |
| 32a110d | Photo proof pays 1.5x (was 2x; the verify special still adds 0.1) | `10_app_a.js` `PROOFX=1.5`, read in `mults` (`30_app_b.js`) |
| 32a110d | Task coins no longer grow 1% a level | `10_app_a.js` `COINLV=0` in `coinsFor` |

Plus docs: `docs/ECONOMY.md` (the Quests row, photo proof, a PRICEK note), `docs/TASKS.md` (a block at the end of
"Requests for LEAD"), and this file. Two edits touch LEAD's files (`10_app_a.js`, `30_app_b.js`), each a line or two
(TEAMWORK rule 2).

**How the price dial works.** `29z_pricek.js` runs once at load, after every other price rule (`29_prices.js`,
`29e_economy.js`, `29i_garden.js`). It sorts after `29p` and before `30_app_b.js`, so the tiers keep their shape. It covers
`SHOP`, `ROOMT[*].cost`, `ADDONS[*][2]`, `LFDS[*].cost`, `CREWHIRE`, and the Industrial and Modern decor sets
(`lfDecSets` is wrapped, because `20_loft.js` builds those fresh on every call). Rounding is to 10 below 1,000 and to 50
from 1,000 up. Free things stay free, and the 150-coin repaint is unchanged. `PRICEK=1` undoes it.

**Not changed:** 6 coins an XP; mission coins still grow 1% a level (`ECON.mcoinLv`). Cal's "1% bonus per level" was
read as the task-coin bonus, so ask him whether he meant missions too.

### Checked (headless Chromium in a cloud container)

- Price diff, old build against new: all 946 priced things went up 10–20%, 15% overall. Nothing was raised twice, free
  stayed free, 0 page errors.
- `rigtest/browser/savecheck.js` 37/37 on each step's build, final build included.
- `rigtest/qa/sim.js`, 30 days, regular (12 tasks a day) and grinder (20 tasks a day), 0 page errors in every run.

### Sim results

| Build | Player | First day with nothing to buy | Days with nothing to buy (of 30) | Everything bought | All coins a day, days 1–10 / 21–30 | Unspent on day 30 |
| --- | --- | --- | --- | --- | --- | --- |
| main (f545e3b) | regular | day 13 | 18 | day 25 | 10,163 / 22,107 | 206,921 |
| +15% and 1.5x momentum | regular | day 16 | 15 | day 26 | 8,730 / 22,088 | 120,582 |
| **branch (all of Part 1)** | **regular** | **day 21** | **1** | **not by day 30** | **6,726 / 13,973** | **1,568** |
| main (f545e3b) | grinder | day 4 | 27 | day 21 | 37,842 / 79,306 | 1,503,062 |
| **branch (all of Part 1)** | **grinder** | **day 9** | **22** | **day 22** | **18,977 / 32,833** | **450,875** |

Against Cal's targets: **the regular player now passes target 1** (one day with nothing to buy). **The grinder, which is
how Cal plays, fails it badly.** **Target 2 is far off for both:** a regular day still earns about 7x a "moderate"
1,000, and the gap doubles over the first month as rooms and missions grow.

### Where the branch's coins come from (all sources, per day)

| Player, days | Tasks | Rooms | Missions | Level-ups | Weekly | Daily Quest chest | Garden produce | Other | Total |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| regular, days 1–10 | 3,731 | 596 | 0 | 664 | 336 | 418 | 307 | 672 | 6,726 |
| regular, days 21–30 | 6,012 | 2,644 | 1,615 | 820 | 960 | 787 | 688 | 443 | 13,973 |
| grinder, days 1–10 | 11,786 | 1,793 | 1,320 | 1,533 | 626 | 866 | 461 | 588 | 18,977 |
| grinder, days 21–30 | 16,145 | 6,304 | 4,387 | 2,310 | 960 | 1,612 | 675 | 437 | 32,833 |

"Other" is the wheel, training and trophies. Tasks are 45–60% of the total. Rooms and missions grow from about 10% to
about 30% as the town fills out.

XP runs just as hot. The regular player makes 510–840 XP a day, against the 200 that `docs/PROGRESSION.md` plans for,
because streaks, combos, crits, bounties and proof all multiply it. The grinder hits level 100 by day 30; Cal's plan is
"level 100 in about 50 days for a serious player". **Coins follow XP, so the XP multipliers are part of the coin
problem.**

## Part 2: to do (LEAD), reach Cal's targets

The aim is about 5x fewer coins a day, and the growth over the month flattened. Suggested order, each step checked with
`sim.js` for casual, regular and grinder:

1. **Coins per task XP: 6 down to about 1.5.** With proof and momentum as they are now, that puts a regular day's task
   coins near 1,000 to 1,500. Rooms pay a share of task coins, so they drop with it. Check `ECON.chest` (Daily Quest
   chest = goal x 2.5) at the same time.
2. **Fixed sources that do not follow task coins:** level-up pay (100 + 10 x level), the weekly workout bonus (at least
   3,000, three moderate days on its own), mission coins (`28_missions.js` `msPay`, `ECON.mcoinLv`), Garden produce,
   training (`ECON.trainCoins` 300), trophies (250), the wheel. Scale them to the new day. One earn dial like `PRICEK`
   would keep it to one number; adding one means changing every `S.coins+=`, so list them first.
3. **A savings tier for heavy players (target 4).** Only 21 of 946 things cost over 3,000. The top ones are the Dojo room
   13,800, Spa 12,650, Sky 10,350, IMAX Screen 7,450, Sprinklers 6,900, VR Arena 5,400. Pick about 10 to 20 moments
   (room openings, signature upgrades) and set them at 3 to 5 heavy days. Use `PRICE_HUGE` or `fp:1` in `29_prices.js`;
   `29z_pricek.js` still adds 15% on top.
4. **Optional, ask Cal first:** the XP multipliers (streak cap, combo up to 1.5x, bounty 2x, crit 1.5x, Monarch) and the
   level curve, so levels and story gates (`ECON.stepLv`) stop racing ahead of coins.
5. **Pass means:** no day with nothing to buy before day 25 for all three players; a 6-task day about 1,000, a 12-task day
   about 2,000 to 2,500; the savings tier takes a grinder 3 to 5 days each; unspent coins never pile up.
6. Then rewrite ECONOMY.md's stale lines ("All 514 room upgrades cost 381,500 coins", "a 12-task, 200 XP day ... about
   2,100") with the new numbers.

## Merging and publishing

1. `git fetch origin claude/wizardly-hopper-sp10lg`, then merge it into main. Expect conflicts only in `docs/TASKS.md`
   and maybe `docs/ECONOMY.md`; keep both sides.
2. Part 1 can ship alone. It already fixes the regular player, and nothing in Part 2 depends on it being held back.
3. Publish only when Cal asks, by the usual rules. Cut from main (every Live cut must include 59d6698), and read Live's
   `version.txt` before deploying. Ask QA to look at the Shop, a room window and Construction by eye at phone size.

## Not checked

A real phone. Any screen by eye. The casual sim. Real Firestore with two players. A mid-game save keeps its coins and
purchases (savecheck), but anything not yet bought now costs 15% more, and tasks pay less from the next one on.
