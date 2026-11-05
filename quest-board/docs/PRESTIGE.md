# The endgame and prestige worlds (Cal, 2026-11-05)

For a much later build, "once we have everything ready". Nothing here is built yet. LEAD owns this plan.

## The pacing it rests on

- A serious player (about 950 XP a day of real tasks, every day) reaches level 100 in about 50 days. Playing every other day
  doubles that, which is fine: "not everybody is going to be playing every single day."
- Every room upgrade can be bought by about level 80 (day 37 for a serious player, about day 83 for a regular one). QA tunes
  prices to this; `ECON` in `29e_economy.js` holds the numbers.
- Levels 80 to 90 are for finishing the town. Levels 90 to 100 are the artifact.

| Level | Total XP | Serious player (950 a day) | Regular player (420 a day) |
|---|---|---|---|
| 80 | 34,738 | day 37 | day 83 |
| 90 | 40,738 | day 43 | day 97 |
| 100 | 46,738 | day 49 | day 111 |

## Levels 90 to 100: the artifact

Cal: "At lvl 90, you stumble upon an ancient 10 piece artifact. You don't know what it does yet but each lvl, 91, 92, 93,
etc, you end up finding another piece of this stone. Once you hit lvl 100, you find the final piece and a portal opens up,
beckoning you to enter."

- At level 90 a special quest appears and completes itself as you level: one stone fragment for each level from 90 to 100,
  ten in all.
- Each fragment arrives with a short line of its own and shows in the Relics tab, assembling piece by piece. The player does
  not learn what it is until the last one.
- Level 100: the last piece, and a portal opens. Two choices: **Enter** or **Come back later**. Coming back later leaves the
  portal waiting in the building view.

## Prestige: a new world

Cal: "Entering it starts your level at 1 but with a prestige star next to it."

- Level 1 again, with a prestige star beside the level (prestige 1, then 2, and so on).
- A new world: a new Loft, new room upgrades, other buildings locked, a slightly different building view.
- A new currency for that world.
- New characters and a new story: they have heard what you did in the human world and want your help to save theirs.
- The same structure as the base game: a restaurant and everything that follows it, rebuilt in that world's style.
- Themes Cal named: cyberpunk, alien, horror.
- Art: made from the current assets as reference, with the prompts changed to fit the world. Everything already has a
  placement, so a world is mostly new paintings in the same slots.

## Decided (Cal, 2026-11-05)

- Clothes, relics and classes carry over into a new world.
- Each new world adds more class options of its own, which change how you progress there.

## Open questions for later

- Do trophies and team members carry over?
- Can a player go back to the human world, and does it keep earning?
- Does the prestige star give a lasting bonus?
