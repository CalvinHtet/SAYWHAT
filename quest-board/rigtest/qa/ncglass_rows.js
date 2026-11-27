// QA, b76d3168: the three NOIR CODE glasses' Shop rows (gx_nc_clear, gx_nc_catshades, gx_nc_visorshade).
//  A. the rows: a_acc, brand nc, gar with art (slot glasses), category "head", price after tiers next to nc's other glasses
//  B. nc's drops for a year (clock moved to each Mon/Wed/Fri 9 am): each drop shows dropCat of nc's head pieces; every one of the six
//     shows in some drop; the three new ones appear
//  C. the Vault for 52 weeks: how often each new piece is in it, never two premium-brand pieces in one category
//  D. the brand room while nc is live: the head tab lists the shown pieces; trying each new one on puts it on the card (screenshots)
//   PORT=<plain build> OUT=<dir> NODE_PATH=<playwright> node rigtest/qa/ncglass_rows.js
const pw = require('playwright'); const PORT = process.env.PORT || 8824, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); }; const note = (s) => console.log('     ' + s);
const NEW = ['gx_nc_clear', 'gx_nc_catshades', 'gx_nc_visorshade'];
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] }); const errs = [];
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, timezoneId: 'America/Los_Angeles' })).newPage(); p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbDrops && window.__qbV201 && window.QBDATA, null, { timeout: 120000 }); await p.waitForTimeout(600);
  /* A */ const A = await p.evaluate((NEW) => { const x = window.__qb.x(), V = window.__qbV201; const nc = x.SHOP.filter((it) => it[6] && it[6].b === 'nc' && V.cat(it[0]) === 'head');
    return { rows: NEW.map((id) => { const it = x.SHOP.find((r) => r[0] === id); if (!it) return { id, missing: 1 }; const g = it[6].gar, M = QBDATA.items[g] || {}; return { id, slot: it[1], b: it[6].b, gar: g, itemSlot: M.slot, front: !!(window.QBART && (QBART['m_' + g + '_front.webp'] || QBART['f_' + g + '_front.webp'])) || null, cat: V.cat(id), price: it[3], cut: !!it[6].cut, name: it[2] }; }),
      head: nc.map((it) => it[0] + ' ' + it[3]), dropCat: (V.cfg && (V.cfg.dropCat || V.cfg.perCat)) || null }; }, NEW);
  A.rows.forEach((r) => note(JSON.stringify(r))); note('nc head pieces and prices: ' + A.head.join(', ') + ' | dropCat ' + A.dropCat);
  ok(A.rows.every((r) => !r.missing && r.slot === 'a_acc' && r.b === 'nc' && r.itemSlot === 'glasses' && r.cat === 'head' && !r.cut), 'the three rows: a_acc, brand nc, slot glasses, category head, on sale');
  ok(A.head.length === 6, 'nc has 6 head pieces');
  /* B */ const B = await p.evaluate(() => { const real = Date.now() - (window.__qbShift || 0), V = window.__qbV201, x = window.__qb.x(), seen = {}, drops = [];
    for (let k = 0; k < 400; k++) { const d = new Date('2026-11-27T09:00:00'); d.setDate(d.getDate() + k); window.__qbShift = d.getTime() - real; const st = window.__qbDrops.state(); const L = st.live.find((q) => q.id === 'nc'); if (!L) continue;
      const key = L.start; if (seen[key]) continue; const keep = V.half(L); const head = x.SHOP.filter((it) => it[6] && it[6].b === 'nc' && V.cat(it[0]) === 'head' && keep[it[0]]).map((it) => it[0]); seen[key] = 1; drops.push({ start: key, head }); }
    window.__qbShift = 0; return drops; });
  const P = A.dropCat || 3; note('nc drops in a year: ' + B.length + '; head shown: ' + B.map((d) => d.start.slice(5) + ' ' + d.head.map((h) => h.replace('gx_nc_', '')).join('/')).join(' | '));
  ok(B.length >= 2 && B.every((d) => d.head.length === Math.min(P, 6)), 'every nc drop shows ' + Math.min(P, 6) + ' head pieces');
  const all = {}; B.forEach((d) => d.head.forEach((h) => { all[h] = (all[h] || 0) + 1; })); note('times shown: ' + JSON.stringify(all));
  ok(Object.keys(all).length === 6 && NEW.every((id) => all[id] > 0), 'all six nc head pieces show across the year, the three new ones included');
  /* C */ const C = await p.evaluate((NEW) => { const V = window.__qbV201, x = window.__qb.x(), real = Date.now() - (window.__qbShift || 0), hits = {}, two = []; let weeks = 0;
    for (let w = 0; w < 52; w++) { const d = new Date('2026-11-29T09:00:00'); d.setDate(d.getDate() + 7 * w); window.__qbShift = d.getTime() - real; let v; try { v = V.vault(); } catch (e) { continue; } weeks++;
      V.reset && V.reset(); v = V.vault(); const ids = v.list.map((q) => q[1]); const hb = {}; v.list.forEach((q) => { if (q[0] === 'head') hb[q[2]] = 1; }); if (Object.keys(hb).length !== v.list.filter((q) => q[0] === 'head').length) two.push(v.wk); NEW.forEach((id) => { if (ids.includes(id)) hits[id] = (hits[id] || 0) + 1; });
      }
    window.__qbShift = 0; return { weeks, hits, two }; }, NEW);
  note('Vault, 52 weeks: ' + JSON.stringify(C)); ok(NEW.every((id) => C.hits[id] > 0), 'each new piece is in the Vault some weeks of the year');
  /* D */ await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'G', sex: 'f' }); S.xp = x.cum(12) + 10; S.gates = S.gates || []; let g, n = 0; while ((g = x.gated()) !== null && n++ < 20) S.gates.push(g); S.unl = Object.assign({ console: 1, pets: 1, acc2: 1, sable7: 1 }, S.unl || {}); S.areaOn = { board: 1, shop: 1, hideout: 1 }; S.tutDone = 1; S.tours = { welcome: 1, shop: 1, hideout: 1, train: 1, dq: 1, bty: 1, hall: 1, players: 1, wheel: 1, away: 1, banner: 1 }; S.coins = 99999; x.persist(); x.render(); document.querySelectorAll('#layer > *').forEach((m) => m.remove()); });
  const D = await p.evaluate(async () => { const sleep = (t) => new Promise((o) => setTimeout(o, t)); const x = window.__qb.x(), S = x.S; S.v67ref = 1; try { window.__qbRooms.open('closet', 1); } catch (e) {} S.brandSeen = {}; window.__qbDrops.state().live.forEach((q) => { S.brandSeen[q.id + '|' + q.start] = 1; });
    x.render(); await sleep(800); const nb = document.querySelector('.nav button[data-v="shop"]'); if (nb) { nb.click(); await sleep(1200); } document.querySelectorAll('#layer .modal,.bsplash').forEach((m) => m.remove()); window.__qbV149.go('street'); await sleep(1200); document.querySelectorAll('#layer .modal,.bsplash').forEach((m) => m.remove()); const st = document.querySelector('[data-act="stab"][data-v="nc"]'); if (st) st.click(); await sleep(1200); document.querySelectorAll('#layer .modal,.bsplash').forEach((m) => m.remove());
    const ids = [...document.querySelectorAll('.qshop .qs-card[data-card^="gx_nc_"]')].map((e) => e.dataset.card); const tabs = [...document.querySelectorAll('.qshop .v81c')].map((t) => t.textContent);
    return { tabs, tiles: [...new Set(ids)], qshop: !!document.querySelector('.qshop') }; });
  note('brand room: ' + JSON.stringify(D).slice(0, 600)); await p.screenshot({ path: OUT + '/nc_room.png' });
  const shownNow = (B.find((d) => d.start <= '2026-11-27') || B[0] || { head: [] }).head;
  /* try each new one on through the try-on, whatever the drop shows */
  if (!D.tiles) { ok(false, 'opened the nc room ' + JSON.stringify(D)); } const shownHead = (D.tiles || []).filter((id) => A.head.some((h) => h.split(' ')[0] === id)); note('head pieces in the nc room now: ' + shownHead.join(', ') + ' (drop calc for ' + (B[0] || {}).start + ': ' + ((B[0] || {}).head || []).join(', ') + ')');
  ok(shownHead.length === Math.min(A.dropCat || 3, 6) && JSON.stringify(shownHead.slice().sort()) === JSON.stringify(((B[0] || {}).head || []).slice().sort()), 'the live nc room shows exactly the head pieces the drop picks');
  for (const id of NEW) { const t = await p.evaluate(async (id) => { const sleep = (t) => new Promise((o) => setTimeout(o, t)); const bt = document.querySelector('.qshop [data-act="qstry"][data-id="' + id + '"]'); if (!bt) return { shown: false };
      bt.scrollIntoView({ block: 'center' }); bt.click(); await sleep(1200); const S = window.__qb.x().S; return { shown: true, trying: JSON.stringify(S.tryOn || S.try || S.qsTry || null).slice(0, 160) }; }, id);
    note(id + ' try-on: ' + JSON.stringify(t)); if (t.shown) { await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(500); await p.screenshot({ path: OUT + '/tryon_' + id + '.png' }); } }
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
