// Which frame callbacks keep running on an idle screen: counts requestAnimationFrame callers (function name + first 60 chars) over
// SECS seconds. NOFX=1 sets reduced motion first.  BASE=... SEED=... TAB=board bash tools/windows/node.sh rigtest/qa/rafprobe.js
const fs = require('fs');
const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8819', SECS = +(process.env.SECS || 4), TAB = process.env.TAB || 'board';
const SEED = process.env.SEED ? JSON.parse(fs.readFileSync(process.env.SEED, 'utf8')) : null;
(async () => {
  const br = await browser(); const pg = await br.page({ fresh: true });
  if (process.env.NOFX) await pg.s('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await pg.s('Page.addScriptToEvaluateOnNewDocument', { source: `(function(){var C=window.__qaRaf={};var ra=window.requestAnimationFrame;window.requestAnimationFrame=function(f){var k=(f&&f.name||'anon')+': '+String(f).replace(/\s+/g,' ').slice(0,70);C[k]=(C[k]||0)+1;return ra.apply(this,arguments)}})();` });
  if (SEED) { await pg.go(BASE + '/version.json'); await pg.ev(`(function(d){Object.keys(d).forEach(function(k){localStorage.setItem(k,d[k])});return 1})(${JSON.stringify(SEED)})`); }
  await pg.go(BASE + '/'); await pg.wait('!!document.querySelector(".nav button[data-v=board]")', 120000); await sleep(3000);
  await pg.ev(`(function(){document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});var b=document.querySelector('.nav button[data-v="${TAB}"]');b&&b.click();return 1})()`); await sleep(2500);
  await pg.ev('(function(){Object.keys(window.__qaRaf).forEach(function(k){window.__qaRaf[k]=0});return 1})()'); await sleep(SECS * 1000);
  const r = await pg.ev('window.__qaRaf');
  console.log(TAB + (process.env.NOFX ? ' (reduced motion)' : '') + ', rAF calls per second:'); Object.entries(r).filter(([, v]) => v).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log('  ' + (v / SECS).toFixed(1) + '/s  ' + k));
  const anims = await pg.ev('document.getAnimations().filter(function(a){return a.playState==="running"}).map(function(a){var t=a.effect&&a.effect.target;return (a.animationName||a.constructor.name)+" on "+(t?(t.tagName+"."+String(t.className&&t.className.baseVal!==undefined?t.className.baseVal:t.className).split(" ").slice(0,2).join(".")):"?")}).slice(0,12)');
  console.log('running CSS animations: ' + anims.length + (anims.length ? ' e.g. ' + anims.join('; ') : ''));
  console.log('page errors ' + pg.errs.length); await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
