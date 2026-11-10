# SPEC 8 for LEAD (from ARCHITECT, Cal 2026-11-10 ~13:20): focused unlocks + building quest log

Cal's words in quotes. Replaces W25's "level + coins since the last story room + a new game day" for story rooms, and the fixed
"N upgrades of room X" story gates. Suggest v0.91 (do not hold v0.90 / w-econ2 for it).

Cal: "Instead of just waiting a day, perhaps we can lock the next rooms based off of number of upgrades. The garden can be unlocked if
you have unlocked a certain percentage of the loft's rooms. Then the restaurant unlocks after a certain number of produce has been
sold. Then the bar comes after the restaurant turns into a noir upgrade. Once the restaurant makes a certain more money and hits a
next milestone, then the boba shop can open next door, then after that is successful, the dessert parlor opens." "garden at 50% of
Loft upgrades." "my concern is that when too many things are open, there is too much to do with not much of the previous tiers
completed. by capping the amount of features, it allows more focus in the beginning and then the next expansion makes more sense ...
the experience of having the mall be an option to upgrade when I barely have any upgrades in the boba shop or lock and key."
"there should be a goal or quest log in the building view such as fully upgraded the bedroom which gives you a little bit of
experience and some coins as a reward."

## 1. The focus rule (one rule for every room and building)
A new room or building opens only when BOTH:
- its story trigger is met (below), and
- every room the player already has in the current building is at least HALF upgraded (ECON.focusMin 0.5, live upgrades only).
Plus the level floor the room has today (keep levels; DROP the "new game day" wait).
So the Mall never opens while Boba or Lock and Key is barely started, and only one new thing opens at a time.

## 2. Story triggers (Kode Plaza; Cal's order, the bar moves before Boba)
| Room | Trigger |
|---|---|
| Garden | 50% of all Loft upgrades bought (Cal) |
| Restaurant | produce sold (today 12) |
| Lock and Key | the Restaurant goes Noir (styNoir); no longer waits for Dessert |
| Boba | the Restaurant earns a coin milestone since it opened (start ~20,000; econsim tunes; shown as "12,400 of 20,000") |
| Dessert | Boba upgrades (today 4) |
| Rooftop | Lock and Key upgrades (today 6) |
| Mall | the focus rule: every Kode Plaza room at least half upgraded (+ its level floor). Replaces "rooftop + coins earned". |
| Theater and later | keep their current triggers (N upgrades of the previous room) plus the focus rule inside the Mall building |
- Lock and Key now comes before Boba and Dessert: swap their ECON.phase values so prices match when each is reached; rerun econsim.
- Desmond's scene already says "Once the Restaurant goes Noir"; check the beat order in 29b_story.js still reads right.

## 3. Building quest log (in the building view)
- A "Goals" button/panel on the building view: one list per building, done goals ticked.
- Goals: each room "half upgraded" and "fully upgraded"; each story trigger ("Sell 12 produce", "Take the Restaurant Noir", "Earn
  20,000 in the Restaurant"); "Open the Mall" etc.
- Rewards (starting values in ECON, econsim checks): half upgraded 400 coins x room phase + 50 XP; fully upgraded 1,200 coins x room
  phase + 150 XP; story goals 300 coins x phase + 50 XP. Paid once, claimed with a tap (a small chest like the Daily Quest).
- The top unfinished goal shows as a one-line "Next goal" on the building view (Cal's constant progression), e.g. "Lock and Key: 2
  more upgrades to half". NO SPOILERS (Cal 13:50: "i don't like 'then the mall'"): never name what it opens; at most "Something new
  is waiting".
- A locked room's card shows its triggers with progress (W25's card, now with these triggers).

## 4. Room Bonus / panels stay
The room window's "x of y upgrades" line also shows "half" and "full" marks.

## Economy
Goal rewards total roughly 100k coins over a full run (about 7% of all upgrade spend) and ~5,000 XP: econsim with them on.

## Acceptance checks
- Garden opens at exactly 50% of Loft upgrades (and its level floor), not before.
- With Boba below half, the Mall never opens even with everything else met; at half it opens.
- Lock and Key opens on Noir without Dessert; Boba on the Restaurant milestone; no day wait anywhere.
- Each goal pays once; reload does not repay; the Next goal line always names a reachable step.
- Old saves: rooms already open stay open; goals already met are claimable once (no flood: claim, not auto-pay).
