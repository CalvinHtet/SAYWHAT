# Storyboard: the order things happen, and the order we build them

Cal, 2026-11-05: "From here on out, I want to reference LEAD's story board and work on things sequentially. The garden
comes before the restaurant so we should have done that first. Then someone comes in and offers an idea to be the chef in
our restaurant which is how the restaurant lot opens."

LEAD owns this page. Work follows it from top to bottom: ROOMS finishes a step's art, LEAD its text and code, QA checks it,
then the next step starts. The code that runs it is `29b_story.js` (`STORY`, `BEATS`); the numbers are in `ECON`
(`29e_economy.js`). Art for each step is listed in `docs/ART_SLOTS.md` (portraits, banners) and `data/rsart.json` (rooms).
Days are QA's 12-task player at the level-80 prices (470cbf7), from before the Garden moved after the patio (16e72c3); QA is rerunning them.
Cal, 2026-11-05: "the garden can be unlocked at lvl 5 and scale things up from there" (levels in `ECON.stepLv`, b1088f8); unlocks arrive one at a time along the way; several on the same day is fine now and then, not often and not early.

| # | Step | Opens when | Who | How it opens | Build status |
|---|---|---|---|---|---|
| 0 | The Loft: Bedroom, Closet, Patio, Game Room | from the start, by Bedroom upgrades | you | upgrades | built; Game Room fixes with QA |
| 1 | **The Garden** | level 5 | none | the empty lot next to your building goes up for sale; you buy it (its own lot) | **next**: painted shell, stages, produce stand (ROOMS); its text and sell flow (LEAD) |
| 2 | **Mara, and the Restaurant** | level 7 and 60 produce sold | Mara, chef | she has been buying your vegetables and offers to cook; her yes unlocks the Garden's expansion, Knock Through to a Restaurant (the Restaurant's own price) | scene written; Restaurant shells done, polish parked until the Garden is through |
| 3 | Boba shop | level 9, 80 dishes served (day 6) | Mara | the corner unit next door | room built; return visit "Your boba kid" |
| 4 | Dessert parlour | level 11, 4 Boba upgrades | none | upstairs from the Boba shop | room built |
| 5 | Lock and Key (speakeasy) | level 14, Dessert open, 25,000 coins earned in all (day 18) | Desmond Hale, investor | he funds the second floor; free, starts bare | scene written; room merge with ROOMS |
| 6 | Rafe joins the team | level 15, 3 Lock and Key upgrades | Rafe Calloway | a regular at the end of the bar | scene and banner done |
| 7 | Rooftop | level 17, 6 Lock and Key upgrades (day 24) | none | the regulars ask about the roof | room built |
| 8 | The Mall | level 20, Rooftop open, 80,000 coins earned (day 25) | Priya Okafor, investor | she offers the empty strip mall; you buy in | scene written; room built |
| 9 | Nova joins the team | level 21, 3 Mall upgrades | Nova Lin | filming a haul outside your clothing store | scene and banner done |
| 10 | Movie Theater | level 23, 4 Mall upgrades (day 26) | none | the lot next door | room built |
| 11 | Auditorium, Theo joins | level 25, 2 Theater upgrades | Theo, theater crew | the lobby has its basics and someone to run it; free | scene written; theater basics ids from ROOMS |
| 12 | Arcade | level 28, 3 Auditorium upgrades (day 30) | none | an upgrade in the mall | room built |
| 13 | Rhythm floor, VR arena | level 31, 4 Arcade upgrades | none | the arcade's back rooms | rooms built |
| 14 | Bowling | level 34, 6 Arcade upgrades (day 36) | none | league nights | room built |
| 15 | Karaoke | level 37, 6 Bowling upgrades (day 38) | none | after bowling everyone sings | room built |
| 16 | Nightclub | level 40, 6 Karaoke upgrades (day 39) | none | the last empty unit | room built |

Alongside, from the Loft:

| Step | Opens when | Status |
|---|---|---|
| Hero's Lair and the Dungeons tab | Closet upgrades (day 23) | built |
| Sable joins | the first mission home | built |
| Gifts, the Goblin King's Regalia and the Hollow Amulet | missions | built, art in |
| Trophy Room above the Lair | the first trophy piece | built (approval 16) |
| Relics | level 8 | built; relic icons wanted |

Later (`docs/PRESTIGE.md`): every upgrade bought around level 80, the ten-piece artifact from level 90, the portal at 100.

Return visits (one at most every 25 minutes, coins only): Mara three times, Desmond once, Rafe three times, Sable twice, Priya
once, Nova twice, Theo once. Each waits for its room or for the team member.
