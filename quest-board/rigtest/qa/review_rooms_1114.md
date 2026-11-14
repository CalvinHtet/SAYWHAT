# QA room placement sweep (Cal, via LEAD, 2026-11-14)

Cal asked for this check: "make sure no furniture is placed incorrectly on the walls or is hanging in the air improperly ... looks like how a real version of that room would look like".

**How it was checked**
- **Build:** a plain build of v1.01 (4c6317b, the same rooms as live).
- **Rooms:** all 21 rooms in `lib.ORDER`, fully bought (no retired pieces, none that open another room), in the default style, at 13:00, with nobody in them.
- **By eye:** every room drawn at 1860 px wide by `bigrooms.js` and looked at whole, with crops where something looked off.
- **Automatically:** `auditall.js` checks each room for pieces outside the floor, overlaps, stacks, depth order and guest spots.
- **Pictures:** `shots/qa/rooms1114/big_<room>.jpg`. Positions below are in those pictures, in pixels from the top left.

**Owner:** ROOMS for placement and art. LEAD only where it says code.

## 1. Lights hanging in the air (the brass sputnik chandelier is placed low)
- **Restaurant:** two chandeliers hang at chair height and not over a table. One is over the slatted divider by the booths (~650,640); the other is in the gap between tables (~640,800). The third, over a table (~860,700), is fine. (`big_restaurant.jpg`)
- **Movie Theater lobby:** both chandeliers sit at knee height with nothing holding them up. One is in front of the recliners (~790,690); the other is in front of the arcade cabinet (~1190,820).
- **Sky Patio:** the left string of lights ends in mid-air at ~330,565, with no post or wall on that side.

## 2. Pieces floating with nothing under them
- **Boba Shop:** the gas burner and the wok of pearls float at counter height between the pink counter and the wall (~1070-1200, 650-790), with the flames drawn above the wok. They need a counter or stand under them, or should sit on the back counter.
- **Dessert Parlor:** a sundae glass hangs between the shave-ice machine and the soft-serve machine (~845,610).
- **Walk-in Closet:** a glowing rod hangs diagonally across the hidden stair arch (~750-1090, 820-1020) and isn't attached to anything. If it's the stair rail, it belongs inside the arch along the stairs.

## 3. Wall pieces drawn at the other wall's angle, so they stick out into the room
- **Rhythm Room:**
  - The neon mirror panels (~450-780, 360-770) are on the left wall but drawn at the right wall's angle.
  - The equalizer display (~1150-1410, 360-640) is on the right wall but drawn at the left wall's angle.
  - Swap them, or flip each one.
- **VR Room:** the globe poster on the left wall (~250-400, 320-460) is drawn at the right wall's angle.
- **Game Room:** the hex light panel on the left wall (~570-710, 365-510) doesn't follow the wall plane. The right-wall hex panels do.

## 4. Pieces hanging off the floor (the audit agrees)
- **Rhythm Room:** the bench's right legs sit past the front-right edge of the floor (~1390,1300). The audit lists it outside the floor (rhx_bench).
- **VR Room:** the flight-sim pod's base hangs past the front-right edge (~1250,1110). The audit lists it outside the floor (vrx_fly).

## 5. Doors and paths blocked (rule 20)
- **Bedroom:** the gaming desk's right end runs into the glass patio door frame (~1600,830).
- **Garden:** the back-left door opens straight onto a raised bed (the lettuce bed at ~680-890, 580-720). Anyone walking through it steps into soil.
- **Mall:** the escalator runs up into the wall under the balcony (~1600,800) and doesn't reach the upper floor. Its top also sits behind the glass elevator.
- **Movie Theater:** the rocket standee stands on the entrance by the doormat (~1230,1200).

## 6. Clipping (rule 20)
- **Rooftop Bar:** the DJ booth cuts into the pool's back-right corner and the pool ladder (~1130-1350, 760-940).
- **Garden:** a lamp post stands inside the koi pond, behind the rose arch (~800,1080). The arch's left pillar is also in front of the pond's corner.
- **Speakeasy:** the left arm of the corner booth clips the upright piano (~1380,740).
- **Sky Patio:**
  - One telescope leg goes through the glass railing (~1200,1440).
  - The bar cart cuts into the planter box (~1340,1010-1150).

## 7. Doesn't read like the real room
- **Bowling Alley:**
  - The orange bowler seats face the trophy wall, with their backs to the lanes.
  - The ball return and the score console stand by the seats, not at the lanes' approach.
  - In a real alley the seats face the lanes and the ball return sits between the lanes at the foul line.
- **Karaoke:** the front pink booth faces out of the room, with its back to the stage and the lyrics screen.
- **Auditorium:**
  - The projector aims toward the front-left corner, not the screen.
  - The EXIT sign is half hidden behind the tall speaker.
- **Speakeasy:** the bar has no back bar (no shelves or bottles behind it), while the drinks cart stands by the stage.
- **Hero's Lair:**
  - "UPGRADES" is written in a serif font across the main screen and looks like a label left on the art.
  - The outlined cartoon pieces (power cell, battery rack, holo table, drone pad, teleport pad) clash with the painted room. Cohesive furniture is on the lessons list.

## 8. Crowded when fully bought (rooms-never-cluttered)
- **Restaurant dining floor:** 8 square tables plus 2 booths, a round booth table and 3 chandeliers, with chairs nearly touching between tables.
- **Garden front-right corner:** greenhouse, shed, barrel, compost, log pile, solar panel, pump, beehives, chicken coop, fountain, grape arbor and two trees, all within a few tiles.

## 9. Guest spots (`auditall.js`)
- **Restaurant:** 4 diner seats are more than 0.6 tiles from any furniture, so the audit marks them as seats on air.
- **Patio:** one chair spot is inside furniture.
- **Not checked by eye:** guests sitting at those spots.

## Looked right
Sky Bar (Lock and Key), Arcade, Nightclub, and the rest of the Bedroom, Boba Shop, Dessert Parlor, Movie Theater and Mall.

## Not checked
- Room styles other than the default.
- Building stages before fully bought, except as drawn.
- Night lighting.
- People and their poses in the rooms.
- The Restaurant's earlier stages: reststages.js has covered those before.
- ROOMS's uncommitted work in the shared folder: only committed art at 4c6317b was checked.
