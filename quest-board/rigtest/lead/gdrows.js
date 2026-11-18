// GILDED, the Boutique brand in CHROME RAIN's slot (Cal 11-18; ROOMS 581c6cd, QA 44b960b), on the plain build (PORT) against the last
// release (REF): every floor 11-10 .. 11-22 as in the last release; GILDED never live before Mon 11-23 and live on the Boutique within 16
// weeks after; on a day it is live: its 15 rows have ROOMS's names and lines, prices inside their grade's Boutique band (premium 800-1,050,
// luxury 1,050-1,200), art (front, back unless front-only, icon; f_ for women-only), and its tab lists all 15. No page errors.
//   PORT=<plain build> REF=<last release build> NODE_PATH=<playwright's parent> node rigtest/lead/gdrows.js
const { chromium } = require('playwright');
let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
const base = 'http://127.0.0.1:' + (process.env.PORT || 8779), ref = 'http://127.0.0.1:' + (process.env.REF || 8839);
// ROOMS's rows (shots/pending_art/brands1118/gilded_rows.json, not committed), copied here so a clean checkout can run this
const ROWS = [
  ["gx_gd_cap", "a_hat", "Gold-Leaf Quilted Cap", 950, 1, "Black channel-quilted leather, gold leaf embroidery, ivory under-brim.", {"gar": "gd_cap", "b": "gd"}],
  ["gx_gd_beret", "a_hat", "Brooch Velvet Beret", 950, 1, "Black velvet, gold bullion fringe, a sapphire leaf brooch.", {"gar": "gd_beret", "b": "gd"}],
  ["gx_gd_wreath", "a_hat", "Gilded Leaf Crown", 1100, 1, "Chunky antique-gold leaves, sapphire berries.", {"gar": "gd_wreath", "b": "gd"}],
  ["gx_gd_scarf", "a_acc", "Brocade Neck Scarf", 950, 1, "Ivory silk woven with gold leaf, knotted at the throat.", {"gar": "gd_scarf", "b": "gd"}],
  ["gx_gd_cuffs", "a_acc", "Leaf-Filigree Cuffs", 1000, 1, "Wide antique-gold cuffs, pierced leaves, a sapphire each.", {"gar": "gd_cuffs", "b": "gd"}],
  ["gx_gd_bomber", "a_top", "Gold-Brocade Bomber", 1900, 1, "Black satin woven with gold leaf, ivory ribs, a gilt zip.", {"gar": "gd_bomber", "b": "gd"}],
  ["gx_gd_shirt", "a_top", "Pearl-Button Silk Shirt", 1700, 1, "Black silk, pearl buttons, gold cuffs, an ivory lace jabot.", {"gar": "gd_shirt", "b": "gd"}],
  ["gx_gd_frock", "a_top", "Frock-Coat Hoodie", 1900, 1, "Long black hooded coat, off-centre gilt zip, gold leaf hem.", {"gar": "gd_frock", "b": "gd"}],
  ["gx_gd_bustier", "a_top", "Brocade Bustier", 1700, 1, "Ivory-and-gold brocade, boned, black lace edge, chain straps.", {"gar": "gd_bustier", "b": "gd", "fo": 1}],
  ["gx_gd_jogger", "a_pants", "Jacquard Joggers", 1500, 1, "Black jacquard with a gold leaf weave, gilt piping, ivory cuffs.", {"gar": "gd_jogger", "b": "gd"}],
  ["gx_gd_cargo", "a_pants", "Gilt-Pocket Twill Cargos", 1450, 1, "Black twill, gold leaf on every flap, gilt snaps.", {"gar": "gd_cargo", "b": "gd"}],
  ["gx_gd_skirt", "a_pants", "Brocade Box-Pleat Skirt", 1500, 1, "Ivory-and-gold brocade, knee length, deep pleats, a gilt clasp.", {"gar": "gd_skirt", "b": "gd", "fo": 1}],
  ["gx_gd_loafer", "a_shoes", "Brocade Pointed Loafers", 1600, 1, "Ivory-and-gold brocade, black patent toes, a gilt bar.", {"gar": "gd_loafer", "b": "gd"}],
  ["gx_gd_hightop", "a_shoes", "Gilt-Cap High-Tops", 1700, 1, "Black leather, sculpted gold toe caps, gold laces.", {"gar": "gd_hightop", "b": "gd"}],
  ["gx_gd_mule", "a_shoes", "Sculpted-Heel Mules", 1700, 1, "Black satin, a sculpted gold stiletto, worn on tiptoe.", {"gar": "gd_mule", "b": "gd", "fo": 1}]];
