// Shadows vanishing after a buy (Cal; ROOMS's 07812e4 gives the shadow filters new ids each render): a room window open on a phone,
// then upgrades bought one after another through the game's own buy path while every frame for 1.5 s after each buy is checked:
// shadow shapes drawn with filter="url(#id)" whose filter element is missing at that moment (not drawn in that frame).
//   ROOM=bedroom BASE=<server> node shadowbuy.js
const { open } = require('./lib.js');
(async () => {
  const { b, p, errs } = await open({ width: 390, height: 844, owned: 'none', mobile: true });
  const ROOM = process.env.ROOM || 'bedroom';
  await p.evaluate((h) => { const now = new Date(Date.now()), t = new Date(now); t.setHours(h, 0, 0, 0); window.__qbShift = (window.__qbShift || 0) + (t - now); }, 16);
  const i = await p.evaluate((R) => { const S = window.__qb.x().S; return S.base.slots.findIndex((s) => s && s.t === R); }, ROOM);
  await p.evaluate((i) => { document.querySelectorAll('#layer .modal,.dropsplash').forEach((e) => e.remove()); window.__qb.roomModal(i); }, i); await p.waitForTimeout(2500);
  const ups = await p.evaluate((R) => window.__qb.x().ADDONS[R].filter((u) => !(u[3] && (u[3].retired || u[3].opens))).map((u) => u[0]).slice(0, 8), ROOM);
  let worst = 0, total = 0;
  for (const u of ups) {
    const r = await p.evaluate(async ([i, u]) => { const x = window.__qb.x(), S = x.S; const btn = document.querySelector(`.rmodal [data-u="${u}"], .rmodal [data-id="${u}"]`);
      if (btn) btn.click(); else { S.base.slots[i].a[u] = 1; x.persist(); x.render(); if (!document.querySelector('.rmodal')) window.__qb.roomModal(i); }
      return await new Promise((ok) => { let frames = 0, bad = 0, maxMiss = 0, shadowEls = 0; const t0 = performance.now();
        const f = () => { frames++; const s = document.querySelector('.rmodal .rbig svg'); if (s) { const refs = [...s.querySelectorAll('[filter^="url(#"]')]; shadowEls = Math.max(shadowEls, refs.length);
            const miss = refs.filter((e) => !document.getElementById(e.getAttribute('filter').slice(5, -1))).length; if (miss) { bad++; maxMiss = Math.max(maxMiss, miss); } }
          if (performance.now() - t0 < 1500) requestAnimationFrame(f); else ok({ via: btn ? 'button' : 'render', frames, bad, maxMiss, shadowEls }); };
        requestAnimationFrame(f); }); }, [i, u]);
    total += r.bad; worst = Math.max(worst, r.maxMiss);
    console.log(`${u.padEnd(12)} via ${r.via}: ${r.frames} frames, ${r.bad} with a missing shadow filter (up to ${r.maxMiss} of ${r.shadowEls} shapes)`);
  }
  console.log(`${ROOM}: ${total} frames with a missing filter over ${ups.length} buys`);
  console.log('page errors', errs.length, errs.slice(0, 2));
  await b.close();
})();
