// Text contrast measured on the real pixels (w-colors, W50/W14): for each rank and screen, every visible text's colour is read, then all
// text is made transparent and the screen captured; the colour behind each text is the median of the captured pixels in its box. WCAG AA:
// 4.5:1 normal text, 3:1 large (24 px, or 18.7 px bold). Two scroll positions per screen (the top, one screen down). Compare two builds
// with BASES=a,b (the same seed and steps), e.g. v0.91 against w-colors.
//   BASES=http://127.0.0.1:8819,http://127.0.0.1:8813 OUT=<dir/> CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/wcontrast.js
const fs = require('fs');
const SEEDS = require('path').join(__dirname, 'seeds') + '/';
const { browser, sleep } = require('./cdp.js');
const BASES = (process.env.BASES || 'http://127.0.0.1:8813').split(','), OUT = process.env.OUT || require('os').tmpdir() + '/qa-out/wcontrast/';
const RANKS = (process.env.RANKS || 'E,C,A,S').split(','), VIEWS = (process.env.VIEWS || 'board,train,hideout,hall:posts,hall:chat,hall:style,trophy,wheel,profile').split(',');
fs.mkdirSync(OUT, { recursive: true });
const log = (...a) => console.log(a.map((v) => (typeof v === 'string' ? v : JSON.stringify(v))).join(' '));
const COLLECT = `(function(){var root=document.querySelector('#layer .modal')||document.getElementById('app'),out=[],seen=new Set();
  var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:function(t){return t.textContent.trim().length>1?1:3}}),t;
  while((t=w.nextNode())){var el=t.parentElement;if(!el||seen.has(el)||el.closest('svg'))continue;seen.add(el);var cs=getComputedStyle(el);if(cs.visibility==='hidden'||+cs.opacity===0)continue;
    var rg=document.createRange();rg.selectNodeContents(t);var r=rg.getBoundingClientRect();if(r.width<4||r.height<6||r.bottom<=0||r.top>=innerHeight||r.left>=innerWidth||r.right<=0)continue;
    var m=cs.color.match(/rgba?\\(([^)]+)\\)/);if(!m)continue;var p=m[1].split(/[ ,\\/]+/).filter(Boolean).map(parseFloat);if(p.length>3&&p[3]<.05)continue;
    out.push({t:t.textContent.trim().slice(0,30),x:Math.max(0,r.left),y:Math.max(0,r.top),w:Math.min(r.right,innerWidth)-Math.max(0,r.left),h:Math.min(r.bottom,innerHeight)-Math.max(0,r.top),fg:p,fs:parseFloat(cs.fontSize),b:+cs.fontWeight>=700})}
  return out})()`;
const HIDE = `(function(){var s=document.createElement('style');s.id='qa-hide';s.textContent='*{color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important;caret-color:transparent!important}';document.head.appendChild(s);return 1})()`;
const MEASURE = (b64, items, dpr) => `(async function(items,dpr){var img=new Image();img.src='data:image/png;base64,${b64}';await img.decode();var c=document.createElement('canvas');c.width=img.width;c.height=img.height;var g=c.getContext('2d');g.drawImage(img,0,0);
  var L=function(r,gg,b){var f=function(v){v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return .2126*f(r)+.7152*f(gg)+.0722*f(b)};
  return items.map(function(it){var x=Math.round(it.x*dpr),y=Math.round(it.y*dpr),w=Math.max(1,Math.round(it.w*dpr)),h=Math.max(1,Math.round(it.h*dpr));var d=g.getImageData(x,y,w,h).data,px=[];
    for(var i=0;i<d.length;i+=4*Math.max(1,Math.floor(d.length/4/400)))px.push([d[i],d[i+1],d[i+2],L(d[i],d[i+1],d[i+2])]);px.sort(function(a,b){return a[3]-b[3]});var med=px[Math.floor(px.length/2)];
    var a=it.fg.length>3?it.fg[3]:1,fr=it.fg[0]*a+med[0]*(1-a),fgg=it.fg[1]*a+med[1]*(1-a),fb=it.fg[2]*a+med[2]*(1-a),l1=L(fr,fgg,fb),l2=med[3],cr=(Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05);
    var need=(it.fs>=24||(it.b&&it.fs>=18.66))?3:4.5;return {t:it.t,cr:Math.round(cr*100)/100,need:need,fg:'rgb('+it.fg.slice(0,3).join(',')+')',bg:'rgb('+med.slice(0,3).join(',')+')'}})})(${JSON.stringify(items)},${dpr})`;
