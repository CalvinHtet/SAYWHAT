// QA, Cal 11-26 (via LEAD): "The Plated hood has a gap on the right side of the character. Please do a QA check on all the items and make
// sure they look good on every hairstyle for male and female so that there is no weird gaps. They should look natural."
// Every live Shop row in the given slots (default the head: hat, glasses, mask; SLOTS=neck,top for the lighter pass), on each body it
// fits, crossed with EVERY hairstyle of that body (m 8, f 5) and poses PS, drawn by the game's rig, against the same figure and hair with
// nothing on. Skin and hair are told apart by colour swaps, not by colour guesses: each frame is drawn three times (Fair skin brown hair,
// Deep skin brown hair, Fair skin blonde hair), so a pixel that changes with the skin is skin and one that changes with the hair is hair.
//   cut:   hair pixels on the dressed figure that border see-through pixels where the bare figure was solid: hair cut off in a hard line
//          against the background (a ponytail or long hair sliced by the piece's clip line)
//   notch: pixels solid on the bare figure that turn see-through with the piece, with the dressed figure solid on both sides within D px
//          (left and right, or above and below): a gap between the piece and the hair
//   scalp: bare-figure hair turning to real skin with the piece on, in the head band, open to the background above (bald patches past the
//          piece; a forehead under a brim or hood is not counted)
//   float: loose bits of the piece in the head band, cut off from the figure
//   holes: see-through pixels enclosed by the dressed figure that the bare one does not have (listed, not scored: a raised arm and a brim
//          make most of these)
// score = cut + notch + 2*scalp + 2*float. Lists every piece by its worst frame; saves the worst TOP frames as dressed | bare | marks (red
// notch, orange cut, magenta scalp, cyan float, yellow holes) in OUT/hairgap_*.png, and per piece and hairstyle the worst score in
// OUT/hairgap.json. SHEET=1 instead saves, for each id in IDS, one sheet per body: hairstyles down, poses across.
//   BASE=<server> OUT=<dir> [IDS=a,b] [GARS=gar,gar (no Shop row yet)] [SLOTS=hat,glasses,mask] [HI=2] [D=14] [TOP=40] [PS=idle,...] NODE_PATH=<playwright> node rigtest/qa/hairgap.js
const pw = require('playwright'), fs = require('fs'); const BASE = process.env.BASE || 'http://127.0.0.1:8824', OUT = process.env.OUT || '.', HI = +process.env.HI || 2;
const CFG = { gars: (process.env.GARS || '').split(',').filter(Boolean), ids: process.env.IDS || '', slots: (process.env.SLOTS || 'hat,glasses,mask').split(','), D: +process.env.D || 14, top: +process.env.TOP || 40, sheet: !!process.env.SHEET,
  ps: (process.env.PS || 'idle,stretch,sideL,sideR,rearStand,dance1,wave1,thinkA').split(','), HI };
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] }); const p = await (await b.newContext({ viewport: { width: 1200, height: 900 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  p.on('console', (m) => { if (/^PROG/.test(m.text())) console.log(m.text()); }); await p.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
  await p.exposeFunction('qaSave', (name, u) => fs.writeFileSync(OUT + '/' + name, Buffer.from(u.split(',')[1], 'base64')));
  await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.QBLoft && window.QBDATA && window.QBRig && window.QBLook, null, { timeout: 120000 }); await p.waitForTimeout(1500);
  const r = await p.evaluate(async (CFG) => { const HI = CFG.HI, Q = window.QBDATA, x = window.__qb.x(), S = x.S, I = QBLoft.data.items; const { clips, ...poses } = Q.poses;
    const rig = await QBRig.create({ rig: Object.assign({}, Q.rig, { frame: [Q.loft.frame[0] * HI, Q.loft.frame[1] * HI], frameScale: Q.loft.frameScale * HI, anchorPad: Q.loft.anchorPad * HI, frameCache: 4 }), bodies: Q.bodies, poses, clips, assetUrl: (a) => (window.QBART && QBART[a]) || Q.loft.artBase + a + (Q.arthash && Q.arthash[a] ? '?h=' + Q.arthash[a] : '') });
    const PS = CFG.ps.filter((k) => poses[k]); const HAIRS = { m: Q.creator.hairStyles.m.map((h) => h.id), f: Q.creator.hairStyles.f.map((h) => h.id) }; const HL = { m: {}, f: {} }; ['m', 'f'].forEach((s) => Q.creator.hairStyles[s].forEach((h) => { HL[s][h.id] = h.label; }));
    /* GARS=a,b: pieces with no Shop row yet get a temporary row gx_qa_<gar> (in the hat slot for hats, a_acc otherwise) */
    CFG.gars.forEach((g) => { if (!x.SHOP.some((it) => it[0] === 'gx_qa_' + g)) x.SHOP.push(['gx_qa_' + g, (I[g] && I[g].slot === 'hat') ? 'a_hat' : 'a_acc', 'QA ' + g, 0, 1, '', { gar: g }]); });
    const ONLY = CFG.ids.split(',').filter(Boolean).concat(CFG.gars.map((g) => 'gx_qa_' + g)); const items = x.SHOP.filter((it) => it[6] && it[6].gar && !(it[6].cut || it[6].gone) && I[it[6].gar] && CFG.slots.includes(I[it[6].gar].slot) && (!ONLY.length || ONLY.includes(it[0])));
    const fits = (it, sex) => { const M = I[it[6].gar] || {}; return !(sex === 'm' && (it[6].fo || M.femaleOnly)) && !(sex === 'f' && (it[6].mo || M.maleOnly)); };
    const look = (sex, hair, ov, skin, hc) => { S.created = true; S.char = window.__qb.fixChar({ name: 'H', sex }); S.char.rig = Object.assign({}, QBLoft.data.creator.defaults, { body: sex, hairStyle: hair, hairColor: hc || 'brown', skin: skin || 's1' }); S.owned = S.owned || {}; Object.values(ov).forEach((id) => { S.owned[id] = true; }); return QBLook.build(Q.creator, window.__qb.lookOf(ov).rig); };
    const copy = (c) => { const cc = document.createElement('canvas'); cc.width = c.width; cc.height = c.height; cc.getContext('2d').drawImage(c, 0, 0); return cc; };
    const rgba = (c) => c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
    const alpha = (d, n) => { const a = new Uint8Array(n); for (let i = 0; i < n; i++) a[i] = d[i * 4 + 3] > 40 ? 1 : 0; return a; };
    const differs = (d0, d1, n) => { const m = new Uint8Array(n); for (let i = 0; i < n; i++) { if (d0[i * 4 + 3] < 120 || d1[i * 4 + 3] < 120) continue; const s = Math.abs(d0[i * 4] - d1[i * 4]) + Math.abs(d0[i * 4 + 1] - d1[i * 4 + 1]) + Math.abs(d0[i * 4 + 2] - d1[i * 4 + 2]); if (s > 60) m[i] = 1; } return m; };
    const enclosed = (a, W, H) => { const out = new Uint8Array(W * H), seen = new Uint8Array(W * H), st = []; for (let x0 = 0; x0 < W; x0++) { st.push(x0, (H - 1) * W + x0); } for (let y0 = 0; y0 < H; y0++) { st.push(y0 * W, y0 * W + W - 1); }
      while (st.length) { const i = st.pop(); if (seen[i] || a[i]) continue; seen[i] = 1; const xx = i % W, yy = (i / W) | 0; if (xx > 0) st.push(i - 1); if (xx < W - 1) st.push(i + 1); if (yy > 0) st.push(i - W); if (yy < H - 1) st.push(i + W); } for (let i = 0; i < W * H; i++) out[i] = !a[i] && !seen[i] ? 1 : 0; return out; };
    const D = CFG.D * HI / 2; const bare = {};
    const getBare = async (sex, hair, ps) => { const k = sex + hair + ps; if (!bare[k]) { const c = copy(await rig.render(look(sex, hair, {}), ps)); const d = rgba(c), n = c.width * c.height, a = alpha(d, n); const d2 = rgba(await rig.render(look(sex, hair, {}, 's1', 'blonde'), ps));
        bare[k] = { c, a, e: enclosed(a, c.width, c.height), d, hair: differs(d, d2, n) }; } return bare[k]; };
    const measure = (c, dSkin, dHair, B) => { const W = c.width, H = c.height, n = W * H, dd = rgba(c), a = alpha(dd, n), e = enclosed(a, W, H), top = Math.round(H * 0.55), head = Math.round(H * 0.42); const mk = new Uint8Array(n); let notch = 0, holes = 0, scalp = 0, cut = 0;
      const skin = differs(dd, dSkin, n), hair = differs(dd, dHair, n);
      const solidNear = (i, dx, dy) => { let xx = i % W, yy = (i / W) | 0; for (let s = 1; s <= D; s++) { xx += dx; yy += dy; if (xx < 0 || yy < 0 || xx >= W || yy >= H) return false; if (a[yy * W + xx]) return true; } return false; };
      const gone = (j) => j >= 0 && j < n && !a[j] && B.a[j];
      /* open: walking up from a skin pixel reaches the background before crossing more than 6*HI px of anything that is not skin (an
         outline yes, a brim or hood no): the scalp is bare to the sky, not a forehead under the piece */
      const open = (i) => { let run = 0; for (let j = i - W; j >= 0; j -= W) { if (!a[j]) return true; if (skin[j] || hair[j]) { run = 0; continue; } if (++run > 6 * HI) return false; } return false; };
      for (let i = 0; i < top * W; i++) { if (e[i] && !B.e[i]) { holes++; mk[i] = 2; continue; } if (B.a[i] && !a[i] && ((solidNear(i, -1, 0) && solidNear(i, 1, 0)) || (solidNear(i, 0, -1) && solidNear(i, 0, 1)))) { notch++; mk[i] = 1; continue; }
        if (hair[i] && (gone(i - 1) || gone(i + 1) || gone(i - W) || gone(i + W))) { cut++; mk[i] = 5; continue; } if (i < head * W && B.hair[i] && skin[i] && open(i)) { scalp++; mk[i] = 3; } }
      let flt = 0; { const lab = new Int32Array(n); let nl = 0; const sizes = [0], own = [0]; for (let i0 = 0; i0 < top * W; i0++) { if (!a[i0] || lab[i0]) continue; nl++; let sz = 0, ow = 0; const st = [i0]; lab[i0] = nl; while (st.length) { const i = st.pop(); sz++; if (!B.a[i]) ow++; const xx = i % W, yy = (i / W) | 0;
          for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const x2 = xx + dx, y2 = yy + dy; if (x2 < 0 || y2 < 0 || x2 >= W || y2 >= top) continue; const j = y2 * W + x2; if (a[j] && !lab[j]) { lab[j] = nl; st.push(j); } } } sizes.push(sz); own.push(ow); }
        let big = 1; for (let l = 2; l <= nl; l++) if (sizes[l] > sizes[big]) big = l; const keep = {}; for (let l = 1; l <= nl; l++) if (l !== big && sizes[l] >= 12 * HI && own[l] > sizes[l] / 2 && sizes[l] < sizes[big] / 4) { keep[l] = 1; flt += sizes[l]; } if (flt) for (let i = 0; i < top * W; i++) if (keep[lab[i]]) mk[i] = 4; }
      return { cut, notch, holes, scalp, flt, score: cut + notch + 2 * scalp + 2 * flt, mk }; };
    const marks = (c, B, mk) => { const W = c.width, H = Math.round(c.height * 0.6); const out = document.createElement('canvas'); out.width = W * 3; out.height = H; const g = out.getContext('2d'); g.fillStyle = '#8b8fa3'; g.fillRect(0, 0, W * 3, H); g.drawImage(c, 0, 0); g.drawImage(B.c, W, 0); g.drawImage(c, 2 * W, 0); g.globalAlpha = 0.25; g.fillStyle = '#000'; g.fillRect(2 * W, 0, W, H); g.globalAlpha = 1;
      const id = g.getImageData(2 * W, 0, W, H); const col = { 1: [255, 0, 0], 2: [255, 230, 0], 3: [255, 0, 255], 4: [0, 255, 255], 5: [255, 140, 0] }; for (let i = 0; i < W * H; i++) if (mk[i]) { const q = col[mk[i]]; id.data[i * 4] = q[0]; id.data[i * 4 + 1] = q[1]; id.data[i * 4 + 2] = q[2]; id.data[i * 4 + 3] = 255; } g.putImageData(id, 2 * W, 0); return out; };
    if (CFG.sheet) { for (const it of items) for (const sex of ['m', 'f']) { if (!fits(it, sex)) continue; const ov = { [it[1]]: it[0] }; const cs = []; for (const hair of HAIRS[sex]) { const row = []; for (const ps of PS) { try { row.push(copy(await rig.render(look(sex, hair, ov), ps))); } catch (e) { row.push(null); } } cs.push(row); }
        const w0 = cs[0].find(Boolean).width, h0 = cs[0].find(Boolean).height, cw = Math.round(w0 * 0.75), ch = Math.round(h0 * 0.55); const out = document.createElement('canvas'); out.width = 90 + cw * PS.length; out.height = 22 + ch * cs.length; const g = out.getContext('2d'); g.fillStyle = '#8b8fa3'; g.fillRect(0, 0, out.width, out.height); g.fillStyle = '#000'; g.font = 'bold 14px sans-serif';
        PS.forEach((ps, j) => g.fillText(ps, 90 + j * cw + 8, 16)); cs.forEach((row, k) => { g.fillText(HL[sex][HAIRS[sex][k]], 4, 22 + k * ch + ch / 2); row.forEach((c, j) => { if (c) g.drawImage(c, (w0 - cw) / 2, 0, cw, ch, 90 + j * cw, 22 + k * ch, cw, ch); }); });
        await window.qaSave('sheet_' + it[0] + '_' + sex + '.png', out.toDataURL('image/png')); } return { sheets: items.length }; }
    const res = [], worst = []; let k = 0; for (const it of items) { k++; if (k % 5 === 0) console.log('PROG ' + k + '/' + items.length); const row = { id: it[0], name: it[2], slot: I[it[6].gar].slot, worst: 0, frame: '', per: {} };
      for (const sex of ['m', 'f']) { if (!fits(it, sex)) continue; for (const hair of HAIRS[sex]) for (const ps of PS) { const ov = { [it[1]]: it[0] }; let c, dS, dH; try { c = copy(await rig.render(look(sex, hair, ov), ps)); dS = rgba(await rig.render(look(sex, hair, ov, 's5'), ps)); dH = rgba(await rig.render(look(sex, hair, ov, 's1', 'blonde'), ps)); } catch (e) { continue; }
          const B = await getBare(sex, hair, ps); const m = measure(c, dS, dH, B);
          const hk = sex + ' ' + HL[sex][hair]; if (!row.per[hk] || m.score > row.per[hk].s) row.per[hk] = { s: m.score, ps, cut: m.cut, notch: m.notch, scalp: m.scalp, flt: m.flt };
          if (m.score > row.worst) { row.worst = m.score; row.frame = sex + ' ' + HL[sex][hair] + ' ' + ps; row.cut = m.cut; row.notch = m.notch; row.holes = m.holes; row.scalp = m.scalp; row.flt = m.flt; }
          if (m.score > 30) { const prev = worst.findIndex((w0) => w0.id === it[0]); if (prev < 0 || worst[prev].score < m.score) { const u = marks(c, B, m.mk).toDataURL('image/png'); if (prev >= 0) worst.splice(prev, 1); worst.push({ score: m.score, id: it[0], frame: row.frame.replace(/ /g, '_'), u }); worst.sort((p1, p2) => p2.score - p1.score); worst.length = Math.min(worst.length, CFG.top); } } } }
      res.push(row); }
    for (let i = 0; i < worst.length; i++) await window.qaSave('hairgap_' + String(i).padStart(2, '0') + '_' + worst[i].id + '_' + worst[i].frame + '.png', worst[i].u);
    return { res: res.sort((a2, b2) => b2.worst - a2.worst), n: items.length, PS, HAIRS }; }, CFG);
  if (r.sheets !== undefined) { console.log('sheets for ' + r.sheets + ' ids'); } else {
    fs.writeFileSync(OUT + '/hairgap.json', JSON.stringify(r.res, null, 1)); console.log('pieces ' + r.n + ' (' + CFG.slots.join(',') + '), poses ' + r.PS.join(',') + ', hairs m ' + r.HAIRS.m.length + ' f ' + r.HAIRS.f.length + ', HI ' + HI + ', D ' + CFG.D + '; worst first (score = cut + notch + 2 x scalp + 2 x float):');
    r.res.slice(0, 70).forEach((x) => console.log('  ' + String(x.worst).padStart(6) + '  ' + x.id.padEnd(24) + ' ' + (x.frame || '').padEnd(28) + ' cut ' + x.cut + ' notch ' + x.notch + ' scalp ' + x.scalp + ' float ' + x.flt + ' (holes ' + x.holes + ')  ' + x.name));
    console.log('  ... ' + r.res.filter((x) => x.worst <= 30).length + ' pieces at 30 or under'); }
  console.log('page errors ' + errs.length + ' ' + JSON.stringify(errs.slice(0, 2))); await b.close(); })();
