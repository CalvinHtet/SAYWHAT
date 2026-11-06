// Whole-tab memory: the test browser's renderer resident size after the game is ready and a GC (macOS ps).
//   node tabmemory.js <server> [<server> ...]
const { chromium } = require('playwright'), { execSync } = require('child_process');
(async () => {
  for (const base of process.argv.slice(2)) {
    const b = await chromium.launch({ args: ['--renderer-process-limit=1'] }); const ctx = await b.newContext(); const p = await ctx.newPage(), cdp = await ctx.newCDPSession(p);
    await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && document.querySelector('#app').children.length, null, { timeout: 120000 });
    await p.waitForTimeout(3000); await cdp.send('HeapProfiler.collectGarbage'); await p.waitForTimeout(1500);
    const pid = b.process ? null : null;
    const out = execSync("ps -axo pid,rss,command | grep -i 'type=renderer' | grep -i playwright | grep -v grep").toString().trim().split('\n').map((l) => +l.trim().split(/\s+/)[1]);
    console.log(base, 'renderer RSS', Math.round(Math.max(...out) / 1024), 'MB', '(renderers:', out.length + ')');
    await b.close();
  }
})();
