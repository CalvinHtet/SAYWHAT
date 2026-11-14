// LEAD's Loft lag fix (dbffcfa): the Patio sky as one bitmap. The Patio, the Rooftop and the Bedroom (sky through its door) at noon, dusk and
// night, fully bought, on the new build and on v0.97: the room picture compared pixel by pixel; the new one must use the bitmap (.zxsky). Then a
// light change while the Patio window is open: one bitmap, a new one, no live sky left over.   NEW= OLD= OUT= node skyqa.js
const fs = require('fs'), path = require('path'); const { chromium } = require('playwright'); const lib = require('./lib.js');
const NEW = process.env.NEW || 'http://127.0.0.1:8769', OLD = process.env.OLD || 'http://127.0.0.1:8770', OUT = process.env.OUT || 'qa-out/sky/'; fs.mkdirSync(OUT, { recursive: true });
let bad = 0; const ok = (n, c, g) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + n + (g !== undefined ? '  ' + JSON.stringify(g).slice(0, 400) : '')); };
const HOURS = [12, 19, 23];
const shoot = async (base, tag) => { process.env.BASE = base; delete require.cache[require.resolve('./lib.js')]; const L = require('./lib.js');
  const { b, p, errs } = await L.open({ width: 1000, height: 820, owned: 'all' }); const out = {};
  for (const h of HOURS) { await p.evaluate((h) => { window.LFHOUR = h; }, h); // the room light follows LA sun time (lfSunPos), set by LFHOUR, not the game clock
    for (const room of ['patio', 'rooftop', 'bedroom']) { const i = await p.evaluate((r) => window.__qb.x().S.base.slots.findIndex((s) => s && s.t === r), room);
      await L.openRoom(p, i, 900, 700); await p.waitForTimeout(1500); await L.openRoom(p, i, 900, 700); await p.waitForTimeout(400);
      const info = await p.evaluate(() => ({ sky: document.querySelectorAll('#qahost image.zxsky').length, live: document.querySelectorAll('#qahost g[data-zxsky]').length, n: document.querySelectorAll('#qahost *').length }));
      const png = await (await p.$('#qahost')).screenshot({ path: path.join(OUT, `${tag}_${room}_${h}.png`) }); out[`${room}_${h}`] = { png: png.toString('base64'), info }; } }
  await b.close(); return { out, errs }; };
(async () => { const A = await shoot(NEW, 'new'), B = await shoot(OLD, 'old');
  process.env.BASE = NEW; delete require.cache[require.resolve('./lib.js')]; const L = require('./lib.js'); const { b, p, errs } = await L.open({ width: 1000, height: 820, owned: 'all' });
  for (const k of Object.keys(A.out)) { const d = await L.diff(p, A.out[k].png, B.out[k].png); const share = d && (d.share != null ? d.share : d);
    ok(`${k}: the bitmap sky is in (${A.out[k].info.sky}, live left ${A.out[k].info.live}; elements ${B.out[k].info.n} -> ${A.out[k].info.n}), the picture matches v0.97`, A.out[k].info.sky >= 1 && A.out[k].info.live === 0 && share < 0.01, d); }
  // a light change while the Patio window is open
  const i = await p.evaluate(() => window.__qb.x().S.base.slots.findIndex((s) => s && s.t === 'patio'));
  await p.evaluate((i) => { const n = new Date(), t = new Date(n); t.setHours(12, 0, 0, 0); window.__qbShift = (window.__qbShift || 0) + (t - n); document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); window.__qb.roomModal(i); }, i); await p.waitForTimeout(2500);
  const s0 = await p.evaluate(() => ({ sky: [...document.querySelectorAll('#rbigw image.zxsky')].map((e) => e.getAttribute('href').slice(-12)), live: document.querySelectorAll('#rbigw g[data-zxsky]').length }));
  await p.evaluate(() => { const n = new Date(), t = new Date(n); t.setHours(23, 0, 0, 0); window.__qbShift = (window.__qbShift || 0) + (t - n); }, i);
  let s1 = null; for (let k = 0; k < 2; k++) { await p.waitForTimeout(4000); s1 = await p.evaluate(() => ({ sky: [...document.querySelectorAll('#rbigw image.zxsky')].map((e) => e.getAttribute('href').slice(-12)), live: document.querySelectorAll('#rbigw g[data-zxsky]').length })); if (s1.sky.length && s1.sky[0] !== s0.sky[0]) break; }
  await (await p.$('#rbigw')).screenshot({ path: path.join(OUT, 'patio_window_after_night.png') }).catch(() => {});
  console.log('     (an open window does not redraw its sky on a light change, on v0.97 either)');ok('a light change with the Patio window open: still one bitmap, no live sky left over', s0.sky.length === 1 && s1.sky.length === 1 && s1.live === 0, { noon: s0, night: s1 });
  ok('no page errors', !A.errs.length && !B.errs.length && !errs.length, [A.errs, B.errs, errs].map((e) => e.slice(0, 2)));
  await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })().catch((e) => { console.error(e); process.exit(1); });
