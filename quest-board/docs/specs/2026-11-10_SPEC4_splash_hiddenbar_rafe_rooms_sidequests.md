# SPEC 4 for LEAD (from ARCHITECT, Cal 2026-11-10 ~10:15): splash per rotation, hidden 300 chest, Rafe montage POV, story rooms a day apart, side-quests

Cal's words in quotes. Supersedes the matching parts of SPEC2/SPEC3.

## STALE WORK IN THE QUEUES (check first)
- w-drops (BUILDER editing 29l_drops.js and 25_splash.js NOW): the splash rule changed (part 1).
- w-chests (not started): the 300 chest becomes the hidden chest; no separate 400 hidden quest (part 2).
- w-econ W25 (not started): "3 days apart, every room after the Garden" becomes "a day apart, story rooms only" (part 4).
- w-rafe (queued): montage art note changed (part 3).

## 1. Brand splash: only brands in rotation, again when they come back
Cal: "i only want to see the brand splash for the shops that are currently in rotation. not for every page. Even the same players
who have already seen that splash the first time should see it again if it comes back into rotation."
- Splash only for brands live right now (the 2 newest, plus the vault brand on its Wednesday). Never for brands that have retired.
- "Seen" is per stint, not per brand: key it by brand + the date that stint started (e.g. S.brandSeen["hanga|2026-11-14"]). A
  brand that leaves and comes back (a later round, or the Wednesday vault) shows its splash again to everyone, once per stint.
- Several unseen live brands: one after the other, oldest first (SPEC3).

## 2. Daily Quest bar: 100, then 200, then a hidden 300
Cal: "make the hidden chest at 300 exp instead of the 300 exp being shown. At first, it should say 100 exp is the goal, then once that
finishes, the goal bar expands to 200 exp without any text indication. And then any additional exp gained will move the bar farther
until it reached 300 exp for the hidden chest. similar to solo leveling where sung jin woo had a secret quest for double the exp."
(The reference is mood only: no names, art or text from that series.)
- The bar shows "0 / 100". At 100: Daily Quest complete, 200 coins; the bar quietly becomes "x / 200" (no message about it).
  At 200: 400 coins. Past 200 the bar keeps filling with no number or label toward 300; at 300 the hidden chest appears
  ("Nobody told you this one existed" style, VOICE.md): 600 coins + the SPEC3 roll (50% low relic / 33% accessory / 13% mid /
  4% high) + the old hidden-quest reward (a streak freeze, else +1 INT, else +300 coins) + tomorrow +10% XP and town 10% faster.
  Default: keep the old reward on top (Cal not asked).
- No separate hidden quest at 400 any more (drop SPEC2's "move it to 400").
- The 300 is never named anywhere in the UI or help.

## 3. Rafe's montage: no player character
Cal: "No need to have the painted scenes show the character. They should just show rafe and maybe a first person pov of your hand
reaching out or navigating the treacherous terrain or something like that."
- Mac art note per hunt: 3-4 full-screen portrait pictures, Rafe ahead and the player's first-person view (a hand reaching for a
  ledge, a rope, the relic). No player character drawn. Placeholders in code until then.

## 4. Story rooms open at least a day apart, on several triggers (amends W25)
Cal: "Rooms should open a day apart. Or have the option to open them a day apart. But only the ones that have questlines tagged to
them such as the restaurant, boba shop, bar, dessert parlor, strip mall. There has to be multiple triggers that are met. One is the
level cap, one is the amount of money gained before someone decides to open up another business with you and at least a day."
- Story rooms only: Restaurant, Boba, Dessert, Lock and Key (the bar), the Mall. Each opens when ALL are true: a level, coins earned
  since the previous story room opened (the partner sees the business doing well), and at least 1 day (24 h, or the next game day:
  BUILDER's pick, say which) since the previous story room opened. Keep the existing story beats (produce sold, dishes served) as
  part of the coin trigger or alongside it.
- Other rooms (Theater, Auditorium, Arcade, Rhythm, VR, Bowling, Karaoke, Club, Loft rooms) keep opening as today, no day wait.
- A locked story room shows each trigger with progress ("Level 9 of 12", "1,240 of 3,000 coins", "Opens tomorrow").
- Replaces W25's "3 days apart, every room after the Garden".

## 5. Story side-quests (approved concept)
Cal: "side quests are cool. the 30 minute walk outdoors could be changed to something else".
- Approved: Mara "Cook for me once" (a real home-cooked meal photo -> a signature dish that earns more in the Restaurant); Nova
  "Clear out your closet" (a donation bag photo -> an exclusive accessory); Theo "Movie night" (two players both confirm a movie
  together -> a premiere day, theater income x2 for the day); Pluto and Chopstick "Walkies" (dog-walk photos on 5 days -> a dog
  outfit, ties to W22's pets at level 30).
- Sable's walk is OUT; replacement pending Cal (ARCHITECT proposed one).
- Each: one-time, character scene in VOICE.md, photo checked like a trial photo (honor fallback after 2 active days, as trials),
  reward never a duplicate. Rewards that need art (dish icon, accessory, dog outfit) use placeholders + a Mac art note.
- Own branch after w-rafe (same story/photo plumbing).

## Acceptance checks
- A brand retires and returns: its splash shows again once; retired brands never splash; Wednesday vault brand splashes on Wednesday.
- Bar: 100 shown; at 100 it silently becomes 200; past 200 no number; hidden chest at exactly 300 once a day; undo below a tier
  takes back that chest as today.
- Story rooms: each trigger blocks on its own; two story rooms never open within a day; non-story rooms unaffected.
- Side-quests: each runs once, photo accepted/rejected, honor fallback, reward kept.
