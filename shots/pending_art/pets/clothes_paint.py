# The 48 Pet Shop pieces as painting jobs (ROOMS 2026-11-18): id, pet, kind, template frames, what to paint.
# Template frames follow data/pet_art.json fit.cells order for body/base pieces; head, neck and auras paint on frame 0
# (the dogs on both dogs' frame 0: one cell per dog).
CELLS = {"wolf": "0,6,4,5", "wyvern": "0,2,3,6,4,5", "slime": "0,4,6,3,5", "dogs": "0,2,3"}
NOUN = {"wolf": "pup", "wyvern": "baby wyvern", "slime": "slime", "dogs": "dogs"}
KEYC = {"wolf": "magenta", "wyvern": "magenta", "slime": "cyan", "dogs": "cyan"}
P = [
 ("pw_helm", "wolf", "head", "a tiny brushed-steel half helm sitting on its head between the ears, two ear slots so the ears come through, sitting high like a little cap, a thin icy cyan glowing rim etched with a simple wave and dot pattern (no letters, no runes, no symbols), a short crest fin on top; no plume, no horns, no emblem; its lower edge sits high on the forehead with a clear gap above the eyes"),
 ("pw_beanie", "wolf", "head", "a slate-grey cable-knit beanie with two ear holes so the ears come through, an icy cyan pompom on top, a small stitched paw patch on the folded cuff; it sits above the eyes and never covers them"),
 ("pw_circlet", "wolf", "head", "a thin silver circlet resting on its head between the ears, a small icy cyan crescent-moon gem at the front, two short fine silver chains hanging only a little at the sides; it sits above the eyes and never covers them"),
 ("pw_collar", "wolf", "neck", "a collar worn round its neck: black leather with a fine stitched edge, a row of small glowing icy cyan studs, a little silver snowflake-shaped tag at the front, a small silver buckle at the side; it sits snugly in the neck fur under the chin"),
 ("pw_ruff", "wolf", "neck", "a silver-grey faux-fur neck ruff worn round its neck, frosted white tips on the fur, an icy cyan crystal clasp at the front; it sits under the chin"),
 ("pw_torc", "wolf", "neck", "a twisted silver torc round its neck, a small frosted-glass bell hanging at the front, an icy cyan bead on either side of the bell"),
 ("pw_armour", "wolf", "body", "tiny battle armour fitted to each pose: a steel chest plate over the chest and back, small rounded shoulder guards, glowing icy cyan seams, brown leather straps and a rivet border; no emblem, no plume, no horns, no heraldry; the legs, tail and head stay free"),
 ("pw_hoodie", "wolf", "body", "an oversized silver-grey hoodie fitted to each pose, far too big for it, sleeves pushed up the front legs, icy cyan drawstrings, a pouch pocket with a stitched paw print, the hood down on its back; the head, tail and paws stay free"),
 ("pw_cape", "wolf", "body", "a short slate-blue velvet cape fitted to each pose, hanging from the shoulders over its back, silver star embroidery along the hem, an icy cyan clasp at the chest; the head and tail stay free"),
 ("pw_aurora", "wolf", "aura", "a soft ribbon of icy cyan and silver northern light curling round the pup at mid height in a wide oval ring, wider than the pup, a few pale sparkles along it; the back part of the ring passes behind the pup and the front part in front, low and thin, never across the eyes"),
 ("pw_cloud", "wolf", "aura", "a little silver-grey cloud, about the width of the pup's head, floating just above its head, and about eight small white and icy cyan snowflakes drifting loosely round the pup in a wide low oval, a few behind it and a few out at the sides and low near the paws, small and far apart, nothing in front of its chest, flank or face"),
 ("pw_shards", "wolf", "aura", "about ten small separate pale-blue ice crystals floating round the pup in a wide low oval at mid height, spaced far apart with empty space between them, one small silver crescent moon behind it among the back crystals, each crystal with a little glint; the ones in front stay low near the paws and out at the sides, nothing in front of its chest, flank or face"),
 ("pv_wizard", "wyvern", "head", "a small rust-orange wizard hat with navy and gold stars and a small moon, sitting high on the back of its head between the horns and tipped backwards, a hole so one horn pokes through, a bent tip, a narrow brim that stays high on the crown well above the eyes, so both eyes stay clear even when it faces straight ahead"),
 ("pv_goggles", "wyvern", "head", "brass flight goggles with amber lenses pushed up on top of its head between the horns, on a brown leather strap; they sit above the eyes and never cover them"),
 ("pv_hornring", "wyvern", "head", "two gold filigree rings worn on its two horns, joined across the top of its head by a fine gold chain with one amber bead; nothing over the eyes"),
 ("pv_scarf", "wyvern", "neck", "a chunky knit scarf in amber and navy stripes wound round its neck and knotted at the side, the two fringed ends attached to the knot and hanging down over its chest, nothing floating loose"),
 ("pv_coins", "wyvern", "neck", "a gold chain of small blank coins round its neck with one amber gem pendant at the front"),
 ("pv_kerchief", "wyvern", "neck", "a cream silk neckerchief knotted at the side of its neck with an amber stick pin"),
 ("pv_pack", "wyvern", "body", "a tiny brown leather explorer backpack fitted to each pose, worn on its back between the wings with straps over the shoulders, brass buckles, a rolled map and a little lantern hooked on the side; the wings stay free"),
 ("pv_bomber", "wyvern", "body", "a tan leather bomber jacket fitted to each pose with amber lining, ribbed cuffs, two slits so the wings come through, a navy flame-shaped patch on the chest; the wings, tail and head stay free"),
 ("pv_vest", "wyvern", "body", "a quilted cream waistcoat fitted to each pose with gold embroidery, navy piping and brass buttons, a pocket watch chain across the front; the wings, tail and head stay free"),
 ("pv_embers", "wyvern", "aura", "about twelve small solid glowing amber embers shaped like little teardrops and a few tiny solid gold four-point sparks rising round the wyvern in a wide low oval at mid height, spaced far apart, every one opaque with a dark outline, no smoke, no haze, no glow on the background; a few behind it and a few in front low down, never across the eyes or face"),
 ("pv_lanterns", "wyvern", "aura", "three small brass lanterns with amber glass, each only about the size of the wyvern's paw, floating in the air close round it at mid height (none standing on the ground), a few tiny solid gold sparkles near each; one behind it at one side, two in front at the sides by its hips, never across the eyes, face or chest"),
 ("pv_stars", "wyvern", "aura", "about nine small amber star points joined by fine thin gold lines like invented constellations, circling the wyvern in a wide low oval at mid height, one bright navy-rimmed star at the front; a few behind it and a few in front low down, sparse, never across the eyes or face"),
 ("ps_crown", "slime", "head", "a small pink-gold crown tilted to one side between its ears, hot pink gems, tiny pearl tips; small, never big and centred; it sits above the eyes"),
 ("ps_phones", "slime", "head", "chunky hot pink headphones with a gold band over the top of its head between the ears, the round cups on its sides, glowing pink cups with a gold star on each; above the eyes"),
 ("ps_bow", "slime", "head", "a huge hot pink satin bow on top of its head between the ears, plum polka dots, long trailing ribbon tails; above the eyes"),
 ("ps_ruffle", "slime", "base", "a frilly pink lace ruffle collar fitted to each pose, worn round the bottom of its body like a skirt hem, a plum ribbon bow at the front; low, under the eyes"),
 ("ps_pearls", "slime", "base", "a string of big pearls fitted to each pose, worn round the bottom of its body, a pink heart charm hanging at the front; low, under the eyes"),
 ("ps_scarf", "slime", "base", "a chunky plum and pink knit scarf fitted to each pose, wound round the lower part of its body, pompom ends; under the eyes"),
 ("ps_cape", "slime", "body", "a tiny pink satin cape fitted to each pose, draped over its back from the top, plum lining, a gold heart clasp; the face stays free"),
 ("ps_float", "slime", "body", "a plum and pink striped float ring fitted to each pose, worn low round the bottom of its body like a swim ring, a little valve and a shine; under the eyes, never covering them"),
 ("ps_pack", "slime", "body", "a pink mini backpack fitted to each pose, on its back, gold zips, a plum star charm and a tiny keyring; the face stays free"),
 ("ps_flames", "slime", "aura", "four small separate hot pink spirit flames with plum smoke tails circling the slime in a wide low oval at mid height, spaced far apart; two behind it, two in front low down, never across the eyes or face"),
 ("ps_comet", "slime", "aura", "one small hot pink comet with a thin gold tail looping round the slime in a wide low oval at mid height, a few tiny pink sparkles shed along its path; its path passes behind the slime and in front low down, never across the eyes or face"),
 ("ps_sparkle", "slime", "aura", "about ten tiny separate four-point stars in pink and gold twinkling round the slime in a wide low oval at mid height, spaced far apart, a faint plum glow on each; a few behind it and a few in front low down, sparse, never across the eyes or face"),
 ("pd_bucket", "dogs", "head", "a caramel corduroy bucket hat on each dog's head with two ear slits so the ears come through, a cherry stitched bone patch on the front, a cream band; above the eyes"),
 ("pd_poppy", "dogs", "head", "a woven ring of cherry-red poppies with navy centres on tan twine worn as a crown on each dog's head, no leaves, no stems, a small navy bow at the side; above the eyes"),
 ("pd_aviator", "dogs", "head", "a brown leather flight cap on each dog's head with cream fleece lining, short ear flaps buckled up, tiny goggles high on the brow; above the eyes"),
 ("pd_bowtie", "dogs", "neck", "a navy collar round each dog's neck with a cherry gingham bow tie at the front and a small brass bell"),
 ("pd_bandana", "dogs", "neck", "a cream bandana round each dog's neck with cherry paw prints and a twisted rope edge, knotted at the side"),
 ("pd_studs", "dogs", "neck", "a cherry leather collar round each dog's neck with a row of brass studs and a blank brass bone-shaped tag at the front"),
 ("pd_puffer", "dogs", "body", "a cherry quilted puffer vest fitted to each dog in each pose, navy lining, a leash loop on the back and a cream zip pull; it covers the poodle's whole little vest; head, legs and tail free"),
 ("pd_rain", "dogs", "body", "a mustard rain slicker fitted to each dog in each pose with a little hood down on the back, toggle buttons and a cream reflective stripe; it covers the poodle's whole little vest; head, legs and tail free"),
 ("pd_cable", "dogs", "body", "a navy cable-knit sweater fitted to each dog in each pose with a cream rolled neck and a cherry heart patch on the side; it covers the poodle's whole little vest; head, legs and tail free"),
 ("pd_hearts", "dogs", "aura", "about eight small separate cherry and cream hearts drifting round each dog in a wide low oval at mid height, spaced far apart, a few with a navy stitched outline like felt patches; a few behind and a few in front low down, sparse, never across the eyes or face"),
 ("pd_bubbles", "dogs", "aura", "about six separate glossy soap bubbles of different small sizes with a pink and sky-blue sheen and a white shine floating round each dog in a wide low oval at mid height, spaced far apart, one popping into a tiny splash; a few behind and a few in front low down, never across the eyes or face"),
 ("pd_treats", "dogs", "aura", "three tiny bone-shaped biscuits, golden-baked with cream icing dots, circling each dog in a wide oval ring at mid height with a few crumbs trailing; one behind, two in front low down, never across the eyes"),
]


