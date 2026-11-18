// The Stylist's eyes/mouth split (Cal 11-18; format agreed with ROOMS), on the plain build. Without the new art (today): the look keeps
// today's single face (f_face_front, faceclosed, iris) and has no mouth layer, so nothing changes. With stand-in art injected in the
// page (eyes e2 red, its closed version, iris, mouth m3 blue): a look with eyeShape e2 / mouth m3 draws face = eyes_e2, faceClosed =
// eyes_e2c, iris = iris_e2 (still tinted), and a mouth layer; the rig draws the mouth (blue pixels in the frame) under the face, and a
// sleeping pose keeps the mouth while its eyes close. No page errors.
//   PORT=<plain build server> NODE_PATH=<playwright's parent> node rigtest/lead/facesplit.js
const { chromium } = require('playwright');
let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
const base = 'http://127.0.0.1:' + (process.env.PORT || 8779);
(async () => { const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await (await b.newContext()).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 150)));
  await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.QBRig && window.QBLook && window.QBDATA, null, { timeout: 90000 }); await p.waitForTimeout(1000);
  const r = await p.evaluate(async () => { const Q = window.QBDATA, out = {};
    const L0 = QBLook.build(Q.creator, Object.assign({}, Q.creator.defaults, { body: 'f' }));
    out.today = { face: L0.layers.face.front, closed: L0.layers.faceClosed.front, iris: L0.layers.iris.front, mouth: !!L0.layers.mouth };
    // stand-in art: frame-sized PNGs, a red block where the eyes are, a blue block where the mouth is (head joints from bodies.json)
    const [W, H] = Q.rig.canvas, J = Q.bodies.f.front.joints, hc = J.headC;
    const png = (col, y0, y1) => { const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'); g.fillStyle = col; g.fillRect(hc[0] - 160, y0, 320, y1 - y0); return c.toDataURL('image/png'); };
    window.QBART = window.QBART || {};
    QBART['f_eyes_e2_front.webp'] = png('#ff0000', hc[1] - 40, hc[1] + 60); QBART['f_eyes_e2c_front.webp'] = png('#00ff00', hc[1] - 40, hc[1] + 60);
    QBART['f_iris_e2_front.webp'] = png('#cccccc', hc[1], hc[1] + 30); QBART['f_mouth_m3_front.webp'] = png('#0000ff', hc[1] + 150, hc[1] + 230);
    const L = QBLook.build(Q.creator, Object.assign({}, Q.creator.defaults, { body: 'f', eyeShape: 'e2', mouth: 'm3' }));
    out.split = { face: L.layers.face.front, closed: L.layers.faceClosed.front, iris: L.layers.iris.front, tinted: !!L.layers.iris.tint, mouth: L.layers.mouth && L.layers.mouth.front };
    const { clips, ...poses } = Q.poses; const rig = await QBRig.create({ rig: Q.rig, bodies: Q.bodies, poses, clips, assetUrl: (a) => (window.QBART && QBART[a]) || Q.loft.artBase + a + (Q.arthash && Q.arthash[a] ? '?h=' + Q.arthash[a] : '') });
    const count = (cv, test) => { const g = document.createElement('canvas'); g.width = cv.width; g.height = cv.height; const c = g.getContext('2d'); c.drawImage(cv, 0, 0); const d = c.getImageData(0, 0, g.width, g.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 200 && test(d[i], d[i + 1], d[i + 2])) n++; return n; };
    const blue = (r, g, b2) => b2 > 200 && r < 60 && g < 60, red = (r, g, b2) => r > 200 && g < 60 && b2 < 60, green = (r, g, b2) => g > 200 && r < 60 && b2 < 60;
    const idle = await rig.render(L, 'idle'), sleep = await rig.render(L, 'laugh1');
    out.px = { idleBlue: count(idle, blue), idleRed: count(idle, red), laughBlue: count(sleep, blue), laughGreen: count(sleep, green), laughRed: count(sleep, red) };
    return out; });
  ok(r.today.face === 'f_face_front.webp' && r.today.closed === 'f_faceclosed_front.webp' && r.today.iris === 'f_iris_front.webp' && !r.today.mouth, 'without the new art: today\'s single face, no mouth layer ' + JSON.stringify(r.today));
  ok(r.split.face === 'f_eyes_e2_front.webp' && r.split.closed === 'f_eyes_e2c_front.webp' && r.split.iris === 'f_iris_e2_front.webp' && r.split.tinted && r.split.mouth === 'f_mouth_m3_front.webp', 'with it: eyes, closed eyes, tinted iris mask and a mouth layer ' + JSON.stringify(r.split));
  ok(r.px.idleBlue > 50 && r.px.idleRed > 10, 'idle draws the mouth and the open eyes (most of the stand-in eye block sits under the stand-in iris and the bangs) ' + JSON.stringify(r.px));
  ok(r.px.laughBlue > 50 && r.px.laughGreen > 50 && r.px.laughRed === 0, 'a laughing pose closes the eyes and keeps the mouth');
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
