# DRAFT for LEAD (not sent; waiting on Cal's answers): level pace, Room Bonus, Gym Pact

From ARCHITECT, Cal's request 2026-11-10. Three parts; ship 1 and 2 together (they share one econsim tuning run), 3 can go alone.

## 1. Level pace (Cal: "I dont want it to reach lvl 100 by day 20 ... 40 days for the active player ... 6 months" = someone doing 3 quests a day)
- Problem: the curve cannot hit both targets. Today L100 = 13,905 XP. Cal's routine ~700 real XP/day (day 20); a 3-quest-a-day
  player is roughly 60-80 real XP/day (estimate, not measured), which already lands near day 180 on today's curve. Raising the
  curve to slow Cal would push that player to 10+ months.
- Fix: keep the curve. Add a daily taper: the first ECON.xpFresh (start 150) real quest+Training XP of each game day count in
  full, everything above counts ECON.xpTaper (start 30%). Coins are NOT tapered (they pay on listed XP), so doing more chores
  still pays more and builds rooms faster. Rested XP and the Weekly level stay outside the taper.
- Show it honestly: a "Fresh XP" bar on the profile/Daily Quest line ("Fresh XP 150/150, extra XP counts 30% today").
- Rough math: Cal 150 + 550 x .3 = 315/day, x1.12 Room Bonus = ~353 -> L100 ~day 39-40. Tune both numbers in econsim.
- Story gates use levels (ECON.stepLv), so rooms open later for heavy players: check the econsim room days still feel OK.

## 2. Room Bonus (Cal: tiny buffs per asset, "each room should have some stats ... passive buff ... fully decked out room")
- Today: only the Game Room (xpBase 2) and Patio give XP, .5/1/2% per upgrade by price (autoRoom 27_rooms.js:18), in the
  50%-capped crewPct pool. Bedroom/Closet nothing. Business rooms give income via `p`. Lair +0.5% crawl find each.
- New: every Loft room has the same max: Bedroom "Rested", Closet "Ready", Game Room, Patio: +3% XP each when fully upgraded
  (Home max +12%), split across that room's upgrades by price (a 7-upgrade Closet and a 35-upgrade Bedroom both cap at 3%).
  Its own pool, applied AFTER the taper so it is felt. Replaces the Game Room/Patio per-upgrade xp (a nerf for anyone who owns
  them; few do since the v0.86 reset). Lair keeps crawl odds; businesses keep income.
- Each upgrade card shows its share ("+0.2% XP"). Each room view gets a stat panel: Loft rooms "Rested +1.8% XP (14/35, max
  +3%)"; businesses coins/h, today's town efficiency, payout share, upgrades owned. A quest toast and the profile show "Rooms
  today: +N XP" so the passives visibly do something.
- Upgrade counts (live): closet 7, rooftop 10, lair 11, vr 11 are thin. Floor of ~15 per room needs ~25 new sprites:
  ROOMS request, Cal's Chrome only. Not blocking: the bonus math works with any count.

## 3. Gym Pact (Cal: "betting each other to see who can go to the gym for 4 days this week")
- A new kind in 29w_duel.js next to Productivity/Fitness. Two players, same stake (DL.stakes 100-2,500), 7 days from accept,
  goal 4 workout days (offer 3/4/5).
- A workout day = one game day (5 am) with a full Training session or a photo-proven workout quest: the same count Weekly
  Warrior uses (30_app_b.js:351), so honor taps do not count.
- Payout (Cal): both make it -> each gets stake x1.5 (the extra 50% is new coins). One makes it -> they get 2 x stake, the
  other 0. Both miss -> see open question.
- Each player's game settles itself from both docs, as duels do now; each side shows "you 3/4, Sam 2/4" with day dots.
- Economy: worst case +1,250 new coins a week per player at the top stake, less than Weekly Warrior's 3,000. Fine.

## Acceptance checks
- econsim: cal profile L100 day 38-42 with full Room Bonus; a new "three" profile (3 quests a day, every day) day 170-190;
  casual reported. Coins per day unchanged within 5% for every profile.
- Fresh XP bar matches the XP actually paid; undo of a quest gives back the right tapered amount.
- Every Loft room fully upgraded = exactly +3%; partial matches the sum shown on its cards; panel numbers match payouts.
- Gym Pact: both make it, one makes it (each side), both miss, declined, cancelled, unanswered; a day with two workouts
  counts once; an honor tap does not count; stakes held and returned like duels.
- Shown on a phone-width screen; VOICE.md wording.

## Open questions for Cal
- Gym Pact, both miss: both lose their stake (a real sting) or both get it back?
- Does a walk or run (your own workout) count as a gym day, or only gym plans?
- Groups later (3+ friends, the ones who make it split the pot)?
