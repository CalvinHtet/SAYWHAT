// new240: VENOM ROSE's 15-piece sexy set (Cal: "Approve all", 2026-11-17; QA 39bc5d1; ROOMS a10a097, 353080a, 242f620, d808aca) on the
// plain build. A level-35 player on a day VENOM ROSE is live on the Boutique: every new piece has ROOMS's name and line, its price sits
// inside its grade's Boutique band (standard 600-800, premium 800-1,050, luxury 1,050-1,200), the VENOM ROSE tab lists it for a man and a
// woman, its art (front, back unless front-only, icon; m_ for men-only, f_ otherwise) loads; no page errors.
//   PORT=<plain build server> NODE_PATH=<playwright's parent> node rigtest/lead/roserows.js
const { chromium } = require('playwright');
let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
const base = 'http://127.0.0.1:' + (process.env.PORT || 8779);
// ROOMS's rows (shots/pending_art/new240/rose/rows_draft.json, not committed), copied here so a clean checkout can run this
const ROWS = [
  ["gx_v_bunny", "a_hat", "Satin Bunny Ears", 850, 1, "Black satin ears on a thin headband.", {"gar": "v_bunny", "b": "rose", "fo": 1}],
  ["gx_v_veil", "a_hat", "Velvet Pillbox Hat", 900, 1, "A tiny oxblood pillbox, pearl hat pin.", {"gar": "v_veil", "b": "rose", "fo": 1}],
  ["gx_v_captain", "a_hat", "Velvet Captain's Cap", 850, 1, "Oxblood velvet, a black patent brim.", {"gar": "v_captain", "b": "rose"}],
  ["gx_v_pipe", "a_acc", "Briar Pipe", 750, 1, "Curved dark wood, a wisp of smoke.", {"gar": "v_pipe", "b": "rose", "mo": 1}],
  ["gx_v_mask", "a_acc", "Lace Masquerade Mask", 800, 1, "Black lace around the eyes, silver edge.", {"gar": "v_mask", "b": "rose"}],
  ["gx_v_bodychain", "a_acc", "Crystal Body Chain", 950, 1, "Fine silver strands draped over the chest.", {"gar": "v_bodychain", "b": "rose", "fo": 1}],
  ["gx_v_robe", "a_top", "Velvet Smoking Robe", 1800, 1, "Oxblood velvet, black satin lapels, tied loose.", {"gar": "v_robe", "b": "rose", "mo": 1}],
  ["gx_v_slip", "a_top", "Lace Slip Dress", 1600, 1, "Black satin, lace trim, thin straps, mid-thigh.", {"gar": "v_slip", "b": "rose", "fo": 1}],
  ["gx_v_bodysuit", "a_top", "Satin Corset Bodysuit", 1500, 1, "Black satin corset, mesh yoke to the neck.", {"gar": "v_bodysuit", "b": "rose", "fo": 1}],
  ["gx_v_pajama", "a_pants", "Silk Pajama Pants", 1150, 1, "Oxblood silk, black piping.", {"gar": "v_pajama", "b": "rose", "mo": 1}],
  ["gx_v_fishnet", "a_pants", "Fishnet Tights", 1100, 1, "Black diamond net, high waist.", {"gar": "v_fishnet", "b": "rose", "fo": 1}],
  ["gx_v_mini", "a_pants", "Velvet Mini Skirt", 1200, 1, "Oxblood velvet, high waist, very short.", {"gar": "v_mini", "b": "rose", "fo": 1}],
  ["gx_v_stiletto", "a_shoes", "Patent Stilettos", 1500, 1, "Oxblood patent, needle heels.", {"gar": "v_stiletto", "b": "rose", "fo": 1}],
  ["gx_v_thigh", "a_shoes", "Lace-Up Knee Boots", 1650, 1, "Black leather laced to the knee, block heel.", {"gar": "v_thigh", "b": "rose", "fo": 1}],
  ["gx_v_slipper", "a_shoes", "Velvet Smoking Slippers", 1300, 1, "Oxblood velvet, black soles.", {"gar": "v_slipper", "b": "rose", "mo": 1}]];
