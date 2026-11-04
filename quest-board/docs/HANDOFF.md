# Handoff

State as of 2026-11-04. Work top to bottom. Commit and push often. Update this file as items
finish, so the next session never has to guess.

## How the code is laid out

`app/src/*.js` are joined in filename order into one closure, so a later file can reassign an
earlier function. Rooms: `20_loft.js` (world, agents, Bedroom and old rooms), `21_restaurant.js`,
`22_garden.js`, `23_theater.js`. `24_screens.js` has animated screens, `25_splash.js` has room
and brand splashes, `15_shop.js` the shop, `16_interface.js` interface items. Economy formulas
are in `30_app_b.js` (`cum`, `levelPay`) and `10_app_a.js` (`coinsFor`, `simulate`).
Testing helper: `window.__qb.x()` returns state and internals.

## Status of Cal's request below

Done: flat prices, three buildings, shop and dungeon gates, 5 missions a day, dogs with poop and clean up,
garden with fountain plaza, auditorium above the theater, six-scene movie, seats from behind.

Building view (`lfWorld` in `26_world.js`): every room is scaled to fill its own square, no arrows or text
there, a block only exists where a room does, empty lots are just a small marker on the ground, and the city
behind (`lfSkyline`) follows the real sun. The patio skyline only draws inside the room view.

Doors (`rmPortals`): a soft glow on the floor, and an arrow outside the room that only appears in the room view.
The arrow points where that room really is in the building. `ROOMCELL` is the map.

Room view: at the widest zoom the room reaches both sides of the frame, drag up and down if it does not all fit.

Restaurant (`LFROOM.restaurant` in `26_world.js`): kitchen behind a partition in the top right corner, booths
on the left wall (two bench sprites and a table, so a guest sits inside), tables with four chairs, curved booth.
Bar, Rooftop with pool and glass rail, marble strip Mall with empty storefronts: hand-placed in `27_rooms.js`.
Game Room, Boba, Dessert, Speakeasy, Arcade, Rhythm, VR, Bowling, Karaoke, Nightclub: hand-placed in
`27b_skins.js`, each with its own floor and wall painted in code (`roomSkin`).

Rules for placing things: flip 0 stands along the left wall facing lower right, flip 1 along the back wall facing
lower left. New art keeps its natural proportions, never pass a height. Do not reuse a sprite in two rooms. A couch
that faces a TV needs a rear-view sprite.

Room sizes: `d.layout=[W0,D0,pivotX,pivotY]` in a room def means its plan was drawn for W0 x D0 and is spread to the real
size by `roomSpread` in `26_world.js`. Anything before the pivot stays put, such as a bar and its stools.
Spacing audit, all upgrades owned (floor coverage): Rooftop 37%, Game Room 29%, Club 28%, Speakeasy 27%, Bar 22%, Bowling 22%,
all others under 20%. Nothing sits outside its room. Remaining gaps under .35 tile are wall pieces, stools at the bar and the band on its stage.
Bedroom (52% with its rug), Garden and Theater were only measured, not re-spaced.

Clothes: 32 of the 33 unfinished items are unlocked. `v_tulle` still has `soon:1`: three sheets were rejected as stray by `ingest_items.py`, so it needs a different design. Generating, the Chrome tab freezes while idle, so the page loop only moves while something keeps calling into the tab.

Still to do, in order:
1. Wear the new clothes on both bodies in every pose. Only front icons were looked at. This is Cal's rule, do not skip it.
2. Watch guests in every room for clipping. Only the Restaurant was watched with people in it.
3. Check every room for items facing the wrong way, room by room, in screenshots.
4. Phone test, then remove the Testing row and the `window.__qb` hooks before release.

## Not yet verified

Phone. Motion as judged by a person. The cloud save path after publishing. Whether a friend on a
free Claude account can use the AI features.

## Cal's later notes, in his words

> check all the assets in all the rooms and make sure they are positioned correctly and have proper spacing inside all the rooms. things should not be too close together so people have room to walk. some rooms should be bigger and some appropriately sized to fit all the upgrades that we have planned
>
> The game room and walk in closet are way bigger than the bedroom... I want it to look like an actual walk in closet with lit up wardrobes.
> i also want each room to fit snuggly into each square in the building view instead of bleeding into each other. Also remove the arrows and any text on the building view... When the rooms dont exist yet, i want there to be empty space and no building. The background of the building view could also have a better background city skyline that reacts with the time of day
> this restaurant is not very cohesive. the seats are very cheap and the table is super tiny... that is technically not a booth.
> Every room and every upgrade should have a meaningful purpose
> When i click into a room, the minimum zoom size should have the room fill up to the left and right sides of the screen... don't reuse assets. make everything unique
> The mall is build with wooden floors... Make it an empty strip mall with marble floors and some cutouts for the doors as the base starting build. Then some upgrades would be the karaoke room, arcade which has a rhythm game upgrade and VR game upgrade, and a bowling alley. these are all their own separate room upgrades
> Once done with the clothes and test, i need you to do an extensive test on every asset in this game to make sure nothing is clipping, and every item is placed and positioned correctly in the room relative to its direction (a sofa should not be facing the wall or a desk should not be positioned sideways unless intentionally). Every room should feel unique
> a majority of the kitchen appliances like that brick stove belongs in the kitchen. Create an extension on the top right that leads to the kitchen, but don't need to create a separate room in the building view for it. Just create a partition

