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

Pet Store main tab, the one-time buys (Cal 11-24, later: "In the pet shop, in the main tab where you can purchase the other pets, add
some treats, pet milk, soul stones, that increase affection (increase exp gain), keep your pet full (increase overall coin gain by a
little), and soul stones that permanently increase the chance to pickup random loot from tasks. These are all one time purchases."):
- Treats (3, each bought once): affection, which raises the pet's share of the player's task XP: 10% -> 12 / 14 / 16%.
- Pet Milk (3, each once): the pet stays full, task coins +1% each (+3% in all). Small on purpose.
- Lucky Soul Stones (3, each once): the chance of surprise loot from a task, 1 in 15 -> about 1 in 14 / 13 / 12 (LOOTP + .005 each).
  Named "Lucky" so they are not mixed up with the soul stone that drops as loot and pays XP.
- All need a pet. Prices set with the level 25 economy pass (LEAD's start: 1,500 / 3,000 / 6,000 a tier). Numbers are LEAD's; Cal can change them.

Pets, from ROOMS (11-24, c4d9e374; ROOMS shaped the forms live with Cal, so these are his words as ROOMS reports them):
- Evolved forms are 1.4x the first form, "more dramatic, epic but cool", and the outfits must still fit. Ids: k4 slime (an upright jelly
  cat with slime paws and the forehead star; walk cells still being redone), k5 wolf, k6 wyvern; beds pbed_k4/k5/k6; pbed_wolf is now a
  crescent-moon fur rug (h 180). data/pet_art.json has pets.k5 and pets.k6 with anchors null: LEAD drafts them, ROOMS checks by eye.
  k6 frame 6 is a standing wings-up pose: map it to "stand" or "glide", not "hop".
- ROOMS 11-24 (fa601f89): k4 is in; ROOMS reports Cal said "Approve on all the pet designs" (the three evolved forms). QA's wear-test
  still comes before anything uses them.
- The large bed (Cal via ROOMS: "make sure that when the pet evolves, we have a new upgrade available in the bedroom to purchase a
  larger bed for our pets"): a Bedroom upgrade that appears only once the pet has evolved; art pbed_k4/k5/k6 (grander beds, ROOMS).
  LEAD's rules: until it is bought the evolved pet sleeps curled on the floor beside the small bed; the bed drawn follows the form the
  pet is in (de-evolved: the small bed; the large one stays owned and comes back with the form). The upgrade's name must not give the
  evolution away before it happens (it is not listed at all until then).
- Large beds are in (ROOMS 3b969813; sheet shots/pending_art/cal_1124/pets/beds_large_fit.png). ROOMS's footprints, to check against
  how pzBed scales the picture: k5 wolf daybed 470x464 px, sleepOff 90, about 2.0 x 1.7 cells, tall headboard so it goes against a wall;
  k6 wyvern nest 500x343, sleepOff 60, about 1.8 x 1.5; k4 slime-cat bed 430x295, sleepOff 70, about 1.7 x 1.4. Small beds are 1.2 x 1.0
  with sleepOff wolf 40, wyvern 20, slime 40 (unchanged).
- ROOMS 11-24 e267001b: Cal had the evolved wyvern (k6) shrunk to 1.45x its first form's height: canvas 515 x 580, cx 276; pbed_k6 450 x
  308, sleepOff 54, footprint about 1.6 x 1.4. 2cfa126f: pbed_k5's runes repainted (crescents, dots, a glow line), back with QA.
- QA 11-24 on the evolved pets: all pass EXCEPT pbed_k5 (the wolf's large bed): its runes read as real Futhark letters, two S-runes side
  by side. Do not wire or ship pbed_k5 until ROOMS repaints it and QA rechecks. k6's fit frame 6 is a glide, not a hop.
- CUT WARNING: c4d9e374 replaced the LIVE first-form wolf bed (pbed_wolf, now a crescent fur rug, h 180) and changed data/pet_art.json
  (bed sizes, sleepOff, pets.k4/k5/k6). Any release cut from qa-local carries that. Before the pet system ships, either cut from a
  branch without ROOMS's pet commits (as v1.45 did, lead/v145src) or look at the new wolf bed in the real Bedroom first.
- Pets must never phase through furniture: LEAD's pet-walk code; watch every room for a few minutes when the pet roams (QA too).

Level 25 prices, checked against the sims (LEAD 11-24; item 14, "redo the economy scaling so it makes sense at that level"):
- On the live curve a normal player (12 tasks) is level 25 on day 9 earning about 3,800 coins a day, level 30 on day 11 (about 5,000);
  a heavy one is 25 on day 4 at about 8,500 a day.
- The first companion is free. A second is 6,900 (about two normal days), a third 13,800 (about three and a half). Care is 1,500 /
  3,000 / 6,000 a tier, 31,500 for all nine: about eight normal days, a long sink on purpose. The Companion Bed is 690 and the Grand one
  2,050, in line with Bedroom furniture. Pet clothes are 350 to 690, beside Street clothes (110 to 450) and under the Boutique's (600 to
  1,500, which opens at 30). Switching form is 1,500 (Cal's number). Nothing here needed changing; QA's sim can confirm.

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
- G. The Atelier (Cal 11-24: "Create 5 brands of 3 items from each category for the atelier brand as well"): 5 brands x 5 categories
  (hat, accessory, top, bottom, shoes) x 3 pieces = 75 pieces, every piece for both bodies. The level 70 floor, the legendary shop:
  the most detailed pieces in the game (never plain, sexy is fine, adults only, no cultural costume, no trademarks). LEAD's concepts,
  ROOMS may improve them; names and looks go to Cal in the end batch:
  1. AURELIA NOIR: black velvet and gold filigree couture. Black, antique gold, oxblood.
  2. GLASSHOUSE: crystal and iridescent organza, glass beading, prism light. Clear, opal, ice blue.
  3. NIGHT COURT: celestial royalty, midnight silk with silver constellations, star crowns. Midnight blue, silver, violet.
  4. EMBERLINE: molten couture, lava-cracked leather with ember-glow seams, obsidian plates. Obsidian, ember orange, ash.
  5. PALE MACHINE: white and liquid-chrome futurist couture, sculpted shoulders, pearl. White, chrome, pearl pink.
  Order for ROOMS: after A, B and the first pet brands. LEAD adds them to BRANDS with fl:"atelier" as they pass QA; the scratch card's
  three golden mascots draw from this floor as soon as it has pieces (29zz_v146.js scGoldPiece).

## Cal's answers to the end-batch questions (11-24, evening)
- The three large beds: approved ("3 beds for the pets look great").
- Calvin and Sydney: "Generate a different animation for us. I want us to be closer, and I want us to be walking the two dogs on a
  leash. Notice how the dogs are also giant compared to us? Give Sydney baggy pants, and give me a hoodie with baggy pants as well. And
  a hat. Make this picture of us visitng look unique". Done in code: their rig looks (him: beanie, SAYMORE hoodie, parachute pants; her:
  varsity jacket, wide cargos), the dogs small on the card, and a visit may have its own painted picture friend_<visit id>.webp (+ _2,
  _3 as frames). ROOMS paints friend_calsyd (art item H).
- The Studio room: not in today's game (no cell in 26_world.js ROOMCELL, no story step, no opener). Nothing to change.
- Los Angeles: "Make the game 'the City'". Done: the weather line, the Patio, the three interface items.
- SAYMORE's wording made general: "night culture", Neon Headphones, Mesh Shorts.
- Not answered, left as they are: Cal's real friends as visitors; "Calibur Mall" and "Kode Plaza".
- Later the same evening: "Refund all the shop items I bought for my character. Everything in The shop, including stylist and pets and
  banners, can be viewed first on the character and then confirm to buy it when checking out. Should not automatically buy it and spend
  my money." Done (29zz_v153.js and the checkouts in v150 and v152): every Shop purchase is a preview where there is something to
  show, then a checkout with "Confirm purchase". The refund is for Cal's own save only (QB_WEB.owners), once.
- ROOMS's walk picture for the visit (friend_calsyd, three frames) and the ten backdrops are in and QA-passed; sent to Cal 11-24.
- APPROVED by Cal 11-24: the visit picture (friend_calsyd, three frames) and all ten backdrops ("The visiting animation and 10
  backdrops look great"). With the three large beds and the evolved pets, the art still to come to him: the pet clothing brands, the
  tattoos and scars, the soul stone icon, the five Atelier brands, the Pet Store care icons.

## Refund: bought only (Cal 11-24)
- Asked whether his one-time refund should also pay back pieces he won, Cal said: "Bought only".
- The save never recorded which pieces were bought and which were prizes, so the refund is a one-time tick list (29zz_v153.js,
  v53Refund): every priced character piece that is not the creator's look, all ticked; he unticks what he won. Ticked pieces go back
  for their price; unticked ones stay owned and worn. "Later" (or the x) refunds nothing and asks again on the next launch.

## Header avatar is the player card (Cal 11-25)
Cal: "I want the player card and banner to be visible on the top player card. Make sure that clicking the player icon on any screen
will open up the player banner. On the main board, this may mean moving all the text at the top slightly to the right to make room for
the full customized player banner without it being cut off."
Built in app/src/29zz_v155.js: the header avatar is a 3:4 mini card (backdrop whole, character, companion), 108 x 144 (96 x 128 under
350 px wide); tapping it opens the player card on every screen with a header (Board, Train, Town Hall; the Loft and the Shop cover or hide
the header, and the Shop's character already opens the card). The small card button is gone. The card has a Profile button; the Board's
level bar still opens the profile; the Relics and streak-freeze tours point at the level bar. Test: rigtest/lead/header155.js.

## Card posts, a sharp character, backdrop tiers (Cal 11-25)
Cal: "When posting the player card to the town hall, I want it to show the full picture, not just a tiny thumbnail. Also for the player
card, my character looks blurry compared to the banner. I also want 5 more banners in the shop but much higher quality and intricate
that unlock at level 10. The current ones I would consider tier 1 cards in terms of detail and intricacy. Let's unlock 5 more at level
10. Then 5 more every 10 levels that are increasingly varied and more intricate. Remove these 5 currently so there are only 5 banners
available right now: Loft rooftop, skyline blvd, mist gate, sunrise court, ember throne. Don't use these anymore and delete them.
Generate 5 more intricate ones than the existing ones. Lots of detail, high resolution, very expensive and professional looking"
- Card post: the whole card, up to 300 px wide (29zz_v152.js pcPostW; it had fallen into the avatar's grid column).
- Sharp character: src/loft_bridge.js frameHi renders a frame up to 3x the Loft's size; the card asks for it (pcChar, data-hi; calHyd
  wrapper in 29zz_v155.js). 720 x 819 on a 3x phone instead of 240 x 273.
- Backdrops: tier 1 is Neon Alley, Crimson Maple, Fireworks Night, Lantern Sky, Blood Moon (plus the free Studio). Retired: roof,
  skyline, mist, sunrise, ember (PCGONE; an owner is refunded the price once and the card falls back to Studio). ROOMS deletes the five
  files. PCBG's fourth field is the level. Tier 2 (level 10, LEAD's working names and prices, ROOMS may rename): Clockwork Observatory
  3,000, Tidal Palace 3,500, Skyship Deck 4,000, Aurora Citadel 4,500, Dragon's Hoard 5,000 (bl_pc_orrery / tidal / skyship / aurora /
  hoard). The Stylist lists what the level has reached plus the next tier, locked. Tiers 3+ (levels 20, 30, ...) follow the same way,
  five paintings at a time, each more intricate; prices are LEAD's call per tier unless Cal says otherwise.
- Test: rigtest/lead/cards155.js.

## Wording sweep after the scratch card (Cal 11-25)
Cal: "The scratch card logo is still a wheel. And the text is still about the wheel. Make sure you check the whole app and make sure
everything else is consistent". Cause: the area table in 10_app_a.js (icon and the "New area" line) was never changed. Fixed: the
icon (a card with scratch strokes and a coin), the area's line and base name, the base tour and info text. Also found by the sweep:
"wardrobe" in the Vault's info window and a side quest (now Closet), the old Shop tab label, and the rank C perk "Daily bounty" (still
a live perk: one quest of 25+ XP pays double each day), renamed "Daily double" with its tag, since Bounty now means the 1, 2 and 3-day
cards. Guard: rigtest/lead/wording155.js reads every area, info window, tour, rank line, "New area" card and nine screens as drawn
and fails on a retired word. Not covered by it: story scenes, side quests, bounty and visit texts (those were scanned by hand in the
source for wheel / spin / wardrobe / old rank names / daily bounty only).

## A scratch card you scratch, and its button by the mailbox (Cal 11-25)
Cal: "Is there an actual way to scratch this off rather than just tapping the card? If I try to rub my hand on my phone in a scratching
motion, it scrolls the screen up and down. Instead of its own text box on the board, make this a scratch card icon next to the mailbox
icon that stays persistent. Going into that menu before completing 3 tasks will still show the scratch card menu, but a message that
says it is locked until 3 tasks are completed"
Built in app/src/29zz_v156.js: canvas foil rubbed off by finger or mouse (touch-action none on a live card's grid; a stroke stays on
the panel it began on; 8 px of movement fixes the pick, a tap spends nothing; half gone and the rest clears; paid when the third panel
is clear; a panel begun counts as scratched if the app is left; an unpaid three-pick card is paid on a later day). The keyboard still
reveals at once. The Board row is gone; .scbtn sits after the mailbox on every header from level 6 (lit when ready). The locked card
says "Locked until you finish 3 tasks today, n of 3 done". Test: rigtest/lead/scratch156.js (mouse and touch events).

## Quick steps, repeats, a private bounty photo (Cal 11-25)
Cal: "For all bounties and everything across the app actually, give users the ability to post to town hall, or not. It should require
photo proof for the ones that need it, but users can choose to share it with the town or not. Do a QA check on all the bounties and
also make the AI that categorizes the tasks smarter. There are some tasks that could be faked and spammed such as 'put on socks' or
'walk to car' and even those would give ample experience. Now that I'm playing more heavily on each day, there could be more coin
opportunities but the main focus should still be the tasks done and not relying on passive money to bring you coins."
Built in app/src/29zz_v157.js and PARSE (30_app_b.js): the rater's "step" rung (1 XP, nothing else, not one of the day's tasks), the
offline list of motions, minutes and XP agreeing at the bottom of the scale, the prompt ignoring instructions inside a brain dump; the
same small one-off (10 XP or less) a third time in a day is a quick step; a 3-day bounty's photo can be kept private (checked by the
photo checker, counted, never uploaded). Quest, Workout and level-trial photos were already private with an optional post. Not built:
the coin balance between tasks and businesses (numbers and a proposal went to Cal). QA asked for the full bounty sweep.
Test: rigtest/lead/tasks157.js.

