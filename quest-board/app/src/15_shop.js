/* ---------- the shop ----------
   A boutique with its own light look, separate from the dark game screens. Items show
   as cut-outs on their own. Adding an item takes one line in EXTRA_ITEMS (or GITEMS) plus
   an entry in data/items.json. */
var EXTRA_ITEMS=[
 ["gx_h_chain","a_acc","Silver Curb Chain",750,1,"Chunky silver links.",{gar:"h_chain",b:"hanga"}],
 ["gx_h_coach","a_top","Nylon Coach Jacket",1300,1,"Black, boxy, snapped shut.",{gar:"h_coach",b:"hanga",mo:1}],
 ["gx_h_knit","a_top","Cropped Cable Cardigan",1200,1,"Oatmeal knit, buttoned up.",{gar:"h_knit",b:"hanga",fo:1}],
 ["gx_h_tech","a_pants","Tapered Tech Trousers",1200,1,"Charcoal, zipped thigh pockets.",{gar:"h_tech",b:"hanga",mo:1}],
 ["gx_h_pleat","a_pants","Long Pleated Skirt",1200,1,"Charcoal knife pleats to mid shin.",{gar:"h_pleat",b:"hanga",fo:1}],
 ["gx_h_derby","a_shoes","Chunky Derby Shoes",1300,1,"Black leather, thick white sole.",{gar:"h_derby",b:"hanga",mo:1}],
 ["gx_h_loafer","a_shoes","Platform Loafers",1300,1,"Glossy black, white ankle socks.",{gar:"h_loafer",b:"hanga",fo:1}],
 ["gx_y_bucket","a_hat","Denim Bucket Hat",850,1,"Faded denim, white stitching.",{gar:"y_bucket",b:"y2k"}],
 ["gx_y_choker","a_acc","Star Choker",600,1,"Black velvet, silver stars.",{gar:"y_choker",b:"y2k"}],
 ["gx_y_flame","a_top","Flame Bowling Shirt",1100,1,"Black with hot-rod flames.",{gar:"y_flame",b:"y2k",mo:1}],
 ["gx_y_skirt","a_pants","Plaid Mini Skirt",1300,1,"Pleated red and black.",{gar:"y_skirt",b:"y2k",fo:1}],
 ["gx_y_jorts","a_pants","Baggy Jorts",1100,1,"Light wash, frayed below the knee.",{gar:"y_jorts",b:"y2k",mo:1}],
 ["gx_y_skate","a_shoes","Chunky Skate Shoes",1500,1,"Black and sky blue, fat laces.",{gar:"y_skate",b:"y2k"}],
 ["gx_y_runner","a_shoes","Retro Runners",1300,1,"Silver mesh, cobalt accents.",{gar:"y_runner",b:"y2k",mo:1}],
 /* new240 (Cal approved HANGANG and DIAL-UP, "Ok on all", 2026-11-17; art ROOMS 86cb0e1 + 35f3080, QA PASS f24e93d + d65ec13) */
 ["gx_h_pbucket","a_hat","Padded Nylon Bucket",900,1,"Quilted black nylon, toggle cord.",{gar:"h_pbucket",b:"hanga"}],
 ["gx_h_bala","a_hat","Rib Knit Hood",850,1,"Cream rib knit, open face.",{gar:"h_bala",b:"hanga"}],
 ["gx_h_longbill","a_hat","Long-Bill Washed Cap",850,1,"Pigment charcoal, lime underbrim.",{gar:"h_longbill",b:"hanga"}],
 ["gx_h_sling","a_acc","Leather Chest Sling",900,1,"Black leather pouch worn high across the chest.",{gar:"h_sling",b:"hanga"}],
 ["gx_h_phones","a_acc","Cream Headphones",950,1,"Over-ear, worn round the neck.",{gar:"h_phones",b:"hanga"}],
 ["gx_h_oval","a_acc","Lime Oval Shades",750,1,"Narrow black frames, lime lenses.",{gar:"h_oval",b:"hanga"}],
 ["gx_h_padcoat","a_top","Long Padded Coat",1800,1,"Black, mid-thigh, cream drawcords.",{gar:"h_padcoat",b:"hanga"}],
 ["gx_h_layer","a_top","Hoodie & Liner Vest",1500,1,"Grey hoodie under a black quilted vest.",{gar:"h_layer",b:"hanga"}],
 ["gx_h_rugby","a_top","Half-Zip Rugby Knit",1350,1,"Charcoal knit, cream collar, lime tipping.",{gar:"h_rugby",b:"hanga"}],
 ["gx_h_balloon","a_pants","Balloon Sweatpants",1150,1,"Heather grey, pintucked, cinched ankles.",{gar:"h_balloon",b:"hanga"}],
 ["gx_h_barrel","a_pants","Washed Black Wide Jeans",1300,1,"Faded black, wide leg, stacked hem.",{gar:"h_barrel",b:"hanga"}],
 ["gx_h_wrap","a_pants","Wrap Skirt over Trousers",1300,1,"Grey wrap skirt with a lime tie over black wide pants.",{gar:"h_wrap",b:"hanga"}],
 ["gx_h_mule","a_shoes","Mesh Sneaker Mules",1300,1,"Cream mesh, chunky sole, open back.",{gar:"h_mule",b:"hanga"}],
 ["gx_h_puffboot","a_shoes","Quilted Puffer Boots",1500,1,"Black ankle boots, lime pull tab.",{gar:"h_puffboot",b:"hanga"}],
 ["gx_h_court","a_shoes","Retro Court Trainers",1400,1,"Cream leather, gum sole, lime heel tab.",{gar:"h_court",b:"hanga"}],
 ["gx_y_visor","a_hat","Holo Sun Visor",900,1,"Iridescent brim, black band.",{gar:"y_visor",b:"y2k"}],
 ["gx_y_race","a_hat","Racing Patch Cap",850,1,"Black twill, coral and cyan racing patches.",{gar:"y_race",b:"y2k"}],
 ["gx_y_furtrap","a_hat","Faux Fur Trapper",950,1,"Shaggy black fur, cyan satin lining.",{gar:"y_furtrap",b:"y2k"}],
 ["gx_y_rimless","a_acc","Rimless Gradient Shades",750,1,"Cyan to clear, thin silver bridge.",{gar:"y_rimless",b:"y2k"}],
 ["gx_y_phone","a_acc","Flip Phone Lanyard",700,1,"Chrome flip phone on a beaded strap.",{gar:"y_phone",b:"y2k"}],
 ["gx_y_chains","a_acc","Layered Chrome Chains",850,1,"Ball chain over a chunky curb.",{gar:"y_chains",b:"y2k"}],
 ["gx_y_moto","a_top","Racing Moto Jacket",1800,1,"Black leather, coral panels, patches.",{gar:"y_moto",b:"y2k"}],
 ["gx_y_mesh","a_top","Mesh Layer Top",1200,1,"Cyan mesh long sleeve under a black tank.",{gar:"y_mesh",b:"y2k"}],
 ["gx_y_furden","a_top","Fur-Collar Denim Jacket",1600,1,"Cropped dark denim over a white tee, cream fur collar.",{gar:"y_furden",b:"y2k"}],
 ["gx_y_patch","a_pants","Patchwork Wide Jeans",1350,1,"Mixed washes, low rise.",{gar:"y_patch",b:"y2k"}],
 ["gx_y_pcamo","a_pants","Coral Camo Cargos",1250,1,"Low-rise, coral and grey camo.",{gar:"y_pcamo",b:"y2k"}],
 ["gx_y_maxi","a_pants","Denim Cargo Maxi",1300,1,"Long dark denim, cargo pockets, a slit.",{gar:"y_maxi",b:"y2k",fo:1}],
 ["gx_y_patent","a_shoes","Patent Platform Boots",1650,1,"Black patent, coral platform sole.",{gar:"y_patent",b:"y2k"}],
 ["gx_y_bubble","a_shoes","Bubble Sole Runners",1500,1,"Pearl white, cyan bubble heel.",{gar:"y_bubble",b:"y2k"}],
 ["gx_y_furmule","a_shoes","Suede Fur Mules",1300,1,"Ice blue suede, cream faux fur lining.",{gar:"y_furmule",b:"y2k"}],
 ["gx_o_beanie","a_hat","Fisherman Beanie",800,1,"Black rib, rolled cuff.",{gar:"o_beanie",b:"over"}],
 ["gx_o_camp","a_hat","Nylon Camp Cap",900,1,"Washed olive, orange strap.",{gar:"o_camp",b:"over"}],
 ["gx_o_bandana","a_hat","Paisley Bandana",750,1,"Black and white, tied at the back.",{gar:"o_bandana",b:"over"}],
 ["gx_o_wrap","a_acc","Shield Shades",950,1,"Wraparound, orange mirror lens.",{gar:"o_wrap",b:"over"}],
 ["gx_o_lock","a_acc","Padlock Chain",900,1,"Heavy silver links and a padlock.",{gar:"o_lock",b:"over"}],
 ["gx_o_gaiter","a_acc","Tech Gaiter",700,1,"Black, up over the nose.",{gar:"o_gaiter",b:"over"}],
 ["gx_o_tee","a_top","Spray Paint Boxy Tee",1000,1,"Oversized, one of a kind splatter.",{gar:"o_tee",b:"over"}],
 ["gx_o_puffer","a_top","Cropped Puffer",1700,1,"Glossy safety orange.",{gar:"o_puffer",b:"over"}],
 ["gx_o_flannel","a_top","Plaid Overshirt",1200,1,"Grey plaid over a white tee.",{gar:"o_flannel",b:"over"}],
 ["gx_o_wind","a_top","Color-Block Windbreaker",1500,1,"Black, teal, one orange stripe.",{gar:"o_wind",b:"over"}],
 ["gx_o_crop","a_top","Cropped Zip Hoodie",1300,1,"Washed black, cut high.",{gar:"o_crop",b:"over",fo:1}],
 ["gx_o_work","a_top","Canvas Chore Jacket",1500,1,"Tan duck canvas, corduroy collar.",{gar:"o_work",b:"over",mo:1}],
 ["gx_o_para","a_pants","Parachute Pants",1400,1,"Black nylon, ankle toggles.",{gar:"o_para",b:"over"}],
 ["gx_o_camo","a_pants","Urban Camo Cargos",1300,1,"Grey camo, wide leg.",{gar:"o_camo",b:"over"}],
 ["gx_o_shorts","a_pants","Mesh Ball Shorts",950,1,"Past the knee, orange stripe.",{gar:"o_shorts",b:"over",mo:1}],
 ["gx_o_skirt","a_pants","Cargo Mini Skirt",1100,1,"Charcoal with buckled straps.",{gar:"o_skirt",b:"over",fo:1}],
 ["gx_o_hoop","a_shoes","Retro High-Top Hoops",1600,1,"White, black, orange heel.",{gar:"o_hoop",b:"over"}],
 ["gx_o_slides","a_shoes","Socks & Slides",800,1,"White crew socks, black slides.",{gar:"o_slides",b:"over"}],
 ["gx_o_rigg","a_shoes","Trail Runners",1450,1,"Grey mesh, neon accents.",{gar:"o_rigg",b:"over"}],
 /* new240 OVERPASS (Cal: "Approve after QA", 2026-11-17; art ROOMS cbc3709) */
 ["gx_o_5panel","a_hat","Five-Panel Skate Cap",850,1,"Black nylon, orange side tab.",{gar:"o_5panel",b:"over"}],
 ["gx_o_reflect","a_hat","Reflective Bucket",950,1,"Grey reflective nylon that flares at night.",{gar:"o_reflect",b:"over"}],
 ["gx_o_durag","a_hat","Satin Durag",750,1,"Black satin, long tails.",{gar:"o_durag",b:"over"}],
 ["gx_o_tool","a_acc","Skate Tool Lanyard",650,1,"Orange lanyard, steel T-tool.",{gar:"o_tool",b:"over"}],
 ["gx_o_rect","a_acc","Smoke Rectangle Shades",750,1,"Slim black frames, smoke lenses.",{gar:"o_rect",b:"over"}],
 ["gx_o_tags","a_acc","Ball-Chain Dog Tags",700,1,"Two steel tags, one orange edge.",{gar:"o_tags",b:"over"}],
 ["gx_o_bridge","a_top","Bridge Graphic Hoodie",1500,1,"Washed black, cracked orange overpass print.",{gar:"o_bridge",b:"over"}],
 ["gx_o_liner","a_top","Quilted Liner Jacket",1500,1,"Safety orange diamond quilting, snap front.",{gar:"o_liner",b:"over"}],
 ["gx_o_thermal","a_top","Layered Thermal Tee",1200,1,"Boxy black tee over a grey waffle thermal.",{gar:"o_thermal",b:"over"}],
 ["gx_o_dknee","a_pants","Double-Knee Carpenters",1350,1,"Grey canvas, orange tab, hammer loop.",{gar:"o_dknee",b:"over"}],
 ["gx_o_snap","a_pants","Snap Track Pants",1200,1,"Black nylon, orange piping, snap legs.",{gar:"o_snap",b:"over"}],
 ["gx_o_cshort","a_pants","Carpenter Jorts",1100,1,"Washed black denim, to the knee.",{gar:"o_cshort",b:"over",mo:1}],
 ["gx_o_suede","a_shoes","Suede Low Skaters",1400,1,"Grey suede, orange laces, padded tongue.",{gar:"o_suede",b:"over"}],
 ["gx_o_moc","a_shoes","Moc-Toe Work Boots",1600,1,"Black leather, orange laces, white wedge.",{gar:"o_moc",b:"over"}],
 ["gx_o_slipon","a_shoes","Knit Slip-On Trainers",1300,1,"Black knit, orange heel pull.",{gar:"o_slipon",b:"over"}],
 /* Cal 11-18 OVERPASS: the chain and skate tool's replacements ("Redo those two accessories with something else"; ROOMS cefab81) */
 ["gx_o_guards","a_acc","Grip-Tape Wrist Guards",850,1,"Grip-tape facing, orange straps, scuffed grey plates.",{gar:"o_guards",b:"over"}],
 ["gx_o_resp","a_acc","Spray Respirator",700,1,"Matte black half mask, orange filter caps, reflective strip.",{gar:"o_resp",b:"over"}],
 ["gx_v_cap","a_hat","Leather Dad Cap",850,1,"Soft black leather.",{gar:"v_cap",b:"rose"}],
 ["gx_v_lace","a_hat","Lace Headband",700,1,"Black lace and one rose.",{gar:"v_lace",b:"rose",fo:1}],
 ["gx_v_choke","a_acc","Spiked Choker",750,1,"Black leather, silver spikes.",{gar:"v_choke",b:"rose"}],
 ["gx_v_shade","a_acc","Tiny Oval Shades",800,1,"Small black lenses.",{gar:"v_shade",b:"rose"}],
 ["gx_v_thorn","a_acc","Thorn Chain",900,1,"Silver links like a thorny vine.",{gar:"v_thorn",b:"rose"}],
 ["gx_v_corset","a_top","Lace Corset Top",1400,1,"Strapless black lace, sweetheart line, laced front.",{gar:"v_corset",b:"rose",fo:1}],
 ["gx_v_biker","a_top","Leather Biker Jacket",1700,1,"Black, zipped, silver hardware.",{gar:"v_biker",b:"rose"}],
 ["gx_v_mesh","a_top","Sheer Mesh Top",1000,1,"Long sleeves, black mesh.",{gar:"v_mesh",b:"rose"}],
 ["gx_v_rose","a_top","Rose Print Tee",950,1,"Black with a big red rose.",{gar:"v_rose",b:"rose"}],
 ["gx_v_blazer","a_top","Wine Velvet Blazer",1600,1,"Deep red velvet, worn open, no shirt.",{gar:"v_blazer",b:"rose",mo:1}],
 ["gx_v_leather","a_pants","Leather Pants",1400,1,"Black, straight leg.",{gar:"v_leather",b:"rose"}],
 ["gx_v_tulle","a_pants","Black Tulle Skirt",1300,1,"Layers and layers.",{gar:"v_tulle",b:"rose",fo:1}],
 ["gx_v_flare","a_pants","Velvet Flares",1300,1,"Wine velvet, slit from the knee, wide hem.",{gar:"v_flare",b:"rose"}],
 ["gx_v_boot","a_shoes","Platform Combat Boots",1600,1,"Black, buckled, tall.",{gar:"v_boot",b:"rose"}],
 ["gx_v_heel","a_shoes","Strappy Heeled Boots",1500,1,"Black straps and a block heel.",{gar:"v_heel",b:"rose",fo:1}],
 /* new240 VENOM ROSE sexy set (Cal: "Approve all", 2026-11-17; QA 39bc5d1; ROOMS a10a097, 353080a, 242f620, d808aca) */
 ["gx_v_bunny","a_hat","Satin Bunny Ears",850,1,"Black satin ears on a thin headband.",{gar:"v_bunny",b:"rose",fo:1}],
 ["gx_v_veil","a_hat","Velvet Pillbox Hat",900,1,"A tiny oxblood pillbox, pearl hat pin.",{gar:"v_veil",b:"rose",fo:1}],
 ["gx_v_captain","a_hat","Velvet Captain's Cap",850,1,"Oxblood velvet, a black patent brim.",{gar:"v_captain",b:"rose"}],
 ["gx_v_pipe","a_acc","Briar Pipe",750,1,"Curved dark wood, a wisp of smoke.",{gar:"v_pipe",b:"rose",mo:1}],
 ["gx_v_mask","a_acc","Lace Masquerade Mask",800,1,"Black lace around the eyes, silver edge.",{gar:"v_mask",b:"rose"}],
 ["gx_v_bodychain","a_acc","Crystal Body Chain",950,1,"Fine silver strands draped over the chest.",{gar:"v_bodychain",b:"rose",fo:1}],
 ["gx_v_robe","a_top","Velvet Smoking Robe",1800,1,"Oxblood velvet, black satin lapels, tied loose.",{gar:"v_robe",b:"rose",mo:1}],
 ["gx_v_slip","a_top","Lace Slip Dress",1600,1,"Black satin, deep V, a bow and a short side slit.",{gar:"v_slip",b:"rose",fo:1}],
 ["gx_v_bodysuit","a_top","Satin Corset Bodysuit",1500,1,"Strapless black satin, boned, laced back.",{gar:"v_bodysuit",b:"rose",fo:1}],
 ["gx_v_pajama","a_pants","Silk Pajama Pants",1150,1,"Oxblood silk, black piping.",{gar:"v_pajama",b:"rose",mo:1}],
 ["gx_v_fishnet","a_pants","Fishnet Tights",1100,1,"Black diamond net, high waist.",{gar:"v_fishnet",b:"rose",fo:1}],
 ["gx_v_mini","a_pants","Velvet Mini Skirt",1200,1,"Oxblood velvet, high waist, very short.",{gar:"v_mini",b:"rose",fo:1}],
 ["gx_v_stiletto","a_shoes","Patent Stilettos",1500,1,"Oxblood patent, needle heels.",{gar:"v_stiletto",b:"rose",fo:1}],
 ["gx_v_thigh","a_shoes","Lace-Up Knee Boots",1650,1,"Black leather laced to the knee, block heel.",{gar:"v_thigh",b:"rose",fo:1}],
 ["gx_v_slipper","a_shoes","Velvet Smoking Slippers",1300,1,"Oxblood velvet, black soles.",{gar:"v_slipper",b:"rose",mo:1}],
 /* Cal 11-18 VENOM ROSE replacements ("lingerie, a sexy crop top, skin tight top, seductive and revealing clothing"; ROOMS cefab81, 4edfa01, bare base dff4465) */
 ["gx_v_horns","a_hat","Velvet Devil Horns",850,1,"Glossy black horns, oxblood velvet wraps, rhinestone tips.",{gar:"v_horns",b:"rose"}],
 ["gx_v_silkshirt","a_top","Unbuttoned Silk Shirt",1600,1,"Oxblood silk open to the navel, black satin collar.",{gar:"v_silkshirt",b:"rose",mo:1}],
 ["gx_v_vinyl","a_pants","Lace-Up Vinyl Trousers",1450,1,"Skin-tight glossy black vinyl, laced up both outer seams.",{gar:"v_vinyl",b:"rose"}],
 ["gx_v_hotpants","a_pants","Vinyl Lace-Up Shorts",1250,1,"High-waisted glossy black vinyl, silver-eyelet sides.",{gar:"v_hotpants",b:"rose",fo:1}],
 ["gx_v_bralette","a_top","Lace Bralette Set",1400,1,"Black lace, oxblood satin trim, thin straps.",{gar:"v_bralette",b:"rose",fo:1}],
 ["gx_v_crop","a_top","Keyhole Crop Top",1300,1,"Skin-tight black long sleeves, keyhole with a silver ring.",{gar:"v_crop",b:"rose",fo:1}],
 /* Cal 11-18: "Add sexy heels ... with a tippy toe stance" (ROOMS 7f30c13, 1d16b66: worn on her tiptoe base, lifted; look.js, rig.js) */
 ["gx_v_sandal","a_shoes","Ankle-Strap Stilettos",1600,1,"Black patent stilettos, oxblood straps, silver buckles. Worn on tiptoe.",{gar:"v_sandal",b:"rose",fo:1}],
 ["gx_al_bucket","a_hat","Hiking Bucket Hat",750,1,"Sage with a chin cord.",{gar:"al_bucket",b:"alt"}],
 ["gx_al_flap","a_hat","Earflap Cap",850,1,"Fleece lined, orange trim.",{gar:"al_flap",b:"alt"}],
 ["gx_al_goggle","a_acc","Glacier Goggles",950,1,"Round lenses, leather sides.",{gar:"al_goggle",b:"alt"}],
 ["gx_al_buff","a_acc","Vented Face Mask",700,1,"Matte black, orange filter vents.",{gar:"al_buff",b:"alt"}],
 ["gx_al_carab","a_acc","Chest Rig Bag",650,1,"Black chest bag, blaze orange buckles.",{gar:"al_carab",b:"alt"}],
 ["gx_al_fleece","a_top","Sherpa Pullover",1300,1,"Olive pile, orange kangaroo pocket.",{gar:"al_fleece",b:"alt"}],
 ["gx_al_shell","a_top","Silver Storm Shell",1600,1,"Reflective silver, black taped seams.",{gar:"al_shell",b:"alt"}],
 ["gx_al_vest","a_top","Utility Vest",1200,1,"Black pocket vest over a blaze orange tee.",{gar:"al_vest",b:"alt"}],
 ["gx_al_henley","a_top","Grid Fleece Half-Zip",1000,1,"Charcoal grid fleece, orange zip.",{gar:"al_henley",b:"alt",mo:1}],
 ["gx_al_anorak","a_top","Color-Block Anorak",1400,1,"Forest green, lilac panels, orange pouch.",{gar:"al_anorak",b:"alt",fo:1}],
 ["gx_al_cargo","a_pants","Tech Cargo Pants",1200,1,"Black, strapped pockets, orange buckle.",{gar:"al_cargo",b:"alt"}],
 ["gx_al_tight","a_pants","Trail Shorts & Tights",1100,1,"Olive shorts, black tights, orange cord.",{gar:"al_tight",b:"alt",fo:1}],
 ["gx_al_short","a_pants","Cargo Shorts",900,1,"Stone canvas, black webbing belt.",{gar:"al_short",b:"alt",mo:1}],
 ["gx_al_hiker","a_shoes","Trail Hikers",1500,1,"Black mesh, blaze orange laces.",{gar:"al_hiker",b:"alt"}],
 ["gx_al_sandal","a_shoes","Hike Sandals & Socks",850,1,"Black straps, grey wool socks.",{gar:"al_sandal",b:"alt"}],
 ["gx_nc_jog_black","a_pants","Signature Jogger, Black",1500,1,"Heavyweight fleece, white wordmark.",{gar:"nc_jog_black",b:"nc"}],
 ["gx_nc_jog_ash","a_pants","Signature Jogger, Ash",1500,1,"Heather grey, navy wordmark.",{gar:"nc_jog_ash",b:"nc"}],
 ["gx_nc_jog_slate","a_pants","Signature Jogger, Slate",1500,1,"Mid grey, cuffs that stack.",{gar:"nc_jog_slate",b:"nc"}],
 ["gx_nc_short","a_pants","Training Short",950,1,"Seven inches, wordmark on the leg.",{gar:"nc_short",b:"nc"}],
 ["gx_nc_cap","a_hat","Wordmark Cap",800,1,"Black six-panel. nicecock.",{gar:"nc_cap",b:"nc"}],
 ["gx_nc_beanie","a_hat","Rooster Beanie",750,1,"Ash rib knit, woven rooster.",{gar:"nc_beanie",b:"nc"}],
 ["gx_nc_band","a_hat","Fleece Dad Cap",800,1,"Heather ash fleece, tonal rooster.",{gar:"nc_band",b:"nc"}],
 ["gx_nc_pendant","a_acc","Cashmere Scarf",1100,1,"Ash cashmere, cream edges, worn loose.",{gar:"nc_pendant",b:"nc"}],
 ["gx_nc_shades","a_acc","Rimless Aviators",900,1,"Smoke gradient lenses, silver bridge.",{gar:"nc_shades",b:"nc"}],
 ["gx_nc_hoodie","a_top","Embossed Crest Hoodie",1700,1,"Jet black, rooster in relief.",{gar:"nc_hoodie",b:"nc"}],
 ["gx_nc_tee","a_top","Layered Lounge Tee",1100,1,"Cream oversized tee over a charcoal thermal.",{gar:"nc_tee",b:"nc"}],
 ["gx_nc_tank","a_top","Waffle Lounge Zip",1500,1,"Ivory waffle knit, half zipped.",{gar:"nc_tank",b:"nc"}],
 ["gx_nc_qzip","a_top","Sherpa Fleece Zip",1700,1,"Heather ash, cream sherpa collar.",{gar:"nc_qzip",b:"nc"}],
 ["gx_nc_court","a_shoes","Silver Court High-Top",1600,1,"Cream leather, silver panels.",{gar:"nc_court",b:"nc"}],
 ["gx_nc_knit","a_shoes","Suede Runner",1400,1,"Ash suede over silver mesh.",{gar:"nc_knit",b:"nc"}],
 ["gx_nc_slide","a_shoes","Shearling Clogs & Socks",1500,1,"Taupe suede, shearling lining, lounge socks.",{gar:"nc_slide",b:"nc"}],
 /* KODE PINK "Night drive" (Cal 11-13: "Make it more city pop but actually cool and more sleek"; approved 11-18; ROOMS 52dda64, shop text
    shots/pending_art/kodepink/final/shop_text.md): new names and lines, same ids, slots and prices */
 ["gx_kp_bucket","a_hat","Neon Stripe Bucket",800,1,"Black bucket hat, a pink-to-coral neon band.",{gar:"kp_bucket",b:"kp"}],
 ["gx_kp_phones","a_hat","Chrome Night Headphones",1100,1,"Black and chrome, cups lit pink.",{gar:"kp_phones",b:"kp"}],
 ["gx_kp_clips","a_hat","Neon Tube Clips",450,1,"Two glowing pink-to-coral tube clips.",{gar:"kp_clips",b:"kp"}],
 ["gx_kp_bag","a_acc","Patent Mini Crossbody",1000,1,"Black patent, push-lock, chrome chain strap.",{gar:"kp_bag",b:"kp"}],
 ["gx_kp_pendant","a_acc","Chrome Crescent Pendant",800,1,"A mirror-chrome moon on a fine silver chain.",{gar:"kp_pendant",b:"kp"}],
 ["gx_kp_varsity","a_top","Midnight Varsity",1800,1,"Black body, navy sleeves, sunset-stripe trims.",{gar:"kp_varsity",b:"kp"}],
 ["gx_kp_sailor","a_top","Night Palm Shirt",1100,1,"Navy camp-collar shirt, coral palm print.",{gar:"kp_sailor",b:"kp"}],
 ["gx_kp_hoodie","a_top","Sunset Stripe Hoodie",1300,1,"Black hoodie, a pink-to-coral stripe down each sleeve.",{gar:"kp_hoodie",b:"kp"}],
 ["gx_kp_bomber","a_top","Gloss Leather Bomber",1600,1,"Black glossy leather, silver zip, ribbed hem.",{gar:"kp_bomber",b:"kp"}],
 ["gx_kp_track","a_pants","Sunset Track Pants",1000,1,"Black, one pink-to-coral side stripe, cropped.",{gar:"kp_track",b:"kp"}],
 ["gx_kp_skirt","a_pants","Navy Pleated Skirt",1000,1,"Deep navy knife pleats, a silver-buckle belt.",{gar:"kp_skirt",b:"kp",fo:1}],
 ["gx_kp_cargo","a_pants","Charcoal Wide-Leg Cargo",1200,1,"Charcoal wide legs, deep side pockets.",{gar:"kp_cargo",b:"kp"}],
 ["gx_kp_runner","a_shoes","Chrome Night Runners",1200,1,"Black mesh, silver-blue chrome panels.",{gar:"kp_runner",b:"kp"}],
 ["gx_kp_loafer","a_shoes","Patent Penny Loafers",1100,1,"Glossy navy patent, white socks.",{gar:"kp_loafer",b:"kp"}],
 ["gx_kp_slipon","a_shoes","Navy Canvas Slip-Ons",800,1,"Navy canvas, white rubber soles.",{gar:"kp_slipon",b:"kp"}],
 ["gx_sm_halomask","a_hat","Halo Mask",2200,1,"The \u00d8 helmet, halo and all.",{gar:"sm_halomask",b:"sm"}],
 ["gx_sm_halo","a_hat","Neon Halo",1200,1,"An orange ring that follows you.",{gar:"sm_halo",b:"sm"}],
 ["gx_sm_beanie","a_hat","\u00d8 Beanie",750,1,"Black knit, cyan piping.",{gar:"sm_beanie",b:"sm"}],
 ["gx_sm_phones","a_acc","DJ Headphones",1300,1,"Round the neck, cups lit cyan.",{gar:"sm_phones",b:"sm"}],
 ["gx_sm_pendant","a_acc","\u00d8 Pendant",900,1,"Orange enamel on a black chain.",{gar:"sm_pendant",b:"sm"}],
 ["gx_sm_hoodie","a_top","Signature Neon Hoodie",2000,1,"Every seam traced in cyan.",{gar:"sm_hoodie",b:"sm"}],
 ["gx_sm_track","a_top","Glow Track Jacket",1400,1,"Black zip-up, cyan stripes.",{gar:"sm_track",b:"sm"}],
 ["gx_sm_tee","a_top","GO OFF Tee",950,1,"Bone white, orange outline type.",{gar:"sm_tee",b:"sm"}],
 ["gx_sm_vest","a_top","Rig Vest",1500,1,"Orange straps and buckles.",{gar:"sm_vest",b:"sm"}],
 ["gx_sm_cargo","a_pants","Flare Cargo",1500,1,"The orange ones from the covers.",{gar:"sm_cargo",b:"sm"}],
 ["gx_sm_nightcargo","a_pants","Night Cargo",1300,1,"Black, cyan piping.",{gar:"sm_nightcargo",b:"sm"}],
 ["gx_sm_shorts","a_pants","Bass Shorts",900,1,"Black mesh, orange stripe.",{gar:"sm_shorts",b:"sm"}],
 ["gx_sm_hightop","a_shoes","Glow-Sole High-Tops",1700,1,"Soles lit cyan from inside.",{gar:"sm_hightop",b:"sm"}],
 ["gx_sm_runner","a_shoes","Flare Runners",1300,1,"Chunky, orange laces.",{gar:"sm_runner",b:"sm"}],
 ["gx_sm_boots","a_shoes","Neon-Lace Boots",1400,1,"Combat boots, cyan laces.",{gar:"sm_boots",b:"sm"}],
 /* Cal 11-18 SAYMØRE: the GO OFF Tee's replacement (ROOMS cefab81) */
 ["gx_sm_grille","a_top","Speaker-Grille Bomber",1600,1,"Grille-mesh panels, cyan EQ bars up the back, orange \u00d8 badge.",{gar:"sm_grille",b:"sm"}],
 ["gx_smk_band","a_hat","Stitched Headband",700,1,"Ash-grey cloth, a stitched smoke puff.",{gar:"smk_band",b:"smk"}],
 ["gx_smk_wrap","a_hat","Spiky Headwrap",650,1,"Ink black, an ember-orange tie.",{gar:"smk_wrap",b:"smk"}],
 ["gx_smk_cowl","a_acc","Half-Face Cowl",800,1,"Up over the nose, eyes only.",{gar:"smk_cowl",b:"smk"}],
 ["gx_smk_tape","a_acc","Wrap Tape Set",500,1,"Cream tape on the arms and shins.",{gar:"smk_tape",b:"smk"}],
 ["gx_smk_pouch","a_acc","Scroll Pouch",600,1,"A scroll on a hip strap.",{gar:"smk_pouch",b:"smk"}],
 ["gx_smk_jacket","a_top","High-Collar Zip Jacket",1500,1,"Ink black, ember-orange panels.",{gar:"smk_jacket",b:"smk"}],
 ["gx_smk_mesh","a_top","Mesh Wrap Top",1100,1,"Sleeveless wrap over a mesh undershirt.",{gar:"smk_mesh",b:"smk"}],
 ["gx_smk_vest","a_top","Quilted Puffer Vest",1200,1,"Funnel neck, ember zip, cream sleeves.",{gar:"smk_vest",b:"smk"}],
 ["gx_smk_cloak","a_top","Torn Hood Cloak",1400,1,"Short, hooded, the hem torn ragged.",{gar:"smk_cloak",b:"smk"}],
 ["gx_smk_cargo","a_pants","Wrapped Cargo",1100,1,"Shins bound tight.",{gar:"smk_cargo",b:"smk"}],
 ["gx_smk_hakama","a_pants","Wide Hakama",1200,1,"Steel-grey pleats, wide legs.",{gar:"smk_hakama",b:"smk"}],
 ["gx_smk_shorts","a_pants","Shorts over Fishnet",900,1,"Ember stripe, mesh to the ankle.",{gar:"smk_shorts",b:"smk"}],
 ["gx_smk_sandal","a_shoes","Shinobi Sandals",700,1,"Open toe, black straps.",{gar:"smk_sandal",b:"smk"}],
 ["gx_smk_tabi","a_shoes","Split-Toe Tabi Boots",1100,1,"Worn over the trouser hem.",{gar:"smk_tabi",b:"smk"}],
 ["gx_smk_runner","a_shoes","Wrapped Runners",1000,1,"Running shoes bound in cloth tape.",{gar:"smk_runner",b:"smk"}],
 ["gx_gp_cathood","a_hat","Cat-Ear Hood",800,1,"Lilac knit, pink-lined ears.",{gar:"gp_cathood",b:"gp"}],
 ["gx_gp_bunny","a_hat","Bunny Beanie",750,1,"Candy pink, one ear flopped.",{gar:"gp_bunny",b:"gp"}],
 ["gx_gp_bow","a_hat","Satin Bow",500,1,"Lilac, a gold star in the knot.",{gar:"gp_bow",b:"gp"}],
 ["gx_gp_wings","a_acc","Little Angel Wings",1200,1,"White feathers, gold tips.",{gar:"gp_wings",b:"gp"}],
 ["gx_gp_hearts","a_acc","Heart Shades",700,1,"Pink frames, sky-blue hearts.",{gar:"gp_hearts",b:"gp"}],
 ["gx_gp_blazer","a_top","Candy School Blazer",1400,1,"Pink, blue piping, a lilac bow.",{gar:"gp_blazer",b:"gp"}],
 ["gx_gp_bear","a_top","Bear Onesie Top",1300,1,"Sky-blue fleece, ears on the hood.",{gar:"gp_bear",b:"gp"}],
 ["gx_gp_star","a_top","Star Hoodie",1100,1,"Oversized lilac, gold stars.",{gar:"gp_star",b:"gp"}],
 ["gx_gp_sailor","a_top","Frilled Sailor Blouse",1000,1,"Sky-blue collar, pink scarf.",{gar:"gp_sailor",b:"gp"}],
 ["gx_gp_skirt","a_pants","Star Pleated Skirt",900,1,"Sky blue, gold stars on the hem.",{gar:"gp_skirt",b:"gp",fo:1}],
 ["gx_gp_shorts","a_pants","Bubble Shorts",850,1,"Puffy pink, starry suspenders.",{gar:"gp_shorts",b:"gp"}],
 ["gx_gp_overall","a_pants","Pastel Overalls",1100,1,"Lilac denim, a gold star patch.",{gar:"gp_overall",b:"gp"}],
 ["gx_gp_mary","a_shoes","Platform Mary Janes",1000,1,"Pink gloss, frilly socks.",{gar:"gp_mary",b:"gp"}],
 ["gx_gp_slipper","a_shoes","Fluffy Slipper Boots",800,1,"Sky-blue fur, pink pompoms.",{gar:"gp_slipper",b:"gp"}],
 ["gx_gp_glitter","a_shoes","Light-Up Glitter Kicks",1200,1,"Gold glitter, glowing soles.",{gar:"gp_glitter",b:"gp"}],
 ["gx_sp_beanie","a_hat","Pixel Heart Beanie",700,1,"Purple knit, one red pixel heart.",{gar:"sp_beanie",b:"sp"}],
 ["gx_sp_headset","a_hat","Gaming Headset",1200,1,"Purple cups, teal glow, a boom mic.",{gar:"sp_headset",b:"sp"}],
 ["gx_sp_cap","a_hat","Coin Cap",650,1,"Worn backwards, a gold coin up front.",{gar:"sp_cap",b:"sp"}],
 ["gx_sp_cart","a_acc","Cartridge Pendant",800,1,"A tiny game cartridge on a ball chain.",{gar:"sp_cart",b:"sp"}],
 ["gx_sp_shades","a_acc","Pixel Shades",600,1,"Black pixel frames, a white glint in each lens.",{gar:"sp_shades",b:"sp"}],
 ["gx_sp_varsity","a_top","Arcade Varsity",1500,1,"Joystick patch, pixel heart on the back.",{gar:"sp_varsity",b:"sp"}],
 ["gx_sp_pad","a_top","Button Tee",850,1,"Four round buttons, no symbols.",{gar:"sp_pad",b:"sp"}],
 ["gx_sp_p2","a_top","Player 2 Ringer",900,1,"White tee, purple trim, PLAYER 2 in teal.",{gar:"sp_p2",b:"sp"}],
 ["gx_sp_hpknit","a_top","Health Bar Sweater",1200,1,"Four and a half hearts left.",{gar:"sp_hpknit",b:"sp"}],
 ["gx_sp_camo","a_pants","Pixel Camo Cargo",1100,1,"Purple, grey and teal blocks.",{gar:"sp_camo",b:"sp"}],
 ["gx_sp_track","a_pants","D-Pad Track Pants",950,1,"Purple, d-pads down the stripe.",{gar:"sp_track",b:"sp"}],
 ["gx_sp_denim","a_pants","Sticker Denim Shorts",850,1,"Hearts, a star, cherries, a coin.",{gar:"sp_denim",b:"sp"}],
 ["gx_sp_flame","a_shoes","Pixel Flame High-Tops",1200,1,"Eight-bit fire up the sides.",{gar:"sp_flame",b:"sp"}],
 ["gx_sp_runner","a_shoes","Retro Runners",1000,1,"Grey, purple and teal, a pixel star.",{gar:"sp_runner",b:"sp"}],
 ["gx_sp_flag","a_shoes","Checkpoint Sneakers",900,1,"Grey canvas, purple toe, a pixel flag.",{gar:"sp_flag",b:"sp"}],
 ["gx_bb_wizard","a_hat","Wizard Hat",1100,1,"Midnight felt, a brass buckle, a few stars.",{gar:"bb_wizard",b:"bb"}],
 ["gx_bb_mantle","a_hat","Ranger Hood",900,1,"Pine wool, a brass leaf clasp.",{gar:"bb_mantle",b:"bb"}],
 ["gx_bb_circlet","a_hat","Leaf Circlet",800,1,"Silver leaves and one moonstone.",{gar:"bb_circlet",b:"bb"}],
 ["gx_bb_bracers","a_acc","Leather Bracers",700,1,"Laced, a leaf on each.",{gar:"bb_bracers",b:"bb"}],
 ["gx_bb_crystal","a_acc","Crystal on a Cord",600,1,"A raw blue point, silver-wrapped.",{gar:"bb_crystal",b:"bb"}],
 ["gx_bb_tunic","a_top","Adventurer's Tunic",1000,1,"Pine green, a brass-buckled belt.",{gar:"bb_tunic",b:"bb"}],
 ["gx_bb_gambeson","a_top","Quilted Gambeson",1300,1,"Oatmeal linen, laced up the front.",{gar:"bb_gambeson",b:"bb"}],
 ["gx_bb_doublet","a_top","Bard's Doublet",1400,1,"Burgundy velvet, slashed puffed sleeves.",{gar:"bb_doublet",b:"bb"}],
 ["gx_bb_cloak","a_top","Travel Cloak",1500,1,"Knee-length wool, a round brass clasp.",{gar:"bb_cloak",b:"bb"}],
 ["gx_bb_leather","a_pants","Laced Leather Trousers",1100,1,"Dark brown, laced down the sides.",{gar:"bb_leather",b:"bb"}],
 ["gx_bb_skirt","a_pants","Tool-Belt Skirt",1000,1,"Layered linen, pouches and a brass key.",{gar:"bb_skirt",b:"bb",fo:1}],
 ["gx_bb_breeches","a_pants","Tucked Breeches",850,1,"Tan wool, buckled below the knee.",{gar:"bb_breeches",b:"bb"}],
 ["gx_bb_cuffboot","a_shoes","Cuffed Boots",1200,1,"Folded cuffs, a brass ankle buckle.",{gar:"bb_cuffboot",b:"bb"}],
 ["gx_bb_slipper","a_shoes","Moonsilver Slippers",800,1,"Soft suede, curled toes.",{gar:"bb_slipper",b:"bb"}],
 ["gx_bb_hobnail","a_shoes","Hobnail Boots",1000,1,"Brass studs, a wool sock.",{gar:"bb_hobnail",b:"bb"}],
 ["gx_cr_visor","a_acc","LED Visor",1100,1,"A row of cyan lights across the eyes.",{gar:"cr_visor",b:"cr"}],
 ["gx_cr_mohawk","a_hat","Mohawk Helmet",1300,1,"Matte black, a crest of neon spikes.",{gar:"cr_mohawk",b:"cr"}],
 ["gx_cr_hood","a_hat","Glow-Rim Hood",900,1,"Techwear black, a cyan edge.",{gar:"cr_hood",b:"cr"}],
 ["gx_cr_arm","a_acc","Chrome Arm Sleeve",1400,1,"One arm, plated, cyan seams.",{gar:"cr_arm",b:"cr"}],
 ["gx_cr_shades","a_acc","Mirror Shades",700,1,"Chrome frames, a neon gradient.",{gar:"cr_shades",b:"cr"}],
 ["gx_cr_trench","a_top","Holo Trench",1800,1,"Knee-length, iridescent, collar up.",{gar:"cr_trench",b:"cr"}],
 ["gx_cr_bomber","a_top","Glow-Seam Bomber",1500,1,"Glossy black, cyan along every seam.",{gar:"cr_bomber",b:"cr"}],
 ["gx_cr_mesh","a_top","Mesh Harness Top",1000,1,"Cropped dark mesh, chrome-ringed straps.",{gar:"cr_mesh",b:"cr"}],
 ["gx_cr_vest","a_top","Street Armour Vest",1400,1,"Chrome plates, rose light strips.",{gar:"cr_vest",b:"cr"}],
 ["gx_cr_cargo","a_pants","Neon Piped Cargo",1100,1,"Glossy black, cyan piping.",{gar:"cr_cargo",b:"cr"}],
 ["gx_cr_skirt","a_pants","Techno Panel Skirt",950,1,"Split panels, glowing seams.",{gar:"cr_skirt",b:"cr",fo:1}],
 ["gx_cr_knee","a_pants","Armoured Knee Joggers",1100,1,"Chrome knee pads, cyan rings.",{gar:"cr_knee",b:"cr"}],
 ["gx_cr_lightup","a_shoes","Light-Up Sneakers",1200,1,"Soles that glow cyan.",{gar:"cr_lightup",b:"cr"}],
 ["gx_cr_platform","a_shoes","Platform Buckle Boots",1300,1,"Patent black, rose-lit soles.",{gar:"cr_platform",b:"cr"}],
 ["gx_cr_combat","a_shoes","Chrome-Toe Combat Boots",1200,1,"Steel toes, a cyan cuff.",{gar:"cr_combat",b:"cr"}],
 ["gx_km_bucket","a_hat","Faded Bucket Hat",600,1,"Sea teal cotton, a coral tag.",{gar:"km_bucket",b:"km"}],
 ["gx_km_straw","a_hat","Straw Sun Hat",750,1,"Woven straw, a teal ribbon.",{gar:"km_straw",b:"km"}],
 ["gx_km_visor","a_hat","Coral Sun Visor",500,1,"All brim, no top.",{gar:"km_visor",b:"km"}],
 ["gx_km_shell","a_acc","Shell Necklace",550,1,"Puka beads and a spiral shell.",{gar:"km_shell",b:"km"}],
 ["gx_km_round","a_acc","Round Tinted Shades",650,1,"Gold wire, teal lenses.",{gar:"km_round",b:"km"}],
 ["gx_km_camp","a_top","Hibiscus Camp Shirt",1000,1,"Sand, coral flowers, teal leaves.",{gar:"km_camp",b:"km"}],
 ["gx_km_boat","a_top","Striped Boat-Neck Tee",750,1,"Cream and sea teal stripes.",{gar:"km_boat",b:"km"}],
 ["gx_km_rash","a_top","Zip Rash Guard",900,1,"Teal with coral side panels.",{gar:"km_rash",b:"km"}],
 ["gx_km_crochet","a_top","Crochet Cardigan",1100,1,"Sand yarn, a scalloped coral edge.",{gar:"km_crochet",b:"km"}],
 ["gx_km_board","a_pants","Board Shorts",800,1,"Teal, a wave-print band.",{gar:"km_board",b:"km"}],
 ["gx_km_linen","a_pants","Linen Drawstring Pants",900,1,"Pale sand, loose and creased.",{gar:"km_linen",b:"km"}],
 ["gx_km_cutoff","a_pants","Cut-Off Shorts",700,1,"Faded denim, frayed hems.",{gar:"km_cutoff",b:"km"}],
 ["gx_km_slides","a_shoes","Woven Slides",550,1,"A straw strap, a coral edge.",{gar:"km_slides",b:"km"}],
 ["gx_km_deck","a_shoes","Canvas Deck Shoes",800,1,"Faded teal, a rope heel.",{gar:"km_deck",b:"km"}],
 ["gx_km_sandal","a_shoes","Sport Sandals",750,1,"Teal webbing, a layered sole.",{gar:"km_sandal",b:"km"}],
 ["gx_oak_headband","a_hat","Terry Headband",450,1,"Cream, one burgundy and one navy stripe.",{gar:"oak_headband",b:"oak"}],
 ["gx_oak_visor","a_hat","Tennis Visor",500,1,"Crisp white, a burgundy edge.",{gar:"oak_visor",b:"oak"}],
 ["gx_oak_cap","a_hat","Sweatband Cap",650,1,"Cream crown, burgundy brim.",{gar:"oak_cap",b:"oak"}],
 ["gx_oak_wrist","a_acc","Terry Wristbands",400,1,"A pair, striped.",{gar:"oak_wrist",b:"oak"}],
 ["gx_oak_watch","a_acc","Retro Sport Watch",700,1,"Burgundy case, cream strap.",{gar:"oak_watch",b:"oak"}],
 ["gx_oak_track","a_top","Club Track Jacket",1300,1,"Cream and burgundy, two navy stripes.",{gar:"oak_track",b:"oak"}],
 ["gx_oak_polo","a_top","Terry Polo",900,1,"Burgundy terry, a cream collar.",{gar:"oak_polo",b:"oak"}],
 ["gx_oak_crop","a_top","Cropped Club Sweatshirt",850,1,"Cream, crossed rackets on the chest.",{gar:"oak_crop",b:"oak"}],
 ["gx_oak_vest","a_top","Cable-Knit Tennis Vest",1000,1,"Cream, a striped V neck.",{gar:"oak_vest",b:"oak"}],
 ["gx_oak_trackpant","a_pants","Club Track Pants",1000,1,"Cream, burgundy side panels.",{gar:"oak_trackpant",b:"oak"}],
 ["gx_oak_skirt","a_pants","Pleated Tennis Skirt",850,1,"Cream pleats, a striped hem.",{gar:"oak_skirt",b:"oak",fo:1}],
 ["gx_oak_shorts","a_pants","Retro Running Shorts",700,1,"Burgundy, cream piping.",{gar:"oak_shorts",b:"oak"}],
 ["gx_oak_court","a_shoes","Canvas Court Shoes",850,1,"Cream canvas, a burgundy toe.",{gar:"oak_court",b:"oak"}],
 ["gx_oak_suede","a_shoes","Suede Runners",950,1,"Burgundy suede, a gum sole.",{gar:"oak_suede",b:"oak"}],
 ["gx_oak_tube","a_shoes","Tube Socks and Trainers",750,1,"Striped socks, white trainers.",{gar:"oak_tube",b:"oak"}],
 ["gx_sv_pom","a_hat","Pom-Pom Beanie",550,1,"Snowflake knit, a cherry pom.",{gar:"sv_pom",b:"sv"}],
 ["gx_sv_trapper","a_hat","Trapper Hat",750,1,"Quilted navy, fleece earflaps.",{gar:"sv_trapper",b:"sv"}],
 ["gx_sv_goggles","a_hat","Ski Goggles",700,1,"Mirrored lenses, pushed up.",{gar:"sv_goggles",b:"sv"}],
 ["gx_sv_scarf","a_acc","Chunky Knit Scarf",500,1,"Red and white, fringed ends.",{gar:"sv_scarf",b:"sv"}],
 ["gx_sv_mitten","a_acc","Snowflake Mittens",450,1,"Cherry red, a white snowflake.",{gar:"sv_mitten",b:"sv"}],
 ["gx_sv_ski","a_top","Color-Block Ski Jacket",1300,1,"Red, white and navy panels.",{gar:"sv_ski",b:"sv"}],
 ["gx_sv_nordic","a_top","Nordic Sweater",1000,1,"Cream, a red snowflake yoke.",{gar:"sv_nordic",b:"sv"}],
 ["gx_sv_quilt","a_top","Quilted Vest",950,1,"Cherry red over a white turtleneck.",{gar:"sv_quilt",b:"sv"}],
 ["gx_sv_fleece","a_top","Half-Zip Fleece",850,1,"Fuzzy navy, a red chest pocket.",{gar:"sv_fleece",b:"sv"}],
 ["gx_sv_snow","a_pants","Puffy Snow Pants",1000,1,"Navy, red side stripes.",{gar:"sv_snow",b:"sv"}],
 ["gx_sv_leggings","a_pants","Ski Leggings",800,1,"Navy stretch, a red stripe.",{gar:"sv_leggings",b:"sv",fo:1}],
 ["gx_sv_cord","a_pants","Lodge Cords",850,1,"Cherry corduroy, cuffed.",{gar:"sv_cord",b:"sv"}],
 ["gx_sv_puffer","a_shoes","Puffer Snow Boots",950,1,"Quilted white, red toggles.",{gar:"sv_puffer",b:"sv"}],
 ["gx_sv_apres","a_shoes","Apr\u00e8s Boots",1000,1,"Tan leather, shearling cuffs.",{gar:"sv_apres",b:"sv"}],
 ["gx_sv_shearling","a_shoes","Shearling Slippers",650,1,"Navy suede, a red snowflake.",{gar:"sv_shearling",b:"sv"}]];
