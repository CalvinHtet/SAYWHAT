# Working on Quest Board with two Claude chats

Two Claude Code chats work in **one folder on Cal's computer** at the same time, each on its own part of the game.
They see each other's changes the moment they are saved, so art and code are always tested together.

| Chat | Owns |
|---|---|
| **LEAD** | The task board, quality of life, the Shop and Training code and everything else in the app, the docs, and **publishing to Cal's phone**. The only chat that publishes, bumps `APPV` or pulls from GitHub. Never generates art. |
| **ROOMS** | **All art generation** (rooms, walls, outfits, items, banners, ui pictures), the art tools and the room code. The only chat that uses Chrome or Higgsfield. Wear-tests the outfits it brings in. Never publishes. |

---

## Part 1: setup, done once (Cal)

**Step 0. Leave the cloud.** Don't start cloud sessions on this repo while the local chats are working.

**Step 1. Check the old Dropbox folder for anything not saved to GitHub.** Done 2026-11-05: its leftovers are on the
`dropbox-leftovers` branch. Keep the old folder until LEAD says otherwise: `dist/lfvar.json` has no other copy besides the
published page.

**Step 2. The home for the code is outside Dropbox.**
Why not Dropbox: Dropbox copies files while two chats and git are writing them. That makes "conflicted copy" files and
can break git. The code lives in a normal folder (`Documents/github/saywhat`); GitHub is its backup.

**Step 3. The big art folders (ROOMS needs them).** Copied from Dropbox on 2026-11-05 and checked file for file:
`quest-board/art/raw` and `quest-board/art/layers`. They are not on GitHub on purpose (about 1.4 GB). Git ignores them.

**Step 4. Check Chrome is ready.** Chrome open with the Claude in Chrome extension connected, signed into
Higgsfield, the **Unlimited toggle on**. Only ROOMS uses it.

**Step 5. Open the two chats.** Start two Claude Code sessions, both on `Documents/github/saywhat`. Name them LEAD and
ROOMS. Paste each one's starter prompt (Part 3) as its first message.

**Every day after that:**
- Talk to each chat only about its own area. Art goes to ROOMS, everything else to LEAD.
- Want to try it on your phone? Tell **LEAD**: *"Publish."*
- Done for the day? Tell **LEAD**: *"Wrap up: make sure everything from both chats is committed and pushed."*

---

## Part 2: the rules both chats follow

1. **Read first.** Before any work, read `CLAUDE.md`, this file, `quest-board/docs/TASKS.md` and
   `quest-board/docs/HANDOFF.md`.
2. **Stay in your own files** (the list in Part 4). If you need a change in the other chat's file, write it in `TASKS.md`
   and tell Cal: LEAD writes under *Art requests*, ROOMS under *Requests for LEAD*. A one-line fix is fine: re-read the
   file right before editing, keep it tiny, and note it in `TASKS.md`. That covers the line ROOMS adds to `EXTRA_ITEMS` in
   `app/src/15_shop.js` for a cosmetic Cal approved.
3. **Shared files** (`app/index.html`, `docs/HANDOFF.md`, `docs/TASKS.md`): re-read right before every edit and keep
   edits small. New CSS goes at the end of the `<style>` block in `app/index.html`, under a comment with your name
   (`/* LEAD */`, `/* ROOMS */`). If Claude Code says a file changed since you read it, the other chat is at work:
   re-read and redo your edit. That is normal.
4. **Git, carefully. Both chats share one folder, so one careless command can wipe the other chat's unsaved work.**
   - Commit only your own files: `git add <your files>`. Never `git add -A` or `git add .`.
   - Commit only finished, tested work. Push right after each commit.
   - Never run anything that changes files you didn't edit: no `git checkout <file>`, `git restore`, `git reset`,
     `git stash`, `git clean`, `git rebase`, `git pull --rebase`, and no switching branches.
   - If git says `index.lock` exists, the other chat is committing. Wait ten seconds and try again.
   - Only LEAD pulls from GitHub, and only when Cal says something changed elsewhere.
