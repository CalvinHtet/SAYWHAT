// QA, v1.49 (29zz_v153.js, Cal 11-24: "Refund all the shop items I bought for my character"). The sandbox web build (its own uid
// "sandbox"). A character made in the creator, then 8 Shop pieces owned and 4 of them worn, coins and spent written in. Then a reload:
//   NORMAL  QB_WEB.owners as shipped (Cal's uid only): nothing may change (no refund, S.ref53 unset)
//   OWNER   QB_WEB.owners also lists "sandbox" (config.js served with it added): the 8 come off and their prices come back, spent goes
//           down by the same, the creator's own pieces stay, the character wears nothing it no longer owns; a second reload pays nothing
//   WEB=<server of quest-board/ with a sandbox dist-web> OWNER=0|1 OUT=<dir> node refund153.js
const pw = require('playwright');
const WEB = process.env.WEB, OWNER = process.env.OWNER === '1', OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.route('**/*', async (r) => { const u = r.request().url(); if (!u.startsWith('http://127.0.0.1:')) return r.abort();
    if (OWNER && /\/dist-web\/config\.js/.test(u)) { const res = await r.fetch(); return r.fulfill({ response: res, body: (await res.text()) + '\nwindow.QB_WEB.owners = (window.QB_WEB.owners || []).concat(["sandbox"]);\n' }); }
    return r.continue(); });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 200)));
  const ready = () => p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbV153 && document.querySelector('.nav button, #ccname'), null, { timeout: 180000 });
  await p.goto(WEB + '/dist-web/index.html'); await p.waitForFunction(() => document.querySelector('[data-act="ccnext"]'), null, { timeout: 180000 });
  await p.fill('#ccname', 'Refund'); await p.click('[data-act="ccnext"]'); await p.waitForFunction(() => document.querySelector('[data-act="ccdone"]'), null, { timeout: 120000 }); await p.waitForTimeout(800); await p.click('[data-act="ccdone"]');
  await ready(); await p.waitForTimeout(3000);
  const seeded = await p.evaluate(() => { const x = window.__qb.x(), S = x.S; const orig = Object.keys(S.owned || {}); const eq0 = JSON.stringify(S.eq || {});
    const pick = x.SHOP.filter((it) => /^a_(top|pants|shoes|hat|acc)$/.test(it[1]) && it[3] > 0 && !S.owned[it[0]] && (it[6] || {}).b && it[6].b !== 'basics').slice(0, 8);
    pick.forEach((it) => { S.owned[it[0]] = true; }); const worn = {}; pick.forEach((it) => { if (!worn[it[1]]) worn[it[1]] = it[0]; }); Object.keys(worn).slice(0, 4).forEach((sl) => { S.eq = S.eq || {}; S.eq[sl] = worn[sl]; });
    const sum = pick.reduce((a, it) => a + it[3], 0); S.coins = 1000; S.spent = sum + 500; delete S.ref53; x.persist(); x.render();
    return { orig, eq0, picked: pick.map((it) => [it[0], it[3]]), sum, eq: JSON.stringify(S.eq), coins: S.coins, spent: S.spent }; });
  console.log('     made in the creator with ' + seeded.orig.length + ' pieces of its own; then owned 8 Shop pieces worth ' + seeded.sum + ', wearing ' + seeded.eq);
  await p.waitForTimeout(3000); await p.screenshot({ path: OUT + '/refund_' + (OWNER ? 'owner' : 'normal') + '_before.png' });
  await p.reload(); await ready(); await p.waitForTimeout(5000);
  const a = await p.evaluate((ids) => { const S = window.__qb.x().S; return { coins: S.coins, spent: S.spent, ref: JSON.stringify(S.ref53 || null), still: ids.filter((id) => S.owned[id]).length, eq: JSON.stringify(S.eq || {}), origKept: null, wornGone: Object.values(S.eq || {}).filter((id) => !S.owned[id] && !(window.__qb.x().SHOP.find((r) => r[0] === id) || [])[3] === false).length, pops: [...document.querySelectorAll('.pop')].map((e) => e.textContent).join(' | ') }; }, seeded.picked.map((q) => q[0]));
  const origKept = await p.evaluate((orig) => { const S = window.__qb.x().S; return orig.filter((id) => S.owned[id]).length; }, seeded.orig);
  const wornNotOwned = await p.evaluate(() => { const x = window.__qb.x(), S = x.S; return Object.entries(S.eq || {}).filter(([sl, id]) => { const it = x.SHOP.find((r) => r[0] === id); return it && it[3] > 0 && !S.owned[id]; }).map(([sl, id]) => sl + ':' + id); });
  console.log('     after a reload: coins ' + seeded.coins + ' -> ' + a.coins + ', spent ' + seeded.spent + ' -> ' + a.spent + ', the 8 still owned: ' + a.still + ', creator pieces kept ' + origKept + '/' + seeded.orig.length + ', wearing ' + a.eq + ', S.ref53 ' + a.ref);
  await p.screenshot({ path: OUT + '/refund_' + (OWNER ? 'owner' : 'normal') + '_after.png' });
  if (!OWNER) ok(a.coins === seeded.coins && a.still === 8 && a.ref === 'null', 'a normal player\'s save: no refund (coins, the 8 pieces and what is worn unchanged)');
  else { ok(a.coins === seeded.coins + seeded.sum && a.spent === seeded.spent - seeded.sum && a.still === 0, 'the owner\'s save: the 8 pieces come off and ' + seeded.sum + ' coins come back, spent down by the same');
    ok(origKept === seeded.orig.length, 'the creator\'s own pieces stay (' + origKept + '/' + seeded.orig.length + ')');
    ok(wornNotOwned.length === 0, 'nothing worn that is no longer owned ' + JSON.stringify(wornNotOwned));
    await p.waitForTimeout(3000); await p.reload(); await ready(); await p.waitForTimeout(4000); const c2 = await p.evaluate(() => window.__qb.x().S.coins); ok(c2 === a.coins, 'a second reload pays nothing more (' + a.coins + ' -> ' + c2 + ')'); }
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