(async () => {
  const br = await browser(); const summary = {};
  for (const base of BASES) {
    const tag = base.split(':').pop(); summary[tag] = { n: 0, fail: 0, rows: {} };
    const pg = await br.page({ fresh: true });
    const seed = JSON.parse(fs.readFileSync(SEEDS + 'v88_adv.json', 'utf8'));
    await pg.go(base + '/version.json'); await pg.ev(`(function(d){localStorage.clear();Object.keys(d).forEach(function(k){localStorage.setItem(k,d[k])});return 1})(${JSON.stringify(seed)})`);
    await pg.go(base + '/'); await pg.wait('!!(window.__qb && document.querySelector(".nav button[data-v=board]"))', 120000); await sleep(3000);
    const clear = () => pg.ev('(function(){document.querySelectorAll(".dropsplash .dsx").forEach(function(b){b.click()});document.querySelectorAll("#layer .modal,.dropsplash").forEach(function(e){e.remove()});return 1})()');
    for (let k = 0; k < 4; k++) { await clear(); await sleep(400); }
    // reduced motion: the level effects (embers, aurora) would move between the two captures
    await pg.s('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    const gates = await pg.ev(`(function(){var x=window.__qb.x(),S=x.S,g0=S.gates.slice(),o={};for(var n=0;n<=9;n++){S.gates=[];for(var i=0;i<n;i++)S.gates.push(i);x.render();var r=document.documentElement.getAttribute('data-rank');if(r&&o[r]==null)o[r]=n}S.gates=g0;x.render();return o})()`);
    for (const rank of RANKS) {
      if (gates[rank] == null) continue;
      await pg.ev(`(function(){var x=window.__qb.x(),S=x.S;S.gates=[];for(var i=0;i<${gates[rank]};i++)S.gates.push(i);S.xp=Math.max(S.xp,x.cum(60));x.persist();x.render();return 1})()`); await sleep(400);
      for (const v of VIEWS) {
        await clear();
        if (v === 'profile') await pg.ev('(function(){var c=document.querySelector("[data-act=char]");c&&c.click();return 1})()');
        else { const [t, sub] = v.split(':'); const ok = await pg.ev(`(function(){var b=document.querySelector('.nav button[data-v="${t}"]');if(!b||b.classList.contains('lk'))return false;b.click();return true})()`); if (!ok) continue; await sleep(900);
          if (sub) await pg.ev(`(function(){var b=document.querySelector('[data-act=htab][data-t="${sub}"]');b&&b.click();return 1})()`); }
        await sleep(1200); if (v !== 'profile') await clear(); await pg.ev('window.scrollTo(0,0)');
        const fails = []; let n = 0;
        for (const scroll of [0, 1]) {
          await pg.ev(`(function(){var m=document.querySelector('#layer .modal');if(m)m.scrollTop=${scroll}*700;else window.scrollTo(0,${scroll}*700);return 1})()`); await sleep(400);
          const items = await pg.ev(COLLECT); await pg.ev(HIDE); await sleep(150);
          const shot = await pg.s('Page.captureScreenshot', { format: 'png' }); await pg.ev('(function(){var s=document.getElementById("qa-hide");s&&s.remove();return 1})()');
          const dpr = await pg.ev('devicePixelRatio'); const res = await pg.ev(MEASURE(shot.data, items, dpr), 60000);
          n += res.length; res.forEach((r) => { if (r.cr < r.need) fails.push(r); });
        }
        summary[tag].n += n; summary[tag].fail += fails.length;
        const key = rank + ' ' + v; summary[tag].rows[key] = fails.length;
        log(`${tag} ${key.padEnd(13)} ${n} texts, ${fails.length} below AA${fails.length ? ': ' + fails.slice(0, 4).map((f) => `"${f.t}" ${f.cr}<${f.need} ${f.fg} on ${f.bg}`).join(' ; ') : ''}`);
        if (v === 'profile') await clear();
      }
    }
    log(`${tag}: ${summary[tag].n} texts, ${summary[tag].fail} below AA; page errors ${pg.errs.length}`);
    await pg.close();
  }
  if (BASES.length > 1) { const [a, b] = BASES.map((x) => x.split(':').pop()); const keys = Object.keys(summary[b].rows);
    log('worse on ' + b + ' than ' + a + ':', keys.filter((k) => (summary[b].rows[k] || 0) > (summary[a].rows[k] || 0)).map((k) => `${k} ${summary[a].rows[k] || 0}->${summary[b].rows[k]}`).join(' | ') || 'none'); }
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
