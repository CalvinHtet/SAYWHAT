// The Daily Quest counts effort (Cal, 2026-11-14): a heavy day of small tasks (15 of 5 XP, 10 of 10, 5 of 25), then a workout, on a
// mid-game save; prints the bar's XP and the chests opened after each part. Run on two builds to compare (PORT).
//   PORT=<plain build server> NODE_PATH=<playwright's parent> node rigtest/lead/dqbalance.js
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({ args: ['--mute-audio'] }); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 150)));
  await p.goto('http://127.0.0.1:' + (process.env.PORT || 8779) + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft, null, { timeout: 90000 }); await p.waitForTimeout(800);
  const out = await p.evaluate(async () => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.total = 200; S.xp = x.cum(15); S.calm = false; S.fsall = 1; S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, away: 1, banner: 1 }; S.unl = Object.assign({ console: 1, pets: 1, acc2: 1, sable7: 1 }, S.unl || {}); S.done = {}; S.dq = null; S.rest = null; x.render();
    const w = (ms) => new Promise((o) => setTimeout(o, ms)), rows = [];
    const mk = (n, xp, pre) => { const ids = []; for (let i = 0; i < n; i++) { const id = 'qq' + pre + i; S.quests.push({ id, name: pre + ' ' + i, xp, stat: 'productivity', cl: 'home', rep: 'once' }); ids.push(id); } return ids; };
    const read = (lab) => { const c = document.querySelector('.card.dq .mono'); const d = S.dq || {}; rows.push(lab.padEnd(26) + ' bar ' + (c ? c.textContent : '?').padEnd(12) + ' chests ' + (d.tier || 0) + (d.hid ? ' (hidden)' : '')); };
    const doAll = async (ids) => { for (const id of ids) { x.toggle(id); document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); } x.render(); await w(300); document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); };
    const a = mk(15, 5, 'quick'), bq = mk(10, 10, 'short'), c = mk(5, 25, 'real'); x.render();
    await doAll(a); read('15 quick (5 XP)'); await doAll(bq); read('+10 short (10 XP)'); await doAll(c); read('+5 real (25 XP)');
    try { const dq = S.dq; dq.tx = (dq.tx || 0) + 50; x.render(); await w(300); } catch (e) {} read('+ a workout (50)');
    return rows; });
  console.log(out.join('\n')); console.log('errors', JSON.stringify(errs.slice(0, 3))); await b.close(); })();
