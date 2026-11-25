// QA, 4eed92a7: the nine card poses on the plain figure, at the card's own size (HI 3, the frame a 3x phone gets), both bodies, with a
// short and a long hairstyle, and in a full outfit of five pieces: one sheet per body for the eye. The card holds one still of the clip at
// 3x, so rig tears that pass by unseen in the Loft at 1x show here.
//   BASE=<server> OUT=<folder> node rigtest/qa/cardposes162.js
const pw = require('playwright'), fs = require('fs');
const OUT = process.env.OUT || 'qa-out/cardposes'; fs.mkdirSync(OUT, { recursive: true });
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] });
  const p = await (await b.newContext({ viewport: { width: 1200, height: 900 } })).newPage(); await p.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
  await p.goto(process.env.BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.QBLoft && window.QBDATA && window.QBRig && window.QBLook && window.__qbV162, null, { timeout: 120000 }); await p.waitForTimeout(1500);
  const r = await p.evaluate(async () => { const Q = window.QBDATA, x = window.__qb.x(), S = x.S; const { clips, ...poses } = Q.poses; const HI = 3;
    const rig = await QBRig.create({ rig: Object.assign({}, Q.rig, { frame: [Q.loft.frame[0] * HI, Q.loft.frame[1] * HI], frameScale: Q.loft.frameScale * HI, anchorPad: Q.loft.anchorPad * HI, frameCache: 4 }), bodies: Q.bodies, poses, clips,
      assetUrl: (a) => (window.QBART && QBART[a]) || Q.loft.artBase + a + (Q.arthash && Q.arthash[a] ? '?h=' + Q.arthash[a] : '') });
    const PP = window.__qbV162.poses; const out = {};
    const outfit = (sex) => { const pick = (slot, re) => (x.SHOP.find((it) => it[1] === slot && re.test(it[0]) && !(it[6] && (it[6].cut || it[6].gone))) || [])[0]; return sex === 'm' ? { a_top: pick('a_top', /gx_o_flannel/), a_pants: pick('a_pants', /gx_o_cargo|gx_al_cargo/), a_shoes: pick('a_shoes', /gx_h_boots|gx_o_work/), a_hat: pick('a_hat', /gx_o_5panel/), a_acc: pick('a_acc', /gx_o_tags|gx_y_chains/) } : { a_top: pick('a_top', /gx_v_crop|gx_y_moto/), a_pants: pick('a_pants', /gx_y_skirt|gx_v_mini/), a_shoes: pick('a_shoes', /gx_v_boot|gx_y_plat/), a_acc: pick('a_acc', /gx_y_choker|gx_v_choke/) }; };
    for (const sex of ['m', 'f']) { const rowsDef = [['plain short hair', { hairStyle: sex === 'm' ? 'h1' : 'h2' }, null], ['plain long hair', { hairStyle: sex === 'm' ? 'fr_victor_hair' : 'h1' }, null], ['outfit', { hairStyle: sex === 'm' ? 'h1' : 'h1' }, outfit(sex)]];
      const fw = Q.loft.frame[0] * HI, fh = Q.loft.frame[1] * HI, cw = Math.round(fw * 0.5), ch = Math.round(fh * 0.5); const cv = document.createElement('canvas'); cv.width = cw * PP.length; cv.height = (ch + 18) * rowsDef.length; const g = cv.getContext('2d'); g.fillStyle = '#8b8fa3'; g.fillRect(0, 0, cv.width, cv.height); g.font = 'bold 14px sans-serif';
      for (let ri = 0; ri < rowsDef.length; ri++) { const [lab, rigOv, ov] = rowsDef[ri]; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex }); S.char.rig = Object.assign({}, QBLoft.data.creator.defaults, { body: sex, hairColor: 'brown' }, rigOv); S.owned = S.owned || {}; if (ov) Object.values(ov).forEach((id) => { if (id) S.owned[id] = true; });
        const L = window.__qb.lookOf(ov || {}).rig; for (let pi = 0; pi < PP.length; pi++) { const P = PP[pi]; const c = await rig.render(QBLook.build(Q.creator, L), rig.clipPose(P[2], P[3])); g.drawImage(c, pi * cw, ri * (ch + 18) + 18, cw, ch); g.fillStyle = '#000'; g.fillText(P[0] + (pi === 0 ? '  ' + lab : ''), pi * cw + 4, ri * (ch + 18) + 14);
          if (ri === 0) { const big = document.createElement('canvas'); big.width = fw; big.height = fh; big.getContext('2d').drawImage(c, 0, 0); out[sex + '_' + P[0]] = big.toDataURL('image/png'); } } }
      out['sheet_' + sex] = cv.toDataURL('image/png'); }
    return out; });
  for (const [k, u] of Object.entries(r)) fs.writeFileSync(`${OUT}/cp_${k}.png`, Buffer.from(u.split(',')[1], 'base64'));
  console.log('written ' + Object.keys(r).length); await b.close(); })();
