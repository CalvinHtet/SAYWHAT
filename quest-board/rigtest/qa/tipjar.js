// ROOMS's tip jars (693effe) and LEAD's tipJarArt: in the Restaurant, Lock and Key, Boba and Dessert, the jar's art at 0 tips, a few and the
// cap, with only its counter bought and fully bought; a close-up of each jar for rule 20; then a live Restaurant left to serve guests to see
// real tips move the jar.   OUT=<folder> [SECS=90] node tipjar.js
const fs = require('fs'), path = require('path'); const { open, openRoom } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out/tip/'; fs.mkdirSync(OUT, { recursive: true }); const SECS = +(process.env.SECS || 90);
const HOST = { restaurant: [], skybar: ['sb_bar'], boba: ['bo_ctr'], dessert: ['de_bar'] };
(async () => { const { b, p, errs } = await open({ width: 1100, height: 950, owned: 'all' }); let bad = 0;
  for (const t of Object.keys(HOST)) {
    const i = await p.evaluate((t) => window.__qb.x().S.base.slots.findIndex((s) => s && s.t === t), t);
    for (const full of [false, true]) for (const lvl of [0, 1, 2]) {
      const want = 'rsx_tip' + lvl;
      const info = await p.evaluate(({ i, t, full, lvl, host }) => { const x = window.__qb.x(), S = x.S, r = S.base.slots[i]; r.a = {}; if (full) x.ADDONS[t].forEach((u) => { if (!(u[3] && (u[3].retired || u[3].opens))) r.a[u[0]] = 1; }); else host.forEach((k) => (r.a[k] = 1));
        const cap = window.lfTipCap ? null : null; S.base.tipd = { d: S.runDate || '', n: {} }; return { i }; }, { i, t, full, lvl, host: HOST[t] });
      // the cap through the game's own function: tipJarArt picks tip1 below 60% of it, tip2 from 60%
      await p.evaluate(({ i, lvl }) => { const S = window.__qb.x().S; const tdy = (window.__qbEcon && window.__qbEcon.today) ? window.__qbEcon.today() : null; S.base.tipd = { d: tdy || S.runDate, n: {} }; if (lvl) S.base.tipd.n[i] = lvl === 1 ? 10 : 9999; window.__qb.x().persist(); }, { i, lvl });
      await openRoom(p, i, 1000, 760);
      const j = await p.evaluate(() => { const ims = [...document.querySelectorAll('#qahost image')].filter((e) => /rsx_tip\d/.test(e.getAttribute('href') || '')); return ims.map((e) => { const r = e.getBoundingClientRect(); return { k: (e.getAttribute('href').match(/rsx_tip\d/) || [])[0], box: [r.left, r.top, r.width, r.height].map(Math.round) }; }); });
      const good = j.length === 1 && j[0].k === want; if (!good) bad++;
      console.log((good ? 'ok   ' : 'BAD  ') + `${t} ${full ? 'full' : 'counter only'} tips ${['0', 'a few', 'at the cap'][lvl]}: ${j.map((x) => x.k).join(',') || 'no jar'} (want ${want})`);
      const tag = `${t}_${full ? 'full' : 'bare'}_${lvl}`; await (await p.$('#qahost')).screenshot({ path: path.join(OUT, tag + '.png') });
      if (j[0]) { const c = j[0].box, pad = 70; await p.screenshot({ path: path.join(OUT, 'zoom_' + tag + '.png'), clip: { x: Math.max(0, c[0] - pad), y: Math.max(0, c[1] - pad), width: c[2] + 2 * pad, height: c[3] + 2 * pad } }); }
    }
  }
  // live: the Restaurant fully bought, no tips yet today; guests served for SECS seconds
  const i = await p.evaluate(() => { const x = window.__qb.x(), S = x.S, k = S.base.slots.findIndex((s) => s && s.t === 'restaurant'), r = S.base.slots[k]; r.a = {}; x.ADDONS.restaurant.forEach((u) => { if (!(u[3] && (u[3].retired || u[3].opens))) r.a[u[0]] = 1; }); S.base.tipd = null; S.areaOn = null; x.persist(); x.render(); return k; });
  await p.evaluate(() => { document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); document.querySelector('.nav button[data-v="hideout"]').click(); }); await p.waitForTimeout(2500);
  const nB = await p.evaluate(() => document.querySelectorAll('[data-act="bldgo"]').length); let live = 0;
  for (let k = 0; k < nB && !live; k++) { await p.evaluate((k) => { document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); const g = document.querySelectorAll('[data-act="bldgo"]')[k]; if (g) g.dispatchEvent(new MouseEvent('click', { bubbles: true })); }, k); await p.waitForTimeout(3000);
    // tips are paid only by people living in the building view (lfLive), not by the room window's preview: stay on the building
    live = await p.evaluate((i) => Object.values(window.__qbLoft().A).filter((a) => !a.pv && a.room === i).length, i);
    if (!live) { await p.evaluate(() => { const bt = [...document.querySelectorAll('button')].find((e) => /Street/.test(e.textContent)); if (bt) bt.click(); }); await p.waitForTimeout(1200); } }
  const seen = []; const t0 = Date.now();
  while (Date.now() - t0 < SECS * 1000) { await p.waitForTimeout(5000); const s = await p.evaluate((i) => { const T = window.__qb.x().S.base.tipd; const im = [...document.querySelectorAll('#app image')].map((e) => (e.getAttribute('href') || '').match(/rsx_tip\d/)).filter(Boolean)[0]; return { n: T && T.n ? T.n[i] || 0 : 0, jar: im ? im[0] : null }; }, i); seen.push(s); }
  const ns = seen.map((s) => s.n), jars = [...new Set(seen.map((s) => s.jar))];
  console.log('live Restaurant (building view), ' + live + ' people, every 5 s: tips ' + ns.join(',') + ' | jar ' + seen.map((s) => (s.jar || '-').slice(-1)).join(''));
  await p.screenshot({ path: path.join(OUT, 'live_restaurant.png') });
  console.log('page errors', errs.length, errs.slice(0, 3)); console.log(bad ? 'FAILED ' + bad : 'PASS'); await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