def frames(pet, kind):
    return CELLS[pet] if kind in ("body", "base") else "0"


def prompt(pid, pet, kind, what):
    n, k = NOUN[pet], KEYC[pet]
    many = kind in ("body", "base") or pet == "dogs"
    who = ("every %s figure" % k) if many else ("the %s %s" % (k, n))
    keep = ("Keep every %s figure exactly as it is: the same poses, sizes, places and flat %s colour" % (k, k)) if many else \
           ("Keep the %s %s exactly as it is: the same pose, size, place and flat %s colour" % (k, n, k))
    fitn = " The same piece on every figure, fitted to each pose and body." if many else ""
    if kind == "aura":  # translucent glow over the green screen keys out green-tinted (QA: nothing green)
        fitn += (" Every element solid and opaque with a clean dark outline; no smoke, no haze, no glow halos, no "
                 "translucent trails, nothing faded into the background.")
    return ("Edit Image 1. %s, and the same flat green background. Only add one thing to %s: %s.%s Paint only that piece, in full "
            "colour with clean dark outlines and soft cartoon shading, the same cartoon style; do not paint the figure, it stays "
            "flat %s, with no white border or sticker outline round it. Nothing green and no %s in the piece. No text, no "
            "letters, no logos." % (keep, who, what, fitn, k, k))


if __name__ == "__main__":
    import sys
    for pid, pet, kind, what in P:
        if len(sys.argv) < 2 or pid in sys.argv[1:]:
            print(pid, pet, kind, frames(pet, kind)); print(prompt(pid, pet, kind, what)); print()
