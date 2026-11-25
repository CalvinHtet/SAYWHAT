# Cal's 11-24 art list: approval sheet (ROOMS)

Cal approves everything here in one batch at the end; QA wear-tests each group first. Status per group: DRAFT -> WITH QA -> QA PASS.

## A. Evolved pets (secret: ids are opaque, k4 slime, k5 wolf, k6 wyvern) - CAL APPROVED 11-24 ("Approve on all the pet designs"); QA wear-test next
Shaped live with Cal on 11-24 (his notes: more dramatic, epic but cool, not a boss; outfits must still fit; slime becomes a cat
with slime paws and keeps the forehead star; wyvern gets black-purple accents and some flames; evolved bigger than the first form).
- Wolf (k5): silver chest and muzzle, swept-back ice horns, a short flame crest, three flame tails, cyan runes, a crescent moon.
  Shoulders and chest kept smooth for collars, vests and capes. 1.4x the pup.
- Wyvern (k6): adult body, black-purple scales, amber horns and wings, small flames only at the tail and wing tips. 1.4x the baby.
- Slime (k4): an upright jelly cat on round paws (no drips), pink star on the forehead, two flame tails. 1.4x. Walk frames are a walking cat; idle B is a blink of idle A.
- Sheets: pets/sheet_k*.png (Higgsfield), pets/cmp_<pet>.png (first form over evolved, true size),
  pets/ingame_sizes.png (all six in the real Bedroom: beside the player, and asleep in the bed).
- Earlier tries (Cal: "too similar") in pets/v1/.

## B. Pet beds - CAL APPROVED 11-24 (first-form beds; large beds: "3 beds for the pets look great", via LEAD)
Cal 11-24: the baby and adult wolf beds looked the same (they were: one design scaled). When a pet evolves, the Bedroom offers a new
upgrade, a larger bed. ROOMS painted three large beds (pbed_k4/k5/k6): wolf a fur daybed on a stone base with a crescent band (runes removed, QA PASS) with a crescent-moon
headboard and moon-stone; wyvern a black-purple nest on a rock plinth with amber crystals; slime-cat a plum velvet cat bed with a
pink star charm. Each evolved pet asleep on its bed: pets/beds_large_fit.png. LEAD wires the upgrade (hidden until the pet evolves).
- Wolf: the round dog-bowl bed is replaced by a shaggy fur rug with a navy crescent-moon bolster and a moon-stone (pbed_wolf, and
  pbed_k5 at 1.4x). Slime cushion and wyvern nest unchanged; pbed_k4 / pbed_k6 are them at 1.4x.
- Every form checked asleep on its bed in the game (pets/ingame_sizes.png, right-hand crops).

## D. Player-card backdrops (bl_pc_<id>, 900x1200) - ALL 10 CAL APPROVED 11-24 ("The visiting animation and 10 backdrops look great", via LEAD); QA PASS. Ember Throne: the throne's top reads like a dark crown behind the head; kept, Cal asked for no change
neon Neon Alley, skyline Skyline Boulevard, roof Loft Rooftop at dusk, mist Mist Gate, sunrise Sunrise Court, maple Crimson
Maple, fire Fireworks Night, lantern Lantern Sky, ember Ember Throne, moon Blood Moon. Each checked on the real player card for
both bodies (backdrops/card_all_m.png, card_all_f.png). No text, signs, logos or real places. Fixes made: Neon Alley's tubes
that read as letters (IO, M) became a star and a diamond; Fireworks Night's two lettered paper tags and the curtain marks were
painted out. Note for Cal: Ember Throne's throne stands right behind the character (only its top shows above the head).
Sources: backdrops/src_<id>.jpg. Cutter: tools/backdrop_cut.py.

## D2. Tier-2 card backdrops (level 10; Cal 11-25 via LEAD) - ALL 5 DONE, WITH QA
orrery Clockwork Observatory, tidal Tidal Palace, skyship Skyship Deck, aurora Aurora Citadel, hoard Dragon's Hoard.
1200x1600 (2K sources; 4K is not Unlimited), layered depth, fine ornament. Read enlarged: the Observatory floor's
star-in-circle lines were edited to plain rings; the first Hoard was redone (dragon behind the figure, cross-topped crowns).
On the real card, both bodies with a companion: shots/pending_art/cal_1125_tier2/card_tier2_all.png. Retired (Cal 11-25):
roof, skyline, mist, sunrise, ember (deleted a4fb187a).

## H. Calvin and Sydney visit picture (friend_calsyd, _2, _3; Cal 11-24 via LEAD) - CAL APPROVED 11-24 (via LEAD); QA PASS
One painted walk: the two close together, shoulder to shoulder, each holding a leash; Pluto (on his) and Chopstick (on hers)
trot ahead at real size, knee-high. Calvin: black beanie with the game's orange circle-slash, plain charcoal hoodie, baggy black
cargo pants, black sneakers with teal soles. Sydney: long black hair, navy/black varsity with pink trim, baggy light-blue
wide-leg jeans, white sneakers. Three walk frames on one sheet, aligned on the ground line and heads, 1000x675, transparent.
In the real visit card: calsyd/ingame_card.png. Frames: calsyd/frames.png. Source: calsyd/src_walk.jpg.

## E. Face tattoos and scars (<b>_mark_<id>_front, icon_mark_<id>; LEAD's markT/markS layer) - ALL 10 DONE, WITH QA
Tattoos (dark navy ink): t1 Tide Lines, t2 Starfall, t3 Ember Mark, t4 War Stripes (both cheeks), t5 Ivy Curl, t6 Circuit.
Scars (pale raised line, darker edge): s1 Eye Scar (brow to cheek, the eye and brow drawn over it), s2 Cheek Line, s3 Bridge
Scar, s4 Cross Scar. First set had marks at the temple and ear: long hair and fringes hid them, so all ten sit on the open
cheek under the eye now. Checked in the game's rig (rigtest/qa/markcheck.js): every hairstyle x 6 poses, 21 glasses/masks,
5 skin tones, both bodies; marks/checks/all_marks_every_hair.png. Tribal ok; no teardrop, no gang or religious marks.

## C, F, G
Next after D and H: tattoos and scars (E), then pet brands (C), soul stone (F), five Atelier brands (G).
