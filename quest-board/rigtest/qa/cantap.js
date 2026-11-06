// The watering can's tap area (ROOMS's e415c00): on desktop and a 390 px phone, at each Garden stage, the size of the can's
// button, and a real tap on the can itself and one 15 px beside it both water the dry beds.
//   node cantap.js
const { open } = require('./lib.js');
(async () => {
  const fails = [], oks = [], t = (c, m) => (c ? oks : fails).push(m);
  for (const mobile of [false, true]) {
    const { b, p, errs } = await open({ width: mobile ? 390 : 1000, height: mobile ? 844 : 900, owned: 'none', mobile });
    for (const [name, a] of [['Back Plot', {}], ['Kitchen Garden', { g_x1: 1 }], ['Estate', { g_x1: 1, g_x2: 1 }]]) {
      for (const off of [0, 15]) {
        const g = await p.evaluate(async (a) => { const S = window.__qb.x().S, w = (ms) => new Promise((o) => setTimeout(o, ms));
          S.base.slots = S.base.slots.filter((s) => s.t !== 'garden'); S.base.slots.push({ t: 'garden', a, st: 0, pend: 0 }); S.base.gwater = Date.now() - 1000;
          document.querySelectorAll('#layer .modal').forEach((e) => e.remove()); window.__qb.roomModal(S.base.slots.length - 1); await w(800);
          const el = document.querySelector('.rmodal svg g[data-act="gdwater"]'); const r = el.getBoundingClientRect(); const img = el.querySelector('image'); const ir = img ? img.getBoundingClientRect() : r;
          return { w: r.width, h: r.height, iw: ir.width, ih: ir.height, x: ir.left + ir.width / 2, y: ir.top + ir.height / 2 }; }, a);
        await p.mouse.click(g.x + off, g.y); await p.waitForTimeout(700);
        const wet = await p.evaluate(() => window.gdWatered());
        t(wet, `${mobile ? 'phone' : 'desktop'}, ${name}: button ${Math.round(g.w)}x${Math.round(g.h)} px (can ${Math.round(g.iw)}x${Math.round(g.ih)}), a tap ${off ? off + ' px beside the can' : 'on the can'} waters: ${wet}`);
      }
    }
    if (errs.length) fails.push('page errors ' + errs.slice(0, 2).join(' | '));
    await b.close();
  }
  oks.forEach((m) => console.log('  ok   ' + m)); fails.forEach((m) => console.log('  FAIL ' + m));
})();
