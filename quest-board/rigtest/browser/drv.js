// Shared browser setup: a save with every room and every upgrade owned.
const { chromium } = require('playwright');
exports.open = async function ({ width = 1280, height = 900, body = 'm', full = true, mobile = false } = {}) {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext(mobile ? { viewport: { width, height }, deviceScaleFactor: 1, isMobile: true, hasTouch: true } : { viewport: { width, height }, deviceScaleFactor: +(process.env.DSF || 1) });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); });
  await p.goto('http://127.0.0.1:8765/dist/index.html');
  await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft, null, { timeout: 60000 });
  await p.waitForTimeout(800);
  await p.evaluate(({ body, full }) => {
    const x = window.__qb.x(), S = x.S;
    S.created = true;
    S.char = window.__qb.fixChar({ name: 'Cal', sex: body });
    S.gates = Array.from({ length: 200 }, (_, i) => i);
    S.xp = x.cum(60);
    S.coins = 999999;
    const order = ['bedroom', 'closet', 'lair', 'patio', 'gameroom', 'restaurant', 'skybar', 'rooftop', 'boba', 'dessert', 'speakeasy', 'garden', 'theater', 'auditorium', 'mall', 'bowling', 'karaoke', 'arcade', 'rhythm', 'vr', 'club'];
    S.base.slots = order.map((t) => ({ t, a: full ? Object.fromEntries((x.ADDONS[t] || []).map((u) => [u[0], 1])) : {}, st: 0, pend: 0 }));
    window.__order = order;
    x.render();
  }, { body, full });
  await p.waitForTimeout(500);
  return { b, p, errs };
};