## Syncing never stops you looking around (Cal 11-25)
Cal: "When the game was syncing, I could not press the player banner on the top left to edit and see my banner. I want the syncing
status on the top right to be completely in the background and never prevent the user from navigating the app"
Built in app/src/29zz_v158.js: while html.qb-sync is on, everything that only looks takes taps (the header card and the player card,
the profile, the mailbox and letters, (i) sheets, the scratch button, the Shop's doors, tabs and floors, the Closet, Stylist tabs,
trying on a piece or a backdrop, another player's card, photos, scrolling in a window). What changes the save still waits (it would be
replaced when the online save lands) and a tap on it now says "Still syncing your save. That will work in a moment."
Test: rigtest/lead/sync158.js.

## A sleeker Shop, four picture doors, one Interface shop (Cal 11-25)
Cal: "The shop color can be a sleeker color rather than this cream or pastel white color. The text is also white so it's very hard to
see. Instead of two text boxes for street shop and stylist, can you turn this into a square button where there is a picture of a street
of clothing stores and then the stylist could be a barber shop. The bottom left will be the 'Interface' shop for the banners and
upgrades/interface upgrades once the hero console is unlocked. Remove the separate upgrade tab I originally had planned and just place
everything that can be purchased onto the shop. Eventually there will be a pet shop on the bottom right and that will make a perfect 4
square menu."
Built in app/src/29zz_v159.js: the Shop's own screens are dark (night-blue paper, light ink, dark cards, light picture wells; a brand's
room keeps the brand's colours behind the dark cards); the home is a 2 x 2 grid of square doors (Street Shop, Stylist, Interface, Pet
Store bottom right once the player has it; the Vault's day is a wide door above); each door is art/app/ui_shop_<street|stylist|iface|
pets>.webp when ROOMS has painted it, a dark panel with a line drawing until then; Interface = Banners, plus Upgrades and Interface
once the Lair's console is owned; the bottom bar's Upgrades tab is gone and the console's screen opens Interface; the Stylist is
Cosmetics only; "backdrop" reads "banner" to the player. Test: rigtest/lead/shop159.js.

