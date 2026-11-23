// Cal 11-23: 4 starting hairstyles per body in the creator (his Tousled, Buzz, Long, Bun; hers Long, Bob, Ponytail, Wavy), and the
// Stylist adds a combover and wolf cuts (ROOMS's art: m_h4-h7, f_h4-h5). Checks: each body has exactly 4 creator styles with art; every
// style has its Stylist cut on sale with an icon; the Stylist-only cuts are not in the creator; 0 page errors.
//   PORT=<build> NODE_PATH=<playwright's parent> node rigtest/lead/hair133.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8779; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch(); const p = await (await b.newContext()).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBDATA, null, { timeout: 90000 }); await p.waitForTimeout(800);
  const r = await p.evaluate(() => { const D = window.QBDATA.creator, G = window.QBDATA, A = window.QBART || {}, has = (f) => !!(A[f] || (G.arthash && G.arthash[f]));
    const out = {}; ['m', 'f'].forEach((bd) => { const L = D.hairStyles[bd]; out[bd] = { creator: L.filter((o) => !o.stylistOnly && has(bd + '_' + o.id + '_front.webp')).map((o) => o.label), stylist: L.map((o) => { const it = window.__qb.x().SHOP.find((q) => q[0] === 'bs_hair_' + bd + '_' + o.id); return o.label + (it ? '' : ' (NOT SOLD)') + (has('icon_basic_' + bd + '_' + o.id + '.webp') ? '' : ' (NO ICON)'); }) }; }); return out; });
  console.log(JSON.stringify(r));
  ok(r.m.creator.join() === 'Tousled,Buzz Cut,Long,Man Bun', 'his creator styles: ' + r.m.creator.join(', '));
  ok(r.f.creator.join() === 'Long,Bob,Ponytail,Wavy', 'her creator styles: ' + r.f.creator.join(', '));
  ok(['m', 'f'].every((bd) => r[bd].stylist.every((s) => !/NOT SOLD|NO ICON/.test(s))), 'every style is a Stylist cut with an icon');
  ok(r.m.stylist.some((s) => /^Combover/.test(s)) && r.m.stylist.some((s) => /^Wolf Cut/.test(s)) && r.f.stylist.some((s) => /^Wolf Cut/.test(s)), 'Combover and both Wolf Cuts are in the Stylist');
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
