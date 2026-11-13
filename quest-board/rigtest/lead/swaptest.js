// Swap an exercise in a gym plan (Cal, 2026-11-13: squats to hip thrusts on leg day, saved and kept): on the plain build, start the Legs
// plan, swap Back Squat for a typed "Hip Thrust", check today's workout, a reload, and a fresh build of the plan; swap one from the library;
// then put the squat back.   BASE=<server of quest-board/> NODE_PATH=<playwright's parent> node rigtest/lead/swaptest.js [shot dir]
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:8766', OUT = process.argv[2] || '';
let fails = 0; const ok = (n, c, i) => { if (!c) fails++; console.log((c ? '  ok   ' : '  FAIL ') + n + (c ? '' : '  ' + JSON.stringify(i))); };
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] });
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 150)));
  const boot = async () => { await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft, null, { timeout: 90000 }); await p.waitForTimeout(1500); };
  await p.goto(BASE + '/dist/index.html'); await boot();
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.total = 20; S.calm = false; S.tours = { welcome: 1, dq: 1, bty: 1, train: 1 }; x.render(); });
  await p.waitForTimeout(800);
  const clear = () => p.evaluate(() => { document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); document.querySelectorAll('.coachscr').forEach((m) => m.remove()); });
  await clear(); await p.evaluate(() => document.querySelector('.nav button[data-v="board"]').click()); await p.waitForTimeout(800);
  await p.evaluate(() => { const t = document.querySelector('.zx-tile[data-v="train"]'); if (t) t.click(); }); await p.waitForTimeout(1500); await clear();
  await p.evaluate(() => { const b = [...document.querySelectorAll('[data-act="wkplan"]')].filter((x) => /^Legs/.test(x.innerText.trim()))[0]; if (b) b.click(); }); await p.waitForTimeout(1500); await clear();
  const st0 = await p.evaluate(() => ({ plan: window.__qb.x().S.wk && window.__qb.x().S.wk.plan, list: window.__qb.x().S.wk && window.__qb.x().S.wk.list, swaps: document.querySelectorAll('.exswap').length }));
  ok('Legs plan open, every card has Swap', st0.plan === 'legs' && st0.list.includes('squat') && st0.swaps === st0.list.length, st0);
  await p.evaluate(() => document.querySelector('.exswap[data-ex="squat"]').click()); await p.waitForTimeout(800);
  ok('the swap window lists other exercises, legs first', await p.evaluate(() => { const b = [...document.querySelectorAll('.zx-pick small')].map((x) => x.innerText.toLowerCase()); return b.length > 5 && b[0] === 'legs'; }));
  if (OUT) await p.screenshot({ path: OUT + '/swap_window.png' });
  await p.fill('#zxown', 'Hip Thrust'); await p.evaluate(() => document.querySelector('[data-act="wkswapown"]').click()); await p.waitForTimeout(1200);
  const st1 = await p.evaluate(() => { const S = window.__qb.x().S; return { list: S.wk.list, swap: S.wkSwap, own: S.exOwn, card: !!document.querySelector('.exswap[data-ex="u_hip_thrust"]'), text: /Hip Thrust/.test(document.body.innerText) }; });
  ok('today: Back Squat is now Hip Thrust, in the same place', st1.list.indexOf('u_hip_thrust') === st0.list.indexOf('squat') && !st1.list.includes('squat') && st1.card && st1.text, st1);
  ok('saved: legs squat -> u_hip_thrust, Hip Thrust in your exercises', st1.swap.legs && st1.swap.legs.squat === 'u_hip_thrust' && st1.own.u_hip_thrust && st1.own.u_hip_thrust.n === 'Hip Thrust', st1);
  if (OUT) await p.screenshot({ path: OUT + '/swap_after.png' });
  await p.waitForTimeout(2500); await p.reload(); await boot();
  const st2 = await p.evaluate(() => { const S = window.__qb.x().S; return { list: S.wk && S.wk.list, swap: S.wkSwap }; });
  ok('after a reload: still Hip Thrust', st2.list && st2.list.includes('u_hip_thrust') && st2.swap.legs.squat === 'u_hip_thrust', st2);
  // a fresh build of the plan (next leg day): pick another plan, then Legs again
  await clear(); await p.evaluate(() => document.querySelector('.nav button[data-v="board"]').click()); await p.waitForTimeout(600);
  await p.evaluate(() => document.querySelector('.zx-tile[data-v="train"]').click()); await p.waitForTimeout(1200); await clear();
  const fresh = await p.evaluate(() => { const S = window.__qb.x().S; S.wk = null; window.__qb.x().render(); return true; }); await p.waitForTimeout(800); await clear();
  await p.evaluate(() => { const b = [...document.querySelectorAll('[data-act="wkplan"]')].filter((x) => /^Legs/.test(x.innerText.trim()))[0]; if (b) b.click(); }); await p.waitForTimeout(1500); await clear();
  const st3 = await p.evaluate(() => window.__qb.x().S.wk && window.__qb.x().S.wk.list);
  ok('a fresh Legs plan has Hip Thrust, not Back Squat', fresh && st3 && st3.includes('u_hip_thrust') && !st3.includes('squat'), st3);
  // one from the library
  const lib = await p.evaluate(() => { const S = window.__qb.x().S, a = S.wk.list.filter((x) => !/^u_/.test(x))[0]; document.querySelector('.exswap[data-ex="' + a + '"]').click(); return a; }); await p.waitForTimeout(700);
  const to = await p.evaluate(() => { const k = [...document.querySelectorAll('.zx-pick')].filter((x) => x.dataset.to !== 'squat')[0]; const v = k.dataset.to; k.click(); return v; }); await p.waitForTimeout(1000);
  const st4 = await p.evaluate(() => { const S = window.__qb.x().S; return { list: S.wk.list, swap: S.wkSwap.legs }; });
  ok('a library swap works too', st4.list.includes(to) && !st4.list.includes(lib) && st4.swap[lib] === to, { lib, to, st4 });
  // back to the squat
  await p.evaluate(() => document.querySelector('.exswap[data-ex="u_hip_thrust"]').click()); await p.waitForTimeout(700);
  ok('the window offers "Back to Back Squat"', await p.evaluate(() => /Back to Back Squat/.test((document.querySelector('.zx-orig') || {}).innerText || '')));
  await p.evaluate(() => document.querySelector('.zx-orig').click()); await p.waitForTimeout(1000);
  const st5 = await p.evaluate(() => { const S = window.__qb.x().S; return { list: S.wk.list, swap: S.wkSwap.legs }; });
  ok('back to Back Squat, and the swap is forgotten', st5.list.includes('squat') && !st5.list.includes('u_hip_thrust') && !('squat' in st5.swap), st5);
  ok('no page errors', errs.length === 0, errs.slice(0, 4));
  await b.close(); console.log(fails ? 'FAILED ' + fails : 'ALL PASS');
})().catch((e) => { console.log('crash', e.message); process.exit(2); });
