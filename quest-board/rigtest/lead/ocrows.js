// OIL & CANVAS, the second new Boutique brand (Cal 11-18 "Approve OIL & CANVAS"; ROOMS f041b24 4c60022, QA 87b5dd0), on the plain build
// (PORT) against the last release (REF, v1.25): every floor 11-10 .. 11-22 as in the last release; OIL & CANVAS never live before Thu 11-26
// (GILDED keeps 11-23) and live on the Boutique within 16 weeks after; on a day it is live: its 15 rows have ROOMS's names and lines, prices inside their grade's
// Boutique band (premium 800-1,050, luxury 1,050-1,200), art (front, back unless front-only, icon; f_ for women-only), and its tab lists
// all 15. No page errors.
//   PORT=<plain build> REF=<last release build> NODE_PATH=<playwright's parent> node rigtest/lead/ocrows.js
const { chromium } = require('playwright');
let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
const base = 'http://127.0.0.1:' + (process.env.PORT || 8779), ref = 'http://127.0.0.1:' + (process.env.REF || 8839);
// ROOMS's rows (shots/pending_art/brands1118/gilded_rows.json, not committed), copied here so a clean checkout can run this
const ROWS = [
  ["gx_oc_cap", "a_hat", "Finger-Swipe Studio Cap", 950, 1, "Cream cotton, finger-wiped cadmium smears, an indigo brim.", {"gar": "oc_cap", "b": "oc"}],
  ["gx_oc_felt", "a_hat", "Dipped-Brim Felt Hat", 1100, 1, "Cream felt, indigo-dipped brim, cadmium drips, a brush in the band.", {"gar": "oc_felt", "b": "oc"}],
  ["gx_oc_roll", "a_acc", "Brush Roll Sling", 1000, 1, "Canvas brush roll across the body, worn handles, stained strap.", {"gar": "oc_roll", "b": "oc"}],
  ["gx_oc_palette", "a_acc", "Palette Pendant", 950, 1, "A small carved palette charm on a waxed cord, four paint dots.", {"gar": "oc_palette", "b": "oc"}],
  ["gx_oc_gloves", "a_acc", "Paint-Stained Leather Gloves", 950, 1, "Fitted cream fingerless leather, orange-stained tips, indigo strap.", {"gar": "oc_gloves", "b": "oc"}],
  ["gx_oc_denim", "a_top", "Hand-Painted Denim Jacket", 1900, 1, "Indigo denim, cadmium brush sweeps across the back, copper buttons.", {"gar": "oc_denim", "b": "oc"}],
  ["gx_oc_coat", "a_top", "Patchwork Studio Coat", 1900, 1, "Cream canvas offcuts, indigo running stitch, a brush in the pocket.", {"gar": "oc_coat", "b": "oc"}],
  ["gx_oc_smock", "a_top", "Drip Smock Shirt", 1700, 1, "Oversized cream smock, open chest, cadmium and cobalt drips.", {"gar": "oc_smock", "b": "oc"}],
  ["gx_oc_halter", "a_top", "Paint-Drip Halter", 1700, 1, "Cream linen halter, drips from the neckline, an open back.", {"gar": "oc_halter", "b": "oc", "fo": 1}],
  ["gx_oc_trouser", "a_pants", "Splattered Wide Trousers", 1500, 1, "Cream wide-leg linen, splatter, a palette knife on the belt loop.", {"gar": "oc_trouser", "b": "oc"}],
  ["gx_oc_jean", "a_pants", "Gesso-Dipped Jeans", 1500, 1, "Raw indigo dipped in cream gesso, cadmium drips below.", {"gar": "oc_jean", "b": "oc"}],
  ["gx_oc_skirt", "a_pants", "Brushstroke Wrap Skirt", 1500, 1, "Cream canvas wrap, an indigo stroke at the hem, a side slit.", {"gar": "oc_skirt", "b": "oc", "fo": 1}],
  ["gx_oc_boot", "a_shoes", "Gesso Studio Boots", 1700, 1, "Cream canvas lace-ups crusted in gesso, cadmium flecks.", {"gar": "oc_boot", "b": "oc"}],
  ["gx_oc_derby", "a_shoes", "Splatter Suede Derbies", 1600, 1, "Indigo suede, cream splatter, cadmium-red laces.", {"gar": "oc_derby", "b": "oc"}],
  ["gx_oc_sling", "a_shoes", "Brushstroke Slingbacks", 1700, 1, "Cream slingbacks, a cadmium stroke over the toe, indigo heel.", {"gar": "oc_sling", "b": "oc", "fo": 1}]];
