/* Quest Board's one server piece (docs/WEBAPP.md): /api/sample, the web build's stand-in for Claude's in-page AI.
   The game sends a prompt (and for photo checks one JPEG, already shrunk to 1024 px on the phone); this checks who is asking,
   caps how often, asks Claude, and hands back the JSON the prompt asked for.
   The key is a Firebase secret Cal sets himself (firebase functions:secrets:set ANTHROPIC_API_KEY); it never reaches the code,
   the repo or the browser.
   Model: Claude Haiku 5.5, Cal's pick (2026-11-07): "Definitely the cheapest option for checking photos and scoring quests.
   Cheap but fast checks. i DONT WAnt them to wait minutes for a photo verification". Effort low keeps each check to seconds. */
"use strict";
const Anthropic = require("@anthropic-ai/sdk");

const MODEL = "claude-haiku-5-5";
const PER_DAY = 80;                 // AI calls per player per day (photo checks, brain dumps, bounty ideas)
const MAX_PROMPT = 20000;           // characters
const MAX_IMAGE = 1500000;          // base64 characters (a 1024 px JPEG is about 100-300 KB)

/* the JSON the prompt asked for, out of the model's text (it may wrap it in a code fence or a sentence) */
function parseJson(text) {
  const t = String(text || "").replace(/```(?:json)?/gi, "").trim();
  try { return JSON.parse(t); } catch (e) { /* fall through */ }
  const starts = [t.indexOf("{"), t.indexOf("[")].filter((i) => i >= 0);
  if (!starts.length) return null;
  const s = Math.min(...starts), close = t[s] === "{" ? "}" : "]", e = t.lastIndexOf(close);
  if (e <= s) return null;
  try { return JSON.parse(t.slice(s, e + 1)); } catch (err) { return null; }
}

/* one request, with what it needs passed in, so a test can run it without Firebase or a key:
   deps = { verify(token) -> uid, count(uid, day) -> calls so far today including this one, client: an Anthropic client,
            warm(uid) (optional) -> opens the database connection, ms (optional) -> filled with each step's milliseconds } */
async function handle(req, deps) {
  const auth = String((req.headers && (req.headers.authorization || req.headers.Authorization)) || "");
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (req.method !== "POST") return [405, { error: "POST only", code: "invalid-argument" }];
  if (!token) return [401, { error: "sign in first", code: "unauthenticated" }];
  const ms = deps.ms || {};
  let uid, t = Date.now();
  try { uid = await deps.verify(token); } catch (e) { return [401, { error: "sign in again", code: "unauthenticated" }]; }
  ms.verify = Date.now() - t;
  const body = req.body || {};
  /* Cal, 2026-11-09: photo checks felt slow. The phone sends this warm-up when the proof window opens, so the server is awake
     and its database connection open by the time the photo arrives. No Claude call, and it does not count against the day. */
  if (body.warm === true) {
    try { if (deps.warm) await deps.warm(uid); } catch (e) { /* a warm-up never fails the player */ }
    return [200, { warm: true }];
  }
  const prompt = typeof body.prompt === "string" ? body.prompt : "";
  const image = typeof body.image === "string" ? body.image : "";
  if (!prompt || prompt.length > MAX_PROMPT || image.length > MAX_IMAGE) return [400, { error: "too big or empty", code: "invalid-argument" }];
  const day = new Date().toISOString().slice(0, 10);
  t = Date.now();
  if ((await deps.count(uid, day)) > PER_DAY) return [429, { error: "That's enough checks for today. Try again tomorrow.", code: "resource-exhausted" }];
  ms.count = Date.now() - t;

  const content = [];
  if (image) content.push({ type: "image", source: { type: "base64", media_type: "image/jpeg", data: image } });
  content.push({ type: "text", text: prompt });
  let msg;
  t = Date.now();
  try {
    msg = await deps.client.messages.create({
      model: MODEL,
      max_tokens: image ? 1024 : 8000,      // a brain dump returns up to 40 quests
      output_config: { effort: "low" },
      messages: [{ role: "user", content }],
    }, { timeout: image ? 25000 : 45000 }); // a photo check gives up after 25 s (one retry still fits the 60 s limit)
  } catch (e) {
    if (e instanceof Anthropic.RateLimitError) return [503, { error: "busy, try again in a minute", code: "unavailable" }];
    if (e instanceof Anthropic.APIConnectionError) return [503, { error: "could not reach Claude", code: "unavailable" }];
    if (e instanceof Anthropic.AuthenticationError) return [500, { error: "the server's Claude key is not working", code: "internal" }];
    if (e instanceof Anthropic.BadRequestError) return [400, { error: "Claude could not read that", code: "invalid-argument" }];
    if (e instanceof Anthropic.APIError) return [503, { error: "Claude error " + e.status, code: "unavailable" }];
    return [500, { error: "server error", code: "internal" }];
  }
  ms.claude = Date.now() - t;
  if (msg.stop_reason === "refusal") return [422, { error: "Claude would not check that", code: "failed-precondition" }];
  const text = (msg.content || []).filter((b) => b.type === "text").map((b) => b.text).join("");
  const result = parseJson(text);
  if (result === null) return [502, { error: "no JSON in the answer", code: "unavailable" }];
  return [200, { result }];
}

module.exports = { handle, parseJson, MODEL, PER_DAY };

/* Firebase wiring. Firebase set-up happens on the first request, so loading this file (the deploy's code scan, functions/test.js)
   needs no project or credentials. */
const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const KEY = defineSecret("ANTHROPIC_API_KEY");
let client = null, admin = null;
/* 512 MiB with a whole CPU: at 256 MiB the function gets a fraction of a CPU, so every cold start (most checks, with a few
   players) spent seconds loading Firebase and the Claude SDK before the photo was even looked at. */
module.exports.sample = onRequest({ secrets: [KEY], invoker: "public", timeoutSeconds: 60, memory: "512MiB", cpu: 1, maxInstances: 10 }, async (req, res) => {
  const t0 = Date.now(), cold = !admin, ms = {};
  if (!admin) {
    const { initializeApp } = require("firebase-admin/app");
    initializeApp();
    admin = { auth: require("firebase-admin/auth").getAuth(), db: require("firebase-admin/firestore").getFirestore() };
  }
  if (!client) client = new Anthropic({ apiKey: KEY.value(), timeout: 45000, maxRetries: 1 });
  const db = admin.db;
  const deps = {
    verify: async (t) => (await admin.auth.verifyIdToken(t)).uid,
    /* limits/<uid>_<day>: the day's count, raised in a transaction so two calls at once both count */
    count: (uid, day) => db.runTransaction(async (tx) => {
      const ref = db.doc("limits/" + uid + "_" + day), s = await tx.get(ref), n = (s.exists ? s.data().n : 0) + 1;
      tx.set(ref, { n, uid, day }); return n;
    }),
    /* one small read opens the database connection, so the real check that follows skips that wait */
    warm: (uid) => db.doc("limits/" + uid + "_" + new Date().toISOString().slice(0, 10)).get(),
    client,
    ms,
  };
  const [status, out] = await handle(req, deps);
  /* one line per call in Cloud Logging, to see where a slow check spent its time */
  const b = req.body || {};
  console.log(JSON.stringify({ sample: status, warm: b.warm === true, cold, kb: Math.round(String(b.image || "").length * 0.75 / 1024), ms: Object.assign({ total: Date.now() - t0 }, ms) }));
  res.set("Cache-Control", "no-store").status(status).json(out);
});
