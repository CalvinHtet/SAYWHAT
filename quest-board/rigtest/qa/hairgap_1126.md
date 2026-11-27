# Headwear x hairstyle sweep, Cal 11-26 (QA)

Cal: "Make sure they look good on every hairstyle for male and female so that there is no weird gaps. They should look natural."

**What was checked:** qa-local f6690dec, rigtest/qa/hairgap.js. All 89 live head pieces (63 hats, 17 glasses, 6 masks, plus 3 more). Every hairstyle: male Buzz Cut, Mid Part, Tousled, Combover, Long, Man Bun, Crop, Wolf Cut; female Long, Bob, Ponytail, Wavy, Wolf Cut. Eight poses: idle, stretch, sideL, sideR, rearStand, dance1, wave1, thinkA. Each frame is drawn with Fair and Deep skin and with brown and blonde hair, so skin and hair are told apart by colour swap rather than guessed. Each frame is measured against the same figure with nothing on.

**Lighter pass:** all 30 neck pieces and 28 hooded or high-collar tops, on idle, sideL, sideR, rearStand and dance1.

**What was not checked:** walks, cheer, laugh, sleep; hair colours other than brown and blonde; layering of two pieces at once. Glasses, masks and neck pieces scored only on a one-pixel bang-edge artifact (the Wolf Cut sideR bangs); by eye they are clean. The worst frames were judged by eye; the rest only by the numbers.

## What is wrong, by kind

1. **Hair cut off in a hard straight line (the clip line), on almost every brimmed hat, cap and beanie. Owner: LEAD (rig), with ROOMS for per-piece clip data.**
   - **Ponytail (f):** the ponytail is removed. What is left at the side ends in a hard straight edge (stretch, sideL, sideR, rearStand), often with a sliver of scalp near the ear.
   - **Long, Wavy, Bob (f) and Long (m):** from behind (rearStand), the hair below the brim is sliced diagonally on the left and vertically on the right. From the side and in stretch, the far-side hair ends in a vertical straight edge under the brim, sometimes with a thin gap of background between brim and hair.
   - Because it is the same on dozens of pieces, this is the clip polygon itself, not each piece's art. Fixing it piece by piece would be slow. A rig fix (clip only where the piece covers, or feather the clip edge so the hair fades under the brim instead of ending in a line) would fix them all; then recheck.
2. **Bald scalp beside the piece. Owner: ROOMS.**
   - Velvet Pillbox Hat (gx_v_veil): f Wolf Cut sideL, a bald patch on top beside the pillbox.
   - Ø Beanie (gx_sm_beanie): f Long rearStand, a sliver of scalp at the left of the beanie.
   - Satin Bunny Ears and Bunny Beanie show the worst bald scalp of all, but both are retiring.
3. **Gap between the brim and the hair. Owner: ROOMS.**
   - Straw Sun Hat (gx_km_straw): f Ponytail and Bob sideL, background shows between the brim and the hair on the right.
4. **Loose bits. Owner: ROOMS.**
   - Travel Cloak (gx_bb_cloak): dance1, every male hairstyle, a loose brown sliver floats beside the raised hand.
   - Plated Hood: a loose orange chip by the jaw on the viewer's right, and the hood fabric is missing on that side. Retiring.
   - Not faults: Briar Pipe smoke and the Brush Roll Sling's brush tips are loose on purpose.

## Every piece, worst first

Score = hard-cut pixels + gap pixels + 2 x loose-piece pixels, per hairstyle, counting only hairstyles that score 150 or more. Each entry shows the hairstyle and its worst pose.

