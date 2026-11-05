# Working on Quest Board with three Claude chats

Three Claude Code chats work in **one folder on Cal's computer** at the same time, each on its own part of the game.
They see each other's changes the moment they are saved, so art and code are always tested together.

| Chat | Owns |
|---|---|
| **LEAD** | The task board, quality of life, the Shop and Training code and everything else in the app, the docs, and **publishing to Cal's phone**. The only chat that publishes, bumps `APPV` or pulls from GitHub. Never generates art. |
| **ROOMS** | **All art generation** (rooms, walls, outfits, items, banners, ui pictures), the art tools and the room code. The only chat that uses Chrome or Higgsfield. Wear-tests the outfits it brings in. Never publishes. |
| **QA** | **Testing, pilots and quality checks, all the time.** Buys every upgrade and item one step at a time, times every screen at phone speed, re-runs the checks after every commit and publish, and compares rooms with real isometric references. Owns `rigtest/qa/` and `docs/QA.md`. Never changes game code, data or art, never publishes, never uses Chrome or Higgsfield. |

---

## Part 1: setup, done once (Cal)

**Step 0. Leave the cloud.** Don't start cloud sessions on this repo while the local chats are working.

**Step 1. Check the old Dropbox folder for anything not saved to GitHub.** Done 2026-11-05: its leftovers are on the
`dropbox-leftovers` branch. Keep the old folder until LEAD says otherwise: `dist/lfvar.json` has no other copy besides the
published page.

**Step 2. The home for the code is outside Dropbox.**
Why not Dropbox: Dropbox copies files while the chats and git are writing them. That makes "conflicted copy" files and
can break git. The code lives in a normal folder (`Documents/github/saywhat`); GitHub is its backup.

**Step 3. The big art folders (ROOMS needs them).** Copied from Dropbox on 2026-11-05 and checked file for file:
`quest-board/art/raw` and `quest-board/art/layers`. They are not on GitHub on purpose (about 1.4 GB). Git ignores them.

**Step 4. Check Chrome is ready.** Chrome open with the Claude in Chrome extension connected, signed into
Higgsfield, the **Unlimited toggle on**. Only ROOMS uses it.

**Step 5. Open the chats.** Start three Claude Code sessions, all on `Documents/github/saywhat`. Name them LEAD,
ROOMS and QA. Paste each one's starter prompt (Part 3) as its first message.

