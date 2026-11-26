const pw = require('playwright'), fs = require('fs');
const OUT = process.env.OUT;
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] });
  const p = await (await b.newContext({ viewport: { width: 1400, height: 1000 } })).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
  await p.goto('http://127.0.0.1:8767/dist/index.html'); await p.waitForFunction(() => window.__qb && window.QBLoft && QBLoft.data && window.QBDATA && window.QBRig && window.QBLook, null, { timeout: 120000 }); await p.waitForTimeout(1500);
  const res = await p.evaluate(async () => { const Q = window.QBDATA, S = window.__qb.x().S; const { clips, ...poses } = Q.poses; const HI = 2;
    const R = await QBRig.create({ rig: Object.assign({}, Q.rig, { frame: [Q.loft.frame[0] * HI, Q.loft.frame[1] * HI], frameScale: Q.loft.frameScale * HI, anchorPad: Q.loft.anchorPad * HI, frameCache: 4 }), bodies: Q.bodies, poses, clips, assetUrl: (a) => (window.QBART && QBART[a]) || Q.loft.artBase + a });
    const hairs = QBLoft.data.creator.hairStyles; const out = {};
    for (const sex of ['m', 'f']) { const HS = hairs[sex].map((h) => h.id); const fw = Q.loft.frame[0] * HI, fh = Q.loft.frame[1] * HI, cw = 260, ch = 230;
      // rows 0-3: scar s1..s4 x tattoo t1..t6 on the first hairstyle; then one row per hairstyle, tattoo t1..t6 with scar s(1+col%4)
      const rows = 4 + HS.length;
      const cv = document.createElement('canvas'); cv.width = cw * 6; cv.height = ch * rows; const g = cv.getContext('2d'); g.fillStyle = '#8b8fa3'; g.fillRect(0, 0, cv.width, cv.height);
      for (let r = 0; r < rows; r++) for (let ti = 0; ti < 6; ti++) {
        const hair = r < 4 ? HS[0] : HS[r - 4], scar = r < 4 ? 's' + (r + 1) : 's' + (1 + (ti % 4));
        S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex }); S.char.rig = Object.assign({}, QBLoft.data.creator.defaults, { body: sex, hairStyle: hair, hairColor: 'brown' });
        const L = JSON.parse(JSON.stringify(window.__qb.lookOf({}).rig)); L.markS = scar; L.markT = 't' + (ti + 1);
        const c = await R.render(QBLook.build(Q.creator, L), 'idle');
        g.drawImage(c, fw * 0.28, fh * 0.08, fw * 0.44, fh * 0.39, ti * cw, r * ch, cw, ch);
      }
      out[sex] = cv.toDataURL('image/png'); }
    return out; });
  for (const [k, u] of Object.entries(res)) fs.writeFileSync(`${OUT}/scarhair_${k}.png`, Buffer.from(u.split(',')[1], 'base64'));
  console.log('errors', errs.length, errs.slice(0,2)); await b.close(); })();
