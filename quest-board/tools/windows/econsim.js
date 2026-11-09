// Economy simulator for this laptop (no Playwright): rigtest/qa/sim.js ported to the Chrome DevTools protocol.
// A new player plays the real game day after day through the game's own code, with the clock moved forward (__qbShift).
// Needs headless Chrome on port 9350 and the sandbox build served on 8765 (see docs/WINDOWS_HANDOFF_2026-11-09.md).
//   bash node.sh econsim.js <type> <days> [url]      type: casual | regular | cal | grinder
// One line per day, and out/econ_<type>.json with every day's coins by source, purchases and unlocks.
// Added to sim.js: Dungeon Crawls (quick check-ins between visits bring one home and send the next, 5 a day), "cal" (Cal's own
// day: 10 chores, the gym with a photo every weekday),
// and shopping like a player: save for the next new room (a lot, or an upgrade that opens a room), else the cheapest upgrade.
const fs = require("fs"), path = require("path");
const OUT = path.join(__dirname, "out"); fs.mkdirSync(OUT, { recursive: true });
const TYPE = process.argv[2] || "regular", DAYS = +(process.argv[3] || 30), URL0 = process.argv[4] || "http://localhost:8765/";
const P = {
  casual: { goal: 100, tasks: [10, 10, 10, 10, 25, 30], proof: 0, workouts: [1, 4], play: [1, 2, 3, 4, 5], visits: [9, 20], ticks: [12, 16] },
  regular: { goal: 150, tasks: [10, 10, 10, 10, 10, 10, 25, 25, 25, 25, 15, 25], proof: 2, workouts: [1, 2, 4, 5], play: [0, 1, 2, 3, 4, 5, 6], visits: [8, 13, 20], ticks: [10, 16, 18] },
  cal: { goal: 150, tasks: [10, 10, 10, 15, 15, 15, 25, 25, 25, 25], proof: 1, workouts: [1, 2, 3, 4, 5], play: [0, 1, 2, 3, 4, 5, 6], visits: [8, 13, 20], ticks: [10, 16, 18] },
  grinder: { goal: 300, tasks: [10, 10, 10, 10, 10, 10, 10, 10, 25, 25, 25, 25, 25, 25, 25, 25, 50, 50, 25, 25], proof: 99, workouts: [1, 2, 4, 5], play: [0, 1, 2, 3, 4, 5, 6], visits: [8, 13, 20] },
}[TYPE];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function cdp() {
  const v = await (await fetch("http://127.0.0.1:9350/json/version")).json();
  const ws = new WebSocket(v.webSocketDebuggerUrl);
  await new Promise((ok, no) => { ws.onopen = ok; ws.onerror = () => no(new Error("ws")); });
  let id = 0; const pend = new Map(), handlers = [];
  ws.onmessage = (ev) => { const m = JSON.parse(ev.data); if (m.id && pend.has(m.id)) { const p = pend.get(m.id); pend.delete(m.id); m.error ? p.no(new Error(m.error.message)) : p.ok(m.result); } else handlers.forEach((h) => h(m)); };
  const send = (method, params = {}, sessionId) => new Promise((ok, no) => { const i = ++id; pend.set(i, { ok, no }); ws.send(JSON.stringify({ id: i, method, params, sessionId })); });
  return { send, on: (h) => handlers.push(h), close: () => ws.close() };
}

