# Performance hot spots (W1, QA, 2026-11-10, on qa-local 213ea0f)

Cal: "Run a stress test on the performance of this platform. Is there anywhere we can improve runtime or load time?"

These are measured at phone speed: headless Chrome at 390x844, CPU slowed 4x, DevTools Fast 4G and Slow 4G, medians of 3 runs, on a
sandbox build served like Firebase Hosting (brotli, the same cache headers). Method, every table and the noise notes are in
`docs/QA.md`, section "Performance stress test (W1)". Measure only: QA changed nothing in the game.

Saves used: **new** (no save), **advanced** (Unlock everything + every upgrade, level 60), and **heavy** (advanced + 240 quests,
40 custom workouts, a full gym log, and 1,800 posts, 9,000 chat lines, 60 neighbours and 300 likes in the sandbox database).

Ranked by what a player feels. "Cost" is measured. "Gain" is measured where it says so (an A/B or a what-if); otherwise it is
QA's estimate and says "estimate".

## 1. blobs.js holds every room picture and blocks the first draw (load)
- **Cost:**
  - Cold open (advanced player): 11.64 MB on the wire, 10.16 MB of it blobs.js (14.4 MB raw: 675 room and wardrobe pictures as
    base64 data URLs).
  - index.html loads the scripts in order (`async=false`), so app.js waits for it. Board drawn at **12.8 s on Fast 4G** and
    **66.9 s on Slow 4G**; a new player sees the creator at 12.7 s and 66.6 s.
  - Warm open (from the service worker copy): blobs.js still costs 161 ms to evaluate and 139 ms to build its code cache, on the
    main thread.
  - It holds 14 MB of strings in the JS heap all session. The Board uses almost none of the pictures.
- **Fix:**
  - Stop inlining the room pictures. Ship them as the fingerprinted `art/*.webp` files that already exist, the way the 2,345
    outfit pictures are shipped. The service worker already keeps every `?h=` file offline.
  - Fetch a room's pictures when its window or the building view opens, and show the room's shell while they arrive.
  - Interim step that needs no art changes: take blobs.js out of the `async=false` chain and load it after the Board's first
    draw, before the Loft can open (app.js must then tolerate `__B` arriving late).
- **Gain, measured (what-if, blobs.js answered at once with an empty list):**
  - Board at **2.1 s on Fast 4G** (from 12.8 s) and **7.2 s on Slow 4G** (from 66.9 s).
  - 1.48 MB on the wire instead of 11.64 MB; JS heap at load 33 MB instead of 60 MB.
  - The real fix also fetches the few pictures the Board itself shows, so expect a few hundred ms more than the what-if. The
    first visit to each room then pays for its own pictures (0.1-0.9 MB per room).

## 2. Two level effects keep every screen busy while idle (runtime, battery): Aurora (level 12) and the embers (level 10)
- **Cost:** A/B inside one page on the Board, switching each effect on its own, 5 s idle each, medians of 3:

  | Effects on | Advanced save | Heavy save |
  |---|---|---|
  | all 19 effect classes + embers | 23.9% busy | 44.3% busy |
  | none | 1.8% | 7.7% |
  | only Aurora | 22.4% (60 style recalcs/s) | 34.3% |
  | only embers | 17.5% | 17.6% |
  | each of the other 17 | +0.5 to +2.5 points | +0 to +5 points (pulse, orbs, halo the most) |

  - **Aurora** (`body.fx-aurora .wrap::before`): its `hue` animation animates `filter: blur(80px) hue-rotate(360deg)` on a
    240 px band, so style is recalculated and the band re-blurred every frame, on every screen.
  - **Embers** (`embers()`, 30_app_b.js:1136): a full-screen canvas loop that calls
    `getComputedStyle(document.documentElement).getPropertyValue("--accent")` every frame, which forces a style recalc each
    time.
  - Every player has both from level 12, all the time the app is open.
  - On the Loft (one run): 44.7% busy with every effect on, 7.2% with none. Stopping only the embers took the Loft from 47 to
    57 fps (3 runs).
