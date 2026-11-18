# Cal's 11-18 art list: drafts (ROOMS, 2026-11-18)

Cal's decisions from 11-18 came via LEAD (code side c13edd3). Standing rule from Cal: "going forward, never create something this plain
and simple". So every line below names at least two details. Order: QA design review, then Cal, then paint.
Same limits as before: original designs only (no real logos, no trademark trade dress), no cultural costume, adults only. Revealing
and suggestive, never explicit: no nudity, no nipples, nothing sheer over bare skin where it would read as nude. Higgsfield's
NSFW filter is respected, never worded around; a blocked piece is replaced, not retried.

## 0. One rig need first (LEAD): a bare torso for her

The female base body is painted with a grey tank and grey shorts (the male base is bare-chested in grey shorts). Any crop top,
bralette or open-shouldered piece shows that grey tank: QA caught it on the strapless bodysuit (1bbc6b9), and it shows at the slip
dress's neckline too. Proposal: an item flag `bare:1` on a top; when the worn top has it, the rig draws a second female base,
`f_base_bare_front/back` (+ `_yawn`), the same body with the tank painted as plain skin (smooth chibi torso, no anatomy, like his).
Every `bare` top covers the chest, so she is never shown topless. ROOMS paints the three base files; LEAD wires the flag.
GATE (QA ca2fc3e): every `bare` top is rendered on the bare base in all 35 poses (stretchUp, sleep and dance included); any pose that
shows bare-base skin in the chest area holds that piece. `bare` covers the torso only, never the hips: the grey shorts stay, so slits
and side lacing stay below the shorts' line or are lined solid.
Without it, sections 1's tops can't be revealing on her.

## 1. VENOM ROSE: 7 replacements (Cal: "lingerie, a sexy crop top, skin tight top, seductive and revealing clothing")

Same slots as the cut ids, so the brand ends at 5 hats, 6 accessories, 8 tops, 6 bottoms, 5 shoes (30 on sale).

| id | replaces | slot | name | line | tier | body | flags |
|---|---|---|---|---|---|---|---|
| v_horns | v_cap | hat | Velvet Devil Horns | Small oxblood velvet horns on a thin black band, rhinestone tips. | 850 | both | |
| v_harness | v_shade | acc (neck) | Strappy Chest Harness | Black leather straps over the chest, silver O-rings, a buckle at the sternum. | 950 | both | over the top |
| v_bralette | v_rose | top | Lace Bralette Set | Black lace bralette, oxblood satin trim, thin straps, bare midriff. | 1400 | women | bare |
| v_crop | v_mesh | top | Keyhole Crop Top | Skin-tight black long-sleeve crop, keyhole cutout with a silver ring, bare midriff. | 1300 | women | bare |
| v_silkshirt | v_biker | top | Unbuttoned Silk Shirt | Oxblood silk open to the navel, black satin collar, sleeves rolled. | 1600 | men | |
| v_vinyl | v_leather | pants | Lace-Up Vinyl Trousers | Skin-tight glossy black vinyl, laced up both outer seams. | 1450 | both | |
| v_hotpants | v_tulle | pants | Vinyl Lace-Up Shorts | High-waisted glossy black vinyl shorts, silver-eyelet lacing over a solid black side panel (no gap to the base). | 1250 | women | |

Borderline, for Cal to see on the sheet: the harness (fashion harness, not fetish gear: no collar, no leash ring) and the bralette
(lingerie as outerwear).

**Pushing the rest further** (Cal: "Be a little more NSFW for some of the other pieces"), repaints of existing ids, owners keep them:
- v_corset Lace Corset Top: off the shoulder, sweetheart neckline, `bare` (today it is painted up to the neck).
- v_slip Lace Slip Dress: deeper V neckline, `bare` (the grey tank shows at its neckline today); a side slit only below the base shorts' line.
- v_bodysuit Satin Corset Bodysuit: back to strapless with a sweetheart line once `bare` exists (the mesh yoke was only there to hide
  the tank; QA d808aca).
