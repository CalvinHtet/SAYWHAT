# SAYWHAT QA sweep (sandbox build of qa-local 135a037, v0.82)
Tester: QA agent, 2026-11-09. Headless Chrome 157, iPhone emulation 390x844 @2x, local perl server (no gzip, localhost).
Screenshots in qa/sweep/out/. Format: TYPE - what - where - evidence.

## 8. Load cost
- BUG (perf) - Before the game draws, the loader fetches index.html (166 KB) + 12 scripts = ~17.3 MB raw. blobs.js alone is 14.76 MB (base64 webp data URIs, gzip -9 only gets it to 10.9 MB because webp is already compressed). Gzipped total of the blocking set is ~11.8 MB. app.js 1.33 MB (461 KB gz), firestore 569 KB, qbdata 199 KB. - app/loader.html (all F entries must land before done()), build_web.sh SCRIPTS list - Evidence: performance resource list on cold load: 17 requests, 17,171,073 bytes transferred. On localhost, cold load to first UI = ~1.1 s (loadEventEnd 1070 ms), but on a phone at 10 Mbit/s the blobs.js alone is ~9-12 s, at 3-5 Mbit/s 20-40 s. lfvar.json (3.8 MB, 2.9 MB gz) is NOT in the blocking set (good).
- UX (minor) - Loader screen label reads "Quest Board", not SAYWHAT - app/loader.html line 2 (`<div class="label">Quest Board</div>`).

## 1. Trial and class choice
- GOOD - Honor path works: reached the level-5 gate (stored XP shown as +29), day 1 with 50+ XP counted "1 of 2" within 4 s; after a +1 day clock shift and 50+ XP more, the gate cleared on its own (gates [5], level 5, stored XP released). Evidence 02_gate.png, 03_trialpass.png.
- BUG (high) - Tapping the X on the "Choose your class" popup (every modal() gets an X, 30_app_b.js:1185) removes it without resetting `picking` (10_app_a.js:388-399, pickModal has no close handler). Result: no class, no "Advancement complete" popup (its callback `next` is never called, so levelUp() for the released XP is skipped too), and qbDbg.pickClass() returns without showing anything until the page is reloaded. Profile only says "At level 5 you ... choose a class" with no button. Same pattern for pickSpec (level 20) and pickOath (level 80). Evidence: 04_profile_nocls.png; S.cls="" with S.gates=[5]; pickClass() opens 0 modals.
- BUG (medium) - After a reload the class picker does come back (checkPending, 10_app_a.js:423) but its callback is only render/persist: the "Advancement complete" popup (tier, chapter, UI overhaul text) and the levelUp() celebration for the released XP never show for a player who hit X once. Evidence: chose Swiftblade after reload, 0 modals followed (07_advmodal.png).
- GOOD - Class picker: 3 choices from top stats, tapping each shows role + perk + signature text and previews the skin (html[data-cls]); "Choose Swiftblade" saved S.cls, header chip became "NOVICE SWIFTBLADE", profile shows "Novice Swiftblade - Tier 1 of 9 - Quick Loot - Next advancement at level 10". Choosing also paid +250 coins (a badge, I assume; not announced). Evidence 06_classinfo.png, 08_profile_cls.png.
- UX (low) - Header coin pill is stale after a level-up: levelUp() adds the level bonus and persists (30_app_b.js:1204) but does not re-render; header showed 1556 while S.coins was 2256 until I changed tab. Level bonus itself was exactly as shown (+700 at level 6).
- UX (info) - The Wheel did not open at level 6: areas are revealed one per day below level 10 (29h_unlocks.js). Nav shows "SOON" for it; tapping it does nothing visible.

