# Working on Quest Board with two Claude chats

Two Claude Code chats work in **one folder on Cal's computer** at the same time, each on its own part of the game.
They see each other's changes the moment they are saved, so rooms and outfits are always tested together, and both
can generate art in Cal's Chrome.

| Chat | Owns |
|---|---|
| **ROOMS** (also the lead) | The building and every room, room upgrades and wall art, the task board, everything else not listed under SHOP, and **publishing to Cal's phone** |
| **SHOP** | The Shop, clothes and outfits, brand banners, and their art. Never publishes. |

Later, a third chat (LEAD, for the board and quality of life) can take the lead's jobs off ROOMS. Start with two.

---

## Part 1: setup, done once (Cal)

**Step 0. Leave the cloud.** The cloud chat that wrote this file has stopped. Don't start cloud sessions on this
repo while the local chats are working.

**Step 1. Check the old Dropbox folder for anything not saved to GitHub.**
1. In Claude Code on your computer, start a session on the old folder: `Dropbox/SAYWHAT`.
2. Paste this:
   > Run `git status` and `git log origin/main..HEAD`. Tell me in plain words whether this folder has any changes
   > that are not on GitHub. Do not change anything.
3. If it says **nothing unsaved**: close that session. Done.
   If it lists changes, paste this, then close it:
   > Save those changes on a new branch called `dropbox-leftovers` and push that branch. Do not touch `main`.

**Step 2. Make the new home for the code, outside Dropbox.**
Why not Dropbox: Dropbox copies files while two chats and git are writing them. That makes "conflicted copy" files and
can break git. The code lives in a normal folder; GitHub is its backup.

- Install **GitHub Desktop** (desktop.github.com) and sign in with your GitHub account.
- File > Clone repository > `CalvinHtet/SAYWHAT`, with Local path `Documents/Code`. Click Clone.
  You now have `Documents/Code/SAYWHAT`.

**Step 3. Copy the big art folders from Dropbox (SHOP needs them).**
Copy these from `Dropbox/SAYWHAT/quest-board/art/` into `Documents/Code/SAYWHAT/quest-board/art/`:
`raw`, `layers` and `parts` (if it exists). They are not on GitHub on purpose (838 MB). Git ignores them.

**Step 4. Check Chrome is ready.** Chrome open with the Claude in Chrome extension connected, signed into
Higgsfield, the **Unlimited toggle on**. Both chats use it, one at a time.

**Step 5. Open the two chats.** Start two Claude Code sessions, both on `Documents/Code/SAYWHAT`. Name them ROOMS and
SHOP. Paste each one's starter prompt (Part 3) as its first message.

**Every day after that:**
- Talk to each chat only about its own area.
- Want to try it on your phone? Tell **ROOMS**: *"Publish."*
- Done for the day? Tell **ROOMS**: *"Wrap up: make sure everything from both chats is committed and pushed."*

---

## Part 2: the rules both chats follow

1. **Read first.** Before any work, read `CLAUDE.md`, this file, `quest-board/docs/TASKS.md` and
   `quest-board/docs/HANDOFF.md`.
2. **Stay in your own files** (the list in Part 4). If you need a change in the other chat's file, write it under that
   chat's *Requests* in `TASKS.md` and tell Cal. A one-line fix is fine: re-read the file right before editing, keep it
   tiny, and note it in `TASKS.md`.
3. **Shared files** (`app/index.html`, `docs/HANDOFF.md`, `docs/TASKS.md`): re-read right before every edit and keep
   edits small. New CSS goes at the end of the `<style>` block in `app/index.html`, under a comment with your name
   (`/* SHOP */`, `/* ROOMS */`). If Claude Code says a file changed since you read it, the other chat is at work:
   re-read and redo your edit. That is normal.
4. **Git, carefully. Both chats share one folder, so one careless command can wipe the other chat's unsaved work.**
   - Commit only your own files: `git add <your files>`. Never `git add -A` or `git add .`.
   - Push right after each commit.
   - Never run anything that changes files you didn't edit: no `git checkout <file>`, `git restore`, `git reset`,
     `git stash`, `git clean`, `git rebase`, `git pull --rebase`, and no switching branches.
   - If git says `index.lock` exists, the other chat is committing. Wait ten seconds and try again.
   - Only ROOMS pulls from GitHub, and only when Cal says something changed elsewhere.
