# SPEC 9 for LEAD (from ARCHITECT, Cal 2026-11-10 ~13:50): NO SPOILERS, a full text pass

Cal: "i don't like 'then the mall'. Scrub the entire game for spoilers like this".
Rule (also for docs/VOICE.md): never name or describe a room, building, character, feature/tab, dungeon, relic set, brand or upgrade
the player does not have yet. Say what to DO and show progress; at most "Something new is waiting".
Sweep: read-only, qa-local a28dce6 (w-econ2 and w-polish merged) + w-update. Lines spot-checked by ARCHITECT: 27b_skins.js:114/142,
26_world.js:463, 30_app_b.js:1877, 29c_team.js:10. Not checked: text painted in art, visiting a friend's Loft (shows their rooms, by
design), test-only tools.

## HIGH (fix all)
Room windows, "? ? ?" mystery cards still print the story "why" line (30_app_b.js:71, 29b_story.js:114, lines 16-55):
- Boba window: "...the space upstairs can become a dessert parlor."  Arcade window: "...a rhythm floor", "...a VR arena".
  Mall window: "...the mall can open karaoke."  Lock and Key (Live): "The Calibur Mall is still being fitted out..." (29b_story.js:104).
  -> Fix: mystery cards show NO why line, only "A mystery upgrade" + what to do. (Arcade/bowling are already hidden: do the same for all.)
- Restaurant window, r_bar card: W25 trigger text names the previous room even when not open ("After the Dessert Parlor opens",
  "...coins earned since the Dessert Parlor opened", 29b_story.js:98-99) and the Noir line. -> Fix: triggers show only rooms the
  player has; SPEC8 replaces these triggers anyway (Lock and Key now after Noir only).
Help and splashes:
- 27b_skins.js:114 Boba help "Later, a dessert parlor opens right above this."  27b_skins.js:142 Arcade help "Two more rooms: A Rhythm
  Room upstairs, and a VR Arena next door."  26_world.js:463 r_x2 splash "...once it looks the part, the bar upstairs." -> cut those
  sentences.
Team and relics:
- 29c_team.js:10 Mara "Restaurant, Boba and Dessert earn 15% more"; 29c_team.js:13 Rafe "Lock and Key and the Rooftop earn 15% more".
  -> Show only rooms the player has ("Your restaurants earn 15% more"; list grows as rooms open).
- Relic r2_foxbell "+2% Boba Shop and Dessert Parlor income" can drop at any level (29e_economy.js:35, 29y_free.js:81). -> Generic text
  until owned ("+2% income in two businesses"), or reroll a relic whose rooms the player lacks.
Nav and Crawls:
- 10_app_a.js:819 locked Crawls tab shows "Lair", aria "opens with the Hero's Lair"; 30_app_b.js:1877 "Find the Hero's Lair to open
  Dungeon Crawls". The Lair is a secret "???" upgrade. -> Hide the Crawls tab entirely until the Lair exists (same for any tab whose
  key is a secret).
- 10_app_a.js:618-623 Dungeon list shows the next two locked dungeons by name, tagline and loot. -> Show "? ? ?" with only "Level N".

## MED (fix)
- 27_rooms.js:209 Lock and Key help "The stairs at the back lead to the roof."; 25_splash.js:8 Restaurant help "...Mara will have an
  idea." (fine only if Mara is known; she is by then, check); 25_splash.js:10 Theater help "The Auditorium opens once..."; 23_theater.js:4
  Theater description "...the auditorium behind those doors"; 23_theater.js:180 "Closed until the Auditorium opens... Open it from the
  upgrades below" (also WRONG: it opens via the story); 30_app_b.js:1883 and :228 Auditorium hints. -> "Behind these doors: not yet."
- Lock and Key why "regulars keep asking about the roof"; Dessert "Coming next" Noir line. -> no names.
- 10_app_a.js:819 next locked tab shows its name and "Lv N" (Wheel at 6, Relics at 8). -> Cal to decide; ARCHITECT suggests "? Lv N".
- 15_shop.js:330 Shop header "<next brand> drops in 3d". -> "New brand in 3d" (no name).
- 29y_free.js:115 locked legendary cards "Found on treasure hunts" (feature not built). -> "?".
- w-update 29x_inbox.js roadmap letter "A new building in town..." and the v0.90 patch letter listing tabs a new player has not
  reached: Cal approved those letters; keep them vague, ARCHITECT flags only.

## LOW (leave, or tidy in W10)
Theater basics line, "customers start asking for drinks", Garden "Someone in the neighborhood is paying attention" (good), Auditorium
"one day, an IMAX screen", Mall "the Mall grows", Closet "There may be a secret door" (intended tease), Conservatory "The Restaurant
earns more", Nova's buff, Crawls intro list, Trophy Room card, level-up "N earlier unlocks waiting in The Loft", the next two real-life
rewards (the player's own goals), welcome letter, class picker path names (intended).

## Already spoiler-free (keep)
"? ? ?" / "A mystery upgrade" / "Buy one above to reveal it"; hidden arcade/bowling cards; "Level N+1: ???"; sealed rewards; Shop
"Sealed / Restocks at level N"; secret "???" upgrades; Garden selling hidden until produce; Trophies tab hidden until the first piece;
locked relics "?"; the street draws only owned buildings and open lots; doors only to built rooms; story scenes gated.

## Acceptance
QA plays a fresh save to the Mall (sandbox fast-forward) and screenshots every room window, help, splash, tab, team card, relic and
Crawls list at each step: no name or description of anything not yet owned. Grep check: no why line rendered on a mystery card.
