// Cal 11-26 idea 4 (29zz_v189.js): photos are shrunk in a worker, off the page; a passed photo is made ready ahead of posting;
// the old page path still works when there is no worker.
//   PORT=<build server> NODE_PATH=<playwright's parent> OUT=<dir> node rigtest/lead/photo189.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8838; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV189 && window.__qbV182, null, { timeout: 90000 }); await p.waitForTimeout(300);
  const V = (f, a) => p.evaluate(f, a);
  /* a 12 MP camera-sized photo with detail, so it is costly to decode */
  await V(async () => { const c = document.createElement('canvas'); c.width = 4032; c.height = 3024; const x = c.getContext('2d'); for (let i = 0; i < 4000; i++) { x.fillStyle = 'hsl(' + (i * 37 % 360) + ',70%,' + (30 + i % 40) + '%)'; x.fillRect((i * 97) % 4032, (i * 61) % 3024, 80, 60); }
    window.__big = await new Promise((o) => c.toBlob((bb) => o(new File([bb], 'p.jpg', { type: 'image/jpeg' })), 'image/jpeg', 0.92)); });
  const run = (off) => V(async (off) => { window.__qbV189.off(off); const lt = []; const ob = new PerformanceObserver((l) => l.getEntries().forEach((e) => lt.push(Math.round(e.duration)))); ob.observe({ entryTypes: ['longtask'] });
    const f = new File([window.__big], 'p' + off + '.jpg', { type: 'image/jpeg' }); const t0 = performance.now(); const im = await window.__qbV189.imgs(f, false); const ms = Math.round(performance.now() - t0); await new Promise((o) => setTimeout(o, 100)); ob.disconnect(); window.__qbV189.off(0);
    return { ms, w: im.w, h: im.h, full: im.full.size, thumb: im.thumb.size, type: im.full.type, longest: lt.length ? Math.max(...lt) : 0 }; }, off);
  const w = await run(false), o = await run(true);
  ok(await V(() => window.__qbV189.can()), 'this browser has worker canvases');
  ok(w.w === 1080 && w.h === 810 && w.type === 'image/jpeg' && w.full <= 900 * 1024 && w.thumb > 0, 'the worker makes the same pictures: 1080 wide JPEG under 900 KB and a thumb ' + JSON.stringify(w));
  ok(o.w === w.w && o.h === w.h && o.thumb > 0, 'the old page path still works without a worker ' + JSON.stringify(o));
  ok(w.longest < Math.max(120, o.longest / 2), 'the page is not held by the worker path (longest page task ' + w.longest + ' ms, the old path ' + o.longest + ' ms)');
  const pre = await V(async () => { const f = new File([window.__big], 'q.jpg', { type: 'image/jpeg' }); window.__qbV182.rem({ file: f, kind: 'quest', what: 'Wipe the counters' }); await new Promise((o) => setTimeout(o, 3500)); const r = window.__qbV189.ready(f); const t0 = performance.now(); await window.__qbV189.imgs(f, false); return { ready: r, again: Math.round(performance.now() - t0) }; });
  ok(pre.ready && pre.again < 60, 'a passed photo is made ready ahead of posting ' + JSON.stringify(pre));
  const ba = await V(async () => { const f = new File([window.__big], 'b.jpg', { type: 'image/jpeg' }); const r = window.__qb.x ? null : null; const id = 'zz'; const d = await new Promise((o, n) => { const inp = document.createElement('input'); o(null); });
    const c = document.createElement('canvas'); c.width = 600; c.height = 800; c.getContext('2d').fillRect(0, 0, 600, 800); const before = c.toDataURL('image/jpeg', 0.8);
    const pair = await window.__qbV182.compose(before, f); const bm = await createImageBitmap(pair); return { type: pair.type, w: bm.width, h: bm.height }; });
  ok(ba.type === 'image/jpeg' && ba.h === 900 && ba.w > 900, 'a before and after pair is still put together side by side ' + JSON.stringify(ba));
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
