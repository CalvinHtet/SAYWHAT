// prints hits.json from nospoil_play.js, one line each (FILTER=regex on the line to narrow)
const fs = require('fs');
const h = fs.readFileSync((process.env.OUT || 'C:/Users/clvh/qa-wt/out/nospoil') + '/hits.jsonl', 'utf8').split(String.fromCharCode(10)).filter(Boolean).map((l) => JSON.parse(l));
const f = process.env.FILTER ? new RegExp(process.env.FILTER, 'i') : null;
const seen = new Set();
h.forEach((x) => { const l = `${x.where} | ${x.kind}:${x.key} | ${x.word} | ${x.ctx.slice(0, 190)}`; const k = x.kind + x.key + x.ctx; if (process.env.DEDUP && seen.has(k)) return; seen.add(k); if (!f || f.test(l)) console.log(l); });
