# SPEC 3 for LEAD (from ARCHITECT, Cal 2026-11-10 ~10:05): odds, relic look, global drop calendar, no duplicates, clothing quality prices, legendary events

Cal's words in quotes. Supersedes the matching parts of SPEC2. Still OPEN with Cal (do not build yet): the final relic list and
buffs, the later legendary levels, more story side-quests.

## STALE WORK IN THE QUEUES (check first)
- w-drops c192f06 (READY FOR QA): built on a PER-PLAYER schedule from the Closet day with "the first brand after HANGANG waits 3
  days". Cal now wants ONE CALENDAR FOR EVERYONE (part 3). Needs another amend before QA tests it; drop the 3-day wait.
- w-chests (BUILDER TAKEN 10:06): odds changed (part 1), relic borders and themes (part 2), no duplicates (part 4).
- w-wheel 9d04ba1 (QA queued): its cosmetic slivers must never give an owned item (part 4); add that to QA's check.
- w-econ (BUILDER queued): add clothing quality prices (part 5); SPEC2 part 4 stays.

## 1. 300 XP chest odds
Cal: "the odds should be 50% low tier relic, 33% accessory, 13% mid, 4% high."
ECON.chest3: low relic 50%, accessory (unowned, any brand, dropped or not) 33%, mid relic 13%, high relic 4%.

## 2. Relic look and themes
Cal: "Relics should also display the tier and have a clear indication of the rank tier based off of a bronze, silver, gold border.
And for legendary relics, it should be a white and purple color with wings on the borders." "household heirlooms ... only for the
low tier. the mid and high and legendary should be fantasy, dungeon, anime, and otherworld artifacts."
- Low = bronze border, mid = silver, high = gold, legendary = white and purple with wings on the border. Drawn in code (CSS/SVG),
  no art needed; the tier name shows on the card.
- Low relics are household heirlooms; mid, high and legendary are fantasy / dungeon / anime / otherworld artifacts. Original
  designs only. Placeholder names until Cal approves the list (ARCHITECT sends it).

## 3. One drop calendar for everyone
Cal: "Keep the shop drops the same for every character so that it is consistent. If I open the shop for the first time at week 4,
there should be 2 drops already in the shop. If the next day is a monday, the previous drop falls off and the next one comes in. A
new player in this scenario should still see both splash screens of the brand drop one after the other." "At wednesday an old shop
can come back for just one day."
- One shared calendar (anchor: the release this ships in; HANGANG is the first brand of the calendar, alone until the next drop
  day). New brand every Monday and Friday 8 am Pacific; the 2 newest are live; Wednesday vault: one retired brand for that day,
  the same one for everyone (retired longest ago). Replaces v0.88's per-player schedule from the Closet day (S.shopDay).
- A player whose Shop opens later sees what is live today. Every live brand they have not seen gets its splash, one after the
  other (oldest first), then the vault brand on a Wednesday. Fixes the HANGANG splash bug the same way.
- Old saves: owned items stay owned.

## 4. Never the same item twice
Cal: "For items gained from quests or chests, make sure no item is gained twice."
- One shared helper for every free item: Daily Quest chests, level crates (lvCrate already filters), the Wheel's cosmetic slivers,
  crawl finds, Weekly Warrior prizes, story rewards. It only picks items the player does not own; if the pool is empty, coins.
  Relics: a duplicate relic is never given either (reroll within the tier, else coins).

## 5. Clothing prices by quality
Cal: "I want there to be different prices for different clothes. Can you tell QA to intelligently analyze the art style of each asset
and its brand and determine if it is a premium luxury tier and if so, the price should be higher. A white shirt with a flower on it,
should not be the same price as a sexy dress with diamond encrusted lacings. I agree that there can be a cheap shop such as the
thrift shop, but higher shops with better quality clothes should be more expensive. Eventually, there can be a designer brand ...
unlocked later since I dont have those generated yet, that could cost 3000 for a specific pair of pants or a top".
- QA: look at every Shop clothing item's icon and art (349 pieces) and its brand, and give each a tier with a one-line reason:
  thrift/basic, standard, premium, luxury. Output a table (item id, brand, slot, tier, reason) in docs for BUILDER. QA changes no data.
- BUILDER (in w-econ): a tier per item in the data; price by tier and slot. Starting bands: thrift 100-250, standard 250-500,
  premium 600-1,200, luxury 1,300-2,200. A brand's overall level can shift its items up or down. Designer brand later (art not
  made yet): up to 3,000 a piece; leave room in ECON. Econsim: Shop spend before/after.

## 6. Legendary relics: Rafe's treasure hunts (story events)
Cal: "Legendaries could be an event near those levels if there is not already a level up prize ... a traveler who has heard of an
ancient treasure that can grant great power. We should use the adventurer that goes into the bar ... Before you are able to go with
him on the journey, he says he needs to make sure you won't die along the way. So in order to complete this, you must show him a
picture of you at the gym or doing something active. If it is acceptable for him, he agrees to take you. Then I want a few pictures
of a cutscene (3-4 full page pictures) that show you following him through a dangerous journey in a 4-5 second montage where you
finally get the legendary relic. And then he takes off and says he'll let us know when there are more treasures in the future."
"Level 25 sounds good and the legendary treasures should grant increasingly amazing buffs later on. The first one is good, but should
not overshadow the other legendaries."
- Rafe Calloway (29b_story.js:34, the Lock and Key regular). First hunt at level 25. Later hunts at levels near 50, 75 and 100 that
  have no prize yet (lvEmpty; real-life prizes sit on every 5th level): exact levels after Cal answers.
- Flow: Rafe's scene (VOICE.md: unhurried, specific places, understates danger) -> "show me you can keep up": a fresh activity photo,
  checked like a level trial's photo -> accepted: the montage, 3-4 full-screen pictures over 4-5 seconds -> the legendary relic card
  (white/purple, wings) -> Rafe leaves: he will send word when he hears of another. Rejected: he says what he needs; try again anytime.
- Each legendary is stronger than the last; the first must not overshadow the others (numbers with the relic list).
- Placeholders until the Mac paints them: montage frames drawn in code (dark panels, a line of text each). Mac art note: per hunt,
  3-4 full-screen montage pictures (portrait, phone), plus the relic icon.
- Open defaults (Cal not answered yet): if the player has not met Rafe by level 25, this event is how they meet him; a player
  without a camera can pass after 2 active days, like trials.

## Hidden quest (info only)
Unchanged from SPEC2: it moves from 2x the goal to 400 XP. Same reward as today (a streak freeze, else +1 INT, else 300 coins; tomorrow
quests +10% XP and the town 10% faster).

## Acceptance checks
- 1,000 rolls of the 300 chest match 50/33/13/4; never an owned item or relic.
- Bronze/silver/gold/legendary borders show on phone width; tier named on each card.
- Two fresh saves opening the Shop on different days see the same brands; a late opener sees each live brand's splash in turn; a
  Monday 8 am drop retires the older brand for everyone; a Wednesday shows the same vault brand to everyone.
- Every free-item source run until its pool is empty: no duplicates, then coins.
- QA's tier table covers every clothing item; prices follow it.
- Level 25: Rafe's hunt, photo accepted and rejected paths, montage plays 4-5 s, relic kept, Rafe leaves.
