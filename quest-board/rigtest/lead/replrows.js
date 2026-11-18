// Cal 11-18 replacements (ROOMS cefab81, 4edfa01, dff4465) on the plain build: VENOM ROSE's 6 (the harness removed: Cal "remove the strappy chest harness"), OVERPASS's 2, SAYMØRE's 1 new rows and 5
// new shop lines. For each brand, on a day it is live: every new piece has ROOMS's name and line, its price inside its grade's band on
// its floor, its art loads (front, back unless front-only, icon; m_ for men-only, f_ otherwise), and its brand tab lists it; the five
// repainted rows show their new lines. The bare base: on her body, each top flagged bare (bralette, crop, corset, slip, bodysuit) is
// worn over f_base_bare_*, any other top over f_base_*; his body is unchanged. No page errors.
//   PORT=<plain build server> NODE_PATH=<playwright's parent> node rigtest/lead/replrows.js
const { chromium } = require('playwright');
let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
const base = 'http://127.0.0.1:' + (process.env.PORT || 8779);
// ROOMS's rows (shots/pending_art/new1118/rows/rows_draft.json, not committed), copied so a clean checkout can run this
const ROWS = [
  ["gx_v_horns", "a_hat", "Velvet Devil Horns", 850, 1, "Glossy black horns, oxblood velvet wraps, rhinestone tips.", {"gar": "v_horns", "b": "rose"}],
  ["gx_v_silkshirt", "a_top", "Unbuttoned Silk Shirt", 1600, 1, "Oxblood silk open to the navel, black satin collar.", {"gar": "v_silkshirt", "b": "rose", "mo": 1}],
  ["gx_v_vinyl", "a_pants", "Lace-Up Vinyl Trousers", 1450, 1, "Skin-tight glossy black vinyl, laced up both outer seams.", {"gar": "v_vinyl", "b": "rose"}],
  ["gx_v_hotpants", "a_pants", "Vinyl Lace-Up Shorts", 1250, 1, "High-waisted glossy black vinyl, silver-eyelet sides.", {"gar": "v_hotpants", "b": "rose", "fo": 1}],
  ["gx_o_guards", "a_acc", "Grip-Tape Wrist Guards", 850, 1, "Grip-tape facing, orange straps, scuffed grey plates.", {"gar": "o_guards", "b": "over"}],
  ["gx_o_resp", "a_acc", "Spray Respirator", 700, 1, "Matte black half mask, orange filter caps, reflective strip.", {"gar": "o_resp", "b": "over"}],
  ["gx_sm_grille", "a_top", "Speaker-Grille Bomber", 1600, 1, "Grille-mesh panels, cyan EQ bars up the back, orange \u00d8 badge.", {"gar": "sm_grille", "b": "sm"}],
  ["gx_v_bralette", "a_top", "Lace Bralette Set", 1400, 1, "Black lace, oxblood satin trim, thin straps.", {"gar": "v_bralette", "b": "rose", "fo": 1}],
  ["gx_v_crop", "a_top", "Keyhole Crop Top", 1300, 1, "Skin-tight black long sleeves, keyhole with a silver ring.", {"gar": "v_crop", "b": "rose", "fo": 1}]];
