// QA, 4eed92a7 (29zz_v162.js: nine poses on the player card, each one frame of a rig clip drawn sharp). CLAUDE.md: "Test every outfit
// combination and every pose before calling anything ready." Every Shop row with a_ slot (clothes, hair, marks; cut/gone left out),
// worn alone over the default look, on each body it fits, in the nine card frames (PCPOSE: clip + frame through rig.clipPose), drawn by
// the game's own rig at HI x the room frame. Per frame:
//   nd     not drawn (render threw)
//   lost   pixels solid in the bare figure of the same pose (alpha > 128) and see-through with the piece (alpha < 40): a tear or a gap
//          the piece opens to the background
//   holes  see-through pixels enclosed by the figure (not reachable from the frame's edge) that the bare figure does not have
// Writes pose_list.txt (worst first), pose_worst_N.png (the worst frames: dressed | bare | red = lost, yellow = new holes) and
// pose_back_<m|f>.png (every piece in the back pose, small, for the eye: front-only art must not show from behind).
//   BASE=<server> OUT=<folder> [HI=2] [SLOTS=a_top,a_pants] [LIMIT=n] node rigtest/qa/posesweep162.js
const pw = require('playwright'), fs = require('fs');
const HI = +process.env.HI || 2, OUT = process.env.OUT || 'qa-out/posesweep'; fs.mkdirSync(OUT, { recursive: true });
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] });
  const p = await (await b.newContext({ viewport: { width: 1200, height: 900 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160))); p.on('console', (m) => { if (/^PROG/.test(m.text())) console.log(m.text()); });
  await p.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
  await p.goto(process.env.BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.QBLoft && window.QBDATA && window.QBRig && window.QBLook && window.__qbV162, null, { timeout: 120000 }); await p.waitForTimeout(1500);
  const r = await p.evaluate(async ([HI, SLOTS, LIMIT]) => { const Q = window.QBDATA, x = window.__qb.x(), S = x.S, I = QBLoft.data.items; const { clips, ...poses } = Q.poses;
    const rig = await QBRig.create({ rig: Object.assign({}, Q.rig, { frame: [Q.loft.frame[0] * HI, Q.loft.frame[1] * HI], frameScale: Q.loft.frameScale * HI, anchorPad: Q.loft.anchorPad * HI, frameCache: 4 }), bodies: Q.bodies, poses, clips,
      assetUrl: (a) => (window.QBART && QBART[a]) || Q.loft.artBase + a + (Q.arthash && Q.arthash[a] ? '?h=' + Q.arthash[a] : '') });
    const PP = window.__qbV162.poses.map((q) => ({ id: q[0], clip: q[2], f: q[3] }));
    let rows = x.SHOP.filter((it) => /^a_/.test(it[1]) && !(it[6] && (it[6].cut || it[6].gone)) && (!SLOTS || SLOTS.includes(it[1]))); if (LIMIT) rows = rows.slice(0, LIMIT);
    const setBody = (sex) => { S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex }); S.char.rig = Object.assign({}, QBLoft.data.creator.defaults, { body: sex, hairStyle: 'h1', hairColor: 'brown' }); S.owned = S.owned || {}; };
    const grab = (c) => { const cc = document.createElement('canvas'); cc.width = c.width; cc.height = c.height; cc.getContext('2d').drawImage(c, 0, 0); return { cv: cc, d: cc.getContext('2d').getImageData(0, 0, c.width, c.height).data, w: c.width, h: c.height }; };
    const holes = (d, w, h) => { const seen = new Uint8Array(w * h), st = []; const tr = (i) => d[i * 4 + 3] < 40; for (let xx = 0; xx < w; xx++) { st.push(xx, (h - 1) * w + xx); } for (let y = 0; y < h; y++) { st.push(y * w, y * w + w - 1); }
      while (st.length) { const i = st.pop(); if (i < 0 || i >= w * h || seen[i] || !tr(i)) continue; seen[i] = 1; const xx = i % w; st.push(i - w, i + w); if (xx > 0) st.push(i - 1); if (xx < w - 1) st.push(i + 1); }
      const m = new Uint8Array(w * h); for (let i = 0; i < w * h; i++) if (tr(i) && !seen[i]) m[i] = 1; return m; };
    const base = {}; for (const sex of ['m', 'f']) { setBody(sex); const L = window.__qb.lookOf({}).rig; base[sex] = {}; for (const P of PP) { const G = grab(await rig.render(QBLook.build(Q.creator, L), rig.clipPose(P.clip, P.f))); G.holes = holes(G.d, G.w, G.h); base[sex][P.id] = G; } }
    const out = [], worst = []; const keepWorst = (rec) => { worst.push(rec); worst.sort((a, z) => z.score - a.score); if (worst.length > 48) { const gone = worst.pop(); } };
    const backs = { m: [], f: [] }; const t0 = performance.now();
    for (let k = 0; k < rows.length; k++) { const it = rows[k], e = it[6] || {}, M = e.gar ? I[e.gar] || {} : {}; const res = { id: it[0], name: it[2], slot: it[1], b: e.b || '', nd: 0, lost: 0, holes: 0, at: '' };
      for (const sex of ['m', 'f']) { const fits = !(sex === 'm' && (e.fo || M.femaleOnly)) && !(sex === 'f' && (e.mo || M.maleOnly)); if (!fits) continue; setBody(sex); S.owned[it[0]] = true;
        const ov = {}; ov[it[1]] = it[0]; let L = null; try { L = window.__qb.lookOf(ov).rig; } catch (er) { res.nd++; continue; }
        for (const P of PP) { let G; try { G = grab(await rig.render(QBLook.build(Q.creator, L), rig.clipPose(P.clip, P.f))); } catch (er) { res.nd++; continue; }
          const B = base[sex][P.id]; if (G.w !== B.w || G.h !== B.h) { res.nd++; continue; } const H = holes(G.d, G.w, G.h); let lost = 0, nh = 0;
          for (let i = 0; i < G.w * G.h; i++) { if (B.d[i * 4 + 3] > 128 && G.d[i * 4 + 3] < 40) lost++; if (H[i] && !B.holes[i]) nh++; }
          const sc = lost + nh / 2; if (sc > res.lost + res.holes / 2) { res.lost = lost; res.holes = nh; res.at = sex + ':' + P.id; }
          if (sc > 40) { const w = G.w, h = G.h, cv = document.createElement('canvas'); cv.width = w * 3; cv.height = h; const g = cv.getContext('2d'); g.fillStyle = '#8b8fa3'; g.fillRect(0, 0, w * 3, h); g.drawImage(G.cv, 0, 0); g.drawImage(B.cv, w, 0); g.drawImage(G.cv, w * 2, 0); g.globalAlpha = .35; g.drawImage(B.cv, w * 2, 0); g.globalAlpha = 1;
            const id2 = g.getImageData(w * 2, 0, w, h); for (let i = 0; i < w * h; i++) { if (B.d[i * 4 + 3] > 128 && G.d[i * 4 + 3] < 40) { id2.data[i * 4] = 255; id2.data[i * 4 + 1] = 0; id2.data[i * 4 + 2] = 0; id2.data[i * 4 + 3] = 255; } else if (H[i] && !B.holes[i]) { id2.data[i * 4] = 255; id2.data[i * 4 + 1] = 220; id2.data[i * 4 + 2] = 0; id2.data[i * 4 + 3] = 255; } } g.putImageData(id2, w * 2, 0);
            g.fillStyle = '#000'; g.font = 'bold 14px sans-serif'; g.fillText(it[0] + ' ' + sex + ' ' + P.id + ' lost ' + lost + ' holes ' + nh, 6, 16); keepWorst({ score: sc, url: cv.toDataURL('image/png') }); }
          if (P.id === 'back') { const t = document.createElement('canvas'); t.width = Math.round(G.w / 3); t.height = Math.round(G.h / 3); t.getContext('2d').drawImage(G.cv, 0, 0, t.width, t.height); backs[sex].push({ id: it[0], url: t.toDataURL('image/png') }); } } }
      out.push(res); if (k % 25 === 0) console.log('PROG ' + k + '/' + rows.length + ' ' + Math.round((performance.now() - t0) / 1000) + ' s'); }
    /* back sheets */
    const backSheets = {}; for (const sex of ['m', 'f']) { const L = backs[sex]; if (!L.length) continue; const tw = Math.round(Q.loft.frame[0] * HI / 3), th = Math.round(Q.loft.frame[1] * HI / 3) + 12, cols = 20, rowsN = Math.ceil(L.length / cols); const cv = document.createElement('canvas'); cv.width = cols * tw; cv.height = rowsN * th; const g = cv.getContext('2d'); g.fillStyle = '#8b8fa3'; g.fillRect(0, 0, cv.width, cv.height); g.font = '9px sans-serif';
      for (let i = 0; i < L.length; i++) { const im = new Image(); im.src = L[i].url; await im.decode(); const X = (i % cols) * tw, Y = Math.floor(i / cols) * th; g.drawImage(im, X, Y + 12); g.fillStyle = '#000'; g.fillText(L[i].id.replace(/^gx_/, '').slice(0, 14), X + 2, Y + 10); } backSheets[sex] = cv.toDataURL('image/png'); }
    return { out, worst: worst.map((w) => w.url), backSheets, n: rows.length }; }, [HI, process.env.SLOTS ? process.env.SLOTS.split(',') : null, +process.env.LIMIT || 0]);
  r.worst.forEach((u, i) => fs.writeFileSync(`${OUT}/pose_worst_${String(i).padStart(2, '0')}.png`, Buffer.from(u.split(',')[1], 'base64')));
  for (const [sex, u] of Object.entries(r.backSheets)) fs.writeFileSync(`${OUT}/pose_back_${sex}.png`, Buffer.from(u.split(',')[1], 'base64'));
  const lines = r.out.sort((a, z) => (z.nd - a.nd) || ((z.lost + z.holes / 2) - (a.lost + a.holes / 2)));
  fs.writeFileSync(`${OUT}/pose_list.txt`, lines.map((q) => `${(q.nd ? 'ND ' : '') + String(q.lost).padStart(6)} lost ${String(q.holes).padStart(6)} holes  at ${q.at.padEnd(12)} ${q.id.padEnd(22)} ${q.slot.padEnd(9)} ${q.b.padEnd(6)} ${q.name}`).join('\n'));
  console.log(`pieces ${r.n}, not drawn ${lines.reduce((a, q) => a + q.nd, 0)}, worst frames kept ${r.worst.length}, page errors ${errs.length} ${JSON.stringify(errs.slice(0, 2))}`);
  await b.close(); })();
