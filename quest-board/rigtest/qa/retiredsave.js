// A retired upgrade in an old save (ROOMS's 1712242: gm_ping retired on Cal's "Yes, drop it"): a save that owns it loads, keeps the
// id, draws the room without it, its window never offers it, and the room still buys through. ROOM=gameroom ID=gm_ping BASE=<server>
const fs = require('fs'), path = require('path');
const { open } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const { b, p, errs } = await open({ width: 1000, height: 900, owned: 'all' });
  const R = process.env.ROOM || 'gameroom', ID = process.env.ID || 'gm_ping';
  await p.evaluate((h) => { const now = new Date(Date.now()), t = new Date(now); t.setHours(h, 0, 0, 0); window.__qbShift = (window.__qbShift || 0) + (t - now); }, 13);
  const r = await p.evaluate(async ([R, ID]) => { const w = (ms) => new Promise((o) => setTimeout(o, ms)); const x = window.__qb.x(), S = x.S; const k = S.base.slots.findIndex((s) => s && s.t === R); const r = S.base.slots[k];
    r.a = {}; x.ADDONS[R].forEach((u) => { if (u[3] && (u[3].retired || u[3].opens)) return; r.a[u[0]] = 1; }); r.a[ID] = 1; x.persist();
    const u = x.ADDONS[R].find((q) => q[0] === ID); document.querySelectorAll('#layer .modal').forEach((e) => e.remove()); window.__qb.roomModal(k); await w(2000);
    const imgs = [...document.querySelectorAll('.rmodal image')].map((e) => e.getAttribute('href') || '').filter((h) => /ping/i.test(h));
    const offered = /ping/i.test([...document.querySelectorAll('.rmodal .addon')].map((e) => e.innerText).join(' '));
    return { retired: !!(u && u[3] && u[3].retired), kept: !!r.a[ID], pingImages: imgs.length, offered, k }; }, [R, ID]);
  await (await p.$('.rmodal .rbig')).screenshot({ path: path.join(OUT, `${R}_owns_${ID}.png`) });
  console.log(JSON.stringify(r));
  await p.reload(); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft, null, { timeout: 60000 }); await p.waitForTimeout(1500);
  const after = await p.evaluate(([R, ID]) => { const S = window.__qb.x().S; const s = S.base.slots.find((q) => q && q.t === R); return { kept: !!(s && s.a[ID]) }; }, [R, ID]);
  console.log('after a reload the save still owns it:', after.kept);
  console.log('page errors', errs.length, errs.slice(0, 2));
  await b.close();
})();