(async () => {
  const c = await cdp();
  // a fresh browser context: empty storage, so the game starts a brand new save
  const { browserContextId } = await c.send("Target.createBrowserContext");
  const { targetId } = await c.send("Target.createTarget", { url: "about:blank", browserContextId });
  const { sessionId } = await c.send("Target.attachToTarget", { targetId, flatten: true });
  const S = (m, p) => c.send(m, p, sessionId);
  const errs = [];
  c.on((m) => { if (m.sessionId === sessionId && m.method === "Runtime.exceptionThrown") errs.push(String((m.params.exceptionDetails.exception || {}).description || m.params.exceptionDetails.text).slice(0, 200)); });
  await S("Runtime.enable"); await S("Page.enable");
  await S("Emulation.setDeviceMetricsOverride", { width: 1000, height: 900, deviceScaleFactor: 1, mobile: false });
  const ev = async (fn, arg) => {
    const r = await S("Runtime.evaluate", { expression: "(" + fn.toString() + ")(" + JSON.stringify(arg === undefined ? null : arg) + ")", awaitPromise: true, returnByValue: true, userGesture: true });
    if (r.exceptionDetails) throw new Error((r.exceptionDetails.exception && r.exceptionDetails.exception.description) || r.exceptionDetails.text);
    return r.result.value;
  };
  await S("Page.navigate", { url: URL0 });
  for (let t = 0; t < 200; t++) { await sleep(300); try { if (await ev(() => !!(window.__qb && window.__qb.x && window.__qbStory))) break; } catch (e) {} }
  await sleep(1500);

  await ev((P) => {
    const x = window.__qb.x(), S = x.S;
    S.created = true; S.char = window.__qb.fixChar({ name: "Sim", sex: "m" }); S.dqg = P.goal;
    const wk = S.quests.find((q) => q.rep === "weekly4");
    S.quests = P.tasks.map((xp, k) => ({ id: "sim" + k, name: "Task " + k, xp, stat: ["discipline", "fitness", "productivity", "creativity"][k % 4], cl: "home", rep: "daily" }));
    if (wk) S.quests.push(wk);
    const nav = document.querySelector('.nav button[data-v="board"]'); if (nav) nav.click();
    const R0 = Date.now() - (window.__qbShift || 0), mid = new Date(R0); mid.setHours(0, 0, 0, 0);
    window.__sim = {
      at(day, hour) { this.curDay = day; const target = mid.getTime() + day * 864e5 + hour * 36e5; window.__qbShift = target - (Date.now() - (window.__qbShift || 0)); },
      unl: [], curDay: 0,
      clear() { try { window.lfPvStop(); } catch (e) {} document.querySelectorAll("#layer .modal,.modal,.overlay,.dropsplash").forEach((e) => { if (e.__seen) return; const cs = [...e.querySelectorAll(".unl")]; if (cs.length) { e.__seen = 1; const h = (e.querySelector("h1,h2,.lvl,.big") || {}).textContent || ""; this.unl.push({ d: this.curDay + 1, lv: window.__qb.x().effLvl(), head: h.trim().slice(0, 40), cards: cs.map((c) => (((c.querySelector(".label") || {}).textContent || "") + ": " + ((c.querySelector("b") || {}).textContent || "")).trim()) }); } }); document.querySelectorAll("#layer .modal,.modal,.overlay,.dropsplash").forEach((e) => { if (!e.querySelector("#wwok")) e.remove(); }); },
      act(a, d) { const el = document.createElement("button"); el.dataset.act = a; Object.assign(el.dataset, d || {}); el.style.display = "none"; document.body.appendChild(el); el.click(); el.remove(); },
      led: { quests: 0, level: 0, crawls: 0, rooms: 0, produce: 0, wheel: 0, weekly: 0, dq: 0, training: 0, other: 0 },
      finds: {},
      // Dungeon Crawls: bring home every finished crawl (the find is kept at once), then go down the deepest safe dungeon open
      crawlBack() { const S = window.__qb.x().S, D = S.dng || {}; for (let k = (D.runs || []).length - 1; k >= 0; k--) { if (D.runs[k].end <= Date.now()) { this.track("crawls", () => this.act("dclaim", { k: String(k) })); const f = ((S.dng.log || [])[0] || {}).f; if (f) this.finds[f] = (this.finds[f] || 0) + 1; this.clear(); } } },
      // a collector: the deepest safe dungeon that still hides something rare (its card says so), else the deepest safe one
      crawlGo() { const x = window.__qb.x(), S = x.S; if (!S.base.slots.some((r) => r && r.t === "lair")) return; if (((S.dng || {}).runs || []).length) return; const lv = x.effLvl();
        const safe = [["spire", 59], ["arcade", 46], ["mines", 36], ["tower", 28], ["sewer", 20], ["metro", 14], ["cellar", 1]].filter((q) => q[1] <= lv);
        const best = safe.find((q) => window.__qbDungeon.hidden({ id: q[0] }).length) || safe[0]; if (best) { this.act("dgo", { id: best[0] }); this.clear(); } },
      spend: { upgrades: 0, lots: 0 },
      xpled: {},
      track(k, f) { const S = window.__qb.x().S, c0 = S.coins, x0 = S.xp, lp = S.lvPaid, b0 = Object.keys(S.badges || {}).length; f(); const S2 = window.__qb.x().S; let d = S2.coins - c0;
        if (S2.xp > x0) this.xpled[k] = (this.xpled[k] || 0) + (S2.xp - x0);
        const tb = (Object.keys(S2.badges || {}).length - b0) * 250; if (tb > 0 && d >= tb) { this.led.trophies = (this.led.trophies || 0) + tb; d -= tb; }
        let lv = 0; const LP = (window.__qbEcon && window.__qbEcon.ECON.lvPay) || [100, 10]; for (let L = lp + 1; L <= S2.lvPaid; L++) lv += LP[0] + LP[1] * L; if (lv && d >= lv) { this.led.level += lv; d -= lv; }
        if (d > 0) this.led[k] = (this.led[k] || 0) + d; },
    };
  }, P);

  const days = [];
  for (let d = 0; d < DAYS; d++) {
    const dow = d % 7, playing = P.play.includes(dow);
    const day = { d: d + 1, played: playing, bought: [], built: [], story: [] };
    for (let v = 0; v < P.visits.length; v++) {
      if (!playing) break;
      // quick check-ins between visits, only to bring a crawl home and send the next (5 a day at most, one at a time)
      for (const th of (P.ticks || []).filter((h) => h < P.visits[v] && (v === 0 || h > P.visits[v - 1]))) await ev(({ d, th }) => { const sim = window.__sim, x = window.__qb.x(); sim.at(d, th); x.rollover(); sim.clear(); sim.crawlBack(); sim.crawlGo(); }, { d, th });
      const res = await ev(({ d, hour, first, P, dow }) => {
        const sim = window.__sim, x = window.__qb.x(), S = x.S, out = { bought: [], built: [], story: [] };
        sim.at(d, hour); x.rollover(); sim.clear();
        if (first && x.gated() !== null && S.__gateDay !== undefined && S.__gateDay < d) { S.gates.push(x.gated()); delete S.__gateDay; }
        if (x.gated() !== null && S.__gateDay === undefined) S.__gateDay = d;
        if (first && S.base.slots.some((r) => r && r.t === "garden")) { sim.act("gdwater"); sim.clear(); }
        sim.track("rooms", () => sim.act("rall"));
        if (S.base.food && S.base.food.veg >= 1) sim.track("produce", () => sim.act("stysell"));
        if (first) sim.track("wheel", () => sim.act("spin"));
        sim.crawlBack();
        if (P.tasks) {
          const qs = S.quests.filter((q) => q.rep === "daily"), per = Math.ceil(qs.length / P.visits.length);
          const mine = qs.slice(per * P.visits.indexOf(hour), per * (P.visits.indexOf(hour) + 1));
          let proofs = S.__proofs || 0; if (first) proofs = 0;
          mine.forEach((q) => { if (S.done[q.id]) return; const v = q.xp >= 25 && proofs < P.proof; if (v) proofs++; sim.track("quests", () => x.toggle(q.id, null, v ? "v" : undefined)); sim.clear(); });
          S.__proofs = proofs;
        }
        if (first && P.workouts.includes(dow)) { const w = S.quests.find((q) => q.rep === "weekly4"); if (w && !S.done[w.id]) sim.track("quests", () => x.toggle(w.id, null, "v"));
          const plan = ["push", "legs", "pull", "full"][(d + dow) % 4]; sim.act("wkplan", { v: plan }); sim.clear();
          if (S.wk) { (S.wk.list || []).forEach((id) => { const n = (S.wk.setsN && S.wk.setsN[id]) || 3; S.wk.sets[id] = Array.from({ length: n }, () => true); }); sim.track("training", () => sim.act("wkdone")); sim.clear(); } }
        if (window.__qbEcon) for (let k = 0; k < 6; k++) { sim.track("dq", () => window.__qbEcon.check()); sim.clear(); } // one chest a check
        // after the tasks, a crawl (the town now runs at today's effort)
        sim.crawlGo();
        for (let k = 0; k < 4; k++) {
          sim.clear(); window.__qbStory.check();
          const yes = document.querySelector('[data-act="styyes"]');
          if (yes) { out.story.push(yes.dataset.v); yes.click(); sim.clear(); continue; }
          const st = window.__qbStory.state(); const nOff = Object.keys(st.offer).length; if (out.__n === nOff) break; out.__n = nOff;
        }
        const lots = window.__qbStory.lots();
        lots.forEach((t) => { const T = x.ROOMT[t]; if (!T || S.base.slots.some((r) => r && r.t === t)) return; if (S.coins >= T.cost) { const c0 = S.coins; sim.act("rdo", { i: String(S.base.slots.length), t }); if (S.coins < c0) { sim.spend.lots += c0 - S.coins; out.built.push(t + " " + (c0 - S.coins)); } sim.clear(); } });
        for (let g = 0; g < 60; g++) {
          let best = null, goal = 0;
          // a player saves for the next new room: an open lot on the street, or an upgrade that opens a room, not yet affordable
          lots.forEach((t) => { const T = x.ROOMT[t]; if (T && !S.base.slots.some((r) => r && r.t === t) && T.cost > S.coins) goal = goal ? Math.min(goal, T.cost) : T.cost; });
          S.base.slots.forEach((r, i) => {
            if (!r) return; sim.clear(); window.__qb.roomModal(i);
            document.querySelectorAll('.rmodal button[data-act="raddon"]').forEach((bt) => {
              if (bt.disabled) return; const ad = (x.ADDONS[r.t] || []).find((u) => u[0] === bt.dataset.id); if (!ad) return;
              // a player takes the upgrade that opens a new room first (the room window lists it first), else the cheapest
              const op = ad[3] && ad[3].opens ? 0 : 1;
              if (!op && ad[2] > S.coins) goal = goal ? Math.min(goal, ad[2]) : ad[2];
              if (ad[2] <= S.coins && (!best || op < best.op || (op === best.op && ad[2] < best.c))) best = { i, id: ad[0], c: ad[2], n: ad[1], t: r.t, op };
            });
          });
          sim.clear();
          if (!best || (goal && best.op)) break;
          window.__qb.roomModal(best.i);
          const bt = document.querySelector('.rmodal button[data-act="raddon"][data-id="' + best.id + '"]');
          const c0 = S.coins; if (bt) bt.click(); sim.clear();
          if (S.coins < c0) { sim.spend.upgrades += c0 - S.coins; out.bought.push(best.t + ":" + best.id + " " + best.c); } else break;
        }
        delete out.__n;
        return out;
      }, { d, hour: P.visits[v], first: v === 0, P, dow });
      day.bought.push(...res.bought); day.built.push(...res.built); day.story.push(...res.story);
      let ww = await ev(() => !!document.querySelector("#wwok"));
      if (!ww && v === 0 && P.workouts.includes(dow)) await sleep(2400);
      await ev(() => { const b2 = document.querySelector("#wwok"); if (b2) window.__sim.track("weekly", () => b2.click()); window.__sim.clear(); });
    }
    const s = await ev(() => { const x = window.__qb.x(), S = x.S, sim = window.__sim;
      const ups = S.base.slots.reduce((n, r) => n + (r ? Object.keys(r.a || {}).filter((k) => r.a[k]).length : 0), 0);
      const offer = []; S.base.slots.forEach((r, i) => { if (!r) return; window.__qb.roomModal(i); document.querySelectorAll('.rmodal button[data-act="raddon"]').forEach((bt) => { if (!bt.disabled) { const ad = (x.ADDONS[r.t] || []).find((u) => u[0] === bt.dataset.id); if (ad) offer.push(ad[2]); } }); sim.clear(); });
      const E = window.__qbEcon;
      return { lv: x.effLvl(), raw: x.lvlOf(S.xp), xp: S.xp, coins: S.coins, earned: S.earnedC, spent: S.spent, streak: S.streak, gates: S.gates.length,
        rooms: S.base.slots.filter(Boolean).map((r) => r.t), ups, offers: offer.sort((a, b) => a - b), led: Object.assign({}, sim.led), xpled: Object.assign({}, sim.xpled), spend: Object.assign({}, sim.spend),
        share: E ? +E.share().toFixed(3) : null, sp: E ? E.stats() : null, finds: Object.assign({}, sim.finds), crawlsToday: ((S.dng || {}).cd || {}).n || 0, unl: sim.unl.splice(0), storyDone: Object.keys(window.__qbStory.state().done) }; });
    Object.assign(day, s);
    const prev = days.length ? days[days.length - 1] : null;
    const dled = {}; Object.keys(s.led).forEach((k) => { dled[k] = s.led[k] - ((prev && prev.led[k]) || 0); });
    day.dled = dled; day.dearned = s.earned - (prev ? prev.earned : 0);
    days.push(day);
    const top = Object.keys(dled).filter((k) => dled[k]).map((k) => k + " " + dled[k]).join(", ");
    console.log(`day ${String(d + 1).padStart(3)} ${playing ? "play" : "rest"} lv ${s.lv}${s.raw > s.lv ? "(" + s.raw + ")" : ""} coins ${s.coins} +${day.dearned} [${top}] rooms ${s.rooms.length} ups ${s.ups} bought ${day.bought.length}${day.built.length ? " built " + day.built.join(",") : ""}${day.story.length ? " story " + day.story.join(",") : ""} share ${s.share} crawls ${s.crawlsToday} finds ${Object.values(s.finds).reduce((a, b) => a + b, 0)} offers ${s.offers.slice(0, 4).join("/")}`);
    fs.writeFileSync(path.join(OUT, "econ_" + TYPE + ".json"), JSON.stringify({ type: TYPE, P, days, errs }));
  }
  console.log("page errors", errs.length, [...new Set(errs)].slice(0, 5));
  await c.send("Target.closeTarget", { targetId }); await c.send("Target.disposeBrowserContext", { browserContextId });
  c.close(); process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