/* NICE COCK (Cal's brand, drop 5): ROOMS's 67d0e85 pieces and shop lines, prices a notch above ALTITUDE */
/* KODE PINK (Cal's music project): ROOMS's 1dde4e1 + c382557 pieces and shop lines */
/* SAYMØRE (Cal's artist brand): ROOMS's 9e19cdf pieces and shop lines */
/* SMOKE BOMB (ninja anime, approved): ROOMS's a07439f pieces and shop lines */
/* GACHA POP (MMO cash shop, approved): ROOMS's 03274a7 pieces and shop lines */
/* SAVE POINT (retro video games, approved): ROOMS's bad0b45 pieces and shop lines; the headset's back and the slip-ons, now lace-ups, redone in 200d498 */
/* BARD & BLADE (high fantasy, approved): ROOMS's f843b25 pieces and shop lines; the bracers use the rig's "arms" slot */
/* CHROME RAIN (cyberpunk, approved): ROOMS's 5cf2e1d pieces and shop lines; the arm sleeve uses the "arms" slot */
/* KAIMANA (surf club, BRANDS_PROPOSAL.md; made on Cal's standing approval, rule 19): ROOMS's 24304af pieces and shop lines */
/* OAKMONT (80s country-club athletic, BRANDS_15.md; rule 19): ROOMS's 78c961b pieces and shop lines; the wristbands and watch use the "arms" slot */
/* SØLVBERG (après-ski, BRANDS_15.md; rule 19): ROOMS's 57527b0 pieces and shop lines; the mittens use the "arms" slot */
EXTRA_ITEMS.forEach(function(x){if(!x[6].soon)SHOP.push(x)});

