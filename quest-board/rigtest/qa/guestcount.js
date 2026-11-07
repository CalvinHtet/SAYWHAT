// Customers in every business (ROOMS's 93d33f1; Cal: "two of the same NPCs in the restaurant. Keep it unique but sparse ... busy but
// tasteful"): every building view opened in turn with every room fully bought, sampled every 3 s for 30 s; per business room: the most
// customers at once, and any two customers in the same room with the same look (duplicates). Rooms that never show a customer are listed
// too, so "too empty" stands out.   BASE=<server> [HOUR=13] node guests.js
const { open } = require('./lib.js');
(async () => {
  const { b, p, errs } = await open({ width: 1100, height: 1000, owned: 'all' });
  await p.evaluate((h) => { const now = new Date(Date.now()), t = new Date(now); t.setHours(h, 0, 0, 0); window.__qbShift = (window.__qbShift || 0) + (t - now); }, +(process.env.HOUR || 13));
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.areaOn = null; S.gates = [5, 10, 20, 30, 40]; S.xp = Math.max(S.xp, x.cum(45)); S.base.slots.forEach((r) => { if (!r) return; (x.ADDONS[r.t] || []).forEach((u) => { if (u[3] && (u[3].retired || u[3].opens)) return; r.a[u[0]] = 1; }); }); x.persist(); x.render(); document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); document.querySelector('.nav button[data-v="hideout"]').click(); });
  await p.waitForTimeout(3000);
  const nB = await p.evaluate(() => document.querySelectorAll('[data-act="bldgo"]').length);
  const stat = {};
  for (let k = 0; k < nB; k++) {
    await p.evaluate((k) => { document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); const g = document.querySelectorAll('[data-act="bldgo"]')[k]; if (g) g.dispatchEvent(new MouseEvent('click', { bubbles: true })); }, k);
    await p.waitForTimeout(6000);
    for (let s = 0; s < 10; s++) {
      const snap = await p.evaluate(() => { const x = window.__qb.x(), S = x.S, A = window.__qbLoft().A; const by = {};
        Object.values(A).forEach((a) => { if (!a || a.role !== 'guest' && a.role !== 'customer' && !/guest|cust/.test(String(a.id))) return; const sl = S.base.slots[a.room]; if (!sl) return; const t = sl.t;
          const key = JSON.stringify(a.look && (a.look.rig || a.look)).slice(0, 400); (by[t] = by[t] || []).push(key); });
        return by; });
      Object.entries(snap).forEach(([t, looks]) => { const st = stat[t] = stat[t] || { max: 0, dup: 0, samples: 0, nonzero: 0 }; st.samples++; if (looks.length) st.nonzero++; st.max = Math.max(st.max, looks.length); const seen = new Set(); looks.forEach((l) => { if (seen.has(l)) st.dup++; seen.add(l); }); });
      await p.waitForTimeout(3000);
    }
    await p.evaluate(() => { const bt = [...document.querySelectorAll('button')].find((e) => /Street/.test(e.textContent)); if (bt) bt.click(); }); await p.waitForTimeout(1200);
  }
  const all = await p.evaluate(() => window.__qb.x().S.base.slots.filter(Boolean).map((r) => r.t));
  Object.entries(stat).sort().forEach(([t, s]) => console.log(`${(s.dup ? 'DUP ' : s.max > 5 ? 'MANY' : 'ok  ')} ${t.padEnd(11)} most at once ${s.max}, duplicate looks seen ${s.dup}, samples with someone ${s.nonzero}/${s.samples}`));
  console.log('rooms with no customer ever:', all.filter((t) => !stat[t]).join(' ') || 'none');
  console.log('page errors', errs.length, errs.slice(0, 2));
  await b.close();
})();