## 2. Wheel, Relics, Dungeons, Missions (after Test > Unlock everything: level 50, +500k coins)
- GOOD - Wheel: one spin, landed "250 coins", wheel locks with "Come back tomorrow / Last result: 250 coins". Code pays exactly the label (10_app_a.js:497-502). Caveat: S.coins rose +810 during the 7 s spin, so ~560 coins came from something else at the same moment (a visitor popup "Rafe Calloway" also opened); I could not attribute it. Evidence 11_wheel.png, 12_wheel_after.png.
- UX (medium) - Popups stack on top of what you just opened: opening the Wheel tab showed a "NOW ON SALE / Y2K Thrift" shop popup first, and spinning triggered a visitor dialogue (Rafe, 1/2) over the result. On a phone, the reward moment gets covered.
- GOOD - Relics tab: display only (3 found, 15 more to discover, milestones chips). Nothing to use; layout clean (13_relics.png).
- GOOD - Missions: "Check the Old Metro" costs 50 energy, pays 198: energy 66 -> 16 exactly; after +35 min, "Collect +198 coins" paid exactly +198. Run counter "1 of 2 today". Sending an 80-energy job with 16 energy is refused with a clear toast "Needs 80 energy, you have 16. Every task XP point is one energy." Energy = today's task XP (66), not affected by the 6,000 XP from Unlock everything (correct per ECONOMY rule). Evidence 15_mission_sent.png, 16_mission_noenergy.png.
- UX (medium) - Dungeons: Mossy Cellar card advertises "40-70 coins", paid +34 (below the range) because the town ran at 58%. The popup explains it afterwards, but the card's range does not reflect the current effort %, so it reads like a short-pay. Suggest showing the scaled range ("20-41 coins at 58%"). Evidence 17_dungeon_in.png, 19_dungeon_return.png.
- UX (low) - While one delve runs, every other dungeon says "All delve slots busy." although "Delves today: 1/3" suggests 3 slots.

## 3. Garden
- GOOD - Sell: "Sell for 52 coins" with 13 produce paid exactly +52 (4 coins each). Hose & Watering Can: shown 150, took 150; growth went 1.7 -> 1.8/h (+6% as advertised). Watering: "damp for about 24 more hours" -> 18 after a 6 h shift. After +6 h: 5 produce ready, "Sell for 20 coins" (4 each, consistent). Evidence 22_garden.png, 23_garden_sold.png.
- UX (medium) - Selling produce also empties the Restaurant's pantry ("Pantry 13/30" -> "Pantry 0/30"), which switches off the Restaurant's +15% income. The Sell button doesn't warn about this. A casual player will sell and quietly lose the bonus.
- UX (low) - With 0 produce the button still reads "Sell for 0 coins" (active).
- UX (medium) - Loft header shows "329 / hr" but every business window says "Your businesses can pay out 53 more coins today" and the Collect button is 53: the daily payout cap (tied to the Daily Quest %) makes the per-hour figure misleading. Unchanged at 53 even after selling produce for 52 (so selling is outside the cap, or the line is stale; not resolved).

