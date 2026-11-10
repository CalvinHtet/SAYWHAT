// rc089 QA, Training W5 part 5: the save's worst case. The heavy save (its Hall sandbox data dropped to stay under the 5 MB
// localStorage quota; the save itself is untouched) gets the most history that can survive the trim: every exercise (gym and
// the 40 custom ones) logged every day and every plan done every day, for the last 200 days. Then every plan is logged once
// through the Training screen (the app's own buttons: plan, the first set of each exercise, Finish workout), which trims what it
// touches. Sizes before and after. Then Push is logged 20 more times the same day: what each extra log adds (no count cap).
const fs = require('fs');
const L = require('./rc089_train_lib.js');
const { sleep } = L;
const log = (...a) => console.log(...a);
const PLANS = ['push', 'pull', 'legs', 'full', 'arms', 'chest', 'back', 'shoulders', 'core', 'c_cardio', 'c_outdoors', 'c_sport', 'c_mobility'];
(async () => {
  const sd = L.seed('seed_heavy');
  Object.keys(sd).forEach((k) => { if (/^qbsbx:(chat|board|likes|pings|worlds|kudosok)\//.test(k)) delete sd[k]; });
  const { br, pg } = await L.openGame(sd);
  await L.settle(pg, null, 20);
  const src = await (await fetch(L.BASE + '/app.js')).text(), exb = src.slice(src.indexOf('var EX={'), src.indexOf('var EX={') + 20000);
  const exk = [...exb.slice(0, exb.indexOf('};')).matchAll(/([a-z0-9_]+):\[/g)].map((m) => m[1]);
  const sizes = () => L.S(pg, `(function(){var g=S.gymlog||{},ks=Object.keys(g);var save=localStorage.getItem('quest-board')||'';var big=ks.filter(function(k){return g[k].length>60});
    return {saveKB:Math.round(save.length/102.4)/10,gymlogKB:Math.round(JSON.stringify(g).length/102.4)/10,gymKeys:ks.length,gymEntries:ks.reduce(function(a,k){return a+g[k].length},0),untrimmed:big.length+(big.length?' ('+big.join(',')+')':''),
      maxPerEx:Math.max.apply(null,ks.map(function(k){return g[k].length})),sessions:(S.sessions||[]).length,sessionsKB:Math.round(JSON.stringify(S.sessions||[]).length/102.4)/10,lsChars:(function(){var t=0;for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);t+=k.length+localStorage.getItem(k).length}return t})()}})()`);
  log('seed as loaded', JSON.stringify(await sizes()));
  log('inject', JSON.stringify(await L.S(pg, `(function(EXK){var ds=function(k){var d=new Date(Date.now()-5*36e5-k*864e5);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
    var cx=Object.keys(S.cex||{}),all=EXK.concat(cx),g={};
    all.forEach(function(id,j){var c=S.cex&&S.cex[id],ns=c?c.sets:(j%3?3:4),u=c?c.u:'lb',a=[];for(var k=200;k>=1;k--){var w=c?(1+(k+j)%9)+0.5:100+((k*7+j)%30)*2.5,ws=[];for(var i=0;i<ns;i++)ws.push(w);a.push({d:ds(k),w:w,ws:ws,n:ns,hit:k%2===0,u:u})}g[id]=a});
    S.gymlog=g;var plans=${JSON.stringify(PLANS)},ss=[];
    for(var k=200;k>=1;k--)plans.forEach(function(p,pi){var top={};all.slice(pi*5,pi*5+7).forEach(function(id){top[id]=g[id][200-k].w});ss.push({d:ds(k),plan:p,n:7,load:3000+((k*13+pi)%50)*20,u:p.indexOf('c_')===0?'mi':'lb',top:top})});
    S.sessions=ss;S.wk=null;x.persist();return {exercises:all.length,entries:all.length*200,sessions:ss.length}})(${JSON.stringify(exk)})`)));
  await sleep(1500);
  const pre = await sizes(); log('BEFORE any log (200 days of everything, untrimmed)', JSON.stringify(pre));
  await L.nav(pg, 'train'); await sleep(1500); await L.closeAll(pg);
  const logPlan = async (p) => {
    const ok = await pg.ev(`(function(){var b=document.querySelector('button.plan[data-act=wkplan][data-v="${p}"]');if(!b)return false;b.click();return true})()`);
    if (!ok) return 'no plan button';
    await sleep(900);
    await pg.ev(`(function(){var x=document.querySelector('[data-ca="x"]');if(x)x.click();return 1})()`); await sleep(300); await L.closeAll(pg);
    const n = await pg.ev(`(function(){var ids=[].map.call(document.querySelectorAll('.exlist .ex .setb'),function(s){return s.querySelector('button.sb').dataset.ex});ids.forEach(function(id){var b=document.querySelector('.exlist .setb button.sb[data-ex="'+id+'"]');if(b)b.click()});return ids.length})()`);
    await sleep(300);
    await pg.ev(`(function(){var b=document.querySelector('button[data-act=wkdone]');if(b)b.click();return 1})()`); await sleep(900);
    const sum = await pg.ev(`(function(){var m=document.querySelector('#layer .modal .wksum');return m?m.querySelector('h2').textContent:'(no summary)'})()`);
    await L.closeAll(pg); await sleep(300); await L.closeAll(pg);
    return n + ' exercises, ' + sum;
  };
  for (const p of PLANS) log('logged', p, await logPlan(p));
  await sleep(1500);
  const post = await sizes(); log('AFTER logging every plan once', JSON.stringify(post));
  const perEx = await L.S(pg, `Object.keys(S.gymlog).slice(0,3).concat(['cx_1']).map(function(k){var a=S.gymlog[k];return k+': '+a.length+' entries, full '+a.filter(function(x){return 'ws' in x}).length+', slim '+a.filter(function(x){return !('ws' in x)}).length+', '+a[0].d+'..'+a[a.length-1].d+', '+JSON.stringify(a).length+' chars'}).join(' | ')`);
  log('per exercise', perEx);
  log('sessions by plan', await L.S(pg, `(function(){var o={};S.sessions.forEach(function(s){var k=s.plan;o[k]=o[k]||{n:0,full:0};o[k].n++;if(s.top)o[k].full++});return JSON.stringify(o)})()`));
  // 20 more Push logs the same day
  const s0 = (await sizes()).saveKB;
  for (let i = 0; i < 20; i++) await logPlan('push');
  await sleep(1500);
  const s20 = await sizes(); log('AFTER 20 more Push logs today', JSON.stringify(s20), 'growth per log KB', Math.round((s20.saveKB - s0) / 20 * 100) / 100);
  log('bench entries dated today', await L.S(pg, `S.gymlog.bench.filter(function(x){return x.d===S.gymlog.bench[S.gymlog.bench.length-1].d}).length`));
  log('page errors', pg.errs.length, JSON.stringify(pg.errs.slice(0, 6)));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
