/* QBCreator: the character creator. Options come from data/creator.json.
 * Picking an option updates only that group and the preview, never the menu's
 * position, so the list stays where the player left it.
 */
(function (global) {
  "use strict";

  const SECTIONS = [
    { title: "Body", rows: [{ key: "body", list: "bodies" }, { key: "skin", list: "skin", label: "Skin" }] },
    { title: "Hair", rows: [{ key: "hairStyle", list: "hairStyles", byBody: true, label: "Style" }, { key: "hairColor", list: "hairColors", label: "Color", swatch: true }] },
    { title: "Eyes", rows: [{ key: "eyeColor", list: "eyeColors", label: "Color", swatch: true }] },
    { title: "Top", rows: [{ key: "top", list: "tops", label: "Style" }, { key: "topColor", list: "clothColors", label: "Color", swatch: true }] },
    { title: "Bottom", rows: [{ key: "bottom", list: "bottoms", label: "Style" }, { key: "bottomColor", list: "clothColors", label: "Color", swatch: true }] },
    { title: "Shoes", rows: [{ key: "shoe", list: "shoes", label: "Style" }, { key: "shoeColor", list: "clothColors", label: "Color", swatch: true }] },
  ];
  const PREVIEWS = [["idle", "Front"], ["back", "Back"], ["walk", "Walk"], ["stretch", "Stretch"]];

  function el(tag, props, ...kids) {
    const e = Object.assign(document.createElement(tag), props || {});
    e.append(...kids);
    return e;
  }

  function mount(root, { rig, data, clips, initial, onChange, onDone, showDone = true }) {
    const choice = { ...data.defaults, ...initial };
    let clip = "idle", frame = 0, token = 0;

    const canvas = el("canvas", { className: "cc-canvas", width: rig.cfg.rig.frame[0], height: rig.cfg.rig.frame[1] });
    const ctx = canvas.getContext("2d");
    const tabs = el("div", { className: "cc-tabs", role: "tablist" });
    const menu = el("div", { className: "cc-menu" });
    root.append(el("section", { className: "cc-stage" }, canvas, tabs), menu);

    const options = (row) => (row.byBody ? data[row.list][choice.body] : data[row.list]);
    const groups = [];

    function syncGroup(g) {
      for (const [id, btn] of g.buttons) btn.setAttribute("aria-pressed", String(choice[g.row.key] === id));
    }

    function buildRow(row) {
      const wrap = el("div", { className: "cc-opts" + (row.swatch || row.key === "skin" ? " cc-swatches" : "") });
      wrap.setAttribute("role", "group");
      wrap.setAttribute("aria-label", row.label || row.key);
      const g = { row, wrap, buttons: new Map() };
      const fill = () => {
        wrap.replaceChildren();
        g.buttons.clear();
        for (const o of options(row)) {
          const b = el("button", { type: "button", className: "cc-opt" });
          b.dataset.key = row.key;
          b.dataset.id = o.id;
          if (row.swatch) {
            b.append(el("span", { className: "cc-dot" }));
            b.firstChild.style.background = o.swatch;
          } else if (row.key === "skin") {
            b.append(el("span", { className: "cc-dot" }));
            const [r, gg, bb] = o.a;
            b.firstChild.style.background = `rgb(${255 * r},${222 * gg},${196 * bb})`;
          }
          b.append(el("span", { textContent: o.label }));
          b.addEventListener("click", () => pick(row.key, o.id));
          wrap.append(b);
          g.buttons.set(o.id, b);
        }
        syncGroup(g);
      };
      g.fill = fill;
      fill();
      groups.push(g);
      return row.label ? el("div", { className: "cc-row" }, el("div", { className: "cc-label", textContent: row.label }), wrap) : wrap;
    }

    for (const s of SECTIONS) {
      menu.append(el("section", { className: "cc-section" }, el("h3", { textContent: s.title }), ...s.rows.map(buildRow)));
    }
    if (showDone) {
      const done = el("button", { type: "button", className: "cc-done", textContent: "Done" });
      done.addEventListener("click", () => {
        if (onChange) onChange({ ...choice });
        if (onDone) onDone({ ...choice });
      });
      menu.append(el("div", { className: "cc-footer" }, done));
    }

    for (const [id, label] of PREVIEWS) {
      const b = el("button", { type: "button", className: "cc-tab", textContent: label });
      b.setAttribute("aria-pressed", String(id === clip));
      b.addEventListener("click", () => {
        clip = id;
        frame = 0;
        for (const t of tabs.children) t.setAttribute("aria-pressed", String(t === b));
        draw();
      });
      tabs.append(b);
    }

    function pick(key, id) {
      if (choice[key] === id) return;
      choice[key] = id;
      if (key === "body") {
        // Hairstyles differ per body; keep the same slot in the list.
        groups.find((g) => g.row.key === "hairStyle").fill();
      }
      for (const g of groups) if (g.row.key === key) syncGroup(g);
      frame = 0;
      draw();
      if (onChange) onChange({ ...choice });
    }

    async function draw() {
      const mine = ++token;
      try {
        const look = QBLook.build(data, choice);
        const f = await rig.render(look, rig.clipPose(clip, frame));
        if (mine !== token) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(f, 0, 0);
      } catch (e) {
        if (mine === token) console.error(e);
      }
    }

    const timer = () => {
      const c = clips[clip];
      frame = (frame + 1) % c.frames;
      draw();
      setTimeout(timer, 1000 / c.fps);
    };
    draw();
    setTimeout(timer, 300);
    return { choice: () => ({ ...choice }), pick };
  }

  global.QBCreator = { mount };
})(window);
