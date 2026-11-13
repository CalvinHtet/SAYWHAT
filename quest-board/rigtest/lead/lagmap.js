// Where the lag is (Cal, 2026-11-13: "Switching tabs in the town hall is laggy. And the loft is very laggy once all the assets are in"):
// a full save (every room, every upgrade), 390x844, CPU slowed 4x. (A) Each tab switch: ms from the tap to the next painted frame, and the
// longest main-thread task in it. (B) The Loft's building view and one busy room window: frames per second over 5 s, worst frame.
//   BASE=<server of quest-board/> CPU=4 NODE_PATH=<playwright's parent> node rigtest/lead/lagmap.js
process.env.TAB = 'keep';
const { open } = require('../qa/lib.js');
const CPU = +(process.env.CPU || 4);
(async () => {
  const { b, p, errs } = await open({ width: 390, height: 844, owned: 'all', mobile: true });
  await p.evaluate(() => { const S = window.__qb.x().S; S.areaOn = { board: 1, train: 1, hideout: 1, shop: 1, hall: 1, players: 1, trophy: 1, wheel: 1, away: 1 }; window.__qb.x().render(); });
  const cdp = await p.context().newCDPSession(p); await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU });
  const clear = () => p.evaluate(() => document.querySelectorAll('#layer .modal').forEach((m) => m.remove()));
  // the time from a tap to the next frame actually painted, and the longest task in between
  const tap = (sel) => p.evaluate((sel) => new Promise((done) => {
    const lt = []; let ob = null; try { ob = new PerformanceObserver((l) => l.getEntries().forEach((e) => lt.push(e.duration))); ob.observe({ type: 'longtask' }); } catch (e) {}
    const el = document.querySelector(sel); if (!el) return done({ missing: sel });
    const t0 = performance.now(); el.click();
    requestAnimationFrame(() => requestAnimationFrame(() => { const ms = performance.now() - t0; setTimeout(() => { if (ob) ob.disconnect(); done({ ms: Math.round(ms), longest: Math.round(Math.max(0, ...lt)) }); }, 50); }));
  }), sel);
  const fps = (secs) => p.evaluate((secs) => new Promise((done) => { const f = []; let last = performance.now(); const t0 = last;
    const step = (t) => { f.push(t - last); last = t; if (t - t0 < secs * 1000) requestAnimationFrame(step); else done({ fps: Math.round(f.length / secs), worst: Math.round(Math.max(...f)), over50: f.filter((x) => x > 50).length }); };
    requestAnimationFrame(step); }), secs);
  console.log('(A) tab switches, ms to the next painted frame (longest task):');
  for (const v of ['board', 'hall', 'players', 'hideout', 'shop', 'board', 'hall']) {
    await clear(); const r = await tap('.nav button[data-v="' + v + '"]'); await p.waitForTimeout(1500);
    console.log('  ' + v.padEnd(8), JSON.stringify(r));
  }
  await clear(); await tap('.nav button[data-v="hall"]'); await p.waitForTimeout(1200);
  for (const t of ['chat', 'posts', 'chat', 'posts']) { const r = await tap('.htab button[data-t="' + t + '"]'); await p.waitForTimeout(1200); console.log('  hall/' + t.padEnd(6), JSON.stringify(r)); }
  console.log('(B) frames per second:');
  await clear(); await tap('.nav button[data-v="hideout"]'); await p.waitForTimeout(3000);
  console.log('  Loft building view', JSON.stringify(await fps(5)), 'elements', await p.evaluate(() => document.querySelectorAll('*').length));
  await p.evaluate(() => window.__qb.roomModal(5)); await p.waitForTimeout(3000);
  console.log('  a room window     ', JSON.stringify(await fps(5)), 'elements', await p.evaluate(() => document.querySelectorAll('*').length));
  await clear(); await tap('.nav button[data-v="board"]'); await p.waitForTimeout(2000);
  console.log('  the Board         ', JSON.stringify(await fps(5)));
  console.log('errors:', JSON.stringify(errs.slice(0, 4)));
  await b.close();
})().catch((e) => { console.log('crash', e.message); process.exit(2); });
