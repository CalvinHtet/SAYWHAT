// Rig change wear-test (QA, for LEAD's b559d09: fineSlots, meshStepFine, solidStretch). Every Shop piece not cut or gone, worn alone
// over the default look, both bodies (maleOnly/femaleOnly honoured), in every pose both builds have, drawn by each build's own rig:
// OLD (the last release) and NEW (the candidate). Per frame it counts
//   lost:   pixels solid in OLD (alpha > 128) and empty in NEW (alpha < 40)  -> holes, dropped fabric
//   gained: pixels empty in OLD and solid in NEW                          -> new streaks, spikes
// It logs the worst frames and writes sheets of them (OLD | NEW | diff: red = lost, cyan = gained) for the eye. A rig change moves
// edges by a pixel or two everywhere; the counts rank where to look, they are not a pass/fail on their own.
//   OLD=<server> NEW=<server> OUT=<folder> [SLOTS=a_top,a_acc] [BRANDS=gd,kp] [NEWROWS=<rows.json>] [HI=1] [TOP=60] node rigtest/qa/rigdiff.js
const pw = require('playwright'), fs = require('fs');
const HI = +process.env.HI || 1, OUT = process.env.OUT || 'qa-out/rigdiff', TOP = +process.env.TOP || 60;
const SLOTS = process.env.SLOTS ? process.env.SLOTS.split(',') : null, BRANDS = process.env.BRANDS ? process.env.BRANDS.split(',') : null;
const setup = async (b, base) => { const p = await (await b.newContext({ viewport: { width: 900, height: 700 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && QBLoft.data && window.QBDATA && window.QBRig && window.QBLook, null, { timeout: 120000 }); await p.waitForTimeout(1500);
  if (process.env.NEWROWS) { const NEW = JSON.parse(fs.readFileSync(process.env.NEWROWS, 'utf8')); await p.evaluate((NEW) => { const x = window.__qb.x(); NEW.forEach((r) => { if (!x.SHOP.find((q) => q[0] === r[0])) x.SHOP.push(r); }); }, NEW); }
  await p.evaluate(async (HI) => { const Q = window.QBDATA; const { clips, ...poses } = Q.poses; window.__rd = { poses: Object.keys(poses) };
    window.__rd.rig = await QBRig.create({ rig: Object.assign({}, Q.rig, { frame: [Q.loft.frame[0] * HI, Q.loft.frame[1] * HI], frameScale: Q.loft.frameScale * HI, anchorPad: Q.loft.anchorPad * HI, frameCache: 2 }), bodies: Q.bodies, poses, clips,
      assetUrl: (a) => (window.QBART && QBART[a]) || Q.loft.artBase + a + (Q.arthash && Q.arthash[a] ? '?h=' + Q.arthash[a] : '') });
    window.__rd.draw = async (sex, ov, ps) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex }); S.char.rig = Object.assign({}, QBLoft.data.creator.defaults, { body: sex, hairStyle: 'h1', hairColor: 'brown' }); S.owned = {}; Object.values(ov).forEach((id) => { S.owned[id] = true; });
      const c = await window.__rd.rig.render(QBLook.build(Q.creator, window.__qb.lookOf(ov).rig), ps); const cc = document.createElement('canvas'); cc.width = c.width; cc.height = c.height; cc.getContext('2d').drawImage(c, 0, 0); return cc; };
    window.__rd.png = async (sex, ov, ps) => (await window.__rd.draw(sex, ov, ps)).toDataURL('image/png');
    window.__rd.alpha = async (sex, ov, ps) => { const c = await window.__rd.draw(sex, ov, ps), d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data, a = new Uint8Array(c.width * c.height); for (let i = 0; i < a.length; i++) a[i] = d[i * 4 + 3]; return { w: c.width, h: c.height, a: Array.from(a) }; };
  }, HI); return { p, errs }; };