5. **Only LEAD publishes.** Only LEAD bumps `APPV`, builds the release and publishes to the phone page. The last
   publish wins, so two publishers wipe each other out. ROOMS writes
   `READY TO PUBLISH: <what>, look at: <what>` in `TASKS.md` instead.
   - Publish only committed work: build from a clean temporary copy of the latest commit (`git worktree add` into a temp
     folder outside this folder), never from the working folder. Follow `quest-board/docs/RELEASING.md`.
   - After each publish, LEAD sends Cal a checklist: one line per change and what to look at on the phone, plus what ROOMS
     still has in progress.
   - Either chat can build and test locally any time (`python3 quest-board/tools/build.py`), each on its own port:
     ROOMS 8765, LEAD 8766 (`python3 -m http.server 8766 --bind 127.0.0.1` from `quest-board/`).
6. **Chrome and Higgsfield are ROOMS only.** LEAD never generates art: when the app needs art, LEAD adds it under
   *Art requests* in `TASKS.md`.
7. **The rules in `CLAUDE.md` still apply:** no spending Higgsfield credits, original designs only, Cal's tone, and
   honest status.
8. **Saves are sacred** (`quest-board/docs/RELEASING.md`): never bump `QB_EPOCH`, and never rename or delete an item or
   upgrade id.
9. **When a piece is done:** tick it in `TASKS.md` and add a line to `HANDOFF.md`.
10. **Cal has the final say on art.** Show new art before putting it in the game.

---

## Working on your own

These apply to every chat, in Cal's words.

**Keep working**
1. Work without stopping. Finish a task, commit it, take the next one from your list in `quest-board/docs/TASKS.md`
   (top first), and carry on. Don't ask whether to continue.
2. Stop and ask Cal only when something really needs him:
   - Art to approve (see Approvals). Keep working on other tasks while you wait.
   - A decision only he can make.
   - Anything that costs money or credits, or needs a login.
   - Something broken you can't fix after two honest tries.
   - Anything that would delete work, or a clash with another chat's files.

   When you stop, say in one or two lines exactly what you need.
3. Commit only finished, tested work, never half-done work. Keep your "Doing" line in `TASKS.md` current: set it when you
   start, clear it when you commit.
4. ROOMS claims Chrome in `TASKS.md` before generating (`CHROME: ROOMS (since <time>)`) and sets it back to `CHROME: free`
   when done.

**Approvals**
- Show every art set as one image with all tiers or versions side by side, in order, each labeled (Tier 1, Tier 2, and
  so on), so Cal can point at the ones that look wrong. Redo only the ones he flags. An outfit shows every angle on both
  bodies; the banners show all five together.
- Nothing goes into the game before he approves it. Save up approvals so he sees several at once.

**Testing and ready**
- Before calling an outfit ready, ROOMS tests every combination and every pose on both bodies, and tells Cal honestly what
  it checked and what it didn't.
- When a piece is committed and tested, ROOMS adds under *Ready to publish* in `TASKS.md`:
  `READY TO PUBLISH: <what>, look at: <what to check on the phone>`. LEAD decides when to publish.

**When your list runs out**

Suggest your own tasks, quality first. Don't add new systems or redesign something big without asking Cal. Write what you
find into `TASKS.md` as tasks and work through them.

