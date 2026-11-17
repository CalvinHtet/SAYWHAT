// The Training card and its (i) across the Weekly Warrior streak (QA FIX on c7051f3, LEAD 0ca45f7): no streak, week 3 and week 5 (past
// the x4 cap), each with this week's bonus unpaid and claimed. Prints the card, the (i) sheet and the coins weekBonus pays; a picture each.
//   BASE=<server of quest-board/> OUT=<dir> NODE_PATH=<playwright's parent> node rigtest/qa/trainstreak.js
const pw = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:8819', OUT = process.env.OUT || '';
const wk = (n) => { const d = new Date(2026, 10, 16), o = []; for (let i = 1; i <= n; i++) { const x = new Date(d); x.setDate(d.getDate() - 7 * i); o.push(x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0')); } return o; };
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] });
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft, null, { timeout: 120000 }); await p.waitForTimeout(800);
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, loft: 1, town: 1, shop: 1, players: 1, hall: 1 }; S.calm = false; S.welcomed = 1;
    S.areaOn = { board: 1, train: 1, hideout: 1, shop: 1, hall: 1, players: 1, trophy: 1, wheel: 1, away: 1 }; S.gates = Array.from({ length: 200 }, (_, i) => i); S.xp = x.cum(30); x.render(); });
  const clear = () => p.evaluate(() => document.querySelectorAll('#layer .modal,.dropsplash,.bsplash,.coachscr,#qbtour').forEach((m) => m.remove()));
  for (const [prev, paid] of [[0, 0], [0, 1], [2, 0], [2, 1], [4, 0], [4, 1]]) {
    await clear(); await p.evaluate(({ weeks, paid }) => { const x = window.__qb.x(), S = x.S; S.weekPaid = {}; weeks.forEach((k) => { S.weekPaid[k] = 1; }); if (paid) S.weekPaid['2026-11-16'] = 1; x.render();
      let el = document.querySelector('.nav button[data-v="train"]'); if (!el) { document.querySelector('.nav button[data-v="board"]').click(); el = document.querySelector('.zx-tile[data-v="train"]'); } el.click(); }, { weeks: wk(prev), paid });
    await p.waitForTimeout(900); await clear();
    const r = await p.evaluate(async () => { const c = document.querySelector('.trhead'); const card = c.innerText.replace(/\s+/g, ' ').trim(); const q = c.querySelector('.qbi'); q.scrollIntoView({ block: 'center' }); q.click();
      await new Promise((d) => setTimeout(d, 400)); const m = document.querySelector('#layer .modal'); return { card, sheet: m ? m.innerText.replace(/\s+/g, ' ').trim() : 'NO SHEET' }; });
    const tag = 'prev' + prev + (paid ? '_claimed' : '_unpaid');
    console.log('== ' + prev + ' weeks before, this week ' + (paid ? 'claimed' : 'not yet') + '\n  card:  ' + r.card + '\n  (i):   ' + r.sheet);
    if (OUT) await p.screenshot({ path: OUT + '/train_' + tag + '.png' }); }
  console.log('errors ' + errs.length + ' ' + JSON.stringify(errs.slice(0, 3))); await b.close(); })().catch((e) => { console.log('crash', e.message); process.exit(2); });
