# Full QA pass (2026-11-09, sandbox build of qa-local 8d75dcb, phone viewport 390x844)

Method: a brand-new player on an empty save, played as a casual friend would, then each tab.
Legend: BUG = broken; UX = works but confusing/wordy; GOOD = works well. Each item: what, where, evidence.

Continued 11:38 in a new chat (52740f5b). The old chat froze every time it opened the browser panel, so this pass drives a
headless Chrome instead: qa/tools/q.js in that chat's folder (C:/Users/clvh/.copilot/chats/52740f5b-.../qa), Chrome on
port 9350 with iPhone emulation (390x844, DPR 2), build exported from 8d75dcb to qa/build and served on localhost:8770.
Screenshots: qa/out/*.png.

## Onboarding and first day
- GOOD Name screen and creator load with no page errors (01_first_open, 02_creator).
- BUG  Popup order after Begin: a random friend visit ("Someone pulled up: Ben ... planned a weekend trip to the mountains",
  +15% outside XP) shows FIRST, Cal's welcome note second (03_after_begin, 04_after_ben). A new player meets a stranger before
  being told what the app is. Welcome note should come first, and the first friend visit should wait until day 2 or later.
- BUG  Example quests are still Cal's own to-dos (P1 from the earlier review, not fixed in 8d75dcb): Feed dogs, Walk dogs,
  Unload car, Measure carpet, Put together couch, Clean studio, Edit car 360 vid, Edit EP 3, Film EP 4, Post 5 things on
  trial reels, Finish artist management platform. 25 quests in all; a friend has to delete most of them.
- BUG  Bottom bar: Shop and Dungeons show a lock with "LV 1" while the player is level 1. Cause: 10_app_a.js navHtml labels
  the lock with AREAS level (1), but areaGate (27_rooms.js:275) really gates them on the Closet / Lair rooms. The label should
  name the real requirement ("Closet") or use "Soon".
- UX   Two daily targets on the Board still: "TODAY 0/480" in the level card and "DAILY QUEST 0 / 150 XP" below.
- GOOD First quest (Make bed): +10 XP, +60 coins, "First Blood +250 coins" milestone toast. No errors.
- GOOD Level 2 after two quests; level-up card is clear (UI upgrade, +120 coins, stat bars).
- UX   Level 2 opens The Loft, but the level-up card does not say so, and right after closing it the bottom bar still reads
  "SOON / The Loft, opens at your next level-up" (stale until the next render). The Loft then opens on the 20 s timer with only
  a small toast. The first big unlock deserves the card. (S.unlockDay was already today when the level-up ran.)

## Change made during the pass: simpler Board (Cal, 11:44: "too many buttons and stuff to read ... I have to scroll down way too far")
Uncommitted in the main checkout (qa-local): app/index.html, 10_app_a.js, 29e_economy.js, 29f_bounty.js, 30_app_b.js.
- Board = top bar, one progress line ("Lv 2 | 20 / 150 XP today", "Reward ready" chip when one waits), a one-row "Add tasks"
  box, the categories, Bounties last. First task now at ~360 px (was ~1,900 px).
- Avatar (or the progress line) opens the profile: level card, Daily Quest (with "N XP left" and a plain sentence on what the
  goal buttons do), Weekly Warrior, class, Rewards (claim), Stats. render() refreshes an open profile.
- "Integrity" is now "Photo proof"; the hero's "Today x/480" removed (one daily target only).
- Bottom bar: Shop and Dungeons locks read "Closet" and "Lair" (were "Lv 1").
- Tested in the sandbox: goal change refreshes profile and Board line; Weekly Warrior link closes the profile and opens
  Training; checking a quest and the brain dump work; no page errors (20_board_new .. 23_after_add).
- Noticed: "Photo proof 100%" for a player with no big quests yet (integrity() is 1 with nothing to measure).

## Loft, Shop, Training, photo proof (day 1)
- GOOD Loft intro keeps the surprise (08_loft_first). Garden offered on the empty lot for 200 coins on day 1 at level 2 with
  491 coins in hand; builds with no errors (10_lot_tap, 11_garden_built).
- UX   Street view and building view open with the content in the bottom ~15-30% and sky above (09_loft_scene, 24_building).
- BUG  Bedroom says "Your private room. Nobody visits here." while a second character lies in the bed (25_bedroom); Ben's
  visit card had said he would hang out in the Bedroom.
- UX   Shop path: Closet needs Bed 150 -> Desk Chair 150 -> Ergo Chair 150 -> Racing Chair 150 -> Sleek Wardrobe 150 ->
  Walk-in Closet 600 (1,350 coins, fixed order, two offers at a time). Nothing in the Bedroom says this path opens the Shop.
  "need N more" labels on the offers go stale when coins change while the room is open.
- GOOD Closet card "The Closet is open ... it opens the Shop"; Shop opens; sale popup; try on -> Buy -> checkout ->
  Confirm: coins -450 exactly, item owned and worn (30_shop .. 33_bought).
- GOOD 2x dialog: "Verified +58 XP, +396 coins / No photo +29 XP, +198 coins", Open camera / Done without a photo / Cancel.
  No-photo pays as shown. Sandbox photo check (server unreachable): clear "Verification failed ... nothing was counted"
  popup with Try another photo / Done without a photo. The success path needs the live server: NOT checked here.
- DECIDE Weekly Warrior counts only photo-verified workouts (30_app_b.js toggle: actFlag only when mode "v"), so its
  +250 XP / +3,000 coins / prize is photo-only. Conflicts with "photos are a bonus, never a wall" unless intended.
- UX   The brain dump's "Sorted 2 tasks ..." line stays on the Board indefinitely.

## Levels and day 2
- GOOD Day 1: ten ordinary chores took a new player from level 1 to level 4; Daily Quest chest (+250) and level bonuses fire.
- BUG  Bottom bar says "Hall, opens at your next level-up" at level 4, but below level 10 only one area opens per day
  (unlockSlotFree), and The Loft used day 1's slot: the next level-up that day does not open it. It opened on day 2, ~20 s
  after launch, with a toast only. Label should read "Opens tomorrow".
- GOOD Hall (day 2): Town Square, Town Hall post, Town Meter, Neighbors, Town Board render with no errors.
- UX   Neighbors "Visit" opens only a "Say hi" card (no place to look at).
- CHECK Town Meter shows "Riley +130 XP +2,993 coins" for "this week"; 2,000 of those were test coins added with the
  console, so the coin figure looks like the balance, not coins earned this week. Not confirmed in code.
- GOOD Level-5 gate on day 2 after 6 more chores: clear trial card with the honor path ("1 of 2 so far"); earliest level 5
  without a photo is day 3. Stored XP shown.
- UX   Trial card still mentions "a walk with the dogs" (personal); it is ~430 px tall above the tasks.

## Not checked in this pass
Class choice and tiers, Wheel (6), Relics (8), Dungeons/Lair, Garden growth and harvest, Restaurant and businesses,
missions, the photo-check success path, real multi-player Hall data, the Live (noTest) build, the unfinished Town Hall
Posts/Chat/Style and challenges branches.

## Fixed after the first pass (qa-local 72141dc, c716794, 39cbdd1, v0.83 baf14cc)
- Example quests removed (new board = Workout only); creator's Blank/Example choice gone.
- Visitors: none before the welcome note and The Loft, none on the day it opens, then <= ~1 day in 3 with 3+ days between
  visits; never in the Bedroom (needs its own room or a Lounge); dog visits need the dog adopted. Verified with the test clock:
  day 1 none, day 2 Logan in the Game Room, day 3 none.
- Friend tags and visit texts made vague (no relationships, jobs, specific trips).
- Edit / Done toggle above the quests; the delete x shows only while editing.
- Photo check: sandbox stand-in (about 6 s; a nearly black photo fails). Verified: window closes at once, quest shows
  "checking photo", switching tabs works, success popup with the quest's own XP/coins, failure popup with retry/no-photo.
- Offline brain dump splits comma lists; "opens tomorrow" when today's unlock is used; trial card text no longer mentions dogs.
- Town Hall Posts | Chat | Style merged, rooms named Room 1 / Room 2 / Room 3 (agent tests: chat 39/39, style 20/20, tabs 15/15).
- From the sweep: profile fits 390 px; "Choose your class" has no X (closing it left the player stuck); a waiting save runs on
  pagehide / hidden (instant reload after a quest kept it).

## Second sweep (QA_SWEEP.md): still open
- BUG ~17 MB before the first draw (blobs.js 14.8 MB); Board usable after ~15 s on 10 Mbit/s cold.
- BUG two tabs / devices: last save wins (an older tab erased 10,000 coins). The earlier review's D1-D3 patches target this.
- UX bottom tabs 36 px wide, icon only; dungeon card shows the full coin range but pays at town efficiency; selling produce
  empties the pantry and turns off the Restaurant's +15% silently; Loft "329 / hr" ignores today's cap; header coins stale
  after a level-up until a tab change; ~560 unexplained coins during one Wheel spin (not traced).

## v0.84 (17060e2, 5c7caa5, 2dd5397)
- No 2x button. A tap on a quest that suits a photo (canProve: AI mark, else Workout, real-world 25+ XP, creative/boss 50+ XP;
  never admin/people or emails, texts, calls, payments, bookings, posting) opens "Quest done? Double it". Verified: email,
  brush teeth, call mom, tax return check off at once; laundry, deep clean, edit video, Workout open the popup.
- Garden needs 4 Loft rooms (Bedroom counts), then a 2-line "new hobby" scene with the player's portrait; earlier unbuilt
  offers are taken back. Verified on a new save: no offer at level 2 with 20,000 coins; scene after Bedroom + Closet + Game
  Room + Patio; "Check out the lot" offers the lot.
- Game Room upgrade hidden until the Walk-in Closet (verified: offered right after bd_ward2). The Wardrobe -> Closet path is now
  offered from the start (the Game Room no longer takes an offer slot).
