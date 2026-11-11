# SPEC 7 for LEAD (from ARCHITECT, Cal 2026-11-10 ~12:55): update prompt with Later, download progress, patch-notes letters

Cal's words in quotes. No stale queue items (nothing queued touches the update flow).

Cal: "sometimes the game takes a long time to load. probably after an update. Can we add a check so that if someone is playing on it
while a new update is pushed, it can say New update available, Refresh? or Later. If choosing later, there will be a notification on
the top right of a green exclamation point which will open the refresh splash screen again. closing and launching the app from
scratch will update it automatically, but can there be a visual loading bar that counts the kb downloaded with a forward slash in
between and the total size? Like: Installing update / 286kb/850kb downloaded. Then with each push, if it is worth including in the patch
notes for the players, you could include a very very simple version of what changed and give a 200 coin bonus for opening the patch
notes letter."

## What exists (29q_news.js)
- updCheck reads version.json at open, on return to the foreground and every 10 minutes; showUpdate (29q_news.js:34) offers only
  "Refresh"; updNow saves and reloads; updAfterReload says "You're up to date" or "hasn't reached this phone yet".
- web/sw.js caches files by hash (?h=) and drops what the new version does not keep.
- The inbox (29x_inbox.js) already has letters with one-time coins (welcome, 3,000).

## 1. "New update available": Refresh or Later
- The window: "New update available" (v0.N), your progress is saved, two buttons: Refresh and Later.
- Later: a green "!" badge at the top right (next to the envelope) until the player updates; tapping it opens the same window.
- Never interrupt a photo check, a purchase, a chest or a typing field: wait until nothing is open (like the brand splash).

## 2. Installing update: a byte counter
- Refresh (and a cold start that finds a newer version) shows "Installing update" with a bar and "286 KB / 850 KB downloaded".
- How: the build writes the new version's changed files and their sizes into version.json (total = the files this phone does not
  already have, by hash). The page fetches them itself with a streamed reader, counting bytes into the service worker's cache, then
  reloads; the reload then comes from the cache, fast. Fallback when sizes are unknown: count bytes without a total.
- Cold start: index.html's first loader shows the same counter for app.js and the art bundle (W1/perf: blobs.js is the big one).
- KB under 1,000, MB above (e.g. "3.2 MB / 14.1 MB").

## 3. Patch notes letter with 200 coins
- Each release that is worth telling players about gets a letter from Cal in the inbox: "What's new in v0.N", 3-5 very short plain
  lines (VOICE.md: no hype, no exclamation marks). LEAD writes them in the release; a release with nothing player-facing has none.
- Opening it pays 200 coins once per letter (S.letters.paid). A player who skipped versions gets each missed letter (newest first);
  coins for at most the last 3, so a long-gone player does not get a pile.
- First one: the v0.90 release.

## Economy
200 coins per release: negligible.

## Acceptance checks
- A page open on the old version sees the window within 10 minutes of a publish (or on return to the foreground); Later shows the
  green "!"; tapping it reopens the window; Refresh shows the byte counter climbing to the total, then "You're up to date".
- Cold start on a new version shows the counter; a second start with nothing new shows no counter.
- Slow 3G throttle: the counter moves smoothly; no blank screen.
- Patch letter: unread badge, 200 coins once, never twice after reload; skipped versions behave as above.
- The window never opens over a photo check, purchase or chest.
