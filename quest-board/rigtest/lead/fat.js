// Cut the fat (Cal, 2026-11-16: "Some text on the app is just a lot of clutter ... Review the rest of the game and find where we can cut
// the fat. Also check the lag time and speed when changing tabs"). For a new, a mid and a late player at 390x844: every screen's visible
// text lines of 20+ characters (what, where, how long), a full-page picture, and with CPU=4 the time from each tab tap to the next painted
// frame and the longest task, three rounds.
//   BASE=<server of quest-board/> NODE_PATH=<playwright's parent> OUT=<dir> CPU=4 node rigtest/lead/fat.js
const { chromium } = require('playwright');
const fs = require('fs');
const BASE = process.env.BASE || 'http://127.0.0.1:8779', OUT = process.env.OUT || '', CPU = +(process.env.CPU || 0), ONLY = process.env.ONLY || '';
const VIEWS = (process.env.VIEWS || 'board,hideout,shop,players,hall,train,wheel,trophy,away').split(',');
const ORDER = ['bedroom', 'closet', 'lair', 'patio', 'gameroom', 'restaurant', 'skybar', 'rooftop', 'boba', 'dessert', 'speakeasy', 'garden', 'theater', 'auditorium', 'mall', 'bowling', 'karaoke', 'arcade', 'rhythm', 'vr', 'club'];
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] });
  const report = {};
  for (const prof of ['new', 'mid', 'late']) {
    if (ONLY && ONLY !== prof) continue;
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
    await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft, null, { timeout: 90000 }); await p.waitForTimeout(800);
    await p.evaluate(({ prof, order }) => {
      const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' });
      S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, loft: 1, town: 1, shop: 1, players: 1, hall: 1, away: 1, banner: 1 }; S.unl = Object.assign({ console: 1, pets: 1, acc2: 1, sable7: 1 }, S.unl || {}); S.calm = false;
      if (prof === 'mid') { S.xp = x.cum(12); S.coins = 6000; S.areaOn = { board: 1, train: 1, hideout: 1, shop: 1, hall: 1, players: 1, trophy: 1, wheel: 1, away: 1 };
        S.base.slots = order.slice(0, 6).map((t, i) => ({ t, a: Object.fromEntries((x.ADDONS[t] || []).slice(0, i < 3 ? 6 : 2).map((u) => [u[0], 1])), st: 0, pend: 0 })); }
      if (prof === 'late') { S.gates = Array.from({ length: 200 }, (_, i) => i); S.xp = x.cum(60); S.coins = 999999; S.base.served = 1e6;
        S.areaOn = { board: 1, train: 1, hideout: 1, shop: 1, hall: 1, players: 1, trophy: 1, wheel: 1, away: 1 };
        S.base.slots = order.map((t) => ({ t, a: Object.fromEntries((x.ADDONS[t] || []).map((u) => [u[0], 1])), st: 0, pend: 0 })); }
      x.render();
    }, { prof, order: ORDER });
    await p.waitForTimeout(1200);
    const clear = () => p.evaluate(() => document.querySelectorAll('#layer .modal,.dropsplash,.bsplash,.coachscr').forEach((m) => m.remove()));
    const go = (v) => p.evaluate((v) => { let el = document.querySelector('.nav button[data-v="' + v + '"]');
      if (!el) { const bt = document.querySelector('.nav button[data-v="board"]'); if (bt) bt.click(); el = document.querySelector('.zx-tile[data-v="' + v + '"],[data-act="nav"][data-v="' + v + '"]'); }
      if (!el) return false; el.click(); return true; }, v);
    const texts = () => p.evaluate(() => {
      const out = []; const seen = new Set();
      const root = document.querySelector('main') || document.querySelector('#app') || document.body;
      root.querySelectorAll('*').forEach((el) => {
        if (el.closest('.nav,#layer,svg,script,style')) return;
        const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').replace(/\s+/g, ' ').trim();
        if (own.length < 20) return; const r = el.getBoundingClientRect(); if (!r.width || !r.height) return;
        const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) return;
        const t = el.innerText.replace(/\s+/g, ' ').trim(); if (seen.has(t)) return; seen.add(t);
        const card = el.closest('section,.card'); out.push({ len: t.length, cls: (el.tagName + '.' + (el.className || '')).slice(0, 50), card: card ? (card.className || '').slice(0, 40) : '', t: t.slice(0, 220) });
      });
      return out; });
    report[prof] = {};
    for (const v of VIEWS) {
      await clear(); const okv = await go(v); await p.waitForTimeout(1300); await clear(); await p.waitForTimeout(200);
      if (!okv) { report[prof][v] = 'not open'; continue; }
      const tx = await texts(); const h = await p.evaluate(() => document.documentElement.scrollHeight);
      report[prof][v] = { height: h, chars: tx.reduce((s, x) => s + x.len, 0), lines: tx };
      if (OUT) await p.screenshot({ path: OUT + '/' + prof + '_' + v + '.png', fullPage: true });
    }
    if (CPU && prof === 'late') {
      const cdp = await ctx.newCDPSession(p); await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU });
      const tap = (v) => p.evaluate((v) => new Promise((done) => {
        let el = document.querySelector('.nav button[data-v="' + v + '"]') || document.querySelector('.zx-tile[data-v="' + v + '"]'); if (!el) return done({ missing: v });
        const lt = []; let ob = null; try { ob = new PerformanceObserver((l) => l.getEntries().forEach((e) => lt.push(e.duration))); ob.observe({ type: 'longtask' }); } catch (e) {}
        const t0 = performance.now(); el.click();
        requestAnimationFrame(() => requestAnimationFrame(() => { const ms = performance.now() - t0; setTimeout(() => { if (ob) ob.disconnect(); done({ ms: Math.round(ms), longest: Math.round(Math.max(0, ...lt)) }); }, 60); }));
      }), v);
      report.timing = {};
      for (let round = 0; round < 3; round++) for (const v of VIEWS) {
        await clear();
        if (!['board', 'hideout', 'shop', 'players', 'hall'].includes(v)) { await p.evaluate(() => document.querySelector('.nav button[data-v="board"]').click()); await p.waitForTimeout(900); }
        const r = await tap(v); await p.waitForTimeout(1500);
        (report.timing[v] = report.timing[v] || []).push(r.ms + '/' + r.longest);
      }
    }
    report[prof].errors = errs;
    await ctx.close();
  }
  await b.close();
  const js = JSON.stringify(report, null, 1);
  if (OUT) fs.writeFileSync(OUT + '/fat.json', js);
  for (const prof of Object.keys(report)) {
    if (prof === 'timing') { console.log('== tab tap -> painted frame ms / longest task ms (CPU x' + CPU + ', late player), 3 rounds'); for (const v in report.timing) console.log('  ' + v.padEnd(8) + report.timing[v].join('  ')); continue; }
    console.log('== ' + prof);
    for (const v of Object.keys(report[prof])) { const r = report[prof][v]; if (v === 'errors') { console.log('  errors', r.length, r.slice(0, 3)); continue; }
      console.log('  ' + v.padEnd(8) + (typeof r === 'string' ? r : 'page ' + r.height + ' px, ' + r.chars + ' chars in ' + r.lines.length + ' text lines')); }
  }
})().catch((e) => { console.log('crash', e.message); process.exit(2); });
