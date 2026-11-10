// Clothing tiers (LEAD 10:08, SPEC3 part 5): every Shop clothing piece with its brand, slot, name, price and icon, as JSON, and
// contact sheets of the icons (labelled) so QA can grade each by look: thrift, standard, premium, luxury. Changes nothing.
//   BASE=http://127.0.0.1:8811 OUT=<folder> bash tools/windows/node.sh rigtest/qa/clothsheet.js
const fs = require('fs');
const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8811', OUT = process.env.OUT || 'C:/Users/clvh/qa-wt/out/tiers'; fs.mkdirSync(OUT, { recursive: true });
const PER = +process.env.PER || 24;
(async () => {
  const br = await browser(); const pg = await br.page({ fresh: true, phone: false, width: 1400, height: 1000, dpr: 1 });
  await pg.go(BASE + '/'); await pg.wait('!!(window.__qb && window.__qb.x && window.QBLoft && QBLoft.data && QBLoft.data.items)', 120000); await sleep(1500);
  const items = await pg.ev(`(function(){var x=window.__qb.x(),SH=x.SHOP||[],I=QBLoft.data.items||{};
    return SH.map(function(it){var m=it[6]||{};var g=m.gar||m.icon;var d=g&&I[g]||{};return {id:it[0],type:it[1],name:it[2],price:it[3],lvl:it[4],desc:it[5],slot:d.slot||m.slot||'',brand:m.b||'',gar:m.gar||'',icon:'icon_'+(m.icon||m.gar)+'.webp',meta:JSON.stringify(m).slice(0,200),raw:JSON.stringify(it.slice(0,6)).slice(0,200)}})})()`);
  fs.writeFileSync(OUT + '/shop_items.json', JSON.stringify(items, null, 1));
  const kinds = {}; items.forEach((i) => { kinds[i.type] = (kinds[i.type] || 0) + 1; });
  console.log('Shop entries ' + items.length + ', by kind ' + JSON.stringify(kinds));
  console.log('sample: ' + JSON.stringify(items.slice(0, 3)));
  const cloth = items.filter((i) => /^a_(top|pants|shoes|acc|back|eyet|hat)$/.test(i.type) && i.brand !== 'dungeon');
  console.log('with a garment (clothing): ' + cloth.length + '; brands ' + JSON.stringify(cloth.reduce((a, i) => { a[i.brand || '(none)'] = (a[i.brand || '(none)'] || 0) + 1; return a; }, {})));
  // sheets
  for (let s = 0; s * PER < cloth.length; s++) {
    const part = cloth.slice(s * PER, (s + 1) * PER);
    const png = await pg.ev(`(async function(L){var cols=6,cw=230,ch=250,cv=document.createElement('canvas');cv.width=cols*cw;cv.height=Math.ceil(L.length/cols)*ch;var g=cv.getContext('2d');g.fillStyle='#f4f1ec';g.fillRect(0,0,cv.width,cv.height);
      for(var i=0;i<L.length;i++){var it=L[i],x=(i%cols)*cw,y=Math.floor(i/cols)*ch;g.fillStyle='#fff';g.fillRect(x+4,y+4,cw-8,ch-8);
        var im=await new Promise(function(ok){var m=new Image();m.onload=function(){ok(m)};m.onerror=function(){ok(null)};m.src=(window.QBART&&QBART[it.icon])||('art/'+it.icon)});
        if(im){var k=Math.min(180/im.width,170/im.height);g.drawImage(im,x+(cw-im.width*k)/2,y+8+(170-im.height*k)/2,im.width*k,im.height*k)}else{g.fillStyle='#c00';g.fillText('NO ICON',x+80,y+90)}
        g.fillStyle='#222';g.font='bold 13px sans-serif';g.fillText((${s * PER}+i+1)+'. '+it.id,x+10,y+196);g.font='12px sans-serif';g.fillText(String(it.name).slice(0,30),x+10,y+212);g.fillText((it.brand||'-')+' | '+it.slot+' | '+it.price,x+10,y+228)}
      return cv.toDataURL('image/png')})(${JSON.stringify(part)})`, 120000);
    fs.writeFileSync(OUT + `/sheet_${String(s + 1).padStart(2, '0')}.png`, Buffer.from(png.split(',')[1], 'base64'));
  }
  console.log('sheets: ' + Math.ceil(cloth.length / PER) + ' in ' + OUT + '; page errors ' + pg.errs.length);
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
