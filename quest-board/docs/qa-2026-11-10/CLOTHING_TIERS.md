# Clothing quality tiers (QA, 2026-11-10)

QA's grade of every Shop clothing piece into four quality tiers, so BUILDER can set prices by quality instead of one flat
band (Cal: "A white shirt with a flower on it, should not be the same price as a sexy dress with diamond encrusted
lacings"). Built from rc-0.89 (03fe239)'s Shop: 319 pieces, every entry of type a_top, a_pants, a_shoes, a_acc, a_back,
a_eyet or a_hat. Dungeon pieces (brand "dungeon") are left out because they are not sold. **QA changed no data**: no
prices, no code, no art.

**Method.** Each piece was graded on three things: its Shop icon (14 contact sheets of the icons, with close crops where a
detail mattered), its one-line description, and its brand's identity (the BRANDS table in `app/src/10_app_a.js` and
`docs/BRANDS_15.md`). The brand sets the starting point; each piece is still graded on its own look, so a brand can hold
several tiers.

| tier | BUILDER's starting band | what it means |
|---|---|---|
| thrift | 100-250 | Plain basics, simple tees, cheap-looking, worn or thrift-store pieces. |
| standard | 250-500 | Ordinary well-made streetwear. |
| premium | 600-1,200 | Clearly special: detailed construction, statement pieces, quality materials, distinctive design. |
| luxury | 1,300-2,200 | Visibly high fashion: rich materials, embellishment (sequins, jewels, metallic, lace), couture silhouettes, elaborate accessories. |

