/* QBLoft: gives the loft (and avatars) rig frames as image URLs.
 *
 * The loft draws in SVG and needs an answer on every tick, so this never blocks:
 * it returns the frame if ready and renders the rest in the background. Where things
 * sit in the world (chair seats, beds) is data in data/loft.json.
 */
(function (g) {
  "use strict";

  const D = g.QBDATA;
  const { clips, ...poses } = D.poses;
  const SC = D.loft.frameScale;
  const FW = D.loft.frame[0], FH = D.loft.frame[1], PAD = D.loft.anchorPad;
  const rigP = g.QBRig.create({
    rig: { ...D.rig, frame: D.loft.frame, frameScale: SC, anchorPad: PAD, frameCache: 4 },
    bodies: D.bodies, poses, clips,
    assetUrl: (p) => (window.QBART && QBART[p]) || D.loft.artBase + p + (D.arthash && D.arthash[p] ? "?h=" + D.arthash[p] : ""),
  });

  const urls = new Map();
  const queued = new Set();
  const queue = [];
  let pumping = false;
  // Frames asked for while warming are rendered however long they wait: they are your own character's.
  let warming = false;

  function remember(k, u) {
    if (urls.size >= D.loft.urlCache) {
      const old = urls.keys().next().value, ou = urls.get(old);
      urls.delete(old);
      // An image already showing keeps its pixels; give anything mid-load time before freeing it.
      if (ou && ou.startsWith("blob:")) setTimeout(() => URL.revokeObjectURL(ou), 30000);
    }
    urls.set(k, u);
  }

  /* Frames are encoded off the main thread. toDataURL encoded each one on it, and with a room full of
     people that froze the page for seconds at a time on a phone. */
  const encode = (canvas, quality) => (canvas.toBlob
    ? new Promise((ok) => canvas.toBlob((b) => ok(b ? URL.createObjectURL(b) : canvas.toDataURL("image/webp", quality)), "image/webp", quality))
    : Promise.resolve(canvas.toDataURL("image/webp", quality)));

  async function pump() {
    if (pumping) return;
    pumping = true;
    const rig = await rigP;
    while (queue.length) {
      const job = queue.pop();
      // Nobody has asked for this frame in a while (the room scrolled away, or the page moved on): skip it.
      // Whoever still needs it asks again on their next draw.
      if (!job.keep && performance.now() - job.t > 3000) {
        queued.delete(job.k);
        continue;
      }
      try {
        remember(job.k, await job.make(rig));
      } catch (e) {
        console.error("rig frame failed", job.k, e);
      }
      queued.delete(job.k);
      // Keep the page responsive while a whole outfit renders: one frame, then let the page breathe.
      await new Promise((ok) => setTimeout(ok, 0));
    }
    pumping = false;
  }

  function ask(k, make) {
    if (urls.has(k)) return urls.get(k);
    if (queued.has(k)) {
      // Needed now: move it to the front of the line (the queue pops from the end).
      const i = queue.findIndex((j) => j.k === k);
      if (i >= 0) queue[i].t = performance.now();
      if (i >= 0 && i < queue.length - 1) queue.push(queue.splice(i, 1)[0]);
      return null;
    }
    queued.add(k);
    queue.push({ k, make, t: performance.now(), keep: warming });
    pump();
    return null;
  }

  const frameKey = (choice, clip, f) => JSON.stringify(choice) + "|" + clip + "|" + f;
  const lookOf = (choice) => g.QBLook.build(D.creator, choice);

  function frame(choice, clip, f) {
    return ask(frameKey(choice, clip, f), async (rig) =>
      encode(await rig.render(lookOf(choice), rig.clipPose(clip, f)), 0.92));
  }

  /* The newest frame available: the wanted one, else any already made for this clip. */
  function frameOrNear(choice, clip, f) {
    const c = clips[clip];
    const hit = frame(choice, clip, f);
    if (hit) return hit;
    for (let i = 1; i < c.frames; i++) {
      const u = urls.get(frameKey(choice, clip, (f + c.frames - i) % c.frames));
      if (u) return u;
    }
    // Never fall back to a frame facing the wrong way: better to wait a beat.
    const view = poses[c.keys[0]].view;
    return urls.get(frameKey(choice, view === "back" ? "back" : "idle", 0)) || null;
  }

  /* A seated frame baked with its chair, for seats whose furniture isn't its own layer. */
  function seated(choice, clip, f, seatKey) {
    const seat = D.loft.bakedSeats[seatKey];
    return ask(frameKey(choice, clip, f) + "|" + seatKey, async (rig) => {
      const body = await rig.render(lookOf(choice), rig.clipPose(clip, f));
      const out = document.createElement("canvas");
      out.width = FW;
      out.height = FH;
      const c = out.getContext("2d");
      c.drawImage(body, 0, 0);
      const art = await bedImage(seat.chair);
      const perUnit = D.loft.standPx / g.LFCALH_PX;
      const w = art.naturalWidth * seat.pp * perUnit, h = art.naturalHeight * seat.pp * perUnit;
      c.drawImage(art, FW / 2 - w / 2 + seat.x * perUnit, FH - PAD - h + seat.y * perUnit, w, h);
      return encode(out, 0.92);
    });
  }

  const warmed = new Set();
  /* Render a look's frames ahead of need. In a room your character needs standing and walking both ways, and a bed;
     a portrait needs only the one clip it shows. Sitting, typing and stretching render when first used: until
     then frameOrNear shows the standing frame. Each frame costs an encode, so a phone feels every one of them. */
  function warm(choice, only) {
    const id = JSON.stringify(choice) + "|" + (only || "room");
    if (warmed.has(id)) return;
    warmed.add(id);
    warming = true;
    // Asked in reverse, so idle (last) renders first: the queue pops from the end.
    for (const clip of only ? [only] : ["back", "walkBack", "walk", "idle"]) {
      const n = step(clip);
      for (let f = clips[clip].frames - n; f >= 0; f -= n) frame(choice, clip, f);
    }
    // Sleepers are ready before the character ever reaches a bed, so they never blink out.
    if (!only) Object.keys(D.loft.beds).forEach((b) => sleeper(choice, b));
    warming = false;
  }

  // Breathing and fidgeting clips use every other frame: nobody can see the difference, and it halves the work.
  const step = (clip) => (/^(idle|back|sit|sitBack|type)$/.test(clip) ? 2 : 1);

  const clipFrame = (clip, now) => { const f = Math.floor((now / 1000) * clips[clip].fps) % clips[clip].frames; return f - (f % step(clip)); };
  // `cycle` is how much walking phase one full gait takes, which sets the steps per second.
  const walkFrame = (phase, clip) => {
    const n = clips[clip].cycle || 2;
    return Math.floor((((phase % n) + n) % n) / n * clips[clip].frames) % clips[clip].frames;
  };

  /* World size of a rig frame: a standing character is `standH` world units tall. */
  function geometry(standH) {
    const k = standH / D.loft.standPx;
    return { w: FW * k, h: FH * k, x: (-FW * k) / 2, y: -(FH - PAD) * k };
  }

  const images = new Map();
  function bedImage(key) {
    if (!images.has(key)) {
      images.set(key, new Promise((ok, no) => {
        const im = new Image();
        im.onload = () => ok(im);
        im.onerror = no;
        im.src = g.LFSP4[key].d;
      }));
    }
    return images.get(key);
  }

  /* A sleeper for one bed, on a canvas matching the bed art. The character lies on the
     mattress, then the bed's own blanket is drawn back over them along its fold line,
     so they are truly under the covers on every bed. Coordinates are as placed in the
     room; the canvas is stored mirrored because the room mirrors bed art. */
  function sleeper(choice, bedKey) {
    const bed = D.loft.beds[bedKey];
    return ask(JSON.stringify(choice) + "|sleep|" + bedKey, async (rig) => {
      const look = lookOf(choice);
      const f = await rig.render(look, poses.sleepHead);
      const art = await bedImage(bed.sprite);
      const out = document.createElement("canvas");
      out.width = bed.w;
      out.height = bed.h;
      const c = out.getContext("2d");
      const placed = () => c.setTransform(-1, 0, 0, 1, bed.w, 0);
      const k = bed.w / art.naturalWidth;

      // Where the head landed in the rendered frame, from the pose itself.
      const m = rig.solve(look.body, poses.sleepHead.view, poses.sleepHead).head;
      const j = D.bodies[look.body][poses.sleepHead.view].joints.headC;
      const hc = [
        (m[0] * j[0] + m[2] * j[1] + m[4] - D.rig.anchor[0]) * SC + FW / 2,
        (m[1] * j[0] + m[3] * j[1] + m[5] - D.rig.anchor[1]) * SC + FH - PAD,
      ];
      const s = bed.size / D.loft.headPx;
      placed();
      c.translate(bed.head[0], bed.head[1]);
      c.scale(s, s);
      c.drawImage(f, -hc[0], -hc[1]);

      const fold = () => {
        placed();
        c.beginPath();
        bed.fold.forEach(([x, y], i) => (i ? c.lineTo(x * k, y * k) : c.moveTo(x * k, y * k)));
        c.closePath();
      };
      // A soft shadow from the blanket falls on the sleeper only.
      c.save();
      c.globalCompositeOperation = "source-atop";
      fold();
      c.shadowColor = "rgba(40,28,50,.55)";
      c.shadowBlur = 10;
      c.fillStyle = "rgba(40,28,50,.55)";
      c.fill();
      c.restore();
      // The blanket itself: the bed's own pixels, so it lines up exactly.
      c.save();
      fold();
      c.clip();
      c.globalCompositeOperation = "destination-out";
      c.setTransform(1, 0, 0, 1, 0, 0);
      c.fillRect(0, 0, bed.w, bed.h);
      c.globalCompositeOperation = "source-over";
      c.drawImage(art, 0, 0, bed.w, bed.h);
      c.restore();
      return encode(out, 0.95);
    });
  }

  g.LFCALH_PX = 74;
  g.QBLoft = { frame, frameOrNear, seated, warm, clipFrame, step, walkFrame, geometry, sleeper, clips, poses, data: D };
})(window);
