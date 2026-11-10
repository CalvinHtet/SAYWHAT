// rc-0.89 Hall QA helpers: a fresh phone profile with the advanced seed, the sandbox db, taps by selector.
const fs = require('fs');
const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8811', OUT = 'C:/Users/clvh/qa-wt/out/rc089/hall/';
const SEED = JSON.parse(fs.readFileSync('C:/Users/clvh/qa-wt/out/seed_adv2.json', 'utf8'));
fs.mkdirSync(OUT, { recursive: true });
const log = [];
function say(...a) { const s = a.map((x) => (typeof x === 'string' ? x : JSON.stringify(x))).join(' '); console.log(s); log.push(s); }
async function boot(o = {}) {
  const br = await browser();
  const pg = await br.page({ fresh: true, width: o.width, height: o.height });
  await pg.go(BASE + '/version.json');
  const seed = Object.assign({}, SEED, o.extra || {});
  await pg.ev(`(function(d){localStorage.clear();Object.keys(d).forEach(function(k){localStorage.setItem(k,d[k])});return 1})(${JSON.stringify(seed)})`);
  if (o.pre) await pg.ev(o.pre);
  await pg.go(BASE + '/');
  await pg.wait('!!(document.querySelector(".nav button[data-v=board]") && window.__qb && window.__qbHall)', 120000);
  await sleep(3500);
  await closeModals(pg);
  // story pop-ups (the restaurant, visitors...) come on timers and cover the screen: any modal that is not part of the Hall checks
  // is removed as it appears and logged in window.__qaKilled; pop() toasts are logged in window.__qaPops
  await pg.ev(`(function(){window.__qaKilled=[];window.__qaPops=[];window.__qaModals=[];var keep=/fsh-modal|ibmodal|sq-card|fsh-card|Fashion week/;
    new MutationObserver(function(ms){ms.forEach(function(r){r.addedNodes.forEach(function(n){if(!n.classList)return;
      if(n.classList.contains("pop")){window.__qaPops.push(n.textContent);return}
      if(n.classList.contains("modal")){var s=n.className+" "+n.innerHTML.slice(0,4000);window.__qaModals.push((n.innerText||"").slice(0,120));if(!keep.test(s)&&!window.__qaKeepAll){window.__qaKilled.push((n.innerText||"").slice(0,60));n.remove()}}})})}).observe(document.getElementById("layer"),{childList:true});return 1})()`);
  return { br, pg };
}
const closeModals = (pg) => pg.ev('(function(){var n=document.querySelectorAll("#layer .modal").length;document.querySelectorAll("#layer .modal").forEach(function(e){e.remove()});return n})()');
// a sandbox db write that tells the live listeners (as another player's phone would)
const put = (pg, path, doc) => pg.ev(`window.claude.use("db").then(function(db){return db.doc(${JSON.stringify(path)}).set(${JSON.stringify(doc)})}).then(function(){return 1})`);
const get = (pg, path) => pg.ev(`JSON.parse(localStorage.getItem("qbsbx:"+${JSON.stringify(path)})||"null")`);
// click the element matching sel (and optional text) by its centre, as a finger
async function tapSel(pg, sel, text) {
  const r = await pg.ev(`(function(){var a=[].slice.call(document.querySelectorAll(${JSON.stringify(sel)}));${text ? `a=a.filter(function(e){return (e.innerText||"").indexOf(${JSON.stringify(text)})>=0});` : ''}
    var e=a[0];if(!e)return null;e.scrollIntoView({block:"center"});var b=e.getBoundingClientRect();return {x:b.left+b.width/2,y:b.top+b.height/2}})()`);
  if (!r) return false;
  await sleep(150);
  await pg.tap(r.x, r.y);
  await sleep(500);
  return true;
}
async function hall(pg, tab) {
  await pg.ev('(function(){var b=document.querySelector(".nav button[data-v=hall]");if(b)b.click();return !!b})()');
  await sleep(1200);
  if (tab) { await pg.ev(`(function(){var b=document.querySelector('[data-act=htab][data-t="${tab}"]');if(b)b.click();return !!b})()`); await sleep(1000); }
}
const shift = (pg, ms) => pg.ev(`(function(){window.__qbShift=${ms};return new Date().toString()})()`);
function save(name) { fs.writeFileSync(OUT + name, log.join('\n') + '\n'); }
module.exports = { BASE, OUT, boot, closeModals, put, get, tapSel, hall, shift, say, save, sleep };
