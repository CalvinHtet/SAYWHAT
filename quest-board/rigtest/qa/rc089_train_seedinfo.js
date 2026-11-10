// rc089 QA: what the seeds hold (Training and inbox fields)
const fs=require('fs');
for (const f of ['seed_adv2','seed_heavy']) {
  const d=JSON.parse(fs.readFileSync('C:/Users/clvh/qa-wt/out/'+f+'.json','utf8'));
  const s=JSON.parse(d['quest-board']);
  const gl=s.gymlog||{}, ks=Object.keys(gl);
  console.log(f, 'keys', Object.keys(d).length, 'save KB', Math.round(d['quest-board'].length/1024), {appv:s.appv,epoch:s.epoch,welcomed:s.welcomed,created:s.created,letters:s.letters,inbox:s.inbox,coins:s.coins,runDate:s.runDate,tshift:s.tshift,savedAt:new Date(s.savedAt).toISOString()});
  console.log('  gymlog keys', ks.length, 'entries', ks.reduce((a,k)=>a+gl[k].length,0), 'gymlog chars', JSON.stringify(gl).length, 'sessions', (s.sessions||[]).length, 'chars', JSON.stringify(s.sessions||[]).length, 'cex', Object.keys(s.cex||{}).length);
  if (ks.length) console.log('  sample', ks[0], JSON.stringify(gl[ks[0]].slice(0,2)), 'dates', gl[ks[0]].map(x=>x.d).join(','));
  if ((s.sessions||[]).length) console.log('  sess first/last', JSON.stringify(s.sessions[0]), JSON.stringify(s.sessions[s.sessions.length-1]));
}
