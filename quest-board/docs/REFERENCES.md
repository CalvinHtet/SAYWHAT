# Real-world references

Cal, 2026-11-25: "anything that matches a real world asset, i want you to create a flag for yourself so that you can scan all the
non-original work later and replace or remove them if needed."

One row for every piece of art or content that leans on something real: a game, a film, a brand, an artist's style. The designs are
ours; this is the list to scan when something has to be replaced or pulled. Whoever makes the piece adds the row in the same commit
(ROOMS for art, LEAD for names and text). QA checks a new piece against its row: close in spirit is fine, a copy is a FIX.

Risk: `style` = a look or genre only; `close` = someone who knows the source would name it at once (review these first).

| Date | Piece (file or id) | Where it shows | Leans on | What is taken | Risk | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 2026-11-25 | banners, one "blocky voxel world" (id to come) | player-card banners | voxel sandbox games | cube terrain look | style | stopped by Cal 2026-11-25 ("it doesnt look right"), nothing shipped |
| 2026-11-25 | banners, five "side-scroller" (ids to come) | player-card banners | 2D side-scrolling MMOs of the 2000s | layered parallax towns, chunky cute props, bright pastel light | style | stopped by Cal 2026-11-25 ("it doesnt look right"), nothing shipped |
| 2026-11-25 | brand drop WISHBOX (docs/BRANDS_PROPOSAL.md) | Street Shop | the cash-shop cosmetics of 2D MMOs of the 2000s | oversized cute pieces, star and wing accessories, pastel glow; every piece our own design | style | stopped by Cal 2026-11-25, proposal only, nothing painted |
| 2026-11-25 | bl_pc_ink_peaks (Ink-Wash Peaks) | player-card banners, level 15 | East Asian ink-wash (sumi-e) painting tradition | brush-and-ink look on paper; scene our own, no seals or calligraphy | style | QA PASS, Cal approved |
| 2026-11-25 | bl_pc_woodblock (Woodblock Tide) | player-card banners, level 15 | Edo-period woodblock prints | flat carved colour, stylised waves and clouds; a first try came out close to the famous great-wave print and was redone as a calm cove | style | turned down by Cal 11-25, removed (1cf2de3d) |
| 2026-11-25 | bl_pc_ink_bamboo (Bamboo Mist) | player-card banners, level 15 | East Asian ink-wash (sumi-e) painting tradition | brush-and-ink look; dark bamboo grove of our own, no lantern, seals or calligraphy | style | QA PASS |
| 2026-11-25 | bl_pc_ink_lake (Lone Boat Lake) | player-card banners, level 15 | East Asian ink-wash (sumi-e) painting tradition | brush-and-ink look; moonlit lake, boat and crane of our own, no seals or calligraphy | style | QA PASS |
| 2026-11-25 | bl_pc_ink_storm (Storm Peaks) | player-card banners, level 20 | East Asian ink-wash (sumi-e) painting tradition | brush-and-ink look; storm over peaks; no seals or calligraphy | style | with QA |
| 2026-11-25 | bl_pc_ink_snow (Winter Night Valley) | player-card banners, level 20 | East Asian ink-wash (sumi-e) painting tradition | brush-and-ink look; snowy night valley with dark crimson plum; no seals or calligraphy | style | with QA |
| 2026-11-25 | bl_pc_hoard_ink (Dragon's Hoard) | player-card banners, level 10 | East Asian ink-wash (sumi-e) painting tradition | brush-and-ink look; cave hoard in ink with gold leaf, a long whiskered dragon of our own; no seals or calligraphy | style | with QA |
| 2026-11-25 | bl_pc_paper_city (Night City) | player-card banners, level 20 | Art Deco Manhattan skyline (Empire State and Chrysler-style spires) | layered papercut night skyline; the two tallest spires lean on those towers' silhouettes; no names, signs or logos | style | with QA |
| 2026-11-25 | ui_banner_cr_p (CHROME RAIN Boutique portrait) | Boutique brand background | the circle / triangle / square shapes of a well-known survival-game TV show | a pink ring, a cyan triangle and a cyan bar among the city's neon; plain geometry, no masks, guards or other show elements | style | with QA |
| 2026-11-25 | bld_bg_mall (+ _winter) | building backdrop, the Mall | Griffith Observatory on the Hollywood Hills, Los Angeles | a small domed observatory on the hilltop above a palm-lined boulevard; painted soft, no names or signs | landmark | summer approved earlier; winter QA PASS |
| 2026-11-25 | bld_bg_plaza (+ _winter) | building backdrop, the Plaza | the downtown Los Angeles skyline | the tall towers behind the market street lean on downtown LA's skyline; no names or logos | landmark | summer approved earlier; winter QA PASS |
| 2026-11-27 | brand nc NICE COCK (name, rooster logo, wordmark `nicecock.` on gx_nc_cap) | Shop (Boutique drops), Vault | NICE COCK, Cal's own real brand (docs/BRANDS_15.md, docs/ref/nicecock/) | its name, rooster and lowercase wordmark, at Cal's request (11-06: "add a new brand called NICE COCK") | close | Cal's own mark, approved by Cal; keep unless he says otherwise (QA NOTE b5975d05) |
| 2026-11-27 | ui_tr_drowned_set (Drowned Captain emblem) | Crawls relic box, Armory | the Jolly Roger pirate flag (historic, public domain) | skull, tricorn and crossed cutlasses on a brass medallion | style | QA PASS 6e9356cd |
