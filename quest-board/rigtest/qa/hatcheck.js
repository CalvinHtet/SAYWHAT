// One hat over every hairstyle (QA, for noClip headbands like the horns 141ff29 and GILDED's leaf crown): both bodies x h1, h2, h3,
// in the poses where a hat meets the hair (idle, walk2, rearStand, sitBack, sleep, stretch, dance1), drawn by the game's rig at HI.
// Look for a bald band (the hat's clip cutting the hair), hair over the band where it should sit on top, or a hat floating.
//   BASE=<server> OUT=<folder> HAT=gx_gd_wreath [NEWROWS=<rows.json>] [HI=2] node rigtest/qa/hatcheck.js
const pw = require('playwright'), fs = require('fs');
const HAT = process.env.HAT, HI = +process.env.HI || 2, OUT = process.env.OUT || 'qa-out/hat';
(async () => { fs.mkdirSync(OUT, { recursive: true });
  const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] });
  const p = await (await b.newContext({ viewport: { width: 1200, height: 900 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto(process.env.BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && QBLoft.data && window.QBDATA && window.QBRig && window.QBLook, null, { timeout: 120000 }); await p.waitForTimeout(1500);
  if (process.env.NEWROWS) { const NEW = JSON.parse(fs.readFileSync(process.env.NEWROWS, 'utf8')); await p.evaluate((NEW) => { const x = window.__qb.x(); NEW.forEach((r) => { if (!x.SHOP.find((q) => q[0] === r[0])) x.SHOP.push(r); }); }, NEW); }
  const r = await p.evaluate(async ([HAT, HI]) => { const Q = window.QBDATA, x = window.__qb.x(), S = x.S; const { clips, ...poses } = Q.poses;
    const rig = await QBRig.create({ rig: Object.assign({}, Q.rig, { frame: [Q.loft.frame[0] * HI, Q.loft.frame[1] * HI], frameScale: Q.loft.frameScale * HI, anchorPad: Q.loft.anchorPad * HI, frameCache: 4 }), bodies: Q.bodies, poses, clips,
      assetUrl: (a) => (window.QBART && QBART[a]) || Q.loft.artBase + a + (Q.arthash && Q.arthash[a] ? '?h=' + Q.arthash[a] : '') });
    const P = ['idle', 'walk2', 'rearStand', 'sitBack', 'sleep', 'stretch', 'dance1'].filter((q) => poses[q]), cw = Math.round(64 * HI), ch = Math.round(56 * HI), left = 90;
    const rowsDef = []; ['m', 'f'].forEach((sex) => ['h1', 'h2', 'h3'].forEach((h) => { rowsDef.push([sex, h, false]); rowsDef.push([sex, h, true]); }));
    const cv = document.createElement('canvas'); cv.width = left + P.length * cw; cv.height = 20 + rowsDef.length * ch; const g = cv.getContext('2d'); g.fillStyle = '#8b8fa3'; g.fillRect(0, 0, cv.width, cv.height);
    g.fillStyle = '#fff'; g.font = 'bold 11px sans-serif'; P.forEach((ps, i) => g.fillText(ps, left + i * cw + 2, 14)); let worn = 0;
    for (let k = 0; k < rowsDef.length; k++) { const [sex, h, on] = rowsDef[k]; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex }); S.char.rig = Object.assign({}, QBLoft.data.creator.defaults, { body: sex, hairStyle: h, hairColor: 'brown' }); S.owned = {}; S.owned[HAT] = true;
      const L = window.__qb.lookOf(on ? { a_hat: HAT } : {}).rig; if (on && L.equipped && L.equipped.hat && L.equipped.hat.art === HAT.replace(/^gx_/, '')) worn++;
      g.fillStyle = '#fff'; g.fillText(sex + ' ' + h + (on ? ' hat' : ' bare'), 4, 20 + k * ch + ch / 2);
      for (let i = 0; i < P.length; i++) { const c = await rig.render(QBLook.build(Q.creator, L), P[i]); g.drawImage(c, 0, 0, c.width, c.height * 0.56, left + i * cw, 20 + k * ch, cw, ch); } }
    return { worn, png: cv.toDataURL('image/png') }; }, [HAT, HI]);
  fs.writeFileSync(`${OUT}/hat_${HAT.replace(/^gx_/, '')}.png`, Buffer.from(r.png.split(',')[1], 'base64'));
  console.log(HAT, 'worn in', r.worn, 'of 6 hat rows; page errors', errs.length, JSON.stringify(errs.slice(0, 2))); await b.close(); })();
