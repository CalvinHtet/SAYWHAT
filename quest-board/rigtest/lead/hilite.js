// Cal 11-23 "allow for highlights in the hair as well": the Stylist sells "<colour> Highlights" (slot a_hairhi) for both bodies; worn, the
// look carries hairHi and QBLook draws ROOMS's streak layer, tinted; off, no layer. A Shop screenshot with pink highlights on.
//   PORT=<build> NODE_PATH=<playwright's parent> OUT=<dir> node rigtest/lead/hilite.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8779, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x, null, { timeout: 90000 }); await p.waitForTimeout(800);
  await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' });
  for (const sex of ['m', 'f']) {
    const r = await p.evaluate((sex) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex }); S.xp = x.cum(12); S.gates = Array.from({ length: 200 }, (_, i) => i); S.areaOn = { board: 1, shop: 1, hideout: 1 }; S.calm = false; S.coins = 9000; S.owned = S.owned || {}; S.eq = S.eq || {};
      window.__qbRooms.open('closet', 1); const items = x.SHOP.filter((q) => q[1] === 'a_hairhi').map((q) => q[2]);
      delete S.eq.a_hairhi; const L0 = window.__qb.lookOf(); S.owned.bs_hi_pink = true; S.eq.a_hairhi = 'bs_hi_pink'; const L1 = window.__qb.lookOf();
      const B = (L) => { const D = window.QBLoft.data; const o = window.QBLook.build(D.creator, L.rig); return !!o.layers.hairHi; };
      return { items, off: [L0.rig.hairHi || null, B(L0)], on: [L1.rig.hairHi || null, B(L1)] }; }, sex);
    ok(r.items.length === 10, sex + ': 10 highlight colours on sale (' + r.items.slice(0, 3).join(', ') + ' ...)');
    ok(!r.off[0] && !r.off[1], sex + ': none worn, no streak layer');
    ok(r.on[0] === 'pink' && r.on[1], sex + ': Pink Highlights worn, the look has hairHi pink and the streak layer ' + JSON.stringify(r.on));
  }
  await p.evaluate(() => { document.querySelectorAll('#layer .modal,.dropsplash,.bsplash').forEach((m) => m.remove()); window.__qb.x().render(); document.querySelector('.nav button[data-v="shop"]').click(); }); await p.waitForTimeout(900);
  await p.evaluate(() => { document.querySelectorAll('#layer .modal,.dropsplash,.bsplash').forEach((m) => m.remove()); const t = document.querySelector('[data-act="stab"][data-v="basics"]'); t && t.click(); }); await p.waitForTimeout(1200);
  const h = await p.evaluate(() => { document.querySelectorAll('#layer .modal,.dropsplash,.bsplash').forEach((m) => m.remove()); const hs = [...document.querySelectorAll('h3')].map((e) => e.textContent); const hi = [...document.querySelectorAll('h3')].find((e) => /Highlights/.test(e.textContent)); if (hi) hi.scrollIntoView(); return hs; });
  ok(h.some((t) => /Highlights/.test(t)), 'the Stylist has a Highlights section: ' + h.join(' | '));
  await p.waitForTimeout(800); await p.screenshot({ path: OUT + '/hilite_stylist.png' });
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