5. **Only ROOMS publishes.** Only ROOMS bumps `APPV`, builds the release and publishes to the phone page. The last
   publish wins, so two publishers wipe each other out. SHOP writes `READY TO PUBLISH: <what>` in `TASKS.md` instead.
   Either chat can build and test locally any time (`python3 quest-board/tools/build.py`), each on its own port:
   ROOMS 8765, SHOP 8766 (`python3 -m http.server 8766 --bind 127.0.0.1` from `quest-board/`).
6. **Chrome is shared: one image generator at a time.** Before generating, write `CHROME: SHOP (since 3:10 pm)` (or
   ROOMS) at the top of `TASKS.md`. Change it back to `CHROME: free` when done. If the other chat holds Chrome, wait.
7. **The rules in `CLAUDE.md` still apply:** no spending Higgsfield credits, original designs only, Cal's tone, and
   honest status.
8. **Saves are sacred** (`quest-board/docs/RELEASING.md`): never bump `QB_EPOCH`, and never rename or delete an item or
   upgrade id.
9. **When a piece is done:** tick it in `TASKS.md` and add a line to `HANDOFF.md`.
10. **Cal has the final say on art.** Show new art before putting it in the game.

---

## Part 3: starter prompts (paste one into each new chat)

**ROOMS**
> You are ROOMS on Quest Board, and the lead. Read CLAUDE.md, TEAMWORK.md, quest-board/docs/TASKS.md and
> quest-board/docs/HANDOFF.md first. You own the building view, every room, room upgrades and wall art, the task
> board, and publishing to my phone. You are the only chat that publishes or bumps APPV. Another chat, SHOP, works in
> this same folder on the Shop and outfits: follow the TEAMWORK rules so you never touch its work. Show me your open
> tasks in a few lines and ask what to do first.

**SHOP**
> You are SHOP on Quest Board. Read CLAUDE.md, TEAMWORK.md, quest-board/docs/TASKS.md and quest-board/docs/HANDOFF.md
> first. You own the Shop, clothes and outfits, brand banners, and their art. Another chat, ROOMS, works in this same
> folder and is the only one that publishes. Follow the TEAMWORK rules: your own files only, careful git, never
> publish, claim Chrome in TASKS.md before generating. Show me your open tasks in a few lines and ask what to do first.

---

## Part 4: who owns which files

All paths are inside `quest-board/`. **Anything not listed under SHOP belongs to ROOMS.**

| | SHOP | ROOMS |
|---|---|---|
| Code | `app/src/15_shop.js`, `src/rig.js`, `src/look.js`, `src/creator.js` | every other file in `app/src/`, `src/loft_bridge.js` |
| Data | `data/items.json`, `creator.json`, `bodies.json`, `poses.json`, `rig.json` | `data/loft.json`, `rsart.json`, `exercises.json` |
| Art (`art/app/`) | `m_*`, `f_*`, `icon_*`, `logo_*`, `ui_banner_*` | room sprites (`*x_*`, `fix_*`, `clx_*`), walls, `lair_*`, other `ui_*` pictures, `ex_*` |
| Tools | `tools/items.py`, `ingest_items.py`, `pack.py`, `strip_mannequin.py` and the other item tools | `tools/build.py`, `rs_art.py`, `rs_fix.py`, `closet_stages.py` |
| Docs | | `TEAMWORK.md`, `docs/RELEASING.md` |
| Shared | `app/index.html`, `docs/HANDOFF.md`, `docs/TASKS.md`: both, small careful edits (rule 3) | |

---

## If something goes wrong

- **The phone shows an old version.** Close the page and reopen it. ROOMS checks that the header shows the newest
  `v` number.
- **A publish broke something.** Tell ROOMS *"republish the previous version"*. The page keeps every version.
- **A change broke the game.** Tell ROOMS *"undo the last commit from SHOP"* (or from ROOMS). Every commit can be undone.
- **Both chats changed the same thing.** Nothing is lost if both committed. ROOMS sorts it out from `git log`.
- **Unsure?** Ask Cal before running anything that could touch the other chat's files.
