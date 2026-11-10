// W1: what blobs.js holds (window.__B, the pictures inlined as data URLs) and who uses each one, by name prefix (the room).
//   bash tools/windows/node.sh rigtest/qa/blobstat.js <dist-web folder>
const fs = require('fs'), path = require('path'), vm = require('vm');
const D = process.argv[2];
const ctx = { window: {} }; vm.runInNewContext(fs.readFileSync(path.join(D, 'blobs.js'), 'utf8'), ctx);
const B = ctx.window.__B; const app = fs.readFileSync(path.join(D, 'app.js'), 'utf8');
const total = B.reduce((a, s) => a + s.length, 0);
console.log('__B entries ' + B.length + ', ' + (total / 1048576).toFixed(2) + ' MB of data URLs (pictures ' + (B.reduce((a, s) => a + Math.floor((s.length - s.indexOf(',') - 1) * 3 / 4), 0) / 1048576).toFixed(2) + ' MB once decoded from base64)');
// "key":{..."u":__B[n]} or key:__B[n]
const users = {}; const re = /"?([A-Za-z0-9_]+)"?\s*:\s*\{[^{}]*?__B\[(\d+)\]|"?([A-Za-z0-9_]+)"?\s*:\s*__B\[(\d+)\]/g; let m;
while ((m = re.exec(app))) { const k = m[1] || m[3], i = +(m[2] || m[4]); (users[i] = users[i] || []).push(k); }
const refs = (app.match(/__B\[\d+\]/g) || []).length;
const unused = B.map((_, i) => i).filter((i) => !users[i] && app.indexOf('__B[' + i + ']') < 0);
console.log('__B[n] references in app.js: ' + refs + ', entries never referenced: ' + unused.length + (unused.length ? ' (' + (unused.reduce((a, i) => a + B[i].length, 0) / 1048576).toFixed(2) + ' MB)' : ''));
const pre = {}; B.forEach((s, i) => { const k = (users[i] || ['?'])[0]; const p = k.split('_')[0]; pre[p] = pre[p] || { n: 0, mb: 0, eg: k }; pre[p].n++; pre[p].mb += s.length / 1048576; });
console.log('by name prefix (count, MB as data URL):');
Object.entries(pre).sort((a, b) => b[1].mb - a[1].mb).forEach(([p, o]) => console.log('  ' + p.padEnd(10) + String(o.n).padStart(4) + '  ' + o.mb.toFixed(2).padStart(6) + ' MB  e.g. ' + o.eg));
const big = B.map((s, i) => [i, s.length]).sort((a, b) => b[1] - a[1]).slice(0, 12);
console.log('largest: ' + big.map(([i, n]) => (users[i] || ['?'])[0] + ' ' + Math.round(n / 1024) + 'KB').join(', '));
// where the table lives in app.js
const spr = app.indexOf('/*SPRDATA-BEGIN*/'), spre = app.indexOf('/*SPRDATA-END*/');
if (spr >= 0) console.log('app.js sprite table (SPRDATA) ' + Math.round((spre - spr) / 1024) + ' KB of ' + Math.round(app.length / 1024) + ' KB');
