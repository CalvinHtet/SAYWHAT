// Four visit arrivals (LEAD's f7a43bb; Cal: "I want 4 different animations of when the visitors come visit our base. I want each
// visit to be unique"). At 360 and 390, with one friend and with two: each arrival (door, ride, drop, pop) frozen at 0, 0.2, 0.45,
// 0.7, 1.1 and 2 s for a strip of pictures, and at the end: the figures fully inside the card and on screen, opaque and at rest, the
// door/dust/shadow gone, the card's line, the button reachable, nothing wider than the screen during the arrival. Reduced motion:
// the friends stand there at once, no door. Then 12 real visits on 12 days (__qbFriends.force): all four used, never the same twice
// running, and a visit's arrival kept after a reload.   BASE=<server> OUT=<folder> node visits.js
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:8769', OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
const fails = []; const ok = (n, c, g) => { console.log((c ? '  ok   ' : '  FAIL ') + n + (g !== undefined ? '  ' + JSON.stringify(g).slice(0, 300) : '')); if (!c) fails.push(n); };
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  for (const [W, motion] of [[390, 'no-preference'], [360, 'no-preference'], [390, 'reduce']]) {
    const ctx = await b.newContext({ viewport: { width: W, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: motion }); const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
    await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbFriends && window.__qbRooms, null, { timeout: 90000 }); await p.waitForTimeout(1200);
    await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(30); S.gates = [5, 10, 20]; x.persist(); x.render(); });
    const ids = await p.evaluate(() => { const v = window.__qbFriends.visits.filter((q) => !q.who.every((w) => w.startsWith('dog:'))); return { one: (v.find((q) => q.who.length === 1) || {}).id, two: (v.find((q) => q.who.length >= 2) || {}).id }; });
    for (const [label, id] of [['one friend', ids.one], ['two friends', ids.two]]) {
      if (!id) { console.log('  (no ' + label + ' visit)'); continue; }
      for (const kind of (motion === 'reduce' ? ['door', 'pop'] : ['door', 'ride', 'drop', 'pop'])) {
        const got = await p.evaluate(async ([id, kind]) => { const w = (ms) => new Promise((o) => setTimeout(o, ms)); let g = 0, m;
          while (g++ < 10) { document.querySelectorAll('#layer .modal').forEach((e) => e.remove()); window.__qbRooms.play('visit', id); await w(30); m = [...document.querySelectorAll('#layer .modal')].pop(); if (m && m.querySelector('.va-' + kind)) return true; } return false; }, [id, kind]);
        if (!got) { ok(`${W}${motion === 'reduce' ? ' reduced' : ''} ${label}: ${kind} shown`, false); continue; }
        const frames = []; let maxW = 0; const badFrames = [];
        for (const t of [0, 200, 450, 700, 1100, 2000]) {
          const r = await p.evaluate((t) => { const m = [...document.querySelectorAll('#layer .modal')].pop(), f = m.querySelector('.vfig'); m.getAnimations({ subtree: true }).forEach((a) => { a.pause(); a.currentTime = t; }); const card = m.querySelector('.card').getBoundingClientRect(), h = m.querySelector('h2').getBoundingClientRect(), fr = f.getBoundingClientRect(); let cross = 0, out = 0;
            [...m.querySelectorAll('.fvpose img, .fvpose canvas, .fvpose .fvart')].forEach((e) => { const q = e.getBoundingClientRect(); const vis = { l: Math.max(q.left, fr.left), r: Math.min(q.right, fr.right), t: Math.max(q.top, getComputedStyle(f).overflow === 'hidden' ? fr.top : -1e9), b: Math.min(q.bottom, fr.bottom) }; if (vis.r <= vis.l || vis.b <= vis.t) return; if (vis.t < h.bottom - 2 && vis.b > h.top && vis.r > h.left && vis.l < h.right) cross++; if (vis.l < card.left - 1 || vis.r > card.right + 1) out++; });
            return { w: document.documentElement.scrollWidth, cross, out }; }, t);
          maxW = Math.max(maxW, r.w); if (r.cross || r.out) badFrames.push(t + 'ms' + (r.cross ? ' over the names' : '') + (r.out ? ' past the edge' : '')); const el = await p.$('#layer .modal:last-of-type .card'); const fn = `va_${W}${motion === 'reduce' ? 'r' : ''}_${label.replace(' ', '')}_${kind}_${t}.png`; await el.screenshot({ path: path.join(OUT, fn) }).catch(() => {}); frames.push(fn); }
        const end = await p.evaluate(() => { const m = [...document.querySelectorAll('#layer .modal')].pop(), card = m.querySelector('.card'), c = card.getBoundingClientRect(), poses = [...m.querySelectorAll('.fvpose')];
          const pr = poses.map((e) => { const r = e.getBoundingClientRect(); const st = getComputedStyle(e); return { in: r.left >= c.left - 1 && r.right <= c.right + 1 && r.top >= c.top - 1 && r.bottom <= c.bottom + 1, op: +st.opacity, tf: st.transform }; });
          const door = getComputedStyle(m.querySelector('.vfig'), '::before'), after = getComputedStyle(m.querySelector('.vfig'), '::after');
          const btn = m.querySelector('#vok'), br = btn && btn.getBoundingClientRect();
          return { label: (m.querySelector('.label') || {}).textContent, poses: pr, doorOp: door.content !== 'none' ? +door.opacity : null, doorDisp: door.display, fxOp: after.content !== 'none' ? +after.opacity : null, onScreen: c.left >= -1 && c.right <= innerWidth + 1, btn: br ? br.bottom <= innerHeight && br.width > 0 : false }; });
        const atRest = end.poses.every((q) => q.in && q.op > .99 && (q.tf === 'none' || /matrix\(1, 0, 0, 1, 0, 0\)/.test(q.tf)));
        const leftovers = (end.doorOp === null || end.doorOp < .05 || end.doorDisp === 'none') && (end.fxOp === null || end.fxOp < .05 || kind === 'drop');
        ok(`${W}${motion === 'reduce' ? ' reduced motion' : ''} ${label} ${kind} ("${end.label}"): ends at rest inside the card, door/dust gone, button reachable, page never wider than ${W}`, atRest && leftovers && end.onScreen && end.btn && maxW <= W + 1 && !badFrames.length, { badFrames, end, maxW });
        if (motion === 'reduce') { const f0 = await p.evaluate(() => { const m = [...document.querySelectorAll('#layer .modal')].pop(); m.getAnimations({ subtree: true }).forEach((a) => { a.currentTime = 0; }); const pose = m.querySelector('.fvpose'); return { op: +getComputedStyle(pose).opacity, door: getComputedStyle(m.querySelector('.vfig'), '::before').display, anims: m.getAnimations({ subtree: true }).length }; });
          ok(`reduced motion ${label} ${kind}: the friend is there from the first frame, no door`, f0.op > .99 && (f0.door === 'none' || kind !== 'door'), f0); }
      }
    }
    if (W === 390 && motion !== 'reduce') {
      // 12 real visits on 12 days
      const seq = await p.evaluate(async () => { const w = (ms) => new Promise((o) => setTimeout(o, ms)); const S = window.__qb.x().S, vs = window.__qbFriends.visits.filter((q) => !q.who.every((x) => x.startsWith('dog:'))); const out = [];
        for (let d = 0; d < 12; d++) { document.querySelectorAll('#layer .modal').forEach((e) => e.remove()); window.__qbShift = (window.__qbShift || 0) + 864e5; S.visit = null; S.fvDay = null;
          window.__qbFriends.force(vs[d % vs.length].id); await w(400); const m = [...document.querySelectorAll('#layer .modal')].pop(); const c = m && m.querySelector('.visit'); out.push(c ? (c.className.match(/va-(\w+)/) || [])[1] : 'none'); }
        return { out, arr: S.visit && S.visit.arr, id: S.visit && S.visit.id }; });
      const reps = seq.out.filter((k, i) => i && k === seq.out[i - 1]).length; const kinds = new Set(seq.out);
      ok(`12 real visits: ${seq.out.join(' ')}: all four used, none twice running`, kinds.size === 4 && reps === 0 && !seq.out.includes('none'), seq.out);
      await p.waitForTimeout(800); await p.reload(); await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbFriends, null, { timeout: 90000 }); await p.waitForTimeout(2500);
      const again = await p.evaluate(async () => { const w = (ms) => new Promise((o) => setTimeout(o, ms)); const S = window.__qb.x().S; return { arr: S.visit && S.visit.arr, id: S.visit && S.visit.id, last: S.visitArr }; });
      ok('after a reload the day\'s visit keeps its arrival', again.id === seq.id && again.arr === seq.arr, { before: seq.arr, after: again });
    }
    ok(`${W}${motion === 'reduce' ? ' reduced motion' : ''}: no page errors`, errs.length === 0, errs.slice(0, 3)); await ctx.close();
  }
  console.log(fails.length ? 'FAILED ' + fails.length : 'PASS'); await b.close();
})();
