// Cal 11-25: the building view shows only the coins at the top (no "+", no mailbox, no Goals button or "Next goal" line); every
// building's goals are in the Board's one Goals button, which opens that building's list to claim.
//   PORT=<build server> NODE_PATH=<playwright's parent> OUT=<dir> node rigtest/lead/bld171.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8838, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const errs = [];
  for (const w of [390, 320]) { const p = await (await b.newContext({ viewport: { width: w, height: 844 }, deviceScaleFactor: 2 })).newPage(); p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
    await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbV167, null, { timeout: 90000 }); await p.waitForTimeout(800);
    await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' });
    await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(30); S.gates = Array.from({ length: 200 }, (_, i) => i); S.calm = false; S.v67ref = 1;
      S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, loft: 1, hall: 1, players: 1, shop: 1, away: 1, wheel: 1, trophy: 1, freeze: 1 }; S.areaOn = { board: 1, hideout: 1, shop: 1, train: 1 };
      S.base.slots = ['bedroom', 'closet', 'garden', 'restaurant'].map((t) => ({ t, a: {}, st: 0, pend: 0 })); S.coins = 902; x.render(); });
    await p.waitForTimeout(800); await p.evaluate(() => document.querySelectorAll('#layer .modal').forEach((m) => m.remove()));
    await p.evaluate(() => document.querySelector('.nav button[data-v="hideout"]').click()); await p.waitForTimeout(2500);
    const st = await p.evaluate(() => { const h = document.querySelector('.lfhud'); return { coins: !!(h && h.querySelector('.coinlive')), plus: !!document.querySelector('#app .lfhud .kdbtn,#app .lfhud [class*="kdbtn"]'), mail: !!document.querySelector('#app .lfhud .ibbtn') }; });
    ok(st.coins && !st.plus && !st.mail, w + ': the street view: the coins, no "+" and no mailbox ' + JSON.stringify(st));
    for (const bi of [0, 1]) {
      await p.evaluate((bi) => { const e = document.querySelector('[data-act="bldgo"][data-v="' + bi + '"]'); if (e) e.dispatchEvent(new MouseEvent('click', { bubbles: true })); }, bi); await p.waitForTimeout(2500);
      const r = await p.evaluate(() => { const top = document.querySelector('.lfbtop'); return { top: !!top, back: !!(top && top.querySelector('[data-act="bldout"]')), name: top && top.querySelector('b') ? top.querySelector('b').innerText : '', goals: !!document.querySelector('#app .glbtn'), next: !!document.querySelector('#app .glnext'), plus: !!document.querySelector('#app .lfhud .kdbtn'), mail: !!document.querySelector('#app .lfhud .ibbtn'), coins: !!document.querySelector('#app .lfhud .coinlive') }; });
      ok(r.top && r.back && r.name && !r.goals && !r.next && !r.plus && !r.mail && r.coins, w + ': building ' + bi + ': Street, its name and the coins; no Goals, "Next goal", "+" or mailbox ' + JSON.stringify(r));
      if (w === 390 && bi === 0) await p.screenshot({ path: OUT + '/bld171.png', clip: { x: 0, y: 0, width: w, height: 300 } });
      await p.evaluate(() => { const e = document.querySelector('[data-act="bldout"]'); if (e) e.click(); }); await p.waitForTimeout(1200); }
    await p.evaluate(() => document.querySelector('.nav button[data-v="board"]').click()); await p.waitForTimeout(800);
    const g = await p.evaluate(async () => { document.querySelector('[data-v67="goals"]').click(); await new Promise((o) => setTimeout(o, 500)); const rows = [...document.querySelectorAll('#layer .v67modal .v67row')].map((r) => r.dataset.k);
      const bt = document.querySelector('#layer .v67modal .v67row[data-k="b1"]') || document.querySelector('#layer .v67modal .v67row[data-k^="b"]'); bt.click(); await new Promise((o) => setTimeout(o, 500)); return { rows, gl: !!document.querySelector('#layer .glmodal') }; });
    ok(g.rows.filter((k) => /^b\d/.test(k)).length >= 2 && g.gl, w + ': the Board\'s Goals lists every building\'s goals, and a row opens that building\'s list ' + JSON.stringify(g));
    await p.context().close(); }
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
