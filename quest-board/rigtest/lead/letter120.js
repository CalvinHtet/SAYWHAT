// The v1.20 letter (Cal: a letter every 10th version, 500 coins, vague, no spoilers) on a build at APPV 120 (the release tree, not
// qa-local, which runs APPV 100): a player from v1.19 gets "What's new in v1.20" (7 lines) and 500 coins once on opening; one from v1.09
// gets v1.10's and v1.20's, 1,000 once; one who starts on v1.20 gets none; no page errors.
//   PORT=<APPV 120 build server> NODE_PATH=<playwright's parent> node rigtest/lead/letter120.js
const { chromium } = require('playwright'); let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch({ args: ['--mute-audio'] });
  for (const [from, want] of [[119, ['pn120']], [109, ['pn110', 'pn120']], [120, []]]) {
    const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 150)));
    await p.goto('http://127.0.0.1:' + (process.env.PORT || 8841) + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbUpd, null, { timeout: 90000 }); await p.waitForTimeout(1000);
    const r = await p.evaluate(async (from) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(30); S.gates = Array.from({ length: 200 }, (_, i) => i); S.calm = false; S.pn = { from }; S.coins = 1000; x.render();
      const clk = (k, id) => { const e = document.createElement('button'); e.dataset.ib = k; if (id) e.dataset.id = id; document.body.appendChild(e); e.click(); e.remove(); };
      clk('list'); await new Promise((o) => setTimeout(o, 300)); const ids = [...document.querySelectorAll('.ibrow')].map((r) => r.dataset.id).filter((i) => /^pn/.test(i)).sort();
      const out = { ids, subj: [], lines: [] };
      for (const id of ids) { clk('open', id); await new Promise((o) => setTimeout(o, 400)); const bx = document.querySelector('.ibmodal'); out.subj.push(bx ? bx.querySelector('h2').innerText : ''); out.lines.push(bx ? bx.querySelectorAll('.ibbody li').length : 0); }
      out.after = S.coins; for (const id of ids) { clk('open', id); await new Promise((o) => setTimeout(o, 300)); } out.again = S.coins; return out; }, from);
    console.log(JSON.stringify(r));
    ok(r.ids.join() === want.join() && r.after === 1000 + 500 * want.length && r.again === r.after, `from v${from}: letters ${r.ids.join() || 'none'}, ${r.after - 1000} coins once`);
    if (want.includes('pn120')) ok(r.subj[r.ids.indexOf('pn120')] .includes('v1.20') && r.lines[r.ids.indexOf('pn120')] === 7, 'v1.20 letter: "What\'s new in v1.20", 7 lines');
    ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 2))); await p.context().close(); }
  await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
