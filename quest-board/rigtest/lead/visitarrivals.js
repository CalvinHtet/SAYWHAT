const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 600 } })).newPage();
  await p.goto('http://127.0.0.1:65410/dist/index.html'); await p.waitForFunction(() => window.__qbRooms && window.__qbFriends, null, { timeout: 60000 }); await p.waitForTimeout(2000);
  const out = {};
  for (const kind of ['door', 'ride', 'drop', 'pop']) {
    await p.evaluate((kind) => { document.querySelectorAll('#layer .modal').forEach(m => m.remove()); let g = 0, m; while (g++ < 8) { window.__qbRooms.play('visit', window.__qbFriends.visits[0].id); m = [...document.querySelectorAll('#layer .modal')].pop(); if (m.querySelector('.va-' + kind)) break; m.remove(); } }, kind);
    await p.waitForTimeout(900);
    out[kind] = await p.evaluate(() => { const m = [...document.querySelectorAll('#layer .modal')].pop(), pose = m.querySelector('.fvpose'), f = m.querySelector('.vfig'), all = f.getAnimations({ subtree: true }), res = [];
      [0, 150, 300, 500, 750, 1100].forEach(t => { all.forEach(a => { a.pause(); a.currentTime = t; }); const r = pose.getBoundingClientRect(), fr = f.getBoundingClientRect(); res.push(t + ':x' + Math.round(r.left - fr.left) + ' y' + Math.round(r.top - fr.top) + ' o' + (+getComputedStyle(pose).opacity).toFixed(1) + ' h' + Math.round(r.height)); });
      return m.querySelector('.visit').className.split(' ').pop() + ' ' + res.join(' | '); }); }
  console.log(JSON.stringify(out, null, 1)); await b.close(); })();
