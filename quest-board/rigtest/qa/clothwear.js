// QA: wear-check tops, trousers and shoes that may have no Shop row yet. For each gar in GARS, on both bodies, every pose, over each base
// outfit in OUTFITS (";"-separated; each "slot:shopid+slot:shopid", "" = the default look), with the game's rig: renders the base look
// and the base look plus the piece, and counts
//   holes: see-through pixels enclosed by the dressed figure that the base figure does not have (tears, gaps between pieces)
//   lost:  pixels solid on the base figure that turn see-through with the piece (cuts through the body or another piece)
// Saves per gar and body: cloth_<gar>_<body>.png, rows = poses, columns = outfits, each cell dressed | marks (red lost, yellow holes).
//   BASE=<server> OUT=<dir> GARS=nc_cardigan,nc_waffle OUTFITS=";a_top:gx_nc_tee" [HAIR_M=h1 HAIR_F=h1] NODE_PATH=<playwright> node rigtest/qa/clothwear.js
const pw = require('playwright'), fs = require('fs'); const BASE = process.env.BASE || 'http://127.0.0.1:8824', OUT = process.env.OUT || '.';
const GARS = (process.env.GARS || '').split(',').filter(Boolean), OUTFITS = (process.env.OUTFITS === undefined ? '' : process.env.OUTFITS).split(';');
const HAIR = { m: process.env.HAIR_M || 'h1', f: process.env.HAIR_F || 'h1' };
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] }); const p = await (await b.newContext({ viewport: { width: 1200, height: 900 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
  await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.QBLoft && window.QBDATA && window.QBRig && window.QBLook, null, { timeout: 120000 }); await p.waitForTimeout(1500);
  const r = await p.evaluate(async ([GARS, OUTFITS, HAIR]) => { const Q = window.QBDATA, x = window.__qb.x(), S = x.S, I = QBLoft.data.items; const { clips, ...poses } = Q.poses; const HI = 2;
    const rig = await QBRig.create({ rig: Object.assign({}, Q.rig, { frame: [Q.loft.frame[0] * HI, Q.loft.frame[1] * HI], frameScale: Q.loft.frameScale * HI, anchorPad: Q.loft.anchorPad * HI, frameCache: 4 }), bodies: Q.bodies, poses, clips, assetUrl: (a) => (window.QBART && QBART[a]) || Q.loft.artBase + a + (Q.arthash && Q.arthash[a] ? '?h=' + Q.arthash[a] : '') });
    const SK = { top: 'a_top', pants: 'a_pants', shoes: 'a_shoes', hat: 'a_hat' }; const keyOf = (g) => SK[(I[g] || {}).slot] || 'a_acc';
    GARS.forEach((g) => { if (!x.SHOP.some((it) => it[0] === 'gx_qa_' + g)) x.SHOP.push(['gx_qa_' + g, keyOf(g), 'QA ' + g, 0, 1, '', { gar: g }]); });
    const PS = Object.keys(poses); const parse = (s) => { const o = {}; (s || '').split('+').filter(Boolean).forEach((kv) => { const [k, v] = kv.split(':'); o[k] = v; }); return o; };
    const look = (sex, ov) => { S.created = true; S.char = window.__qb.fixChar({ name: 'C', sex }); S.char.rig = Object.assign({}, QBLoft.data.creator.defaults, { body: sex, hairStyle: HAIR[sex], hairColor: 'brown' }); S.owned = S.owned || {}; Object.values(ov).forEach((id) => { S.owned[id] = true; }); return QBLook.build(Q.creator, window.__qb.lookOf(ov).rig); };
    const grab = (c) => { const cc = document.createElement('canvas'); cc.width = c.width; cc.height = c.height; cc.getContext('2d').drawImage(c, 0, 0); return cc; };
    const alpha = (d, n) => { const a = new Uint8Array(n); for (let i = 0; i < n; i++) a[i] = d[i * 4 + 3] > 40 ? 1 : 0; return a; };
    const enclosed = (a, W, H) => { const seen = new Uint8Array(W * H), st = []; for (let x0 = 0; x0 < W; x0++) st.push(x0, (H - 1) * W + x0); for (let y0 = 0; y0 < H; y0++) st.push(y0 * W, y0 * W + W - 1);
      while (st.length) { const i = st.pop(); if (seen[i] || a[i]) continue; seen[i] = 1; const xx = i % W; if (xx > 0) st.push(i - 1); if (xx < W - 1) st.push(i + 1); if (i >= W) st.push(i - W); if (i < W * (H - 1)) st.push(i + W); } const out = new Uint8Array(W * H); for (let i = 0; i < W * H; i++) out[i] = !a[i] && !seen[i] ? 1 : 0; return out; };
    const res = [], sheets = [];
    for (const g of GARS) for (const sex of ['m', 'f']) { let sheet = null, CW = 0, CH = 0;
      for (let oi = 0; oi < OUTFITS.length; oi++) { const base = parse(OUTFITS[oi]); for (let pi = 0; pi < PS.length; pi++) { const ps = PS[pi]; let c0, c1;
          try { c0 = grab(await rig.render(look(sex, base), ps)); c1 = grab(await rig.render(look(sex, Object.assign({}, base, { [keyOf(g)]: 'gx_qa_' + g })), ps)); } catch (e) { res.push({ g, sex, ps, o: OUTFITS[oi], err: String(e).slice(0, 80) }); continue; }
          const W = c0.width, H = c0.height, N = W * H, d0 = c0.getContext('2d').getImageData(0, 0, W, H).data, d1 = c1.getContext('2d').getImageData(0, 0, W, H).data, a0 = alpha(d0, N), a1 = alpha(d1, N), e0 = enclosed(a0, W, H), e1 = enclosed(a1, W, H);
          let holes = 0, lost = 0, changed = 0; const mk = new Uint8Array(N); for (let i = 0; i < N; i++) { if (e1[i] && !e0[i]) { holes++; mk[i] = 2; } if (a0[i] && !a1[i]) { lost++; mk[i] = 1; } const j = i * 4; if (Math.abs(d0[j] - d1[j]) + Math.abs(d0[j + 1] - d1[j + 1]) + Math.abs(d0[j + 2] - d1[j + 2]) > 60) changed++; }
          res.push({ g, sex, ps, o: OUTFITS[oi], holes, lost, changed });
          if (!sheet) { CW = W * 2; CH = H; sheet = document.createElement('canvas'); sheet.width = CW * OUTFITS.length; sheet.height = CH * PS.length; const sg = sheet.getContext('2d'); sg.fillStyle = '#8b8fa3'; sg.fillRect(0, 0, sheet.width, sheet.height); }
          const sg = sheet.getContext('2d'); sg.drawImage(c1, oi * CW, pi * CH); const m = document.createElement('canvas'); m.width = W; m.height = H; const mg = m.getContext('2d'); mg.globalAlpha = 0.5; mg.drawImage(c1, 0, 0); mg.globalAlpha = 1; const id = mg.getImageData(0, 0, W, H);
          for (let i = 0; i < N; i++) { if (mk[i] === 1) { id.data[i * 4] = 255; id.data[i * 4 + 1] = 0; id.data[i * 4 + 2] = 0; id.data[i * 4 + 3] = 255; } else if (mk[i] === 2) { id.data[i * 4] = 255; id.data[i * 4 + 1] = 220; id.data[i * 4 + 2] = 0; id.data[i * 4 + 3] = 255; } } mg.putImageData(id, 0, 0); sg.drawImage(m, oi * CW + W, pi * CH); } }
      if (sheet) { const sm = document.createElement('canvas'); const k = Math.min(1, 2400 / sheet.width); sm.width = Math.round(sheet.width * k); sm.height = Math.round(sheet.height * k); sm.getContext('2d').drawImage(sheet, 0, 0, sm.width, sm.height); sheets.push({ name: 'cloth_' + g + '_' + sex, u: sm.toDataURL('image/png') }); } }
    return { res, sheets, poses: PS }; }, [GARS, OUTFITS, HAIR]);
  r.sheets.forEach((s) => fs.writeFileSync(OUT + '/' + s.name + '.png', Buffer.from(s.u.split(',')[1], 'base64')));
  console.log('poses ' + r.poses.length + '; outfits ' + JSON.stringify(OUTFITS) + '; hair m ' + HAIR.m + ' f ' + HAIR.f);
  for (const g of GARS) for (const sex of ['m', 'f']) { const R = r.res.filter((q) => q.g === g && q.sex === sex && !q.err); const wh = R.slice().sort((a, c) => c.holes - a.holes)[0] || {}, wl = R.slice().sort((a, c) => c.lost - a.lost)[0] || {};
    const unseen = R.filter((q) => q.changed < 50).map((q) => q.ps + (q.o ? '/' + q.o : ''));
    console.log(g.padEnd(14) + sex + '  frames ' + R.length + '  holes>40 in ' + R.filter((q) => q.holes > 40).length + ' (worst ' + (wh.holes || 0) + ' ' + wh.ps + ' ' + (wh.o || 'default') + ')  lost>40 in ' + R.filter((q) => q.lost > 40).length + ' (worst ' + (wl.lost || 0) + ' ' + wl.ps + ' ' + (wl.o || 'default') + ')' + (unseen.length ? '  piece barely visible in ' + unseen.length + ': ' + unseen.slice(0, 6).join(' ') : '')); }
  const E = r.res.filter((q) => q.err); if (E.length) console.log('render errors ' + E.length + ' ' + JSON.stringify(E.slice(0, 2)));
  console.log('page errors ' + errs.length + ' ' + JSON.stringify(errs.slice(0, 2))); await b.close(); })();