## Cal's request, in his words

> when the customers are sitting in the restaurant, they are unnaturally clipping through the furniture and seats. I also think the restaurant is too cramped and has too much stuff. I like all the upgrades, but the final fancy upgrade color is white green and gold. It is quite ugly. I want it to start off basic and small with 2 tables, and then eventually get bigger and sleeker and darker and moodier like a fine dining michellin star restaurant. restaurant could be a bit bigger too during the upgrade. I would like an upstairs section to this restaurant where the cocktail bar and some high top standing tables could be. Think high luxury, sleek, moody, fine dining. I dont want the upstairs to overlap the bottom floor because that would make it even more cluttered. There could be a set of stairs that leads up to the bar and this 2nd floor could be a bit off to the side so that we can see both floors in clear full view.
>
> "Digital menu screen installed" stayed persistent after purchasing the upgrade. Every text for each upgrade stays persistent on the screen instead of fading away.
>
> Garden upgrades are not appearing at all after purchasing.
>
> When purchasing upgrades, it is causing the upgrade menu to scroll all the way back to the top rather than keeping the room view on screen. I would like a separate scroller box that does not keep jumping back to the top each time I add an upgrade.
>
> people's heads are clipping through the garden assets. Double check every character with every asset in this platform to make sure no one is clipping through anything.
>
> i cant see any of the garden upgrades but it seems like it might also be too cramped. Can you make sure there is ample space for everyone to walk around and to see each asset clearly? Do this for every building so nothing feels cramped.
>
> Reference speaker towers in the auditorium end up making the other speakers disappear. They also seem to be facing the wrong way?
>
> When I upgrade the screen to a larger size, I would like the wall that it is on to actually grow taller or maybe even wider so that the upgrade feels more dramatic.
>
> I want all the big upgrades in every single room to feel very important and impactful. Like if we are adding a stone fountain in the garden, there could be an animation for the fountain and water spouting out and people who visit, stop to admire it, and the ground changes and there could be a walkway leading up to the fountain. Youll have to keep in mind how some of these upgrades change the environment and affect the other upgrades that were initially there.
>
> The VIP velvet seating did not look as good as the previous reclining seats. No imax theater would have these.
>
> The gold speaker tower is also right in front of the screen and is blocking the movie. I would also like a more exciting movie animation that loops through 6 different scenes. The people who are in the movie theater are also sitting facing the bottom left side of the screen instead of watching the movie on the left upper side of the building.
>
> Instead of the auditorium being placed above the garden in the building view, can we make the auditorium part of the movie theater and extend to the right of the theater? In the building view, once this happens, it can expand the building out to the right.
>
> Actually, I am now envisioning a different layout for the buildings. Instead of one building, we can have multiple buildings that each have their own purpose. One building for home which could have the bedroom, patio, game room, and hero's lair. One building for business which can have the restaurant, asian dessert parlor, boba shop, rooftop bar, speakeasy with an option for a live jazz band. One building for entertainment that has a mall, a movie theater, arcade, nightclub, bowling alley, karaoke, VR gaming place.
>
> Each building will naturally upgrade their spaces until it adds a new unit. Such as how the bedroom naturally upgrades the space and expands into a closet. I now want the shop to unlock only after the closet unlocks. After that, once we unlock the hero's lair, we gain access to the dungeon tab and we can send our visitors to missions. 5 missions per day but some missions require 2 or 3 people to tackle and they grant increasingly larger rewards. Since I have a separate room for the closet and the hero's lair and the patio now, i want you to make these rooms bigger and self contained. i want the bedroom to be its own entity and once the closet unlocks, i want there to be a doorway with a glowing and pulsating entranceway that is clickable. i want a floating arrow that is outside of the perimeter of the current room that is pointing from the edge of the doorway out into the direction of the next room. Clicking this area will allow you to teleport to that new room and have new upgrade and installation options. The closet now needs more upgrades and customizations. Perhaps it could somehow link to the shop and react to the items we purchase in the shops, but if this is too expensive and difficult, do this for a future quality of life update. The hero's lair is now its own room that opens from the closet from a secret sliding door that has a glowing pulsating deep blue glow from the entranceway with the same floating arrow that allows us to transfer to that room. This room now needs some more upgrades as well.
>
> Back in the bedroom, when opening the patio, I want the patio door to be in the same position, but it opens up a new room above the bedroom in the building view. i want it to be a medium sized patio that is on the 30th floor of a highrise. The background of this should be the patio overlooking a beautiful golden hour sunset overlooking the LA skyline in the same artstyle as everything else. More upgrades needed here such as artificial grass flooring, a simple chair that upgrades eventually to a premium egg swing seat, perhaps some string lights, a dog bed out there. Also one of the upgrades for the bedroom should be a dog bed, and a dog. One is Pluto who is a toy poodle, and Chopstick, who is a chihuahua dachsund mix. Two dog beds eventually, and two upgrades for the dogs. The dog's animations should be occasionally jumping up and sleeping on the bed, or pooping on the floor which leaves a little poop asset on the floor. Cleaning this up by clicking a clean button would give a certain number of coins and experience. The dogs should not be clipping over each other or clipping over the furniture so make sure they are intelligent assets with object awareness.
>
> As for the other buildings, once the upstairs bar is open from the restaurant, it leads up the stairs which opens up a new room in the building view that is directly above the restaurant. To the right of the restaurant in the same building could be a boba shop. Right above this is the asian dessert parlor.
>
> In the entertainment building is the movie theater. The room above is the auditorium. The movie theater does not start making any money or receiving business until the auditorium is open so it requires some upgrades before fully functional. To the right of the theater leads to the mall which has multiple shops and kiosk upgrades and fountains and stuff you can add to attract more people and gain more money. Then connecting from the mall, it could be an arcade, which eventually has a small side expansion for rhythm games and another side expansion room for VR games. Then from the mall room, it can expand to a bowling alley, and then again from the mall room it can expand to a karaoke room.
>
> Make all those changes and also 2 more clothing brand additions (30 more clothes).
>
> Rebalance the money it takes to make these upgrades. Some of these upgrades seem like they are going to take weeks to make enough money to upgrade. Each upgrade should feel very achievable within one day. Except the huge upgrades. If it is upgrading a painting or something small, they should all relatively be the same price rather than every item ramping up in price. Nothing should cost 20000 coins if we are only able to make 50 coins per task completed. That is not achievable.

