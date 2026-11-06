// The Garden's produce stands as buttons (73e48c3): a real mouse tap on a stand in the Garden window sells the produce once
// (coins go up by the sale, the produce goes to 0), a second tap right after sells nothing more, and both stands work.
//   node standtap.js
const { open } = require('./lib.js');
(async () => {
  const { b, p, errs } = await open({ width: 1000, height: 900, owned: 'none' });
  const fails = [], oks = [], t = (c, m) => (c ? oks : fails).push(m);
  for (const [lab, a] of [['Back Plot, crate stand', {}], ['Kitchen Garden, Farm Stand', { g_x1: 1, g_stand: 1 }]]) {
    const ids = await p.evaluate(async (a) => { const S = window.__qb.x().S, w = (ms) => new Promise((o) => setTimeout(o, ms));
      S.base.slots = S.base.slots.filter((s) => s.t !== 'garden'); S.base.slots.push({ t: 'garden', a: Object.assign({}, a), st: 0, pend: 0 });
      S.base.food = S.base.food || {}; S.base.food.veg = 40; document.querySelectorAll('#layer .modal,.dropsplash').forEach((e) => e.remove());
      window.__qb.roomModal(S.base.slots.length - 1); await w(800);
      return [...document.querySelectorAll('.rmodal svg g[data-act]')].map((g) => { const r = g.getBoundingClientRect(); const pic = g.closest("svg").getBoundingClientRect(); const bot = Math.min(r.bottom, pic.bottom); return { act: g.dataset.act, x: r.left + r.width / 2, y: (r.top + bot) / 2, w: r.width, cut: Math.round(Math.max(0, r.bottom - pic.bottom) / r.height * 100) }; }).filter((g) => g.act === 'stysell'); }, a);
    t(ids.length > 0, `${lab}: tappable sprites ${JSON.stringify(ids.map((g) => g.act + "@" + Math.round(g.x) + "," + Math.round(g.y) + " w" + Math.round(g.w) + (g.cut ? " (" + g.cut + "% below the picture)" : "")))}`);
    for (const g of ids) { const top = await p.evaluate(({ x, y }) => { const e = document.elementFromPoint(x, y); return e ? e.tagName + "." + (e.getAttribute("class") || "") + (e.closest("g[data-act]") ? " in g[" + e.closest("g[data-act]").dataset.act + "]" : "") : "none"; }, g); console.log("  top element at " + lab + ": " + top); }
    for (const g of ids) {
      const c0 = await p.evaluate(() => [window.__qb.x().S.coins, window.__qb.x().S.base.food.veg]);
      await p.mouse.click(g.x, g.y); await p.waitForTimeout(700);
      const c1 = await p.evaluate(() => [window.__qb.x().S.coins, window.__qb.x().S.base.food.veg]);
      await p.mouse.click(g.x, g.y); await p.waitForTimeout(700);
      const c2 = await p.evaluate(() => [window.__qb.x().S.coins, window.__qb.x().S.base.food.veg]);
      t(c1[0] > c0[0] && c1[1] < c0[1], `${lab}, ${g.act}: first tap sold (coins ${c0[0]} -> ${c1[0]}, produce ${c0[1]} -> ${c1[1]})`);
      t(c2[0] === c1[0], `${lab}, ${g.act}: second tap sold nothing more (coins ${c2[0]}, produce ${c2[1]})`);
      await p.evaluate(() => { window.__qb.x().S.base.food.veg = 40; });
    }
  }
  oks.forEach((m) => console.log('  ok   ' + m)); fails.forEach((m) => console.log('  FAIL ' + m));
  console.log('page errors', errs.length, errs.slice(0, 3));
  await b.close();
})();
