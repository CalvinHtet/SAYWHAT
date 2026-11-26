// Cal 11-25 (29zz_v179.js): a level-up window lists what it unlocked: the Pet Store, a set of new banners, a new effect.
//   PORT=<build server> NODE_PATH=<playwright's parent> OUT=<dir> node rigtest/lead/lv179.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8838, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch(); const errs = [];
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage(); p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV179, null, { timeout: 90000 }); await p.waitForTimeout(400);
  await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' });
  const r = await p.evaluate(async () => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.tutDone = 1; S.gates = Array.from({ length: 200 }, (_, i) => i); S.xp = x.cum(30); x.render(); await new Promise((o) => setTimeout(o, 400)); document.querySelectorAll('#layer .modal').forEach((m) => m.remove());
    const out = {}; for (const lv of [10, 25, 2]) { document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); out[lv] = window.__qbV179.unlocks(lv - 1, lv); } return out; });
  console.log('     ' + JSON.stringify(r));
  ok(r[25].some((t) => /Pet Store/.test(t)), 'level 25 lists the Pet Store');
  ok(r[10].some((t) => /^5 new banners/.test(t)), 'level 10 lists 5 new banners');
  ok(r[2].some((t) => /^New effect: /.test(t)), 'level 2 lists its new effect');
  const w = await p.evaluate(async () => { const lb = document.querySelector('#lvok'); if (lb) lb.closest('.modal').remove(); window.__qbV179.show(25); await new Promise((o) => setTimeout(o, 900)); const m = document.querySelector('#lvok') && document.querySelector('#lvok').closest('.card'); return m ? m.innerText.replace(/\s+/g, ' ') : ''; });
  ok(/Level 25/.test(w) && /The Pet Store is open/.test(w), 'the level-up window itself shows it: ' + w.slice(0, 160));
  await p.screenshot({ path: OUT + '/lv179.png' });
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
