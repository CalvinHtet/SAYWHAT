// Bare coverage gate (QA, for ROOMS's bare female base dff4465 and the `bare` tops; Cal 2026-11-18: "i am okay with showing some
// skin as long as it is not nude"). Until LEAD wires the flag, the bare base is swapped in at load (f_base_* -> f_base_bare_*).
// For each bare top, worn with a skirt, in every pose: render on the normal base (A) and on the bare base (B). Pixels where A and B
// differ are exactly where her base shows through the top. The sheet shows B with those pixels tinted red; a red mark over the chest
// on a front-facing pose is a fail. Also logs per pose how many pixels differ in the upper half of the torso band.
// NEWROWS=<rows_draft.json> adds draft Shop rows first (pieces not wired yet); without it an unknown top silently draws the default tee.
//   BASE=<server> OUT=<folder> [TOPS=gx_v_bralette,...] [NEWROWS=...] [HI=2] node rigtest/qa/barecheck.js
const pw = require('playwright'), fs = require('fs');
const TOPS = (process.env.TOPS || 'gx_v_bralette,gx_v_crop,gx_v_corset,gx_v_slip,gx_v_bodysuit').split(','), HI = +process.env.HI || 2, OUT = process.env.OUT || 'qa-out/bare';
(async () => { fs.mkdirSync(OUT, { recursive: true });
  const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] });
  const p = await (await b.newContext({ viewport: { width: 1200, height: 900 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto(process.env.BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && QBLoft.data && window.QBDATA && window.QBRig && window.QBLook, null, { timeout: 120000 }); await p.waitForTimeout(1500);
  if (process.env.NEWROWS) { const NEW = JSON.parse(fs.readFileSync(process.env.NEWROWS, 'utf8')); await p.evaluate((NEW) => { const x = window.__qb.x(); NEW.forEach((r) => { if (!x.SHOP.find((q) => q[0] === r[0])) x.SHOP.push(r); }); }, NEW); }
  const r = await p.evaluate(async ([TOPS, HI]) => { const Q = window.QBDATA, x = window.__qb.x(), S = x.S, I = QBLoft.data.items; const { clips, ...poses } = Q.poses, names = Object.keys(poses);
    const url = (a) => (window.QBART && QBART[a]) || Q.loft.artBase + a + (Q.arthash && Q.arthash[a] ? '?h=' + Q.arthash[a] : '');
    const mk = (bare) => QBRig.create({ rig: Object.assign({}, Q.rig, { frame: [Q.loft.frame[0] * HI, Q.loft.frame[1] * HI], frameScale: Q.loft.frameScale * HI, anchorPad: Q.loft.anchorPad * HI, frameCache: 4 }), bodies: Q.bodies, poses, clips,
      assetUrl: (a) => url(bare && /^f_base_(front|back|yawn)/.test(a) ? a.replace('f_base_', 'f_base_bare_') : a) });
    const rigN = await mk(false), rigB = await mk(true); let swapped = 0; try { const im = new Image(); await new Promise((o) => { im.onload = o; im.onerror = o; im.src = url('f_base_bare_front.webp'); }); swapped = im.naturalWidth; } catch (e) {}
    S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'f' }); S.char.rig = Object.assign({}, QBLoft.data.creator.defaults, { body: 'f', hairStyle: 'h2', hairColor: 'brown' }); S.owned = {};
    const toD = (c) => { const cc = document.createElement('canvas'); cc.width = c.width; cc.height = c.height; const g = cc.getContext('2d'); g.drawImage(c, 0, 0); return { cc, d: g.getImageData(0, 0, c.width, c.height) }; };
    const sheets = [], logs = {}; const cols = 7, cw = Math.round(64 * HI), ch = Math.round(100 * HI);
    for (const top of TOPS) { S.owned[top] = true; S.owned.gx_v_mini = true; const L = window.__qb.lookOf({ a_top: top, a_pants: 'gx_v_mini' }).rig; if (!(L.equipped && L.equipped.top && L.equipped.top.art === top.replace(/^gx_/, ''))) { logs[top] = ['NOT WORN: the top is not a Shop row (pass NEWROWS)']; continue; }
      const rows = Math.ceil(names.length / cols), cv = document.createElement('canvas'); cv.width = cols * cw; cv.height = rows * (ch + 14) + 20; const g = cv.getContext('2d'); g.fillStyle = '#8b8fa3'; g.fillRect(0, 0, cv.width, cv.height);
      g.fillStyle = '#fff'; g.font = 'bold 13px sans-serif'; logs[top] = []; g.fillText(top + ' on the bare base (red = base showing through, i.e. skin where the tank was)', 4, 14);       for (let i = 0; i < names.length; i++) { const ps = names[i], X = (i % cols) * cw, Y = 20 + Math.floor(i / cols) * (ch + 14);
        const A = toD(await rigN.render(QBLook.build(Q.creator, L), ps)), B = toD(await rigB.render(QBLook.build(Q.creator, L), ps));
        const w = B.cc.width, h = B.cc.height, bd = B.d.data, ad = A.d.data; let y0 = h, y1 = 0; for (let k = 0; k < w * h; k++) if (bd[k * 4 + 3] > 20) { const yy = Math.floor(k / w); if (yy < y0) y0 = yy; if (yy > y1) y1 = yy; }
        let diff = 0, chest = 0; const H = y1 - y0, cTop = y0 + H * 0.36, cBot = y0 + H * 0.5;
        for (let k = 0; k < w * h; k++) { const dd = Math.abs(ad[k * 4] - bd[k * 4]) + Math.abs(ad[k * 4 + 1] - bd[k * 4 + 1]) + Math.abs(ad[k * 4 + 2] - bd[k * 4 + 2]) + Math.abs(ad[k * 4 + 3] - bd[k * 4 + 3]);
          if (dd > 40) { diff++; const yy = Math.floor(k / w); if (yy >= cTop && yy <= cBot) chest++; bd[k * 4] = 255; bd[k * 4 + 1] = 0; bd[k * 4 + 2] = 0; bd[k * 4 + 3] = 255; } }
        B.cc.getContext('2d').putImageData(B.d, 0, 0); g.drawImage(B.cc, X, Y, cw, ch); g.fillStyle = '#fff'; g.font = '10px sans-serif'; g.fillText(ps.slice(0, 10) + ' c' + chest, X + 2, Y + ch + 10);
        logs[top].push(ps + ':' + chest + '/' + diff); }
      sheets.push({ top, png: cv.toDataURL('image/png') }); }
    return { sheets, logs, swapped }; }, [TOPS, HI]);
  r.sheets.forEach((s) => fs.writeFileSync(`${OUT}/bare_${s.top.replace(/^gx_/, '')}.png`, Buffer.from(s.png.split(',')[1], 'base64')));
  console.log('bare base loaded:', r.swapped ? 'yes (' + r.swapped + ' px wide)' : 'NO');
  Object.keys(r.logs).forEach((t) => console.log(t + ' (pose:chest-band px / all px differing): ' + r.logs[t].join(' ')));
  console.log('page errors', errs.length, JSON.stringify(errs.slice(0, 2))); await b.close(); })();
