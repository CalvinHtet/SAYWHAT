const pw=require('playwright');(async()=>{const b=await pw.chromium.launch();
const open=async(base,save)=>{const ctx=await b.newContext({viewport:{width:390,height:844}});await ctx.route('**/*',r=>r.request().url().startsWith('http://127.0.0.1:')?r.continue():r.abort());
 if(save)await ctx.addInitScript(s=>{try{if(!sessionStorage.getItem('q')){sessionStorage.setItem('q','1');localStorage.setItem('quest-board',s)}}catch(e){}},save);
 await ctx.addInitScript(()=>{window.__pops=[];const iv=setInterval(()=>{document.querySelectorAll('.pop,#layer .modal').forEach(e=>{const t=e.innerText.replace(/\s+/g,' ').slice(0,70);if(t&&window.__pops.indexOf(t)<0)window.__pops.push(t)})},100)});
 const p=await ctx.newPage();await p.goto(base+'/dist/index.html');await p.waitForFunction(()=>window.__qb&&window.__qb.x&&document.querySelector('.nav button, #ccname'),null,{timeout:120000});await p.waitForTimeout(4000);return {ctx,p}};
let {ctx,p}=await open('http://127.0.0.1:8817');
await p.evaluate(()=>{const x=window.__qb.x(),S=x.S,A=x.ADDONS;S.created=true;S.char=window.__qb.fixChar({name:'R',sex:'f'});S.cls='vanguard';S.xp=x.cum(30)+5;S.gates=[5,10,20,30];S.calm=false;S.coins=4321;S.tutDone=1;S.tours={welcome:1,hideout:1,train:1,dq:1,bty:1,hall:1,shop:1,players:1,wheel:1};S.areaOn={board:1,train:1,hideout:1,shop:1,hall:1,players:1,away:1,wheel:1,trophy:1,sys:1};
 S.base.slots=[{t:'bedroom',a:{bd_ward2:1},st:0,pend:0},{t:'closet',a:{},st:0,pend:0}];S.quests=[0,1,2,3].map(k=>({id:'d'+k,name:'Task '+k,xp:25,stat:'discipline',cl:'home',rep:'daily'}));S.done={};S.cdone={};x.render();['d0','d1','d2'].forEach(id=>x.toggle(id));const H=window.__qbV147;H.take(1);const A2=H.take(2);x.toggle(A2.qid);H.take(3);x.persist()});
await p.waitForTimeout(3000);await p.evaluate(()=>document.querySelectorAll('#layer .modal').forEach(m=>m.remove()));await p.waitForTimeout(1500);
const j=await p.evaluate(()=>localStorage.getItem('quest-board'));const c0=JSON.parse(j).coins;await ctx.close();
for(const base of ['http://127.0.0.1:8817','http://127.0.0.1:8769']){({ctx,p}=await open(base,j));const r=await p.evaluate(()=>({coins:window.__qb.x().S.coins,earned:window.__qb.x().S.earnedC,pops:window.__pops}));console.log(base.slice(-4),'stored',c0,'-> loaded',r.coins,'('+(r.coins-c0>=0?'+':'')+(r.coins-c0)+') pops:',JSON.stringify(r.pops).slice(0,400));await ctx.close()}
await b.close()})();
