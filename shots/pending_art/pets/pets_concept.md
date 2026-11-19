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

## Final frames (ROOMS, 2026-11-18): painted, cut, for QA

Cal 2026-11-18: "Approve both" (the concepts; REGIMENT's sheet). Cal (via LEAD) the same day: "can we make them all a slightly
different color so they look unique and different?" So each pet has its own colour: wolf pup charcoal with icy cyan flame, eyes,
paw marks (no violet); wyvern navy steel with molten amber-gold markings and eyes (LEAD's neon green is impossible: green keys out,
and QA banned green eyes on it); fox-slime plum with hot pink eyes, sparkles and tail tip.

One Higgsfield sheet per pet (12 cells, 4 x 3, flat green), then edits of that same sheet, nothing reworded around a filter:
- wolf: tail flame added where it was missing (trot B, sit, trip, the four crying frames, dim but lit), the den lowered (it came
  back as a low open round bed, no hood), frame 5 without a bed.
- wyvern: hover A and sit redrawn (were standing, facing left), frame 5 without the nest.
- slime: idle B got its tail back, the bounce and the stretch lost stray legs and arms, frame 5 without the cushion.
Cut by quest-board/tools/pet_cut.py (keys green only, no magenta key; despill to max(r,b); specks dropped; the slime's green rim
cleaned with --edgefix 5; left-facing slime cells mirrored: 0, 4, 8, 9). Sheets kept in final/sheet_<pet>.png.

Files: art/app/pgx_<pet>_0..10.webp (11 frames per pet, one canvas each) and pbed_<pet>.webp; data/pet_art.json (canvas, the
cx column, bed size and sleepOff, the dog anchors). Sizes against the dogs (pets_final_sizes.png, _loft.png at about room size):
the pup about the dogs' height (320 px with flames), the wyvern a little taller (340), the slime a little smaller (195).
Bed fit (sleep frame over its bed): wolf 40 px, wyvern 20, slime 40 above the bed's bottom edge.
Sheet: pets_final_frames.png (every frame per pet on its ground line, the bed, the pet in its bed).

Known, for QA to judge: the wolf's mist is translucent teal over the fur (it came painted that way, keyed clean); a faint warm
tint stays on two of the slime's tail tips (idle B, squash); the wyvern's hover A dangles its tail to the ground line; the trip
and wobble frames keep their little motion lines.

Beds in the rooms (free-floor check, everything bought, beds/): Bedroom: a pet corner at x 0.15, y 6.55 against the left wall by
the mirror, clear of the mirror and the dog bed. Patio: no clean spot when fully furnished: the front row clips the lounge chair,
the back-left corner hides behind the egg swing, the right rail falls off the floor. Needs a layout call (LEAD, maybe Cal).

QA d2f4bfb (NOT A PASS, two FIXes) applied:
- Wyvern frame 6 (two spade tails, head floating without a neck): repainted as a happy hop, right way up, facing right, wings wide,
  neck showing, one tail with one spade. An edit of the same sheet; only that cell changed (mean pixel change per cell: 36 there,
  3-4 elsewhere, which is re-encode noise). Floats like the hovers (--float 2,3,6). New canvas 373 x 394, cx 192 (pet_art.json).
- Slime olive tail tips: pet_cut.py --edgefix now recolours any pixel whose green beats its blue (olive, khaki, tan; near the
  edge also dusty rose-brown) from the nearest clean solid pixel, and drops faint ones (the green floor shadow under a glow).
  QA's olive.js reads 0 on every slime frame (and still 0 on the wolf). Left: a soft mauve shadow under the tail tip on sit and
  sleep (pink over plum, not spill).

Bed spots, redone after QA's kennel-row note (LEAD: its own spot, not lined up with the dog beds), beds/:
- Bedroom: the window corner, x 8.9, y 2.6 (bedroom_petbed_window_8.9_2.6.png): clear of the doormat, the desk chair and the path
  from the Patio door, far from the dog beds. 0.15, 6.55 is out (kennel row).
- Patio: no clean spot of its own when fully furnished. Moving the lounge chair right (0.6 and 0.9) pushes it off the bottom of the
  view toward the telescope and still lines the pet bed up with the dog beds. The one workable option needs a supersede: the pet
  bed takes the lounge chair's spot (4.25, 3.5) and the chair goes (it only shows once the egg swing is bought); its front edge
  is cut by the view's bottom, as the chair's was. LEAD to take it to Cal.
