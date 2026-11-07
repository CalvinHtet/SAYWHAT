# Quest Board as a web app (off Claude)

Cal, 2026-11-07: "I would like to host it off of Claude so anybody can play it without Claude", "App Store is too much
friction", about 30 friends, "I would also like to move this over to a web app. Tell me how to do that and where to get my
claude API key". Owner: LEAD. The Claude Test link keeps working the whole time; the web version goes to friends only after
QA's full set and Cal's phone test on it.

## What the game needs from its host

Measured from the code (2026-11-07), the game asks Claude for exactly three things:

| Claude call | Used for | Web replacement |
|---|---|---|
| `window.claude.use("db")` | saves (`data/users/<uid>/state`, backups), `worlds/<uid>`, `board/<uid>`, `pings/<uid>`, `inbox/owner`, `diag/*` | Firestore |
| `window.claude.use("user")` | `id()` and `isOwner()` | Firebase Auth (Google sign-in); the owner is Cal's uid |
| `window.claude.use("sample")` | `json(prompt, {images, modelTier, cache})` and `limits()`: quest proof photos, level-trial photos, brain-dump scoring, bounty ideas | one Cloud Function, `/api/sample`, that calls the Claude API with Cal's key |

The database calls the game makes are `doc(path).get / set / delete / onSnapshot` and `collection(name).limit(n).get /
onSnapshot`, with `snap.exists`, `snap.data()`, `query.docs[i].id`. That is Firestore's own (compat) API, on paths Firestore
accepts (every doc path has an even number of parts), so the game code does not change: a small file, `app/web.js`, sets
`window.claude` to an object whose `use()` hands back Firestore, the signed-in user and the function.

## The pieces

1. **`app/web.js`** (web build only, loaded after `qbdata.js`):
   - `window.claude.use("db")`: `firebase.firestore()`, wrapped so `collection(c).limit(n).get()` answers from the live
     listener's latest snapshot when one is running. With 30 players the listener already holds every doc, and Firestore
     bills a listener only for docs that change; re-reading the whole collection on every push (what `liveKick` -> `socLoad`
     does) would cost about 90 reads per push per open phone and run past the free daily reads.
   - `use("user")`: waits for Google sign-in (a sign-in screen before the game, once per device), then `id()` = the uid and
     `isOwner()` = whether the uid is Cal's (set in `web/config.js` after his first sign-in).
   - `use("sample")`: `json()` shrinks a photo to 1024 px JPEG on the phone, posts it with the prompt and the user's ID token to
     `/api/sample`, and returns the parsed JSON; `limits()` says images are allowed.
   - `window.QBART` becomes a lookup that answers any picture name with its file URL (`art/<name>?h=<hash>`, from `arthash`).
     The web build does not pack the rig, icon, UI and extra art into scripts, so a phone loads each picture when it is first
     drawn instead of all of it up front (about 65 MB today). This is what lets the game grow (Cal: "if I add 50 more brands
     in the shop and 50 more rooms, would this break the game?").
2. **`tools/build.py`** with `QB_TARGET=web`: writes `dist-web/` with loose art, `web.js`, the Firebase scripts that Firebase
   Hosting serves itself (`/__/firebase/<version>/...` and `/__/firebase/init.js`, which carries the project's config), a web
   manifest and icons (Add to Home Screen, full screen, own icon) and a service worker that checks for a new version each time
   the app opens and loads it quietly.
3. **`functions/`**: one HTTPS function. It checks the Firebase ID token, caps calls per player per day, sends the prompt (and
   photo) to the Claude API with the official Anthropic SDK, and returns the JSON. The key is a Firebase secret Cal sets
   himself (`firebase functions:secrets:set ANTHROPIC_API_KEY`); it never appears in the code, the chat or the browser.
   The model is one setting: Cal's call (Claude Haiku 5.5 is about $2 a month at 30 players doing 10 photo checks a day;
   Claude Opus 5.5 about 40 times that).
4. **`firestore.rules`**: the same rules the Claude version declares: `worlds`, `board`, `pings`: any signed-in player reads,
   only the doc's own player writes; `data/users/<uid>/**`: only that player; `inbox/owner`: the owner reads; `diag/*`:
   players write, the owner reads.
5. **`firebase.json`**: hosting from `dist-web/`, `/api/sample` routed to the function, long caching for fingerprinted files and
   none for `index.html` and the service worker.
6. **The 4 am publish**: a GitHub Actions job on a schedule deploys the release QA passed (a `release` tag or branch) to
   Firebase Hosting with a deploy token stored as a GitHub secret. Nobody gets a new link.

## What Cal does (his accounts, his logins)

1. Anthropic Console: billing, a monthly spend limit, an API key (kept off the chat).
2. Firebase: a project, Firestore, Google sign-in, the Blaze plan with a $5 budget alert, a web app; paste `firebaseConfig`
   (not a secret) to LEAD.
3. Once, on his Mac: `npx firebase-tools login`, then the secret command above.

## Before friends get the link

QA's full set on the web build (both bodies, every room, the story, Review, live sync with ten players, sign-in on iPhone
Safari and from the home screen), Cal's phone test, and the release list in `docs/RELEASING.md` (the Test pill, Review,
Unlock everything, Next event and every `window.__qb*` hook removed; `QB_TEST_START` 0).
