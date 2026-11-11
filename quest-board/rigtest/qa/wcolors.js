// w-colors (W50 the Hall's palette, W14 a tint per screen): for each rank (S.gates moves the rank) and each screen, every visible piece of
// text is checked against the colour behind it (the nearest painted ancestor, semi-transparent layers blended down to the page colour):
// WCAG AA, 4.5:1 for normal text, 3:1 for large (24 px, or 18.7 px bold). Lists the screens' palettes (--bg/--surface/--accent), the
// failures with examples, and pictures. Then a bought theme (accent inline on <html>) in the Hall and on the Board. Over a gradient the
// worst of its colour stops counts; text over a picture (url) is skipped.
//   BASE=<build> OUT=<dir/> CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/wcolors.js
const fs = require('fs');
const SEEDS = require('path').join(__dirname, 'seeds') + '/';
const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8813', OUT = process.env.OUT || require('os').tmpdir() + '/qa-out/wcolors/';
fs.mkdirSync(OUT, { recursive: true });
const log = (...a) => console.log(a.map((v) => (typeof v === 'string' ? v : JSON.stringify(v))).join(' '));
const SCAN = `(function(){
  var P=function(c){var m=c&&c.match(/rgba?\\(([^)]+)\\)/);if(!m)return null;var p=m[1].split(/[ ,\\/]+/).filter(Boolean).map(parseFloat);return {r:p[0],g:p[1],b:p[2],a:p.length>3?p[3]:1}};
  var L=function(c){var f=function(v){v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return .2126*f(c.r)+.7152*f(c.g)+.0722*f(c.b)};
  var mix=function(top,bot){var a=top.a;return {r:top.r*a+bot.r*(1-a),g:top.g*a+bot.g*(1-a),b:top.b*a+bot.b*(1-a),a:1}};
  var page=P(getComputedStyle(document.body).getPropertyValue('--bg').trim().replace(/^#(..)(..)(..)$/,function(_,r,g,b){return 'rgb('+parseInt(r,16)+','+parseInt(g,16)+','+parseInt(b,16)+')'}))||P(getComputedStyle(document.body).backgroundColor)||{r:0,g:0,b:0,a:1};
  if(page.a<1)page=mix(page,{r:0,g:0,b:0,a:1});
  /* the colours that can sit behind an element: painted layers from the nearest opaque one up, a gradient counting as each of its stops;
     a picture (url) can't be read as colours, so the text over it is skipped */
  var stops=function(img){return (img.match(/rgba?\\([^)]+\\)/g)||[]).map(P).filter(Boolean)};
  var bgOf=function(el){var layers=[];for(var e=el;e&&e!==document.documentElement;e=e.parentElement){var cs=getComputedStyle(e);
      if(e!==document.body&&cs.backgroundImage&&cs.backgroundImage!=='none'){if(/url\\(/.test(cs.backgroundImage))return null;var g=stops(cs.backgroundImage);if(g.length){layers.push(g);if(g.every(function(s){return s.a>=.99}))break}}
      var c=P(cs.backgroundColor);if(c&&c.a>0){layers.push([c]);if(c.a>=.99)break}}
    var cand=[page];for(var i=layers.length-1;i>=0;i--){var nx=[];layers[i].forEach(function(s){cand.forEach(function(c){nx.push(s.a>=.99?s:mix(s,c))})});cand=nx.slice(0,24)}return cand};
  var fails=[],n=0,min=99,root=document.querySelector('#layer .modal')||document.getElementById('app');
  var walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:function(t){return t.textContent.trim().length>1?1:3}}),t;
  while((t=walker.nextNode())){var el=t.parentElement;if(!el||el.closest('svg,.qs-card .qsimg,.bs-art'))continue;var r=el.getBoundingClientRect();if(!r.width||!r.height||r.bottom<0||r.top>innerHeight*3)continue;
    var cs=getComputedStyle(el);if(cs.visibility==='hidden'||+cs.opacity===0)continue;var fg0=P(cs.color);if(!fg0||fg0.a<.05)continue;var bgs=bgOf(el);if(!bgs)continue;
    var worst=null;bgs.forEach(function(bg){var fg=fg0.a<1?mix(fg0,bg):fg0,l1=L(fg),l2=L(bg),c=(Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05);if(!worst||c<worst.cr)worst={cr:c,bg:bg}});
    var cr=worst.cr,bg=worst.bg,fs=parseFloat(cs.fontSize),bold=+cs.fontWeight>=700,large=fs>=24||(bold&&fs>=18.66),need=large?3:4.5;n++;min=Math.min(min,cr);
    if(cr<need)fails.push({t:t.textContent.trim().slice(0,28),cr:Math.round(cr*100)/100,need:need,fg:cs.color,bg:'rgb('+Math.round(bg.r)+','+Math.round(bg.g)+','+Math.round(bg.b)+')',cls:(el.className||'').toString().slice(0,24)})}
  var rs=getComputedStyle(document.body);return {rank:document.documentElement.getAttribute('data-rank'),view:document.documentElement.getAttribute('data-view'),bg:rs.getPropertyValue('--bg').trim().slice(0,60),surface:rs.getPropertyValue('--surface').trim().slice(0,60),accent:getComputedStyle(document.documentElement).getPropertyValue('--accent').trim(),n:n,min:Math.round(min*100)/100,fails:fails}})()`;
