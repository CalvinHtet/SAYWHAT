// Draws a rigtest/matrix.html sheet headless with WebGL2 (SwiftShader) and saves the canvas: the wear-test for new cosmetics.
//   BASE=<server> OUT=<folder> node matrixshot.js "<query>" <name>     e.g. "sheet=wear&arts=dg_riftmask" riftmask_wear
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const BASE = process.env.BASE || 'http://127.0.0.1:8769', OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const [query, name] = [process.argv[2] || 'sheet=hats', process.argv[3] || 'matrix'];
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1600, height: 1200 } });
  const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 200))); p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); });
  await p.goto(`${BASE}/rigtest/matrix.html?${query}`);
  await p.waitForFunction(() => /^(ready|error)/.test(document.title), null, { timeout: 240000 }).catch(() => {});
  const info = await p.evaluate(() => ({ title: document.title, err: (document.getElementById('err') || {}).innerText || '', w: document.getElementById('out').width, h: document.getElementById('out').height, fail: (window.__fail || []).slice(0, 10) }));
  console.log(name, JSON.stringify(info));
  const data = await p.evaluate(() => document.getElementById('out').toDataURL('image/png'));
  fs.writeFileSync(path.join(OUT, name + '.png'), Buffer.from(data.split(',')[1], 'base64'));
  console.log('errors', errs.length, errs.slice(0, 4));
  await b.close();
})();
