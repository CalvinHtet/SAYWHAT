// rc089 QA: which localStorage keys of a seed hold the save (the game's own key and the sandbox database's copy)
const fs=require('fs');
for (const f of ['seed_adv2','seed_heavy']) {
  const d=JSON.parse(fs.readFileSync('C:/Users/clvh/qa-wt/out/'+f+'.json','utf8'));
  console.log(f, Object.keys(d).filter(k=>/gymlog|"welcomed"/.test(d[k])).map(k=>k+' '+d[k].length).join(' ; '), '| non-sandbox keys:', Object.keys(d).filter(k=>k.indexOf('qbsbx:')!==0).join(','), '| sandbox prefixes:', [...new Set(Object.keys(d).filter(k=>k.indexOf('qbsbx:')===0).map(k=>k.split('/')[0]))].join(','));
}