Note that two passages conflict: he first asks for the auditorium to the right of the theater, then later says the room above the theater is the auditorium. The later one wins unless he says otherwise.

## Also on the list, from earlier

- Town bulletin board with friend interactions (Cal liked it; not started): messages, ingredient requests, movie invites that play a short visit animation, friendship points, friends' characters as guests. Uses the page's shared database. Cap rewards per day.
- Bedroom furniture edit mode, decor first.
- Before sharing with friends: phone test, remove the Testing row. Every save now uses a private per-person path.

## Art still to generate (Cal's Chrome, Unlimited toggle, Nano Banana Pro, never credits)

Furniture sheets go through `tools/rs_art.py <sheet> <names in reading order>`; `tools/rs_fix.py art <name>` for anything glowing. Base prompt for each: isometric game furniture sprites on flat pure green, three-quarter camera, clean dark outlines, soft painted shading, nine separate objects in a 3 by 3 grid, long sides lower left to upper right, fronts facing lower right, no text, no floor, no shadow.

- Garden 1: `gdx_seed` dirt bed with seedlings, `gdx_raised` timber bed with lettuce, `gdx_tomato` bed with staked tomatoes, `gdx_herb` herb trough, `gdx_can` watering can and coiled hose, `gdx_comp` compost bin, `gdx_wheel` wheelbarrow of soil, `gdx_barrel` rain barrel, `gdx_bench` potting bench.
- Garden 2: `gdx_shed` tool shed, `gdx_hive` two beehives on a stand, `gdx_tree` young apple tree, `gdx_grape` grape trellis, `gdx_coop` chicken coop with hens, `gdx_logs` mushroom logs, `gdx_stand` farm stand with crates, `gdx_pump` solar water pump, `gdx_seat` wooden garden bench.
- Garden 3: `gdx_ghouse` small glass greenhouse, `gdx_conserv` large Victorian conservatory, `gdx_arch` rose archway, `gdx_gate` iron garden gate, `gdx_fount` tiered stone fountain, `gdx_lantern` lantern post, then sundial, topiary, bird bath.
- Theater: `thx_booth0` plain plywood ticket booth, `thx_rope` velvet rope section, `thx_arcade` arcade cabinet, `thx_claw` claw machine, `thx_standee` cardboard rocket standee, `thx_liquor` backlit liquor wall, `thx_proj1` digital projector, `thx_proj2` large laser projector, a simple lobby bench.
- Logos, one row of three on green, no letters: `logo_hanga` river and bridge roundel, `logo_y2k` chrome and pink butterfly, `logo_over` spray-paint overpass arch with drips.
- OVERPASS shoes via `art/sil/all_2x2.png`: `o_hoop`, `o_slides`, `o_rigg`. Then `tools/ingest_items.py`, `tools/pack.py art/layers art/app`, `tools/items.py art/layers art/app data/items.json`.
