// Cal 11-25 (29zz_v168.js): a room picture that arrives after the room was drawn gets its <image> set again so Safari paints it; and
// the stretch pose swaps in the yawn face (falls back to the closed-eyes face until ROOMS paints <b>_faceyawn).
//   PORT=<build server> NODE_PATH=<playwright's parent> node rigtest/lead/loft168.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8838; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const errs = [];
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV168 && window.QBLook, null, { timeout: 90000 }); await p.waitForTimeout(500);
  const V = (f, a) => p.evaluate(f, a);
  const k0 = await V(() => window.__qbV168.kicks());
  await V(() => { const d = document.createElement('div'); d.id = 't168'; d.innerHTML = '<svg width="80" height="80"><image href="art/acx_change.webp" width="80" height="80"/><image href="data:image/png;base64,iVBORw0KGgo=" width="1" height="1"/></svg>'; document.body.appendChild(d); });
  await p.waitForTimeout(1200);
  const r = await V(() => { const s = window.__qbV168.state(); return { file: s['art/acx_change.webp'], data: Object.keys(s).some((k) => /^data:/.test(k)), kicks: window.__qbV168.kicks() }; });
  ok(r.file === 2 && r.kicks > k0 && !r.data, 'a room picture fetched after drawing is re-set once it arrives; data: pictures are left alone ' + JSON.stringify(r));
  await V(() => { document.getElementById('t168').remove(); const d = document.createElement('div'); d.id = 't168b'; d.innerHTML = '<svg><image href="art/acx_change.webp"/></svg>'; document.body.appendChild(d); });
  const k1 = await V(() => window.__qbV168.kicks()); await p.waitForTimeout(500); const k2 = await V(() => window.__qbV168.kicks());
  ok(k2 === k1, 'a picture already fetched is not fetched or re-set again');
  const y = await V(() => { const out = {}; ['m', 'f'].forEach((sx) => { const L = window.QBLook.build(QBLoft.data.creator, { body: sx }).layers || {}; out[sx] = { yawn: L.faceYawn && L.faceYawn.front, closed: L.faceClosed && L.faceClosed.front }; }); return out; });
  const hasArt = await V(() => ['m', 'f'].map((s) => !!((window.QBART && QBART[s + '_faceyawn_front.webp']) || (QBDATA.arthash && QBDATA.arthash[s + '_faceyawn_front.webp']))));
  ok(['m', 'f'].every((s, i) => y[s].yawn && (hasArt[i] ? /faceyawn/.test(y[s].yawn) : y[s].yawn === y[s].closed)), 'the stretch\'s yawn face: ' + (hasArt.some(Boolean) ? 'the painted yawn face' : 'no art yet, so the closed-eyes face as before') + ' ' + JSON.stringify(y));
  /* the stretch pose itself still drawing is pose162.js's check (the card's Stretch pose) */
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
