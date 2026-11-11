# SPEC 6 for LEAD (from ARCHITECT, Cal 2026-11-10 ~10:45): release plan, relic list approved, side-quests photo-only, Night watch selfie + server time

Cal's words in quotes.

## 0. Release plan
Cal: "I will wait for everything and ship it as v 0.90". No v0.89 release: one v0.90 zip. ARCHITECT asked Cal whether "everything"
means up to the economy (rc-0.89 + drops + chests + w-econ) or also the later branches (Rafe, side-quests, photo feed, Gym Pact,
colors); until he answers, plan v0.90 = rc-0.89 + w-drops + w-chests + w-econ. The save-safety rules from the 10:27 item still hold.

## 1. Relic list (Cal: "approve relic list")
Replaces w-chests' placeholder relics. Buffs are starting values in ECON; the borders and odds as SPEC3/SPEC4. Original designs.
Clusters below are the quest groups (cl_home, cl_body, cl_admin, cl_social, cl_create, cl_reset, cl_out, cl_boss).

Low, bronze, household heirlooms: +0.5% XP on one quest group
- Brass Key Ring (home), Worn Trail Compass (out), Ink-Stained Pen (admin), Chipped Tea Cup (reset), Braided Leash Charm (pet quests,
  else home), Pocket Whetstone (body), Grandmother's Thimble (create), Old Library Card (admin), Paper Recipe Card (home, cooking),
  Wooden Laundry Peg (home), Brass Doorbell (social), Dented Lunch Tin (body)
Mid, silver, fantasy/dungeon/anime/otherworld: +1% XP on one group or +2% income in one business
- Moth-Wing Lantern (+1% crawl rare-find chance), Tidecaller's Shell (+2% Garden produce), Ronin's Broken Hilt (+1% Training XP),
  Inkwell of Quiet Hours (+1% admin XP), Fox Spirit Bell (+2% Boba and Dessert income), Wraithglass Monocle (+1% social XP),
  Ember Fox Charm (+1% create XP), Tidebound Hourglass (+1% reset XP)
High, gold: a small rule-bender
- Starforged Compass (crawls come home 10% sooner), Phoenix Ash Vial (one free streak freeze a month), Mirror of the Second Self
  (+5% XP on the first 3 quests each day), Clockwork Familiar (+5% coins from Daily Quest chests), Oathbound Gauntlet (+3% workout
  XP), Codex of Ashen Stars (+3% admin and create XP)
Legendary, white and purple with wings: only from Rafe's hunts, each stronger than the last
- L27 Sunken Crown of Aldrath (+2% all XP); L52 Wyrmheart Ember (+3% all XP, +5% business income); L77 Veil of the Thousand Doors
  (+4% all XP, +1 crawl a day); L93 The Worldseed (+5% all XP, every Room Bonus x1.25)
- Tier set bonus: owning every relic of a tier: +1% all XP (low), +1.5% (mid), +2% (high).
- Relic XP buffs sit in their own pool; econsim includes them (w-econ's curve targets hold with them).
- Mac art note: one 256x256 icon per relic (30), painted game style, no text; the border is drawn in code.

## 2. Side-quests: photo only
Cal: "photo only like rafe". No honor path for any side-quest (replaces SPEC4/SPEC5's fallback).

## 3. Night watch: a photo of you in bed, timed by the server (10:55 amendment REVERSED at 11:00)
Cal: "night watch is good by snapping a picture of you in bed. Can't these pictures use AI to check the real time?" Then, after a
brief detour: "forget that. I did not read the server clock portion. That sounds great."
- The photo: the player in bed (a selfie in bed, lights low), fresh camera photo. The AI check: a person in a bed, night-time setting.
- Time: the photo check runs in the Firebase function (functions/index.js), whose clock the player cannot change. The function
  returns its own time with the verdict; the night counts only if that server time is before midnight on the game clock (Pacific)
  and the photo's EXIF time (when present; iOS may strip it) is within 30 minutes of it. Today EXIF is compared with the phone's
  clock (30_app_b.js:1533-1536).
- Use the server time for every timed photo check (Rafe, side-quests, trials). Show it as a small stamp on the photo ("11:42 pm")
  in the check, Sable's scene and on the board.
- 3 nights in a row; reward: Sable finds a hidden dungeon (else +1 crawl a day for a week), as SPEC5.
- v0.90 scope CONFIRMED by Cal: A (rc-0.89 + w-drops + w-chests + w-econ).

## Acceptance checks
- The 30 relics show with the right tier borders; buffs apply and total as listed; tier set bonus on the last one of a tier.
- Night watch: in-bed photo at 11:30 pm passes with the stamp; at 12:10 am fails; phone clock moved back an hour still fails;
  no person/bed fails.
- No honor button on any side-quest.

## 4. A visible time stamp on every proof photo (Cal, 11:05)
Cal: "the photo should all get a visible time stamp so that the AI knows when it was taken. This avoids all photo related issues later
on. Add the time stamp into a corner and make it my SAYMORE color scheme of neon orange or neon cyan".
- Burned into the image (canvas) when the in-app camera returns, before the AI check; kept on the stored and posted photo. Every
  proof photo (quests, workouts, trials, Rafe, side-quests, board posts).
- Bottom-right, small, "NOV 10  11:42 PM", wide uppercase. Neon orange #ff7a18 with a pulse cyan #17d4e6 glow (SAYMORE palette,
  docs/BRANDS_15.md:153); cyan text if the corner is orange-heavy; a thin dark shadow so it reads on any photo.
- The stamp is the phone's time; the server clock stays the real check. The AI fails a photo whose stamp is missing or far from the
  server time.
- Checks: stamp visible on a dark, a bright and an orange photo; AI verdict mentions the stamp; posted photo keeps it.
