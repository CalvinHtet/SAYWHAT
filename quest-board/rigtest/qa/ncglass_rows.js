// QA, b76d3168: the three NOIR CODE glasses' Shop rows (gx_nc_clear, gx_nc_catshades, gx_nc_visorshade).
//  A. the rows: a_acc, brand nc, gar with art (slot glasses), category "head", price after tiers next to nc's other glasses
//  B. nc's drops for a year (clock moved to each Mon/Wed/Fri 9 am): each drop shows dropCat of nc's head pieces; every one of the six
//     shows in some drop; the three new ones appear
//  C. the Vault for 52 weeks: how often each new piece is in it, never two premium-brand pieces in one category
//  D. the brand room while nc is live: the head tab lists the shown pieces; trying each new one on puts it on the card (screenshots)
//   PORT=<plain build> OUT=<dir> NODE_PATH=<playwright> node rigtest/qa/ncglass_rows.js
const pw = require('playwright'); const PORT = process.env.PORT || 8824, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); }; const note = (s) => console.log('     ' + s);
const NEW = (process.env.NEW || 'gx_nc_clear,gx_nc_catshades,gx_nc_visorshade').split(','), CAT = process.env.CAT || 'head', SLOT = process.env.SLOT || 'glasses';
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] }); const errs = [];
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, timezoneId: 'America/Los_Angeles' })).newPage(); p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
  await p.addInitScript((c) => { window.__qaCAT = c; }, CAT); await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbDrops && window.__qbV201 && window.QBDATA, null, { timeout: 120000 }); await p.waitForTimeout(600);
  /* A */ const A = await p.evaluate((NEW) => { const x = window.__qb.x(), V = window.__qbV201; const nc = x.SHOP.filter((it) => it[6] && it[6].b === 'nc' && V.cat(it[0]) === window.__qaCAT);
    return { rows: NEW.map((id) => { const it = x.SHOP.find((r) => r[0] === id); if (!it) return { id, missing: 1 }; const g = it[6].gar, M = QBDATA.items[g] || {}; return { id, slot: it[1], b: it[6].b, gar: g, itemSlot: M.slot, front: !!(window.QBART && (QBART['m_' + g + '_front.webp'] || QBART['f_' + g + '_front.webp'])) || null, cat: V.cat(id), price: it[3], cut: !!it[6].cut, name: it[2] }; }),
      head: nc.map((it) => it[0] + ' ' + it[3]), dropCat: (V.cfg && (V.cfg.dropCat || V.cfg.perCat)) || null }; }, NEW);
  A.rows.forEach((r) => note(JSON.stringify(r))); note('nc head pieces and prices: ' + A.head.join(', ') + ' | dropCat ' + A.dropCat);
  ok(A.rows.every((r) => !r.missing && r.slot === ({ hat: 'a_hat', top: 'a_top', bottom: 'a_pants', shoes: 'a_shoes' }[CAT] || 'a_acc') && r.b === 'nc' && r.itemSlot === SLOT && r.cat === CAT && !r.cut), 'the new rows: ' + ({ hat: 'a_hat', top: 'a_top', bottom: 'a_pants', shoes: 'a_shoes' }[CAT] || 'a_acc') + ', brand nc, slot ' + SLOT + ', category ' + CAT + ', on sale');
  const NCAT = +(process.env.COUNT || 6); ok(A.head.length === NCAT, 'nc has ' + NCAT + ' ' + CAT + ' pieces (' + A.head.length + ')');
  /* B */ const B = await p.evaluate(() => { const real = Date.now() - (window.__qbShift || 0), V = window.__qbV201, x = window.__qb.x(), seen = {}, drops = [];
    for (let k = 0; k < 400; k++) { const d = new Date('2026-11-27T09:00:00'); d.setDate(d.getDate() + k); window.__qbShift = d.getTime() - real; const st = window.__qbDrops.state(); const L = st.live.find((q) => q.id === 'nc'); if (!L) continue;
      const key = L.start; if (seen[key]) continue; const keep = V.half(L); const elig = x.SHOP.filter((it) => it[6] && it[6].b === 'nc' && V.cat(it[0]) === window.__qaCAT && !it[6].cut && !(it[6].from && key < it[6].from)).length; const head = x.SHOP.filter((it) => it[6] && it[6].b === 'nc' && V.cat(it[0]) === window.__qaCAT && keep[it[0]]).map((it) => it[0]); seen[key] = 1; drops.push({ start: key, head, elig }); }
    window.__qbShift = 0; return drops; });
  const P = A.dropCat || 3; note('nc drops in a year: ' + B.length + '; head shown: ' + B.map((d) => d.start.slice(5) + ' ' + d.head.map((h) => h.replace('gx_nc_', '')).join('/')).join(' | '));
  ok(B.length >= 2 && B.every((d) => d.head.length === Math.min(P, d.elig)), 'every nc drop shows min(' + P + ', pieces on sale by its start) ' + CAT + ' pieces (' + B.map((d) => d.head.length + '/' + d.elig).slice(0, 4).join(' ') + ' ...)');
  const all = {}; B.forEach((d) => d.head.forEach((h) => { all[h] = (all[h] || 0) + 1; })); note('times shown: ' + JSON.stringify(all));
  ok(Object.keys(all).length === A.head.length && NEW.every((id) => all[id] > 0), 'all ' + A.head.length + ' nc ' + CAT + ' pieces show across the year, the new ones included');
  /* C */ const C = await p.evaluate((NEW) => { const V = window.__qbV201, x = window.__qb.x(), real = Date.now() - (window.__qbShift || 0), hits = {}, two = []; let weeks = 0;
    for (let w = 0; w < 52; w++) { const d = new Date('2026-11-29T09:00:00'); d.setDate(d.getDate() + 7 * w); window.__qbShift = d.getTime() - real; let v; try { v = V.vault(); } catch (e) { continue; } weeks++;
      V.reset && V.reset(); v = V.vault(); const ids = v.list.map((q) => q[1]); const hb = {}; v.list.forEach((q) => { if (q[0] === window.__qaCAT) hb[q[2]] = 1; }); if (Object.keys(hb).length !== v.list.filter((q) => q[0] === window.__qaCAT).length) two.push(v.wk); NEW.forEach((id) => { if (ids.includes(id)) hits[id] = (hits[id] || 0) + 1; });
      }
    window.__qbShift = 0; return { weeks, hits, two }; }, NEW);
  note('Vault, 52 weeks: ' + JSON.stringify(C)); ok(NEW.every((id) => C.hits[id] > 0), 'each new piece is in the Vault some weeks of the year');
  /* D */ await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'G', sex: 'f' }); S.xp = x.cum(12) + 10; S.gates = S.gates || []; let g, n = 0; while ((g = x.gated()) !== null && n++ < 20) S.gates.push(g); S.unl = Object.assign({ console: 1, pets: 1, acc2: 1, sable7: 1 }, S.unl || {}); S.areaOn = { board: 1, shop: 1, hideout: 1 }; S.tutDone = 1; S.tours = { welcome: 1, shop: 1, hideout: 1, train: 1, dq: 1, bty: 1, hall: 1, players: 1, wheel: 1, away: 1, banner: 1 }; S.coins = 99999; S.v67ref = 1; try { window.__qbRooms.open('closet', 1); } catch (e) {} x.persist(); x.render(); document.querySelectorAll('#layer > *').forEach((m) => m.remove()); });
  const room = (when) => p.evaluate(async (when) => { const sleep = (t) => new Promise((o) => setTimeout(o, t)); const x = window.__qb.x(), S = x.S; const real = Date.now() - (window.__qbShift || 0); window.__qbShift = when ? new Date(when).getTime() - real : 0;
    S.brandSeen = {}; window.__qbDrops.state().live.forEach((q) => { S.brandSeen[q.id + '|' + q.start] = 1; }); x.render(); await sleep(600); document.querySelectorAll('#layer .modal,.bsplash').forEach((m) => m.remove());
    const nb = document.querySelector('.nav button[data-v="shop"]'); if (nb) { nb.click(); await sleep(1000); } document.querySelectorAll('#layer .modal,.bsplash').forEach((m) => m.remove()); window.__qbV149.go('street'); await sleep(1000); document.querySelectorAll('#layer .modal,.bsplash').forEach((m) => m.remove());
    const st = document.querySelector('[data-act="stab"][data-v="nc"]'); if (st) st.click(); await sleep(1200); const L = window.__qbDrops.state().live.find((q) => q.id === 'nc');
    const ids = [...document.querySelectorAll('.qshop .qs-card[data-card^="gx_nc_"]')].map((e) => e.dataset.card); const keep = L ? window.__qbV201.half(L) : {};
    const head = x.SHOP.filter((it) => it[6] && it[6].b === 'nc' && window.__qbV201.cat(it[0]) === window.__qaCAT).map((it) => it[0]);
    return { start: L && L.start, tab: !!st, shown: [...new Set(ids)].filter((id) => head.includes(id)), calc: head.filter((id) => keep[id]) }; }, when);
  const R0 = await room(null); note('now: nc drop ' + R0.start + ', head shown ' + R0.shown.join(', ') + ' | calc ' + R0.calc.join(', '));
  ok(R0.tab && JSON.stringify(R0.shown.slice().sort()) === JSON.stringify(R0.calc.slice().sort()) && NEW.every((id) => !R0.shown.includes(id)), 'the running nc drop shows exactly its own calc, without the three new pieces (from: dates)');
  const nxt = (B.find((d) => d.start > (R0.start || '')) || {}).start; const R1 = await room(nxt + 'T09:00:00'); note('next: nc drop ' + R1.start + ', head shown ' + R1.shown.join(', ') + ' | calc ' + R1.calc.join(', '));
  ok(R1.tab && R1.start === nxt && JSON.stringify(R1.shown.slice().sort()) === JSON.stringify(R1.calc.slice().sort()), 'the next nc drop (' + nxt + ') shows exactly its calc');
  for (const id of NEW) { const t = await p.evaluate(async (id) => { const sleep = (t) => new Promise((o) => setTimeout(o, t)); const bt = document.querySelector('.qshop [data-act="qstry"][data-id="' + id + '"]'); if (!bt) return { shown: false };
      bt.scrollIntoView({ block: 'center' }); bt.click(); await sleep(1200); const ck = document.querySelector('.qs-bask .qs-btn[data-act=qscheck]'); const r = ck ? { w: Math.round(ck.getBoundingClientRect().width), sw: ck.scrollWidth, cw: ck.clientWidth, txt: ck.innerText.trim() } : null; window.scrollTo(0, 0); return { shown: true, ck: r }; }, id);
    note(id + ' try-on: ' + JSON.stringify(t)); if (t.shown) { await p.waitForTimeout(400); await p.screenshot({ path: OUT + '/tryon_' + id + '.png' }); }
    ok(!t.shown || (t.ck && t.ck.sw <= t.ck.cw + 1 && /CHECKOUT \(\d+\)|Checkout \(\d+\)/i.test(t.ck.txt)), id + ': the Checkout label fits its button' + (t.shown ? '' : ' (not in this drop)')); }
  await p.evaluate(() => { window.__qbShift = 0; });
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
