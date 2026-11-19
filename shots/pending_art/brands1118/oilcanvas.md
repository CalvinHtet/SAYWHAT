# OIL & CANVAS (Boutique): draft pieces (ROOMS, 2026-11-18), for QA's design review before any paint

Concept approved by Cal 2026-11-18 ("approve all", via LEAD): artist couture, "Never washed the paint off".
Palette: indigo, cream (primed canvas), cadmium yellow, cadmium orange and cadmium red splashes, small cobalt accents.
Technical: no green paint anywhere (every piece is keyed off a green screen) and no magenta or hot pink (the bodies are
flat magenta); the reddest paint is cadmium red, keyed with flatbody_red.

Lane, so it does not repeat what is on sale: this is the fine-art studio (oil impasto, palette knife, gesso, stretched
canvas, brush rolls), not street spray paint (OVERPASS's Spray Paint Boxy Tee), not workwear (OVERPASS's Canvas Chore
Jacket) and not Y2K patchwork (Patchwork Wide Jeans). No beret: GILDED and HANGANG already sell one.

Cal's standing rules: nothing plain (every line names two or more details), original designs only, no cultural dress,
adults only, sexy pieces welcome (skin, never nude). The halter is a `bare` top (QA's coverage gate), the skirt's slit
stays below the shorts' line, the slingbacks use the tiptoe `heel` base.

Trade-dress guard: no famous painting or painter's signature look (no swirling night skies, no primary-colour grid
blocks, no crowns, no radiant figures, no copied drip canvases), no readable signatures, letters or swatch numbers, no
paint-brand labels on the tubes or rolls. All brushwork is invented, loose and abstract.

| id | slot | name | line | body | flags |
|---|---|---|---|---|---|
| oc_cap | hat | Finger-Swipe Studio Cap | Cream cotton ball cap with stitched panels, finger-wiped cadmium orange, red and ochre smears and drips, an indigo-dipped brim. | both | |
| oc_felt | hat | Dipped-Brim Felt Hat | Cream wool felt with a wide brim dipped in indigo, cadmium drips running up the crown, a brush tucked in the band. | both | |
| oc_roll | acc (neck) | Brush Roll Sling | A rolled canvas brush wrap worn across the body, worn-wood brush handles poking out, a paint-stained leather strap. | both | |
| oc_palette | acc (neck) | Palette Pendant | A small carved wooden palette charm on a thin waxed cord, a brass jump ring, four raised dots of cadmium, cobalt and cream. | both | |
| oc_gloves | acc (arms) | Paint-Stained Leather Gloves | Fitted cream fingerless leather gloves, hand-sized, orange paint-stained fingertips, an indigo wrist strap with a brass snap. | both | |
| oc_denim | top | Hand-Painted Denim Jacket | Indigo denim jacket, a loose cadmium sunburst of brushstrokes across the back, cream topstitching, copper buttons. | both | |
| oc_coat | top | Patchwork Studio Coat | Long cream coat pieced from canvas offcuts, indigo running stitch, paint-smeared patch pockets, a brush in the breast pocket. | both | long coat (QB_STRAY 0.12, hemtrim) |
| oc_smock | top | Drip Smock Shirt | Oversized cream smock with a gathered yoke, open at the chest, rolled sleeves, cadmium and cobalt drips down the front. | both | |
| oc_halter | top | Paint-Drip Halter | Cream linen halter, cadmium drips falling from the neckline, an open back, a knotted indigo neck tie. | women | bare |
| oc_trouser | pants | Splattered Wide Trousers | Cream wide-leg linen, pleated waist, cadmium and indigo splatter, a palette knife clipped to a belt loop. | both | wide |
| oc_jean | pants | Gesso-Dipped Jeans | Raw indigo straight jeans dipped in cream gesso to the knee, cadmium drips below, copper rivets. | both | |
| oc_skirt | pants | Brushstroke Wrap Skirt | Cream canvas wrap midi, one sweeping indigo brushstroke round the hem, a side slit, a brass stretcher-pin closure. | women | skirt |
| oc_boot | shoes | Gesso Studio Boots | Cream canvas lace-up studio boots crusted with gesso, cadmium flecks, indigo laces, a chunky cream sole. | both | |
| oc_derby | shoes | Splatter Suede Derbies | Indigo suede derbies, cream splatter, cadmium-red laces, a cream stitched welt. | both | |
| oc_sling | shoes | Brushstroke Slingbacks | Cream slingback heels, one cadmium brushstroke over the toe, an indigo heel and strap. | women | heel (tiptoe) |

Counts: 2 hats, 3 accessories, 4 tops, 3 bottoms, 3 shoes = 15. Grades as GILDED (Boutique 950-1,900; coat and denim
jacket luxury). Brand key "oc".
Logo: a small stretched-canvas square, three palette-knife smears on it (indigo, cream, cadmium), no letters.
Banner: a primed canvas wall above a splattered drop cloth, a few cadmium handprints, no text.

QA a5 review (2026-11-18): PASS, four NOTES applied: high-tops became studio boots (6th high-top otherwise); the brush
roll's handles big enough to read; the denim sunburst is loose strokes, no centre figure; the coat's hem straight and clear
of the hands; the palette pendant large. Hats: nothing below the band, the brush points up and back.

Questions for QA (answered):
1. The felt hat's tucked brush and the cap's brim: hat-fringe risk (GILDED's beret read as bangs). I would paint both with
   nothing hanging below the band, and test with hatcheck under every hair.
2. The brush roll sling crosses the chest: neck slot with chain mode `2 0.5`, like the body chain. Fine, or arms?
3. Is the open-chest smock on his body enough "sexy" for the brand, or should his side get one more skin piece?

## Painted (ROOMS, 2026-11-18): status for QA's wear-check

All 15 painted on Nano Banana Pro (Unlimited), one image per piece holding every angle; logo_oc (a stretched canvas with three
palette-knife smears) and ui_banner_oc (a studio wall of painted canvases, cropped clear of a seam the generator left).
Redone once before keeping: denim (the first back was a centred sun emblem, now loose diagonal sweeps), halter (read as a bib, now
shaped cups, knot, piping), skirt (plain towel wrap, now frayed diagonal overlap, slit, brass pin), cap (polka-dot thumbprints and
a wavy brim read cute, now finger-wiped smears; it came out a ball cap, renamed Finger-Swipe Studio Cap). The gloves' first run
was refused by Higgsfield's filter (bare bodies); the identical prompt passed on the second run, nothing reworded.
The felt hat's brim sat on her eyes: items.json lift {m 90, f 90} and its hair clip moved up by the same amount (90/2528), so no
bald band from behind. Sheets: oilcanvas_approval.png, oilcanvas_wear_m/f.png (41 poses), oilcanvas_close_m/f.png (6 poses, HI 3).
Checked by ROOMS: both bodies, 41 poses, 15 + 19 outfits, 0 not drawn, 0 page errors; hatcheck on both hats (h1-h3, both bodies);
the halter on her bare base (no tank). Known, for QA to judge: the gloves read as chunky knit arm-warmers (the arm bone carries
the whole forearm); tiny specks beside her arm with the halter in stretchUp and dance2 (the rig's underarm wisp?).

QA 2026-11-18 (f041b24, NOT A PASS: three FIXes) applied: gloves repainted with a fresh design (fitted leather, hand-sized; the knit
mitts were wider than the forearm), the pendant repainted about a third of the old size, the smock flagged `bare` (her grey tank
showed in the V; on the bare base the V shows a strip of skin above the bust).
