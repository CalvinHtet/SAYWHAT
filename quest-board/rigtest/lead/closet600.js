// Cal 11-23: "Make it 600 coins so that the shop can be unlocked sooner." The Walk-in Closet costs 600 after every price pass (load, the
// first simulate, a garden sale's re-pricing), and a new player who owns a few cheap pieces and the Figurine Cabinet is offered it at 600.
//   PORT=<build> NODE_PATH=<playwright's parent> node rigtest/lead/closet600.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8779; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x, null, { timeout: 90000 }); await p.waitForTimeout(800);
  const price = () => p.evaluate(() => window.__qb.x().ADDONS.bedroom.find((a) => a[0] === 'bd_ward2')[2]);
  ok(await price() === 600, 'at load: ' + await price());
  const r = await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(3); S.gates = [5]; S.coins = 700; S.calm = false;
    const i = S.base.slots.findIndex((q) => q && q.t === 'bedroom'), rm = S.base.slots[i]; rm.a = { bd_rug: 1, bd_plant: 1, bd_art2: 1, bd_art3: 1, bd_clock: 1, bd_ward1: 1 }; try { x.simulate(); } catch (e) {} x.render();
    window.__qb.roomModal(i); const card = [...document.querySelectorAll('#layer .modal .addon')].find((d) => /Walk-in Closet/.test(d.textContent)); const t = card ? card.textContent.replace(/\s+/g, ' ').slice(0, 140) : null;
    document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); return t; });
  ok(r && /600/.test(r) && !/Needs/.test(r), 'offered in the Bedroom window at 600: ' + r);
  await p.waitForTimeout(3000); ok(await price() === 600, 'after the first simulate: ' + await price());
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
