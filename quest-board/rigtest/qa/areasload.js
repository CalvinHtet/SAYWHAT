// The areas-seen record and saves (LEAD's 9b28444): a high-level save written without S.areaOn (an older save, another device's)
// loads with every area it has reached open, none "Soon"; a level-3 save without it gets only its own (the Hall still waits).
//   BASE=<server> node areasload.js
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:8769';
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const fails = [], oks = [], t = (c, m) => (c ? oks : fails).push(m);
  for (const [lv, gates] of [[30, [5, 10, 20, 30]], [3, []]]) {
    const ctx = await b.newContext(); const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
    await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x, null, { timeout: 60000 }); await p.waitForTimeout(1500);
    // make a save at this level the game's own way, then strip the areas record from what is stored
    const keys = await p.evaluate(({ lv, gates }) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Old', sex: 'f' }); S.xp = x.cum(lv) + 1; S.gates = gates; S.lvPaid = lv; x.persist();
      const out = []; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); const v = localStorage.getItem(k); if (v && v.includes('"xp"')) { const o = JSON.parse(v); delete o.areaOn; delete o.areaDay; Object.assign(o, { epoch: 2, rst2: true, xpc2: 1, v001: 1, k10: 1, hire1: true, xp: x.cum(lv) + 1, gates, lvPaid: lv }); /* the flags that make the load keep an old save's numbers (as savecheck.js seeds) */ localStorage.setItem(k, JSON.stringify(o)); out.push(k); } } return out; }, { lv, gates });
    await p.reload(); await p.waitForFunction(() => window.__qb && window.__qb.x, null, { timeout: 60000 }); await p.waitForTimeout(3000);
    const r = await p.evaluate(() => { const x = window.__qb.x(), S = x.S; return { lv: x.effLvl(), on: Object.keys(S.areaOn || {}).sort(), soon: [...document.querySelectorAll('.nav button')].filter((b) => /soon/i.test(b.className + ' ' + b.innerText)).map((b) => b.dataset.v) }; });
    if (lv >= 8) t(r.lv >= 8 && ['hall', 'hideout', 'trophy', 'wheel'].every((k) => r.on.includes(k)) && !r.soon.length, `level-${lv} save without the record (stored under ${keys.join(',')}): level ${r.lv}, areas ${r.on.join(' ')}, Soon ${JSON.stringify(r.soon)}`);
    else t(!r.on.includes('hall') || r.soon.includes('hall'), `level-${lv} save without the record: level ${r.lv}, areas ${r.on.join(' ')}, Soon ${JSON.stringify(r.soon)} (the Hall waits)`);
    if (errs.length) fails.push('page errors ' + errs.slice(0, 2).join(' | '));
    await ctx.close();
  }
  oks.forEach((m) => console.log('  ok   ' + m)); fails.forEach((m) => console.log('  FAIL ' + m));
  await b.close();
})();
