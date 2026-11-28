/* Clothing quality tiers (QA's docs/qa-2026-11-10/CLOTHING_TIERS.md, 2026-11-10). Cal: "A white shirt with a flower on it, should
   not be the same price as a sexy dress with diamond encrusted lacings ... higher shops with better quality clothes should be more
   expensive." QA graded every Shop clothing piece from its icon, its line and its brand. 29e_economy.js prices each graded piece
   inside its tier's band (ECON.cloth). A piece added later and not graded here keeps the old rule; grade it by QA's rules in the doc.
   The three eye styles (et_*) are face options, not clothes, so they are left out. */
function clothTier(id){var m=clothTier.m;if(!m){m=clothTier.m={};var put=function(t,s){s.split(" ").forEach(function(k){if(k)m[k]=t})};
  put("standard","tp_tank_f tp_leather tp_varsity tp_blazer_f tp_coat_m tp_trench ac_phones ac_hoops ac_chain ac_cross bk_katana "
    +"bk_cape sh_loafers gx_h_snap gx_h_beret gx_h_news gx_h_hoodie gx_h_cardi gx_h_cargo gx_h_denim gx_h_trous "
    +"gx_h_sneak gx_h_boots gx_h_chain gx_h_coach gx_h_knit gx_h_tech gx_h_pleat gx_h_derby gx_h_loafer gx_y_truck "
    +"gx_y_velcap gx_y_pend gx_y_vjkt gx_y_track gx_y_plat gx_y_mary gx_y_flame gx_y_skate gx_y_runner gx_o_camp "
    +"gx_o_wrap gx_o_lock gx_o_puffer gx_o_flannel gx_o_wind gx_o_crop gx_o_work gx_o_para gx_o_camo gx_o_skirt "
    +"gx_o_hoop gx_o_rigg gx_v_cap gx_v_choke gx_v_shade gx_v_mesh gx_nc_short gx_nc_cap gx_nc_beanie gx_nc_band gx_nc_bucket gx_nc_wafflecap gx_nc_visor "
    +"gx_nc_shades gx_nc_tee gx_nc_tank gx_nc_qzip gx_nc_knit gx_nc_slide gx_al_bucket gx_al_flap gx_al_goggle "
    +"gx_al_fleece gx_al_shell gx_al_vest gx_al_anorak gx_al_cargo gx_al_tight gx_al_short gx_al_hiker gx_kp_bucket "
    +"gx_kp_phones gx_kp_bag gx_kp_pendant gx_kp_sailor gx_kp_hoodie gx_kp_track gx_kp_skirt gx_kp_cargo gx_kp_runner "
    +"gx_kp_loafer gx_sm_beanie gx_sm_phones gx_sm_pendant gx_sm_track gx_sm_cargo gx_sm_nightcargo gx_sm_hightop "
    +"gx_sm_runner gx_sm_boots gx_smk_jacket gx_smk_mesh gx_smk_vest gx_smk_cloak gx_smk_cargo gx_smk_hakama "
    +"gx_smk_shorts gx_smk_tabi gx_smk_runner gx_gp_cathood gx_gp_bunny gx_gp_bow gx_gp_bear gx_gp_star gx_gp_sailor "
    +"gx_gp_skirt gx_gp_shorts gx_gp_overall gx_gp_mary gx_gp_slipper gx_sp_beanie gx_sp_headset gx_sp_cap gx_sp_cart "
    +"gx_sp_hpknit gx_sp_camo gx_sp_track gx_sp_flame gx_sp_runner gx_bb_wizard gx_bb_mantle gx_bb_bracers "
    +"gx_bb_crystal gx_bb_tunic gx_bb_gambeson gx_bb_cloak gx_bb_skirt gx_bb_breeches gx_bb_cuffboot gx_bb_slipper "
    +"gx_bb_hobnail gx_cr_hood gx_cr_shades gx_cr_cargo gx_cr_skirt gx_cr_knee gx_cr_lightup gx_cr_combat gx_km_straw "
    +"gx_km_round gx_km_camp gx_km_rash gx_km_crochet gx_km_board gx_oak_cap gx_oak_watch gx_oak_track gx_oak_polo "
    +"gx_oak_crop gx_oak_vest gx_oak_trackpant gx_oak_skirt gx_oak_suede gx_sv_pom gx_sv_trapper gx_sv_goggles "
    +"gx_sv_ski gx_sv_nordic gx_sv_quilt gx_sv_fleece gx_sv_snow gx_sv_cord gx_sv_puffer gx_sv_apres gx_sv_shearling");
  put("thrift","tp_tee_m tp_cream tp_cardi_f tp_cardi_m pt_cargo pt_skirt pt_shorts pt_jog_f pt_wide sh_white sh_flats sh_boots "
    +"sh_red ac_glasses ac_shades ac_bow ac_flower tp_button pt_jeans bs_tee_white bs_tee_grey bs_tee_black "
    +"bs_hoodie_white bs_hoodie_grey bs_hoodie_black bs_bomber_white bs_bomber_grey bs_bomber_black bs_joggers_white "
    +"bs_joggers_grey bs_joggers_black bs_jeans_white bs_jeans_grey bs_jeans_black bs_shorts_white bs_shorts_grey "
    +"bs_shorts_black bs_sneakers_white bs_sneakers_grey bs_sneakers_black bs_boots_white bs_boots_grey bs_boots_black "
    +"bs_flipflops_white bs_flipflops_grey bs_flipflops_black gx_h_mask gx_h_shades gx_h_high gx_y_bfly gx_y_baby "
    +"gx_y_ring gx_y_flare gx_y_bucket gx_y_choker gx_y_skirt gx_y_jorts gx_o_beanie gx_o_bandana gx_o_gaiter gx_o_tee "
    +"gx_o_shorts gx_o_slides gx_v_rose gx_al_buff gx_al_carab gx_al_henley gx_al_sandal gx_kp_clips gx_kp_slipon "
    +"gx_sm_tee gx_sm_shorts gx_smk_band gx_smk_wrap gx_smk_cowl gx_smk_tape gx_smk_pouch gx_smk_sandal gx_gp_hearts "
    +"gx_sp_shades gx_sp_pad gx_sp_p2 gx_sp_denim gx_sp_flag gx_km_bucket gx_km_visor gx_km_shell gx_km_boat "
    +"gx_km_linen gx_km_cutoff gx_km_slides gx_km_deck gx_km_sandal gx_oak_headband gx_oak_visor gx_oak_wrist "
    +"gx_oak_shorts gx_oak_court gx_oak_tube gx_sv_scarf gx_sv_mitten gx_sv_leggings");
  /* NICE COCK repaint (ROOMS, Cal approved, bcd8f73): the waffle zip (tank), sherpa zip (qzip), suede runner (knit) and shearling
     clogs (slide) are premium (below); the dad cap (band) and lounge tee stay standard: later lists win */
  put("premium","ac_halo bk_wings gx_h_varsity gx_v_lace gx_v_biker gx_v_blazer gx_v_leather gx_v_tulle gx_v_flare gx_v_boot "
    +"gx_v_heel gx_nc_jog_black gx_nc_jog_ash gx_nc_jog_slate gx_nc_pendant gx_nc_hoodie gx_nc_court gx_nc_tank gx_nc_qzip gx_nc_knit gx_nc_slide gx_kp_varsity "
    +"gx_kp_bomber gx_sm_halomask gx_sm_halo gx_sm_hoodie gx_sm_vest gx_gp_wings gx_gp_blazer gx_gp_glitter "
    +"gx_sp_varsity gx_bb_doublet gx_bb_leather gx_cr_visor gx_cr_mohawk gx_cr_arm gx_cr_bomber gx_cr_mesh gx_cr_vest "
    +"gx_cr_platform");
  put("luxury","ac_crown gx_v_thorn gx_v_corset gx_bb_circlet gx_cr_trench");
  /* new240 HANGANG and DIAL-UP (LEAD, 2026-11-17, by QA's rules above, QA to check): faded denim, novelty shades and the plastic phone
     lanyard are thrift; the holo visor (holographic), the leather moto jacket and the patent platforms are premium; the rest standard */
  put("standard","gx_h_pbucket gx_h_bala gx_h_longbill gx_h_sling gx_h_phones gx_h_padcoat gx_h_layer gx_h_rugby gx_h_balloon gx_h_wrap "
    +"gx_h_mule gx_h_puffboot gx_h_court gx_y_race gx_y_furtrap gx_y_chains gx_y_mesh gx_y_furden gx_y_patch gx_y_pcamo gx_y_maxi gx_y_bubble "
    +"gx_y_furmule");
  put("thrift","gx_h_oval gx_h_barrel gx_y_rimless gx_y_phone");
  put("premium","gx_y_visor gx_y_moto gx_y_patent");
  /* new240 OVERPASS (LEAD, 2026-11-17): the durag, tool lanyard and plain shades are small extras, the faded jorts and knit slip-ons
     thrift like their kin; the moc-toe boots stay standard like HANGANG's leather derby; the rest standard */
  put("thrift","gx_o_durag gx_o_tool gx_o_rect gx_o_cshort gx_o_slipon");
  put("standard","gx_o_5panel gx_o_reflect gx_o_tags gx_o_bridge gx_o_liner gx_o_thermal gx_o_dknee gx_o_snap gx_o_suede gx_o_moc");
  /* new240 VENOM ROSE sexy set (LEAD, 2026-11-17, by QA's rules; QA to check): velvet, silk, patent and leather pieces premium like the
     brand's others; the lace mask premium like the Lace Headband; the crystal body chain (jewellery set with stones), the corset bodysuit
     (lace corsetry) and the lace slip dress (Cal's "sexy dress" example) luxury; the bunny ears, the pipe and the fishnets standard */
  put("standard","gx_v_bunny gx_v_pipe gx_v_fishnet");
  put("premium","gx_v_veil gx_v_captain gx_v_mask gx_v_robe gx_v_pajama gx_v_mini gx_v_stiletto gx_v_thigh gx_v_slipper");
  put("luxury","gx_v_bodychain gx_v_bodysuit gx_v_slip");
  /* Cal 11-18 replacements (LEAD, by QA's rules; QA to check): VENOM ROSE's horns, silk shirt, vinyl, keyhole crop premium,
     the lace bralette luxury (lace lingerie, like the corset); OVERPASS's wrist guards and respirator standard; SAYMØRE's grille bomber
     premium (its statement piece) */
  put("premium","gx_v_horns gx_v_sandal gx_v_silkshirt gx_v_vinyl gx_v_hotpants gx_v_crop gx_sm_grille");
  put("luxury","gx_v_bralette");
  put("standard","gx_o_guards gx_o_resp");
  /* GILDED (LEAD, 2026-11-18, by QA's rules; QA to check): sculpted gold, jewels and boning luxury (the leaf crown, the sapphire cuffs,
     the brocade bustier, the gold-woven bomber and frock coat, the gold-capped high-tops, the sculpted-heel mules); the rest premium */
  put("luxury","gx_gd_wreath gx_gd_cuffs gx_gd_bustier gx_gd_bomber gx_gd_frock gx_gd_hightop gx_gd_mule");
  put("premium","gx_gd_cap gx_gd_beret gx_gd_scarf gx_gd_shirt gx_gd_jogger gx_gd_cargo gx_gd_skirt gx_gd_loafer");
  /* OIL & CANVAS (LEAD, 2026-11-18, by QA's rules; QA to check): the hand-painted and pieced work luxury (the dipped felt hat with its brush,
     the painted denim jacket, the patchwork coat, the drip smock and halter, the gesso boots, the slingbacks on tiptoe); the rest premium */
  put("luxury","gx_oc_felt gx_oc_denim gx_oc_coat gx_oc_smock gx_oc_halter gx_oc_boot gx_oc_sling");
  put("premium","gx_oc_cap gx_oc_roll gx_oc_palette gx_oc_gloves gx_oc_trouser gx_oc_jean gx_oc_skirt gx_oc_derby");
  put("standard","gx_o_round gx_o_slit gx_o_goggle gx_o_spray gx_o_cuban gx_o_carabiner gx_o_snood gx_o_dogtag2");/* over to 8 a category (ROOMS 11-28), like its Shield Shades */
  put("premium","gx_oc_round gx_oc_shield gx_oc_square gx_oc_tint gx_oc_cat gx_oc_goggle gx_oc_dots gx_oc_smear gx_oc_chain gx_oc_bandana gx_oc_tube gx_oc_cord gx_oc_lanyard gx_oc_ring gx_oc_scarf gx_oc_beanie gx_oc_pearl gx_oc_newsboy gx_oc_bucket gx_oc_five gx_oc_trapper gx_oc_visor gx_oc_cord6 gx_oc_hightop gx_oc_skate gx_oc_platform gx_oc_slide gx_oc_mule");
  put("luxury","gx_oc_hoodie gx_oc_chore gx_oc_workboot gx_oc_vest");
  put("premium","gx_oc_tee gx_oc_crop gx_oc_short gx_oc_carpenter gx_oc_cargo gx_oc_jogger gx_oc_mini gx_oc_fingerless gx_oc_leather gx_oc_workglove gx_oc_cuff gx_oc_bangle gx_oc_watch gx_oc_wrap");/* simpler cuts than oc's jackets *//* like oc's other tops *//* oc to 8 a category (ROOMS 11-28) */
  /* REGIMENT (LEAD, 2026-11-18, by QA's rules; QA to check): brass, braid and frogging luxury (the corded peaked cap, the aiguillette, the
     frogged jacket, the capelet tunic, the mess jacket, the tall riding boots, the stiletto boots); the rest premium */
  put("luxury","gx_rg_cap gx_rg_cord gx_rg_jacket gx_rg_capelet gx_rg_mess gx_rg_boot gx_rg_stiletto");
  put("premium","gx_rg_side gx_rg_sash gx_rg_gloves gx_rg_vest gx_rg_breeches gx_rg_trouser gx_rg_skirt gx_rg_spat");
  /* Smoke Bomb to 6 a category (ROOMS, QA c414f017; LEAD 11-26): standard like the brand's first pieces; the steel and the respirator premium */
  put("standard","gx_smk_hoodcap gx_smk_visorbeanie gx_smk_tails gx_smk_goggles gx_smk_scoutlens gx_smk_ventmask gx_smk_trailscarf gx_smk_kunai gx_smk_grips gx_smk_handwraps gx_smk_hoodie gx_smk_wrapjacket gx_smk_harness gx_smk_bomber");
  put("premium","gx_smk_platehood gx_smk_slitvisor gx_smk_resp gx_smk_bracers");
  put("standard","gx_smk_ashwrap gx_smk_embercuffs gx_smk_watch gx_smk_joggers");
  put("premium","gx_smk_platecollar gx_smk_gauntlets");
  put("standard","gx_smk_gaiter gx_nc_ovals gx_nc_shield gx_nc_rope gx_nc_snood gx_nc_clear gx_nc_catshades gx_nc_visorshade gx_nc_towel gx_nc_neckerchief gx_nc_tagchain gx_nc_knitmask gx_nc_fleecetrapper gx_nc_ribcap gx_nc_chainspecs gx_nc_pearls gx_nc_lariat");
  put("standard","gx_smk_tacpants gx_smk_wrappants gx_smk_strapsneaker gx_smk_wrapboots");
  put("premium","gx_smk_embersole");
  put("thrift","gx_y_shield gx_y_heart gx_y_starglass gx_y_tinted gx_y_goggle gx_y_glitter gx_y_beads gx_y_tattoo");
  put("standard","gx_y_disc gx_y_pearlstar gx_y_fur gx_y_bandana gx_y_clipz gx_y_velour gx_y_jersey gx_y_cargo gx_y_tube gx_y_mini gx_y_puffboot gx_y_flips");/* like DIAL-UP's pendant and chains *//* DIAL-UP 8 a category (ROOMS 11-27), like its other glasses */
  put("premium","gx_nc_cardigan gx_nc_waffle gx_nc_loafer gx_nc_puffer gx_nc_cargo gx_nc_socksneaker gx_nc_bralette gx_nc_robe gx_nc_satinshort gx_nc_chukka gx_nc_mules gx_nc_platform gx_nc_flares");/* like nc's joggers, hoodie, zips and clogs */
  }return m[id]||null}
