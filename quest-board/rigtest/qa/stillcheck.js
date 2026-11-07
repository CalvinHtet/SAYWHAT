// cfa5f62: each wall screen keeps page 1 as a still picture (.scrBase) under the slides; with animations on it fades out at once,
// with animations off it stays (so the screen is not black). Every room with every upgrade, both ways.
const { chromium } = require('playwright');
const BASE = process.env.BASE, OUT = process.env.OUT;
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await (await b.newContext({ viewport: { width: 1000, height: 900 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 140)));
  await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft, null, { timeout: 90000 }); await p.waitForTimeout(1500);
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Q', sex: 'm' }); S.xp = x.cum(45); S.gates = [5, 10, 20, 30, 40]; x.persist(); });
  await p.reload(); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft, null, { timeout: 90000 }); await p.waitForTimeout(1500);
  const rooms = await p.evaluate(() => { const x = window.__qb.x(); return Object.keys(x.ADDONS).filter((t) => x.ROOMT[t] && (x.ADDONS[t] || []).length); });
  const rows = [];
  for (const t of rooms) {
    const r = await p.evaluate(async (t) => { const w = (ms) => new Promise((o) => setTimeout(o, ms)); const x = window.__qb.x(), S = x.S;
      S.base.slots = S.base.slots.filter((s) => s.t !== t); S.base.slots.push({ t, a: {}, st: 0, pend: 0 }); const rr = S.base.slots[S.base.slots.length - 1];
      x.ADDONS[t].forEach((u) => { if (!(u[3] && (u[3].retired || u[3].opens))) rr.a[u[0]] = 1; });
      document.querySelectorAll('#layer .modal,.dropsplash').forEach((e) => e.remove()); window.__qb.roomModal(S.base.slots.length - 1); await w(1500);
      const m = document.querySelector('.rmodal'); if (!m) return { t, err: 'no window' };
      const base = [...m.querySelectorAll('.scrBase')], sl = [...m.querySelectorAll('.scrS')];
      const op = (e) => +getComputedStyle(e).opacity;
      return { t, screens: base.length, slides: sl.length, baseOn: base.map(op), slidesVisibleOn: sl.filter((e) => op(e) > 0.5).length }; }, t);
    if (r.screens) {
      const off = await p.evaluate(async () => { const w = (ms) => new Promise((o) => setTimeout(o, ms)); const st = document.createElement('style'); st.id = 'noanim'; st.textContent = '*{animation:none!important}'; document.head.appendChild(st); await w(300);
        const m = document.querySelector('.rmodal'); const base = [...m.querySelectorAll('.scrBase')], sl = [...m.querySelectorAll('.scrS')]; const op = (e) => +getComputedStyle(e).opacity;
        const bb = base[0].getBoundingClientRect(); base[0].scrollIntoView({ block: 'center' }); await w(200); const b2 = base[0].closest('svg') && base[0].getBoundingClientRect();
        return { baseOff: base.map(op), slidesVisibleOff: sl.filter((e) => op(e) > 0.5).length, box: [b2.x, b2.y, b2.width, b2.height] }; });
      Object.assign(r, off);
      const [x0, y0, w0, h0] = off.box; if (w0 > 2 && h0 > 2) await p.screenshot({ path: `${OUT}/still_${t}.png`, clip: { x: Math.max(0, x0 - 20), y: Math.max(0, y0 - 20), width: Math.min(400, w0 + 40), height: Math.min(300, h0 + 40) } }).catch(() => {});
      await p.evaluate(() => document.getElementById('noanim').remove());
    }
    rows.push(r);
  }
  rows.filter((r) => r.screens).forEach((r) => console.log(r.t.padEnd(11), 'screens', r.screens, '| animations on: still opacity', JSON.stringify(r.baseOn), 'slides showing', r.slidesVisibleOn, '| off: still', JSON.stringify(r.baseOff), 'slides showing', r.slidesVisibleOff));
  console.log('rooms with no screen:', rows.filter((r) => !r.screens).map((r) => r.t + (r.err ? '(' + r.err + ')' : '')).join(' '));
  console.log('page errors', errs.length, errs.slice(0, 2)); await b.close();
})();
