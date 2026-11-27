# Streetwear audit (ROOMS 2026-11-27; Cal 11-26 via APPROVALS: "If there is anything that doesn't seem like streetwear, even for the seasonal ones, remake them.")

Source: every gx_ row on qa-local (417 pieces, 19 brands). Nothing is remade until LEAD and QA agree this list.
A remake keeps the garment id where possible (new art, same id, LEAD rewrites the row), or retires the id (owners keep it) and adds a
streetwear piece in the same category, counted toward that brand's 8 per category.

## A. Clear: costume, period, uniform or fancy dress (remake)
- **bb BARD & BLADE (held brand)**: almost the whole brand is fantasy costume. Leaf Circlet, Ranger Hood, Wizard Hat, Laced Leather
  Trousers, Tool-Belt Skirt, Tucked Breeches, Hobnail Boots, Moonsilver Slippers (curled toes), Adventurer's Tunic, Bard's Doublet,
  Quilted Gambeson, Travel Cloak, Crystal on a Cord, Leather Bracers. (Cuffed Boots can stay.) Suggest: re-theme bb as
  "fantasy-inspired streetwear" (earth tones, leather, brass, utility) rather than costume.
- **rg REGIMENT**: parade-uniform costume. Brass Aiguillette, Scarlet Parade Sash, Cord Peaked Cap, Piped Side Cap, Frogged Pencil Skirt,
  Scarlet Dress Trousers, Stripe Riding Breeches, Spat Brogues, Capelet Tunic, Cropped Mess Jacket, Frogged Officer Jacket, Braided
  Waistcoat. (Gauntlet Gloves, Officer Stiletto Boots, Tall Riding Boots borderline.) Suggest: military-surplus streetwear
  (bomber, field jacket, cargo, beret-free caps, combat boots) in navy, scarlet and brass.
- **gp GACHA POP (held brand)**: cute costume, also against Cal's "nothing cute": Little Angel Wings, Bunny Beanie, Cat-Ear Hood,
  Bear Onesie Top, Frilled Sailor Blouse, Candy School Blazer, Fluffy Slipper Boots, Platform Mary Janes with frilly socks, Bubble Shorts.
- **rose VENOM ROSE**: fancy-dress pieces: Satin Bunny Ears, Velvet Devil Horns, Lace Masquerade Mask, Velvet Pillbox Hat, Briar Pipe
  (not clothing), Velvet Smoking Robe, Velvet Smoking Slippers. (The sexy pieces Cal asked for stay: corset, bralette, vinyl, fishnet.)
- **gd GILDED**: Gilded Leaf Crown, Pearl-Button Silk Shirt (lace jabot), Brocade Pointed Loafers.
- **smk SMOKE BOMB**: national-dress / ninja costume: Wide Hakama, Split-Toe Tabi Boots, Shinobi Sandals, Scroll Pouch, Torn Hood Cloak;
  armour pieces Plated Hood, Shadow Gauntlets, Steel Bracers (Plated Collar already off sale).
- **over OVERPASS**: Satin Durag (Cal 11-17: no durags).

## B. Borderline: read as theme or sportswear more than street (your call)
- **sv SØLVBERG (winter)**: Puffy Snow Pants, Ski Leggings, Snowflake Mittens, Nordic Sweater, Shearling Slippers, Ski Goggles.
- **oak OAKMONT (spring)**: Tennis Visor, Terry Headband, Pleated Tennis Skirt, Cable-Knit Tennis Vest.
- **km KAIMANA (spring)**: Straw Sun Hat, Crochet Cardigan, Zip Rash Guard.
- **oc OIL & CANVAS**: painter props: Dipped-Brim Felt Hat (brush in band), Palette Pendant, Brush Roll Sling, Drip Smock Shirt,
  Brushstroke Slingbacks.
- **cr CHROME RAIN (held)**: Mohawk Helmet, Street Armour Vest, Chrome Arm Sleeve, LED Visor (cyber costume vs techwear).
- **sm SAYMØRE**: Neon Halo, Halo Mask (helmet).

## C. Fine as streetwear (no change)
hanga, nc, kp, y2k, alt (gorpcore), sp (gamer graphics), and the rest of the brands above.

Counts: A about 60 pieces, B about 25.

## Decisions (LEAD 2026-11-27, Cal's rule "even for the seasonal ones")
- Method: retire and replace. The old id gets cut (owners keep it); a new streetwear piece with its own id and name goes in the same
  category, counted toward that brand's 8. ROOMS sends LEAD the retire list plus the new rows per brand, inside each brand's 8-per-category pass.
- Already gone in code, not on the list: gx_o_durag (V17GONE), gx_v_robe (V66CUT), gx_smk_platecollar (29zz_v217.js).
- A: all remade.
- B remade: sv Puffy Snow Pants (-> puffer cargo), Ski Leggings (-> nylon track pants), Shearling Slippers, Snowflake Mittens;
  oak Tennis Visor (-> nylon cap), Terry Headband; km Straw Sun Hat (-> bucket), Zip Rash Guard; all oc painter props (felt hat, palette
  pendant, brush roll sling, drip smock, brushstroke slingbacks); cr Mohawk Helmet, Street Armour Vest, Chrome Arm Sleeve; sm Neon Halo,
  Halo Mask.
- B kept (ROOMS's call, QA to check on the figure): sv Ski Goggles pushed up (gorpcore accessory), Nordic Sweater (knitwear reads street
  under a coat; recheck), oak Pleated Tennis Skirt and Cable-Knit Tennis Vest (tennis-core is a street trend), km Crochet Cardigan
  (fashion knit), cr LED Visor and Holo Trench (techwear). Any of these QA flags on the figure moves to the remake list.
- smk Plated Hood is on the remake list, so QA's gap sweep can skip fixing it.
