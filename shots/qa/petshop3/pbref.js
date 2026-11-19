// QA: the Patio dog-bed refund pays once per save. A local save owning both beds: load, refund (+400), then reload the same saved
// state twice and wait; the coins must not move again. Every network call outside the local server is blocked (no cloud, ever).
const pw = require('playwright'); const base = process.env.BASE; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await pw.chromium.launch(); const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  await ctx.route('**/*', (r) => (r.request().url().startsWith(base) ? r.continue() : r.abort()));
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  const boot = async () => { await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && QBLoft.data, null, { timeout: 90000 }); };
  const st = () => p.evaluate(() => { const S = window.__qb.x().S; return { coins: S.coins, spent: S.spent, pbref: S.pbref || null, saved: (() => { try { const j = JSON.parse(localStorage.getItem('quest-board') || '{}'); return { coins: j.coins, pbref: j.pbref || null }; } catch (e) { return null; } })() }; });
  await boot(); await p.waitForTimeout(800);
  const info = await p.evaluate(() => { const A = window.__qb.x().ADDONS || {}; return { bd: (A.bedroom || []).map((a) => a[0]), pt: (A.patio || []).map((a) => a[0]) }; });
  await p.evaluate((info) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(35); S.gates = Array.from({ length: 200 }, (_, i) => i); S.areaOn = { board: 1, shop: 1, hideout: 1 }; S.coins = 1000; S.spent = 5000; delete S.pbref;
    S.base.slots = [{ t: 'bedroom', a: Object.fromEntries(info.bd.map((k) => [k, 1])), st: 0, pend: 0 }, { t: 'patio', a: Object.fromEntries(info.pt.map((k) => [k, 1])), st: 0, pend: 0 }]; x.persist(); }, info);
  await p.waitForTimeout(4000); const a = await st();
  ok(a.coins === 1400 && a.spent === 4600 && a.pbref && a.pbref.c === 400, 'first load pays 400 once: coins 1000 -> ' + a.coins + ', spent 5000 -> ' + a.spent + ', pbref ' + JSON.stringify(a.pbref));
  ok(a.saved && a.saved.coins === 1400 && a.saved.pbref, 'the refund and its mark are saved locally ' + JSON.stringify(a.saved));
  for (const n of [1, 2]) { await boot(); await p.waitForTimeout(6000); const s = await st(); ok(s.coins === 1400 && s.pbref && s.pbref.at === a.pbref.at, 'reload ' + n + ': coins stay ' + s.coins + ', same pbref'); }
  // a save that owns no Patio dog bed: marked, nothing paid
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S; delete S.pbref; S.coins = 1000; S.base.slots.forEach((r) => { if (r.t === 'patio') { delete r.a.pt_dbed; delete r.a.pt_dbed2; } }); x.persist(); }); await p.waitForTimeout(4000);
  const z = await st(); ok(z.coins === 1000 && z.pbref && z.pbref.c === 0, 'no beds owned: nothing paid, marked c 0 (' + z.coins + ')');
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 2))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
