// QA: the pick-1-of-3 milestone every 5 levels (fccf7c9) on a phone (390x844, and 360x740). A player waits at a level trial with XP
// stored past level 10; the trial passes on honor (as in play); then whatever windows come are clicked through in order, logging each,
// with a picture of every window. Expect: the trial/level-up windows first, then Level 5 milestone, pick one, then Level 10 milestone.
const pw = require('playwright'); const base = process.env.BASE, OUT = process.env.OUT, W = +(process.env.W || 390), H = +(process.env.H || 844);
(async () => { const b = await pw.chromium.launch(); const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2 }); await ctx.route('**/*', (r) => (r.request().url().startsWith(base) ? r.continue() : r.abort())); const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && QBLoft.data, null, { timeout: 90000 }); await p.waitForTimeout(1500);
  const g0 = await p.evaluate(() => { const x = window.__qb.x(), S = x.S; const G = [5, 10, 20, 30, 40, 50, 65, 80, 100]; /* GATES, 10_app_a.js:4 (private) */
    // the last gate at or below 5 that is not a class/spec/oath pick (index 0, 2, 7) if there is one; otherwise the first
    const gi = 0; // the level-5 trial (the class pick); XP stored past it stops at the level-10 trial, so effLvl lands on 9
    S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.gates = G.slice(0, gi); S.ms = undefined; S.xp = x.cum(11) + 5; S.areaOn = null;
    S.lastDone = new Date().toISOString().slice(0, 10); x.persist(); x.render(); window.__S0 = S;
    return { G, gi, gate: G[gi], gated: x.gated(), eff: x.effLvl(), raw: x.lvlOf(S.xp), ms: JSON.stringify(S.ms) }; });
  console.log('setup', JSON.stringify(g0));
  // the trial passes on honor: active today with trialN at trialDays-1 (as a player who did the second active day)
  await p.evaluate(() => { const S = window.__qb.x().S; document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); S.trialN = (window.ECON && ECON.trialDays ? ECON.trialDays : 2) - 1; S.trialDay = '2000-01-01';
    try { S.lastDone = today(); } catch (e) {} window.__qb.x().persist(); });
  console.log('before trial', await p.evaluate(() => JSON.stringify([window.__qb.x().S.ms, window.__qb.x().S === window.__S0, window.__qb.x().effLvl()])));
  const log = []; let shot = 0;
  for (let k = 0; k < 14; k++) { await p.waitForTimeout(k === 0 ? 5000 : 1300);
    const st = await p.evaluate(() => { const m = [...document.querySelectorAll('#layer .modal')].pop(); const x = window.__qb.x(); const same = x.S === window.__S0; if (!m) return { none: 1, eff: x.effLvl(), ms: JSON.stringify(x.S.ms), same };
      const r = m.querySelector('.card') ? m.querySelector('.card').getBoundingClientRect() : m.getBoundingClientRect();
      const btns = [...m.querySelectorAll('button')].filter((b) => b.offsetParent).map((b) => (b.id || b.dataset.act || '') + ':' + b.textContent.trim().slice(0, 24));
      const ms = m.querySelector('.ms-pick'); const opts = ms ? [...ms.querySelectorAll('.ms-opt')].map((o) => { const q = o.getBoundingClientRect(); return [o.dataset.id, Math.round(q.x), Math.round(q.right), Math.round(q.width)]; }) : null;
      return { title: (m.querySelector('h2,h3,.label') || {}).textContent, text: m.innerText.replace(/\s+/g, ' ').slice(0, 90), box: [Math.round(r.x), Math.round(r.y), Math.round(r.right), Math.round(r.bottom)], vw: innerWidth, vh: innerHeight, btns, opts, eff: x.effLvl(), ms: JSON.stringify(x.S.ms), same }; });
    log.push(st); console.log(k, JSON.stringify(st).slice(0, 520));
    if (st.none) { if (k > 4) break; continue; }
    await p.screenshot({ path: `${OUT}_${W}_${++shot}.png` });
    // click through: a milestone picks its first option; a class pick picks the first; otherwise the primary button
    await p.evaluate(() => { const m = [...document.querySelectorAll('#layer .modal')].pop(); if (!m) return; const o = m.querySelector('.ms-opt'); if (o) { o.click(); return; } const go = m.querySelector('[data-act=pkgo]'); if (go) { const c = [...m.querySelectorAll('button')].filter((b) => b.offsetParent && b !== go)[0]; if (c) c.click(); go.click(); return; }
      const b = m.querySelector('#lvok') || m.querySelector('.btn.big') || [...m.querySelectorAll('button')].filter((b) => b.offsetParent)[0]; if (b) b.click(); }); }
  console.log('final', JSON.stringify(await p.evaluate(() => { const x = window.__qb.x(); return { eff: x.effLvl(), coins: x.S.coins, ms: x.S.ms }; })));
  console.log('page errors', errs.length, JSON.stringify(errs.slice(0, 2))); await b.close(); })();
