// prints parts of stages.jsonl: STAGE=<regex> PART=rooms|helps|tabs KEY=<regex> GREP=<regex, prints only the lines around it>
const fs = require('fs');
const L = fs.readFileSync((process.env.OUT || 'C:/Users/clvh/qa-wt/out/nospoil') + '/stages.jsonl', 'utf8').split(String.fromCharCode(10)).filter(Boolean).map((l) => JSON.parse(l));
const S = new RegExp(process.env.STAGE || '.'), K = new RegExp(process.env.KEY || '.'), G = process.env.GREP ? new RegExp(process.env.GREP, 'i') : null, N = +process.env.N || 3000;
L.filter((r) => S.test(r.stage)).forEach((r) => {
  const part = r[process.env.PART || 'rooms'] || {};
  Object.keys(part).filter((k) => K.test(k)).forEach((k) => {
    let t = String(part[k]).replace(/[ \t]+/g, ' ').replace(/\n+/g, ' / ');
    if (G) { const out = []; let m; const g = new RegExp(G.source, 'gi'); while ((m = g.exec(t))) out.push('…' + t.slice(Math.max(0, m.index - 250), m.index + 250) + '…'); t = out.join(' ### '); if (!t) return; }
    console.log(`### ${r.stage} ${process.env.PART || 'rooms'}.${k}: ${t.slice(0, N)}`);
  });
});
