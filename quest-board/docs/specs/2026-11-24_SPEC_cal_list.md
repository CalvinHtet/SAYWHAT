# Cal's 2026-11-24 list: what he decided (LEAD's record)

Cal answered every question on 11-24 so the team can work without stopping. Where he changed his mind, the last word is here.
Rules for all of it: nothing music-production or Cal-specific in app text; pets, the hidden evolution, the Pet Store and other big
features are surprises (never in letters, tooltips or teasers); art needs Cal's approval **in one batch at the end**; ship QA-passed
batches of several changes; a short vague patch letter every 10th version.

Parked for later (do not build): raids and power level (replaces the Town meter, lives in the Dungeon tab), the big Town Hall room,
Loft customization / visiting a Loft, the season pass, stat skill trees (dropped: redundant), character poses and pet/duo poses.

## Batch 0 (done, dd7327f6)
Walk-in Closet from level 3, first in the list, "!" on the Loft; the Board's stuck "!" (old Players tab).

## Batch 1: no art
1. **Spinners.** Anything that waits shows a spinning circle: the "syncing…" text top right, adding/sorting tasks, every load.
2. **Visitor names.** Other players in rooms: username under the character, white text.
3. **Ranks.** Awakened, Hunter, Knight, Paragon, Sovereign, Monarch (were Awakened, Bass Hunter, Drop Knight, Headliner, Sovereign,
   Shadow Monarch). Classes and paths keep their names. Audit text for music/Cal-specific lines (class tags, bounties, chores).
