// node sheet.js out.png "query string"  -> renders rigtest/matrix.html and saves the canvas
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const jobs = [];
  for (let i = 2; i < process.argv.length; i += 2) jobs.push([process.argv[i], process.argv[i + 1]]);
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage();
  p.on('pageerror', (e) => console.log('ERR', e.message));
  for (const [out, qs] of jobs) {
    await p.goto('http://127.0.0.1:8765/rigtest/matrix.html?' + qs);
    await p.waitForFunction(() => /^(ready|error)/.test(document.title), null, { timeout: 300000 });
    const t = await p.title();
    const fails = await p.evaluate(() => window.__fail || []);
    const err = await p.evaluate(() => document.getElementById('err').textContent);
    const data = await p.evaluate(() => document.getElementById('out').toDataURL('image/png'));
    fs.writeFileSync(out, Buffer.from(data.split(',')[1], 'base64'));
    console.log(out, t, fails.slice(0, 5).join(' | '), err.slice(0, 200));
  }
  await b.close();
})();
