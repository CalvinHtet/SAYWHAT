const d = JSON.parse(require('fs').readFileSync('C:/Users/clvh/qa-wt/out/seed_adv2.json', 'utf8'));
Object.keys(d).sort().forEach((k) => console.log(k, d[k].length, k.startsWith('qbsbx:') ? d[k].slice(0, 160) : ''));
