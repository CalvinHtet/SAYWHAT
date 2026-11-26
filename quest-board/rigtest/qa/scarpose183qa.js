// QA, ROOMS 4c4b50f6 (the four scars moved to the other eye, Cal 11-25). What ROOMS's scar_mirror_check.js (idle, every hairstyle)
// leaves out: the scars in the poses that move the face (stretch's yawn face, laugh, dance, think, the side turns), the back view (a
// face mark must not show from behind) and sleepHead, on both bodies, each scar alone and with tattoo t4 (both cheeks). Head crops at 3x.
//   BASE=<server> OUT=<dir> node scarpose183qa.js
const pw = require('playwright'), fs = require('fs');
const BASE = process.env.BASE || 'http://127.0.0.1:8824', OUT = process.env.OUT || '.';
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] });
  const p = await (await b.newContext({ viewport: { width: 1400, height: 1000 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
  await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.QBLoft && window.QBDATA && window.QBRig && window.QBLook, null, { timeout: 120000 }); await p.waitForTimeout(1500);
  const res = await p.evaluate(async () => { const Q = window.QBDATA, S = window.__qb.x().S; const { clips, ...poses } = Q.poses; const HI = 3;
    const R = await QBRig.create({ rig: Object.assign({}, Q.rig, { frame: [Q.loft.frame[0] * HI, Q.loft.frame[1] * HI], frameScale: Q.loft.frameScale * HI, anchorPad: Q.loft.anchorPad * HI, frameCache: 4 }), bodies: Q.bodies, poses, clips, assetUrl: (a) => (window.QBART && QBART[a]) || Q.loft.artBase + a + (Q.arthash && Q.arthash[a] ? '?h=' + Q.arthash[a] : '') });
    const PS = ['idle', 'stretch', 'laugh1', 'dance1', 'thinkA', 'sideL', 'sideR', 'rearStand', 'sleepHead']; const ROWS = [['s1', null], ['s2', null], ['s3', null], ['s4', null], ['s1', 't4'], ['s4', 't4'], [null, null]];
    const out = {}; const fw = Q.loft.frame[0] * HI, fh = Q.loft.frame[1] * HI, cw = Math.round(fw * 0.5), ch = Math.round(fh * 0.42);
    for (const sex of ['m', 'f']) { const cv = document.createElement('canvas'); cv.width = 60 + cw * PS.length; cv.height = 20 + ch * ROWS.length; const g = cv.getContext('2d'); g.fillStyle = '#8b8fa3'; g.fillRect(0, 0, cv.width, cv.height); g.font = 'bold 14px sans-serif'; g.fillStyle = '#000'; PS.forEach((ps, i) => g.fillText(ps, 60 + i * cw + 4, 15));
      for (let ri = 0; ri < ROWS.length; ri++) { g.fillStyle = '#000'; g.fillText((ROWS[ri][0] || '-') + (ROWS[ri][1] ? '+' + ROWS[ri][1] : ''), 4, 20 + ri * ch + 20);
        S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex }); S.char.rig = Object.assign({}, QBLoft.data.creator.defaults, { body: sex, hairStyle: sex === 'm' ? 'h4' : 'h3', hairColor: 'brown' });
        const L = JSON.parse(JSON.stringify(window.__qb.lookOf({}).rig)); L.markS = ROWS[ri][0]; L.markT = ROWS[ri][1];
        for (let pi = 0; pi < PS.length; pi++) { const c = await R.render(QBLook.build(Q.creator, L), PS[pi]); g.drawImage(c, fw * 0.25, fh * 0.04, fw * 0.5, fh * 0.42, 60 + pi * cw, 20 + ri * ch, cw, ch); } }
      out[sex] = cv.toDataURL('image/png'); }
    return out; });
  for (const [k, u] of Object.entries(res)) fs.writeFileSync(`${OUT}/scarpose_${k}.png`, Buffer.from(u.split(',')[1], 'base64'));
  console.log('page errors ' + errs.length + ' ' + JSON.stringify(errs.slice(0, 2))); await b.close(); })();
