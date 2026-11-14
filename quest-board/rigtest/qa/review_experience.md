# QA review: the first-time experience and the community (Cal, via LEAD, 2026-11-14)

This is a review, not a pass or fail. It was done on a clean sandbox build of 8f517af, whose app code is the same as live v1.00. I played it as a brand-new player at phone size (375x812): name, outfit, letter, Board, three tasks, level 2, the Loft, Town and Players. Then I moved the game clock forward through days 2, 3 and 4 of the calm week. A returning player was simulated with the v90_mid save (level 18) and the v90_adv save (level 60) (`midplayer.js`). Pictures are in `shots/qa/newplayer/`.

## Short answer

- **Is it overwhelming?** Not at first. Day 1 is calm, and the calm week rolls things out well: Daily Quest on day 2, Bounties on day 3, Training on day 4, each with one short tour.
- **Where it gets crowded:** level 2. It comes after only two ticked tasks, and it opens three tabs at once. In under five minutes a new player sits through about 9 windows and tours plus 4 reward toasts.
- **Where it stalls:** the first purchase screen shows "Not yet" before the things you can buy.
- **The words:** the copy is gamer talk ("hunter", "gates", "class", "Awakened", "Perks +25%", "+0.05% XP"). A non-gamer will skim past it.
- **Community:** not enough yet to bring people back. Town starts empty, and you can't see anyone's place (Cal dropped Loft visits because every Loft looked the same). A player card offers one like plus four emotes. None of it gives a reason to open the app to see someone else.

## Numbers from the run

- **Taps to the first finished quest:** 12, or 9 if you skip the tour. They are: name, Continue, Begin, Claim 3,000, close the letter, 4 tour steps, type in the task box, Add, tick.
- **Interruptions before the player is free on level 2:** the welcome letter, the Board tour (4 steps), the photo window, Level up, "You unlocked The Loft", the Welcome Home window, the Loft tour, the Town tour and the Players tour.
- **Toasts:** 4 (+XP/coins with "Perks +25%", Early Bird +250, First step +50 twice). They stack on top of the tab bar.
- **Board height:** about 1.3 screens on day 4 for a new player. About 2 screens for the level-18 and level-60 saves, with 8 sections: Next, Daily Quest, Wheel, Training, First steps, Add, the list, Bounties.
- **Page errors:** none in any run.

## What a new player gets stuck on (in order seen)

1. **Name screen.** "A new hunter awakens ... pass the gates, choose a class, and evolve." None of these words are explained, and nothing on the screen says this is a to-do app with a game on top.
2. **Coins and "Buy something to wear".** The letter's claim button stays on screen after claiming ("3,000 coins claimed") and you have to find the X. The Board's First steps already shows "Buy something to wear" ticked for a character who has bought nothing. The coin tour then says clothes come "once those open".
3. **The tour points at the hardest quest.** Step 2, "Do it, then tick it ... Tap the quest", rings the only quest on the Board: Workout, about 1 hour, 4 times a week, with live photo proof. The player hasn't added their own tasks yet (`04_tour_points_at_workout.jpg`).
4. **"Reply to emails" filed under Outside run.** After Add, the summary reads "Sorted 3 tasks worth 45 XP: 1 Outside run, 2 Home sweep. AI scoring was unavailable". "Reply to emails" was filed under OUTSIDE RUN. This is the sandbox's offline guess; the live AI scorer was not checked (`06_...`).
5. **The first tick.** A task showing 10 paid +13 XP and +60 coins, with "Perks +25%", then "Milestone reached: Early Bird +250 coins". It feels rewarding, but the numbers don't match the card and "Perks" is never explained.
6. **Level 2 after two tasks.** The Loft, Town and Players all open together. "You unlocked The Loft! Tap here" rings a tab that still shows "?" (`08_...`). The Loft tour then says "Tap a room to open it" while the screen shows a building and the hint says "tap a building".
7. **The Bedroom.** Under NEXT UPGRADES the first card is "COMING NEXT ? ? ? Not yet", dimmed. The three 300-coin items you can actually buy are below the fold. A player holding 3,900 coins reads "Not yet" and may close it (`09_...`). The stats read "Rested +0% XP ... +0.05% XP", numbers too small to mean anything.
8. **Town on day 1.** "No photos yet", "No posts yet". The Town meter shows only you, with "+1,121 coins" that isn't explained.
9. **Players.** "Wave, high five, poke or spank". This is fine between Cal and his girlfriend; it is Cal's call for anyone else he invites.
10. **Day 2 Daily Quest.** The goal is 100 XP, but a new player's list was 10 + 10 + 40 (one of them a 1-hour workout). With LEAD's new counting (689d212: 5-XP tasks count 60%, 10-XP tasks count 80%), three ordinary tasks reach about 45, so a new player may never open the first chest in week one.

