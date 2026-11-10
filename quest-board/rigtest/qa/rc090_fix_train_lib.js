// rc-0.90 QA fixes re-check (copy of rc089_train_lib.js, outputs under rc090/fixes): shared helpers for rc089_train*.js and rc089_inbox*.js. Read only: never changes game files.
const fs = require('fs');
const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8816';
const OUT = process.env.OUT || 'C:/Users/clvh/qa-wt/out/rc090/fixes';
const seed = (name) => JSON.parse(fs.readFileSync('C:/Users/clvh/qa-wt/out/' + name + '.json', 'utf8'));

async function openGame(seedObj, o = {}) {
  const br = await browser();
  const pg = await br.page({ fresh: true });
  if (seedObj) {
    await pg.go(BASE + '/version.json');
    await pg.ev(`(function(d){localStorage.clear();Object.keys(d).forEach(function(k){localStorage.setItem(k,d[k])});return 1})(${JSON.stringify(seedObj)})`);
  }
  await pg.go(BASE + '/');
  await pg.wait(o.waitFor || '!!(window.__qb && window.__qb.x && document.querySelector("#app"))', 120000);
  return { br, pg };
}
const S = (pg, expr) => pg.ev(`(function(){var x=window.__qb.x(),S=x.S;return (${expr})})()`);
const modalInfo = (pg) => pg.ev(`(function(){return [].map.call(document.querySelectorAll('#layer .modal'),function(m){return {cls:m.className,card:(m.firstElementChild||{}).className,text:(m.innerText||'').replace(/\\s+/g,' ').slice(0,260)}})})()`);
const closeAll = (pg) => pg.ev(`(function(){var n=0;document.querySelectorAll('#layer .modal').forEach(function(m){m.remove();n++});return n})()`);
// a real tap (mouse press and release at the element's centre) after scrolling it to the middle of the screen
async function tapEl(pg, sel, i = 0, dx = 0.5, dy = 0.5) {
  const r = await pg.ev(`(function(){var e=document.querySelectorAll(${JSON.stringify(sel)})[${i}];if(!e)return null;e.scrollIntoView({block:'center'});var b=e.getBoundingClientRect();return {x:b.left+b.width*${dx},y:b.top+b.height*${dy},w:b.width,h:b.height}})()`);
  if (!r) throw new Error('no element ' + sel + ' #' + i);
  await sleep(250);
  const r2 = await pg.ev(`(function(){var e=document.querySelectorAll(${JSON.stringify(sel)})[${i}];var b=e.getBoundingClientRect();return {x:b.left+b.width*${dx},y:b.top+b.height*${dy}}})()`);
  await pg.tap(r2.x, r2.y);
  return r2;
}
// screenshot one element (document coordinates), with a margin
async function shotEl(pg, sel, file, i = 0, pad = 6) {
  const r = await pg.ev(`(function(){var e=document.querySelectorAll(${JSON.stringify(sel)})[${i}];if(!e)return null;e.scrollIntoView({block:'center'});var b=e.getBoundingClientRect();return {x:Math.max(0,b.left+scrollX-${pad}),y:Math.max(0,b.top+scrollY-${pad}),width:Math.min(innerWidth,b.width+${2 * pad}),height:b.height+${2 * pad}}})()`);
  if (!r) return null;
  await sleep(200);
  const res = await pg.s('Page.captureScreenshot', { format: 'png', clip: Object.assign({ scale: 1 }, r), captureBeyondViewport: true });
  fs.writeFileSync(file, Buffer.from(res.data, 'base64'));
  return file;
}
const nav = (pg, v) => pg.ev(`(function(){var b=document.querySelector('.nav button[data-v="${v}"]');if(!b)return false;b.click();return true})()`);
const lsSizes = (pg) => pg.ev(`(function(){var o={},t=0;for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i),v=localStorage.getItem(k);t+=k.length+v.length;if(k.indexOf('qbsbx:')!==0)o[k]=v.length}o.__totalChars=t;return o})()`);
// close every window the game opens by itself (class pick, chests, level-ups, the welcome letter ...) until none comes for 2 rounds
async function settle(pg, keep, rounds = 12) {
  const seen = []; let quiet = 0;
  for (let i = 0; i < rounds && quiet < 2; i++) {
    await sleep(3500);
    const m = await modalInfo(pg);
    if (!m.length) { quiet++; continue; }
    quiet = 0; m.forEach((x) => seen.push(x.card + ': ' + x.text.slice(0, 90)));
    if (keep && m.some((x) => keep(x))) return { seen, kept: true };
    await closeAll(pg);
  }
  return { seen, kept: false };
}
module.exports = { BASE, OUT, seed, openGame, S, modalInfo, closeAll, tapEl, shotEl, nav, lsSizes, sleep, settle };
