// The Rift Mask in the real game (LEAD's 6682998, v0.51): window.__qbDungeon.roll('m5') many times, the save left unchanged
// between rolls (roll only decides the gift; opening it is what adds a piece). With a Spire piece still missing the mask must never
// come; with tide, thorn and silence all found it comes at about .55 x 1/8 = 6.9% of rolls; once owned, never again.
// Also: the mask is never for sale in the Shop.
//   BASE=<server> node riftlive.js
const { open } = require('./lib.js');
(async () => {
  const { b, p, errs } = await open({ width: 1000, height: 900, owned: 'none' });
  const fails = [], oks = [], t = (c, m) => (c ? oks : fails).push(m);
  const run = (have, owned) => p.evaluate(({ have, owned }) => { const S = window.__qb.x().S, D = window.__qbDungeon, N = 6000;
    D.state(); S.trophy.amulet = {}; have.forEach((k) => (S.trophy.amulet[k] = 1)); if (owned) S.owned.gx_dg_riftmask = 1; else delete S.owned.gx_dg_riftmask;
    const c = {}; for (let i = 0; i < N; i++) { S.trophy._dry = 0; const g = D.roll('m5'); const k = g ? g.kind + (g.kind === 'piece' ? ':' + g.id : '') : 'none'; c[k] = (c[k] || 0) + 1; }
    return { N, c }; }, { have, owned });
  for (const [have, label] of [[[], 'no Spire pieces'], [['tide', 'thorn'], 'silence missing'], [['tide', 'thorn', 'silence'], 'all three found']]) {
    const r = await run(have, false), w = r.c.wear || 0, pct = (100 * w / r.N).toFixed(1);
    if (have.length < 3) t(w === 0, `${label}: mask ${w} of ${r.N} rolls ${JSON.stringify(r.c)}`);
    else t(w / r.N > 0.05 && w / r.N < 0.09, `${label}: mask ${w} of ${r.N} rolls (${pct}%, expected about 6.9%) ${JSON.stringify(r.c)}`);
  }
  const o = await run(['tide', 'thorn', 'silence'], true);
  t(!(o.c.wear), `already owned: mask ${o.c.wear || 0} of ${o.N} rolls`);
  const shop = await p.evaluate(async () => { const S = window.__qb.x().S; delete S.owned.gx_dg_riftmask; document.querySelectorAll('#layer .modal,.dropsplash').forEach((e) => e.remove());
    const nb = document.querySelector('.nav button[data-v="shop"]'); if (nb) nb.click(); await new Promise((o) => setTimeout(o, 900)); return /Rift Mask/.test(document.querySelector('#app').innerText); });
  t(!shop, `Shop tab lists the Rift Mask: ${shop}`);
  oks.forEach((m) => console.log('  ok   ' + m)); fails.forEach((m) => console.log('  FAIL ' + m));
  console.log('page errors', errs.length, errs.slice(0, 3));
  await b.close();
})();
