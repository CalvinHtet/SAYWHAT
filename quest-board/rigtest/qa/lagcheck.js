// Phone lag fix (LEAD's 19ef0d9; Cal's iPhone on v0.67: room windows 37-38 fps, worst frames 214 and 421 ms): with any window open
// the effects behind it (#app, the tab bar, the screen overlays) pause. (A) Frame rate in the Game Room and Restaurant windows, every
// upgrade, at 390x844 x3 with the CPU 4x slower, on BASE0 (before) and BASE (after). (B) On BASE: a room window, a level-up, a visit
// card, a story scene and a Review play each opened and closed: while open, nothing inside the window is paused; after it closes,
// nothing in the page is left paused and the tab "!" and the Board's effects run again.   BASE0=<before> BASE=<after> node lagcheck.js
const { chromium } = require('playwright');
const fails = []; const ok = (n, c, g) => { console.log((c ? '  ok   ' : '  FAIL ') + n + (g !== undefined ? '  ' + JSON.stringify(g).slice(0, 320) : '')); if (!c) fails.push(n); };
const open = async (b, base) => { const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true }); const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 140)));
  await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => document.querySelector('[data-act="ccnext"]'), null, { timeout: 90000 });
  await p.fill('#ccname', 'Cal'); await p.click('[data-act="ccnext"]'); await p.waitForFunction(() => document.querySelector('[data-act="ccdone"]'), null, { timeout: 60000 }); await p.waitForTimeout(800);
  await p.evaluate(() => document.querySelector('[data-act="ccdone"]').click()); await p.waitForTimeout(3000);
  await p.evaluate(() => { window.__qbRooms.unlockAll(); ['gameroom', 'restaurant'].forEach((t) => window.__qbRooms.all(t, 1)); document.querySelectorAll('#layer .modal,.dropsplash').forEach((m) => m.remove()); document.querySelector('.nav button[data-v="board"]').click(); });
  await p.waitForTimeout(1500); return { ctx, p, errs }; };
