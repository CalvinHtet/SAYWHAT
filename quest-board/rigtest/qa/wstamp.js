// w-stamp b9ad3ef (W37): the time stamp burnt into proof photos (web.js qbStamp / qbStampText). Draws it on dark, bright, orange,
// busy and landscape photos at the size the app sends (longest side 1024, JPEG 0.75, as shrink() does), then writes one sheet:
// each photo whole at phone width and its stamp corner at 2x after the JPEG round trip.
//   BASE=http://127.0.0.1:8813 OUT=<png> bash tools/windows/node.sh rigtest/qa/wstamp.js
const fs = require('fs');
const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8813', OUT = process.env.OUT || 'C:/Users/clvh/qa-wt/out/wstamp/stamp_sheet.png';
fs.mkdirSync(require('path').dirname(OUT), { recursive: true });
(async () => {
  const br = await browser(); const pg = await br.page({ fresh: true, phone: false, width: 1200, height: 900, dpr: 1 });
  await pg.go(BASE + '/'); await pg.wait('typeof window.qbStamp==="function" && typeof window.qbStampText==="function"', 120000);
  const r = await pg.ev(`(async function(){
    var cases=[['dark',768,1024,function(g,w,h){g.fillStyle='#14161c';g.fillRect(0,0,w,h)}],
      ['bright',768,1024,function(g,w,h){g.fillStyle='#f7f7f2';g.fillRect(0,0,w,h)}],
      ['orange',768,1024,function(g,w,h){g.fillStyle='#ff7a18';g.fillRect(0,0,w,h)}],
      ['cyan',768,1024,function(g,w,h){g.fillStyle='#17d4e6';g.fillRect(0,0,w,h)}],
      ['busy',768,1024,function(g,w,h){for(var i=0;i<4000;i++){g.fillStyle='hsl('+(i*37%360)+','+(40+i%50)+'%,'+(20+i*13%70)+'%)';g.fillRect(Math.random()*w,Math.random()*h,8+Math.random()*60,8+Math.random()*60)}}],
      ['landscape',1024,768,function(g,w,h){var gr=g.createLinearGradient(0,0,w,h);gr.addColorStop(0,'#2b5876');gr.addColorStop(1,'#fdfbfb');g.fillStyle=gr;g.fillRect(0,0,w,h)}]];
    var text=window.qbStampText(), fixed=window.qbStampText(Date.UTC(2026,10,10,7,42)), out=[];
    for(var i=0;i<cases.length;i++){var C=cases[i],c=document.createElement('canvas');c.width=C[1];c.height=C[2];var g=c.getContext('2d');C[3](g,c.width,c.height);window.qbStamp(c,text);
      var jpg=c.toDataURL('image/jpeg',0.75);var im=await new Promise(function(ok){var m=new Image();m.onload=function(){ok(m)};m.src=jpg});out.push({name:C[0],im:im,w:c.width,h:c.height,kb:Math.round(jpg.length*3/4/1024)})}
    // sheet: per case, the photo at 390 px wide (what a phone shows) and its bottom-right 420x110 corner at 2x
    var cw=390, rowH=560, sh=document.createElement('canvas');sh.width=cw+880+30;sh.height=out.length*rowH;var s=sh.getContext('2d');s.fillStyle='#ddd';s.fillRect(0,0,sh.width,sh.height);
    out.forEach(function(o,k){var y=k*rowH,sc=Math.min(cw/o.w,(rowH-30)/o.h);s.drawImage(o.im,0,y+24,o.w*sc,o.h*sc);
      s.drawImage(o.im,o.w-420,o.h-110,420,110,cw+20,y+24,840,220);s.fillStyle='#111';s.font='bold 16px sans-serif';s.fillText(o.name+' '+o.w+'x'+o.h+' JPEG '+o.kb+' KB',4,y+18)});
    return {text:text,fixed:fixed,png:sh.toDataURL('image/png'),fs:Math.max(12,Math.round(768*0.04))}})()`, 120000);
  fs.writeFileSync(OUT, Buffer.from(r.png.split(',')[1], 'base64'));
  console.log('stamp text now: "' + r.text + '"; 2026-11-10 07:42 UTC on this machine: "' + r.fixed + '"; font ' + r.fs + ' px on a 768 px side; sheet ' + OUT);
  console.log('page errors ' + pg.errs.length + (pg.errs.length ? ': ' + pg.errs.join(' | ').slice(0, 600) : ''));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