const LINES = { gx_v_corset: 'Strapless black lace, sweetheart line, laced front.', gx_v_slip: 'Black satin, deep V, a bow and a short side slit.', gx_v_bodysuit: 'Strapless black satin, boned, laced back.', gx_v_flare: 'Wine velvet, slit from the knee, wide hem.', gx_v_blazer: 'Deep red velvet, worn open, no shirt.' };
const GRADE = { luxury: 'gx_v_bralette', standard: 'gx_o_guards gx_o_resp' }, grade = (id) => Object.keys(GRADE).find((g) => GRADE[g].split(' ').includes(id)) || 'premium';
const BAND = { street: { standard: [250, 440], premium: [440, 450], luxury: [440, 450] }, boutique: { standard: [600, 800], premium: [800, 1050], luxury: [1050, 1200] } };
const FL = { rose: 'boutique', sm: 'boutique', over: 'street' };
(async () => { const b = await chromium.launch({ args: ['--mute-audio'] });
  for (const br of ['rose', 'sm', 'over']) { const fl = FL[br];
    const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 150)));
    await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbDrops && window.QBLoft && QBLoft.data, null, { timeout: 90000 }); await p.waitForTimeout(800);
    const ids = ROWS.filter((r) => r[6].b === br).map((r) => r[0]).concat(br === 'rose' ? Object.keys(LINES) : []);
    const r = await p.evaluate(async ([br, fl, ids]) => { const x = window.__qb.x(), S = x.S; const real = Date.now() - (window.__qbShift || 0);
      let day = null; for (let d = 0; d < 120 && !day; d++) { const t = new Date(2026, 10, 19 + d, 10, 0).getTime(), f = window.__qbDrops.floor(fl, t); if (f && (f.live || []).some((q) => q.id === br)) day = t; } window.__qbShift = (day || Date.now()) - real;
      S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'f' }); S.xp = x.cum(35); S.gates = Array.from({ length: 200 }, (_, i) => i); S.calm = false; S.fsall = 1; S.areaOn = { board: 1, shop: 1, hideout: 1 }; S.owned = {}; S.brandSeen = {}; window.__qbRooms.open('closet', 1); x.render();
      const rows = {}; ids.forEach((id) => { const it = x.SHOP.find((q) => q[0] === id); rows[id] = it ? { n: it[2], p: it[3], line: it[5], slot: it[1], item: !!QBLoft.data.items[it[6].gar], front: !!(QBLoft.data.items[it[6].gar] || {}).frontOnly } : null; });
      const clear = () => document.querySelectorAll('#layer .modal,.dropsplash,.bsplash').forEach((m) => m.remove());
      document.querySelector('.nav button[data-v="shop"]').click(); for (let i = 0; i < 4; i++) { await new Promise((o) => setTimeout(o, 1000)); clear(); } x.render(); await new Promise((o) => setTimeout(o, 500));
      const f2 = document.querySelector('[data-qsfl="' + fl + '"]'); if (f2) { f2.click(); await new Promise((o) => setTimeout(o, 800)); clear(); }
      const t = document.querySelector('[data-act="stab"][data-v="' + br + '"]'); let cards = []; if (t) { t.click(); await new Promise((o) => setTimeout(o, 900)); clear(); cards = [...document.querySelectorAll('.qs-rack [data-card]')].map((e) => e.dataset.card); }
      return { day: day && new Date(day).toDateString(), rows, cards }; }, [br, fl, ids]);
    ok(!!r.day, `${br}: live on the ${fl} on ${r.day}`);
    for (const w of ROWS.filter((q) => q[6].b === br)) { const g = r.rows[w[0]], gr = grade(w[0]), bd = BAND[fl][gr];
      ok(g && g.n === w[2] && g.line === w[5] && g.slot === w[1] && g.item && g.p >= bd[0] && g.p <= bd[1] && r.cards.includes(w[0]), `${w[0]}: ${g && g.n}, ${g && g.p} coins (${gr} ${bd.join('-')}), on the tab`);
      const sx = w[6].mo ? 'm_' : 'f_'; for (const f of [sx + w[6].gar + '_front', 'icon_' + w[6].gar].concat(g && g.front ? [] : [sx + w[6].gar + '_back'])) { const s = await p.request.get(base + '/art/app/' + f + '.webp'); ok(s.status() === 200, `  ${f} ${s.status()}`); } }
    if (br === 'rose') for (const id of Object.keys(LINES)) ok(r.rows[id] && r.rows[id].line === LINES[id], `${id}: new line "${r.rows[id] && r.rows[id].line}"`);
    if (br === 'rose') { const bare = await p.evaluate(() => { const Q = window.QBDATA, out = {}; const S = window.__qb.x().S;
        for (const [sex, top] of [['f', 'gx_v_bralette'], ['f', 'gx_v_crop'], ['f', 'gx_v_corset'], ['f', 'gx_v_slip'], ['f', 'gx_v_bodysuit'], ['f', 'gx_h_varsity'], ['m', 'gx_v_silkshirt'], ['m', 'gx_v_blazer']]) {
          S.char = window.__qb.fixChar({ name: 'Cal', sex }); S.char.rig = Object.assign({}, Q.creator.defaults, { body: sex }); S.owned[top] = true;
          const L = QBLook.build(Q.creator, window.__qb.lookOf({ a_top: top }).rig); out[sex + ':' + top] = [L.layers.body.front, L.layers.body.back]; } return out; });
      const want = (k) => (/^f:gx_v_(bralette|crop|corset|slip|bodysuit)$/.test(k) ? 'f_base_bare' : k[0] + '_base');
      ok(Object.keys(bare).every((k) => bare[k][0] === want(k) + '_front.webp' && bare[k][1] === want(k) + '_back.webp'), 'the bare base under her five bare tops only; his body unchanged ' + JSON.stringify(bare)); }
    ok(!errs.length, br + ': no page errors ' + JSON.stringify(errs.slice(0, 3))); await p.context().close(); }
  await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
