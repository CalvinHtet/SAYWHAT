// rc-0.90 econ QA, part 2b: the Wardrobe at level 20 with "Wear as second" showing, and a mask + glasses pair (different rig
// slots, both on the face) drawn together, male idle and sit.
//   CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/rc090_econ2b.js
const fs = require('fs');
const { browser, sleep } = require('./cdp.js');
const BASE = 'http://127.0.0.1:8816', OUT = 'C:/Users/clvh/qa-wt/out/rc090/econ/';
(async () => {
  const br = await browser();
  const pg = await br.page({ fresh: true });
  await pg.go(BASE + '/');
  await pg.wait('!!(window.__qb && window.__qb.x && window.QBLoft && document.querySelector("#app"))', 120000); await sleep(1500);
  const r = await pg.ev(`(function(){var x=window.__qb.x(),S=x.S,I=QBLoft.data.items;S.created=true;S.char=window.__qb.fixChar({name:'QA',sex:'m'});S.welcomed=1;S.xp=x.cum(20);var g,n=0;while((g=x.gated())!==null&&n++<20)S.gates.push(g);
    var acc=x.SHOP.filter(function(it){return it[1]==='a_acc'&&it[6]&&it[6].gar&&I[it[6].gar]&&!it[6].fo&&!it[6].mo});var mask=acc.filter(function(it){return I[it[6].gar].slot==='mask'})[0],gl=acc.filter(function(it){return I[it[6].gar].slot==='glasses'})[0],pend=acc.filter(function(it){return I[it[6].gar].slot==='neck'})[0];
    [mask,gl,pend].forEach(function(it){S.owned[it[0]]=true});S.eq.a_acc=pend[0];S.areaOn=S.areaOn||{};S.areaOn.shop=1;window.__qbRooms.open('closet',1);x.persist();x.render();
    return {mask:mask[0]+' '+mask[2],gl:gl[0]+' '+gl[2],pend:pend[0]+' '+pend[2],lvl:x.effLvl()}})()`);
  console.log(JSON.stringify(r));
  await sleep(3000);
  const w = await pg.ev(`(function(){document.querySelectorAll('#layer .modal,.modal,.dropsplash').forEach(function(e){e.remove()});var b=document.createElement('button');b.dataset.act='nav';b.dataset.v='shop';document.body.appendChild(b);b.click();b.remove();
    var tb=document.querySelector('[data-act=stab][data-v=wardrobe]');if(tb)tb.click();var e2=document.querySelectorAll('[data-act=equip2]');if(e2[0])e2[0].scrollIntoView({block:'center'});
    return [].map.call(e2,function(b){return b.dataset.id+':'+b.textContent})})()`);
  await sleep(1500); await pg.shot(OUT + 'acc2_wardrobe_lv20_wear_second.png');
  console.log('lv20 wardrobe equip2 buttons ' + JSON.stringify(w));
  const f = await pg.ev(`(async function(){var x=window.__qb.x(),S=x.S,I=QBLoft.data.items,w=function(ms){return new Promise(function(o){setTimeout(o,ms)})};
    var acc=x.SHOP.filter(function(it){return it[1]==='a_acc'&&it[6]&&it[6].gar&&I[it[6].gar]&&!it[6].fo&&!it[6].mo});var mask=acc.filter(function(it){return I[it[6].gar].slot==='mask'})[0],gl=acc.filter(function(it){return I[it[6].gar].slot==='glasses'})[0];
    S.eq.a_acc=mask[0];var b=document.createElement('button');b.dataset.act='equip2';b.dataset.id=gl[0];document.body.appendChild(b);b.click();b.remove();var ok=S.eq.a_acc2===gl[0];
    var ch=window.__qb.lookOf().rig,ims=[];for(var c of ['idle','sit']){QBLoft.warm(ch,c);var u=null,t=0;while(!u&&t++<200){u=QBLoft.frame(ch,c,0);if(!u)await w(100)}ims.push(u?await new Promise(function(o){var m=new Image();m.onload=function(){o(m)};m.src=u}):null)}
    var cv=document.createElement('canvas');cv.width=ims.length*ims[0].width;cv.height=ims[0].height;var g=cv.getContext('2d');g.fillStyle='#f4f0ea';g.fillRect(0,0,cv.width,cv.height);ims.forEach(function(m,k){if(m)g.drawImage(m,k*m.width,0)});
    return {allowed:ok,eq:Object.keys(ch.equipped||{}),png:cv.toDataURL('image/png')}})()`, 120000);
  fs.writeFileSync(OUT + 'acc2_mask_glasses.png', Buffer.from(f.png.split(',')[1], 'base64'));
  console.log('mask+glasses allowed ' + f.allowed + ' drawn slots ' + JSON.stringify(f.eq));
  console.log('page errors', pg.errs.length, JSON.stringify(pg.errs.slice(0, 4)));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