(async () => { fs.mkdirSync(OUT, { recursive: true });
  const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] });
  const O = await setup(b, process.env.OLD), N = await setup(b, process.env.NEW);
  const rows = await N.p.evaluate(([SLOTS, BRANDS]) => { const x = window.__qb.x(), I = QBLoft.data.items;
    return x.SHOP.filter((it) => /^a_/.test(it[1]) && !(it[6] && (it[6].cut || it[6].gone)) && (!SLOTS || SLOTS.indexOf(it[1]) >= 0) && (!BRANDS || BRANDS.indexOf((it[6] || {}).b) >= 0))
      .map((it) => { const g = I[(it[6] || {}).gar] || {}; return { id: it[0], type: it[1], name: it[2], mo: !!(g.maleOnly || (it[6] || {}).mo), fo: !!(g.femaleOnly || (it[6] || {}).fo) }; }); }, [SLOTS, BRANDS]);
  const oldIds = await O.p.evaluate(() => window.__qb.x().SHOP.map((q) => q[0]));
  const posesO = await O.p.evaluate(() => window.__rd.poses), posesN = await N.p.evaluate(() => window.__rd.poses), poses = posesN.filter((q) => posesO.indexOf(q) >= 0);
  const base = await O.p.evaluate(() => 1);
  const res = []; let n = 0; const t0 = Date.now();
  for (const r of rows) { if (oldIds.indexOf(r.id) < 0) continue; for (const sex of ['m', 'f']) { if ((r.mo && sex === 'f') || (r.fo && sex === 'm')) continue; const ov = {}; ov[r.type] = r.id;
      for (const ps of poses) { const A = await O.p.evaluate(([s, o, q]) => window.__rd.alpha(s, o, q), [sex, ov, ps]), B = await N.p.evaluate(([s, o, q]) => window.__rd.alpha(s, o, q), [sex, ov, ps]); n++;
        if (A.w !== B.w || A.h !== B.h) { res.push({ id: r.id, name: r.name, sex, ps, lost: -1, gained: -1 }); continue; }
        let lost = 0, gained = 0; for (let i = 0; i < A.a.length; i++) { if (A.a[i] > 128 && B.a[i] < 40) lost++; else if (A.a[i] < 40 && B.a[i] > 128) gained++; }
        res.push({ id: r.id, name: r.name, sex, ps, lost, gained }); } } }
  fs.writeFileSync(OUT + '/rigdiff.json', JSON.stringify(res));
  const by = (k) => res.slice().sort((p, q) => q[k] - p[k]).slice(0, TOP);
  const pct = (k, q) => { const v = res.map((r) => r[k]).sort((a, c) => a - c); return v[Math.floor(v.length * q)]; };
  console.log(`frames ${n} (${rows.length} rows, ${poses.length} poses both builds have; NEW-only poses: ${posesN.filter((q) => posesO.indexOf(q) < 0).join(',') || 'none'}) in ${Math.round((Date.now() - t0) / 1000)} s`);
  console.log(`lost px: median ${pct('lost', 0.5)}, p95 ${pct('lost', 0.95)}, p99 ${pct('lost', 0.99)}, max ${pct('lost', 0.9999)}; gained px: median ${pct('gained', 0.5)}, p95 ${pct('gained', 0.95)}, p99 ${pct('gained', 0.99)}, max ${pct('gained', 0.9999)}`);
  for (const k of ['lost', 'gained']) { const top = by(k); console.log(`worst ${k}:`, top.slice(0, 25).map((q) => `${q.id}/${q.sex}/${q.ps}:${q[k]}`).join(' '));
    const cw = Math.round(64 * HI * 2), ch = Math.round(100 * HI * 2); const imgs = [];
    for (const q of top.slice(0, 24)) { const ov = {}; ov[rows.find((r) => r.id === q.id).type] = q.id; imgs.push({ q, a: await O.p.evaluate(([s, o, p]) => window.__rd.png(s, o, p), [q.sex, ov, q.ps]), b: await N.p.evaluate(([s, o, p]) => window.__rd.png(s, o, p), [q.sex, ov, q.ps]) }); }
    const sheet = await N.p.evaluate(async ([imgs, cw, ch, k]) => { const ld = (u) => new Promise((o) => { const im = new Image(); im.onload = () => o(im); im.src = u; }); const cols = 4, cv = document.createElement('canvas'); cv.width = cols * cw * 3; cv.height = Math.ceil(imgs.length / cols) * (ch + 16); const g = cv.getContext('2d'); g.fillStyle = '#8b8fa3'; g.fillRect(0, 0, cv.width, cv.height);
      for (let i = 0; i < imgs.length; i++) { const X = (i % cols) * cw * 3, Y = Math.floor(i / cols) * (ch + 16), A = await ld(imgs[i].a), B = await ld(imgs[i].b); g.drawImage(A, X, Y, cw, ch); g.drawImage(B, X + cw, Y, cw, ch);
        const t = document.createElement('canvas'); t.width = A.width; t.height = A.height; const tg = t.getContext('2d'); tg.drawImage(A, 0, 0); const da = tg.getImageData(0, 0, t.width, t.height); tg.clearRect(0, 0, t.width, t.height); tg.drawImage(B, 0, 0); const db = tg.getImageData(0, 0, t.width, t.height);
        const o = tg.createImageData(t.width, t.height); for (let j = 0; j < o.data.length; j += 4) { const a1 = da.data[j + 3], b1 = db.data[j + 3]; if (a1 > 128 && b1 < 40) { o.data[j] = 255; o.data[j + 3] = 255; } else if (a1 < 40 && b1 > 128) { o.data[j + 1] = 255; o.data[j + 2] = 255; o.data[j + 3] = 255; } else if (b1 > 40) { o.data[j] = o.data[j + 1] = o.data[j + 2] = 200; o.data[j + 3] = 90; } }
        tg.putImageData(o, 0, 0); g.drawImage(t, X + 2 * cw, Y, cw, ch); g.fillStyle = '#fff'; g.font = '11px sans-serif'; const q = imgs[i].q; g.fillText(`${q.id.replace(/^gx_/, '')} ${q.sex} ${q.ps} ${k} ${q[k]}`, X + 2, Y + ch + 12); }
      return cv.toDataURL('image/png'); }, [imgs, cw, ch, k]);
    fs.writeFileSync(`${OUT}/worst_${k}.png`, Buffer.from(sheet.split(',')[1], 'base64')); }
  console.log('page errors OLD', O.errs.length, 'NEW', N.errs.length, JSON.stringify(N.errs.slice(0, 2))); await b.close(); })();
