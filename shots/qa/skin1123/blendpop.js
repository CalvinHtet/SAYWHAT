// QA: does the coarse/fine mesh switch pop? Blends between poses frame by frame (rig.blend) on his white hoodie, deep skin. For each pair,
// the pixel change from t=0 to t=0.02 (the first step of a blend) is compared with the change for a coarse-to-coarse pair: a mesh switch
// shows as a jump far bigger than the motion. A strip of t = 0, .02, .1, .5, .98, 1 for each pair.
const pw = require('playwright'), fs = require('fs');
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext(); await ctx.route('**/*', (r) => (r.request().url().startsWith(process.env.BASE) ? r.continue() : r.abort())); const p = await ctx.newPage();
  await p.goto(process.env.BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.QBRig && window.QBLook && window.QBDATA, null, { timeout: 120000 }); await p.waitForTimeout(1200);
  const r = await p.evaluate(async (O) => { const Q = window.QBDATA, HI = 4; const { clips, ...poses } = Q.poses;
    const rig = await QBRig.create({ rig: Object.assign({}, Q.rig, { frame: [Q.loft.frame[0] * HI, Q.loft.frame[1] * HI], frameScale: Q.loft.frameScale * HI, anchorPad: Q.loft.anchorPad * HI, frameCache: 0 }), bodies: Q.bodies, poses, clips, assetUrl: (a) => (window.QBART && QBART[a]) || Q.loft.artBase + a + (Q.arthash && Q.arthash[a] ? '?h=' + Q.arthash[a] : '') });
    const L = QBLook.build(Q.creator, Object.assign({}, Q.creator.defaults, { body: 'm', skin: 's5', top: 'hoodie', topColor: 'white', bottom: 'jeans', shoe: 'boots' }));
    const px = (c) => c.getContext('2d').getImageData(0, 0, c.width, c.height).data; const diff = (x, y) => { let n = 0; for (let i = 0; i < x.length; i += 4) if (Math.abs(x[i] - y[i]) + Math.abs(x[i + 1] - y[i + 1]) + Math.abs(x[i + 2] - y[i + 2]) > 60) n++; return n; };
    const ts = [0, .02, .1, .5, .98, 1], cw = 64 * HI, ch = 100 * HI * .62; const cv = document.createElement('canvas'); cv.width = ts.length * cw; cv.height = O.pairs.length * (ch + 16); const g = cv.getContext('2d'); g.fillStyle = '#3a3f52'; g.fillRect(0, 0, cv.width, cv.height); const out = [];
    for (let k = 0; k < O.pairs.length; k++) { const [a, bb] = O.pairs[k]; const frames = []; for (const t of ts) frames.push(await rig.render(L, rig.blend(poses[a], poses[bb], t)));
      const plain = await rig.render(L, a), d0 = diff(px(plain), px(frames[0])), d1 = diff(px(frames[0]), px(frames[1])); frames[0] = plain; out.push([a + '->' + bb, 'coarse ' + !!poses[a].coarse + '/' + !!poses[bb].coarse, 'switch (plain vs t=0, same bones) ' + d0, 'motion t0->.02 ' + d1]);
      frames.forEach((c, i) => { g.drawImage(c, 0, 0, c.width, c.height * .62, i * cw, k * (ch + 16) + 16, cw, ch); g.fillStyle = '#fff'; g.font = '12px sans-serif'; g.fillText(a + '->' + bb + ' t' + ts[i], i * cw + 3, k * (ch + 16) + 12); }); }
    return { out, png: cv.toDataURL('image/png') }; }, { pairs: JSON.parse(process.env.PAIRS) });
  r.out.forEach((x) => console.log(x.join('  '))); fs.writeFileSync(process.env.OUT, Buffer.from(r.png.split(',')[1], 'base64')); await b.close(); })();