/* The basics from the character creator, each sold on its own. They set the same options
   the creator does, so they need no art of their own beyond a shop icon. */
(function(){
  var D=window.QBDATA.creator,add=function(id,slot,name,price,desc,basic,extra){SHOP.push([id,slot,name,price,1,desc,Object.assign({basic:basic,b:"basics"},extra||{})])};
  [["tops","a_top","top","topColor",{tee:200,hoodie:350,bomber:350},"Everyday basic."],["bottoms","a_pants","bottom","bottomColor",{joggers:250,jeans:250,shorts:200},"Everyday basic."],["shoes","a_shoes","shoe","shoeColor",{sneakers:200,boots:300,flipflops:150},"Everyday basic."]].forEach(function(g){
    D[g[0]].forEach(function(o){D.clothColors.forEach(function(c){add("bs_"+o.id+"_"+c.id,g[1],c.label+" "+o.label,g[4][o.id],g[5],{key:g[2],id:o.id,ckey:g[3],color:c.id},{icon:"basic_"+o.id+"_"+c.id})})})});
  ["m","f"].forEach(function(b){D.hairStyles[b].forEach(function(o){var x={};x[b==="f"?"fo":"mo"]=1;x.icon="basic_"+b+"_"+o.id;add("bs_hair_"+b+"_"+o.id,"a_hair",o.label+" Cut",500,"A new hairstyle.",{key:"hairStyle",id:o.id},x)})});
  D.hairColors.forEach(function(c){add("bs_dye_"+c.id,"a_hairc",c.label+" Dye",400,"Changes your hair color.",{key:"hairColor",id:c.id},{swatch:c.swatch})});
  D.eyeColors.forEach(function(c){add("bs_eye_"+c.id,"a_eyes",c.label+" Eyes",400,"Changes your eye color.",{key:"eyeColor",id:c.id},{swatch:c.swatch,round:1})});
})();

