# SPEC for LEAD (from ARCHITECT, Cal approved 2026-11-10): levels, Daily Quest chests, Room Bonus, Gym Pact; Mystic Shop noted for later

Cal's words in quotes. ARCHITECT's numbers are starting points for econsim, not measured. Supersedes the draft
`2026-11-10_levels_rooms_gympact.md` (the "fresh / tired XP" taper is DROPPED by Cal).

Resolves the w-econ hold: Cal's new words match W21 (L40 ~day 14, L100 ~day 90 for his routine). Parts A, B, C belong in
w-econ (W21/W22/W25). Part D is its own branch after w-hall merges (same Hall area as 29w_duel.js). Part E is for later.

## A. Level curve: ramp it (W21)
Cal: "The leveling should definitely ramp up more. I think 1 level a day if you are active is pretty good ... people can say
they did dishes or took their dog out or cleaned out their car and this could easily be 300 experience that day. Instead of the
tired and fresh exp, I think we just ramp up the exp required to level up. The last few levels ... should take a day or 2 or
even 3 to level up."
- Today `lvNeed` (30_app_b.js:1011) is flat after level 6 (135 -> 154). Replace with a ramp. Starting point (fitted to W21):
  levels 1-5 as now (20, 43, 66, 89, 112), then `need(L) = 135 + 4.04 x (L-6)^1.25`:
  L10 157, L20 244, L30 349, L40 466, L50 592, L60 726, L70 866, L80 1,011, L90 1,162, L99 1,301.
  Total to L40 ~9,800; to L100 ~61,800 (today 13,905). Put the constants in ECON.
- Expected (constant XP a day, before Room Bonus): Cal's routine (~700 real XP/day): L40 ~day 14, L60 ~day 32, L100 ~day 88.
  An active ~400/day player: about 1 level a day in the 20s-30s, L100 ~day 155. A 3-quests-a-day friend (~80-120/day): about
  level 45-60 after 6 months. Cal was told this.
- Renown past 100 uses lvNeed(MAXL): check it still makes sense with the bigger number.
- Fewer level-ups means fewer level-up coins (50 + 5 x level): econsim shows the effect; adjust lvPay if coins drop >5%.
- Story/room level gates (ECON.stepLv, W25) move with the curve: check room days in econsim.
- Existing saves: as W21 already says (keep level, same fraction of it).

## B. Daily Quest chests (Cal)
- 100 XP: the main Daily Quest reward. 150 XP: a medium chest. 200 XP: "400 coins plus a random low tier relic, or cosmetic item
  from any brand in the shop but preferably accessories. Possible to get other ones, but much lower drop rate."
- Suggested coins: 100 -> 250, 150 -> 250, 200 -> 400 (today 800 over 4 chests; this keeps ~900). INT bonus as today.
- 200 chest item (every time, Cal's ask): an item the player does not own, from brands that have already dropped for them
  (keeps the every-3-days drop schedule): ~85% accessories, ~12% other clothing, ~3% a Trophy Room or Hollow Amulet piece
  only if the Hero's Lair is built (that counts toward the crawl pity, it does not add new pieces). There is no droppable
  "low tier relic" today (relics are milestone tiers, DGRELICS 29d_dungeon.js:116): ARCHITECT's stand-in, ask Cal if he wants
  a new item kind. Owns everything in the pool -> 150 coins.
- ARCHITECT's concern, told to Cal: a guaranteed item a day may undercut Shop spending (W6's wheel slivers add more free
  cosmetics). QA reports free pieces by day 30/60/90 and Shop clothes spend before/after. Fallback if it collapses: a 50% roll.
- dqGoal also drives town efficiency (100% at goal, 150% at 2x, dqEff 29e_economy.js:86): a goal of 100 makes full business
  efficiency easier, so passive income rises. Keep efficiency on its own 150-XP number or check W21's 30% passive cap.
- The hidden quest fires at 2x goal: with goal 100 that is 200, the same as the big chest. Move it to 300.

