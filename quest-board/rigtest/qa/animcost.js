// What the idle Board's CSS animations cost (QA, Cal 11-23 platform check): frames a second and the worst frame over SECS on the Board
// (full save, phone, CPU x4), (a) as shipped, (b) with the animations that cannot run on the compositor paused (background-position,
// outline: they restyle and repaint every frame), (c) with every animation paused. A big gain from (b) means those few are worth changing.
//   BASE=<plain build> SECS=6 node animcost.js
const pw = require('playwright');
const BASE = process.env.BASE, SECS = +(process.env.SECS || 6);
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 }); await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
  const p = await ctx.newPage(); await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && QBLoft.data, null, { timeout: 120000 }); await p.waitForTimeout(1500);
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S, A = x.ADDONS; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.cls = 'vanguard'; S.spec = 'berserker'; S.xp = x.cum(60); S.gates = [5, 10, 20, 30, 40, 50];
    S.coins = 500000; S.calm = false; S.tours = { welcome: 1, hideout: 1, train: 1, dq: 1, bty: 1, hall: 1, shop: 1 }; S.areaOn = { board: 1, train: 1, hideout: 1, shop: 1, hall: 1, players: 1, trophy: 1, wheel: 1, away: 1 }; /* a fresh save records its open areas at level 1; without this the Loft and Hall stay locked */
    S.base.slots = Object.keys(A).filter((t) => x.ROOMT[t]).map((t) => ({ t, a: Object.fromEntries((A[t] || []).filter((u) => !(u[3] && u[3].retired)).map((u) => [u[0], 1])), st: 0, pend: 0 })); x.persist(); x.render(); });
  await p.waitForTimeout(9000); await p.evaluate(() => document.querySelectorAll('#layer .modal,.overlay,.dropsplash').forEach((m) => m.remove()));
  const cdp = await ctx.newCDPSession(p); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  const fps = () => p.evaluate((secs) => new Promise((ok) => { let n = 0, worst = 0, last = performance.now(); const t0 = last; const f = (t) => { n++; worst = Math.max(worst, t - last); last = t; if (t - t0 < secs * 1000) requestAnimationFrame(f); else ok({ fps: +(n / secs).toFixed(1), worst: Math.round(worst) }); }; requestAnimationFrame(f); }), SECS);
  const list = await p.evaluate(() => document.getAnimations().map((a) => { const k = a.effect && a.effect.getKeyframes ? Object.keys(a.effect.getKeyframes()[0] || {}) : []; return a.animationName + ':' + k.filter((x) => !['offset', 'easing', 'composite', 'computedOffset'].includes(x)).join('+'); }));
  console.log('running', list.length, JSON.stringify(list));
  console.log('(a) as shipped          ', JSON.stringify(await fps()));
  await p.evaluate(() => document.getAnimations().forEach((a) => { const k = a.effect && a.effect.getKeyframes ? Object.keys(a.effect.getKeyframes()[0] || {}) : []; if (k.some((x) => /background|outline|width|height|top|left|box-shadow|boxShadow|filter/i.test(x))) a.pause(); }));
  console.log('(b) repainting ones off ', JSON.stringify(await fps()));
  await p.evaluate(() => document.getAnimations().forEach((a) => a.pause()));
  console.log('(c) all paused          ', JSON.stringify(await fps()));
  await b.close(); })();
