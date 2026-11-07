const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://127.0.0.1:65410/dist/index.html'); await p.waitForFunction(() => document.querySelector('[data-act="ccnext"]'), null, { timeout: 60000 });
  await p.fill('#ccname', 'Cal'); await p.click('[data-act="ccnext"]'); await p.waitForFunction(() => document.querySelector('[data-act="ccdone"]'), null, { timeout: 60000 }); await p.waitForTimeout(800); await p.click('[data-act="ccdone"]'); await p.waitForTimeout(2500);
  const r = await p.evaluate(() => { const x = window.__qb.x(), S = x.S, R = window.__qbRooms, out = {}; ['garden', 'restaurant', 'boba', 'dessert'].forEach(t => R.open(t, 1)); S.earnedC = 999999;
    out.lockkey_noLinen = R.gate('lockkey'); const rs = S.base.slots.find(s => s && s.t === 'restaurant'); rs.a.r_t3 = 1; out.lockkey_linen = R.gate('lockkey');
    R.open('mall', 1); const ml = S.base.slots.find(s => s && s.t === 'mall'); ml.a = { ml_shop2: 1, ml_shop3: 1, ml_foun: 1 }; out.nova_noClothing = R.gate('nova'); ml.a.ml_shop1 = 1; out.nova_clothing = R.gate('nova'); return out; });
  console.log(JSON.stringify(r), errs.slice(0, 2)); await b.close(); })();
