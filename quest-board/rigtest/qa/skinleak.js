// Skin through clothes (QA, Cal 11-23: "There is some skin showing through the clothes for the character creator. Does that mean there
// could be other clothes where the skin shows through?"). For each look and pose, three renders on the real rig: skin Fair (A), skin Deep
// (B), and the clothes alone (G: the body, face and hair layers taken out). Pixels where A and B differ are visible skin. A leak is
//   - "over": visible skin where the clothes alone are solid (shown blue on the sheets, not counted: an arm in front of a shirt is
//            meant; a layer drawn in the wrong order shows up there by eye), and
//   - "gap":  visible skin inside the clothes' outline closed by R px (a hole or a seam a few px wide: armpit, waist, shoulder, ankle),
//            but not where the clothes are; big openings (a neckline, a crop top, shorts) are wider than 2R and are not counted;
//   - "thin": visible skin over the clothes that is a sliver under 2T+1 px wide (a crack along a seam), counted with the gaps.
// Only "gap" counts (MIN px in a pose).
// Looks: LOOKS=creator (every starter top x bottom x shoe), LOOKS=shop (every Shop clothing piece worn over the starter outfit in its slot),
// both bodies, every pose. Prints the looks/poses with leaks; writes sheets (OUT/leak_<look>_<body>.png) with leak pixels in red.
//   BASE=<server> OUT=<folder> [LOOKS=creator|shop] [HI=2] [R=3] [MIN=4] [ONLY=id,id] [POSES=a,b] node skinleak.js
const pw = require('playwright'), fs = require('fs'), path = require('path');
const OUT = process.env.OUT || 'qa-out/skinleak'; fs.mkdirSync(OUT, { recursive: true });
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] });
  const ctx = await b.newContext({ viewport: { width: 900, height: 700 } }); await ctx.route('**/*', (r) => (r.request().url().startsWith(process.env.BASE) ? r.continue() : r.abort()));
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto(process.env.BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && QBLoft.data && window.QBDATA && window.QBRig && window.QBLook, null, { timeout: 120000 }); await p.waitForTimeout(1500);
  await p.evaluate(async (O) => { const Q = window.QBDATA, HI = O.hi; const { clips, ...poses } = Q.poses;
    window.__K = { HI, R: O.r, T: O.t, MIN: O.min, poses: O.poses ? O.poses.filter((q) => poses[q]) : Object.keys(poses) };
    window.__K.rig = await QBRig.create({ rig: Object.assign({}, Q.rig, { frame: [Q.loft.frame[0] * HI, Q.loft.frame[1] * HI], frameScale: Q.loft.frameScale * HI, anchorPad: Q.loft.anchorPad * HI, frameCache: 0 }), bodies: Q.bodies, poses, clips,
      assetUrl: (a) => (window.QBART && QBART[a]) || Q.loft.artBase + a + (Q.arthash && Q.arthash[a] ? '?h=' + Q.arthash[a] : '') });
    const NOTCLOTH = ['body', 'skinArms', 'blush', 'face', 'faceClosed', 'iris', 'hair', 'hairFront', 'hairHi', 'mouth'];
    const px = (c) => c.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, c.width, c.height).data;
    // closing (dilate then erode) of a mask by a square of radius R
    const morph = (m, w, h, r, dil) => { const t = new Uint8Array(w * h), o = new Uint8Array(w * h);
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { let v = dil ? 0 : 1; for (let k = -r; k <= r && (dil ? !v : v); k++) { const xx = x + k; const q = xx < 0 || xx >= w ? (dil ? 0 : 1) : m[y * w + xx]; if (dil ? q : !q) v = dil ? 1 : 0; } t[y * w + x] = v; }
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { let v = dil ? 0 : 1; for (let k = -r; k <= r && (dil ? !v : v); k++) { const yy = y + k; const q = yy < 0 || yy >= h ? (dil ? 0 : 1) : t[yy * w + x]; if (dil ? q : !q) v = dil ? 1 : 0; } o[y * w + x] = v; }
      return o; };
    window.__K.check = async (rig, pose) => { const K = window.__K, Q = window.QBDATA;
      const LA = QBLook.build(Q.creator, Object.assign({}, rig, { skin: 's1' })), LB = QBLook.build(Q.creator, Object.assign({}, rig, { skin: 's5' })), LG = QBLook.build(Q.creator, Object.assign({}, rig, { skin: 's1' }));
      NOTCLOTH.forEach((k) => delete LG.layers[k]);
      const cA = await K.rig.render(LA, pose), cB = await K.rig.render(LB, pose), cG = await K.rig.render(LG, pose);
      const w = cA.width, h = cA.height, A = px(cA), B = px(cB), G = px(cG); const skin = new Uint8Array(w * h), cl = new Uint8Array(w * h);
      for (let i = 0; i < w * h; i++) { const j = i * 4; const d = Math.abs(A[j] - B[j]) + Math.abs(A[j + 1] - B[j + 1]) + Math.abs(A[j + 2] - B[j + 2]); skin[i] = d > 40 && A[j + 3] > 200 ? 1 : 0; cl[i] = G[j + 3] > 160 ? 1 : 0; }
      const closed = morph(morph(cl, w, h, K.R, true), w, h, K.R, false); const ov = new Uint8Array(w * h); for (let i = 0; i < w * h; i++) ov[i] = skin[i] && cl[i] ? 1 : 0;
      /* thin skin over the clothes (a sliver or crack a few px wide) is a leak; a wide blob (an arm in front of a shirt, a hand) is not */
      const opened = morph(morph(ov, w, h, K.T, false), w, h, K.T, true); let over = 0, gap = 0, thin = 0; const mark = [], markO = [];
      for (let i = 0; i < w * h; i++) { if (!skin[i]) continue; if (cl[i]) { over++; if (opened[i]) markO.push(i); else { thin++; mark.push(i); } } else if (closed[i]) { gap++; mark.push(i); } }
      return { over, gap: gap + thin, w, h, mark, markO, canvas: cA }; };
  }, { hi: +(process.env.HI || 2), r: +(process.env.R || 3), t: +(process.env.T || 2), min: +(process.env.MIN || 4), poses: process.env.POSES ? process.env.POSES.split(',') : null });
  // the looks
  const looks = await p.evaluate((mode) => { const Q = window.QBDATA, C = Q.creator, D = C.defaults, out = [];
    if (mode === 'creator') { C.tops.forEach((t) => C.bottoms.forEach((bt) => C.shoes.forEach((s) => out.push({ id: `${t.id}+${bt.id}+${s.id}`, rig: { top: t.id, bottom: bt.id, shoe: s.id } })))); return out; }
    const x = window.__qb.x(), S = x.S; S.created = true; const slots = /^a_(top|pants|shoes|outer|dress|socks|acc|bag|neck|belt)$/;
    x.SHOP.filter((it) => slots.test(it[1]) && !(it[6] && (it[6].cut || it[6].gone))).forEach((it) => out.push({ id: it[0], slot: it[1], shop: 1 })); return out; }, process.env.LOOKS || 'creator');
  const only = process.env.ONLY ? process.env.ONLY.split(',') : null; const L = only ? looks.filter((l) => only.includes(l.id)) : looks;
  console.log('looks', L.length, 'bodies m,f', 'poses', await p.evaluate(() => window.__K.poses.length));
  const rows = []; let t0 = Date.now();
  for (const look of L) for (const bd of ['m', 'f']) {
    const r = await p.evaluate(async ([look, bd]) => { const K = window.__K, Q = window.QBDATA, x = window.__qb.x(), S = x.S, I = QBLoft.data.items;
      let rig;
      if (look.shop) { const it = x.SHOP.find((q) => q[0] === look.id); const g = I[(it[6] || {}).gar] || {}; if ((bd === 'f' && (g.maleOnly || (it[6] || {}).mo)) || (bd === 'm' && (g.femaleOnly || (it[6] || {}).fo))) return { skip: 1 };
        S.char = window.__qb.fixChar({ name: 'Cal', sex: bd }); S.owned = {}; S.owned[look.id] = true; const eq = {}; eq[look.slot] = look.id; rig = window.__qb.lookOf(eq).rig; if (!rig.equipped || !Object.keys(rig.equipped).length) return { skip: 2 };
        rig = Object.assign({}, rig, { body: bd }); }
      else rig = Object.assign({}, Q.creator.defaults, look.rig, { body: bd });
      const bare = look.shop ? !!((I[((x.SHOP.find((q) => q[0] === look.id) || [])[6] || {}).gar] || {}).bare) : false;
      const res = []; const cols = 12, cw = 64 * K.HI, ch = 100 * K.HI; let sheet = null, g = null, n = 0;
      for (let i = 0; i < K.poses.length; i++) { const c = await K.check(rig, K.poses[i]); if (c.gap >= K.MIN) { res.push([K.poses[i], c.over, c.gap]);
          if (!sheet) { sheet = document.createElement('canvas'); sheet.width = cols * cw; sheet.height = Math.ceil(K.poses.length / cols) * (ch + 14); g = sheet.getContext('2d'); g.fillStyle = '#8b8fa3'; g.fillRect(0, 0, sheet.width, sheet.height); }
          const X = (n % cols) * cw, Y = Math.floor(n / cols) * (ch + 14); n++; const cc = document.createElement('canvas'); cc.width = c.w; cc.height = c.h; const cg = cc.getContext('2d'); cg.drawImage(c.canvas, 0, 0); const id = cg.getImageData(0, 0, c.w, c.h);
          c.markO.forEach((k) => { id.data[k * 4] = Math.round(id.data[k * 4] * .6); id.data[k * 4 + 1] = Math.round(id.data[k * 4 + 1] * .6); id.data[k * 4 + 2] = 255; }); c.mark.forEach((k) => { id.data[k * 4] = 255; id.data[k * 4 + 1] = 0; id.data[k * 4 + 2] = 0; id.data[k * 4 + 3] = 255; }); cg.putImageData(id, 0, 0);
          g.drawImage(cc, 0, 0, c.w, c.h, X, Y + 14, cw, ch); g.fillStyle = '#fff'; g.font = '11px sans-serif'; g.fillText(`${K.poses[i]} o${c.over} g${c.gap}`, X + 2, Y + 11); } }
      return { res, bare, png: sheet ? sheet.toDataURL('image/png') : null }; }, [look, bd]);
    if (r.skip) continue;
    if (r.res.length) { const f = path.join(OUT, `leak_${look.id.replace(/[^a-z0-9_+-]/gi, '_')}_${bd}.png`); if (r.png) fs.writeFileSync(f, Buffer.from(r.png.split(',')[1], 'base64'));
      rows.push({ look: look.id, body: bd, bare: r.bare, poses: r.res.length, worst: r.res.sort((a, c) => c[2] - a[2]).slice(0, 4) }); console.log(look.id, bd, r.bare ? '(bare)' : '', 'leaks in', r.res.length, 'poses; worst', JSON.stringify(r.res.slice(0, 4))); }
  }
  fs.writeFileSync(path.join(OUT, 'skinleak.json'), JSON.stringify(rows, null, 1));
  console.log('looks with leaks', rows.length, 'of', L.length * 2, '| minutes', ((Date.now() - t0) / 60000).toFixed(1), '| page errors', errs.length, JSON.stringify(errs.slice(0, 2))); await b.close(); })();
