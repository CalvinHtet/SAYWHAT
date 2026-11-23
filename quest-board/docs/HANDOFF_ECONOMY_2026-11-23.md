# Handoff to LEAD: economy tightening (from a cloud chat, 2026-11-23)

Read `CLAUDE.md`, `TEAMWORK.md`, `docs/TASKS.md` and `docs/HANDOFF.md` first, as usual. This note covers one job: the
economy work a cloud chat did on branch `claude/wizardly-hopper-sp10lg`. **It is not on main and not live.**

## What Cal asked for

- 2026-11-22: "the money scaling is too fast ... There is too many things that give coins, so I am basically able to buy
  the entire shop right now. Can you make things a tiny more expensive? Maybe 10-15%."
- 2026-11-23: "cap momentum to 1.5x and 15% increase. **I don't want them to be able to have nothing to purchase by day
  25. I want each upgrade to feel earned.**"

The bold line is the goal. The two levers Cal named **do not reach it on their own** (sim results below).

## What is on the branch (2 commits on top of main f545e3b)

| Commit | Change | Files |
| --- | --- | --- |
| 85b97b9 | Every coin price x1.15 | new `app/src/29z_pricek.js`; notes in `docs/ECONOMY.md` and `docs/TASKS.md` |
| d45b19f | Quest-coin momentum capped at 1.5x (was 2x) | one line in `app/src/10_app_a.js` (`coinMomentum`, new `MOMENTUM_MAX=.5`); `docs/ECONOMY.md` |

**Prices (`29z_pricek.js`).** One dial, `PRICEK=1.15`. It runs once at load, after every other price rule
(`29_prices.js`, `29e_economy.js`, `29i_garden.js`), so the tiers keep their shape. The file sorts after `29p` and
before `30_app_b.js`. It covers `SHOP` (clothes, basics, interface, buffs), `ROOMT[*].cost`, `ADDONS[*][2]`,
`LFDS[*].cost`, `CREWHIRE`, and the fallback Industrial and Modern decor sets: `lfDecSets` is wrapped because
`20_loft.js` builds those fresh on every call. Rounding is to 10 below 1,000 and to 50 from 1,000 up. So small things
go 200 → 230, normal 400 → 460, big 800 → 920. Free things stay free. The 150-coin repaint in `30_app_b.js` is unchanged.
`PRICEK=1` undoes all of it.

**Momentum (`10_app_a.js`, LEAD's file).** The ramp is the same (full rate for 3 tasks, then +12.5% a task); it only
stops at +50%, reached on the 7th task. The "On a roll +N%" pop reads it. This was a one-line fix under TEAMWORK rule 2.

## What was checked (headless Chromium in a cloud container, not a phone)

- Price diff, old build against new: all 946 priced things went up 10–20%, 15% overall. Nothing was raised twice,
  free stayed free, and there were 0 page errors.
- `rigtest/browser/savecheck.js`: 37/37 on the +15% build, and 37/37 again on the +15% + cap build.
- `rigtest/qa/sim.js regular 30`, four runs, all with 0 page errors. Each run uses its own build: current main, and
  main with the changes listed in the table.

## Sim results: `sim.js regular 30` (12 tasks a day, 2 photo proofs, 4 workouts a week)

| Build | First day with nothing to buy | Days with nothing to buy (of 30) | Every upgrade bought | Unspent coins, day 25 / day 30 |
| --- | --- | --- | --- | --- |
| main (no change) | day 13 | 18 | day 25 | 88,217 / 206,921 |
| +15% prices | day 14 | 17 | day 25 | 33,454 / 152,135 |
| **+15% and 1.5x cap (what is on the branch)** | **day 16** | **15** | **day 26** | 14,539 / 120,582 |
| +15%, 1.5x cap, and tasks pay 4 coins an XP instead of 6 | day 21 | **1** | not by day 30 (380 of 381) | 948 / 4,995 |

Why the cap barely helps: quest coins on days 21–30 only drop from about 10,900 a day to 10,350. The faucet is
`coinsFor` (`10_app_a.js`): XP x 6 x (1% per level) x momentum, on XP that photo proof (2x), streak (+30%), crits and
combos have already inflated. The sim's "regular" player makes 570–1,500 XP a day, not the 200 ECONOMY.md plans for. Rooms
pay out a share of quest coins, so trimming quest coins trims room pay too.

## WAITING ON CAL: the lever that reaches his goal

Change `xp*6` to `xp*4` in `coinsFor` (`10_app_a.js`, the line right after `coinMomentum`). That is the fourth row of the
table: one day in 30 with nothing to buy, coins never pile up, and the last upgrade is still waiting on day 30. It was
simulated in a scratch copy only. **It is not on the branch, because Cal set 6 coins an XP himself in v0.79.** Do it only
once Cal says yes, then update the Quests row in ECONOMY.md.

## What LEAD should do

1. `git fetch origin claude/wizardly-hopper-sp10lg` and merge it into main. Expect conflicts only in `docs/TASKS.md`
   (the cloud chat added a block at the end of "Requests for LEAD") and possibly `docs/ECONOMY.md`. Keep both sides.
2. If Cal says yes to 4 coins an XP: make that one-line change, then commit.
3. Rerun `sim.js` for **casual and grinder** too. Only `regular` was run, and a grinder will run out of things to buy
   sooner. Cal's target for every player type: nothing-to-buy days near zero before day 25.
4. Have QA look at the Shop, a room window and the Construction list by eye at phone size: are the new prices
   readable, does nothing overflow, does "need N more" read right?
5. Publish only when Cal asks, by the usual rules. Cut from main (every Live cut must include 59d6698), and read Live's
   `version.txt` before deploying.
6. Docs: ECONOMY.md still says "All 514 room upgrades cost 381,500 coins" and "a 12-task day ... earns about 2,100".
   Both are stale: the sim counts 381 upgrades on offer by day 30, and real task pay is 7,000–12,000 a day. Rewrite those
   lines once the faucet is settled.

## Not checked

A real phone. Any screen by eye. The casual and grinder sims. Real Firestore with two players. How a save mid-game feels
when prices jump 15% overnight. Every save keeps its coins and purchases (savecheck), but anything not yet bought now
costs more.
