// W1: which of the game's functions use the main thread (V8 sampling profiler, CDP Profiler). Phone size, CPU slowed (4x).
//   SEED=<file> WHAT=load|warmload|tab:<view>[:<sub>] SECS=10 BASE=http://127.0.0.1:8810 bash tools/windows/node.sh rigtest/qa/cpuprof.js
// load: from the tap on the link (cold, fresh profile) until SECS after the Board draws. warmload: the same on the second open
// (service worker copy). tab: SECS seconds on one screen with nothing touched. Prints self and total time per function (file:line).
const fs = require('fs');
const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8810', CPU = +(process.env.CPU || 4), WHAT = process.env.WHAT || 'load', SECS = +(process.env.SECS || 10);
const SEED = process.env.SEED ? JSON.parse(fs.readFileSync(process.env.SEED, 'utf8')) : null;
function report(p, label) {
  const N = new Map(); p.nodes.forEach((n) => N.set(n.id, n));
  const parent = new Map(); p.nodes.forEach((n) => (n.children || []).forEach((c) => parent.set(c, n.id)));
  const key = (n) => { const c = n.callFrame; const f = (c.url || '').replace(/^.*\//, '').replace(/\?h=.*/, ''); return (c.functionName || '(anon)') + (f ? ' ' + f + ':' + (c.lineNumber + 1) : ''); };
  const self = {}, total = {}, byFile = {}; let all = 0, idle = 0;
  for (let i = 0; i < p.samples.length; i++) {
    const dt = (p.timeDeltas[i + 1] || 0) / 1000; const n = N.get(p.samples[i]); all += dt;
    const k = key(n); if (/^\((idle|program|garbage collector|root)\)/.test(k)) { if (k.startsWith('(idle)')) idle += dt; self[k] = (self[k] || 0) + dt; continue; }
    self[k] = (self[k] || 0) + dt;
    const f = (n.callFrame.url || '').replace(/^.*\//, '').replace(/\?h=.*/, '') || '(native)'; byFile[f] = (byFile[f] || 0) + dt;
    const seen = new Set(); let id = n.id; while (id != null) { const m = N.get(id), kk = key(m); if (!seen.has(kk) && !/^\(root\)/.test(kk)) { seen.add(kk); total[kk] = (total[kk] || 0) + dt; } id = parent.get(id); }
  }
  const top = (o, n) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, v]) => '    ' + Math.round(v).toString().padStart(6) + ' ms  ' + k).join('\n');
  console.log(`== ${label}: ${Math.round(all)} ms sampled, idle ${Math.round(idle)} ms, busy ${Math.round(all - idle)} ms`);
  console.log('  by file (self ms): ' + Object.entries(byFile).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([k, v]) => k + ' ' + Math.round(v)).join(', '));
  console.log('  self:\n' + top(self, 28));
  console.log('  total (inclusive):\n' + top(total, 28));
}
(async () => {
  const br = await browser();
  const seedIt = async (pg) => { if (SEED) { await pg.go(BASE + '/version.json'); await pg.ev(`(function(d){localStorage.clear();Object.keys(d).forEach(function(k){localStorage.setItem(k,d[k])});return 1})(${JSON.stringify(SEED)})`); } };
  let pg = await br.page({ fresh: true });
  await seedIt(pg);
  if (WHAT === 'warmload') { // first open, the worker, a second open to fill its copy; then a new tab in the same profile
    await pg.go(BASE + '/'); await pg.wait('!!document.querySelector(".nav")', 120000); await sleep(4000);
    await pg.ev("navigator.serviceWorker.register('sw.js').then(function(){return navigator.serviceWorker.ready}).then(function(){return 1})"); await sleep(1000);
    await pg.go(BASE + '/'); await pg.wait('!!document.querySelector(".nav")', 120000); await sleep(4000);
    const ctx = pg.browserContextId; pg.keepCtx = true; await pg.close(); pg = await br.page({ ctx });
  }
  if (CPU > 1) await pg.s('Emulation.setCPUThrottlingRate', { rate: CPU });
  if (process.env.NOFX) await pg.s('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await pg.s('Profiler.enable'); await pg.s('Profiler.setSamplingInterval', { interval: 500 });
  if (WHAT === 'load' || WHAT === 'warmload') {
    await pg.s('Profiler.start'); const t0 = Date.now();
    await pg.go(BASE + '/', false);
    await pg.wait('!!document.querySelector(".nav button[data-v=board].on")', 180000, 100);
    const tb = Date.now() - t0; await sleep(SECS * 1000);
    const { profile } = await pg.s('Profiler.stop');
    report(profile, WHAT + ' (Board drawn after ~' + tb + ' ms, then ' + SECS + ' s)');
  } else {
    await pg.go(BASE + '/'); await pg.wait('!!document.querySelector(".nav button[data-v=board]")', 120000); await sleep(5000);
    const [, v, sub] = WHAT.split(':');
    if (v === 'room') await pg.ev(`(function(){var S=window.__qb.x().S,i=S.base.slots.findIndex(function(r){return r&&r.t==='${sub}'});window.__qb.roomModal(i);return i})()`);
    else { await pg.ev(`(function(){var b=document.querySelector('.nav button[data-v="${v}"]');b&&b.click();return 1})()`);
      if (sub) { await sleep(800); await pg.ev(`(function(){var b=[].filter.call(document.querySelectorAll('#app button,#app [data-act]'),function(e){return (e.innerText||'').trim().toLowerCase().indexOf(${JSON.stringify(sub)})===0})[0];b&&b.click();return 1})()`); } }
    await sleep(3000);
    await pg.s('Profiler.start'); await sleep(SECS * 1000); const { profile } = await pg.s('Profiler.stop');
    report(profile, WHAT + ' idle ' + SECS + ' s');
  }
  console.log('page errors', pg.errs.length, pg.errs.slice(0, 3).join(' | '));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
