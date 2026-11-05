# Working on Quest Board with three Claude chats

Three Claude Code chats work in **one folder on Cal's computer** at the same time, each on its own part of the game.
They see each other's changes the moment they are saved, so rooms and outfits are always tested together.

| Chat | Name | Owns |
|---|---|---|
| 1 | **LEAD** | The task board, quality-of-life changes, and publishing to Cal's phone |
| 2 | **SHOP** | The Shop, clothes and outfits, and generating their art |
| 3 | **ROOMS** | The building, every room, room upgrades, and generating room and wall art |

Three is safe with the rules below. LEAD is what keeps it safe: one chat decides when the phone gets a new version.
If it ever feels chaotic, close LEAD and let ROOMS publish; two chats is fine too.

---

## Part 1: setup, done once (Cal)

**Step 0. Stop the cloud.** The cloud chat that wrote this file has stopped changing the game. Don't start cloud
sessions on this repo while the local chats are working: a fourth cook in the kitchen is how things get lost.

**Step 1. Check the old Dropbox folder for anything not saved to GitHub.**
1. In Claude Code, start a session on the old folder: `Dropbox/SAYWHAT`.
2. Paste this:
   > Run `git status` and `git log origin/main..HEAD`. Tell me in plain words whether this folder has any changes
   > that are not on GitHub. Do not change anything.
3. If it says **nothing unsaved**: close that session. Done.
   If it lists changes, paste this, then close it:
   > Save those changes on a new branch called `dropbox-leftovers` and push that branch. Do not touch `main`.

**Step 2. Make the new home for the code, outside Dropbox.**
Why not Dropbox: Dropbox copies files while three chats and git are writing them. That makes "conflicted copy" files
and can break git. The code lives in a normal folder; GitHub is its backup.

- Easiest: open **GitHub Desktop**, then File > Clone repository > `CalvinHtet/SAYWHAT`, with Local path
  `Documents/Code`. You get `Documents/Code/SAYWHAT`.
- Or ask any Claude Code session: *"Clone https://github.com/CalvinHtet/SAYWHAT into ~/Documents/Code."*

**Step 3. Copy the big art folders from Dropbox (only SHOP needs them).**
Copy these from `Dropbox/SAYWHAT/quest-board/art/` into `Documents/Code/SAYWHAT/quest-board/art/`:
`raw`, `layers` and `parts` (if it exists). They are not on GitHub on purpose (838 MB). Copying is safe: git ignores
them.

**Step 4. Open the three chats.** Start three Claude Code sessions, all on `Documents/Code/SAYWHAT`. Name them
LEAD, SHOP and ROOMS. Paste each one's starter prompt (Part 3) as its first message.

**Step 5. Every day after that:**
- Talk to each chat only about its own area.
- Want to try it on your phone? Tell **LEAD**: *"Publish."*
- Done for the day? Tell **LEAD**: *"Wrap up: make sure everything is committed and pushed."*

---

## Part 2: the rules every chat follows

1. **Read first.** Before any work, read `CLAUDE.md`, this file, `quest-board/docs/TASKS.md` and
   `quest-board/docs/HANDOFF.md`.
2. **Stay in your own files** (the list in Part 4). If you need a change in another chat's file, write it under that
   chat's *Requests* in `TASKS.md` and tell Cal. A one-line fix is fine: re-read the file right before editing, keep it
   tiny, and note it in `TASKS.md`.
3. **Shared files** (`app/index.html`, `docs/HANDOFF.md`, `docs/TASKS.md`): re-read right before every edit and keep
   edits small. New CSS goes at the end of the `<style>` block in `app/index.html`, under a comment with your name
   (`/* SHOP */`, `/* ROOMS */`). If Claude Code says a file changed since you read it, that is another chat at work:
   re-read and redo your edit. That is normal.
4. **Git, carefully. Three chats share one folder, so one careless command can wipe another chat's unsaved work.**
   - Commit only your own files: `git add <your files>`. Never `git add -A` or `git add .`.
   - Push right after each commit.
   - Never run anything that changes files you didn't edit: no `git checkout <file>`, `git restore`, `git reset`,
     `git stash`, `git clean`, `git rebase`, `git pull --rebase`, and no switching branches.
   - If git says `index.lock` exists, another chat is committing. Wait ten seconds and try again.
   - Only LEAD pulls from GitHub, and only when Cal says something changed elsewhere.