- v_flare Velvet Flares: side slits from the knee down (her base's grey shorts would show through anything higher; QA ca2fc3e).
- v_blazer Wine Velvet Blazer (men): worn open over the bare chest, no shirt.
- Not touched: bunny ears, mask, body chain, robe, pipe, fishnets, mini, stilettos, boots (already pushed on 11-17).

## 2. OVERPASS: 2 accessories (Cal: "swap out the metal chain and the skate tool. Keep the dog tags")

| id | replaces | slot | name | line | tier | body |
|---|---|---|---|---|---|---|
| o_guards | o_lock | acc (arms) | Grip-Tape Wrist Guards | Black wrist guards faced in grip-tape texture, orange hook-and-loop straps, scuffed grey plates. | standard 850 | both |
| o_resp | o_tool | acc (mask) | Spray Respirator | Matte black half-face respirator, orange filter caps, a reflective tape strip. | thrift 700 | both |

(QA ca2fc3e: goggles and a sling already exist in ALTITUDE, SØLVBERG, HANGANG and KODE PINK. The guards use the arms slot like
OAKMONT's wristbands; the respirator is the graffiti side of skate, a mask-slot piece like the gaiter.)

## 3. SAYMØRE: 1 top (Cal: the GO OFF Tee cut, "never create something this plain and simple")

| id | replaces | slot | name | line | tier | body |
|---|---|---|---|---|---|---|
| sm_grille | sm_tee | top | Speaker-Grille Bomber | Black bomber with perforated speaker-grille panels on chest and sleeves, cyan EQ-bar embroidery up the back, orange Ø badge, ribbed cuffs. | 1600 | both |

(QA ca2fc3e: a moto jersey drifted from bass culture and would be a third racing top.)

## 4. Five Street brands to replace GACHA POP, SAVE POINT, BARD & BLADE, KAIMANA, OAKMONT ("Redo everything else")

New brands in their five drop slots (the old ids stay held; owners keep anything they own). About 15 pieces each, every piece with
detail. Names and lanes for Cal to pick or swap:

| slot | brand | sub | tagline | palette | hero pieces |
|---|---|---|---|---|---|
| GACHA POP | STAGE DIVE | 90s grunge | Loud on purpose | black, oxblood, safety-pin silver | patched plaid flannel over a made-up band tee; bleach-splattered jeans with safety pins; studded belt; cherry creepers |
| SAVE POINT | PIT LANE | 90s motorsport | Fast at standing still | race red, white, black, checker | padded racing jacket covered in made-up sponsor patches; leather moto pants with knee panels; racing gloves; checker-sole sneakers |
| BARD & BLADE | MIRRORBALL | 70s disco | Bell-bottoms, no apologies | gold, burnt orange, plum | sequin halter (her); wide-collar swirl-print silk shirt (him); high-waist flares; platform boots; amber aviators |
| KAIMANA | DRY DOCK | fisherman workwear | Smells faintly of rope | navy, mustard, oiled tan | mustard rain slicker with toggles; chunky cable-knit with elbow patches; waxed canvas trousers with rope belt; duck boots |
| OAKMONT | BACK ROW | dark academia | Late library returns since forever | chestnut, forest green, cream | tweed blazer with a layered collar and argyle vest; pleated wool trousers; leather satchel (neck); tassel loafers |

No cultural dress anywhere (no hibiscus, no national prints); the band tee's band and the sponsor patches are invented, with no
readable words. MIRRORBALL's sequin halter is a `bare` top (section 0) and goes through QA's coverage test.

## 5. The Boutique: 3 new brands (Cal: "3 other mid tier but more stylized clothing with lots of detail"); one takes CHROME RAIN's slot

| brand | sub | tagline | palette | hero pieces |
|---|---|---|---|---|
| GILDED (CHROME RAIN's slot) | baroque streetwear | Too much is the right amount | black, antique gold, emerald | gold-brocade bomber; jacquard joggers with gilt piping; pearl-button velvet shirt; embroidered slippers; ornate ear cuff |
| OIL & CANVAS | artist couture | Never washed the paint off | indigo, cream, cadmium splashes | hand-painted denim jacket; patchwork chore coat; paint-splattered wide trousers; embroidered beret; canvas high-tops with brushstrokes |
| REGIMENT | military tailoring | Ranked by outfit | navy, scarlet, brass | officer jacket with braided frogging and epaulettes; riding trousers with a stripe; tall riding boots; peaked cap; brass-button cape (invented crests only: no real insignia, flags, rank badges or medals) |

## 6. Atelier concepts (Cal: "highly stylized and flashy items that are highly desirable, but also expensive"; "no rush")

Rough lanes for Cal to react to before anything is drafted:
- LACQUER: sculptural high-gloss pieces, patent and lacquer that catch the room's light, like wearable art objects.
- HALCYON: iridescent feathers and gradient sheer layers, a cape that shimmers in two colours (feathers on a cape or collar, never a headdress).
- SOLSTICE: gold-and-crystal couture: embellished coats, a jewelled crown-band, mirror-sequin boots.

## 7. Stylist and pets: not drafted yet

- Stylist (new hairstyles, eye shapes, mouths): LEAD asked to agree on the layer format first (a face split for eyes and mouth is a
  rig change). Proposal sent to LEAD separately; no art until we agree.
- Pet shop: LEAD designs the system first. No art.