## C. Room Bonus: passives you can feel (W21)
Cal: "some assets should provide a buff but very miniscule ... a new bed would increase your productivity by 0.2% exp gain
... each room should have some stats on the screen that show you how much passive buff increase is provided by that fully
decked out room." Later: "feel like the passives in the room are doing something".
- Every Loft room (Bedroom "Rested", Closet, Game Room, Patio) gives at most +3% XP fully upgraded (+12% for the Loft), split
  across its upgrades by price, so a 7-upgrade room and a 35-upgrade room both cap at 3%. Its own pool (not the 50% crewPct
  pool). Replaces the Game Room / Patio per-upgrade `xp` (autoRoom 27_rooms.js:18). Lair keeps crawl odds; businesses
  keep income. XP only: coins pay on listed XP, so this does not inflate coins. Include it in the curve tuning (A).
- Each upgrade card shows its share ("+0.2% XP"). Each room view gets a stat panel: Loft rooms "Rested +1.8% XP (14/35, max
  +3%)"; businesses coins/h, today's town efficiency, payout share, upgrades owned. Today the room shows one number
  (lfRoomLabel 20_loft.js:1192). Profile and quest toast: "Rooms today: +N XP".
- Prices: Cal: "upgrades later on cost more money. IMAX project and a bigger theater is definitely worth more than a painting."
  Already so (decor 200 x phase vs IMAX Projector 3,000, Screen 6,000; econPrice), but W21 reprices: keep big moments clearly
  above decor, and late rooms above early ones.
- Thin rooms (live upgrades): Closet 7, Rooftop 10, Lair 11, VR 11 (Restaurant 60, Garden 42). A floor of ~15 needs about 25
  new sprites: art list for the Mac, not blocking.

## D. Gym Pact (own branch after w-hall; 29w_duel.js)
Cal: "betting each other to see who can go to the gym for 4 days this week ... Both people put in the challenge amount. If you
both go, you get the amount back plus an extra 50%. If one of you loses, you give that other person your coins that you put in
(2 x what you put in)." "If both lose, then both lose their stake." "A run or walk or anything active counts as a gym day."
- A new kind next to Productivity/Fitness. Two players, same stake (DL.stakes), 7 days from accept, goal 4 active days
  (offer 3/4/5).
- An active day = a game day (5 am) with a Training session done in full (gym plan or own workout: run, walk, sport) or a
  photo-proven workout quest. Same counting as Weekly Warrior. Honor taps do not count. Two in a day count once.
- Both make it: each gets stake x 1.5. One makes it: they get 2 x stake, the other 0. Both miss: both lose their stake (a sink).
- Each game settles itself from both docs, as duels do; both sides show "you 3/4, Sam 2/4" with day dots.
- Economy: at most +1,250 new coins a week per player at the top stake; less than Weekly Warrior's 3,000.

## E. LATER, NOT NOW: Mystic Shop at level 60 (note only, no build)
Cal: "At level 60 I would like there to a mystic shop that opens that has really stylized and high quality clothes. Perhaps even
special assets for the rooms that are already built ... the shop can have clothes and upgrades. The upgrades could be a lucky
cat figurine (the one with the paw the moves by itself and is gold) and you can place these in areas that make money to
increase the gold gain by 15%. But of course upgrades later on cost more money."
- Fits W22's level-90 items. All art from the Mac (Chrome, Unlimited): clothes, room assets, a gold waving-paw cat (original
  design; animate the paw in code). +15% applies to business income only and counts toward W21's 30% passive cap.
  L60 lands ~day 32 for Cal, ~day 56 for an active player.

## Acceptance checks (QA)
- econsim before/after, profiles cal, regular, casual, grinder and a new "three" (3 quests a day, every day): L40 and L100 days,
  coins per day by source week by week, passive share, free cosmetics count, Shop spend. Targets: cal L40 day 13-16, L100 day
  85-95 with Room Bonus.
- lvNeed table matches the spec; an old save keeps its level and fraction; renown works past 100.
- Chests open at 100/150/200 once a day each; the 200 item respects the brand drop schedule and never repeats an owned item;
  undo below a tier takes its chest back as today; hidden quest at 300.
- Room Bonus: each Loft room fully upgraded = +3.0%; partial = sum of its cards; panel numbers match payouts.
- Gym Pact: both make it, one makes it (each side), both miss, declined, cancelled, unanswered; honor taps ignored; a run
  counts; two sessions in a day count once; stakes held and paid like duels.
- Phone width (390x844), VOICE.md wording.
