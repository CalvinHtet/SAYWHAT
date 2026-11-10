// W1: medians across runs of perfrun.js output files (JSON lines with a "tab" or "step" field).
//   bash tools/windows/node.sh rigtest/qa/rtsum.js <file1> <file2> ...   -> one line per screen, the median of each number
const fs = require('fs');
const rows = {}; const order = [];
for (const f of process.argv.slice(2)) {
  const seen = {};
  for (const l of fs.readFileSync(f, 'utf8').split('\n')) {
    if (!l.startsWith('{')) continue; const r = JSON.parse(l); let k = r.tab || r.step; if (!k) continue;
    seen[k] = (seen[k] || 0) + 1; if (seen[k] > 1) k += ' #' + seen[k];
    if (!rows[k]) { rows[k] = []; order.push(k); } rows[k].push(r);
  }
}
const med = (a) => { const b = a.filter((x) => typeof x === 'number').sort((x, y) => x - y); return b.length ? b[Math.floor((b.length - 1) / 2)] : '-'; };
const keys = (process.env.KEYS || 'switchMs,busyPct,scriptMs,styleMs,styles,rafs,fps,frameMed,frameP95,frameWorst,over50,heapMB,nodes,listeners,ivLive,tapMed,tapWorst,pageHeight').split(',');
const used = keys.filter((k) => order.some((o) => rows[o].some((r) => typeof r[k] === 'number')));
console.log(['screen', 'runs', ...used].join(' | '));
for (const k of order) console.log([k, rows[k].length, ...used.map((u) => med(rows[k].map((r) => r[u])))].join(' | '));
