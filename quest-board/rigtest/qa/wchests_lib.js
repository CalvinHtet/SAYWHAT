// QA w-chests (83e94fb): shared setup. A fresh player made through the hooks (mkseed.js's adv recipe) or a saved game (SEED).
const fs = require('fs'), path = require('path');
const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8814';
const OUT = process.env.OUT || 'C:/Users/clvh/qa-wt/out/wchests';
fs.mkdirSync(OUT, { recursive: true });
const log = (name) => { const f = path.join(OUT, name + '.log'); fs.writeFileSync(f, ''); return (...a) => { const s = a.map((x) => (typeof x === 'string' ? x : JSON.stringify(x))).join(' '); console.log(s); fs.appendFileSync(f, s + '\n'); }; };

async function open(o = {}) {
  const br = await browser();
  const pg = await br.page({ fresh: true });
  if (o.seed) {
    const d = JSON.parse(fs.readFileSync(o.seed, 'utf8'));
    await pg.go(BASE + '/version.json');
    await pg.ev(`(function(d){localStorage.clear();Object.keys(d).forEach(function(k){localStorage.setItem(k,d[k])});return 1})(${JSON.stringify(d)})`);
  }
  await pg.go(BASE + '/');
  await pg.wait('!!(window.__qb && window.__qb.x && window.__qbFree && document.querySelector("#app"))', 120000);
  await sleep(1500);
  if (!o.seed) {
    await pg.ev(`(function(){const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = Math.max(S.xp || 0, 10);
      S.welcomed = 1; x.persist(); x.render(); return 1 })()`);
    await sleep(800);
    if (o.adv !== false) {
      await pg.ev(`(function(){window.__qbRooms.unlockAll(); const x = window.__qb.x(), S = x.S;
        Object.keys(x.ADDONS).forEach(function(t){ if (S.base.slots.some(function(r){return r&&r.t===t})) window.__qbRooms.all(t, 1) });
        S.xp = x.cum(${o.lv || 60}); let g, n = 0; while ((g = x.gated()) !== null && n++ < 60) S.gates.push(g); S.coins = 100000;
        document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()}); x.persist(); x.render(); return 1 })()`);
    }
    await sleep(2500);
  }
  await closeModals(pg);
  return { br, pg };
}
const closeModals = (pg) => pg.ev('(function(){var n=0;document.querySelectorAll("#layer .modal").forEach(function(e){e.remove();n++});return n})()');
// a screenshot of one element (scrolled into view), clipped to it
async function shotEl(pg, sel, file, pad = 6, clean = false) {
  if (clean) await pg.ev(`(function(){document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});[].forEach.call(document.querySelectorAll('body *'),function(e){if(getComputedStyle(e).position==='fixed'&&!e.closest('#layer .dqc')){e.dataset.qaHid=e.style.visibility||'-';e.style.visibility='hidden'}});return 1})()`);
  const r = await pg.ev(`(function(){var e=document.querySelector(${JSON.stringify(sel)});if(!e)return null;e.scrollIntoView({block:'center'});var b=e.getBoundingClientRect();return {x:b.left+scrollX,y:b.top+scrollY,w:b.width,h:b.height}})()`);
  if (!r) return null;
  await sleep(400);
  const res = await pg.s('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: Math.max(0, r.x - pad), y: Math.max(0, r.y - pad), width: r.w + 2 * pad, height: Math.min(r.h + 2 * pad, 4000), scale: 1 } });
  fs.writeFileSync(path.join(OUT, file), Buffer.from(res.data, 'base64'));
  if (clean) await pg.ev(`(function(){[].forEach.call(document.querySelectorAll('[data-qa-hid]'),function(e){e.style.visibility=e.dataset.qaHid==='-'?'':e.dataset.qaHid;delete e.dataset.qaHid});return 1})()`);
  return file;
}
const nav = (pg, v) => pg.ev(`(function(){document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});var b=document.querySelector('.nav button[data-v="${v}"]')||document.querySelector('[data-act=nav][data-v="${v}"]');if(!b)return false;b.click();return true})()`);
module.exports = { BASE, OUT, open, log, closeModals, shotEl, nav, sleep };