ROOMS:
- For each room, look up reference images of real isometric rooms of that kind (search "isometric nightclub", "isometric
  arcade", "isometric movie theater", "isometric bedroom" and so on). Compare his room against them: layout, where things
  stand and which way they face, spacing and walk paths, level of detail, lighting, and how full and alive it feels. Fix
  what you can, and put art ideas on the board for his approval. References are for study only: never copy anyone's art,
  original designs only.
- Run the room audits in `quest-board/rigtest/browser` (gaps, depth, stations, guests), and look at every room at every
  upgrade tier, not only fully upgraded.
- Wear-test every item again on both bodies in every pose, and fix clipping, streaks and misaligned pieces. Compare items
  against chibi outfit sheets and fashion lookbooks matching each brand's style: study only, no brand logos.

LEAD:
- Go through every tab at phone width looking for bugs, broken layouts, confusing text and slow screens.
- Check the buy flows, Prove it, Training and saving. Fix what you find. Ask Cal before adding new systems.

---

## Part 3: starter prompts (paste one into each new chat)

**LEAD**
> You are LEAD on Quest Board. Read CLAUDE.md, TEAMWORK.md, quest-board/docs/TASKS.md and quest-board/docs/HANDOFF.md
> first. You own the task board, quality of life, the Shop and Training code and everything else in the app, the docs,
> and publishing to my phone. You are the only chat that publishes, bumps APPV or pulls from GitHub. You never generate
> art: when the app needs art, add it under "Art requests" in TASKS.md. Another chat, ROOMS, works in this same folder on
> all art and the room code: follow the TEAMWORK rules so you never touch its work. Show me your open tasks in a few lines,
> then start.

**ROOMS**
> You are ROOMS on Quest Board. Read CLAUDE.md, TEAMWORK.md, quest-board/docs/TASKS.md and quest-board/docs/HANDOFF.md
> first. You do all art generation (rooms, walls, outfits, items, banners, ui pictures) and own every file in art/app, the
> art tools and the room code. You are the only chat that uses Chrome or Higgsfield, and you wear-test the outfits you
> bring in. Another chat, LEAD, works in this same folder and is the only one that publishes. Follow the TEAMWORK rules:
> your own files only, careful git, never publish, claim Chrome in TASKS.md before generating, and mark finished work
> "READY TO PUBLISH: <what>, look at: <what>". Show me your open tasks in a few lines, then start.

---

## Part 4: who owns which files

All paths are inside `quest-board/`. **Anything not listed under ROOMS belongs to LEAD.**

| | LEAD | ROOMS |
|---|---|---|
| Code | every other file in `app/src/` (`00_clock.js`, `10_app_a.js`, `15_shop.js`, `16_interface.js`, `24_screens.js`, `25_splash.js`, `28_missions.js`, `29_prices.js`, `30_app_b.js`), `src/rig.js`, `src/look.js`, `src/creator.js` | `app/src/20_loft.js`, `21_restaurant.js`, `22_garden.js`, `23_theater.js`, `26_world.js`, `27_rooms.js`, `27b_skins.js`, `src/loft_bridge.js` |
| Data | `data/rig.json`, `bodies.json`, `poses.json`, `creator.json`, `exercises.json` | `data/items.json`, `loft.json`, `rsart.json` |
| Art | none | every file in `art/app/`, and `art/raw`, `art/layers`, `art/ref`, `art/sil` |
| Tools | `tools/build.py` | `tools/rs_art.py`, `rs_fix.py`, `closet_stages.py`, `items.py`, `ingest_items.py`, `pack.py`, `strip_mannequin.py` and the other item tools |
| Docs | `TEAMWORK.md`, `CLAUDE.md`, `docs/RELEASING.md`, `ADDING_CONTENT.md`, `ECONOMY.md` and the rest of `docs/` | |
| Shared | `app/index.html`, `docs/HANDOFF.md`, `docs/TASKS.md`: both, small careful edits (rule 3) | |

---

## If something goes wrong

- **The phone shows an old version.** Close the page and reopen it. LEAD checks that the header shows the newest
  `v` number.
- **A publish broke something.** Tell LEAD *"republish the previous version"*. The page keeps every version.
- **A change broke the game.** Tell LEAD *"undo the last commit from ROOMS"* (or from LEAD). Every commit can be undone.
- **Both chats changed the same thing.** Nothing is lost if both committed. LEAD sorts it out from `git log`.
- **Art looks wrong or Chrome is stuck.** Tell ROOMS. LEAD never touches Chrome or Higgsfield.
- **Unsure?** Ask Cal before running anything that could touch the other chat's files.