function isRigItem(x){return !!(x[6]&&(x[6].gar||x[6].basic))}
function itemArt(it){var k="icon_"+(it[6].icon||it[6].gar)+".webp";return (window.QBART&&QBART[k])||"art/"+k}
/* Every piece carries its mark. Anyone can browse anything; only your own can be bought. */
function qsMark(it){var f=it[6].fo,m=it[6].mo;return '<span class="qs-mark '+(f?"f":m?"m":"u")+'" title="'+(f?"Women's":m?"Men's":"Unisex")+'" aria-label="'+(f?"Women's":m?"Men's":"Unisex")+'">'+(f?"♀":m?"♂":"⚥")+'</span>'}
function qsThumb(it){return '<div class="qs-img">'+(it[6].swatch?'<i class="qs-swatch'+(it[6].round?" round":"")+'" style="background:'+it[6].swatch+'"></i>':'<img src="'+itemArt(it)+'" alt="" loading="lazy">')+qsMark(it)+'</div>'}
garThumb=qsThumb;

/* The creator's choice for a slot counts as worn while nothing else is. */
function qsOriginal(it){var bs=it[6].basic;if(!bs||!S.char)return false;var c=rigChoiceFull();return c[bs.key]===bs.id&&(!bs.ckey||c[bs.ckey]===bs.color)}
function rigChoiceFull(){return Object.assign({},QBLoft.data.creator.defaults,rigChoice(fixChar(S.char)))}
function qsGrantOriginals(){if(!S.created||!S.char)return;SHOP.forEach(function(it){if(it[6]&&it[6].basic&&itemFits(it)&&qsOriginal(it))S.owned[it[0]]=true})}
function qsCard(it){
  var fits=itemFits(it),orig=qsOriginal(it),own=!!S.owned[it[0]],on=own&&(S.eq[it[1]]===it[0]||(!S.eq[it[1]]&&orig)),can=S.coins>=it[3];
  var price='<i class="coin"></i>'+it[3];
  var btn=!fits?'<button class="qs-btn" data-act="qsdeny" data-id="'+it[0]+'">'+price+'</button>'
    :on?(orig?'<button class="qs-btn ghost" disabled>Wearing</button>':'<button class="qs-btn ghost" data-act="unequip" data-id="'+it[1]+'">Equipped · Remove</button>')
    :own?'<button class="qs-btn alt" data-act="equip" data-id="'+it[0]+'">Equip</button>'
    :QS_TRYSL.indexOf(it[1])>=0?(QS_TRY[it[1]]===it[0]?'<button class="qs-btn alt" data-act="qstry" data-id="'+it[0]+'">Trying on · '+price+'</button>':'<button class="qs-btn" data-act="qstry" data-id="'+it[0]+'">Try on · '+price+'</button>')
    :can?'<button class="qs-btn" data-act="buy" data-id="'+it[0]+'">'+price+'</button>'
    :'<button class="qs-btn ghost" disabled>'+price+' · need '+(it[3]-S.coins)+' more</button>';
  /* the second accessory (level ECON.accLv): an owned accessory that is not the first and sits elsewhere on the body */
  if(it[1]==="a_acc"&&own&&!on&&typeof acc2Ok==="function"&&acc2Ok(it))btn+=S.eq.a_acc2===it[0]?'<button class="qs-btn ghost" data-act="unequip2">Second · Remove</button>':'<button class="qs-btn alt" data-act="equip2" data-id="'+it[0]+'">Wear as second</button>';
  return '<article class="qs-card'+(on||S.eq.a_acc2===it[0]?" on":"")+(QS_TRY[it[1]]===it[0]?" trying":"")+'" data-card="'+it[0]+'">'+qsThumb(it)+'<h4>'+esc(it[2])+'</h4><p>'+esc(it[5])+'</p>'+btn+'</article>';
}
var QS_GROUPS=[["a_hat","Hats"],["a_acc","Accessories"],["a_top","Tops"],["a_pants","Bottoms"],["a_shoes","Shoes"],["a_hair","Hair"],["a_hairc","Hair color"],["a_eyes","Eye color"]];
function qsGroups(pick){
  return QS_GROUPS.map(function(g){var items=SHOP.filter(function(x){return x[1]===g[0]&&isRigItem(x)&&pick(x)});
    return items.length?'<section class="qs-sec"><h3>'+g[1]+'</h3><div class="qs-grid">'+items.map(qsCard).join("")+'</div></section>':''}).join("");
}
function qsLegacy(tab){
  /* Upgrades and interface items keep their own art, on the light cards. */
  return SLOTS.filter(function(sl){return tab.indexOf(sl[0])>=0}).map(function(sl){
    var lv=effLvl(),items=SHOP.filter(function(x){return x[1]===sl[0]&&!isRigItem(x)&&itemFits(x)}),vis=items.filter(function(x){return x[4]<=lv}),nxt=items.filter(function(x){return x[4]>lv})[0];
    /* W48 (Cal): permanent upgrades come in a cascade, not by level (29sy_system.js) */
    if(sl[0]==="buff"&&typeof sysBuffs==="function")vis=sysBuffs(items);
    if(!vis.length&&!nxt)return "";
    /* Cal (2026-11-10): no level messages in the Shop (it was "Sealed, restocks at level N"); what opens later just appears */
    return vis.length?'<section class="qs-sec"><h3>'+sl[1]+'</h3><div class="shopgrid">'+vis.map(itemHtml).join("")+'</div></section>':""}).join("");
}
/* Each tab has its own page colour (Cal, 2026-11-05): a brand in its banner's palette, Basics and Vault the shop's cream,
   the Wardrobe the walk-in closet's champagne, Upgrades and Interface the Hero's Lair. Cards stay white; page text flips. */