## 4. Restaurant / businesses
- GOOD - Restaurant upgrades one at a time: Open Sign 100/-100, Drip Coffee 150/-150, Breakfast Menu 150/-150, Gas Range 150/-150; each buy reveals the next offer (Potted Plants, Shelves & Pictures, Steel Prep Table). Kitchen text explains "runs at 58% today. Complete the Daily Quest for full speed." Evidence 24_restaurant.png.
- UX (low) - At level 50 the Restaurant still says "Next big step: Knock Through the Wall at level 12" (the level is long passed; it presumably needs more upgrades first, the text doesn't say which).

## 5. Loft rooms (Test > Rooms > View for each, then buy the first offer 3 times)
- GOOD - 19 rooms with upgrades opened and 57 purchases made (bedroom, closet, lair, patio, game room, garden, boba, dessert, Lock and Key, rooftop, mall, theater, auditorium, arcade, rhythm, VR, bowling, karaoke, nightclub, plus restaurant earlier). Every price shown = coins taken = S.spent increase, 0 mismatches; after each buy the next offers appeared (log: out/rooms_log.txt). No page errors. Room windows look clean at 390 px (room_*.png; sampled lair, trophy, theater, mall).
- UX (low) - Trophy Room has 0 upgrades and says "ALL UPGRADES INSTALLED" the first time you open it, which reads like a finished room rather than an empty one (room_trophy.png).

## 6. Save robustness
- GOOD - Normal reload keeps everything: coins 487060, spent 17250, xp 6460, class, 83 room upgrades, wheel day, clock shift all identical after reload. Pending choices come back after reload (the Path picker at level 20 appeared, Duelist chosen, header became STARBLADE). Evidence 25_pathpick.png.
- BUG (high) - Two tabs / two devices: last writer wins with the whole save. Tab A got +10,000 coins (saved: 497,620). Tab B, opened earlier and never refreshed, then ticked one quest; it wrote its whole stale state. Reloading tab A showed 488,320: A's 10,000 coins were gone, only B's quest stayed. persist() does a full db.doc(DOC).set(S) with no check of the stored savedAt (30_app_b.js:930-941). The only listener (qbWatchSave, 29_prices.js:45) watches appv, not newer saves. Real-world case: phone and laptop open, or an old PWA window resumed from the background, can roll back a day of progress.
- BUG (medium) - Actions inside the last ~350 ms before the page goes away are lost: persist() is debounced 350 ms (30_app_b.js:935) and nothing flushes on pagehide/visibilitychange-hidden. Test: bought "bd_chair1" (coins 487,620 -> 487,470), reloaded 150 ms later; after reload the coins were back at 487,620 and the chair was not owned. Same path for ticking a quest then swiping the app away. On iOS, timers freeze when backgrounded, so the window can be longer.

## 7. Tabs and profile at 390x844 (tools/tabs.sh, log out/tabs_log.txt, screenshots tab_*.png)
- GOOD - No page errors at any point in the session (q.js errs = [] after all tabs, rooms, reloads, two tabs). Board, Training, Loft, Shop, Hall, Relics, Wheel, Dungeons: nothing wider than the screen except intended horizontal strips (Shop tabs scroll: qs-tabs overflow-x auto) and decorative avatar crops in the Hall.
- BUG (medium) - Profile popup is wider than the phone: the card renders 405.6 px in a 390 px viewport, so the right edge of every card is clipped; at level 50 the close X sits at x 373-407, half off-screen. Seen at level 5 too (04_profile_nocls.png: right border missing, cards cut). Cause: .modal is display:grid with an implicit auto column (index.html:417), and .modal.profm (index.html:1388) does not constrain it; the column grows to 405.6 px. Likely fix: grid-template-columns:minmax(0,1fr) on .modal. Evidence tab_profile.png.
- UX (medium) - Bottom bar: 7 of 8 tab buttons are 36x52 px (below the ~44 px guideline) and show only an icon; labels appear only on the active tab. At level 1-6 locked tabs read "SOON", "LV 8", "LV 6", "LAIR" in tiny type (02_gate.png). Other small targets: quest delete "x" 35 px wide (right next to the "2x" button), profile "i" 36x36, Loft zoom +/-/target 38x38.
- UX (low) - Popups appear on their own when you open a tab (Shop sale popup over the Wheel, Loft welcome, visitors). Not errors, but on a phone the tab you tapped is hidden behind a popup.

## 8. Load cost, measured
- Throttled cold load (cache disabled, 10 Mbit/s, 60 ms latency): loader finished and Board usable at 15.0 s. Unthrottled localhost: ~1.1 s. Firebase Hosting gzip would bring the blocking set to ~11.8 MB, so roughly 10-11 s at 10 Mbit/s; 20-40 s on a weak 4G/3G link. blobs.js (14.76 MB) is ~85% of it.
- Note on the class-picker X bug: the skipped level bonus is not lost forever; levelUp() pays from S.lvPaid+1 (30_app_b.js:1203), so it arrives with the next level-up. What is lost: the class until reload, and the Advancement popup for good.

## Not checked
- Level 10 trial by honor (used Test > Level up / Unlock everything, which auto-pass trials); level 80 final-form pick; class perk math (Swiftblade +25% coins) not measured.
- Photo proof paths (cannot pass offline, as expected).
- Garden going dry (no growth while dry) and Sprinklers; Restaurant pantry drain over a full day; daily payout cap reset next day.
- Collect button on the Loft (COLLECT 53) and cap math; Boba/Dessert/other businesses beyond buying upgrades.
- Hall/friends features with real other players; Test tools themselves.
- Real iPhone Safari (only Chrome emulation); gzip/CDN timing (localhost server has no compression).
