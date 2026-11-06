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
13. **Waiting on each other (Cal, 2026-11-05: all three chats "constantly checking if there are pending actions that are
    waiting on each other").** Between every task, and at least every 30 minutes during a long one:
    - Keep your Doing line true: what you are editing right now, file names included, and clear it when you commit.
      A stale Doing line hides clashes.
    - Anything you are blocked on goes in your own Doing line as `WAITING ON <LEAD|ROOMS|QA|CAL>: <what> (since <time>)`.
    - Search `TASKS.md` for `WAITING ON <you>`, for requests to you not yet `TAKEN`, and for lines that say they wait on
      your work ("Not published until QA's simulation"). Do them first, or answer in `TASKS.md` when they can happen.
    - Before touching a file or function another chat's Doing line names, or starting a heavy headless run while
      another chat is publishing or timing, write the possible clash in `TASKS.md` and tell Cal in one line.
    - Tell Cal only when he must act: his decision or approval, a `WAITING ON` line older than 30 minutes that nobody has
      taken, or a clash. Say exactly what to tell which chat.
14. **Everyone on the same version before starting (Cal, 2026-11-05: "never start unless the latest version is all matched
    up"; "the final line of defense should always be LEAD").**
    - Every Doing line ends with the commit it is built on: `(on <short commit>)`.
    - Before starting any task: run `git log -1 --format=%h` and `git status --short`, and read every Doing line. Start only
      when all three chats name the latest commit, and no other chat has uncommitted edits in the files your task touches
      or depends on. If not, write `WAITING ON <chat>: commit <files> (since <time>)` in your Doing line and take a task
      that touches nothing of theirs. Work another chat builds on is committed and pushed first.
    - Rebuild your own test build from the latest commit before testing (ROOMS 8765, LEAD 8766, QA 8769), and say which
      commit every result is from.
    - **LEAD is the final line of defense.** Before every publish and at every wrap-up LEAD checks: all three Doing lines on
      the latest commit, nothing uncommitted, `main` pushed and matching GitHub, `git worktree list` holding only today's
      test copies, every test result naming its commit, and the live `APPV` matching `TASKS.md`. LEAD publishes nothing
      until all of that matches, and fixes or reports any rule a mismatched version broke.

15. **Now and Next, so nobody has to ask (Cal, 2026-11-05: "all 3 chats essentially autonomous").** Every Doing line has two
    parts: `Now:` what you are doing this minute, with the files and functions you are editing, and `Next:` what you will
    start after it, with the files it will touch. Update it at every switch. Before starting anything, read the other two
    chats' Now and Next: if neither touches your files, start without waiting; if one does, take another task and write
    `WAITING ON <chat>: <files>` in your own line. Nobody asks permission for work the rules already allow.

16. **Keep running on a 12-minute loop (Cal, 2026-11-05: "have every chat work continuously without stopping").** Every
    chat runs this in its own session, once, and keeps it running:
    `/loop 12m Re-read TEAMWORK.md (rules 13 to 17) and docs/TASKS.md. First do anything marked WAITING ON you and any
    request to you not yet TAKEN. If there is none, continue the next task on your own list. Stop only for Cal's approval
    or decisions, credits or logins, or a clash with another chat. Keep your Doing line true and say which commit you are on.`
    - Inside a turn, keep working through your list as before; the loop only wakes a chat that has gone idle.
    - A wake-up with nothing to do ends at once: check, write nothing, wait for the next one. No made-up work.
    - Work waiting on Cal's approval stays parked; take your next task meanwhile.
    - Every 12 minutes (Cal, 2026-11-05: "I would also like a 12 minute loop check instead of a 15 min. I have the max plan").
      A chat already on 15 minutes deletes its loop and starts this one. Loops pause while the Mac sleeps.

17. **Send finished work to QA for a check (Cal, 2026-11-05).** When a piece reaches a good state that needs no approval
    from Cal, or just needs a feature tested, its chat writes `WAITING ON QA: check <what>, <commit>, <what to look at>` in
    `TASKS.md`. QA picks it up on its next loop and reports under *QA findings*.
    - QA checks are cheap: small to medium, only what the piece touches (one feature, one room, one flow, a short
      simulation, `savecheck.js` and `screens.js`). Not "every asset in every room for every character".
    - Anything long and extensive (full sweeps of every room, upgrade, outfit or pose; 90-day simulations; speed sweeps)
      runs only when Cal asks for it.

18. **How a version reaches Cal (Cal, 2026-11-05).** One version at a time, in this order:
    1. ROOMS finishes the art and sends it to LEAD (`READY TO PUBLISH`).
    2. LEAD checks it, commits, and hands the build to QA (`WAITING ON QA: check v<n>, <commit>`).
    3. QA checks it and writes its findings back to LEAD and ROOMS under *QA findings*.
    4. LEAD and ROOMS fix them and send it to QA a second time.
    5. LEAD publishes it for Cal and pins it in his left-hand panel: version number up by one. **Every version pinned for
       Cal starts a fresh game from level 1** (a new artifact with its own empty database, so nothing carries over and he
       tests everything from the ground up); the friends' page and its saves are not touched by this.
    6. Cal tests on his phone and confirms; then the next version starts.
    - **Changed by Cal, 2026-11-06:** "keep working and publishing more versions. dont wait for my approval. Just keep
      working and use QA chat as the approval chat. If QA gives you update and feedback fixes, apply that and keep
      working". So step 6 no longer holds a version: once QA passes a build, LEAD publishes and pins it as the next
      version, Cal tests whenever he can, and QA's findings are fixed and shipped in the version after.
    - Only LEAD publishes and pins. If Cal does not answer, nobody waits: every chat keeps working on other rooms and
      features (rule 16), and the next version builds up meanwhile.

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
- **Version check (rule 14).** LEAD runs `python3 quest-board/tools/version_check.py` between tasks, before every publish
  and at every wrap-up. It reads the folder, GitHub, every Doing line, the test copies and the APPVs, and lists what to fix,
  by chat. A commit that only touches docs does not put anyone out of date: it compares game files (code, data, art).
  Nothing is published until it says "clear" for LEAD's own items and every other chat's mismatch is either fixed or
  written in `TASKS.md` as a `WAITING ON <chat>` line.

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
