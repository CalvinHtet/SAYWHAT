// QA, ROOMS's Smoke Bomb fixes (06252108 hoodcap emblem + gd_frock arms-up yawn layer, 45a5f4a7 smk_tails clipTop 0.3 and hip cut,
// 19374b1b smk_bomber arms-up yawn layers + new smk_platehood; ad8e4760 smk_visorbeanie, smk_ventmask, smk_scoutlens). Four of them have no Shop row yet, so each is equipped on the rig straight
// from items.json (its slot). Per body, a row per piece (hats with a short and a long hairstyle), a column per pose: idle, the walks and
// back walks, the yawns (stretch, stretchUp), cheers, dances, wave, laugh, think, the side turns, rearStand, sleepHead. Full figure.
//   BASE=<server of quest-board/> OUT=<dir> [HI=1.5] NODE_PATH=<playwright> node rigtest/qa/smk188qa.js
const pw = require('playwright'), fs = require('fs');
const BASE = process.env.BASE || 'http://127.0.0.1:8819', OUT = process.env.OUT || '.', HI = +process.env.HI || 1.5;
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] });
  const p = await (await b.newContext({ viewport: { width: 1400, height: 1000 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
  await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.QBLoft && window.QBDATA && window.QBRig && window.QBLook, null, { timeout: 120000 }); await p.waitForTimeout(1500);
  const r = await p.evaluate(async (HI) => { const Q = window.QBDATA, S = window.__qb.x().S, I = QBLoft.data.items; const { clips, ...poses } = Q.poses;
    const rig = await QBRig.create({ rig: Object.assign({}, Q.rig, { frame: [Q.loft.frame[0] * HI, Q.loft.frame[1] * HI], frameScale: Q.loft.frameScale * HI, anchorPad: Q.loft.anchorPad * HI, frameCache: 4 }), bodies: Q.bodies, poses, clips, assetUrl: (a) => (window.QBART && QBART[a]) || Q.loft.artBase + a + (Q.arthash && Q.arthash[a] ? '?h=' + Q.arthash[a] : '') });
    const want = ['idle', 'walk1', 'walk2', 'walk3', 'backwalk1', 'backwalk2', 'stretch', 'stretchUp', 'cheer1', 'cheer2', 'dance1', 'dance2', 'wave1', 'laugh1', 'thinkA', 'sideL', 'sideR', 'rearStand', 'sleepHead'];
    const PS = want.filter((k) => poses[k]); const probe = JSON.parse(JSON.stringify(window.__qb.lookOf({ a_top: 'gx_gd_frock' }).rig));
    const HAIR = { m: [['short', 'h1'], ['long', 'fr_victor_hair']], f: [['short', 'h2'], ['long', 'h1']] };
    const ROWS = [['smk_hoodcap', 1], ['smk_tails', 1], ['smk_platehood', 1], ['smk_visorbeanie', 1], ['smk_ventmask', 0], ['smk_scoutlens', 0], ['smk_visorbeanie+smk_ventmask', 0], ['smk_visorbeanie+smk_scoutlens', 0], ['smk_bomber', 0], ['gd_frock', 0], ['smk_hoodcap+gd_frock', 0], ['smk_tails+smk_bomber', 0]];
    const fw = Q.loft.frame[0] * HI, fh = Q.loft.frame[1] * HI, K = 0.42, cw = Math.round(fw * K), ch = Math.round(fh * K); const sheets = {}, miss = [];
    for (const sex of ['m', 'f']) { const rows = []; ROWS.forEach(([ids, hats]) => { (hats ? HAIR[sex] : [HAIR[sex][0]]).forEach(([hn, h]) => rows.push({ ids: ids.split('+'), hair: h, lab: ids + ' / ' + hn })); });
      const cv = document.createElement('canvas'); cv.width = 190 + cw * PS.length; cv.height = 18 + (ch + 4) * rows.length; const g = cv.getContext('2d'); g.fillStyle = '#8b8fa3'; g.fillRect(0, 0, cv.width, cv.height); g.font = 'bold 11px sans-serif'; g.fillStyle = '#000'; PS.forEach((ps, i) => g.fillText(ps, 190 + i * cw + 3, 13));
      for (let ri = 0; ri < rows.length; ri++) { const R = rows[ri], Y = 18 + ri * (ch + 4); g.fillStyle = '#000'; g.font = 'bold 12px sans-serif'; g.fillText(R.lab, 4, Y + 16);
        S.created = true; S.char = window.__qb.fixChar({ name: 'Smk', sex }); S.char.rig = Object.assign({}, QBLoft.data.creator.defaults, { body: sex, hairStyle: R.hair, hairColor: 'brown' });
        const L = JSON.parse(JSON.stringify(window.__qb.lookOf({}).rig)); L.equipped = Object.assign({}, L.equipped || {}); R.ids.forEach((id) => { const it = I[id]; if (!it) { miss.push(id); return; } L.equipped[it.slot] = { art: id }; });
        for (let i = 0; i < PS.length; i++) { try { const c = await rig.render(QBLook.build(Q.creator, L), PS[i]); g.drawImage(c, 0, 0, fw, fh, 190 + i * cw, Y, cw, ch); } catch (e) { g.fillStyle = '#c00'; g.fillText('NOT DRAWN', 190 + i * cw + 4, Y + 30); } } }
      sheets[sex] = cv.toDataURL('image/png'); }
    return { sheets, PS, miss: [...new Set(miss)], probe: probe.equipped }; }, HI);
  for (const [k, u] of Object.entries(r.sheets)) fs.writeFileSync(`${OUT}/smk188_${k}.png`, Buffer.from(u.split(',')[1], 'base64'));
  console.log('poses ' + r.PS.join(',') + '; missing items ' + JSON.stringify(r.miss) + '; frock row equips ' + JSON.stringify(r.probe) + '; page errors ' + errs.length + ' ' + JSON.stringify(errs.slice(0, 2))); await b.close(); })();