**Every day after that:**
- Give a request to any chat. Anything that needs more than one goes to LEAD, which splits it (below).
- Cal, 2026-11-05: whichever chat gets a request works out which parts it can do itself and does them, and writes every
  other part as a task for the chat that owns it in `TASKS.md` (that chat's request list), with Cal's words. Every chat
  re-reads `TASKS.md` between tasks and folds new requests into its own list and workflow, so nothing waits on Cal to
  pass it along.
- Want to try it on your phone? Tell **LEAD**: *"Publish."*
- Done for the day? Tell **LEAD**: *"Wrap up: make sure everything from every chat is committed and pushed."*

---

## Part 2: the rules every chat follows

1. **Read first.** Before any work, read `CLAUDE.md`, this file, `quest-board/docs/TASKS.md` and
   `quest-board/docs/HANDOFF.md`.
2. **Stay in your own files** (the list in Part 4). If you need a change in the other chat's file, write it in `TASKS.md`
   and tell Cal: LEAD writes under *Art and room code requests*, ROOMS under *Requests for LEAD*. A one-line fix is fine:
   re-read the file right before editing, keep it tiny, and note it in `TASKS.md`. That covers the line ROOMS adds to
   `EXTRA_ITEMS` in `app/src/15_shop.js` for a cosmetic Cal approved.
3. **Check requests often.** Before starting each task and after each commit, read the requests the other chat wrote for
   you in `TASKS.md`. Copy each new one into your own To do, marked `(from LEAD)` or `(from ROOMS)`, and mark the request
   line in place `TAKEN by <you>`. When it is done, mark it `TAKEN by <you>, done in <commit>`. Only the chat that wrote a
   request removes it.
4. **Nothing is overwritten without the other chat's OK.** Never change, reword, move or delete what the other chat wrote:
   its files, its lines in `TASKS.md` and `HANDOFF.md`, its CSS, its uncommitted work. The only exception is marking a
   request to you as taken or done (rule 3). Anything else goes through a request, and waits for the answer.
5. **Shared files** (`app/index.html`, `docs/HANDOFF.md`, `docs/TASKS.md`): re-read right before every edit and keep
   edits small. New CSS goes at the end of the `<style>` block in `app/index.html`, under a comment with your name
   (`/* LEAD */`, `/* ROOMS */`). If Claude Code says a file changed since you read it, the other chat is at work:
   re-read and redo your edit. That is normal.
6. **Git, carefully. Both chats share one folder, so one careless command can wipe the other chat's unsaved work.**
   - Commit only your own files: `git add <your files>`. Never `git add -A` or `git add .`.
   - Commit only finished, tested work. Push right after each commit.
   - Never run anything that changes files you didn't edit: no `git checkout <file>`, `git restore`, `git reset`,
     `git stash`, `git clean`, `git rebase`, `git pull --rebase`, and no switching branches.
   - If git says `index.lock` exists, the other chat is committing. Wait ten seconds and try again.
   - Only LEAD pulls from GitHub, and only when Cal says something changed elsewhere.
7. **Only LEAD publishes.** Only LEAD bumps `APPV`, builds the release and publishes to the phone page. The last
   publish wins, so two publishers wipe each other out. ROOMS writes
   `READY TO PUBLISH: <what>, look at: <what>` in `TASKS.md` instead.
   - Publish only committed work: build from a clean temporary copy of the latest commit (`git worktree add` into a temp
     folder outside this folder), never from the working folder. Follow `quest-board/docs/RELEASING.md`.
   - After each publish, LEAD sends Cal a checklist: one line per change and what to look at on the phone, plus what ROOMS
     still has in progress.
   - Either chat can build and test locally any time (`python3 quest-board/tools/build.py`), each on its own port:
     ROOMS 8765, LEAD 8766 (`python3 -m http.server 8766 --bind 127.0.0.1` from `quest-board/`).
8. **Chrome and Higgsfield are ROOMS only.** LEAD never generates art: when the app needs art, LEAD adds it under
   *Art and room code requests* in `TASKS.md`.
9. **The rules in `CLAUDE.md` still apply:** no spending Higgsfield credits, original designs only, Cal's tone, and
   honest status.
10. **Saves are sacred** (`quest-board/docs/RELEASING.md`): never bump `QB_EPOCH`, and never rename or delete an item or
   upgrade id.
11. **When a piece is done:** tick it in `TASKS.md` and add a line to `HANDOFF.md`.
12. **Cal has the final say on art.** Show new art before putting it in the game.

---

## How LEAD runs the work

Cal, 2026-11-05: LEAD manages the other chats. Cal can give a request to ROOMS directly, or to LEAD, and LEAD splits it:
- Art goes to ROOMS under *Art and room code requests*, with what it is for, the size and where it goes.
- LEAD writes the code at the same time, with the art failing softly until it exists.
- When ROOMS marks the art `READY`, LEAD takes the files and wires them in, tests, commits and publishes.
- Code in ROOMS's files (the room code) goes to ROOMS as a request, or LEAD asks ROOMS's OK in `TASKS.md` before
  changing it (rule 4).
- After each publish LEAD marks the `READY TO PUBLISH` lines it shipped `PUBLISHED in v<APPV>`.
- LEAD tells Cal if a third chat would drastically help, and only then: not while the risk of broken code is high.

## How QA works

- **Quality checks are its main job** (Cal). The other chats leave sweeps to it.
- **Never waits on anyone.** It tests whatever is committed and starts the next check without asking.
- **Tests clean copies.** Each run builds from a clean temporary copy of the latest commit (`git worktree add --detach` into a
  temp folder outside this folder), never from the working folder, so half-finished edits don't show up as bugs. Port 8769.
- **Reports, doesn't fix.** Findings go under *QA findings* in `TASKS.md`, one line each: what, where, how to see it,
  a screenshot path, and the owner it thinks it belongs to (LEAD or ROOMS). LEAD moves each one into the right list.
  Longer write-ups and run logs go in `docs/QA.md`.
- **Writes its own tests only** in `rigtest/qa/`. A change to an existing script in `rigtest/browser/` is a request to LEAD.
- **Heavy runs one at a time.** No full sweep while LEAD's Doing line says it is publishing.
- **References are for study.** It looks up isometric game room art with the built-in browser (never Chrome) and writes
  art ideas for ROOMS, with the reference link and what to learn from it. Never copy anyone's art.
- **Approvals stay batched.** Anything for Cal goes through LEAD, saved up so he sees several at once.

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

Ask Cal for suggestions (Cal, 2026-11-05: every chat). Don't invent new systems or redesigns on your own. Quality checks
are QA's main job now, so LEAD and ROOMS leave sweeps to QA and work from the board; anything they notice in passing goes
under *QA findings*. QA's own list never runs out: when its tasks are done it repeats the sweeps against the latest commit,
and asks Cal only for new areas to cover.

---

## Part 3: starter prompts (paste one into each new chat)

**LEAD**
> You are LEAD on Quest Board. Read CLAUDE.md, TEAMWORK.md, quest-board/docs/TASKS.md and quest-board/docs/HANDOFF.md
> first. You own the task board, quality of life, the Shop and Training code and everything else in the app, the docs,
> and publishing to my phone. You are the only chat that publishes, bumps APPV or pulls from GitHub. You never generate
> art: when the app needs art, add it under "Art and room code requests" in TASKS.md. Another chat, ROOMS, works in this same folder on
> all art and the room code: follow the TEAMWORK rules so you never touch its work. Show me your open tasks in a few lines,
> then start.

**ROOMS**
> You are ROOMS on Quest Board. Read CLAUDE.md, TEAMWORK.md, quest-board/docs/TASKS.md and quest-board/docs/HANDOFF.md
> first. You do all art generation (rooms, walls, outfits, items, banners, ui pictures) and own every file in art/app, the
> art tools and the room code. You are the only chat that uses Chrome or Higgsfield, and you wear-test the outfits you
> bring in. Another chat, LEAD, works in this same folder and is the only one that publishes. Follow the TEAMWORK rules:
> your own files only, careful git, never publish, claim Chrome in TASKS.md before generating, and mark finished work
> "READY TO PUBLISH: <what>, look at: <what>". Show me your open tasks in a few lines, then start.

**QA**
> You are QA on Quest Board. Read CLAUDE.md, TEAMWORK.md (especially "How QA works"), quest-board/docs/TASKS.md,
> quest-board/docs/HANDOFF.md and quest-board/rigtest/browser/README.md first. You test, run pilots and check quality all
> the time, so Cal doesn't have to buy things by hand to find problems. You own rigtest/qa/ and docs/QA.md only: you never
> change game code, data or art, never publish, never use Chrome or Higgsfield. Test clean copies of the latest commit on
> port 8769, write findings under "QA findings" in TASKS.md with an owner, and keep going without waiting on anyone.
> Show me your open tasks in a few lines, then start.

---

## Part 4: who owns which files

All paths are inside `quest-board/`. **Anything not listed under ROOMS or QA belongs to LEAD.**

| | LEAD | ROOMS |
|---|---|---|
| Code | every other file in `app/src/` (`00_clock.js`, `10_app_a.js`, `15_shop.js`, `16_interface.js`, `24_screens.js`, `25_splash.js`, `28_missions.js`, `29_prices.js`, `30_app_b.js`), `src/rig.js`, `src/look.js`, `src/creator.js` | `app/src/20_loft.js`, `21_restaurant.js`, `22_garden.js`, `23_theater.js`, `26_world.js`, `27_rooms.js`, `27b_skins.js`, `src/loft_bridge.js` |
| Data | `data/rig.json`, `bodies.json`, `poses.json`, `creator.json`, `exercises.json` | `data/items.json`, `loft.json`, `rsart.json` |
| Art | none | every file in `art/app/`, and `art/raw`, `art/layers`, `art/ref`, `art/sil` |
| Tools | `tools/build.py` | `tools/rs_art.py`, `rs_fix.py`, `closet_stages.py`, `items.py`, `ingest_items.py`, `pack.py`, `strip_mannequin.py` and the other item tools |
| Docs | `TEAMWORK.md`, `CLAUDE.md`, `docs/RELEASING.md`, `ADDING_CONTENT.md`, `ECONOMY.md` and the rest of `docs/` | |
| Shared | `app/index.html`, `docs/HANDOFF.md`, `docs/TASKS.md`: both, small careful edits (rule 5) | |

QA owns `rigtest/qa/` and `docs/QA.md`. In `TASKS.md` it writes only its own section and *QA findings*.

---

## If something goes wrong

- **The phone shows an old version.** Close the page and reopen it. LEAD checks that the header shows the newest
  `v` number.
- **A publish broke something.** Tell LEAD *"republish the previous version"*. The page keeps every version.
- **A change broke the game.** Tell LEAD *"undo the last commit from ROOMS"* (or from LEAD). Every commit can be undone.
- **Both chats changed the same thing.** Nothing is lost if both committed. LEAD sorts it out from `git log`.
- **Art looks wrong or Chrome is stuck.** Tell ROOMS. LEAD never touches Chrome or Higgsfield.
- **Something looks off and you don't know whose it is.** Tell QA to find it, or LEAD to sort it.
- **Unsure?** Ask Cal before running anything that could touch the other chat's files.
