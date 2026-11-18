// Fit sweep (QA, Cal 2026-11-18: "check all the outfits and clothing items ... if they don't fit over the character properly"):
// every clothing row on sale (not cut, not gone) worn alone over the default look, on each body it fits, in four poses, drawn by the
// game's own rig. For each render: not drawn, and "out%" = the share of the piece's changed pixels that land outside the dressed
// silhouette (the same look without the piece, grown by 4 px). High out% on a top, bottom or shoes points at a garment that floats or
// sits off the body; hats and backs sit outside by nature, so their bar is higher. Writes fit_list.txt (sorted) and contact sheets
// fit_sheet_N.png (one block per piece: m and f, four poses).
//   BASE=<server> OUT=<folder> [BRANDS=v,o] [HI=1] node rigtest/qa/fitsweep.js
const pw = require('playwright'), fs = require('fs');
const POSES = ['idle', 'rearStand', 'sitFront', 'walk2'], HI = +process.env.HI || 1, OUT = process.env.OUT || 'qa-out/fit';
(async () => { fs.mkdirSync(OUT, { recursive: true });
  const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] });
  const p = await (await b.newContext({ viewport: { width: 1200, height: 900 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto(process.env.BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && QBLoft.data && window.QBDATA && window.QBRig && window.QBLook, null, { timeout: 120000 }); await p.waitForTimeout(1500);
  const r = await p.evaluate(async ([POSES, HI, BR]) => { const Q = window.QBDATA, x = window.__qb.x(), S = x.S, I = QBLoft.data.items; const { clips, ...poses } = Q.poses;
    const rig = await QBRig.create({ rig: Object.assign({}, Q.rig, { frame: [Q.loft.frame[0] * HI, Q.loft.frame[1] * HI], frameScale: Q.loft.frameScale * HI, anchorPad: Q.loft.anchorPad * HI, frameCache: 4 }), bodies: Q.bodies, poses, clips,
      assetUrl: (a) => (window.QBART && QBART[a]) || Q.loft.artBase + a + (Q.arthash && Q.arthash[a] ? '?h=' + Q.arthash[a] : '') });
    const rows = x.SHOP.filter((it) => /^a_/.test(it[1]) && !(it[6] && (it[6].cut || it[6].gone)) && (!BR || BR.indexOf((it[6] || {}).b) >= 0));
    const setBody = (sex) => { S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex }); S.char.rig = Object.assign({}, QBLoft.data.creator.defaults, { body: sex, hairStyle: 'h1', hairColor: 'brown' }); S.owned = S.owned || {}; };
    const toData = (c) => { const g = c.getContext('2d'); return g.getImageData(0, 0, c.width, c.height); };
    const base = {}; for (const sex of ['m', 'f']) { setBody(sex); const L = window.__qb.lookOf({}).rig; base[sex] = {}; for (const ps of POSES) { const c = await rig.render(QBLook.build(Q.creator, L), ps); const cc = document.createElement('canvas'); cc.width = c.width; cc.height = c.height; cc.getContext('2d').drawImage(c, 0, 0); base[sex][ps] = { d: toData(cc), w: c.width, h: c.height }; } }
    // grown silhouette masks
    const grow = (d, w, h, k) => { const m = new Uint8Array(w * h); for (let i = 0; i < w * h; i++) if (d.data[i * 4 + 3] > 20) m[i] = 1; let cur = m; for (let s = 0; s < k; s++) { const n = cur.slice(); for (let y = 1; y < h - 1; y++) for (let xx = 1; xx < w - 1; xx++) { const i = y * w + xx; if (!cur[i] && (cur[i - 1] || cur[i + 1] || cur[i - w] || cur[i + w])) n[i] = 1; } cur = n; } return cur; };
    Object.keys(base).forEach((sex) => POSES.forEach((ps) => { const B = base[sex][ps]; B.m = grow(B.d, B.w, B.h, 4); }));
    const out = [], cw = Math.round(64 * HI), ch = Math.round(100 * HI), per = 3, blockW = cw * POSES.length * 2 + 8, labelH = 26;
    const sheets = []; let cv = null, g = null, n = 0; const rowsPer = 10;
    const newSheet = () => { cv = document.createElement('canvas'); cv.width = per * blockW; cv.height = rowsPer * (ch + labelH); g = cv.getContext('2d'); g.fillStyle = '#8b8fa3'; g.fillRect(0, 0, cv.width, cv.height); };
    for (let k = 0; k < rows.length; k++) { const it = rows[k], e = it[6] || {}, M = e.gar ? I[e.gar] || {} : {};
      if (k % (per * rowsPer) === 0) { if (cv) sheets.push(cv.toDataURL('image/png')); newSheet(); }
      const slot = k % (per * rowsPer), bx = (slot % per) * blockW, by = Math.floor(slot / per) * (ch + labelH);
      g.fillStyle = '#fff'; g.font = 'bold 11px sans-serif'; g.fillText((it[2] + ' | ' + it[0].replace(/^gx_/, '') + ' | ' + it[1].slice(2)).slice(0, 62), bx + 4, by + 12);
      const res = { id: it[0], name: it[2], slot: it[1], b: e.b || '', out: {}, nd: 0 };
      for (const sex of ['m', 'f']) { const fits = !(sex === 'm' && (e.fo || M.femaleOnly)) && !(sex === 'f' && (e.mo || M.maleOnly)); if (!fits) continue; setBody(sex); S.owned[it[0]] = true;
        const ov = {}; ov[it[1]] = it[0]; let L = null; try { L = window.__qb.lookOf(ov).rig; } catch (er) { res.nd++; continue; }
        for (let pi = 0; pi < POSES.length; pi++) { const ps = POSES[pi], X = bx + (sex === 'm' ? 0 : POSES.length * cw) + pi * cw, Y = by + labelH - 8;
          try { const c = await rig.render(QBLook.build(Q.creator, L), ps); g.drawImage(c, X, Y, cw, ch);
            const cc = document.createElement('canvas'); cc.width = c.width; cc.height = c.height; cc.getContext('2d').drawImage(c, 0, 0); const d = toData(cc), B = base[sex][ps];
            let ch1 = 0, outN = 0; if (d.width === B.w && d.height === B.h) { for (let i = 0; i < B.w * B.h; i++) { const a = d.data[i * 4 + 3], a0 = B.d.data[i * 4 + 3]; const diff = Math.abs(d.data[i * 4] - B.d.data[i * 4]) + Math.abs(d.data[i * 4 + 1] - B.d.data[i * 4 + 1]) + Math.abs(d.data[i * 4 + 2] - B.d.data[i * 4 + 2]) + Math.abs(a - a0);
              if (diff > 60 && a > 20) { ch1++; if (!B.m[i]) outN++; } } }
            res.out[sex + ':' + ps] = ch1 ? Math.round(outN / ch1 * 100) : 0;
          } catch (er) { res.nd++; g.fillStyle = '#c00'; g.fillText('NOT DRAWN', X + 2, Y + 40); } } }
      out.push(res); }
    if (cv) sheets.push(cv.toDataURL('image/png'));
    return { out, sheets, n: rows.length }; }, [POSES, HI, process.env.BRANDS ? process.env.BRANDS.split(',') : null]);
  r.sheets.forEach((s, i) => fs.writeFileSync(`${OUT}/fit_sheet_${i}.png`, Buffer.from(s.split(',')[1], 'base64')));
  const bar = { a_hat: 85, a_back: 85, a_acc: 60, a_mask: 60, a_top: 30, a_pants: 30, a_shoes: 30 };
  const lines = r.out.map((q) => { const vals = Object.values(q.out), mx = vals.length ? Math.max(...vals) : 0; return { q, mx, flag: q.nd || mx > (bar[q.slot] || 40) }; }).sort((a, z) => (z.flag - a.flag) || (z.mx - a.mx));
  fs.writeFileSync(`${OUT}/fit_list.txt`, lines.map((l) => `${l.flag ? 'FLAG' : 'ok  '} ${l.q.id.padEnd(22)} ${l.q.slot.padEnd(8)} ${l.q.b.padEnd(8)} max out ${String(l.mx).padStart(3)}%  not drawn ${l.q.nd}  ${JSON.stringify(l.q.out)}  ${l.q.name}`).join('\n'));
  console.log(`pieces ${r.n}, sheets ${r.sheets.length}, flagged ${lines.filter((l) => l.flag).length}, not drawn ${lines.reduce((a, l) => a + l.q.nd, 0)}, page errors ${errs.length} ${JSON.stringify(errs.slice(0, 2))}`);
  await b.close(); })();
