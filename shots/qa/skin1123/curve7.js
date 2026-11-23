// QA: curve 7 with no XP move (8df50fb4). STEP=make on the build before (curve 6): a save at level L, lvPaid L, trials passed up to L,
// 1,000 coins. STEP=look on curve 7, same origin and profile: level, coins, lvPaid, every window that opens (level-ups clicked through in
// order, milestone picks taken as coins), twice (a reload must pay nothing more).
const pw = require('playwright'); const base = process.env.BASE, DIR = process.env.DIR, STEP = process.env.STEP, L = +(process.env.LVL || 30);
(async () => { const ctx = await pw.chromium.launchPersistentContext(DIR, { viewport: { width: 390, height: 844 } }); await ctx.route('**/*', (r) => (r.request().url().startsWith(base) ? r.continue() : r.abort()));
  const p = ctx.pages()[0] || await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && QBLoft.data, null, { timeout: 90000 }); await p.waitForTimeout(2500);
  const st = () => p.evaluate(() => { const x = window.__qb.x(), S = x.S; return { xp: S.xp, raw: x.lvlOf(S.xp), eff: x.effLvl(), lvPaid: S.lvPaid, coins: S.coins, gates: (S.gates || []).join(',') }; });
  if (STEP === 'make') { await p.evaluate((L) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'OldCal', sex: 'm' }); S.cls = 'vanguard'; S.spec = 'berserker'; S.oath = ''; S.xp = Math.round(x.cum(L) + .5 * (x.cum(L + 1) - x.cum(L))); S.gates = [5, 10, 20, 30, 40, 50, 65, 80, 100].filter((g) => g <= L);
      S.lvPaid = L; S.coins = 1000; S.mile = { since: Math.floor(L / 5) * 5, fx1: 1 }; S.tours = { welcome: 1, hideout: 1, train: 1, dq: 1, bty: 1 }; S.calm = false; x.persist(); }, L);
    await p.waitForTimeout(1500); console.log('curve 6 save', JSON.stringify(await st())); }
  else { console.log('curve 7 on load', JSON.stringify(await st()));
    const seen = [];
    for (let i = 0; i < 30; i++) { await p.waitForTimeout(1200); const w = await p.evaluate(() => { const m = [...document.querySelectorAll('#layer .modal')].pop(); if (!m) return null; const t = m.innerText.replace(/\s+/g, ' ').slice(0, 70);
        const b = m.querySelector('#lvok') || m.querySelector('[data-id="coins"]') || m.querySelector('[data-act="mclose"]') || m.querySelector('.btn'); if (b) b.click(); else m.remove(); return t; }); if (w) seen.push(w); else if (i > 6) break; }
    console.log('windows', JSON.stringify(seen)); console.log('after', JSON.stringify(await st())); }
  console.log('page errors', errs.length, JSON.stringify(errs.slice(0, 2))); await ctx.close(); })();
