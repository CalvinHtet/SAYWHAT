# New brands, made automatically (Cal, 2026-11-06)

**PAUSED, Cal 2026-11-07: "I don't think we need anymore brand assets. We're approaching a long playtime".** The 16 brands in
BRANDS (through SØLVBERG) are the set; when they have all dropped the Shop reruns them (DROPS.rerun). `brand_runway.py` reports
only and never asks for a brand while this stands. Nothing below runs until Cal lifts it.

Cal: "I want there to be an automatic generation of new brand assets when it gets close to running out. And it can run through
without my approval as long as it works."

So when the Shop is close to running out of new brands, the team makes the next one start to finish **without asking Cal**,
as long as every step below passes. Cal still sees each brand when it drops, like any player.

## The trigger

`python3 tools/brand_runway.py` reads BRANDS and DROPS the way the game does and prints when the last new brand drops. It exits 2
("NEED A NEW BRAND") when fewer than 21 days of new drops are left. ROOMS runs it on every loop (TEAMWORK rule 19); LEAD runs it
at every publish. Brands only count once they are in BRANDS, i.e. their art is in the build, so the drafted-but-unpainted brands
in `BRANDS_15.md` are the first ones to make, in that file's order.

## The steps (no Cal approval needed)

1. **Pick.** The next unpainted brand in `BRANDS_15.md`. When that list is used up, ROOMS invents one: a name that reads like a
   real label (not a slogan, Cal: "too ai generated" names are out), a sub-line, a tagline, a palette and about 15 pieces in the
   usual slots, written into `BRANDS_15.md` under "Made automatically" with the date.
2. **Rules that never bend.** Original designs only: no real logos, brands, characters, costumes or anyone's likeness. Nothing
   that copies another brand's look. Cal's own marks (NICE COCK, Kode PinK, SAYMØRE) only for those brands.
3. **Paint (ROOMS).** One Higgsfield sheet per piece, every angle, both bodies, in Cal's Chrome with the **Unlimited** toggle
   on. **Never spend credits.** If Unlimited is off, the page shows a credit cost, or Chrome or Higgsfield needs a login: stop,
   write it on the board, tell Cal, and make nothing.
4. **Check (QA).** The wear test on both bodies for every piece, every pose; the banner and logo in the Shop; `voice.js` on the
   names and lines. Anything that fails goes back to ROOMS; nothing ships with a known error.
5. **Wire (LEAD).** The BRANDS entry (weekly mode: the next free Monday after the last start; launch mode: the plan places it)
   and the Shop rows, then the next version through QA's full set, then publish (TEAMWORK rule 18).
6. **Record.** One line in TASKS.md: the brand, its hashes, and that it went out on Cal's standing approval of 2026-11-06.

## What this costs

Painting happens only on Higgsfield Unlimited in Cal's Chrome, which costs no credits; step 3 stops instead of paying. The chats
doing the work use Cal's Claude plan like any other work here. It only runs while the team's chats are open; nothing runs on its own
while they are closed.