- **Briar Pipe** (gx_v_pipe, glasses) — smoke puff, by design: m Tousled stretch, m Mid Part stretch, m Long stretch, m Crop stretch, m Combover stretch, m Buzz Cut stretch, m Man Bun sideR
- **Plated Hood** (gx_smk_platehood, hat) — retiring (off sale): m Mid Part wave1, m Tousled sideR, m Man Bun sideL, m Crop stretch, m Combover stretch, m Buzz Cut stretch, f Bob stretch, m Long rearStand, f Ponytail stretch, f Wavy stretch, f Wolf Cut stretch, f Long stretch
- **Rib Knit Hood** (gx_h_bala, hat) — hair hidden on purpose; clean by eye: f Long stretch, f Wavy stretch, f Bob stretch, f Ponytail stretch, f Wolf Cut stretch, m Long stretch, m Wolf Cut stretch, m Mid Part stretch
- **Mohawk Helmet** (gx_cr_mohawk, hat): f Ponytail stretch, f Wavy stretch, m Wolf Cut stretch, f Bob stretch, m Mid Part stretch, m Long stretch, f Long sideR, f Wolf Cut stretch, m Crop sideR, m Tousled wave1, m Man Bun sideL
- **Cat-Ear Hood** (gx_gp_cathood, hat): f Ponytail stretch, f Long stretch, f Bob stretch, f Wavy stretch, f Wolf Cut stretch, m Long stretch, m Wolf Cut rearStand, m Mid Part stretch
- **Earflap Cap** (gx_al_flap, hat): f Wavy stretch, f Long stretch, f Bob stretch, f Ponytail stretch, m Mid Part stretch, f Wolf Cut stretch, m Long stretch, m Wolf Cut stretch
- **Trapper Hat** (gx_sv_trapper, hat): f Ponytail stretch, f Wavy stretch, f Long stretch, f Bob stretch, f Wolf Cut stretch, m Long stretch, m Wolf Cut stretch, m Mid Part wave1
- **Shadow Hood Cap** (gx_smk_hoodcap, hat): f Bob stretch, f Ponytail stretch, f Wavy stretch, f Long stretch, f Wolf Cut stretch, m Mid Part stretch, m Long wave1, m Wolf Cut stretch
- **Wizard Hat** (gx_bb_wizard, hat): f Wavy rearStand, m Long rearStand, f Long rearStand, f Bob stretch, f Ponytail stretch, m Mid Part rearStand, f Wolf Cut rearStand, m Wolf Cut rearStand, m Crop rearStand, m Tousled sideL
- **Velvet Captain's Cap** (gx_v_captain, hat): f Ponytail stretch, f Bob stretch, m Mid Part stretch, f Wavy stretch, f Long stretch, f Wolf Cut stretch, m Wolf Cut wave1, m Long wave1, m Tousled wave1
- **Velour Newsboy Cap** (gx_y_velcap, hat): f Ponytail stretch, f Bob stretch, f Wavy stretch, m Mid Part stretch, f Long wave1, m Wolf Cut wave1, f Wolf Cut stretch, m Long wave1, m Tousled wave1
- **Five-Panel Skate Cap** (gx_o_5panel, hat): f Ponytail stretch, m Mid Part stretch, f Bob stretch, f Wavy sideL, f Long sideL, m Wolf Cut stretch, f Wolf Cut sideL, m Long sideL, m Tousled sideL, m Crop sideL
- **Bunny Beanie** (gx_gp_bunny, hat) — retiring: m Mid Part rearStand, f Ponytail rearStand, m Man Bun rearStand, f Wavy rearStand, m Long rearStand, m Wolf Cut rearStand, m Crop rearStand, m Tousled rearStand, f Bob rearStand, f Long rearStand
- **Newsboy Cap** (gx_h_news, hat): f Ponytail stretch, f Bob stretch, m Mid Part stretch, f Wavy stretch, f Wolf Cut stretch, f Long stretch, m Wolf Cut wave1, m Long wave1
- **Sweatband Cap** (gx_oak_cap, hat): f Wavy stretch, m Mid Part stretch, f Ponytail stretch, f Bob stretch, f Long stretch, m Wolf Cut stretch, m Long sideL, m Tousled sideR
- **Visor Beanie** (gx_smk_visorbeanie, hat): f Ponytail stretch, f Bob stretch, f Wolf Cut stretch, f Long stretch, f Wavy stretch, m Mid Part stretch, m Long rearStand, m Wolf Cut stretch
- **Dipped-Brim Felt Hat** (gx_oc_felt, hat): f Wavy rearStand, f Ponytail sideR, f Wolf Cut sideL, f Bob sideL, m Wolf Cut sideL, m Long sideL, m Mid Part sideL, m Tousled sideL
- **Spiky Headwrap** (gx_smk_wrap, hat): f Ponytail thinkA, m Long thinkA, f Long rearStand, f Wavy rearStand, m Wolf Cut rearStand, f Bob thinkA, m Man Bun thinkA, m Mid Part thinkA
- **Faux Fur Trapper** (gx_y_furtrap, hat): f Wavy dance1, f Long dance1, f Ponytail stretch, f Bob stretch, f Wolf Cut stretch, m Long rearStand
- **Cord Peaked Cap** (gx_rg_cap, hat): f Ponytail rearStand, f Wolf Cut rearStand, m Mid Part rearStand, m Wolf Cut rearStand, f Bob rearStand, f Wavy rearStand, m Long rearStand, f Long rearStand, m Tousled rearStand
- **Pixel Heart Beanie** (gx_sp_beanie, hat): m Mid Part stretch, m Wolf Cut stretch, m Long stretch, f Ponytail stretch, f Wavy rearStand, f Long rearStand, f Bob stretch, f Wolf Cut stretch
- **Long-Bill Washed Cap** (gx_h_longbill, hat): f Wavy stretch, f Ponytail stretch, f Bob stretch, m Mid Part stretch, f Long stretch, m Wolf Cut stretch, m Long stretch
- **Wordmark Cap** (gx_nc_cap, hat): m Mid Part stretch, m Long stretch, f Bob stretch, m Wolf Cut stretch, f Wavy stretch, f Ponytail stretch, f Long stretch, m Tousled wave1
- **Pink Rhinestone Trucker** (gx_y_truck, hat): f Wavy sideL, f Ponytail stretch, m Mid Part stretch, f Bob stretch, f Wolf Cut rearStand, m Wolf Cut stretch, f Long sideL, m Crop rearStand, m Tousled rearStand
- **Flat-brim Snapback** (gx_h_snap, hat): f Ponytail stretch, f Wavy sideL, m Mid Part stretch, f Bob stretch, f Long sideL, m Tousled sideR, m Wolf Cut sideL
- **Glow-Rim Hood** (gx_cr_hood, hat): m Long dance1, f Wavy dance1, f Long dance1, f Bob stretch, f Ponytail stretch, f Wolf Cut stretch
- **Ø Beanie** (gx_sm_beanie, hat): m Mid Part stretch, f Long rearStand, f Wavy rearStand, m Wolf Cut stretch, f Ponytail rearStand, f Bob rearStand, m Long stretch
- **Rooster Beanie** (gx_nc_beanie, hat): m Mid Part stretch, f Wavy rearStand, f Long rearStand, m Wolf Cut stretch, m Long stretch, f Ponytail rearStand, f Bob rearStand
- **Pom-Pom Beanie** (gx_sv_pom, hat): f Ponytail stretch, f Wavy rearStand, f Long rearStand, m Long rearStand, f Bob rearStand, m Wolf Cut rearStand
- **Straw Sun Hat** (gx_km_straw, hat): f Ponytail sideL, f Bob sideL, f Wavy sideL, f Long sideL, m Long rearStand
- **Fleece Dad Cap** (gx_nc_band, hat): f Wavy stretch, f Ponytail stretch, f Bob stretch, m Mid Part stretch, f Long stretch
- **Hiking Bucket Hat** (gx_al_bucket, hat): f Long rearStand, f Bob rearStand, f Wavy rearStand, m Long rearStand, f Ponytail stretch
- **Finger-Swipe Studio Cap** (gx_oc_cap, hat): f Wavy stretch, f Ponytail stretch, f Bob stretch, f Long stretch, m Mid Part stretch
- **Denim Bucket Hat** (gx_y_bucket, hat): f Long rearStand, f Wavy rearStand, m Long rearStand, f Bob stretch, f Ponytail stretch
- **Gold-Leaf Quilted Cap** (gx_gd_cap, hat): f Wavy stretch, f Ponytail stretch, f Bob stretch, m Mid Part rearStand, f Long stretch
- **Ranger Hood** (gx_bb_mantle, hat): f Wavy dance1, f Long dance1, m Long dance1
- **Piped Side Cap** (gx_rg_side, hat): f Ponytail stretch, f Bob stretch, m Mid Part stretch, f Wolf Cut stretch, f Wavy stretch
- **Padded Nylon Bucket** (gx_h_pbucket, hat): f Long rearStand, f Bob rearStand, f Wavy rearStand, m Long rearStand
- **Reflective Bucket** (gx_o_reflect, hat): f Long rearStand, f Bob rearStand, f Wavy rearStand, m Long rearStand
- **Faded Bucket Hat** (gx_km_bucket, hat): m Long rearStand, f Bob stretch, f Long sideL, f Ponytail stretch, f Wavy stretch
- **Neon Stripe Bucket** (gx_kp_bucket, hat): f Long rearStand, f Bob stretch, m Long rearStand, f Wavy stretch
- **Twin-Tail Bandana** (gx_smk_tails, hat): m Mid Part wave1, f Ponytail stretch, m Tousled sideR, f Bob stretch
- **Racing Patch Cap** (gx_y_race, hat): m Mid Part stretch, m Wolf Cut stretch, f Ponytail stretch
- **Coin Cap** (gx_sp_cap, hat): f Bob rearStand, m Long rearStand, f Wavy rearStand
- **Wool Beret** (gx_h_beret, hat): f Ponytail thinkA, f Bob thinkA
- **Satin Bunny Ears** (gx_v_bunny, hat) — retiring: f Ponytail stretch

