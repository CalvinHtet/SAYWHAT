// Cal, 2026-11-18: "Remove the 'you can afford an upgrade in the garden' ... remove clutter from the board view", then "Remove the the
// next: an upgrade you can afford in the bedroom. and remove the next goal as well. it is redundant with the goals button". On the plain
// build, at 360, 390 and 430 wide, a player with rooms in The Loft and Kode Plaza, coins for any upgrade and a goal ready: the Board's
// Next line never names an upgrade; inside each building there is no pill under its name (no "Next goal", no upgrade nudge), while the
// Street button, the name and the Goals button (with its ready count) stay, on screen; the Goals button still opens the goals. No page errors.
//   PORT=<plain build server> NODE_PATH=<playwright's parent> [SHOTS=<dir>] node rigtest/lead/afford.js
const { chromium } = require('playwright');
let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
const base = 'http://127.0.0.1:' + (process.env.PORT || 8779), SHOTS = process.env.SHOTS || '';
(async () => { const b = await chromium.launch({ args: ['--mute-audio'] });
  for (const w of [360, 390, 430]) {
    const p = await (await b.newContext({ viewport: { width: w, height: 844 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 150)));
    await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x, null, { timeout: 90000 }); await p.waitForTimeout(1000);
    await p.evaluate(() => setInterval(() => document.querySelectorAll('#layer .modal:not(.glmodal),.dropsplash,.bsplash').forEach((m) => m.remove()), 300));
    await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(30); S.gates = Array.from({ length: 200 }, (_, i) => i); S.calm = false;
      S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, loft: 1, hall: 1, players: 1, shop: 1, away: 1, wheel: 1, trophy: 1, freeze: 1 }; S.areaOn = { board: 1, hideout: 1, shop: 1, train: 1 };
      S.base.slots = ['bedroom', 'closet', 'garden', 'restaurant'].map((t) => ({ t, a: {}, st: 0, pend: 0 })); S.coins = 100000;
      S.quests = [{ id: 'q1', name: 'Wash the dishes', cl: 'home', xp: 10, stat: 'productivity', rep: 'daily' }]; S.done = {}; x.render(); });
    await p.waitForTimeout(800);
    const board = await p.evaluate(() => { const n = document.querySelector('.zx-next'); return n ? n.innerText.replace(/\s+/g, ' ') : ''; });
    ok(board && !/afford|upgrade/i.test(board), `${w}: the Board's Next line names no upgrade: "${board}"`);
    await p.evaluate(() => document.querySelector('.nav button[data-v="hideout"]').click()); await p.waitForTimeout(2500);
    for (const bi of [0, 1]) {
      await p.evaluate((bi) => { const e = document.querySelector('[data-act="bldgo"][data-v="' + bi + '"]'); if (e) e.dispatchEvent(new MouseEvent('click', { bubbles: true })); }, bi); await p.waitForTimeout(2500);
      const r = await p.evaluate(() => { const top = document.querySelector('.lfbtop'), gb = document.querySelector('.lfbtop .glbtn'), q = top && top.getBoundingClientRect();
        return { pill: document.querySelectorAll('.glnext,.zx-afnext').length, top: !!top && q.left >= 0 && q.right <= innerWidth + .5, name: top && top.querySelector('b') && top.querySelector('b').innerText, goals: gb ? gb.innerText.replace(/\s+/g, ' ') : null }; });
      ok(!r.pill && r.top && r.goals, `${w}: building ${bi}: no pill under the name; Street, name and Goals stay on screen ` + JSON.stringify(r));
      if (SHOTS && bi === 0) await p.screenshot({ path: `${SHOTS}/bldtop_${w}.png`, clip: { x: 0, y: 0, width: w, height: 260 } });
      const gl = await p.evaluate(async () => { document.querySelector('.lfbtop .glbtn').click(); await new Promise((o) => setTimeout(o, 800)); const m = document.querySelector('.glmodal'); const t = m ? m.innerText.slice(0, 40).replace(/\s+/g, ' ') : ''; if (m) m.remove(); return t; });
      ok(/Goals/.test(gl), `${w}: building ${bi}: the Goals button opens the goals: "${gl}"`);
      await p.evaluate(() => { const e = document.querySelector('[data-act="bldout"]'); if (e) e.click(); }); await p.waitForTimeout(1500); }
    ok(!errs.length, `${w}: no page errors ` + JSON.stringify(errs.slice(0, 3))); await p.context().close(); }
  await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