(async () => {
  const br = await browser(); const pg = await br.page({ fresh: true });
  const seed = JSON.parse(fs.readFileSync(SEEDS + 'v88_adv.json', 'utf8'));
  await pg.go(BASE + '/version.json'); await pg.ev(`(function(d){localStorage.clear();Object.keys(d).forEach(function(k){localStorage.setItem(k,d[k])});return 1})(${JSON.stringify(seed)})`);
  await pg.go(BASE + '/'); await pg.wait('!!(window.__qb && document.querySelector(".nav button[data-v=board]"))', 120000); await sleep(3000);
  const clear = () => pg.ev('(function(){document.querySelectorAll(".dropsplash .dsx").forEach(function(b){b.click()});document.querySelectorAll("#layer .modal,.dropsplash").forEach(function(e){e.remove()});return 1})()');
  for (let k = 0; k < 4; k++) { await clear(); await sleep(400); }
  const ranks = await pg.ev(`(function(){var x=window.__qb.x(),S=x.S,g0=S.gates.slice(),o={};for(var n=0;n<=9;n++){S.gates=g0.slice(0,0);for(var i=0;i<n;i++)S.gates.push(i);x.render();var r=document.documentElement.getAttribute('data-rank');if(r&&o[r]==null)o[r]=n}S.gates=g0;x.render();return o})()`);
  log('ranks by gates passed:', ranks);
  const VIEWS = ['board', 'train', 'hideout', 'hall:posts', 'hall:chat', 'hall:style', 'trophy', 'wheel', 'away', 'profile'];
  let total = 0;
  for (const [rank, n] of Object.entries(ranks)) {
    await pg.ev(`(function(){var x=window.__qb.x(),S=x.S;S.gates=[];for(var i=0;i<${n};i++)S.gates.push(i);x.persist();x.render();return 1})()`); await sleep(500);
    for (const v of VIEWS) {
      await clear();
      if (v === 'profile') await pg.ev('(function(){var c=document.querySelector("[data-act=char]");c&&c.click();return 1})()');
      else { const [tab, sub] = v.split(':'); await pg.ev(`(function(){var b=document.querySelector('.nav button[data-v="${tab}"]');b&&b.click();return 1})()`); await sleep(900);
        if (sub) await pg.ev(`(function(){var b=document.querySelector('[data-act=htab][data-t="${sub}"]');b&&b.click();return 1})()`); }
      await sleep(1100); if (v !== 'profile') await clear();
      const r = await pg.ev(SCAN); total += r.fails.length;
      log(`${rank} ${v.padEnd(10)} view=${r.view} bg ${r.bg} surface ${r.surface} accent ${r.accent} | ${r.n} texts, min ${r.min}${r.fails.length ? ' | BELOW AA ' + r.fails.length + ': ' + r.fails.slice(0, 3).map((f) => `"${f.t}" ${f.cr}<${f.need} ${f.fg} on ${f.bg}`).join(' ; ') : ''}`);
      if (rank === 'E' || rank === 'S' || v.startsWith('hall')) await pg.shot(OUT + `${rank}_${v.replace(':', '_')}.png`);
      if (v === 'profile') await clear();
    }
  }
  // a bought theme on top (the accent written inline on <html>)
  const th = await pg.ev(`(function(){var x=window.__qb.x(),S=x.S,t=x.SHOP.filter(function(s){return s[1]==='theme'})[0];if(!t)return null;S.owned[t[0]]=true;S.eq=S.eq||{};S.eq.theme=t[0];x.persist();x.render();return t[0]+' '+t[2]+' | inline: '+document.documentElement.getAttribute('style')})()`);
  log('theme equipped:', th);
  for (const v of ['board', 'hall:posts']) { await clear(); const [tab, sub] = v.split(':'); await pg.ev(`(function(){var b=document.querySelector('.nav button[data-v="${tab}"]');b&&b.click();return 1})()`); await sleep(900);
    if (sub) await pg.ev(`(function(){var b=document.querySelector('[data-act=htab][data-t="${sub}"]');b&&b.click();return 1})()`); await sleep(1000); await clear();
    const r = await pg.ev(SCAN); log(`theme ${v}: accent ${r.accent} | ${r.n} texts, min ${r.min}${r.fails.length ? ' | BELOW AA ' + r.fails.length + ': ' + r.fails.slice(0, 3).map((f) => `"${f.t}" ${f.cr}`).join(' ; ') : ''}`);
    await pg.shot(OUT + `theme_${v.replace(':', '_')}.png`); }
  log(`texts below AA in all: ${total}; page errors ${pg.errs.length} ${pg.errs.slice(0, 2).join(' | ')}`);
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
