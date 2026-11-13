// The lag on a full Hall (Cal, 2026-11-13): the sandbox build with QA's heavy seed (rigtest/qa/mkseed.js KIND=heavy: 60 neighbours, 1,800 posts,
// 9,000 chat lines, a level-60 save with every room). Times each tab switch (tap to the next painted frame, longest task) and frames per
// second, in WebKit (Safari's engine) and in Chromium with the CPU slowed 4x.
//   BASE=<server of a sandbox dist-web> SEED=<seed json> NODE_PATH=<playwright's parent> node rigtest/lead/lagheavy.js
const pw = require('playwright');
const fs = require('fs');
const BASE = process.env.BASE || 'http://127.0.0.1:8810', SEED = JSON.parse(fs.readFileSync(process.env.SEED, 'utf8'));
(async () => {
  for (const eng of (process.env.ENG || 'webkit,chromium').split(',')) {
    const b = await pw[eng].launch(eng === 'chromium' ? { args: ['--mute-audio'] } : {});
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
    await ctx.addInitScript((seed) => { if (!localStorage.getItem('qbsbx:seeded')) { Object.keys(seed).forEach((k) => localStorage.setItem(k, seed[k])); localStorage.setItem('qbsbx:seeded', '1'); } }, SEED);
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 120)));
    await p.goto(BASE + '/index.html');
    await p.waitForFunction(() => window.QBGAME && window.QBGAME.ready(), null, { timeout: 180000 }); await p.waitForTimeout(4000);
    if (eng === 'chromium') { const cdp = await ctx.newCDPSession(p); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 }); }
    const clear = () => p.evaluate(() => document.querySelectorAll('#layer .modal').forEach((m) => m.remove()));
    const tap = (sel) => p.evaluate((sel) => new Promise((done) => { const el = document.querySelector(sel); if (!el) return done({ missing: 1 });
      const t0 = performance.now(); el.click(); requestAnimationFrame(() => requestAnimationFrame(() => done({ ms: Math.round(performance.now() - t0) }))); }), sel);
    const fps = (secs) => p.evaluate((secs) => new Promise((done) => { const f = []; let last = performance.now(); const t0 = last;
      const step = (t) => { f.push(t - last); last = t; if (t - t0 < secs * 1000) requestAnimationFrame(step); else done({ fps: Math.round(f.length / secs), worst: Math.round(Math.max(...f)), over50: f.filter((x) => x > 50).length }); };
      requestAnimationFrame(step); }), secs);
    console.log('== ' + eng + (eng === 'chromium' ? ' (CPU 4x slower)' : ''));
    const row = [];
    for (const v of ['hall', 'players', 'hideout', 'board', 'hall']) { await clear(); const r = await tap('.nav button[data-v="' + v + '"]'); await p.waitForTimeout(2500); row.push(v + ' ' + r.ms); }
    for (const t of ['chat', 'posts', 'chat', 'posts']) { const r = await tap('.htab button[data-t="' + t + '"]'); await p.waitForTimeout(1500); row.push('hall/' + t + ' ' + r.ms); }
    console.log('  tab switch ms:', row.join(', '));
    await clear(); await tap('.nav button[data-v="hall"]'); await p.waitForTimeout(3000); console.log('  Hall posts    ', JSON.stringify(await fps(5)), 'elements', await p.evaluate(() => document.querySelectorAll('*').length));
    await clear(); await tap('.nav button[data-v="players"]'); await p.waitForTimeout(4000); console.log('  Players       ', JSON.stringify(await fps(5)), 'elements', await p.evaluate(() => document.querySelectorAll('*').length), 'characters drawn', await p.evaluate(() => document.querySelectorAll('img.calp').length));
    await clear(); await tap('.nav button[data-v="hideout"]'); await p.waitForTimeout(4000); console.log('  Loft          ', JSON.stringify(await fps(5)), 'elements', await p.evaluate(() => document.querySelectorAll('*').length));
    console.log('  errors', JSON.stringify(errs.slice(0, 3)));
    await b.close();
  }
})().catch((e) => { console.log('crash', e.message); process.exit(2); });
