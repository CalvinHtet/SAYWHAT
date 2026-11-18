// new240: OVERPASS's 15 new pieces (Cal: "Approve after QA", 2026-11-17; ROOMS cbc3709) on the plain build. Clock Wed Nov 18 10 am,
// a level-12 player: OVERPASS is live on the Street; every new piece has ROOMS's name and line, its price sits inside its grade's Street
// band (thrift 110-250, standard 250-440), the OVERPASS tab lists it for a man and a woman (the men-only Carpenter Jorts too, as the Shop
// shows a whole brand), its art (front, back unless front-only, icon) loads; no page errors.
//   PORT=<plain build server> NODE_PATH=<playwright's parent> node rigtest/lead/overrows.js
const { chromium } = require('playwright');
let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
const base = 'http://127.0.0.1:' + (process.env.PORT || 8779);
// ROOMS's rows (shots/pending_art/new240/overpass/rows_draft.json, not committed), copied here so a clean checkout can run this (QA d2a0460)
const ROWS = [
  ["gx_o_5panel", "a_hat", "Five-Panel Skate Cap", 850, 1, "Black nylon, orange side tab.", {"gar": "o_5panel", "b": "over"}],
  ["gx_o_reflect", "a_hat", "Reflective Bucket", 950, 1, "Grey reflective nylon that flares at night.", {"gar": "o_reflect", "b": "over"}],
  ["gx_o_durag", "a_hat", "Satin Durag", 750, 1, "Black satin, long tails.", {"gar": "o_durag", "b": "over"}],
  ["gx_o_tool", "a_acc", "Skate Tool Lanyard", 650, 1, "Orange lanyard, steel T-tool.", {"gar": "o_tool", "b": "over"}],
  ["gx_o_rect", "a_acc", "Smoke Rectangle Shades", 750, 1, "Slim black frames, smoke lenses.", {"gar": "o_rect", "b": "over"}],
  ["gx_o_tags", "a_acc", "Ball-Chain Dog Tags", 700, 1, "Two steel tags, one orange edge.", {"gar": "o_tags", "b": "over"}],
  ["gx_o_bridge", "a_top", "Bridge Graphic Hoodie", 1500, 1, "Washed black, cracked orange overpass print.", {"gar": "o_bridge", "b": "over"}],
  ["gx_o_liner", "a_top", "Quilted Liner Jacket", 1500, 1, "Safety orange diamond quilting, snap front.", {"gar": "o_liner", "b": "over"}],
  ["gx_o_thermal", "a_top", "Layered Thermal Tee", 1200, 1, "Boxy black tee over a grey waffle thermal.", {"gar": "o_thermal", "b": "over"}],
  ["gx_o_dknee", "a_pants", "Double-Knee Carpenters", 1350, 1, "Grey canvas, orange tab, hammer loop.", {"gar": "o_dknee", "b": "over"}],
  ["gx_o_snap", "a_pants", "Snap Track Pants", 1200, 1, "Black nylon, orange piping, snap legs.", {"gar": "o_snap", "b": "over"}],
  ["gx_o_cshort", "a_pants", "Carpenter Jorts", 1100, 1, "Washed black denim, to the knee.", {"gar": "o_cshort", "b": "over", "mo": 1}],
  ["gx_o_suede", "a_shoes", "Suede Low Skaters", 1400, 1, "Grey suede, orange laces, padded tongue.", {"gar": "o_suede", "b": "over"}],
  ["gx_o_moc", "a_shoes", "Moc-Toe Work Boots", 1600, 1, "Black leather, orange laces, white wedge.", {"gar": "o_moc", "b": "over"}],
  ["gx_o_slipon", "a_shoes", "Knit Slip-On Trainers", 1300, 1, "Black knit, orange heel pull.", {"gar": "o_slipon", "b": "over"}]];
const GRADE = { thrift: 'gx_o_durag gx_o_tool gx_o_rect gx_o_cshort gx_o_slipon' };
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
      const text = {}; for (const br of ['over']) { clear(); const t = document.querySelector('[data-act="stab"][data-v="' + br + '"]'); if (!t) { text[br] = null; continue; } t.click(); await new Promise((o) => setTimeout(o, 800)); text[br] = document.getElementById('app').innerText; }
      return { live, rows, text }; }, [ROWS.map((q) => q[0]), sex]);
    if (sex === 'm') ok(r.live.includes('over'), 'Wed Nov 18: OVERPASS is live on the Street ' + JSON.stringify(r.live));
    for (const w of ROWS) { const id = w[0], g = r.rows[id], gr = grade(id), br = w[6].b, fo = !!w[6].fo;
      if (sex === 'm') { ok(g && g.n === w[2] && g.line === w[5] && g.slot === w[1] && g.item && g.p >= band[gr][0] && g.p <= band[gr][1], `${id}: ${g && g.n} ${g && g.p} coins (${gr} ${band[gr].join('-')}) "${g && g.line}"`);
        for (const f of ['f_' + w[6].gar + '_front', 'icon_' + w[6].gar].concat(g && g.front ? [] : ['f_' + w[6].gar + '_back'])) { const s = await p.request.get(base + '/art/app/' + f + '.webp'); ok(s.status() === 200, `  ${f} ${s.status()}`); } }
      /* a women-only piece is on a man's tab too, like DIAL-UP's Plaid Mini Skirt always was (the Shop shows the whole brand) */
      /* v1.22: the skate tool is off sale (Cal: "swap out the metal chain and the skate tool") */ if (id === 'gx_o_tool' || id === 'gx_o_durag') { ok(!(r.text[br] || '').includes(w[2]), `  ${w[2]} off sale (durag: v1.18, gone; skate tool: v1.22)`); continue; }
      const listed = !!(r.text[br] && r.text[br].includes(w[2])); ok(listed, `  ${sex === 'm' ? 'a man' : 'a woman'}'s ${br} tab lists ${w[2]}${w[6].mo ? ' (men only, shown like the Shop shows every limited piece)' : fo ? ' (women only)' : ''}`); }
    ok(!errs.length, sex + ': no page errors ' + JSON.stringify(errs.slice(0, 3)));
    await p.context().close(); }
  await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
