const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 440, height: 840 }, deviceScaleFactor: 3 }); const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://127.0.0.1:65410/dist/index.html'); await p.waitForFunction(() => document.querySelector('[data-act="ccnext"]'), null, { timeout: 60000 });
  await p.fill('#ccname', 'Cal'); await p.click('[data-act="ccnext"]'); await p.waitForFunction(() => document.querySelector('[data-act="ccdone"]'), null, { timeout: 60000 }); await p.waitForTimeout(800); await p.click('[data-act="ccdone"]'); await p.waitForTimeout(2500);
  await p.evaluate(() => { window.__qbRooms.unlockAll(); ['gameroom', 'restaurant'].forEach(t => window.__qbRooms.all(t, 1)); document.querySelectorAll('#layer .modal').forEach(m => m.remove()); });
  const cdp = await ctx.newCDPSession(p); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  const out = {}; if (process.env.PAUSE) await p.addStyleTag({ content: 'body:has(.rmodal) #app *, body:has(.rmodal) #app *::before, body:has(.rmodal) #app *::after, body:has(.rmodal) .nav *, body:has(.rmodal) .fxo { animation-play-state: paused !important }' });
  for (const t of ['gameroom', 'restaurant']) {
    await p.evaluate((t) => { document.querySelectorAll('#layer .modal').forEach(m => m.remove()); const x = window.__qb.x(); const i = x.S.base.slots.findIndex(s => s && s.t === t); window.__qb.roomModal(i); }, t);
    await p.waitForTimeout(4000);
    out[t] = await p.evaluate(async () => { const m = document.querySelector('#layer .rmodal'), all = document.querySelectorAll('*').length, inWin = m.querySelectorAll('*').length;
      const an = document.getAnimations(), byName = {}; an.forEach(a => { const n = a.animationName || a.constructor.name; byName[n] = (byName[n] || 0) + 1; });
      const behind = document.querySelectorAll('#app *').length, svgIn = m.querySelectorAll('svg *').length, imgs = m.querySelectorAll('image,img').length;
      // fps over 3 s
      let n = 0, worst = 0, last = performance.now(), over = 0; await new Promise(r => { const t0 = performance.now(); const f = (ts) => { const d = ts - last; last = ts; if (d > worst) worst = d; if (d > 50) over++; n++; if (ts - t0 < 3000) requestAnimationFrame(f); else r(); }; requestAnimationFrame(f); });
      const top = Object.entries(byName).sort((a, b) => b[1] - a[1]).slice(0, 10);
      return { fps: +(n / 3).toFixed(1), worst: Math.round(worst), over, all, inWin, behind, svgIn, imgs, anims: an.length, top }; }); }
  console.log(JSON.stringify(Object.fromEntries(Object.entries(out).map(([k,v])=>[k,[v.fps,v.worst,v.over,v.anims]]))), errs.length); await b.close(); })();
