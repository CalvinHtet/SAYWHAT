// Where an idle screen spends the main thread (QA, Cal 11-23 platform check): a full save, phone size, CPU slowed (CPU=4), the screen VIEW
// left untouched for SECS; V8's sampling profiler (CDP) gives self time per function (file:line), plus what the page asks for: rAF
// callbacks a second, style recalcs and layouts (Performance metrics), and which CSS animations are running.
//   BASE=<plain build> VIEW=board|train|hideout|hall|shop SECS=10 CPU=4 node idleprof.js
const pw = require('playwright');
const BASE = process.env.BASE, VIEW = process.env.VIEW || 'board', SECS = +(process.env.SECS || 10);
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 }); await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
  await ctx.addInitScript(() => { window.__raf = 0; const ra = window.requestAnimationFrame; window.requestAnimationFrame = function (f) { window.__raf++; return ra.call(this, f); }; });
  const p = await ctx.newPage(); await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && QBLoft.data, null, { timeout: 120000 }); await p.waitForTimeout(1500);
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S, A = x.ADDONS; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.cls = 'vanguard'; S.spec = 'berserker'; S.xp = x.cum(60); S.gates = [5, 10, 20, 30, 40, 50];
    S.coins = 500000; S.calm = false; S.tours = { welcome: 1, hideout: 1, train: 1, dq: 1, bty: 1, hall: 1, shop: 1 }; S.areaOn = { board: 1, train: 1, hideout: 1, shop: 1, hall: 1, players: 1, trophy: 1, wheel: 1, away: 1 }; /* a fresh save records its open areas at level 1; without this the Loft and Hall stay locked */
    S.base.slots = Object.keys(A).filter((t) => x.ROOMT[t]).map((t) => ({ t, a: Object.fromEntries((A[t] || []).filter((u) => !(u[3] && u[3].retired)).map((u) => [u[0], 1])), st: 0, pend: 0 })); x.persist(); x.render(); });
  await p.waitForTimeout(1000); await p.evaluate((v) => { document.querySelectorAll('#layer .modal,.overlay,.dropsplash').forEach((m) => m.remove()); const n = document.querySelector(`.nav button[data-v="${v}"]`); if (n) n.dispatchEvent(new MouseEvent('click', { bubbles: true })); }, VIEW);
  await p.waitForTimeout(3000); await p.evaluate(() => document.querySelectorAll('#layer .modal,.overlay,.dropsplash').forEach((m) => m.remove()));
  const cdp = await ctx.newCDPSession(p); await cdp.send('Emulation.setCPUThrottlingRate', { rate: +(process.env.CPU || 4) }); await cdp.send('Performance.enable');
  const m0 = Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((m) => [m.name, m.value]));
  await p.evaluate(() => { window.__raf = 0; }); await cdp.send('Profiler.enable'); await cdp.send('Profiler.setSamplingInterval', { interval: 500 }); await cdp.send('Profiler.start');
  await p.waitForTimeout(SECS * 1000);
  const { profile } = await cdp.send('Profiler.stop'); const m1 = Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((m) => [m.name, m.value]));
  const raf = await p.evaluate(() => window.__raf);
  const anims = await p.evaluate(() => { const o = {}; document.getAnimations().forEach((a) => { const t = a.effect && a.effect.target; const k = (a.animationName || a.constructor.name) + ' @' + (t ? (t.id ? '#' + t.id : (t.className && t.className.baseVal != null ? t.className.baseVal : t.className) || t.tagName) : '?'); o[k] = (o[k] || 0) + 1; }); return Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, 12); });
  // self time per function
  const dt = profile.timeDeltas, byId = {}; profile.nodes.forEach((n) => { byId[n.id] = n; }); const self = {};
  profile.samples.forEach((id, i) => { const n = byId[id]; const cf = n.callFrame; const k = (cf.functionName || '(anon)') + ' ' + (cf.url ? cf.url.split('/').pop().split('?')[0] : '') + ':' + (cf.lineNumber + 1); self[k] = (self[k] || 0) + (dt[i] || 0) / 1000; });
  const total = Object.values(self).reduce((a, b) => a + b, 0); const top = Object.entries(self).sort((a, b) => b[1] - a[1]).slice(0, 14);
  console.log(`VIEW ${VIEW}: ${SECS}s at CPU x${process.env.CPU || 4}; rAF ${(raf / SECS).toFixed(1)}/s; script ${((m1.ScriptDuration - m0.ScriptDuration) * 1000).toFixed(0)} ms, style ${((m1.RecalcStyleDuration - m0.RecalcStyleDuration) * 1000).toFixed(0)} ms (${m1.RecalcStyleCount - m0.RecalcStyleCount}), layout ${((m1.LayoutDuration - m0.LayoutDuration) * 1000).toFixed(0)} ms (${m1.LayoutCount - m0.LayoutCount}), task ${((m1.TaskDuration - m0.TaskDuration) * 1000).toFixed(0)} ms`);
  console.log('running animations', JSON.stringify(anims).slice(0, 300));
  const detail = await p.evaluate(() => document.getAnimations().map((a) => { const t = a.effect && a.effect.target; const r = t && t.getBoundingClientRect ? t.getBoundingClientRect() : null; const cs = t ? getComputedStyle(t) : null;
    return { name: a.animationName || a.constructor.name, dur: a.effect && a.effect.getTiming ? a.effect.getTiming().duration : null, tag: t ? t.tagName : null, id: t && t.id, cls: t ? String(t.className && t.className.baseVal != null ? t.className.baseVal : t.className).slice(0, 60) : null, size: r ? Math.round(r.width) + 'x' + Math.round(r.height) : null, visible: !!(r && r.width && r.height && cs.visibility !== 'hidden' && cs.display !== 'none'), prop: a.effect && a.effect.getKeyframes ? Object.keys(a.effect.getKeyframes()[0] || {}).filter((k) => !['offset', 'easing', 'composite', 'computedOffset'].includes(k)).join(',') : '' }; }));
  console.log('animations in detail (' + detail.length + '):'); detail.slice(0, 25).forEach((d) => console.log('  ' + JSON.stringify(d)));
  top.forEach(([k, v]) => console.log('  ' + v.toFixed(0).padStart(6) + ' ms  ' + (100 * v / total).toFixed(1).padStart(5) + '%  ' + k.slice(0, 120)));
  await b.close(); })();
