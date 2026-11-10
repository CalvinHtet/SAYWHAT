# SPEC 2 for LEAD (from ARCHITECT, Cal 2026-11-10 ~09:45): drops Mon/Thu 8 am, chests 100/200/300, relic tiers, bigger upgrades earn more, HANGANG splash

Cal's words in quotes. Amends `2026-11-10_SPEC_levels_daily_rooms_pact_mystic.md` part B. Not yet decided by Cal (do NOT build
yet): which relics exist and what each does, drop rates, coin/price scaling (ARCHITECT is brainstorming those with Cal).

## 1. Brand drops: Monday and Friday at 8 am, 2 active, Wednesday vault (W20, branch w-drops 98b8558) [CORRECTED 09:50]
Cal: "change that to every Monday and Friday for the new drops. Wednesday is the wednesday vault where an old brand comes back to
town. This only applies after some brands cycle out of rotation ... only 2 active brands at a time ... the wednesday vault would
make it 3 active brands. And then other days of the week, the vault dissapears. So there would be at most 3 brands on wednesday
and 2 brands every other day of the week (except the first week where there is only one brand)".
- New brand Monday and Friday, 8:00 am Pacific. DROPS.live 2: the two newest are for sale; older ones retire to the vault.
- Wednesday only (from the game day's start until the next): one retired brand comes back; gone the other days. Only once a
  brand has retired. HANGANG alone the day the Closet is built, as before.
- Defaults from ARCHITECT until Cal answers: the first new brand waits at least 3 days after HANGANG; the vault picks the brand
  retired longest ago (not random), so every brand returns in turn.
- Texts and countdowns: "New brands Mon and Fri, 8 am. The vault opens Wednesdays."

## 2. Daily Quest chests: 100 / 200 / 300 (replaces part B's 100/150/200)
Cal: "I would like the daily quest to be 100, 200, and 300. the 100exp daily quest should grant 200 coins, And the 200 exp should
grant 400 coins, and then the 300 exp should grant 600 plus either a low tier, mid tier, or high tier relic, or an accessory we
don't own yet from any clothing brand that has dropped or not dropped yet."
- 100 XP: Daily Quest complete, 200 coins. 200 XP: 400 coins. 300 XP: 600 coins + one roll: a low, mid or high tier relic (part 3)
  or an accessory the player does not own from ANY brand (dropped or not yet dropped: Cal's call). Owning everything in the pool
  -> coins.
- Drop rates: put them in ECON (`ECON.chest3`), starting point until Cal decides: accessory 50%, low relic 33%, mid 13%, high 4%.
- INT bonus applies to coins as today. Hidden quest: was 2x goal; move it to 400 XP (above the top chest).
- Town efficiency still keys off dqGoal (part B's flag): with goal 100, check W21's 30% passive cap.
- Part B's "items only from dropped brands" and the 50% fallback are replaced by this.

## 3. Relic tiers: low, mid, high, legendary (framework now, content later)
Cal: "create multiple tiers of relics or low, mid, high, and legendary relics. Just put a placeholder picture there for now but leave
a note for my claude on mac to take over and generate images later on."
- Today "Relics" are milestone tiers (DGRELICS, 29d_dungeon.js:116) and Hollow Amulet shards; nothing droppable by rarity. Build a
  data-driven list, e.g. `RELICS2=[{id, name, tier:"low|mid|high|legendary", d, buff:{...}}]`, a save field for owned ones, a
  collection view in the Relics tab grouped by tier (tier colours), and the 300-chest roll above. A duplicate gives coins by tier.
- Placeholder icon: a drawn stand-in in the tier's colour (as dgRelicIcon does today), swapped by `ui_relic2_<id>.webp` when it
  exists. Legendary: not from the daily chest; where it drops is still open (ARCHITECT/Cal).
- Ship with 2-3 placeholder relics per tier until Cal picks the real list (ARCHITECT sends it); buffs small and in ECON.
- Mac note: add a section to the art list (docs, like W23): one icon per relic, 256x256, the game's painted style, no text, tier
  rim colour; names/descriptions come with the final list.

## 4. Bigger upgrades earn more
Cal: "bigger upgrades should give bigger passive buffs. Such as the imax screen should definitely start generating more income."
- Today an earning upgrade's income share is `p` (29_prices.js:33-37 moves decor's share onto equipment) and is not tied to how
  big it is. Make each earning upgrade's share follow its kind (econKind: furniture < equipment < big < grand), so the IMAX Screen
  and Laser Projector are the biggest earners in the Auditorium. Same total income per fully upgraded room unless econsim says
  otherwise; the upgrade card's "Earns +x% here" stays true. Fold into w-econ (W21's passive cap still holds).

## 5. Bug: no HANGANG splash on the first drop
Cal: "We are also not seeing the hangang splash screen for the first clothing drop. If that is already fixed, then nevermind."
- Check which build Cal's phone runs: HANGANG-first (397b92e) is in v0.88, which was zipped, maybe never deployed.
- If on v0.88+: brandCheck (25_splash.js:36) marks every live brand seen and shows only the newest fresh one, so a save whose Shop
  opens with more than one live brand (shopKeep carry-over, or drop days passing before the first check) never sees HANGANG.
  Also check the splash timer (29l_drops.js:110) when the Closet is built while a modal is open. QA: a fresh save, build the
  Closet, the HANGANG splash shows once.

## Acceptance checks
- Drops land Mon and Thu at 8:00 Pacific, not before; HANGANG day unchanged; texts say so.
- Chests open at 100/200/300 with 200/400/600 coins (x INT); the 300 roll follows ECON.chest3 over 1,000 rolls; never an owned
  accessory; undo below a tier takes its chest back; hidden quest at 400.
- Relic collection shows tiers with placeholders; a dropped relic is kept and its buff applies; duplicates pay coins.
- Auditorium: IMAX pieces earn more than smaller upgrades; room total within 5% of before unless econsim changes it on purpose.
- HANGANG splash on a fresh save, once.
