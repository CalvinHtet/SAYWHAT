// new240: HANGANG's and DIAL-UP's 15 new pieces each (Cal approved, "Ok on all", 2026-11-17; ROOMS 86cb0e1 + 35f3080) on the plain build.
// Clock Wed Nov 18 10 am, a level-12 player: both brands are live on the Street; every new piece has ROOMS's name and line, its price
// sits inside its grade's Street band (thrift 110-250, standard 250-440, premium 440-450), the brand's tab lists it for a man and a woman
// (the women-only Denim Cargo Maxi too, as the Shop shows a whole brand), its art (front, back unless front-only, icon) loads; no page errors.
//   PORT=<plain build server> NODE_PATH=<playwright's parent> node rigtest/lead/new240rows.js
const { chromium } = require('playwright'), fs = require('fs'), path = require('path');
let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
const base = 'http://127.0.0.1:' + (process.env.PORT || 8779);
const ROWS = [].concat(...['hangang', 'dialup'].map((f) => JSON.parse(fs.readFileSync(path.join(__dirname, '../../../shots/pending_art/new240', f, 'rows_draft.json'), 'utf8'))));
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
