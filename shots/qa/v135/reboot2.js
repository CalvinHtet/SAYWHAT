// QA: the reboot (QB_EPOCH 6 -> 7) on one origin and profile. STEP=old on v1.31: a played save (level 20, 5,000 coins). STEP=new on v1.35:
// the save starts over; make a character; open the inbox; collect each letter twice; coins after each; what the inbox lists; errors.
const pw = require('playwright'); const base = process.env.BASE, DIR = process.env.DIR, STEP = process.env.STEP, OUT = process.env.OUT;
(async () => { const ctx = await pw.chromium.launchPersistentContext(DIR, { viewport: { width: 390, height: 844 } }); await ctx.route('**/*', (r) => (r.request().url().startsWith(base) ? r.continue() : r.abort()));
  const p = ctx.pages()[0] || await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && QBLoft.data, null, { timeout: 90000 }); await p.waitForTimeout(2500);
  const st = () => p.evaluate(() => { const x = window.__qb.x(), S = x.S; return { epoch: S.epoch, created: !!S.created, xp: S.xp, coins: S.coins, name: S.char && S.char.name }; });
  if (STEP === 'old') { await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'OldCal', sex: 'm' }); S.xp = x.cum(20); S.coins = 5000; x.persist(); }); await p.waitForTimeout(1500); console.log('v1.31 save', JSON.stringify(await st())); }
  else { console.log('v1.35 on load', JSON.stringify(await st()), 'localStorage epoch', await p.evaluate(() => { try { return JSON.parse(localStorage.getItem('quest-board')).epoch; } catch (e) { return 'n/a'; } }));
    await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'NewCal', sex: 'm' }); x.persist(); x.render(); document.querySelectorAll('#layer .modal,.overlay').forEach((m) => m.remove()); });
    await p.waitForTimeout(1200);
    const inbox = await p.evaluate(() => window.__qbV135 ? window.__qbV135.inbox() : 'no hook'); console.log('inbox', JSON.stringify(inbox));
    // open each letter and press its collect button twice
    for (const id of ['welcome', 'live135']) for (let k = 0; k < 2; k++) {
      const r = await p.evaluate(async (id) => { document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); try { ibOpen(id); } catch (e) { const b = document.querySelector('[data-act="inbox"],.ib-btn,[data-act="ib"]'); if (b) b.click(); }
        await new Promise((r) => setTimeout(r, 700)); const m = [...document.querySelectorAll('#layer .modal')].pop(); const btn = m && [...m.querySelectorAll('button')].find((b) => /collect|claim|\+\s*\d/i.test(b.textContent) && !b.disabled);
        const before = window.__qb.x().S.coins; if (btn) btn.click(); await new Promise((r) => setTimeout(r, 700)); return { btn: btn ? btn.textContent.trim().slice(0, 30) : null, before, after: window.__qb.x().S.coins, open: m ? m.innerText.replace(/\s+/g, ' ').slice(0, 70) : null }; }, id);
      console.log(id, 'try', k + 1, JSON.stringify(r)); }
    await p.screenshot({ path: OUT }); }
  console.log('page errors', errs.length, JSON.stringify(errs.slice(0, 2))); await ctx.close(); })();
