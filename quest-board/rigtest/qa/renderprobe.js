// W1 probe: how often the whole screen is rebuilt (render() replaces #app's children; counted with a MutationObserver) and what
// each rebuild costs (the long task around it), per screen, over SECS seconds with nothing touched.
//   SEED=<file> TABS=board,hideout,away SECS=60 bash tools/windows/node.sh rigtest/qa/renderprobe.js
const fs = require('fs');
const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8810', CPU = +(process.env.CPU || 4), SECS = +(process.env.SECS || 60);
const TABS = (process.env.TABS || 'board,hideout,away,hall').split(',');
const SEED = process.env.SEED ? JSON.parse(fs.readFileSync(process.env.SEED, 'utf8')) : null;
const HOOK = `(function(){var R=window.__qaRR={n:0,t:[],lt:[]};var go=function(){var a=document.getElementById('app');if(!a){setTimeout(go,20);return}
new MutationObserver(function(ms){for(var i=0;i<ms.length;i++){var m=ms[i];for(var j=0;j<m.removedNodes.length;j++){var x=m.removedNodes[j];if(x.nodeType===1&&(x.matches('.nav')||x.querySelector&&x.querySelector('.nav'))){R.n++;R.t.push(Math.round(performance.now()));return}}}}).observe(a,{childList:true})};go();
try{new PerformanceObserver(function(l){l.getEntries().forEach(function(e){R.lt.push([Math.round(e.startTime),Math.round(e.duration)])})}).observe({type:'longtask'})}catch(e){}})();`;
(async () => {
  const br = await browser(); const pg = await br.page({ fresh: true });
  await pg.s('Page.addScriptToEvaluateOnNewDocument', { source: HOOK });
  if (SEED) { await pg.go(BASE + '/version.json'); await pg.ev(`(function(d){localStorage.clear();Object.keys(d).forEach(function(k){localStorage.setItem(k,d[k])});return 1})(${JSON.stringify(SEED)})`); }
  if (CPU > 1) await pg.s('Emulation.setCPUThrottlingRate', { rate: CPU });
  await pg.go(BASE + '/'); await pg.wait('!!document.querySelector(".nav button[data-v=board]")', 120000);
  const t0 = await pg.ev('performance.now()');
  await sleep(15000);
  const s0 = JSON.parse(await pg.ev('JSON.stringify(__qaRR)'));
  console.log(`first 15 s after the Board drew: ${s0.t.filter((t) => t >= t0).length} rebuilds (at ${s0.t.filter((t) => t >= t0).map((t) => ((t - t0) / 1000).toFixed(1)).join(', ')} s)`);
  for (const v of TABS) {
    await pg.ev(`(function(){document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});var b=document.querySelector('.nav button[data-v="${v}"]');b&&b.click();return 1})()`);
    await sleep(3000);
    const a = await pg.ev('performance.now()');
    await sleep(SECS * 1000);
    const r = JSON.parse(await pg.ev('JSON.stringify(__qaRR)'));
    const ts = r.t.filter((t) => t >= a); const lts = r.lt.filter(([s]) => s >= a);
    // the long task each rebuild sits in
    const cost = ts.map((t) => { const L = r.lt.find(([s, d]) => s <= t + 5 && s + d >= t - 5); return L ? L[1] : 0; });
    console.log(`${v}: ${ts.length} rebuilds in ${SECS} s (every ${ts.length > 1 ? Math.round((ts[ts.length - 1] - ts[0]) / (ts.length - 1) / 1000) + ' s' : '-'}), long task around each: ${cost.join(', ')} ms; all long tasks ${lts.length}, ${lts.reduce((x, [, d]) => x + d, 0)} ms, worst ${lts.reduce((x, [, d]) => Math.max(x, d), 0)} ms`);
  }
  console.log('page errors', pg.errs.length, pg.errs.slice(0, 3).join(' | '));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
