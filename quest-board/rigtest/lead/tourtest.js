// Guided tours and the calm first week (29zy_tour.js; Cal, 2026-11-13) on the plain build. A new player: the welcome tour, a calm Board on
// day 1, the Daily Quest on day 2 with its tour, Training on day 4 with its tap step, The Loft's tour when it opens. A player with progress:
// no tours for what is already open, the Board as before. Replay tutorial in the profile.
//   BASE=<server of quest-board/> NODE_PATH=<playwright's parent> node rigtest/lead/tourtest.js [shot dir]
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:8766', OUT = process.argv[2] || '';
let fails = 0; const ok = (n, c, i) => { if (!c) fails++; console.log((c ? '  ok   ' : '  FAIL ') + n + (c ? '' : '  ' + JSON.stringify(i))); };
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] });
  const page = async () => { const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 150)));
    await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft, null, { timeout: 90000 }); await p.waitForTimeout(1200); return { p, errs }; };
  const tour = (p) => p.evaluate(() => { const r = document.getElementById('qbtour'); if (!r || r.style.visibility === 'hidden') return null; return { t: r.querySelector('.tour-t').textContent, next: getComputedStyle(r.querySelector('[data-tour="next"]')).display !== 'none' }; });
  const waitTour = async (p, re, ms = 9000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { const t = await tour(p); if (t && re.test(t.t)) return t; await p.waitForTimeout(300); } return await tour(p); };
  const next = (p) => p.evaluate(() => document.querySelector('#qbtour [data-tour="next"]').click());
  const clear = (p) => p.evaluate(() => document.querySelectorAll('#layer .modal').forEach((m) => m.remove()));
  // ---- a new player
  { const { p, errs } = await page();
    await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Newbie', sex: 'f' }); delete S.calm; delete S.tours; x.render(); });
    /* the welcome letter from Cal opens first; a player closes it, then the tour starts */
    for (let k = 0; k < 6; k++) { await p.waitForTimeout(700); await clear(p); }
    const w = await waitTour(p, /Welcome/);
    ok('a new player gets the welcome tour on the task box', w && /Welcome/.test(w.t), w);
    if (OUT) await p.screenshot({ path: OUT + '/tour_welcome.png' });
    for (let k = 0; k < 4; k++) { if (await tour(p)) { await next(p); await p.waitForTimeout(500); } }
    ok('the welcome tour ends', !(await tour(p)) && await p.evaluate(() => window.__qb.x().S.tours.welcome === 1));
    const d1 = await p.evaluate(() => ({ dq: !!document.querySelector('.card.dq'), bty: !!document.querySelector('.bty'), train: !!document.querySelector('.zx-tile[data-v="train"]'), calm: window.__qb.x().S.calm }));
    ok('day 1 is calm: no Daily Quest, no bounties, no Training tile', !d1.dq && !d1.bty && !d1.train && d1.calm && d1.calm.days.length === 1, d1);
    await p.evaluate(() => { const S = window.__qb.x().S; S.calm.days.unshift('2000-01-01'); window.__qb.x().render(); });
    const dq = await waitTour(p, /Daily Quest/);
    ok('day 2: the Daily Quest card, with its tour', dq && /Daily Quest/.test(dq.t) && await p.evaluate(() => !!document.querySelector('.card.dq')), dq);
    await next(p); await p.waitForTimeout(500);
    /* Cal, 2026-11-16 (cut the fat): the Daily Quest tour's second step rings the card's (i) */
    const ii = await tour(p); const ring = await p.evaluate(() => { const r = document.querySelector('#qbtour .tour-ring'); if (!r) return null; const g = r.getBoundingClientRect(), b = document.querySelector('.card.dq .qbi'); if (!b) return 'no (i)'; const q = b.getBoundingClientRect(); return Math.abs((g.x + g.width / 2) - (q.x + q.width / 2)) < 6 && Math.abs((g.y + g.height / 2) - (q.y + q.height / 2)) < 6; });
    ok('day 2: the tour then rings the Daily Quest\'s (i)', ii && ii.t === 'How it works' && ring === true, { ii, ring });
    if (ii) { await next(p); await p.waitForTimeout(500); }
    await p.evaluate(() => { const S = window.__qb.x().S; S.calm.days.unshift('2000-01-02', '2000-01-03'); window.__qb.x().render(); });
    const bt = await waitTour(p, /Bounties/); if (bt) { await next(p); await p.waitForTimeout(500); }
    ok('day 3: bounties, with their tour', bt && /Bounties/.test(bt.t), bt);
    const tr = await waitTour(p, /Training/);
    ok('day 4: the Training tile, with a tap step (no Next)', tr && /Training/.test(tr.t) && !tr.next, tr);
    if (OUT) await p.screenshot({ path: OUT + '/tour_training.png' });
    await p.evaluate(() => document.querySelector('.zx-tile[data-v="train"]').click());
    const tr2 = await waitTour(p, /Pick a plan/);
    ok('tapping the tile opens Training and the tour goes on', tr2 && /Pick a plan/.test(tr2.t) && await p.evaluate(() => (document.querySelector('.nav button.on') || {}).dataset && document.querySelector('.zx-back') !== null), tr2);
    await next(p); await p.waitForTimeout(500);
    await p.evaluate(() => document.querySelector('.zx-back').click()); await p.waitForTimeout(800);
    await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.xp = x.cum(2); S.areaOn.hideout = 1; x.render(); }); await clear(p);
    const lo = await waitTour(p, /Loft/);
    ok('The Loft opens: "You unlocked The Loft!", tap the tab', lo && /unlocked The Loft/.test(lo.t) && !lo.next, lo);
    if (OUT) await p.screenshot({ path: OUT + '/tour_loft.png' });
    await p.evaluate(() => document.querySelector('.nav button[data-v="hideout"]').click());
    const lo2 = await waitTour(p, /Your Loft/, 12000);
    ok('in The Loft, the next step explains it', lo2 && /Your Loft/.test(lo2.t), lo2);
    if (OUT) await p.screenshot({ path: OUT + '/tour_loft2.png' });
    ok('no page errors (new player)', errs.length === 0, errs.slice(0, 4)); }
  // ---- a player with progress
  { const { p, errs } = await page();
    await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.total = 40; S.xp = x.cum(12); S.areaOn = { board: 1, train: 1, hideout: 1, hall: 1, shop: 1 }; delete S.calm; delete S.tours; x.render(); });
    for (let k = 0; k < 6; k++) { await p.waitForTimeout(700); await clear(p); }
    const st = await p.evaluate(() => ({ calm: window.__qb.x().S.calm, tours: window.__qb.x().S.tours, dq: !!document.querySelector('.card.dq'), on: !!document.getElementById('qbtour') }));
    ok('a player with progress: no calm week, no tours for what is open, Board as before', st.calm === false && st.tours.welcome && st.tours.hideout && st.dq && !st.on, st);
    await p.evaluate(() => document.querySelector('.bline').click()); await p.waitForTimeout(1200);
    ok('the profile has Replay tutorial', await p.evaluate(() => !!document.querySelector('#layer .modal [data-act="tourreplay"]')));
    await p.evaluate(() => document.querySelector('#layer .modal [data-act="tourreplay"]').click()); await p.waitForTimeout(500);
    const re = await waitTour(p, /Welcome/);
    ok('Replay tutorial starts the tours again', re && /Welcome/.test(re.t), re);
    ok('no page errors (player with progress)', errs.length === 0, errs.slice(0, 4)); }
  await b.close(); console.log(fails ? 'FAILED ' + fails : 'ALL PASS');
})().catch((e) => { console.log('crash', e.message); process.exit(2); });
