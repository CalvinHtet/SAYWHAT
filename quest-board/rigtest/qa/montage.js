// Tile PNGs into one picture (no image library on this Mac): OUT file, TILE width in px, COLS.   TILE=300 COLS=6 node montage.js out.png a.png b.png ...
const { chromium } = require('playwright'), fs = require('fs'), path = require('path');
(async () => { const [out, ...files] = process.argv.slice(2), W = +(process.env.TILE || 300), C = +(process.env.COLS || 6);
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: W * C + 8, height: 600 }, deviceScaleFactor: 1 });
  const html = '<body style="margin:0;background:#111;display:grid;gap:2px;grid-template-columns:repeat(' + C + ',' + W + 'px)">' + files.map((f) => '<figure style="margin:0;position:relative"><img style="width:100%;display:block" src="data:image/png;base64,' + fs.readFileSync(f).toString('base64') + '"><figcaption style="position:absolute;left:0;top:0;background:#000b;color:#fff;font:11px monospace;padding:1px 4px">' + path.basename(f, '.png') + '</figcaption></figure>').join('') + '</body>';
  await p.setContent(html); await p.waitForTimeout(300); await p.screenshot({ path: out, fullPage: true }); await b.close(); })();
