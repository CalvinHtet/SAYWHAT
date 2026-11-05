# Progression plan (Cal, 2026-11-05)

Draft for Cal's go. What changes: levels come faster early and ramp to at most about three days each; room upgrades lose
their level locks; new rooms open through a story, not a level number; later rooms cost more because a player earns more by
then. Nothing a player already owns is ever taken away.

## Levels

XP to go from level L to L+1: `min(600, 50 + 6L + 0.2L²)`.

| Level | XP for that level | Day reached at 200 XP a day | Busy days (450 XP) |
|---|---|---|---|
| 5 | 77 | 1.3 | 0.6 |
| 10 | 120 | 3.9 | 1.7 |
| 20 | 236 | 12.9 | 5.7 |
| 30 | 392 | 28.9 | 12.8 |
| 40 | 588 | 53.7 | 23.9 |
| 50 | 600 | 83.7 | 37.2 |
| 100 | 600 | 233.7 | 103.9 |

A normal day of about a dozen tasks is 200 XP. Past level 40 a level is three normal days at most, or one busy day and a half.
Existing saves: XP stays as it is; anyone whose level would drop keeps their current level until the new curve catches up.

## Room upgrades

- No level locks. Each room shows its next 4 upgrades in order: 3 by name, the 4th as "? ? ?" until one is bought.
- Coins pace them. Prices rise along the story, because passive income and dungeons pay more by then. Base prices stay
  200 (small), 400 (normal), 800 (big), up to 4,000 for a moment that changes a room, times the room's step:

| Step | Rooms | Price x |
|---|---|---|
| Home | Bedroom, Closet, Lair, Patio, Game Room | 1 |
| 1 | Garden | 1 |
| 2 | Restaurant | 1.25 |
| 3 | Boba | 1.5 |
| 4 | Dessert parlour | 1.75 |
| 5 | Speakeasy, Upstairs Bar | 2 |
| 6 | Rooftop lounge | 2.5 |
| 7 | Strip mall | 3 |
| 8 | Theater, then Auditorium | 3.5 |
| 9 | Arcade (Rhythm, VR) | 4.5 |
| 10 | Bowling | 5 |
| 11 | Karaoke | 5.5 |
| 12 | Club | 6 |

QA simulates 30, 90 and 180 days of play to tune these so a room takes days, not weeks, to fill.

## The story that opens rooms

Each new room opens with a short scene (a card with a character), and most bring someone onto your team.

1. **Garden**: the first business, on the street lot of Kode Plaza. It grows produce you can sell.
2. **Restaurant**: once you have sold enough produce, someone wants to partner up and cook with it. Either a person you
   rescued on a dungeon mission, or a passer-by who loved your garden. They join your team.
3. **Boba shop**: once the restaurant has served enough dishes.
4. **Dessert parlour**: once the boba shop is doing well.
5. **The speakeasy upstairs** (one room: the Upstairs Bar and the Speakeasy become the same room, on the second floor above
   the restaurant; name to pick). A scene in the style of Dave the Diver: an investor walks into the restaurant, is impressed
   by how much it has earned and grown, and offers to turn the second floor into an upscale speakeasy with a live band and
   singers. Free, and it starts really bare.
6. **Rooftop lounge**: grows out of the speakeasy.
7. **Strip mall**: another investor loves your business model and wants to buy a small strip mall nearby with you. Bought
   with your own coins. It starts empty.
8. **Movie theater**, then the **Auditorium**. The auditorium opens free once the lobby has the basics: a ticket stand, a
   popcorn and soda machine, and an employee working it. From then on the lobby and the auditorium upgrade separately, and
   better things bring happier customers and more income. The theater earns once the auditorium is open.
9. **Arcade** (Rhythm and VR as its expansions), then **Bowling**, then **Karaoke**, then the **Club** last.

Who pays: the Restaurant and the Strip mall cost your own coins. The speakeasy and the Auditorium are free once their scene
or their basics are done.

The Loft building (Bedroom, Closet, Lair, Patio, Game Room) keeps opening as it does now.

## Who does what

- LEAD: the curve and old-save rule, prices, the upgrade menu, the story scenes and what opens each room, team members from
  the story, `ECONOMY.md`.
- ROOMS: merge the Upstairs Bar and the Speakeasy into one second-floor room (room code, art, the bare start); a chibi look
  and a portrait for each story character (the partner chef, the speakeasy investor, the mall investor, the theater employee);
  a produce stand in the Garden; the theater basics as separate upgrades (ticket stand, popcorn and soda, an employee).
- QA: an economy simulator over 30, 90 and 180 days, the story gates, and old saves at every stage.

## Decided (Cal, 2026-11-05)

- The Upstairs Bar and the Speakeasy are one room. Saves that own both keep everything: the merged room keeps the ids.
- The speakeasy needs a creative name (Cal to pick).
- Rhythm, VR and the Club: as in step 9, unless Cal says otherwise.