var QS_THEME={basics:["#f6f2ea","#1f1b16"],vault:["#f6f2ea","#1f1b16"],wardrobe:["linear-gradient(180deg,#efe4d4,#dcc7aa)","#2b2116"],
  upgrades:["linear-gradient(180deg,#1a2036,#0f1424)","#e6ecff"],interface:["linear-gradient(180deg,#1a2036,#0f1424)","#e6ecff"]};
function qsTheme(b){var t=b?["linear-gradient(180deg,"+b.c[1]+","+b.c[0]+")","#f4f1ea"]:(QS_THEME[shopTab]||QS_THEME.basics),st=document.body.style;
  st.setProperty("--shopbg",t[0]);st.setProperty("--shopfg",t[1]);st.setProperty("--shopsolid",b?b.c[0]:/^#/.test(t[0])?t[0]:shopTab==="wardrobe"?"#dcc7aa":"#0f1424")}
/* Try before you buy (Cal, 2026-11-05: "a preview option that allows me to try on the clothes before committing ... and
   then a final button to confirm purchase"). Clothes go on the mirror one per slot without being bought; the basket under
   the mirror buys them all at once, after a confirm. Nothing tried on is saved. */
var QS_TRY={},QS_TRYSL=["a_hat","a_top","a_pants","a_shoes","a_acc"];
function qsTryList(){return Object.keys(QS_TRY).map(function(k){return shopItem(QS_TRY[k])}).filter(function(it){return it&&!S.owned[it[0]]&&itemFits(it)})}
/* Stays in view beside the rack (sticky), so you can see each piece on as you try, buy or equip it. */
function qsMirror(){
  var tl=qsTryList(),ovr={};tl.forEach(function(it){ovr[it[1]]=it[0]});
  var worn=SHOP.filter(function(x){return isRigItem(x)&&(ovr[x[1]]?ovr[x[1]]===x[0]:S.eq[x[1]]===x[0])}).map(function(x){return esc(x[2])});
  var cost=tl.reduce(function(a,it){return a+it[3]},0),bask=tl.length?'<div class="qs-bask"><small>Trying on '+tl.length+' piece'+(tl.length>1?'s':'')+'</small>'
    +(S.coins>=cost?'<button class="qs-btn" data-act="qscheck">Buy '+(tl.length>1?'all ':'')+'· <i class="coin"></i>'+cost.toLocaleString()+'</button>':'<button class="qs-btn ghost" disabled><i class="coin"></i>'+cost.toLocaleString()+' · need '+(cost-S.coins).toLocaleString()+' more</button>')
    +'<button class="qs-link" data-act="qsclear">Take them off</button></div>':'';
  return '<aside class="qs-mirror'+(tl.length?' trying':'')+'"><div class="qs-glass">'+calImg(lookOf(ovr),"idle",window.innerWidth<=640?92:150,"")+'</div><div class="qs-worn"><b>'+esc((S.char&&S.char.name)||"You")+'</b><small>'+(worn.length?worn.join(" · "):"Just the basics")+'</small>'+bask+'</div></aside>';
}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=qstry],[data-act=qsclear],[data-act=qscheck],[data-act=qsconfirm]");if(!b)return;var a=b.dataset.act;
  if(a==="qstry"){var it=shopItem(b.dataset.id);if(!it)return;if(QS_TRY[it[1]]===it[0])delete QS_TRY[it[1]];else QS_TRY[it[1]]=it[0];render();return}
  if(a==="qsclear"){QS_TRY={};render();return}
  var tl=qsTryList(),cost=tl.reduce(function(x,it){return x+it[3]},0);if(!tl.length)return;
  if(a==="qscheck"){modal('<div class="card box2 qs-confirm"><div class="rm-head"><span class="label">Checkout</span>'+coinPillHtml()+'</div><h3>'+tl.length+' piece'+(tl.length>1?'s':'')+'</h3><ul>'+tl.map(function(it){return '<li><span>'+esc(it[2])+'</span><b><i class="coin"></i>'+it[3].toLocaleString()+'</b></li>'}).join("")+'</ul><p class="note">Total <b><i class="coin"></i>'+cost.toLocaleString()+'</b>. You have '+S.coins.toLocaleString()+'.</p><div class="row"><button class="btn" data-act="qsconfirm">Confirm purchase</button><button class="btn ghost" data-act="mclose">Keep looking</button></div></div>');return}
  if(a==="qsconfirm"){if(S.coins<cost){pop("Need "+(cost-S.coins)+" more coins");return}var m=b.closest(".modal");if(m)m.remove();
    tl.forEach(function(it){S.coins-=it[3];S.spent+=it[3];S.owned[it[0]]=true;S.eq[it[1]]=it[0]});QS_TRY={};try{qbSnd("buy")}catch(x){}
    checkBadges();render();persist();try{burst(innerWidth/2,innerHeight/3,30)}catch(x){}pop("Bought "+(tl.length>1?tl.length+" pieces":tl[0][2])+". Wearing "+(tl.length>1?"them":"it")+" now.")}});
