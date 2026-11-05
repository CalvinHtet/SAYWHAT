# SAYWHAT / Quest Board

An RPG life-task game for Cal and his girlfriend: real chores earn XP and coins, and coins
build up The Loft. The app is in `quest-board/`. Read `quest-board/docs/HANDOFF.md` first:
it has the current state and the full list of what Cal asked for next.

**Two Claude chats may be working in this folder at the same time (LEAD and ROOMS). Before doing anything, read
`TEAMWORK.md` and `quest-board/docs/TASKS.md`, and follow their rules: your own files only, careful git, only LEAD
publishes, only ROOMS generates art.**

## Rules from Cal

- Never spend Higgsfield credits. Art comes only from Cal's Chrome with the Unlimited toggle
  on. A cloud session has no such Chrome, so do not generate art there, and never use
  the Higgsfield connector. List what is needed in the handoff and make missing art fail softly.
- Original designs only. No copyrighted costumes, characters or brand logos.
- One Higgsfield image per cosmetic, holding every angle.
- Test every outfit combination and every pose before calling anything ready. Cal wants
  honest status, not optimism: say what was checked and what was not.
- Before release remove the Shop's Testing row and the `window.__qb` and `window.__qbLoft`
  hooks.
- Do not paste the artifact URL into chat. Use they/them for anyone whose pronouns are
  unstated.
- Tone with Cal: best friend, tough love, direct.

## Running it

`python3 quest-board/tools/build.py` assembles `quest-board/dist/` (not committed). Serve
`quest-board/` with `python3 -m http.server 8765 --bind 127.0.0.1` and open
`/dist/index.html`. After a rebuild, reload with the cache bypassed. Rooms use WebGL2 for
characters. `quest-board/docs/ADDING_CONTENT.md` and `quest-board/docs/ECONOMY.md` explain
how content and prices work.

`quest-board/art/raw` and `quest-board/art/layers` (838 MB of source images) are not in this
repo. They live in Cal's Dropbox and are only needed when adding new cosmetics, which needs
his Chrome anyway. `quest-board/art/app` has all runtime art.