## A player one or two weeks in

There was no real week-2 save, so I used the level-18 and level-60 saves. Each has only one quest left on its list, so the density of a full list was not measured.

- **On open:** 2 or 3 windows. Class Awakening ("Choose your class ... Your three strongest stats"), an inbox letter, then for the level-60 save the Boutique window and Rafe at the door.
- **The Board:** short and in a sensible order. The Next line ("You can afford an upgrade in the Bedroom. Open") makes the next step obvious.
- **Things competing every day:** the Daily Quest, the Weekly Quest line, the Wheel, Training, a Bounty, Fashion likes, side quests and the Loft. That is a lot of daily checklists for someone who came to tick dishes, but they are compact.
- **Odd:** both saves see "First steps 3 of 5: Add today's tasks / Show me" at level 18 and level 60.
- **Clutter:** four "!" badges at once (top right, avatar, Town tab, Players tab) and inbox 2. They stop meaning anything.

## Community: is there a reason to come back for other people?

**What exists:**
- Town: posts, chat with 3 rooms, photos, a shared weekly Town meter, coin challenges and Gym Pacts.
- Players: Fashion, Most rich and Highest level boards, 2 likes a day with a weekly prize, and live emotes.
- Visitors walking through your businesses and tipping.
- Kind-words notes to Cal for coins.
- Theo's movie night, a two-player side quest.

**What's missing:**
- **Nothing is posted for you.** Town only fills when someone types. For a group of 2 to 10 people it will mostly be empty. Automatic posts would give a feed every day without anyone writing: "Robin hit level 5", "Cynthia finished 4 workouts this week", "Jina opened the Restaurant", a verified photo. Each could take a one-tap reaction.
- **No way to see someone's place.** Visits were removed because every Loft looked the same. Now that rooms have styles, upgrades and businesses, a read-only look at a friend's Loft is the most natural reason to tap a name. The player card shows only an outfit, a like and emotes.
- **No shared goal for two people.** Challenges and pacts are bets, which is competitive. Cal and his girlfriend have nothing to build together: no couple quest, no shared room, no "we both did 3 chores today" streak. The Town meter is shared, but by everyone and quietly.
- **You can't tell when someone did something to you.** A like, high-five or challenge should be waiting the next time you open the app ("Cynthia high-fived you, liked your look"). Not checked whether one is.
- **Why people come back today:** their own tasks, the Loft and the weekly Fashion prize. The people part is a side room, not a pull.

## Ranked: what to fix first (owners in TASKS)

1. **Point the first tour at the player's own task, not the Workout** (LEAD). Either step 1 waits for Add, or the starter quest is a 5-minute task. This is the first real impression.
2. **Bedroom: buyable items first, "Coming next" last** (LEAD). Show numbers people understand ("+1 XP a task" or none) instead of "+0.05% XP".
3. **Spread level 2.** Open the Loft at level 2, Town at 3 and Players at 4, or wait a day each, like the calm week (LEAD). Draw the tab's icon before ringing it.
4. **Plain words at first contact** (LEAD for the copy, Cal to approve the tone). Name screen, "Awakened", "Perks", "Rested", the group names, Class Awakening.
5. **Community pull, one at a time** (Cal to choose, LEAD to build): (a) automatic Town posts for milestones and verified photos, with reactions; (b) a read-only look at a friend's Loft; (c) a shared couple or duo goal; (d) "while you were away" for likes, emotes and challenges.
6. **Daily Quest for new players** (LEAD, already on the DQ). Scale the first chest to the player's level or their list in week one, so day 2 isn't a bar they can't fill.
7. **Small fixes** (LEAD):
   - "Buy something to wear" ticked on a new character.
   - The letter's Claim button doesn't close the letter.
   - First steps on level-18 and level-60 saves.
   - Four "!" badges at once.
   - Toasts covering the tab bar.
   - "Reply to emails" filed under Outside run (check the live scorer).
8. **The spank emote** for anyone outside the couple (Cal's call).

## Not checked

- Real sign-in: the sandbox skips it.
- The live AI task scorer.
- A real camera.
- An iPhone in Safari: this was a desktop browser engine at phone size.
- Town and chat with real posts.
- Challenges, Gym Pacts and kind-words notes in action: only their screens and code were read.
- Whether likes or emotes from others show up later.
- Push notifications.
- A real week-2 save with a full task list.
- The sandbox's six neighbours are stand-ins. On live, the Players tab shows whoever really plays.
