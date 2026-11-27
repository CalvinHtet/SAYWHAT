// Goals "Claim all" (Cal, 2026-11-14) on the plain build: a save with every Home room bought has several goals ready; the Goals window
// shows "Claim all (n)", one tap pays the sum of their coins and XP once, every goal reads Claimed, a second tap pays nothing.
//   PORT=<plain build server> NODE_PATH=<playwright's parent> node rigtest/lead/claimall.js
const { chromium } = require('playwright');
let bad = 0; const ok = (c, s, i) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s + (c ? '' : '  ' + JSON.stringify(i))); };
(async () => { const b = await chromium.launch({ args: ['--mute-audio'] }); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 150)));
  await p.goto('http://127.0.0.1:' + (process.env.PORT || 8779) + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && window.__qbRooms && window.__qbGoals, null, { timeout: 90000 }); await p.waitForTimeout(800);
  const r = await p.evaluate(async () => { const x = window.__qb.x(), S = x.S, w = (ms) => new Promise((o) => setTimeout(o, ms)); S.created = true; S.char = window.__qb.fixChar({ name: 'G', sex: 'm' }); S.calm = false; S.fsall = 1; S.xp = x.cum(20); S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, away: 1, banner: 1 }; S.unl = Object.assign({ console: 1, pets: 1, acc2: 1, sable7: 1 }, S.unl || {}); S.areaOn = { board: 1, hideout: 1, hall: 1 };
    ['bedroom', 'closet', 'patio', 'gameroom', 'lair'].forEach((t) => { try { window.__qbRooms.all(t, 1) } catch (e) {} }); x.render(); await w(800);
    const G = window.__qbGoals, ready = G.list(0).filter((g) => g.met && !g.got), sumC = ready.reduce((a, g) => a + g.c, 0), sumX = ready.reduce((a, g) => a + g.xp, 0), c0 = S.coins, x0 = S.xp;
    document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); const o = document.createElement('button'); o.dataset.gl = 'open'; o.dataset.b = '0'; document.body.appendChild(o); o.click(); o.remove(); await w(500);
    const btn = document.querySelector('#layer [data-gl="claimall"]'); const label = btn ? btn.innerText : null; if (btn) btn.click(); await w(800);
    const after = { coins: S.coins - c0, xp: S.xp - x0, left: G.list(0).filter((g) => g.met && !g.got).length, claimedRows: document.querySelectorAll('#layer .glrow.got').length, btn2: !!document.querySelector('#layer [data-gl="claimall"]') };
    return { n: ready.length, sumC, sumX, label, after }; });
  ok(r.n >= 2 && (r.label || '').toLowerCase() === 'claim all (' + r.n + ')', `the window shows "Claim all (${r.n})"`, r);
  ok(r.after.coins >= r.sumC && r.after.xp >= r.sumX && r.after.left === 0 && !r.after.btn2, 'one tap pays every ready goal once and the button goes', r);
  ok(errs.length === 0, 'no page errors', errs); await b.close(); console.log(bad ? 'FAILED ' + bad : 'ALL PASS'); })();
