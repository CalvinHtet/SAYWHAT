# Pet Shop creatures: concept sheets (ROOMS, 2026-11-18), for QA's design review. Concepts only, no final frames.

From LEAD's messages and docs/PET_SHOP.md (Cal 2026-11-18): one creature per player, the third pet after Chopstick and Pluto,
floor 2 (level 30), a big buy. Each brings its own bed in the Bedroom and on the Patio, and has a crying splash for adoption.

Style: the dogs' painted sticker style (dgx_chopstick, dgx_pluto were the style reference: same outline weight, shading and size).
Original designs only. These are common fantasy types (shadow wolf, baby wyvern, slime). No named character, no "Shadow Monarch",
no copy of the famous isekai slime (that one is a blue teardrop; ours is a violet-black dome with fox ears and a misty tail).

| pet | look | idle loop | move | fun move | crying (4 frames) | Bedroom / Patio bed |
|---|---|---|---|---|---|---|
| Shadow wolf pup | palm-sized, black fluffy fur, oversized paws, big ears, glowing cyan eyes, violet-cyan shadow flame on tail and ear tips | tail flame flickers | trots | trips over its own paws | big wet eyes, tears, sniffle; ears droop, tail flame dims | den cushion: a round dark cushion with a low hooded back |
| Void wyvern | chubby upright baby wyvern, stubby wings, two short horns, obsidian scales with neon cyan-violet markings | little wing flaps | hovers by the shoulder or waddles | a happy loop in the air | big wet eyes, tears, sniffle; wings fold around itself | perch nest: a low round nest on a short stand |
| Shadow fox-slime | violet-black translucent dome, smoke swirls, fox ears, misty tail, glowing cyan eyes | wobble | bounces or floats | squash and stretch | big wet eyes, tears, sniffle; the whole body sags flat | low pillow: a wide flat cushion |

Sheets (one image per pet for poses; one more per pet for the crying loop and the two beds):
- pet_wolf_concept.png, pet_wyvern_concept.png, pet_slime_concept.png: front, back, idle, walk or hover, sit, sleep, fun move.
- pet_*_cry_beds.png: four crying frames (front, splash size) and the den / nest / pillow beds.

Beds, placement (later, after concept approval): the Bedroom's dog beds sit at x 2.0 and 4.7 on the front edge, the Patio's at 1.6
and 0.2 on the 3.8 row. Before placing, ROOMS checks free floor in every style and fully furnished (rooms-never-cluttered,
no-unintended-overlaps) and posts the spot to QA.

## Painted (ROOMS, 2026-11-18): concept sheets for QA's design review

pets_concept_sheet.png (all three, small) plus the full sheets: pet_wolf_concept.png (8 poses), pet_wyvern_concept.png (12: it gave
extra poses), pet_slime_concept.png (9), and pet_*_cry_beds.png (the 4-frame crying loop and the Bedroom / Patio beds).
All three share one palette (black or violet-black with glowing cyan), so they read as one family from the same shop. Questions for
QA: (1) is the wolf pup too close to a dog (Cal: "not a basic dog"), or does the shadow flame carry it; (2) are the wyvern's beds
(a woven nest on a stand, a rattan nest on legs) too tall for the Bedroom's front edge, or should they sit flat on the floor;
(3) anything that reads as a named character. Nothing final is painted; frames, keying and bed placement follow Cal's last answers.

## QA review (2026-11-18): PASS with NOTES, applied

- Wolf pup: the flame stays on the tail and ear tips in every frame (dim when sad, never gone), plus glowing cyan flame-swirl paw
  markings and violet shadow mist off the fur, so it never reads as a plain black puppy.
- Beds: the wolf's hooded den is lower (hood about half as tall); the wyvern's tall rattan stool became a floor nest; the slime's grey
  donut (too close to Pluto's) became a tufted indigo canvas square cushion. Keep the wolf's den under about 1.5x the dog beds' height.
- Wyvern watch-out: no rounded ear-flaps, green eyes or split tail fin (a famous animated black dragon).

## Final frames (LEAD, 2026-11-18): one list for all three pets

11 frames each, all front 3/4 facing right (LEAD flips for left, like the dogs); no back views (pet clothes would need back art too):
0-1 idle A/B (the loop), 2-3 move A/B, 4 sit, 5 sleep lying in its bed, 6 fun move, 7-10 crying for the adoption splash.
Same canvas and ground line for all 11 frames of a pet (clothing anchors measured once per frame). Size against the dgx_ dogs: the
pup about the dogs' height, the wyvern a little taller, the slime a little smaller. Pets only for now; dog clothes wait on Cal.

Applied in the sheets: pet_wolf_concept.png (flame, paw marks, mist in all 8), pet_wyvern_cry_beds.png (floor nest),
pet_slime_cry_beds.png (tufted indigo square cushion). Not applied in a sheet: the wolf's crying-and-beds edit was refused by
Higgsfield's filter (a false positive); per the rule it was not resubmitted. pet_wolf_cry_beds.png keeps the earlier crying frames
and the taller den; the final frames will carry the flame, paw marks and mist in all four crying frames, and the final den will be
about half as tall.
