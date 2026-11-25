// Cal 11-25 (29zz_v173.js): banners from level 25 open five at a time, picked at random per player: rows marked "r" in data/banners.json
// are shuffled with the player's own seed (S.bseed); five open at 25, five at 30, ...; the tiers already out (10, 15, 20) do not move;
// the held seven are on sale (PCHOLD empty).
//   PORT=<build server> NODE_PATH=<playwright's parent> node rigtest/lead/ban173.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8838; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch(); const p = await (await b.newContext()).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV173 && window.__qbV152, null, { timeout: 90000 }); await p.waitForTimeout(500);
  const r = await p.evaluate(() => { const H = window.__qbV173, ids = Array.from({ length: 20 }, (_, i) => 'b' + i);
    const a = H.plan('seedA', ids), a2 = H.plan('seedA', ids.slice().reverse()), c = H.plan('seedB', ids);
    const tiers = (L) => { const o = {}; Object.values(L).forEach((v) => { o[v] = (o[v] || 0) + 1; }); return o; };
    const lv = H.levels(); const out = ['orrery', 'tidal', 'aurora', 'hoard_ink', 'sky_paper', 'ink_peaks', 'papercut', 'ink_bamboo', 'paper_village', 'ink_lake', 'ink_storm', 'paper_abyss', 'paper_city', 'ink_snow', 'glass_midnight'].map((id) => id + ':' + lv[id]);
    return { tA: tiers(a), same: JSON.stringify(a) === JSON.stringify(a2), differ: ids.some((id) => a[id] !== c[id]), first25: ids.filter((id) => a[id] === 25), out, hold: window.__qbV152.hold() }; });
  console.log('     ' + JSON.stringify(r));
  ok(JSON.stringify(r.tA) === JSON.stringify({ 25: 5, 30: 5, 35: 5, 40: 5 }), '20 "r" banners: five at each of 25, 30, 35 and 40 ' + JSON.stringify(r.tA));
  ok(r.same && r.differ, 'the same player always gets the same five; another player gets different ones');
  ok(r.out.every((s) => /:(10|15|20)$/.test(s)), 'the tiers already out stay at 10, 15 and 20');
  ok(r.hold.length === 0, 'the held seven are on sale (PCHOLD empty)');
  await b.close(); console.log(bad || errs.length ? 'FAILED ' + bad + ' ' + JSON.stringify(errs) : 'PASS'); })();
