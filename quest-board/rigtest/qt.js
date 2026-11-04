/* Loft stress test, run inside the app page. Not part of the shipped build.
 *   const QT = (await import("/rigtest/qt.js")).default;
 *   await QT.cfg({ body: "f", addons: ["bd_chair2"] }); QT.place("pc"); QT.focus(2.2);
 *   QT.audit();  // reachability and walking-through-furniture checks for this room
 */
const hook = () => window.__qbLoft();
const S = () => window.__qb.S;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const QT = {
  me() {
    return Object.values(hook().A).find((a) => a.role === "me");
  },
  room() {
    return hook().C(QT.me());
  },
  async cfg({ body = "m", addons = [], choice = {}, slot = 0 } = {}) {
    S().char.rig = { body, ...choice };
    S().char.sex = body;
    const a = {};
    addons.forEach((k) => (a[k] = 1));
    S().base.slots[slot].a = a;
    hook().rerender();
    for (let i = 0; i < 40 && !(QT.me() && QT.room()); i++) await wait(100);
    await wait(300);
    return QT.me() ? "ok" : "no character";
  },
  place(tag) {
    const a = QT.me(), C = QT.room();
    const s = C.st.find((x) => x.tag === tag || x.kind === tag);
    a.emo = null;
    a.emot = 0;
    if (!s) return "no station " + tag;
    s.by = null;
    a.wp = [];
    a.x = s.x;
    a.y = s.y;
    hook().arrive(a, s);
    a.t = 1e6;
    hook().draw(a, true);
    return [s.kind, s.tag, s.x, s.y];
  },
  /* Stand anywhere, for checking depth against furniture. */
  stand(x, y, back = false) {
    const a = QT.me();
    a.wp = [];
    a.x = x;
    a.y = y;
    a.st = null;
    a.mode = "do";
    a.act = "look";
    a.t = 1e6;
    a.back = back;
    hook().draw(a, true);
    return [x, y];
  },
  focus(scale = 2.2, wx, wy, up = 30) {
    const q = hook(), a = QT.me(), c = document.getElementById("lfwrap");
    const g = document.getElementById("lfa-" + a.id.replace(/[^a-z0-9_-]/gi, "_"));
    q.V.s = scale;
    q.apply();
    let r = g.getBoundingClientRect();
    let cx = r.x + r.width / 2, cy = r.y + r.height / 2;
    if (wx != null) {
      const p0 = q.P(a.x, a.y, 0), p1 = q.P(wx, wy, 0);
      cx += (p1[0] - p0[0]) * scale;
      cy += (p1[1] - p0[1]) * scale;
    }
    q.V.x += c.clientWidth / 2 - cx;
    q.V.y += c.clientHeight / 2 - cy + up;
    q.apply();
  },
  /* Every station must be reachable and no walk may cross a furniture footprint. */
  audit() {
    const q = hook(), C = QT.room(), N = C.nav;
    const obs = C.obsRaw || [];
    const inside = (x, y) => obs.find((o) => x > o[0] + 0.02 && x < o[2] - 0.02 && y > o[1] + 0.02 && y < o[3] - 0.02);
    const out = { stations: C.st.length, unreachable: [], crossings: [], seatsInside: [], routes: 0 };
    const stops = C.st.filter((s) => s.kind !== "door");
    const free = (s) => (q.seatish(s) && s.exit ? s.exit : [s.x, s.y]);
    for (const a of stops) for (const b of stops) {
      if (a === b) continue;
      const [sx, sy] = free(a), [gx, gy] = free(b);
      const wp = q.route(C, sx, sy, gx, gy);
      out.routes++;
      const last = wp[wp.length - 1];
      if (!last || Math.hypot(last[0] - gx, last[1] - gy) > 0.5) {
        out.unreachable.push([a.tag || a.kind, b.tag || b.kind]);
        continue;
      }
      let x = sx, y = sy;
      for (const w of wp) {
        const d = Math.hypot(w[0] - x, w[1] - y), n = Math.max(1, Math.ceil(d / 0.08));
        for (let i = 1; i <= n; i++) {
          const px = x + ((w[0] - x) * i) / n, py = y + ((w[1] - y) * i) / n;
          const hit = inside(px, py);
          if (hit && !q.seatish(a) && !q.seatish(b)) {
            out.crossings.push([a.tag || a.kind, b.tag || b.kind, +px.toFixed(2), +py.toFixed(2)]);
            i = n;
            break;
          }
        }
        x = w[0];
        y = w[1];
      }
    }
    for (const s of stops) if (!q.seatish(s) && inside(s.x, s.y)) out.seatsInside.push([s.tag || s.kind, s.x, s.y]);
    out.unreachable = [...new Set(out.unreachable.map((u) => u.join(">")))].slice(0, 8);
    // Where a walk crosses furniture matters more than which walk it was.
    out.crossings = [...new Set(out.crossings.map((c) => c[2] + "," + c[3]))].slice(0, 8);
    return out;
  },
  /* Footprints the room recorded, used to compare upgrades. */
  footprint() {
    return (QT.room().obsRaw || []).map((o) => o.slice(0, 4).map((n) => +n.toFixed(2)).join(","));
  },
  /* Run every upgrade alone, then all of them, collecting problems. */
  async sweep(body, list, prereq, floorItems) {
    const res = [], errs = [];
    const oe = console.error;
    console.error = (...x) => { errs.push(String(x[0]).slice(0, 90)); oe(...x); };
    const onerr = (e) => errs.push(String(e.message).slice(0, 90));
    window.addEventListener("error", onerr);
    const need = (k) => (prereq[k] ? [...need(prereq[k]), k] : [k]);
    await QT.cfg({ body, addons: [] });
    const base = new Set(QT.footprint());
    const check = async (name, addons) => {
      const before = errs.length;
      await QT.cfg({ body, addons });
      const a = QT.audit(), fp = QT.footprint();
      const added = fp.filter((f) => !base.has(f)).length;
      for (const s of QT.room().st.filter((x) => x.kind !== "door").slice(0, 40)) {
        QT.place(s.tag || s.kind);
      }
      res.push({ name, stations: a.stations, unreachable: a.unreachable, crossings: a.crossings, inside: a.seatsInside, added, err: errs.slice(before, before + 2) });
    };
    for (const k of list) await check(k, need(k));
    await check("ALL", [...new Set(list.flatMap(need))]);
    console.error = oe;
    window.removeEventListener("error", onerr);
    const bad = res.filter((r) => r.unreachable.length || r.crossings.length || r.inside.length || r.err.length);
    const noFoot = floorItems.filter((k) => { const r = res.find((x) => x.name === k); return r && !r.added; });
    return { body, tested: res.length, problems: bad, floorWithoutCollision: noFoot, all: res.find((r) => r.name === "ALL") };
  },
  /* Where the character is drawn relative to a piece of furniture (nearest item by bounds). */
  depthAudit() {
    const a = QT.me(), C = QT.room(), wrong = [];
    const g = document.getElementById("lfa-" + a.id.replace(/[^a-z0-9_-]/gi, "_"));
    const items = [...document.querySelectorAll('.lfitems[data-i="' + a.room + '"] > [data-b]')];
    const blocked = hook().blocked;
    for (const it of items) {
      const [x0, y0, x1, y1] = it.getAttribute("data-b").split(",").map(Number);
      const spots = [["front", (x0 + x1) / 2, y1 + 0.35], ["front", x1 + 0.35, (y0 + y1) / 2], ["behind", (x0 + x1) / 2, y0 - 0.35], ["behind", x0 - 0.35, (y0 + y1) / 2]];
      for (const [want, x, y] of spots) {
        if (blocked(C, x, y)) continue;
        QT.stand(x, y);
        a._dk = -9;
        hook().draw(a, true);
        if (g.parentNode !== it.parentNode) continue;
        const after = it.compareDocumentPosition(g) & Node.DOCUMENT_POSITION_FOLLOWING;
        if ((want === "front") !== !!after) wrong.push([it.getAttribute("data-k"), want, +x.toFixed(2), +y.toFixed(2)]);
      }
    }
    return { items: items.length, wrong };
  },
  /* Every upgrade in the catalog, in every room: does buying it change what you see? */
  catalog() {
    const q = hook(), out = {};
    const sig = (r) => {
      window.LFNOANX = 1;
      try {
        const C = q.roomCtx(r, 95);
        return C.items.map((i) => i.s).join("|").replace(/lf[a-z0-9_]*\d+/gi, "x").length + ":" + C.items.length + ":" + C.decals.length + ":" + C.walls.length + ":" + C.st.length;
      } catch (e) {
        return "ERR " + e.message;
      } finally {
        window.LFNOANX = 0;
      }
    };
    for (const room of Object.keys(q.addons)) {
      const list = q.addons[room], base = sig({ t: room, a: {}, st: 0 });
      const silent = [], errors = [];
      for (const it of list) {
        const k = it[0], s = sig({ t: room, a: { [k]: 1 }, st: 0 });
        if (s.startsWith("ERR")) errors.push(k + " " + s);
        else if (s === base) silent.push(k);
      }
      out[room] = { n: list.length, silent, errors, lv: q.roomT[room] && q.roomT[room].lv };
    }
    return out;
  },
  wait,
};

export default QT;
