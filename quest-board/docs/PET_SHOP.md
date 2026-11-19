# Pet Shop: design draft (LEAD, 2026-11-18)

Cal, 2026-11-18: "The 2nd floor also has a pet shop for clothes and accessories for the pets that shuffle through items every Monday
and Thursday."

## What exists today

- **Two dogs live in the Loft:** Chopstick and Pluto. They have their own beds (a Patio bed each once bought), walk, sit and sleep,
  and visit with friends.
- **They are sprites, not rigged characters:** each dog is four painted frames (`dgx_<name>_0..3`: stand, step, sit, sleep), drawn by
  `lfDogSpr` in `20_loft.js`. The character rig (bones, bent clothes) does not apply to them.
- **The old "Companions"** (Pixel Slime, Ember Fox, Void Cat) are pixel badges on the status card from before the rig; nobody sees
  them now. They are not pets in the Loft.

So "clothes for the pets" means clothes for Chopstick and Pluto, drawn over their four frames.

> **Replaced:** this section, "The Pet Shop itself" and "Work" below are the first draft (dogs only). Build from the sections from
> "Cal's answer" on: three creatures plus the dogs, 12 pieces per line (48 in all), 2 per line per drop (8 per drop, 4 seen).

## How dog clothes would work (my proposal)

- **Pieces are small overlays, not full repaints:** collars, bandanas, bows, hats, little sweaters, harnesses, glasses. Each piece is
  one painted image (one Higgsfield image per cosmetic, as with clothes) holding the piece at each dog's size.
- **Each dog gets anchor points per frame:** neck, head top, back. A piece sits on its anchor and follows the frame (lower in the sit
  frame, lying in the sleep frame). The anchors are measured once per dog and frame (8 frames total), not per piece.
- **Slots:** neck (collar, bandana, bow tie), head (hat, bow, ears), body (sweater, harness, raincoat), face (glasses). One piece per
  slot per dog.
- **Each dog dresses separately:** the Wardrobe gets a dog switcher (you, Chopstick, Pluto). A piece bought once can be worn by either
  dog (a "shared closet"), or bought per dog: Cal's call (question 3).
- **Testing:** every piece on both dogs in all four frames; a sheet per drop, like the clothes' wear-test.

## The Pet Shop itself

- **Where:** a "Pets" tab on floor 2 (the Boutique), next to its brands. Floor 2 opens at level 30 (question 1).
- **Shuffle:** Mondays and Thursdays at 8 am, the same moment as the brand drops: a fresh set of about 6 pieces from the pool, the
  same for every player (seeded by the date), never the same piece two drops running.
- **Prices:** below the Boutique's clothes, since they are small extras: about 250-600 coins, by the same quality grades.
- **Start:** a first pool of about 18 pieces (3 shuffles before repeats), more added over time.

## Work