**Rules QA applied**, so new pieces can be graded the same way:
- **thrift:** one-colour pieces with no detail; tees with a single print (Cal's flower-shirt example); small cloth or
  plastic extras (face masks, gaiters, bandanas, hair clips, novelty shades, terry bands); canvas sneakers, slides, flip-flops
  and sport sandals; frayed or faded denim.
- **standard:** ordinary caps, beanies, knits, hoodies, cargos, track pieces, sneakers and boots with some cut, colour or
  detail.
- **premium:** leather or velvet pieces; varsity jackets (two materials, ribbed trim); a brand's signature statement piece;
  wings and halos; chrome or armour plating; glitter.
- **luxury:** lace corsetry; sculpted precious-metal jewellery set with stones; iridescent couture outerwear; the crown.

**What the grades mean for prices:**
- Today's prices are nearly flat. The 5 luxury pieces sell for 320 to 700 now, and 15 thrift pieces sell for 400 or more
  (highest: DIAL-UP's Plaid Mini Skirt at 520). The work is spreading prices out, not just raising them.
- Two premium pieces are priced low today: VENOM ROSE's Lace Headband (280) and CHROME RAIN's Mesh Harness Top (400).
- Nothing here is designer level (Cal's "3000 for a specific pair of pants"). A designer brand needs new pieces and new art.
- The three eye styles (`et_*`) are face options, not garments. QA graded them thrift so they stay cheap; BUILDER may prefer
  to leave them out of tier pricing.
- The level-gated starter pieces (Halo at level 20, Crown at 25, Shadow Wings at 30) were graded on the item, not the level.
- NICE COCK is the one brand where identity moved grades: the cuts are plain, but it is Cal's "luxury leisurewear", so its
  hero pieces are premium. On looks alone those six would be standard.

## Summary by brand

| brand | id | pieces | thrift | standard | premium | luxury | overall level |
|---|---|---:|---:|---:|---:|---:|---|
| Starter / creator (no brand) | "" | 38 | 22 | 13 | 2 | 1 | Mostly thrift. Plain shapes the rig draws itself (no icon art); only the level-gated Halo, Shadow Wings and Crown sit above standard. |
| Basics | basics | 27 | 27 | 0 | 0 | 0 | All thrift. This is the thrift shop: one colour, no detail. |
| HANGANG | hanga | 21 | 3 | 17 | 1 | 0 | Plain standard. Well-made oversized basics; the varsity is the one premium piece. |
| DIAL-UP | y2k | 18 | 8 | 10 | 0 | 0 | Below standard. Sold as "y2k thrift" and looks it: print tees, plain denim and novelty plastic pull it down. |
| OVERPASS | over | 19 | 6 | 13 | 0 | 0 | Plain standard. Ordinary street supply, nothing premium; beanie, bandana, gaiter, splatter tee, mesh shorts and slides are thrift. |
| VENOM ROSE | rose | 15 | 1 | 4 | 8 | 2 | Highest brand. Leather, velvet, lace, tulle and silver throughout: shift the whole brand up. |
| NICE COCK | nc | 16 | 0 | 10 | 6 | 0 | A step above on identity. Cuts are plain, but Cal's "luxury leisurewear" hero pieces (joggers, hoodie, pendant, court shoe) earn premium. |
| ALTITUDE | alt | 15 | 4 | 11 | 0 | 0 | Plain standard. Outdoor gear; small extras (buff, lanyard, sandals, henley) are thrift. |
| KODE PINK | kp | 15 | 2 | 11 | 2 | 0 | Standard merch. Two jackets premium, clips and slip-ons thrift. |
| SAYMØRE | sm | 15 | 2 | 9 | 4 | 0 | Standard merch with premium signature pieces (Halo Mask, Neon Halo, Neon Hoodie, Rig Vest); the print tee and mesh shorts are thrift. |
| SMOKE BOMB | smk | 15 | 6 | 9 | 0 | 0 | Low standard. Cloth costume; its five small pieces (headband, headwrap, cowl, tape, pouch) and the sandals are thrift, nothing premium. |
| GACHA POP | gp | 15 | 1 | 11 | 3 | 0 | Standard. The blazer, angel wings and glitter kicks are premium; novelty shades thrift. |
| SAVE POINT | sp | 15 | 5 | 9 | 1 | 0 | Low standard. Gaming merch: two print tees, novelty shades, patched shorts and canvas sneakers are thrift; only the varsity is premium. |
| BARD & BLADE | bb | 15 | 0 | 12 | 2 | 1 | Standard with a few high pieces: velvet doublet and leather trousers premium, the jewelled circlet luxury. |
| CHROME RAIN | cr | 15 | 0 | 7 | 7 | 1 | Second highest brand. Chrome, holographic, glossy and armoured pieces: shift it up; 7 premium and the holo trench luxury. |
| KAIMANA | km | 15 | 9 | 6 | 0 | 0 | Lowest brand. Beachwear: over half thrift, nothing premium. |
| OAKMONT | oak | 15 | 6 | 9 | 0 | 0 | Low standard. Terry extras, visor, running shorts, canvas and tube-sock shoes are thrift; nothing premium. |
| SØLVBERG | sv | 15 | 3 | 12 | 0 | 0 | Plain standard. Winter wear; scarf, mittens and leggings thrift; nothing premium. |
| **All** | | **319** | **105** | **173** | **36** | **5** | |

## Every piece

Grouped by brand in Shop drop order. Price is the current Shop price from rc-0.89. Slot "bottom" covers pants, shorts and skirts.

### Starter / creator (no brand) ("", 38 pieces)

| item id | brand | slot | name | current price | tier | reason |
|---|---|---|---|---:|---|---|
| tp_tank_f | "" | top | Satin Tank | 320 | standard | satin tank, plain, no print (no icon) |
| tp_tee_m | "" | top | Graphic Tee | 280 | thrift | plain green tee (no icon) |
| tp_leather | "" | top | Leather Jacket | 400 | standard | plain black leather jacket over white tee (no icon) |
| tp_cream | "" | top | Cream Hoodie | 400 | thrift | plain cream hoodie, same as a basic (no icon) |
| tp_cardi_f | "" | top | Soft Cardigan | 400 | thrift | plain oat knit cardigan (no icon) |
| tp_cardi_m | "" | top | Red Cardigan | 400 | thrift | plain open red cardigan over a tank (no icon) |
| tp_varsity | "" | top | Varsity Jacket | 400 | standard | plain navy varsity jacket (no icon) |
| tp_blazer_f | "" | top | Camel Blazer | 400 | standard | plain camel tailored blazer (no icon) |
| tp_coat_m | "" | top | Charcoal Overcoat | 400 | standard | long charcoal overcoat, plain (no icon) |
| tp_trench | "" | top | Trench Coat | 600 | standard | belted trench coat, plain (no icon) |
| pt_cargo | "" | bottom | Cargo Pants | 320 | thrift | plain cargo pants (no icon) |
| pt_skirt | "" | bottom | Pleated Skirt | 320 | thrift | plain pleated skirt (no icon) |
| pt_shorts | "" | bottom | Denim Shorts | 280 | thrift | faded denim shorts (no icon) |
| pt_jog_f | "" | bottom | Joggers | 400 | thrift | plain grey joggers (no icon) |
| pt_wide | "" | bottom | Wide Trousers | 400 | thrift | plain dark wide trousers (no icon) |
| sh_white | "" | shoes | White Kicks | 400 | thrift | plain white sneakers (no icon) |
| sh_flats | "" | shoes | Ballet Flats | 400 | thrift | plain cream flats (no icon) |
| sh_boots | "" | shoes | Combat Boots | 400 | thrift | plain black combat boots (no icon) |
| sh_red | "" | shoes | Red Hi-Tops | 400 | thrift | plain red hi-tops (no icon) |
| ac_glasses | "" | accessory | Round Glasses | 240 | thrift | thin round glasses (no icon) |
| ac_phones | "" | accessory | Studio Headphones | 320 | standard | studio headphones (no icon) |
| ac_hoops | "" | accessory | Gold Hoops | 280 | standard | small gold hoop earrings (no icon) |
| ac_shades | "" | accessory | Shades | 320 | thrift | plain dark shades (no icon) |
| ac_bow | "" | accessory | Silk Bow | 280 | thrift | small white hair bow (no icon) |
| ac_chain | "" | accessory | Silver Chain | 400 | standard | thin silver chain (no icon) |
| ac_flower | "" | accessory | Hair Flower | 320 | thrift | single red hair flower (no icon) |
| ac_cross | "" | accessory | Chain and Cross | 400 | standard | silver chain with a cross (no icon) |
| ac_halo | "" | accessory | Halo | 600 | premium | glowing gold halo, level 20 statement piece (no icon) |
| ac_crown | "" | accessory | Crown | 600 | luxury | gold crown, level 25 (no icon) |
| bk_katana | "" | back | Katana | 400 | standard | sword worn on the back (no icon) |
| bk_cape | "" | back | Cape | 600 | standard | plain crimson cape (no icon) |
| bk_wings | "" | back | Shadow Wings | 600 | premium | large dark wings, violet edge, level 30 (no icon) |
| et_happy | "" | eyes | Happy Eyes | 280 | thrift | eye style, not a garment (no icon) |
| et_dot | "" | eyes | Dot Eyes | 280 | thrift | eye style, not a garment (no icon) |
| et_tired | "" | eyes | Tired Eyes | 280 | thrift | eye style, not a garment (no icon) |
| tp_button | "" | top | Button-Up | 400 | thrift | plain button-up, rolled sleeves (no icon) |
| sh_loafers | "" | shoes | Loafers | 400 | standard | plain polished loafers (no icon) |
| pt_jeans | "" | bottom | Jeans | 320 | thrift | plain everyday jeans (no icon) |

### Basics (basics, 27 pieces)

| item id | brand | slot | name | current price | tier | reason |
|---|---|---|---|---:|---|---|
| bs_tee_white | basics | top | White Tee | 80 | thrift | plain tee, one colour, no detail |
| bs_tee_grey | basics | top | Grey Tee | 80 | thrift | plain tee, one colour, no detail |
| bs_tee_black | basics | top | Black Tee | 80 | thrift | plain tee, one colour, no detail |
| bs_hoodie_white | basics | top | White Hoodie | 140 | thrift | plain hoodie, one colour, no detail |
| bs_hoodie_grey | basics | top | Grey Hoodie | 140 | thrift | plain hoodie, one colour, no detail |
| bs_hoodie_black | basics | top | Black Hoodie | 140 | thrift | plain hoodie, one colour, no detail |
| bs_bomber_white | basics | top | White Bomber | 140 | thrift | plain bomber, one colour, no detail |
| bs_bomber_grey | basics | top | Grey Bomber | 140 | thrift | plain bomber, one colour, no detail |
| bs_bomber_black | basics | top | Black Bomber | 140 | thrift | plain bomber, one colour, no detail |
| bs_joggers_white | basics | bottom | White Joggers | 100 | thrift | plain joggers, one colour, no detail |
| bs_joggers_grey | basics | bottom | Grey Joggers | 100 | thrift | plain joggers, one colour, no detail |
| bs_joggers_black | basics | bottom | Black Joggers | 100 | thrift | plain joggers, one colour, no detail |
| bs_jeans_white | basics | bottom | White Jeans | 100 | thrift | plain jeans, one colour, no detail |
| bs_jeans_grey | basics | bottom | Grey Jeans | 100 | thrift | plain jeans, one colour, no detail |
| bs_jeans_black | basics | bottom | Black Jeans | 100 | thrift | plain jeans, one colour, no detail |
| bs_shorts_white | basics | bottom | White Shorts | 80 | thrift | plain shorts, one colour, no detail |
| bs_shorts_grey | basics | bottom | Grey Shorts | 80 | thrift | plain shorts, one colour, no detail |
| bs_shorts_black | basics | bottom | Black Shorts | 80 | thrift | plain shorts, one colour, no detail |
| bs_sneakers_white | basics | shoes | White Sneakers | 80 | thrift | plain sneakers, one colour, no detail |
| bs_sneakers_grey | basics | shoes | Grey Sneakers | 80 | thrift | plain sneakers, one colour, no detail |
| bs_sneakers_black | basics | shoes | Black Sneakers | 80 | thrift | plain sneakers, one colour, no detail |
| bs_boots_white | basics | shoes | White Boots | 120 | thrift | plain lace-up boots, one colour, no detail |
| bs_boots_grey | basics | shoes | Grey Boots | 120 | thrift | plain lace-up boots, one colour, no detail |
| bs_boots_black | basics | shoes | Black Boots | 120 | thrift | plain lace-up boots, one colour, no detail |
| bs_flipflops_white | basics | shoes | White Flip-flops | 60 | thrift | plain flip-flops, one colour, no detail |
| bs_flipflops_grey | basics | shoes | Grey Flip-flops | 60 | thrift | plain flip-flops, one colour, no detail |
| bs_flipflops_black | basics | shoes | Black Flip-flops | 60 | thrift | plain flip-flops, one colour, no detail |

### HANGANG (hanga, 21 pieces)

| item id | brand | slot | name | current price | tier | reason |
|---|---|---|---|---:|---|---|
| gx_h_snap | hanga | hat | Flat-brim Snapback | 360 | standard | plain black snapback, cream patch |
| gx_h_beret | hanga | hat | Wool Beret | 320 | standard | plain charcoal wool beret |
| gx_h_news | hanga | hat | Newsboy Cap | 340 | standard | grey herringbone newsboy cap |
| gx_h_mask | hanga | accessory | Airport Face Mask | 240 | thrift | plain black cloth face mask |
| gx_h_shades | hanga | accessory | Slim Tinted Shades | 280 | thrift | plain thin black shades |
| gx_h_varsity | hanga | top | Oversized Varsity Jacket | 640 | premium | two-tone varsity, ribbed trim, snap front |
| gx_h_hoodie | hanga | top | Oversized Cream Hoodie | 480 | standard | plain cream fleece hoodie, boxy |
| gx_h_cardi | hanga | top | Oatmeal Knit Cardigan | 440 | standard | chunky cable cardigan over a white tee |
| gx_h_cargo | hanga | bottom | Baggy Cargo Pants | 400 | standard | olive baggy cargos |
| gx_h_denim | hanga | bottom | Wide-leg Washed Denim | 400 | standard | light-wash wide-leg jeans |
| gx_h_trous | hanga | bottom | Pleated Wide Trousers | 380 | standard | plain off-black pleated trousers |
| gx_h_sneak | hanga | shoes | Chunky Sneakers | 440 | standard | cream chunky sneakers |
| gx_h_boots | hanga | shoes | Lug-sole Combat Boots | 480 | standard | black lace-up lug-sole boots |
| gx_h_high | hanga | shoes | Canvas High-tops | 360 | thrift | plain off-white canvas high-tops |
| gx_h_chain | hanga | accessory | Silver Curb Chain | 300 | standard | chunky silver curb chain |
| gx_h_coach | hanga | top | Nylon Coach Jacket | 520 | standard | plain black nylon coach jacket |
| gx_h_knit | hanga | top | Cropped Cable Cardigan | 480 | standard | cropped oatmeal cable cardigan |
| gx_h_tech | hanga | bottom | Tapered Tech Trousers | 480 | standard | charcoal tech trousers, zip pockets |
| gx_h_pleat | hanga | bottom | Long Pleated Skirt | 480 | standard | charcoal knife-pleat midi skirt |
| gx_h_derby | hanga | shoes | Chunky Derby Shoes | 520 | standard | black leather derbies, thick sole |
| gx_h_loafer | hanga | shoes | Platform Loafers | 520 | standard | glossy platform loafers, white socks |

### DIAL-UP (y2k, 18 pieces)

| item id | brand | slot | name | current price | tier | reason |
|---|---|---|---|---:|---|---|
| gx_y_truck | y2k | hat | Pink Rhinestone Trucker | 360 | standard | pink mesh trucker, rhinestone star |
| gx_y_velcap | y2k | hat | Velour Newsboy Cap | 340 | standard | brown velour newsboy, buckle |
| gx_y_bfly | y2k | accessory | Butterfly Shades | 260 | thrift | small novelty pink shades |
| gx_y_pend | y2k | accessory | Rhinestone Star Pendant | 280 | standard | costume rhinestone star on a ball chain |
| gx_y_baby | y2k | top | Butterfly Baby Tee | 340 | thrift | pink baby tee, rhinestone butterfly print |
| gx_y_vjkt | y2k | top | Velour Track Jacket | 560 | standard | brown velour track jacket, white stripes |
| gx_y_ring | y2k | top | Retro Ringer Tee | 300 | thrift | plain white ringer tee |
| gx_y_flare | y2k | bottom | Low-rise Flare Jeans | 420 | thrift | plain dark-wash flare jeans |
| gx_y_track | y2k | bottom | Velour Track Pants | 380 | standard | brown velour track pants, side stripe |
| gx_y_plat | y2k | shoes | Platform Sneakers | 460 | standard | white and pink platform sneakers |
| gx_y_mary | y2k | shoes | Platform Mary-Janes | 440 | standard | black patent platform Mary-Janes, buckle |
| gx_y_bucket | y2k | hat | Denim Bucket Hat | 340 | thrift | faded denim bucket hat |
| gx_y_choker | y2k | accessory | Star Choker | 240 | thrift | black band with three silver stars |
| gx_y_flame | y2k | top | Flame Bowling Shirt | 440 | standard | black camp shirt, flame print |
| gx_y_skirt | y2k | bottom | Plaid Mini Skirt | 520 | thrift | simple red plaid pleated mini |
| gx_y_jorts | y2k | bottom | Baggy Jorts | 440 | thrift | frayed light-wash jorts |
| gx_y_skate | y2k | shoes | Chunky Skate Shoes | 600 | standard | black and blue chunky skate shoes |
| gx_y_runner | y2k | shoes | Retro Runners | 520 | standard | silver mesh runners, blue accents |

### OVERPASS (over, 19 pieces)

| item id | brand | slot | name | current price | tier | reason |
|---|---|---|---|---:|---|---|
| gx_o_beanie | over | hat | Fisherman Beanie | 320 | thrift | plain black rib beanie |
| gx_o_camp | over | hat | Nylon Camp Cap | 360 | standard | olive nylon five-panel cap |
| gx_o_bandana | over | hat | Paisley Bandana | 300 | thrift | paisley bandana |
| gx_o_wrap | over | accessory | Shield Shades | 380 | standard | wraparound shades, orange mirror lens |
| gx_o_lock | over | accessory | Padlock Chain | 360 | standard | chain with a padlock |
| gx_o_gaiter | over | accessory | Tech Gaiter | 280 | thrift | plain black neck gaiter |
| gx_o_tee | over | top | Spray Paint Boxy Tee | 400 | thrift | black tee, paint splatter print |
| gx_o_puffer | over | top | Cropped Puffer | 680 | standard | glossy orange quilted cropped puffer |
| gx_o_flannel | over | top | Plaid Overshirt | 480 | standard | grey plaid overshirt over a tee |
| gx_o_wind | over | top | Color-Block Windbreaker | 600 | standard | color-block windbreaker |
| gx_o_crop | over | top | Cropped Zip Hoodie | 520 | standard | washed black cropped zip hoodie |
| gx_o_work | over | top | Canvas Chore Jacket | 600 | standard | tan canvas chore jacket, cord collar |
| gx_o_para | over | bottom | Parachute Pants | 560 | standard | black nylon parachute pants |
| gx_o_camo | over | bottom | Urban Camo Cargos | 520 | standard | grey camo cargos |
| gx_o_shorts | over | bottom | Mesh Ball Shorts | 380 | thrift | mesh ball shorts, one stripe |
| gx_o_skirt | over | bottom | Cargo Mini Skirt | 440 | standard | charcoal cargo mini, buckled straps |
| gx_o_hoop | over | shoes | Retro High-Top Hoops | 640 | standard | white, black and orange high-tops |
| gx_o_slides | over | shoes | Socks & Slides | 320 | thrift | black slides with white socks |
| gx_o_rigg | over | shoes | Trail Runners | 580 | standard | grey mesh trail runners, neon accents |

### VENOM ROSE (rose, 15 pieces)

| item id | brand | slot | name | current price | tier | reason |
|---|---|---|---|---:|---|---|
| gx_v_cap | rose | hat | Leather Dad Cap | 340 | standard | plain black leather dad cap |
| gx_v_lace | rose | hat | Lace Headband | 280 | premium | black lace headband, sculpted red rose |
| gx_v_choke | rose | accessory | Spiked Choker | 300 | standard | black leather choker, silver spikes |
| gx_v_shade | rose | accessory | Tiny Oval Shades | 320 | standard | small black oval shades, thin metal frame |
| gx_v_thorn | rose | accessory | Thorn Chain | 360 | luxury | sculpted silver thorn-vine necklace, small purple stones |
| gx_v_corset | rose | top | Lace Corset Top | 560 | luxury | black lace corset, laced front, lace trim |
| gx_v_biker | rose | top | Leather Biker Jacket | 680 | premium | black leather biker jacket, silver zips |
| gx_v_mesh | rose | top | Sheer Mesh Top | 400 | standard | long-sleeve sheer mesh top |
| gx_v_rose | rose | top | Rose Print Tee | 380 | thrift | black tee, single rose print |
| gx_v_blazer | rose | top | Wine Velvet Blazer | 640 | premium | deep red velvet blazer |
| gx_v_leather | rose | bottom | Leather Pants | 560 | premium | glossy black leather pants |
| gx_v_tulle | rose | bottom | Black Tulle Skirt | 520 | premium | layered black tulle skirt |
| gx_v_flare | rose | bottom | Velvet Flares | 520 | premium | wine velvet flares |
| gx_v_boot | rose | shoes | Platform Combat Boots | 640 | premium | tall platform boots, three buckles |
| gx_v_heel | rose | shoes | Strappy Heeled Boots | 600 | premium | strappy block-heel boots |

### NICE COCK (nc, 16 pieces)

| item id | brand | slot | name | current price | tier | reason |
|---|---|---|---|---:|---|---|
| gx_nc_jog_black | nc | bottom | Signature Jogger, Black | 600 | premium | heavyweight fleece jogger, panel seams, embroidered wordmark |
| gx_nc_jog_ash | nc | bottom | Signature Jogger, Ash | 600 | premium | heavyweight fleece jogger, panel seams, embroidered wordmark |
| gx_nc_jog_slate | nc | bottom | Signature Jogger, Slate | 600 | premium | heavyweight fleece jogger, panel seams, embroidered wordmark |
| gx_nc_short | nc | bottom | Training Short | 380 | standard | black gym short, wordmark on the leg |
| gx_nc_cap | nc | hat | Wordmark Cap | 320 | standard | black cap, white wordmark |
| gx_nc_beanie | nc | hat | Rooster Beanie | 300 | standard | ash rib beanie, woven rooster patch |
| gx_nc_band | nc | hat | Sweatband | 240 | standard | white terry headband, wordmark |
| gx_nc_pendant | nc | accessory | Rooster Pendant | 440 | premium | sculpted silver rooster on a fine chain |
| gx_nc_shades | nc | accessory | Sport Shades | 360 | standard | smoked wraparound sport shades |
| gx_nc_hoodie | nc | top | Heavyweight Hoodie | 680 | premium | heavyweight navy hoodie, layered tee hem, wordmark |
| gx_nc_tee | nc | top | Boxy Tee | 400 | standard | bone boxy tee, small wordmark |
| gx_nc_tank | nc | top | Seamless Gym Tank | 360 | standard | slate ribbed gym tank |
| gx_nc_qzip | nc | top | Performance Quarter-Zip | 560 | standard | black quarter-zip, rooster on the sleeve |
| gx_nc_court | nc | shoes | Court High-Top | 640 | premium | white leather high-top, grey suede panels |
| gx_nc_knit | nc | shoes | Knit Trainer | 520 | standard | black sock-knit trainer |
| gx_nc_slide | nc | shoes | Pool Slide | 280 | standard | black slide, debossed rooster |

### ALTITUDE (alt, 15 pieces)

| item id | brand | slot | name | current price | tier | reason |
|---|---|---|---|---:|---|---|
| gx_al_bucket | alt | hat | Hiking Bucket Hat | 300 | standard | sage bucket hat, chin cord |
| gx_al_flap | alt | hat | Earflap Cap | 340 | standard | navy earflap cap, fleece lining |
| gx_al_goggle | alt | accessory | Glacier Goggles | 380 | standard | round goggles, leather sides |
| gx_al_buff | alt | accessory | Patterned Neck Buff | 280 | thrift | zigzag-print neck buff |
| gx_al_carab | alt | accessory | Carabiner Lanyard | 260 | thrift | rope lanyard, carabiner clip |
| gx_al_fleece | alt | top | Color-Block Fleece | 520 | standard | teal and cream half-zip fleece |
| gx_al_shell | alt | top | Waterproof Shell | 640 | standard | ice-blue hooded rain shell |
| gx_al_vest | alt | top | Puffy Vest | 480 | standard | rust puffer vest over a tee |
| gx_al_henley | alt | top | Thermal Henley | 400 | thrift | plain oatmeal waffle-knit henley |
| gx_al_anorak | alt | top | Cropped Anorak | 560 | standard | sage cropped anorak, kangaroo pocket |
| gx_al_cargo | alt | bottom | Convertible Hike Pants | 480 | standard | khaki zip-off hiking pants, belt |
| gx_al_tight | alt | bottom | Trail Tights & Shorts | 440 | standard | black tights under teal shorts |
| gx_al_short | alt | bottom | Hiking Shorts | 360 | standard | olive cargo shorts, belt |
| gx_al_hiker | alt | shoes | Hiking Boots | 600 | standard | brown leather hiking boots, red laces |
| gx_al_sandal | alt | shoes | Trail Sandals & Socks | 340 | thrift | sport sandals over grey socks |

### KODE PINK (kp, 15 pieces)

| item id | brand | slot | name | current price | tier | reason |
|---|---|---|---|---:|---|---|
| gx_kp_bucket | kp | hat | Cassette Bucket Hat | 320 | standard | pink bucket hat, cassette patch |
| gx_kp_phones | kp | hat | Pastel Headphones | 440 | standard | lilac and periwinkle headphones |
| gx_kp_clips | kp | hat | Star Clips | 180 | thrift | two plastic star hair clips |
| gx_kp_bag | kp | accessory | Mixtape Crossbody | 400 | standard | small cassette-shaped crossbody bag |
| gx_kp_pendant | kp | accessory | Crescent Pendant | 320 | standard | gold crescent on a black cord |
| gx_kp_varsity | kp | top | Script Varsity Jacket | 700 | premium | two-tone varsity, ribbed trim, back script |
| gx_kp_sailor | kp | top | Sailor Blouse | 440 | standard | blue sailor blouse, red scarf |
| gx_kp_hoodie | kp | top | Cloud Hoodie | 520 | standard | lilac cloud-print hoodie, lightning sleeve |
| gx_kp_bomber | kp | top | Starfall Bomber | 640 | premium | navy star-print bomber, back patch |
| gx_kp_track | kp | bottom | Runner Track Pants | 400 | standard | periwinkle track pants, pink stripe |
| gx_kp_skirt | kp | bottom | Chorus Pleated Skirt | 400 | standard | cream pleated skirt, lilac trim |
| gx_kp_cargo | kp | bottom | Wide-Leg Cargo | 480 | standard | pink wide-leg cargo, lilac pockets |
| gx_kp_runner | kp | shoes | Pastel Runners | 480 | standard | purple and teal runners |
| gx_kp_loafer | kp | shoes | Plum Loafers | 440 | standard | glossy plum loafers, white socks |
| gx_kp_slipon | kp | shoes | Cloud Slip-Ons | 320 | thrift | white canvas slip-ons, cloud print |

### SAYMØRE (sm, 15 pieces)

| item id | brand | slot | name | current price | tier | reason |
|---|---|---|---|---:|---|---|
| gx_sm_halomask | sm | hat | Halo Mask | 700 | premium | full Ø helmet with glowing halo, signature piece |
| gx_sm_halo | sm | hat | Neon Halo | 480 | premium | glowing orange halo ring |
| gx_sm_beanie | sm | hat | Ø Beanie | 300 | standard | black beanie, cyan glow trim, Ø patch |
| gx_sm_phones | sm | accessory | DJ Headphones | 520 | standard | headphones with cyan-lit cups |
| gx_sm_pendant | sm | accessory | Ø Pendant | 360 | standard | orange enamel Ø on a black chain |
| gx_sm_hoodie | sm | top | Signature Neon Hoodie | 700 | premium | black hoodie, cyan neon on every seam, katakana sleeve |
| gx_sm_track | sm | top | Glow Track Jacket | 560 | standard | black zip-up, cyan stripes |
| gx_sm_tee | sm | top | GO OFF Tee | 380 | thrift | bone tee, orange outline type print |
| gx_sm_vest | sm | top | Rig Vest | 600 | premium | tech vest, orange harness straps and buckles |
| gx_sm_cargo | sm | bottom | Flare Cargo | 600 | standard | orange cargo joggers |
| gx_sm_nightcargo | sm | bottom | Night Cargo | 520 | standard | black cargo, cyan piping |
| gx_sm_shorts | sm | bottom | Bass Shorts | 360 | thrift | black mesh shorts, orange stripe |
| gx_sm_hightop | sm | shoes | Glow-Sole High-Tops | 680 | standard | black high-tops, glowing cyan soles |
| gx_sm_runner | sm | shoes | Flare Runners | 520 | standard | chunky dark runners, orange laces |
| gx_sm_boots | sm | shoes | Neon-Lace Boots | 560 | standard | black combat boots, cyan laces |

### SMOKE BOMB (smk, 15 pieces)

| item id | brand | slot | name | current price | tier | reason |
|---|---|---|---|---:|---|---|
| gx_smk_band | smk | hat | Stitched Headband | 280 | thrift | cloth headband, stitched smoke mark |
| gx_smk_wrap | smk | hat | Spiky Headwrap | 260 | thrift | black cloth headwrap, orange tie |
| gx_smk_cowl | smk | accessory | Half-Face Cowl | 320 | thrift | black cloth half-face mask |
| gx_smk_tape | smk | accessory | Wrap Tape Set | 200 | thrift | cream cloth wrap tape |
| gx_smk_pouch | smk | accessory | Scroll Pouch | 240 | thrift | small pouch with scrolls on a strap |
| gx_smk_jacket | smk | top | High-Collar Zip Jacket | 600 | standard | black high-collar zip jacket, orange panels |
| gx_smk_mesh | smk | top | Mesh Wrap Top | 440 | standard | sleeveless wrap top, sash, mesh sleeves |
| gx_smk_vest | smk | top | Quilted Puffer Vest | 480 | standard | grey quilted vest over cream sleeves |
| gx_smk_cloak | smk | top | Torn Hood Cloak | 560 | standard | short black hooded cloak, ragged hem |
| gx_smk_cargo | smk | bottom | Wrapped Cargo | 440 | standard | black cargo, shins wrapped in tape |
| gx_smk_hakama | smk | bottom | Wide Hakama | 480 | standard | steel-grey pleated hakama, black sash |
| gx_smk_shorts | smk | bottom | Shorts over Fishnet | 360 | standard | black shorts over fishnet leggings |
| gx_smk_sandal | smk | shoes | Shinobi Sandals | 280 | thrift | open-toe black strap sandals |
| gx_smk_tabi | smk | shoes | Split-Toe Tabi Boots | 440 | standard | black split-toe tabi boots |
| gx_smk_runner | smk | shoes | Wrapped Runners | 400 | standard | black runners bound in tape |

### GACHA POP (gp, 15 pieces)

| item id | brand | slot | name | current price | tier | reason |
|---|---|---|---|---:|---|---|
| gx_gp_cathood | gp | hat | Cat-Ear Hood | 320 | standard | lilac knit hood, cat ears |
| gx_gp_bunny | gp | hat | Bunny Beanie | 300 | standard | pink bunny-ear beanie, star patch |
| gx_gp_bow | gp | hat | Satin Bow | 200 | standard | large lilac satin bow, glitter star |
| gx_gp_wings | gp | accessory | Little Angel Wings | 480 | premium | small white feather wings, gold tips |
| gx_gp_hearts | gp | accessory | Heart Shades | 280 | thrift | novelty pink heart shades |
| gx_gp_blazer | gp | top | Candy School Blazer | 560 | premium | pink school blazer, piping, bow, gold star buttons |
| gx_gp_bear | gp | top | Bear Onesie Top | 520 | standard | blue fleece bear-onesie top |
| gx_gp_star | gp | top | Star Hoodie | 440 | standard | lilac hoodie, star print |
| gx_gp_sailor | gp | top | Frilled Sailor Blouse | 400 | standard | frilled white sailor blouse, pink scarf |
| gx_gp_skirt | gp | bottom | Star Pleated Skirt | 360 | standard | sky-blue pleated skirt, star hem |
| gx_gp_shorts | gp | bottom | Bubble Shorts | 340 | standard | pink bubble shorts, star suspenders |
| gx_gp_overall | gp | bottom | Pastel Overalls | 440 | standard | lilac denim overalls, star patch |
| gx_gp_mary | gp | shoes | Platform Mary Janes | 400 | standard | pink gloss platform Mary Janes, frilly socks |
| gx_gp_slipper | gp | shoes | Fluffy Slipper Boots | 320 | standard | blue faux-fur slipper boots, pompoms |
| gx_gp_glitter | gp | shoes | Light-Up Glitter Kicks | 480 | premium | gold glitter sneakers, light-up soles |

### SAVE POINT (sp, 15 pieces)

| item id | brand | slot | name | current price | tier | reason |
|---|---|---|---|---:|---|---|
| gx_sp_beanie | sp | hat | Pixel Heart Beanie | 280 | standard | purple pom beanie, pixel heart |
| gx_sp_headset | sp | hat | Gaming Headset | 480 | standard | purple gaming headset, boom mic |
| gx_sp_cap | sp | hat | Coin Cap | 260 | standard | backwards cap, gold coin badge |
| gx_sp_cart | sp | accessory | Cartridge Pendant | 320 | standard | game cartridge on a ball chain |
| gx_sp_shades | sp | accessory | Pixel Shades | 240 | thrift | novelty pixel shades |
| gx_sp_varsity | sp | top | Arcade Varsity | 600 | premium | two-tone varsity, ribbed trim, joystick patch |
| gx_sp_pad | sp | top | Button Tee | 340 | thrift | grey tee, four-button print |
| gx_sp_p2 | sp | top | Player 2 Ringer | 360 | thrift | white ringer tee, PLAYER 2 print |
| gx_sp_hpknit | sp | top | Health Bar Sweater | 480 | standard | grey knit sweater, heart-bar intarsia |
| gx_sp_camo | sp | bottom | Pixel Camo Cargo | 440 | standard | purple pixel-camo cargos |
| gx_sp_track | sp | bottom | D-Pad Track Pants | 380 | standard | purple track pants, d-pad stripe |
| gx_sp_denim | sp | bottom | Sticker Denim Shorts | 340 | thrift | frayed denim shorts, sticker patches |
| gx_sp_flame | sp | shoes | Pixel Flame High-Tops | 480 | standard | purple high-tops, pixel flames |
| gx_sp_runner | sp | shoes | Retro Runners | 400 | standard | grey, purple and teal runners |
| gx_sp_flag | sp | shoes | Checkpoint Sneakers | 360 | thrift | grey canvas sneakers, small flag print |

### BARD & BLADE (bb, 15 pieces)

| item id | brand | slot | name | current price | tier | reason |
|---|---|---|---|---:|---|---|
| gx_bb_wizard | bb | hat | Wizard Hat | 440 | standard | navy felt wizard hat, brass buckle, stars |
| gx_bb_mantle | bb | hat | Ranger Hood | 360 | standard | green wool hood, leaf clasp |
| gx_bb_circlet | bb | hat | Leaf Circlet | 320 | luxury | silver leaf circlet set with a moonstone |
| gx_bb_bracers | bb | accessory | Leather Bracers | 280 | standard | laced leather bracers |
| gx_bb_crystal | bb | accessory | Crystal on a Cord | 240 | standard | raw blue crystal on a cord |
| gx_bb_tunic | bb | top | Adventurer's Tunic | 400 | standard | green tunic, laced neck, buckled belt |
| gx_bb_gambeson | bb | top | Quilted Gambeson | 520 | standard | oatmeal quilted gambeson, laced front |
| gx_bb_doublet | bb | top | Bard's Doublet | 560 | premium | burgundy velvet doublet, slashed puffed sleeves, ruff |
| gx_bb_cloak | bb | top | Travel Cloak | 600 | standard | rust wool cloak, brass clasp |
| gx_bb_leather | bb | bottom | Laced Leather Trousers | 440 | premium | brown leather trousers, side lacing, buckle belt |
| gx_bb_skirt | bb | bottom | Tool-Belt Skirt | 400 | standard | layered linen skirt, pouch belt, brass key |
| gx_bb_breeches | bb | bottom | Tucked Breeches | 340 | standard | tan breeches, belt and knee buckles |
| gx_bb_cuffboot | bb | shoes | Cuffed Boots | 480 | standard | tall brown cuffed boots, buckle |
| gx_bb_slipper | bb | shoes | Moonsilver Slippers | 320 | standard | silver suede curled-toe slippers |
| gx_bb_hobnail | bb | shoes | Hobnail Boots | 400 | standard | brown studded boots, wool socks |

### CHROME RAIN (cr, 15 pieces)

| item id | brand | slot | name | current price | tier | reason |
|---|---|---|---|---:|---|---|
| gx_cr_visor | cr | accessory | LED Visor | 440 | premium | wraparound LED visor |
| gx_cr_mohawk | cr | hat | Mohawk Helmet | 520 | premium | black helmet, neon spike crest |
| gx_cr_hood | cr | hat | Glow-Rim Hood | 360 | standard | black hood, cyan glowing rim |
| gx_cr_arm | cr | accessory | Chrome Arm Sleeve | 560 | premium | plated chrome arm sleeve, cyan seams |
| gx_cr_shades | cr | accessory | Mirror Shades | 280 | standard | chrome shades, pink-blue gradient lens |
| gx_cr_trench | cr | top | Holo Trench | 700 | luxury | iridescent holographic trench, high collar, belt |
| gx_cr_bomber | cr | top | Glow-Seam Bomber | 600 | premium | glossy black bomber, glowing seams |
| gx_cr_mesh | cr | top | Mesh Harness Top | 400 | premium | cropped mesh top, chrome-ringed harness |
| gx_cr_vest | cr | top | Street Armour Vest | 560 | premium | chrome-plated armour vest, light strips, straps |
| gx_cr_cargo | cr | bottom | Neon Piped Cargo | 440 | standard | glossy black cargo, cyan piping |
| gx_cr_skirt | cr | bottom | Techno Panel Skirt | 380 | standard | black panel skirt, glowing seams, one chrome panel |
| gx_cr_knee | cr | bottom | Armoured Knee Joggers | 440 | standard | black joggers, chrome knee pads |
| gx_cr_lightup | cr | shoes | Light-Up Sneakers | 480 | standard | black sneakers, glowing cyan soles |
| gx_cr_platform | cr | shoes | Platform Buckle Boots | 520 | premium | patent platform boots, buckles, lit soles |
| gx_cr_combat | cr | shoes | Chrome-Toe Combat Boots | 480 | standard | black combat boots, chrome toe caps |

### KAIMANA (km, 15 pieces)

| item id | brand | slot | name | current price | tier | reason |
|---|---|---|---|---:|---|---|
| gx_km_bucket | km | hat | Faded Bucket Hat | 240 | thrift | faded teal bucket hat |
| gx_km_straw | km | hat | Straw Sun Hat | 300 | standard | woven straw sun hat, teal ribbon bow |
| gx_km_visor | km | hat | Coral Sun Visor | 200 | thrift | plain coral sun visor |
| gx_km_shell | km | accessory | Shell Necklace | 220 | thrift | puka bead and shell necklace |
| gx_km_round | km | accessory | Round Tinted Shades | 260 | standard | gold wire round shades, teal lenses |
| gx_km_camp | km | top | Hibiscus Camp Shirt | 400 | standard | sand camp shirt, all-over hibiscus print |
| gx_km_boat | km | top | Striped Boat-Neck Tee | 300 | thrift | striped boat-neck tee |
| gx_km_rash | km | top | Zip Rash Guard | 360 | standard | teal zip rash guard, coral panels |
| gx_km_crochet | km | top | Crochet Cardigan | 440 | standard | sand crochet cardigan, scalloped edge |
| gx_km_board | km | bottom | Board Shorts | 320 | standard | teal board shorts, wave-print panel |
| gx_km_linen | km | bottom | Linen Drawstring Pants | 360 | thrift | plain sand linen drawstring pants |
| gx_km_cutoff | km | bottom | Cut-Off Shorts | 280 | thrift | frayed denim cut-offs, belt |
| gx_km_slides | km | shoes | Woven Slides | 220 | thrift | straw-strap slides |
| gx_km_deck | km | shoes | Canvas Deck Shoes | 320 | thrift | faded canvas deck shoes |
| gx_km_sandal | km | shoes | Sport Sandals | 300 | thrift | teal webbing sport sandals |

### OAKMONT (oak, 15 pieces)

| item id | brand | slot | name | current price | tier | reason |
|---|---|---|---|---:|---|---|
| gx_oak_headband | oak | hat | Terry Headband | 180 | thrift | striped terry headband |
| gx_oak_visor | oak | hat | Tennis Visor | 200 | thrift | white tennis visor |
| gx_oak_cap | oak | hat | Sweatband Cap | 260 | standard | two-tone cream and burgundy cap |
| gx_oak_wrist | oak | accessory | Terry Wristbands | 160 | thrift | striped terry wristbands |
| gx_oak_watch | oak | accessory | Retro Sport Watch | 280 | standard | chunky retro sport watch |
| gx_oak_track | oak | top | Club Track Jacket | 520 | standard | cream and burgundy track jacket, stripes |
| gx_oak_polo | oak | top | Terry Polo | 360 | standard | burgundy terry polo, cream collar |
| gx_oak_crop | oak | top | Cropped Club Sweatshirt | 340 | standard | cream cropped sweatshirt, racket motif |
| gx_oak_vest | oak | top | Cable-Knit Tennis Vest | 400 | standard | cable-knit V-neck vest over a shirt |
| gx_oak_trackpant | oak | bottom | Club Track Pants | 400 | standard | cream track pants, burgundy panels |
| gx_oak_skirt | oak | bottom | Pleated Tennis Skirt | 340 | standard | cream pleated tennis skirt, striped hem |
| gx_oak_shorts | oak | bottom | Retro Running Shorts | 280 | thrift | burgundy running shorts, piping |
| gx_oak_court | oak | shoes | Canvas Court Shoes | 340 | thrift | cream canvas court shoes |
| gx_oak_suede | oak | shoes | Suede Runners | 380 | standard | burgundy suede runners, gum sole |
| gx_oak_tube | oak | shoes | Tube Socks and Trainers | 300 | thrift | striped tube socks, plain trainers |

### SØLVBERG (sv, 15 pieces)

| item id | brand | slot | name | current price | tier | reason |
|---|---|---|---|---:|---|---|
| gx_sv_pom | sv | hat | Pom-Pom Beanie | 220 | standard | Fair Isle knit beanie, pompom |
| gx_sv_trapper | sv | hat | Trapper Hat | 300 | standard | quilted navy trapper hat, fleece flaps |
| gx_sv_goggles | sv | hat | Ski Goggles | 280 | standard | ski goggles, mirrored lens |
| gx_sv_scarf | sv | accessory | Chunky Knit Scarf | 200 | thrift | striped knit scarf, fringe |
| gx_sv_mitten | sv | accessory | Snowflake Mittens | 180 | thrift | red mittens, snowflake |
| gx_sv_ski | sv | top | Color-Block Ski Jacket | 520 | standard | retro color-block puffer ski jacket |
| gx_sv_nordic | sv | top | Nordic Sweater | 400 | standard | cream Nordic sweater, patterned yoke |
| gx_sv_quilt | sv | top | Quilted Vest | 380 | standard | red quilted vest over a turtleneck |
| gx_sv_fleece | sv | top | Half-Zip Fleece | 340 | standard | fuzzy navy half-zip fleece |
| gx_sv_snow | sv | bottom | Puffy Snow Pants | 400 | standard | navy puffy snow pants, red stripes |
| gx_sv_leggings | sv | bottom | Ski Leggings | 320 | thrift | navy stretch leggings, red stripe |
| gx_sv_cord | sv | bottom | Lodge Cords | 340 | standard | red corduroy trousers, cuffed, belt |
| gx_sv_puffer | sv | shoes | Puffer Snow Boots | 380 | standard | white quilted snow boots, red toggles |
| gx_sv_apres | sv | shoes | Après Boots | 400 | standard | tan leather lace-up boots, shearling cuffs |
| gx_sv_shearling | sv | shoes | Shearling Slippers | 260 | standard | navy suede slippers, shearling lining |

## Pieces with an unclear or missing icon

- **All 38 starter / creator pieces (brand "") have no icon.** The rig draws them from a shape and a colour; there is no
  painted art to look at. QA graded them from the name, the description and the level: tp_tank_f, tp_tee_m, tp_leather,
  tp_cream, tp_cardi_f, tp_cardi_m, tp_varsity, tp_blazer_f, tp_coat_m, tp_trench, pt_cargo, pt_skirt, pt_shorts, pt_jog_f,
  pt_wide, sh_white, sh_flats, sh_boots, sh_red, ac_glasses, ac_phones, ac_hoops, ac_shades, ac_bow, ac_chain, ac_flower,
  ac_cross, ac_halo, ac_crown, bk_katana, bk_cape, bk_wings, et_happy, et_dot, et_tired, tp_button, sh_loafers, pt_jeans.
  The three that matter most are ac_crown (luxury), ac_halo and bk_wings (premium): worth a look in the game before
  pricing them.
- Every one of the 281 brand and basics pieces had a clear icon. Close crops were taken of gx_v_corset, gx_v_thorn,
  gx_bb_circlet and gx_bb_doublet before grading them; the thorn chain's small purple stones and the circlet's moonstone
  are what put those two in luxury.
