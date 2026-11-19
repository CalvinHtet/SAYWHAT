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
- **Chopstick and Pluto stay** as they are (Cal's real dogs) unless Cal says otherwise.

## Questions for Cal (open)

1. Do Chopstick and Pluto stay in the Loft as they are, next to the new pet?
2. Can you own all three pets, with one following you at a time, or only one?
3. Should a pet cost coins (about 3,000, a floor-2 big buy), or unlock as a quest reward?
4. Do your girlfriend's character and yours each get their own pet, or do you share one?

## Earlier questions (answered or replaced)

1. Should the Pet Shop open with floor 2 (level 30), or be on the Street so it is there from the start?
2. Overlays as proposed (cheap, one image per piece), or a full repaint of each dog per piece (better fit, eight times the art)?
3. Is a piece bought once for both dogs, or bought per dog?
4. Which pieces first? My suggestion: a bandana, a collar with a tag, a bow tie, a beanie, a hoodie, a raincoat, sunglasses and a
   birthday hat, then seasonal ones.
