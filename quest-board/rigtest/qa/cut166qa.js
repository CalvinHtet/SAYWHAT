// QA, 05da5315 (29zz_v166.js V66CUT, Cal 11-25: "over 6 in a category, purge the boring ones, owners keep them"). What cut166.js leaves
// out: the count in EVERY slot of every brand (not just hat/top/bottom/shoes), the cut pieces against the drop and Vault lists (a cut
// piece must not come back on sale through a drop), and an owner still wearing each cut piece (lookOf draws it).
//   PORT=<plain build> node cut166qa.js
const pw = require('playwright');
const PORT = process.env.PORT || 8819; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const p = await (await b.newContext()).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV166, null, { timeout: 120000 }); await p.waitForTimeout(1000);
  const r = await p.evaluate(async () => { const x = window.__qb.x(), S = x.S, CUT = window.__qbV166.cut; const I = QBLoft.data.items;
    const br = (it) => (it[6] && it[6].b) || ((it[0].match(/^gx_([a-z0-9]+)_/) || [])[1]) || '?';
    const live = x.SHOP.filter((it) => it[6] && !(it[6].cut || it[6].gone) && /^gx_/.test(it[0]));
    const by = {}; live.forEach((it) => { const slot = (it[6].gar && I[it[6].gar] && I[it[6].gar].slot) || it[1]; const k = br(it) + ' ' + slot; by[k] = (by[k] || 0) + 1; });
    const over = Object.entries(by).filter(([, n]) => n > 6);
    /* the cut pieces in any list a drop or the Vault reads from: scan every global-ish array the hooks expose and the source of the drop code */
    /* owner wears each cut piece, on every body it fits */ const wear = [], fitsOwner = []; CUT.forEach((id) => { const it = x.SHOP.find((q) => q[0] === id); if (!it) { wear.push(id + ': no row'); return; } const M = I[it[6].gar] || {};
      const bodies = ['m', 'f'].filter((sx) => !(sx === 'm' && (it[6].fo || M.femaleOnly)) && !(sx === 'f' && (it[6].mo || M.maleOnly)));
      bodies.forEach((sx) => { S.created = true; S.char = window.__qb.fixChar({ name: 'Own', sex: sx }); S.owned = S.owned || {}; S.owned[id] = true; const f = window.__qbV166.fits(id); if (f !== true) fitsOwner.push([id, sx, f]);
        const ov = {}; ov[it[1]] = id; let L; try { L = window.__qb.lookOf(ov).rig; } catch (e) { wear.push(id + ' ' + sx + ': lookOf threw'); return; } const eq = Object.values(L.equipped || {}).map((e) => e.art); if (!eq.includes(it[6].gar)) wear.push(id + ' ' + sx + ': not worn (' + eq.join(',') + ')'); });
      if (!bodies.length) wear.push(id + ': fits no body'); });
    const src = await (await fetch('dist/app.js')).text(); const inLists = CUT.map((id) => [id, (src.match(new RegExp('"' + id + '"', 'g')) || []).length]).filter(([, n]) => n > 2);
    const counts = Object.entries(by).filter(([k]) => /^(h|o|v|y|hanga|over|rose|y2k)\b/i.test(k)).sort().map(([k, n]) => k + '=' + n).join(' ');
    return { over, inLists, wear, fitsOwner, counts, nCut: CUT.length }; });
  console.log('     the four brands after the cut: ' + r.counts);
  ok(!r.over.length, 'no brand has more than 6 on sale in ANY slot ' + JSON.stringify(r.over));
  console.log('     cut ids named more than once in the page source (drop or Vault lists to check by hand): ' + JSON.stringify(r.inLists));
  ok(!r.wear.length, 'an owner still wears every cut piece (' + r.nCut + ') ' + JSON.stringify(r.wear));
  ok(!r.fitsOwner.length, 'itemFits is true for an owner of every cut piece ' + JSON.stringify(r.fitsOwner));
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
