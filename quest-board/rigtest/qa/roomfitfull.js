// QA copy of LEAD's rigtest/lead/roomfit.js (f314bca) with every room FULLY BOUGHT (every live upgrade, so the Restaurant and Garden
// expansions and the Auditorium's back row are in), same measure. Every room's window picture, at phone sizes: does the whole room fit inside its box? (Cal, v0.73 phone test: "Some rooms are
// cut off and not showing the whole room. Make sure all rooms are sized properly") Unlock everything, open each room's window,
// measure the drawn room (every piece of the picture) against the box it sits in.
// PORT (default 65410), VIEW=390x844,440x956 ...; NODE_PATH=<playwright> node rigtest/lead/roomfit.js
const pw = require('playwright');
const PORT = process.env.PORT || '65410', B = process.env.B || 'chromium';
const VIEWS = (process.env.VIEW || '390x844,440x956,375x667').split(',').map((v) => v.split('x').map(Number));
const SHOT = process.env.SHOT || '';
(async () => {
  const b = await pw[B].launch(B === 'chromium' ? { args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] } : {});
  let bad = 0;
  for (const [W, H] of VIEWS) {
    const p = await (await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2 })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => document.querySelector('[data-act="ccnext"]'), null, { timeout: 90000 });
    await p.fill('#ccname', 'Cal'); await p.click('[data-act="ccnext"]'); await p.waitForFunction(() => document.querySelector('[data-act="ccdone"]'), null, { timeout: 60000 }); await p.waitForTimeout(800); await p.click('[data-act="ccdone"]'); await p.waitForTimeout(2500);
    await p.evaluate(() => { document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); window.__qbRooms.unlockAll(); });
    await p.waitForTimeout(3000); await p.evaluate(() => document.querySelectorAll('#layer .modal').forEach((m) => m.remove()));
    await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.base.slots.forEach((r) => { if (!r) return; (x.ADDONS[r.t] || []).forEach((u) => { if (u[3] && (u[3].retired || u[3].opens)) return; r.a[u[0]] = 1; }); }); x.render(); });
    await p.waitForTimeout(1500); await p.evaluate(() => document.querySelectorAll('#layer .modal').forEach((m) => m.remove()));
    const n = await p.evaluate(() => window.__qb.x().S.base.slots.length);
    const out = [];
    for (let i = 0; i < n; i++) {
      const ok = await p.evaluate((i) => { document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); const r = window.__qb.x().S.base.slots[i]; if (!r) return null; window.__qb.roomModal(i); return r.t; }, i);
      if (!ok) continue; await p.waitForTimeout(900);
      const m = await p.evaluate(() => { const w = document.querySelector('#rbigw'); if (!w) return null; const svg = w.querySelector('svg'); if (!svg) return { none: 1 };
        const box = w.getBoundingClientRect(); let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
        // the room itself: not the city scenery (one big group drawn first), not skies or backdrops much bigger than the room
        const scen = [...svg.children].filter((c) => c.tagName === 'g' && c.getElementsByTagName('*').length > 400);
        [...svg.querySelectorAll('image, path, polygon, polyline, rect, ellipse, circle')].forEach((e) => { if (e.closest('defs,clipPath,mask,pattern,filter,marker,symbol')) return; if (e.closest('[class^="scrL"]')) return; /* QA: a wall screen's slide strips (scrL, scrL2) run on past the screen and are clipped to it */ if (scen.some((g) => g.contains(e))) return; const r = e.getBoundingClientRect(); if (!r.width && !r.height) return; if (r.width > box.width * 1.15 || r.height > box.height * 1.3) return;
          const cx = (r.left + r.right) / 2, cy = (r.top + r.bottom) / 2; if (cx < box.left - box.width * .2 || cx > box.right + box.width * .2 || cy < box.top - box.height * .2 || cy > box.bottom + box.height * .2) return;
          x0 = Math.min(x0, r.left); y0 = Math.min(y0, r.top); x1 = Math.max(x1, r.right); y1 = Math.max(y1, r.bottom); });
        const cut = { top: Math.max(0, box.top - y0), bottom: Math.max(0, y1 - box.bottom), left: Math.max(0, box.left - x0), right: Math.max(0, x1 - box.right) };
        const vb = svg.getAttribute('viewBox'), par = svg.getAttribute('preserveAspectRatio');
        return { box: [Math.round(box.width), Math.round(box.height)], art: [Math.round(x1 - x0), Math.round(y1 - y0)], cut: Object.fromEntries(Object.entries(cut).map(([k, v]) => [k, Math.round(v)])), vb, par, svgH: Math.round(svg.getBoundingClientRect().height) }; });
      const worst = m && m.cut ? Math.max(m.cut.top, m.cut.bottom, m.cut.left, m.cut.right) : 0;
      out.push({ i, t: ok, worst, m });
      if (SHOT && worst > 3) await p.screenshot({ path: SHOT + '/fit_' + W + '_' + ok + '.png' });
    }
    const cutRooms = out.filter((o) => o.worst > 3);
    bad += cutRooms.length;
    console.log(`${W}x${H}: ${out.length} rooms, ${cutRooms.length} cut off` + (errs.length ? ' errs ' + JSON.stringify(errs.slice(0, 2)) : ''));
    cutRooms.forEach((o) => console.log('   ', o.t.padEnd(12), 'cut', JSON.stringify(o.m.cut), 'box', o.m.box.join('x'), 'art', o.m.art.join('x')));
    await p.context().close();
  }
  console.log(bad ? 'FAIL ' + bad : 'PASS'); await b.close(); process.exit(bad ? 1 : 0);
})();
