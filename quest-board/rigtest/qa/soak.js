// Stability soak (QA, Cal 11-23: "do another QA check on the stability of the whole platform"). A full save (every room, every upgrade,
// level 60, a full wardrobe), phone size, plain build, every request off this machine refused. For MINS minutes it walks the game the way a
// player does: Board, Training, the Loft (the street, each building, each room's window), the Town Hall's tabs, the Shop's floors, the
// Wardrobe, then round again. Every LAP it records: JS heap used (MB), DOM nodes, live intervals and timeouts, rAF callbacks a second,
// long tasks (over 50 ms) since the last lap, page errors and console errors. A heap or node count that only climbs is a leak; intervals
// that only climb are timers started and never stopped.
//   BASE=<plain build> MINS=10 OUT=<file.json> node soak.js
const pw = require('playwright'), fs = require('fs');
const BASE = process.env.BASE, MINS = +(process.env.MINS || 10);
(async () => { const b = await pw.chromium.launch({ args: ['--enable-precise-memory-info', '--js-flags=--expose-gc', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 }); await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
  /* count the timers the game starts and stops, and the frames it asks for */
  await ctx.addInitScript(() => { const W = window; W.__soak = { iv: new Set(), to: new Set(), raf: 0, long: 0, longMs: 0 };
    const si = W.setInterval, ci = W.clearInterval, st = W.setTimeout, ct = W.clearTimeout, ra = W.requestAnimationFrame;
    W.setInterval = function () { const id = si.apply(this, arguments); W.__soak.iv.add(id); return id; }; W.clearInterval = function (id) { W.__soak.iv.delete(id); return ci.apply(this, arguments); };
    W.setTimeout = function (f, ms) { const args = [].slice.call(arguments); const id = st.call(this, function () { W.__soak.to.delete(id); if (typeof f === 'function') return f.apply(this, args.slice(2)); }, ms); W.__soak.to.add(id); return id; };
    W.clearTimeout = function (id) { W.__soak.to.delete(id); return ct.apply(this, arguments); };
    W.requestAnimationFrame = function (f) { W.__soak.raf++; return ra.call(this, f); };
    try { new PerformanceObserver((l) => l.getEntries().forEach((e) => { W.__soak.long++; W.__soak.longMs += e.duration; })).observe({ entryTypes: ['longtask'] }); } catch (e) {} });
  const p = await ctx.newPage(); const errs = [], cons = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 200))); p.on('console', (m) => { if (m.type() === 'error') cons.push(m.text().slice(0, 200)); });
  const cdp = await ctx.newCDPSession(p);
  await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && QBLoft.data, null, { timeout: 120000 }); await p.waitForTimeout(1500);
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S, A = x.ADDONS; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.cls = 'vanguard'; S.spec = 'berserker'; S.xp = x.cum(60); S.gates = [5, 10, 20, 30, 40, 50];
    S.coins = 500000; S.calm = false; S.tours = { welcome: 1, hideout: 1, train: 1, dq: 1, bty: 1, hall: 1, shop: 1 }; S.areaOn = { board: 1, train: 1, hideout: 1, shop: 1, hall: 1, players: 1, trophy: 1, wheel: 1, away: 1 }; /* a fresh save records its open areas at level 1; without this the Loft and Hall stay locked */
    S.base.slots = Object.keys(A).filter((t) => x.ROOMT[t]).map((t) => ({ t, a: Object.fromEntries((A[t] || []).filter((u) => !(u[3] && u[3].retired)).map((u) => [u[0], 1])), st: 0, pend: 0 }));
    x.SHOP.forEach((it) => { if (/^a_/.test(it[1])) S.owned[it[0]] = true; }); x.persist(); x.render(); });
  const shut = () => p.evaluate(() => { document.querySelectorAll('#layer .modal, .overlay, .dropsplash').forEach((m) => m.remove()); try { if (window.TOUR) TOUR.id = null; } catch (e) {} });
  const click = (sel) => p.evaluate((sel) => { const e = document.querySelector(sel); if (e) { e.dispatchEvent(new MouseEvent('click', { bubbles: true })); return true; } return false; }, sel);
  let __nb = 0; const lap = async () => { await shut();
    for (const v of ['board', 'train']) { await click(`.nav button[data-v="${v}"]`); await p.waitForTimeout(1500); await shut(); }
    await click('.nav button[data-v="hideout"]'); await p.waitForTimeout(2000); await shut();
    await click('[data-act="bldout"]'); await p.waitForTimeout(1200); await shut(); const nb = await p.evaluate(() => document.querySelectorAll('[data-act="bldgo"]').length); __nb = nb;
    for (let i = 0; i < nb; i++) { await p.evaluate((i) => { const g = document.querySelectorAll('[data-act="bldgo"]')[i]; if (g) g.dispatchEvent(new MouseEvent('click', { bubbles: true })); }, i); await p.waitForTimeout(2500); await shut();
      /* each room window in this building, for 2 s */
      const slots = await p.evaluate(() => { const x = window.__qb.x(); return x.S.base.slots.map((s, i) => i); });
      if (i === 0) for (const k of slots) { await p.evaluate((k) => { try { window.__qb.roomModal(k); } catch (e) {} }, k); await p.waitForTimeout(2000); await shut(); }
      await click('[data-act="bldout"]'); await p.waitForTimeout(1200); await shut(); } /* back to the street (the game remembers the building you were in) */
    await click('.nav button[data-v="hall"]'); await p.waitForTimeout(1500); await shut();
    for (const t of ['posts', 'chat', 'style']) { await click(`[data-act="htab"][data-t="${t}"]`); await p.waitForTimeout(1500); await shut(); }
    await click('.nav button[data-v="shop"]'); await p.waitForTimeout(1500); await shut();
    const floors = await p.evaluate(() => [...document.querySelectorAll('[data-act="stab"]')].map((e) => e.dataset.v));
    for (const f of floors) { await click(`[data-act="stab"][data-v="${f}"]`); await p.waitForTimeout(1500); await shut(); } };
  const sample = async (n) => { try { await cdp.send('HeapProfiler.collectGarbage'); } catch (e) {} await p.waitForTimeout(500);
    return p.evaluate((n) => { const W = window, s = W.__soak; const r = { lap: n, heapMB: performance.memory ? +(performance.memory.usedJSHeapSize / 1048576).toFixed(1) : null, nodes: document.getElementsByTagName('*').length,
      intervals: s.iv.size, timeouts: s.to.size, rafPerLap: s.raf, longTasks: s.long, longMs: Math.round(s.longMs), modals: document.querySelectorAll('#layer .modal').length, view: (document.body.className.match(/v-\w+/) || [''])[0] };
      s.raf = 0; s.long = 0; s.longMs = 0; return r; }, n); };
  const rows = [await sample(0)]; console.log(JSON.stringify(rows[0])); const t0 = Date.now(); let n = 0;
  while (Date.now() - t0 < MINS * 60000) { n++; await lap(); const r = await sample(n); r.buildings = __nb; r.errs = errs.length; r.consoleErrs = cons.length; r.min = +((Date.now() - t0) / 60000).toFixed(1); rows.push(r); console.log(JSON.stringify(r)); }
  fs.writeFileSync(process.env.OUT || 'soak.json', JSON.stringify({ rows, errs: [...new Set(errs)].slice(0, 20), consoleErrs: [...new Set(cons)].slice(0, 20) }, null, 1));
  console.log('page errors', errs.length, JSON.stringify([...new Set(errs)].slice(0, 5))); console.log('console errors', cons.length, JSON.stringify([...new Set(cons)].slice(0, 5))); await b.close(); })();
