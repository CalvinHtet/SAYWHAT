// new240: HANGANG's and DIAL-UP's 15 new pieces each (Cal approved, "Ok on all", 2026-11-17; ROOMS 86cb0e1 + 35f3080) on the plain build.
// Clock Wed Nov 18 10 am, a level-12 player: both brands are live on the Street; every new piece has ROOMS's name and line, its price
// sits inside its grade's Street band (thrift 110-250, standard 250-440, premium 440-450), the brand's tab lists it for a man and a woman
// (the women-only Denim Cargo Maxi too, as the Shop shows a whole brand), its art (front, back unless front-only, icon) loads; no page errors.
//   PORT=<plain build server> NODE_PATH=<playwright's parent> node rigtest/lead/new240rows.js
const { chromium } = require('playwright');
let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
const base = 'http://127.0.0.1:' + (process.env.PORT || 8779);
// ROOMS's rows (shots/pending_art/new240/hangang and dialup, rows_draft.json, not committed), copied here so a clean checkout can run this (QA d2a0460)
const ROWS = [
  ["gx_h_pbucket", "a_hat", "Padded Nylon Bucket", 900, 1, "Quilted black nylon, toggle cord.", {"gar": "h_pbucket", "b": "hanga"}],
  ["gx_h_bala", "a_hat", "Rib Knit Hood", 850, 1, "Cream rib knit, open face.", {"gar": "h_bala", "b": "hanga"}],
  ["gx_h_longbill", "a_hat", "Long-Bill Washed Cap", 850, 1, "Pigment charcoal, lime underbrim.", {"gar": "h_longbill", "b": "hanga"}],
  ["gx_h_sling", "a_acc", "Leather Chest Sling", 900, 1, "Black leather pouch worn high across the chest.", {"gar": "h_sling", "b": "hanga"}],
  ["gx_h_phones", "a_acc", "Cream Headphones", 950, 1, "Over-ear, worn round the neck.", {"gar": "h_phones", "b": "hanga"}],
  ["gx_h_oval", "a_acc", "Lime Oval Shades", 750, 1, "Narrow black frames, lime lenses.", {"gar": "h_oval", "b": "hanga"}],
  ["gx_h_padcoat", "a_top", "Long Padded Coat", 1800, 1, "Black, mid-thigh, cream drawcords.", {"gar": "h_padcoat", "b": "hanga"}],
  ["gx_h_layer", "a_top", "Hoodie & Liner Vest", 1500, 1, "Grey hoodie under a black quilted vest.", {"gar": "h_layer", "b": "hanga"}],
  ["gx_h_rugby", "a_top", "Half-Zip Rugby Knit", 1350, 1, "Charcoal knit, cream collar, lime tipping.", {"gar": "h_rugby", "b": "hanga"}],
  ["gx_h_balloon", "a_pants", "Balloon Sweatpants", 1150, 1, "Heather grey, pintucked, cinched ankles.", {"gar": "h_balloon", "b": "hanga"}],
  ["gx_h_barrel", "a_pants", "Washed Black Wide Jeans", 1300, 1, "Faded black, wide leg, stacked hem.", {"gar": "h_barrel", "b": "hanga"}],
  ["gx_h_wrap", "a_pants", "Wrap Skirt over Trousers", 1300, 1, "Grey wrap skirt with a lime tie over black wide pants.", {"gar": "h_wrap", "b": "hanga"}],
  ["gx_h_mule", "a_shoes", "Mesh Sneaker Mules", 1300, 1, "Cream mesh, chunky sole, open back.", {"gar": "h_mule", "b": "hanga"}],
  ["gx_h_puffboot", "a_shoes", "Quilted Puffer Boots", 1500, 1, "Black ankle boots, lime pull tab.", {"gar": "h_puffboot", "b": "hanga"}],
  ["gx_h_court", "a_shoes", "Retro Court Trainers", 1400, 1, "Cream leather, gum sole, lime heel tab.", {"gar": "h_court", "b": "hanga"}],
  ["gx_y_visor", "a_hat", "Holo Sun Visor", 900, 1, "Iridescent brim, black band.", {"gar": "y_visor", "b": "y2k"}],
  ["gx_y_race", "a_hat", "Racing Patch Cap", 850, 1, "Black twill, coral and cyan racing patches.", {"gar": "y_race", "b": "y2k"}],
  ["gx_y_furtrap", "a_hat", "Faux Fur Trapper", 950, 1, "Shaggy black fur, cyan satin lining.", {"gar": "y_furtrap", "b": "y2k"}],
  ["gx_y_rimless", "a_acc", "Rimless Gradient Shades", 750, 1, "Cyan to clear, thin silver bridge.", {"gar": "y_rimless", "b": "y2k"}],
  ["gx_y_phone", "a_acc", "Flip Phone Lanyard", 700, 1, "Chrome flip phone on a beaded strap.", {"gar": "y_phone", "b": "y2k"}],
  ["gx_y_chains", "a_acc", "Layered Chrome Chains", 850, 1, "Ball chain over a chunky curb.", {"gar": "y_chains", "b": "y2k"}],
  ["gx_y_moto", "a_top", "Racing Moto Jacket", 1800, 1, "Black leather, coral panels, patches.", {"gar": "y_moto", "b": "y2k"}],
  ["gx_y_mesh", "a_top", "Mesh Layer Top", 1200, 1, "Cyan mesh long sleeve under a black tank.", {"gar": "y_mesh", "b": "y2k"}],
  ["gx_y_furden", "a_top", "Fur-Collar Denim Jacket", 1600, 1, "Cropped dark denim over a white tee, cream fur collar.", {"gar": "y_furden", "b": "y2k"}],
  ["gx_y_patch", "a_pants", "Patchwork Wide Jeans", 1350, 1, "Mixed washes, low rise.", {"gar": "y_patch", "b": "y2k"}],
  ["gx_y_pcamo", "a_pants", "Coral Camo Cargos", 1250, 1, "Low-rise, coral and grey camo.", {"gar": "y_pcamo", "b": "y2k"}],
  ["gx_y_maxi", "a_pants", "Denim Cargo Maxi", 1300, 1, "Long dark denim, cargo pockets, a slit.", {"gar": "y_maxi", "b": "y2k", "fo": 1}],
  ["gx_y_patent", "a_shoes", "Patent Platform Boots", 1650, 1, "Black patent, coral platform sole.", {"gar": "y_patent", "b": "y2k"}],
  ["gx_y_bubble", "a_shoes", "Bubble Sole Runners", 1500, 1, "Pearl white, cyan bubble heel.", {"gar": "y_bubble", "b": "y2k"}],
  ["gx_y_furmule", "a_shoes", "Suede Fur Mules", 1300, 1, "Ice blue suede, cream faux fur lining.", {"gar": "y_furmule", "b": "y2k"}]];
