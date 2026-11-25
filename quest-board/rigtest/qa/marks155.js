// QA, ROOMS's face marks a41a1149 (t1-t6, s1-s4 on LEAD's markT/markS layer), drawn by the game's own rig at 3x, head crops at 300 px:
// per mark, both bodies on the lightest (s1) and darkest (s5) skin, standing (idle) and in the yawn (the stretch pose, a painted face).
// One sheet per body: rows = marks, columns = s1 idle, s5 idle, s1 yawn, s5 yawn. A first column without a mark for comparison.
//   BASE=<plain build> OUT=<dir> node marks155.js
const pw = require('playwright');
const BASE = process.env.BASE, OUT = process.env.OUT || '.';
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await (await b.newContext({ viewport: { width: 1200, height: 900 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
  await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.QBLoft && window.QBRig && window.QBLook && window.QBDATA, null, { timeout: 120000 }); await p.waitForTimeout(1500);
  for (const sex of ['m', 'f']) {
    const url = await p.evaluate(async (sex) => { const Q = window.QBDATA; const { clips, ...poses } = Q.poses; const HI = 3;
      const rig = await QBRig.create({ rig: Object.assign({}, Q.rig, { frame: [Q.loft.frame[0] * HI, Q.loft.frame[1] * HI], frameScale: Q.loft.frameScale * HI, anchorPad: Q.loft.anchorPad * HI, frameCache: 4 }), bodies: Q.bodies, poses, clips,
        assetUrl: (a) => (window.QBART && QBART[a]) || Q.loft.artBase + a + (Q.arthash && Q.arthash[a] ? '?h=' + Q.arthash[a] : '') });
      const marks = ['', 't1', 't2', 't3', 't4', 't5', 't6', 's1', 's2', 's3', 's4'], cols = [['s1', 'idle'], ['s5', 'idle'], ['s1', 'stretch'], ['s5', 'stretch']], cw = 300;
      const cv = document.createElement('canvas'); cv.width = cols.length * cw + 40; cv.height = marks.length * cw; const g = cv.getContext('2d'); g.fillStyle = '#8b8fa3'; g.fillRect(0, 0, cv.width, cv.height); g.font = 'bold 18px sans-serif';
      for (let i = 0; i < marks.length; i++) { g.fillStyle = '#000'; g.fillText(marks[i] || '-', 4, i * cw + 24);
        for (let j = 0; j < cols.length; j++) { const [skin, pose] = cols[j]; const L = Object.assign({}, Q.creator.defaults, { body: sex, skin, hairStyle: sex === 'm' ? 'h4' : 'h1', hairColor: 'black' }); if (marks[i]) L[/^t/.test(marks[i]) ? 'markT' : 'markS'] = marks[i];
          const c = await rig.render(QBLook.build(Q.creator, L), poses[pose]); const cc = document.createElement('canvas'); cc.width = c.width; cc.height = c.height; const x = cc.getContext('2d'); x.drawImage(c, 0, 0); const d = x.getImageData(0, 0, c.width, c.height).data;
          let t = c.height; for (let yy = 0; yy < c.height && t === c.height; yy++) for (let xx = 0; xx < c.width; xx += 2) if (d[(yy * c.width + xx) * 4 + 3] > 30) { t = yy; break; }
          const hs = c.height * 0.34; let sum = 0, n = 0; for (let yy = t; yy < t + hs * 0.6; yy++) for (let xx = 0; xx < c.width; xx += 2) if (d[(yy * c.width + xx) * 4 + 3] > 30) { sum += xx; n++; } const sx = (n ? sum / n : c.width / 2) - hs / 2;
          g.drawImage(cc, sx, t - 6, hs, hs, 40 + j * cw, i * cw, cw - 4, cw - 4); } }
      return cv.toDataURL('image/png'); }, sex);
    require('fs').writeFileSync(OUT + '/marks155_' + sex + '.png', Buffer.from(url.split(',')[1], 'base64')); }
  console.log('page errors ' + errs.length + ' ' + JSON.stringify(errs.slice(0, 3))); await b.close(); })();
