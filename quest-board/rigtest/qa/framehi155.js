// QA, 93a003f2 (src/loft_bridge.js frameHi): a sharp frame grows the rig's frame, scale and pad for one render and swaps its frame
// cache, restored in finally. This checks that every other rig user is left exactly as it was: the same look (a copy with a harmless
// extra key, so the bridge's caches miss and it really renders again) is drawn before and after big renders, and the pixels must match:
// idle, walk, back, walkBack, a baked seat, every bed's sleeper. Also a big render queued in the middle of a batch of small ones, and the
// sizes frameHi hands back at 2x and 3x. Other checks: another player's card that still names a retired backdrop shows Studio.
//   PORT=<plain build> node framehi155.js
const pw = require('playwright');
const PORT = process.env.PORT || 8819; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 }); await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 200)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.QBLoft && window.__qbV152, null, { timeout: 120000 }); await p.waitForTimeout(1500);
  const r = await p.evaluate(async () => { const L = window.QBLoft, D = L.data.loft, base = window.__qb.fixChar({ name: 'Q', sex: 'f' });
    const seat = Object.keys(D.bakedSeats || {})[0], beds = Object.keys(D.beds || {});
    const jobs = (c) => [['idle', 0], ['idle', 2], ['walk', 3], ['back', 0], ['walkBack', 1]].map(([k, f]) => ['f', k, f, () => L.frame(c, k, f)]).concat(seat ? [['seat', 'sit', 0, () => L.seated(c, 'sit', 0, seat)]] : []).concat(beds.map((bd) => ['bed', bd, 0, () => L.sleeper(c, bd)]));
    const wait = async (fn) => { for (let i = 0; i < 600; i++) { const u = fn(); if (u) return u; await new Promise((ok) => setTimeout(ok, 100)); } return null; };
    const pix = async (u) => { const im = new Image(); im.src = u; await im.decode(); const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight; const x = c.getContext('2d'); x.drawImage(im, 0, 0); const d = x.getImageData(0, 0, c.width, c.height).data; let h = 2166136261, n = 0; for (let i = 0; i < d.length; i++) { h = Math.imul(h ^ d[i], 16777619) >>> 0; if (d[i]) n++; } return { w: c.width, h: c.height, hash: h, n, d }; };
    const grab = async (c) => { const out = []; const J = jobs(c); J.forEach((j) => j[3]()); for (const j of J) { const u = await wait(j[3]); out.push(u ? await pix(u) : null); } return { names: J.map((j) => j[0] + ':' + j[1] + ':' + j[2]), out }; };
    const A = await grab(Object.assign({}, base, { _qa: 1 }));
    /* big renders: 3x and 2x of two looks */
    const hi3 = await wait(() => L.frameHi(base, 'idle', 0, 3)), hi2 = await wait(() => L.frameHi(Object.assign({}, base, { _qa: 9 }), 'idle', 0, 2));
    const s3 = hi3 && await pix(hi3), s2 = hi2 && await pix(hi2), s1 = await pix(await wait(() => L.frame(base, 'idle', 0)));
    const B = await grab(Object.assign({}, base, { _qa: 2 }));
    /* a big render queued in the middle of a batch of small ones */
    const c3 = Object.assign({}, base, { _qa: 3 }); const J3 = jobs(c3); J3.slice(0, 3).forEach((j) => j[3]()); L.frameHi(Object.assign({}, base, { _qa: 4 }), 'idle', 0, 3); J3.slice(3).forEach((j) => j[3]());
    const C = { out: [] }; for (const j of J3) { const u = await wait(j[3]); C.out.push(u ? await pix(u) : null); }
    const cmp = (X) => A.out.map((a, i) => { const x = X.out[i]; if (!a || !x) return 'missing'; if (a.w !== x.w || a.h !== x.h) return 'size ' + a.w + 'x' + a.h + ' vs ' + x.w + 'x' + x.h; if (a.hash === x.hash) return 'same'; let m = 0; for (let k = 0; k < a.d.length; k++) if (Math.abs(a.d[k] - x.d[k]) > 2) m++; return 'differs in ' + m + ' channel values'; });
    const safe = window.__qbV152.safe({ bg: 'ember', r: 'x', c: 'y' }), safe2 = window.__qbV152.safe({ bg: 'roof' });
    return { names: A.names, after: cmp(B), mid: cmp(C), sizes: { s1: s1 && [s1.w, s1.h], s2: s2 && [s2.w, s2.h], s3: s3 && [s3.w, s3.h] }, ink: { s1: s1 && s1.n, s3: s3 && s3.n }, safe, safe2 }; });
  console.log('     frames: ' + r.names.join(', '));
  ok(r.after.every((x) => x === 'same'), 'after a 3x and a 2x render, every Loft frame is pixel-identical: ' + r.after.join(', '));
  ok(r.mid.every((x) => x === 'same'), 'with a 3x render queued in the middle of the batch, every frame is identical: ' + r.mid.join(', '));
  ok(r.sizes.s3 && r.sizes.s1 && r.sizes.s3[0] === r.sizes.s1[0] * 3 && r.sizes.s3[1] === r.sizes.s1[1] * 3 && r.sizes.s2[0] === r.sizes.s1[0] * 2, 'frameHi sizes: 1x ' + r.sizes.s1 + ', 2x ' + r.sizes.s2 + ', 3x ' + r.sizes.s3 + ' (ink ' + JSON.stringify(r.ink) + ')');
  ok(r.safe && r.safe.bg === 'studio' && r.safe2.bg === 'studio', 'another player\'s card naming a retired backdrop shows Studio: ' + JSON.stringify([r.safe, r.safe2]));
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
