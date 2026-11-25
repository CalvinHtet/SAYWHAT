// v1.66 (Cal 11-25): no brand keeps more than 6 on-sale pieces in a category (hat, top, bottom, shoes); the 14 plainest extras are
// off sale; an owner of one still gets it (itemFits true), a non-owner does not.
//   PORT=<build server> NODE_PATH=<playwright's parent> node rigtest/lead/cut166.js
const { chromium } = require('playwright');
let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch({ args: ['--mute-audio'] }); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 150)));
  await p.goto('http://127.0.0.1:' + (process.env.PORT || 8838) + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbV166, null, { timeout: 90000 }); await p.waitForTimeout(500);
  const r = await p.evaluate(() => { const x = window.__qb.x(), S = x.S, H = window.__qbV166; const cat = { a_top: 'top', a_pants: 'bottom', a_shoes: 'shoes', a_hat: 'hat' };
    const n = {}; x.SHOP.forEach((it) => { const m = it && it[6]; if (!m || !m.b || m.cut || !cat[it[1]] || !/^gx_/.test(it[0])) return; const k = m.b + '/' + cat[it[1]]; n[k] = (n[k] || 0) + 1; });
    const over = Object.keys(n).filter((k) => n[k] > 6).map((k) => k + ' ' + n[k]);
    const res = []; H.cut.forEach((id) => { const it = x.SHOP.find((q) => q[0] === id); const m = it[6]; S.char = window.__qb.fixChar({ name: 'Cal', sex: m.fo && !m.mo ? 'f' : 'm' }); S.owned = {}; const a = H.fits(id); S.owned = {}; S.owned[id] = 1; const o = H.fits(id); res.push({ id, cut: !!m.cut, notOwned: a, owned: o }); });
    S.owned = {}; return { over, res, total: H.cut.length }; });
  ok(r.total === 14, 'fourteen pieces on the cut list');
  ok(r.over.length === 0, 'no brand has more than 6 on sale in a category ' + JSON.stringify(r.over));
  const wrong = r.res.filter((o) => !o.cut || o.notOwned !== false || o.owned !== true);
  ok(!wrong.length, 'every cut piece: off sale for a non-owner, still there for an owner ' + JSON.stringify(wrong));
  await b.close(); console.log('errors', JSON.stringify(errs.slice(0, 3))); console.log(bad || errs.length ? 'FAILED ' + bad : 'PASS'); })();