5. **Only LEAD publishes.** Only LEAD bumps `APPV`, builds the release and publishes to the phone page. The last
   publish wins, so two publishers wipe each other out.
   SHOP and ROOMS can build and test locally any time (`python3 quest-board/tools/build.py`), each on its own port:
   LEAD 8765, SHOP 8766, ROOMS 8767 (`python3 -m http.server 8766 --bind 127.0.0.1` from `quest-board/`).
6. **Chrome is shared: one image generator at a time.** Before generating, write `CHROME: SHOP (since 3:10 pm)` (or
   ROOMS) at the top of `TASKS.md`. Remove it when done. If the other chat holds Chrome, wait or ask Cal.
7. **The rules in `CLAUDE.md` still apply:** no spending Higgsfield credits, original designs only, Cal's tone, and
   honest status.
8. **Saves are sacred** (`quest-board/docs/RELEASING.md`): never bump `QB_EPOCH`, and never rename or delete an item or
   upgrade id.
9. **When a piece is done:** tick it in `TASKS.md`, add `READY TO PUBLISH: <what>` under LEAD, and add a line to
   `HANDOFF.md`.
10. **Cal has the final say on art.** Show new art before putting it in the game.

---

## Part 3: starter prompts (paste one into each new chat)

**LEAD**
> You are LEAD on Quest Board. Read CLAUDE.md, TEAMWORK.md, quest-board/docs/TASKS.md and quest-board/docs/HANDOFF.md
> first. You own the task board, quality-of-life changes, and publishing to my phone. You are the only chat that
> publishes or bumps APPV. Show me the board in a few lines and ask what to do first.

**SHOP**
> You are SHOP on Quest Board. Read CLAUDE.md, TEAMWORK.md, quest-board/docs/TASKS.md and quest-board/docs/HANDOFF.md
> first. You own the Shop, clothes and outfits, and their art. Follow the TEAMWORK rules: your own files only, careful
> git, never publish, claim Chrome in TASKS.md before generating. Tell me your open tasks and ask what to do first.

**ROOMS**
> You are ROOMS on Quest Board. Read CLAUDE.md, TEAMWORK.md, quest-board/docs/TASKS.md and quest-board/docs/HANDOFF.md
> first. You own the building view, every room, room upgrades and room and wall art. Follow the TEAMWORK rules: your
> own files only, careful git, never publish, claim Chrome in TASKS.md before generating. Tell me your open tasks and
> ask what to do first.

---

## Part 4: who owns which files

All paths are inside `quest-board/`.

| | LEAD | SHOP | ROOMS |
|---|---|---|---|
| Code | `app/src/00_clock.js`, `10_app_a.js`, `16_interface.js`, `24_screens.js`, `25_splash.js`, `28_missions.js`, `29_prices.js`, `30_app_b.js` | `app/src/15_shop.js`, `src/rig.js`, `src/look.js`, `src/creator.js` | `app/src/20_loft.js`, `21_restaurant.js`, `22_garden.js`, `23_theater.js`, `26_world.js`, `27_rooms.js`, `27b_skins.js`, `src/loft_bridge.js` |
| Data | `data/exercises.json` | `data/items.json`, `creator.json`, `bodies.json`, `poses.json`, `rig.json` | `data/loft.json`, `rsart.json` |
| Art (`art/app/`) | `ui_*` pictures (with a Chrome turn) | `m_*`, `f_*`, `icon_*`, `logo_*`, `ui_banner_*`, `ex_*` | room sprites (`*x_*`, `fix_*`, `clx_*`), walls, `lair_*` |
| Tools | `tools/build.py` | `tools/items.py`, `ingest_items.py`, `pack.py`, `strip_mannequin.py` and the other item tools | `tools/rs_art.py`, `rs_fix.py`, `closet_stages.py` |
| Docs | `TEAMWORK.md`, `docs/TASKS.md` (the board), `docs/RELEASING.md` | | |
| Shared | `app/index.html`, `docs/HANDOFF.md`, `docs/TASKS.md`: everyone, small careful edits (rule 3) | | |

If a file isn't listed, ask LEAD before changing it.

---

## If something goes wrong

- **The phone shows an old version.** Close the page and reopen it. LEAD checks that the header shows the newest
  `v` number.
- **A publish broke something.** Tell LEAD *"republish the previous version"*. The page keeps every version.
- **A change broke the game.** Tell LEAD *"undo the last commit from SHOP"* (or ROOMS). Every commit can be undone.
- **Two chats changed the same thing.** Nothing is lost if both committed. LEAD sorts it out from `git log`.
- **Unsure?** Ask Cal before running anything that could touch another chat's files.