const fps = (p) => p.evaluate(async () => { let n = 0, worst = 0, over = 0, last = performance.now(); await new Promise((r) => { const t0 = performance.now(); const f = (ts) => { const d = ts - last; last = ts; if (n > 2) { if (d > worst) worst = d; if (d > 50) over++; } n++; if (ts - t0 < 4000) requestAnimationFrame(f); else r(); }; requestAnimationFrame(f); }); return { fps: +(n / 4).toFixed(1), worst: Math.round(worst), over50: over }; });
// paused CSS animations in a part of the page (by computed play state, so pseudo-elements' owners count too)
const paused = (p, sel) => p.evaluate((sel) => { let run = 0, pau = 0; const names = new Set(); document.querySelectorAll(sel).forEach((e) => { [e, ':before', ':after'].forEach((ps) => { const st = ps === e ? getComputedStyle(e) : getComputedStyle(e, ps); if (st.animationName && st.animationName !== 'none') { if (/paused/.test(st.animationPlayState)) { pau++; names.add(st.animationName.split(',')[0]); } else run++; } }); }); return { run, paused: pau, names: [...names].slice(0, 6) }; }, sel);
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  // (A)
  const res = {};
  for (const [tag, base] of [['before', process.env.BASE0], ['after', process.env.BASE]]) {
    if (!base) continue; const { ctx, p } = await open(b, base); const cdp = await ctx.newCDPSession(p); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    for (const t of ['gameroom', 'restaurant']) { await p.evaluate((t) => { document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); const S = window.__qb.x().S; window.__qb.roomModal(S.base.slots.findIndex((s) => s && s.t === t)); }, t); await p.waitForTimeout(4000);
      const a = await fps(p), c = await fps(p); res[tag + ' ' + t] = { fps: Math.min(a.fps, c.fps), worst: Math.max(a.worst, c.worst), over50: a.over50 + c.over50 }; }
    await ctx.close(); }
  Object.entries(res).forEach(([k, v]) => console.log(`  ${k.padEnd(18)} ${v.fps} fps, worst frame ${v.worst} ms, frames over 50 ms ${v.over50}`));
  if (res['after gameroom']) ok('after: Game Room and Restaurant windows at least 50 fps at CPU x4, worst frame under 100 ms', ['gameroom', 'restaurant'].every((t) => res['after ' + t].fps >= 50 && res['after ' + t].worst < 100), res);
  // (B)
  const { p, errs } = await open(b, process.env.BASE);
  const wins0 = await p.evaluate(() => [...document.querySelectorAll('#layer .modal')].map((m) => (m.querySelector('.label,h2') || {}).textContent));
  await p.evaluate(() => document.querySelectorAll('#layer .modal,.dropsplash').forEach((m) => m.remove())); await p.waitForTimeout(400);
  const base0 = await paused(p, '#app *, .nav *, .fxo'); ok(`Board with no window: nothing paused (windows that had opened by themselves after setup: ${wins0.join(', ') || 'none'})`, base0.paused === 0, base0);
  const cases = [
    ['room window', () => { const S = window.__qb.x().S; window.__qb.roomModal(S.base.slots.findIndex((s) => s && s.t === 'gameroom')); }],
    ['level-up', () => { const bt = document.querySelector('#qbt [data-act="simlvl"]'); if (bt) bt.click(); }],
    ['visit card', () => { const v = window.__qbFriends.visits.find((q) => q.who.length >= 2); window.__qb.x().S.visit = null; window.__qbFriends.force(v.id); }],
    ['story scene', () => { window.__qbRooms.review(); const bt = [...document.querySelectorAll('#layer .modal [data-rv]')].find((e) => e.dataset.rv === 'scene' || /sty|scene/.test(e.dataset.rv)); document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); if (bt) window.__qbRooms.play(bt.dataset.rv, bt.dataset.v); }],
    ['Review play (a welcome)', () => { window.__qbRooms.review(); const bt = [...document.querySelectorAll('#layer .modal [data-rv]')].find((e) => /welcome|room|splash/.test(e.dataset.rv)) || document.querySelector('#layer .modal [data-rv]'); document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); window.__qbRooms.play(bt.dataset.rv, bt.dataset.v); }],
  ];
  // give the Board something to animate behind: an unseen tab "!"
  await p.evaluate(() => { const S = window.__qb.x().S; if (S.alSeen) S.alSeen.tab.shop = 0; window.__qb.x().render(); });
  for (const [name, fn] of cases) {
    await p.evaluate(() => document.querySelectorAll('#layer .modal,.dropsplash').forEach((m) => m.remove())); await p.waitForTimeout(400);
    if (name === 'level-up') { await p.evaluate(() => { const t = document.querySelector('#qbt [data-q="t"]'); if (t) t.click(); }); await p.waitForTimeout(300); }
    await p.evaluate(fn); await p.waitForTimeout(900);
    const open1 = await p.evaluate(() => document.querySelectorAll('#layer .modal').length);
    const inWin = await paused(p, '#layer .modal:last-of-type, #layer .modal:last-of-type *'); const behind = await paused(p, '#app *, .nav *, .fxo');
    // close it the way a player does: its close or primary button
    await p.evaluate(() => { const ms = [...document.querySelectorAll('#layer .modal')]; const m = ms[ms.length - 1]; if (!m) return; const bt = m.querySelector('[data-act="mclose"], #vok, .btn.ghost, .btn'); if (bt) bt.click(); else m.remove(); });
    await p.waitForTimeout(700); await p.evaluate(() => document.querySelectorAll('#layer .modal').forEach((m) => m.remove())); await p.waitForTimeout(500);
    const after = await paused(p, '#app *, .nav *, .fxo'); const left = await p.evaluate(() => document.querySelectorAll('#layer .modal').length);
    ok(`${name}: opened (${open1}); inside it ${inWin.run} running, ${inWin.paused} paused; behind it ${behind.paused} paused while open; after closing ${after.paused} paused, ${after.run} running, ${left} windows left`,
      open1 > 0 && inWin.paused === 0 && after.paused === 0 && left === 0, { inWin, behind: behind.names, after });
  }
  const bang = await p.evaluate(() => { const e = document.querySelector('.nav .nbang'); return e ? getComputedStyle(e).animationPlayState : 'no badge'; });
  ok('the tab "!" bounces again after the windows close', bang === 'running' || bang === 'no badge', bang);
  ok('no page errors', errs.length === 0, errs.slice(0, 3));
  console.log(fails.length ? 'FAILED ' + fails.length : 'PASS'); await b.close();
})();