Under 150 on every hairstyle and pose (43): Velvet Pillbox Hat, Smoke Rectangle Shades, Spray Respirator, Lime Oval Shades, Smoke Respirator, Slim Tinted Shades, Airport Face Mask, Tech Gaiter, Butterfly Shades, Rift Mask, Vent Mask, Vented Face Mask, Half-Face Cowl, Rimless Gradient Shades, Neon Tube Clips, Round Tinted Shades, Chrome Night Headphones, Satin Bow, Pixel Shades, Mirror Shades, Leaf Circlet, Rimless Aviators, Shield Shades, Velvet Devil Horns, Heart Shades, Ember Slit Visor, LED Visor, Lace Headband, Lace Masquerade Mask, Scout Lens, Night Goggles, Glacier Goggles, Neon Halo, Gilded Leaf Crown, Terry Headband, Brooch Velvet Beret, Ski Goggles, Stitched Headband, Halo Mask, Holo Sun Visor, Coral Sun Visor, Tennis Visor, Gaming Headset.

## Pictures

In QA's scratchpad: hg2/hairgap_NN_*.png (dressed | bare | marks; red = gap, orange = hard cut, magenta = bald scalp, cyan = loose bit), and hgs/sheet_*.png (every hairstyle in stretch, sideL and rearStand) for the Earflap Cap, Newsboy Cap, Wizard Hat, Rib Knit Hood and Mohawk Helmet.

