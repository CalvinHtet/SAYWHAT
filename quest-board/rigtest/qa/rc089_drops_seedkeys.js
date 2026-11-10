// rc-0.89 QA: what is in seed_adv2.json (keys, and the save's brand items)
const d = JSON.parse(require('fs').readFileSync('C:/Users/clvh/qa-wt/out/seed_adv2.json', 'utf8'));
for (const k in d) console.log(k, d[k].length);
for (const k in d) { try { const s = JSON.parse(d[k]); if (s && s.owned) { const o = Object.keys(s.owned).filter((x) => s.owned[x]); console.log('save key', k, 'owned', o.length, 'gx_', o.filter((x) => x.indexOf('gx_') === 0).length, o.filter((x) => x.indexOf('gx_') === 0).slice(0, 60).join(' '), 'shopDay', s.shopDay, 'shopKeep', s.shopKeep, 'brandSeen', JSON.stringify(s.brandSeen), 'appv?', s.v || s.appv); } } catch (e) {} }
