// REGIMENT, the third new Boutique brand (ROOMS 21c67e7 b1fa777, QA 806a9bf), held until Cal approves its painted sheet. On the plain build
// (PORT) against the last release (REF, v1.26): every floor from 11-10 for 16 weeks is as in the last release (the hold changes nothing).
// Then, with the hold lifted in the page only: REGIMENT goes live on the Boutique; on that day its 15 rows have ROOMS's names and lines,
// prices inside their grade's Boutique band (premium 800-1,050, luxury 1,050-1,200), art (front, back unless front-only, icon; f_ for
// women-only), and its tab lists all 15 for either body (SEX=f|m). No page errors.
//   PORT=<plain build> REF=<last release build> SEX=f|m NODE_PATH=<playwright's parent> node rigtest/lead/rgrows.js
const { chromium } = require('playwright');
const SEX = process.env.SEX || 'f'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
const base = 'http://127.0.0.1:' + (process.env.PORT || 8779), ref = 'http://127.0.0.1:' + (process.env.REF || 8839);
// ROOMS's rows (shots/pending_art/brands1118/gilded_rows.json, not committed), copied here so a clean checkout can run this
const ROWS = [
  ["gx_rg_cap", "a_hat", "Cord Peaked Cap", 1100, 1, "Navy wool, scarlet band, brass chin cord, a knot crest.", {"gar": "rg_cap", "b": "rg"}],
  ["gx_rg_side", "a_hat", "Piped Side Cap", 950, 1, "Navy side cap worn tilted, scarlet piping, brass buttons.", {"gar": "rg_side", "b": "rg"}],
  ["gx_rg_cord", "a_acc", "Brass Aiguillette", 1000, 1, "Looped brass cords from a scarlet shoulder knot.", {"gar": "rg_cord", "b": "rg"}],
  ["gx_rg_sash", "a_acc", "Scarlet Parade Sash", 950, 1, "Scarlet silk across the body, domed buckle, brass fringe.", {"gar": "rg_sash", "b": "rg"}],
  ["gx_rg_gloves", "a_acc", "Gauntlet Gloves", 950, 1, "Ivory leather, navy gauntlet cuffs, scarlet piping.", {"gar": "rg_gloves", "b": "rg"}],
  ["gx_rg_jacket", "a_top", "Frogged Officer Jacket", 1900, 1, "Navy wool, brass frogging, scarlet collar and cuffs.", {"gar": "rg_jacket", "b": "rg"}],
  ["gx_rg_capelet", "a_top", "Capelet Tunic", 1900, 1, "Fitted navy tunic, scarlet-lined capelet, brass chain clasp.", {"gar": "rg_capelet", "b": "rg"}],
  ["gx_rg_mess", "a_top", "Cropped Mess Jacket", 1700, 1, "Scarlet, open over a navy bandeau, satin lapels.", {"gar": "rg_mess", "b": "rg", "fo": 1}],
  ["gx_rg_vest", "a_top", "Braided Waistcoat", 1700, 1, "Sleeveless navy on bare skin, scarlet piping, brass braid.", {"gar": "rg_vest", "b": "rg", "mo": 1}],
  ["gx_rg_breeches", "a_pants", "Stripe Riding Breeches", 1500, 1, "Navy jodhpur cut, scarlet stripe, brass knee buttons.", {"gar": "rg_breeches", "b": "rg"}],
  ["gx_rg_trouser", "a_pants", "Scarlet Dress Trousers", 1500, 1, "Slim scarlet wool, navy double stripe, brass tabs.", {"gar": "rg_trouser", "b": "rg"}],
  ["gx_rg_skirt", "a_pants", "Frogged Pencil Skirt", 1500, 1, "Navy pencil, brass frogging, scarlet hem, back slit.", {"gar": "rg_skirt", "b": "rg", "fo": 1}],
  ["gx_rg_boot", "a_shoes", "Tall Riding Boots", 1700, 1, "Black patent, scarlet top band, brass ankle buckle.", {"gar": "rg_boot", "b": "rg"}],
  ["gx_rg_spat", "a_shoes", "Spat Brogues", 1600, 1, "Black wingtips under navy spats, brass buttons.", {"gar": "rg_spat", "b": "rg"}],
  ["gx_rg_stiletto", "a_shoes", "Officer Stiletto Boots", 1700, 1, "Navy patent, brass side buttons, scarlet heel.", {"gar": "rg_stiletto", "b": "rg", "fo": 1}]];
