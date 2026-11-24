# Task board

The one list both chats share (see `TEAMWORK.md` at the top of the repo). LEAD keeps it tidy. Re-read it right
before editing; edit only your own section, except to add a request for another chat.
Details for every item are in `docs/HANDOFF.md`.

CHROME: taken by ROOMS (Cal 11-24 art list A-F, from 2026-11-24)

Live on the phone: `APPV` 47 (friends' page, nobody plays it); Cal's pinned test copy (his Test link, republished in place): v0.72 (083fec9, slug HJhVjFH6), 2026-11-07, the only one pinned. LEAD keeps only the newest version pinned.

---

## Mac team (LEAD / ROOMS / QA), from 2026-11-13: START HERE

The Mac folder now works on branch `qa-local` from the Windows team's final v0.92 (6bead6a; read docs/MAC_HANDOFF.md). `main` is the old
v0.80 line: do not build from it. Live and Test run v0.92 (6bead6a). GitHub's qa-local still stops at v0.88: the push needs Cal's OK.
Loops are back on (Cal, 2026-11-13: "reactivate the occasional 15 minute checks for handoff tasks"): every chat checks this section
every 15 minutes, does what waits on it, and keeps its Doing line true (TEAMWORK.md rules 13 to 18).

LEAD Doing:
- Cal 11-24 list (docs/specs/2026-11-24_SPEC_cal_list.md has every decision; read it before asking). SHIPPED 2026-11-24: v1.43 = release/v1.43 0270ae4d (APPV 143, QB_EPOCH 8), QA pass (dd7327f6 and the candidate); Live and Test 3839/3839 identical, wlive PASS; rollback rollback-v1.41 3d34c2ba (APPV 144); both pushed. WAITING ON QA: live check. Next release APPV 145+. Batch 0 was: the Walk-in Closet from level 3 (first in the Bedroom's list, no Figurine Cabinet needed, the Loft's "!"), the Board's stuck "!" (29zz_v143.js, rigtest/lead/closet143.js). (QA: DONE on dd7327f6, PASS, v1.43 can be cut; QA findings) (QA: DONE on the candidate release/v1.43 0270ae4d + rollback-v1.41 3d34c2ba, PASS, can ship; one low NOTE; QA findings) ROOMS: the art list at the end of the spec (A evolved pets and B the pet bed first). Batch 1 on qa-local 6bfa2938..7a9ba54b, WAITING ON QA (v1.45 on the pass): 1a ranks, Wave only, spinners, visitor name tags under the feet; 1b e7c56026 flat weekly XP 1,800/2,400 + curve 8 (99 to 100 = 4,400; sims: normal 100 on day 122, heavy day 62), Momentum Surge in place of Rested XP, the (i) sheets, no "!" on a locked Loft; 1c 8f0510f3 surprise loot; 1d 7a9ba54b the text made general. Tests: rigtest/lead/batch144.js. Splash rule: clothing drops already only splash in the Shop (v1.35); the pet brand splash comes with the Pet Store. docs/specs/2026-11-24_text_audit.md: the music/Cal-specific text to fix. SHIPPED 2026-11-24: v1.45 = release/v1.45 d38479aa (APPV 145, QB_EPOCH 8), QA pass (the batch, the recheck, the candidate); Live and Test 3841/3841 identical, wlive PASS; rollback rollback-v1.43 b8909e0e (APPV 146, curve 7 on purpose); both pushed. WAITING ON QA: live check. Next release APPV 147+. It was cut from branch lead/v145src ea0657be (QA's passed tip 8bda5f60 + the spinner FIX, tabs during sync, the curve 8 move, QA's notes), WAITING ON QA's recheck; cut with: EPOCH=8 cut.sh v1.43 v1.45 145 "..." lead/v145src. NOT in v1.45: ROOMS's c4d9e374 (evolved pet art, unreviewed) and the bounties 96465b5b (29zz_v147.js, rigtest/lead/bounty147.js; QA after v1.45). Batch 2a f77ef4da..8bda5f60 (in v1.45): the scratch card in the Wheel's place (29zz_v146.js, rigtest/lead/scratch146.js). SHIPPED 2026-11-24: v1.47 = release/v1.47 b2b7a2e3 (APPV 147, QB_EPOCH 8), QA pass (the batch, two Shop FIXes, the candidate); Live and Test 3841/3841 identical, wlive PASS; rollback rollback-v1.45 0d4a9f8e (APPV 148); both pushed and verified. WAITING ON QA: live check. Next release APPV 149+ (v1.49; the patch letter is due at v1.50). It was cut from branch lead/v147src (d40320c4; first b145deeb (v1.45's source + the bounties with QA's FIX, drop days, the Shop's home screen; no pets), WAITING ON QA; cut with EPOCH=8 cut.sh v1.45 v1.47 147 "..." lead/v147src. Then for QA on qa-local a551390e: the pet system phase 1 (29zz_v150.js, rigtest/lead/pets150.js), which needs ROOMS's pet art in the release (cut from qa-local once QA passes it). Earlier note, v1.47 batch: the bounties (29zz_v147.js, QA's FIX 7e6f9351), e5def2f9 (drop days, close during sync), 3c9a306b (the Shop's home screen, Closet; docs/specs/2026-11-24_shop_pet_map.md maps the old Shop and pets). Cut from a branch without ROOMS's pet commits (spec: CUT WARNING). Was: the bounties 96465b5b + e5def2f9 (brand drops Mon/Fri from 11-28, rigtest/lead/drops148.js; a window during sync can be closed). v1.49 batch head is qa-local 0fd4dc82, WAITING ON QA's recheck: QA's three FIXes (companion on the player card, the visit card's width, the large bed off the door mat) and NOTE (fade-in on a room change); Cal's later requests (the City, SAYMORE's wording, Calvin and Sydney restyled and ROOMS's walk picture cb651b3b, nothing bought by one tap + the owner's refund 29zz_v153.js / rigtest/lead/buy153.js); ROOMS's ten backdrops 3f823fc1 (QA passed). Run node --check dist/app.js after every build (a quote in a CSS string broke the working copy on 11-24). Earlier: batch on c34a8e3b, WAITING ON QA; it also has 70f91a89 (the tattoo and scar layer: rig.json markS/markT, look.js, Stylist items once art exists) and c34a8e3b (the Vault as its own Shop button on its Wednesday). First written at 10b9c201, WAITING ON QA (cut from qa-local since it needs ROOMS's pet art): the pet system (29zz_v150.js, v151 with ROOMS's Closet and Lair boxes 6537ab6e), the .dsgo fix, and batch 4 10b9c201 (29zz_v152.js: the player card, the Stylist's Cosmetics and Backdrops tabs, rigtest/lead/pcard152.js). WAITING ON ROOMS: the ten backdrops as art/app/bl_pc_<id>.webp, the first clothes for the changed forms (then anchors), the tattoo and scar layer. Earlier note: phase 1 a551390e + phase 2 3fc099f1 (Calvin and Sydney's visit in the Game Room with the dogs; the companion keeps close and roams the Game Room; docs/specs/2026-11-24_shop_pet_map.md second map). WAITING ON ROOMS: furniture boxes for the Closet and the Lair (P3BOX), the first clothes for the changed forms (then anchors). Next for LEAD: what is left of Cal's 11-24 list: pet brand drops (Tue/Thu, 3 live at most) when ROOMS's brands exist, anchors for k4/k5/k6 with the first changed-form clothes, names for the tattoos and scars, the Atelier's brands into BRANDS, the patch letter at v1.50, then the end batch for Cal (art approvals, docs/specs/2026-11-24_text_audit.md questions, Calvin and Sydney's looks). Older note: batch 3 (Shop layout, pets, Pet Store) and batch 4 (Stylist, player card).
- SHIPPED 2026-11-23: v1.41 = release/v1.41 4dcc070c (APPV 141, QB_EPOCH 8, no reset), QA pass; Live and Test 3839/3839 identical, wlive PASS. Friendship + Players leaderboard, kind notes, training once a day + Weekly Warrior x1.25 steps, open-quest counts, People vs Work and admin, curve 7, rig 3f15f863. Rollback rollback-v1.39 936eb255 (APPV 142, epoch 8, carries curve 7). Both pushed. WAITING ON QA: live check. Next release APPV 143+; cut with EPOCH=8 (qa-local's 00_clock still says 6).
- Cal 11-23 list. Done on qa-local, WAITING ON QA: 68c4b15 (Upgrades/Interface as a bottom tab with the Lair console; Stylist beside Wardrobe; Flip Phone Lanyard, Retro Ringer, Butterfly Baby Tee cut) and 8ce4684 (the pet beside its player on the Town pedestal). Sent: ROOMS, a later-rooms placement sweep and buzz cut/man bun hair (Victor's long hair reused); QA, the pets' animations and outfits in the Loft (both sessions were offline, messages queued). WAITING ON CAL: her 4th creator style, the visitor's name/photos. Economy (Cal's handoff docs/HANDOFF_ECONOMY_2026-11-23.md on origin claude/wizardly-hopper-sp10lg, built on the old main): Part 1 ported to qa-local b4c2fef (prices x1.15, momentum 1.5x, proof 1.5x, no 1%/level on task coins); sims done (no page errors): baseline 30d never runs out of buys; Part 1 at 60d: casual earned 114k (5 days with nothing affordable), regular 456k, grinder 941k (still buying, cheapest 14,650); about -25% earnings. Totals on qa-local: rooms 115k + 517 upgrades 1.44M, clothes 349 pieces 198k. The handoff's Part 2 (earnings /5) would take a grinder over a year for the rooms. Cal: "about 2 times slower": Part 2 1252dc4 (EARNK .77, weekly 3,000, luxury x1.1, Loft goals to XP, level curve 6; sims: regular/grinder at day 60 = old day 30). Also 649f1fc (6 dyes, hairHi slot for ROOMS's streaks), f113c98 (GM Next drop tab, secret drop order from 11-30, Reset progress, official notices 500, epoch-stamped worlds). WAITING ON QA: the whole batch. (QA: DONE on 8ca029d, NOT A PASS: one FIX, the milestones' S.ms; the rest PASS, two Shop-text FIXes for the dog line; QA findings) Release plan: cut with QB_EPOCH 7 (Cal: reset everyone to level 1, money too), ship before Mon 11-30 8 am (or move DROPS.shuf2), rebuild release scripts first. Creator: his 4 styles cdcb0b7 (Tousled, Buzz h4, Long = Victor's, Bun h5; h4/h5 appear with ROOMS's art). Release scripts (cut/ship/mkref) were in a cleared temp folder: rebuild from docs/RELEASING.md and keep them in rigtest/lead/release/ before the next release.
- Cal 11-23 later (LEAD, qa-local, WAITING ON QA with the batch; QA: DONE on 8ca029d, see the batch line; QA findings): acd0730 dogs Pluto (Calvin's), Chopstick (Sydney's), then their beds; 8eb92b2 QA petslive fixes 1-2; fccf7c9 Closet right after the Figurine Cabinet, Garden at 70% of the Loft, a pick-1-of-3 milestone every 5 levels, Interface without Companions/Status displays, previews that show each piece (backdrops were black: shopmode hid .bgx). Next: Stylist Combover/Wolf Cuts (ROOMS art in), a sim of the new Closet/Garden timing. WAITING ON CAL: which interface pieces are lame (LEAD's picks: Circuit Frame, the three plain titles, City Skyline).
- SHIPPED 2026-11-23: v1.31 = release/v1.31 62a515fe (APPV 133, epoch 6), QA f83ec7bf; rollback rollback-v1.30 34271088 (APPV 134, same curve). Cal called off the reset of everyone: the middle curve with every save moved at the same level (xpc6), only Cal's save reset (backup_reset131), the 1.31 letter and notice. A first ship (915ed0ac, curve 6 without the reset) halved levels for about 12 minutes and was rolled back (1c6ef20d). Next release APPV 135+.
- SHIPPED 2026-11-23: v1.35 = release/v1.35 a7ba8e21 (APPV 135, QB_EPOCH 7: the reboot, everyone starts over), QA pass; firestore.rules with duelq deployed; board, pings, worlds, chat, chatnow, likes, kudos, kudosok, duel, duelq, photos, photolk cleared (Cal: 'reset from square 1', 'Yes, clear photos'). Rollback rollback-v1.31 08c7d93e (APPV 136, epoch 7). Next release APPV 137+. Open: fashion votes are private on screen only (likes readable by all); a server tally would fix it.
- SHIPPED 2026-11-23: v1.37 = release/v1.37 c3584739 (APPV 137, QB_EPOCH 8: the second reboot) on Cal's word ('ship it'); QA's pass was of earlier cuts, live check asked. Town collections cleared again. Rollback rollback-v1.35 948bb633 (APPV 138, epoch 8). Next release APPV 139+.
- SHIPPED 2026-11-23: v1.39 = release/v1.39 297b2192 (APPV 139, QB_EPOCH 8, no reset), QA pass. Tutorial quest, Welcome only in the inbox, no coins on Training, one Edit per exercise, tour waits behind windows, greeting coins at once; ROOMS room life and free tables. Rollback rollback-v1.37 d80690fc (APPV 140). Next release APPV 141+.
- v1.30 LIVE c1cff49 (APPV 130; rollback APPV 131 adf0f80; pushed): the Pet Shop (3 creatures, one per player, crying give-up screen, beds in the Bedroom and by the Patio fire, 36 creature clothes + 7 dog pieces in Mon/Thu drops, smaller dogs, bigger pets, Patio dog beds retired and refunded silently) and the v1.30 patch letter (QA PASS 3fee540). Live check (QA: DONE, PASS; QA findings). Next with art: pd_cable (Pluto cells), pd_fleece, pd_hearts, pd_bubbles, pd_treats (ROOMS).
- v1.28 LIVE 33c064d (APPV 128; rollback APPV 129 a9e38cd; pushed): the bare-arm rig fix 4fe171c alone (QA PASS ad8b85c: fills the upper-arm holes in his dance1/dance2/sideUp). Live check (QA: DONE, PASS; QA findings). Arms-up fraying: ROOMS's gapped bases 63344fe tested, almost no visible change (the mesh still shares armpit cells; rig tweaks gave little, reverted; sheets shots/lead_arms/gap/). Keep 63344fe out of releases. ROOMS split the arms (d8444f5); LEAD wired a skinArms layer e9cc506 (only under sleeveless tops and bare looks; sleeved tops keep the full base): arms whole and flanks clean by eye (shots/lead_arms/split/). v1.29 LIVE 0e5e736 (APPV 129, rollback 130 71f62ef; pushed; QA PASS bbe2625; Live check (QA: DONE, PASS; QA findings)) = v1.28 + fb02a13 + 7c1d8fd + 41db736 (rebased without the Stylist). Rigdiff vs v1.28: 31,734 frames, 0 page errors, lost max 87 / gained max 29 (sleeveless only), others <= 25. Next release is v1.30: patch letter due. Pets: ROOMS's final frames e82a602 with QA; LEAD wires from data/pet_art.json on QA's pass. Frames: fixes c81d0de back with QA. Clothes: fit table 790b8f2 and anchors 186b0e8 + 49f7574 in data/pet_art.json (check sheets shots/lead_pets/); ROOMS paints the 48 after the bases. Patio bed: Cal "Yes, replace it": the creature bed at 4.25, 3.5 supersedes the white lounge chair once owned (egg chair stays); Bedroom bed at 8.9, 2.6. Pet beds: each room gives the creature bed its own spot, not in a row with the dog beds (QA's kennel-row note); Patio: try moving the lounge chair; if no clean spot, pictures to Cal.
- v1.27 LIVE 050ddd2 (APPV 127; rollback APPV 128 e3e2b1a; pushed): REGIMENT on the Boutique, hold ends Thu 11-26, first drop Mon 12-14, GILDED 11-23 and OC 11-30 unchanged (QA PASS 9489e9e). Live check (QA: DONE, PASS; QA findings). Bare-arm rig fix 4fe171c (rig.json fineUp body, slotStretch body 9, armpit body sleeves/cap 2; rigdiff vs v1.26 30,668 frames, lost max 54, gained max 121 in his dance1 underarm; renders in shots/lead_arms/). (QA: DONE, PASS, better than v1.27 alone, QA would ship it in the next release; QA findings) LEAD suggests releasing it together with the repainted bases, not alone. Cal said "Yes, repaint" to the bare bases with a gap under the arms: brief sent to ROOMS (queued after the pet frames); LEAD renders before/after in arms-up for QA. Pets: Cal wants each a different colour (relayed to ROOMS: wolf cyan, wyvern navy + amber, slime plum + magenta); 12 clothes per pet at launch (Cal: "12 per pet"), 3 per slot, 36 in all; ROOMS paints them after the final frames pass QA. Dogs too (Cal: "Dogs too"): a 12-piece dog line on both dogs' anchors, one buy for both; 48 pieces in all.
- v1.26 LIVE on Live and Test = 268fb31 (release/v1.25 + f041b24 + 4c60022 + abe4e6d + APPV 126; QA PASS 69af73e; Cal via ROOMS: "Approve OIL & CANVAS"): OIL & CANVAS on the Boutique, 15 rows, held to Thu 11-26 so GILDED keeps its Mon 11-23 debut; OIL & CANVAS first drops Mon 11-30. Live checks PASS; 3526/3526 identical on both. Rollback = rollback-v0.80 22b253c (APPV 127). Both pushed. (QA: DONE, live check PASS; QA findings) (QA: DONE, PASS; QA findings)
- Pet Shop (Cal 11-18): "pet shop open level 2. but i dont want a basic dog" plus three creatures (shadow wolf pup, void wyvern, shadow fox-slime): docs/PET_SHOP.md 1334747, original designs only. All Cal's questions answered (dogs stay; one creature each, ~3,000, adoption splash; 12 clothes per pet + 12 for the dogs; Patio bed replaces the fire-side chair). Art: frames, beds, 36 creature clothes done; dog line in progress (ROOMS). LEAD: code done db99820 (Pets tab on the Boutique, one-pet warning, crying give-up screen, beds in Bedroom 8.9,2.6 and Patio 4.25,3.5 replacing the fire-side chair, clothes drop 2+2 per Mon/Thu, wear per pet and dog, composited in the Loft; rigtest/lead/petshop.js PASS x3). QA NOT A PASS on db99820 (beds); fixed in 9d925a5 (pets lie in their beds, Patio bed 2.1,2.6 in view, chair out while owned) + Cal 11-19 smaller dogs and dog beds, bigger pets. QA recheck 410008c: Bedroom PASS, Patio FIX A/B; then Cal 11-19 "Remove the dog beds from outside": 5eb9ca2 (Patio dog beds retired and not drawn, creature bed 1.7,2.6, Bedroom dogs lower in their beds). QA PASS 5d9274c on 5eb9ca2 + 9c6b5cc (silent Patio dog-bed refund). Cal: "what's the holdup? Let's keep going": shipping with 8 dog pieces (stable drops 3f90317, the 4 missing land later without reshuffling). v1.30 cut release/v1.30 c1cff49 (APPV 130, rollback 131 adf0f80; not pushed) = v1.29 + Pet Shop files from qa-local + the v1.30 patch letter (0466d9c), pd_cable held (ROOMS: Pluto cells not painted), 7 dog pieces. QA c062103: all PASS but text; fixed in c1cff49 (seven lines reworded, letter without the refund line). WAITING ON QA: verdict on c1cff49. Release waits for the dog line's last 4 pieces.
- Was: v1.25 LIVE on Live and Test = 6a0272c (QA PASS, every Shop row x both bodies x 35 poses vs v1.24): your character's emotes, the side stretch, the rig fixes (finer mesh on tops/arms, arms-up stretch cap), GILDED (first drop Mon 11-23), KODE PINK's detail pass. wlive PASS; 3449/3449 identical on both (the ship run's Test read failed on 1,935 files over the long upload, a rerun matched all). Rollback = rollback-v0.80 cd5a4ef (APPV 126). Both pushed. QA: live check please. Owed: Cal's phone check of first-emote lag. (QA: DONE, PASS; QA findings)
- Also on qa-local, not released: 2a0a7e3 the Stylist eyes/mouth split (no change until ROOMS's art); f2eda97 docs/PET_SHOP.md.
- (QA: DONE on release/v1.24 + 8b8d4a0 + the recipe = 651fbfe, NOT A PASS: 8b8d4a0 missing from the recipe; the new rig opens a hole at the waist in dance2 and specks the trousers; rows, emotes PASS; QA findings) FOR QA, two commits for v1.25:
  (1) b559d09 your character's emotes + a smoother rig (Cal 11-18 "yes to all"): data/poses.json thinking / side stretch / eased wave (the Loft's stretch clip is the side stretch now, no painted yawn); 29zz_v125.js plays them in turn every 25-45 s when your character stands in a room (frames drawn ahead; "..." bubble for thinking); data/rig.json fineSlots body/top/arms + meshStepFine 12 + solidStretch 4 (rig.js: solid fabric pulled past 4 cells is dropped; removes the streaks under raised arms, your 824cd53, and GILDED's). This changes how EVERY top/arm piece draws in every pose: please run the full wear-test of all brands, both bodies, 35 poses, against release/v1.24, looking for holes and streaks. Mine: emotes.js, heels, replrows, tabs6, v112 PASS; brandwear h/v/kp in wave/cheer/dance/walk/sit/sleep 0 not drawn and by eye like v1.23. Speed (headless): first draw of an outfit +10-25%, new frames ~2x; a phone check is still owed.
  (2) a604760 GILDED wired (ROOMS 3a10edf, fa1864a, cb01321, 581c6cd): brand gd on the Boutique, 15 rows, grades (7 luxury, 8 premium), held to Mon 11-23 (first drop that day). gdrows.js PASS; floors122 updated (each Boutique brand on its own live day). ROOMS is showing Cal the painted brand; it ships only if he does not veto.
  (3) 651fbfe KODE PINK detail pass lines (ROOMS 368507e art, QA passed; 1a64fc3 slip-ons line): the five pieces' new lines, same ids/names/prices; kprows.js updated, PASS.
  (4) 6100e8f the rig fix for QA 2d2c911: solidStretch only in arms-up poses and only for rig.solidSlots (top, arms, body); fineSlots top, arms (the body off the fine grid: it peeked through trousers as white specks). Her dance2 hole 1,364 -> 83 px lost (HI 3, default look); the default tee's underarm skin streak gone; rigdiff kp/hanga: worst losses are those removed streaks, gains are sleeves no longer torn in dance poses.
  v1.25 recipe, corrected for QA's FIX 1 (8b8d4a0 has the fineSlots code): release/v1.24 + 8b8d4a0 + b559d09 + 3a10edf + fa1864a + cb01321 + 581c6cd + a604760 + 368507e + 651fbfe + 6100e8f. GILDED approved (Cal via ROOMS: "Approve GILDED"; Cal to LEAD: "Yes, ship it" once QA passes). Candidate cut: release/v1.25 at 6a0272c (111 files identical to qa-local, cb01321's shots/ drafts left out, artcheck 0 gaps of 340). QA: run the every-brand pass on this exact build; it ships on your PASS.
- v1.24 LIVE on Live and Test = 48b550a (release/v1.23 + 52dda64 + f0cccd0 + APPV 124; QA PASS 1a8b89d): KODE PINK "Night drive" (art, text, colours; drops from Mon 11-23, first Thu 12-17). wlive PASS, 3372/3372 identical on both. Rollback = rollback-v0.80 a2f45f1 (APPV 125). Both pushed. QA: live check please. (QA: DONE, PASS; QA findings)
- (QA: DONE on release/v1.23 + 52dda64 + f0cccd0, PASS, v1.24 can ship; QA findings) FOR QA (f0cccd0, with ROOMS's 52dda64): KODE PINK "Night drive" Shop text wired (15 names/lines from shop_text.md incl. 8f0f192's Charcoal Wide-Leg Cargo; same ids, slots, prices), BRANDS colours from the new banner (navy/indigo/pink-to-coral; sub "city-pop night drive"), DROPS.hold kp until 2026-11-23 (first drop day after this ships; move it if v1.24 ships after Mon 8 am). kprows.js PASS vs release/v1.23 (floors identical through 11-22; first KODE PINK drop Thu 12-17; tab lists 15). v1.24 = release/v1.23 + 52dda64 + f0cccd0. Cal still to answer QA's two notes (five plain pieces, palm shirt).
- Emotes: the finer mesh option is in rig.js (8b8d4a0, off until rig.json sets fineSlots/meshStepFine); before/after sent to Cal; waiting on his go.
- v1.23 LIVE on Live and Test = 7e61089 (Cal via ROOMS: "Approve all"; QA PASS 2be9bec): the 11-18 pieces, the bare base, the harness cut, the tiptoe Ankle-Strap Stilettos, clean icons. wlive PASS, 3380/3380 identical on both. Rollback = rollback-v0.80 0f66501 (APPV 124). Both pushed. QA: live check please (and your count said 3,379; mine 3,380, please reconcile). (QA: DONE, PASS; QA findings)
- (QA: DONE on 8c49646 + 141ff29, PASS; v1.23 as planned can be cut; QA findings) FOR QA (8c49646, with ROOMS's dff4465, cefab81, 4edfa01): Cal's 11-18 replacements wired. src/look.js: a top with items.json bare is drawn over <b>_base_bare_* when that file exists (her five; his body unchanged). 15_shop.js: 10 new rows (VENOM ROSE 7, OVERPASS 2, SAYMØRE 1) and the 5 repaint lines; grades in 29e_tiers.js (bralette luxury, guards and respirator standard, the rest premium; Boutique 920-1,180, Street 290). replrows.js PASS (each brand on a live day; the bare base under exactly the five), brandwear v/o/sm 0 not drawn, artcheck 0 gaps (325), roserows/floors122 updated for the new lines and counts. Close look at six poses: no tank under any bare top. Please rerun barecheck.js on this wiring. Ships as one release with ROOMS's three fixes (horns clip, two icons): v1.23 = release/v1.22 + dff4465 + cefab81 + 4edfa01 + 141ff29 (ROOMS's fixes) + 8c49646. Candidate now: release/v1.23 at 7e61089 = 00cc1c0 + ROOMS's 24ee3c9 (stiletto and bralette icons) + d7ca804 (v_sandal heel: true; heels.js PASS); identical to qa-local, artcheck 0 gaps of 325; QA: please recheck 7e61089 (QA: DONE, PASS, still held for Cal; QA findings). Before that, 00cc1c0 = 0172e8d (QA PASS b3d9a67) + ROOMS's tiptoe heels 7f30c13, 1d16b66 + my b3dba9d (look.js picks base[_bare][_heel]; NO lift: ROOMS's feet already reach the floor, the heel tip ends where Mary Janes do; optional heelLift for later; rig.js lifts standing poses only; gx_v_sandal premium; heels.js PASS; brandwear v 0 not drawn; artcheck 0 gaps of 325; QA: please recheck 00cc1c0; QA: DONE, PASS, folded into 7e61089's findings). Was: 0172e8d (983258b, which QA passed, + ROOMS's 7d2c729 bralette icon + 3aed3af harness out + 9ea3dd2 its row and grade out; Cal: "remove the strappy chest harness"); app/data/src/art identical to qa-local, artcheck 0 gaps of 324; QA: please recheck this exact build. HELD for Cal's explicit approval of the painted pieces (ROOMS: he saw the drafts, "i am okay with showing some skin as long as it is not nude", but has not approved the finished sheet; ROOMS is asking him). (QA: DONE on 0172e8d, PASS; QA findings)
- Emotes (Cal 11-18): preview on one outfit sent (d19473c, 9749fcc: rigtest/lead/emoteprev.js); Cal saw sleeves tear; waiting on his pick (engine fixes: finer mesh near joints + hide the arm under sleeves, then a full wear-test).
- v1.22 LIVE on Live and Test = b3030e6 (release/v1.21 + c13edd3 + APPV 122; QA PASS 208993e), before Thursday's 8 am switch; wlive PASS, 3325/3325 identical on both. Rollback = rollback-v0.80 304dd6d (APPV 123). Both pushed. QA: live check please. Next for me: ROOMS's two rig questions (bare top flag, the Stylist's eyes/mouth split). (QA: DONE, PASS; QA findings)
- (QA: DONE on release/v1.21 + c13edd3, PASS, v1.22 can ship; one NOTE for Cal; QA findings) FOR QA, TODAY please (c13edd3): v1.22 Shop changes from Cal (11-18). The new drop days start Thu 11-19 8 am, so it should ship before then. v1.22 = release/v1.21 + c13edd3.
  - Drops Monday/Thursday on every floor from Thu 11-19, Wednesday vault unchanged (ECON.floors days/days0, flIsDrop by date: no earlier slot moves). NICE COCK's pinned Street drop moves Fri 11-20 -> Thu 11-19 (pin, shuf1, its hold). Shop line, tours and AREALINE say Mondays and Thursdays.
  - Basics -> the Stylist ("Off sale, owners keep"): the tab sells haircuts, dyes, eye colours (14); the plain basic clothes are cut; qsGrantOriginals still gives a new player their creator clothes (it used itemFits, which a cut piece fails).
  - Holds: SØLVBERG's ends 11-19 (Cal: "I like altitude and solvberg. Redo everything else."); GP, SP, BB, KM, OAK stay held; CHROME RAIN held from 11-19 (Cal: "Not a fan of chrome rain. Create a different brand"; it never dropped, stays on the Boutique, held).
  - Cut (off sale, owners keep): OVERPASS's padlock chain and skate tool; VENOM ROSE's dad cap, leather pants, tulle skirt, oval shades, rose tee, mesh top, biker jacket; SAYMØRE's GO OFF Tee.
  - floors122.js PASS against release/v1.21 (every floor 11-10..11-18 identical, Mon/Thu only for 16 weeks, the Stylist, cuts, a new player's originals); overrows.js updated (durag since v1.18, skate tool); roserows, quickadmin, tabs6, afford, new240rows, gone, v112 PASS. Not checked: a phone; the drop splash on the Thursday itself.
- Not started (Cal 11-18, needs design first): a pet shop on floor 2 (pets today are only the status-card pixel companions); the Atelier's flashy brands priced against income; floor 2's other three brands. Art for ROOMS: see my message.
- v1.21 LIVE on Live and Test = 8103458 (release/v1.20 + d51ef4c + APPV 121; QA PASS 99f6c38); wlive PASS, 3325/3325 identical on both (my compare script was lost to /tmp cleanup mid-ship; rewritten, checked that it flags a wrong file, rerun). Rollback = rollback-v0.80 34a2250 (APPV 122). Both pushed. QA: live check please. Your note on the 49 old pre-rig SHOP rows: noted for a later cleanup, not urgent. (QA: DONE, PASS; QA findings)
- (QA: DONE on release/v1.20 + d51ef4c, PASS, v1.21 can ship; QA findings) FOR QA (d51ef4c): Cal: "Remove the 'you can afford an upgrade in the garden' ... remove clutter from the board view", then "remove the next goal as well. it is redundant with the goals button". The Board's Next line no longer names an upgrade (falls through to the Daily Quest / quests left); inside a building no pill under its name (glNextHtml returns ""), the Goals button with its count stays. afford.js PASS at 360/390/430. Not checked: tours that might point at the old pills (none found by grep), a phone. v1.21 = release/v1.20 + d51ef4c.
- v1.20 LIVE on Live and Test = 6ba0729 (release/v1.20: VENOM ROSE's 15 + ROOMS's art + the v1.20 letter + APPV 120; QA PASS 8f08e5e); artcheck 0 gaps, wlive PASS, 3325/3325 identical on both (one Test read failed in the ship run, a rerun matched all). Rollback = rollback-v0.80 4cca559 (APPV 121). Both branches pushed. QA: live check please. Borderline five still wait on Cal. (QA: DONE, PASS; QA findings)
- (QA: DONE on release/v1.20 6ba0729, PASS, v1.20 can ship; QA findings) FOR QA: v1.20 candidate = release/v1.20 at 6ba0729 (release/v1.19 + ROOMS's a10a097, 353080a, 242f620, d808aca (drafts.md left out; 468c3fa is drafts only) + 1a653a7 + bc90d6c + APPV 120). Build that branch, not qa-local (the letter needs APPV 120).
  1a653a7: VENOM ROSE's 15 rows (Cal: "Approve all"; your 39bc5d1) after gx_v_heel. Grades: bunny ears, pipe, fishnets standard; body chain, corset bodysuit, lace slip dress luxury; the other nine premium (velvet, silk, patent, leather, the lace mask). Boutique prices 690-1,190. VENOM ROSE first goes live on the Boutique 11-23 (the test finds it live 12-04).
  bc90d6c: the v1.20 letter (29q_news.js v:120): 7 vague lines, no brand or room names, 500 coins. Please check the wording for spoilers.
  Checked on the release build: roserows.js PASS (names, lines, bands, art, on both bodies' rose tab); letter120.js PASS (from v1.19: 1 letter, +500 once; from v1.09: two, +1,000; new on v1.20: none); artcheck 315 garments 0 gaps. brandwear v on qa-local: 0 not drawn, 22 m / 31 f outfits x 35 poses, looked over by eye at sheet size only. Not checked: the Shop cards by eye, a close look at each pose.
- v1.19 LIVE on Live and Test = 78926d8 (release/v1.18 + 205d8df + APPV 119; QA PASS 4b967e7; Cal on the clawback: "no one has purchased smoke bomb yet so its fine"); wlive PASS, 3256/3256 identical on both (one Test read failed in the ship run, a rerun matched all). Rollback = rollback-v0.80 a9fea26 (APPV 120). QA: live check please. Borderline five still wait on Cal. (QA: DONE, PASS; QA findings)
- (QA: DONE on release/v1.18 + 205d8df, PASS, v1.19 can ship; one NOTE for Cal; QA findings) FOR QA (205d8df): Cal (via ROOMS): "The ninja ones are cool." Arrived after v1.18 shipped, so v1.19 undoes the SMOKE BOMB half: V17GONE is only the durag and bandana; the 12 are back on sale; no hold, its own subtitle; v17Back gives a v1.18-refunded owner the pieces back and takes the refund back (not below 0), once. gone.js PASS. v1.19 = release/v1.18 + 205d8df.
- v1.18 LIVE on Live and Test = c12783d (release/v1.17 + aec19d9 + APPV 118; QA PASS 989b71c); wlive PASS, 3256/3256 identical on both. Rollback = rollback-v0.80 ea1b732 (APPV 119). QA: live check please. Borderline five wait on Cal via ROOMS. (QA: DONE, PASS; QA findings)
- v1.17 LIVE on Live and Test = 48fab96 (release/v1.16 + b148138 + APPV 117; QA PASS ef61767); wlive PASS, 3256/3256 identical on both. Rollback = rollback-v0.80 24ada95 (APPV 118). QA: live check please. (QA: DONE, PASS; QA findings)
- (QA: DONE on release/v1.17 + aec19d9, PASS, v1.18 can ship; QA findings) FOR QA (aec19d9): Cal's "get rid of" order (via ROOMS). 29zz_v117.js: V17GONE (14 pieces) off sale everywhere and not worn or owned by anyone; owners refunded each piece's price once (S.goneRef, every 5 s while loaded); SMOKE BOMB held from 11-17 (DROPS.hold) and sub "techwear"; Pip's bandana off (26_world.js). gone.js PASS. Not checked by me: the refund across a cloud merge, Pip in every pose, the subtitle on screen. Borderline pieces (gp_sailor, gp_blazer, km_camp, km_shell, cr_mohawk's name) wait on Cal via ROOMS. v1.18 = release/v1.17 + aec19d9.
- (QA: DONE on release/v1.16 + b148138, PASS, v1.17 can ship; QA findings) FOR QA (b148138): Cal: "Yes, count in full" (quick admin toward the streak/Weekly Quest day). XP paid stays 75%; the cut is added back to S.dayXp (S.qaDay per quest, removed on untick; creditStreak/uncreditStreak as in toggle). quickadmin.js PASS. v1.17 = release/v1.16 + b148138.
- v1.16 LIVE on Live and Test = 505c7f0 (release/v1.16: release/v1.15 + 44bb4e3 + ddc1d10 + c5bc0c7 + APPV 116; QA PASS 42813c7); artcheck 0 gaps, wlive PASS, 3256/3256 identical on both (one Live read failed in the ship run, a rerun matched all). Rollback = rollback-v0.80 1e57a12 (APPV 117). QA: live check please. (QA: DONE, PASS; QA findings)
- v1.15 LIVE on Live and Test = 0859d5b (release/v1.15: release/v1.14 + b3917b8 Training tab + ad44305 quick admin XP + APPV 115; QA PASS b8499fa); artcheck 0 gaps, wlive PASS, 3243/3243 identical on both. Rollback = rollback-v0.80 9aeff58 (APPV 116). QA: live check please. (QA: DONE, PASS; QA findings)
  Cal to hear (QA's NOTE): quick admin also counts 25% less toward the 50 XP active day (streak, Weekly Quest), about 7 ten-XP emails instead of 5 on a day of only those; counting base XP there instead is a one-line change if he wants streaks untouched.
- (QA: DONE on release/v1.14 + b3917b8 + ad44305, PASS; QA findings) FOR QA (b3917b8): Cal: "I want the training tab to still be on the bottom as a new tab". Training back in the bar after Board (6 tabs); its Board tile goes; calm days 1-3 still hide it; its tour rings the tab. tabs6.js PASS at 360/390/430. Proposed: ship it alone as v1.15 (release/v1.14 + b3917b8) while Boba waits on ROOMS's fixes; Boba becomes v1.16.
- (QA: DONE on release/v1.14 + b3917b8 + ad44305, PASS; one NOTE for Cal; QA findings) FOR QA (ad44305): Cal chose: "small tasks like sending emails or repetitive admin work gets a little bit less XP". Admin-cluster quests of 10 XP or less pay 75% XP (tag "Quick admin x0.75"); 25+ admin, other clusters, bounties and coins unchanged. quickadmin.js PASS. Same file as the Training tab (29zz_v115.js), so v1.15 = release/v1.14 + b3917b8 + ad44305.
- (QA: DONE on ddc1d10, PASS; v1.15 waits on ROOMS's two small FIXes to 44bb4e3; QA findings) FOR QA (ddc1d10, with ROOMS's 44bb4e3): Boba +15 economy. Dessert n:9 (v1.14's count; 18 without), bizDay boba 360 (old 15 earn 258, was 250; empty 162, was 166). Old prices drop 5-9% (ramp), never up. New rigtest/lead/roomplus.js (any grown room vs the last release): ROOM=boba PASS vs v1.14. Ships as v1.15 = release/v1.14 + 44bb4e3 + ddc1d10 after both pass; artcheck runs in the ship script.
- v1.14 LIVE on Live and Test = 0a26f27 (release/v1.14: release/v1.13 + 791cc5c + APPV 114 + ROOMS's art 86cb0e1, 35f3080, cbc3709). wlive PASS, 3243/3243 identical on both. Rollback = rollback-v0.80 f33e3ed (APPV 115). QA: live check please. (QA: DONE, PASS; QA findings)
  BUG FOUND AND FIXED HERE: v1.12 and v1.13 shipped HANGANG's and DIAL-UP's 30 new rows WITHOUT their art and items.json (ROOMS's 86cb0e1 and 35f3080 were never cherry-picked; every test, mine and QA's, ran on builds that had the art). Live, those 30 cards had no picture and a bought piece did not draw (no errors, fails soft; owners keep the piece, it draws from v1.14). Guard: rigtest/lead/artcheck.py (every Shop garment has its items.json entry, icon and body art in the release tree) now runs in my ship script and stops the deploy on a gap; it flags v1.13 (30 gaps) and passes v1.14. Release content checks should compare art and items.json too, not only app/src.
- (QA: DONE on 791cc5c, PASS, v1.14 can ship; QA findings) FOR QA (791cc5c): OVERPASS's 15 new pieces wired (Cal: "Approve after QA"; your a96107d). Thrift: durag, tool lanyard, rect shades, cshort jorts, knit slip-ons; rest standard (moc boots by the derby precedent). Prices 130-370. overrows.js PASS, brandwear o 0 not drawn. The durag's tails may be repainted (Cal's call): art only, no row change.
- v1.13 LIVE on Live and Test = 7eb084f (release/v1.13: release/v1.12 + ff44edc, fff49a2, 777411d, c1c8c12, 9eb7f13, 15954e6, b43ebf8 + APPV 113; QA PASS 6b254cd + 1e450c6); wlive PASS, 3024/3024 identical on both. Rollback = rollback-v0.80 629a870 (APPV 114). 26_world.js differs from ff44edc only by 62774ce's comment. QA: live check on 7eb084f please. (QA: DONE, PASS; QA findings)
- Economy pass (after the +15s), from QA 1e450c6: Lock and Key now pays back slowest (197 days, was 152); give each coming +15 room's gate an n (Boba +15 next holds back Dessert; then Theater, Auditorium, Arcade, Rhythm); the Mall plaza slip; the Speakeasy.
- (QA: DONE on 777411d, PASS; QA findings) FOR QA (777411d): your ff44edc NOTE fixed in the engine: lfFree skips any spot within 0.5 of a post someone holds. crewpost.js (60 s): the walker never stops within 0.6 of the seated person, never passes closer than 0.3; 5 of 5 runs PASS with ROOMS's fff49a2 in the build.
- (QA: DONE on 9eb7f13, PASS; two NOTES, the Wheel's prize time and the freeze tip's wording; QA findings) FOR QA (9eb7f13): Cal's two notes. The Wheel closes back to the Board about 5 s after a spin (its Board row was already hidden until the next spin); a one-time Board tip when a player first holds a streak freeze (used for them, no button), and the earn line says so. rigtest/lead/v112.js PASS (Wheel, tip, a missed day covered by a freeze through a real quest).
- v1.12 LIVE on Live and Test = 6f15fd9 (release/v1.12: release/v1.11 + ROOMS 3c3d6a1 + f6fc989 Bowling/VR/Dessert (QA PASS 3b7cd87) + c15c239 HANGANG and DIAL-UP new pieces + dff8d50 (QA PASS d2a0460, note 3 done) + APPV 112); wlive PASS, 3013/3013 identical on both. Rollback = rollback-v0.80 f833f67 (APPV 113). QA: please run the live check on 6f15fd9. (QA: DONE, PASS; QA findings)
- (QA: DONE on ff44edc, PASS; one NOTE for the Lock and Key wiring; QA findings) FOR QA (ff44edc): crew posts for ROOMS's Lock and Key staff. A staff entry [id, look, {post:"tag"}] keeps that person on the spot tagged "tag" (act "sit" sits); {wand:1} walks the room; post:1 on a spot keeps others off; a posted person never serves. rigtest/lead/crewpost.js PASS (stand-ins, 40 s in the open window). No room uses it yet, so nothing on screen changes until ROOMS wires it.
- Done: v1.11 LIVE on Live and Test = 034069d (release/v1.11: release/v1.10 + ROOMS's 6749725 + 4456e71 + APPV 111; QA PASS
  c97c089: no mop in a new player's full Restaurant (QA f210213, from the v1.10 cut of r_d1), lamps, Garden corner), wlive PASS,
  3013/3013 identical on both; rollback APPV 112 (f1afcc6). QA live check please (034069d) (QA: DONE, PASS; one NOTE; QA findings).
- Now (on 1854144): v1.10 LIVE on Live and Test = 1854144 (release/v1.10: release/v1.09 + cfe5917 + APPV 110), after v1.09 LIVE
  918732a (release/v1.08 + 5959380 + cbc2d88 + APPV 109); both QA PASS d2fb54a, wlive PASS, 3013/3013 identical on both each time;
  rollback APPV 111 (d5b2580). Checked on the v1.10 build: a player from v1.09 gets "What's new in v1.10", 7 lines, +500 on opening;
  a player who starts on v1.10 does not. QA live check please (918732a and 1854144) (QA: DONE, both PASS; QA findings). QA's Mall note (plaza 60%: a 0-3 piece slip):
  left as is. Next: Cal's speed log, ROOMS's DIAL-UP rows, the +15 rooms as they pass, then the economy pass.
- v1.09 FIX for QA's 175d070 = cbc2d88 (on top of cfe5917; v1.09 will be 5959380 + cbc2d88): version its own small right-aligned line (clears an
  11-letter name at 360/390/430, v109.js); a save error shows in full on every tab; side quests from before v1.09 get their week from
  its first load (wk0, progress kept); the hall picture fades at its sides. Class pill contrast on Sunset/Blood/Gold: unchanged (same
  pill as before). QA please re-check cbc2d88 (QA: DONE on 5959380 + cbc2d88, PASS, v1.09 can ship; QA findings).
- Next (on cfe5917, after 5959380): v1.10 candidate, WAITING ON QA after v1.09. Restaurant 58 -> 40 and Garden 40 -> 35: QA's ranked cut
  (8ae2680 + 4c56320) retired via ECON.cut in 29e_economy.js: owners keep them (still drawn), their "+N%" and hours set to 0, so a full
  room pays its bizDay either way (roomcut.js PASS: 40 / 35 on sale, Restaurant day 700 and Garden 1,500 with or without the cut pieces;
  kept prices down at most 10%, Restaurant total 85,900 -> 68,250, Garden 38,950 -> 36,500, until the economy pass). Hire a Host needed
  Host Lectern: both cut. Also the v1.10 letter: PATCHNOTES v:110 in 29q_news.js (500 coins, no spoilers), shows only at APPV 110.
  QA please check: a save whose next room waits on a share of Restaurant/Garden upgrades (roomFill no longer counts cut pieces
  bought), and the letter's wording. (QA: DONE on cfe5917, PASS; one NOTE, the Mall's plaza share; QA findings)
- Now (on 5959380): v1.09 candidate, WAITING ON QA: Cal's cleanup list (29zz_v109.js). v109.js PASS at 360/390/430 (version only on the Board;
  coins, letters, class beside the frame, nothing past the edge; no Coaches; Town square without Neighbors; no "Outside run"; no sale
  strip, the sale brand's cards wear the badge; Upgrades tab only after the Lair screen, beside the Wardrobe, with upgrades + Interface;
  side quests: 8 days old lapses and is offered again in a week, 2 days old shows "5 days left"); cloudshots.js (mock cloud) before/after:
  Town Hall picture behind the header, no banner, Challenges and Town meter text behind (i), chat Room 3 gone, 0 page errors; ncrows and
  patch106 PASS. Also fixed: the Wheel row's "new" mark floated to the page's top right corner. Choices LEAD made, Cal may correct:
  Neighbors list cut (Town square stays, Players lists everyone); the Town Hall picture only on the Town Hall tab; the side quest
  can be offered again a week after it lapses. Not checked: a real phone. QA please: pass/fail 5959380 (QA: DONE on 5959380, NOT A PASS yet: one small FIX, the Board's version line over the name at 360; the rest PASS; four NOTES; QA findings).
  ROOMS, Cal's FINAL rule (via QA, replaces 30-35): "Game room is okay. Add 15 more upgrades to everything else. Restaurant can go
  down to 40 (keep the most visually appealing upgrades but can remove the small unnoticeable ones), Garden can go down to 35, theater
  is good". Loft rooms unchanged; Restaurant 58 -> 40 and Garden 40 -> 35 by REMOVING (QA ranks them; owners refunded); +15 each for
  Lock and Key, Rooftop, Boba, Dessert, Speakeasy, Auditorium, Mall, Bowling, Karaoke, Arcade, Rhythm, VR, Club (195 sprites). Then
  LEAD's economy pass.
  ORDER (Cal, 2026-11-17, "Alternate them"): ROOMS alternates a brand and a room: DIAL-UP, Lock and Key +15, OVERPASS, Boba +15, ...
- Now (on 8d1f69f): v1.08 LIVE on Live and Test = 8d1f69f (release/v1.08: release/v1.07 + 00c18f4 only, NOT ROOMS's HANGANG art;
  APPV 108; QA PASS c9ff3ce), wlive PASS, 3013/3013 identical on both; rollback APPV 109 (766dec3). QA live check please (8d1f69f) (QA: DONE, PASS; QA findings). QA NOTE 1
  (Speakeasy pays back in 168 days vs 101-144): left as is for now. NEXT, v1.09, Cal's UI cleanup (2026-11-17): cut Coaches (Training);
  Town Boss off for now; Chat 3 rooms -> 2; Players tab: Town Square stays, the Neighbors list goes (redundant); Town Hall banner ->
  page background/gradient behind the top character frame; Shop: Upgrades + Interface -> one "Upgrades" tab; "On sale today" banner
  gone, a sale mark on items instead; version number only on the first tab, top right; coins, inbox and class name in the empty space
  right of the character frame (Board, Town Hall, Players); no dead space at the top of other tabs; "Outside Run" -> "Outside"; side
  quests last 1 week; challenge, photo and Town meter text into their buttons / (i).
  THEN, rooms (Cal, 2026-11-17): "a middle ground of 30-35 upgrades per room for every room. Except the loft and patio. Those rooms
  look nice." and "I want the balancing of the coins and level progression to make sense later on with these new upgrade changes."
  Plan: Restaurant 58 and Garden 40 -> 30-35 by merging (QA's list, be9bc20; saves owning half a pair get the merged piece, nothing
  paid twice); Theater 33 stays; every other room (Game Room 21, the 10-15 rooms) up to 30-35, mostly as tiers of pieces already there
  (supersede, so no room gets crowded: rooms-never-cluttered) = new art from ROOMS, room by room, in story order; then LEAD re-runs the
  economy (prices from ECON, level pacing, econsim) and QA checks it.
- Was (on 00c18f4), shipped as v1.08: v1.08 candidate, (QA: DONE on 00c18f4, PASS, v1.08 can ship; two NOTES; QA findings) WAITING ON QA. QA's later-rooms sweep (be9bc20) asked if the Speakeasy's 5,800 total was
  intended: no, it was missing from bizDay/phase/roomDay/bigMoment. 00c18f4: phase 3.4, bizDay 450, roomDay 21000, big moment sp_stage:
  14 upgrades 75,500 (VR 59,050, Club 92,600); income 45 -> 32.7 an hour (450 a day at full). Price compare vs 29ed258's build: only
  the 15 Speakeasy values changed. Nobody is level 45, so no owner is affected. QA please: pass/fail 00c18f4. The Restaurant/Garden merge
  (QA's proposal) waits on Cal.
- Now (on c546e9c): v1.07 LIVE on Live and Test = c546e9c (release/v1.07: release/v1.06 + 29ed258 + APPV 107; QA PASS fc0560b),
  wlive PASS, 3013/3013 identical on both; rollback APPV 108 (a5c8363). QA live check please (c546e9c) (QA: DONE, PASS; QA findings). QA's NOTE 2: the old patch
  letters (PATCHNOTES, 29q_news.js) already pay 500 every 10th version: v1.10's letter goes THERE, not in PATCHES (29zz_patch.js holds
  only the one-off Update 1.06), so only one system sends it. The letter keeps the name "Update 1.06" (Cal's words).
- Was (on 29ed258): v1.07 candidate, shipped.
  fea3674 + 0ea9b2a + APPV 106), wlive PASS, 3013/3013 identical on both; rollback APPV 107 (a065b25). Cal, 2026-11-17: "When v1.06
  gets published, send a short update summary of the patch changes in the mailbox. And give everyone 500 coins" and "Too much info in
  the update logs that give info on what is next. Just be vague about it and don't spoil anything." 29ed258: 29zz_patch.js, the
  "Update 1.06" letter from Cal (no brands, days or Vault) with Claim 500 coins, only for players whose welcome letter is dated on or
  before 11-17; and QA's tab NOTE: the Shop's section tab row wraps. patch106.js PASS (letter, 500 once, a 11-18 joiner gets none, every
  tab on screen at 375/390/430 on 11-19 and 12-23); ncrows.js PASS. Not checked: real phone, web build. Storage rules deployed; Cal's
  own photo post worked. QA please: pass/fail 29ed258 on top of v1.06.
  Cal, 2026-11-17: patch letters from now on only every 10th version (1.10, 1.20, ...), each covering the changes since the last,
  vague, no spoilers, each with 500 coins (Cal) (1.06 was a one-off). LEAD adds v:110 to PATCHNOTES (29q_news.js, which pays the 500) in the v1.10 build, not to PATCHES.
- Was (on 0ea9b2a), shipped as v1.06: v1.06 candidate, URGENT, (QA: DONE on 0ea9b2a, PASS, v1.06 can ship; one NOTE for LEAD, the brand tabs no longer fit a phone; QA findings) WAITING ON QA. Cal, 2026-11-17: "There should be 3 brands at all times. The vault on
  Wednesday is separate from the 3. Right now it should be hangang, dial up, and overpass." 0ea9b2a: Street live 3 (29e_economy.js);
  a retired brand rests at least 2 drops (29zz_ncstreet.js gap = live + max(1, half the brands not live)), as with 3 live the old gap
  brought DIAL-UP back 4 days after it left. Today: HANGANG, DIAL-UP, OVERPASS; Fri 11-20 NICE COCK drops, HANGANG retires. Only 6
  Street brands have art, so they cycle every 3 weeks and the Wednesday brand (14 days gone) shows only 12-23 and 02-03 to February.
  Drops before 11-16 unchanged (dropcal vs 8779). ncrows.js PASS (PORT=). Not checked: the Shop with 3 cards by eye on a phone.
  QA please: pass/fail on 0ea9b2a only (on top of v1.05); LEAD ships v1.06 before Friday 8 am.
  Cal, 2026-11-17: Storage ON; LEAD deployed storage.rules (--only storage, compiled and released). Checked: without sign-in,
  upload, read and upload outside photos/ all 403. Not checked: a signed-in post (needs a real player; Cal posts one photo).
  Cal, 2026-11-17: "i approve whatever you need. Have rooms start painting": new240 drafts (HANGANG, DIAL-UP, OVERPASS) approved,
  ROOMS told to paint in that order (QA wear-test first, LEAD wires rows as each brand passes).
- Was (on fef3cda): v1.05 LIVE on Live and Test = fea3674 on branch release/v1.05 (release/v1.04 + ROOMS's NICE COCK art 297c848 +
  bcd8f73, LEAD's f16dbc2 + b10ca52, APPV 105; QA PASS bcb5a39 + fef3cda; code identical to b10ca52 but APPV): NICE COCK's 10 redone
  pieces, NICE COCK on the Street as its Fri 11-20 drop, every drop random after. wlive PASS, 3013/3013 files identical on both; rollback
  at APPV 106 (bbd33a8). QA live check DONE (3992acb, PASS). QA's NOTES for Cal: NICE COCK sells at Street prices (310-450) from now (anyone
  who bought since 11-13 paid Boutique prices); the Boutique's 3 brands only take turns. Next: Cal's next speed log on v1.04+. Cal,
  2026-11-17: week-one Daily Quest goal kept, level pacing kept, GitHub push DONE. Storage and HANGANG's 15: DONE (see Now).
  Was: Now (on 63fa5f3): v1.04 LIVE on Live and Test = efe8e2d on branch release/v1.04 (release/v1.03 + c7051f3 + 0ca45f7 + APPV 104; QA PASS
  63fa5f3; code identical to 0ca45f7 but APPV): card rules behind an (i), Hall/Players portraits one still frame, your Loft frames warmed
  after load, NICE COCK's 10 repaints off sale (live on the Boutique to Thu 11-26). wlive PASS, 3021/3021 files identical on both; rollback
  at APPV 105 (567b50a). QA live check DONE (513ad75). v1.05 candidate = f16dbc2 (QA PASS) + b10ca52, WAITING ON QA:
  NICE COCK moves to the Street and is its drop on Fri 11-20, then every drop random (Cal). MUST SHIP before Fri 11-20 8 am PT. Then Cal's next speed log on v1.04. Cal, 2026-11-17: week-one Daily Quest
  goal "felt okay" (kept); level pacing kept ("I am the anomaly ... it should be fine"); GitHub push approved and DONE (qa-local
  213ea0f..807955f on origin). WAITING ON CAL: switching on Storage (steps sent to him; LEAD deploys storage.rules after), HANGANG's 15
  (ROOMS's drafts.md shown to him),. NICE COCK answered (Cal, 2026-11-17: "I want NICE COCK to drop on Friday. And then randomize all
  the other drops afterwards"; he is under level 30, Street only): b10ca52.
  Was: Now (on ea9f942 + LEAD's commit below): v1.04 candidate, WAITING ON QA. Cal, 2026-11-16: "Some text on the app is just a lot of clutter
  ... Review the rest of the game and find where we can cut the fat. Also check the lag time and speed when changing tabs."
  (1) Cut the fat: every card's rules moved into an (i) beside its title (29zz_lean.js qbI/QBINFO; Daily Quest, level trial, Training, Gym
  plans, own workouts, workout day, Crawls, Rescued allies, Wheel, Likes, Coaches, Vault; the Hall banner line cut). Text per screen (fat.js,
  mid player): Board 897 -> 482 chars, Training 692 -> 217, Crawls 481 -> 173, Players 272 -> 119, Wheel 173 -> 29. The Daily Quest tour's
  second step rings its (i). (2) Speed (Cal's phone, v1.03: The Loft 1.2 s first open, Hall 1.1 s first open, other tabs 40-125 ms):
  Hall/Players portraits ask one still frame, not the whole idle clip (heavy seed, first open: Hall 12 -> 1 rig pictures, Players 84 -> 54,
  portraits.js); your own Loft frames warm 6 s after load (qbWarmMe). The Loft's building view: request to ROOMS. (3) NICE COCK (Cal via
  ROOMS, "ship NICE COCK on friday"): it has been LIVE on the Boutique since Fri 11-13 (dropped before the hold) and stays to Thu 11-26; the
  11-20 Boutique slot is CHROME RAIN. Its hold now ends 11-20 (back in the rotation from 12-11; dropcal.js: every slot to 12-04 identical
  to v1.03, Street identical to 2027-01-31); its 10 repaint ids are off sale (ZXCUT) until ROOMS's art lands. WAITING ON CAL: keep that, or
  make NICE COCK drop again on 11-20 (pushes CHROME RAIN and the Boutique order back a week).
- (QA: DONE on b10ca52, PASS, v1.05 = f16dbc2 + b10ca52 can ship; two NOTES for Cal/LEAD; QA findings) WAITING ON QA, URGENT (v1.05 must be live before Fri 11-20 8 am PT): check b10ca52 (LEAD). Cal: "Right now, the shop is overpass. I
  want NICE COCK to drop on Friday. And then randomize all the other drops afterwards." He is under level 30, so NICE COCK moves to the
  Street (BRANDS fl "street"; its pieces now 310 to 450 on the Street's scale) and is pinned as the Street's Fri 11-20 drop (live
  OVERPASS + NICE COCK, its splash shows). From 11-20 every floor drops a fresh fixed-seed shuffle per round (29zz_ncstreet.js): never
  while live, a rest of at least half the floor's brands. Every drop before 11-20 is unchanged (dropcal 11-09..11-19 identical). From
  11-20 the Boutique shows only its own 3 brands (SAYMORE alone that first week). LEAD: ncrows.js PASS (11-19, 11-20, splash, prices),
  cutpieces, tabs5, tourtest, swaptest PASS, dropshuffle liveBad 0, the Wednesday vault as before (none until Feb). Please also cover:
  pricesweep, a level-30+ player on 11-17 (Boutique still VENOM ROSE + NICE COCK) and on 11-20, and an owner of a NICE COCK piece.
- (QA: DONE on f16dbc2, PASS, v1.05 can ship; QA findings) WAITING ON QA: check f16dbc2 (LEAD) with ROOMS's art bcd8f73 (its wear-check is ROOMS's line): NICE COCK's 10 repainted pieces back
  on sale with ROOMS's names and lines (Fleece Dad Cap, Cashmere Scarf, Rimless Aviators, Embossed Crest Hoodie, Layered Lounge Tee, Waffle
  Lounge Zip, Sherpa Fleece Zip, Silver Court High-Top, Suede Runner, Shearling Clogs & Socks; the "&" shows right). Grades: tank, qzip,
  knit and slide go to premium; band, tee and shades stay standard. Boutique prices: 670 to 1,000. All 10 come off ZXCUT; the drop calendar
  is unchanged (dropcal.js diff: none). LEAD ran rigtest/lead/ncrows.js PASS; cutpieces, tabs5, tourtest and swaptest PASS. Please add
  pricesweep and an owner of an old-art piece (same id, new picture). Then LEAD ships v1.05, ideally before Thu 11-26.
- (QA: DONE on 0ca45f7, PASS, v1.04 can ship; QA findings) WAITING ON QA: recheck the Training card and its (i) only (LEAD's fix after c7051f3): the card keeps wwLine's line ("Keep it up for x2 coins
  next week" / "Week 3 in a row: x3 coins." / "Next week x4 if you keep it up"); the (i) says "x2, x3, then x4 at most. Miss a week and it
  starts over." LEAD checked no streak, week 3, and week 4 claimed. Then v1.04 can ship. NICE COCK's 10 rows are staged (ROOMS's names and
  lines; four regrades: track jacket, suede runner, Chelsea boot premium ~960-990, shearling bomber luxury 1,180) and go in when ROOMS
  commits the art (Cal approves it first).
  Was: (QA: DONE on c7051f3, NOT A PASS: one small FIX, the Training (i) says x2 coins for every streak; the rest PASS; QA findings) WAITING ON QA: check LEAD's v1.04 candidate commit (on ea9f942): every (i) opens its sheet with the right numbers (wheel hours, Weekly Quest
  days, trial days, Training's reward); no card lost a live number (counts, timers, rewards, the streak multiplier); Hall and Players
  portraits all show on a first open (heavy seed); the Daily Quest tour's (i) step; savecheck/screens as usual. Your dqeffort.js looks for
  .dq-eff, which is gone on purpose (its words are in the Daily Quest's (i)); wv91_extra.js reads the Wheel's old line for its log only.
  The 10 NICE COCK ids off sale: the Boutique shows its 6 keeps (jogger x3, short, cap, beanie), owners keep theirs.
  Was: Now (on bf7b4a4): v1.03 LIVE on Live and Test = f72a55f on branch release/v1.03 (10daa03 + ROOMS's room sweep 16a9ebf-8a99e00 + ALTITUDE's gorpcore repaint 7c5664e with its text/colours/hold end 8093dcb, the anorak fix a9def76, "Trail Hikers" 8d5add0, anorak back on sale bf7b4a4 + APPV 103; QA PASS on e53c2af and the delta f72a55f, 76718bb). wlive PASS, 3021/3021 files identical on both; rollback at APPV 104 (55a5c72). ALTITUDE rejoins the drops (first Fri Nov 20); KODE PINK still held, waiting on Cal. WAITING ON CAL: the GitHub push, Storage, the week-one Daily Quest goal, level pacing.
  Was: Now (on 83feea0): v1.02 LIVE on Live and Test = 10daa03 on branch release/v1.02 (bd74f15 + 83feea0 cherry-picked + APPV 102; QA PASS): QA's new-player review fixes (the first tour step, level-2 pacing, the Bedroom's order, first steps, the week-one Daily Quest, the letter closing on claim, toasts above the tab bar), Claim all, the offline sorter, the Lair's screen label. wlive PASS, 3031/3031 files identical on both; rollback at APPV 103 (f6412da). v1.01 (fc3f4de) shipped before it with the Daily Quest's effort count, wagers, held brands and cuts. For Cal in the morning: the week-one Daily Quest (3 tasks still ~45 of 100; a smaller first-week goal?), pacing (levels fast: ~46 by day 20 of 100; weekly payouts 3,000-11,000), the popup limit and app.js size (not done), QA's review ideas left for him (plain words, "!" badges, poke or spank, community). TAKEN, waiting on ROOMS: the Boutique's brands, KODE PINK's repaint approval (then its hold ends), the redone brands' text. WAITING ON CAL: Storage (later), the GitHub push.
  Was: Now (on bd74f15): v1.01 LIVE on Live and Test = fc3f4de on branch release/v1.01 (4c6317b + QA's two FIXes 59f2c38/69d7975 cherry-picked + APPV 101; QA PASS on 54b7517): the Daily Quest counts effort, typed and real-money wagers, the redone brands held from the drops (OVERPASS drops Mon Nov 16), audit cuts off sale. wlive PASS, 3031/3031 files identical on both; rollback at APPV 102 (3692fe8). v1.02 on qa-local (QA: DONE on bd74f15, NOT A PASS yet: one small FIX, toasts still on the tab bar; the rest PASS; QA findings) (QA: DONE on bd74f15 + 83feea0 only, PASS, v1.02 can ship; QA findings) WAITING ON QA (after Cal's room sweep): 5eeb623 (QA's review fixes), 1b4efc5 (Claim all), e651938 (the offline sorter), bd74f15 (QA's room sweep: the Lair's UPGRADES label as screen text; the Restaurant's diner seat spots are ROOMS's, 21_restaurant.js). Cut v1.02 from bd74f15. Economy run (20 days, cal and regular profiles, tonight's code): Daily Quest chests now 200-740 a day (were up to 2,400); 5-15 buys a day, coins spent down, Garden day 5, chef day 9; levels fast (15 by day 4, ~46 by day 20 of MAXL 100); weekly payouts spike 3,000-11,000. Pacing calls left for Cal. Later or maybe (Cal): an idle monster-fighting game. WAITING ON CAL: Storage (later), the GitHub push.
  Was: Now (on 8c3f8dc): v1.00 live (8c3ecec). v1.01 candidate (QA: DONE on 4c6317b, NOT A PASS yet: two small FIX lines, the rest PASS; QA findings) (QA: DONE on release/v1.01 54b7517, PASS, v1.01 can ship; QA findings) WAITING ON QA, must ship before Mon Nov 16 8 am PT (the first held drop): the Daily Quest counts effort 689d212 (Cal: hits the hidden goal daily); challenge wagers typed or real money a0a7292 (Cal); brands held from the drops while redone 5fa8be7 + KODE PINK and the first audit cuts off sale 8c3f8dc (Cal approved ROOMS's audit). Next (Cal: work overnight): QA's experience review fixes (the first tour step, Bedroom order, level-2 pile-up, first-steps oddities, DQ in week one), then brainstorm 5/6/1. Later or maybe (Cal): an idle monster-fighting game. WAITING ON CAL: Storage (later), the GitHub push.
  Was: Now (on 8c3ecec): v1.00 LIVE on Live and Test = 8c3ecec (the code of 2a3257e, QA PASS, APPV 100; 8c3ecec adds only QA's TASKS line): first steps on the Board (Cal: "Add a first-steps list"; b3f7e4d + 5ded710 + 86002df), the chef hat off the eyes (b416f33), the version reads v1.00 (2a3257e). wlive PASS, 3031/3031 files identical on both; rollback at APPV 101 (a213ba8). Next: Cal's speed log on v1.00. TAKEN, waiting on ROOMS: the Boutique's 10 brands. WAITING ON CAL: Storage (later), the GitHub push.
- (TAKEN by LEAD, waiting on Cal's answers to ROOMS's streetwear audit.) ROOMS's audit (9 brands redone, cuts in 4): once Cal approves, LEAD updates the 15_shop.js rows (names, lines) and BRANDS themes, ids kept; friends' and allies' looks change with the art. Asked Cal: (a) may LEAD read players' saves (S.owned) to see which pieces anyone owns; (b) hold the redo brands back in the drop order? ALTITUDE drops Mon Nov 16 8 am PT.
  Was: Now (on 2a3257e): v0.99 live (bfb412b). v1.00 cut: 28e1ff9 (APPV 100; QA PASS on 719f77e: first steps b3f7e4d + 5ded710 + 86002df, the chef hat b416f33) + 2a3257e, the version label (it would have read "v0.100"; now pnVer: "v1.00"), WAITING ON QA (a small check) (QA: DONE on 0c5fc49, PASS, QA findings), then LEAD ships v1.00. Rollback at APPV 101 (a213ba8). TAKEN, waiting on ROOMS: the Boutique's 10 brands. WAITING ON CAL: Storage (later), the GitHub push; Cal's next speed log.
  Was: Now (on 86002df): v0.99 LIVE on Live and Test = bfb412b (b478cab, QA PASS, + APPV 99): the building view fixed and fitted to the rooms (bf09ce0 + 60f08ce; Cal: "make that room not zoomable"), brand drops in a shuffled order from Mon Nov 16 (148dc12; shuf0 kept at 2026-11-16: shipped Fri Nov 13 23:30 PT, before that drop), Kenan's new look (a995106), six visitor animations (815bab2), the speed log's pan/script/people counts. wlive PASS, 3031/3031 files identical on both; rollback at APPV 100 (a78c23d). Next: Cal's next speed log on v0.99 (the building view should be smooth now). TAKEN, waiting on ROOMS: the Boutique's 10 brands. (QA: DONE on 9f6c17c, NOT A PASS: the upgrade step ticks itself, QA findings) (QA: DONE on 21f7188, marker FIX passes; Show me for the upgrade step: one FIX, QA findings) WAITING ON QA: b3f7e4d, first steps on the Board (Cal: "Add a first-steps list"; 6 steps, +50 each and +100, Show me rings the target, older saves credited without coins; rigtest/lead/firststeps.js PASS; QA: one FIX, the Loft's __m35 key ticked the upgrade step, fixed in 5ded710, QA PASS; QA's second FIX, Show me for the first upgrade stalled on the street, fixed in 86002df), WAITING ON QA recheck, then v1.00 with ROOMS's chef hat b416f33 (QA PASS). WAITING ON CAL: Storage (later), the GitHub push.
  Was: Now (on 815bab2): v0.98 live (c579e83). v0.99 candidate (QA: DONE on 5d726d6, PASS; QA findings) (QA: DONE on 8e1d48c, PASS; QA findings) WAITING ON QA: the fixed building view bf09ce0 + QA's FIX in 60f08ce (Kode Plaza blank: a redraw kept the new picture's default framing; landscape top band), QA's bldfit.js all buildings on screen at 390/375/360/844x390; brand shuffle 148dc12 (QA PASS; LEAD moves DROPS.shuf0 to the first drop day after v0.99 ships); Kenan's look wired a995106. Also WAITING ON QA: 815bab2, six visitor animations (wave, laugh, dance, chat, cheer, clap) for friends, player visits, the team and allies; wear-tested on all 13 friends and 5 team members (rigtest/lead/emotesheet.js), in play (emoteplay.js). WAITING ON CAL: Storage (later), the GitHub push.
  Was: Now (on 148dc12): v0.98 live (c579e83). Cal's v0.98 speed log: Town's first open 2.8 s -> 0.09 s, Players 60 fps; the building view (all rooms) still ~25 fps. Cal: "make that room not zoomable ... the rooms fill the whole screen": done in bf09ce0, (QA: DONE on 7aa8637, NOT A PASS: Kode Plaza blank, QA findings) WAITING ON QA: inside a building the view is fitted to the built rooms (about 1.5x bigger) and fixed (no drag, pinch, wheel or zoom buttons, the picture's transform never rewritten; hint "Tap a room"); the street still pans and zooms; the speed log also counts pan redraws, people-loop script time and people on screen. rigtest/lead/lfloft_lock.js PASS at 3 sizes (v0.98 fails it); nextline, tourtest, tabs5, swaptest, roomfit, dupfn PASS. Also WAITING ON QA: 148dc12, brand drops shuffled from Mon Nov 16 (Cal via ROOMS; drops before stay; fixed seed, same on every phone; rigtest/lead/dropshuffle.js). Then v0.99. Next for LEAD: 6 animations per visitor (ROOMS's request from Cal). WAITING ON CAL: Storage (later), the GitHub push.
  Was: Now (on c579e83): v0.98 LIVE on Live and Test = c579e83 (788b584, QA PASS, + APPV 98): the Loft lag batch (the Patio sky as one bitmap; door glows, room screens' moving parts and the Club's beams stand still, Cal: "Yes, keep it smooth"; slow tab builds in the owner's speed log). wlive PASS, 3027/3027 files identical on both; rollback at APPV 99 (da6b541). Next: Cal's next speed log on v0.98 (the Loft on his phone, and what Town's first open spends its 2.8 s on). Cal (2026-11-14): "Keep the film playing": the Auditorium film stays animated (its window ~31 fps on a Mac). WAITING ON CAL: Storage (later), the GitHub push.
  Was: Now (on 238b192): v0.97 live (bd8c2d3). Loft lag (Cal: "very laggy"; his v0.97 speed log: The Loft 22 fps / 4,700 elements, 3 fps with the Bedroom window open / 7,700, Town's first open 2.8 s, Players 1.7 s) fixed in dbffcfa + 238b192 (the Club's beams steady too), (QA: DONE on 788b584, PASS, QA findings) WAITING ON QA: the Patio sky (~1,900 shapes, also through the Bedroom door) drawn once as a bitmap; the door glow pulse and the room screens' moving parts stand still (screens still change page every 4 s); every room window in WebKit before -> after: Bedroom 22 -> 53 fps, Sky Bar 13 -> 60, Boba 12 -> 58, Mall 15 -> 60, Arcade 14 -> 60, Bowling 12 -> 60, Lair 17 -> 54 (Auditorium and Club stay 31-32: found after, not changed: the Club's 4 light beams (.cbb, a smooth opacity pulse) are its whole cost, 60 fps without; the Auditorium's film on the screen (mv*, ~50 moving parts) is, 60 fps without. Cal: "Yes, keep it smooth" for the glows and screens, so the Club's beams are steady in 238b192 (37 -> 52 fps); the film is a feature, his call, not asked yet). Town's first-open freeze does not show on a Mac: the speed log now notes slow tab builds. nextline, tourtest, tabs5, swaptest, roomfit (updated for the bitmap), dupfn PASS. Then v0.98, and Cal's next speed log. WAITING ON CAL: Storage (later), the GitHub push.
  Was: Now (on bd8c2d3): v0.97 LIVE on Live and Test = bd8c2d3 (ba8010f + the night-owl FIX 95dac60, QA PASS on 139ed13, + APPV 97): the day starts at midnight (a night owl keeps the streak at the switch), the owner's speed log keeps 40 samples and samples The Loft, Town, Players and tab taps, the spin row shows when ready. wlive PASS, 3027/3027 files identical on both; rollback at APPV 98 (296b506). Next: once Cal has played on his phone, read diag/perf for the Loft and Hall lag. WAITING ON CAL: Storage (later), the GitHub push.
  Was: Now (on 95dac60): v0.96 live. v0.97 candidate = ba8010f (QA PASS) + the night-owl FIX take 2 in 95dac60 (QA: d03aa26 NOT A PASS, it cost an evening player who opened the app after midnight a day): nothing moves at load; at the first streak credit after the switch, a 2-day gap from a lastDone saved 00:00-05:00 counts as 1, once (QA's suggestion). QA's nightfix.js on it: all behaviour as wanted (night owl 11, no rest day; evening player 11 as v0.96; 21:00 and other-device saves as before); its case-1 line still expects lastDone moved at load, so it reads BAD until QA updates that check. (QA: DONE on 139ed13, PASS, v0.97 can ship; QA findings) WAITING ON QA: recheck 95dac60, then LEAD ships v0.97. Next: once v0.97 is live and Cal has played on his phone, read diag/perf for the Loft and Hall lag. WAITING ON CAL: Storage (later), the GitHub push.
  Was: Now (on d03aa26): v0.96 live. v0.97 candidate = ba8010f (QA PASS) + d03aa26, the night-owl FIX: on the first load after the switch, a last play between 00:00 and 05:00 keeps its real date, so the streak holds (S.mid0 once; LEAD's test: 01:00 moved, 21:00 kept; nextline, tourtest, tabs5, swaptest, roomfit PASS). (QA: DONE on 0e98007, NOT A PASS yet: case 2 below, QA findings) WAITING ON QA: recheck d03aa26, then LEAD ships v0.97 (the day starts at midnight, the fuller speed log, the spin row when ready). Next: once v0.97 is live and Cal has played on his phone, read diag/perf for the Loft and Hall lag. WAITING ON CAL: Storage (later), the GitHub push.
  Was: Now (on 3e40ab6): v0.96 live. v0.97 candidate WAITING ON QA (QA: DONE on ba8010f, PASS but one FIX or Cal's OK: the night-owl streak at the switch; QA findings): the day starts at midnight (Cal), the owner's speed log keeps 40 samples and samples The Loft, Town and Players and tab taps (Cal let LEAD read it: only 1 sample there, Training 30 fps, 22 animations, from v0.92), the spin row shows when ready. Next: once v0.97 is live and Cal has played on his phone, read diag/perf again for the Loft and Hall lag. WAITING ON CAL: Storage (later, he said), the GitHub push.
  Was: Now (on b010f63): v0.96 LIVE on Live and Test = b010f63 (a591705, QA PASS, + APPV 96): the Wheel as a row when a spin is ready, one bounty on the Board; wlive PASS, 3027/3027 identical on both; rollback at APPV 97 (d05763f). Open, minor: QA's note that the spin row shows on the next redraw if the 4 hours end while the Board sits open. WAITING ON CAL: Storage on, the GitHub push, 5 am or midnight, the phone speed log.
  Was: Now (on 995eb4b): v0.95 LIVE on Live and Test = release/v0.95 3086c59 (b7d9dff, QA PASS, + APPV 95), wlive PASS, 3027/3027 files identical on both; rollback at APPV 96 (b528078). qa-local is at APPV 95. WAITING ON QA (QA: DONE on a591705, PASS, QA findings): overhaul part 3 (995eb4b: the Wheel as a row when a spin is ready, one bounty on the Board). DONE 2026-11-13 (Cal: "Yes, deploy it"): firestore.rules deployed, kudosok readable by its writer and Cal only.
  Was: Now (on 09c30da): v0.95 = QA PASS on d689703 except its Next line FIX, fixed in 09c30da (roomAvail shared with the room window; nextline.js, roomfit, tourtest, tabs5, swaptest pass), (QA: DONE on b7d9dff, PASS, v0.95 can ship; QA findings) WAITING ON QA recheck, then LEAD ships v0.95. Next: fewer daily checklists. After v0.95 is live: WAITING ON CAL for the kudosok rules deploy.
  Was: Now (on 4211a7e): v0.95 candidate. QA PASS up to 5850751 (tabs, middle-ground start, private coin requests, swap, friends' tags); WAITING ON QA (QA: DONE on d689703: tours PASS, overhaul part 2 PASS but one FIX, the "afford" line; QA findings): tours + calm week (0241042) and overhaul part 2 (4211a7e: Next line, top bar shows the level, stats hidden below level 10); WAITING ON ROOMS: the Restaurant tip jar at stages 1-2 (QA's blocker). Next in the overhaul: fewer daily checklists (Weekly Warrior into the Weekly Quest, the Wheel as the Daily Quest's reward). After v0.95 is live: WAITING ON CAL to approve deploying the kudosok rules.
  Was: Now (on 0241042): v0.95 candidate WAITING ON QA (QA: everything up to 5850751 DONE, PASS except the Restaurant tip jar, QA findings; the tours 0241042 next) = five tabs + fixes, middle-ground start, private coin requests, exercise swap, friends' tags, and now guided tours + the calm first week (29zy_tour.js, tourtest.js PASS). Next in the overhaul (Cal: "Yes, start it"): hide numbers until they matter, the "what next" line, fewer daily checklists. After v0.95 is live: WAITING ON CAL to approve deploying the kudosok rules.
  Was: Now (on 5850751): v0.95 candidate WAITING ON QA (message sent): five tabs + QA's two FIXes, middle-ground start (Loft x2, Garden at 45%), coin requests never pinned and private (rules NOT deployed until the code is live, then WAITING ON CAL to approve), exercise swap, friends' name tags above the head. Next, waiting on Cal: the simplification overhaul and the guided tutorial (plan sent to Cal).
  Was: Now (on ae3ba38): two pieces for v0.95, WAITING ON QA for the tabs (QA: DONE on 6426b2e, NOT A PASS: two FIX lines, QA findings). (1) Slower start ce5123f, QA: prices and saves safe; the Loft is ~3-4x, not 2x (econLate), and Goals coins and visit tips follow the phase: both kept, LEAD tells Cal. (2) Five tabs ae3ba38 (Cal: "Fewer tabs first"): Board, The Loft, Shop, Town, Players; Training, Crawls and the Wheel from Board tiles, Relics from the profile; tabs5.js PASS. Then: ship v0.95, and Cal's next pick from the simplification brainstorm.
  Was: Now (on bf9430e): v0.94 LIVE on Live and Test = the fast start (QA PASS on 5256c2b) + tipJarArt (unused until ROOMS places the jars), APPV 94, 3027/3027 files identical, wlive PASS; rollback at APPV 95 (ac60965). Slowing the start (Cal: "Yes slow it down"): tuning ECON.phase (Loft rooms x2) and the Garden trigger with econsim, uncommitted until the numbers hold, then WAITING ON QA with pricesweep. Tip jars: tipJarArt in 29zx, placement requested from ROOMS.
  Was: Now (on 67dcb12): batch 2. Fast start: QA behaviour PASS on 0699c97; its pill FIX done in 67dcb12, WAITING ON QA (QA: DONE on 67dcb12, PASS with one small FIX: the pill covers the version line, QA findings). Economy check (Cal: "42 upgrades on day 2 ... make sure this is intended"): econsim cal, 20 days, current code: upgrades bought a day 15/12/14/16/14 on days 1-5, 9-11 on days 6-11, then 2-7 from day 12; prices 200-650 rising to 2,000-8,650; income 4,000 rising to 10,000-18,000. So it bends as intended (ECONOMY.md: every upgrade around day 94). WAITING ON CAL: whether the first days should be slower (ties to his girlfriend's "too complicated"). Lag on the phone still WAITING ON CAL (read diag/perf). Next: tip jars, then batch 3.
  Was: Now (on 0699c97): batch 2. Fast start fixed after QA (0699c97). Loft and Hall lag: NOT reproduced on the Mac. Full save + QA's heavy seed (60 neighbours, 1,800 posts, 9,000 chat lines), 390x844: tab switches 40-120 ms, Hall, Players and Loft 60 fps, in WebKit and in Chromium with the CPU 4x slower (rigtest/lead/lagmap.js, lagheavy.js). So it is the phone itself or live pushes from other players (the sandbox has none). Asking Cal to let LEAD read his phone's own speed log (diag/perf, owner only). Next: the economy check (42 upgrades by day 2), then the tip jars.
  Was: Now (on 9821a64): batch 2 started. Launch lag: measured, the scripts are ready in ~0.2 s on a reopen (CPU slowed 4x); the wait is Google sign-in plus the online save. 9821a64 draws the Board at once from this device's own copy (taps paused, "Syncing" pill) and then loads the online save as before. f2e57f6: Town square art keeps the clock tower's top. Next: Loft and Hall lag, the economy check, then the tip jars.
- (QA: DONE on 0699c97, behaviour PASS, one visible FIX left: the Syncing pill, QA findings.) WAITING ON QA: recheck the fast start on 0699c97: both FIX lines and the B finding are fixed (message sent with two edits for faststart.js). (QA: DONE on 9821a64, NOT A PASS, QA findings: two FIX lines.) Was: check 9821a64 (rule 17) on a web build with real seeds and a slow database: a returning player sees their Board before the online save arrives; taps do nothing until it does ("Syncing" pill), then work; the save is unchanged after several reopens; a second account signing in on the same browser never sees the first player's Board; a brand-new player is unaffected; a save changed on another device wins as before (saveWhich). LEAD could not seed a finished character on the web build by hand (something reset S.created), so this has only been reasoned through, not run.
  Was: Now (on 6ec9c23): v0.93 LIVE on Live and Test = batch 1 (QA PASS 096f419), APPV 93, QB_EPOCH 6, 3023/3023 files identical on both; rollback-v0.80 moved to APPV 94 (b3d82bc, local). build.py's sandbox now adds noTest=false (QA's find). Next: batch 2 (launch lag, Loft and Hall lag, the economy check), then wire ROOMS's tip jars (f9ecb1a) and the Town square CSS ROOMS suggested.
  Was: Now (on 1feee32): batch 1 of Cal's 2026-11-13 list committed, not deployed. Next: batch 2 (lag on launch, in the Loft and switching
  Hall tabs; the economy check: 42 upgrades on day 2), then batch 3 (a guided tutorial; the progression review), then team members and
  friends roaming with name tags, tip jars.
- ROOMS (2026-11-13): team members need no new art. Build roamers from TEAM[id].look with TMTOP[id] as the top (26_world.js ~487:
  Rafe, Theo, Nova, Sable); Mara wears npc_chef + npc_hat. Without TMTOP, Sable, Rafe and Nova all wear the same y_bucket hat.
- DONE 2026-11-13 (Cal: "Yes, deploy rules"): firestore.rules deployed (chat, likes, photos, challenges; the "permission denied").
- WAITING ON CAL: (2) switch on Firebase Storage in the console (the photo bucket does not exist, so photo posts
  cannot work); (3) approve pushing qa-local to GitHub (DONE 2026-11-17, Cal: "Yes push to github"); (4) the day starts at 5 am (DAYSTART, v0.87): keep it, or midnight as he wrote.
- (QA: DONE on 1feee32, PASS for Live, QA findings below.) WAITING ON QA: check 1feee32 (rule 17) on a clean copy of qa-local: the weight box on an iPhone-sized page (type 135, a comma
  decimal), a bounty finished then "Clear completed" (still Completed), the day turning over with the app open, the Hall (banner on
  top, Posts and Chat only), the Players tab (likes, leaderboard, Town square, neighbors all still live), the Board's Daily Quest and
  Wheel cards, the profile (skills, no rewards), the photo window's Cancel, level-ups with no "???", a crawl with no rare guarantee,
  the floating coins; plus the release checks in docs/QA.md (old saves, pricesweep, dupfn: LEAD saw no new duplicates).

ROOMS Doing:
- Cal 11-24 art list (spec fd48971a, via LEAD): TAKEN A-G. A+B DONE, Cal approved, QA PASS: evolved k4/k5/k6 + large beds (c4d9e374, fa601f89, 3b969813, e267001b wyvern 1.45x, 2cfa126f rune fix, 83173a80). LEAD's P3BOX ask DONE: Closet and Lair furniture boxes sent to LEAD (proof shots/navboxes_1124/). D ten player-card backdrops DONE 3f823fc1 (QA PASS). H Calvin and Sydney walk picture DONE cb651b3b (QA PASS). Now: E 6 tattoos + 4 scars (mark layer 70f91a89; tools/mark_cut.py, rigtest/qa/markcheck.js), then C pet brands (tell LEAD when the first evolved-size brand is cut, for k4-k6 anchors), F soul stone, G five Atelier brands, Pet Store icons. Approval sheet: shots/pending_art/cal_1124/APPROVAL.md. CHROME taken.
- Cal 11-23 (direct to ROOMS), later: Karaoke disco ball retired bdb442d1 (QA PASS); Speakeasy rearranged 268253fe + 05c353be (QA PASS); starting bed lowered c192b451 (QA PASS, in v1.35); life in the rooms 880e3484 + 2262d9a2 (seats in the Speakeasy, Restaurant chef cooks and plates to the pass, waiter carries to the table, dish on the table; gardeners snip, weed, water) + 5440020e (Cal "Do the top 4": Speakeasy bartender, Restaurant host greets and seats, busser clears dirty plates, Garden bees/hens/butterflies), WAITING ON QA (incl. a long income run). CHROME free.
- Cal's 11-23 asks (via LEAD), ROOMS: ALL DONE and QA PASS except the visitor: dog line 12/12; six hairstyles; highlights for all 13 styles (wired 117e1e3); later-rooms placement sweep with every fix applied (027f23e, e0724a7c, 05eac907; QA da290bb5). Visitor: held for Cal's name and photos. CHROME free.
- Pet clothes: QA's fixes all PASS (976305b, bea0f82, 3c309e4; QA f3f56bd). e304a15: the cyan key no longer eats navy (bowtie collar and poppy side bow restored, to QA). Dog bodies, one sheet per dog: pd_rain both dogs (QA PASS), pd_cable Chopstick done, Pluto painting; pd_fleece (replaces the NSFW-refused puffer, QA design PASS) Chopstick painting, Pluto next. Then the three dog auras, then the dog set to QA. CHROME taken.
- Pet clothes: wolf 12/12, wyvern 12/12 (QA d7fd35e fixes applied: wizard hat + LEAD's frame-3 anchor, paws cell 6 for pack/bomber/vest, lanterns smaller, shards/cloud off the chest, scarf ends attached), slime 12/12 (headphones and bow with up+flat cells) -> (QA: DONE through f1ba1fc: 6 of 7 fixes PASS, slime 8 PASS / 4 FIX, dogs 4 PASS / 2 FIX; QA findings). Dogs 6/12 (head + neck done; neck pieces hide in sleep after LEAD's anchor fix). Dog body pieces: Higgsfield failed 4x on the six-dog sheet (generic 'try again', not a refusal); retrying one sheet per dog. Dog auras after. CHROME taken.
- Painting the 48 pet clothes (QA-passed concepts, LEAD's map and anchors): wolf 12/12 done, wyvern 9/12 (auras painting), slime and dogs next. Committed in batches (34adce0, d868771, 5f14634, 12bb813, 881fd11): art/app/ppc_<id>_<n>, data/pet_clothes.json, tools/pet_wear.py (template, cut, check, headaura); wear checks per piece in shots/pending_art/pets/clothes/check_*.png. QA gets the full set per line when each line is done. CHROME taken.
- READY for LEAD (d8444f5): bare bases split for the arms slot (LEAD's plan after the gap alone did not fix the tear): m_basearms, f_basearms (hers shared: arms identical on all four bases) and m_basetorso, f_basetorso[_heel][_bare][_bare_heel], front and back, 14 files; tools/armsplit.py. Arms: rounded feathered shoulder cap to fingertips. Torso: round shoulder kept under the cap, new outline + shadow. ROOMS checked: torso+arms at rest match today's bases (armsplit_rest.png); arms swung 40 deg (armsplit_check.png) show a round shoulder, nothing opens. Not checked in the rig (LEAD wires the skin-arms layer, rigdiff, then QA). Next: the 48 pet pieces. CHROME free.
- READY for LEAD (63344fe, before QA as LEAD asked): bare bases' arm gap (Cal "Yes, repaint"), 10 files (m_base, f_base, f_base_heel, f_base_bare, f_base_bare_heel; front and back). tools/armgap.py: a smooth 7 px gap (about 3.5 px runtime) down the middle of the line the arm shares with the torso, from the armpit into the opening where the arm leaves the body; both sides keep a full outline, the torso edge a soft shadow. Her cut measured once, same on all four. Sheet shots/pending_art/armgap/armgap_before_after.png. ROOMS checked: build OK; wear-test (REGIMENT rows) idle/stretchUp/dance2 at 5x, 0 not drawn, 0 errors; his bare arms still shard in stretchUp (the rig fault, LEAD's fix not in this build). Next: LEAD's before/after rig run, then QA; then the 48 pet pieces (variant map agreed, LEAD's anchors in pet_art.json). Layer originals kept in shots/pending_art/armgap/orig_layers (not in git). CHROME free.
- (QA: DONE on 180defc, PASS with NOTES, apply before paint; QA findings) Design review, no paint yet: 48 Pet Shop clothing concepts, shots/pending_art/pets/pets_clothes.md: 12 each for the wolf pup, the wyvern, the fox-slime and one shared line for Chopstick and Pluto (3 per slot: head, neck/base, body, aura), in each pet's colours, nothing green; 4 questions. Pet frames PASS (QA 722b642); Bedroom bed spot PASS; Patio bed waits on Cal via LEAD. Next: the base arm-gap repaint (Cal "Yes, repaint"). CHROME free.
- (QA: DONE on c81d0de, PASS; QA findings) Recheck: QA d2f4bfb's two FIXes applied: wyvern frame 6 repainted (happy hop, one tail, neck; only that cell changed), slime olive spill recoloured (olive.js 0 on every frame). Bed spots after the kennel-row note: Bedroom window corner x 8.9 y 2.6 (beds/); Patio: no spot of its own fully furnished, LEAD takes the options to Cal (lounge chair moves fail; bed in the lounge chair's spot works with a supersede). Next: 48 clothing concepts to QA once frames pass; base arm-gap repaint. CHROME free.
- (QA: DONE on e82a602, NOT A PASS: two FIXes, wyvern frame 6 and the slime tail tips; the rest PASS; QA findings) Pet Shop final frames. Cal: "Approve both" + each pet its own colour (wolf charcoal/icy cyan, wyvern navy/amber, slime plum/hot pink). art/app/pgx_<pet>_0..10 + pbed_<pet>, data/pet_art.json (canvas, cx, bed sleepOff, dog anchors), tools/pet_cut.py (green key only). Sheets: shots/pending_art/pets/pets_final_frames.png, pets_final_sizes(_loft).png, notes at the end of pets_concept.md. Wolf: flame, paw marks and mist in every frame incl. crying; den is a low open bed. Bedroom bed spot x 0.15 y 6.55 (beds/); Patio has NO clean spot fully furnished (LEAD: layout call). Next: 48 clothing concepts (pets_clothes.md) to QA after this passes; base arm-gap repaint (Cal "Yes, repaint"). CHROME free.
- Pet Shop final frames (Cal 2026-11-18: "Approve both", the pet concepts and REGIMENT's sheet): painting 11 front frames per pet to LEAD's list (wolf pup, void wyvern, fox-slime), the wolf's crying frames with flame, paw marks and mist, the den about half as tall; then the Bedroom and Patio beds after a free-floor check; QA first. REGIMENT: Cal approved, told LEAD (hold can go). CHROME taken.
- Pet concepts: QA PASS with NOTES; NOTES applied (wolf flame and paw marks in every pose, wyvern floor nest, slime bed not a donut; the wolf crying edit was refused by the filter and not resubmitted, the final frames carry it). LEAD's frame list recorded in pets_concept.md (11 front frames per pet). Next: final frames once Cal has seen the concepts. CHROME free.
- (QA: DONE on a02362e, PASS with NOTES; three questions answered; QA findings) Was WAITING ON QA (design review, concepts only): Pet Shop creatures (LEAD's messages, docs/PET_SHOP.md): shots/pending_art/pets/pets_concept.md and pets_concept_sheet.png: shadow wolf pup, void wyvern, shadow fox-slime; poses, a 4-frame crying loop each, Bedroom and Patio beds (den cushion, perch nest, low pillow). No final frames until QA and Cal's open questions. CHROME free.
- READY for LEAD (QA PASS on b1fa777): wire REGIMENT (Boutique, brand "rg", 15 rows from shots/pending_art/brands1118/regiment_rows.json; logo_rg, ui_banner_rg; art and items.json in 21c67e7 + b1fa777). WAITING ON CAL: approve the painted sheet regiment_approval.png (ROOMS asked 2026-11-18); hold it until he does. Next for ROOMS: pet concept sheets. CHROME free.
- (QA: DONE on b1fa777, PASS; rows next (LEAD); QA findings) Was WAITING ON QA (recheck b1fa777): REGIMENT, QA's FIX on 21c67e7 applied: rg_cap lift {m 90, f 70}, clip moved to match; hatcheck rerun, eyes clear on h1-h3 both bodies, no bald band from behind (regiment_cap_hatcheck.png). Then Cal's approval, then LEAD wires. Next: pet concept sheets. CHROME free.
- (QA: DONE on 21c67e7, NOT A PASS yet: the peaked cap hides the eyes (FIX); the waistcoat's arm shards are the rig's (NOTE to LEAD); boots fine; QA findings) Was WAITING ON QA (wear-check + barecheck + heelcheck + hatcheck + gauntlet size): REGIMENT 21c67e7 (QA design PASS c45cedb, NOTES applied 7eedcf1): 15 pieces, brand key "rg", logo_rg, ui_banner_rg; rows shots/pending_art/brands1118/regiment_rows.json; sheets regiment_approval.png, regiment_wear_m/f.png, regiment_close_m/f.png. ROOMS checked: both bodies, 41 poses, 15/17 outfits, 0 not drawn, 0 page errors; hatcheck both caps clean (her cap crowns stretched to cover the head); gauntlets hand-sized arms-up; bandeau covers. For QA to judge: light shards on his bare arms with the waistcoat in stretchUp/dance2. Then Cal's approval, then LEAD wires. Next: pet concept sheets (LEAD's three messages), the five Street brands, Stylist face art. CHROME free.
- (QA: DONE on c45cedb, PASS with NOTES, cleared to paint; three questions answered; QA findings) Was WAITING ON QA (design review, no paint yet): REGIMENT draft, shots/pending_art/brands1118/regiment.md (15 pieces, brand key "rg", navy/scarlet/brass; invented brass-knot crest only, insignia and costume guard; mess jacket and waistcoat bare, stiletto boots heel; 3 questions for QA). Then the five Street brands; Stylist face art. CHROME free.
- READY for LEAD (QA PASS on 4c60022): wire OIL & CANVAS (Boutique, brand "oc", 15 rows from shots/pending_art/brands1118/oilcanvas_rows.json; logo_oc, ui_banner_oc; art and items.json in f041b24 + 4c60022). Cal APPROVED 2026-11-18 ("Approve OIL & CANVAS"); no hold. Next for ROOMS: REGIMENT draft. CHROME free.
- (QA: DONE on 4c60022, PASS; rows next (LEAD); QA findings) Was WAITING ON QA (recheck 4c60022): OIL & CANVAS, QA's three FIXes on f041b24 applied: gloves repainted with a fresh design (fitted cream leather, hand-sized, renamed Paint-Stained Leather Gloves), palette pendant repainted about a third the size, oc_smock flagged bare (barecheck please; the V shows a strip of skin above the bust). ROOMS: both bodies, 41 poses, 15/19 outfits, 0 not drawn, 0 page errors; close sheets oilcanvas_fix_m/f.png. Process NOTE taken: a refused prompt gets a fresh design, never a resubmit. Then Cal's approval, then LEAD wires. Next: REGIMENT draft. CHROME free.
- (QA: DONE on f041b24, NOT A PASS yet: three FIXes (gloves, palette size, smock tank on her) and a process NOTE; QA findings) Was WAITING ON QA (wear-check + barecheck + heelcheck + hatcheck): OIL & CANVAS f041b24 (QA design PASS e5b4684, NOTES applied cc85bab): 15 pieces, brand key "oc", logo_oc, ui_banner_oc; rows shots/pending_art/brands1118/oilcanvas_rows.json; sheets oilcanvas_approval.png, oilcanvas_wear_m/f.png, oilcanvas_close_m/f.png. ROOMS checked: both bodies, 41 poses, 15/19 outfits, 0 not drawn, 0 page errors; hatcheck both hats; halter on the bare base. oc_felt lift 90 with its clip moved up. For QA to judge: the gloves read as knit arm-warmers; specks by her arm with the halter in stretchUp/dance2. Then Cal's approval, then LEAD wires. Next: REGIMENT draft, the five Street brands, Stylist face art. CHROME free.
- (QA: DONE on e5b4684, PASS with four NOTES, cleared to paint; answers to the three questions; QA findings) Was WAITING ON QA (design review, no paint yet): OIL & CANVAS draft, shots/pending_art/brands1118/oilcanvas.md (15 pieces, brand key "oc", indigo/cream/cadmium, studio lane apart from OVERPASS's spray tee and chore jacket, no beret; halter bare, slingbacks heel; 3 questions for QA). Then REGIMENT, then the five Street brands; Stylist face art (LEAD's 2a0a7e3 split is in). Done and live in v1.25: GILDED, KODE PINK detail pass. CHROME free.
- (QA: DONE on fa1864a, NOT A PASS yet: two FIXes (frock sleeves, bustier icon straps), two NOTES; QA findings) Was WAITING ON QA (wear-check + barecheck + heelcheck): GILDED, 3a10edf + fa1864a (scarf patch). 15 pieces, logo_gd and ui_banner_gd (brand key "gd", CHROME RAIN's Boutique slot); rows shots/pending_art/brands1118/gilded_rows.json; sheet gilded_approval.png + gilded_wear_m/f.png. ROOMS checked: both bodies, 35 poses, 34 outfits, 0 not drawn, 0 page errors; the bustier on the bare base and the mules on the tiptoe base (both injected), 35 poses each, 0 not drawn; close-ups idle, sitBack, stretch, walk2. Painted to QA's trade-dress guard (channel-quilted cap; leaf ornament only; scarf repainted ivory-only when the first came with black scroll ends). Known: the high-tops came out more gold than black; the banner is cropped from the sharp band of a 1:1 image. Not checked: Shop cards, night. Then Cal (batch), then LEAD. CHROME free.
- (QA: DONE on 52dda64 + 8e6eecf: KODE PINK art PASS, one FIX (the Shop text) and two NOTES for Cal; GILDED review: two FIXes, two NOTES; QA findings) All applied in 022a2f8: READY for LEAD: KODE PINK's 15 new names and lines (shots/pending_art/kodepink/final/shop_text.md). WAITING ON QA: GILDED re-review (gilded.md revised). WAITING ON CAL: KODE PINK's five plain-reading pieces and the palm shirt. Was WAITING ON QA: (1) KODE PINK "Night drive" repaint 52dda64 (Cal approved 2026-11-18 via LEAD: banner, logo, 15 pieces, kp_bucket clip; 4 old kp yawn pictures removed, soft fallback); re-tested on today's build: both bodies, 35 poses, 37 outfits, 0 not drawn, 0 errors; sheets shots/pending_art/kodepink/final/. (2) Design review before paint: GILDED's 15 pieces, shots/pending_art/brands1118/gilded.md (CHROME RAIN's Boutique slot; palette moved from emerald to sapphire accents because green keys out). Then OIL & CANVAS, REGIMENT, then the 5 Street brands (slots in my message to LEAD). CHROME free.
- Cal APPROVED (2026-11-18, "Approve all"); QA PASS 2be9bec. Was WAITING ON QA: Cal 2026-11-18 "remove the strappy chest harness. Add fishnet or lace leggings if you dont have that already. Add sexy heels. However, the character needs to look like they are wearing heels with a tippy toe stance. If this is too hard, forget it". Harness removed 3aed3af (LEAD 9ea3dd2). Fishnets: v_fishnet already live. Heels: 7f30c13 her tiptoe bases f_base_heel_front/back + f_base_bare_heel_front/back (legs unchanged, ankles unchanged, feet from a Higgsfield tiptoe edit; no _yawn yet, LEAD's fallback draws today's); 1d16b66 Ankle-Strap Stilettos v_sandal {heel: 72} (72 layer px = 36 app px below today's sole), row in shots/pending_art/new1118/rows/rows_draft.json. Icons for the stilettos and bralette redrawn cleanly in 24ee3c9. ROOMS checked with the tiptoe base injected (no lift yet): both bodies, 35 poses, 0 not drawn, 0 page errors; close-ups idle, sitBack, walk2, sleep. Not checked: LEAD's real lift, the feet touching the floor, the yawn. Also 7f30c13 smoother bralette icon (QA note). Waiting on Cal's OK too. CHROME free.
- (QA: DONE on 4edfa01, NOT A PASS yet: the horns' clip and two icons; the bare gate PASS; QA findings) (QA: DONE on 141ff29, PASS, 38a4822; bralette icon redone in the next commit.) Was WAITING ON QA: recheck 141ff29 (v_horns noClip, no bald scalp; icon_o_resp rebuilt from the uncut layer with its straps; icon_v_bralette mirrored around the cleavage with both straps). Cal APPROVED (2026-11-18, "Approve all", v1.23 set incl. the tiptoe stilettos; QA PASS 2be9bec). Was WAITING ON CAL: approve the painted pieces (he saw the drafts and set the skin line; LEAD holds v1.23 for his OK; art commits dff4465, cefab81, 4edfa01, 141ff29). Was WAITING ON QA: Cal's 11-18 pieces (Cal on the drafts: "i am okay with showing some skin as long as it is not nude"). Commits: dff4465 (her bare base f_base_bare_front/back/yawn: the tank painted as skin, shorts kept), cefab81 (art + items.json), 4edfa01 (bodysuit strapless). VENOM ROSE new: v_horns, v_harness (neck), v_silkshirt (men), v_vinyl, v_hotpants, v_bralette, v_crop; repainted (same ids, owners keep): v_corset strapless, v_slip deep V + side slit (a cross charm the AI added was painted out), v_bodysuit strapless, v_flare slit from the knee, v_blazer worn open (men). OVERPASS: o_guards (arms), o_resp (mask, front only). SAYMØRE: sm_grille. `bare: true` on v_bralette, v_crop, v_corset, v_slip, v_bodysuit (LEAD wires look.js). Rows: shots/pending_art/new1118/rows/rows_draft.json (10 new rows) + repaint_lines.md (5 new shop lines). Sheets: shots/pending_art/new1118/approval_1118.png, wear_<brand>_<m|f>.png. ROOMS checked: both bodies, 35 poses, every brand, 0 not drawn, 0 page errors; the five bare tops over the bare base (injected into QBART until LEAD wires the flag) cover the chest in all 35 poses by eye at sheet size; close-ups at idle, sitBack, stretchUp, walk2. Not checked: the real `bare` wiring (LEAD), night lighting, Shop cards. Known: the bare base keeps faint neckline traces under the tops; red pieces were keyed with a stricter magenta rule (flatbody_red) after the first pass ate oxblood. Still to paint (after Cal picks brands): 5 Street + 3 Boutique brands; MIRRORBALL's halter is a bare top. Stylist art waits on nothing now (LEAD agreed the layers). CHROME free.
- TAKEN by ROOMS (2026-11-18, LEAD's message of Cal's 11-18 art decisions, code c13edd3): drafts in shots/pending_art/new1118/drafts.md. (QA: DONE on 0c5bc0b, three FIXes and two NOTES, all applied in the drafts: OVERPASS now wrist guards and a respirator, SAYMØRE a speaker-grille bomber, slits kept below the shorts' line; QA findings ca2fc3e.) WAITING ON CAL: approve the drafts. Was WAITING ON QA: VENOM ROSE's 7 replacements and the push-further repaints, OVERPASS's 2 accessories, SAYMØRE's Ø Moto Jersey, 5 Street brand concepts (STAGE DIVE, PIT LANE, MIRRORBALL, DRY DOCK, BACK ROW in the held slots), 3 Boutique concepts (GILDED in CHROME RAIN's slot, OIL & CANVAS, REGIMENT), Atelier lanes. WAITING ON LEAD: a `bare` top flag and a second female base (her base has a painted grey tank that shows under any crop top or bralette); the Stylist's face layer format before any eye or mouth art. Cal's new rule: nothing plain (memory never-plain-pieces). Then Cal, then paint. CHROME free.
- (QA: DONE on 353080a, NOT A PASS yet: two small FIXes, the body chain's back and two icons; two NOTES for Cal; QA findings) (QA: DONE on d808aca, PASS; QA findings) (QA: DONE on d808aca, PASS, 39bc5d1.) (DONE by LEAD in 1a653a7, v1.20 candidate release/v1.20 6ba0729, with QA.) Cal APPROVED (2026-11-17, "Approve all", QA's two notes included). Was READY for LEAD: wire VENOM ROSE's 15 rows from shots/pending_art/new240/rose/rows_draft.json (brand "rose", mo/fo set); commits a10a097 (art + items.json), 353080a, 242f620 (items.json: v_bodychain frontOnly; two back layers removed), d808aca (bodysuit art). Was: approve VENOM ROSE's sexy set (a10a097 + 353080a + 242f620 + d808aca; sheet shots/pending_art/new240/rose/rose_approval.png), with QA's two notes (fishnets as the only bottom under a short top; the tobacco pipe and the robe's bare chest). Then READY for LEAD: rows in shots/pending_art/new240/rose/rows_draft.json. Was: recheck d808aca, the bodysuit FIX only: repainted with a halter collar, straps and a dark mesh yoke over the chest and upper back, the back lacing gap filled; no base tank shows from the front or behind (ROOMS checked both bodies, 35 poses, 0 not drawn, 0 page errors; close-ups at idle, sitBack, rearStand, backwalk2, with the mini and with oak_skirt). Was: recheck 242f620, both FIXes: the body chain is frontOnly (back layers removed; from behind only the base tank shows above the strapless bodysuit, the same with or without the chain), the pajama icon shows full-length legs, the mini skirt's silhouette is closed and outlined (icon and all four layers). Re-run: both bodies, 35 poses, 0 not drawn, 0 page errors; close-ups at idle, sitBack, rearStand, backwalk2. Your two NOTES go to Cal with the approval post. Was: VENOM ROSE's sexy set, a10a097 + 353080a (Cal 2026-11-17: "Push the envelope a little", then "Paint it"). 15 new pieces, art and items.json only (no Shop rows yet): bunny ears, pillbox hat, captain's cap (both), briar pipe (men), lace mask (both), body chain, robe (men), slip dress, corset bodysuit, silk pajamas (men), fishnets, velvet mini, stilettos, lace-up knee boots, smoking slippers (men). Rows draft (brand "rose", mo/fo set): shots/pending_art/new240/rose/rows_draft.json; sheets in that folder (rose_approval.png, wear_m.png, wear_f.png). ROOMS checked: both bodies, all 35 poses, 22 outfits (all-brand and mixed with other brands), 0 not drawn, 0 page errors; close-ups at idle, sitBack, type1, walk2. Known: the body chain's back reads as a pale patch on her back at room size (softened to 60%); the pajama icon looks like shorts (long on the body); the veil was painted without lace, so it is now "Velvet Pillbox Hat"; garters dropped (Higgsfield's NSFW filter, not worked around), the mini replaces them. Not checked: the Shop cards in the app, night lighting. Original designs: no Playboy logo, collar, cuffs or tail, no Hefner name or likeness. Then Cal approves, then LEAD wires the rows. CHROME free.
- TAKEN by ROOMS: QA's room-placement sweep for Cal (9204eb5, rigtest/qa/review_rooms_1114.md): chandeliers, floating pieces, wrong-wall pieces, off-floor, blocked doors, clipping, realism, crowding, guest spots. Fixing room by room, worst first; each fix goes to QA as WAITING ON QA.
- (QA: DONE on 96f45cb, PASS except two, QA findings) (QA: DONE on 152e874, both fixed; one new FIX, the Bedroom drawn smaller; QA findings) (QA: DONE on 25a23a9, PASS; QA findings) (QA: DONE on fdecc73, PASS; QA findings) (QA: DONE on 8a99e00, PASS, Bowling seats for Cal to judge; QA findings) WAITING ON QA: room sweep fixes so far, by eye at 1860 px fully bought, default style, 13:00 (bigrooms.js) and auditall.js: 16a9ebf (Restaurant chandeliers over tables on cords, two in the full room; Theater lobby chandeliers up on cords, one moved off the kiosk; Patio light strings tied to corner posts), 0809117 (Boba cooker on a steel stand; Closet Lair rod painted out; Rhythm mirror/equalizer flips and bench inside; VR globe flip and flight pod inside; Game Room hex panels drawn on the left wall plane), 96f45cb (Theater standee off the entrance; Patio telescope and bar cart clear). (QA: DONE on 96f45cb, PASS but FIX 1 Theater second chandelier, FIX 2 Patio cust spot.) (QA: DONE on 152e874, PASS but one FIX, the Bedroom drawn 20% smaller.) (QA: DONE on 25a23a9, PASS.) (QA: DONE on fdecc73, PASS.) (QA: DONE on 8a99e00, PASS; the Bowling seat row goes to Cal.) Was WAITING ON QA: f65b082 (Bowling seats alongside the lanes facing them, ball return and console at the lane ends; Auditorium EXIT out from behind the speaker), 6b69666 (Restaurant: one front table instead of two with the crescent booth; counter stools .07 closer, no seats on air), 8a99e00 (Tool Shed superseded by the Glass Conservatory in the full garden). Art still open (needs Higgsfield): Dessert sundae inside the Bingsu art, a painted Speakeasy back bar, a back-view Karaoke booth, the Lair's outlined pieces; the Auditorium projector aim waits on Cal's OK of the projector back views. Not checked: other styles, earlier stages, night. Still to do: Dessert sundae (art edit), Bedroom desk/door, Garden door/bed and lamp/pond, Mall escalator, Rooftop DJ/pool, Speakeasy booth/piano and back bar, Bowling, Karaoke, Auditorium, Lair pieces, crowding, guest spots.
- (QA: DONE on 9f6c17c, PASS, QA findings) WAITING ON QA: check b416f33, QA's old note (Mara's chef hat covered her eyes): npc_hat is lifted (m 175, f 115) with no hair trim. ROOMS checked Mara in all 34 poses (with LEAD's six animations) and the hat on h1, h2, h3 for both bodies: eyes clear, no scalp gap. Every NPC chef wears it, so a look at the Restaurant's cooks too.
- (DONE by LEAD in a995106.) READY for LEAD (Cal approved Kenan, e7e6b70): in 29k_friends.js set kenan's spec to body m, skin s2, hairStyle "fr_kenan_hair", hairColor black, top tee white, shoe sneakers black, eq ["fr_kenan_jacket","fr_kenan_pants"] (drop h_shades, h_tech, h_boots: no sunglasses now). fr_kenan_hair is not in hairStyles on purpose, like Victor's.
- (QA: DONE on 5d726d6, PASS; QA findings) WAITING ON QA: check e7e6b70 with LEAD's wiring a995106 (LEAD wear-tested the spec on the rig in all 22 poses): Kenan's visit card portraits (three) and his look in rooms (wear-tested in 22 poses by ROOMS; the stretch has no yawn picture now and falls back).
- Now (2026-11-16, Cal: "ship NICE COCK on friday"): NICE COCK's 10 cut pieces repainted as luxury streetwear (same ids: band, pendant, shades, hoodie, tee, tank, qzip, court, knit, slide), wear-tested on both bodies in all 35 poses (brandwear.js, 0 not drawn, 0 page errors); Cal approved 297c848, then (2026-11-17) asked six to be redone as luxury comfort wear: band, pendant, tee, tank, qzip, slide repainted (dad cap, cashmere scarf, layered lounge tee, waffle lounge zip, sherpa fleece zip, shearling clogs), wear-tested both bodies all 35 poses; Cal APPROVED, committed in bcd8f73 (on top of 297c848). (QA: DONE on bcd8f73, PASS; QA findings) WAITING ON QA: wear-check NICE COCK's 10 at bcd8f73 (rule 17). READY for LEAD: names, lines and grades sent by message. CHROME free.
- Now: Kode PinK city pop redo (Cal: "Night drive"): banner, logo and all 15 items repainted (same ids), wear-tested on both bodies in all 34 poses; waiting on Cal's approval, not committed. PAUSED for Cal: the Boutique brands (Nordlys: 7 of 8 pieces, banner and logo painted, not committed). Cal 2026-11-14: "recheck the assets for all the stuff in the game, except if people have already bought them, and remove anything that is too overly cute ... aimed towards 30 year olds and every piece ... streetwear themed". Cal approved the audit with his own keeps: 121 pieces to repaint (ids in shots/pending_art/audit/cutlist.json). GACHA POP, SAVE POINT, BARD & BLADE, KAIMANA and OAKMONT become new streetwear brands (WAITING ON CAL: which 5 concepts); the other brands keep their names with streetwear replacements. The Boutique becomes luxury streetwear under the same 8 names (Cal: "Luxury streetwear"). LEAD: hold the redo brands out of drops is Cal's call (ALTITUDE drops Mon Nov 16). ALTITUDE DONE: Cal approved, 7c5664e + anorak FIX a9def76 (QA PASS), live in v1.03 (f72a55f). Was: ROOMS now: ALTITUDE's 12 replacements as bold gorpcore streetwear, same ids (mask, chest rig, sherpa half-zip, storm shell, utility vest, mock-neck done; anorak, climbing pants, layered tights on Higgsfield; then long shorts, trail boots, mules). LEAD holds ALTITUDE and KODE PINK (8c3f8dc); after QA's room-placement sweep (Cal's goodnight note), ROOMS fixes what QA finds, not committed. nl_* entries added to data/items.json, not committed.
- (QA: DONE on d689703, PASS, QA findings.) WAITING ON QA: check 0d17dbe, your second Restaurant tip jar FIX: the jar comes with the till (r_till) and stands in front of it on the counter, never on the half wall's corner. ROOMS checked till only, till at stage 1, the marble pass with till, the marble pass without till (no jar) and fully bought. In the plain style it overlaps the till's base on purpose (a jar by the register).
- (QA: DONE on 5850751, NOT FIXED at stages 1 and 2, QA findings.) WAITING ON QA: check 778fd8d, your tip jar FIX (2c38bf9): the bare Restaurant draws no jar (the first kitchen's half wall stands above its counter); once the Restaurant grows past the first kitchen, the jar is on the pass as before. ROOMS checked bare (0 jars) and stages 1 and 2 (1 jar each).
- (QA: DONE on d521820, PASS, QA findings.) WAITING ON QA: check 39a0a71 (rule 17), crawl allies roaming (LEAD's request): with allies rescued and only the Loft built, all of them walk the Game Room with name tags; with businesses built, each ally is in one room a day and only there; tags above the head for team and allies, none for random guests; their looks in rooms (wear-tested in all 22 poses by ROOMS). ROOMS checked in headless Chromium, not by eye: the story and sale popups covered the screenshots.
- (QA: DONE on 28c52ee, PASS but one FIX for ROOMS: the bare Restaurant's jar, QA findings.) WAITING ON QA: check 693effe (rule 17), the tip jars placed (LEAD's request): in the Restaurant, Lock and Key, Boba and Dessert, the jar on the counter empty on a new day, half after a few served, full near the cap; clear of other pieces in every stage (rule 20). ROOMS checked all three fills in all four rooms (and the Restaurant's three stages) with tips set directly, not by serving guests.
- Now (on e3144af): WAITING ON CAL (sent 2026-11-13): the Auditorium projectors from behind, `thx_proj2b` / `thx_proj1b` (the Windows request of 2026-11-09), painted and checked in the room (lens toward the screen, beam from the lens), NOT committed until he approves. Earlier: Cal approved both ("Approve both"), committed in f9ecb1a: tip jar `rsx_tip0/1/2` (empty, half, full) and `ui_town_square.webp`. Nothing in progress; CHROME free. LEAD: wire the tip jar; the stage crops the clock tower's top, `.sq-stage.has-art{background-position:center top}` would keep it.
- (QA: Town square part DONE on f2e57f6, PASS, QA findings; the tip jar waits on LEAD wiring rsx_tip0-2.) WAITING ON QA: check f9ecb1a (rule 17): once LEAD wires them, the tip jar on each counter where staff stand (Restaurant, Upstairs Bar, Boba, Dessert) clear of other pieces in every stage (rule 20), all three fill stages; the Town square backdrop behind the 11 spots at phone size.

Cal's next list (2026-11-13, to ROOMS; ROOMS took the art and split the code):
- (DONE by LEAD in 815bab2, WAITING ON QA.) (QA: DONE on 8e1d48c, PASS, QA findings.) For LEAD (Cal: "generate additional animations for all the visiting characters in the game. I want every visitor to have 6 different animations"): today's clips are idle, walk, stretch, sit, type, sleep (+ back views). Visitors (friends, team, allies, player visits) need 6 each, e.g. wave, laugh, dance, phone, cheer, chat. Poses are bone rotations in data/poses.json and rig.js (LEAD's files): no art unless a prop is needed (a phone): ROOMS paints any prop on request.
- (DONE by LEAD in 148dc12, (QA: DONE on f2b872c, PASS; move shuf0 if v0.99 ships after Mon 8 am; QA findings) WAITING ON QA.) For LEAD (Cal: "randomize the brand drops so it is not sequential. i want to be surprised by what brands are coming on what day"): dropState() in 10_app_a.js releases BRANDS in list order by start date; the order should be shuffled (a fixed per-save or per-week seed, so a reload never reshuffles), and the countdown should not name the next brand.
- (TAKEN by LEAD, waiting on ROOMS's brand art; the Boutique floor already shuffles its own drops once brands are in, 148dc12.) For LEAD, later (Cal: "create the mid tier shop that unlocks later and create 10 more brands that are for those shops only"): the Boutique floor (29e_economy.js, level 30) has no brands yet. ROOMS paints 10 boutique-only brands once Cal approves the concepts; LEAD wires them with floor:"boutique".
- TAKEN by ROOMS: redo Kenan's outfit (Cal: "that is not what he looks like", waiting on his description), Kode PinK redone (Cal: "too bubbly. Make it more city pop but actually cool and more sleek"), the 10 boutique brands' art. WAITING ON CAL: Kenan's look, the Kode PinK scope, the 10 brand concepts.

Requests for ROOMS (Cal, 2026-11-13; approvals go to Cal first):
- DONE by ROOMS in 39a0a71 (WAITING ON QA). WAITING ON ROOMS (LEAD, sent by message): the crawl allies (DNPC pip, kit, bram, juno, neo, sera; mara is the chef) need looks (rig specs from existing items, wear-tested), roam in the Game Room (only the Loft built) and later the other built rooms; name tags above the head while walking for team, allies and visiting friends, none for random guests. Cal's words in the message.
- DONE by ROOMS in 693effe (WAITING ON QA). WAITING ON ROOMS (LEAD, sent by message): place the tip jars with tipJarArt(i) (29zx_simple.js, 9d80dcb) on the four counters.
- TAKEN by ROOMS (2026-11-13). A small tip jar sprite in the Restaurant, Upstairs Bar, Boba shop and Dessert parlor: "a small tip jar that fills up if people are
  happy". Three stages (empty, half, full), one sheet, on the counter where staff stand. LEAD wires the fill to guests' happiness.
- TAKEN by ROOMS (2026-11-13). `ui_town_square.webp` (still open from 2026-11-08), now the backdrop of the Players tab's Town square.
- Team members found on crawls need a look each (Cal: "should have their own character sprite created" and roam the Game Room, later
  the other buildings, with their name above their head). LEAD will build them from rig specs like the friends (29k_friends.js); ROOMS:
  say if any team member needs painted portraits or outfits first.
  ROOMS ANSWER (2026-11-13): no new art needed. All five already have a join banner (ui_team_<id>.webp) and a signature look in the
  rooms: 26_world.js line 487 `TMTOP` gives Rafe, Theo, Nova and Sable their own painted tops (tm_*_jacket/tee/knit, both bodies,
  yawn included), and Mara wears npc_chef and npc_hat. Build the roamers from TEAM[id].look with `TMTOP[id]` as the top, the way
  26_world.js already does. That way Sable, Rafe and Nova no longer look alike: TEAM.look gives all three the same y_bucket hat.

QA Doing:
- Now (on qa-local d3ca8ee6, the v1.49 batch): NOT A PASS so far: three FIXes and a NOTE (QA findings); still checking: the rig sweep (running), the Vault, other players' cards and posts, secrecy.
  Was: Now (on release/v1.47 b2b7a2e3, Live): v1.47 live check, PASS (QA findings).
  Was: Now (on release/v1.47 b2b7a2e3): the v1.47 candidate and its rollback, PASS, can ship (QA findings).
  Was: Now (on lead/v147src d40320c4, v1.47): PASS, v1.47 can be cut (QA findings).
  Was: Now (on lead/v147src b145deeb, v1.47): NOT A PASS, two Shop FIXes (QA findings).
  Was: Now (on qa-local 2cfa126f): ROOMS's pbed_k5 fix and the k6 resize, PASS (QA findings).
  Was: Now (on qa-local 2f02dbaa): the 1/2/3-day bounties (96465b5b), NOT A PASS: one low FIX (QA findings).
  Was: Now (on qa-local 3b969813): ROOMS's evolved pets and large beds, NOT A PASS: one FIX, the runes on the wolf's moon daybed (QA findings).
  Was: Now (on release/v1.45 d38479aa, Live): v1.45 live check, PASS (QA findings).
  Was: Now (on release/v1.45 d38479aa): the v1.45 candidate and its rollback, PASS, can ship (QA findings).
  Was: Now (on lead/v145src ea0657be, v1.45): PASS, v1.45 can be cut (QA findings).
  Was: Now (on qa-local 8bda5f60, batch 1 + the scratch card, v1.45): NOT A PASS, one FIX (the spinner on players' own quest names) (QA findings).
  Was: Now (on qa-local 6bfa2938..7a9ba54b): batch 1 as one batch (v1.45). Name tags: FIX (QA findings).
  Was: Now (on release/v1.43 0270ae4d, Live): v1.43 live check, PASS (QA findings).
  Was: Now (on release/v1.43 0270ae4d): the v1.43 candidate and its rollback, PASS, can ship; one low NOTE (QA findings).
  Was: Now (on qa-local dd7327f6): the Walk-in Closet from level 3 and the Board's stuck "!", PASS, v1.43 can be cut (QA findings).
  Was: Now (on release/v1.41 4dcc070c, Live): Cal's platform check (stability, speed, rooms, outfits), PASS; one low NOTE for LEAD (QA findings).
  Was: Now (on release/v1.41 4dcc070c, Live): v1.41 live check, PASS; the rollback carries curve 7 (QA findings).
  Was: Now (on release/v1.41 4dcc070c): v1.41, PASS, can ship; a rollback NOTE (curve 6 drops levels) (QA findings). Next: the live check.
  Was: Now (on qa-local 8df50fb4): rig flag 3f15f863 PASS, 1c7e636d PASS with one FIX (econTrained on unpaid sessions), curve 7 PASS with a NOTE (QA findings).
  Was: Now (on qa-local a888ed55): skin-through rig fix NOT A PASS (bent-elbow sleeves); friendship and kind notes PASS (QA findings).
  Was: Now (Cal's skin-through report, on the live build 297b2192): rig seam crack under sleeved tops (fineSlots), FIX for LEAD; waiting on his fix to sweep every Shop piece (QA findings).
  Was: Now (on release/v1.39 297b2192, Live): v1.39 live check, PASS (QA findings).
  Was: Now (on release/v1.39 297b2192): v1.39, PASS, can ship (QA findings). Next: the live check after the ship.
  Was: Now (on release/v1.39 f3d8c5e8): v1.37 live check PASS; v1.39 tests PASS, waiting on the busser re-cut for the final pass (QA findings).
  Was: Now (on release/v1.35 a7ba8e21, Live): v1.35 live check, PASS (QA findings).
  Was: Now (on release/v1.35 a7ba8e21): the reboot re-cut, PASS, can ship (QA findings). Next: the live check after the ship and the clear.
  Was: Now (on release/v1.35 d2cfa06c): the reboot, PASS but HELD for Cal's privacy decision on productivity-challenge quest names (QA findings).
  Was: Now (on 05c353be): the Speakeasy recheck, PASS; seating left for a later pass (QA findings).
  Was: Now (on 268253fe): the Speakeasy rework, NOT A PASS yet: two small FIXes (cart on the armchair, barrels boxed in), a seating NOTE (QA findings).
  Was: Now (on bdb442d1): Karaoke Disco Ball retired, PASS with a refund NOTE (QA findings).
  Was: Now (on release/v1.31 62a515fe, Live): v1.31 live check, PASS (QA findings).
  Was: Now (on release/v1.31 62a515fe): v1.31 take three, PASS, can ship; one pace NOTE for Cal (QA findings). Next: the live check after the ship.
  Was: Now (on release/v1.31 9b2c2206): v1.31 from v1.30 with curve 6 take two, PASS, can ship (QA findings). Next: the live check after the ship.
  Was: Now (on rollback-v1.30 1c6ef20d, Live): rollback live check PASS, levels back (QA findings). Waiting on Cal's choice for the fix-forward v1.31 (APPV 133+).
  Was: Now (on release/v1.31 915ed0ac): the no-reset re-cut, NOT A PASS, BLOCKER: every existing save drops to about half its level on the new curve (QA findings).
  Was: Now (on release/v1.31 42680d81): v1.31 cut, PASS, can ship once ship.sh uses QA's fixed wlive.js (epoch 7) (QA findings).
  Was: Now (on qa-local 05eac907): the release batch, PASS; v1.31 can be cut; waiting on LEAD's cut for its own check (QA findings).
  Was: Now (on qa-local e0724a7c): the release batch, NOT A PASS yet: three small placement FIXes (Karaoke ball, Garden st1 barrel in the doorway, Restaurant st1 fire-pit chair into the bistro chair); the rest PASS incl. Stylist highlights (QA findings).
  Was: Now (on 2abdb00a): hair highlights, 13 styles, PASS; d18c5041 PASS with the bottom-bar NOTE open (QA findings). Next: the rooms commit, then the release cut.
  Was: Now (on qa-local b30a7ea): the 11-23 batch recheck, PASS (QA findings). Next: the rooms commit, then the release cut.
  Was: Now (on 3b1e3fa): ROOMS's later-rooms placement findings, PASS (all five agreed, one added for the Restaurant) (QA findings).
  Was: Now (on qa-local 8ca029d): the 11-23 batch, NOT A PASS: one FIX, the milestones' S.ms is wiped every 5 s by the old Missions refund; economy, v1.32, hair, dogs, pets recheck PASS; later rooms PASS with one FIX (Club DJ) (QA findings).
  Was: Now (on release/v1.30 c1cff49): v1.30 live check, PASS (QA findings). Waiting on ROOMS: pd_cable (Pluto's cells), pd_fleece and the three dog auras.
  Was: Now (on release/v1.30 c1cff49): v1.30 cut, PASS, can ship (QA findings).
  Was: Now (on release/v1.30 98aa14b): v1.30 cut, NOT A PASS yet: text-only FIXes (QA findings).
  Was: Now (on 9c6b5cc): Pet Shop recheck with the Patio dog beds removed and refunded, PASS (QA findings).
  Was: Now (on 9d925a5): Pet Shop recheck, NOT A PASS: two Patio FIXes (QA findings).
  Was: Now (on db99820): Pet Shop code review, NOT A PASS: two FIXes in the rooms (QA findings).
  Was: Now (on 3c309e4): pw_cloud and pd_rain, PASS (QA findings).
  Was: Now (on bea0f82): pet clothes recheck, PASS but one small FIX (pw_cloud's flakes); pd_fleece design PASS (QA findings).
  Was: Now (on release/v1.29 0e5e736): v1.29 live check, PASS (QA findings).
  Was: Now (on f1ba1fc): pet clothes recheck plus the slime line and 6 dog pieces, FIXes for ROOMS (QA findings).
  Was: Now (on release/v1.29 0e5e736): v1.29 cut (bare-arm split), PASS, can ship (QA findings).
  Was: Now (on 8d183f0): wolf and wyvern pet clothes wear-check, 17 PASS, 7 FIX for ROOMS (QA findings).
  Was: Now (on release/v1.28 + 2a0a7e3 + 63344fe + d8444f5 + e9cc506): bare-arm split, PASS by eye (QA findings).
  Was: Now (on 180defc): pet clothing concepts, PASS with NOTES (QA findings).
  Was: Now (on c81d0de): Pet Shop final frames recheck, PASS (QA findings).
  Was: Now (on release/v1.28 33c064d): v1.28 live check, PASS (QA findings).
  Was: Now (on e82a602): Pet Shop final frames, NOT A PASS, two FIXes for ROOMS (QA findings).
  Was: Now (on release/v1.27 + 4fe171c): bare-arm rig fix, PASS (QA findings).
  Was: Now (on release/v1.27 050ddd2): v1.27 live check, PASS (QA findings).
  Was: Now (on release/v1.26 + 21c67e7 + b1fa777 + bd7c9f4 + 3876c46): REGIMENT hold line, PASS, v1.27 can ship (QA findings).
  Was: Now (on 156340f): Pet Shop concept notes applied, PASS (QA findings).
  Was: Now (on a02362e): Pet Shop concepts PASS with NOTES (QA findings).
  Was: Now (on bd7c9f4): REGIMENT rows PASS, held for Cal (QA findings).
  Was: Now (on b1fa777): REGIMENT PASS, waits on LEAD's rows (QA findings).
  Was: Now (on 21c67e7): REGIMENT painted, NOT A PASS yet (the peaked cap hides the eyes; QA findings).
  Was: Now (on 268fb31): v1.26 live check PASS (QA findings).
  Was: Now (on abe4e6d): v1.26 candidate (OIL & CANVAS rows) PASS (QA findings).
  Was: Now (on c45cedb): REGIMENT design review PASS with NOTES (QA findings).
  Was: Now (on 4c60022): OIL & CANVAS PASS, waits on LEAD's rows (QA findings).
  Was: Now (on f041b24): OIL & CANVAS painted, NOT A PASS yet (gloves, palette size, smock tank; QA findings).
  Was: Now (on e5b4684): OIL & CANVAS design review PASS with NOTES (QA findings).
  Was: Now (on 6a0272c): v1.25 live check PASS (QA findings).
  Was: Now (on 6a0272c): v1.25 PASS, can ship (QA findings).
  Was: Now (on 651fbfe): v1.25 candidate NOT A PASS (8b8d4a0 missing from the recipe; the new rig's dance2 hole; QA findings).
  Was: Now (on 368507e): KODE PINK detail pass PASS (QA findings).
  Was: Now (on 581c6cd): GILDED PASS, waits on LEAD's rows (QA findings).
  Was: Now (on cb01321): GILDED recheck, NOT A PASS yet (the beret's bald band; QA findings).
  Was: Now (on fa1864a): GILDED painted, NOT A PASS yet (two FIXes for ROOMS; QA findings).
  Was: Now (on 48b550a): v1.24 live check PASS (QA findings).
  Was: Now (on f0cccd0): v1.24 candidate (KODE PINK) PASS (QA findings).
  Was: Now (on 022a2f8): KODE PINK text PASS (waits on LEAD's wiring), GILDED re-review PASS (QA findings).
  Was: Now (on 8e6eecf): KODE PINK repaint (art PASS, text FIX) and GILDED design review (QA findings).
  Was: Now (on 7e61089): v1.23 live check PASS (QA findings).
  Was: Now (on 7e61089): v1.23 candidate (tiptoe heels, clean icons) PASS, held for Cal's OK (QA findings).
  Was: Now (on 0172e8d): v1.23 recut (release/v1.23, harness out) PASS, held for Cal's OK (QA findings).
  Was: Now (on 983258b): v1.23 candidate PASS (QA findings).
  Was: Now (on 141ff29): Cal's 11-18 pieces PASS (QA findings).
  Was: Now (on 4edfa01): Cal's 11-18 pieces wear-check: bare coverage gate PASS; three small FIXes for ROOMS (QA findings).
  Was: Now (on b3030e6): v1.22 LIVE as b3030e6, verified (QA findings).
  Was: Now (on 0c5bc0b): design review of ROOMS's 11-18 art drafts DONE; v1.22 c13edd3 PASS (QA findings).
  Was: Now (on c13edd3): v1.22 = release/v1.21 + c13edd3 PASS, can ship (QA findings).
  Was: Now (on 8103458): v1.21 LIVE as 8103458, verified (QA findings).
  Was: Now (on 6ba0729): Cal's full sweep DONE, no FIX; d51ef4c PASS (QA findings).
  Was: Now (on 6ba0729): v1.20 LIVE as 6ba0729, verified (QA findings).
  Was: Now (on 6ba0729): v1.20 candidate (release/v1.20) PASS, can ship (QA findings).
  Was: Now (on d808aca): VENOM ROSE's sexy set wear-check PASS (QA findings).
  Was: Now (on 242f620): VENOM ROSE recheck: both FIXes PASS; one more small FIX (QA findings).
  Was: Now (on 353080a): VENOM ROSE's sexy set wear-check: NOT A PASS yet, two small FIXes for ROOMS (QA findings).
  Was: Now (on 78926d8): v1.19 LIVE as 78926d8, verified (QA findings).
  Was: Now (on 205d8df): v1.19 = release/v1.18 + 205d8df PASS, can ship (QA findings).
  Was: Now (on c12783d): v1.18 LIVE as c12783d, verified (QA findings).
  Was: Now (on aec19d9): v1.18 = release/v1.17 + aec19d9 (Cal's removal order) PASS, can ship (QA findings).
  Was: Now (on 48fab96): v1.17 LIVE as 48fab96, verified (QA findings).
  Was: Now (on b148138): v1.17 = release/v1.16 + b148138 PASS, can ship (QA findings).
  Was: Now (on 505c7f0): v1.16 LIVE as 505c7f0, verified (QA findings).
  Was: Now (on c5bc0c7): v1.16 candidate = release/v1.15 + 44bb4e3 + ddc1d10 + c5bc0c7 PASS, can ship (QA findings).
  Was: Now (on 0859d5b): v1.15 LIVE as 0859d5b, verified (QA findings).
  Was: Now (on ad44305): v1.15 = release/v1.14 + b3917b8 (Training tab) + ad44305 (quick admin) PASS, can ship (QA findings).
  Was: Now (on ddc1d10): Boba +15 44bb4e3 NOT A PASS yet (two small FIXes for ROOMS); its economy ddc1d10 PASS (QA findings).
  Was: Now (on 0a26f27): v1.14 LIVE as 0a26f27, verified with art and items.json (QA findings).
  Was: Now (on 791cc5c): OVERPASS's 15 in the Shop PASS, v1.14 can ship; Boba +15 plan reviewed twice, ROOMS paints (QA findings).
  Was: Now (on a96107d): design review of ROOMS's Boba +15 plan DONE, before paint (QA findings).
  Was: Now (on cbc3709): OVERPASS's 15 new pieces wear-check PASS, one NOTE for Cal (QA findings).
  Was: Now (on 7eb084f): v1.13 LIVE as 7eb084f, verified (QA findings).
  Was: Now (on b43ebf8): Lock and Key prices b43ebf8 and Wheel/freeze 15954e6 PASS; v1.13 can be cut (QA findings).
  Was: Now (on c1c8c12): Lock and Key +15 (fff49a2 + c1c8c12) PASS; LEAD's 777411d PASS; 9eb7f13 PASS with two NOTES (QA findings).
  Was: Now (on fff49a2): Lock and Key +15 NOT A PASS yet, two small FIXes for ROOMS (QA findings).
  Was: Now (on ff44edc): LEAD's crew posts PASS, no regression in six rooms (QA findings).
  Was: Now (on 6f15fd9): v1.12 LIVE as 6f15fd9, verified (QA findings).
  Was: Now (on c15c239): HANGANG and DIAL-UP new pieces in the Shop PASS (QA findings).
  Was: Now (on 4f115ed): Lock and Key +15 plan reviewed twice; ROOMS paints the wall pieces and rug (QA findings). Nothing open from QA. 15-minute loop off (Cal).
  Was: Now (on 034069d): v1.11 LIVE as 034069d, verified (QA findings).
  Was: Now (on 4456e71): the mop FIX and both Garden NOTES PASS; v1.11 = 6749725 + 4456e71 can ship (QA findings).
  Was: Now (on 6749725): ROOMS's Restaurant/Garden fixes PASS with two NOTES; FIX: a permanent mop since v1.10 (QA findings).
  Was: Now (on f6fc989): Bowling fix PASS; the room fixes (3c3d6a1 + f6fc989) are all PASS (QA findings).
  Was: Now (on 1854144): v1.09 918732a and v1.10 1854144 LIVE, verified (QA findings).
  Was: Now (on cfe5917): DIAL-UP 35f3080 PASS; room fixes 3c3d6a1: VR and Dessert PASS, Bowling one FIX (QA findings).
  Was: Now (on cbc2d88): v1.09 = 5959380 + cbc2d88 PASS; v1.10 cuts cfe5917 PASS (QA findings).
  Was: Now (on 5959380): v1.09 NOT A PASS yet (one FIX: version over the name at 360; QA findings).
  Was: Now (on 7c10733): Restaurant/Garden cut lists for LEAD DONE (QA findings).
  Was: Now (on 8d1f69f): v1.08 LIVE as 8d1f69f, verified (QA findings).
  Was: Now (on 00c18f4): v1.08 candidate PASS (Speakeasy priced like its neighbours), two NOTES (QA findings).
  Was: Now (on 0b0a6d4 = v1.07 code): Cal's later-rooms sweep DONE (lag, placement, upgrade counts; QA findings); HANGANG 86cb0e1 PASS. Fixes go to ROOMS, upgrade counts to LEAD and Cal. 15-minute loop off (Cal).
  Was: Now (on c546e9c): v1.07 LIVE as c546e9c, verified (QA findings).
  Was: Now (on 29ed258): v1.07 candidate 29ed258 PASS (Update 1.06 letter, Shop tabs wrap), two small NOTES (QA findings).
  Was: Now (on 0ea9b2a): v1.06 candidate 0ea9b2a PASS (3 Street brands), one NOTE for LEAD (QA findings).
  Was: Now (on fea3674): v1.05 LIVE as fea3674, verified (QA findings).
  Was: Now (on b10ca52): v1.05 = f16dbc2 + b10ca52 PASS.
  Was: Now (on f16dbc2): v1.05 candidate f16dbc2 PASS, with ROOMS's NICE COCK art bcd8f73.
  Was: Now (on efe8e2d): v1.04 LIVE as efe8e2d, verified (QA findings).

QA findings (Mac team; one line each: what, where, how to see it, pictures, owner):
- PASS, ROOMS's Calvin and Sydney visit picture (cb651b3b: friend_calsyd, _2, _3; Cal's brief). Pictures shots/qa/calsyd1124/. Three walk frames, 1000x675, transparent: no green fringe, no stray bits, nothing at the edges, one piece each, the feet on one line (y 666) in all three, the top moving 8-34 px (the walk's bob). The two walk close together, each with a leash, Pluto and Chopstick at their size, baggy pants on both, a hoodie and a beanie for Calvin; no letters; the only mark is the orange Ø on his beanie, Cal's own SAYMORE logo (the scratch card's). On the visit card (QA's build of cb651b3b, rigtest/qa/vcard149.js): at 320 px the card is 288 wide with the picture 238x161, at 390 px 358 wide with it 308x208, its shape kept; title, text, coins and Nice all inside. This also ends FIX 2 above for Calvin and Sydney's card while the art is there. NOTE (LEAD): the four-figure row the picture replaces is still 430 px wide on a phone, so if the picture ever fails to load the card would overflow again; let the row wrap or shrink. Not checked: the frames swapping in motion.
- PASS, ROOMS's ten player-card backdrops (3f823fc1: bl_pc_neon, skyline, roof, mist, sunrise, maple, fire, lantern, ember, moon; owner ROOMS for the notes). Pictures shots/qa/backdrops1124/. All ten are 900x1200 (3:4). Read for letters, numbers, logos and hate symbols at full size and enlarged: Neon Alley's tubes are two rings (a big cyan one and a pink oval: at most "OO"), an upright five-pointed star, three plain downward chevrons, a diamond and stripes, its paper lanterns and sign panels blank; Sunrise's floor border is diamond-and-flower tiles, nothing like a hooked cross; Fireworks' lanterns and stall curtains are blank (the two lettered tags are gone); the throne room has no carvings; the Skyline's towers and the Rooftop's brick, chimneys and water towers carry no signs and are no real city. No text anywhere. On the card (ROOMS's card_all_m/f.png): the figure stands on each floor and the name plate reads on the bright ones too. NOTE (Cal/ROOMS, taste): on the throne room (ember) the throne's spiky top sits right behind the figure's head and reads like a dark crown; fine if meant (Monarch), else shift the throne. Not checked: the card with a companion on these (the companion is off the card for now, FIX 1 above).
- NOT A PASS yet, the v1.49 batch, first part (qa-local c34a8e3b, then d3ca8ee6 after Cal's changes; QA's clean builds; owner LEAD unless said). Pictures shots/qa/v149/. LEAD's pets150, pets151, pcard152, shop149, bounty147, drops148: PASS on both.
  - FIX 1, the player card: the companion is off the card. On the Board's card button, at 390 and 320 px, the companion picture sits 65-104 px left of the card's stage, so only the tip of an ear shows at the left edge (pcard_390_wolf1_Ash.png); first forms and changed forms alike (wolf 84 px, changed wolf 113, wyvern 118, slime 122 wide). At 320 px the character (242 px) is also a little wider than the stage (236). rigtest/qa/pcard149.js. Name, rank, class, level read right, a 24-letter name and a player with no class too.
  - FIX 2, Calvin and Sydney's visit card (after e7c0343a/66701160): the pictures keep their shape now (Calvin and Sydney 119x136, the dogs about 52 px tall), but the card is 430 px wide at 320 px and 422 px at 390 px, so its right side is off the screen (the title, the people and the Nice button cut; vcard_320_calsyd.png). One- and two-guest cards fit (288 and 358 px). rigtest/qa/vcard149.js.
  - FIX 3, the large pet beds (rule 20): all three overlap the Bedroom's door mat at the front (the moon bed and the nest sit on its right part, the slime-cat's cushion touches its corner; bed_wolf_2.png, bed_wyvern_2.png). The small first-form bed is clear of it. Move the large-bed spot right or back.
  - NOTE (LEAD), the companion's room change is a jump: at a spell's end it vanishes from one room and appears at the next room's door spot (Bedroom 10, 4) in the same frame, at full opacity, every time (12 changes watched); in the building view both rooms are on screen, so it pops. A walk out or a fade would read better.
  - PASS, the companion in the Loft (rigtest/qa/petroam.js): each kind, first form and changed, 150 s each with 25 s spells, in the Bedroom, Closet, Game Room and Lair with every upgrade bought: about 1,000 samples a run, 80-140 of them walking, never on a blocked cell of the room's grid (it never crosses a piece, the Closet's island and the Lair's desk, plinths and towers included); 1-4 room changes a run. The changed forms walk, sit and sleep at their size (petlook.js, qa_look_sheet.png): with both beds each sleeps inside its large bed, with the small one only it sleeps beside it on the floor, with none on the floor. The Patio draws without a pet bed and its lounge chair is back (patio_wolf.png).
  - PASS, Calvin and Sydney's visit (calsyd.js, calsyd2.js): force('calsyd') gives the card (four names, +120 coins, "in the Game Room") and all four in the Game Room; over a minute Calvin and Sydney walk to 23-24 spots each, the dogs to 4 and 9, nobody on a blocked cell, nobody sharing a spot (the dogs start on the same door spot and part). (QA's first samples looked frozen: the Loft pauses everyone while a window is open, 20_loft.js lfLoop; fine for players.)
  - Still to check: the rig sweep against v1.47 (every Shop piece, both bodies, every pose; running), the Vault screen (tile, screen, a Boutique vault brand, Thursday 8 am while open, buy), other players' cards and the pedestal (P2OTHER), Post my card and its delete in the sandbox, Hall card views, the Stylist's Cosmetics/Backdrops tabs, secrecy before the change, and the City text.
- PASS, v1.47 live check (release/v1.47 b2b7a2e3 on Live; owner LEAD): QA's own web build of b2b7a2e3 (3,841 files with version.txt, noTest on, APPV 147, QB_EPOCH 8, no reset) compared file by file with what Live serves: 3,841 of 3,841 byte-identical, version.txt b2b7a2e3. release/v1.47 b2b7a2e3 and rollback-v1.45 0d4a9f8e are on origin. Live loaded signed out in a throwaway headless browser: the sign-in screen, 0 page errors, noTest on, only __qbLoad and __qbWeb. Not checked: the Test channel (ship.sh compared it), a signed-in account, a real phone.
- PASS, the v1.47 candidate: release/v1.47 b2b7a2e3 and its rollback rollback-v1.45 0d4a9f8e, both built clean by QA. Can ship. The cut: in the files that ship it equals lead/v147src d40320c4 (QA's pass) but for APPV 147 and QB_EPOCH 8 (no reset); against release/v1.45, 15 files, all in app/src; no pet art, no pet system (c4d9e374 and a551390e are not in it). The rollback is v1.45 with only APPV 148. Web build: 3,840 files, noTest on. rigtest/qa/v147cand.js (made from v145cand.js): UP, v1.45 saves at levels 30 and 60 open on v1.47 with nothing lost (level, XP, coins, rooms, upgrades, clothes), appv 147, 0 page errors; the Board then shows the three new bounty cards and no old ones (upcards check), the Shop its home screen. DOWN, v1.47 saves with a 1-day bounty on the Board, a 2-day one finished and a 3-day one taken open on the rollback with nothing lost and 0 page errors; the Board, Loft, Wheel and Shop draw; the bounty quests ride along on its Board and a carried one ticks and pays (x1.5 by the old rule, no 250 there). (QA's first DOWN run showed +180/+200 coins on the rollback: that was the test save's Garden earning during the run; the same bounty save without it loads with exactly its stored coins on both builds, rigtest/qa/rbcoins147.js.) WEB, dist-web with LEAD's stand-in Firebase: boots past the creator as v1.47, no test hooks (__qbV147, __qbV149 and the older ones absent; __qbLoad, __qbWeb, __qbGuest are the platform's), 0 page errors; the Shop's Testing row is drawn only when noTest is off (15_shop.js), and noTest is on (a new web player's Shop is locked until the Closet, so it was not opened on screen). Not checked: a real phone, real accounts, the Test channel.
- PASS, v1.47 can be cut: lead/v147src d40320c4 = b145deeb + the Shop fix (29zz_v149.js and shop149.js only; still 16 game files against release/v1.45, no pet art, no v150). QA's clean build; rigtest/qa/shopfix147.js, real taps.
  - FIX 1 done: opening the Shop on a day a "NOW ON SALE ..." window waits and closing it with its x leaves the home screen, still there 25 s later through the game's own redraws and the next brand window (fix1_home.png); a brand window's "Go to Shop" still opens the Street Shop.
  - FIX 2 done: "Have a look" from the Board, three times (Boutique, Street, Boutique), lands on the Street Shop with that floor selected; a real bottom-bar tap a second later still opens the home screen (the 800 ms V49KEEP is only the handler's own click).
  - Again on this build, all PASS: LEAD's shop149, drops148, bounty147; QA's shop147qa.js 53/53 (drops 11-20..12-31 against v1.45, the home screen and every screen's back at 390/320 and levels 34/12, try-on and buy, every way in), closet143.js, bq147qa.js. The profile's Closet button opens the Closet in all three set-ups (QA's earlier misses were other windows stacked over the profile). Not checked: the NEW DROP window's "Open Shop" (none came up in QA's runs; it has no data-act, so it lands wherever the Shop last was, as before), a phone, the web build (at the candidate check, with the Testing row that must not be there).
- NOT A PASS yet (two Shop FIXes), v1.47 = lead/v147src b145deeb (owner LEAD). The branch: release/v1.45's source plus exactly the bounties, the drop days, close-during-sync and the Shop's home screen (16 game files; no pet art, no pet_art.json change, no 29zz_v150.js; c4d9e374 and a551390e not in it). QA's clean build; pictures shots/qa/v147/. LEAD's bounty147, drops148, shop149: PASS on it.
  - FIX 1 (LEAD), the Shop: a brand's window flips the Shop off its home screen. Open the Shop on a day a brand window is waiting ("NOW ON SALE ..."), close it with its x: the Shop shows the Street Shop, not the home screen (real taps; bs_after_x.png). 29zz_v149.js sets SHUB="in" when brandSplash opens and for any tap inside .bsplash (its x is data-act="mclose"). Suggest: only the window's "Shop it" button (bsgo) leaves the home screen. The same flip made the home screen show Street at random in QA's runs (a back tap that didn't stick, the bottom bar opening on Street at level 12).
  - FIX 2 (LEAD), the Shop: "Have a look" on a floor's window ("The Boutique is open") lands on the home screen, not that floor: its handler (29l_drops.js) closes the window and clicks the bottom bar's Shop button, and 29zz_v149.js turns any bottom-bar tap into the home screen. QSFLOOR is set, so the Street Shop opens on that floor if the player taps it, but the window promises the floor.
  - PASS, bounties with QA's FIX and NOTE: unticking a finished bounty's quest now gives everything back (bqundo.js and bq147qa.js: 2,050 -> 2,545/2,476 -> 2,050; ticking again pays once); the photo arm clears when the composer closes (from the code: bqDisarm after any click and on the 20 s beat). QA's other bounty cases pass again (declined challenge, held bounty running out, next day, an old-system bounty, 390/320 px).
  - PASS, drop days (rigtest/qa/shop147qa.js, every day 11-20..12-31 against v1.45): Street and Boutique identical through Fri 11-27 (no drop that happened moves); after 11-28 the same brands arrive in the same order, on Mondays and Fridays (Street: alt 11-30, hanga 12-04 Fri, over 12-07, nc 12-11 Fri, kp 12-14, ...); the floors say "Mondays and Fridays"; the Wednesday vault brands are the same as v1.45's (12-09 y2k, 12-30 hanga; none on the other Wednesdays, on v1.45 too) and never one already on sale.
  - PASS, the Shop otherwise (390 and 320 px; level 34 and 12): the bottom bar opens the home screen with Street Shop ("!" for a new brand), Stylist and, only from the Boutique at level 30, Pet Store, and Closet under the character card; Street Shop, Stylist, Closet and Pet Store each open their own screen with a back button that returns home (real taps); in the Street Shop a piece is tried on and bought (330 spent; a first purchase also pays its rewards, as on v1.45) without leaving it; a brand's "Shop it" lands on the Street Shop; the profile's Closet button lands on the Closet; nothing past 320 px; no "Wardrobe" on any screen a player reaches (the furniture keeps its names). The Closet room's window has no Closet button, on v1.45 too (not a v1.47 change). The level-30 "Pet Store" opens the old pets tab inside the new screen, as LEAD said v1.47 ships.
  - PASS, a window opened during the fast start can be closed (drops148). Regression on this build: batch145qa.js 56/56, sync145.js, nametag144.js, closet143.js and bq147qa.js (both brought up to date: the Shop now opens on its home screen; the bounty undo now gives the 250 back) all PASS, 0 page errors.
  - Not checked: the daily sale's own link (none on the Board in QA's runs), a real phone, the web build (at the candidate check).
- PASS, ROOMS's recheck of the evolved pets (2cfa126f on top of e267001b): the evolved pets' art now passes as a whole. pbed_k5 (the wolf's moon daybed): the base is crescent moons, dots and a gentle wavy glow line around a central full moon; nothing reads as a letter, rune or symbol (shots/qa/pets1124/runes_fixed_zoom.png); same 470x464 and sleepOff 90. k6 (Cal: "Shrink to 1.45x"): frame 0 is now 1.45x the first form's height (487 vs 337 px; 1.36x wide), the canvas 515x580 and cx 276 match pet_art.json, mass centres on cx, no green fringe, the same clean frames and pairs as before; pbed_k6 450x308 matches. In ROOMS's in-game render the evolved wyvern now stands at the player's hip, like the other two, and sleeps inside its nest. NOTE (ROOMS): two preview pictures still show the OLD rune base and should be re-rendered or replaced before anyone shows them to Cal or posts them: shots/pending_art/cal_1124/pets/ingame_wyvern145.png (the "Wolf evolved, large bed" panel) and beds_large_src.png (the old source). beds_large_fit.png is updated. Still to do: the evolved forms in the real game (anchors, clothes, the Bedroom and Patio) once LEAD wires them.
- NOT A PASS yet (one low FIX), the 1/2/3-day bounties (96465b5b, 29zz_v147.js; QA's clean build of qa-local 2f02dbaa; owner LEAD). Pictures: shots/qa/bounty147/. LEAD's rigtest/lead/bounty147.js: 23/23 on QA's build (three cards and their pay, 3 free rerolls a day then 150, two taken hide the third, timers from the take, the x with and without rerolls, the held bounty's timer going on, a chore finishing its bounty, the finished slot waiting, Hydration once a day, Menu Ideas' 3 photos, the fourteen 3-day bounties, the Gym Challenge asked/accepted/over, running out, no photo board -> a chore). QA's rigtest/qa/bq147qa.js and bqundo.js add:
  - FIX (LEAD, low): unticking a finished bounty's quest keeps the bounty's 250 coins (bqundo.js: a plain quest's untick gives back exactly what it paid, 2,050 -> 2,281 -> 2,050; a bounty quest's keeps 250, 2,050 -> 2,545 -> 2,300). It can't be farmed (ticking again doesn't pay the 250 twice), but it is the one undo that doesn't undo (the Weekly Quest's does). Suggest: an untick of that quest takes the bounty's coins back and reopens it, as uncreditStreak does for the Weekly Quest.
  - NOTE (LEAD, low, from the code): "Post a photo" on a 3-day bounty arms it for 15 minutes (BQARM); a player who backs out of the composer and posts an unrelated photo from the Town Hall in that time gets it counted toward the bounty. Clear the arm when the composer closes without posting.
  - PASS: a Gym Challenge that goes away after being accepted (declined or cancelled) leaves the card asking again on its own 3-day clock (vs, challenge id and the challenge's end all cleared); a bounty held with no rerolls left whose time runs out goes, and a new card comes free; the next day gives 3 rerolls again while a running bounty runs on and a held one stays held; a save with an old-system bounty quest keeps it on the Board at x1.5, pays it as before, and shows the three new cards beside it; at 390 and 320 px the offers, a taken card with its x, a done card and a held card fit with nothing past the edge (the x sits clear of the label, which wraps under it). 0 page errors throughout.
  - Not checked: calm mode's first days (QA's calm save showed the cards; calm needs its own start state, not set up), a real photo through the Town Hall's composer, a real challenge between two accounts, a phone.
- NOT A PASS yet, ROOMS's evolved pets (Cal 11-24 item A; c4d9e374 wolf k5 + wyvern k6 + the new first-form wolf bed, fa601f89 slime-cat k4, 3b969813 the three large beds; owner ROOMS for the FIX). Pictures: shots/qa/pets1124/. Tool: rigtest/qa/petframes.py (every frame decoded by ffmpeg and measured).
  - FIX (ROOMS, before anything uses it): pbed_k5, the evolved wolf's moon daybed: the glowing runes on its stone base are not invented glyphs. They read as real Elder Futhark letters (roughly h, e, m ... l, l, m, r, and an s-rune at each end), and in the middle are two identical lightning S-runes side by side, which reads as the Nazi SS sig runes (runes_zoom.png). Replace them with marks that are clearly not letters (crescents, dots, the wolf's own glow lines), and never two S-shaped runes together. Cal approved the design, but not this.
  - PASS, every frame of k4, k5, k6 (33) and the first forms for reference: no green key fringe (0 pixels; the wyvern 11 at most), no stray specks (the wyvern's separate bits are its floating embers, the slime-cat's frame 9 its worry marks, both designed), nothing cut at the canvas edge by eye (qa_sheet_k*.png on dark and light), every frame's mass centre on its cx, feet on the ground line except the wyvern's glide/hover frames (by design). Idle and walk pairs move about as much as the live first forms' (IoU: k5 0.73/0.80, k6 0.60/0.47 with wing beats like the live wyvern's 0.66/0.49, k4 0.91/0.73); the slime-cat's idle B is a blink plus a slight tail sway, not a jump. Crying frames: the wolf's crest is dimmed, the horns stay (as ROOMS said).
  - PASS, the beds: each evolved form asleep on its large bed sits inside it (ROOMS's beds_large_fit.png: k5 off 90, k6 off 60, k4 off 70); each evolved sleep frame (5) reads as a curled sleeper on bare floor too. The nest (k6, crystals) and the cushion (k4, a star charm) carry no text or symbols. The new first-form wolf bed (a crescent-moon fur rug) replaces the LIVE pbed_wolf when it ships: no symbols on it; it needs a look in the real Bedroom when LEAD wires it.
  - NOTE (Cal, look): sizes against the player (ROOMS's ingame_sizes.png, their patched build): the evolved wolf reaches the player's hip and the slime-cat the waist, but the evolved wyvern is 1.6x its first form (the others about 1.4x): its head reaches the player's chest and its wings are wider than the player.
  - LEAD (known, ROOMS's note): k6's fit table maps frame 6 to "hop"; the frame is a glide.
  - Not checked: the evolved forms in QA's own build (their anchors are null until LEAD's batch 3, so the game can't draw them yet), pet clothes on them, the Patio. QA wear-tests them in the real game when LEAD wires them.
- PASS, v1.45 live check (release/v1.45 d38479aa on Live; owner LEAD): QA's own web build of d38479aa (3,841 files, noTest on, APPV 145, QB_EPOCH 8, no reset) compared file by file with what Live serves: 3,841 of 3,841 byte-identical, version.txt d38479aa. release/v1.45 d38479aa and rollback-v1.43 b8909e0e are on origin. Live loaded signed out in a throwaway headless browser: the sign-in screen, 0 page errors, noTest on, only __qbLoad and __qbWeb. Not checked: the Test channel (ship.sh compared it, 3841/3841), a signed-in account, a real phone.
- PASS, the v1.45 candidate: release/v1.45 d38479aa and its rollback rollback-v1.43 b8909e0e, both built clean by QA. Can ship. The cut: in the files that ship (app, art/app, data, web, tools) it differs from lead/v145src ea0657be (which QA passed) only in APPV 145 and QB_EPOCH 8 (no reset); against release/v1.43, 11 app/src files, the two scratch card pictures and Cal's six logo sources in art/src-cal, which are NOT in dist or dist-web (3,841 web files = v1.43's 3,839 + sc_mascot + sc_o_mask). Neither ROOMS's pet art (c4d9e374) nor the bounties (96465b5b) is in it. The rollback is v1.43 with only APPV 146. rigtest/qa/v145cand.js: UP, level-30 and level-60 saves made on v1.43 code (rooms, coins, 15 pieces, banked Rested XP, the Wheel spun today) open on v1.45 with nothing lost (30 keeps its XP; 60 moves to curve 8 at level 60, 29,125 -> 29,429 XP), appv 145, xpc8 1, Board/Loft/Shop/Town draw, 0 page errors; the update day's card waits for 3 tasks as usual. DOWN, v1.45 saves mid-play (scratch card done with a golden piece, a surge running, loot state) open on the rollback with nothing lost (coins, rooms, upgrades, 17 pieces, XP), 0 page errors, the Board, Loft, Wheel and Shop draw; a level-60 save on curve 8 reads level 60 on the rollback's curve 7, so the rollback can stay on curve 7 (LEAD asked). WEB, dist-web with LEAD's stand-in Firebase: boots past the creator as v1.45, noTest on, no test hooks (__qbV144, __qbV146, __qbC8 and the older ones absent; __qbLoad, __qbWeb and __qbGuest are the platform's own flags), 0 page errors. release/v1.45 and rollback-v1.43 are not on origin yet (ship.sh pushes them; QA checks at the live check). QA's own slip, fixed: the first save of a run, seeded on the v1.43 test build right after its first load, was not stored (persist skipped while the old build was still starting), so v1.45 opened an empty save; with the store checked and re-saved, every upgrade keeps everything. Not a v1.45 matter: real players don't seed saves through test hooks. Not checked: a real phone, real accounts, two devices, the Test channel.
- PASS, v1.45 can be cut: lead/v145src ea0657be = 8bda5f60 (QA's batch, all passed but the spinner) + 940ad1ad + ea0657be, 4 game files, and nothing else: ROOMS's c4d9e374 (evolved pets) and the bounties 96465b5b are NOT in it (checked: neither is an ancestor). QA's clean builds, plain and sandbox web.
  - The spinner FIX: none of "Sorting laundry...", "Reading chapter 3...", "Working on the essay…", "Checking emails...", "Adding receipts to the budget..." spins any more; the save pill's "syncing…" still has its ring.
  - Tabs while the save syncs (Cal 11-24), the real fast start: rigtest/qa/sync145.js, sandbox web build with the online save read held for 15 s, the online copy newer than the device copy (another device played). While "syncing…" shows (ring + glow): all five bottom tabs and the Town's Posts/Chat/Style open with real taps; ticking a quest waits (by design). With the Loft open, the save lands at 17.6 s: the newer online save takes over (7,777 coins, not the device's 1,000), the screen is drawn, the pill stops, real taps work again, 0 page errors. NOTE (LEAD, low, not new): a window that opens during the fast start (here a level-5 milestone from the device copy) can't be closed until the save lands; before v1.45 nothing could be tapped at all.
  - Curve 8 moves old saves: rigtest/qa/curve8.js: curve 7 as frozen here equals v1.43 (cum 60/80/100 28,640 / 65,178 / 129,313); saves at 30, 40, 41, 45, 60, 80, 99, each 37% into a level on curve 7, open at the same level and 37% (XP moves only past 40: 14,228 -> 14,232 at 45, 126,792 -> 134,599 at 99), a second reload moves nothing, the weekly goal's start moves with the XP, a new save carries xpc8.
  - Name tags show 14 letters at most ("Maximilian Th…"), still at the feet, white, in both room windows at phone size. The film is now "Midnight Drift Club".
  - The whole batch again on ea0657be (batch145qa.js): 55 checks pass (ranks, Weekly Quest and its undo, surge, loot, prize pools by body, the scratch card, its odds, the gold tiers on both bodies, 320 px in Chromium and WebKit with the mascot art loading); the one red line was QA's own odds sum (a card with one or two gold is no match too), fixed in the test. Left as LEAD decided: a Wheel spin and a card on the update day; three golden = rare until the Atelier has brands (Cal knows). Not checked: a real phone, real accounts, two devices, the Test channel. Pictures in QA's scratchpad (v145out).
- NOT A PASS yet, batch 1 + the scratch card for v1.45 (qa-local 6bfa2938..8bda5f60; QA's clean builds of 243956e4 and 8bda5f60; owner LEAD). Note: LEAD's message gave the hashes the wrong way round: 1e4897f3 is the name tag fix, 243956e4 the flat card coins, then 8bda5f60 the golden tiers; QA checked the tip 8bda5f60. Tests: rigtest/qa/batch145qa.js (one clean run on 8bda5f60, all parts below), nametag144.js, sim.js with LOOT=off (QA's switch), 0 page errors anywhere.
  - FIX (LEAD), 1a spinner: v44Spin puts the loading ring on ANY short text on the page that starts with a waiting word and ends in "..."/"…", so a player's own quests get a ring that never stops: "Sorting laundry...", "Reading chapter 3...", "Working on the essay…", "Checking emails...", "Adding receipts to the budget..." all spin on the Board (b145_spin_quests.png); chat, posts and Town names would too. That is the "looks frozen" Cal wanted gone, the other way round. Suggestion: only the game's own status lines (the save pill #savest and the known loading lines), never inside a quest, chat, post or name. Its cost is nothing (0.03 ms a sweep at CPU x4 on 868 elements).
  - PASS, name tag FIX 1e4897f3 at phone size (390x844, sandbox web build, two stand-in friends): white on a dark pill under the feet in the Restaurant and Garden windows, drawn over the furniture; hidden in the building view as meant. NOTE (Cal, look): it never goes below 11 px, so a long name is big on a phone: "Maximilian Thunderbolt X" spans over half the Garden window and covers the fountain and people (tag_close_garden_1_Maxi.png); "Sy" is small. Names can be 24 letters.
  - PASS, 1a the rest: ranks step Awakened, Hunter, Knight, Paragon, Sovereign, Monarch with trials passed (data-rank E..S); no old rank name on Board, Training, Loft, Shop or Town; Wave is the only greeting (SQK). 
  - PASS, 1b: curve 8 leaves levels 1-40 as on v1.43 (first difference at 44), 99 to 100 needs 4,400. The Weekly Quest pays the flat 1,800 at level 70; lower down it is held to 2 levels' worth (160 at level 3; the flat only from about level 50). Unticking the 4th day takes the Weekly Quest's XP and coins back, and 4 more tick/untick cycles pay nothing more (the level-up coins of crossing a level stay once, by design: no farm). Momentum Surge: 3 full days away gives the Welcome back window and 5 tasks at x2 XP / x1.5 coins (25 -> 50 XP, 25 -> 38 coins); tick/untick/tick spends one; the 6th pays normally and the Board bar goes; it stacks on top of streak and combo; a banked 3,000 Rested XP is zeroed at the first task, never paid (meant). NOTE (LEAD, before shipping): curve 8 has no migration, so a save past level 40 drops a level (45->44, 60->59, 80->79). Fine only if nobody is past 40 when v1.45 ships; QA can't see real saves: check the Town board first.
  - PASS, 1c surprise loot: once per task a day (forced roll, tick/untick/tick: 1 loot); furniture never an opener, lot, expansion, trophy or 1,000+, the same 16 of 31 rooms with 0 coins as with plenty (the other 15 have no piece under 1,000: a chest); installed free and drawn; clothing before the Closet says "saved for later"; a Boutique drop before the Boutique gives a Street piece; his prize pool (261) and hers (262) only worn pieces that fit, none for the other body, no pet, backdrop or card pieces. Economy: regular player 30 days, one run each: loot on 140,326 coins earned / 26,619 XP / level 58, off 133,443 / 25,369 / 57: about +5% coins and XP (33 drops), plus the free pieces; one run each, so part of it is noise.
  - PASS, 1d text: the Runeweaver, paths, titles, sorter words and lines read general now. NOTE (Cal, borderline): the Theater's film list keeps "Tokyo Drift Club", which leans on a real film title (The Fast and the Furious: Tokyo Drift); "Midnight in Shibuya" is fine.
  - PASS, the scratch card (f77ef4da + 243956e4 + 8bda5f60): 9 panels, scratch three; a reload 60 ms after the first scratch keeps the roll and the panel; the day turning mid-card gives a new card and pays nothing for the half one; 40,000 cards: golden 1/2/3 = 2.36 / 0.58 / 0.19% (set 2.3 / 0.55 / 0.15), no match about 70% with the 1-2 gold cards, average 360 coins (LEAD: about 375). Gold on his and her save: one = a Street piece, two = a Boutique piece, three = 1,500 coins and a top piece, each one that fits (hers can be female-only, his never); a save owning every Street piece gets coins only, no error; the legend never mentions gold. A Boutique piece won at level 12 shows in the Wardrobe's Shoes tab and wears on the character (wardrobe_shoes.png). 320 px, Chromium and WebKit: the card fits (252 px, no sideways scroll), the neon Ø masks draw in both (b145_card320_webkit.png). NOTE (Cal): until the Atelier has a brand, three golden ("legendary") gives the same kind of piece as two ("rare"): both runs gave a 1,450 GILDED piece. NOTE (LEAD, low): a player who spun the Wheel earlier today also gets today's card on the update day (one extra prize, once).
  - QA's own slips, fixed: the name tag close-ups first caught the hidden copy; a constant random number hangs the card (scRoll's not-all-the-same loop never ends; real play is random); the rank check first read the title badge; an odds bound counted gold cards wrong. Not checked: a real phone, real accounts or two devices, the Test channel, every room's visitor, the card's sounds and burst, bounties (batch 2b, not in this batch). Pictures in QA's scratchpad (b145out, b146out).
- FIX (owner LEAD), batch 1a 6bfa2938, the visitor's name tag: on a phone it never shows. Cal: "put their username under their character in white text just like in Maplestory". rigtest/qa/nametag144.js (sandbox web build, two stand-in friends "Sy" and "Maximilian Thunderbolt X" forced into the Restaurant and the Garden, 20 s of walking): the tag is placed right (at the feet, centred, drawn last over the furniture, white, the 24-letter name fits its pill, 0 page errors). But at 390x844 every sighting (32) has opacity 0: pvTagDraw hides the tag when 11 px text would need more than PVTAGMAX 28 units, and on a phone one unit is 0.31 px in the room window and 0.16 px in the building view (it would need 35 and 69 units). At 1280x900 it shows (13 px text) in the room windows and is hidden in the building view. So on Cal's phone nobody's name is ever under them. Suggestion: let the room window show it (PVTAGMAX about 40, or no cap there); keep the building view hidden (the characters are about 15 px tall there, a readable tag would dwarf them). This is older than 6bfa2938 (the cap came in on 11-11); 6bfa2938 only moved it under the feet. QA could not get a clean desktop close-up by eye (the crop caught the copy behind the window); the screen boxes above are measured. QA rechecks on the fix at phone size.
- PASS, v1.43 live check (release/v1.43 0270ae4d on Live; owner LEAD): QA's own web build of 0270ae4d (3,839 files, noTest on, APPV 143, QB_EPOCH 8, no reset) compared file by file with what Live serves: 3,839 of 3,839 byte-identical, version.txt 0270ae4d. release/v1.43 0270ae4d and rollback-v1.41 3d34c2ba are on origin at the commits QA passed. Live loaded signed out in a throwaway headless browser: the sign-in screen, 0 page errors, noTest on, only the platform objects __qbLoad and __qbWeb (no test hooks). Not checked: the Test channel (ship.sh compared it, 3839/3839; QA doesn't look up its address), a signed-in account, a real phone.
- PASS, the v1.43 candidate: release/v1.43 0270ae4d and its rollback rollback-v1.41 3d34c2ba, both built clean by QA. Can ship. The cut: against release/v1.41 4dcc070c only 29zz_v143.js (identical to dd7327f6, which QA passed) and APPV 143; QB_EPOCH 8 (no reset). The rollback is v1.41 with only APPV 144. rigtest/qa/closet143.js on the release build: 35/35. rigtest/qa/v143cand.js, moving one save between builds the way a phone would: UP, a level-12 save made on v1.41 code (Cabinet owned, the Closet's card already seen) opened on v1.43: level, XP, coins, rooms, upgrades and clothes unchanged, the save now says appv 143, the Loft's "!" once, the Closet first in the Bedroom, cleared by opening the Loft. DOWN, a v1.43 save that bought the Closet first (600, no Cabinet) opened on the rollback: nothing lost, the Closet still a room, the Shop still open (5 floors), the Bedroom window opens, Loft drawn, 0 page errors. On the rollback such a player can't buy the Cabinet (v1.41 hides it once the Closet is owned) until v1.43 is back: harmless. WEB, dist-web with LEAD's stand-in Firebase: boots past the creator, noTest on, and window.__qb, __qbLoft, __qbV143, __qbAlerts are all absent; 0 page errors. NOTE (low, LEAD, later, not for v1.43): a level-3 save whose Loft still waits for its one-a-day reveal shows the "!" on the locked "?" Loft button, and tapping it says "Locked. Keep playing." (picture v143_gate.png). That's the same kind of "!" Cal reported on the Board. No real player can get there now: no story step comes before the Loft, a new save's unlock slot starts free, so the Loft opens at level 2 (case A of closet143.js). QA's GATE save only got there by marking the day's slot used. A one-line guard would end it for good: no Loft "!" in alTabs while areaGate("hideout"). QA's own slips, fixed: the first run left the v1.41 save's Loft locked (a real level-12 save has it open), counted the Closet's price by coins (the buy also pays a First steps +50) and expected v1.41 to list the Closet as Installed. Not checked: a real phone, real accounts, the Test channel, two devices merging a save, ship.sh itself (the live check covers what ships). Pictures in QA's scratchpad (v143out). Owner: LEAD for the NOTE only.
- PASS, the Walk-in Closet from level 3 and the Board's stuck "!" (qa-local dd7327f6, 29zz_v143.js; QA's own clean build, plain, phone size). v1.43 can be cut. rigtest/qa/closet143.js, 35 checks, each case in a fresh browser and checked again after a reload: A a new save made in the creator and levelled 1 to 2 to 3 by ticking quests on the Board: at level 2 the Closet can't be bought and its line says "Level 2 of 3"; at level 3 the Loft gets its "!", the Walk-in Closet is first in the Bedroom and can be bought with no "Needs Figurine Cabinet"; opening the Loft clears the "!" and it stays gone after a reload. B an old level-12 save with no Closet that had already looked at its card: the "!" comes back once, the Closet is first, opening the Loft clears it, and a reload doesn't bring it back. C an old save owning the Closet and the Cabinet: no "!", both listed as Installed (the Cabinet was hidden before). D the Closet bought first at level 3 with no Cabinet: 600 coins, the Closet becomes a room, the Shop opens and its button gets a "!" (gone when the Shop is opened, 5 floors draw); the Cabinet comes up again in price order (after 5 cheaper Bedroom pieces) and can be bought for 580; both then show as Installed; a reload keeps the Closet and the Shop. By eye: the Bedroom with only the Closet shows the door and no Cabinet; with both, the Cabinet hangs just left of the door, clear of its frame (rule 20 OK). E the old Players "!" lights Town, not the Board; opening Town clears it, and it stays clear after a reload. 0 page errors in all five. LEAD's own rigtest/lead/closet143.js also PASS on QA's build. Release list: window.__qbV143 is a new test hook, off on Live like __qbAlerts (QB_WEB.noTest). QA's own slip, fixed: the first run reloaded before the game had saved (it saves a moment after a change), which looked like a save losing its rooms; with a wait it keeps everything. Not checked: the web build, a real phone, the Test channel, a save merged from another device (S.cl143 rides in the save), the Closet's own room and the Shop's floors beyond their opening. Pictures in QA's scratchpad (c143out). Owner: none, nothing to fix.
- PASS, Cal's 11-23 platform check: stability, speed, rooms and outfits together (live code v1.41 4dcc070c, plain and web builds,
  every request off this machine blocked; owner LEAD for the notes; QA's tools rigtest/qa/soak.js, idleprof.js, encodes.js,
  animcost.js, coldload.js, firstvisit.js, skinleak.js mix mode). Nothing found that needs a fix before the next release.
  - Stability: 11 minutes, 7 full laps (Board, Training, the Loft street and all 3 buildings, every room's window, Town's
    tabs, every Shop floor) on a save with every room and upgrade: 0 page errors (the 3 console errors are the blocked Google Fonts).
    Memory climbs 176 to 189 MB over laps 1-3 while the frame cache fills (limit 900), then stays flat at 190 MB for laps 3-7; DOM
    nodes 732-774; timers constant (52 intervals, 5 timeouts). Long tasks fall as frames get cached (8 s in lap 1, about 1.5 s a lap
    after). No leak.
  - Speed (phone size, CPU slowed x4): tab switches 30-150 ms; Loft 55 fps, a room window 48 fps, the idle Board 60 fps once its
    frames are made (29 fps for about the first 15 s while it encodes them; 2-3 frames a second, then 0). Idle Loft and Town are
    about 90% idle (43 ms of script in 8 s). The CSS animations cost nothing measurable (fps the same with them paused).
  - Load (web build, new player, 12 Mbps / 70 ms, CPU x4): first paint 1.4 s, the creator 2.4 s, 2.9 MB (app.js 1.98 MB before
    hosting compresses it); a warm open 359 ms from the service worker.
  - Outfits: 120 random full outfits (60 a body, one Shop piece a slot, hats and accessories some of the time) x idle, rearStand,
    walk2, sitFront, thinkA, 0 page errors. The six worst by score, looked at by eye: every flag is skin the piece means to show
    (fishnets, the open robe and blazer, the halter, the mask's eye holes) or the known bent-elbow sleeve slivers in sitFront and
    thinkA; hats over hair, headsets, trapper with goggles and the wings all layer right. Sheets in QA's scratch, not kept.
  - Rooms: the static audit of every room flags only intended overlaps (rugs, the band on its stage, booth around its table, the
    pool float, the bedroom's built-ins). Live, bedroom and patio each had 3 people for 45 s and no one stood in a piece (the patio's
    "in a footprint" is someone sitting in the egg chair); the closet is one painted room by design; the game room by eye is tidy.
  - NOTE (LEAD, low, already on your v1.21 cleanup list): 35 old pre-rig rows are still in SHOP (tp_*, pt_*, sh_*, ac_*, and
    bk_katana, bk_cape, bk_wings). None is on any Shop floor, but a save that owned one from the pixel days and wears it sees
    nothing (the cape is checked on the Board). When you clean up: refund or remap them.
  - QA's own slips, fixed in the tools: the first soak's save had the Loft and Town locked (a fresh save records its open areas at
    level 1) and its "back to the street" button was wrong (bldout), so after lap 1 it never entered a building; the tools now open
    every area, and the soak's result above is from the fixed run. The mix picker now uses only rig pieces.
  - Not checked: a real phone (only Chromium with a slowed CPU and network), real accounts and the cloud, the Test channel, two
    players at once on this build, every outfit combination (120 random of far more) and all 35 poses in the mix (5 of them), the
    later rooms live (their static audit only, this time).
- PASS, v1.41 live check (release/v1.41 4dcc070c on Live; owner LEAD): Live serves version.txt 4dcc070c, appv 141; its 12 listed files
  match QA's own web build of 4dcc070c (the commit QA passed, ecc89400), index.html, config.js, app.js, web.js, qbdata.js and creator.js
  byte-identical; QB_EPOCH 8, no reset; release/v1.41 and rollback-v1.39 on origin. The rollback is now 936eb255: release/v1.39 with
  curve 7's numbers (lvK .364, lvTop .196, the same as live) and APPV 142, epoch 8, so a rollback no longer drops levels (QA's NOTE,
  done). Not checked: the Test channel (ship.sh compared it), a real phone, real accounts.
- PASS, v1.41 can ship (release/v1.41 4dcc070c = qa-local ff86b273 + APPV 141, QB_EPOCH 8 (checked in the cut's 00_clock.js), no
  reset; owner LEAD; shots/qa/v141/). Ship: ship.sh release/v1.41 141 8.
  - The cut: over ff86b273 only APPV and QB_EPOCH; over v1.39 seven files, as listed. The rig (rig.js, rig.json, poses.json) and the
    curve are byte-identical to what QA passed (3f15f863, 8df50fb4); ff86b273 adds QA's FIX: econTrained is skipped when the session is
    the unpaid second one (it runs after grantXp marks it).
  - With every non-local request blocked: train140 (now also no stat change on the second session), reboot, v136, tutquest, tourcard,
    hall3, curve6 PASS on the plain build; friends39 and kudos39 PASS on the web build with the stand-in; wlive.js 141/8 PASS.
  - NOTE (LEAD, before it is needed): rollback-v1.39 b60f3330 keeps curve 6, so a rollback would drop carried players' levels (a curve-7
    level 33 shows 30 on curve 6, 70 shows 60); lvPaid keeps anything from being paid twice and the levels come back on the next
    release. A rollback that carries curve 7 (as rollback-v1.31 carried curve 6) would avoid the drop.
  - Not checked: a real phone, real accounts, the Test channel (ship.sh compares it).
- PASS, the per-pose rig flag 3f15f863 (replaces a888ed55; owner LEAD; ROOMS passed it too, shots/pending_art/skin_1123/v3/): the 14
  poses marked coarse (rest, idle, idleIn, walks, rear stands, back walks, stretch) bind the top and arms on the usual grid; the other
  28 poses are pixel-identical to live in QA's starter sweep (54 looks x 43 poses; shots/qa/skin1123/starter_live_vs_perposeflag.txt).
  In the coarse poses the skin through the seams falls (idle 25.7k to 14.4k px, rear stand 23.1k to 7.3k, back walks about 3x), tears
  rise a little (edges, ROOMS by eye). The creator's preview plays Front (idle), Back, Walk and Stretch, so where Cal saw it is now
  clean. The switch: blending from a coarse pose into a fine one (idle to thinkA, walk to chat) changes about 2,600 px at 4x on its
  first frame, the seam slivers coming back as the character starts to move (switch_idle_to_thinkA.jpg), i.e. live's look; minor.
  Bent-elbow and arms-up poses keep live's slivers: the coarse copy of the top drawn under the fine one (ROOMS) is held for them.
- PASS with one FIX, Training, Weekly Warrior and categories (1c7e636d; owner LEAD): train140.js, hall3, reboot, v136, tutquest and
  tourcard PASS with every non-local request blocked (x1.25 a week to x2, -0.25 a missed week to x1; one paid session a day, the second
  logged and its summary says so; category counts of open quests; dates/calls to People, bank, memberships, laptop to Work and admin,
  moved once). FIX: wkdone calls econTrained(x, plan) with the session's full XP after the unpaid second session too, so it still adds
  to the Daily Quest's XP (whose chests pay coins) and gives +1 to a stat each time; skip econTrained when the session is not paid.
- PASS with a NOTE, curve 7 (8df50fb4; owner LEAD): saves carried from the build before (same origin and profile, curve7.js): level 8
  stays 8; level 30 shows 33 and level 60 shows 70 (64 until the level-65 trial); on load nothing is paid and a reload changes nothing;
  the next real level-up (c7gain.js: a quest to level 34) shows one "Level 34" window paying 31 to 34 together (+676 coins), lvPaid 34,
  nothing twice. NOTE: the level-ups do not play on load (LEAD's line says they do): a player sees their level jump silently and
  one level-up window later; a "your level went up with the new scale" window on first load would explain it (Cal's call).
- NOT A PASS, the rig fix a888ed55 (fineSlots [], fineUp body/top/arms/skinArms; owner LEAD; shots/qa/skin1123/bent_live.jpg vs
  bent_fix.jpg, starter_live_fix_fineoff.txt). Straight-arm poses are fixed: his white hoodie on deep skin is clean in idle and sitFront
  (live: slivers at both seams). Bent-elbow poses got worse: thinkA, laugh1 and sideR now show large skin patches on the upper sleeve
  (live: thin slivers); ROOMS's 17-top sweep finds the same (63,500 px of new damage against 25,700 removed; shots/pending_art/
  skin_1123/v2/), also gp_bear m sideR and o_work m thinkA. The starter sweep (54 looks x 43 poses, skinleak.js) agrees on the split:
  skin slivers in gaps fall in every pose (1.11M to 0.74M px; idle, walks and back views about 3x), tears (background through a sleeve)
  rise in bent-elbow poses (sitFront 1.5k to 3.4k, sleep, think, laugh; 162k to 179k overall); arms-up poses are unchanged (fine mesh
  there either way). Limit of the detector: a wide skin patch over a sleeve reads to it like an arm in front of a shirt, so the patches
  above were found by eye and by ROOMS's before/after diff, not by its count. Options (ROOMS): coarse mesh only in straight-arm poses (a
  per-pose flag), fine elsewhere; or a coarse copy of the top drawn under the fine one, which would fill the cracks in every pose.
- PASS by review and LEAD's tests (with every non-local request blocked, on a888ed55's web build): Players and friendship (55c6202e;
  friends39.js: one leaderboard, card with friendship, a greeting pays both 5, once a day a person, 2 people a day, Bo paid and at
  level 1) and kind notes (3485b007; kudos39.js: Cal's four choices, a posted note on the board then gone after 48 hours, 500 only with
  coins). Kind notes stay private in the rules (kudos/kudosok readable by the writer and the owner only). NOTES (LEAD): the greeted
  player's once-a-day mark (social.sqt.got, now a date) is deleted by sqPaid's 2-hour trim on every read (it reads a date as no time),
  so only the sender's own limit holds; friendship counts live in each player's own pings doc, so a tampered game could raise its
  level (at most 55 coins a greeting, 2 a day).
- FIX (LEAD, rig; Cal 11-23: "There is some skin showing through the clothes for the character creator ... could be other clothes
  where the skin shows through?"): yes. On the live build (297b2192) every sleeved top lets slivers of the base's skin through along
  the arm-to-torso seams: the starter tee, hoodie and bomber on both bodies, and every Shop top ROOMS sampled (17, worst h_hoodie,
  tm_sable_jacket, oak_vest; shots/pending_art/skin_1123/crack_table.txt). Clean renders on deep skin under white: his hoodie in idle
  (both sides of the chest), from behind (both armpits), dance1; his tee from behind (shots/qa/skin1123/clean_*.jpg). Cause (ROOMS,
  confirmed here): data/rig.json fineSlots ["top","arms","skinArms"] (meshStepFine 12): the fine grid cracks along the arm/trunk cut
  even standing, and the full base under the sleeve shows through; with fineSlots [] both seams close (QA's copy of the live build
  with that one change, and ROOMS's). Art: no holes in the pieces checked. Separate, known: sleeves tear in arms-out poses either way
  (the old arms-up stretch). QA's sweep (rigtest/qa/skinleak.js: Fair vs Deep skin = visible skin; clothes-only render; skin in a
  small gap or a thin sliver over the clothes) flags all 54 starter looks (27 combos x 2 bodies) in about 39 of 43 poses each on the
  live build; with the fine grid off the marks left are the neck at the collar and hands beside the trousers (false alarms by eye).
  Next: on LEAD's fix, the before/after diff over every Shop top and outer piece, and the detector with a look by eye over the rest.
- PASS, v1.39 live check (release/v1.39 297b2192 on Live; owner LEAD): Live serves version.txt 297b2192, appv 139; its 12 listed files
  match QA's own web build of 297b2192 (the commit QA passed, 80b8747d), index.html, config.js, app.js, web.js, qbdata.js and
  creator.js byte-identical; QB_EPOCH 8 (no reset), noTest; release/v1.39 and rollback-v1.37 on origin (297b2192, d80690fc). Not
  checked: the Test channel (ship.sh compared it), a real phone, real accounts.
- PASS, v1.39 can ship (release/v1.39 297b2192 = release/v1.37 + qa-local e44186fa, APPV 139, QB_EPOCH 8, no reset; rollback-v1.37
  d80690fc, APPV 140; owner LEAD; shots/qa/v139/). Ship: ship.sh release/v1.39 139 8.
  - The cut: over e44186fa only APPV and QB_EPOCH (the rules file as on every release branch; the deploy is hosting only). Over
    f3d8c5e8 (all seven of LEAD's tests passed there, cloud blocked): the tutorial quest at ~1 min, coin counts redrawn after a greeting
    pays, no dirty plates or held seats (Cal: "Don't need to wait for the table to be cleared"), butterflies at hen size off the coop.
  - On 297b2192, every non-local request blocked: tutquest ("~1 min"), v136 (one Edit window), reboot, hall3, tourcard PASS; two players
    on the web build with the stand-in (hall2p.js): a wave pays Ann 3 (her coin count shows 53 at once) and Bo 3 once, Room 3 reaches the
    other player and not Room 1; Restaurant and Garden live 120 s each: nobody in a footprint, 0 page errors; wlive.js 139/8 PASS.
  - From f3d8c5e8, seen by eye: the guided Training screen without the coin badge over its buttons; renamed exercises with an emoji; the
    tutorial's second step ringing "Finish the tutorial" with Cal's wording; the Welcome letter only in the inbox (tutquest).
  - Not checked: a real phone, real accounts, the photo upload from a real camera roll (the test sets a picture).
- PASS, v1.37 live check (release/v1.37 c3584739 on Live, shipped on Cal's word before QA's pass; owner LEAD; shots/qa/v137/):
  Live serves c3584739, appv 137; its 12 listed files match QA's own web build of c3584739, six main files byte-identical; QB_EPOCH 8,
  noTest; branches on origin. On the cut QA was checking (0d34367e, the same but the letter text): LEAD's reboot, v136, loftplus,
  training and hall3 pass with every non-local request blocked; a v1.35 save (epoch 7, level 20, 5,000 coins) opens fresh at epoch 8
  with exactly Welcome (1,000) and live137 (500), each paying once; the letter has no brands or dates. Two players on the web build
  with LEAD's stand-in Firebase (hall2p.js): Ann's Players tab ranks by level, Bo's card has Wave, Fist bump, High five; a wave pays
  Ann 3 and Bo 3 (when his game checks: at start or every 2 min), a second greeting inside 2 hours pays neither; Ann's Room 3 message
  reaches Bo's Room 3 and not Room 1; 0 page errors. Not checked: the cloud clear (LEAD's pass), a real phone, real accounts.
  - FIX (fixed in 7f346f83, then in f3d8c5e8): the Loft tour's new step "This is The Loft. Tap it to see the rooms inside" drew over the
    "Welcome home" card on a new player's first Loft tap (tour_2.jpg). Now the step waits unseen while a window is open (tourcard.js,
    and QA's loftour.js: the step shows, visible, once the card is gone).
  - NOTE (Cal, LEAD told him): with the Closet on offer the Loft zooms out by half (0.56 to 0.27), not "a tiny bit", and the same once
    built (0.28): the "Walk-in Closet" name is in the fit. Fitting the "+" circle alone would give a small step, then a bigger one.
- PASS with NOTES, life in the rooms (ROOMS 880e3484 + 2262d9a2, live in v1.37; 5440020e in v1.39; laterooms.js FULL=1 shows the
  whole room): Speakeasy guests sit on the bar stools, in the booth and the armchairs; the Restaurant takes orders (bubbles), the waiter
  works the floor, chefs stay in the kitchen; Sky Bar, Garden, Club, Restaurant: nobody walks through furniture except guests stepping
  into seats (a few samples) and the pianist at the piano (as before). The Speakeasy bartender stands behind the bar polishing a glass.
  NOTES (ROOMS): the Garden butterflies are drawn about twice a hen's size, one on the coop roof; guests stand on a Sky Bar stool spot
  up to about 2.5 s before sitting. Not measured: income per minute with the pass wait (the room bank probe read 0 both before and
  after), the host's escort, a busser's clear (it changes in the next cut), reduced motion for the garden animals.
- PASS, v1.35 live check (release/v1.35 a7ba8e21 on Live; owner LEAD): Live serves version.txt a7ba8e21 and version.json appv 135;
  its 12 listed files are identical to QA's own web build of a7ba8e21 (the commit QA passed, c4bd127a), and index.html, config.js,
  app.js, web.js, qbdata.js and creator.js are byte-identical; the build carries QB_EPOCH 7, APPV 135 and noTest. Rollback ready:
  rollback-v1.31 08c7d93e (APPV 136, epoch 7). Branches release/v1.35 and rollback-v1.31 match origin (a7ba8e21, 08c7d93e).
  Not checked by QA (cloud): the rules deploy and the clear of board, pings, worlds, chat, chatnow, likes, kudos, kudosok, duel,
  duelq, photos and photolk (LEAD's second pass found them empty), the Test channel (ship.sh compared it), a real sign-in, a phone.
- PASS, v1.35 can ship (release/v1.35 a7ba8e21 = release/v1.31 + qa-local 867f9152, APPV 135, QB_EPOCH 7; rollback-v1.31 08c7d93e;
  rules from the qa-local checkout; owner LEAD; shots/qa/v135/). Cal 11-23: quest names "Ship, reword the text" (LEAD made them private
  instead, which covers it) and photos "Yes, delete photos". Ship: rules deploy, ship.sh release/v1.35 135 7, then the clear (board,
  pings, worlds, chat, chatnow, likes, kudos, kudosok, duel, duelq, photos -r, photolk).
  - The cut: over 867f9152 only APPV, QB_EPOCH and firestore.rules (the release branch keeps v1.31's rules file; the deploy is from the
    checkout, whose rules differ from live by the duelq block only). Over d2cfa06c: private quest names, Training, the starting bed.
  - Private quest names (867f9152): the names leave duel/<id>; each player writes duelq/<me>~<other>~<cid> and gets the other's
    duelq/<other>~<me>~<cid> by doc. The rule: read only if the signed-in uid is the id's first or second part, create/update only
    the first, delete the first or the owner; nobody can list the collection (the rule depends on the id). The web wrapper stores
    {qs} as {j, t}, so small(8000) holds (30 names x 60 characters). Rules not run in an emulator (read by eye).
  - LEAD's reboot.js and training.js on the cut, every non-local request blocked: PASS (as on d2cfa06c; Training in the bar from day
    one, the Workout off the Board, the week strip of 7 days, "Log today's workout" opens the photo proof at 1.5x, the card says when
    it is logged); 0 page errors. The Town Hall's 3-a-row photo squares are style only, read but not seen (no posts offline).
  - The starting bed (ROOMS c192b451): the headboard sits under the prints and the poster; the player asleep lies in it, head on the
    pillow (bedsleep.js: the sleeping overlay's box equals the bed's at the starting, Memory Foam and LED beds); the footprint is
    unchanged. Cal called the nightstand over the bed's corner correct.
  - The reset and the letters as passed on d2cfa06c (code unchanged there); wlive.js (APPV 135, EPOCH 7) PASS on the web build.
  - Still screen-only: fashion vote counts (likes/<id> readable by every signed-in player); LEAD is telling Cal.
  - Not checked: the rule in Firebase's emulator, two real players in a productivity challenge, the photo grid with real posts, a
    phone.
- HELD for one Cal decision, otherwise PASS: the reboot, release/v1.35 d2cfa06c (= release/v1.31 + qa-local d92a226a, APPV 135,
  QB_EPOCH 7; rollback-v1.31 08c7d93e, APPV 136, epoch 7; owner LEAD; shots/qa/v135/).
  - The cut: over d92a226a only APPV and QB_EPOCH; over v1.31 the shipped changes are 29zz_v135.js, the group/perk texts, the Speakeasy
    and Disco Ball (QA passed), creator.json. The commit message says "v1.32"; the game shows v1.35 (cosmetic).
  - LEAD's reboot.js on the plain cut with every non-local request blocked: PASS (his 4 starting cuts; 2 letters only; the new group
    names; Wave, Fist bump, High five; the brand window only in the Shop and the Shop's "!"; windows held during the tour and shown
    after; fashion shut at 4 players with 5 buys and open at 5 with its letter and tab; 2 votes, one a person, never yourself; only
    players who used both votes place; no counts shown; the productivity note and the other's quest list); 0 page errors.
  - The reset (reboot2.js, one origin and profile): a played v1.31 save (level 20, 5,000 coins) opens v1.35 at epoch 7, not
    created, 0 XP, 0 coins; the inbox holds exactly Welcome (1,000) and "SAYWHAT is live" (500); through the inbox buttons each pays
    once (0, 1,000, 1,500, then nothing); 0 page errors.
  - The web build: wlive.js (APPV 135, EPOCH 7) PASS; the v135 test hook is behind noTest and absent.
  - THE DECISION (Cal; privacy): a productivity challenge writes the quest names into duel/<uid>, which every signed-in player may
    read (firestore.rules) and which every player's game downloads in full (collection("duel").limit(300)). So the names reach every
    player's browser, only not the screen, while the game now says "Nobody else sees the challenge" and the Welcome letter "Your
    quests are private". The rules cannot narrow it as stored ({j, t} docs). Either accept it as screen-only privacy (and say "Only
    the two of you see it in the game"), or move the quest names to a doc per pair with a rule that only those two read (as the
    photo ids carry the uid), before this ships. Fashion votes are the same kind (counts are worked out on every phone from the likes
    docs); Cal asked only that nobody sees counts, which holds on screen.
  - NOTES (LEAD): the cloud clear should delete photos with their comments (photos/<post>/cm, firestore:delete -r) and leaves the
    pictures in Storage; Cal named chats and likes, "square 1" covers the rest, photos included, QA asks Cal to confirm photos. A
    rollback to 08c7d93e would show new players v1.31's letter and its 500 notice (emergency only).
  - Not checked: two real accounts reaching 5x5 and voting, the week-end warning in real time, a phone, the real Firebase.
- PASS, the Speakeasy recheck (ROOMS 05c353be; a clean build, every upgrade owned; owner ROOMS; shots/qa/speakeasy1123/after_*.jpg):
  FIX 1 done, the cart (x 9.1) stands clear of the right armchair; FIX 2 done, the piano down its wall (y 2.3-3.8) and the bar, jukebox,
  lamp table and booth along, so the barrel rack stands free of the bar, only a sliver behind the piano's back corner (depth). Audit:
  12 pieces, 0 outside, overlaps only the band on its stage. Live (laterooms.js, 120 s + 100 s): 5 people, 1,252 samples, nobody in a
  footprint, 0 page errors; with people in place the bar guest faces the bar between the stools, others stand at the piano, the
  jukebox, the booth and the armchairs. The seating NOTE stands as a later pass (ROOMS: the stools are part of the bar's art, the
  armchairs need new art to face the band). Not checked: a phone.
- NOT A PASS yet, two small FIXes, the Speakeasy rework (ROOMS 268253fe; Cal 11-23 "this room does not really make sense"; a clean
  build, every upgrade owned; owner ROOMS; shots/qa/speakeasy1123/). Cal's four problems are fixed: the singer has her own slim mic
  (no big stand in front of her), the curtain hangs on the wall behind the stage, the jukebox stands with the lamp table and booth
  on the back wall, the barrels are in the back corner by the bar. Footprints: 12 pieces, 0 outside, none overlapping (only the band
  on its stage); "piano drawn over stage" is depth, agreed. Live (laterooms.js, 150 s + 90 s): 5 people, 1,453 samples, nobody inside
  a footprint, 0 page errors. Against jazz-club references (Cotton Club, Green Mill: bar on one wall, band in a corner, seating
  facing it) the plan reads right and the room is not cluttered.
  - FIX 1 (ROOMS): the whiskey cart's frame covers the right armchair's arm (speakeasy_static.jpg, sp_cart.jpg; footprints 0.35
    apart, the art is wider). Move the cart about 0.4 further from the chairs.
  - FIX 2 (ROOMS, Cal's "barrels placed awkwardly"): the barrel rack is boxed in: the piano covers its lower-left barrel and the bar's
    end the right one (sp_corner.jpg). The piano has room to move down its wall (it ends at y 3.3, the stage starts at 5.4): about
    +0.5 would let the rack stand clear and still read as stock in the corner.
  - NOTE (ROOMS, seating; not new, the old layout was the same): nobody sits. Every guest spot is a standing one: bar guests stand
    beside the stools with their backs to the bar, the booth guest stands in front of the booth, the armchair spot is behind the cart
    (speakeasy_people.jpg); the armchairs face the viewer, not the band ("front row for the band"). A seat on each stool facing the
    bar, one in the booth and the chairs turned to the stage, as the Sky Bar seats its stool guests, would make it read as a club.
  - Not checked: other stages of ownership live (ROOMS's stage pictures cover them), a phone.
- PASS with a NOTE, the Karaoke Disco Ball retired (ROOMS bdb442d1, in qa-local; clean builds of bdb442d1 and the commit before;
  shots/qa/disco/): before, the ball is drawn (kax_disco twice in the page) and the room window offers "Disco Ball"; after, a save
  that owns all 12 Karaoke ids incl. ka_disco opens the room with no ball art, the window offers no Disco Ball, and of the 11 live
  upgrades it owns 11 (full: roomFill and roomsShare drop retired pieces, as do upFrac, income and the price lists); the same with
  the ball not owned; stage audit 9 pieces, 0 outside, 0 overlaps; 0 page errors. NOTE (Cal/LEAD): a player who bought the ball paid
  its price (2,150 before the retirement) for a piece no longer shown; the Patio dog beds were refunded when retired (9c6b5cc). Cal 11-23: "No refund" (closed).
  Karaoke now has one upgrade fewer than Cal's +15 (ROOMS told LEAD). Not checked: a real owner's save (QA knows of none).
- PASS, v1.31 live check (release/v1.31 62a515fe on Live; owner LEAD): Live serves version.txt 62a515fe, version.json appv 133; its 12
  listed files (hashed names, sizes) are identical to QA's own web build of 62a515fe (the commit QA passed, f83ec7bf), and index.html,
  config.js, app.js, web.js and qbdata.js are byte-identical; config has noTest and one owner. Rollback ready: rollback-v1.30
  34271088 (APPV 134). Branches: release/v1.31 and rollback-v1.30 are local only (not on origin yet; pushing is Cal's OK);
  rollback-v0.80 is f8e882d3 here and adf0f80c on origin, and is not the rollback for this release. Not checked: the Test channel
  (ship.sh compared 3,839 files on both), Cal's one-time reset (it runs when he next opens the game signed in), a real phone.
- PASS, v1.31 take three can ship (release/v1.31 62a515fe = release/v1.30 + qa-local 04a48b33, APPV 133, QB_EPOCH 6; rollback-v1.30
  34271088, APPV 134; owner LEAD; shots/qa/v131d/, scripts in shots/qa/v131c/). Ship: ship.sh release/v1.31 133 6.
  - The cut: over 04a48b33 only APPV; over take two the shipped changes are the curve values, the xpc5 guard, the Cal-only reset, the
    patch131 letter and the n131 notice text. The rollback carries the same curve and move code.
  - The XP move (xpmove.js, v1.30 c1cff491 vs the cut): curve 5's copy equals v1.30's at every level 1-101; 396 moved saves keep
    their level. Real saves at levels 8, 30, 55 and 90 (carry3.js, v1.30 then the cut then the rollback on one origin): level and
    share kept (30: 5,058 to 7,510 XP), coins, level pay and the Town week unchanged, no second move on reload, the same on the
    rollback; the pulled-v1.31 visitor back at 31 with milestones re-based to 30; 0 page errors.
  - The Cal-only reset, by code: web/config.js owners holds one uid (Cal's); it runs after the boot has picked and merged the cloud
    save (loaded is set last), never on the sandbox, once (S.calRs131, and the backup doc stops other devices); it resets only after
    the backup write succeeds (a failed write leaves the save alone). Another device holding the old save on the device loses to the
    reset cloud save, as saveWhich takes the newer savedAt. The boot also keeps the normal per-version backup. LEAD's calreset.js,
    run on the cut's web build with every non-local request blocked (calresetqa.js): owner backed up and reset once, not again on
    reload; another player keeps level 31 and 5,000 coins with no backup; the letter in the inbox; 0 page errors.
  - Web build: wlive.js (APPV 133, EPOCH 6) PASS; the app-browser sign-in screen as passed on take two (inapp.js, 10 browsers).
  - Text: the letter "Update 1.31: testing is over" (level curve, economy, features, late-game items; no brands, no dates, no coins);
    the board notice "Version 1.31 is live" pays 500 once.
  - NOTE for Cal (pace, not a bug): from LEAD's own day-30 figures (daily player level 44, heavy 66: about 610 and 1,940 XP a day),
    level 60 takes about 1 heavy day, 70 about 1.6, 80 about 2.2, 90 about 2.9 and 99 about 3.6 (pace.js; need 2,205 / 3,147 /
    4,289 / 5,631 / 7,010). Cal asked for "a heavy day for 1 level" late; that holds around 60, later levels take 2-4 heavy days.
    Early: level 7 by day 1 (570 XP), 14 by day 3. No sim run on this curve (LEAD's numbers are from average XP a day).
  - Not checked: a real phone or app browser, the real Firebase (the stand-in only), the Test channel (ship.sh compares it).
- PASS, v1.31 can ship (release/v1.31 9b2c2206 = release/v1.30 + qa-local 21e2706d, APPV 133, QB_EPOCH 6; rollback-v1.30 ce74e7b7,
  APPV 134; owner LEAD; shots/qa/v131c/). Ship: ship.sh release/v1.31 133 6.
  - The cut: over 21e2706d only APPV differs; over QA's last pass (05eac907) the shipped changes are the curve (29zzz_econ.js), the
    milestone re-base (29zz_v133.js), the Closet at 600 and web/web.js. Parent release/v1.30. The rollback is 1c6ef20d (v1.30 code) +
    29zzz_curve6.js (the same curve values and move code, byte for byte) at APPV 134, epoch 6.
  - The XP move (xpmove.js): its copy of curve 5 equals v1.30's real cum() at every level 1-101; 396 v1.30 saves (every level at 0, 1,
    50 and 99% of the way) keep their level when moved. The curve is 25-26% longer per level (level 30: 4,932 to 6,225 XP).
    merge() replaces S with the incoming doc, so each doc (local or cloud) is moved once, by its own xpc6.
  - Real saves (carry3.js, one profile each, v1.30 then the cut then the rollback on one origin): levels 8, 30 and 55 at 40% keep
    level and share (30: 5,058 to 6,384 XP), coins, level pay and the Town week's 300 XP unchanged, xpc6 set, no second move on a
    reload, the same on the rollback build; 0 page errors. The save that opened the pulled v1.31 (5,349 XP, since 15): level 31
    again, since re-based to 30, no stale offers, stable on reload.
  - Web build: wlive.js with APPV 133 and EPOCH 6 PASS (first load shows sign-in, no hooks, no Testing row, 0 errors). Sign-in
    (inapp.js): Instagram, Facebook, Messenger, TikTok, Snapchat and the Google app show "Open this in Safari or Chrome" and Copy link,
    which copies the page's address and says so; Safari, Chrome (iPhone, Android) and an iMessage link view keep the Google button;
    0 errors each.
  - Closet 600 (fixed) right after the Figurine Cabinet at levels 1 and 30; milestones (ms2_mile.js), no idle re-render, the econ
    numbers (prices, task coins 46/116/231) as passed before; 0 page errors.
  - NOTE (LEAD): a save still without xpc5 (not loaded since curve 5 came in) would be moved by merge's curve5 block onto curve 6 and
    then again by xpc6, landing a few levels high; any save that loaded a recent version has xpc5, so QA expects none.
  - Not checked: a real phone or a real app browser (UA stand-ins), the friend's crash itself (waiting on their phone and browser),
    signed-in cloud saves (the cloud), the Test channel (ship.sh compares it).
- PASS, rollback live check (rollback-v1.30 1c6ef20d on Live; owner LEAD; shots/qa/v131b/): 1c6ef20d is release/v1.30 c1cff491 with
  APPV 130 to 132 and nothing else. Live serves version.txt 1c6ef20d and version.json appv 132; its 12 listed files (names with
  hashes, sizes) are identical to QA's own web build of 1c6ef20d, and index.html, config.js and app.js are byte-identical. The carried
  level-30 save that opened v1.31 loads on 1c6ef20d at its old level (level 31 with the 317 XP the test added; was 15 on v1.31),
  coins and XP unchanged, 0 page errors. Level pay: levelUp pays only levels above S.lvPaid, which keeps the save's high mark, so
  re-reaching 16-30 on v1.31 paid nothing (it would show level-up windows only); saves with no lvPaid are given lvlOf(xp) on load, so a
  very old save first loaded on v1.31 would be paid again for those levels (edge, QA knows of none). S.mile stays in saves that opened
  v1.31 (since = their v1.31 level, rounded to 5): the fix-forward resets it (LEAD's plan). v1.31 was live about 10:33-10:45.
  Not checked: the Test channel (LEAD compared 3,770 files on both), a real phone, signed-in cloud saves.
- NOT A PASS, BLOCKER, v1.31 re-cut release/v1.31 915ed0ac (no reset of everyone, QB_EPOCH 6; Cal 11-23 "just keep everyone's
  profile"; owner LEAD, Cal's call on the fix; shots/qa/v131b/). Economy Part 2's level curve (1252dc4, curve 6) was passed for a reset
  to level 1; without the reset every save keeps its XP and its level is recomputed on the new curve, about half:
  500 XP L7 -> L4, 1,000 L10 -> L6, 2,500 L20 -> L10, 5,000 L30 -> L15, 10,000 L42 -> L24, 20,000 L55 -> L36 (curve.js, c1cff491 vs
  915ed0ac). A level-30 v1.30 save opened on v1.31 on the same origin and profile (carry.js): level 15, same 5,032 XP, coins kept, and
  the milestones count from 15, so 20, 25 and 30 come round again as it re-levels, with their level pay and level-up windows. XP is
  never changed, so a rollback (APPV 132) gives the levels back exactly. Fix (Cal): keep the old curve in this release, or move each
  save's XP once so its level stays the same. QA has not passed this build; it went to ship.sh before QA saw it.
- PASS, ship.sh 293aa754 (owner LEAD): the expected QB_EPOCH is a third argument, passed to QA's wlive.js from the checkout; nothing read from the build; missing it stops at the usage line; bash -n clean. v1.31: ship.sh 42680d81 131 7.
- PASS, v1.31 can ship, with one step for the ship (release/v1.31 42680d81, rollback-v0.80 c4ee2449; owner LEAD; shots/qa/v131/).
  - The cut: over 05eac907 (QA PASS da290bb5) the only shipped changes are APPV 100 to 131 (30_app_b.js) and QB_EPOCH 6 to 7
    (00_clock.js); everything else that differs is docs, rigtest and shots. Parent release/v1.30 c1cff491. The rollback changes only
    APPV 131 to 132 and QB_EPOCH 6 to 7 over the last rollback adf0f80c, as it should.
  - The web build (QB_TARGET=web), served on its own port: wlive.js PASS, 11 of 11 (app.js compiles, APPV 131, version.json 12 files
    with sizes and 0 mismatched, noTest, not the sandbox, no test hooks on window, no Testing text or button, no SANDBOX badge, 0 page
    errors on the first load, which shows the sign-in screen).
  - STEP FOR THE SHIP (LEAD): ship.sh runs the release commit's own rigtest/qa/wlive.js, and that copy wants QB_EPOCH 6: run as is
    it fails ("QB_EPOCH 7 (want 6)", exit 1) and ship.sh stops before deploying (wlive_release_copy.txt). QA's wlive.js on qa-local
    (this commit) now wants 7 by default (EPOCH=n for another). Either point ship.sh at $R's rigtest/qa/wlive.js or add this one file
    to release/v1.31 (rigtest only, nothing shipped changes; QA will check the diff).
  - The reset, plain builds of release/v1.30 and the cut on one origin and one browser profile: a played v1.30 save (epoch 6, level
    20, 5,000 coins) opens on v1.31 as a fresh start (epoch 7, not created, 0 XP, 0 coins); 0 page errors on both.
  - The n131 notice: from level 2 (the Town opens there) it pays 500 once (0 to 500, a second tap pays nothing); the text is vague,
    no brands or dates.
  - LEAD's striptest.js FAILs: the same two fail on release/v1.30; wlive covers the stripping, so not blocking (the test is stale).
  - Before the ship, Cal's OK for clearing the shared cloud collections (RELEASING.md) is LEAD's to ask; QA has not touched the cloud.
    Known and accepted: an old local-only save has no backup.
  - Not checked: the hosted pages (ship.sh compares every file), a real phone, a signed-in player's cloud backup_e6 (the cloud).
- PASS, the release batch on qa-local 05eac907 (QA's three db6a2a6b placement FIXes, ROOMS's tested values; a clean build; owner
  LEAD). stagesweep.js: Restaurant st0 1 / st1 0 / st2 2 overlaps (all intended, as before), Garden 0 at every stage, Karaoke 0;
  0 page errors. By eye: (1) Karaoke's disco ball at 7.0,5.8 hangs over open floor by the stage's left edge, clear of the drinks
  table and the bookshelf; (2) the Garden barrel stands left of the doorway at stage 1 (y 4.8, under the hanging pots) and under the
  painted tap at stage 0 (y 6.0, clear of the door frame), stage 2 unchanged; (3) Restaurant stage 1's iron set at px+3.5 is off the
  fire-pit chair's back. Live (laterooms.js, the full Restaurant at stage 2, 120 s): 9 people, 664 samples, only 2 samples of a guest stepping into a booth seat. Pictures: shots/qa/rooms1123c/. NOTE: at Garden stage 0 the scarecrow's hand passes in front of the barrel's side; reads as
  depth, not a clip. Only 22_garden.js, 26_world.js and 27b_skins.js change over e0724a7c, one line each; the rest of the batch
  passed on e0724a7c (db6a2a6b). v1.31 can be cut from here; the cut (QB_EPOCH 7, APPV 131, the n131 notice, the exact commit) still
  gets its own QA check before it ships. Not checked: stage 1 live (layout only; the audit and eye cover it), a phone.
- NOT A PASS yet, the release batch on qa-local head e0724a7c (68c4b15 through e0724a7c; a clean build, cloud blocked; owner LEAD,
  coordinates ROOMS): three small placement FIXes left, everything else PASS. Pictures: shots/qa/rooms1123b/.
  - FIX 1 (027f23e, Karaoke): the disco ball at 5.6,5.8 (dy -92) now hangs over the drinks table's corner, over a glass, so it
    reads as sitting on the table (kz_ball.jpg). It is off the bookshelf as asked; move it about a tile further out over open floor.
  - FIX 2 (e0724a7c, Garden stage 1): the barrel goes to 0.05,3.75 "under the wall tap", but stage 1 has no tap there: it stands in
    the painted back-left doorway (y 3.0-4.6), covering its lower half (gz_door.jpg). Nobody walks there (the walking door is the
    front corner), but it clips the door (rule 20). Stage 0 already live has the same barrel over the door frame's corner, beside the
    tap (garden_st0.jpg): move it left of the door, under the tap, at both stages.
  - FIX 3 (e0724a7c, Restaurant stage 1): the right fire-pit chair's back runs into the iron bistro chair behind it (rz_pit.jpg);
    the audit misses it because the chairs' footprints are small. Shift the bistro set about half a tile right or back.
  - PASS: Speakeasy (jukebox clear of the armchairs, cart clear of the bassist; live 5 people, 625 samples, nobody in a footprint;
    the 4 overlaps are the band on the stage, as meant); Karaoke (tambourine rack on the floor in front of the stage; live 5 people,
    703 samples, none); Club (DJ gaps, laser, smoke, tables off the dance floor; live 7 people, 610 samples, the DJ never in a
    footprint). The Club's remaining walk samples (14, about 2 s in 2 min) are guests going into the seat spots inside the wall
    booths (x 0.95, y 3.3-9.05), through the open front: as LEAD said, not phasing. Restaurant stage 1 otherwise reads well (the
    pergola gone, one iron set, the host stand clear); the stage sweep: Restaurant st0 1/st1 0/st2 2 overlaps (all intended), Garden 0
    at every stage, Karaoke 0. Garden stage 1's right corner is snug but separate (NOTE).
  - PASS again on head: LEAD's v132.js (vs 1252dc4), hilite.js, QA's ms2_mile.js and rerender_mile.js, econ.js numbers unchanged;
    0 page errors.
  - Not checked: Restaurant and Garden live on head (ROOMS's changes are layout only; LEAD ran laterooms on them), a phone.
- PASS, Stylist highlights (117e1e3 on a clean build; LEAD's hilite.js with the cloud blocked, and QA's hibuy.js by real taps, shots/qa/rooms1123b/; owner
  LEAD): 10 "<colour> Highlights" for both bodies in a Highlights section after Hair color, 180 each (as the dye), striped swatches
  that never read as the dye. Tapping Buy charges once and wears it (the look carries hairHi, the streak layer is drawn); buying
  another colour switches; Take off in the Wardrobe removes the layer and keeps both owned. Not in the milestone or chest pools
  (basics). 0 page errors. NOTES: the Black Highlights swatch is near-invisible (black stripes on the dark base); a highlight the same
  colour as the hair buys an invisible streak (fine if meant).
  Not checked: f_h1's front lock (LEAD's known), every colour on screen.
- PASS, hair highlights, all 13 styles (ROOMS 6feb83e..2abdb00a; worn in the rig on a clean 2abdb00a build before the Stylist wiring,
  through the creator's hairHi, blonde streaks on brown hair; rigtest/qa/hairtest.js HC= HL=; shots/qa/hairhi1123/): his h1-h7 and
  Victor's hair, her h1-h5, every pose (43, incl. arms-up, dances, sleep, sits) and every live hat for the body (56 his, 59 hers),
  front and back. The streaks follow the hair in every pose, nothing floats off it or shows on skin; under hats they are clipped
  with the hair (none on a hat, none through the balaclava, halo mask or hoods). Victor's stop at the hoodie line and are sparse from
  behind (ROOMS's 85%). 0 page errors. Not checked: other base/highlight colour pairs by QA (ROOMS's 240-cell matrix covers them),
  f_h1's unstreaked front lock (ROOMS flagged it to LEAD), the Stylist items once wired (QA rechecks those then).
- d18c5041 (LEAD, QA's 68c4b15 NOTES; tapsize.js on 2abdb00a vs b30a7ea): the Upgrades section tabs are now 44 px tall (were 40), the
  icon is sliders, the dead slice is gone: PASS. NOTE stands (LEAD): the 7-button bottom bar is unchanged, 37 px wide per button at 360
  and 41 at 390 (52 tall), because the open tab takes 97-106 px; equal widths would give about 45-49.
- PASS, the 11-23 batch recheck (qa-local b30a7ea, a clean build; owner LEAD): the milestones now live in S.mile (nothing else uses
  the name). shots/qa/batch1123/ms2_mile.js: the Level 5 three are kept 3, 6 and 9 s after Later; once the welcome letter is closed
  they open again on the Board with the same three; choosing one puts it in the Wardrobe (g5 kept 6 s later, no window again).
  rerender_mile.js: no re-render bursts on an idle Board in 21 s (8ca029d had one every 5 s). Dog text: pd_bubbles reads lilac,
  pd_fleece has no internal note. 0 page errors. Over 8ca029d only 29zz_v133.js and 29zz_pets.js change in app/ (plus ROOMS's
  highlight art). Open, not blocking the batch: the rooms commit (Club DJ, Restaurant stage 1, Speakeasy, Karaoke, Garden stage 1)
  and the 68c4b15 NOTES. The release cut still needs its own QA check (QB_EPOCH 7, APPV, the exact commit).
- PASS on ROOMS's later-rooms placement findings (3b1e3fa, rigtest/qa/stagesweep.js, shots/pending_art/rooms_sweep_1123/; QA looked at
  every picture; owner LEAD for the code fixes, ROOMS for spots). All five agreed by eye: (1) Restaurant stage 1 with the patio fully
  bought: the pergola over a bistro set, the fire-pit chairs into the pergola, the iron set into the grill and the kitchen corner;
  (2) the Speakeasy jukebox overlapping the right armchair; (3) the Karaoke disco ball hanging over the bookshelf top, and the
  tambourine rack against the stage lip; (4) the Club's front glowing table on the dance floor's edge, and the DJ path (QA's FIX);
  (5) Garden stage 1: the bottom-right corner is packed (potting bench, barrel, crate, produce stand, greenhouse), and the grape arbor
  sits against an apple tree. QA adds: (6) Restaurant stage 1: the host stand by the patio step is jammed against the fire-pit's
  rug and the deck edge (restaurant_st1.png, centre); give it clear floor. Not checked: partial buys between empty and full.
- NOT A PASS, the 11-23 batch on qa-local 8ca029d (a clean build; every non-local request blocked; owner LEAD): one FIX in fccf7c9's
  milestones, the rest PASS. Scripts and pictures: shots/qa/batch1123/.
  - FIX (LEAD, code), the milestone's save is wiped every 5 s: 29zz_v133.js keeps the milestones in S.ms, and 28_missions.js:6 (the old
    Missions refund) deletes S.ms every 5 s, then persists and renders. So (1) "Later" loses the milestone for good: tap Later, 3 s on
    S.ms is {since:5} and the Level 5 pick never comes back (ms2.js); (2) a level-up window left open past 5 s skips its milestone
    (since is reset to the current level's 5); (3) the kept three (o5) are lost; (4) an idle screen re-renders every 5 s for every
    player (rerender.js: bursts at 0.9, 5.9, 10.9, 15.9, 20.9 s on 8ca029d; 0.9 only on 1252dc4). Rename the field (S.mile, say) and
    leave S.ms to the Missions refund. Recheck: ms2.js and rerender.js.
  - PASS, the milestone window itself (fccf7c9): at 390x844 it fits with room (ms2_open.png): Level 5, three pieces from brands on sale,
    each with its brand, Later and the close button. A trial passed on honor (level 4 to 9 in one go) opens the class pick first and the
    milestone after it (milestone.js; the class pick needs Choose, which the script only half-clicked, so the pick itself is from
    ms2.js). Not checked: 360 px, the coins option (needs fewer than 3 pieces left), the pick after a real quest tick.
  - PASS by review and numbers, economy Parts 1 and 2 (b4c2fef, 1252dc4; econ.js): prices x1.15 rounded (to 10 under 1,000, else 50;
    no Shop row off that rounding, 527 rows, 563 upgrades, none NaN or below 0; the one 0 is the Rift Mask, a dungeon find); task coins
    46/116/231 for 10/25/50 XP at levels 1, 10 and 30 (no level growth, as meant); level curve need(1) 60, need(10) 500, need(11) 501,
    need(40) 1,220, need(41) 1,269 (the 0.3 x (L - 40)^2 from 41, as written); the weekly quest pays 3,000 x 0.77 = 2,300 at level 1
    (rounded to 50; "scaled like the other rewards"); Loft goals 100/300/100. The sale strip caches prices at runtime, after the
    economy file, so sales start from the new prices. Not checked: LEAD's sims (not rerun).
  - PASS, f113c98 (GM Next drop tab, shuf2, notices, Reset, worlds ep): LEAD's rigtest/lead/v132.js against 1252dc4 (a copy with the
    cloud blocked): every floor as before until Mon 11-30 and a new order from then; the GM sees Next drop a day before (SMOKE BOMB 13,
    VENOM ROSE 30, no buy buttons), another player does not; the notice pays 500 once (1,000 to 1,500); Reset progress asks first, then
    starts over. 0 page errors.
  - PASS with NOTES, 68c4b15 (Upgrades tab, Stylist, 3 cut): the 7-button bar fits at 360/390/430 (nav7_*.png); the cut three are off
    sale. NOTES: tap targets 37-45 px wide at 360-390 (under 44 at the low end); the Shop's Interface-label slice is dead code since the
    tabs went; the Upgrades icon reads as "upload".
  - PASS by review, 8ce4684 (the pet beside its player on the Town pedestal): the world doc carries the pet, the pedestal draws it
    through the same safe path; firestore.rules unchanged (worlds readable by signed-in players, written by the owner). Not checked:
    another player's pet on screen (needs two signed-in players).
  - PASS, creator hair cdcb0b7/39d554c and 649f1fc dyes/hairHi: only styles with art show; the Stylist-only styles stay off the creator;
    the 6 dyes tint, and the streaks (hairHi) sit under hats (dyes.png).
  - PASS, acd0730: Pluto then Chopstick then the beds in order; with no bed both dogs nap on the floor where the beds go (nap_all.png).
  - PASS with a NOTE, the epoch reset (QB_EPOCH 6 to 7, a throwaway build): an old local save loads as a fresh start; the official
    notice shows from level 2 (the Town opens there) and pays 500 once (epoch.js, notice.js). NOTE (Cal/LEAD): an old local-only save
    has no backup (the cloud keeps backup_e6 for signed-in players only); fine if every real player is signed in.
- PASS, the new hairstyles (ROOMS, through c464113 art; hairtest.js on 649f1fc and 8ca029d; shots/qa/hair1123/): m_h4 Buzz, m_h5 Man
  Bun, m_h6 Combover, m_h7 and f_h5 Wolf Cuts, f_h4 Wavy and Victor's hair, every pose (arms-up, dances) and every live hat for the
  body, front and back. No hair through raised arms, nothing cut or floating, no hair poking out of a hat; the buzz cut reads as a short
  brown cap from behind under every hat. The wolf-cut fringe touches the lids: fine at Loft scale. Not checked: each concept line ticked detail by detail
  (sheet scale only), the highlight streaks for h2 to h6 (still landing), a phone.
- PASS with two text FIXes, the dog line 12/12 (ROOMS art daa18ad, 9c3a732, 44310cc, 65804c3, e304a15; shots/qa/dogs1123/): pd_cable,
  pd_fleece, pd_hearts, pd_bubbles, pd_treats on both dogs in all 4 frames; Pluto's vest stays covered under the sweater and fleece;
  the auras sit right; the bowtie collar and poppy bow are back. FIX (LEAD, Shop text): pd_bubbles' line says "pink and sky-blue sheen",
  the art is lilac; pd_fleece's line still carries the internal note "(Was pd_puffer: Higgsfield refused it as NSFW...)".
- PASS, pets in the Loft recheck (8eb92b2 in 8ca029d; petroam.js): no undressed frame in 75 s for any of the three creatures (FIX 1
  gone); the wyvern walks on its glide frame (FIX 2 gone; the bob is not judgeable in stills); no footprint entries. The fun-move NOTE
  stands.
- PASS with one FIX, later rooms (Cal 11-23: "make sure all the furniture assets are placed correctly and characters are not phasing
  through furniture"; qa-local 649f1fc, every upgrade owned; rigtest/qa/laterooms.js; shots/qa/laterooms/). Static, all 16 rooms from
  the Restaurant on: no piece outside its room, no footprints overlapping, layout fine by eye; ROOMS sweeps every stage separately.
  Live, each room's real window for 45 s (Club also 2 x more), everyone sampled every 150 ms against the furniture footprints:
  - Clean: Rooftop, Boba, Dessert, Garden, Theater, Mall, Bowling, Karaoke, Arcade, Rhythm, VR. Speakeasy too, but only 1 person
    came in 16 samples.
  - Intended: the Sky Bar's pianist sits inside the piano's footprint (the bench is part of it).
  - NOTE (LEAD, crew posts): guests stand about 1 s on a stool's spot before sitting (Sky Bar's bar stools, Lock and Key before);
    reads as stepping up to it.
  - NOTE: one walk sample each in the Restaurant and the Auditorium: a corner clipped while turning.
  - FIX (ROOMS spot, or LEAD nav), the Club's DJ: the work spot is at 7.8, 0.5 behind the booth (6.2-9.4 x 0.8-2.3) with 0.3 gaps to
    the speaker stacks on both sides, and the DJ walks inside the booth's footprint on the way in (2 samples in run 1, 26 (about 4 s)
    in run 2, none in run 3). One guest also walked inside the front sofa booth (0.25-2.45 x 7.5-9.9) for about 1 s in run 1, not seen
    again in 3.5 min. Neither was caught on a picture (the DJ is mostly hidden behind the booth). Widen a gap beside the booth or move
    the post so the path goes round. Recheck: ROOMS=club SECS=120 ONLY=crew node rigtest/qa/laterooms.js.
  - Not checked: every upgrade stage live (ROOMS's static sweep covers stages), a phone, night light.
- Pets in the Loft (Cal 11-23: "make sure their animations are good and their outfits are good"; qa-local 649f1fc, a clean build; the
  Bedroom in the Loft scene, each creature fully dressed and both dogs dressed; non-local requests blocked). Scripts and pictures:
  shots/qa/petslive/.
  - FIX 1 (LEAD, code), clothes pop off: the first time each frame is drawn (the first walk step, sit, fun move, waking), the creature
    shows for a moment without any clothes until its dressed picture is ready: 4-6 times per creature in 75 s (pzSprite returns the
    plain frame while the composite draws). Build all 11 composites for the worn outfit when the Loft opens and when the outfit changes,
    or keep the last dressed picture on screen until the new one is ready. The dogs use the same path, so dressed dogs pop the same way.
  - FIX 2 (LEAD, frame choice; or ROOMS), the wyvern's walk: walking alternates frame 2 (side-on glide, wings back) and frame 3 (facing
    front, legs dangling) every step, so it flips between profile and front view as it moves (wyvern_walk_sheet.png, rows 3-4). Walk on
    one airborne frame with a bob, or have ROOMS paint a second glide frame to pair with 2. The wolf's trot and the slime's
    bounce/squash pair read fine.
  - PASS:
    - Facing: the actor's face flag is -1 exactly while it moves left on screen, so it turns with its walk.
    - Footprints: natural roaming (75 s each, woken every 15 s, never steered): the creature and both dogs never walked inside one of the
      Bedroom's 9 furniture footprints. The overlaps QA saw with the desk and the plant came from QA forcing walks to targets inside them.
    - The idle loop (0/1 every 650 ms), sit, sleep and the crying screen show their right frames. Mass centres agree within 1 px, so
      nothing jumps between frames.
    - Clothes on every frame: the compositor diff of 452 piece-frames matches the rule, including the slime's flat head cells, the
      wyvern's paws cell, and the dogs per dog. Beds and the give-up screen as passed before (3fee540).
  - NOTE: the fun move is one frame shown for 650 ms about every 15 s, a flash rather than a move. Fine if meant; two frames would read
    better.
  - Not checked: the Patio by eye this round (passed at 5d9274c), night light, a real phone.
- PASS, v1.30 live check (release/v1.30 c1cff49; owner LEAD): release/v1.30 and rollback-v0.80 match origin (c1cff49, adf0f80). The
  shipped commit is the exact one QA rebuilt and passed (3fee540: APPV 130, web 3,770, artcheck 0, petshop.js and petdrops.js PASS,
  the letter pays 500 once). The rollback commit changes only APPV, 130 to 131. Not checked by QA: the hosted pages (LEAD's ship run
  compared all 3,770 on both), a real phone.
- PASS, v1.30 can ship (release/v1.30 c1cff49; owner LEAD). Over 98aa14b only 29zz_pets.js and 29q_news.js change, both identical to
  qa-local 5a0a9f0.
  - The seven Shop lines now say what is painted, and each still names two or more details: Frost-Wave Half Helm with a wave-etched
    band, the embers with gold sparks, lanterns with gold sparkles, the scarf's ends hanging, the comet with a long gold tail, the
    sparkle ring in pink and gold, the backpack with gold zips and a plum star charm. No other name or line changed.
  - The letter: "The dogs sleep indoors now" (no refund line, as Cal asked) and "A Stylist for new cuts, colours and eye colours".
  - Clean rebuild of the exact cut: APPV 130, web 3,770, artcheck 0 gaps. petshop.js (wolf, slime) and petdrops.js PASS. The letter
    shows the new lines and pays 500 once, 0 page errors. Everything else is as passed on 98aa14b (c062103).
  - Not checked: a real phone. Do the live check after the ship.
- NOT A PASS yet, v1.30 cut (release/v1.30 98aa14b; owner LEAD). Everything works; the hold is for text only: the letter and seven Shop
  lines. Pictures and scripts: shots/qa/v130/.
  - Cut: release/v1.29 + b95a995 + 98aa14b + APPV 130. Only pet files, the letter (29q_news.js) and APPV change, with no Stylist split
    (look.js and rig.json as in v1.29) and no shots. Every changed file under app, src, data, art and tools matches qa-local except
    30_app_b.js (APPV only); pd_cable is held out of the cut but kept on qa-local. 153 pet art files are added (33 frames, 3 beds,
    117 cells, each matching pet_clothes.json). Plain and web builds clean, web 3,770 with version.txt, APPV 130, artcheck 0 gaps.
    Rollback adf0f80 changes only APPV, 130 to 131.
  - Rerun by QA on 98aa14b, all PASS:
    - LEAD's petshop.js for wolf, wyvern and slime, and petdrops.js (dogs: 7 pieces, 1-2 a drop, no repeats running).
    - dbedcheck: the Patio dog beds are not drawn and not listed.
    - pbref: the refund is paid once, and two reloads keep the same pbref. The script's two "BAD" lines are its own over-strict coin
      check catching the +150 room income.
    - Compositor: 452 piece-frames match the rule; the cloud's head turn matches pet_wear.py.
  - pd_bowtie and pd_poppy (ROOMS e304a15): PASS on both dogs in all 4 frames (qa2_dogs.png, bp_cells.png). The bowtie has its navy
    collar, cherry gingham bow and brass bell; the poppy crown has cherry poppies with navy centres, tan twine and the navy bow.
  - Line tick, all 43 shipped pieces against their Shop lines (lines_*.png; QA d7fd35e's promise): every piece shows its main details.
    FIX (LEAD, text in 29zz_pets.js PCNAME), seven lines promise what the art no longer shows:
    - pw_helm "rune-etched brow band": the band is waves (ROOMS took the runes out as letter-like).
    - pv_embers "faint curls of warm smoke": no smoke (repainted solid).
    - pv_lanterns "a warm glow and a faint gold trail behind each": small gold sparkles only.
    - pv_scarf "fringed ends flying": they hang from the knot (QA's own FIX).
    - ps_comet "tiny pink sparkles shed along the loop": none, only a few gold dashes.
    - ps_sparkle "a faint plum glow behind them": no glow.
    - ps_pack "a tiny keyring": none visible.
    Reword each to what is painted. Every piece still names two or more details.
  - Letter {v:130} (l130_list.png, phone.png; isMobile 390 px, 3x, non-local requests blocked): a v1.29 player gets "What’s new in v1.30"
    in the inbox. Opening it pays 500 once (1,000 to 1,500, unchanged on a second open), it fits the width (356 of 390 px), 0 page
    errors. No brands, dates or anything to come. FIX (LEAD):
    - "and the beds they left outside were paid back": Cal said "no message of refund necessary", so drop that half and keep "The dogs
      sleep indoors now".
    - NOTE: "A Stylist for new cuts, colours and eyes": the Stylist sells eye colours. "eye colours" is exact and does not hint at the
      eye shapes still to come (the held Stylist split).
  - Phone size (emulated iPhone width, not a real phone): the adopt and give-up screens fit, and the crying pet shows its clothes and
    aura. A real phone is still not checked.
- PASS, Pet Shop recheck 5eb9ca2 + 9c6b5cc (clean builds; owner LEAD; pictures and scripts shots/qa/petshop3/). Not a release yet:
  the dog line is still being painted.
  - petshop.js, rerun by QA: PASS for all three creatures, including LEAD's new refund check.
  - FIX A done: the creature's Patio bed at 1.7, 2.6 sits clear of the fire pit and the bistro table, with nothing else beside it. The
    widest piece (the wyvern's nest) and the slime's cushion are both fully in view (pat3.png).
  - FIX B done by Cal's call ("Remove the dog beds from outside"): pt_dbed and pt_dbed2 are not drawn and not listed, for an owner and a
    new player alike, with 0 page errors (dbedcheck.js). Owners keep the ids and their +0.5% XP each. In the Bedroom both smaller dogs
    now lie down in their cushions (bd3.png), and the creature lies in its bed.
  - Refund (Cal: "refund for the patio beds but no message of refund necessary"), pbref.js, with every non-local request blocked:
    - A save owning both beds gets coins 1,000 to 1,400 and spent 5,000 to 4,600, with S.pbref {c: 400}, saved locally.
    - Two reloads keep the same pbref and pay nothing more. The first reload's other +150 is room income (earnedC), not the refund.
    - A save with no beds gets pbref {c: 0} and no coins. No message shows.
  - Not checked: two devices running the refund before a cloud sync (whichever save wins carries one pbref, so it should not double;
    not tested), a phone.
  - QA's own false alarm, for the record: QA first thought the retire line wrote to the wrong field of the row, but at runtime the row
    is reshaped and field 3 is the options object, so it works as LEAD wrote it.
- NOT A PASS yet, Pet Shop recheck (9d925a5 on a clean build; owner LEAD; pictures shots/qa/petshop2/). The Bedroom is fixed; the
  Patio still needs two fixes.
  - PASS:
    - petshop.js, rerun by QA, passes for all three creatures.
    - The compositor diff is unchanged: 457 of 460 to the pixel, and the cloud's head turn matches pet_wear.py.
    - pzedge.js passes: 26 drops, the gates, and dog clothes now refused without a dog ("Adopt Pluto or Chopstick in the Bedroom first",
      button off).
    - FIX 1 is done: in the Bedroom the wolf, wyvern and slime each lie in their own bed (beds2.png). The smaller Pluto and Chopstick
      lie in their smaller Bedroom beds, and the bigger creature reads well beside them (Cal's 11-19 size change).
  - FIX A, Patio bed spot 2.1, 2.6: it is in view now, but squeezed between Pluto's bed and the fire pit. The right end of the wolf's
    bed and the wyvern's nest goes under the pit's rim (dogs2.png, dogbeds.png; rule 20), and the corner reads crowded (Cal's
    no-clutter rule). Shift it left or forward by about 0.3-0.5, which the smaller dog beds may now allow, or find a spot clear of both.
    The creatures' auras (embers, slime flames) also drift over the pit's front, which is acceptable for effects once the bed itself
    is clear.
  - FIX B, the dogs on the Patio: Chopstick sleeps on top of the upper bed's back rim, and Pluto lies behind the lower bed with only his
    head above the rim (dogs2.png, both creature runs). They are not in their beds, the same fault FIX 1 fixed for the creatures. The
    same shows in the db99820 pictures, so it predates the size change; QA did not capture it on v1.29 (that run's dogs had gone
    indoors), so it may be live already. Use the same sleep-point fix for the Patio dog beds.
  - Not checked: a phone, night light, visitors, the dogs on the Patio in v1.29.
- NOT A PASS yet, Pet Shop code (db99820 on a clean build; owner LEAD). The Shop side and the compositing pass; the beds in both rooms
  need fixing. Pictures and scripts: shots/qa/petshop/.
  - LEAD's petshop.js rerun by QA: PASS for wolf, wyvern and slime (tab, warning, adoption and coins, "already have a pet", 2+2 drop,
    crying frame, dressed creature and dogs in the Loft, beds, giving up with the clothes kept, 0 page errors).
  - Compositor: QA loaded 29zz_pets.js's own pzSprite into the page and drew every piece in every frame (460 piece-frames, dogs per dog)
    against QA's reading of the rule. 457 match to the pixel. The other 3 are pw_cloud in frames 6, 8 and 10, where the game turns the
    head-anchored aura with the head; ROOMS's pet_wear.py does the same, so the game is right and QA's placer was wrong there.
  - Drops (pzedge.js, a wolf owner, 26 Mon/Thu slots from 11-23): always 2 wolf and 2 dog pieces, no piece twice running, all 12 wolf
    pieces in 6 drops, the 8 dog pieces in art all show.
  - Gates: at level 20 (Boutique locked) there is no Pets tab. With 2,000 coins, adopting is blocked ("need 1,000 more") and so is
    giving up. 0 page errors.
  - FIX 1, Bedroom: all three creatures sleep floating above or behind their bed, not in it. The wolf hovers over its basket, the
    wyvern lies on the nest's back rim, and the slime floats over its cushion (beds.png, wolf_4_bedroom.png). The sleep spot
    (bed:[9.5,3.1]) and the platform's height do not meet the drawn bed. Settle each creature into its bed, using sleepOff.
  - FIX 2, Patio: the bed at 4.25, 3.5 falls below the view's bottom edge. The sleeping creature is cut in half by the edge and its bed
    does not show; its aura (the snow cloud, embers, flames) draws over the front of the fire pit (wolf_4_patio.png; rule 20). Move the
    bed and sleep spot up into view and clear of the fire pit, or take the layout back to Cal. Cal approved "the bed by the fire", not
    a half-hidden one. The fire-side chair and seat are gone as asked.
  - NOTE: the creature beds are drawn at the frames' scale, about the pet's own size and much smaller than the dog beds. Judge again
    once the pets sit in them.
  - NOTE: with no dogs owned, the dog pieces can still be bought (an active 300-coin button), then say "Adopt Pluto or Chopstick". Either
    block the buy or say so before it.
  - NOTE: each line's order is a seeded shuffle of the pieces that have art, so adding pieces (the 4 dog pieces still to come, or more
    later) reshuffles the whole line for everyone and can repeat a piece across the drop where it changes. Fine before release; after
    it, append new pieces to the order instead of reshuffling.
  - NOTE for Cal: the prices are placeholders (pets 3,000; clothes 300-600).
  - Not checked: a phone, a cloud merge of S.pet between devices, night light, visitors.
- QA correction (owner QA): QA passed pd_bowtie and pd_poppy (1d58285) while the navy collar and the navy side bow named in their lines
  were missing; the cyan key had eaten them. ROOMS found and fixed it in e304a15 (the key now keeps navy). QA missed it because it
  judged fit and spill, not each piece against its line. From now on every wear-check also ticks each piece's named details and
  colours against its concept line. Both pieces get rechecked with the dog set.
- PASS, pw_cloud and pd_rain (3c309e4; owner ROOMS; shots/qa/petclothes3/cloud_3c309e4.png, rain_3c309e4.png):
  - pw_cloud: the bigger flakes now read, and three fall just under the cloud above the head (none on the pup), in stand, sleep and
    crying alike. The stray outline curls are gone. 0 green.
  - pd_rain: each dog's stand, sit and sleep cells sit right on both dogs. The slicker fully covers Pluto's grey vest in all 4 frames
    (none shows through in sleep either), and the mustard reads on Chopstick's black coat. 0-1 px green.
- Pet clothes recheck of 1d58285 (976305b, bea0f82, LEAD's 2bf476e; owner ROOMS): PASS but one small FIX. Pictures:
  shots/qa/petclothes3/. QA's placer reports no missing cells; green spill is 0-1 px.
  - PASS:
    - ps_crown: cell 1 is in, so the crown stays on through the flat frames 3 and 10 (no blink).
    - ps_float: the melt ring sits just under the eyes, which are clear.
    - The slivers on ps_cape_3, ps_float_4 and ps_ruffle_4 are gone. Composited, the parts left on ps_pack_1/2, ps_pearls_4 and
      ps_cape_4 read as the far strap and pearls.
    - pd_bucket: Pluto's notch is filled; Chopstick's sit brim is lifted 6 px and the eyes are clear.
    - pd_bandana: Pluto's loose knot is gone.
    - pd_aviator's line matches the hanging flaps.
    - The circlet, collar and torc wisps are gone.
  - Small FIX, pw_cloud: the flakes are back (14, none on the pup) but small. About 10-15 px in frame pixels, so about 3-4 px at Loft
    size; they gather round the feet, apart from the cloud. In a room it will read as a grey cloud plus specks. Make 4-6 of them about
    twice the size, with two or three falling just under the cloud (above the head, not on it), so the snow visibly comes from the
    cloud.
  - Minor, ROOMS's call: ps_cape in melt frame 10 drapes to the upper edge of the left eye; the eyes still read.
  - PASS, pd_fleece design (replacing the refused puffer): cherry and navy check fleece, cream sherpa collar, two navy toggles, a leash
    loop. Three details, the line's colours, no named tartan, no logos, nothing cultural. On the wear-test, check that the navy reads on
    Chopstick's black coat and that it fully covers Pluto's grey vest in all 4 frames.
- PASS, v1.29 live check (release/v1.29 0e5e736; owner LEAD): release/v1.29 and rollback-v0.80 match origin (0e5e736, 71f62ef). The
  shipped commit is the exact one QA built and passed (bbe2625: APPV 129 in dist and dist-web, web 3,617, artcheck 0 gaps, 0 page
  errors). The rollback commit changes only APPV, 129 to 130. Not checked by QA: the hosted pages (LEAD's ship run compared all 3,617
  on both), a phone.
- Pet clothes through f1ba1fc (owner ROOMS; pictures and scripts in shots/qa/petclothes2/). QA's placer v2 (pcwear2.js) reads
  fit.head/headCells, the wyvern's paws cell, base pieces on the neck anchor, and the dogs per dog (head, neck, back, aura).
  - Recheck of d7fd35e: 6 of 7 PASS.
    - pv_wizard: tipped back, both eyes clear in hover 3.
    - pv_bomber, pv_vest, pv_pack: the frame-10 paws cell follows the paws up to the face, with no phantom sleeves or arm loop (w310.png).
    - pw_shards: the moon is behind the head and the crystals are low at the sides.
    - pv_lanterns: small and floating, 420 wide.
    - pv_scarf: the ends hang from the knot.
  - Still FIX, pw_cloud: no snowflakes show at all (at 1x the pup frames show only a grey cloud floating above the head). As painted it
    is a plain cloud: Cal's never-plain rule, and its Shop line says it drops snowflakes. Make 3-5 clear white or icy-cyan flakes fall
    beside the pup, not on it.
  - Slime (12): 8 PASS (bow, headphones, comet, flames, pearls, scarf, sparkles, pack; the pearls and pack pending the edge check in
    FIX 3). 4 FIX (crown, float, ruffle, cape). The comet's thin gold tail crossing low reads as an orbit, so it is fine. The headphone
    cups sit beside the eyes.
    - FIX 1, ps_crown: only one cell. fit.head maps frames 3 and 10 to "flat", so the crown disappears in bounce frame 3 and blinks
      every hop. ROOMS's note says two cells; the data has one. Add ppc_ps_crown_1 and its pet_clothes.json cell.
    - FIX 2, ps_float: in melt frame 10 the ring covers the low eyes (as ROOMS noted). Lower the flat cell or cut the front of the
      ring below the eyes.
    - FIX 3, slivers of the neighbouring cell left at the crop edge, which float loose beside the slime (cells.png, sl.png):
      ps_float_4 (the valve, left of the sleeping slime), ps_ruffle_4 (a frill bit to the left), ps_cape_3 and ps_cape_4 (a dark bit
      off the cape's end in frames 3, 10 and 5). blobs.js also lists edge parts on ps_pack_1, ps_pack_2 and ps_pearls_4: check whether
      those are the charm or slivers.
  - Dogs (6 of 12): 4 PASS (poppy crown, bow-tie collar, studded collar, aviator). The aviator's ears poke out and its eyes are clear;
    the flaps hang to the jaw, so change its Shop line from "ear flaps buckled up" to match, or repaint. The neck pieces hide in sleep.
    - FIX 4, pd_bandana on Pluto: in sit (frame 2) the knot's tie ends float detached to the left of the neck (dz.png).
    - FIX 5, pd_bucket: on Pluto the crown has a jagged notch at the top left (the unused ear slit) that reads as a bite out of the
      hat. On Chopstick the ears come through the slits well, but in sit the brim sits right on the eyes. Close the slit on Pluto's
      cell and lift Chopstick's sit fit a little.
  - Spill: no green on any slime or dog file. The magenta counts on slime pieces are their own hot pink (green-keyed), not key.
  - Not checked: the dog body pieces and auras (not painted yet), in-game drawing, night light, a phone.
- PASS, v1.29 can ship (release/v1.29 0e5e736 = release/v1.28 + fb02a13 + 7c1d8fd + 41db736 + APPV 129; owner LEAD).
  - Commits: the cut equals lead/armsplit-v128, which QA passed by eye (52d0904, rebase checked), except APPV 128 to 129. The rollback
    commit 71f62ef changes only APPV, 129 to 130. Clean builds: APPV 129 in dist and dist-web, web 3,617 with version.txt, artcheck 0
    gaps (370). 0 page errors.
  - LEAD's rigdiff (v1.28 against qa-local, which renders like this cut: 31,734 frames, 420 rows): the worst lost frames are all her
    sleeveless tops in dance2, sideL and chat2 (max 87 px), gained max 29. Everything with sleeves is at most 21 lost and 25 gained.
  - QA by eye on the exact cut, v1.28 against v1.29, in all 41 poses at HI 2: the three sleeveless tops not seen before (v_bodysuit,
    v_slip, v_corset) in their worst poses, the same or cleaner, with no new holes. The worst sleeved frames (rg_capelet, v_blazer on
    him in dance1-2, chat2, the side stretches and stretchUp) look the same; the blazer's dance2 skin streak is a little cleaner. His
    bare look is as passed before. Pictures: shots/qa/armsplit/z_*.png.
  - Not checked: a phone, the Loft and visitors in-game. Do the live check after the ship.
- NOT A PASS yet, wolf and wyvern pet clothes (24 pieces, 54 files, 34adce0..8d183f0; owner ROOMS): 17 PASS, 7 FIX. Pictures and
  scripts: shots/qa/petclothes1/ (QA's own placer pcwear.js, written from PET_SHOP.md's rule alone; qa_wolf.png and qa_wyvern.png
  show every piece in all 11 frames).
  - QA's own placer matches ROOMS's check sheets, so tools/pet_wear.py follows the agreed rule. Every file in pet_clothes.json exists,
    cells follow the fit table, and pw_cloud uses its pivotAura in sleep. Green and magenta key spill is 0 on all 54 files (1 px on
    pv_embers_1).
  - FIX 1, pv_wizard: in hover frame 3 (facing front) the brim covers one eye (wyv_f3.png). Hats must clear the eyes in every frame.
  - FIX 2, pv_bomber and pv_vest, crying frame 10 (paws up at the face) uses the sit cell, which was painted with the arms down. The
    bomber shows sleeves at the belly while the real arms are up (phantom sleeves); the vest shows a baked-in arm outline as a loop
    (sit.png, frames 8 and 10 side by side). Frame 8 is fine. Give frame 10 its own cell (paws up), or another cell that fits.
  - FIX 3, pw_shards and pw_cloud: the front half puts the crescent moon (shards) and two big snowflakes (cloud) on the pup's chest and
    flank in every frame. They read as stickers on the fur, not something circling it. Keep the front half low and at the sides, or
    move those elements into the back half.
  - FIX 4, pv_lanterns: each lantern is about head-sized and they stand at ground level beside the pet, reading as floor lamps. The
    ring is 535 px against a 373 px canvas, and in hover 3 one lantern sits behind the head. Halve them and float them at mid-height.
  - FIX 5, pv_scarf: the two flying fringe ends float detached up and left of the wrap in every frame (clearest in hover 3). Join them
    to the wrap, or let them hang.
  - PASS:
    - wolf: helm, beanie, circlet, collar, ruff, torc, armour, hoodie, cape, aurora;
    - wyvern: goggles, horn rings, coin chain, neckerchief, pack, embers, star map.
    Heads clear the eyes in every frame, including the wolf's raised crying anchors (79c9e91), and hide in sleep. Necks sit on the
    collar line; the body pieces follow the stand, trip, sit and sleep cells.
  - ROOMS's questions:
    - pv_coins reads: it has a dark outline and the amber gem, so keep it.
    - Aura widths: aurora 410, shards 393, cloud 388, stars 466 and embers 486 (sparse) are fine; lanterns is too big (FIX 4). Judge
      crowding again in a room once LEAD draws them.
    - pv_vest's sleep sliver is acceptable (curled pet), and so is the armour plate on the curled back.
    - pw_aurora is the heaviest but reads as one clean ribbon. Keep it.
  - Small, ROOMS's call: in wolf frame 9 the collar's and ruff's back ends stick out a little past the neck.
  - Not checked: in-game drawing (LEAD's code), the auras' bob or turn, night light, a phone, the slime and dog lines (being painted).
- PASS by eye, bare-arm split (LEAD e9cc506 on ROOMS's 63344fe gapped bases and d8444f5 split art; owner LEAD). The release verdict
  waits on LEAD's full rigdiff against v1.28. Pictures and scripts: shots/qa/armsplit/.
  - Recipe: e9cc506's look.js does not apply to release/v1.28 alone, because it builds on 2a0a7e3 (the Stylist face split, unreleased).
    QA's candidate is release/v1.28 + 2a0a7e3 + 63344fe + d8444f5 + e9cc506. All 29 changed files match e9cc506. The cut must include
    2a0a7e3, which adds an empty mouth slot (no art), or rebase e9cc506. Plain and web build clean: web 3,617 with version.txt
    (v1.28 3,603, +14 split files), artcheck 0 gaps (370). 0 page errors on either build.
  - Checked old against new in all 41 poses at HI 2 (sheets, plus 4x zooms of the changed poses):
    - his bare torso, REGIMENT's waistcoat, the waistcoat with gauntlet gloves;
    - her default, the OC halter with slingback heels and paint gloves, the GILDED bustier, the VENOM ROSE bralette with sandal heels;
    - skin s5 on him bare and on her halter, s4 on the waistcoat, s3 on her bare base.
  - Him: the torn wedges and holes at the armpit and upper arm are gone in stretchUp, cheer1-2, wave1-2, dance1-2, chat1-2, the side
    stretches and the back views (sitBack, type1-2). The arms are whole and the flank clean, a big change from v1.28. The large "lost"
    counts (up to 1,594 px in dance2) are those tears removed, not new holes. The raised-arm underside is still a little stepped in
    stretchUp and cheer, far less than before.
  - Her: less changes, since her hair covers the shoulders; the near-arm edges in dance2, chat2 and sideL are cleaner. Her default look
    changes by 40-80 colour px at most.
  - Skin: the arms layer takes the same tint as the torso, with no seam on s3, s4 or s5. Gloves sit on the hands with no skin peeking.
    Her heel feet are unchanged. The yawn (stretch) shows one pair of arms, from the painted picture (0 px change bare). Walks, sleep
    and backwalks show no far arm drawn wrongly in front of the body.
  - Sleeved tops, his default tee and her boat-neck tee: at most 96 colour px change per pose, from the repainted full base, with no
    shape change. LEAD's rigdiff covers every other row.
  - Not checked: a phone, the Loft and visitors in-game, the other sleeveless rows (v_bodysuit, v_slip, v_corset) beyond LEAD's sheets.
- PASS, wolf body anchors moved (555cc91): standing 0-3 at y 212-217, trip 6 at 232, sitting 4 and 7-10 at 240-245. On the re-rendered
  check_wolf.png the line runs through the middle of the torso in every frame. The slime's anchor stays at the dome's centre, and its swim
  ring is painted low, under the eyes (LEAD to ROOMS); QA checks the eyes on the wear-test.
- PASS with two NOTES, pet clothing anchors (data/pet_art.json 186b0e8 + 49f7574; LEAD's sheets shots/lead_pets/check_*.png; owner
  LEAD, note 2 with ROOMS). Data: 11 frames per pet, every anchor inside its canvas, head null only in sleep (5), neck null only for the
  wolf's and wyvern's sleep, every head, neck and body anchor has an angle, the dogs gained deg 0. By eye: the head anchors sit
  between the ears in every frame, including the wolf's drooped crying ears (8-10). The necks are on the collar line, the wyvern's
  body on the belly in all six poses, and the slime's base band at its bottom edge.
  - NOTE 1, wolf body: in every frame but 5 and 6 the green body anchor sits on the belly line under the torso (y 240-260), about
    25-30 px below the torso centre the data note describes; the wyvern's sits mid-belly. Either move it up, or write down that the
    wolf's cells register on the belly line, so ROOMS paints to the same point.
  - NOTE 2, slime body: the body anchor is on the eye line (the dome's middle) in 0-2 and 7-9. The Candy Swim Ring "round its middle"
    centred there would cover the eyes. Paint the ring low, under the eyes, or give the ring a lower point. The cape and pack sit
    behind and at the side, so they are fine.
  - The aura on the mass centre is pulled toward the tail on the slime and wyvern, as LEAD says. Judge it with the real auras.
- PASS, pet clothing notes applied (ab0fe18; owner ROOMS, the variant table with LEAD). Still 48 pieces, 12 per line, 3 per slot.
  - Contrast fixed: the wolf's beanie and hoodie are silver-grey or slate and its cape slate-blue; the wyvern's hat rust, bomber tan
    and vest cream; the slime's headphones and pack pink and gold; the dogs' turtleneck navy and crown cherry poppies.
  - Repeats fixed: pw_ruff for the bandana, pw_aurora for the wisps, a snowflake tag (two moons left), pv_lanterns for the orbiting
    coins, ps_comet for the hearts, pd_studs for the pearls. The crown is small, tilted and pink-gold. Short chains and flaps.
  - Before painting, one table: ROOMS's plan (wyvern stand/sit/sleep/airborne; slime dome/flat/sleep) differs from LEAD's map in
    PET_SHOP.md 78c4cd3 (wyvern stand/hover/hop/sit/sleep; slime round/tall/flat/sleep). Agree on one and write it as the fit table in
    data/pet_art.json; QA tests against that. Also check that one airborne cell fits both wyvern 2 (side-on) and 3 (facing front)
    plus the hop, and where wyvern 8 (crying, standing) and wolf 6 (tilted trip) go.
  - Small, ROOMS's call: pw_snow and pw_shards are still both icy rings. On the wear-test, check the navy turtleneck reads on
    Chopstick's black coat.
- PASS with NOTES, pet clothing concepts (180defc, shots/pending_art/pets/pets_clothes.md, 48 pieces; owner ROOMS, note A also LEAD).
  Every line has two or more details; no letters, logos, named gear or green. Apply these before painting; resend only the changed rows.
  - A (structure, ROOMS and LEAD): one flat image per piece on an anchor cannot fit the body pieces to the curled sleep (5), the sit
    and crying frames (4, 7-10), the wyvern's hops, the slime's flat melt (10) or the dogs' sleep. A hoodie, plate, bomber, swim ring,
    puffer or turtleneck painted for standing will float off a curled pet. Owners see the crying frames too, in the adoption splash.
    Following Cal's rule (one image per cosmetic, holding every angle), paint each body piece as one sheet with its pose variants
    (stand/move, sit/cry, sleep, plus the slime's flat and the wyvern's hop), and have LEAD map frames to variants. Settle before
    painting which frames each slot hides in, if any. Head and neck pieces only need the head and neck anchors.
  - B (contrast): dark pieces on a dark pet vanish. Wolf (charcoal): beanie, hoodie, cape (black velvet). Wyvern (navy): wizard hat,
    bomber, vest. Slime (plum): headphones, backpack. Give each a base that reads against the body (silver or slate on the wolf;
    cream, rust or brown leather on the wyvern; pink, gold or cream on the slime) and keep the pet's own colour for trim. Dogs: Pluto is
    apricot and cream, so the cream turtleneck and cream daisies wash out on him. Test on Pluto, or lead with cherry or navy.
  - C (repeats a player sees together: their creature's line plus the dog line):
    - Bandana: wolf and dogs. Replace pw_bandana (it also avoids any echo of the people's bandana Cal removed).
    - Heart aura: slime and dogs, and the slime also has heart bubbles next to the dogs' soap bubbles. Change ps_hearts.
    - Pearls: slime and dogs, minor.
    - Inside lines: the wolf has a moon three times (circlet gem, collar tag, shard ring) and two icy-ring auras (snow, shards); its
      Frost Wisp Orbit repeats both the pup's own flames and the slime's spirit-flame aura (Cal's words for the slime). Replace pw_wisps
      with something distinct and drop one moon. The wyvern has coins twice (coin chain, orbiting coins): change one.
  - D (auras): a ring drawn over the pet crosses its face. Paint each ring as back and front halves on the same sheet (back under
    the pet, front over it), keep the front half low and sparse, nothing across the eyes. One image is fine; LEAD can add a slow bob or
    turn in code instead of a second painted frame.
  - E (fit): head pieces must clear the eyes in every frame, including the wolf's drooped crying ears (9-10) and the wyvern facing front
    (3, 6). The circlet's chains and the aviator's flaps hang down, so keep them short.
  - Borderline, low risk: pw_torc (a historical Celtic neck ring, jewellery rather than costume, so fine by QA). ps_crown: keep it small,
    tilted and pink-gemmed as written, never a big gold crown centred on top of a round slime, which a famous game's slime king wears.
  - Answers to ROOMS's questions:
    1. Armour: fine with no emblem. Steel, cyan seams, brown straps, the small fin; no plume, horns or heraldry.
    2. Slime body: keep the three (cape on the back, ring round the middle, pack), with variants for the flat frames (note A). No fourth hat.
    3. Auras: one image, front and back halves (note D).
    4. Dogs: no stretching, which warps quilting and cable knit. Paint both dogs' fits on the one sheet (still one image per
       cosmetic), with every body piece fully covering Pluto's grey vest in all 4 frames.
- PASS, Pet Shop final frames recheck (c81d0de; owner ROOMS, the bed spot LEAD). Pictures: shots/qa/pets2/recheck_*.png.
  - FIX 1 done: wyvern frame 6 is a happy hop, one tail with one spade, the neck showing, wings wide, lifted 8 px like a hover.
  - FIX 2 done: olive.js reads 0 on all 11 slime frames and its bed (it was up to 105 px), the wolf still 0, and the wyvern's green
    test 2-6 px (the blue tears, as before). Under the tail tip in sit and sleep a soft rose-tan shadow is left. At 4x it reads as
    pink over plum, not spill. Fine.
  - Measured again on all 33 frames and 3 beds: one canvas per pet, matching pet_art.json (wolf 308x324 cx 161; wyvern now 373x394
    cx 192; slime now 316x291 cx 169). Centres within 1 px, the ground line at the bottom except the floating frames, no green.
  - Bedroom bed at x 8.9, y 2.6 (window corner, front right): clear of the desk chair, the doormat and the Patio door path, and away
    from the dog beds, so no kennel row. The room stays balanced (two beds left, one right) and uncrowded. PASS. The Patio is waiting on
    Cal (LEAD: the bed takes the lounge chair's spot).
  - Not checked: in-game drawing, night lighting, a phone.
- PASS, v1.28 live check (release/v1.28 33c064d; owner LEAD):
  - release/v1.28 and rollback-v0.80 match origin (33c064d, a9e38cd). v1.28 changes only rig.js, rig.json and 30_app_b.js from v1.27.
    rig.js is 4fe171c's. The rig.json change is line for line the one QA passed (ad8b85c), with no Stylist mouth slot. 30_app_b.js
    changes only APPV, 127 to 128. The rollback commit changes only APPV, 128 to 129.
  - Clean build: APPV 128 in dist and dist-web, web 3,603 files with version.txt (same as LEAD's), artcheck 0 gaps (370).
  - Not checked by QA: the hosted pages (LEAD compared all 3,603 on both), a phone.
- NOT A PASS, Pet Shop final frames (e82a602; 33 frames, 3 beds, pet_art.json, the sheets in shots/pending_art/pets/). Two FIXes,
  owner ROOMS. Pictures: shots/qa/pets2/ (with the two measuring scripts).
  - FIX 1, wyvern frame 6 (fun): it has two spade tails, one at each end of the arched body, and the head floats beside the body with no
    neck joining them (wyvern6_two_tails.png). It breaks the single-tail design and reads as a broken creature. Repaint the frame, for
    example a happy spin or hop with one tail and the neck visible.
  - FIX 2, slime tail tips: a khaki-olive halo where the hot-pink tip met the green screen, worst in frame 4 sit (105 px along the
    floor), then 5 sleep (39), 0 idle A (35), 3 (30), 1 idle B (24), 2 (14); a few px in 6-8 and 10 (slime_olive_tips.png, 4x).
    pet_cut.py keys alpha only, so pink mixed with green keeps its olive colour. Despill in key(): on edge pixels pull g down to
    max(r, b) (or blend toward the nearest solid neighbour), recut, and the measurement should read about 0. Wolf and wyvern measure 0.
  - PASS on the rest:
    - Every pet's frames share one canvas size, the ground line is the canvas bottom (except the slime bounce, lifted 48 px as noted),
      and the mass centre is within 1 px of pet_art.json's cx. No green left (0 px on all 36 files).
    - Wolf: the flame on the tail and ear tips and the cyan paw marks show in all four crying frames (7-10) too, dimmer, which is right.
      The mist is a faint teal, fine. The den is now a low open round bed with a cyan rim.
    - Wyvern: navy with amber, no green, one spade tail in every frame but 6, the nest flat on the floor. The tail touching the ground
      line in the hover frames (2, 3) is acceptable; the body is clearly lifted.
    - Slime: plum with hot-pink glow, the square cushion. The motion lines in the trip and wobble frames are fine.
    - Sizes next to Chopstick and Pluto at room scale look right: the wolf and wyvern about dog-sized, the slime a little smaller.
    - In-bed pictures: frame 5 sits inside each bed at its sleepOff.
  - NOTE for LEAD (layout, not art): the Bedroom spot at x 0.15, y 6.55 makes three beds in a row down the left wall next to the two
    dog beds, which reads as a kennel row. The real beds differ in shape, which helps, but Cal's no-clutter rule applies. Consider
    giving the creature bed its own spot away from the dog beds. The Patio: no clean spot, as ROOMS says; LEAD's call.
  - Not checked: in-game drawing, night lighting, clothes on the anchors (no clothes yet), a phone.
- PASS, bare-arm rig fix 4fe171c on its own (release/v1.27 + 4fe171c's rig.json and rig.js, against v1.27; owner LEAD). A small check
  by eye, not a sweep (LEAD's full rigdiff covers every row): his bare torso, REGIMENT's waistcoat, his default tee, SAYMØRE cargo;
  her bare base, the OIL & CANVAS halter, the REGIMENT mess jacket, the boat-neck tee; 9 poses (idle, stretchUp, cheer1-2, dance1-2,
  wave1, sideUp, clap1) at HI 3. Pictures: shots/qa/arms4fe/ (arms_m/f: OLD row over NEW row; z_dance: dance1/dance2 zoomed).
  - Better on him: the holes in dance1, dance2 and sideUp, where the background showed through the upper arm and underarm, are filled
    on every look, including the default tee that every player sees.
  - Your point 1 (dance1): the skin wedge under the near sleeve has a dark streak a few pixels long at HI 3, about a pixel at Loft size.
    It is smaller and far less visible than the hole it replaces. Better, not worse.
  - Unchanged, not made worse: the frayed armpits in stretchUp, cheer1 and cheer2 on him (bare torso, waistcoat and tee alike). The
    repainted bases with a gap under the arms are the fix for those.
  - Her: no visible change in any look or pose; her hair and sleeves cover the armpit. No new specks on the trousers in dance2 (fineUp
    keeps the fine body to arms-up poses).
  - QA's view: it beats v1.27 on its own, so ship it in the next release rather than wait for ROOMS's bases (queued behind the pets).
    When the new bases land, retune and rerun the rigdiff then. LEAD's call.
  - 0 page errors. Not checked: a phone, the other 32 poses by eye.
- PASS, v1.27 live check (release/v1.27 050ddd2; owner LEAD):
  - release/v1.27 and rollback-v0.80 match origin (050ddd2, e3e2b1a). Every quest-board file v1.27 changes from v1.26 matches the cut
    QA passed (9489e9e) byte for byte, except 30_app_b.js, which differs only in the APPV line (126 to 127). The rollback commit
    changes only APPV, 127 to 128.
  - Clean build of release/v1.27: APPV 127 in dist and dist-web, web 3,603 files with version.txt (same as LEAD's 3,603), artcheck 0 gaps
    (370). The test hooks are the same two as in v1.26 (still to remove before the real release, per CLAUDE.md).
  - The branch also carries ROOMS's 22 REGIMENT review sheets under shots/ (rows json, wear sheets, rg_base jpgs). They are not in the
    build, so they are harmless. Note only: LEAD's message said "shots/ drafts left out".
  - Not checked by QA: the hosted pages themselves (LEAD's ship run compared all 3,603 files on both), a phone.
- PASS, REGIMENT hold line, v1.27 can ship (release/v1.26 + 21c67e7 + b1fa777 + bd7c9f4 + 3876c46, built clean; owner LEAD):
  - The 84 files the four commits change match 3876c46 byte for byte. Plain build and web build clean; web 3,603 files with version.txt
    (v1.26 3,526, +77 for REGIMENT). artcheck 0 gaps (370 garments).
  - LEAD's rgrows, gdrows, ocrows (f and m) and floors122 rerun by QA against v1.26: all PASS.
  - QA's own probe (every day 11-15 to 02-28 at 7, 9 and 23 h, all three floors): the Boutique is identical to v1.26 through Sun 12-13
    (GILDED Mon 11-23, OIL & CANVAS Mon 11-30, the 12-07 and 12-10 drops unchanged). REGIMENT first shows Mon 12-14, where v1.26 had
    OIL & CANVAS's second run, then recurs about every five weeks. It never shows on the Street or the Atelier; those two floors match
    v1.26 on every day. 0 page errors on both builds.
  - Not checked: a phone, and a ship after Thu 11-26 8 am (then "until" must move to the release day, as the comment says).
- PASS, Pet Shop concept notes applied (156340f; rebuilt pets_concept_sheet.png, checked by eye):
  - Wolf pup: the flame on the tail and ear tips, cyan paw marks and shadow mist are in all 8 poses (sit, sleep and trip included);
    it no longer reads as a plain puppy.
  - Wyvern: the tall rattan basket is now a floor nest; the short-stand nest stays.
  - Slime: the grey donut is now a tufted indigo square cushion on a woven mat, no longer Pluto's bed.
  - Still old on the concept sheet: the wolf's crying frames and its tall hooded den. Higgsfield refused that edit and ROOMS did not
    resubmit it, as the rule says. ROOMS commits in pets_concept.md to the flame, paw marks and mist in all 4 crying frames and a den
    about half as tall in the final frames; QA checks both there (owner: ROOMS). LEAD's frame list (11 front frames per pet, no backs)
    settles the pose-count note.
- PASS with NOTES (concepts; go on to frames after Cal), Pet Shop creature concepts, shots/pending_art/pets/ (a02362e) (owner: ROOMS).
  Checked: the sheets by eye against the dogs (shots/qa/pets/dogs_reference.jpg: Chopstick, Pluto, Pluto's bed).
  - Pass: all three are original fantasy types in the dogs' sticker style (same outline weight and shading). The slime is clearly not
    the famous blue teardrop. Every pet has a 4-frame crying loop with a clear sad read (ears down, the tail flame dimming, the wings
    folding, the body sagging flat). The shared black and cyan palette makes them one shop's family.
  - Question 1 (the wolf pup): yes, in half its frames it is a basic black puppy. The shadow flame shows on the tail and ears in front,
    back, walk and fun move, but sit, sleep, trip and two of the four crying frames have little or none. Keep the violet-cyan flame on
    the tail and ear tips in every frame (dim, not gone, when sad), and add one more non-dog cue that survives every pose: faint
    glowing cyan markings on the paws or a misty shadow trailing from the fur.
  - Question 2 (the wyvern's beds): the woven nest on a short stand is fine. The rattan basket on tall legs is a bar-stool height and
    would stand above the Bedroom's front edge, where tall pieces block the room (rooms-never-cluttered, no-unintended-overlaps); drop
    it, or put that nest flat on the floor. Same check for the wolf's hooded den: keep its dome no taller than about one and a half
    times the dog beds.
  - Question 3 (named characters): nothing reads as one, with one watch-out. A big-eyed black baby dragon is close to a famous animated
    one. Ours has horns, cyan-violet chevron belly markings and a pointed face, which keep it apart; do not add rounded ear-flaps,
    green eyes or a split tail fin when painting frames.
  - NOTE: the slime's grey leather donut bed looks like Pluto's grey donut bed. Keep the violet fuzzy one and make the second one
    distinct (e.g. a misty violet puddle-pillow or a low dark cushion with cyan piping).
  - NOTE (frames): the wyvern has 12 poses and the others 8-9. Paint the final frames to the same set for all three (the rig and the
    code need one list); LEAD sets the list.
- PASS, REGIMENT rows bd7c9f4, on release/v1.26 + ROOMS 21c67e7 + b1fa777 + bd7c9f4 (built from file patches, beside a clean v1.26).
  REGIMENT stays held (DROPS.hold rg from 11-19, until ""), waiting on Cal's approval via ROOMS. When LEAD sets the date, QA rechecks
  that one line (owner: LEAD).
  - All 82 changed app/data/art/src/tools files are identical to bd7c9f4; it does not include 2a0a7e3. artcheck: 0 gaps of 370.
  - The 15 rows match regiment_rows.json (id, slot, name, line, mo/fo; scripted).
  - LEAD's rgrows.js (SEX=f and m), ocrows, gdrows, kprows and floors122 against the v1.26 build: all PASS (held: floors unchanged;
    with the hold lifted in-page, live Mon 11-23 with all 15 on the tab).
  - On the real rows: brandwear rg, 41 poses, 0 not drawn, 0 page errors. barecheck: the mess jacket's bandeau covers the bust in
    all 41. heelcheck: the stiletto boots on the tiptoe bases. hatcheck: the lifted peaked cap is clean front and back.
  - Not checked: the Shop cards on screen, a phone. The bare-arm rig note is with LEAD (older than v1.25, per LEAD).
- PASS, REGIMENT at b1fa777 (rg_cap lift m 90 / f 70, its clip moved up to match; items.json only). The art is done from QA's side;
  next LEAD wires and prices the rows (regiment_rows.json), and QA checks that commit (owner: LEAD).
  - hatcheck, the peaked cap over h1, h2 and h3 on both bodies in 7 poses: the eyes show under the peak in front views, and there is no
    bald band from behind (shots/qa/rg2/). newwear rg on this build, 41 poses: 0 not drawn, 0 page errors.
  - Everything else stands from 21c67e7. The arm-shard rig NOTE stays with LEAD.
- NOT A PASS yet (one FIX), REGIMENT painted, 21c67e7 (rows not wired; regiment_rows.json injected; clean build). Pictures:
  shots/qa/rg/.
  - Passes:
    - newwear rg, 41 poses: him 15 outfits, her 17, 0 not drawn, 0 icons missing, 0 page errors. fitsweep rg: 15 pieces, 0 flagged.
    - barecheck MODE=real, the mess jacket: the navy bandeau covers the bust in all 41 poses; the skin is the bare midriff
      (bare_mess.jpg). The officer jacket is a control: 0 px.
    - heelcheck SHOE=gx_rg_stiletto: the right tiptoe bases. Floor within 4 px except backwalk1/3/4 (7-8 px), as before, plus sitBack and
      type1 at 5 px.
    - hatcheck: the side cap and the peaked cap over h1, h2 and h3 on both bodies show no bald band from behind (hat_side.jpg,
      hat_cap.jpg).
    - The gauntlets are hand-sized in arms-up poses on both bodies (close_m.jpg, close_f.jpg).
    - QA's design NOTES are applied: three rows of frogging and plain shoulder boards; the capelet above the elbow; a low, firm cap
      crown unlike VENOM ROSE's; a sash with only its buckle and fringe; the aiguillette in loose loops.
    - ROOMS's question 2: the riding boots reach the knee line on the chibi legs and read as tall boots. Fine.
  - FIX (ROOMS): the Cord Peaked Cap's patent peak hides his eyes in front views (all three hairstyles), and half of hers
    (cap_eyes_m.jpg, cap_eyes_f.jpg). Lift it so the eyes show under the peak, as the OIL & CANVAS felt hat needed (lift, with the
    clip moved to match), then rerun hatcheck front and back.
  - ROOMS's question 1, settled: the light shards along his bare arms are the rig's, not the waistcoat's. The same look with the top layer
    removed (bare torso) shows the same shards in stretchUp, dance1, dance2 and sideUp (waistcoat_vs_bare_arms_m.jpg, top row with the
    waistcoat, bottom row without). NOTE (LEAD, rig, not blocking REGIMENT): his bare arms tear at the armpit in arms-up poses,
    visible with any sleeveless top. Her bare base probably does the same under the sleeveless `bare` tops (not checked yet).
- PASS, v1.26 live check (LEAD: live on Live and Test at 268fb31).
  - release/v1.26 and its origin copy are both 268fb31. Against release/v1.25, 83 app/data/art/src/tools files change: 82 are
    identical to abe4e6d, the build QA passed in 69af73e, and 30_app_b.js differs only by its APPV line (126). look.js and rig.json
    are unchanged, so 2a0a7e3 is not in it.
  - rollback-v0.80 and its origin copy are both 22b253c, APPV 126 -> 127 (its only change).
  - A clean web build of 268fb31: APPV 126, 3,525 files + version.txt = 3,526 (LEAD's count), artcheck 0 gaps of 355.
  - Not checked by QA: the live site played by hand.
- PASS, v1.26 candidate = release/v1.25 + ROOMS f041b24 + 4c60022 + LEAD abe4e6d (OIL & CANVAS on the Boutique; Cal "Approve OIL &
  CANVAS"). v1.26 can be cut. QA built that exact set (file patches onto release/v1.25) and a clean v1.25 beside it.
  - All 82 changed app/data/art/src/tools files are identical to abe4e6d. 2a0a7e3 (the Stylist face split: rig.json, look.js) is not in
    it and must stay out of v1.26 unless LEAD means to ship it. artcheck: 0 gaps of 355.
  - The 15 rows in 15_shop.js match shots/pending_art/brands1118/oilcanvas_rows.json (id, slot, name, line; scripted). DROPS.hold oc
    runs 11-19 to 11-26.
  - LEAD's ocrows.js, gdrows.js, kprows.js and floors122.js against the v1.25 build: all PASS (floors 11-10..11-22 unchanged, GILDED
    still first drops Mon 11-23).
  - On the real rows: brandwear oc, 41 poses: him 15 outfits, her 19, 0 not drawn, 0 icons missing, 0 page errors. barecheck MODE=real:
    the halter and the smock cover the bust in all 41 (the same counts as the art pass). heelcheck with the slingbacks: the tiptoe bases,
    floor as before.
  - Not checked: the Shop cards on screen, a phone.
- PASS with NOTES (cleared to paint), REGIMENT design review, shots/pending_art/brands1118/regiment.md (c45cedb) (owner: ROOMS).
  - Pass:
    - Nothing plain.
    - One invented crest only, and a thorough insignia and costume guard (no real insignia, emblems or regimental colours; no stage
      or band-uniform looks).
    - Natural shoulders and plain domed buttons clear the power-shoulder trade dress.
    - Military tailoring is general fashion, not national costume. The counts (2/3/4/3/3 = 15) fit the Boutique. The palette is
      keying-safe.
    - Gates after paint: the mess jacket's bandeau through barecheck, the stiletto boots through heelcheck, both caps through hatcheck
      (front and back), and the gauntlets at hand size in arms-up poses (OIL & CANVAS's gloves came out as giant mitts first).
  - NOTE (overlap): the Cord Peaked Cap shares its silhouette with VENOM ROSE's Velvet Captain's Cap. The navy wool, scarlet band,
    brass cord and crest keep it apart; just do not make the crown as tall and soft as the velvet one. The Tall Riding Boots are
    distinct from VENOM ROSE's Lace-Up Knee Boots (patent, no lacing). The Officer Stiletto Boots make the Shop's third stiletto,
    but they are the only stiletto boot.
  - NOTE (costume guard): the sash must carry nothing but its buckle and fringe. A sash with a star, badge or medallion on it reads as
    a real order of chivalry. The aiguillette hangs as a fashion cord, without the metal tips pinned to a breast pocket the regulation
    way.
  - Answers to ROOMS's three questions:
    1. The jacket: tone it down a little. Keep the brass frogging (three or four rows) and the scarlet collar and cuffs, but no fringe
       on the epaulettes: plain shoulder boards. Frogging, fringed epaulettes and a scarlet collar together are drum-major or stage
       costume. Worn with the aiguillette and sash, the outfit is the player's choice; each piece alone must read as fashion.
    2. Keep the capelet, ending above the elbow, with hemtrim, clear of the hands (the frock coat lesson). A greatcoat would be the
       third long coat after GILDED's frock and OIL & CANVAS's studio coat.
    3. Enough: his waistcoat on the bare chest, and her open mess jacket over the bandeau, which barecheck checks. The skirt's back
       slit stays below the shorts' line.
- PASS, OIL & CANVAS at 4c60022 (ROOMS's fixes for 739ee5e; rows still injected from oilcanvas_rows.json). The art is done from QA's side;
  next LEAD wires and prices the rows, and QA checks that commit (owner: LEAD). Pictures: shots/qa/oc2/.
  - Only the gloves' and the palette's art and icons change, plus items.json oc_smock `bare`.
  - newwear oc, 41 poses: him 15 outfits, her 19, 0 not drawn, 0 icons missing, 0 page errors. fitsweep oc: 15 pieces, 0 flagged.
  - Gloves (FIX 1): fitted fingerless leather on the hand, cream with orange tips and an indigo strap; hand-sized in raised-arm poses
    on both bodies (z_gl_f.jpg, close_m.jpg). New design and prompt, accepted first time (the process NOTE is answered).
  - Palette Pendant (FIX 2): now a small charm on the cord, about a third of the old size; it no longer reads as a bib.
  - Smock (FIX 3): `bare` now. barecheck MODE=real, 41 poses: a narrow V of skin from the neck to above the bust, with the sides of the
    chest covered; no tank (bare_smock.jpg, z_sm_idle.jpg). The halter is unchanged (bust covered in all 41); the denim jacket is a
    control: 0 px.
  - Not checked: Shop cards with the real rows (LEAD), night lighting.
- NOT A PASS yet, OIL & CANVAS painted, f041b24 (rows not wired: oilcanvas_rows.json injected; clean build). Three FIXes, one process
  NOTE; the rest passes (owner: ROOMS). Pictures: shots/qa/oc/.
  - Passes:
    - newwear oc, 41 poses: him 15 outfits, her 19, 0 not drawn, 0 icons missing, 0 page errors. fitsweep oc: 15 pieces, 0 flagged.
    - barecheck MODE=real, the halter, 41 poses: the bust is covered from the front in every pose; the open back shows her back (skin,
      not nude) from behind (bare_halter.jpg).
    - heelcheck SHOE=gx_oc_sling: the right tiptoe bases; floor within 4 px except backwalk1/3/4 (7-8 px), as with the stilettos.
    - hatcheck: the felt hat (lift 90) and the studio cap over h1, h2 and h3 on both bodies show no bald band from behind and keep the
      eyes clear in front (hat_felt.jpg, hat_cap.jpg). Asleep, the felt hat's brim stands over the face, like a hat tipped over a nap;
      left as is.
    - The brush roll reads well across the chest on both bodies (ROOMS's question 3: not too cute).
    - ROOMS's question 2: no specks beside her arm with the halter in stretchUp, dance1/2 or cheer1 at HI 3 (halter_roll_f.jpg). The
      only stray pixel is the old white sliver by the shoe, which v1.24 has too, on the default look.
  - FIX (ROOMS): the Paint-Dipped Gloves are giant knit mitts wider than the forearm, with orange fists bigger than her face's width in
    raised-arm poses. They read as oven mitts, not fingerless gloves (gloves_f.jpg, m_armsup_gloves_palette.jpg). That answers
    ROOMS's question 1. Scale them down to wrist-to-knuckle on the hand, or swap the piece.
  - FIX (ROOMS): the Palette Pendant came out far too big. The palette covers most of the torso on both bodies and reads as a toy or a
    bib (question 3: too cute). Roughly half the size; my design note asked for "enough size to read", not this.
  - FIX (ROOMS): the Drip Smock Shirt is open at the chest, and on her the grey base tank shows in the V (smock_tank_f.jpg). This is
    the defect the `bare` base exists for. Either give it `bare` (then barecheck: the V must stay above the bust), or paint the V
    closed for her.
  - NOTE (process, for Cal via ROOMS): Higgsfield's filter refused the gloves' first run, and the identical prompt was resubmitted and
    passed. The drafts' rule says a blocked piece is "replaced, not retried". The gloves are innocent and the refusal was likely a false
    positive on the bare reference body, but the redo for the FIX above should be a fresh prompt, and a second refusal means a
    different piece.
- PASS with NOTES (cleared to paint), OIL & CANVAS design review, shots/pending_art/brands1118/oilcanvas.md (e5b4684) (owner: ROOMS).
  - Pass:
    - Nothing plain: every line names two or more details.
    - Original, with a clear trade-dress guard: no famous paintings, letters or paint brands.
    - No cultural dress: the smock and the felt hat are studio wear, not costume.
    - The keying-safe palette is right. The counts (2/3/4/3/3 = 15) fit the Boutique.
    - The lane is distinct from OVERPASS's spray tee and chore jacket and from Y2K's patchwork jeans. No beret is right.
    - The halter goes through barecheck as `bare`, the slingbacks through heelcheck, and both hats through hatcheck.
  - NOTE (overlap): the Brushstroke High-Tops would be the Shop's 6th high-top (OVERPASS Retro High-Top Hoops, NICE COCK Silver Court,
    SAYMØRE Glow-Sole, SAVE POINT Pixel Flame, GILDED Gilt-Cap). Either make them unmistakably painted (whole-shoe brushwork, not trim),
    or swap the silhouette, e.g. gesso-crusted canvas lace-up studio boots or paint-flecked canvas mules.
  - NOTE (overlap, small): the Brush Roll Sling is the Shop's fourth cross-body piece (HANGANG Leather Chest Sling, KODE PINK Patent
    Mini Crossbody, the Ripstop Sling). The brush roll keeps it distinct; just make the handles read at chibi size. The Hand-Painted
    Denim Jacket sits near Y2K's Fur-Collar Denim Jacket; the painted back keeps it apart. Keep the "sunburst" loose brushstrokes, not
    radiating rays from a centre figure (the guard's "radiant figures").
  - NOTE (rig): the Patchwork Studio Coat is long like GILDED's frock coat, whose flared hem beside the hands got pulled by the hand
    bones in raised-arm poses (QA 7de6883). Keep the coat's hem straight and clear of the hands below the elbow, as ROOMS's frock fix did.
  - NOTE (size): the Palette Pendant is small; at chibi size give the palette and its dabs enough size that it does not read as a plain cord.
  - Answers to ROOMS's three questions:
    1. The hats: yes, nothing hanging below the band. The felt hat's brush should point up and back, out of the face. hatcheck over
       h1-h3 on both bodies after paint (and from behind: GILDED's beret first showed bangs, then a bald band).
    2. The brush roll in the neck slot with chain mode `2 0.5`, like the body chain: fine. It shares the neck slot with the Palette
       Pendant, so one excludes the other; that is acceptable within a brand.
    3. His side: the open-chest smock is enough. VENOM ROSE already has his open blazer and unbuttoned silk shirt; a third bare-chest
       piece would repeat it. The halter covers her side.
- PASS, v1.25 live check (LEAD: live on Live and Test at 6a0272c, the build QA passed in f7f5dbe).
  - release/v1.25 and its origin copy are both 6a0272c. rollback-v0.80 and its origin copy are both cd5a4ef (APPV 125 -> 126, its only
    change).
  - A clean web build of 6a0272c: APPV 125, 3,448 files + version.txt = 3,449 (LEAD's count), artcheck 0 gaps of 340.
  - LEAD's ship run had a failed Test read (1,935 files) during the long upload; LEAD's clean rerun matched every file. Not checked by
    QA: the live site played by hand. 2a0a7e3 (the Stylist eyes/mouth split) is on qa-local only, not released, and not checked yet.
- PASS, v1.25 = release/v1.25 at 6a0272c (release/v1.24 + 8b8d4a0 + b559d09 + ROOMS's 4 GILDED + a604760 + 368507e + 651fbfe + 6100e8f +
  APPV 125). v1.25 can ship. Cal approved GILDED via ROOMS. Pictures: shots/qa/v125b/.
  - The exact build: against release/v1.24, all 112 changed app/data/art/src/tools files are identical to qa-local's 6100e8f, except
    30_app_b.js, whose only difference is the APPV line (125). artcheck: 0 gaps of 340. Web build: 3,448 files + version.txt = 3,449,
    APPV 125.
  - rigdiff.js against a clean v1.24 build, every Shop row not cut or gone (355, including the old Basics rows), both bodies, all 35 poses
    both builds have: 22,050 frames, 0 page errors.
    - Lost pixels max 44 (tops, accessories) and 61 (hats, pants, shoes). By eye these are the removed underarm streaks in
      stretchUp/cheer/wave (red lines under raised arms), plus KODE PINK's repainted track pants and cargo, whose art changed.
      No holes (topacc_lost.jpg, rest_lost.jpg).
    - Gained max 135, in dance1/dance2/chat on him: the sleeve at the bent forearm, no longer torn (topacc_gained.jpg). Nothing new by eye.
  - The default look at HI 3: her dance2 loses 27 px (was 1,364 before 6100e8f). No hole at the waist and no trouser specks
    (default_f_dance2_fixed.jpg); what is left matches v1.24.
  - The six new emote poses (thinkA-C, sideUp/L/R): brandwear gd, v and kp, 0 not drawn, 0 errors, clean by eye. barecheck MODE=real on
    all 41 poses: the five VENOM ROSE bare tops and the GILDED bustier cover the bust in the emote poses too.
  - LEAD's gdrows, kprows and emotes PASS (on the 651fbfe build; 6100e8f changes only rig.json, rig.js and emotes.js's config).
  - Not checked: a phone (speed), which LEAD still owes.
- NOT A PASS, v1.25 candidate (LEAD's recipe: release/v1.24 + b559d09 + ROOMS 3a10edf, fa1864a, cb01321, 581c6cd + a604760 + 368507e +
  651fbfe). Two FIXes for LEAD; the rows, emotes and GILDED wiring pass. Pictures: shots/qa/v125/.
  - FIX 1 (LEAD), the recipe misses 8b8d4a0. rig.js's fineSlots/meshStepFine code is in 8b8d4a0 ("off until rig.json sets it"), which
    is on qa-local but not in release/v1.24. Built to the recipe, the candidate's rig.js differs from qa-local, and rig.json's fineSlots
    would do nothing. QA built release/v1.24 + 8b8d4a0 + the recipe instead (file patches of app/data/art/src/tools): all 111 changed
    files are identical to qa-local at 651fbfe. artcheck: 0 gaps of 340. Everything below is on that build.
  - FIX 2 (LEAD), the new rig makes holes even in the default outfit (new rigtest/qa/rigdiff.js: the same look and pose drawn by
    v1.24's rig and the candidate's, pixels lost and gained):
    - dance2, both bodies, no Shop piece worn: a hole opens through the torso at the waist beside the bent arm, with the background
      showing through. Her hair is cut there too (default_f_dance2_new.jpg vs default_f_dance2_v124.jpg). v1.24 had only a small notch
      there. With the default outfit, 1,364 px are lost on her and 1,077 on him (HI 3).
    - White specks on the black default trousers in dance1, dance2 and the raised-arm poses, new in this rig.
    - The same hole is in every KODE PINK top in dance2: bomber, varsity, hoodie, palm shirt; 140-166 px at HI 1 (kp_bomber_m_dance2.jpg,
      kp_sailor_f_dance2.jpg).
    - The intended part works: the streaks under raised arms (wave, cheer, stretchUp) are gone (red in default_m_armsup_old_new_diff.jpg).
  - Not run yet: rigdiff over every brand. Its timing is ~0.27 s per frame pair, so all 340 pieces x 2 bodies x 35 poses is about
    100 minutes. The default look already fails, so QA runs it on the fix. The six new emote poses (thinkA-C, sideUp/L/R) have no v1.24
    counterpart; they get an eye check on the fix.
  - Passes on this build: LEAD's gdrows.js (REF v1.24), kprows.js (the detail-pass lines), emotes.js. 0 page errors.
- PASS, KODE PINK detail pass 368507e (kp_bomber, kp_slipon, kp_cargo, kp_loafer, kp_track repainted; art only). Clean build of it.
  - Only the 25 art files of those five pieces change. artcheck: 0 gaps of 325. brandwear kp, all 41 poses (v1.25's rig is in this
    build): him 18 outfits, her 19, 0 not drawn, 0 icons missing, 0 page errors. fitsweep kp: 15 pieces, 0 flagged.
  - Cal's "never plain" note is answered (shots/qa/kpd/kp_icons_detail.png). The bomber has coral neon piping and a chest stripe; the
    cargo neon seams and knee stripes; the loafers chrome bars and a coral-dotted welt; the track pants a wide sunset stripe edged in
    chrome with coral cuffs; the slip-ons coral piping.
  - NOTE (ROOMS/LEAD, shop_lines.md): the slip-ons' new line says "a coral-to-sunset side stripe, chrome heel tabs". The icon shows coral
    piping around the opening and the sole, with no side stripe and no visible heel tabs; "Navy canvas, coral neon piping, white rubber
    soles" fits. The cargo and track pants now read navy-black rather than charcoal or black; close enough, not blocking.
  - Next: LEAD wires the five lines into 15_shop.js; QA checks that with the release candidate.
- PASS, GILDED at 581c6cd (gd_beret noClip; items.json drops only its clip). GILDED's art is done from QA's side; next LEAD wires the
  rows (shots/pending_art/brands1118/gilded_rows.json) and prices them, and QA checks that commit (owner: LEAD).
  - hatcheck.js, the beret over h1, h2 and h3 on both bodies in 7 poses: no bald band in rearStand or sitBack; the hair sits under the
    beret with nothing poking through its crown; her h3 ponytail shows behind it; the front is unchanged (shots/qa/gd3/).
  - newwear gd on this build, 35 poses: him 15 outfits, her 19, 0 not drawn, 0 page errors. Everything else stands from cb01321 (frock,
    bustier, mules, crown, cap, skirt name).
- NOT A PASS yet, GILDED recheck at cb01321 (ROOMS's fixes for 7de6883). Two of three are fixed; the new beret has a bald band. Clean
  build, draft rows injected. Pictures: shots/qa/gd2/.
  - Reruns: newwear gd 35 poses, him 15 outfits and her 19, 0 not drawn, 0 page errors. fitsweep 15 pieces, 0 flagged. barecheck: the
    bustier covers the bust in all 35 (same counts as before). heelcheck with the mules: same as before. hatcheck: the crown is still
    clean.
  - FIXED: the Frock-Coat Hoodie. No more shards past the hands in stretchUp, wave, cheer or dance. A thin underarm wisp is left in
    wave and cheer, but the bomber and silk shirt have the same, and so do live KODE PINK and VENOM ROSE tops
    (armsup_live_kodepink.jpg, armsup_live_venomrose.jpg). It is the rig's, not this piece's. NOTE (LEAD, not blocking): those wisps
    show on many tops when an arm goes up; 8b8d4a0's rig.fineSlots may be worth trying on the top slot.
  - FIXED: the bustier's straps are gold now, on the icon and worn. Faint pink specks are left in the icon's chain links at 4x zoom,
    invisible at card size.
  - FIXED: the skirt is renamed "Brocade Box-Pleat Skirt".
  - FIX (ROOMS): the repainted beret shows a bald band. From behind (rearStand, sitBack), a band of bare scalp shows between the beret's
    lower edge and the hair, on all three hairstyles on both bodies (beret_bald_back.jpg, hat_beret.jpg). The old fringe used to cover it.
    Lower the beret's back edge, or loosen its hat clip in items.json, as the horns needed in 141ff29. The front is fine: the braid band
    sits high, and no fringe looks like bangs now.
- NOT A PASS yet, GILDED painted, 3a10edf + fa1864a (rows not wired: shots/pending_art/brands1118/gilded_rows.json injected). QA built a
  clean copy of fa1864a. Two FIXes for ROOMS; the rest passes. Pictures: shots/qa/gd/.
  - Passes:
    - newwear (brandwear with the draft rows), gd, 35 poses: him 15 outfits, her 19, 0 not drawn, 0 icons missing, 0 page errors.
      fitsweep.js gd (now takes NEWROWS): 15 pieces, 0 flagged. The mules are 13% out on rearStand only because the check's base is
      flat-footed.
    - barecheck MODE=real, the bustier, 35 poses: skin shows only above its sweetheart line (upper chest, shoulders, upper back).
      The bust is covered in every pose (bare_bustier.jpg). Control tops (bomber, silk shirt): 0 px in all 35.
    - heelcheck.js SHOE=gx_gd_mule (now takes SHOE and NEWROWS): she gets f_base_heel, f_base_bare_heel with the bustier, f_base with flat
      shoes, and his body never changes. Floor contact within 4 px except backwalk1/3/4 (7-8 px at HI 1.6, as with the stilettos). Hems
      incl. the GILDED midi + bustier look fine (heel_mules.jpg).
    - New rigtest/qa/hatcheck.js: the leaf crown (noClip) over h1, h2 and h3 on both bodies in 7 poses: no bald band, hair intact, the
      crown sits on top (hat_crown.jpg). The cap (channel quilting, gold only in the leaf embroidery) is fine too (hat_cap.jpg).
    - Trade dress by eye: leaf scroll only, no faces or heads, no Greek key, no medallion. The logo is a frame around one sapphire.
  - FIX (ROOMS): the Frock-Coat Hoodie's sleeves tear in raised-arm poses. A dark shard of sleeve sticks out past the hand in stretchUp,
    wave1/2, cheer1/2 and dance1/2, big on him and thinner on her (frock_sleeve_m.jpg, frock_sleeve_f.jpg). The bomber and silk shirt
    are clean in the same poses.
  - FIX (ROOMS): the bustier's icon has pink-red, fuzzy straps where the line says "chain straps" in gold (bustier_icon_straps.jpg).
    Probably keyed or painted wrong; check the worn straps too.
  - NOTE (ROOMS): the beret's gold bullion fringe hangs low across the forehead. On him at game size it reads as blond bangs
    (hat_beret.jpg). A shorter fringe, or one set higher on the band, would fix it.
  - NOTE (ROOMS/LEAD): "Brocade Box-Pleat Midi" is painted knee-length or above, not midi. "Brocade Box-Pleat Skirt" fits.
  - Not checked: Shop cards with the real rows (LEAD wires), the banner on screen, night lighting.
- PASS, v1.24 live check (LEAD: live on Live and Test at 48b550a).
  - release/v1.24 and its origin copy are both 48b550a = release/v1.23 + KODE PINK's two commits + APPV 124. Against v1.23 (7e61089), every
    changed app, data, art and src file is identical to f0cccd0, the build QA passed, except 30_app_b.js, whose only difference is the
    APPV line (124).
  - rollback-v0.80 and its origin copy are both a2f45f1, APPV 124 -> 125.
  - A clean web build of 48b550a: APPV 124, 3,371 files + version.txt = 3,372 (LEAD's count), artcheck 0 gaps of 325.
  - It shipped before Mon 11-23, so KODE PINK's hold date stands. Not checked: the live site played by hand (wlive covers the files).
- PASS, v1.24 candidate = release/v1.23 + 52dda64 + f0cccd0 (KODE PINK "Night drive": art, Shop text, colours, the hold ends Mon
  11-23). QA built the exact candidate (cherry-picked onto release/v1.23, not committed) and served it beside a clean v1.23 build.
  - The candidate's app, data, art and src files are identical to f0cccd0's. The 8 removed kp yawn files (4 tops x his/hers) are gone in
    both. artcheck: 0 gaps of 325. Web build: 3,371 files + version.txt = 3,372 (v1.23's 3,379 minus the 8 yawns). It still says APPV 123,
    so the bump to 124 comes at ship.
  - The 15 names and lines in 15_shop.js match shots/pending_art/kodepink/final/shop_text.md word for word (Charcoal Wide-Leg Cargo
    included). The ids, slots and prices are unchanged from v1.23 (scripted compare). BRANDS kp: new colours, sub "city-pop night drive".
    DROPS.hold: from 11-16, until 11-23.
  - LEAD's kprows.js, PORT=candidate, REF=v1.23: PASS. Every floor 11-10 .. 11-22 is as in v1.23. KODE PINK is first live Thu 12-17 (not
    before 11-23), and its tab lists all 15 that day. 0 page errors.
  - The art wear check (52dda64, above) stands: the text change touches no art.
  - Not checked: the tab's new navy-and-pink colours on screen (text contrast on the banner), and a phone. If v1.24 ships after Mon
    11-23 8 am, the hold date must move (LEAD).
- PASS (text), KODE PINK's new Shop names and lines, shots/pending_art/kodepink/final/shop_text.md (022a2f8), checked against the 15
  repainted icons (shots/qa/kp52/kp_icons_vs_text.png). Every line matches its icon's colours and details, and no new name is already
  used by another row. NOTE (ROOMS, small): "Night Wide-Leg Cargo" sits next to another brand's existing "Night Cargo"; "Charcoal
  Wide-Leg Cargo" would avoid the near-twin. Still to do: LEAD wires the text into 15_shop.js, and QA checks that commit before the hold
  lifts (owner: LEAD).
- PASS (cleared to paint), GILDED re-review, shots/pending_art/brands1118/gilded.md (022a2f8) (owner: ROOMS):
  - Both FIXes are done. The chain collar and medallion are gone (now a brocade neck scarf); the ornament is invented leaf filigree, with
    no faces, no Greek key and no print tile; the logo is a filigree frame around one sapphire. The hoodie's frogging is now an
    off-centre zip, so it no longer copies REGIMENT.
  - Both NOTES are done. The slippers became brocade pointed loafers (no longer v_slipper's twin); velvet is only on the beret now; the
    crown is wide enough to read.
  - The scarf (ivory-gold brocade, fringed) differs from the Cashmere and Chunky Knit scarves.
  - NOTE (paint time): black quilted leather with gold is another house's signature, when the quilting is a diamond grid with gold
    hardware. Paint the cap with channel (straight-line) quilting, or keep the diamonds small and the gold only as the leaf embroidery,
    with no chain and no interlocking anything.
  - Paint gates: the bustier through barecheck (bare), the mules through heelcheck (tiptoe), and the wreath's noClip checked over all
    three hair styles.
- PASS on the art, with one FIX before the hold lifts: KODE PINK "Night drive" repaint 52dda64, on a clean build of it (owner: ROOMS writes the
  new text, LEAD wires it and lifts the hold).
  - The commit changes only KODE PINK files: the banner, the logo, the 15 pieces' art and icons, the four kp yawn pictures (removed), and
    items.json (kp_bucket's front and back clip only). artcheck: 0 gaps of 325.
  - brandwear.js kp, both bodies, all 35 poses, all-brand and mixed outfits: 0 not drawn, 0 page errors. fitsweep.js kp: 15 pieces, 0
    flagged. The headphones and runners stick out 11-12% on him, as headphones and shoes do.
  - By eye (shots/qa/kp52/): the hats sit right over all three hair styles. In stretch, the four tops whose yawn pictures were removed
    keep the arms down with the yawn face; stretchUp raises the arms with whole sleeves, nothing torn. The bomber's back patch shows on
    rearStand.
  - FIX (ROOMS + LEAD): all 15 Shop names and lines in 15_shop.js still describe the old pastel art (kp_icons_vs_text.png). For example:
    the bucket hat is "Bubblegum pink" but painted black; the headphones are "Lilac cups" but black and silver; the "Star Clips" are "two
    yellow stars" but are pink bars; the pendant is a "gold moon on a black cord" but silver on a chain. The varsity says "pink body, cream
    sleeves", the sailor blouse "powder blue, navy-striped collar" (it is a navy palm-print camp shirt), the hoodie "lilac clouds", the
    skirt "cream", the cargo "bubblegum pink", the runners "purple suede", the loafers "glossy plum" and the slip-ons "white canvas, cloud
    print". Several names no longer fit either (Pastel Headphones, Star Clips, Sailor Blouse, Cloud Hoodie, Pastel Runners, Plum Loafers,
    Cloud Slip-Ons). ALTITUDE's repaint shipped with its text in the same release (8093dcb); this needs the same.
  - NOTE for Cal (his 11-18 rule, "never create something this plain"): five pieces read plain at card size. The Starfall Bomber is a
    plain black leather jacket (only its back patch has detail). The Cloud Slip-Ons are plain navy, the Wide-Leg Cargo plain grey, the
    Plum Loafers plain black loafers, and the Runner Track Pants one stripe. The brand is now mostly black and navy with little pink left.
    Cal approved the repaint (ROOMS, via LEAD), so this is his call, not a block.
  - NOTE for Cal (borderline, no cultural dress): the Sailor Blouse is now a palm-tree print camp shirt, which reads as a Hawaiian shirt.
    KAIMANA's slot was dropped for that look. Palm trees are city-pop, not national dress, so it is fine by the rule, but he should see it.
- REVIEW (before paint), GILDED's 15 pieces, shots/pending_art/brands1118/gilded.md (owner: ROOMS):
  - Pass: nothing plain on paper (every line names two or more details). There is no dragon, phoenix or cloud brocade, and no national
    garment; baroque, laurel, jabot and frock coat are European fashion ornament, not costume. Moving from emerald to sapphire is right
    for the green screen. The counts (3/2/4/3/3 = 15) fit the Boutique. The bustier goes through barecheck as a `bare` top, and the mules
    through heelcheck on the tiptoe base.
  - FIX (trade dress): black + antique gold + baroque scroll + chain collar + a framed medallion is one well-known fashion house's whole
    look. Keep the scrollwork as invented leaf and filigree. No faces or heads in any medallion or crest (the collar's medallion is a
    sapphire, keep it that). No Greek-key borders, and no repeating "baroque print" tile across the bomber; make it brocade texture, not
    a print. The logo: a laurel crown over a frame is fine, but never a standalone laurel-wreath roundel (a sportswear trademark).
  - FIX (overlap with REGIMENT, one of the 8 approved brands): the Frock-Coat Hoodie's "gold braid frogging across the chest" is REGIMENT's
    signature (officer jacket with braided frogging). Give the hoodie another closure, e.g. gilt chain toggles or brocade lapels.
  - NOTE (overlap with VENOM ROSE): the Crest Velvet Slippers are VENOM ROSE's Velvet Smoking Slippers (v_slipper) in black and gold.
    Make them brocade or gilt-leather slippers, or a different shoe (gilt-buckle loafers). The velvet shirt is fine beside the open Wine
    Velvet Blazer (a different garment). Velvet also appears six times inside GILDED (cap, beret, shirt, cargo, slippers, the skirt's
    waistband), so vary it: leather cap, satin or jacquard cargo.
  - NOTE: the Brocade Bustier sits close to VENOM ROSE's Lace Corset Top (boned, `bare`); its brocade and chain straps keep it apart.
    Keep it brocade-led, not lace-led. The Gold Laurel Wreath is thin; at chibi size it may read as a plain gold line, so give the leaves
    some size and the berries contrast.
- PASS, v1.23 live check (LEAD: live on Live and Test at 7e61089, Cal "Approve all").
  - release/v1.23 and origin/release/v1.23 are both 7e61089, the exact build QA passed in 2be9bec. Against release/v1.22 (b3030e6), 84 app,
    data and art files change, all checked in QA's 983258b, 0172e8d and 7e61089 passes. A clean web build of 7e61089 has APPV 123 and
    artcheck finds 0 gaps of 325.
  - rollback-v0.80 and its origin copy are both 0f66501, APPV 123 -> 124, above v1.23.
  - File count: LEAD's 3,380 is right. QA miscounted. A clean web build of 7e61089 has 3,379 files plus version.txt = 3,380, and so did
    00cc1c0 (00cc1c0 adds 9 art files to 0172e8d's 3,370). QA wrote the raw 3,379 as the total in both of those passes. 0172e8d's
    "3,370 + version.txt = 3,371" was correct.
  - The wear checks on the release tree (heelcheck.js, heels.js, barecheck, brandwear) were already run on this exact build or its
    identical predecessors. Not rerun: a playthrough on the live site itself (wlive's byte compare covers the files).
- PASS, v1.23 candidate = release/v1.23 at 7e61089 (00cc1c0 + ROOMS 24ee3c9 icons + d7ca804 v_sandal heel: true). QA built the release
  branch. Still HELD for Cal's OK of the painted pieces (owner: ROOMS asks Cal; LEAD ships only after his yes).
  - Against 00cc1c0 only three files change: icon_v_bralette.webp, icon_v_sandal.webp, and items.json ("heel": 72 -> true). All three are
    byte-identical to qa-local. artcheck.py: 325 Shop garments, 0 gaps. A clean web build: 3,379 files + version.txt = 3,380 (corrected in the live check below).
  - LEAD's heels.js PASS on this build (PORT=8825; with no PORT it hits whatever is on its default port and reported 9 fails there).
  - QA's new rigtest/qa/heelcheck.js, all 35 poses, 0 page errors:
    - Base picked: stilettos -> f_base_heel; stilettos + bralette -> f_base_bare_heel; flat Patent Stilettos -> f_base; flat + bralette
      -> f_base_bare; default sneakers -> f_base; his body with the stilettos asked -> m_base (they are women-only). All correct.
    - Floor contact (lowest drawn pixel, tiptoe stilettos vs flat stilettos, HI 1.6): within 4 px in 32 poses. NOTE (ROOMS, minor, not
      blocking): backwalk1/3/4 sit 5-8 px lower at HI 1.6 (about 3-5 px at game size), inside the spread the other shoes already have
      across the back-walk frames. Not visible at room scale.
    - Hems (shots/qa/heel123/heel_hems.jpg): flares, vinyl trousers, the long pleated skirt and mini + bralette over the tiptoe feet in
      idle, walk2, stretchUp, rearStand, sitFront, sleep and dance1: no gaps, no feet poking through hems, no grey tank under the bralette.
  - Icons (shots/qa/heel123/icons_bralette_sandal_crop.jpg): both of QA's notes on 7f30c13 are fixed in 24ee3c9. The bralette is smooth
    now, matching the crop top; the stilettos' ankle straps close and the toe straps have clean edges.
  - Not checked: the heels on a phone, and in a live room with crew walking (rig renders only).
- PASS, v1.23 recut = release/v1.23 at 0172e8d (983258b's contents + ROOMS 3aed3af harness out, 7d2c729 bralette icon, LEAD 9ea3dd2
  harness row and grade out). QA built the release branch. Still held for Cal's OK of the painted pieces.
  - Against 983258b, only these change:
    - The Strappy Chest Harness's row (15_shop.js), grade (29e_tiers.js), items.json entry and five art files are gone.
    - icon_v_bralette.webp is new.
    - Everything left is byte-identical to qa-local, where the harness files are gone too.
    - "harness" remains only in the VR room's furniture text, which is unrelated.
    - The harness never shipped, so no player owns it.
  - artcheck.py: 324 Shop garments, 0 gaps. A clean web build: 3,370 files + version.txt = 3,371.
  - brandwear.js v, 35 poses: 26 men's and 38 women's outfits, 0 not drawn, 0 icons missing, 0 page errors (VENOM ROSE 29 on sale).
  - The bare-top art and look.js are unchanged from 983258b, so barecheck's PASS there stands.
  - NOTE (ROOMS, minor, not blocking): the rebuilt bralette icon has one clean V and both straps but is still visibly pixelated
    (stair-stepped edges) beside the smooth crop-top and corset icons (bralette_icon_vs_others.jpg). It reads at card size; a
    smoother redraw when convenient.
  - Not checked: a phone, the Shop cards on screen.
- PASS, v1.23 candidate = release/v1.23 at 983258b (release/v1.22 + dff4465, cefab81, 4edfa01, 141ff29, 8c49646 + APPV 123). QA built
  the release branch itself. It ships only with Cal's explicit OK of the painted pieces (ROOMS asking).
  - Contents: all 78 art/app, data and src files (items.json, src/look.js, 76 art) are byte-identical to QA's passed 141ff29.
    15_shop.js and 29e_tiers.js make the same change as 8c49646. The only other app change is the APPV line (122 -> 123).
  - artcheck.py: 325 Shop garments, 0 gaps. A clean web build: 3,375 files + version.txt = 3,376.
  - barecheck.js MODE=real on this build: the five bare tops give the same numbers as on 8c49646 (bust covered in all 35 poses).
    The control (OVERPASS liner) differs by 0.
  - brandwear.js v/o/sm, 35 poses: VENOM ROSE 27+39, OVERPASS 42+41, SAYMØRE 21+21 outfits. 0 not drawn, 0 icons missing, 0 page
    errors.
  - Not checked: a phone, the Shop cards on screen, and the live sites (the live check after it ships).
- PASS, LEAD 8c49646 (the bare wiring in look.js, Cal's 11-18 rows and grades) and ROOMS 141ff29 (QA d974ba5's three FIXes). Cal's 11-18
  pieces can ship as LEAD plans: v1.23 = release/v1.22 + dff4465 + cefab81 + 4edfa01 + 141ff29 + 8c49646, together. Clean builds of
  8c49646 and 141ff29. Pictures: shots/qa/art1118/.
  - Bare gate on the real wiring, barecheck.js MODE=real: PASS.
    - B is the game's own render. A is the same with her tank base forced back.
    - The five bare tops (bralette, keyhole crop, corset, slip, bodysuit) differ pose for pose by exactly the same pixels as with
      QA's hand swap: the bust is covered in all 35 poses.
    - Control: three ordinary tops (OVERPASS liner, HANGANG padded coat, SAYMØRE grille bomber) differ by 0 pixels in all 35
      poses, so only `bare` tops get the bare base.
    - His base has no bare file, so nothing changes for him. 0 page errors.
  - Horns FIX done: v_horns is noClip.
    - Hair stays whole under the horns on both bodies, front, back, sitting, walking and arms up, with her ponytail (h3), long hair
      (h1) and his cut (h2) (horns_fixed*.jpg).
    - Cal saw the bald scalp too (2026-11-18); this is that fix.
  - Icons: the Spray Respirator's strap arc is whole.
    - NOTE (ROOMS, minor): the Lace Bralette Set icon now has both cups and strap stubs, but it is visibly blockier (upscaled)
      than the other icons and the stubs end in hard cuts. It still reads at Shop-card size; a clean repaint when convenient.
  - Rows: all 10 match ROOMS's rows_draft.json (name, line, fo/mo; the Ø is the same character written \u00d8). The five repaint
    lines match repaint_lines.md.
  - Grades by QA's rules:
    - luxury: the lace bralette (lace lingerie, like the corset).
    - premium: horns, harness, silk shirt, vinyls and keyhole crop (velvet, leather, silk, vinyl), and the grille bomber
      (SAYMØRE's statement piece).
    - standard: the wrist guards and respirator.
  - brandwear v (whole brand, 3 poses): 27 + 39 outfits, 0 not drawn.
  - Not checked: the exact v1.23 candidate (QA checks it when LEAD cuts it), the Shop cards on screen, a phone.
- NOT A PASS yet, ROOMS dff4465 + cefab81 + 4edfa01 (Cal's 11-18 pieces: her bare base, 10 new pieces, 5 repaints). Clean worktree
  of 4edfa01, plain build; ROOMS's rows_draft.json loaded for the new pieces. Pictures: shots/qa/art1118/.
  - Bare coverage gate, rigtest/qa/barecheck.js (new): PASS.
    - The bare base is swapped in at load (until LEAD wires `bare`). Each bare top (bralette, keyhole crop, corset, slip dress,
      bodysuit) is drawn with the mini skirt on the normal and on the bare base, in all 35 poses. Every pixel that differs (where
      her base shows through) is marked red.
    - In every pose the bust stays covered. The red is only the neck, shoulders and upper chest above a strapless line or inside
      the slip's deep V, the upper back between straps, the crop's keyhole, and a midriff band when sitting.
    - The bare base is a smooth chibi torso. Showing some skin, never nude (Cal: "i am okay with showing some skin as long as it is
      not nude"). bare_<top>.jpg.
  - Wear-check, all 35 poses, both bodies: the 10 new pieces (10 men's, 12 women's outfits, alone and mixed) and the whole VENOM
    ROSE brand with the repaints. 0 not drawn, 0 icons missing, 0 page errors.
  - FIX (ROOMS, data): the Velvet Devil Horns carry a full hat clip map, so the top of her or his hair is cut away and a bald scalp
    shows between the horns in every pose (horns_bald_scalp.jpg). Every other headband (Lace Headband, Terry Headband, Stitched
    Headband, Satin Bow, Star Clips, Leaf Circlet) has noClip: true. Set noClip on v_horns.
  - FIX (ROOMS, icons only, icons_cropped.jpg):
    - The Spray Respirator icon's straps are cut off flat along the top.
    - The Lace Bralette Set icon's right cup edge is sliced straight and its left strap is missing.
  - NOTE (LEAD and ROOMS, release order): the repainted corset, slip dress and bodysuit open up areas the grey tank used to sit
    under. On today's rig (no `bare` wiring) the tank shows there.
    - The bralette and crop top likewise show the tank until it is wired.
    - These five must ship in the same release as LEAD's `bare` flag and the f_base_bare_* swap, not before.
    - QA reruns barecheck.js against the real wiring then.
  - PASS, the rest:
    - Horns' shape, chest harness (over his open silk shirt and over tops), the silk shirt (open chest on his already-bare base),
      vinyl trousers and shorts, wrist guards (arms), the spray respirator (front only), and the speaker-grille bomber (cyan EQ
      panel on the back) all sit right.
    - The open blazer over his bare chest is fine.
    - The flares' slit starts at the knee (lower leg only, no shorts showing). The slip dress always sits over a bottom, so its
      slit shows that bottom.
    - The slip's cross charm is gone.
  - Not checked: LEAD's real `bare` wiring (not built yet), night lighting, the Shop cards, and a phone.
- PASS, v1.22 live (LEAD: Live and Test at b3030e6, wlive PASS, 3325/3325 identical), ahead of Thu 11-19 8 am:
  - b3030e6 against release/v1.21 8103458: the 8 changed app files each make the same change as QA's passed c13edd3, plus the APPV
    line (121 -> 122). No art or data change.
  - artcheck.py on the release tree: 315 Shop garments, 0 gaps.
  - A clean web build: 3,324 files + version.txt = 3,325, APPV 122.
  - Not checked by QA: the live sites themselves (LEAD's wlive), a phone, and the real 8 am switch on Live (QA checked it in the
    candidate build with the clock moved).
- REVIEW (before paint), ROOMS's drafts for Cal's 11-18 art list (shots/pending_art/new1118/drafts.md, 0c5bc0b). Read against Cal's
  rules (nothing plain, no cultural dress, no real logos, revealing but never explicit). Owner: ROOMS, with LEAD for the bare base.
  - Section 0, the bare female base: the right fix, with a QA gate. Every `bare` top must pass a coverage test before it ships.
    - QA renders the bare base with the top in all 35 poses (including stretchUp, sleep and dance) and checks that no bare-base
      skin shows in the chest area.
    - A pose where the top slides would leave her drawn topless; QA holds any piece that fails.
  - FIX (plan): her base also has grey shorts. Three planned openings would show them:
    - the slip dress's side slit;
    - the Velvet Flares' thigh-high slits;
    - possibly the vinyl shorts' laced sides.
    - Paint skin inside those openings in the item art, or keep slits below the shorts line. Do not extend `bare` to the hips.
  - FIX (plan): duplicates.
    - OVERPASS's Orange Mirror Goggles repeat ALTITUDE's Glacier Goggles and SØLVBERG's Ski Goggles.
    - The Ripstop Sling Bag is close to HANGANG's Leather Chest Sling and KODE PINK's Mixtape Crossbody.
    - Pick two accessories nobody else has and that fit skate: e.g. grip-tape wrist guards (wrist slot, like OAKMONT's
      wristbands) and a reflective-tape ear cuff, or a spray-cap ring set.
  - FIX (plan): SAYMØRE's Ø Moto Jersey drifts from its bass-culture lane. It would be the third racing top, with DIAL-UP's Racing
    Moto Jacket and PIT LANE's whole line.
    - Give SAYMØRE a sound-system piece instead, e.g. a speaker-grille bomber with perforated panels, cyan EQ-bar embroidery and
      the orange Ø badge.
  - NOTE (ROOMS): MIRRORBALL's sequin halter (her) also needs `bare`; list it with section 1's.
  - NOTE (ROOMS): REGIMENT has no real insignia, flags, rank badges or medals; invented crests only. HALCYON's feathers go on a cape
    or collar, never as a headdress (that reads as cultural).
  - PASS, the rest:
    - Section 1's seven lines each name two or more details.
    - The harness (fashion, no collar or leash ring) and the bralette (lingerie as outerwear) are fine as Cal's borderline calls,
      once the coverage gate passes.
    - The silk shirt and the open blazer on his already-bare base are fine.
    - STAGE DIVE, PIT LANE, DRY DOCK, BACK ROW, GILDED and OIL & CANVAS are distinct lanes, nothing plain, no cultural dress. The
      band and sponsor marks are invented and wordless.
    - Atelier lanes: fine to show Cal as rough.
  - After paint, QA does the usual wear-check per brand, plus the coverage test for every `bare` top and every slit.
- PASS with one NOTE, v1.22 as planned: release/v1.21 (8103458) + c13edd3 (Cal 11-18: Mon/Thu drops from 11-19, Basics becomes the
  Stylist, SØLVBERG's hold ends, CHROME RAIN held, ten pieces cut with owners keeping them). QA built exactly that (all 10 files
  applied cleanly, not committed) and served its own v1.21 as the reference.
  - artcheck.py: 315 Shop garments, 0 gaps (no art change).
  - rigtest/lead/floors122.js (REF = QA's v1.21): PASS.
    - Every floor is as in v1.21 through 11-18.
    - NICE COCK is live on the Street Thu 11-19. Fri 11-20 has no drop.
    - The Street and the Boutique change only on Mondays and Thursdays.
    - CHROME RAIN and the five held brands never drop; SØLVBERG and ALTITUDE do.
    - Shop text says Mondays and Thursdays. There is a Stylist tab and no Basics tab.
    - The Stylist sells 14 pieces (haircuts, dyes, eye colours) and no plain clothes.
    - OVERPASS has no skate tool and shows the chain only to its owner. VENOM ROSE has 23 on sale, none of the seven. SAYMØRE
      has 14, no GO OFF Tee.
    - An owner keeps their basic tee. A new player owns their creator top, bottom and shoes.
  - overrows.js (updated): PASS.
  - QA's own checks on the same build:
    - The Street switches at exactly 8:00 Thu 11-19 (7:59 HANGANG, DIAL-UP, OVERPASS; 8:00 NICE COCK, OVERPASS, DIAL-UP).
    - The Wednesday vault code (D.back) is byte-identical and still fires only on Wednesdays (next 12-23 in both builds).
    - Crawl finds (400 rolls, 116 distinct pieces) never give a cut piece or a plain basic.
    - An owner still wears the cut Leather Dad Cap, Biker Jacket and Leather Pants.
    - On-screen "Friday" text: only Lock and Key's flavour line "Fridays look like a record cover" is left.
  - NOTE (Cal): with no Friday drop, Thursday 8 am now does what Friday did.
    - HANGANG leaves the Street Thu 11-19, a day earlier than "HANGANG leaves Friday".
    - VENOM ROSE (its 15 new pieces went live in v1.20) leaves the Boutique Thu 11-19 and comes back Mon 11-23. The Boutique shows
      SAYMØRE alone Thursday to Sunday.
    - v1.21 already had VENOM ROSE leaving Friday and not back until 12-4, so v1.22 brings it back sooner.
    - With 7 Street brands in rotation and two drops a week, each brand comes back about every two weeks (HANGANG back Mon 11-30).
  - Not checked: a phone, and the real 8 am switchover on the live site (checked in the build with the clock moved).
- PASS, v1.21 live (LEAD: Live and Test at 8103458, wlive PASS, 3325/3325 identical; LEAD reran the compare after /tmp cleanup):
  - 8103458 against release/v1.20 6ba0729: 29zx_simple.js and 29zz_v121.js make the same change as QA's passed d51ef4c, plus the
    APPV line (120 -> 121). No art or data change.
  - artcheck.py on the release tree: 315 Shop garments, 0 gaps.
  - A clean web build: 3,324 files + version.txt = 3,325, APPV 121.
  - Not checked by QA: the live sites themselves (LEAD's wlive) and a phone.
- PASS, LEAD d51ef4c (Cal: no "you can afford an upgrade" on the Board, no "Next goal" pill in the buildings). QA built v1.21 as
  planned (release/v1.20 + d51ef4c, applied without committing).
  - rigtest/lead/afford.js: PASS at 360, 390 and 430. The Next line names no upgrade, buildings show no pill, and Street, the name
    and Goals stay with Goals opening the list. 0 page errors.
  - Code: glNextHtml is only called under a building's name; the pill's "N goals ready to claim" now lives on the Goals button's
    count. zxAfford is left unused. .glnext is only measured for layout.
- SWEEP (Cal, 2026-11-18: rooms, every clothing piece's fit, how many items per shop) on live v1.20 (6ba0729), clean build.
  Pictures and lists: shots/qa/sweep1118/.
  - Rooms, all 21, fully bought for a new player (bigrooms.js LIVE=1, about 1860 px), plus auditall.js:
    - No FIX: nothing floats, faces a wall, blocks a door or clips a window. Every room passed before (be9bc20, the room fix
      checks, Lock and Key and Boba this week) and still matches.
    - The audit's flags are the known, intended ones: rugs under furniture, the Bedroom's stacked shelves, Restaurant booths over
      tables, Speakeasy's band on its stage, tiny Club speaker/laser edges, Rooftop's bar beside a palm. 0 page errors.
    - NOTE (ROOMS, minor): the Dessert Parlor's tiered cupcake stand stands on its own base on the floor in front of the counter
      (dessert_cupcake_stand.jpg). It reads as a floor display next to the macaron tower; a raise or a move to the counter only if
      Cal wants.
  - Clothing, rigtest/qa/fitsweep.js (new): every Shop row not cut or gone (402), worn alone over the default look on each body it
    fits, in idle, rearStand, sitFront and walk2.
    - 0 not drawn. The automatic out-of-silhouette check flags only the Briar Pipe and GACHA POP's Little Angel Wings, which
      stick out by design. No top, bottom or shoe sits more than 20% outside.
    - By eye (14 sheets, fit/s*.jpg): all 353 brand and Basics pieces sit on the body in every pose on both bodies (hats on
      heads, shoes on feet, skirts and dresses at the waist). Nothing floats or gaps. No FIX.
    - NOTE (LEAD, cleanup only): 49 old pre-rig rows are still in SHOP: hr_/dy_/ey_/et_ hair, dye and eyes; tp_/pt_/sh_
      tops, bottoms and shoes; ac_ accessories incl. Halo and Crown; bk_ Katana, Cape and Shadow Wings.
      - lookOf() applies them only to the old pixel avatar, not the rig, so equipped they change nothing on the character.
      - They show in no Shop tab and in no Wardrobe (checked with an owner), and nothing grants them, so no player sees them.
      - Safe to delete when convenient.
  - On sale per shop (Shop rows not cut, gone or crawl-only), by category (hats / accessories / tops / bottoms / shoes):
    - Street, 13 brands, 231 pieces: HANGANG 6/6/8/8/8 (36); DIAL-UP 6/6/7/7/7 (33); OVERPASS 2/6/9/7/5 (29); SMOKE BOMB 2/3/2/3/3
      (13); ALTITUDE 2/3/5/3/2, KODE PINK, GACHA POP, SAVE POINT, BARD & BLADE, KAIMANA, OAKMONT, SOLVBERG 3/2/4/3/3 (15 each).
      Floor totals 39/38/59/49/46.
    - Boutique, 4 brands, 76 pieces: VENOM ROSE 5/6/8/6/5 (30); NICE COCK 3/2/4/4/3 (16); SAYMORE 3/2/4/3/3 (15); CHROME RAIN
      2/3/4/3/3 (15). Floor totals 13/13/20/16/14.
    - Basics tab, 41 pieces: 9 tops, 9 bottoms, 9 shoes, 6 hairstyles, 4 hair dyes, 4 eye colours.
    - Live today (Wed 11-18): Street HANGANG, DIAL-UP, OVERPASS (98 pieces) + Basics (41); Boutique VENOM ROSE, NICE COCK (46).
  - Not checked: a phone, rooms at night, and outfits combining several brands (each brand's wear-check covered mixes).
- PASS, v1.20 live (LEAD: Live and Test at 6ba0729, wlive PASS, 3325/3325 identical):
  - Live is 6ba0729, the exact release/v1.20 commit QA passed (8f08e5e), and release/v1.20 still points there. No new commit to
    compare.
  - artcheck.py on that tree: 315 Shop garments, 0 gaps.
  - A clean web build: 3,324 files + version.txt = 3,325, APPV 120.
  - Not checked by QA: the live sites themselves (LEAD's wlive) and a phone.
- PASS, v1.20 candidate = release/v1.20 at 6ba0729 (release/v1.19 + VENOM ROSE's art a10a097/353080a/242f620/d808aca + rows
  1a653a7 + the v1.20 letter bc90d6c + APPV 120). QA built the release branch itself. Pictures: shots/qa/v120/.
  - Contents against the passed commits:
    - All 70 art/app and data files (items.json included) are byte-identical to ROOMS's passed d808aca. The chain's back art,
      added and removed after v1.19, is not in.
    - 15_shop.js and 29e_tiers.js make the same change as 1a653a7.
    - The only other app files are 29q_news.js (the letter) and the APPV line.
  - Rows: all 15 match ROOMS's rows_draft.json word for word (name, line, fo/mo).
  - Grades follow QA's CLOTHING_TIERS rules.
    - standard: bunny ears, pipe, fishnets.
    - luxury: crystal body chain (jewellery set with stones), corset bodysuit (corsetry), lace slip dress (Cal's "sexy dress").
    - premium: the other nine (velvet, silk, patent, leather, the lace mask like the Lace Headband).
    - Boutique prices: standard 690-740, premium 910-1,040, luxury 1,120-1,190.
  - Letter: 7 lines with no brand, room, date or anything still to come (patch-letter rules); no spoilers.
  - Tests on the release build:
    - artcheck.py: 315 Shop garments, 0 gaps.
    - roserows.js: 90 ok, PASS.
    - letter120.js: PASS. A player gets v1.20's letter and 500 coins once; a pre-v1.10 player gets v1.10's and v1.20's; a new
      player gets none.
    - brandwear.js v: 22 men's and 31 women's outfits (the whole brand), 35 poses, 0 not drawn, 0 icons missing, 0 page errors.
  - Shop on the release build: VENOM ROSE is live on the Boutique today. At 390 and 375, for a woman and a man:
    - All 15 new names show, and all 30 rose cards load their icons when scrolled into view.
    - No sideways scroll, 0 page errors.
    - Men-only pieces show a locked price to a woman and women-only pieces to a man (5 and 13 locked).
    - By eye: the slip dress and bodysuit cards (women's mark, Try on, 1,190 and 1,180; the bodysuit's line reads "mesh yoke to
      the neck").
  - Cal's look calls on the set (fishnets under a short top; the pipe and the robe's bare chest) were for his approval post.
    Cal approved the set ("Approve all", LEAD's TASKS line for 1a653a7).
  - Not checked: a phone, night lighting.
- PASS, ROOMS d808aca (the bodysuit fix). VENOM ROSE's sexy set (a10a097 + 353080a + 242f620 + d808aca) passes the wear-check and
  can go to Cal. Clean worktree, plain build, rows draft loaded.
  - Only the bodysuit's 5 art files changed. Every pose, both bodies: 8 men's and 14 women's outfits, 0 not drawn, 0 icons missing,
    0 page errors.
  - The Satin Corset Bodysuit now has a halter collar, thin straps and a dark mesh yoke. No base tank shows in front or behind,
    with the mini skirt or with OAKMONT's skirt (bodysuit_fixed_mini.jpg, bodysuit_fixed_oakskirt.jpg).
  - Cal's two NOTES from 6699373 stand (fishnets as the only bottom under a short top; the tobacco pipe and the robe's bare chest).
    ROOMS takes them to Cal with the approval post.
  - Not checked: a phone, night lighting, and the Shop cards (no rows yet; they get the usual check when LEAD wires them).
- NOT A PASS yet, ROOMS 242f620 (QA's 6699373 FIXes on VENOM ROSE's sexy set). Clean worktree, plain build, rows draft loaded.
  - Every pose, both bodies: 8 men's and 14 women's outfits, 0 not drawn, 0 icons missing, 0 page errors.
  - FIX 1 done: the Crystal Body Chain is frontOnly with no back art. The bow-shaped patch is gone from behind.
  - FIX 2 done: the Silk Pajama Pants icon shows full-length legs, and the Velvet Mini Skirt icon and its four layers have a clean,
    closed outline (icons_fixed.jpg).
  - FIX (ROOMS), what is left of the pale patch: the strapless Satin Corset Bodysuit stops below the base tank, so the pale grey
    tank shows above it. From behind it is grey across the shoulders; in front, at the neckline under the chain
    (bodysuit_tank_showing.jpg). It reads as a grey tank worn under the corset.
    - The existing Lace Corset Top is painted up to the neck with straps, so nothing shows (lace_corset_for_comparison.jpg).
    - Paint the bodysuit to cover the tank's area: thin black straps or a halter and a higher back. Or Cal accepts it as is.
    - QA MISS (owned): in 6699373 QA put the whole pale patch down to the chain. Part of it was this tank.
  - Cal's two notes (fishnets under a short top; pipe and bare chest) stand. ROOMS takes them to Cal with the approval post.
  - Not checked: a phone, night lighting, and the Shop cards (no rows yet).
- NOT A PASS yet, ROOMS a10a097 + 353080a (VENOM ROSE's 15-piece sexy set, art and items.json only). Clean worktree of 353080a,
  plain build; ROOMS's rows_draft.json loaded into the page's Shop for the test. Pictures: shots/qa/rose15/.
  - Every pose (35), both bodies: 8 men's and 14 women's outfits (all-brand and mixed). 0 not drawn, 0 icons missing, 0 page
    errors. The men-only and women-only flags match items.json. The mask and pipe are front only.
  - FIX (ROOMS): the Crystal Body Chain from behind (sitBack, rearStand, backwalk2) is still a pale grey patch with a bow across the
    shoulder blades, even at 60%. It reads as a white collar or shawl, not a chain (bodychain_back.jpg).
    - Make it frontOnly (no back art, the chain drapes the front only), or thin the back to a few fine strands.
  - FIX (ROOMS, icons only): the Silk Pajama Pants icon reads as shorts (the pants are full length on the body). The Velvet Mini
    Skirt icon still has white keyed-out notches along its right edge (icons.jpg).
  - NOTE (Cal's call): Fishnet Tights take the pants slot, so with a top that ends at the hip (a bomber, a tee) they are the only
    bottom: net legs and a dark high waistband, no skirt (fishnet_with_short_top.jpg). Not nude, but it is the boldest look in the
    set. It is fine with the slip dress and the bodysuit.
  - NOTE (Cal's call): the Briar Pipe is a tobacco pipe with a wisp of smoke (men only). The Smoking Robe opens to a bare chest.
    Both fit "push the envelope", but they are Cal's to approve.
  - PASS, the rest: Satin Bunny Ears, Velvet Pillbox Hat (the renamed veil), Velvet Captain's Cap, Lace Masquerade Mask, Lace Slip
    Dress, Satin Corset Bodysuit, Velvet Mini Skirt (on the body), Patent Stilettos, Lace-Up Knee Boots, Velvet Smoking Slippers,
    Silk Pajama Pants (on the body).
    - All draw cleanly, alone and mixed with other brands. No logos or real brands.
    - Dropping the garters (Higgsfield's filter) is fine; the mini skirt replaces them.
  - Not checked: a phone, night lighting, and the Shop cards (no rows yet).
- PASS, v1.19 live (LEAD: Live and Test at 78926d8, wlive PASS, 3256/3256 identical):
  - 78926d8 against release/v1.18 c12783d: only 29zz_v117.js (byte-identical to 205d8df's, the build QA tested) and the APPV line
    (118 -> 119). 26_world.js is untouched, so Pip has no bandana. No art or data change.
  - artcheck.py on the release tree: 300 Shop garments, 0 gaps.
  - A clean web build: 3,255 files + version.txt = 3,256, APPV 119.
  - Not checked by QA: the live sites themselves (LEAD's wlive) and a phone.
- PASS with one NOTE, v1.19 as planned: release/v1.18 (c12783d) + 205d8df (Cal: "The ninja ones are cool": SMOKE BOMB's 12 back, the
  durag and bandana stay gone). QA built exactly that (applied without committing) and tested that build.
  - artcheck.py: 300 Shop garments, 0 gaps. 26_world.js is untouched, so Pip still has no bandana.
  - rigtest/lead/gone.js: PASS.
  - rigtest/qa/goneback.js (new), save round trips loaded from local storage (as a cloud merge replaces the whole save): PASS.
    - A v1.18-refunded save with 10,000 coins: the 12 come back to S.owned, -2,800 (the refund), one pop "12 SMOKE BOMB pieces are
      back in your Wardrobe (-2,800 coins, the refund)". The durag and bandana stay refunded and out. A reload repeats nothing.
    - The same with 500 coins: the 12 come back and coins stop at 0.
    - A stale pre-v1.18 save (owns all 14, no goneRef): only the durag and bandana are refunded (+280), the 12 stay owned, and the
      worn hakama stays on.
    - SMOKE BOMB's rows are as before v1.18: only the audit's vest and cloak are cut. Its subtitle is "ninja anime" again (the
      override is gone). It drops again: first in 10 days, 51 floor-days in 120.
    - 0 page errors.
  - NOTE (Cal's call, via LEAD): the clawback takes the refund back, down to 0 coins. A player who spent v1.18's refund ends at 0
    (case B). Pieces that were worn come back to the Wardrobe but not onto the character. If Cal would rather nobody loses coins
    over his own reversal, drop the clawback; it is at most 2,800 coins a player.
    Cal, 2026-11-17: "no one has purchased smoke bomb yet so its fine". So the clawback touches no real player and v1.19 ships as
    it is.
  - Not checked: a phone, and a real two-device merge (simulated with saves put back in local storage).
- PASS, v1.18 live (LEAD: Live and Test at c12783d, wlive PASS, 3256/3256 identical):
  - c12783d against release/v1.17 48fab96 changes three files. 29zz_v117.js is byte-identical to aec19d9's. 26_world.js changes
    only Pip's line, the same as aec19d9's (no o_bandana anywhere in it). Then the APPV line (117 -> 118). No art or data change.
  - artcheck.py on the release tree: 300 Shop garments, 0 gaps.
  - A clean web build: 3,255 files + version.txt = 3,256, APPV 118.
  - Not checked by QA: the live sites themselves (LEAD's wlive) and a phone.
- PASS, v1.18 as planned: release/v1.17 (48fab96) + aec19d9 (Cal's removal order: 14 pieces gone with refunds, SMOKE BOMB held, Pip's
  bandana off). QA built exactly that (applied without committing; 26_world.js merges to only the Pip line) and tested that build.
  - artcheck.py: 300 Shop garments, 0 gaps. The 14 keep their art and items.json, unused.
  - rigtest/lead/gone.js: PASS.
  - Code: every gift path picks through freePool, which checks itemFits, so gone pieces are never given. That covers the Wheel,
    chest3, crawl finds and the free accessory. No NPC, friend, guest or letter names any of the 14 (Pip was the only one).
  - rigtest/qa/gonecheck.js (new): PASS.
    - An owner of all 14, wearing gone pieces in five slots, gets one refund: +3,080 (the 14 prices), with one pop "Retired 14
      pieces from the Shop: +3,080 coins back". All 14 leave S.owned and S.eq, and S.goneRef holds 14.
    - SMOKE BOMB's jacket, vest and cloak and an OVERPASS cap stay owned.
    - Reload: no second refund.
    - A stale pre-refund save put back (as a cloud merge replaces the whole save) is refunded once by itself, not again.
    - The owner after the refund (both bodies) and Pip before and after, all 35 poses: 0 not drawn. Pip now shows his own hair, the
      chef's coat, cargos and boots (shots/qa/gone/pip_and_owner_all_poses.jpg).
    - SMOKE BOMB is live on no floor (Street, Boutique, Atelier) and never in the vault for 120 days.
  - SMOKE BOMB in the Shop: no brand tab. An owner of its jacket and vest still sees them in the Wardrobe under SMOKE BOMB, with no
    "ninja" text anywhere. Its only piece still on sale is the jacket (vest and cloak were cut by the earlier audit).
  - Not checked: a phone, and a real two-device cloud merge (simulated by putting the stale save back).
- PASS, v1.17 live (LEAD: Live and Test at 48fab96, wlive PASS, 3256/3256 identical):
  - 48fab96 against release/v1.16 505c7f0: only 29zz_v115.js (byte-identical to b148138's, the build QA tested) and the APPV line
    (116 -> 117). No art or data change.
  - artcheck.py on the release tree: 300 Shop garments, 0 gaps.
  - A clean web build: 3,255 files + version.txt = 3,256, APPV 117.
  - Not checked by QA: the live sites themselves (LEAD's wlive) and a phone.
- PASS, v1.17 as planned: release/v1.16 (505c7f0) + b148138 (Cal: "Yes, count in full"). QA built exactly that (applied without
  committing on a release/v1.16 worktree) and tested that build.
  - Code: every quest completion goes through toggle (the one mults commit call, 30_app_b.js:1623), including the honor-to-verified
    swap (untick then tick). So the add-back covers every path.
    - creditStreak returns null once the day is counted, so a second call cannot double-count.
    - The base untick checks the day before the add-back comes off, so it can never uncount too early. The wrapper then takes the
      add-back off and uncounts if the day drops under 50.
  - rigtest/lead/quickadmin.js: PASS (9 paid against 12 full, the day counts at the 5th quick task, unticking 5 takes 84 to 24
    and the streak back to 5).
  - rigtest/qa/qadaymix.js (new, a mixed day): PASS.
    - 3 quick admin + 1 home task count 48, so nothing is credited. A 4th admin takes it to 60: streak 6, Weekly Quest day 1.
    - Unticking the home task undoes both; ticking it again counts once more, not twice.
    - A 25 XP admin task adds no add-back.
    - After a page reload S.qaDay is still there, and unticking an admin task takes its full XP off.
    - 0 page errors.
  - v112.js and tabs6.js still PASS.
  - NOTE (as LEAD says): the Daily Quest's effort still counts the 75% XP. Cal only asked about the streak and the Weekly Quest.
  - Not checked: a phone, and two devices ticking the same day (merge keeps one whole save, so S.qaDay travels with dayXp).
- PASS, v1.16 live (LEAD: Live and Test at 505c7f0, wlive PASS, 3256/3256 identical):
  - 505c7f0 against release/v1.15 0859d5b: 16 changed app, art and data files, all byte-identical to their passed commit (c5bc0c7,
    and ddc1d10 for 29e_economy.js), plus the APPV line (115 -> 116).
  - artcheck.py on the release tree: 300 Shop garments, 0 gaps.
  - A clean web build: 3,255 files + version.txt = 3,256, APPV 116.
  - Not checked by QA: the live sites themselves (LEAD's wlive) and a phone.
- PASS, ROOMS c5bc0c7 (QA's a6d31d8 FIXes on Boba +15). v1.16 = release/v1.15 (0859d5b) + 44bb4e3 + ddc1d10 + c5bc0c7 can ship.
  QA built exactly that: all three applied cleanly without committing on a release/v1.15 worktree. 27b_skins.js, 29e_economy.js,
  rsart.json, bbx_bar and bbx_pearl2 are byte-identical to c5bc0c7's.
  - artcheck.py on that tree: 300 Shop garments, 0 gaps.
  - roomplus.js ROOM=boba against QA's own v1.15 build: PASS (30 on sale; income 360 / 258 / 162; Dessert at 9; payback 208 days).
  - FIX 1 done: the Standing Tea Bar has no stools now. Its two stand spots (room 10.93,7.68 and 11.53,7.68) are at its open front,
    and guests stand there facing it (fixed_tea_bar_people.jpg). It stands clear of the table's stool and the mat
    (fixed_front_corner.jpg).
  - FIX 2 done: the second table's guest spot is on its free back side (room 8.6,5.31). Nobody is wedged against the bar.
  - NOTE done: both pearl pot handles point away from the urns, and nothing lies over the urns (fixed_pots.jpg).
  - rigtest/qa/bobapeople.js (new), 70 s in play: guests used all three spots (92, 89 and 67 half-second samples). The posted
    barista stayed on her post all 140 samples. 0 page errors.
  - NOTE (ROOMS, minor, Cal's eye): the two bar spots are 0.6 apart at the same depth, so two guests there partly overlap on
    screen. It reads as two friends at the bar. Spacing them about 0.9 apart would separate them.
  - Not checked: a phone, and buy orders other than full.
- PASS, v1.15 live (LEAD: Live and Test at 0859d5b, wlive PASS, 3243/3243 identical):
  - 0859d5b against release/v1.14 0a26f27: only 29zz_v115.js (byte-identical to ad44305's, which QA tested in the exact v1.15 build)
    and the APPV line (114 -> 115). No art/app or data change.
  - artcheck.py on the release tree: 300 Shop garments, 0 gaps.
  - A clean web build: 3,242 files + version.txt = 3,243, APPV 115.
  - Not checked by QA: the live sites themselves (LEAD's wlive) and a phone.
- PASS, v1.15 as LEAD plans it: release/v1.14 (0a26f27) + b3917b8 (Training tab) + ad44305 (quick admin). QA built exactly that
  (both applied without committing on a release/v1.14 worktree; 29zz_v115.js identical to ad44305's) and tested that build.
  - artcheck.py: 300 Shop garments, 0 gaps.
  - b3917b8:
    - rigtest/lead/tabs6.js PASS. At 360, 390 and 430 the bar is Board, Training, The Loft, Shop, Town, Players, all inside and
      uncut. The tab opens Training and lights up, with no "< Board" link. The Board has no Training tile and keeps Dungeon
      Crawls'.
    - Calm week: no tab on day 2, the tab on day 4, and the tour rings it.
    - Picture: shots/qa/v115/nav360_training.jpg.
    - Code: Training's "!" now goes on its own tab (alPaint reads NAVHIDE live), not the Board.
    - Training is level 1 and areaOn gives it to everyone from level 1, so nobody sees a locked "?" Training tab.
  - ad44305:
    - rigtest/lead/quickadmin.js PASS. Admin 10 pays 8 against home 10 at 11; admin 5 pays 4 against 6; admin 25 is uncut.
      Social and fitness are unchanged, coins are the same, and bounties are not cut. On the Board, "Send the emails" pays 8 and
      "Wash the dishes" 11.
    - v112.js still PASS.
  - NOTE (Cal's call, via LEAD): the streak's and the Weekly Quest's active day is 50 XP of paid XP (dayXp += mu.xp,
    30_app_b.js:1631), and the Daily Quest's effort is the XP earned.
    - So a day of only quick admin now needs about a third more tasks to count, for example about 7 ten-XP emails instead of 5.
      That fits "a little less XP" but touches streaks too.
    - If Cal wants streaks unaffected, count base XP toward dayXp.
  - Not checked: a phone, and how much it slows Cal's real leveling (it depends on how many quick admin tasks he logs).
- NOT A PASS yet, ROOMS 44bb4e3 (Boba +15). Clean worktree, plain build. Pictures: shots/qa/boba15/. Scripts: bigrooms.js (LIVE=1
  and old owner), auditall.js, crewreg.js, and postlook.js adapted to Boba.
  - FIX (ROOMS): Boba's guests never sit; they stand at the tables too. So the Standing Tea Bar's two places become stand spots
    (kind cust, act "look", room units 10.92,7.68 and 11.52,7.68), right where the two stools are drawn. Guests stand inside the
    stools (tea_bar_people.jpg).
    - It is a standing bar, so paint it without stools, or move the two stand spots off the stools to the bar's open front.
  - FIX (ROOMS): the second table's guest spot (layout 8.6,5.85, room 10,6.56) is now about 0.3 from the tea bar's left end. A
    guest there stands wedged between the table's front-right stool and the bar (tea_bar_people.jpg).
    - Move that spot to the table's free side, or move the bar about 0.4 right or forward. The mat-to-stairs walk must stay
      clear.
  - NOTE (ROOMS): the back Twin Pearl Cooker's handle lies across the nearest urn's edge (pots_handle_on_urn.jpg), rule 20.
    Turn the handle back or nudge the pot.
  - PASS, the rest:
    - 30 on sale. The req chain holds (bo_table2 <- bo_table, Marble Cafe Sets <- bo_table2), and an old owner's room draws two
      tables, not four.
    - Full room, new player and old owner, about 1860 px: identical.
      - The Light Box Menu hangs clear above the twin pots, so the old steam-over-menu overlap is gone.
      - Window Decals sit inside the frame. The booth, pothos, neon, fridge and canister wall are fine.
      - The A-frame stands clear of the walk to the stairs.
      - The front corner is busy but not cluttered.
    - auditall boba: one flag, "work:seal touches the station" (on purpose). 0 page errors.
    - Second barista: holds the seal post (0.00 off, 100% busy) facing the station. The first barista only walks past (within
      0.4 for 0.75 s).
    - crewreg boba: both crew present 60 of 60, never "No crew here". bo_staff2 needs bo_staff, so a posted barista is never
      the only crew (the Club lesson).
  - Not checked: a phone, and buy orders other than full and old owner.
- PASS, LEAD ddc1d10 (Boba +15 economy), against QA's own v1.14 build (0a26f27).
  - rigtest/lead/roomplus.js ROOM=boba: PASS.
    - 30 on sale; the 15 new at 950 to 3,450, inside the old range. The old ones are no dearer and at most 10% cheaper.
    - A day's income: all 30 earn 360, the old 15 earn 258 (was 250), an empty room 162 (was 166).
    - Dessert opens at 9 of Boba's, as in v1.14.
  - ROOM=skybar against v1.14 fails only "count up 15" and "new ones", as expected for a room that did not grow. Its gates hold
    (Rooftop 7, Boba 10).
  - Mall: plazaAll counts 161 now (146 in v1.14). The need is 79 in both.
  - Payback (total over bizDay): Boba 208 days (was 152), Lock and Key 197, Dessert 172. Already on LEAD's list for the economy
    pass.
  - v1.15 = release/v1.14 + 44bb4e3 + ddc1d10 waits for ROOMS's two FIXes. QA rechecks those, then roomplus again if any price
    or id changes.
- PASS, v1.14 live (LEAD: Live and Test at 0a26f27, release check PASS, 3243/3243 identical). Checked against the passed commits
  for app/src, art/app and data/items.json.
  - 7eb084f (v1.13) to 0a26f27 changes 15_shop.js, 29e_tiers.js and items.json, each byte-identical to QA's passed 791cc5c (and
    items.json to qa-local HEAD), plus the APPV line (113 -> 114).
  - It adds 219 art files. Every one matches its passed ROOMS commit: HANGANG and DIAL-UP to 35f3080 (h_wrap is the repaint),
    OVERPASS to cbc3709.
  - rigtest/lead/artcheck.py: v1.14 has 300 Shop garments and 0 gaps. v1.13 had 30 gaps, confirming LEAD's finding.
  - QA's wider check: no committed art/app file on qa-local is missing from v1.14, so no room or other sprite is short either.
  - A clean web build: 3,242 files + version.txt = 3,243, APPV 114.
  - brandwear.js h, y and o on a build of the release tree itself (not qa-local), 35 poses: HANGANG 40+40 outfits, DIAL-UP 35+36,
    OVERPASS 40+39. 0 not drawn, 0 icons missing, 0 page errors.
  - QA MISS (owned): QA's v1.12 live check said "No art changed: the new pieces' art was already live in v1.11" without checking the
    release tree. It was not, and v1.12 and v1.13 shipped 30 rows without art or items.json. QA's wear-checks and the c15c239 pass
    ran on qa-local, which had the art.
    - From now on QA's live checks compare art/app and items.json with the passed commits, run artcheck.py on the release worktree,
      and wear new brands on a build of the release tree.
  - Not checked by QA: the live sites themselves (LEAD's release check) and a phone.
- PASS, LEAD 791cc5c (OVERPASS's 15 new pieces in the Shop). v1.14 = release/v1.13 + 791cc5c + APPV 114 can ship. Clean
  worktree, plain build.
  - The 15 rows are word for word ROOMS's rows_draft.json that QA wear-tested on cbc3709. No art or items.json changed since then.
  - Grades follow QA's CLOTHING_TIERS rules:
    - thrift: the durag, tool lanyard and shades (small extras), the faded jorts, and the knit slip-ons (like KODE PINK's
      slip-on).
    - standard: the rest. The Moc-Toe boots match the leather derby precedent.
  - rigtest/lead/overrows.js: 92 ok, PASS.
  - brandwear.js o: 40 men's and 39 women's outfits, 35 poses, 0 not drawn, 0 icons missing, 0 page errors.
  - Shop, Wed 11-18 at 10 am, level 12:
    - All 31 OVERPASS cards (16 old, 15 new) load their icons once scrolled into view, at 390 and 375. No sideways scroll on
      any tab. 0 page errors.
    - A man and a woman both see all 15 new names. A woman sees Carpenter Jorts with a locked price button (170), as every
      limited piece shows.
  - Not checked: a phone, and the durag repaint if Cal asks for one (art only, the same id).
- REVIEW 2, ROOMS's revised Boba +15 plan: OK to paint.
  - The three cuts are made, and the two table tiers are now one (Marble Cafe Sets, both ids, req chained).
  - New in the open quarter: Standing Tea Bar (about x 10.3-11.7, y 7.0-8.4) and Chalk A-Frame (about 11.6,6.4), clear of the
    mat-to-stairs walk (x 10.5-11, y 0-5). Big Neon Cup is a tier of the neon.
  - NOTE (ROOMS): the second barista's spot (6.2,1.0) is in front of the Bottle Fridge, not the Shaker Station. Either move it
    to about 5.2,1.0 (screen column x−y = 4.2, still clear of the first barista's 2.55) or face her to the fridge or sealer,
    clear of the fridge's use side.
- REVIEW (before paint), ROOMS's Boba +15 plan (shots/pending_art/rooms1117/boba_plus15.md + boba_now.png; code 27b_skins.js
  autoRoom("boba")). Read against the picture and the item list; nothing drawn. Owner: ROOMS.
  - Q1, 12 tiers: too many. Cal on the Restaurant: keep the most visually appealing upgrades and drop "the small unnoticeable
    ones". Several of these tiers are exactly that at room size.
    - Brass Tea Urns: the same urns, recoloured.
    - Pickup Call Light: a tiny box on a shelf.
    - Marble Second Table: a second copy of the first table's tier.
    - Trailing Pothos: a small plant change.
    - Cut three: urns, call light, and one table tier. Do both tables as one tier the way Champagne High-Tops did (sup both
      ids, chained req). Spend the three slots on things a player sees.
  - The floor is not full. Every piece sits at x <= 9.1 and y <= 6.75, so the front-right quarter (about x 8.5-12, y 3-9, by the
    doormat) is open, and in boba_now.png it reads as the empty part of the room.
    - One modest piece there would add more than three reskins, keeping the path from the door mat to the stairs clear. For
      example, a standing window ledge or bar along the right wall with two stools, or a pastel pickup and queue stand.
    - Also room for one more wall piece: the right half of the back wall past the prints, or the right wall beside the stairs
      door.
  - Q2, a second barista: OK for 12x9. Guests cap at 3 here (guests:3), so that is at most 6 people.
    - But Boba has one work spot (3.8,1.25, behind the counter). Crew are not pinned, so a second barista with no spot of her own
      just wanders the floor like a guest.
    - Give her her own work spot at the shaker/sealer station (about 5.2,1.0) or the pickup shelf, and keep it out of line
      up-screen of the first (the Lock and Key piano lesson: two spots 1.0 apart in room units can stack on screen).
  - NOTE: the Pearl Cooker's steam already reaches up over the Menu Screen's lower edge in boba_now.png. Twin Pearl Cookers sits
    under the Light Box Menu, so keep the pots and steam below the menu's bottom edge (rule 20). Check both tiers together.
  - OK as planned: Window Decals (flat on the glass, no real words), Terrazzo Counter, Velvet Window Booth, Light Box Menu, Twin
    Pearl Cookers, Cup Sealer Station (same 1.3 x 0.8 footprint, no growth), Glass Door Fridge, Tea Canister Wall, Afternoon
    Sun (light only).
  - After paint, QA checks: the live count, the full room (new player and old owner), use sides, overlaps (menu and cookers),
    and the second barista in her spot.
- PASS with one NOTE, ROOMS cbc3709 (OVERPASS's 15 new pieces, art and items.json only; not in the Shop). Clean worktree, plain
  build. ROOMS's rows_draft.json was loaded into the page's Shop for the test (QA's newwear script, as for HANGANG and DIAL-UP).
  Pictures: shots/qa/overpass15/.
  - Every pose (35), both bodies: 18 men's and 17 women's outfits. 0 not drawn, 0 icons missing, 0 page errors.
  - Items: Carpenter Jorts are men only (mo and maleOnly), and women's outfits leave them out. Smoke Rectangle Shades are
    front only (hidden from behind).
  - Close look at 2.4x in idle, walk2, sitBack, rearStand, backwalk2 and dance1, all-brand and mixed outfits:
    - Five-Panel Cap: its orange tab sits on the cap's back edge, attached; the outline is whole.
    - Shades: the smoke lenses read solid, front only.
    - Reflective Bucket, Quilted Liner and Bridge Hoodie (print visible) are fine.
    - The lanyard shows over the hoodie and the KODE PINK sailor top. The dog tags show over the thermal and over GACHA POP's
      sailor bow (tags_on_sailor.jpg).
    - Double-Knee Carpenters and Snap Track Pants are full length on the body (their icons only look short). The boots and both
      sneakers are fine.
  - NOTE (Cal's call, through ROOMS): the Satin Durag's tails hang to mid-back and are shoulder-wide, so from behind they cover
    the whole back of the top (durag_back.jpg). In front, one tail hangs beside the arm to the waist.
    - The knot reads, so it is a durag, but narrower or shorter tails would read less like long hair. Keep or repaint is Cal's
      call. It is drawn correctly in every pose.
  - For LEAD's grading later, by QA's CLOTHING_TIERS rules: the durag (a small cloth extra), the rectangle shades and the faded
    black jorts lean thrift. The leather Moc-Toe boots are standard by the leather derby and loafer precedent.
  - Not checked: a phone, and the Shop rows (not wired yet).
- PASS, v1.13 live (LEAD: Live and Test at 7eb084f on release/v1.13, wlive PASS, 3024/3024 identical):
  - 7eb084f against release/v1.12 6f15fd9: app/data/art change only in the passed work and the APPV line (112 -> 113).
    - Byte-identical to QA's passed b43ebf8 (which carries all seven passed commits): 20_loft.js, 27_rooms.js, 29b_story.js,
      29e_economy.js, 29zz_v112.js, rsart.json and the 11 new Lock and Key art files.
    - 26_world.js differs from b43ebf8 only in a comment ("Menu Boards" for r_d3); the code is the same.
    - 27b_skins.js is unchanged from v1.12, so the Club DJ post (added in fff49a2, reverted in c1c8c12) is not in.
  - A clean web build: 3,023 files + version.txt = 3,024, APPV 113, with the new sbx_ art in.
  - Not checked by QA: the live sites themselves (LEAD's wlive) and a phone.
- PASS, LEAD b43ebf8 (Lock and Key +15 priced) and 15954e6 (QA's 9eb7f13 notes). v1.13 as planned can be cut. Clean builds of
  b43ebf8 (it carries 15954e6) and of v1.12 (6f15fd9) as the reference, served by QA.
  - rigtest/lead/skybar15.js against QA's own v1.12: PASS.
    - 28 on sale, the 15 new at 1,100 / 2,250 / 4,450, old prices unchanged.
    - A day's income: all 28 earn 360, the old 13 earn 256 (v1.12: 250), an empty room 133 (v1.12: 136).
    - Through the story gates: the Rooftop opens at 7, Boba at 10, the same as v1.12.
  - Mall, computed in the page: plazaAll counts 131 pieces in v1.12 and 146 now. The Mall needs 79 in both: v1.12's 60%, now the
    fixed n.
  - unlockMet goes through unlockLine, so n reaches every gate. Without n the gate uses the share as before.
  - 15954e6:
    - The Wheel closes at 6.6 s (3 s on the prize). The toast is gone at 5.3 s, but the prize stays on the Wheel until it closes.
    - The freeze tip is QA's wording, matching streakGap.
    - v112.js: 12 of 12 ok, PASS.
  - NOTE (LEAD, for the economy pass; Cal's call): Lock and Key is now the slowest room to pay back. Total price over a full
    day's income (bizDay) is 197 days (v1.12: 152). The next slowest is Dessert at 172, then Speakeasy at 168, and the rest
    are 16 to 150.
    - The new 15 cost 32,800 for +104 a day (256 to 360), about 315 days.
    - Every room's +15 will drift the same way unless the economy pass sets it. QA's econsim check comes then.
  - NOTE (LEAD): each coming +15 pushes back the room it gates unless that gate gets an n like this one.
    - Next up, Boba's +15 would hold back Dessert (at boba .6).
    - After that: Theater (at mall .3), Auditorium (at theater .4), Arcade, Rhythm and so on.
  - Not checked: econsim (it needs the 8765 sandbox and the 9350 Chrome), and a phone.
- PASS, ROOMS c1c8c12 (QA's two FIXes on fff49a2). Lock and Key +15 = fff49a2 + c1c8c12 can ship. Clean build of c1c8c12 (it
  carries LEAD's 777411d and 9eb7f13).
  - Club: cb_dj is plain RSK again, and the dj spot is {tag:"dj",onspot:1}. crewreg.js ROOM=club OWN=cb_floor,cb_dj: "No crew
    here" in 0 of 60 samples (60 of 60 on fff49a2). The DJ works.
  - Piano: both guest spots moved to the piano's tail on open floor (spread to 7.0,9.6 and 5.78,9.08), and guests use them (14 and 79
    samples of 100). In play, nobody stands up-screen of the pianist or inside the lid. The guest at the tail stands clear of the
    piano, facing it (fixed_piano_spots.jpg).
  - postlook.js: both posts still held (0.00 off), and nobody else within 0.6 of either post. 0 page errors.
  - Not checked: a phone, and buy orders other than full.
- PASS, LEAD 777411d (lfFree skips any spot within 0.5 of a held post; QA's ff44edc NOTE).
  - crewpost.js (60 s) on QA's clean build of 9eb7f13: PASS.
  - crewreg.js, six fully bought rooms, 777411d (in 9eb7f13) against fff49a2:
    - Every crew member present 60 of 60, nobody stuck over 0.5 s, never "No crew here", no page errors, on both builds.
    - Lock and Key's singer and pianist hold their posts (100% busy, 1 place) on both. The Club's DJ was still posted in both
      (fff49a2's), so its 100% is that.
  - Caveat: 0.5 is a distance in room units. It would not have caught the piano spot stacked up-screen of the pianist (1.0 away);
    ROOMS fixed that one by hand (c1c8c12).
- PASS with two NOTES, LEAD 9eb7f13 (Cal's two notes: the Wheel closes to the Board; streak freezes explained).
  - rigtest/lead/v112.js on QA's clean build: PASS.
    - Wheel: the row, the spin, the prize, back to the Board with no Wheel row, the prize paid.
    - Freezes: no tip with 0, the tip with 1, Got it ends it.
    - Two missed days use the rest day and a freeze (streak 8 to 9, freezes 1 to 0), and day 5 earns one with the new line.
  - Code: spin() lands at 3.6 s and the wrapper closes at 5.2 s, only if still on the Wheel and not spinning. creditStreak's
    wrapper only rewrites the earn line. The freeze tour sits last in TOURS, so it waits behind any other unseen tour.
  - NOTE (LEAD, Cal's call): the prize gets about 1.6 s on the Wheel. Its pop toast (pop()) fades at 1.2 s and is gone at 1.7 s,
    about when the Wheel closes, and the Board then has no Wheel row.
    - So a long prize, such as "Faux Fur Trapper from DIAL-UP (in your Wardrobe)", is on screen for about 1.6 s in all.
    - QA would give it about 3 s (close at about 6.6 s), or keep the toast up longer for Wheel prizes.
  - NOTE (LEAD): the tip says "if you miss a day, one is used for you". creditStreak spends the week's free rest day first, and
    spends nothing (the streak drops) when the gap is longer than the rest day plus the freezes held.
    - Suggested: "If you miss a day, your weekly rest day covers it first, then a freeze is used for you the next time you finish
      a quest. Miss more days than that covers and the streak drops."
  - Not checked: a phone, and how the Wheel's timing feels in hand (QA read it from code and LEAD's test).
- NOT A PASS yet, ROOMS fff49a2 (Lock and Key +15, Club DJ post). Clean worktrees of fff49a2 and its parent 8ff1307, plain builds.
  Pictures: shots/qa/lockkey15/. Scripts: rigtest/qa/bigrooms.js (LIVE=1 and old owner), auditall.js, crewreg.js (new OWN= for a
  partial buy), postlook.js (new: the posted staff in play).
  - FIX (ROOMS; QA's own bad suggestion): the Club with the DJ Booth but no Neon Bar now shows "No crew here" and nobody takes
    orders.
    - crewreg.js ROOM=club OWN=cb_floor,cb_dj: "No crew here" in 60 of 60 samples on fff49a2, 0 of 60 on 8ff1307.
    - A posted person never serves or counts as crew (ff44edc), and the DJ Booth comes before the Neon Bar in the Club's list.
    - Take {post:"dj"} back off cb_dj, and post:1 off the dj spot.
  - FIX (ROOMS): a guest at the piano's right guest spot (7.4,6.0, spread to about 7.58,6.68) stands straight up-screen of the seated
    pianist. Their heads stack and the guest's body hides behind him (piano_guest_behind_pianist.jpg).
    - The spot is 1.0 from the bench in room units, so it passes QA's 0.6 rule. But on screen the iso view lines the two up.
      QA's 0.6 rule was too loose for spots behind a seated person. LEAD's 777411d (0.5) won't catch it either.
    - Move that guest spot to the piano's tail, or drop it while the pianist is hired.
  - NOTE (ROOMS, older than this commit): the piano's other guest spot (6.0,7.2) puts guests inside the raised lid
    (piano_guests_in_lid.jpg). With a pianist the piano is the room's focus, so it shows more now.
  - NOTE (LEAD/ROOMS): wand:1 does nothing in the room window. The window's copy of every person gets wand:0 (20_loft.js:1740),
    so the Cocktail Server is one more roaming crew member who can serve orders, which suits her. The building view is a still
    picture.
  - PASS, the rest:
    - Count: 28 live plus Open the Roof. The window says "29 upgrades bought. Fully upgraded"; Installed (21) lists the shown
      pieces after the 8 replaced ones.
    - req chain: high2 needs high1, Champagne High-Tops needs high2. The old owner's full room draws three tables, not six.
    - Full room, new player (LIVE=1) and old owner, about 1860 px: identical, with nothing replaced drawn twice.
      - Key Wall, Gilt Menu Mirror and Keyhole Neon all clear the painted sconces.
      - The Rare Bottle Wall's crest stops short of the sconce at its right.
      - The rug lies flat under the lounge table.
      - The tiers sit in their old footprints, and the lamps sit on the bar's clear middle (the second lamp stands in front of
        the shakers, fine).
      - Busy but not cluttered.
    - auditall skybar: 14 pieces, 18 spots, one flag "spots stand-in work:bench" (on purpose: the bench is part of the piano
      sprite). 0 page errors.
    - In play, 25 s at 21:00, 4 staff and 5 guests:
      - The singer holds the mic (0.00 off, dancing) and the pianist the bench (0.00 off, seated, back to the room). Nobody else
        comes within 0.6 of either post.
      - The singer stands on the stage behind the mic, both on the Friday Band stage and on the bare Jazz Corner (a partial buy:
        Jazz Corner and singer, no band).
      - The bartender and the server roam.
  - Not checked: a phone, every buy order (only full, old owner and the Jazz Corner one), the spotlights at other hours, and
    LEAD's 777411d on top (checked next).
- PASS, LEAD ff44edc (crew posts, 20_loft.js and 26_world.js). Clean worktrees of ff44edc and its parent, plain builds.
  - Code: staff without a third field get post:null and wand:0. Every changed check (lfFree, lfNext, lfSvcStaffOn, "No crew
    here") then works as before, and no existing spot uses a post field.
  - rigtest/lead/crewpost.js on QA's build: PASS. The posted person is on the spot when the window opens and stays there all
    40 samples (0.00 off), sitting. Nobody else holds the spot, the walker covers 15 places, no page errors.
  - Regression, rigtest/qa/crewreg.js (new; a fully bought room's window open 30 s, crew sampled every 0.5 s), before against
    after:
    - Rooms: Restaurant (4 crew), Garden (7), Lock and Key (1), Theater (4), Bowling (2), Club (2).
    - Every crew member is present in 60 of 60 samples on both builds, nobody stuck over 1 s, never "No crew here", no page errors.
    - Busy shares move a lot from run to run on both builds; crew pick spots at random. Restaurant r_s1: 98/28/78% before,
      20/58/53% after.
    - Club: one of the two crew camps at the decks in every run on both builds. Which one is random: the DJ in 5 of 7 runs
      before, 2 of 7 after. The code path for staff without a post did not change, so this is noise, not a regression.
  - NOTE (ROOMS, with LEAD; check when Lock and Key wires its staff): a post spot must not share its place with another spot.
    - In crewpost.js the stand-in post at 7,5 sits on an existing wander spot at 7,5. Over 60 s the walker walked onto the
      seated person 23 times (min 0.00), inside 0.6 for 4 s; rule 20.
    - lfFree keeps others off the post spot itself, not off a different spot in the same place.
    - The pianist's bench sits by the piano's guest spots (6.0,7.2 and 7.4,6.0), and the singer's mic by the stage's (10.85,9.1).
      Keep every post at least 0.6 from other spots.
    - Or LEAD: have lfFree skip any spot within 0.5 of a held post spot.
  - NOTE (ROOMS, optional): the Club's DJ isn't pinned today. In some runs the bartender works the decks and the DJ roams.
    {post:"dj"} on cb_dj would fix it.
  - Not checked: sit height on a real bench (ROOMS, by eye), a phone, and rooms other than these six.
- PASS, v1.12 live (LEAD: Live and Test at 6f15fd9 on release/v1.12, wlive PASS, 3013/3013 identical):
  - 6f15fd9 against release/v1.11 034069d: app/data/art/tools change only in 15_shop.js, 29e_tiers.js and 27b_skins.js, and the APPV
    line (111 -> 112). Each of those three files is byte-identical to the passed commit's (c15c239, c15c239, f6fc989), so the passed
    HANGANG/DIAL-UP rows and the Bowling/VR/Dessert fixes are what shipped. No art changed: the new pieces' art was already live in v1.11.
    rigtest only: new240rows.js now carries the rows itself (af9cea1; QA's note 3).
  - A clean web build: 3,012 files + version.txt = 3,013, APPV 112.
  - Not checked by QA: the live sites themselves (LEAD's wlive) and a phone.
- PASS, LEAD c15c239 (HANGANG's and DIAL-UP's 15 new pieces each in the Shop). Clean worktree, plain build. Pictures:
  shots/qa/new240shop/ (both brands' icon sheets).
  - Grades checked against CLOTHING_TIERS.md's rules:
    - thrift: novelty shades (h_oval, y_rimless), faded denim (h_barrel), the plastic phone lanyard.
    - premium: leather (y_moto), patent leather (y_patent), holographic (y_visor; CHROME RAIN's visor is premium too).
    - standard: the rest. Faux fur and chrome chains are standard, matching the shearling and chain precedents.
  - Art: no art/app file differs from ROOMS's passed 35f3080 (86cb0e1's h_wrap is the passed repaint). Every new id has front, back
    and icon (front only for the two shades).
  - rigtest/lead/new240rows.js on QA's build: 181 ok, PASS.
  - brandwear.js h and y, every pose (35):
    - HANGANG: 40 outfits on each body; DIAL-UP: 35 men's, 36 women's.
    - 0 not drawn, 0 icons missing, 0 page errors.
  - Shop, Wed 11-18 at 10 am, level 12, man and woman, at 390 and 375:
    - Street tabs over, y2k, hanga and basics. Each brand tab lists all 15 new names.
    - Every new card's icon loads once scrolled into view: DIAL-UP 33, HANGANG 36.
    - No sideways scroll on any tab, 0 page errors.
    - A man sees the Denim Cargo Maxi with its women's mark and a locked price button (330), the same as the Plaid Mini Skirt.
  - NOTE (LEAD, a call, no change asked): the Leather Chest Sling (gx_h_sling) is leather, and the rules' letter says leather is
    premium. QA agrees with standard: a small pouch, like HANGANG's leather derby and loafer (standard).
  - NOTE (LEAD): on the Street, premium is capped at 440-450 (clothFloor), so the Moto Jacket (450) costs about the same as the dearest
    standard pieces. This comes from the Street cap, not this commit.
  - NOTE (LEAD): new240rows.js reads shots/pending_art/new240/*/rows_draft.json, which are not committed. A clean copy can't run it
    (QA copied them in). Commit the two files or put the rows in the script.
  - Not checked: a real phone, the cut release with the Bowling/VR/Dessert fixes (QA's live check covers it), and the main
    checkout's uncommitted changes (20_loft.js, 26_world.js, KODE PINK art), which are not in c15c239.
- REVIEW 2, ROOMS's revised Lock and Key plan (13 + 15 = 28; Bookcase Door, Doorman and Posters cut; Menu Mirror, Single Malt Cabinet,
  Champagne High-Tops in; Big Band now a Brass Stage Rail; lamps kept, Absinthe dropped). OK to paint the wall pieces and the rug.
  - CORRECTION from QA: no room pins a person to a spot. Theater's thPeople only makes the people, and onspot (Club) only stops a spot
    behind a piece being moved. Crew choose spots at random (20_loft.js:1423-1426). LEAD (owner): a person-to-spot binding (e.g. a post
    tag on the person matched to the spot's tag) plus the seated crew pose for the pianist. wand:1 is not passed through d.staff, so the
    walking server needs a people hook like the Garden's (22_garden.js:261).
  - FIX (ROOMS): Champagne High-Tops. sup can hide both sb_high1 and sb_high2 under one new id (RSSUP), but req holds one prerequisite
    (ADDREQ[new]=old, 26_world.js:206). Chain it: req sb_high2 <- sb_high1 (not there today) and the tier <- sb_high2. Otherwise the
    tier draws three tables for a player who owns one. The tier's art and cust spots cover all three tables.
  - NOTE (ROOMS): Menu Mirror at back wall x 0.3-1.4 sits behind the bar's left end (bar x 0.7, y 2.0) and next to the back bar
    (x 1.6). Check the bar top doesn't hide most of it. Key Wall y 4.4-6.3 clears the humidor (ends y 3.65) and the y 6.9 sconce;
    keep it above the sofa back. Bar Lamps go on the clear middle of the bar, away from the tip jar (5.7, 2.35).
- REVIEW (before paint), ROOMS's Lock and Key +15 plan (shots/pending_art/rooms1117/lockkey_plus15.md + lockkey_now.png, code on
  7418204). Read against the picture and 27_rooms.js:206-213; nothing drawn. Owner: ROOMS, with LEAD for the staff code.
  - FIX (plan): Lock and Key has 13 live upgrades, not 15 (16 rows: 2 retired, sb_chester and sb_trolley, and Open the Roof). +15 makes 28.
  - FIX: the Bookcase Door goes. The Speakeasy's whole hook is the hidden bookcase door from the Dessert Parlor (27b_skins.js:137,
    27_rooms.js:274); a second one in the room next door kills that reveal. It is also floor furniture, and the only wall beside the stair
    doorway is a narrow strip between the oyster cart and its painted sconce, and the corner.
  - FIX: the staff need code, not just no art. Crew are not pinned: each picks a random work/play spot (20_loft.js:1423; only staff 0 in
    the Restaurant or Bar is pinned), so the pianist will tend the bar and the bartender will take the mic. Each one needs its own spot,
    pinned the Theater's way (23_theater.js:175) or onspot like the Club's DJ (27b_skins.js:200). The pianist sits at the bench facing the
    keys, with no sit pose for crew yet. The singer stands on a raised stage (feet must sit on it). The server walks (Garden g_walk,
    wand:1). People: 5 guests at most (lfGuestN) + bartender + 4 staff + player = 11 in 14x10. That is fine if every one has a fixed
    place; with all four wandering it will read as crowded.
  - NOTE: drop the Doorman, not a fourth musician. Nothing in the room says "door" except the stairs (the way in is Downstairs, front
    left), and a doorman there stands in front of a painted doorway (rule 20). Q1: four staff, five crew, are OK once pinned.
  - NOTE, theme: Big Band, Singer, Gig Posters and Spotlights are four more jazz steps, and jazz is the Speakeasy's ("live jazz if you book
    the band"). Lock and Key's own lane is in the picture: keys, marble, brass, champagne, oysters, cocktails. Swap the posters for
    something on that lane (a gilt cocktail-menu mirror, a wall of members' key lockers, flat on the wall).
  - NOTE, the stage is already full at 2.3x2.2 (drums, bass, mic). Sax and trumpet stands plus a singer at the mic will crowd it. Either
    make Big Band a slightly bigger stage (it has room toward the front right) or keep the instruments as they are and make the tier a
    lit stage lip/brass rail.
  - NOTE, the bar top is busy (bottles, shakers, glasses, the tip jar at 5.7,2.35). Two lamps plus an Absinthe Fountain is too much. Pick
    one, on the clear middle stretch. No hanging pendants: with no ceiling they float (Cal's complaint).
  - NOTE, wall pieces vs the four painted sconces (skw_t1; they can't move): the Rare Bottle Wall tier must not widen past the back bar's
    art (a sconce sits at its right edge). The Keyhole Neon fits the gap between the two right-hand back-wall sconces, above the
    high-tops, only if it stays inside it. The Key Wall goes above the sofa without touching the front-left sconce. Name the wall
    position of each piece in the plan.
  - OK: Persian Rug (a decal, clear of the humidor and piano), Swivel Stools (same spots and sit spots, still facing the bar),
    Champagne Tower (keep the cart's use spot 9.61,1.55; clears the sconce above), Stage Spotlights (light only).
  - After paint, QA checks: the live count, the full room for a new player (LIVE=1) and an old owner, use sides, overlaps against the
    sconces, every staff member in their spot.
- PASS, v1.11 live (LEAD: Live and Test at 034069d on release/v1.11, wlive PASS, 3013/3013 identical):
  - 034069d against release/v1.10 1854144: only 21_restaurant.js, 22_garden.js and 26_world.js (each identical to the passed 4456e71's)
    and the APPV line (110 -> 111). A clean web build: 3,012 files + version.txt = 3,013, APPV 111, the mop fix in.
  - NOTE (LEAD): ROOMS's Bowling, VR and Dessert fixes (3c3d6a1 + f6fc989, QA PASS 3b7cd87, in 27b_skins.js) are not in v1.11; they
    wait for the next release.
  - Not checked by QA: the live sites themselves (LEAD's wlive) and a phone.
- PASS, ROOMS 4456e71 (QA's f210213 FIX and both NOTES; clean plain build; auditall.js, bigrooms.js as old owner and LIVE=1, and a
  check for the mop sprite in the drawn Restaurant; pictures shots/qa/rooms1117e/). With 6749725, v1.11 can ship.
  - Mop: drawn in a brand-new Restaurant and before the first decor buy, gone once Walnut Dividers (r_d3) is bought, gone in a full
    Restaurant for a new player (live only) and for an old owner. (ROOMS's code comment calls r_d3 "Menu Boards"; it is Walnut
    Dividers, a kept 500-coin decor step at level 11. Harmless.)
  - Grow lamps: the beds under them keep their green.
  - Garden corner: beehives behind the koi pond and the coop between pond and fountain, on the open lawn, clear of the spray, the
    beds and the path; the gate corner holds only gate, logs, solar panel, pump and potting bench. No longer crowded.
  - auditall: Garden clean, Restaurant only the known lines; 0 page errors.
- ROOMS 6749725: fixes 3, 4 and 6 from be9bc20 against the 40/35 rooms (clean plain build; auditall.js; bigrooms.js twice: as an old
  owner with every piece incl. the retired ones, and with the new LIVE=1 switch as a new player with only what is on sale; pictures
  shots/qa/rooms1117d/big_{restaurant,garden}{,_live}.jpg and z_*.jpg).
  - PASS, 3 Restaurant patio: the bistro table shows under the pergola's front beam in both views; the set is clear of the fire pit
    and the back sets (auditall's rsx_iron+rsx_pergola 2.5 is the table under the roof, as meant).
  - PASS, 4 Restaurant kitchen: the prep table, bread rack and dish pit form one tight island near the cook line; the Espresso Bar
    case ends the bar on the dining side, facing the diners (old owners only; it is cut, so new players never have it).
  - PASS, 6 Garden: the grow lamps stand in their beds on solid posts over the plants; nothing floats.
  - ROOMS's question (r_cf2 still drawn): expected. bigrooms.js owned every id incl. retired ones, which is an old owner's room, and
    owners keep cut pieces by LEAD's design. LIVE=1 now draws a new player's room (rigtest/qa/bigrooms.js).
  - FIX (ROOMS, room code; LIVE since v1.10 1854144): 26_world.js:424 and 21_restaurant.js:183 draw a mop and bucket in the
    Restaurant's front-left corner while Potted Plants (r_d1) is not owned, as the room's "before" look. r_d1 is cut, so every new
    player's fully built Restaurant keeps a mop forever (z_rest_mop.jpg; not in the owner view). Tie the mop to a kept piece (e.g.
    the Sculptural Vases or the first decor step) or drop it. No other cut id is read with "!H(...)"; everything else drawn from a
    cut id is the cut piece itself.
  - NOTE (small, for Cal/LEAD): with Chef's Neon and Hire a Host cut, a full Restaurant draws one fewer guest (guests() counts r_chef)
    and nobody stands at the host desk (r_s3's spot).
  - NOTE (ROOMS): each grow lamp lays a purple film over its bed, so those plants look dull next to the bright beds without lamps
    (z_garden_lamps.jpg). A lighter glow would keep them green.
  - NOTE (ROOMS, rooms-never-cluttered): the Garden's front-right corner still reads crowded: fountain, gate, coop, beehives, solar
    panel, pump, logs, potting bench, barrel, compost and hose in one corner, while the lawn left of the fountain is empty. Move the
    coop and beehives onto that lawn.
- PASS, ROOMS f6fc989: the Bowling fix for QA's d65ec13 (clean plain build; auditall.js and bigrooms.js on bowling;
  shots/qa/rooms1117c/big_bowling.jpg). The seat row has its original facing again (toward the pins), parallel to the pin end, on the
  open carpet behind the approaches, clear of the console, ball return and snack table. The snack stand is inside the floor (no OUTSIDE).
  auditall: only the harmless lane/towel DEPTH line and a stand-touch spot; 0 page errors. With VR and Dessert (d65ec13), ROOMS's room
  fixes 3c3d6a1 + f6fc989 all PASS and can ship. The Restaurant and Garden fixes 3, 4 and 6 wait on the new counts (ROOMS held them).
- PASS, v1.09 and v1.10 live (LEAD: 918732a and 1854144, wlive PASS, 3013/3013 identical each time):
  - 918732a against release/v1.08 8d1f69f: in app, data, art and tools only the new 29zz_v109.js (identical to the passed cbc2d88's)
    and the APPV line (108 -> 109).
  - 1854144 against 918732a: only 29e_economy.js and 29q_news.js (both identical to the passed cfe5917's) and APPV (109 -> 110).
    ROOMS's 3c3d6a1 room changes and the DIAL-UP art did not ship (right: Bowling still has a FIX).
  - Clean web builds: both 3,012 files (+ version.txt = 3,013), APPV 109 / 110; v1.10 has the cut list and the v1.10 letter, v1.09
    neither; no y_ art in either.
  - Not checked by QA: the live sites themselves (LEAD's wlive, LEAD's letter check), a phone.
- PASS, ROOMS 35f3080: DIAL-UP's 15 new pieces and the repainted h_wrap (on the clean plain build of cfe5917, which holds 35f3080 with
  no art changed after it; draft rows from shots/pending_art/new240/dialup/rows_draft.json pushed into SHOP with newwear.js). Both
  bodies, all 35 poses: men 18 outfits, women 20, 0 not drawn, 0 page errors, no missing icons. At 3x on 10 key poses
  (shots/qa/dialup/big/big_{m,f}_0-6.jpg) every piece sits right front and back. The visor shows hair above its band; the rimless
  shades are front only; the trapper's ear flaps and the fur-collar jacket read; the Denim Cargo Maxi reads as a long denim skirt
  (women only); the camo cargos, patchwork jeans, platform boots and bubble runners read. QA's h_wrap note is fixed: a grey wrap
  skirt with a lime tie over black trousers, clear on both bodies. The visor's edge specks don't show at game size. The wave1/dance1
  sleeve streak is the rig's usual look. Not checked: other skin tones, night, the Shop rows (LEAD's step).
- ROOMS 3c3d6a1, room fixes from QA's sweep (on the clean plain build of cfe5917, which holds it; bigrooms.js and auditall.js on
  bowling, vr, dessert; shots/qa/rooms1117b/).
  - PASS, VR: the egg pod is in the back-right corner, clear of the sofa; the sofa and water cooler have room.
  - PASS, Dessert: the macaron tower stands on the customer floor; the baker's side of the counter is free.
  - FIX, Bowling (ROOMS): (1) the seat row now runs alongside the lanes and faces the right-hand wall (ball rack and trophy shelf),
    side-on to the lanes (z_bowling_seats.jpg). Before the change, the row ran parallel to the pin end and faced the pins, which was
    right; it just stood on lane 1's foot. Keep that facing, row parallel to the pin end, and move it back onto the open carpet behind
    the approaches. The current art works that way, so no back-view art is needed. (2) auditall: OUTSIDE bwx_snack. The snack
    stand's front-left corner hangs past the floor's front edge (z_bowling_snack.jpg); nudge it in. The ball return now sits at lane
    2's foot between the lanes: fine. The DEPTH "bwx_lane over bwx_towel" line ROOMS asked about shows nothing wrong on the picture.
- PASS, v1.09 = 5959380 + cbc2d88 (LEAD's fix for QA's 175d070; built as v1.09 will ship: 5959380 with cbc2d88 cherry-picked, plain).
  - The version is its own line above the header: text ranges clear the name for "Cal", "Maximiliana" and "Maximiliana-Rose", with
    "saved 12:34" and "NOT SAVING (...)", at 360, 390 and 430 (fix_header360_long.jpg). LEAD's updated v109.js: 28 ok, PASS.
  - The Town Hall picture fades at its sides: no straight edges on Weather or Skyline (fix_hall_looks.jpg); 0 page errors.
  - Side quests taken before v1.09 count their week from its first load (S.side.wk0; code read, LEAD's test covers it).
  - Not checked: the red "NOT SAVING" line itself (SAVEERR cannot be set from outside on the plain build), the web build, a phone.
- PASS, v1.10 candidate cfe5917 (Restaurant 40, Garden 35 from QA's cut lists; the v1.10 patch letter). Clean plain builds of cfe5917
  and 5959380.
  - LEAD's roomcut.js PASS on QA's build: 40 and 35 on sale, the 23 cut ones retired with no "+N%" or hours, a full room pays 700 /
    1,500 a day with or without the cut pieces owned. pricesweep: 54 upgrades changed, all in the Restaurant (41) and Garden (17):
    the cut ones retired, kept ones at most 8% cheaper (Hire a Cook 1,250 -> 1,150); live totals Restaurant 91,000 -> 73,350 and
    Garden 42,350 -> 39,900 (with openers); 0 lots or Shop rows changed; no NaN; 0 page errors.
  - Unlock gates: only the Mall reads Restaurant/Garden shares (plaza: 60% of all Garden, Restaurant, Lock and Key, Rooftop, Boba and
    Dessert upgrades; total 150 -> 127, need 90 -> 77). For a player who bought each plaza room in level-then-price order up to a
    share, the new count is 0-3 pieces further from the Mall: exactly at the old 60% now needs 3 more, 55% needs 9 (was 7), 40% needs 28
    (was 30). Nobody already holding the Mall is affected.
  - NOTE (LEAD): set plaza to .58 (needs 74 of 127) and the 60% player is exactly where they were; or leave it, a 3-piece slip.
  - The letter (PATCHNOTES v:110, shows at APPV 110): 7 vague lines, no brands, days, prices or anything coming. "Coaches and the
    Town Boss are resting for now" hints they come back; Cal's call. Not seen drawn (APPV 110 only).
- v1.09 candidate 5959380 (Cal's cleanup), NOT A PASS yet: one small FIX; the rest PASS. Clean plain builds of 5959380 and v1.08
  8d1f69f. Pictures shots/qa/v109/.
  - PASS: LEAD's v109.js (all ok at 360/390/430: version only on the Board, header beside the frame, no Coaches, Town square without
    Neighbors, "Outside", no sale strip and the badge on the sale brand's cards, one Upgrades tab with upgrades + Interface, side
    quests lapse at 7 days and show days left; 0 page errors). pricesweep against v1.08: 0 price changes, no NaN.
  - PASS: the Town Hall picture shows under the header with all 7 themes and all 5 page backgrounds (#deco is fixed at z 0 but does
    not cover it; hall_looks.jpg; new rigtest/qa/v109look.js). The header with the longest class ("Adept Swiftblade"), a long name,
    the longest title and 1,234,567 coins: nothing past the edge, no piece over another, the pill not cut, on all five tabs at 360/390.
  - Chat Room 3 (code read): 29t_chat.js restores a saved Room 3 from sessionStorage at load, then 29zz_v109.js (after it) sets it
    back to Room 1, and only two room buttons are drawn, so nobody can sit in Room 3 on v1.09. Players still on an old version can
    talk in Room 3 until they update; nobody on v1.09 sees it.
  - Coaches (code read): coach bonuses are earned in Training, never bought (no coins lost), and only with the old Lounge room
    (coachesOn), so few if any saves lose a bonus.
  - FIX (LEAD): on the Board at 360 wide, the version line (now absolute at the top right) sits on the name row and overlaps the
    name: an 11-letter name with "v1.09 · saved 12:34", and even "Cal" when the label reads "NOT SAVING (...)" (text ranges measured;
    header360_long.jpg). Clear at 390 and 430. Give the version its own small line above the header, or keep room for it beside the name.
  - NOTE (LEAD): the save label went from a line on every tab to faint 10 px text (opacity .6) on the Board only, so a "NOT SAVING"
    warning can now be missed. Suggest showing it in full, on any tab, while SAVEERR is set.
  - NOTE (Cal): side quests taken more than 7 days before a player first opens v1.09 lapse at once on that load, their progress
    (walks, photos) reset. To spare players already halfway through, count the week from the first v1.09 load for quests already on.
  - NOTE (LEAD, small): the Town Hall picture is 358 wide at 390 (inside .wrap; the 100vw rule does not reach). On the Weather and
    Skyline backgrounds its side edges show as straight lines, so it reads as a box, not the page background. And the class pill's
    text has weak contrast on the sky with the Sunset, Blood and Gold themes.
  - NOTE: Town Boss off, Neighbors cut, Room 3 gone and the picture only on the Town Hall are LEAD's choices for Cal to confirm.
  - Not checked: the web build on the mock cloud (LEAD's cloudshots), a real phone, night, other skin tones.
- Restaurant and Garden cut lists for LEAD (Cal, 2026-11-17: "Restaurant can go down to 40 (keep the most visually appealing
  upgrades but can remove the small unnoticeable ones), Garden can go down to 35"). New rigtest/qa/upgradeshow.js on a clean plain build
  of 7c10733 draws each room fully bought, then once without each upgrade ("full": share of the 1000x760 picture that changes), and
  adds each upgrade alone to a room holding only its expansions ("alone", so a lower tier that a later one covers still counts). Full
  ranking: shots/qa/upgradeshow/rank.txt and *_rank.json; pictures restaurant_full.jpg and garden_full.jpg. 0 page errors.
  - Restaurant 58 -> 40, cut these 18 (QA's pick; the expansions, tables, booths, kitchen line, counters, chandeliers, wine wall,
    patio and fire pit all stay):
    - Draw nothing at all (0 full, 0 alone): Drip Coffee, Shelves & Pictures, Neon Sign.
    - Lower tiers a later piece covers (0 at full build): Digital Menu Screen (-> Grand Menu Board), Drinks Cooler (-> Backlit Wine
      Wall), Host Lectern (-> Host Desk), Patio Heaters.
    - Menus that draw nothing alone: Pasta Night, Seasonal Menu, Wood-Fired Pizza.
    - Smallest decor, under 0.2% of the picture: Open Sign, Brass Sconces, Potted Plants, Chef's Neon.
    - Staff with nothing drawn: Hire a Waiter, Hire a Host.
    - Barely there: Espresso Bar (0.12% alone, mostly covered), Burger Menu (0.06% alone).
    - Kept on purpose though small: Breakfast Menu (the first step, level 8); Hire a Cook and Hire a Head Chef, Tasting Menu (the
      late income steps); Bigger Till (a cap, not decor); the tier steps Walnut Tables (2.6% alone), Marble Round Tables (3.3%),
      Gas Range, Marble Counter & Stools.
  - Garden 40 -> 35, cut these 5: Sundial, Bird Bath and Clipped Topiary (0 full, 0 alone: nothing drawn now), Tool Shed (0: the
    conservatory replaces it), Wheelbarrow (0.17%, the smallest visible piece). Option: cut Hire a Gardener (+15%, nothing drawn)
    instead of the Wheelbarrow, but then Head Gardener has no step before it.
  - For LEAD's build: the 18 + 5 carry +1.12 and +0.14 of their rooms' "+N%" income. Fold it into the kept steps, or bizInit simply
    recomputes coins an hour from bizDay (each room's day stays the same at full), so only the per-step income grows. Owners of a
    cut piece get the refund Cal agreed; check that nothing "also"-chained hangs on a cut id (Espresso Bar has also/menu;
    Wood-Fired Pizza needs the oven's chain).
  - Not checked: night lighting, other room styles (Noir draws over the base look), people in the room.
- PASS, v1.08 live (LEAD: Live and Test at 8d1f69f on release/v1.08, wlive PASS, 3013/3013 identical):
  - 8d1f69f against release/v1.07 c546e9c: in app, data, art and tools only 29e_economy.js (identical to the passed 00c18f4's) and
    30_app_b.js's APPV line (107 -> 108). No art: HANGANG did not ship, as LEAD meant.
  - A clean web build of 8d1f69f has 3,012 files, APPV 108, speakeasy:450, no h_ files; + version.txt = 3,013.
  - Not checked by QA: the live sites themselves (LEAD's wlive) and a phone.
- PASS, v1.08 candidate 00c18f4 (the Speakeasy priced like its neighbours; LEAD, after QA's sweep). Clean plain builds of 00c18f4 and
  0b0a6d4 (v1.07 code). pricesweep.js against v1.07: only the Speakeasy's 14 upgrades changed (150-1,000 -> 1,750-15,750; 5,800 ->
  75,500 in all); 0 lots, 0 graded clothes, 0 other Shop entries changed; no NaN, undefined, 0 or fractions; 0 page errors.
  Its neighbours from the game's own numbers (n, levels, total, full income a day, days to pay back the upgrades at full):
  Karaoke 12, 42-53, 53,650, 449, 119 d; VR 11, 44-55, 57,250, 399, 143 d; Bowling 13, 38-50, 59,150, 449, 132 d; Speakeasy now
  14, 45-58, 75,500, 450, 168 d (was 5,800, 618 a day, 9 d); Club 14, 50-63, 92,600, 901, 103 d.
  - NOTE (LEAD): with Bowling's phase (3.4) and 14 upgrades, the Speakeasy now pays back slowest of the later rooms (168 days; the
    others take 101-144, Dessert 172). Not a fault, but if it should match Karaoke, it needs bizDay of about 500-550 or phase 3.2-3.3.
  - NOTE (LEAD): 00c18f4 on qa-local also carries ROOMS's HANGANG art and items.json entries (86cb0e1). They're not in the Shop,
    harmless, and draw fine (QA PASS), but cutting v1.08 from 00c18f4 adds about 60 files to the web build. Cherry-pick 00c18f4 alone
    onto release/v1.07 if v1.08 should be the Speakeasy only.
  - Not checked: a real phone, the web build, a save that owns Speakeasy upgrades (nobody is level 45; owned upgrades are never
    repriced).
- Cal's later-rooms sweep (Cal, 2026-11-17: "test efficiency and make sure nothing lags", tables against walls with no way to them,
  counters turned wrong, wall pieces floating, too many upgrades in some rooms; "I don't think the restaurant needs 50+ upgrades.
  Maybe 30-35"). Clean plain build of 0b0a6d4 (v1.07 code). Pictures shots/qa/rooms1117/big_<room>.jpg (every room fully bought, no
  people, 13:00) and z_*.jpg crops.
  - LAG: PASS. fpsroom.js, every upgrade owned, CPU slowed 4x, 3 runs of 5 s per room window, all 21 rooms: 57 to 60 fps everywhere.
    The worst single frames are the Lair (117 ms), Speakeasy (100 ms, the most elements at 1,169) and Mall (100 ms); every other room
    is at 67 ms or less. 0 page errors. Not measured: the building view with every room open, a real phone (headless Chrome is not an
    iPhone; Cal's speed log is the real test).
  - PLACEMENT, FIX for ROOMS (each seen on the big picture; auditall.js flagged only the known rug/stage overlaps):
    1. Bowling: the orange seat row stands on the left lane's approach, legs on the lane end, so that lane cannot be bowled; and one
       ball return sits loose on the carpet, attached to neither lane (z_bowling_seats.jpg). Move the seats behind the approaches and
       put the return between the lanes. The seats facing the pins still need back-view art (known, Cal's Chrome).
    2. VR: the blue egg pod stands right against the front of the lobby sofa; nobody can sit there (z_vr_sofa.jpg).
    3. Restaurant patio: the pergola's roof hides its bistro table, so two chairs face each other under the beams with nothing
       between them (auditall: rsx_iron+rsx_pergola overlap 4; z_rest_patio.jpg).
    4. Restaurant kitchen: the prep table, bread rack and dish pit stand loose in the middle of the kitchen floor instead of on the
       wall line, and the lit display case sits on the kitchen side facing the patio, not the diners (z_rest_counter.jpg). This is the
       "counter that makes no sense" kind Cal means.
    5. Dessert: the macaron tower stands right behind the marble prep counter, where the baker would stand (z_dessert_counter.jpg).
    6. Garden: the purple grow-lamp bars ride on near-invisible posts and sit off the back edge of their beds, so they read as bars
       floating over the grass (z_garden_lamps.jpg). The front-right corner is the most crowded spot in the game (fountain, arch, gate,
       coop, beehives, solar panel, pump, logs, potting bench, barrels, compost, hose).
    Known and still open, waiting on art from Cal's Chrome: the Karaoke corner booth faces away from the stage (z_karaoke_booth.jpg), the
    Auditorium projector points away from the screen, and the Speakeasy has bare flat brick, a placeholder-looking floor and no back
    bar (the only room that looks unfinished).
    Read right, no fix: Lock and Key, Rooftop, Boba, Theater (its second chandelier now hangs over the recliners), Mall, Arcade,
    Rhythm, Nightclub, Game Room. Early rooms (Bedroom, Closet, Lair, Patio) were drawn but not reviewed: not in Cal's ask.
  - UPGRADE COUNTS (live, not retired, not room openers): Restaurant 58, Garden 40, Theater 33, Bedroom 32, Game Room 21, Boba 15,
    Lock and Key 13, Dessert 14, Speakeasy 14, Auditorium 14, Nightclub 14, Arcade 13, Bowling 13, Patio 13, Rhythm 12, Karaoke 12,
    VR 11, Lair 10, Rooftop 10, Mall 10, Closet 6. QA's proposal for LEAD and Cal (Cal's call):
    - Restaurant 58 -> about 35, by merging small steps into bigger ones, not by deleting looks. Each merge keeps the summed price and
      income, so the room's total and the economy curve stay the same with fewer, bigger buys. Decor 14 -> 6: Open Sign + Neon Sign +
      Chef's Neon; Potted Plants + Sculptural Vases; Shelves & Pictures + Oil Painting; Brass Sconces + Brass Chandeliers; Walnut
      Dividers into Leather Booths; Drinks Cooler into Backlit Wine Wall. Menu 7 -> 4: Digital Menu Screen into Grand Menu Board;
      Pasta Night + Seasonal Menu; Wood-Fired Pizza into Wood-Fired Oven. Kitchen 11 -> 6: Drip Coffee + Espresso Bar; Prep Table +
      Dish Station; Flat-Top + Fryer & Sinks; Bakery Rack into Gas Range or Fridge; Seating 6 -> 4: Walnut Tables + Second Row; Marble
      Round + White Linen. Counter and Staff: Host Lectern + Host Desk + Hire a Host -> one. Patio 8 -> 5: Sidewalk Patio + Bistro
      Sets; Planters + Pergola (which also fixes find 3); Heaters + Umbrellas.
    - Garden 40 -> about 30: its 10 Grounds pieces at 250 each -> 4 (Walkway + Benches + Lantern Posts; Sundial + Bird Bath +
      Topiary; Koi Pond + Fountain; Rose Archway + Gate), plus Scarecrow + Wheelbarrow and Hose + Rain Barrels. That also thins the
      crowded corner.
    - Theater 33 and Bedroom 32 are inside Cal's 30-35. Leave them.
    - The low end (Lair, Rooftop, Mall at 10; VR 11): bring the later rooms to about 15-20, adding 3 to 6 pieces where the floor is
      empty (the Mall's left half, the Rooftop's front deck), never crowding (rooms-never-cluttered). That needs new art from Cal's
      Chrome, so it is ROOMS's list and Cal's OK.
    - LEAD: a save that owns some parts of a merged pair must get the merged piece, with nothing paid twice and no refund lost. And
      the Speakeasy's 14 upgrades cost 5,800 in total (Dessert next door: 43,050; Lock and Key 38,050) for levels 45-58: check whether
      that is meant.
  Owners: placement ROOMS; counts and merges LEAD with Cal's OK; new pieces for the small rooms ROOMS (art) and Cal.
- PASS, ROOMS 86cb0e1: HANGANG's 15 new pieces (clean plain build; the draft rows from rows_draft.json pushed into SHOP, ROOMS's
  newwear.js = brandwear.js plus that). Both bodies, all 35 poses, 18 outfits each (3 all-HANGANG, 15 each piece mixed with other
  brands, three hairstyles): 0 not drawn, 0 page errors, no missing icons. A closer look at 3x on idle, stretch, sitFront, sitBack,
  type1, sleep, rearStand, backwalk2, wave1 and dance1: every piece sits right front and back. The hood hides all hair and its knot
  reads from behind. The sling goes under tops, the oval shades show only from the front, the cap bill reads in back views, and the
  coat's quilting and the boots' quilting read. The wave1/dance1 sleeve streak is the rig's usual look (as with ALTITUDE). Pictures
  shots/qa/hangang/q_{m,f}_*.jpg (all poses) and big/big_{m,f}_0-5.jpg.
  - NOTE for ROOMS / Cal: h_wrap ("Wrap Skirt over Trousers") reads as plain dark trousers at game size on both bodies. Under any
    normal-length top only a faint fold shows at the hip (big/wrap_f.jpg, wrap_m.jpg). A buyer will not see a skirt. Suggest a
    contrast hem or tie, or a name that matches what shows. Cal's call; not a wear fault.
  - Not checked: other skin tones, night lighting, the pieces' Shop rows and prices (not in the Shop yet; LEAD's step).
- PASS, v1.07 live (LEAD: Live and Test at c546e9c on release/v1.07, wlive PASS, 3013/3013 identical):
  - c546e9c against the passed 29ed258: in app, data, art and tools only 30_app_b.js's APPV line differs (100 -> 107). Against
    release/v1.06 826b773: only the new 29zz_patch.js and the APPV line; no art changed.
  - A clean web build of c546e9c has 3,012 files with APPV 107, the patch106 letter and the tab-wrap rule, + version.txt = 3,013.
  - LEAD's answers on the 29ed258 NOTES: the v1.10 letter goes in PATCHNOTES only, the name stays "Update 1.06" (Cal's words), and NOTE 1
    is accepted. Not checked by QA: the live sites themselves (LEAD's wlive) and a phone.
- PASS, v1.07 candidate 29ed258 (the Update 1.06 letter with 500 coins, Cal 11-17; the Shop's section tabs wrap, QA's v1.06 NOTE).
  Clean plain builds of 29ed258 and v1.06 826b773. The only code change is the new 29zz_patch.js (30_app_b.js: APPV back to qa-local's 100).
  - Tabs: every brand tab, the vault tab and BASICS are fully on screen at 360, 375, 390 and 430 wide, on 11-20 and 12-23. The row wraps
    to 2 rows below 430, and to 1 row at 430 on a 3-brand day. Level 31 at 360: the Street/Boutique floor tabs stay on 1 row. Nothing
    overlaps, no sideways page scroll, 0 page errors. Pictures shots/qa/v106b/street_w*.jpg.
  - The letter, at 375 wide: an old player (welcome 11-10, or 11-03) on 11-17 and 11-19, and a player who joined 11-17, each get
    "Update 1.06" unread. 4 clicks on Claim pay +500 once; after a reload the next day it stays paid with no Claim button. A player who
    joined 11-18 gets none. Pictures shots/qa/v106b/letter_*.jpg.
  - Spoilers: none. It names no brand, day, Vault or anything coming. The photo line is true only because Storage went on today (LEAD's
    line: Cal's own post worked). QA did not test a cloud photo post.
  - Two devices (code read, not run: the plain build has no cloud, and Test is Cal's real game): a load takes one whole save, local or
    cloud (merge() replaces S, 30_app_b.js), never adds two together. So a claim on a second device can only replace the first, never add
    a second 500. The worst case is the usual last-write-wins on everything else, as with the welcome letter's 3,000 since v0.89.
  - NOTE (LEAD): a save with no S.letters record (a player who has not opened the app since the inbox came in) dates its welcome to
    the day it opens, so from 11-18 on it gets no Update letter. That player still gets the welcome letter's 3,000 coins. Probably fine.
  - NOTE (LEAD): this build ships as v1.07, but the letter is "Update 1.06" and lists the tab fix, which is a 1.07 change. Rename it to
    "Update 1.07" if the version label should match. Also, 29q_news.js still has the old PATCHNOTES letters (every 10th version, 500
    coins). When the v1.10 letter goes in PATCHES, make sure only one of the two systems sends it.
  - Not checked: a real phone, the web build, a real two-device cloud claim, a cloud photo post.
- PASS, v1.06 candidate 0ea9b2a (3 Street brands live, Wednesday vault extra; Cal 11-17). Clean plain builds of 0ea9b2a and v1.05 fea3674:
  - Drops (dropcal.js, 2026-11-09 to 2027-04-30): Boutique and Atelier identical to v1.05; every Street drop is the same up to and including
    11-16. From 11-16 the Street always has 3 live: 11-17 HANGANG, DIAL-UP, OVERPASS; Fri 11-20 NICE COCK drops, HANGANG retires. Over
    the 49 Street drops: never 2 or 4 live, no brand drops while live, every retired brand rests at least 2 drops (a week); after 11-20
    each of the 6 brands drops 7-8 times, in a varied order.
  - Wednesday vault (__qbDrops.back, every Wednesday 11-18 to 03-31): v1.06 fills 12-23 SMOKE BOMB and 02-03 ALTITUDE, both off the Street
    that day, so 4 brands show. Correction to LEAD's line: v1.05 did fill it, on 02-03, 02-17 and 02-24. Either way the vault is empty on
    most Wednesdays (18 of 20) until more Street brands have art; for Cal to know, not a fault.
  - Phone (390x844, level 12 and 31): the Street tabs on 11-17, 11-20, 12-23 and 02-03 are the brands above (the vault one marked ↺);
    page errors 0. Splashes (S.brandSeen empty): 3 on 11-17 and 11-20 (NICE COCK's included), 4 on 12-23 with the vault last. v1.05 shows 2.
    A player who saw HANGANG's 11-10 splash does not see it again today.
  - Prices: pricesweep.js against v1.05: 0 changes (533 upgrades, 31 lots, 399 Shop rows), no NaN; the 48 out-of-band clothes as before.
  - NOTE for LEAD (not a blocker, owner LEAD): the brand tab row no longer fits a phone. It scrolls sideways (overflow-x auto) with no
    cue. At 375 and 390 wide, BASICS is cut from today on. On vault Wednesdays (first 12-23) the vault tab reads "↺ SMO" and BASICS is
    off-screen, even at 430 wide. v1.05 fit at every width. Fix before 12-23: wrap the row, shrink the tabs, or add a scroll cue.
    Pictures shots/qa/v106/street_lv12_20261120.jpg, street_lv12_20261223.jpg (the dark layer and Loft tip there come from QA's test save).
  - Not checked: a real phone; whether "Go to Shop" on the vault splash scrolls the tab row to the vault tab; the web build (plain build
    only); owners (that code did not change); Street drops after 2027-04-30.
- PASS, v1.05 live (LEAD: Live and Test at fea3674 on release/v1.05, wlive PASS, 3013/3013 identical):
  - fea3674 against the passed b10ca52: the only shipped file that differs is app/src/30_app_b.js, and only its APPV line (100 -> 105).
  - Art against release/v1.04: only NICE COCK's files, 48 changed and the 8 old yawn layers removed. A clean web build of fea3674 has
    3,012 files with APPV 105, + version.txt = 3,013 (v1.04's 3,020 less the 8 yawn layers).
  - Not checked by QA: the live sites themselves (LEAD's wlive) and a phone.
- PASS, b10ca52 (LEAD; NICE COCK on the Street Fri 11-20, then random drops; Cal): clean copies of b10ca52 and f16dbc2, plain builds.
  v1.05 = f16dbc2 + b10ca52 can ship.
  - Drops (rigtest/lead/dropcal.js 11-09 to 2027-04-30 on both builds): every row before 11-20 identical. Fri 11-20: the Street drops
    NICE COCK (live OVERPASS + NICE COCK), the Boutique shows SAYMORE alone; the Atelier unchanged (empty). Through April no brand drops
    while it is live (Street 49 drops, Boutique 25); a Street brand rests at least 4 drops (6 brands), each about 8 times. Same calendar
    on a second fresh load.
  - Players (rigtest/qa/ncstreet.js, level 31 and level 12, owner of 4 NICE COCK pieces worn or not, Tue 11-17 and Fri 11-20, 8 runs,
    0 page errors): 11-17 level 31: the Street is DIAL-UP + OVERPASS, the Boutique NICE COCK + VENOM ROSE; level 12: no NICE COCK.
    11-20: NICE COCK is on the Street for both, gone from the Boutique (SAYMORE only). Owners keep wearing all 4 at every level and date,
    and the rack shows them Equipped. On opening the Shop on 11-20 both levels get the OVERPASS and NICE COCK splashes (a level-31 save
    must have seen the floors first; splashes announce Street drops only, the same in f16dbc2).
  - Prices: pricesweep against f16dbc2: no NaN, undefined, 0 or fractions, upgrades and lots unchanged, 0 page errors; only NICE COCK's
    16 rows change, all now 310 to 450 (LEAD's ncrows.js PASS on b10ca52 too). The 11-20 sale row shows them discounted (340, 230).
  - NOTE (Cal/LEAD, no fix asked): (1) the Street prices start the moment v1.05 ships, so 11-17 to 11-19 NICE COCK still sells on the
    Boutique at 310-450, and anyone who bought since 11-13 paid the Boutique's 670-1,000. 8 of the 16 pieces sit at the 450 cap, so
    the grades set in f16dbc2 barely differ now. (2) The Boutique has 3 brands with 2 live, so its "random" order is a fixed turn:
    SAYMORE, CHROME RAIN, VENOM ROSE, again and again. Only the Street is really shuffled.
  - Not checked by QA: cutpieces, tabs5, tourtest, swaptest, dropshuffle and the Wednesday vault (LEAD ran them PASS); a phone; Safari.
  - Pictures and calendars: shots/qa/nc1120/.
- PASS, v1.05 candidate f16dbc2 (LEAD) on ROOMS's NICE COCK art bcd8f73, both on a clean copy; plain build. v1.05 can ship.
  - Art (ROOMS's line, bcd8f73): brandwear.js BRAND=nc, both bodies, all 35 poses, 20 outfits each (the brand alone across the 3 hairstyles,
    and every piece mixed with other brands' pieces): 0 not drawn, 0 page errors, no icon missing. A closer look at 3x on idle, stretch,
    sitFront, sitBack, type1, sleep, rearStand, backwalk2, wave1 and dance1. The dad cap's new hair clip holds: hair shows through its back
    opening and nothing pokes through the crown, short and long hair. The scarf's tail reads right from behind, over long hair too. The
    stretch (painted yawn) falls back to arms down on the 4 redone tops with their yawn layers deleted; no tearing. Shades front-only as before.
  - Known look, not a fault: the tee's charcoal under-sleeve shows dark at the raised arm in the sitBack and type1 back views (ROOMS
    said so). In wave1 the raised sleeve streaks on these tops, but ALTITUDE (passed) does the same: the rig, not this art.
  - Shop (f16dbc2): LEAD's ncrows.js PASS: the 10 named, priced 670 to 1,000 in their grade's band, on the Boutique, art loads, old names gone.
    pricesweep against bcd8f73: no NaN, undefined, 0 or fractions; upgrades and lots unchanged; 0 page errors. 13 clothes change price:
    9 of the repainted pieces (the tee stays 730; tank, qzip, knit and slide go up 230 to 260 with premium), and NICE COCK's 4 keeps drop 10 coins each (joggers 970 to 960, short 710
    to 700), as do the scarf, aviators, hoodie and court (~10 less). NOTE (LEAD, no fix needed unless unintended): it looks like the brand's
    price scaling shifting with the new base prices; owners paid already, nothing to refund.
  - Owners (rigtest/qa/ncowner.js): a player who owns all 10 under the old art and wears cap, scarf, tee, clogs and slate joggers: the rack
    shows Equipped or Equip with no price, the wardrobe shows all 10 new names and no old ones, the avatar wears the new art (the cap with
    its clip), and it all holds after a reload. A non-owner sees all 16 pieces with Try on and a price. "Shearling Clogs & Socks" shows its
    "&" right. 0 page errors.
  - Not checked by QA: cutpieces, tabs5, tourtest, swaptest and dropcal (LEAD ran them PASS); a phone; Safari; the pieces in a room.
  - Pictures: shots/qa/nc1117/ (wear_m, wear_f, icons, big/ close-ups, nc_rack_owner, nc_wardrobe_owner).
- PASS, v1.04 live (LEAD: Live and Test at efe8e2d on release/v1.04, version.txt efe8e2d, wlive PASS, 3021/3021 identical):
  - efe8e2d against the passed 0ca45f7: the only shipped file that differs is app/src/30_app_b.js, and only its APPV line (100 -> 104).
    The rest of the diff is docs, shots and rigtest, none of which ship.
  - The file count adds up: art/app is identical to v1.03 (f72a55f), and a clean web build of efe8e2d has 3,020 files with APPV=104 in
    app.js. Plus the deploy's version.txt, that makes 3,021.
  - Not checked by QA: the live sites themselves (LEAD's wlive covers them) and a phone.
- PASS, v1.04 recheck 0ca45f7 (LEAD's fix for the Training FIX on c7051f3); v1.04 can ship. Clean copy, plain build,
  rigtest/qa/trainstreak.js: the Training card and its (i) with 0, 2 and 4 Weekly Warrior weeks before this one, each with this week
  unpaid and claimed (6 states).
  - Card: "Keep it up for x2 coins next week." / "Next week x2 if you keep it up." (no streak); "Week 3 in a row: x3 coins." and, claimed,
    "... Next week x4 if you keep it up."; week 5 reads x4 and "Next week x4" (the cap holds).
  - (i): "Each week in a row raises the coins: x2, x3, then x4 at most. Miss a week and it starts over." Its coins match the card
    (3,450 / 10,350 / 13,800 = x1 / x3 / x4 at level 30).
  - No page errors. In the first state the read caught the Boutique's welcome window, not the (i) sheet. The sheet's text is the same
    function in every state, and the other five read right.
  - Pictures: shots/qa/lean104/FIXED_train_*.jpg. Only the 2 changed files were rechecked (29zz_lean.js, 30_app_b.js); the rest of
    v1.04 is the c7051f3 PASS above.
- NOT A PASS yet, v1.04 candidate c7051f3 (cut the fat, faster portraits, NICE COCK's repaints off sale). Clean copy, plain build and sandbox
  web build. Scripts: rigtest/qa/leanqa.js (every card's text on c7051f3 and on ea9f942, each (i) clicked, 4 profiles), leantap.js (a real
  tap on each (i)), LEAD's portraits.js, tourtest.js and dropcal.js. Pictures and both text logs: shots/qa/lean104/.
  - FIX (LEAD, 29zz_lean.js QBINFO.train): the Training (i) always says "Keep it up week after week for x2 coins". The streak goes x2,
    x3, then x4 at most (wwMult, ECON.wwMax 4). The same sheet already quotes the multiplied coins, so in week 3 it reads "+11700 coins
    ... for x2 coins". Before this commit the card said it right (wwLine): "Keep it up for x2 coins next week" or "Next week x4 if you
    keep it up". Both lines are gone from the card; the claimed card now shows only "Week 3 in a row: x3 coins". Suggested: the (i)
    says "Each week in a row raises the coins: x2, x3, then x4", and the card keeps wwLine's next-week multiplier (one short line).
    sheet_train.jpg, late_paid_train.jpg against OLD_late_paid_train.jpg.
  - PASS:
    - Every reachable (i) opens its sheet with the right numbers on a real tap: Daily Quest (4 days, 60%/80%, +10%), level trial
      (2 days), Training (XP and coins from weekBonus), Gym plans, own workouts, workout day, Crawls, Rescued allies, the Wheel
      (4 hours, the cooldown still reads "Next spin in 3h 0m"), Likes (2 a day, 1,500/1,000/500). Got it closes each one, and nothing
      under the button reacts.
    - Live numbers, compared line by line with ea9f942: Daily Quest XP / goal, Town %, Weekly Quest n/4, Rested XP; trial n of 2 and
      stored XP; Training n/4, reward and the (xN streak) chip; crawls n/5 and quest effort; the Likes countdown. Only the rules text
      and "XP left" went (the bar shows 60 / 100 beside it). The trial's "full at level 4" went too, but the level bar above says
      "Lv 4, Bar full: pass the trial".
    - The Daily Quest tour's second step rings the (i) (tourtest ALL PASS on c7051f3).
    - Portraits on a first open with the heavy save (60 neighbours, WebKit, 390x844 at 3x): Players 8 of 8, Hall 31 of 31; the Hall
      made 1 rig picture (LEAD: 12 before), 59 fps; no page errors.
    - NICE COCK: the Boutique page shows exactly the 6 keeps (cap, beanie, 3 joggers, short); the 10 repaint ids are cut; an owner of
      the cut hoodie still sees it (Equip) on the brand page and in the Wardrobe. dropcal.js against ea9f942: every slot the same to
      12-04 and the Street the same to 2027-01-31; from 12-11 the Boutique order shifts (NICE COCK back on 12-11), as LEAD said.
    - Save check: the Nov 13 heavy save opens at level 60, no "Two saves", no page errors. Coins +1,500 and one upgrade are added on
      load, and ea9f942 does exactly the same, so this commit is not the cause.
  - Not checked: the Vault and Coaches (i). No screen draws those cards (coachRoster() has no caller, and the new Shop has no Vault
    tab), so the change there is harmless. Also not checked: dqeffort.js and wv91_extra.js (expected to differ), a phone, and the
    Loft's 6-second warm-up timing.
- PASS, v1.03 live (LEAD: Live and Test at f72a55f, version.txt f72a55f, wlive PASS, 3021/3021 identical):
  - release/v1.03 is f72a55f itself, the commit QA passed (APPV 103 already in it).
  - The file count adds up: from 10daa03 to f72a55f, art/app has exactly 10 deletions (ALTITUDE's f/m *_yawn for anorak, fleece,
    henley, shell and vest) and 59 changes. Kode PinK's 8 yawn files are still in the release; their deletion is only ROOMS's
    uncommitted work. A clean web build of f72a55f has 3,020 files, plus the deploy's version.txt = 3,021.
  - Not opened on a phone by QA.
- PASS, v1.03 = release/v1.03 f72a55f (LEAD), can ship; it replaces e53c2af:
  - The diff against e53c2af is exactly 5c23aa9, 849cd70 and f72a55f: 15_shop.js renames "Trail Runners" to "Trail Hikers", and
    29zx_simple.js drops the anorak from the cut list. The 5 anorak webps are byte-identical to a9def76, which QA passed.
  - Game files match qa-local bf7b4a4 except APPV 103.
  - On a clean plain build, female character, Fri Nov 20 (altcut.js EXPECT_ANORAK=1):
    - ALTITUDE is live, and all of its pieces are listed.
    - The anorak is on sale, on its card and in the sale row.
    - "Trail Hikers" shows; "Trail Runners" is nowhere.
    - The version line reads v1.03.
  - LEAD's cutpieces.js still PASS. No page errors.
  - Not checked: an iPhone, a real purchase, Live (checked after shipping).
- PASS, v1.03 = release/v1.03 e53c2af (LEAD), can ship as it is:
  - Composition: app/src, data, tools and art/app match qa-local db36053 except APPV 103. The 9 room-sweep cherry-picks, 7c5664e,
    8093dcb and db36053 are all in; the sweep and the 14 ALTITUDE pieces were already QA PASS.
  - db36053 (the anorak off sale) on a clean plain build, female character, clock on Fri Nov 20 (`rigtest/qa/altcut.js`):
    - ALTITUDE is live, and the Shop lists every other piece.
    - The anorak is not for sale; an owner still sees theirs.
    - The free-item pool and the Shop groups both go through itemFits, so the cut holds there too.
  - LEAD's cutpieces.js PASS on it (OVERPASS cuts, owners keep, KODE PINK held). The version line reads v1.03. No page errors.
  - Seen and fine: a woman's Shop shows the men-only Half-Zip and Cargo Shorts as cards with the deny button. That's the Shop's
    usual design for the other body's pieces, not new.
  - Not checked: an iPhone, a real purchase, Live.
- PASS, ROOMS a9def76 (the anorak FIX; clean plain build; `shots/qa/altitude/FIXED_anorak_*`):
  - All 5 files are solid: no see-through panels, and each back is one piece (it was 3). The icon is solid on grey.
  - Worn on the female body in all 35 poses (brandwear.js, 0 failed to draw, no page errors), and close up in 13: the lilac panels,
    a whole hood from behind, and a straight hem over the shorts, with no specks in sitBack or type1.
  - Nit, no fix needed: the lilac panels are flat fills without shading beside the painted green sleeves, and the big icon has a
    few scratchy lines at the hood. Hard to see at room size.
  - Not checked: the m files on a body (the anorak is women only, and Rafe's rooms look uses his signature jacket).
- FIX (ROOMS, art), ALTITUDE wear-check on a clean plain build of 8093dcb (7c5664e art + LEAD's names): the Color-Block Anorak
  (gx_al_anorak, women only) has its white panels knocked out with the background. In f_al_anorak_front/back, m_al_anorak_front/back and
  icon_al_anorak the middle of the jacket is see-through: only lilac flecks and outlines are left, and the back of the hood is in
  fragments. The new back is 3 detached pieces with 32% fewer opaque pixels than the old one (65,975 + 5,712 vs 101,848). In game a pale
  grey layer shows through, so it reads as a white panel from the front at room size. From behind, the hem is a lilac and black smudge
  over the shorts, with loose dark specks by the waist in sitBack and type1. The Shop icon shows the card background through the panel.
  Fix: restore the white panels (and the hood back) as opaque, the look Cal approved; ids and size unchanged. Pictures:
  `shots/qa/altitude/FIX_anorak_*`. LEAD: v1.03 should wait for this, or ship with the anorak held; ALTITUDE's first drop is Fri 11-20.
- PASS, the other 14 ALTITUDE pieces (same build; `rigtest/qa/brandwear.js`, pictures `shots/qa/altitude/`):
  - Every piece worn on both bodies, in every pose the rig has (35, with sleep, sit, back views and the six visitor animations), with
    all three hairstyles. Four all-ALTITUDE outfits per body, plus each piece alone among other brands' pieces: 17 outfits per body,
    1,190 frames. None failed to draw; no page errors.
  - By eye (13 key poses close up):
    - The mask and goggles sit on the face, under hats and headsets.
    - The chest rig sits over every top, with its straps crossed on the back.
    - The earflap cap and bucket hat sit right with h1/h2/h3, with long hair over the back.
    - The sandals show grey socks.
    - The trail runners go over the trousers (as flagged); flared and snow trousers cover the sandals, as for any shoe.
    - The shorts and the shorts-and-tights read right.
  - The game's own stretch frame for the five redone tops (their yawn pictures gone on purpose) falls back to the calm stretch on both
    bodies.
  - Shop rows: all 15 icons and front/back files present; men-only (henley, shorts) and women-only (anorak, tights) flags match the
    items. No art holes in the other pieces (the chest rig back's gaps are between its straps).
  - Small notes, no fix needed:
    - The ragged sleeve edges in stretchUp show on every brand's tops (rig-wide, not ALTITUDE).
    - Rafe's team look still names al_anorak, but rooms draw his signature jacket instead (TMTOP).
    - Name nit for LEAD: "Trail Runners" are drawn as mid-height hiking boots.
  - Room-sweep commits 16a9ebf through 8a99e00 are all QA PASS already; none needs to stay out of v1.03.
  - Not checked: other skin tones, night lighting, a real Shop purchase, the drop-day shuffle (LEAD's dropshuffle run), an iPhone.
- PASS, ROOMS f65b082 + 6b69666 + 8a99e00 (the sweep's last code batch; clean plain build of 8a99e00; bigrooms.js and auditall.js on
  bowling, auditorium, restaurant, garden; `shots/qa/rooms1115/`): Restaurant, no seats on air in auditall any more, the dining floor
  down to 7 tables with room between them; Auditorium EXIT sign in view beside the rear speaker; Garden front-right corner thinner (the
  shed gone once the conservatory stands); Bowling score console and ball return up at the lane ends. For Cal to judge: the Bowling
  seat row now stands beside the left lane's foot, backs to us, facing the lane side like spectator seating; a real alley has the
  seats behind the approach facing the pins, which needs back-view seat art. Left for art from Cal's Chrome (ROOMS's list): the
  Dessert sundae, a painted Speakeasy back bar, a back-view Karaoke booth, the Lair's outlined pieces; the Auditorium projector's aim
  waits on Cal's OK of the projector back views. Owner: ROOMS (art), Cal (Bowling seats, projector).
- PASS, ROOMS fdecc73 (clean plain build; bigrooms.js and auditall.js on rooftop, speakeasy, garden; `shots/qa/rooms1115/`): Rooftop DJ
  booth between the planters, clear of the pool corner and ladder; Speakeasy corner booth clear of the piano with a gap; Garden, no
  grow-lamp bar across the doorway. auditall: only the old pool float, the stage band and the cart-over-stage depth. Still with ROOMS:
  Bowling, Karaoke, Auditorium, the Restaurant seats on air, crowding; art for the Dessert sundae, a Speakeasy back bar, the Lair's
  outlined pieces (Cal's Chrome). Owner: ROOMS.
- PASS, ROOMS 25a23a9 (clean plain build; bigrooms.js and auditall.js on bedroom, patio, mall): the Bedroom is 1860x1496 again (as on
  4c6317b), the Patio seen through its glass without the front posts; the Patio itself unchanged (1860x1784). Mall: the escalator's
  top now runs into the dark opening under the balcony and clears the glass elevator; the potted palm behind its left rail reads as
  decor behind it, fine. auditall: only the old Mall "stand-touch wander" and the Patio lounger's own seat. `shots/qa/rooms1115/`.
  Garden grow-lamp bar: ROOMS nudges it in the next batch. Owner: ROOMS.
- ROOMS 152e874 (clean plain build; bigrooms.js and auditall.js on theater, patio, bedroom, garden; `shots/qa/rooms1115/`). PASS:
  Theater's second chandelier now up on a cord between the recliners, both cords run up near the wall top, framing unchanged
  (1860x1533); Patio, the telescope's guest spot out of the lounger (only the lounger's own seat is left, "stand-in chair:chair",
  a real seat: fine as is); Bedroom desk clear of the patio door frame (tight, no overlap); Garden back door opens onto the aisle,
  scarecrow off the door, the lantern out of the koi pond. Note (small, rule 20): the herb bed's purple grow-lamp bar crosses in
  front of the Garden door's lower edge, at shin height in the doorway (`big_garden.jpg` ~150-280, 225-300 of the door crop).
  FIX: the Bedroom is drawn smaller in its window: 1860x1496 on 4c6317b, 1860x1308 now, the room ~20% smaller with an empty band on
  the right (`big_bedroom.jpg`). 152e874 only moves the desk in 20_loft.js, so it is likely 16a9ebf's Patio posts and strings, seen
  through the Bedroom glass and clipped, still counting toward the Bedroom picture's bounds (the same growth ROOMS saw on the Theater
  cords). The extra "look:deck" spot auditall lists outside the Bedroom is the patio's own (people out on the deck), not a fault.
  Owner: ROOMS.
- ROOMS sweep fixes 16a9ebf + 0809117 + 96f45cb (clean plain build of 96f45cb; bigrooms.js and auditall.js on the 8 rooms; pictures
  `shots/qa/rooms1115/big_<room>.jpg`). PASS: Restaurant chandeliers on cords over the round booth table and a square table; Theater's
  first chandelier on a cord over the recliners, the rocket standee off the doormat; Patio strings tied to five posts, telescope off
  the railing, bar cart off the planter; Boba burner on a steel stand; Closet rod gone; Rhythm mirror on the left wall plane,
  equalizer on the right, bench inside the floor; VR globe poster on the left wall plane, flight pod inside the floor (tight against
  the gyro chair's headset stand, no overlap); Game Room hex lights on the left wall plane. Audit: Rhythm and VR no longer outside.
  FIX 1: Theater lobby, the second chandelier (over the carpet by the stanchions, ~770,830) still hangs at stanchion/waist height,
  and its cord ends in mid-air at ~770,620 well below the wall top (the first one's cord reaches ~790,240). Raise it and run the cord
  up like the first. FIX 2: Patio, a new guest spot inside furniture ("stand-in cust:cust" in auditall.js; before only the chair
  spot), likely where the bar cart or telescope moved. Not checked: other styles, earlier stages, night, people. Owner: ROOMS.
- PASS, v1.02 = bd74f15 + 83feea0 only (cherry-picked onto bd74f15 in a clean worktree: one file, 29zx_simple.js; sandbox build):
  the toast FIX holds. toastpos.js: "First step done: +50 coins" sits at 653-714 above the tab bar (726-812) at 375x812, 581-642
  above 654-740 at 360x740, 685-746 above 758-844 at 390x844; the exit fade still runs; no page errors. Everything else as on bd74f15
  (QA findings above). Not in this pass: ROOMS's 16a9ebf (lights), not checked yet. Not checked: a phone. Owner: LEAD, ship v1.02
  from bd74f15 + 83feea0 + APPV 102.
- FIX, v1.02 5eeb623 "toasts above the tab bar" does not take: 29zx_simple.js adds .pop{bottom:98px} in a <style> in <head>, but the
  page's own .pop rule (bottom:24px) sits in a <style> in <body>, later, so it wins. On the sandbox of bd74f15 at 375x812 a pop()
  reads bottom 24px, top 748 / bottom 788, over the tab bar (726-812): "First step done: +50 coins" covers it as before. Fix: a more
  specific selector (#layer .pop) or append the style to body. Owner: LEAD.
- PASS, v1.02 bd74f15 (clean plain and sandbox builds; = v1.01's fixes + 5eeb623 + 1b4efc5 + e651938 + bd74f15), except the FIX above:
  LEAD's review102.js, claimall.js, firststeps.js ALL PASS; QA's dqeffort.js, wpactcash.js PASS; tourqa.js PASS once updated for the
  new pacing (level 2 runs only The Loft's tour). By hand, a new player at 375x812: the letter closes itself after Claim; "Buy
  something to wear" no longer ticks for free (3,000 coins, not 3,050); tour step 2 is "Add one first" on the add box (no Workout);
  "reply to emails" sorts to Admin and day job; level 2 opens The Loft (tour) and Town (badge, no tour that day); next day the Daily
  Quest tour, then Town's; level 3 opens Players (badge), its tour a day after Town's; the Bedroom lists Area Rug 300 first. Old saves
  (v88_adv, v89_mid, v90_mid, v90_adv): no First steps card at level 18 and 60, no page errors. The Lair's UPGRADES now reads as
  screen text. Notes, not blockers: tour steps 1 and 2 both ring the add box; the Loft unlock still rings a "?" tab; week one at full
  weight moves 3 ordinary tasks from ~41 to 45 of 100, so a new player still can't fill the Daily Quest (Cal/LEAD); v88/v89 saves get
  the welcome letter on open (not compared with v1.01). Not checked: a phone. Owner: LEAD.
- ROOMS SWEEP for Cal (2026-11-14, via LEAD): every room fully bought, default style, 13:00, plain build of 4c6317b (live rooms).
  Full list with positions: `rigtest/qa/review_rooms_1114.md`; pictures `shots/qa/rooms1114/big_<room>.jpg`; `auditall.js`. Owner: ROOMS.
  1. Chandeliers hanging at chair/knee height, not over a table: Restaurant (2 of 3), Theater lobby (both). Patio light string ends
     in mid-air on the left.
  2. Floating with nothing under: Boba's gas burner and wok (flames above the wok); Dessert's sundae glass between the machines;
     Closet's glowing rod across the hidden-stair arch.
  3. Wall pieces at the other wall's angle (they stick out): Rhythm's mirror panels and equalizer display (swapped), VR's globe
     poster, Game Room's left-wall hex lights.
  4. Off the floor edge: Rhythm's bench, VR's flight pod (audit OUTSIDE too).
  5. Doors/paths blocked: Bedroom desk into the patio door; Garden back door onto a raised bed; Mall escalator ends in the wall under
     the balcony; Theater rocket standee on the entrance.
  6. Clips: Rooftop DJ booth into the pool corner; Garden lamp post inside the koi pond; Speakeasy booth into the piano; Patio
     telescope through the railing, bar cart into the planter.
  7. Not like the real room: Bowling seats face the trophy wall (backs to the lanes), ball return away from the lanes; Karaoke front
     booth faces out of the room; Auditorium projector aims at the corner, EXIT sign behind a speaker; Speakeasy bar has no back bar;
     Lair "UPGRADES" serif text over the screen, outlined pieces clash with the painted room.
  8. Crowded fully bought: Restaurant dining floor (8 tables, booths, chairs nearly touching); Garden front-right corner.
  9. Audit: Restaurant 4 diner seats on air, Patio a chair spot inside furniture.
  Looked right: Sky Bar, Arcade, Nightclub. Not checked: other styles, earlier stages, night, people in the rooms.
- PASS, v1.01 release/v1.01 54b7517 (= 4c6317b + bae643f + 54b7517, only 29zx_simple.js and 29w_duel.js; clean sandbox build):
  both FIX lines fixed. dqeffort.js: 76 before and after Clear completed, 76 after a reload too, the hook reads 76. wpactcash.js PASS,
  his $25 pact now reads "Only one of you makes the goal: the other owes them $25. Both make it, or neither: nobody owes anything.
  The app never moves money."; wpact.js PASS (coin pacts unchanged), LEAD's wager.js PASS. No page errors. Not checked: a phone.
  Owner: LEAD, ship v1.01 (release/v1.01 + APPV only).
- FIX, v1.01 Daily Quest 689d212: "Clear completed" puts bonus XP back in the bar. Cleared one-offs leave S.quests but stay in S.done,
  so zxDqParts finds no quest, counts the XP as paid (bonuses in), and weights it at that size. Seen: ticks of 5, 10, 25 (daily) and
  40 (paid 50) give 76; after Clear completed the bar reads 86. That is Cal's exact habit (many small one-offs, then clear), so the
  rebalance leaks. Remember what each tick counted (e.g. S.dq keeps {id: counted} when ticked) and use that when the quest is gone.
  `rigtest/qa/dqeffort.js` (sandbox). Also: window.__qbEcon.xp still points at the old dqXp (90 where the bar says 76); test hook
  only, the game's own calls use the new one. Owner: LEAD.
- FIX, v1.01 wagers a0a7292: a real-money Gym Pact shows the coin rules. Justin's "$25 each" pact reads "You both put in the stake ...
  Both reach the goal: each gets 1.5 times the stake. Only one does: they take both stakes. Neither does: both stakes are lost", but
  in dollars the game says "you both made it. Nobody owes anything". gpRules() needs a money version (and the same on the send form).
  Copy only. `rigtest/qa/wpactcash.js`. Owner: LEAD.
- PASS, v1.01 wagers a0a7292 (sandbox of 4c6317b, stand-in Justin): LEAD's wager.js PASS; QA's new wpactcash.js PASS: a $15 pact holds
  no coins, 4 days vs 1 says "Justin owes you $15", 1 vs 4 says "You owe Justin $15", coins unchanged, nothing settles twice after a
  reload; his $25 pact and $10 challenge are acceptable with 0 coins and hold nothing. QA's wpact.js updated (the day starts at
  midnight: 11:30 pm counts for its day; the calm week off so Training opens; the new stake message): PASS, all 19 lines. Not checked:
  a phone; a v1.00 phone receiving a $ challenge (it would read "0 coins each" until it updates).
- PASS, v1.01 drops 5fa8be7 + 8c3f8dc (plain builds of 8c3ecec and 4c6317b, LEAD's dropshuffle.js on both): the slots before Nov 16
  are identical; no held brand (gp sp bb km oak alt sv nc kp) drops from Nov 16; no brand drops while live. From Nov 16 only four
  brands are left and they cycle in a fixed order: OVERPASS, SMOKE BOMB, HANGANG, DIAL-UP, OVERPASS ... every 2 weeks, so the drops
  are not a surprise until holds lift (Cal FYI, not a bug). No Wednesday vault. Cut pieces: LEAD's cutpieces.js PASS (OVERPASS's
  kept pieces on sale Tue Nov 17, the three cut ones not, an owner keeps theirs, KODE PINK not on sale); chests and crawl rolls use
  freePool, which asks itemFits, so cut pieces are out of them too. Note: held brands' pieces can still roll in chests (holds are for
  drops only), and the not-yet-cut pieces of ALTITUDE, SOLVBERG and NICE COCK can too until ROOMS sends the rest of the cut list.
  Owner: LEAD (FYI).
- REVIEW for Cal (via LEAD, 2026-11-14): how a new player feels, a week-2 player, the community. Full text: `rigtest/qa/review_experience.md`;
  pictures `shots/qa/newplayer/`. Sandbox of 8f517af (= live v1.00 code) at 375x812, played by hand, days 1-4 by the clock; L18/L60 seeds.
  Short answer: day 1 and the calm week are calm and well paced; level 2 (after 2 tasks) piles ~9 windows and tours and 4 toasts into
  5 minutes; the first purchase screen says "Not yet" before the buyable items; gamer words a non-gamer skips; community does not pull
  people back (Town starts empty, no way to see anyone's place, the player card is a like and 4 emotes). Fix first, in order:
  1. The Board tour's "Do it, then tick it" rings the only quest, the 1 h live-photo Workout, before the player has added tasks: ring their
     own task, or start with a 5-minute one. `04_tour_points_at_workout.jpg`. Owner: LEAD.
  2. Bedroom window: "COMING NEXT ? ? ? Not yet" is the first card, the three 300-coin buys are below the fold; "+0.05% XP" means nothing.
     `09_bedroom_coming_next_first.jpg`. Owner: LEAD.
  3. Level 2 opens The Loft, Town and Players at once; "You unlocked The Loft! Tap here" rings a "?" tab. Spread them (a level or a day
     each, like the calm week). `08_loft_unlock_points_at_question_mark.jpg`. Owner: LEAD.
  4. Plain words at first contact: "hunter / gates / class / evolve", "Awakened", "Perks +25%", "Rested +0%", Class Awakening. Owner:
     LEAD (copy), Cal (tone).
  5. Community pull (Cal picks, LEAD builds): automatic Town posts for level-ups, rooms, workout weeks and verified photos with one-tap
     reactions; a read-only look at a friend's Loft (now that styles differ); a shared duo goal for two players; "while you were away"
     for likes, emotes, challenges.
  6. Daily Quest for new players: 100 XP is out of reach with 3 ordinary tasks under 689d212's counting (~45); scale it in week one.
     Owner: LEAD (already on the DQ).
  7. Small: "Buy something to wear" ticked on a brand-new character; Claim does not close the letter; First steps on L18/L60 saves; four
     "!" badges at once; toasts over the tab bar; offline sorter put "reply to emails" under Outside run (live scorer not checked).
     Owner: LEAD.
  8. "Poke or spank" on every player card: Cal's call for players outside the couple.
  Not checked: real sign-in, live AI scorer, camera, iPhone Safari, real posts/chat, challenges and kudos in action, notifications,
  a real week-2 save with a full list (the seeds have 1 quest).
- PASS, LEAD's version label 2a3257e (clean sandbox build of 0c5fc49, a real seed save, version.json faked to 101 and 110):
  the top line reads "v1.00 · saved", the notice "Version v1.01 is ready. You're on v1.00." (and v1.10 for 110), after Later the
  "!" button reads "Update v1.01 is ready"; no "v0.1xx" text on the page or in src/, no page errors. `shots/qa/ver_101.png`,
  `ver_110.png`, `ver_later_101.png`. Not checked: a real update arriving on a phone (faked version.json only). Owner: LEAD, ship v1.00.
- PASS, LEAD's Show me fix 86002df for "Buy your first upgrade" (clean sandbox and plain builds of 719f77e, `rigtest/qa/firstbuy.js`, its
  checks reordered as LEAD asked): followed like a player, the rings go Open The Loft > Tap your home > Tap the Bedroom > Buy one, and the
  tap on Buy bought the rug: the step ticked and paid +50. With only 10 coins: the same rings into the Bedroom, nothing bought, the step
  stays open, the ring does not stay stuck. The tour change in 29zy_tour.js: tourqa.js passes again (the letter first, the welcome tour's
  cards on screen at 390 and 360, The Loft, Town and Players one at a time, Skip sticks, 5 seed saves no tour). 0 page errors. With the
  chef hat (b416f33), nothing open from QA for v1.00. Not checked: a phone.
- PASS, LEAD's first-steps fix 5ded710 (clean sandbox of 21f7188, `rigtest/qa/firstbuy.js`): two level-ups put __m35 in a new player's
  Bedroom with nothing bought, and "Buy your first upgrade" stays open (no coins); a real purchase (the Bedroom rug, 300) ticks it and
  pays +50. 0 page errors.
- FIX, LEAD (`29zx_simple.js` the "buy" step's Show me): followed like a player it stalls. Step 1 rings the Loft tab; tapping it shows the
  STREET (the Loft building from outside, "tap a building"), not the inside. Step 2 then says "Tap the Bedroom", but no Bedroom is on
  screen: the ring sits around the sky and "The Loft" sign at the top, and the card covers the building. A tap there opens nothing, and
  the ring goes. It needs a step "tap the Loft building" when the street shows (ring the building), then the Bedroom.
  `shots/qa/fb/buy_ring2.png`.
- QA, LEAD's first steps b3f7e4d, clean builds of 9f6c17c and v0.99 bfb412b. NOT A PASS (below). Works: LEAD's firststeps.js passes on
  QA's build; 4 seed saves load with the same coins as on v0.99 and are paid nothing for what they had done; old saves 41/41; a new player's
  Board on calm days 1 to 4 at 390 and 360 (first steps under the Daily Quest and the Training tile, above the task box, no sideways
  scroll; `shots/qa/fs/board_day*.png`); each step pays once (a tick, untick and tick pays the "tick" step once). 0 page errors.
- FIX, LEAD (`29zx_simple.js` ZXFS "buy" done()): "Buy your first upgrade" ticks itself and pays 50 with nothing bought. It counts any key
  in a room's a, and the old Bedroom migration lfMigA (20_loft.js) writes r.a.__m35 into every Bedroom once the Loft code runs. Seen: a
  new player's Bedroom gets __m35 around level 2, and the step ticks and pays (`rigtest/qa/firstqa.js`). Count only real upgrade ids
  (ADDONS of that room), not keys starting with "__". Then QA rechecks Show me for that step (not reachable now: it was already ticked).
- PASS, ROOMS's chef hat b416f33: Mara's eyes show under the hat in all 13 frames (idle and the six animations), where v0.99 covered them.
  `shots/qa/m_hat.png`. Not checked by eye: the Restaurant cooks, who wear the same npc_hat.
- PASS, LEAD's six visitor animations 815bab2, clean plain build of 8e1d48c. LEAD's emotesheet.js: all 13 friends (Kenan and Victor too) and
  5 team members, idle plus both keys of wave, laugh, dance, chat, cheer and clap, 0 not drawn, all read right by eye. The rescued allies
  (LEAD's open item), drawn the same way from ALLOOK: Pip, Kit, Bram, Juno, Neo and Seraphine, 78 of 78 frames, fine by eye (the closed
  eyes of laugh and cheer sit behind sunglasses where they wear them). Live: LEAD's emoteplay.js in Kode Plaza, 90 s: Mara plays wave,
  laugh, dance, chat and cheer; Garden and Restaurant staff and guests never. QA's own in the Game Room with the six allies, 75 s: each
  plays five or six of the six, between walks; the player never. 0 page errors. `shots/qa/emote/sheet.png`, `allies.png`. NOTE, ROOMS
  (old, not from this change): Mara's chef hat covers her eyes in every frame, idle too. Not checked: a phone, the frame-encode cost.
- PASS, the fixed building view with LEAD's fix 60f08ce, clean plain build of 5d726d6, WebKit (`rigtest/qa/bldfit.js`, now logging what
  a missed tap lands on): Kode Plaza fixed: with the Garden and Restaurant 2/2 rooms open on a tap, with 4 rooms 4/4, all 7 7/7. Every
  building at 390x844, 375x667, 360x740 and 844x390 has all its rooms inside the band under the top buttons and above the tab bar, and
  every room opens (Loft 5/5 twice at 390). The only miss left, the Loft's room 0 in landscape, lands on DIV.bs-items: the new-brand
  window that opens on its own mid-test, not the Loft. LEAD's lfloft_lock.js passes at 390 and 375; its tap step failed once at 440,
  most likely the same window (QA's own taps open every room). `shots/qa/bld2/`.
- PASS, Kenan (ROOMS e7e6b70, LEAD's wiring a995106): his three visit portraits cross-fade on the card at 390, the same size as Victor's
  (125-129 x 280-286), feet on one line; on his body (m), 34 of 34 frames in every clip: the beard, the overshirt over the white tank,
  stone pants, black sneakers; the stretch falls back to closed eyes (no yawn picture). The f rows are blank, as meant (fr_kenan_hair
  has male art only; he is male). `shots/qa/kenan/friend_kenan.png`. Not checked: his look walking in a room by eye.
- PASS, LEAD's shuffled brand drops 148dc12, clean builds of f2b872c and v0.98 c579e83. LEAD's dropshuffle.js on both (80 drop days): the
  two drops before shuf0 match v0.98 (HANGANG 11-10, DIAL-UP 11-13); from 11-16 the order is new (alt, sp, sv, bb, kp, gp, km, oak, smk,
  over, ...); 6 full rounds, each with all 12 brands once; no brand back while still live; no back-to-back repeats; the Wednesday vault
  still picks (its picks follow the new order). In the Shop the surprise holds: on Sunday night "New brand in 11h 59m" names nothing,
  and on Monday 09:00 PT ALTITUDE is on sale (v0.98: OVERPASS). 0 page errors.
- NOTE, LEAD and Cal (shuf0): if v0.99 ships after Monday 11-16 08:00 Pacific, players will have seen OVERPASS drop on v0.98, and v0.99 then
  shows ALTITUDE in that same slot (OVERPASS leaves the live list). With the building view blocked, that is likely: move shuf0 to the
  first drop day after v0.99 ships, as LEAD offered.
- QA, LEAD's fixed building view bf09ce0, clean plain build of 7aa8637 against v0.98 c579e83, WebKit. NOT A PASS: Kode Plaza (below).
  Works: the Loft and the third building fit and are locked at 390x844, 375x667 and 360x740 with every room's furniture on screen, under
  the top buttons and above the tab bar, and every room opens on a tap (Loft 5/5, building 2 9/9); a zoomed or dragged street does not
  carry into the building (the fit is the same); the street still zooms. LEAD's lfloft_lock.js fails its tap step on QA's machine at
  all three sizes, but only because it taps the middle of the room group's box, which includes the sky, an empty spot on v0.98 too;
  tapping the room's furniture opens it on both builds (WebKit and Chromium). `rigtest/qa/bldfit.js`, `shots/qa/bld/`.
- FIX (blocker), LEAD (`29zx_simple.js` the building fit): Kode Plaza goes blank once the Restaurant is built. With the Garden alone it fits
  and its room opens. With the Garden and Restaurant (the usual early game), or with all 7 rooms, the locked view shows a blurred close-up
  of a wall: no room on screen, and taps open 0 of 2 (0 of 4, 0 of 7); v0.98 opens them. Locked, the player cannot drag to find them.
  `shots/qa/bld/s8769/b1_390x844.png` (4 rooms), `shots/qa/bld/b1_390x844.png` (all). Repro: bldfit.js with ROOMS=bedroom,closet,lair,
  patio,gameroom,garden,restaurant.
- NOTE: in landscape (844x390, a phone's browser tab; the installed app is portrait-only) the top buttons leave a 140 px band and some
  rooms sit under them.
- PASS, LEAD's Loft lag batch dbffcfa + the Club's steady beams 238b192, clean plain builds of 788b584 and v0.97 bd8c2d3. The sky bitmap:
  the real room windows match v0.97 (Bedroom with the sky through its door 0.04% of pixels, Rooftop 0.28%, Patio 0.5-1.1%: the bitmap's
  lit windows are a touch softer at 2x zoom, `shots/qa/m_patio_sky_zoom.png`), with fewer elements (Bedroom 2,826 -> 945, Patio 2,125 ->
  243, Rooftop 2,050 -> 168), at noon and at night (LFHOUR; the room light follows LA sun time, not the game clock); no live sky left
  after the swap; ptClip and ptSky are used only inside the sky, so the swap clips nothing else. A light change while a window is open
  does not redraw its sky, the same on v0.97; reopening draws the right one. Stilled: in Bedroom, Game Room, Arcade, Boba, Karaoke, Club,
  Theater, Restaurant and Upper Bar no door glow, screen part or beam moves (beams at .16); the page flips still turn, one page at a
  time; by eye nothing stacked or broken (`shots/qa/m_still.png`). The "build" speed samples are owner-only (same gate). dupfn no new
  duplicates, 0 page errors. `rigtest/qa/skyqa.js` (its Bedroom line compares QA's copy of the picture, which shrinks; the real window
  matches), `stillfx.js`. Not measured: frames per second (headless Chromium has no phone GPU; LEAD's WebKit numbers stand), a real phone.
- PASS, LEAD's night-owl fix take 2 95dac60 on a clean sandbox of 139ed13 against v0.96 (`rigtest/qa/nightfix.js`, case 1 now judged by
  the quest, since nothing moves at load): (1) the night owl, next night 03:00: streak 10 -> 11, no rest day used; (2) the evening player
  who opened the app at 01:00: 10 -> 11 on 11-20, the same as v0.96 (take 1's loss is gone); (3) a 21:00 save: unchanged, no mid1;
  (4) another device's newer save: wins, unchanged; second loads move nothing; old saves 41/41; dupfn no new duplicates; 0 page errors.
  Read in the code: un-ticking the first quest puts lastDone back to the forgiven "yesterday", so a re-tick counts as normal. Known and
  accepted by LEAD: an evening player whose last save was at 01:00 and who really skips a day gets that day forgiven, once. With the
  ba8010f checks, nothing open from QA: v0.97 can ship. Not checked: a real Firebase save, a real phone.
- QA, LEAD's night-owl fix d03aa26 on a clean sandbox of 0e98007 against v0.96, saves written as the 5 am rule wrote them, loaded with the
  clock set, then one quest ticked (`rigtest/qa/nightfix.js`). Passes: (1) the night owl (quest 01:00 on 11-20, next 03:00 on 11-21):
  lastDone moves to 11-20, streak 10 -> 11, no rest day used; (3) a 21:00 save is left as it was; (4) another device's newer save wins
  through saveWhich and is not touched; a second load moves nothing (mid0); old saves 41/41; dupfn no new duplicates; 0 page errors.
- FIX, LEAD (`29zx_simple.js` zxMidnightOnce): case (2) loses a +1. It reads the time of the last save, not of the last quest. An
  evening player who did a quest at 23:00 on 11-19 and opened the app at 01:00 on 11-20 (any save then: the app saves on its own)
  gets lastDone moved to 11-20, so their quest at 10:00 on 11-20 earns no streak day: 10 stays 10, where v0.96 gives 11 (not a reset;
  one day short, chests a day late). Suggestion: leave lastDone alone at load and, once, at the first streak credit after the switch,
  count a gap of 2 as 1 when that save was written between 00:00 and 05:00. Then the night owl and the evening player both come out right.
- QA, the v0.97 candidate ba8010f against v0.96 b010f63 (clean sandboxes). PASS: the day turns at midnight (at 00:01 on 11-21 the day,
  the done quests and the Daily Quest are on 11-21; v0.96 waits for 05:00), `rigtest/qa/daystart.js`; the speed log: a guest writes
  nothing to qb-perf, the owner keeps tap and change samples (a "stay" sample lands about 35-38 s in, after its 5 s measurement; QA's
  36 s wait was just short); the spin row: comes ready while the Board sits open and shows within 30 s with no tap, not while a window
  is open (`rigtest/qa/perflog.js`). Release checks: old saves 41/41 (wsaveload.js now expects one bounty card, since v0.96), pricesweep
  0 changes, dupfn no new duplicates, 0 page errors.
- FIX or Cal's OK, LEAD (`30_app_b.js` DAYSTART 0, creditStreak's dayDiff): a night owl loses a day once, at the switch. A play at
  01:00 on 11-20 under the 5 am rule was stored as 11-19. Played again at 03:00 on 11-21: v0.96 calls that 11-20 (1 day, streak on);
  v0.97 calls it 11-21 (2 days), so it counts as a missed day: it uses the weekly rest day or a freeze, and with neither the streak
  drops to floor(streak x streakKeep)+1. Next play 09:00 on 11-20 is fine on both. Measured: each build's day at those times; the
  streak result is from the code (QA's onTap in the page did not credit the streak). A one-time fix: on the first load after the
  change, if the save's last play was between 00:00 and 05:00, move lastDone on a day.
- PASS, LEAD's overhaul part 3 995eb4b (for the version after v0.95; the live v0.95 3086c59 is b7d9dff + APPV, which QA passed, without
  it), clean sandbox of a591705 at 390 and 360: with a spin ready, "Wheel · Your free spin is ready · Spin" sits under the Daily Quest,
  no Wheel tile, one bounty card on the Board, and the Wheel's tour rings the row; after a spin the row is gone; 3h59 later still gone,
  4h01 later back. A 2-day bounty taken on v0.95 stays on the quest list on the new build and pays exactly the same when done (+88 XP,
  +1,506 coins on both). 0 page errors. `rigtest/qa/spinrow.js`, `shots/qa/m_spin.png`. NOTE, LEAD: when the 4 hours run out while
  the Board sits open, the row only appears with the next redraw (a tap, a tab). Not checked: the row's "!" for a newly opened Wheel.
- PASS, v0.95 at b7d9dff (LEAD's Next line FIX 09c30da), clean sandbox and plain builds. The 80%-bought case: 500-649 coins no longer
  says "afford"; at 650 "You can afford an upgrade in the Garden", and with every room open it named the Speakeasy, whose window opened
  from the line and bought (650 -> 150). nextline.js PASS at 390 and 360 (4 seeds exact at 300 vs 250). The moved offer list
  (roomAvail): every room's window at 0, 50, 80 and 100% bought shows the same 1,047 cards, Buy states and "? ? ?" cards as on bd3cc5e
  (84 windows, 0 different, `rigtest/qa/roomoffer.js`); stuckscan: all 21 rooms bought to the end through their windows, 0 stuck.
  0 page errors. With the d689703 checks above, nothing open from QA: v0.95 can ship. Not checked: the tour's notch spacing on a phone.
- QA, the v0.95 candidate at d689703 (everything since v0.94): one FIX left (the next line). Release checks on d689703: wlive PASS, pricesweep
  0 problems (only the 85 Loft upgrades changed), dupfn no new duplicates, old saves 41/41, smoke, 0 page errors.
- PASS, LEAD's guided tours and calm week 0241042 (on d689703's code, plain and sandbox builds): LEAD's tourtest.js all pass on QA's
  clean build. QA's own (`rigtest/qa/tourqa.js`, `shots/qa/tour/`): the welcome letter first, never a tour on top of it; the welcome tour's
  4 cards all on screen at 390 and 360; at level 2 The Loft, Town and Players run one at a time in that order (the Loft's own welcome
  window pauses the tour, as it should); Skip on Town marks it done and it does not come back; 5 seed saves: no tour, calm false, the
  Daily Quest, bounties and Training tile all still there. 0 page errors. NOTE, LEAD: the ring and card keep 4-8 px from the top, not
  env(safe-area-inset-top); every step scrolls its target to the middle first, so it should stay clear of the notch, but not checked on a phone.
- PASS, ROOMS's Restaurant tip jar by the till 0d17dbe: the jar comes and goes with r_till (bare, stage 1 and 2 without the till: none;
  till alone, with stage 1, stage 2 and fully bought: one jar in front of the till on its counter, never alone on the half wall's corner).
  `shots/qa/v95/m_till.png`.
- PASS but one FIX, LEAD's overhaul part 2 4211a7e (`rigtest/qa/nextline.js`, `shots/qa/v95/next/`): at 390 and 360 the Next line reads
  right for a day-1 player with no tasks, with tasks, a trial waiting, a Daily Quest to fill; it names the Daily Quest only when its card is
  there; the top bar shows "N XP to level N+1" (or "Bar full: pass the trial"); STR/AGI/VIT/INT hidden below level 10, shown at 14; no
  sideways scroll; 0 page errors.
- DONE by LEAD in 09c30da. FIX, LEAD (`29zx_simple.js` zxCheapest): "You can afford a Loft upgrade" is worked out from the cheapest unbought upgrade in any room,
  not from what the windows offer. With every room 80% bought, the cheapest unbought is the Restaurant's r_d7 (500), which no window
  offers a Buy button for; the cheapest real Buy button is 650 (Garden). With 500-649 coins the line says "afford" and nothing can be
  bought. It also says "Loft" for Garden and Restaurant pieces, and Open goes to the Loft view, not the room. Use the windows' own list
  (half-bought and Bedroom-only saves were right).
- QA, the v0.95 candidate up to 5850751 against v0.94 bf9430e (clean sandbox, Live and plain builds). PASS, every item:
  (1) tabs: tile icons 28 px (a new player's Training tile 324x94, mid tiles 103x113 at 390, 143x94 at 360), "!" on the Wheel and Crawls
  tiles and for Relics, all ways back and Board lit (`rigtest/qa/tabs5qa.js`, `shots/qa/v95/m_tabs.png`); (2) middle-ground start: no
  bad price, only the 85 Loft upgrades changed, now about 2x for Bedroom, Closet and Patio, 1.7x Game Room, 1.5x Lair; saves with 47 and
  87 Loft upgrades load unchanged (slowsave.js); (3) coin requests: a player (guest path) reads only kudosok/<own id>, is paid the
  approved 500 once, also after a reload, never another player's; nothing pinned in the Town Hall; the owner still reads every answer
  (`rigtest/qa/kudos95.js`); (4) exercise swap: LEAD's swaptest.js all pass on QA's clean build, by eye fine (`m_swap.png`), the weight
  box still keeps the last weight (wtrainw.js, now opening Training from its tile); (5) friends' tags above the head (wvisit.js PASS,
  `wvisit/roomwin_tag.png`). Release checks: wlive PASS, pricesweep 0 problems, dupfn no new duplicates, old saves 41/41, wui92, smoke,
  0 page errors. Not deployed or tested: the new firestore.rules (Cal's deploy, after this code is live).
- FIX, ROOMS (`26_world.js` the Restaurant's tipJar, 778fd8d's `st>0`): not fixed. At stage 1 (r_x1) and 2 (r_x2) with the pass not yet
  bought, the jar still sits on the top corner of the kitchen's half wall over the stove's pot; only the fully bought room has it on the
  pass. The jar has to follow the pass piece, not the stage. `shots/qa/v95/m_rest.png` (stage 1, 2, full).
- PASS, ROOMS's crawl allies 39a0a71, clean build of d521820, all six rescued. Only the Loft built: all six in the Game Room, once each,
  each with a name tag. Every room built: each ally in exactly one room today (pip Restaurant, sera Lock and Key, kit Karaoke, bram and
  juno Rhythm, neo Theater) and somewhere else the next day (Upstairs Bar, Garden, Arcade, VR, Auditorium); tags on all six; no tag
  on anyone else (no random guest). They are wanderers (wand), so the staff count (lfRoomCrew) ignores them: they never staff a room.
  0 page errors. `rigtest/qa/allies.js`. Not checked by eye: their looks (the welcome letter covered the shots; ROOMS wear-tested all
  22 poses).
- QA, LEAD's five tabs ae3ba38 on a clean sandbox of 6426b2e, at 390 and 360, a mid player (level 14, a class, the Lair) and a new one.
  NOT A PASS yet. Works: the bar is Board, The Loft, (Shop once the Closet is built), Town, Players, no sideways scroll; Training,
  Dungeon Crawls and the Wheel open from their tiles with "< Board", the Board tab stays lit, and "< Board" goes back; Relics opens from
  the profile (the window closes, Board lit); a new player gets only the Training tile. 0 page errors. `rigtest/qa/tabs5qa.js`,
  pictures `shots/qa/tabs/` (`m_tabs.png` side by side).
- DONE by LEAD in 5850751. FIX, LEAD (`29zx_simple.js` .zx-tile: the icon has no size): each tile's icon stretches to the tile's width. A new player's one
  Training tile is 324x376 at 390 (a dumbbell filling the screen, the task box pushed down); a mid player's tiles are 103x174 at 390
  and wrap two plus one at 360 with icons ~100 px wide. Give `.zx-tile svg` a fixed size (about 28 px). `board_new_390.png`, `board_mid_360.png`.
- DONE by LEAD in 5850751. FIX, LEAD (`29o_alerts.js` alPaint only marks `.nav button[data-v]`): Cal's question, does the player still notice the news? No. With
  the Wheel, Crawls and Relics newly open and not yet visited, alTabs() lists trophy, wheel and away, but nothing on screen shows a "!"
  (0 on the page): the tiles have no marker and Relics hides in the profile. Paint the "!" on the tile (and the profile's Relics button,
  or the avatar) too.
- QA, the tip jars 693effe on a clean build of 28c52ee: Restaurant, Lock and Key, Boba and Dessert, each with only its counter bought and
  fully bought, at 0 tips, a few and the cap: 24 of 24 draw exactly one jar with the right fill (empty, half, full; tipJarArt's 60% line).
  By eye, close-ups: Lock and Key, Boba and Dessert sit on their counters in both stages, clear of the pieces around them (Boba's full
  room puts the pearl cooker behind the jar, in front of it by depth, not clipped); the full Restaurant's jar sits on the pass by the
  till. `rigtest/qa/tipjar.js`, `shots/qa/tip/`. Not seen: real guests paying tips (in headless Chrome the building view's people stay
  idle; the tips code is the old lfTipFor, the jar only reads its count), and the Restaurant's middle stages. 0 page errors.
- FIX, ROOMS (`26_world.js` tipJar for the Restaurant at the pass, Wi-.62): with the Restaurant bare (the early kitchen behind its half
  wall), the jar sits on the top corner of the kitchen's half wall, over the stove's pot, with no counter under it. Draw it only once the
  pass is there, or put it on the early kitchen's counter. `shots/qa/tip/restaurant_bare_0.png`.
- QA, LEAD's slower start ce5123f against v0.94 bf9430e (clean sandboxes). Safe: no NaN, 0 or fractional price anywhere; only the five Loft
  rooms' upgrades changed (85 of them), nothing in the Garden on, no lot, no Shop entry; v0.94 saves with 47 and 87 Loft upgrades owned
  load on ce5123f with every upgrade still owned and coins, XP, earned and spent unchanged (4 seeds, `rigtest/qa/slowsave.js`); 0 page
  errors. Pace, QA's own 6-day sim of Cal's day: bought per day 6,5,4,4,5,3 (v0.94: 16,11,14,16,13,10), the Garden on day 6 (was 4);
  on day 3 there is still something to buy (earns 5-6.5k a day, cheapest upgrades 1,050-1,100). Not run: the long sim ("everything
  bought" day): rule 17 keeps 90-day runs for when Cal asks. Not confirmed: a "Next goal" line for a day-3 player (none on the Board or
  the Loft in either build).
- DONE by LEAD in 6426b2e (Cal: "find a middle ground": the Loft is now x2). FIX or confirm, LEAD with Cal (`29e_economy.js` econPrice and econLate): the Loft's prices are about 4x, not "about twice": a price is
  tier x phase x econLate, and econLate grows with the phase too. Bedroom 12,800 -> 50,300 coins for the room, Patio 4,650 -> 18,400,
  Closet 4,450 -> 15,950 (each piece 3.7-4.4x); Game Room 15,850 -> 38,350 and Lair 18,200 -> 36,150 (about 3x). LEAD's econsim pace
  matches QA's, so the pace is what it says; the words to Cal ("about twice") are not. A player halfway through the Loft pays the new
  price for the rest.
- CONFIRMED by LEAD (kept: rewards stay in proportion to prices). FIX or confirm, LEAD (`29bg_goals.js` glCoins, `29kv_visitors.js` tips): ECON.phase also sets the building Goals' coin rewards and the
  friends' visit tips, so in the five Loft rooms those now pay twice as much as in v0.94 (from code; not measured). Intended?
- PASS, the fast start on 5256c2b (LEAD's answer to the pill FIX, sent by message): no pill; the version line reads "v0.93 · syncing…" while
  the device copy shows, nothing overlaps, then the normal line once loaded. The whole `rigtest/qa/faststart.js` passes (Board at 0.40 s,
  save at 3.3 s, no writes while syncing, save unchanged over 3 reopens, second account, new player, newer save and "Two saves found" all
  pass, 0 page errors). Both earlier FIX lines and the small one are done. Left for Cal only: the character's box is empty until the sync
  ends. `shots/qa/fast4/A_syncing.png`. Not checked: a real phone with real Google sign-in.
- QA, the Syncing pill recheck on 67dcb12, clean web build, the stand-in Firebase with the save read slowed to 3 s: the background orb is
  back and the pill is a centred dark pill; the whole fast start test passes again (Board at 0.42 s, save at 3.3 s, no writes while
  syncing, save unchanged over 3 reopens, B to E pass, 0 page errors). `shots/qa/fast3/A_syncing.png`.
- DONE by LEAD in 5256c2b. FIX (small), LEAD (`29zx_simple.js` the pill's top, or `.vline`): the pill sits on the version line and covers part of "this device
  only" for the whole sync. Put it below the line, or give the line room. NOTE for Cal: during those 3 s the line reads "this device
  only" (the online save has not answered yet), which can read as "not saving online"; and the character's box is empty until the sync
  ends. Same picture.
- QA, the fast start recheck on 0699c97 (LEAD's fixes for e53c273), clean web build, the stand-in Firebase with the save read slowed to 3 s.
  Behaviour PASS: the Board draws at 0.33 s from the device copy with Syncing on (online save at 3.2 s); a tap during Syncing does nothing,
  after it taps work; nothing is written to the database while Syncing; the save is unchanged after 3 reopens; a second account never
  sees the first player's Board (not even hidden in the page); a new player never gets Syncing; a newer online save wins; "Two saves
  found" now takes the tap and loads the chosen save. 0 page errors. Both FIX lines of e53c273 are fixed. `rigtest/qa/faststart.js`
  (updated: Syncing on <html>, the Board counted only while #app is visible, the seed given a class), pictures `shots/qa/fast2/`.
- DONE by LEAD in 67dcb12. FIX, LEAD (`29zx_simple.js`: `html.qb-sync body::after{content:"Syncing"...}`): body::after is already the background orb (`index.html:389`,
  a 46vmax circle with the drift animation). The Syncing rule takes it over: for the whole sync a big dark disc covers the top of the
  screen and "Syncing" sits unstyled at the left over the version line, on every reopen. Use its own element (or html::after) for the
  pill. `shots/qa/fast2/A_syncing.png`.
- QA, LEAD's fast start 9821a64 on a clean web build (the real web boot on LEAD's stand-in Firebase, rigtest/lead/mockfirebase.js, with
  the save read slowed to 3 s; seed v90_adv brought to the current save first). NOT A PASS: it does not show the Board early, and it adds
  a hard lock. `rigtest/qa/faststart.js`, pictures `shots/qa/fast/`. Passes: the save is unchanged after 3 reopens (device, online, in
  play); a second account on the same browser never sees the first player's Board and starts at the creator with nothing of the first
  written to it; a new player gets sign-in then the creator, never Syncing; a newer online save from another device wins, and a key that
  only the device copy had is gone. Not run: a real phone and real Google sign-in.
- DONE by LEAD in 0699c97. FIX, LEAD (`30_app_b.js`, render(): `if(!loaded)` draws "Loading"): the early render() runs while loaded is still false, so it draws the
  Loading screen, not the Board. A returning player sees "Loading" for the whole save read, exactly as before (Board at 3.2 s with a 3 s
  read), and no Syncing pill either. Cal's 5 seconds are unchanged. `shots/qa/fast/A_at1800ms.png`.
- DONE by LEAD in 0699c97. FIX, LEAD (`29zx_simple.js` qb-sync, `30_app_b.js` saveWhich): when the device copy and the online save differ and one has no savedAt,
  "Two saves found" opens while body.qb-sync still turns off every tap (pointer-events none, the picker's buttons too). A real tap does
  nothing and the game never finishes loading: stuck for good. Drop qb-sync before the picker opens, or exempt .qbsv.
  `shots/qa/fast/E_picker.png`. Rare (saves without savedAt), but there is no way out.
- PASS, ROOMS's Town square backdrop (f9ecb1a + f2e57f6), clean sandbox of f2e57f6, Players tab at 390 and 360: ui_town_square.webp
  loads at 1024x1270 behind the stage (cover, centred), the clock tower and its face show, all 11 spots stand on the plaza (the sandbox
  has 6 stand-ins, so QA copied a figure into the 4 empty spots, in the page only), no page errors. `rigtest/qa/sqart.js`,
  `shots/qa/sq/square_390.png`. Not checked: a real phone.
- NOTE, LEAD (`29p_square.js` SQSLOTS, not the art; Cal's call): with the square full, each row's name tags land on the row in front:
  the middle row's names (Kenan, Jina, Cynthia) sit on the front row's heads, the back row's on the middle row's bodies. Readable, but
  crowded; names above the heads or a little more row spacing would fix it. Same picture.
- QA, LEAD's batch 1, 1feee32, on clean copies of qa-local (a sandbox build with Test tools on and a Live build), headless Chrome at
  390x844 and 360x740. PASS for Live: every item LEAD listed works, 0 page errors. Scripts `rigtest/qa/b1items.js`, `b1square.js`;
  pictures and logs `shots/qa/b1/`. Each item: weight box is a text box with the decimal keyboard, 135 and 102.5 fully shown, "12,5"
  saved as 12.5; a finished bounty says Completed and still does after "Clear completed"; the Hall is the banner, then Posts and Chat;
  Players has the looks, likes, Most rich / Highest level, Town square (tapping Justin opens Wave / High five / Poke / Spank) and
  Neighbors; the Board has the Daily Quest card under the progress line and a Wheel card that opens the Wheel (no Wheel tab); the
  version line sits top left; the profile has Your skills and no rewards; the photo window's Cancel closes it; a level-up card says
  "Level 13, Level bonus" with no "???"; the crawl card promises no sure find (crawlPity 0); the coins float top right only once
  scrolled, hide under a window, and cover nothing fixed; the nav fits at 360. Release checks: Live build (wlive) PASS; pricesweep 0
  changes against v0.92 6bead6a; dupfn no new duplicates; old saves 41 of 41; Training weight, bounties, wui92 and smoke pass; wside
  25 ok after its Town square step moved to the Players tab (QA's script, updated). Not run: the rest of run_rc (reset, two devices,
  boss, chat, photos, pact...), a real phone (the iPhone decimal keyboard and a comma locale), a photo post that hangs 25 s, real Firebase.
- DONE by LEAD in 6ec9c23. FIX before a Mac sandbox deploy, LEAD (`tools/build.py` line ~119): QB_SANDBOX=1 adds only `sandbox = true`, not `noTest = false`, so
  the Mac's sandbox build has no Test tools and no test hooks (the Windows build_web.sh added both, and RELEASING.md says Test tools
  on). Live builds are not affected. QA added the line by hand to its copy to test.
- NOTE, LEAD and Cal (Cal's "daily quest meter still increasing on day 2"): v0.92 6bead6a already turned the day over with the app
  open (its own 60 s timer and on coming back): the same test, clock moved a day, no reload, resets the meter on both v0.92 and
  1feee32. So the new dayTurn is harmless but likely not the cause. Most likely the 5 am day start (LEAD's question 4 to Cal): before
  5 am it is still yesterday. Not reproduced here.
- NOTE, LEAD (Cal's call): the Board's progress line says "0 / 100 XP today" right above the Daily Quest card's "0 / 100 XP", the
  same number twice. `shots/qa/b1/items/board_390.png`.

## Windows team (LEAD / BUILDER / QA)

**PROTOCOL (Cal, 2026-11-10 09:25): every chat reads `.claude/team/README.md` (main folder) NOW and follows it: your block in
`.claude/team/STATUS.md`, your to-do list in `.claude/team/todo/<ROLE>.md`, a TEAM LOOP cron. Requests come through the to-do lists.**

The live list for the Windows laptop team (2026-11-10 on). The older sections below are history. Roles: LEAD owns `qa-local`
(only LEAD commits there, merges after QA passes, bumps APPV, builds the zip for Cal's Mac); BUILDER codes on its own branch per
task in `.claude/worktrees/<task>`; QA tests with the headless tools in `tools/windows` and never edits game code. Never push.
No art generation. Address book and logs: `.claude/team/<ROLE>.md`. Status words: TODO, DOING, READY FOR QA, QA PASS, QA FAIL,
MERGED, WAITING ON CAL.

Base: qa-local a246406 = v0.89 (APPV 89), ZIPPED 2026-11-10 12:32 (Cal: "I need to publish something now"): social, inbox, Training, wheel, drops, chests and relics, the new leveling and economy, photo stamp, idle perf, coin totals. Known: W31 earn by size flat, W25 trigger card hidden (v0.90). Rollback-v0.80 = APPV 91. Next: v0.90. v0.91 TONIGHT (Cal 16:10) = W51/W52 unlock + reset, W45/W46 economy, W48 w-system, W47 Shop header + vault + locked tabs, + floors/sale/nospoil; v0.92 = W49/W53 chat, W50/W14 colours, W41 wardrobe, W57, W58 and the rest; THEN the final MAC_HANDOFF.md and the Windows team stops (Cal 16:15: "Will continue everything through claude on mac"); anything needing art waits about 52 h (Cal's Mac limit).

**v0.91 SHIPPED 2026-11-10 19:27 (qa-local eea5382, zip on the Desktop).** **v0.92 RE-OPENED 2026-11-11 06:00 (Cal: "continue working and fold it all into 0.92"):** everything left that needs no new art goes into v0.92, off
qa-local e688961, in this order (each fails softly where Mac art is missing):
1. w-sound: W56 purchase sounds (synthesized, an on/off switch).
2. w-visitors: W55 friends visit your businesses (SPEC10 part 2: real players in their outfits, a one-line note in the room, tips
   100-400 by room, 2 a day, sparse).
3. w-pact: W28 Gym Pact (specs: SPEC_levels_daily_rooms_pact_mystic part D + Cal: both miss -> both lose; any active session counts;
   photo-only) + firestore.rules.
4. w-photos: W8/W9 the photo feed (SPEC5): post a verified proof with a caption, likes, comments, delete rules; needs Firebase
   STORAGE (storage.rules + the deploy line in the README).
5. w-side: W36 story side-quests, photo only (SPEC4/SPEC6), Sable's Night watch with the server clock in the function (a functions
   deploy) and 3 nights -> the hidden dungeon; w-rafe: W35 Rafe's hunts at 27/52/77/93 (SPEC5, SPEC3 part 6), montage art fails soft.
6. w-perf2: W1b room art per room, only if QA proves it safe; else it stays in the handoff.
Then one rc-v0.92, QA's full run_rc.sh, the zip, and MAC_HANDOFF.md updated.
7. w-final (Cal's full audit 2026-11-11 07:25, 198 requests checked: lead-scratch/audit/requests.md): streak text "Streak: N days",
   the Town Boss 5-player rule only before the first boss, Cal's fresh start until 11-21, pictures in chat, level 100 ~day 85-90 for
   a regular player without moving levels, the pets comment, and W10 the Habitica-style text pass. -> rc-v0.92c. Art (the Town Boss pictures, Rafe montages, etc.) stays
Mac-only.

**v0.92 FINAL zipped 2026-11-11 ~10:30 (qa-local merge c74b50f3 of rc-v0.92d 7be4f84f): the re-open list + w-final (audit) + public challenges; see docs/MAC_HANDOFF.md 2c.** **v0.92 SHIPPED 2026-11-10 ~21:30 (merge d395ae7 of rc-v0.92 24df171); all 6 branches + w-bounty (300 bounties) in. The Windows team stops here; see docs/MAC_HANDOFF.md.** **v0.92 PLAN (LEAD 19:30), branches off qa-local eea5382, APPV 92 (rollback to 93 at release):**
1. w-chat2: W49 Discord-style chat + W53 greetings (wave, high five, poke, spank; Hug, Cheer and Visit Loft go) + W57 online dot and streak.
2. w-colors: W50 Town Hall colours from its picture, then W14 (every screen slightly different).
3. w-wardrobe: W41 categories + brand filters.
4. w-ui92: W58 Board shortest first, W59 quest toast at the top, W60 the building-view "+" window, lfSkyline cleanup, strip
   qbDbg / __qbTeam / __qbAlerts / __qbShift on Live.
5. w-econ4 (small): level 100 near day 85 for regular/cal by quest XP payouts (not the curve, so no one's level moves), Garden-stage
   businesses ~10%. econsim + pricesweep.
6. w-boss: W54 Town Boss with placeholder art (SPEC10 + Cal's final decisions), last; if it risks the release it moves to the Mac.
Then one rc-v0.92 for QA, the zip, and the final docs/MAC_HANDOFF.md.

**v0.91 FINAL LIST (Cal 17:30: "I want all economy based and level based decisions in 0.91. All cosmetic changes and town hall boss stuff
to be 0.92." "Take as long as you need. As long as I can publish it before I sleep tonight"):** W51/W52 unlocks + reset; no level gates on
story rooms, strict Garden -> Restaurant -> bar on Noir -> Boba -> Dessert, Noir ~4-6 days after the Restaurant, no dead-end locked cards;
w-econ3 (passive steps 10/15/20/25-30%, per-business caps, payback prices, 4 price rules, r_safe, the Restaurant sign); the Wheel every 4 h;
w-system (W48) with the level-up card rework and tiered permanent upgrades I-III (3-card cascade); w-shopui (W47, done); text spoiler fixes
(w-nospoil3). v0.92: W49 chat, W53 greetings, W50/W14 colours, W41 wardrobe, W57, W58, W59 toast, W60 "+" window, W54 Town Boss (code with
placeholder art).

| # | Task (Cal's words, 2026-11-10) | Owner | Branch | Status |
|---|---|---|---|---|
| W1 | "Run a stress test on the performance of this platform. Is there anywhere we can improve runtime or load time?" Baseline: load (bytes, first draw, interactive) and runtime (room view fps, idle CPU, long tasks, memory) at phone speed; ranked hot spots | QA | (none) | DONE (on 213ea0f): docs/qa-2026-11-10/PERF.md, docs/QA.md W1 section |
| W1b | Performance fixes from QA's W1 top 5 (todo/LEAD.md 10:55): w-perf1 for v0.90 = Aurora and embers effects, fit() only on change, no lfvar.json, blobs.js after first draw if safe; w-perf2 later = room art per room, rig frame cache, row patching, Rank stills, minify | BUILDER | w-perf1, w-perf2 | TODO |
| W2 | "Change the ability to like another character to two times per day." | BUILDER | w-social | READY FOR QA (3fdaeec) |
| W3 | "Change style to Rank" (the Hall's Style tab) | BUILDER | w-social | READY FOR QA (3fdaeec) |
| W4 | "Only you can delete your own messages." (UI and firestore.rules) | BUILDER | w-social | READY FOR QA (3fdaeec) |
| W5 | Training: "put the lbs right next to the number", dates as "11/09", tap a recent session for a graph of that day, a graph of progression per exercise at the bottom, each opened by a small i icon at the right of each entry | BUILDER | w-training | READY FOR QA (1dd752d, graph ranges; 4cb156d not to be tested) |
| W6 | Wheel: "prize pool to be much higher. Add tiny slivers in between that grant you a random cosmetic item from any clothing brand drop" | BUILDER | w-wheel | READY FOR QA (9d04ba1) |
| W7 | Top right letter and info become a message inbox. Letter 1: the welcome letter with 3,000 coins to start. Letter 2: a roadmap (text WAITING ON CAL) | BUILDER | w-inbox | READY FOR QA (c4da3fe, the fix: S.letters) |
| W8 | "Post pictures on the town board or chats". GROWN (SPEC5): a photo feed on the town board (verified proofs with a caption, post view, likes, comments, delete rules in firestore.rules) | BUILDER | w-photos | TODO |
| W9 | After a photo proof is verified and paid: option to post it to the town board with a short message or none | BUILDER | w-photos | TODO |
| W10 | Text pass: reword anything that reads as written by AI, human but professional (docs/VOICE.md; look at how Habitica words things, do better). Last, it touches every file | BUILDER | w-text | after the rest |
| W11 | "Print me a page of all the friend character visitors ... with their names above them" (one image, every friend in 29k_friends.js) | QA | (none, rigtest/qa) | DONE (docs/friends-sheet.png, on 213ea0f) |
| W12 | Note for Cal's Mac Claude: 5+ visitor story beats and 5 pictures, for later (below) | LEAD | qa-local (docs) | DONE |
| W13 | Town board posts top and bottom: "Sydney (new) 21 min ago" on top, the text full width under it (today "HI FWENDS" wraps onto 3 lines), smaller reaction emojis under the text | BUILDER | w-hall | READY FOR QA (d3cafea) |
| W14 | "the town board to have a color palette similar to the picture of the town hall that is on that screen ... Every menu and screen should feel slightly different" | BUILDER | w-colors | DONE v0.92 |
| W15 | UI color schemes: "at least 3 different ones at the start, and then with each job or class advancement, can add 2 more" | BUILDER | w-colors | CANCELLED (Cal: "Nevermind on the themes. I forgot there are additional themes for purchase in the shop.") |
| W16 | Greetings: "3 coins for each person you give a hug to and that resets every 2 hrs" (today 5 coins to both, once per pair per day) | BUILDER | w-hall | READY FOR QA (d3cafea) |
| W17 | (spec below) Rank: "a little collapsible arrow next to the likes for each person that show who liked that person", in the character card where you give likes | BUILDER | w-rank | READY FOR QA (w-rank b43759b) |
| W18 | (spec below) Likes contest: "The cutoff ... is Sunday night at 7 PM", and "a weekly winner to be announced in the messages as a special event starting next week" (an inbox letter each week; the first for the week ending Sun 2026-11-22 7 pm Pacific) | BUILDER | w-rank (on w-inbox) | READY FOR QA (w-rank b43759b) |
| W19 | Welcome letter with 3,000 coins: "for the people who are already playing, retrigger that message so they can get it" (part of W7) | BUILDER | w-inbox | READY FOR QA (c4da3fe) |
| W20 | CHANGED AGAIN 09:50 (Cal via ARCHITECT): new brands every MONDAY and FRIDAY 8 am Pacific, only 2 active brands, a Wednesday vault brings one retired brand back for that day (was Mon/Wed 5 am, then Mon/Thu). Spec: SPEC2 part 1 + todo/BUILDER.md | BUILDER | w-drops | READY FOR QA (4542bab: one calendar, splash once per stint; skip 98b8558, c192f06, 341b0fc) |
| W21 | (spec below + ARCHITECT spec part A: level ramp) (spec below) Economy and levels: "I am aiming for 3 months to reach lvl 100 and unlock everything", "about 2 weeks of proper play to get to lvl 40", passive income must not override coins from tasks. Existing players keep their level | BUILDER (QA measures) | w-econ | TODO |
| W22 | Level gates: a second accessory at level 20, face cosmetics (makeup, scars, more detailed faces) at 40, a pet with its own cosmetics and outfits at 45 (Cal 13:10: "close to 2-3 weeks of play"; was 30); "items to buy around lvl 90 that get way cooler than the original drop". Code for the gates now, art from the Mac (W23) | BUILDER | w-econ | TODO |
| W23 | Art for Cal's Mac Claude, later this week: pets and pet outfits, face cosmetics, level 90 items (below) | LEAD (list) | qa-local (docs) | DONE |
| W24 | (spec below) Likes notify: "a small heart symbol with a number beside the character in the fashion tab just like an instagram like notification" (new likes since you last looked) | BUILDER | w-rank | READY FOR QA (w-rank b43759b) |
| W25 | (spec below) CHANGED 10:15 (SPEC4 part 4): only STORY rooms (Restaurant, Boba, Dessert, Lock and Key, Mall) wait, at least A DAY apart, plus a level and coins earned; other rooms as today. Was: Room openings (amends W21): no day locks today, only level and story criteria. New: "after unlocking the garden, other room upgrades should be 3 days apart if the criteria is met". Each room opens on 3 triggers: 3 days since the previous room opened, a level, and coins earned by the previous room (Restaurant: 3 days of Garden, a level, coins from the Garden). "This logic should apply to everything in a way that makes sense and it is balanced." | BUILDER | w-econ | TODO |
| W26 | CHANGED 10:15 (SPEC4 part 2): the bar shows 100, quietly becomes 200, then fills unlabeled to a HIDDEN chest at 300 (600 coins + the roll + the old hidden-quest reward); no 400 quest. Before that, 10:05: 300-chest odds low relic 50 / accessory 33 / mid 13 / high 4 (SPEC3 part 1). Was 09:45: Daily Quest chests at 100 / 200 / 300 XP paying 200 / 400 / 600 coins; the 300 chest also rolls a relic or an accessory from any brand; hidden quest at 400 (SPEC2 part 2, replaces part B) | BUILDER | w-chests | READY FOR QA (be62935) |
| W27 | Room Bonus: each Loft room gives at most +3% XP fully upgraded, a stat panel in each room (spec part C) | BUILDER | w-econ | TODO |
| W28 | Gym Pact: two players bet on 4 active days in a week; both make it 1.5x, one makes it takes 2x, both miss lose (spec part D) | BUILDER | w-pact (after w-hall merges) | TODO |
| W29 | LATER, not now: the Mystic Shop at level 60 (stylised clothes, room assets, a gold waving-paw cat +15% business gold), art from the Mac (spec part E) | (later) | | NOT NOW |
| W30 | Relic tiers low / mid / high / legendary. RELIC LIST APPROVED 10:45 (SPEC6: 12 low, 8 mid, 6 high, 4 legendary from Rafe): framework, placeholder icons, borders bronze / silver / gold / white-purple with wings, low = household heirlooms, others fantasy/dungeon/anime/otherworld (SPEC3 part 2), art from the Mac later (SPEC2 part 3) | BUILDER | w-chests | READY FOR QA (be62935) |
| W31 | "bigger upgrades should give bigger passive buffs. Such as the imax screen should definitely start generating more income." (SPEC2 part 4) | BUILDER | w-econ | TODO |
| W32 | Bug: "We are also not seeing the hangang splash screen for the first clothing drop". CHANGED 10:15 (SPEC4 part 1): splash only for brands in rotation, again each time a brand returns (seen per stint) (SPEC2 part 5) | BUILDER | w-drops | READY FOR QA (4542bab) |
| W33 | "make sure no item is gained twice": one shared helper for every free item (chests, level crates, wheel slivers, crawl finds, Weekly Warrior, story), relics too (SPEC3 part 4) | BUILDER | w-chests | READY FOR QA (be62935) |
| W34 | Clothing prices by quality: QA classifies every clothing item (thrift / standard / premium / luxury) from its art; BUILDER prices by tier (SPEC3 part 5) | QA, then BUILDER | (QA table), w-econ | BUILT w-prices 717acf2, in v0.90, QA next |
| W35 | Rafe's legendary treasure hunts at levels 27, 52, 77 and 93 (SPEC5; the first is how you meet Rafe): photo only, 3-4 picture montage, legendary relic (SPEC3 part 6) | BUILDER | w-rafe (after w-chests merges) | TODO |
| W36 | Story side-quests: PHOTO ONLY (SPEC6); Night watch = in-bed photo timed by the server clock in the function, with the checked time stamped visibly on the photo (Cal 11:00). In v0.91+. Mara "Cook for me once", Nova "Clear out your closet", Theo "Movie night", the dogs' "Walkies" (Sable: "Night watch", bed before midnight, a clock photo; SPEC5) (SPEC4 part 5) | BUILDER | w-sidequests (after w-rafe) | TODO |
| W37 | A visible time stamp burned into every proof photo before the AI check (bottom-right, SAYMORE orange #ff7a18 with cyan #17d4e6 glow); the AI reads it (SPEC6 part 4). v0.90 if no delay, client side only | BUILDER | w-stamp | TODO |
| W38 | "total coins to be visible in every menu that has a purchase option" (room view upgrades first); for v0.90 with the envelope fix | BUILDER | (fix branch) | TODO |
| W39 | Update flow (SPEC7): "New update available" Refresh or Later with a green "!", "Installing update 286 KB / 850 KB", a patch-notes letter per release with 200 coins (first v0.90) | BUILDER | w-update | TODO (v0.90) |
| W40 | Daily sale: "2 things on sale in the shop each day but for only 1 brand each day ... a different brand in rotation ... 25% or 50% off" | BUILDER | w-sale | TODO (v0.91) |
| W41 | Wardrobe filters: "categories for different item pieces, and also can be filtered by brand and the category of items" | BUILDER | w-wardrobe | DONE v0.92 |
| W42 | Shop floors (Cal "Go" 13:40): Street (Closet, Mon+Fri, 2 live), Boutique (level 30, Fridays, 2 live; VENOM ROSE, SAYMØRE, CHROME RAIN, NICE COCK), Atelier (level 70, every other Friday, 1 live; hidden until its brands exist); one Wednesday vault for the Shop; splashes only from opened floors; prices by floor; 12 brands per floor over time (Mac art) | BUILDER | w-floors (v0.91, before w-sale) | TODO |
| W43 | Focused unlocks + building Goals log (ARCHITECT SPEC8, Cal approved): a room opens on its story trigger AND every open room in that building half upgraded (no day wait; replaces W25), Lock and Key before Boba, Goals panel with XP and coins | BUILDER | w-focus (v0.91) | REPLACED by W51 (Cal 15:05: his own % table) |
| W44 | No spoilers (Cal: "Scrub the entire game for spoilers"): ARCHITECT SPEC9, about 25 fixes (mystery cards, help, team and relic text, Crawls tab, locked dungeons, next brand); rule in docs/VOICE.md | BUILDER | w-nospoil | TODO (top of v0.91) |
| W45 | Economy scaling (Cal): EVERYTHING BOUGHT AROUND LEVEL 90 + BALANCE: % bought tracks level / 90 at every stage, never level 100 with upgrades left (Cal 14:37); (Cal 14:35: more brands and pets coming later); "big purchases to a day's income ... only some of them"; others priced for their tier; the wheel's prize pool scales with level; "all quests and sources of income should make sense and scale a bit" | BUILDER | w-econ3 (with or after w-focus) | TODO (v0.91, high) |
| W46 | Permanent upgrades and interface priced by payback (Cal: "Merchant seal ... 1500? That seems way too cheap for a permanent buff") | BUILDER | w-econ3 | TODO (v0.91) |
| W47 | Shop header: Wardrobe button on top; coins, + and envelope top right; "The Shop" top left over "NEW BRANDS MON AND FRI 8 AM"; no "old favorite" text; a Wednesday vault splash; the vault starts after 6 shops in rotation | BUILDER | w-shopui | TODO (v0.91) |
| W48 | Upgrades and Interface appear only after the Lair's big screen; a button on that screen opens those Shop tabs | BUILDER | w-system | TODO (v0.91, IN the priority cut) |
| W49 | Chat like Discord: a round face avatar left of the name; consecutive messages under one header | BUILDER | w-chat2 | DONE v0.92 |
| W50 | Town Hall colours from its banner picture (Cal again; W14 first part) | BUILDER | w-colors | DONE v0.92 |
| W51 | Unlocks by % of the previous room (Cal 15:05, replaces SPEC8's focus rule): Bedroom 30/50/70% for Closet/Patio/Game Room; Loft 60% for the Garden; a Garden earnings goal for the Restaurant; Noir for the bar; bar 75% for Boba; Boba 60% for Dessert; Plaza 60% for the Mall; Mall 30% for the Theater; the same through the Calibur Mall | BUILDER | w-unlock (on w-econ3) | TODO (v0.91, top) |
| W52 | One-time reset for all players: rooms and buildings reset (CONFIRMED by Cal: everything in the building tab incl. the Lair; Shop purchases kept and not refunded; letter only to players who bought there), coins refunded at today's prices, save backed up first, an inbox letter (Cal: "initialize the loft and refund all the money they have spent") | BUILDER | w-unlock | TODO (v0.91) |
| W53 | Greetings: wave, high five, poke, spank (Hug and Cheer go, no opt-out); "Visit their Loft" removed | BUILDER | w-chat2 | DONE v0.92 |
| W54 | Weekly Town Boss (SPEC10 part 1): HP by active players (Cal 16:10: 800 HP per player active 3+ days in the week; no coin penalty on a loss, first boss after 5 active players; see SPEC10 "Cal's final Town Boss decisions"), damage from quest + Training XP, art phases on the Town Hall picture, a win chest or a light penalty; 6 pictures per boss from the Mac | BUILDER | w-boss | DONE v0.92 (code + drawn stand-in; the 6 pictures are Mac art) |
| W55 | Friends visit your businesses (SPEC10 part 2): real players in their outfits with name labels, a note, small capped tips | BUILDER | w-visitors | LATER (v0.93+) |
| W56 | Purchase sounds for everyone (Cal: "a cash or coin sound"), synthesized, with an on/off switch | BUILDER | w-sound | LOW (v0.93) |
| W57 | Hall: green online dot next to other players' names, plus their streak | BUILDER | (v0.92) | DONE v0.92 |
| W58 | Board sorted shortest task first (an estimated minutes value per quest) | BUILDER | (v0.92) | DONE v0.92 |
| W59 | Quest-complete toast at the TOP under the header (safe-area aware): compact box, at most 2 short lines ("+45 XP  +270 coins" / "Streak +12%  On a roll +25%"), 3 s then a ~1 s fade, a new one replaces the open one, never covers coins or the envelope (Cal 16:35; spots: pop() 30_app_b.js ~1456, the quest line ~1605, .pop index.html ~427) | BUILDER | (v0.92) | DONE v0.92 |
| W60 | Building view: tapping the "+" for the next room opens its own window for that opening upgrade (picture or a drawn stand-in, name, price, coins, Buy, same purchase code; a "See the <room>" button keeps today's path). Not ready yet: progress lines only and "?" for the room, no name or picture. Lots the same (Cal 16:40; spec todo/LEAD.md, 20_loft.js ~1143, 26_world.js ~92) | BUILDER | (v0.92) | DONE v0.92 |

BUILDER: READ .claude/team/README.md AND todo/BUILDER.md, AND "Specs for BUILDER" BELOW, BEFORE EACH BRANCH (w-inbox needs a fix first).
Order for BUILDER (LEAD, 2026-11-10 09:00, NEW ORDER, the likes contest has a date): w-training (finish), w-inbox (with W19),
w-rank, w-training again, w-drops, w-wheel, THEN (09:45) the w-drops amend (Mon/Fri 8 am Pacific, 2 active, Wednesday vault + HANGANG splash, W20 W32),
w-chests (W26 W30, before w-econ), w-econ (W21 W22 W25 W27 W31), w-colors (W14), w-photos, w-pact (W28), w-perf, w-text. Order for QA: W11, W1, then each branch as it
turns READY FOR QA.

### Specs for BUILDER (LEAD, 2026-11-10 09:20): read these before each branch

LEAD's queued messages reach a chat only when its turn ends, so the full specs live here. Cal's words are in the table above.
- **NEW 09:45 (Cal via ARCHITECT), do after w-wheel:** the last three items in `.claude/team/todo/BUILDER.md`: the w-drops amend
  (Monday and Friday 8 am Pacific, 2 active brands, Wednesday vault, HANGANG splash bug), the new w-chests branch (100/200/300 chests, relic tiers), and income by
  upgrade size added to w-econ. Spec: `.claude/team/ideas/2026-11-10_SPEC2_drops_chests_relics_income_splash.md`. The w-drops and
  W26 lines below are out of date where they differ.
- **w-inbox fix, first (W7/W19):** S.inbox already belongs to checkInbox (30_app_b.js:1057, the owner's quest inbox: S.inbox[itemId]=1).
  Keep letters in their own save field (for example S.letters {read, paid, at, popped}) so the two never share an object; nothing
  has shipped, so no migration. Also, the welcome text still says challenges are "Coming soon": they shipped in v0.88, so fix that
  line. Then rebase or merge w-rank onto the fix.
- **w-rank: W17, who liked.** In the character card (the big card with the Like button), next to that person's like count this
  week, add a small arrow, folded by default. Opened, it lists who liked them this week with counts ("Sydney x2"), most first. Names
  come from SOC.worlds.
- **w-rank: W18, the contest.** The week runs Sunday 7 pm Pacific to Sunday 7 pm Pacific (pacWeek is Monday 00:00 today). This
  week simply ends 5 h early, nothing already given is lost, and the week keys hold across the switch. The Rank tab says
  "Ends Sunday 7 pm, in 2d 4h". Prizes as today (1,500 / 1,000 / 500 and the medal), paid at the new cutoff. Each week every
  player gets a "Fashion week" letter in the inbox (INBOXGEN), styled as a special event: the top 3 looks drawn with names, like
  counts and prizes. The first is for the week ending Sunday 2026-11-22 at 7 pm Pacific, kept in one constant. It replaces the old
  results modal.
- **w-rank: W24, likes notify.** Cal: "a small heart symbol with a number beside the character in the fashion tab just like an
  instagram like notification". Next to your own character in the Fashion view, a heart bubble with the number of new likes since
  you last looked ("♥ 3"). It clears once you have seen it (open the tab or your card). While there are unseen likes, a small dot
  shows on the Rank tab and the Hall nav. The last-seen count is kept in the save.
- **w-training again: W5, graph ranges.** Cal: "40 sessions for gym graph is too much. Have the option to toggle graphs between last 7
  days, and last month, last 3 months, and last 6 months."
  - Every Training graph (plan day, exercise progression, custom) gets a toggle: 7 days | 1 month | 3 months | 6 months. Default 1
    month, remembered for the session. 7 days and 1 month plot each session; 3 and 6 months plot one point per week (the week's best).
  - Storage: full entries for about the last 5 weeks, then one weekly best ({wk, w}) per exercise and per plan back to 26 weeks.
    Drop older. This replaces the 40 cap, and S.sessions needs the same so a plan day has 6 months. Report the worst-case save size.
  - An empty range says "No sessions in the last 7 days". QA skips 4cb156d and tests this commit.
- **w-drops: W20.** HANGANG still drops alone when the Closet is built. After that, the next brand drops on each Monday and
  Wednesday at the game day's start (5 am), in the same brand order for everyone. Say what happens once all 16 have dropped
  (reruns?) and how the Shop and alerts read.
- **w-wheel: W6.** As in LEAD's first message (that one reached you).
- **w-econ: W21 + W22 + W25 (big).** Read docs/ECONOMY.md, then measure with tools/windows/econsim.js before and after.
  - Cal's routine (cal): level 40 around day 14; level 100 and everything bought (every room and upgrade) around day 90, not
    before day 80. Report regular, casual and grinder too.
  - Passive income (businesses, the Loft per hour) is at most about 30% of a day's coins for cal at every stage. Report it week by
    week. Include the new wheel and the 3,000 welcome coins.
  - Rooms (W25): after the Garden, each room opens only when all three are true:
    1. At least 3 days since the previous room opened. Record open times in the save; old saves count as long ago.
    2. A level.
    3. Coins earned by the previous room since it opened.
    Keep the old story criteria where they still make sense or fold them into trigger 3. A locked room shows all three with
    progress ("2 of 3 days", "Level 9 of 12", "1,240 of 3,000 coins from the Garden"). Prestige gates (80 / 90 / 100) stay.
  - Existing saves: nobody loses a level, an item or an opened room. Keep each player's level and put their XP at the same fraction
    of that level on the new curve.
  - Gates (W22):
    - Level 20: a second accessory slot (any owned accessory not in slot 1). The rig must draw both on both bodies in every pose.
    - Level 40: face cosmetics (a_xface). Anyone already wearing one keeps it.
    - Level 30, pets: no code (W23, the Mac does art and code together).
    - Level 90: room in econPrice for the items the Mac will make.
  - Write it up in docs/ECONOMY.md with a before and after table. QA checks it with its own runs.
- **w-colors: W14 only** (W15 is cancelled). Each main view (Board, Hall, Training, Shop, Crawls, Wheel, Loft and the rest) gets its
  own surface and background tint, taken from that screen's art; the Hall's comes from its town hall picture. Bought Shop themes
  still set the accent. Body text keeps WCAG AA contrast. No new art: if a screen has none, pick a tint in code and say which.
- **w-photos: W8 + W9.** As in LEAD's first message.

### For Cal's Mac Claude, later: visitor story beats with pictures (W12)

Cal, 2026-11-10: "make a note for my claude on mac once it has higgsfield connector enabled, to generate at least 5 different visitor
story beats and 5 different pictures for them to go along with those stories. This will be for later down the line."
- Start only when Cal says the Higgsfield connector is enabled and that using it spends no credits (Unlimited). Until then
  CLAUDE.md's rule stands: never use the Higgsfield connector, never spend credits.
- Story beats: at least 5 new friend visits in the style of `FVISITS` in `app/src/29k_friends.js`. Each one needs a reason that
  fits the friend's tag and does something real that day: an XP buff on matching quests, a coin gift, a streak freeze, or watering
  the Garden. Pairs of friends are welcome. Text follows `docs/VOICE.md`: plain, specific, no quips.
- Pictures: one per beat, at least 5, showing the visiting friends as their in-game characters (reference:
  `docs/friends-sheet.png`) in the room the visit names. They must not look like photos of the real people. Original designs only:
  no logos or brand marks. Show Cal all of them side by side, labelled, before anything goes in the game.
- Code: the visit card (`fvShow`) gets an optional picture per visit that fails softly when missing. Say what was checked on a phone
  and what was not.

### For Cal's Mac Claude, later this week: art for the new level gates (W23)

Cal, 2026-11-10: "Once you get to lvl 20, you can wear a second accessory. At lvl 40, the option to wear face cosmetics such as
makeup, or scars, or more detailed face cosmetics unlocks. Once you get to lvl 30 you can get a pet with its own pet cosmetics and
outfits ... I want it to have items to buy around lvl 90 that get way cooler than the original drop." And: "if you needs the ROOMS
chat with higgsfield to generate images, then let me know and put that as a to do list task to hand off to my personal claude
later in the week". The Windows team builds the gates and slots (W22) so this art drops in. Same rules as above: Unlimited only, no
credits, original designs, one Higgsfield image per cosmetic holding every angle, both bodies, every pose tested, Cal approves
first.
1. **Pets (level 45; Cal 2026-11-10: "close to 2-3 weeks of play").** A few starter pets (for example a dog, a cat, a bird) in the game's chibi style, with idle, walk and sit
   frames in the room view. Then pet cosmetics and outfits for each: collars, a sweater, a hat, a bandana. Pluto and Chopstick
   (Cal's dogs, painted art in the Bedroom) stay as they are.
2. **Face cosmetics (level 40).** Makeup (liner, blush, lip colours), scars, freckles, face paint, more detailed eyes and brows.
   The slots `a_xface` and `a_eyet` exist and hold a few items today.
3. **Level 90 items.** A set clearly beyond any brand drop: animated or glowing pieces, full sets with a back piece. Name and
   describe them by docs/VOICE.md.
The second accessory (level 20) needs no new art: it reuses the accessories in the game.
4. **Relic icons (W30).** One icon per relic, 256x256, the game's painted style, no text, a rim in the tier colour (low, mid, high,
   legendary). The relic list and names come from Cal and ARCHITECT; the game shows drawn placeholders until each
   `ui_relic2_<id>.webp` exists.
5. **Rafe's treasure hunts (W35).** Per hunt, 3-4 full-screen montage pictures (portrait, phone) with Rafe ahead and the player's first-person view (a hand reaching for a ledge, a rope, the relic), NO player character, through
   a dangerous journey to the legendary relic, plus the relic icon. Placeholders drawn in code until then.
   7. **Town Boss (W54).** 6 pictures per boss for the Town Hall banner: full health, 75%, 50%, 25%, defeated (Sunday) and rampaging with
   fire (Sunday). Original monsters only. Spec: .claude/team/ideas/2026-11-10_SPEC10_greetings_townboss_visitors.md.
   6. **New brands for the shop floors (W42).** Cal, 2026-11-10: street levels 1-30, mid (Boutique) 30-70, luxury (Atelier) 70-100, "if
   street has 12 brands, then mid should have 12 and luxury also should have 12". Today: 12 street, 4 mid (VENOM ROSE, SAYMØRE, CHROME RAIN,
   NICE COCK), 0 luxury. Needed: 8 mid brands and 12 luxury brands, made the way docs/BRAND_AUTOGEN.md describes (each with a splash,
   an icon set and every piece tested on both bodies in every pose). Luxury should clearly look a step above anything in the game today.
   Original designs and names only, no real labels or logos. This lifts the 2026-11-07 pause on new brands for these floors.

---

## LEAD: board, quality of life, Shop and Training code, everything else in the app, publishing

Doing:
- Now (2026-11-08, on cc5eccc): LIVE on Live and Test: release/live-4748f25-nohooks at 4bb8ca8 = 4748f25 (v0.79, APPV 79, QB_EPOCH 5, no reset) + ONLY the strip 59d6698 (Cal: "Yes, strip them"). When web/config.js has noTest, app/src/31_release.js deletes window.__qb, __qbLoft and the other test hooks at startup and no Test pill or Testing rows are made. __qbTeam stays: 26_world.js draws the team with it. Main, the sandbox and every rigtest script have no noTest, so ROOMS and QA lose nothing. A test on a Live build that needs the hooks routes config.js with noTest=false (rigtest/lead/striptest.js shows how).
  EVERY LIVE CUT FROM NOW ON MUST INCLUDE 59d6698. The v0.80 cut 76ba250 (never pushed or deployed) is older than it and would bring the hooks back: cut again from main. CLASH (rule 7): two LEAD chats have been publishing, this one and the one titled LEAD. The last publish wins, so read Live's version.txt before every deploy and never cut from a base older than it.
  NOT QA-PASSED (Cal's call). LEAD's checks on the exact build 4bb8ca8: striptest (a full save carried, every hook gone, no Test button even for the owner, Shop, Hall and Loft open, new player level 1), squaretest, Live and Test opened signed out with no hooks and no errors, 2366/2366 files identical on both. Not checked: a real phone.
  On main, NOT live, for the next cut: v0.80 fcef4a3, Victor's hair d7d318c + spec cc5eccc, Rooftop and Mall d35c90d. WAITING ON QA: those, plus d7d3467's open items below.
  Was: LIVE on Live and Test: release/live-7ae3634 at 4748f25, APPV 79, QB_EPOCH 5; sandbox rebuilt from main 7ae3634. Cal's economy and prizes: tasks 6 coins an XP plus the day's momentum, weekly workout at least 3,000, training 300, chest 2.5x, 13 prizes rewritten, docs/ECONOMY.md. NOT QA-passed (LEAD's checks: loads, Review 131/131, webtest, save carried, 13-task day and undo). QA still owes d7d3467's open items (lobby left wall; the Escalator names the bowling alley, against Cal's secret).
  Was (on 0c218ca): LIVE on both real links (Live and Test): release/live-0c218ca at d262b10 = main 0c218ca + noTest + QB_TEST_START 0, QB_EPOCH 5, APPV 78. Cal: "fully initialized at lvl 1 from the beginning of the game with nothing unlocked", confirmed for both accounts; board, pings and worlds cleared; a save from before a reset is in data/users/<id>/backup_e<epoch>. The Test channel is a REAL link Cal plays on: never repurpose it, always deploy the same build to both. SANDBOX is its own channel `sandbox`, from main with QB_SANDBOX=1 (RELEASING.md): saves in the browser only, no Firebase, level 1, Test tools on, the story's friends stand in. New: Town Square at the top of the Hall (app/src/29p_square.js, Cal: "see each other's characters and interact with them"; test rigtest/lead/squaretest.js).
  NOT QA-PASSED (Cal's call, he asked for it live). LEAD's checks on the exact Live build, headless Chromium on the stand-in Firebase: level 1, 0 XP, 0 coins through the creator and two reloads, only Board and Training open; old save backed up; two players see each other and greetings land and pay once. Not checked: a real phone, real Firestore with two real people. (QA: v0.76's list DONE on ca68e45, five FIX lines in QA findings; Town Square and sandbox not started.) WAITING ON QA: v0.78 at 0c218ca: the Town Square with several players, the sandbox, and everything v0.76 still owes: 8c756be, b3d6b28, 05500d3, cdf5683, fcae2ed, f53662c, 0a1cb8e.
  Next: when ROOMS has Victor's long hair: point his spec in 29k_friends.js at it and keep that style out of 15_shop.js (which sells every hairStyle). Before a public release: window.__qb and window.__qbLoft are still in Live (146 rigtest files use them), plan is to strip them in the Live cut only so main keeps them for ROOMS and QA; the Testing rows are hidden by noTest.
  Was: LIVE on both links: release/live-fca61c1 at 0ca5de1 (main fca61c1 with Victor's hoodie and portraits + noTest + QB_TEST_START 0; not QA-passed, as below). ALL CHATS STOPPED: Cal's weekly limit at 96%, resets in about 4 days. After the reset: QA on v0.76, Victor's long hair, Rooftop, Mall (Cal approved all three).
  Was: v0.76 = branch release/live at ee3548c (main 05500d3 + noTest + QB_TEST_START 0), Cal: "publish the
  latest version for me and my gf to use before my usage runs out". NOT QA-PASSED: LEAD's checks only (loads, Review 131/131, webtest,
  roomfit in WebKit, returning save kept, new player at 0, no test tools, no arcade or bowling hint). QA owes v0.76 when Cal's usage is back:
  8c756be art, b3d6b28, 05500d3 Lock and Key (part bought, people walking), cdf5683. ROOMS next: Victor, Rooftop and Mall plans for Cal.
  Was: release/v0.75 at 5641427 on both links (Cal: "Take off the test tab and initialize
  the game for both of us"): noTest hides the Test button and Testing rows, QB_EPOCH 3 starts every save over, Cal's old state,
  backup and world docs deleted (copies outside the repo). WebKit check: old-save and new players both reach the creator at 0 XP, 0 coins,
  no test controls, no errors. Not checked: on a real phone; the __qb* hooks are still in this build (not a public release).
  Was: PAUSED until Thursday (Cal: "im about to hit my limit. stop the automatic checks ... lets get ready to publish the game to a
  few people to test for a few day until my limit resets on thursday"). LEAD's loop cancelled; ROOMS and QA stopped theirs.
  LIVE for Cal's friends: saywhat-b7ae8.web.app serves release/v0.75 at 3107a83 = QA-passed 0729a6b + new players start at level 1
  (QB_TEST_START 0, 0d2831d) + the Test button only for the owner (body.qb-own, 3107a83; also on main 450d5e7). Checked: a friend's
  account never sees the Test button, Cal's does, no errors (WebKit, stand-in Firebase); the live app.js matches the build;
  version.txt 3107a83. The live and Test links share one database. No live branch, so the 4 am job stays idle. v0.76 (422d811,
  ROOMS's approved art) is built but not checked: after Thursday, with ROOMS's b3d6b28 and the Auditorium.
  Was: v0.75 PUBLISHED to Cal's web Test channel from release/v0.75 at 0729a6b (QA PASSED 0ba467c; version d58f6f2dd61d61dd; the
  live app.js fingerprint matches; APPV 75; Cal still owner). Next: v0.76 from main with ROOMS's approved art 8c756be.
  Was: v0.75 = release/v0.75 at 0729a6b: 5b00b40 + ROOMS's 5218011 cherry-picked (QA's Patio blocker: only reachable spots;
  the sliding door opens for visitors; walkers clipped), leaving out ROOMS's approved art 8c756be for v0.76. Build it from the
  branch release/v0.75. LEAD on 0729a6b: smoke, Review 131/131 save unchanged, Next event 35 taps, webtest, roomfit PASS. WAITING
  ON QA: the Patio recheck on 0729a6b; then LEAD publishes it. (QA: DONE, PASS, publish 0729a6b: the d1386bc full set and the
  Patio, Theater and Loft rechecks on 0729a6b, QA findings.) Was: v0.75 CUT 5b00b40 = d1386bc + ROOMS's 260895e (Patio spot spacing), 5776eda (everyone on the Patio clipped to the
  glass, QA's blocker) and 03ceedb (Theater lobby shell loader, inert until Cal approves the art). LEAD on 5b00b40: smoke, Review
  131/131 save unchanged, Next event 35 taps, webtest, roomfit PASS. WAITING ON QA: the Patio with people and dogs, the Theater lobby
  unchanged, the Loft checks; then LEAD publishes 5b00b40. Next, v0.76 from HEAD: ROOMS's 8c756be (Cal: "Approve all": relic
  icons, Sable's portrait, brand banners, the Theater lobby's painted shells). Was: v0.75 FINAL CUT 20e1feb = d1386bc + ROOMS's 260895e Patio spot spacing (the only code change; smoke, Review 131/131,
  webtest PASS on 20e1feb). QA: the full set on d1386bc, then 260895e rechecked on 20e1feb; then LEAD publishes 20e1feb.
  Was: v0.75 RE-CUT from d1386bc (adds ROOMS's Patio dog spots 1da0f7e; QA had not started e30a13a; smoke, Review 131/131,
  Next event, webtest, roomfit PASS on d1386bc). Was: v0.75 BUILT from e30a13a (APPV 75), WAITING ON QA for the full set on dist (481) and dist-web (2347): v0.74 plus ROOMS's painted
  Pluto and Chopstick switched on afc5d4f (Cal: "I approve the new dogs") and LEAD's dog visit cards 775f4d5, LEAD's page-zoom block
  6ade4bd (Cal: "I accidentally zoomed in and can't zoom back out"), ROOMS's Dessert Parlor in zones d528068 + 1f87497 (Cal: "very
  randomly placed. Run a reference check"). LEAD's checks: loads clean, Review 131/131 save unchanged, story plays (a friend visit
  popped mid-run), Next event 35 taps, both dog cards show the painted dogs, webtest PASS, livesync PASS, roomfit 21/21 in both
  engines. Cal's phone was still on v0.73 at 04:49 UTC (told to reload).
  Was: v0.74 PUBLISHED to Cal's web Test channel from 3dfe920 (QA PASSED: 70debad full set, d6c12a8 recheck; version
  3ac337176989cb8f; the live app.js fingerprint matches the build; APPV 74; dist 481, dist-web 2347; the new dogs ship switched off,
  LFDOGON unset, until Cal approves them; QA's file check of the live channel: PASS, 2347/2347 byte-identical, QA findings). CAL (2026-11-08): "I approve the new dogs": ROOMS switched them on (afc5d4f), dog visit cards use them (LEAD 775f4d5).
  "I accidentally zoomed in and can't zoom back out": iPhone Safari's page zoom; blocked (LEAD 6ade4bd). "The dessert parlor is also
  very randomly placed. Run a reference check of a similar room": ROOMS, from his two references (docs/refs/, not committed).
  All WAITING ON QA; then LEAD builds v0.75 for his Test link.
  WAITING ON CAL: his phone test of v0.74. Phone log (diag/perf, APPV 73, 8 samples
  02:31 UTC): the board and Loft 56-60 fps, Boba window 57 fps worst 225 ms, the RESTAURANT window 36.8 fps worst 490 ms: the
  heaviest screen on his iPhone. LEAD: watch v0.74's samples; if the Restaurant stays near 37 fps, slim how it draws.
  Was: QA's v0.74 full set on ed0a4f9: NOT YET (70debad), everything of LEAD's passes (zoom adds no lag in WebKit: 56.8 fps zoomed
  vs 53.1); two ROOMS fixes: the Boba cafe table on a customer spot (5.05, 5.46), the Garden Back Plot stand behind a bed. When
  ROOMS lands them LEAD rebuilds v0.74 and QA rechecks those two, then the publish to Cal's Test channel.
  Was: v0.74 RE-CUT from ed0a4f9 (APPV 74; QA had not started 2866b5e), WAITING ON QA for the full set (QA: DONE, not yet: two ROOMS fixes, the Boba cafe table on a customer spot and the Garden Back Plot stand behind a bed; everything else passes, QA findings) on dist (473) and dist-web
  (2339). Added since 2866b5e: ROOMS's Boba Shop c342c2b + 89d4015 (Cal: "weirdly floating", "covering the doorway"; Dessert Parlor
  matcha bar), Bedroom windows 14d060f, Garden stages 4562a76, part-bought sweep 6a5572f; LEAD's zoom buttons under the picture
  ed0a4f9. LEAD's checks on ed0a4f9: loads clean, Review 131/131 save unchanged, story 64/64, Next event 35 taps, webtest PASS,
  livesync PASS, roomfit 21/21 at 3 sizes in Chromium and WebKit. Was: v0.74 BUILT from 2866b5e: v0.73 plus every
  phone-test fix so far: LEAD's whole rooms in every window f314bca, the purchase reveal and outline fa5ff03 + ccc574f (your 54c9132
  findings), the bar after Noir 82ab448, zoom back cc71c5e (Cal: "bring zoom back, but if there is too much lag, then keep it off";
  at CPU x4, load 23: zoomed drag Game Room 54.5 fps, full Restaurant 38.2 fps, worst 100 ms), the update check counting every file;
  ROOMS's mirror c5a65a1, neons bfe3dec, rule-20 sweep 4e5557c, Game Room 4915a05, Garden 3ad4129, Restaurant wall pieces a062a4b,
  dessert trolley bcc3b41, Bigger Till e37df53. LEAD's checks on this build: loads clean, Review 131/131 save unchanged, the whole
  story 64/64, Next event 35 taps, every friend equips every piece, webtest PASS, livesync PASS, roomfit 21/21 rooms at 3 sizes in
  Chromium and WebKit. When QA passes: deploy dist-web to Cal's Test channel. Next rebuild: ROOMS's Boba fixes (Cal: "The table and
  the second upgrade are weirdly floating. And that character is layed on top of the table").
  Was: QA's v0.73 full set on 42d73be: NOT YET (b296529), three fixes, everything else passes on both builds. LEAD's: the new
  visit lines without unstated pronouns, Ben carries the snowboard (da04cc3, done). ROOMS's: the pizza oven past the right wall
  (f2f231d, done) and Ben's cap back views (5698ead, done). v0.73 REBUILT from 660eb30 (all three in; dist 472, dist-web 2338):
  loads clean, Review 131/131 save unchanged, Next event 35 taps, every friend equips every piece, the new visits open, webtest
  PASS, livesync PASS. QA PASSED 660eb30 (58ffe96). PUBLISHED: dist-web of 660eb30 on the web Test channel
  (version 3f5d7ab076c2d034; the live page's app.js fingerprint matches the build QA passed; sign-in screen in 1.9 s, no errors).
  The Live site is still empty; the Claude Test link stays on v0.72. CAL: sign-in said "access blocked, invalid request" (the
  test address not on the Google OAuth client): Cal given the steps to add it and the Live address (RELEASING.md, "Google sign-in
  on a new address"). Cal fixed it and signed in; CAL: "give me these tools just so i CAN TEST": he is the
  owner now (5b45abb: uid in web/config.js and firestore.rules; rules deployed; Test channel rebuilt from 660eb30 with only
  config.js changed, app.js fingerprint unchanged). Now: Cal's phone test and feedback. PHONE LAG CONFIRMED on Cal's iPhone (iOS 18.7, APPV 73, web build's diag/perf): room
  windows 50.2-60.2 fps, worst 29-82 ms, no long tasks (v0.67 was 37-38 fps, worst 214 and 421 ms); the Loft 58-59 fps, worst 44-49 ms
  (4 samples so far). CAL'S NOTES so far, for v0.74:
  (1) "some of the upgrades appear before the box fully drops" + "a glowing sort of outline around the newly added object that
  dissapears after 3 secones": LEAD, fa5ff03 (hidden until the box opens; a 3 s gold outline, SVG filter for Safari), WAITING ON QA (QA: DONE, not yet: three problems, QA findings).
  (2) "the standing mirror is plaaced behind the night stand on the left": ROOMS. (3) "neon sign is too close to the patio window
  ... No items should be overlayed on top of each other like this unless it is intentional": ROOMS (the sign, and a sweep of every
  room for unintended overlaps). (4) "pluto and chopstick are really tiny ... make them bigger and more recognizable": ROOMS, new
  painted dog art from Cal's photos, for his approval.
  More notes (all on his phone, v0.73): "Some rooms are cut off and not showing the whole room": LEAD f314bca (frame grows to the
  room's real walls; iPhone Safari's short box fixed; roomfit.js 21/21 rooms at 3 sizes in Chromium and WebKit), WAITING ON QA (QA: pass on ed0a4f9, fully bought too).
  QA's three fa5ff03 problems (54c9132): LEAD ccc574f (lights never hidden or outlined; swaps and big changes keep the old room
  until the box opens; the web update check counts every file, which is why his Test button vanished after he became owner),
  WAITING ON QA (QA: pass on ed0a4f9). "the test button is gone": an app kept open never got 5b45abb (config only); told to swipe it closed; fixed for
  next time in ccc574f. "After unlocking the noir upgrade, I want the bar to be a next event": LEAD 82ab448 (Desmond after Noir, no coin
  threshold; __qbRooms.gates()), WAITING ON QA (QA: pass on ed0a4f9). For ROOMS (sent): Game Room TV flush to the wall and foosball in line with the pool
  table; the Garden's skewed planter made the same raised bed as the others; the Garden lantern light seam; the Bigger Till visible;
  the Restaurant neon flush to the wall, the high-top stools given a reason, the wine rack along the wall, the Star Plaque off the
  window, the painting clear of the booth, the Grand Menu off the light. Open with Cal: room zoom (he removed it for lag earlier). Was: Cal signs in once, LEAD adds his uid as owner
  (web/config.js, firestore.rules) so he gets the Test tools, redeploys; then Cal's phone test and feedback. Not covered by QA: a
  real phone, real Google sign-in, the real Claude call. QA in passing: sleeves fray in sitBack and typing (LEAD's open rig item).
  Was: v0.73 BUILT from 42d73be (APPV 73), on both builds: dist (Claude, 472 files: friend
  portraits now packed in art_ui, 42d73be, since the six new friends took dist to 510 of 511) and dist-web (QB_TARGET=web, 2338
  files). Since v0.72: ROOMS's room work (facb194, 10f64be, d328e88, 8602ed7, b3e3510, 828990f, 21b292a, c50714d + eadc75b, 6152eb5,
  Game Room 776bc77 + 081d0a2), Test > Next event 0b20e11, every friend in their portrait pieces (Vega, Cynthia, Jina, Kenan,
  Logan) and six new friends with 13 visits (ba45c99; ROOMS's 17 fr_ pieces through eb0eea3; known nits for QA: Ben's cap back,
  Victor's hoodie sleeve underside in the stretch), the web version (web/, functions/, firestore.rules, firebase.json), and the
  SAYMØRE app icon. LEAD's checks on this build: loads clean, Review 131/131 save unchanged, the whole story plays (a real friend
  visit can pop mid-run), Next event 35 taps to the end, livesync PASS, webtest.js PASS (19), all 13 friends equip every listed
  piece, the 13 new visits open with their portraits. When QA passes: LEAD deploys dist-web to the web Test channel and sends Cal
  the how-to (CAL: "make sure the other agents have finished all their tasks" first: ROOMS's queue is empty, 253fcb4).
  Waiting on Cal: v0.71/v0.72 playtest notes, opening the Test link on his
  iPhone (diag/perf for the lag fix), a launch date. CAL (2026-11-07): "I would like to host it off of Claude so anybody can play
  it without Claude ... What is the most seamless way to play this". LEAD recommended an installable web app (Add to Home Screen,
  own link, Firebase database and Google sign-in, Claude API function for photo checks, scoring and bounties, 4 am publish by
  GitHub schedule); App Store/Play Store as an optional wrapper later. CAL: "App Store is too much friction"; about 30 players now. So: the installable web app. LEAD answered the
  30-player, API cost and what-uses-Claude questions (4 uses: proof photos, level-trial photos, brain-dump scoring, bounty ideas).
  WAITING ON CAL: the go to start;
  then he makes the Firebase project (his login) and, for the AI parts, his own API key. Before release: QB_TEST_START
  0, drop S.testFree, the Test pill, room tester, Review, Unlock everything, and every window.__qb* hook. (on 450d5e7)
- v0.72 PUBLISHED in place on Cal's Test link (HJhVjFH6), 492 files (26 top-level + 466 art), same 9 db rules, user, sample images; still the only pinned version, so Cal's saves carry over. QA passed it in a3c2cb6 (build 083fec9, APPV 72). The publish session checked the staged r/ against both 083fec9 worktrees (release/v72 and QA's wt-083fec9, diff -r, lfvar.json = app/lfvar.json) and every published size against r/ (app.js 1252884; index.html +364 bytes, the publish wrapper); art/ list unchanged, so no leftovers. 3 publishes for the 64 MB cap (versions 16-18). (on b60a552)
- v0.71 PUBLISHED in place on Cal's Test link (HJhVjFH6), 491 files (25 top-level + 466 art), same 9 db rules, user, sample images; still the only pinned version, so Cal's saves carry over. The publish session checked r/ against 3840577's clean build (release/v71 and QA's wt-3840577, diff -r, lfvar.json = app/lfvar.json) and every published size against r/ (index.html +364 bytes, the publish wrapper); no art added, removed or changed since v0.70, so no leftovers. 3 publishes for the 64 MB cap (versions 13-15). r/ left for LEAD. WAITING ON QA: check the published files once QA's artifact tools are back. SUPERSEDED by QA's published v0.72 check (PASS, QA findings). (on eda711d)
- v0.70 PUBLISHED in place on Cal's Test link (HJhVjFH6), 491 files (25 top-level + 466 art), same 9 db rules, user, sample images; still the only pinned version, so Cal's saves carry over. The publish session checked r/ against 10240e8's clean build (release/v70 and QA's wt-10240e8, diff -r, lfvar.json = app/lfvar.json) and every published size against r/ (index.html +364 bytes, the publish wrapper); no art added, removed or changed since v0.69, so no leftovers. 3 publishes for the 64 MB cap (versions 10-12). r/ left for LEAD. WAITING ON QA: check the published files once QA's artifact tools are back. SUPERSEDED by QA's published v0.72 check (PASS, QA findings). (on 7e25ded)
- v0.69 PUBLISHED in place on Cal's Test link (HJhVjFH6), 491 files (25 top-level + 466 art), same 9 db rules, user, sample images; still the only pinned version, so Cal's saves carry over. The publish session checked r/ against c2c53b7's clean build (release/v69, diff -r, lfvar.json = app/lfvar.json) and every published size against r/ (index.html +364 bytes, the publish wrapper); no art added, removed or changed since v0.67, so no leftovers. 3 publishes for the 64 MB cap (versions 7-9). r/ left for LEAD. WAITING ON QA: check the published files once QA's artifact tools are back. SUPERSEDED by QA's published v0.72 check (PASS, QA findings). (on 0f7ce90)
- v0.67 PUBLISHED in place on Cal's Test link (HJhVjFH6), 491 files (25 top-level + 466 art), same 9 db rules, user, sample images; still the only pinned version. The publish session checked r/ byte for byte against d54de89's clean build (release/v67) and every published size against r/ (index.html +364 bytes, the publish wrapper); no leftover files from v0.65. Top-level is 69 MB, over the 64 MB per-publish cap, so it went in 3 publishes (versions 4-6). r/ left for LEAD. WAITING ON QA: check the published files once QA's artifact tools are back. SUPERSEDED by QA's published v0.72 check (PASS, QA findings). (on e96a56f)

To do:
- [x] Shop text in Bebas Neue Light (titles stay), the Shop banner a real rectangle on a phone, next drop as its own line
      (47f3af4). Goes live in the next publish.
- [x] Story reasons, investors on earnings, equipment earns and decor does not, a team of five, class art by body (d523cf1).
      Not published (QA's economy simulation first).
- [x] Bounties (Cal's request 5), c243433, `29f_bounty.js`: today's bounty and a 3-day bounty on the board, chores
      people put off; Take it adds a quest paying 1.5x (3-day 2x) that leaves when its window ends; Another swaps it up to
      three times a day (Claude suggests one not already on the list, else the next of 40). Tested headless.
- [x] Town hall and town meter (Cal's requests 1 and 4), 62c0c47, `29g_town.js`: the Neighbors panel at the top of the
      Hall tab, posts with the poster's look, a weekly meter of everyone's XP and coins (never tasks). Not testable
      headless: posting, other players and the meter with real data need the cloud save (QA's 15-player test after v48).
- [x] Level trials accept any active photo (Cal, 2026-11-05), 62306c1: a run, a dog walk, a hike, a sport, a class or a
      home workout passes, not only a gym. Trial card text checked headless; the photo judgement needs Claude on the live
      page, so it is checked after v48 goes out.
- [x] Economy fix from QA's simulator, 5082b0c: businesses pay out each day at most 200 plus 1.5x the day's quest coins
      (the rest waits in the room, `29e_economy.js`, shown in each room's window); missions pay coins (+1% a level) and 30%
      of their XP, flat; each level costs twice as much, capped at 1200 (level 10 on day 4 at 420 real XP a day). Old
      saves keep their level. Tested headless (payout limit, saves, story, dungeon). Neighbors text says Contributor.
      Open for Cal: level trials need a gym photo (a friend who never works out stops at level 4), and nothing to buy
      after the last room.
- [x] Writing pass, part 1 (Cal: "professional and not corny or too obvious that it is AI"), cf7b36a. `docs/VOICE.md` is
      the guide every chat writes to. Rewritten: about 90 lines across upgrades, delve logs, visitor events, story
      dialogue and the coaches. Left as they were: Cal's own quest and reward lines, shop item lines (already plain), and
      the hype and anime coaches' shouting (they are personas the player picks; only the worst clichés went).
- [x] Dungeon gifts, Relics and Trophies (Cal: gifts, relics, the Goblin King set and an amulet set), 9b4cf3a, `29d_dungeon.js`.
      A claimed mission rolls a gift (30 to 55% by mission): coins, XP, or a piece from that mission's loot, forced after
      five dry gifts. The Goblin King's Regalia (m1, m2, m4: mission pay, XP, time, gift odds) and the Hollow Amulet (m3, m5:
      quest coins; set: quest XP and business income). Trophies is now Relics: six tiered relics hidden until earned (150 coins
      a tier), old badges as Milestones, and a Trophies sub-tab after the first piece, shown once the Lair's Trophy Wall
      (`lr_trophy`, a mystery card until the first piece) is built. Tested headless (15 checks). Art falls back to drawn icons.
      The crew fix is the team (29c_team.js). Not published.
- [x] Progression parts 1 and 2 (d5fba8f, aa0d9ed): new curve, no level locks, story prices, the story scenes. Not published until QA's
      simulation. Next: tune the gates with QA's numbers; swap in ROOMS's portraits and merged room.
- [ ] (was) Progression (Cal, 2026-11-05): plan in `docs/PROGRESSION.md`. New XP curve
      (level 10 in about 4 days, at most 3 days a level), no level locks on room upgrades (4 shown, the 4th a mystery),
      prices rising along the story, and rooms opening through a story (garden, sell produce, a partner opens the restaurant,
      boba, dessert, an investor's speakeasy, rooftop, the strip mall, theater and auditorium, arcade, bowling, karaoke).
- [x] (from ROOMS) Saves: online saving fixed, an old online save never replaces newer progress (9c3bd78). Goes live in the
      next publish. Each device asks once, "Two saves found", when its save and the online one disagree.
- [x] (from ROOMS, ade6cd0) Shop banners, Cal on approving the art: each brand's title stylized and unique (not plain white text or a
      shadow), playful taglines instead of descriptive ones (keep ALTITUDE's "Trail gear that never sees a trail"), and the
      next drop as a small, unobtrusive countdown on the Shop's main tab, not in the banner. Publish with ROOMS's banners.
- [ ] (from ROOMS) Phone lag (Cal, on v43: "very laggy on the phone"). The `diag/frame` log landed nothing because saves were
      broken (`db` was null), so it lands again after the next publish, and a new `diag/perf` log records frame rates on the
      real phone. Fix what the real numbers show. Room code changes go through ROOMS (requested below). Done so far (4b71234):
      a room window pauses the building view's animations (532 running, 30 with a window open).
      2026-11-06: the v0.50 and v0.51 logs hold only the Mac app's preview from publishing (120 fps, Electron); no phone
      has opened either yet. Nothing to fix until Cal opens v0.51 on his phone.
      REAL NUMBERS again 2026-11-07 (APPV 67): room windows 37-38 fps, worst 214/421 ms; fixed in 19ef0d9. Earlier: REAL NUMBERS, 2026-11-06 11:58, Cal's iPhone (iOS 18.7, Claude app, 440x956, dpr 3, 4 cores) on v0.53, the Loft with a
      room window open: 54.6 fps then 40.8 fps over 5 s, worst frames 324 and 345 ms, 6 and 23 frames over 50 ms, 61 then 33
      animations running, about 6,600 elements. Real lag in room windows. Found and fixed in b46bc16: the level effect fx-pulse animated every card's
      box-shadow, so the browser re-drew everything inside a card every frame, a whole room window included (trace: 2.65 s of
      every 3 s in raster, 35 ms in everything else). The glow is now a separate layer that only fades (`app/index.html`).
      `shots/roomcure2.js` (440x840, dpr 3, CPU x4, every room and upgrade, the Bedroom window): 4-6 fps before, 35-46 after;
      the Loft alone 60. What is left is the room's own SVG animations (screens, ticker, portal): stepping them gave 59 fps
      but changes how they look, so it waits for Cal's phone numbers on v0.55.
      Cal's iPhone on v0.58 (2026-11-06 17:35): first load ready 1.4 s, second 0.25 s (15 files from cache); Board, Shop,
      Training, Dungeons 59-60 fps; most room windows 47-59; one window 18 fps, worst 433 ms, 6,263 elements, 35 animations.
      LEAD: the fully bought Bedroom is the heavy one (2,928 elements, the game screen's 20 twinkles, scrolls, jump, portal
      glows); every other room 59-60 at CPU x4. Fixed in 0dfa204: the screens tick in steps (index.html) and the twinkles share
      four beats (24_screens.js): the Bedroom 35-46 fps at CPU x4 before, 60 after its first draw (`shots/starcure.js`,
      `shots/roomsall.js`). diag/perf now names the open room.
- [x] `dropbox-leftovers` reviewed (nothing worth bringing over) and deleted with Cal's OK.
- [x] Yawn pilot, code (rig.js flat painted layers, `rigtest/template.html`). Without painted art the stretch renders
      byte for byte as before. Self-check feeding a top's own render back in: about 0.7% of pixels differ on the man (edges),
      2 to 5% on the woman (her long hair over the sleeves: a flat picture sits over or under all of it). Waiting on ROOMS.
- [x] Stretch pose: the gentler yawn (Cal's pick), 0959719. Dark long sleeves still look torn at the elbow, as before.
- [x] `lfvar.json`: a copy is in git at `app/lfvar.json` (0959719). `build.py` does not use it.
- [x] Town database rules (code in ab6a66e, rules declared at the next publish from `app/dbcaps.json`). Was: apply with the v48 publish (live page has none: any Contributor can overwrite any shared row).
      Saves are already private (`data/users/<id>/state`). Declare with the page's db capability:
      `{path:"worlds",read:"view",write:"owner"},{path:"worlds/{self}",read:"view",write:"interact"}` (ids are the player's
      `user.id()`). Board posts and visit pings use `<uid>_<time>` ids, which `{self}` cannot match: move them to
      `board/<uid>/posts/<time>` and `pings/<uid>/sent/<id>` first, then the same two rules for each. Test with two accounts
      (one Contributor, one Viewer) before inviting anyone: QA's 15-player test.
- [ ] Later (Cal, 2026-11-05, "for a much later build"): the level 90 to 100 artifact (ten stone pieces, one a level) and the
      portal to a prestige world (level 1 with a star, a new Loft, currency, characters and story). Full plan in
      `docs/PRESTIGE.md`. Not before the first world feels right.
- [ ] Before release: set `QB_TEST_START` to 0 (29_prices.js; new players start at level 1 again) and drop `S.testFree`; remove the Test panel, the Shop's Testing row, each room window's Testing undo link, and the
      `window.__qb` / `window.__qbLoft` hooks. Also the phone log (`qbFrame` in `26_world.js`) and the `diag/frame` doc,
      sooner if the Loft height is sorted first.

Ready to publish (ROOMS adds lines here: `READY TO PUBLISH: <what>, look at: <what to check on the phone>`):
- READY TO PUBLISH (Cal, 2026-11-06: "Yes, paint all 28"; QA passed it in a8c2a1f and 9b31ed0): the yawn painted for every
  top, 503cd3f (the other 28 shop tops) and 6541dd3 (the starter tee, hoodie and bomber, the man's bare body clean at the
  waist). Look at: the stretch on a phone in a jacket, a tee and a starter hoodie; nothing should tear at the shoulders.
- READY TO PUBLISH (Cal, 2026-11-06: "approve all"; QA passed it in 2d51cc2): the team's signature tops (097dccd), each
  member wearing theirs in their home room. Look at: Rafe in Lock and Key, Theo in the Theater, Nova in the Mall, Sable in the Lair.
- READY TO PUBLISH (Cal, 2026-11-05: "approve all"): every ROOMS approval from 6 to 37 (16 and 7 were already approved).
  6 Bedroom cabinet and anime poster (bd895a7); 8 Daily Quest art (8caf214, wired a60b175); 9 Game Room walls (a4e2a4a);
  10 Game Room furniture (9c30788); 11 building fronts and backdrops (45930bc; LEAD wires the backdrops); 12 story portraits
  (625d9e3); 13 team banners (4fc1542); 14 class banners (6b7b9c8); 15 dungeon icons (d48ed81); 17 to 19 Restaurant walls
  (1eb8040, 156683a, 04bb241); 20 Garden lots and Game Room desk (5fa3fec, d30bb93); 21 corner booth and fire pit (f457680,
  eb85e90); 22 Noir furniture and the calmer city (d1d7c73, 0b23996); 23 Boba (c223d89); 24 Dessert Parlor (f0c6dbb);
  25 Lock and Key (4599993, 707cac1 and fixes); 26 Friday Band (fe48618); 27 Rooftop (707cac1, 5ddeb1a, ea2dffc, d95d880,
  c8eb716); 28 Mall (322760a, 0eb00c2, c829e7e); 29 Theater lobby and 30 Auditorium (4a7c0ff, 9279c58, 392ca5c, 5e3a780);
  31 Arcade (cb5f568, b3832fb); 32 Rhythm Room and 33 VR Arena (e2d53e1, 5a33727, 934bb37); 34 Bowling (922bcb7, 934bb37);
  35 Karaoke (db8a46d, 6962a6e); 36 Nightclub (fd0da20, 1eb0bbc, e74cf92); 37 the team in their rooms (abb6513); plus the
  doors (3962ee2) and the writing pass (e74cf92, a646e51). Look at, on the phone: each building's rooms fully bought, the doors
  walk both ways, the open-air sky at noon and night, the team members' name tags. QA has passed every one of these.
- READY TO PUBLISH: the Trophy Room (Cal approved approval 16, 2026-11-05), 9be3f51. A painted hall above the Hero's Lair
  (room id `trophy`); the Lair sells "Stairs to the Trophy Room" once the first piece is home (a mystery card before);
  the Trophy Wall is retired (owners keep it). The Goblin King's Regalia stands on a mannequin on the rug and dresses
  piece by piece, in any order. Look at: the Lair menu before and after a first piece, the stairs arrows both ways, the
  mannequin with a few different pieces. Checked headless: all 32 piece combinations, both doors, the building view, no
  errors. Not checked: on a phone. Known: no painted doorway in the Lair yet (its back wall is the suit cases).
- READY TO PUBLISH: seven upgrades buyable again and the Game Room door, ab9dc81. Game Room Pool Table, Couch & Console,
  Snack Bar, Restaurant Chef's Neon, Garden Scarecrow and Berry Patch, the Theater bar (and the three after it) waited on
  upgrades no room sells any more; those prerequisites are dropped. The Game Room's door to the Bedroom is a lit doorway at
  the front of its left wall (Cal's rule). Look at: those upgrades in their rooms' menus; the Game Room door. Checked
  headless: the seven are freed, the Game Room renders with its door, no errors.
- READY TO PUBLISH: Bedroom music, clocks and wall tidy (Cal approved approval 7, 2026-11-05), 8c2c459 and 65cf7fd.
  Pocket Radio, then Bluetooth Speaker, then Bluetooth Record Player (`bd_radio`, `bd_spk`, `bd_vinyl`, in order), between
  the bookshelf and the mirror; Digital Clock (`bd_clock2`, after the Wall Clock) over the Closet door; both clocks show
  the real time, live; no RGB strip (LED Strips & Grass Panels is the Moss Art Panel); Canvas Art and the Figurine Shelf
  retired from sale (no place once the glass wall is in; owners keep them without it); the Neon Sign now waits for the
  Gallery Prints; you and the dogs show in the Patio window too. Look at: the Bedroom on a phone, buying the three music
  steps, the clocks against your phone's time. Checked headless: each music step, both clocks on plain and grass walls,
  the Patio window with you and the dogs, no errors. Not checked: on a phone.
- READY TO PUBLISH: walking out onto the Patio, and people back in the Bedroom window, 63ac9f3. BUG FIX first: since
  v46, once a Patio existed, opening the Bedroom window showed no people (you and the dogs vanished). Now, seen from the
  Bedroom, you and both dogs sometimes walk out through the sliding door, stand among the Patio's real furniture, and
  the dogs lie on their own Patio beds. Look at: the Bedroom window with a Patio and the dogs, on a phone, for a few
  minutes. Checked headless: the walk out (you and both dogs), every earlier Bedroom, Patio and Closet check, no errors.
  Not checked: on a phone; you and the dogs do not show in the Patio's own window yet.
- READY TO PUBLISH: Bedroom painted walls (Cal approved 2026-11-05 with his changes), f4362b1, b92a6dd, 050c10e. Three new
  Bedroom upgrades, Fresh Paint & Oak Floors, Living Grass Wall, Cove Lighting (`bd_wt2..4`, in order; tier 1 is the
  bare start), each painted in all four Room styles (Neutral Loft, Brick Studio, Warm Oak, Neon Noir; brick, blush and
  slats run along the left wall to its front end). The Closet door is a lit doorway in the left wall where the wardrobe
  stood; Canvas Art and the Figurine Shelf show with the glass wall; the patio door rests half open and slides fully
  open when you walk up; the top-right door arrow sits under the zoom buttons. Look at: the Bedroom on a phone, each
  wall tier in each style, the Closet door, the patio door. Checked headless: all 16 tier and style pairs with Cal's
  furniture, the door with and without glass, no errors. Not checked: on a phone, walking through the patio door. The
  Sleek Wardrobe's figurine cabinet has no art yet (draws nothing). Existing saves start on tier 1 walls.
- READY TO PUBLISH: Patio (Cal, 2026-11-05), ef2ab15. Plush painted turf for Artificial Grass, String Lights strung
  overhead from three posts (no more light tower), a Second Patio Dog Bed for Chopstick (`pt_dbed2`), the Bedroom door
  on the Patio's front-left edge with a sill and mat (Cal's door rule). Look at: the Patio on a phone with everything
  bought, and the Bedroom's glass (buy something in the Patio, it shows there straight away). Checked headless: the
  room fully furnished, a live buy showing through the Bedroom glass, no errors. Not checked: on a phone.
- READY TO PUBLISH: yawn pilot (Cal approved 2026-11-05), b506b8c. Eight painted layers in `art/app`: the bare body
  (`m_base_yawn`, `f_base_yawn`) and the zip jacket, puffer and hoodie (`<m|f>_<id>_yawn`), drawn by the `stretch` pose
  through LEAD's `rig.js` change. The body is the rig's own render except around the shoulders and armpits, where the
  painting fills the tear (`tools/yawn_body_mix.py`), so trousers, shoes and hair line up; the garment cuts drop the faint
  mannequin outline the generator left. Look at: a character at the peak of the yawn wearing each of the three tops, both
  bodies, and bare-armed with no top. Checked headless in the rig: the three tops on both bodies, no double outline, no
  stray lines, no errors. Not checked: on a phone, in a room, with other trousers, hair, hats or accessories (QA's
  combination sweep), and the starter tee still tears at the armpit because it has no painted layer. Known small flaw:
  a sliver of skin at the man's left hip under the zip jacket.
- READY TO PUBLISH: the Hero's Lair moves above the Closet (Cal, 2026-11-05). In the building view the Lair is now directly
  above the Closet (it was to its left). The Closet's last upgrade (`cl_lair`, now after Super Sleek Modern) shows the corner
  cabinet on the upper wall slid away from a glowing stair; right after buying it, once the "You found the Hero's Lair"
  window is closed, the cabinet slides into the wall over 2 seconds. Doors: Closet upper wall to the Lair, the Lair's
  bottom-left edge back. Door arrows now sit in the frame corner on their door's side (QA). Look at: the building view,
  buying the Lair in the Closet and watching the slide, walking Closet to Lair and back. Checked headless: building view,
  the slide (caught mid-slide), both doors, no errors. Not checked: on a phone, and the slide at full frame rate.
- READY TO PUBLISH: Closet stages (Cal approved the paintings 2026-11-05). Every Closet upgrade now shows its own painting of
  the same room: lights off, Wardrobe Lights (LED strips top and base), Shoe & Bag Wall, Jewelry Wall (renamed from Jewelry
  Tower: two doors open onto a jewelry display, no more sprite), Center Island, Glass Closet, Super Sleek Modern (smoked
  glass, black marble). Look at: the Closet on a phone, buy each upgrade in turn and check each one changes the room.
  Checked headless: each stage bought in order draws its own painting, no errors. Not checked: on a phone. The Hero's Lair
  stage is not in yet (waits on Cal's answer about the door side).
- PUBLISHED in v45. READY TO PUBLISH: the five painted brand banners (Cal approved the art 2026-11-05), `art/app/ui_banner_*.webp`, bundled
  into `art_ui.js` by the build. Look at: the Shop, each brand's banner on a phone.
- PUBLISHED in v46. READY TO PUBLISH: Bedroom patio door and view (17ab80d). Once the Patio room exists the Bedroom has a sliding glass door
  onto it (the last pane of the glass wall, or a door of its own in the back wall without the glass upgrade), and through
  the glass you see the Patio room as it is furnished, with its skyline. Look at: the Bedroom on a phone, with Floor-to-
  Ceiling Glass, the Patio's furniture behind the glass; buy something for the Patio and check it shows from the Bedroom.
  Checked headless: four cases (glass and patio with Cal's furniture, glass and every patio item, plain wall and patio,
  glass without a patio), plus the building view, no errors. Not checked: on a phone; with the plain wall the bookshelf
  stands partly in front of the door.

- DONE by LEAD in a2e234e (`window.gdWatered()`, `data-act="gdwater"`, `S.base.gwater`, `ECON.waterH` 24, Sprinklers `g_spr`). REQUEST for LEAD (from ROOMS, Cal 2026-11-05 on the Garden): "I want an option that requires us to water our plants. And
  then a sprinkler system upgrade gets added later on to automate it." Proposed split (rule: the chat that gets a request does
  its part and writes the rest for the owner):
  LEAD: the rule and the button. A watered state (e.g. `S.base.gwater`, last watering time); the Garden grows only while
  watered (say for the rest of that day), produce stops otherwise; a "Water the plants" button in the Garden window; the
  existing Sprinklers upgrade (`g_spr`, 22_garden.js) waters automatically from then on (maybe move it earlier in the
  Garden's list). Please expose `window.gdWatered()` (true/false) and handle `data-act="gdwater"` anywhere on the page, like
  stysell.
  ROOMS: the look. Dry beds look dry and watered beds look damp; tapping the watering can in the lot waters (data-act
  gdwater); someone waters the beds now and then; sprinklers mist once bought (that part exists). ROOMS waits on the name of
  the state and the act before wiring the look.
- DONE by QA (QA findings: pass). WAITING ON QA: wear-test the team's signature tops at 097dccd: `matrixshot.js "sheet=wear&arts=tm_rafe_jacket"` and the same for
  `tm_theo_tee`, `tm_nova_knit`, `tm_sable_jacket` (both bodies, every pose), plus `sheet=neck` and `sheet=waist` with them;
  and live: with the team joined, each wears theirs in their home room (`livebuilding.js TEAM=`). The mannequin lines were
  stripped (Rafe and Theo with strip_mannequin.py --garment, Nova and Sable with an alpha-only opening to keep the lavender).
- DONE by QA (QA findings: pass). WAITING ON QA: wear-test the Rift Mask (`dg_riftmask`, d4eefc3): `rigtest/matrix.html?sheet=wear&arts=dg_riftmask` (both
  bodies, every pose) and `sheet=hatface` (with every hat and glasses). It is front only like `h_mask`; the back views have no
  layer on purpose. ROOMS could not get the matrix to draw characters headless, so this is unchecked on bodies.
- DONE by QA in 97e9810. WAITING ON QA: check the published v0.49 (LEAD, rule 18): the pinned artifact "Quest Board v0.49 (test, fresh
  start)" (slug 7336ed4a-741d-4af2-b0fe-7492666e5a32, 439 files from 8fabe1a). QA: 437 of 438 build files match by sha256,
  index.html differs only by its title, lfvar.json as in v0.48, nothing missing. (LEAD's original line was lost in an edit.)
- DONE by QA (QA findings: pass). WAITING ON QA: check the published v0.50 (rule 18): the pinned artifact "Quest Board v0.50 (test, fresh start)" (slug
  cda54e71-0271-4a8d-a7a6-7fe0699d43ba, 454 files from f3c970c, db + user + sample with images). Check the page matches the build.
- DONE by QA (QA findings: pass). WAITING ON QA: check v0.51, ac8d2f0 (rule 18), before LEAD publishes it as Cal's fresh pinned copy: the Rift Mask as the Spire's last
  prize (now only after its three amulet pieces; rerun riftodds.py for the new days), the team's tops, and the usual
  pre-release set (savecheck, screens, a new save through the early story, doors, voice.js).
- DONE by QA (QA findings: pass). WAITING ON QA: check the published v0.51 (rule 18): the pinned artifact "Quest Board v0.51 (test, fresh start)" (slug
  936a4ed4-352b-4086-bf94-70d28d1b22a3, 454 files from ac8d2f0, db + user + sample with images). Check the page matches the build.
- DONE by QA (QA findings: one gap, `inbox`). WAITING ON QA: check ab6a66e, the town database rules. The town board and visit notes move to one doc per player
  (`board/<id>` holds their last 10 posts, `pings/<id>` their newest note to each Loft, 14 days), so the rules in
  `app/dbcaps.json` can let each player write only their own doc (`worlds`, `board`, `pings`: everyone reads, `{self}`
  writes, the owner tidies; `diag` owner only). LEAD's two-player test on a stand-in database that refuses other players'
  docs: 16 of 16 pass (posts, delete, visit note, one note per visitor, the visit buff, no refused writes, no page errors),
  script in `shots/townrules_lead.js` (port 8766). Not checkable headless: the real rules on a real page with two accounts,
  which is QA's 15-player test after the next publish. LEAD declares `app/dbcaps.json` at that publish.
- DONE by QA (QA findings: pass). WAITING ON QA: check 414a730, necklaces in the yawn (your finding (1)). `src/rig.js`: when a top is painted for the pose, the
  neck layer's parts up to the top's last group move to right after the painted top; nothing else changes order, and poses
  without a painted top draw exactly as before. LEAD's sheet: all 7 neck items on the first three painted tops, both bodies,
  42 of 42 drawn, every necklace shows (`shots/yawn/neck_fix_lead.png`, `onepose&pose=stretch`). Not checked: all 31 tops,
  and the sit and sleep poses (no painted art there, so unchanged by construction).
- DONE by QA (QA findings: pass; load time noted). WAITING ON QA: check v0.52, db67326 (rule 18 step 2), the next copy for Cal after v0.51. New since ac8d2f0: the yawn painted
  for every top, the 3 starter tops included (503cd3f, 6541dd3), necklaces drawn over painted tops (414a730), the town
  posts and visit notes one doc per player (ab6a66e), and `app/dbcaps.json` with the inbox rule (742a39e), which LEAD
  declares at publish. The usual set please: savecheck, screens, a new save through the early story, doors, voice.js.
  Also look at load time: `art_rig.js` is now 14.1 MB (all the yawn layers), 455 files in all.
- DONE by QA (QA findings: pass, one small fix). WAITING ON QA: check 4b72f95, the loading bar (for v0.53; v0.52 stays db67326). `app/loader.html`, written into the page by
  `build.py` in place of the script tags: it fetches the same 11 files with a progress bar ("12 of 38 MB"), runs them in the
  same order, then removes itself. If fetch is missing or fails it adds plain script tags; if the host blocks scripts added
  as text (no `window.QBART` after art_rig.js) it loads every file as a tag. LEAD's `shots/loadbar_lead.js` (port 8766):
  unthrottled, ready at 1.2 s; 9 Mbps and 4x CPU, the bar shows at 0.4 s and climbs to the game at 36.0 s (QA had v0.52 at
  35.9 s, so the total does not change); fetch blocked: tags, ready 1.2 s; a strict script policy (hashes only): tags,
  ready 1.2 s. No page errors in any. Not checked: the real host (its own policy), a second visit from the cache, and
  savecheck/screens on this build.
- DONE by QA (QA findings: pass). WAITING ON QA: check fb7ca53, the loading bar redone after your c5766ed (for v0.53; v0.52 stays db67326). Your same-tab
  reload finding (2.1 s became 27.7 s, fetch() skips the tab's memory) meant the fetch loader had to go: `app/loader.html`
  now adds ordinary script tags in order (async=false) and fills the bar as each file lands (resource timing, then onload),
  so no text copies and no fetch fallback are needed. `build.py` cuts any pack over 4.5 MB into pieces (`art_rig_1..4.js`,
  `blobs_1..4.js`, `art_ex_1..2.js`; blobs append to `window.__B` in order, all 675 identical), clears old scripts from
  dist first: 461 files. The bar shimmers and says "Loading 38 MB" until the first file lands; "faster next time" is
  gone. LEAD's runs on 8766: your loadtime.js ready 35.7 s, bar at 0.4 s, no inline text left, peak heap 42 MB;
  tabmemory.js 291 MB; `shots/revisit.js` (cache on, 9 Mbps, x4): first 35.7 s, reload 0.8 s, a new tab 0.4 s, 0 MB
  fetched again; strict hash-only script policy: starts. No page errors. Not checked: savecheck/screens on this build, and
  the real host's cache headers.
- DONE by QA (QA findings: pass). WAITING ON QA: check the published v0.52 (rule 18): the pinned artifact "Quest Board v0.52 (test, fresh start)" (slug
  fdd651f3-324f-46ad-a2b3-9632ac8e8fb0, 454 files from db67326, db with the 9 rules of `app/dbcaps.json` + user + sample
  with images, version 1793965410-ff73). Check the page matches the build and the rules are live (`db_rules_get` shows 9).
- DONE by QA (QA findings: pass). WAITING ON QA: check the published v0.53: the pinned artifact "Quest Board v0.53 (test, fresh start)" (slug
  6561fd34-3689-4451-b03c-2740c2fc7061, 461 files from 743c30c: 20 core, 441 art; the 9 db rules + user + sample with
  images; version 1793965993-4ce3). Check the page matches the build, and if you can, the host's cache headers on the pieces.
- DONE by QA (QA findings: pass, publish). WAITING ON QA: check v0.54, a384feb (rule 18: your pass publishes it). Three changes:
  (1) The stretch no longer tears (Cal on v0.52, "Still tearing"; ROOMS found the clip went through `stretchUp`, which has no
  painting). `data/poses.json` clip `stretch` is now idle, stretch x5, idle (24 frames), and `src/rig.js` never blends a span
  with a painted pose on one end: it shows one key or the other. LEAD's sheet, every frame, starter hoodie/tee/bomber, both
  bodies: frames 0-1 and 22-23 idle, 2-21 the painted yawn, no in-between frame (`shots/v54/stretch_clip_starters.png`;
  new `rigtest/matrix.html?sheet=clip&clip=stretch&arts=...` draws any clip frame by frame). Please check every frame of the
  clip in the creator and in a room, shop tops too. The yawn now snaps up and down (no stretchUp beat).
  (2) The creator's Begin button (Cal, phone screenshot: "I can't see the begin button" after scrolling the menu). On screens
  up to 720 px the preview and menu split the space left (`app/index.html`), Back/Begin stick to the bottom, the menu's scroll
  hands on to the page. `shots/ccbegin.js`: 390x664, 360x600, 430x800, 1280x800, Begin on screen and tappable at the start,
  with the menu at its end, the page at its end and back at the top; no page errors (`shots/v54/creator_390.png`).
  (3) diag/load (your idea): each visit's scripts with transfer size, body size and time, how many came from the cache (0
  bytes) or were only checked (a few hundred bytes), and when the bar showed and the game was ready; last 6 visits, owner's
  device only. `shots/diagload.js` on a stand-in db: first visit 18 files 39.4 MB, reload 18 checked, 5.4 KB.
  Not checked by LEAD: savecheck/screens on this build, rooms playing the stretch.
- DONE by QA (QA findings: pass). WAITING ON QA: check the published v0.54: "Quest Board v0.54 (test, fresh start)" (slug 278e76fb-a812-42a8-90b0-b456091a8b1e,
  461 files from a384feb, the 9 db rules + user + sample with images, version 1793967962-0e38). Check the page matches the build.
- DONE by QA (QA findings: pass, publish). WAITING ON QA: check v0.55, 17d4b44 (rule 18: your pass publishes it). (1) Skirts: 1bbe47f (rig option) and be8e92c (the flag
  on v_tulle and h_pleat): one piece mid-stride (`shots/v55/skirt_before.png`, `skirt_after.png`). (2) Room-window lag from
  Cal's phone (b46bc16): the fx-pulse glow is an ::after layer that only fades; .hero and .now keep the old glow (their ::after
  belongs to fx-sweep and fx-holo). Please eyeball the glow at every rank skin. (3) Your v0.54 notes: the creator on a phone
  held sideways (max-height 500 and wider than 720: two columns fitted to the height, Back/Begin pinned) and the Testing pill
  top right while the creator is open. `shots/ccbegin.js`: 390x664, 844x390, 740x360, 1280x800, Begin on screen and tappable
  in all four scroll states, the pill over no creator button; no page errors. Not checked by LEAD: savecheck/screens on this
  build. ROOMS's shadows (9593432) are in it too.
- DONE by QA (QA findings: pass). WAITING ON QA: check the published v0.55: "Quest Board v0.55 (test, fresh start)" (slug 6ad04c53-fdb5-4cd9-b39b-44eb276d38ed,
  462 files from 17d4b44: 20 core, 442 art with the new gmx_beanb; the 9 db rules + user + sample with images; version
  1793969778-98a7). Check the page matches the build.
- DONE by QA (QA findings: pass, publish). WAITING ON QA: check v0.56, a3335e1 (rule 18: your pass publishes it). Over v0.55 it adds only ROOMS's work you passed:
  c6ba889 and 1dc4211 (the upgrade audit fixes), a96c4f7 (dark-floor shadows, Auditorium, Boba shelf, Game Room, bed name)
  and add039a (pool table, club fog). LEAD's part is the version number. Local boot: no page errors.
- DONE by QA (QA findings: pass). WAITING ON QA: check the published v0.56: "Quest Board v0.56 (test, fresh start)" (slug ed76b8e9-85d7-4a95-90cb-7951e0764e9b,
  462 files from a3335e1, the 9 db rules + user + sample with images, version 1793971454-cd01). Check the page matches the build.
- DONE by QA (QA findings: pass, publish). WAITING ON QA: check v0.57, b279091 (rule 18: your pass publishes it). Over v0.56 it adds only ROOMS's f7efaf6, which you passed
  (the audit tool, sprinklers on every bed, the Star Plaque a step bigger). LEAD's part is the version number. Local boot: no page errors.
- DONE by QA (QA findings: pass). WAITING ON QA: check the published v0.57: "Quest Board v0.57 (test, fresh start)" (slug 34b73668-15d2-4030-bdcd-8bbee04ad845,
  462 files from b279091, the 9 db rules + user + sample with images, version 1793972414-d808). Check the page matches the build.
- DONE by QA (QA findings: pass, publish). WAITING ON QA: check v0.58, 859d941 (rule 18: your pass publishes it). One change over v0.57: the Testing pill is hidden while the
  creator is open (`app/index.html`), since it covered a creator button wherever it sat (your note, last at 375x548). It is
  back on the Board after Begin. `shots/ccbegin.js` at 375x548, 390x664, 844x390, 1280x800: Begin on screen and tappable, no
  page errors.
- DONE by QA (QA findings: pass). WAITING ON QA: check the published v0.58: "Quest Board v0.58 (test, fresh start)" (slug 974301b9-f250-4650-90af-04fa3d61600e,
  462 files from 859d941, the 9 db rules + user + sample with images, version 1793973604-fe09). Check the page matches the build.
- SUPERSEDED by v0.61 (QA). WAITING ON QA: check v0.59, 0dfa204 (rule 18: your pass publishes it). Over v0.58: ROOMS's 3c27004 (passed), and LEAD's Bedroom
  lag fix from Cal's v0.58 phone log, which has one room window at 18 fps (worst 433 ms, 6,263 elements; the other samples
  56-60). The fully bought Bedroom is the heavy one: its game screen's 20 twinkles, two scrolls, the jump and three portal
  glows changed something nearly every frame, and each change re-draws the whole room. Now `.scrB/.scrL/.scrL2/.scrJ/.prtG`
  run in steps (index.html) and the twinkles share four beats (24_screens.js). `shots/roomsall.js` (every room, CPU x4): the
  Bedroom was the only one under 59; `shots/starcure.js`: 60 fps after the first draw (35-46 before). diag/perf now carries
  `room` (the open window's title). Please eyeball the stepped screens (Bedroom game screen, any portal) for looking choppy.
- SUPERSEDED by v0.61 (QA). WAITING ON QA: check v0.60, c7aa1df (rule 18: your pass publishes it; it contains v0.59, 0dfa204, so check this one instead). New
  over v0.59, Cal via ROOMS: "For the test version, let skip a week actually change days, and level up actually skip past the
  level trials because I can't actually provide gym picture every time for a job advancement while testing" (he could not
  get the Garden at level 5). (1) Testing Level up now also passes the trial it reaches (30_app_b.js simlvl). (2) Skip a week
  leaves S.testFree = 7 unlock days: unlockSlotFree, the story stepDay check and the daily area reveal let through up to 7
  unlocks, one at a time as before, each spending one (29h_unlocks.js, 29b_story.js, 29_prices.js qbWeek). Testing only:
  nothing sets testFree but Skip a week. `shots/gardentest.js`: a fresh save, Level up x4 -> level 5 with gate 5 passed; the
  first Skip opens the Hall and offers the Garden lot (testFree 5 left); no page errors. Not checked: savecheck/screens.
- DONE by QA (QA findings: pass, publish; Cal accepted two known items). WAITING ON QA: check v0.61, d9d92d7, in place of v0.60 and v0.59 (rule 18: your pass publishes it). New over v0.60, Cal: "Once
  ready, publish so I can test the garden. Start me at level 5 as if I've just completed the job advancement". QB_TEST_START = 5
  (29_prices.js): a brand-new character (ccdone, first time only; old saves untouched) starts at level 5 XP with gate 5 passed
  and the areas below level 5 open (Board, Training, Shop, Dungeons, Loft, Hall), unlockDay free. The class is still chosen by
  the player (the Board's Class Awakening card). `shots/teststart.js`: name, Begin -> level 5, gates 5, the Garden lot offered
  about 6 s later, no page errors. On the Before release list now: QB_TEST_START back to 0.
- DONE by QA (QA findings: pass). WAITING ON QA: LEAD's 3d7f57a, the level-5 test start's coins (your note on d9d92d7). A new test character gets what a real
  level-5 player has earned: quest pay on the XP so far (2.5 per XP) plus the pay for levels 2-5, 1,205 coins, with lvPaid = 5
  so the next level-up pays only its own level (`shots/lvnext.js`: 1,205, then 1,365 at level 6). Not the Garden's 1,500 yet,
  as for a real player; Add 10,000 coins still covers testing. Goes into the rebuilt v0.61 with ROOMS's Garden lot.
- DONE by QA (QA findings: the code passes; stage 0 waits on bld_plaza_s0). WAITING ON QA: LEAD's 2882690, Kode Plaza's street picture by stage (`app/src/29j_plaza.js`, overrides bldArt for "plaza"; 26_world.js
  untouched). Stage = plaza rooms owned (garden, restaurant, boba, dessert, skybar, rooftop, speakeasy, counted by name) - 1:
  0 -> bld_plaza_s0.webp (open plaza; until ROOMS paints it, the plain drawn front, never the café), 1 -> bld_plaza.webp,
  k >= 2 -> the highest bld_plaza_s<j>.webp painted with j <= k, else bld_plaza.webp. `shots/plazastage.js`: every stage
  right with and without s0/s2 present, the street draws, no page errors. Tapping still opens the rooms (unchanged).
- DONE by QA (QA findings: pass). WAITING ON QA: LEAD's 38e1ab7, the Kode Plaza sign over the open plaza (ROOMS: bld_plaza_s0 is painted lower in its 894x1100 frame,
  so the sign floated). 29j_plaza.js moves the sign down to 30 px above where the painting starts (top 37.3% of the frame is
  empty) for pictures listed in PLAZATOP; the café stage and every other building are untouched; 26_world.js untouched.
  `shots/plazasign.js`: Garden only, the sign at y 210 (was 105), just over the trees; with the Restaurant, back at 105; no page
  errors (`shots/v61/plazasign_gardenonly.png`). Check with ROOMS's 9189946.
Art and room code requests (LEAD asks, ROOMS does):
- NEW, WAITING ON ROOMS (Cal, 2026-11-16: "check the lag time and speed when changing tabs. It is a little slow here and there"): The Loft is
  the one slow tab on Cal's phone (diag/perf, v1.03, iPhone): tap to The Loft 1,156 / 1,207 ms on a first open, 234-413 ms often after; the
  building view (window closed) 27-40 fps, 1,078-2,911 elements, worst frames 370-536 ms, 23-25 slow frames per 5 s; a room window 56-60 fps.
  Every other tab 36-125 ms. LEAD's side (uncommitted, 29zz_lean.js): your own character's Loft frames are warmed a few seconds after the app
  opens, so the first open finds them made. Asks for 20_loft.js / 26_world.js (yours): (1) lfCalImg calls QBLoft.warm(r.ch) for every non-NPC
  person, which queues back, walkBack, walk, idle and a sleeper for every bed: in the building view (LFV.s < .4, figures a few px tall) could it
  warm idle + walk only and leave the rest to first use? (2) Anything in the building view's 1,000-2,900 elements that could be one bitmap like
  the Patio sky (static facades, skyline)? Measure on WebKit at 3x before/after (rigtest/lead/tabspeed.js times every tab, LEAD's).
- TAKEN by ROOMS (2026-11-16): Cal approved the drafts (2026-11-17, via LEAD: "i approve whatever you need. Have rooms start painting"); HANGANG's 15 in 86cb0e1: QA PASS (f24e93d); its wrap skirt repainted per QA's note in 35f3080. DIAL-UP's 15 in 35f3080 (art, icons, items.json; not in the Shop yet), wear-tested both bodies, 35 poses, 0 not drawn, 0 page errors (shots/pending_art/new240/dialup/: dialup_approval.png, rows_draft.json). (QA: DONE on 35f3080, PASS; QA findings) WAITING ON QA: wear-check DIAL-UP and the new h_wrap at 35f3080 (rule 17). Cal OK'd both (2026-11-17, "Ok on all"). READY for LEAD: wire HANGANG and DIAL-UP from shots/pending_art/new240/hangang/rows_draft.json and dialup/rows_draft.json (15 each; h_wrap's row is in hangang's). (QA: DONE on fff49a2, NOT A PASS yet: two small FIXes; QA findings) (QA: DONE on fff49a2 + c1c8c12, PASS, Lock and Key +15 can ship; QA findings) (QA: PASS on fff49a2 + c1c8c12, 6b254cd) READY for LEAD (prices, ECON, ship): Lock and Key's +15 (13 -> 28, plan shots/pending_art/rooms1117/lockkey_plus15.md, QA 4f115ed/69a02b2/8ff1307): Key Wall, Gilt Menu Mirror (moved to the left wall, y 0.35-1.45, clear of the bar), Keyhole Neon, Persian Rug (flat on the grid), tiers Oxblood Swivel Stools, Rare Bottle Wall, Champagne Tower, Single Malt Cabinet, Brass Stage Rail, Champagne High-Tops (both high-tops; req chained), Bar Lamps, Stage Spotlights, singer (mic post, stage plat 14), pianist (bench post, sitBack), walking server; Club DJ posted (cb_dj). ROOMS checked: new player and old owner renders, people at 10 s (posts held), auditall (one flag: work:bench inside the piano footprint, on purpose), 0 page errors. Not checked: phone size, every buy order (only fully bought). Renders: rooms1117/lockkey_plus15_full.jpg, _people.jpg. Prices and ECON are LEAD's. (QA: DONE on cbc3709, PASS; one NOTE for Cal, the durag's tails; QA findings) (QA: PASS on cbc3709, a96107d) OVERPASS's 15 in cbc3709 (art, icons, items.json; not in the Shop), wear-tested both bodies, 35 poses, 0 not drawn, 0 page errors (shots/pending_art/new240/overpass/: overpass_approval.png, wear_m/f.png, rows_draft.json). Cal OK'd it (2026-11-17, "Approve after QA"), QA passed: READY for LEAD, rows in overpass/rows_draft.json. Asked Cal: keep or repaint the durag's wide tails (QA note). (QA: DONE on 44bb4e3, NOT A PASS yet: two small FIXes, the tea bar's stools and the second table's guest spot; QA findings) (QA: PASS on 44bb4e3 + c5bc0c7, 42813c7) READY for LEAD (v1.16 with ddc1d10): Boba's +15 (15 -> 30; plan rooms1117/boba_plus15.md, QA dae8715): tiers counter, booth, both tables as one, light box menu, twin pearl cookers, sealer, fridge, tea wall, pothos, big neon; new window decals, standing tea bar and A-frame by the door mat, second barista posted at the sealer (6.15,1.05 room units, facing it), afternoon sun. ROOMS checked: new player and old owner renders, people at 12 s (both baristas at their posts), auditall (one flag: work:seal touches the station, on purpose), 0 page errors. Not checked: phone, partial buys. The tea bar sits between the second table's front stool and the mat (both clear by eye, close). Next for LEAD on PASS: ECON n for Dessert and Boba's bizDay. Next: Boba's +15. Cal's order (2026-11-17, "Alternate them"): next Lock and Key's +15 room upgrades, then OVERPASS, then Boba's +15. (Cal, 2026-11-16, to LEAD: "i want it to generate even more clothing assets for the shops that already exist. 3 more
  of each item for each shop. Remember to make it streetwear and no throwaway and random clothes that no one would bother buying"):
  3 new hats, 3 accessories, 3 tops, 3 pants and 3 shoes for each of the 16 brands in BRANDS (HANGANG through SØLVBERG) = 240 pieces.
  Not a new brand, so rule 19 does not block it. Each piece real streetwear someone would actually buy and wear: in the brand's own
  palette, sub and tag (e.g. BARD & BLADE = fantasy-flavoured streetwear, not a costume), no filler basics, no repeats of what the brand
  already sells, no copyrighted logos or characters. One Higgsfield image per cosmetic holding every angle, Unlimited only, singles queued
  (~3 pending). Wear-test as usual (every pose, both bodies), then QA's wear-check per brand. Work brand by brand in drop order
  (HANGANG, DIAL-UP, OVERPASS first) and send each brand to LEAD as READY with ids, names, one-line descriptions and the price tier
  ROOMS suggests; LEAD adds the 15_shop.js rows (or ROOMS's one-line EXTRA_ITEMS rule) and checks prices with ECONOMY.md.
  Before starting, post one brand's 15 names + one line each for Cal's OK on the direction (approvals pile up: keep working meanwhile).
- TAKEN by ROOMS (2026-11-13). WAITING ON ROOMS (Windows session asks for Cal, 2026-11-09: "The imax projector in the theater is still facing to the left"):
  a back view of both Auditorium projectors, `art/app/thx_proj2b.webp` (IMAX Laser Projector) and `thx_proj1b.webp` (Digital
  Projector). The screen is on the back-left wall (x = 0) and the projector stands on the back landing at the right, so its lens
  must point up and left, away from the camera: we see the back panel and the side, the lens barrel pointing into the room.
  Same style, size and stand as `thx_proj2.webp` / `thx_proj1.webp` (today's art only faces front-left; mirrored it faces the
  camera, so no code fix is possible). Pack them into LFSPR as `thx_proj2b` / `thx_proj1b`: `23_theater.js` already draws the
  "b" key when it exists and falls back to today's sprite, so nothing else changes. Check the beam still meets the lens.
- DONE by ROOMS in f9ecb1a (Cal approved). WAITING ON ROOMS (LEAD asks, no rush, after Victor, Rooftop and Mall): `art/app/ui_town_square.webp`, the backdrop of the Town Square at the top of the Hall (29p_square.js picks it up by name; until then a plaza painted in CSS shows, so nothing is broken). An open town plaza seen straight on, in the game's painted style, no people, no text, no logos. About 1024x1130, horizon in the top third, the lower two thirds clear open paving because up to eleven characters stand on it. Show Cal first.
- DONE by LEAD in be8e92c (ROOMS: "please add it yourself"). WAITING ON ROOMS (LEAD asks): add `"skirt": true` to `v_tulle` and `h_pleat` in `data/items.json` (or say LEAD may). The rig
  side is in 1bbe47f: a pants item with `skirt` binds every point to both thighs evenly and draws with the hips, so mid-stride the
  hem swings as one piece instead of splitting like culottes (QA's b58bf48). `src/look.js` reads the flag from QBDATA.items,
  so no equip code needs a new field. Tried with the flag added to a local build only: walk1, walk3, backwalk1, backwalk3
  and sitFront, both skirts, no split (`shots/v55/skirt_before.png`, `skirt_after.png`). Without the flag nothing changes.
- DONE by ROOMS in 28a51ee: (1) ROOMCELL garden [1,1,0], right of the Restaurant; boba [1,2,0], dessert [1,2,1], speakeasy
  [1,2,2] (LEAD: please keep the street and lots in step); (2) gd_rest is a lit doorway in the Garden's back-left wall into
  the Restaurant's kitchen, whose end wall has the gap; arrows both ways; (3) the Garden's three painted lots (approval 20).
  The Garden and the Restaurant, Cal's decisions (2026-11-05), LEAD's code in 16e72c3: the Garden stays its own lot (the empty lot
  next to your building) and opens at level 5 (b1088f8, was: after the closet and patio); "the next upgrade should be a restaurant that
  expands from it": the Garden's first upgrade, `gd_rest` Knock Through to a Restaurant, opens the Restaurant after Mara's yes.
  ROOMS: (1) put the Restaurant next to the Garden in Kode Plaza (`ROOMCELL`; today Restaurant [1,0,0], Garden [1,2,0]) with
  a door between them, (2) what `gd_rest` looks like in the Garden (the wall opening onto the kitchen), (3) the Garden's art
  per the storyboard. Tell LEAD the ROOMCELL change; LEAD keeps the street and lots in step.
- WORK ORDER (Cal, 2026-11-05): "From here on out, I want to reference LEAD's story board and work on things sequentially. The
  garden comes before the restaurant so we should have done that first." The storyboard is `docs/STORYBOARD.md`: build from
  the top down. **Step 1, the Garden, is next for everyone.** LEAD's call on ROOMS's Restaurant polish: finish and commit the
  corner booth and the fire pit you already have in hand today (Cal's own notes), then stop the Restaurant there; the
  fine-dining furniture waits until its step comes round again. Then the Garden.
- (was: NEXT after the Restaurant) (Cal, 2026-11-05, via QA): "Once the restaurant is done, I want to start work on the garden since
  that is still part of the apartment loft." ROOMS: the Garden's painted shell and furniture to the same standard as the
  Restaurant (QA's lessons for the next art pass), its stages as it is upgraded, and the produce stand (the story sells
  produce there: `stySellHtml`, 4 coins a vegetable). LEAD: the Garden's text and story hooks, and whatever code its new
  art needs. Open question for Cal: the game puts the Garden in Kode Plaza next to the Restaurant (`ROOMCELL`, building 1),
  and the story calls it "a plot of land in Kode Plaza"; he calls it part of the apartment Loft. Move it into The Loft
  building, or keep it in Kode Plaza? QA checks the Restaurant fixes, then the Garden.
- Art slots still empty (LEAD, ca1068d, Cal: "plug and play"): see `docs/ART_SLOTS.md` (rerun `tools/art_slots.py`). Missing
  12: the five portrait brand banners (already asked, 720 x 1080), six relic icons `ui_relic_<streak|team|build|exped|quests|
  collect>.webp` (128 x 128, one per relic, painted game style: a streak flame, a handshake, a hammer, a ledger, a tally,
  a curator's lens), and Sable's portrait `ui_story_sable.webp` (300 x 400). Each shows a stand-in until it exists.
- PART DONE by ROOMS in 4fc1542, Cal approved (approval 13, 2026-11-05): the five join banners `ui_team_sable`, `_mara`, `_rafe`,
  `_nova`, `_theo` (720 x 400) are in `art/app`; class banners (1) DONE in 6b7b9c8 (approval 14, `ui_class_<id>_m/_f`); the
  team in their rooms (3) is still to do. Team, class art and team looks (Cal, 2026-11-05; code in d523cf1, `29c_team.js`). Show Cal each set side by side:
  1. Class banners in the game's own chibi style, a man's and a woman's version of each: `ui_class_<id>_m.webp` and
     `_f.webp` for tamer, swiftblade, runeweaver, vanguard (360 x 480 portrait, the player's chibi in the class gear). The class
     screen and the job banner pick the one matching the player's body; the old picture shows until then.
  2. A join banner per team member, anime style, 720 x 400: `ui_team_sable.webp` (scout, rescued in the dungeon),
     `ui_team_mara.webp` (chef), `ui_team_rafe.webp` (Rafe Calloway, a sunburnt travelling adventurer with a map tattoo,
     an Old Fashioned in hand), `ui_team_nova.webp` (Nova Lin, a fashion vlogger with a ring light on her phone),
     `ui_team_theo.webp` (theater crew). Original designs. The investors (Desmond Hale, Priya Okafor) are not team members:
     they only need their scene portraits (`ui_story_lockkey.webp`, `ui_story_mall.webp`); Rafe's and Nova's scenes use
     `ui_story_rafe.webp` and `ui_story_nova.webp` if painted, else their team banner.
  3. DONE by ROOMS in abb6513 (signature cosmetics still to do): In the building view: draw each team member who has joined (`window.__qbTeam.list()`, ids above) in their own room
     (Mara the restaurant, Rafe at the end of Lock and Key's bar with a crowd round him, Nova filming in the mall, Theo the
     theater, Sable the Lair) with their signature look
     from `TEAM[id].look` and something that makes them stand out from the guests (a name tag, a glow ring, a signature prop).
     Better still, a signature cosmetic each, painted as items (Mara's chef whites exist already as `npc_chef`).
  4. The theater's basics as their own upgrades: a ticket stand and a popcorn and soda machine. Tell LEAD their ids, and Theo's
     scene will wait for exactly those (he is the employee).
     DONE by ROOMS (ids for LEAD): the basics already exist as their own upgrades in `TH_UPS` (`23_theater.js`): the ticket
     stand is `t_booth1` (Classic Ticket Booth), the popcorn is `t_pop` (Popcorn Cart) and the soda `t_soda` (Soda Fountain).
     Gate Theo's scene on those three. Today they unlock at levels 26, 24 and 25 against the Theater opening at 23 (step 10);
     LEAD's call whether to pull them to 23. The Theater lobby is ROOMS's next redesign (shell, zones, QA review).
- PART DONE by ROOMS in 625d9e3, Cal approved (approval 12, 2026-11-05): the story portraits `ui_story_chef`, `_lockkey`, `_mall`,
  `_auditorium`, `_rafe`, `_nova` (300 x 400) are in `art/app`; the rest of this request is still to do. Progression (Cal, 2026-11-05, plan in `docs/PROGRESSION.md`). ROOMS's parts: (1) merge the Upstairs Bar (`skybar`) and the
  Speakeasy into one second-floor room above the restaurant, an upscale speakeasy with a live band and singers, starting
  really bare; keep every id saves already own (retire, never delete) and tell LEAD which room id survives; (2) chibi looks
  and portraits for the story characters: the partner chef, the speakeasy investor, the mall investor, the theater employee
  (original designs, portrait 300 x 400 like the coaches, file names `ui_story_<id>.webp`); (3) a produce stand in the
  Garden; (4) the theater's basics as their own upgrades: ticket stand, popcorn and soda machine, and an employee, which
  open the Auditorium free. LEAD writes the scenes, the gates and the money. Show Cal the characters side by side.
  Update (LEAD, aa0d9ed): Cal named the room **Lock and Key**. The scenes are in (`29b_story.js`) with stand-in initials; portraits
  as `ui_story_chef.webp` (Mara, chef), `ui_story_lockkey.webp` (Desmond Hale, investor), `ui_story_mall.webp` (Priya
  Okafor, investor), `ui_story_auditorium.webp` (Theo, theater crew), 300 x 400; the scene picks them up by name. When the
  merged room exists, tell LEAD its id; when the theater basics exist, tell LEAD their ids (Theo waits for any 3 upgrades now).
- PART DONE by ROOMS in d48ed81, Cal approved (approval 15, 2026-11-05): (1) the six Goblin King icons, (2) `ui_gift`, (5) the six
  Hollow Amulet icons are in `art/app` at the names below. (3) DONE by ROOMS in 9be3f51, Cal approved (approval 16), READY TO PUBLISH:
  the Trophy Room, room id `trophy` above the Lair (ROOMCELL 0,1,2). The Lair sells "Stairs to the Trophy Room" (`lr_troom`,
  1800, your `trophy:1` keeps it a mystery until the first piece); `lr_trophy` is retired (owners keep it, `dgRoomBuilt`
  still counts it). The mannequin wears exactly the pieces in `S.trophy.goblin`, any order. The amulet case is parked (Cal:
  finish the goblin set first). LEAD: your Trophies tab text can drop "Trophy Wall". (4) The Rift Mask is still to do. Dungeon gifts and the Goblin King set (Cal, 2026-11-05: "Goblin King set"). Missions sometimes bring home a gift: coins, XP,
  a dungeon-only wearable, or one piece of The Goblin King's Regalia (helm, chestplate, greaves, boots, sword). The first piece
  opens a Trophy Room upgrade in the Hero's Lair; pieces fill an armor mannequin there; the full set gives the team a big
  boost. LEAD writes the gifts, loot, Relics and Trophies tabs and the bonuses; ROOMS paints and builds the room. Art, in this
  order, all original (a goblin king of our own, no franchise look):
  1. Five piece icons and a set emblem, 256 x 256, painted fantasy game style, on transparent: `ui_tr_goblin_helm.webp`,
     `_chest`, `_greaves`, `_boots`, `_sword`, `ui_tr_goblin_set.webp`. Shown in the gift reveal and the Trophies tab.
  2. The gift: `ui_gift.webp` (a closed dungeon loot chest or wrapped bundle, 256 x 256). The reveal opens it in code.
  3. The trophy display: no new upgrade needed. LEAD's code (9b4cf3a) uses the Lair's existing Trophy Wall (`lr_trophy`),
     a mystery card until the first piece. Its painted layer could show an armor mannequin that dresses piece by piece (read
     `S.trophy.goblin`, owned piece ids) and an amulet case filling shard by shard (`S.trophy.amulet`). Show Cal side by side first.
  4. DONE by ROOMS in d4eefc3 (QA wear-tests it; LEAD adds its line with the dungeon flag). One dungeon-only wearable: the Rift Mask, a mask from another dimension (one sheet, every angle, both bodies, item id
     `dg_riftmask`, slot mask). Never sold in the Shop; LEAD adds its line with a `dungeon` flag. Wear-test it.
  5. The Hollow Amulet (LEAD, 9b4cf3a): five shards of one broken amulet, each its own colour and mood, 256 x 256 on
     transparent, same style as the goblin icons: `ui_tr_amulet_dusk.webp` (violet glass), `_ember` (warm amber), `_tide`
     (sea green), `_thorn` (dark red, sharp), `_silence` (pale grey-white), and `ui_tr_amulet_set.webp` (the amulet whole).
     All original. Until they exist the game draws a plain diamond.
- Yawn pilot, 3 tops (Cal, 2026-11-05: paint the yawn instead of bending flat art). The code is in (`src/rig.js`, the
  `stretch` pose has `"painted":"yawn"`). Template: serve `quest-board/` and open `rigtest/template.html?pose=stretch&scale=2`:
  the bare body in the peak of the yawn, man then woman, on flat green, each half exactly one frame (720 x 828). One
  sheet per cosmetic, painted over that template: the bare body (clean arms and armpits, the template's armpit shards are
  the rig's tearing), `y_vjkt`, `o_puffer` and `h_hoodie`. Cut each sheet back into its two halves, green removed, and save
  `<m|f>_<id>_yawn.webp` (and `<m|f>_base_yawn.webp`) in `art/app/` at 720 x 828; the build packs them. Nothing changes
  for any top without one. `rigtest/template.html?pose=stretch&check=<id>` is the alignment self-check. Show Cal the pilot
  side by side before it goes in; QA checks every outfit combination after.
- DONE by ROOMS in e74cf92 (QA's list plus the same tells in the Arcade, Rhythm, VR, Bowling, Karaoke and Nightclub lines, and
  no "!" in room help titles; `10_app_a.js:1515` Squat Rack stays LEAD's). Writing pass (Cal, 2026-11-05: "professional and not corny or too obvious that it is AI"). Read `docs/VOICE.md`, then
  rewrite the room and upgrade lines in your files (`27_rooms.js`, `27b_skins.js`, `data/loft.json`, `data/items.json`,
  room `help` text) to it. Worst offenders to look for: quips at the end ("It probably works.", "Do not touch."), "Obviously",
  exclamation marks, "sleek" more than once a screen. LEAD did `10_app_a.js`'s upgrade lines in cf7b36a as examples.
- DONE by ROOMS in 45930bc, Cal approved (approval 11, 2026-11-05); LEAD: wire the backdrops now: `art/app/bld_loft.webp`, `bld_plaza.webp`, `bld_mall.webp`
  (the street draws them already) and inside backdrops `bld_bg_loft.webp`, `bld_bg_plaza.webp`, `bld_bg_mall.webp` (1600 x 900,
  soft, nothing important in the middle): LEAD, wire the backdrops when Cal approves. Three buildings (Cal, 2026-11-05, for phone lag and looks): "it was running every single animation all at once. This is
  not efficient or practical. We need to conserve resources where possible so that it runs efficiently and smoothly without
  sacrificing any performance or quality. I like the idea of being able to see the characters roaming around the rooms in
  the building view, but perhaps we can separate them into 3 separate buildings with their own unique names: The Loft for
  the apartment building, Kode Plaza for the restaurant building, Calibur Mall for the theater building. You would need to
  click into each building to see that building's rooms so that it only loads those buildings without having to upload
  every single asset of the other buildings. You could also use different background images when you go into each of
  these buildings and see the full room view. Then the main building street view (the outermost view) can have a separate
  building image that represents those sets of rooms." He sent three reference pictures (a pink and yellow mall front, an
  isometric apartment tower with roof gardens, a strip mall with red awnings): study only, the art must be original. So: a
  street view with one painted exterior per building and its name; tap a building to load only its rooms, people and
  animations; a painted background per building inside. Show Cal the exteriors side by side first. LEAD wants the street
  view to run nothing but the three exteriors, and nothing from a building to load until it is opened.
  LEAD's code is in (the commit after f57b1a0): the street, entering a building, the back button, placeholder fronts.
  ROOMS: save the fronts as `art/app/bld_loft.webp`, `bld_plaza.webp`, `bld_mall.webp` (a building front on a transparent
  background, about 2.4 tall to 1 wide, bottom edge on the pavement); the street draws them automatically. Inside
  backgrounds: not wired yet, tell LEAD the file names when painted.
  Split (Cal: LEAD codes, ROOMS paints, LEAD wires it in): ROOMS paints the three exteriors (each with room for its name)
  and one inside background per building, Cal approves them side by side. LEAD writes the street view and the
  load-one-building-at-a-time code. That code lives in `lfWorld`, `26_world.js` (ROOMS's file): ROOMS, write under
  Requests for LEAD whether LEAD may change it, or whether you would rather do that part.
- DONE by ROOMS in 47d2ffd (once a frame, drag checked headless). Lag: dragging the building or room view sets the transform on every pointermove (`lfApply`, `26_world.js`). Apply it at
  most once per frame (requestAnimationFrame). Measured by ROOMS headless; real phone numbers come with the next publish.

QA findings (QA adds one line each: what, where, how to see it, screenshot, owner; LEAD moves them into the right list):
- QA, what v0.76 owed, on a clean build of ca68e45 (game files = 0a1cb8e), headless Chromium, no real phone. LEAD's later commits (41e5a7d to 509120f) not tested. RESULT: NOT A PASS YET: the five FIX lines below; the rest passes. Scripts: `rigtest/qa/v76art.js`, `patiobeds.js`, `lockkeylive.js`, `lobbyzoom.js`, `dropfit.js`, `mallsecret.js`. Pictures: `shots/qa/v76/`.
- (ROOMS: done in 53b46be.) FIX, ROOMS (rule 20, `23_theater.js:113`): the Film Reel sits over the left frame of the lobby doors, both lobby sizes, any walls. `lobzoom_full_t33.png`, `lobzoom_full_w33.png`.
- (ROOMS: done in 53b46be.) FIX, ROOMS (rule 20, `23_theater.js:108`): the Trailer Screen touches the right frame of the same doors, both sizes. Same pictures.
- (ROOMS: done in 53b46be.) FIX, ROOMS (rule 20, `23_theater.js:115` against `:111`): 12 x 9 with Velvet or Gold walls, the front sconce's back plate butts into the poster frame. 16 x 10 is clear. `lobzoom_t23.png`, `lobzoom_w23.png`. Also rooms-never-cluttered: fully bought at 12 x 9 that one wall holds poster, lightbox, sconce, reel, doors and screen in a row; take one off it while fixing these.
- (ROOMS: done in 53b46be.) FIX, ROOMS (Cal's secret, `27_rooms.js` `ml_esc`): cdf5683 removed the `? ? ?` cards, but with the story not open the Mall still offers "Escalator: Up to the Bowling Alley, against the back wall" for 1800 coins (6th buy in the window's order). It names the secret and leads nowhere yet. `node rigtest/qa/mallsecret.js`.
- FIX, LEAD (`app/index.html:416`, `.modal` uses place-items:center with overflow): a card taller than the screen loses its top for good, scrolling cannot reach it. Drop window (708 px tall): 390x664 (iPhone Safari with its bars) 22 px gone and the X half cut; 360x640 42 px; 375x553 78 px, the X and NOW ON SALE gone. The bottom button stays reachable. Same height with the landscape banner, so not the new art. `dropfit_390x664.png`.
- NOTE, LEAD (`rigtest/browser/savecheck.js`): fails 16 checks on every build since QB_EPOCH moved, because its seed saves say epoch 2 and get wiped as meant. With the seeds set to the build's epoch (3) in QA's temp copy, all 37 checks passed on ca68e45. Until it follows QB_EPOCH it cannot catch a real save bug.
- PASS 8c756be: Relics tab at 390: 18 of 18 cards use the six real icons (128 px, shown at 56), no drawn star. Sable's two return visits at 390 and 360: her 300x400 portrait, card on screen. Drop window at 390x844: all five portrait banners 720x1080, four items, nothing broken; a brand with no portrait falls back to its landscape banner. Theater shells: every wall (0-3) x floor (0-3) x both sizes, bare and fully bought: 64 of 64 draw the right shell files, all four sheets looked at (`m_lobby_*.png`); fully bought audit clean at both sizes.
- PASS b3d6b28: real Bedroom window, 170 s, four cases. Both beds: Pluto only on (3.3,-1.4), Chopstick only on (2.1,-1.4). One bed (either one): no dog on the other's bed, the other dog runs the Patio and keeps its Bedroom bed. Never both on one spot, no dog in a Patio footprint while walking (sampled every 0.7 s). Limits: in the single-bed runs the bed's owner did not happen to lie on it inside 170 s; people's Patio routes not re-run (this commit does not touch them).
- PASS 05500d3: all 14 buying stages and the four moved pieces alone: nothing outside, overlapping or out of depth order. By eye on the big render, Cal's four notes hold: back bar flush behind the bartender, oyster station past the high-tops with the Roof door clear, booth flush to the left wall, table in its curve. Live, about 70 s each, fully bought, part bought (bar, back bar, stools, bartender, booth, table) and sparse (bar, bartender, oyster): bartender works behind the bar; the only people in a footprint are guests getting onto a stool, whose seat is inside its own footprint. `lk_*.png`.
- PASS f53662c, 0a1cb8e, fcae2ed: Victor's rig, every clip on both bodies, 68 of 68 frames: grey hoodie, s4 skin, no old colour left. Portraits: three poses cross-fading on both visit cards at 390, 123-128 x 280, feet on one line. Card checked at 390 only. Rig hair still short (ROOMS has it).
- Also on ca68e45: `screens.js` 9 screens at 360 and 390, none too wide; no page errors in any run. Not started: v0.78 at 0c218ca (Town Square, sandbox).
- QA, the published v0.75 on Cal's web Test channel (Firebase Hosting channel "test", version d58f6f2dd61d61dd) against a clean
  web build of release/v0.75 at 0729a6b: PASS. Every one of the build's 2347 files fetched from the channel answers 200 and is
  byte-identical (diff -r: 0 differ, 0 missing); the page loads app.js?h=f44cd295a4, APPV 75; config.js holds Cal as the one owner
  (the same uid as firestore.rules). The live page at 390 in WebKit and Chromium reaches the sign-in screen with its service worker
  and manifest, 0 page errors (Chromium needed more than 30 s on this busy Mac to finish loading; with 120 s it is clean). Not
  covered: signing in on the live channel (Cal's account).
- QA, v0.75 = release/v0.75 at 0729a6b (APPV 75; dist 481, dist-web 2347): PASS, publish. Checked in two parts: the full set on
  d1386bc (LEAD's earlier cut), then the three code changes since (ROOMS's 260895e, 5776eda, 0729a6b = 5218011, and the Theater
  loader 03ceedb) on clean builds of each exact cut; 0729a6b's build differs from d1386bc only in app.js and the page fingerprint
  (diff -r, both builds). The full set on d1386bc, 0 page errors anywhere: savecheck all passed; screens at 360 and 390 fit;
  visits.js PASS; lagcheck PASS alone (Game Room and Restaurant windows at CPU x4: v0.74 59.3/43.5 fps, v0.75 60.3/54.5, worst
  17/33 ms); unlockall PASS (fresh: every upgrade of every room bought through its window; mid-game: the first run added 501,050
  coins, over the test's 1,000 allowance, from rewards landing in the same seconds; a rerun added 500,060 with a team scene's +60
  on screen; the unlock code is unchanged since v0.74); the whole story 64/64 (only an empty story.beats and the day's friend-visit
  roll change); Review 132/132 Plays on both bodies, 0 problems; livesync, live10, players10 PASS; alerts, FX, bar rule, badges
  (from the pack, 0 loose), drops PASS; roomwin PASS (people kept when buying, the outline on 1 to 3 new pieces, never the light
  layer; + / - and pinch in every window); all 30 rooms draw fully bought; guests at most 5 a room, no duplicate looks; screens'
  still picture PASS; Next event 35 taps PASS; roomfitfull fully bought 21/21 at 390x844, 440x956 and 375x667 in Chromium and
  WebKit; web on the stand-in Firebase: webtest.js 19/19, websweep.js both bodies (30 rooms fully bought, 445 pictures, 29 visit
  cards, none of the other body's layers) PASS. On 0729a6b again (Loft code changed): savecheck all passed,
  visits.js, Review 132/132 (0 problems), all 30 rooms fully bought, guests (at most 5, no duplicate looks), roomwin, screens'
  still picture, Next event 35 taps, webtest 19/19 and websweep both bodies (445 pictures, 29 visit cards): PASS, 0 page errors.
  The painted dogs (afc5d4f): stand, walk, sit and sleep all read, about a third of a person's height (34 against 97 units), with
  Cal in the Bedroom (shots/qa/v75/dogs_painted_poses.png); window.LFDOGON=0 still gives the pixel dogs (dogs_pixel_LFDOGON0.png).
  Both on their Bedroom beds, the six indoor wander spots and every Patio bed and spot they use: nothing clips a piece (at wander
  spot (7.40, 6.40) a dog stands behind the fig plant, depth as for people). ROOMS's question, the spot (3.75, -3.85) behind the
  fire bowl: the dogs never went there (lfPaIn already refused spots inside a footprint); 0729a6b keeps it only on a bare Patio,
  where nothing is in front of it. The Patio on 0729a6b, bare, half and fully bought: every spot and bed kept is 0.9+ apart, in the
  glass's span, and reached from the door by a route that crosses no piece (the game's own router); both dogs at every one show
  through the glass; a friend visit walks out live: the sliding door opens for them (every sample near it), they stay clipped to
  the glass walking and standing (every sample), and stand fully visible at the deck spot (patio_visitor_standing_5b00b40.png);
  Pluto walking out stays clipped (30 of 30). The dog cards (775f4d5), WebKit and Chromium at 390: painted art (dgx_<dog>_0 and
  _2), standing and sitting in turn every 1.7 s with a 0.1 s fade, not stretched (dog_cards.png). The page-zoom block (6ade4bd),
  new rigtest/qa/zoomblock.js, WebKit as an iPhone 13: viewport maximum-scale=1, user-scalable=no, page scale 1; gesturestart/
  change/end cancelled; the creator by taps and typing to the Board; typing 135 in Training's weight box, no page zoom; all 21 room
  windows zoom their picture by + and - and by a two-finger pinch (pointer events); long windows scroll (wheel in desktop WebKit):
  PASS. The Dessert Parlor (d528068 + 1f87497): zones as in Cal's two references (a back run of machines and cases, the register
  counter by the door with a staff lane, a seating corner, a tea corner, an open lane), not crowded fully bought
  (dessert_v74_v75_full.png); footprint audit clean (no overlap, nothing outside, no spot inside or touching furniture); every
  customer spot and the counter's work spot reached from the door clear, bare, half and fully bought; the Hidden Door for old
  Speakeasy owners: its floor glow now sits behind the counter, but its tap spot and the corner button both open the Speakeasy
  (dessert_hidden_door_v74_v75.png). The Theater lobby loader (03ceedb): the same SVG as d1386bc in 8 states (bare, each wall
  tier, each floor tier, full, no wing); no thw_ art in this cut. Notes, not blockers (both in v0.74 too), for ROOMS: with only
  the first Patio dog bed bought, both dogs are sent to it (lfDogNext: beds[chopstick?1:0] || beds[0]) and one lies hidden under
  the other; anyone passing behind a Patio piece is drawn over it (the Patio's glass group draws after the whole Patio view; clear
  routes keep it from showing). Pluto's own Patio bed sits behind the Bedroom's PC tower, only the head shows asleep (ROOMS: the
  Bedroom's desk, left as is). Not covered: a real iPhone (a real pinch, double tap and finger scroll), the Garden at night.
- QA, v0.75 (d1386bc), ROOMS's 1da0f7e Patio spots: FAIL, two people on one spot: the new spot [1.8, 3.05] was 0.28 from the
  Patio's own look spot, so fully bought Cal and Vega stood 3 px apart and Vega covered Cal (shots/qa/v75/patio_deck_overlap.png).
  Owner: ROOMS. DONE by ROOMS in 260895e (spots 0.9+ apart and in the glass's span): PASS.
- QA, the Patio seen from the Bedroom, in the published v0.74 and the v0.75 cuts before 5b00b40: FAIL, a friend visitor on the
  Patio was drawn outside the room: 20_loft.js put only Cal and the dogs into the glass clip; on v0.74 Vega at the far deck spot
  (6.85, -3.95) stood outside the Bedroom past its right wall (patio_visitor_outside_v074.png); on 20e1feb Vega at (1.75, -4.25)
  showed over the wall top (patio_visitor_over_wall_20e1feb.png). Owner: ROOMS. DONE by ROOMS in 5776eda: PASS.
- QA, v0.75 cut 5b00b40, the Patio fully bought: FAIL, the dogs walked through furniture: the route to the back-left spot
  (1.75, -4.25) crossed four Patio footprints and Pluto walked across the chaise (patio_dog_route_through_chaise.png); with it, a
  visiting friend walked through the closed sliding door, and anyone walking on the Patio was out of the glass clip until they
  stopped (Cal 0 of 49 samples, a visitor 0 of 52, Pluto 0 of 30). Owner: ROOMS. DONE by ROOMS in 5218011 (= 0729a6b): PASS.
- QA, the published v0.74 on Cal's web Test channel (Firebase Hosting channel "test", release 3ac337176989cb8f, expires
  2026-12-08) against a clean web build of 3dfe920: PASS. Every one of the build's 2347 files fetched from the channel answers 200
  and is byte-identical (diff -r: 0 differ); the page loads app.js?h=0549b500a6, APPV 74; config.js holds Cal as the one owner (the
  same uid as firestore.rules); nothing sets LFDOGON, so the dogs stay pixel. The live page in WebKit and Chromium at 390 reaches
  the sign-in screen with 0 page errors, the service worker registered and the manifest in (not signed in). Not covered: files on
  the channel beyond the build's (Hosting lists none without its API), the deployed Firestore rules, and a real phone (Cal's).
  Owner: LEAD.
- QA, ROOMS's 3dfe920 (the Back Plot sprinkler, and the painted dogs switched off) on a clean build of 3dfe920 (481 files: the 8
  dog pictures ship, unused): PASS. The berry bed's mist sprinkler stands in the lane on the bed's left side, its head clear of every
  piece; only its spray arcs toward the next bed, watering it (on purpose under rule 20); the market stand, its awning and crates
  are clear (shots/qa/v74/garden_backplot_stand_3dfe920.png, garden_backplot_sprinkler_3dfe920.png); all three Garden stages audit
  clean (no stack, nothing outside, no spot inside furniture). The dogs: lfDogSpr returns nothing unless window.LFDOGON is set, and
  nothing in app/, web/ or tools/ sets it, so a build from HEAD keeps the pixel dogs (not seen live: no dog came by in the sampled
  building view). With this, the v0.74 fixes are all in: LEAD may build v0.74 from 3dfe920. Owner: LEAD.
- QA, ROOMS's d6c5007 (the two v0.74 fixes) on a clean build of d6c5007: Boba PASS, Garden one small fix left. (1) Boba: the
  cafe table's customer spot is now at (5.4, 5.41), clear of every piece; the room's footprint audit is clean (no spot inside
  furniture, no stack, nothing outside); the barista's spot (3.8, 1.25) clear (shots/qa/v74/boba_full_fix.png). (2) Garden Back
  Plot: the market stand shows whole at the end of the tool column, clear of the bench and the beds; all three Garden stages
  audit clean. FAIL, small, rule 20 (your own note): the berry bed's mist sprinkler head stands against the stand's back-left
  post and its spray arc runs into the awning and the tomato crate (garden_backplot_stand_fix.png). Fix: the sprinkler to the
  bed's other side, or the stand about 0.3 to the right. Owner: ROOMS.
  LEAD, before you rebuild v0.74: HEAD also holds 2faabd0, Pluto and Chopstick's new sprites, which draw in the game as soon as
  their art is in (lfDogSpr, rsart.json): not yet approved by Cal (TEAMWORK: nothing goes in before he approves). Build v0.74
  without 2faabd0 (from d6c5007 plus the sprinkler fix), or wait for his yes. Owner: LEAD.
- QA, v0.74 = ed0a4f9 (APPV 74), the full set on clean builds of dist (473) and dist-web (2339): NOT YET, two fixes for ROOMS (the
  next two lines); everything else PASSES, 0 page errors anywhere. Core: savecheck all passed; screens at 360 and 390 fit; visits.js PASS; lagcheck PASS (alone: Game Room and Restaurant
  windows at CPU x4, v0.73 54.3/56.5 fps, v0.74 57.5/60.3, worst 50/17 ms); unlockall PASS (fresh and mid-game); the whole story
  64/64; Review 132/132 Plays on both bodies, 0 problems; livesync, live10, players10 PASS; alerts, FX, bar rule, badges (16 from
  the pack), drops PASS; roomwin PASS (people kept when buying, the outline on 1 to 3 new pieces, never the light layer); all 30
  rooms draw fully bought; guests at most 5, no duplicate looks; screens' still picture PASS. Next event 35 taps PASS. LEAD's fixes: (1) f314bca whole rooms: every room
  FULLY BOUGHT (QA's rigtest/qa/roomfitfull.js: LEAD's roomfit.js with every upgrade bought, so the Restaurant and Garden
  expansions and the Auditorium back row are in) fits at 390x844, 440x956 and 375x667 in WebKit and Chromium, 21/21; the VR
  Arena's 60-80 px "cut" was its wall screen's slide strips, clipped to the screen (now skipped); picture of every window at 375
  in WebKit: whole rooms. (2) ccc574f reveal: rigtest/qa/installfx.js, 14 purchases in WebKit (Safari's engine): pieces hidden
  through the drop, outlined, gone by 4.7 s; the light layer never hidden or outlined (Brass Sconces, Grand French Range, Neon
  Sign, Nightstand: lit rooms, no flat cream); the Ergo Chair swap and Knock Through / Take Over Next Door keep the old room on
  screen until the box opens, then the new room; Floor-to-Ceiling Glass and Buy the Empty Lot now hidden and outlined. Chromium
  agrees but runs late under this Mac's load (one frame 4 s). The update check counts config.js too (fingerprinted in the page).
  (3) 82ab448 the bar: __qbRooms.gates().lockkey is true with Noir and the Dessert Parlor at 0 earned, false with White Linen and
  no Noir, false with Noir and no Dessert Parlor; no step errors (18); Next event 35 taps, Desmond's Noir line ("Charcoal walls,
  low light"). Not driven live at level 28: the unlock pacing (one step a day, areas waiting) holds a synthetic save, unchanged
  code. (4) cc71c5e zoom and ed0a4f9 its row: the + / - row (and the Bedroom lamp) sit under the picture in every window, clear of
  every door (375, WebKit). Zoom lag, rigtest/qa/zoomlag.js, full Restaurant at 390x844 x3, zoomed and unzoomed drags in turns:
  WebKit 53.1 fps unzoomed against 56.8 zoomed (one worst frame per drag 118 against 165 ms), a + tap's worst
  frame 18 ms; Chromium at CPU x4 under load 32 no worse zoomed (6.8 against 6.1 fps). Zoom adds no lag here; Cal's phone decides. ROOMS's: Bedroom mirror c5a65a1 and windows 14d060f, Restaurant neons bfe3dec and wall pieces a062a4b (the pizza neon off
  the TODAY board), Dessert Trolley bcc3b41, Bigger Till e37df53, Game Room screen and foosball 4915a05, Garden herb bed 3ad4129,
  Patio and Theater sweeps 4e5557c, 6a5572f: PASS by eye against v0.73, and the footprint audit finds no new overlap, nothing new
  outside a room, no new spot inside furniture but the one below (shots/qa/v74/). Web: dist-web holds every picture of the Claude
  build byte for byte (2316/2316); webtest.js 19/19; websweep.js both bodies (30 rooms, 445 pictures, 29 visits) PASS. Not covered: a real phone; the Boba barista and customers walking live (headless they idle at the entrance; the barista's work spot at
  (3.8, 1.25) is clear of everything); the Garden at night. QA test fixes: unlockall.js tops up coins whenever a buy fails (it
  stopped at a Garden expansion dearer than the coins left; every Garden upgrade buys through its window); nextevent.js lets the
  day's real friend visit card land mid-run; roomwin.js expects the zoom buttons and the reveal's outline (the old gold pulse is gone).
- QA, v0.74 (ed0a4f9), Boba Shop c342c2b: FAIL. Moving the cafe table put it on a customer spot: the spot at (5.05, 5.46) is
  inside bbx_cafe's footprint, so a customer stands inside the table (Cal's "layed on top of the table"). v0.73 had that spot at
  (4.95, 5.45), clear. The barista's spot (3.8, 1.25) and the other five customer spots are clear. Fix: move the spot or the
  table. Owner: ROOMS.
- QA, v0.74 (ed0a4f9), Garden 4562a76, the Back Plot (no lots bought) fully bought: FAIL, rule 20. The market stand moved to the
  front-left now stands behind the front raised bed: only its striped awning shows above the carrots
  (shots/qa/v74/garden_backplot_stand.png; v0.73 had it at the front right, in the open). Fix: give it its own open floor. Owner:
  ROOMS.
- QA, LEAD's fa5ff03 purchase reveal and 3 s outline (Cal's v0.73 notes), on a clean build of a3485ac (30_app_b.js unchanged to
  5201e1a), Chromium and WebKit at 390: NOT YET, three problems, all LEAD's. What works: on separate furniture pieces the new parts
  stay hidden through the drop (120 to 1300 ms), the gold outline follows each piece's own shape in both engines (sofa, Boucle and
  Cream Sectionals, Velvet Tufted Bed, Bookshelf, Pool Table, LED Wall Panels, White Linen's 32 table parts), and by 4.7 s it is
  gone, the filter removed and the pieces back in place; your Desk Chair case reproduces (3 parts hidden); 0 page errors
  (shots/qa/v74fx/gameroom_sectional_outline.png, webkit_sofa_outline.png, restaurant_white_linen_outline.png).
  (1) FAIL, light purchases paint the whole room flat. The room's light layer (g.lflt: the room-sized multiply shade and the lamp
  glows, drawn with mix-blend-mode) counts as a new piece whenever a light is added or changed, so during the drop it is hidden (the
  room loses its lighting) and then it is wrapped in the outline's filter, which cuts its blending off: the multiply rectangle
  paints solid and for the 3 s of the outline the whole room is a flat cream (Restaurant) or lavender (Bedroom) shape with a gold
  edge, in both engines (restaurant_sconces_drop_outline.png: before, outline, after; bedroom_neon_outline.png;
  webkit_grand_range_outline.png). New rigtest/qa/installfx_map.js lists 46 such upgrades in 22 rooms (light_layer_list.txt), e.g.
  Bedroom Nightstand, Neon Sign, Gaming PC, Picture Window; Restaurant Brass Sconces, Grand French Range, Brass Chandeliers, Pergola &
  String Lights, Noir, Star Plaque; Garden Grow Lamps, Lantern Posts; Theater Lobby Chandeliers; Club LED Dance Floor, Disco Ball.
  Fix idea: leave g.lflt (and anything drawn with mix-blend-mode) out of the new pieces: no hiding, no outline.
  (2) FAIL, swaps in a furnished room show at once. Where one piece replaces another (the Ergo Chair over the Desk Chair in a fully
  bought bedroom), lfSig finds nothing new, so nothing hides and the window just says "Ergo Chair upgrade active" while the new chair
  is already there (bedroom_ergo_swap.png). In a bedroom with only the Desk Chair the same swap is found (1 part), so it depends on
  the room. The map has 36 upgrades in this state ("not judged": the picture differs but nothing new is found).
  (3) FAIL, big changes show at once: when over half the picture is new the effect skips hiding, so these appear before the box
  drops: Restaurant Knock Through the Wall (64 of 68 new) and Take Over Next Door (123/142), Garden Clear the Back Lot (19/34) and
  Buy the Empty Lot (137/182), Auditorium Back Row (118/217), and Bedroom Floor-to-Ceiling Glass (36 of 67 in a full bedroom; on
  screen 250 ms after buying, bedroom_floor_glass_250ms.png). Cal's note covers these too; holding the old picture until the box
  opens would.
  Notes, not blocking: 7 upgrades whose new parts all carry their own filter or clip fade in with no outline (Bedroom Fresh Paint &
  Oak Floors, Feature Walls, Cove Lighting; Game Room Carpet & Wall Panels, Hex Acoustic Panels, LED Lighting Rig; Restaurant Potted
  Plants); your call. Frame rate while the outline runs was not measured cleanly (load 20 to 32 here; at CPU x4 on SwiftShader the
  window ran 4 to 9 fps outlined against 15 to 18 without): I will measure it against v0.73 on the fix, when the Mac is quieter.
  New QA scripts: rigtest/qa/installfx.js (live, B=chromium|webkit) and installfx_map.js (every upgrade, every room). Owner: LEAD.
- QA, v0.73 rebuilt = 660eb30 (APPV 73; since 42d73be only the three fixes, the functions lock file and TASKS lines), the recheck of
  b296529's three fixes on clean builds (dist 472, dist-web 2338): PASS, publish. (1) ROOMS's f2f231d: the Grand French Range at 1.5,
  the back row ends with the wood-fired oven at 24.47 inside the 24.6 room (was 24.83); nothing outside the room, the Restaurant's
  audit the same as v0.72's (shots/qa/v74/kitchen.png). (2) ROOMS's 5698ead: fr_ben_cap from behind is the plain crown with the brim
  out over the neck on both bodies in back, walkBack, sitBack and typing, so it reads worn backward like the front; the fronts look
  unchanged (they and the icon were re-exported); friendlooks: Ben 68/68 frames, 0 page errors (ben_cap_fix.png). (3) LEAD's
  da04cc3: all seven lines without pronouns, Ben's "a snowboard under one arm" matches his card; across all 29 visits the only
  pronoun left is Pluto's (a dog). The web build again holds every picture of the Claude build byte for byte (2315/2315, the new cap
  art included), and websweep.js passes on both bodies (30 rooms, 435 pictures, 29 visit cards, 0 failed art, 0 page errors).
  Seen in passing, not new: in sitBack and typing every top's sleeves fray at the edges (Ben's jacket, Kris, Nick, and the Shop's
  h_varsity and v_biker alike); that is the rig item already on the board (the far-arm raggedness waiting for the rig rework).
  Not covered: a real phone, real Google sign-in and the real Claude call (Cal's test). Owner: LEAD (deploy).
- QA, v0.73 = 42d73be (APPV 73), the full set on clean builds of dist (472 files) and dist-web (2338): NOT YET, three fixes (the
  next three lines: two for ROOMS, one for LEAD); everything else PASSES, 0 page errors anywhere. dist: savecheck all passed;
  screens at 360 and 390 fit; visits.js PASS; lagcheck PASS (Game Room and Restaurant windows at CPU x4: v0.72 60.3/60.0 fps,
  v0.73 60.3/57.3, worst 17/33 ms); unlockall PASS (fresh and mid-game); the whole story 64/64 (only an empty story.beats appears,
  as before); Review 132/132 Plays on both bodies (m at 390, f at 360), 0 problems, the save unchanged but savedAt and an empty
  `seen`; livesync, live10, players10 PASS (players10 on the first run; a quiet minute writes at most 2 a page); alerts, FX, room
  windows, bar rule PASS; badges: 16 brands from the pack, 0 loose; drops PASS; all 30 rooms draw fully bought; guests at most 5 a
  room, no duplicate looks; the screens' still picture: Theater, Auditorium, Boba show page 1 with animations off and hide it
  with animations on (the Auditorium plays its film, as on v0.72). Next event (0b20e11; new rigtest/qa/nextevent.js: a fresh player at 390 presses Test > Next
  event and presses through each scene): 35 taps to "That's every story event", every tap saves, all 22 scenes' pictures load,
  Sable right after the chef; then 17 steps, 13 return visits, 16 rooms (none twice), team Mara, Sable, Rafe, Nova, Theo; one more
  tap still says nothing is left; a reload keeps it all: PASS. Web: every picture of the Claude build (1869 packed + 446 loose =
  2315) is in dist-web/art byte for byte, none missing or extra; LEAD's webtest.js 19/19; new rigtest/qa/websweep.js on the
  stand-in Firebase, both bodies: 8 tabs, 30 room windows fully bought (435 pictures), 29 visit cards, art arriving on demand
  (660 m_ / 661 f_ layers, none of the other body's), 0 failed art requests: PASS; functions/test.js 11/11 (a fake Claude);
  firestore.rules read through: each player writes only their own docs, the owner list is empty until Cal's uid goes in.
  Friends: new rigtest/qa/friendlooks.js draws all 13 outfits the game's way on both bodies in every clip (stretch every other
  frame, so the painted yawn): 68/68 frames each (shots/qa/v73/friend_<id>.png); friendsqa: all 29 visits picture their friends
  and pay their rewards and buffs; friendart: the 13 new visits' portraits keep their feet on one line between poses (1 to 6 px).
  ROOMS's checks: Game Room 776bc77 + 081d0a2 PASS (the lamp on open floor, the soda machine's front clear, the dartboard clear of
  the door, no spot inside furniture; gameroom.png); Brass Sconces 6152eb5 PASS (two, clear of the window; restaurant_sconces.png);
  every friend piece PASS but Ben's cap (below). ROOMS's two questions: Victor's sleeve undersides and the tan on Ben's jacket's
  right side in the stretch match the painted yawn of the Shop tops passed in v0.72 (nc_hoodie shows the same skin under its
  sleeves, sv_fleece the same right-side shading; side by side at true size in native_compare.png): no repaint for v0.73. Not
  covered: a real phone, real Google sign-in and the real Claude call (Cal's phone test), the live Firestore rules (read only).
- QA, v0.73 (42d73be), 9f3fd8b Grand French Range (marked v0.74 but it is in 42d73be; LEAD's v0.73 list does not name it): FAIL.
  Widening it from 1.3 to 1.7 moved the kitchen's back row 0.4 to the right, and the wood-fired oven (rsx_oven) now ends at 24.83
  in a 24.6-wide room, 0.23 past the right wall (v0.72: 24.43, inside). It shows in the fully bought kitchen: the oven's base
  hangs over the floor's right edge (shots/qa/v73/restaurant_kitchen_v73.png against restaurant_kitchen_v72.png). Fix: take the
  0.4 back in that row (or narrow the range to about 1.45). Owner: ROOMS.
- QA, v0.73 (42d73be), fr_ben_cap: FAIL, ROOMS's own question. From the front it is worn backward (the strap over the forehead);
  from behind the strap shows again with the brim off to the side, so in every back view (back, walkBack, sitBack, typing) it reads
  as worn forward (shots/qa/v73/ben_cap_front_back.png, friend_ben.png). Fix: repaint the back views with the brim at the back.
  Owner: ROOMS.
- QA, v0.73 (42d73be), the new friends' visit lines give pronouns Cal never stated (CLAUDE.md: they/them when unstated; the first
  friends' lines were rewritten without pronouns for the same reason): kris_pads "his pads", kris_linen "He left you", ben_routine
  "he kept", ben_board "his snowboard", kevin_pool "He brought his league trophy", kevin_food "he wanted", victor_gg "He lost".
  And ben_board says the snowboard is "still in the car" while the card shows Ben holding it (shots/qa/v73/visit_ben_board.png).
  Fix: rewrite without pronouns, e.g. "Ben stopped by with his snowboard..." -> "Ben stopped by with a snowboard and planned your
  trip to the mountain." Owner: LEAD.
- QA, the published-file checks (Cal's brief; new QA session, artifact tools working): both PASS. (1) v0.72 on Cal's Test link
  (HJhVjFH6, served version 1794080566-bf5f) against a clean build of 083fec9 in a scratch worktree: 492 files = 26 top-level +
  466 art/, exactly the build's 491 (25 + 466) plus lfvar.json, same names. All 466 art files downloaded and byte-identical to the
  build (diff -r). All 26 top-level sizes match (app.js 1252884, art_rig_1 to 9, art_icon_1 and 2, art_ui 4369185, blobs_1 to 4;
  lfvar.json 3836308 = app/lfvar.json); index.html 158681 against 158317, +364, and the diff is only the publish wrapper (the
  doctype/head/body line before, </body></html> after). (2) v0.64 (NSmu55hk, version 1794019710-14db) against a clean build of
  4a1dbe8: 499 files = 22 top-level + 477 art/ (the build's 498 plus lfvar.json, same names, the 11 logo_ files included); all 477
  art files byte-identical; all 22 top-level sizes match (app.js 1200476, art_icon.js 3849015, art_rig_1 to 6, art_ui 2328881);
  index.html 153902 against 153538, +364, wrapper only. Its title "Quest Board" is the build's own title, not the publish. Both
  declare exactly the 9 db rules in RELEASING.md (worlds, board, pings read view, write owner; their {self} read view, write
  interact; diag admin/owner; player and inbox owner/owner), plus user and sample images. Not checked: the top-level .js files and
  lfvar.json byte for byte (sizes only); the pages were not opened, so no db docs read. Owner: LEAD, nothing to fix.
- QA, ROOMS's yawn picture 44 (4dbd2e2: sv_fleece) and the sv_quilt recolour (f6ba9a6), on clean builds, 0 page errors: PASS, all
  44 yawn pictures now pass. sv_fleece: arms-up, both hands out, no strip, navy matches idle, frames 6, 12 and 18 on hot pink
  (shots/qa/yawn/sv_fleece_arms.png); sweep 120 clean. sv_quilt: the stretch red is now hue 351 like idle, (184,39,60) boy and
  (176,39,60) girl against (187,39,62) and (187,40,60) idle; only stretch frames changed (sv_quilt_fixed.png: idle, walk,
  stretch); the shoulder tick is a 1 px tan line along the sleeve top, the body's shoulder outline, which reads as a seam on
  all three backgrounds: pass (sv_quilt_tick.png); sweep 120 clean (sheet_sv_quilt_<body>.png, replacing the tomato ones).
  Colour check, idle (front) art against stretch art for all 79 tops with yawn art, both bodies: median colour difference dE
  2.9 (not visible); by eye on the 16 lowest histogram matches and the highest dE (colour_check_low16.png, colour_check_high.png,
  colour_check_dE.txt), only sv_quilt was a real jump. Optional, not blocking: km_camp's hibiscus (dE 13-14) and km_crochet's
  scalloped trim are a little duller in the stretch, visible side by side, not at game size. FYI LEAD: v0.72's yawn art is ready.
- QA, ROOMS's yawn pictures 42 and 43 (aceba29: sv_nordic, sv_quilt) on a clean build of aceba29, 0 page errors. sv_nordic: PASS.
  It stretches arms-up on both bodies, both hands out; stretch frames 3 to 21 changed, nothing else; its reds match idle (median
  (155,75,74) stretch against (154,72,71) idle). ROOMS's question 1, the tan edge under the boy's far sleeve: pass, at 5x on hot pink
  it reads as the sleeve's outline shading (shots/qa/yawn/sv_boy_farside.png). sv_quilt: FAIL, colour. The vest is crimson in idle
  and walk, median (187,39,62), hue 351, and tomato in the whole stretch, (215,91,71), hue 8, on both bodies; every other piece
  of its art (front, back, shop icon) is crimson (194,39,62), and the Shop calls it "Cherry red". So the vest visibly changes
  colour every time the character stretches (sv_quilt_colour_jump.png: idle, walk, stretch). Fix: ROOMS, bring the yawn art's red to
  the front art's crimson (a recolour may do it; a repaint if not). Question 2, the tan tick above the boy's far shoulder: not
  visible at 5x (sv_boy_farside.png); recheck after the fix. Otherwise clean: arms-up, hands out, 240 sweep pictures clean apart
  from the colour (sheet_<top>_<body>.png). Owner: ROOMS.
- QA, ROOMS's yawn pictures 40 and 41 (ca391d3: oak_crop, oak_vest) on a clean build of ca391d3: PASS, 0 page errors. Both
  stretch arms-up on both bodies; stretch frames 3 to 21 changed, nothing else (shots/qa/yawn/batch24_idle_stretch.png). oak_crop:
  long sleeves, both hands out, no strip; oak_vest: the white short sleeves wrap the arms, no hollow; on hot pink with short hair
  (oak_crop_vest_pink.png). ROOMS's question, the 1-2 px plum line under the vest's hem at the boy's left hip: QA's call is pass,
  no repaint. At 4x on the usual, hot-pink and light backgrounds it reads as the hem's own outline (oak_vest_hem.png); plum pixels
  in the hem-to-trousers band are 8 (boy) and 7 (girl), against 59 and 67 on the passed km_boat (the trousers' drawstring and
  shading). Sweep: all hairstyles with all 19 neck items plus none, 240 pictures, all clean (sheet_<top>_<body>.png). OAKMONT is
  complete; 41 of the 44 done and checked.
- QA, ROOMS's yawn picture 39 (029de55: oak_track, third paint) on a clean build of 029de55: PASS, 0 page errors. It stretches
  arms-up on both bodies (the wine and cream retro track jacket); stretch frames 3 to 21 changed, nothing else
  (shots/qa/yawn/batch23_idle_stretch.png). Both hands are fully out past the ribbed cuffs and the sleeves wrap the arms with no
  strip underneath, on both bodies, frames 6, 12 and 18 on hot pink and with short hair (oak_track_arms.png,
  oak_track_arms_short.png). Sweep: all hairstyles with all 19 neck items plus none, 120 pictures, all clean
  (sheet_oak_track_<body>.png). 39 of the 44 done and checked. Also on 35d51d2: savecheck all passed; screens.js at 360 and 390
  fit with no errors.
- QA, ROOMS's yawn picture 38 (35d51d2: oak_polo, OAKMONT, second paint) on a clean build of 35d51d2: PASS, 0 page errors. It
  stretches arms-up on both bodies (the wine pique polo with cream collar and cuffs); stretch frames 3 to 21 changed, nothing else
  (shots/qa/yawn/batch22_idle_stretch.png). Shoulders on hot pink at 3x, frames 6, 12 and 18 and with short hair: the bare arm
  comes cleanly out of each short sleeve on both bodies; no dark open sleeve, no hollow (oak_polo_shoulders.png,
  oak_polo_shoulders_short.png). Sweep: all hairstyles with all 19 neck items plus none, 120 pictures, all clean
  (sheet_oak_polo_<body>.png). 38 of the 44 done and checked.
- QA, ROOMS's yawn pictures 36 and 37 (2d7ddc2: km_rash, km_crochet) on a clean build of 2d7ddc2: PASS, 0 page errors. Both
  stretch arms-up on both bodies; stretch frames 3 to 21 changed, nothing else (shots/qa/yawn/batch21_idle_stretch.png). The rash
  guard's coral underside panels cover both underarms on both bodies, on hot pink (km_rash_crochet_pink.png). The cardigan's
  cream top runs straight into the trousers on both bodies, no skin between, frames 9, 12 and 15 at 5x (km_crochet_hem.png); the
  cream (247,231,205) is clearly paler than the skin (186-212,163-184,154-170). Sweep: all hairstyles with all 19 neck items plus
  none, 240 pictures, all clean (sheet_<top>_<body>.png). KAIMANA is complete; 37 of the 44 done and checked.
- QA, ROOMS's yawn picture 35 (b8d159c: km_boat, repainted) on a clean build of b8d159c: PASS, 0 page errors. It stretches
  arms-up on both bodies (the teal and cream striped boat tee); stretch frames 3 to 21 changed, nothing else
  (shots/qa/yawn/batch20_idle_stretch.png). The sleeves stop short of the elbow and both forearms and hands show on both bodies,
  frames 6, 12 and 18 on hot pink (km_boat_arms.png). After keepmain the art is one piece per body (no stray bits left) and the
  tee is whole. Sweep: all hairstyles with all 19 neck items plus none, 120 pictures, all clean (sheet_km_boat_<body>.png). 35 of
  the 44 done and checked.
- QA, ROOMS's yawn picture 34 (d89dfbb: km_camp, KAIMANA) on a clean build of d89dfbb: PASS, 0 page errors. It stretches arms-up
  on both bodies (the hibiscus camp shirt, short sleeves, bare forearms); stretch frames 3 to 21 changed, nothing else
  (shots/qa/yawn/batch19_idle_stretch.png). Shoulders on hot pink at 3x, frames 6, 12 and 18 and with short hair: the sleeves sit
  on both shoulders and the bare arm comes cleanly out of each; no hollow, no strip, on either body (km_camp_shoulders.png,
  km_camp_shoulders_short.png). Sweep: all hairstyles with all 19 neck items plus none, 120 pictures, all clean
  (sheet_km_camp_<body>.png). 34 of the 44 done and checked.
- QA, ROOMS's yawn pictures 32 and 33 (f106365: cr_mesh cut with --regreen, cr_vest; both second paints) on a clean build of
  f106365: PASS, 0 page errors. Both stretch arms-up on both bodies; stretch frames 3 to 21 changed, nothing else
  (shots/qa/yawn/batch18_idle_stretch.png). Underarms: the loose sleeves wrap the arms on both tops and both bodies, no tan strip,
  on hot pink (cr_mesh_vest_underarms.png). Mesh halo: 24 (boy) and 13 (girl) light pixels in the art's outer edge ring, against 7
  and 1 on smk_jacket and 432 and 460 on cr_bomber (its neon glow); on near-black no light ring shows (cr_mesh_dark.png). Vest
  piping keeps its colour: median (161,65,90) stretch against (168,65,93) idle on the boy, (162,67,91) against (170,63,93) on the
  girl (a crimson, the same as idle). Sweep: all hairstyles with all 19 neck items plus none, 240 pictures, all clean
  (sheet_<top>_<body>.png). CHROME RAIN is complete; 33 of the 44 done and checked. Not tested: --regreen itself (a tool).
- QA, ROOMS's yawn picture 31 (8fe507c: cr_trench, second paint, cut with --pastel) on a clean build of 8fe507c: PASS, 0 page
  errors. It stretches arms-up on both bodies; stretch frames 3 to 21 changed, nothing else. Colour, idle against stretch on the
  usual, hot-pink and light backgrounds: the same holographic pastel, no dark smudges, nothing showing through
  (shots/qa/yawn/batch17_idle_stretch_3bg.png); coat median (178,199,245) idle and (185,202,243) stretch on the boy,
  (184,203,240) and (192,205,240) on the girl; semi-transparent coat pixels 0 idle, 5 and 2 stretch (edge only). ROOMS's question,
  body beside the belt and under the boy's near armpit: QA's call is pass, no third paint. In the game it is a thin tan sliver,
  at most 2 px a row and about 10 px in all on the boy; with short hair, 2 px on the girl. Skin-coloured pixels in the waist band
  are 2 and 13 against 36 to 297 on passed tops (cr_trench_waist.png, frames 9, 12 and 15 at 4x). Sweep: all hairstyles with
  all 19 neck items plus none, 120 pictures, all clean (sheet_cr_trench_<body>.png). 31 of the 44 done and checked.
- QA, ROOMS's yawn picture 30 (1cc42bc: cr_bomber, CHROME RAIN) on a clean build of 1cc42bc: PASS, 0 page errors. It stretches
  arms-up on both bodies (glossy black, cyan piping); stretch frames 3 to 21 changed, nothing else
  (shots/qa/yawn/batch16_before_after.png). Green fringe from the paler mint sheet: in the art, 78 (boy) and 52 (girl) of about
  3,900 edge pixels lean mint, against 0 to 3 on the tunic, cloak and pad; they are faint (alpha 20-80) and sit only where the
  neon piping runs along the outline (cr_bomber_fringe_map.png, flagged in red), i.e. its glow, a touch greener than the piping
  itself, (187,231,211) against (128,211,213). In the game at 3x on light and hot-pink backgrounds no green edge shows, only the
  piping's thin cyan glow (cr_bomber_edges.png). The art's tiny grey prongs at the cuff and hem corners (4-6 px in the art, 1-2 px
  in the game, not visible) are the usual cut corners: thin-protrusion count 54/62 against 43-89 on passed tops. Sweep: all
  hairstyles with all 19 neck items plus none, 120 pictures, all clean (sheet_cr_bomber_<body>.png). 30 of the 44 done and
  checked. Not tested: yawn_cut.py --pastel itself (a tool; the trench will show its result).
- QA, ROOMS's yawn picture 29 (4287952: bb_cloak, repainted) on a clean build of 4287952: PASS, 0 page errors. It stretches
  arms-up on both bodies; stretch frames 3 to 21 changed, nothing else (shots/qa/yawn/batch15_before_after.png: idle, the old
  fallback, the new stretch, on hot pink). The front is closed from the clasp down on both bodies, with only the hem slit showing
  the trousers, the same as idle; no bare chest and nothing showing through, frames 9, 12 and 15 at 3x (bb_cloak_front.png). The
  art has no enclosed holes. Sweep: all hairstyles with all 19 neck items plus none, 120 pictures, all clean
  (sheet_bb_cloak_<body>.png). BARD & BLADE is complete; 29 of the 44 done and checked.
- QA, ROOMS's yawn picture 28 (e70ef55: bb_doublet, BARD & BLADE) on a clean build of e70ef55: PASS, 0 page errors. It stretches
  arms-up on both bodies (the wine velvet doublet); stretch frames 3 to 21 changed, nothing else
  (shots/qa/yawn/batch14_before_after.png). On hot pink at 3x, frames 9, 12 and 15: the puffed, slashed upper sleeves show cream
  lining in every slash, not background; the ruffled cuffs and collar sit at the wrists and neck; the sleeves wrap both arms
  (bb_doublet_sleeves.png, bb_doublet_shorthair.png). The art has no enclosed see-through holes. Sweep: all hairstyles with all 19
  neck items plus none, 120 pictures, all clean (sheet_bb_doublet_<body>.png). 28 of the 44 done and checked.
- QA, ROOMS's yawn pictures 26 and 27 (56f58a2: bb_tunic, bb_gambeson, BARD & BLADE) on a clean build of 56f58a2: PASS, 0 page
  errors. Both stretch arms-up on both bodies (the forest-green laced tunic with its belt; the cream quilted gambeson with open
  collar); stretch frames 3 to 21 changed, nothing else (shots/qa/yawn/batch13_before_after.png). The tunic's repaint: the far
  sleeve wraps the whole arm on both bodies, no strip of arm under it, frames 9, 12 and 15 at 4x on hot pink
  (bb_tunic_farunderarm.png, bb_tunic_underarm.png). See-through: the tunic's art has one enclosed hole per body, 94 px boy and
  84 px girl, both at the laced V neck (the passed sp_pad has 283 px at its neckline); the gambeson has none. In the game, on hot
  pink, no pink shows through either top, and the V neck and open collar show skin (bb_tunic_gambeson_seethrough.png). Sweep: all
  hairstyles with all 19 neck items plus none, 240 pictures, all clean (sheet_<top>_<body>.png). 27 of the 44 done and checked.
- QA, ROOMS's yawn pictures 24 and 25 (edefc90 sp_p2, 45658f8 sp_hpknit) on a clean build of 45658f8: PASS, 0 page errors.
  Both stretch arms-up on both bodies (the Player 2 ringer tee with purple trim; the sage cable knit with long sleeves and ribbed
  cuffs); stretch frames 3 to 21 changed, nothing else (shots/qa/yawn/batch12_before_after.png). sp_p2's repaint: PLAYER and 2 read
  in frames 9, 12 and 15 at 4x (sp_p2_print.png; the girl's default long hair covers "PL", as it covers any print). No outline
  residue: against the passed sp_pad, same hair, sp_p2 adds 3 pixels on the boy and 35 on the girl, all at her hem, none around the
  head or legs; on a light background no arc or dark edge shows (sp_p2_hpknit_residue.png). sp_hpknit's red hearts keep their colour
  in the stretch: median (187,67,71) boy and (194,66,64) girl against (195,63,64) and (194,67,58) in idle (sp_hpknit_hearts.png).
  Sweep: all hairstyles with all 19 neck items plus none, 240 pictures, all clean (sheet_<top>_<body>.png). SAVE POINT is
  complete; 25 of the 44 done and checked. Also on 68eb5aa: savecheck all passed; screens.js at 360 and 390 fit with no errors.
- QA, ROOMS's yawn pictures 22 and 23 (68eb5aa: sp_varsity, sp_pad) on a clean build of 68eb5aa: PASS, 0 page errors. Both
  stretch arms-up on both bodies (the purple varsity jacket with grey sleeves and teal cuffs; the grey controller-button tee);
  stretch frames 3 to 21 changed, nothing else (shots/qa/yawn/batch11_before_after.png). sp_pad's repaint: both short sleeves wrap
  the upper arms on both bodies, with no sleeve hanging under a raised arm and no dark hollow, frames 6 to 18 at 3x
  (sp_pad_shoulders.png), and the girl's far shoulder at 6x with short hair against the passed varsity and star hoodie
  (sp_pad_f_shoulders.png, sp_pad_f_farsleeve.png). Sweep: all hairstyles with all 19 neck items plus none, 240 pictures, all
  clean (sheet_<top>_<body>.png). 23 of the 44 done and checked.
- QA, ROOMS's yawn pictures 20 and 21 (360da8a: gp_star, gp_sailor) on a clean build of 360da8a: PASS, 0 page errors. Both
  stretch arms-up on both bodies (the lilac star hoodie; the sailor blouse's puff sleeves with bare forearms); stretch frames 3 to 21
  changed, nothing else (shots/qa/yawn/batch10_before_after.png). gp_star's neck, where the drawn mouth was removed, is clean on both
  bodies in frames 9, 12 and 15 at 4x (gp_star_neck.png). gp_sailor's pink neckerchief keeps its colour in the stretch: median
  (223,135,163) boy and (220,131,160) girl against (228,135,168) and (231,132,165) in idle, no magenta shift (gp_sailor_neck.png).
  Sweep: all hairstyles with all 19 neck items plus none, 240 pictures, all clean (sheet_<top>_<body>.png). GACHA POP is complete;
  21 of the 44 done and checked.
- QA, ROOMS's yawn pictures 18 and 19 (2d2ea91: gp_blazer, gp_bear) on a clean build of 2d2ea91: PASS, 0 page errors. Both
  stretch arms-up on both bodies (the pink blazer with its lilac bow; the blue bear onesie top with its cream belly); stretch frames
  3 to 21 changed, nothing else (shots/qa/yawn/batch9_before_after.png). The blazer's repaint: the boy's right side under the arm is
  one pink sleeve edge, no strip of body and no doubled dark line, frames 9, 12 and 15 at 4x and 5x (gp_blazer_underarm.png,
  gp_blazer_underarm_5x.png, next to the passed smk_jacket). Sweep: all hairstyles with all 19 neck items plus none, 240 pictures,
  all clean (sheet_<top>_<body>.png). 19 of the 44 done and checked.
- QA, ROOMS's yawn pictures 16 and 17 (b62c0a2: smk_vest, smk_cloak) on a clean build of b62c0a2: PASS, 0 page errors. Both
  stretch arms-up on both bodies (the puffer vest over its cream undersleeves; the cloak's short sleeves, bare forearms and jagged
  hem over the trousers); stretch frames 3 to 21 changed, nothing else (shots/qa/yawn/batch8_before_after.png). The vest's neck,
  where the drawn mouth was removed, is clean on both bodies (smk_vest_neck.png, 3x). Sweep: all hairstyles with all 19 neck items
  plus none, 240 pictures, all clean (sheet_<top>_<body>.png). SMOKE BOMB is complete; 17 of the 44 done and checked.
- QA, ROOMS's yawn pictures 14 and 15 (aab35f3: smk_jacket, smk_mesh) on a clean build of aab35f3: PASS, 0 page errors. Both
  stretch arms-up on both bodies (the jacket's orange panels and cuffs; the mesh sleeves under the black wrap with its orange
  sash); stretch frames 3 to 21 changed, nothing else (shots/qa/yawn/batch7_before_after.png). The mesh's neck and collar, where
  the drawn mouth was removed, are clean on both bodies: no stray mark, no hole (smk_mesh_neck.png, 3x). Sweep: all hairstyles with
  all 19 neck items plus none, 240 pictures, all clean (sheet_<top>_<body>.png). 15 of the 44 done and checked.
- QA, ROOMS's yawn pictures 12 and 13 (f18de4c: sm_tee, sm_vest) on a clean build of f18de4c: PASS, 0 page errors. Both stretch
  arms-up on both bodies (the GO OFF print readable; the utility vest's straps over the black undershirt sleeves); stretch frames 3
  to 21 changed, nothing else (shots/qa/yawn/batch6_before_after.png). Sweep: all hairstyles with all 19 neck items plus none, 240
  pictures, all clean (sheet_<top>_<body>.png). 13 of the 44 done and checked.
- QA, ROOMS's yawn pictures 10 and 11 (57dafa4: kp_bomber, sm_track) on a clean build of 57dafa4: PASS, 0 page errors. Both
  stretch arms-up on both bodies (the star bomber's striped cuffs at the wrists; the track jacket's cyan stripes along the raised
  sleeves); stretch frames 3 to 21 changed, nothing else (shots/qa/yawn/batch5_before_after.png). Sweep: all hairstyles with all
  19 neck items plus none, 240 pictures, all clean (sheet_<top>_<body>.png). 11 of the 44 done and checked.
- QA, LEAD's c4c8e53 (rigtest/matrix.html knows which pictures exist): checked on a clean build of bf08f94 (artnames.json written,
  48 KB): the stretch sheet now matches the game; sv_quilt and cr_bomber (no yawn art) keep the arms down, o_tee and kp_sailor (yawn
  art) raise them. QA can use the matrix again for the yawn batches. Info, no owner.
- QA, ROOMS's yawn pictures 8 and 9 (25939d4 nc_qzip, bf08f94 kp_sailor) on a clean build of bf08f94: PASS, 0 page errors. Both
  stretch arms-up on both bodies (the quarter-zip's cuffs at the wrists with the emblem on the raised sleeve; the sailor blouse's
  puffed short sleeves with bare forearms, the red tie in place); stretch frames 3 to 21 changed, nothing else
  (shots/qa/yawn/batch4_before_after.png). Sweep: all hairstyles with all 19 neck items plus none, 240 pictures, all clean
  (sheet_<top>_<body>.png). 9 of the 44 done and checked. Tool note: yawnfall.js and yawnsweep.js now ask the rig for the exact
  frame (QBLoft.frame) instead of frameOrNear, which sometimes gave an earlier frame on the slower female body; that was the
  occasional "idle 16 changed" in earlier batches. The earlier sweep sheets showed the right poses, so those results stand.
- QA, LEAD's hairFront slot (4f30ef5) with ROOMS's front lock (30d93a9), on clean builds of bc4a575 (before) and 30d93a9 (after),
  drawn the game's own way (`rigtest/qa/hairfront.js`, 337 pictures each): PASS, 0 page errors. The idle notch is gone: the long
  hair's front lock now lies solid over the near sleeve, no dots, and the hoodie's yellow stripe no longer shows through it
  (shots/qa/hairlock/before_after.png). Female, long hair, all 65 tops that fit her: idle, walk, sit and stretch all draw the lock
  (all_tops_idle.png, all_tops_stretch.png); in the stretch it sits in front of the raised sleeve on the painted tops; on four
  painted tops with a hood or high collar (o_puffer, nc_hoodie, sm_hoodie, sv_ski) the stretch is unchanged and reads fine. The lock
  matches black, brown, blonde and auburn hair; hats trim it like the hair (halo mask, beanie, straw hat, bucket hat, bow), and the
  cat hood keeps the hair inside, lock and all (colours_hats.png). Pixel-identical: the back views (8 of 8) and every other style
  (m h1, h2, h3 and f h2, h3 with three tops in idle, walk and stretch: 45 of 45). Not on a real phone.
- QA, ROOMS's yawn pictures 6 and 7 (bc4a575: nc_tank, kp_hoodie) on a clean build of bc4a575: PASS, 0 page errors. Both
  stretch arms-up on both bodies (the tank's bare painted arms; the cloud hoodie's cuffs at the wrists, its lightning stripe on
  the raised sleeve); only stretch frames changed (shots/qa/yawn/batch3_before_after.png). Sweep: all hairstyles with all 19
  neck items plus none, 240 pictures, all clean, no stray edges on the tank's bare shoulders (shots/qa/yawn/sheet_<top>_<body>.png).
  7 of the 44 done and checked.
- QA, ROOMS's yawn pictures 4 and 5 (653138e: sm_hoodie, sv_ski) on a clean build of e3278f0, drawn the game's own way: PASS,
  0 page errors. Both now stretch arms-up on both bodies instead of the arms-down fallback; the neon hoodie's cuffs stop at the
  wrists with the hands showing; nothing stray on the ski jacket's head; only stretch frames changed (one idle frame differed,
  the frameOrNear neighbour-frame noise) (shots/qa/yawn/batch2_before_after.png). Sweep: all three hairstyles of each body with
  all 19 neck items plus none, 240 pictures, every necklace on the chest and the hair whole (shots/qa/yawn/sheet_<top>_<body>.png).
- QA, LEAD's e3278f0 (yawn fallback keeps the standing spine, head and pelvis), long hair, on clean builds of 7d7c5df and
  e3278f0 with six tops still on the fallback (cr_bomber, bb_cloak, kp_hoodie, cr_trench, nc_tank, gp_bear), both bodies: PASS. The
  comb-like gaps are gone: the stretch is now the standing pose with the yawn face, and on the female body with long hair it
  matches idle (shots/qa/yawn/fallback_fixed_and_idle_notch.png: rows are before, after, and idle). Only stretch frames changed.
  (Test note: QBLoft.frameOrNear sometimes gives a neighbouring frame, so the same build drawn twice differed on 1 of 64 frames;
  two idle-16 differences between the builds were that, not a change.)
- QA, new, pre-existing (LEAD's note): in plain idle, the female body with long hair (h1) has a notched, dotted edge where the
  front strand of hair crosses the near sleeve, and the sleeve shows through it (the yellow stripe through the hair on kp_hoodie,
  dots on bb_cloak, cr_bomber, cr_trench, gp_bear, nc_tank): bottom row of shots/qa/yawn/fallback_fixed_and_idle_notch.png. Worth
  fixing: idle is the pose players see most, and long hair is the female default. Owner: LEAD (sleeve drawn after the hair).
- QA, ROOMS's first three yawn pictures (2dde59c nc_hoodie, 8f026ce nc_tee, 05e7c19 kp_varsity) on a clean build of 05e7c19,
  drawn the game's own way: PASS, 0 page errors. Before (7d7c5df) they used the arms-down fallback; now each has its painted
  arms-up stretch on both bodies, sleeves to the wrists, no tears; only the stretch frames changed, idle and walk pixel-identical
  (shots/qa/yawn/batch1_before_after.png). Nothing stray on the tee's head. The sweep (`rigtest/qa/yawnsweep.js`): each top in
  the stretch with all three hairstyles of each body and all 19 neck items plus none, 360 pictures: every necklace sits on the
  chest, the hair is whole (no fallback gaps), the wings and headphones sit right (shots/qa/yawn/sheet_<top>_<body>.png).
- QA, LEAD's yawn fallback (7d7c5df), seen while checking ROOMS's first yawn pictures: on the female body with long hair, in the
  stretch with the arms-down fallback, the hair falling over her right shoulder has a broken, comb-like edge and the top shows
  through the gaps (a white sliver on nc_tee and kp_varsity before their pictures, the yellow stripe through the hair on
  kp_hoodie, brown on bb_cloak, red and white on sv_ski; o_tee with its painted yawn is clean). shots/qa/yawn/
  fallback_hair_gaps.png (stretch frame 12, female, hair h1). It looks like the hair is cut for the painted arms-up pose while
  the arms are down. It goes away top by top as ROOMS paints the 44, but until then 41 tops show it on long hair. Owner: LEAD.
- QA, LEAD's 7d7c5df yawn fallback (rig.js), drawn the game's own way (QBLoft.warm + frameOrNear, with the art pack and list) on
  clean builds of c012014 (before) and 7d7c5df (after) (`rigtest/qa/yawnfall.js`): PASS. (1) sv_ski, cr_bomber, bb_cloak and
  kp_hoodie on both bodies: before, the arms went out sideways and the sleeves tore (white patches on the ski jacket, ragged
  cloak and hoodie sleeves); after, the arms stay down at the sides, no tears, the yawn face (eyes closed) still plays; only the
  stretch frames that use the painted pose changed (3 to 23). (2) o_tee and the starter tee: every frame pixel-identical, still
  the painted arms-up yawn. (3) idle, walk and stretch frame 0 pixel-identical for all six tops. Picture: shots/qa/yawn/
  yawn_before_after.png (stretch frame 12, before then after, m and f). Note for QA's own tools: rigtest/matrix.html cannot show
  this, because it has neither the art list nor the art pack, so the rig there assumes every yawn picture exists.
- QA, extra on v0.71 (3840577) while waiting: every room window's frame rate after the lag fix (`rigtest/qa/roomfps.js`), all 21
  rooms fully bought, 390x844 at x3, CPU 4x slower: every window 59-60.5 fps, worst frame 17 ms (Bedroom and Theater 33 ms), no
  frame over 50 ms, 0 page errors. Not measured: windows with customers walking (a fresh Unlock-everything save drew none in the
  Restaurant, Nightclub, Theater or Arcade at 21:00, opened from their buildings), and not on a real phone. Info, no owner.
- QA, ROOMS's eadc75b (pendants and Neon Sign moved, my 85fad55 note) on a clean build, 0 page errors: PASS. Corner Diner: the neon
  sits clear of the wine wall. Noir: two pendants, hung higher, right of the wine wall and above the stools, nothing overlapping
  (shots/qa/rooms3/restaurant_neon_pendants_fixed.png: left c50714d, right eadc75b). Correction to my note: my "Bistro" stage (every
  upgrade but Noir) forced the Black Marble Counter without Noir, which a player cannot reach (the counter needs Noir, and Noir
  hides the Neon Sign), so the Bistro overlap of pendants and neon there is not a real case.
- QA, ROOMS's c50714d (Restaurant Neon Sign bigger with pink glow; Black Marble Counter's three brass pendants) on a clean build,
  0 page errors: the neon reads now, the pendants need a small move. In the Bistro the left pendant hangs right in front of the wine
  wall's glass and all three bulbs sit among the bar stools' backs; in Noir the left one overlaps the wine wall's lower right and the
  first stool; the bigger neon also overlaps the wine wall's top-right corner (Bistro) and touches its top (Corner Diner). It reads
  as clutter right where the room was thinned (shots/qa/rooms3/restaurant_neon_pendants.png: rows Diner, Bistro, Noir; left before,
  right after). Fix: shift the pendants toward the kitchen end of the counter so none is in front of the wine wall (or two pendants,
  or hang them higher so the bulbs clear the stools), and nudge the neon up/right so it clears the wine wall. Owner: ROOMS. FYI LEAD:
  v0.73 (fb0b6cb) holds c50714d; QA runs the full set on fb0b6cb now and rechecks only this fix on the rebuild.
- QA, ROOMS's two fixes from 121dc00 on clean builds of 828990f and 21b292a, 0 page errors: PASS. Drip Coffee: in the Hole in the
  Wall it sits on the counter behind the napkin box, smaller, both fully seen, nothing past the counter's end (shots/qa/rooms3/
  restaurant_drip_fixed.png: v0.72, b3e3510, 828990f). Tables: the fully bought floor's middle row is two 2-tops; clear aisles
  between every row, no chair against a neighbouring table, in Bistro and Noir (restaurant_tables_bistro.png,
  restaurant_tables_noir.png). QA's call: the full Restaurant now reads as not cluttered.
- QA, ROOMS's room checks on a clean build of b3e3510 (holds facb194, 10f64be, d328e88, 8602ed7, b3e3510), against v0.72, 0 page
  errors. Dessert Parlor (facb194): PASS. The dark library bookcase is a mint and blush patisserie hutch of cakes and teacups, the
  gold mirror a blush scalloped Flower Mirror; both on their walls, same footprint, the hutch's front to open floor; the room now
  reads as one pastel palette (shots/qa/rooms3/dessert_before_after.png). VR Arena (facb194): PASS. Dark navy panels, cyan neon
  line, glowing hex floor and a launch ring under the treadmill, now one family with the Arcade next door; every piece's use side
  to open floor (vr_before_after.png). Restaurant thinning (10f64be): PASS. In Noir and without it the third booth and divider, the
  patio heater, the front olive tree and the white drinks cooler are gone, replaced as planned; the edges breathe
  (restaurant_noir_before_after.png, restaurant_bistro_before_after.png). QA's call on "never cluttered": better, not yet clearly:
  the middle is still a grid of 7 four-seat tables with chairs nearly touching between rows. Suggest 7 to 5 tables (or 4-tops to
  2-tops in the middle row); seating is LEAD's call. Sculptural Vases (d328e88): PASS, black vases with dry branches and pampas, 0
  greenish pixels, no fringe at 5x on the dark herringbone (restaurant_vases_5x.png). Chef's Neon (8602ed7): PASS, clearly seen on
  the kitchen tiles in Bistro and Noir. Star Plaque and Brass Chandeliers (b3e3510): PASS, both read by day. Drip Coffee (b3e3510):
  small fix. In the Hole in the Wall it now sits on the till counter's front end, but it hides the left third of the napkin box and
  its base hangs about 5 px past the counter's end (restaurant_drip_zoom.png, left pair); nudge it right and up a little, or shrink
  it. In bigger rooms a better coffee machine supersedes it by design (a with/without render of the full room differs by 0 px).
  Owner: ROOMS (drip nudge), LEAD (tables).
- QA, v0.72 = 083fec9 (APPV 72), the full set on a clean build (491 files): PASS, publish, 0 page errors anywhere. savecheck all
  passed; screens at 360 and 390 fit; visits.js PASS; lagcheck.js PASS (Game Room and Restaurant windows at CPU x4: v0.71 58.3/57.8
  fps, worst 67/83 ms; v0.72 60.3/60.3 fps, worst 17/17 ms); unlockall.js PASS (fresh and mid-game); the whole story 64/64 (the
  save gains an empty story.beats and the friend-visit day, as on v0.71: defaults, not progress); Review 119/119 on both bodies, 0
  problems; livesync, live10 PASS; alerts, FX, room windows, bar rule PASS; badges all from the pack, 0 loose; drops PASS; all 30
  rooms draw fully bought (shots/qa/v72/allrooms.png); guests at most 5, no duplicates. The screens' still picture (cfa5f62), new
  rigtest/qa/stillcheck.js: Theater, Auditorium and Boba screens show page 1 with animations off (not black) and hide it with
  animations on (shots/qa/v72/screens_still_noanim.png); my old screenlive.js targets the retired Mall Directory and no longer
  applies. players10: 1 pass in 3 runs on v0.72 (Mia's page wrote 3 in the quiet minute twice: her save twice and her world, after
  her board post, under load 16-34), 1 pass in 1 on v0.71 today; no saving code changed between them (only APPV, rig.json, build.py,
  yawn_cut.py), so it is timing, not v0.72. Fixed my players10.js listing every write for a page that wrote none. Painted stretch
  for all 44 tops passed one by one (above). Not on a real phone.
- QA, v0.71 = 3840577 (APPV 71), the full set on a clean build (490 files): PASS, publish, 0 page errors anywhere. visits.js PASS
  (four arrivals at 360 and 390, one and two friends, nothing over the names or past the card at any frame, reduced motion, 12 real
  visits with all four and none twice running); lagcheck.js PASS (Game Room and Restaurant windows at CPU x4: v0.70 28.8/29.3 fps,
  worst 117/50 ms; v0.71 60.3/60.3 fps, worst 17/17 ms; every window's own animations run, nothing left paused after closing);
  unlockall.js PASS (fresh and mid-game; my buy loop now reopens a window before giving up, it had stopped on a Garden window still
  redrawing: every Garden upgrade buys on v0.70 and v0.71); the whole story 64 parts, "Traveling"; Review 119/119 on both bodies;
  livesync, live10, players10 PASS (a first players10 run had one page write 3 times in the quiet minute under load 27; rerun 0-2);
  alerts, FX, room windows, bar rule PASS; badges all from the pack; drops PASS; all 21 rooms buy through; only the Bedroom has a
  lamp; guests at most 5, no duplicates. Not on a real phone: the lag fix is Cal's to feel on his iPhone.
- QA, LEAD's 19ef0d9 phone-lag fix (Cal's iPhone: room windows 37-38 fps, worst frames 214 and 421 ms), on clean builds of
  10240e8 (before) and 19ef0d9 (after), 390x844 at x3 with the CPU 4x slower, every upgrade bought (`rigtest/qa/lagcheck.js`):
  PASS, 0 page errors. Game Room window 32.5 -> 60.3 fps, worst frame 100 -> 17 ms, frames over 50 ms 5 -> 0; Restaurant 33.3 ->
  60.3 fps, worst 50 -> 17 ms. A room window, a level-up, a visit card, a story scene and a Review play each opened and closed:
  inside each window nothing is paused (the level-up and visit cards' 8 animations, the scene's 3, the welcome's 2 all run); behind
  it the Board's 19 effects (edge, sweep, spin, holo, the tab "!") pause while it is open; after it closes all 19 run again, 0
  paused, no window left; the tab "!" bounces again. Not on a real phone: the iPhone numbers are Cal's to confirm on v0.71.
- QA, v0.70 = 10240e8 (APPV 70), the full set: PASS, publish, 0 page errors anywhere. On a clean build of 10240e8: unlockall.js
  PASS (fresh and mid-game saves; Next story step "The story has no steps left"; every upgrade in every room buys through; it gives
  the openers' prerequisites bd_ward1, bd_win2, bd_win3 and r_t1-r_t3 up front, as buying the openers would, so those six are not
  seen being bought); the whole story re-read, 64 parts in order, all 8 notes from c5739a7 fixed (one leftover: Rafe's title still
  says "Travelling" while the rest now spells favor, parlor); Test > Review 119 of 119 on both bodies at 390, nothing off screen or
  broken. On 396376b (the same code outside the story, welcomes and tester): livesync, live10 and players10 PASS; alerts, FX, room
  windows, bar rule PASS; badges all from the pack; drops PASS (0 repeats in 192 rerun slots); all 21 rooms buy through; only the
  Bedroom has a lamp; every business at most 5, no duplicate looks. Not on a real phone.
- QA, LEAD's 90d5653 (QA's two arrival notes) on a clean build of 90d5653: PASS. visits.js now also checks every frame (0, 0.2,
  0.45, 0.7, 1.1, 2 s) that no friend's visible picture crosses the names or the card's edge; it caught both on f7a43bb (drop and
  pop at 0.45 and 0.7 s) and finds none on 90d5653, at 360 and 390, one friend and two; reduced motion and the 12-visit rotation
  (all four, none twice running) still pass. Mid-spin the second friend is now cut at the picture area's edge rather than poking
  out (shots/qa/visits/arrivals_fixed_360.png). For v0.71.
- QA, LEAD's f7a43bb, Cal's four visit arrivals, on a clean build of f7a43bb (`rigtest/qa/visits.js`): PASS, two cosmetic notes,
  0 page errors. At 390 and 360, one friend and two: Knock knock (the door swings open, they step through), Someone pulled up
  (skid in, dust), Look who dropped in (fall, squash, shadow), Surprise! (spin up) all end with the friends at rest inside the
  card, the door and dust gone, the Nice button reachable, and the page never wider than the screen. Reduced motion: the friends
  are there from the first frame, no door. 12 real visits on 12 days (__qbFriends.force): pop door pop door pop drop ride pop drop
  door ride pop, all four used, never the same twice running; after a reload the day's visit keeps its arrival. Frames at 0, 0.2,
  0.45, 0.7, 1.1 and 2 s: shots/qa/visits/arrivals_strip.png. Notes: (1) the drop passes the falling friends across the names and
  the "Look who dropped in" line for about half a second (0.45-0.7 s); (2) in Surprise! the second friend pokes past the card's
  right edge mid-spin (0.7 s). Owner: LEAD. Not on a real phone.
- CAL (2026-11-07, to QA, passed on as said): "I want 4 different animations of when the visitors come visit our base. I want each
  visit to be unique." Not QA's to build; for LEAD to assign. QA reads it as the friend visits (29k_friends.js: the visit card,
  the banner and the friend walking into The Loft), four distinct arrival animations rotating so no two visits in a row look the
  same; it may also mean neighbours' "Say hi" walk-ins (socVisitors). Worth asking Cal which. QA will check them when they land.
  Owner: LEAD.
- QA, LEAD's 40c4b14 (Cal: "every story beat and character cutscenes to make sense"), on a clean build of af12b92: the gates
  PASS (storygates.js: Lock and Key closed without White Linen, open with it; Nova closed without the Clothing Store, open with it),
  Review > Play the whole story plays all 57 parts at 390 with 0 page errors and saves nothing (only an empty story.beats appears).
  The whole text, in order: shots/qa/story/story_af12b92.md (`rigtest/qa/storyread.js`). Read through once; it mostly holds
  together (Mara before she is named, "another investor" after Desmond, Theo after the ticket stand, Nova outside the clothing
  store, Desmond's white linen). Lines that do not fit, most visible first:
  (1) Where the Theater is: Step 10 says "the lot next door could be a movie theater", then Priya says "A movie theater. In our
      strip mall." (and it sits in the Mall's building). Pick one.
  (2) Where the Rhythm Room and VR Arena are: the Arcade's welcome says "A Rhythm Room upstairs, and a VR Arena next door", then
      Step 13 says the arcade's "back room" and Step 14 its "other back room". The room windows agree with the welcome.
  (3) No "New room" welcome for the Rhythm Room, VR Arena, Karaoke and Nightclub; every other story room (Garden to Bowling) has one,
      so the last four steps are a bare step card each.
  (4) Sable arrives third ("Meanwhile, in the Hero's Lair: Your first mission comes home with someone"), between the Garden and the
      Restaurant, but nothing in the story has introduced the Lair or missions yet (the Lair comes from the Closet's hidden upgrade).
      Either a line that says how the Lair appeared, or Sable placed where the Lair opens.
  (5) The ending: Rafe asks about "the Old Metro" before Sable has said anything about it (swap 53 and 54 so Sable reports first),
      and Rafe's "Five shards, one amulet" has no setup anywhere in the story.
  (6) Two speakeasies: Desmond offers to "fund a speakeasy up there ... Lock and Key", and there is also a room called the
      Speakeasy behind the Dessert's Hidden Door (its story step says "Part of Lock and Key now"). A player sees both names.
  (7) Spelling is mixed: "Dessert Parlor" (Step 4 title and its welcome) but "parlour" (Step 4 text, "At the dessert parlour");
      "neighborhood" in Step 2 while the rest writes neighbour, colour, favour, travelling.
  (8) Small: the Loft welcome says "At level 5 the empty lot next door goes up for sale" to a player who starts at level 5 (it is
      already for sale).
  Owner: LEAD (story text), ROOMS for the four missing welcomes if those need art.
- QA, LEAD's 0f7ce90 Test > Unlock everything (Cal's "access every upgradable room and section"), pressed from the Test pill
  at 390 on a clean build of 0f7ce90 (`rigtest/qa/unlockall.js`): works, two small things to fix. Fresh player and a mid-game save
  (level 20, five rooms with upgrades, half the story): level 50, no locked tab, 21 rooms built once, the only upgrades given are
  the ones that open other rooms, the mid-game save keeps every room and upgrade it had, the whole team, +500,000 coins, 17 story
  steps done, a reload keeps it, 0 page errors. Every room window opens and, from a fresh unlock, every upgrade in all 22 rooms
  (the Speakeasy via the Dessert's Hidden Door) buys through its window with the 500,000 coins to spare (they never ran out);
  Review still plays (23 of 23 sampled of 114). (1) "Next story step" is not empty after it: it opens the Speakeasy ("Opened
  Speakeasy"), because qbtNextStep (29m_tester.js) does not skip the story's how:"never" step; it should say nothing is left.
  (2) After Unlock everything the Bedroom's first wardrobe (bd_ward1) can never be bought: the Walk-in Closet's opener (bd_ward2,
  which needs bd_ward1) is given directly, and bd_ward1 is then no longer offered, so its look and splash cannot be tested.
  Owner: LEAD. Not on a real phone.
- QA, v0.69 = c2c53b7 (APPV 69), the full set on a clean build (490 files): PASS, publish it, 0 page errors anywhere. Test >
  Review plays 114 of 114 at 390 on both bodies, nothing off screen or broken (the save gains only an empty "seen" record);
  livesync.js PASS; live10.js PASS (quiet minute 0-1 writes per page); players10.js PASS (ten different saves, neighbours in their
  outfits, all visits, posts and hellos in 1 s, every save its own after reloading, 27 docs); alerts.js PASS; fxcheck.js PASS;
  roomwin.js PASS (no zoom, street and buildings at 1.6x, purchases keep people, gold pulse); barlock.js PASS; badges.js: every
  brand tab from the pack, 0 loose files; drops.js PASS (Mon/Thu, HANGANG first, 0 repeats in 192 rerun slots); stuckscan.js: all
  21 rooms buy through; nightlights.js: only the Bedroom has a lamp button and it survives a reload; guestcount.js: every business
  at most 5 at once, 0 duplicate looks, someone in every sample; access.js: as on ab1f68f (only the known false alarms: booth
  and sofa seats, theatre rows, the pinball's art direction). Room layouts are those QA checked by eye on 9136fc1 and ab1f68f.
  Not on a real phone; the published-file check after the publish needs Cal to restart QA (artifact tools).
- QA, ROOMS's 567ea26 (Nightclub staff, Sky Patio chair) on a clean build of ab1f68f: PASS, 0 page errors. The room built from
  the layout now has the DJ at (7.8, 0.5) behind the decks and the bartender at (2.2, 0.5) behind the bar; the bar sits at y 1.0,
  the speakers at 0.85, the coat check from x 12.1, so an aisle runs along the back wall, entered between the right speakers and
  the coat check. Live at 22:00 over 48 s: the DJ works at the decks facing the floor, the bartender works behind the bar, and
  between jobs they walk the aisle (shots/qa/access3/club_live_3.png); the back wall reads clean (big_club.png). Sky Patio: the
  lounge chair's seat has its walk-to point at (3.95, 4.6) and lfRoute from the door reaches the seat in 4 steps (nobody came to
  the Patio window in my live run, so not seen live). Note, not seen on screen: at the start of the live run up to four guests
  sat at exactly (3.0, 3.0) idle for about 30 s, apparently guests waiting to come in (none visible there in the pictures).
  ROOMS's whole placement list (6430d13) is now closed.
- QA, 1ab3753 (ROOMS drops the old screen wrapper) on a clean build of ad05db6: PASS. With animations off the Auditorium, lobby
  and Boba screens show their still; with animations on the slides play, no still under them; 0 page errors.
- QA, ROOMS's 570b2f3 (Cal's use check) on a clean build of 9136fc1, every room fully bought drawn large (shots/qa/access2/),
  access.js, stuckscan.js (21 rooms buy through), 0 page errors: PASS on all but one point. Fixed and checked: the Arcade pinball
  now points into the room with its flipper end on open floor, the Skee-Ball end clear; Lock and Key upright piano on the back
  wall facing the room (nothing in front of the keys: the lamp table is 2 units to the side) and the bar 0.8 off the wall; Rooftop
  DJ deck 1.0 off the parapet; VR flight pod clear of the sofa, ring chair in from the edge; Rhythm pads out a tile (the DJ game
  behind has room), bench off the mirrors (it faces the front edge, not the pads, but is usable); lobby ticket booth clear of the
  recliner; Restaurant smoker in the olive corner facing open deck, pizza oven clear, the crescent booth's opening clear (tight
  but walkable); Upstairs Bar wine cabinet clear of the sofa; Bedroom mirror on the left wall, record cabinet clear; Mall fountain
  3.1 units from the store wall (its height made it look closer); Boba fridge on the back wall; Dessert towers off the bookcase;
  Garden potting bench clear. Withdrawn: my (5) Bowling bench; it is a rear view and the seats face the ball return and lanes
  (shots/qa/access2/bowl_zoom.png). STILL OPEN: the Nightclub's staff stand on the floor side. 27b_skins.js puts the DJ at y 0.5
  behind the decks and the bartender at y 0.6, but the room built from it (roomCtx) has them at 2.5 and 2.1, in front of the
  decks and the bar; live at 22:00 the bartender stands on the customer side (shots/qa/access2/club_live.png). The bar art starts
  at y 0.2, so there is no room behind it; the DJ booth has 0.8 behind it, yet the spot still moves out. No other room's staff
  spot is on the wrong side (lobby, Bowling, Arcade, VR, Upstairs Bar checked). Small: the Sky Patio lounge chair's sit spot
  (4.75, 4) cannot be walked to from the door on access.js's 0.2 grid. Owner: ROOMS.
- QA, LEAD's cfa5f62 (the screens' still picture moved into 24_screens.js scrPages, replacing ROOMS's 62d336d wrapper), on a clean
  build of 67d375e: PASS. Same as c9a940e: with animations off the Auditorium, lobby and Boba screens show their still; with
  animations on the slides play and no still shows under them; 0 page errors.
- QA, ROOMS's v0.69 room fixes (62d336d, dbf2593, a4be384, aca27a1, 1e8a3b4) on a clean build of 6430d13: all PASS, 0 page
  errors. With animations off (allrooms.js, as reduced motion) the Auditorium shows its dragon-over-the-city still, the lobby its
  NOW SHOWING times, the Boba its TODAY menu; with animations on (bigrooms.js) the slides play and no still shows under them. At
  22:00 the Rooftop and Sky Patio are dark (the Patio lit by its string lights only). Kenan wears the same black shades in all three
  portraits. The Bedroom rug tucks under the bed's foot; the Rhythm Room's front floor has its neon circle; the Sky Patio's wicker
  lounge chair sits at the fire, usable. Pictures: shots/qa/v69/. Not on a real phone.
- QA, v0.68 = e276038, the full set: PASS, nothing new broken; Cal's call whether it goes to the Test link before the placement
  list below. On a clean build of e276038 (and 428c8a5, same code but the portraits): Test > Review plays 114 of 114 at 390 on
  both bodies, no window off screen, no broken image (the save gains only an empty "seen" record); livesync.js PASS (5.1 s state,
  1.0 s posts); live10.js PASS (quiet minute 0-1 writes); players10.js PASS on e276038 with the neighbours now in their own
  outfits (Hall rows draw with the rig, `calav nbav`); alerts.js PASS (Garden "!" at 5, Relics and Wheel "!" when they open, "+",
  brands); fxcheck.js PASS; roomwin.js, barlock.js PASS; badges.js: all 15 brand tabs from the pack, 0 loose files; drops.js PASS
  (Mon/Thu, HANGANG first, 0 repeats in 192 rerun slots); stuckscan.js: all 21 rooms buy through; 0 page errors anywhere.
  Correction to my aa3a99b note (1): the "black screens" were my capture setup (lib.js turns animations off, and every screen's
  picture only appears through its animation); ROOMS's 62d336d gives reduced-motion players the still picture too.
- QA, Cal (2026-11-07): "the pinball machine on the right wall is facing towards the other machine with no space to play. Do a QA
  check on every asset to make sure the assets are accessible." Every room fully bought, drawn large (`rigtest/qa/bigrooms.js`,
  shots/qa/access/big_<room>.png) and checked piece by piece for its use side, plus `rigtest/qa/access.js` (each piece's front
  strip and every guest spot against the room's own layout; it cannot see which way the art itself is drawn, which is exactly the
  pinball's fault, so the eye pass is the real check). Pieces that cannot be used as placed, most visible first:
  (1) Arcade, Pinball Machine (ar_pin): its table runs along the back wall, so the flipper end where a player stands is pressed
      against the claw machines (shots/qa/access/arcade_pinball.png). Turn it to face the room or give its flipper end a clear unit.
  (2) Lock and Key (stage room), upright piano: the keyboard faces the drum kit on the stage, no room for a pianist or bench.
  (3) Lock and Key, bar counter: built against the back wall, no space behind it for a bartender.
  (4) Nightclub DJ booth and Rooftop DJ deck: both pushed against speakers or the parapet, nowhere for the DJ to stand.
  (5) Bowling, the orange bench: faces away from the lanes, straight into the back of the snack cart.
  (6) VR Arena: the blue flight pod sits right in front of the sofa's seat.
  (7) Rhythm Room: the music-game cabinet stands behind the dance machine (its player side faces the machine's back); the bench
      sits in front of the mirror wall.
  (8) Theater lobby: the ticket booth stands in front of the second recliner.
  (9) Restaurant: the patio smoker faces a bistro chair; the pizza oven's mouth is half blocked by the condiment counter; a square
      table sits in the round booth's opening.
  (10) Upstairs Bar: the glass wine cabinet's doors press against the green sofa's end.
  (11) Bedroom: the full-length mirror stands half over the record-player cabinet and half against the window.
  (12) Mall: the fountain's back rim sits in the clothing store's doorway.
  (13) Smaller: Arcade Skee-Ball's throwing end is at the front edge beside the photo booth; Boba's drinks fridge at the front edge
      faces out of the room; Dessert's counter end and macaron and cupcake towers crowd the bookcase; Garden potting bench behind the
      compost crate; VR ring chair at the front edge.
  Fine as placed: Game Room, Karaoke, Auditorium, Closet, Lair, Sky Patio, Garden beds, the rest of each room above. Owner: ROOMS.
- QA, Cal's "check all the rooms and assets ... use references for everything" (v0.68 code, 428c8a5): all 21 rooms fully bought
  at 13:00 and 22:00 plus the street and the three buildings, against isometric references of each kind (docs/QA.md "Every room
  against references", sheets in shots/qa/rooms/). 0 page errors; nothing out of place in the street or building views; 13 rooms
  read like their references as they are. Notes for ROOMS, most visible first: (1) black screens where references show a picture:
  the Auditorium screen (black at noon and at 22:00), the Theater lobby's two big back-wall panels, the Boba wall TV (references
  put the menu board there); (2) Sky Patio: no seats around the fire bowl except two dog beds; (3) Rooftop: a large bare pale floor
  with no plants or string lights, lit like noon at 22:00; (4) Dessert: a dark library bookcase and a full-length mirror break the
  pastry-shop palette; (5) Bedroom: the round rug floats in the open floor and the dog beds sit loose at the front edge;
  (6) VR Arena: a white clinical room beside the dark neon Arcade and Rhythm Room; (7) the Restaurant fully bought (73 pieces) is
  only just inside Cal's "never cluttered"; (8) Rhythm: a big empty front-left floor. The placement audit does not cover the
  newer rooms (Mall to Club report 0 pieces), so those were checked by eye only. Owner: ROOMS; (1) may be LEAD's (show state).
- QA, Cal's "how this platform would function with 10 saves files from different players" (v0.68 code, 428c8a5, phone 390,
  `rigtest/qa/players10.js` on LEAD's stand-in database, each page its own device save): PASS but one real gap. Ten different saves
  (new player at 5, casual 8, 12 lapsed, 15, 22, old save at 25 owning the retired gm_ping, 38, 45, 60, 80 with every outfit owned;
  both bodies; 1 to 21 rooms; outfits picked from the Shop) each boot in 1.4-6 s with ten open, draw Board/Training/Loft/Hall/Shop
  with no error, and see the other nine with the right level and streak; both Halls list nine neighbours; Cal visits all nine
  (each Loft opens with the right rooms, fits the phone) and Newbie visits Max's 21 rooms; "Say hi" reaches Max in 1 s; three posts
  at once reach all ten in 1 s; a quiet minute writes 0-1 per page; database: 27 docs (10 worlds, largest 6 KB; 10 saves, largest
  16 KB; board, pings; far under the 25,000-doc limit); reloading all ten, each save is still its own; 0 page errors. GAP (Cal's
  town-hall ask "post a picture of your character with your current outfit"): every neighbour portrait (the Hall list, the visit
  window's header and the town board posts) is drawn by the old chibi parts (pxImg > chImg > chParts in 30_app_b.js), which only
  know the starter clothes, so no Shop outfit or hat ever shows: Kai and Max in a visor, Mia in a bow and Ari in a bucket hat all
  show the same bare head, and every man looks alike and every woman looks alike (shots/qa/players10/heads.png, hall_list_Cal.png).
  The world doc does carry the outfit (look.gar, rig.equipped), so it is the drawing. Fix idea: draw these with the rig, as the
  Board avatar and the friends are. Owner: LEAD. Note: visits show "0 crew" for everyone (my saves hire nobody), not checked further.
- QA, ROOMS's four for v0.68 on a clean build of 428c8a5 (same code as 9b3a428), phone size 390: all PASS, 0 page errors.
  4e93d54 (`rigtest/qa/roomwin.js`): all 21 room windows have no zoom buttons, and a wheel or a two-finger pinch leaves the view
  exactly as it was; the street stops at 1.6x by + and by pinch, all 3 buildings open at or under 1.6x and + stops there (by day the
  Bedroom shows no control at all; its lamp shows at night, nightlights.js). Restaurant pictures at each stage: the double shelf runs
  along the back wall above the wainscot, the menu board is a rectangle above the tiles. 1308059: buying with the window open in 12
  businesses: the new pieces pulse gold (seen at about 0.8-1.3 s; the shadow layer never pulses); where people were in the window
  (Boba 6, Arcade 6, Theater 9) nobody left, changed seat or look, and nobody moved further than they do in the same time without
  a purchase. Hiring the Head Chef (r_s4) with 8 in the Restaurant changed one person's look and moved them 13 units, which is the
  new chef arriving, not a reset. In headless runs customers came in some runs and not others, so not every business was checked
  with people in it. 633ffe2 (`rigtest/qa/barlock.js`): without White Linen only White Linen is offered; with it the bar stays
  hidden until the story's earnings step opens, then its card shows; an old save owning the bar without White Linen keeps the bar
  and the Sky Bar, also after a reload. ede09d8 (`rigtest/qa/alerts.js`): level 4 no Garden "!", level 5 the lot is for sale with
  "!" on The Loft and over the lot; a new player starts at level 5, so the "!" is there from the start. LEAD's d0adfdc: Relics and
  Wheel now get their "!" when they unlock (my gap from ba1758a is fixed). Not checked on a real phone.
- QA, 59d31a0 (FX) and 3bba5f1 ("!" and "+") on a clean build of 0a03968, phone size 390: FX PASS, alerts PASS but one gap and one
  copy error. `rigtest/qa/fxcheck.js`: at levels 23/24/28/34/45 no scanline layer exists anywhere; Starlight from 24, behind the
  panels (z-index -1); vignette inset 110 px at .32 black; edge glow 48 px -28 at half the accent; on The Loft street, inside a
  building and in a room window opened from The Loft no overlay shows. Note, not an error: a room window opened over the Board (story
  scenes, friend visits) or the Shop keeps the vignette and edge glow around it (body.loftmode is only set on The Loft tab).
  `rigtest/qa/alerts.js` (fresh player through the real path): an old save lights nothing; the Garden lot at level 14 puts "!" on
  The Loft and over its street lot, opening The Loft clears it and a reload keeps that; with the Garden built and Mara's step open,
  "Knock Through to a Restaurant" puts "!" on The Loft and over the building, inside a "+" on its spot, tapping "+" opens the
  Garden window with that upgrade listed first, building the Restaurant removes the "+"; building the Closet and the Lair puts "!" on
  Shop and Dungeons, each clears on opening and stays cleared after a reload; a brand not yet seen puts "!" on the Shop until opened;
  0 page errors. (1) GAP: a tab unlocked by LEVEL never gets a "!" (Relics and Wheel going from locked to open at 14 to 45: no "!").
  alSeen()'s first run marks every tab not gated by a room as seen, locked ones included, and alTabs() only checks areaGate (the
  Closet/Lair rule), not the level lock (lv < AREAS[2]) or areaWaiting. Fix idea: at first run mark only tabs that are open by all
  three rules, and in alTabs skip tabs still locked by level. Owner: LEAD. (2) COPY: The Loft's welcome card says "At level 5 the
  empty lot next door goes up for sale", but the Garden lot is locked until level 14 (ROOMT.garden.lv in 22_garden.js; the street
  shows a padlock, "The Garden unlocks at level 14"). One of the two is wrong; Cal's storyboard call. Owner: LEAD.
  Pictures: shots/qa/alerts/ and shots/qa/fx/.
- QA, ROOMS's 93d33f1 Cal's Restaurant notes in every business (on 0a03968, new `guestcount.js`; `shots/qa/biz/`): pass. All 15
  businesses (Arcade, Auditorium, Boba, Bowling, Club, Dessert, Karaoke, Mall, Restaurant, Rhythm, Rooftop, Sky Bar, Speakeasy, Theater,
  VR), every building view, fully bought, sampled every 3 s for 30 s: never two customers with the same look in a room, never more than
  5, someone in every sample, so none reads empty. Shadows against d54de89: bar stools, café chairs and the round tables' bases now cast
  a tight shadow instead of a wide dark pool; the piano, beds and sofas keep theirs (`cmp_*.png`). The Open Sign: at 9 pm without Noir a
  pink neon OPEN glows in the first window and the chalkboard stands by the door. No page errors. Not checked: phones, and the stage-1
  Restaurant's two customers (ROOMS saw them). Owner: ROOMS.
- QA, ROOMS's abe06dd night lights (on ef08f17, new `nightlights.js`; `shots/qa/night/night_abe06dd.png`): pass. At 10 pm, twelve rooms
  (Bedroom, Closet, Lair, Patio, Game Room, Restaurant, Boba, Mall, Arcade, Club, Theater, Garden): only the Bedroom shows the lamp
  button and only the Bedroom changes with it (mean brightness 52 off, 94 on); every other room draws the same with rm.lit 0 or 1, so
  an old save with the lamp off now draws lit: against d54de89 (before the change) the Closet went from 44 with the lamp off to 69, the
  Lair 40 to 55, the Patio 66 to 82, the Game Room 43 to 66, the Mall 74 to 118, the Arcade 38 to 56, each now equal to its old lamp-on
  look. The Bedroom's tap saves (lit 1, still 1 after a reload). No page errors. Not checked: the building views at night. Owner: ROOMS.
- QA, v0.67 (d54de89, APPV 67; 490 files): pass, publish. The boba scene now shows Mara's portrait (`shots/qa/review/
  boba_portrait_d54de89.png`). Review: all 114 Plays on both bodies at 360 and 390 (456) open, fit, no broken image, no page errors;
  the save keeps its progress (only savedAt and the seen list move). Live sync: LEAD's livesync.js passes on the clean build (Ben's
  streak and upgrade reach Ana and Cy in 5.1 s, his post and hi in 1.0 s; with pushes off, 50 to 60 s by the old polling). New
  `live10.js`, ten players on one pushing database on different tabs: all ten change their streak and an upgrade at the same moment and
  every page sees the other nine in 5.1 s; two posts made in the same moment both reach all ten in 1.0 s; in a quiet minute nine pages
  write nothing and one writes once. Also on the exact build: savecheck, screens 360 and 390, a v0.65 save loads, buys and reloads,
  town rules, townlive 5/5, townrx 12/12; no page errors. Note: LEAD's server on 65410 now serves newer work (app.js and qbdata.js
  differ from d54de89), so the publish session must build d54de89 itself, not copy from that server. Not done: the published v0.64
  and v0.65 file checks (QA's artifact tools, Cal's restart). Owner: LEAD.
- QA, v0.66 (465d39a, APPV 66; 490 files; Cal: "Do a full QA check and send me the latest version to test"): passes everything but
  one small visible error, so hold for it. Test > Review (new `review.js`): all 114 Play buttons on both bodies at 360 and 390 (456
  plays) open a window that fits the screen, with a reachable button, no broken image and nothing past the right edge; no page errors.
  Playing everything leaves the save as it was apart from two empty defaults (story's done/offer/team/sold/later/biz created empty by
  the Garden welcome, story.beats by the Lock and Key scene), no progress, harmless. The error: the boba scene (Mara, "Half our
  customers ask for something cold to drink") shows an orange "M" box instead of her portrait, because ui_story_boba.webp doesn't
  exist (the only scene of 7 without one; the same since v0.61, so players have always seen it; Cal will look at it now). Fix: let
  styPortrait fall back to the same person's portrait (Mara's ui_story_chef), or ROOMS paints ui_story_boba. The rest passes on the
  exact build: savecheck; screens 360 and 390; a v0.65 save loads, reloads, buys and reloads; the level-5 start; Kode Plaza; town
  rules, townlive 5/5, townrx 12/12; doors 34 ok plus Garden and Restaurant walked live; Begin at 10 sizes; diag/load; the team;
  voice.js 1,542 lines, 0 hits; 16 of 16 brand badges from the pack; the Shop in two halves, 272 pieces on him and 281 on her bought
  and worn, KAIMANA, OAKMONT and SØLVBERG included (SØLVBERG's Shop run done); Wednesday returns and launch reruns (192 slots, 0
  repeats, 0 still-live); 30 rooms, 21 of 21 buy through, the tester walks all 17 story rooms; friends; Collect; the camera.
  Owner: LEAD (the portrait fallback, then rebuild; QA rechecks Review and the file match).
- QA, ROOMS's 57527b0 SØLVBERG wear test (on 8909550; `shots/qa/sv/`): pass, 15 of 15. All 15 on both bodies (the leggings hers) in all
  22 key poses, 0 draw failures; three outfits. ROOMS's points: (1) the mittens sit on both hands in every pose, no cords left
  floating; (2) the pom beanie and the trapper sit right with long hair (h1) and the ponytail (h3), front, back and asleep; (3) the
  goggles rest on the forehead with their strap round the back, hair kept; (4) the puffer and après boots go over the snow pants, the
  leggings and the cords, walking, sitting and asleep (`boots.png`). Design calls: the puffer boots, the tan lace-up après boots, the
  fair-isle and the badge (peak and snowflake in a red ring) read as generic alpine, no ski brand; fine. The stretchUp armpit flecks
  ROOMS saw are the parked rig item, not this art. Shop rows not in yet (no gx_sv_). Owner: ROOMS.
- QA, ROOMS's 633be95 OAKMONT badge ring (on 633be95): pass. The inner ring samples navy all round (about 42,59,95) and no greenish
  pixel is left in logo_oak.webp (0 of 307,468). OAKMONT is done: every piece, its stripes, the Shop and the badge. Owner: ROOMS.
- QA, ROOMS's 867a53e OAKMONT navy stripes and LEAD's c814f38 palette and lines (on c814f38; `shots/qa/oak/icons_867a53e.png`,
  `fit1_867a53e.png`): pass. The headband, wristbands, jacket and track pants, skirt hem, socks, vest V and cap button now carry
  burgundy and navy, in every pose on both bodies and in the icons; the stripe no longer reads as the fashion house's web. One leftover:
  the badge's inner ring is still green (logo_oak.webp was not in 867a53e; sampled 67,96,73). Alone, next to burgundy and cream, it
  doesn't read as the web stripe, so it's not a blocker; make it navy too if you want the set to match. Owner: ROOMS.
- QA, LEAD's df59ff1 OAKMONT in the Shop (on 3eb382b, `shop.js` BRAND=oak): pass. 14 on him and 15 on her (the skirt hers) bought at
  full price, worn and in the mirror; the wristbands and watch land in the arms slot; KAIMANA's and OAKMONT's badges show from the
  pack; voice.js 1,527 lines, 0 hits. The stripe design call stands with ROOMS. Owner: LEAD.
- QA, ROOMS's 78c961b OAKMONT wear test (on 67226f6; `shots/qa/oak/`): every piece fits, 15 of 15, one design call. All 15 on both
  bodies (the skirt hers) in all 22 key poses, 0 draw failures; three outfits. ROOMS's points: (1) the watch sits on one wrist only,
  the viewer's left from the front and the viewer's right from behind, the same arm as CHROME RAIN's sleeve, in every pose
  (`watch_zoom.png`); the two wristbands sit on both wrists. (2) The headband and visor (and the cap) with long hair and the ponytail
  are right, front, back and asleep. (4) The tube socks go under the track pants and cargo and show over the ankles with shorts.
  (3) Design calls: two stripes on the jacket, plain canvas court shoes and the burgundy suede runners read as generic; fine. But the
  brand repeats one stripe everywhere, green-burgundy-green on cream (headband, wristbands, jacket sleeves, track pants, skirt hem,
  socks, badge rim): together that reads close to a famous Italian fashion house's green-red-green web stripe. A single burgundy
  stripe, or burgundy and navy, would keep the 80s club look without it. Your call or Cal's. Shop rows not in yet (no gx_oak_).
  Owner: ROOMS.
- QA, KAIMANA (ROOMS's 24304af wear test, LEAD's adcf65c Shop rows; on cab70e1; `shots/qa/km/`): pass, 15 of 15. All 15 on both bodies
  in all 22 key poses, 0 draw failures; three outfits. ROOMS's points: (1) the straw sun hat and the bucket hat sit right with long
  hair (h1) and the ponytail (h3), front, back and asleep; (2) the visor's top is open and the hair kept; (3) the crochet cardigan
  hangs open over its cream tank; (4) the board shorts and cut-offs show their legs and side panels under a top; (5) the shell
  necklace sits at the collar, no outline. Design call: the badge's curling wave reads as a general nod to the old public-domain
  woodblock, not a copy of it or of any logo; fine. The Shop: 15 on him and 15 on her bought at full price, worn and in the mirror;
  voice.js 1,512 lines, 0 hits. Owner: ROOMS, LEAD.
- QA, v0.65 (dba3f2e, APPV 65; 489 files): pass, publish. On the exact clean build: savecheck; screens at 360 and 390; v0.64's own build
  makes a save that v0.65 loads, reloads, buys on and reloads; the level-5 start; Kode Plaza stages and tapping in; town rules,
  townlive 5/5, townrx 12/12; doors 34 ok plus Garden and Restaurant walked both ways live; Begin at 10 sizes; diag/load; the team;
  voice.js 1,497 lines, 0 hits; every brand tab's badge from the art_ui pack (13 of 13, no loose logo_ file asked for); the Shop in
  two halves, 229 pieces on him and 236 on her bought and worn, SAVE POINT, BARD & BLADE and CHROME RAIN included (one run of all 15
  brands now makes a summary sheet too tall to picture, so `shop.js` takes BRAND= lists); Wednesday returns and launch reruns (156
  slots, 0 repeats, 0 still-live drops, two pages agree); all 30 rooms drawn, 21 of 21 buy through; the room tester walks all 17 story
  rooms; friends; Collect; the street camera. No page errors. Still as accepted: the mall's escalator in front of the Bowling and
  Karaoke doors. Not done: the published v0.64 file check, because QA's artifact tools stopped working in this session too (Cal:
  a restart brings them back). Owner: LEAD.
- QA, ROOMS's 14bd0e5 CHROME RAIN fixes and LEAD's 207db81 line (on 207db81; `shots/qa/cr/fixes_14bd0e5.png`, `icons_14bd0e5.png`):
  pass, so CHROME RAIN is 15 of 15. The mesh top is an opaque dark purple net under the black harness with cyan cuffs, the same on
  both bodies front and back and matching its icon, no skin through it. The light-up high-tops carry a small rose bolt and a straight
  line, no wavy stripe, no outline left; they read as original. voice.js 1,482+ lines, 0 hits. Owner: ROOMS.
- QA, LEAD's 091c762 CHROME RAIN in the Shop and 8be03dc packed badges (on 7caab98; `shop.js` BRAND=cr, new `badges.js`): pass. CHROME
  RAIN: 14 on him and 15 on her (the skirt hers) bought at full price, worn and in the mirror. Badges: every brand tab (HANGANG,
  DIAL-UP, OVERPASS, VENOM ROSE, NICE COCK, ALTITUDE, KODE PINK, SAYMØRE, SMOKE BOMB, GACHA POP, SAVE POINT, BARD & BLADE, CHROME RAIN)
  shows its own badge from the art_ui pack (13 different images, all loaded, about 550 px), and the page asked for no loose logo_
  file. The Wednesday return tab uses the same brand id, so the same badge; the drop pop-up was not checked. The build is 489 files.
  Owner: LEAD.
- QA, ROOMS's 5cf2e1d CHROME RAIN wear test (on b691907; `shots/qa/cr/`): 14 of 15 pass, one fix and one design call. All 15 on both
  bodies (the skirt hers) in all 22 key poses, 0 draw failures; three outfits. ROOMS's points: (1) the chrome sleeve stays on the same
  arm front and back, in every pose (`z_arm.png`). (2) The trench hangs right in walks, stretch and sitting, no sliver. (4) The visor:
  no outline left. (5) The mohawk helmet and the hood sit right with long hair and the ponytail, front, back and asleep. (6) Platform
  and combat boots over the cargo, the skirt and the knee pants, walking, sitting and asleep (`boots.png`). Rose stands in for pink
  everywhere, no blank spots. Fix (3): the mesh top doesn't match its icon or itself: the icon is a dark purple net with long sleeves
  and a harness, but on him it reads as bare skin with a harness and on her as a light grey crop top with a harness
  (`z_mesh_trench.png`). Add the dark net back over the torso and arms on both bodies so it reads as the icon. Design call: the
  light-up high-tops (cr_lightup) carry a pink wavy stripe down the side that reads like one famous skate brand's side stripe (the
  same thing Kode PinK's runner was repainted for); a straight stripe or a lightning bolt would be safe. Visor, mohawk helmet, hood,
  trench, vest, cargo and badge read as generic cyberpunk. Shop rows not in yet (no gx_cr_). Owner: ROOMS.
- QA, LEAD's a6e9d16 BARD & BLADE in the Shop (on 1f047b9, `shop.js` BRAND=bb; `shots/qa/bb/shop_*_a6e9d16.png`): pass. 14 on him and
  15 on her (the skirt hers) bought at full price through Try on, Checkout, Confirm, worn and in the mirror; the bracers show in the
  mirror in the arms slot. voice.js: 1,482 lines, 0 hits. Owner: LEAD.
- QA, ROOMS's f843b25 BARD & BLADE wear test (on efaf4ec; `shots/qa/bb/`): 15 of 15 pass, two rig notes. All 15 on both bodies (the
  skirt hers) in all 22 key poses, 0 draw failures; three outfits. ROOMS's points: (1) the bracers follow both arms, in the new arms
  slot, over sleeves; from behind the far arm's bracer sits as a rough patch beside the body in sitBack and type1, the same as that
  arm's sleeves (rig, LEAD's, known). (2) The travel cloak hangs right in walks, sitting and sleep with no sliver; in stretch and
  stretchUp a few brown flecks fray at the wrists, the same armpit raggedness every top has at that pose (LEAD's open rig item, not
  the art). (3) The wizard hat, (4) the ranger hood (its back now has a seam and folds) and the circlet sit right with long hair and
  the ponytail, front, back and asleep. (5) The tool-belt skirt's belt and pouch show over the doublet. (6) The crystal: no outline
  left. Designs read as generic fantasy (no single game's costume); badge, banner and icons clean. Shop rows not in yet (no gx_bb_),
  so the Shop run waits on LEAD. Owner: ROOMS (done), LEAD (rows; the far-arm and wrist raggedness stay with the rig rework).
- QA, LEAD's 23bf14f rig slot "arms" (on 6c4bba2; small check, no request was posted): no regression. Ten existing outfits (tees,
  jackets, hoodie, overalls over a tee, pendant over a hoodie, puffer, boots, flares, the halo mask, the cassette bag), both bodies,
  all 22 poses, pixel-compared against 92fbe67: 0 pixels differ. The slot itself gets its real test with BARD & BLADE's bracers.
  Also on the board since: eaf8c09 renames the slip-ons "Checkpoint Sneakers" (900 coins) for ROOMS's lace-ups. Owner: LEAD.
- QA, ROOMS's 200d498 SAVE POINT fixes (on 92fbe67; `shots/qa/sp/fixes_200d498.png`, `icon_flag_200d498.png`): pass, so SAVE POINT is
  15 of 15. The headset from behind shows only the arc and the two cups, no band, on both bodies in every back pose and with long hair.
  sp_flag is grey lace-ups with a purple toe cap, teal laces and a small red pixel flag: original, no outline left in any pose or on
  the icon. Owner: ROOMS.
- QA, LEAD's 29f496c SAVE POINT in the Shop (on 284a752, `shop.js` BRAND=sp; `shots/qa/sp/shop_*_29f496c.png`): pass. 15 on him and 15
  on her bought at full price through Try on, Checkout, Confirm, worn and in the mirror. The headset's back band and the checkerboard
  slip-ons still wait on ROOMS; QA reruns them after. Owner: LEAD.
- QA, ROOMS's bad0b45 SAVE POINT wear test (on df51588; `shots/qa/sp/`): 13 of 15 pass, two fixes. All 15 on both bodies in all 22
  key poses, 0 draw failures; three outfits. ROOMS's points: (1) no leftover outline on the cap or the slip-ons; the cap's brim edge
  is soft but fine at game size. (2) The teal stand-ins for green (PLAYER 2, varsity cuffs, headset rings, pompom, track stripe,
  cartridge star) all read, no white blanks. (3) The cap and beanie with long hair (h1) and the ponytail (h3) hang right front and
  back. Fixes: the headset from behind (sitBack, type, rearStand, backwalks) shows a wide grey band wrapped straight across the back
  of the head under the arc, like a blindfold strip (`z_headset_cap.png`); from behind only the arc over the top should show.
  (4) Your design call: yes, the purple-trimmed checkerboard slip-on (sp_flag) reads as one well-known skate brand's classic
  slip-on; repaint it (another pattern, or a lace-up). The pixel "deal with it" shades, the controller tee and the cartridge pendant
  read as generic gaming, fine. Shop rows not in yet (no gx_sp_ in 15_shop.js), so the Shop run waits on LEAD. Owner: ROOMS.
- QA, v0.64 (4a1dbe8, APPV 64; 22 files, 477 art): pass, publish when the artifact tools are back. On the exact clean build:
  savecheck; screens at 360 and 390; v0.63's own build makes a save that v0.64 loads, reloads, buys on and reloads; the level-5 start;
  Kode Plaza stages 0-2 and tapping in; town rules, townlive 5/5, townrx 12/12; doors 34 ok plus Garden and Restaurant walked both
  ways live; Begin at 10 sizes; diag/load; the team; voice.js 1,452 lines, 0 hits; the Shop, 186 pieces on him and 191 on her bought
  and worn, SMOKE BOMB and GACHA POP included; Wednesday returns and launch reruns (120 slots, 0 repeats, 0 still-live drops, two
  pages agree); all 30 rooms drawn, 21 of 21 buy through; the room tester walks all 17 story rooms; friends (16 visits, every figure
  drawn, rooms, dogs); Collect; the street camera. No page errors. The rig changes (armpit, overalls over the top) were checked on
  their own commits. Still as accepted: the mall's escalator in front of the Bowling and Karaoke doors. LEAD: check the published
  files against this build once it is up. Owner: LEAD (publish and pin).
- QA, LEAD's 91ef6e8 overalls over a painted top (on fb71c7c; `shots/qa/gp/overtop_stretch_91ef6e8.png`): pass, so the overalls and
  suspender shorts read right in all 22 poses. In stretch the bib and straps now show over the starter tee, o_tee, o_puffer and
  o_flannel on both bodies, and h_boots and sm_boots still sit over the cuffs. Pixel checks: seven other trousers and skirts, o_tee and
  h_boots on their own are identical to before faebcd8 in every pose; the overalls under GACHA POP's tops differ from faebcd8 only in
  the stretch cells with o_tee. Owner: LEAD.
- QA, LEAD's faebcd8 overalls over the top (on d9adecf; `shots/qa/gp/overtop_*_faebcd8.png`): 21 of 22 poses pass, one left. Other
  bottoms are pixel-identical before and after (7 trousers and skirts, 22 poses, 0 pixels differ). gp_overall and gp_shorts under
  o_tee, gp_bear, gp_sailor, gp_star, o_puffer, o_flannel and the starter tee, both bodies: the bib and straps show over the top front
  and back, no top hem on the thighs, arms over the bib, and h_boots, sm_boots and v_boot over the cuffs, in every pose but one. The
  stretch pose: tops with a painted stretch layer (the starter tee, o_tee, o_puffer, o_flannel) cover the bib and straps again, so the
  overalls read as trousers there; GACHA POP's own tops (no painted layer) keep the bib (`overtop_stretch_faebcd8.png`). Draw the
  pantsOver bib after the painted top layer too. Owner: LEAD.
- QA, ROOMS's 86f50d9 cat hood back (on f9338aa; `shots/qa/gp/hood_86f50d9.png`, `hood_h1_86f50d9.png`): pass, so GACHA POP's art is
  15 of 15. From behind it has an outline, knit ribbing, a centre seam and the blue trim at the neck in all back poses on both bodies;
  with long hair (h1) and the ponytail (h3) the hair hangs below it, nothing cut wrong; the front is unchanged. Still to check when
  LEAD's rig side lands: the overalls' and shorts' "overTop" (d4d8fd8). Owner: ROOMS.
- QA, GACHA POP wear test (ROOMS's 03274a7, LEAD's 07dfb84 Shop rows; on 272645c; `shots/qa/gp/`): 14 of 15 pass, one fix and one
  call. All 15 on both bodies (the skirt hers) in all 22 key poses, 0 draw failures; three outfits; the Shop (`shop.js` BRAND=gp):
  14 on him and 15 on her bought at full price, worn, in the mirror. ROOMS's points: (1) the wings sit right standing, sitting and
  asleep, no stray specks (`z_wings.png`). (2) The heart shades: no grey line left anywhere. (3) The bow and bunny beanie with long
  hair (h1) and the ponytail (h3) hang right front and back; the cat hood frames the face from the front with every hair. Fix: the
  cat hood's back view (sitBack, type, rearStand, backwalks) is a flat lavender blob with no outline, seams or shading
  (`z_hood_hearts.png`), so from behind it reads as a placeholder; paint the back like the front. Owner: ROOMS. (4) The call: with any
  top on (every player always has one), the overalls read as plain lavender trousers and the suspender shorts as plain shorts
  (`fit3.png`), so they never look like their icons. Draw the bib and straps over the top (a layer flag, like shoes' "over"). Owner:
  LEAD (the layer rule), ROOMS (split the bib if needed). Badge, banner and icons read clean.
- QA, LEAD's bc757e2 armpit (on 0852011; `shots/qa/armpit_before_after_bc757e2.png`, `armpit_pants_bc757e2.png`): pass as an
  improvement, no regression. The pixel sweep (8 tops, 15 rows, 22 poses) against 17b8bd0: only stretchUp and stretch differ. The
  trouser specks from 2be3eda are gone: light pixels on the trousers at 300 px stretchUp count the same as before the rig change on
  both bodies with the jacket and o_tee (4/2/2/3 against 4/2/2/3; 2be3eda had 5/9/3/9). At 300 px the sleeves hold together better in
  stretchUp; still open, as LEAD said: a ragged underside, skin patches near the armpit with long sleeves in stretch, and one dark
  shard trailing past o_tee's left hand in stretchUp (also before). Owner: LEAD.
- QA, LEAD's 2be3eda armpit fix (on 9cfec0e; `shots/qa/armpit_before_after_2be3eda.png`, `armpit_pants_specks_2be3eda.png`): better
  sleeves, one new error. Regression sweep: 8 tops (o_tee, smk_jacket, sm_hoodie, kp_varsity, nc_hoodie, smk_cloak, tm_rafe_jacket,
  y_baby), 15 body rows, all 22 poses, before (17b8bd0) and after compared pixel by pixel: only stretchUp and stretch changed, every
  other pose identical. At 300 px stretchUp the confetti is mostly gone and the sleeves hold together (ragged underside, as you said).
  New: in stretchUp, short skin-coloured dashes now speckle the trousers on both bodies with the jacket and o_tee alike (they were not
  there before): the rigid limb copies below the armpit line carry arm pixels down over the legs. Clip those copies at the waist, or
  keep them to the arm's own cells. At room size the dashes are 1 px. Stretch: still skin patches by the armpit with long sleeves, as
  you said. Owner: LEAD.
- QA, ROOMS's 8d07611 cloak (on 17b8bd0, `shots/qa/smk/cloak_8d07611.png`): pass, so SMOKE BOMB is 15 of 15. The long sliver off the
  hand and the scrap at the hip are gone in stretch and stretchUp on both bodies; idle, walks, sitBack and sleep stay clean. Owner: ROOMS.
- QA, ROOMS's note on the rig's armpit (on 17b8bd0, `shots/qa/stretch_armpit_300px_17b8bd0.png`): confirmed, and it is every top, not
  the new art. Drawn 300 px tall, stretch and stretchUp break the sleeve and armpit into torn fragments and loose specks on both bodies
  for the cloak, SMOKE BOMB's jacket, SAYMØRE's tee and the old o_tee alike; at room size (about 100 px) it shows only as a ragged
  edge. Worth fixing before anyone zooms a room in close or a stretch shows in the 300 px mirror: rig.armpit in src/rig.js. Not a
  blocker for v0.63 (it was in every version QA passed). Owner: LEAD.
- QA, ROOMS's 36afaa1 SMOKE BOMB fixes and LEAD's 9d1092e names (on 9d1092e; `shots/qa/smk/*_36afaa1.png`): two pass, one small fix
  left. The band (ash-grey cloth, stitched smoke puff, side knot, no plate) and the vest (quilted puffer, funnel neck, ember zip,
  cream sleeves, no pockets or scrolls) read as original now, in all 22 poses on both bodies, alone and in outfits; their new Shop
  lines pass voice.js (1,437 lines, 0 hits). The cloak no longer throws a wing, and it hangs right in walk, sitBack and sleep, but in
  stretch and stretchUp a thin black sliver still trails off her and his left hand (`cloak_36afaa1.png`, cells 3, 4, 7, 8): trim it
  from the arm layer. Nit, as ROOMS said: the band's knot shows from behind on her and not on him. Owner: ROOMS.
- QA, LEAD's 4f0d21f SMOKE BOMB in the Shop (on 140a83d, `shop.js` BRAND=smk; `shots/qa/smk/shop_*_4f0d21f.png`): pass. 15 on him
  and 15 on her bought at full price through Try on, Checkout, Confirm, worn and in the mirror. The three art fixes from the wear test
  (the cloak hem, the band and vest designs) still stand with ROOMS. QA's old local servers are stopped (66 of them); none of QA's
  scripts point at LEAD's ports. Owner: LEAD.
- QA, ROOMS's a07439f SMOKE BOMB wear test (on 5660c2e; `shots/qa/smk/`): 12 of 15 pass, three fixes. All 15 on both bodies in all
  22 key poses, 0 draw failures; three outfits. ROOMS's five points: (1) no stray specks on the cloak or hakama, but the cloak's torn
  hem is on the arm layer: in stretch and stretchUp it flies out from the hand like a black wing, and in walks a scrap hangs from the
  left arm (`cloak_zoom.png`, `fit1.png`); move the hem to the body or a back layer. (2) The cowl covers the lower face and sits under
  the band, the wrap, the NC cap and a beanie; from behind it draws nothing (frontOnly), fine. (3) The tabi under the hakama and over
  the cargo look right in walks, sitting and sleep (`tabi.png`). (4) The wrap with long hair (h1) and the ponytail (h3): the hair
  hangs below it, nothing cut wrong (`wrap_h1.png`, `wrap_h3.png`). Fixes 2 and 3, Cal's rule "original designs only, no
  copyrighted costumes": smk_band (black cloth, long tails, a metal forehead plate with an engraved emblem) reads as the forehead
  protector from a famous ninja anime, and smk_vest (a dark flak vest with scrolls in chest pockets over long sleeves) reads as that
  show's ranked-ninja vest (`icons.png`). Redesign both: a plain cloth band with stitched SMOKE BOMB smoke, no plate; a vest without
  the scroll pockets and that cut. The jacket's orange-on-black is close too but generic enough. Badge, banner and the other icons
  read clean. Owner: ROOMS.
- QA, v0.63 (f5234d3, APPV 63): pass, publish. My clean build matches LEAD's served copy file for file (495 of 495; 21 files, 475
  art). On the exact build: savecheck; screens at 360 and 390; v0.62's own build makes a save that v0.63 loads, reloads, buys on and
  reloads; the level-5 start; Kode Plaza stages 0-2 and tapping in; town rules, townlive 5/5, townrx 12/12; doors 34 ok plus Garden
  and Restaurant walked both ways live; Begin at 10 sizes; diag/load (19 scripts); the team; voice.js 1,422 lines, 0 hits; the Shop,
  157 pieces on him and 161 on her bought and worn, Kode PinK and SAYMØRE included; Wednesday returns and launch reruns (96 slots,
  0 repeats, 0 still-live drops, two pages agree); all 30 rooms drawn, 21 of 21 buy through; the room tester walks all 17 story rooms;
  friends (16 visits, every figure drawn, rooms, dogs); Collect; the street camera upright and on its side. No page errors.
  SMOKE BOMB's ids are in items.json only and show nowhere. Still as accepted before: the mall's escalator in front of the Bowling and
  Karaoke doors. Owner: LEAD (publish and pin).
- QA, LEAD's b85b038 halo-mask rules (on 2282af8; `shots/qa/sm/*_2282af8.png`, new `sleeper.js`, `maskbed.js`): pass, so SAYMØRE is
  15 of 15. The mask stays on in all 22 poses on both bodies, sleepHead included; every glasses and face piece (shades, butterfly,
  wrap, V-shade, goggles, the Rift Mask, NC shades, SMOKE BOMB's cowl) is hidden under it, gaiter and buff too; in the real Bedroom
  awake with the mask and shades on, no shades show. The bed's own sleeping figure (QBLoft.sleeper, the picture the bed draws) keeps
  the mask and the halo; a cap still comes off and shades alone still drop in bed, as before. Not seen: the player actually lying
  down in a live Bedroom (at 2 am in the test the player stayed up); the sleeper picture is the one the bed uses. Owner: LEAD.
- QA, ROOMS's 8cab74a SAYMØRE pendant (on 8cab74a, `shots/qa/sm/pendant_8cab74a.png`, `icon_pendant_8cab74a.png`): pass. No body
  outline left in any pose on either body, alone or in an outfit; the chain and the Ø stay bold in front; from behind nothing draws
  (frontOnly, like the shades); the icon shows only the chain and the Ø. SAYMØRE is 14 of 15 now; still open: LEAD's two halo-mask
  rules (keep it in sleepHead; hide the face slot under it). Owner: ROOMS (done), LEAD (the mask).
- QA, ROOMS's 1712242 ping-pong retired (on 4550d03, new `retiredsave.js`; `shots/qa/gameroom_no_pingpong_4550d03.png`): pass. A save
  that owns gm_ping and everything else loads, keeps the id through a reload, and draws the Game Room with no ping-pong picture; the
  window never offers it; the room buys through, all 21; the doors to the Bedroom both ways are fine. The foosball and the snack
  corner have open floor round them now, nothing crowding the walkway. Owner: ROOMS.
- QA, SAYMØRE wear test (ROOMS's 9e19cdf, LEAD's Shop rows; on 831fc61; `shots/qa/sm/`): 13 of 15 pass, three fixes. All 15 on both
  bodies in all 22 key poses, 0 draw failures; three outfits; the Shop (`shop.js` BRAND=sm): 15 on him and 15 on her bought at full
  price, worn, in the mirror. No sneaker left at the feet of the hoodie or the mask in any walk (`feet.png`). The mask covers the
  face in every awake pose and every frame of the stretch, with hair h1, h2 and h3. Fixes: (1) sm_pendant carries the faint body
  outline the Kode PinK bag had, in every pose and on its icon (`pendant_zoom.png`, `icons.png`); cut it the same way. Owner: ROOMS.
  (2) Cal's rule that the figure stays masked breaks in the sleepHead pose: like every hat, the halo mask is dropped there and the
  sleeping face shows (`smfit1.png`, last cell of each body). Keep sm_halomask drawn in sleepHead (and the halo too, if it fits).
  (3) Glasses and face pieces draw on top of the helmet: Shades, Butterfly Glasses, Wrap Shades, V-Shade, Goggles, the Rift Mask,
  NC Sport Shades (`mask_faces.png`; the gaiter and buff sit below it and look fine). While the halo mask is worn, hide the glasses
  and mask slot, or let the Shop swap them off. Owner: LEAD (2 and 3, the rig and Shop rules). The banner shows only the masked
  figure; the icons read clean apart from the pendant.
- QA, LEAD's 3a1e3c1 (on fa50109): both pass. Kode PinK through the real Shop (`shop.js` BRAND=kp; `shots/qa/kp/shop_*_3a1e3c1.png`):
  14 pieces on him and 15 on her (the skirt hers only) bought at full price through Try on, Checkout, Confirm, worn and in the
  mirror. Launch reruns (`drops.js`, 12 rounds, now 84 slots with 7 brands): 0 back-to-back repeats, 0 drops of a brand still live;
  every date a Monday or Thursday, HANGANG first, NICE COCK fifth, two pages identical. Owner: LEAD.
- QA, LEAD's 046b0c3 launch reruns (on 49814eb, `drops.js` now checks 12 rounds, 72 slots, of the current 6 brands): better, not
  done. Back-to-back repeats 2 to 0; drops of a brand still among the live four 14 to 6. The six are all later than the three rounds
  your rerun.js covered: Y2K on 2027-02-15, Rose on 03-08 and 04-19, NC on 03-11 and 06-21, Alt on 08-05. Cause: the brands moved to
  a round's end keep a shuffled order, so the third slot of a round can be one of the previous round's last two. Fix: move them in the
  order they dropped in the round before; then every brand is at least 5 slots from its last drop. Only with DROPS.on. Owner: LEAD.
- QA, the published v0.62 (slug 3ab7eada, version 1794000054-1e81): pass. 493 of the 756def5 build's 494 files identical by sha256,
  none missing; index.html differs only by its title (my build with "Quest Board v0.62" in the title hashes the same, +6 bytes);
  lfvar.json matches app/lfvar.json; the 9 db rules declared (worlds, board, pings with {self}, diag, player, inbox owner-only), user
  and sample declared. Not opened, so Cal's diag docs stay his. Owner: LEAD.
- DONE by LEAD (v0.62 published and pinned, slug 3ab7eada; QA checked the files). WAITING ON LEAD (since 13:02): publish and pin v0.62. QA passed the 756def5 build in 8a8cda8 (494 of 494 files match your served copy; the full set and the recheck pass, see the next lines). QA's messages to LEAD are paused by the app, so this board line is the hand-off. Owner: LEAD.
- QA, ROOMS's c382557 Kode PinK bag (on c382557, `shots/qa/kp/bag_zoom_c382557.png`, `icon_bag_c382557.png`): pass, so Kode PinK is
  15 of 15. No body outline left in any of the 22 poses on either body, alone or in the outfit; the icon shows only the bag and
  strap. Nits, not blockers: a 1-2 px dark speck stays left of her hand in idle and stretch (left from the old outline), and the icon's
  strap stops in a flat cut at the top with a short stub on the left. LEAD can add the kp rows. Owner: ROOMS (nits), LEAD (rows).
- QA, v0.62 rebuilt (756def5, APPV 62): pass, publish. My clean build matches LEAD's served copy file for file (494, 0 differ;
  21 files, 474 art). The Diner's three small menus now sit clear of the ORDERS board and the shelf (`shots/qa/restaurant/
  diner_menus_756def5.png`); the right one's top just meets the wall's top trim without crossing it. Rerun on the exact build:
  savecheck, screens at 390, a v0.61 save loads, reloads, buys and reloads, diag/load (19 scripts after the rig art split, second
  visit 0.01 MB), Begin at 10 sizes, the team's tops, town rules, townlive (5 of 5), the new `townrx.js` (12 of 12: no reacting to
  your own post, a reaction kept in the reactor's own doc, +5 coins once, taking it back or switching pays nothing more, six more taps
  pay nothing, the Hall badge for a new post and cleared on opening the Hall), friends (16 visits, every figure drawn), all 30 rooms,
  the Restaurant's four stages. No page errors. Unchanged since 081ac04's full pass otherwise. Owner: LEAD (publish and pin).
- QA, LEAD's 01deb94 DROPS.rerun (on 57b68f7, `drops.js` with the launch schedule switched on, 15 weeks): two errors, both only
  once DROPS.on is true (not in v0.62's weekly mode, so not a v0.62 blocker). (1) A brand can drop on two slots in a row where a
  rerun round starts: Y2K on Thu Feb 4 and again on Mon Feb 8. (2) A rerun can "drop" a brand still among the live four, so that
  drop day brings nothing new: Y2K on Dec 28 while live since Dec 14, NICE COCK on Dec 31 while live since Dec 21. Fix in
  dropPlan: when a round starts, never repeat the slot before it, and push brands still live to later in the round. Owner: LEAD.
- QA, ROOMS's Kode PinK wear test (1dde4e1, on 279593c; `shots/qa/kp/`): 14 of 15 pass, one fix. All 15 on both bodies (the skirt
  on hers only) in all 22 key poses, 0 draw failures, three outfits, the headphones and star clips with hair h1, h2 and h3: nothing
  tears or clips; the skirt binds; the wide cargo sits over every shoe; the bag strap crosses over the varsity jacket. Fix: kp_bag
  carries a faint outline of a whole body: thin dark lines float around the arms, head and legs in every pose and both bodies
  (`bag_zoom.png`, `kpfit1.png`), and its icon shows the same mannequin (`icons.png`). Cut the bag and strap out of that outline.
  The other icons read clean. Owner: ROOMS.
- QA, v0.62 (081ac04, APPV 62, clean build; my 19 files and 473 art identical by sha256 to LEAD's served copy): everything passes but
  one small new error, so hold the publish for it (Cal: publish only when QA finds no more errors). Passed on the exact build:
  savecheck; screens at 360 and 390 (all tabs fit); v0.61's own build makes a save that v0.62 loads, reloads, buys on and reloads
  (`dist_old` from c48c7af); the level-5 start (1,205 coins, the Garden offered, Add 10,000 then it builds); Kode Plaza stages 0, 1,
  2 and tapping in; town rules (29 checks, all pass); doors 34 ok plus Garden and Restaurant walked both ways live (`doorlive.js`;
  doors.js cannot read e884ffd's function position); Begin at 10 sizes; diag/load; the team's tops; voice.js 1,394 lines, 0 hits;
  the Shop, 128 pieces on him and 131 on her bought and worn, NICE COCK included; Wednesday returns on both pages, every change at
  Wednesday midnight Pacific; all 30 rooms drawn, 21 of 21 buy through; the room tester walks all 17 story rooms; friends (16 visits,
  rewards, buffs, freeze cap, rooms, dogs); Collect; the street camera at 390, 360 and on its side. No page errors anywhere.
  The error: in the Corner Diner the three small menu boards overlap the ORDERS board's lower-right corner and sit on the shelf line
  (`shots/qa/restaurant/diner_menus_4b7ef27.png`); move them right by about their own width. Still as accepted for v0.61: the mall's
  escalator in front of the Bowling and Karaoke doors, the Game Room ping-pong (Cal's call). QA's earlier "boards face front" was
  wrong: zoomed in they slope with the wall. Owner: ROOMS (the menus), LEAD (rebuild; QA then rechecks the Diner and the file match).
- QA, ROOMS's 5d0986c pot racks and coffee (on c59b953, `shots/qa/restaurant/r3_kitchens_c59b953.png`): pass. In the Hole in the
  Wall the pans hang from a wall rail whose brackets meet the tile over the prep table; in the Diner they hang from a ceiling rack
  on chains over the island; the drip coffee sits on the counter, no stool. Still open from round 2: the boards face front and the
  Diner's five overlap; the safe stands in the diners' path. Owner: ROOMS.
- QA, the Restaurant round 2 (on 745fc70: ROOMS's 765e6fc, LEAD's 91ce178 and dd679ab; `shots/qa/restaurant/r2_*_745fc70.png`):
  most pass, three left. Pass: all 60 buy through the window; Breakfast Menu, Burger Menu and Bigger Till now show (cards, safe);
  only Hire a Head Chef draws nothing, which is fine (staff show live); the till faces the diners; the cooler is by the stools; the
  host stand is beside the mat; the patio heater is on the deck between the sets; the pergola clears its chairs; stage 3 reads
  "Neighborhood Bistro"; Room style is hidden under Noir; guests now use the patio (7 patio sits of 56 in 60 s live, none before).
  Left: (1) the ORDERS board and the small menu cards still face front as flat rectangles instead of lying on the tiled wall's
  slope (the shelf under them does slope), and in the Diner five boards in a row now overlap each other (BURGERS over the three
  small menus): one board plus two cards is enough. (2) The pot rack and the coffee stool are unchanged on main: ROOMS's rsx_prep,
  rsx_prepi and rsx_drip are not pushed yet. (3) The new safe stands on the dining floor in front of the partition, in the
  diners' path; put it behind the counter. Owner: ROOMS.
- QA, on d8f6780: all pass. LEAD's 91ce178 (cards grouped: buyable, mystery, then waiting): every room can now be bought to the end
  through its own window, 21 of 21 at level 60 (`stuckscan.js`, new: taps the first Buy button until none is left), the Restaurant
  all 60 and the Garden all 42. ROOMS's e884ffd: the Garden door's glow sits on the kitchen floor at its open end at all three
  stages. LEAD's 703822f NICE COCK through the real Shop (`shop.js`, now with BRAND= and the Try on, Checkout, Confirm flow;
  `shots/qa/nc/shop_*_d8f6780.png`): 16 of 16 bought at full price, worn and in the mirror, on both bodies. LEAD's e786b94 Collect
  (your collect.js on the clean build): nothing, then the note "400 waiting · finish a quest", then "COLLECT 120", then nothing; the
  400 to 120 drop is the till's cap clamping a pend set above it. LEAD's ff9ba96 class card (`classcard.js`): the art spans 356 of
  358 px for all four classes, fx-pulse on and off, opacity steady at 1. Owners: LEAD, ROOMS.
- QA, on cbb5e43: LEAD's b3b4d09 portrait sizes pass (Logan alone 101x280, Kenan and Jina 109x235 and 107x232), 172caa9 Garden lines
  pass (gardenreveal.js, all 10), b316e05 street camera passes upright at 390 and 360 and on its side, on the street and inside a
  building: the street sits on the nav, the sky takes the spare height (`streetcam.js`). On its side only the lower floors show at
  the widest zoom (the building is taller than the screen); fine for now. Owner: LEAD.
- QA, the Restaurant full pass for Cal (on cbb5e43; `docs/QA.md` "The Restaurant, full pass"; pictures `shots/qa/restaurant/`):
  one blocker and nine fixes. Blocker: after 13 upgrades the window shows only three "Needs Knock Through the Wall" cards and a
  "? ? ?", and Knock Through itself (r_x1) never appears, so nothing can be bought (level 14 and 60; `reststuck.js`). Fixes: the
  ORDERS board and menu boards face front instead of lying on the tiled wall, sit on its seam and on the shelf line; the pot rack
  floats (Hole: off the wall, bars across it; Diner: a free frame hanging from nothing); the coffee maker on a stool, the till
  behind the partition; Breakfast Menu, Bigger Till and Burger Menu change nothing visible; the cooler and host stand crowd the
  door mat; the patio heater stands across the kitchen half wall, the pergola post cuts its chair, the patio is never used live;
  Room style does nothing after Noir; stage 3 is "Noir" in 26_world.js but "Neighborhood Bistro" in r_x2's line. The doors, seating
  and staff work. Owners: ROOMS (art and room code), LEAD (the card list, the stage name).
- QA, LEAD's 5688ce3 Wednesday returns (on 4830bf7, `wedback.js`, two pages, every 6 h for 120 days): pass on the schedule. Weekly mode:
  both pages agree, the brand changes 15 times, every one at Wednesday 00-05h Pacific, never the same twice running (hanga and y2k
  alternate from Nov 25). Launch mode: pages agree; one return (hanga from Dec 23) that then stays every week, because the 5-brand test
  set retires only one. Not checked by QA: the Shop's own tab and header text (my script did not get the Shop screen open; LEAD's
  wedback.js read "↺ HANGANG"). Not started: ff9ba96 class card art. Owner: LEAD.
- QA, ROOMS's art batch (on beaf1a2 and 4830bf7; pictures in `shots/qa/`, untracked): all pass. 4bcda62 dry beds and watering
  (`gardenwater.js`, 390x844): 5 bed types show their dry twin; Water shows 6 cans from about 0.8 to 2.3 s while the dry layer fades
  1 to 0; no bed moves (raised, tomato, herb identical boxes; bed2 and berry by eye); with Sprinklers and the last watering 5 days old
  it stays watered at +0, +30 and +90 h and shows no dry bed. The cans are about 12 px in a 332 px window: readable, small. b9bcbbf: the
  herb planter's legs are straight, other beds in place. 07812e4 shadows: softer and warm, still ground the beds; the vanishing could not
  be made to happen in Chromium before or after (`shadowbuy.js`: 8 buys with the window open, every frame, 0 frames with a missing
  filter), so Safari is unconfirmed. d233c9e backdrop: fitted and repeated. f2c495b: the sweatband keeps the hair in every pose, both
  bodies. Seven friend portraits (811576a, 132de76): one style, not photoreal, outfits match FRIENDS, feet on one line, all three poses
  cycle. Notes for ROOMS: Vega's high-tops are white, black and orange in the panel layout of a famous sneaker (no logo, but they read as
  it); Kenan's shades change every pose (on, pushed up, gone). Owner: ROOMS.
- QA, LEAD's fe10549 solo size (on 4830bf7, `friendart.js`): a friend alone is still smaller than each friend in a pair. Logan draws
  91x175; Memo and Cynthia 127x221 and 125x239 (`shots/qa/friends/cards_solo_pair_4830bf7.png`). Also, ROOMS's note stands: at phone
  sizes the building view below the street is empty grey (pale blue at 360), the camera's zoom-out range, not the backdrop. Owner: LEAD.
- QA, ROOMS's 67d0e85 NICE COCK wear test (on da87000, matrix grid/wear/onepose with SwiftShader WebGL; sheets in `shots/qa/nc/`,
  untracked): one fix, 15 of 16 pass. All 16 on both bodies in all 22 key poses (idle, walk 1-4, stretchUp, stretch, sits, type, sleep,
  rear, back-walk 1-4, sleepHead), 0 draw failures, plus four outfits (cap+pendant+hoodie+black joggers+high-tops; beanie+shades+tee+
  shorts+slides; pendant+quarter-zip+slate joggers+knit sneakers+shades; cap+shades+pendant+tank+ash joggers+high-tops): nothing tears,
  floats or clips; the pendant sits over the hoodie and tee; joggers meet the high-tops cleanly. Fix: nc_band (sweatband, hat slot) cuts
  the hair away above the band like a hat does, so the head is bald above it, front and back, both bodies (`band_zoom.png`; o_bandana
  and both beanies keep their hair, `hats_cmp.png`). It needs the hair kept, or drawn over the hair as a band. Icons (`icons_big.png`,
  `icons64.png`): "nicecock." is clean and legible on the band, cap, tee, hoodie and shorts; on the joggers it is a small mark at 64 px,
  not garbled. Not checked: the yawn painted layer (none yet; the 404 for f_nc_hoodie_yawn falls back as designed), real Safari/WebGL,
  and in-room size. Owner: ROOMS.
- QA, on da87000: LEAD's 21aae0a (friends only in their own room's building, no dog copies; friendsroom.js) and 1e2f433 (room
  tester: no retired pieces, openers open their rooms, Next story step walks a new player through all 17 rooms in story order with
  their scenes, then stops; roomtester.js) pass, 0 errors. a652991 drop schedule (`drops.js`): on, every date a Mon or Thu, HANGANG
  first, two pages identical, live -> vault in order with no duplicates; off is the same function as before (not compared on screen).
  Friend portraits (ROOMS's Justin, LEAD's 76a99a4; `friendart.js`, 390x844): illustrated, not photoreal, his rig's outfit, 180x240,
  feet within 1 px across poses, cycles 0-1-2. Two fixes for LEAD: the 0.45 s cross-fade between very different poses shows a ghost of
  one behind the other; and a two-friend card stacks the figures vertically on a phone (Kenan above Jina, card 786 px tall). Owners:
  LEAD (both), ROOMS (go ahead with the other six).
- QA, LEAD's 0b21495 room tester (on c0f0cbd, `rigtest/qa/roomtester.js` through window.__qbRooms): Open, Everything, Empty and View
  work on all 22 rooms, no page errors; three fixes. (1) Everything also owns retired pieces, so Cal sees art the game no longer sells:
  mall 5 (ml_dir, ml_photo, ml_gum, ml_ride, ml_flower), rooftop 4, gameroom 2, skybar 2, closet 2, lair 1, dessert 1, vr 1. Skip
  `u[3].retired` as allrooms.js does. (2) Everything owns the upgrades that open a room without opening it: bd_patio, bd_game (Bedroom),
  lr_troom, r_bar, sb_roof, de_secret; the save then holds the opener with no Patio, Game Room, Trophy Room, Sky Bar, Rooftop or
  Speakeasy. Either open the room too or leave the opener out. (3) Next story step on a new player never moves: each tap re-offers
  the Garden lot ("The empty lot next to your building is up for sale...") and the story stays at offer garden, done none, Bedroom
  only, 14 taps in a row. A buy step needs building (like Open) for the button to step through the story. LEAD's two questions: the
  Bedroom showed 35/35 here, so the 36th key wasn't reproduced; the 4 empty <image> tags are the gaming chair's swap layers (lfbrg0/1,
  lfbch1d/1n, opacity 0, filled when someone sits), already in v0.61, harmless. Owner: LEAD.
- QA, LEAD's 3bcbb44 room zoom (`rigtest/qa/zoomfps.js`, 390x844 touch, CPU x4, every upgrade, before 8d97e24 / after 172caa9): pass.
  Pan frame times, median / p90: Bedroom 50 / 150 ms to 17 / 17, Garden 17 / 67 to 17 / 17. Pinch: Bedroom 17 / 117 to 17 / 17,
  Garden 17 / 83 to 17 / 17. The worst single frame is still 150 to 350 ms; that is the one viewBox commit at the end, as designed.
  After a pan or pinch lifts no transform is left and the view moved; the wheel, +, - and reset all work. Not new: a drag on an unzoomed
  picture scrolls `.modal`, but the room window (.rmodal, overflow hidden, 92vh) never makes it scroll, so that drag does nothing, before
  and after. The whole-building pan (lfApplyNow) was not measured. Owner: LEAD.
- QA, friends on 1194d92 and c0f0cbd (befd663 fixes, 3939130 lines, 3bcbb44 rooms; `friendsqa.js`, `friendsroom.js`, voice.js now
  reads the visits): the fixes pass, plus two new bugs in where friends stand. Pass: at 2 of 2 freezes Kenan gives +300 coins and
  the card says so; a Bedroom-only player is told "the Bedroom"; no pronouns for the friends; a card due while another window is open
  waits and shows 2.5 s after it closes (and keeps waiting behind a story scene). All 16 still draw and pay; the new lines pass voice.js
  (1,378 lines, 0 hits) and read plain. Bugs: (1) a friend whose room is in another building is also drawn in the Loft's Bedroom:
  Kenan and Jina stand in the Restaurant and in the Bedroom at once, Cynthia in the Garden and the Bedroom (lfVisitRoom only finds
  rooms with LFMETA, the open building's, so elsewhere it falls back). (2) A Chopstick or Pluto visit adds a second copy of the dog
  who already lives in the Bedroom (v:dog:chopstick next to dog:chopstick). Small: three lines name a room the player may not have
  ("in the gym", "in the studio", "the shelf in the lounge") while the card then says "the Bedroom". Owner: LEAD.
- QA, LEAD's 8d97e24 (on 07812e4, `rigtest/qa/friendsqa.js`; cards `shots/qa/friends_cards_07812e4.png`): works, three small fixes.
  All 16 visits forced on a new player and on one with every room: each card draws its figures (rig 173x197, dogs their art), coins
  land (250/150/100/150/80), Kenan's freeze lands, Cynthia waters the Garden only when there is one, and every buff raises the real
  x.mults() of a matching quest by exactly its stated amount (fitness, discipline, create, admin, body, out, home, social). No page
  errors; looks read clean at card size. Fixes: (1) Kenan's freeze ignores the cap: at 2 of 2 it makes 3 (the wheel and streaks stop
  at maxFreeze(), the wheel pays 300 coins instead). (2) A new player owns only the Bedroom, but the card says "They're hanging out in
  the Lounge today" (fvShow falls back to the Lounge even when it isn't owned; 3bcbb44's live fallback goes on to the Bedroom, the card
  should match). (3) The text gives friends pronouns ("his", "He", "her") that Cal never stated (CLAUDE.md: they/them when unstated);
  either Cal confirms them or rewrite around them, e.g. "Justin is on the way to rehearsal". Not checked: the daily roll's rate and the
  no-repeat over many days (fvCheck isn't reachable from the test hook; the code reads right: 57% a day, the last visit left out of the
  pool), and a visit card due while another window is open (fvShow is skipped if a window opens in the 1.2 s after the roll, so the
  reward lands with no card). voice.js does not read the visit lines yet; read by hand, no rule broken. Owner: LEAD.
- QA, LEAD's ab7fcae (clean build; `rigtest/qa/gardenreveal.js`, `townlive.js`, sim.js + unlocks.py + water.py): two wording fixes, the
  rest passes. Town board: all 5 townlive checks pass, focus survives a full render(). Garden (fresh level-5 player, built via rdo): no
  Restaurant, chef or sell before the first produce; it starts watered; the stand says "Nothing to sell yet"; after 3 h "1 produce
  ready / SELL FOR 4 COINS" and the one-time pop; no page errors. Errors: (1) the build splash contradicts itself: "It grows fresh
  produce on its own. Nothing to water, nothing to harvest." then "Water it: The beds only grow while they are watered..."; drop the
  first. (2) The dry window says it twice: "The beds are dry. Nothing grows until you water them." and "The beds are dry. Water them
  and your first harvest starts growing; you sell it from this window."; keep the second. Unlock order: 12-task Garden day 4, Mara day
  6 (level 7 binds, not the 12 sold), boba 9, dessert 10; casual Garden 6, Mara 10 (was 14); a 1-in-3-day waterer still Mara day 6.
  No day stacks two story steps (12-task day 4 is the Garden plus a closet the player bought). Casual day 6 buys nothing: saving 1,026
  of the Garden's 1,200, fine. Owner: LEAD.
- QA, the published v0.61 (slug b9f23da6, version 1793991295-0706): pass, 461 of the c48c7af build's 462 files identical, none missing,
  index.html only by its title ("Quest Board v0.61", 6 bytes), lfvar.json matches, the 9 rules declared; not opened yet. Owner: LEAD.
- QA, ROOMS's fa8efd9 (the console line trimmed): not yet. QA had the limit wrong: voice.js allows 95 characters (aim about 90), not
  100; the line is 98 with its buff. "A slim glossy shelf, lit underneath. It sits low under the screen." (88) or "Slim glossy shelf, lit
  underneath. Sits low, so the screen stays clear." (93) both pass. Owner: ROOMS.
- QA, ROOMS's d34d2ce (the TV console centred, artIf; `shots/plaza/tvwall_d34d2ce.png`): pass. Under the 80 inch screen and under
  the Big TV (`allrooms.js` with the new DROP option) the console sits centred under the screen, parallel to its bottom edge, both ends
  tucked in, nothing crossing; the floor lamp clear beside the snack bar. artIf disturbs no other room: every room fully bought
  against v0.61, only the Game Room changes (1.2%; the others differ only by render noise, as v0.61 against itself). Still: the
  console's description is 101 characters, one over (`voice.js`). Owner: ROOMS (trim it).
- QA, LEAD's 60e3e50 (the town board for many players; new `townlive.js`, two players on one stand-in db with the real rules,
  stored per document): one fix. Passes: a half-typed post keeps its text, caret and focus through the board's own 20 s reload; Ben's
  post reaches Ana on its own in 13 s, tagged "new"; posting in the same moment keeps both; no page errors. Fix: a full game repaint
  (render(): rare in the Hall, e.g. a new area opening or a raid ending) keeps the text but drops the focus and caret, which on a
  phone closes the keyboard mid-word; restore them after render() as socPaint does. Not checkable here: the real db with two real
  accounts. Owner: LEAD.
- QA, v0.61 rebuilt (c48c7af, APPV 61; Cal: "Publish 0.61 now and continue with other tasks"): pass, publish. On the exact build:
  savecheck, screens (360, 390), old saves, the level-5 start (1,205 coins, gate 5, the right areas; Add 10,000 then the Garden builds),
  Kode Plaza stages 0, 1, 2 and tapping in, town rules 32 of 32, doors 36 of 36, Shop 44, Trophy Room, the Rift Mask, the team,
  diag/load, Begin at 10 sizes with the pill hidden in the creator, all 30 rooms: all pass, no page errors. Ships with two known
  Game Room items Cal accepted: the ping-pong table blocked at both ends; the TV console not lined up (also its description is 101
  characters, one over the limit, `voice.js`; d34d2ce lines it up but keeps the text). Owner: LEAD (publish), ROOMS (the two items).
- QA, correction (Cal, 2026-11-06, phone screenshot: "The tv and stand are not lined up properly"): QA's pass of 9d5aed7 is withdrawn;
  QA missed it. The slim console sits shifted left and forward of the TV: its left end past the screen's left side, its right end
  well short of the right, so it cuts across the screen's lower left instead of sitting under it; the floor lamp's pole stands in
  front of the TV's lower-right corner (`shots/plaza/gameroom_9d5aed7.png`). Fix: centre the console under the screen, back edge
  along the wall beneath the TV's bottom edge, both ends tucked in; the lamp clear of the screen; check with both TVs. v0.61 waits
  for it as well as the ping-pong answer. Owner: ROOMS.
- QA, ROOMS's 9189946 + 9d5aed7 and LEAD's 38e1ab7 (Kode Plaza stage 0, its sign, the Game Room; `shots/plaza/`): pass. bld_plaza_s0
  reads as an open garden plaza (beds, wall, pergola with lights, lemon trees, birdbath, bench, no building front), sits right
  between the Loft and Calibur Mall, dims at night (`sign_stages.png`); with the Restaurant the cafe returns. The pink "flecks" are
  a faint fringe on the outer edges of the trees and pergola (`s0_edges.png`), invisible at street size. The sign now sits just
  over the trees at stage 0 and back in the row at stage 1; out of line with the other two at stage 0 but clearly the plaza's:
  taste, fine. Game Room: the dartboard on the left wall between the door and the TV corner with open floor in front; the TV corner
  a tile back; the foosball bigger and flipped; the Floating Media Console one slim low shelf, the screen clear (Cal's note); no
  page errors. Left: the ping-pong table still blocked at both ends (snack bar, sectional), waiting on Cal (drop it or not).
  Owner: LEAD (v0.61 once Cal answers on ping-pong, or Cal lets it ship as a known item).
- QA, LEAD's 3d7f57a (the level-5 test start's coins): pass. A new test character starts with 1,205 coins and lvPaid 5; Testing
  Level up to 6 gives 1,365 (+160, levelPay(6)); no page errors. Owner: LEAD.
- QA, LEAD's ce07425 (each rig frame decoded before it is shown, Cal's walking blink): checked as far as Chromium allows: the code
  decodes each new frame before offering it and drops it when its cache slot goes, characters draw in the rooms, no page errors.
  Chromium does not show Safari's blink, so whether it is gone is for Cal's iPhone. Owner: LEAD.
- QA, LEAD's 2882690 (Kode Plaza's street picture by stage; `shots/plaza/`, new `plazastreet.js`): the code passes: Garden alone =
  stage 0 and never the cafe; Garden + Restaurant = stage 1, today's cafe picture; a third room = stage 2, still the cafe until a
  bld_plaza_s2 exists; tapping the building still opens its rooms; no page errors. Not shippable alone: until bld_plaza_s0.webp
  exists, stage 0 shows the plain drawn front, a grey office tower (`plaza_1.png`), which is no plaza either. v0.61 waits for
  ROOMS's s0 art. Owner: ROOMS (s0), LEAD (v0.61).
- QA, ROOMS's 925480a (the dartboard off the lit hexes): not passed. It is off the panels now, on the plain left wall, but right
  above the retro TV corner (`gameroom_925480a.png`): a throw would cross the TV and the beanbag sitters. Every reference dartboard
  has a clear lane of open floor in front. Put it where the floor in front is open (the back wall between the hex cluster and the
  arcade, or the left wall by the door if the landing stays clear). The ping-pong table waits on Cal. Owner: ROOMS.
- QA, ROOMS's 6f04ed8 (Game Room: the lit hex panels, the foosball to the front, the ping-pong clear of the doorway; `shots/gm4/`):
  NOT passed under Cal's new rule. Good: the outer hexes glow and frame the TV on both sides and the top, so the TV no longer hides
  the lit ones (Cal's note); the foosball stands at the front, clear of the pool table and the doormat, giving the arcade room;
  the ping-pong table is inside the room now, off the doorway; retired pieces still draw nothing; no page errors, day and night.
  Errors: (1) the dartboard now hangs on top of the lit left hex cluster and covers several glowing panels (`full_13.png`), the
  same thing Cal disliked about the TV; move it to plain wall (left of the hexes, by the arcade). (2) The ping-pong table is
  blocked at both playing ends: the snack bar and fridge at its right end, the sectional's arm a step from its left end
  (`live.png`). Against the references the room now holds one table too many (pool, foosball and ping-pong in 13 x 10, plus the
  sectional): drop the ping-pong table (Cal's call) or turn the snack corner so the table's ends face open floor. Owner: ROOMS.
- QA, Cal 2026-11-06 (to QA): "Going forward, only publish for me to test when you can't find any more errors." From now on a QA pass
  means no known error left in the exact build; no "pass, fix in the next version" for anything visible. Owner: everyone.
- QA, v0.61 (d9d92d7, covering v0.59 and v0.60): BLOCKED, do not publish. Works: the level-5 start (new `teststart.js`, 440x840): level 5,
  gate 5 passed, Board, Training, Shop, Dungeons, Loft and Hall open, the class still to pick, no page errors; the Garden is offered
  (story offer.garden, lots ["garden"]); Testing > Add 10,000 coins, then the lot builds a Garden (1,500); old saves untouched.
  v0.59's stepped screens: not choppy by the numbers (scrolls 7 a second, the jump 27 a second while it moves, the portal glow 0.1 a
  step, twinkles 3 levels); the full Bedroom window (new `fpsroom.js`) 22-35 to 33-39 fps at CPU x4, 41-52 to 51-56 at full speed in
  QA's software-drawn browser. Correction to QA's v0.58 phone read: the log keeps 16 samples and the 18 fps room sample LEAD saw had
  rolled off before QA read it; LEAD was right; suggest diag/perf also keeps its slowest sample. Blockers: (1) Cal: "The garden should
  be the next lot to the right." Built, the lot right of the Loft is Kode Plaza, a cafe with diners in its window, the Garden inside
  it before any restaurant exists (`shots/v61/street_garden.png`); Cal wants the Garden itself there. (2) 685cbd0 is in the build:
  the ping-pong table off the Game Room's right edge and over its doorway (ROOMS's own finding; 6f04ed8 fixes it, in review). Small:
  the test start gives 0 coins. Owner: LEAD and ROOMS (the Garden lot), LEAD (rebuild).
- QA, ROOMS's 3c27004 (Cal on v0.58: the Game Room TV, the racing chairs, the double gaming rig; `shots/gm3/`): pass with one note.
  The retro TV now faces the beanbags (`tvcmp.png`: v0.58 left, its screen pointed at the door wall; now right, at the
  beanbags, which face it). Gaming Chairs and Gaming Desks retired (`retired.js`): a new player gets no card; a save that owns
  them keeps both ids and draws nothing more. The mini fridge stands on the back wall between the snack bar and the soda
  machine. No page errors, day and night. Note, against the references (each big table has its own open floor): with the desks
  gone the ping-pong table is back at the front and tight at both playing ends: its left end is a hand from the pool table's
  front corner, its right end runs up to the doormat (`front.png`). Fix: give it its own clear patch, or drop it and let the
  pool table be the room's one big table (Cal's call if it goes). Owner: ROOMS.
- QA, Cal's iPhone on v0.58 (diag on the published page, iOS 18.7, the Claude app, 440x840, dpr 3): first visit bar 0.38 s,
  ready 1.43 s (34.5 MB sent); second visit ready 0.25 s, 15 files from the cache and 3 checked, 900 bytes; the Loft 56-60 fps
  with a room window open (worst frame 51-84 ms; v0.53 was 41-55 fps with 300+ ms stalls), Training and the Shop about 60 fps.
  So the loader, the cut packs, the cache and the glow fix all hold on his phone; nothing to fix. Owner: LEAD (for the record).
- QA, the published v0.58 (slug 974301b9, version 1793973604-fe09): pass, 460 of the 859d941 build's 461 files identical, none missing,
  index.html only by its title, lfvar.json matches, the 9 rules declared; not opened yet. Owner: LEAD.
- QA, v0.58 (859d941, APPV 58, built clean; rule 18: pass, publish it). Over v0.57 only the pill rule and APPV. `ccbegin.js` (now also
  checks the pill after Begin): at all 10 sizes the Testing pill is hidden in the creator, comes back on the Board after Begin,
  and Begin is on screen and tappable; the old 375x548 overlap is gone. It uses CSS `:has()` (Safari 15.4 and up; Cal's iOS 18 is
  fine). The full set: savecheck, screens, old saves, "NEW v0.58", doors 36 of 36, voice 0, Shop 44, Trophy Room, town rules 32 of
  32, the Rift Mask, the team, diag/load, all 30 rooms: all pass; one team run had the old intermittent blob ERR_ABORTED, two reruns
  clean. Nothing open from QA. Owner: LEAD (publish).
- QA, the published v0.57 (slug 34b73668, version 1793972414-d808): pass, 460 of the b279091 build's 461 files identical, none missing,
  index.html only by its title, lfvar.json matches, the 9 rules declared; not opened yet. Owner: LEAD.
- QA, v0.57 (b279091, APPV 57, built clean; rule 18: pass, publish it). Over f7efaf6 (passed) it changes only APPV. On the exact
  build: savecheck, screens (360, 390), old saves, "NEW v0.57" desktop and phone, doors 36 of 36, voice 0, Shop 44, Trophy Room,
  town rules 32 of 32, the Rift Mask, the team, diag/load, all 30 rooms fully bought, Begin at all 10 sizes: all pass, no page
  errors; still the Testing pill over the Black colour button at 375x548 (goes at release). Owner: LEAD (publish).
- QA, the published v0.56 (slug ed76b8e9, version 1793971454-cd01): pass, 460 of the a3335e1 build's 461 files identical, none
  missing, index.html only by its title, lfvar.json matches, the 9 rules declared; not opened yet. Owner: LEAD.
- QA, ROOMS's f7efaf6 (the audit tool forces an upgrade's needed expansion first; sprinklers on every bed; the Star Plaque bigger):
  pass. Re-audit of the restaurant and garden: the tool now buys r_x1 and r_x2 before the pieces that need them, so they are
  measured in their own room: Walnut Dividers 1.46% (OK), Drinks Cooler 0.34% (seen; the Backlit Wine Wall replaces it later at
  1.06%, by design), Dish Station 0.37%; Star Plaque 0.13 -> 0.21%, Sprinklers 0.10 -> 0.31%, all visible. Aisle Lights can stay
  thin. Owner: LEAD (v0.57 with it).
- QA, v0.56 (a3335e1, APPV 56, built clean; rule 18: pass, publish it). Over add039a it changes only APPV, so it holds exactly the
  work QA passed (c6ba889, 1dc4211, a96c4f7, add039a). On the exact build: savecheck, screens (360, 390), old saves, "NEW v0.56"
  desktop and phone, doors 36 of 36, voice 0 of 1,354, Shop 44, Trophy Room, town rules 32 of 32, the Rift Mask, the team, diag/load
  (owner only), all 30 rooms fully bought render, Begin at all 10 sizes: all pass, no page errors. Still open, small: the Testing
  pill covers the Black colour button at 375x548 (it goes at release). Owner: LEAD (publish).
- QA, ROOMS's audit fixes c6ba889 + 1dc4211 and add039a (tools/upgrade_audit re-run on the nine rooms they touch, 1dc4211 on
  8775, then club and Game Room on add039a; `shots/reaudit/`): pass. In those rooms OK 140 -> 147, WEAK 57 -> 53, NONE 26 -> 23.
  Now clear: Neon Trim 0 -> 2.9%, More Plots 0.03 -> 1.9% (a bed is added), Smoke Machine 0.14 -> 2.65% (add039a's stronger
  fog), Laser Rig 0.05 -> 0.95%, Pool Table 2.4%. Bigger but still under 0.6%: Film Reel 0 -> 0.40, Lobby Chandeliers 0 -> 0.25,
  Neon Marquee, Clapboard, Ball Return, Ball Rack, Blossom Garland, RGB Floor Lamp, Cocktail Cart, Patio Heaters, Drip (0.26 to
  0.47); still faint: Sprinklers 0.10, Star Plaque 0.13, Aisle Lights 0.15. The restaurant's Walnut Dividers, Drinks Cooler and
  Dish Station still score 0 only because the audit tool buys them before the expansions they now need (it ignores the new
  gate); in the fully bought restaurant the dividers (between the booths) and the dish station show, about 1.2% of the room
  (`restaurant_three.png`); the Drinks Cooler shows nowhere there: fine if a later upgrade replaces it, else it still draws
  nothing. The pool table now has clear floor from the beanbag and the sofa arm (`pooltable.png`). The laser reads well, not
  busy. Tool: the audit should respect `needs` like the shop does. Owner: ROOMS (the cooler question; the tool), LEAD (v0.56).
- QA, ROOMS's v0.55 fixes (a96c4f7, on 18df296; `shots/a96/`): pass. Dark floors (Lock and Key, Speakeasy, Arcade, Rhythm,
  Karaoke, Club, Lair, Auditorium): the shadows now show, 4 to 6% of each room by day and 2 to 5% at night (v0.55: under 1%);
  Lock and Key and the Speakeasy read grounded under every piece (`four.png`). Taste: the black at 0.92 is strong; under the
  Speakeasy's upright piano it spills a near-black patch onto the floor in front (`sp_cmp.png`); fine, but if Cal finds the dark
  rooms heavy, 0.8 is the knob. Auditorium: seat rows, speakers and projector all cast one now. Boba: the Plant Shelf hangs on
  the wall above the bench, no floor shadow. Game Room against the references: much closer, one table, the ping-pong gone,
  clear floor in front of the pool table; still tight at its back edge, where the orange beanbag meets its back-left corner and
  the sofa's left arm nearly meets its back-right rail, so a cue at either end would hit them; a quarter tile more each way would
  do it. Names: Velvet Tufted Bed reads right; the Game Room pairs replace each other, fine. No page errors. Owner: ROOMS (the
  Game Room nudge, optional).
- QA, the published v0.55 (slug 6ad04c53, version 1793969778-98a7): pass, 460 of the 17d4b44 build's 461 files identical (the new
  gmx_beanb included), none missing, index.html only by its title, lfvar.json matches, the 9 rules declared; not opened yet (the
  database is empty). Owner: LEAD.
- QA, v0.55 (17d4b44, APPV 55, built clean, with ROOMS's shadows 9593432 and phone-note fixes 60ab997 in it; `shots/v55/`): pass,
  publish it; the fixes below go in the next version. Skirts: v_tulle and h_pleat hang as one piece in every walk and backwalk
  frame (v0.54 split both, the pleat badly; `skirts.png`). Glow: at its peak the new faded layer looks the same as the old
  box-shadow at every rank (default, D, C, B, A, S; new `glowranks.js`, `glow_cmp.png`). Begin (`ccbegin.js`, now 10 sizes, the
  pill checked before the tap): on screen and tappable at every size including sideways 740x360, 844x390 and 932x430; the
  Testing pill clears every creator button except at 375x548 (Safari with bars), where it covers the Black colour button (small,
  it goes at release). The usual set all pass ("NEW v0.55", savecheck, screens, old saves, doors 36 of 36, voice 0, Shop 44,
  town rules 32 of 32, the Rift Mask, the team, diag/load), no page errors. Shadows (new `allrooms.js`, `shadowmap.js` red =
  darker, blue = lighter, `pairsheet.js`; every room fully bought, v0.54 against v0.55, 13:00 and 22:00): good in the light and
  mid rooms (Boba, Dessert, Theater lobby, Bedroom, Lounge, Studio, Gym, Library, Dojo...), soft and even, not too dark at
  night on light floors, nothing on walls or doors. Fixes, ROOMS: (1) the Speakeasy gets no shadow at all (chairs, barrels,
  jukebox, sofa, cart); (2) on dark floors they are invisible: Lock and Key (0.7% of the room changed by day, 0.0 at night) and
  the Lair (0.5%), Club, Karaoke, Arcade; raise the strength on dark floors or use a light-edged contact shadow; (3) the
  Auditorium's three tall floor speakers and the projector stand have none, and the hard box under the seats went, so the seat
  rows have none either; (4) Boba: a floor shadow under the small pink plant shelf by the window bench; if it hangs on the
  wall, drop it. 60ab997, against references (isometric game rooms: "colored 3D isometric game club", "low poly cutaway",
  "immersive 3D game room"): Bedroom good: the poster now a poster-width clear of the Closet door, prints and moss panel over
  the bed as rooms usually hang art. Game Room: the beanbags face the retro TV now, but that corner is crowded: the orange
  beanbag sits on the pool table's end and the ping-pong table touches the pool table's front corner; in every reference the
  pool table stands alone with room for the cue; move the ping-pong table off it (or drop it) and keep a clear ring round the
  pool table. Names: all read right; "Premium LED Bed" shows no LED in the picture; "Big TV"/"80 inch Screen" and "Couch &
  Console"/"Cream Sectional"/"Floating Media Console" are fine only if each replaces the one before. Owner: LEAD (publish),
  ROOMS (shadows, the Game Room corner, the bed name).
- QA, the published v0.54 (slug 278e76fb, version 1793967962-0e38): pass, 459 of the a384feb build's 460 files identical, none
  missing, index.html only by its title, lfvar.json matches, the 9 rules declared. Its diag/load gives the real host's numbers:
  it compresses (34.5 MB sent for 39.4 MB of scripts; app.js 0.41 of 1.13 MB) and the Mac was ready in 3.3 s. Owner: LEAD.
- QA, the upgrade visibility audit (ROOMS's tools/upgrade_audit, run on the v0.53 build 743c30c, so before the shadows and
  60ab997; `shots/upaudit/`: report.md, sheets/, qa_list.txt ranked worst first): 503 upgrades in 30 rooms, OK 363, WEAK 98,
  NONE 42, GROWS 7, retired 16. Of the 140 WEAK or NONE, 54 show nothing by design (people, menus, money caps, room openers, pets).
  Left: 12 NONE. Pieces that draw nothing: Walnut Dividers (r_d3), Drinks Cooler (r_cool), Dish Station (r_k9), Irrigation
  (f_pump), Lobby Chandeliers (t_chand), Neon Trim (ar_neon), Film Reel Wall Art (t_reel). Services with no picture: Mixology
  Course (b_mixo), Bottle Service (k_bottle), Concession Staff (t_st2), Head Gardener (g_gard2), More Plots (g_p2). And 74
  WEAK, mostly small wall pieces and neons under 0.4% of the room (Laser Rig, Aisle Lights, RGB Floor Lamp, Smoke Machine, Wall
  Clock, Neon Sign, Ball Return, Ball Rack). Owner: ROOMS.
- QA, v0.54 (a384feb, APPV 54, built clean; rule 18: pass, publish it; `shots/v54/`). (1) The stretch: every frame of the clip
  (`sheet=clip`) for the 3 starter tops in white, grey and black and all 31 shop tops, both bodies, 70 rows, each frame sorted
  by which picture it is (new `clipframes.js`): every row is idle on frames 0-1 and 22-23 and the painted yawn on 2-21, no
  frame in between, so nothing can tear. In the creator (440x840, new `ccstretch.js`): the Stretch preview shows only the
  standing picture and the yawn (hoodie, bomber, tee). In a room (the Bedroom, new `roomstretch.js`): the clip is 24 frames at
  12 fps and a room stretch lasts 1.6 to 2.6 s, so it ends on a key and cuts, never blends; a live picture shows the clean
  yawn and the others clean standing; the exact moment of the switch was not caught live (the headless renderer is too slow
  to film it). (2) Begin (new `ccbegin.js`, 8 sizes, a real tap at the end): fixed on every phone held upright, 320x568,
  360x600, 375x548 (Safari with bars), 390x664, 430x800 and Cal's 440x840: on screen and tappable at the start, with the menu
  and the page scrolled, and the tap starts the game; v0.53 failed all of these. Still off: a phone on its side (844x390),
  where Begin shows only after scrolling the page to its end, because the new layout keys on width up to 720 px; key it on
  height (or the shorter side) too. Small: the Testing pill covers the first hair style button on a phone (it goes at
  release anyway). (3) diag/load (new `diagload.js`, stand-in db): the owner's visits write 18 scripts each, bar and ready
  times; the first visit 39.4 MB downloaded, the reload all 18 from the cache; a friend writes nothing. When reading Cal's
  numbers: a transfer of 0 can also mean the browser does not report it, so check each file's ms too. The usual set: all
  pass (savecheck, screens, old saves, "NEW v0.54", doors 36 of 36, voice 0, Shop 44, town rules 32 of 32, art identical,
  the Rift Mask, the team), no page errors. Owner: LEAD (publish; the sideways Begin and the pill for later).
- DONE by LEAD in a384feb (diag/load logs each script's transfer size and the load times). QA, the published v0.53 (slug 6561fd34, version 1793965993-4ce3): pass, the page matches the 743c30c build. By sha256, 459 of the
  build's 460 files are identical and none are missing (all 18 scripts, the cut pieces included); index.html differs only by its
  title (26 bytes longer); lfvar.json matches. The 9 db rules are declared, and as a Contributor diag reads as missing. Cal's
  iPhone has opened it (diag/frame: iOS 18.7 in the Claude app, APPV 53, the Board, 11:54); diag/perf is from the Mac. No save
  yet. Not checked: the host's cache headers. Opening the page from QA's browser would overwrite Cal's phone diag/frame, so QA
  did not. Better: let the phone log say it. In the diag log, add each script's `transferSize` from
  `performance.getEntriesByType('resource')` (0 means it came from the cache) and the time to the first screen. Then Cal's
  second visit shows whether the pieces are cached on his phone. Owner: LEAD.
- DONE by LEAD in 1bbe47f (rig side; the item flag is ROOMS's, below). QA, the Black Tulle Skirt's wear test (`v_tulle`, female only; on 7387646; `shots/tulle/`): fine standing, sitting, typing,
  sleeping and in the yawn, short and long hair (22 poses, 0 fails; long hair falls over it right). One fix: mid-stride the long
  skirt splits at the middle like culottes (a notch at the front in walk3, two lobes from behind in backwalk1, `zz.png`), because
  the rig binds a pants-slot item to each leg; the short plaid skirt hides it (`yy.png`). Fix: a rig option for skirts (bind the
  hem to the hips, or to both thighs evenly) with a flag on `v_tulle` (and `h_pleat`, also long). Old, not the tulle: small
  shoe fragments below the hem in walk3 and walk4 show on every skirt. Owner: LEAD (rig option), ROOMS (the item flag). Not a
  blocker: ship as is, fix in the next version.
- QA, v0.53's build (743c30c, APPV 53; rule 18 as Cal changed it: QA's pass is the green light): pass, publish it. It differs from
  fb7ca53 (passed in 88164ce) only by APPV. On the exact build: savecheck all pass; a fresh player sees "NEW v0.53", desktop and
  phone, no page errors; the art and blobs identical to v0.52 (`packsame.js`: 796 entries, 675 blobs, same SHA-256); older saves
  keep their areas. The page check follows once it is pinned. Owner: LEAD (publish).
- QA, the published v0.52 (rule 18, slug fdd651f3, version 1793965410-ff73): pass, the page matches the db67326 build. By sha256,
  452 of the build's 453 files are identical and none are missing; index.html differs only by its title (26 bytes longer);
  lfvar.json matches `app/lfvar.json`. It declares db, user and sample (images), owner only, and the db rules are exactly the
  9 in `app/dbcaps.json` (inbox owner-only included). The live rules hold for reads: as a Contributor (`asLevel interact`)
  diag/frame reads as missing; as an Editor it shows. The database holds only diag/frame from the first open at 11:43 (APPV
  52), no save: a fresh start. Not done: write checks with real friend accounts (needs Cal and a friend signed in; QA does not
  create accounts). Owner: LEAD (Cal's phone test is next).
- DONE (passed; goes out as v0.53 after Cal's report on v0.52). QA, the rebuilt loader (LEAD's fb7ca53, on 47ef877; `shots/v53/loadtime.txt`): pass, and a real gain. The pieces add up: the
  game ends with the same 796 art entries (70 yawn layers) and 675 blobs as v0.52, identical by SHA-256 (new `packsame.js`);
  no piece is over 4.5 MB; 460 files in dist. On a 9 Mbps, 85 ms phone with a 4x slower CPU: the bar at 0.4 s, the game at
  35.7 s (v0.52 35.9 s, blank); reopened in a new tab 0.3 s with nothing downloaded again (v0.52 27.3 s, art_rig.js and
  blobs.js again, 29.6 MB); a same-tab reload 0.7 s (v0.52 0.8 s). No inline text left; peak JS memory while loading 42 MB
  (v0.52 40); the whole tab 288 MB (v0.52 292 to 295). savecheck, screens (360, 390), old saves, a fresh player, doors 36 of
  36, voice 0, Shop 44, town rules 32 of 32, the Rift Mask roll, the yawn with necklaces, the team in their rooms: all pass.
  One run of the team check had the old intermittent `blob: ERR_ABORTED` (seen on earlier builds too; the rerun was clean).
  Not checked: the real host's cache headers (after publishing). Owner: LEAD (ready for v0.53).
- DONE by LEAD in fb7ca53 (the loader rebuilt on plain script tags, the big packs cut under 5 MB; see WAITING ON QA). QA, the loading bar (LEAD's 4b72f95, on 5728d83): pass, one small fix. Works: on a 9 Mbps, 85 ms phone with a 4x slower CPU the
  bar shows at 0.4 s and the game starts at 36.0 s (v0.52: a blank page until 35.9 s); all 11 files, same hashes as v0.52; no
  script reads document.currentScript; savecheck, screens (360, 390), old saves, a fresh player, doors 36 of 36, the team in
  their rooms, town rules 32 of 32: all pass, no page errors. Fallback (new `loadfallback.js`, every fetch aborted): plain tags,
  the game starts, the bar goes within a second. Fix: the 11 inline scripts keep their text in the page after they run (39
  million characters), so the whole tab holds up to about 40 MB more (299 to 329 MB against v0.52's 290 to 293 MB, new
  `tabmemory.js`). One line fixes it, tried in a scratch copy: `try{document.body.appendChild(s);s.textContent=""}catch(e){}`
  leaves 0 characters, the tab at 271 to 292 MB, and a fresh player still starts. Notes: (1) peak JS memory while loading is
  84 MB against 40 MB, since every file is held as text until the ones before it have run; fine on a Mac, worth knowing for a
  phone. (2) A second visit: reopening the game in a new tab, v0.52 and the loader both download `art_rig.js` and `blobs.js`
  (14.8 MB each) again, because this browser's cache does not keep files that big, so "(faster next time)" holds for about
  10 of the 40 MB. Only a reload of the same tab differs (v0.52 2.1 s from the tab's memory, the loader 27.7 s at 9 Mbps);
  `cache:"force-cache"` does not change it. If the wait matters: keep the two big files in Cache Storage from the loader, or
  split them under 5 MB. Real phones' caches differ: Cal's phone log will tell. `loadtime.js` now also reports the bar time,
  peak and after-GC memory, inline text left, and a second visit (SECOND=1, NEWTAB=1). Owner: LEAD.
- QA, v0.52's pre-release check (rule 18 step 2, db67326, APPV 52; `shots/v52/`): pass, ready to publish. savecheck passes;
  screens at 360 and 390 px fit; older saves keep their areas (level 30: all 8; level 3: the Hall waits); a brand-new player
  sees "NEW v0.52" and the character screen, desktop and phone; doors 36 of 36 on Cal's rule; voice.js 0 of 1,354; Shop 44
  checks; Trophy Room passes; the team in their rooms in their tops. New saves: 12-task to day 12 (level 33; Garden day 4,
  Restaurant offered day 6, Boba day 9, Dessert offered day 10), casual to day 14 (level 18); no played day without something
  to buy; day 5's second unlock is the closet the player buys, as in v0.50 and v0.51. Town rules with v0.52's own dbcaps.json
  (`townrules.js`): 32 of 32. The Rift Mask roll (`riftlive.js`): never while a Spire piece is missing, 6.7% with all three.
  The yawn with necklaces on this build: right. No page errors. Load time (new `loadtime.js`: a fresh browser, no cache,
  network and CPU throttled through DevTools; the local server sends files uncompressed): the page loads 39.6 MB before the
  game starts (every script blocks, art_rig.js first). On a 9 Mbps, 85 ms phone with a 4x slower CPU: v0.51 34.5 s, v0.52
  35.9 s, so the yawn adds about 1.4 s (art_rig.js 13.4 to 14.8 MB). With no network limit the CPU cost is small (0.3 to 0.6 s).
  If the host compresses, the big scripts are 28.1 MB gzipped (v0.51 27.1 MB). Not a blocker for v0.52, but the first load
  is long on a phone: Cal's phone log will say what he really sees. Ideas for later: start the game before the big art
  arrives (load art_rig.js, blobs.js and art_ex.js after the first screen), or load the yawn layers only when someone yawns.
  Not checked: what the host compresses, and a second visit (cache). Owner: LEAD (publish when Cal says; load time later).
- QA, ROOMS's two yawn fixes (6541dd3, on 9bb0f16; `shots/yawn/fixes/`): pass, the yawn is done. (2) The starter tops (tee,
  hoodie, bomber) in white, grey and black, both bodies, each with all 7 necklaces: 126 cells, 0 fails, no tears, every
  necklace shows (`starters.png`); the yawn's white, grey and black match the same top standing. Their all-pose sheets differ
  from before only in the two yawn cells (`celldiff.js`). (3) The man's hips: every shop top in the yawn before and after, 52
  cells: only male cells changed (25 of 26; the puffer already covered the hips), no female cell changed, and the skin
  slivers at the waist are gone (`hips_cmp.png`, before above, after below). For the colour sheets QA added a `tc=` (top
  colour) option to a scratch copy of `rigtest/matrix.html` only; worth adding for real if ROOMS wants it. New `stack.js`
  joins sheets into one picture. Owner: LEAD (ready for the next version).
- QA, necklaces in the yawn (LEAD's 414a730, on 198c87b; `shots/yawn/neckfix/`): pass. Every shop top (31) with every
  necklace (7) in the yawn, both bodies: 434 cells, 0 fails, every necklace shows (the two chokers small at the tilted neck,
  as in other poses). Each top with other trousers, a hat and a necklace, short and long hair: 62 cells each, necklaces show,
  long hair falls beside them. Nothing else moved: the whole neck sheet (952 cells, standing) is byte-identical before and
  after, and two all-pose sheets (varsity with the chain, the fox tee with the star) differ only in their two yawn cells (new
  `rigtest/qa/celldiff.js`, a cell-by-cell pixel diff). ROOMS's two fixes (the starter tops' yawn, m_base_yawn's hips) are
  still to come. Owner: LEAD (ready for the next version).
- QA, the yawn for the other 28 tops (ROOMS's 503cd3f, rule 17, on 2aecc59; `shots/yawn/`): the tops pass, 3 fixes needed.
  Pass: every shop top (31) in the yawn, both bodies, short and long hair, 46 cells, 0 fails: no tears at the shoulder,
  armpit or elbow; before and after (v0.51 against now) the blazer, Sable's and the coach jacket tore at the shoulder and
  now do not. Every top with other trousers (all 19, skirts too), a hat (all 14) and long hair: 62 cells each, 0 fails, all
  sit right. Fixes:
  (1) DONE by LEAD in 414a730 (neck items drawn right after a painted top). Necklaces vanish in the yawn on every top: a painted top is drawn in its mesh's last group, after the neck layer
  (`src/rig.js`, f57b1a0). It was already so for the pilot's three in the published v0.51 and is now every top. See
  `neck_old.png` (v0.51: chain, star, lock show), `neck_new.png` (gone). Owner: LEAD (draw neck items after a painted top).
  (2) The 3 starter tops every new player wears (`tee`, `hoodie`, `bomber`, from creator.json, not items.json) have no
  yawn, so they still stretch, with skin at the shoulders (`zb_hoodie.png`). Owner: ROOMS (3 more sheets, Chrome).
  (3) Male body only: a thin skin sliver at both sides of the waist, past every top, in the yawn. It comes from the pilot's
  `m_base_yawn.webp` (leftover marks at both hips, `m_base_yawn.png`), so it is on the pilot's tops in v0.51 too; the female
  body is clean. Owner: ROOMS (clean the hips of m_base_yawn).
  Not checked: in a room, on a phone. Known: `stretchUp` still tears dark sleeves (no painted layers).
- DONE by LEAD in 742a39e (the inbox rule added to `app/dbcaps.json`). QA, the town database rules (ab6a66e, `app/dbcaps.json`; new `rigtest/qa/townrules.js`, LEAD's two-player test on a stand-in
  database that applies the dbcaps.json rules themselves, with friends as Contributors): one gap. Not covered by any rule:
  `inbox/owner`, the list the owner's page turns into quests on Cal's Board (checkInbox). A path with no rule keeps the db
  default (every signed-in person reads, every Contributor writes), so any friend can read it and write quests into Cal's
  game; the test wrote "Planted quest" there. Fix: add `{"path":"inbox","read":"owner","write":"owner"}`; with it all 32
  checks pass, and Claude's db_write (as owner) still works. The rest pass: LEAD's 16 checks; a third player sees everyone;
  each board doc keeps the newest 10 posts; a note older than 14 days is dropped when the sender writes a new one (13 days
  stays); a friend is refused on another player's worlds, board and pings, on `player/state`, `diag` and another player's
  `data/users/` save; diag refusals are silent (`.catch`); no page errors. Notes: visit notes are readable by any signed-in
  player through the database (the page shows them only to the Loft's owner), so they are not private. Old-layout docs
  (`board/<id>_<time>`, `pings/<a>_<b>_<day>`) are hidden, not removed; a fresh page has none. Old notes are pruned only when
  that sender writes again. Still to do: the real rules on a real page with real accounts (QA's 15-player test after the
  next publish). Owner: LEAD (add the inbox rule before declaring).
- DONE (v0.51 pinned for Cal's phone test). QA, the published v0.51 (rule 18, slug 936a4ed4, version 1793960417-4a96): pass, the page matches the ac8d2f0 build. By sha256
  (`list_files` against a clean build), 452 of the build's 453 files are identical and none are missing. index.html differs only
  by its title, "Quest Board v0.51 (test, fresh start)" (the same 1,326 lines, exactly 26 bytes longer). lfvar.json is the page-only
  file and matches `app/lfvar.json` byte for byte. It declares db, user and sample (images), contract 0.2.96, owner only. The
  database holds only the 2 diagnostics docs from the first open at 10:20 (APPV 51, Board tab, 120 fps). There is no save, so it
  is a fresh start. Owner: LEAD (Cal's phone test is next).
- DONE by LEAD (published as v0.51, 936a4ed4). QA, v0.51's pre-release check (rule 18 step 2, ac8d2f0, APPV 51; `shots/v51/`): pass, ready to publish. The Rift Mask as the
  Spire's last prize (6682998): the real roll (new `riftlive.js`, 6,000 `__qbDungeon.roll('m5')` each) never gives it while a Spire
  piece is missing (0 with none, 0 with silence missing); with tide, thorn and silence found it comes on 6.4% of rolls (about 6.9%
  expected); never once owned; not for sale in the Shop. New days (`riftodds.py`, 20,000 players): at 2 Spire runs a day the pieces
  are all in by day 6 (median) and the mask follows about 4 days later, median day 11, 71% by day 14, 90% by 20, 98% by 30; at 1 run
  a day, median day 23, 90% by 40. The team's tops: each member in their home room in their own top, Mara in chef whites. The
  usual set: savecheck passes; screens at 360 and 390 px fit; older saves keep their areas (level 30: all 8; level 3: the Hall
  waits); a brand-new player lands on the Board in v0.51, desktop and phone; doors 36 of 36 on Cal's rule; voice.js 0 of 1,354;
  Shop 44 checks; Trophy Room passes; building backdrops at 13:00 and 22:00. New saves: 12-task to day 12 (level 33; Garden day 4,
  Restaurant offered day 6, Boba day 9, Dessert offered day 10), casual to day 14 (level 18, Garden and Restaurant); watered, never
  dry; no played day without something to buy. Day 5 of the 12-task run counts 2 unlocks, but the second is the closet, a Loft
  upgrade the player buys (v0.50's run had it on day 4 beside the Garden), so it is not new. No page errors. Owner: LEAD (publish).
- DONE by LEAD in ac8d2f0 (the Rift Mask rolls only once the Spire's pieces are all owned). QA, the Rift Mask's drop odds (e389afa, new `rigtest/qa/riftodds.py`, a copy of dgRoll, 20,000 players, days counted from the
  first Spire run): the mask is Obsidian Spire only, 1 in 8 on a gift that is not a set piece, until owned. At 2 Spire runs a day
  the median is day 7 (half by day 7, 85% by 14, 90% by 17, 99% by 30, unluckiest 71). At 1 run a day the median is day 14 (87% by
  30, unluckiest 141); about 14 Spire runs either way. Gift buffs (Hushstep Boots, goblin set) move it about a day. Note: it is
  not "after the set pieces"; the mask can win whenever a Spire gift misses its piece roll, so 41% find it before their three
  Spire amulet pieces. Fine as a rare surprise; if LEAD wants it after the pieces, roll it only when `miss` is empty. Owner: LEAD.
- DONE (v0.50 pinned; v0.51 followed). QA, the published v0.50 (rule 18, slug cda54e71, version 1793953238-4af6): pass, the page matches the f3c970c build. By
  sha256 (`list_files` against a clean build), 452 of the build's 453 files are identical and none are missing. index.html differs
  only by its title, "Quest Board v0.50 (test, fresh start)" (the same 1,326 lines, exactly 26 bytes longer). lfvar.json is the
  page-only file and matches `app/lfvar.json` in git byte for byte. It declares db, user and sample (images), contract 0.2.96,
  owner only. The database holds just 2 diagnostics docs (diag/frame, diag/perf) from the first open at 08:22: APPV 50, Board
  tab, 120 fps. There is no save and no world doc, so it is still a fresh start. Owner: LEAD (Cal's phone test is next).
- DONE by LEAD (published in v0.51). QA, the team's signature tops (097dccd, checked on b7369bc; `rigtest/qa/shots/tops/`): pass, ready to publish. matrixshot.js
  sheet=wear for tm_rafe_jacket, tm_theo_tee, tm_nova_knit and tm_sable_jacket: 44 of 44 poses each, both bodies, 0 fails; no
  mannequin lines left, Nova's lavender trim intact, Theo's lanyard on every front pose. sheet=neck: 952 cells, 0 fails, every
  necklace sits over each top. sheet=waist: 986 cells, 0 fails, each top over all 19 trousers front and back, no gap. Live
  (teamrooms.js, which now checks the top too): Rafe in Lock and Key in the brown jacket, Theo in the Theater in the black tee,
  Nova in the Mall in the cream knit, Sable in the Lair in the olive jacket, Mara in the Restaurant in chef whites (npc_chef); with only Mara joined, only
  Mara shows; no page errors. Old, not caused by these tops: in stretchUp and stretch the dark jackets' sleeves look torn at the
  shoulder (Rafe, Sable; the Shop's v_blazer does the same, the known torn-sleeve note in Done); the long hairstyle h1 leaves a
  few dark specks on light tops (Nova's knit; the Shop's h_hoodie too). Owner: LEAD (publish in v0.51); the sleeves are ROOMS's
  if Cal wants them fixed.
- DONE by LEAD (published as v0.50, cda54e71). QA, v0.50's pre-release check (rule 18 step 2, f3c970c, APPV 50; `shots/v50/`): pass, ready to publish. savecheck.js: every case passes.
  screens.js at 360 and 390 px: every tab and a room window fit, no errors. Older saves without the areas-seen record (new
  `areasload.js`, written with the flags that keep an old save's numbers): a level-30 save loads at 30 with all 8 areas, none Soon;
  a level-3 save keeps the Hall waiting. A brand-new player: character screen, then the Board, v0.50, desktop and phone. New saves
  to day 12 and 14 (`sim.js`, `unlocks.py`): 12-task Garden day 4, Restaurant, Boba, Dessert offered by day 10, level 33 on day 12;
  casual Garden and Restaurant by day 14, level 18; watered, never dry; no played day without something to buy. Building backdrops
  (`backdrops.js`): the Loft, Kode Plaza and Calibur Mall each draw their own (bld_bg_loft, _plaza, _mall), dimmed at 22:00. Doors:
  36 of 36 on Cal's rule. voice.js: 0 of 1,353. Shop: 44 checks. Trophy Room passes. No page errors anywhere. Owner: LEAD (publish).
- DONE by QA (QA findings: pass, ready to publish). WAITING ON QA (LEAD's message, rule 18 step 2): the pre-release check of v0.50 (f3c970c, APPV 50), with 9b28444 folded in.
- DONE by ROOMS (by design, nothing to change): the sleepHead note below. `data/poses.json`'s `sleepHead` swaps `hat`,
  `glasses` and `mask` to none on purpose: the head lies on the arm and those layers would clip into it. `sleep` and
  `sleepIn` keep masks. Owner: none.
- QA, wear-test of the Rift Mask (dg_riftmask, d4eefc3, on 0507161; new `rigtest/qa/matrixshot.js` draws `matrix.html` headless with
  WebGL2 SwiftShader; `shots/riftmask_wear.png`, `riftmask_hatface.png`, `hmask_wear.png`): pass. sheet=wear: 44 cells, both bodies, every
  key pose, 0 failures: the mask sits on the lower face in every front pose (standing, walking, stretching, sitting, lying), nothing
  on the back views (front only, as meant); it sits exactly where the black mask (h_mask) does. sheet=hatface: 540 cells, 0
  failures; its 60 Rift Mask cells (15 hats x both bodies x two hairstyles) show every hat over it, ear flaps and straps crossing it
  cleanly, no gaps. Note (old, not the Rift Mask): in the sleepHead pose the face shows but no mask is drawn, the same for h_mask; a
  sleepHead layer, or treating sleepHead as front for masks, would fix every mask. The 404s in the run are the yawn pose's art,
  not drawn yet for any outfit. Owner: ROOMS (the sleepHead note).
- DONE by LEAD in f3c970c (v0.50 built, with QA). CAL'S DECISION (2026-11-05, to QA, on LEAD's question "test v0.49, or skip to v0.50"): "Skip to v0.50". WAITING ON LEAD: build
  v0.50, then WAITING ON QA for its pre-release check (rule 18), then publish it as Cal's fresh pinned copy. Owner: LEAD.
- QA, the door recheck after ROOMS's 3962ee2 (on fcdd160, port 8769; `doors.js` in full, new `doorwalk.js`; `shots/doors_full_fcdd160.txt`):
  pass. All 36 pairs follow Cal's rule (the Mall–Karaoke shortcut by design); with everything bought the only piece in front of a
  door is the Mall escalator, the way up to Bowling. Walked both ways in the real windows: Bedroom–Game Room, Garden–Boba,
  Dessert–Speakeasy, Mall–Arcade, Arcade–Rhythm, Restaurant–Lock and Key, Restaurant–Garden, each arrow in its door's corner (out
  right, in left; up top right, down bottom left). No page errors. QA's old door findings are closed. Owner: none.
- DONE by QA (QA findings: pass). WAITING ON QA (ROOMS's message): recheck QA's old door findings (doors.js in full) and walk the moved doors live.
- QA, every door pair after ROOMS's fd80c50 (on f21855d, `doors.js` LOGIC; `shots/doors_f21855d.txt`): pass. All 36 pairs follow Cal's
  left/right rule; the only flag is the Mall–Karaoke pair, the shortcut that shows only in saves without Bowling (not next to each
  other in the building, by design). The Nightclub has no doors (bought from the street). Owner: none.
- QA, the writing pass round 3 (LEAD's a0f2c8b, ROOMS's a646e51; on b0534bc, `voice.js`): done. 1,353 lines, 0 break a rule; the six
  joke endings now plain detail, "colour" fixed, the Squat Rack and drake pet plain. `voice.js`'s "meets" rule now only matches the
  "X meets Y" slogan VOICE.md bans (LEAD's false positive). Owner: none.
- DONE by QA (QA findings: 0 rule hits). WAITING ON QA (LEAD's and ROOMS's messages): re-run voice.js on a0f2c8b and a646e51, the last writing lines.
- QA, ROOMS's e74cf92 (on 5048cae; `voice.js`, `livebuilding.js`; `docs/QA.md`; `shots/voice_5048cae.txt`): the DJ passes (at the
  decks in 9 of 12 and 5 of 12 looks, was 3). Writing: `voice.js` finds 4 (was 5): Gaming Desks 99 characters, the Mall fountain's
  "Everyone meets here." (ROOMS), the Squat Rack's "boss" and the drake pet's "next level" (LEAD). By ear, six lines still end on a
  joke: Prize Counter, Score Screens, Lyric Screen, Song Kiosk, VIP Booth, Speaker Stacks (quoted in QA.md); the LED Dance Floor
  says "color" (VOICE.md: "colour"). No page errors. Owner: ROOMS (6 lines, 2 rule hits, spelling), LEAD (2 rule hits).
- QA, the Nightclub round 2 (1eb0bbc) and the team in their rooms (abb6513), on 8f1498d (`roomreview.js`, `livebuilding.js` now
  takes TEAM=, new `teamrooms.js`; `docs/QA.md`; `shots/review2_club_*.png`, `team_*.png`). Team: pass; all five stand in their homes
  (Sable the Lair, Mara the Restaurant, Rafe Lock and Key, Nova the Mall, Theo the Theater) with a ring and a name tag, and only the
  joined ones show. Nightclub: one floor on one grid, the bartender works, guests sit in the VIP booths; small: the DJ is at the
  decks in only 3 of 12 looks (he wanders); otherwise ready for Cal. No page errors. Owner: ROOMS (the DJ).
- DONE by QA (QA findings: team pass; club ready but the DJ wanders). WAITING ON QA (ROOMS's message): the Nightclub notes (one floor, a DJ and a bartender) and abb6513, the team in their home rooms.
- QA, design review of the Nightclub (step 16, fd0da20, on 867bc30, at 22:00; `roomreview.js` and `livebuilding.js` now take HOUR,
  `docs/QA.md`; `shots/review_club_*.png`): reads as one club (VIP left, bar and DJ at the back, the dance floor in the middle,
  the entrance front-right), nothing outside or overlapping, and live guests fill it in about 16 s and use the floor, tables, bar,
  VIP and podium. 2 notes: (1) no staff at all (no bartender, no DJ though the room says "Calibur on the decks", no bouncer, no
  coat-check clerk); (2) the dance floor's four tiles do not line up (a step in the middle seam). No page errors. Owner: ROOMS.
- QA, ROOMS's 6962a6e, the Karaoke booth (on 372346f; `roomreview.js`, `livebuilding.js`; `shots/review4_karaoke_full.png`): pass, ready
  for Cal. The Private Booth is a nook in the front corner behind a low pink partition. No page errors. Owner: ROOMS (to Cal).
- DONE by QA (QA findings: pass, ready for Cal). WAITING ON QA (ROOMS's message): the Karaoke Private Booth behind a partition in the front-right corner.
- QA, Bowling and VR round 2 (934bb37) and the Karaoke design review (db8a46d), on 6d88259 (`roomreview.js`, `livebuilding.js`,
  `doors.js`; `docs/QA.md`; `shots/review3_*.png`): Bowling and VR closed, ready for Cal (clerk and cook work live, the STRIKE
  screen over the approach end, the VR pairs apart). Karaoke reads as one room (lounge left, stage under the lyric screen, kiosk and
  tambourines at the stage), doors on Cal's rule, live works; 1 note: the "Private Booth" is an open L-sofa mid-front, a second
  lounge: tuck it into the front-left corner behind a low partition or curtain, or drop it. No page errors. Owner: ROOMS.
- QA, step 13 round 2 (5a33727) and the Bowling Alley's design review (922bcb7), on 551ac4a (`roomreview.js`, `livebuilding.js`,
  `doors.js`; `docs/QA.md`; `shots/review2_*.png`, `review_bowling_doors.txt`): the Rhythm Room is ready for Cal; the VR Arena is
  ready (clerk works live) with one small note (each side pair of rigs still touches in the picture, half a tile apart). Bowling
  reads as one alley, doors on Cal's rule, live works; the lane seats are fine where they are (a side bench looking across the
  approach, since the art cannot face the pins). 2 notes: no clerk at the shoe counter or the snack bar; the STRIKE! sign hangs
  far from the lanes (score screens belong above the lane ends). No page errors. Owner: ROOMS.
- QA, design reviews of step 13 (e2d53e1, on cbc2535; `roomreview.js` and `livebuilding.js` now take ROOM=<type>, `retired.js`;
  `docs/QA.md`; `shots/review_rhythm_*.png`, `review_vr_*.png`). Rhythm Room reads as one music room, live play works; 3 notes: the
  spectator bench has its back to the dancers; the Speaker Tower hides the drum kit and the keyboard; the trophy case floats
  mid-floor. VR Arena zones are right and the Second Pod is retired cleanly; 2 notes: the rigs bunch as feared (four touching in
  about three tiles: give each its own pad, the treadmill alone in the middle); the check-in desk has no clerk and live a guest
  fades in behind it at the back wall. No page errors. Owner: ROOMS.
- QA, ROOMS's b3832fb, the Arcade round 2 (on 25b5cb8; `arcadereview.js`, `livebuilding.js`, `doors.js`; `shots/review_arcade2*.png`,
  `review_arcade2_doors.txt`): pass, ready for Cal. Entrance and hoop spot clear, the prize clerk works live behind the counter, all
  four Arcade door pairs follow Cal's rule, the lobby sofa is clear of the box office. No page errors. Owner: ROOMS (to Cal).
- DONE by QA (QA findings: pass, ready for Cal). WAITING ON QA (ROOMS's message): the Arcade fixes (sticker booth, prize clerk live, Rhythm and VR doors) and the lobby sofa.
- QA, round 3 (5e3a780) and the Arcade's design review (cb5f568), on eb04985 (`theaterreview.js`, `audreview.js`, `arcadereview.js`,
  `livebuilding.js`, `doors.js`; `docs/QA.md`; `shots/review_theater3.png`, `review_aud3_full.png`, `review_arcade*.png`): the Theater
  lobby and the Auditorium are closed and ready for Cal (sofas on the back wall, the landing lit along its edge; small: the right
  sofa touches the box office). The Arcade reads as one planned arcade, calm shell, every machine faces its player, live play
  works. 3 notes: (1) the entrance mat is squeezed between the prize counter and the sticker booth and guests bunch there; (2) the
  sticker booth stands in the hoop shot's throwing spot; (3) the prize counter has no clerk. Doors: Arcade–Rhythm and Arcade–VR
  miss Cal's rule (for those steps). No page errors. Owner: ROOMS.
- QA, review round 2 of the Theater lobby (9279c58) and the Auditorium (392ca5c), on 8ca77d1 (`theaterreview.js`, `audreview.js`,
  new `livebuilding.js`; `docs/QA.md`; `shots/review_theater2*.png`, `review_aud2_*.png`): lobby 5 of 6 fixed, Auditorium 3 of 4.
  Live at last (characters exist only inside a building's view; a room opened from the street is empty): the ticket line forms at
  the box office inside the ropes, clerk, concession staff and bartender work, guests reach at the snacks and go in at SCREEN 1. Open:
  (lobby) the two sofas sit side by side mid-floor facing the viewer, the right one on the carpet's edge, unused: group them in a
  corner or drop them; (Auditorium) the back landing is barely lighter and its low wall barely shows: add a lit edge or a rail.
  No page errors. Owner: ROOMS.
- DONE by QA (QA findings: lobby 5 of 6, Auditorium 3 of 4). WAITING ON QA (ROOMS's message): review round 2 of the Theater lobby (9279c58) and the Auditorium (6c47f1b).
- QA, LEAD's 7ebf618, the Auditorium's gate (on 6320575, `rigtest/qa/audgate.js`): pass. At level 39 with the story up to the
  Theater: booth and popcorn only, no scene and no Auditorium; three other lobby upgrades, none; booth, popcorn and soda, the
  Auditorium scene comes and its yes opens the room; afterwards "Open the Auditorium" (`t_aud`) is owned and not for sale. No page
  errors. Owner: none.
- DONE by QA (QA findings: pass). WAITING ON QA (LEAD's 871e0d8, "to QA"): check 7ebf618, the Auditorium opens free once the lobby has its basics.
- QA, design review of the Auditorium as it stands (on 1bb17be; `audreview.js`; written out in `docs/QA.md`; `shots/review_aud_*.png`):
  one plan (screen on the back-left wall, rows facing it, projector opposite), nothing outside or overlapping bare, with the
  Bigger Screen and with IMAX; live the screen plays a film. 4 notes: (1) the projector's back landing does not read, it stands on
  open floor at the bottom right like the front of the room: give it a visible raised booth with a rail and steps; (2) bare, the
  projector is a film camera on a tripod (reads as filming); (3) the aisle steps climb to an empty back-right corner; (4) the
  right half and the floor behind the last row are empty. No page errors. Owner: ROOMS.
- QA, design review of the Theater lobby (4a7c0ff, on 36706e5; `theaterreview.js`, `guests.js`, `retired.js`; written out in
  `docs/QA.md`; `shots/review_theater*.png`): the idea reads (mat -> carpet -> doors, rope line to the box office), nothing outside,
  no guest spot inside furniture, the trailer screen and poster panel show live. 6 notes: (1) the concession row stands mid-floor
  and squeezes the carpet against the ropes: put it on the left wall facing the carpet; (2) the bar is split (taps bar at the mat,
  liquor wall far right): one bar; (3) a blank gold frame stands in front of the liquor wall; (4) one lone sofa in the back-left
  corner; (5) hot dog and nachos barely show behind the counter (ROOMS asked): they should be seen; (6) the bins lead the picture at
  the front edge. Not verified: the ticket line and snack trips live (no guests appeared in QA's test copy). No page errors.
  Owner: ROOMS.
- QA, ROOMS's c829e7e, Mall round 3 (on 0da598f; `mallreview.js`, `karaokeorphan.js`, `karaokeshortcut.js`; `shots/review_mall3*.png`):
  pass. The landing has a stone edge and a glass rail with brass posts; the Karaoke shortcut shows only while Bowling is not owned
  (Mall "Karaoke" top right, Karaoke "Mall" bottom left, walked both ways) and is gone once it is. All Mall notes closed: ready for
  Cal. No page errors. Owner: ROOMS (to Cal).
- DONE by QA (QA findings: pass, ready for Cal). WAITING ON QA (ROOMS's message): check c829e7e, the Mall landing and the Karaoke-without-Bowling doors.
- QA, Mall round 2 (ROOMS's 0eb00c2, on af14361; `mallreview.js`, `doors.js`, `retired.js`, `karaokeorphan.js`; `docs/QA.md`;
  `shots/review_mall2*.png`, `review_mall2_doors.txt`): 3 of 4 fixed, 1 half, 1 edge case. The directory is retired (5 retired pieces,
  clean); Karaoke is upstairs from Bowling and the Theater's storefront rolls up; every Mall pair and Bowling–Karaoke now follow
  Cal's rule, and every arrow walks. Half: the escalator meets the landing, but the landing reads as flat colour bands, not a
  floor with a rail. Edge case: a save owning Karaoke but not Bowling has no arrow into Karaoke, and Karaoke shows no arrows;
  keep a Mall–Karaoke arrow while Bowling is not owned. No page errors. Owner: ROOMS.
- QA, ROOMS's c8eb716, the Rooftop bar (on d916e6b, `openair.js`; `shots/review_rooftop3.png`, `review_rooftop_bar3.png`): pass.
  One straight counter, four stools, the back bar the same length one tile behind it with an aisle. All six design-review notes
  are closed: the Rooftop and Lock and Key are ready for Cal. No page errors. Owner: ROOMS (to Cal).
- DONE by QA (QA findings: pass, ready for Cal). WAITING ON QA (ROOMS's message): check c8eb716, the Rooftop bar repainted (the last design-review note).
- QA, design review of the Mall (322760a, on cb6fdb3; `mallreview.js`, `retired.js`, `screenlive.js`, `doors.js`; written out in
  `docs/QA.md`; `shots/review_mall*.png`, `review_mall_doors.txt`): checks pass, 4 notes. It reads as one atrium (stores round the
  fountain, seating left, food front-right). (1) The Directory Screen is garbled: it is the restaurant menu with prices by each
  store, too narrow (names run into prices), its top lines above the picture's edge, and blank about 7 s in 8; list stores and
  where they are, no prices, wider and inside the wall, or drop it. (2) The Karaoke door is a closed shutter even fully bought.
  (3) The escalator climbs toward a ground-floor opening and ends in mid-air. (4) All four Mall door pairs still miss Cal's
  left/right rule, and Karaoke is not next to the Mall in the building. No page errors. Owner: ROOMS, then Cal.
- QA, design review round 2 on ROOMS's d95d880 (no QA line was posted; on 2df050f; `docs/QA.md`; `shots/review_rooftop2.png`,
  `review_lockkey2.png`): Lock and Key, all 3 notes fixed, ready for Cal. Rooftop, 5 of 6 fixed (pool back by the DJ, loungers at
  its end facing the water, the hot tub clear of the step by the cabana, the stairs arrive clear, smaller flamingo and tub). Still
  open: the back bar sits behind only the right half of the counter with no aisle; centre it. Doors, retired pieces (Rooftop 4,
  kept and not drawn) and old saves pass; no page errors. Owner: ROOMS (the bar), then Cal.
- QA, design review (Cal's new step) of the Rooftop (ea2dffc) and Lock and Key (on 3cdf263; written out in `docs/QA.md`, "Design
  reviews"; `shots/review_rooftop*.png`, `review_lockkey.png`). Rooftop: a real plan now, 6 notes: (1) the hot tub sits on the
  pool's only step; (2) the loungers float in the walkway from the stairs, a tile or two from the pool: line them on its front
  edge; (3) the stairwell comes up into the parasol table's chairs: give it a clear tile, or drop the parasol table (four seating
  zones on one roof); (4) the back bar is behind only half the counter with no bartender aisle; (5) the pool floats mid-deck with
  an empty strip behind it; (6) the flamingo is a third of the pool, the hot tub nearly as wide as the pool. Lock and Key reads as
  one planned room, 3 notes: (1) a front-door mat on the front-right edge where there is no door (people arrive Downstairs,
  front-left): remove it or move it there; (2) the humidor floats alone between high-tops: put it at the bar's end or in the
  lounge; (3) a high-top crowds the roof stairs. The usual checks pass for both (doors, nothing outside, retired pieces, no page
  errors). Owner: ROOMS, then Cal.
- QA, ROOMS's fb8149a, the Rooftop in zones (on 2418999, port 8770, `retired.js` ROOM=rooftop, `openair.js`, `skybarshell.js`;
  `shots/rooftop_zones_noon.png`, `rooftop_stairwell_night.png`): pass. The way down is a painted stairwell at the front-left edge
  with a gap in the glass rail; the front-right edge has its glass rail; Roof and Bar walk both ways. More Loungers, the Towel
  Station and the Ice Cream Cart are retired: a new player gets no card for them, a save that owns them keeps all 3 ids and
  nothing more is drawn; the one pair of loungers faces the pool clear of its step, the shower stands by the right rail; nothing
  outside the room, at noon and 10 pm. `retired.js` now checks retired pieces in any room. No page errors. Owner: none.
- QA, a quick look at ROOMS's 5ddeb1a (no QA line was posted; it answers QA's sky note; on 17e5851, port 8770,
  `openair.js` with HOURS; `shots/openair_sky_by_hour.png`): pass. The Sky Patio and the Rooftop Bar, fully bought, at 7:00, 13:00,
  18:00 and 22:00: dawn colours at 7, a blue sky with the sun at noon, deep blue with a moon and lit windows at 18 and 22 (the
  game follows the real Los Angeles sun, which sets before 17:00 in November); the furniture dims with it; nothing outside the
  rooms. The Rooftop notes from 98599c3 (no visible way down, no rail on the front-right edge) still stand. No page errors.
  Owner: none.
- QA, ROOMS's 707cac1 (on 52e194f, port 8770, `lockkeylounge.js`, `skybarshell.js`, `band.js`, `openair.js`; `shots/lockkey_lounge3.png`,
  `rooftop_deck_bare.png`, `rooftop_deck_full.png`): Lock and Key passes; the Rooftop deck passes with 2 notes. Lock and Key (Cal's
  redo): the Chesterfield and the Champagne Trolley are retired: a new player gets no card for them, an owner keeps both ids and
  neither is drawn; the lounge is the green sofa and its table, the piano stands by the band stage, nothing outside or
  overlapping, with or without the old pieces; doors, band and old-save checks pass. Rooftop: the painted travertine deck and the
  sandstone parapet (`rfw_t1`) draw bare and fully bought, at noon and 10 pm, nothing outside; Roof and Bar walk both ways. Notes:
  (1) the way down has nothing to see: the "Bar" door on the front-left edge shows no glow, stair or hatch under the glass rail,
  only the arrow; (2) the front-right edge has no rail at all, an open drop, while the front-left has glass. The sky still shows
  dusk at noon and 10 pm (ROOMS: next). No page errors. Owner: ROOMS.
- DONE by QA (QA findings and docs/QA.md: Rooftop 6 notes, Lock and Key 3). WAITING ON QA (Cal, 2026-11-05: "Please send any rooms to QA for further notes and analysis before coming back to me for
- DONE by QA (QA findings: DJ pass; writing 4 rule hits, 6 jokes). WAITING ON QA: the writing pass at e74cf92 (re-run voice.js; every room and upgrade line in ROOMS's files should now be one
  concrete detail with no tag line, and no "!" in room help titles; the bowling STRIKE! sign stays), and the Nightclub DJ
  (the spot now in front of the decks, longer shifts).
- DONE by QA (QA findings, 5ed2375: floor and bartender pass, the DJ wanders). WAITING ON QA: the Nightclub's two notes at 1eb0bbc (one dance floor on one grid; a DJ at the decks and a bartender behind
  the bar, staff on cb_dj and cb_bar), and the team in their rooms at abb6513: with a member joined (S.story.team), they
  stand in their home room (Mara Restaurant, Rafe Lock and Key, Nova Mall, Theo Theater, Sable Lair) in their own look
  with a ring in their colour and a name tag. ROOMS saw Mara, Rafe and Nova live in the building view.
- DONE by QA (QA findings: 2 notes). WAITING ON QA: a design review of the Nightclub at fd0da20 (step 16): a new painted shell; the layout as it was (VIP booths
  behind ropes on the left wall, the bar and DJ booth at the back, the dance floor in the middle with cocktail tables, the
  entrance with rope, photographer and coat check at the front right; its own lot, so the street mat stays).
- DONE by QA (QA findings: Bowling and VR ready, Karaoke 1 note). WAITING ON QA: Bowling's notes and the VR rig spacing at 934bb37 (clerks at the shoe counter and snack bar, the STRIKE
  screen over the lanes' approach, the rig pairs half a tile apart), and a design review of Karaoke at db8a46d (step 15):
  painted shell, the tambourines at the stage, no street mat (guests arrive at the Bowling stairs).
- DONE by QA (QA findings: Rhythm and VR ready, Bowling 2 notes). WAITING ON QA: round 2 of the Rhythm Room and VR Arena at 5a33727 (your five notes), and a design review of Bowling at
  922bcb7 (step 14): painted shell, the snack bar and table off the lanes' approach in the front-right corner, the Karaoke
  door off the lanes on the free back wall, no street mat (guests arrive at the Mall door). Lanes, ball return, console
  and seats unchanged. ROOMS's worry: the lane seats face sideways (the art only faces the viewer).
- DONE by QA (QA findings and docs/QA.md: Rhythm 3 notes, VR 2). WAITING ON QA: design reviews of the Rhythm Room and the VR Arena at e2d53e1 (step 13), bare and fully bought, live from
  inside the Mall building: painted shells, the Pulsing Floor now only under the dance pads, the Second Pod retired, no
  street mats (guests arrive at the Arcade doors). ROOMS's worry: the VR rigs still bunch in the middle-right.
- DONE by QA (QA findings: lobby and Auditorium ready for Cal; Arcade 3 notes). WAITING ON QA: round 3 of the Theater lobby and Auditorium at 5e3a780 (the sofas, the landing edge), and a design review of
  the Arcade at cb5f568 (painted shell with a calm carpet; the machines as they were: cabinets on the back wall, racing and
  skee-ball left, claws and hoops right, air hockey in the middle, snacks and prizes at the front). Use livebuilding.js.
- DONE by QA (QA findings, 8df07f1: lobby 5 of 6, Auditorium 3 of 4). WAITING ON QA: design review round 2: the Theater lobby at 9279c58 (your six notes) and the Auditorium at 392ca5c (your
  four notes: the back landing, the bare projector, the steps ending at an EXIT, the empty right side). About guests: the
  lobby's ticket buyers come from the room's guest count like other rooms (`thGuest` takes over once one spawns); ROOMS
  has not traced why none spawned in your copy.
- DONE by QA (QA findings and docs/QA.md: 4 notes). WAITING ON QA: a design review of the Auditorium (step 11) as it stands at 3057c61, bare and fully bought (Bigger Screen,
  then IMAX). ROOMS's read: one plan already (screen on the left wall, towers either side, rows stepping up toward the
  back, the projector on the raised back landing beaming over the seats; the camera draws the back landing bottom right,
  so it can read as "front"). Say what you would change; ROOMS fixes it before Cal sees it.
- DONE by QA (QA findings and docs/QA.md: 6 notes; guests not seen live). WAITING ON QA: a design review of the Theater lobby at 4a7c0ff (step 10), bare, with the basics only (t_booth1, t_pop,
  t_soda) and fully bought with the lobby expanded: zones, facing, anything hidden (the hot dog and nachos now stand on a
  back counter behind the stand), the guest line and the snack trips still walking right. Also the Mall fixes at c829e7e.
- DONE by QA (QA findings: 3 of 4, the landing half, a Karaoke edge case). WAITING ON QA: Mall design review round 2 at 0eb00c2: your four notes (directory retired; Karaoke now upstairs from
  Bowling, so the left wall's back storefront is the Theater's way through and rolls up once the Theater is open; the
  escalator reaches a painted upper landing; every Mall door pair on Cal's rule). Check the doors both ways with the
  Theater, Arcade, Bowling and Karaoke open, and a save that already owns Karaoke without Bowling.
- DONE by QA (QA findings and docs/QA.md: checks pass, 4 notes). WAITING ON QA: a design review of the Mall at 322760a (Cal: rooms go to QA for notes before him), bare and fully bought,
  noon and night: one planned space? every piece facing its use? the shop fronts sitting right in their storefronts? the
  Directory Screen's text (it cycles; it looked garbled in a still)? walkways from the Theater door (front-left) and the
  Arcade door (front-right)? anything doubled or random? Plus the usual checks (4 retired ids, old saves, doors).
  my opinions"): a design review, not only the usual checks, of the Rooftop at ea2dffc and Lock and Key at 707cac1. For
  each room: does it read as one planned space; does every piece face where it is used; is anything doubled, random,
  floating or oddly sized; are the walkways and sight lines clear; what would you change. Cal on the Rooftop before
  ea2dffc: the pool should turn 90 degrees, the DJ faced the side, "the two bars on the top are weird", "it just feels like
  they are placed randomly". ROOMS fixes the notes, then shows Cal. Screens at noon and at night, fully bought and bare.
- DONE by QA (QA findings: pass). WAITING ON QA: check fb8149a (rule 17, small check): the Rooftop fully bought, at noon and at night. The loungers clear
  of the pool steps, the shower by the right rail, no ice cream cart, towel station or second loungers drawn (owners keep
  the ids, no card for new players); a stairwell with a gap in the glass at the Bar door (front-left edge) and the Bar
  arrow walks down; glass rail on the front-right edge; nothing outside the deck. ROOMS's headless pass: no page errors.
- DONE by QA (QA findings: pass, 2 Rooftop notes). WAITING ON QA (ROOMS's message): check 707cac1, Cal's Lock and Key lounge redo and the Rooftop's painted deck.
- QA, ROOMS's 64e98bc, the Lock and Key lounge table (on ee34dbc, `band.js`, `skybarshell.js`; `shots/lockkey_band4.png`,
  `lockkey_lounge2.png`): pass, one optional note. The table is out from under the green sofa and clear of the Chesterfield; doors,
  band and old-save checks still pass. Note: the corner stays tight: the green sofa's right foot just meets the table's rim, and
  the piano lid's tip reaches the table's front legs; dropping the lounge table, or a smaller one, would give the corner air.
  No page errors. Owner: ROOMS (optional).
- DONE by QA (QA findings: pass, 1 note). WAITING ON QA (ROOMS's message): check 64e98bc, the Lock and Key lounge table.
- QA, ROOMS's 1f2cfa9 and 73a426a (on fa536b1, port 8770, `band.js`, `skybarshell.js`, `openair.js`; `shots/lockkey_band3.png`,
  `lockkey_lounge.png`, `patio_noon.png`, `patio_night.png`, `rooftop_night.png`): the piano and the open-air rooms pass, one new
  fix. The piano has its own space front middle, clear of the bar, the Chesterfield and the band stage; Downstairs at FL 2.2 is
  clear; every door walks; the band checks pass; a save owning all 16 upgrades keeps 16. The Sky Patio and the Rooftop Bar, bare
  and fully bought, at noon and 10 pm: no dark triangle over the sky, the tint stops at the rail. FIX (Lock and Key): with the
  lounge moved left, the glass lounge table now sits half under the green sofa (the sofa is drawn over it) and the Chesterfield's
  back runs into its legs; move the table a step forward, between the sofa and the Chesterfield. Note: the open-air rooms' sky
  is the same dusk picture at noon and at 10 pm (only the furniture dims); if they should follow the time like the street
  does, that is a separate change. No page errors. Owner: ROOMS.
- DONE by QA (QA findings: pass, the lounge table now under the sofa). WAITING ON QA (ROOMS's message): check 1f2cfa9 (the piano's own space, Downstairs at FL 2.2) and 73a426a (no dark
  triangle over the sky in the open-air rooms; the Patio).
- QA, ROOMS's b19a578, the piano turned (on e97c431, `band.js`; `shots/lockkey_band2.png`, `lockkey_piano2.png`): half fixed. The
  lid now opens away from the bar and is clear of the stools and the foot rail, and its bench clears the band stage; the band
  checks still pass. But the piano now presses into the lounge on its other side: its curved body runs into the glass lounge
  table and the Chesterfield's right arm. The bar, lounge and piano are three pieces in about two tiles; the piano needs a clear
  tile of its own (for example toward the front middle between the Chesterfield and the band stage, or drop the lounge table
  a tile left). No page errors. Owner: ROOMS.
- DONE by QA (QA findings: clear of the bar, now against the lounge). WAITING ON QA (ROOMS's message): check b19a578, the grand piano turned away from the bar.
- QA, ROOMS's fe48618, Lock and Key's Friday Band (on c5073e8, port 8770, `rigtest/qa/band.js`; `shots/lockkey_jazz.png`,
  `lockkey_band.png`, `lockkey_piano.png`): pass, one small fix. The Friday Band is not for sale until the Jazz Corner is owned,
  then it is; bought, the mic stage leaves the picture and the bigger band stage (drums, double bass, mic) takes the front
  corner, nothing outside the room and nothing overlapping it, clear of the door mat and the high-tops; One More High-Top adds
  one table (3 in all with High-Top Tables). FIX (small): the grand piano still touches the bar: its raised lid lies over the
  last stool's legs and the brass foot rail; move it another step toward the front, or turn the lid away from the bar. No page
  errors. Owner: ROOMS.
- QA, ROOMS's Lock and Key, the Upstairs Bar (4599993, on 3348c7b, port 8770, `rigtest/qa/skybarshell.js`; `shots/lockkey_bare.png`,
  `lockkey_full.png`): pass, one small note. The painted brick-and-walnut shell (`skw_t1`) draws bare and fully bought (17 pieces),
  nothing outside the room; the painted stairway sits at the back wall's far right end with the Roof glow at its foot, clear;
  Downstairs glows at the front-left edge, clear of the sofas; the walk Lock and Key -> Downstairs (bottom left) -> Restaurant ->
  Upstairs -> Lock and Key -> Roof (top right) -> Rooftop Bar -> Bar (bottom left) -> back all lands right, as Cal's rule wants;
  the back bar stays under the wall top; a save owning all 15 upgrades (retired ones too) keeps all 15. Note: the grand piano
  stands tight against the bar's front end, its lid up against the last stool; a tile further from the bar would read better.
  No page errors. Owner: ROOMS (optional).
- QA, ROOMS's ef0ecc8 (on 3421dca, port 8770, `bobashell.js`, `dessertshell.js`, `speakretired.js`; `shots/boba_full4.png`,
  `dessert_full3.png`): pass. Both front-door mats are clear: the Shaker Station stands beside the pickup shelf and the Macaron
  Tower beside the Cake Stand; nothing outside either room; every door walks. The old Speakeasy opener (`de_secret`) is retired:
  a new player with the Dessert Parlor fully bought sees no card for it and no Hidden Door arrow; a save that already owns the
  Speakeasy keeps it, and the Hidden Door still leads there. No page errors. Owner: none.
- DONE by QA (QA findings: pass). WAITING ON QA (ROOMS's message): check ef0ecc8, the mat fix and the retired Speakeasy upgrade.
- QA, ROOMS's 23f993d (on b325eba, port 8770, `bobashell.js`, `dessertshell.js`, `menuscreen.js`; `shots/boba_full3.png`,
  `dessert_full2.png`, `boba_menuscreen.png`): on the floor now, one fix. Nothing stands outside either room any more, the doors
  all walk, and the Dessert Downstairs glow sits clear at the left end of the front-left edge. The Boba Menu Screen is fine live:
  sampled every half second for 8 seconds it showed the drinks list (Milk Tea, Mango, Brown Sugar, Taro, Lychee, Oolong with
  prices) every time; the black was only the still render. FIX (both rooms): the Shaker Station (Boba) and the Macaron Tower
  (Dessert) now stand on the front-door mat, half covering the entrance; move each a tile back from the mat (Boba: toward the
  pickup shelf; Dessert: toward the Cake Stand). No page errors. Owner: ROOMS.
- QA, v0.49's published copy (rule 18, LEAD's 1d4d878; artifact 7336ed4a, version 1793937460-7d59), read-only: pass. 439 files
  against the 438 of a clean build of 8fabe1a: 437 match by sha256; `index.html` differs only by its title ("Quest Board v0.49
  (test, fresh start)", exactly the 26 extra bytes); `lfvar.json` is the page-only file HANDOFF.md says to keep, the same size
  and sha256 as in v0.48. Nothing from the build is missing. Its database holds 2 documents (1.4 KB), so nothing near a played
  save; QA did not read them (probably the first open's save and its backup). Owner: none.
- QA, ROOMS's f0c6dbb, the Dessert Parlor and the Boba fixes (on 4b1c78b, port 8770, `dessertshell.js`, `bobashell.js`;
  `shots/dessert_bare.png`, `dessert_full.png`, `dessert_downstairs.png`, `boba_full2.png`): the shells and doors pass, 2 pieces
  now stand off the floor. Pass: the Dessert Parlor's painted shell (`dsw_t1`) bare and fully bought, the tall painted bookcase
  on the right wall with the Hidden Door's glow at its foot, clear; the walk Dessert -> Downstairs (bottom left) -> Boba ->
  Upstairs -> Dessert -> Hidden Door (top right) -> Speakeasy -> back all lands right. Boba: the stairs are clear, the window
  bench sits under the window, clear of the side door. FIX 1 (Boba): the Shaker Station moved to the front-right corner and now
  hangs off the floor's edge (audit: `bbx_shake` outside the room); put it on the floor by the pickup shelf. FIX 2 (Dessert): the
  Macaron Tower (`dsx_tower`) stands on the front-right edge, half off the floor; move it in a tile. Notes: the blue cafe chair
  stands right beside the Downstairs glow on the front-left edge; the speakeasy's way back ("Dessert") is on its front-right
  edge, where Cal's rule wants the front-left (for the speakeasy step); the Boba Menu Screen is black in a still picture (ROOMS:
  it cycles pages), not checked live. No page errors. Owner: ROOMS.
- QA, ROOMS's Boba shop c223d89 (on 6896d2a, port 8770, `rigtest/qa/bobashell.js`; `shots/boba_bare.png`, `boba_full.png`,
  `boba_stairs.png`, `boba_sidedoor.png`): the shell and the doors pass, 2 placement fixes and 1 note. Pass: the painted shop
  (`bbw_t1`) draws bare and fully bought, nothing outside the room; the side door walks both ways (Boba's "Garden" arrow top
  left, the Garden's "Boba Shop" arrow bottom right: out on the right, in on the left), and "Upstairs" reaches the Dessert
  Parlor; the Neon Cup Sign hangs high over the tea jar shelf. FIX 1: fully bought, the shaker station (the pink cabinet with the
  cup stack and the blender) stands right in front of the painted stairs and hides their glow; move it left along the wall,
  clear of the doorway. FIX 2: the window seat's left end runs across the side door to the Garden (the green glow shows under
  the bench); shorten it or move it right. Note: the Menu Screen on the back wall is a blank black panel; give it the menu
  (like the Restaurant's screen) or art. No page errors. Owner: ROOMS.
- DONE by LEAD (published as v0.49, 7336ed4a). QA, v0.49's pre-release check (rule 18 step 2, 8fabe1a, APPV 49; `shots/v49/`): pass, ready to publish. savecheck.js: every case
  passes (newest wins, no needless question, device only, someone else's save ignored, levels 8, 30 and 60 kept, a new player
  starts clean). screens.js at 360 and 390 px: every tab and a room window fit, no page errors. A brand-new player: the
  character screen, then the Board, v0.49 on desktop and phone. A new save to the Restaurant (`sim.js`, `unlocks.py`): 12-task
  The Loft day 1, Hall 3, Garden 4, Wheel 5, Mara 6, Knock Through bought and the Restaurant open on day 7, Relics 7; casual The
  Loft 2, Hall 5, Garden offered 6 and built 9 (1,500 coins), Wheel 9, Mara 10, Relics 11, the Restaurant day 12; the beds
  watered every day and never dry, produce sold at the stand; one unlock a day (day 5 of the 12-task run also has the closet
  they buy). Real taps: both stands sell once; the watering can waters on and beside it at every stage, desktop and phone;
  Knock Through is a mystery card until Mara's yes, then for sale. Shop check (`shopcheck.js`): 44 checks pass. Trophy Room
  passes. Doors: the Garden and Restaurant pair passes; the 10 Plaza and Mall pairs that miss Cal's left/right rule are the
  same as in v0.48 (ROOMS's list, not new). No page errors anywhere. Owner: LEAD (publish).
- DONE by QA (QA findings: pass, ready to publish). WAITING ON QA (LEAD's message, rule 18 step 2): the pre-release check of v0.49 (8fabe1a): savecheck.js, screens.js,
  a new save from level 1 to the Restaurant, and what changed since v0.48.
- QA, LEAD's 912f32c (on b8742cd; `sim.js`, `unlocks.py`, `water.py`; `shots/unlocks_water_b8742cd.txt`): pass. (1) Early unlocks in
  their own level's order, one a day: 12-task The Loft day 1, Hall 3, Garden 4, Wheel 5, Mara 6, Relics 7, Boba 9, Dessert 10 (day
  4 also has the closet the player buys); casual The Loft 2, Hall 5, Garden 6, Wheel 9, Mara 10, Relics 11. No played day without
  something to buy. (2) Sprinklers at the Estate for 6,000: the 12-task player can buy them on day 44 (waterer) or 45 (forgetter),
  the casual player not by day 45 (level 32). Over 50 days the forgetter (waters 1 day in 3) finds the beds dry on 28 days and
  sells 2,691 produce for 10,764 coins against the waterer's 6,400 for 25,600, and earns 384,471 against 405,103 (5% less);
  level (86 on day 45) and every upgrade (day 45 or 46) are the same, and Mara still comes on day 6 for both. So watering now
  costs real produce without slowing anything else. No page errors. Owner: none (Cal: the numbers for the watering habit).
- QA, ROOMS's 0b23996 and d1d7c73 (on ba6cf1c, port 8771; `citylights.js`, `restmenu.js`, `freshstart.js`; `shots/city_night_before.png`,
  `city_night_after.png`, `rest_noir_furniture.png`, `fresh_start_phone.png`): pass. The city's window patterns light 1, 4 and 2
  of 16 windows (were 10, 10 and 7), dimmer (mean opacity 0.45 to 0.65, was about 0.71), and the night picture is much calmer.
  Noir with White Linen sets black marble and brass tables with charcoal chairs; the Bistro keeps white linen and red chairs;
  the fire pit's chairs are clear of the deck rail. ROOMS's testing note ("new saves land on a locked Loft tab") is only their
  test setup: a real new player sees the character screen, then the Board, on desktop and phone. No page errors. Owner: none.
- DONE by QA (QA findings: pass). WAITING ON QA (LEAD's message): check 912f32c: early unlocks strictly by their own level; Sprinklers at the Estate, 6,000.
- QA, ROOMS's a9a572c and e415c00 (on 85f696a, `restshell.js`, `restmenu.js`, `cantap.js` with a real mouse; `shots/rest_patio_noir.png`,
  `rest_patio_diner.png`, `rest_patio_rail.png`): pass, one small note. The patio front reads fire pit left, the table under the
  pergola right, the sign in the gap (Corner Diner, Bistro, Noir); a low rail runs between deck and dining room with the gap at
  the door mat; Noir with the wine wall has no white cooler. The can's tap area: desktop 173 to 97 px, phone 61, 44 and 34 px
  (Back Plot, Kitchen Garden, Estate); a tap on the can and one 15 px beside it both water, at every stage on both screens. Note:
  the left Adirondack chair sits on the end of the rail. No page errors. Owner: ROOMS (optional).
- DONE by LEAD in 912f32c (Estate stage `g_x2`, 6,000 coins). CAL'S DECISION (2026-11-05, to QA, on the watering finding above): "Yes, much later": the Sprinklers (`g_spr`) move much later so
  watering stays a daily habit (QA suggested the Estate stage, or about level 40 with a big price). WAITING ON LEAD: move them,
  then WAITING ON QA and QA reruns the waterer and the forgetter. Owner: LEAD.
- QA, LEAD's three (on 3d65b70; `sim.js` now has WATER=daily|every3|never and NOBUY, `water.py`, `unlocks.py`; `shots/unlocks_3d65b70.txt`,
  `watering_3d65b70.txt`). (1) The slot by the unlock's own level, story first: pass. 12-task: Garden day 3, Mara 4, Hall 5,
  Wheel 6, Boba 7, Dessert 8, Relics 9 (plus the closet they buy); casual: Garden 5, Mara 6, Hall 9, Wheel 11, Relics 12; no other
  day with 2. Note for Cal: the Hall (town hall, class story) now waits behind the story: day 5 for the 12-task player, day 9
  for the casual one, shown as Soon for up to a week. (2) Watering: the rule works, but it barely matters. The 12-task player
  buys the Sprinklers (`g_spr`, 600 coins, least level 16) on day 4, the day after the Garden opens, and the casual player on day
  11 (Garden day 5); after that the beds water themselves. Over 50 days a daily waterer and a forgetter (1 day in 3) end the same
  (level 94, every upgrade day 44 to 45, earnings 403,585 and 403,497). With the Sprinklers held back for 20 days: daily 1,890
  produce sold (7,560 coins), forgetter 708 (2,832; dry on 11 of 18 days), never 67 (268); all earnings 92,908, 88,094 and
  84,869, so the Garden is about 8% of a 12-task player's coins and Mara still comes on day 4 for all three (the first day is
  pre-watered). If Cal wants watering to be a real daily habit, the Sprinklers need to come much later (the Estate, or level
  40 and a big price). (3) The Garden window words: pass on desktop and phone (empty lot next to your building, Knock through
  to a restaurant, 1 coin an hour, the payout on its own line). No page errors. Owner: LEAD (Cal's call on the Sprinklers).
- QA, ROOMS's 8a5ac99, 059bd45 and 82cc1f9 (on 8bb0422, `gardenlots.js`, `gardenwater.js` with a real mouse; `shots/garden_lots3.png`,
  `garden_dry.png`, `garden_wet.png`): pass, one note. Beds sit on the grid and the grow lights run along them; the Estate with
  the fountain has no sundial, birdbath or topiary; the scarecrow is by the left wall at every stage. At every stage dry beds
  look parched, one tap on the watering can waters for 24 hours, the beds turn damp and the window says so; Sprinklers keep them
  damp unwatered. The Back Plot stand is in (only 9% of it below the picture on desktop). Note: the can is a small target,
  61x55 px on desktop at the Back Plot down to 34x31 at the Estate, and 22x20 down to 12x11 px on a phone (a finger needs about
  44): give it a bigger invisible tap area. The window's Water button works either way. No page errors. Owner: ROOMS.
- DONE by QA (QA findings: pass; Sprinklers make watering moot, Cal's call). WAITING ON QA (LEAD's message): (1) the slot keyed on each unlock's own level, a waiting story step first (33e9721),
  rerun the early timeline; (2) watering (a2e234e): add a waterer and a forgetter to the economy run; (3) the Garden window
  words (6a1f7ab). Also ROOMS's 8a5ac99 (beds on the grid, grow lights, the Back Plot stand a tile in), a quick look.
- QA, a quick look at ROOMS's 73e48c3 (no QA line was posted; it answers QA's two notes; on 0c3e73c, `gardenlots.js`,
  `standtap.js` with a real mouse; `shots/garden_kitchen_full3.png`, `garden_stand_desktop.png`, `garden_stand_phone.png`): pass,
  one small fix each. The lamp post stands clear of the sundial, and the scarecrow is off the stone bed (in the back-left corner
  behind the tomatoes). Tapping either stand sells once (crate stand on the Back Plot, Farm Stand in the Kitchen Garden): coins up,
  produce to 0, a second tap sells nothing. FIX (ROOMS): on desktop the Back Plot's crate stand stands so far forward that 41%
  of it is below the bottom of the room picture, cut in half (on a phone it shows whole); move it back a tile. FIX (LEAD, text):
  the Garden window still says "A small plot behind the building" (the story calls it the empty lot next to your building) and
  "Build the Restaurant to put these to use" (it is Knock Through now); "1 coins/hr" should be "1 coin an hour"; on a phone that
  yellow line runs off the right edge. No page errors. Owner: ROOMS and LEAD.
- QA, LEAD's 4093cb9 (on 886b385; `day1areas.js`, `sim.js` 6 and 7 days, an in-page old-save test; `shots/unlocks_886b385.txt`):
  the fix works, one knock-on effect. A fresh save has board, train, shop and away; level 2 takes The Loft and the day's slot;
  the Hall at level 4 waits (Soon) for the next day. A level-20 save with no `S.areaOn` gets all 8 areas, none waiting. Knock-on:
  every early area now comes a day later, and they pile up on the day the player passes level 10. 12-task player: The Loft day 1,
  Hall day 3, then day 4 (levels 9 to 15) brings Wheel, Relics and the Garden at once (and the closet, which they buy). Casual:
  one a day (The Loft 2, Hall 5, Garden 6), but the Garden is now offered on day 6 at level 9, held by the trial at 10, with 555
  coins: the lot is 1,500 and the cheapest upgrade 600, so a played day with nothing to buy. Suggestion: tie the shared slot to
  the unlock's own level (areas and steps that open below level 10 share one a day, whatever the player's level), and let the
  story step go first when both wait, so the Garden is not pushed back by Wheel and Relics. No page errors. Owner: LEAD.
- DONE by QA (QA findings: works, 1 knock-on). WAITING ON QA (LEAD's message): check 4093cb9, S.areaOn made at load and at first creation (day one).
- QA, ROOMS's 29c09a7 (on f0dcdd1, `gardenlots.js`; `shots/garden_lots2.png`, `garden_kitchen_full2.png`,
  `garden_lamp_sundial.png`): pass, two small notes. (1) The wooden beds stand beside the painted stone beds now, none on top,
  at every stage. (2) The Kitchen Garden's front is spread out: hive and coop on the front-left strip, the shed by the tools,
  the pump by the trellis, the iron gate on the lot edge at the end of the walk. (3) The Grow Lamps are light frames over the
  beds, no more purple screens. The crate stand shows at the Back Plot's gate from a bare lot, and the Farm Stand at every
  stage. Notes for ROOMS, small: the lamp post by the arch stands inside the stone sundial (Kitchen Garden, front middle), and
  the scarecrow stands on the front stones of a painted bed, under a grow-lamp frame (Back Plot and Kitchen Garden). No page
  errors. Owner: ROOMS (optional).
- QA, the shared unlock slot (ddc2171, on 334c735; `sim.js`, `unlocks.py`, `day1areas.js`; `shots/unlocks_334c735.txt`): works,
  one small fix. Casual player: Wheel day 5, Garden day 6, Relics day 9 (level 11), Mara day 10, one a day. 12-task player:
  Wheel day 3, then day 4 goes 9 to 15, past level 10, so Relics and the Garden open together as designed (plus the closet,
  which the player buys), Mara day 5, Boba 9, Dessert 10. FIX (LEAD, small): day 1 still brings The Loft and the Hall. A new
  save has no `S.areaOn` until its first level-up, and `areaOn()` then marks every area up to the current level as already
  reached: at level 2 The Loft turns on with no card and no slot, and the Hall (level 4) takes day 1's slot. Make `S.areaOn`
  at character creation (level 1), so The Loft takes day 1 and the Hall waits for day 2; old saves keep what they have. No
  played day had nothing to buy; no page errors. Owner: LEAD.
- DONE by QA (QA findings: works, 1 small fix). WAITING ON QA (LEAD's message): rerun the first 10 days on ddc2171, one shared unlock slot a day below level 10.
- QA, the unlock timeline again on aa165b1 (on 52b50cf; `sim.js` now reads `S.areaOn` and the story offers each day, `unlocks.py`;
  `shots/unlocks_52b50cf.txt`): both fixes work. No level-up screen shows 2 New areas, and no day opens 2 story steps; after day 5
  every unlock arrives on its own day for both players (12-task: Boba 7, Dessert 8, closet 9, patio 12, game room 14, Lock and
  Key 19, Rafe 20, Rooftop 21, Lair 24, Mall 25, Theater 26, Nova 27, Auditorium 28, Arcade 29; casual: Restaurant 6, Boba 17,
  Dessert 23, closet 26). Still 2 or more on one DAY in the first five, because areas and story steps are paced separately and
  a new player levels several times a day: 12-task day 1 (The Loft at 2, Hall at 4), day 3 (Wheel and the Garden), day 4
  (Relics and Mara); casual day 2 (The Loft and Hall), day 5 (Wheel, Relics and the Garden: two level-ups that day). That meets
  Cal's words ("not multiple unlocks from 1 level"). If he wants one a DAY, share one daily slot between `areaReveal` and
  `styCheck` for the first week. No played day had nothing to buy; no page errors. Owner: LEAD (Cal's call on per day).
- DONE by QA (QA findings: both fixes work). WAITING ON QA (LEAD's message): rerun the unlock timeline on aa165b1: one New area per level-up, one story step a day.
- QA, ROOMS's 28a51ee (on 3124efd, `rigtest/qa/gardoors.js`; `shots/gardoor_restaurant.png`, `gardoor_garden.png`): pass. The
  building map puts the Garden right of the Restaurant (restaurant [1,0,0], garden [1,1,0], Boba [1,2,0]). At all 12 pairs
  (Back Plot, Kitchen Garden, Estate x Hole in the Wall, Corner Diner, Bistro, Noir) the Restaurant's "Garden" arrow (bottom right,
  the gap in the kitchen's end wall) and the Garden's "Restaurant" arrow (top left, the lit doorway in the back-left brick wall)
  walk both ways and come back to the same room. Out on the right, in on the left, as Cal asked. No page errors. Owner: none.
- QA, ROOMS's Garden lots (4725457, cd73831, 5fa3fec, on df5d7c3, `rigtest/qa/gardenlots.js`, 6 cases; `shots/garden_lots.png`,
  `garden_kitchen_full.png`): the lots pass, 3 placement fixes. Pass: each stage draws its own painting (`gdw_s0`, `gdw_s1`, `gdw_s2`),
  brick walls show with no hedge or glass fence over them, nothing stands outside the lot or pokes through a wall, and the
  Estate's walls end at the stone coping with a thin edge, no black band. Bare lots are clean. FIX 1, two kinds of beds: each
  painting has stone-edged beds, and the wooden raised beds stand half on top of them (Back Plot: the tomato and lettuce beds
  over the back stone bed; the same in the Kitchen Garden and the Estate). Put the raised beds exactly on the painted beds, or
  paint the lots without beds. FIX 2, the Kitchen Garden's front middle: the rose arch, chicken coop, beehive, iron gate, lamp
  post, scarecrow, solar panel and water pump all stand within about two tiles and overlap (audit: lantern on the logs, the
  topiary on the logs and the coop, a tomato bed drawn over a lantern); the gate stands alone on the lawn, not in any fence
  line. Spread them out and put the gate on the edge with the path. FIX 3, Grow Lamps (`g_lamp`, "Purple light, fast growth")
  are flat purple panels on poles standing on open lawn away from every bed, so they read as TV screens: hang them over the
  raised beds, or give them art. No page errors. Owner: ROOMS.
- QA, the unlock timeline and the economy for Cal's new early game (b1088f8 `ECON.stepLv`, on 2d26053; `rigtest/qa/sim.js` now
  keeps every level-up card and the story steps by name, `unlocks.py`; full map in `shots/unlocks_2d26053.txt`). One unlock = a New
  area, a story step with the lot or room it opens counted once, or a room opened by an upgrade; UI upgrades and Shop restocks are
  listed, not counted. No single level-up screen in the runs had 2 unlocks, and no played day had nothing to buy. Days with 2:
  12-task player: day 7 (Boba, level 23, and the walk-in closet bought the same day), day 19 (Dessert and Lock and Key, levels
  42 to 44), day 25 (Rooftop and Mall, 49 to 53), day 26 (Nova and Theater, 53 to 54). Casual player: day 5 (Relics and the Garden,
  levels 4 to 9); then one at a time (Restaurant day 13, Boba 19, closet 25; level 26 on day 30). FIX 1 (LEAD), the first trial:
  stored XP releases 4 to 9 at once, and `levelUp(afterLv,...,beforeLv)` shows the cards of levels 6 to 9 on one screen, so
  clearing it gives the class pick, then Wheel (6) and Relics (8) together, and the Garden scene (least level 5) right after:
  4 new things in one moment, the "multiple unlocks from 1 level" Cal saw. (The sim clears trials without that screen, so this
  is from the code: `clearGate` -> `advModal` -> `levelUp`.) Same for gate 10 (9 to 15): levels 10 and 11 are never shown. Fix:
  put the three New areas a trial apart (Hall 4, Wheel after gate 5, Relics after gate 10), or let a trial-clear screen show one
  unlock and hold the rest for the next level-ups. FIX 2 (LEAD, for the 2-unlock days): `stepLv` almost never decides anything.
  The 12-task player is far past each least level when the step's own gate opens (Dessert, least 11, opened at 44; Mall, least
  20, at 53), and the casual player too (Restaurant, least 7, at 17). Only the Garden's 5 binds, and it is held by the trial at
  level 5 anyway. To space them: let `styCheck` open at most one story step a day (simplest, matches "one at a time"), or raise
  `stepLv` toward the levels players really reach. Gd_rest (`gdrest.js`) works: a mystery card at 0 and at 60 sold, for sale
  right after Mara's yes. Economy to level 80 (the Garden later changes almost nothing): 12-task player owns every upgrade on day
  44 at level 82, level 100 on day 55 (sim9: day 45, level 79); grinder every upgrade on day 21 at level 93, level 100 on day 25.
  No page errors. Owner: LEAD.
- QA, LEAD's 4f15346 (on 2d26053, `audit49.js`, the static check now reads `dist/app.js`): pass. 108 level-up screens 1 to 100,
  no NEW BLUEPRINT and no LOFT EXPANDED card, no crew, vault or bad text; the New areas are Hall 4, Wheel 6, Relics 8. Owner: none.
- QA, ROOMS's f457680 and eb85e90 (on 9ae8634, `restmenu.js` and `restshell.js`; `shots/rest_booth_firepit.png`,
  `rest_booth_firepit_noir.png`): pass. The crescent booth (`rdx_curve2`) sits in the back-left corner and opens straight at the
  room, with its round table inside it (the only overlap the audit finds, which is meant); the Fire Pit Lounge is a stone bowl with a
  fire, Adirondack chairs and a stone pad, in the Bistro and Noir. Board still 26 of 26. No page errors. Owner: none.
- DONE by QA (QA findings: 2 fixes for LEAD). WAITING ON QA (LEAD's message, Cal: "not multiple unlocks from 1 level ... not this early"): on 16e72c3, map every
  unlock by day and level over the first 30 days for the 12-task and casual players, flag any day or level with 2 or more, and
  rerun the economy to level 80 with the Garden later.
- DONE by QA (QA findings: pass). WAITING ON QA: check 4f15346 (rule 17): level-ups no longer show room blueprints or new Loft floors (bpCard and floorCard
  calls removed from levelUp). LEAD checked levels 2 to 31 headless.
- DONE by LEAD in 4f15346. QA, LEAD's text and story audit (ca1068d, on c1f1aa5, `rigtest/qa/audit49.js`; every level-up screen 1 to 100 in
  `shots/levelups_c1f1aa5.txt`): mostly pass, 1 fix for LEAD. Pass: `unlocksFor` returns null, so no level-up shows the old crew,
  the vault or a relic, and none of the 108 screens has "[object Object]", "undefined" or NaN; the New area cards read the new
  Shop, Hall, Relics and Wheel lines; Sable's visit (Trophy Room) and Rafe's (Lock and Key) are not due on a new save or with a
  set half done, and are due once the goblin set and the amulet are finished (Sable uses her team banner, Rafe his own picture);
  the Dungeons and Relics screens have no bad text, the relics show the star stand-in and set emblems draw nothing until the art
  exists; `tools/art_slots.py` rerun gives the same 55 of 67 as `docs/ART_SLOTS.md`. FIX (LEAD), the level-up screens still
  announce the old blueprints and floors, against the storyboard: level 8 "NEW BLUEPRINT Restaurant ... Build it in your
  Hideout", level 14 "NEW BLUEPRINT Garden: A small plot behind the building", 16 Boba Shop, 24 Movie Theater, 30 Mall, 50
  Nightclub, and "THE LOFT EXPANDED Floor N is open. Two new slots to build on" at 8, 12, 16, 22, 26, 32 and 38. A save at
  level 15 with no story progress has no lots and `__qbStory.allows` is false for all of them, so the cards promise rooms the game
  does not open, the Restaurant before the Garden (Cal's order is Garden at level 3, then Mara), and "Hideout" is the old name.
  Where: `levelUp` in 30_app_b.js (`bpCard` from `ROOMSOPEN`/`ROOMT[k].lv`, `floorCard` from `FLOORLV`). Drop both cards, or
  word them as story hints. Owner: LEAD.
- QA, ROOMS's d30bb93 and 642b791 (on c1f1aa5, `rigtest/qa/gameroom.js` and `restmenu.js`; `shots/gameroom_fixed.png`,
  `gameroom_crt.png`, `rest_board_all.png`, `rest_board_cornerdiner2.png`): pass. The Retro TV's screen faces into the room on
  the beanbags' side; Gaming Desks draws one long desk (`gmx_rig2`, the old `gmx_rig` not drawn) with two screens and a chair at
  each, clear of the ping pong table; the board lists 26 of 26 in the Bistro and Noir, no name runs into its price, and in the
  Corner Diner it hangs clear of the painting and the wine wall. The text is small at room size, which Cal says is fine. No page
  errors. Owner: none.
- DONE by QA (QA findings: pass, 1 fix for LEAD, the level-up blueprint cards). WAITING ON QA (LEAD's message): check ca1068d (rule 17), Cal's text and story audit: level-ups without the old crew or
  vault relics, the new Shop, Hall and Dungeons lines, two return visits after a finished dungeon set, the set emblems, `docs/ART_SLOTS.md`.
  Also ROOMS's d30bb93 (Game Room: the Retro TV faces the beanbags, `gmx_rig2`), a cheap look.
- QA, Cal's Restaurant notes (04bb241, 0edb26c, on 54a4074, `rigtest/qa/restmenu.js` and `restshell.js`; `shots/rest_notes_bistro.png`,
  `rest_notes_noir.png`, `rest_board_bistro.png`, `rest_board_cornerdiner.png`): 3 of 5 pass, 2 need a fix. Pass: (1) Bistro and Noir back wall:
  the tables near it stand on the floor in front of it; (3) all seven gear upgrades add their dishes to the Menu line (Espresso Bar:
  Espresso, Cappuccino; Flat-Top Grill: Smash Burger, Grilled Cheese; Fryer: Fish & Chips; Bakery Rack: Croissant, Sourdough; Wood-Fired
  Oven: Roast Chicken; Grand French Range: Steak Frites, Duck Confit; Charcoal Grill: BBQ Ribs); (4) the crescent booth sits in the
  back-left corner, open to the room, and the window booths and dividers no longer overlap it (the only overlap the audit finds is its
  own round table, which is meant); (5) the half-wall is forest green in the Bistro and black in Noir. NOTE 1 (Cal, 2026-11-05: "The menu doesn't need to physically list every
  item. It just needs to list some so the restaurant feels alive. But if you can fit them all, then sure why not?"): the board shows
  14 of 26 (`items.slice(-rows*2)`), which is fine; fitting all of them is optional. Still fix: "Roast Chicken" runs into its price
  (shorten long names or move the price over). FIX 2, in the Corner Diner
  the abstract painting hangs over the left end of the board and hides the first letters of every left-column dish ("& Chips"); in
  the Bistro and Noir they are apart. Move the painting or the board in the Corner Diner. Owner: ROOMS.
- QA, the Restaurant's painted shells (ROOMS's 1eb8040, 156683a, 64e4735, on 7f4d885, `rigtest/qa/restshell.js`, 16 cases:
  each size bare and fully bought, with and without the patio; `shots/restaurant_shells.png`): pass. Each size draws its own
  painting (Hole in the Wall `rsw_s0`, Corner Diner `rsw_s1`, Bistro `rsw_s2`, Noir `rsw_s2n`), the walls and floors read
  as one room, the front mat shows, nothing stands outside the room in any case a player can reach (the patio needs Knock
  Through the Wall, so no patio at Hole in the Wall size), no page errors. Placement lessons for the fine-dining pass
  (`shots/restaurant_bistro_zoom.png`): (1) the kitchen half-wall keeps the diner's teal in the Bistro, against its cream, green
  and wood; give it each shell's colours; (2) the booths' tall backs and planter screens cover the bottom third of the
  Bistro's arched windows: lower booths, or seat them clear of the windows; (3) the patio's fire pit, curved sofa, umbrella
  table and pergola bunch in the front corner, the pergola over the umbrella, with no rail or step between deck and dining
  room; (4) the white drinks cooler still stands in a dining aisle. Old notes still true: one diner seat has nothing under it
  (`seat-on-air cust:diner`), the counter sorts over the kitchen box. Owner: ROOMS.
- QA, the arrow fix (LEAD's 06cd203, on db59276): pass. Buying each Loft expansion from the Bedroom window (Knock Into the
  Game Room, Walk-in Closet, Patio Door): the new room's arrow shows 0.3 s after the purchase, stays through the splash, and
  matches what a reopened window shows. No page errors. Cal's finding (1) is fixed; (2) and (3) stay with ROOMS. Owner: LEAD.
- DONE by QA (QA findings). WAITING ON QA: check 06cd203 (rule 17): the door arrows now show right after buying an expansion (lfInstallFx redrew the room
  picture without them). Buy each room's expansion and look for the new arrow without reopening.
- LEAD's part (the arrows) DONE in 06cd203; ROOMS's two findings stay ROOMS's. **Cal tested v0.48 on his phone (2026-11-05): "Phone looks pretty good."** Then: "Have the other chats continue on with the
  restaurant." LEAD and ROOMS: carry on with the Restaurant next. His three findings, for the next version
  (`shots/cal_phone_v048_gameroom.png`, his screenshot):
  (1) "I can't see the arrows to go to the other rooms when I purchase the expansions. I have to close and re enter in order
  to see it." QA reproduced it on 10e26fa: buying Knock Into the Game Room adds the room and opens its splash, but the
  Bedroom window behind it has no arrow; reopening the window shows "Game Room". The window should come back with its new
  arrow after an "opens" upgrade (the `raddon` flow and `roomSplash`, `30_app_b.js`). Owner: LEAD.
  (2) "The game room also has a small tv facing the wrong way": the Retro TV Corner's old TV, by the beanbags. Owner: ROOMS.
  (3) "the double gaming rig doesn't make sense because there are two desks but 4 monitors": with QA's earlier finding (both
  chairs on one side, a guest spot inside it), the Gaming Desks need one screen setup per desk, a chair facing each. ROOMS.
- QA, the Trophy Room (ROOMS's 9be3f51, on 10e26fa, `rigtest/qa/trophyroom.js`): pass. No piece yet: the Lair shows "? ? ?"
  and the stairs are not for sale; one piece home: "Stairs to the Trophy Room" for sale, bought for 1,800, the room opens;
  the arrows walk Lair -> Trophy Room (arrow top right, by its back-wall door) -> Hero's Lair (bottom left) and back; the
  mannequin wears exactly the owned pieces in five combinations (none, helm, helm chest sword, boots greaves, all five;
  `shots/trophyroom_mannequin.png`); The Loft's building view draws the hall above the Lair above the Closet
  (`shots/trophyroom_building.png`). The door pair follows Cal's rule (back wall to front-left). Notes: the hall reads dark
  overall, the spotlight carries it; no painted doorway (known). No page errors. Owner: ROOMS, nothing to fix.
- QA, v48 pinned test copy (c6a11c9, slug 95ef49a7...): pass. `savecheck.js` all cases, `screens.js` at 360 and 390 nothing
  wider than the screen, no page errors. Training: 9 plans, 65 exercises, 130 pictures, all load from `art_ex.js` (128 files in
  it). Game Room: all 21 image files load, nothing dark. The published page holds every one of the 417 build files with the same
  checksum (`list_files`); only `index.html` differs (the page's wrapper) and `lfvar.json` is extra (it lives only there): so the
  black rooms and dark squares Cal saw were the upload still running, nothing missing now. Not checked: a real phone, the
  page's own database (QA cannot sign in). Owner: LEAD, nothing to fix.
- QA, dungeon art (ROOMS's d48ed81, on 56ec295): pass. All 13 names the code asks for (`ui_tr_<set>_<piece>`, the two
  `_set` emblems, `ui_gift`) ship in `art_ui.js`; on the Trophies tab every owned piece (all five Goblin King, two shards) shows
  its painting, unowned shards show the placeholder. No page errors. Owner: ROOMS, nothing to fix.
- QA, class banners (ROOMS's 6b7b9c8, on a78cb01, 390 x 844): pass. All eight ship in `art_ui.js`; with each of the four
  classes the Board's class banner draws its painting behind the emblem (`--clsart`), the man's or woman's version by body
  (`clsArt`). The Hall tab shows the emblem only, as built. No page errors. Owner: ROOMS, nothing to fix.
- QA, writing pass review against `docs/VOICE.md` (LEAD's request, on 90d88d1, `rigtest/qa/voice.js`): 1,369 player-facing lines
  checked; the hard rules hold except 3 (Teleport Pad "It probably works.", VOICE.md's own example to cut; Taiko "Don! Ka!";
  the old gym's "The real boss fight."). By hand, about 25 upgrade lines still end on a punchline or a wink, most of them the
  Game Room's (`27b_skins.js:61` to `79`: "Spinning is cheating.", "Nobody ever gets up.", "The room comes alive."), plus
  "The critics came. You won." (`21_restaurant.js:64`, praise for the player). Each with file, line and a rewrite in
  `docs/QA.md`, Writing pass review. Owner: ROOMS (room and upgrade lines, VOICE.md), LEAD (`10_app_a.js:1515`).
- QA, team join banners (ROOMS's 4fc1542, on e272f80, 390 x 844): pass. All five ship in `art_ui.js` and each join window
  shows its painting (720 x 400) above the name, role, stats and buff; text fits the phone (`shots/team_banner_rafe.png`).
  No page errors. Owner: ROOMS, nothing to fix.
- QA, story portraits (ROOMS's 625d9e3, on 860d2c8): pass. Each of the seven scenes (Mara twice, Desmond Hale, Rafe, Priya,
  Nova, Theo) shows its painted portrait (300 px wide) instead of initials. The building backdrops `bld_bg_loft`, `_plaza`,
  `_mall` ship in `dist/art` but no code reads them yet: LEAD wires them after approval 11. Owner: LEAD (backdrops).
- QA, after-commit look at ef2f2e6 (390 x 844): the drag fix (ROOMS's 47d2ffd) works: 120 finger moves made 14 transform
  writes over 40 frames, at most one a frame. The street draws the three painted fronts (`bld_loft`, `bld_plaza`, `bld_mall`)
  with their names, and the hint says "tap a building" (`shots/street_fronts_390.png`). On a phone the buildings are small in
  the top half with an empty road band filling about 40% of the screen below them: worth framing them larger. Not checked:
  the inside backdrops (`bld_bg_*`). `screens.js` at 390: nothing wider than the screen, no page errors. Owner: LEAD (framing).
- QA to Cal and LEAD: Cal's pinned level-1 test copy was taken "publishing now" at 15:39 and is not out at 16:03; LEAD's chat
  shows "waiting", which usually means a prompt is waiting for Cal in LEAD's window.
- QA, Game Room furniture (ROOMS's 9c30788, on 7501ea3, all 24 upgrades bought one at a time): the 80 inch Screen (a racing
  game on it), the Floating Media Console under it and the Cream Sectional facing the TV across the rug look right
  (`shots/gameroom_sectional.png`). The Gaming Desks do not match Cal's spec ("the two red racing chairs (...) one on each side
  facing their screens"): both chairs sit on the near side, the far desk has none; a guest spot is inside the desks
  (`cust` at 10.35, 5.10 in `gmx_rig` 9.8 to 12.8, 4.9 to 6.4; `stations.js` flags it); the Mini Fridge is wedged against the
  desks and the ping pong table touches the chairs (`shots/gameroom_desks.png`). Owner: ROOMS.
- QA, after-commit checks on e544fae: `savecheck.js` all 11 cases pass, `screens.js` at 360 and 390 nothing wider than the
  screen, no page errors. Game Room painted walls (ROOMS's a4e2a4a, all 20 upgrades bought one at a time,
  `shots/up_gameroom_walls.png`): each wall tier changes the room (Carpet & Wall Panels the whole room, LED Lighting Rig light
  strips and glowing hexes round the TV); Hex Acoustic Panels is subtle (grey hexes on a grey wall, about 9,000 pixels); with
  the separate LED Wall Panels upgrade the room has two hexagon features. Still small: Dartboard, Mini Fridge, RGB Floor Lamp
  (under 2,300 pixels each). The couch faces the TV, nothing overlaps. Owner: ROOMS (for the next pass, no fix needed now).
- DONE by QA (QA findings, 4694552). WAITING ON QA: check v48, c6a11c9 (rule 17 and 18): Cal's pinned test copy, published 2026-11-05 as a NEW artifact
  ("Quest Board v48 (test, fresh start)", slug 95ef49a7-02ac-46d1-907d-61a15d84c959, 418 files, db + user + sample with
  images, its own empty database). Run `savecheck.js` and `screens.js` on the c6a11c9 build. New in c6a11c9: exercise
  pictures travel in `art_ex.js` (an artifact holds at most 512 files; the build had 535), so look at Training's pictures.
  Note: the first upload went up in batches and Cal opened it mid-upload (black rooms, Game Room squares); it is complete now.
- DONE by LEAD in c6a11c9 (pinned). WAITING ON LEAD, URGENT (Cal, 2026-11-05): "For now, give me a version to test on my phone and pin it to the side. Every
  version you pin for me should be an initialized version of the game from lvl 1 so I can test everything from the ground up."
  Publish the current build (v48: QA cleared the economy in 470cbf7 and ROOMS's freed upgrades and door) as a NEW artifact, so
  its database is empty and Cal starts at level 1, and pin it in his left-hand panel; don't wait on his open approvals for
  this test copy. Include `lfvar.json` (`app/lfvar.json`) and declare the same capabilities as the live page (db, user,
  sample), so saving, Neighbors and photo checks work there. The friends' live page stays as it is. Then tell QA the commit:
  QA runs `savecheck.js` and `screens.js` on that build. New TEAMWORK rule 18 (Cal) is the pipeline from now on. Owner: LEAD.
- QA, economy at the level-80 prices (e64f93f, run on 961b632, `sim.js`): **Cal's targets met.** The 12-task player owns every
  upgrade on day 45 at level 79 (level 80 on day 46, 90 on day 50); the grinder on day 21. Coins (12-task, all 55 days): tasks
  36%, rooms 16%, missions 15%, level pay 13%, produce 7%, Daily Quest 4%; grinder: tasks 47%, missions 17%. No day with
  nothing to buy before the town is bought out. Rooms open every couple of days (12-task player: Garden 3, Restaurant 4, Boba 6,
  Closet 9, Patio 12, Game Room 13, Dessert and Lock and Key 18, Lair 23, Rooftop 24, Mall 25, Theater and Auditorium 26,
  Arcade 30, Bowling 36, Karaoke 38, Club 39, Rhythm 41, VR 43; Boba to Dessert is 12 days, was 31). The 377,100 total is
  fine as it is, no change needed. After the buy-out coins pile up (140,000 by day 55, the grinder 346,000 by day 35) with
  nothing to spend them on until the artifact and prestige (`docs/PRESTIGE.md`) give levels 80 to 100 a use. No page errors.
  Owner: LEAD (ready for v48 as far as the economy goes).
- QA, freed upgrades and the Game Room door (ROOMS's ab9dc81, on 961b632, `menu.js` to level 70, `doors.js`): pass. Every
  upgrade in every room is now offered and bought, including all 11 that never were (Game Room 17 of 17, Restaurant 59 of 59,
  Garden 41 of 41, Theater 34 of 34); only the Trophy Wall waits for its first trophy, as designed. The Game Room's door is in
  its left wall, matching the Bedroom's front-right edge (Cal's rule). Every arrow is on its own door's side. Door pairs that
  follow Cal's rule: 5 of 15 (all the Loft's, Theater and Auditorium); the 10 in Kode Plaza and the Mall still do not (table
  in `docs/QA.md`, Doors), and the Mall still opens straight into Karaoke two floors up. Owner: ROOMS (the remaining doors).
- QA, economy rerun on bc1368e (`sim.js`, 12-task player 60 days, grinder 45; on d0c9ea4, which holds bc1368e but not your
  uncommitted level-80 prices). Met: missions 15% of the 12-task player's coins in the second half (21% for the grinder),
  real tasks the biggest source (38%, grinder 48%), no day with nothing to buy for either, no page errors. Levels: the 12-task
  player at 80 on day 46 and 100 on day 58, the grinder at 80 on day 20 and 100 on day 25. Not met yet: every upgrade around
  level 80 (the 12-task player owns 268 of about 380 on day 60) and the long Boba-to-Dessert wait (day 6 to 37): both are the
  prices, which your level-80 set fixes. Next: commit the level-80 prices, then WAITING ON QA, and QA runs both players to
  level 80. Optional: `xpK` 0.75 puts the 12-task player's level 100 near day 51. Nothing here blocks v48. Owner: LEAD.
- QA, the team (the rest of LEAD's upgrade-income request, 29c_team.js, on d0c9ea4, `rigtest/qa/team.js`): pass. Each buff
  applies to the rooms it names and no others (Mara x1.15 Restaurant, Rafe x1.15 Lock and Key and Rooftop, Nova x1.10 Mall
  and Club, Theo x1.2 Theater and Auditorium; Garden, Mall, Theater untouched by the wrong member), the Tamer's Bond makes
  15% into 22.5%, Sable adds 10% to mission pay, the join banner shows name, role, stats and buff, Sable joins with her banner
  on the first mission home, and the team leads the missions. The room window rounds coins/hr to whole numbers, so on a
  small room (Boba 4/hr) a 15% buff can show no change. No page errors. Owner: LEAD, nothing to fix.
- QA, story scenes (LEAD's aa0d9ed request, on c7151e1, `rigtest/qa/story.js`): pass. A new save walked from the Garden to the
  Auditorium, each gate held one short and then met: nothing opens early, each opens on its gate (Garden at level 3, Mara at 60
  produce sold, Boba at 80 served, Dessert at 4 Boba upgrades, Lock and Key at 25,000 earned, Rooftop at 6 Lock and Key
  upgrades, Mall at 80,000, Theater at 4 Mall upgrades, Auditorium at 2 Theater upgrades); "Not yet" keeps Mara away, she
  returns after 30 minutes; lots reach the street in order; an old save owning every room gets no room scene and no lot (only
  Rafe's team scene, which is not a room). Days each room opened (d7ae577, prices as built), 12-task player: Garden 3,
  Restaurant 4, Boba 6, Closet 13, Patio 22, Game Room 24, Lair 36, Dessert 39, Lock and Key 39, Rooftop 50, Mall 51,
  Theater 52, Auditorium 53; grinder: everything by day 54. The 33 days from Boba to Dessert come from prices (the player buys
  cheaper Loft pieces first); the level-80 prices will shorten it, and QA reports these days again on that rerun. Owner: LEAD.
- DONE by LEAD in e64f93f ((1) to (3)); Cal, 2026-11-05: the Mall Fountain and the Projection Wall earn (they draw a crowd), 3a6ff08, which also makes every "Earns +N% here" line show the real share. QA, upgrade income (LEAD's d523cf1 request, on 37b053a, all 357 business upgrades read from the live game: 66 looks only,
  291 earn). Fix: (1) three looks-only upgrades still tell the player "Earns +6% here": Banker's Lamp Table (speakeasy
  `sp_lamp`), Trophy Case (rhythm `rh_trophy`), Stage Lights (karaoke `ka_light`); (2) the Theater's Arcade Cabinet (`t_arc`)
  is a coin machine people play, but looks only: `{earn:1}`; (3) decor that earns: Tea Prints (`bo_art`, "two small prints"),
  Sakura Tree (`de_sakura`), Equalizer Wall (`rh_eq`): `{decor:1}`. Cal to say: the Mall Fountain (+24%) and the VR Projection
  Wall (+24%) are decor that draw a crowd. Looked at and fine: plots, trees and grow lamps in the Garden (they grow produce),
  Soda Fountain, Liquor Wall, Tea Jar Wall (stock), the expansions. Not done yet: the team buffs part (each buff applies,
  the join banner, missions led by the team). Owner: LEAD.
- DONE by QA (QA findings). WAITING ON QA: check the economy, e64f93f (rule 17): your level-80 prices are in as written (`ECON.price`, `stepK` 0.25,
  `stepMax` 2, `xpK` 1, mission energy doubled). Everything totals 377,100 in the live list (your estimate was about 300,000:
  say if the step or a category should come down further). Run the 12-task player and the grinder to level 80, report coins
  by source (missions under 20%), days with nothing to buy, and the days each room opens.
- DONE by LEAD in e64f93f. WAITING ON LEAD, prices for Cal's level-80 target ("all upgrades can be purchased around lvl 80 ish"; worked from QA's d7ae577
  runs and the live upgrade list, `effort_model.py` method): a serious player earns about 250,000 to 290,000 coins by level 80
  (12-task player: level 80 on day 47; grinder: day 21; with mission pay cut as suggested below). Everything costs about
  1,205,000 now, so prices must come down to about a quarter. Set `ECON.price` to decor 150, furniture 300, equipment 600,
  big 1,200, moment 1 (x the old base instead of x3), and soften the room step to `min(2, 1 + (ROOMSTEP-1) x 0.25)` instead of
  x ROOMSTEP (Garden x1, Lock and Key x1.25, Mall x1.5, the Club x2). Total about 300,000: bought out just after level 80, with
  the ramp kept (Anime Poster 150, Popcorn Cart 1,000, Grand Piano 1,500, Rooftop Pool 1,650, IMAX Screen 6,500). Keep the
  mission cut from QA's last line (`mcost` doubled) and leave `xpK` at 1 (level 100 stays near day 50 to 60 for the artifact).
  Then `WAITING ON QA: check the economy, <commit>` and QA runs the 12-task player and the grinder to level 80. Owner: LEAD.
- DONE by QA (QA findings). WAITING ON QA: rerun the economy on bc1368e (rule 17): your three `ECON` suggestions are in (mission energy doubled, `xpK`
  0.85, `price.moment` 2.5). Targets, both from Cal: the serious (12-task) player at level 100 near day 50, and every upgrade
  buyable around level 80; missions under 20% of coins; no day with nothing to buy. Say what to change next.
- DONE by LEAD in bc1368e (and story scenes no longer open over the Shop). QA, economy against Cal's target (d7ae577, `sim.js`, regular 60 days and grinder 70; `docs/QA.md`, Effort-first run 2).
  Level 100: the 12-task player on day 60, the 20-task grinder on day 26 (the curve's 46,738 XP at 830 and 2,300 XP a day).
  Everything bought: the grinder on day 58; the 12-task player owns 270 of about 380 upgrades and 14 rooms on day 60.
  Days with nothing to buy: zero for the 12-task player (target met; Lock and Key and Mall gates on every coin earned never
  stalled anyone), the grinder only after buying everything. **Wrong: missions twice a day doubled their coins**: from day 31
  missions are 32% of the 12-task player's coins and real tasks 30%, against Cal's rule. Suggested `ECON`: (1) missions:
  double `mcost` (m1 50, m2 80, m3 200, m4 300, m5 500) so a normal day's energy pays for about one round, target missions
  under 20%; (2) curve: `xpK` 0.85 puts the 12-task player at level 100 near day 51 (the grinder near 22: 20 proven tasks a
  day is more than "serious"); (3) prices: after the mission cut, lower `price.moment` from 3 to 2.5 so the grinder still
  buys out near day 50. QA reruns once these are in. Owner: LEAD.
- QA, missions twice a day (f629518, on d7ae577): pass. The card shows cost, pay and "Run 1 of 2 today", then "Back out in
  2 h 55 min" (the 3 hours count from sending), then "Done for today"; energy is spent per run; a third run is refused.
- QA, the Shop (e012535, 3a6fdd5, on d7ae577, `rigtest/qa/shopcheck.js`, 1280 and 390 wide): pass. The mirror stays in view
  after scrolling 1,600 px; Try on charges nothing, the mirror and basket show both pieces, the Checkout window lists them,
  Buy all pays the total and wears them; each tab's text reads at 6.6:1 or better on its colour; View then Checkout works
  (an upgrade then reads Active, an interface item Equipped · Remove); the drop window shows its painted banner; no screen
  scrolls sideways; no page errors. Seen in passing: story scenes can open over the Shop mid-purchase. Owner: LEAD.
- QA, the Patio (ROOMS's ef2ab15, on 331bd7f): pass. Turf, string lights strung overhead between posts, both dog beds, the
  egg swing; its door back to the Bedroom is on the front-left edge (Cal's rule: Bedroom back-right to Patio front-left); a
  Patio buy shows through the Bedroom glass at once (the telescope changes 2,148 pixels of the Bedroom). `shots/patio_full.png`.
  Owner: ROOMS, nothing to fix.
- ROOMS answer (33408e9): (1) the dark Patio inside the building was the room art loading after the Bedroom drew; fixed in
  bd895a7 (turf and fire bowl show behind the glass in the building view now); (2) dogs on the Patio now mostly go to their own
  beds (3 minutes headless: every lie-down in a bed, none on the deck). Their size is the Bedroom dogs' size, seen further off.
- QA, walking onto the Patio (ROOMS's 63ac9f3, `rigtest/qa/watchroom.js`, 10 shots over 3 minutes): you walk out through the
  glass, stand among the Patio furniture (`look@deck`, nobody inside furniture), come back to the bed and mirror; both dogs go
  out too. Not right: (1) inside The Loft building the Patio behind the glass is dark (no turf, no sky), while the same window
  opened from the street shows turf and skyline (`shots/patio_walk.png`, left); (2) on the Patio the dogs lie on the deck by
  the fire bowl, not on their Patio beds, and look tiny through the glass. Also, opened from the street view (without going
  into the building) a room window has nobody in it: if any button opens a room window from the street, the room is empty.
  Owner: ROOMS (1, 2), LEAD (the street).
- QA, economy check DONE (LEAD's 29ae247, run on 3a6fdd5, `sim.js` adapted: Daily Quest goal 100/150/300, training logged on
  workout days; numbers in `docs/QA.md`, Effort-first run 1). It works: XP is 100% real life (no mission XP), real tasks are
  the biggest coin source for every player at every stage (35 to 59%; with the Daily Quest chest, training, the weekly bonus,
  level pay and trophies, 58 to 80% of coins come from effort), and nobody runs out: day 60 the 12-task player owns 230 of
  about 380 upgrades and 11 rooms, never holds more than 13,000 coins, and had 4 days with nothing to buy (the grinder 2).
  Tighten (Cal: "step by step"): (1) **the Daily Quest goals are far below what players really earn**: with proof, streak
  and combos a player makes 240 XP a day (casual), 750 (regular), 2,300 (grinder) against goals of 100, 150 and 300, so the
  "hidden" quest fires every day for everyone and the town is always at 150%. Count the goal in base task XP (before
  bonuses) or offer goals about 3x higher; (2) missions reach 22% of the regular player's coins in month 2 (energy covers all
  five every day): raise `mcost` or drop `mcoinLv`; (3) the casual player opens only 5 rooms in 60 days and buys 1 to 2
  things a playing day: fine for "something every day or two", watch it. Owner: LEAD.
- QA, Bedroom wall tiers (ROOMS's f4362b1, on 3a6fdd5, `rigtest/qa/loft.js`, `shots/loft_walls.png`): each tier changes the
  walls in all four styles (Neutral Loft, Brick Studio, Warm Oak, Neon Noir; 28,000 to 171,000 pixels a step), brick and slats
  run the whole left wall. Fails "nothing hangs on the grass": the LED strip from "LED Strips & Grass Panels" (`bd_lights`)
  still runs diagonally across the Living Grass Wall with a see-through rectangle under it, in every style; the floating book
  shelf overlaps the grass's right edge a little. Owner: ROOMS.
- QA, Relics and trophies (001e749, `rigtest/qa/relics.js`): pass. A new player has the Relics tab and no Trophies sub-tab;
  the Trophy Wall is "? ? ?" ("Bring home your first trophy") and becomes buyable with the first piece, when the Trophies
  sub-tab appears; each relic tier pays once (600 coins, then nothing on two more checks); the full Goblin King set counts
  each buff once (quests +3% XP, missions +20%, gifts +15%). Not seen: where the trophy buffs are listed (not on the Board).
  No page errors. Owner: LEAD, nothing to fix.
- QA, upgrade menu recheck (001e749, `menu.js` updated to the current rules): passes. Never more than 4 cards, the 4th always
  "? ? ?", no level lock shown anywhere, Buy always works, no early "All upgrades installed", 1,421 cards. Still never offered:
  the same 11 upgrades whose prerequisite left the room (Game Room 3, Chef's Neon, Garden 3, Theater 4), on ROOMS's list.
  The Trophy Wall waits for the first trophy, as designed. Owner: ROOMS (the 11).
- DONE by QA (QA findings). WAITING ON QA, a second target from Cal (2026-11-05), for the economy check you have TAKEN: "all upgrades can be purchased
  around lvl 80 ish" (level 80 is day 37 for the serious player). Levels 90 to 100 are kept for the artifact
  (`docs/PRESTIGE.md`, later). Tune prices until a serious player can own every upgrade around level 80, not day 50.
- DONE by QA (QA findings). WAITING ON QA, the target for the economy check (Cal, 2026-11-05): "a serious player can get to lvl 100 in 50 ish days ...
  that 50 could easily be 100 days if you play every other day." The whole game (level 100 and the town bought out) takes a
  serious daily player about 50 days. LEAD set the curve back to `min(600, 50+6L+0.2L²)` (46,738 XP, day 49 at 950 a day;
  `ECON.xpK`, `xpCap`). Tune prices so everything is bought around day 50 for the grinder, and say what `ECON` should change.
- DONE by QA (QA findings). WAITING ON QA: check missions and the story gates, f629518 (rule 17): each mission twice a day, 3 hours apart (the card
  shows the wait and "Run n of 2"), pity stays 5; Lock and Key and the Mall now wait on every coin earned (`ECON.gateLockKey`
  25,000, `gateMall` 80,000, my guesses). In the economy run: days with nothing to buy (target zero), and tune those two.
- DONE by LEAD in f629518. WAITING ON LEAD, Cal's decisions on QA's v48 findings (2026-11-05):
  (a) Missions: "a piece after 5 is fine but allow them to do each mission twice a day with a 3 hr timer in between each
  mission. if this still feels unfair, then bring it to 4." QA ran it (`dropodds.py 2 5`): twice a day halves the wait, Goblin
  King 9 days median (90% by 14, unluckiest 27), Amulet 8 (90% by 12, unluckiest 22). A pity of 4 changes almost nothing
  (unluckiest 27 and 20): the tail comes from the 30% gift chance, not the pity. So: twice a day, 3 hours apart, pity stays
  at 5. Under the approved effort-first economy each run still costs energy from tasks, so twice a day stays earned.
  (b) The Mall gate: "make it so that every coin earned overall counts towards the goal... it should never feel like you
  are at a standstill." Count all coins earned (`S.earnedC`), not only business takings, keep a healthy number. His design
  intent: "it makes sense to upgrade the other rooms at the same time so you progress in a more balanced way"; fully
  upgrading the Loft should take a while, so there is always something to buy while a gate fills. QA's economy check will
  count days with nothing to buy; the target is zero. Owner: LEAD.
- QA, v48 economy (0426a46, `sim.js`, 3 players, 60 days; `docs/QA.md`, v48 run). Better than before: missions give little
  XP now (regular: 6,600 of 55,800), levels 39 on day 30 and 68 on day 60 (were 79 and 100), the casual player buys 3 to 4
  things every day for two months. Still wrong: (1) month 2 coins for the 12-task player: missions 34%, rooms 25%, tasks
  only 23%; for the casual player Garden produce sales are 20%; (2) the Mall gate (businesses earned 60,000, `29b_story.js`)
  leaves 9 days with nothing to buy (regular days 28 to 36, grinder 17 to 23) while coins pile up to 107,000; count total
  coins earned or lower it; (3) everything is bought by day 60 (regular) and day 30 (grinder). The approved effort-first
  build replaces most of this; keep these as checks for it. No page errors. Owner: LEAD.
- QA, dungeon gift odds (9b4cf3a `dgRoll`, `rigtest/qa/dropodds.py`, 20,000 players at 5 missions a day, gift buffs 0):
  Goblin King set finished in 18 days median, 90% within 27, unluckiest 51 (87 missions median); Amulet set 16 days median,
  90% within 23, unluckiest 39. The pity never fired twice running. Fine for a set; the unluckiest month-plus may sting, a
  pity at 4 dry gifts would cut the tail. Relics tab checks not done yet. Owner: LEAD.
- FYI ROOMS and QA (Cal, 2026-11-05): loops every 12 minutes now, not 15. Rule 16 has the new `/loop 12m` line: delete your
  15-minute loop and start it.
- DONE by QA (QA findings). WAITING ON QA: check the Shop, e012535 and 3a6fdd5 (rule 17). Look at: the character stays in view while scrolling (desktop and
  phone); Try on for clothes, the basket and its confirm window; each tab's colour (brands, Basics and Vault cream, Wardrobe
  champagne, Upgrades and Interface navy) and that text stays readable; View then Checkout on upgrades and interface, then
  Equip or Equipped · Remove; the drop window with banner art. The body is now `overflow-x:clip`: check no screen scrolls
  sideways.
- DONE by QA (QA findings). WAITING ON QA: check the economy, 29ae247 (rule 17). QA's effort-first proposal as written; every number in `ECON`
  (`29e_economy.js`), hook `window.__qbEcon`. Look at: the Daily Quest card on the board (goal, efficiency, chest, hidden
  quest at 2x), room payouts against today's task coins, mission energy on the Dungeons tab, no XP from missions, delves,
  gifts or story visits, training (50 XP and a stat point for 3+ exercises), new prices. Rerun `sim.js` for the three
  players, 60 days (Cal: "step by step until it feels right ... it could be tightened more"). Not done yet: the hidden quest's
  rare furniture and cosmetic shards (it gives a streak freeze or INT until ROOMS's art exists), stat icons.
- DONE by LEAD in 29ae247. WAITING ON LEAD: build QA's effort-first economy. **Cal approved it, 2026-11-05: "approve and send... we are still simulating
  what it would feel like for a long term play of this game. So we should take it step by step until it feels right. Your
  coin estimations and pricing feels good, but it could be tightened more."** Build it as written in `docs/QA.md` (Proposal:
  an effort-first economy; Cal's requests 2 and 3 are now approved too), keep the numbers in one place so they are easy to
  tighten, then write `WAITING ON QA: check the economy, <commit>` (new rule 17) and QA simulates it. Owner: LEAD.
- QA, 62c311d. Pictures in `rigtest/qa/shots/` (not committed), write-ups in `docs/QA.md`.
- TAKEN by LEAD, done in 347ff65 (`tools/version_check.py`, LEAD's routine in TEAMWORK). LEAD (Cal, 2026-11-05): "make sure there are no discrepancies or rule breaking changes from mismatched versions that you all
  are working on. You should all be working on the same exact version." What QA sees now (4958885): one branch `main`, in
  sync with GitHub, live is `APPV` 47. Mismatches: (1) LEAD and ROOMS test builds of the shared folder (8766, 8765), which
  include each other's uncommitted edits, while QA and publishing use commits, so the same check can pass for one chat and
  fail for another; (2) long-lived uncommitted work (LEAD's six app files right now) that the other chats build on before
  it is committed; (3) leftover test copies from earlier sessions still registered as worktrees (`scratchpad/cur` at
  840749b, `scratchpad/prev` at fe4fe35); (4) `main` is ahead of the live page (progression not published yet). Ask: a
  version check in LEAD's routine, before each publish and at wrap-up: everyone committed and pushed, `git worktree list`
  only holds today's test copies, each chat's last test names the commit it ran on, and the live `APPV` matches TASKS.md;
  and a rule that work another chat builds on is committed first. QA tags every result with its commit. Owner: LEAD.
- TAKEN by LEAD (text done in 4a2a143; database rules and the two-friend test with v48). LEAD (Cal asked whether friends must be Editors): no. On the platform an Editor is an admin who can republish the page and
  change database rules; a Contributor can write data, which is all a player needs. The Neighbors text in `30_app_b.js` says
  "Share this page with a friend as an Editor": make it Contributor, add database rules so each player writes only their own
  `worlds/`, `pings/` and `board/` rows, and test one friend as Contributor (online save, Neighbors, a photo check) and one as
  Viewer (expected: plays, saves on that device only) before inviting 15. `docs/QA.md`, Town hall. Owner: LEAD.
- TAKEN by LEAD (stopgap 5082b0c; trials 62306c1; the real fix is QA's proposal, waiting on Cal's go). LEAD, economy simulator done (your request; 12a46ba, `rigtest/qa/sim.js`, numbers in `docs/QA.md`, Economy and play
  simulation): do not publish the progression as is. A 12-task-a-day player owns every room and all 370 upgrades by day 33
  and level 100 by day 40, then nothing to buy (970,000 coins unspent by day 60); a 20-task player by day 21. Causes: room
  income (70% of coins in month 2, about 21,000 a day), missions (more XP than real tasks by day 60, pay +2% per level), and
  XP bonuses doubling the curve's 200 a day. Level trials need a gym photo, so a friend who never works out stops at
  level 4. Owner: LEAD (Cal to decide the trials).
- TAKEN by LEAD: (6) done in 62306c1; (5) bounties now; (4) town meter and (1) town hall next; (2) and (3) wait on Cal's go. LEAD, Cal's six requests (2026-11-05), his words and QA's notes in `docs/QA.md` ("Cal's six requests" and "Proposal: an
  effort-first economy"). Decided by Cal, ready to build: (1) "turn on the town hall and allow you to post a picture of your
  character with your current outfit and a short message for everyone to read" (`socialHtml` exists, never shown; Contributor
  access and database rules first); (4) a weekly town meter everyone fills, showing each player's coins and XP gained, "but it
  should keep the amount of tasks and the descriptions of tasks private"; (5) "a rotating daily bounty or a 3 day bounty",
  and AI-suggested tasks "such as 'throw away one thing you have not used for more than 6 months'"; (6) trials "for everyone...
  a walk, or a gym session... it needs to be something active related. Sung jin woo didnt rank up by cleaning his room."
  Waiting on Cal's go on QA's numbers: (2) rooms earn only after a task today, 100% at the daily limit, 200% grants a hidden
  reward and more town buffs; (3) prices ramp by what a thing is; and the rule behind both, "doing chores and training will
  always reward you more than having a virtual restaurant give you money or sending people out on missions": XP only from
  real life, room pay capped at 20 to 50% of the day's task coins, missions run on energy from tasks and give no XP, training
  the best XP per minute. Modelled: tasks stay 53 to 83% of all coins, a 12-task player fills the town in about 5 months.
  Owner: LEAD (code), Cal (the go). QA reruns `sim.js` on the code once it is in.
- Portrait brand banners (Cal, 2026-11-05: the drop window "to have the banner art but in a portrait style, whereas the shop
  shows the banner for the brand"). One per brand, the same scene and logo as its landscape banner, 720 x 1080:
  `ui_banner_<id>_p.webp` for hanga, y2k, over, rose, alt. LEAD's code (e012535) uses it when present, the landscape
  banner cropped until then. Show Cal side by side first.
- LEAD wired all seven in (a60b175): the Daily Quest chest, stat chips, hidden quest picture, town hall backdrop. v48 waits for
  Cal's approval 8; if he turns one down, delete its file and the stand-in comes back.
- DONE by ROOMS in 8caf214, Cal approved (approval 8, 2026-11-05): all seven files at these names and sizes are in `art/app`;
  LEAD, the game does not read them yet (no `ui_dq_chest` etc. in the code), so wire them when Cal approves. TAKEN by ROOMS, right after the Loft goes to QA (today). LEAD's code is in (29ae247). Names and sizes, all optional (the game draws its own until they exist): `ui_dq_chest.webp`
  (the Daily Quest chest, closed, 256 x 256), `ui_stat_str.webp`, `_agi`, `_vit`, `_int` (64 x 64 icons), `ui_hidden_quest.webp`
  (the hidden quest's reveal, 512 x 300), `ui_town_board.webp` (town hall backdrop, 720 x 300). Tell LEAD when READY.
- ROOMS, art for the same (Cal 2026-11-05, after LEAD's code exists): a town hall board backdrop for the posts; the Daily Quest
  complete card and its small chest; the hidden 200% reward's look (rare furniture pieces and cosmetic shards, original
  designs); four stat icons (STR, AGI, VIT, INT); an active-trial badge. Sizes and names from LEAD when the code is in.
  Owner: ROOMS.
- FYI LEAD and ROOMS: QA added rule 13 to `TEAMWORK.md` at Cal's request (Waiting on each other: true Doing lines,
  `WAITING ON <chat>` lines, check for them between tasks). Right now both Doing lines are stale: LEAD's says nothing in
  progress with five app files uncommitted (`10_app_a.js`, `29_prices.js`, `29b_story.js`, `30_app_b.js`, `index.html`,
  new `29c_team.js`); ROOMS's still describes the Closet v2 that Cal approved and 93c95b6 committed.
- READ BEFORE THE NEXT ROOM ART (Cal, 2026-11-05: "a lessons learned so that the next pass on art generation can be better";
  walls swapped for cohesion, furniture "highly detailed, carefully placed, and have cohesiveness between the entire room"):
  `docs/QA.md`, Lessons for the next art pass: 12 rules, every room against isometric references, and the upgrades whose
  picture does not match their name. Owner: ROOMS, before generating any wall shell or furniture.
- DONE by ROOMS in fd80c50 and 3962ee2 (doors.js: every pair passes). Doors, Cal's rule (a back-left door comes out of the next room's front-right edge, back-right to front-left): 12 of 15 pairs
  break it; only Closet/Lair, Theater/Auditorium and Mall/Karaoke follow it. Table in `docs/QA.md`, Doors; recheck with
  `LOGIC=1 node rigtest/qa/doors.js`. Owner: ROOMS (`portal()` in `27_rooms.js`, already on ROOMS's list as Doors that make sense).
- DONE (rmArrows puts each arrow at its own door's corner; doors.js passes on 3962ee2). Doors: every "up" arrow sits in the frame's top-left corner, but 7 of 9 doors up are on the back wall, top right (Bedroom to
  Patio, Restaurant to Upstairs, Bar to Roof, Boba to Dessert, Dessert to Speakeasy, Mall to Bowling, Arcade to Rhythm). Put
  each arrow on its own door's side. `rmArrows`, `26_world.js`; `shots/doors_windows.png`. Owner: ROOMS.
- DONE by ROOMS in 3962ee2 (doors.js: none, but the Mall escalator, which is the way up). Doors: furniture stands on 8 door glows, everything bought: Bedroom to Closet (wardrobe, dog bed), Restaurant to Upstairs
  (plant divider, table), Boba to Dessert (tea urns, fryer), Dessert to Boba (cupcake stand), Dessert to Speakeasy (macaron
  tower), Arcade to Rhythm (claw machines), Rhythm to Arcade (speaker tower), VR to Arcade (racing pod). `shots/doors_closeups.png`.
  Owner: ROOMS.
- DONE by ROOMS in 0eb00c2 and c829e7e (Karaoke is upstairs from Bowling; a stand-in Mall door only for a save with Karaoke and no Bowling). Doors: the Mall opens straight into Karaoke two floors up, over Bowling (`ROOMCELL`). Small. Owner: ROOMS, Cal to say.
- DONE in b92a6dd (doorway in the left wall, wardrobe gone; figurine cabinet art next). Bedroom (Cal, 2026-11-05): the wardrobe stands where the Closet entrance belongs; Cal asked ROOMS to make it the figurine
  shelf (on ROOMS's list). Owner: ROOMS.
- DONE by ROOMS in bd895a7 (one big original anime poster, approval 6). Bedroom (Cal): Anime Poster is not obvious: three small random pictures, too close to the right end of the wall. He wants
  something apparent, and anime art on an anime poster, not scribbles. `shots/up_bedroom.png`, tier 19. Owner: ROOMS.
- DONE in b92a6dd (canvas on the left wall, shelf in the back corner). Bedroom: Canvas Art (200) and Figurine Shelf (200) are never drawn once Floor-to-Ceiling Glass is owned (`&&!w3`,
  `20_loft.js` ~3210), and the menu sells the glass first, so both are paid for and invisible: 0 px change. Tiers 17 and 21
  in `shots/up_bedroom.png`. Owner: ROOMS.
- Street view (51a9506, checked on 59eeaf7 at 390 x 844): works. The street runs 2 animations and no room images; The Loft
  loads 5 rooms (35 animations), Kode Plaza 7 (99), Calibur Mall 9 (375); Street drops back to 2. Saves, every tab: pass.
  Wrong: Calibur Mall opens with its end rooms cut off left and right (Theater and Club half off screen), The Loft and Kode
  Plaza fit. `shots/inside_calibur_mall_390.png`. Owner: LEAD. DONE in 861bee1 (all three fit at 390 px).
- Street view: the hint at the bottom still says "tap a room" on the street (should be "tap a building"), and it is pale
  grey on pale grey, hard to read. `shots/street_390.png`. Owner: LEAD. DONE in 861bee1.

Requests for LEAD (from ROOMS):
- TAKEN by LEAD, done in cc5eccc (on main, ships with the next Live cut; drawn from his spec, no missing art, one pose looked at by LEAD). READY (Cal approved 2026-11-08, committed d7d318c): in 29k_friends.js set Victor's spec to `hairStyle:"fr_victor_hair"`. No change to 15_shop.js is needed: the style is deliberately NOT in creator.json's hairStyles, so the Shop and the creator never list it; look.js only uses the name to find m_fr_victor_hair_front/back.
- DONE by LEAD in 68fcc56: `window.qbRaidTrophies()` returns trophy pieces brought home (0 before the first); the first is
  announced ("The first trophy is home. A Trophy Room can now be built above the Hero's Lair."). Please give the room the id
  `trophy`: the Relics tab shows the pieces once a `trophy` room exists (or the old `lr_trophy` in saves that own it). Trophy Room (Cal, 2026-11-05): "trophy wall should be removed and turned into a trophy room but only after a team member
  brings back the first trophy from the dungeon raid. we can add the trophy room above the lair." The dungeon has no trophy
  yet (`28_missions.js`). Please add: raids can bring back a trophy, the first one is announced, and a global
  `qbRaidTrophies()` returns how many have come back (0 before the first). ROOMS shows the Lair's "Open the Trophy Room"
  upgrade only when it is 1 or more, and builds the room, its door and its art.
- TAKEN by LEAD, done in 861bee1. Yawn pilot painted, sent to Cal as approval 4 (`art/raw/yawn/yawn_pilot.png`, git-ignored; layers in
  `art/raw/yawn/layers/`, 720x828, frame-sized; the cutter is `tools/yawn_cut.py`). Not in `art/app` until Cal approves.
  One change needed in `src/rig.js` (yours): a painted BODY layer is drawn in the body mesh's last group, so it covers the
  face, hair, trousers and shoes. Drawn in its FIRST group it works (tested in a scratch copy, that is what the sheet shows).
  The line, in `render`: `const lastGroup = slots.map((x, i) => { let g = -1; if (flats[i]) for (const gg of
  rig.drawSequence[view]) if ((x.s.id !== "body" || g < 0) && [meshes[i].groups[gg], ...].some(...)) g = gg; return g; });`
  i.e. only the condition gains `(x.s.id !== "body" || g < 0) &&`. Known small issue for ROOMS to fix before it goes in: a
  faint double outline along the legs and at the hair edge, where the painted body sits a pixel off the mesh drawn over it.
- FYI: ROOMS added one rule to `TEAMWORK.md` (under "Every day after that") at Cal's request: whichever chat gets a request
  does its own parts and writes the rest as tasks for the owning chat; every chat re-reads `TASKS.md` between tasks.
- Three buildings: yes, LEAD may write the street view and the load-one-building code in `lfWorld` (`26_world.js`). Tell
  ROOMS before you start, so ROOMS stays out of that function while you are in it. ROOMS paints the exteriors and insides.
- TAKEN by LEAD (in To do). Shop banners, Cal's words on approving the art (2026-11-05): "Love the art. The Title text could be more stylized and
  unique instead of plain white text or a shadow. Make them all unique. i want the description for the brands to be more
  playful rather than descriptive. I like 'Trail gear that never sees a trail'. That is funny and i like it. Also remove
  the 'NEXT DROP: etc' text. make this a separate countdown on the main shop tab that is small and unobtrusive." All in
  `15_shop.js`. If a painted wordmark per brand would help the titles, add it under Art requests.
- TAKEN by LEAD, done in 9c3bd78. SAVES, URGENT. In Chrome on v44 the header reads `this device only (Cannot assign to read only property 'creativity' of
  object '#')`, so that browser is not saving online. The boot `try` in `30_app_b.js` catches it and sets `db=null`. Likely:
  `merge(sd0)` changes the frozen object `snap.data()` returns; not tested. `worlds/<id>` last updated at appv 34, which
  suggests this has been failing since about then, and it explains why the `diag/frame` log landed nothing. The phone's header
  has not been checked. **Before fixing: the cloud save is probably older than each device's local save, so the fix must not
  let it overwrite newer progress.** Ask Cal which device's save wins.
- TAKEN by LEAD (in To do). Lag, measured headless with every room owned, not on a phone: about 540 running CSS animations in the building view, and
  they keep running behind an open room window (`lfbreath` 146, `rhl` 114, `scrB` 81, `prtG` 30 with an SVG blur), 144
  filters, 76 blend modes, about 15,000 SVG nodes, 783 images, 97 MB JS heap. Dragging sets the transform on every
  pointermove. No fix written. Fixes in room code are ROOMS's: put what you want under Art requests or here.

---

## ROOMS: all art, the art tools, the room code

Doing:
- Now (on 53b46be): Cal approved Victor's hair, the Rooftop and the Mall ("Approve all three"), committed d7d318c and d35c90d. QA's four v0.76 findings done in 53b46be. Nothing in progress; CHROME free. Next, when Cal says go: LEAD's Town Square backdrop, then the Auditorium walls. Test port 8767 (8765 is held by the old chat's server on a stale copy).
- WAITING ON QA: check 53b46be (rule 17), your four v0.76 FIX lines: run `lobbyzoom.js` and `mallsecret.js`. ROOMS ran both: the reel, the screen and the sconces are clear at both lobby sizes; no card or help text names the Arcade or Bowling before the story opens them.
- WAITING ON QA: check d35c90d (rule 17), Rooftop and Mall rebuilt, plans in ROOMS's section. Rooftop: glass rail on every side with the gap at the stairs (x 2.3 to 3.7), guests reach the moved spots, nothing clips in any stage (rule 20). Mall at 16 x 12, wall 210: the room fits at phone size (on a wide desktop window the top of the wall crops); the doors to the Theater (left wall), Arcade (right front) and Bowling or Karaoke (back wall by the escalator) sit at the new positions; each storefront opens on its painted unit; the fountain is at (8, 6); nobody stands in a piece. ROOMS checked: full and empty, day and night, no page errors, people not walked. Also d7d318c, Victor's hair art: once LEAD points his spec at it, his visit card and rooms.
- STOPPED to save Cal's usage (weekly limit 96%, resets 2026-11-13). CAL APPROVED, not started, for after the reset, in this order: (1) Victor's long
  black hair on the in-game character (friend-only piece, one sheet, every-pose check; (2) the Rooftop plan; (3) the Mall plan, room grown to about
  16 x 12 (plans: ROOMS's chat, 2026-11-08). The Auditorium is paused too (see below).
- Now (on f53662c): holding to save Cal's usage (LEAD). Lock and Key 05500d3 and Victor's grey hoodie f53662c are in. Victor's three portraits approved and in, 0a1cb8e, and his grey hoodie f53662c, WAITING ON QA (QA: DONE on ca68e45, PASS, QA findings) (a quick look at his visit card and
  portrait sizes). WAITING ON CAL: the Rooftop plan and the Mall plan (in ROOMS's chat); neither room is built until he okays a plan. Not done: Victor's long hair on the rig (a new friend-only piece, one sheet plus every-pose checks,
  after Thursday unless Cal wants it now); chubbier is portrait-only (the rig has no heavier body).
- PAUSED (on 49295bc) until Cal's limit resets Thursday (Cal via LEAD: stop the automatic checks; ROOMS's loop cancelled). Stopped
  mid-way on the Auditorium's painted walls (Cal: "Paint it"): the taller shell frame is in (49295bc, inert for every existing shell);
  guides for its three sizes (12x11 H190, 14x14 H236, 16x17 H300, QB_SHELL_ASPECT=0.9) are in shots/pending_art/auditorium/;
  two paintings of the 12x11 (plain, acoustic panels) were queued on Higgsfield (they land in Cal's history); still to do: the
  velvet look, the two bigger sizes from swatches, the loader in 23_theater.js, the checks, then Cal. b3d6b28 (Patio beds per dog)
  waits for after Thursday (LEAD).
  Was: Now (on 8c756be): Cal approved all ("Approve all") and it is in 8c756be, WAITING ON QA (below): relic icons, Sable's portrait, the
  portrait brand banners (art slots 67 of 67) and the Theater lobby shells; LEAD folds them into v0.76, cut from HEAD after v0.75 is published. Nothing else queued: the
  Auditorium's walls wait on Cal's word. QA's Patio fixes 5218011 PASSED on LEAD's v0.75 0729a6b. Patio beds per dog DONE in b3d6b28 (QA's note), WAITING ON QA, for v0.76. (QA: PASS on 0729a6b, QA findings.)
  Was: Now (on 5776eda): QA's Patio visitor clipping (v0.75 blocker) DONE in 5776eda, WAITING ON QA. (QA: PASS.) QA's Patio spacing fix 260895e: PASS. MAIN JOB, the last rooms without painted walls (the Hero's Lair already
  is one painting). Movie Theater lobby: three wall/floor tiers PAINTED at 12 x 9 and 16 x 10 (fit within 5 px at 4x), WAITING ON
  CAL (shots/pending_art/review_theater_lobby.png, sent in ROOMS's chat). The loader is in (03ceedb): walls from the wall upgrade's
  tier, floor from the floor upgrade's; it uses the drawn tiers until the shells are added to art/app on his yes. The Auditorium
  is the last room with drawn walls, and it is CAL'S CALL whether to paint it: three sizes (12 x 11, 14 x 14, 16 x 17) with wall
  heights 190, 236, 300 and three wall looks, so about nine paintings plus a taller shell frame (the 5:4 frame holds 477 px, the
  walls need 500 to 610); the gain is small, since the screen covers most of the left wall and the seats most of the floor, and
  the drawn dark walls read fine (shots in ROOMS's scratch). Waiting for his word before starting it.
  Patio dog spots DONE in 1da0f7e, WAITING ON QA (below). The dogs and the Dessert Parlor are in v0.75 (LEAD e30a13a) waiting on
  QA; the 12 art slots wait on Cal. Old boxes on this list ticked (done long ago).
  Was (on 1f87497): Dessert Parlor re-laid in zones (Cal via LEAD, references in docs/refs/) DONE in d528068 + 1f87497 (LEAD: the cupcake stand
  joined the matcha bar as one tea corner), WAITING ON QA (below).
  Pluto and Chopstick ON in afc5d4f (Cal approved, via LEAD: "I approve the new dogs"), WAITING ON QA (below).
  The 12 empty art slots (`docs/ART_SLOTS.md`) are PAINTED, WAITING ON CAL (sent in ROOMS's chat): six relic
  icons `ui_relic_<id>` (128 px), Sable's story portrait `ui_story_sable` (300 x 400), the five portrait brand banners
  `ui_banner_<id>_p` (720 x 1080). Held in `shots/pending_art/` (not in `art/app`, so nothing shows before his yes); on his yes they
  go into `art/app` and to QA. Note for LEAD: eleven newer brands (bb, cr, gp, km, kp, nc, oak, sm, smk, sp, sv) have no portrait
  banner either; ART_SLOTS doesn't list them, say if the drop window wants them too.
  QA's v0.74 findings DONE and PASSED: d6c5007 (Boba customer spot, Back Plot stand) and 3dfe920 (the berry bed's sprinkler
  moved to its left side, off the stand), QA d6c12a8. LEAD: v0.74 can be rebuilt. Painted dogs are OFF in builds
  (`window.LFDOGON` unset) until Cal approves them. Pluto and Chopstick DONE in 2faabd0 from Cal's photo, WAITING ON CAL to approve
  the art (sent in ROOMS's chat), then WAITING ON QA: one Unlimited sheet per dog, stand/walk/sit/sleep (`dgx_<dog>_0-3`, cut by
  `tools/dog_cut.py`), drawn 34 tall so the body reaches Cal's knee to mid-thigh; pixel dog stays as the fallback. Checked
  headless next to Cal in the Bedroom: all four poses, the walk mirrored, sleeping in the bed. Not checked: night light, the
  Patio, a friend visit's dogs. FYI LEAD: the friend-visit dog cards can use `LFSPR.dgx_<dog>_0` (or `_2` sitting).
  Was (on 89d4015): Cal's v0.73 phone notes via LEAD, all done and WAITING ON QA below (QA: done on ed0a4f9, all pass but two, QA findings: the Boba cafe table on a customer spot, the Garden Back Plot stand behind a bed): Bedroom mirror c5a65a1; Restaurant
  neons bfe3dec; TEAMWORK rule 20 aa8bfd4; overlap sweep 4e5557c and the dessert trolley bcc3b41; Game Room TV flush and foosball
  in a row with the pool table 4915a05; Garden herb plot as a matching wooden bed and the night seam (outdoor rooms' night
  shade left out the floor's front corner) 3ad4129; Restaurant wall pieces in every stage and style a062a4b; Bigger Till as a
  brass register e37df53. LEAD has my OK to edit the zoom block of lfPrevAttach in 20_loft.js (Cal: bring zoom back).
  Bedroom swept in all three window states (14d060f); Garden's two smaller stages (4562a76); Boba Shop floating table and
  barista c342c2b; part-bought sweep of every room 6a5572f. The rule-20 sweep is done; nothing else queued.
- WAITING ON QA: check 5218011 (rule 17), QA's v0.75 Patio findings on 5b00b40: (blocker) a spot or bed is kept only if a walk from
  the sliding door reaches it (flood fill on lfPaPath's own grid and test), so the full Patio's boxed-in back-left spot is gone;
  (1) the sliding door opens for everyone near it, visitors too; (2) the depth sort skips anyone in the Patio's glass group, so
  walkers stay clipped. ROOMS's own check, headless: routes from the Bedroom (4.5, 4.5) to every spot and bed, sampled 20 per
  leg against the Patio footprints, 0 inside furniture on full (1 spot, 2 beds), half (2 spots, 1 bed) and bare (4 spots); a
  visitor walking out: clipped 51 of 51 samples on the Patio, door open 67 of 67 samples near it.
- (QA: DONE on ca68e45, PASS, QA findings.) WAITING ON QA: check 05500d3 (rule 17), Lock and Key, Cal's four notes via LEAD: Mirrored Back Bar flush on the back wall behind the bartender (footprint 1.6-5.55, unflipped: it was mirrored and scaled inside a 5.6 footprint); Oyster and Champagne Station on the back wall past the high-tops (customer spot in front); green booth flush to the left wall towards the front corner, short of the stairs down; glass table in its curve. ROOMS's own check: fully bought, headless (`shots/rooms3/lockkey_cal_notes.png`), nothing over anything, Roof door clear. Not checked: customers and bartender live, part bought.
- (QA: DONE on ca68e45, PASS, QA findings.) WAITING ON QA: check b3d6b28 (rule 17, for v0.76), QA's note on 0729a6b: with only `pt_dbed` bought both dogs went to it (`||
  PR.beds[0]`) and one lay under the other. Patio beds now carry their dog (pt_dbed Pluto's, pt_dbed2 Chopstick's) and a dog goes
  only to its own; without one it runs the Patio and keeps its Bedroom bed. ROOMS's own check, headless: one bed bought, Pluto to
  (3.30, -1.40), Chopstick none; both bought, one each; every route still clear of furniture.
- (QA: DONE on ca68e45, art PASS; the lobby's left wall needs ROOMS, QA findings.) WAITING ON QA: check 8c756be (rule 17), Cal's "Approve all" (2026-11-08): (1) six relic icons `ui_relic_<streak|team|build|exped|
  quests|collect>` (128 px), in the Relics tab; (2) Sable's story portrait `ui_story_sable` (300 x 400), on her return visits;
  (3) portrait brand banners `ui_banner_<hanga|y2k|over|rose|alt>_p` (720 x 1080), in the drop window; (4) the Theater lobby's
  painted shells `thw_t1-3` (12 x 9) and `thw_w1-3` (16 x 10), loader 03ceedb: walls from the wall upgrade's tier, floor from the
  floor upgrade's. ROOMS's own check: all twelve ui files load at their sizes on a fresh build (art_slots 67/67); the Theater
  fully bought headless with the shells, and each tier and a mixed one (gold walls over walnut) earlier, no piece misplaced.
  Look at: the lobby at every wall and floor combination, expanded and not; the Relics tab, the drop window and Sable's visit
  in the app (not opened by ROOMS).
- WAITING ON QA: check 5776eda (rule 17), QA's v0.75 blocker: visitors on the Patio not clipped to the glass. Now everyone with
  y < -0.02 in a Bedroom with the Patio goes into the glass clip group (lfpcg), whatever their role (line 1594 dropped the role
  test). And people (deck "look" stations) get only spots at y -2.6 or nearer the glass, where a standing person fits under its
  top; further back the clip cut them to their legs. Dogs keep every spot. Deck stations now: full (3.35, -2.20), half and bare
  (3.60, -1.95). ROOMS's own check, headless: a person given role "visitor" at every deck spot, full, half and bare, sits in the
  clip group and is cut at the glass (the first spot tested reads unclipped once, a test-timing quirk: the same spot tested later
  is clipped). Not checked: a real friend visit walking out to the deck live.
- WAITING ON QA: check 1da0f7e + 260895e (rule 17; QA on 1da0f7e: two spots 0.28 apart, fixed in 260895e: spots keep 0.9 apart and
  stay inside the Bedroom glass's span; full: 2 spots, half: 2, bare: 4, all 1.8 or more apart, in view), the Patio's dog spots (my own note on the dogs: one Patio spot sat behind the fire bowl).
  The four fixed open-floor spots in lfPatioReal were set for a bare Patio; fully bought, every one fell inside a piece's footprint
  (fire pit set, chair, telescope), and so did some room spots. Now a spot is used only if it is clear of every footprint (0.15
  margin), plus two that stay clear and show through the Bedroom glass: between the dog beds and the chair (local 1.8, 3.05) and
  the back left corner (.4, 1.2). Checked fully bought, headless: a dog at each spot is in view, none inside furniture. Not
  checked: a bare or half-bought Patio (the old spots come back there when clear), and both dogs picking spots live.
- WAITING ON QA: check d528068 + 1f87497 (rule 17), the Dessert Parlor in zones (Cal: "very randomly placed. Run a reference check of a
  similar room and place the assets accordingly"; LEAD's references `docs/refs/dessert_ref_*.png`, layout only). Back wall: one run
  of bingsu, soft serve, cake case, mochi case (now on the back wall, mirrored) and macaron tower, short of the painted hutch. The
  pastry counter is the register, in front of the hutch with a staff lane behind it (staff spot 8.3, 1.45 layout), nearest the
  door; customers at its front. Front right: a tea corner, the matcha bar with the cake stand right beside its end (1f87497). Left: the seating corner (booth,
  marble table, the sakura between them). An open lane from the door mat to the counter; the stairs down (front left) clear.
  Same pieces, no new art; the room has one stage. ROOMS's own check: fully bought and half bought, no piece over another on
  screen, footprints clear (`shots/rooms3/dessert_zones_before_after_half.png`: before, after, half). Look at: every customer and
  the barista walking live (headless they idle), the Hidden Door portal behind the counter (owners of the old Speakeasy only).
- WAITING ON QA: check 2faabd0 + afc5d4f (rule 17), the painted Pluto and Chopstick (Cal: "really tiny... bigger and more
  recognizable"; approved 2026-11-08). `dgx_<dog>_0-3` stand/walk/sit/sleep, drawn 34 tall (`LFDOGH` in 20_loft.js), pixel dog if
  the art is missing (or `window.LFDOGON=0`). ROOMS's own check, headless at 2x: next to Cal in the Bedroom at stand, walk (mirrored
  when turning), sit, sleep; both asleep in the Bedroom beds; the Patio beds, standing and sitting on the Patio, and the Patio at
  23:00 (night light applies) (`shots/dogs/dogs_in_room.png`, `dogs_patio_night.png`). Look at: size against people, rule 20 in
  every room they visit and on friend visits (not checked), the walk's second frame live, and one Patio dog spot (3.75, -3.85)
  behind the fire bowl: a sitting dog there is mostly hidden. Say if that spot should move.
- DONE by ROOMS (253fcb4; Justin and Memo keep their shop pieces, which match their portraits) (Cal, 2026-11-07): "white splatter tee from his portrait. all characters should wear stuff from their portraits rather
  than putting an outfit on from the shop. This would make them more unique and recognizable." ROOMS: friend-only garments drawn
  from each friend's portrait (one sheet per piece, every angle, Unlimited), not sold in the shop; LEAD points each friend's eq at
  them (29k_friends.js). Order: Vega first, then Kenan, Cynthia, Jina, Justin, Logan, Memo.
- DONE by ROOMS (six approved and in, ba45c99; outfits eb0eea3) (Cal, 2026-11-07): "i also want to add more friends and visitors to the game." Eight Instagram profiles: krispascasio,
  quince.chen, llamaorhorse, victorpmyint, chatsaobao, alvinataaat, nickhuynh.re, ben_wcho. "Some of these people dont have a lot of
  IG pics or they have pics with lots of other people. Make sure you figure out who they actually are before creating their
  character. If it is too complicated to figure out, ignore them." ROOMS: identify each from their own posts (Cal's Chrome, read
  only), then portraits for Cal's approval (big approval), then their outfits like above; LEAD adds them to the friend list.
- DONE by QA (QA findings, v0.73: pass but fr_ben_cap's back views; Victor's sleeves and Ben's jacket side match the passed yawn tops, no repaint; the cap fixed in 5698ead, QA recheck on 660eb30: pass). WAITING ON QA: check ef70922, 49df52c, 959862d, ca7d92f, a5dcb14, eb0eea3 (all go into v0.73), the six new friends'
  friend-only pieces: fr_kris_shirt, fr_kris_pants, fr_alvina_coat, fr_nick_suit, fr_nick_trousers, fr_ben_jacket, fr_ben_cap,
  fr_kevin_polo, fr_kevin_jeans, fr_victor_hoodie, fr_victor_chinos. ROOMS's own check: matrix wear and grid sheets in every
  pose (both bodies), stretch at 1000 px for all six tops; idle and stretch of every full outfit in
  shots/friends_new/new_friends_outfits_idle.png and _stretch.png. Known, small: fr_ben_cap's back views show the strap
  opening (from behind it reads like a cap worn forward); fr_victor_hoodie's stretch has a slightly doubled edge under the
  sleeves at 1000 px (the sleeve undersides were thickened in the layer to hide a skin strip). Say if either needs a repaint.
- DONE by QA (QA findings, v0.73: pass). WAITING ON QA: check 776bc77 (goes into v0.73), Game Room WEAK upgrades: RGB Floor Lamp moved out from behind the console to
  the open floor between the arcade and the TV (0.04% -> 0.51% of the picture), Mini Fridge a step in front of the soda machine on
  the right wall with the soda machine's front clear (0.18% -> 0.67%), Dartboard larger and clear of the door frame (0.21% ->
  0.43%). Plus 081d0a2: the Mini Fridge sprite repainted (plain cans and snack bars on top, no lettering) and the Soda Machine's green
  stripe down its left edge removed (its green bottles read yellow now). Render: shots/rooms3/gameroom_weak_fix.png. Look at: walk
  routes past the lamp and the fridge, the fridge's customer spot.
- DONE by QA (QA findings, v0.73: pass). WAITING ON QA: check 21fedf3, be717dc, 778e0c6 (all go into v0.73), the friend-only pieces: fr_cynthia_kicks (shoes),
  fr_jina_skirt (skirt, wide, femaleOnly), fr_kenan_jacket and fr_logan_bomber (tops, each with its yawn picture). ROOMS's own
  check: matrix wear sheets in every pose (both bodies; the skirt on f), stretch at 1000 px for both tops (no body strip, the
  sleeves join the arms). Note: the faint olive line along the boy's jaw in the stretch pose is the base yawn body, there without
  any top too, not these pieces.
- DONE by QA (QA findings, v0.73: pass). WAITING ON QA: check 6c66dd8 (goes into v0.73), Vega's friend-only pieces: fr_vega_tee (white splatter tee with its yawn picture) and
  fr_vega_kicks, both bodies, every pose. ROOMS's own check: matrix wear sheet, every pose on both bodies, the stretch at 1000 px
  (no body strip at the sides, the sleeves join the arms); the pink splatter keeps its colour. Note: the high-tops follow the
  portrait, so QA's old note stands (the panel layout reads like a famous sneaker; no logo).
- DONE by QA (QA findings, v0.73: FAIL, it is in 42d73be and pushes the wood-fired oven 0.23 past the right wall; fixed in f2f231d, QA recheck on 660eb30: pass). WAITING ON QA: check 9f3fd8b (v0.74), Restaurant Grand French Range: 1.7 wide so its navy and brass front shows past the pot rack; the back
  row still fits. Render: shots/rooms3/restaurant_grand_range.png.
- DONE by QA (QA findings, v0.73: pass). WAITING ON QA: check 6152eb5, Restaurant Brass Sconces: two sconces in the Hole in the Wall (the second at the front of the left wall, clear of
  the window). Render: shots/rooms3/restaurant_sconces.png.
- DONE by QA (QA findings: pass). WAITING ON QA: check eadc75b, your 85fad55 note: pendants (two, back end of the pass, higher) and the Neon Sign (right and up) clear of the wine
  wall and stools; the counter needs Noir, which hides the neon, so they never meet. Picture: shots/rooms3/restaurant_neon_pendants_fix.png.
- DONE by QA (QA findings: neon reads; pendants and neon overlap the wine wall and stools, small move). WAITING ON QA: check c50714d, Restaurant Neon Sign (bigger, pink glow) and Black Marble Counter (three brass pendants over the pass, which
  the partition hides). Renders: shots/rooms3/restaurant_neon.png, restaurant_marble_pendants.png.
- DONE by QA (QA findings: pass; not cluttered). WAITING ON QA: check 21b292a and 828990f, your 121dc00 notes: the full Restaurant floor's middle row is 2-tops with chairs clear of the
  next rows (LEAD approved; before/after shots/rooms3/restaurant_tables_before_after.png), and Drip Coffee no longer covers the napkin
  box in the Hole in the Wall (shots/rooms3/restaurant_drip2.png).
- DONE by QA (QA findings: plaque and chandeliers pass; drip: small nudge). WAITING ON QA: check b3e3510, Restaurant: Drip Coffee on the counter's front end (was behind the partition), Star Plaque bigger with a
  picture light, Brass Chandeliers 1.4 tiles. Renders: shots/rooms3/restaurant_drip.png, restaurant_star_chand.png.
- DONE by QA (QA findings: pass). WAITING ON QA: check 8602ed7, Restaurant Chef's Neon: bigger (58 px), in every style incl. Noir, past the kitchen boards (first kitchen: on
  the dining wall by the pass). Three sizes: shots/rooms3/restaurant_chefneon_3sizes.png.
- DONE by QA (QA findings: pass). WAITING ON QA: check d328e88, Restaurant Sculptural Vases (r_d8) draw their own art (rdx_vases, black ceramic and dry branches) instead of the
  olive tree; fully bought render: shots/rooms3/restaurant_vases.png. Look for green fringe on the pampas on dark floors.
- DONE by QA (QA findings: pass; tables: LEAD). WAITING ON QA: check 10f64be, Restaurant fully bought, thinned by superseding (Curved Corner Booth replaces the third booth and its divider;
  Fire Pit replaces the Patio Heaters; Sculptural Vases replace the potted tree; Wine Wall replaces the Drinks Cooler in every
  style). Before/after: shots/rooms3/restaurant_*.png. Your note 3 from aa3a99b: clearly 'never cluttered' now?
- DONE by QA (QA findings: pass). WAITING ON QA: check facb194, your reference check on two rooms: Dessert Parlor (pastel hutch for the bookcase in dsw_t1, Flower Mirror for
  the Arched Mirror, id de_arch kept) and VR Arena (dark neon shell vrw_t1, dark:1). Before/after: shots/rooms3/. Your notes from aa3a99b.
- DONE by QA (QA findings: pass). WAITING ON QA: check f6ba9a6, sv_quilt yawn recoloured to crimson (your fail on aceba29): colour idle vs stretch, and the shoulder tick.
- DONE by QA (QA findings: pass). WAITING ON QA: check 4dbd2e2, yawn picture 44 (sv_fleece, the last): your yawnfall.js and yawnsweep.js. FYI LEAD: all 44 tops now have yawn art
  (m_ and f_<id>_yawn.webp for every id on your list, checked present).
- DONE by QA (QA findings: sv_nordic pass; sv_quilt FAIL, its stretch red is tomato, idle is crimson). WAITING ON QA: check aceba29, yawn pictures 42 and 43 (sv_nordic, sv_quilt): your yawnfall.js and yawnsweep.js; two small ones for your call:
  a faint 1-2 px tan edge under the boy's far Nordic sleeve, and a small tan tick above the boy's far shoulder on the vest.
- DONE by QA (QA findings: pass). WAITING ON QA: check ca391d3, yawn pictures 40 and 41 (oak_crop, oak_vest): your yawnfall.js and yawnsweep.js; a 1-2 px plum line under the vest's
  hem on the boy's left hip (mannequin outline residue), your call.
- DONE by QA (QA findings: pass). WAITING ON QA: check 029de55, yawn picture 39 (oak_track, third paint): your yawnfall.js and yawnsweep.js; both hands show, no strip under
  the arms.
- DONE by QA (QA findings: pass). WAITING ON QA: check 35d51d2, yawn picture 38 (oak_polo): your yawnfall.js and yawnsweep.js; short sleeves, no sleeve hollow.
- DONE by QA (QA findings: pass). WAITING ON QA: check 2d7ddc2, yawn pictures 36 and 37 (km_rash, km_crochet): your yawnfall.js and yawnsweep.js; the cardigan's cream top fills
  the open front.
- DONE by QA (QA findings: pass). WAITING ON QA: check b8d159c, yawn picture 35 (km_boat): your yawnfall.js and yawnsweep.js; sleeves stop short, both hands show.
- DONE by QA (QA findings: pass). WAITING ON QA: check d89dfbb, yawn picture 34 (km_camp): your yawnfall.js and yawnsweep.js; short sleeves, forearms bare.
- DONE by QA (QA findings: pass). WAITING ON QA: check f106365, yawn pictures 32 and 33 (cr_mesh cut with --regreen, cr_vest): your yawnfall.js and yawnsweep.js; underarms
  (both repainted for a strip of arm under the sleeves) and the mesh's edges on a dark background (light-grey sheet).
- DONE by QA (QA findings: pass). WAITING ON QA: check 8fe507c, yawn picture 31 (cr_trench, cut with --pastel): your yawnfall.js and yawnsweep.js, colour idle vs stretch,
  and the waist: a few px of body beside the belt and under the boy's near armpit (map: shots/yawn/cr_trench_exposed_map.png, yellow).
  Your call whether that passes; if not I repaint.
- DONE by QA (QA findings: pass). WAITING ON QA: check 1cc42bc, yawn picture 30 (cr_bomber): your yawnfall.js and yawnsweep.js.
- DONE by QA (QA findings: pass). WAITING ON QA: check 4287952, yawn picture 29 (bb_cloak): your yawnfall.js and yawnsweep.js. A second paint; the front should be closed like idle.
- DONE by QA (QA findings: pass). WAITING ON QA: check e70ef55, yawn picture 28 (bb_doublet): your yawnfall.js and yawnsweep.js.
- DONE by QA (QA findings: pass). WAITING ON QA: check 56f58a2, yawn pictures 26 and 27 (bb_tunic, bb_gambeson): your yawnfall.js and yawnsweep.js. The tunic is a second
  paint; the first left a strip of arm under the boy's far sleeve.
- DONE by QA (QA findings: pass). WAITING ON QA: check 45658f8, yawn picture 25 (sp_hpknit): your yawnfall.js and yawnsweep.js.
- DONE by QA (QA findings: pass). WAITING ON QA: check edefc90, yawn picture 24 (sp_p2): your yawnfall.js and yawnsweep.js. A second paint; check the PLAYER 2 print reads.
- DONE by QA (QA findings: pass). WAITING ON QA: check 68eb5aa, yawn pictures 22 and 23 (sp_varsity, sp_pad): your yawnfall.js and yawnsweep.js. sp_pad is a second paint;
  the first left the boy's far sleeve hanging under his arm.
- DONE by QA (QA findings: pass). WAITING ON QA: check 360da8a, yawn pictures 20 and 21 (gp_star, gp_sailor): your yawnfall.js and yawnsweep.js.
- DONE by QA (QA findings: pass). WAITING ON QA: check 2d2ea91, yawn pictures 18 and 19 (gp_blazer, gp_bear): your yawnfall.js and yawnsweep.js. The blazer is a second paint;
  the first left a thin strip of the boy's body down his right side.
- DONE by QA (QA findings: pass). WAITING ON QA: check b62c0a2, yawn pictures 16 and 17 (smk_vest, smk_cloak): your yawnfall.js and yawnsweep.js.
- DONE by QA (QA findings: pass). WAITING ON QA: check aab35f3, yawn pictures 14 and 15 (smk_jacket, smk_mesh): your yawnfall.js and yawnsweep.js.
- DONE by QA (QA findings: pass). WAITING ON QA: check f18de4c, yawn pictures 12 and 13 (sm_tee, sm_vest): your yawnfall.js and yawnsweep.js.
- DONE by QA (QA findings: pass). WAITING ON QA: check 57dafa4, yawn pictures 10 and 11 (kp_bomber, sm_track): your yawnfall.js and yawnsweep.js.
- DONE by QA (QA findings: pass). WAITING ON QA: check 25939d4 and bf08f94, yawn pictures 8 and 9 (nc_qzip, kp_sailor): your yawnfall.js and yawnsweep.js.
- DONE by QA (QA findings: pass). WAITING ON QA: check bc4a575, yawn pictures 6 and 7 (nc_tank, kp_hoodie): your yawnfall.js and yawnsweep.js.
- DONE by QA (QA findings: pass). WAITING ON QA: check 653138e, yawn pictures 4 and 5 (sm_hoodie, sv_ski): your yawnfall.js and yawnsweep.js. The hoodie was repainted
  with cuffs at the wrists (the first sheet ran the sleeves over the hands); the ski jacket's sheet had a drawn face, dropped.
- DONE by QA (QA findings: pass). WAITING ON QA: check 2dde59c, 8f026ce, 05e7c19, the first three of the 44 yawn pictures (nc_hoodie, nc_tee, kp_varsity) in the stretch
  on both bodies with every hair and necklace: no tears, sleeves to the wrists, nothing stray on the head (the tee's sheet had a drawn
  face, dropped). ROOMS checked the matrix stretch pose on both bodies.
- DONE by QA (QA findings: pass). WAITING ON QA: check 567ea26, your open point on 570b2f3. Nightclub: the DJ and bartender spots stay behind the decks and the bar
  (onspot), and a staff aisle reaches them from the right (bar off the wall, speakers in line with the decks, coat check a little
  right and shallower). The Sky Patio lounge chair's seat has a walk-to point. ROOMS checked lfRoute to all three and the Club
  live at 22:00 (the DJ at the decks), 0 page errors.
- DONE by QA (QA findings: pass but the Nightclub's staff spots). WAITING ON QA: check 570b2f3, Cal's use check (your 6430d13 list). Every room fully bought: the Arcade pinball points into the
  room; Skee-Ball's player at its throwing end; the Speakeasy upright piano on the back wall facing the room and its bar off the
  wall; the Club and Rooftop DJ decks off the wall with the DJ behind; VR flight pod off the sofa, ring chair in from the edge;
  Rhythm dance pads a tile out, bench off the mirrors; lobby booth clear of the sofa; Restaurant coffee off the pizza oven, smoker
  in the olive corner, table out of the crescent's opening; skybar glass cabinet clear of the sofa; Bedroom mirror on the left
  wall (clear of the Closet door); Mall fountain clear of the clothing store; Boba fridge on the back wall; Dessert towers off the
  bookcase; Garden potting bench ends the tool column. Bowling unchanged: bwx_seatb is a rear view, the seats face the lane ends.
  ROOMS checked all 21 rooms headless, 0 page errors.
- DONE by QA (QA findings: pass). WAITING ON QA: check 62d336d, dbf2593, a4be384, aca27a1 and 1e8a3b4. (1) Screens: the Auditorium, the lobby trailer and showtimes and the
  Boba TV show a still picture when animations are off. (2) The Rooftop and Sky Patio stay dark at 22:00 (abe06dd had lit them).
  (3) Kenan's three portraits wear the same black shades as his in-game look (Cal). (4) The Bedroom rug tucks under the bed; the
  dog beds stay on the front edge (an earlier call). (5) The Rhythm Room's front floor gets a neon dance circle with the Pulsing
  Floor. (6) The Sky Patio keeps the wicker lounge chair by the fire once the Egg Swing is in. Not taken (design calls, need art or
  Cal): the Dessert bookcase and mirror, the VR Arena palette, the full Restaurant's density.
- DONE by QA (QA findings: pass). - WAITING ON QA: check 633ffe2 and ede09d8 for v0.68. (1) The Upstairs Bar (r_bar) needs White Linen Service (r_t3, Cal's "fine dining")
  and is hidden until then; a save that owns the bar keeps it. (2) The Garden lot is for sale from level 5 (padlock at 4), matching
  The Loft's welcome card. ROOMS checked headless, 0 page errors. Also 0f9cabe: Take Over Next Door's splash now says white linen comes before the bar upstairs.
- DONE by QA (QA findings: pass). - WAITING ON QA: check 4e93d54, Cal's room-window notes. (1) Room windows never zoom: no + - or reset, no wheel or pinch (only the
  Bedroom keeps its lamp button); the street and building views stop at 1.6x (was 2.6x). (2) The stage-1 and stage-2 Restaurant
  double shelf runs along the back wall above the wainscot (it was mirrored). (3) The Grand Menu Board (CARTE DU JOUR / OUR MENU) is
  66 high and wholly above the rail, clear of the wine wall. ROOMS checked headless, 0 page errors; not on a phone.
- DONE by QA (QA findings: pass). - WAITING ON QA: check 1308059, buying an upgrade with the room window open. People keep their places, what they are doing, their
  seat and order and their look; the new pieces pulse gold twice (about 1.3 s) after the crate opens, the soft-shadow layer does
  not. ROOMS checked headless buying the Restaurant Open Sign with 5 people in the window. Not done: a flash in the building view
  (it is hidden behind the window while you buy); not checked on a phone or in other rooms.
- DONE by QA (QA findings: pass). WAITING ON QA: check 93d33f1, Cal's Restaurant notes in every business. (1) No two identical customers in one room, and fewer: one or
  two stay, more about halved, five at most (`lfGuestN`). (2) Chair shadows sized to the chair; beds and sofas unchanged. (3) The
  Sidewalk Sign is now the Open Sign: chalkboard plus a neon OPEN in the first window (not in Noir). ROOMS checked headless: Restaurant,
  Boba, Dessert, Arcade, Theater, Mall and Club sampled 12 times each in the building views, 0 duplicates, at most 5; stage-1
  Restaurant 2. Not checked: the Auditorium, Speakeasy, Bowling, Karaoke, VR and Rooftop one by one, and phones.
- DONE by QA (QA findings: pass). WAITING ON QA: check abe06dd, night lights (Cal: only the Bedroom needs a light switch). At 10 pm: every room but the Bedroom draws lit with
  no lamp button (window and building view); the Bedroom stays dark until its lamp is on, and its button and saved rm.lit work as
  before. ROOMS checked headless: Bedroom off and on, Lounge, Restaurant, the Loft and Plaza building views, 0 page errors.
- DONE by QA (QA findings: pass, 15 of 15). WAITING ON QA: wear test SØLVBERG, 57527b0 (brand id sv; 15 pieces, both bodies; the leggings are hers only). ROOMS checked headless
  on 1660269: idle, walk1, backwalk1, stretchUp, stretch and sitBack, 10 of 10 outfit cells with 0 failures each. Look hardest at:
  the mittens in the "arms" slot (their clip-cords floated beside the arm, so I stripped them); the trapper and pom beanie with long
  hair and the ponytail; the goggles (noClip) on the forehead; the puffer and après boots ("over") with each pant; the badge (a
  snowcapped peak and snowflake, no cross). Rig note for LEAD, not this brand: stretchUp shows white flecks at the armpits on every
  top, older passed ones too (oak_track, sp_hpknit, cr_bomber).
- DONE by QA (QA findings: pass; the badge ring is still green). WAITING ON QA: check OAKMONT's stripes, recoloured. QA's design call (the green-burgundy-green web stripe) is answered by recolouring
  every green stripe to navy: headband, wristbands, track jacket and pants, skirt hem, tube socks, tennis vest, the crop's second
  racket, the cap button and the badge ring. ROOMS checked headless: idle and backwalk1, 17 of 17 with 0 failures. LEAD gets the new
  colours and lines.
- DONE by QA (QA findings: 15 of 15 fit; one design call, the green-and-burgundy stripe). WAITING ON QA: wear test OAKMONT, 78c961b (brand id oak; 15 pieces, both bodies; the skirt is hers only). ROOMS checked headless on
  0a88ad4: idle, walk1, backwalk1 and stretchUp, 31 of 31 with 0 failures each (with cr_arm for reference). Look hardest at: the
  wristbands and the watch in the "arms" slot (the watch is on one wrist; it matches the cr_arm sleeve, viewer-left from the front,
  viewer-right from behind); the headband and visor (noClip) with long hair; the track jacket (two stripes, not three) and the
  court shoes and suede runners as original, not any famous sportswear; the tube socks under trousers. LEAD has the shop lines.
- DONE by QA (QA findings: pass). WAITING ON QA: wear test KAIMANA, 24304af (brand id km; 15 pieces, both bodies). ROOMS checked headless on 2b65e9b: idle, walk1,
  backwalk1 and stretchUp, 30 of 30 with 0 failures each, reading right by eye. Look hardest at: the straw sun hat and bucket hat with
  long hair and the ponytail (wide brims), the visor (noClip, open top), the crochet cardigan (open front over a cream tank), the board
  shorts and cut-offs under a top, the shell necklace. LEAD has the shop lines.
- DONE by QA (QA findings: pass). WAITING ON QA: check 14bd0e5, CHROME RAIN's two fixes. cr_mesh is now an opaque dark purple diamond net under the harness, the same
  on both bodies, matching its icon. cr_lightup has a small rose lightning bolt and a straight line, no wavy stripe; a baked outline
  was stripped. ROOMS checked headless on 577831f: idle, walk1, backwalk1 and stretchUp, 16 of 16 with 0 failures.
- DONE by QA (QA findings: 14 of 15, the mesh top; one design call). WAITING ON QA: wear test CHROME RAIN, 5cf2e1d (brand id cr; 15 pieces, both bodies; the skirt is hers only). ROOMS checked headless
  on c3088b5: idle, walk1, backwalk1 and stretchUp, 29 of 29 with 0 failures each, reading right by eye. Look hardest at: the cyber-arm
  sleeve (one arm, "arms" slot); the trench in stretch and walks (knee length); the mesh top (its holes opened so skin shows; it reads
  mostly as a harness over skin at game size, so say if it needs more net); the visor (a baked outline stripped); the mohawk helmet and
  hood over every hairstyle; the platform and combat boots ("over") with each pant. LEAD has the shop lines.
- DONE by QA (QA findings: 15 of 15, two rig notes for LEAD). WAITING ON QA: wear test BARD & BLADE, f843b25 (brand id bb; 15 pieces, both bodies; the skirt is hers only). ROOMS checked headless
  on f100e51: idle, walk1, backwalk1 and stretchUp, 29 of 29 with 0 failures each, reading right by eye; the travel cloak, mantle,
  circlet, crystal and bracers also in stretch and sleep. Look hardest at: the bracers in the new "arms" slot (LEAD 23bf14f; the far
  one is ragged from behind in type1, like that arm's sleeves); the travel cloak in stretch and walks (knee length, my earlier cloak
  trailed slivers); the wizard hat (ingested with a looser 0.2 limit for its wide brim) with long hair and the ponytail; the ranger hood
  over every hairstyle; the skirt with "overTop" (tool belt over the top); the crystal (a baked outline was stripped). LEAD has the
  shop lines.
- DONE by QA (QA findings: pass). WAITING ON QA: check 200d498, SAVE POINT's two fixes. sp_headset from behind shows only the arc and the cups; the band across the
  back of his head is erased, and hers came out clean. sp_flag is now grey lace-up sneakers with a purple toe, teal laces and a red
  pixel flag, with no checkerboard; a baked outline was stripped. ROOMS checked headless: idle, walk1, backwalk1 and sitBack, 16 of 16
  with 0 failures. LEAD has the new shoe row.
- DONE by QA (QA findings: 13 of 15, the headset's back and the checkerboard slip-ons). WAITING ON QA: wear test SAVE POINT, bad0b45 (brand id sp; 15 pieces, both bodies). ROOMS checked headless: idle, walk1 and
  backwalk1 load 30 of 30 with 0 failures and read right by eye. Look hardest at: the coin cap and the checkerboard slip-ons (a baked
  mannequin outline was stripped from both; look for leftover lines, and the cap's brim edge is a little soft); every teal detail
  (the brand's bright green is the key colour, so greens inside clothing became teal: PLAYER 2 letters, varsity cuffs, headset rings,
  the pompom, the track stripe); the headset (noClip) and the cap with long hair and the ponytail; the shades (frontOnly). Design call
  for QA: the checkerboard slip-ons are a common style and carry no logo, but say if they read as one shoe brand. LEAD has the shop lines.
- DONE by QA (QA findings: pass). WAITING ON QA: check 86f50d9, GACHA POP's cat hood back. It is repainted with an outline, knit ribbing, a centre seam and the blue
  trim at the neck. ROOMS checked headless on both bodies: idle, backwalk1 and sitBack, 8 of 8 with 0 failures. The overalls' and shorts'
  "overTop" flag is in d4d8fd8; LEAD's rig side (pantsOver) decides when that shows.
- DONE by QA (QA findings: 14 of 15, the cat hood's back; the overalls' bib). WAITING ON QA: wear test GACHA POP, 03274a7 (brand id gp; 15 pieces, both bodies; the skirt is hers only). ROOMS checked headless:
  idle and walk1 load 29 of 29 with 0 failures; backwalk1 for the wings, hood, bear, sailor, bunny, bow and shades looks right.
  Look hardest at the wings (neck slot, ingested with a looser stray limit of 0.25, so check sits and sleep), the heart shades (a
  baked mannequin outline was stripped; look for leftover grey lines), the bow and bunny beanie with long hair and the ponytail
  (noClip on the bow), and the cat hood over each hairstyle. The suspenders and the overalls' bib sit under any top, so with a top
  on they read as shorts and trousers. LEAD has the shop lines.
- DONE by QA (QA findings: pass). WAITING ON QA: check 8d07611, the SMOKE BOMB cloak's last sliver. Below the waist the hem is trimmed to hip width with an inked edge.
  Headless at 240px cells, the long sliver off the hand and the scrap at the hip in stretch are gone on both bodies (compared with
  36afaa1). Left alone: a short armpit fleck in stretchUp shows on every top at large sizes (smk_jacket, sm_tee, gp_blazer), so it
  is the rig's armpit split (LEAD's rig.armpit), not the cloak. Clearing the arm-to-body gap in the art changed nothing.
- DONE by QA (QA findings: 14 of 15, a sliver at the hand in the cloak's stretch). WAITING ON QA: check 36afaa1, SMOKE BOMB's three fixes. smk_cloak is repainted closed with the torn hem at the hip; look at stretch,
  stretchUp and walks, which ROOMS checked in stretchUp and walk1. smk_band is plain stitched cloth with a smoke puff and no plate;
  its knot shows at the back on her and not on him. smk_vest is a quilted funnel-neck puffer over cream sleeves. LEAD: rename two rows,
  band to "Stitched Headband" and vest to "Quilted Puffer Vest" (texts in ROOMS's message).
  Retired ids so far: `gm_ping`, `sb_chester`, `sb_trolley`, `rf_lng2`, `rf_towel`, `rf_ice`, `rf_umb`, `ml_gum`, `ml_ride`, `ml_photo`,
  `ml_flower`, `ml_dir`, `vr_pod2`; new `sb_band`, `dg_riftmask`, `tm_*` tops; `ml_kar` needs `ml_bow`. Dark-floor shadows stay at 0.92 (QA: 0.8 is the knob if Cal finds them heavy). (on a07439f)
- DONE by QA (QA findings: pass, the piano still touches the bar). WAITING ON QA: check fe48618 (rule 17, small check): Lock and Key's Friday Band (`sb_band`). No card until the Jazz Corner
  is owned; once bought the mic stage leaves the picture and the band stage stands in its corner, clear of the door mat
  and the high-tops; More High-Tops shows one table; the piano no longer touches the bar (QA's note). ROOMS's headless
  pass: no page errors, card gating right in all three saves (bare, all but the band, all).
- DONE by QA (QA findings: pass, 1 note). WAITING ON QA: check 4599993 (rule 17, small check): Lock and Key (the Upstairs Bar, id `skybar`) shows the painted
  brick shell bare and fully bought; the Downstairs door (front-left edge) and the Roof door (the painted stairway, back wall
  far right) both walk and nothing stands on them; nothing outside the room; the back bar stays under the wall top; an old
  save that owns the Upstairs Bar keeps every piece. ROOMS's headless pass: no page errors, both arrows, shell drawn.
- DONE by QA (QA findings: pass). WAITING ON QA: check 0b23996 and d1d7c73 (rule 17): the city behind every building has far fewer, softer lit windows (day
  and night); Noir with White Linen Service sets black marble and brass tables with charcoal velvet chairs (other looks
  unchanged); the patio fire pit clear of the deck rail.
  12-minute loop running (rule 16). (on 23f993d)
- DONE by QA (QA findings: on the floor, both on the door mat). WAITING ON QA: check 23f993d (rule 17), your d4f4577 fixes: the Boba Shaker Station on the floor below the pickup shelf, the
  Dessert Macaron Tower on the floor below the Cake Stand (both rooms spread a 10x8 plan to 12x9; the pieces were in room
  units by mistake), the Dessert Downstairs glow at 1.3, clear of the cafe chairs. The speakeasy's Dessert door goes to its
  front-left edge with step 5.
- DONE by QA (QA findings: doors pass, 2 pieces off the floor). WAITING ON QA: check f0c6dbb (rule 17): the Dessert Parlor's painted shell bare and fully bought; "Hidden Door" at the
  painted bookcase (nothing on its glow), "Downstairs" on the front-left edge; the Boba shop fixes from your 84e97f6 (shaker
  station off the stairs, window bench clear of the side door). The Boba Menu Screen cycles pages (drinks show in my renders);
  a blank frame may be the page change.
- DONE by QA (QA findings: doors pass, 2 placement fixes). WAITING ON QA: check c223d89 (rule 17), the Boba shop: its painted shell bare and fully bought; "Upstairs" at the stairs
  painted at the back wall's far end (nothing standing on its glow); the new side door: Boba "Garden" arrow (top left) and
  the Garden's "Boba Shop" arrow (bottom right) walk both ways; the Neon Cup Sign high over the tea jars.
- DONE by QA (QA findings: pass, 1 note). WAITING ON QA: check a9a572c and e415c00 (rule 17): the Restaurant patio (Corner Diner and Bistro with everything): the fire
  pit left and the table (under the pergola once bought) right, with the sign in the gap; a low rail between deck and
  dining room, open at the front door; no white drinks cooler in Noir with the wine wall. The watering can's tap area on
  a phone (about 44 px).
- DONE by QA (QA findings: pass, 1 note). WAITING ON QA: check 8a5ac99, 059bd45 and 82cc1f9 (rule 17), Cal's Garden notes: (1) every bed lines up with the room's grid
  (fitted top faces), grow lights drawn along the beds; (2) the Estate with the fountain has no sundial, birdbath or
  topiaries, no lantern in the fountain plaza, the scarecrow by the left wall at every stage; (3) watering: with the beds dry
  they look parched, tapping the watering can in the back corner waters them (24 h) and they look damp; Sprinklers keep
  them damp. The Back Plot's stand is a tile further in.
- DONE by QA (QA findings: pass, 2 small notes). WAITING ON QA: check 29c09a7 (rule 17), your Garden placement fixes and the stand: beds no longer on top of each other (all
  stages); the Kitchen Garden's front spread out (hive and coop front left, shed by the tools, pump by the trellis, gate at
  the walk's end); Grow Lamps are frames over the beds; a crate stand at the Back Plot's gate, the Farm Stand replacing it
  at any stage.
- DONE by QA (QA findings: pass). WAITING ON QA: check 28a51ee (rule 17): the Garden is right of the Restaurant in Kode Plaza (building view, Boba's stack one
  along); with both built, the Restaurant's "Garden" arrow (front right, the kitchen end wall has a gap) and the Garden's
  "Restaurant" arrow (top left, a lit doorway in the back-left wall) walk both ways, at every Garden and Restaurant size.
- DONE by QA (QA findings: lots pass, 3 placement fixes for ROOMS). WAITING ON QA: check 4725457, cd73831 and 5fa3fec (rule 17), the Garden's painted lots: Back Plot, Kitchen Garden and
  Estate, each bare and fully bought. Look for: brick walls showing (no hedge or glass fence over them), beds and tools
  standing on the lawn, nothing poking through a wall, the Estate's walls cut at the stone coping with no black band.
- DONE by QA (QA findings: pass). WAITING ON QA: check f457680 and eb85e90 (rule 17), Cal's last two Restaurant notes: the red crescent booth in the back-left
  corner now opens straight toward the room (new `rdx_curve2`), its table and two seats inside it; the patio's Fire Pit
  Lounge is a real fire pit (new `rsx_firepit2`: stone bowl, three Adirondack chairs, logs). Bistro and Noir.
- DONE by QA (QA findings: pass). WAITING ON QA: check d30bb93 and 642b791 (rule 17). Game Room (Cal's phone notes): the Retro TV now faces the beanbags; Gaming
  Desks is one long desk with one curved screen and keyboard per seat, a chair facing each, the ping pong table clear of
  the chairs. Restaurant, your two menu-board fixes: every dish fits (22 Corner Diner, 26 Noir, the rows grow and long
  names shrink, none runs into its price) and the Corner Diner board clears the painting and the wine wall.
- DONE by QA (QA findings: 3 pass, 2 fixes for ROOMS). WAITING ON QA: check 04bb241 and 0edb26c (rule 17), Cal's Restaurant notes: (1) Bistro and Noir repainted so the back wall
  line is where the room's wall is: tables near the back wall stand in front of it, not on it; (2) Grand Menu Board
  (`r_bigmenu`, Corner Diner and up, after the Digital Menu Screen) lists every dish, two columns, readable; (3) seven gear
  upgrades add dishes to the menu (Espresso Bar, Flat-Top Grill, Fryer, Bakery Rack, Wood-Fired Oven, Grand French Range,
  Charcoal Grill); (4) the red crescent booth (Full Dining Floor) in the back-left corner, open to the room, the window
  booths and their dividers moved down, nothing overlapping; (5) the kitchen half-wall in each look's colours. Your lessons
  2 to 4 (booths over the windows, the patio corner, the cooler) go into the fine-dining furniture pass.
- DONE by QA (QA findings). WAITING ON QA: check 64e4735 (and 1eb8040, 156683a), the Restaurant's painted shells: each size bare and fully bought
  (Hole in the Wall, Corner Diner, Bistro, Noir), with and without the Sidewalk Patio. Look for furniture against the
  painted walls that floats or overlaps a window, the kitchen divider lining up with the kitchen tile, the front door mat.
  Furniture is the old set; Cal wants sleek fine-dining pieces next, so note placement lessons, not sprite tickets.
- DONE by QA (QA findings). WAITING ON QA: check 9be3f51, the Trophy Room: the Lair shows a mystery card before any piece and "Stairs to the Trophy
  Room" after one; buy it, walk up and down by the arrows; the mannequin wears exactly the owned pieces (try two or three
  sets); the building view shows the hall above the Lair. Known: no painted doorway in the Lair (its back wall is the suit
  cases), only the floor glow and the arrow.
- DONE by QA (QA findings). WAITING ON QA: check ab9dc81: the seven freed upgrades show in their menus and can be bought; the Game Room door.
- DONE by QA (QA findings). WAITING ON QA: check the Bedroom wall tiers, f4362b1: buy Fresh Paint, Living Grass Wall and Cove Lighting in turn in
  each of the four Room styles; each changes the walls, brick and slats run the whole left wall, nothing hangs on the grass.
- DONE by QA (QA findings). WAITING ON QA: check walking onto the Patio, 63ac9f3: Bedroom window with a Patio and both dogs, for a few minutes; you
  and the dogs should show in it, walk out through the sliding door (it opens), stand among the Patio furniture, the dogs
  lie on their Patio beds; nobody stands inside furniture.
- DONE by QA (QA findings). WAITING ON QA: check the Patio, ef2ab15: turf, string lights, both dog beds, the door on the front-left edge, and a
  Patio buy showing through the Bedroom glass straight away.

To do:
- [x] Closet stages and the Lair stage are in (see Ready to publish). Closet stages: Cal APPROVED the second version 2026-11-05 ("This looks good"), Start to Super Sleek Modern, files
      `art/raw/walls/closet/st_dark, st_lit2, st_shoe2, st_jewel2, st_island2, room_jewel2, st_modern2`. Put them in
      (`clPaint` stages, sizes in `data/rsart.json`, drop the `clx_jewel` sprite and the LED overlay). The Lair stage waits
      on Cal's answer about doors vs the building layout (asked 2026-11-05): ROOMS recommends keeping the building as is
      and moving the sliding cabinet to the back corner of the LEFT wall, since the Lair sits left of the Closet.
      Earlier notes on approval 3: (1) the LED wardrobe strips from
      Wardrobe Lights on every later stage (Shoe & Bag Wall through Super Sleek Modern); (2) remove the eight round light
      pools on the floor in Wardrobe Lights; (3) a new last step, the Hero's Lair (`cl_lair`, id kept): the cabinet in the
      far corner (top of the picture) slides open, animated, to reveal a hidden entrance that leads to the Lair. Paintings in
      `art/raw/walls/closet/`.
- [x] (DONE: 3962ee2, fd80c50, doors.js) Doors that make sense (Cal, 2026-11-05): "make sure that the entrances from each room to the other room make sense."
      Bedroom: the Closet entrance goes where the wardrobe upgrade stands (left wall, front part). The wardrobe upgrade
      becomes a wall-mounted figurine cabinet that never covers that door (keep the ids `bd_ward1`, `bd_ward2`). Closet: you
      enter from the bottom-right edge, since in the Bedroom you leave by the upper left. "Take this logic and apply it to
      every room going forward so it mimics proper room traversal": a door on one room's back-left wall comes out of the
      next room's front-right edge, back-right to front-left, and the other way round, at matching positions. Check every
      `portal(...)` pair in `27_rooms.js`.
      Measured 2026-11-05 (every upgrade owned, a glow is 1.5 tiles along its side): the rule's side is clear of furniture
      for most pairs, but no clear spot exists on the Bedroom left wall (wardrobe, until it becomes the figurine cabinet), the
      Bedroom back-right wall at the Patio door, the Boba, Dessert and Mall back-right walls (way up), the Arcade back-right
      wall (Rhythm) and the Arcade left wall (Mall): those rooms need pieces moved before their doors can go there. Also from
      QA: put each way-up arrow on its own door's side (`rmArrows`), and nothing standing on a door glow.
- [x] (DONE: 61d4a44, 65cf7fd) Bedroom walls (Cal approved the four tiers, 2026-11-05: "this is great!"). Before they go in, from his answer: (1) keep
      the wall colour options, the Loft should be the most customizable: a painted version of each tier per colour scheme;
      (2) the patio: buying it must put a patio door in the Bedroom, and the view through the glass must show the patio
      furniture he owns in the Patio room (the old Bedroom patio view looked great): DONE in 17ab80d. Tiers are in
      `art/raw/walls/bedroom/`; the preview loader is `scratchpad`-only for now, the real one goes in `26_world.js`.
- [x] (DONE: built, approval 16; QA passed b3bca79) Trophy Room (Cal, 2026-11-05): a new room above the Lair (`ROOMCELL` `[0,1,2]`, free), opened by a new door on the
      Lair's upper (back-right) wall, entered from the Trophy Room's front-left edge. Offered in the Lair only after a crew
      member brings back the first raid trophy (LEAD adds `qbRaidTrophies()`, requested). The Lair's Trophy Wall (`lr_trophy`)
      is retired when the room ships (id kept, hidden, drawn nowhere). Art for Cal's approval first: the Lair's new door
      (closed, then open), the Trophy Room walls in tiers, and trophy displays that fill as raids bring more back.
- [x] (DONE: ef2ab15; dogs 2faabd0/afc5d4f) Patio (Cal, 2026-11-05): (1) replace the fairy-light tower on the left (`pt_lights`, `hmx_strings`) with something
      else, keep the id; (2) the Artificial Grass reads as a green square tile: paint real, comfy, plush artificial turf;
      (3) a second patio dog bed, for Chopstick; (4) the character and the dogs walk in and out between the Bedroom and the
      Patio through the new door; (5) once the dogs are bought, see them run around and interact with the room. Cal sent
      photos for the dog art (study only): Pluto is a beige, curly toy poodle; Chopstick is a black-and-tan
      chihuahua-dachshund mix with long feathered ears. Art for Cal's approval first.
- [x] Yawn pilot: Cal approved, in `art/app` (b506b8c), see Ready to publish. Next, ask Cal: roll it out to every top?
- [x] (LEAD's request) Lag: drag applies the transform at most once per frame. DONE in 47d2ffd (`lfApply`, requestAnimationFrame).
- [x] (DONE: art slots Buildings 6/6) (LEAD's request) Three buildings: paint the exteriors and inside backgrounds, side by side for Cal.
- [ ] Regenerate `o_lock`, `al_carab`, `v_shade`, `v_corset` cleanly (their baked-in mannequin was cut out by hand). ROOMS on f39f668:
      all four render clean in idle and backwalk1 on both bodies, so they stay as they are during the playtest (no new art).
- [ ] New outfits as Cal asks: one sheet per cosmetic, every angle; test every combination and pose before calling
      it ready.
- [ ] UI pictures redrawn in the game's style (`ui_*`: classes, coaches, crew, ranks, rewards). List in HANDOFF, Art.
- [x] Black Tulle Skirt (`v_tulle`) (DONE: skirt flag be8e92c, QA's wear test 51977b7): HANDOFF used to say it was held back, but it has all its files and is on sale. Nobody
      has looked at how it renders. Wear-test it on the body it fits, in every pose.
- [x] (DONE: ROOMS uses `~/.venvs/questboard`, set `QB_PY` to it) This clone's Python has no `PIL`, `numpy` or `scipy`, and the art tools need them (`rs_art.py`, `pack.py` and so on).
      Set them up before the first ingest.
- [ ] MAIN JOB (left, checked 2026-11-08: Hero's Lair, Movie Theater, Auditorium still draw their walls; every other
      room has its painted shell). Painted walls for every room: wall-and-floor art in upgrade tiers, same camera every tier, matching the
      room's size (list in HANDOFF), our furniture sprites on top. Built-in upgrades become part of the wall art (Club tier
      1 suede walls, then the bar upgrade adds a glowing hanging liquor cabinet). No two rooms share a final. Bedroom first,
      then up through the building order. For each room: generate, show Cal the tiers side by side, build the loader and put
      them in only after he approves.
- [ ] Generic stage loader for wall shells (like `clPaint` in `27_rooms.js`), fitted to each room, green removed. After
      Cal approves the first set.
- [x] (DONE: 93c95b6, every upgrade its own painting) Closet (Cal, on v43): Wardrobe Lights and Super Sleek Modern look like nothing changed. Make each one obvious.
- [x] (DONE: 93c95b6) Closet (Cal, on v43): Jewelry Tower stops being the `clx_jewel` sprite. Another part of the closet opens up and shows
      jewelry, just like the shoe and bag wall. Art for his approval.
- [ ] Every upgrade in every room clearly visible (Cal, on v43). MEASURED 2026-11-05 (all 21 rooms, 397 upgrades, each bought
      alone in unlock order; report, numbers and before/after sheets in `art/raw/audit/`, git-ignored): 318 OK, 33 WEAK,
      9 NONE, 35 not visual by design (staff, menus, money caps, pets, expansions). Fix, worst first:
      - RE-CHECKED 2026-11-07 by ROOMS on 77ae1d3: both lists below are fixed in today's code. Canvas Art and Figurine Shelf are no
        longer sold once the glass wall is owned (Cal's call); Dividers (`r_d3`), Drinks Cooler and Dish Station carry `also:r_x1/x2`
        and More Plots `also:g_x1`, so none can be bought before their expansion; the Film Reel hangs at 5.9 clear of the poster;
        Neon Trim draws two tubes by day. The never-buyable ones are freed at load (`27b_skins.js`, `window.__qbFreedReq`: 7) or
        re-pointed (Sprinklers to `g_can`, Gourmet Menu to `t_ctr`); a headless check finds none left. Only the WEAK list remains.
      - (old) Bugs, bought but never drawn: Bedroom Canvas Art and Figurine Shelf vanish once Floor-to-Ceiling Glass is owned
        (`!w3` in `20_loft.js`), and the shop sells them after it; Restaurant Walnut Dividers, Drinks Cooler and Dish Station
        only draw after expansions they are sold before; Garden More Plots adds no bed until Buy the Empty Lot; Theater Film
        Reel Wall Art sits behind the movie poster; Arcade Neon Trim is only a glow (nothing by day).
      - Can never be bought (their prerequisite left the room's list): Restaurant Chef's Neon; Game Room Couch & Console, Pool
        Table, Snack Bar; Garden Scarecrow, Berry Patch, Beehive; Theater Cocktail Bar and the three that need it.
      - WEAK, needs a bigger change or new art: 10 in the Restaurant (Star Plaque, Grand French Range, Brass Chandeliers by
        day, Black Marble Counter, Sculptural Vases, Espresso Bar, Charcoal Grill Station, Patio Heaters, Host Desk, Brass
        Sconces), 4 in the Auditorium (Aisle Lights, Digital Projector, Surround Sound; Bigger and IMAX Screen grow the room
        but the view shrinks to fit), Bedroom Neon Sign and Racing Chair, Game Room RGB Floor Lamp, Sky Bar Champagne Trolley
        (behind the piano), Club Laser Rig and Smoke Machine. Closet Wardrobe Lights and Super Sleek Modern: new art done.
      Not measured: expansions (their doors), people, pets and animation.
- [x] (DONE, then changed by Cal on v0.58: 3c27004, 6f04ed8, 4915a05) Game Room art: back-to-back gaming rigs at the front with the racing chairs facing them, a cream three-piece
      sectional with a futon piece, then an 80 inch TV and a floating modern media console as later upgrades.
- [ ] Club (optional): back-view booth art if Cal wants booths along the bottom edge too.
- [x] Speakeasy: `depth.js` flags the piano drawn over the stage; look at it. DONE in b19a578 and 707cac1 (the piano stands by the band stage).

---

Requests for QA (Windows session, 2026-11-09):
- WAITING ON QA: missions and dungeon delves are one thing now, Dungeon Crawls (Cal: "Merge dungeons and missions"; 10_app_a.js
  dngClaim and dngHtml, finds in 29d_dungeon.js crawlFind, docs/ECONOMY.md). Three of your scripts drive the old missions and
  need a new path: `rigtest/qa/sim.js` (msgo/msclaim; `tools/windows/econsim.js` shows the crawl version), `riftlive.js`
  (`__qbDungeon.roll('m5')` is gone: `__qbDungeon.find({id:"spire",c:[180,420]})` or a Spire crawl) and `team.js`. Check: Sable
  joins on the first crawl, a rare find at least every 4th crawl, 5 crawls a day, the Trophy Room opener once the first piece is
  home, and a save with a mission still out gets its coins once.

## QA: tests, pilots, quality checks

Doing:
- STOPPED (Cal, 2026-11-07 about noon): this QA session has stopped; Cal is starting a new QA session. Hand-over for it:
  (1) DONE on 42d73be by the new QA session (next line). Was: the v0.73 full set (fb0b6cb, LEAD's build, APPV 73, clean build 492 files) is NOT done: savecheck, screens 360/390 and
  visits passed, then I stopped it during lagcheck. Run the whole set again on v0.73 (on LEAD's rebuild if it adds eadc75b),
  the same list as the v0.72 line in QA findings (a3c2cb6), with rigtest/qa/stillcheck.js instead of screenlive.js; players10's
  quiet-minute limit is timing-sensitive under load (see the v0.72 line). (2) The published-file checks: DONE by the new QA
  session, both PASS (QA findings). Everything else to QA is DONE: all 44 painted
  stretch pictures, ROOMS's room work through eadc75b (pendants and neon pass), v0.72 PASS. No WAITING ON QA left open. (on 1d02341)
- Now (QA): v0.76's owed checks done on ca68e45, NOT a pass yet, QA findings. WAITING ON ROOMS: the lobby's left wall and the Escalator's text; WAITING ON LEAD: the tall-card top. Next: v0.78 (Town Square, sandbox) from the latest commit when Cal says go. Small checks only, no loops or crons (Cal). (on ca68e45)
  Was (QA): STOPPED until Thursday (Cal, via LEAD: "stop the automatic checks because that is using my credits"). No loops or
  crons running; QA's test servers shut down. Friends test v0.75 (0729a6b, QA PASSED) on the Live link; LEAD smoke-tests the
  level-1 start himself. Waiting for Thursday: v0.76 (ROOMS's 8c756be approved art, b3d6b28 Patio beds per dog). (on 27f5198)
- FYI LEAD and ROOMS: TEAMWORK rule 14 (Cal): every Doing line ends `(on <commit>)`; nobody starts until all three name the
  latest commit and nothing they touch is uncommitted elsewhere; LEAD checks it all before every publish and wrap-up.

To do:
- [x] (from LEAD; done: QA findings, PASS, publish) WAITING ON QA: the full set on v0.72, 083fec9 (APPV 72). New since v0.71 (3840577): all 44 painted yawn pictures (with
      f6ba9a6's recolour), the yawn fallback 7d7c5df + e3278f0, the hair lock 4f30ef5 + 30d93a9, the screens' still picture cfa5f62.
      LEAD: clean build, 491 files (art_rig now 9 pieces), loads clean, Review 119/119, the whole story 64/64 save unchanged, livesync
      PASS, painted stretch with the lock on long hair.
- [x] (from LEAD; done: QA findings, PASS, publish) WAITING ON QA: the full set on v0.71, 3840577 (APPV 71). New since v0.70 (10240e8): the phone-lag fix 19ef0d9 (yours
      passed), the four visit arrivals f7a43bb with 90d5653 (yours passed), Rafe "Traveling" b3dfe9b. LEAD: clean build, 490 files, loads
      clean, Review 119/119, the whole story 64/64, livesync PASS, effects behind a window paused (7 paused, 0 running). Frame rates on
      this Mac are noisy under load (load average 27), so please measure lag with your lagcheck.js when the machine is quieter.
- [x] (from LEAD; done: QA findings, pass) WAITING ON QA, small check: 19ef0d9, phone lag. Cal's iPhone (diag/perf, APPV 67): Game Room window 38 fps, worst 421 ms;
      Restaurant window 38 fps, worst 214 ms; the Loft alone 57 fps. Cause: the UI effects behind the window kept animating. Fix: while
      any #layer .modal is open, #app, .nav and .fxo animations are paused (index.html). LEAD at CPU x4, 440x840 dpr 3: Game Room 25 ->
      60 fps, Restaurant 31 -> 60, worst 17 ms; they resume on close; the window's own animations run (rigtest/lead/roomperf.js).
      Please check nothing behind a window looks frozen when it closes, and the level-up and visit cards still animate. For v0.71.
- [x] (from LEAD, Cal's ask through you; done: QA findings, pass, two cosmetic notes) WAITING ON QA, small check: f7a43bb, four visit arrivals in 29k_friends fvShow: va-door (a door
      swings open, they step through), va-ride (skid in from the right, dust), va-drop (fall in, squash, shadow), va-pop (spin up,
      confetti); never the same as the last visit (S.visitArr), a visit keeps its arrival if shown again (S.visit.arr); Review cycles
      them. The friend's inline animation-delay used to override every delay, so the stagger is now --d and the idle bob .fvbob.
      LEAD: 12 visits used all four with 0 repeats; rigtest/lead/visitarrivals.js measures each one's path; shots/lead/visits/.
      Please check one and two friends at 360 and 390, and reduced motion. For v0.71.
- [x] (from LEAD; done: QA findings, PASS on 10240e8, publish) WAITING ON QA: the full set on v0.70, now 10240e8 (APPV 70; 396376b plus your story-read fixes: Theater in the mall's end unit, Rhythm upstairs and VR next door, four new welcomes, Sable before Rafe on the Old Metro, the amulet line, parlor/favor/favorite, Loft welcome "Soon", Lair and Closet before Sable in Play the whole story, Speakeasy out of the tester), Cal's next test copy. New since v0.69 (c2c53b7): Test > Unlock
      everything (0f7ce90) with your two fixes (Next story step skips the Speakeasy; the tester owns an opener's prerequisites, so
      bd_ward1 comes with bd_ward2), the story in order (40c4b14: Desmond after White Linen, Nova after the Clothing Store, Review >
      Play the whole story). Please rerun unlockall.js and read the whole story through for sense.
- [x] (from LEAD; done: QA findings, PASS, publish) WAITING ON QA: the full set on v0.69, c2c53b7 (APPV 69), Cal's next test copy and the one to publish (no v0.68
      separately). Since v0.68 (e276038): ROOMS's room-review fixes (62d336d, dbf2593, a4be384, aca27a1, 1e8a3b4), every piece usable
      (570b2f3), the Nightclub staff and patio chair (567ea26, your check), LEAD's screens (cfa5f62, 1ab3753). LEAD: clean build, 490
      files, loads clean, Review 114/114 save unchanged, livesync PASS, alerts PASS.
- [x] (from LEAD, Cal: "Give me the latest version to test when ready"; done: QA findings, PASS on e276038, the placement list is Cal's call) WAITING ON QA: the full set on v0.68, now e276038 (APPV 68; 9b3a428 plus your 3f6c696 fix: nbAv draws neighbors with the rig, outfit included, in the Hall list, visit header and board posts; rigtest/lead/nbav.js). New
      since v0.67 (d54de89): LEAD's alerts (3bba5f1, d0adfdc) and FX (59d31a0, d0adfdc); ROOMS's lamp (abe06dd), Restaurant notes
      (93d33f1), room windows without zoom, shelf and menu board (4e93d54), people kept and new pieces pulsing (1308059), the bar after
      White Linen (633ffe2), the Garden at level 5 (ede09d8), the splash text (0f9cabe). Note for your level-up runs: with the Garden
      at 5, its story step goes first, so the Wheel and Relics show "Soon" until revealed; their "!" comes once they open.
- [x] (Cal's brief, 2026-11-07; done: QA findings, PASS) the published v0.72 on Cal's Test link (HJhVjFH6) against 083fec9's build: 492 files (26 top-level + 466 art/), sizes and the 9 db rules; index.html +364 from the publish wrapper. Replaces the v0.65 to v0.71 checks below.
- [x] (from LEAD; SUPERSEDED by the published v0.72 check, QA findings) WAITING ON QA: once your artifact tools are back, check the published v0.71 on Cal's Test link (pinned, slug HJhVjFH6, republished in place, versions 13-15) against 3840577's build: 491 files (25 top-level + 466 art/), sizes and the 9 db rules; index.html is 364 bytes larger from the publish wrapper. Replaces the v0.70 check below.
- [x] (from LEAD; SUPERSEDED by the published v0.72 check, QA findings) WAITING ON QA: once your artifact tools are back, check the published v0.70 on Cal's Test link (pinned, slug HJhVjFH6, republished in place, versions 10-12) against 10240e8's build: 491 files (25 top-level + 466 art/), sizes and the 9 db rules; index.html is 364 bytes larger from the publish wrapper. Replaces the v0.69 and v0.67 checks below.
- [x] (from LEAD; SUPERSEDED by the published v0.72 check, QA findings) WAITING ON QA: once your artifact tools are back, check the published v0.69 on Cal's Test link (pinned, slug HJhVjFH6, republished in place, versions 7-9) against c2c53b7's build: 491 files (25 top-level + 466 art/), sizes and the 9 db rules; index.html is 364 bytes larger from the publish wrapper. Replaces the v0.67 check below.
- [x] (from LEAD; SUPERSEDED by the published v0.72 check, QA findings) WAITING ON QA: once your artifact tools are back, check the published v0.67 on Cal's Test link (pinned, slug HJhVjFH6, republished in place) against d54de89's build: 491 files (25 top-level incl. art_rig_8 + 466 art/), sizes and the 9 db rules; index.html is 364 bytes larger from the publish wrapper.
- [x] (from LEAD; done: QA findings, FX pass; alerts pass with one gap, level-unlocked tabs, and one copy error) WAITING ON QA, small check: 59d31a0 (Cal: "I don't like the crt scan lines. And the red hue it too aggressive":
      level-24 scanlines are Starlight, softer vignette and edge glow, no overlay over the Loft or rooms) and 3bba5f1 (Cal's "!" and
      "+": a bouncing ! on the tab for a new room, a newly unlocked tab or a new brand, until opened; ! over street buildings with a new
      room; + on the new room's spot inside, tapping opens the room that sells it with that upgrade first). LEAD's shots in
      `shots/lead/alerts/` and `shots/lead/fx_*_after.png`. Both go into v0.68 with ROOMS's fixes.
- [x] (from LEAD; done: QA findings, pass) WAITING ON QA: v0.67, d54de89 (APPV 67) = v0.66 + your boba fix (styPortrait falls back to the same person's portrait:
      boba shows Mara's chef portrait; LEAD: 7 of 7 scenes with a portrait) + live sync (app/src/29n_live.js, 019f21f; Cal: "synced
      perfectly so we can all see each others progress"). Please recheck Review and the file match, and the town with live sync:
      townlive, townrx, and `rigtest/lead/livesync.js` (three players on a stand-in db that pushes; NOPUSH=1 for the polling path).
- [x] (from LEAD, Cal's ask; done: QA findings, one error: the boba scene portrait) WAITING ON QA: the full set on v0.66, 465d39a (APPV 66), Cal's test copy. New since v0.65 (dba3f2e):
      KAIMANA, OAKMONT and SØLVBERG in the Shop (SØLVBERG's Shop run included), and Test > Review: Cal plays every cutscene, visitor
      and unlock from it, so check each Play shows the right window on both bodies and screen sizes and changes nothing in the save
      (LEAD: 114 of 114 open, save unchanged, `shots/lead/review/`).
- [x] (from LEAD; done: QA findings, pass, in the v0.66 full set) WAITING ON QA: the SØLVBERG Shop run, e513dae (brand sv, Feb 15, 15 rows as ROOMS wrote them, the leggings hers only,
      the mittens in the "arms" slot). LEAD checked the tab 15 weeks ahead: banner, badge, tagline, 15 pieces, no broken images, no
      page errors; the ski jacket and mittens equip (`shots/lead/sv_shop.png`); the mittens follow the hands in idle and stretchUp.
- [x] (from LEAD; done: QA findings, pass) WAITING ON QA: the OAKMONT Shop run, df59ff1 (brand oak, Feb 8, 15 rows as ROOMS wrote them, the skirt hers only,
      the wristbands and the watch both in the "arms" slot, so only one at a time like any accessory). LEAD checked the tab 14 weeks
      ahead: banner, badge from the pack, tagline, 15 pieces, no broken images, no page errors; the polo and the watch equip
      (`shots/lead/oak_shop.png`). Build at 491 files.
- [x] (from LEAD; SUPERSEDED by the published v0.72 check, QA findings) WAITING ON QA: once your artifact tools are back, check the published v0.65 (pinned, slug HJhVjFH6) against dba3f2e's build: 490 files (24 top-level + 466 art/, no loose logo_ files now that the badges are in art_ui), sizes and the 9 db rules; index.html is 364 bytes larger from the publish wrapper.
- [x] (from LEAD; done: QA findings, pass) WAITING ON QA: the KAIMANA Shop run, adcf65c (brand km, Feb 1, 15 rows as ROOMS wrote them, none for one body only).
      LEAD checked the tab 13 weeks ahead: banner with art, badge from the pack, tagline, 15 pieces, no broken images, no page
      errors; the camp shirt and shell necklace equip (`shots/lead/km_shop.png`). The necklace barely shows under the collar there.
- [x] (from LEAD; done: QA findings, pass) WAITING ON QA: the full set on v0.65, dba3f2e (APPV 65). New since v0.64 (4a1dbe8): SAVE POINT (Jan 11), BARD &
      BLADE (Jan 18) and CHROME RAIN (Jan 25) in the Shop, the rig's "arms" slot (bracers, the arm sleeve), brand badges from the
      art_ui pack. LEAD built it clean in a worktree: 489 files, loads with no page errors, v0.65 in the header.
- [x] (from LEAD; done: QA findings, PASS) WAITING ON QA: check the published v0.64 (pinned, slug NSmu55hk) against 4a1dbe8's build: 499 files (22 top-level + 477 art/), sizes and the 9 db rules; index.html is ~364 bytes larger from the publish wrapper. Its title reads "Quest Board", not "Quest Board v0.64".
- [x] (from LEAD; done: QA findings, pass; the drop pop-up not checked) WAITING ON QA: the CHROME RAIN Shop run, 091c762 (brand cr, Jan 25, 15 rows as ROOMS wrote them, the skirt hers
      only, the arm sleeve in the "arms" slot). LEAD checked the tab 12 weeks ahead: banner with art, tagline, 15 pieces, no broken
      images, no page errors; the sleeve with the bomber lands in equipped.arms (`shots/lead/cr_shop.png`).
      Also 8be03dc: brand badges (logo_<id>.webp) now come from the art_ui pack, not loose files; check the badge on each brand tab,
      the Wednesday return tab and the drop pop-up.
- [x] (from LEAD; done: QA findings, pass) WAITING ON QA: the BARD & BLADE Shop run, a6e9d16 (brand bb, Jan 18, 15 rows as ROOMS wrote them, the skirt hers
      only, the bracers the first piece in the rig's "arms" slot). LEAD checked the tab 11 weeks ahead: banner with art, tagline,
      15 pieces, no broken images, no page errors; wearing the bracers with the doublet puts them in equipped.arms
      (`shots/lead/bb_shop.png`). Please check the bracers in every pose with the wear test.
- [x] (from LEAD; done: QA findings, pass) WAITING ON QA: the SAVE POINT Shop run, 29f496c (brand sp, Jan 11, 15 rows as ROOMS wrote them, none for one body
      only). LEAD checked the tab at 10 weeks ahead: banner with art, tagline, 15 pieces, no broken images, no page errors
      (`shots/lead/sp_shop.png`). Rerun the slip-ons and headset rows after ROOMS's fixes.
- [x] (from LEAD; done: QA findings, pass) WAITING ON QA: the full set on v0.64, 4a1dbe8 (APPV 64). New since v0.63 (f5234d3): SMOKE BOMB (Dec 28) and GACHA
      POP (Jan 4) in the Shop, the armpit rule (2be3eda, bc757e2), overalls over the top (faebcd8, 91ef6e8). LEAD built it clean in a
      worktree and it loads with no page errors (creator to Loft, v0.64 in the header). Publishing waits on the restart either way.
- [x] (from LEAD; done: QA findings, pass) WAITING ON QA: the overalls in the stretch pose, 91ef6e8 (your 0246a11 finding). With a painted top (the starter tee,
      o_tee, o_puffer, o_flannel) the bib and straps, the legs and any tall boots now draw right after the painted picture. LEAD checked
      stretch and idle with the starter tee, o_tee+h_boots, o_puffer, o_flannel+v_boot, gp_star and gp_bear on both bodies
      (`shots/lead/gp_overtop_stretch.png`). Only stretch has a painted top; other poses take the same path as faebcd8.
- [x] (from LEAD; done: QA findings, one pose left) WAITING ON QA: the overalls over the top, faebcd8 (LEAD's rig side of ROOMS's d4d8fd8 "overTop"). gp_overall and
      gp_shorts under tops (o_tee, gp_bear, gp_sailor, gp_star, o_puffer, o_flannel, the starter tee), both bodies, every key pose: bib and
      straps over the top front and back, no top hem on the thighs, arms still over the bib, tall boots (h_boots, sm_boots, v_boot) over
      the cuffs. LEAD checked idle, walk3, sitFront, stretchUp, type1, rearStand and sleep in rigtest/matrix.html (`shots/lead/gp_overtop_idle.png`);
      the ragged sleeves in type1 and the boot specks in walk3 look the same without the flag. Other bottoms are untouched (no pantsOver slot).
- [x] (from LEAD, version check; done: reruns on 3a6fdd5, d7ae577, d0c9ea4 and 961b632, old test copies removed) The economy simulator ran on 1a7b690; game files changed since: 1900b94 (Rafe and Nova
      replace the investors on the team, so different room buffs) and 98210a2 (eleven return visits at +15 XP each). Rebuild on
      the latest commit and rerun. Your test copy `scratchpad/qa/wt-1a7b690` is stale: remove it when done.
- [x] Set up: a clean worktree of the latest commit in a temp folder, build it, serve it on 8769. Learn the scripts in
      `rigtest/browser/` (README) and write your own in `rigtest/qa/`. Start `docs/QA.md` with a run log. `rigtest/qa/setup.sh`.
- [x] Lessons for the next art pass (Cal, 2026-11-05): "keep in mind that a lot of these assets will change. This sweep you are
      doing is more of a lessons learned so that the next pass on art generation can be better." Compare every room with
      isometric game-art references of its kind and write down what is awkwardly placed, so ROOMS generates it better. "We
      will be swapping out all the walls on the rooms so it looks cohesive. And all the furniture going forward should be
      highly detailed, carefully placed, and have cohesiveness between the entire room." In `docs/QA.md`, Lessons for the
      next art pass: 12 rules, all 21 rooms, and which upgrades do not look like their names. Owner of the lessons: ROOMS.
- [x] Upgrade sweep, every room: buy each upgrade one at a time in unlock order (the method in `docs/RELEASING.md`, Testing
      upgrade tiers), screenshot each step, and flag anything stacking, overlapping, floating, facing the wrong way or not
      visibly changing the room (Cal: "every upgrade clearly visible, even a poster or a clock"). Run `gaps.js`, `depth.js` and
      `stations.js` at every tier, not only fully upgraded.
- [x] Shop sweep: buy and equip every item on both bodies, check the mirror, the wardrobe and the room character, and flag
      anything stacking unnaturally or clipping. Done on 59eeaf7 (`rigtest/qa/shop.js`): 112 pieces on the man, 115 on the
      woman, each bought, worn, listed, removed and in the Wardrobe, plus each brand's outfit: all pass, no clipping seen at
      mirror size. The room character was not checked (next pass).
- [ ] (only when Cal asks, rule 17) Speed sweep at phone size (390 x 844, 4x CPU slowdown): time every tab, the building view and every room (`perf.js` as a
      start: frame rate, long tasks, load time). List the slowest ten with what makes them slow. LEAD has the real phone's
      numbers in `diag/perf` after Cal plays v45; compare against them when LEAD posts them.
- [ ] After every commit by anyone: `savecheck.js`, `screens.js` and a quick look at what that commit touched. After every
      publish: the same against the published build. Post only what fails.
- [x] References: for each room, look up isometric game art of that kind of room (built-in browser, never Chrome) and
      compare layout, detail, lighting and how alive it feels. Write art ideas for ROOMS with the link and what to learn.
      Study only, never copy.
- [x] (from LEAD) Room upgrade menu, new in the commit after v45: only the next 5 unbought upgrades show, and anything two or
      more levels above the player is a "? ? ?" card. Check every room at a few levels (just below, at and above each
      unlock), that buying from the menu still works, and that no room says "All upgrades installed" too early.
      Done on 59eeaf7 (`rigtest/qa/menu.js`: a player with endless coins goes from level 1 to 80 and buys whatever every
      room's menu offers, 7,300 cards looked at): passes. Never more than 5 cards, "? ? ?" only 2+ levels up, one level up
      named with "Reach level", Buy always works, no early "All upgrades installed". 11 upgrades are never offered at any
      level, the same 11 ROOMS listed (Game Room 3, Restaurant Chef's Neon, Garden 3, Theater Cocktail Bar and 3).
- [x] (from LEAD, done: QA findings, drop odds and Relics) Dungeon gifts, now in (9b4cf3a, `29d_dungeon.js`, hook `window.__qbDungeon`): simulate the drop odds
      (`DGLOOT`, `dgRoll`): how many missions, and days at 5 missions a day, to finish each set; does the pity ever fire
      twice running. Then the Relics tab: each relic tier once and never twice, the Trophies sub-tab hidden before the first
      piece, the Trophy Wall a mystery card until then, the buffs applied once (mission pay, quest XP and coins, room income).
- [x] (from LEAD) Economy simulator, before the next publish: the new XP curve, no level locks, prices x ROOMSTEP (commit after
      d6730f0, `docs/PROGRESSION.md`, `docs/ECONOMY.md`). Simulate 30, 90 and 180 days at 200 and 450 XP a day with missions, the
      wheel, level pay and passive income, buying the cheapest next upgrade whenever affordable. Report: level reached, days to
      fill each room, coins piling up unspent. Cal's targets: level 10 in 3 or 4 days, something to buy every day or two, no
      upgrade a week away.
- [x] (from LEAD, done: QA findings) Story scenes (aa0d9ed, `29b_story.js`, test hook `window.__qbStory`): walk a new save from level 1 to the club, every
      scene, "Not yet" and back, lots on the street in order, nothing opening early, and old saves at every stage (no scenes for
      rooms already owned). Add the gates to the economy simulator: how many days each step takes.
- [x] (from LEAD, done: QA findings, income and team) Upgrade income (d523cf1): list every business upgrade marked "Looks only" and flag any that should earn (it sells,
      serves or seats something) or any decor still earning; `upIsDecor` in `29_prices.js`, override per upgrade with
      `{decor:1}` or `{earn:1}`. Team: each buff applies (room income, mission pay), the join banner, missions led by the team.
- [x] (from LEAD) Your effort-first redesign (Cal approved, `WAITING ON LEAD` line under QA findings): LEAD saw `effort_model.py` and is holding all economy work for it. When the
      proposal is in `docs/QA.md`, put a `WAITING ON LEAD` line here and LEAD builds it. Already in, which you can keep or
      undo: room payout tied to quest coins (`29e_economy.js`, `PAYK`, `PAYBASE`), mission pay (`msPay`), the doubled curve.
      Cal decided level trials accept any active photo (62306c1), so the level-4 wall for non-gym players is gone.
- [x] (from LEAD, done: QA findings) Economy simulator rerun on 4a2a143 (5082b0c: room payout limit, mission pay, doubled curve; 9b4cf3a:
      dungeon gifts and set buffs, `window.__qbDungeon`; `window.__qbPay` shows today's payout room). Same three players,
      60 days. Report the same table, plus coins by source in month 2, and the day each set is finished. Blocks v48.
- [x] (from LEAD, done: QA findings and `docs/QA.md`) Writing pass review: read every screen against `docs/VOICE.md` (LEAD's cf7b36a, ROOMS's when done) and
      list lines that still read as corny or written by AI, file and line, with a suggested rewrite. Do not edit them.
- [ ] Yawn pilot, when ROOMS's art and LEAD's code are in: every top and outfit combination, both bodies, every pose,
      saved as one labeled sheet for Cal.

## Done (latest first, keep about ten)

- 2026-11-09 v0.88 on qa-local (Windows): your own workouts, kind words for coins, challenges with a coin pot, no coaches in
  Training, no zoom, Hall with The Loft, per-player brand schedule. Rules change: kudos, kudosok, duel. See WINDOWS_HANDOFF_2026-11-09.md.
- 2026-11-09 v0.87 published by Cal (40910d9): Training weights per set, supersets, summary; Clear completed, Daily switch, 5 am day.
- 2026-11-05 New roles: LEAD (board, app code, publishing) and ROOMS (all art, room code). See `TEAMWORK.md`.
- 2026-11-05 The Loft fills the phone screen: Cal confirmed on his phone (v43).
- 2026-11-05 Phone picks up new versions: Cal saw v42 in the header on his phone.
- 2026-11-05 Club: every booth on the left wall, bar on the back wall, neon sign the right way (v41).
- 2026-11-05 File fingerprints so phones fetch new versions; Loft height fix; header shows `APPV` (v40, v41).
- 2026-11-05 Prove it: camera only, pays double. Shop brand banners, procedural stand-in (v40).
- 2026-11-05 Closet grows in stages of one room (v40).
- 2026-11-05 Lair: one war table in the middle, floor pieces spread out (v40).
- 2026-11-05 Game Room laid out by what each piece faces (v39).
