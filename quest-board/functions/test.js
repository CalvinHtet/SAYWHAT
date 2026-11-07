// node functions/test.js: /api/sample's handler with a fake Claude, no Firebase and no key
const { handle, parseJson } = require("./index.js");
let fails = 0; const ok = (n, c, i) => { if (!c) fails++; console.log((c ? "  ok   " : "  FAIL ") + n + (c ? "" : "  " + JSON.stringify(i))); };
const fake = (reply, stop) => ({ calls: [], messages: { create: async function (p) { this.calls = (this.calls || []); fake.last = p; if (reply instanceof Error) throw reply; return { stop_reason: stop || "end_turn", content: [{ type: "text", text: reply }] }; } } });
const deps = (client, n) => ({ verify: async (t) => { if (t !== "good") throw new Error("bad"); return "u1"; }, count: async () => n || 1, client });
const req = (body, tok) => ({ method: "POST", headers: tok === null ? {} : { authorization: "Bearer " + (tok || "good") }, body });
(async () => {
  let [s, o] = await handle(req({ prompt: "Return ONLY JSON", image: "AAAA" }), deps(fake('{"matches":true,"what":"a sink"}')));
  ok("a photo check returns the parsed JSON", s === 200 && o.result.matches === true, [s, o]);
  ok("it asks Haiku 5.5 at low effort with the photo first", fake.last.model === "claude-haiku-5-5" && fake.last.output_config.effort === "low" && fake.last.messages[0].content[0].type === "image" && fake.last.messages[0].content[0].source.media_type === "image/jpeg", fake.last);
  [s, o] = await handle(req({ prompt: "x" }), deps(fake('Here you go:\n```json\n[{"name":"Dishes","xp":20}]\n```')));
  ok("JSON in a code fence and a sentence is still found", s === 200 && Array.isArray(o.result) && o.result[0].name === "Dishes", o);
  [s, o] = await handle(req({ prompt: "x" }, null), deps(fake("{}")));
  ok("no sign-in: 401", s === 401, o);
  [s, o] = await handle(req({ prompt: "x" }, "forged"), deps(fake("{}")));
  ok("a bad token: 401", s === 401, o);
  [s, o] = await handle(req({ prompt: "x" }), deps(fake("{}"), 81));
  ok("past 80 calls a day: 429 with a plain message", s === 429 && /tomorrow/.test(o.error), o);
  [s, o] = await handle(req({ prompt: "" }), deps(fake("{}")));
  ok("an empty prompt: 400", s === 400, o);
  [s, o] = await handle(req({ prompt: "x" }), deps(fake("", "refusal")));
  ok("a refusal: 422, not a crash", s === 422, o);
  [s, o] = await handle(req({ prompt: "x" }), deps(fake("I can't tell")));
  ok("no JSON in the answer: 502", s === 502, o);
  [s, o] = await handle(req({ prompt: "x" }), deps(fake(new Error("boom"))));
  ok("any other failure: 500 with a code", s === 500 && o.code, o);
  ok("parseJson leaves plain JSON alone", parseJson('{"a":[1,2]}').a[1] === 2);
  console.log(fails ? "FAIL " + fails : "PASS"); process.exit(fails ? 1 : 0);
})();
