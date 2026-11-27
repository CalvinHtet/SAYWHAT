// QA: wear-check glasses that have no Shop row yet. For each gar id in IDS, on each body, every pose, over OUTFITS (top ids, "" = default),
// with every creator hairstyle: renders dressed and bare with the game's rig and counts the pixels that change (RGB diff > 24, or alpha).
//   head: changes inside the head box (where glasses belong); away: changes below the head box (stray strokes on neck, body, arms)
// Saves per id: glass_<id>_<body>.png, rows = poses, columns = hairstyles, each cell dressed | marks (red = away, yellow = head).
//   BASE=<server> OUT=<dir> IDS=nc_clear,nc_catshades,nc_visorshade [OUTFITS=,gx_nc_tee] NODE_PATH=<playwright> node rigtest/qa/glasswear.js
const pw = require('playwright'), fs = require('fs'); const BASE = process.env.BASE || 'http://127.0.0.1:8824', OUT = process.env.OUT || '.';
const IDS = (process.env.IDS || '').split(',').filter(Boolean), OUTFITS = (process.env.OUTFITS === undefined ? '' : process.env.OUTFITS).split(',');
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] }); const p = await (await b.newContext({ viewport: { width: 1200, height: 900 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
  await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.QBLoft && window.QBDATA && window.QBRig && window.QBLook, null, { timeout: 120000 }); await p.waitForTimeout(1500);
  const r = await p.evaluate(async ([IDS, OUTFITS]) => { const Q = window.QBDATA, x = window.__qb.x(), S = x.S; const { clips, ...poses } = Q.poses; const HI = 2;
    const rig = await QBRig.create({ rig: Object.assign({}, Q.rig, { frame: [Q.loft.frame[0] * HI, Q.loft.frame[1] * HI], frameScale: Q.loft.frameScale * HI, anchorPad: Q.loft.anchorPad * HI, frameCache: 4 }), bodies: Q.bodies, poses, clips, assetUrl: (a) => (window.QBART && QBART[a]) || Q.loft.artBase + a + (Q.arthash && Q.arthash[a] ? '?h=' + Q.arthash[a] : '') });
    IDS.forEach((g) => { if (!x.SHOP.some((it) => it[0] === 'gx_qa_' + g)) x.SHOP.push(['gx_qa_' + g, 'a_acc', 'QA ' + g, 0, 1, '', { gar: g }]); });
    const PS = Object.keys(poses); const hs = (Q.creator && Q.creator.hairStyles) || null;
    const hairs = { m: [], f: [] }; try { const H = QBLoft.data.creator; ['m', 'f'].forEach((sx) => { hairs[sx] = (H.hair && H.hair[sx]) || (H.hairStyles && H.hairStyles[sx]) || []; }); } catch (e) {}
    const HAIR = (sx) => { const L = hairs[sx]; return (L && L.length ? L.map((h) => (typeof h === 'string' ? h : h.id)) : ['h1']); };
    const look = (sex, hair, ov) => { S.created = true; S.char = window.__qb.fixChar({ name: 'G', sex }); S.char.rig = Object.assign({}, QBLoft.data.creator.defaults, { body: sex, hairStyle: hair, hairColor: 'brown' }); S.owned = S.owned || {}; Object.values(ov).forEach((id) => { S.owned[id] = true; }); return QBLook.build(Q.creator, window.__qb.lookOf(ov).rig); };
    const grab = (c) => { const cc = document.createElement('canvas'); cc.width = c.width; cc.height = c.height; cc.getContext('2d').drawImage(c, 0, 0); return cc; };
    const res = [], sheets = [];
    for (const g of IDS) for (const sex of ['m', 'f']) { const HL = HAIR(sex); let sheet = null, CW = 0, CH = 0;
      for (const top of OUTFITS) for (let pi = 0; pi < PS.length; pi++) { const ps = PS[pi]; for (let hi = 0; hi < HL.length; hi++) { const hair = HL[hi]; const base = top ? { a_top: top } : {};
          let c0, c1; try { c0 = grab(await rig.render(look(sex, hair, base), ps)); c1 = grab(await rig.render(look(sex, hair, Object.assign({ a_acc: 'gx_qa_' + g }, base)), ps)); } catch (e) { res.push({ g, sex, ps, hair, err: String(e).slice(0, 80) }); continue; }
          const W = c0.width, H = c0.height, d0 = c0.getContext('2d').getImageData(0, 0, W, H).data, d1 = c1.getContext('2d').getImageData(0, 0, W, H).data;
          /* the head box: rows down to where the glasses' own pixels stop, taken as the top 40% of the figure's height */
          let top0 = H; for (let i = 0; i < W * H; i++) if (d0[i * 4 + 3] > 40) { top0 = Math.floor(i / W); break; } let bot0 = 0; for (let i = W * H - 1; i >= 0; i--) if (d0[i * 4 + 3] > 40) { bot0 = Math.floor(i / W); break; }
          const headY = top0 + Math.round((bot0 - top0) * 0.40); let head = 0, away = 0; const mk = new Uint8Array(W * H);
          for (let i = 0; i < W * H; i++) { const j = i * 4, df = Math.abs(d0[j] - d1[j]) + Math.abs(d0[j + 1] - d1[j + 1]) + Math.abs(d0[j + 2] - d1[j + 2]), da = Math.abs(d0[j + 3] - d1[j + 3]); if (df > 24 * 3 || da > 60) { if (Math.floor(i / W) > headY) { away++; mk[i] = 1; } else { head++; mk[i] = 2; } } }
          res.push({ g, sex, ps, hair, top, head, away });
          if (!top || top === OUTFITS[0]) { if (!sheet) { CW = W * 2; CH = H; sheet = document.createElement('canvas'); sheet.width = CW * HL.length; sheet.height = CH * PS.length; const sg = sheet.getContext('2d'); sg.fillStyle = '#8b8fa3'; sg.fillRect(0, 0, sheet.width, sheet.height); }
            const sg = sheet.getContext('2d'); sg.drawImage(c1, hi * CW, pi * CH); const m = document.createElement('canvas'); m.width = W; m.height = H; const mg = m.getContext('2d'); mg.globalAlpha = 0.45; mg.drawImage(c0, 0, 0); mg.globalAlpha = 1; const id = mg.getImageData(0, 0, W, H);
            for (let i = 0; i < W * H; i++) { if (mk[i] === 1) { id.data[i * 4] = 255; id.data[i * 4 + 1] = 0; id.data[i * 4 + 2] = 0; id.data[i * 4 + 3] = 255; } else if (mk[i] === 2) { id.data[i * 4] = 255; id.data[i * 4 + 1] = 220; id.data[i * 4 + 2] = 0; id.data[i * 4 + 3] = 255; } } mg.putImageData(id, 0, 0); sg.drawImage(m, hi * CW + W, pi * CH); } } }
      if (sheet) { const sm = document.createElement('canvas'); const k = Math.min(1, 2400 / sheet.width); sm.width = Math.round(sheet.width * k); sm.height = Math.round(sheet.height * k); sm.getContext('2d').drawImage(sheet, 0, 0, sm.width, sm.height); sheets.push({ name: 'glass_' + g + '_' + sex, u: sm.toDataURL('image/png') }); } }
    return { res, sheets, hairs: { m: HAIR('m'), f: HAIR('f') }, poses: PS }; }, [IDS, OUTFITS]);
  r.sheets.forEach((s) => fs.writeFileSync(OUT + '/' + s.name + '.png', Buffer.from(s.u.split(',')[1], 'base64')));
  console.log('poses ' + r.poses.length + ' (' + r.poses.join(',') + '); hairs m ' + r.hairs.m.join(',') + ' | f ' + r.hairs.f.join(','));
  for (const g of IDS) for (const sex of ['m', 'f']) { const R = r.res.filter((q) => q.g === g && q.sex === sex && !q.err); const worst = R.slice().sort((a, b2) => b2.away - a.away)[0] || {}; const none = R.filter((q) => q.head < 30).map((q) => q.ps + '/' + q.hair);
    console.log(g.padEnd(14) + sex + '  frames ' + R.length + '  away>0 in ' + R.filter((q) => q.away > 0).length + ' (worst ' + (worst.away || 0) + ' at ' + worst.ps + '/' + worst.hair + (worst.top ? '/' + worst.top : '') + ')  head px min ' + Math.min(...R.map((q) => q.head)) + (none.length ? '  NO GLASSES SHOWN in ' + none.length + ': ' + none.slice(0, 8).join(' ') : '')); }
  for (const g of IDS) for (const sex of ['m', 'f']) { const A = {}; r.res.filter((q) => q.g === g && q.sex === sex && q.away > 0).forEach((q) => { A[q.ps] = Math.max(A[q.ps] || 0, q.away); }); console.log('   away by pose ' + g + ' ' + sex + ': ' + Object.entries(A).map(([k, v]) => k + ' ' + v).join(', ')); }
  const errsR = r.res.filter((q) => q.err); if (errsR.length) console.log('render errors ' + errsR.length + ' ' + JSON.stringify(errsR.slice(0, 2)));
  console.log('page errors ' + errs.length + ' ' + JSON.stringify(errs.slice(0, 2))); await b.close(); })();
