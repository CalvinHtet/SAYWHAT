// A close look at the lobby's left wall (rule 20): poster, sconce and doors at 3 tiers and both sizes.   OUT=<folder> node lobbyzoom.js
const path = require('path'); const { open, openRoom } = require('./lib.js'); const OUT = process.env.OUT || 'qa-out';
(async () => { const { b, p, errs } = await open({ width: 1900, height: 1500, owned: 'none' });
  const i = await p.evaluate(() => { const S = window.__qb.x().S; if (!S.base.slots.some((s) => s.t === 'theater')) S.base.slots.push({ t: 'theater', a: {}, st: 0, pend: 0 }); return S.base.slots.findIndex((s) => s.t === 'theater'); });
  const FULL = await p.evaluate(() => { const x = window.__qb.x(); const nw = (id, seen = {}) => { if (seen[id]) return false; seen[id] = 1; const u = x.ADDONS.theater.find((q) => q[0] === id); if (!u) return false; if (u[3] && u[3].also === 't_wing') return true; const rq = typeof ADDREQ !== 'undefined' && ADDREQ[id]; return rq === 't_wing' || (rq && nw(rq, seen)); }; return x.ADDONS.theater.filter((u) => !(u[3] && (u[3].retired || u[3].opens)) && u[0] !== 't_wing' && !nw(u[0])).map((u) => u[0]); });
  const FULLW = await p.evaluate(() => window.__qb.x().ADDONS.theater.filter((u) => !(u[3] && (u[3].retired || u[3].opens))).map((u) => u[0]));
  for (const [lab, a] of [['full_w33', FULLW], ['full_t33', FULL], ['t23', ['t_wl1', 't_wl2', 't_fl1', 't_fl2', 't_fl3']], ['t33', ['t_wl1', 't_wl2', 't_wl3', 't_fl1', 't_fl2', 't_fl3']], ['w23', ['t_wl1', 't_wl2', 't_fl1', 't_fl2', 't_fl3', 't_wing']]]) {
    await p.evaluate(({ i, a }) => { const x = window.__qb.x(), r = x.S.base.slots[i]; r.a = Object.fromEntries(a.map((k) => [k, 1])); x.persist(); }, { i, a }); await openRoom(p, i, 1860, 1500);
    const g = await p.evaluate(() => { const svg = document.querySelector('#qahost svg'); const it = [...svg.querySelectorAll('image')].map((e) => ({ k: ((e.getAttribute('href') || '').match(/[a-z_0-9]+\.webp/) || [''])[0], r: e.getBoundingClientRect() })).filter((e) => /sconce|poster|w_th/.test(e.k)); return it.map((e) => e.k + ' ' + [e.r.left, e.r.top, e.r.right, e.r.bottom].map(Math.round).join(',')); });
    console.log(lab, g.join(' | '));
    await p.screenshot({ path: path.join(OUT, `lobzoom_${lab}.png`), clip: { x: 40, y: 130, width: 900, height: 620 } });
  }
  console.log('errors', errs.length); await b.close(); })();
