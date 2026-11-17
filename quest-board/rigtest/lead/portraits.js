// Portraits on a first open (Cal, 2026-11-16: "check the lag time and speed when changing tabs"; his phone: the Hall's first open 1.1 s).
// The sandbox web build with QA's heavy seed (60 neighbours drawn with the rig), WebKit, 390x844 at 3x: for Players and then the Hall,
// first open and again after the Board, the tap to the second painted frame and the frames per second over the next 6 s while the portraits render; then how
// many neighbour portraits show a picture, and how many pictures (rig frames, each one blob) were made in those 6 s: the count does not
// depend on how busy the Mac is.
//   BASE=<server of a sandbox dist-web> SEED=<seed json> NODE_PATH=<playwright's parent> node rigtest/lead/portraits.js
const { webkit } = require('playwright');
const fs = require('fs');
const BASE = process.env.BASE || 'http://127.0.0.1:8837', SEED = JSON.parse(fs.readFileSync(process.env.SEED, 'utf8'));
(async () => {
  const b = await webkit.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, serviceWorkers: 'block' });
  await ctx.addInitScript((seed) => { if (!localStorage.getItem('qbsbx:seeded')) { Object.keys(seed).forEach((k) => localStorage.setItem(k, seed[k])); localStorage.setItem('qbsbx:seeded', '1'); } }, SEED);
  await ctx.addInitScript(() => { const o = URL.createObjectURL.bind(URL); window.__blobs = 0; URL.createObjectURL = (x) => { window.__blobs++; return o(x); }; });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 120)));
  await p.goto(BASE + '/index.html');
  await p.waitForFunction(() => window.QBGAME && window.QBGAME.ready(), null, { timeout: 180000 }); await p.waitForTimeout(5000);
  const clear = () => p.evaluate(() => document.querySelectorAll('#layer .modal,#qbtour,.dropsplash,.bsplash').forEach((m) => m.remove()));
  for (const v of ['players', 'hall', 'board', 'players', 'hall']) {
    if (v === 'board') { await clear(); await p.evaluate(() => document.querySelector('.nav button[data-v="board"]').click()); await p.waitForTimeout(3000); continue; }
    await clear(); const b0 = await p.evaluate(() => window.__blobs);
    const r = await p.evaluate((v) => new Promise((done) => { const el = document.querySelector('.nav button[data-v="' + v + '"]'); if (!el) return done({ missing: 1 });
      const t0 = performance.now(); el.click(); requestAnimationFrame(() => requestAnimationFrame(() => {
        const tap = Math.round(performance.now() - t0); const f = []; let last = performance.now(); const s0 = last;
        const step = (t) => { f.push(t - last); last = t; if (t - s0 < 6000) requestAnimationFrame(step); else done({ tap, fps: Math.round(f.length / 6), worst: Math.round(Math.max(...f)), over50: f.filter((x) => x > 50).length }); };
        requestAnimationFrame(step); })); }), v);
    const shown = await p.evaluate(() => { const l = [...document.querySelectorAll('img.calp')]; return l.filter((i) => !/^data:image\/gif/.test(i.src)).length + ' of ' + l.length; });
    const made = await p.evaluate(() => window.__blobs) - b0;
    console.log(v.padEnd(8), 'pictures made ' + made + '; tap ' + r.tap + ' ms; next 6 s: ' + r.fps + ' fps, worst frame ' + r.worst + ' ms, ' + r.over50 + ' frames over 50 ms; portraits shown ' + shown);
  }
  console.log('errors', errs.length, JSON.stringify(errs.slice(0, 3)));
  await b.close();
})().catch((e) => { console.log('crash', e.message); process.exit(2); });
