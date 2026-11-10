// W1: markdown tables from perfrun.js outputs. mdtab.js tabs <files...>  -> per-screen medians table
//                                              mdtab.js ab "<label A>" <filesA,...> "<label B>" <filesB,...>  -> A/B table
const fs = require('fs');
const read = (files) => { const rows = {}, order = []; for (const f of files) { const seen = {}; for (const l of fs.readFileSync(f, 'utf8').split('\n')) { if (!l.startsWith('{')) continue; const r = JSON.parse(l); let k = r.tab || r.step; if (!k) continue; seen[k] = (seen[k] || 0) + 1; if (seen[k] > 1) k += ' (again)'; if (!rows[k]) { rows[k] = []; order.push(k); } rows[k].push(r); } } return { rows, order }; };
const med = (a) => { const b = a.filter((x) => typeof x === 'number').sort((x, y) => x - y); return b.length ? b[Math.floor((b.length - 1) / 2)] : null; };
const NAME = { board: 'Board', train: 'Training', shop: 'Shop', away: 'Crawls', hall: 'Hall (Posts)', 'hall:chat': 'Hall Chat', 'hall:style': 'Hall Rank/Style (first open)', hideout: 'The Loft (building view)', 'room:restaurant': 'Restaurant window', 'room:mall': 'Mall window', trophy: 'Relics', wheel: 'Wheel', 'board (again)': 'Board, after the tour' };
const nm = (k) => NAME[k] || k;
const [mode, ...rest] = process.argv.slice(2);
if (mode === 'tabs') {
  const { rows, order } = read(rest);
  console.log('| Screen | Open (ms) | Busy % | Style recalcs/s | fps | Frame p95 / worst (ms) | Frames > 50 ms | JS heap (MB) | DOM nodes |');
  console.log('|---|---|---|---|---|---|---|---|---|');
  for (const k of order) { const R = rows[k], m = (u) => med(R.map((r) => r[u]));
    console.log(`| ${nm(k)} | ${m('switchMs')} | ${m('busyPct')} | ${m('styles')} | ${m('fps')} | ${m('frameP95')} / ${m('frameWorst')} | ${m('over50')} | ${m('heapMB')} | ${m('nodes')} |`); }
} else if (mode === 'ab') {
  const [la, fa, lb, fb] = rest; const A = read(fa.split(',')), B = read(fb.split(','));
  console.log(`| Screen | Busy % ${la} | Busy % ${lb} | fps ${la} | fps ${lb} | Frame p95 ${la} | Frame p95 ${lb} | Worst ${la} | Worst ${lb} |`);
  console.log('|---|---|---|---|---|---|---|---|---|');
  for (const k of A.order) { if (!B.rows[k]) continue; const a = (u) => med(A.rows[k].map((r) => r[u])), b = (u) => med(B.rows[k].map((r) => r[u]));
    console.log(`| ${nm(k)} | ${a('busyPct')} | ${b('busyPct')} | ${a('fps')} | ${b('fps')} | ${a('frameP95')} | ${b('frameP95')} | ${a('frameWorst')} | ${b('frameWorst')} |`); }
}
