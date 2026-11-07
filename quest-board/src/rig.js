/* QBRig: paper-doll character renderer.
 *
 * Every visual is data. A look is a list of registered layers (body, clothes,
 * hair...) painted in one shared rest pose, and a pose is a set of bone
 * rotations. This file never names an item, so adding a cosmetic or a pose
 * means adding data only.
 *
 *   const rig = await QBRig.create({ rig, bodies, poses, assetUrl });
 *   const canvas = await rig.render({ body, layers, skin }, poseName);
 */
(function (global) {
  "use strict";

  const CLIP_COLUMNS = 64; // must match COLUMNS in tools/items.py
  const NO_CLIP = new Float32Array(CLIP_COLUMNS);

  const VS = `#version 300 es
  in vec2 aPos; in vec2 aUV; uniform vec2 uView; out vec2 vUV;
  void main(){ vUV=aUV; gl_Position=vec4(aPos.x*uView.x*2.-1., 1.-aPos.y*uView.y*2., 0., 1.); }`;

  // Tint modes act on one isolated layer, so they can never bleed into a neighbour.
  // 1 = ramp: map brightness onto shadow/mid/light (hair and other neutral art).
  // 2 = skin: scale warm pixels towards a tone and leave neutral greys alone.
  const FS = `#version 300 es
  precision mediump float;
  in vec2 vUV; uniform sampler2D uTex; uniform int uMode; uniform vec3 uA,uB,uC; uniform float uClip[${CLIP_COLUMNS}];
  uniform sampler2D uPart; uniform float uOnly; out vec4 o;
  void main(){
    // Sample before any early exit: past one, the GPU can pick the wrong mipmap level.
    vec4 t=texture(uTex,vUV);
    vec2 part=texture(uPart,vUV).rg*255.;
    // uOnly keeps just one limb's pixels, for cells of the mesh shared by two limbs.
    if(uOnly>=0.&&abs(part.r-uOnly)>.5&&abs(part.g-uOnly)>.5){o=vec4(0.);return;}
    // uClip hides art above a line that follows the hat, one height per column.
    float cx=clamp(vUV.x,0.,1.)*float(${CLIP_COLUMNS}-1); int ci=int(cx);
    if(vUV.y<mix(uClip[ci],uClip[min(ci+1,${CLIP_COLUMNS}-1)],fract(cx))){o=vec4(0.);return;}
    if(t.a<.004){o=vec4(0.);return;}
    vec3 c=t.rgb/t.a;
    float l=dot(c,vec3(.299,.587,.114));
    if(uMode==1){
      vec3 r=l<.5?mix(uA,uB,smoothstep(.14,.5,l)):mix(uB,uC,smoothstep(.5,.9,l));
      c=mix(c,r,smoothstep(.05,.16,l));
    }else if(uMode==2){
      float k=smoothstep(.05,.14,max(c.r,max(c.g,c.b))-min(c.r,min(c.g,c.b)));
      c=mix(c,c*uA,k);
    }
    o=vec4(c*t.a,t.a);
  }`;

  const smooth = (x) => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };

  // 2x3 affine matrices as [a,b,c,d,e,f]: x'=a*x+c*y+e, y'=b*x+d*y+f
  const mul = (m, n) => [
    m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1],
    m[0] * n[2] + m[2] * n[3], m[1] * n[2] + m[3] * n[3],
    m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5],
  ];
  const translate = (x, y) => [1, 0, 0, 1, x, y];
  const rotate = (deg) => { const r = deg * Math.PI / 180, c = Math.cos(r), s = Math.sin(r); return [c, s, -s, c, 0, 0]; };
  const scale = (x, y) => [x, 0, 0, y, 0, 0];

  function segDist(px, py, a, b) {
    const vx = b[0] - a[0], vy = b[1] - a[1], len = vx * vx + vy * vy;
    const t = len ? Math.max(0, Math.min(1, ((px - a[0]) * vx + (py - a[1]) * vy) / len)) : 0;
    return Math.hypot(px - a[0] - vx * t, py - a[1] - vy * t);
  }

  /* Give the page a turn, so long work never holds up the animation. */
  const turn = new MessageChannel(), waiting = [];
  turn.port1.onmessage = () => { const go = waiting.shift(); if (go) go(); };
  const pause = () => new Promise((ok) => { waiting.push(ok); turn.port2.postMessage(0); });

  // Work that doesn't depend on a canvas is shared, so a second rig never repeats it.
  const sharedImages = new Map(), sharedBindings = new Map(), sharedBodyParts = new Map();

  /* Walk outward from a bone through opaque cells only. */
  let heapD = new Float32Array(1 << 16), heapI = new Int32Array(1 << 16);
  function geodesicField(alpha, cols, rows, step, shape) {
    const field = new Float32Array(cols * rows).fill(Infinity);
    if (heapD.length < cols * rows * 9) { heapD = new Float32Array(cols * rows * 9); heapI = new Int32Array(cols * rows * 9); }
    let size = 0;
    const push = (d, i) => {
      if (d >= field[i]) return;
      field[i] = d;
      let n = size++;
      while (n > 0) {
        const up = (n - 1) >> 1;
        if (heapD[up] <= d) break;
        heapD[n] = heapD[up]; heapI[n] = heapI[up];
        n = up;
      }
      heapD[n] = d; heapI[n] = i;
    };
    const len = Math.hypot(shape.b[0] - shape.a[0], shape.b[1] - shape.a[1]);
    const samples = Math.max(1, Math.ceil(len / (step / 2)));
    for (let t = 0; t <= samples; t++) {
      const x = shape.a[0] + (shape.b[0] - shape.a[0]) * t / samples;
      const y = shape.a[1] + (shape.b[1] - shape.a[1]) * t / samples;
      const gx = Math.floor(x / step), gy = Math.floor(y / step);
      if (gx < 0 || gy < 0 || gx >= cols || gy >= rows) continue;
      const i = gy * cols + gx;
      if (alpha[i * 4 + 3] > 40) push(0, i);
    }
    const diagonal = step * 1.414;
    while (size) {
      const d = heapD[0], i = heapI[0];
      size--;
      if (size) {
        const lastD = heapD[size], lastI = heapI[size];
        for (let n = 0;;) {
          let c = 2 * n + 1;
          if (c >= size) { heapD[n] = lastD; heapI[n] = lastI; break; }
          if (c + 1 < size && heapD[c + 1] < heapD[c]) c++;
          if (heapD[c] >= lastD) { heapD[n] = lastD; heapI[n] = lastI; break; }
          heapD[n] = heapD[c]; heapI[n] = heapI[c];
          n = c;
        }
      }
      if (d > field[i]) continue;
      const gx = i % cols, gy = (i - gx) / cols;
      for (let oy = -1; oy <= 1; oy++) for (let ox = -1; ox <= 1; ox++) {
        if (!ox && !oy) continue;
        const nx = gx + ox, ny = gy + oy;
        if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
        const n = ny * cols + nx;
        if (alpha[n * 4 + 3] > 40) push(d + (ox && oy ? diagonal : step), n);
      }
    }
    return field;
  }

  /* The field at each mesh corner, taken as the lowest nearby: a soft edge cell inherits
     from the solid art just inside it. */
  function nearField(field, cols, rows) {
    const across = new Float32Array(rows * (cols + 1));
    for (let y = 0; y < rows; y++) for (let x = 0; x <= cols; x++) {
      let m = Infinity;
      for (let g = Math.max(0, x - 3), e = Math.min(cols - 1, x + 2); g <= e; g++) if (field[y * cols + g] < m) m = field[y * cols + g];
      across[y * (cols + 1) + x] = m;
    }
    const near = new Float32Array((rows + 1) * (cols + 1));
    for (let y = 0; y <= rows; y++) for (let x = 0; x <= cols; x++) {
      let m = Infinity;
      for (let g = Math.max(0, y - 3), e = Math.min(rows - 1, y + 2); g <= e; g++) if (across[g * (cols + 1) + x] < m) m = across[g * (cols + 1) + x];
      near[y * (cols + 1) + x] = m;
    }
    return near;
  }

  class Rig {
    constructor(cfg, gl) {
      this.cfg = cfg;
      this.gl = gl;
      this.images = new Map();
      this.meshes = new Map();
      this.frames = new Map();
      this.boneIds = Object.keys(cfg.rig.bones);
      // A limb is a chain of bones hanging off the trunk. limbBones lists what art on a limb
      // may follow: the limb itself and whatever it joins, but never another limb.
      const trunk = new Set(cfg.rig.trunk), bonesOf = cfg.rig.bones;
      this.limbOf = {};
      this.limbBones = {};
      for (const id of this.boneIds) {
        let top = id;
        while (!trunk.has(top) && !trunk.has(bonesOf[top].parent)) top = bonesOf[top].parent;
        this.limbOf[id] = trunk.has(top) ? 1 : 2 + this.boneIds.indexOf(top);
      }
      for (const id of this.boneIds) {
        const limb = this.limbOf[id], parent = bonesOf[id].parent;
        (this.limbBones[limb] = this.limbBones[limb] || new Set()).add(id);
        if (parent) {
          this.limbBones[limb].add(parent);
          (this.limbBones[this.limbOf[parent]] = this.limbBones[this.limbOf[parent]] || new Set()).add(id);
        }
      }
      this.prog = this.program();
      this.vbo = gl.createBuffer();
    }

    program() {
      const gl = this.gl, p = gl.createProgram();
      for (const [type, src] of [[gl.VERTEX_SHADER, VS], [gl.FRAGMENT_SHADER, FS]]) {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
        gl.attachShader(p, s);
      }
      gl.linkProgram(p);
      gl.useProgram(p);
      this.u = {};
      for (const n of ["uView", "uTex", "uMode", "uA", "uB", "uC", "uClip", "uPart", "uOnly"]) this.u[n] = gl.getUniformLocation(p, n);
      this.a = { pos: gl.getAttribLocation(p, "aPos"), uv: gl.getAttribLocation(p, "aUV") };
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      return p;
    }

    image(path) {
      const url = this.cfg.assetUrl(path);
      if (sharedImages.has(url)) return sharedImages.get(url);
      const load = new Promise((ok, no) => {
        const im = new Image();
        im.crossOrigin = "anonymous";
        im.onload = () => im.decode().then(() => ok(im), () => ok(im));
        im.onerror = () => no(new Error("missing art: " + path));
        im.src = url;
      });
      sharedImages.set(url, load);
      return load;
    }

    /* Capsule for a bone: optional "core" joints mark where the mass sits. */
    boneShape(bodyView, id) {
      const b = this.cfg.rig.bones[id], j = bodyView.joints;
      const ab = b.core || b.seg;
      return { a: j[ab[0]], b: j[ab[1]], r: (bodyView.radius && bodyView.radius[id]) ?? b.radius };
    }

    /* One layer ready to draw: its binding plus this rig's textures. */
    mesh(path, bodyId, view, slot, armsUp, skirt) {
      // Poses with the arms overhead use their own binding of the clothes (see rig.armpit); every other pose the usual one.
      armsUp = !!(armsUp && this.cfg.rig.armpit && this.cfg.rig.armpit.slots[slot.id]);
      // A skirt (item flag `skirt`) is one piece of cloth, not two trouser legs: see bindLayer.
      skirt = !!(skirt && slot.bones !== "*" && slot.bones.includes("thN") && slot.bones.includes("thF"));
      const key = [path, bodyId, view, armsUp ? "up" : "", skirt ? "skirt" : ""].join("|");
      if (this.meshes.has(key)) return this.meshes.get(key);
      const made = (async () => {
        const im = await this.image(path);
        const bound = await this.bind(im, path, bodyId, view, slot, armsUp, skirt);
        const gl = this.gl, tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        let partTex = null;
        const parts = bound.parts;
        if (parts) {
          partTex = gl.createTexture();
          gl.activeTexture(gl.TEXTURE1);
          gl.bindTexture(gl.TEXTURE_2D, partTex);
          gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG8, parts.w, parts.h, 0, gl.RG, gl.UNSIGNED_BYTE, parts.pixels);
          for (const n of [gl.TEXTURE_MIN_FILTER, gl.TEXTURE_MAG_FILTER]) gl.texParameteri(gl.TEXTURE_2D, n, gl.NEAREST);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.activeTexture(gl.TEXTURE0);
        }
        return { tex, partTex, groups: bound.groups, seams: bound.seams };
      })();
      this.meshes.set(key, made);
      return made;
    }

    /* A painted pose (pose.painted, e.g. "yawn"): a layer can have a picture already drawn in that pose, frame-sized and
       lined up with the rig's own render of the pose (rigtest/template.html makes the template). It is drawn flat in place
       of the bent mesh. Optional: anything without one keeps the mesh, and a missing file is never an error. */
    flat(path) {
      const key = "flat|" + path;
      if (this.meshes.has(key)) return this.meshes.get(key);
      const has = this.cfg.hasArt || ((p) => { const D = global.QBLoft && global.QBLoft.data; return !(D && D.arthash) || !!(D.arthash[p] || (global.QBART && global.QBART[p])); });
      const made = !has(path) ? Promise.resolve(null) : this.image(path).then((im) => {
        const gl = this.gl, tex = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        return { tex };
      }, () => null);
      this.meshes.set(key, made);
      return made;
    }

    /* Bind one layer to the skeleton once. Weights come from geometry, so a new
       item needs no authoring: it just has to be painted on the rest pose. */
    bind(im, path, bodyId, view, slot, armsUp, skirt) {
      const key = [path, bodyId, view, slot.id, armsUp ? "up" : "", skirt ? "skirt" : ""].join("|");
      if (sharedBindings.has(key)) return sharedBindings.get(key);
      const made = this.bindLayer(im, bodyId, view, slot, armsUp, skirt);
      sharedBindings.set(key, made);
      return made;
    }

    async bindLayer(im, bodyId, view, slot, armsUp, skirt) {
      const { rig } = this.cfg, bv = this.cfg.bodies[bodyId][view];
      const W = rig.canvas[0], H = rig.canvas[1], step = rig.meshStep;
      const cols = Math.ceil(W / step), rows = Math.ceil(H / step);

      const probe = document.createElement("canvas");
      probe.width = cols; probe.height = rows;
      const pc = probe.getContext("2d", { willReadFrequently: true });
      pc.drawImage(im, 0, 0, cols, rows);
      const alpha = pc.getImageData(0, 0, cols, rows).data;

      const allowed = slot.bones === "*" ? this.boneIds : slot.bones;
      const shapes = allowed.map((id) => ({ id, ...this.boneShape(bv, id) }));
      const one = shapes.length === 1 ? shapes[0].id : null;
      // A skirt is one piece: every point follows both thighs evenly, so mid-stride the hem swings between the legs instead
      // of splitting down the middle like culottes (QA on v_tulle, b58bf48). It is drawn with the hips, over both legs.
      const parts = !skirt && new Set(shapes.map((sh) => this.limbOf[sh.id])).size > 1 ? await this.partMap(im, shapes, slot.id === "body" ? null : await this.bodyParts(bodyId, view)) : null;
      // Distance through the art itself, so a shirt corner beside the forearm
      // only follows that arm if the shirt really reaches it. Loose pieces that
      // touch no bone fall back to straight-line distance.
      if (!one && !skirt) {
        for (const s of shapes) {
          s.near = nearField(geodesicField(alpha, cols, rows, step, s), cols, rows);
          await pause();
        }
      }
      const ownOf = {};
      // rig.armpit (poses marked armsUp only): in the listed slots, art beside the arms stops being shared between an arm and the trunk. Below `above`
      // px over the shoulder joints a cell of trunk art follows the trunk only, below `armsAbove` a cell of sleeve follows
      // its arm only, and any piece below the first line stretched past `cap` cells is left out (it is the armpit). Otherwise, with an arm overhead, the side of a shirt
      // is dragged up with it and smears from the armpit to the hip.
      const ap = armsUp && rig.armpit && rig.armpit.slots[slot.id] ? { ...rig.armpit, ...rig.armpit.slots[slot.id] } : null;
      const armLimbs = new Set(ap ? ap.arms.map((id) => this.limbOf[id]) : []);
      const shoulderY = ap ? Math.max(...ap.joints.map((j) => bv.joints[j][1])) : Infinity;
      const armpitY = shoulderY - (ap ? ap.above : 0), sleeveY = shoulderY - (ap ? ap.armsAbove : 0);
      // The rigid seam copies (below) only cover the shoulder and armpit band, down to the elbows; lower down the hands rest by
      // the hips, and rigid copies there left skin-coloured dashes on the trousers (QA on 2be3eda).
      const elbowY = ap ? Math.max(...["elbowN", "elbowF"].filter((j) => bv.joints[j]).map((j) => bv.joints[j][1])) : -Infinity;
      const verts = new Array((cols + 1) * (rows + 1));
      const vertex = (cx, cy) => {
        const k = cy * (cols + 1) + cx;
        if (verts[k]) return verts[k];
        const x = cx * step, y = cy * step;
        if (one) return (verts[k] = { x, y, u: x / W, v: y / H, b0: one, b1: one, w: 0 });
        if (skirt) return (verts[k] = { x, y, u: x / W, v: y / H, b0: "thN", b1: "thF", w: 0.5 });
        let own = shapes;
        if (parts) {
          const limb = parts.at(x, y);
          own = ownOf[limb] || (ownOf[limb] = shapes.filter((s) => this.limbBones[limb].has(s.id)));
          if (!own.length) own = shapes;
        }
        let reached = false;
        for (const s of own) if (s.near[k] !== Infinity) { reached = true; break; }
        let best = null, bestD = 1e9;
        for (const s of own) {
          const d = reached ? s.near[k] - s.r : segDist(x, y, s.a, s.b) - s.r;
          s.d = d;
          if (d < bestD) { bestD = d; best = s.id; }
        }
        let other = best, w = 0, otherD = 1e9;
        const near = rig.bones[best].parent;
        for (const s of own) {
          if (s.id === best || !(s.d < 1e9)) continue;
          if (s.id !== near && rig.bones[s.id].parent !== best) continue;
          if (s.d < otherD) { otherD = s.d; other = s.id; }
        }
        if (other !== best) {
          // Shoulders move far, so they get a wide band: fabric stretches there instead of tearing.
          const band = Math.max(rig.bones[best].blend || rig.blend, rig.bones[other].blend || rig.blend);
          w = 0.5 * smooth(1 - (otherD - bestD) / band);
        }
        return (verts[k] = { x, y, u: x / W, v: y / H, b0: best, b1: other, w });
      };

      // Bones that bend together: a joint, or a limb where it meets any part of the trunk.
      const trunkLimb = this.limbBones[1];
      const related = (a, b) => a === b || rig.bones[a].parent === b || rig.bones[b].parent === a
        || (this.limbOf[a] === 1 && trunkLimb.has(b)) || (this.limbOf[b] === 1 && trunkLimb.has(a));
      const groups = rig.drawOrder.map(() => []);
      const groupOf = {};
      rig.drawOrder.forEach((g, i) => g.forEach((b) => (groupOf[b] = i)));
      const solid = (cx, cy) => {
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          const x = cx + dx, y = cy + dy;
          if (x >= 0 && y >= 0 && x < cols && y < rows && alpha[(y * cols + x) * 4 + 3] > 2) return true;
        }
        return false;
      };
      const seams = rig.drawOrder.map(() => new Map());
      const follow = (v, bone) => ({ ...v, b0: bone, b1: bone, w: 0 });
      const closest = (limb, x, y) => {
        let best = null, bestD = Infinity;
        for (const sh of shapes) {
          if (this.limbOf[sh.id] !== limb) continue;
          const d = segDist(x, y, sh.a, sh.b) / sh.r;
          if (d < bestD) { bestD = d; best = sh.id; }
        }
        return best;
      };
      const tris = [[[0, 0], [1, 0], [0, 1]], [[1, 0], [1, 1], [0, 1]]];
      for (let cy = 0; cy < rows; cy++) {
        if (cy % 12 === 0) await pause();
        for (let cx = 0; cx < cols; cx++) {
          if (!solid(cx, cy)) continue;
          const loose = alpha[(cy * cols + cx) * 4 + 3] < 230 ? 1 : 0;
          const mx = (cx + 0.5) * step, my = (cy + 0.5) * step;
          const here = parts ? parts.limbsIn(cx * step, cy * step, step).map((limb) => [limb, closest(limb, mx, my)]) : [];
          for (const tri of tris) {
            const corners = tri.map(([dx, dy]) => vertex(cx + dx, cy + dy));
            // Two limbs in one cell get a copy of it each, cut to that limb's own pixels, so
            // each draws in its own layer. Corners on a limb that does not bend with it follow
            // this one: stretching across the gap would smear the art, and dropping the cell
            // would leave a bite out of the edge.
            if (here.length > 1) {
              for (const [limb, bone] of here) {
                // Arms overhead (rig.armpit), below the armpit line: each limb's copy moves with that limb alone, so it is never
                // stretched between an arm and the trunk (that stretch tore sleeves into shreds at large sizes, QA).
                const rigid = ap && cy * step > armpitY && cy * step < elbowY;
                const t = corners.map((v) => (rigid ? follow(v, bone) : this.limbOf[v.b0] === limb || related(v.b0, bone) ? v : follow(v, bone)));
                // Cut to its own pixels, this copy has little to smear, so it may stretch further.
                t.loose = 2;
                if (cy * step > armpitY && ap.cap && !rigid) t.cap = ap.cap;
                const seam = seams[slot.group != null ? slot.group : groupOf[bone]];
                if (!seam.has(limb)) seam.set(limb, []);
                seam.get(limb).push(t);
              }
              continue;
            }
            // Corners claimed by an unrelated bone follow this cell's own art instead.
            const keep = here.length === 1 ? here[0][1]
              : corners.map((v) => v.b0).sort((a, b) => corners.filter((v) => related(v.b0, b)).length - corners.filter((v) => related(v.b0, a)).length)[0];
            let t = corners.map((v) => (related(v.b0, keep) ? v : follow(v, keep)));
            const L = here.length === 1 ? here[0][0] : null;
            if (cy * step > armpitY) {
              if (L === 1) t = t.map((v) => (armLimbs.has(this.limbOf[v.b0]) ? follow(v, keep) : armLimbs.has(this.limbOf[v.b1]) ? { ...v, b1: v.b0, w: 0 } : v));
              else if (ap.sleeves && armLimbs.has(L) && cy * step > sleeveY) t = t.map((v) => (this.limbOf[v.b0] !== L ? follow(v, keep) : this.limbOf[v.b1] !== L ? { ...v, b1: v.b0, w: 0 } : v));
              if (ap.cap) t.cap = ap.cap;
            }
            // Outline edges of a joint must not smear when pulled apart.
            t.loose = loose;
            const owner = t[0].b0 === t[1].b0 ? t[0].b0 : t[2].b0;
            groups[slot.group != null ? slot.group : skirt ? groupOf.pelvis : groupOf[owner]].push(t);
          }
        }
      }
      return { groups, seams: seams.map((seam) => [...seam]), parts };
    }

    /* Which limb each bit of a layer belongs to, in steps much finer than the mesh. It grows
       out from the bones through the art itself, so a gap between two limbs is respected
       however narrow it is. */
    /* The limbs of the bare body. Arms and legs stand clear of each other there, so clothes
       take their limbs from it: a sleeve is arm and the side of a shirt is torso, however
       the garment is cut. */
    bodyParts(bodyId, view) {
      const key = bodyId + "|" + view;
      if (sharedBodyParts.has(key)) return sharedBodyParts.get(key);
      const made = this.image(`${bodyId}_${this.cfg.rig.baseArt}_${view}.webp`).then((im) => {
        const bv = this.cfg.bodies[bodyId][view];
        return this.partMap(im, this.boneIds.map((id) => ({ id, ...this.boneShape(bv, id) })), null);
      });
      sharedBodyParts.set(key, made);
      return made;
    }

    async partMap(im, shapes, body) {
      const [W, H] = this.cfg.rig.canvas, step = 6, w = Math.ceil(W / step), h = Math.ceil(H / step);
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      const g = c.getContext("2d", { willReadFrequently: true });
      g.drawImage(im, 0, 0, w, h);
      const px = g.getImageData(0, 0, w, h).data;
      const opaque = new Uint8Array(w * h);
      for (let i = 0; i < w * h; i++) opaque[i] = px[i * 4 + 3] > 40 ? 1 : 0;
      const label = new Uint8Array(w * h), best = new Float32Array(w * h).fill(Infinity);
      if (body) {
        // Limbs this layer can't follow (a hand against the trousers) go to whatever is nearest.
        const limbs = new Set(shapes.map((s) => this.limbOf[s.id]));
        for (let i = 0; i < w * h; i++) if (limbs.has(body.label[i])) label[i] = body.label[i];
      } else {
        for (const s of shapes) {
          // The trunk starts wide and a limb only right along its bone, so a sleeve's bone can't
          // claim the side of the shirt beside it.
          const limit = this.limbOf[s.id] === 1 ? 1.2 : 0.4, reach = s.r * limit;
          const x0 = Math.max(0, Math.floor((Math.min(s.a[0], s.b[0]) - reach) / step)), x1 = Math.min(w - 1, Math.ceil((Math.max(s.a[0], s.b[0]) + reach) / step));
          const y0 = Math.max(0, Math.floor((Math.min(s.a[1], s.b[1]) - reach) / step)), y1 = Math.min(h - 1, Math.ceil((Math.max(s.a[1], s.b[1]) + reach) / step));
          for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
            const i = y * w + x;
            if (!opaque[i]) continue;
            const d = segDist(x * step, y * step, s.a, s.b) / s.r;
            if (d < limit && d < best[i]) { best[i] = d; label[i] = this.limbOf[s.id]; }
          }
        }
      }
      // Art no bone touched goes to the nearest limb; empty space last, so edges have an owner.
      const spread = (through) => {
        const queue = new Int32Array(w * h);
        let head = 0, tail = 0;
        for (let i = 0; i < w * h; i++) if (label[i]) queue[tail++] = i;
        while (head < tail) {
          const i = queue[head++], x = i % w, y = (i - x) / w;
          for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx, ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
            const n = ny * w + nx;
            if (label[n] || !through(n)) continue;
            label[n] = label[i];
            queue[tail++] = n;
          }
        }
        return tail;
      };
      await pause();
      if (!spread((n) => opaque[n])) label.fill(this.limbOf[shapes[0].id]);
      await pause();
      spread(() => true);
      await pause();
      // Where two limbs share solid art, like trouser legs joined at the seam, each also keeps
      // a thin strip of the other. Otherwise they part with a hole between them.
      const also = new Uint8Array(w * h);
      for (let pass = 0; pass < 3; pass++) {
        const prev = also.slice();
        for (let i = 0; i < w * h; i++) {
          if (!opaque[i] || label[i] === 1 || also[i]) continue;
          const x = i % w, y = (i - x) / w;
          for (let dy = -1; dy <= 1 && !also[i]; dy++) for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx, ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
            const n = ny * w + nx;
            if (!opaque[n] || label[n] === 1) continue;
            const other = label[n] !== label[i] ? label[n] : prev[n] !== label[i] ? prev[n] : 0;
            if (other) { also[i] = other; break; }
          }
        }
      }
      const pixels = new Uint8Array(w * h * 2);
      for (let i = 0; i < w * h; i++) { pixels[i * 2] = label[i]; pixels[i * 2 + 1] = also[i]; }
      const at = (x, y) => label[Math.min(h - 1, Math.floor(y / step)) * w + Math.min(w - 1, Math.floor(x / step))];
      const limbsIn = (x, y, size) => {
        const count = {};
        const x1 = Math.min(w, Math.ceil((x + size) / step)), y1 = Math.min(h, Math.ceil((y + size) / step));
        for (let ty = Math.floor(y / step); ty < y1; ty++) for (let tx = Math.floor(x / step); tx < x1; tx++) {
          if (!opaque[ty * w + tx]) continue;
          const here = [label[ty * w + tx], also[ty * w + tx]];
          for (const limb of here) if (limb) count[limb] = (count[limb] || 0) + 1;
        }
        // A speck of another limb is not worth a copy of the cell: it would only stretch.
        return Object.keys(count).filter((limb) => count[limb] > 1).map(Number);
      };
      return { w, h, label, pixels, at, limbsIn };
    }

    /* Forward kinematics: world matrix per bone for a pose. */
    solve(bodyId, view, pose) {
      const { rig } = this.cfg, j = this.cfg.bodies[bodyId][view].joints;
      const out = {};
      const root = pose.root || {};
      const pv = j[rig.rootJoint];
      let world = mul(translate(pv[0] + (root.x || 0), pv[1] + (root.y || 0)), mul(rotate(root.r || 0), translate(-pv[0], -pv[1])));
      const solveBone = (id) => {
        if (out[id]) return out[id];
        const b = rig.bones[id];
        const parent = b.parent ? solveBone(b.parent) : world;
        const p = (pose.bones && pose.bones[id]) || {};
        const o = j[b.seg[0]], e = j[b.seg[1]];
        const axis = Math.atan2(e[1] - o[1], e[0] - o[0]) * 180 / Math.PI;
        let local = rotate(p.r || 0);
        if (p.l != null || p.w != null) {
          local = mul(local, mul(rotate(axis), mul(scale(p.l ?? 1, p.w ?? 1), rotate(-axis))));
        }
        return (out[id] = mul(parent, mul(translate(o[0], o[1]), mul(local, translate(-o[0], -o[1])))));
      };
      this.boneIds.forEach(solveBone);
      if (pose.ground) {
        // Keep the feet on the floor so bobbing never reads as floating. In a three-quarter
        // view each foot rests on its own line, so measure each ankle against where it
        // stands. Toes are left out: the feet are drawn at different angles, and counting
        // them made one stride ride higher than the other.
        const sink = (m, p) => m[1] * p[0] + m[3] * p[1] + m[5] - p[1];
        const drop = (o) => Math.max(sink(o.ftN, j.ankleN), sink(o.ftF, j.ankleF));
        // The legs are not drawn alike, so a walk shares its height with the matching moment
        // of the other stride. That keeps both strides level, which is what stops a limp.
        let y = drop(out);
        if (pose.mate) y = (y + drop(this.solve(bodyId, view, { ...pose.mate, ground: false }))) / 2;
        const shift = translate(0, -y);
        for (const id of this.boneIds) out[id] = mul(shift, out[id]);
      }
      return out;
    }

    /* A pose between two keys. Rotations and scales blend; anything unset is rest. */
    blend(a, b, t) {
      // A painted pose is a picture of exactly that pose: bending toward or away from it tears the flat art (Cal on v0.52,
      // "Still tearing"). So a span with a painted key on one end shows one key or the other, never a mix.
      if ((a.painted || b.painted) && a.painted !== b.painted) t = t < 0.5 ? 0 : 1;
      const num = (x, y, rest) => (x ?? rest) + ((y ?? rest) - (x ?? rest)) * t;
      const bones = {};
      for (const id of new Set([...Object.keys(a.bones || {}), ...Object.keys(b.bones || {})])) {
        const p = (a.bones || {})[id] || {}, q = (b.bones || {})[id] || {};
        bones[id] = { r: num(p.r, q.r, 0), l: num(p.l, q.l, 1), w: num(p.w, q.w, 1) };
      }
      const ra = a.root || {}, rb = b.root || {};
      return {
        view: a.view, flip: a.flip, ground: a.ground, swap: t < 0.5 ? a.swap : b.swap, painted: t < 0.5 ? a.painted : b.painted, armsUp: !!(a.armsUp || b.armsUp), bones,
        root: { x: num(ra.x, rb.x, 0), y: num(ra.y, rb.y, 0), r: num(ra.r, rb.r, 0) },
      };
    }

    /* A smooth curve through four keys, between the middle two. */
    curve(k0, k1, k2, k3, t) {
      const num = (a, b, c, d, rest) => {
        const [p0, p1, p2, p3] = [a ?? rest, b ?? rest, c ?? rest, d ?? rest];
        return 0.5 * (2 * p1 + (p2 - p0) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (3 * p1 - p0 - 3 * p2 + p3) * t * t * t);
      };
      if ((k1.painted || k2.painted) && k1.painted !== k2.painted) return this.blend(k1, k2, t);
      const keys = [k0, k1, k2, k3], field = (get, rest) => num(...keys.map(get), rest);
      const ids = new Set(keys.flatMap((k) => Object.keys(k.bones || {})));
      const bones = {};
      for (const id of ids) {
        const at = (name, rest) => field((k) => ((k.bones || {})[id] || {})[name], rest);
        bones[id] = { r: at("r", 0), l: at("l", 1), w: at("w", 1) };
      }
      const root = (name) => field((k) => (k.root || {})[name], 0);
      return { view: k1.view, flip: k1.flip, ground: k1.ground, swap: t < 0.5 ? k1.swap : k2.swap, painted: t < 0.5 ? k1.painted : k2.painted, armsUp: !!(k1.armsUp || k2.armsUp), bones, root: { x: root("x"), y: root("y"), r: root("r") } };
    }

    /* Frame f of a clip. Clips are data in poses.json. A loop of three or more keys follows
       one continuous curve, so a walk never pauses on a key; anything else eases key to key. */
    clipPose(name, f) {
      const c = this.cfg.clips[name];
      if (!c) throw new Error("unknown clip: " + name);
      const spans = c.loop ? c.keys.length : c.keys.length - 1;
      const u = (((f % c.frames) + c.frames) % c.frames) / (c.loop ? c.frames : Math.max(1, c.frames - 1)) * spans;
      const i = Math.min(Math.floor(u), spans - 1);
      const t = u - i;
      const poses = this.cfg.poses, n = c.keys.length, key = (d) => poses[c.keys[(i + d + n) % n]];
      if (c.loop && n > 2) {
        const pose = this.curve(key(-1), key(0), key(1), key(2), t);
        if (n % 2 === 0) pose.mate = this.curve(key(n / 2 - 1), key(n / 2), key(n / 2 + 1), key(n / 2 + 2), t);
        return pose;
      }
      return this.blend(key(0), key(1), t * t * (3 - 2 * t));
    }

    /* Build the rest of a look in the background, so turning around never stalls. */
    prepare(look) {
      for (const s of this.cfg.rig.slots) {
        const l = look.layers[s.id];
        if (!l) continue;
        for (const view of ["front", "back"]) if (l[view]) this.mesh(l[view], look.body, view, s, false, l.skirt);
      }
    }

    async render(look, poseRef) {
      const key = JSON.stringify([look, poseRef]);
      if (this.frames.has(key)) return this.frames.get(key);
      const { rig, poses } = this.cfg;
      const pose = typeof poseRef === "string" ? poses[poseRef] : poseRef;
      if (!pose) throw new Error("unknown pose: " + poseRef);
      const view = pose.view;
      // A pose can swap a slot's art for an expression, or hide it with null.
      // ...except a piece that stays on asleep (data/rig.json keepAsleep, flagged by look.js), which keeps its own art.
      const keep = (s) => pose.swap && pose.swap[s.id] === null && look.layers[s.id] && look.layers[s.id].keepAsleep;
      const art = (s) => (keep(s) ? s.id : pose.swap && s.id in pose.swap ? pose.swap[s.id] : s.id);
      const slots = rig.slots.map((s) => ({ s, l: art(s) && look.layers[art(s)] }))
        .filter(({ l }) => l && l[view]);
      const meshes = await Promise.all(slots.map(({ s, l }) => this.mesh(l[view], look.body, view, s, pose.armsUp, l.skirt)));
      const flats = await Promise.all(slots.map(({ l }) => (pose.painted && view === "front" && l.front ? this.flat(l.front.replace(/_front\.webp$/, "_" + pose.painted + ".webp")) : null)));
      // A painted layer is drawn once, in the last group its mesh would use, so everything it should cover is already down.
      // The bare body goes in its first group instead, under the face, hair and clothes (ROOMS, yawn pilot).
      const lastGroup = slots.map((x, i) => { let g = -1; if (flats[i]) for (const gg of rig.drawSequence[view]) if ((x.s.id !== "body" || g < 0) && [meshes[i].groups[gg], ...meshes[i].seams[gg].map((z) => z[1])].some((t) => t && t.length)) g = gg; return g; });
      this.prepare(look);

      const gl = this.gl, [W, H] = rig.frame, k = rig.frameScale;
      const c = gl.canvas;
      c.width = W; c.height = H;
      gl.viewport(0, 0, W, H);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(this.prog);
      gl.uniform2f(this.u.uView, 1 / W, 1 / H);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
      gl.enableVertexAttribArray(this.a.pos);
      gl.enableVertexAttribArray(this.a.uv);
      gl.vertexAttribPointer(this.a.pos, 2, gl.FLOAT, false, 16, 0);
      gl.vertexAttribPointer(this.a.uv, 2, gl.FLOAT, false, 16, 8);

      const bones = this.solve(look.body, view, pose);
      const place = [k, 0, 0, k, W / 2 - rig.anchor[0] * k, H - rig.anchorPad - rig.anchor[1] * k];
      const skin = (v) => {
        const a = bones[v.b0], b = bones[v.b1], w = v.w, i = 1 - w;
        const x = i * (a[0] * v.x + a[2] * v.y + a[4]) + w * (b[0] * v.x + b[2] * v.y + b[4]);
        const y = i * (a[1] * v.x + a[3] * v.y + a[5]) + w * (b[1] * v.x + b[3] * v.y + b[5]);
        return [place[0] * x + place[4], place[3] * y + place[5]];
      };
      const skinCache = new Map();
      const skinned = (v) => {
        let r = skinCache.get(v);
        if (!r) skinCache.set(v, (r = skin(v)));
        return r;
      };

      gl.uniform1i(this.u.uTex, 0);
      gl.uniform1i(this.u.uPart, 1);
      // Draw order: each group in turn, each slot in rig order. A painted top lands in its last group, after the neck layer
      // was drawn in an earlier one, so a necklace's parts up to that group move to just after the painted top (QA, a8c2a1f).
      const seq = rig.drawSequence[view], order = [];
      for (const g of seq) slots.forEach((x, i) => order.push([i, g]));
      const ti = slots.findIndex((x, i) => x.s.id === "top" && flats[i] && lastGroup[i] >= 0);
      if (ti >= 0) {
        const upTo = seq.indexOf(lastGroup[ti]), isNeck = ([i, g]) => slots[i].s.id === "neck" && !flats[i] && seq.indexOf(g) <= upTo;
        const moved = order.filter(isNeck), rest = order.filter((e) => !isNeck(e));
        const at = rest.findIndex(([i, g]) => i === ti && g === lastGroup[ti]);
        rest.splice(at + 1, 0, ...moved);
        order.splice(0, order.length, ...rest);
      }
      for (const [i, g] of order) {
        (({ s, l }) => {
          if (flats[i]) {
            if (g !== lastGroup[i]) return;
            const tint = l.tint || (s.id === "body" && look.skin) || null;
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, flats[i].tex);
            gl.uniform1i(this.u.uMode, tint ? tint.mode : 0);
            gl.uniform1fv(this.u.uClip, NO_CLIP);
            if (tint) { gl.uniform3fv(this.u.uA, tint.a); gl.uniform3fv(this.u.uB, tint.b || tint.a); gl.uniform3fv(this.u.uC, tint.c || tint.a); }
            const up = (l.lift || 0) * k;
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, -up, 0, 0, W, -up, 1, 0, 0, H - up, 0, 1, W, -up, 1, 0, W, H - up, 1, 1, 0, H - up, 0, 1]), gl.DYNAMIC_DRAW);
            gl.uniform1f(this.u.uOnly, -1);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            return;
          }
          const m = meshes[i], batches = [[-1, m.groups[g]], ...m.seams[g]];
          if (batches.every(([, tris]) => !tris.length)) return;
          // A hat can sit higher than it was painted, to keep its brim off the eyes.
          const up = (l.lift || 0) * k;
          gl.activeTexture(gl.TEXTURE1);
          gl.bindTexture(gl.TEXTURE_2D, m.partTex);
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, m.tex);
          const tint = l.tint || (s.id === "body" && look.skin) || null;
          gl.uniform1i(this.u.uMode, tint ? tint.mode : 0);
          // Hair is only trimmed while the hat that hides it is actually on.
          const hatOff = pose.swap && "hat" in pose.swap && !pose.swap.hat && !(look.layers.hat && look.layers.hat.keepAsleep);
          gl.uniform1fv(this.u.uClip, (!hatOff && l.clip && l.clip[view]) || NO_CLIP);
          if (tint) {
            gl.uniform3fv(this.u.uA, tint.a);
            gl.uniform3fv(this.u.uB, tint.b || tint.a);
            gl.uniform3fv(this.u.uC, tint.c || tint.a);
          }
          for (const [limb, tris] of batches) {
            const data = new Float32Array(tris.length * 12);
            let n = 0;
            for (const t of tris) {
              const p = t.map(skinned);
              // Solid fabric may stretch freely; loose triangles past the limit are skipped.
              const tooLong = (a, b, rest) => Math.hypot(a[0] - b[0], a[1] - b[1]) > rest * t.loose * rig.maxStretch * rig.meshStep * k;
              if (t.loose && (tooLong(p[0], p[1], 1) || tooLong(p[1], p[2], 1.42) || tooLong(p[2], p[0], 1))) continue;
              if (t.cap) {
                const far = (a, b, rest) => Math.hypot(a[0] - b[0], a[1] - b[1]) > rest * t.cap * rig.meshStep * k;
                if (far(p[0], p[1], 1) || far(p[1], p[2], 1.42) || far(p[2], p[0], 1)) continue;
              }
              t.forEach((v, i) => { data[n++] = p[i][0]; data[n++] = p[i][1] - up; data[n++] = v.u; data[n++] = v.v; });
            }
            if (!n) continue;
            gl.bufferData(gl.ARRAY_BUFFER, data.subarray(0, n), gl.DYNAMIC_DRAW);
            gl.uniform1f(this.u.uOnly, limb);
            gl.drawArrays(gl.TRIANGLES, 0, n / 4);
          }
        })(slots[i]);
      }

      const frame = document.createElement("canvas");
      frame.width = W; frame.height = H;
      const fc = frame.getContext("2d");
      if (pose.flip) { fc.translate(W, 0); fc.scale(-1, 1); }
      fc.drawImage(c, 0, 0);
      // Frames are cheap to redraw and costly to hold, so keep only recent ones.
      if (this.frames.size >= rig.frameCache) this.frames.delete(this.frames.keys().next().value);
      this.frames.set(key, frame);
      return frame;
    }
  }

  global.QBRig = {
    async create(cfg) {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: true, preserveDrawingBuffer: true, antialias: true });
      if (!gl) throw new Error("WebGL2 unavailable");
      return new Rig(cfg, gl);
    },
  };
})(window);
