/* QBLook: turns what the player picked into the layers the rig draws.
 * Shop items plug in through `choice.equipped`, keyed by rig slot, so they need
 * no code here: { hat: { art: "h_snap" } } draws <body>_h_snap_<view>.webp.
 */
(function (global) {
  "use strict";

  const views = (body, art) => ({ front: `${body}_${art}_front.webp`, back: `${body}_${art}_back.webp` });
  const frontOnly = (body, art) => ({ front: `${body}_${art}_front.webp` });
  const ramp = ({ a, b, c }) => ({ mode: 1, a, b, c });
  const find = (list, id) => list.find((o) => o.id === id) || list[0];

  function build(data, choice) {
    const c = { ...data.defaults, ...choice }, b = c.body;
    const cloth = (id) => ramp(find(data.clothColors, id));
    const skin = { mode: 2, a: find(data.skin, c.skin).a };
    const layers = {
      body: views(b, "base"),
      // Tall footwear sits over the trouser cuff instead of under it.
      [find(data.shoes, c.shoe).over ? "shoesOver" : "shoes"]: { ...views(b, c.shoe), tint: cloth(c.shoeColor) },
      pants: { ...views(b, c.bottom), tint: cloth(c.bottomColor) },
      top: { ...views(b, c.top), tint: cloth(c.topColor) },
      // Blush shifts less than skin does, so it stays rosy on deep tones instead of muddy.
      blush: { ...frontOnly(b, "blush"), tint: { mode: 2, a: skin.a.map(Math.sqrt) } },
      face: frontOnly(b, "face"),
      faceClosed: frontOnly(b, "faceclosed"),
      iris: { ...frontOnly(b, "iris"), tint: ramp(find(data.eyeColors, c.eyeColor)) },
      hair: { ...views(b, c.hairStyle), tint: ramp(find(data.hairColors, c.hairColor)) },
    };
    // The lock of long hair that drapes over the near shoulder, drawn again after the arms (rig slot hairFront, group of the near
    // arm) so a sleeve never shows through it (QA's idle notch). Only styles that have the cut file get it; the same pixels are
    // still in the main hair, so without the file nothing is missing.
    const lockArt = `${b}_${c.hairStyle}front_front.webp`, G = global.QBDATA, QA = global.QBART;
    // Highlights (Cal 11-23: "allow for highlights in the hair as well"): choice.hairHi, a hair colour id, tints <b>_<style>hi_*, a layer of
    // streaks painted for each style (ROOMS), drawn over the hair (rig slot hairHi). A style without that layer shows no highlights.
    const hiArt = `${b}_${c.hairStyle}hi_front.webp`;
    if (c.hairHi && ((QA && QA[hiArt]) || (G && G.arthash && G.arthash[hiArt]))) layers.hairHi = { ...views(b, c.hairStyle + "hi"), tint: ramp(find(data.hairColors, c.hairHi)) };
    // Face marks (Cal 11-24: "face tattoos and scars" in the Stylist; ROOMS's layer): choice.markT (t1..t6) and choice.markS (s1..s4), one of
    // each at most, <b>_mark_<id>_front.webp on the face's own canvas, front view only, no tint. Rig slots markS and markT sit over the
    // skin and the blush and under the mouth, the brows and eyes and the hair. Without the file nothing is drawn.
    for (const [slot, id] of [["markS", c.markS], ["markT", c.markT]]) { const art = `${b}_mark_${id}_front.webp`; if (id && ((QA && QA[art]) || (G && G.arthash && G.arthash[art]))) layers[slot] = { front: art }; }
    if ((QA && QA[lockArt]) || (G && G.arthash && G.arthash[lockArt])) layers.hairFront = { front: lockArt, tint: layers.hair.tint };
    // Cal 11-25 (QA's accessory sweep): data/rig.json slotMap draws a few pieces in another slot than their items.json one
    // (headphones over the arms, wings behind the body, wide sunglasses under the hair).
    const SMAP = (global.QBDATA && global.QBDATA.rig && global.QBDATA.rig.slotMap) || {};
    for (let [slot, item] of Object.entries(c.equipped || {})) {
      if (item && SMAP[item.art] && typeof SMAP[item.art] === "string") slot = SMAP[item.art];
      const set = item.frontOnly ? frontOnly(b, item.art) : views(b, item.art);
      if (slot === "shoes") {
        delete layers.shoes;
        delete layers.shoesOver;
        layers[item.over ? "shoesOver" : "shoes"] = set;
      } else if (slot === "backAcc" && set.back) {
        // QA e17f9be2: from behind, wings belong on top of the back and the hair; their back view draws in the last slot
        layers.backAcc = { front: set.front };
        layers.backAccTop = { back: set.back };
      } else {
        layers[slot] = set;
      }
      if (slot === "hat" && item.clip && item.clip[b]) { layers.hair.clip = item.clip[b]; if (layers.hairFront) layers.hairFront.clip = item.clip[b]; if (layers.hairHi) layers.hairHi.clip = item.clip[b]; }
      if (item.lift && item.lift[b]) layers[slot].lift = item.lift[b];
      // A long skirt moves as one piece (rig.js bindLayer). The flag lives in data/items.json; read it there too, so every
      // place that equips an item gets it without copying one more field.
      const meta = (typeof window !== "undefined" && window.QBDATA && window.QBDATA.items && window.QBDATA.items[item.art]) || {};
      if ((item.skirt || meta.skirt) && layers[slot]) layers[slot].skirt = true;
      // Overalls and suspenders are worn over the shirt (QA, a199020): an "overTop" bottom draws in the pantsOver slot, which
      // data/rig.json puts after the top, so its bib and straps show. The top's near sleeve still draws over it (a later group).
      if (slot === "pants" && (item.overTop || meta.overTop) && layers.pants) {
        layers.pantsOver = layers.pants;
        delete layers.pants;
      }
    }
    // A helmet that covers the whole face (SAYMØRE's Halo Mask, data/rig.json faceCover) hides glasses and face pieces, which
    // would otherwise draw on top of it; pieces in keepAsleep stay on in the sleeping pose (Cal: the SAYMØRE figure stays masked).
    const R = (global.QBDATA && global.QBDATA.rig) || {}, hatArt = c.equipped && c.equipped.hat && c.equipped.hat.art;
    if (hatArt && (R.faceCover || []).indexOf(hatArt) >= 0) { delete layers.glasses; delete layers.glassesUnder; delete layers.mask; }
    if (hatArt && layers.hat && (R.keepAsleep || []).indexOf(hatArt) >= 0) layers.hat.keepAsleep = true;
    // A revealing top (items.json "bare", ROOMS dff4465; Cal 11-18: "lingerie, a sexy crop top ... seductive and revealing") is worn
    // over the bare base: her base has a painted grey tank that would show under it; <b>_base_bare_* paints that tank as skin (shorts
    // kept; the top always covers the chest, QA's coverage gate). The yawn picture follows by name (<b>_base_bare_yawn). His base is
    // already bare and has no such file, so nothing changes for him; a missing file keeps today's base.
    // Heels (items.json "heel", ROOMS 1d16b66; Cal 11-18: "the character needs to look like they are wearing heels with a tippy toe
    // stance"): her base with the feet pointed down from the ankle (<b>_base_heel_*). ROOMS painted those feet reaching today's floor
    // line, so no lift is needed (measured: the heel tip ends where flat soles do; rigtest/lead/heels.js). A shoe whose tiptoe feet end
    // higher can set "heelLift" (canvas px): standing poses then lift the whole figure by it (rig.js render, look.lift). With a bare top
    // too, the base that has both; when a file is missing: bare first (the tank must never show), then heel, then today's base.
    const meta = (slot) => { const a = c.equipped && c.equipped[slot] && c.equipped[slot].art; return (a && G && G.items && G.items[a]) || {}; };
    const has = (art) => { const f = `${b}_${art}_front.webp`; return !!((QA && QA[f]) || (G && G.arthash && G.arthash[f])); };
    const bare = !!meta("top").bare, heel = !!meta("shoes").heel, heelLift = +meta("shoes").heelLift || 0;
    const pick = [bare && heel && "base_bare_heel", bare && "base_bare", heel && "base_heel"].filter((a) => a && has(a))[0];
    if (pick) layers.body = views(b, pick);
    // Bare arms as their own layer (ROOMS d8444f5; Cal "Yes, repaint", QA's bare-arm tear): <b>_basearms_* holds only the arms, from a
    // rounded shoulder cap to the fingertips, and <b>_basetorso[_bare|_heel|_bare_heel]_* the same base without them. The arms then
    // ride the arm bones alone (rig slot skinArms, drawn over the torso), so with the arms raised no torso skin is pulled up with
    // them. The full base still teaches the rig where each limb is (rig.js bodyParts) and keeps its painted pictures (the yawn): in a
    // painted pose the body draws its full picture and the arms layer steps aside (paintBase, painted: "hide"). Under a sleeved top
    // the rig swaps back to the full base (body.full; rig.js armsCover). Missing files keep today's single base.
    const baseName = pick || "base", torsoName = baseName.replace(/^base/, "basetorso");
    if (has("basearms") && has(torsoName)) {
      layers.body = { ...views(b, torsoName), paintBase: `${b}_${baseName}_front.webp`, full: views(b, baseName) };
      layers.skinArms = { ...views(b, "basearms"), painted: "hide" };
    }
    // The Stylist's eye shapes and mouths (Cal 11-18: "new hairstyles, eye shapes, mouth"; the layer format agreed with ROOMS):
    // choice.eyeShape (default e0) and choice.mouth (default m0) draw <b>_eyes_<id> (brows and eyes), <b>_eyes_<id>c (eyes closed, for
    // blinks, sleep and laughs), <b>_iris_<id> (the tinted eye colour mask) and <b>_mouth_<id> (mouth and the nose dot; rig slot
    // "mouth", under the face). Only when all of them exist; otherwise today's single painted face (which has the mouth in it).
    const eid = c.eyeShape || "e0", mid = c.mouth || "m0";
    if (has(`eyes_${eid}`) && has(`eyes_${eid}c`) && has(`mouth_${mid}`)) {
      layers.face = frontOnly(b, `eyes_${eid}`);
      layers.faceClosed = frontOnly(b, `eyes_${eid}c`);
      layers.iris = { ...frontOnly(b, has(`iris_${eid}`) ? `iris_${eid}` : "iris"), tint: layers.iris.tint };
      layers.mouth = frontOnly(b, `mouth_${mid}`);
    }
    // The stretch's yawn (Cal 11-25: "I want them to open their mouth and reach high up to stretch and yawn"): <b>_faceyawn, eyes
    // shut and the mouth open, painted like faceclosed (ROOMS). Until it exists, and with the Stylist's own eyes and mouth, the yawn
    // keeps the closed-eyes face (data/poses.json stretch swaps face for faceYawn).
    layers.faceYawn = has("faceyawn") && !layers.mouth ? frontOnly(b, "faceyawn") : layers.faceClosed;
    const lift = pick && /_heel$/.test(pick) ? heelLift : 0;
    // Slim legs tuck into tall footwear; wide legs stack over it, or they stick out around it.
    if (c.equipped && c.equipped.pants && c.equipped.pants.wide && layers.shoesOver) {
      layers.shoes = layers.shoesOver;
      delete layers.shoesOver;
    }
    return lift ? { body: b, skin, layers, lift } : { body: b, skin, layers };
  }

  global.QBLook = { build };
})(window);