const LUX = 'gx_oc_felt gx_oc_denim gx_oc_coat gx_oc_smock gx_oc_halter gx_oc_boot gx_oc_sling'.split(' ');
const band = (id) => (LUX.includes(id) ? [1050, 1200] : [800, 1050]);
const page = async (b, url) => { const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); p.errs = []; p.on('pageerror', (e) => p.errs.push(e.message.slice(0, 150)));
  await p.goto(url + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbDrops && window.QBLoft && QBLoft.data, null, { timeout: 90000 }); await p.waitForTimeout(800); return p; };
const live = (p, from, n) => p.evaluate(([from, n]) => { const o = []; for (let d = 0; d < n; d++) { const t = new Date(2026, 10, from + d, 10, 0).getTime(), r = {};
  for (const fl of ['street', 'boutique', 'atelier']) { const f = window.__qbDrops.floor(fl, t); r[fl] = ((f && f.live) || []).map((q) => q.id).sort().join(','); } o.push(r); } return o; }, [from, n]);
(async () => { const b = await chromium.launch({ args: ['--mute-audio'] }); const P = await page(b, base), R = await page(b, ref);
  const a = await live(P, 10, 13), r = await live(R, 10, 13);
  ok(JSON.stringify(a) === JSON.stringify(r), 'every floor 11-10 .. 11-22 is as in the last release ' + JSON.stringify(a.map((o) => o.boutique)));
  const f = await live(P, 10, 13 + 112), first = f.findIndex((o) => o.boutique.split(',').includes('oc')), on = new Date(2026, 10, 10 + first).toDateString();
  ok(first >= 16, 'OIL & CANVAS first live on the Boutique on ' + on + ' (not before Thu 11-26)');
  const s = await P.evaluate(async ([day, ids]) => { const x = window.__qb.x(), S = x.S; const real = Date.now() - (window.__qbShift || 0); window.__qbShift = new Date(2026, 10, day, 10, 0).getTime() - real;
    S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'f' }); S.xp = x.cum(35); S.gates = Array.from({ length: 200 }, (_, i) => i); S.calm = false; S.fsall = 1; S.areaOn = { board: 1, shop: 1, hideout: 1 }; S.owned = {}; window.__qbRooms.open('closet', 1); x.render();
    const rows = {}; ids.forEach((id) => { const it = x.SHOP.find((q) => q[0] === id); rows[id] = it ? { n: it[2], p: it[3], line: it[5], slot: it[1], item: !!QBLoft.data.items[it[6].gar], front: !!(QBLoft.data.items[it[6].gar] || {}).frontOnly } : null; });
    const clear = () => document.querySelectorAll('#layer .modal,.dropsplash,.bsplash').forEach((m) => m.remove()); document.querySelector('.nav button[data-v="shop"]').click(); for (let i = 0; i < 4; i++) { await new Promise((o) => setTimeout(o, 900)); clear(); }
    const fl = document.querySelector('[data-qsfl="boutique"]'); if (fl) { fl.click(); await new Promise((o) => setTimeout(o, 800)); clear(); }
    const t = document.querySelector('[data-act="stab"][data-v="oc"]'); let cards = []; if (t) { t.click(); await new Promise((o) => setTimeout(o, 900)); clear(); cards = [...document.querySelectorAll('.qs-rack [data-card]')].map((e) => e.dataset.card); }
    return { rows, cards }; }, [10 + first, ROWS.map((q) => q[0])]);
  for (const w of ROWS) { const g = s.rows[w[0]], bd = band(w[0]);
    ok(g && g.n === w[2] && g.line === w[5] && g.slot === w[1] && g.item && g.p >= bd[0] && g.p <= bd[1] && s.cards.includes(w[0]), `${w[0]}: ${g && g.n}, ${g && g.p} coins (${bd.join('-')}), on the tab`);
    const sx = w[6].fo ? 'f_' : 'm_'; for (const fn of [sx + w[6].gar + '_front', 'icon_' + w[6].gar].concat(g && g.front ? [] : [sx + w[6].gar + '_back'])) { const st = await P.request.get(base + '/art/app/' + fn + '.webp'); if (st.status() !== 200) ok(false, `  ${fn} ${st.status()}`); } }
  ok(s.cards.length === 15, 'its tab lists all 15 on ' + on);
  ok(!P.errs.length && !R.errs.length, 'no page errors ' + JSON.stringify(P.errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
