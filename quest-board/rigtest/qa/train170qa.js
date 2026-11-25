// QA, 250a711b (29zz_v170.js: a full Training session pays 100 XP / 500 coins and ticks today on the 4-a-week meter). What LEAD's
// train170.js leaves out:
//   A  the photo FIRST (markActive), then a full session, then the photo undone (unmarkActive): the day must stay counted, since a full
//      session was logged that day
//   B  the 4th day of the week coming from a session: the Weekly Warrior pays once and its window shows (with the session summary)
//   C  the duel's training credit (29w_duel.js: XP gained by wkdone >= ECON.trainXp, now 100): a full session's gain reaches it
//   PORT=<plain build> OUT=<dir> node train170qa.js
const pw = require('playwright');
const PORT = process.env.PORT || 8819, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const errs = [];
  const fresh = async (setup) => { const ctx = await b.newContext({ viewport: { width: 390, height: 844 } }); await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort())); const p = await ctx.newPage(); p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
    await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV170, null, { timeout: 120000 }); await p.waitForTimeout(800); await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' });
    await p.evaluate((setup) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Lift', sex: 'm' }); S.xp = x.cum(6); S.gates = [5]; S.tutDone = 1; S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1 }; if (setup) (new Function('S', 'x', setup))(S, x); x.persist(); x.render(); }, setup);
    await p.waitForTimeout(400); return p; };
  const session = (p) => p.evaluate(async () => { for (const m of document.querySelectorAll('#layer .modal')) m.remove(); document.querySelector('.nav button[data-v="train"]').click(); await new Promise((r) => setTimeout(r, 600)); for (const m of document.querySelectorAll('#layer .modal')) m.remove();
    document.querySelector('[data-act="wkplan"]').click(); await new Promise((r) => setTimeout(r, 500)); const x = window.__qb.x(), S = x.S; S.wk.list.forEach((id) => { S.wk.sets[id] = [1, 1, 1, 1, 1, 1]; }); const x0 = S.xp, c0 = S.coins; x.render(); await new Promise((r) => setTimeout(r, 300));
    document.querySelector('[data-act="wkdone"]').click(); await new Promise((r) => setTimeout(r, 1500));
    return { xp: S.xp - x0, coins: S.coins - c0, n: window.__qbV170.wcount(), on: window.__qbV170.active(), windows: [...document.querySelectorAll('#layer .modal')].map((m) => (m.querySelector('h2,.label') || m).textContent.trim().slice(0, 30)) }; });
  /* A */ { const p = await fresh(''); const n0 = await p.evaluate(() => window.__qbV170.wcount()); await p.evaluate(() => window.__qbV170.mark()); const n1 = await p.evaluate(() => window.__qbV170.wcount()); const s = await session(p); await p.evaluate(() => window.__qbV170.unmark()); const after = await p.evaluate(() => ({ n: window.__qbV170.wcount(), on: window.__qbV170.active() }));
    ok(n1 === n0 + 1 && s.n === n1 && after.on && after.n === n1, 'A photo first, then a full session, then the photo undone: the day stays counted ' + JSON.stringify({ n0, photo: n1, session: s.n, undone: after })); await p.context().close(); }
  /* B */ { const p = await fresh('S.active={};S.wcount={};const wk=(window.__qb.x().wkKey?window.__qb.x().wkKey():null);');
    const pre = await p.evaluate(() => { const x = window.__qb.x(), S = x.S; let n = window.__qbV170.wcount(); /* three earlier days this week through the real markActive's count */ const wk = Object.keys(S.wcount || {})[0]; return { n }; });
    await p.evaluate(() => { const S = window.__qb.x().S; for (let i = 0; i < 3; i++) { const d = new Date(); d.setHours(12); /* count three days by the counter itself */ } });
    const set = await p.evaluate(() => { const x = window.__qb.x(), S = x.S; const n0 = window.__qbV170.wcount(); /* raise the week's count to 3 the way markActive stores it */ for (const k of Object.keys(S.wcount || {})) delete S.wcount[k]; window.__qbV170.mark(); const wk = Object.keys(S.wcount)[0]; S.wcount[wk] = 3; delete S.active[Object.keys(S.active).pop()]; S.weekPaid = {}; x.persist(); return { n: window.__qbV170.wcount(), wk }; });
    const s = await session(p); await p.waitForTimeout(3000); const paid = await p.evaluate(() => { const S = window.__qb.x().S; return { weekPaid: Object.keys(S.weekPaid || {}), n: window.__qbV170.wcount(), later: [...document.querySelectorAll('#layer > *')].map((m) => m.className + ':' + (m.querySelector('h2,.label') || m).textContent.trim().slice(0, 30)) }; }); s.windows = s.windows.concat(paid.later);
    await p.screenshot({ path: OUT + '/train_warrior.png' });
    ok(set.n === 3 && s.n === 4 && paid.weekPaid.length === 1 && s.windows.some((w) => /Weekly Warrior|Weekly quest/i.test(w)), 'B the 4th day from a session pays the Weekly Warrior once and its window shows ' + JSON.stringify({ set, s, paid }));
    await p.context().close(); }
  /* C */ { const p = await fresh(''); const s = await session(p); ok(s.xp >= 100, 'C a full session gains ' + s.xp + ' XP, at least ECON.trainXp (100, 29e_economy.js), so the duel counts it as training'); await p.context().close(); }
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
