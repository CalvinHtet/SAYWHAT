// QA: the stretch pose's yawn face (poses.json stretch swaps face -> faceYawn; ROOMS's m/f_faceyawn_front). Draws, per body and per
// creator hairstyle, the bare figure in idle and in every pose that swaps to faceYawn, at HI 3, cropped to the head, on one sheet per
// body: the eye checks the face sits where the closed face did (no shift, no seam) and that hair and the face line up.
//   BASE=<server> OUT=<dir> node rigtest/qa/yawnface.js
const pw = require('playwright'), fs = require('fs');
const BASE = process.env.BASE || 'http://127.0.0.1:8819', OUT = process.env.OUT || 'qa-out/yawn'; fs.mkdirSync(OUT, { recursive: true });
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] }); const p = await (await b.newContext({ viewport: { width: 1200, height: 900 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
  await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.QBLoft && window.QBDATA && window.QBRig && window.QBLook, null, { timeout: 120000 }); await p.waitForTimeout(1500);
  const r = await p.evaluate(async () => { const Q = window.QBDATA, x = window.__qb.x(), S = x.S; const { clips, ...poses } = Q.poses; const HI = 3;
    const yawn = Object.keys(poses).filter((k) => poses[k] && poses[k].swap && /yawn/i.test(String(poses[k].swap.face || '')));
    const rig = await QBRig.create({ rig: Object.assign({}, Q.rig, { frame: [Q.loft.frame[0] * HI, Q.loft.frame[1] * HI], frameScale: Q.loft.frameScale * HI, anchorPad: Q.loft.anchorPad * HI, frameCache: 4 }), bodies: Q.bodies, poses, clips, assetUrl: (a) => (window.QBART && QBART[a]) || Q.loft.artBase + a + (Q.arthash && Q.arthash[a] ? '?h=' + Q.arthash[a] : '') });
    const out = { yawn, sheets: {} }; const fw = Q.loft.frame[0] * HI, fh = Q.loft.frame[1] * HI, ch = Math.round(fh * 0.55);
    for (const sex of ['m', 'f']) { const hs = QBLoft.data.creator.hairStyles[sex].map((h) => h.id); const cols = ['idle'].concat(yawn); const cv = document.createElement('canvas'); cv.width = fw * cols.length; cv.height = (ch + 20) * hs.length; const g = cv.getContext('2d'); g.fillStyle = '#8b8fa3'; g.fillRect(0, 0, cv.width, cv.height); g.font = 'bold 16px sans-serif';
      for (let hi = 0; hi < hs.length; hi++) { S.created = true; S.char = window.__qb.fixChar({ name: 'Yawn', sex }); S.char.rig = Object.assign({}, QBLoft.data.creator.defaults, { body: sex, hairStyle: hs[hi], hairColor: 'brown' }); const L = window.__qb.lookOf({}).rig;
        for (let ci = 0; ci < cols.length; ci++) { const c = await rig.render(QBLook.build(Q.creator, L), cols[ci]); g.drawImage(c, 0, 0, fw, ch, ci * fw, hi * (ch + 20) + 20, fw, ch); g.fillStyle = '#000'; g.fillText(hs[hi] + ' ' + cols[ci], ci * fw + 4, hi * (ch + 20) + 16); } }
      out.sheets[sex] = cv.toDataURL('image/png'); }
    return out; });
  for (const [k, u] of Object.entries(r.sheets)) fs.writeFileSync(`${OUT}/yawn_${k}.png`, Buffer.from(u.split(',')[1], 'base64'));
  console.log('poses that swap to the yawn face: ' + r.yawn.join(', ') + '; page errors ' + errs.length); await b.close(); })();
