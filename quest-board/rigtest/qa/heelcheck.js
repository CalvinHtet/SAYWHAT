// Tiptoe heels (ROOMS 7f30c13/1d16b66, LEAD b3dba9d; Cal 11-18: "a tippy toe stance"), QA's checks on top of LEAD's heels.js, all poses:
//  1. which base the rig picks (QBLook.build's body layer) for: the stilettos; the stilettos + a bare top; a flat shoe; a flat shoe + a
//     bare top; and the male body with the stilettos' row ignored (they are women-only);
//  2. floor contact in every pose: the lowest drawn pixel with the stilettos against the same look with flat Patent Stilettos;
//  3. a sheet for the eye: the stilettos under long and wide hems (flares, vinyl trousers, a long skirt) and with a bare top, in 7 poses.
//   BASE=<server> OUT=<folder> [SHOE=gx_gd_mule] [NEWROWS=<rows.json>] node rigtest/qa/heelcheck.js
const pw = require('playwright'), fs = require('fs');
(async () => { const OUT = process.env.OUT || 'qa-out/heel'; fs.mkdirSync(OUT, { recursive: true });
  const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] });
  const p = await (await b.newContext({ viewport: { width: 1200, height: 900 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto(process.env.BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && window.QBDATA && window.QBRig && window.QBLook, null, { timeout: 120000 }); await p.waitForTimeout(1500);
  if (process.env.NEWROWS) { const NEW = JSON.parse(fs.readFileSync(process.env.NEWROWS, 'utf8')); await p.evaluate((NEW) => { const x = window.__qb.x(); NEW.forEach((r) => { if (!x.SHOP.find((q) => q[0] === r[0])) x.SHOP.push(r); }); }, NEW); }
  const r = await p.evaluate(async (SH) => { const Q = window.QBDATA, x = window.__qb.x(), S = x.S, HI = 1.6; const { clips, ...poses } = Q.poses, names = Object.keys(poses);
    const rig = await QBRig.create({ rig: Object.assign({}, Q.rig, { frame: [Q.loft.frame[0] * HI, Q.loft.frame[1] * HI], frameScale: Q.loft.frameScale * HI, anchorPad: Q.loft.anchorPad * HI, frameCache: 4 }), bodies: Q.bodies, poses, clips,
      assetUrl: (a) => (window.QBART && QBART[a]) || Q.loft.artBase + a + (Q.arthash && Q.arthash[a] ? '?h=' + Q.arthash[a] : '') });
    const setBody = (sex) => { S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex }); S.char.rig = Object.assign({}, QBLoft.data.creator.defaults, { body: sex, hairStyle: 'h2', hairColor: 'brown' }); S.owned = {}; Object.keys(x.SHOP.reduce((o, it) => (o[it[0]] = 1, o), {})).forEach((id) => { S.owned[id] = true; }); };
    const look = (ov) => window.__qb.lookOf(ov).rig;
    const bodyArt = (L) => { const B = QBLook.build(Q.creator, L); return JSON.stringify(B.layers && B.layers.body).match(/[mf]_base[a-z_]*?(?=_(front|back|yawn))/g) || ['?']; };
    setBody('f'); const pick = {
      'stilettos': bodyArt(look({ a_shoes: SH }))[0], 'stilettos + bralette': bodyArt(look({ a_shoes: SH, a_top: 'gx_v_bralette' }))[0],
      'flat Patent Stilettos': bodyArt(look({ a_shoes: 'gx_v_stiletto' }))[0], 'flat + bralette': bodyArt(look({ a_shoes: 'gx_v_stiletto', a_top: 'gx_v_bralette' }))[0], 'sneakers (default)': bodyArt(look({}))[0] };
    setBody('m'); pick['him, stilettos asked'] = bodyArt(look({ a_shoes: SH }))[0]; setBody('f');
    const low = (c) => { const g = c.getContext('2d'), d = g.getImageData(0, 0, c.width, c.height).data; for (let y = c.height - 1; y >= 0; y--) for (let xx = 0; xx < c.width; xx++) if (d[(y * c.width + xx) * 4 + 3] > 40) return y; return -1; };
    const cp = (c) => { const cc = document.createElement('canvas'); cc.width = c.width; cc.height = c.height; cc.getContext('2d').drawImage(c, 0, 0); return cc; };
    const floor = []; const Lh = look({ a_shoes: SH }), Lf = look({ a_shoes: 'gx_v_stiletto' });
    for (const ps of names) { const a = low(cp(await rig.render(QBLook.build(Q.creator, Lh), ps))), f0 = low(cp(await rig.render(QBLook.build(Q.creator, Lf), ps))); floor.push([ps, a, f0, a - f0]); }
    const combos = [['flares', { a_shoes: SH, a_pants: 'gx_v_flare' }], ['vinyl', { a_shoes: SH, a_pants: 'gx_v_vinyl' }], ['long skirt (h_pleat)', { a_shoes: SH, a_pants: 'gx_h_pleat' }], ['mini + bralette', { a_shoes: SH, a_pants: 'gx_v_mini', a_top: 'gx_v_bralette' }], ['flat stilettos (ref)', { a_shoes: 'gx_v_stiletto', a_pants: 'gx_v_mini' }]]; if (x.SHOP.find((q) => q[0] === 'gx_gd_skirt')) combos.splice(4, 0, ['GILDED midi + bustier', { a_shoes: SH, a_pants: 'gx_gd_skirt', a_top: 'gx_gd_bustier' }]);
    const P = ['idle', 'walk2', 'stretchUp', 'rearStand', 'sitFront', 'sleep', 'dance1'], cw = Math.round(64 * HI), ch = Math.round(100 * HI), left = 150;
    const cv = document.createElement('canvas'); cv.width = left + P.length * cw; cv.height = 20 + combos.length * ch; const g = cv.getContext('2d'); g.fillStyle = '#8b8fa3'; g.fillRect(0, 0, cv.width, cv.height); g.fillStyle = '#fff'; g.font = 'bold 11px sans-serif'; P.forEach((ps, i) => g.fillText(ps, left + i * cw + 2, 14));
    for (let w = 0; w < combos.length; w++) { const L = look(combos[w][1]); g.fillStyle = '#fff'; g.fillText(combos[w][0], 4, 20 + w * ch + 40); for (let i = 0; i < P.length; i++) g.drawImage(await rig.render(QBLook.build(Q.creator, L), P[i]), left + i * cw, 20 + w * ch, cw, ch); }
    return { pick, floor, png: cv.toDataURL('image/png') }; }, process.env.SHOE || 'gx_v_sandal');
  fs.writeFileSync(OUT + '/heel_hems.png', Buffer.from(r.png.split(',')[1], 'base64'));
  console.log('base picked:', JSON.stringify(r.pick));
  const off = r.floor.filter((q) => Math.abs(q[3]) > 4);
  console.log(`floor contact, lowest px stilettos vs flat stilettos, all ${r.floor.length} poses: max diff ${Math.max(...r.floor.map((q) => Math.abs(q[3])))} px; over 4 px: ${JSON.stringify(off)}`);
  console.log('page errors', errs.length, JSON.stringify(errs.slice(0, 2))); await b.close(); })();