const LUX = 'gx_gd_wreath gx_gd_cuffs gx_gd_bustier gx_gd_bomber gx_gd_frock gx_gd_hightop gx_gd_mule'.split(' ');
const band = (id) => (LUX.includes(id) ? [1050, 1200] : [800, 1050]);
const page = async (b, url) => { const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); p.errs = []; p.on('pageerror', (e) => p.errs.push(e.message.slice(0, 150)));
  await p.goto(url + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbDrops && window.QBLoft && QBLoft.data, null, { timeout: 90000 }); await p.waitForTimeout(800); return p; };
const live = (p, from, n) => p.evaluate(([from, n]) => { const o = []; for (let d = 0; d < n; d++) { const t = new Date(2026, 10, from + d, 10, 0).getTime(), r = {};
  for (const fl of ['street', 'boutique', 'atelier']) { const f = window.__qbDrops.floor(fl, t); r[fl] = ((f && f.live) || []).map((q) => q.id).sort().join(','); } o.push(r); } return o; }, [from, n]);
(async () => { const b = await chromium.launch({ args: ['--mute-audio'] }); const P = await page(b, base), R = await page(b, ref);
  const a = await live(P, 10, 13), r = await live(R, 10, 13);
  ok(JSON.stringify(a) === JSON.stringify(r), 'every floor 11-10 .. 11-22 is as in the last release ' + JSON.stringify(a.map((o) => o.boutique)));
  const f = await live(P, 10, 13 + 112), first = f.findIndex((o) => o.boutique.split(',').includes('gd')), on = new Date(2026, 10, 10 + first).toDateString();
  ok(first >= 13, 'GILDED first live on the Boutique on ' + on + ' (not before Mon 11-23)');
  const s = await P.evaluate(async ([day, ids]) => { const x = window.__qb.x(), S = x.S; const real = Date.now() - (window.__qbShift || 0); window.__qbShift = new Date(2026, 10, day, 10, 0).getTime() - real;
    S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'f' }); S.xp = x.cum(35); S.gates = Array.from({ length: 200 }, (_, i) => i); S.calm = false; S.fsall = 1; S.areaOn = { board: 1, shop: 1, hideout: 1 }; S.owned = {}; window.__qbRooms.open('closet', 1); x.render();
    const rows = {}; ids.forEach((id) => { const it = x.SHOP.find((q) => q[0] === id); rows[id] = it ? { n: it[2], p: it[3], line: it[5], slot: it[1], item: !!QBLoft.data.items[it[6].gar], front: !!(QBLoft.data.items[it[6].gar] || {}).frontOnly } : null; });
    const clear = () => document.querySelectorAll('#layer .modal,.dropsplash,.bsplash').forEach((m) => m.remove()); document.querySelector('.nav button[data-v="shop"]').click(); for (let i = 0; i < 4; i++) { await new Promise((o) => setTimeout(o, 900)); clear(); }
    const fl = document.querySelector('[data-qsfl="boutique"]'); if (fl) { fl.click(); await new Promise((o) => setTimeout(o, 800)); clear(); }
    const t = document.querySelector('[data-act="stab"][data-v="gd"]'); let cards = []; if (t) { t.click(); await new Promise((o) => setTimeout(o, 900)); clear(); cards = [...document.querySelectorAll('.qs-rack [data-card]')].map((e) => e.dataset.card); }
    return { rows, cards }; }, [10 + first, ROWS.map((q) => q[0])]);
  for (const w of ROWS) { const g = s.rows[w[0]], bd = band(w[0]);
    ok(g && g.n === w[2] && g.line === w[5] && g.slot === w[1] && g.item && g.p >= bd[0] && g.p <= bd[1] && s.cards.includes(w[0]), `${w[0]}: ${g && g.n}, ${g && g.p} coins (${bd.join('-')}), on the tab`);
    const sx = w[6].fo ? 'f_' : 'm_'; for (const fn of [sx + w[6].gar + '_front', 'icon_' + w[6].gar].concat(g && g.front ? [] : [sx + w[6].gar + '_back'])) { const st = await P.request.get(base + '/art/app/' + fn + '.webp'); if (st.status() !== 200) ok(false, `  ${fn} ${st.status()}`); } }
  ok(s.cards.length === 15, 'its tab lists all 15 on ' + on);
  ok(!P.errs.length && !R.errs.length, 'no page errors ' + JSON.stringify(P.errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
