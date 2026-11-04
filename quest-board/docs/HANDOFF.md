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

## Built but not finished

- OVERPASS streetwear brand (start date 2026-11-16, reach it with Skip ahead one week): 16 of 19
  items are in. `o_hoop`, `o_slides`, `o_rigg` are marked `soon:1` in `15_shop.js` and have no art.
- Brand logos: `brandLogo` looks for `art/logo_<brand id>.webp`, which do not exist yet.
- Garden: code, 38 upgrades, pantry bonus for the Restaurant. Almost all its `gdx_*` art is missing,
  so **most upgrades are invisible after purchase**. Cal hit this.
- Theater and Auditorium: code, queue, double doors, upgrades. `thx_*` art is missing.
- Generation prompts for the missing art are at the bottom of this file.

## Not yet verified

Phone. Motion as judged by a person. The cloud save path after publishing. Whether a friend on a
free Claude account can use the AI features.

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
