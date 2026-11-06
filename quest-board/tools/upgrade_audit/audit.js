// Every upgrade in every room, bought one at a time in shop order: a picture after each, for compare.py to measure.
//   BASE=http://127.0.0.1:8765 OUT=<folder> node audit.js [room,room]   ->  <OUT>/<room>/NN_<id>.png and <OUT>/steps.json
// then  OUT=<folder> python3 compare.py  ->  <OUT>/report.md (OK / WEAK / NONE per upgrade) and before/after sheets.
const { chromium } = require('playwright');
const fs = require('fs');
const OUT = require('path').resolve(process.env.OUT || 'upgrade-audit-out');
const only = process.argv[2] ? process.argv[2].split(',') : null;
let ORDER = [];
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext({ viewport: { width: 1000, height: 1500 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  await p.clock.setFixedTime(new Date(process.env.CLOCK || '2026-11-05T14:00:00'));
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  let pending = 0;
  p.on('request', () => pending++);
  p.on('requestfinished', () => pending--);
  p.on('requestfailed', (r) => { pending--; errs.push('fail ' + r.url().slice(-80)); });
  await p.goto((process.env.BASE || 'http://127.0.0.1:8765') + '/dist/index.html');
  await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft, null, { timeout: 90000 });
  await p.waitForTimeout(1000);
  ORDER = await p.evaluate(() => { const x = window.__qb.x(); return Object.keys(x.ADDONS).filter((t) => x.ROOMT[t] && (x.ADDONS[t] || []).length); });
  await p.evaluate(([order, lv]) => {
    const x = window.__qb.x(), S = x.S;
    S.created = true;
    S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' });
    S.gates = Array.from({ length: 200 }, (_, i) => i);
    S.xp = x.cum(lv);
    S.coins = 999999;
    S.base.served = 1e9;
    S.base.slots = order.map((t) => ({ t, a: {}, st: 0, pend: 0 }));
    x.render();
  }, [ORDER, +(process.env.LV || 60)]);
  await p.waitForTimeout(500);
  await p.evaluate(() => { document.querySelectorAll('.dropsplash,.modal,.overlay').forEach((e) => e.remove()); const t = [...document.querySelectorAll('button')].find((e) => /the loft/i.test(e.textContent)); if (t) t.click(); });
  await p.waitForTimeout(1500);
  const settle = async () => {
    for (let k = 0; k < 40; k++) { await p.waitForTimeout(250); if (pending <= 0 && k >= 3) break; }
    await p.waitForTimeout(300);
  };
  // open the room view, take people out, freeze every animation
  const show = async (i) => {
    await p.evaluate((i) => {
      document.querySelectorAll('.dropsplash,.modal,.overlay').forEach((e) => e.remove());
      window.__qb.roomModal(i);
      if (window.lfPvStop) window.lfPvStop();
      if (!document.getElementById('qbfreeze')) { const s = document.createElement('style'); s.id = 'qbfreeze'; s.textContent = '*,*::before,*::after{animation:none!important;transition:none!important}'; document.head.appendChild(s); }
    }, i);
    await settle();
    return p.evaluate(() => {
      if (window.lfPvStop) window.lfPvStop();
      const w = document.querySelector('#rbigw');
      w.querySelectorAll('[id^="lfa-"]').forEach((e) => e.remove());
      w.querySelectorAll('canvas').forEach((e) => { e.style.visibility = 'hidden'; });
      w.querySelectorAll('svg').forEach((s) => { try { s.pauseAnimations(); s.setCurrentTime(0); } catch (e) {} });
      const svg = w.querySelector('svg.lfprev');
      return { vb: svg ? svg.getAttribute('viewBox') : null, nItems: w.querySelectorAll('.lfitems > g').length };
    });
  };
  const shot = async (path) => {
    await p.waitForTimeout(250);
    const el = await p.$('#rbigw'); const bb = await el.boundingBox();
    await p.screenshot({ path, clip: bb, timeout: 60000 });
    return [Math.round(bb.width), Math.round(bb.height)];
  };
  const all = fs.existsSync(OUT + '/steps.json') ? JSON.parse(fs.readFileSync(OUT + '/steps.json')) : {};
  for (let i = 0; i < ORDER.length; i++) {
    const room = ORDER[i];
    if (only && !only.includes(room)) continue;
    const dir = `${OUT}/${room}`; fs.mkdirSync(dir, { recursive: true });
    const meta = await p.evaluate((i) => {
      const x = window.__qb.x(), r = x.S.base.slots[i];
      r.a = {}; r.st = 0;
      return (x.ADDONS[r.t] || []).map((u) => ({ id: u[0], name: u[1], price: u[2], retired: !!(u[3] && u[3].retired), opens: (u[3] && u[3].opens) || null }));
    }, i);
    const steps = [];
    let info = await show(i);
    const sz = await shot(`${dir}/00_base.png`);
    await p.waitForTimeout(1200);
    await shot(`${dir}/00_base_again.png`);
    steps.push({ id: '_base', file: '00_base.png', vb: info.vb, items: info.nItems, size: sz });
    for (let n = 1; n < 80; n++) {
      const nx = await p.evaluate(() => { const bt = [...document.querySelectorAll('#layer .modal button[data-act="raddon"]:not([disabled])')]; return bt.length ? bt[0].dataset.id : null; });
      if (!nx) break;
      await p.evaluate(({ i, nx }) => { const r = window.__qb.x().S.base.slots[i]; r.a[nx] = 1; }, { i, nx });
      info = await show(i);
      const f = `${String(n).padStart(2, '0')}_${nx}.png`;
      await shot(`${dir}/${f}`);
      steps.push({ id: nx, file: f, vb: info.vb, items: info.nItems });
      console.log(room, n, nx, info.vb, info.nItems);
    }
    // upgrades the shop never offered (dead prerequisite, level): forced on one at a time, marked forced
    const left = meta.filter((m) => !m.retired && !steps.some((s) => s.id === m.id));
    for (const m of left) {
      await p.evaluate(({ i, id }) => { window.__qb.x().S.base.slots[i].a[id] = 1; }, { i, id: m.id });
      info = await show(i);
      const f = `${String(steps.length).padStart(2, '0')}_${m.id}_forced.png`;
      await shot(`${dir}/${f}`);
      steps.push({ id: m.id, file: f, vb: info.vb, items: info.nItems, forced: 1 });
      console.log(room, 'forced', m.id);
    }
    await p.waitForTimeout(1200);
    await shot(`${dir}/zz_final_again.png`);
    const owned = await p.evaluate((i) => Object.keys(window.__qb.x().S.base.slots[i].a), i);
    all[room] = { meta, steps, owned };
    fs.writeFileSync(OUT + '/steps.json', JSON.stringify(all, null, 1));
    // leave the room fully owned? no: reset so neighbours stay comparable
  }
  console.log('errs', errs.slice(0, 10));
  await b.close();
})();