- **ROOMS (art, Cal's Chrome):** about 18 overlays, plus icons; anchors marked on the 8 dog frames.
- **LEAD (code):** about a day. Overlays on the dog sprites by anchor, the Pets tab and its shuffle, the dog switcher in the Wardrobe,
  and the save field for what each dog wears. The dogs' frames are cached like the characters', so a dressed dog costs one extra
  draw per piece per frame.
- **QA:** the shuffle schedule and every piece on both dogs in all four frames.

## Cal's answer (2026-11-18): floor 2, and three creatures, not a basic dog

Cal: "pet shop open level 2. but i dont want a basic dog", with three pets he described (his notes, summarised; original designs only, so
no names, looks or signature details from the shows he mentioned as the mood):

1. **Shadow wolf pup:** a chibi, palm-sized dire-wolf pup. Pitch-black fur, wispy violet or cyan shadow flame off its tail and ear tips,
   oversized glowing eyes, oversized paws it sometimes trips over. Dresses: glowing collars, tiny battle armour, mini capes, oversized
   hoodies, hats between its pointed ears.
2. **Void wyvern:** a chubby, upright baby dragon. Stubby wings, small horns, obsidian scales with bright neon markings. Hovers by your
   shoulder or waddles behind you. Dresses: tiny backpacks, scarves, a wizard hat over one horn, jackets with wing cutouts.
3. **Shadow fox-slime:** a round, semi-translucent body of swirling dark violet and black, two pointed fox ears, a smoky misty tail, big
   glowing neon eyes. Bounces or floats a little off the floor. Dresses: big hats, crowns, headphones, bows on top; scarves or collars
   round its base; floating auras like tiny orbiting spirit flames.

**Copyright line (CLAUDE.md, "original designs only"):** the three kinds are common fantasy types (shadow wolf, baby dragon, slime), so
they are fine. Nothing may copy a named character's look or name: no "Shadow Monarch", no named shadow soldier or wyvern, no copy of a
famous slime's shape and colours. The names in the game are ours, and QA's design review checks the sheets for it.

**What changes from the draft above:**

- The Pet Shop sells **the pets themselves** (one each, adopted once) and then **their clothes**, which shuffle Mon/Thu as planned.
- Floor 2 (the Boutique, level 30). A "Pets" tab next to its brands.
- A pet follows your character in the Loft and rooms, as visitors do: the pup trots and trips, the wyvern hovers by the shoulder or
  waddles, the slime bounces and floats.
- Each is a sprite like the dogs, but with more frames: idle (with its own loop: flame flicker, wing flap, slime wobble), walk or hover,
  sit, sleep, and one fun move (the pup trips, the wyvern loops, the slime squashes). About 8 frames per pet, front and back.
- Clothes are overlays on anchors per frame (head, neck or base, body, aura). Each pet has its own clothes, since a wolf hoodie does not
  fit a slime.
- **Chopstick and Pluto stay** as they are (Cal, later the same day: "keep chopstick and pluto").

## Cal's answers (2026-11-18, later)

- "Remove Chopstick and Pluto", then: "nevermind. keep chopstick and pluto. But after buying the 3rd pet, add another pet bed in the
  loft and patio". So **the dogs stay as they are** (their adopt rows, beds, visits, Walkies, all unchanged).
- **The new creature is your third pet:** it unlocks at level 30 with floor 2 and is "a big floor 2 buy" (about 3,000 coins, tuned in
  the economy pass).
- **Its bed:** buying it adds a third pet bed in the Bedroom (the Loft) and one on the Patio, next to where the dog beds are, shaped
  for that pet ("a pet bed depending on the pet"): a den cushion for the wolf pup, a perch nest for the wyvern, a low pillow for the
  slime. ROOMS checks free floor first (no crowding, no overlaps: rooms-never-cluttered, no-unintended-overlaps). The Bedroom's dog
  beds sit at x 2.0 and 4.7 on the front edge, and the Patio's at 1.6 and 0.2 on the 3.8 row.
- **Every player has their own:** "Me and my girlfriend dont share accounts. this is a game for everyone and they should have their own
  pets and own save files." The pet, its bed and its clothes live in each player's own save.
- **Emotes:** no stutter on Cal's phone, so the v1.25 warm-up is fine.

## One pet only, and adoption (Cal, 2026-11-18)

Cal: "They can own only 1. Make sure to provide a warning that you can only buy one. If you wish to give it up for adoption, the pet
should have a sad crying animation splash screen where you confirm if you want to give it up for adoption, which costs the same price
as the pet to give up. And then you can buy another."

- **One creature per player.** The Pets tab shows all three; once you own one, the other two say "You already have a pet".
- **Warning before buying:** the buy button opens a confirm: "You can only have one pet. To switch later you would give <name> up for
  adoption, which costs <price> coins." Buy or Cancel.
- **Giving it up for adoption:** a button on the pet's card in the Wardrobe (and the Pets tab). It opens a full-screen splash with the pet
  crying (its own short animation: big wet eyes, tears, a sniffle loop; the wolf's ears droop, the wyvern's wings fold, the slime sags),
  and "Give <name> up for adoption? It costs <price> coins, the same as adopting." Confirm or Keep <name>. Confirm needs the coins.
- **After:** the pet and its two beds leave the Loft and Patio, you can buy any of the three again (full price), and the new one brings
  its own beds.
- **Its clothes stay yours** (LEAD's default): they are hidden while you have no pet of that kind and come back if you adopt that kind
  again. Nothing is refunded.

## Frame list (LEAD for ROOMS, 2026-11-18, QA's note on a02362e)

The same 11 frames for all three pets, front 3/4 view facing right (flipped for left, as the dogs are), one canvas size and ground line
per pet: 0-1 idle A/B (the loop), 2-3 move A/B (trot, hover or waddle, bounce), 4 sit, 5 sleep (in its bed), 6 fun move, 7-10 crying
(the adoption splash). No back views: each clothing piece would need back art too. Clothes are one image per piece on per-frame anchors
(head, neck or base, body, aura), measured once per frame.

## Each pet its own colour (Cal, 2026-11-18)

Cal: "Love the pets! But can we make them all a slightly different color so they look unique and different?" All three were black with
violet glow. ROOMS paints it into the final frames: wolf pup charcoal-black with icy cyan flame, eyes and paw marks; wyvern deep
navy-steel with molten amber-gold markings and eyes (not green: the green-screen key would cut it, and QA bans green eyes on it);
slime plum-violet with hot magenta-pink glow and eyes. Beds follow each accent. A side-by-side sheet with Chopstick and Pluto at Loft
size goes to QA.

## Clothes per pet (Cal, 2026-11-18: "12 per pet")

Cal approved LEAD's proposal below. Not yet painted: no pet clothes exist, and the first draft's pool (about 18) was sized for the two dogs. Split over three pets that is
6 each. Proposal: 12 per pet at launch (3 per slot: head, neck or base, body, aura), 36 in all, each made for its own pet's shape;
each Mon/Thu shuffle shows 2 per line (see the dogs below: 8 in all, 4 lines), so 6 shuffles before a line repeats. More added over time.

## The dogs dress too (Cal, 2026-11-18: "Dogs too")

Asked whether Chopstick and Pluto can wear Pet Shop clothes as well, Cal: "Dogs too". LEAD's defaults (Cal may correct):

- **A dog line of its own, 12 pieces**, the same count and slots as each creature (3 each: head, neck, body, aura), because a creature's
  piece is shaped for it and would not fit a dog. 48 pieces in all at launch (36 creature + 12 dog).
- **One dog piece fits both dogs:** painted once and placed on each dog's own anchors (neck, head top, back) in their 4 frames
  (dgx_chopstick_0..3, dgx_pluto_0..3: stand, step, sit, sleep), scaled to each dog. ROOMS marks those 8 anchor sets once.
- **Bought once, worn by either dog or both:** a shared dog closet. The Wardrobe's pet switcher has you, Chopstick, Pluto and your
  creature.
- **The dogs need no level-30 creature:** their pieces are on the Pets tab for everyone on floor 2.
- **Shuffle:** each Mon/Thu drop shows 8 pieces, 2 per line (wolf, wyvern, slime, dogs). The Pets tab shows only your creature's line
  and the dog line, so you see 4 at a time.
- **Testing:** every dog piece on both dogs in all 4 frames, a sheet per drop, like the creature pieces in all 11.

## Questions for Cal (open)

None right now.


## Earlier questions (answered or replaced)

1. Should the Pet Shop open with floor 2 (level 30), or be on the Street so it is there from the start?
2. Overlays as proposed (cheap, one image per piece), or a full repaint of each dog per piece (better fit, eight times the art)?
3. Is a piece bought once for both dogs, or bought per dog?
4. Which pieces first? My suggestion: a bandana, a collar with a tag, a bow tie, a beanie, a hoodie, a raincoat, sunglasses and a
   birthday hat, then seasonal ones.

## Bed spots (LEAD, 2026-11-18, after QA's note on e82a602)

The creature bed gets a spot of its own in the Bedroom and on the Patio, near the dogs but not lined up with their beds: three beds in a
row read as a kennel row (rooms-never-cluttered). Cal's later words were "add another pet bed in the loft and patio", so it need not
touch the dog beds. If a room has no clean spot when fully furnished, the options go to Cal as pictures.

## How clothes fit each frame (LEAD with QA and ROOMS, 2026-11-18; QA 180defc, d93c192)

A single image per piece does not fit the curled sleep, the sit and cry frames, the wyvern's hover and hop or the slime's flat melt. So
each piece is still one Higgsfield image, but that image holds the piece's pose variants as cells, and the code picks a cell per frame.

**Body pieces (and the slime's base pieces): variants per pet, frame by frame (frames 0-10)**

| Pet | Variant: frames |
|---|---|
| wolf | stand: 0 1 2 3 · trip: 6 · sit: 4 7 8 9 10 · sleep: 5 |
| wyvern | stand: 0 1 7 9 · glide: 2 · hover: 3 · hop: 6 · sit: 4 8 10 · sleep: 5 |
| slime | round: 0 1 2 7 8 9 · tall: 4 · stretch: 6 · flat: 3 10 · sleep: 5 |
| dogs | per dog (Chopstick, Pluto): stand: 0 1 · sit: 2 · sleep: 3 (six cells; every fit covers Pluto's grey vest) |

(ROOMS's final map, settled by eye on the cut files with QA's three checks; the fit table in data/pet_art.json is the one source.)

**Head and neck pieces:** one cell, placed on the frame's anchor and turned by the anchor's angle. Head pieces hide in the sleep frame
(creatures 5, dogs 3); neck pieces hide where the neck anchor is null. Everything else shows in every frame, the crying splash included.

**Auras:** two cells, a back half drawn under the pet and a front half over it, on every frame; the bob and spin are done in code.

**Data (data/pet_art.json; LEAD measures the creature anchors on the cut files and writes the fit table):** per creature frame `anchors[f] = {head:[x,y,deg], neck:[x,y,deg]|null,
body:[x,y], aura:[x,y]}` in frame px (the dogs already have head, neck, back, aura; they gain the angle); `fit` = the table above, so a
change is data, not code. QA checks every piece in every frame.

**Order:** ROOMS paints the bare bases' arm gap first (a visible tear every player sees), then the 48 pet pieces.

## Pet clothes data (ROOMS's format, agreed 2026-11-18)

Art `art/app/ppc_<id>_<n>.webp`; `data/pet_clothes.json` = `{id: {kind, pet, anchor?, cells: [{cell, pet, frame, w, h, pivot:[x,y]}]}}`.
kind is head, neck, body, base (the slime's base pieces: body cells placed on the neck/base anchor) or aura. A cell's pivot goes on the
frame's anchor and turns by (anchor deg of the frame) - (anchor deg of the cell's painted frame). Body and base cells follow
`fit.cells`; aura cell 0 is the back half (under the pet), 1 the front half (over it). Dogs: a cell per dog (head and neck 2, body 6:
Chopstick stand/sit/sleep then Pluto's, auras 4). An aura with `"anchor": "head"` (pw_cloud) sits on the head anchor, and on the aura
anchor where the head anchor is null (sleep): its cells carry `pivot` (for the head anchor) and `pivotAura` (for the
fallback). `tools/pet_wear.py check <id> <out.png>` is the placement reference the code matches.

## Patio bed (Cal, 2026-11-18: "Yes, replace it")

With the Patio fully furnished there is no clean free spot (ROOMS's tries: the dog-bed row reads as a kennel, moving the lounge chair
pushes it into the telescope, the back corner hides behind the egg swing, the right rail is off the floor). Cal chose the creature's bed
at 4.25, 3.5 by the fire, in place of the white lounge chair: once a creature (and so its bed) is owned, the lounge chair is superseded
there; the egg chair stays. The Bedroom bed goes in the window corner at 8.9, 2.6.
The chair it replaces is pt_chair1 (Wicker Lounge Chair), already superseded by the Egg Swing in the chair chain; its copy by the
fire only shows when both are owned (27_rooms.js), so no paid piece loses its role and nothing is refunded. The creature's buy confirm
says its Patio bed takes the spot by the fire; after an adoption the chair comes back. The chair's sit spot (4.75, 4.0, tag
"chair") goes and comes back with it, so nobody sits on the pet bed (QA).

## Beds and sizes after QA's review of db99820 (2026-11-19)

- **The pets lie in their beds:** the sleep point is the footprint point under the bed picture's centre nearest the front, and a
  platform sets the ground line sleepOff (ROOMS's numbers) above the bed's bottom edge (QA FIX 1: they floated over or behind them).
- **Patio bed moved to 2.1, 2.6** (data/pet_art.json "spots"): left of the fire pit on the rug's corner, in full view (QA FIX 2: the
  chair's old spot at 4.25, 3.5 was cut off by the view's bottom edge). Its picture overlaps the fire-side chair's, so the chair and its
  seat stay out while a creature is owned, as Cal approved ("Yes, replace it").
- **Sizes (Cal, 2026-11-19: "Make the dogs overall a bit smaller including their bed. And make the pet we buy a bit bigger so it is
  noticeable"):** the dogs 34 to 29 px standing (LFDOGH), their beds at 85% in the Bedroom and on the Patio; the creature 34 to 40 px per
  300 frame px (PZ_K), its beds with it.
- No dog clothes without a dog (QA's note).

## No dog beds outside (Cal, 2026-11-19)

Cal: "Remove the dog beds from outside and only have the pet bed. Chopstick is also floating on top of the bed rather than sleeping on it
properly". Both Patio dog beds (pt_dbed, pt_dbed2) are retired (off sale) and no longer drawn; owners keep the ids. The dogs sleep in
their Bedroom beds and only wander out on the Patio. The creature's Patio bed is at 1.7, 2.6, left of the fire pit, clear of everything
now that Pluto's bed is gone (QA FIX A). The Bedroom dogs sit lower in their beds (platform 3, was 7, then 6).
Refund (Cal, 2026-11-19: "refund for the patio beds but no message of refund necessary"): once per save, each Patio dog bed owned pays
back its price (200 each), silently; S.pbref marks it done.
