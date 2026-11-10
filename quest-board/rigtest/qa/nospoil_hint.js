// hint words in every captured text (rooms, helps, tabs) and the play log, deduplicated by context
const fs = require('fs');
const D = 'C:/Users/clvh/qa-wt/out/nospoil/';
const L = fs.readFileSync(D + 'stages.jsonl', 'utf8').split(String.fromCharCode(10)).filter(Boolean).map((l) => JSON.parse(l));
const re = new RegExp(process.env.RE || '\b(upstairs|above|next door|later|coming|secret|one day|someday|behind|next:|next up|what comes next|soon|opens with|unlock)\b', 'gi');
const seen = new Set();
L.forEach((r) => ['rooms', 'helps', 'tabs'].forEach((p) => Object.keys(r[p] || {}).forEach((k) => { const t = String(r[p][k]).replace(/\s+/g, ' '); let m; const g = new RegExp(re.source, 'gi');
  while ((m = g.exec(t))) { const c = t.slice(Math.max(0, m.index - 110), m.index + 110); if (seen.has(c)) continue; seen.add(c); console.log(`${r.stage} ${p}.${k} | ${c}`); } })));
