# Adding content

Everything visual is data. Adding content must never require editing `src/rig.js`.

## How a character is built

A character is a stack of separate transparent layers, each painted once on a
shared rest pose: `body`, `shoes`, `pants`, `top`, `face`, `hair`, `hat`, `glasses`.
`data/rig.json` sets the stacking order and which bones each slot follows.
`data/poses.json` holds poses as bone rotations, so poses contain no art.

Views are `front` and `back` (three-quarter). Mirroring a frame gives the other
two walking directions.

## Add a cosmetic: one generation

1. Attach `art/sil/all_2x2.png` to one Higgsfield generation at 1:1 with the
   **Unlimited** toggle on. Never spend credits. This one image covers man and
   woman, front and back. A row of four figures does not work: the generator
   rescales them.
2. Prompt for the item only. Everything uncovered stays flat magenta and the
   background stays flat green. Ask for neutral grey if players should pick its
   color at runtime.
3. Run `tools/ingest4.sh <file_stem> <item>`, then `tools/pack.py art/layers art/app`.
   It rejects sheets where art strays off the body. Hair may extend past the body,
   so run it with `QB_STRAY=0.2`. Faces need `QB_FINE=1` and then `tools/iris.py`.
4. Add the item to the data. It now works in every pose.

Shop items: add a line to `EXTRA_ITEMS` in `app/src/15_shop.js` and an entry to
`data/items.json` (its rig slot, plus `over`, `frontOnly`, `femaleOnly` or `maleOnly` if
they apply, and `neutral` for dark art that picks up a purple cast from the template).
Pants cut wide enough to stick out around a boot set `wide`, so tall footwear goes under
their hem. Overalls and suspenders set `overTop`, so the whole piece (bib, straps and legs) draws
over the top while the arms still draw over it. A hat whose brim covers the eyes sets `lift` per body, in art pixels. Then
run `tools/ingest_items.py <file_stem> <item>`, `tools/pack.py` and `tools/items.py`, which also makes the cut-out shop icon and works out the line where a
hat trims the hair. A mesh panel needs `tools/fill_mesh.py` on its layers before
`pack.py`, or the head shows through. Set `QB_PY` to a Python with pillow, numpy and scipy.

Check a new item against everything else with `rigtest/matrix.html`: `sheet=hats`,
`hatface`, `neck`, `waist`, `legs`, `poses`, `base` or `hair`, with `body=m|f` on waist
and legs. `rigtest/gait.html` reports whether the walk is even.

## Add furniture or a room

Each desk, chair and bed lists its art and seat in `data/loft.json`, including which
way its art is mirrored and where its screen sits. Beds record the head position and
the blanket fold line. Run the checks in `rigtest/qt.js` afterwards: `QT.sweep` walks
every route on both bodies, and `QT.depthAudit` checks front and behind.

Tall footwear like boots should set `"over": true` so it sits over trouser cuffs.

The Restaurant lives in `app/src/21_restaurant.js`. An upgrade is one line in `RS_UPS`
(price, income, level, and what it needs) plus a line in `LFROOM.restaurant` if it shows in
the room. New furniture comes from one sheet per set: nine objects in a 3 by 3 grid on flat
green, cut with `tools/rs_art.py <sheet> <name> ...`, and `tools/rs_fix.py art <name>` for
anything glowing. Tables list where their chairs sit in the art, so guests sit on them.
Guests and staff are drawn by the rig, so they can wear anything in `data/items.json`.
Set prices with `docs/ECONOMY.md`.

Keep printed logos away from mirrored frames, or supply them as their own layer,
because mirroring reverses text.

Queue at most about 3 generations at once. Extra jobs can be dropped silently, so
confirm each one appears in the generation history.

## Add a pose or animation: no new art

Add an entry to `data/poses.json` with the view and bone rotations.
`r` is degrees clockwise on screen, `l` and `w` scale a bone along and across.

## Add a body

Generate a blank base for both views, facing the same way as the existing
bodies, then run `tools/art.py base` to get its silhouette and add its joints to
`data/bodies.json`.
