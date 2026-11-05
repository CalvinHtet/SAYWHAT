// node trace.js tab -> where main-thread time goes over 6s: script vs style/layout vs paint vs other (phone size, 4x slower CPU)
const { open } = require('./drv.js');
(async () => {
  const t = process.argv[2] || 'hideout';
  const { b, p } = await open({ width: 390, height: 844, mobile: true });
  const cdp = await p.context().newCDPSession(p);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: +(process.env.SLOW || 4) });
  await p.evaluate((t) => { document.querySelectorAll('.dropsplash,.modal,.overlay').forEach((e) => e.remove()); const bt = document.querySelector('.nav button[data-v="' + t + '"]'); if (bt) bt.click(); }, t);
  await p.waitForTimeout(+(process.env.SETTLE || 30000));
  const events = [];
  cdp.on('Tracing.dataCollected', (d) => events.push(...d.value));
  const done = new Promise((ok) => cdp.once('Tracing.tracingComplete', ok));
  await cdp.send('Tracing.start', { categories: 'devtools.timeline,disabled-by-default-devtools.timeline', transferMode: 'ReportEvents' });
  await p.waitForTimeout(6000);
  await cdp.send('Tracing.end'); await done;
  const main = events.filter((e) => e.ph === 'X' && e.name === 'RunTask');
  const names = {}; events.filter((e) => e.ph === 'M' && e.name === 'thread_name').forEach((e) => (names[e.pid + ':' + e.tid] = e.args.name));
  const busy = {}; main.forEach((e) => (busy[e.pid + ':' + e.tid] = (busy[e.pid + ':' + e.tid] || 0) + e.dur / 1000));
  Object.entries(busy).sort((a, b) => b[1] - a[1]).slice(0, 5).forEach(([k, v]) => console.log('  thread', names[k] || k, Math.round(v), 'ms'));
  const key = Object.keys(names).find((k) => names[k] === 'CrRendererMain' && busy[k]) || Object.keys(busy)[0];
  const [pid, tid] = key.split(':');
  const sum = {};
  events.filter((e) => e.ph === 'X' && String(e.tid) === tid && String(e.pid) === pid && e.dur).forEach((e) => { sum[e.name] = (sum[e.name] || 0) + e.dur / 1000; });
  const tot = main.filter((e) => String(e.tid) === tid && String(e.pid) === pid).reduce((a, e) => a + e.dur / 1000, 0);
  console.log(t, 'main thread busy', Math.round(tot), 'ms of 6000');
  Object.entries(sum).filter(([k]) => k !== 'RunTask').sort((a, b) => b[1] - a[1]).slice(0, 14).forEach(([k, v]) => console.log('  ', Math.round(v), 'ms', k));
  await b.close();
})();
