// QA, v1.49 (29zz_v153.js, Cal 11-24: "Refund all the shop items I bought for my character"). The sandbox web build (its own uid
// "sandbox"). A character made in the creator, then 8 Shop pieces owned and 4 of them worn, coins and spent written in. Then a reload:
//   NORMAL  QB_WEB.owners as shipped (Cal's uid only): nothing may change (no refund, S.ref53 unset)
//   OWNER   QB_WEB.owners also lists "sandbox" (config.js served with it added). Since f15055ae (Cal: "Bought only") a one-time tick
//           list (.v53ref) instead of an automatic refund: it lists the 8 and not the creator's pieces, all ticked, with a total, and fits
//           the screen. "Later" changes nothing and leaves S.ref53 unset; the next launch asks again. Then one worn piece unticked and
//           "Refund the ticked pieces" (#v53go): the other 7 come off for their prices (spent down by the same), the unticked one stays
//           owned and worn, the creator's pieces stay, nothing worn that is no longer owned; a further reload shows no list, pays nothing
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
  const list = () => p.evaluate(() => { const m = document.querySelector('#layer .v53ref'); if (!m) return null; const r = m.getBoundingClientRect();
    return { ids: [...m.querySelectorAll('.v53row input')].map((q) => q.dataset.id), ticked: [...m.querySelectorAll('.v53row input')].filter((q) => q.checked).length, tot: (m.querySelector('.v53tot') || {}).textContent || '', l: Math.round(r.left), r: Math.round(r.right), vw: innerWidth }; });
  await p.reload(); await ready(); await p.waitForTimeout(5000);
  const L1 = await list(); const s1 = await p.evaluate(() => { const S = window.__qb.x().S; return { coins: S.coins, ref: JSON.stringify(S.ref53 || null), own: Object.keys(S.owned).length }; });
  if (!OWNER) { ok(!L1 && s1.coins === seeded.coins && s1.ref === 'null', 'a normal player\'s save: no list, no refund (coins ' + seeded.coins + ' -> ' + s1.coins + ')'); }
  else {
    console.log('     after a reload, the list: ' + JSON.stringify(L1)); await p.screenshot({ path: OUT + '/refund_list.png' });
    const ids8 = seeded.picked.map((q) => q[0]);
    ok(L1 && ids8.every((id) => L1.ids.includes(id)) && !seeded.orig.some((id) => L1.ids.includes(id)) && L1.ticked === L1.ids.length, 'the list names the 8, not the creator\'s pieces, all ticked');
    ok(L1 && new RegExp(seeded.sum.toLocaleString('en-US').replace(/,/g, ',?')).test(L1.tot), 'its total reads ' + seeded.sum + ' (' + (L1 && L1.tot) + ')');
    ok(L1 && L1.l >= 0 && L1.r <= L1.vw, 'the list fits the screen at 390');
    /* Later */
    const lt = await p.evaluate(() => { const b = [...document.querySelectorAll('#layer .v53ref button')].find((e) => /later/i.test(e.textContent)); const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }); await p.mouse.click(lt.x, lt.y); await p.waitForTimeout(1500);
    const s2 = await p.evaluate(() => { const S = window.__qb.x().S; return { coins: S.coins, ref: JSON.stringify(S.ref53 || null), own: Object.keys(S.owned).length, open: !!document.querySelector('#layer .v53ref') }; });
    ok(s2.coins === seeded.coins && s2.ref === 'null' && s2.own === s1.own && !s2.open, '"Later": closed, nothing refunded, S.ref53 unset (' + JSON.stringify(s2) + ')');
    await p.waitForTimeout(1500); await p.reload(); await ready(); await p.waitForTimeout(5000); const L2 = await list(); ok(!!L2, 'the next launch asks again');
    /* untick one worn piece, then refund */
    const keep = await p.evaluate(() => { const S = window.__qb.x().S; const worn = Object.values(S.eq || {}); const q = [...document.querySelectorAll('#layer .v53ref .v53row input')].find((e) => worn.includes(e.dataset.id)); q.scrollIntoView(); const r = q.getBoundingClientRect(); return { id: q.dataset.id, c: +q.dataset.c, x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
    await p.mouse.click(keep.x, keep.y); await p.waitForTimeout(400); const L3 = await list(); console.log('     unticked ' + keep.id + ' (' + keep.c + '): ' + L3.ticked + ' ticked, ' + L3.tot);
    ok(L3.ticked === L3.ids.length - 1 && new RegExp((seeded.sum - keep.c).toLocaleString('en-US').replace(/,/g, ',?')).test(L3.tot), 'the total follows the tick (' + (seeded.sum - keep.c) + ')');
    const go = await p.evaluate(() => { const r = document.querySelector('#v53go').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }); await p.mouse.click(go.x, go.y); await p.waitForTimeout(2500);
    const a = await p.evaluate(([ids, keep, orig]) => { const x = window.__qb.x(), S = x.S; return { coins: S.coins, spent: S.spent, ref: JSON.stringify(S.ref53 || null), gone: ids.filter((id) => id !== keep && !S.owned[id]).length, kept: !!S.owned[keep], keptWorn: Object.values(S.eq || {}).includes(keep), origKept: orig.filter((id) => S.owned[id]).length,
      wornNotOwned: Object.entries(S.eq || {}).filter(([sl, id]) => { const it = x.SHOP.find((r) => r[0] === id); return it && it[3] > 0 && !S.owned[id]; }).map(([sl, id]) => sl + ':' + id), pops: [...document.querySelectorAll('.pop')].map((e) => e.textContent).join(' | ') }; }, [ids8, keep.id, seeded.orig]);
    console.log('     after Refund: ' + JSON.stringify(a)); await p.screenshot({ path: OUT + '/refund_owner_after.png' });
    ok(a.coins === seeded.coins + seeded.sum - keep.c && a.spent === seeded.spent - (seeded.sum - keep.c) && a.gone === 7, 'the 7 ticked come off and ' + (seeded.sum - keep.c) + ' coins come back, spent down by the same');
    ok(a.kept && a.keptWorn, 'the unticked piece stays owned and worn');
    ok(a.origKept === seeded.orig.length, 'the creator\'s own pieces stay (' + a.origKept + '/' + seeded.orig.length + ')');
    ok(a.wornNotOwned.length === 0, 'nothing worn that is no longer owned ' + JSON.stringify(a.wornNotOwned));
    await p.waitForTimeout(3000); await p.reload(); await ready(); await p.waitForTimeout(5000); const L4 = await list(); const c2 = await p.evaluate(() => window.__qb.x().S.coins); ok(!L4 && c2 === a.coins, 'a further reload: no list, nothing paid (' + a.coins + ' -> ' + c2 + ')');
  }
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
