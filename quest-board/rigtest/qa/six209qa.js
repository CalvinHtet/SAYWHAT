// QA, 051f5da6 (drops at 6 am Pacific; the Closet has one row of tabs, 29zz_v209.js). Plain build, the browser in America/Los_Angeles.
//  A. the turnover at 6: on Mon 11-30 and Wed 12-02 (brand drops) and Sun 12-06 (the Vault), the live brands and the Vault at 5:59 and
//     6:01: they change at 6:01, not at 5:59 and not at 8
//  B. the Closet with a mix of owned pieces (each Shop slot, masks and glasses, a basic, hair, eyes and marks): its tabs, each owned piece
//     under exactly one tab and under All, Hair and Face reachable, no brand chip row (.qs-wdbr) or category chip row (.qs-wdcat)
//   PORT=<plain build> OUT=<dir> NODE_PATH=<playwright> node rigtest/qa/six209qa.js
const pw = require('playwright'); const PORT = process.env.PORT || 8824, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); }; const note = (s) => console.log('     ' + s);
const T = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1, banner: 1, away: 1 };
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const errs = [];
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, timezoneId: 'America/Los_Angeles' }); await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
  const p = await ctx.newPage(); p.on('pageerror', (e) => errs.push(e.message.slice(0, 160))); await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV201 && window.__qbDrops && window.__qbV149, null, { timeout: 120000 }); await p.waitForTimeout(500);
  /* A */
  const A = await p.evaluate(() => { const real = Date.now() - (window.__qbShift || 0); const at = (s) => { window.__qbShift = new Date(s).getTime() - real; }; const live = () => { const st = window.__qbDrops.state(); return st.live.map((q) => q.id).sort().join(','); }; const vault = () => { window.__qbV201.reset(); return window.__qbV201.vault().wk; };
    const out = {}; for (const d of ['2026-11-30', '2026-12-02', '2026-12-04']) { out[d] = {}; for (const h of ['05:59', '06:01', '07:59', '08:01']) { at(d + 'T' + h + ':00'); out[d][h] = live(); } }
    out.vault = {}; for (const h of ['05:59', '06:01']) { at('2026-12-06T' + h + ':00'); out.vault[h] = vault(); } window.__qbShift = 0; return out; });
  for (const d of ['2026-11-30', '2026-12-02', '2026-12-04']) { const L = A[d]; ok(L['05:59'] !== L['06:01'] && L['06:01'] === L['07:59'] && L['07:59'] === L['08:01'], d + ' brand drop turns over at 6 am Pacific: 5:59 ' + L['05:59'] + ' | 6:01 ' + L['06:01'] + ' | 7:59 ' + L['07:59'] + ' | 8:01 ' + L['08:01']); }
  ok(A.vault['05:59'] !== A.vault['06:01'] && A.vault['06:01'] === '2026-12-06', 'the Vault turns over on Sunday 12-06 at 6 am: 5:59 week ' + A.vault['05:59'] + ', 6:01 week ' + A.vault['06:01']);
  /* B */
  const own = await p.evaluate((T) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Clo', sex: 'm' }); S.xp = x.cum(30) + 10; S.gates = S.gates || []; let g, n = 0; while ((g = x.gated()) !== null && n++ < 20) S.gates.push(g); S.tutDone = 1; S.coins = 99999; S.tours = T; S.v67ref = 1; S.cls = 'swiftblade'; S.unl = { console: 1, pets: 1, acc2: 1 }; S.mile = { since: 999, fx1: 1 };
      delete S.areaOn; try { window.__qbRooms.open('closet', 1); } catch (e) {} try { if (window.__qbV192 && window.__qbV192.due()) window.__qbV192.claim(); } catch (e) {} S.owned = S.owned || {};
      const want = ['gx_smk_hoodcap', 'gx_smk_ventmask', 'gx_smk_scoutlens', 'gx_smk_slitvisor', 'gx_smk_trailscarf', 'gx_smk_gauntlets', 'gx_smk_bomber', 'gx_smk_joggers', 'gx_smk_runner', 'gx_nc_shades', 'gx_nc_pendant'];
      const basics = x.SHOP.filter((it) => /^bs_(hair|eye|mark|dye)/.test(it[0])).slice(0, 4).map((it) => it[0]); const got = want.filter((id) => x.SHOP.some((it) => it[0] === id)).concat(basics); got.forEach((id) => { S.owned[id] = true; }); x.persist(); x.render(); return got; }, T);
  note('owned for the test: ' + JSON.stringify(own));
  await p.waitForTimeout(800); await p.evaluate(() => { document.querySelectorAll('#layer > *').forEach((m) => m.remove()); document.querySelector('.nav button[data-v="shop"]').click(); }); await p.waitForTimeout(800);
  await p.evaluate(() => { document.querySelectorAll('#layer > *').forEach((m) => m.remove()); window.__qbV149.go('closet'); }); await p.waitForTimeout(1200);
  const B = await p.evaluate(async (own) => { const ids = (root) => [...root.querySelectorAll('[data-id]')].map((e) => e.dataset.id).filter((id) => own.includes(id)); const tabs = [...document.querySelectorAll('.v81cats .v81c')]; const per = {};
    for (const t of tabs) { t.click(); await new Promise((o) => setTimeout(o, 250)); const vis = [...document.querySelectorAll('.qshop .qs-sec')].filter((s) => getComputedStyle(s).display !== 'none'); per[t.textContent.trim()] = [...new Set(vis.flatMap((s) => ids(s)))]; }
    return { tabs: tabs.map((t) => t.textContent.trim()), per, brandRow: !!document.querySelector('.qs-wdbr'), catRow: !!document.querySelector('.qs-wdcat'), wide: document.documentElement.scrollWidth > innerWidth + 1 }; }, own);
  note('Closet tabs: ' + JSON.stringify(B.tabs)); for (const [k, v] of Object.entries(B.per)) note('  ' + k + ': ' + JSON.stringify(v));
  const all = B.per.All || []; const nonAll = Object.entries(B.per).filter(([k]) => k !== 'All'); const counts = {}; nonAll.forEach(([, v]) => v.forEach((id) => { counts[id] = (counts[id] || 0) + 1; }));
  const missingAll = own.filter((id) => !all.includes(id)), noTab = own.filter((id) => !counts[id]), twice = Object.keys(counts).filter((id) => counts[id] > 1);
  ok(B.tabs[0] === 'All' && B.tabs.includes('Hair') && B.tabs.includes('Face') && !B.brandRow && !B.catRow && !B.wide, 'the Closet has one row of tabs starting with All, Hair and Face present, no brand or category chip row, page not wider');
  ok(!missingAll.length && !noTab.length && !twice.length, 'every owned piece shows under All and under exactly one tab (missing from All ' + JSON.stringify(missingAll) + ', in no tab ' + JSON.stringify(noTab) + ', in two ' + JSON.stringify(twice) + ')');
  await p.evaluate(() => { const a = document.querySelector('.v81cats .v81c'); if (a) a.click(); window.scrollTo(0, 0); }); await p.waitForTimeout(300); await p.screenshot({ path: OUT + '/closet209.png' });
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
