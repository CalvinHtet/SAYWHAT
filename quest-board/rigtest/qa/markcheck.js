// ROOMS 2026-11-24: face tattoos and scars (LEAD's markT/markS layer, 70f91a89) drawn by the game's own rig. Per mark and body,
// three sheets of head crops: every hairstyle x poses (idle, laugh, sleep, stretch, sit, wave: does the mark ride the head and
// sit under every fringe), every glasses and mask item (worn over it), and every skin tone. Marks not in the build yet can be
// injected from a folder (MARKDIR: <b>_mark_<id>_front.webp files) through QBART.
//   BASE=<server> OUT=<folder> MARKS=t1,s1 [MARKDIR=<folder>] [APPFIX=<app.js>] node rigtest/qa/markcheck.js
const pw = require('playwright'), fs = require('fs'), path = require('path');
const OUT = process.env.OUT || 'qa-out/marks', MARKS = (process.env.MARKS || 't1').split(','), DIR = process.env.MARKDIR;
const POSES = ['idle', 'laugh1', 'sleep', 'stretch', 'sitFront', 'wave1'];
(async () => { fs.mkdirSync(OUT, { recursive: true });
  const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] });
  const p = await (await b.newContext({ viewport: { width: 1200, height: 900 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  if (process.env.APPFIX) await p.route(/\/dist\/app\.js/, (r) => r.fulfill({ path: process.env.APPFIX, contentType: 'application/javascript' }));
  await p.goto(process.env.BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && QBLoft.data && window.QBDATA && window.QBRig && window.QBLook, null, { timeout: 120000 }); await p.waitForTimeout(1500);
  const inject = {}; if (DIR) for (const f of fs.readdirSync(DIR)) if (/_mark_.*\.webp$/.test(f)) inject[f] = 'data:image/webp;base64,' + fs.readFileSync(path.join(DIR, f)).toString('base64');
  await p.evaluate((inj) => { window.QBART = window.QBART || {}; Object.assign(window.QBART, inj); }, inject);
  for (const mark of MARKS) for (const sex of ['m', 'f']) {
    const res = await p.evaluate(async ([mark, sex, POSES]) => { const Q = window.QBDATA, x = window.__qb.x(), S = x.S, I = QBLoft.data.items; const { clips, ...poses } = Q.poses;
      const HI = 3, rig = await QBRig.create({ rig: Object.assign({}, Q.rig, { frame: [Q.loft.frame[0] * HI, Q.loft.frame[1] * HI], frameScale: Q.loft.frameScale * HI, anchorPad: Q.loft.anchorPad * HI, frameCache: 4 }), bodies: Q.bodies, poses, clips,
        assetUrl: (a) => (window.QBART && QBART[a]) || Q.loft.artBase + a + (Q.arthash && Q.arthash[a] ? '?h=' + Q.arthash[a] : '') });
      const slot = /^t/.test(mark) ? 'markT' : 'markS';
      const look = (ov, extra) => { S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex }); S.char.rig = Object.assign({}, QBLoft.data.creator.defaults, { body: sex, hairStyle: 'h1', hairColor: 'black' }, extra || {}); S.owned = S.owned || {};
        Object.values(ov || {}).forEach((id) => { S.owned[id] = true; }); const L = window.__qb.lookOf(ov || {}).rig; L[slot] = mark; return L; };
      const cw = 170, ch = 170, lab = 16; const sheets = [];
      const sheet = (cols, rows) => { const cv = document.createElement('canvas'); cv.width = cols * cw; cv.height = rows * (ch + lab); const g = cv.getContext('2d'); g.fillStyle = '#8b8fa3'; g.fillRect(0, 0, cv.width, cv.height); g.font = 'bold 11px sans-serif'; return [cv, g]; };
      const draw = async (g, L, pose, X, Y, label) => { const c = await rig.render(QBLook.build(Q.creator, L), pose); const cc = document.createElement('canvas'); cc.width = c.width; cc.height = c.height; cc.getContext('2d').drawImage(c, 0, 0);
        const d = cc.getContext('2d').getImageData(0, 0, c.width, c.height).data; let t = c.height, l = c.width, r = 0; for (let yy = 0; yy < c.height; yy++) for (let xx = 0; xx < c.width; xx += 2) if (d[(yy * c.width + xx) * 4 + 3] > 30) { if (yy < t) t = yy; if (xx < l) l = xx; if (xx > r) r = xx; }
        /* the head: the top of the drawing down by about the head's height; sleep lies down, so show it whole */
        const lying = /sleep/.test(pose); let hs, sx, sy;
        if (lying) { hs = Math.max(r - l, 10); sx = l; sy = t - 10; }
        else { hs = c.height * 0.36; let sum = 0, n = 0; for (let yy = t; yy < t + hs * 0.6; yy++) for (let xx = 0; xx < c.width; xx += 2) if (d[(yy * c.width + xx) * 4 + 3] > 30) { sum += xx; n++; } sx = (n ? sum / n : c.width / 2) - hs / 2; sy = t - hs * 0.04; }
        g.drawImage(cc, sx, sy, hs, hs, X, Y + lab, cw, ch); g.fillStyle = '#fff'; g.fillText(label.slice(0, 22), X + 3, Y + 12); };
      // 1. hairstyles x poses
      const hairs = (QBLoft.data.creator.hairStyles[sex] || []).map((h) => h.id || h);
      let [cv, g] = sheet(POSES.length, hairs.length);
      for (let r = 0; r < hairs.length; r++) for (let k = 0; k < POSES.length; k++) await draw(g, look({}, { hairStyle: hairs[r] }), POSES[k], k * cw, r * (ch + lab), hairs[r] + ' ' + POSES[k]);
      sheets.push(['hair', cv.toDataURL('image/png')]);
      // 2. glasses and masks
      const items = x.SHOP.filter((it) => it[6] && it[6].gar && I[it[6].gar] && /glasses|mask/.test(I[it[6].gar].slot) && !(it[6].cut || it[6].gone)
        && !(sex === 'm' && (it[6].fo || I[it[6].gar].femaleOnly)) && !(sex === 'f' && (it[6].mo || I[it[6].gar].maleOnly)));
      const per = 8; [cv, g] = sheet(per, Math.ceil((items.length + 1) / per));
      await draw(g, look({}), 'idle', 0, 0, 'none');
      for (let k = 0; k < items.length; k++) { const it = items[k], ov = {}; ov[it[1]] = it[0]; const n = k + 1; await draw(g, look(ov), 'idle', (n % per) * cw, Math.floor(n / per) * (ch + lab), it[2]); }
      sheets.push(['face', cv.toDataURL('image/png')]);
      // 3. skin tones
      const skins = QBLoft.data.creator.skin.map((s) => s.id); [cv, g] = sheet(skins.length, 1);
      for (let k = 0; k < skins.length; k++) await draw(g, look({}, { skin: skins[k] }), 'idle', k * cw, 0, skins[k]);
      sheets.push(['skin', cv.toDataURL('image/png')]);
      return { sheets, hairs: hairs.length, items: items.length };
    }, [mark, sex, POSES]);
    for (const [k, d] of res.sheets) fs.writeFileSync(path.join(OUT, `mark_${mark}_${sex}_${k}.png`), Buffer.from(d.split(',')[1], 'base64'));
    console.log(mark, sex, 'hairstyles', res.hairs, 'glasses/masks', res.items);
  }
  console.log('page errors', errs.length, errs.slice(0, 3)); await b.close();
})();
