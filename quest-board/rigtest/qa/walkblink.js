// Characters blinking while they walk (Cal on a phone; LEAD's ce07425 decodes each rig frame before it is shown): in a room's building
// view, every character is sampled every 40 ms for 12 s; a sample where a character on screen has no picture (its <image> missing, with
// no href, or zero size) is a blink. Prints samples, walking samples, frame changes seen and blinks per role. Chromium only: Safari's
// blob decode is what Cal saw, so a clean run here shows nothing broke, not that Safari is fixed.
//   ROOM=bedroom BLD=0 BASE=<server> node walkblink.js
const { open } = require('./lib.js');
(async () => {
  const { b, p, errs } = await open({ width: 900, height: 900, owned: 'all' });
  await p.evaluate((h) => { const now = new Date(Date.now()), t = new Date(now); t.setHours(h, 0, 0, 0); window.__qbShift = (window.__qbShift || 0) + (t - now); }, 13);
  await p.evaluate((v) => { window.BLDI = v; }, +(process.env.BLD || 0));
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.areaOn = null; S.gates = [5, 10, 20, 30, 40]; S.xp = Math.max(S.xp, x.cum(45)); x.render(); document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); document.querySelector('.nav button[data-v="hideout"]').click(); });
  await p.waitForTimeout(3500);
  await p.evaluate(() => { document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); document.querySelectorAll('[data-act="bldgo"]')[BLDI].dispatchEvent(new MouseEvent('click', { bubbles: true })); });
  await p.waitForTimeout(7000);
  const r = await p.evaluate(() => new Promise((ok) => { const A = window.__qbLoft().A, stat = {}, lastHref = {}; let n = 0; const t0 = performance.now();
    const tick = () => { n++;
      Object.values(A).forEach((a) => { if (!a || a.alpha === 0 || a.pv) return; const role = a.role || '?'; const s = stat[role] = stat[role] || { samples: 0, walking: 0, changes: 0, blinks: 0 };
        const g = document.getElementById('lfa-' + a.id) || document.querySelector('[data-agent="' + a.id + '"]'); if (!g) return; s.samples++; if (a.mode === 'walk') s.walking++;
        const im = g.querySelector('image'); const href = im && (im.getAttribute('href') || im.getAttribute('xlink:href')); const box = im ? im.getBoundingClientRect() : null;
        if (!im || !href || !box || box.width < 1 || box.height < 1) s.blinks++; else { if (lastHref[a.id] && lastHref[a.id] !== href) s.changes++; lastHref[a.id] = href; } });
      if (performance.now() - t0 < 12000) setTimeout(tick, 40); else ok({ ticks: n, stat }); };
    tick(); }));
  console.log(`${r.ticks} samples over 12 s: ` + Object.entries(r.stat).map(([k, s]) => `${k}: ${s.samples} seen, ${s.walking} walking, ${s.changes} frame changes, ${s.blinks} blinks`).join('; '));
  console.log('page errors', errs.length, errs.slice(0, 2));
  await b.close();
})();