4. **Levels.** Weekly Quest and Weekly Warrior pay a flat XP (not a level's worth). Top of the curve 10% steeper. Target: a normal
   player (12 tasks, 200 listed XP a day) reaches 100 in 4 months; heavy (26 tasks, 605-650 listed) lands where it lands. Nobody loses
   a level. Sim it (scratch sim: rigtest/qa/sim.js with a 26-task profile). Today: heavy 100 on day 61, normal 86 on day 90.
5. **Momentum Surge** replaces Rested XP. Away 3+ days: a "welcome back" splash (rested up from being a badass, more ready than ever),
   then the first 5 tasks pay 2x XP and 1.5x coins, then it ends.
6. **Surprise loot.** 1 in 15 per finished task, no daily cap. Chest with more coins than usual 45%, soul stone (bonus XP) 35%,
   clothing 12% (never luxury tier), furniture 6% (the cheapest upgrade under 1,000 in a random room; never one that opens a room, a
   lot or an expansion), a Boutique piece 2%. Never pets or Pet Store items. Small, nothing game breaking.
7. **Info text.** Rework the Daily Quest (i); find and fix outdated info everywhere (e.g. "Weekly quest ... for half a level of XP").
8. **Splash rule.** A splash only shows on its own tab (no clothing drop splash on the Board or Town, no pet brand splash on the
   clothing tab). Elsewhere a pending splash is a "!" the player follows to that screen.
9. **Wave only.** Player cards have one greeting button, Wave (Fist bump and High five go).

## Batch 2
Prize rule for the whole game (Cal 11-24): a free piece is always one the player can wear (their body; no pet pieces, least of all
without a pet; no player-card backdrops, no upgrades or buffs, no interface pieces). Furniture from surprise loot stays, as he set it.
10. **Scratch card** replaces the Wheel (same level, same average payout). 3x3, once a day, only after 3 tasks that day. Three mascot
    icons = 1,500 coins; three neon orange Ø = 1,000; three neon cyan Ø = 500; no match = each icon's small coin value, added up
    (always less than a match). Coins only, flat at every level (Cal: "almost 5000 coins is a lot"). About 3 cards in 100 show golden
    mascots (a surprise, not in the legend): one = a clothing piece, two = a rare piece (Boutique), three = a legendary piece (Atelier). Must look polished, not MS Paint. Cal's Ø logo files:
    art/src-cal/ (black, cyan and orange versions).
11. **Bounties.** Three cards: a 1-day, a 2-day and a 3-day. Take two and the third disappears. An x forfeits a taken bounty so a new
    card can appear. 3 rerolls a day in total (not each); after that a reroll costs 150 coins; with no rerolls left the same bounty
    comes back, and taking it again continues its timer (no restart). Pay: about 250 / 400 / 600 coins plus XP, always above 150.
    1-day and 2-day pools: the existing chores (minus anything Cal-specific). 3-day pool, done by posting photos to the Town Hall:
    Menu Ideas (3 meals), Hydration, Home Chef, Clean Sweep (before/after), Made Bed, Fit Check (ONE photo, 3-day timer), Desk Reset,
    Touch Grass, Made It Myself, Let It Go, Movie Night, Song of the Day, Game Night, Gym Challenge (challenge a player; once accepted
    the card becomes the challenge: their name, its details, its own 3-day timer).
12. **Shop drops.** Clothing brands drop Mon, Wed, Fri; the Vault is its own shop, one day only (Wed). Pet brands drop Tue and Thu, at
    most 3 live at a time.

## Batch 3: Shop layout and pets
13. **Shop.** Top buttons: Street Shop, Pet Store (from level 25), Stylist. Opening Street Shop hides the other buttons and shows this
    week's brand names up top. "Wardrobe" is renamed Closet. Interface and Upgrades are their own bottom tab once the Lair's console is
    owned (already built: 68c4b15, check it).
14. **Levels.** Pets at 25, the Boutique at 30. Re-price pets, clothes and rooms so they make sense at those levels.
15. **Pets.** Only slime, wolf and wyvern. At 25 the player picks one of the three and names it (free choice window); a second costs
    double, a third double again. Pluto and Chopstick leave the shop: refund anyone who bought them or the pet bed; they come as
    visitors ("Calvin and Sydney came to visit and they brought their dogs!").
16. **Pet bed.** An upgrade after getting a pet; not a dog bed; in the Bedroom (the Patio's goes). The pet follows the player around
    the Loft and wanders into the Closet, Game Room, Lair and Patio alone.
17. **Pet XP.** The pet gets a share of the player's task XP (start 10%). Level 10 takes about 5 heavy days. Treats raise affection,
    which permanently raises the share. Permanent buffs for sale: better surprise-loot chance.
18. **Evolution (secret).** At pet level 10, the first time: "What...? Something is happening to [name]. Stop the transformation, or
    see what happens?" Evolved = cool and majestic, not huge, not a boss monster. De-evolve 1,500 coins, evolve again 1,500.
19. **Pet Store.** Main view: the pet big at the top, the three pets to buy, treats and buffs below. Three glyph buttons (slime, wolf,
    dragon) open each pet's clothes; after evolving that sub-shop has tabs I and II (first-form and evolved clothes).
20. **Pet clothes.** 5 brands x 5 slots x 3 pieces for the first form AND for the evolved form, per pet. Launch with what is ready
    (one brand each), then a brand per drop. Every piece must work in every pose with every other piece.

## Batch 4: Stylist and player card
21. **Stylist** has its own background colour and sub tabs: Cosmetics, Backdrops. Cosmetics: hairstyles, hair colours, eye styles, eye
    colours, face tattoos and scars. Tribal-style tattoos are fine; no gang marks (teardrop), no religious art.
22. **Player card.** Backdrop + character + pet (default stand; no bought poses) + name, rank, class, level. Opens from: the card icon
    top left of the Board, the profile icon on the Town board ("Customize card"), tapping your character in the Shop, tapping a player
    in the Hall (with Wave). "Post my card" puts it on the Town Hall feed.
23. **Backdrops** (ROOMS paints originals; Cal's pictures in docs/refs are mood only; no real signs or brands): Neon Alley, Skyline
    Boulevard, Mist Gate, Sunrise Court, Ember Throne, Blood Moon, Crimson Maple, Fireworks Night, Lantern Sky (sold like the others: Cal 11-24, backdrops are never a prize), Loft Rooftop at dusk. A plain studio backdrop is free. 800 to 2,500 coins.

## Art for ROOMS (Cal's Chrome, Unlimited on; QA wear-tests; Cal approves everything in one batch at the end)
- A. Evolved slime, wolf and wyvern, same pose set as the current pets (stand, walk, sit, lie, sleep: whatever the Loft uses).
- B. The pet bed for the Bedroom.
- C. Pet clothes: brand 1 for each first-form pet and brand 1 for each evolved pet (5 slots x 3 pieces), then brands 2 to 5.
- D. The 10 backdrops, card ratio 3:4, clear floor in the bottom third for the character and the pet.
- E. Face tattoos (6) and scars (4), both sexes, front view.
- F. A soul stone icon (a chest icon exists).
