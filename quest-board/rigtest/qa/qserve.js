// QA's static server for a dist-web build, close to Firebase Hosting: many requests at once, the same Cache-Control headers as
// firebase.json (fingerprinted files immutable, the page and sw.js no-cache) and, like Hosting, brotli or gzip for text files
// when the browser asks for it (pictures as they are). Runs under node.sh (VS Code's Electron as Node).
//   bash tools/windows/node.sh rigtest/qa/qserve.js <root> <port> [nocompress]
const http = require('http'), fs = require('fs'), path = require('path'), zlib = require('zlib');
const ROOT = path.resolve(process.argv[2] || 'dist-web'), PORT = +process.argv[3] || 8810, NOZIP = process.argv[4] === 'nocompress';
const TYPES = { html: 'text/html; charset=utf-8', js: 'text/javascript; charset=utf-8', json: 'application/json', webp: 'image/webp', png: 'image/png',
  jpg: 'image/jpeg', svg: 'image/svg+xml', css: 'text/css', webmanifest: 'application/manifest+json', ico: 'image/x-icon', txt: 'text/plain; charset=utf-8' };
const TEXT = /^(html|js|json|svg|css|webmanifest|txt)$/;
const zipped = new Map(); // path+enc -> Buffer (each file compressed once)
http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  fs.stat(f, (e, st) => {
    if (e || !st.isFile()) { res.writeHead(404, { 'Cache-Control': 'no-cache' }); return res.end('not found'); }
    const ext = (f.match(/\.([^.\/\\]+)$/) || [])[1] || '';
    const base = path.basename(f);
    const cache = /^(index\.html|sw\.js|manifest\.webmanifest|config\.js|version\.json)$/.test(base) ? 'no-cache'
      : /\.(js|webp|png|json)$/.test(base) ? 'public, max-age=31536000, immutable' : 'no-cache';
    const h = { 'Content-Type': TYPES[ext] || 'application/octet-stream', 'Cache-Control': cache, 'Last-Modified': st.mtime.toUTCString(), 'Vary': 'Accept-Encoding' };
    const ae = String(req.headers['accept-encoding'] || '');
    const enc = NOZIP || !TEXT.test(ext) ? '' : /\bbr\b/.test(ae) ? 'br' : /\bgzip\b/.test(ae) ? 'gzip' : '';
    fs.readFile(f, (e2, buf) => {
      if (e2) { res.writeHead(500); return res.end(); }
      if (enc) {
        const k = f + '|' + enc + '|' + st.mtimeMs;
        let z = zipped.get(k);
        if (!z) { z = enc === 'br' ? zlib.brotliCompressSync(buf, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 5 } }) : zlib.gzipSync(buf, { level: 6 }); zipped.set(k, z); }
        h['Content-Encoding'] = enc; buf = z;
      }
      h['Content-Length'] = buf.length;
      res.writeHead(200, h); res.end(req.method === 'HEAD' ? undefined : buf);
    });
  });
}).listen(PORT, '127.0.0.1', () => console.log('serving ' + ROOT + ' on http://127.0.0.1:' + PORT + '/' + (NOZIP ? ' (no compression)' : ' (br/gzip for text)')));
