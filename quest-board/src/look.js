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
    for (const [slot, item] of Object.entries(c.equipped || {})) {
      const set = item.frontOnly ? frontOnly(b, item.art) : views(b, item.art);
      if (slot === "shoes") {
        delete layers.shoes;
        delete layers.shoesOver;
        layers[item.over ? "shoesOver" : "shoes"] = set;
      } else {
        layers[slot] = set;
      }
      if (slot === "hat" && item.clip && item.clip[b]) layers.hair.clip = item.clip[b];
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
    if (hatArt && (R.faceCover || []).indexOf(hatArt) >= 0) { delete layers.glasses; delete layers.mask; }
    if (hatArt && layers.hat && (R.keepAsleep || []).indexOf(hatArt) >= 0) layers.hat.keepAsleep = true;
    // Slim legs tuck into tall footwear; wide legs stack over it, or they stick out around it.
    if (c.equipped && c.equipped.pants && c.equipped.pants.wide && layers.shoesOver) {
      layers.shoes = layers.shoesOver;
      delete layers.shoesOver;
    }
    return { body: b, skin, layers };
  }

  global.QBLook = { build };
})(window);
