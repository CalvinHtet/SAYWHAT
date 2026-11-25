// QA, 0d64dd6a (29zz_v168.js: a room picture that arrives late gets its href set again and its SVG nudged with style.transform).
// The Loft pans and zooms by setting the room SVG's style.transform during a gesture (20_loft.js, committed to the viewBox 140 ms
// later). This checks a picture arriving mid-gesture: does the nudge keep the gesture's transform, or wipe it (the room jumps)?
// Also counts how often the observer scans while the Loft sits idle (the frame-rate question).
//   PORT=<plain build> node loft168qa.js
const pw = require('playwright');
const PORT = process.env.PORT || 8819; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 }); await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort())); const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV168, null, { timeout: 120000 }); await p.waitForTimeout(800); await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' });
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Loft', sex: 'm' }); S.xp = x.cum(12); S.gates = [5, 10]; S.tutDone = 1; S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1 }; x.persist(); x.render(); const n = document.querySelector('.nav button[data-v="hideout"]'); if (n) n.click(); });
  await p.waitForTimeout(1500); await p.evaluate(() => { for (const m of document.querySelectorAll('#layer > *')) m.remove(); const g = document.querySelector('[data-act="bldgo"][data-v="0"]'); if (g) g.click(); }); await p.waitForTimeout(1500);
  const r = await p.evaluate(async () => { const svg = document.querySelector('#lfwrap svg') || document.querySelector('svg'); if (!svg) return { nosvg: 1 };
    const pan = 'translate(12.00px,-8.00px) scale(1.2000)'; svg.style.transform = pan; /* as 20_loft.js does mid-gesture */
    const im = document.createElementNS('http://www.w3.org/2000/svg', 'image'); im.setAttribute('href', 'art/app/icon_smk_hoodie.webp?qa=' + Date.now()); im.setAttribute('width', '1'); im.setAttribute('height', '1'); svg.appendChild(im);
    const k0 = window.__qbV168.kicks(); const seen = []; const t0 = performance.now(); while (performance.now() - t0 < 2500) { await new Promise((ok) => requestAnimationFrame(ok)); const t = svg.style.transform; if (!seen.length || seen[seen.length - 1] !== t) seen.push(t); }
    im.remove(); return { kicked: window.__qbV168.kicks() - k0, seen, end: svg.style.transform, pan }; });
  console.log('     transforms seen on the room SVG while a late picture arrived: ' + JSON.stringify(r.seen));
  ok(r.kicked > 0, 'the late picture was re-set (kicks ' + r.kicked + ')');
  ok(r.end === r.pan && !r.seen.includes(''), 'a mid-gesture pan/zoom transform survives the nudge (if it is wiped, the room jumps back until the gesture commits)');
  /* idle scans in the Loft over 10 s */
  const n = await p.evaluate(async () => { let c = 0; const S0 = window.__qbV168.scan; const obs = new MutationObserver((ms) => { for (const m of ms) if (m.addedNodes && m.addedNodes.length) { c++; return; } }); obs.observe(document.documentElement, { childList: true, subtree: true }); await new Promise((ok) => setTimeout(ok, 10000)); obs.disconnect(); return c; });
  console.log('     Loft idle 10 s: ' + n + ' mutation batches that add nodes (each can start one debounced scan, at most one per 120 ms)');
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
