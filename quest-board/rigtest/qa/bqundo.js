const pw=require('playwright');(async()=>{const b=await pw.chromium.launch();
for(const mode of ['plain','bounty']){const ctx=await b.newContext({viewport:{width:390,height:844}});await ctx.route('**/*',r=>r.request().url().startsWith('http://127.0.0.1:')?r.continue():r.abort());const p=await ctx.newPage();
await p.goto('http://127.0.0.1:8769/dist/index.html');await p.waitForFunction(()=>window.__qb&&window.__qbV147&&document.querySelector('.nav button, #ccname'),null,{timeout:120000});await p.waitForTimeout(3000);
const r=await p.evaluate(async(mode)=>{const x=window.__qb.x(),S=x.S;S.created=true;S.char=window.__qb.fixChar({name:'U',sex:'m'});S.cls='vanguard';S.xp=x.cum(12)+1;S.gates=[5,10];S.calm=false;S.coins=1000;S.tutDone=1;S.tours={welcome:1,hideout:1,train:1,dq:1,bty:1,hall:1,shop:1,players:1,wheel:1};
 S.quests=[{id:'a',name:'Task A',xp:25,stat:'discipline',cl:'home',rep:'daily'},{id:'b',name:'Task B',xp:25,stat:'discipline',cl:'home',rep:'daily'}];S.done={};S.cdone={};delete S.bq;window.__qbV144&&window.__qbV144.loot.rnd(()=>0.999);x.render();
 const log=[];const step=(n)=>log.push(n+':'+S.coins+'/'+S.xp+'/streak'+S.streak);
 x.toggle('b');x.toggle('b');step('warm');/* the day's first-tick rewards out of the way */
 let id='a';if(mode==='bounty'){id=window.__qbV147.take(1).qid}
 step('before');x.toggle(id);await new Promise(r=>setTimeout(r,300));step('tick');x.toggle(id);step('untick');x.toggle(id);step('retick');x.toggle(id);step('untick2');return log.join('  ')},mode);
console.log(mode,r,p.errs?'' :'');await ctx.close()}await b.close()})();
