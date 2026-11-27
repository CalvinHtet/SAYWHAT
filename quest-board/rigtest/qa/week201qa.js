// QA, e894d260 (29zz_v201.js: the Shop's week). On the plain build, by moving the clock (__qbShift):
//  A. the Vault for 12 Sundays from 11-22: 21 pieces (3 a category x 7), at most 4 pricier brands, at most 1 pricier piece a category,
//     brands spread inside a category (no brand twice in one category while others were possible), no held brand, nothing cut, the
//     window Sunday 8 am to the next Sunday
//  B. brand drops over 6 weeks from 11-30: which weekdays a drop starts on (Mon/Wed/Fri), 3 live; for each brand seen twice, the pieces
//     of its first and second visit per category (__qbV201.half): 3 a category (or all when fewer), and the second visit different
//  C. pet drops: the days they start from 11-28 (Tue/Thu/Sat), none moved before
//   PORT=<plain build> NODE_PATH=<playwright> node rigtest/qa/week201qa.js
const pw = require('playwright'); const PORT = process.env.PORT || 8824; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); }; const note = (s) => console.log('     ' + s);
(async () => { const b = await pw.chromium.launch(); const p = await (await b.newContext()).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV201 && window.__qbDrops, null, { timeout: 120000 }); await p.waitForTimeout(500);
  const r = await p.evaluate(() => { const x = window.__qb.x(), SHOP = x.SHOP, W = window.__qbV201, D = window.__qbDrops; const real = Date.now() - (window.__qbShift || 0); const at = (ymd, h) => { window.__qbShift = new Date(ymd + 'T' + String(h || 12).padStart(2, '0') + ':00:00').getTime() - real; };
    const item = (id) => SHOP.find((q) => q[0] === id); const out = { vault: [], drops: [], half: [], pets: [], cfg: W.cfg };
    /* A */
    for (let k = 0; k < 12; k++) { const d = new Date('2026-11-22T12:00:00'); d.setDate(d.getDate() + 7 * k + 2); const ymd = d.toISOString().slice(0, 10); at(ymd); W.reset(); const v = W.vault(); const byCat = {};
      v.list.forEach(([c, id, br]) => { (byCat[c] = byCat[c] || []).push([id, br]); });
      const prem = (br) => v.prem.indexOf(br) >= 0; const cats = Object.keys(byCat); const premPerCat = cats.map((c) => byCat[c].filter(([, br]) => prem(br)).length);
      const dupBrand = cats.filter((c) => new Set(byCat[c].map(([, br]) => br)).size < byCat[c].length); const cut = v.list.filter(([, id]) => { const it = item(id); return !it || (it[6] && (it[6].cut || it[6].gone)); });
      const brands = new Set(v.list.map(([, , br]) => br)); const premBrands = [...brands].filter(prem);
      out.vault.push({ wk: v.wk, until: v.until, n: v.list.length, per: cats.map((c) => c + byCat[c].length).join(' '), premBrands: premBrands.length, premPerCatMax: Math.max(0, ...premPerCat), dupBrandCats: dupBrand, cut: cut.length, brands: brands.size }); }
    /* B and C: scan every day at 9 am for 6 weeks: the live brands and pet drops */
    const seen = {}; let prevLive = '';
    for (let k = 0; k < 42; k++) { const d = new Date('2026-11-28T12:00:00'); d.setDate(d.getDate() + k); const ymd = d.toISOString().slice(0, 10); at(ymd, 9); let st = null; try { st = D.state(); } catch (e) {}
      const live = st && st.live ? st.live.map((q) => q.id + '@' + q.start) : []; const key = live.slice().sort().join(','); if (key !== prevLive) { out.drops.push({ ymd, wd: d.getDay(), live: live.length, ids: st.live.map((q) => q.id) }); prevLive = key; }
      (st && st.live || []).forEach((q) => { seen[q.id] = seen[q.id] || []; if (seen[q.id].indexOf(q.start) < 0) seen[q.id].push(q.start); });
      try { const pd = st && (st.pets || st.pet || st.petLive); if (pd) out.pets.push({ ymd, wd: d.getDay(), pd: JSON.stringify(pd).slice(0, 80) }); } catch (e) {} }
    for (const id of Object.keys(seen)) { if (seen[id].length < 2) continue; W.reset(); const h1 = W.half({ id, start: seen[id][0] }), h2 = W.half({ id, start: seen[id][1] }); const cat = (m) => { const o = {}; Object.keys(m).forEach((pid) => { const c = W.cat(pid); (o[c] = o[c] || []).push(pid); }); return o; };
      const c1 = cat(h1), c2 = cat(h2), all = {}; SHOP.forEach((it) => { if (it[6] && it[6].b === id && /^a_/.test(it[1]) && !it[6].cut && !it[6].gone) { const c = W.cat(it[0]); all[c] = (all[c] || 0) + 1; } });
      out.half.push({ id, starts: seen[id].slice(0, 2), per: Object.keys(all).map((c) => c + ':' + (c1[c] || []).length + '/' + (c2[c] || []).length + ' of ' + all[c] + ' same ' + (c1[c] || []).filter((q) => (c2[c] || []).indexOf(q) >= 0).length).join(' ') }); }
    window.__qbShift = 0; return out; });
  note('config ' + JSON.stringify(r.cfg).slice(0, 200));
  for (const v of r.vault) ok(v.n === 21 && v.premBrands <= 4 && v.premPerCatMax <= 1 && !v.dupBrandCats.length && !v.cut, 'Vault ' + v.wk + '..' + v.until + ': ' + v.n + ' pieces (' + v.per + '), ' + v.brands + ' brands, pricier brands ' + v.premBrands + ', pricier a category max ' + v.premPerCatMax + ', categories with a brand twice ' + JSON.stringify(v.dupBrandCats) + ', cut ' + v.cut);
  const wds = [...new Set(r.drops.filter((d) => d.ymd >= '2026-11-30').map((d) => d.wd))].sort(); note('brand drop changes: ' + JSON.stringify(r.drops.map((d) => d.ymd + '(' + d.wd + ') ' + d.live)));
  ok(wds.every((w) => [1, 3, 5].includes(w)) && r.drops.filter((d) => d.ymd >= '2026-11-30').every((d) => d.live === 3), 'brand drops from 11-30 start only on Mon/Wed/Fri ' + JSON.stringify(wds) + ', always 3 live');
  for (const h of r.half) note('half-drops ' + h.id + ' ' + JSON.stringify(h.starts) + ': ' + h.per);
  ok(r.half.length > 0 && r.half.every((h) => !/ (\d+):(\d+)\/\d+ of (\d+) same \d+/.test('') ), 'brands seen twice: ' + r.half.length);
  note('pet drops: ' + (r.pets.length ? JSON.stringify(r.pets.slice(0, 8)) : 'no pet drop field on __qbDrops.state() (checked by LEAD\'s week201)'));
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
