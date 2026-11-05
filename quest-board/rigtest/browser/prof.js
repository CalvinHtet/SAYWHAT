// node prof.js tab -> top functions by self time over 6s (4x CPU slowdown, phone size)
const { open } = require('./drv.js');
(async () => {
  const t = process.argv[process.argv.length - 1] || 'board';
  const { b, p } = await open({ width: 390, height: 844, mobile: true });
  const cdp = await p.context().newCDPSession(p);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  // node prof.js [before ...] tab: visit the earlier tabs (or room:<name>) first, then profile the last one
  const seq = process.argv.slice(2).length ? process.argv.slice(2) : [t];
  for (const v of seq) {
    await p.evaluate((v) => { document.querySelectorAll('.dropsplash,.modal,.overlay').forEach((e) => e.remove()); if (v.startsWith('room:')) { document.querySelector('.nav button[data-v="hideout"]').click(); setTimeout(() => window.__qb.roomModal(window.__order.indexOf(v.slice(5))), 1500); return; } const bt = document.querySelector('.nav button[data-v="' + v + '"]'); if (bt) bt.click(); }, v);
    await p.waitForTimeout(+(process.env.SETTLE || 4000));
  }
  await cdp.send('Profiler.enable'); await cdp.send('Profiler.setSamplingInterval', { interval: 500 }); await cdp.send('Profiler.start');
  await p.waitForTimeout(6000);
  const { profile } = await cdp.send('Profiler.stop');
  const self = {}, total = profile.samples.length, byId = {};
  profile.nodes.forEach((n) => (byId[n.id] = n));
  const cnt = {}; profile.samples.forEach((id) => (cnt[id] = (cnt[id] || 0) + 1));
  for (const id in cnt) { const n = byId[id], f = n.callFrame, k = (f.functionName || '(anon)') + ' ' + (f.url.split('/').pop() || '') + ':' + f.lineNumber; self[k] = (self[k] || 0) + cnt[id]; }
  Object.entries(self).sort((a, b) => b[1] - a[1]).slice(0, 18).forEach(([k, v]) => console.log((100 * v / total).toFixed(1) + '%', k));
  // who calls the hot ones: inclusive time per top-level-ish app function
  const parent = {}; profile.nodes.forEach((n) => (n.children || []).forEach((c) => (parent[c] = n.id)));
  const incl = {}; profile.samples.forEach((id) => { const seen = new Set(); let x = id; while (x != null) { const f = byId[x].callFrame; if (/app\.js|loft_bridge|rig\.js/.test(f.url)) { const k = (f.functionName || '(anon)') + ' ' + f.url.split('/').pop() + ':' + f.lineNumber; if (!seen.has(k)) { seen.add(k); incl[k] = (incl[k] || 0) + 1; } } x = parent[x]; } });
  console.log('--- inclusive (app code)');
  Object.entries(incl).sort((a, b) => b[1] - a[1]).slice(0, 14).forEach(([k, v]) => console.log((100 * v / total).toFixed(1) + '%', k));
  await b.close();
})();
