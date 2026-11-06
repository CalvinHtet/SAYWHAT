// Friends who drop by (LEAD's 8d97e24): every visit forced on a fresh player and on one with every room, its card pictured,
// its reward checked (coins, freeze, the Garden watered), its buff checked against a real quest of the matching stat or cluster
// (crewPct before and after), the freeze cap and where the card says they hang out.   BASE=<server> OUT=<folder> node friendsqa.js
const fs = require('fs'), path = require('path');
const { open } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const { b, p, errs } = await open({ width: 440, height: 900, owned: 'none' });
  const ids = await p.evaluate(() => window.__qbFriends.visits.map((v) => v.id));
  for (const own of ['none', 'all']) {
    await p.evaluate((own) => { const x = window.__qb.x(), S = x.S; if (own === 'all') Object.keys(x.ROOMT).forEach((t) => { if (!S.base.slots.some((s) => s && s.t === t)) S.base.slots.push({ t, a: {}, st: 0, pend: 0 }); });
      else S.base.slots = S.base.slots.filter((s) => s && ['bedroom'].includes(s.t)); }, own);
    for (const id of ids) {
      const r = await p.evaluate(async (id) => { const w = (ms) => new Promise((o) => setTimeout(o, ms)); const x = window.__qb.x(), S = x.S;
        document.querySelectorAll('#layer .modal,.dropsplash').forEach((e) => e.remove()); S.visit = null; S.freezes = 0; S.base.gwater = Date.now() - 1000;
        const v = window.__qbFriends.visits.find((v) => v.id === id); const q = v.buff ? (v.buff.stat ? { n: 'a ' + v.buff.stat + ' quest', stat: v.buff.stat, cl: 'zz' } : { n: 'a ' + v.buff.cl + ' quest', cl: v.buff.cl, stat: 'zz' }) : null;
        const cp = (q) => { const m = x.mults(q); return typeof m === 'number' ? m : JSON.stringify(m).slice(0, 60); }; const before = q ? cp(q) : null; const c0 = S.coins;
        window.__qbFriends.force(id); await w(700);
        const m = document.querySelector('#layer .modal'); const txt = m ? m.innerText.replace(/\s+/g, ' ') : ''; const img = m ? [...m.querySelectorAll('.vfig img,.vfig svg,.vfig canvas')].map((e) => { const r = e.getBoundingClientRect(); return Math.round(r.width) + 'x' + Math.round(r.height); }) : [];
        return { id, coins: S.coins - c0, freezes: S.freezes, wet: typeof gdWatered === 'function' ? gdWatered() : null, q: q ? q.n : null, before, after: q ? cp(q) : null, txt, img, here: (txt.match(/hanging out in ([^.]+)\./) || [])[1], buffs: (S.visit && S.visit.id) }; }, id);
      console.log(`${own === 'all' ? 'ALL ' : 'NEW '} ${r.id.padEnd(15)} figs ${r.img.join(',') || 'NONE'}  coins +${r.coins}  freezes ${r.freezes}  garden wet ${r.wet}  buff ${r.q ? `"${r.q}" ${r.before} -> ${r.after}` : '-'}  here: ${r.here}`);
      if (own === 'all' || id === 'cynthia_garden') await (await p.$('#layer .modal .card')).screenshot({ path: path.join(OUT, `visit_${own}_${id}.png`) }).catch(() => {});
    }
  }
  // the freeze cap: Kenan with both slots full (2 with no freeze buffs; the wheel and streaks stop at the cap)
  const cap = await p.evaluate(() => { const S = window.__qb.x().S; document.querySelectorAll('#layer .modal').forEach((e) => e.remove()); S.visit = null; S.freezes = 2; const c0 = S.coins; window.__qbFriends.force('kenan_checkup'); const t = document.querySelector('#layer .modal').innerText.replace(/\s+/g, ' '); return { freezes: S.freezes, coins: S.coins - c0, card: (t.match(/\+[^+]*freeze[^.]*/) || [''])[0].slice(0, 60) }; });
  console.log('Kenan with 2 freezes already:', JSON.stringify(cap));
  console.log('page errors', errs.length, errs.slice(0, 3));
  await b.close();
})();
