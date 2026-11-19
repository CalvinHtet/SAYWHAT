# REGIMENT (Boutique): draft pieces (ROOMS, 2026-11-18), for QA's design review before any paint

Concept approved by Cal 2026-11-18 ("approve all", via LEAD): military tailoring, "Ranked by outfit".
Palette: navy, scarlet, brass, with black patent and a little ivory. Nothing green (keyed), nothing magenta or hot pink (the
bodies are flat magenta); scarlet keys with flatbody_red.

Cal's standing rules: nothing plain (every line names two or more details), original designs only, no cultural dress, adults only,
sexy pieces welcome (skin, never nude). The mess jacket and the waistcoat are `bare` tops (QA's coverage gate), the skirt's slit stays
below the shorts' line, the stiletto boots use the tiptoe `heel` base.

Insignia and costume guard (QA's earlier NOTE: invented crests only): no real insignia, flags, rank badges, chevrons, stars, pips or
medals; no eagles, crowned lions or national emblems; no real regiment's colours. The only crest is invented: a brass knot inside a
plain ring. Not a costume either: no famous singer's red stage jacket with an armband, no pastel satin band-uniform suits, no
bearskins, shakos or plumes, no kilts or tartan. Trade dress: no fashion house's signature power-shoulder jacket with rows of
embossed gold buttons; REGIMENT's buttons are plain domed brass, the shoulders natural.

Overlap check: the Shop's only military-ish piece is VENOM ROSE's Velvet Captain's Cap (oxblood velvet, patent brim). REGIMENT's
peaked cap is navy wool with a scarlet band and a brass chin cord, and the brand's second hat is a side cap, a different shape.

| id | slot | name | line | body | flags |
|---|---|---|---|---|---|
| rg_cap | hat | Cord Peaked Cap | Navy wool peaked cap with a low, firm, flat-topped crown, a scarlet band, a twisted brass chin cord, the brass knot crest, a black patent peak. | both | |
| rg_side | hat | Piped Side Cap | Navy wool side cap worn tilted, scarlet piping along every edge, two small brass buttons at the front. | both | noClip if it sits on top of the hair |
| rg_cord | acc (neck) | Brass Aiguillette | Braided brass cords hung as a fashion cord in loose loops across the chest from the right shoulder, two brass tips swinging free, a scarlet knot at the shoulder. | both | chain mode |
| rg_sash | acc (neck) | Scarlet Parade Sash | A wide scarlet silk sash across the body, a fringed brass-thread end at the hip, a plain domed brass buckle; no star, badge or medallion. | both | chain mode |
| rg_gloves | acc (arms) | Gauntlet Gloves | Ivory leather gloves with flared navy gauntlet cuffs, scarlet piping, a brass button at each wrist. | both | hand-sized cuff |
| rg_jacket | top | Frogged Officer Jacket | Navy wool, three rows of brass braided frogging across the chest, a scarlet stand collar and cuffs, plain navy shoulder boards with a brass button. | both | |
| rg_capelet | top | Capelet Tunic | A fitted navy tunic with a short scarlet-lined capelet ending above the elbow, brass buttons down the front, a brass chain clasp. | both | capelet above the elbow, hemtrim, clear of the hands |
| rg_mess | top | Cropped Mess Jacket | A cropped scarlet mess jacket worn open over a navy bandeau, brass buttons, black satin lapels, bare midriff. | women | bare |
| rg_vest | top | Braided Waistcoat | A sleeveless navy waistcoat worn on the bare chest, scarlet piping, brass braid loops, a low V. | men | bare (his base is bare already) |
| rg_breeches | pants | Stripe Riding Breeches | Navy jodhpur-cut breeches, a wide scarlet side stripe, brass buttons at the knee. | both | |
| rg_trouser | pants | Scarlet Dress Trousers | Slim scarlet wool trousers, a navy double side stripe, brass buckle side tabs. | both | |
| rg_skirt | pants | Frogged Pencil Skirt | Navy pencil skirt, brass frogging down one side, a scarlet hem stripe, a back slit. | women | skirt |
| rg_boot | shoes | Tall Riding Boots | Knee-high black patent riding boots, a scarlet top band, a brass strap buckle at the ankle. | both | |
| rg_spat | shoes | Spat Brogues | Black brogues under navy wool spats, a row of brass buttons up the side, scarlet laces. | both | |
| rg_stiletto | shoes | Officer Stiletto Boots | Navy patent ankle boots on a slim stiletto, brass buttons up the side, a scarlet heel. | women | heel (tiptoe) |

Counts: 2 hats, 3 accessories, 4 tops, 3 bottoms, 3 shoes = 15. Prices as GILDED and OIL & CANVAS (Boutique 950-1,900; jacket and
capelet luxury). Brand key "rg".
Logo: the brass knot inside a plain ring on a scarlet ground, no letters.
Banner: a dark navy dressing room, a jacket on a stand under a lamp, brass buttons catching light, no flags, no portraits, no text.

Questions for QA:
1. Does the frogged officer jacket stay clear of the costume and trade-dress lines above, or does it need toning down (fewer
   frogging rows, no fringe on the epaulettes)?
2. The capelet: arms lift the art beside the hands, so I would paint it ending at the elbow and hemtrim it. Fine, or swap it for a
   double-breasted greatcoat?
3. His sexy piece is the waistcoat on the bare chest, hers the open mess jacket over a bandeau. Enough, or one more?

QA design review 2026-11-18: PASS with NOTES, cleared to paint; applied above: the jacket keeps three rows of frogging and the scarlet
collar and cuffs but has plain shoulder boards, no fringe (drum-major risk); the capelet ends above the elbow; the cap's crown is
low and firm, not tall and soft like VENOM ROSE's velvet one; the sash has no star or medallion; the aiguillette hangs as a fashion
cord. Gates after paint: barecheck (bandeau), heelcheck (stiletto boots), hatcheck (both caps), gauntlets hand-sized in arms-up poses.

## Painted (ROOMS, 2026-11-18): status for QA's wear-check and gates

All 15 painted on Nano Banana Pro (Unlimited), one image per piece holding every angle; logo_rg (the brass knot in a ring on
scarlet enamel) and ui_banner_rg (a navy dressing room: a braided jacket on a mannequin, a sash on a chair, riding boots; no flags,
portraits or people; the generator's sharp middle band, so the lamp and the jacket's top are cropped).
Redone before keeping: the sash (her back view showed two crossed bands; now one diagonal band on every view) and the peaked cap
(the low crown let the top of the head show; repainted with a wide flat top, and her front/back cap layers stretched 15% upward at
the crown, his untouched). Her side cap's back layer got the same stretch (a scalp sliver from behind).
Checked by ROOMS: both bodies, 41 poses, 15/17 outfits, 0 not drawn, 0 page errors; hatcheck on both caps (h1-h3, both bodies,
front and back) clean; gauntlets hand-sized in stretchUp and dance2; the mess jacket's bandeau covers on her bare base; the stiletto
boots on the tiptoe base. Sheets: regiment_approval.png, regiment_wear_m/f.png, regiment_close_m/f.png.
For QA to judge: his Braided Waistcoat in stretchUp and dance2 shows light shards along the bare arms (the waistcoat layer itself is
one clean piece, so it may be the rig's bare-arm stretch; no other top leaves his arms bare to compare). The riding boots come to
mid-shin on the chibi legs.