- **Fix:**
  - Aurora: blur the band once and animate only `opacity` or `transform`, for example two pre-blurred layers cross-fading, or
    slide a wider band. Both are composited, with no style or blur work per frame. Or drop the hue rotation.
  - Embers: read `--accent` once in `applyFx()` and keep it in a variable; draw at most 30 times a second; pause while a
    modal, the Loft or a room window is open; or make the dots a CSS animation.
- **Gain, measured (A/B):** an idle screen from 24% to about 2% busy on the advanced save, and from 44% to about 8% on the heavy
  save. The Loft gains about 10 fps. On a phone this is battery and heat as much as speed.

## 3. Startup work after the Board appears (returning players)
- **Cost:**
  - Warm open, Fast 4G: the Board is drawn at 1.6 s (advanced) or 1.7 s (heavy). Taps get slow answers until **7.6 s
    (advanced)** or **26.7 s (heavy; one run never went quiet in 4 minutes)**: 44 or 84 tasks over 50 ms, 4.6 s or 11.4 s in all,
    the worst 0.6-0.9 s.
  - Profile of the heavy warm open, from the tap to 10 s after the Board:
    - The rig building the player's outfit: `bindLayer` with `getImageData`, `partMap`, `texImage2D`. 1.5 s.
    - Encoding the 12 idle frames (`toBlob`). 0.9 s.
    - `render()` 0.75 s. In it, `fit()` (#cap) reads `scrollHeight` right after `#app.innerHTML` and forces a full layout:
      0.5 s self.
    - The embers 0.5 s, `persist()` 0.15 s, `chLoad()` finishing and calling a second full `render()`.
- **Fix:**
  - Keep the player's rendered frames between sessions (Cache Storage or IndexedDB, keyed by the outfit). A warm open shows
    frame 0 at once and never re-runs the rig for an outfit it has drawn before.
  - Otherwise render frame 0 first and the other 11 in idle time (`requestIdleCallback`).
  - Call `fit()` only when the textarea's text changed, not on every render.
  - Skip the full `render()` after `chLoad()` when nothing on screen uses the old pixel bodies.
- **Gain, estimate:** advanced warm open responding at about 3-4 s instead of 7.6 s, and about 2-3 s less main-thread work on
  every open. The heavy save gains more, because each of its renders costs more.

## 4. Every action rebuilds the whole screen (big saves)
- **Cost:**
  - Ticking a quest on the heavy Board (241 quests, about 4,500 DOM nodes) takes **91 ms** median from the tap to the next frame
    with the embers stopped (worst 161 ms), and **161 ms** with them (worst 371 ms).
  - Opening the heavy Board takes 0.2-0.5 s, against 0.03-0.07 s on the advanced save. Switching screens on the heavy save has a
    p95 of 357-562 ms.
  - Each `render()` sets `#app.innerHTML` for the whole screen, and `fit()` then forces a layout.
- **Fix:** on a tick, update the quest's row and the counters in the header instead of calling `render()`. On the Board, draw
  the first ~50 quests and fold the rest, and keep Completed folded.
- **Gain, estimate:** a tick under 40 ms on any save, and a heavy Board that opens like the advanced one.

## 5. The Hall's Rank tab on its first open (runtime)
- **Cost:**
  - The first ~10 s on the tab keep the main thread 68% busy (advanced) to 99% (heavy; 35 fps, worst frame 200 ms).
  - The rig is binding and rendering up to 10 neighbours' outfits. In 8 s of profile: `bindLayer` 2.0 s, `getImageData`
    1.5 s, `texImage2D` 0.8 s, `toBlob` 0.7 s.
  - The tab draws at most 10 characters whatever the save holds.
  - Headless Chrome draws WebGL in software, so the texture part is an upper bound; `getImageData` and `toBlob` are CPU work
    on a phone too.
- **Fix:** draw each player from a small picture saved with their world doc (their idle frame 0 as a ~10-20 KB webp, written
  when they change outfit). Or render only the rows on screen, one per idle callback, top 3 first.
- **Gain, estimate:** the tab opens at 60 fps with well under 1 s of work.

## 6. app.js is not minified (load)
- **Cost:** 1,426 KB raw, 440 KB brotli. Every open evaluates it on the main thread: 470 ms cold, 495 ms warm. The first open
  also parses it for 0.9 s on a background thread.
- **Fix:** minify in `tools/build.py` and `build_web.sh`, with comments stripped and names kept for the `window.__qb*` hooks.
- **Gain, estimate:** about 30-40% fewer bytes (440 to about 290 KB brotli) and about 100-200 ms less compile and evaluate per
  open at phone speed.

## 7. The Firebase SDK is first in the script chain (load)
- **Cost:** 724 KB raw, 205 KB brotli, loaded before anything else, in the sandbox build too where it is never used. Main-thread
  evaluate 124 ms (auth 80, firestore 37, app 7). The first open also parses it for 0.8 s on a background thread.
- **Fix:** draw the Board from the local save first, then load Firebase and sync. Leave it out of the sandbox build. Later, the
  modular SDK (only auth and Firestore) is about a third of the size.
- **Gain, estimate:** 205 KB less before the first draw (about 0.2 s on Fast 4G, about 1.2 s on Slow 4G) and about 120 ms less
  main-thread work per open.

## 8. Small ones
- 25 intervals are always live: 1 s, 1.7 s, 2 s, 2.5 s x2, 4 s x2, 5 s, 15 s x2, 20 s x7, 30 s, 60 s x4, 120 s and 600 s.
  - Twelve of them do not check `document.hidden`: styCheck, dgRelicCheck, dqCheck, trialHonor, fvCheck, alPaint, fshTick,
    missions, the 1 s raid timer, the 1.7 s visit poses, the unlock check and the sky.
  - They are cheap: with the embers stopped, idle screens sit at 2-8% busy.
  - Fix: one shared ticker that skips while hidden. Gain: small, battery in the background on Android.
- `lfvar.json` (3.7 MB) is copied into every web build but never loaded, because `LFVAR_URL` is unset. Drop it from
  `build_web.sh` and `tools/build.py` for web builds (deploy size only).
- The sandbox build never registers `sw.js` (web.js returns before it), so the sandbox cannot show warm-open behaviour. This
  only matters for testing.

## Not a problem (measured)
- The Loft and the room windows, clean runs: Loft 47 fps (advanced) and 40 fps (heavy); Restaurant 60 and 54 fps; Mall 60 and 58 fps.
  Most of what is left there is fix 2. Cal's phone log (v0.73) had the Restaurant as the heaviest screen (37 fps), which matches the order.
- A note on noise: runs taken while other headless work loaded this laptop read 2-3 times worse (the Restaurant at 18 fps).
  This report uses only the clean runs and the A/B tests.
- Scrolling: 57-60 fps on every long screen of the heavy save. The Board is 13,520 px tall.
- Memory: no leak in 5 minutes of switching screens every 3 s. Heap after GC: 19.2 to 20.0 MB (advanced), 20.2 to 22.9 MB
  (heavy, flat after the first minute). DOM nodes, listeners and live intervals were flat.
- Leaving the Loft stops its loop, and frame loops stop when the browser hides the page.
- A big save: the Hall draws at most 30 posts and 60 chat lines a room whatever is stored, and Training draws the last 5
  sessions.

## Not measured
- A real iPhone (Safari), with real Firestore, sign-in and two players.
- GPU costs on a phone. Headless Chrome draws WebGL in software, so the rig numbers here are upper bounds.
- iOS memory limits.
