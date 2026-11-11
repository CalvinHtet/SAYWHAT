# SPEC 10 for LEAD (from ARCHITECT, Cal 2026-11-10 ~15:35): greetings final, weekly Town Boss, friends visiting your businesses

Cal's words in quotes. Defaults marked (D) are ARCHITECT's until Cal says otherwise.

## 0. Greetings (amends the 15:20 item)
Cal: "Just keep 4 greetings. keep the spank in." "keep the spank on. we're all good friends."
- Town Square greetings are exactly: wave, high five, poke, spank. Cheer and Hug go. No opt-out for spank. Pay unchanged.
- "Visit their Loft" removed (15:20 item stands).

## 1. Town Boss (weekly, everyone together)
Cal: "I love the idea of a town boss ... multiple different art phases that show it at full health, 75%, 50%, 25% and a dead carcass in
the town hall for 1 day once it has been slain. The boss can appear on Monday and its HP scales with how many people use the app. By
Saturday night at 11:59 PM, if we beat it, all of us receive a chest in our mail with prizes and loot for completing it. If we don't
beat it then there should be some sort of light punishment for the entire game. Sunday would show an animation of either the dead
boss lying there in our town hall picture, or the monster is still running rampant in our town hall and sets fire to everything."
- Schedule (Pacific, the game clock): appears Monday at the game day's start (5 am); fight ends Saturday 11:59 pm; Sunday is the
  result day; the next boss Monday.
- Shown on the Town Hall picture (Hall tab): the boss over the picture, an HP bar, "N players fighting", your own damage this week.
- Damage = real quest XP + Training XP each player earns Mon-Sat (the same numbers as the XP they get). (D) a player deals at most
  600 damage a day, so one grinder cannot solo it and everyone matters.
- HP (Cal 16:10): 800 x active players (opened the app on 3+ game days in the 7 days before Monday 5 am), at least 2 players worth. A
  regular week beats it with most people playing; tune with econsim's player types.
- Phases: art switches at 100% / 75% / 50% / 25% HP left.
- Win (HP 0 before Sat 11:59 pm): Sunday shows the carcass in the Town Hall for the day; every player who dealt any damage gets a
  letter with a chest (claim once): (D) coins ~ one day of their own quest coins, a relic roll (SPEC3 odds), an unowned accessory;
  the 3 biggest hitters get a second roll. Players with no damage get nothing.
- Lose (Cal 16:20: NO coin penalty): visual only until the next win: Town Hall in flames, cracked UI boxes (Mac art). OLD: (D) all businesses earn 10% less
  for the next week (the town is rebuilding), shown on business panels; lifted early if the next boss falls.
- Data: each player writes their own weekly damage into their own doc (like duel/kudos; no one writes another's); every phone sums
  them. Fine among friends, not cheat-proof (same as duels).
- Art (Cal's Mac): per boss 6 pictures, transparent, sized to the Town Hall picture: full, 75%, 50%, 25% (more wounded each time), the
  carcass, and the rampage with fire. Original monster designs. A rotation of 3-4 bosses to start. Until then: a drawn placeholder
  and CSS fire. Add to the Mac art list.
- No spoilers: next week's boss is never named before Monday.
- Size L. Economy: the chest ~ one day of quest coins a week; econsim with it on. Punishment -10% business for a week.

## 2. Friends visiting your businesses
Cal: "I like the idea of our characters all being a part of our towns. Make them sparse and not too often, but they could visit our
place and establishments and leave a little tip for us. These messages should not be letters in our inbox, but could be a little one
liner when we click inside the room that tells us who visited and what they did and then if they left a tip or just admired our
place. In the room view, I would like our character names to show up underneath the character that is visiting. Keep it balanced
though because I wouldn't want 8 people from the game in one room or have 10 people leaving a tip in the restaurant in one day."
- Visitors are real players (other accounts, wearing their current outfit), chosen among those active in the last 3 days.
- Sparse (D): at most 1 player-visitor in a room at a time; at most 3 player-visits a day across all of your rooms; at most 1 visit
  a day per room; a given friend at most once a day. Rolled per player per day, like 29k_friends.js visits.
- In the room view the visitor has their name under them (small label).
- Opening the room: a one-line note (not an inbox letter): "Sydney stopped by for boba and left a 120-coin tip." or "Marcus
  admired the neon sign." (VOICE.md). Notes for today only.
- Tips (D): at most 2 tips a day in total, 100 x the room's price step each, paid by the game (never from the friend's coins).
  Otherwise "admired" with no coins.
- Only rooms the player has (no spoilers). Works with the existing story-friend visits (29k_friends.js), which stay.
- Size M, no new art (uses the character rig).

## Acceptance checks
- Greetings: exactly 4 buttons; spank works for everyone.
- Boss: spawns Mon 5 am with HP = players x 1,500; damage from quests and Training, capped 600/day/player; phase art changes at
  75/50/25; win -> Sunday carcass + chest letters to damage dealers only; lose -> Sunday fire + -10% business for a week; two phones
  see the same HP within seconds; old saves fine.
- Visitors: never 2 in a room, never more than 3 a day, never more than 2 tips a day; name label shows; note on room open.

## Cal's final Town Boss decisions (2026-11-10 16:10 and 16:20; these win over anything above)

Cal: "lets start with 800 HP per active player for now. Active would mean they have used the app at least 3 times this week.
Otherwise, don't count the HP, because it would overinflate the HP and make it hard to kill the boss. other defaults are fine."
Cal: "Remove the 10% business penalty. The town hall just gets a new art generated for the UI such as the town in flames, the UI
screen boxes are cracked, etc. Will tackle this later in v 0.93 during the handoff." "yes 3 days in the past week. First town boss
goes live on the next monday after there are at least 5 players who are actively using it for 3 days in the past week."

- HP = 800 x active players, fixed at the Monday 5 am spawn, with a minimum of 2 players' worth. Active = opened the app on 3 or more
  game days in the 7 days before the spawn. Each player's worlds doc carries a small 7-day list of the days they played.
- A loss costs NO coins. It is visual only until the next win: the Town Hall picture in flames and cracked boxes and frames on the Hall
  screens (new art from the Mac).
- The first boss spawns on the first Monday 5 am after the game counts at least 5 active players. Until then the game shows no boss
  and never mentions one (no spoilers).
- Other defaults stand: 600 damage per player per day. Win chest: about a day of quest coins, a relic roll and an accessory the
  player doesn't own. The top 3 get a second roll. Players who did no damage get no chest. Friend tips are 100-400 by room, 2 a day.
- Planned for v0.93, built on the Mac.
