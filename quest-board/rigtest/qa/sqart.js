// ROOMS's f9ecb1a (+ f2e57f6): the Town square backdrop ui_town_square.webp behind the 11 spots in the Players tab, at 390 and 360. The sandbox has 6
// stand-in players, so the empty spots get copies of the last figure (QA's stand-ins in the page only) to see all 11 on the picture.
// Checks: the backdrop loads at full size, each figure and name sits inside the stage, names don't overlap each other, the clock tower top shows.
//   BASE=<sandbox> OUT=<folder> CHROME_PORT=9375 node sqart.js
const fs = require('fs'); const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8817', OUT = process.env.OUT || require('os').tmpdir() + '/qa-out/sq/'; fs.mkdirSync(OUT, { recursive: true });
(async () => { const br = await browser(); let bad = 0;
  for (const [w, h] of [[390, 844], [360, 740]]) { const pg = await br.page({ fresh: true }); await pg.s('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 3, mobile: true });
    await pg.go(BASE + '/'); await pg.wait('!!(window.__qb && document.querySelector("#app") && !document.querySelector("#app .boot"))', 120000); await sleep(2500);
    await pg.ev(`(function(){var x=window.__qb.x(),S=x.S;S.created=true;S.welcomed=1;S.char=window.__qb.fixChar({name:'Qa',sex:'m'});S.xp=x.cum(12);S.areaOn=null;S.gates=Array.from({length:200},function(_,i){return i});x.persist();window.__qbUnlock.on().hall=1;x.persist();x.render();return 1})()`); await sleep(1500);
    await pg.ev('(function(){document.querySelectorAll("#layer .modal,.dropsplash").forEach(function(m){m.remove()});document.querySelector(".nav button[data-v=players]").click();return 1})()'); await sleep(2500);
    await pg.ev(`(async function(){[].forEach.call(document.querySelectorAll('[data-act=fshfold]'),function(b){if(b.getAttribute('aria-expanded')!=='true')b.click()});await new Promise(function(o){setTimeout(o,1500)});document.querySelectorAll('.dropsplash,.bsplash,#layer .modal').forEach(function(m){m.remove()});return 1})()`);
    const r = await pg.ev(`(async function(){var st=document.querySelector('#sqbox .sq-stage');if(!st)return {none:1};var ps=[].slice.call(st.querySelectorAll('.sq-p')),real=ps.length;var SL=${JSON.stringify([[38,96,104],[62,96,104],[14,96,104],[86,96,104],[26,72,88],[50,72,88],[74,72,88],[14,50,72],[38,50,72],[62,50,72],[86,50,72]])};
      for(var i=real;i<SL.length;i++){var c=ps[ps.length-1].cloneNode(true);c.style.left=SL[i][0]+'%';c.style.top=SL[i][1]+'%';c.style.zIndex=SL[i][1];var im=c.querySelector('img');if(im){im.style.width=SL[i][2]+'px';im.style.height='auto'}c.querySelector('.sq-n').textContent='Spot '+(i+1);st.appendChild(c)}
      await new Promise(function(o){setTimeout(o,800)});st.scrollIntoView({block:'center'});await new Promise(function(o){setTimeout(o,400)});
      var bg=getComputedStyle(st).backgroundImage,u=(bg.match(/url\\("?(.*?)"?\\)/)||[])[1],im=new Image();if(u){im.src=u;await im.decode().catch(function(){})}
      var sb=st.getBoundingClientRect(),all=[].slice.call(st.querySelectorAll('.sq-p')),R=function(e){var b=e.getBoundingClientRect();return [b.left,b.top,b.right,b.bottom].map(Math.round)};
      var out=[],ov=[],names=all.map(function(p){return R(p.querySelector('.sq-n'))});all.forEach(function(p,i){var b=R(p),n=names[i];if(b[0]<sb.left-1||b[2]>sb.right+1||b[1]<sb.top-1||n[3]>sb.bottom+1)out.push(i+1)});
      for(var a=0;a<names.length;a++)for(var c2=a+1;c2<names.length;c2++){var A=names[a],B=names[c2];if(A[0]<B[2]&&B[0]<A[2]&&A[1]<B[3]&&B[1]<A[3])ov.push((a+1)+'+'+(c2+1))}
      return {real:real,spots:all.length,art:!!u&&/town_square|data:|blob:|art\\//.test(u),nat:[im.naturalWidth,im.naturalHeight],stage:[Math.round(sb.width),Math.round(sb.height)],size:getComputedStyle(st).backgroundSize,pos:getComputedStyle(st).backgroundPosition,outside:out,nameOverlap:ov}})()`);
    const good = r.art && r.nat[0] === 1024 && r.spots === 11 && !r.outside.length && !r.nameOverlap.length; if (!good) bad++;
    console.log((good ? 'ok   ' : 'BAD  ') + w + ': ' + JSON.stringify(r));
    await pg.ev('(function(){document.querySelector("#sqbox .sq-stage").scrollIntoView({block:"center"});return 1})()'); await sleep(600);
    await pg.shot(OUT + 'square_' + w + '.png'); console.log('     page errors', JSON.stringify(pg.errs || [])); await pg.close(); }
  console.log(bad ? 'FAILED ' + bad : 'PASS'); process.exit(0); })().catch((e) => { console.error(e); process.exit(1); });
