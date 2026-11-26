# 20 random banners (Cal 11-25 via LEAD, after he approved the seven held ones: "Yes I LOVE the new banners")

Format: art/app/bl_pc_<id>.webp, 3:4 at 2K, cut with tools/backdrop_cut.py --w 1200. Rows in data/banners.json as [id, name, "r"]
(29zz_v173.js shuffles every "r" row per player; a random 5 open at levels 25, 30, 35, 40). Calm floor for the character and pet,
nothing busy behind the head, no lettering, runes or symbols (zoom in on every one), no crosses. One REFERENCES.md row if a piece
leans on a real work. After the Smoke Bomb batch; through QA, then batched to Cal.
Every new or changed bl_pc_ banner: run python3 quest-board/tools/thumbs.py and commit bl_pc_<id>_t.webp (360x480) with it
(LEAD: the banner shop grid loads thumbnails; a missing one falls back to the full painting, slow but not broken).
If a paid generation hits zero credits: stop there, note the exact piece and prompt, resume when credits return (Cal 11-25).

## Set A: vibrant and psychedelic (Cal: "more colors but nothing too cute")
Saturated and glowing, but dark-grounded, sleek and cool. No pastel, no kawaii, no rainbows-and-clouds.

| id | Name | Scene |
|---|---|---|
| psy_chrome | Liquid Chrome | a black void where a sea of liquid mirror-chrome ripples under hanging neon rings, magenta and cyan reflections |
| psy_prism | Prism Cave | a dark crystal cave whose quartz walls split one beam into hard spectral light across black stone |
| psy_melt | Melting Sky | a night desert under a sky that drips in molten bands of violet, orange and acid green onto black dunes |
| psy_fractal | Fractal Jungle | a midnight jungle of glowing fractal ferns and spiral leaves in electric green and ultraviolet |
| psy_kaleido | Kaleidoscope Hall | a dark mirrored hall where kaleidoscope light patterns of deep teal, gold and crimson bloom on black marble |
| psy_aurora | Aurora Sea | a black glassy sea under a violent aurora of green, violet and red that pours down into the water |
| psy_uv | Ultraviolet Dunes | blacklight dunes, glowing UV plants and a huge dim violet sun on the horizon |
| psy_bloom | Neon Bloom | giant bioluminescent flowers opening in a dark swamp, hot magenta and cyan light, mist |
| psy_vortex | Ink Vortex | swirling marbled ink currents of cobalt, scarlet and gold spiralling into a dark centre over a black lake |
| psy_lava | Lava Lamp Abyss | slow glowing blobs of molten orange and violet rising through a deep black ocean trench |

## Set B: intricate and detailed (every corner rewards a zoom)
| id | Name | Scene |
|---|---|---|
| fine_clock | Clockwork City | a dusky city of brass towers, exposed gears, pendulums and tiny lit windows, cogs in every wall |
| fine_filigree | Filigree Spires | towering spires of black iron lace and gold filigree under a deep night sky (no crosses, no saints, not a church) |
| fine_jade | Jade Palace | a palace carved from dark green jade: layered eaves, carved dragons and clouds, lanterns, mist |
| fine_library | Engraved Library | an endless dark library of carved wooden shelves, ladders, globes and brass lamps, book spines with no lettering |
| fine_tapestry | Tapestry World | a landscape woven as a deep-toned tapestry: stitched hills, thread rivers, woven castles, visible weave |
| fine_bottle | Ship in a Bottle | a giant glass bottle on a dark shelf with a whole stormy harbour and tall ship inside, tiny lit windows |
| fine_orrery2 | Star Atlas | a vast brass armillary and star-chart dome: engraved rings, planets, constellation wires (no zodiac glyphs) |
| fine_reef | Coral Citadel | an undersea citadel grown from coral and pearl, tiny glowing windows, fish shoals, deep blue dark |
| fine_lacquer | Lacquer Garden | a black lacquer cabinet scene come alive: gold-leaf cranes, pines and bridges inlaid in mother-of-pearl |
| fine_miniature | Miniature Mountain | a tiny world on a mountain: terraced villages, waterfalls, rope bridges and lantern paths, model-like detail |