const GRADE = { thrift: 'gx_h_oval gx_h_barrel gx_y_rimless gx_y_phone', premium: 'gx_y_visor gx_y_moto gx_y_patent' };
const grade = (id) => Object.keys(GRADE).find((g) => GRADE[g].split(' ').includes(id)) || 'standard';
const band = { thrift: [110, 250], standard: [250, 440], premium: [440, 450] };
(async () => { const b = await chromium.launch({ args: ['--mute-audio'] });
  for (const sex of ['m', 'f']) {
    const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 150)));
    await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbDrops && window.QBLoft && QBLoft.data, null, { timeout: 90000 }); await p.waitForTimeout(800);
    const r = await p.evaluate(async ([ids, sex]) => { const x = window.__qb.x(), S = x.S; const real = Date.now() - (window.__qbShift || 0); window.__qbShift = new Date(2026, 10, 18, 10, 0).getTime() - real;
      S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex }); S.xp = x.cum(12); S.gates = [5, 10]; S.brandSeen = {}; ['hanga', 'y2k', 'over', 'alt', 'smk', 'nc'].forEach((id) => { S.brandSeen[id] = 1; }); S.cls = Object.keys(window.__qbCls || {})[0] || S.cls || 'vanguard'; S.calm = false; S.fsall = 1; S.areaOn = { board: 1, shop: 1, hideout: 1 }; S.owned = {}; window.__qbRooms.open('closet', 1); x.render(); await new Promise((o) => setTimeout(o, 500));
      const bf = window.__qbDrops.floor('street', new Date(2026, 10, 18, 10, 0).getTime()), live = ((bf && bf.live) || []).map((q) => q.id);
      const rows = {}; ids.forEach((id) => { const it = x.SHOP.find((q) => q[0] === id); rows[id] = it ? { n: it[2], p: it[3], line: it[5], slot: it[1], item: !!QBLoft.data.items[it[6].gar], front: !!(QBLoft.data.items[it[6].gar] || {}).frontOnly } : null; });
      const clear = () => document.querySelectorAll('#layer .modal,.dropsplash,.bsplash').forEach((m) => m.remove());
      document.querySelector('.nav button[data-v="shop"]').click(); for (let i = 0; i < 5; i++) { await new Promise((o) => setTimeout(o, 1200)); clear(); } x.render(); await new Promise((o) => setTimeout(o, 600));
      const text = {}; for (const br of ['hanga', 'y2k']) { clear(); const t = document.querySelector('[data-act="stab"][data-v="' + br + '"]'); if (!t) { text[br] = null; continue; } t.click(); await new Promise((o) => setTimeout(o, 800)); text[br] = document.getElementById('app').innerText; }
      return { live, rows, text }; }, [ROWS.map((q) => q[0]), sex]);
    if (sex === 'm') ok(['hanga', 'y2k'].every((id) => r.live.includes(id)), 'Wed Nov 18: HANGANG and DIAL-UP are live on the Street ' + JSON.stringify(r.live));
    for (const w of ROWS) { const id = w[0], g = r.rows[id], gr = grade(id), br = w[6].b, fo = !!w[6].fo;
      if (sex === 'm') { ok(g && g.n === w[2] && g.line === w[5] && g.slot === w[1] && g.item && g.p >= band[gr][0] && g.p <= band[gr][1], `${id}: ${g && g.n} ${g && g.p} coins (${gr} ${band[gr].join('-')}) "${g && g.line}"`);
        for (const f of ['f_' + w[6].gar + '_front', 'icon_' + w[6].gar].concat(g && g.front ? [] : ['f_' + w[6].gar + '_back'])) { const s = await p.request.get(base + '/art/app/' + f + '.webp'); ok(s.status() === 200, `  ${f} ${s.status()}`); } }
      /* a women-only piece is on a man's tab too, like DIAL-UP's Plaid Mini Skirt always was (the Shop shows the whole brand) */
      const listed = !!(r.text[br] && r.text[br].includes(w[2])); ok(listed, `  ${sex === 'm' ? 'a man' : 'a woman'}'s ${br} tab lists ${w[2]}${fo ? ' (women only, shown like the Plaid Mini Skirt)' : ''}`); }
    ok(!errs.length, sex + ': no page errors ' + JSON.stringify(errs.slice(0, 3)));
    await p.context().close(); }
  await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
