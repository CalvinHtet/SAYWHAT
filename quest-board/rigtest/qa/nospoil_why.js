// grep check (SPEC9 acceptance): no story "why" line in any captured room window, tab or help, nor in the play log
const fs = require('fs');
const src = fs.readFileSync('C:/Users/clvh/qa-wt/qa-wnospoil-adaf255/quest-board/app/src/29b_story.js', 'utf8');
const whys = [...src.matchAll(/why:"([^"]+)"/g)].map((m) => m[1]);
const D = 'C:/Users/clvh/qa-wt/out/nospoil/';
const L = fs.readFileSync(D + 'stages.jsonl', 'utf8').split(String.fromCharCode(10)).filter(Boolean).map((l) => JSON.parse(l));
let n = 0;
L.forEach((r) => ['rooms', 'helps', 'tabs'].forEach((p) => Object.keys(r[p] || {}).forEach((k) => { const t = String(r[p][k]).replace(/\s+/g, ' ');
  whys.forEach((w) => { const frag = w.slice(0, 40); if (t.includes(frag)) { n++; console.log(`${r.stage} ${p}.${k}: "${frag}..."`); } }); })));
const log = fs.readFileSync(D + 'play.log', 'utf8').split(String.fromCharCode(10));
log.forEach((l) => whys.forEach((w) => { if (l.includes(w.slice(0, 40)) && !/ pop: /.test(l)) { n++; console.log('log: ' + l.slice(0, 200)); } }));
console.log(`why lines checked: ${whys.length}; stage records: ${L.length}; found outside the opening pop: ${n}`);