## A brand's room wears its banner as the background (Cal 11-25)
Cal: "I like the banner for the brand drops, but it takes up too much space. Can we not have a separate banner but have it be
integrated into the background for each brand? Instead of The Shop at the top left here, the name and logo of the brand should be
there. And remove the 'new brands mon and Fri at 8 am' message and place the new brand in 1 D 1H message on the top right to the left of
the coins I own. Remove the plus icon and mail icon since that can just be on the main board. As for my character where it shows my
clothes I'm wearing and the name of each item, make that slowly appear as I scroll down and the top of the screen goes out of view. So
when I scroll down, the opacity of my player card should go from 0% to 100%. I don't like how trying something on makes this box with my
character longer. Remove the username from this card and change 'take them off' to 'take off' and place it to the right of the purchase
text so it doesn't create a larger box."
Built in app/src/29zz_v160.js: no banner block; the brand's picture is the top 320 px of the page's fixed background, fading into the
brand's colours; the title is the brand's emblem and name; the Shop's header loses the schedule line, the "+" and the mailbox, and
in a brand's room the countdown sits left of the coins; the character card in the Shop's rooms has no name, a two-line worn list and
one row (buy button, "Take off"), the same height trying or not; on a phone it is pinned to the top out of the page's flow and its
opacity follows the scroll (0 at the top, 1 from about 220 px). LEAD's addition: while a piece is tried on the card shows at once,
because that is the only place the try-on and its price are seen. Test: rigtest/lead/shop160.js.