const GRADE = { standard: 'gx_v_bunny gx_v_pipe gx_v_fishnet', luxury: 'gx_v_bodychain gx_v_bodysuit gx_v_slip' };
const grade = (id) => Object.keys(GRADE).find((g) => GRADE[g].split(' ').includes(id)) || 'premium';
const band = { standard: [600, 800], premium: [800, 1050], luxury: [1050, 1200] };
(async () => { const b = await chromium.launch({ args: ['--mute-audio'] });
  for (const sex of ['m', 'f']) {
    const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 150)));
    await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbDrops && window.QBLoft && QBLoft.data, null, { timeout: 90000 }); await p.waitForTimeout(800);
    const r = await p.evaluate(async ([ids, sex]) => { const x = window.__qb.x(), S = x.S; const real = Date.now() - (window.__qbShift || 0); let day = null; for (let d = 0; d < 120 && !day; d++) { const t = new Date(2026, 10, 23 + d, 10, 0).getTime(); const f = window.__qbDrops.floor('boutique', t); if (f && (f.live || []).some((q) => q.id === 'rose')) day = t; } window.__qbShift = (day || Date.now()) - real;
      S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex }); S.xp = x.cum(35); S.gates = Array.from({ length: 200 }, (_, i) => i); S.brandSeen = {}; ['hanga', 'y2k', 'over', 'alt', 'smk', 'nc', 'rose', 'cr', 'bb'].forEach((id) => { S.brandSeen[id] = 1; }); S.cls = Object.keys(window.__qbCls || {})[0] || S.cls || 'vanguard'; S.calm = false; S.fsall = 1; S.areaOn = { board: 1, shop: 1, hideout: 1 }; S.owned = {}; window.__qbRooms.open('closet', 1); x.render(); await new Promise((o) => setTimeout(o, 500));
      const bf = window.__qbDrops.floor('boutique', day || Date.now()), live = ((bf && bf.live) || []).map((q) => q.id);
      const rows = {}; ids.forEach((id) => { const it = x.SHOP.find((q) => q[0] === id); rows[id] = it ? { n: it[2], p: it[3], line: it[5], slot: it[1], item: !!QBLoft.data.items[it[6].gar], front: !!(QBLoft.data.items[it[6].gar] || {}).frontOnly } : null; });
      const clear = () => document.querySelectorAll('#layer .modal,.dropsplash,.bsplash').forEach((m) => m.remove());
      document.querySelector('.nav button[data-v="shop"]').click(); for (let i = 0; i < 5; i++) { await new Promise((o) => setTimeout(o, 1200)); clear(); } x.render(); await new Promise((o) => setTimeout(o, 600));
      const text = {}; for (const br of ['rose']) { clear(); const fl = document.querySelector('[data-qsfl="boutique"]'); if (fl) { fl.click(); await new Promise((o) => setTimeout(o, 800)); clear(); } const t = document.querySelector('[data-act="stab"][data-v="' + br + '"]'); if (!t) { text[br] = null; continue; } t.click(); await new Promise((o) => setTimeout(o, 800)); text[br] = document.getElementById('app').innerText; }
      return { live, rows, text, day: day && new Date(day).toDateString() }; }, [ROWS.map((q) => q[0]), sex]);
    if (sex === 'm') ok(r.live.includes('rose'), r.day + ': VENOM ROSE is live on the Boutique ' + JSON.stringify(r.live));
    for (const w of ROWS) { const id = w[0], g = r.rows[id], gr = grade(id), br = w[6].b, fo = !!w[6].fo;
      if (sex === 'm') { ok(g && g.n === w[2] && g.line === w[5] && g.slot === w[1] && g.item && g.p >= band[gr][0] && g.p <= band[gr][1], `${id}: ${g && g.n} ${g && g.p} coins (${gr} ${band[gr].join('-')}) "${g && g.line}"`);
        const sx = w[6].mo ? 'm_' : 'f_'; for (const f of [sx + w[6].gar + '_front', 'icon_' + w[6].gar].concat(g && g.front ? [] : [sx + w[6].gar + '_back'])) { const s = await p.request.get(base + '/art/app/' + f + '.webp'); ok(s.status() === 200, `  ${f} ${s.status()}`); } }
      /* the Shop shows a whole brand to either sex, limited pieces too */
      const listed = !!(r.text[br] && r.text[br].includes(w[2])); ok(listed, `  ${sex === 'm' ? 'a man' : 'a woman'}'s ${br} tab lists ${w[2]}${w[6].mo ? ' (men only, shown like the Shop shows every limited piece)' : fo ? ' (women only)' : ''}`); }
    ok(!errs.length, sex + ': no page errors ' + JSON.stringify(errs.slice(0, 3)));
    await p.context().close(); }
  await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
