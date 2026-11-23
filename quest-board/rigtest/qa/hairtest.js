// New hairstyles wear-test (QA, Cal 11-23 via ROOMS): each style on its body in every pose (upper body, HI 1.5), and every live Shop hat
// over it, front (idle) and back (rearStand). Look for hair through raised arms, long sides cut or detached, fringe on the eyes, a bald
// band or hair poking through hats.   BASE=<server> OUT=<folder> STYLES=m:h4,m:h5,f:h4 [HATS=0] node hairtest.js
const pw = require('playwright'), fs = require('fs'), path = require('path');
const OUT = process.env.OUT || 'qa-out/hair', STYLES = (process.env.STYLES || 'm:h4').split(',').map((s) => s.split(':')); fs.mkdirSync(OUT, { recursive: true });
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] }); const ctx = await b.newContext({ viewport: { width: 900, height: 700 } });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto(process.env.BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && QBLoft.data && window.QBDATA && window.QBRig && window.QBLook, null, { timeout: 120000 }); await p.waitForTimeout(1500);
  await p.evaluate(async (POPT) => { const Q = window.QBDATA, HI = POPT.hi || 1.5; const { clips, ...poses } = Q.poses; window.__H = { poses: POPT.poses ? POPT.poses.filter((q) => poses[q]) : Object.keys(poses) };
    window.__H.rig = await QBRig.create({ rig: Object.assign({}, Q.rig, { frame: [Q.loft.frame[0] * HI, Q.loft.frame[1] * HI], frameScale: Q.loft.frameScale * HI, anchorPad: Q.loft.anchorPad * HI, frameCache: 2 }), bodies: Q.bodies, poses, clips,
      assetUrl: (a) => (window.QBART && QBART[a]) || Q.loft.artBase + a + (Q.arthash && Q.arthash[a] ? '?h=' + Q.arthash[a] : '') }); window.__H.HI = HI; }, { hi: +process.env.HI || 0, poses: process.env.POSES ? process.env.POSES.split(',') : null });
  for (const [bd, hs] of STYLES) {
    // poses
    const png = await p.evaluate(async ([bd, hs]) => { const Q = window.QBDATA, H = window.__H, x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: bd }); S.char.rig = Object.assign({}, QBLoft.data.creator.defaults, { body: bd, hairStyle: hs, hairColor: 'brown' }); S.owned = {};
      const L = QBLook.build(Q.creator, Object.assign({}, QBLoft.data.creator.defaults, { body: bd, hairStyle: hs, hairColor: 'brown' })); const P = H.poses, per = 14, cw = 64 * H.HI, ch = 100 * H.HI * 0.62;
      const cv = document.createElement('canvas'); cv.width = per * cw; cv.height = Math.ceil(P.length / per) * (ch + 14); const g = cv.getContext('2d'); g.fillStyle = '#8b8fa3'; g.fillRect(0, 0, cv.width, cv.height);
      for (let i = 0; i < P.length; i++) { const c = await H.rig.render(L, P[i]); const X = (i % per) * cw, Y = Math.floor(i / per) * (ch + 14); g.drawImage(c, 0, 0, c.width, c.height * 0.62, X, Y + 14, cw, ch); g.fillStyle = '#fff'; g.font = '10px sans-serif'; g.fillText(P[i], X + 2, Y + 11); }
      return cv.toDataURL('image/png'); }, [bd, hs]);
    fs.writeFileSync(path.join(OUT, `poses_${bd}_${hs}.png`), Buffer.from(png.split(',')[1], 'base64'));
    if (process.env.HATS === '0') continue;
    // hats
    const r = await p.evaluate(async ([bd, hs]) => { const Q = window.QBDATA, H = window.__H, x = window.__qb.x(), S = x.S, I = QBLoft.data.items; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: bd }); S.char.rig = Object.assign({}, QBLoft.data.creator.defaults, { body: bd, hairStyle: hs, hairColor: 'brown' });
      const hats = x.SHOP.filter((it) => it[1] === 'a_hat' && !(it[6] && (it[6].cut || it[6].gone))).filter((it) => { const g = I[(it[6] || {}).gar] || {}; return !((bd === 'f' && (g.maleOnly || (it[6] || {}).mo)) || (bd === 'm' && (g.femaleOnly || (it[6] || {}).fo))); });
      const cols = 8, cw = 64 * H.HI * 2, ch = 56 * H.HI, cv = document.createElement('canvas'); cv.width = cols * cw; cv.height = Math.ceil(hats.length / cols) * (ch + 14); const g = cv.getContext('2d'); g.fillStyle = '#8b8fa3'; g.fillRect(0, 0, cv.width, cv.height); let worn = 0;
      for (let i = 0; i < hats.length; i++) { S.owned = {}; S.owned[hats[i][0]] = true; const lk = window.__qb.lookOf({ a_hat: hats[i][0] }).rig; if (lk.equipped && lk.equipped.hat) worn++; const L = QBLook.build(Q.creator, lk);
        const X = (i % cols) * cw, Y = Math.floor(i / cols) * (ch + 14); for (const [j, ps] of [[0, 'idle'], [1, 'rearStand']]) { const c = await H.rig.render(L, ps); g.drawImage(c, 0, 0, c.width, c.height * 0.56, X + j * cw / 2, Y + 14, cw / 2, ch); }
        g.fillStyle = '#fff'; g.font = '10px sans-serif'; g.fillText(hats[i][0].replace(/^gx_/, ''), X + 2, Y + 11); }
      return { n: hats.length, worn, png: cv.toDataURL('image/png') }; }, [bd, hs]);
    fs.writeFileSync(path.join(OUT, `hats_${bd}_${hs}.png`), Buffer.from(r.png.split(',')[1], 'base64')); console.log(bd, hs, 'hats', r.n, 'worn', r.worn);
  }
  console.log('page errors', errs.length, JSON.stringify(errs.slice(0, 2))); await b.close(); })();