To redo it: BASE=<build> OUT=<dir> NODE_PATH=<playwright> node rigtest/qa/hairgap.js. Use IDS=... SHEET=1 for one piece's sheet.

## Recheck after the fix (QA, 11-26 late)

LEAD 664d24f3 (the rig fades hair over a short band above the clip line) + ROOMS 658eb9bd (tools/clip_lines.py over 56 hats). Full rerun of hairgap.js, same 89 pieces × 13 hairstyles × 8 poses, built from qa-local 658eb9bd.
- Totals (hard cut + gap + loose bits + 2 × bald scalp, summed over every hairstyle): 228,767 before, 156,218 after (−32%). Ponytail alone: 34,117 → 22,746 (−33%). 45 hats better, 1 worse (Velvet Pillbox Hat: 4,848 → 6,120, on the retire list), the rest unchanged (no clip line: glasses, clips, horns, headphones, circlet, bow).
- By eye (every female hairstyle, stretch, sideL, sideR, rearStand; Newsboy Cap, Trapper Hat, Earflap Cap; Coin Cap on every male hairstyle): long, wavy and bob hair now falls naturally under the brim from behind and from the side. No more diagonal or vertical slices. The ponytail hangs out behind caps (Newsboy sideR and rearStand). The ear-flap hats show hair below the flaps.
- Left (LOW):
  - (a) On the Trapper Hat and Earflap Cap, the ponytail's tip peeks out past the flap as a thin loose wisp in sideR, and as a small spike above the flap in sideL.
  - (b) Coin Cap: a doubled outline arc just outside the crown at the top in the front and side views, on every hairstyle (art, not the clip).
  - (c) The two bunny pieces are still the worst, but both are retiring.
