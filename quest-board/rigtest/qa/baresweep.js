// QA, LEAD 11-28 (after gx_nc_bralette showed her painted grey tank): which tops on sale need "bare" on her body?
// For every Shop top (a_top, not cut) with art, on her body in a few poses, the rig draws the look twice: with the item's own "bare"
// flag, and with "bare" forced on (her bare base, the one v_bralette and y_tube use). Pixels that change between the two are base tank
// showing around or through the top. A top that covers the tank gives ~0; a top whose look leaves skin where her tank is painted
// gives hundreds. Tops already flagged are listed for reference. Saves OUT/baresweep_<gar>.png (as-is | forced bare) for the worst.
//   BASE=<server> OUT=<dir> [POSES=rest,cheer1,sideL] [TOP=12] NODE_PATH=<playwright> node rigtest/qa/baresweep.js
const pw = require('playwright'), fs = require('fs'); const BASE = process.env.BASE || 'http://127.0.0.1:8824', OUT = process.env.OUT || '.';
const POSES = (process.env.POSES || 'rest,cheer1,sideL').split(','), TOPN = +(process.env.TOP || 12);
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] }); const p = await (await b.newContext({ viewport: { width: 1200, height: 900 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
  await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.QBLoft && window.QBDATA && window.QBRig && window.QBLook, null, { timeout: 120000 }); await p.waitForTimeout(1500);
  const r = await p.evaluate(async ([POSES, TOPN]) => { const Q = window.QBDATA, x = window.__qb.x(), S = x.S; const { clips, ...poses } = Q.poses; const HI = 1;
    const rig = await QBRig.create({ rig: Object.assign({}, Q.rig, { frame: [Q.loft.frame[0] * HI, Q.loft.frame[1] * HI], frameScale: Q.loft.frameScale * HI, anchorPad: Q.loft.anchorPad * HI, frameCache: 2 }), bodies: Q.bodies, poses, clips, assetUrl: (a) => (window.QBART && QBART[a]) || Q.loft.artBase + a + (Q.arthash && Q.arthash[a] ? '?h=' + Q.arthash[a] : '') });
    const look = (id) => { S.created = true; S.char = window.__qb.fixChar({ name: 'B', sex: 'f' }); S.char.rig = Object.assign({}, QBLoft.data.creator.defaults, { body: 'f', hairStyle: 'h4', hairColor: 'brown' }); S.owned = S.owned || {}; S.owned[id] = true; return QBLook.build(Q.creator, window.__qb.lookOf({ a_top: id }).rig); };
    const grab = (c) => { const cc = document.createElement('canvas'); cc.width = c.width; cc.height = c.height; cc.getContext('2d').drawImage(c, 0, 0); return cc; };
    const tops = x.SHOP.filter((it) => it[1] === 'a_top' && it[6] && it[6].gar && !it[6].cut && Q.items[it[6].gar]);
    const out = []; const keep = [];
    for (const it of tops) { const g = it[6].gar, M = Q.items[g], was = !!M.bare; if (M.maleOnly) continue; let worst = 0, wp = '', pair = null;
      for (const ps of POSES) { let c0, c1; try { M.bare = was; c0 = grab(await rig.render(look(it[0]), ps)); M.bare = true; c1 = grab(await rig.render(look(it[0]), ps)); } catch (e) { M.bare = was; continue; } M.bare = was;
        const W = c0.width, H = c0.height, d0 = c0.getContext('2d').getImageData(0, 0, W, H).data, d1 = c1.getContext('2d').getImageData(0, 0, W, H).data; let n = 0;
        for (let i = 0; i < W * H; i++) { const j = i * 4; if (Math.abs(d0[j] - d1[j]) + Math.abs(d0[j + 1] - d1[j + 1]) + Math.abs(d0[j + 2] - d1[j + 2]) > 60 || Math.abs(d0[j + 3] - d1[j + 3]) > 60) n++; }
        if (n > worst) { worst = n; wp = ps; pair = [c0, c1]; } }
      out.push({ id: it[0], gar: g, name: it[2], bare: was, femaleOnly: !!M.femaleOnly, from: it[6].from || '', worst, pose: wp });
      if (!was && pair) keep.push({ g, worst, pair }); }
    keep.sort((a, c) => c.worst - a.worst); const pics = keep.slice(0, TOPN).map((k) => { const [c0, c1] = k.pair; const W = c0.width, H = c0.height; const sh = document.createElement('canvas'); sh.width = W * 2; sh.height = Math.round(H * 0.55); const g2 = sh.getContext('2d'); g2.fillStyle = '#8b8fa3'; g2.fillRect(0, 0, sh.width, sh.height); g2.drawImage(c0, 0, -Math.round(H * 0.15)); g2.drawImage(c1, W, -Math.round(H * 0.15)); return { g: k.g, u: sh.toDataURL('image/png') }; });
    return { out, pics, n: tops.length }; }, [POSES, TOPN]);
  r.pics.forEach((q) => fs.writeFileSync(OUT + '/baresweep_' + q.g + '.png', Buffer.from(q.u.split(',')[1], 'base64')));
  const L = r.out.slice().sort((a, c) => c.worst - a.worst);
  console.log('tops on sale with art: ' + r.n + '; poses ' + POSES.join(',') + '; changed px (as-is vs forced bare), worst pose:');
  L.forEach((q) => console.log(String(q.worst).padStart(6) + '  ' + q.id.padEnd(22) + (q.bare ? ' bare ' : '      ') + (q.femaleOnly ? 'fOnly ' : '      ') + q.pose.padEnd(8) + q.name + (q.from ? '  (from ' + q.from + ')' : '')));
  console.log('page errors ' + errs.length + ' ' + JSON.stringify(errs.slice(0, 2))); await b.close(); })();