/* W42: the floor on screen (the Street, the Boutique, ...). Only floors this player has show, and the switch only with two or more */
var QSFLOOR="street";
/* W47: the line under "The Shop", per floor (Bebas shows it in capitals) */
var QS_WHEN={street:"New brands Mon and Thu 8 am",boutique:"New brands Mon and Thu 8 am",atelier:"New brands every other Mon and Thu 8 am"};
/* a floor other than the one on screen with a live brand not yet looked at: its button gets a "!" (29o_alerts.js clears it per floor) */
function qsFloorNew(d,id){try{if(id===QSFLOOR)return false;var o=alSeen();if(!o.init)return false;
  return ((d.floors&&d.floors[id]&&d.floors[id].live)||[]).some(function(b){return !o.brand[b.id]})}catch(e){return false}}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-qsfl]");if(!b)return;QSFLOOR=b.dataset.qsfl;window._qsSeen=0;render()});
shopHtml=function(){
  /* W41: the Wardrobe's filters last while the Shop is open; opened again, they start at All (29zw_wardrobe.js) */
  if(!document.body.classList.contains("shopmode"))wdReset();
  var d=dropState(),FO=d.open&&d.open.length?d.open:["street"];if(FO.indexOf(QSFLOOR)<0)QSFLOOR=FO[0];
  var FD=(d.floors&&d.floors[QSFLOOR])||d,FL=(typeof flGet==="function"&&flGet(QSFLOOR))||{},live=(FD.live||[]).slice().reverse();
  qsGrantOriginals();
  var tabs=live.map(function(b){return [b.id,(b.back?"\u21BA ":"")+b.name]}).concat([["basics","Stylist"],["wardrobe","Wardrobe"]]).concat(typeof sysHas==="function"&&!sysHas()?[]:[["upgrades","Upgrades"],["interface","Interface"]]);/* W48: Upgrades and Interface only once the Lair's big screen is built (29sy_system.js) */
  /* Opening the shop lands on the newest brand, not whichever tab was last in the save. */
  if(!window._qsSeen||!tabs.some(function(t){return t[0]===shopTab})){window._qsSeen=1;shopTab=live.length?live[0].id:"wardrobe"}
  /* Cal: the next drop is a small countdown on the Shop itself, not part of the banner. */
  /* W47 (Cal, 2026-11-10): "The Shop" top left with one line under it, the floor's drop days; the coins, + and envelope top right
     (29x_inbox.js); then the Wardrobe button, with the countdown beside it. No line about Wednesdays: the vault brand's own window
     says the vault is open, on the Wednesdays it is (25_splash.js) */
  var cd=FD.next?'<small class="qs-cd">New brand in '+cdTxt(dropStart(FD.next.start)-d.n)+'</small>':'';
  var h='<div class="qshop"><header class="qs-top qs-head"><h1>The Shop</h1><div class="qs-coin"><i class="coin"></i><b>'+S.coins+'</b></div><small class="qs-when">'+esc(QS_WHEN[QSFLOOR]||FL.line||QS_WHEN.street)+'</small></header>'
    +'<div class="qs-bar"><button class="qs-tab qs-wdb'+(shopTab==="wardrobe"?" on":"")+'" data-act="stab" data-v="wardrobe">Wardrobe</button>'+cd+'</div>';
  if(FO.length>1)h+='<nav class="qs-tabs qs-floors" aria-label="Shop floors">'+FO.map(function(id){var F=flGet(id)||{name:id};return '<button class="qs-tab'+(QSFLOOR===id?" on":"")+'" data-qsfl="'+esc(id)+'">'+esc(F.name)+(qsFloorNew(d,id)?'<i class="qs-flnew" aria-label="New">!</i>':'')+'</button>'}).join("")+'</nav>';
  h+='<nav class="qs-tabs" aria-label="Shop sections">'+tabs.filter(function(t){return t[0]!=="wardrobe"}).map(function(t){return '<button class="qs-tab'+(shopTab===t[0]?" on":"")+'" data-act="stab" data-v="'+t[0]+'">'+esc(t[1])+'</button>'}).join("")+'</nav>';
  var b=(FD.live||[]).filter(function(x){return x.id===shopTab})[0];qsTheme(b);
  if(b){
    h+=qsBanner(b,d);
    /* Cal: a brand back on Wednesday is here for the week only */
    if(b.back)h+='<p class="qs-note qs-lead">Back for Wednesday only. It leaves '+(function(){var t=dropStart(b.backUntil)-d.n;return t>0?'in '+cdTxt(t):'today'})()+'.</p>';
    h+='<div class="qs-fit">'+qsMirror()+'<div class="qs-rack">'+qsGroups(function(x){return x[6].b===b.id})+'</div></div>';
  }else if(shopTab==="basics"){
    /* v1.22, the Stylist (Cal, 2026-11-18: "Lets remove the Basics from the street. Replace it with something else for new hairstyles, eye
       shapes, mouth, like a stylist department"): haircuts, dyes and eye colours; the plain clothes are off sale (29zz_v122.js) */
    h+='<p class="qs-note qs-lead">A new cut, a new colour, new eyes.</p>';
    h+='<div class="qs-fit">'+qsMirror()+'<div class="qs-rack">'+qsGroups(function(x){return x[6].b==="basics"&&STYLIST[x[1]]})+'</div></div>';
  }else if(shopTab==="wardrobe"){
    var mine=SHOP.filter(function(x){return isRigItem(x)&&S.owned[x[0]]&&itemFits(x)});
    h+='<p class="qs-note qs-lead">Everything you own stays here, even after its brand leaves the shop.</p>';
    /* W41 (Cal): category and brand chips over the rack, which is grouped by the same categories (29zw_wardrobe.js) */
    h+=(mine.length?wdBar(mine):'')+'<div class="qs-fit">'+qsMirror()+'<div class="qs-rack">'+(mine.length?wdRack(mine):'<p class="qs-empty">Nothing here yet. Pieces you buy will wait for you here.</p>')+'</div></div>';
  }else if(shopTab==="upgrades"){
    h+='<p class="qs-note">Each upgrade is permanent and stacks with your other bonuses.</p>'+qsLegacy(["buff"]);
  }else{
    h+='<div class="qs-fit qs-fitif">'+ifPreview()+'<div class="qs-rack">'+qsLegacy(["theme","frame","bg","pet","title","burst","hud","sound","scene"])+'</div></div>';
  }
  h+=(window.QB_WEB&&QB_WEB.noTest?'':'<p class="qs-dev">Testing: <button class="qs-link" data-act="simwk">Skip ahead one week</button> <button class="qs-link" data-act="simrs">Reset</button> <button class="qs-link" data-act="simcoin">Add 10,000 coins</button> <button class="qs-link" data-act="simlvl">Level up</button></p>')+'</div>';
  return h;
};
/* The wardrobe button in the room opens the same screen. */
wardrobeModal=function(){view="shop";shopTab="wardrobe";window._qsSeen=1;render();window.scrollTo(0,0)};
/* The brand banner at the top of the Shop (Cal, 2026-11-05: "a full stylized and classy banner"). The brand's own colours
   deepen to near black, with its logo as a faint watermark, fine pinstripes, a light sheen and a thin frame in its accent,
   the name between hairline ornaments. When banner art exists (art/app/ui_banner_<id>.webp, bundled into art_ui.js) it
   fills the banner behind the same text. */
function qsBanner(b,d){var art=window.QBART&&QBART["ui_banner_"+b.id+".webp"],wm=brandLogoSrc(b.id);
  return '<section class="qs-hero qs-banner'+(art?' has-art':'')+'" style="--b1:'+b.c[0]+';--b2:'+b.c[1]+';--b3:'+b.c[2]+';--ba:'+b.ac+';--wm:url(\''+wm+'\')">'
    +(art?'<img class="qs-bnart" src="'+art+'" alt=""><i class="qs-bnshade" aria-hidden="true"></i>':'')
    +'<div class="qs-bnin"><span class="qs-bnkick">The '+esc(b.name)+' drop</span>'+brandLogo(b,1)
    +'<i class="qs-bnrule" aria-hidden="true"><b></b><em></em><b></b></i><p>'+esc(b.tag)+'</p></div></section>'}
