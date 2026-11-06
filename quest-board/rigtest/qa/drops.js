// The launch drop schedule (LEAD's a652991, off until launch): with it off, the Shop's drop text must match the build before it
// (BASE0); with it on, every date is a Monday or Thursday, HANGANG is first and NICE COCK fifth when in the build, two separate
// pages agree, and stepping through the weeks moves brands live -> vault in order, no brand twice in the live four.
//   BASE0=<before> BASE=<after> node drops.js
const { chromium } = require('playwright');
const load = async (b, base) => { const p = await (await b.newContext({ viewport: { width: 440, height: 900 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x, null, { timeout: 90000 }); await p.waitForTimeout(1500);
  await p.evaluate(() => { const x = window.__qb.x(); x.S.created = true; x.S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); x.render(); document.querySelectorAll('#layer .modal,.dropsplash').forEach((e) => e.remove()); document.querySelector('.nav button[data-v="shop"]').click(); });
  await p.waitForTimeout(1500); return { p, errs }; };
const shopText = (p) => p.evaluate(() => (document.querySelector('#app').innerText.match(/[^\n]*(drop|Monday|Thursday|vault|HANGANG|Y2K)[^\n]*/g) || []).slice(0, 8).join(' | '));
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const A = await load(b, process.env.BASE0), B = await load(b, process.env.BASE);
  const ta = await shopText(A.p), tb = await shopText(B.p);
  console.log((ta === tb ? 'ok   ' : 'DIFF ') + 'off: the Shop drop text before and after'); if (ta !== tb) console.log('  before: ' + ta + '\n  after:  ' + tb); else console.log('  ' + tb.slice(0, 300));
  const on = async (p) => p.evaluate(() => { const D = window.__qbDrops; D.cfg.on = true; const plan = D.plan(1); return plan.map((e) => [e.id, e.start, new Date(e.start + 'T12:00:00Z').getUTCDay()]); });
  const pa = await on(B.p); const C = await load(b, process.env.BASE); const pc = await on(C.p);
  console.log(`on: ${pa.length} slots: ` + pa.map((e) => `${e[0]} ${e[1]} ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][e[2]]}`).join(', '));
  console.log((pa.every((e) => e[2] === 1 || e[2] === 4) ? 'ok   ' : 'FAIL ') + 'every date a Monday or Thursday');
  console.log((pa[0] && pa[0][0] === 'hanga' ? 'ok   ' : 'FAIL ') + 'HANGANG first;  NICE COCK ' + (pa.findIndex((e) => e[0] === 'nicecock') === 4 ? 'fifth' : pa.some((e) => e[0] === 'nicecock') ? 'NOT fifth' : 'not in the build yet'));
  console.log((JSON.stringify(pa) === JSON.stringify(pc) ? 'ok   ' : 'FAIL ') + 'two pages give the same plan');
  // step through the weeks with the clock
  const weeks = await B.p.evaluate(() => { const D = window.__qbDrops; const out = []; const keep = window.__qbShift || 0; const real = Date.now() - keep; const start = new Date(D.cfg.launch + 'T20:00:00Z').getTime();
    for (let k = -1; k < 14; k++) { window.__qbShift = (start + k * 3.5 * 864e5) - real; /* Date.now() already includes the shift */ const s = D.state(); const live = s.live.map((x) => x.id); out.push({ k, live, vault: s.vault.map((x) => x.id), next: s.next && s.next.id + ' ' + s.next.start, dup: live.length !== new Set(live).size }); }
    window.__qbShift = keep; return out; });
  weeks.forEach((w) => console.log(`  +${(w.k * 3.5).toFixed(1)} d: live ${w.live.join(',') || '-'} | vault ${w.vault.join(',') || '-'} | next ${w.next || 'none'}${w.dup ? '  DUPLICATE' : ''}`));
  console.log('page errors', A.errs.length + B.errs.length + C.errs.length, [...A.errs, ...B.errs, ...C.errs].slice(0, 2));
  await b.close();
})();