const LUX = 'gx_rg_cap gx_rg_cord gx_rg_jacket gx_rg_capelet gx_rg_mess gx_rg_boot gx_rg_stiletto'.split(' ');
const band = (id) => (LUX.includes(id) ? [1050, 1200] : [800, 1050]);
const page = async (b, url) => { const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); p.errs = []; p.on('pageerror', (e) => p.errs.push(e.message.slice(0, 150)));
  await p.goto(url + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbDrops && window.QBLoft && QBLoft.data, null, { timeout: 90000 }); await p.waitForTimeout(800); return p; };
const live = (p, from, n) => p.evaluate(([from, n]) => { const o = []; for (let d = 0; d < n; d++) { const t = new Date(2026, 10, from + d, 10, 0).getTime(), r = {};
  for (const fl of ['street', 'boutique', 'atelier']) { const f = window.__qbDrops.floor(fl, t); r[fl] = ((f && f.live) || []).map((q) => q.id).sort().join(','); } o.push(r); } return o; }, [from, n]);
(async () => { const b = await chromium.launch({ args: ['--mute-audio'] }); const P = await page(b, base), R = await page(b, ref);
  const a = await live(P, 10, 13 + 112), r = await live(R, 10, 13 + 112), diff = a.findIndex((o, i) => JSON.stringify(o) !== JSON.stringify(r[i]));
  ok(diff < 0, 'held: every floor 11-10 .. +16 weeks is as in the last release' + (diff < 0 ? '' : ' (first change ' + new Date(2026, 10, 10 + diff).toDateString() + ')'));
  /* the rows themselves, with the hold lifted in this page only (as when Cal approves) */
  await P.evaluate(() => { const c = window.__qbDrops.cfg; c.hold = c.hold.filter((h) => h.ids.indexOf('rg') < 0); });
  const f = await live(P, 10, 13 + 112), first = f.findIndex((o) => o.boutique.split(',').includes('rg')), on = new Date(2026, 10, 10 + first).toDateString();
  ok(first >= 0, 'with the hold lifted, REGIMENT first live on the Boutique on ' + on);
  const s = await P.evaluate(async ([day, ids, process_SEX]) => { const x = window.__qb.x(), S = x.S; const real = Date.now() - (window.__qbShift || 0); window.__qbShift = new Date(2026, 10, day, 10, 0).getTime() - real;
    S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: process_SEX }); S.xp = x.cum(35); S.gates = Array.from({ length: 200 }, (_, i) => i); S.calm = false; S.fsall = 1; S.areaOn = { board: 1, shop: 1, hideout: 1 }; S.owned = {}; window.__qbRooms.open('closet', 1); x.render();
    const rows = {}; ids.forEach((id) => { const it = x.SHOP.find((q) => q[0] === id); rows[id] = it ? { n: it[2], p: it[3], line: it[5], slot: it[1], item: !!QBLoft.data.items[it[6].gar], front: !!(QBLoft.data.items[it[6].gar] || {}).frontOnly } : null; });
    const clear = () => document.querySelectorAll('#layer .modal,.dropsplash,.bsplash').forEach((m) => m.remove()); document.querySelector('.nav button[data-v="shop"]').click(); for (let i = 0; i < 4; i++) { await new Promise((o) => setTimeout(o, 900)); clear(); }
    const fl = document.querySelector('[data-qsfl="boutique"]'); if (fl) { fl.click(); await new Promise((o) => setTimeout(o, 800)); clear(); }
    const t = document.querySelector('[data-act="stab"][data-v="rg"]'); let cards = []; if (t) { t.click(); await new Promise((o) => setTimeout(o, 900)); clear(); cards = [...document.querySelectorAll('.qs-rack [data-card]')].map((e) => e.dataset.card); }
    return { rows, cards }; }, [10 + first, ROWS.map((q) => q[0]), SEX]);
  for (const w of ROWS) { const g = s.rows[w[0]], bd = band(w[0]);
    ok(g && g.n === w[2] && g.line === w[5] && g.slot === w[1] && g.item && g.p >= bd[0] && g.p <= bd[1] && s.cards.includes(w[0]), `${w[0]}: ${g && g.n}, ${g && g.p} coins (${bd.join('-')}), on the tab`);
    const sx = w[6].fo ? 'f_' : 'm_'; for (const fn of [sx + w[6].gar + '_front', 'icon_' + w[6].gar].concat(g && g.front ? [] : [sx + w[6].gar + '_back'])) { const st = await P.request.get(base + '/art/app/' + fn + '.webp'); if (st.status() !== 200) ok(false, `  ${fn} ${st.status()}`); } }
  ok(s.cards.length === 15, 'its tab lists all 15 (as every brand does, for either body) for ' + SEX + ' on ' + on);
  ok(!P.errs.length && !R.errs.length, 'no page errors ' + JSON.stringify(P.errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
