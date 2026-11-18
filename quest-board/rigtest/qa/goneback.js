// v1.19 (LEAD 205d8df, Cal: "The ninja ones are cool."): SMOKE BOMB's 12 come back, the durag and bandana stay gone. QA's save round
// trips on top of LEAD's gone.js, each a save put in local storage and loaded (as a cloud merge replaces the whole save):
//  A. a v1.18-refunded save with enough coins: the 12 come back to S.owned, the refund comes off, the durag/bandana stay refunded and
//     out; a reload repeats nothing.
//  B. the same with fewer coins than the refund: coins stop at 0, the pieces still come back.
//  C. a stale pre-v1.18 save (owns all 14, no S.goneRef): only the durag and bandana are refunded, the 12 stay owned (and worn).
//  D. SMOKE BOMB's rows: on sale as before v1.18 (only the audit's vest and cloak cut); its subtitle; it drops on some floor in 120 days.
//   BASE=<plain build server> NODE_PATH=<playwright's parent> node rigtest/qa/goneback.js
const pw = require('playwright');
const SMK = ['gx_smk_band', 'gx_smk_wrap', 'gx_smk_cowl', 'gx_smk_tape', 'gx_smk_pouch', 'gx_smk_mesh', 'gx_smk_cargo', 'gx_smk_hakama', 'gx_smk_shorts', 'gx_smk_sandal', 'gx_smk_tabi', 'gx_smk_runner'], OB = ['gx_o_durag', 'gx_o_bandana'];
let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await pw.chromium.launch({ args: ['--mute-audio'] }); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 150)));
  const pops = []; await p.exposeFunction('qaPop', (t) => pops.push(t));
  const ready = async () => { await p.waitForFunction(() => window.__qb && window.__qb.x, null, { timeout: 120000 }); await p.waitForTimeout(600);
    await p.evaluate(() => { new MutationObserver((ms) => ms.forEach((m) => m.addedNodes.forEach((n) => { if (n.classList && n.classList.contains('pop')) window.qaPop(n.textContent); }))).observe(document.getElementById('layer'), { childList: true }); }); };
  await p.goto(process.env.BASE + '/dist/index.html'); await ready();
  // a base save to edit
  const info = await p.evaluate(async (all) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(30); S.calm = false; S.welcomed = 1;
    S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, loft: 1, town: 1, shop: 1, players: 1, hall: 1, freeze: 1 }; S.owned = {}; S.goneRef = {}; S.eq = {}; S.coins = 0; x.persist();
    const pr = {}; all.forEach((id) => { pr[id] = +(x.SHOP.find((it) => it[0] === id) || [0, 0, 0, 0])[3] || 0; }); return { pr }; }, SMK.concat(OB));
  await p.waitForTimeout(1500); const base = JSON.parse(await p.evaluate(() => localStorage.getItem('quest-board')));
  const sum = (ids) => ids.reduce((a, id) => a + info.pr[id], 0), refSmk = sum(SMK), refOb = sum(OB);
  const run = async (save) => { await p.evaluate((js) => localStorage.setItem('quest-board', js), JSON.stringify(save)); pops.length = 0; await p.reload(); await ready(); await p.waitForTimeout(6500);
    return p.evaluate(([SMK, OB]) => { const S = window.__qb.x().S; return { coins: S.coins, smkOwned: SMK.filter((id) => S.owned[id]).length, obOwned: OB.filter((id) => S.owned[id]).length,
      ref: Object.keys(S.goneRef || {}).sort(), eq: Object.values(S.eq || {}) }; }, [SMK, OB]); };
  const v118 = (coins) => { const s = JSON.parse(JSON.stringify(base)); s.coins = coins; s.owned = { gx_o_5panel: true }; s.eq = {}; s.goneRef = {}; SMK.concat(OB).forEach((id) => { s.goneRef[id] = info.pr[id] || 1; }); return s; };
  // A
  let r = await run(v118(10000)); const pA = pops.slice();
  ok(r.smkOwned === 12 && r.coins === 10000 - refSmk && r.obOwned === 0 && r.ref.join() === OB.slice().sort().join(), `A: the 12 back, -${refSmk} (10000 -> ${r.coins}); durag and bandana still refunded and out; goneRef ${r.ref.join(' ')}; pops ${JSON.stringify(pA)}`);
  const again = await (async () => { pops.length = 0; await p.reload(); await ready(); await p.waitForTimeout(6500); return p.evaluate(() => window.__qb.x().S.coins); })();
  ok(again === r.coins && !pops.length, `A: reload repeats nothing (${again})`);
  // B
  r = await run(v118(500));
  ok(r.smkOwned === 12 && r.coins === 0, `B: fewer coins than the refund (500 < ${refSmk}): the 12 back, coins stop at ${r.coins}`);
  // C
  const st = JSON.parse(JSON.stringify(base)); st.coins = 1000; st.owned = {}; SMK.concat(OB).forEach((id) => { st.owned[id] = true; }); st.goneRef = {}; st.eq = { a_hat: 'gx_o_durag', a_pants: 'gx_smk_hakama' };
  r = await run(st);
  ok(r.coins === 1000 + refOb && r.smkOwned === 12 && r.obOwned === 0 && r.eq.join() === 'gx_smk_hakama', `C: a stale pre-v1.18 save: only the durag and bandana refunded (+${refOb} -> ${r.coins}), the 12 kept, the hakama still worn (${r.eq.join(' ')})`);
  // D
  const d = await p.evaluate(() => { const x = window.__qb.x(), rows = x.SHOP.filter((it) => it[6] && it[6].b === 'smk').map((it) => it[0].replace('gx_smk_', '') + (it[6].cut ? '(cut)' : '') + (it[6].gone ? '(gone)' : ''));
    const B = typeof BRANDS !== 'undefined' ? BRANDS : null; let live = 0, first = null; const D = window.__qbDrops, t0 = Date.now();
    for (let k = 0; k < 120; k++) { const t = t0 + k * 864e5; ['street', 'boutique', 'atelier'].forEach((f) => { let fl = null; try { fl = D.floor(f, t); } catch (e) {} if (fl && (fl.live || []).some((q) => q.id === 'smk')) { live++; if (first === null) first = k; } }); }
    return { rows: rows.join(' '), live, first }; });
  ok(!/gone/.test(d.rows) && (d.rows.match(/\(cut\)/g) || []).length === 2 && /vest\(cut\)/.test(d.rows) && /cloak\(cut\)/.test(d.rows), 'D: SMOKE BOMB rows as before v1.18 (only the audit cuts): ' + d.rows);
  ok(d.live > 0, `D: SMOKE BOMB drops again (live on ${d.live} floor-days in 120; first in ${d.first} days)`);
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 2)));
  await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
